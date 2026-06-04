'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { onboardingApi } from '../../lib/api'

// ── Question bank ──────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'startup_stage',
    question: 'Where is your startup right now?',
    subtitle: 'Give an honest assessment — this shapes your entire roadmap.',
    type: 'single' as const,
    options: ['Ideation', 'Validation', 'Building', 'Launch', 'Growth'],
    descriptions: [
      'I have an idea but have not validated it yet',
      'I am testing whether people actually want this',
      'I am actively building the product',
      'The product is live and I am acquiring users',
      'I have users and revenue and I am scaling',
    ],
  },
  {
    id: 'position',
    question: 'What is your role?',
    subtitle: 'What is your role in your current startup, or the role you are aiming for?',
    type: 'single' as const,
    options: ['Founder', 'Co-founder', 'Employee', 'Advisor', 'Mentor', 'Investor'],
    descriptions: [
      'I started this and I am running it',
      'I co-started this with one or more people',
      'I joined an existing startup as a team member',
      'I provide strategic guidance to startups',
      'I coach and support early-stage founders',
      'I fund startups in exchange for equity',
    ],
  },
  {
    id: 'revenue_range',
    question: 'Do you have any revenue yet?',
    subtitle: 'If you are comfortable sharing, this helps us calibrate your roadmap. All ranges are approximate monthly figures.',
    type: 'single' as const,
    options: ['Pre-revenue', '$1 – $1K / month', '$1K – $10K / month', '$10K – $100K / month', '$100K+ / month'],
    descriptions: [
      'No revenue yet',
      'Getting first paying customers',
      'Meaningful early traction',
      'Solid revenue, scaling the model',
      'Strong revenue, focused on growth',
    ],
  },
  {
    id: 'looking_for',
    question: 'Are you looking for people to build with?',
    subtitle: 'This helps us connect you with the right people and tailor your roadmap.',
    type: 'single' as const,
    options: [
      'Yes — looking for a co-founder',
      'Yes — looking for first employees',
      'Yes — looking for a mentor',
      'I already have a team',
      'Not right now',
    ],
    descriptions: [
      'I want someone to share ownership and build this with',
      'I want to hire the first people to join my startup',
      'I want guidance from someone who has done this before',
      'My team is set — I just need the roadmap',
      'I am heads-down building right now',
    ],
  },
  {
    id: 'skills',
    question: 'What are your skills?',
    subtitle: 'Select everything that applies. This personalises your roadmap and shows up on your Connect profile.',
    type: 'multi' as const,
    options: [
      'Frontend', 'Backend', 'Mobile', 'AWS', 'DevOps',
      'ML / AI', 'Product Design', 'React', 'Python', 'Go',
      'Marketing', 'Sales', 'Growth', 'Fundraising', 'Strategy',
    ],
  },
  {
    id: 'experience',
    question: 'How much work experience do you have?',
    subtitle: 'Not just startups — any internships or full-time roles count.',
    type: 'single' as const,
    options: ['Student', '0–1 years', '1–3 years', '3–5 years', '5+ years'],
    descriptions: [
      'Currently studying, no full-time experience yet',
      'Just getting started in the workforce',
      'A few years of experience under my belt',
      'Experienced and have led teams or projects',
      'Senior professional with deep domain expertise',
    ],
  },
  {
    id: 'bio',
    question: 'What is your startup idea?',
    subtitle: 'If you do not have one yet, write NA — that is completely fine. Ideation is a very difficult phase.',
    type: 'text' as const,
    placeholder: 'e.g. An app that helps students find study partners based on learning style…',
  },
  {
    id: 'university',
    question: 'Which university or area are you from?',
    subtitle: 'This helps us connect you with founders near you.',
    type: 'text' as const,
    placeholder: 'e.g. MIT, Stanford, University of Toronto, London…',
  },
  {
    id: 'referral_source',
    question: 'How did you find out about Arcus?',
    subtitle: 'This helps us understand where our community is coming from.',
    type: 'single' as const,
    options: ['Word of mouth', 'Social media', 'University / professor', 'Search engine', 'Other'],
    descriptions: [
      'A friend or colleague told me about it',
      'I saw it on Twitter, LinkedIn, Instagram, etc.',
      'My professor or university recommended it',
      'I searched and found it online',
      'Some other way',
    ],
  },
] as const

// ── Types ──────────────────────────────────────────────────────────────────────

type QuestionId = (typeof QUESTIONS)[number]['id']
type Answer = string | string[]

// ── Component ──────────────────────────────────────────────────────────────────

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
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, Answer>>>({})
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

    const a = answers
    const { error: apiError } = await onboardingApi.submit({
      startup_stage:  (a.startup_stage  as string)   ?? '',
      position:       (a.position       as string)   ?? '',
      revenue_range:  (a.revenue_range  as string)   ?? 'Pre-revenue',
      looking_for:    (a.looking_for    as string)   ?? 'Not right now',
      skills:         (a.skills         as string[]) ?? [],
      experience:     (a.experience     as string)   ?? '',
      university:     (a.university     as string)   ?? undefined,
      bio:            (a.bio            as string)   ?? undefined,
      referral_source:(a.referral_source as string)  ?? undefined,
    })

    if (apiError) {
      setError(apiError)
      setSubmitting(false)
      return
    }

    localStorage.removeItem('arcus_needs_onboarding')
    router.push('/dashboard')
  }

  if (authLoading) return null

  // Descriptions for the current single-select question
  const descriptions = 'descriptions' in question ? question.descriptions : null

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
          <h2 className="text-2xl font-bold text-slate-100 mb-2 leading-snug">{question.question}</h2>
          <p className="text-sm text-slate-500 mb-7">{question.subtitle}</p>

          {/* Single select */}
          {question.type === 'single' && (
            <div className="flex flex-col gap-2.5">
              {question.options.map((option, i) => (
                <button
                  key={option}
                  onClick={() => setSingle(option)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all flex items-start justify-between gap-3 ${
                    current === option
                      ? 'border-blue-400/60 bg-blue-500/15 text-slate-100'
                      : 'border-white/8 bg-white/5 text-slate-400 hover:bg-white/8 hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-medium leading-snug">{option}</p>
                    {descriptions && (
                      <p className={`text-xs mt-0.5 leading-relaxed ${current === option ? 'text-blue-300/70' : 'text-slate-600'}`}>
                        {descriptions[i]}
                      </p>
                    )}
                  </div>
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
            <textarea
              value={(current as string | undefined) ?? ''}
              onChange={e => setText(e.target.value)}
              placeholder={'placeholder' in question ? question.placeholder : ''}
              rows={4}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors resize-none"
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
              disabled={submitting || !canAdvance}
              className="px-8 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              {submitting ? 'Building your roadmap…' : 'Finish — see my roadmap'}
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
