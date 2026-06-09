import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProgramsPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: sub } = await supabase.from('subscriptions')
    .select('id').eq('user_id', user.id).eq('status', 'active').maybeSingle()

  const { data: programs } = await supabase.from('programs')
    .select('id, slug, name, short_desc, difficulty, weeks, days_per_week, cover_url')
    .eq('active', true).order('created_at')

  if (!sub) return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Members Only</h1>
        <p className="text-[#999] mb-6">Subscribe to unlock all training programs.</p>
        <Link href="/membership" className="bg-[#c8a96e] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#b8994e] transition">View Plans</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-[#666] hover:text-white transition text-sm">← Account</Link>
          <h1 className="text-2xl font-bold text-white">My Programs</h1>
        </div>
        {programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(p => (
              <Link key={p.id} href={`/programs/${p.slug}`}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#c8a96e]/40 transition group">
                <div className="aspect-video bg-[#111] relative">
                  {p.cover_url
                    ? <img src={p.cover_url} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🏋️</div>}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold group-hover:text-[#c8a96e] transition">{p.name}</h3>
                  {p.short_desc && <p className="text-[#999] text-sm mt-1 line-clamp-2">{p.short_desc}</p>}
                  <div className="flex gap-3 mt-3 text-xs text-[#666]">
                    {p.difficulty && <span className="capitalize">{p.difficulty}</span>}
                    {p.weeks && <span>{p.weeks}w · {p.days_per_week}d/wk</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[#666]">No programs available yet. Check back soon!</p>
        )}
      </div>
    </main>
  )
}
