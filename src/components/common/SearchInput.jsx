import { COLORS } from "../../constants/colors";

export const SearchInput = ({ value, onChange, placeholder = "Cari...", minW = 180 }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      padding: "8px 12px",
      borderRadius: 6,
      border: `1px solid ${COLORS.gray300}`,
      fontSize: 13,
      minWidth: minW,
      transition: "all 0.15s ease"
    }}
  />
);
