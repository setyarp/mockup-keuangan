import { Menu, Search, Bell } from "lucide-react";
import { COLORS } from "../../constants/colors";

// Navbar mengikuti Navbar.tsx di FE: gradien biru mendatar, logo resmi,
// dan avatar lingkaran transparan bergaris putih.
export const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${COLORS.navy} 0%, ${COLORS.blue} 55%, ${COLORS.blueDark} 100%)`,
        padding: "0 16px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        boxShadow: "0 4px 14px rgba(1,53,140,0.25)",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/logo-asabri-white.png" alt="Logo ASABRI" style={{ height: 40, width: "auto", flexShrink: 0 }} />
        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.2)" }} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Sembunyikan / Tampilkan Sidebar"
          style={{
            background: "none",
            border: "none",
            color: COLORS.white,
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <Menu size={20} />
        </button>
        <div>
          <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14, letterSpacing: -0.15, lineHeight: 1.15 }}>
            YANDU <span style={{ color: COLORS.accent, fontWeight: 800 }}>NEXTGEN</span> ASABRI
          </div>
          <div style={{ color: "#BFD6F5", fontSize: 9, fontWeight: 500, letterSpacing: 0.6, lineHeight: 1, marginTop: 2 }}>
            DIVISI KEUANGAN
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            background: "rgba(11,30,80,0.2)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: 8,
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Search size={14} color="#BFD6F5" />
          <span style={{ fontSize: 11, color: "#BFD6F5", fontWeight: 500 }}>Cari Peserta / NRP / NIP...</span>
        </div>
        <div
          style={{
            background: "rgba(11,30,80,0.2)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: 8,
            padding: "7px 12px",
            fontSize: 11,
            color: "#BFD6F5",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          ROLE: <strong style={{ color: COLORS.white, fontWeight: 700 }}>Super Administrator</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bell size={18} color="#BFD6F5" />
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.white,
              fontSize: 12,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            WA
          </div>
        </div>
      </div>
    </div>
  );
};
