'use client'

import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, listItemVariants, modalVariants, hoverScale, tapScale } from '@/utils/animations'
import supabase from '@/lib/supabase'
import { useSession } from '@/components/SessionProvider'

export default function TasksPage() {
  const { colorScheme } = useTheme()
  const [tasks, setTasks] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const modalRef = useRef<HTMLDialogElement>(null)

  const session = useSession();
  const user = session.user;

  const [newTask, setNewTask] = useState<any>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  })


  const loadTasks = async () => {
    setIsLoading(true)

    const { data: tasks, error } = await supabase.from('tasks').select('*').eq('user_id', user?.id);
    setTasks(tasks);

    setIsLoading(false)

  }


  // Simulate loading tasks (replace with Supabase later)
  useEffect(() => {
    loadTasks()
  }, [])

  const handleAddTask = async (task: any) => {
    if (!newTask.title) return
    await supabase.from('tasks').insert(task);

    loadTasks();
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await supabase.from('tasks').update({
      status: newStatus,
    }).eq('id', taskId)

    loadTasks();
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return colorScheme.muted
      case 'in-progress':
        return colorScheme.primary
      case 'completed':
        return colorScheme.secondary
      default:
        return colorScheme.muted
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colorScheme.primary }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: colorScheme.textOnBackground }}
        >
          Tasks
        </h1>
        <motion.button
          onClick={() => modalRef.current?.showModal()}
          className="px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.textOnPrimary
          }}
          whileHover={hoverScale}
          whileTap={tapScale}
        >
          Add New Task
        </motion.button>
      </div>

      {/* Task Lists */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Todo */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: colorScheme.background }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colorScheme.textOnBackground }}
          >
            To Do
          </h2>
          <AnimatePresence mode="popLayout">
            <motion.div className="space-y-4">
              {tasks
                .filter((task: { status: string }) => task.status === 'todo')
                .map((task: any) => (
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Due: {task.dueDate}</span>
                      <motion.button
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        className="px-2 py-1 rounded transition-colors"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: colorScheme.textOnPrimary
                        }}
                        whileHover={hoverScale}
                        whileTap={tapScale}
                      >
                        Start
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* In Progress */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: colorScheme.background }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colorScheme.textOnBackground }}
          >
            In Progress
          </h2>
          <AnimatePresence mode="popLayout">
            <motion.div className="space-y-4">
              {tasks
                .filter((task: { status: string }) => task.status === 'in-progress')
                .map((task: any) => (
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Due: {task.dueDate}</span>
                      <motion.button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="px-2 py-1 rounded transition-colors"
                        style={{
                          backgroundColor: colorScheme.secondary,
                          color: colorScheme.textOnSecondary
                        }}
                        whileHover={hoverScale}
                        whileTap={tapScale}
                      >
                        Complete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Completed */}
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: colorScheme.background }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colorScheme.textOnBackground }}
          >
            Completed
          </h2>
          <AnimatePresence mode="popLayout">
            <motion.div className="space-y-4">
              {tasks
                .filter((task: { status: string }) => task.status === 'completed')
                .map((task: any) => (
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{task.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Due: {task.dueDate}</span>
                      <motion.button
                        onClick={() => handleStatusChange(task.id, 'todo')}
                        className="px-2 py-1 rounded transition-colors"
                        style={{
                          backgroundColor: colorScheme.muted,
                          color: colorScheme.textOnMuted
                        }}
                        whileHover={hoverScale}
                        whileTap={tapScale}
                      >
                        Reopen
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* New Task Modal */}
      <dialog ref={modalRef} className="modal">
        <motion.div
          className="p-6 rounded-lg"
          style={{ backgroundColor: colorScheme.background }}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: colorScheme.textOnBackground }}
          >
            Add New Task
          </h2>
          <div className="space-y-4">
            <div>
              <label
                className="block mb-2"
                style={{ color: colorScheme.textOnBackground }}
              >
                Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 rounded"
                style={{
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted,
                  border: 'none'
                }}
              />
            </div>
            <div>
              <label
                className="block mb-2"
                style={{ color: colorScheme.textOnBackground }}
              >
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 rounded"
                style={{
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted,
                  border: 'none'
                }}
              />
            </div>
            <div>
              <label
                className="block mb-2"
                style={{ color: colorScheme.textOnBackground }}
              >
                Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full p-2 rounded"
                style={{
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted,
                  border: 'none'
                }}
              />
            </div>
            <div>
              <label
                className="block mb-2"
                style={{ color: colorScheme.textOnBackground }}
              >
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                className="w-full p-2 rounded"
                style={{
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted,
                  border: 'none'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <motion.button
                onClick={() => modalRef.current?.close()}
                className="px-4 py-2 rounded transition-colors"
                style={{
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted
                }}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={() => {
                  handleAddTask(
                    {
                      title: newTask.title,
                      description: newTask.description,
                      user_id: user?.id,
                      priority: newTask.priority,
                      due: newTask.due.toString(),
                    }
                  )
                  modalRef.current?.close()
                }}
                className="px-4 py-2 rounded transition-colors"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.textOnPrimary
                }}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                Add Task
              </motion.button>
            </div>
          </div>
        </motion.div>
      </dialog>
    </div>
  )
} 