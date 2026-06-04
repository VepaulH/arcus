// Roadmap matching + initial-seed definitions.
// Node x/y layout lives in the frontend; the backend only needs node IDs and initial statuses.

export type RoadmapId =
  | 'solo-ideation'
  | 'team-ideation'
  | 'technical-validation'
  | 'non-technical-validation'
  | 'building-to-launch'
  | 'revenue-acceleration'
  | 'growth-hacking'
  | 'fundraising-track'
  | 'student-founder'
  | 'scaling-revenue'

export type NodeStatus = 'active' | 'available' | 'locked'

// Initial status for each node when a roadmap is first assigned.
// First node = active, its immediate children = available, rest = locked.
export const ROADMAP_INITIAL_NODES: Record<RoadmapId, { id: string; status: NodeStatus }[]> = {
  'solo-ideation': [
    { id: 'clarify-idea',        status: 'active' },
    { id: 'define-problem',      status: 'available' },
    { id: 'target-audience',     status: 'available' },
    { id: 'market-research',     status: 'locked' },
    { id: 'customer-interviews', status: 'locked' },
    { id: 'ps-fit',              status: 'locked' },
    { id: 'find-cofounder',      status: 'locked' },
    { id: 'competitor-analysis', status: 'locked' },
    { id: 'align-vision',        status: 'locked' },
    { id: 'plan-mvp',            status: 'locked' },
  ],
  'team-ideation': [
    { id: 'align-vision',        status: 'active' },
    { id: 'define-problem',      status: 'available' },
    { id: 'market-research',     status: 'available' },
    { id: 'customer-interviews', status: 'locked' },
    { id: 'competitor-analysis', status: 'locked' },
    { id: 'ps-fit',              status: 'locked' },
    { id: 'business-model',      status: 'locked' },
    { id: 'tech-scoping',        status: 'locked' },
    { id: 'mvp-planning',        status: 'locked' },
    { id: 'start-building',      status: 'locked' },
  ],
  'technical-validation': [
    { id: 'define-mvp',          status: 'active' },
    { id: 'architecture',        status: 'available' },
    { id: 'first-prototype',     status: 'available' },
    { id: 'user-testing',        status: 'locked' },
    { id: 'iterate-fast',        status: 'locked' },
    { id: 'ps-fit',              status: 'locked' },
    { id: 'beta-users',          status: 'locked' },
    { id: 'pricing-hypothesis',  status: 'locked' },
    { id: 'product-metrics',     status: 'locked' },
    { id: 'launch-v1',           status: 'locked' },
  ],
  'non-technical-validation': [
    { id: 'define-product',      status: 'active' },
    { id: 'user-journey',        status: 'available' },
    { id: 'market-validation',   status: 'available' },
    { id: 'no-code-mvp',         status: 'locked' },
    { id: 'validate-demand',     status: 'locked' },
    { id: 'ps-fit',              status: 'locked' },
    { id: 'find-tech-partner',   status: 'locked' },
    { id: 'funding-options',     status: 'locked' },
    { id: 'define-v1',           status: 'locked' },
    { id: 'start-build',         status: 'locked' },
  ],
  'building-to-launch': [
    { id: 'mvp-scope',           status: 'active' },
    { id: 'core-features',       status: 'available' },
    { id: 'user-onboarding',     status: 'available' },
    { id: 'beta-launch',         status: 'locked' },
    { id: 'user-feedback',       status: 'locked' },
    { id: 'iterate',             status: 'locked' },
    { id: 'public-launch',       status: 'locked' },
    { id: 'user-acquisition',    status: 'locked' },
    { id: 'analytics',           status: 'locked' },
    { id: 'first-revenue',       status: 'locked' },
  ],
  'revenue-acceleration': [
    { id: 'revenue-analysis',    status: 'active' },
    { id: 'retention',           status: 'available' },
    { id: 'pricing',             status: 'available' },
    { id: 'sales-process',       status: 'locked' },
    { id: 'marketing-channel',   status: 'locked' },
    { id: 'pmf-check',           status: 'locked' },
    { id: 'team-hire',           status: 'locked' },
    { id: 'scale-ops',           status: 'locked' },
    { id: 'scale-revenue',       status: 'locked' },
    { id: 'fundraising-prep',    status: 'locked' },
  ],
  'growth-hacking': [
    { id: 'growth-model',        status: 'active' },
    { id: 'acquisition',         status: 'available' },
    { id: 'conversion',          status: 'available' },
    { id: 'retention-engine',    status: 'locked' },
    { id: 'referral-program',    status: 'locked' },
    { id: 'pmf-check',           status: 'locked' },
    { id: 'paid-channels',       status: 'locked' },
    { id: 'community',           status: 'locked' },
    { id: 'growth-analytics',    status: 'locked' },
    { id: 'scale-marketing',     status: 'locked' },
  ],
  'fundraising-track': [
    { id: 'financial-model',     status: 'active' },
    { id: 'key-metrics',         status: 'available' },
    { id: 'investor-narrative',  status: 'available' },
    { id: 'deck-creation',       status: 'locked' },
    { id: 'angel-network',       status: 'locked' },
    { id: 'due-diligence',       status: 'locked' },
    { id: 'accelerator',         status: 'locked' },
    { id: 'seed-round',          status: 'locked' },
    { id: 'post-seed-growth',    status: 'locked' },
    { id: 'series-a-prep',       status: 'locked' },
  ],
  'student-founder': [
    { id: 'campus-problem',           status: 'active' },
    { id: 'university-resources',     status: 'available' },
    { id: 'build-team',               status: 'available' },
    { id: 'mentor-network',           status: 'locked' },
    { id: 'no-code-mvp',              status: 'locked' },
    { id: 'ps-fit',                   status: 'locked' },
    { id: 'competitions',             status: 'locked' },
    { id: 'campus-launch',            status: 'locked' },
    { id: 'iterate',                  status: 'locked' },
    { id: 'graduate-strategy',        status: 'locked' },
  ],
  'scaling-revenue': [
    { id: 'revenue-audit',            status: 'active' },
    { id: 'unit-economics',           status: 'available' },
    { id: 'ops-efficiency',           status: 'available' },
    { id: 'scale-sales',              status: 'locked' },
    { id: 'team-building',            status: 'locked' },
    { id: 'market-expansion',         status: 'locked' },
    { id: 'strategic-partners',       status: 'locked' },
    { id: 'process-automation',       status: 'locked' },
    { id: 'series-a',                 status: 'locked' },
    { id: 'profitability',            status: 'locked' },
  ],
}

