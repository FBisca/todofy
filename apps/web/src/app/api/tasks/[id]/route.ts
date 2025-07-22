import { executeApiRequest } from '@/lib/route-api'
import * as taskController from '@repo/api/controllers/task-controller'
import { NextRequest } from 'next/server'

interface Params {
  id: string
}

export async function PUT(request: NextRequest, props: { params: Promise<Params> }): Promise<Response> {
  const params = await props.params
  return executeApiRequest(() => taskController.updateTask(request, params.id))
}

export async function GET(request: NextRequest, props: { params: Promise<Params> }): Promise<Response> {
  const params = await props.params
  return executeApiRequest(() => taskController.deleteTask(request, params.id))
}
