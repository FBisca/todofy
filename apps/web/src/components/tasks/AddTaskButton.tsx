'use client'
import { Dictionary } from '@/i18n'
import { isAddTaskShortcut, isEscapeShortcut } from '@/lib/shortcut-manager'
import { Task } from '@repo/domain/model/task'
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AddTask } from './AddTask'

interface Props {
  className?: string
  t: Dictionary
  onAdd: (task: Task) => void
  onAddingChange?: (isAdding: boolean) => void
}

function AddTaskButton({ className, t, onAdd, onAddingChange }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isAddTaskShortcut(e)) {
        e.preventDefault()
        setIsAdding(true)
      }

      if (isEscapeShortcut(e)) {
        e.preventDefault()
        setIsAdding(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.userAgent))
    }
  }, [])

  useEffect(() => {
    if (onAddingChange) {
      onAddingChange(isAdding)
    }
  }, [isAdding, onAddingChange])

  return (
    <div className={cn(className)}>
      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.div
            key="add-task"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <AddTask
              t={t}
              onCancel={() => setIsAdding(false)}
              onAdd={(e) => {
                onAdd(e)
                setIsAdding(false)
              }}
            />
          </motion.div>
        )}

        {!isAdding && (
          <motion.div
            key="add-task-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="h-auto w-full px-2 py-1"
              data-testid="add-task-button"
            >
              <Plus className="h-4 w-4" />
              <span className="font-semibold">{t.addTask.addNew}</span>
              <kbd className="border-border bg-background pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border px-1.5 font-medium transition-opacity duration-200 group-hover:opacity-0 md:flex">
                <span className="mt-0.5 text-lg">{isMac ? '⌘' : 'Ctrl'}</span>
                <span className="text-[1rem]">+</span>
                <span>I</span>
              </kbd>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { AddTaskButton }
