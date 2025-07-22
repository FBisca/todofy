import { executeApiRequest } from '@/lib/server/route-api'
import { app } from '@repo/api/app'
import { NextRequest } from 'next/server'

interface Params {
  id: string
}

export async function PATCH(request: NextRequest, props: { params: Promise<Params> }): Promise<Response> {
  const params = await props.params
  return executeApiRequest(() => app.taskController.updateTask(request, params.id))
}

export async function DELETE(_request: NextRequest, props: { params: Promise<Params> }): Promise<Response> {
  const params = await props.params
  return executeApiRequest(() => app.taskController.archiveTask(params.id))
}
