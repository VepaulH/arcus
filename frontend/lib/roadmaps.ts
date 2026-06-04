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

export interface RoadmapNode {
  id: string
  label: string
  x: number
  y: number
  status: NodeStatus
  progress: number
}

export interface RoadmapEdge { from: string; to: string }

export interface RoadmapTemplate {
  id: RoadmapId
  name: string
  description: string
  nodes: RoadmapNode[]
  edges: RoadmapEdge[]
}

const N = { W: 160, H: 78 }

function locked(id: string, label: string, x: number, y: number): RoadmapNode {
  return { id, label, x, y, status: 'locked', progress: 0 }
}

export const ROADMAP_TEMPLATES: Record<RoadmapId, RoadmapTemplate> = {

  'solo-ideation': {
    id: 'solo-ideation',
    name: 'Solo Founder — Find Your Co-founder',
    description: 'Validate your idea from scratch and find the right person to build with.',
    nodes: [
      { id: 'clarify-idea',        label: 'Clarify Your Idea',    x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'define-problem',      label: 'Define the Problem',   x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'target-audience',     label: 'Target Audience',      x: 310,  y: 330, status: 'available', progress: 0 },
      locked('market-research',     'Market Research',             580,  90),
      locked('customer-interviews', 'Customer Interviews',         580,  330),
      locked('ps-fit',              'Problem-Solution Fit',        850,  210),
      locked('find-cofounder',      'Find Co-founder',             1120, 90),
      locked('competitor-analysis', 'Competitor Analysis',         1120, 330),
      locked('align-vision',        'Align on Vision',             1390, 210),
      locked('plan-mvp',            'Plan Your MVP',               1660, 210),
    ],
    edges: [
      { from: 'clarify-idea',        to: 'define-problem' },
      { from: 'clarify-idea',        to: 'target-audience' },
      { from: 'define-problem',      to: 'market-research' },
      { from: 'target-audience',     to: 'customer-interviews' },
      { from: 'market-research',     to: 'ps-fit' },
      { from: 'customer-interviews', to: 'ps-fit' },
      { from: 'ps-fit',              to: 'find-cofounder' },
      { from: 'ps-fit',              to: 'competitor-analysis' },
      { from: 'find-cofounder',      to: 'align-vision' },
      { from: 'competitor-analysis', to: 'align-vision' },
      { from: 'align-vision',        to: 'plan-mvp' },
    ],
  },

  'team-ideation': {
    id: 'team-ideation',
    name: 'Team — Validate & Plan MVP',
    description: 'You have a team. Now align your vision, validate the problem, and plan your build.',
    nodes: [
      { id: 'align-vision',        label: 'Align Team Vision',    x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'define-problem',      label: 'Define the Problem',   x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'market-research',     label: 'Market Research',      x: 310,  y: 330, status: 'available', progress: 0 },
      locked('customer-interviews', 'Customer Interviews',         580,  90),
      locked('competitor-analysis', 'Competitor Analysis',         580,  330),
      locked('ps-fit',              'Problem-Solution Fit',        850,  210),
      locked('business-model',      'Business Model',              1120, 90),
      locked('tech-scoping',        'Tech Scoping',                1120, 330),
      locked('mvp-planning',        'MVP Planning',                1390, 210),
      locked('start-building',      'Start Building',              1660, 210),
    ],
    edges: [
      { from: 'align-vision',        to: 'define-problem' },
      { from: 'align-vision',        to: 'market-research' },
      { from: 'define-problem',      to: 'customer-interviews' },
      { from: 'market-research',     to: 'competitor-analysis' },
      { from: 'customer-interviews', to: 'ps-fit' },
      { from: 'competitor-analysis', to: 'ps-fit' },
      { from: 'ps-fit',              to: 'business-model' },
      { from: 'ps-fit',              to: 'tech-scoping' },
      { from: 'business-model',      to: 'mvp-planning' },
      { from: 'tech-scoping',        to: 'mvp-planning' },
      { from: 'mvp-planning',        to: 'start-building' },
    ],
  },

  'technical-validation': {
    id: 'technical-validation',
    name: 'Technical Founder — Build & Validate',
    description: 'You can build. The challenge is validating fast and shipping to real users.',
    nodes: [
      { id: 'define-mvp',          label: 'Define MVP Scope',     x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'architecture',        label: 'Tech Architecture',    x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'first-prototype',     label: 'First Prototype',      x: 310,  y: 330, status: 'available', progress: 0 },
      locked('user-testing',        'User Testing',                580,  90),
      locked('iterate-fast',        'Iterate Fast',                580,  330),
      locked('ps-fit',              'Problem-Solution Fit',        850,  210),
      locked('beta-users',          'First 10 Beta Users',         1120, 90),
      locked('pricing-hypothesis',  'Pricing Hypothesis',          1120, 330),
      locked('product-metrics',     'Define Key Metrics',          1390, 210),
      locked('launch-v1',           'Launch V1',                   1660, 210),
    ],
    edges: [
      { from: 'define-mvp',         to: 'architecture' },
      { from: 'define-mvp',         to: 'first-prototype' },
      { from: 'architecture',       to: 'user-testing' },
      { from: 'first-prototype',    to: 'iterate-fast' },
      { from: 'user-testing',       to: 'ps-fit' },
      { from: 'iterate-fast',       to: 'ps-fit' },
      { from: 'ps-fit',             to: 'beta-users' },
      { from: 'ps-fit',             to: 'pricing-hypothesis' },
      { from: 'beta-users',         to: 'product-metrics' },
      { from: 'pricing-hypothesis', to: 'product-metrics' },
      { from: 'product-metrics',    to: 'launch-v1' },
    ],
  },

  'non-technical-validation': {
    id: 'non-technical-validation',
    name: 'Non-Technical Founder — Validate First',
    description: "You don't need to code to validate. Prove the demand, then find the people to build it.",
    nodes: [
      { id: 'define-product',      label: 'Define Your Product',  x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'user-journey',        label: 'Map User Journey',     x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'market-validation',   label: 'Market Validation',    x: 310,  y: 330, status: 'available', progress: 0 },
      locked('no-code-mvp',         'No-Code MVP',                 580,  90),
      locked('validate-demand',     'Validate Demand',             580,  330),
      locked('ps-fit',              'Problem-Solution Fit',        850,  210),
      locked('find-tech-partner',   'Find Tech Partner',           1120, 90),
      locked('funding-options',     'Explore Funding',             1120, 330),
      locked('define-v1',           'Define V1 Spec',              1390, 210),
      locked('start-build',         'Start Development',           1660, 210),
    ],
    edges: [
      { from: 'define-product',    to: 'user-journey' },
      { from: 'define-product',    to: 'market-validation' },
      { from: 'user-journey',      to: 'no-code-mvp' },
      { from: 'market-validation', to: 'validate-demand' },
      { from: 'no-code-mvp',       to: 'ps-fit' },
      { from: 'validate-demand',   to: 'ps-fit' },
      { from: 'ps-fit',            to: 'find-tech-partner' },
      { from: 'ps-fit',            to: 'funding-options' },
      { from: 'find-tech-partner', to: 'define-v1' },
      { from: 'funding-options',   to: 'define-v1' },
      { from: 'define-v1',         to: 'start-build' },
    ],
  },

  'building-to-launch': {
    id: 'building-to-launch',
    name: 'Building → First Revenue',
    description: 'You are building. Stay focused on the smallest thing that earns your first dollar.',
    nodes: [
      { id: 'mvp-scope',           label: 'Lock MVP Scope',       x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'core-features',       label: 'Core Features',        x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'user-onboarding',     label: 'Onboarding Flow',      x: 310,  y: 330, status: 'available', progress: 0 },
      locked('beta-launch',         'Beta Launch',                 580,  90),
      locked('user-feedback',       'Collect Feedback',            580,  330),
      locked('iterate',             'Iterate & Fix',               850,  210),
      locked('public-launch',       'Public Launch',               1120, 210),
      locked('user-acquisition',    'User Acquisition',            1390, 90),
      locked('analytics',           'Analytics & Metrics',         1390, 330),
      locked('first-revenue',       'First Revenue',               1660, 210),
    ],
    edges: [
      { from: 'mvp-scope',         to: 'core-features' },
      { from: 'mvp-scope',         to: 'user-onboarding' },
      { from: 'core-features',     to: 'beta-launch' },
      { from: 'user-onboarding',   to: 'user-feedback' },
      { from: 'beta-launch',       to: 'iterate' },
      { from: 'user-feedback',     to: 'iterate' },
      { from: 'iterate',           to: 'public-launch' },
      { from: 'public-launch',     to: 'user-acquisition' },
      { from: 'public-launch',     to: 'analytics' },
      { from: 'user-acquisition',  to: 'first-revenue' },
      { from: 'analytics',         to: 'first-revenue' },
    ],
  },

  'revenue-acceleration': {
    id: 'revenue-acceleration',
    name: 'Accelerate Revenue',
    description: "You've got early revenue. The goal now is to understand why and pour fuel on it.",
    nodes: [
      { id: 'revenue-analysis',    label: 'Revenue Analysis',     x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'retention',           label: 'Retention Strategy',   x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'pricing',             label: 'Pricing Optimization', x: 310,  y: 330, status: 'available', progress: 0 },
      locked('sales-process',       'Sales Process',               580,  90),
      locked('marketing-channel',   'Marketing Channel',           580,  330),
      locked('pmf-check',           'PMF Signals',                 850,  210),
      locked('team-hire',           'Key Hire',                    1120, 90),
      locked('scale-ops',           'Scale Operations',            1120, 330),
      locked('scale-revenue',       'Scale Revenue',               1390, 210),
      locked('fundraising-prep',    'Fundraising Prep',            1660, 210),
    ],
    edges: [
      { from: 'revenue-analysis',  to: 'retention' },
      { from: 'revenue-analysis',  to: 'pricing' },
      { from: 'retention',         to: 'sales-process' },
      { from: 'pricing',           to: 'marketing-channel' },
      { from: 'sales-process',     to: 'pmf-check' },
      { from: 'marketing-channel', to: 'pmf-check' },
      { from: 'pmf-check',         to: 'team-hire' },
      { from: 'pmf-check',         to: 'scale-ops' },
      { from: 'team-hire',         to: 'scale-revenue' },
      { from: 'scale-ops',         to: 'scale-revenue' },
      { from: 'scale-revenue',     to: 'fundraising-prep' },
    ],
  },

  'growth-hacking': {
    id: 'growth-hacking',
    name: 'Launch → Growth',
    description: "You've launched. Now build the engine that brings users in faster than they churn.",
    nodes: [
      { id: 'growth-model',        label: 'Define Growth Model',  x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'acquisition',         label: 'Acquisition Channels', x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'conversion',          label: 'Conversion Opt.',      x: 310,  y: 330, status: 'available', progress: 0 },
      locked('retention-engine',    'Retention Engine',            580,  90),
      locked('referral-program',    'Referral Program',            580,  330),
      locked('pmf-check',           'PMF Confirmation',            850,  210),
      locked('paid-channels',       'Paid Channels',               1120, 90),
      locked('community',           'Community Building',          1120, 330),
      locked('growth-analytics',    'Growth Analytics',            1390, 210),
      locked('scale-marketing',     'Scale Marketing',             1660, 210),
    ],
    edges: [
      { from: 'growth-model',      to: 'acquisition' },
      { from: 'growth-model',      to: 'conversion' },
      { from: 'acquisition',       to: 'retention-engine' },
      { from: 'conversion',        to: 'referral-program' },
      { from: 'retention-engine',  to: 'pmf-check' },
      { from: 'referral-program',  to: 'pmf-check' },
      { from: 'pmf-check',         to: 'paid-channels' },
      { from: 'pmf-check',         to: 'community' },
      { from: 'paid-channels',     to: 'growth-analytics' },
      { from: 'community',         to: 'growth-analytics' },
      { from: 'growth-analytics',  to: 'scale-marketing' },
    ],
  },

  'fundraising-track': {
    id: 'fundraising-track',
    name: 'Raise Your Round',
    description: "You have traction. Time to build the story, find the right investors, and close.",
    nodes: [
      { id: 'financial-model',     label: 'Financial Model',      x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'key-metrics',         label: 'Key Metrics',          x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'investor-narrative',  label: 'Investor Narrative',   x: 310,  y: 330, status: 'available', progress: 0 },
      locked('deck-creation',       'Pitch Deck',                  580,  90),
      locked('angel-network',       'Angel Network',               580,  330),
      locked('due-diligence',       'Due Diligence Prep',          850,  210),
      locked('accelerator',         'Accelerator Apps',            1120, 90),
      locked('seed-round',          'Seed Round',                  1120, 330),
      locked('post-seed-growth',    'Post-Seed Growth',            1390, 210),
      locked('series-a-prep',       'Series A Prep',               1660, 210),
    ],
    edges: [
      { from: 'financial-model',    to: 'key-metrics' },
      { from: 'financial-model',    to: 'investor-narrative' },
      { from: 'key-metrics',        to: 'deck-creation' },
      { from: 'investor-narrative', to: 'angel-network' },
      { from: 'deck-creation',      to: 'due-diligence' },
      { from: 'angel-network',      to: 'due-diligence' },
      { from: 'due-diligence',      to: 'accelerator' },
      { from: 'due-diligence',      to: 'seed-round' },
      { from: 'accelerator',        to: 'post-seed-growth' },
      { from: 'seed-round',         to: 'post-seed-growth' },
      { from: 'post-seed-growth',   to: 'series-a-prep' },
    ],
  },

  'student-founder': {
    id: 'student-founder',
    name: 'Student Founder',
    description: "Your university is your unfair advantage. Use it before you graduate.",
    nodes: [
      { id: 'campus-problem',           label: 'Campus Problem',       x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'university-resources',     label: 'University Resources', x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'build-team',               label: 'Build Your Team',      x: 310,  y: 330, status: 'available', progress: 0 },
      locked('mentor-network',           'Mentor Network',              580,  90),
      locked('no-code-mvp',              'No-Code MVP',                 580,  330),
      locked('ps-fit',                   'Problem-Solution Fit',        850,  210),
      locked('competitions',             'Student Competitions',        1120, 90),
      locked('campus-launch',            'Campus Launch',               1120, 330),
      locked('iterate',                  'Iterate & Grow',              1390, 210),
      locked('graduate-strategy',        'Graduate Strategy',           1660, 210),
    ],
    edges: [
      { from: 'campus-problem',      to: 'university-resources' },
      { from: 'campus-problem',      to: 'build-team' },
      { from: 'university-resources',to: 'mentor-network' },
      { from: 'build-team',          to: 'no-code-mvp' },
      { from: 'mentor-network',      to: 'ps-fit' },
      { from: 'no-code-mvp',         to: 'ps-fit' },
      { from: 'ps-fit',              to: 'competitions' },
      { from: 'ps-fit',              to: 'campus-launch' },
      { from: 'competitions',        to: 'iterate' },
      { from: 'campus-launch',       to: 'iterate' },
      { from: 'iterate',             to: 'graduate-strategy' },
    ],
  },

  'scaling-revenue': {
    id: 'scaling-revenue',
    name: 'Scale What Works',
    description: "You have product-market fit. The job now is operational excellence and expansion.",
    nodes: [
      { id: 'revenue-audit',            label: 'Revenue Audit',        x: 40,   y: 210, status: 'active',    progress: 0 },
      { id: 'unit-economics',           label: 'Unit Economics',       x: 310,  y: 90,  status: 'available', progress: 0 },
      { id: 'ops-efficiency',           label: 'Ops Efficiency',       x: 310,  y: 330, status: 'available', progress: 0 },
      locked('scale-sales',              'Scale Sales',                 580,  90),
      locked('team-building',            'Team Building',               580,  330),
      locked('market-expansion',         'Market Expansion',            850,  210),
      locked('strategic-partners',       'Strategic Partners',          1120, 90),
      locked('process-automation',       'Process Automation',          1120, 330),
      locked('series-a',                 'Series A / B',                1390, 210),
      locked('profitability',            'Path to Profit',              1660, 210),
    ],
    edges: [
      { from: 'revenue-audit',      to: 'unit-economics' },
      { from: 'revenue-audit',      to: 'ops-efficiency' },
      { from: 'unit-economics',     to: 'scale-sales' },
      { from: 'ops-efficiency',     to: 'team-building' },
      { from: 'scale-sales',        to: 'market-expansion' },
      { from: 'team-building',      to: 'market-expansion' },
      { from: 'market-expansion',   to: 'strategic-partners' },
      { from: 'market-expansion',   to: 'process-automation' },
      { from: 'strategic-partners', to: 'series-a' },
      { from: 'process-automation', to: 'series-a' },
      { from: 'series-a',           to: 'profitability' },
    ],
  },
}

export const NODE_W = 160
export const NODE_H = 78
export const SVG_W  = 1865
export const SVG_H  = 460
