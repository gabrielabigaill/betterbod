import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = { title: 'Orders — Admin — BetterBod' }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email!)) redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, plan_type, status, total, created_at, paid_at, wipay_transaction_id, profiles(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin" className="text-white/30 hover:text-white text-sm transition-colors">← Admin</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Orders</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-8">Orders</h1>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">User</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Plan</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Total (TTD)</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders?.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white text-sm">{(o.profiles as any)?.name ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className="text-white/60 text-sm capitalize">{o.plan_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-mono">${o.total}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        o.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : o.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-white/10 text-white/30'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">
                      {new Date(o.created_at).toLocaleDateString('en-TT', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!orders?.length && (
            <div className="py-16 text-center">
              <p className="text-white/30">No orders yet</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
