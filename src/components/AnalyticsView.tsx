import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import { TrendingUp, Assignment, Timer, Speed } from "@mui/icons-material";
import { useAnalytics } from "../hooks/useAnalytics";
import { useTasks } from "../hooks/useTasks";
import { TaskCategory, Priority } from "../types/Task";
import dayjs from "dayjs";

const AnalyticsView: React.FC = () => {
  const { analytics, loading } = useAnalytics();
  const { allTasks } = useTasks();

  if (loading || !analytics) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography>Loading analytics data...</Typography>
      </Box>
    );
  }

  // Calculate additional metrics
  const completionRate =
    analytics.totalTasks > 0
      ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
      : 0;

  const avgTimePerTask =
    analytics.completedTasks > 0
      ? Math.round(analytics.totalTimeSpent / analytics.completedTasks)
      : 0;

  // Get recent activity (last 7 days)
  const recentTasks = allTasks.filter((task) =>
    dayjs(task.createdAt).isAfter(dayjs().subtract(7, "day"))
  );

  const recentCompletions = allTasks.filter(
    (task) =>
      task.completedAt &&
      dayjs(task.completedAt).isAfter(dayjs().subtract(7, "day"))
  );

  // Productivity insights
  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "success" as const };
    if (score >= 60) return { label: "Good", color: "info" as const };
    if (score >= 40) return { label: "Average", color: "warning" as const };
    return { label: "Needs Improvement", color: "error" as const };
  };

  const productivityLevel = getProductivityLevel(analytics.productivityScore);

  // Category labels
  const getCategoryLabel = (category: TaskCategory) => {
    const labels = {
      [TaskCategory.STUDY]: "Study",
      [TaskCategory.PROJECT]: "Project",
      [TaskCategory.PERSONAL]: "Personal",
      [TaskCategory.WORK]: "Work",
      [TaskCategory.OTHER]: "Other",
    };
    return labels[category];
  };

  const getPriorityLabel = (priority: Priority) => {
    const labels = {
      [Priority.URGENT]: "Urgent",
      [Priority.HIGH]: "High",
      [Priority.MEDIUM]: "Medium",
      [Priority.LOW]: "Low",
    };
    return labels[priority];
  };

  return (
    <Box>
      {/* Overview Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Assignment sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
            <Typography variant="h4" color="primary">
              {analytics.totalTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng số task
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <TrendingUp sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
            <Typography variant="h4" color="success.main">
              {completionRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tỷ lệ hoàn thành
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Timer sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
            <Typography variant="h4" color="info.main">
              {Math.round(analytics.totalTimeSpent / 60)}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng thời gian
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Speed
              sx={{
                fontSize: 40,
                color: productivityLevel.color + ".main",
                mb: 1,
              }}
            />
            <Typography variant="h4" color={productivityLevel.color + ".main"}>
              {Math.round(analytics.productivityScore)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điểm hiệu suất
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Productivity Analysis */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <Speed sx={{ mr: 1 }} />
            Phân tích hiệu suất
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">Mức độ hiệu suất</Typography>
                <Chip
                  label={productivityLevel.label}
                  color={productivityLevel.color}
                  size="small"
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={analytics.productivityScore}
                color={productivityLevel.color}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Divider />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian trung bình/task
                </Typography>
                <Typography variant="h6">{avgTimePerTask} phút</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Hoạt động 7 ngày qua
                </Typography>
                <Typography variant="h6">
                  {recentTasks.length} task mới • {recentCompletions.length}{" "}
                  hoàn thành
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Phân bố theo danh mục
            </Typography>

            <Stack spacing={2}>
              {Object.entries(analytics.categoryBreakdown).map(
                ([category, count]) => {
                  const percentage =
                    analytics.totalTasks > 0
                      ? (count / analytics.totalTasks) * 100
                      : 0;

                  return (
                    <Box key={category}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2">
                          {getCategoryLabel(category as TaskCategory)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {count} task ({Math.round(percentage)}%)
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  );
                }
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Phân bố theo mức độ ưu tiên
            </Typography>

            <Stack spacing={2}>
              {Object.entries(analytics.priorityBreakdown).map(
                ([priority, count]) => {
                  const percentage =
                    analytics.totalTasks > 0
                      ? (count / analytics.totalTasks) * 100
                      : 0;

                  return (
                    <Box key={priority}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2">
                          {getPriorityLabel(priority as Priority)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {count} task ({Math.round(percentage)}%)
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  );
                }
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Insights & Tips */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Gợi ý cải thiện
          </Typography>

          <Stack spacing={2}>
            {completionRate < 50 && (
              <Alert severity="warning">
                Tỷ lệ hoàn thành task còn thấp ({completionRate}%). Hãy thử chia
                nhỏ các task lớn thành những phần nhỏ hơn.
              </Alert>
            )}

            {analytics.productivityScore < 40 && (
              <Alert severity="info">
                Điểm hiệu suất có thể cải thiện. Hãy thử ước tính thời gian
                chính xác hơn và tập trung hoàn thành từng task.
              </Alert>
            )}

            {recentTasks.length === 0 && (
              <Alert severity="info">
                Bạn chưa tạo task nào trong 7 ngày qua. Hãy lập kế hoạch cho
                tuần mới!
              </Alert>
            )}

            {completionRate >= 80 && analytics.productivityScore >= 70 && (
              <Alert severity="success">
                Xuất sắc! Bạn đang có hiệu suất làm việc rất tốt. Tiếp tục duy
                trì!
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalyticsView;
