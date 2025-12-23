import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Assets from "./pages/Assets";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Tickets from "./pages/Tickets";
import Layout from "./components/Layout";
import ReportIssue from "./pages/ReportIssue";
import Users from "./pages/Users";
import ProtectedRoute from "./routes/ProtectedRoute";
import Assignments from "./pages/Assignment";
import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />}/>
        <Route path="/login" element={<Login/>}/>

        <Route  element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>

          <Route path="/assets" element={ <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Assets />
            </ProtectedRoute>}/>

          <Route path="/inventory" element={<ProtectedRoute allowedRoles={["ADMIN"]}>
              <Inventory />
            </ProtectedRoute>}/>
          
          <Route path="/assignments" element={<ProtectedRoute allowedRoles={["ADMIN","EMPLOYEE"]}>
              <Assignments/>
            </ProtectedRoute>}/>
          
          <Route path="/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}>
              <Users />
            </ProtectedRoute>} />

          <Route path="/report-issue" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <ReportIssue />
            </ProtectedRoute>} />

          <Route path="/profile" element={<Profile/>}/>

          <Route path="/tickets" element={<Tickets />}/>
          
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
