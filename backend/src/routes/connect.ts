import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Profile } from '../../types/database.types'

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { position, skills, search } = req.query as { position?: string; skills?: string; search?: string }

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', req.userId!)
    .not('name', 'is', null)

  if (position) {
    query = query.eq('position', position)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  let results: Profile[] = data ?? []

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
