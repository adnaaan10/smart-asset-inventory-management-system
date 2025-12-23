import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";

export const sidebarConfig = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Assets", path: "/assets", icon: <InventoryIcon /> },
    { label: "Assignments", path: "/assignments", icon: <AssignmentIcon /> },
    { label: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
    { label: "Tickets", path: "/tickets", icon: <BugReportIcon /> },
    { label: "Users", path: "/users", icon: <PeopleIcon /> },
    { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
  ],

  EMPLOYEE: [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Report Issue", path: "/report-issue", icon: <BugReportIcon /> },
    { label: "Assignments", path: "/assignments", icon: <AssignmentIcon /> },
    { label: "My Tickets", path: "/tickets", icon: <BuildIcon /> },
    { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
  ],

  TECHNICIAN: [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Tickets", path: "/tickets", icon: <BuildIcon /> },
    { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
  ],
};
