'use client'

import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { Home, PanelLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
}

function HomeDrawer({ children }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsExpanded(window.innerWidth > 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative flex min-h-screen">
      <div
        className={cn('bg-secondary fixed inset-0 block opacity-0 transition-all duration-300 ease-in-out lg:hidden', {
          'opacity-100': isExpanded,
        })}
        onClick={() => setIsExpanded(false)}
      />
      <aside
        className={cn(
          'bg-secondary fixed inset-0 flex w-[var(--sidebar-width)] flex-col p-2 shadow-lg transition-all duration-300 ease-in-out lg:relative lg:inset-auto lg:shadow-none',
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
            'text-secondary-foreground hover:bg-primary/5 absolute right-2 z-50 cursor-pointer self-end rounded p-2 transition-all duration-300 ease-in-out',
            {
              'text-foreground -mr-14': !isExpanded,
            },
          )}
        >
          <PanelLeft className="size-6" />
        </Button>
        <div className="mt-12 flex flex-col gap-2">
          <ol>
            <li>
              <Button size={'icon'} variant={'ghost'} className="size-10">
                <Home size={20} />
              </Button>
              <span className="text-sm">Home</span>
            </li>
          </ol>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}

export { HomeDrawer }
