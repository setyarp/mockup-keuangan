import { useState, useMemo } from "react";
import {
  BarChart3,
  Shield,
  Lock,
  Calendar,
  Filter,
  CheckCircle2,
  ArrowLeft,
  Eye,
  Download,
  Search,
  Building2,
  FileText,
  Clock,
  ChevronRight
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, Btn, PreviewModal, SectionTitle, Table, NoData } from "../components/common";

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTH_FACTORS = {
  1: 0.985,  // Januari (Awal Tahun Anggaran)
  2: 0.988,  // Februari
  3: 0.992,  // Maret (THR / Triwulan I)
  4: 0.995,  // April
  5: 0.998,  // Mei
  6: 1.002,  // Juni (Gaji 13 / Kenaikan Berkala)
  7: 1.000,  // Juli (Baseline Standar TA 2026)
  8: 1.006,  // Agustus
  9: 1.011,  // September (Triwulan III)
  10: 1.016, // Oktober (Rekrutmen & Penyesuaian)
  11: 1.021, // November
  12: 1.025, // Desember (Penutupan Buku Akhir Tahun)
};

const BASE_SATKER_DATA = [
  {
    kode: "TNI_AD",
    nama: "TNI AD",
    isPPPK: false,
    gol: [
      { gol: "TAMTAMA (Golongan I)", peserta: 1100, gp: 66.0 },
      { gol: "BINTARA (Golongan II)", peserta: 1250, gp: 100.0 },
      { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 520, gp: 52.0 },
      { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 310, gp: 37.2 },
      { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 70, gp: 4.8 },
    ],
  },
  {
    kode: "TNI_AL",
    nama: "TNI AL",
    isPPPK: false,
    gol: [
      { gol: "TAMTAMA (Golongan I)", peserta: 450, gp: 27.0 },
      { gol: "BINTARA (Golongan II)", peserta: 560, gp: 44.8 },
      { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 260, gp: 26.0 },
      { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 120, gp: 14.4 },
      { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 30, gp: 1.4 },
    ],
  },
  {
    kode: "TNI_AU",
    nama: "TNI AU",
    isPPPK: false,
    gol: [
      { gol: "TAMTAMA (Golongan I)", peserta: 370, gp: 22.2 },
      { gol: "BINTARA (Golongan II)", peserta: 480, gp: 38.4 },
      { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 200, gp: 20.0 },
      { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 105, gp: 12.6 },
      { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 25, gp: 1.2 },
    ],
  },
  {
    kode: "POLRI",
    nama: "POLRI (Anggota)",
    isPPPK: false,
    gol: [
      { gol: "TAMTAMA (Golongan I)", peserta: 1050, gp: 63.0 },
      { gol: "BINTARA (Golongan II)", peserta: 1420, gp: 113.6 },
      { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 650, gp: 65.0 },
      { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 280, gp: 30.8 },
      { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 50, gp: 3.6 },
    ],
  },
  {
    kode: "PNS_POLRI",
    nama: "PNS POLRI",
    isPPPK: false,
    gol: [
      { gol: "Golongan I", peserta: 220, gp: 11.0 },
      { gol: "Golongan II", peserta: 480, gp: 33.6 },
      { gol: "Golongan III", peserta: 420, gp: 37.8 },
      { gol: "Golongan IV", peserta: 160, gp: 20.0 },
    ],
  },
  {
    kode: "PPPK_POLRI",
    nama: "PPPK POLRI",
    isPPPK: true,
    gol: [
      { gol: "Golongan IX", peserta: 210, gp: 10.5 },
      { gol: "Golongan X", peserta: 290, gp: 20.3 },
      { gol: "Golongan XI", peserta: 230, gp: 18.4 },
      { gol: "Golongan XII", peserta: 120, gp: 10.3 },
    ],
  },
  {
    kode: "PNS_KEMHAN",
    nama: "PNS Kemenhan",
    isPPPK: false,
    gol: [
      { gol: "Golongan I", peserta: 920, gp: 46.0 },
      { gol: "Golongan II", peserta: 1580, gp: 110.6 },
      { gol: "Golongan III", peserta: 1450, gp: 116.0 },
      { gol: "Golongan IV", peserta: 668, gp: 50.7 },
    ],
  },
  {
    kode: "PPPK_KEMHAN",
    nama: "PPPK Kemenhan",
    isPPPK: true,
    gol: [
      { gol: "Golongan IX", peserta: 420, gp: 21.0 },
      { gol: "Golongan X", peserta: 680, gp: 47.6 },
      { gol: "Golongan XI", peserta: 620, gp: 49.6 },
      { gol: "Golongan XII", peserta: 430, gp: 32.3 },
    ],
  },
];

