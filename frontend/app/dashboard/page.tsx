'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { profileApi, onboardingApi, connectionsApi } from '../../lib/api'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Task {
  id: number
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string | null
  completed: boolean
}

interface Goal {
  id: number
  title: string
  current: number
  target: number
  unit: string
}

interface Metric {
  label: string
  value: string | number
  delta: string | null
}


interface Opportunity {
  id: number
  title: string
  type: 'Competition' | 'Accelerator' | 'Hackathon' | 'Grant' | 'Event'
  href: string
}

// ── Mock data ──────────────────────────────────────────────────────────────────
// Replace with backend API calls once data layer is ready.

const STAGES = ['Ideation', 'Validation', 'Building', 'Launch', 'Growth']

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Interview 3 potential customers',
    description: 'Schedule calls with target users to validate pain points',
    priority: 'High',
    dueDate: 'Jun 7',
    completed: false,
  },
  {
    id: 2,
    title: 'Create landing page',
    description: 'Build a one-pager to collect waitlist signups',
    priority: 'High',
    dueDate: 'Jun 10',
    completed: false,
  },
  {
    id: 3,
    title: 'Define problem statement',
    description: 'Write a clear 1-sentence problem statement',
    priority: 'Medium',
    dueDate: null,
    completed: true,
  },
  {
    id: 4,
    title: 'Map competitor landscape',
    description: 'List 5 competitors and their key differentiators',
    priority: 'Medium',
    dueDate: 'Jun 14',
    completed: false,
  },
  {
    id: 5,
    title: 'Reach out to 5 potential users',
    description: 'Find users via LinkedIn or university networks',
    priority: 'Low',
    dueDate: 'Jun 12',
    completed: false,
  },
]

const GOALS: Goal[] = [
  { id: 1, title: 'Customer interviews', current: 3, target: 10, unit: 'interviews' },
  { id: 2, title: 'Waitlist signups', current: 8, target: 25, unit: 'signups' },
  { id: 3, title: 'MVP prototype', current: 20, target: 100, unit: '% complete' },
]

// ── Survey → metric helpers ────────────────────────────────────────────────────

function revenueShort(range: string | null | undefined): string {
  if (!range || range === 'Pre-revenue') return '$0'
  if (range.startsWith('$1 –'))   return '<$1K/mo'
  if (range.startsWith('$1K'))    return '$1K–10K'
  if (range.startsWith('$10K'))   return '$10K–100K'
  if (range.startsWith('$100K')) return '$100K+/mo'
  return '$0'
}

function teamLabel(position: string | null | undefined, lookingFor: string | null | undefined): string {
  if (position === 'Co-founder')                              return '2'
  if (lookingFor === 'I already have a team')                 return '3+'
  if (lookingFor === 'Yes — looking for first employees')     return '2'
  return '1'
}

function buildMetrics(
  stage:      string | null | undefined,
  position:   string | null | undefined,
  experience: string | null | undefined,
  skills:     string[] | null | undefined,
  revenue:    string | null | undefined,
  lookingFor: string | null | undefined,
  connections: number,
): Metric[] {
  return [
    { label: 'Revenue',     value: revenueShort(revenue),                     delta: revenue && revenue !== 'Pre-revenue' ? 'from survey' : null },
    { label: 'Team',        value: teamLabel(position, lookingFor),            delta: position ?? null },
    { label: 'Skills',      value: skills?.length ?? 0,                       delta: skills?.slice(0, 2).join(', ') || null },
    { label: 'Connections', value: connections,                                delta: null },
    { label: 'Experience',  value: experience ?? '—',                         delta: null },
    { label: 'Stage',       value: stage ?? '—',                              delta: null },
  ]
}

