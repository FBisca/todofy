import { Task } from '@repo/domain/model/task'

interface Props {
  tasks: Task[]
}
function TaskList({ tasks }: Props) {
  return <div>TaskList</div>
}

export { TaskList }
