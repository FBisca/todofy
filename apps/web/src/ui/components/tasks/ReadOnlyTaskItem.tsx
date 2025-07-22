'use client'

import { Task } from '@repo/domain/model/task'
import { Checkbox } from '@repo/ui/components/checkbox'
import { cn } from '@repo/ui/lib/utils'

interface Props {
  task: Task
}

function ReadOnlyTaskItem({ task }: Props) {
  return (
    <div className={cn('group flex w-full items-center gap-2 px-1 transition-opacity duration-300')}>
      <Checkbox className={'mt-2 size-4 self-start'} checked={task.completed} disabled data-testid="task-checkbox" />
      <div className="flex flex-1 flex-col">
        <p className="text-lg font-semibold lg:text-sm">{task.name}</p>
        <p className="text-muted-foreground text-base lg:text-xs">{task.description}</p>
      </div>
    </div>
  )
}

export { ReadOnlyTaskItem }