const TECHNICAL_SKILLS = new Set([
  'Frontend', 'Backend', 'Mobile', 'React', 'Python', 'Go', 'DevOps', 'AWS', 'ML / AI',
])

export function computeRoadmapId(answers: {
  startup_stage: string
  position: string
  revenue_range: string
  looking_for: string
  skills: string[]
  experience: string
}): RoadmapId {
  const { startup_stage, experience, looking_for, skills, revenue_range } = answers

  const isStudent      = experience === 'Student'
  const isTechnical    = skills.some(s => TECHNICAL_SKILLS.has(s))
  const seeksCofounder = looking_for === 'Yes — looking for a co-founder'
  const hasTeam        = looking_for === 'I already have a team'
  const hasHighRevenue = revenue_range === '$10K – $100K / month' || revenue_range === '$100K+ / month'
  const hasRevenue     = revenue_range !== 'Pre-revenue' && revenue_range !== '' && revenue_range != null

  if (isStudent && (startup_stage === 'Ideation' || startup_stage === 'Validation')) {
    return 'student-founder'
  }

  switch (startup_stage) {
    case 'Ideation':
      return (seeksCofounder || !hasTeam) ? 'solo-ideation' : 'team-ideation'

    case 'Validation':
      return isTechnical ? 'technical-validation' : 'non-technical-validation'

    case 'Building':
      return hasRevenue ? 'revenue-acceleration' : 'building-to-launch'

    case 'Launch':
      return hasHighRevenue ? 'fundraising-track' : 'growth-hacking'

    case 'Growth':
      return hasHighRevenue ? 'fundraising-track' : 'scaling-revenue'

    default:
      return 'solo-ideation'
  }
}
