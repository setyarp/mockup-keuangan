import { COLORS } from "../../constants/colors";

// Mengikuti DataTable.tsx di FE: kepala tabel terang (slate-50) dengan teks
// kecil huruf besar, tanpa zebra dan tanpa garis vertikal — hanya pemisah
// baris tipis dan sorot saat kursor lewat.
export const Table = ({ columns, data, alignRightCols = [] }) => (
  <div
    style={{
      overflowX: "auto",
      borderRadius: 12,
      border: `1px solid ${COLORS.gray200}`,
      background: COLORS.white,
      boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
    }}
  >
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ background: COLORS.gray50, borderBottom: `1px solid ${COLORS.gray200}` }}>
          {columns.map((c, i) => (
            <th
              key={i}
              style={{
                padding: "11px 16px",
                textAlign: alignRightCols.includes(i) ? "right" : "left",
                fontWeight: 800,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: COLORS.gray500,
                whiteSpace: "nowrap",
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
              borderBottom: `1px solid ${COLORS.gray100}`,
              background: COLORS.white,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,250,252,0.9)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.white)}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "13px 16px",
                  color: COLORS.gray700,
                  fontWeight: 600,
                  textAlign: alignRightCols.includes(j) ? "right" : "left",
                  fontSize: 12,
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
