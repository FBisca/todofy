import i18n, { Locale } from '@/i18n'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'

const locales: Locale[] = [...i18n.locales]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const query = request.nextUrl.searchParams

  // Check if there is any supported locale in the pathname
  const requestLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // Redirect if there is no locale
  if (!requestLocale) {
    const locale = getLocale(request, locales)
    const queryString = query.toString()

    const response = NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${queryString ? '?' + queryString : ''}`,
        request.url,
      ),
    )

    return response
  } else {
    return NextResponse.next()
  }
}

function getLocale(request: NextRequest, locales: string[]): Locale {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)
  return matchLocale(languages, locales, i18n.defaultLocale) as Locale
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
