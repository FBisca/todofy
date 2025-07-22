'use client'

import { AddTaskButton } from '@/components/tasks/AddTaskButton'
import { MutableTaskList } from '@/components/tasks/MutableTaskList'
import { Dictionary } from '@/i18n'
import { arraySwap } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { PageTitle } from '@repo/ui/components/page-title'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  t: Dictionary
}

function TasksPage({ t }: Props) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.ACTIVE,
    },
    {
      id: '2',
      name: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.ACTIVE,
    },
  ])

  const onTaskCompleted = useCallback(
    (task: Task) => {
      setTasks((prev) => {
        const test = prev.filter((task) => task.id !== task.id)
        console.log(test)
        return test
      })

      toast.success(t.taskList.messages.taskCompleted, {
        action: {
          label: t.taskList.actions.undo,
          onClick: () => {
            setTasks((prev) => [...prev, { ...task, completed: false }])
          },
        },
      })
    },
    [t],
  )

  const onTaskChange = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }, [])

  const onTaskDuplicate = useCallback((task: Task) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }])
  }, [])

  const onTaskDeleted = useCallback(
    (task: Task) => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id))

      toast.success(t.taskList.messages.taskDeleted, {
        action: {
          label: t.taskList.actions.undo,
          onClick: () => {
            setTasks((prev) => [...prev, { ...task, completed: false }])
          },
        },
      })
    },
    [t],
  )

  return (
    <>
      <div className="mx-auto h-full w-full max-w-[800px] space-y-4">
        <PageTitle>{t.tasks.title}</PageTitle>
        <MutableTaskList
          onMove={(from, to) => {
            setTasks((prev) => {
              const fromIndex = prev.findIndex((task) => task.id === from.id)
              const toIndex = prev.findIndex((task) => task.id === to.id)

              return arraySwap(prev, fromIndex, toIndex)
            })
          }}
          onChange={onTaskChange}
          onDuplicate={onTaskDuplicate}
          onDelete={onTaskDeleted}
          onCheckChange={(e) => {
            if (e.completed === true) {
              onTaskCompleted(e)
            } else {
              onTaskChange(e)
              setTasks((prev) => prev.map((task) => (task.id === e.id ? e : task)))
            }
          }}
          tasks={tasks}
          t={t}
        />
        <div>
          <AddTaskButton
            t={t}
            onAdd={(task) => {
              setTasks((prev) => [...prev, task])
            }}
          />
        </div>
      </div>
    </>
  )
}

export { TasksPage }
