import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Stride Club — My Account — BetterBod',
}

export default async function AccountStrideClubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: order } = await supabase
    .from('orders')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('plan_type', 'stride_club')
    .eq('status', 'active')
    .single()

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: myEntries } = await supabase
    .from('stride_entries')
    .select('steps, logged_at')
    .eq('user_id', user.id)
    .eq('week_number', challenge?.week_number ?? 0)
    .order('logged_at', { ascending: false })

  const { data: leaderboard } = await supabase
    .from('stride_entries')
    .select('steps, profiles(name)')
    .eq('week_number', challenge?.week_number ?? 0)
    .order('steps', { ascending: false })
    .limit(10)

  const totalSteps = myEntries?.reduce((sum, e) => sum + (e.steps ?? 0), 0) ?? 0

  if (!order) {
    return (
      <main className="bg-[#0d0d0d] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center">
          <div className="text-5xl mb-6">👟</div>
          <h1 className="text-2xl font-black text-white mb-3">Stride Club not active</h1>
          <p className="text-white/50 mb-8">
            Join Stride Club to log steps, compete on the leaderboard, and unlock monthly workbooks.
          </p>
          <Link
            href="/auth/signup?plan=stride_club"
            className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200"
          >
            Join Stride Club — TTD $99.99/mo
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/account" className="text-white/30 hover:text-white text-sm transition-colors">
            ← Account
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Stride Club</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">Stride Club</h1>
        {challenge && (
          <p className="text-white/40 mb-10">
            Week {challenge.week_number} · {challenge.title}
          </p>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-[#e8643c] text-4xl font-black">{totalSteps.toLocaleString()}</p>
            <p className="text-white/40 text-sm mt-2">My steps this week</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-white text-4xl font-black">{myEntries?.length ?? 0}</p>
            <p className="text-white/40 text-sm mt-2">Days logged</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-white text-4xl font-black">
              {leaderboard?.findIndex((e) => (e.profiles as any)?.name === user.user_metadata?.name) + 1 || '—'}
            </p>
            <p className="text-white/40 text-sm mt-2">Leaderboard rank</p>
          </div>
        </div>

        {challenge && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10">
            <h2 className="text-white font-bold text-lg mb-4">Log today&apos;s steps</h2>
            <form method="post" action="/api/stride/log" className="flex gap-3">
              <input type="hidden" name="week_number" value={challenge.week_number} />
              <input
                type="number"
                name="steps"
                min="0"
                max="100000"
                placeholder="Enter step count"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#e8643c]/60 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                Log steps
              </button>
            </form>
            <p className="text-white/30 text-xs mt-3">One log per day — updates replace today&apos;s count</p>
          </div>
        )}

        <div>
          <h2 className="text-white font-bold text-lg mb-4">
            {challenge ? `Week ${challenge.week_number} Leaderboard` : 'Leaderboard'}
          </h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            {leaderboard && leaderboard.length > 0 ? (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, i) => {
                  const name = (entry.profiles as any)?.name ?? 'Member'
                  const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                  const isMe = name === (user.user_metadata?.name ?? '')
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-6 py-4 ${isMe ? 'bg-[#e8643c]/10' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 text-center font-black ${i < 3 ? 'text-[#e8643c] text-xl' : 'text-white/30 text-sm'}`}>
                          {medal ?? `#${i + 1}`}
                        </span>
                        <span className={`font-medium ${isMe ? 'text-[#e8643c]' : 'text-white'}`}>
                          {name} {isMe && '(you)'}
                        </span>
                      </div>
                      <span className="text-white/60 text-sm font-mono">{entry.steps.toLocaleString()} steps</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-white/30">No entries yet — log your first steps!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
