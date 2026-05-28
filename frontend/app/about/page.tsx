import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold text-slate-100 mb-6 leading-tight">
          What is Arcus?
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Arcus is an all-in-one platform built for students who want to turn
          their ideas into real companies — with the tools, guidance, and
          community to make it happen.
        </p>
      </section>

      {/* Mission */}
      <div className="animate-float bg-blue-700 rounded-2xl p-12 mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Our mission</h2>
        <p className="text-blue-100 max-w-3xl mx-auto text-base leading-relaxed">
          Every student with a great idea deserves a real shot at building
          something meaningful. Arcus removes the barriers — the lack of
          mentors, the unclear next steps, the isolation of building alone —
          so you can focus on what matters: creating value in the world.
        </p>
      </div>

      {/* Feature deep-dives */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="animate-float bg-blue-700 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-3">arcus.ai</h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            An AI assistant trained to understand the startup journey. Ask it
            anything — from how to validate a market to how to write a pitch
            deck — and get guidance tailored to where you are right now.
          </p>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>→ Idea validation</li>
            <li>→ Business plan drafting</li>
            <li>→ Market research assistance</li>
            <li>→ Pitch feedback</li>
          </ul>
        </div>

        <div className="animate-float bg-blue-700 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-3">Roadmap</h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            A structured, stage-by-stage guide to building your startup. Know
            exactly what to do next — and why — at every step from first idea
            to your first paying customer.
          </p>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>→ Ideation &amp; validation</li>
            <li>→ MVP planning &amp; build</li>
            <li>→ Go-to-market strategy</li>
            <li>→ Growth &amp; fundraising</li>
          </ul>
        </div>

        <div className="animate-float bg-blue-700 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-3">Connect</h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            Building is better together. Find co-founders who complement your
            skills, mentors who&apos;ve done it before, and early users who
            believe in what you&apos;re creating.
          </p>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>→ Co-founder matching</li>
            <li>→ Mentor network</li>
            <li>→ Early adopter community</li>
            <li>→ Investor connections</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="animate-float bg-blue-700 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to build?
        </h2>
        <p className="text-blue-100 max-w-xl mx-auto text-base leading-relaxed mb-8">
          Arcus is free to get started. Create your account and take your first
          step toward building something real.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-3 text-base font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-400 transition-colors"
        >
          Get Started — It&apos;s Free
        </Link>
      </div>

    </div>
  )
}
