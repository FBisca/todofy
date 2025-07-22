'use client'

import { Dictionary } from '@/i18n'
import { useRoutes } from '@/providers/routes-provider'
import { Button } from '@repo/ui/components/button'
import { useMediaQuery } from '@repo/ui/hooks/use-media-query'
import { cn } from '@repo/ui/lib/utils'
import { ArchiveX, CheckCheck, ListChecks, PanelLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MenuItem } from './MenuItem'

interface Props {
  children: React.ReactNode
  t: Dictionary
}

function HomeDrawer({ children, t }: Props) {
  const { routes } = useRoutes()
  const [isExpanded, setIsExpanded] = useState(true)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth > 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-full items-stretch overflow-hidden">
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
          'bg-secondary fixed inset-0 z-20 flex w-[var(--sidebar-width)] flex-col p-2 shadow-lg transition-all duration-300 ease-in-out lg:static lg:inset-auto lg:bottom-0 lg:top-0 lg:shadow-none',
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
              title={t.menu.tasks}
              path={routes.tasks()}
              icon={<ListChecks className="size-5" />}
              onClick={() => isMobile && setIsExpanded(false)}
            />
            <MenuItem
              title={t.menu.completed}
              path={routes.completed()}
              icon={<CheckCheck className="size-5" />}
              onClick={() => isMobile && setIsExpanded(false)}
            />
            <MenuItem
              title={t.menu.archived}
              path={routes.archived()}
              icon={<ArchiveX className="size-5" />}
              onClick={() => isMobile && setIsExpanded(false)}
            />
          </ol>
        </div>
      </aside>
      <main className="flex h-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
  //pt-[var(--navbar-height)]
}

export { HomeDrawer }
