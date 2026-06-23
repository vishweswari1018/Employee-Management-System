const express = require("express");
const Employee = require("../models/Employee");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ==========================
// MULTER CONFIG FOR PHOTOS
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "profile-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, WEBP, GIF)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});


// ==========================
// UPLOAD PROFILE PHOTO (EMPLOYEE)
// ==========================
router.post("/profile/photo", auth, upload.single("profilePhoto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const employee = await Employee.findById(req.employee.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Delete old photo if exists
    if (employee.profilePhoto) {
      const oldPath = path.join(__dirname, "../", employee.profilePhoto);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save relative URL
    employee.profilePhoto = `/uploads/${req.file.filename}`;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      profilePhoto: employee.profilePhoto,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});


// ==========================
// GET PROFILE (EMPLOYEE)
// ==========================
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================
// GET ALL EMPLOYEES (ADMIN)
// ==========================
router.get("/employees", auth, adminAuth, async (req, res) => {
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// ==========================
// ADD EMPLOYEE (ADMIN)
// ==========================
router.post("/employees", auth, adminAuth, async (req, res) => {
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

    if (!email.endsWith("@gprec.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "Email must end with @gprec.ac.in",
      });
    }

    const existing = await Employee.findOne({
      $or: [
        { employeeId: employeeId.toUpperCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const employee = await Employee.create({
      employeeId: employeeId.toUpperCase(),
      name,
      email: email.toLowerCase(),
      department,
      salary: Number(salary),
      joiningDate,
      role: "employee",
      status: "Pending Activation",
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee,
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
// UPDATE EMPLOYEE (ADMIN)
// ==========================
router.put("/employees/:id", auth, adminAuth, async (req, res) => {
  try {
    const { email, phone, department, salary, joiningDate } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot edit admin",
      });
    }

    if (email !== undefined) {
      if (!email.endsWith("@gprec.ac.in")) {
        return res.status(400).json({
          success: false,
          message: "Email must end with @gprec.ac.in",
        });
      }
      employee.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      employee.phone = phone;
    }

    if (department !== undefined) {
      employee.department = department;
    }

    if (salary !== undefined) {
      employee.salary = Number(salary);
    }

    if (joiningDate !== undefined) {
      employee.joiningDate = joiningDate;
    }

    await employee.save();

    const updated = await Employee.findById(employee._id);

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee: updated,
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
// DELETE EMPLOYEE (ADMIN)
// ==========================
router.delete("/employees/:id", auth, adminAuth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin",
      });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Employee deleted successfully",
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
// UPDATE PROFILE (EMPLOYEE)
// ==========================
router.put("/profile", auth, async (req, res) => {
  try {
    const { gender, age, dob, experience, phone } = req.body;

    const employee = await Employee.findById(req.employee.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (gender !== undefined) employee.gender = gender;
    if (age !== undefined) employee.age = age;
    if (dob !== undefined) employee.dob = dob;
    if (phone !== undefined) employee.phone = phone;

    if (experience !== undefined) {
      employee.experience = Number(experience);
    }

    await employee.save();

    const updated = await Employee.findById(employee._id)
      .select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      employee: updated,
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
// LEAVE BALANCE
// ==========================
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

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;