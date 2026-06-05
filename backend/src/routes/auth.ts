import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import { isEmail, cleanText } from '../lib/validate'

const router = Router()

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body as { email: unknown; password: unknown; name: unknown }

  if (!isEmail(email)) {
    res.status(400).json({ error: 'A valid email address is required' })
    return
  }
  if (typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' })
    return
  }

  const cleanName = cleanText(name, 100)
  if (cleanName === null) {
    res.status(400).json({ error: 'Name must be at most 100 characters' })
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: cleanName || email.split('@')[0] } },
  })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.status(201).json({
    user: data.user,
    session: data.session,
    requiresConfirmation: !data.session,
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: unknown; password: unknown }

  if (!isEmail(email)) {
    res.status(400).json({ error: 'A valid email address is required' })
    return
  }
  if (typeof password !== 'string' || !password) {
    res.status(400).json({ error: 'Password is required' })
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

router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body as { refresh_token?: unknown }

  if (typeof refresh_token !== 'string' || !refresh_token) {
    res.status(400).json({ error: 'refresh_token is required' })
    return
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token })

  if (error || !data.session) {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
    return
  }

  res.json({
    access_token:  data.session.access_token,
    refresh_token: data.session.refresh_token,
  })
})

router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  await supabase.auth.admin.signOut(req.userId!)
  res.json({ success: true })
})

router.delete('/account', requireAuth, async (req: AuthRequest, res) => {
  const { error } = await supabase.auth.admin.deleteUser(req.userId!)
  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
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
