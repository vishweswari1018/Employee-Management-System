
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/SideBar.css";

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("employee");

      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>EMS</h2>
        <p>Employee Portal</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          👤 Profile
        </NavLink>

        <NavLink
          to="/leave"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📝 Leave
        </NavLink>

        <NavLink
          to="/salary"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          💰 Salary
        </NavLink>

        <NavLink
          to="/settings"
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

export default SideBar;