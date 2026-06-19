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
    <div style={{ display: "flex" }}>
      <SideBar />

      <div style={{ width: "100%" }}>
        <NavBar />

        <h2>My Salary</h2>

        {salaries.map((s) => (
          <div key={s._id} style={{ border: "1px solid #ddd", padding: 10 }}>
            <h4>{s.month}</h4>
            <p>Amount: ₹{s.amount}</p>
            <p>Status: {s.status}</p>
            <p>
              Paid Date:{" "}
              {s.paidDate
                ? new Date(s.paidDate).toLocaleDateString()
                : "Not Paid"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Salary;