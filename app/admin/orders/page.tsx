// app/admin/orders/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function AdminOrders() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: orders } = await supabase
    .from('orders')
    .select('id,created_at,status,total_usd,currency,profiles(full_name,email)')
    .order('created_at', { ascending: false })
    .limit(100)

  const statusColor: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    pending:   'bg-amber-100 text-amber-700',
    refunded:  'bg-red-100 text-red-700',
    failed:    'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{orders?.length ?? 0} orders total</p>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(orders ?? []).length === 0
                ? <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No orders yet</td></tr>
                : (orders ?? []).map((o: any) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{o.id.slice(0,8)}…</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-[#1a1a2e]">{o.profiles?.full_name ?? '—'}</div>
                      <div className="text-xs text-gray-400">{o.profiles?.email ?? '—'}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[o.status] ?? 'bg-gray-100 text-gray-500'}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">${(o.total_usd??0).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
