import Link from 'next/link'

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/betterbod',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@betterbod',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@betterbod',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.52V8.48L15.84 12l-6.09 3.52z"/>
      </svg>
    ),
  },
]

const NAV_SECTIONS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Programs', href: '/programs' },
      { label: 'Challenges', href: '/challenges' },
      { label: 'Nutrition', href: '/nutrition' },
      { label: 'Stride Club', href: '/stride-club' },
      { label: 'Shop', href: '/shop' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign In', href: '/auth/login' },
      { label: 'Create Account', href: '/auth/signup' },
      { label: 'My Dashboard', href: '/account' },
      { label: 'Membership', href: '/membership' },
      { label: 'Billing', href: '/account/billing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Judith', href: '/about' },
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms & Conditions', href: '/legal/terms' },
      { label: 'Refund Policy', href: '/legal/refunds' },
      { label: 'Cookie Policy', href: '/legal/cookies' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Top row: brand + newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">

          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                BETTER<span className="text-[#e8643c]">BOD</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Real programs. Real results. Built for women who refuse to settle.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-white/50 hover:text-[#e8643c] transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm">
            <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-widest">
              Join the community
            </h3>
            <p className="text-sm mb-4">
              Workouts, nutrition tips, and Stride Club updates — straight to your inbox.
            </p>
            <form
              action="/api/subscribe"
              method="POST"
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const email = (form.elements.namedItem('email') as HTMLInputElement).value
                fetch('/api/subscribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, source: 'footer' }),
                })
              }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#e8643c] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#e8643c] hover:bg-[#d4552e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-16">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
                {section.heading}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© {year} BetterBod. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/legal/cookies" className="hover:text-white/60 transition-colors">Cookies</Link>
          </div>
          <p>Payments secured by WiPay</p>
        </div>
      </div>
    </footer>
  )
  }
