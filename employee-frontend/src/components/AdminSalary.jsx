import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminSalary.css";

function AdminSalary() {
  const [month, setMonth] = useState("");
  const [salaries, setSalaries] = useState([]);

  const token = localStorage.getItem("token");

  // GET SALARIES
  const fetchSalaries = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/salary/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSalaries(res.data.salaries);
    } catch (err) {
      console.log(err);
    }
  };

  // GENERATE SALARY
  const generateSalary = async () => {
    if (!month) {
      alert("Please select month");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/salary/generate",
        { month },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Salary Generated Successfully");
      fetchSalaries();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message);
    }
  };

  // MARK PAID
  const markPaid = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/salary/pay/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchSalaries();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="admin-salary-layout">
      <AdminSidebar />

      <div className="admin-salary-main">
        <AdminNavbar />

        <div className="salary-content container-fluid mt-4 px-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
            <h2 className="fw-bold text-primary mb-0">Salary Management</h2>
            <div className="d-flex gap-2 align-items-center">
              <span className="fw-semibold text-muted">Generate Monthly:</span>
              <input
                type="month"
                className="form-control shadow-sm"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{ width: "auto" }}
              />
              <button 
                className="btn btn-primary shadow-sm fw-bold px-4 text-nowrap"
                onClick={generateSalary}
              >
                Generate Salary
              </button>
            </div>
          </div>

          <div className="row g-4">
            {salaries.map((s) => (
              <div className="col-md-6 col-lg-4 col-xl-3" key={s._id}>
                <div className="card shadow-sm border-0 h-100 salary-card">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold text-dark mb-0">{s.employeeName}</h5>
                      <span className={`badge rounded-pill ${
                        s.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
                      }`}>{s.status}</span>
                    </div>

                    <div className="mb-3 flex-grow-1">
                      <p className="card-text mb-2 text-muted small fw-semibold">ID: {s.employeeId}</p>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Month:</span>
                        <span className="fw-semibold text-dark">{s.month}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <span className="text-muted">Amount:</span>
                        <span className="fs-4 text-success fw-bold">₹{s.amount}</span>
                      </div>
                    </div>

                    {s.status === "Unpaid" && (
                      <button 
                        onClick={() => markPaid(s._id)}
                        className="btn btn-outline-success mt-auto fw-bold w-100 shadow-sm"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSalary;