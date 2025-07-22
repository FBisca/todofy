import { test } from '@playwright/test'
import { TaskPage } from '../pom/TasksPOM'

test.describe('E2E Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto('en')
  })

  test('shows loading state and then tasks', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.waitForLoading()
  })

  test('can add a new task', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.waitForLoading()
    await taskPage.addTask('My new task', 'My task description')
    await taskPage.expectTaskVisible('My new task')
  })

  test('can complete a task', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.waitForLoading()
    await taskPage.completeFirstTask()
    await taskPage.expectToastVisible(/task completed/i)
  })

  test('can delete a task', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.waitForLoading()
    await taskPage.deleteFirstTask()
    await taskPage.expectToastVisible(/task deleted/i)
  })
})
