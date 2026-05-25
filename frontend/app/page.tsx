import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold text-slate-100 mb-6 leading-tight">
          Your launchpad for building a startup.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Arcus is an extensive combination of tools designed to give students
          the support and guidance they need to turn their ideas into real
          companies.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
          >
            Get Started — It&apos;s Free
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 text-base font-semibold text-blue-400 border border-blue-500 rounded-md hover:bg-blue-950 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="animate-float bg-blue-700 rounded-xl p-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-blue-100 text-lg font-bold">AI</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">arcus.ai</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            An intelligent assistant built for founders. Get answers to
            startup questions, validate ideas, and draft your business plan
            with AI tailored for student entrepreneurs.
          </p>
        </div>

        <div className="animate-float bg-blue-700 rounded-xl p-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-blue-100 text-lg font-bold">&#9658;</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Roadmap</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Step-by-step guidance from idea to launch. Follow a curated
            roadmap that walks you through every stage of building your
            startup — research, MVP, growth, and beyond.
          </p>
        </div>

        <div className="animate-float bg-blue-700 rounded-xl p-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-blue-100 text-lg font-bold">&#9679;&#9679;</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Find your co-founders, mentors, and first customers. Connect with
            a community of student builders, experienced advisors, and
            investors who believe in student-led ventures.
          </p>
        </div>
      </section>

      {/* About section */}
      <div className="animate-float bg-blue-700 rounded-xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Built for student founders.
        </h2>
        <p className="text-blue-100 max-w-3xl mx-auto text-base leading-relaxed">
          Starting a company while in school is one of the hardest things you
          can do — but also one of the most rewarding. Arcus brings together
          everything you need: AI-powered guidance, structured roadmaps, and a
          network of people who&apos;ve been in your shoes. Whether you&apos;re
          just starting out or already have traction, Arcus grows with you.
        </p>
      </div>
    </div>
  );
}
