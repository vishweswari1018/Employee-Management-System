import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Employees from "./components/Employees";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Leaves from "./pages/Leaves";
import AdminLeaves from "./components/AdminLeaves";
import Salary from "./EMComponents/Salary";
import AdminSalary from "./Components/AdminSalary";
import AdminSettings from "./Components/AdminSettings";
import Settings from "./EMComponents/Settings";
import Home from "./Pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/Employee-Dashboard"
          element={<EmployeeDashboard />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/leave"
          element={<Leaves />}
        />
        <Route
          path="/admin-leaves"
          element={<AdminLeaves />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
  path="/admin-employees"
  element={<Employees />}
/>
     
        <Route
  path="/admin-dashboard"
  element={<AdminDashboard />}
/>
<Route
  path="/profile"
  element={<Profile />}
/>
<Route
  path="/salary"
  element={<Salary />}
/>
<Route
  path="/admin-salary"
  element={<AdminSalary />}
/>
<Route
  path="/admin-settings"
  element={<AdminSettings />}
/>
<Route
  path="/settings"
  element={<Settings />}
/>
      </Routes>
     
    
    </BrowserRouter>
  );
}

export default App;