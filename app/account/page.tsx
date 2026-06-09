import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AccountPage({ searchParams }: { searchParams: { payment?: string; reset?: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', user.id).single()
  const { data: sub } = await supabase.from('subscriptions').select('plan_type, status, current_period_end')
    .eq('user_id', user.id).eq('status', 'active').maybeSingle()

  const planLabel: Record<string, string> = { monthly: 'Monthly', annual: 'Annual', stride_club: 'Stride Club' }
  const isAdmin = profile?.role === 'admin'

  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {searchParams.payment === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 mb-6 text-sm">
            Payment successful! Your {planLabel[searchParams.reset ?? ''] ?? 'membership'} is now active.
          </div>
        )}
        {searchParams.reset === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 mb-6 text-sm">
            Password updated successfully.
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Hi, {profile?.name ?? 'Member'} 👋</h1>
          <p className="text-[#999] text-sm mt-1">{user.email}</p>
        </div>
        {sub ? (
          <div className="bg-[#1a1a1a] border border-[#c8a96e]/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#c8a96e] text-sm font-semibold uppercase tracking-wide">Active Plan</p>
                <p className="text-white font-bold text-lg mt-0.5">{planLabel[sub.plan_type] ?? sub.plan_type}</p>
                <p className="text-[#666] text-xs mt-1">Renews {new Date(sub.current_period_end).toLocaleDateString()}</p>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs font-medium px-3 py-1 rounded-full">Active</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-8">
            <p className="text-[#999] text-sm mb-3">No active membership</p>
            <Link href="/membership" className="inline-block bg-[#c8a96e] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b8994e] transition">View Plans</Link>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/account/programs', icon: '🏋️', label: 'Programs' },
            { href: '/stride-club', icon: '🚶', label: 'Stride Club' },
            { href: '/account/billing', icon: '💳', label: 'Billing' },
            { href: '/account/settings', icon: '⚙️', label: 'Settings' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center hover:border-[#c8a96e]/40 transition group">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-white text-sm font-medium group-hover:text-[#c8a96e] transition">{item.label}</p>
            </Link>
          ))}
        </div>
        {isAdmin && (
          <div className="mt-6">
            <Link href="/admin" className="text-[#c8a96e] text-sm hover:underline">→ Admin Dashboard</Link>
          </div>
        )}
      </div>
    </main>
  )
}
