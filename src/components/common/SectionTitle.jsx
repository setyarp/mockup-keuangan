import { COLORS } from "../../constants/colors";

export const SectionTitle = ({ children, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>{children}</h3>
    {action}
  </div>
);
