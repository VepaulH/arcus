import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body as { email: string; password: string; name?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name ?? email.split('@')[0] } },
  })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.status(201).json({
    user: data.user,
    session: data.session,
    // session is null when email confirmation is required
    requiresConfirmation: !data.session,
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    res.status(401).json({ error: error.message })
    return
  }

  res.json({
    session: data.session,
    user: data.user,
    username: (data.user.user_metadata?.name as string | undefined) ?? data.user.email?.split('@')[0] ?? '',
  })
})

router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  await supabase.auth.admin.signOut(req.userId!)
  res.json({ success: true })
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const { data, error } = await supabase.auth.admin.getUserById(req.userId!)
  if (error) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  res.json({ user: data.user })
})

export default router
