import { COLORS } from "../../constants/colors";

export const SearchInput = ({ value, onChange, placeholder = "Cari...", minW = 180 }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      padding: "8px 12px",
      borderRadius: 8,
      border: `1px solid ${COLORS.gray200}`,
      background: COLORS.gray50,
      color: COLORS.gray900,
      fontSize: 12,
      fontWeight: 600,
      minWidth: minW,
      transition: "all 0.15s ease"
    }}
  />
);
