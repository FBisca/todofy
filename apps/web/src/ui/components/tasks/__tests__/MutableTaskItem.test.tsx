// @vitest-environment jsdom
import en from '@/i18n/dictionaries/en'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MutableTaskItem } from '../MutableTaskItem'

describe('MutableTaskItem', () => {
  const task: Task = {
    id: '1',
    name: 'Test Task',
    description: 'Test Description',
    completed: false,
    status: TaskStatus.ACTIVE,
  }

  it('renders task name and description', () => {
    render(
      <MutableTaskItem
        task={task}
        t={en}
        anyDragging={false}
        onCheckChange={vi.fn()}
        onChange={vi.fn()}
        onDelete={vi.fn()}
        onDuplicate={vi.fn()}
      />,
    )
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
  })

  it('calls onCheckChange when checkbox is clicked', () => {
    const onCheckChange = vi.fn()
    render(
      <MutableTaskItem
        task={task}
        t={en}
        anyDragging={false}
        onCheckChange={onCheckChange}
        onChange={vi.fn()}
        onDelete={vi.fn()}
        onDuplicate={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTestId('task-checkbox'))
    expect(onCheckChange).toHaveBeenCalled()
  })

  it('calls onChange when name or description is edited', () => {
    const onChange = vi.fn()
    render(
      <MutableTaskItem
        task={task}
        t={en}
        anyDragging={false}
        onCheckChange={vi.fn()}
        onChange={onChange}
        onDelete={vi.fn()}
        onDuplicate={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Name' } })
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Desc' } })
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(
      <MutableTaskItem
        task={task}
        t={en}
        anyDragging={false}
        onCheckChange={vi.fn()}
        onChange={vi.fn()}
        onDelete={onDelete}
        onDuplicate={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTestId('delete-task'))
    expect(onDelete).toHaveBeenCalled()
  })

  it('calls onDuplicate when duplicate button is clicked', () => {
    const onDuplicate = vi.fn()
    render(
      <MutableTaskItem
        task={task}
        t={en}
        anyDragging={false}
        onCheckChange={vi.fn()}
        onChange={vi.fn()}
        onDelete={vi.fn()}
        onDuplicate={onDuplicate}
      />,
    )

    fireEvent.click(screen.getByText('Duplicate'))
    expect(onDuplicate).toHaveBeenCalled()
  })
})
