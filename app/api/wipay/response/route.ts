// app/api/wipay/response/route.ts
// WiPay redirects here (GET) after payment is completed on hosted page
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Use service-role client — this runs server-side only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams

  const status        = p.get('status')
  const orderId       = p.get('order_id')       // our custom order ID
  const transactionId = p.get('transaction_id') // WiPay transaction ID
  const hash          = p.get('hash')           // MD5 verification (success only)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  // ── Non-success: redirect to failure page ──────────────────
  if (status !== 'success' || !orderId || !transactionId) {
    const msg = p.get('message') ?? 'failed'
    console.warn('WiPay payment not successful:', { status, orderId, msg })
    return NextResponse.redirect(`${appUrl}/membership?payment=failed`)
  }

  // ── Fetch pending order from Supabase ──────────────────────
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', orderId)  // stripe_session_id repurposed as wipay_order_id
    .single()

  if (!order) {
    console.error('WiPay response: order not found', { orderId })
    return NextResponse.redirect(`${appUrl}/membership?payment=error`)
  }

  // ── Verify MD5 hash: md5(transaction_id + original_total + api_key) ──
  const originalTotal = (order.amount_total / 100).toFixed(2)
  const expected = crypto
    .createHash('md5')
    .update(`${transactionId}${originalTotal}${process.env.WIPAY_API_KEY}`)
    .digest('hex')

  if (hash !== expected) {
    console.error('WiPay hash mismatch — possible fraud', { orderId, transactionId })
    return NextResponse.redirect(`${appUrl}/membership?payment=error`)
  }

  // ── Mark order complete ────────────────────────────────────
  await supabase
    .from('orders')
    .update({
      status:                 'complete',
      stripe_payment_intent:  transactionId, // repurposed: wipay_transaction_id
    })
    .eq('stripe_session_id', orderId)

  // ── Create / renew subscription ────────────────────────────
  const planType = order.items?.[0]?.plan_type ?? 'monthly'

  const now       = new Date()
  const periodEnd = new Date(now)
  if (planType === 'annual') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  } else {
    // monthly and stride_club: 1 month
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  }

  await supabase.from('subscriptions').upsert({
    user_id:               order.user_id,
    plan_type:             planType,
    status:                'active',
    stripe_subscription_id: orderId,  // repurposed: wipay_order_id reference
    current_period_start:  now.toISOString(),
    current_period_end:    periodEnd.toISOString(),
    cancel_at_period_end:  false,
  }, { onConflict: 'user_id' })

  return NextResponse.redirect(`${appUrl}/account?payment=success&plan=${planType}`)
}
