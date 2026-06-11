import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = { title: 'My Account — BetterBod' }

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
  const { data: orders } = await supabase.from('orders').select('id, plan_type, status, total, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
  const activeOrder = orders?.find(o => o.status === 'active')
  const { data: programs } = await supabase.from('programs').select('id, slug, name, difficulty, weeks').eq('active', true).order('featured', { ascending: false }).limit(6)
  const displayName = profile?.name ?? user.email?.split('@')[0] ?? 'Member'

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-white/40 text-sm mb-1">Welcome back</p>
            <h1 className="text-3xl font-black text-white">{displayName}</h1>
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-white/30 hover:text-white text-sm transition-colors">Sign out</button>
          </form>
        </div>

        <div className={`rounded-2xl p-6 mb-8 border ${activeOrder ? 'bg-[#e8643c]/10 border-[#e8643c]/30' : 'bg-white/[0.03] border-white/10'}`}>
          {activeOrder ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#e8643c] text-xs font-semibold uppercase tracking-widest">Active membership</span>
                <p className="text-white font-bold text-lg mt-1 capitalize">{activeOrder.plan_type.replace('_', ' ')} Plan</p>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">Active</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">No active subscription</p>
                <p className="text-white/40 text-sm mt-1">Subscribe to access all programs</p>
              </div>
              <Link href="/membership" className="bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-6 py-3 rounded-xl text-sm">Get Access</Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { href: '/account/stride-club', icon: '👟', label: 'Stride Club' },
            { href: '/account/nutrition', icon: '🥗', label: 'Nutrition' },
            { href: '/programs', icon: '🏋️', label: 'Programs' },
            { href: '/challenges', icon: '🏆', label: 'Challenges' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="bg-white/[0.03] border border-white/10 hover:border-[#e8643c]/40 rounded-2xl p-5 text-center transition-all duration-200">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-white/60 text-sm font-medium">{item.label}</p>
            </Link>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">Your Programs</h2>
            <Link href="/programs" className="text-[#e8643c] text-sm hover:underline">View all →</Link>
          </div>
          {activeOrder ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs?.map(p => (
                <Link key={p.id} href={`/programs/${p.slug}`} className="bg-white/[0.03] border border-white/10 hover:border-[#e8643c]/40 rounded-2xl overflow-hidden transition-all duration-200">
                  <div className="aspect-video bg-gradient-to-br from-[#e8643c]/10 to-[#0d0d0d] flex items-center justify-center">
                    <span className="text-4xl">🏋️</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-sm">{p.name}</h3>
                    <p className="text-white/40 text-xs mt-1">{p.weeks}w · {p.difficulty}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
              <p className="text-white/30 mb-4">Subscribe to unlock all programs</p>
              <Link href="/membership" className="inline-flex bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-6 py-3 rounded-xl text-sm">View Plans</Link>
            </div>
          )}
        </div>

        {orders && orders.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-white mb-6">Order History</h2>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/5">
              {orders.map(o => (
                <div key={o.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-white text-sm font-medium capitalize">{o.plan_type.replace('_', ' ')} Plan</p>
                    <p className="text-white/30 text-xs">{new Date(o.created_at).toLocaleDateString('en-TT', { dateStyle: 'medium' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">TTD ${o.total}</p>
                    <span className={`text-xs font-semibold ${o.status === 'active' ? 'text-green-400' : 'text-white/30'}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
