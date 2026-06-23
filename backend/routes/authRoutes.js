const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const { sendOtpEmail, sendResetOtpEmail } = require("../utils/emailService");

const router = express.Router();


// ========================================
// Employee Account Activation - Send OTP
// POST /send-activation-otp
// ========================================

router.post("/send-activation-otp", async (req, res) => {
  console.log("➡️ Received OTP request:", req.body);
  try {
    const { employeeId, email } = req.body;

    if (!employeeId || !email) {
      console.log("❌ Missing fields");
      return res.status(400).json({ success: false, message: "Employee ID and Email are required" });
    }

    const employee = await Employee.findOne({
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
    });

    if (!employee) {
      console.log("❌ Employee not found");
      return res.status(404).json({ success: false, message: "Employee record not found. Contact Admin." });
    }

    if (employee.status === "Active") {
      console.log("❌ Employee already active");
      return res.status(400).json({ success: false, message: "Account already activated. Please login." });
    }

    console.log("✅ Employee found, generating OTP...");

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB (expires in 10 mins)
    employee.activationOtp = otp;
    employee.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await employee.save();

    // Send email
    const emailSent = await sendOtpEmail(employee.email, otp);

    if (!emailSent) {
      // Print OTP to console as fallback if email fails (useful for local dev without internet)
      console.log(`Fallback: OTP for ${employee.email} is ${otp}`);
      // Still return success so frontend flow works in local dev
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ========================================
// Employee Account Activation
// POST /register
// ========================================

router.post("/register", async (req, res) => {
  try {
    const {
      employeeId,
      email,
      gender,
      age,
      password,
      confirmPassword,
      otp,
    } = req.body;

    // Required fields
    if (
      !employeeId ||
      !email ||
      !gender ||
      !age ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    if (!email.endsWith("@gprec.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "Email must end with @gprec.ac.in",
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Employee must already exist
    const employee = await Employee.findOne({
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee record not found. Contact Admin.",
      });
    }

    // Already activated
    if (employee.status === "Active") {
      return res.status(400).json({
        success: false,
        message:
          "Account already activated. Please login.",
      });
    }

    // Verify OTP
    if (!employee.activationOtp || employee.activationOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (employee.otpExpiresAt && employee.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Activate account
    employee.gender = gender;
    employee.age = age;
    employee.password = await bcrypt.hash(password, 10);
    employee.status = "Active";
    employee.activationOtp = null;
    employee.otpExpiresAt = null;

    await employee.save();

    return res.status(200).json({
      success: true,
      message:
        "Account activated successfully. Please login.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ========================================
// Login
// POST /login
// ========================================

router.post("/login", async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID and Password are required",
      });
    }

    const employee = await Employee.findOne({
      employeeId: employeeId.toUpperCase(),
    });

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    // Pending activation — skip for admin, only block employees
    if (employee.role !== "admin" && employee.status === "Pending Activation") {
      return res.status(400).json({
        success: false,
        message:
          "Please activate your account first.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: employee.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        gender: employee.gender,
        age: employee.age,
        salary: employee.salary,
        joiningDate: employee.joiningDate,
        status: employee.status,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ========================================
// Change Password
// PUT /change-password
// ========================================

router.put(
  "/change-password",
  auth,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
        });
      }

      const employee =
        await Employee.findById(
          req.employee.id
        );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          employee.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      employee.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await employee.save();

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// Forgot Password - Send OTP
// POST /forgot-password
// ========================================

router.post("/forgot-password", async (req, res) => {
  console.log("➡️ Received Forgot Password request:", req.body);
  try {
    const { employeeId, email } = req.body;

    if (!employeeId || !email) {
      return res.status(400).json({ success: false, message: "Employee ID and Email are required" });
    }

    const employee = await Employee.findOne({
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee record not found." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB (expires in 10 mins)
    employee.resetPasswordOtp = otp;
    employee.resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await employee.save();

    // Send email
    const emailSent = await sendResetOtpEmail(employee.email, otp);

    if (!emailSent) {
      console.log(`Fallback: Reset OTP for ${employee.email} is ${otp}`);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ========================================
// Reset Password - Verify OTP & Reset
// POST /reset-password
// ========================================

router.post("/reset-password", async (req, res) => {
  try {
    const { employeeId, email, otp, newPassword, confirmNewPassword } = req.body;

    if (!employeeId || !email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const employee = await Employee.findOne({
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee record not found." });
    }

    // Verify OTP
    if (!employee.resetPasswordOtp || employee.resetPasswordOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (employee.resetPasswordExpiresAt && employee.resetPasswordExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Reset password
    employee.password = await bcrypt.hash(newPassword, 10);
    employee.resetPasswordOtp = null;
    employee.resetPasswordExpiresAt = null;

    // If they were pending activation, we shouldn't change their status, but if they are active, keep it.
    // However, if they are pending activation, they shouldn't reset password, they should just activate.
    // But we'll allow it and preserve their status.

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;