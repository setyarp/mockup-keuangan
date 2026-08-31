import { COLORS } from "../../constants/colors";

export const Btn = ({ children, variant = "primary", onClick, size = "md", style, disabled, ...props }) => {
  const styles = {
    primary: { background: COLORS.blue, color: COLORS.white, border: "1px solid transparent", hoverBg: "#1E40AF", shadow: "0 1px 2px rgba(15,23,42,0.05)" },
    outline: { background: COLORS.white, color: COLORS.blue, border: `1px solid #BFDBFE`, hoverBg: "#EFF6FF", shadow: "0 1px 2px rgba(15,23,42,0.05)" },
    danger: { background: COLORS.red, color: COLORS.white, border: "1px solid transparent", hoverBg: "#BE123C", shadow: "0 1px 2px rgba(15,23,42,0.05)" },
    ghost: { background: COLORS.white, color: COLORS.gray700, border: `1px solid ${COLORS.gray300}`, hoverBg: COLORS.gray50, shadow: "0 1px 2px rgba(15,23,42,0.05)" }
  };
  const s = styles[variant] || styles.primary;
  const pd = size === "sm" ? "6px 14px" : "9px 16px";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s,
        padding: pd,
        borderRadius: size === "sm" ? 8 : 10,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 800,
        letterSpacing: -0.1,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = s.hoverBg;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = s.shadow;
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.background = s.background;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      onMouseDown={e => {
        if (!disabled) e.currentTarget.style.transform = "translateY(0) scale(0.97)";
      }}
      onMouseUp={e => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      {...props}
    >
      {children}
    </button>
  );
};
