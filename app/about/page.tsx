import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — BetterBod',
  description: 'BetterBod is a Caribbean fitness platform built to help women transform their bodies with structured programs, real nutrition, and community accountability.',
}

const VALUES = [
  { icon: '🌴', title: 'Built for the Caribbean', body: 'Programs, nutrition, and challenges designed for our climate, our culture, and our kitchens.' },
  { icon: '💪', title: 'Results over aesthetics', body: 'We care about how you feel, how you move, and what you can do — not just how you look.' },
  { icon: '🤝', title: 'Community first', body: 'Fitness is better together. Every leaderboard and challenge exists because accountability is the secret ingredient.' },
  { icon: '🎯', title: 'No fluff', body: 'Structured programs. Clear nutrition. Honest pricing. No confusing tiers, no hidden fees.' },
]

export default function AboutPage() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block bg-[#e8643c]/10 text-[#e8643c] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8643c]/20">
            Our Story
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-6">
            Fitness built{' '}
            <span className="text-[#e8643c]">for us.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            BetterBod was created because Caribbean women deserved a fitness platform that actually understood them — their schedules, their kitchens, their lives.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-white mb-6">Our mission</h2>
            <p className="text-white/60 leading-relaxed text-lg mb-6">
              To make structured, effective fitness accessible to every woman in the Caribbean — with programs that work in our climate, nutrition that uses our food, and a community that feels like home.
            </p>
            <p className="text-white/60 leading-relaxed text-lg">
              We built BetterBod because fitness should not require expensive gyms, imported supplements, or copying workout plans designed for a completely different life.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center">
            <div className="text-7xl mb-4">🌴</div>
            <p className="text-white font-bold text-xl">Caribbean-first fitness</p>
            <p className="text-white/40 mt-2">Built in Trinidad. For the region.</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <h2 className="text-4xl font-black text-white text-center mb-16">What we believe</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="text-white font-bold text-xl mb-3">{v.title}</h3>
              <p className="text-white/50 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <h2 className="text-4xl font-black text-white text-center mb-16">Behind BetterBod</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-white font-bold text-xl mb-1">Judith</h3>
            <p className="text-[#e8643c] text-sm font-semibold mb-4">Founder & Head Coach</p>
            <p className="text-white/50 text-sm leading-relaxed">Certified personal trainer and nutritionist with 8+ years coaching women across the Caribbean.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">👟</div>
            <h3 className="text-white font-bold text-xl mb-1">The Community</h3>
            <p className="text-[#e8643c] text-sm font-semibold mb-4">Our Members</p>
            <p className="text-white/50 text-sm leading-relaxed">Thousands of women across Trinidad, Barbados, Jamaica, and beyond who show up every day.</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e8643c] text-center">
        <h2 className="text-4xl font-black text-white mb-6">Ready to start?</h2>
        <p className="text-white/80 text-xl mb-10 max-w-xl mx-auto">
          Join thousands of Caribbean women already transforming with BetterBod.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/membership" className="inline-flex items-center justify-center bg-white text-[#e8643c] font-black px-8 py-4 rounded-xl text-lg transition-all hover:scale-[1.02]">
            Get Full Access
          </Link>
          <Link href="/programs" className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:bg-white/10">
            Browse Programs
          </Link>
        </div>
      </section>
    </main>
  )
}
