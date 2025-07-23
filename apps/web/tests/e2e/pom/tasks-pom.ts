import { Locator, Page, expect } from '@playwright/test'

export class TaskPom {
  readonly page: Page
  readonly loadingTaskList: Locator
  readonly taskList: Locator
  readonly addTaskButton: Locator
  readonly taskNameInput: Locator
  readonly taskDescInput: Locator
  readonly saveTaskButton: Locator
  readonly taskCheckbox: Locator
  readonly deleteTaskButton: Locator
  readonly duplicateTaskButton: Locator
  readonly emptyTaskList: Locator
  readonly dropdownMenuTrigger: Locator
  readonly dropdownMenuDuplicateTask: Locator
  readonly dropdownMenuDeleteTask: Locator

  constructor(page: Page) {
    this.page = page
    this.loadingTaskList = page.getByTestId('loading-task-list')
    this.taskList = page.getByTestId('task-list')
    this.addTaskButton = page.getByTestId('add-task-button')
    this.taskNameInput = page.getByTestId('task-name-input')
    this.taskDescInput = page.getByTestId('task-desc-input')
    this.saveTaskButton = page.getByTestId('save-task-button')
    this.taskCheckbox = page.getByTestId('task-checkbox')
    this.deleteTaskButton = page.getByTestId('delete-task')
    this.duplicateTaskButton = page.getByTestId('duplicate-task')
    this.emptyTaskList = page.getByTestId('empty-task-list')
    this.dropdownMenuTrigger = page.getByTestId('dropdown-menu-trigger')
    this.dropdownMenuDuplicateTask = page.getByTestId('dropdown-menu-duplicate-task')
    this.dropdownMenuDeleteTask = page.getByTestId('dropdown-menu-delete-task')
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
    const isMobile = (this.page.viewportSize()?.width || 0) <= 768
    if (isMobile) {
      await this.dropdownMenuTrigger.first().click()
      await this.dropdownMenuDeleteTask.first().click()
    } else {
      await this.deleteTaskButton.first().click()
    }
  }

  async duplicateFirstTask() {
    const isMobile = (this.page.viewportSize()?.width || 0) <= 768
    if (isMobile) {
      await this.dropdownMenuTrigger.first().click()
      await this.dropdownMenuDuplicateTask.first().click()
    } else {
      await this.duplicateTaskButton.first().click()
    }
  }

  async editFirstTaskName({ oldName, newName }: { oldName: string; newName: string }) {
    const nameInput = this.page.locator(`input[value="${oldName}"]`).first()

    await nameInput.fill(newName)
  }

  async undoToastAction() {
    await this.page.getByRole('button', { name: /undo/i }).click()
  }

  async canDeleteTask() {
    return (await this.deleteTaskButton.count()) > 0
  }

  async expectTaskVisible(name: string) {
    await expect(this.page.locator(`input[value="${name}"]`).first()).toBeVisible()
  }

  async expectToastVisible(text: string | RegExp) {
    await expect(this.page.getByText(text)).toBeVisible()
  }

  async expectEmptyState() {
    await expect(this.emptyTaskList).toBeVisible()
  }
}
