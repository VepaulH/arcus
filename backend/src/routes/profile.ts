import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.userId!)
    .single()

  if (error) {
    res.status(404).json({ error: 'Profile not found' })
    return
  }

  res.json(data)
})

router.put('/', requireAuth, async (req: AuthRequest, res) => {
  const { name, email, university, bio, position, skills, startup_stage, experience } = req.body as {
    name?: string
    email?: string
    university?: string
    bio?: string
    position?: string
    skills?: string[]
    startup_stage?: string
    experience?: string
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: req.userId!,
      name,
      email,
      university,
      bio,
      position,
      skills,
      startup_stage,
      experience,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json(data)
})

export default router
