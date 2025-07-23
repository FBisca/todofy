import { TaskController } from '@repo/api/controllers/task-controller'
import { FilesystemTaskDataSource } from '@repo/api/datasource/task-datasource'
import { TaskRepositoryImpl } from '@repo/api/repository/task-repository'

// This file is a Dependency Injection container for the application to invert control
// Next.js doesnt support dependency injection out of the box, so we need to do it manually
const tasksFilePath = process.env.TASKS_FILE_PATH!

const taskDataSource = new FilesystemTaskDataSource(tasksFilePath, process.env.APP_ENV !== 'test')
const taskRepository = new TaskRepositoryImpl(taskDataSource)
const taskController = new TaskController(taskRepository)

export const app = {
  taskController,
}
