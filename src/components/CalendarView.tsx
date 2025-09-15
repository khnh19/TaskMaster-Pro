import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  Dialog,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/Task";
import { Priority, TaskStatus } from "../types/Task";
import dayjs, { Dayjs } from "dayjs";
import TaskForm from "./TaskForm";

const CalendarView: React.FC = () => {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Get first day of current month and calculate calendar grid
  const firstDayOfMonth = currentDate.startOf("month");
  const lastDayOfMonth = currentDate.endOf("month");
  const startCalendar = firstDayOfMonth.startOf("week");
  const endCalendar = lastDayOfMonth.endOf("week");

  // Generate calendar days
  const calendarDays: Dayjs[] = [];
  let day = startCalendar;
  while (day.isBefore(endCalendar) || day.isSame(endCalendar, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  // Get tasks for a specific date
  const getTasksForDate = (date: Dayjs): Task[] => {
    return tasks.filter(
      (task) => task.dueDate && dayjs(task.dueDate).isSame(date, "day")
    );
  };

  // Get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "#f44336";
      case Priority.HIGH:
        return "#ff9800";
      case Priority.MEDIUM:
        return "#2196f3";
      case Priority.LOW:
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  // Check if date is today
  const isToday = (date: Dayjs) => date.isSame(dayjs(), "day");

  // Check if date is in current month
  const isCurrentMonth = (date: Dayjs) => date.isSame(currentDate, "month");

  // Navigate months
  const previousMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const goToToday = () => setCurrentDate(dayjs());

  // Get task count by status for a date
  const getTaskCounts = (date: Dayjs) => {
    const dateTasks = getTasksForDate(date);
    const completed = dateTasks.filter(
      (t) => t.status === TaskStatus.COMPLETED
    ).length;
    const total = dateTasks.length;
    const overdue = dateTasks.filter(
      (t) =>
        dayjs(t.dueDate).isBefore(dayjs()) && t.status !== TaskStatus.COMPLETED
    ).length;

    return { completed, total, overdue };
  };

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <Box>
      {/* Calendar Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            {currentDate.format("MMMM YYYY")}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Today />} onClick={goToToday} size="small">
              Today
            </Button>
            <IconButton onClick={previousMonth}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={nextMonth}>
              <ChevronRight />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Calendar Grid */}
      <Card
        sx={{
          background:
            "linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(28, 33, 40, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(108, 92, 231, 0.2)",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Week Day Headers */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mb: 2,
            }}
          >
            {weekDays.map((day) => (
              <Typography
                key={day}
                variant="subtitle2"
                sx={{
                  textAlign: "center",
                  py: 1,
                  fontWeight: "bold",
                  color: "primary.main",
                  background:
                    "linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(0, 210, 211, 0.1) 100%)",
                  borderRadius: 1,
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {calendarDays.map((date, index) => {
              const dateTasks = getTasksForDate(date);
              const counts = getTaskCounts(date);
              const hasOverdue = counts.overdue > 0;

              return (
                <Paper
                  key={index}
                  sx={{
                    minHeight: 100,
                    p: 1,
                    cursor: "pointer",
                    background: !isCurrentMonth(date)
                      ? "linear-gradient(135deg, rgba(22, 27, 34, 0.3) 0%, rgba(28, 33, 40, 0.3) 100%)"
                      : isToday(date)
                      ? "linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(0, 210, 211, 0.2) 100%)"
                      : "linear-gradient(135deg, rgba(22, 27, 34, 0.6) 0%, rgba(28, 33, 40, 0.6) 100%)",
                    backdropFilter: "blur(10px)",
                    border: isToday(date) ? "2px solid" : "1px solid",
                    borderColor: isToday(date)
                      ? "#6C5CE7"
                      : hasOverdue
                      ? "#F85149"
                      : "rgba(108, 92, 231, 0.2)",
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(108, 92, 231, 0.15) 0%, rgba(0, 210, 211, 0.15) 100%)",
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(108, 92, 231, 0.2)",
                    },
                  }}
                  onClick={() => setSelectedDate(date)}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday(date) ? "bold" : "normal",
                      color: !isCurrentMonth(date)
                        ? "rgba(255, 255, 255, 0.3)"
                        : isToday(date)
                        ? "primary.main"
                        : "text.primary",
                      mb: 1,
                    }}
                  >
                    {date.format("D")}
                  </Typography>

                  {/* Task indicators */}
                  <Stack spacing={0.5}>
                    {dateTasks.slice(0, 3).map((task) => (
                      <Box
                        key={task.id}
                        sx={{
                          background:
                            task.priority === Priority.URGENT
                              ? "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)"
                              : task.priority === Priority.HIGH
                              ? "linear-gradient(135deg, #FFD93D 0%, #FFED4E 100%)"
                              : task.priority === Priority.MEDIUM
                              ? "linear-gradient(135deg, #42A5F5 0%, #5AB7F7 100%)"
                              : "linear-gradient(135deg, #6BCF7F 0%, #7ED491 100%)",
                          height: 4,
                          borderRadius: 2,
                          opacity:
                            task.status === TaskStatus.COMPLETED ? 0.5 : 1,
                        }}
                      />
                    ))}
                    {dateTasks.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{dateTasks.length - 3} more
                      </Typography>
                    )}
                  </Stack>

                  {/* Task count */}
                  {counts.total > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {counts.completed}/{counts.total}
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Selected Date Tasks Dialog */}
      <Dialog
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDate && (
          <>
            <Box
              sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {selectedDate.format("DD/MM/YYYY")} -{" "}
                  {selectedDate.format("dddd")}
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedDate(null);
                    setShowTaskForm(true);
                  }}
                  size="small"
                >
                  Thêm task
                </Button>
              </Stack>
            </Box>

            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              {getTasksForDate(selectedDate).length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No tasks for this day
                  </Typography>
                </Box>
              ) : (
                <List>
                  {getTasksForDate(selectedDate).map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  textDecoration:
                                    task.status === TaskStatus.COMPLETED
                                      ? "line-through"
                                      : "none",
                                  opacity:
                                    task.status === TaskStatus.COMPLETED
                                      ? 0.6
                                      : 1,
                                }}
                              >
                                {task.title}
                              </Typography>
                              <Chip
                                label={task.priority}
                                size="small"
                                sx={{
                                  backgroundColor: getPriorityColor(
                                    task.priority
                                  ),
                                  color: "white",
                                }}
                              />
                            </Stack>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {task.description}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {task.estimatedTime} phút • {task.category}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < getTasksForDate(selectedDate).length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          </>
        )}
      </Dialog>

      {/* Task Form Dialog */}
      <Dialog
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSave={() => setShowTaskForm(false)}
        />
      </Dialog>
    </Box>
  );
};

export default CalendarView;
