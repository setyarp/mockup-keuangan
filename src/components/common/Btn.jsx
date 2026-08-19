import { COLORS } from "../../constants/colors";

export const Btn = ({ children, variant = "primary", onClick, size = "md", style, disabled, ...props }) => {
  const styles = {
    primary: { background: COLORS.blue, color: COLORS.white, border: "none", hoverBg: COLORS.blueDark, shadow: "0 2px 6px rgba(21,101,192,0.25)" },
    outline: { background: "transparent", color: COLORS.blue, border: `1px solid ${COLORS.blue}`, hoverBg: "#E3F2FD", shadow: "0 2px 4px rgba(21,101,192,0.12)" },
    danger: { background: COLORS.red, color: COLORS.white, border: "none", hoverBg: "#B71C1C", shadow: "0 2px 6px rgba(198,40,40,0.25)" },
    ghost: { background: "transparent", color: COLORS.gray700, border: `1px solid ${COLORS.gray300}`, hoverBg: "#F1F5F9", shadow: "0 1px 3px rgba(0,0,0,0.06)" }
  };
  const s = styles[variant] || styles.primary;
  const pd = size === "sm" ? "6px 12px" : "8px 18px";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s,
        padding: pd,
        borderRadius: 6,
        fontSize: size === "sm" ? 12 : 13,
        fontWeight: 600,
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
