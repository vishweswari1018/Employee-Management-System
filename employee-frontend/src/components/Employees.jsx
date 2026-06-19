import React, { useState, useEffect } from "react";
import axios from "axios";

const Employees = () => {
  const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
  ];

  const [employees, setEmployees] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    salary: "",
    joiningDate: "",
  });

  const [editEmployee, setEditEmployee] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch Employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/employees/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(response.data.employees);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add Employee
  const handleAddEmployee = async () => {
    if (
      !newEmployee.employeeId ||
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.department ||
      !newEmployee.salary ||
      !newEmployee.joiningDate
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Company Email Validation
    if (
      !newEmployee.email
        .toLowerCase()
        .endsWith("@company.ac.in")
    ) {
      alert("Email must end with @company.ac.in");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/employees/employees",
        {
          employeeId: newEmployee.employeeId,
          name: newEmployee.name,
          email: newEmployee.email,
          department: newEmployee.department,
          salary: Number(newEmployee.salary),
          joiningDate: newEmployee.joiningDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchEmployees();

      setNewEmployee({
        employeeId: "",
        name: "",
        email: "",
        department: "",
        salary: "",
        joiningDate: "",
      });

      setShowAddModal(false);

      alert("Employee added successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add employee."
      );
    }
  };

  // Open Edit Modal
  const handleEditClick = (employee) => {
    setEditEmployee({ ...employee });
    setShowEditModal(true);
  };
    // Update Employee
  const handleUpdateEmployee = async () => {
    if (
      !editEmployee.email ||
      !editEmployee.department ||
      !editEmployee.salary ||
      !editEmployee.joiningDate
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (
      !editEmployee.email
        .toLowerCase()
        .endsWith("@company.ac.in")
    ) {
      alert("Email must end with @company.ac.in");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/employees/employees/${editEmployee._id}`,
        {
          email: editEmployee.email,
          department: editEmployee.department,
          salary: Number(editEmployee.salary),
          joiningDate: editEmployee.joiningDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchEmployees();

      setShowEditModal(false);

      alert("Employee updated successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update employee."
      );
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/employees/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchEmployees();

      alert("Employee deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete employee."
      );
    }
  };

  if (loading) {
    return <h2>Loading Employees...</h2>;
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h2>Employees</h2>

        <button
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Employee
        </button>
      </div>

      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>

                  <td>
                    ₹
                    {employee.salary?.toLocaleString()}
                  </td>

                  <td>
                    {new Date(
                      employee.joiningDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        employee.status === "Active"
                          ? "active"
                          : "pending"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditClick(employee)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(employee._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="no-data"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Employee</h3>

            <input
              type="text"
              placeholder="Employee ID"
              value={newEmployee.employeeId}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  employeeId: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  email: e.target.value,
                })
              }
            />

            <select
              value={newEmployee.department}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  department: e.target.value,
                })
              }
            >
              <option value="">
                Select Department
              </option>

              {departments.map((dept) => (
                <option
                  key={dept}
                  value={dept}
                >
                  {dept}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Salary"
              value={newEmployee.salary}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  salary: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={newEmployee.joiningDate}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  joiningDate: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={handleAddEmployee}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Employee</h3>

            <p className="readonly-field">
              Employee ID:
              <strong>
                {" "}
                {editEmployee.employeeId}
              </strong>
            </p>

            <p className="readonly-field">
              Name:
              <strong>
                {" "}
                {editEmployee.name}
              </strong>
            </p>

            <input
              type="email"
              value={editEmployee.email}
              onChange={(e) =>
                setEditEmployee({
                  ...editEmployee,
                  email: e.target.value,
                })
              }
            />

            <select
              value={editEmployee.department}
              onChange={(e) =>
                setEditEmployee({
                  ...editEmployee,
                  department: e.target.value,
                })
              }
            >
              {departments.map((dept) => (
                <option
                  key={dept}
                  value={dept}
                >
                  {dept}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={editEmployee.salary}
              onChange={(e) =>
                setEditEmployee({
                  ...editEmployee,
                  salary: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={
                editEmployee.joiningDate?.split(
                  "T"
                )[0]
              }
              onChange={(e) =>
                setEditEmployee({
                  ...editEmployee,
                  joiningDate: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={handleUpdateEmployee}
              >
                Update
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;