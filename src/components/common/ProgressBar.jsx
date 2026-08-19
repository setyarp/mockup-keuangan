import { COLORS } from "../../constants/colors";

export const ProgressBar = ({ value, max, color = COLORS.blue }) => (
  <div style={{ height: 8, background: COLORS.gray200, borderRadius: 4, overflow: "hidden", width: "100%" }}>
    <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 4, transition: "width 0.4s" }} />
  </div>
);
