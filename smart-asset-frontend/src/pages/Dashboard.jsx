import AdminDashboard from "./dashboards/AdminDashboard"
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import TechnicianDashboard from "./dashboards/TechnicianDashboard"


const Dashboard = () => {
  const userRole = localStorage.getItem("role");
  return (
  <>
    {userRole === "ADMIN" && <AdminDashboard />}
    {userRole === "EMPLOYEE" && <EmployeeDashboard />}
    {userRole === "TECHNICIAN" && <TechnicianDashboard />}
  </>
);

}


export default Dashboard