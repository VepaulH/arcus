type GoalSeed = { title: string; target: number; unit: string }

// Goals keyed by roadmap_id — each path has targets specific to where the user actually is.
export const GOAL_SEEDS: Record<string, GoalSeed[]> = {
  'solo-ideation': [
    { title: 'Customer discovery calls',      target: 10, unit: 'calls'       },
    { title: 'Problem hypotheses tested',     target: 3,  unit: 'hypotheses'  },
    { title: 'Co-founder conversations',      target: 5,  unit: 'convos'      },
  ],
  'team-ideation': [
    { title: 'Customer interviews',           target: 15, unit: 'interviews'  },
    { title: 'Competitor analyses done',      target: 5,  unit: 'analyses'    },
    { title: 'Vision alignment sessions',     target: 3,  unit: 'sessions'    },
  ],
  'technical-validation': [
    { title: 'Prototype user tests',          target: 8,  unit: 'tests'       },
    { title: 'Bug fixes shipped',             target: 20, unit: 'fixes'       },
    { title: 'Beta user signups',             target: 15, unit: 'users'       },
  ],
  'non-technical-validation': [
    { title: 'Customer validation calls',     target: 15, unit: 'calls'       },
    { title: 'Landing page experiments',      target: 3,  unit: 'experiments' },
    { title: 'Partnership conversations',     target: 5,  unit: 'convos'      },
  ],
  'building-to-launch': [
    { title: 'Features shipped',              target: 5,  unit: 'features'    },
    { title: 'Beta users onboarded',          target: 20, unit: 'users'       },
    { title: 'User feedback sessions',        target: 10, unit: 'sessions'    },
  ],
  'revenue-acceleration': [
    { title: 'New customers acquired',        target: 10, unit: 'customers'   },
    { title: 'Churn interviews done',         target: 5,  unit: 'interviews'  },
    { title: 'Revenue experiments run',       target: 3,  unit: 'experiments' },
  ],
  'growth-hacking': [
    { title: 'Growth experiments run',        target: 10, unit: 'experiments' },
    { title: 'New signups',                   target: 100, unit: 'signups'    },
    { title: 'Acquisition channels tested',   target: 5,  unit: 'channels'   },
  ],
  'fundraising-track': [
    { title: 'Investor meetings booked',      target: 10, unit: 'meetings'    },
    { title: 'Warm intros requested',         target: 20, unit: 'intros'      },
    { title: 'Pitch deck iterations',         target: 3,  unit: 'iterations'  },
  ],
  'student-founder': [
    { title: 'Customer interviews',           target: 10, unit: 'interviews'  },
    { title: 'Advisor / mentor meetings',     target: 3,  unit: 'meetings'    },
    { title: 'Startup competition entries',   target: 2,  unit: 'entries'     },
  ],
  'scaling-revenue': [
    { title: 'New team members hired',        target: 3,  unit: 'people'      },
    { title: 'Process automations built',     target: 3,  unit: 'automations' },
    { title: 'Enterprise deals closed',       target: 2,  unit: 'deals'       },
  ],
}

export const DEFAULT_GOALS = GOAL_SEEDS['solo-ideation']
