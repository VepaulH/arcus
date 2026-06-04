export interface NodeBenchmarks {
  description: string
  benchmarks: string[]
}

export const NODE_BENCHMARKS: Record<string, NodeBenchmarks> = {

  // ── Ideation ──────────────────────────────────────────────
  'clarify-idea': {
    description: 'Turn a vague concept into a clearly articulated problem and solution hypothesis.',
    benchmarks: [
      'Write a one-sentence problem statement',
      'Identify who experiences this problem most acutely',
      'Draft a one-sentence solution hypothesis',
      'List 3 assumptions you are making that need to be validated',
    ],
  },
  'define-problem': {
    description: 'Deeply understand the problem before jumping to solutions.',
    benchmarks: [
      'Complete at least 5 informal customer conversations',
      'Identify the specific pain point and how often it occurs',
      'Confirm the problem is painful enough that people would pay to solve it',
      'Write down what people currently do to work around this problem',
    ],
  },
  'target-audience': {
    description: 'Identify exactly who you are building for so you can find and talk to them.',
    benchmarks: [
      'Define your primary user persona (role, industry, company size, or demographic)',
      'Identify where your target audience spends time online and offline',
      'Find at least 10 specific people who match the persona and reach out',
    ],
  },
  'market-research': {
    description: 'Understand the market size and landscape before investing more time.',
    benchmarks: [
      'Estimate the total addressable market (TAM) and serviceable market (SAM)',
      'Identify the top 3–5 competitors or closest alternatives',
      'Understand why existing solutions fall short for your target user',
      'Find 2–3 recent market reports or articles validating the space',
    ],
  },
  'customer-interviews': {
    description: 'Talk to real people to validate your problem and learn what matters to them.',
    benchmarks: [
      'Complete at least 10 structured customer interviews',
      'Use open-ended questions — avoid leading the interviewee',
      'Identify the top 3 recurring pain points across interviews',
      'Confirm at least 5 interviewees said they would use or pay for a solution',
    ],
  },
  'ps-fit': {
    description: 'Confirm that your proposed solution directly solves the validated problem.',
    benchmarks: [
      'Map each key pain point to a specific feature or capability in your solution',
      'Present your solution concept to 5+ target users and measure positive reactions',
      'Get at least 3 people to say they would use this over their current approach',
      'Document any gaps between your solution and what users actually need',
    ],
  },
  'find-cofounder': {
    description: 'Find a co-founder with complementary skills and aligned values.',
    benchmarks: [
      'Define exactly what skills and traits you need in a co-founder',
      'Reach out to at least 20 potential candidates through your network and communities',
      'Have in-depth conversations with at least 5 strong candidates',
      'Complete a short working project together before committing',
    ],
  },
  'competitor-analysis': {
    description: 'Map the competitive landscape to find your defensible position.',
    benchmarks: [
      'List every direct and indirect competitor',
      'Use each competitor\'s product for at least 30 minutes',
      'Identify 2–3 clear differentiation points you can own',
      'Understand competitors\' pricing, acquisition, and retention strategies',
    ],
  },
  'align-vision': {
    description: 'Ensure the founding team shares the same long-term direction before building.',
    benchmarks: [
      'Write a shared one-paragraph mission statement all founders agree on',
      'Agree on the problem you are solving and who you are solving it for',
      'Clarify roles, equity, and decision-making responsibilities in writing',
      'Agree on what success looks like in 6 months, 1 year, and 3 years',
    ],
  },
  'plan-mvp': {
    description: 'Define the smallest possible product that lets you test your core hypothesis.',
    benchmarks: [
      'List every feature you think is needed, then cut it down to the core 1–2',
      'Write user stories for each feature in the MVP',
      'Estimate the time to build and set a launch date',
      'Identify the single metric that will tell you if the MVP succeeds',
    ],
  },

  // ── Team Ideation ─────────────────────────────────────────
  'business-model': {
    description: 'Define how you will create, deliver, and capture value.',
    benchmarks: [
      'Choose a primary revenue model (subscription, transaction, licensing, etc.)',
      'Validate that target customers will actually pay your proposed price',
      'Map out your unit economics: CAC, LTV, and payback period',
      'Identify your top 2–3 acquisition channels',
    ],
  },
  'tech-scoping': {
    description: 'Define the technical requirements before any code is written.',
    benchmarks: [
      'Choose your tech stack and justify each choice',
      'Identify any third-party APIs or services you will depend on',
      'Estimate build time for the MVP and create a high-level timeline',
      'Assess technical risks and define mitigation plans',
    ],
  },
  'mvp-planning': {
    description: 'Create a concrete, time-boxed plan to ship your first version.',
    benchmarks: [
      'Break the MVP into weekly milestones',
      'Assign clear ownership for each feature or area',
      'Define your launch criteria — what must be true before you ship?',
      'Set a public launch date and share it externally for accountability',
    ],
  },
  'start-building': {
    description: 'Begin development with a clear scope and a bias toward shipping.',
    benchmarks: [
      'Set up version control, project management, and communication tools',
      'Ship the first working version of the core feature, even if rough',
      'Get a teammate to use it and collect at least 3 pieces of actionable feedback',
      'Hold a weekly check-in to review progress against the plan',
    ],
  },

  // ── Technical Validation ──────────────────────────────────
  'define-mvp': {
    description: 'Lock the scope of your MVP so you can ship fast and learn.',
    benchmarks: [
      'List all features you want to build, then cut everything non-essential',
      'Define the single job-to-be-done your MVP solves',
      'Set a hard deadline for the first working prototype',
      'Write acceptance criteria for what "done" means for each feature',
    ],
  },
  'architecture': {
    description: 'Design a technical architecture that is simple enough to ship, and can scale later.',
    benchmarks: [
      'Choose a tech stack you can move fast with',
      'Sketch the high-level system diagram (frontend, backend, database, third-party services)',
      'Identify potential bottlenecks or scaling challenges early',
      'Get a second opinion from a trusted engineer on your architecture choices',
    ],
  },
  'first-prototype': {
    description: 'Build the first version fast — it is meant to be thrown away or iterated on.',
    benchmarks: [
      'Ship a working version of the core feature within 1–2 weeks',
      'Do not worry about polish — focus on making the core logic work',
      'Demo it to at least 3 people outside the team',
      'Document what works, what breaks, and what is confusing',
    ],
  },
  'user-testing': {
    description: 'Put your prototype in front of real users and watch them use it.',
    benchmarks: [
      'Run structured usability sessions with at least 5 target users',
      'Observe without guiding — let users struggle and note where they get stuck',
      'Track task completion rates and time-on-task',
      'Identify the top 3 friction points to fix in the next iteration',
    ],
  },
  'iterate-fast': {
    description: 'Rapidly improve the product based on what you learned from testing.',
    benchmarks: [
      'Address the top 3 issues identified in user testing within one week',
      'Run at least 2 build-test-learn cycles before declaring the iteration complete',
      'Measure whether each change actually improved the target metric',
      'Set a clear stopping point — know when good enough to move on',
    ],
  },
  'beta-users': {
    description: 'Get your first real users using the product regularly.',
    benchmarks: [
      'Onboard at least 10 beta users who match your target persona',
      'Achieve at least 40% week-over-week retention among beta users',
      'Collect structured feedback from each beta user after their first week',
      'Identify your most engaged users and understand what they love most',
    ],
  },
  'pricing-hypothesis': {
    description: 'Test what customers are actually willing to pay before you set pricing.',
    benchmarks: [
      'Research competitor pricing thoroughly',
      'Run at least 5 pricing conversations using the "mom test" framing',
      'Test at least 2 different price points with real users',
      'Define your pricing tiers and the rationale for each',
    ],
  },
  'product-metrics': {
    description: 'Define the metrics that tell you if your product is actually working.',
    benchmarks: [
      'Identify your North Star Metric — the one number that captures core value delivered',
      'Set up analytics to track activation, retention, and engagement',
      'Define weekly targets for each key metric',
      'Build a simple dashboard you and the team review every Monday',
    ],
  },
  'launch-v1': {
    description: 'Ship publicly and start acquiring your first real users.',
    benchmarks: [
      'Announce the launch across at least 3 channels (social, communities, email)',
      'Acquire at least 50 new users in the first 2 weeks',
      'Achieve a day-7 retention rate above 20%',
      'Collect and categorise all inbound feedback within 48 hours of launch',
    ],
  },

  // ── Non-Technical Validation ──────────────────────────────
  'define-product': {
    description: 'Define what your product does and who it helps before deciding how to build it.',
    benchmarks: [
      'Write a product brief: problem, user, solution, and key features',
      'Draw or wireframe the main user flows by hand',
      'Validate the brief with at least 5 target users before building anything',
    ],
  },
  'user-journey': {
    description: 'Map the end-to-end experience your user will have with your product.',
    benchmarks: [
      'Document every step a user takes from awareness to achieving their goal',
      'Identify the top 3 moments of friction in the journey',
      'Define what the "aha moment" is — when the user first gets real value',
      'Sketch the core screens or interactions needed to deliver that journey',
    ],
  },
  'market-validation': {
    description: 'Confirm there is a real, willing-to-pay market before building.',
    benchmarks: [
      'Survey at least 50 potential customers about the problem',
      'Get at least 10 people to pre-register interest or commit to a pilot',
      'Confirm that the problem is in the top 3 priorities for your target user',
    ],
  },
  'no-code-mvp': {
    description: 'Build the fastest possible version using no-code tools to test your concept.',
    benchmarks: [
      'Ship a working no-code prototype within 2 weeks using tools like Webflow, Glide, or Notion',
      'Achieve the core user flow without writing any code',
      'Get at least 10 target users to complete the core task in the prototype',
      'Document what worked and what required workarounds that would need real engineering',
    ],
  },
  'validate-demand': {
    description: 'Confirm that people will pay (or consistently use) your solution.',
    benchmarks: [
      'Collect at least 25 waitlist signups with email addresses',
      'Get at least 5 people to pay even a small amount for early access',
      'Measure conversion rate from "interested" to "I\'ll use this" — aim above 20%',
    ],
  },
  'find-tech-partner': {
    description: 'Find the technical talent to build what you have validated.',
    benchmarks: [
      'Prepare a clear technical brief covering features, timeline, and budget',
      'Interview at least 10 developer candidates or agencies',
      'Complete a small paid test project with your top candidate before committing',
      'Check references from at least 2 previous clients or colleagues',
    ],
  },
  'funding-options': {
    description: 'Understand your funding options so you can make an informed decision.',
    benchmarks: [
      'Research grants, accelerators, angels, and bootstrapping paths available to you',
      'Apply to at least 2 startup grants or competitions',
      'Have conversations with at least 3 angel investors or advisors',
      'Decide on a funding strategy and give yourself a 6-month runway runway target',
    ],
  },
  'define-v1': {
    description: 'Write a clear spec for V1 so your technical partner can build it accurately.',
    benchmarks: [
      'Create wireframes or mockups for every screen in V1',
      'Write user stories with acceptance criteria for each feature',
      'Get the spec reviewed by your technical partner and confirm the estimate',
      'Define a launch date and work backwards to create a milestone schedule',
    ],
  },
  'start-build': {
    description: 'Start development with clear expectations and regular check-ins.',
    benchmarks: [
      'Agree on a weekly demo cadence so you see progress regularly',
      'Review and give feedback on the first working build within 2 weeks',
      'Test each feature with at least 2 target users as it is built',
      'Document any scope changes and their impact on timeline',
    ],
  },

  // ── Building to Launch ────────────────────────────────────
  'mvp-scope': {
    description: 'Lock the MVP scope and resist scope creep until after your first launch.',
    benchmarks: [
      'Agree on the 3–5 features that MUST be in the MVP — nothing else',
      'Write a "not building" list to manage stakeholder expectations',
      'Get every team member aligned on the scope document',
      'Set a hard ship date and treat it as immovable',
    ],
  },
  'core-features': {
    description: 'Build the features that deliver the core value proposition.',
    benchmarks: [
      'Ship all MVP features by the agreed deadline',
      'Each feature passes internal QA with zero critical bugs',
      'At least one team member who did not build a feature tests it end-to-end',
      'Performance is acceptable on the slowest device/connection in your target market',
    ],
  },
  'user-onboarding': {
    description: 'Design an onboarding flow that gets users to value as fast as possible.',
    benchmarks: [
      'Define the "aha moment" and build the shortest path to it',
      'Get a new user from signup to first value in under 5 minutes',
      'Test the onboarding flow with at least 5 people who have never seen the product',
      'Measure and optimise the onboarding completion rate — target above 60%',
    ],
  },
  'beta-launch': {
    description: 'Release to a small, controlled group to collect real-world feedback before the public launch.',
    benchmarks: [
      'Onboard 20–50 hand-picked beta users from your target audience',
      'Set up feedback channels (email, in-app, Slack) for beta users',
      'Collect structured feedback from at least 80% of beta users',
      'Fix all critical bugs reported within 48 hours',
    ],
  },
  'user-feedback': {
    description: 'Systematically collect and categorise what users tell you.',
    benchmarks: [
      'Set up a feedback system (survey, in-app widget, weekly email)',
      'Tag and categorise all feedback into themes',
      'Identify the top 3 most-requested improvements',
      'Interview at least 5 users in depth about their biggest friction points',
    ],
  },
  'iterate': {
    description: 'Apply what you learned to make a meaningfully better product.',
    benchmarks: [
      'Address the top 3 issues from user feedback in the next release',
      'Measure whether the changes improved the target metric',
      'Run at least 2 more user tests after the changes',
      'Document your iteration log so the team can see progress over time',
    ],
  },
  'public-launch': {
    description: 'Ship to the world and start acquiring real users at scale.',
    benchmarks: [
      'Announce on at least 5 channels: social, Product Hunt, communities, email, press',
      'Acquire at least 100 new users in the first month',
      'Achieve a day-7 retention rate above 25%',
      'Respond to all launch-day feedback within 24 hours',
    ],
  },
  'user-acquisition': {
    description: 'Build a repeatable system for bringing new users to your product.',
    benchmarks: [
      'Test at least 3 acquisition channels and identify your top performer',
      'Measure CAC (cost to acquire a customer) for each channel',
      'Achieve a week-over-week user growth rate above 5%',
      'Build an owned audience of at least 500 (email list, followers, community)',
    ],
  },
  'analytics': {
    description: 'Instrument your product so you make decisions from data, not gut feel.',
    benchmarks: [
      'Track activation, retention, and engagement in a live dashboard',
      'Set weekly targets for your North Star Metric',
      'Identify which acquisition channels drive the highest-quality users',
      'Review the dashboard as a team every week and act on what you see',
    ],
  },
  'first-revenue': {
    description: 'Get your first paying customer — it changes everything.',
    benchmarks: [
      'Charge at least one customer real money for your product',
      'Understand exactly why they paid and what they value most',
      'Calculate your MRR and set a target to double it in 60 days',
      'Ask your first paying customer for a referral',
    ],
  },

  // ── Revenue Acceleration ──────────────────────────────────
  'revenue-analysis': {
    description: 'Understand the drivers of your revenue so you can accelerate what is working.',
    benchmarks: [
      'Break down revenue by channel, cohort, and customer segment',
      'Identify your highest-LTV customer segment',
      'Calculate your current MRR growth rate month-over-month',
      'Find the 1–2 actions that most strongly predict revenue growth',
    ],
  },
  'retention': {
    description: 'Keep the users you have — retention is the foundation of sustainable growth.',
    benchmarks: [
      'Measure monthly churn rate and set a target to reduce it by 20%',
      'Implement at least one proactive retention initiative (check-ins, in-app nudges, etc.)',
      'Survey churned users to understand the top reasons for leaving',
      'Identify your most retained user cohort and understand what they do differently',
    ],
  },
  'pricing': {
    description: 'Optimise your pricing to maximise revenue without killing conversion.',
    benchmarks: [
      'Run a pricing experiment — test at least 2 price points',
      'Calculate revenue impact of a 10%, 20%, and 30% price increase',
      'Introduce an annual plan with a discount to improve cash flow',
      'Ensure your pricing page clearly communicates value at each tier',
    ],
  },
  'sales-process': {
    description: 'Build a repeatable, documented sales process you can train others on.',
    benchmarks: [
      'Document your sales funnel from lead to close',
      'Measure conversion rates at each funnel stage',
      'Reduce average sales cycle length by 20%',
      'Create a sales playbook with objection handling and case studies',
    ],
  },
  'marketing-channel': {
    description: 'Find the acquisition channel that produces the best ROI and double down on it.',
    benchmarks: [
      'Test at least 3 different marketing channels with equal budget',
      'Calculate CAC and LTV for each channel',
      'Identify one channel with CAC/LTV ratio below 1:3',
      'Allocate 70% of marketing budget to the winning channel',
    ],
  },
  'pmf-check': {
    description: 'Validate that you have reached product-market fit before scaling.',
    benchmarks: [
      'Achieve a Sean Ellis "very disappointed" score above 40%',
      'Maintain net revenue retention above 100% (expansion > churn)',
      'Have at least 5 unsolicited referrals or word-of-mouth cases',
      'See organic growth accounting for at least 20% of new users',
    ],
  },
  'team-hire': {
    description: 'Make the key hire that removes your biggest bottleneck.',
    benchmarks: [
      'Identify the one role that will most accelerate growth if filled',
      'Write a compelling job description and share it in 5+ places',
      'Interview at least 10 candidates before making an offer',
      'Onboard the new hire with a clear 30-60-90 day plan',
    ],
  },
  'scale-ops': {
    description: 'Build the operational infrastructure to support 10x more customers.',
    benchmarks: [
      'Document all key processes so they can be done without you',
      'Identify and eliminate the top 3 operational bottlenecks',
      'Automate at least 2 manual processes that take more than 2 hours per week',
      'Set up customer support tooling that can scale without linear headcount growth',
    ],
  },
  'scale-revenue': {
    description: 'Push revenue growth through a combination of acquisition, expansion, and retention.',
    benchmarks: [
      'Grow MRR by at least 15% month-over-month for 3 consecutive months',
      'Launch an expansion revenue play (upsells, add-ons, or seat expansion)',
      'Reduce churn rate below 3% monthly',
      'Achieve net revenue retention above 110%',
    ],
  },
  'fundraising-prep': {
    description: 'Prepare your business and materials for a fundraising conversation.',
    benchmarks: [
      'Build a financial model with 18-month projections',
      'Create a 10-slide pitch deck telling a compelling story with your metrics',
      'Prepare a data room with all key documents investors will request',
      'Have at least 3 investors give you feedback on your materials before formally fundraising',
    ],
  },

  // ── Growth Hacking ────────────────────────────────────────
  'growth-model': {
    description: 'Define how your product grows — viral, paid, content, sales-led, or product-led.',
    benchmarks: [
      'Identify your primary growth loop (viral coefficient, SEO flywheel, etc.)',
      'Map out the full acquisition funnel with current conversion rates',
      'Set a growth target: weekly active users or MRR goal for the next 90 days',
      'Identify the one constraint most limiting your growth right now',
    ],
  },
  'acquisition': {
    description: 'Build a diversified set of acquisition channels to bring new users in.',
    benchmarks: [
      'Test at least 5 acquisition channels over 4 weeks',
      'Rank channels by CAC, volume, and lead quality',
      'Achieve a weekly new user growth rate above 10%',
      'Document a repeatable playbook for your top 2 channels',
    ],
  },
  'conversion': {
    description: 'Optimise your funnel to convert more visitors into active users.',
    benchmarks: [
      'Identify the step with the biggest conversion drop-off',
      'Run 2+ A/B tests on your landing page or onboarding flow',
      'Improve signup-to-activation conversion by at least 20%',
      'Reduce time-to-first-value from signup',
    ],
  },
  'retention-engine': {
    description: 'Build mechanisms that keep users coming back week after week.',
    benchmarks: [
      'Achieve a day-30 retention rate above 30%',
      'Implement at least one re-engagement trigger (email, push, in-app)',
      'Identify the "power user" behaviour and design to encourage it in new users',
      'Launch a user community or engagement program',
    ],
  },
  'referral-program': {
    description: 'Turn your best users into a distribution channel.',
    benchmarks: [
      'Launch a referral program with a clear, simple incentive structure',
      'Achieve a viral coefficient above 0.1 (1 in 10 users refers at least one person)',
      'Track referral conversion rates and optimise the flow',
      'Get at least 15% of new users from referrals within 3 months',
    ],
  },
  'paid-channels': {
    description: 'Test paid acquisition to find scalable, positive-ROI channels.',
    benchmarks: [
      'Launch campaigns on at least 2 paid channels (Google, Meta, LinkedIn, etc.)',
      'Achieve a 3:1 LTV to CAC ratio within 90 days',
      'Test at least 5 different ad creatives or audiences',
      'Build attribution tracking so you know exactly which ads drive revenue',
    ],
  },
  'community': {
    description: 'Build a community that creates organic growth and retention.',
    benchmarks: [
      'Launch a community channel (Discord, Slack, forum, or newsletter)',
      'Reach 500 active community members',
      'Host at least one live event (virtual or in-person) with 50+ attendees',
      'Have community members generating content or helping each other without prompting',
    ],
  },
  'growth-analytics': {
    description: 'Build the analytics infrastructure to make confident growth decisions.',
    benchmarks: [
      'Track the full funnel from first touch to revenue in a single dashboard',
      'Implement cohort analysis to understand retention trends over time',
      'Set up automated weekly growth reports for the team',
      'Use data to make at least 3 meaningful product decisions in the last month',
    ],
  },
  'scale-marketing': {
    description: 'Scale your best-performing marketing channels systematically.',
    benchmarks: [
      'Grow marketing-attributed revenue by 2x in 90 days',
      'Build a content library of at least 20 pieces that drive organic traffic',
      'Hire or contract a growth specialist for your primary channel',
      'Achieve a marketing efficiency ratio (revenue / marketing spend) above 3x',
    ],
  },

  // ── Fundraising Track ─────────────────────────────────────
  'financial-model': {
    description: 'Build a financial model that investors will trust and that guides your decisions.',
    benchmarks: [
      'Build a bottom-up 18–24 month revenue forecast',
      'Model your key cost drivers and hiring plan',
      'Show the path to breakeven or the assumptions required to get there',
      'Have a CFO or experienced founder stress-test the model',
    ],
  },
  'key-metrics': {
    description: 'Know your numbers cold — investors will test you.',
    benchmarks: [
      'Know your MRR, growth rate, churn, CAC, LTV, and runway off the top of your head',
      'Prepare a one-page metrics summary with month-over-month trends',
      'Benchmark your metrics against industry standards for your stage',
      'Understand and be able to explain every trend in your data',
    ],
  },
  'investor-narrative': {
    description: 'Craft the story that makes investors excited to be part of your journey.',
    benchmarks: [
      'Define the size and urgency of the problem you are solving',
      'Articulate why you and your team are uniquely positioned to win',
      'Show the insight or unfair advantage that others have missed',
      'Get your narrative reviewed by at least 3 founders who have raised successfully',
    ],
  },
  'deck-creation': {
    description: 'Create a pitch deck that tells your story clearly in 10–12 slides.',
    benchmarks: [
      'Cover: problem, solution, market, traction, business model, team, ask',
      'Every slide should have one clear takeaway',
      'Get feedback from at least 5 people before using it in investor meetings',
      'Prepare both a 3-minute and 10-minute version of your pitch',
    ],
  },
  'angel-network': {
    description: 'Build relationships with angel investors before you need to ask for money.',
    benchmarks: [
      'Identify 50 target angels who invest at your stage and in your space',
      'Get warm introductions to at least 20 of them',
      'Share monthly updates with your network to build familiarity',
      'Have at least 5 angels who know you well enough to make intros to VCs',
    ],
  },
  'due-diligence': {
    description: 'Prepare for investor due diligence so you do not lose deals in the process.',
    benchmarks: [
      'Set up a data room with: cap table, contracts, financials, and IP ownership',
      'Ensure all co-founder agreements and equity grants are properly documented',
      'Have a lawyer review your corporate structure and key contracts',
      'Prepare answers to the 20 most common due diligence questions',
    ],
  },
  'accelerator': {
    description: 'Apply to top accelerators to access capital, mentorship, and network.',
    benchmarks: [
      'Apply to at least 5 accelerators suited to your stage and industry',
      'Prep for the interview by practising answers to 50 common accelerator questions',
      'Get intros from alumni of each accelerator you apply to',
    ],
  },
  'seed-round': {
    description: 'Close your seed round with the right investors at the right terms.',
    benchmarks: [
      'Create a target list of 100 investors and tier them by fit',
      'Run a structured process: set a close date and create urgency',
      'Get at least 3 term sheets before choosing',
      'Have a lawyer negotiate the term sheet on your behalf',
    ],
  },
  'post-seed-growth': {
    description: 'Deploy your seed capital to hit the milestones needed to raise Series A.',
    benchmarks: [
      'Set clear Series A milestones with your lead investor upfront',
      'Achieve at least 3x growth in MRR between Seed and Series A',
      'Build the team with focused hires in your highest-leverage areas',
      'Send monthly investor updates so your investors are engaged advocates',
    ],
  },
  'series-a-prep': {
    description: 'Prepare for a Series A process that runs on your terms.',
    benchmarks: [
      'Achieve $1M+ ARR or equivalent strong signal for your market',
      'Identify and build relationships with 5–10 target Series A lead investors',
      'Update your data room and narrative for a larger, more institutional audience',
      'Hire a CFO or head of finance before starting the process',
    ],
  },

  // ── Student Founder ───────────────────────────────────────
  'campus-problem': {
    description: 'Identify a real, observable problem on your campus or in your student community.',
    benchmarks: [
      'Describe the problem in one sentence with specific evidence (e.g., "1 in 3 students can\'t find study partners in STEM")',
      'Confirm the problem exists by talking to at least 15 students',
      'Find out what students currently do to solve this problem',
      'Validate that students want a better solution',
    ],
  },
  'university-resources': {
    description: 'Leverage everything your university offers — most founders do not use it.',
    benchmarks: [
      'Meet with your university\'s entrepreneurship centre or incubator',
      'Apply for at least one university grant, fellowship, or startup fund',
      'Connect with at least 2 professors who are relevant to your problem space',
      'Join or start a startup club on campus',
    ],
  },
  'build-team': {
    description: 'Find fellow students who are as committed as you are.',
    benchmarks: [
      'Identify the 1–2 skills you most need in a co-founder',
      'Attend at least 3 hackathons, demo days, or entrepreneurship events',
      'Reach out to at least 10 potential co-founders through clubs and classes',
      'Work on a small project together before deciding to formally co-found',
    ],
  },
  'mentor-network': {
    description: 'Build a mentor network that accelerates your learning curve.',
    benchmarks: [
      'Identify 5 alumni founders or industry professionals you want to learn from',
      'Schedule a 30-minute call with at least 3 of them in the next 30 days',
      'Follow up with specific questions after each call',
      'Establish at least one ongoing mentor relationship with monthly check-ins',
    ],
  },
  'competitions': {
    description: 'Use student competitions to get feedback, funding, and visibility.',
    benchmarks: [
      'Apply to at least 3 startup or business plan competitions',
      'Prepare a tight 3-minute pitch and a 10-minute version',
      'Use competition deadlines as forcing functions to advance your product',
      'Win or place in at least one competition to add credibility',
    ],
  },
  'campus-launch': {
    description: 'Launch on your campus and use it as your first real market.',
    benchmarks: [
      'Get at least 100 campus users within the first 4 weeks of launch',
      'Set up a feedback loop with early campus users',
      'Partner with at least one campus organisation for distribution',
      'Document retention and usage metrics to show traction to outside investors',
    ],
  },
  'graduate-strategy': {
    description: 'Plan how you will continue building after graduation.',
    benchmarks: [
      'Decide: full-time on the startup or take a job — be honest about commitment',
      'Secure at least 6 months of runway before graduation',
      'Map out how to keep your team together post-graduation',
      'Set a clear milestone you want to hit within 6 months of graduating',
    ],
  },

  // ── Scaling Revenue ───────────────────────────────────────
  'revenue-audit': {
    description: 'Understand exactly where your revenue comes from and why.',
    benchmarks: [
      'Break down revenue by product, segment, geography, and channel',
      'Identify your top 20% of customers driving 80% of revenue',
      'Calculate churn and expansion revenue separately',
      'Spot the 1–2 revenue growth opportunities you have been under-investing in',
    ],
  },
  'unit-economics': {
    description: 'Ensure your unit economics support the business you are building.',
    benchmarks: [
      'Calculate gross margin per customer and ensure it is above 60% (for SaaS)',
      'Measure payback period and ensure it is under 18 months',
      'Model out LTV:CAC ratio by channel and ensure it is above 3:1',
      'Identify the biggest lever to improve unit economics in the next 90 days',
    ],
  },
  'ops-efficiency': {
    description: 'Remove operational drag so you can grow without proportional headcount growth.',
    benchmarks: [
      'Document all recurring processes and identify the ones consuming the most time',
      'Automate at least 3 high-frequency manual tasks',
      'Reduce customer support volume per 100 users by 20%',
      'Implement a quarterly OKR process so the whole team is aligned',
    ],
  },
  'scale-sales': {
    description: 'Build a sales team and process that can close deals without the founder.',
    benchmarks: [
      'Hire your first dedicated sales rep with a clear quota',
      'Document the entire sales playbook so it can be followed without you',
      'Achieve quota attainment above 70% in the first quarter',
      'Implement a CRM and use it religiously',
    ],
  },
  'team-building': {
    description: 'Build the team and culture that will take you to the next stage.',
    benchmarks: [
      'Hire at least 3 senior leaders in engineering, sales, and marketing',
      'Implement a structured onboarding program for all new hires',
      'Run quarterly performance reviews tied to company OKRs',
      'Measure and track employee NPS — keep it above 30',
    ],
  },
  'market-expansion': {
    description: 'Grow into adjacent markets or geographies to unlock new revenue.',
    benchmarks: [
      'Identify 2–3 adjacent market segments you could serve with minimal product changes',
      'Run a 90-day expansion test in one new market',
      'Achieve at least $100K ARR from the new market before investing further',
      'Assess the competitive landscape in each new market before entering',
    ],
  },
  'strategic-partners': {
    description: 'Build partnerships that accelerate distribution or product capabilities.',
    benchmarks: [
      'Identify 5 potential strategic partners who already have your target customers',
      'Close at least 2 formal partnership agreements with co-marketing or revenue sharing',
      'Measure partner-sourced pipeline as a percentage of total pipeline',
      'Dedicate a resource to managing and growing the partnership channel',
    ],
  },
  'process-automation': {
    description: 'Automate the processes that are holding back your growth.',
    benchmarks: [
      'Map all workflows that require manual intervention',
      'Automate the top 5 by time impact',
      'Reduce time spent on operations per $100K of ARR by 30%',
      'Set up monitoring so broken automations are caught immediately',
    ],
  },
  'series-a': {
    description: 'Close a Series A to fund the next phase of growth.',
    benchmarks: [
      'Achieve $1–3M ARR with strong growth rate (3x+ year-over-year)',
      'Run a structured process with 50+ investor meetings over 8–12 weeks',
      'Negotiate lead investor term sheet and close within 60 days of term sheet',
      'Use the raise to extend runway to at least 24 months',
    ],
  },
  'profitability': {
    description: 'Build toward profitability so you control your own destiny.',
    benchmarks: [
      'Achieve gross margin above 70%',
      'Reach operating cash-flow breakeven or have a clear dated path to it',
      'Reduce burn multiple (net burn / net new ARR) below 1.5',
      'Have at least 12 months of runway without needing to raise again',
    ],
  },
}
