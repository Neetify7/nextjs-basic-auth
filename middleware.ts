import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { useEffect } from 'react'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || '')
const AUTH_COOKIE = 'auth_token'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (token) {
    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete(AUTH_COOKIE)
      return response
    }
  }
  return NextResponse.redirect(new URL('/api/login', request.url))
}

export default function App({ Component, pageProps }: any) {
  useEffect(() => {
    const password = prompt('Enter password:')
    if (password) {
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            alert('Invalid password')
            window.location.reload()
          }
        })
    } else {
      alert('Password required')
      window.location.reload()
    }
  }, [])

  return <Component {...pageProps} />
}