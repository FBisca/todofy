import { Error, TaskDataSource } from '@repo/api/datasource/task-datasource'
import { Result } from '@repo/api/lib/result'
import { Task } from '@repo/domain/model/task'

interface TaskRepository {
  getTasks(): Promise<Result<Task[], Error>>
  createTask(task: Task): Promise<Result<Task, Error>>
  updateTask(id: string, data: Partial<Task>): Promise<Result<Task | undefined, Error>>
}

class TaskRepositoryImpl implements TaskRepository {
  private taskDataSource: TaskDataSource

  constructor(taskDataSource: TaskDataSource) {
    this.taskDataSource = taskDataSource
  }

  async getTasks() {
    return this.taskDataSource.getAllTasks()
  }

  async createTask(task: Task) {
    return this.taskDataSource.createTask(task)
  }

  async updateTask(id: string, data: Partial<Task>) {
    return this.taskDataSource.updateTask(id, data)
  }
}

export { TaskRepositoryImpl, type TaskRepository }
