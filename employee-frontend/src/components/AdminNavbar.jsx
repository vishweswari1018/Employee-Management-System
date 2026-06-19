

function AdminNavbar() {
  const admin = JSON.parse(
    localStorage.getItem("employee")
  );

  return (
    <div className="admin-navbar">
      <div>
        <h2 className="navbar-title">
          Admin Dashboard
        </h2>

        <p className="navbar-subtitle">
          Welcome back, {admin?.name || "Admin"} 👋
        </p>
      </div>

      <div className="admin-profile-info">
        <div className="admin-avatar">
          {admin?.name
            ? admin.name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div>
          <h4>{admin?.name || "System Admin"}</h4>

          <p>{admin?.employeeId || "ADMIN001"}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;