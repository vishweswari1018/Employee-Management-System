
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("employee")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");

    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h2>EMS</h2>
        <p>Admin Portal</p>
      </div>

      {/* Admin Info */}
      <div className="admin-profile">
        <div className="avatar">
          {admin?.name
            ? admin.name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div>
          <h4>{admin?.name || "Admin"}</h4>
          <p>{admin?.employeeId || "ADMIN001"}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin-employees"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          👥 Employees
        </NavLink>

        <NavLink
          to="/admin-leaves"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📝 Leaves
        </NavLink>

        <NavLink
          to="/admin-salary"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          💰 Salary
        </NavLink>

        <NavLink
          to="/admin-settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          ⚙️ Settings
        </NavLink>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </nav>
    </div>
  );
}

export default AdminSidebar;