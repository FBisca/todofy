'use client'

import { Dictionary } from '@/i18n'
import { useRoutes } from '@/providers/routes-provider'
import { cn } from '@repo/ui/lib/utils'
import { ArchiveX, CheckCheck, ListChecks } from 'lucide-react'
import { MenuItem } from './MenuItem'

interface Props {
  className?: string
  t: Dictionary
  onNavigate: () => void
}

function Menu({ className, t, onNavigate }: Props) {
  const { routes } = useRoutes()
  return (
    <ol className={cn('space-y-2', className)}>
      <MenuItem
        title={t.menu.tasks}
        path={routes.tasks()}
        icon={<ListChecks className="size-5" />}
        onClick={() => onNavigate()}
      />
      <MenuItem
        title={t.menu.completed}
        path={routes.completed()}
        icon={<CheckCheck className="size-5" />}
        onClick={() => onNavigate()}
      />
      <MenuItem
        title={t.menu.archived}
        path={routes.archived()}
        icon={<ArchiveX className="size-5" />}
        onClick={() => onNavigate()}
      />
    </ol>
  )
}

export { Menu }
