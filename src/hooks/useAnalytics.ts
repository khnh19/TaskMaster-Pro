import { useState, useEffect, useCallback } from "react";
import type { TaskAnalytics } from "../types/Task";
import { TaskStorage } from "../services/TaskStorage";

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(() => {
    setLoading(true);
    try {
      const data = TaskStorage.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();

    // Listen for storage changes to update analytics
    const handleStorageChange = () => {
      loadAnalytics();
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for when tasks are updated within the same tab
    window.addEventListener("tasksUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tasksUpdated", handleStorageChange);
    };
  }, [loadAnalytics]);

  return {
    analytics,
    loading,
    refresh: loadAnalytics,
  };
};
