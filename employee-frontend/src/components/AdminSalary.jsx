import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

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
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminNavbar />

        <h2>Salary Management</h2>

        {/* GENERATE SECTION */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Generate Monthly Salary</h3>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <button onClick={generateSalary}>
            Generate Salary
          </button>
        </div>

        {/* SALARY LIST */}
        {salaries.map((s) => (
          <div
            key={s._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{s.employeeName}</h4>
            <p>ID: {s.employeeId}</p>
            <p>Month: {s.month}</p>
            <p>Amount: ₹{s.amount}</p>
            <p>Status: {s.status}</p>

            {s.status === "Unpaid" && (
              <button onClick={() => markPaid(s._id)}>
                Mark Paid
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSalary;