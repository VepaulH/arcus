'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../../lib/api'

// ── QUESTIONS ──────────────────────────────────────────────────────────────────
// Replace the content below with your own questions.
//
// Three supported types:
//   'single' — user picks exactly one option (required before advancing)
//   'multi'  — user picks multiple options (optional, can skip)
//   'text'   — free-text input (optional, can skip)
//
// 'field' maps the answer to a profile DB column on submit.
// Supported field values: 'startup_stage' | 'position' | 'skills' | 'experience' | 'university'
// Set field to null for questions you don't want saved to the profile.

const QUESTIONS = [
  {
    id: 1,
    question: 'Question 1',
    subtitle: 'Subtitle for question 1.',
    type: 'single' as const,
    field: 'startup_stage' as const,
    options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  },
  {
    id: 2,
    question: 'Question 2',
    subtitle: 'Subtitle for question 2.',
    type: 'single' as const,
    field: 'position' as const,
    options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  },
  {
    id: 3,
    question: 'Question 3',
    subtitle: 'Subtitle for question 3.',
    type: 'single' as const,
    field: null,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  },
  {
    id: 4,
    question: 'Question 4',
    subtitle: 'Subtitle for question 4. (Multi-select example)',
    type: 'multi' as const,
    field: 'skills' as const,
    options: [
      'Frontend', 'Backend', 'Mobile', 'AWS', 'DevOps',
      'ML / AI', 'Product Design', 'React', 'Python', 'Go',
      'Marketing', 'Sales', 'Growth', 'Fundraising', 'Strategy',
    ],
  },
  {
    id: 5,
    question: 'Question 5',
    subtitle: 'Subtitle for question 5.',
    type: 'single' as const,
    field: null,
    options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  },
  {
    id: 6,
    question: 'Question 6',
    subtitle: 'Subtitle for question 6.',
    type: 'single' as const,
    field: 'experience' as const,
    options: ['Student', '0–1 years', '1–3 years', '3–5 years', '5+ years'],
  },
  {
    id: 7,
    question: 'Question 7',
    subtitle: 'Subtitle for question 7.',
    type: 'single' as const,
    field: null,
    options: ['Option A', 'Option B', 'Option C'],
  },
  {
    id: 8,
    question: 'Question 8',
    subtitle: 'Subtitle for question 8.',
    type: 'single' as const,
    field: null,
    options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  },
  {
    id: 9,
    question: 'Question 9',
    subtitle: 'Subtitle for question 9.',
    type: 'single' as const,
    field: null,
    options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  },
  {
    id: 10,
    question: 'Question 10',
    subtitle: 'Subtitle for question 10. (Text input example)',
    type: 'text' as const,
    field: 'university' as const,
    placeholder: 'Your answer…',
  },
] as const

// ── VALUE MAPS ─────────────────────────────────────────────────────────────────
// If you use field: 'startup_stage', map your option labels to DB values here.
// DB values: 'Ideation' | 'Validation' | 'Building' | 'Launch' | 'Growth'
const STAGE_MAP: Record<string, string> = {
  'Option A': 'Ideation',
  'Option B': 'Validation',
  'Option C': 'Building',
  'Option D': 'Launch',
  'Option E': 'Growth',
}

// If you use field: 'position', map your option labels to DB values here.
// DB values: 'Co-founder' | 'Employee' | 'Mentor' | 'Advisor' | 'Investor'
const POSITION_MAP: Record<string, string> = {
  'Option A': 'Founder',
  'Option B': 'Co-founder',
  'Option C': 'Employee',
  'Option D': 'Mentor',
  'Option E': 'Advisor',
  'Option F': 'Investor',
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

type Answer = string | string[]

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace('/signup')
  }, [authLoading, isLoggedIn, router])

  const question = QUESTIONS[step]
  const current = answers[question.id]
  const progress = ((step + 1) / QUESTIONS.length) * 100
  const canAdvance = question.type !== 'single' || !!current
  const isLast = step === QUESTIONS.length - 1

  function setSingle(value: string) {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  function toggleMulti(value: string) {
    setAnswers(prev => {
      const existing = (prev[question.id] as string[] | undefined) ?? []
      const next = existing.includes(value)
        ? existing.filter(v => v !== value)
        : [...existing, value]
      return { ...prev, [question.id]: next }
    })
  }

  function setText(value: string) {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  function skip() {
    localStorage.removeItem('arcus_needs_onboarding')
    router.push('/dashboard')
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)

    // Build the profile payload from answers that have a field mapping
    const profilePayload: Record<string, unknown> = {}
    for (const q of QUESTIONS) {
      const answer = answers[q.id]
      if (!answer || !q.field) continue

      if (q.field === 'startup_stage') {
        profilePayload.startup_stage = STAGE_MAP[answer as string] ?? answer
      } else if (q.field === 'position') {
        profilePayload.position = POSITION_MAP[answer as string] ?? answer
      } else if (q.field === 'skills') {
        profilePayload.skills = answer
      } else if (q.field === 'experience') {
        profilePayload.experience = answer
      } else if (q.field === 'university') {
        profilePayload.university = answer
      }
    }

    const { error } = await profileApi.update(profilePayload as Parameters<typeof profileApi.update>[0])
    if (error) setError('Could not save your answers — you can update them later in your profile.')

    localStorage.removeItem('arcus_needs_onboarding')
    router.push('/dashboard')
  }

  if (authLoading) return null

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 rounded-full bg-white/8 mb-10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-2 leading-snug">
            {question.question}
          </h2>
          {'subtitle' in question && question.subtitle && (
            <p className="text-sm text-slate-500 mb-7">{question.subtitle}</p>
          )}

          {/* Single select */}
          {question.type === 'single' && (
            <div className="flex flex-col gap-2.5">
              {question.options.map(option => (
                <button
                  key={option}
                  onClick={() => setSingle(option)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                    current === option
                      ? 'border-blue-400/60 bg-blue-500/15 text-slate-100'
                      : 'border-white/8 bg-white/5 text-slate-400 hover:bg-white/8 hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  <span>{option}</span>
                  {current === option && <CheckIcon />}
                </button>
              ))}
            </div>
          )}

          {/* Multi-select */}
          {question.type === 'multi' && (
            <div className="flex flex-wrap gap-2">
              {question.options.map(option => {
                const selected = (current as string[] | undefined)?.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => toggleMulti(option)}
                    className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                      selected
                        ? 'border-blue-400/50 bg-blue-500/20 text-blue-200'
                        : 'border-white/8 bg-white/5 text-slate-400 hover:bg-white/8 hover:border-white/15 hover:text-slate-200'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {/* Text input */}
          {question.type === 'text' && (
            <input
              type="text"
              value={(current as string | undefined) ?? ''}
              onChange={e => setText(e.target.value)}
              placeholder={'placeholder' in question ? question.placeholder : ''}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
            />
          )}
        </div>

        {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 disabled:opacity-0 transition-colors"
          >
            Back
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              {submitting ? 'Saving…' : 'Finish — go to dashboard'}
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance}
              className="px-8 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              Continue
            </button>
          )}
        </div>

        <p className="text-center mt-5">
          <button
            onClick={skip}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Skip for now — I&apos;ll set this up later
          </button>
        </p>

      </div>
    </div>
  )
}
