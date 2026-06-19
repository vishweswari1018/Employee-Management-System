import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminLeaves.css";

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  // GET ALL LEAVES
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/leaves/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLeaves(res.data.leaves);
    } catch (error) {
      console.log(error);
      alert("Failed to load leaves");
    }
  };

  // APPROVE LEAVE
  const approve = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/leaves/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI instantly
      setLeaves((prev) =>
        prev.map((l) =>
          l._id === id
            ? { ...l, status: "Approved" }
            : l
        )
      );

    } catch (error) {
      console.log(error);
      alert("Approve failed");
    }
  };

  // REJECT LEAVE
  const reject = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/leaves/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI instantly
      setLeaves((prev) =>
        prev.map((l) =>
          l._id === id
            ? { ...l, status: "Rejected" }
            : l
        )
      );

    } catch (error) {
      console.log(error);
      alert("Reject failed");
    }
  };

  return (
    <div className="admin-leave-layout">
      <AdminSidebar />

      <div className="admin-leave-main">
        <AdminNavbar />

        <div className="leaves-content container-fluid mt-4 px-4">
          <h2 className="mb-4 fw-bold text-primary border-bottom pb-2">Leave Requests</h2>

          {leaves.length === 0 ? (
            <div className="alert alert-info">No leave requests found</div>
          ) : (
            <div className="row g-4">
              {leaves.map((l) => (
                <div className="col-md-6 col-lg-4" key={l._id}>
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title fw-bold text-dark mb-0">{l.employeeName}</h5>
                        <span className={`badge ${
                          l.status === 'Approved' ? 'bg-success' :
                          l.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>{l.status}</span>
                      </div>
                      
                      <div className="mb-3 flex-grow-1">
                        <p className="card-text mb-1">
                          <strong>Type:</strong> {l.leaveType}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Date:</strong> {new Date(l.fromDate).toLocaleDateString()} - {new Date(l.toDate).toLocaleDateString()}
                        </p>
                        <p className="card-text text-muted mt-2 small">
                          <strong>Reason:</strong> {l.reason}
                        </p>
                      </div>

                      {l.status === "Pending" && (
                        <div className="d-flex gap-2 mt-auto pt-3 border-top">
                          <button
                            onClick={() => approve(l._id)}
                            className="btn btn-success flex-grow-1 fw-bold shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reject(l._id)}
                            className="btn btn-danger flex-grow-1 fw-bold shadow-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLeaves;