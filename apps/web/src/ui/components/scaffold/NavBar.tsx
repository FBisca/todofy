'use client'

import { Locale } from '@/i18n'
import { useEffect, useState } from 'react'
import { LanguageSelector } from './LanguageSelector'

interface Props {
  locale: Locale
  containerRef: React.RefObject<HTMLDivElement | null>
}

function NavBar({ locale, containerRef }: Props) {
  const [isScrolled, setIsScrolled] = useState(0)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollProgress = Math.min(container.scrollTop, 100) / 100
      setIsScrolled(scrollProgress)
    }

    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  return (
    <header
      className="bg-background/60 fixed left-0 right-0 top-0 z-10 h-[var(--navbar-height)] backdrop-blur-sm"
      style={{
        boxShadow: `0 4px 6px -1px rgb(0 0 0 / ${isScrolled * 0.1}), 0 2px 4px -2px rgb(0 0 0 / ${isScrolled * 0.1})`,
      }}
    >
      <nav className="flex items-center justify-end p-3 lg:px-4">
        <LanguageSelector locale={locale} />
      </nav>
    </header>
  )
}

export { NavBar }
