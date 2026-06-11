import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Challenges — BetterBod',
  description: 'Join BetterBod challenges. Weekly and monthly fitness challenges to push your limits, earn badges, and compete with the community.',
}

export default async function ChallengesPage() {
  const supabase = await createClient()

  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block bg-[#e8643c]/10 text-[#e8643c] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8643c]/20">
            🏆 Challenges
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-6">
            Push your limits.
            <br />
            <span className="text-[#e8643c]">Win together.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            Weekly and monthly fitness challenges designed to push you further. Complete challenges, earn badges, and compete with the BetterBod community.
          </p>
        </div>
      </section>

      {/* Challenges grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        {challenges && challenges.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#e8643c]/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{c.emoji ?? '🏆'}</span>
                  <span className="text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full">Active</span>
                </div>
                <h2 className="text-white font-bold text-xl mb-2">{c.title}</h2>
                {c.description && (
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{c.description}</p>
                )}
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  {c.end_date && (
                    <span className="text-white/30 text-xs">
                      Ends {new Date(c.end_date).toLocaleDateString('en-TT', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {user ? (
                    <Link href="/account/stride-club" className="text-[#e8643c] text-sm font-semibold hover:underline">Log steps →</Link>
                  ) : (
                    <Link href="/auth/signup?plan=stride_club" className="text-[#e8643c] text-sm font-semibold hover:underline">Join to compete →</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-6 block">🏆</span>
            <h2 className="text-2xl font-bold text-white mb-4">Challenges launching soon</h2>
            <p className="text-white/40 mb-8">Be the first to know when new challenges drop.</p>
            <Link href="/membership" className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200">
              Get Membership
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Challenges are included in Stride Club</h2>
        <p className="text-white/50 mb-8 max-w-xl mx-auto">
          Access all challenges and the live leaderboard with your Stride Club subscription.
        </p>
        <Link href="/stride-club" className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200">
          Learn about Stride Club →
        </Link>
      </section>
    </main>
  )
                    }
