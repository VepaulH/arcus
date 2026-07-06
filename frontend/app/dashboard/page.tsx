'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { profileApi, onboardingApi, connectionsApi, goalsApi, opportunitiesApi } from '../../lib/api'
import type { Goal, Opportunity } from '../../lib/api'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Task {
  id: number
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string | null
  completed: boolean
}


interface Metric {
  label: string
  value: string | number
  delta: string | null
}


// ── Mock data ──────────────────────────────────────────────────────────────────

const STAGES = ['Ideation', 'Validation', 'Building', 'Launch', 'Growth']

type TaskTemplate = { title: string; description: string; priority: Task['priority'] }

const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  'solo-ideation': [
    { title: 'Interview 10 potential customers',  description: 'Talk directly to people who have the problem you\'re solving — before writing a line of code.',      priority: 'High'   },
    { title: 'Write a 1-sentence problem statement', description: 'Force clarity: who has this problem, what is the pain, and why does it matter now?',              priority: 'High'   },
    { title: 'Research 5 direct competitors',     description: 'Understand who else is solving this and where the gaps are.',                                         priority: 'Medium' },
    { title: 'Start co-founder search',           description: 'Reach out to 5 potential co-founders in your network with complementary skills.',                    priority: 'Medium' },
    { title: 'Define your target customer profile', description: 'Write down the specific type of person you\'re building for — job, pain, behaviour.',               priority: 'Low'    },
  ],
  'team-ideation': [
    { title: 'Run a team vision alignment session', description: 'Get everyone on the same page on the problem, the customer, and the goal.',                        priority: 'High'   },
    { title: 'Interview 15 potential customers',  description: 'Do this together as a team — different founders hear different things.',                              priority: 'High'   },
    { title: 'Map the competitive landscape',     description: 'List your top 5 competitors, their pricing, and their weaknesses.',                                  priority: 'Medium' },
    { title: 'Document your unfair advantages',   description: 'What does your team know, own, or access that others don\'t?',                                       priority: 'Medium' },
    { title: 'Agree on a go-to-market hypothesis', description: 'Pick one channel and one customer segment to test first.',                                          priority: 'Low'    },
  ],
  'technical-validation': [
    { title: 'Ship a testable prototype',         description: 'Build the smallest thing that lets real users experience the core value.',                           priority: 'High'   },
    { title: 'Recruit 10 beta users',             description: 'Find real people outside your team to test the prototype — not friends.',                           priority: 'High'   },
    { title: 'Run 5 structured user testing sessions', description: 'Observe, don\'t guide. Watch where users get stuck and what they ignore.',                    priority: 'Medium' },
    { title: 'Define your core value metric',     description: 'What single number tells you the product is working for users?',                                    priority: 'Medium' },
    { title: 'Document technical architecture decisions', description: 'Write down the key trade-offs you\'ve made and why.',                                       priority: 'Low'    },
  ],
  'non-technical-validation': [
    { title: 'Create a demand-testing landing page', description: 'Build a simple page that explains the value and collects signups — no code needed.',             priority: 'High'   },
    { title: 'Interview 15 target customers',     description: 'Focus on the problem, not your solution. Listen for emotion and frequency.',                        priority: 'High'   },
    { title: 'Identify a technical partner or co-founder', description: 'You need someone who can build it — start that search now.',                              priority: 'Medium' },
    { title: 'Build a no-code prototype',         description: 'Use Figma, Webflow, or Notion to simulate the experience without engineering.',                     priority: 'Medium' },
    { title: 'Collect 50 waitlist signups',        description: 'Real demand signal: people giving you their email for something that doesn\'t exist yet.',         priority: 'Low'    },
  ],
  'building-to-launch': [
    { title: 'Ship core feature to beta users',   description: 'Get the one thing that defines your product into users\' hands — cut everything else.',            priority: 'High'   },
    { title: 'Onboard 20 beta users hands-on',    description: 'Walk them through it yourself. You\'ll spot problems no automated test will catch.',               priority: 'High'   },
    { title: 'Run weekly user feedback sessions', description: 'Block time every week to talk to users. Make it a habit, not an event.',                            priority: 'Medium' },
    { title: 'Define your launch channel',        description: 'Pick one: Product Hunt, a Reddit community, your network. One focused bet beats three half-tries.', priority: 'Medium' },
    { title: 'Set up analytics tracking',         description: 'Instrument the actions that matter before launch so you have a baseline from day one.',             priority: 'Low'    },
  ],
  'revenue-acceleration': [
    { title: 'Interview 5 churned customers',     description: 'Churn is data. Find out what made them leave — it\'s usually one specific moment.',                priority: 'High'   },
    { title: 'Nail down your pricing structure',  description: 'Test a price increase on new customers. Willingness to pay is higher than founders think.',        priority: 'High'   },
    { title: 'Build a simple sales pipeline',     description: 'Track every deal in a spreadsheet or CRM — lead, contacted, demo, closed.',                        priority: 'Medium' },
    { title: 'Run 3 retention experiments',       description: 'Activation email, onboarding checklist, check-in call — pick one and measure it.',                 priority: 'Medium' },
    { title: 'Document your customer onboarding flow', description: 'Write down every step from sign-up to first value. Every friction point is lost revenue.',   priority: 'Low'    },
  ],
  'growth-hacking': [
    { title: 'Double down on your top acquisition channel', description: 'Kill the channels that aren\'t working and put all budget into the one that is.',       priority: 'High'   },
    { title: 'Launch a referral programme',       description: 'The cheapest customer is one who was sent by another customer. Make it easy to share.',            priority: 'High'   },
    { title: 'A/B test your landing page headline', description: 'Your headline is your most-read sentence. A 10% lift here compounds across every visitor.',    priority: 'Medium' },
    { title: 'Optimise the user onboarding funnel', description: 'Map activation drop-off step by step. Fix the biggest leak first.',                             priority: 'Medium' },
    { title: 'Set up weekly retention cohort tracking', description: 'Growth without retention is a leaky bucket. Know your D7, D30 numbers.',                   priority: 'Low'    },
  ],
  'fundraising-track': [
    { title: 'Prepare a concise 10-slide pitch deck', description: 'Problem, solution, market, traction, team, ask. Every slide should earn its place.',         priority: 'High'   },
    { title: 'Build a list of 20 target investors',  description: 'Research stage, cheque size, and portfolio fit before reaching out to anyone.',               priority: 'High'   },
    { title: 'Get 5 warm introductions',           description: 'Cold emails close at 1%. A warm intro from a portfolio founder closes at 20%+.',                 priority: 'Medium' },
    { title: 'Update your financial model',        description: 'Investors will stress-test your numbers. Know your assumptions inside out.',                      priority: 'Medium' },
    { title: 'Prepare a due diligence data room',  description: 'Cap table, contracts, financials, IP ownership. Have it ready before the first meeting.',        priority: 'Low'    },
  ],
  'student-founder': [
    { title: 'Interview 10 people who have this problem', description: 'Your campus is a live focus group — use it. Talk to students, staff, and professors.',  priority: 'High'   },
    { title: 'Apply to one startup competition',  description: 'Competitions force clarity, build your network, and can fund early experiments.',                  priority: 'High'   },
    { title: 'Meet with a professor or advisor',  description: 'University advisors have seen hundreds of early-stage ideas — their patterns are valuable.',       priority: 'Medium' },
    { title: 'Validate on campus first',          description: 'Prove the idea works in a small, contained environment before thinking bigger.',                   priority: 'Medium' },
    { title: 'Find a co-founder through your programme', description: 'Look in your CS, business, or design department for complementary skills.',               priority: 'Low'    },
  ],
  'scaling-revenue': [
    { title: 'Make your next key hire',           description: 'One great hire at this stage is worth more than three okay ones. Be patient and specific.',        priority: 'High'   },
    { title: 'Build a repeatable sales process',  description: 'Document every step from lead to close so any future rep can follow it without you.',             priority: 'High'   },
    { title: 'Automate one manual internal workflow', description: 'Find the most time-consuming manual task and eliminate it.',                                  priority: 'Medium' },
    { title: 'Set up monthly business reviews',   description: 'Revenue, churn, NPS, runway. One hour a month looking at the same numbers builds discipline.',    priority: 'Medium' },
    { title: 'Research Series A benchmarks for your sector', description: 'Know the ARR, growth rate, and NRR investors expect before you need to raise.',      priority: 'Low'    },
  ],
}

