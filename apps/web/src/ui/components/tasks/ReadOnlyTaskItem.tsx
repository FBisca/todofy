'use client'

import { Dictionary } from '@/i18n'
import { useLocale } from '@/ui/providers/locale-provider'
import { Task } from '@repo/domain/model/task'
import { Checkbox } from '@repo/ui/components/checkbox'
import { cn } from '@repo/ui/lib/utils'
import { useMemo } from 'react'

interface Props {
  task: Task
  t: Dictionary
}

function ReadOnlyTaskItem({ task, t }: Props) {
  const locale = useLocale()
  const relativeTimeFormat = useMemo(
    () => new Intl.RelativeTimeFormat(locale.locale, { numeric: 'auto' }),
    [locale.locale],
  )
  const completedAt = useMemo(() => {
    if (!task.completedAt) return null
    const formatted = relativeTimeFormat.format(
      Math.ceil((new Date(task.completedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day',
    )
    return formatted.substring(0, 1).toUpperCase() + formatted.substring(1)
  }, [task.completedAt, relativeTimeFormat])
  return (
    <div className={cn('group flex w-full items-center gap-2 px-1 transition-opacity duration-300')}>
      <Checkbox className={'mt-2 size-4 self-start'} checked={task.completed} disabled data-testid="task-checkbox" />
      <div className="flex flex-1 flex-col">
        <p className="text-lg font-semibold lg:text-sm">{task.name}</p>
        <p className="text-muted-foreground text-base lg:text-xs">{task.description}</p>
        {completedAt && (
          <p className="text-muted-foreground/60 mt-1 text-base lg:text-xs">
            {t.task.completedAt}&nbsp;<span className="font-semibold">{completedAt}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export { ReadOnlyTaskItem }
