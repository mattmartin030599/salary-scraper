import { NextResponse } from 'next/server'
import { getRecent } from '@/lib/recentLookups'

export async function GET() {
  const data = await getRecent()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
