// app/api/stride/route.ts  (handles both start and stop)
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const StartSchema = z.object({ action: z.literal('start') })

const StopSchema = z.object({
  action:           z.literal('stop'),
  session_id:       z.string().uuid(),
  steps:            z.number().int().min(0).max(50_000), // anti-cheat cap
  duration_seconds: z.number().int().min(0),
})

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase    = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Verify user has active Stride Club subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .in('plan_type', ['stride_club', 'annual'])
    .eq('status', 'active')
    .maybeSingle()

  if (!sub) return NextResponse.json({ error: 'Stride Club subscription required' }, { status: 403 })

  const body = await req.json()

  // ── START session ──────────────────────────────────────────
  if (body.action === 'start') {
    const now        = new Date()
    const weekNumber = getISOWeek(now)
    const year       = now.getFullYear()

    const { data, error } = await supabase
      .from('stride_sessions')
      .insert({
        user_id:     user.id,
        steps:       0,
        started_at:  now.toISOString(),
        week_number: weekNumber,
        year,
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ session_id: data.id })
  }

  // ── STOP session ───────────────────────────────────────────
  if (body.action === 'stop') {
    let parsed: z.infer<typeof StopSchema>
    try { parsed = StopSchema.parse(body) }
    catch { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }) }

    // Verify session belongs to this user
    const { data: session } = await supabase
      .from('stride_sessions')
      .select('user_id, started_at')
      .eq('id', parsed.session_id)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Anti-cheat: session must be at least 60 seconds old
    const sessionAge = (Date.now() - new Date(session.started_at).getTime()) / 1000
    if (sessionAge < 60) {
      return NextResponse.json({ error: 'Session too short' }, { status: 400 })
    }

    // Anti-cheat: flag suspicious step rates (> 5 steps/sec average)
    const stepsPerSecond = parsed.steps / Math.max(parsed.duration_seconds, 1)
    const isFlagged      = stepsPerSecond > 5 || parsed.steps >= 50_000
    const flagReason     = stepsPerSecond > 5
      ? `Suspicious rate: ${stepsPerSecond.toFixed(1)} steps/sec`
      : parsed.steps >= 50_000
        ? 'Max steps cap reached'
        : null

    const { error } = await supabase
      .from('stride_sessions')
      .update({
        steps:            parsed.steps,
        duration_seconds: parsed.duration_seconds,
        ended_at:         new Date().toISOString(),
        is_flagged:       isFlagged,
        flag_reason:      flagReason,
      })
      .eq('id', parsed.session_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ saved: true, flagged: isFlagged })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

// GET — leaderboard
export async function GET() {
  const cookieStore = cookies()
  const supabase    = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data, error } = await supabase
    .from('stride_leaderboard_weekly')
    .select('*')
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leaderboard: data })
}

// ── ISO week number helper ──────────────────────────────────
function getISOWeek(date: Date): number {
  const d     = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}
