import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// These fallbacks prevent @supabase/ssr from throwing "supabaseUrl is required"
// when env vars aren't configured yet. Queries return { data: null } gracefully.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}

export function createServiceClient() {
  const cookieStore = cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  })
}
