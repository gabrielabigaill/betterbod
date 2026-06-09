'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })
    setDone(true)
  }

  if (done) return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-[#999]">If an account exists for <strong className="text-white">{email}</strong>, you'll receive a reset link shortly.</p>
        <Link href="/auth/login" className="inline-block mt-6 text-[#c8a96e] hover:underline text-sm">Back to login</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Reset password</h1>
        <p className="text-[#999] text-center mb-8">Enter your email and we'll send a reset link</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#c8a96e] text-black font-semibold py-3 rounded-lg hover:bg-[#b8994e] transition disabled:opacity-60">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-[#666] text-sm text-center mt-4">
          <Link href="/auth/login" className="text-[#c8a96e] hover:underline">Back to login</Link>
        </p>
      </div>
    </main>
  )
}
