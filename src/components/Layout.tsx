import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from "@mui/material";
import {
  List as ListIcon,
  CalendarMonth as CalendarIcon,
  Analytics as AnalyticsIcon,
  Assignment,
  Timer as TimerIcon,
} from "@mui/icons-material";

interface LayoutProps {
  children: React.ReactNode;
  currentView: number;
  onViewChange: (newView: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const views = [
    { label: "List", icon: <ListIcon />, value: 0 },
    { label: "Calendar", icon: <CalendarIcon />, value: 1 },
    { label: "Pomodoro", icon: <TimerIcon />, value: 2 },
    { label: "Analytics", icon: <AnalyticsIcon />, value: 3 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Top App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(108, 92, 231, 0.2)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            <Assignment sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #F0F6FC 0%, #A29BFE 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              TaskMaster Pro
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                mt: -0.5,
              }}
            >
              Smart Time Management
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
              background: "rgba(108, 92, 231, 0.1)",
              borderRadius: 2,
              p: 1,
              border: "1px solid rgba(108, 92, 231, 0.2)",
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Vietnamese Students
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Navigation Tabs */}
      {!isMobile && (
        <Box
          sx={{
            borderBottom: "1px solid rgba(26, 26, 26, 0.8)",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tabs
                value={currentView}
                onChange={(_, newValue) => onViewChange(newValue)}
                indicatorColor="primary"
                textColor="primary"
                centered
                sx={{
                  "& .MuiTab-root": {
                    minHeight: 64,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    minWidth: 120,
                    "&:hover": {
                      background: "rgba(108, 92, 231, 0.08)",
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-selected": {
                      background: "rgba(108, 92, 231, 0.1)",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "2px 2px 0 0",
                    background:
                      "linear-gradient(90deg, #6C5CE7 0%, #A29BFE 100%)",
                  },
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "center",
                  },
                }}
              >
                {views.map((view) => (
                  <Tab
                    key={view.value}
                    label={view.label}
                    icon={view.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>
          </Container>
        </Box>
      )}

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            animation: "fadeInUp 0.6s ease-out",
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
          }}
        >
          {children}
        </Box>
      </Container>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0, 0, 0, 0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(108, 92, 231, 0.2)",
            zIndex: 1000,
          }}
          elevation={0}
        >
          <BottomNavigation
            value={currentView}
            onChange={(_, newValue) => onViewChange(newValue)}
            sx={{
              background: "transparent",
              "& .MuiBottomNavigationAction-root": {
                color: "text.secondary",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "rgba(108, 92, 231, 0.08)",
                },
                "&.Mui-selected": {
                  color: "primary.main",
                  background: "rgba(108, 92, 231, 0.1)",
                },
              },
            }}
          >
            {views.map((view) => (
              <BottomNavigationAction
                key={view.value}
                label={view.label}
                icon={view.icon}
                value={view.value}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Spacer for mobile bottom navigation */}
      {isMobile && <Box sx={{ height: 56 }} />}
    </Box>
  );
};

export default Layout;
