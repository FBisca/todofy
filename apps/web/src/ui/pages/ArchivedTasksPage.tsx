'use client'

import { Dictionary } from '@/i18n'
import { taskService } from '@/lib/services/task-service'
import { QueryKeys } from '@/lib/utils/query-keys'
import { TaskStatus } from '@repo/domain/model/task'
import { PageTitle } from '@repo/ui/components/page-title'
import { useQuery } from '@tanstack/react-query'
import LoadingTaskList from '../components/tasks/LoadingTaskList'
import { ReadOnlyTaskList } from '../components/tasks/ReadOnlyTaskList'

interface Props {
  t: Dictionary
}

function ArchivedTasksPage({ t }: Props) {
  const { data: tasks, isLoading } = useQuery({
    queryKey: [QueryKeys.archivedTasks],
    queryFn: () => taskService.getTasks({ status: TaskStatus.ARCHIVED }),
  })
  return (
    <>
      <div className="mx-auto h-full w-full max-w-[800px] space-y-4">
        <PageTitle>{t.archivedTasks.title}</PageTitle>
        <LoadingTaskList isLoading={isLoading}>
          <div className="space-y-4">
            <ReadOnlyTaskList tasks={tasks ?? []} t={t} />
          </div>
        </LoadingTaskList>
      </div>
    </>
  )
}

export default ArchivedTasksPage
