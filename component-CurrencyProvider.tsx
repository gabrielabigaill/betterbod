// components/providers/CurrencyProvider.tsx
'use client'

import { createContext, useContext, useState, useCallback } from 'react'

// Exchange rates vs USD (fallback — admin updates these in Supabase)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  JMD: 158,
  AUD: 1.52,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.37,
  NZD: 1.63,
  TTD: 6.79,
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', JMD: 'J$', AUD: 'A$', GBP: '£',
  EUR: '€', CAD: 'C$', NZD: 'NZ$', TTD: 'TT$',
}

interface CurrencyContextType {
  code:     string
  symbol:   string
  country:  string
  format:   (usdAmount: number, decimals?: boolean) => string
  setCode:  (code: string) => void
}

const CurrencyContext = createContext<CurrencyContextType>({
  code:    'USD',
  symbol:  '$',
  country: 'US',
  format:  (n) => `$${n.toFixed(2)}`,
  setCode: () => {},
})

export function CurrencyProvider({
  children,
  initialCode,
  initialSymbol,
  initialCountry,
}: {
  children:       React.ReactNode
  initialCode:    string
  initialSymbol:  string
  initialCountry: string
}) {
  const [code,    setCodeState]   = useState(initialCode)
  const [symbol,  setSymbolState] = useState(initialSymbol)
  const [country]                 = useState(initialCountry)

  const setCode = useCallback((newCode: string) => {
    setCodeState(newCode)
    setSymbolState(CURRENCY_SYMBOLS[newCode] ?? '$')
    // Persist manual override in cookie (30 days)
    document.cookie = `bb_currency=${newCode}; path=/; max-age=${60*60*24*30}`
    document.cookie = `bb_currency_sym=${CURRENCY_SYMBOLS[newCode] ?? '$'}; path=/; max-age=${60*60*24*30}`
  }, [])

  const format = useCallback((usdAmount: number, decimals = true) => {
    const rate       = FALLBACK_RATES[code] ?? 1
    const converted  = usdAmount * rate
    const sym        = CURRENCY_SYMBOLS[code] ?? '$'
    return decimals
      ? `${sym}${converted.toFixed(2)}`
      : `${sym}${Math.round(converted).toLocaleString()}`
  }, [code])

  return (
    <CurrencyContext.Provider value={{ code, symbol, country, format, setCode }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
