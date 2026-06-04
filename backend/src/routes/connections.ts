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

  const profileMap = Object.fromEntries(((profiles ?? []) as import('../../types/database.types').Profile[]).map(p => [p.id, p]))
  const result = pending.map((c: Connection) => ({
    ...c,
    requester: profileMap[c.requester_id] ?? null,
  })) as IncomingRequest[]

  res.json(result)
})

// Accepted connections where I was the requester — used for "X accepted your request" notifications
router.get('/accepted-outgoing', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  const { data: accepted, error: connError } = await supabase
    .from('connections')
    .select('*')
    .eq('requester_id', userId)
    .eq('status', 'accepted')

  if (connError) {
    res.status(500).json({ error: connError.message })
    return
  }
  if (!accepted || accepted.length === 0) {
    res.json([])
    return
  }

  const addresseeIds = (accepted as Connection[]).map(c => c.addressee_id)
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', addresseeIds)

  if (profileError) {
    res.status(500).json({ error: profileError.message })
    return
  }

  const profileMap = Object.fromEntries(
    ((profiles ?? []) as import('../../types/database.types').Profile[]).map(p => [p.id, p])
  )
  const result = (accepted as Connection[]).map(c => ({
    ...c,
    acceptee: profileMap[c.addressee_id] ?? null,
  }))

  res.json(result)
})

// All accepted connections with the other person's profile
router.get('/list', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!

  const { data: conns, error: connError } = await supabase
    .from('connections')
    .select('*')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .eq('status', 'accepted')

  if (connError) {
    res.status(500).json({ error: connError.message })
    return
  }
  if (!conns || conns.length === 0) {
    res.json([])
    return
  }

  const typedConns = conns as Connection[]
  const otherIds = typedConns.map(c => c.requester_id === userId ? c.addressee_id : c.requester_id)

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', otherIds)

  if (profileError) {
    res.status(500).json({ error: profileError.message })
    return
  }

  const profileMap = Object.fromEntries(
    ((profiles ?? []) as import('../../types/database.types').Profile[]).map(p => [p.id, p])
  )

  const result = typedConns.map(c => ({
    connection_id: c.id,
    connected_at: c.created_at,
    profile: profileMap[c.requester_id === userId ? c.addressee_id : c.requester_id] ?? null,
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

  // Check both directions so A→B and B→A are treated as the same pair
  const { data: existing } = await supabase
    .from('connections')
    .select('id, status')
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${addresseeId}),` +
      `and(requester_id.eq.${addresseeId},addressee_id.eq.${userId})`
    )
    .maybeSingle()

  if (existing) {
    res.status(400).json({ error: 'A connection or request already exists between these users' })
    return
  }

  const { data, error } = await supabase
    .from('connections')
    .insert({ requester_id: userId, addressee_id: addresseeId } as any)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('connections') as any)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('connections') as any)
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

// Remove a connection (either party can disconnect)
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const { id } = req.params

  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', id)
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)

  if (error) {
    res.status(400).json({ error: error.message })
    return
  }
  res.json({ success: true })
})

export default router
