'use client'

import { Locale } from '@/i18n'
import { routes } from '@/routes'
import { createContext, useContext } from 'react'

interface RoutesContextValue {
  routes: ReturnType<typeof routes>
}

const RoutesContext = createContext<RoutesContextValue | undefined>(undefined)

export default function RoutesProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <RoutesContext.Provider
      value={{
        routes: routes(locale),
      }}
    >
      {children}
    </RoutesContext.Provider>
  )
}

export function useRoutes() {
  const context = useContext(RoutesContext)
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RoutesContext')
  }
  return context
}
