import { COLORS } from "../../constants/colors";

export const Select = ({ label, value, onChange, options, minW = 140 }) => (
  <div>
    {label && <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.gray500, display: "block", marginBottom: 6 }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${COLORS.gray200}`,
        fontSize: 12,
        fontWeight: 600,
        color: COLORS.gray900,
        background: COLORS.gray50,
        minWidth: minW,
        width: label ? "100%" : undefined,
        cursor: "pointer",
        transition: "all 0.15s ease"
      }}
    >
      {options.map((o, i) => (
        <option key={i} value={typeof o === "string" ? o : o.value}>
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  </div>
);
