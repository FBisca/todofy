import { TaskStatus } from '@repo/domain/model/task'
import { z } from 'zod'

export const UpdateTaskRequest = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
})
