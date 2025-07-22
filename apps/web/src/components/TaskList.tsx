'use client'

import { Dictionary } from '@/i18n'
import {
  closestCorners,
  DndContext,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@repo/domain/model/task'
import { Button } from '@repo/ui/components/button'
import { Checkbox } from '@repo/ui/components/checkbox'
import { Input } from '@repo/ui/components/input'
import { cn } from '@repo/ui/lib/utils'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

import { useCallback, useState } from 'react'

interface Props {
  tasks: Task[]
  t: Dictionary
  onCheckChange: (task: Task) => void
  onChange: (task: Task) => void
  onDelete: (task: Task) => void
  onMove: (from: Task, to: Task) => void
}

function TaskList({ tasks, onChange, onDelete, onCheckChange, onMove, t }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  const onDragOver = useCallback(
    (e: DragOverEvent) => {
      console.log('drag over')
      const activeData = e.active.data.current as Task
      const overData = e.over?.data.current as Task

      if (!activeData || !overData) return
      onMove(activeData, overData)
    },
    [onMove],
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={onDragOver}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <SortableContext items={tasks}>
        <div className="space-y-2">
          {tasks.map((e) => (
            <TaskItem
              t={t}
              key={e.id}
              task={e}
              onChange={onChange}
              onDelete={onDelete}
              onCheckChange={onCheckChange}
              anyDragging={isDragging}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

interface ItemProps {
  task: Task
  t: Dictionary
  anyDragging: boolean
  onCheckChange: (task: Task) => void
  onChange: (task: Task) => void
  onDelete: (task: Task) => void
}

function TaskItem({ task, anyDragging, onChange, onDelete, onCheckChange, t }: ItemProps) {
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
        <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </motion.div>
  )
}

export { TaskList }
