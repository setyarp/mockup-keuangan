import { ChevronDown } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { MENU, ICON_MAP } from "../../constants/menu";

export const Sidebar = ({
  activePage,
  setActivePage,
  expandedMenus,
  setExpandedMenus,
}) => {
  const toggleMenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const isChildActive = (children) => children?.some((c) => c.id === activePage);

  const renderIcon = (iconKey, size = 16, color) => {
    const IconComp = ICON_MAP[iconKey];
    return IconComp ? <IconComp size={size} color={color} /> : null;
  };

  return (
    <div
      style={{
        width: 256,
        background: COLORS.white,
        borderRight: `1px solid ${COLORS.gray200}`,
        overflowY: "auto",
        flexShrink: 0,
        padding: "0 12px",
        userSelect: "none",
      }}
    >
      {MENU.map((section, si) => (
        <div key={si} style={{ paddingTop: si === 0 ? 12 : 4, paddingBottom: 4 }}>
          {/* Section Header */}
          <div
            style={{
              padding: "8px 10px 6px",
              fontSize: 10,
              fontWeight: 700,
              color: COLORS.gray400,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            {section.section}
          </div>

          {section.items.map((item, ii) => {
            // Standalone item (no children)
            if (!item.children) {
              const isActive = activePage === item.id;
              return (
                <button
                  key={ii}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: isActive ? "9px 10px 9px 6px" : "8px 10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    textAlign: "left",
                    transition: "background 0.12s ease, color 0.12s ease",
                    background: isActive ? "rgba(239,246,255,0.8)" : "transparent",
                    color: isActive ? "#1E40AF" : COLORS.gray700,
                    fontWeight: isActive ? 700 : 600,
                    borderLeft: isActive ? `4px solid ${COLORS.blueLight}` : "none",
                    borderRadius: isActive ? "0 8px 8px 0" : 8,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = COLORS.gray50;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      opacity: isActive ? 1 : 0.6,
                      transition: "transform 0.15s ease",
                    }}
                  >
                    {renderIcon(item.icon, 16, isActive ? COLORS.blue : COLORS.gray400)}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            }

            // Parent with children (collapsible)
            const isExpanded = expandedMenus.includes(item.label) || isChildActive(item.children);
            const hasActiveChild = isChildActive(item.children);

            return (
              <div key={ii}>
                {/* Parent button */}
                <button
                  onClick={() => toggleMenu(item.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "8px 10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    textAlign: "left",
                    background: hasActiveChild ? COLORS.gray50 : "transparent",
                    transition: "background 0.12s ease, color 0.12s ease",
                    color: hasActiveChild ? "#1E40AF" : COLORS.gray700,
                    fontWeight: hasActiveChild ? 700 : 600,
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.gray50)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = hasActiveChild ? COLORS.gray50 : "transparent")
                  }
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", opacity: hasActiveChild ? 1 : 0.6 }}>
                      {renderIcon(item.icon, 16, hasActiveChild ? COLORS.blue : COLORS.gray400)}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    color={COLORS.gray400}
                    style={{
                      transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                {/* Children */}
                {isExpanded && (
                  <div
                    style={{
                      overflow: "hidden",
                      marginLeft: 16,
                      paddingLeft: 8,
                      borderLeft: `1px solid ${COLORS.gray100}`,
                    }}
                  >
                    {item.children.map((child, ci) => {
                      const isActive = activePage === child.id;
                      const isDisabled = child.disabled;
                      return (
                        <button
                          key={ci}
                          onClick={() => !isDisabled && setActivePage(child.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "100%",
                            padding: "7px 10px",
                            border: "none",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            fontSize: 12,
                            textAlign: "left",
                            transition: "background 0.12s ease, color 0.12s ease",
                            background: isActive ? "rgba(239,246,255,0.8)" : "transparent",
                            color: isDisabled ? COLORS.gray400 : isActive ? "#1E40AF" : COLORS.gray700,
                            fontWeight: isActive ? 700 : 600,
                            opacity: isDisabled ? 0.5 : 1,
                            borderRadius: 8,
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive && !isDisabled) e.currentTarget.style.background = COLORS.gray50;
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive && !isDisabled) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              margin: "0 6px",
                              background: isDisabled ? COLORS.gray200 : isActive ? COLORS.blueLight : COLORS.gray300,
                              flexShrink: 0,
                            }}
                          />
                          <span>{child.label}</span>
                          {isDisabled && (
                            <span
                              style={{
                                fontSize: 9,
                                background: COLORS.gray200,
                                color: COLORS.gray500,
                                padding: "1px 6px",
                                borderRadius: 3,
                                marginLeft: "auto",
                                fontWeight: 600,
                              }}
                            >
                              SOON
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Section divider */}
          {si < MENU.length - 1 && <div style={{ margin: "8px 10px", borderBottom: `1px solid ${COLORS.gray100}` }} />}
        </div>
      ))}
    </div>
  );
};
