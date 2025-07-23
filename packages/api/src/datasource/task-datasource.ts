import { err, ok, Result } from '@repo/api/lib/result'
import { Task } from '@repo/domain/model/task'
import { Mutex } from 'async-mutex'
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
  private fileMutex = new Mutex()
  private filePath: string
  private useMemoryCache: boolean

  private memoryCache: Map<string, Task> = new Map()

  constructor(filePath: string, useMemoryCache: boolean = true) {
    this.filePath = path.resolve(filePath)
    this.useMemoryCache = useMemoryCache
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
    const taskMap = new Map(tasks.map((task) => [task.id, task]))

    if (this.useMemoryCache) {
      this.memoryCache = taskMap
    }

    return taskMap
  }

  private shouldUseMemoryCache(): boolean {
    return this.useMemoryCache && this.memoryCache.size > 0
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify({ tasks }, null, 2), 'utf-8')
  }

  private async getTask(id: string): Promise<Task | undefined> {
    const cachedTask = this.shouldUseMemoryCache() ? this.memoryCache.get(id) : undefined
    if (cachedTask) {
      return cachedTask
    }

    const taskMap = await this.loadTasks()
    return taskMap.get(id)
  }

  async getAllTasks(): Promise<Result<Task[], Error>> {
    return this.fileMutex.runExclusive(async () => {
      try {
        const taskMap = this.shouldUseMemoryCache() ? this.memoryCache : await this.loadTasks()

        return ok(Array.from(taskMap.values()))
      } catch (error) {
        return err<Error>({
          type: 'task-datasource-error',
          message: 'Failed to get all tasks',
          cause: error,
        })
      }
    })
  }

  async createTask(task: Task): Promise<Result<Task, Error>> {
    return this.fileMutex.runExclusive(async () => {
      try {
        const taskMap = this.shouldUseMemoryCache() ? this.memoryCache : await this.loadTasks()
        if (taskMap.has(task.id)) {
          return err<Error>({
            type: 'task-already-exists',
            message: 'Task already exists',
            cause: task,
          })
        }

        taskMap.set(task.id, task)

        await this.saveTasks(Array.from(taskMap.values()))
        return ok(task)
      } catch (error) {
        return err<Error>({
          type: 'task-datasource-error',
          message: 'Failed to create task',
          cause: error,
        })
      }
    })
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Result<Task | undefined, Error>> {
    return this.fileMutex.runExclusive(async () => {
      try {
        const existingTask = await this.getTask(id)
        if (!existingTask) {
          return ok(undefined)
        }

        const updatedTask = { ...existingTask, ...updates }

        const tasksMap = this.shouldUseMemoryCache() ? this.memoryCache : await this.loadTasks()
        tasksMap.set(id, updatedTask)

        await this.saveTasks(Array.from(tasksMap.values()))

        return ok(updatedTask)
      } catch (error) {
        return err<Error>({
          type: 'task-datasource-error',
          message: 'Failed to update task',
          cause: error,
        })
      }
    })
  }
}

export { FilesystemTaskDataSource, type Error, type TaskDataSource }
