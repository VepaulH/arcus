import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import { computeRoadmapId, ROADMAP_INITIAL_NODES } from '../lib/roadmaps'

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

  const {
    startup_stage,
    position,
    revenue_range,
    looking_for,
    skills,
    experience,
    university,
    bio,
    referral_source,
  } = req.body as {
    startup_stage: string
    position: string
    revenue_range: string
    looking_for: string
    skills: string[]
    experience: string
    university?: string
    bio?: string
    referral_source?: string
  }

  // 1. Compute roadmap
  const roadmap_id = computeRoadmapId({ startup_stage, position, revenue_range, looking_for, skills, experience })

  // 2. Upsert profile fields
  await supabase
    .from('profiles')
    .upsert({
      id: userId,
      startup_stage,
      position,
      skills,
      experience,
      ...(university ? { university } : {}),
      ...(bio ? { bio } : {}),
      updated_at: new Date().toISOString(),
    })

  // 3. Upsert onboarding_data
  const { error: onboardingError } = await supabase
    .from('onboarding_data')
    .upsert({
      user_id: userId,
      revenue_range,
      looking_for,
      referral_source: referral_source ?? null,
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
    const rows = initialNodes.map(n => ({
      user_id: userId,
      node_id: n.id,
      status: n.status,
      progress: 0,
    }))

    await supabase.from('roadmap_progress').insert(rows as any)
  }

  res.json({ roadmap_id })
})

// GET roadmap progress for the current user
router.get('/progress', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  const { data: onboarding } = await supabase
    .from('onboarding_data')
    .select('roadmap_id')
    .eq('user_id', userId)
    .maybeSingle()

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
    progress: progress ?? [],
  })
})

// PATCH a single node's progress
router.patch('/progress/:nodeId', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { nodeId } = req.params
  const { status, progress } = req.body as { status?: string; progress?: number }

  const { data, error } = await supabase
    .from('roadmap_progress')
    .update({ ...(status ? { status } : {}), ...(progress !== undefined ? { progress } : {}), updated_at: new Date().toISOString() } as any)
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
