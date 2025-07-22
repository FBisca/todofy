'use client'

import { Dictionary } from '@/i18n'
import { Task } from '@repo/domain/model/task'
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
      {/* {tasks.map((e) => (
        <TaskItem key={e.id} t={t} task={e} />
      ))} */}
    </>
  )
}

export { ReadOnlyTaskList }
