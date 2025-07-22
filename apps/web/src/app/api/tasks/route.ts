import { executeApiRequest } from '@/lib/route-api'
import * as taskController from '@repo/api/controllers/task-controller'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest): Promise<Response> {
  return executeApiRequest(() => taskController.createTask(request))
}

export async function GET(_request: NextRequest): Promise<Response> {
  return executeApiRequest(() => taskController.getTasks())
}
