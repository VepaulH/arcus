// Stage-appropriate goal seeds. Seeded once when the user completes onboarding.
export const GOAL_SEEDS: Record<string, { title: string; target: number; unit: string }[]> = {
  Ideation: [
    { title: 'Customer interviews',       target: 10, unit: 'interviews' },
    { title: 'Problem hypotheses tested', target: 3,  unit: 'hypotheses' },
    { title: 'Market research sessions',  target: 5,  unit: 'sessions'   },
  ],
  Validation: [
    { title: 'Customer interviews', target: 20, unit: 'interviews' },
    { title: 'Waitlist signups',    target: 25, unit: 'signups'    },
    { title: 'Prototype tests',     target: 5,  unit: 'tests'      },
  ],
  Building: [
    { title: 'Features shipped',         target: 5,  unit: 'features' },
    { title: 'Beta users onboarded',     target: 10, unit: 'users'    },
    { title: 'User feedback sessions',   target: 8,  unit: 'sessions' },
  ],
  Launch: [
    { title: 'Users acquired',       target: 100,  unit: 'users'    },
    { title: 'Revenue generated',    target: 1000, unit: '$ MRR'    },
    { title: 'Channels tested',      target: 5,    unit: 'channels' },
  ],
  Growth: [
    { title: 'Monthly active users', target: 500,   unit: 'MAU'     },
    { title: 'Monthly revenue',      target: 10000, unit: '$ MRR'   },
    { title: 'Team members hired',   target: 3,     unit: 'people'  },
  ],
}

export const DEFAULT_GOALS = GOAL_SEEDS['Ideation']
