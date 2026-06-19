import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../EMComponents/SideBar";
import NavBar from "../EMComponents/NavBar";


function Salary() {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/salary/my",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSalaries(res.data.salaries);
  };

  return (
    <div className="salary-layout d-flex w-100 vh-100 overflow-hidden">
      <SideBar />

      <div className="salary-main flex-grow-1 bg-light d-flex flex-column overflow-y-auto">
        <NavBar />

        <div className="container-fluid py-4 px-4 flex-grow-1 dashboard-content-wrapper">
          <h2 className="fw-bold text-primary mb-4 pb-2">My Salary History</h2>

            {salaries.length === 0 ? (
              <div className="text-center text-muted p-5 bg-light rounded-3 mt-4">
                <p className="mb-0 fs-5">No salary records found</p>
              </div>
            ) : (
              <div className="row g-4">
                {salaries.map((s) => (
                  <div key={s._id} className="col-12 col-md-6 col-lg-4">
                    <div className="salary-slip-card p-4 rounded-3 border-0 shadow-sm bg-white h-100 position-relative">
                      
                      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                        <h5 className="fw-bold text-dark mb-0">{s.month}</h5>
                        <span className={`badge rounded-pill px-3 py-2 ${s.status === 'Paid' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'}`}>
                          {s.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-muted small text-uppercase mb-1 fw-semibold">Net Amount</p>
                        <h3 className="fw-bold text-success mb-0">₹{s.amount.toLocaleString()}</h3>
                      </div>

                      <div className="mt-auto pt-3 border-top">
                        <p className="text-muted small mb-0 fw-medium">
                          <i className="me-2 text-primary">🗓️</i> Paid On:{" "}
                          <span className="text-dark fw-bold">
                            {s.paidDate ? new Date(s.paidDate).toLocaleDateString() : "Pending"}
                          </span>
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Salary;