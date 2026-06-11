import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = { title: 'Admin — BetterBod' }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email!)) redirect('/')

  const [
    { count: totalUsers },
    { count: activeOrders },
    { count: totalPrograms },
    { count: strideMembers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('plan_type', 'stride_club').eq('status', 'active'),
  ])

  const STATS = [
    { label: 'Total users', value: totalUsers ?? 0, icon: '👥' },
    { label: 'Active members', value: activeOrders ?? 0, icon: '✅' },
    { label: 'Active programs', value: totalPrograms ?? 0, icon: '🏋️' },
    { label: 'Stride Club members', value: strideMembers ?? 0, icon: '👟' },
  ]

  const NAV = [
    { href: '/admin/orders', icon: '💳', label: 'Orders', desc: 'View and manage all orders' },
    { href: '/admin/users', icon: '👥', label: 'Users', desc: 'Browse registered members' },
    { href: '/admin/programs', icon: '🏋️', label: 'Programs', desc: 'Manage fitness programs' },
    { href: '/admin/stride-club', icon: '👟', label: 'Stride Club', desc: 'Challenges and leaderboard' },
    { href: '/admin/nutrition', icon: '🥗', label: 'Nutrition', desc: 'Recipes and guides' },
  ]

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/40 mb-10">BetterBod management portal</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">{s.icon}</div>
              <p className="text-4xl font-black text-white">{s.value}</p>
              <p className="text-white/40 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="bg-white/[0.03] border border-white/10 hover:border-[#e8643c]/40 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{n.icon}</div>
              <h2 className="text-white font-bold text-lg">{n.label}</h2>
              <p className="text-white/40 text-sm mt-1">{n.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
