// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const CheckoutSchema = z.object({
  planType: z.enum(['monthly', 'annual', 'stride_club']),
  currency: z.enum(['TTD', 'USD']).default('TTD'),
})

// Pricing in each currency
const PLAN_PRICES: Record<string, Record<string, number>> = {
  TTD: { monthly: 199.99, annual: 1999.99, stride_club: 99.99 },
  USD: { monthly: 29.99,  annual: 299.99,  stride_club: 14.99 },
}

const WIPAY_URL = 'https://tt.wipayfinancial.com/plugins/payments/request'

// Simple in-memory rate limiter (replace with Upstash Redis in production)
const ipAttempts = new Map<string, { count: number; reset: number }>()

export async function POST(req: Request) {
  // ── Rate limiting ──────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const now = Date.now()
  const entry = ipAttempts.get(ip)
  if (entry) {
    if (now < entry.reset) {
      if (entry.count >= 10) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      entry.count++
    } else {
      ipAttempts.set(ip, { count: 1, reset: now + 60_000 })
    }
  } else {
    ipAttempts.set(ip, { count: 1, reset: now + 60_000 })
  }

  // ── Parse + validate input ─────────────────────────────────
  let body: z.infer<typeof CheckoutSchema>
  try {
    body = CheckoutSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // ── Get current user ───────────────────────────────────────
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  // ── Build order details ────────────────────────────────────
  const prices = PLAN_PRICES[body.currency]
  const total  = prices[body.planType].toFixed(2)
  // WiPay order_id: max 48 chars (TT/FAC), alphanumeric + dashes
  const orderId = `bb-${user.id.slice(0, 8)}-${Date.now().toString(36)}`
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL!

  // ── Store pending order in Supabase ────────────────────────
  await supabase.from('orders').insert({
    user_id:          user.id,
    stripe_session_id: orderId,                          // repurposed: wipay_order_id
    amount_total:     Math.round(parseFloat(total) * 100), // stored in cents
    currency:         body.currency.toLowerCase(),
    status:           'pending',
    items:            [{ plan_type: body.planType, currency: body.currency }],
  })

  // ── Call WiPay API ─────────────────────────────────────────
  const params = new URLSearchParams({
    account_number: process.env.WIPAY_ACCOUNT_NUMBER ?? '1234567890',
    avs:            '0',
    country_code:   'TT',
    currency:       body.currency,
    environment:    process.env.WIPAY_ENVIRONMENT ?? 'sandbox',
    fee_structure:  'customer_pay',
    method:         'credit_card',
    order_id:       orderId,
    origin:         'BetterBod',
    response_url:   `${appUrl}/api/wipay/response`,
    total,
    email:          user.email ?? '',
    data:           JSON.stringify({ user_id: user.id, plan_type: body.planType }),
  })

  const wipayRes = await fetch(WIPAY_URL, {
    method:  'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    params.toString(),
  })

  const result = await wipayRes.json() as { url?: string; message?: string }

  if (!wipayRes.ok || !result.url) {
    return NextResponse.json({ error: result.message ?? 'Payment gateway error' }, { status: 502 })
  }

  return NextResponse.json({ url: result.url })
}
