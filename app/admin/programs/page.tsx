import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = { title: 'Programs — Admin — BetterBod' }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())

export default async function AdminProgramsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email!)) redirect('/')

  const { data: programs } = await supabase
    .from('programs')
    .select('id, name, slug, difficulty, weeks, active, featured, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin" className="text-white/30 hover:text-white text-sm transition-colors">← Admin</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Programs</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-8">Programs</h1>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Difficulty</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Weeks</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {programs?.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/programs/${p.slug}`} className="text-white text-sm hover:text-[#e8643c] transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm capitalize">{p.difficulty}</td>
                    <td className="px-6 py-4 text-white/60 text-sm">{p.weeks}w</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'
                      }`}>
                        {p.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">{p.featured ? '⭐ Yes' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!programs?.length && (
            <div className="py-16 text-center">
              <p className="text-white/30">No programs yet — add them via Supabase</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
