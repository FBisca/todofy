import { Task, TaskStatus } from '@repo/domain/model/task'
import { promises as fn } from 'fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FilesystemTaskDataSource } from '../task-datasource.js'

vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}))

const mockReadFile = vi.mocked(fn.readFile)
const mockWriteFile = vi.mocked(fn.writeFile)

describe.each([true, false])('FilesystemTaskDataSource', (useMemoryCache) => {
  const filePath = '/fake/path/tasks.json'

  let ds: FilesystemTaskDataSource
  const task: Task = {
    id: '1',
    name: 'Test',
    description: 'Desc',
    completed: false,
    status: TaskStatus.ACTIVE,
  }

  beforeEach(() => {
    ds = new FilesystemTaskDataSource(filePath, useMemoryCache)
    mockReadFile.mockReset()
    mockWriteFile.mockReset()
  })

  it('returns empty on first read if file does not exist', async () => {
    mockReadFile.mockRejectedValueOnce({ code: 'ENOENT' })
    mockWriteFile.mockResolvedValueOnce(undefined)

    const result = await ds.getAllTasks()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([])
    }
  })

  it('returns all tasks from file', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [task] }))

    const result = await ds.getAllTasks()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([task])
    }
  })

  it('creates a new task', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [] }))
    mockWriteFile.mockResolvedValue(undefined)

    const result = await ds.createTask(task)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual(task)
    }

    expect(mockWriteFile).toHaveBeenCalledOnce()
  })

  it('does not create a task if id exists', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [task] }))

    const result = await ds.createTask(task)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('task-already-exists')
    }

    expect(mockWriteFile).not.toHaveBeenCalled()
  })

  it('updates an existing task', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [task] }))
    mockWriteFile.mockResolvedValue(undefined)

    if (!useMemoryCache) {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [{ ...task, name: 'Updated' }] }))
    }

    const result = await ds.updateTask(task.id, { name: 'Updated' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value?.name).toBe('Updated')
    }
  })

  it('returns ok undefined if updating non-existent task', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [] }))

    const result = await ds.updateTask('notfound', { name: 'Nope' })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toBeUndefined()
    }
  })

  it('returns error on read failure', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('fail'))
    const result = await ds.getAllTasks()
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('task-datasource-error')
    }
  })

  it('returns error on write failure', async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ tasks: [] }))
    mockWriteFile.mockRejectedValueOnce(new Error('fail'))

    await ds.getAllTasks()

    const result = await ds.createTask({ ...task, id: '2' })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('task-datasource-error')
    }
  })
})
