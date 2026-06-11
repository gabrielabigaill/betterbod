import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = { title: 'Users — Admin — BetterBod' }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email!)) redirect('/')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin" className="text-white/30 hover:text-white text-sm transition-colors">← Admin</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Users</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-8">Users</h1>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">User ID</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {profiles?.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white text-sm">{p.name ?? '—'}</td>
                    <td className="px-6 py-4 text-white/30 text-xs font-mono">{p.id}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">
                      {new Date(p.created_at).toLocaleDateString('en-TT', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!profiles?.length && (
            <div className="py-16 text-center">
              <p className="text-white/30">No users yet</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
