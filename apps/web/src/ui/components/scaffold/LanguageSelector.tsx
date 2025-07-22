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
}

function LanguageSelector({ locale }: Props) {
  const router = useRouter()
  const language = languages[locale]

  const handleLanguageChange = (locale: string) => {
    router.push(`/${locale}`)
  }
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
