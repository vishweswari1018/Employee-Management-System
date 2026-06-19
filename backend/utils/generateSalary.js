const Employee = require("../models/Employee");
const Salary = require("../models/Salary");

const generateMonthlySalary = async () => {
  try {
    const employees = await Employee.find();

    const month = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    for (let emp of employees) {
      const exists = await Salary.findOne({
        employeeId: emp.employeeId,
        month: month,
      });

      if (!exists) {
        await Salary.create({
          employee: emp._id,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          month: month,
          amount: emp.salary,
          status: "Unpaid",
        });

        console.log(`Salary created for ${emp.employeeId}`);
      }
    }

    console.log("✅ Monthly Salary Generation Completed");
  } catch (error) {
    console.log("Salary generation error:", error.message);
  }
};

module.exports = generateMonthlySalary;