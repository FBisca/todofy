import { TaskController } from '@repo/api/controllers/task-controller'
import { FilesystemTaskDataSource } from '@repo/api/datasource/task-datasource'
import { TaskRepositoryImpl } from '@repo/api/repository/task-repository'

const tasksFilePath = process.env.TASKS_FILE_PATH!

const taskDataSource = new FilesystemTaskDataSource(tasksFilePath)
const taskRepository = new TaskRepositoryImpl(taskDataSource)
const taskController = new TaskController(taskRepository)

export const app = {
  taskController,
}
