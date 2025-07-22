export function isAddTaskShortcut(e: KeyboardEvent) {
  return e.key === 'i' && (e.metaKey || e.ctrlKey)
}

export function isEscapeShortcut(e: KeyboardEvent) {
  return e.key === 'Escape'
}
