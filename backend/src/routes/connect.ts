import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Profile } from '../../types/database.types'
import { isEnum, cleanText, escapeLike, VALID_POSITIONS, VALID_SKILLS } from '../lib/validate'

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { position, skills, search } = req.query as { position?: string; skills?: string; search?: string }

  // Validate optional query params
  if (position !== undefined && !isEnum(position, VALID_POSITIONS)) {
    res.status(400).json({ error: 'Invalid position filter' })
    return
  }

  const cleanSearch = cleanText(search, 100)
  if (cleanSearch === null) {
    res.status(400).json({ error: 'Search term must be at most 100 characters' })
    return
  }

  if (skills !== undefined) {
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)
    if (skillList.some(s => !isEnum(s, VALID_SKILLS))) {
      res.status(400).json({ error: 'Invalid skill filter value' })
      return
    }
  }

  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', req.userId!)
    .not('name', 'is', null)

  if (position) {
    query = query.eq('position', position)
  }

  if (cleanSearch) {
    query = query.ilike('name', `%${escapeLike(cleanSearch)}%`)
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
