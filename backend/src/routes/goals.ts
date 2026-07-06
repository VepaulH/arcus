import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import { GOAL_SEEDS, DEFAULT_GOALS } from '../lib/goals'
import { isUUID } from '../lib/validate'

type GoalRow = {
  id: string
  title: string
  current_count: number
  target: number
  unit: string
}

function toClient(g: GoalRow) {
  return { id: g.id, title: g.title, current: g.current_count, target: g.target, unit: g.unit }
}

const db = supabase as any

const router = Router()

// GET — current user's goals, auto-seeding from profile if none exist yet
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  const { data, error } = await db
    .from('weekly_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at')

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  if (!data || data.length === 0) {
    const { data: onboarding } = await db
      .from('onboarding_data')
      .select('roadmap_id')
      .eq('user_id', userId)
      .maybeSingle()

    const seeds = GOAL_SEEDS[onboarding?.roadmap_id ?? ''] ?? DEFAULT_GOALS
    const rows = seeds.map((g: typeof seeds[0]) => ({
      user_id: userId,
      title: g.title,
      current_count: 0,
      target: g.target,
      unit: g.unit,
    }))

    const { data: seeded, error: seedError } = await db
      .from('weekly_goals')
      .insert(rows)
      .select()

    if (seedError) {
      res.status(500).json({ error: seedError.message })
      return
    }

    res.json((seeded as GoalRow[]).map(toClient))
    return
  }

  res.json((data as GoalRow[]).map(toClient))
})

// POST /:id/increment — only allowed mutation: add 1 to current_count
router.post('/:id/increment', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { id } = req.params

  if (!isUUID(id)) {
    res.status(400).json({ error: 'Invalid goal id' })
    return
  }

  const { data: existing, error: fetchError } = await db
    .from('weekly_goals')
    .select('current_count, target')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (fetchError || !existing) {
    res.status(404).json({ error: 'Goal not found' })
    return
  }

  const { data, error } = await db
    .from('weekly_goals')
    .update({ current_count: existing.current_count + 1, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error || !data) {
    res.status(500).json({ error: error?.message ?? 'Update failed' })
    return
  }

  res.json(toClient(data as GoalRow))
})

// POST /:id/decrement — subtract 1, floor at 0
router.post('/:id/decrement', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { id } = req.params

  if (!isUUID(id)) {
    res.status(400).json({ error: 'Invalid goal id' })
    return
  }

  const { data: existing, error: fetchError } = await db
    .from('weekly_goals')
    .select('current_count')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (fetchError || !existing) {
    res.status(404).json({ error: 'Goal not found' })
    return
  }

  const newCount = Math.max(0, existing.current_count - 1)

  const { data, error } = await db
    .from('weekly_goals')
    .update({ current_count: newCount, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error || !data) {
    res.status(500).json({ error: error?.message ?? 'Update failed' })
    return
  }

  res.json(toClient(data as GoalRow))
})

export default router
