import { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import AdminDistribution from "../components/AdminDistribution";
import "../styles/AdminDashboard.css";

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
  const [leaves, setLeaves] = useState([]);
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

  // =========================
  // FETCH LEAVES
  // =========================
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
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

  const employeesOnLeave = leaves.filter((l) => {
    if (!l.fromDate || !l.toDate) return false;
    const today = new Date().toISOString().split("T")[0];
    const from = new Date(l.fromDate).toISOString().split("T")[0];
    const to = new Date(l.toDate).toISOString().split("T")[0];

    return today >= from && today <= to && l.status === "Approved";
  }).length;

  // =========================
  // DEPARTMENT LOGIC
  // =========================
  const departmentMap = {};

  employees
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
        <div className="cards-wrapper">
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
          <div className="admin-card card-offset-left">
            <h4>Departments</h4>
            <p>6</p>
          </div>
          <div className="admin-card">
            <h4>Employees On Leave</h4>
            <p>{employeesOnLeave}</p>
          </div>
        </div>

        {/* =========================
            DEPARTMENT BAR CHART
        ========================== */}
        <AdminDistribution
          departmentData={departmentData}
          totalEmployees={totalEmployees}
        />

      </div>
    </div>
  );
}

export default AdminDashboard;