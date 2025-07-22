'use client'

import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  title: string
  path: string
  icon: React.ReactNode
  onClick?: () => void
}

function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '')
}

function MenuItem({ title, path, icon, onClick }: Props) {
  const pathname = usePathname()
  const sanitizedPath = removeTrailingSlash(pathname ?? '')
  const sanitizedPathname = removeTrailingSlash(path)

  const isActive = sanitizedPath === sanitizedPathname
  return (
    <li
      className={cn('hover:bg-primary/5 hover:text-primary rounded transition-colors duration-300 ease-in-out', {
        'bg-primary/10 text-primary hover:bg-primary/20': isActive,
      })}
    >
      <Link href={path} passHref className="flex items-center gap-2 p-3" onClick={onClick}>
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </Link>
    </li>
  )
}

export { MenuItem }
