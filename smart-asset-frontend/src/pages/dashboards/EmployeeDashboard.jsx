import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import apiClient from "../../api/apiClient";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

dayjs.extend(relativeTime);

/* ================= KPI CARD (STYLED) ================= */

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    sx={{
      borderRadius: 4,
      px: 4,
      py: 3,
      height: 160,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 1,
      background: "linear-gradient(to bottom right, #ffffff, #f1f3f7)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    }}
  >
    <CardContent sx={{ flex: 1, p: 0, textAlign: "center" }}>
      <Typography fontSize={14} color="#6B7280" fontWeight={500}>
        {title}
      </Typography>

      <Typography fontSize={32} fontWeight={700} color="#111827">
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>

    {/* ICON */}
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        bgcolor: `${color}15`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
      }}
    >
      {icon}
    </Box>
  </Card>
);

/* ================= MAIN DASHBOARD ================= */

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get("employee-dashboard/")
      .then((res) => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Typography variant="h5" fontWeight={600} mb={4}>
        Employee Dashboard
      </Typography>

      {/* ================= KPI CARDS ================= */}
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="My Assets"
            value={dashboard.kpis?.my_assets || 0}
            subtitle="Assets currently assigned"
            icon={<Inventory2OutlinedIcon />}
            color="#2563EB"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Tickets"
            value={dashboard.kpis?.active_tickets || 0}
            subtitle="Issues being worked on"
            icon={<ConfirmationNumberOutlinedIcon />}
            color="#F97316"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Resolved Tickets"
            value={dashboard.kpis?.resolved_tickets || 0}
            subtitle="Successfully closed"
            icon={<TaskAltOutlinedIcon />}
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* ================= MY ASSETS ================= */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              My Assigned Assets
            </Typography>

            <Stack spacing={1.5}>
              {(dashboard.assets || []).map((a, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Typography fontWeight={500}>
                    {a.asset_name}
                  </Typography>

                  <Typography fontSize={12} color="#6B7280">
                    Assigned {dayjs(a.assigned_at).fromNow()}
                  </Typography>
                </Box>
              ))}

              {(dashboard.assets || []).length === 0 && (
                <Typography
                  fontSize={14}
                  color="text.secondary"
                  align="center"
                  sx={{ py: 2 }}
                >
                  No assets assigned
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* ================= RECENT ACTIVITY ================= */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Recent Activity
            </Typography>

            <Stack spacing={1.5}>
              {(dashboard.recent_activity || []).map((a, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    {a.message}
                  </Typography>

                  <Typography fontSize={12} color="#6B7280">
                    {dayjs(a.time).fromNow()}
                  </Typography>
                </Box>
              ))}

              {(dashboard.recent_activity || []).length === 0 && (
                <Typography
                  fontSize={14}
                  color="text.secondary"
                  align="center"
                  sx={{ py: 2 }}
                >
                  No recent activity
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
