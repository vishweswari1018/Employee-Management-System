import { useEffect, useRef, useState } from "react";
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
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

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
        dob: emp.dob ? emp.dob.split("T")[0] : "",
      });

      if (emp.profilePhoto) {
        setPhotoPreview(`http://localhost:5000${emp.profilePhoto}`);
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to load profile"
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

  // Handle Photo File Selection → preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      alert("Only image files are allowed (JPEG, PNG, WEBP, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // Auto-upload
    handlePhotoUpload(file);
  };

  // Upload Photo to Backend
  const handlePhotoUpload = async (file) => {
    setPhotoUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await axios.post(
        "http://localhost:5000/api/employees/profile/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPhotoPreview(
        `http://localhost:5000${response.data.profilePhoto}?t=${Date.now()}`
      );
      alert("Profile photo updated successfully!");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to upload photo"
      );
      // Revert preview if upload failed
      if (employee.profilePhoto) {
        setPhotoPreview(`http://localhost:5000${employee.profilePhoto}`);
      } else {
        setPhotoPreview(null);
      }
    } finally {
      setPhotoUploading(false);
    }
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
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate initials avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-layout d-flex w-100 vh-100 overflow-hidden">
      <SideBar />

      <div className="profile-main flex-grow-1 bg-light d-flex flex-column overflow-y-auto">
        <NavBar />

        <div className="container-fluid py-4 px-4 d-flex flex-column flex-grow-1 dashboard-content-wrapper">
          <div className="profile-card bg-white rounded-4 shadow-sm p-4 border-0 mb-4 flex-grow-1">
            <h2 className="fw-bold text-primary mb-4 pb-2 border-bottom">My Profile</h2>

            {/* ── Photo Upload Section ── */}
            <div className="photo-upload-section mb-4">
              <div className="photo-avatar-wrapper">
                {/* Avatar Circle */}
                <div
                  className="photo-avatar"
                  onClick={() => !photoUploading && fileInputRef.current.click()}
                  title="Click to change photo"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="photo-avatar-img"
                    />
                  ) : (
                    <div className="photo-avatar-initials">
                      {getInitials(employee.name)}
                    </div>
                  )}

                  {/* Camera overlay */}
                  <div className={`photo-overlay ${photoUploading ? "uploading" : ""}`}>
                    {photoUploading ? (
                      <div className="photo-spinner" />
                    ) : (
                      <svg
                        className="photo-camera-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" />
                        <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="d-none"
                  onChange={handlePhotoChange}
                  id="profilePhotoInput"
                />
              </div>

              <div className="photo-meta">
                <h5 className="photo-name mb-1">{employee.name || "Employee"}</h5>
                <p className="photo-dept mb-0 text-muted">{employee.department || "—"}</p>
                <button
                  type="button"
                  className="photo-upload-btn mt-2"
                  onClick={() => !photoUploading && fileInputRef.current.click()}
                  disabled={photoUploading}
                >
                  {photoUploading ? (
                    <>
                      <span className="btn-spinner me-2" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="me-2"
                      >
                        <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
                      </svg>
                      Upload Photo
                    </>
                  )}
                </button>
                <p className="photo-hint mt-1">JPEG, PNG, WEBP or GIF · max 5 MB</p>
              </div>
            </div>

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