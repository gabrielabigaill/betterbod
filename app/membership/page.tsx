'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    priceUSD: 29.99,
    priceTTD: 199.99,
    period: 'month',
    features: [
      'Access to all fitness programs',
      'Full nutrition guide library',
      'Member dashboard & progress tracking',
      'Community access',
      '7-day refund guarantee',
    ],
    featured: false,
    cta: 'Start Monthly',
  },
  {
    id: 'annual',
    name: 'Annual',
    priceUSD: 299.99,
    priceTTD: 1999.99,
    period: 'year',
    badge: 'Best Value — Save 17%',
    features: [
      'Everything in Monthly',
      '2 months free (pay for 10, get 12)',
      'Priority support',
      'Early access to new programs',
      'Exclusive annual member bonuses',
    ],
    featured: true,
    cta: 'Start Annual',
  },
  {
    id: 'stride_club',
    name: 'Stride Club',
    priceUSD: 14.99,
    priceTTD: 99.99,
    period: 'month',
    features: [
      'Weekly step challenges',
      'Live community leaderboard',
      'Monthly workbook PDF download',
      'Stride community access',
    ],
    featured: false,
    cta: 'Join Stride Club',
  },
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account dashboard at any time. No questions asked, no penalty.',
  },
  {
    q: 'What currency will I be charged in?',
    a: "Payments are processed in your selected currency (USD or TTD) via WiPay — the Caribbean's leading payment processor.",
  },
  {
    q: 'Is there a refund policy?',
    a: "Absolutely. If you're not happy within 7 days of purchase, we'll refund you in full.",
  },
  {
    q: 'Can I access programs on my phone?',
    a: 'Yes — BetterBod is fully mobile-optimised. Access everything from any device, any time.',
  },
  {
    q: "What's the difference between a membership and Stride Club?",
    a: 'The membership gives you full access to all workout programs and nutrition content. Stride Club is a separate step-challenge subscription focused on daily walking accountability and community leaderboards.',
  },
]

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-[#e8643c] text-sm font-semibold uppercase tracking-widest">Membership</span>
        <h1 className="text-5xl sm:text-6xl font-black text-white mt-3 mb-6">
          Simple, honest pricing
        </h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto">
          One membership, all programs. No hidden fees, no confusing tiers. Just everything you need to transform.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col ${
                plan.featured
                  ? 'bg-[#e8643c] border-transparent lg:scale-105'
                  : 'bg-white/[0.03] border-white/10'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#e8643c] text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h2 className="text-white font-bold text-2xl mb-1">{plan.name}</h2>
                <div className="flex items-end gap-1 mt-3">
                  <span className="text-5xl font-black text-white">${plan.priceUSD}</span>
                  <span className={`text-sm mb-2 ${plan.featured ? 'text-white/80' : 'text-white/40'}`}>/{plan.period}</span>
                </div>
                <p className={`text-sm mt-1 ${plan.featured ? 'text-white/70' : 'text-white/30'}`}>
                  ≈ TTD ${plan.priceTTD}/{plan.period}
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-0.5 shrink-0 font-bold ${plan.featured ? 'text-white' : 'text-[#e8643c]'}`}>✓</span>
                    <span className={`text-sm ${plan.featured ? 'text-white/90' : 'text-white/60'}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/auth/signup?plan=${plan.id}`}
                className={`block w-full text-center font-bold py-4 rounded-xl transition-all duration-200 text-lg ${
                  plan.featured
                    ? 'bg-white text-[#e8643c] hover:bg-white/90'
                    : 'bg-[#e8643c] text-white hover:bg-[#d4552e]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-white/30 text-sm mt-8">
          7-day full refund guarantee · Cancel anytime · Powered by WiPay
        </p>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-white/10">
        <h2 className="text-3xl font-black text-white text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <div key={i} className="border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-semibold">{item.q}</span>
                <span className={`text-[#e8643c] text-xl font-bold transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/60 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
