// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// Use service role key — this is server-side only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body      = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── New checkout completed ──────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId  = session.metadata?.user_id

        // Record the order
        await supabase.from('orders').upsert({
          stripe_session_id:     session.id,
          stripe_payment_intent: session.payment_intent as string,
          user_id:               userId ?? null,
          amount_total:          session.amount_total ?? 0,
          currency:              session.currency?.toUpperCase() ?? 'USD',
          status:                'complete',
          items:                 session.metadata?.items ? JSON.parse(session.metadata.items) : [],
        }, { onConflict: 'stripe_session_id' })

        // If this was a subscription checkout, ensure customer ID is saved
        if (session.customer && userId) {
          await supabase.from('profiles').update({
            stripe_customer_id: session.customer as string,
          }).eq('id', userId)
        }
        break
      }

      // ── Subscription activated / updated ──────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription

        // Resolve user from Stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single()

        if (!profile) break

        // Map Stripe price ID to our plan type
        const priceId   = sub.items.data[0]?.price.id
        const planType  = getPlanType(priceId)

        await supabase.from('subscriptions').upsert({
          user_id:                profile.id,
          stripe_customer_id:     sub.customer as string,
          stripe_subscription_id: sub.id,
          stripe_price_id:        priceId,
          plan_type:              planType,
          status:                 mapSubStatus(sub.status),
          current_period_start:   new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end:     new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end:   sub.cancel_at_period_end,
        }, { onConflict: 'stripe_subscription_id' })
        break
      }

      // ── Subscription cancelled ─────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      // ── Payment failed ──────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }

      // ── Invoice paid (renewal) ──────────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'active' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}

// ── Helpers ────────────────────────────────────────────────────
function getPlanType(priceId: string | undefined): 'monthly' | 'annual' | 'stride_club' {
  if (priceId === process.env.STRIPE_PRICE_ANNUAL)  return 'annual'
  if (priceId === process.env.STRIPE_PRICE_STRIDE)  return 'stride_club'
  return 'monthly'
}

function mapSubStatus(status: Stripe.Subscription.Status) {
  const map: Record<string, string> = {
    active:            'active',
    canceled:          'cancelled',
    past_due:          'past_due',
    trialing:          'trialing',
    incomplete:        'incomplete',
    incomplete_expired:'cancelled',
    unpaid:            'past_due',
    paused:            'past_due',
  }
  return map[status] ?? 'incomplete'
}
