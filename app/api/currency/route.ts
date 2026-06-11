import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { USD_TO_TTD: 6.79, updated: new Date().toISOString() },
    { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=300' } }
  )
}
