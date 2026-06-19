const express = require("express");
const Employee = require("../models/Employee");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();


// ========================================
// Employee: View Own Profile
// GET /profile
// ========================================

router.get("/profile", auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id)
      .select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
       const leaves = await require("../models/Leave").find({
      employee: employee._id,
      status: "Approved",
    });
    res.status(200).json({
      success: true,
      employee,
      leaves,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ========================================
// Admin: View All Employees
// GET /employees
// ========================================

router.get(
  "/employees",
  auth,
  adminAuth,
  async (req, res) => {
    try {

      const employees = await Employee.find({
        role: "employee",
      }).select("-password");

      res.status(200).json({
        success: true,
        count: employees.length,
        employees,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);


// ========================================
// Admin: Add Employee
// POST /employees
// ========================================

router.post(
  "/employees",
  auth,
  adminAuth,
  async (req, res) => {
    try {

      const {
        employeeId,
        name,
        email,
        department,
        salary,
        joiningDate,
      } = req.body;

      if (
        !employeeId ||
        !name ||
        !email ||
        !department ||
        !salary ||
        !joiningDate
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (!email.endsWith("@company.ac.in")) {
        return res.status(400).json({
          success: false,
          message:
            "Email must end with @company.ac.in",
        });
      }

      const existingEmployee =
        await Employee.findOne({
          $or: [
            {
              employeeId:
                employeeId.toUpperCase(),
            },
            {
              email:
                email.toLowerCase(),
            },
          ],
        });

      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message:
            "Employee ID or Email already exists",
        });
      }

      const employee =
        await Employee.create({
          employeeId:
            employeeId.toUpperCase(),
          name,
          email: email.toLowerCase(),
          department,
          salary,
          joiningDate,

          role: "employee",

          status:
            "Pending Activation",
        });

      res.status(201).json({
        success: true,
        message:
          "Employee added successfully",

        employee,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);


// ========================================
// Admin: Edit Employee
// PUT /employees/:id
// ========================================

router.put(
  "/employees/:id",
  auth,
  adminAuth,
  async (req, res) => {
    try {

      const {
        email,
        department,
        salary,
        joiningDate,
      } = req.body;

      const employee =
        await Employee.findById(req.params.id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found",
        });
      }

      // Admin cannot edit admin account
      if (employee.role === "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Admin account cannot be edited",
        });
      }

      if (email) {
        if (
          !email.endsWith(
            "@company.ac.in"
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Email must end with @company.ac.in",
          });
        }

        employee.email =
          email.toLowerCase();
      }

      if (department) {
        employee.department =
          department;
      }

      if (salary !== undefined) {
        employee.salary = salary;
      }

      if (joiningDate) {
        employee.joiningDate =
          joiningDate;
      }

      await employee.save();

      res.status(200).json({
        success: true,
        message:
          "Employee updated successfully",

        employee,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);


// ========================================
// Admin: Delete Employee
// DELETE /employees/:id
// ========================================

router.delete(
  "/employees/:id",
  auth,
  adminAuth,
  async (req, res) => {
    try {

      const employee =
        await Employee.findById(
          req.params.id
        );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found",
        });
      }

      if (employee.role === "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Admin account cannot be deleted",
        });
      }

      await Employee.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Employee deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
router.put("/profile", auth, async (req, res) => {
  try {
    const { gender, age, dob, experience } = req.body;

    const employee = await Employee.findById(req.employee.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // 🔥 FIXED UPDATE LOGIC (IMPORTANT)
    if (gender !== undefined) employee.gender = gender;
    if (age !== undefined) employee.age = age;
    if (dob !== undefined) employee.dob = dob;

    // 🚨 IMPORTANT FIX FOR EXPERIENCE
    if (experience !== undefined && experience !== null) {
      employee.experience = Number(experience);
    }

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      employee: updatedEmployee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
router.get("/leave-balance", auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      balance: employee.leaveBalance || {
        casual: 5,
        sick: 5,
        earned: 5,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;