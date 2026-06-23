import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { useState } from "react";
import axios from "axios";
import "../styles/Settings.css";



function Settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } =
      formData;

    if (newPassword !== confirmPassword) {
      return alert(
        "New Password and Confirm Password do not match"
      );
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-layout d-flex w-100 vh-100 overflow-hidden">
      <SideBar />

      <div className="settings-main flex-grow-1 bg-light d-flex flex-column overflow-y-auto">
        <NavBar />

        <div className="container-fluid py-4 px-4 flex-grow-1 dashboard-content-wrapper d-flex justify-content-center align-items-center">
          <div className="settings-card bg-white rounded-4 shadow-sm p-5 border-0 w-100" style={{ maxWidth: '500px' }}>
            <h2 className="fw-bold text-primary mb-4 pb-3 border-bottom text-center">Change Password</h2>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
              <div className="form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase mb-2">Current Password</label>
                <input
                  type="password"
                  className="form-control custom-input"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter Current Password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase mb-2">New Password</label>
                <input
                  type="password"
                  className="form-control custom-input"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter New Password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="form-control custom-input"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary fw-bold shadow-sm save-btn w-100 py-3 mt-2"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;