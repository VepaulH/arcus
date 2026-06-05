// Single source of truth for all allowed enum values and input validation helpers.
// Import from this module in every route that reads user-supplied data.

export const VALID_STARTUP_STAGES  = ['Ideation', 'Validation', 'Building', 'Launch', 'Growth']                                                                                           as const
export const VALID_POSITIONS       = ['Founder', 'Co-founder', 'Employee', 'Advisor', 'Mentor', 'Investor']                                                                               as const
export const VALID_REVENUE_RANGES  = ['Pre-revenue', '$1 – $1K / month', '$1K – $10K / month', '$10K – $100K / month', '$100K+ / month']                                                 as const
export const VALID_LOOKING_FOR     = ['Yes — looking for a co-founder', 'Yes — looking for first employees', 'Yes — looking for a mentor', 'I already have a team', 'Not right now']     as const
export const VALID_SKILLS          = ['Frontend', 'Backend', 'Mobile', 'AWS', 'DevOps', 'ML / AI', 'Product Design', 'React', 'Python', 'Go', 'Marketing', 'Sales', 'Growth', 'Fundraising', 'Strategy'] as const
export const VALID_EXPERIENCE      = ['Student', '0–1 years', '1–3 years', '3–5 years', '5+ years']                                                                                      as const
export const VALID_REFERRAL        = ['Word of mouth', 'Social media', 'University / professor', 'Search engine', 'Other']                                                                as const
export const VALID_NODE_STATUS     = ['active', 'available', 'locked']                                                                                                                    as const

const UUID_RE  = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isUUID(v: unknown): v is string {
  return typeof v === 'string' && UUID_RE.test(v)
}

export function isEmail(v: unknown): v is string {
  return typeof v === 'string' && EMAIL_RE.test(v) && v.length <= 254
}

export function isEnum<T extends string>(v: unknown, allowed: readonly T[]): v is T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v)
}

export function isSkillsArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.length <= 15 && v.every(s => isEnum(s, VALID_SKILLS))
}

// Returns the trimmed value if it passes, or null if it fails.
// minLen=0 means the field is optional (undefined/null/empty → returns '').
export function cleanText(v: unknown, maxLen: number, minLen = 0): string | null {
  if (v === undefined || v === null) return minLen === 0 ? '' : null
  if (typeof v !== 'string') return null
  const t = v.trim()
  if (t.length < minLen || t.length > maxLen) return null
  return t
}

export function isProgress(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 100
}
