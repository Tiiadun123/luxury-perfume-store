import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  console.log('Auth Callback Started - Code:', code ? 'present' : 'missing')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Auth Success - Redirecting to:', next)
      // Use the origin from the request URL to ensure we stay on the same domain
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } else {
      console.error('Auth Exchange Error:', error.message)
    }
  }

  // Fallback to error page or home
  console.log('Auth Failed or No Code - Falling back to home')
  return NextResponse.redirect(`${requestUrl.origin}/`)
}
