import type { Task, TaskAnalytics } from "../types/Task";
import { TaskCategory, Priority, TaskStatus } from "../types/Task";

const STORAGE_KEY = "taskmaster_tasks";
const ANALYTICS_KEY = "taskmaster_analytics";
const POMODORO_KEY = "taskmaster_pomodoro_sessions";

export class TaskStorage {
  // Task CRUD operations
  static getAllTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const tasks = JSON.parse(data);
      // Convert string dates back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  }

  static saveTask(task: Task): void {
    try {
      const tasks = this.getAllTasks();
      const existingIndex = tasks.findIndex((t) => t.id === task.id);

      if (existingIndex >= 0) {
        tasks[existingIndex] = { ...task, updatedAt: new Date() };
      } else {
        tasks.push(task);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      this.updateAnalytics();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }

  static deleteTask(taskId: string): void {
    try {
      const tasks = this.getAllTasks();
      const filteredTasks = tasks.filter((t) => t.id !== taskId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
      this.updateAnalytics();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  static getTaskById(taskId: string): Task | undefined {
    const tasks = this.getAllTasks();
    return tasks.find((t) => t.id === taskId);
  }

  // Analytics
  static calculateAnalytics(): TaskAnalytics {
    const tasks = this.getAllTasks();
    const completedTasks = tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED
    );

    const totalTimeSpent = completedTasks.reduce(
      (sum, task) => sum + (task.actualTime || task.estimatedTime),
      0
    );

    const avgCompletionTime =
      completedTasks.length > 0 ? totalTimeSpent / completedTasks.length : 0;

    // Calculate productivity score (completed vs estimated time efficiency)
    const productivityScore =
      completedTasks.length > 0
        ? (completedTasks.reduce((sum, task) => {
            if (task.actualTime && task.estimatedTime > 0) {
              return sum + Math.min(task.estimatedTime / task.actualTime, 2); // Cap at 2x efficiency
            }
            return sum + 1;
          }, 0) /
            completedTasks.length) *
          50 // Scale to 0-100
        : 50;

    const categoryBreakdown = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<TaskCategory, number>);

    const priorityBreakdown = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<Priority, number>);

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalTimeSpent,
      avgCompletionTime,
      productivityScore,
      categoryBreakdown,
      priorityBreakdown,
    };
  }

  private static updateAnalytics(): void {
    try {
      const analytics = this.calculateAnalytics();
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error("Error updating analytics:", error);
    }
  }

  static getAnalytics(): TaskAnalytics {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    return this.calculateAnalytics();
  }

  // Utility methods
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ANALYTICS_KEY);
  }

  static exportData(): string {
    const tasks = this.getAllTasks();
    const analytics = this.getAnalytics();
    return JSON.stringify({ tasks, analytics }, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.tasks && Array.isArray(data.tasks)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.tasks));
        this.updateAnalytics();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  // Generate sample data for testing
  static generateSampleData(): void {
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Hoàn thành bài tập Toán cao cấp",
        description: "Bài tập chương 3: Tích phân và ứng dụng",
        category: TaskCategory.STUDY,
        priority: Priority.HIGH,
        status: TaskStatus.TODO,
        estimatedTime: 120,
        createdAt: new Date("2024-09-10"),
        updatedAt: new Date("2024-09-10"),
        dueDate: new Date("2024-09-16"),
        tags: ["toán", "bài tập", "deadline"],
      },
      {
        id: "2",
        title: "Làm project cuối kỳ - Web Development",
        description: "Xây dựng ứng dụng quản lý sinh viên với React và Node.js",
        category: TaskCategory.PROJECT,
        priority: Priority.URGENT,
        status: TaskStatus.IN_PROGRESS,
        estimatedTime: 600,
        actualTime: 300,
        createdAt: new Date("2024-09-05"),
        updatedAt: new Date("2024-09-12"),
        dueDate: new Date("2024-09-20"),
        tags: ["web", "react", "nodejs", "project"],
      },
      {
        id: "3",
        title: "Ca làm part-time tại quán cafe",
        description: "Shift 14:00 - 18:00",
        category: TaskCategory.WORK,
        priority: Priority.MEDIUM,
        status: TaskStatus.COMPLETED,
        estimatedTime: 240,
        actualTime: 240,
        createdAt: new Date("2024-09-13"),
        updatedAt: new Date("2024-09-13"),
        completedAt: new Date("2024-09-13"),
        tags: ["part-time", "cafe"],
      },
      {
        id: "4",
        title: "Đọc tài liệu CNPM",
        description: "Chương 5: Testing và Quality Assurance",
        category: TaskCategory.STUDY,
        priority: Priority.MEDIUM,
        status: TaskStatus.TODO,
        estimatedTime: 90,
        createdAt: new Date("2024-09-12"),
        updatedAt: new Date("2024-09-12"),
        dueDate: new Date("2024-09-18"),
        tags: ["cnpm", "testing", "đọc"],
      },
      {
        id: "5",
        title: "Mua sắm đồ dùng học tập",
        description: "Mua vở, bút, thước kẻ cho học kỳ mới",
        category: TaskCategory.PERSONAL,
        priority: Priority.LOW,
        status: TaskStatus.TODO,
        estimatedTime: 60,
        createdAt: new Date("2024-09-14"),
        updatedAt: new Date("2024-09-14"),
        tags: ["mua sắm", "học tập"],
      },
    ];

    sampleTasks.forEach((task) => this.saveTask(task));
  }

  // Pomodoro session methods
  static savePomodoroSession(session: any) {
    const sessions = TaskStorage.getPomodoroSessions();
    sessions.push(session);
    localStorage.setItem(POMODORO_KEY, JSON.stringify(sessions));
  }

  static getPomodoroSessions() {
    const stored = localStorage.getItem(POMODORO_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getTodaysPomodoroStats() {
    const sessions = TaskStorage.getPomodoroSessions();
    const today = new Date().toDateString();

    const todaySessions = sessions.filter(
      (session: any) => new Date(session.completedAt).toDateString() === today
    );

    const workSessions = todaySessions.filter(
      (session: any) => session.phase === "WORK"
    );
    const totalFocusTime = workSessions.reduce(
      (total: number, session: any) => total + session.duration / 60,
      0
    );

    return {
      completedSessions: workSessions.length,
      totalFocusTime: Math.round(totalFocusTime),
      totalSessions: todaySessions.length,
    };
  }
}
