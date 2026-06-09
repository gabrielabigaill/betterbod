// app/api/wipay/response/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const status        = p.get('status')
  const orderId       = p.get('order_id')
  const transactionId = p.get('transaction_id')
  const hash          = p.get('hash')
  const appUrl        = process.env.NEXT_PUBLIC_APP_URL!

  if (status !== 'success' || !orderId || !transactionId) {
    return NextResponse.redirect(`${appUrl}/membership?payment=failed`)
  }

  const { data: order } = await supabase
    .from('orders').select('*').eq('stripe_session_id', orderId).single()

  if (!order) return NextResponse.redirect(`${appUrl}/membership?payment=error`)

  const originalTotal = parseFloat(order.total).toFixed(2)
  const expected = crypto.createHash('md5')
    .update(`${transactionId}${originalTotal}${process.env.WIPAY_API_KEY}`)
    .digest('hex')

  if (hash !== expected) return NextResponse.redirect(`${appUrl}/membership?payment=error`)

  await supabase.from('orders')
    .update({ status: 'complete', stripe_payment_intent: transactionId })
    .eq('stripe_session_id', orderId)

  const planType = (order.plan_type ?? 'monthly') as string
  const now = new Date()
  const periodEnd = new Date(now)
  planType === 'annual'
    ? periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    : periodEnd.setMonth(periodEnd.getMonth() + 1)

  await supabase.from('subscriptions').upsert({
    user_id:                order.user_id,
    plan_type:              planType,
    status:                 'active',
    stripe_subscription_id: orderId,
    current_period_start:   now.toISOString(),
    current_period_end:     periodEnd.toISOString(),
  }, { onConflict: 'user_id' })

  return NextResponse.redirect(`${appUrl}/account?payment=success&plan=${planType}`)
}
