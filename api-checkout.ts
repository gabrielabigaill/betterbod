// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const CheckoutSchema = z.object({
  priceId:  z.string().startsWith('price_'),
  planType: z.enum(['monthly', 'annual', 'stride_club']),
  coupon:   z.string().optional(),
})

// Simple in-memory rate limiter (use Upstash Redis in production)
const ipAttempts = new Map<string, { count: number; reset: number }>()

export async function POST(req: Request) {
  // ── Rate limiting ──────────────────────────────────────────
  const ip    = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const now   = Date.now()
  const entry = ipAttempts.get(ip)

  if (entry) {
    if (now < entry.reset) {
      if (entry.count >= 10) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
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
  const supabase    = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Get or create Stripe customer ─────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, full_name, email')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email:    profile?.email ?? user.email!,
      name:     profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  // ── Create Stripe checkout session ────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode:     'subscription',
    line_items: [{
      price:    body.priceId,
      quantity: 1,
    }],
    discounts: body.coupon ? [{ coupon: body.coupon }] : [],
    success_url: `${appUrl}/account?session_id={CHECKOUT_SESSION_ID}&plan=${body.planType}`,
    cancel_url:  `${appUrl}/membership?cancelled=true`,
    metadata: {
      user_id:   user.id,
      plan_type: body.planType,
    },
    subscription_data: {
      metadata: { user_id: user.id, plan_type: body.planType },
    },
    allow_promotion_codes: !body.coupon,
    customer_update: { address: 'auto' },
  })

  return NextResponse.json({ url: session.url })
}
