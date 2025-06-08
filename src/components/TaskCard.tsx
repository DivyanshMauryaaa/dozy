import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { hoverScale, tapScale, listItemVariants } from '@/utils/animations'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    priority: string
    due_date: string
    tags: string[]
    status: 'todo' | 'in-progress' | 'completed'
  }
  colorScheme: any
  onDelete: (id: string) => Promise<void>
  onStatusChange: (id: string, status: string) => Promise<void>
  getPriorityColor: (priority: string) => string
}

export function TaskCard({
  task,
  colorScheme,
  onDelete,
  onStatusChange,
  getPriorityColor
}: TaskCardProps) {
  const getActionButton = () => {
    switch (task.status) {
      case 'todo':
        return (
          <motion.button
            onClick={() => onStatusChange(task.id, 'in-progress')}
            className="px-2 py-1 rounded transition-colors cursor-pointer"
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.textOnPrimary
            }}
            whileHover={hoverScale}
            whileTap={tapScale}
          >
            Start
          </motion.button>
        )
      case 'in-progress':
        return (
          <motion.button
            onClick={() => onStatusChange(task.id, 'completed')}
            className="px-2 py-1 rounded transition-colors cursor-pointer"
            style={{
              backgroundColor: colorScheme.secondary,
              color: colorScheme.textOnSecondary
            }}
            whileHover={hoverScale}
            whileTap={tapScale}
          >
            Complete
          </motion.button>
        )
      case 'completed':
        return (
          <motion.button
            onClick={() => onStatusChange(task.id, 'todo')}
            className="px-2 py-1 rounded transition-colors cursor-pointer"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.textOnMuted
            }}
            whileHover={hoverScale}
            whileTap={tapScale}
          >
            Reopen
          </motion.button>
        )
    }
  }

  return (
    <motion.div
      key={task.id}
      className="p-4 rounded-lg transition-colors"
      style={{
        backgroundColor: colorScheme.muted,
        color: colorScheme.textOnMuted
      }}
      variants={listItemVariants}
      layout
      whileHover={hoverScale}
      whileTap={tapScale}
    >
      <motion.button
        onClick={() => onDelete(task.id)}
        className="transition-colors cursor-pointer"
        style={{
          color: 'red'
        }}
        whileHover={hoverScale}
        whileTap={tapScale}
      >
        <Trash2 size={16} />
      </motion.button>

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-lg font-bold">{task.title}</h3>
        <span className={getPriorityColor(task.priority)}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm mb-2">{task.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
        {getActionButton()}
      </div>
      {task.tags.map((tag: string) => (
        <span 
          key={tag} 
          className="mr-1 px-2 py-1 rounded-full text-xs" 
          style={{ 
            backgroundColor: colorScheme.primary, 
            color: colorScheme.textOnPrimary 
          }}
        >
          {tag}
        </span>
      ))}
    </motion.div>
  )
}