import { useState } from "react";
import { Calendar, TrendingDown, Wallet } from "lucide-react";
import { COLORS } from "./constants/colors";
import { Header, Sidebar } from "./components/layout";
import {
  RekonRekeningKoran,
  KalkulatorIuran,
  RekonsIuran,
  GeneratorTagihan,
  ListSP,
  PembayaranPensiun,
  DapemSusulan,
  NonDapemRekap,
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
  ReportKU,
  PenyaluranHarian,
} from "./pages";

const PAGES = {
  dashboard: { title: "Dashboard Dana DIPA — Realisasi & Sisa Pagu DIPA TA 2026", component: DashboardDIPA },
  dipa: { title: "Dashboard Dana DIPA — Realisasi & Sisa Pagu DIPA TA 2026", component: DashboardDIPA },
  dana: { title: "Dashboard Dana Pembayaran Manfaat — Ketersediaan & Penyaluran Dana Mitra Bayar", component: DashboardDana },
  penyaluran_harian: { title: "Penyaluran Harian CMS Mitra Bayar — Pemadanan Transaksi YANDU NG", component: PenyaluranHarian },
  upload_cms: { title: "Upload CMS Mitra Bayar — Standarisasi & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  standarisasi_cms: { title: "Upload CMS Mitra Bayar — Standarisasi & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  rekonrk: { title: "Upload CMS Mitra Bayar — Standarisasi & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  kalkulator: { title: "Perhitungan Iuran Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "Rekonsiliasi Penerimaan Dana", component: RekonsIuran },
  tagihan: { title: "Penagihan Iuran Ke Kemenkeu", component: GeneratorTagihan },
  listsp: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: () => <ListSP defaultTab="listsp" /> },
  jkk_perawatan: { title: "Surat Perintah Pembayaran — JKK Perawatan RS Provider", component: () => <ListSP defaultTab="jkk" /> },
  hutang_pum: { title: "Daftar Penyaluran & Pelunasan Piutang PUM KPR", component: () => <ListSP defaultTab="pum" /> },
  bayarpensiun: { title: "DAPEM Induk — Pembayaran Pensiun Rutin Bulanan", component: () => <PembayaranPensiun defaultTab="induk" /> },
  dapem_susulan: { title: "DAPEM Susulan — Pembayaran Pensiun Termin Susulan", component: () => <PembayaranPensiun defaultTab="susulan" /> },
  non_dapem: { title: "NON-DAPEM — Pembayaran Pertama (PP), UKP & UDW", component: () => <PembayaranPensiun defaultTab="nondapem" /> },
  klaim: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: () => <ListSP defaultTab="listsp" /> },
  kredit: { title: "Penagihan Keterlanjuran Bayar", component: KreditPiutang },
  imbaljasa: { title: "Tagihan Imbal Jasa Mitra Bayar", component: TagihanImbalJasa },
  imbaljasa_flagging: { title: "Tagihan Imbal Jasa — Flagging Kredit", component: () => <TagihanImbalJasa defaultTab="flagging" /> },
  imbaljasa_auth: { title: "Tagihan Imbal Jasa — Authentikasi Digital", component: () => <TagihanImbalJasa defaultTab="auth" /> },
  tlpolis: { title: "Portofolio Polis & Premi Taspen Life", component: TaspenPolis },
  tlimbaljasa: { title: "Tagihan Imbal Jasa Taspen Life", component: TaspenImbalJasa },
  konfigurasi_manfaat: { title: "Parameter Suku Bunga", component: KonfigurasiManfaat },
  pajak: { title: "Administrasi PPh 21 & Bukti Potong", component: Perpajakan },
  ukp: { title: "Tabel 24 — Rekap UKP (Uang Kekurangan Pensiun) Peserta Pensiun Bulanan", component: RekapUKP },
  bpjs: { title: "Rekonsiliasi Iuran BPJS Kesehatan", component: RekonBPJS },
  report_ku: { title: "Report KU", hideDefaultHeader: true, component: ReportKU },
  laporan: { title: "Laporan & Ekspor Data", component: ReportGenerator },
};

export default function App() {
  const [activePage, setActivePage] = useState("dipa");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState(["Administrasi Iuran Peserta", "Perintah Pembayaran", "Penyaluran & CMS Mitra", "Administrasi DAPEM", "PELAPORAN"]);
  
  // Shared state untuk simulasi Upload Rekening Koran (Default Kosong)
  const [cmsDataList, setCmsDataList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const page = PAGES[activePage] || PAGES.dipa;
  const PageComp = page.component;
  const isDashboard = activePage === "dipa" || activePage === "dana" || activePage === "dashboard";

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
          {!page.hideDefaultHeader && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: COLORS.gray400, fontWeight: 500, marginBottom: 4 }}>
                  Beranda › {isDashboard ? "Dashboard" : "Keuangan"} ›{" "}
                  <b style={{ color: COLORS.gray700, fontWeight: 600 }}>{page.title}</b>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, color: COLORS.gray900, margin: 0 }}>
                  {page.title}
                </h2>

                {/* Dashboard Quick Switcher Tabs */}
                {isDashboard && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "#E2E8F0",
                      padding: "3px",
                      borderRadius: 8,
                      gap: 4,
                      marginTop: 10,
                    }}
                  >
                    <button
                      onClick={() => setActivePage("dipa")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: activePage === "dipa" || activePage === "dashboard" ? COLORS.white : "transparent",
                        color: activePage === "dipa" || activePage === "dashboard" ? COLORS.blueDark : COLORS.gray600,
                        boxShadow: activePage === "dipa" || activePage === "dashboard" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <TrendingDown size={14} />
                      <span>Dana DIPA</span>
                    </button>
                    <button
                      onClick={() => setActivePage("dana")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: activePage === "dana" ? COLORS.white : "transparent",
                        color: activePage === "dana" ? COLORS.blueDark : COLORS.gray600,
                        boxShadow: activePage === "dana" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Wallet size={14} />
                      <span>Dana Pembayaran Manfaat</span>
                    </button>
                  </div>
                )}
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
          )}

          {/* Active Page Component */}
          <PageComp
            dataList={cmsDataList}
            setDataList={setCmsDataList}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onNavigateToPenyaluran={() => setActivePage("penyaluran_harian")}
            onNavigateToUploadCMS={() => setActivePage("upload_cms")}
            setActivePage={setActivePage}
          />
        </div>
      </div>
    </div>
  );
}