const calculateSatkerDataForPeriod = (startDateStr, endDateStr) => {
  const dStart = new Date(startDateStr);
  const dEnd = new Date(endDateStr);

  const startYear = isNaN(dStart.getTime()) ? 2026 : dStart.getFullYear();
  const startMonth = isNaN(dStart.getTime()) ? 7 : dStart.getMonth() + 1;
  const endYear = isNaN(dEnd.getTime()) ? 2026 : dEnd.getFullYear();
  const endMonth = isNaN(dEnd.getTime()) ? 7 : dEnd.getMonth() + 1;

  const getYearFactor = (y) => {
    if (y === 2024) return 0.90;
    if (y === 2025) return 0.95;
    if (y === 2026) return 1.00;
    if (y === 2027) return 1.05;
    return 1 + (y - 2026) * 0.05;
  };

  const monthsCovered = [];
  let curY = startYear;
  let curM = startMonth;
  while (curY < endYear || (curY === endYear && curM <= endMonth)) {
    monthsCovered.push({ year: curY, month: curM });
    curM++;
    if (curM > 12) {
      curM = 1;
      curY++;
    }
  }
  if (monthsCovered.length === 0) {
    monthsCovered.push({ year: startYear, month: startMonth });
  }

  let totalMultiplier = 0;
  let lastMonthFactor = 1.0;
  monthsCovered.forEach(({ year, month }) => {
    const mFactor = MONTH_FACTORS[month] || 1.0;
    const yFactor = getYearFactor(year);
    const combinedFactor = mFactor * yFactor;
    totalMultiplier += combinedFactor;
    lastMonthFactor = combinedFactor;
  });

  return BASE_SATKER_DATA.map((satker) => {
    const golData = satker.gol.map((g) => {
      const peserta = Math.round(g.peserta * lastMonthFactor);
      const gp = Number((g.gp * totalMultiplier).toFixed(2));
      const tht = Number((gp * 0.0325).toFixed(2));
      const Pensiun = satker.isPPPK ? 0.0 : Number((gp * 0.0475).toFixed(2));
      const jkk = Number((gp * 0.0024).toFixed(2));
      const jkm = Number((gp * 0.0020).toFixed(2));

      return {
        gol: g.gol,
        peserta,
        gp,
        tht,
        Pensiun,
        jkk,
        jkm,
      };
    });

    const satkerPeserta = golData.reduce((acc, g) => acc + g.peserta, 0);
    const satkerGp = Number(golData.reduce((acc, g) => acc + g.gp, 0).toFixed(2));
    const satkerTht = Number(golData.reduce((acc, g) => acc + g.tht, 0).toFixed(2));
    const satkerPensiun = satker.isPPPK ? 0.0 : Number(golData.reduce((acc, g) => acc + g.Pensiun, 0).toFixed(2));
    const satkerJkk = Number(golData.reduce((acc, g) => acc + g.jkk, 0).toFixed(2));
    const satkerJkm = Number(golData.reduce((acc, g) => acc + g.jkm, 0).toFixed(2));

    return {
      kode: satker.kode,
      nama: satker.nama,
      isPPPK: satker.isPPPK,
      peserta: satkerPeserta,
      gp: satkerGp,
      tht: satkerTht,
      Pensiun: satkerPensiun,
      jkk: satkerJkk,
      jkm: satkerJkm,
      gol: golData,
    };
  });
};

const getPeriodeLabel = (startStr, endStr) => {
  const dStart = new Date(startStr);
  const dEnd = new Date(endStr);
  if (isNaN(dStart.getTime()) || isNaN(dEnd.getTime())) {
    return `${startStr} s.d. ${endStr}`;
  }
  const sMonth = dStart.getMonth();
  const sYear = dStart.getFullYear();
  const eMonth = dEnd.getMonth();
  const eYear = dEnd.getFullYear();

  if (sYear === eYear && sMonth === eMonth) {
    return `${NAMA_BULAN[sMonth]} ${sYear}`;
  } else if (sYear === eYear) {
    return `${NAMA_BULAN[sMonth]} – ${NAMA_BULAN[eMonth]} ${sYear}`;
  } else {
    return `${NAMA_BULAN[sMonth]} ${sYear} – ${NAMA_BULAN[eMonth]} ${eYear}`;
  }
};

