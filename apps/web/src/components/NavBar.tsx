'use client'

import { Locale } from '@/i18n'
import { Avatar, AvatarImage } from '@repo/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  locale: Locale
  containerRef: React.RefObject<HTMLDivElement | null>
}

const languages: Record<Locale, { name: string; flag: string }> = {
  en: {
    name: 'English',
    flag: '/us.png',
  },
  es: {
    name: 'Español',
    flag: '/sp.png',
  },
}

function NavBar({ locale, containerRef }: Props) {
  const router = useRouter()
  const language = languages[locale]

  const handleLanguageChange = (locale: string) => {
    router.push(`/${locale}`)
  }

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
      <nav className="flex items-center justify-end p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src={language.flag} />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            {Object.entries(languages).map(([locale, { name, flag }]) => (
              <DropdownMenuItem key={locale} onClick={() => handleLanguageChange(locale)} className="cursor-pointer">
                <Avatar className="size-6">
                  <AvatarImage src={flag} />
                </Avatar>
                <span className="font-semibold">{name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}

export { NavBar }
