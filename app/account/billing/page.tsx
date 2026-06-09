import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BillingPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: sub } = await supabase.from('subscriptions')
    .select('plan_type, status, current_period_start, current_period_end')
    .eq('user_id', user.id).maybeSingle()

  const { data: orders } = await supabase.from('orders')
    .select('id, total, currency, status, created_at, plan_type')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)

  const planLabel: Record<string, string> = { monthly: 'Monthly', annual: 'Annual', stride_club: 'Stride Club' }

  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-[#666] hover:text-white transition text-sm">← Account</Link>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Current Plan</h2>
          {sub ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#999]">Plan</span><span className="text-white font-medium">{planLabel[sub.plan_type] ?? sub.plan_type}</span></div>
              <div className="flex justify-between"><span className="text-[#999]">Status</span><span className={sub.status==='active'?'text-green-400':'text-red-400'}>{sub.status}</span></div>
              <div className="flex justify-between"><span className="text-[#999]">Started</span><span className="text-white">{new Date(sub.current_period_start).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-[#999]">Renews</span><span className="text-white">{new Date(sub.current_period_end).toLocaleDateString()}</span></div>
            </div>
          ) : (
            <div>
              <p className="text-[#666] text-sm mb-3">No active subscription</p>
              <Link href="/membership" className="inline-block bg-[#c8a96e] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b8994e] transition">Get a Plan</Link>
            </div>
          )}
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Payment History</h2>
          {orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                  <div>
                    <p className="text-white text-sm">{planLabel[o.plan_type] ?? 'Order'}</p>
                    <p className="text-[#666] text-xs">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{o.currency} {Number(o.total).toFixed(2)}</p>
                    <p className={o.status==='complete'?'text-green-400 text-xs':'text-yellow-400 text-xs'}>{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-[#666] text-sm">No payment history yet.</p>}
        </div>
      </div>
    </main>
  )
}
