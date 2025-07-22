import { Locator, Page, expect } from '@playwright/test'

export class TaskPage {
  readonly page: Page
  readonly loadingTaskList: Locator
  readonly taskList: Locator
  readonly addTaskButton: Locator
  readonly taskNameInput: Locator
  readonly taskDescInput: Locator
  readonly saveTaskButton: Locator
  readonly taskCheckbox: Locator
  readonly deleteTaskButton: Locator

  constructor(page: Page) {
    this.page = page
    this.loadingTaskList = page.locator('[data-testid="loading-task-list"]')
    this.taskList = page.locator('[data-testid="task-list"]')
    this.addTaskButton = page.getByTestId('add-task-button')
    this.taskNameInput = page.getByTestId('task-name-input')
    this.taskDescInput = page.getByTestId('task-desc-input')
    this.saveTaskButton = page.getByTestId('save-task-button')
    this.taskCheckbox = page.getByTestId('task-checkbox')
    this.deleteTaskButton = page.getByTestId('delete-task')
  }

  async goto(locale = 'en') {
    await this.page.goto(`/${locale}`)
  }

  async waitForLoading() {
    await expect(this.loadingTaskList).toBeVisible()
    await expect(this.taskList).toBeVisible()
  }

  async addTask(name: string, description: string) {
    await this.addTaskButton.click()
    await this.taskNameInput.fill(name)
    await this.taskDescInput.fill(description)
    await this.saveTaskButton.click()
  }

  async completeFirstTask() {
    const firstCheckBox = this.taskCheckbox.first()
    await firstCheckBox.setChecked(true)
  }

  async deleteFirstTask() {
    await this.deleteTaskButton.first().click()
  }

  async expectTaskVisible(name: string) {
    await expect(this.page.locator(`input[value="${name}"]`).first()).toBeVisible()
  }

  async expectToastVisible(text: string | RegExp) {
    await expect(this.page.getByText(text)).toBeVisible()
  }
}
