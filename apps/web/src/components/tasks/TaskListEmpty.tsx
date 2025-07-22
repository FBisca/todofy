import { Dictionary } from '@/i18n'
import { cn } from '@repo/ui/lib/utils'
import Image from 'next/image'

function TaskListEmpty({ className, t }: { className?: string; t: Dictionary }) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Image src="/empty.avif" alt="Empty state" width={100} height={100} className="size-[200px]" />
      <p className="text-foreground text-xl font-semibold">{t.taskList.empty.title}</p>
      <p className="text-muted-foreground text-sm">{t.taskList.empty.description}</p>
    </div>
  )
}

export { TaskListEmpty }
