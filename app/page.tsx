import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'BetterBod — Real Programs. Real Results.',
  description:
    'Fitness programs, step challenges, and nutrition guides built for women who refuse to settle. Join BetterBod and start your transformation today.',
  openGraph: {
    title: 'BetterBod — Real Programs. Real Results.',
    description: 'Fitness programs, step challenges, and nutrition guides built for women who refuse to settle.',
    url: 'https://betterbod.vercel.app',
    siteName: 'BetterBod',
    type: 'website',
  },
}

const STATS = [
  { value: '10K+', label: 'Members' },
  { value: '50+',  label: 'Programs' },
  { value: '4.9★', label: 'Rating' },
  { value: '90',   label: 'Day Guarantee' },
]

const FEATURES = [
  {
    icon: '🏋️',
    title: 'Structured Programs',
    body: 'Follow expertly designed week-by-week plans — gym, home, or travel. No guesswork, just progress.',
  },
  {
    icon: '👟',
    title: 'Stride Club',
    body: 'Daily step challenges with live leaderboards. Turn walking into a community sport.',
  },
  {
    icon: '🥗',
    title: 'Nutrition Guides',
    body: 'Simple, real-food recipes and meal frameworks that work with your lifestyle, not against it.',
  },
  {
    icon: '📊',
    title: 'Track Everything',
    body: 'Log your sessions, monitor your steps, and see your progress in one clean dashboard.',
  },
  {
    icon: '🌍',
    title: 'Caribbean-First',
    body: 'Prices displayed in your local currency. Built for women across the Caribbean and beyond.',
  },
  {
    icon: '🔒',
    title: 'Cancel Anytime',
    body: '7-day refund policy. No contracts. No hidden fees. Just results or your money back.',
  },
]

const PLANS = [
  {
    id:       'monthly',
    name:     'Monthly',
    priceUSD: 29.99,
    priceTTD: 199.99,
    period:   'month',
    features: [
      'All fitness programs',
      'Nutrition guides',
      'Member dashboard',
      'Community access',
    ],
    featured: false,
    cta:      'Start Monthly',
  },
  {
    id:       'annual',
    name:     'Annual',
    priceUSD: 299.99,
    priceTTD: 1999.99,
    period:   'year',
    badge:    'Best Value — Save 17%',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early access to new programs',
    ],
    featured: true,
    cta:      'Start Annual',
  },
  {
    id:       'stride_club',
    name:     'Stride Club',
    priceUSD: 14.99,
    priceTTD: 99.99,
    period:   'month',
    features: [
      'Weekly step challenges',
      'Live leaderboard',
      'Monthly workbook PDF',
      'Stride community',
    ],
    featured: false,
    cta:      'Join Stride Club',
  },
]

