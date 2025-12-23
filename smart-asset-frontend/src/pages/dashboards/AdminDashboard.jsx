import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Stack,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
} from "recharts";

import apiClient from "../../api/apiClient";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

/* ================= SUMMARY CARD ================= */

const SummaryCard = ({ title, value, color, icon, subtitle }) => (
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
      <Typography variant="subtitle2" sx={{ color: "#6b7280", fontWeight: 500 }}>
        {title}
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>

    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        bgcolor: `${color}15`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
      }}
    >
      {icon}
    </Box>
  </Card>
);

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    apiClient
      .get("/admin-dashboard/")
      .then((res) => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading dashboard...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  /* ================= BACKEND DATA ================= */

  const {
    total_assets,
    total_inventory,
    assigned_assets,
    low_stock_items,
    open_tickets,
  } = dashboard.kpis;

  const assetStatusData = (dashboard.asset_overview || []).map((a) => ({
    name: a.status,
    count: a.count
  }));

  const ticketData = (dashboard.ticket_status || []).map((t) => ({
    name: t.status,
    value: t.count
  }));

  const recentActivities = (dashboard.recent_activity || []).map((a, i) => ({
    id: i,
    text: a.message,
    time: dayjs(a.time).fromNow()
  }));

  /* ================= RENDER ================= */

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard
      </Typography>

      {/* ===== KPI CARDS ===== */}
      <Grid container spacing={8}>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Total Assets"
            value={total_assets}
            subtitle="All company assets"
            color="#2563EB"
            icon={<Inventory2OutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Total Inventory Items"
            value={total_inventory}
            subtitle="Items in stock"
            color="#10B981"
            icon={<InventoryOutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Assigned Assets"
            value={assigned_assets}
            subtitle="Currently in use"
            color="#6366F1"
            icon={<AssignmentIndOutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Low Stock Items"
            value={low_stock_items}
            subtitle="Needs attention"
            color="#EF4444"
            icon={<WarningAmberOutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Open Tickets"
            value={open_tickets}
            subtitle="Pending issues"
            color="#F97316"
            icon={<ConfirmationNumberOutlinedIcon />}
          />
        </Grid>
      </Grid>

      {/* ===== CHARTS ===== */}
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {/* BAR CHART */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, borderRadius: 5 }}>
            <Typography fontWeight="bold" textAlign="center" mb={2}>
              Assets Overview
            </Typography>

            <BarChart
              width={650}
              height={300}
              data={assetStatusData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#6B7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.08)" }}
                contentStyle={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  fontSize: "13px",
                }}
              />

              <Bar
                dataKey="count"
                fill="#7C3AED"
                radius={[10, 10, 0, 0]}
                barSize={60}
              />
            </BarChart>

          </Card>
        </Grid>

        {/* PIE CHART */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 4, borderRadius: 5 }}>
            <Typography fontWeight="bold" textAlign="center" mb={2}>
              Tickets Status
            </Typography>

            <PieChart width={300} height={300}>
              <defs>
                <linearGradient id="openGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>

                <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <Pie
                data={ticketData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
              >
                <Cell fill="url(#openGrad)" />
                <Cell fill="url(#progressGrad)" />
                <Cell fill="url(#resolvedGrad)" />
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  fontSize: "13px",
                }}
              />
            </PieChart>

          </Card>
        </Grid>
      </Grid>

      {/* ===== RECENT ACTIVITY ===== */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Recent Activity
            </Typography>

            <Stack spacing={1.5}>
              {recentActivities.map((a) => (
                <Box
                  key={a.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Typography fontSize={14}>{a.text}</Typography>
                  <Typography fontSize={12} color="#6B7280">
                    {a.time}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default Dashboard;
