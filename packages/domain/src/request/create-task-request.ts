import { z } from 'zod'

export const CreateTaskRequest = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})
