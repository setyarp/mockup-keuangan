import { COLORS } from "../../constants/colors";

export const Select = ({ label, value, onChange, options, minW = 140 }) => (
  <div>
    {label && <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${COLORS.gray300}`,
        fontSize: 13,
        color: COLORS.gray700,
        background: COLORS.white,
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
