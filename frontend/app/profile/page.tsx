'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../../lib/api'

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

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) {
      setFetching(false)
      return
    }

    profileApi.get().then(({ data, error }) => {
      if (data && !error) {
        const loaded: ProfileData = {
          name: data.name ?? username ?? '',
          email: data.email ?? '',
          university: data.university ?? '',
          bio: data.bio ?? '',
          position: data.position ?? '',
          skills: data.skills ?? [],
          startupStage: data.startup_stage ?? '',
          experience: data.experience ?? '',
        }
        setProfile(loaded)
        setDraft(loaded)
      }
      setFetching(false)
    })
  }, [authLoading, isLoggedIn, username])

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

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 text-center">
          <p className="text-3xl font-bold text-slate-100 mb-1">0</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Connections</p>
        </div>
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
