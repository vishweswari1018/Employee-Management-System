import { useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminSettings.css";

function AdminSettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT PASSWORD CHANGE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error changing password"
      );
    }
  };

  return (
    <div className="admin-settings-layout">
      <AdminSidebar />

      <div className="admin-settings-main">
        <AdminNavbar />

        <div className="settings-content container-fluid mt-5 px-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="settings-card card border-0 shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                      ⚙️
                    </div>
                    <h2 className="fw-bold text-primary mb-0">Admin Settings</h2>
                    <p className="text-muted mt-2">Update your security preferences</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                    <div className="form-group">
                      <label className="form-label fw-semibold text-muted mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control custom-input"
                        placeholder="Enter current password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label fw-semibold text-muted mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control custom-input"
                        placeholder="Enter new password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label fw-semibold text-muted mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control custom-input"
                        placeholder="Confirm new password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary fw-bold py-3 mt-2 shadow-sm rounded-3 w-100">
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;