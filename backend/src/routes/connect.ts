import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { position, skills } = req.query as { position?: string; skills?: string }

  // Fetch all profiles except the requesting user, excluding rows with no name
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', req.userId!)
    .not('name', 'is', null)

  if (position) {
    query = query.eq('position', position)
  }

  const { data, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  let results = data ?? []

  // Skill filter is applied in-process (array overlap)
  if (skills) {
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)
    if (skillList.length > 0) {
      results = results.filter(user =>
        skillList.some(skill => user.skills?.includes(skill))
      )
    }
  }

  res.json(results)
})

export default router