const TESTIMONIALS = [
  {
    quote: "I've tried every program out there. BetterBod is the first one that actually fits my life. Down 18lbs in 3 months.",
    name:  'Shanice M.',
    loc:   'Trinidad',
    stars: 5,
  },
  {
    quote: 'The Stride Club kept me accountable when motivation dipped. Seeing my name on the leaderboard changed everything.',
    name:  'Kezia T.',
    loc:   'Barbados',
    stars: 5,
  },
  {
    quote: 'Finally — a fitness platform built for us. The nutrition section alone is worth the membership.',
    name:  'Renee A.',
    loc:   'Jamaica',
    stars: 5,
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: programs } = await supabase
    .from('programs')
    .select('id, slug, name, short_desc, cover_url, difficulty, weeks')
    .eq('active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a00] via-[#0d0d0d] to-[#0d0d0d]" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#e8643c]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-[#e8643c]/10 text-[#e8643c] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8643c]/20">
              The fitness platform built for you
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Become the{' '}
              <span className="text-[#e8643c]">best version</span>{' '}
              of you.
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-lg">
              Real programs. Real community. Real results. BetterBod gives you everything you need to transform your body and keep the results for life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Today — From $14.99/mo
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
              >
                Browse Programs →
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/30">
              7-day refund guarantee · No contracts · Cancel anytime
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10" />
              <Image
                src="/images/hero-judith.jpg"
                alt="Judith — BetterBod founder"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 50vw, 600px"
              />
            </div>
            <div className="absolute bottom-8 -left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 z-20">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">This week</p>
              <p className="text-3xl font-black text-white">10,847</p>
              <p className="text-[#e8643c] text-sm font-medium">steps logged by our community</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#e8643c] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS */}
      <section className="bg-[#111] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">Programs</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Find your perfect program
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              From beginner body recomps to advanced shred programs — every plan is structured, tested, and designed to get you results.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programs && programs.length > 0 ? (
              programs.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#e8643c]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.cover_url ? (
                      <Image
                        src={p.cover_url}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#e8643c]/20 to-[#0d0d0d]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      p.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      p.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{p.name}</h3>
                    {p.short_desc && (
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{p.short_desc}</p>
                    )}
                    <div className="flex items-center gap-4 text-white/40 text-xs">
                      <span>{p.weeks} weeks</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              [
                { name: 'Fat Loss Fundamentals', difficulty: 'Beginner', weeks: 8 },
                { name: 'Booty & Core Sculpt', difficulty: 'Intermediate', weeks: 12 },
                { name: 'Advanced Shred', difficulty: 'Advanced', weeks: 10 },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl overflow-hidden bg-white/5 border border-white/10"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#e8643c]/10 to-[#0d0d0d] flex items-center justify-center">
                    <span className="text-5xl">🏋️</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold text-xl mb-2">{p.name}</h3>
                    <div className="flex items-center gap-4 text-white/40 text-xs">
                      <span>{p.difficulty}</span>
                      <span>·</span>
                      <span>{p.weeks} weeks</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-[#e8643c]/60 text-white hover:text-[#e8643c] font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              View all programs →
            </Link>
          </div>
        </div>
      </section>

      {/* STRIDE CLUB BANNER */}
      <section className="bg-[#0a0a0a] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0a00] to-[#0d0d0d] border border-[#e8643c]/20 p-12 lg:p-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e8643c]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block bg-[#e8643c]/10 text-[#e8643c] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8643c]/20">
                👟 Stride Club
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Walk your way to the{' '}
                <span className="text-[#e8643c]">top of the board.</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Log your daily steps, compete on our live weekly leaderboard, and unlock monthly workbook PDFs. Stride Club turns your daily walk into a community challenge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/stride-club"
                  className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  Join Stride Club — From TTD $99.99/mo
                </Link>
                <Link
                  href="/stride-club"
                  className="inline-flex items-center justify-center text-white/60 hover:text-white px-8 py-4 rounded-xl transition-colors duration-200"
                >
                  See how it works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="bg-[#111] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">Everything you need</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3">
              One membership. All of it.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-[#e8643c]/30 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-[#0a0a0a] py-24" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-white/50 text-lg">
              All prices shown in USD · Caribbean pricing available at checkout
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                  plan.featured
                    ? 'bg-[#e8643c] border-transparent scale-105'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#e8643c] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-bold text-xl mb-2 text-white">{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-5xl font-black ${plan.featured ? 'text-white' : 'text-white'}`}>
                    ${plan.priceUSD}
                  </span>
                  <span className={`text-sm ml-1 ${plan.featured ? 'text-white/80' : 'text-white/40'}`}>
                    /{plan.period}
                  </span>
                  <p className={`text-sm mt-1 ${plan.featured ? 'text-white/70' : 'text-white/30'}`}>
                    ≈ TTD ${plan.priceTTD}/{plan.period}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 ${plan.featured ? 'text-white' : 'text-[#e8643c]'}`}>✓</span>
                      <span className={`text-sm ${plan.featured ? 'text-white/90' : 'text-white/60'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/membership?plan=${plan.id}`}
                  className={`block w-full text-center font-bold py-3.5 rounded-xl transition-all duration-200 ${
                    plan.featured
                      ? 'bg-white text-[#e8643c] hover:bg-white/90'
                      : 'bg-[#e8643c] text-white hover:bg-[#d4552e]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-sm mt-8">
            7-day full refund guarantee · Cancel anytime · No contracts
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#111] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">Real Members</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3">
              Results speak for themselves
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-[#e8643c] text-lg">★</span>
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-white/40 text-sm">{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#e8643c] py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Your transformation starts today.
          </h2>
          <p className="text-white/80 text-xl mb-10">
            Join thousands of women already building their BetterBod. Your first 7 days are risk-free.
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center justify-center bg-white text-[#e8643c] font-black px-10 py-5 rounded-xl text-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-white/95"
          >
            Get Started — From $14.99/mo
          </Link>
          <p className="text-white/60 text-sm mt-4">No credit card required to browse · Cancel anytime</p>
        </div>
      </section>
    </main>
  )
    }
