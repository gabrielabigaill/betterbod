import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

const WIPAY_API_KEY = process.env.WIPAY_API_KEY!

export async function POST(req: NextRequest) {
  const body = await req.formData()

  const status         = body.get('status')?.toString() ?? ''
  const transaction_id = body.get('order_id')?.toString() ?? ''
  const total          = body.get('total')?.toString() ?? ''
  const hash           = body.get('hash')?.toString() ?? ''

  // Verify WiPay hash: MD5(transaction_id + original_total + API_KEY)
  const expected = crypto
    .createHash('md5')
    .update(`${transaction_id}${total}${WIPAY_API_KEY}`)
    .digest('hex')

  if (hash !== expected) {
    console.error('WiPay hash mismatch', { hash, expected })
    return NextResponse.redirect(new URL('/account?payment=failed', req.url))
  }

  if (status !== 'success') {
    return NextResponse.redirect(new URL('/account?payment=cancelled', req.url))
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: 'active', paid_at: new Date().toISOString() })
    .eq('wipay_transaction_id', transaction_id)

  if (error) {
    console.error('Failed to activate order', error)
    return NextResponse.redirect(new URL('/account?payment=error', req.url))
  }

  return NextResponse.redirect(new URL('/account?payment=success', req.url))
}

export async function GET(req: NextRequest) {
  return POST(req)
}
