'use client'

import { Locale } from '@/i18n'
import { useRef } from 'react'
import { NavBar } from './NavBar'

interface Props {
  locale: Locale
  children: React.ReactNode
}
function MainContainer({ children, locale }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <div
      id="content"
      ref={contentRef}
      className="box-border flex h-full flex-col overflow-y-auto py-[var(--navbar-height)]"
    >
      <NavBar containerRef={contentRef} locale={locale} />
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </div>
  )
}

export { MainContainer }
