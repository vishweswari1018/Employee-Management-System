import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";
import "../styles/EmployeeDashboard.css";

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
    <div className="dashboard-layout d-flex w-100 vh-100 overflow-hidden">
      <SideBar />

      <div className="employee-dashboard-main flex-grow-1 bg-light d-flex flex-column overflow-y-auto">
        <NavBar />

        <div className="container-fluid py-4 px-4 d-flex flex-column flex-grow-1 h-100">
          {/* WELCOME */}
          <div className="welcome-section mb-4 p-4 rounded-4 shadow-sm bg-white border-0">
            <h2 className="fw-bold text-primary mb-2">
              Welcome Back, {employee?.name || "Employee"} 👋
            </h2>
            <p className="text-muted mb-0 fs-5">Here's your real-time dashboard overview.</p>
          </div>

          {/* CARDS */}
          <div className="row g-4 pb-4">
            {/* Salary */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 dashboard-card hover-lift">
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center p-4">
                  <div className="icon-wrapper bg-success bg-opacity-10 text-success mb-3 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    <span>💰</span>
                  </div>
                  <h5 className="card-title text-muted fw-semibold mb-2">Monthly Salary</h5>
                  <h3 className="card-text fw-bold text-dark mb-0">₹{employee?.salary || 0}</h3>
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 dashboard-card hover-lift">
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center p-4">
                  <div className="icon-wrapper bg-primary bg-opacity-10 text-primary mb-3 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    <span>🏢</span>
                  </div>
                  <h5 className="card-title text-muted fw-semibold mb-2">Department</h5>
                  <h3 className="card-text fw-bold text-dark mb-0">{employee?.department || "N/A"}</h3>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 dashboard-card hover-lift">
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center p-4">
                  <div className="icon-wrapper bg-warning bg-opacity-10 text-warning mb-3 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    <span>📈</span>
                  </div>
                  <h5 className="card-title text-muted fw-semibold mb-2">Experience</h5>
                  <h3 className="card-text fw-bold text-dark mb-0">{employee?.experience ?? 0} Years</h3>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 dashboard-card hover-lift">
                <div className="card-body text-center d-flex flex-column justify-content-center align-items-center p-4">
                  <div className="icon-wrapper bg-info bg-opacity-10 text-info mb-3 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    <span>✅</span>
                  </div>
                  <h5 className="card-title text-muted fw-semibold mb-2">Status</h5>
                  <h3 className="card-text fw-bold text-dark mb-0">
                    {isOnLeave
                      ? <span className="text-warning">🟡 On Leave</span>
                      : <span className="text-success">{employee?.status || "Active"}</span>}
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;