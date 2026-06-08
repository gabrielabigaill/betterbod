// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { CurrencyProvider }     from '@/components/providers/CurrencyProvider'
import { Nav }                  from '@/components/layout/Nav'
import { Footer }               from '@/components/layout/Footer'
import { CookieBanner }         from '@/components/ui/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'BetterBody — Move. Nourish. Thrive.', template: '%s | BetterBody' },
  description: 'The complete fitness and wellness platform. Structured programs, science-backed nutrition, and the Stride Club walk community — built by Judith.',
  keywords: ['fitness', 'workout programs', 'nutrition', 'walk club', 'weight loss', 'online trainer'],
  authors: [{ name: 'Judith', url: 'https://betterbody.com/about' }],
  openGraph: {
    type: 'website',
    siteName: 'BetterBody',
    title: 'BetterBody — Move. Nourish. Thrive.',
    description: 'Structured programs, science-backed nutrition, and the Stride Club.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetterBody — Move. Nourish. Thrive.',
    description: 'Structured programs, science-backed nutrition, and the Stride Club.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const currencyCode   = cookieStore.get('bb_currency')?.value     ?? 'USD'
  const currencySymbol = cookieStore.get('bb_currency_sym')?.value  ?? '$'
  const countryCode    = cookieStore.get('bb_country')?.value       ?? 'US'

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-white text-charcoal">
        <CurrencyProvider initialCode={currencyCode} initialSymbol={currencySymbol} initialCountry={countryCode}>
          <SmoothScrollProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            <CookieBanner />
          </SmoothScrollProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
