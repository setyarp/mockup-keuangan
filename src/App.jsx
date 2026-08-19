import { useState } from "react";
import { Calendar } from "lucide-react";
import { COLORS } from "./constants/colors";
import { Header, Sidebar } from "./components/layout";
import {
  DashboardKeuangan,
  RekonRekeningKoran,
  KalkulatorIuran,
  RekonsIuran,
  GeneratorTagihan,
  ListSP,
  PembayaranPensiun,
  DashboardDana,
  KreditPiutang,
  TagihanImbalJasa,
  TaspenPolis,
  TaspenImbalJasa,
  Perpajakan,
  RekapUKP,
  DashboardDIPA,
  RekonBPJS,
  ReportGenerator,
} from "./pages";

const PAGES = {
  dashboard: { title: "Ikhtisar Keuangan", component: DashboardKeuangan },
  standarisasi_cms: { title: "Standarisasi Format CMS & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  kalkulator: { title: "Perhitungan Iuran Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "Rekonsiliasi Penerimaan Dana", component: RekonsIuran },
  tagihan: { title: "Penerbitan Tagihan Iuran ke Kemenkeu", component: GeneratorTagihan },
  listsp: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: ListSP },
  bayarpensiun: { title: "DAPEM — Daftar Rekapitulasi Pembayaran Pensiun", component: PembayaranPensiun },
  dana: { title: "Ketersediaan Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  rekonrk: { title: "Standarisasi Format CMS & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  klaim: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: ListSP },
  kredit: { title: "Penarikan Kelebihan Bayar UDW Punah", component: KreditPiutang },
  imbaljasa: { title: "Tagihan Imbal Jasa Mitra Bayar", component: TagihanImbalJasa },
  tlpolis: { title: "Portofolio Polis & Premi Taspen Life", component: TaspenPolis },
  tlimbaljasa: { title: "Tagihan Imbal Jasa Taspen Life", component: TaspenImbalJasa },
  pajak: { title: "Administrasi PPh 21 & Bukti Potong", component: Perpajakan },
  ukp: { title: "Tabel 24 — Rekap UKP (Uang Kena Pajak) Peserta Pensiun Bulanan", component: RekapUKP },
  dipa: { title: "Realisasi & Sisa Pagu DIPA TA 2026", component: DashboardDIPA },
  bpjs: { title: "Rekonsiliasi Iuran BPJS Kesehatan", component: RekonBPJS },
  laporan: { title: "Laporan & Ekspor Data", component: ReportGenerator },
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState(["Administrasi Iuran Peserta"]);

  const page = PAGES[activePage] || PAGES.dashboard;
  const PageComp = page.component;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: COLORS.gray100,
        color: COLORS.gray900,
      }}
    >
      {/* Top Header Bar */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Container: Sidebar + Page Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {sidebarOpen && (
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            expandedMenus={expandedMenus}
            setExpandedMenus={setExpandedMenus}
          />
        )}

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {/* Breadcrumb & Date Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 2 }}>
                Beranda › Keuangan › {page.title}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                {page.title}
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={14} color={COLORS.white} />
              <span
                style={{
                  background: COLORS.blueDark,
                  color: COLORS.white,
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                Minggu, 06 Juli 2026
              </span>
            </div>
          </div>

          {/* Active Page Component */}
          <PageComp />
        </div>
      </div>
    </div>
  );
}
