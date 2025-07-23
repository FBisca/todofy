'use client'

import { Dictionary } from '@/i18n'
import { taskService } from '@/lib/services/task-service'
import { QueryKeys } from '@/lib/utils/query-keys'
import { AddTaskButton } from '@/ui/components/tasks/AddTaskButton'
import { MutableTaskList } from '@/ui/components/tasks/MutableTaskList'
import { arraySwap } from '@dnd-kit/sortable'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { PageTitle } from '@repo/ui/components/page-title'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoadingTaskList from '../components/tasks/LoadingTaskList'

interface Props {
  t: Dictionary
}

function TasksPage({ t }: Props) {
  const queryClient = useQueryClient()

  const [debounceTaskChange, setDebounceTaskChange] = useState<Task | undefined>(undefined)

  const { data: tasks, isLoading } = useQuery({
    queryKey: [QueryKeys.activeTasks],
    queryFn: () => taskService.getTasks({ completed: false, status: TaskStatus.ACTIVE }),
  })

  const setTasks = useCallback(
    (update: (prev: Task[]) => Task[]) => {
      queryClient.setQueryData([QueryKeys.activeTasks], update)
    },
    [queryClient],
  )

  const { mutate: completeTask } = useMutation({
    mutationFn: (task: Task) => {
      const completedTask = { ...task, completed: true, completedAt: new Date() }

      setTasks((prev) => prev.filter((e) => e.id !== task.id))

      return taskService.updateTask(task.id, completedTask)
    },
    onSuccess: (task: Task) => {
      toast.success(t.taskList.messages.taskCompleted, {
        action: {
          label: t.taskList.actions.undo,
          onClick: () => {
            changeTask({ ...task, completed: false })
          },
        },
      })
    },
  })

  const { mutate: createTask } = useMutation({
    mutationFn: async ({ action, ...task }: { name: string; description: string; action: 'create' | 'duplicate' }) => {
      const newTask = await taskService.createTask(task)
      return {
        newTask,
        action,
      }
    },
    onSuccess: ({ newTask, action }) => {
      setTasks((prev) => [...prev, newTask])

      toast.success(action === 'create' ? t.taskList.messages.taskCreated : t.taskList.messages.taskDuplicated)
    },
  })

  const { mutate: changeTask } = useMutation({
    mutationFn: async (task: Task) => {
      setTasks((prev) => {
        const index = prev.findIndex((e) => e.id === task.id)
        if (index === -1) {
          return [...prev, task]
        }

        return prev.map((e) => (e.id === task.id ? task : e))
      })

      if (task.name.length === 0 || task.description.length === 0) {
        return task
      }

      return taskService.updateTask(task.id, task)
    },
  })

  const { mutate: deleteTask } = useMutation({
    mutationFn: (task: Task) => {
      const archivedTask = { ...task, status: TaskStatus.ARCHIVED }
      setTasks((prev) => prev.filter((e) => e.id !== task.id))

      return taskService.updateTask(task.id, archivedTask)
    },
    onSuccess: (task: Task) => {
      toast.success(t.taskList.messages.taskDeleted, {
        action: {
          label: t.taskList.actions.undo,
          onClick: () => {
            changeTask({ ...task, status: TaskStatus.ACTIVE })
          },
        },
      })
    },
  })

  const onTaskChange = useCallback(
    (task: Task) => {
      if (debounceTaskChange && debounceTaskChange.id !== task.id) {
        changeTask(debounceTaskChange)
      }
      setDebounceTaskChange(task)
    },
    [changeTask, debounceTaskChange],
  )

  // A simple debounce to avoid sending too many requests to the server
  // the idea is to create a debounce without using any library to avoid dependencies
  useEffect(() => {
    if (!debounceTaskChange) {
      return
    }

    setTasks((prev) => prev.map((e) => (e.id === debounceTaskChange.id ? debounceTaskChange : e)))

    const timeout = setTimeout(() => {
      if (debounceTaskChange) {
        changeTask(debounceTaskChange)
        setDebounceTaskChange(undefined)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [debounceTaskChange, setTasks, changeTask])

  return (
    <>
      <div className="mx-auto h-full w-full max-w-[800px] space-y-4">
        <PageTitle>{t.tasks.title}</PageTitle>

        <LoadingTaskList isLoading={isLoading}>
          <div className="space-y-4" data-testid="task-list">
            <MutableTaskList
              onMove={(from, to) => {
                setTasks((prev) => {
                  const fromIndex = prev.findIndex((task) => task.id === from.id)
                  const toIndex = prev.findIndex((task) => task.id === to.id)
                  return arraySwap(prev, fromIndex, toIndex)
                })
              }}
              onChange={onTaskChange}
              onDuplicate={(task) => createTask({ ...task, action: 'duplicate' })}
              onDelete={deleteTask}
              onCheckChange={(e) => {
                if (e.completed === true) {
                  completeTask(e)
                } else {
                  changeTask(e)
                }
              }}
              tasks={tasks ?? []}
              t={t}
            />
            <div>
              <AddTaskButton t={t} onAdd={(task) => createTask({ ...task, action: 'create' })} />
            </div>
          </div>
        </LoadingTaskList>
      </div>
    </>
  )
}

export default TasksPage
