import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";
import "../styles/Profile.css";

function Profile() {
  const [employee, setEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    salary: "",
    joiningDate: "",
    gender: "",
    age: "",
    dob: "",
    experience: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Get Employee Profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/employees/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const emp = response.data.employee;

      setEmployee({
        ...emp,
        dob: emp.dob
          ? emp.dob.split("T")[0]
          : "",
      });
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to load profile"
      );
    }
  };

  // Handle Editable Fields
  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  // Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/employees/profile",
        {
          gender: employee.gender,
          age: employee.age,
          dob: employee.dob,
          experience: employee.experience,
          phone: employee.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      fetchProfile();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-layout d-flex w-100 vh-100 overflow-hidden">
      <SideBar />

      <div className="profile-main flex-grow-1 bg-light d-flex flex-column overflow-y-auto">
        <NavBar />

        <div className="container-fluid py-4 px-4 d-flex flex-column flex-grow-1 dashboard-content-wrapper">
          <div className="profile-card bg-white rounded-4 shadow-sm p-4 border-0 mb-4 flex-grow-1">
            <h2 className="fw-bold text-primary mb-4 pb-2 border-bottom">My Profile</h2>

            <form onSubmit={handleSubmit} className="row g-4">

              {/* Read Only Fields */}
              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-muted small text-uppercase">Employee ID</label>
                <input type="text" className="form-control bg-light" value={employee.employeeId} disabled />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-muted small text-uppercase">Name</label>
                <input type="text" className="form-control bg-light" value={employee.name} disabled />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-muted small text-uppercase">Email</label>
                <input type="email" className="form-control bg-light" value={employee.email} disabled />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-muted small text-uppercase">Department</label>
                <input type="text" className="form-control bg-light" value={employee.department} disabled />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-muted small text-uppercase">Salary</label>
                <input type="text" className="form-control bg-light fw-bold text-success" value={`₹${employee.salary}`} disabled />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-muted small text-uppercase">Joining Date</label>
                <input type="text" className="form-control bg-light" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : ""} disabled />
              </div>

              <div className="col-12 mt-4 mb-2">
                <h5 className="fw-bold text-dark border-bottom pb-2">Editable Information</h5>
              </div>

              {/* Editable Fields */}
              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase">Gender</label>
                <select className="form-select custom-input" name="gender" value={employee.gender || ""} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase">Age</label>
                <input type="number" className="form-control custom-input" name="age" value={employee.age || ""} onChange={handleChange} min="18" max="65" />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase">Date of Birth</label>
                <input type="date" className="form-control custom-input" name="dob" value={employee.dob || ""} onChange={handleChange} />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase">Experience (Years)</label>
                <input type="number" className="form-control custom-input" name="experience" value={employee.experience || ""} onChange={handleChange} min="0" />
              </div>

              <div className="col-md-6 form-group">
                <label className="form-label fw-semibold text-dark small text-uppercase">Phone Number</label>
                <input type="text" className="form-control custom-input" name="phone" value={employee.phone || ""} onChange={handleChange} placeholder="e.g. +91 9876543210" />
              </div>

              <div className="col-12 mt-4 pt-3 border-top">
                <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm save-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;