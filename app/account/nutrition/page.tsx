import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Nutrition — My Account — BetterBod',
}

export default async function AccountNutritionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const { data: recipes } = await supabase
    .from('nutrition_recipes')
    .select('id, slug, title, short_desc, cover_url, meal_type, prep_time_mins')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (!order) {
    return (
      <main className="bg-[#0d0d0d] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-3xl p-10 text-center">
          <div className="text-5xl mb-6">🥗</div>
          <h1 className="text-2xl font-black text-white mb-3">Unlock nutrition guides</h1>
          <p className="text-white/50 mb-8">
            All recipes and nutrition guides are included with your BetterBod membership.
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200"
          >
            Get Full Access — From $14.99/mo
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/account" className="text-white/30 hover:text-white text-sm transition-colors">
            ← Account
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Nutrition</span>
        </div>

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black text-white">Recipes & Guides</h1>
          <Link href="/nutrition" className="text-[#e8643c] text-sm hover:underline">Browse all →</Link>
        </div>

        {recipes && recipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((r) => (
              <Link
                key={r.id}
                href={`/nutrition/${r.slug}`}
                className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#e8643c]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-gradient-to-br from-[#e8643c]/10 to-[#0d0d0d] flex items-center justify-center">
                  <span className="text-4xl">🥗</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {r.meal_type && (
                      <span className="text-xs font-semibold bg-[#e8643c]/10 text-[#e8643c] px-2.5 py-1 rounded-full">
                        {r.meal_type}
                      </span>
                    )}
                    {r.prep_time_mins && (
                      <span className="text-white/30 text-xs">⏱ {r.prep_time_mins} min</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{r.title}</h3>
                  {r.short_desc && (
                    <p className="text-white/50 text-sm line-clamp-2">{r.short_desc}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/30 text-xl">Recipes coming soon!</p>
          </div>
        )}
      </section>
    </main>
  )
}
