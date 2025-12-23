import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Chip,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import ModalForm from "../../components/ModalForm";
import {
  getTechnicianDashboard,
  updateTicketStatus,
} from "../../api/technicianDashboard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

dayjs.extend(relativeTime);

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    sx={{
      borderRadius: 4,
      p: 5,
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

      <Typography fontSize={32} fontWeight={700}>
        {value}
      </Typography>

      <Typography variant="caption" color="#9ca3af">
        {subtitle}
      </Typography>
    </CardContent>

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

/* ================= MAIN COMPONENT ================= */

const TechnicianDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("");

  const fetchDashboard = () => {
    setLoading(true);
    getTechnicianDashboard()
      .then((res) => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  
  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async () => {
    await updateTicketStatus(selectedTicket.id, status);
    setOpenModal(false);
    fetchDashboard();
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (!dashboard) return <p>No data</p>;

  const { counts, active_tickets, recent_activity } = dashboard;

  return (
    <Box sx={{ p: 4, pl: 6 }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Technician Dashboard
      </Typography>

      {/* ===== KPI CARDS ===== */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Open Tickets"
            value={counts?.open || 0}
            subtitle="Tickets waiting to be worked on"
            icon={<ConfirmationNumberOutlinedIcon />}
            color="#EF4444"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="In Progress"
            value={counts?.in_progress || 0}
            subtitle="Currently being handled"
            icon={<PendingActionsOutlinedIcon />}
            color="#F97316"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Resolved"
            value={counts?.resolved || 0}
            subtitle="Successfully completed"
            icon={<TaskAltOutlinedIcon />}
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* ===== ACTIVE TICKETS ===== */}
      <Card sx={{ mt: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography fontWeight={600} mb={2}>
            My Assigned Tickets
          </Typography>

          <Stack spacing={1.5}>
            {(active_tickets || []).map((t) => (
              <Box
                key={t.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                }}
              >
                <Box>
                  <Typography fontSize={14} fontWeight={500}>
                    {t.asset_name}
                  </Typography>
                  <Typography fontSize={12} color="#6B7280">
                    {t.issue_description}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={t.status}
                    size="small"
                    color={
                      t.status === "OPEN"
                        ? "error"
                        : t.status === "IN_PROGRESS"
                        ? "warning"
                        : "success"
                    }
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSelectedTicket(t);
                      setStatus(t.status);
                      setOpenModal(true);
                    }}
                  >
                    UPDATE
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ===== RECENT ACTIVITY ===== */}
      <Card sx={{ mt: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography fontWeight={600} mb={2}>
            My Recent Activity
          </Typography>

          <Stack spacing={1}>
            {(recent_activity || []).map((item,index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  display:"flex",
                  justifyContent:"space-between",
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                }}
              >
                <Typography fontSize={14}>
                  {item.asset} — {item.status}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  {dayjs(item.updated_at).fromNow()}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* ===== MODAL ===== */}
      <ModalForm
        open={openModal}
        title="Update Ticket Status"
        onClose={() => setOpenModal(false)}
        onSubmit={handleUpdateStatus}
      >
        <TextField
          select
          label="Status"
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="RESOLVED">Resolved</MenuItem>
        </TextField>
      </ModalForm>
    </Box>
  );
};

export default TechnicianDashboard;
