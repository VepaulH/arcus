'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  { label: 'Validate my idea',     prompt: 'How do I validate my startup idea before building anything?' },
  { label: 'Customer discovery',   prompt: 'Help me design a customer discovery interview plan.' },
  { label: 'Write a pitch deck',   prompt: 'Give me an outline for a compelling pitch deck.' },
  { label: 'Find first customers', prompt: 'How do I find my first 10 customers?' },
  { label: 'Scope my MVP',         prompt: 'What should I include in my MVP to test my core hypothesis?' },
  { label: 'Go-to-market plan',    prompt: 'What is a good go-to-market strategy for a B2B SaaS startup?' },
]

function getMockResponse(msg: string): string {
  const m = msg.toLowerCase()

  if (m.includes('validate') || m.includes('validation')) {
    return "Validating your idea before building saves months of wasted effort. Here's the process:\n\n**1. Write your problem statement**\n\"[Target customer] struggles with [problem] when [context], causing [impact].\"\n\n**2. Run problem interviews**\nTalk to 20–30 people. Don't pitch — just learn about their pain.\n\n**3. Look for workarounds**\nIf people are hacking together spreadsheets, Slack bots, or manual processes, the problem is real.\n\n**4. Build a fake door**\nLaunch a landing page describing the solution. Measure sign-ups before writing a line of code.\n\nWhat's your startup idea? I can help you design a specific validation plan."
  }
  if (m.includes('pitch') || m.includes('deck')) {
    return "A strong pitch deck has 10–12 slides. Here's the structure investors expect:\n\n**1. Problem** — Make the pain visceral.\n**2. Solution** — One sentence.\n**3. Why now** — What's changed that makes this the right moment?\n**4. Market size** — TAM, SAM, SOM.\n**5. Product** — Screenshots or a short demo.\n**6. Business model** — How do you make money?\n**7. Traction** — Users, revenue, pilots, letters of intent.\n**8. Team** — Why are you the right people?\n**9. Competition** — Your differentiation, honestly.\n**10. The ask** — How much, for what milestones?\n\nWhich slide would you like to work on?"
  }
  if (m.includes('customer') || m.includes('interview') || m.includes('discovery')) {
    return "Customer discovery is the most important skill a founder can build. Here's how:\n\n**Recruiting**\nLinkedIn, Reddit, Slack communities, or warm intros. Aim for 20–30 interviews.\n\n**During the interview**\n- Ask about past behavior, not hypothetical future behavior\n- \"Tell me about the last time you dealt with [problem]\" beats \"Would you use a product that...\"\n- Ask \"why?\" at least 3 times per answer\n- Stay silent — let them fill the space\n\n**Key questions:**\n1. Walk me through how you currently handle [problem]?\n2. What's the most frustrating part?\n3. How much time or money does this cost you?\n4. Have you tried to solve it? What happened?\n\nWant a full interview script for a specific persona?"
  }
  if (m.includes('mvp') || m.includes('minimum viable')) {
    return "The MVP is not about minimizing features — it's about maximizing learning with minimum effort.\n\n**Define your core hypothesis first:**\n\"I believe [customer] will [behavior] because [reason].\"\nYour MVP tests that one thing. Nothing more.\n\n**Common MVP types:**\n- **Concierge** — Do it manually before automating\n- **Landing page** — Gauge interest before building\n- **Wizard of Oz** — Fake the backend; humans do the work\n- **Single-feature app** — Only the core value proposition\n\n**Cut anything that isn't:**\n✅ The core value\n✅ Enough UX to not embarrass you\n✅ A way to collect feedback\n\nWhat's your core hypothesis? I'll help you scope the smallest useful test."
  }
  if (m.includes('market') || m.includes('gtm') || m.includes('go-to-market') || m.includes('first 10') || m.includes('customers')) {
    return "Go-to-market depends on who your customer is and how they buy.\n\n**B2C** — Viral loops, influencer partnerships, community-led growth\n**B2B SMB** — Product-led growth, self-serve free tier, SEO, cold outbound\n**B2B Enterprise** — Sales-led, long cycle, relationship-driven\n\n**For early stage, focus on:**\n\n**1. One channel only**\nDon't spread thin. Pick the channel most likely to reach your ideal customer.\n\n**2. Do things that don't scale**\nPersonally reach out to your first 50 customers. DMs, cold emails, in-person events.\n\n**3. Niche down aggressively**\nThe riches are in the niches. Own one segment before expanding.\n\nWhat kind of startup are you building? I'll tailor a specific plan."
  }
  if (m.includes('fundrais') || m.includes('investor') || m.includes('funding') || m.includes('raise')) {
    return "Fundraising is a full-time job. Plan for 3–6 months.\n\n**When to raise**\nWhen you have enough signal to tell a compelling story — not just when you need cash. Traction (users, revenue, pilots) + a clear use of funds.\n\n**Seed-stage sources**\n- Friends & family — fastest, informal\n- Accelerators (YC, Techstars) — capital + network + credibility\n- Angels — former founders, domain experts\n- Pre-seed VCs — $500K–$2M, pre-revenue often fine\n\n**The process**\n1. Build a list of 50–100 investors\n2. Warm intros beat cold outreach 10:1\n3. Run processes in parallel — create urgency\n4. First meeting: story + vision\n5. Second meeting: diligence + team depth\n\n**What investors care about:**\nMarket size · Team · Traction · Insight\n\nWant help crafting your fundraising narrative or building your investor list?"
  }

  return "I'm **arcus.ai** — your AI guide for building a startup from scratch. I can help with:\n\n- **Idea validation** — Test before you build\n- **Customer discovery** — Talk to the right people the right way\n- **MVP scoping** — Build only what matters\n- **Go-to-market** — Find your first customers\n- **Pitch decks** — Tell your story to investors\n- **Fundraising** — Navigate the process\n\nWhat are you working on?"
}

function MessageContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-1">
      {content.split('\n').map((line, i) => {
        if (line === '') return <div key={i} className="h-1" />
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} className="font-semibold text-slate-100">{part}</strong>
                : part
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function ArcusAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function resizeTextarea() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  async function sendMessage(text: string) {
    const content = text.trim()
    if (!content || isLoading) return

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 800 + Math.random() * 700))

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'assistant',
      content: getMockResponse(content),
    }])
    setIsLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>

      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Empty / welcome state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">arcus.ai</h1>
              <p className="text-slate-500 text-sm max-w-sm mb-10">
                Your AI guide for building a startup — from idea to growth.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => sendMessage(p.prompt)}
                    className="text-left px-4 py-3 rounded-xl border border-white/8 bg-white/5 hover:bg-white/10 hover:border-white/15 transition-all group"
                  >
                    <p className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                      {p.label}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 truncate group-hover:text-slate-500 transition-colors">
                      {p.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message thread */}
          <div className="flex flex-col gap-6">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Bubble */}
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white/[0.06] border border-white/8 text-slate-400 rounded-tl-sm'
                }`}>
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="bg-white/[0.06] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '160ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/6 bg-[#0b1220]/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 focus-within:border-blue-500/30 focus-within:bg-white/[0.06] transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); resizeTextarea() }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your startup…"
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none outline-none leading-relaxed"
              style={{ maxHeight: '160px' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm shadow-blue-500/20"
            >
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-slate-700 mt-2">
            arcus.ai can make mistakes. Always verify critical decisions.
          </p>
        </div>
      </div>

    </div>
  )
}
