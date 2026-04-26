import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'

    console.log('Auth Callback Started - Code:', code ? 'present' : 'missing')

    if (code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        console.log('Auth Success - Redirecting to:', next)
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      } else {
        console.error('Auth Exchange Error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    console.log('No code found - Redirecting to home')
    return NextResponse.redirect(`${requestUrl.origin}/`)
  } catch (err) {
    console.error('Callback Crash:', err)
    return NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 })
  }
}
