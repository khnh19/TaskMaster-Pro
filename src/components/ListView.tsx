import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  Fab,
  Dialog,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/Task";
import { TaskCategory, Priority, TaskStatus } from "../types/Task";
import dayjs from "dayjs";
import TaskForm from "./TaskForm";

const ListView: React.FC = () => {
  const { tasks, stats, updateTask, deleteTask, filters, setFilters } =
    useTasks();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Labels mapping
  const PriorityLabels = {
    [Priority.URGENT]: "Urgent",
    [Priority.HIGH]: "High",
    [Priority.MEDIUM]: "Medium",
    [Priority.LOW]: "Low",
  };

  const StatusLabels = {
    [TaskStatus.TODO]: "To Do",
    [TaskStatus.IN_PROGRESS]: "In Progress",
    [TaskStatus.COMPLETED]: "Completed",
    [TaskStatus.CANCELLED]: "Cancelled",
  };

  const CategoryLabels = {
    [TaskCategory.STUDY]: "Study",
    [TaskCategory.PROJECT]: "Project",
    [TaskCategory.PERSONAL]: "Personal",
    [TaskCategory.WORK]: "Work",
    [TaskCategory.OTHER]: "Other",
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleTaskAction = (action: string, task: Task) => {
    if (action === "edit") {
      setEditingTask(task);
      setIsTaskFormOpen(true);
    } else if (action === "delete") {
      deleteTask(task.id);
    } else if (action === "start") {
      updateTask(task.id, { status: TaskStatus.IN_PROGRESS });
    } else if (action === "complete") {
      updateTask(task.id, { status: TaskStatus.COMPLETED });
    }
    handleMenuClose();
  };

  const isOverdue = (task: Task) => {
    return (
      task.dueDate &&
      dayjs(task.dueDate).isBefore(dayjs()) &&
      task.status !== TaskStatus.COMPLETED
    );
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 4,
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(0, 210, 211, 0.1) 100%)",
          borderRadius: 3,
          p: 4,
          border: "1px solid rgba(108, 92, 231, 0.2)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(108, 92, 231, 0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #F0F6FC 0%, #A29BFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Task Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Efficiently manage your study and personal tasks
        </Typography>

        {/* Quick Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "error.main" }}
            >
              {stats.overdue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              {stats.dueToday}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due Today
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Card
        sx={{
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(28, 33, 40, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(108, 92, 231, 0.2)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              placeholder="Search tasks..."
              value={filters.searchTerm || ""}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              size="medium"
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(13, 17, 23, 0.6)",
                  "&:hover": {
                    background: "rgba(13, 17, 23, 0.8)",
                  },
                  "&.Mui-focused": {
                    background: "rgba(13, 17, 23, 1)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                minWidth: 120,
                background: showFilters
                  ? "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)"
                  : "transparent",
                "&:hover": {
                  background: showFilters
                    ? "linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)"
                    : "rgba(108, 92, 231, 0.08)",
                },
              }}
            >
              Filters
            </Button>
          </Stack>

          {showFilters && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
                mt: 1,
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value as TaskCategory,
                    })
                  }
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={TaskCategory.STUDY}>Study</MenuItem>
                  <MenuItem value={TaskCategory.PROJECT}>Project</MenuItem>
                  <MenuItem value={TaskCategory.PERSONAL}>Personal</MenuItem>
                  <MenuItem value={TaskCategory.WORK}>Work</MenuItem>
                  <MenuItem value={TaskCategory.OTHER}>Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value as TaskStatus,
                    })
                  }
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
                  <MenuItem value={TaskStatus.IN_PROGRESS}>
                    In Progress
                  </MenuItem>
                  <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priority: e.target.value as Priority,
                    })
                  }
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={Priority.URGENT}>Urgent</MenuItem>
                  <MenuItem value={Priority.HIGH}>High</MenuItem>
                  <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={Priority.LOW}>Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Task List */}
      <Stack spacing={3}>
        {tasks.length === 0 ? (
          <Card
            sx={{
              textAlign: "center",
              p: 6,
              background:
                "linear-gradient(135deg, rgba(108, 92, 231, 0.05) 0%, rgba(0, 210, 211, 0.05) 100%)",
              border: "2px dashed rgba(108, 92, 231, 0.3)",
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first task to start managing your time effectively!
            </Typography>
          </Card>
        ) : (
          tasks.map((task, index) => (
            <Card
              key={task.id}
              sx={{
                position: "relative",
                background:
                  "linear-gradient(135deg, rgba(22, 27, 34, 0.8) 0%, rgba(28, 33, 40, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                border: isOverdue(task)
                  ? "2px solid rgba(248, 81, 73, 0.5)"
                  : "1px solid rgba(108, 92, 231, 0.2)",
                borderRadius: 2,
                opacity: task.status === TaskStatus.COMPLETED ? 0.8 : 1,
                transform:
                  task.status === TaskStatus.COMPLETED
                    ? "scale(0.98)"
                    : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
                "&:hover": {
                  transform:
                    task.status === TaskStatus.COMPLETED
                      ? "scale(0.99)"
                      : "scale(1.02)",
                  borderColor: "primary.main",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(108, 92, 231, 0.3)",
                },
                "&::before": isOverdue(task)
                  ? {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #F85149 0%, #FF6B6B 100%)",
                      borderRadius: "16px 16px 0 0",
                    }
                  : {},
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration:
                          task.status === TaskStatus.COMPLETED
                            ? "line-through"
                            : "none",
                        color:
                          task.status === TaskStatus.COMPLETED
                            ? "text.secondary"
                            : "text.primary",
                        fontWeight: 600,
                        mb: 1,
                        background:
                          task.status === TaskStatus.COMPLETED
                            ? "none"
                            : "linear-gradient(135deg, #6C5CE7 0%, #00D2D3 100%)",
                        backgroundClip:
                          task.status === TaskStatus.COMPLETED
                            ? "unset"
                            : "text",
                        WebkitBackgroundClip:
                          task.status === TaskStatus.COMPLETED
                            ? "unset"
                            : "text",
                        WebkitTextFillColor:
                          task.status === TaskStatus.COMPLETED
                            ? "inherit"
                            : "transparent",
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          opacity:
                            task.status === TaskStatus.COMPLETED ? 0.7 : 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      label={PriorityLabels[task.priority]}
                      size="small"
                      sx={{
                        background:
                          task.priority === Priority.HIGH
                            ? "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)"
                            : task.priority === Priority.MEDIUM
                            ? "linear-gradient(135deg, #FFD93D 0%, #FFED4E 100%)"
                            : "linear-gradient(135deg, #6BCF7F 0%, #7ED491 100%)",
                        color:
                          task.priority === Priority.HIGH ? "white" : "#1A1A1A",
                        fontWeight: 600,
                        borderRadius: 2,
                        textShadow:
                          task.priority === Priority.HIGH
                            ? "0 1px 2px rgba(0,0,0,0.2)"
                            : "none",
                      }}
                    />

                    <Chip
                      label={StatusLabels[task.status]}
                      size="small"
                      sx={{
                        background:
                          task.status === TaskStatus.COMPLETED
                            ? "linear-gradient(135deg, #10B981 0%, #34D399 100%)"
                            : task.status === TaskStatus.IN_PROGRESS
                            ? "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
                            : "linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(0, 210, 211, 0.2) 100%)",
                        color:
                          task.status === TaskStatus.TODO
                            ? "text.primary"
                            : "white",
                        fontWeight: 600,
                        borderRadius: 2,
                        border:
                          task.status === TaskStatus.TODO
                            ? "1px solid rgba(108, 92, 231, 0.3)"
                            : "none",
                      }}
                    />

                    <Tooltip title="More options">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, task)}
                        sx={{
                          color: "text.secondary",
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "primary.main",
                            background: "rgba(108, 92, 231, 0.1)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Bottom row with deadline and category */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {task.dueDate && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: isOverdue(task)
                            ? "linear-gradient(135deg, #F85149 0%, #FF6B6B 100%)"
                            : "linear-gradient(135deg, #6C5CE7 0%, #00D2D3 100%)",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: isOverdue(task) ? "#F85149" : "text.secondary",
                          fontWeight: isOverdue(task) ? 600 : 400,
                        }}
                      >
                        {dayjs(task.dueDate).format("DD/MM/YYYY")}
                      </Typography>
                    </Box>
                  )}

                  <Chip
                    label={CategoryLabels[task.category]}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(108, 92, 231, 0.3)",
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      "&:hover": {
                        borderColor: "primary.main",
                        background: "rgba(108, 92, 231, 0.05)",
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: "auto" }}
                  >
                    {task.estimatedTime} min
                    {task.actualTime && ` • Actual: ${task.actualTime} min`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: { xs: 80, md: 16 },
          right: 16,
          background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)",
            transform: "scale(1.1)",
          },
          boxShadow: "0 8px 32px rgba(108, 92, 231, 0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={() => {
          setEditingTask(undefined);
          setIsTaskFormOpen(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(28, 33, 40, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(108, 92, 231, 0.2)",
          },
        }}
      >
        <MenuItem
          onClick={() => selectedTask && handleTaskAction("edit", selectedTask)}
        >
          <EditIcon sx={{ mr: 1, color: "primary.main" }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedTask && handleTaskAction("delete", selectedTask)
          }
          sx={{ color: "error.main" }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Task Form Dialog */}
      <Dialog
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            background:
              "linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(28, 33, 40, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(108, 92, 231, 0.2)",
          },
        }}
      >
        <TaskForm
          task={editingTask}
          onClose={() => setIsTaskFormOpen(false)}
          onSave={() => {
            setIsTaskFormOpen(false);
            setEditingTask(undefined);
          }}
        />
      </Dialog>
    </Box>
  );
};

export default ListView;
