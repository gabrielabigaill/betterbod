import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = { title: 'Stride Club — Admin — BetterBod' }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())

export default async function AdminStrideClubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email!)) redirect('/')

  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: recentEntries } = await supabase
    .from('stride_entries')
    .select('steps, logged_at, week_number, profiles(name)')
    .order('logged_at', { ascending: false })
    .limit(50)

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin" className="text-white/30 hover:text-white text-sm transition-colors">← Admin</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Stride Club</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-8">Stride Club</h1>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Challenges</h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Title</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Week</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {challenges?.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 text-white text-sm">{c.title}</td>
                    <td className="px-6 py-4 text-white/60 text-sm">Week {c.week_number}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        c.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'
                      }`}>
                        {c.active ? 'Active' : 'Ended'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!challenges?.length && (
              <div className="py-12 text-center">
                <p className="text-white/30">No challenges yet — add via Supabase</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Step Logs</h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Member</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Steps</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Week</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentEntries?.map((e, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-white text-sm">{(e.profiles as any)?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-white/60 text-sm font-mono">{e.steps?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">Week {e.week_number}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">{e.logged_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!recentEntries?.length && (
              <div className="py-12 text-center">
                <p className="text-white/30">No step logs yet</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
