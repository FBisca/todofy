'use client'

import { Dictionary } from '@/i18n'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@repo/domain/model/task'
import { Button } from '@repo/ui/components/button'
import { Checkbox } from '@repo/ui/components/checkbox'
import { Input } from '@repo/ui/components/input'
import { cn } from '@repo/ui/lib/utils'
import { motion } from 'framer-motion'
import { Copy, Trash2 } from 'lucide-react'

interface Props {
  task: Task
  t: Dictionary
  anyDragging: boolean
  onCheckChange: (task: Task) => void
  onChange: (task: Task) => void
  onDelete: (task: Task) => void
  onDuplicate: (task: Task) => void
}

function TaskItem({ task, anyDragging, onChange, onDelete, onCheckChange, onDuplicate, t }: Props) {
  const { listeners, setNodeRef, isDragging, transform, transition, attributes } = useSortable({
    id: task.id,
    data: task,
    transition: {
      duration: 200,
      easing: 'ease',
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      animate={{
        opacity: isDragging ? 0.5 : 1,
      }}
      ref={setNodeRef}
      className={cn(
        'group flex w-full cursor-pointer select-all items-center gap-2 px-1 transition-opacity duration-300',
        {
          'bg-background border-border rounded-lg border opacity-50': isDragging,
        },
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Checkbox
        className={cn('mt-2 size-4 self-start', {
          'opacity-0': anyDragging,
        })}
        checked={task.completed === true}
        onCheckedChange={(checkedState) => onCheckChange({ ...task, completed: checkedState === true })}
      />
      <div className="flex flex-1 flex-col">
        <Input
          type="text"
          value={task.name}
          variant="ghost"
          size="taskTitle"
          placeholder={t.task.title}
          onChange={(e) => onChange({ ...task, name: e.target.value })}
          className="placeholder:text-muted-foreground/70 font-semibold"
        />
        <Input
          type="text"
          variant="ghost"
          size="taskDescription"
          placeholder={t.task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          className="placeholder:text-muted-foreground/70"
          value={task.description}
        />
      </div>
      <div
        className={cn('flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100', {
          hidden: anyDragging,
        })}
      >
        <Button variant="ghost" size="icon" onClick={() => onDuplicate(task)}>
          <Copy className="h-4 w-4" />
          <span className="sr-only">Duplicate</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </motion.div>
  )
}

export { TaskItem }
