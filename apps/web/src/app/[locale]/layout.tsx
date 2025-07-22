import i18n, { Locale, getDictionary } from '@/i18n'
import LocaleProvider from '@/providers/locale-provider'
import { Toaster } from '@repo/ui/components/sonner'

import { HomeDrawer } from '@/components/HomeDrawer'
import { NavBar } from '@/components/NavBar'
import type { Metadata, Viewport } from 'next'
import { Lato } from 'next/font/google'
import React from 'react'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
}

const lato = Lato({
  variable: '--font-lato',
  weight: ['400', '700', '900'],
  subsets: ['latin'],
})

async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale: locale }))
}

async function generateMetadata(props: Readonly<Props>): Promise<Metadata> {
  const { locale } = await props.params

  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  }
}

async function RootLayout({ children, params }: Readonly<Props>) {
  const { locale } = await params

  const dictionary = await getDictionary(locale)
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lato.variable} antialiased`}>
        <LocaleProvider dictionary={dictionary} locale={locale}>
          <HomeDrawer t={dictionary} locale={locale}>
            <div className="flex flex-1 flex-col">
              <NavBar locale={locale} />
              <div className="flex flex-1 flex-col overflow-auto p-4 after:block after:h-8 after:content-['']">
                {children}
              </div>
            </div>
          </HomeDrawer>
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  )
}

export { generateMetadata, generateStaticParams, viewport }

export default RootLayout
