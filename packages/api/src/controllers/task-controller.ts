import { parseSchema, parseSchemaQuery } from '@repo/api/lib/schema-parser'
import { TaskRepository } from '@repo/api/repository/task-repository'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { CreateTaskRequest } from '@repo/domain/request/create-task-request'
import { GetTasksQuery } from '@repo/domain/request/get-task-query'
import { UpdateTaskRequest } from '@repo/domain/request/update-task-request'

class TaskController {
  constructor(private readonly repository: TaskRepository) {}

  async getTasks(searchParams: URLSearchParams): Promise<Response> {
    const parseResult = parseSchemaQuery(searchParams, GetTasksQuery)
    if (!parseResult.ok) {
      return new Response(null, { status: 400 })
    }

    const { status, completed } = parseResult.value
    const result = await this.repository.getTasks()
    if (!result.ok) {
      return new Response(null, { status: 500 })
    }

    const filteredTasks = result.value.filter((task: Task) => {
      if (status && task.status !== status) {
        return false
      }

      if (completed !== undefined && task.completed !== completed) {
        return false
      }

      return true
    })

    return new Response(JSON.stringify(filteredTasks), { status: 200 })
  }

  async createTask(request: Request): Promise<Response> {
    const body = await parseSchema(request, CreateTaskRequest)
    if (!body.ok) {
      return new Response(null, { status: 400 })
    }

    const { name, description } = body.value
    const result = await this.repository.createTask({
      id: crypto.randomUUID(),
      name,
      description,
      completed: false,
      status: TaskStatus.ACTIVE,
    })

    if (!result.ok) {
      return new Response(null, { status: 500 })
    }

    return new Response(JSON.stringify(result.value), { status: 200 })
  }

  async updateTask(request: Request, id: string): Promise<Response> {
    const body = await parseSchema(request, UpdateTaskRequest)
    if (!body.ok) {
      return new Response(null, { status: 400 })
    }

    const { name, description, completed, status, completedAt } = body.value
    const result = await this.repository.updateTask(id, {
      name,
      description,
      completed,
      status,
      completedAt,
    })

    if (!result.ok) {
      return new Response(null, { status: 500 })
    }

    if (!result.value) {
      return new Response(null, { status: 404 })
    }

    return new Response(JSON.stringify(result.value), { status: 200 })
  }

  async archiveTask(id: string): Promise<Response> {
    const result = await this.repository.updateTask(id, {
      status: TaskStatus.ARCHIVED,
    })

    if (!result.ok) {
      return new Response(null, { status: 500 })
    }

    if (!result.value) {
      return new Response(null, { status: 404 })
    }

    return new Response(JSON.stringify(result.value), { status: 200 })
  }
}

export { TaskController }
