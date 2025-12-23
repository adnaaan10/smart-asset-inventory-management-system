import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getMe, changePassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await changePassword(currentPassword,newPassword);

      alert("Password changed successfully. Please login again.");

      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Password change failed");
    } finally {
      setLoading(false);
    }
  };



  if (!user) return <p>Loading...</p>;

  return (
    <Grid container spacing={4}>
    
      <Typography variant="h5" fontWeight={600} mb={3}>
        My Profile
      </Typography>

      
        {/* Profile Info */}
        <Grid item xs={12} mt={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography fontWeight={600} mb={3}>
                Profile Information
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label="Username"
                  value={user.username}
                  disabled
                  fullWidth
                />

                <TextField
                  label="Email"
                  value={user.email}
                  disabled
                  fullWidth
                />

                <TextField
                  label="Role"
                  value={user.role}
                  disabled
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security */}
        <Grid item xs={12} mt={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography fontWeight={600} mb={3}>
                Security
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Stack>

              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 4 }}
                fullWidth
                disabled={loading}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

  );
};

export default Profile;
