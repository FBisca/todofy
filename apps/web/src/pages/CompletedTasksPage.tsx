'use client'

import { Dictionary } from '@/i18n'
import { PageTitle } from '@repo/ui/components/page-title'

interface Props {
  t: Dictionary
}

function CompletedTasksPage({ t }: Props) {
  return (
    <>
      <div className="mx-auto h-full w-full max-w-[800px] space-y-4">
        <PageTitle>{t.completedTasks.title}</PageTitle>
      </div>
    </>
  )
}

export { CompletedTasksPage }
