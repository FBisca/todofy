import { parseSchema } from '@repo/api/lib/schema-parser'
import { TaskRepository } from '@repo/api/repository/task-repository'
import { TaskStatus } from '@repo/domain/model/task'
import { CreateTaskRequest } from '@repo/domain/request/create-task-request'
import { UpdateTaskRequest } from '@repo/domain/request/update-task-request'

class TaskController {
  constructor(private readonly repository: TaskRepository) {}

  async getTasks(): Promise<Response> {
    const result = await this.repository.getTasks()
    if (!result.ok) {
      return new Response(null, { status: 500 })
    }

    return new Response(JSON.stringify(result.value), { status: 200 })
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

    const { name, description, completed } = body.value
    const result = await this.repository.updateTask(id, {
      name,
      description,
      completed,
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
