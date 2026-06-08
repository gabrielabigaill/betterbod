import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── Currency map: country code → { code, symbol, rate vs USD } ──────────────
const CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
  // Caribbean
  JM: { code: 'JMD', symbol: 'J$' },
  TT: { code: 'USD', symbol: '$'  },
  BB: { code: 'USD', symbol: '$'  },
  GY: { code: 'USD', symbol: '$'  },
  LC: { code: 'USD', symbol: '$'  },
  VC: { code: 'USD', symbol: '$'  },
  AG: { code: 'USD', symbol: '$'  },
  // Anglosphere
  AU: { code: 'AUD', symbol: 'A$' },
  NZ: { code: 'NZD', symbol: 'NZ$'},
  GB: { code: 'GBP', symbol: '£'  },
  CA: { code: 'CAD', symbol: 'C$' },
  // Europe
  DE: { code: 'EUR', symbol: '€'  },
  FR: { code: 'EUR', symbol: '€'  },
  IT: { code: 'EUR', symbol: '€'  },
  ES: { code: 'EUR', symbol: '€'  },
  NL: { code: 'EUR', symbol: '€'  },
  PT: { code: 'EUR', symbol: '€'  },
  IE: { code: 'EUR', symbol: '€'  },
  // Default
  US: { code: 'USD', symbol: '$'  },
}

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/account', '/account/']
const ADMIN_ROUTES     = ['/admin', '/admin/']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  // ── 1. Currency detection via Vercel geo headers ──────────────────────────
  const countryCode = request.headers.get('x-vercel-ip-country') ?? 'US'
  const currency    = CURRENCY_MAP[countryCode] ?? { code: 'USD', symbol: '$' }

  // Only set cookie if not already overridden by user
  const existingCurrency = request.cookies.get('bb_currency')
  if (!existingCurrency) {
    response.cookies.set('bb_currency',      currency.code,   { path: '/', maxAge: 60 * 60 * 24 * 30 })
    response.cookies.set('bb_currency_sym',  currency.symbol, { path: '/', maxAge: 60 * 60 * 24 * 30 })
    response.cookies.set('bb_country',       countryCode,     { path: '/', maxAge: 60 * 60 * 24 * 30 })
  }

  // ── 2. Auth protection for /account and /admin routes ─────────────────────
  const isProtected = PROTECTED_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))
  const isAdmin     = ADMIN_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))

  if (isProtected || isAdmin) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll:  () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // For admin routes, verify admin role
    if (isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/account', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
