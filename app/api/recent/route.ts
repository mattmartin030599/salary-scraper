import { NextResponse } from 'next/server'
import { getRecent } from '@/lib/recentLookups'

export async function GET() {
  const data = getRecent()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
