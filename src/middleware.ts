// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Ignoramos los Server Actions para evitar bloqueos
  if (req.headers.has('next-action')) {
    return NextResponse.next()
  }

  const tieneSesion = req.cookies.getAll().some(cookie => cookie.name.includes('-auth-token'))
  const rutaActual = req.nextUrl.pathname
  const esRutaProtegida = rutaActual.startsWith('/pos') || rutaActual.startsWith('/productos')

  // 1. Si intenta entrar a Caja/Catálogo sin estar logueado -> Al Login
  if (esRutaProtegida && !tieneSesion) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 2. Si YA está logueado e intenta ir al Login -> Directo a la Caja
  if (rutaActual === '/login' && tieneSesion) {
    return NextResponse.redirect(new URL('/pos', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/pos/:path*',
    '/productos/:path*'
  ]
}