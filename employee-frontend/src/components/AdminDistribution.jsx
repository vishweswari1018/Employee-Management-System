import "../styles/AdminDistribution.css";

const DEPT_COLORS = [
  { bar: "linear-gradient(90deg, #6366f1, #8b5cf6)", light: "rgba(99,102,241,0.1)", text: "#6366f1" },
  { bar: "linear-gradient(90deg, #0ea5e9, #38bdf8)", light: "rgba(14,165,233,0.1)", text: "#0ea5e9" },
  { bar: "linear-gradient(90deg, #10b981, #34d399)", light: "rgba(16,185,129,0.1)", text: "#10b981" },
  { bar: "linear-gradient(90deg, #f59e0b, #fbbf24)", light: "rgba(245,158,11,0.1)",  text: "#f59e0b" },
  { bar: "linear-gradient(90deg, #ef4444, #f87171)", light: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  { bar: "linear-gradient(90deg, #ec4899, #f472b6)", light: "rgba(236,72,153,0.1)",  text: "#ec4899" },
];

function AdminDistribution({ departmentData, totalEmployees }) {
  const maxCount = Math.max(...departmentData.map((d) => d.employees), 1);

  return (
    <div className="dist-card">
      {/* Header */}
      <div className="dist-header">
        <div>
          <h3 className="dist-title">Department Distribution</h3>
          <p className="dist-subtitle">Employee headcount across all departments</p>
        </div>
        <div className="dist-total-badge">
          <span className="dist-total-num">{totalEmployees}</span>
          <span className="dist-total-label">Total</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="dist-chart">
        {departmentData.map((dept, i) => {
          const color = DEPT_COLORS[i % DEPT_COLORS.length];
          const pct = totalEmployees > 0
            ? ((dept.employees / totalEmployees) * 100).toFixed(1)
            : 0;
          const barWidth = ((dept.employees / maxCount) * 100).toFixed(1);

          return (
            <div className="dist-row" key={dept.department}>
              {/* Dept label */}
              <div className="dist-label">
                <span
                  className="dist-dot"
                  style={{ background: color.bar }}
                />
                {dept.department}
              </div>

              {/* Bar track */}
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill"
                  style={{
                    width: dept.employees === 0 ? "0%" : `${barWidth}%`,
                    background: color.bar,
                  }}
                />
              </div>

              {/* Count + percent */}
              <div className="dist-count">
                <span
                  className="dist-count-num"
                  style={{ color: color.text }}
                >
                  {dept.employees}
                </span>
                <span className="dist-count-pct">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div className="dist-footer">
        {departmentData.map((dept, i) => {
          const color = DEPT_COLORS[i % DEPT_COLORS.length];
          return (
            <div
              className="dist-legend-chip"
              key={dept.department}
              style={{ background: color.light, color: color.text }}
            >
              <span
                className="dist-legend-dot"
                style={{ background: color.bar }}
              />
              {dept.department}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDistribution;
