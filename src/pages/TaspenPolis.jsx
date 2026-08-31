import { useState } from "react";
import {
  AlertTriangle,
  Shield,
  Banknote,
  Clock,
  CircleDot,
  Upload,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Layers,
  Filter,
  Eye,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import {
  StatCard,
  SectionTitle,
  Btn,
  Select,
  SearchInput,
  Badge,
  ProgressBar,
  Table,
  NoData,
  PreviewModal,
} from "../components/common";

export const TaspenPolis = () => {
  const [tab, setTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState("brd"); // "brd" (Monitoring Polis Yarpro) vs "brs" (Tabel 5 Cabang)
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterCabang, setFilterCabang] = useState("Semua");
  const [filterStatusBayar, setFilterStatusBayar] = useState("Semua");
  const [filterStatusPolis, setFilterStatusPolis] = useState("Semua");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [detailPolis, setDetailPolis] = useState(null);
  const [baState, setBaState] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const [tglAwal, setTglAwal] = useState("2026-01-01");
  const [tglAkhir, setTglAkhir] = useState("2026-12-31");
  const [filterRekapBulan, setFilterRekapBulan] = useState("Semua");
  const [filterRekapTahun, setFilterRekapTahun] = useState("2026");
  const [filterRekapProgram, setFilterRekapProgram] = useState("Semua Program");

  const fmt = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
  const progColor = (p) =>
    p.includes("TDS")
      ? "blue"
      : p.includes("JKK")
      ? "orange"
      : "green";
  const progShort = (p) =>
    p.includes("TDS")
      ? "TDS (2,5%)"
      : p.includes("JKK")
      ? "TPB-JKK (3%)"
      : "TPB-JKM (3%)";

  // Data Polis lengkap selaras BRD V5 (Line 772-779 & Line 925-927) dan BRS Tabel 5
  const polis = [
    {
      id: "P1",
      noPolis: "TL-TDS-2026-00145",
      ktpa: "KTPA-0012845",
      nrp: "3195012345",
      nik: "3201010101850001",
      nama: "Serka Ahmad Fauzi",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      feeRate: 0.025,
      premi: 6000000,
      premiBulanan: 500000,
      tglMulai: "01 Jan 2026",
      tglAkhir: "31 Des 2030",
      tglPolis: "05 Jan 2026",
      tglBayarPolis: "15 Jan 2026",
      tglAju: "05 Jun 2026",
      tglLahir: "01 Jan 1985",
      cabang: "KC Jakarta",
      noSP: "SP/TL/2026/07/001",
      statusPolis: "Aktif",
      statusBayar: "Sudah Dibayar",
      nikValid: true,
      mekanismeBayar: "Potongan Tabungan Asuransi (TA) kelipatan Rp 6.000.000",
      isTDS: true,
    },
    {
      id: "P2",
      noPolis: "TL-TDS-2026-00146",
      ktpa: "KTPA-0012846",
      nrp: "3196023456",
      nik: "3175020202920002",
      nama: "Briptu Rina Marlina",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      feeRate: 0.025,
      premi: 6000000,
      premiBulanan: 500000,
      tglMulai: "01 Feb 2026",
      tglAkhir: "31 Jan 2031",
      tglPolis: "05 Feb 2026",
      tglBayarPolis: "15 Feb 2026",
      tglAju: "05 Jun 2026",
      tglLahir: "02 Feb 1992",
      cabang: "KC Jakarta",
      noSP: "SP/TL/2026/07/001",
      statusPolis: "Aktif",
      statusBayar: "Sudah Dibayar",
      nikValid: true,
      mekanismeBayar: "Potongan Tabungan Asuransi (TA) kelipatan Rp 6.000.000",
      isTDS: true,
    },
    {
      id: "P3",
      noPolis: "TL-JKK-2026-00089",
      ktpa: "KTPA-0012847",
      nrp: "1198034567",
      nik: "3674030303780003",
      nama: "Letkol Bambang Suharto",
      program: "TPB - Proteksi Beasiswa JKK",
      kodeProgram: "TPB_JKK",
      feeRate: 0.03,
      premi: 7440000,
      premiBulanan: 620000,
      tglMulai: "01 Mar 2026",
      tglAkhir: "28 Feb 2029",
      tglPolis: "08 Mar 2026",
      tglBayarPolis: "18 Mar 2026",
      tglAju: "08 Jun 2026",
      tglLahir: "03 Mar 1978",
      cabang: "KC Bandung",
      noSP: "SP/TL/2026/07/002",
      statusPolis: "Aktif",
      statusBayar: "Dalam Proses",
      nikValid: true,
      mekanismeBayar: "Premi Asuransi Jiwa & Proteksi Beasiswa Berkala",
      isTDS: false,
    },
    {
      id: "P4",
      noPolis: "TL-JKK-2026-00090",
      ktpa: "KTPA-0012848",
      nrp: "198604042008122001",
      nik: "35780404048600", // Invalid 14 digit
      nama: "Penata Tk.I Siti Nurhaliza",
      program: "TPB - Proteksi Beasiswa JKK",
      kodeProgram: "TPB_JKK",
      feeRate: 0.03,
      premi: 6480000,
      premiBulanan: 540000,
      tglMulai: "01 Apr 2026",
      tglAkhir: "31 Mar 2029",
      tglPolis: "10 Apr 2026",
      tglBayarPolis: "—",
      tglAju: "10 Jun 2026",
      tglLahir: "04 Apr 1986",
      cabang: "KC Surabaya",
      noSP: "—",
      statusPolis: "Aktif",
      statusBayar: "Belum Dibayar",
      nikValid: false,
      mekanismeBayar: "Premi Asuransi Jiwa & Proteksi Beasiswa Berkala",
      isTDS: false,
    },
    {
      id: "P5",
      noPolis: "TL-JKM-2026-00034",
      ktpa: "KTPA-0012849",
      nrp: "2195056789",
      nik: "3273050505850005",
      nama: "AKP Dedi Kurniawan",
      program: "TPB - Proteksi Beasiswa JKm",
      kodeProgram: "TPB_JKM",
      feeRate: 0.03,
      premi: 3720000,
      premiBulanan: 310000,
      tglMulai: "01 Mei 2026",
      tglAkhir: "30 Apr 2029",
      tglPolis: "12 Mei 2026",
      tglBayarPolis: "20 Mei 2026",
      tglAju: "12 Jun 2026",
      tglLahir: "05 Mei 1985",
      cabang: "KC Bandung",
      noSP: "SP/TL/2026/07/003",
      statusPolis: "Aktif",
      statusBayar: "Sudah Dibayar",
      nikValid: true,
      mekanismeBayar: "Premi Asuransi Jiwa & Proteksi Beasiswa Berkala",
      isTDS: false,
    },
    {
      id: "P6",
      noPolis: "TL-TDS-2026-00147",
      ktpa: "KTPA-0012850",
      nrp: "2190067890",
      nik: "", // Kosong
      nama: "Peltu Hendra Wijaya",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      feeRate: 0.025,
      premi: 6000000,
      premiBulanan: 500000,
      tglMulai: "01 Jun 2026",
      tglAkhir: "31 Mei 2031",
      tglPolis: "14 Jun 2026",
      tglBayarPolis: "—",
      tglAju: "14 Jun 2026",
      tglLahir: "06 Jun 1990",
      cabang: "KC Medan",
      noSP: "—",
      statusPolis: "Aktif",
      statusBayar: "Belum Dibayar",
      nikValid: false,
      mekanismeBayar: "Potongan Tabungan Asuransi (TA) kelipatan Rp 6.000.000",
      isTDS: true,
    },
    {
      id: "P7",
      noPolis: "TL-JKM-2026-00035",
      ktpa: "KTPA-0012851",
      nrp: "198207072006042001",
      nik: "3171070707820007",
      nama: "Pembina Utama Dr. Ratna",
      program: "TPB - Proteksi Beasiswa JKm",
      kodeProgram: "TPB_JKM",
      feeRate: 0.03,
      premi: 3480000,
      premiBulanan: 290000,
      tglMulai: "01 Jun 2026",
      tglAkhir: "31 Mei 2029",
      tglPolis: "15 Jun 2026",
      tglBayarPolis: "22 Jun 2026",
      tglAju: "15 Jun 2026",
      tglLahir: "07 Jul 1982",
      cabang: "KC Jakarta",
      noSP: "SP/TL/2026/07/003",
      statusPolis: "Aktif",
      statusBayar: "Sudah Dibayar",
      nikValid: true,
      mekanismeBayar: "Premi Asuransi Jiwa & Proteksi Beasiswa Berkala",
      isTDS: false,
    },
    {
      id: "P8",
      noPolis: "TL-TDS-2026-00148",
      ktpa: "KTPA-0012852",
      nrp: "3188098765",
      nik: "3578090909880009",
      nama: "Bripka Anwar Ibrahim",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      feeRate: 0.025,
      premi: 6000000,
      premiBulanan: 500000,
      tglMulai: "01 Jun 2026",
      tglAkhir: "31 Mei 2031",
      tglPolis: "18 Jun 2026",
      tglBayarPolis: "—",
      tglAju: "18 Jun 2026",
      tglLahir: "09 Sep 1988",
      cabang: "KC Surabaya",
      noSP: "—",
      statusPolis: "Aktif",
      statusBayar: "Belum Dibayar",
      nikValid: true,
      mekanismeBayar: "Potongan Tabungan Asuransi (TA) kelipatan Rp 6.000.000",
      isTDS: true,
    },
  ];

  const programs = [
    "TDS (Taspen Dwiguna Sejahtera)",
    "TPB - Proteksi Beasiswa JKK",
    "TPB - Proteksi Beasiswa JKm",
  ];
  const cabangList = [...new Set(polis.map((p) => p.cabang))];

  const rows = polis.filter((p) => {
    if (filterProgram !== "Semua" && p.program !== filterProgram) return false;
    if (filterCabang !== "Semua" && p.cabang !== filterCabang) return false;
    if (filterStatusBayar !== "Semua" && p.statusBayar !== filterStatusBayar)
      return false;
    if (filterStatusPolis !== "Semua" && p.statusPolis !== filterStatusPolis)
      return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.nama.toLowerCase().includes(q) &&
        !p.nik.includes(search) &&
        !p.ktpa.toLowerCase().includes(q) &&
        !p.nrp.includes(search) &&
        !p.noPolis.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const stat = (pr) => {
    const g = polis.filter((p) => p.program === pr);
    const totalP = g.reduce((a, p) => a + p.premi, 0);
    const feeRate = pr.includes("TDS") ? 0.025 : 0.03;
    return {
      n: g.length,
      premi: totalP,
      feeBase: totalP * feeRate,
      lunas: g.filter((p) => p.statusBayar === "Sudah Dibayar").length,
    };
  };

  const invalidNik = polis.filter((p) => !p.nikValid);
  const totalPremi = polis.reduce((a, p) => a + p.premi, 0);
  const totalFeeBase = polis.reduce((a, p) => a + p.premi * p.feeRate, 0);
  const belumBayar = polis.filter((p) => p.statusBayar === "Belum Dibayar");
  const totalBelum = belumBayar.reduce((a, p) => a + p.premi, 0);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Modal Detail Polis Lengkap */}
      {detailPolis && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setDetailPolis(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 620,
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                background: "#0F172A",
                color: COLORS.white,
                borderRadius: "14px 14px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                  Laporan Monitoring Polis Taspen Life (BRD Yarpro)
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                  {detailPolis.noPolis}
                </div>
              </div>
              <button
                onClick={() => setDetailPolis(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: COLORS.white,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Alert TDS Khusus Pensiunan */}
              {detailPolis.isTDS && (
                <div
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 18,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <Info size={16} color={COLORS.blue} style={{ marginTop: 2 }} />
                  <div style={{ fontSize: 12.5, color: "#1E40AF", lineHeight: 1.5 }}>
                    <strong>Kaidah Bisnis TDS (Taspen Dwiguna Sejahtera):</strong> Khusus peserta pensiun, premi dipotong langsung dari Tabungan Asuransi (TA) kelipatan Rp 6.000.000. Pemotongan tidak membentuk SP tersendiri (mengikuti SP TA).
                  </div>
                </div>
              )}

              {/* Data Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {[
                  ["Nama Pemegang Polis", detailPolis.nama],
                  ["NRP / NOPENS", detailPolis.nrp],
                  ["Nomor KTPA", detailPolis.ktpa],
                  ["NIK Dukcapil", detailPolis.nik || "(Belum Terisi / Kosong)"],
                  ["Jenis Program", detailPolis.program],
                  ["Kantor Cabang", detailPolis.cabang],
                  ["Tanggal Mulai Polis", detailPolis.tglMulai],
                  ["Tanggal Akhir Polis", detailPolis.tglAkhir],
                  ["Premi Bulanan", fmt(detailPolis.premiBulanan)],
                  ["Total Nominal Premi", fmt(detailPolis.premi)],
                  ["Tarif Fee Base (Imbal Jasa)", `${(detailPolis.feeRate * 100).toFixed(1)}%`],
                  ["Nominal Fee Base Diterima", fmt(detailPolis.premi * detailPolis.feeRate)],
                  ["Status Polis", detailPolis.statusPolis],
                  ["Status Bayar Premi", detailPolis.statusBayar],
                  ["Nomor SP Pembayaran", detailPolis.noSP],
                  ["Tanggal Bayar Polis", detailPolis.tglBayarPolis],
                ].map(([lbl, val], idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 12px",
                      background: idx % 2 === 0 ? "#F8FAFC" : "#FFFFFF",
                      borderRadius: 6,
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 500 }}>{lbl}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray900, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreview({
                      title: `Data Polis ${detailPolis.noPolis}`,
                      subtitle: detailPolis.nama,
                      type: "table",
                      fileName: `Polis_${detailPolis.noPolis}.pdf`,
                      content: {
                        columns: ["Parameter", "Nilai Data"],
                        rows: [
                          ["Nomor Polis", detailPolis.noPolis],
                          ["Nama Peserta", detailPolis.nama],
                          ["KTPA / NRP", `${detailPolis.ktpa} / ${detailPolis.nrp}`],
                          ["NIK", detailPolis.nik || "—"],
                          ["Program", detailPolis.program],
                          ["Masa Berlaku", `${detailPolis.tglMulai} s.d. ${detailPolis.tglAkhir}`],
                          ["Premi Bruto", fmt(detailPolis.premi)],
                          ["Fee Base ASABRI", fmt(detailPolis.premi * detailPolis.feeRate)],
                          ["Status Pembayaran", detailPolis.statusBayar],
                        ],
                        totalRows: 9,
                      },
                    });
                  }}
                >
                  Unduh Format PDF
                </Btn>
                <Btn size="sm" onClick={() => setDetailPolis(null)}>
                  Tutup
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert NIK tidak valid */}
      {invalidNik.length > 0 && (
        <div
          style={{
            background: "#FFFBEB",
            border: `1px solid #FCD34D`,
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AlertTriangle size={20} color="#D97706" />
          <div style={{ fontSize: 13 }}>
            <strong style={{ color: "#B45309" }}>
              {invalidNik.length} polis terdeteksi dengan NIK belum valid / tidak lengkap
            </strong>
            <span style={{ color: COLORS.gray700 }}>
              {" "}— sesuai aturan bisnis <strong>BR-TL-07</strong> (BRD V5), status ini dicatat sebagai pengecualian (*exception*) dan <strong>TIDAK menghambat proses pembayaran premi periode berjalan</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard
          icon={<Shield size={IC} />}
          label="Total Polis Aktif"
          value={polis.length.toString()}
          sub="3 sub-program Taspen Life"
          color={COLORS.blue}
        />
        <StatCard
          icon={<Banknote size={IC} />}
          label="Total Premi Bruto"
          value={fmt(totalPremi)}
          sub="Portofolio aktif 2026"
          color={COLORS.green}
        />
        <StatCard
          icon={<TrendingUp size={IC} />}
          label="Estimasi Fee Base (Imbal Jasa)"
          value={fmt(totalFeeBase)}
          sub="Tarif 2,5% (TDS) & 3,0% (TPB)"
          color="#8B5CF6"
        />
        <StatCard
          icon={<Clock size={IC} />}
          label="Premi Belum Dibayar"
          value={belumBayar.length.toString()}
          sub={fmt(totalBelum)}
          color={COLORS.orange}
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          borderBottom: `2px solid ${COLORS.gray200}`,
        }}
      >
        {[
          { id: "dashboard", l: "Dashboard Program" },
          { id: "peserta", l: "Daftar Peserta & Polis (Format BRD / BRS)" },
          { id: "rekap", l: "Rekapitulasi Polis (Tabel 8 BRS & BRD)" },
          { id: "ba", l: "Berita Acara & Rekonsiliasi" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "11px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: 600,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: tab === t.id ? COLORS.blue : COLORS.gray500,
              borderBottom:
                tab === t.id
                  ? `3px solid ${COLORS.blue}`
                  : "3px solid transparent",
              marginBottom: -2,
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* TAB: Dashboard per Program */}
      {tab === "dashboard" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {programs.map((pr, i) => {
              const s = stat(pr);
              const pct = s.n ? Math.round((s.lunas / s.n) * 100) : 0;
              return (
                <div
                  key={i}
                  style={{
                    background: COLORS.white,
                    borderRadius: 10,
                    padding: 20,
                    border: `1px solid ${COLORS.gray200}`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <Badge color={progColor(pr)}>{progShort(pr)}</Badge>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: COLORS.gray500,
                        fontWeight: 600,
                      }}
                    >
                      {pr.includes("TDS") ? "Tarif Fee 2,5%" : "Tarif Fee 3,0%"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: COLORS.gray900,
                      marginBottom: 12,
                    }}
                  >
                    {pr}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      padding: "10px 12px",
                      background: COLORS.gray50,
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>
                        Peserta
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: COLORS.gray900,
                        }}
                      >
                        {s.n}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>
                        Total Premi
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          fontFamily: "monospace",
                          color: COLORS.blueDark,
                        }}
                      >
                        {fmt(s.premi)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11.5,
                      color: COLORS.gray600,
                      marginBottom: 6,
                    }}
                  >
                    <span>Estimasi Imbal Jasa:</span>
                    <strong style={{ color: "#7C3AED" }}>{fmt(s.feeBase)}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.gray500,
                      marginBottom: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Status pembayaran premi</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: pct === 100 ? COLORS.green : COLORS.orange,
                      }}
                    >
                      {s.lunas}/{s.n} lunas
                    </span>
                  </div>
                  <ProgressBar
                    value={s.lunas}
                    max={s.n}
                    color={pct === 100 ? COLORS.green : COLORS.orange}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <SectionTitle
              action={
                <span
                  style={{
                    fontSize: 11.5,
                    color: COLORS.green,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <CircleDot size={11} /> Sinkronisasi Otomatis Web Service Taspen Life
                </span>
              }
            >
              Rekapitulasi Portofolio & Status Pembayaran Premi
            </SectionTitle>
            <Table
              columns={[
                "Program Taspen Life",
                "Tarif Fee Base",
                "Jumlah Polis",
                "Total Premi Bruto",
                "Estimasi Imbal Jasa",
                "Sudah Dibayar",
                "Dalam Proses",
                "Belum Dibayar",
              ]}
              data={programs.map((pr) => {
                const g = polis.filter((p) => p.program === pr);
                const totP = g.reduce((a, p) => a + p.premi, 0);
                const feeRate = pr.includes("TDS") ? 0.025 : 0.03;
                return [
                  <Badge color={progColor(pr)}>{pr}</Badge>,
                  <strong>{(feeRate * 100).toFixed(1)}%</strong>,
                  g.length,
                  fmt(totP),
                  <strong style={{ color: COLORS.blueDark }}>{fmt(totP * feeRate)}</strong>,
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>
                    {g.filter((p) => p.statusBayar === "Sudah Dibayar").length}
                  </span>,
                  <span style={{ color: COLORS.orange, fontWeight: 700 }}>
                    {g.filter((p) => p.statusBayar === "Dalam Proses").length}
                  </span>,
                  <span style={{ color: COLORS.red, fontWeight: 700 }}>
                    {g.filter((p) => p.statusBayar === "Belum Dibayar").length}
                  </span>,
                ];
              })}
            />
            <div
              style={{
                marginTop: 10,
                fontSize: 11.5,
                color: COLORS.gray500,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Terakhir sinkron: 20 Agustus 2026, 06:00 WIB • Sumber: Core YANDU NextGen & Web Service Taspen Life</span>
              <span>Kaidah Bisnis: BR-TL-01 s.d. BR-TL-08</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Daftar Peserta & Polis (Format Standar BRD & BRS) */}
      {tab === "peserta" && (
        <div
          style={{
            background: COLORS.white,
            borderRadius: 10,
            padding: 20,
            border: `1px solid ${COLORS.gray200}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                {viewMode === "brd"
                  ? "Laporan Monitoring Polis Taspen Life (Format 26 Laporan Standar BRD)"
                  : "Daftar Peserta per Program (Format Tabel 5 BRS)"}
              </h3>
              <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                Pengguna: Divisi Keuangan (Bidang Yarpro) • Frekuensi: Bulanan & On-Demand
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Toggle Format Tampilan */}
              <div
                style={{
                  display: "inline-flex",
                  background: COLORS.gray100,
                  borderRadius: 8,
                  padding: 3,
                  border: `1px solid ${COLORS.gray300}`,
                }}
              >
                <button
                  onClick={() => setViewMode("brd")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: viewMode === "brd" ? COLORS.blueDark : "transparent",
                    color: viewMode === "brd" ? COLORS.white : COLORS.gray700,
                  }}
                >
                  Format BRD (Yarpro)
                </button>
                <button
                  onClick={() => setViewMode("brs")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: viewMode === "brs" ? COLORS.blueDark : "transparent",
                    color: viewMode === "brs" ? COLORS.white : COLORS.gray700,
                  }}
                >
                  Format BRS (Tabel 5)
                </button>
              </div>

              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Laporan Monitoring Polis Taspen Life",
                    subtitle: `Format ${viewMode === "brd" ? "Standar BRD Keuangan (Yarpro)" : "Tabel 5 BRS"} • Periode 2026`,
                    type: "table",
                    fileName: `Laporan_Monitoring_Polis_TaspenLife_${viewMode}.xlsx`,
                    content: {
                      columns:
                        viewMode === "brd"
                          ? [
                              "No",
                              "Nomor Polis",
                              "NRP/KTPA",
                              "Nama Peserta",
                              "Nominal Premi",
                              "Program",
                              "Masa Berlaku",
                              "Status Polis",
                              "Status Bayar",
                              "Fee Base Diterima",
                            ]
                          : [
                              "Cabang",
                              "KTPA",
                              "No. Polis",
                              "Nama",
                              "Program",
                              "Premi",
                              "Status",
                            ],
                      rows: rows.map((p, idx) =>
                        viewMode === "brd"
                          ? [
                              idx + 1,
                              p.noPolis,
                              p.ktpa,
                              p.nama,
                              fmt(p.premi),
                              progShort(p.program),
                              `${p.tglMulai} - ${p.tglAkhir}`,
                              p.statusPolis,
                              p.statusBayar,
                              fmt(p.premi * p.feeRate),
                            ]
                          : [
                              p.cabang,
                              p.ktpa,
                              p.noPolis,
                              p.nama,
                              progShort(p.program),
                              fmt(p.premi),
                              p.statusBayar,
                            ]
                      ),
                      totalRows: rows.length,
                    },
                  })
                }
              >
                <FileSpreadsheet size={13} style={{ marginRight: 4 }} /> Ekspor Excel
              </Btn>
              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Laporan Monitoring Polis Taspen Life",
                    subtitle: "Format Resmi PDF Divisi Keuangan PT ASABRI (Persero)",
                    type: "table",
                    fileName: "Laporan_Monitoring_Polis_TaspenLife.pdf",
                    content: {
                      columns: [
                        "No",
                        "Nomor Polis",
                        "Nama Peserta",
                        "Program",
                        "Nominal Premi",
                        "Fee Base (Imbal Jasa)",
                        "Status",
                      ],
                      rows: rows.map((p, idx) => [
                        idx + 1,
                        p.noPolis,
                        p.nama,
                        progShort(p.program),
                        fmt(p.premi),
                        fmt(p.premi * p.feeRate),
                        p.statusBayar,
                      ]),
                      totalRows: rows.length,
                    },
                  })
                }
              >
                <FileText size={13} style={{ marginRight: 4 }} /> Ekspor PDF
              </Btn>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Select
              label="Program"
              value={filterProgram}
              onChange={setFilterProgram}
              options={["Semua", ...programs]}
              minW={220}
            />
            <Select
              label="Kantor Cabang"
              value={filterCabang}
              onChange={setFilterCabang}
              options={["Semua", ...cabangList]}
              minW={140}
            />
            <Select
              label="Status Pembayaran"
              value={filterStatusBayar}
              onChange={setFilterStatusBayar}
              options={["Semua", "Belum Dibayar", "Dalam Proses", "Sudah Dibayar"]}
              minW={160}
            />
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: COLORS.gray500,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Pencarian
              </label>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="No. Polis / NRP / KTPA / NIK / Nama..."
                minW={260}
              />
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: COLORS.gray500,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Menampilkan <strong>{rows.length}</strong> dari <strong>{polis.length}</strong> polis terdaftar
            </span>
            <span>Klik tombol <strong>Detail</strong> pada baris untuk melihat riwayat lengkap & kaidah pemotongan</span>
          </div>

          {rows.length === 0 ? (
            <NoData />
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 8,
                border: `1px solid #CBD5E1`,
                boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
              }}
            >
              {viewMode === "brd" ? (
                /* TABEL 1: FORMAT STANDAR BRD V5 (Line 772-779) */
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      {[
                        "No.",
                        "Nomor Polis",
                        "NRP / Nopens / KTPA",
                        "Nama Peserta",
                        "Jenis Program",
                        "Nominal Premi",
                        "Premi Bln",
                        "Masa Berlaku Polis",
                        "Status Polis",
                        "Status Bayar",
                        "Fee Base Diterima",
                        "Aksi",
                      ].map((c, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "10px 11px",
                            textAlign: i === 5 || i === 6 || i === 10 ? "right" : "left",
                            fontWeight: 800,
                            color: "#64748B",
                            borderBottom: `1px solid #E2E8F0`,
                            borderRight: i < 11 ? "1px solid #E2E8F0" : "none",
                            whiteSpace: "nowrap",
                            fontSize: 11.5,
                          }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                          background: !p.nikValid
                            ? "#FFFBEB"
                            : i % 2 === 1
                            ? "#F8FAFC"
                            : "#FFFFFF",
                        }}
                        onMouseEnter={(e) => {
                          if (p.nikValid) e.currentTarget.style.background = "#F1F5F9";
                        }}
                        onMouseLeave={(e) => {
                          if (p.nikValid)
                            e.currentTarget.style.background =
                              i % 2 === 1 ? "#F8FAFC" : "#FFFFFF";
                        }}
                      >
                        <td
                          style={{
                            padding: "9px 11px",
                            textAlign: "center",
                            color: "#64748B",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {i + 1}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            color: COLORS.blue,
                            fontWeight: 700,
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.noPolis}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.ktpa}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontWeight: 700,
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {p.nama}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Badge color={progColor(p.program)}>
                            {progShort(p.program)}
                          </Badge>
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(p.premi)}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            color: COLORS.gray600,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(p.premiBulanan)}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontSize: 11.5,
                            color: COLORS.gray700,
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.tglMulai} - {p.tglAkhir}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          <Badge color="green">{p.statusPolis}</Badge>
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Badge
                            color={
                              p.statusBayar === "Sudah Dibayar"
                                ? "green"
                                : p.statusBayar === "Dalam Proses"
                                ? "orange"
                                : "gray"
                            }
                          >
                            {p.statusBayar}
                          </Badge>
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "#7C3AED",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(p.premi * p.feeRate)}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <Btn size="xs" variant="outline" onClick={() => setDetailPolis(p)}>
                            Detail
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* TABEL 2: FORMAT TABEL 5 BRS (Kepesertaan Cabang) */
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      {[
                        "Cabang",
                        "No. KTPA",
                        "No. Polis",
                        "Tgl Ajuan",
                        "No. SP",
                        "Tgl Lahir",
                        "Nama Pemegang Polis",
                        "Program",
                        "NIK Dukcapil",
                        "Premi",
                        "Status",
                        "Aksi",
                      ].map((c, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "10px 11px",
                            textAlign: i === 9 ? "right" : "left",
                            fontWeight: 800,
                            color: "#64748B",
                            borderBottom: `1px solid #E2E8F0`,
                            borderRight: i < 11 ? "1px solid #E2E8F0" : "none",
                            whiteSpace: "nowrap",
                            fontSize: 11.5,
                          }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                          background: !p.nikValid
                            ? "#FFFBEB"
                            : i % 2 === 1
                            ? "#F8FAFC"
                            : "#FFFFFF",
                        }}
                        onMouseEnter={(e) => {
                          if (p.nikValid) e.currentTarget.style.background = "#F1F5F9";
                        }}
                        onMouseLeave={(e) => {
                          if (p.nikValid)
                            e.currentTarget.style.background =
                              i % 2 === 1 ? "#F8FAFC" : "#FFFFFF";
                        }}
                      >
                        <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>
                          {p.cabang}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {p.ktpa}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            color: COLORS.blue,
                            fontWeight: 600,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {p.noPolis}
                        </td>
                        <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>
                          {p.tglAju}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            color: p.noSP === "—" ? "#94A3B8" : "#334155",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {p.noSP}
                        </td>
                        <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>
                          {p.tglLahir}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontWeight: 700,
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {p.nama}
                        </td>
                        <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={progColor(p.program)}>
                            {progShort(p.program)}
                          </Badge>
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {p.nikValid ? (
                            p.nik
                          ) : (
                            <span style={{ color: COLORS.red, fontWeight: 700 }}>
                              {p.nik || "(kosong)"}{" "}
                              <AlertTriangle
                                size={11}
                                style={{ verticalAlign: "middle" }}
                              />
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(p.premi)}
                        </td>
                        <td
                          style={{
                            padding: "9px 11px",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          <Badge
                            color={
                              p.statusBayar === "Sudah Dibayar"
                                ? "green"
                                : p.statusBayar === "Dalam Proses"
                                ? "orange"
                                : "gray"
                            }
                          >
                            {p.statusBayar}
                          </Badge>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <Btn size="xs" variant="outline" onClick={() => setDetailPolis(p)}>
                            Detail
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: Rekapitulasi Polis (Tabel 8 BRS & BRD) */}
      {tab === "rekap" && (
        <div
          style={{
            background: COLORS.white,
            borderRadius: 10,
            padding: 20,
            border: `1px solid ${COLORS.gray200}`,
          }}
        >
          <SectionTitle
            action={
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreview({
                      title: "Preview Ekspor Rekapitulasi Polis Taspen Life (Tabel 8 BRS)",
                      subtitle: `Filter: ${filterRekapBulan} ${filterRekapTahun}`,
                      type: "table",
                      fileName: `Rekapitulasi_Polis_${filterRekapTahun}_${filterRekapBulan}.xlsx`,
                      content: {
                        columns: [
                          "No",
                          "Bulan Polis",
                          "Program",
                          "Jumlah Peserta",
                          "Nominal Premi",
                          "Total Fee Base (Imbal Jasa)",
                        ],
                        rows: [
                          [1, "Januari 2026", "TDS (THT)", 1240, fmt(558000000), fmt(558000000 * 0.025)],
                          [2, "Februari 2026", "TDS (THT)", 1255, fmt(564750000), fmt(564750000 * 0.025)],
                          [3, "Maret 2026", "TDS (THT)", 1260, fmt(567000000), fmt(567000000 * 0.025)],
                          [4, "April 2026", "TDS (THT)", 1280, fmt(576000000), fmt(576000000 * 0.025)],
                          [5, "Mei 2026", "TDS (THT)", 1290, fmt(580500000), fmt(580500000 * 0.025)],
                          [6, "Juni 2026", "TDS (THT)", 1310, fmt(589500000), fmt(589500000 * 0.025)],
                          [7, "Juli 2026", "TDS (THT)", 1325, fmt(596250000), fmt(596250000 * 0.025)],
                        ],
                        totalRows: 7,
                      },
                    })
                  }
                >
                  Ekspor Excel
                </Btn>
              </div>
            }
          >
            Rekapitulasi Polis — Tabel 8 BRS & BRD Keuangan
          </SectionTitle>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 18,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Select
              label="Program Taspen Life"
              value={filterRekapProgram}
              onChange={setFilterRekapProgram}
              options={[
                "Semua Program",
                "TDS (THT)",
                "Proteksi Beasiswa JKK",
                "Proteksi Beasiswa JKm",
              ]}
              minW={220}
            />
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: COLORS.gray500,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Tanggal Awal
              </label>
              <input
                type="date"
                value={tglAwal}
                onChange={(e) => setTglAwal(e.target.value)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12.5,
                  color: COLORS.gray800,
                  background: COLORS.white,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: COLORS.gray500,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={tglAkhir}
                onChange={(e) => setTglAkhir(e.target.value)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12.5,
                  color: COLORS.gray800,
                  background: COLORS.white,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                progKey: "TDS (THT)",
                title:
                  "REKAPITULASI POLIS ASURANSI TASPEN DWIGUNA SEJAHTERA (PROGRAM THT — TARIF 2,5%)",
                color: "blue",
                rate: 0.025,
                data: [
                  { bln: "Januari", thn: "2026", peserta: 1240, premi: 558000000 },
                  { bln: "Februari", thn: "2026", peserta: 1255, premi: 564750000 },
                  { bln: "Maret", thn: "2026", peserta: 1260, premi: 567000000 },
                  { bln: "April", thn: "2026", peserta: 1280, premi: 576000000 },
                  { bln: "Mei", thn: "2026", peserta: 1290, premi: 580500000 },
                  { bln: "Juni", thn: "2026", peserta: 1310, premi: 589500000 },
                  { bln: "Juli", thn: "2026", peserta: 1325, premi: 596250000 },
                ],
              },
              {
                progKey: "Proteksi Beasiswa JKK",
                title:
                  "REKAPITULASI POLIS ASURANSI TASPEN PROTEKSI BEASISWA (PROGRAM JKK — TARIF 3,0%)",
                color: "orange",
                rate: 0.03,
                data: [
                  { bln: "Januari", thn: "2026", peserta: 820, premi: 442800000 },
                  { bln: "Februari", thn: "2026", peserta: 835, premi: 450900000 },
                  { bln: "Maret", thn: "2026", peserta: 840, premi: 453600000 },
                  { bln: "April", thn: "2026", peserta: 850, premi: 459000000 },
                  { bln: "Mei", thn: "2026", peserta: 860, premi: 464400000 },
                  { bln: "Juni", thn: "2026", peserta: 875, premi: 472500000 },
                  { bln: "Juli", thn: "2026", peserta: 890, premi: 480600000 },
                ],
              },
              {
                progKey: "Proteksi Beasiswa JKm",
                title:
                  "REKAPITULASI POLIS ASURANSI TASPEN PROTEKSI BEASISWA (PROGRAM JKM — TARIF 3,0%)",
                color: "green",
                rate: 0.03,
                data: [
                  { bln: "Januari", thn: "2026", peserta: 780, premi: 241800000 },
                  { bln: "Februari", thn: "2026", peserta: 790, premi: 244900000 },
                  { bln: "Maret", thn: "2026", peserta: 795, premi: 246450000 },
                  { bln: "April", thn: "2026", peserta: 805, premi: 249550000 },
                  { bln: "Mei", thn: "2026", peserta: 815, premi: 252650000 },
                  { bln: "Juni", thn: "2026", peserta: 825, premi: 255750000 },
                  { bln: "Juli", thn: "2026", peserta: 840, premi: 260400000 },
                ],
              },
            ]
              .filter(
                (sec) =>
                  filterRekapProgram === "Semua Program" ||
                  sec.progKey === filterRekapProgram
              )
              .map((sec, si) => {
                const rows = sec.data.filter((r) => {
                  if (
                    filterRekapTahun !== "Semua" &&
                    r.thn !== filterRekapTahun
                  )
                    return false;
                  if (
                    filterRekapBulan !== "Semua" &&
                    r.bln !== filterRekapBulan
                  )
                    return false;
                  return true;
                });
                const totPeserta = rows.reduce((a, r) => a + r.peserta, 0);
                const totPremi = rows.reduce((a, r) => a + r.premi, 0);
                const totFee = totPremi * sec.rate;
                return (
                  <div
                    key={si}
                    style={{
                      border: `1px solid #CBD5E1`,
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
                    }}
                  >
                    <div
                      style={{
                        padding: "11px 14px",
                        background: "#1E293B",
                        borderBottom: `1px solid #334155`,
                        fontSize: 13,
                        fontWeight: 700,
                        color: COLORS.white,
                      }}
                    >
                      {sec.title}
                    </div>
                    {rows.length === 0 ? (
                      <NoData text="Tidak ada data rekapitulasi polis pada filter ini." />
                    ) : (
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 12.5,
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              background: "#F1F5F9",
                              color: "#64748B",
                            }}
                          >
                            {[
                              "No",
                              "Bulan Polis",
                              "Jumlah Peserta",
                              "Nominal Premi (Rp)",
                              "Total Fee Base / Imbal Jasa (Rp)",
                            ].map((c, k) => (
                              <th
                                key={k}
                                style={{
                                  padding: "9px 12px",
                                  textAlign: k >= 2 ? "right" : "left",
                                  fontWeight: 800,
                                  color: "#64748B",
                                  borderBottom: `1px solid #CBD5E1`,
                                  borderRight:
                                    k < 4 ? "1px solid #CBD5E1" : "none",
                                }}
                              >
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r, ri) => (
                            <tr
                              key={ri}
                              style={{
                                borderBottom: `1px solid #E2E8F0`,
                                background:
                                  ri % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#F1F5F9")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  ri % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                              }
                            >
                              <td
                                style={{
                                  padding: "9px 12px",
                                  color: "#64748B",
                                  textAlign: "center",
                                  borderRight: "1px solid #E2E8F0",
                                }}
                              >
                                {ri + 1}
                              </td>
                              <td
                                style={{
                                  padding: "9px 12px",
                                  fontWeight: 700,
                                  color: "#0F172A",
                                  borderRight: "1px solid #E2E8F0",
                                }}
                              >
                                {r.bln} {r.thn}
                              </td>
                              <td
                                style={{
                                  padding: "9px 12px",
                                  textAlign: "right",
                                  fontWeight: 600,
                                  borderRight: "1px solid #E2E8F0",
                                }}
                              >
                                {r.peserta.toLocaleString("id-ID")}
                              </td>
                              <td
                                style={{
                                  padding: "9px 12px",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  borderRight: "1px solid #E2E8F0",
                                }}
                              >
                                {fmt(r.premi)}
                              </td>
                              <td
                                style={{
                                  padding: "9px 12px",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontWeight: 700,
                                  color: COLORS.blueDark,
                                }}
                              >
                                {fmt(r.premi * sec.rate)}
                              </td>
                            </tr>
                          ))}
                          <tr
                            style={{
                              background: "#F8FAFC", borderTop: "2px solid #E2E8F0",
                              color: "#1E293B",
                              fontWeight: 800,
                            }}
                          >
                            <td
                              colSpan={2}
                              style={{
                                padding: "10px 12px",
                                color: "#1E293B",
                              }}
                            >
                              Total {sec.title.split("(")[1]?.replace(")", "")}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "right",
                                color: "#1D4ED8",
                              }}
                            >
                              {totPeserta.toLocaleString("id-ID")}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "right",
                                fontFamily: "monospace",
                                color: "#1E293B",
                              }}
                            >
                              {fmt(totPremi)}
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                textAlign: "right",
                                fontFamily: "monospace",
                                color: "#047857",
                                fontSize: 13,
                              }}
                            >
                              {fmt(totFee)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB: Berita Acara */}
      {tab === "ba" && (
        <div>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 24,
              border: `1px solid ${COLORS.gray200}`,
              marginBottom: 20,
            }}
          >
            <SectionTitle>Unggah Berita Acara dari Divisi Kepesertaan</SectionTitle>
            <div
              style={{
                background: "#FEF3C7",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 12.5,
                color: "#92400E",
                display: "flex",
                gap: 8,
              }}
            >
              <AlertTriangle size={16} />
              <span>
                <strong>Aturan Bisnis (BR-TL-02):</strong> Pembayaran premi asuransi kepada Taspen Life hanya dapat diproses apabila Berita Acara (BA) hasil rekonsiliasi data bersama Divisi Layanan dan Kepesertaan telah diunggah dan tervalidasi.
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: COLORS.gray500,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Tanggal Awal
                </label>
                <input
                  type="date"
                  defaultValue="2026-06-01"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: COLORS.gray500,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  defaultValue="2026-06-30"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <Select
                label="Program"
                value="Semua Program"
                onChange={() => {}}
                options={["Semua Program", ...programs]}
              />
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: COLORS.gray500,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Tanggal Berita Acara
                </label>
                <input
                  type="date"
                  defaultValue="2026-07-01"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                setBaState("uploading");
                setTimeout(() => setBaState("done"), 1400);
              }}
              onClick={() => {
                setBaState("uploading");
                setTimeout(() => setBaState("done"), 1400);
              }}
              style={{
                border: `2px dashed ${dragOver ? COLORS.blue : COLORS.gray300}`,
                borderRadius: 12,
                padding: "40px 24px",
                textAlign: "center",
                background: dragOver ? "#EFF6FF" : COLORS.gray50,
                cursor: "pointer",
              }}
            >
              {baState === "idle" && (
                <>
                  <div style={{ marginBottom: 10, opacity: 0.4 }}>
                    <Upload size={40} />
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.gray800,
                      marginBottom: 4,
                    }}
                  >
                    Drag &amp; drop Berita Acara di sini
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.gray500,
                      marginBottom: 14,
                    }}
                  >
                    atau klik untuk memilih file dari komputer
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "8px 20px",
                      background: COLORS.blue,
                      color: COLORS.white,
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Pilih File BA
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.gray400,
                      marginTop: 10,
                    }}
                  >
                    Format: PDF, XLSX — Maks. 20 MB
                  </div>
                </>
              )}
              {baState === "uploading" && (
                <>
                  <div style={{ marginBottom: 10, color: COLORS.blue }}>
                    <Clock size={40} />
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.blue,
                    }}
                  >
                    Mengunggah &amp; mencocokkan Berita Acara dengan data polis...
                  </div>
                </>
              )}
              {baState === "done" && (
                <>
                  <div style={{ marginBottom: 10, color: COLORS.green }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.green,
                      marginBottom: 4,
                    }}
                  >
                    Berita Acara berhasil diunggah &amp; direkonsiliasi
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.gray700,
                      marginBottom: 12,
                    }}
                  >
                    8 polis dicocokkan • 6 sesuai • 2 selisih ditemukan
                  </div>
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBaState("idle");
                    }}
                  >
                    Unggah Ulang
                  </Btn>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <SectionTitle>Riwayat Berita Acara &amp; Status Rekonsiliasi</SectionTitle>
            <Table
              columns={[
                "No. Berita Acara",
                "Periode",
                "Tgl Terima",
                "Jml Polis (BA)",
                "Jml Polis (Sistem)",
                "Selisih",
                "Status",
                "Diunggah Oleh",
              ]}
              data={[
                [
                  "BA/KEP/2026/06/012",
                  "Juni 2026",
                  "01 Jul 2026",
                  "8",
                  "8",
                  <span style={{ color: COLORS.orange, fontWeight: 700 }}>
                    2 selisih
                  </span>,
                  <Badge color="orange">Perlu Rekonsiliasi</Badge>,
                  "Staf Keuangan A",
                ],
                [
                  "BA/KEP/2026/05/011",
                  "Mei 2026",
                  "02 Jun 2026",
                  "7",
                  "7",
                  <span style={{ color: COLORS.green }}>0</span>,
                  <Badge color="green">Tervalidasi</Badge>,
                  "Staf Keuangan A",
                ],
                [
                  "BA/KEP/2026/04/010",
                  "April 2026",
                  "03 Mei 2026",
                  "7",
                  "7",
                  <span style={{ color: COLORS.green }}>0</span>,
                  <Badge color="green">Tervalidasi</Badge>,
                  "Staf Keuangan B",
                ],
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
