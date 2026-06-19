import { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

function AdminDashboard() {
  const ALL_DEPARTMENTS = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
  ];

  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  // =========================
  // FETCH EMPLOYEES
  // =========================
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees/employees",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================
  // BASIC STATS
  // =========================
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e) => e.status === "Active"
  ).length;

  const pendingEmployees = employees.filter(
    (e) => e.status === "Pending Activation"
  ).length;

  const males = employees.filter(
    (e) => e.gender === "Male"
  ).length;

  const females = employees.filter(
    (e) => e.gender === "Female"
  ).length;

  // =========================
  // DEPARTMENT LOGIC (ONLY ACTIVE)
  // =========================
  const departmentMap = {};

  employees
    .filter((e) => e.status === "Active") // IMPORTANT FIX
    .forEach((emp) => {
      const dept = emp.department || "Unknown";
      departmentMap[dept] = (departmentMap[dept] || 0) + 1;
    });

  // FORCE ALL DEPARTMENTS
  const departmentData = ALL_DEPARTMENTS.map((dept) => ({
    department: dept,
    employees: departmentMap[dept] || 0,
  }));

  const activeDepartments = departmentData.filter(
    (d) => d.employees > 0
  ).length;

  // =========================
  // UI
  // =========================
  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />

      <div className="admin-dashboard-main">
        <AdminNavbar />

        {/* =========================
            TOP CARDS
        ========================== */}
        <div className="cards-container">

          <div className="admin-card">
            <h4>Total Employees</h4>
            <p>{totalEmployees}</p>
          </div>

          <div className="admin-card">
            <h4>Active Employees</h4>
            <p>{activeEmployees}</p>
          </div>

          <div className="admin-card">
            <h4>Pending Employees</h4>
            <p>{pendingEmployees}</p>
          </div>

          <div className="admin-card">
            <h4>Departments</h4>
            <p>
              {activeDepartments} / {ALL_DEPARTMENTS.length}
            </p>
          </div>

          <div className="admin-card">
            <h4>Male Employees</h4>
            <p>{males}</p>
          </div>

          <div className="admin-card">
            <h4>Female Employees</h4>
            <p>{females}</p>
          </div>

        </div>

        {/* =========================
            DEPARTMENT TABLE
        ========================== */}
        <div className="distribution-section">
          <h2>Department Distribution</h2>

          <table className="distribution-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
              </tr>
            </thead>

            <tbody>
              {departmentData.map((dept, index) => (
                <tr
                  key={index}
                  style={{
                    opacity: dept.employees === 0 ? 0.5 : 1,
                  }}
                >
                  <td>{dept.department}</td>
                  <td>{dept.employees}</td>
                </tr>
              ))}

              <tr className="total-row">
                <td>Total</td>
                <td>{totalEmployees}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;