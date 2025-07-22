import { NextResponse } from 'next/server'

function handleError(error: unknown) {
  // log error on any monitoring tool
  console.error(error)
  return new NextResponse('unexpected_error', {
    status: 500,
  })
}

/**
 * Execute an API request and handle errors.
 *
 * This function is used to fill the missing Next.js API routes features of error handling.
 * Any error thrown by the command function will be caught and a 500 response will be returned instead of crashing the server.
 *
 * @param command - The function to execute
 * @returns A NextResponse object
 */
async function executeApiRequest(command: () => Promise<Response>): Promise<Response> {
  try {
    return await command()
  } catch (error) {
    return handleError(error)
  }
}

export { executeApiRequest }
