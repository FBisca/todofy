'use client'

import { Dictionary } from '@/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { Task, TaskStatus } from '@repo/domain/model/task'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { cn } from '@repo/ui/lib/utils'
import { SendHorizonal, X } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  className?: string
  t: Dictionary
  onAdd: (task: Task) => void
  onCancel: () => void
}

function AddTask({ className, t, onCancel, onAdd }: Props) {
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().min(1).max(100),
      }),
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = () => {
    const { name, description } = getValues()
    reset()

    onAdd({ id: crypto.randomUUID(), name, description, completed: false, status: TaskStatus.ACTIVE })
  }

  return (
    <div className={cn('border-border rounded-lg border p-0', className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-2 py-1">
          <Input
            variant="ghost"
            size="sm"
            autoFocus
            placeholder={t.addTask.title}
            className="placeholder:text-muted-foreground/70 font-semibold"
            {...register('name')}
          />
          <Input
            variant="ghost"
            size="sm"
            placeholder={t.addTask.description}
            className="placeholder:text-muted-foreground/70"
            {...register('description')}
          />
        </div>
        <div className="border-border flex justify-end gap-3 border-t px-3 py-2">
          <Button variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4 md:hidden" />
            <span className="hidden md:block">{t.addTask.cancel}</span>
          </Button>
          <Button disabled={!isValid} type="submit">
            <SendHorizonal className="h-4 w-4 md:hidden" />
            <span className="hidden md:block">{t.addTask.add}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

export { AddTask }
