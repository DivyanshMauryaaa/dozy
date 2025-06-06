'use client'

import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, listItemVariants, modalVariants, hoverScale, tapScale } from '@/utils/animations'
import supabase from '@/lib/supabase'
import { useSession } from '@/components/SessionProvider'
import { Trash2 } from 'lucide-react'

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
    status: 'todo',
    tags: [],
  })

  const [showFields, setShowFields] = useState({
    description: false,
    dueDate: false,
    priority: false,
    tags: false,
  })

  const [tagInput, setTagInput] = useState('')

  const toggleField = (field: keyof typeof showFields) => {
    setShowFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const loadTasks = async () => {
    setIsLoading(true)

    const { data: tasks, error } = await supabase.from('tasks').select('*').eq('user_id', user?.id);
    setTasks(tasks);

    setIsLoading(false)

  }

  // Simulate loading tasks (replace with Supabase later)
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const handleAddTag = () => {
    if (tagInput.trim() && !newTask.tags.includes(tagInput.trim())) {
      setNewTask((prev: typeof newTask) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask((prev: typeof newTask) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }))
  }

  const handleAddTask = async (task: any) => {
    try {
      if (!newTask.title) return
      const { error } = await supabase.from('tasks').insert(task);

      if (error) {
        console.error('Error adding task:', error)
        throw new Error(error.message)
      }

      loadTasks();
      // Reset form
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'todo',
        tags: [],
      })
      setShowFields({
        description: false,
        dueDate: false,
        priority: false,
        tags: false,
      })
    } catch (error) {
      console.error('Error in handleAddTask:', error)
      // You might want to show this error to the user using a toast or alert
      alert(error instanceof Error ? error.message : 'Failed to add task')
    }
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
                    <motion.button
                      onClick={async () => {
                        await supabase.from('tasks').delete().eq('id', task.id);
                        loadTasks();
                      }}
                      className="transition-colors cursor-pointer"
                      style={{
                        color: 'red'
                      }}
                      whileHover={hoverScale}
                      whileTap={tapScale}
                    >
                      <Trash2 size={16}/>
                    </motion.button>

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
          className="p-6 rounded-lg max-w-md mx-auto"
          style={{ backgroundColor: colorScheme.background }}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h2
            className="text-xl font-bold mb-4 text-center"
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
                Title *
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
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={() => toggleField('description')}
                className="flex items-center space-x-2 text-sm"
                style={{ color: colorScheme.textOnBackground }}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                <span>{showFields.description ? 'Remove Description' : 'Add Description'}</span>
                <span>{showFields.description ? '−' : '+'}</span>
              </motion.button>

              {showFields.description && (
                <div>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full p-2 rounded"
                    style={{
                      backgroundColor: colorScheme.muted,
                      color: colorScheme.textOnMuted,
                      border: 'none'
                    }}
                    placeholder="Enter task description"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={() => toggleField('dueDate')}
                className="flex items-center space-x-2 text-sm"
                style={{ color: colorScheme.textOnBackground }}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                <span>{showFields.dueDate ? 'Remove Due Date' : 'Add Due Date'}</span>
                <span>{showFields.dueDate ? '−' : '+'}</span>
              </motion.button>

              {showFields.dueDate && (
                <div>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value.toString() })}
                    className="w-full p-2 rounded"
                    style={{
                      backgroundColor: colorScheme.muted,
                      color: colorScheme.textOnMuted,
                      border: 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={() => toggleField('priority')}
                className="flex items-center space-x-2 text-sm"
                style={{ color: colorScheme.textOnBackground }}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                <span>{showFields.priority ? 'Remove Priority' : 'Add Priority'}</span>
                <span>{showFields.priority ? '−' : '+'}</span>
              </motion.button>

              {showFields.priority && (
                <div>
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
              )}
            </div>

            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={() => toggleField('tags')}
                className="flex items-center space-x-2 text-sm"
                style={{ color: colorScheme.textOnBackground }}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                <span>{showFields.tags ? 'Remove Tags' : 'Add Tags'}</span>
                <span>{showFields.tags ? '−' : '+'}</span>
              </motion.button>

              {showFields.tags && (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      className="flex-1 p-2 rounded"
                      style={{
                        backgroundColor: colorScheme.muted,
                        color: colorScheme.textOnMuted,
                        border: 'none'
                      }}
                      placeholder="Enter tag and press Enter"
                    />
                    <motion.button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 rounded"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.textOnPrimary
                      }}
                      whileHover={hoverScale}
                      whileTap={tapScale}
                    >
                      Add
                    </motion.button>
                  </div>

                  {newTask.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newTask.tags.map((tag: string) => (
                        <motion.div
                          key={tag}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: colorScheme.primary,
                            color: colorScheme.textOnPrimary
                          }}
                          whileHover={hoverScale}
                          whileTap={tapScale}
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-200"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-2">
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
                      description: newTask.description || "",
                      user_id: user?.id,
                      priority: newTask.priority || "medium",
                      due: newTask.dueDate || null,
                      status: newTask.status || "todo",
                      tags: newTask.tags || [],
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
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