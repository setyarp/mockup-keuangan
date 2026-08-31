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
  KonfigurasiManfaat,
} from "./pages";

const PAGES = {
  dashboard: { title: "Ikhtisar Keuangan", component: DashboardKeuangan },
  standarisasi_cms: { title: "Ketersediaan Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  kalkulator: { title: "Perhitungan Iuran Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "Rekonsiliasi Penerimaan Dana", component: RekonsIuran },
  tagihan: { title: "Penerbitan Tagihan Iuran ke Kemenkeu", component: GeneratorTagihan },
  listsp: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: ListSP },
  bayarpensiun: { title: "DAPEM — Daftar Rekapitulasi Pembayaran Pensiun", component: PembayaranPensiun },
  dana: { title: "Ketersediaan Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  rekonrk: { title: "Ketersediaan Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  klaim: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: ListSP },
  kredit: { title: "Penagihan Keterlanjuran Bayar", component: KreditPiutang },
  imbaljasa: { title: "Tagihan Imbal Jasa Mitra Bayar", component: TagihanImbalJasa },
  tlpolis: { title: "Portofolio Polis & Premi Taspen Life", component: TaspenPolis },
  tlimbaljasa: { title: "Tagihan Imbal Jasa Taspen Life", component: TaspenImbalJasa },
  konfigurasi_manfaat: { title: "Master Mitra & Parameter Pengembangan Manfaat", component: KonfigurasiManfaat },
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
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: COLORS.gray50,
        color: COLORS.gray700,
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
              <div style={{ fontSize: 12, color: COLORS.gray400, fontWeight: 500, marginBottom: 4 }}>
                Beranda › Keuangan › <b style={{ color: COLORS.gray700, fontWeight: 600 }}>{page.title}</b>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, color: COLORS.gray900, margin: 0 }}>
                {page.title}
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: COLORS.white,
                border: `1px solid ${COLORS.gray200}`,
                borderRadius: 10,
                padding: "7px 14px",
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <Calendar size={14} color={COLORS.gray400} />
              <span style={{ color: COLORS.gray700, fontSize: 12, fontWeight: 700 }}>
                Minggu, 06 Juli 2026
              </span>
            </div>
          </div>

          {/* Active Page Componen */}
          <PageComp />
        </div>
      </div>
    </div>
  );
}
