import { Menu, Search, Bell } from "lucide-react";
import { COLORS } from "../../constants/colors";

export const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.blueDark} 100%)`,
        padding: "0 20px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: "none", border: "none", color: COLORS.white, fontSize: 20, cursor: "pointer", padding: 4 }}
        >
          <Menu size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 14,
              color: COLORS.navy,
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>
              YANDU <span style={{ color: COLORS.accent }}>NEXTGEN</span> ASABRI
            </div>
            <div style={{ color: COLORS.gray400, fontSize: 10, letterSpacing: 1 }}>DIVISI KEUANGAN</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={14} color={COLORS.gray400} />
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>Cari Peserta / NRP / NIP...</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: COLORS.gray300 }}>
          ROLE: <strong style={{ color: COLORS.white }}>Super Administrator</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={18} color={COLORS.gray300} />
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: COLORS.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.white,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            WA
          </div>
        </div>
      </div>
    </div>
  );
};
