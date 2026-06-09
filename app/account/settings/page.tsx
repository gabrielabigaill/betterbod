'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    sb.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setEmail(user.email ?? '')
      sb.from('profiles').select('name').eq('id', user.id).single()
        .then(({ data }) => { if (data) setName(data.name ?? '') })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    await sb.from('profiles').update({ name }).eq('id', user.id)
    setMsg('Saved!')
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleSignOut() {
    await sb.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-[#666] hover:text-white transition text-sm">← Account</Link>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
        <form onSubmit={handleSave} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-4 space-y-4">
          <h2 className="text-white font-semibold">Profile</h2>
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Full name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)}
              className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Email</label>
            <input type="email" value={email} disabled
              className="w-full bg-[#111] border border-[#333] text-[#666] rounded-lg px-4 py-2.5 cursor-not-allowed" />
          </div>
          {msg && <p className="text-green-400 text-sm">{msg}</p>}
          <button type="submit" disabled={loading}
            className="bg-[#c8a96e] text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-[#b8994e] transition disabled:opacity-60">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Account</h2>
          <button onClick={handleSignOut}
            className="text-red-400 text-sm hover:text-red-300 transition">Sign out</button>
        </div>
      </div>
    </main>
  )
}
