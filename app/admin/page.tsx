// app/admin/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getStats() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`
  const [orders, users, subs, flagged] = await Promise.all([
    supabase.from('orders').select('id,total_usd,created_at').gte('created_at', monthStart),
    supabase.from('profiles').select('id,created_at').gte('created_at', monthStart),
    supabase.from('subscriptions').select('id,plan_type,status').eq('status','active'),
    supabase.from('stride_sessions').select('id').eq('is_flagged',true).is('reviewed_at',null),
  ])
  const revenue = (orders.data ?? []).reduce((s, o) => s + (o.total_usd ?? 0), 0)
  const striders = (subs.data ?? []).filter(s => ['stride_club','annual'].includes(s.plan_type)).length
  return {
    revenueThisMonth: revenue,
    ordersThisMonth: (orders.data ?? []).length,
    newUsersThisMonth: (users.data ?? []).length,
    activeSubscriptions: (subs.data ?? []).length,
    strideMembers: striders,
    flaggedSessions: (flagged.data ?? []).length,
    recentOrders: orders.data?.slice(-5).reverse() ?? [],
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const statCards = [
    { label: 'Revenue This Month',  value: `$${stats.revenueThisMonth.toFixed(2)}`, color: '#FF6357', sub: 'USD gross' },
    { label: 'Orders This Month',   value: stats.ordersThisMonth,    color: '#00B4A0', sub: 'completed' },
    { label: 'New Members',         value: stats.newUsersThisMonth,  color: '#F5A623', sub: 'this month' },
    { label: 'Active Subscribers',  value: stats.activeSubscriptions,color: '#FF6357', sub: `${stats.strideMembers} in Stride Club` },
  ]
  return (
    <div className="space-y-6">
      {stats.flaggedSessions > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 flex items-center justify-between">
          <span className="text-amber-800 text-sm font-medium">⚠️ {stats.flaggedSessions} flagged Stride session{stats.flaggedSessions > 1 ? 's' : ''} need review</span>
          <a href="/admin/stride?filter=flagged" className="text-sm text-amber-700 underline">Review →</a>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{card.label}</div>
            <div className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New Program', href: '/admin/programs/new' },
            { label: '+ New Product', href: '/admin/products/new' },
            { label: '+ New Coupon',  href: '/admin/coupons/new'  },
            { label: '📧 Send Email', href: '/admin/email-templates' },
          ].map(a => (
            <a key={a.href} href={a.href} className="px-4 py-2 rounded-lg bg-[#f5f5f5] hover:bg-[#FF6357] hover:text-white text-sm font-medium text-[#1a1a2e] transition-colors">{a.label}</a>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#1a1a2e]">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-[#FF6357] hover:underline">View all →</a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Order ID</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats.recentOrders.length === 0
              ? <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400">No orders this month yet</td></tr>
              : stats.recentOrders.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.id.slice(0,8)}…</td>
                  <td className="px-5 py-3 text-gray-600">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right font-medium">${(o.total_usd??0).toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
