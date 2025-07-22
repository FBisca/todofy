import { TaskController } from '@repo/api/controllers/task-controller'
import { FilesystemTaskDataSource } from '@repo/api/datasource/task-datasource'
import { TaskRepositoryImpl } from '@repo/api/repository/task-repository'

const taskDataSource = new FilesystemTaskDataSource('tasks.json')
const taskRepository = new TaskRepositoryImpl(taskDataSource)
const taskController = new TaskController(taskRepository)

export const app = {
  taskController,
}
