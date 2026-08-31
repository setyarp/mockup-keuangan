import { useState } from "react";
import {
  Calculator,
  Receipt,
  Calendar,
  FileSpreadsheet,
  Scale,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Mail,
  Eye,
  Link2,
  FileUp,
  RefreshCw,
  PenLine,
  Building2,
  Users
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, Badge, NoData, PreviewModal } from "../components/common";

export const Perpajakan = () => {
  const [tab, setTab] = useState("ter_jan_nov");
  const [filterBulanTER, setFilterBulanTER] = useState("Juli");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterMAK, setFilterMAK] = useState("Semua");
  const [filterTunjukSilang, setFilterTunjukSilang] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadStep, setUploadStep] = useState(0); // 0=belum upload, 1=terunggah & cocok, 2=terdistribusi
  const [preview, setPreview] = useState(null);

  const fmt = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

  // Master Data Peserta Pensiun untuk Simulasi Perpajakan (Lengkap dengan Kode Jiwa, TER, P17, dan Tunjuk Silang)
  const masterPesertaPajak = [
    {
      id: 1,
      nik: "3171012304650001",
      nrp: "1965042301",
      nama: "Mayjen TNI (Purn) Soedirman H.",
      satker: "TNI AD",
      unor: "Mabesad",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/2",
      ptkp: 67500000,
      kategoriTER: "TER B",
      tarifTER: 0.015, // 1.5%
      gpPensiun: 14500000,
      tunjanganKeluarga: 1450000,
      tunjanganBeras: 850000,
      tunjanganLain: 2200000,
      brutoBulanan: 19000000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "01.234.567.8-011.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
    {
      id: 2,
      nik: "3273024508680003",
      nrp: "1968081202",
      nama: "Kolonel Laut (Purn) Bambang S.",
      satker: "TNI AL",
      unor: "Koarmada I",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/1",
      ptkp: 63000000,
      kategoriTER: "TER A",
      tarifTER: 0.01, // 1.0%
      gpPensiun: 9200000,
      tunjanganKeluarga: 920000,
      tunjanganBeras: 580000,
      tunjanganLain: 1300000,
      brutoBulanan: 12000000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "02.345.678.9-021.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
    {
      id: 3,
      nik: "3175085409700002",
      nrp: "1970091503",
      nama: "Kombes Pol (Purn) Dra. Hj. Ratna S.",
      satker: "POLRI",
      unor: "Polda Metro",
      mak: "513123",
      dapem: "Dapem Induk + Janda",
      kodeJiwa: "K/3",
      ptkp: 72000000,
      kategoriTER: "TER C",
      tarifTER: 0.02, // 2.0%
      gpPensiun: 11500000,
      tunjanganKeluarga: 1150000,
      tunjanganBeras: 850000,
      tunjanganLain: 1800000,
      brutoBulanan: 15300000,
      terStatus: "Tunjuk Silang",
      tunjukSilang: true,
      sumberPensiunGanda: "Pens. Sendiri (POLRI) + Pens. Janda TNI AD (NRP: 1962081105)",
      npwp: "03.456.789.0-031.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
    {
      id: 4,
      nik: "3172031102720005",
      nrp: "1972021104",
      nama: "Pembina Tk.I (Purn) Ir. Hendro W.",
      satker: "ASN Kemenhan",
      unor: "Ditjen Strahan",
      mak: "513113",
      dapem: "Dapem Induk",
      kodeJiwa: "TK/0",
      ptkp: 54000000,
      kategoriTER: "TER A",
      tarifTER: 0.0075, // 0.75%
      gpPensiun: 6800000,
      tunjanganKeluarga: 0,
      tunjanganBeras: 290000,
      tunjanganLain: 910000,
      brutoBulanan: 8000000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "04.567.890.1-041.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
    {
      id: 5,
      nik: "3374092205690004",
      nrp: "1969052205",
      nama: "AKBP (Purn) Drs. Agus Hartono",
      satker: "POLRI",
      unor: "Polda Jateng",
      mak: "513123",
      dapem: "Dapem Induk",
      kodeJiwa: "K/2",
      ptkp: 67500000,
      kategoriTER: "TER B",
      tarifTER: 0.0125, // 1.25%
      gpPensiun: 8400000,
      tunjanganKeluarga: 840000,
      tunjanganBeras: 580000,
      tunjanganLain: 1180000,
      brutoBulanan: 11000000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "05.678.901.2-051.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
    {
      id: 6,
      nik: "3271046708660002",
      nrp: "1966081406",
      nama: "Letkol Inf (Purn) Dedi Supriadi",
      satker: "TNI AD",
      unor: "Kodam III/Slw",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/0",
      ptkp: 58500000,
      kategoriTER: "TER A",
      tarifTER: 0.01, // 1.0%
      gpPensiun: 7200000,
      tunjanganKeluarga: 720000,
      tunjanganBeras: 290000,
      tunjanganLain: 790000,
      brutoBulanan: 9000000,
      terStatus: "Berhenti (Wafat Mei)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "06.789.012.3-061.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: true,
      bulanBerhenti: "Mei 2026",
      bulanDiterima: 5,
    },
    {
      id: 7,
      nik: "3174051203740001",
      nrp: "1974031207",
      nama: "Penata (Purn) Sri Rahayu, S.Sos",
      satker: "ASN Polri",
      unor: "Puskeu Polri",
      mak: "513114",
      dapem: "Dapem Induk",
      kodeJiwa: "TK/1",
      ptkp: 58500000,
      kategoriTER: "TER A",
      tarifTER: 0.005, // 0.5%
      gpPensiun: 5500000,
      tunjanganKeluarga: 550000,
      tunjanganBeras: 290000,
      tunjanganLain: 660000,
      brutoBulanan: 7000000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "— (Non-NPWP)",
      statusNPWP: "Tidak Ada (+20%)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
    {
      id: 8,
      nik: "3578013009710006",
      nrp: "1971093008",
      nama: "Mayor Mar (Purn) Wahyudi Eko",
      satker: "TNI AL",
      unor: "Pasmar 2",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/2",
      ptkp: 67500000,
      kategoriTER: "TER B",
      tarifTER: 0.0125,
      gpPensiun: 7800000,
      tunjanganKeluarga: 780000,
      tunjanganBeras: 580000,
      tunjanganLain: 1040000,
      brutoBulanan: 10200000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "07.890.123.4-071.000",
      statusNPWP: "Valid",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhenti: null,
    },
  ];

  // Helper kalkulasi PPh Pasal 17 Tahunan (Progresif UU HPP)
  const calcPPhPasal17 = (pkp) => {
    if (pkp <= 0) return 0;
    let sisa = pkp;
    let tax = 0;
    // Lapisan 1: 0 - 60jt (5%)
    const lap1 = Math.min(sisa, 60000000);
    tax += lap1 * 0.05;
    sisa -= lap1;
    if (sisa <= 0) return tax;
    // Lapisan 2: 60jt - 250jt (15%)
    const lap2 = Math.min(sisa, 190000000);
    tax += lap2 * 0.15;
    sisa -= lap2;
    if (sisa <= 0) return tax;
    // Lapisan 3: 250jt - 500jt (25%)
    const lap3 = Math.min(sisa, 250000000);
    tax += lap3 * 0.25;
    sisa -= lap3;
    if (sisa <= 0) return tax;
    // Lapisan 4: > 500jt (30%)
    tax += sisa * 0.30;
    return tax;
  };

  // Perhitungan Data Lengkap per Peserta
  const dataLengkap = masterPesertaPajak.map((p) => {
    const bulanDiterima = p.isBerhenti ? (p.bulanDiterima || 5) : 12;
    const brutoSetahun = p.brutoBulanan * bulanDiterima;
    const biayaPensiunSetahun = Math.min(brutoSetahun * 0.05, 2400000); // 5% maks 2,4 jt
    const pkp = Math.max(0, brutoSetahun - biayaPensiunSetahun - p.ptkp);
    const pphTerutangSetahunP17 = calcPPhPasal17(pkp) * (p.statusNPWP.includes("Tidak") ? 1.2 : 1.0);

    // Pemotongan PPh 21 TER (Jan s.d. Nov)
    const pphTERBulanan = p.brutoBulanan * p.tarifTER * (p.statusNPWP.includes("Tidak") ? 1.2 : 1.0);
    const bulanTER = p.isBerhenti ? Math.max(0, bulanDiterima - 1) : 11;
    const pphDipotongJanNov = p.isBerhenti
      ? (pphTERBulanan * Math.max(0, bulanDiterima - 1))
      : (pphTERBulanan * 11);

    // Pemotongan PPh Bulan Desember (atau Bulan Terakhir jika berhenti)
    const pphDesember = p.isBerhenti
      ? Math.max(0, pphTerutangSetahunP17 - pphDipotongJanNov)
      : Math.max(0, pphTerutangSetahunP17 - pphDipotongJanNov);

    // PPh Bulanan Metode Lama (Pasal 17 Rata-Rata)
    const pphP17Bulanan = pphTerutangSetahunP17 / bulanDiterima;

    return {
      ...p,
      bulanDiterima,
      brutoSetahun,
      biayaPensiunSetahun,
      pkp,
      pphTerutangSetahunP17,
      pphTERBulanan,
      pphDipotongJanNov,
      pphDesember,
      pphP17Bulanan,
      selisihBulanan: pphTERBulanan - pphP17Bulanan,
      selisihPersen: pphP17Bulanan > 0 ? (((pphTERBulanan - pphP17Bulanan) / pphP17Bulanan) * 100).toFixed(1) : "0",
    };
  });

  // Filter Data
  const filteredData = dataLengkap.filter((d) => {
    const matchSatker = filterSatker === "Semua" || d.satker === filterSatker;
    const matchMAK = filterMAK === "Semua" || d.mak === filterMAK;
    const matchTS = filterTunjukSilang === "Semua" || (filterTunjukSilang === "Ya" ? d.tunjukSilang : !d.tunjukSilang);
    const matchSearch = searchQuery === "" ||
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nik.includes(searchQuery) ||
      d.nrp.includes(searchQuery);
    return matchSatker && matchMAK && matchTS && matchSearch;
  });

  // Summary Metrics
  const totalWP = dataLengkap.length;
  const totalBrutoTahunan = dataLengkap.reduce((a, b) => a + b.brutoSetahun, 0);
  const totalPPhTerutangSetahun = dataLengkap.reduce((a, b) => a + b.pphTerutangSetahunP17, 0);
  const totalPPhTERJanNov = dataLengkap.reduce((a, b) => a + b.pphDipotongJanNov, 0);
  const totalPPhDesember = dataLengkap.reduce((a, b) => a + b.pphDesember, 0);
  const totalTunjukSilang = dataLengkap.filter((d) => d.tunjukSilang).length;

  const tabsConfig = [
    {
      id: "ter_jan_nov",
      label: "Rekap PPh 21 TER (Jan–Nov)",
      icon: <Calculator size={15} />,
    },
    {
      id: "pasal17_des",
      label: "PPh Pasal 17 Desember",
      icon: <Calendar size={15} />,
    },
    {
      id: "spt_tahunan",
      label: "SPT Tahunan PPh 21",
      icon: <FileSpreadsheet size={15} />,
    },
    {
      id: "komparasi_audit",
      label: "Audit TER vs Pasal 17",
      icon: <Scale size={15} />,
    },
    {
      id: "bukpot_coretax",
      label: "Bukti Potong 1721-A2",
      icon: <Receipt size={15} />,
    },
  ];

  const handleExportTab = () => {
    if (tab === "ter_jan_nov") {
      setPreview({
        title: `Laporan Rekap PPh 21 TER — Masa ${filterBulanTER} 2026`,
        subtitle: "Rekapitulasi Perhitungan PPh 21 Menggunakan Tarif Efektif Rata-Rata (TER)",
        type: "table",
        fileName: `Rekap_PPh21_TER_${filterBulanTER}_2026.xlsx`,
        content: {
          columns: ["No", "NIK", "NRP", "Nama Peserta", "MAK", "Kode Jiwa", "Bruto Bulanan", "Tarif TER", "PPh 21 TER", "Status NIK/NPWP"],
          rows: filteredData.map((d, i) => [
            i + 1, d.nik, d.nrp, d.nama, d.mak, d.kodeJiwa, fmt(d.brutoBulanan), `${(d.tarifTER * 100).toFixed(2)}%`, fmt(d.pphTERBulanan), d.statusNPWP
          ]),
          totalRows: filteredData.length,
        },
      });
    } else if (tab === "pasal17_des") {
      setPreview({
        title: "Laporan Rekap PPh Pasal 17 Dapem Bulan Desember 2026",
        subtitle: "Perhitungan Penyesuaian Akhir Tahun Masa Pajak Desember",
        type: "table",
        fileName: "Rekap_PPh_Pasal17_Desember_2026.xlsx",
        content: {
          columns: ["No", "Nama Peserta", "NIK", "Bruto Setahun", "Biaya Pensiun", "PTKP", "PKP", "PPh Terutang Setahun", "PPh Jan-Nov (TER)", "PPh Des", "Status"],
          rows: filteredData.map((d, i) => [
            i + 1, d.nama, d.nik, fmt(d.brutoSetahun), fmt(d.biayaPensiunSetahun), fmt(d.ptkp), fmt(d.pkp), fmt(d.pphTerutangSetahunP17), fmt(d.pphDipotongJanNov), fmt(d.pphDesember), "Lunas"
          ]),
          totalRows: filteredData.length,
        },
      });
    } else if (tab === "spt_tahunan") {
      setPreview({
        title: "Laporan Rekap PPh Pasal 17 Tahunan (SPT Tahunan PPh 21)",
        subtitle: "Dasar Pengisian SPT Tahunan PT ASABRI ke DJP / e-Filing",
        type: "table",
        fileName: "Rekap_SPT_Tahunan_PPh21_2026.xlsx",
        content: {
          columns: ["No", "MAK", "NIK", "NRP", "Nama Peserta", "Kode Jiwa", "Bruto Setahun", "Biaya Pensiun", "PKP", "PPh Terutang (P17)", "Status NPWP"],
          rows: filteredData.map((d, i) => [
            i + 1, d.mak, d.nik, d.nrp, d.nama, d.kodeJiwa, fmt(d.brutoSetahun), fmt(d.biayaPensiunSetahun), fmt(d.pkp), fmt(d.pphTerutangSetahunP17), d.statusNPWP
          ]),
          totalRows: filteredData.length,
        },
      });
    } else if (tab === "komparasi_audit") {
      setPreview({
        title: "Laporan Audit Komparatif: PPh 21 Metode TER vs PPh Pasal 17",
        subtitle: "Alat Uji Petik Verifikasi dan Audit Kepatuhan Perpajakan",
        type: "table",
        fileName: "Audit_Komparasi_TER_vs_Pasal17_2026.xlsx",
        content: {
          columns: ["No", "Nama Peserta", "Masa Pajak", "Bruto Bulanan", "PPh 21 TER", "PPh Pasal 17", "Selisih (Rp)", "% Selisih", "Keterangan"],
          rows: filteredData.map((d, i) => [
            i + 1, d.nama, filterBulanTER, fmt(d.brutoBulanan), fmt(d.pphTERBulanan), fmt(d.pphP17Bulanan), (d.selisihBulanan > 0 ? "+" : "") + fmt(d.selisihBulanan), `${d.selisihPersen}%`, d.selisihBulanan === 0 ? "Setara" : d.selisihBulanan > 0 ? "TER Lebih Tinggi" : "TER Lebih Rendah"
          ]),
          totalRows: filteredData.length,
        },
      });
    } else {
      setPreview({
        title: "Log Distribusi Bukti Potong 1721-A2 & Coretax",
        subtitle: "Monitoring Distribusi Digital Bukti Potong ke Peserta Pensiun",
        type: "table",
        fileName: "Log_Distribusi_Bukti_Potong_A2.xlsx",
        content: {
          columns: ["Nama Peserta", "NIK", "NRP", "NPWP", "Status Coretax", "Kanal Distribusi", "Status Unduh"],
          rows: filteredData.map((d) => [
            d.nama, d.nik, d.nrp, d.npwp, d.statusNIK, "Portal Peserta + AMA", uploadStep >= 2 ? "Terdistribusi" : "Siap Kirim"
          ]),
          totalRows: filteredData.length,
        },
      });
    }
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* ENTERPRISE TAB BAR WITH INTEGRATED CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid #CBD5E1`,
          marginBottom: 18,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: -2, flexWrap: "wrap" }}>
          {tabsConfig.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  border: "none",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#0F172A" : "#475569",
                  borderBottom: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                  borderTop: isActive ? `1px solid #CBD5E1` : "1px solid transparent",
                  borderLeft: isActive ? `1px solid #CBD5E1` : "1px solid transparent",
                  borderRight: isActive ? `1px solid #CBD5E1` : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#F1F5F9";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ color: isActive ? COLORS.blue : "#64748B", display: "flex" }}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ paddingBottom: 6 }}>
          <Btn variant="primary" size="sm" onClick={handleExportTab}>
            <Download size={14} />
            <span>Ekspor Laporan</span>
          </Btn>
        </div>
      </div>

      {/* FILTER CONTROLS TOOLBAR */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          padding: "12px 16px",
          border: "1px solid #E2E8F0",
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {tab === "ter_jan_nov" && (
          <Select
            label="Masa Pajak"
            value={filterBulanTER}
            onChange={setFilterBulanTER}
            options={["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November"]}
            minW={120}
          />
        )}
        <Select
          label="Satker / Unor"
          value={filterSatker}
          onChange={setFilterSatker}
          options={["Semua", "TNI AD", "TNI AL", "POLRI", "ASN Kemenhan", "ASN Polri"]}
          minW={130}
        />
        <Select
          label="Kode MAK"
          value={filterMAK}
          onChange={setFilterMAK}
          options={["Semua", "513113", "513114", "513122", "513123"]}
          minW={110}
        />
        <Select
          label="Tunjuk Silang"
          value={filterTunjukSilang}
          onChange={setFilterTunjukSilang}
          options={["Semua", "Ya", "Tidak"]}
          minW={120}
        />

        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11.5, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>
            Pencarian Peserta (Nama / NIK / NRP)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Cari nama, NIK, atau NRP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "6.5px 10px 6.5px 30px",
                borderRadius: 6,
                border: "1px solid #CBD5E1",
                fontSize: 12,
                outline: "none",
              }}
            />
            <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REKAP PPH 21 TER MASA JANUARI - NOVEMBER (BRD 4.5.21) */}
      {/* ========================================================================= */}
      {tab === "ter_jan_nov" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle>
            Rekap Perhitungan PPh 21 TER — Masa {filterBulanTER} 2026
          </SectionTitle>

          {filteredData.length === 0 ? (
            <NoData />
          ) : (
            <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "9px 10px", textAlign: "center", width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                    <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kode Jiwa / PTKP</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kategori TER</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Penghasilan Bruto</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Tarif TER</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 TER Dipotong</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Tunjuk Silang</th>
                    <th style={{ padding: "9px 10px", textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, i) => (
                    <tr
                      key={d.id}
                      style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                    >
                      <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                      <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                        <div style={{ fontSize: 10.5, color: "#64748B" }}>NIK: {d.nik} • NRP: {d.nrp} • {d.satker}</div>
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                        {d.mak}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <span style={{ fontWeight: 700, color: "#0F172A" }}>{d.kodeJiwa}</span>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{fmt(d.ptkp)}</div>
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <Badge color={d.kategoriTER === "TER A" ? "blue" : d.kategoriTER === "TER B" ? "green" : "purple"}>
                          {d.kategoriTER}
                        </Badge>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.brutoBulanan)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                        {(d.tarifTER * 100).toFixed(2)}%
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.pphTERBulanan)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        {d.tunjukSilang ? (
                          <span
                            title={d.sumberPensiunGanda}
                            style={{
                              background: "#FEF3C7",
                              color: "#B45309",
                              border: "1px solid #FDE68A",
                              padding: "2px 7px",
                              borderRadius: 4,
                              fontSize: 10.5,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Link2 size={11} /> NIK Ganda
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <Badge color={d.isBerhenti ? "yellow" : "green"}>
                          {d.isBerhenti ? `P17 (${d.bulanBerhenti})` : "TER Aktif"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                    <td colSpan={5} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                      TOTAL MASA {filterBulanTER.toUpperCase()} ({filteredData.length} PESERTA)
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                      {fmt(filteredData.reduce((a, b) => a + b.brutoBulanan, 0))}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #CBD5E1" }}>—</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", fontWeight: 900, borderRight: "1px solid #CBD5E1" }}>
                      {fmt(filteredData.reduce((a, b) => a + b.pphTERBulanan, 0))}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REKAP PPH PASAL 17 BULAN DESEMBER (BRD 4.5.22) */}
      {/* ========================================================================= */}
      {tab === "pasal17_des" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle>
            Rekap PPh Pasal 17 untuk Dapem Bulan Desember 2026 (Penyesuaian Akhir Tahun)
          </SectionTitle>

          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 10px", textAlign: "center", width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Setahun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Biaya Pensiun (5%)</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PTKP</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PKP Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Terutang (P17)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong Jan–Nov (TER)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong Desember</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status Pelunasan</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                      <div style={{ fontSize: 10.5, color: "#64748B" }}>NIK: {d.nik} • {d.kodeJiwa}</div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.brutoSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.biayaPensiunSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.ptkp)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pkp)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphTerutangSetahunP17)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphDipotongJanNov)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphDesember)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <Badge color="green">Nihil / Lunas</Badge>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                  <td colSpan={2} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                    TOTAL AKUMULASI DESEMBER ({filteredData.length} WP)
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredData.reduce((a, b) => a + b.brutoSetahun, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredData.reduce((a, b) => a + b.biayaPensiunSetahun, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>—</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredData.reduce((a, b) => a + b.pkp, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredData.reduce((a, b) => a + b.pphTerutangSetahunP17, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredData.reduce((a, b) => a + b.pphDipotongJanNov, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", fontWeight: 900, borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredData.reduce((a, b) => a + b.pphDesember, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "center" }}>
                    <Badge color="green">100% Selaras</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REKAP PPH PASAL 17 TAHUNAN / SPT TAHUNAN (BRD 4.5.23) */}
      {/* ========================================================================= */}
      {tab === "spt_tahunan" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle>
            Rekapitulasi PPh Pasal 17 Tahunan (Dasar Pengisian SPT Tahunan PPh 21 PT ASABRI ke DJP)
          </SectionTitle>

          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 10px", textAlign: "center", width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kode Jiwa</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Setahun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Biaya Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PKP Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Terutang Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Jan–Nov (TER)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Desember</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status NPWP</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                      <div style={{ fontSize: 10.5, color: "#64748B" }}>NIK: {d.nik} • NPWP: {d.npwp}</div>
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                      {d.mak}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                      {d.kodeJiwa}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.brutoSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.biayaPensiunSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pkp)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1E40AF", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphTerutangSetahunP17)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphDipotongJanNov)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphDesember)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <Badge color={d.statusNPWP.includes("Valid") ? "green" : "red"}>
                        {d.statusNPWP}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PERBANDINGAN & AUDIT TER VS PASAL 17 (BRD 4.5.25) */}
      {/* ========================================================================= */}
      {tab === "komparasi_audit" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle>
            Perbandingan Nilai PPh 21 Metode TER vs Metode Lama PPh Pasal 17 (Audit Trail)
          </SectionTitle>

          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 10px", textAlign: "center", width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa Pajak</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Bulanan</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Metode TER (Baru)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Metode Pasal 17 (Lama)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Selisih (TER - P17)</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>% Selisih</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status Evaluasi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d, i) => {
                  const isZero = d.selisihBulanan === 0;
                  const isHigher = d.selisihBulanan > 0;
                  return (
                    <tr
                      key={d.id}
                      style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                    >
                      <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                      <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                        <div style={{ fontSize: 10.5, color: "#64748B" }}>NRP: {d.nrp} • {d.satker}</div>
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600, color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                        {filterBulanTER} 2026
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.brutoBulanan)}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.pphTERBulanan)}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.pphP17Bulanan)}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: isZero ? "#64748B" : isHigher ? "#DC2626" : "#059669",
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {isHigher ? "+" : ""}{fmt(d.selisihBulanan)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "center",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: isZero ? "#64748B" : isHigher ? "#DC2626" : "#059669",
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {d.selisihPersen}%
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <Badge color={isZero ? "gray" : isHigher ? "red" : "green"}>
                          {isZero ? "Setara" : isHigher ? "TER Lebih Tinggi" : "TER Lebih Rendah"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BUKTI POTONG 1721-A2 & INTEGRASI CORETAX (PJK 02 & PJK 03) */}
      {/* ========================================================================= */}
      {tab === "bukpot_coretax" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle
            action={
              uploadStep > 0 && (
                <Btn variant="ghost" size="sm" onClick={() => setUploadStep(0)}>
                  <RefreshCw size={13} /> Ulangi Alur
                </Btn>
              )
            }
          >
            Penerbitan Digital Bukti Potong 1721-A2 & Integrasi Coretax DJP
          </SectionTitle>

          {/* Stepper Wizard */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { n: 1, t: "Impor Data / Manifes Coretax" },
              { n: 2, t: "Validasi NIK & NPWP Dukcapil" },
              { n: 3, t: "Akses Mandiri Peserta (Portal / AMA)" },
            ].map((st, i) => {
              const done = uploadStep >= st.n;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: done ? "#EFF6FF" : "#F1F5F9",
                    color: done ? COLORS.blue : "#64748B",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: done ? COLORS.blue : "#CBD5E1",
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                    }}
                  >
                    {done ? <CheckCircle2 size={13} /> : st.n}
                  </span>
                  {st.t}
                </div>
              );
            })}
          </div>

          {uploadStep === 0 && (
            <div style={{ border: "2px dashed #CBD5E1", borderRadius: 8, padding: "32px 20px", textAlign: "center", background: "#F8FAFC" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFF6FF", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <FileUp size={22} color={COLORS.blue} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A" }}>
                Sinkronisasi & Impor Data Manifes Bukti Potong dari Coretax DJP
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, maxWidth: 520, margin: "4px auto 0" }}>
                Penerbitan Bukti Potong 1721-A2 otomatis dihasilkan untuk Masa Desember atau Masa Terakhir peserta berhenti.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                <Btn onClick={() => setUploadStep(1)}>
                  <Upload size={14} /> Unggah File Manifes Coretax (.XML / .ZIP)
                </Btn>
                <Btn variant="outline" onClick={() => setUploadStep(1)}>
                  <RefreshCw size={14} /> Sinkronisasi API Coretax DJP
                </Btn>
              </div>
            </div>
          )}

          {uploadStep >= 1 && (
            <>
              {/* Ringkasan Validasi */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "#F8FAFC", borderRadius: 6, padding: "10px 14px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Total Bukpot Terbit</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{filteredData.length} Dokumen</div>
                </div>
                <div style={{ background: "#ECFDF5", borderRadius: 6, padding: "10px 14px", border: "1px solid #A7F3D0" }}>
                  <div style={{ fontSize: 11, color: "#059669" }}>Valid NIK & NPWP</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>
                    {filteredData.filter((d) => d.statusNPWP.includes("Valid")).length} Dokumen
                  </div>
                </div>
                <div style={{ background: "#FEF2F2", borderRadius: 6, padding: "10px 14px", border: "1px solid #FECACA" }}>
                  <div style={{ fontSize: 11, color: "#DC2626" }}>Non-NPWP (+20%)</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>
                    {filteredData.filter((d) => !d.statusNPWP.includes("Valid")).length} Dokumen
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  {uploadStep < 2
                    ? "Status: Berkas terverifikasi dan siap dibuka untuk akses mandiri peserta pensiun via Portal Peserta & Aplikasi AMA."
                    : "Status: Bukti Potong 1721-A2 telah aktif dan dapat diunduh secara mandiri oleh peserta."}
                </div>
                {uploadStep < 2 ? (
                  <Btn onClick={() => setUploadStep(2)}>
                    <Mail size={14} /> Aktifkan Distribusi ke Portal Peserta
                  </Btn>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={15} /> Layanan Unduh Aktif
                  </span>
                )}
              </div>

              {/* Tabel Bukpot per Peserta */}
              <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Nama Peserta</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NPWP</th>
                      <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Terutang (A2)</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kanal Akses</th>
                      <th style={{ padding: "9px 10px", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.id}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                          <div style={{ fontSize: 10.5, color: "#64748B" }}>NRP: {d.nrp} • {d.satker}</div>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                          {d.nik}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: d.statusNPWP.includes("Valid") ? "#0F172A" : "#DC2626", borderRight: "1px solid #E2E8F0" }}>
                          {d.npwp}
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                          {fmt(d.pphTerutangSetahunP17)}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 11, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                          Portal Peserta / AMA
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <Btn
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPreview({
                                title: `Formulir 1721-A2 — Bukti Potong PPh 21 Tahun 2026`,
                                subtitle: `${d.nama} (${d.satker}) • Pemotong: PT ASABRI (Persero)`,
                                type: "table",
                                fileName: `Bukti_Potong_1721_A2_${d.nrp}.pdf`,
                                content: {
                                  columns: ["Komponen Penghasilan & Pajak", "Nominal (Rp)"],
                                  rows: [
                                    ["Nama Peserta Penerima Pensiun", d.nama],
                                    ["Nomor Induk Kependudukan (NIK)", d.nik],
                                    ["Nomor Pokok Wajib Pajak (NPWP)", d.npwp],
                                    ["Status Kode Jiwa / PTKP", `${d.kodeJiwa} (${fmt(d.ptkp)})`],
                                    ["A. Penghasilan Bruto Setahun", fmt(d.brutoSetahun)],
                                    ["B. Pengurang: Biaya Pensiun (5%)", fmt(d.biayaPensiunSetahun)],
                                    ["C. Penghasilan Netto Setahun (A - B)", fmt(d.brutoSetahun - d.biayaPensiunSetahun)],
                                    ["D. Penghasilan Kena Pajak / PKP (C - PTKP)", fmt(d.pkp)],
                                    ["E. PPh 21 Terutang Setahun PPh Pasal 17", fmt(d.pphTerutangSetahunP17)],
                                    ["F. PPh 21 Telah Dipotong Jan-Nov (TER)", fmt(d.pphDipotongJanNov)],
                                    ["G. PPh 21 Dipotong Bulan Desember (E - F)", fmt(d.pphDesember)],
                                  ],
                                  totalRows: 11,
                                },
                              })
                            }
                          >
                            <Eye size={12} /> Preview 1721-A2
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
