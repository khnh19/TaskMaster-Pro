import React, { useState, useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Add as AddIcon } from "@mui/icons-material";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/Task";
import { TaskCategory, Priority, TaskStatus } from "../types/Task";
import dayjs, { Dayjs } from "dayjs";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  onSave: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onSave }) => {
  const { createTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: TaskCategory.STUDY as TaskCategory,
    priority: Priority.MEDIUM as Priority,
    status: TaskStatus.TODO as TaskStatus,
    estimatedTime: 60,
    actualTime: undefined as number | undefined,
    dueDate: null as Dayjs | null,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        estimatedTime: task.estimatedTime,
        actualTime: task.actualTime,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        tags: [...task.tags],
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title cannot be empty";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description cannot be empty";
    }
    if (formData.estimatedTime <= 0) {
      newErrors.estimatedTime = "Time must be greater than 0";
    }
    if (formData.actualTime !== undefined && formData.actualTime < 0) {
      newErrors.actualTime = "Actual time cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      estimatedTime: formData.estimatedTime,
      actualTime: formData.actualTime,
      dueDate: formData.dueDate?.toDate(),
      tags: formData.tags,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      createTask(taskData);
    }

    onSave();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
            required
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as TaskCategory,
                  })
                }
                label="Category"
              >
                <MenuItem value={TaskCategory.STUDY}>Study</MenuItem>
                <MenuItem value={TaskCategory.PROJECT}>Project</MenuItem>
                <MenuItem value={TaskCategory.PERSONAL}>Personal</MenuItem>
                <MenuItem value={TaskCategory.WORK}>Work</MenuItem>
                <MenuItem value={TaskCategory.OTHER}>Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as Priority,
                  })
                }
                label="Priority"
              >
                <MenuItem value={Priority.LOW}>Low</MenuItem>
                <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                <MenuItem value={Priority.HIGH}>High</MenuItem>
                <MenuItem value={Priority.URGENT}>Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as TaskStatus,
                  })
                }
                label="Status"
              >
                <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
                <MenuItem value={TaskStatus.CANCELLED}>Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Estimated Time (minutes)"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedTime: parseInt(e.target.value) || 0,
                })
              }
              error={!!errors.estimatedTime}
              helperText={errors.estimatedTime}
              sx={{ flex: 1 }}
              required
            />
          </Box>

          {task && (
            <TextField
              label="Actual Time (minutes)"
              type="number"
              value={formData.actualTime || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  actualTime: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              error={!!errors.actualTime}
              helperText={errors.actualTime}
              fullWidth
            />
          )}

          <DateTimePicker
            label="Due Date"
            value={formData.dueDate}
            onChange={(newValue) =>
              setFormData({ ...formData, dueDate: newValue })
            }
            format="DD/MM/YYYY HH:mm"
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  size="small"
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={addTag} size="small">
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {task ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </LocalizationProvider>
  );
};

export default TaskForm;
