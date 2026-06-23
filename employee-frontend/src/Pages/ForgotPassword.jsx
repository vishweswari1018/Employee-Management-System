import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

import businessRecruitment from "../assets/business-recruitment.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
    if (!formData.employeeId || !formData.email) {
      alert("Please enter Employee ID and Company Email first.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          employeeId: formData.employeeId,
          email: formData.email,
        }
      );
      alert(response.data.message);
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        formData
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Password Reset Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="auth-content">
        <div className="auth-image-section">
          <img src={businessRecruitment} alt="Business Recruitment" />
        </div>
        <div className="register-card">
        <h2>Reset Password</h2>

        <p className="register-subtitle">
          Enter your Employee ID and Email to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Employee ID */}
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP001"
                required
                disabled={otpSent}
              />
            </div>

            {/* Company Email */}
            <div className="form-group">
              <label>Company Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@gprec.ac.in"
                required
                disabled={otpSent}
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              type="button"
              className="register-btn"
              onClick={handleSendOtp}
              disabled={loading}
              style={{ marginTop: "16px" }}
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group" style={{ width: "100%" }}>
                  <label>Verification OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP sent to your email"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                {/* New Password */}
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

                {/* Confirm New Password */}
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>

        <p className="login-link">
          Remembered your password?
          <Link to="/login" style={{ marginLeft: "5px" }}>
            Login
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
