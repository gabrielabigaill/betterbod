'use client'
import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LBEntry = { user_id:string; full_name:string; total_steps:number; session_count:number; rank:number }

export default function StrideClubPage() {
  const router = useRouter()
  const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [uid, setUid]       = useState<string|null>(null)
  const [access, setAccess] = useState<boolean|null>(null)
  const [lb, setLb]         = useState<LBEntry[]>([])
  const [sid, setSid]       = useState<string|null>(null)
  const [steps, setSteps]   = useState(0)
  const [secs, setSecs]     = useState(0)
  const [on, setOn]         = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState('')
  const timer = useRef<ReturnType<typeof setInterval>|null>(null)

  const loadLB = () => fetch('/api/stride').then(r=>r.json()).then(j=>setLb(j.leaderboard??[]))

  useEffect(() => {
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUid(user.id)
      const { data:sub } = await sb.from('subscriptions').select('id')
        .eq('user_id',user.id).in('plan_type',['stride_club','annual']).eq('status','active').maybeSingle()
      setAccess(!!sub)
      loadLB()
    })
  }, [])

  async function start() {
    const r = await fetch('/api/stride',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'start'})})
    const {session_id} = await r.json()
    setSid(session_id); setSteps(0); setSecs(0); setOn(true)
    timer.current = setInterval(()=>setSecs(s=>s+1),1000)
  }

  async function stop() {
    if (!sid) return
    if (timer.current) clearInterval(timer.current)
    setOn(false); setSaving(true)
    const r = await fetch('/api/stride',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'stop',session_id:sid,steps,duration_seconds:secs})})
    const d = await r.json()
    setSaving(false); setSid(null); setMsg(d.flagged?'Saved (under review)':'Steps logged!')
    loadLB(); setTimeout(()=>setMsg(''),4000)
  }

  const fmt = (s:number) => String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')
  const me = lb.find(e=>e.user_id===uid)

  if (access===null) return <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center"><p className="text-[#666]">Loading…</p></main>

  if (!access) return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🚶‍♀️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Stride Club</h1>
        <p className="text-[#999] mb-6">Join Stride Club or upgrade to Annual to unlock the step tracker and leaderboard.</p>
        <Link href="/membership" className="bg-[#c8a96e] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#b8994e] transition">View Plans</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Stride Club</h1>
        <p className="text-[#999] mb-10">Track your steps. Climb the leaderboard. Resets every Monday.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6">Step Counter</h2>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-[#c8a96e] mb-1">{steps.toLocaleString()}</div>
              <div className="text-[#666] text-sm">steps this session</div>
              {on && <div className="text-[#999] text-sm mt-2">{fmt(secs)}</div>}
            </div>
            {on && <div className="mb-4">
              <label className="block text-sm text-[#ccc] mb-2">Enter your step count</label>
              <input type="number" min="0" max="50000" value={steps} onChange={e=>setSteps(Math.max(0,parseInt(e.target.value)||0))}
                className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2 text-center text-2xl focus:outline-none focus:border-[#c8a96e]" />
            </div>}
            {msg && <p className="text-green-400 text-sm text-center mb-3">{msg}</p>}
            {!on
              ? <button onClick={start} className="w-full bg-[#c8a96e] text-black font-semibold py-3 rounded-lg hover:bg-[#b8994e] transition">Start Session</button>
              : <button onClick={stop} disabled={saving} className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-50">{saving?'Saving…':'Stop & Log Steps'}</button>
            }
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6">Your Week</h2>
            {me ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[#999]">Total steps</span><span className="text-white font-semibold">{me.total_steps.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#999]">Sessions</span><span className="text-white font-semibold">{me.session_count}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#999]">Rank</span><span className="text-[#c8a96e] font-bold text-xl">#{me.rank}</span></div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-[#666] mb-1"><span>Goal: 70,000 steps</span><span>{Math.min(100,Math.round(me.total_steps/700))}%</span></div>
                  <div className="h-2 bg-[#2a2a2a] rounded-full"><div className="h-full bg-[#c8a96e] rounded-full transition-all" style={{width:Math.min(100,me.total_steps/700)+'%'}} /></div>
                </div>
              </div>
            ) : <p className="text-[#666] text-sm">Complete a session to see your stats here.</p>}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Weekly Leaderboard</h2>
          {lb.length===0 ? <p className="text-[#666] text-sm">No sessions this week yet — be the first!</p> : (
            <div className="space-y-2">
              {lb.slice(0,20).map((e,i)=>(
                <div key={e.user_id} className={'flex items-center gap-4 p-3 rounded-lg transition '+(e.user_id===uid?'bg-[#c8a96e]/10 border border-[#c8a96e]/30':'hover:bg-[#222]')}>
                  <span className={'w-8 text-center font-bold '+(i<3?'text-[#c8a96e]':'text-[#555]')}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+e.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-sm font-bold text-[#c8a96e]">{e.full_name?.[0]?.toUpperCase()??'?'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{e.full_name??'Member'}{e.user_id===uid&&<span className="text-[#c8a96e] ml-1 text-xs">(you)</span>}</p>
                    <p className="text-[#666] text-xs">{e.session_count} session{e.session_count!==1?'s':''}</p>
                  </div>
                  <span className="text-white font-semibold">{e.total_steps.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
