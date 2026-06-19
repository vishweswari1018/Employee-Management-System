


function DepartmentDistribution() {
  const departments = [
    { department: "IT", count: 40 },
    { department: "HR", count: 15 },
    { department: "Finance", count: 20 },
    { department: "Marketing", count: 18 },
    { department: "Operations", count: 12 },
    { department: "Sales", count: 15 },
  ];

  const totalEmployees = departments.reduce(
    (total, dept) => total + dept.count,
    0
  );

  return (
    <div className="distribution-card">
      <h2>Department Distribution</h2>

      <table className="distribution-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Employees</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept.department}>
              <td>{dept.department}</td>
              <td>{dept.count}</td>
            </tr>
          ))}

          <tr className="total-row">
            <td>Total</td>
            <td>{totalEmployees}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentDistribution;