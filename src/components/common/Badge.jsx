import { COLORS } from "../../constants/colors";

export const Badge = ({ children, color = "blue" }) => {
  const map = {
    blue: { bg: "#E3F2FD", text: COLORS.blue },
    green: { bg: COLORS.greenLight, text: COLORS.green },
    red: { bg: COLORS.redLight, text: COLORS.red },
    orange: { bg: COLORS.orangeLight, text: COLORS.orange },
    yellow: { bg: COLORS.yellowLight, text: "#F57F17" },
    gray: { bg: COLORS.gray200, text: COLORS.gray700 },
  };
  const c = map[color] || map.blue;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "2px 10px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};
