'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

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

interface FeedItem {
  id: number
  name: string
  initials: string
  action: string
  time: string
}

interface Opportunity {
  id: number
  title: string
  type: 'Competition' | 'Accelerator' | 'Hackathon' | 'Grant' | 'Event'
  date: string
  deadline: string
}

// ── Mock data ──────────────────────────────────────────────────────────────────
// Replace with backend API calls once data layer is ready.

const STAGES = ['Idea', 'Validation', 'MVP', 'First Users', 'Revenue', 'Scale']
const CURRENT_STAGE_INDEX = 1
const STAGE_COMPLETION = 35

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

const METRICS: Metric[] = [
  { label: 'Customer Interviews', value: 3, delta: '+3 this week' },
  { label: 'Waitlist Signups', value: 8, delta: '+8 this week' },
  { label: 'Active Users', value: 0, delta: null },
  { label: 'Revenue', value: '$0', delta: null },
  { label: 'Team Members', value: 1, delta: null },
  { label: 'Milestones', value: 2, delta: '+1 this week' },
]

const AI_INSIGHTS = [
  "You're in the Validation stage. Successful founders at this stage focus on customer discovery before adding features.",
  "3 of 10 interviews done this week — schedule 2 more calls to stay on track.",
]

const FEED: FeedItem[] = [
  { id: 1, name: 'Sarah M.', initials: 'SM', action: 'launched her MVP', time: '2h ago' },
  { id: 2, name: 'David K.', initials: 'DK', action: 'found a technical co-founder', time: '5h ago' },
  { id: 3, name: 'Priya S.', initials: 'PS', action: 'completed 20 customer interviews', time: '1d ago' },
  { id: 4, name: 'Alex R.', initials: 'AR', action: 'joined Y Combinator', time: '1d ago' },
  { id: 5, name: 'Jordan L.', initials: 'JL', action: 'hit $1K MRR', time: '2d ago' },
]

const OPPORTUNITIES: Opportunity[] = [
  { id: 1, title: 'MIT $100K Business Competition', type: 'Competition', date: 'Jun 15, 2026', deadline: 'Jun 10' },
  { id: 2, title: 'Y Combinator W27', type: 'Accelerator', date: 'Oct 2026', deadline: 'Jul 1' },
  { id: 3, title: 'HackMIT 2026', type: 'Hackathon', date: 'Sep 12, 2026', deadline: 'Aug 15' },
  { id: 4, title: 'NSF SBIR Phase I Grant', type: 'Grant', date: 'Rolling', deadline: 'Aug 1' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function getGreeting(): string {
  if (typeof window === 'undefined') return 'Welcome'
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

const AVATAR_GRADIENTS = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-blue-600',
  'from-sky-500 to-blue-600',
  'from-blue-400 to-indigo-600',
  'from-violet-500 to-blue-600',
]

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

  useEffect(() => {
    if (localStorage.getItem('arcus_needs_onboarding') === 'true') {
      setShowWelcome(true)
    }
  }, [])

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const overallProgress = Math.round(
    ((CURRENT_STAGE_INDEX + STAGE_COMPLETION / 100) / STAGES.length) * 100
  )

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
          <p className="text-sm text-slate-500 mb-1">{getGreeting()}</p>
          <h1 className="text-3xl font-bold text-slate-100">{username || 'Founder'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 rounded-full bg-blue-400/5 uppercase tracking-widest">
            {STAGES[CURRENT_STAGE_INDEX]}
          </span>
          <span className="text-sm text-slate-500">{overallProgress}% overall</span>
        </div>
      </div>

      {/* ── Progress Tracker ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-300">Startup Journey</h2>
          <span className="text-xs text-slate-500">
            {STAGE_COMPLETION}% through {STAGES[CURRENT_STAGE_INDEX]}
          </span>
        </div>

        {/* Stage steps */}
        <div className="relative flex items-start justify-between">
          {/* Connector lines behind nodes */}
          <div className="absolute left-3.5 right-3.5 top-3.5 h-px bg-white/8" />
          <div
            className="absolute left-3.5 top-3.5 h-px bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
            style={{
              width: `calc(${(CURRENT_STAGE_INDEX / (STAGES.length - 1)) * 100}% - 0px)`,
            }}
          />

          {STAGES.map((stage, i) => {
            const done = i < CURRENT_STAGE_INDEX
            const active = i === CURRENT_STAGE_INDEX
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
            <span>Progress in {STAGES[CURRENT_STAGE_INDEX]}</span>
            <span>{STAGE_COMPLETION}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
              style={{ width: `${STAGE_COMPLETION}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Metrics Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {METRICS.map(metric => (
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
              {AI_INSIGHTS.map((insight, i) => (
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

      {/* ── Bottom Grid: Activity Feed | Opportunities ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Founder Activity Feed */}
        <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-0.5">Founder Activity</h2>
          <p className="text-xs text-slate-500 mb-5">What others in the community are accomplishing</p>

          <div className="flex flex-col divide-y divide-white/5">
            {FEED.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-bold">{item.initials}</span>
                </div>
                <p className="flex-1 text-sm text-slate-300 leading-snug min-w-0">
                  <span className="font-semibold">{item.name}</span>{' '}
                  <span className="text-slate-400">{item.action}</span>
                </p>
                <span className="text-xs text-slate-600 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>

          <button className="mt-5 w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors border border-white/8 rounded-lg">
            View all activity
          </button>
        </div>

        {/* Upcoming Opportunities */}
        <div className="rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-0.5">Upcoming Opportunities</h2>
          <p className="text-xs text-slate-500 mb-5">Hackathons, competitions, accelerators & grants</p>

          <div className="flex flex-col gap-3">
            {OPPORTUNITIES.map(opp => (
              <div
                key={opp.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 leading-snug mb-2">
                    {opp.title}
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${OPPORTUNITY_TYPE_STYLE[opp.type]}`}>
                      {opp.type}
                    </span>
                    <span className="text-xs text-slate-500">{opp.date}</span>
                    <span className="text-xs text-slate-600">Deadline: {opp.deadline}</span>
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0">
                  <ChevronRight />
                </span>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors border border-white/8 rounded-lg">
            View all opportunities
          </button>
        </div>

      </div>
    </div>
  )
}
