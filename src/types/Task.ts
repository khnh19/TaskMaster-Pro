// Task data model for TaskMaster Pro app
export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  estimatedTime: number; // minutes
  actualTime?: number; // minutes
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
}

export const TaskCategory = {
  STUDY: "study",
  PROJECT: "project",
  PERSONAL: "personal",
  WORK: "work",
  OTHER: "other",
} as const;

export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory];
export type Priority = (typeof Priority)[keyof typeof Priority];
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// Analytics data
export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  totalTimeSpent: number;
  avgCompletionTime: number;
  productivityScore: number;
  categoryBreakdown: Record<TaskCategory, number>;
  priorityBreakdown: Record<Priority, number>;
}

// Filter and sort options
export interface TaskFilters {
  category?: TaskCategory;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string;
  searchTerm?: string;
}

export interface TaskSort {
  field: "dueDate" | "priority" | "createdAt" | "title";
  direction: "asc" | "desc";
}
