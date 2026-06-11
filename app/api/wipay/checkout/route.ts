import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const WIPAY_ACCOUNT_NUMBER = process.env.WIPAY_ACCOUNT_NUMBER!
const WIPAY_API_KEY = process.env.WIPAY_API_KEY!
const WIPAY_URL = 'https://tt.wipayfinancial.com/plugins/payments/request'

const PLAN_PRICES: Record<string, number> = {
  monthly:     199.99,
  annual:      1999.99,
  stride_club: 99.99,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan_type } = await req.json()

  if (!plan_type || !PLAN_PRICES[plan_type]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const total = PLAN_PRICES[plan_type]
  const transaction_id = `bb_${user.id.slice(0, 8)}_${Date.now()}`

  // Create pending order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      plan_type,
      total,
      status: 'pending',
      wipay_transaction_id: transaction_id,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://betterbod.vercel.app'

  const params = new URLSearchParams({
    account_number: WIPAY_ACCOUNT_NUMBER,
    avs:            '0',
    card_holder_email: user.email!,
    country_code:   'TT',
    currency:       'TTD',
    environment:    process.env.WIPAY_ENV ?? 'sandbox',
    fee_structure:  'customer_pay',
    method:         'credit_card',
    order_id:       transaction_id,
    origin:         origin,
    response_url:   `${origin}/api/wipay/callback`,
    total:          total.toFixed(2),
  })

  return NextResponse.json({
    payment_url: `${WIPAY_URL}?${params.toString()}`,
    transaction_id,
  })
}
