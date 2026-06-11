import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data: p } = await supabase.from('programs').select('name, short_desc').eq('slug', params.slug).single()
  if (!p) return { title: 'Program — BetterBod' }
  return { title: p.name + ' — BetterBod', description: p.short_desc ?? undefined }
}

const DIFF: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default async function ProgramDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: program } = await supabase
    .from('programs').select('*').eq('slug', params.slug).eq('active', true).single()
  if (!program) notFound()
  const { data: { user } } = await supabase.auth.getUser()
  let hasAccess = false
  if (user) {
    const { data: ord } = await supabase.from('orders').select('id')
      .eq('user_id', user.id).eq('status', 'active').limit(1).single()
    hasAccess = !!ord
  }
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <section className="relative pt-24">
        <div className="relative h-[50vh] min-h-[400px] max-h-[600px]">
          {program.cover_url
            ? <Image src={program.cover_url} alt={program.name} fill className="object-cover" priority sizes="100vw" />
            : <div className="absolute inset-0 bg-gradient-to-br from-[#e8643c]/30 to-[#0d0d0d]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />
        </div>
        <div className="relative z-10 -mt-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ' + (DIFF[program.difficulty] ?? DIFF.beginner)}>
                {program.difficulty}
              </span>
              <span className="text-white/40 text-sm">{program.weeks} weeks</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{program.name}</h1>
            {program.short_desc && <p className="text-white/60 text-lg leading-relaxed mb-6">{program.short_desc}</p>}
            {program.description && <p className="text-white/60 leading-relaxed mb-8">{program.description}</p>}
            <div className="border-t border-white/10 pt-8">
              {hasAccess ? (
                <div className="flex items-center gap-4">
                  <Link href="/account" className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl">Go to My Dashboard</Link>
                  <p className="text-white/40 text-sm">Included in your membership</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link href="/membership" className="inline-flex items-center justify-center bg-[#e8643c] hover:bg-[#d4552e] text-white font-bold px-8 py-4 rounded-xl text-lg">
                    {program.price && program.price > 0 ? 'Get This Program' : 'Start — From $14.99/mo'}
                  </Link>
                  <p className="text-white/40 text-sm">7-day refund guarantee</p>
                </div>
              )}
            </div>
          </div>
          <div className="pt-8">
            <Link href="/programs" className="text-white/40 hover:text-white transition-colors text-sm">Back to all programs</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
