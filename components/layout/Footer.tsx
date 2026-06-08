// components/layout/Footer.tsx
import Link from 'next/link'

const LINKS = {
  Platform: [
    { label: 'Programs',    href: '/programs'    },
    { label: 'Challenges',  href: '/programs#challenges' },
    { label: 'Nutrition',   href: '/nutrition'   },
    { label: 'Stride Club', href: '/stride-club' },
    { label: 'Shop',        href: '/shop'        },
  ],
  Membership: [
    { label: 'Plans & Pricing', href: '/membership'       },
    { label: 'My Account',      href: '/account'          },
    { label: 'My Programs',     href: '/account/programs' },
    { label: 'Billing',         href: '/account/billing'  },
  ],
  Company: [
    { label: 'About Judith', href: '/about'     },
    { label: 'Blog',         href: '/blog'      },
    { label: 'Contact',      href: '/contact'   },
    { label: 'Affiliate',    href: '/affiliate' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy'  },
    { label: 'Terms of Service', href: '/terms'    },
    { label: 'Refund Policy',    href: '/refunds'  },
    { label: 'Cookie Policy',    href: '/cookies'  },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold mb-3">Better<span className="text-[#FF6357]">Body</span></div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">Move. Nourish. Thrive.<br />Your transformation starts here.</p>
            <div className="flex gap-4">
              {['Instagram', 'TikTok', 'YouTube'].map(s => (
                <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#FF6357] transition-colors text-xs">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <p>© {new Date().getFullYear()} BetterBody. All rights reserved.</p>
          <p className="text-xs">Prices shown in your local currency. All memberships auto-renew. Cancel anytime.</p>
        </div>
      </div>
    </footer>
  )
}
