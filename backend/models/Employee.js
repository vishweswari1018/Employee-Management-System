const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Employee ID
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Employee Name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Company Email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return email.endsWith("@gprec.ac.in");
        },
        message: "Email must end with @gprec.ac.in",
      },
    },

    // Phone Number
    phone: {
      type: String,
      default: null,
    },

    // Department
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "IT",
        "HR",
        "Finance",
        "Marketing",
        "Operations",
        "Sales",
      ],
    },

    // Gender (filled during activation)
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    // Age
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [65, "Age cannot exceed 65"],
      default: null,
    },

    // Salary
    salary: {
      type: Number,
      required: true,
      min: [0, "Salary cannot be negative"],
    },

    // Joining Date
    joiningDate: {
      type: Date,
      required: true,
    },

    // Date of Birth
    dob: {
      type: Date,
      default: null,
    },

    // Experience (Years)
    experience: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"],
    },

    // ✅ Leave Balance (NEW FEATURE)
    leaveBalance: {
      casual: {
        type: Number,
        default: 5,
      },
      sick: {
        type: Number,
        default: 5,
      },
      earned: {
        type: Number,
        default: 5,
      },
    },

    // Employee Status
    status: {
      type: String,
      enum: ["Pending Activation", "Active"],
      default: "Pending Activation",
    },

    // Password (set during activation)
    password: {
      type: String,
      default: null,
    },

    // Profile Photo URL
    profilePhoto: {
      type: String,
      default: null,
    },

    // Role
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },

    // OTP for activation
    activationOtp: {
      type: String,
      default: null,
    },

    // Expiry for activation OTP
    otpExpiresAt: {
      type: Date,
      default: null,
    },

    // OTP for password reset
    resetPasswordOtp: {
      type: String,
      default: null,
    },

    // Expiry for password reset OTP
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);