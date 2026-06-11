import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const body = await req.formData()
  const steps = parseInt(body.get('steps')?.toString() ?? '0', 10)
  const week_number = parseInt(body.get('week_number')?.toString() ?? '0', 10)

  if (!steps || steps < 0 || steps > 100000) {
    return NextResponse.redirect(new URL('/account/stride-club?error=invalid', req.url))
  }

  const today = new Date().toISOString().slice(0, 10)

  const { error } = await supabase
    .from('stride_entries')
    .upsert(
      {
        user_id:     user.id,
        week_number,
        steps,
        logged_at:   today,
      },
      { onConflict: 'user_id,week_number,logged_at' }
    )

  if (error) {
    console.error('stride log error', error)
    return NextResponse.redirect(new URL('/account/stride-club?error=1', req.url))
  }

  return NextResponse.redirect(new URL('/account/stride-club?logged=1', req.url))
}
