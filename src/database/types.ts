interface Task {
    title: string;
    id: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    completedAt: string;
    dueDate: string;
    priority: string;
    category: string;
    tags: string[];
    notes: string;
}

interface Subtask {
    title: string;
    id: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    completedAt: string;
    dueDate: string;
    priority: string;
    category: string;
    tags: string[];
    notes: string;
    taskId: string;
}
