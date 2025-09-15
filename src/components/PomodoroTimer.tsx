import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  DialogContent,
  Avatar,
  Fab,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  Assignment,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/Task";
import { TaskStatus, Priority } from "../types/Task";
import { TaskStorage } from "../services/TaskStorage";

const PomodoroPhase = {
  WORK: "WORK",
  SHORT_BREAK: "SHORT_BREAK",
  LONG_BREAK: "LONG_BREAK",
} as const;

type PomodoroPhase = (typeof PomodoroPhase)[keyof typeof PomodoroPhase];

interface PomodoroSession {
  id: string;
  taskId?: string;
  phase: PomodoroPhase;
  duration: number;
  completedAt: Date;
}

const POMODORO_SETTINGS = {
  [PomodoroPhase.WORK]: {
    duration: 25 * 60,
    label: "Focus Time",
    color: "#6C5CE7",
  },
  [PomodoroPhase.SHORT_BREAK]: {
    duration: 5 * 60,
    label: "Short Break",
    color: "#00D2D3",
  },
  [PomodoroPhase.LONG_BREAK]: {
    duration: 15 * 60,
    label: "Long Break",
    color: "#3FB950",
  },
};

const PomodoroTimer: React.FC = () => {
  const { tasks } = useTasks();
  const [currentPhase, setCurrentPhase] = useState<PomodoroPhase>(
    PomodoroPhase.WORK
  );
  const [timeLeft, setTimeLeft] = useState(
    POMODORO_SETTINGS[PomodoroPhase.WORK].duration
  );
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved data and request notification permission
  useEffect(() => {
    const savedSessions = TaskStorage.getPomodoroSessions();
    setSessions(savedSessions);

    // Load today's completed sessions count
    const todayStats = TaskStorage.getTodaysPomodoroStats();
    setCompletedSessions(todayStats.completedSessions);

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    setIsRunning(false);

    // Play notification sound
    playNotificationSound();

    // Show browser notification
    showNotification();

    // Save completed session
    const session: PomodoroSession = {
      id: Date.now().toString(),
      taskId: selectedTask?.id,
      phase: currentPhase,
      duration: POMODORO_SETTINGS[currentPhase].duration,
      completedAt: new Date(),
    };

    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    TaskStorage.savePomodoroSession(session);

    if (currentPhase === PomodoroPhase.WORK) {
      setCompletedSessions((prev) => prev + 1);
      // Switch to break (short break every 1-3 sessions, long break every 4th)
      const nextPhase =
        (completedSessions + 1) % 4 === 0
          ? PomodoroPhase.LONG_BREAK
          : PomodoroPhase.SHORT_BREAK;
      setCurrentPhase(nextPhase);
      setTimeLeft(POMODORO_SETTINGS[nextPhase].duration);
    } else {
      // Switch back to work
      setCurrentPhase(PomodoroPhase.WORK);
      setTimeLeft(POMODORO_SETTINGS[PomodoroPhase.WORK].duration);
    }
  };

  const showNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const title =
        currentPhase === PomodoroPhase.WORK
          ? "🎉 Work Session Complete!"
          : "⏰ Break Time Over!";

      const body =
        currentPhase === PomodoroPhase.WORK
          ? "Great job! Time for a break."
          : "Ready to focus again?";

      new Notification(title, {
        body,
        icon: "/naver-favicon.ico",
        badge: "/naver-favicon.ico",
      });
    }
  };

  const playNotificationSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.2,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_SETTINGS[currentPhase].duration);
  };

  const handleSkip = () => {
    setTimeLeft(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = (): number => {
    const totalDuration = POMODORO_SETTINGS[currentPhase].duration;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const availableTasks = tasks.filter(
    (task) => task.status !== TaskStatus.COMPLETED
  );
  const currentSettings = POMODORO_SETTINGS[currentPhase];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Pomodoro Timer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay focused with the Pomodoro Technique
        </Typography>
      </Box>

      {/* Main Timer Card */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #0A0A0A 0%, #111111 100%)",
          border: `2px solid ${currentSettings.color}`,
          position: "relative",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          {/* Phase Indicator */}
          <Chip
            label={currentSettings.label}
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${currentSettings.color}20 0%, ${currentSettings.color}40 100%)`,
              border: `1px solid ${currentSettings.color}`,
              color: currentSettings.color,
              fontWeight: 600,
              fontSize: "1rem",
              px: 2,
              py: 1,
            }}
          />

          {/* Timer Display */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "4rem", sm: "6rem" },
              color: currentSettings.color,
              textShadow: `0 0 20px ${currentSettings.color}40`,
              mb: 2,
              fontFamily: "monospace",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 3,
              background: "rgba(255, 255, 255, 0.1)",
              "& .MuiLinearProgress-bar": {
                background: `linear-gradient(90deg, ${currentSettings.color} 0%, ${currentSettings.color}80 100%)`,
                borderRadius: 4,
              },
            }}
          />

          {/* Selected Task */}
          {selectedTask && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                background: "rgba(108, 92, 231, 0.1)",
                borderRadius: 2,
                border: "1px solid rgba(108, 92, 231, 0.3)",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Focusing on:
              </Typography>
              <Typography variant="h6" color="primary.main">
                {selectedTask.title}
              </Typography>
            </Box>
          )}

          {/* Control Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <Fab
              onClick={handleStartPause}
              sx={{
                background: `linear-gradient(135deg, ${currentSettings.color} 0%, ${currentSettings.color}80 100%)`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${currentSettings.color}80 0%, ${currentSettings.color} 100%)`,
                  transform: "scale(1.1)",
                },
              }}
            >
              {isRunning ? <Pause /> : <PlayArrow />}
            </Fab>

            <IconButton
              onClick={handleReset}
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
              }}
            >
              <Stop />
            </IconButton>

            <IconButton
              onClick={handleSkip}
              disabled={!isRunning}
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
                "&:disabled": { background: "rgba(255, 255, 255, 0.05)" },
              }}
            >
              <SkipNext />
            </IconButton>
          </Stack>

          {/* Task Selection Button */}
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => setShowTaskSelector(true)}
            sx={{
              borderColor: "rgba(108, 92, 231, 0.5)",
              color: "text.primary",
              "&:hover": {
                borderColor: "#6C5CE7",
                background: "rgba(108, 92, 231, 0.1)",
              },
            }}
          >
            {selectedTask ? "Change Task" : "Select Task"}
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Today's Progress
          </Typography>
          <Stack direction="row" spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary.main">
                {completedSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Sessions
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="secondary.main">
                {Math.floor((completedSessions * 25) / 60)}h{" "}
                {(completedSessions * 25) % 60}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Focus Time
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Task Selection Dialog */}
      <Dialog
        open={showTaskSelector}
        onClose={() => setShowTaskSelector(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Task to Focus On</DialogTitle>
        <DialogContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedTask(null);
                  setShowTaskSelector(false);
                }}
              >
                <Avatar sx={{ mr: 2, background: "rgba(255, 255, 255, 0.1)" }}>
                  <TimerIcon />
                </Avatar>
                <ListItemText
                  primary="Free Focus Session"
                  secondary="Focus without a specific task"
                />
              </ListItemButton>
            </ListItem>
            {availableTasks.map((task) => (
              <ListItem key={task.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskSelector(false);
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      background:
                        task.priority === Priority.URGENT
                          ? "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)"
                          : task.priority === Priority.HIGH
                          ? "linear-gradient(135deg, #FFD93D 0%, #FFED4E 100%)"
                          : task.priority === Priority.MEDIUM
                          ? "linear-gradient(135deg, #42A5F5 0%, #5AB7F7 100%)"
                          : "linear-gradient(135deg, #6BCF7F 0%, #7ED491 100%)",
                    }}
                  >
                    <Assignment />
                  </Avatar>
                  <ListItemText
                    primary={task.title}
                    secondary={`Due: ${
                      task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PomodoroTimer;
