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
      }}
    >
      {MENU.map((section, si) => (
        <div key={si} style={{ paddingTop: si === 0 ? 12 : 4, paddingBottom: 4 }}>
          {/* Section Header */}
          <div
            style={{
              padding: "8px 20px 6px",
              fontSize: 10,
              fontWeight: 800,
              color: COLORS.gray400,
              letterSpacing: 1.2,
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
                    padding: "9px 20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    textAlign: "left",
                    transition: "all 0.18s ease",
                    background: isActive ? "#E3F2FD" : "transparent",
                    color: isActive ? COLORS.blue : COLORS.gray700,
                    fontWeight: isActive ? 700 : 400,
                    borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "#F1F5F9";
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
                    {renderIcon(item.icon, 16, isActive ? COLORS.blue : COLORS.gray500)}
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
                    padding: "9px 20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    textAlign: "left",
                    background: "transparent",
                    transition: "all 0.18s ease",
                    color: hasActiveChild ? COLORS.blue : COLORS.gray700,
                    fontWeight: hasActiveChild ? 700 : 500,
                    borderLeft: "3px solid transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", opacity: hasActiveChild ? 1 : 0.6 }}>
                      {renderIcon(item.icon, 16, hasActiveChild ? COLORS.blue : COLORS.gray500)}
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
                  <div style={{ overflow: "hidden" }}>
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
                            padding: "7px 20px 7px 48px",
                            border: "none",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            fontSize: 12.5,
                            textAlign: "left",
                            transition: "all 0.18s ease",
                            background: isActive ? "#E3F2FD" : "transparent",
                            color: isDisabled ? COLORS.gray400 : isActive ? COLORS.blue : COLORS.gray600,
                            fontWeight: isActive ? 700 : 400,
                            opacity: isDisabled ? 0.5 : 1,
                            borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive && !isDisabled) e.currentTarget.style.background = "#F8FAFC";
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive && !isDisabled) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: isDisabled ? COLORS.gray300 : isActive ? COLORS.blue : COLORS.gray400,
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
          {si < MENU.length - 1 && <div style={{ margin: "8px 20px", borderBottom: `1px solid ${COLORS.gray200}` }} />}
        </div>
      ))}
    </div>
  );
};
