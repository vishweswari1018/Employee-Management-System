import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";


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
    <div className="profile-layout">
      <SideBar />

      <div className="profile-main">
        <NavBar />

        <div className="profile-card">
          <h2>My Profile</h2>

          <form onSubmit={handleSubmit}>

            {/* Read Only Fields */}

            <div className="form-group">
              <label>Employee ID</label>

              <input
                type="text"
                value={employee.employeeId}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                value={employee.name}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={employee.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Department</label>

              <input
                type="text"
                value={employee.department}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Salary</label>

              <input
                type="text"
                value={`₹${employee.salary}`}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Joining Date</label>

              <input
                type="text"
                value={
                  employee.joiningDate
                    ? new Date(
                        employee.joiningDate
                      ).toLocaleDateString()
                    : ""
                }
                disabled
              />
            </div>

            {/* Editable Fields */}

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={employee.gender || ""}
                onChange={handleChange}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Age</label>

              <input
                type="number"
                name="age"
                value={employee.age || ""}
                onChange={handleChange}
                min="18"
                max="65"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dob"
                value={employee.dob || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Experience (Years)</label>

              <input
                type="number"
                name="experience"
                value={
                  employee.experience || ""
                }
                onChange={handleChange}
                min="0"
              />
            </div>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Profile"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;