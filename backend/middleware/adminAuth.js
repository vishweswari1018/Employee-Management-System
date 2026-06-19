const adminAuth = (req, res, next) => {
  try {
    // auth.js middleware should run before this
    // auth.js adds req.employee from JWT

    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Check admin role
    if (req.employee.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};

module.exports = adminAuth;