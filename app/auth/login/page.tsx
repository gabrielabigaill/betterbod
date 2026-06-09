'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/account')
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Welcome back</h1>
        <p className="text-[#999] text-center mb-8">Sign in to your BetterBod account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#c8a96e] text-black font-semibold py-3 rounded-lg hover:bg-[#b8994e] transition disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-[#666] text-sm text-center mt-4">
          <Link href="/auth/forgot-password" className="text-[#c8a96e] hover:underline">Forgot password?</Link>
        </p>
        <p className="text-[#666] text-sm text-center mt-2">
          No account? <Link href="/auth/signup" className="text-[#c8a96e] hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  )
}
