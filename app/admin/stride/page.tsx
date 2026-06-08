// app/admin/stride/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function AdminStride({ searchParams }: { searchParams: { filter?: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const flaggedOnly = searchParams.filter === 'flagged'
  let query = supabase
    .from('stride_sessions')
    .select('id,user_id,steps,duration_seconds,started_at,is_flagged,flag_reason,week_number,year,profiles(full_name,email)')
    .order('started_at', { ascending: false })
    .limit(100)
  if (flaggedOnly) query = query.eq('is_flagged', true).is('reviewed_at', null)
  const { data: sessions } = await query
  const flagged = sessions?.filter(s => s.is_flagged) ?? []
  const normal  = sessions?.filter(s => !s.is_flagged) ?? []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Sessions',   value: sessions?.length ?? 0, color: '#00B4A0' },
          { label: 'Flagged Sessions', value: flagged.length,         color: '#F5A623' },
          { label: 'Clean Sessions',   value: normal.length,          color: '#FF6357' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <a href="/admin/stride" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!flaggedOnly ? 'bg-[#FF6357] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>All Sessions</a>
        <a href="/admin/stride?filter=flagged" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${flaggedOnly ? 'bg-[#FF6357] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
          Flagged {flagged.length > 0 && <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{flagged.length}</span>}
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Member</th>
                <th className="px-5 py-3 text-left">Week</th>
                <th className="px-5 py-3 text-right">Steps</th>
                <th className="px-5 py-3 text-right">Duration</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Flag Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(sessions ?? []).length === 0
                ? <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No sessions found</td></tr>
                : (sessions ?? []).map((s: any) => (
                  <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${s.is_flagged ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="font-medium text-[#1a1a2e]">{s.profiles?.full_name ?? '—'}</div>
                      <div className="text-xs text-gray-400">{s.profiles?.email ?? '—'}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">W{s.week_number} {s.year}</td>
                    <td className="px-5 py-3 text-right font-medium">{(s.steps ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-gray-500">{s.duration_seconds ? `${Math.round(s.duration_seconds/60)}m` : '—'}</td>
                    <td className="px-5 py-3">
                      {s.is_flagged
                        ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Flagged</span>
                        : <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Clean</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">{s.flag_reason ?? '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
