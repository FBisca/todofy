import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { MenuItem } from '../MenuItem'

vi.mock('next/navigation', () => {
  return {
    usePathname: vi.fn(),
  }
})

import { Locale } from '@/i18n'
import { usePathname } from 'next/navigation'

describe('MenuItem', () => {
  const defaultProps = {
    title: 'Tasks',
    path: '/tasks',
    icon: <span data-testid="icon">icon</span>,
    locale: 'en' as Locale,
  }

  test('GIVEN path with locale matches WHEN render THEN should be active', () => {
    const mockPathname = usePathname as ReturnType<typeof vi.fn>
    mockPathname.mockReturnValue('/en/tasks')

    render(<MenuItem {...defaultProps} />)

    const li = screen.getByRole('listitem')
    expect(li).toHaveClass('bg-primary/10')
    expect(li).toHaveClass('text-primary')
  })

  test('GIVEN path matches WHEN render THEN should be active', () => {
    const mockPathname = usePathname as ReturnType<typeof vi.fn>
    mockPathname.mockReturnValue('/tasks')

    render(<MenuItem {...defaultProps} />)

    const li = screen.getByRole('listitem')
    expect(li).toHaveClass('bg-primary/10')
    expect(li).toHaveClass('text-primary')
  })

  test('GIVEN path does not match WHEN render THEN should not be active', () => {
    const mockPathname = usePathname as ReturnType<typeof vi.fn>
    mockPathname.mockReturnValue('/other')

    render(<MenuItem {...defaultProps} />)

    const li = screen.getByRole('listitem')
    expect(li).not.toHaveClass('bg-primary')
    expect(li).not.toHaveClass('text-primary-foreground')
  })
})
