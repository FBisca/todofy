'use client'

import { Locale } from '@/i18n'
import { Avatar, AvatarImage } from '@repo/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  locale: Locale
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
  it: {
    name: 'Italiano',
    flag: '/it.png',
  },
}

function LanguageSelector({ locale }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const language = languages[locale]

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname.replace(`/${locale}`, `/${newLocale}`))
  }

  if (!language) return <></>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage src={language.flag} className="size-8" />
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
  )
}

export { LanguageSelector }
