import { z } from 'zod'

export const UpdateTaskRequest = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  completed: z.boolean().optional(),
})
