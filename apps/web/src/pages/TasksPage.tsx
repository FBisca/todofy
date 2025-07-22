'use client'

import { AddTaskButton } from '@/components/AddTaskButton'
import { HomeDrawer } from '@/components/HomeDrawer'
import { NavBar } from '@/components/NavBar'
import { TaskList } from '@/components/TaskList'
import { Dictionary, Locale } from '@/i18n'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { PageTitle } from '@repo/ui/components/page-title'
import { useState } from 'react'

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
                    const newTasks = [...prev]
                    newTasks[fromIndex] = to
                    newTasks[toIndex] = from
                    return newTasks
                  })
                }}
                onChange={(e) => {
                  setTasks((prev) => prev.map((task) => (task.id === e.id ? e : task)))
                }}
                onDelete={(e) => {
                  setTasks((prev) => prev.filter((task) => task.id !== e.id))
                }}
                onCheckChange={(e) => {
                  setTasks((prev) => prev.map((task) => (task.id === e.id ? e : task)))
                }}
                tasks={tasks}
                t={t}
              />
              <div>
                <AddTaskButton t={t} />
              </div>
            </div>
          </div>
        </div>
      </HomeDrawer>
    </div>
  )
}

export { TasksPage }
