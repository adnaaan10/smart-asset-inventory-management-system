import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet,useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect,useState } from "react";
import { getMe } from "../api/auth";





const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        // token expired / invalid
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  if (!user) return <p>Loading...</p>;
  

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      <Sidebar role={user?.role} />

      <Navbar />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          marginTop: "64px",
          overflowY: "auto",
          p:4,
          flexDirection: "column",
          width: "100%",
        }}
      >
          <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
