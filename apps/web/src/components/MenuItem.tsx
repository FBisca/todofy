'use client'

import { Locale } from '@/i18n'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  title: string
  path: string
  icon: React.ReactNode
  locale: Locale
}

function MenuItem({ title, path, icon, locale }: Props) {
  const pathname = usePathname()
  const pathWithLocale = `/${locale}${path === '/' ? '' : path}`
  const isActive = pathname === path || pathname === pathWithLocale

  return (
    <li
      className={cn('hover:bg-primary/5 hover:text-primary rounded transition-colors duration-300 ease-in-out', {
        'bg-primary/10 text-primary hover:bg-primary/20': isActive,
      })}
    >
      <Link href={path} passHref className="flex items-center gap-2 p-3">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </Link>
    </li>
  )
}

export { MenuItem }
