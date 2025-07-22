'use client'

import { AddTaskButton } from '@/components/AddTaskButton'
import { HomeDrawer } from '@/components/HomeDrawer'
import { NavBar } from '@/components/NavBar'
import { TaskList } from '@/components/TaskList'
import { Dictionary, Locale } from '@/i18n'
import { arraySwap } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { PageTitle } from '@repo/ui/components/page-title'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  locale: Locale
  t: Dictionary
}

function TasksPage({ locale, t }: Props) {
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

  const onTaskCompleted = useCallback((task: Task) => {
    setTasks((prev) => {
      const test = prev.filter((task) => task.id !== task.id)
      console.log(test)
      return test
    })

    toast.success('Task completed', {
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks((prev) => [...prev, { ...task, completed: false }])
        },
      },
    })
  }, [])

  const onTaskChange = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }, [])

  const onTaskDuplicate = useCallback((task: Task) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }])
  }, [])

  const onTaskDeleted = useCallback((task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id))

    toast.success('Task deleted', {
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks((prev) => [...prev, { ...task, completed: false }])
        },
      },
    })
  }, [])

  return (
    <div>
      <HomeDrawer t={t} locale={locale}>
        <div>
          <NavBar locale={locale} />
          <div className="flex p-4">
            <div className="mx-auto h-20 w-full max-w-[800px] space-y-4">
              <PageTitle>{t.home.title}</PageTitle>
              <TaskList
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
          </div>
        </div>
      </HomeDrawer>
    </div>
  )
}

export { TasksPage }
