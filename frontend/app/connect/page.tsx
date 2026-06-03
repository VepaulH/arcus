'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { connectApi } from '../../lib/api'
import type { Profile } from '../../../backend/types/database.types'

const POSITIONS = ['Founder', 'Co-founder', 'Employee', 'Mentor', 'Advisor', 'Investor']

const SKILLS = [
  'Frontend', 'Backend', 'Mobile', 'AWS', 'DevOps',
  'ML / AI', 'Product Design', 'React', 'Python', 'Go',
  'Marketing', 'Sales', 'Growth', 'Fundraising', 'Strategy',
]

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-blue-600',
  'from-sky-500 to-blue-600',
  'from-blue-400 to-indigo-600',
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function ConnectPage() {
  const { loading: authLoading } = useAuth()

  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [results, setResults] = useState<Profile[]>([])
  const [selectedPosition, setSelectedPosition] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    connectApi.getUsers().then(({ data, error }) => {
      if (error) {
        setFetchError(error)
      } else {
        const users = data ?? []
        setAllUsers(users)
        setResults(users)
      }
      setFetching(false)
    })
  }, [authLoading])

  function toggleSkill(skill: string) {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  function handleSearch() {
    let filtered = allUsers
    if (selectedPosition) {
      filtered = filtered.filter(u => u.position === selectedPosition)
    }
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(u =>
        selectedSkills.some(s => u.skills?.includes(s))
      )
    }
    setResults(filtered)
  }

  function handleReset() {
    setSelectedPosition('')
    setSelectedSkills([])
    setResults(allUsers)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-blue-300 uppercase border border-blue-400/20 rounded-full bg-blue-400/5">
          Community
        </div>
        <h1 className="text-5xl font-bold mb-4 leading-tight bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Connect
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          Find your co-founder, hire your first employee, or get guidance from
          a mentor who&apos;s been in your shoes.
        </p>
      </div>

      {/* Discord card */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-400/20 flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-1">Arcus Discord Community</h2>
            <p className="text-slate-500 text-sm max-w-md">
              Connect in real time. Share ideas, ask questions, and meet fellow
              student founders in our Discord server.
            </p>
          </div>
        </div>
        <a
          href="https://discord.gg/b6zbW5yK"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          Join Server
        </a>
      </div>

      {/* Matchmaking filters */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8 mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Find Your Match</h2>
        <p className="text-slate-500 text-sm mb-8">
          Filter by the role you&apos;re looking for and the skills you need.
        </p>

        {/* Position filter */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Position
          </label>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map(pos => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(selectedPosition === pos ? '' : pos)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                  selectedPosition === pos
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Skills filter */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Skills Required
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-600/30 border-blue-400/50 text-blue-200'
                    : 'bg-white/5 border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            Find Matches
          </button>
          {(selectedPosition || selectedSkills.length > 0) && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              Reset filters
            </button>
          )}
          <span className="text-xs text-slate-600 ml-auto">
            {fetching ? 'Loading…' : `${results.length} ${results.length === 1 ? 'person' : 'people'} found`}
          </span>
        </div>
      </div>

      {/* Results */}
      {fetchError ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-16 text-center">
          <p className="text-red-400 text-sm">{fetchError}</p>
        </div>
      ) : fetching ? (
        <div className="rounded-2xl border border-white/8 bg-white/5 p-16 text-center">
          <p className="text-slate-500 text-sm">Loading members…</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((user, i) => {
            const name = user.name ?? 'Anonymous'
            return (
              <div
                key={user.id}
                className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-sm font-bold">{getInitials(name)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{name}</p>
                    <p className="text-xs text-slate-500">{user.university ?? ''}</p>
                  </div>
                  {user.position && (
                    <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
                      {user.position}
                    </span>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-xs text-slate-500 leading-relaxed">{user.bio}</p>
                )}

                {/* Skills */}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map(skill => (
                      <span
                        key={skill}
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-600/20 border-blue-400/30 text-blue-300'
                            : 'bg-white/5 border-white/8 text-slate-500'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Connect button */}
                <button className="mt-auto w-full py-2 text-sm font-semibold text-blue-300 border border-blue-400/20 rounded-lg bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-400/40 transition-colors">
                  Connect
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 bg-white/5 p-16 text-center">
          <p className="text-slate-500 text-sm">No members found for the selected filters.</p>
          {(selectedPosition || selectedSkills.length > 0) && (
            <button onClick={handleReset} className="mt-4 text-blue-400 text-sm hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}

    </div>
  )
}
