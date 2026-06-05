import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import { computeRoadmapId, ROADMAP_INITIAL_NODES } from '../lib/roadmaps'
import { GOAL_SEEDS, DEFAULT_GOALS } from '../lib/goals'
import {
  isEnum, isSkillsArray, isProgress, cleanText,
  VALID_STARTUP_STAGES, VALID_POSITIONS, VALID_REVENUE_RANGES,
  VALID_LOOKING_FOR, VALID_EXPERIENCE, VALID_REFERRAL, VALID_NODE_STATUS,
} from '../lib/validate'

const router = Router()

// GET — return this user's onboarding data (roadmap_id + revenue/looking_for answers)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  const { data, error } = await supabase
    .from('onboarding_data')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data ?? null)
})

// POST — save onboarding answers, compute roadmap, seed progress
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const b = req.body as Record<string, unknown>

  // Enum fields
  if (!isEnum(b.startup_stage, VALID_STARTUP_STAGES)) { res.status(400).json({ error: 'Invalid startup_stage' });  return }
  if (!isEnum(b.position,      VALID_POSITIONS))      { res.status(400).json({ error: 'Invalid position' });       return }
  if (!isEnum(b.revenue_range, VALID_REVENUE_RANGES)) { res.status(400).json({ error: 'Invalid revenue_range' });  return }
  if (!isEnum(b.looking_for,   VALID_LOOKING_FOR))    { res.status(400).json({ error: 'Invalid looking_for' });    return }
  if (!isEnum(b.experience,    VALID_EXPERIENCE))     { res.status(400).json({ error: 'Invalid experience' });     return }
  if (!isSkillsArray(b.skills))                       { res.status(400).json({ error: 'Invalid skills array' });   return }

  if (b.referral_source !== undefined && b.referral_source !== null &&
      !isEnum(b.referral_source, VALID_REFERRAL)) {
    res.status(400).json({ error: 'Invalid referral_source' })
    return
  }

  // Free-text fields
  const bio        = cleanText(b.bio,        500)
  const university = cleanText(b.university, 150)
  if (bio === null)        { res.status(400).json({ error: 'Bio must be at most 500 characters' });        return }
  if (university === null) { res.status(400).json({ error: 'University must be at most 150 characters' }); return }

  const startup_stage   = b.startup_stage   as string
  const position        = b.position        as string
  const revenue_range   = b.revenue_range   as string
  const looking_for     = b.looking_for     as string
  const skills          = b.skills          as string[]
  const experience      = b.experience      as string
  const referral_source = (b.referral_source as string | undefined) ?? null

  // 1. Compute roadmap
  const roadmap_id = computeRoadmapId({ startup_stage, position, revenue_range, looking_for, skills, experience })

  // 2. Update only the survey-derived profile fields — never touch name or email
  const profileUpdate: Record<string, unknown> = {
    startup_stage,
    position,
    skills,
    experience,
    updated_at: new Date().toISOString(),
  }
  if (university) profileUpdate.university = university
  if (bio)        profileUpdate.bio        = bio

  await (supabase.from('profiles') as any)
    .update(profileUpdate)
    .eq('id', userId)

  // 3. Upsert onboarding_data
  const { error: onboardingError } = await supabase
    .from('onboarding_data')
    .upsert({
      user_id: userId,
      revenue_range,
      looking_for,
      referral_source,
      roadmap_id,
      updated_at: new Date().toISOString(),
    } as any, { onConflict: 'user_id' })

  if (onboardingError) {
    res.status(500).json({ error: onboardingError.message })
    return
  }

  // 4. Seed roadmap_progress (only if no existing progress for this user)
  const { data: existingProgress } = await supabase
    .from('roadmap_progress')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (!existingProgress || existingProgress.length === 0) {
    const initialNodes = ROADMAP_INITIAL_NODES[roadmap_id]
    const progressRows = initialNodes.map(n => ({
      user_id:  userId,
      node_id:  n.id,
      status:   n.status,
      progress: 0,
    }))
    await supabase.from('roadmap_progress').insert(progressRows as any)
  }

  // 5. Seed weekly_goals (only if none exist yet)
  const { data: existingGoals } = await supabase
    .from('weekly_goals')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (!existingGoals || existingGoals.length === 0) {
    const seeds = GOAL_SEEDS[roadmap_id] ?? DEFAULT_GOALS
    const goalRows = seeds.map(g => ({
      user_id:       userId,
      title:         g.title,
      current_count: 0,
      target:        g.target,
      unit:          g.unit,
    }))
    await supabase.from('weekly_goals').insert(goalRows as any)
  }

  res.json({ roadmap_id })
})

// GET roadmap progress for the current user
router.get('/progress', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  let { data: onboarding } = await supabase
    .from('onboarding_data')
    .select('roadmap_id')
    .eq('user_id', userId)
    .maybeSingle()

  // Backfill: users who completed onboarding before the roadmap feature was added
  // have profile data but no onboarding_data row. Compute and seed on first access.
  if (!(onboarding as any)?.roadmap_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('startup_stage, position, skills, experience')
      .eq('id', userId)
      .maybeSingle()

    if ((profile as any)?.startup_stage && (profile as any)?.position) {
      const roadmap_id = computeRoadmapId({
        startup_stage: (profile as any).startup_stage,
        position:      (profile as any).position,
        revenue_range: '',
        looking_for:   '',
        skills:        (profile as any).skills ?? [],
        experience:    (profile as any).experience ?? '',
      })

      await supabase
        .from('onboarding_data')
        .upsert({ user_id: userId, roadmap_id, updated_at: new Date().toISOString() } as any, { onConflict: 'user_id' })

      onboarding = { roadmap_id } as any

      const { data: existingProgress } = await supabase
        .from('roadmap_progress')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (!existingProgress || existingProgress.length === 0) {
        const initialNodes = ROADMAP_INITIAL_NODES[roadmap_id]
        const progressRows = initialNodes.map(n => ({
          user_id:  userId,
          node_id:  n.id,
          status:   n.status,
          progress: 0,
        }))
        await supabase.from('roadmap_progress').insert(progressRows as any)
      }
    }
  }

  const { data: progress, error } = await supabase
    .from('roadmap_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json({
    roadmap_id: (onboarding as any)?.roadmap_id ?? null,
    progress:   progress ?? [],
  })
})

// PATCH a single node's progress
router.patch('/progress/:nodeId', requireAuth, async (req: AuthRequest, res) => {
  const userId   = req.userId!
  const { nodeId } = req.params
  const b        = req.body as Record<string, unknown>

  if (!nodeId || typeof nodeId !== 'string' || nodeId.length > 100) {
    res.status(400).json({ error: 'Invalid nodeId' })
    return
  }

  if (b.status !== undefined && !isEnum(b.status, VALID_NODE_STATUS)) {
    res.status(400).json({ error: 'Invalid status value' })
    return
  }

  if (b.progress !== undefined && !isProgress(b.progress)) {
    res.status(400).json({ error: 'Progress must be an integer between 0 and 100' })
    return
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (b.status   !== undefined) update.status   = b.status
  if (b.progress !== undefined) update.progress = b.progress

  const { data, error } = await (supabase.from('roadmap_progress') as any)
    .update(update)
    .eq('user_id', userId)
    .eq('node_id', nodeId)
    .select()
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Node not found' })
    return
  }

  res.json(data)
})

export default router
