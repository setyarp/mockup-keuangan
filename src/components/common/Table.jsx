import { COLORS } from "../../constants/colors";

export const Table = ({ columns, data, alignRightCols = [] }) => (
  <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
      <thead>
        <tr style={{ background: "#1E293B", color: COLORS.white }}>
          {columns.map((c, i) => (
            <th
              key={i}
              style={{
                padding: "11px 14px",
                textAlign: alignRightCols.includes(i) ? "right" : "left",
                fontWeight: 700,
                color: COLORS.white,
                borderBottom: "1px solid #334155",
                borderRight: i < columns.length - 1 ? "1px solid #334155" : "none",
                whiteSpace: "nowrap",
                letterSpacing: 0.2
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            style={{
              borderBottom: `1px solid #E2E8F0`,
              background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
              transition: "background 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "10px 14px",
                  color: "#0F172A",
                  borderRight: j < row.length - 1 ? "1px solid #E2E8F0" : "none",
                  textAlign: alignRightCols.includes(j) ? "right" : "left",
                  fontSize: 12.5
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
