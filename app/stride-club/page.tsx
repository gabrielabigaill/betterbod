import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Stride Club — BetterBod',
  description: 'Join the BetterBod Stride Club. Weekly step challenges, live leaderboards, and monthly workbook PDFs. Turn your daily walk into a community challenge.',
}

export default async function StrideClubPage() {
  const supabase = await createClient()

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: leaderboard } = await supabase
    .from('stride_entries')
    .select('steps, profiles(name)')
    .eq('week_number', challenge?.week_number ?? 1)
    .order('steps', { ascending: false })
    .limit(10)

  const HOW_IT_WORKS = [
    { step: '01', title: 'Join Stride Club', body: 'Subscribe for TTD $99.99/mo and get instant access to the weekly challenge.' },
    { step: '02', title: 'Log your steps', body: 'Submit your daily step count from any fitness tracker or phone pedometer.' },
    { step: '03', title: 'Climb the leaderboard', body: 'Watch your rank rise in real-time as you accumulate steps through the week.' },
    { step: '04', title: 'Unlock your workbook', body: 'Complete the challenge and download your exclusive monthly PDF workbook.' },
  ]

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block bg-[#e8643c]/10 text-[#e8643c] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8643c]/20">
            👟 Stride Club
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
            Walk your way to the{' '}
            <span className="text-[#e8643c]">top.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed mb-10">
            Weekly step challenges, a live community leaderboard, and monthly workbook PDFs. Stride Club turns your daily walk into friendly competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup?plan=stride_club"
              className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.02]"
            >
              Join Stride Club — TTD $99.99/mo
            </Link>
            <Link
              href="/account/stride-club"
              className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
            >
              Log my steps →
            </Link>
          </div>
          <p className="text-white/30 text-sm mt-4">Cancel anytime · 7-day refund guarantee</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white">How it works</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <span className="text-[#e8643c] text-5xl font-black">{item.step}</span>
              <h3 className="text-white font-bold text-lg mt-4 mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live leaderboard preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">Live</span>
          <h2 className="text-4xl font-black text-white mt-2">
            {challenge ? `Week ${challenge.week_number} Leaderboard` : 'Leaderboard'}
          </h2>
          {challenge?.title && (
            <p className="text-white/50 mt-2">{challenge.title}</p>
          )}
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {leaderboard && leaderboard.length > 0 ? (
            <div className="divide-y divide-white/5">
              {leaderboard.map((entry, i) => {
                const name = (entry.profiles as any)?.name ?? 'Member'
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                return (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 text-center font-black ${i < 3 ? 'text-[#e8643c] text-xl' : 'text-white/30 text-sm'}`}>
                        {medal ?? `#${i + 1}`}
                      </span>
                      <span className="text-white font-medium">{name}</span>
                    </div>
                    <span className="text-white/60 text-sm font-mono">{entry.steps.toLocaleString()} steps</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-white/30">No entries yet — be the first on the board!</p>
            </div>
          )}
        </div>
        <p className="text-center text-white/30 text-sm mt-6">
          Join Stride Club to appear on the leaderboard
        </p>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e8643c]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Your steps. Your story.
          </h2>
          <p className="text-white/80 text-xl mb-10">
            Join thousands of members building a daily movement habit. Just TTD $99.99/month.
          </p>
          <Link
            href="/auth/signup?plan=stride_club"
            className="inline-flex items-center justify-center bg-white text-[#e8643c] font-black px-10 py-5 rounded-xl text-xl transition-all duration-200 hover:scale-[1.02]"
          >
            Join Stride Club Today
          </Link>
        </div>
      </section>
    </main>
  )
      }
