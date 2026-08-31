import { COLORS } from "../../constants/colors";

export const ProgressBar = ({ value, max, color = COLORS.blue }) => (
  <div style={{ height: 6, background: COLORS.gray100, borderRadius: 999, overflow: "hidden", width: "100%" }}>
    <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 999, transition: "width 0.4s" }} />
  </div>
);
