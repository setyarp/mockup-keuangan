import { COLORS } from "../../constants/colors";

export const StatCard = ({ icon, label, value, sub, color = COLORS.blue, link }) => {
  const strVal = String(value || "");
  const fontSize = strVal.length > 20 ? 14 : strVal.length > 16 ? 16 : strVal.length > 12 ? 19 : strVal.length > 9 ? 22 : 26;
  return (
    <div
      className="hover-lift"
      style={{
        background: COLORS.white,
        borderRadius: 10,
        padding: "18px 20px",
        flex: 1,
        minWidth: 180,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: `1px solid ${COLORS.gray200}`,
        overflow: "hidden",
        cursor: link ? "pointer" : "default"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "transform 0.2s ease" }}>{icon}</div>
        <span style={{ fontSize: 11, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      </div>
      <div style={{ fontSize: fontSize, fontWeight: 700, color: COLORS.gray900, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={strVal}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.gray500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</div>}
      {link && <div style={{ fontSize: 12, color: COLORS.blue, marginTop: 8, cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>{link} ↗</div>}
    </div>
  );
};
