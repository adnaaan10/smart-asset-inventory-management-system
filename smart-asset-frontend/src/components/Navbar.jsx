import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{
        ml: "200px",
        width: "calc(100% - 200px)",
        zIndex: 1200,
        backgroundColor: "#1E3A8A",
    }}>
      <Toolbar>
        <Typography variant="h6" sx={{color: "#FFFFFF",fontWeight:"bold",letterSpacing: "0.5px",}}>Smart Asset & Inventory Management System
</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