function buildTasks(roadmapId: string | null | undefined): Task[] {
  const templates = TASK_TEMPLATES[roadmapId ?? ''] ?? TASK_TEMPLATES['solo-ideation']
  return templates.map((t, i) => ({ ...t, id: i + 1, dueDate: null, completed: false }))
}

const FALLBACK_GOALS: Goal[] = []

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
  const [tasks, setTasks] = useState<Task[]>([])
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
  const [goals, setGoals] = useState<Goal[]>(FALLBACK_GOALS)
  const [goalsLoading, setGoalsLoading] = useState(true)
  const [goalsError, setGoalsError] = useState<string | null>(null)
  const [incrementing, setIncrementing] = useState<Set<string>>(new Set())
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  async function handleIncrement(id: string) {
    setIncrementing(prev => new Set(prev).add(id))
    const { data } = await goalsApi.increment(id)
    if (data) setGoals(prev => prev.map(g => g.id === id ? data : g))
    setIncrementing(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  async function handleDecrement(id: string) {
    setIncrementing(prev => new Set(prev).add(id))
    const { data } = await goalsApi.decrement(id)
    if (data) setGoals(prev => prev.map(g => g.id === id ? data : g))
    setIncrementing(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  useEffect(() => {
    setGreeting(computeGreeting())
    if (localStorage.getItem('arcus_needs_onboarding') === 'true') {
      setShowWelcome(true)
    }
    goalsApi.getAll().then(({ data, error }) => {
      if (error) setGoalsError(error)
      else setGoals(data ?? [])
      setGoalsLoading(false)
    })
    opportunitiesApi.getAll().then(({ data }) => {
      if (data) setOpportunities(data)
    })
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

      setTasks(buildTasks(o?.roadmap_id))
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
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300">
            Currently here
          </span>
        </div>

        {/* Stage steps */}
        <div className="relative flex items-start justify-between">
          <div className="absolute left-3.5 right-3.5 top-3.5 h-px bg-white/8" />
          <div
            className="absolute left-3.5 top-3.5 h-px bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
            style={{ width: `calc(${(currentStageIndex / (STAGES.length - 1)) * 100}% - 0px)` }}
          />

          {STAGES.map((stage, i) => {
            const done   = i < currentStageIndex
            const active = i === currentStageIndex
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center gap-2" style={{ flex: 1 }}>
                {/* Ring around active dot */}
                {active && (
                  <div className="absolute top-0 w-7 h-7 rounded-full ring-4 ring-blue-400/25 animate-pulse" />
                )}
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : active
                    ? 'bg-blue-500 border-blue-300 text-white'
                    : 'bg-[#0b1220] border-white/15 text-slate-600'
                }`}>
                  {done ? <CheckIcon /> : active ? <span className="text-[10px]">●</span> : <span>{i + 1}</span>}
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${
                  done ? 'text-blue-400' : active ? 'text-blue-300 font-semibold' : 'text-slate-600'
                }`}>
                  {stage}
                </span>
              </div>
            )
          })}
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

            {goalsLoading ? (
              <p className="text-xs text-slate-600">Loading…</p>
            ) : goalsError ? (
              <p className="text-xs text-red-400">{goalsError}</p>
            ) : goals.length === 0 ? (
              <p className="text-xs text-slate-600">No goals yet — complete onboarding to generate them.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {goals.map(goal => {
                  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
                  const done = pct >= 100
                  const busy = incrementing.has(goal.id)
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">{goal.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 tabular-nums">
                            {goal.current}/{goal.target} {goal.unit}
                          </span>
                          {goal.current > 0 && (
                            <button
                              onClick={() => handleDecrement(goal.id)}
                              disabled={busy}
                              className="w-5 h-5 rounded-full border border-white/15 bg-white/5 hover:bg-red-500/15 hover:border-red-400/30 text-slate-500 hover:text-red-400 flex items-center justify-center transition-colors disabled:opacity-40 text-base leading-none"
                              aria-label="Decrement"
                            >
                              −
                            </button>
                          )}
                          {!done && (
                            <button
                              onClick={() => handleIncrement(goal.id)}
                              disabled={busy}
                              className="w-5 h-5 rounded-full border border-white/15 bg-white/5 hover:bg-blue-500/20 hover:border-blue-400/40 text-slate-400 hover:text-blue-300 flex items-center justify-center transition-colors disabled:opacity-40 text-base leading-none"
                              aria-label="Increment"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{pct}%{done ? ' — complete!' : ''}</p>
                    </div>
                  )
                })}
              </div>
            )}
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

        {opportunities.length === 0 ? (
          <p className="text-sm text-slate-500">No opportunities available right now — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opportunities.map(opp => (
              <a
                key={opp.id}
                href={opp.url}
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
        )}
      </div>
    </div>
  )
}
