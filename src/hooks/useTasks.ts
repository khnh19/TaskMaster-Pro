import { useState, useEffect, useCallback } from "react";
import type { Task, TaskFilters, TaskSort } from "../types/Task";
import { TaskStorage } from "../services/TaskStorage";
import { Priority, TaskStatus } from "../types/Task";
import dayjs from "dayjs";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sort, setSort] = useState<TaskSort>({
    field: "dueDate",
    direction: "asc",
  });

  // Load tasks from storage
  const loadTasks = useCallback(() => {
    setLoading(true);
    try {
      const storedTasks = TaskStorage.getAllTasks();
      setTasks(storedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create new task
  const createTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      TaskStorage.saveTask(newTask);
      loadTasks();
      return newTask;
    },
    [loadTasks]
  );

  // Update existing task
  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      const existingTask = TaskStorage.getTaskById(taskId);
      if (!existingTask) return null;

      const updatedTask: Task = {
        ...existingTask,
        ...updates,
        id: taskId,
        updatedAt: new Date(),
      };

      // If marking as completed, set completion time
      if (
        updates.status === TaskStatus.COMPLETED &&
        existingTask.status !== TaskStatus.COMPLETED
      ) {
        updatedTask.completedAt = new Date();
      }

      TaskStorage.saveTask(updatedTask);
      loadTasks();
      return updatedTask;
    },
    [loadTasks]
  );

  // Delete task
  const deleteTask = useCallback(
    (taskId: string) => {
      TaskStorage.deleteTask(taskId);
      loadTasks();
    },
    [loadTasks]
  );

  // Get filtered and sorted tasks
  const getFilteredTasks = useCallback(() => {
    let filteredTasks = [...tasks];

    // Apply filters
    if (filters.category) {
      filteredTasks = filteredTasks.filter(
        (task) => task.category === filters.category
      );
    }
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filters.priority
      );
    }
    if (filters.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    if (filters.dueDate) {
      const filterDate = dayjs(filters.dueDate).format("YYYY-MM-DD");
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.dueDate &&
          dayjs(task.dueDate).format("YYYY-MM-DD") === filterDate
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case "dueDate":
          aValue = a.dueDate ? a.dueDate.getTime() : Infinity;
          bValue = b.dueDate ? b.dueDate.getTime() : Infinity;
          break;
        case "priority":
          const priorityOrder = {
            [Priority.URGENT]: 4,
            [Priority.HIGH]: 3,
            [Priority.MEDIUM]: 2,
            [Priority.LOW]: 1,
          };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sort.direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredTasks;
  }, [tasks, filters, sort]);

  // Get task statistics
  const getTaskStats = useCallback(() => {
    const now = dayjs();
    const overdueTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        dayjs(task.dueDate).isBefore(now) &&
        task.status !== TaskStatus.COMPLETED
    ).length;

    const dueTodayTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        dayjs(task.dueDate).isSame(now, "day") &&
        task.status !== TaskStatus.COMPLETED
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    ).length;
    const totalTasks = tasks.length;

    return {
      total: totalTasks,
      completed: completedTasks,
      overdue: overdueTasks,
      dueToday: dueTodayTasks,
      inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)
        .length,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }, [tasks]);

  // Generate sample data
  const generateSampleData = useCallback(() => {
    TaskStorage.generateSampleData();
    loadTasks();
  }, [loadTasks]);

  // Clear all data
  const clearAllData = useCallback(() => {
    TaskStorage.clearAllData();
    setTasks([]);
  }, []);

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    loading,
    filters,
    sort,
    stats: getTaskStats(),

    // Actions
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    setSort,
    loadTasks,
    generateSampleData,
    clearAllData,
  };
};
