import { useState } from "react";

export const Tooltip = ({ content, children, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <span
          style={{
            position: "absolute",
            ...(position === "top"
              ? { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }
              : position === "bottom"
              ? { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }
              : { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" }),
            backgroundColor: "#0F172A",
            color: "#F8FAFC",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 500,
            lineHeight: 1.45,
            whiteSpace: "normal",
            width: "max-content",
            maxWidth: 320,
            zIndex: 9999,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
            pointerEvents: "none",
            textAlign: "left"
          }}
        >
          {content}
          <span
            style={{
              position: "absolute",
              ...(position === "top"
                ? {
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderColor: "#0F172A transparent transparent transparent"
                  }
                : position === "bottom"
                ? {
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderColor: "transparent transparent #0F172A transparent"
                  }
                : {
                    right: "100%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderWidth: 5,
                    borderStyle: "solid",
                    borderColor: "transparent #0F172A transparent transparent"
                  })
            }}
          />
        </span>
      )}
    </span>
  );
};
