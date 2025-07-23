'use client'

import { Dictionary } from '@/i18n'
import { Task } from '@repo/domain/model/task'
import { ReadOnlyTaskItem } from './ReadOnlyTaskItem'
import { TaskListEmpty } from './TaskListEmpty'

interface Props {
  tasks: Task[]
  t: Dictionary
}

function ReadOnlyTaskList({ tasks, t }: Props) {
  if (tasks.length === 0) {
    return <TaskListEmpty t={t} />
  }

  return (
    <>
      {tasks.map((e) => (
        <ReadOnlyTaskItem key={e.id} task={e} t={t} />
      ))}
    </>
  )
}

export { ReadOnlyTaskList }