function buildInsights(
  stage:      string | null | undefined,
  lookingFor: string | null | undefined,
  revenue:    string | null | undefined,
  skills:     string[] | null | undefined,
): string[] {
  const list: string[] = []
  const TECHNICAL = new Set(['Frontend', 'Backend', 'Mobile', 'React', 'Python', 'Go', 'DevOps', 'AWS', 'ML / AI'])
  const isTechnical = skills?.some(s => TECHNICAL.has(s)) ?? false

  switch (stage) {
    case 'Ideation':
      list.push("You're at the Ideation stage. Talk to at least 10 potential customers before building anything — deep problem understanding beats any solution.")
      break
    case 'Validation':
      list.push("You're validating. Aim for 20–30 customer interviews and look for the same pain mentioned 3+ times. That pattern is your signal to build.")
      break
    case 'Building':
      list.push("You're building. Ship the smallest version that solves the core problem. Every day spent building something users don't need is time you won't get back.")
      break
    case 'Launch':
      list.push("You've launched. Focus on acquiring your first 100 users before adding features. Retention metrics at this stage are more important than acquisition.")
      break
    case 'Growth':
      list.push("You're growing. Double down on whichever acquisition channel is already working — don't spread across too many at once.")
      break
  }

  if (lookingFor === 'Yes — looking for a co-founder') {
    list.push("Finding a co-founder is one of the most important decisions you'll make. Prioritise complementary skills and shared values over shared excitement.")
  } else if (lookingFor === 'Yes — looking for a mentor') {
    list.push("A great mentor has already made the mistakes ahead of you. Connect with experienced founders in your space through the Arcus community.")
  } else if (lookingFor === 'Yes — looking for first employees') {
    list.push("Your first hires shape your culture permanently. Look for generalists who take ownership, not specialists who wait for instructions.")
  }

  if (!isTechnical && (stage === 'Ideation' || stage === 'Validation')) {
    list.push("As a non-technical founder your edge is customer insight and distribution — not code. Validate the demand hard before investing in any engineering.")
  }

  if ((!revenue || revenue === 'Pre-revenue') && (stage === 'Building' || stage === 'Launch')) {
    list.push("No revenue yet — define your first revenue milestone clearly. Who pays, what for, and how much. Work backwards from that number.")
  }

  return list.slice(0, 2)
}


