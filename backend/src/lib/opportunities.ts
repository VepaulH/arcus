import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY in environment')
}

const anthropic = new Anthropic()

export interface FetchedOpportunity {
  title: string
  type: 'Competition' | 'Accelerator' | 'Hackathon' | 'Grant' | 'Event'
  url: string
  description: string
  deadline: string | null
  source: string
}

const PROMPT =
  'Search the web for startup competitions, accelerators, hackathons, and grants that are ' +
  'currently open for applications or upcoming, and relevant to student and early-stage founders ' +
  '(e.g. MIT $100K, Y Combinator, HackMIT, NSF SBIR, campus-level and national student competitions). ' +
  'Only include opportunities with a real, currently-working application URL and a deadline that has ' +
  'not yet passed (or is rolling/ongoing). Return 8-12 diverse opportunities across the different types.\n\n' +
  'Respond with ONLY a JSON object (no markdown fences, no other text) matching this exact shape:\n' +
  '{"opportunities": [{"title": string, "type": "Competition"|"Accelerator"|"Hackathon"|"Grant"|"Event", ' +
  '"url": string, "description": string, "deadline": string|null, "source": string}]}'

// Searches the web for currently-open startup opportunities and returns
// structured results. Intended to run on a weekly schedule, not per-request.
export async function fetchLiveOpportunities(): Promise<FetchedOpportunity[]> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: PROMPT }],
  })

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  if (!textBlock) {
    throw new Error('No text response returned from opportunity search')
  }

  const jsonText = textBlock.text.trim().replace(/^```(?:json)?\n?/, '').replace(/```$/, '')
  const parsed = JSON.parse(jsonText) as { opportunities: FetchedOpportunity[] }
  return parsed.opportunities
}
