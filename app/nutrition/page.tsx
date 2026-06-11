import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Nutrition Guides & Recipes — BetterBod',
  description: 'Simple, real-food recipes and meal frameworks. No diet culture, no restriction — just food that fuels your transformation.',
}

export default async function NutritionPage() {
  const supabase = await createClient()

  const { data: recipes } = await supabase
    .from('nutrition_recipes')
    .select('id, slug, title, short_desc, cover_url, meal_type, prep_time_mins')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block bg-[#e8643c]/10 text-[#e8643c] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#e8643c]/20">
            🥗 Nutrition
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-6">
            Food that{' '}
            <span className="text-[#e8643c]">actually works.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            No crash diets. No calorie obsession. Just simple, real-food recipes and meal frameworks designed to fuel your workouts and support your goals.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: '🍽️', title: 'Real food only', body: 'Every recipe uses whole, accessible ingredients you can actually find at your local grocery.' },
            { icon: '⏱️', title: 'Quick to make', body: "Most meals prep in under 30 minutes. Because real life doesn't wait for complicated recipes." },
            { icon: '🌴', title: 'Caribbean-friendly', body: "Recipes use local staples and seasonal produce. No imported 'superfoods' required." },
          ].map((f) => (
            <div key={f.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recipes grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-white">Recipes & guides</h2>
        </div>
        {recipes && recipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((r) => (
              <Link
                key={r.id}
                href={`/nutrition/${r.slug}`}
                className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#e8643c]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video overflow-hidden">
                  {r.cover_url ? (
                    <Image
                      src={r.cover_url}
                      alt={r.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#e8643c]/10 to-[#0d0d0d] flex items-center justify-center">
                      <span className="text-5xl">🥗</span>
                    </div>
                  )}
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
            <p className="text-white/30 text-xl">Recipes coming soon — check back shortly!</p>
          </div>
        )}
      </section>

      {/* Membership gate */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111] border-t border-white/10 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Full access with membership</h2>
        <p className="text-white/50 mb-8 max-w-xl mx-auto">
          All nutrition guides and recipes are included in your BetterBod membership — alongside all workout programs.
        </p>
        <Link
          href="/membership"
          className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200"
        >
          Get Full Access — From $14.99/mo
        </Link>
      </section>
    </main>
  )
}
