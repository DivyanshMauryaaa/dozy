'use client'

import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
}

export default function TasksPage() {
  const { colorScheme } = useTheme()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the project including setup instructions and API references.',
      dueDate: '2024-03-20',
      priority: 'high',
      status: 'todo'
    },
    {
      id: '2',
      title: 'Review Code Changes',
      description: 'Review and approve pending pull requests from team members.',
      dueDate: '2024-03-18',
      priority: 'medium',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Update Dependencies',
      description: 'Update project dependencies to their latest stable versions.',
      dueDate: '2024-03-15',
      priority: 'low',
      status: 'completed'
    }
  ])

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  })

  const handleAddTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      description: newTask.description || '',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority || 'medium',
      status: 'todo'
    }

    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo'
    })
  }

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
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

  const getStatusColor = (status: Task['status']) => {
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
        <button
          onClick={() => document.getElementById('new-task-modal')?.showModal()}
          className="px-4 py-2 rounded-md transition-colors"
          style={{ 
            backgroundColor: colorScheme.primary,
            color: colorScheme.textOnPrimary
          }}
        >
          Add New Task
        </button>
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="space-y-4">
            {tasks
              .filter(task => task.status === 'todo')
              .map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: colorScheme.muted,
                    color: colorScheme.textOnMuted
                  }}
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
                    <button
                      onClick={() => handleStatusChange(task.id, 'in-progress')}
                      className="px-2 py-1 rounded transition-colors"
                      style={{ 
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.textOnPrimary
                      }}
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
          </div>
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
          <div className="space-y-4">
            {tasks
              .filter(task => task.status === 'in-progress')
              .map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: colorScheme.muted,
                    color: colorScheme.textOnMuted
                  }}
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
                    <button
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      className="px-2 py-1 rounded transition-colors"
                      style={{ 
                        backgroundColor: colorScheme.secondary,
                        color: colorScheme.textOnSecondary
                      }}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
          </div>
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
          <div className="space-y-4">
            {tasks
              .filter(task => task.status === 'completed')
              .map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: colorScheme.muted,
                    color: colorScheme.textOnMuted
                  }}
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
                    <button
                      onClick={() => handleStatusChange(task.id, 'todo')}
                      className="px-2 py-1 rounded transition-colors"
                      style={{ 
                        backgroundColor: colorScheme.muted,
                        color: colorScheme.textOnMuted
                      }}
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      <dialog id="new-task-modal" className="p-6 rounded-lg backdrop:bg-black/50">
        <div 
          className="p-6 rounded-lg"
          style={{ backgroundColor: colorScheme.background }}
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
              <button
                onClick={() => document.getElementById('new-task-modal')?.close()}
                className="px-4 py-2 rounded transition-colors"
                style={{ 
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddTask()
                  document.getElementById('new-task-modal')?.close()
                }}
                className="px-4 py-2 rounded transition-colors"
                style={{ 
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.textOnPrimary
                }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  )
} 