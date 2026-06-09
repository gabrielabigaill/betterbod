'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true); setError('')
    const { error } = await sb.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/account?reset=success')
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Set new password</h1>
        <p className="text-[#999] text-center mb-8">Choose a strong password</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#ccc] mb-1">New password</label>
            <input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          <div>
            <label className="block text-sm text-[#ccc] mb-1">Confirm password</label>
            <input type="password" required minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c8a96e]" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#c8a96e] text-black font-semibold py-3 rounded-lg hover:bg-[#b8994e] transition disabled:opacity-60">
            {loading ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  )
}
