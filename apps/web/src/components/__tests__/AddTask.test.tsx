import { getDictionary } from '@/i18n'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe } from 'node:test'
import { expect, test } from 'vitest'
import { AddTask } from '../AddTask'

describe('AddTask', () => {
  test('WHEN user inputs data THEN should change the button state based on name and description', async () => {
    const dictionary = await getDictionary('en')
    render(<AddTask t={dictionary} onCancel={() => {}} />)

    const addButton = screen.getByRole('button', { name: dictionary.addTask.add })
    const nameInput = screen.getByPlaceholderText(dictionary.addTask.title)
    const descriptionInput = screen.getByPlaceholderText(dictionary.addTask.description)

    // Initially disabled
    expect(addButton).toBeDisabled()

    // Type only name
    await userEvent.type(nameInput, 'Test Task')
    expect(addButton).toBeDisabled()

    // Type only description
    await userEvent.clear(nameInput)
    await userEvent.type(descriptionInput, 'Test Description')
    expect(addButton).toBeDisabled()

    // Type both
    await userEvent.type(nameInput, 'Test Task')
    expect(addButton).toBeEnabled()

    // Clear one field
    await userEvent.clear(descriptionInput)
    expect(addButton).toBeDisabled()
  })
})
