import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { useState } from "react";
import axios from "axios";
import "../styles/Components.css";


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
    <div className="settings-layout">
      <SideBar />

      <div className="settings-main">
        <NavBar />

        <div className="settings-card">
          <h2>Change Password</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter Current Password"
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter New Password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                required
              />
            </div>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;