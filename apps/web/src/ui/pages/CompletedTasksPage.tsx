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

function CompletedTasksPage({ t }: Props) {
  const { data: tasks, isLoading } = useQuery({
    queryKey: [QueryKeys.completedTasks],
    queryFn: async () => {
      const tasks = await taskService.getTasks({ completed: true, status: TaskStatus.ACTIVE })
      return tasks.sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0

        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      })
    },
  })

  return (
    <>
      <div className="mx-auto h-full w-full max-w-[800px] space-y-4">
        <PageTitle>{t.completedTasks.title}</PageTitle>
        <LoadingTaskList isLoading={isLoading}>
          <div className="space-y-4">
            <ReadOnlyTaskList tasks={tasks ?? []} t={t} />
          </div>
        </LoadingTaskList>
      </div>
    </>
  )
}

export default CompletedTasksPage
