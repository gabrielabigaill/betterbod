// components/layout/Nav.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/components/providers/CurrencyProvider'

const CURRENCIES = [
  { code: 'USD', symbol: '$',   label: '🇺🇸 USD' },
  { code: 'JMD', symbol: 'J$',  label: '🇯🇲 JMD' },
  { code: 'GBP', symbol: '£',   label: '🇬🇧 GBP' },
  { code: 'AUD', symbol: 'A$',  label: '🇦🇺 AUD' },
  { code: 'EUR', symbol: '€',   label: '🇪🇺 EUR' },
  { code: 'CAD', symbol: 'C$',  label: '🇨🇦 CAD' },
]

const NAV_LINKS = [
  { label: 'Memberships', href: '/membership' },
  { label: 'Programs',    href: '/programs'   },
  { label: 'Stride Club', href: '/stride-club' },
  { label: 'Nutrition',   href: '/nutrition'  },
  { label: 'Shop',        href: '/shop'       },
]

export function Nav() {
  const pathname = usePathname()
  const { code, setCode } = useCurrency()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <div className="bg-[#00B4A0] text-white text-center py-2.5 px-4 text-xs font-medium tracking-wide">
        New Stride Club challenge launching soon —{' '}
        <Link href="/stride-club" className="text-[#F5A623] font-bold hover:underline ml-1">Join the waitlist →</Link>
      </div>

      <nav className={`fixed top-[37px] left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-[#F0EAE8] transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] px-6 md:px-12">

          <Link href="/" className="font-display text-2xl font-bold text-[#1A1A1A] hover:opacity-80 transition-opacity">
            Better<span className="text-[#FF6357]">Body</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-8 list-none">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={`text-[13px] font-semibold tracking-wide uppercase transition-colors duration-200 ${isActive(href) ? 'text-[#FF6357]' : 'text-[#1A1A1A] hover:text-[#FF6357]'}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setCurrencyOpen(v => !v)} className="text-[13px] font-semibold text-[#6B7280] hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                {code} <span className="text-[10px]">▾</span>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 bg-white border border-[#F0EAE8] rounded-xl shadow-lg overflow-hidden w-36 z-50">
                    {CURRENCIES.map(c => (
                      <button key={c.code} onClick={() => { setCode(c.code); setCurrencyOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#FFF8F6] transition-colors ${code === c.code ? 'text-[#FF6357] font-bold bg-[#FFF0EE]' : 'text-[#1A1A1A]'}`}>
                        {c.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/auth/login" className="text-[13px] font-semibold text-[#1A1A1A] hover:text-[#FF6357] transition-colors">Log In</Link>
            <Link href="/membership" className="bg-[#FF6357] hover:bg-[#E04A3F] text-white px-6 py-2.5 rounded text-[13px] font-bold tracking-wide uppercase transition-colors">
              Join Now
            </Link>
          </div>

          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <span className={`block h-0.5 w-6 bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-[#F0EAE8] bg-white">
              <div className="px-6 py-6 flex flex-col gap-4">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link key={href} href={href} className={`text-[15px] font-semibold ${isActive(href) ? 'text-[#FF6357]' : 'text-[#1A1A1A]'}`}>{label}</Link>
                ))}
                <hr className="border-[#F0EAE8] my-2" />
                <Link href="/auth/login" className="text-[15px] font-semibold text-[#1A1A1A]">Log In</Link>
                <Link href="/membership" className="bg-[#FF6357] text-white text-center py-3 rounded font-bold text-sm uppercase tracking-wide">Join Now</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div style={{ height: 'calc(72px + 37px)' }} />
    </>
  )
}
