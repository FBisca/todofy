import { executeApiRequest } from '@/lib/server/route-api'
import { app } from '@repo/api/app'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  return executeApiRequest(() => app.taskController.createTask(request))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest): Promise<Response> {
  return executeApiRequest(() => app.taskController.getTasks())
}
