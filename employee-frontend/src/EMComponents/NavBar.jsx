

function NavBar() {
  const employee = JSON.parse(
    localStorage.getItem("employee")
  );

  return (
    <div className="navbar">
      <div>
        <h2 className="navbar-title">
          Employee Management System
        </h2>

        <p className="navbar-subtitle">
          Welcome back, {employee?.name || "Employee"} 👋
        </p>
      </div>

      <div className="navbar-profile">
        <div className="profile-avatar">
          {employee?.name
            ? employee.name.charAt(0).toUpperCase()
            : "E"}
        </div>

        <div>
          <h4>{employee?.name || "Employee"}</h4>

          <p>{employee?.employeeId}</p>
        </div>
      </div>
    </div>
  );
}

export default NavBar;