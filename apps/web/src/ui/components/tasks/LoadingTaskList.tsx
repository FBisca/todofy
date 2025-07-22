import { Skeleton } from '@repo/ui/components/skeleton'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  isLoading: boolean
  children: React.ReactNode
}

function LoadingTaskItem() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-5 w-[70%]" />
      <Skeleton className="h-4 w-[50%]" />
    </div>
  )
}

function LoadingTaskList({ isLoading, children }: Props) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key={'loading'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-4" data-testid="loading-task-list">
            {[...Array(3)].map((_, index) => (
              <LoadingTaskItem key={index} />
            ))}
          </div>
        </motion.div>
      )}
      {!isLoading && (
        <motion.div
          key={'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingTaskList
