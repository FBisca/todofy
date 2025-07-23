import { TaskController } from '@repo/api/controllers/task-controller'
import { parseSchema, parseSchemaQuery } from '@repo/api/lib/schema-parser'
import { TaskStatus } from '@repo/domain/model/task'
import { describe, expect, Mock, test, vi } from 'vitest'

// Mock dependencies
vi.mock('@repo/api/lib/schema-parser', () => ({ parseSchema: vi.fn(), parseSchemaQuery: vi.fn() }))

const mockRepo = {
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
}

const mockTask = { id: '1', name: 'Task', description: 'Desc', status: TaskStatus.ACTIVE, completed: true }
const mockRequest = {} as Request

const taskController = new TaskController(mockRepo)
const mockParseSchema = parseSchema as Mock
const mockParseSchemaQuery = parseSchemaQuery as Mock

describe('task-controller', () => {
  describe('getTasks', () => {
    test('getTasks returns 200 with tasks', async () => {
      mockRepo.getTasks.mockResolvedValue({ ok: true, value: [mockTask] })
      mockParseSchemaQuery.mockReturnValue({ ok: true, value: {} })

      const params = new URLSearchParams('')
      const response = await taskController.getTasks(params)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual([mockTask])
    })

    test('getTasks filters tasks by query param status', async () => {
      mockRepo.getTasks.mockResolvedValue({
        ok: true,
        value: [mockTask, { ...mockTask, id: '2', status: TaskStatus.ARCHIVED }],
      })
      mockParseSchemaQuery.mockReturnValue({ ok: true, value: { status: TaskStatus.ACTIVE } })

      const params = new URLSearchParams('status=ACTIVE')
      const response = await taskController.getTasks(params)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.length).toEqual(1)
      expect(data[0].status).toEqual(TaskStatus.ACTIVE)
    })

    test('getTasks filters tasks by query param completed', async () => {
      mockRepo.getTasks.mockResolvedValue({
        ok: true,
        value: [mockTask, { ...mockTask, id: '2', completed: false }],
      })
      mockParseSchemaQuery.mockReturnValue({ ok: true, value: { completed: true } })

      const params = new URLSearchParams('completed=true')
      const response = await taskController.getTasks(params)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.length).toEqual(1)
      expect(data[0].completed).toEqual(true)
    })

    test('getTasks returns 400 on invalid query params', async () => {
      mockParseSchemaQuery.mockReturnValue({ ok: false, error: 'bad-query' })

      const params = new URLSearchParams('name=Task')
      const response = await taskController.getTasks(params)
      expect(response.status).toBe(400)
    })

    test('getTasks returns 500 on error', async () => {
      mockRepo.getTasks.mockResolvedValue({ ok: false, error: 'fail' })
      mockParseSchemaQuery.mockReturnValue({ ok: true, value: {} })

      const params = new URLSearchParams('')
      const response = await taskController.getTasks(params)
      expect(response.status).toBe(500)
    })
  })

  describe('createTask', () => {
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
  })

  describe('updateTask', () => {
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
  })

  describe('archiveTask', () => {
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
})
