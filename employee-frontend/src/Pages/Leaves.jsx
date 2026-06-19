import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
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
  // FETCH BALANCE
  // =========================
  const fetchBalance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employees/leave-balance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBalance(res.data.balance);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchBalance();
  }, []);

  // =========================
  // APPLY LEAVE (FULL VALIDATION)
  // =========================
  const applyLeave = async (e) => {
    e.preventDefault();

    // 1. CHECK EMPTY FIELDS
    if (
      !form.leaveType ||
      !form.fromDate ||
      !form.toDate ||
      !form.reason
    ) {
      alert("Please fill all fields");
      return;
    }

    // 2. CALCULATE DAYS
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);

    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    const diff = to - from;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      alert("Invalid date range");
      return;
    }

    // 3. MAP LEAVE TYPE TO BALANCE KEY
    const key =
      form.leaveType === "Casual Leave"
        ? "casual"
        : form.leaveType === "Sick Leave"
        ? "sick"
        : "earned";

    const available = balance?.[key] ?? 0;

    // 4. 🚨 CHECK BALANCE BEFORE API CALL
    if (days > available) {
      alert(
        `❌ You are applying for ${days} days but only ${available} leaves available`
      );
      return;
    }

    // 5. CALL API ONLY IF VALID
    try {
      await axios.post(
        "http://localhost:5000/api/leaves/apply",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Leave Applied Successfully");

      // reset form
      setForm({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchLeaves();
      fetchBalance();
    } catch (error) {
      alert(error.response?.data?.message || "Error applying leave");
    }
  };

  return (
    <div className="leave-layout">
      <SideBar />

      <div className="leave-main">
        <NavBar />

        <h2>My Leaves</h2>

        {/* =========================
            LEAVE BALANCE
        ========================== */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div>Casual: {balance?.casual ?? 0}</div>
          <div>Sick: {balance?.sick ?? 0}</div>
          <div>Earned: {balance?.earned ?? 0}</div>
        </div>

        {/* =========================
            FORM
        ========================== */}
        <form onSubmit={applyLeave}>
          <select
            value={form.leaveType}
            onChange={(e) =>
              setForm({ ...form, leaveType: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Earned Leave">Earned Leave</option>
          </select>

          <input
            type="date"
            value={form.fromDate}
            onChange={(e) =>
              setForm({ ...form, fromDate: e.target.value })
            }
          />

          <input
            type="date"
            value={form.toDate}
            onChange={(e) =>
              setForm({ ...form, toDate: e.target.value })
            }
          />

          <textarea
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
          />

          <button type="submit">Apply Leave</button>
        </form>

        {/* =========================
            HISTORY
        ========================== */}
        <h3>History</h3>

        {leaves.length === 0 ? (
          <p>No leave records found</p>
        ) : (
          leaves.map((l) => (
            <div key={l._id}>
              <p>{l.leaveType}</p>
              <p>
                {formatDate(l.fromDate)} →{" "}
                {formatDate(l.toDate)}
              </p>
              <p>{l.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Leaves;