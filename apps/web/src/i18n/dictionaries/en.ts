export default {
  metadata: {
    title: 'Todofy | Your To Do list manager',
    description: 'Your To Do list manager',
  },
  tasks: {
    title: 'Tasks',
  },
  completedTasks: {
    title: 'Completed Tasks',
  },
  archivedTasks: {
    title: 'Deleted Tasks',
  },
  menu: {
    tasks: 'Tasks',
    archived: 'Deleted',
    completed: 'Completed',
  },
  taskList: {
    messages: {
      taskCompleted: 'Task completed',
      taskDeleted: 'Task deleted',
      taskDuplicated: 'Task duplicated',
      taskCreated: 'Task created',
      taskCreationFailed: 'Task creation failed',
      taskUpdateFailed: 'Task update failed',
    },
    actions: {
      duplicate: 'Duplicate',
      delete: 'Delete',
      undo: 'Undo',
    },
    empty: {
      title: 'No tasks',
      description: 'Add a task to get started',
    },
  },
  addTask: {
    title: 'Your task name',
    description: 'Your task description',
    cancel: 'Cancel',
    add: 'Add Task',
    addNew: 'Add new task',
  },
  task: {
    title: 'Task Name',
    description: 'Task Description',
    completedAt: 'Completed:',
  },
}
