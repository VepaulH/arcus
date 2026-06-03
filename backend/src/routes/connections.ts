import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Connection, IncomingRequest } from '../../types/database.types'

const router = Router()

// All connections for the current user (used to derive per-card status)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .neq('status', 'declined')

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json((data ?? []) as Connection[])
})

// Incoming pending requests with requester profile data
router.get('/requests', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  const { data: pending, error: connError } = await supabase
    .from('connections')
    .select('*')
    .eq('addressee_id', userId)
    .eq('status', 'pending')

  if (connError) {
    res.status(500).json({ error: connError.message })
    return
  }
  if (!pending || pending.length === 0) {
    res.json([])
    return
  }

  const requesterIds = pending.map((c: Connection) => c.requester_id)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', requesterIds)

  if (profileError) {
    res.status(500).json({ error: profileError.message })
    return
  }

  const profileMap = Object.fromEntries((profiles ?? []).map((p: { id: string }) => [p.id, p]))
  const result: IncomingRequest[] = pending.map((c: Connection) => ({
    ...c,
    requester: profileMap[c.requester_id] ?? null,
  }))

  res.json(result)
})

// Connection count for the current user
router.get('/count', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { count, error } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .eq('status', 'accepted')

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json({ count: count ?? 0 })
})

// Send a connection request
router.post('/request', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { addresseeId } = req.body as { addresseeId: string }

  if (!addresseeId) {
    res.status(400).json({ error: 'addresseeId is required' })
    return
  }
  if (addresseeId === userId) {
    res.status(400).json({ error: 'Cannot connect with yourself' })
    return
  }

  const { data, error } = await supabase
    .from('connections')
    .insert({ requester_id: userId, addressee_id: addresseeId })
    .select()
    .single()

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.status(201).json(data as Connection)
})

// Accept a connection request (only the addressee can accept)
router.post('/:id/accept', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { id } = req.params

  const { data, error } = await supabase
    .from('connections')
    .update({ status: 'accepted' })
    .eq('id', id)
    .eq('addressee_id', userId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Request not found or cannot be accepted' })
    return
  }
  res.json(data as Connection)
})

// Decline a connection request
router.post('/:id/decline', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { id } = req.params

  const { data, error } = await supabase
    .from('connections')
    .update({ status: 'declined' })
    .eq('id', id)
    .eq('addressee_id', userId)
    .eq('status', 'pending')
    .select()
    .single()

  if (error || !data) {
    res.status(404).json({ error: 'Request not found' })
    return
  }
  res.json(data as Connection)
})

export default router
