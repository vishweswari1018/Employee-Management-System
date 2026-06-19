const express = require("express");
const router = express.Router();

const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");


// ==========================
// APPLY LEAVE (FINAL FIXED)
// ==========================
router.post("/apply", auth, async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    const employee = await Employee.findById(req.employee.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // INIT BALANCE
    if (!employee.leaveBalance) {
      employee.leaveBalance = {
        casual: 5,
        sick: 5,
        earned: 5,
      };
    }

    // MAP TYPE
    const key =
      leaveType === "Casual Leave"
        ? "casual"
        : leaveType === "Sick Leave"
        ? "sick"
        : "earned";

    // DATE CONVERT
    const from = new Date(fromDate);
    const to = new Date(toDate);

    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    if (to < from) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    const days =
      Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const balance = Number(employee.leaveBalance[key] || 0);

    if (balance < days) {
      return res.status(400).json({
        success: false,
        message: `Only ${balance} ${leaveType} available`,
      });
    }

    // =========================
    // 🔥 OVERLAP CHECK (FINAL FIX)
    // =========================
    const existingLeaves = await Leave.find({
      employee: employee._id,
      status: { $ne: "Rejected" },
    });

    const isOverlap = existingLeaves.some((leave) => {
      const oldFrom = new Date(leave.fromDate);
      const oldTo = new Date(leave.toDate);

      oldFrom.setHours(0, 0, 0, 0);
      oldTo.setHours(0, 0, 0, 0);

      return from <= oldTo && to >= oldFrom;
    });

    if (isOverlap) {
      return res.status(400).json({
        success: false,
        message: "❌ You already have leave booked for these dates",
      });
    }

    // =========================
    // RESERVE BALANCE
    // =========================
    employee.leaveBalance[key] -= days;
    await employee.save();

    const leave = await Leave.create({
      employee: employee._id,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      leaveType,
      fromDate,
      toDate,
      reason,
      days,
      status: "Pending",
    });

    res.json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================
// GET MY LEAVES
// ==========================
router.get("/my", auth, async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.employee.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================
// GET ALL LEAVES (ADMIN)
// ==========================
router.get("/all", auth, adminAuth, async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================
// APPROVE LEAVE
// ==========================
router.put("/approve/:id", auth, adminAuth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = "Approved";
    await leave.save();

    res.json({
      success: true,
      message: "Leave approved",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==========================
// REJECT LEAVE (RESTORE BALANCE)
// ==========================
router.put("/reject/:id", auth, adminAuth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    const employee = await Employee.findById(leave.employee);

    if (!employee.leaveBalance) {
      employee.leaveBalance = {
        casual: 5,
        sick: 5,
        earned: 5,
      };
    }

    const key =
      leave.leaveType === "Casual Leave"
        ? "casual"
        : leave.leaveType === "Sick Leave"
        ? "sick"
        : "earned";

    // restore balance
    employee.leaveBalance[key] += leave.days;

    await employee.save();

    leave.status = "Rejected";
    await leave.save();

    res.json({
      success: true,
      message: "Leave rejected and balance restored",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;