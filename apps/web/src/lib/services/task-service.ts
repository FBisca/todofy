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
      throw new Error('Failed to update task')
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
    const queryParams = new URLSearchParams()
    if (filters?.status) {
      queryParams.set('status', filters.status)
    }
    if (filters?.completed !== undefined) {
      queryParams.set('completed', filters.completed.toString())
    }

    const response = await fetch(`/api/tasks?${queryParams.toString()}`)
    return await response.json()
  },
}

export { taskService }
