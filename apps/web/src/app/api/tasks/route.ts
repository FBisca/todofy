import { executeApiRequest } from '@/lib/route-api'
import { app } from '@repo/api/app'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  return executeApiRequest(() => app.taskController.createTask(request))
}

export async function GET(): Promise<Response> {
  return executeApiRequest(() => app.taskController.getTasks())
}
