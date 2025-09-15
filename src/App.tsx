import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, Dialog } from "@mui/material";
import Layout from "./components/Layout";
import ListView from "./components/ListView";
import CalendarView from "./components/CalendarView";
import PomodoroTimer from "./components/PomodoroTimer";
import AnalyticsView from "./components/AnalyticsView";
import TaskForm from "./components/TaskForm";
import { TaskStorage } from "./services/TaskStorage";
import "./App.css";

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6C5CE7",
      light: "#A29BFE",
      dark: "#5F3DC4",
    },
    secondary: {
      main: "#00D2D3",
      light: "#55EFC4",
      dark: "#00B894",
    },
    background: {
      default: "#000000",
      paper: "#0A0A0A",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#666666",
    },
    error: {
      main: "#F85149",
    },
    warning: {
      main: "#D29922",
    },
    success: {
      main: "#3FB950",
    },
    info: {
      main: "#58A6FF",
    },
  },
  typography: {
    fontFamily:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    body1: {
      letterSpacing: "-0.01em",
    },
    body2: {
      letterSpacing: "-0.005em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#1A1A1A #000000",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#000000",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#1A1A1A",
            borderRadius: "4px",
            "&:hover": {
              background: "#333333",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #1A1A1A",
          background: "linear-gradient(135deg, #0A0A0A 0%, #111111 100%)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(108, 92, 231, 0.2)",
            borderColor: "#6C5CE7",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
          boxShadow: "0 8px 32px rgba(108, 92, 231, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)",
            boxShadow: "0 12px 40px rgba(108, 92, 231, 0.6)",
          },
        },
        outlined: {
          borderColor: "#1A1A1A",
          "&:hover": {
            borderColor: "#6C5CE7",
            background: "rgba(108, 92, 231, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #1A1A1A",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #1A1A1A",
          boxShadow: "0 1px 0 rgba(108, 92, 231, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          backdropFilter: "blur(10px)",
        },
        filled: {
          background: "rgba(108, 92, 231, 0.1)",
          border: "1px solid rgba(108, 92, 231, 0.2)",
          color: "#A29BFE",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
          boxShadow: "0 8px 32px rgba(108, 92, 231, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)",
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            background: "rgba(10, 10, 10, 0.8)",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(26, 26, 26, 0.9)",
            },
            "&.Mui-focused": {
              background: "rgba(26, 26, 26, 1)",
              boxShadow: "0 0 0 2px rgba(108, 92, 231, 0.2)",
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          background: "rgba(26, 26, 26, 0.8)",
        },
        bar: {
          borderRadius: 8,
          background: "linear-gradient(90deg, #6C5CE7 0%, #A29BFE 100%)",
        },
      },
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Initialize sample data if no tasks exist
  useEffect(() => {
    const tasks = TaskStorage.getAllTasks();
    if (tasks.length === 0) {
      TaskStorage.generateSampleData();
    }
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 0:
        return <ListView />;
      case 1:
        return <CalendarView />;
      case 2:
        return <PomodoroTimer />;
      case 3:
        return <AnalyticsView />;
      default:
        return <ListView />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background:
            "linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #111111 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `
            radial-gradient(circle at 20% 80%, rgba(108, 92, 231, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 210, 211, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(162, 155, 254, 0.03) 0%, transparent 50%)
          `,
            pointerEvents: "none",
          },
        }}
      >
        <Layout currentView={currentView} onViewChange={setCurrentView}>
          {renderCurrentView()}
        </Layout>

        {/* Global Task Form Dialog */}
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
    </ThemeProvider>
  );
}

export default App;
