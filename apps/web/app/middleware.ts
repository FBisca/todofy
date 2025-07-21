import i18n, {Locale} from '@/i18n'
import { NextRequest, NextResponse } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const languageHeader = 'X-Language-Preference'
const locales: Locale[] = [...i18n.config.locales];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const query = request.nextUrl.searchParams
  
  // Check if there is any supported locale in the pathname
  const requestLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // Redirect if there is no locale
  if (!requestLocale) {
    const locale = getLocale(request, locales)
    const queryString = query.toString()
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    const response = NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${queryString ? '?' + queryString : ''}`,
        request.url
      )
    )
    response.headers.set(languageHeader, locale)
    return response
  } else {
    const response = NextResponse.next()
    response.headers.set(languageHeader, requestLocale)
    return response
  }
}

function getLocale(request: NextRequest, locales: string[]): Locale {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)
  return matchLocale(languages, locales, i18n.config.defaultLocale) as Locale
}


export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next|_next|images|svg|videos|favicon.ico|app).*)'],
}
