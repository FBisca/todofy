import i18n, { Locale, getDictionary } from '@/i18n'
import LocaleProvider from '@/ui/providers/locale-provider'
import { Toaster } from '@repo/ui/components/sonner'

import { Drawer } from '@/ui/components/scaffold/Drawer'
import { MainContainer } from '@/ui/components/scaffold/MainContainer'
import RoutesProvider from '@/ui/providers/routes-provider'
import TanstackProvider from '@/ui/providers/tanstack-provider'
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
        <TanstackProvider>
          <LocaleProvider dictionary={dictionary} locale={locale}>
            <RoutesProvider locale={locale}>
              <Drawer t={dictionary}>
                <MainContainer locale={locale}>{children}</MainContainer>
              </Drawer>
            </RoutesProvider>
          </LocaleProvider>
        </TanstackProvider>
        <Toaster />
      </body>
    </html>
  )
}

export { generateMetadata, generateStaticParams, viewport }

export default RootLayout
