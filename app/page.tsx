// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FFF8F6]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#FF6357]/10 text-[#FF6357] text-sm font-semibold tracking-wide uppercase">
            New Stride Club Challenge Launching Soon
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-[#1A1A1A] mb-6 leading-[1.1]">
            Move.<br />
            <span className="text-[#FF6357]">Nourish.</span><br />
            Thrive.
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
            The complete fitness and wellness platform built by Judith. Structured programs, science-backed nutrition, and a walk community that keeps you accountable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership" className="bg-[#FF6357] hover:bg-[#E04A3F] text-white px-8 py-4 rounded text-sm font-bold tracking-wide uppercase transition-colors">
              Start Your Journey
            </Link>
            <Link href="/programs" className="border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-8 py-4 rounded text-sm font-bold tracking-wide uppercase transition-colors">
              View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-[#00B4A0] mb-3">Everything You Need</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1A1A1A]">Your complete wellness toolkit</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🏋️', title: 'Structured Programs', desc: 'Step-by-step workout programs designed for real results. From beginner to advanced.' },
              { icon: '🥗', title: 'Science-Backed Nutrition', desc: 'Meal plans, macro tracking, and recipes that fuel your transformation.' },
              { icon: '👟', title: 'The Stride Club', desc: 'Walk together, earn rewards. Our community walk club makes fitness social and fun.' },
            ].map(f => (
              <div key={f.title} className="p-8 rounded-2xl border border-[#F0EAE8] hover:border-[#FF6357]/30 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{f.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stride Club CTA */}
      <section className="py-24 bg-[#1a1a2e] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">👟</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Join The Stride Club</h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Walk. Track. Win. Just $5/month gets you access to weekly challenges, a leaderboard, and a community that celebrates every step.
          </p>
          <Link href="/stride-club" className="inline-block bg-[#FF6357] hover:bg-[#E04A3F] text-white px-10 py-4 rounded text-sm font-bold tracking-wide uppercase transition-colors">
            Join for $5/month
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 bg-[#FFF8F6]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#6B7280] text-sm uppercase tracking-widest font-semibold mb-12">Trusted by members worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[['500+', 'Active Members'], ['12', 'Programs'], ['10K+', 'Steps Tracked Daily'], ['4.9★', 'Member Rating']].map(([n, l]) => (
              <div key={l}>
                <div className="text-4xl font-bold text-[#FF6357] mb-2">{n}</div>
                <div className="text-sm text-[#6B7280]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
