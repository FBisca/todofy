'use client'

import { Dictionary, Locale } from '@/i18n'
import { createContext, useContext } from 'react'

interface LocaleContextValue {
  locale: Locale
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

export default function LocaleProvider({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode
  dictionary: Dictionary
  locale: Locale
}) {
  return (
    <LocaleContext.Provider
      value={{
        t: dictionary,
        locale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
