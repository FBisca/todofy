import { TaskStatus } from '@repo/domain/model/task'
import { z } from 'zod'

export const GetTasksQuery = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  completed: z.boolean().optional(),
})