export const KalkulatorIuran = () => {
  // View mode: "list" (daftar per bulan) or "detail" (rincian bulan terpilih)
  const [viewMode, setViewMode] = useState("list");
  const [selectedTahun, setSelectedTahun] = useState(2026);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchBulan, setSearchBulan] = useState("");

  const [selectedSatker, setSelectedSatker] = useState(null);
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const [preview, setPreview] = useState(null);

  // Generate 12-month summary for the selected fiscal year (Tahun Anggaran)
  const monthlySummaries = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthStr = String(monthNum).padStart(2, "0");
      const lastDay = new Date(selectedTahun, monthNum, 0).getDate();
      const start = `${selectedTahun}-${monthStr}-01`;
      const end = `${selectedTahun}-${monthStr}-${String(lastDay).padStart(2, "0")}`;
      const satkers = calculateSatkerDataForPeriod(start, end);

      const totalPeserta = satkers.reduce((a, s) => a + s.peserta, 0);
      const totalGP = satkers.reduce((a, s) => a + s.gp, 0);
      const totalTHT = satkers.reduce((a, s) => a + s.tht, 0);
      const totalPensiun = satkers.reduce((a, s) => a + s.Pensiun, 0);
      const totalJKK = satkers.reduce((a, s) => a + s.jkk, 0);
      const totalJKM = satkers.reduce((a, s) => a + s.jkm, 0);
      const totalIuran = totalTHT + totalPensiun + totalJKK + totalJKM;

      let status = "Draft Estimasi";
      let statusColor = "#64748B";
      let statusBg = "#F1F5F9";

      if (selectedTahun < 2026 || (selectedTahun === 2026 && monthNum <= 6)) {
        status = "Telah Disetor & Rekon";
        statusColor = "#059669";
        statusBg = "#ECFDF5";
      } else if (selectedTahun === 2026 && monthNum === 7) {
        status = "Siap Ditagihkan";
        statusColor = "#1D4ED8";
        statusBg = "#EFF6FF";
      } else if (selectedTahun === 2026 && monthNum === 8) {
        status = "Proses Berjalan";
        statusColor = "#D97706";
        statusBg = "#FFFBEB";
      }

      return {
        monthNum,
        monthStr,
        namaBulan: NAMA_BULAN[i],
        periodeLabel: `${NAMA_BULAN[i]} ${selectedTahun}`,
        start,
        end,
        totalPeserta,
        totalGP,
        totalTHT,
        totalPensiun,
        totalJKK,
        totalJKM,
        totalIuran,
        status,
        statusColor,
        statusBg
      };
    });
  }, [selectedTahun]);

  // Filtered monthly summaries for List View
  const filteredMonths = useMemo(() => {
    return monthlySummaries.filter((m) => {
      if (searchBulan.trim() && !m.namaBulan.toLowerCase().includes(searchBulan.toLowerCase().trim())) {
        return false;
      }
      return true;
    });
  }, [monthlySummaries, searchBulan]);

  // Dynamic Satker Data calculation based on selected Date Range / Month for Detail View
  const allSatkerData = useMemo(() => {
    return calculateSatkerDataForPeriod(tglAwal, tglAkhir);
  }, [tglAwal, tglAkhir]);

  const labelPeriode = useMemo(() => {
    return getPeriodeLabel(tglAwal, tglAkhir);
  }, [tglAwal, tglAkhir]);

  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;

  const satkerData = filterSatker === "Semua" ? allSatkerData : allSatkerData.filter(s => s.kode === filterSatker || s.nama === filterSatker);

  const showCol = (jenis) => filterJenis === "Semua" || filterJenis === jenis;

  const totalTHT = satkerData.reduce((a, s) => a + s.tht, 0);
  const totalPensiun = satkerData.reduce((a, s) => a + s.Pensiun, 0);
  const totalJKK = satkerData.reduce((a, s) => a + s.jkk, 0);
  const totalJKM = satkerData.reduce((a, s) => a + s.jkm, 0);
  const totalPeserta = satkerData.reduce((a, s) => a + s.peserta, 0);
  const totalGP = satkerData.reduce((a, s) => a + s.gp, 0);

  // Totals across all 12 months for list header
  const annualTotalGP = monthlySummaries.reduce((a, m) => a + m.totalGP, 0);
  const annualTotalIuran = monthlySummaries.reduce((a, m) => a + m.totalIuran, 0);
  const avgPeserta = Math.round(monthlySummaries.reduce((a, m) => a + m.totalPeserta, 0) / monthlySummaries.length);

  const handleOpenDetail = (m) => {
    setTglAwal(m.start);
    setTglAkhir(m.end);
    setViewMode("detail");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* =========================================================================
          VIEW 1: LIST VIEW (DAFTAR PER BULAN)
         ========================================================================= */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Header Banner */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: "18px 22px",
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.blue
                  }}
                >
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.gray900 }}>
                    Daftar Perhitungan Iuran Peserta Per Bulan (TA {selectedTahun})
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.gray500 }}>
                    Monitoring dan rekonsiliasi iuran 4 program (THT 3,25%, Pensiun 4,75%, JKK 0,24%, JKm 0,20%) seluruh Unor & Satker. Klik &quot;Lihat Detail&quot; untuk rincian tiap bulan.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Tahun Anggaran:</span>
              <select
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(Number(e.target.value))}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.blueDark,
                  background: COLORS.white,
                  cursor: "pointer"
                }}
              >
                <option value={2026}>TA 2026 (Tahun Berjalan)</option>
                <option value={2025}>TA 2025 (Tahun Lalu)</option>
              </select>
            </div>
          </div>

          {/* StatCards Operasional List Per Bulan */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <StatCard
              icon={<Building2 size={IC} />}
              label={`Rata-rata Peserta Aktif (TA ${selectedTahun})`}
              value={`${avgPeserta.toLocaleString()} Peserta`}
              sub="TNI AD, AL, AU, POLRI & Kemhan"
              color={COLORS.blue}
            />
            <StatCard
              icon={<Calendar size={IC} />}
              label="Total Periode Anggaran"
              value="12 Periode Bulan"
              sub={`Tahun Anggaran (TA) ${selectedTahun}`}
              color={COLORS.green}
            />
            <StatCard
              icon={<Shield size={IC} />}
              label="Cakupan Entitas Pembina"
              value="5 Entitas Resmi"
              sub="Kemhan, Mabes TNI, AD, AL, AU, POLRI"
              color={COLORS.blueDark}
            />
            <StatCard
              icon={<CheckCircle2 size={IC} />}
              label="Masa Rekonsiliasi Berjalan"
              value={`Bulan Juli ${selectedTahun}`}
              sub="Masa Rekon Berjalan Siap Proses"
              color={COLORS.orange}
            />
          </div>

          {/* Table Container Per Bulan */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: "18px 20px",
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}
          >
            {/* Filter Toolbar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {/* Search Bulan */}
                <div style={{ position: "relative", width: 260 }}>
                  <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 10 }} />
                  <input
                    type="text"
                    placeholder="Cari bulan (misal: Juli)..."
                    value={searchBulan}
                    onChange={(e) => setSearchBulan(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 10px 7px 30px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Export Buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreview({
                      title: `Daftar Iuran Peserta Tahunan — TA ${selectedTahun}`,
                      subtitle: `Format Excel (.xlsx) • Seluruh Bulan`,
                      type: "table",
                      fileName: `Daftar_Iuran_Tahunan_${selectedTahun}.xlsx`,
                      content: {
                        columns: ["No", "Bulan / Periode", "Rentang Tanggal", "Peserta Aktif", "Cakupan Entitas", "Program Iuran"],
                        rows: monthlySummaries.map((m, idx) => [
                          idx + 1,
                          m.periodeLabel,
                          `${m.start} s.d. ${m.end}`,
                          `${m.totalPeserta.toLocaleString()} Peserta`,
                          "5 Entitas (TNI AD, AL, AU, POLRI, Kemhan)",
                          "THT 3,25% • Pensiun 4,75% • JKK 0,24% • JKm 0,20%"
                        ]),
                        totalRows: monthlySummaries.length
                      }
                    })
                  }
                >
                  <Download size={13} style={{ marginRight: 4 }} />
                  Ekspor Excel
                </Btn>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreview({
                      title: `Daftar Iuran Peserta Tahunan — TA ${selectedTahun}`,
                      subtitle: `Format PDF Resmi Ditjen Anggaran Kemenkeu`,
                      type: "table",
                      fileName: `Daftar_Iuran_Tahunan_${selectedTahun}.pdf`,
                      content: {
                        columns: ["No", "Bulan / Periode", "Rentang Tanggal", "Peserta Aktif", "Cakupan Entitas", "Program Iuran"],
                        rows: monthlySummaries.map((m, idx) => [
                          idx + 1,
                          m.periodeLabel,
                          `${m.start} s.d. ${m.end}`,
                          `${m.totalPeserta.toLocaleString()} Peserta`,
                          "5 Entitas (TNI AD, AL, AU, POLRI, Kemhan)",
                          "THT 3,25% • Pensiun 4,75% • JKK 0,24% • JKm 0,20%"
                        ]),
                        totalRows: monthlySummaries.length
                      }
                    })
                  }
                >
                  <Download size={13} style={{ marginRight: 4 }} />
                  Ekspor PDF
                </Btn>
              </div>
            </div>

            {/* Table List of Months */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                    <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, width: 40 }}>No</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan / Periode</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Rentang Tanggal</th>
                    <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Aktif</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Cakupan Entitas</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Program Iuran</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center", width: 140 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonths.map((m, idx) => (
                    <tr
                      key={m.monthStr}
                      style={{
                        borderBottom: `1px solid ${COLORS.gray100}`,
                        background: m.monthNum === 7 ? "#F0FDF4" : "transparent",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => {
                        if (m.monthNum !== 7) e.currentTarget.style.background = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (m.monthNum !== 7) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "12px 12px", color: COLORS.gray500, fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 800, color: COLORS.gray900, fontSize: 13 }}>
                          {m.namaBulan} {selectedTahun}
                        </div>
                        {m.monthNum === 7 && (
                          <span style={{ fontSize: 10, color: "#166534", fontWeight: 700 }}>
                            ★ Masa Aktif Berjalan
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11.5 }}>
                        {m.start} s.d. {m.end}
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                        {m.totalPeserta.toLocaleString()} Peserta
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: COLORS.gray700 }}>
                        5 Entitas (TNI AD, AL, AU, POLRI, Kemhan)
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 11.5, color: COLORS.gray600 }}>
                        THT (3,25%), Pensiun (4,75%), JKK (0,24%), JKm (0,20%)
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <Btn
                          size="xs"
                          variant="primary"
                          onClick={() => handleOpenDetail(m)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          <Eye size={12} />
                          Lihat Detail
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: "12px 14px" }}>
                      TOTAL / RATA-RATA (12 BULAN TA {selectedTahun}):
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace" }}>
                      {avgPeserta.toLocaleString()} (rata-rata)
                    </td>
                    <td style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11.5 }}>
                      5 Entitas Pembina Resmi
                    </td>
                    <td style={{ padding: "12px 14px", color: "#065F46", fontSize: 11.5 }}>
                      4 Komponen Iuran Terpadu
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "#065F46", fontSize: 11 }}>
                      12 Periode Bulan
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DETAIL VIEW (RINCIAN BULAN TERPILIH)
         ========================================================================= */}
      {viewMode === "detail" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Header Navigation: Kembali ke Daftar Bulanan */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: "14px 20px",
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Btn
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 700,
                  color: COLORS.blueDark,
                  borderColor: COLORS.gray300
                }}
              >
                <ArrowLeft size={14} />
                Kembali ke Daftar Bulanan
              </Btn>

              <div style={{ height: 26, width: 1, background: COLORS.gray300 }} />

              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                  Detail Perhitungan Iuran — Masa {labelPeriode}
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
                  Rincian kewajiban iuran 4 program per Instansi, Unor, dan Golongan.
                </div>
              </div>
            </div>

            {/* Quick Month Switcher within Detail */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray600 }}>Pilih Bulan Lain:</span>
              <select
                value={tglAwal.slice(0, 7)}
                onChange={(e) => {
                  const m = monthlySummaries.find(x => `${selectedTahun}-${x.monthStr}` === e.target.value);
                  if (m) {
                    setTglAwal(m.start);
                    setTglAkhir(m.end);
                  }
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.blueDark,
                  background: COLORS.white,
                  cursor: "pointer"
                }}
              >
                {monthlySummaries.map((m) => (
                  <option key={m.monthStr} value={`${selectedTahun}-${m.monthStr}`}>
                    {m.periodeLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary StatCards — Realtime Dynamic Based on Selected Period */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {showCol("THT") && (
              <StatCard
                icon={<BarChart3 size={IC} />}
                label={`Total Iuran THT (${labelPeriode})`}
                value={`Rp ${totalTHT.toFixed(2)} M`}
                sub="3,25% × (GP+T.Istri+T.Anak)"
                color={COLORS.blue}
              />
            )}
            {showCol("Pensiun") && (
              <StatCard
                icon={<BarChart3 size={IC} />}
                label={`Total Iuran Pensiun (${labelPeriode})`}
                value={`Rp ${totalPensiun.toFixed(2)} M`}
                sub="4,75% × (GP+T.Istri+T.Anak) • Non-PPPK"
                color={COLORS.green}
              />
            )}
            {showCol("JKK") && (
              <StatCard
                icon={<Shield size={IC} />}
                label={`Total Iuran JKK (${labelPeriode})`}
                value={`Rp ${totalJKK.toFixed(2)} M`}
                sub="0,24% × (GP+T.Istri+T.Anak)"
                color={COLORS.orange}
              />
            )}
            {showCol("JKm") && (
              <StatCard
                icon={<Lock size={IC} />}
                label={`Total Iuran JKm (${labelPeriode})`}
                value={`Rp ${totalJKM.toFixed(2)} M`}
                sub="0,20% × (GP+T.Istri+T.Anak)"
                color="#7C3AED"
              />
            )}
          </div>

          {/* Filter Toolbar Full Width */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: "16px 20px",
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              display: "grid",
              gridTemplateColumns: "minmax(280px, 1.4fr) minmax(220px, 1.3fr) minmax(180px, 1fr)",
              gap: 16,
              width: "100%",
              boxSizing: "border-box",
              alignItems: "flex-end"
            }}
          >
            {/* Filter Periode Tanggal */}
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.gray500, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <Calendar size={13} color={COLORS.gray500} /> Rentang Tanggal Kalender
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="date"
                  value={tglAwal}
                  onChange={e => setTglAwal(e.target.value)}
                  style={{
                    flex: 1,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12.5,
                    color: COLORS.gray800,
                    background: COLORS.white,
                    boxSizing: "border-box"
                  }}
                />
                <span style={{ fontSize: 11, color: COLORS.gray400, fontWeight: 600 }}>s.d.</span>
                <input
                  type="date"
                  value={tglAkhir}
                  onChange={e => setTglAkhir(e.target.value)}
                  style={{
                    flex: 1,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12.5,
                    color: COLORS.gray800,
                    background: COLORS.white,
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Filter Satker / Unor */}
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.gray500, display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <Filter size={13} color={COLORS.gray500} /> Unor / Satker
              </label>
              <select
                value={filterSatker}
                onChange={e => {
                  setFilterSatker(e.target.value);
                  setSelectedSatker(null);
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: COLORS.gray800,
                  background: COLORS.white,
                  cursor: "pointer",
                  boxSizing: "border-box"
                }}
              >
                {["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI", "PNS POLRI", "PPPK POLRI", "PNS Kemenhan", "PPPK Kemenhan"].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Filter Jenis Iuran */}
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.gray500, display: "block", marginBottom: 6 }}>
                Jenis Iuran (Tabel)
              </label>
              <select
                value={filterJenis}
                onChange={e => setFilterJenis(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: COLORS.gray800,
                  background: COLORS.white,
                  cursor: "pointer",
                  boxSizing: "border-box"
                }}
              >
                {["Semua", "THT", "Pensiun", "JKK", "JKm"].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container Detailed Breakdown */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle
              action={
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, color: COLORS.gray500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={13} color="#059669" />
                    Kalkulasi Otomatis Aktif
                  </span>
                  <Btn
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreview({
                        title: `Preview Ekspor Rekap Iuran — Masa ${labelPeriode}`,
                        subtitle: `Format Excel (.xlsx) • Periode ${filterPeriode}`,
                        type: "table",
                        fileName: `Rekap_Iuran_Unor_${labelPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                        content: {
                          columns: ["Unor", "Peserta", "Total GP (M)", "THT", "Pensiun", "JKK", "JKm"],
                          rows: satkerData.map(s => [
                            s.nama + (s.isPPPK ? " (PPPK Non-Pensiun)" : ""),
                            s.peserta.toLocaleString(),
                            "Rp " + s.gp.toFixed(2) + " M",
                            "Rp " + s.tht.toFixed(2) + " M",
                            s.isPPPK ? "Rp 0,00 M (Non-Pensiun)" : "Rp " + s.Pensiun.toFixed(2) + " M",
                            "Rp " + s.jkk.toFixed(2) + " M",
                            "Rp " + s.jkm.toFixed(2) + " M"
                          ]),
                          totalRows: satkerData.length
                        }
                      })
                    }
                  >
                    Ekspor Excel
                  </Btn>
                  <Btn
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreview({
                        title: `Preview Ekspor Rekap Iuran — Masa ${labelPeriode}`,
                        subtitle: `Format PDF • Periode ${filterPeriode}`,
                        type: "table",
                        fileName: `Rekap_Iuran_Unor_${labelPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
                        content: {
                          columns: ["Unor", "Peserta", "Total GP (M)", "THT", "Pensiun", "JKK", "JKm"],
                          rows: satkerData.map(s => [
                            s.nama + (s.isPPPK ? " (PPPK Non-Pensiun)" : ""),
                            s.peserta.toLocaleString(),
                            "Rp " + s.gp.toFixed(2) + " M",
                            "Rp " + s.tht.toFixed(2) + " M",
                            s.isPPPK ? "Rp 0,00 M (Non-Pensiun)" : "Rp " + s.Pensiun.toFixed(2) + " M",
                            "Rp " + s.jkk.toFixed(2) + " M",
                            "Rp " + s.jkm.toFixed(2) + " M"
                          ]),
                          totalRows: satkerData.length
                        }
                      })
                    }
                  >
                    Ekspor PDF
                  </Btn>
                </div>
              }
            >
              Rekap Iuran per Instansi, Unor &amp; Golongan — Masa {labelPeriode} {filterSatker !== "Semua" && `(${filterSatker})`} {filterJenis !== "Semua" && `• ${filterJenis}`}
            </SectionTitle>

            {satkerData.length === 0 ? <NoData /> : (() => {
              const groups = [
                {
                  id: "TNI",
                  name: "TENTARA NASIONAL INDONESIA (TNI)",
                  bgColor: "#1B5E20",
                  badgeBg: "#ECFDF5",
                  badgeColor: "#059669",
                  items: satkerData.filter(s => s.kode.startsWith("TNI"))
                },
                {
                  id: "POLRI",
                  name: "KEPOLISIAN NEGARA REPUBLIK INDONESIA (POLRI)",
                  bgColor: "#0D47A1",
                  badgeBg: "#EFF6FF",
                  badgeColor: "#0141A8",
                  items: satkerData.filter(s => s.kode.includes("POLRI"))
                },
                {
                  id: "KEMHAN",
                  name: "KEMENTERIAN PERTAHANAN (KEMENHAN)",
                  bgColor: "#4A148C",
                  badgeBg: "#F3E5F5",
                  badgeColor: "#6A1B9A",
                  items: satkerData.filter(s => s.kode.includes("KEMHAN"))
                }
              ].filter(g => g.items.length > 0);

              return groups.map((grp, gi) => {
                const grpPeserta = grp.items.reduce((a, s) => a + s.peserta, 0);
                const grpTotalIuran = grp.items.reduce((a, s) => a + (showCol("THT") ? s.tht : 0) + (showCol("Pensiun") ? s.Pensiun : 0) + (showCol("JKK") ? s.jkk : 0) + (showCol("JKm") ? s.jkm : 0), 0);

                return (
                  <div key={gi} style={{ marginBottom: 24, borderRadius: 10, border: `1px solid ${COLORS.gray300}`, overflow: "hidden", background: COLORS.white }}>
                    {/* Group Header */}
                    <div style={{ padding: "14px 18px", background: grp.bgColor, color: COLORS.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Shield size={22} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>{grp.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{grp.items.length} Unor • {grpPeserta.toLocaleString()} Peserta Aktif ({labelPeriode})</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.85 }}>Subtotal Iuran ({labelPeriode})</div>
                        <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>Rp {grpTotalIuran.toFixed(2)} M</div>
                      </div>
                    </div>

                    {/* Unor Accordion Cards */}
                    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12, background: "#FAFBFD" }}>
                      {grp.items.map((s, si) => (
                        <div key={si} style={{ border: `1px solid ${COLORS.gray300}`, borderRadius: 8, overflow: "hidden", background: COLORS.white }}>
                          <div onClick={() => setSelectedSatker(selectedSatker === s.kode ? null : s.kode)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: selectedSatker === s.kode ? "#ECEFF1" : COLORS.gray50, color: COLORS.gray900, borderBottom: selectedSatker === s.kode ? `2px solid ${grp.bgColor}` : "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ padding: "3px 8px", borderRadius: 4, background: grp.badgeBg, color: grp.badgeColor, fontWeight: 700, fontSize: 12 }}>{s.nama}</span>
                              {s.isPPPK && (
                                <span style={{ padding: "2px 8px", borderRadius: 10, background: "#FEF3C7", color: "#B45309", fontWeight: 700, fontSize: 11, border: "1px solid #FDE68A" }}>
                                  PPPK (Non-Pensiun)
                                </span>
                              )}
                              <span style={{ fontSize: 12.5, color: COLORS.gray600 }}>({s.peserta.toLocaleString()} peserta)</span>
                            </div>
                            <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12.5 }}>
                              {showCol("THT") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>THT: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.tht.toFixed(2)} M</strong></div>}
                              {showCol("Pensiun") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>Pensiun: </span><strong style={{ fontFamily: "monospace", color: s.isPPPK ? COLORS.gray500 : "inherit" }}>{s.isPPPK ? "Rp 0,00 M (Non-Pensiun)" : `Rp ${s.Pensiun.toFixed(2)} M`}</strong></div>}
                              {showCol("JKK") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>JKK: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.jkk.toFixed(2)} M</strong></div>}
                              {showCol("JKm") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>JKm: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.jkm.toFixed(2)} M</strong></div>}
                              <span style={{ fontSize: 14, color: COLORS.gray600 }}>{selectedSatker === s.kode ? "▼" : "▶"}</span>
                            </div>
                          </div>
                          {selectedSatker === s.kode && (
                            <div style={{ padding: 0 }}>
                              <Table
                                columns={["Golongan / Pangkat", "Jml Peserta", "Total GP+Tunj", ...(showCol("THT") ? ["Iuran THT (3,25%)"] : []), ...(showCol("Pensiun") ? ["Iuran Pensiun (4,75%)"] : []), ...(showCol("JKK") ? ["Iuran JKK (0,24%)"] : []), ...(showCol("JKm") ? ["Iuran JKm (0,20%)"] : []), "Total"]}
                                data={s.gol.map(g => [
                                  <span key={g.gol} style={{ fontWeight: 600 }}>{g.gol}</span>, g.peserta.toLocaleString(), `Rp ${g.gp.toFixed(2)} M`,
                                  ...(showCol("THT") ? [`Rp ${g.tht.toFixed(2)} M`] : []),
                                  ...(showCol("Pensiun") ? [s.isPPPK ? <span key="pppk" style={{ color: COLORS.gray500, fontStyle: "italic", fontSize: 11.5 }}>Rp 0,00 M (Non-Pensiun)</span> : `Rp ${g.Pensiun.toFixed(2)} M`] : []),
                                  ...(showCol("JKK") ? [`Rp ${g.jkk.toFixed(2)} M`] : []),
                                  ...(showCol("JKm") ? [`Rp ${g.jkm.toFixed(2)} M`] : []),
                                  <span key="tot" style={{ fontWeight: 700 }}>Rp {((showCol("THT") ? g.tht : 0) + (showCol("Pensiun") ? (s.isPPPK ? 0 : g.Pensiun) : 0) + (showCol("JKK") ? g.jkk : 0) + (showCol("JKm") ? g.jkm : 0)).toFixed(2)} M</span>,
                                ])}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}

            {/* Grand Total Summary Bar */}
            <div style={{ marginTop: 16, padding: "14px 18px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #BFDBFE", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.blueDark }}>
                  Grand Total {filterSatker !== "Semua" ? filterSatker : "Seluruh Instansi & Unor"} — Masa {labelPeriode} {filterJenis !== "Semua" ? `(${filterJenis})` : ""}
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 2 }}>
                  Total {totalPeserta.toLocaleString()} Peserta Aktif • Total GP+Tunjangan: Rp {totalGP.toFixed(2)} M
                </div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 21, color: COLORS.blueDark, fontFamily: "monospace" }}>
                Rp {((showCol("THT") ? totalTHT : 0) + (showCol("Pensiun") ? totalPensiun : 0) + (showCol("JKK") ? totalJKK : 0) + (showCol("JKm") ? totalJKM : 0)).toFixed(2)} M
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

