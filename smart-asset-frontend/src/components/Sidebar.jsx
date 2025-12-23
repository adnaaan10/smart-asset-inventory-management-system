import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    Box,
    Typography,
    } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { sidebarConfig } from "../config/SidebarConfig";
import { useLocation } from "react-router-dom";
import ViewInArIcon from "@mui/icons-material/ViewInAr";


const Sidebar = ({role}) =>{
    const navigate = useNavigate();
    const menuItems = sidebarConfig[role] || [];
    const location = useLocation();


    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return(
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 200,flexShrink: 0,
                [`& .MuiDrawer-paper`]: { 
                    width: 200,
                    boxSizing: "border-box",
                    position:"fixed", 
                    top:0,
                    left:0,
                    height:"100vh",
                    backgroundColor: "#F1F5F9",
                    borderRight: "1px solid #E2E8F0",
                },
            }}  
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 2,
                    py: 2,
                }}
                >
                <ViewInArIcon sx={{ color: "#1E3A8A", fontSize: 30 }} />
                <Typography
                    variant="subtitle1"
                    sx={{
                    fontWeight: 700,
                    color: "#1E3A8A",
                    letterSpacing: "0.5px",
                    }}
                >
                    Asset Manager
                </Typography>
            </Box>

            <Divider />

            <List>
                {menuItems.map((item) => (
                    <ListItem disablePadding key={item.path}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            sx={{
                                mx: 1,
                                borderRadius: 1,
                                backgroundColor:
                                location.pathname === item.path ? "#DBEAFE" : "transparent",
                                color:
                                location.pathname === item.path ? "#2563EB" : "#334155",
                                fontWeight:
                                location.pathname === item.path ? 600 : 400,
                                "& .MuiListItemIcon-root": {
                                color:
                                    location.pathname === item.path ? "#2563EB" : "#64748B",
                                minWidth: 36,
                                },
                                "&:hover": {
                                backgroundColor: "#E2E8F0",
                                },
                            }}
                        >

                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} sx={{fontWeight:"bold"}} />
                        </ListItemButton>
                    </ListItem>

                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Divider />

            <Box sx={{ p: 2 }}>
                <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                sx={{ borderRadius: 2 }}
                onClick={handleLogout}
                >
                Logout
                </Button>
            </Box>

        </Drawer>
    )
}

export default Sidebar