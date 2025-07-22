import { TaskController } from '@repo/api/controllers/task-controller'
import { parseSchema } from '@repo/api/lib/schema-parser'
import { TaskStatus } from '@repo/domain/model/task'
import { describe, expect, Mock, test, vi } from 'vitest'

// Mock dependencies
vi.mock('@repo/api/lib/schema-parser', () => ({ parseSchema: vi.fn() }))

const mockRepo = {
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
}

const mockTask = { id: '1', name: 'Task', description: 'Desc', status: TaskStatus.ACTIVE }
const mockRequest = {} as Request

const taskController = new TaskController(mockRepo)
const mockParseSchema = parseSchema as Mock

describe('task-controller', () => {
  test('getTasks returns 200 with tasks', async () => {
    mockRepo.getTasks.mockResolvedValue({ ok: true, value: [mockTask] })

    const res = await taskController.getTasks()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual([mockTask])
  })

  test('getTasks returns 500 on error', async () => {
    mockRepo.getTasks.mockResolvedValue({ ok: false, error: 'fail' })

    const res = await taskController.getTasks()
    expect(res.status).toBe(500)
  })

  test('createTask returns 200 on success', async () => {
    mockParseSchema.mockResolvedValue({ ok: true, value: { name: 'Task', description: 'Desc' } })
    mockRepo.createTask.mockResolvedValue({ ok: true, value: mockTask })

    const res = await taskController.createTask(mockRequest)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual(mockTask)
  })

  test('createTask returns 400 on invalid body', async () => {
    mockParseSchema.mockResolvedValue({ ok: false, error: 'bad' })

    const res = await taskController.createTask(mockRequest)
    expect(res.status).toBe(400)
  })

  test('createTask returns 500 on repo error', async () => {
    mockParseSchema.mockResolvedValue({ ok: true, value: { name: 'Task', description: 'Desc' } })
    mockRepo.createTask.mockResolvedValue({ ok: false, error: 'fail' })

    const res = await taskController.createTask(mockRequest)
    expect(res.status).toBe(500)
  })

  test('updateTask returns 200 on success', async () => {
    mockParseSchema.mockResolvedValue({
      ok: true,
      value: { name: 'Task', description: 'Desc', completed: false, status: TaskStatus.ACTIVE },
    })
    mockRepo.updateTask.mockResolvedValue({ ok: true, value: mockTask })

    const res = await taskController.updateTask(mockRequest, '1')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual(mockTask)
  })

  test('updateTask returns 400 on invalid body', async () => {
    mockParseSchema.mockResolvedValue({ ok: false, error: 'bad' })

    const res = await taskController.updateTask(mockRequest, '1')
    expect(res.status).toBe(400)
  })

  test('updateTask returns 500 on repo error', async () => {
    mockParseSchema.mockResolvedValue({ ok: true, value: { name: 'Task', description: 'Desc', completed: false } })
    mockRepo.updateTask.mockResolvedValue({ ok: false, error: 'fail' })

    const res = await taskController.updateTask(mockRequest, '1')
    expect(res.status).toBe(500)
  })

  test('updateTask returns 404 if not found', async () => {
    mockParseSchema.mockResolvedValue({ ok: true, value: { name: 'Task', description: 'Desc', completed: false } })
    mockRepo.updateTask.mockResolvedValue({ ok: true, value: null })

    const res = await taskController.updateTask(mockRequest, '1')
    expect(res.status).toBe(404)
  })

  test('archiveTask returns 200 on success', async () => {
    mockRepo.updateTask.mockResolvedValue({ ok: true, value: mockTask })

    const res = await taskController.archiveTask('1')
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual(mockTask)
  })

  test('archiveTask returns 500 on repo error', async () => {
    mockRepo.updateTask.mockResolvedValue({ ok: false, error: 'fail' })

    const res = await taskController.archiveTask('1')
    expect(res.status).toBe(500)
  })

  test('archiveTask returns 404 if not found', async () => {
    mockRepo.updateTask.mockResolvedValue({ ok: true, value: null })

    const res = await taskController.archiveTask('1')
    expect(res.status).toBe(404)
  })
})
