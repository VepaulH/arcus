'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { profileApi, connectionsApi } from '../../lib/api'
import type { IncomingRequest, AcceptedOutgoing } from '../../lib/api'

const SKILLS = [
  'Frontend', 'Backend', 'Mobile', 'AWS', 'DevOps',
  'ML / AI', 'Product Design', 'React', 'Python', 'Go',
  'Marketing', 'Sales', 'Growth', 'Fundraising', 'Strategy',
]

const POSITIONS = ['Founder', 'Co-founder', 'Employee', 'Mentor', 'Advisor', 'Investor']

const STARTUP_STAGES = ['Ideation', 'Validation', 'Building', 'Launch', 'Growth']

const EXPERIENCE_LEVELS = ['Student', '0–1 years', '1–3 years', '3–5 years', '5+ years']

interface ProfileData {
  name: string
  email: string
  university: string
  bio: string
  position: string
  skills: string[]
  startupStage: string
  experience: string
}

const EMPTY_PROFILE: ProfileData = {
  name: '', email: '', university: '', bio: '',
  position: '', skills: [], startupStage: '', experience: '',
}

function EditableField({
  label, value, editing, onChange, placeholder, multiline = false,
}: {
  label: string
  value: string
  editing: boolean
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {editing ? (
        multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 resize-none transition-colors"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
          />
        )
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed">
          {value || <span className="text-slate-600 italic">Not set</span>}
        </p>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { username, loading: authLoading, isLoggedIn } = useAuth()

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE)
  const [draft, setDraft] = useState<ProfileData>(EMPTY_PROFILE)
  const [editing, setEditing] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [connectionCount, setConnectionCount] = useState(0)
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([])
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())
  const [acceptedNotifications, setAcceptedNotifications] = useState<AcceptedOutgoing[]>([])



  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) {
      setFetching(false)
      return
    }

    Promise.all([
      profileApi.get(),
      connectionsApi.getCount(),
      connectionsApi.getIncoming(),
      connectionsApi.getAcceptedOutgoing(),
    ]).then(([profileRes, countRes, incomingRes, acceptedRes]) => {
      if (profileRes.data && !profileRes.error) {
        const loaded: ProfileData = {
          name: profileRes.data.name ?? username ?? '',
          email: profileRes.data.email ?? '',
          university: profileRes.data.university ?? '',
          bio: profileRes.data.bio ?? '',
          position: profileRes.data.position ?? '',
          skills: profileRes.data.skills ?? [],
          startupStage: profileRes.data.startup_stage ?? '',
          experience: profileRes.data.experience ?? '',
        }
        setProfile(loaded)
        setDraft(loaded)
      }
      if (countRes.data) setConnectionCount(countRes.data.count)
      if (incomingRes.data) setIncomingRequests(incomingRes.data)
      if (acceptedRes.data) {
        const dismissed: string[] = JSON.parse(localStorage.getItem('arcus_dismissed_notifs') ?? '[]')
        const unseen = acceptedRes.data.filter(n => !dismissed.includes(n.id))
        setAcceptedNotifications(unseen)
        // Auto-dismiss on first view — won't show again next visit
        if (unseen.length > 0) {
          localStorage.setItem(
            'arcus_dismissed_notifs',
            JSON.stringify([...dismissed, ...unseen.map(n => n.id)])
          )
        }
      }
      setFetching(false)
    })
  }, [authLoading, isLoggedIn, username])

  async function handleAccept(connId: string) {
    setPendingActions(prev => new Set(prev).add(connId))
    const { error } = await connectionsApi.accept(connId)
    if (!error) {
      setIncomingRequests(prev => prev.filter(r => r.id !== connId))
      setConnectionCount(prev => prev + 1)
    }
    setPendingActions(prev => { const s = new Set(prev); s.delete(connId); return s })
  }

  async function handleDecline(connId: string) {
    setPendingActions(prev => new Set(prev).add(connId))
    const { error } = await connectionsApi.decline(connId)
    if (!error) {
      setIncomingRequests(prev => prev.filter(r => r.id !== connId))
    }
    setPendingActions(prev => { const s = new Set(prev); s.delete(connId); return s })
  }

  function toggleSkill(skill: string) {
    setDraft(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  async function save() {
    setSaving(true)
    setSaveError(null)
    const { error } = await profileApi.update({
      name: draft.name,
      email: draft.email,
      university: draft.university,
      bio: draft.bio,
      position: draft.position,
      skills: draft.skills,
      startup_stage: draft.startupStage,
      experience: draft.experience,
    })
    if (error) {
      setSaveError(error)
    } else {
      setProfile(draft)
      setEditing(false)
    }
    setSaving(false)
  }

  function cancel() {
    setDraft(profile)
    setEditing(false)
    setSaveError(null)
  }

  function startEdit() {
    setDraft(profile)
    setEditing(true)
  }

  const initial = (profile.name || username || '?').charAt(0).toUpperCase()

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm">Loading profile…</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {/* Profile header */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <span className="text-white text-3xl font-bold">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">
              {profile.name || username || 'Your Name'}
            </h1>
            <p className="text-sm text-slate-500 mb-1">
              {profile.position || <span className="italic">No position set</span>}
              {profile.university && ` · ${profile.university}`}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
              {profile.bio || <span className="italic">No bio yet</span>}
            </p>
          </div>
          <button
            onClick={editing ? save : startEdit}
            disabled={saving}
            className={`shrink-0 px-5 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 ${
              editing
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white/8 border border-white/10 text-slate-300 hover:bg-white/12 hover:text-slate-100'
            }`}
          >
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Edit profile'}
          </button>
          {editing && (
            <button
              onClick={cancel}
              className="shrink-0 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        {saveError && (
          <p className="mt-4 text-sm text-red-400">{saveError}</p>
        )}
      </div>

      {/* Accepted connection notifications */}
      {acceptedNotifications.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {acceptedNotifications.map(n => (
            <div key={n.id} className="flex items-center justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {(n.acceptee?.name ?? '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-200">
                  <span className="font-semibold">{n.acceptee?.name ?? 'Someone'}</span>
                  <span className="text-slate-400"> accepted your connection request</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incoming connection requests */}
      {incomingRequests.length > 0 && (
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6 mb-6">
          <h2 className="text-sm font-semibold text-blue-300 mb-4">
            {incomingRequests.length === 1 ? '1 connection request' : `${incomingRequests.length} connection requests`}
          </h2>
          <div className="flex flex-col gap-3">
            {incomingRequests.map(req => {
              const name = req.requester?.name ?? 'Someone'
              const initial = name.charAt(0).toUpperCase()
              const acting = pendingActions.has(req.id)
              return (
                <div key={req.id} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{initial}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {[req.requester?.position, req.requester?.university].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAccept(req.id)}
                      disabled={acting}
                      className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
                    >
                      {acting ? '…' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      disabled={acting}
                      className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 disabled:opacity-50 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Link
          href="/connections"
          className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 text-center hover:bg-white/8 hover:border-white/15 transition-colors block"
        >
          <p className="text-3xl font-bold text-slate-100 mb-1">{connectionCount}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Connections</p>
        </Link>
        <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 text-center">
          <p className="text-3xl font-bold text-slate-100 mb-1">0</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Profile Views</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 text-center">
          <p className="text-base font-semibold text-slate-100 mb-1">
            {profile.startupStage || '—'}
          </p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Startup Stage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Skills & Experience */}
        <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8 flex flex-col gap-7">
          <div>
            <h2 className="text-base font-semibold text-slate-100 mb-0.5">Skills & Experience</h2>
            <p className="text-xs text-slate-500">Shown to others in Connect search results.</p>
          </div>

          {/* Role / position */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {POSITIONS.map(pos => (
                  <button
                    key={pos}
                    onClick={() => setDraft(prev => ({ ...prev, position: prev.position === pos ? '' : pos }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      draft.position === pos
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                {profile.position || <span className="text-slate-600 italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</label>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                      draft.skills.includes(skill)
                        ? 'bg-blue-600/30 border-blue-400/50 text-blue-200'
                        : 'bg-white/5 border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full bg-blue-600/15 border border-blue-400/25 text-blue-300">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 italic">No skills added yet</p>
            )}
          </div>

          {/* Experience */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</label>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setDraft(prev => ({ ...prev, experience: prev.experience === level ? '' : level }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      draft.experience === level
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                {profile.experience || <span className="text-slate-600 italic">Not set</span>}
              </p>
            )}
          </div>
        </div>

        {/* Account settings */}
        <div className="flex flex-col gap-6">

          <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-base font-semibold text-slate-100 mb-0.5">Account Details</h2>
              <p className="text-xs text-slate-500">Your public profile information.</p>
            </div>
            <EditableField label="Display Name" value={draft.name} editing={editing} onChange={v => setDraft(p => ({ ...p, name: v }))} placeholder="Your full name" />
            <EditableField label="Email" value={draft.email} editing={editing} onChange={v => setDraft(p => ({ ...p, email: v }))} placeholder="you@university.edu" />
            <EditableField label="University" value={draft.university} editing={editing} onChange={v => setDraft(p => ({ ...p, university: v }))} placeholder="e.g. MIT, Stanford" />
            <EditableField label="Bio" value={draft.bio} editing={editing} onChange={v => setDraft(p => ({ ...p, bio: v }))} placeholder="A short intro shown on your Connect card…" multiline />
          </div>

          {/* Startup interest */}
          <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-8 flex flex-col gap-5">
            <div>
              <h2 className="text-base font-semibold text-slate-100 mb-0.5">Startup Interest</h2>
              <p className="text-xs text-slate-500">What stage is your startup currently at?</p>
            </div>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {STARTUP_STAGES.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setDraft(prev => ({ ...prev, startupStage: prev.startupStage === stage ? '' : stage }))}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      draft.startupStage === stage
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                {profile.startupStage || <span className="text-slate-600 italic">Not set</span>}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
