import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import {
  isEmail, isEnum, isSkillsArray, cleanText,
  VALID_POSITIONS, VALID_STARTUP_STAGES, VALID_EXPERIENCE,
} from '../lib/validate'

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
  const b = req.body as Record<string, unknown>

  // Text fields — trim and enforce length limits
  const name       = cleanText(b.name,       100, 1)
  const university = cleanText(b.university, 150)
  const bio        = cleanText(b.bio,        500)

  if (name === null)       { res.status(400).json({ error: 'Name must be between 1 and 100 characters' });        return }
  if (university === null) { res.status(400).json({ error: 'University must be at most 150 characters' });        return }
  if (bio === null)        { res.status(400).json({ error: 'Bio must be at most 500 characters' });               return }

  // Email changes must go through Supabase Auth (enforces uniqueness and sends a
  // confirmation email to the new address) — never write directly to profiles.email.
  if (b.email !== undefined) {
    res.status(400).json({ error: 'Email cannot be changed here. Use the email change endpoint.' })
    return
  }

  // Enum fields — must be from the allowed set if provided
  if (b.position      !== undefined && !isEnum(b.position,      VALID_POSITIONS))      { res.status(400).json({ error: 'Invalid position value' });      return }
  if (b.startup_stage !== undefined && !isEnum(b.startup_stage, VALID_STARTUP_STAGES)) { res.status(400).json({ error: 'Invalid startup stage value' }); return }
  if (b.experience    !== undefined && !isEnum(b.experience,    VALID_EXPERIENCE))     { res.status(400).json({ error: 'Invalid experience value' });    return }

  // Skills array — every item must be a recognised skill
  if (b.skills !== undefined && !isSkillsArray(b.skills)) {
    res.status(400).json({ error: 'Skills must be a list of recognised values (max 15)' })
    return
  }

  const { data, error } = await (supabase.from('profiles') as any)
    .upsert({
      id:            req.userId!,
      name:          name || undefined,
      university:    university || undefined,
      bio:           bio || undefined,
      position:      b.position,
      skills:        b.skills,
      startup_stage: b.startup_stage,
      experience:    b.experience,
      updated_at:    new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json(data)
})

// Change account email — sends a confirmation link to the new address via Supabase Auth.
// profiles.email is kept in sync separately once the change is confirmed (see auth webhook/trigger).
router.post('/email', requireAuth, async (req: AuthRequest, res) => {
  const { email } = req.body as { email: unknown }

  if (!isEmail(email)) {
    res.status(400).json({ error: 'A valid email address is required' })
    return
  }

  const { error } = await supabase.auth.admin.updateUserById(req.userId!, { email })

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }

  res.json({ success: true, message: 'Confirmation email sent to the new address.' })
})

export default router
