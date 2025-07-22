import { getDictionary } from '@/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, test, vi } from 'vitest'
import { AddTaskButton } from '../AddTaskButton'

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,

  motion: {
    // eslint-disable-next-line react/display-name
    div: React.forwardRef(({ children, ...props }: { children: React.ReactNode }, ref) => (
      <div {...props} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
      </div>
    )),
  },
}))

describe('AddTaskButton', () => {
  test('shows AddTask when button is clicked', async () => {
    const dictionary = await getDictionary('en')
    render(<AddTaskButton t={dictionary} onAdd={() => {}} />)

    const button = screen.getByTestId('add-task-button')
    expect(button).toBeInTheDocument()

    expect(screen.queryByPlaceholderText(dictionary.addTask.title)).not.toBeInTheDocument()

    await userEvent.click(button)

    expect(screen.getByPlaceholderText(dictionary.addTask.title)).toBeInTheDocument()
  })

  test('hides AddTask when cancel button is clicked', async () => {
    const dictionary = await getDictionary('en')
    render(<AddTaskButton t={dictionary} onAdd={() => {}} />)

    const button = screen.getByTestId('add-task-button')
    await userEvent.click(button)

    await screen.findByPlaceholderText(dictionary.addTask.title)

    const cancelButton = screen.getByRole('button', { name: dictionary.addTask.cancel })
    await userEvent.click(cancelButton)

    expect(screen.queryByPlaceholderText(dictionary.addTask.title)).not.toBeInTheDocument()
  })
})
