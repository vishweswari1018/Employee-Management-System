import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";
import "../styles/Leaves.css";

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
    <div className="leave-layout d-flex w-100 vh-100 overflow-hidden">
      <SideBar />

      <div className="leave-main flex-grow-1 bg-light d-flex flex-column overflow-y-auto">
        <NavBar />

        <div className="container-fluid py-4 px-4 d-flex flex-column flex-grow-1 dashboard-content-wrapper">
          <div className="leave-card bg-white rounded-4 shadow-sm p-4 border-0 mb-4 flex-grow-1">
            <h2 className="fw-bold text-primary mb-4 pb-2 border-bottom">My Leaves</h2>

            {/* =========================
                LEAVE BALANCE
            ========================== */}
            <div className="row g-4 mb-4">
              <div className="col-4">
                <div className="balance-card bg-info bg-opacity-10 text-info p-3 rounded-3 text-center border border-info border-opacity-25">
                  <h6 className="text-uppercase fw-bold mb-1">Casual</h6>
                  <h3 className="fw-bold mb-0">{balance?.casual ?? 0}</h3>
                </div>
              </div>
              <div className="col-4">
                <div className="balance-card bg-warning bg-opacity-10 text-warning p-3 rounded-3 text-center border border-warning border-opacity-25">
                  <h6 className="text-uppercase fw-bold mb-1">Sick</h6>
                  <h3 className="fw-bold mb-0">{balance?.sick ?? 0}</h3>
                </div>
              </div>
              <div className="col-4">
                <div className="balance-card bg-success bg-opacity-10 text-success p-3 rounded-3 text-center border border-success border-opacity-25">
                  <h6 className="text-uppercase fw-bold mb-1">Earned</h6>
                  <h3 className="fw-bold mb-0">{balance?.earned ?? 0}</h3>
                </div>
              </div>
            </div>

            {/* =========================
                FORM
            ========================== */}
            <div className="row">
              <div className="col-lg-5 col-md-12 mb-4">
                <div className="apply-leave-box p-4 rounded-3 border border-light bg-light bg-opacity-50">
                  <h5 className="fw-bold text-dark mb-3">Apply for Leave</h5>
                  <form onSubmit={applyLeave} className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label fw-semibold text-dark small text-uppercase mb-1">Leave Type</label>
                      <select className="form-select custom-input" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                        <option value="">Select Type</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <label className="form-label fw-semibold text-dark small text-uppercase mb-1">From Date</label>
                        <input type="date" className="form-control custom-input" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold text-dark small text-uppercase mb-1">To Date</label>
                        <input type="date" className="form-control custom-input" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
                      </div>
                    </div>

                    <div>
                      <label className="form-label fw-semibold text-dark small text-uppercase mb-1">Reason</label>
                      <textarea className="form-control custom-input" rows="3" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="State your reason..." />
                    </div>

                    <button type="submit" className="btn btn-primary fw-bold shadow-sm save-btn mt-2">Apply Leave</button>
                  </form>
                </div>
              </div>

              {/* =========================
                  HISTORY
              ========================== */}
              <div className="col-lg-7 col-md-12">
                <div className="history-box p-4 rounded-3 border border-light">
                  <h5 className="fw-bold text-dark mb-3">Leave History</h5>

                  {leaves.length === 0 ? (
                    <div className="text-center text-muted p-4 bg-light rounded-3">No leave records found</div>
                  ) : (
                    <div className="list-group">
                      {leaves.map((l) => (
                        <div key={l._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 border-0 shadow-sm bg-light">
                          <div>
                            <h6 className="mb-1 fw-bold text-dark">{l.leaveType}</h6>
                            <small className="text-muted d-block">
                              {formatDate(l.fromDate)} → {formatDate(l.toDate)}
                            </small>
                          </div>
                          <span className={`badge rounded-pill px-3 py-2 ${
                            l.status === 'Approved' ? 'bg-success' : 
                            l.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>
                            {l.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaves;