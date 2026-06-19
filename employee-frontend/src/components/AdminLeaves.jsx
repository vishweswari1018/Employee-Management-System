import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

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
    <div className="admin-leave">
      <AdminSidebar />

      <div className="main">
        <AdminNavbar />

        <h2>Leave Requests</h2>

        {leaves.length === 0 ? (
          <p>No leave requests found</p>
        ) : (
          leaves.map((l) => (
            <div
              key={l._id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h4>{l.employeeName}</h4>

              <p>
                <b>Type:</b> {l.leaveType}
              </p>

              <p>
                <b>From:</b>{" "}
                {new Date(l.fromDate).toLocaleDateString()}
              </p>

              <p>
                <b>To:</b>{" "}
                {new Date(l.toDate).toLocaleDateString()}
              </p>

              <p>
                <b>Reason:</b> {l.reason}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color:
                      l.status === "Approved"
                        ? "green"
                        : l.status === "Rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {l.status}
                </span>
              </p>

              {l.status === "Pending" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => approve(l._id)}
                    style={{
                      background: "green",
                      color: "white",
                      padding: "5px 10px",
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(l._id)}
                    style={{
                      background: "red",
                      color: "white",
                      padding: "5px 10px",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminLeaves;