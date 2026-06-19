const express = require("express");
const router = express.Router();

const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");


// ==========================
// 1. GENERATE SALARY (ADMIN)
// ==========================
router.post("/generate", auth, adminAuth, async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    const employees = await Employee.find({
      role: "employee",
   } );

    for (let emp of employees) {
      const exists = await Salary.findOne({
        employeeId: emp.employeeId,
        month: month,
      });

      // prevent duplicates
      if (!exists) {
        await Salary.create({
          employee: emp._id,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          month,
          amount: emp.salary,
          status: "Unpaid",
        });
      }
    }

    res.json({
      success: true,
      message: "Salary generated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================
// 2. GET ALL SALARIES (ADMIN)
// ==========================
router.get("/all", auth, adminAuth, async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      salaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================
// 3. MARK AS PAID (ADMIN)
// ==========================
router.put("/pay/:id", auth, adminAuth, async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found",
      });
    }

    salary.status = "Paid";
    salary.paidDate = new Date();

    await salary.save();

    res.json({
      success: true,
      message: "Salary marked as Paid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================
// 4. EMPLOYEE SALARY VIEW
// ==========================
router.get("/my", auth, async (req, res) => {
  try {
    const salaries = await Salary.find({
      employee: req.employee.id,
    });

    res.json({
      success: true,
      salaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;