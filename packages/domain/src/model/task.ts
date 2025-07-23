export interface Task {
  id: string
  name: string
  description: string
  completed: boolean
  completedAt?: Date
  status: TaskStatus
}

export enum TaskStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}
