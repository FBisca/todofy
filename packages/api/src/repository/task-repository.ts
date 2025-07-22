import { Task } from '@repo/domain/model/task'

export async function getTasks() {
  // Fetch tasks from DB or service
}

export async function createTask(data: { name: string; description: string }) {
  // Create and return new task
}

export async function updateTask(id: string, data: Partial<Task>) {
  // Update and return task
}

export async function deleteTask(id: string) {
  // Delete and return result
}
