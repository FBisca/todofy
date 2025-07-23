import { executeApiRequest } from '@/lib/server/route-api'
import { app } from '@repo/api/app'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  return executeApiRequest(() => app.taskController.createTask(request))
}

export async function GET(request: NextRequest): Promise<Response> {
  return executeApiRequest(() => app.taskController.getTasks(request.nextUrl.searchParams))
}
