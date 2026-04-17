import { NextRequest, NextResponse } from 'next/server'
import { siteIdentity } from '@/config/site.identity'

const stripPort = (value: string) => value.replace(/:\d+$/, '')
const stripProtocol = (value: string) => value.replace(/^https?:\/\//, '')
const normalizeHost = (value: string) => stripPort(stripProtocol(value)).toLowerCase()

const CANONICAL_HOST = normalizeHost(siteIdentity.domain || siteIdentity.url || '')
const WWW_HOST = CANONICAL_HOST ? `www.${CANONICAL_HOST.replace(/^www\./, '')}` : ''
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = request.headers.get('host')
  const rawHost = forwardedHost || hostHeader || request.nextUrl.host
  const host = normalizeHost(rawHost)
  const forwardedProto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')

  if (!host || LOCAL_HOSTS.has(host)) {
    return NextResponse.next()
  }

  if (host === WWW_HOST || (host === CANONICAL_HOST && forwardedProto !== 'https')) {
    const url = request.nextUrl.clone()
    url.protocol = 'https'
    url.hostname = CANONICAL_HOST
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|favicon.png|apple-icon.png).*)'],
}
