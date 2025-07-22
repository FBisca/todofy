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
import { SortableContext } from '@dnd-kit/sortable'
import { Task } from '@repo/domain/model/task'
import { cn } from '@repo/ui/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  t: Dictionary
  onCheckChange: (task: Task) => void
  onChange: (task: Task) => void
  onDelete: (task: Task) => void
  onDuplicate: (task: Task) => void
  onMove: (from: Task, to: Task) => void
}

function TaskList({ tasks, onChange, onDelete, onCheckChange, onMove, onDuplicate, t }: Props) {
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

  if (tasks.length === 0) {
    return <TaskListEmpty t={t} />
  }

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
          <AnimatePresence mode="popLayout">
            {tasks.map((e) => (
              <motion.div
                key={e.id}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-10%' }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem
                  t={t}
                  task={e}
                  onDuplicate={onDuplicate}
                  onChange={onChange}
                  onDelete={onDelete}
                  onCheckChange={onCheckChange}
                  anyDragging={isDragging}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  )
}

function TaskListEmpty({ className, t }: { className?: string; t: Dictionary }) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Image src="/empty.avif" alt="Empty state" width={100} height={100} className="size-[200px]" />
      <p className="text-foreground text-xl font-semibold">{t.taskList.empty.title}</p>
      <p className="text-muted-foreground text-sm">{t.taskList.empty.description}</p>
    </div>
  )
}

export { TaskList }
