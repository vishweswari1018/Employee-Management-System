const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Employee = require("../models/Employee");
const auth = require("../middleware/auth");

const router = express.Router();


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
    } = req.body;

    // Required fields
    if (
      !employeeId ||
      !email ||
      !gender ||
      !age ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    if (!email.endsWith("@company.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "Email must end with @company.ac.in",
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

    // Activate account
    employee.gender = gender;
    employee.age = age;
    employee.password = await bcrypt.hash(
      password,
      10
    );
    employee.status = "Active";

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

    // Pending activation
    if (employee.status === "Pending Activation") {
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

module.exports = router;