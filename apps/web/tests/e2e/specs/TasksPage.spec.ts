import { test } from '@playwright/test'
import { cleanDatabase } from '../fixture/task-datasource'
import { TaskPom } from '../pom/tasks-pom'

test.describe('E2E Tasks Page', () => {
  test.beforeEach(async ({ page, context }) => {
    cleanDatabase()
    await context.clearCookies()

    const taskPage = new TaskPom(page)
    await taskPage.goto('en')

    for (const page of context.pages()) {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    }
  })

  test('shows loading state and then tasks', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()
  })

  test('can add a new task', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()

    await taskPage.addTask('My new task', 'My task description')
    await taskPage.expectToastVisible(/task created/i)
    await taskPage.expectTaskVisible('My new task')
  })

  test('can complete a task', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()

    await taskPage.addTask('My new task', 'My task description')
    await taskPage.completeFirstTask()
    await taskPage.expectToastVisible(/task completed/i)
  })

  test('can delete a task', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()

    await taskPage.addTask('My new task', 'My task description')
    await taskPage.deleteFirstTask()
    await taskPage.expectToastVisible(/task deleted/i)
  })

  test('can duplicate a task', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()

    await taskPage.addTask('My new task', 'My task description')
    await taskPage.duplicateFirstTask()

    await taskPage.expectToastVisible(/task duplicated/i)
  })

  test('can edit a task', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()

    await taskPage.addTask('My new task', 'My task description')
    await taskPage.editFirstTaskName({
      oldName: 'My new task',
      newName: 'Edited Task',
    })

    await taskPage.expectTaskVisible('Edited Task')
  })

  test('can undo after completing a task', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()

    await taskPage.addTask('My new task', 'My task description')
    await taskPage.completeFirstTask()
    await taskPage.expectToastVisible(/task completed/i)

    await taskPage.undoToastAction()
    await taskPage.expectTaskVisible('My new task') // or the original task name
  })

  test('shows empty state when all tasks are deleted', async ({ page }) => {
    const taskPage = new TaskPom(page)
    await taskPage.waitForLoading()
    await taskPage.addTask('My new task', 'My task description')

    while (await taskPage.canDeleteTask()) {
      await taskPage.deleteFirstTask()
      await page.waitForResponse((response) => response.url().includes('api/tasks'))
    }

    await taskPage.expectEmptyState()
  })
})
