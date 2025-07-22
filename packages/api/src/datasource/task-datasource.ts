import { err, ok, Result } from '@repo/api/lib/result'
import { Task } from '@repo/domain/model/task'
import { promises as fs } from 'fs'
import path from 'path'

type TaskDataSourceError = {
  type: 'task-datasource-error'
  message: string
  cause: unknown
}

type TaskAlreadyExistsError = {
  type: 'task-already-exists'
  message: string
  cause: unknown
}

type Error = TaskDataSourceError | TaskAlreadyExistsError

interface TaskDataSource {
  getAllTasks(): Promise<Result<Task[], Error>>
  createTask(task: Task): Promise<Result<Task, Error>>
  updateTask(id: string, update: Partial<Task>): Promise<Result<Task | undefined, Error>>
}

class FilesystemTaskDataSource implements TaskDataSource {
  private filePath: string
  private taskMap: Map<string, Task> = new Map()

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath)
  }

  private async readFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8')

      const { tasks } = JSON.parse(data) as { tasks: Task[] }
      return tasks
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
        await fs.writeFile(this.filePath, JSON.stringify({ tasks: [] }, null, 2), 'utf-8')
        return []
      }

      throw error
    }
  }

  private async loadTasks(): Promise<Map<string, Task>> {
    const tasks = await this.readFile()
    return new Map(tasks.map((task) => [task.id, task]))
  }

  private async saveTasks(): Promise<void> {
    const tasks = Array.from(this.taskMap.values())
    await fs.writeFile(this.filePath, JSON.stringify({ tasks }, null, 2), 'utf-8')
  }

  private async getTask(id: string): Promise<Task | undefined> {
    const cachedTask = this.taskMap.get(id)
    if (cachedTask) {
      return cachedTask
    }

    this.taskMap = await this.loadTasks()
    return this.taskMap.get(id)
  }

  async getAllTasks(): Promise<Result<Task[], Error>> {
    try {
      if (this.taskMap.size === 0) {
        this.taskMap = await this.loadTasks()
      }

      return ok(Array.from(this.taskMap.values()))
    } catch (error) {
      return err<Error>({
        type: 'task-datasource-error',
        message: 'Failed to get all tasks',
        cause: error,
      })
    }
  }

  async createTask(task: Task): Promise<Result<Task, Error>> {
    try {
      if (this.taskMap.has(task.id)) {
        return err<Error>({
          type: 'task-already-exists',
          message: 'Task already exists',
          cause: task,
        })
      }

      this.taskMap.set(task.id, task)
      await this.saveTasks()
      return ok(task)
    } catch (error) {
      return err<Error>({
        type: 'task-datasource-error',
        message: 'Failed to create task',
        cause: error,
      })
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Result<Task | undefined, Error>> {
    try {
      const existingTask = await this.getTask(id)
      if (!existingTask) {
        return ok(undefined)
      }

      const updatedTask = { ...existingTask, ...updates }
      this.taskMap.set(id, updatedTask)
      await this.saveTasks()

      return ok(updatedTask)
    } catch (error) {
      return err<Error>({
        type: 'task-datasource-error',
        message: 'Failed to update task',
        cause: error,
      })
    }
  }
}

export { FilesystemTaskDataSource, type Error, type TaskDataSource }
