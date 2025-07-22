import { NextResponse } from 'next/server'

function handleError(error: unknown) {
  // log error on any monitoring tool
  console.error(error)
  return new NextResponse('unexpected_error', {
    status: 500,
  })
}

async function executeApiRequest(command: () => Promise<Response>): Promise<Response> {
  try {
    return await command()
  } catch (error) {
    return handleError(error)
  }
}

export { executeApiRequest }
