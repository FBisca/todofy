'use client'

import { Dictionary, Locale } from '@/i18n'
import { AppRoutes } from '@/routes'
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { ArchiveX, CheckCheck, ListChecks, PanelLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MenuItem } from './MenuItem'

interface Props {
  children: React.ReactNode
  locale: Locale
  t: Dictionary
}

function HomeDrawer({ children, locale, t }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth > 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex">
      <div
        className={cn(
          'pointer-events-none fixed inset-0 bg-black/5 opacity-0 transition-all duration-300 ease-in-out lg:hidden',
          {
            'pointer-events-auto opacity-100': isExpanded,
          },
        )}
        onClick={() => setIsExpanded(false)}
      />
      <aside
        className={cn(
          'bg-secondary fixed inset-0 z-20 flex w-[var(--sidebar-width)] flex-col p-2 shadow-lg transition-all duration-300 ease-in-out lg:fixed lg:inset-auto lg:bottom-0 lg:top-0 lg:shadow-none',
          {
            '-ml-[var(--sidebar-width)]': !isExpanded,
          },
        )}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size={'icon'}
          variant={'ghost'}
          className={cn(
            'text-secondary-foreground hover:bg-primary/5 sticky right-2 z-50 cursor-pointer self-end rounded p-2 transition-all duration-300 ease-in-out',
            {
              'text-foreground -mr-14': !isExpanded,
            },
          )}
        >
          <PanelLeft className="size-6" />
        </Button>

        <div className="mt-12 flex flex-col gap-2">
          <ol className="space-y-2">
            <MenuItem
              locale={locale}
              title={t.menu.tasks}
              path={AppRoutes.tasks()}
              icon={<ListChecks className="size-5" />}
            />
            <MenuItem
              locale={locale}
              title={t.menu.completed}
              path={AppRoutes.completed()}
              icon={<CheckCheck className="size-5" />}
            />
            <MenuItem
              locale={locale}
              title={t.menu.archived}
              path={AppRoutes.archived()}
              icon={<ArchiveX className="size-5" />}
            />
          </ol>
        </div>
      </aside>
      <main className="flex-1 pt-[var(--navbar-height)]">
        {children}
        <br />
      </main>
    </div>
  )
}

export { HomeDrawer }
