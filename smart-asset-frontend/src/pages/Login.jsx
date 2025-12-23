import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser,getMe } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const data = await loginUser(username, password);

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    const me = await getMe();

    localStorage.setItem("role",me.role);
    localStorage.setItem("username",me.username);
    
    navigate("/dashboard");
  } catch (error) {
    alert("Invalid credentials");
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F7FB",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Smart Asset Management
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" onClick={handleLogin}>
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
