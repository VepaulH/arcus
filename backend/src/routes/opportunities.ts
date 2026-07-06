import { Router } from 'express'
import { supabase } from '../lib/supabase'
import { requireAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Opportunity } from '../../types/database.types'
import { fetchLiveOpportunities } from '../lib/opportunities'

const router = Router()

// GET — current opportunity list, most recently fetched first
router.get('/', requireAuth, async (_req: AuthRequest, res) => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('fetched_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json((data ?? []) as Opportunity[])
})

// POST /refresh — re-runs the live web search and replaces the stored list.
// Not user-facing: called by the weekly GitHub Actions cron job with a shared secret.
router.post('/refresh', async (req, res) => {
  const secret = req.headers['x-refresh-secret']
  if (!process.env.OPPORTUNITIES_REFRESH_SECRET || secret !== process.env.OPPORTUNITIES_REFRESH_SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const fetched = await fetchLiveOpportunities()

    if (fetched.length === 0) {
      res.status(502).json({ error: 'No opportunities returned from search' })
      return
    }

    const db = supabase as any
    await db.from('opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { error: insertError } = await db.from('opportunities').insert(
      fetched.map(o => ({
        title: o.title,
        type: o.type,
        url: o.url,
        description: o.description,
        deadline: o.deadline,
        source: o.source,
        fetched_at: new Date().toISOString(),
      }))
    )

    if (insertError) {
      res.status(500).json({ error: insertError.message })
      return
    }

    res.json({ success: true, count: fetched.length })
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : 'Refresh failed' })
  }
})

export default router
