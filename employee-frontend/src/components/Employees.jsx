import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "../styles/Employees.css";

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    salary: "",
    joiningDate: "",
  });

  const [editEmployee, setEditEmployee] = useState(null);
  const [detailsEmployee, setDetailsEmployee] = useState(null);

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

  // Open Details Modal
  const handleDetailsClick = (employee) => {
    setDetailsEmployee(employee);
    setShowDetailsModal(true);
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
    <div className="employees-layout d-flex w-100 vh-100 overflow-hidden">
      <AdminSidebar />

      <div className="employees-main flex-grow-1 d-flex flex-column overflow-y-auto">
        <AdminNavbar />
        
        <div className="container-fluid py-4 px-4 d-flex flex-column flex-grow-1">
          <div className="employees-container bg-white p-4 rounded-4 shadow-sm border-0 flex-grow-1 d-flex flex-column">
            <div className="employees-header d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h2 className="fw-bold text-primary mb-0">Employees Directory</h2>

              <button
                className="btn btn-primary fw-bold shadow-sm rounded-pill px-4 btn-add"
                onClick={() => setShowAddModal(true)}
              >
                + Add Employee
              </button>
            </div>

      <div className="table-responsive flex-grow-1">
        <table className="table table-hover custom-table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">ID</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">Name</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">Email</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">Department</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">Salary</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">Joined</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3">Status</th>
              <th className="text-uppercase text-muted small fw-semibold border-0 py-3 text-end pe-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td className="fw-semibold text-muted">{employee.employeeId}</td>
                  <td className="fw-bold text-dark">{employee.name}</td>
                  <td className="text-muted">{employee.email}</td>
                  <td><span className="badge bg-light text-dark border px-2 py-1">{employee.department}</span></td>

                  <td className="fw-bold text-success">
                    ₹{employee.salary?.toLocaleString()}
                  </td>

                  <td className="text-muted fw-medium">
                    {new Date(
                      employee.joiningDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        employee.status === "Active"
                          ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                          : "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td className="pe-3">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm btn-outline-info fw-bold rounded-pill px-3"
                        onClick={() => handleDetailsClick(employee)}
                      >
                        Details
                      </button>

                      <button
                        className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3"
                        onClick={() => handleEditClick(employee)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3"
                        onClick={() => handleDelete(employee._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-5 text-muted"
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
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3 className="mb-4 fw-bold text-primary border-bottom pb-2">Add Employee</h3>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Employee ID</label>
              <input
                className="form-control form-control-lg custom-input"
                type="text"
                placeholder="e.g. EMP001"
                value={newEmployee.employeeId}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    employeeId: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Full Name</label>
              <input
                className="form-control form-control-lg custom-input"
                type="text"
                placeholder="Jane Doe"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Email Address</label>
              <input
                className="form-control form-control-lg custom-input"
                type="email"
                placeholder="jane@company.ac.in"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Department</label>
              <select
                className="form-select form-select-lg custom-input"
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
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Salary (₹)</label>
              <input
                className="form-control form-control-lg custom-input"
                type="number"
                placeholder="e.g. 50000"
                value={newEmployee.salary}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    salary: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label text-muted small fw-bold mb-1">Joining Date</label>
              <input
                className="form-control form-control-lg custom-input"
                type="date"
                value={newEmployee.joiningDate}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    joiningDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-buttons d-flex justify-content-end gap-3 border-top pt-3">
              <button
                className="btn btn-light fw-bold px-4 shadow-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary fw-bold px-4 shadow-sm"
                onClick={handleAddEmployee}
              >
                Save Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editEmployee && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3 className="mb-4 fw-bold text-primary border-bottom pb-2">Edit Employee</h3>

            <div className="bg-light p-3 rounded-3 mb-4 border">
              <p className="mb-1 text-muted small">
                Employee ID: <strong className="text-dark fs-6">{editEmployee.employeeId}</strong>
              </p>
              <p className="mb-0 text-muted small">
                Name: <strong className="text-dark fs-6">{editEmployee.name}</strong>
              </p>
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Email Address</label>
              <input
                className="form-control form-control-lg custom-input"
                type="email"
                value={editEmployee.email}
                onChange={(e) =>
                  setEditEmployee({
                    ...editEmployee,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Department</label>
              <select
                className="form-select form-select-lg custom-input"
                value={editEmployee.department}
                onChange={(e) =>
                  setEditEmployee({
                    ...editEmployee,
                    department: e.target.value,
                  })
                }
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-muted small fw-bold mb-1">Salary (₹)</label>
              <input
                className="form-control form-control-lg custom-input"
                type="number"
                value={editEmployee.salary}
                onChange={(e) =>
                  setEditEmployee({
                    ...editEmployee,
                    salary: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label text-muted small fw-bold mb-1">Joining Date</label>
              <input
                className="form-control form-control-lg custom-input"
                type="date"
                value={editEmployee.joiningDate?.split("T")[0]}
                onChange={(e) =>
                  setEditEmployee({
                    ...editEmployee,
                    joiningDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-buttons d-flex justify-content-end gap-3 border-top pt-3">
              <button
                className="btn btn-light fw-bold px-4 shadow-sm"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary fw-bold px-4 shadow-sm"
                onClick={handleUpdateEmployee}
              >
                Update Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Employee Modal */}
      {showDetailsModal && detailsEmployee && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content" style={{ maxWidth: '700px' }}>
            <h3 className="mb-4 fw-bold text-info border-bottom pb-2">Employee Details</h3>
            
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Employee ID</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.employeeId}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Name</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.name}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Email</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.email}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Phone Number</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.phone || "Not provided"}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Department</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.department}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Salary</p>
                <p className="fw-semibold text-success border-bottom pb-2">₹{detailsEmployee.salary?.toLocaleString()}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Joining Date</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{new Date(detailsEmployee.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Status</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.status}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Gender</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.gender || "Not specified"}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Age</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.age || "Not specified"}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Date of Birth</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.dob ? new Date(detailsEmployee.dob).toLocaleDateString() : "Not specified"}</p>
              </div>
              <div className="col-md-6">
                <p className="mb-1 text-muted small fw-bold text-uppercase">Experience (Years)</p>
                <p className="fw-semibold text-dark border-bottom pb-2">{detailsEmployee.experience ?? 0}</p>
              </div>
            </div>

            <div className="modal-buttons d-flex justify-content-end gap-3 border-top pt-3">
              <button
                className="btn btn-secondary fw-bold px-4 shadow-sm"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;