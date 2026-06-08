// app/admin/users/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function AdminUsers() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: users } = await supabase
    .from('profiles')
    .select('id,full_name,email,role,created_at,subscriptions(plan_type,status)')
    .order('created_at', { ascending: false })
    .limit(100)

  const roleColor: Record<string, string> = {
    admin:  'bg-red-100 text-red-700',
    member: 'bg-blue-100 text-blue-700',
    user:   'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{users?.length ?? 0} users</p>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Subscription</th>
                <th className="px-5 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(users ?? []).length === 0
                ? <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No users yet</td></tr>
                : (users ?? []).map((u: any) => {
                    const activeSub = u.subscriptions?.find((s: any) => s.status === 'active')
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-[#1a1a2e]">{u.full_name ?? '—'}</td>
                        <td className="px-5 py-3 text-gray-500">{u.email}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor[u.role] ?? 'bg-gray-100 text-gray-500'}`}>{u.role ?? 'user'}</span>
                        </td>
                        <td className="px-5 py-3">
                          {activeSub
                            ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{activeSub.plan_type}</span>
                            : <span className="text-gray-400 text-xs">none</span>}
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
