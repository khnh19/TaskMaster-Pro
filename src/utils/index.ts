import dayjs from "dayjs";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

// Setup dayjs
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("en");

// Custom English locale settings
dayjs.updateLocale("en", {
  calendar: {
    lastDay: "[Yesterday]",
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    lastWeek: "dddd [last week]",
    nextWeek: "dddd [next week]",
    sameElse: "DD/MM/YYYY",
  },
});

export { dayjs };

// Utility functions
export const formatDate = (date: Date | string) => {
  return dayjs(date).format("DD/MM/YYYY");
};

export const formatDateTime = (date: Date | string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

export const formatRelativeTime = (date: Date | string) => {
  return dayjs(date).fromNow();
};

export const isOverdue = (dueDate: Date | string) => {
  return dayjs(dueDate).isBefore(dayjs());
};

export const isDueToday = (dueDate: Date | string) => {
  return dayjs(dueDate).isSame(dayjs(), "day");
};

export const getDaysUntilDue = (dueDate: Date | string) => {
  return dayjs(dueDate).diff(dayjs(), "day");
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
};

export const generateUniqueId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const getRandomColor = () => {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
