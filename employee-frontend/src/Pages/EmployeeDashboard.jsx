import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";
import "../styles/Dashboard.css";

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH PROFILE (LIVE)
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmployee(res.data.employee);
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
        "http://localhost:5000/api/leaves/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchProfile();
    fetchLeaves();
  }, []);

  // =========================
  // AUTO REFRESH WHEN PAGE FOCUSED (IMPORTANT FIX)
  // =========================
  useEffect(() => {
    const handleFocus = () => {
      fetchProfile();
      fetchLeaves();
    };

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // =========================
  // CHECK LEAVE STATUS TODAY
  // =========================
  const isOnLeave = leaves.some((l) => {
    const today = new Date().toISOString().split("T")[0];

    const from = new Date(l.fromDate).toISOString().split("T")[0];
    const to = new Date(l.toDate).toISOString().split("T")[0];

    return today >= from && today <= to && l.status === "Approved";
  });

  return (
    <div className="dashboard-layout">
      <SideBar />

      <div className="dashboard-main">
        <NavBar />

        {/* WELCOME */}
        <div className="welcome-section">
          <h2>
            Welcome Back, {employee?.name || "Employee"} 👋
          </h2>

          <p>Here's your real-time dashboard overview.</p>
        </div>

        {/* CARDS */}
        <div className="cards-container">

          {/* Salary */}
          <div className="dashboard-card">
            <span>💰</span>
            <h4>Monthly Salary</h4>
            <p>₹{employee?.salary || 0}</p>
          </div>

          {/* Department */}
          <div className="dashboard-card">
            <span>🏢</span>
            <h4>Department</h4>
            <p>{employee?.department || "N/A"}</p>
          </div>

          {/* Experience (🔥 FIXED LIVE VALUE) */}
          <div className="dashboard-card">
            <span>📈</span>
            <h4>Experience</h4>
            <p>{employee?.experience ?? 0} Years</p>
          </div>

          {/* Status */}
          <div className="dashboard-card">
            <span>✅</span>
            <h4>Status</h4>
            <p>
              {isOnLeave
                ? "🟡 On Leave Today"
                : employee?.status || "Active"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;