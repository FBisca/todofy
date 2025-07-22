import { Task, TaskStatus } from '@repo/domain/model/task'
import { CreateTaskRequest } from '@repo/domain/request/create-task-request'
import { UpdateTaskRequest } from '@repo/domain/request/update-task-request'
import { z } from 'zod'

interface GetTasksFilters {
  status?: TaskStatus
  completed?: boolean
}

const taskService = {
  createTask: async (task: z.infer<typeof CreateTaskRequest>): Promise<Task> => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })

    if (!response.ok) {
      throw new Error('Failed to create task')
    }

    return await response.json()
  },

  updateTask: async (id: string, task: z.infer<typeof UpdateTaskRequest>): Promise<Task> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(task),
    })

    if (!response.ok) {
      throw new Error('Failed to create task')
    }

    return await response.json()
  },

  archiveTask: async (id: string): Promise<void> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to archive task')
    }
  },

  getTasks: async (filters?: GetTasksFilters): Promise<Task[]> => {
    const response = await fetch(`/api/tasks`)
    const tasks = await response.json()

    return tasks.filter((task: Task) => {
      if (filters?.status && task.status !== filters.status) {
        return false
      }

      if (filters?.completed !== undefined && task.completed !== filters.completed) {
        return false
      }

      return true
    })
  },
}

export { taskService }
