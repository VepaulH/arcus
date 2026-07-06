import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">

      {/* Hero */}
      <section className="text-center mb-24">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-blue-300 uppercase border border-blue-400/20 rounded-full bg-blue-400/5">
          Built for student founders
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Your launchpad for<br />building a startup.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Arcus is an extensive combination of tools designed to give students
          the support and guidance they need to turn their ideas into real companies.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            Get Started — It&apos;s Free
          </Link>
          <Link
            href="/about"
            className="px-6 py-2.5 text-sm font-semibold text-slate-300 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="animate-float group rounded-2xl p-8 bg-white/5 border border-white/8 backdrop-blur-sm hover:bg-white/8 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/15 flex items-center justify-center mb-5">
            <span className="text-blue-300 text-sm font-bold">AI</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-2">arcus.ai</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Stay on track with weekly goals tailored to your stage. Log
            progress on the tasks that actually move your startup forward,
            week after week.
          </p>
        </div>

        <div className="animate-float group rounded-2xl p-8 bg-white/5 border border-white/8 backdrop-blur-sm hover:bg-white/8 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/15 flex items-center justify-center mb-5">
            <span className="text-blue-300 text-sm font-bold">&#9658;</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-2">Roadmap</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Step-by-step guidance from idea to launch. Follow a curated roadmap
            that walks you through every stage of building your startup —
            research, MVP, growth, and beyond.
          </p>
        </div>

        <div className="animate-float group rounded-2xl p-8 bg-white/5 border border-white/8 backdrop-blur-sm hover:bg-white/8 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/15 flex items-center justify-center mb-5">
            <span className="text-blue-300 text-sm font-bold">&#9679;&#9679;</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-2">Connect</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Find your co-founders, mentors, and first customers. Connect with a
            community of student builders, experienced advisors, and investors
            who believe in student-led ventures.
          </p>
        </div>
      </section>

      {/* About section */}
      <div className="animate-float rounded-2xl p-12 bg-gradient-to-br from-blue-500/8 to-blue-900/10 border border-blue-400/10 backdrop-blur-sm text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-3">
          Built for student founders.
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
          Starting a company while in school is one of the hardest things you can
          do — but also one of the most rewarding. Arcus brings together everything
          you need: AI-powered guidance, structured roadmaps, and a network of
          people who&apos;ve been in your shoes. Whether you&apos;re just starting
          out or already have traction, Arcus grows with you.
        </p>
      </div>

    </div>
  );
}
