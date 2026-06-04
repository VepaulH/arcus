'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { connectionsApi } from '../../lib/api'
import type { ConnectedUser } from '../../lib/api'

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-blue-600',
  'from-sky-500 to-blue-600',
  'from-blue-400 to-indigo-600',
]

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase()
}

export default function ConnectionsPage() {
  const { loading: authLoading, isLoggedIn } = useAuth()
  const [connections, setConnections] = useState<ConnectedUser[]>([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) { setFetching(false); return }
    connectionsApi.getList().then(({ data, error }) => {
      if (error) setFetchError(error)
      else setConnections(data ?? [])
      setFetching(false)
    })
  }, [authLoading, isLoggedIn])

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm">Loading connections…</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/profile"
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          ← Profile
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Your Connections</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {connections.length === 0
              ? 'No connections yet'
              : `${connections.length} ${connections.length === 1 ? 'person' : 'people'}`}
          </p>
        </div>
      </div>

      {fetchError ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-12 text-center">
          <p className="text-red-400 text-sm">{fetchError}</p>
        </div>
      ) : connections.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/5 p-16 text-center">
          <p className="text-slate-500 text-sm mb-3">You haven&apos;t connected with anyone yet.</p>
          <Link href="/connect" className="text-blue-400 text-sm hover:underline">
            Find people to connect with →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {connections.map((c, i) => {
            const name = c.profile?.name ?? 'Unknown'
            return (
              <div
                key={c.connection_id}
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm px-6 py-4 hover:bg-white/8 transition-colors"
              >
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-bold">{getInitials(name)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100">{name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {[c.profile?.position, c.profile?.university].filter(Boolean).join(' · ')}
                  </p>
                  {c.profile?.bio && (
                    <p className="text-xs text-slate-600 mt-0.5 truncate">{c.profile.bio}</p>
                  )}
                </div>

                {c.profile?.skills && c.profile.skills.length > 0 && (
                  <div className="hidden sm:flex flex-wrap gap-1.5 max-w-[200px] justify-end">
                    {c.profile.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-500">
                        {skill}
                      </span>
                    ))}
                    {c.profile.skills.length > 3 && (
                      <span className="text-xs text-slate-600">+{c.profile.skills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
