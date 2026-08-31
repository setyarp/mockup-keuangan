import { COLORS } from "../../constants/colors";

export const Badge = ({ children, color = "blue" }) => {
  const map = {
    blue: { bg: "#EFF6FF", text: "#1D4ED8", line: "#BFDBFE" },
    green: { bg: COLORS.greenLight, text: "#047857", line: "#A7F3D0" },
    red: { bg: COLORS.redLight, text: "#9F1239", line: "#FECDD3" },
    orange: { bg: COLORS.orangeLight, text: "#92400E", line: "#FDE68A" },
    yellow: { bg: COLORS.orangeLight, text: "#92400E", line: "#FDE68A" },
    gray: { bg: COLORS.gray100, text: COLORS.gray500, line: COLORS.gray200 },
  };
  const c = map[color] || map.blue;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.line}`,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};
