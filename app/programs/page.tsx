import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Fitness Programs — BetterBod',
  description: 'Browse all BetterBod fitness programs. Beginner to advanced. Gym, home, and travel-friendly workout plans designed for women.',
}

const DIFFICULTY_COLORS = {
  beginner:     'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced:     'bg-red-500/20 text-red-400 border-red-500/30',
}

export default async function ProgramsPage({ searchParams }: { searchParams: { difficulty?: string } }) {
  const supabase = await createClient()
  const difficulty = searchParams.difficulty
  let query = supabase
    .from('programs')
    .select('id, slug, name, short_desc, cover_url, difficulty, weeks, price')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
    query = query.eq('difficulty', difficulty)
  }
  const { data: programs } = await query
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">All Programs</span>
        <h1 className="text-5xl sm:text-6xl font-black text-white mt-3 mb-6">Find your program</h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto">Every plan is structured, tested, and designed to get you real results.</p>
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[{label:'All',value:undefined},{label:'Beginner',value:'beginner'},{label:'Intermediate',value:'intermediate'},{label:'Advanced',value:'advanced'}].map(({label,value})=>(
            <Link key={label} href={value ? `/programs?difficulty=${value}` : '/programs'} className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${difficulty===value||(!difficulty&&!value)?'bg-[#e8643c] border-[#e8643c] text-white':'border-white/20 text-white/60 hover:border-white/40 hover:text-white'}`}>{label}</Link>
          ))}
        </div>
      </section>
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {programs && programs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p)=>(
              <Link key={p.id} href={`/programs/${p.slug}`} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#e8643c]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {p.cover_url?(<Image src={p.cover_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"/>):(<div className="w-full h-full bg-gradient-to-br from-[#e8643c]/20 to-[#0d0d0d] flex items-center justify-center"><span className="text-6xl">🏋️</span></div>)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
                  <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${DIFFICULTY_COLORS[p.difficulty as keyof typeof DIFFICULTY_COLORS]??DIFFICULTY_COLORS.beginner}`}>{p.difficulty}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-white font-bold text-xl mb-2">{p.name}</h2>
                  {p.short_desc&&(<p className="text-white/50 text-sm line-clamp-2 mb-4">{p.short_desc}</p>)}
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">{p.weeks} weeks</span>
                    {p.price!=null&&p.price>0&&(<span className="text-[#e8643c] font-bold text-sm">${p.price}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ):(<div className="text-center py-24"><p className="text-white/30 text-xl">Programs coming soon!</p></div>)}
      </section>
      <section className="border-t border-white/10 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-black text-white mb-4">All programs included with membership</h2>
        <p className="text-white/50 mb-8">One subscription. Access to everything.</p>
        <Link href="/membership" className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200">Get Full Access — From $14.99/mo</Link>
      </section>
    </main>
  )
}