const OPPORTUNITIES: Opportunity[] = [
  { id: 1, title: 'MIT $100K Business Competition', type: 'Competition', href: 'https://www.mit100k.org' },
  { id: 2, title: 'Y Combinator',                  type: 'Accelerator', href: 'https://www.ycombinator.com/apply' },
  { id: 3, title: 'HackMIT',                        type: 'Hackathon',   href: 'https://hackmit.org' },
  { id: 4, title: 'NSF SBIR Phase I Grant',         type: 'Grant',       href: 'https://seedfund.nsf.gov' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function computeGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const PRIORITY_STYLE: Record<Task['priority'], string> = {
  High: 'text-rose-400 bg-rose-500/10 border-rose-400/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-400/20',
  Low: 'text-slate-400 bg-slate-500/10 border-slate-400/20',
}

const OPPORTUNITY_TYPE_STYLE: Record<Opportunity['type'], string> = {
  Competition: 'text-blue-300 bg-blue-500/10 border-blue-400/20',
  Accelerator: 'text-purple-300 bg-purple-500/10 border-purple-400/20',
  Hackathon: 'text-indigo-300 bg-indigo-500/10 border-indigo-400/20',
  Grant: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  Event: 'text-slate-300 bg-slate-500/10 border-slate-400/20',
}


// ── Sub-components ─────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { username } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [showWelcome, setShowWelcome] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [greeting, setGreeting] = useState('')
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Revenue',     value: '—', delta: null },
    { label: 'Team',        value: '—', delta: null },
    { label: 'Skills',      value: '—', delta: null },
    { label: 'Connections', value: '—', delta: null },
    { label: 'Experience',  value: '—', delta: null },
    { label: 'Stage',       value: '—', delta: null },
  ])
  const [insights, setInsights] = useState<string[]>([
    'Complete the onboarding survey to get personalised insights for your startup.',
  ])

  useEffect(() => {
    setGreeting(computeGreeting())
    if (localStorage.getItem('arcus_needs_onboarding') === 'true') {
      setShowWelcome(true)
    }
    Promise.all([
      profileApi.get(),
      onboardingApi.get(),
      connectionsApi.getCount(),
    ]).then(([profileRes, onboardingRes, countRes]) => {
      const p = profileRes.data
      const o = onboardingRes.data
      const connCount = countRes.data?.count ?? 0

      if (p?.startup_stage) {
        const idx = STAGES.indexOf(p.startup_stage)
        if (idx !== -1) setCurrentStageIndex(idx)
      }

      setMetrics(buildMetrics(
        p?.startup_stage, p?.position, p?.experience,
        p?.skills, o?.revenue_range, o?.looking_for, connCount,
      ))

      const insightList = buildInsights(p?.startup_stage, o?.looking_for, o?.revenue_range, p?.skills)
      if (insightList.length > 0) setInsights(insightList)
    })
  }, [])

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const overallProgress = Math.round((currentStageIndex / (STAGES.length - 1)) * 100)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* ── Welcome / onboarding modal ───────────────────────────────────── */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1728] p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-blue-300 uppercase border border-blue-400/20 rounded-full bg-blue-400/5">
                Welcome to Arcus
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-3 leading-snug">
              Start your journey with a quick survey
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed">
              Answer 10 short questions so we can personalize your roadmap,
              tasks, and goals from day one. Takes about 2 minutes.
            </p>
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20 mb-3"
            >
              Start the survey
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('arcus_needs_onboarding')
                setShowWelcome(false)
              }}
              className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-sm text-slate-500 mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold text-slate-100">{username || 'Founder'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 rounded-full bg-blue-400/5 uppercase tracking-widest">
            {STAGES[currentStageIndex]}
          </span>
          <span className="text-sm text-slate-500">{overallProgress}% overall</span>
        </div>
      </div>

      {/* ── Progress Tracker ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-300">Startup Journey</h2>
          <span className="text-xs text-slate-500">
            {0}% through {STAGES[currentStageIndex]}
          </span>
        </div>

        {/* Stage steps */}
        <div className="relative flex items-start justify-between">
          {/* Connector lines behind nodes */}
          <div className="absolute left-3.5 right-3.5 top-3.5 h-px bg-white/8" />
          <div
            className="absolute left-3.5 top-3.5 h-px bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
            style={{
              width: `calc(${(currentStageIndex / (STAGES.length - 1)) * 100}% - 0px)`,
            }}
          />

          {STAGES.map((stage, i) => {
            const done = i < currentStageIndex
            const active = i === currentStageIndex
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-2" style={{ flex: 1 }}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : active
                    ? 'bg-[#0b1220] border-blue-400 text-blue-300'
                    : 'bg-[#0b1220] border-white/15 text-slate-600'
                }`}>
                  {done ? <CheckIcon /> : <span>{i + 1}</span>}
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${
                  done ? 'text-blue-400' : active ? 'text-slate-200' : 'text-slate-600'
                }`}>
                  {stage}
                </span>
              </div>
            )
          })}
        </div>

        {/* Current stage progress bar */}
        <div className="mt-5 pt-5 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Progress in {STAGES[currentStageIndex]}</span>
            <span>{0}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
              style={{ width: `${0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Metrics Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {metrics.map(metric => (
          <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-5">
            <p className="text-2xl font-bold text-slate-100 mb-1">{metric.value}</p>
            <p className="text-xs text-slate-500 leading-snug">{metric.label}</p>
            {metric.delta && (
              <p className="text-xs text-blue-400 mt-1.5 font-medium">{metric.delta}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Main Grid: Tasks | Goals + Insights ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Current Tasks */}
        <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Current Tasks</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {completedCount} of {tasks.length} completed
              </p>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
              + Add task
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex gap-3 p-4 rounded-xl border transition-all ${
                  task.completed
                    ? 'border-white/5 bg-transparent opacity-50'
                    : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-white/25 hover:border-blue-400/70 bg-transparent'
                  }`}
                  style={{ width: 18, height: 18, minWidth: 18 }}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && <CheckIcon />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium leading-snug ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}>
                      {task.title}
                    </p>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_STYLE[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-xs text-slate-600 mt-1.5">Due {task.dueDate}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Weekly Goals */}
          <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="text-base font-semibold text-slate-100 mb-0.5">Weekly Goals</h2>
            <p className="text-xs text-slate-500 mb-5">This week&apos;s targets</p>

            <div className="flex flex-col gap-5">
              {GOALS.map(goal => {
                const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">{goal.title}</span>
                      <span className="text-slate-500 tabular-nums">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 100
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 to-blue-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{pct}%</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl border border-blue-400/15 bg-blue-500/5 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-100">AI Insights</h2>
              <span className="text-xs text-slate-600 border border-white/8 rounded-full px-2.5 py-0.5">
                arcus.ai
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {insights.map((insight, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-4 pt-4 border-t border-white/5">
              Updates as you log progress
            </p>
          </div>

        </div>
      </div>

      {/* ── Opportunities ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-0.5">Opportunities</h2>
        <p className="text-xs text-slate-500 mb-5">Competitions, accelerators, hackathons & grants — check each site for current deadlines</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OPPORTUNITIES.map(opp => (
            <a
              key={opp.id}
              href={opp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 leading-snug mb-2">{opp.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${OPPORTUNITY_TYPE_STYLE[opp.type]}`}>
                  {opp.type}
                </span>
              </div>
              <span className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0">
                <ChevronRight />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
