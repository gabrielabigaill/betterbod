'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function SignupPage() {
  const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await sb.auth.signUp({
      email, password,
      options: { data: { name } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">✉️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-[#999]">We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Create account</h1>
        <p className="text-[#999] text-center mb-8">Start your BetterBod journey</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Full name</label>
            <input type="text" required value={name} onChange={e=>setName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Password</label>
            <input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#c8a96e] text-black font-semibold py-3 rounded-lg hover:bg-[#b8994e] transition disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="text-[#666] text-sm text-center mt-4">
          Already have an account? <Link href="/auth/login" className="text-[#c8a96e] hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
