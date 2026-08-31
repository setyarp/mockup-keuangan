import { useState } from "react";
import {
  Building2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  CircleAlert,
  CircleDot,
  Send,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock,
  Landmark,
  CreditCard,
  BarChart3,
  CheckCheck,
  FileCheck2,
  Sparkles,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  LineChart as LineChartIcon
} from "lucide-react";
import { COLORS, LINE_COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Badge, Select, SearchInput, Btn, NoData, PreviewModal } from "../components/common";
import { RekonRekeningKoran } from "./RekonRekeningKoran";

export const DashboardDana = ({ initialTab = "monitoring" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [periodeView, setPeriodeView] = useState("Bulanan"); // "Mingguan" | "Bulanan"
  const [selectedMitraView, setSelectedMitraView] = useState("Semua Mitra (Konsolidasi)");
  const [selectedMitraFilter, setSelectedMitraFilter] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterStatusBayar, setFilterStatusBayar] = useState("Semua");
  const [selectedPeriodeSP, setSelectedPeriodeSP] = useState("Juli 2026 (Bulan Berjalan)");
  const [searchRekap, setSearchRekap] = useState("");
  const [preview, setPreview] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Mapping Realisasi SP per Periode
  const spPeriodMap = {
    "Juli 2026 (Bulan Berjalan)": {
      "MTR-01": { spTotal: 480, spRealisasi: 462, nominalRealisasi: 114.5 },
      "MTR-02": { spTotal: 410, spRealisasi: 395, nominalRealisasi: 91.2 },
      "MTR-03": { spTotal: 320, spRealisasi: 304, nominalRealisasi: 76.0 },
      "MTR-04": { spTotal: 260, spRealisasi: 238, nominalRealisasi: 142.8 },
      "MTR-05": { spTotal: 185, spRealisasi: 160, nominalRealisasi: 53.6 },
      "MTR-06": { spTotal: 140, spRealisasi: 135, nominalRealisasi: 38.5 },
    },
    "Juni 2026": {
      "MTR-01": { spTotal: 465, spRealisasi: 458, nominalRealisasi: 110.2 },
      "MTR-02": { spTotal: 398, spRealisasi: 390, nominalRealisasi: 89.5 },
      "MTR-03": { spTotal: 310, spRealisasi: 301, nominalRealisasi: 73.2 },
      "MTR-04": { spTotal: 245, spRealisasi: 230, nominalRealisasi: 136.0 },
      "MTR-05": { spTotal: 175, spRealisasi: 155, nominalRealisasi: 51.0 },
      "MTR-06": { spTotal: 130, spRealisasi: 128, nominalRealisasi: 36.4 },
    },
    "Mei 2026": {
      "MTR-01": { spTotal: 450, spRealisasi: 442, nominalRealisasi: 106.8 },
      "MTR-02": { spTotal: 385, spRealisasi: 378, nominalRealisasi: 86.4 },
      "MTR-03": { spTotal: 295, spRealisasi: 288, nominalRealisasi: 70.5 },
      "MTR-04": { spTotal: 230, spRealisasi: 218, nominalRealisasi: 128.5 },
      "MTR-05": { spTotal: 168, spRealisasi: 150, nominalRealisasi: 48.2 },
      "MTR-06": { spTotal: 125, spRealisasi: 122, nominalRealisasi: 35.0 },
    },
    "Triwulan II 2026": {
      "MTR-01": { spTotal: 1380, spRealisasi: 1352, nominalRealisasi: 328.5 },
      "MTR-02": { spTotal: 1185, spRealisasi: 1155, nominalRealisasi: 265.4 },
      "MTR-03": { spTotal: 915, spRealisasi: 888, nominalRealisasi: 218.0 },
      "MTR-04": { spTotal: 720, spRealisasi: 672, nominalRealisasi: 398.2 },
      "MTR-05": { spTotal: 520, spRealisasi: 468, nominalRealisasi: 152.4 },
      "MTR-06": { spTotal: 390, spRealisasi: 382, nominalRealisasi: 108.5 },
    },
    "Tahun 2026 (YTD)": {
      "MTR-01": { spTotal: 3240, spRealisasi: 3165, nominalRealisasi: 768.4 },
      "MTR-02": { spTotal: 2760, spRealisasi: 2685, nominalRealisasi: 618.2 },
      "MTR-03": { spTotal: 2140, spRealisasi: 2072, nominalRealisasi: 508.6 },
      "MTR-04": { spTotal: 1690, spRealisasi: 1572, nominalRealisasi: 932.0 },
      "MTR-05": { spTotal: 1220, spRealisasi: 1090, nominalRealisasi: 356.5 },
      "MTR-06": { spTotal: 910, spRealisasi: 890, nominalRealisasi: 252.0 },
    },
  };

  // Data Mitra Bayar Real-time (Fokus THT, JKK, JKm dengan kurva naik-turun proporsional)
  const initialMitraData = [
    {
      id: "MTR-01",
      mitra: "Bank Mandiri",
      noRekening: "124.00.0988776.2",
      manfaat: "THT, JKK, JKm",
      saldo: 820,
      kebutuhanProx: 120,
      // Bulanan: Jul (90) -> Agu Naik (118) -> Sep Naik Puncak (152) -> Okt Turun (102) -> Nov Turun (85) -> Des Turun (75)
      proyeksiBulan: [90, 118, 152, 102, 85, 75],
      // Mingguan: M1 (18) -> M2 Naik (28) -> M3 Puncak (42) -> M4 Turun (20)
      proyeksiMinggu: [18, 28, 42, 20],
      rekDropping: 0,
      spTotal: 480,
      spRealisasi: 462,
      spPending: 18,
      nominalRealisasi: 114.5,
      rateRealisasi: 96.3,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-02",
      mitra: "Bank BRI",
      noRekening: "0210.01.000998.30.1",
      manfaat: "THT, JKK, JKm",
      saldo: 650,
      kebutuhanProx: 95,
      proyeksiBulan: [75, 96, 124, 82, 70, 60],
      proyeksiMinggu: [15, 23, 35, 16],
      rekDropping: 0,
      spTotal: 410,
      spRealisasi: 395,
      spPending: 15,
      nominalRealisasi: 91.2,
      rateRealisasi: 96.3,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-03",
      mitra: "Bank BNI",
      noRekening: "0198.88.776655.1",
      manfaat: "THT, JKK Perawatan, JKm",
      saldo: 420,
      kebutuhanProx: 80,
      proyeksiBulan: [60, 78, 100, 68, 56, 48],
      proyeksiMinggu: [12, 18, 28, 14],
      rekDropping: 0,
      spTotal: 320,
      spRealisasi: 304,
      spPending: 16,
      nominalRealisasi: 76.0,
      rateRealisasi: 95.0,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-04",
      mitra: "Bank BTN",
      noRekening: "0012.01.500223.4",
      manfaat: "THT, JKK",
      saldo: 180,
      kebutuhanProx: 155,
      proyeksiBulan: [120, 150, 192, 130, 110, 95],
      proyeksiMinggu: [25, 38, 54, 24],
      rekDropping: 12,
      spTotal: 260,
      spRealisasi: 238,
      spPending: 22,
      nominalRealisasi: 142.8,
      rateRealisasi: 91.5,
      jadwalDrop: "Transfer Rp 12 M s.d. 16 Juli (M-3)",
      actionStatus: "Perhatian"
    },
    {
      id: "MTR-05",
      mitra: "PT Pos Indonesia",
      noRekening: "098.22.441199.0",
      manfaat: "THT, JKm (Wilayah 3T)",
      saldo: 45,
      kebutuhanProx: 62,
      proyeksiBulan: [48, 62, 78, 52, 44, 38],
      proyeksiMinggu: [10, 16, 22, 11],
      rekDropping: 20,
      spTotal: 185,
      spRealisasi: 160,
      spPending: 25,
      nominalRealisasi: 53.6,
      rateRealisasi: 86.5,
      jadwalDrop: "Transfer Segera Rp 20 M (Kas Kritis)",
      actionStatus: "Kritis"
    },
    {
      id: "MTR-06",
      mitra: "Bank BSI",
      noRekening: "7100.99.882233.1",
      manfaat: "THT, JKK, JKm (Layanan Syariah)",
      saldo: 135,
      kebutuhanProx: 40,
      proyeksiBulan: [27, 36, 44, 28, 25, 22],
      proyeksiMinggu: [5, 10, 14, 5],
      rekDropping: 0,
      spTotal: 140,
      spRealisasi: 135,
      spPending: 5,
      nominalRealisasi: 38.5,
      rateRealisasi: 96.4,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
  ];

  const [mitraData, setMitraData] = useState(initialMitraData);

  // Menghitung status dan selisih per mitra
  const computedMitra = mitraData.map(m => {
    const selisih = m.saldo - m.kebutuhanProx;
    const coverage = ((m.saldo / m.kebutuhanProx) * 100).toFixed(0);
    let status = "Aman";
    let statusLabel = "■ AMAN";
    let statusColor = "green";

    if (coverage < 80) {
      status = "Kritis";
      statusLabel = "● KRITIS";
      statusColor = "red";
    } else if (coverage <= 120) {
      status = "Perhatian";
      statusLabel = "▲ PERHATIAN";
      statusColor = "yellow";
    }

    return {
      ...m,
      selisih,
      coverage: parseInt(coverage),
      status,
      statusLabel,
      statusColor
    };
  });

  const totalSaldoTersedia = computedMitra.reduce((a, m) => a + m.saldo, 0);
  const totalKebutuhanProx = computedMitra.reduce((a, m) => a + m.kebutuhanProx, 0);
  const totalSelisih = totalSaldoTersedia - totalKebutuhanProx;
  const criticalMitras = computedMitra.filter(m => m.status === "Kritis");
  const totalAlertMitra = computedMitra.filter(m => m.status !== "Aman");
  const totalRekomendasiDrop = computedMitra.reduce((a, m) => a + m.rekDropping, 0);

  // Konsolidasi Realisasi SP Berdasarkan Periode Terpilih
  const activeSPData = spPeriodMap[selectedPeriodeSP] || spPeriodMap["Juli 2026 (Bulan Berjalan)"];
  const computedSPMitra = computedMitra.map(m => {
    const spInfo = activeSPData[m.id] || { spTotal: m.spTotal, spRealisasi: m.spRealisasi, nominalRealisasi: m.nominalRealisasi };
    const rate = ((spInfo.spRealisasi / spInfo.spTotal) * 100).toFixed(1);
    return {
      ...m,
      ...spInfo,
      rateRealisasi: parseFloat(rate)
    };
  });

  const totalSpDiterbitkan = computedSPMitra.reduce((a, m) => a + m.spTotal, 0);
  const totalSpTerealisasi = computedSPMitra.reduce((a, m) => a + m.spRealisasi, 0);
  const totalSpPending = computedSPMitra.reduce((a, m) => a + (m.spTotal - m.spRealisasi), 0);
  const totalNominalSalur = computedSPMitra.reduce((a, m) => a + m.nominalRealisasi, 0).toFixed(1);
  const overallSuccessRate = ((totalSpTerealisasi / totalSpDiterbitkan) * 100).toFixed(1);

  // Periode Labels
  const periodLabels = periodeView === "Mingguan"
    ? ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"]
    : ["Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Filtered / Active Chart Data with distinct wave dynamics (Jul 420 -> Agu 540 -> Sep 680 -> Okt 460 -> Nov 390 -> Des 340)
  const isKonsolidasi = selectedMitraView.startsWith("Semua");
  const activeMitra = mitraData.find(m => m.mitra === selectedMitraView);

  const chartKebutuhanSeries = isKonsolidasi
    ? (periodeView === "Mingguan"
        ? [85, 135, 195, 90]
        : [420, 540, 680, 460, 390, 340])
    : (periodeView === "Mingguan"
        ? activeMitra.proyeksiMinggu
        : activeMitra.proyeksiBulan);

  // Transaksi Harian CMS Mapping (THT, JKK, JKm)
  const rekapHarian = [
    { no: 1, noRef: "CMS-MND-20260706-00142", nrp: "198701234", nama: "Purn. Kol. Ahmad Rifai", jenis: "THT (BUP)", mitra: "Bank Mandiri", noSP: "SP/2026/07/012", nominal: "Rp 125.000.000", status: "Berhasil", waktu: "06:15", cabang: "Kancab Jakarta Timur" },
    { no: 2, noRef: "CMS-MND-20260706-00143", nrp: "199205678", nama: "Purn. Letda Budi Kartono", jenis: "THT (BUP)", mitra: "Bank Mandiri", noSP: "SP/2026/07/015", nominal: "Rp 98.200.000", status: "Berhasil", waktu: "06:15", cabang: "Kancab Surabaya" },
    { no: 3, noRef: "CMS-MND-20260706-00187", nrp: "198604321", nama: "Purn. AKP Siti Nurhaliza", jenis: "Klaim JKK Perawatan", mitra: "Bank Mandiri", noSP: "SP/2026/07/044", nominal: "Rp 45.000.000", status: "Berhasil", waktu: "08:30", cabang: "Kancab Medan" },
    { no: 4, noRef: "CMS-BRI-20260706-01205", nrp: "197803456", nama: "Purn. Serma Hendra W.", jenis: "THT (BUP)", mitra: "Bank BRI", noSP: "SP/2026/07/088", nominal: "Rp 87.800.000", status: "Berhasil", waktu: "06:00", cabang: "Kancab Semarang" },
    { no: 5, noRef: "CMS-BRI-20260706-01289", nrp: "199312345", nama: "Ny. Warakawuri Siti Aminah", jenis: "Klaim JKm", mitra: "Bank BRI", noSP: "SP/2026/07/092", nominal: "Rp 42.000.000", status: "Berhasil", waktu: "06:00", cabang: "Kancab Bandung" },
    { no: 6, noRef: "CMS-POS-20260706-00034", nrp: "198512890", nama: "Purn. Pelda Sukamto (3T)", jenis: "THT (BUP)", mitra: "PT Pos Indonesia", noSP: "SP/2026/07/102", nominal: "Rp 65.200.000", status: "Berhasil", waktu: "09:15", cabang: "Kancab Jayapura" },
    { no: 7, noRef: "CMS-BNI-20260706-00891", nrp: "199008765", nama: "Purn. Peltu Rizki P.", jenis: "THT (BUP)", mitra: "Bank BNI", noSP: "SP/2026/07/115", nominal: "Rp 120.000.000", status: "Berhasil", waktu: "06:30", cabang: "Kancab Palembang" },
    { no: 8, noRef: "CMS-BTN-20260706-00245", nrp: "197506789", nama: "Purn. Pengatur Agus S.", jenis: "Klaim JKK Perawatan", mitra: "Bank BTN", noSP: "SP/2026/07/140", nominal: "Rp 35.000.000", status: "Gagal", waktu: "06:15", keterangan: "Saldo Rekening Penyaluran CMS Kurang", cabang: "Kancab Jakarta Selatan" },
    { no: 9, noRef: "CMS-BSI-20260706-00109", nrp: "198211111", nama: "Purn. Kapten M. Yusuf", jenis: "Klaim JKm", mitra: "Bank BSI", noSP: "SP/2026/07/162", nominal: "Rp 42.000.000", status: "Berhasil", waktu: "11:20", cabang: "Kancab Banda Aceh" }
  ];

  const filteredRekap = rekapHarian.filter(r => {
    if (selectedMitraFilter !== "Semua" && r.mitra !== selectedMitraFilter) return false;
    if (filterJenis !== "Semua" && r.jenis !== filterJenis) return false;
    if (filterStatusBayar !== "Semua" && r.status !== filterStatusBayar) return false;
    if (searchRekap && !r.nama.toLowerCase().includes(searchRekap.toLowerCase()) && !r.nrp.includes(searchRekap) && !r.noSP.toLowerCase().includes(searchRekap.toLowerCase())) return false;
    return true;
  });

  const handleAjukanDropping = (mitraObj) => {
    setToastMessage(`Pengajuan Dropping Dana sebesar Rp ${mitraObj.rekDropping} M untuk ${mitraObj.mitra} berhasil diteruskan ke Divisi Perbendaharaan & Kasda!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1E293B",
            color: COLORS.white,
            padding: "14px 20px",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 13,
            borderLeft: `4px solid ${COLORS.green}`
          }}
        >
          <CheckCircle2 size={20} color={COLORS.green} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "monitoring", label: "Dashboard Monitoring Ketersediaan & Realisasi Dana" },
          { id: "mapping_cms", label: "Standarisasi & Rekonsiliasi Rekening Koran (Mapping CMS)" },
          { id: "rekap", label: "Rekapitulasi Penyaluran Harian CMS" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "12px 24px",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: 700,
              background: "transparent",
              color: activeTab === t.id ? COLORS.blueDark : COLORS.gray500,
              borderBottom: activeTab === t.id ? `3px solid ${COLORS.blueDark}` : "3px solid transparent",
              marginBottom: -2
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MONITORING KETERSEDIAAN DANA */}
      {activeTab === "monitoring" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top Stat Cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <StatCard
              icon={<Building2 size={IC} />}
              label="Total Saldo Tersedia (CMS)"
              value={`Rp ${totalSaldoTersedia} M`}
              sub={`${mitraData.length} Mitra Bayar Penyaluran Aktif`}
              color={COLORS.blue}
            />
            <StatCard
              icon={<TrendingUp size={IC} />}
              label="Kebutuhan Prox (SP Terbit)"
              value={`Rp ${totalKebutuhanProx} M`}
              sub="SP THT, JKK, JKm siap ditransfer"
              color={COLORS.orange}
            />
            <StatCard
              icon={<FileCheck2 size={IC} />}
              label="SP Terealisasi Bulan Ini"
              value={`${totalSpTerealisasi} SP`}
              sub={`Rp ${totalNominalSalur} M tersalurkan (${overallSuccessRate}%)`}
              color={COLORS.green}
            />
            <StatCard
              icon={totalSelisih >= 0 ? <CheckCircle2 size={IC} /> : <AlertTriangle size={IC} />}
              label="Posisi Likuiditas Salur"
              value={`${totalSelisih >= 0 ? "+" : ""}Rp ${totalSelisih} M`}
              sub={totalSelisih >= 0 ? "Kecukupan likuiditas aman" : "Perlu dropping tambahan"}
              color={totalSelisih >= 0 ? COLORS.green : COLORS.red}
            />
          </div>

          {/* PANEL 1 — Saldo Per Mitra Bayar (Real-Time CMS) */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <SectionTitle action={<span style={{ fontSize: 11.5, color: COLORS.green, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><CircleDot size={10} /> Real-Time Live Feed</span>}>
                  PANEL 1 — Saldo Ketersediaan Dana di Rekening Mitra Bayar (Real-Time)
                </SectionTitle>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                  Posisi saldo rekening giro penyaluran CMS masing-masing mitra vs kebutuhan SP yang telah terbit untuk program <strong>THT, JKK, dan JKm</strong>.
                </div>
              </div>

              <Btn
                size="sm"
                variant="outline"
                onClick={() =>
                  setPreview({
                    title: "Laporan Ketersediaan Dana Mitra Bayar (Real-Time)",
                    subtitle: "Program THT, JKK, JKm",
                    type: "table",
                    fileName: "Monitoring_Saldo_Mitra_THT_JKK_JKM.xlsx",
                    content: {
                      columns: ["Nama Mitra Bayar", "No. Rekening Giro", "Program Manfaat", "Saldo Tersedia", "Kebutuhan Prox (SP)", "Selisih (+/-)", "Status"],
                      rows: computedMitra.map(m => [
                        m.mitra,
                        m.noRekening,
                        m.manfaat,
                        `Rp ${m.saldo} M`,
                        `Rp ${m.kebutuhanProx} M`,
                        `${m.selisih >= 0 ? "+" : ""}Rp ${m.selisih} M`,
                        m.statusLabel
                      ]),
                      totalRows: computedMitra.length
                    }
                  })
                }
              >
                <Download size={13} /> Ekspor Snapshot (Excel)
              </Btn>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    {["Nama Mitra Bayar", "No. Rekening Giro CMS", "Program Manfaat", "Saldo Tersedia", "Kebutuhan Prox (SP Terbit)", "Selisih (+/-)", "Status"].map((c, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "11px 14px",
                          textAlign: i >= 3 && i <= 5 ? "right" : "left",
                          fontWeight: 800,
                          color: "#64748B",
                          borderBottom: `1px solid #E2E8F0`,
                          borderRight: i < 6 ? "1px solid #E2E8F0" : "none",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {computedMitra.map((m, i) => (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: `1px solid #E2E8F0`,
                        background: m.status === "Kritis" ? "#FFF1F2" : m.status === "Perhatian" ? "#FFF8E1" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: m.status === "Kritis" ? "#BE123C" : "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {m.mitra}
                      </td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blueDark, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>
                        {m.noRekening}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 11.5, color: COLORS.gray700, borderRight: "1px solid #E2E8F0" }}>
                        {m.manfaat}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        Rp {m.saldo} M
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.orange, fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                        Rp {m.kebutuhanProx} M
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: m.selisih >= 0 ? COLORS.green : COLORS.red, borderRight: "1px solid #E2E8F0" }}>
                        {m.selisih >= 0 ? "+" : ""}Rp {m.selisih} M
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <Badge color={m.statusColor}>
                          {m.statusLabel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#EDF2F7", fontWeight: 700, borderTop: `2px solid #CBD5E1` }}>
                    <td colSpan={3} style={{ padding: "11px 14px", color: COLORS.blueDark }}>
                      Total Konsolidasi Salur (THT, JKK, JKm)
                    </td>
                    <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.blueDark }}>
                      Rp {totalSaldoTersedia} M
                    </td>
                    <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.orange }}>
                      Rp {totalKebutuhanProx} M
                    </td>
                    <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: totalSelisih >= 0 ? COLORS.green : COLORS.red }}>
                      {totalSelisih >= 0 ? "+" : ""}Rp {totalSelisih} M
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <Badge color={totalSelisih >= 0 ? "green" : "red"}>
                        {totalSelisih >= 0 ? "■ AMAN" : "● DEFISIT"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: COLORS.gray500, display: "flex", justifyContent: "space-between" }}>
              <span>Data posisi saldo rekening giro penyaluran diperbarui secara real-time dari CMS masing-masing mitra perbankan.</span>
              <span>Terakhir update CMS: 06 Juli 2026, 14:30 WIB</span>
            </div>
          </div>

          {/* PANEL 2 — Proyeksi Kebutuhan Dana per Mitra (Grafik Kurva Fluktuatif) */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 22,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
            }}
          >
            {/* 1. HEADER & CONTROLS */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <SectionTitle>PANEL 2 — Grafik Proyeksi Kebutuhan Dana Program (THT, JKK, JKm)</SectionTitle>
                <div style={{ fontSize: 12, color: COLORS.gray500 }}>
                  Kurva estimasi kebutuhan dana klaim yang bergerak naik-turun mengikuti siklus pencairan dan musim pensiun.
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                {/* Mitra Selector */}
                <Select
                  label="Pilih Perspektif Mitra"
                  value={selectedMitraView}
                  onChange={setSelectedMitraView}
                  options={["Semua Mitra (Konsolidasi)", "Bank Mandiri", "Bank BRI", "Bank BNI", "Bank BTN", "PT Pos Indonesia", "Bank BSI"]}
                  minW={200}
                />

                {/* Toggle Mingguan vs Bulanan */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: 12, color: COLORS.gray600, marginBottom: 4, fontWeight: 600 }}>Rentang Waktu</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: COLORS.gray100, padding: "3px 4px", borderRadius: 6 }}>
                    <button
                      onClick={() => setPeriodeView("Mingguan")}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 4,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: periodeView === "Mingguan" ? COLORS.white : "transparent",
                        color: periodeView === "Mingguan" ? COLORS.blueDark : COLORS.gray600,
                        boxShadow: periodeView === "Mingguan" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                      }}
                    >
                      Per Minggu
                    </button>
                    <button
                      onClick={() => setPeriodeView("Bulanan")}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 4,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: periodeView === "Bulanan" ? COLORS.white : "transparent",
                        color: periodeView === "Bulanan" ? COLORS.blueDark : COLORS.gray600,
                        boxShadow: periodeView === "Bulanan" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                      }}
                    >
                      Per Bulan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. GRAPHIC AREA */}
            <div style={{ background: COLORS.gray50, borderRadius: 8, padding: "16px 18px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
              {/* Legend & Summary Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 16, height: 4, background: "#0141A8", borderRadius: 2, display: "inline-block" }} />
                    <strong style={{ color: COLORS.gray900 }}>Kurva Proyeksi Kebutuhan Dana (THT, JKK, JKm)</strong>
                  </div>
                </div>

                <div style={{ fontSize: 11.5, color: COLORS.gray600 }}>
                  Tampilan: <strong>{selectedMitraView}</strong> • Mode: <strong>{periodeView}</strong>
                </div>
              </div>

              {/* SVG Line Chart dengan Skala Y Terukur & Proporsional */}
              {(() => {
                const maxVal = Math.max(...chartKebutuhanSeries);
                // Menentukan batas atas Y-axis yang presisi dan tidak terlampau tinggi
                const niceMax = maxVal <= 200 ? 200 : maxVal <= 400 ? 400 : 750;
                const W = 900, H = 280, ML = 65, MR = 40, MT = 28, MB = 40;
                const plotW = W - ML - MR, plotH = H - MT - MB;
                const xAt = i => ML + (plotW / (periodLabels.length - 1)) * i;
                const yAt = v => MT + plotH - (v / niceMax) * plotH;
                const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(niceMax * f));

                const ptsKebutuhan = chartKebutuhanSeries.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");

                return (
                  <div style={{ width: "100%", overflowX: "auto" }}>
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 580, height: "auto", display: "block" }}>
                      {/* Gridlines */}
                      {yTicks.map((t, i) => (
                        <g key={i}>
                          <line x1={ML} y1={yAt(t)} x2={W - MR} y2={yAt(t)} stroke={COLORS.gray200} strokeWidth="1" strokeDasharray={t === 0 ? "0" : "4 4"} />
                          <text x={ML - 10} y={yAt(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.gray500} fontFamily="monospace">
                            Rp {t} M
                          </text>
                        </g>
                      ))}

                      {/* X Labels */}
                      {periodLabels.map((p, i) => (
                        <text key={i} x={xAt(i)} y={H - MB + 24} textAnchor="middle" fontSize="11.5" fill={COLORS.gray700} fontWeight="600" fontFamily="Inter, sans-serif">
                          {p}
                        </text>
                      ))}

                      {/* Curve Line (Solid Blue) */}
                      <polyline points={ptsKebutuhan} fill="none" stroke="#0141A8" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />

                      {/* Data Points + Values */}
                      {chartKebutuhanSeries.map((v, i) => (
                        <g key={`k-${i}`}>
                          <circle cx={xAt(i)} cy={yAt(v)} r="5" fill={COLORS.white} stroke="#0141A8" strokeWidth="3" />
                          <text
                            x={xAt(i)}
                            y={yAt(v) - 10}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="800"
                            fill="#0141A8"
                            fontFamily="monospace"
                          >
                            Rp {v} M
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* PANEL 3 — Bar Chart Trend & Laju Realisasi Surat Perintah (SP) per Mitra Bayar */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 22,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <SectionTitle action={<Badge color="green">Total {totalSpTerealisasi} dari {totalSpDiterbitkan} SP Cair ({overallSuccessRate}%)</Badge>}>
                  PANEL 3 — Bar Chart Realisasi Surat Perintah (SP) oleh Mitra Bayar
                </SectionTitle>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                  Komparasi volume Surat Perintah (SP) yang diterbitkan vs yang berhasil direalisasikan/ditransfer oleh masing-masing mitra bayar.
                </div>
              </div>

              {/* Controls & Legends */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
                {/* Period Selector Filter */}
                <Select
                  label="Filter Periode Realisasi SP"
                  value={selectedPeriodeSP}
                  onChange={setSelectedPeriodeSP}
                  options={["Juli 2026 (Bulan Berjalan)", "Juni 2026", "Mei 2026", "Triwulan II 2026", "Tahun 2026 (YTD)"]}
                  minW={220}
                />

                {/* Legends */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 12, paddingBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 14, height: 14, background: "#0141A8", borderRadius: 3, display: "inline-block" }} />
                    <strong style={{ color: COLORS.gray800 }}>Total SP Diterbitkan</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 14, height: 14, background: "#059669", borderRadius: 3, display: "inline-block" }} />
                    <strong style={{ color: COLORS.gray800 }}>SP Terealisasi (Cair)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Grouped Bar Chart */}
            {(() => {
              const maxSPVal = Math.max(...computedSPMitra.map(m => m.spTotal));
              const step = maxSPVal > 2000 ? 500 : maxSPVal > 1000 ? 250 : 100;
              const maxSP = Math.ceil(maxSPVal / step) * step || 500;
              const W = 900, H = 300, ML = 65, MR = 30, MT = 30, MB = 60;
              const plotW = W - ML - MR, plotH = H - MT - MB;
              const numGroups = computedSPMitra.length;
              const groupW = plotW / numGroups;
              const barW = 28;
              const gap = 6;
              const yAt = v => MT + plotH - (v / maxSP) * plotH;
              const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxSP * f));

              return (
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 620, height: "auto", display: "block" }}>
                    {/* Horizontal Gridlines */}
                    {yTicks.map((t, i) => (
                      <g key={i}>
                        <line x1={ML} y1={yAt(t)} x2={W - MR} y2={yAt(t)} stroke={COLORS.gray200} strokeWidth="1" strokeDasharray={t === 0 ? "0" : "4 4"} />
                        <text x={ML - 10} y={yAt(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.gray500} fontFamily="monospace">
                          {t} SP
                        </text>
                      </g>
                    ))}

                    {/* Grouped Bars per Mitra */}
                    {computedSPMitra.map((m, i) => {
                      const groupCenterX = ML + groupW * i + groupW / 2;
                      const x1 = groupCenterX - barW - gap / 2;
                      const x2 = groupCenterX + gap / 2;
                      const h1 = (m.spTotal / maxSP) * plotH;
                      const h2 = (m.spRealisasi / maxSP) * plotH;
                      const y1 = MT + plotH - h1;
                      const y2 = MT + plotH - h2;

                      return (
                        <g key={m.id}>
                          {/* Bar 1: SP Diterbitkan (Blue) */}
                          <rect
                            x={x1}
                            y={y1}
                            width={barW}
                            height={h1}
                            rx={4}
                            fill="#0141A8"
                            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          />
                          <text
                            x={x1 + barW / 2}
                            y={y1 - 6}
                            textAnchor="middle"
                            fontSize="10.5"
                            fontWeight="800"
                            fill="#0141A8"
                            fontFamily="monospace"
                          >
                            {m.spTotal}
                          </text>

                          {/* Bar 2: SP Terealisasi (Green) */}
                          <rect
                            x={x2}
                            y={y2}
                            width={barW}
                            height={h2}
                            rx={4}
                            fill="#059669"
                            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          />
                          <text
                            x={x2 + barW / 2}
                            y={y2 - 6}
                            textAnchor="middle"
                            fontSize="10.5"
                            fontWeight="800"
                            fill="#059669"
                            fontFamily="monospace"
                          >
                            {m.spRealisasi}
                          </text>

                          {/* Mitra Name */}
                          <text
                            x={groupCenterX}
                            y={H - MB + 20}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="700"
                            fill={COLORS.gray900}
                            fontFamily="Inter, sans-serif"
                          >
                            {m.mitra}
                          </text>

                          {/* Success Rate Tag Under Mitra */}
                          <rect
                            x={groupCenterX - 34}
                            y={H - MB + 28}
                            width={68}
                            height={18}
                            rx={4}
                            fill={m.rateRealisasi >= 95 ? "#ECFDF5" : m.rateRealisasi >= 90 ? "#EFF6FF" : "#FFF8E1"}
                            stroke={m.rateRealisasi >= 95 ? "#A5D6A7" : m.rateRealisasi >= 90 ? "#90CAF9" : "#FFE082"}
                          />
                          <text
                            x={groupCenterX}
                            y={H - MB + 41}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="800"
                            fill={m.rateRealisasi >= 95 ? "#059669" : m.rateRealisasi >= 90 ? "#0141A8" : "#B45309"}
                          >
                            {m.rateRealisasi}% Cair
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Matrix Summary Cards Under Bar Chart */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 16 }}>
              {computedSPMitra.map((m, i) => (
                <div key={i} style={{ padding: "10px 12px", background: COLORS.gray50, borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray900, marginBottom: 2 }}>{m.mitra}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.gray600 }}>
                    <span>Terealisasi:</span>
                    <strong style={{ color: "#059669" }}>{m.spRealisasi} / {m.spTotal} SP</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>
                    <span>Nominal Salur:</span>
                    <strong style={{ color: COLORS.blueDark, fontFamily: "monospace" }}>Rp {m.nominalRealisasi} M</strong>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, fontSize: 11.5, color: COLORS.gray500, textAlign: "center" }}>
              💡 Data realisasi SP diperbarui otomatis berdasarkan settlement status API host-to-host dan rekening koran CMS masing-masing mitra bayar untuk periode <strong>{selectedPeriodeSP}</strong>.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STANDARISASI & REKONSILIASI REKENING KORAN (MAPPING CMS) */}
      {activeTab === "mapping_cms" && (
        <RekonRekeningKoran />
      )}

      {/* TAB 3: REKAPITULASI PENYALURAN HARIAN CMS */}
      {activeTab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <SectionTitle>Rekapitulasi Mapping CMS Mitra Bayar vs Transaksi YANDU NG (THT, JKK, JKm)</SectionTitle>
              <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                Pemadanan nomor referensi transaksi CMS bank terhadap Nomor Surat Perintah (SP) klaim program <strong>THT, JKK, dan JKm</strong>.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Rekapitulasi Penyaluran CMS Mitra Bayar (THT, JKK, JKm)",
                    subtitle: `Periode Juli 2026 • ${filteredRekap.length} Transaksi`,
                    type: "table",
                    fileName: "Rekap_Penyaluran_CMS_THT_JKK_JKM.xlsx",
                    content: {
                      columns: ["No. Ref CMS", "NRP/NIP", "Nama Peserta", "Program Manfaat", "Mitra Bayar", "No. SP", "Nominal", "Cabang", "Status"],
                      rows: filteredRekap.map(r => [r.noRef, r.nrp, r.nama, r.jenis, r.mitra, r.noSP, r.nominal, r.cabang, r.status]),
                      totalRows: filteredRekap.length
                    }
                  })
                }
              >
                <Download size={13} /> Ekspor Excel
              </Btn>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap", background: COLORS.gray50, padding: "12px 14px", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <Select label="Mitra Bayar" value={selectedMitraFilter} onChange={setSelectedMitraFilter} options={["Semua", "Bank Mandiri", "Bank BRI", "Bank BNI", "Bank BTN", "PT Pos Indonesia", "Bank BSI"]} minW={150} />
            <Select label="Program Manfaat" value={filterJenis} onChange={setFilterJenis} options={["Semua", "THT (BUP)", "Klaim JKK Perawatan", "Klaim JKm"]} minW={160} />
            <Select label="Status Transaksi" value={filterStatusBayar} onChange={setFilterStatusBayar} options={["Semua", "Berhasil", "Gagal"]} minW={110} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4, fontWeight: 600 }}>Cari Peserta / No. SP</label>
              <SearchInput value={searchRekap} onChange={setSearchRekap} placeholder="Ketik NRP, Nama, atau No. SP..." />
            </div>
          </div>

          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>
            Menampilkan <strong>{filteredRekap.length}</strong> transaksi penyaluran CMS terverifikasi (THT, JKK, JKm)
          </div>

          {filteredRekap.length === 0 ? (
            <NoData text="Tidak ada transaksi yang cocok dengan filter yang dipilih." />
          ) : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    {["No", "No. Referensi CMS", "NRP / NOPEN", "Nama Penerima Manfaat", "Program Manfaat", "Mitra Bayar", "No. SP (YANDU)", "Nominal", "Waktu", "Kantor Cabang", "Status"].map((c, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "10px 12px",
                          textAlign: i === 7 ? "right" : "left",
                          fontWeight: 800,
                          color: "#64748B",
                          borderBottom: `1px solid #E2E8F0`,
                          borderRight: i < 10 ? "1px solid #E2E8F0" : "none",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRekap.map((r, i) => (
                    <tr
                      key={r.no}
                      style={{
                        borderBottom: `1px solid #E2E8F0`,
                        background: r.status === "Gagal" ? "#FFF1F2" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                      }}
                      onMouseEnter={e => {
                        if (r.status !== "Gagal") e.currentTarget.style.background = "#F1F5F9";
                      }}
                      onMouseLeave={e => {
                        if (r.status !== "Gagal") e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF";
                      }}
                    >
                      <td style={{ padding: "10px 12px", color: COLORS.gray500, textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blueDark, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{r.noRef}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, borderRight: "1px solid #E2E8F0" }}>{r.nrp}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.nama}</td>
                      <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>
                        <Badge color={r.jenis.includes("JKK") ? "orange" : r.jenis.includes("JKm") ? "purple" : "blue"}>
                          {r.jenis}
                        </Badge>
                      </td>
                      <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>{r.mitra}</td>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.gray700, borderRight: "1px solid #E2E8F0" }}>{r.noSP}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.nominal}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{r.waktu}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11.5, color: COLORS.gray700, borderRight: "1px solid #E2E8F0" }}>{r.cabang}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <Badge color={r.status === "Berhasil" ? "green" : "red"}>
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
