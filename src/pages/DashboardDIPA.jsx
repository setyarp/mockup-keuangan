import { useState } from "react";
import { AlertTriangle, BarChart3, PieChart, Calendar, Download } from "lucide-react";
import { COLORS } from "../constants/colors";
import { SectionTitle, Btn, Badge, PreviewModal } from "../components/common";

export const DashboardDIPA = () => {
  const [tab, setTab] = useState("realisasi");
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [chartPerspective, setChartPerspective] = useState("jenis"); // "jenis" | "mak"
  const [chartType, setChartType] = useState("stacked"); // "stacked" | "grouped"
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [preview, setPreview] = useState(null);

  const fmtM = n => `Rp ${n >= 1_000_000_000 ? (n / 1_000_000_000).toLocaleString("id-ID") : n.toLocaleString("id-ID")} M`;
  const fmtRp = n => `Rp ${n.toLocaleString("id-ID")}`;

  // Rincian MAK per jenis dapem (mengikuti 4 kelompok MAK pada Menu DAPEM)
  const jenisDapem = [
    {
      key: "induk",
      nama: "Dapem Induk",
      icon: "wallet",
      warna: "#1565C0",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 630_000_000_000, real: 472_500_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 150_000_000_000, real: 112_000_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 2_100_000_000_000, real: 1_575_000_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 1_320_000_000_000, real: 990_500_000_000 },
      ]
    },
    {
      key: "susulan",
      nama: "Dapem Susulan",
      icon: "clock",
      warna: "#059669",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 145_000_000_000, real: 66_000_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 35_000_000_000, real: 16_000_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 485_000_000_000, real: 223_000_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 305_000_000_000, real: 140_000_000_000 },
      ]
    },
    {
      key: "rapel",
      nama: "Dapem Rapel",
      icon: "trendup",
      warna: "#D97706",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 55_000_000_000, real: 38_000_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 15_000_000_000, real: 10_000_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 185_000_000_000, real: 128_000_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 115_000_000_000, real: 81_000_000_000 },
      ]
    },
    {
      key: "thr",
      nama: "Dapem THR",
      icon: "gift",
      warna: "#7C3AED",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 58_000_000_000, real: 57_800_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 14_000_000_000, real: 13_900_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 194_000_000_000, real: 193_800_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 122_000_000_000, real: 120_200_000_000 },
      ]
    },
    {
      key: "ke13",
      nama: "Dapem ke-13",
      icon: "calendar",
      warna: "#0891B2",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 56_000_000_000, real: 0 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 14_000_000_000, real: 0 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 188_000_000_000, real: 0 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 118_000_000_000, real: 0 },
      ]
    },
  ];

  const jenisTotal = j => {
    const pagu = j.mak.reduce((a, m) => a + m.pagu, 0);
    const real = j.mak.reduce((a, m) => a + m.real, 0);
    return { pagu, real, sisa: pagu - real, pct: pagu ? (real / pagu) * 100 : 0 };
  };
  const grand = jenisDapem.reduce((a, j) => { const t = jenisTotal(j); return { pagu: a.pagu + t.pagu, real: a.real + t.real }; }, { pagu: 0, real: 0 });
  const grandSisa = grand.pagu - grand.real;
  const pctUsed = ((grand.real / grand.pagu) * 100).toFixed(1);
  const pctSisa = ((grandSisa / grand.pagu) * 100).toFixed(1);

  // RULES THRESHOLD ALERT (OTOMATIS SISTEM):
  // Threshold = Realisasi Terakhir x Sisa Bulan dalam Setahun (12 - Bulan Berjalan)
  const bulanBerjalanIndex = 7; // Juli 2026 (bulan ke-7 dari 12)
  const lastMonthData = {
    bulan: "Juli 2026",
    short: "Jul",
    nominal: 413_400_000_000,
    nominalM: 413.4
  };
  const sisaBulanDalamSetahun = Math.max(0, 12 - bulanBerjalanIndex); // 5 bulan (Agustus - Desember)
  const thresholdKebutuhanNominal = lastMonthData.nominal * sisaBulanDalamSetahun; // 413,4 M * 5 = 2.067,0 M
  const isAlert = grandSisa < thresholdKebutuhanNominal;
  const defisitEstimasi = Math.max(0, thresholdKebutuhanNominal - grandSisa);
  const runwayBulan = lastMonthData.nominal > 0 ? (grandSisa / lastMonthData.nominal).toFixed(1) : "0";

  const revisiPagu = 320_000_000_000;
  const paguAwal = grand.pagu - revisiPagu;
  const rataRataBulanan = grand.real / 7;

  // Akumulasi Pagu & Realisasi Terserap per 4 MAK DAPEM
  const makList = [
    { kode: "513122", nama: "PENS TNI", sub: "TNI (AD, AL, AU)", iconColor: "#059669" },
    { kode: "513123", nama: "PENS POLRI", sub: "POLRI", iconColor: "#7C3AED" },
    { kode: "513113", nama: "PENS PNS KEMHAN", sub: "PNS Kemenhan", iconColor: "#1565C0" },
    { kode: "513114", nama: "PENS PNS POLRI", sub: "PNS POLRI", iconColor: "#0891B2" },
  ];

  const jenisMeta = [
    { key: "induk", nama: "Dapem Induk", color: "#1565C0" },
    { key: "susulan", nama: "Dapem Susulan", color: "#059669" },
    { key: "rapel", nama: "Dapem Rapel", color: "#D97706" },
    { key: "thr", nama: "Dapem THR", color: "#7C3AED" },
    { key: "ke13", nama: "Dapem ke-13", color: "#0891B2" },
  ];

  const makMeta = [
    { key: "513122", nama: "513122 (TNI)", short: "TNI", color: "#059669" },
    { key: "513123", nama: "513123 (POLRI)", short: "POLRI", color: "#7C3AED" },
    { key: "513113", nama: "513113 (PNS Kemhan)", short: "PNS Kemhan", color: "#1565C0" },
    { key: "513114", nama: "513114 (PNS Polri)", short: "PNS Polri", color: "#0891B2" },
  ];

  const makSummary = makList.map(item => {
    let pagu = 0;
    let real = 0;
    jenisDapem.forEach(j => {
      const match = j.mak.find(m => m.kode === item.kode);
      if (match) {
        pagu += match.pagu;
        real += match.real;
      }
    });
    const sisa = pagu - real;
    const pct = pagu ? (real / pagu) * 100 : 0;
    const shareOfTotal = grand.real ? (real / grand.real) * 100 : 0;
    return { ...item, pagu, real, sisa, pct, shareOfTotal };
  });

  // Data Pembayaran Jenis Dapem per Bulan (TA 2026)
  // Aturan Realisasi: Dana Realisasi Netto = Rekap III - Lebih Bayar Pajak (LB) - Saldo Uang Pensiun (SUP 45 Hari)
  const pembayaranBulanan = [
    {
      bulan: "Januari 2026",
      short: "Jan",
      periode: "2026-01",
      tglBayar: "02 Jan 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      rekapIII: 585_400_000_000,
      lb: 42_500_000_000, // Lebih bayar pajak akhir tahun sebelumnya yang dikompensasikan di Januari
      sup: 1_400_000_000,  // Penarikan dana rekening peserta belum otentikasi > 45 hari
      totalNominal: 541_500_000_000, // 585.4M - 42.5M - 1.4M
      totalM: 541.5,
      jenisM: { induk: 485.0, susulan: 35.5, rapel: 21.0, thr: 0, ke13: 0 },
      makM: { "513113": 81.6, "513114": 19.5, "513122": 271.5, "513123": 168.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 485_000_000_000, mak: { "513113": 72_750_000_000, "513114": 17_240_000_000, "513122": 242_500_000_000, "513123": 152_510_000_000 } },
        { jenis: "Dapem Susulan", nominal: 35_500_000_000, mak: { "513113": 5_320_000_000, "513114": 1_280_000_000, "513122": 17_750_000_000, "513123": 11_150_000_000 } },
        { jenis: "Dapem Rapel", nominal: 21_000_000_000, mak: { "513113": 3_530_000_000, "513114": 980_000_000, "513122": 11_250_000_000, "513123": 5_240_000_000 } },
      ],
      breakdownMAK: {
        "513113": 81_600_000_000,
        "513114": 19_500_000_000,
        "513122": 271_500_000_000,
        "513123": 168_900_000_000,
      }
    },
    {
      bulan: "Februari 2026",
      short: "Feb",
      periode: "2026-02",
      tglBayar: "02 Feb 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan"],
      rekapIII: 554_200_000_000,
      lb: 0,
      sup: 2_100_000_000,
      totalNominal: 552_100_000_000, // 554.2M - 2.1M
      totalM: 552.1,
      jenisM: { induk: 525.0, susulan: 27.1, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 83.0, "513114": 19.8, "513122": 277.0, "513123": 172.3 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 27_100_000_000, mak: { "513113": 4_250_000_000, "513114": 1_140_000_000, "513122": 14_500_000_000, "513123": 7_210_000_000 } },
      ],
      breakdownMAK: {
        "513113": 83_000_000_000,
        "513114": 19_800_000_000,
        "513122": 277_000_000_000,
        "513123": 172_300_000_000,
      }
    },
    {
      bulan: "Maret 2026",
      short: "Mar",
      periode: "2026-03",
      tglBayar: "25 Mar 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel", "Dapem THR"],
      rekapIII: 954_300_000_000,
      lb: 0,
      sup: 2_500_000_000,
      totalNominal: 951_800_000_000, // 954.3M - 2.5M
      totalM: 951.8,
      jenisM: { induk: 525.0, susulan: 26.1, rapel: 15.0, thr: 385.7, ke13: 0 },
      makM: { "513113": 144.3, "513114": 34.2, "513122": 478.5, "513123": 294.8 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 26_100_000_000, mak: { "513113": 3_950_000_000, "513114": 940_000_000, "513122": 13_800_000_000, "513123": 7_410_000_000 } },
        { jenis: "Dapem Rapel", nominal: 15_000_000_000, mak: { "513113": 3_800_000_000, "513114": 700_000_000, "513122": 8_400_000_000, "513123": 2_100_000_000 } },
        { jenis: "Dapem THR", nominal: 385_700_000_000, mak: { "513113": 57_800_000_000, "513114": 13_900_000_000, "513122": 193_800_000_000, "513123": 120_200_000_000 } },
      ],
      breakdownMAK: {
        "513113": 144_300_000_000,
        "513114": 34_200_000_000,
        "513122": 478_500_000_000,
        "513123": 294_800_000_000,
      }
    },
    {
      bulan: "April 2026",
      short: "Apr",
      periode: "2026-04",
      tglBayar: "01 Apr 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan"],
      rekapIII: 556_100_000_000,
      lb: 0,
      sup: 1_800_000_000,
      totalNominal: 554_300_000_000, // 556.1M - 1.8M
      totalM: 554.3,
      jenisM: { induk: 525.0, susulan: 29.3, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 83.5, "513114": 19.9, "513122": 278.0, "513123": 172.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 29_300_000_000, mak: { "513113": 4_750_000_000, "513114": 1_240_000_000, "513122": 15_500_000_000, "513123": 7_810_000_000 } },
      ],
      breakdownMAK: {
        "513113": 83_500_000_000,
        "513114": 19_900_000_000,
        "513122": 278_000_000_000,
        "513123": 172_900_000_000,
      }
    },
    {
      bulan: "Mei 2026",
      short: "Mei",
      periode: "2026-05",
      tglBayar: "02 Mei 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      rekapIII: 591_400_000_000,
      lb: 0,
      sup: 2_200_000_000,
      totalNominal: 589_200_000_000, // 591.4M - 2.2M
      totalM: 589.2,
      jenisM: { induk: 525.0, susulan: 32.2, rapel: 32.0, thr: 0, ke13: 0 },
      makM: { "513113": 88.8, "513114": 21.2, "513122": 295.4, "513123": 183.8 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 32_200_000_000, mak: { "513113": 4_950_000_000, "513114": 1_280_000_000, "513122": 16_800_000_000, "513123": 9_170_000_000 } },
        { jenis: "Dapem Rapel", nominal: 32_000_000_000, mak: { "513113": 5_100_000_000, "513114": 1_260_000_000, "513122": 16_100_000_000, "513123": 9_540_000_000 } },
      ],
      breakdownMAK: {
        "513113": 88_800_000_000,
        "513114": 21_200_000_000,
        "513122": 295_400_000_000,
        "513123": 183_800_000_000,
      }
    },
    {
      bulan: "Juni 2026",
      short: "Jun",
      periode: "2026-06",
      tglBayar: "02 Jun 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      rekapIII: 593_500_000_000,
      lb: 0,
      sup: 2_000_000_000,
      totalNominal: 591_500_000_000, // 593.5M - 2.0M
      totalM: 591.5,
      jenisM: { induk: 525.0, susulan: 35.5, rapel: 31.0, thr: 0, ke13: 0 },
      makM: { "513113": 89.1, "513114": 21.3, "513122": 296.6, "513123": 184.5 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 35_500_000_000, mak: { "513113": 5_250_000_000, "513114": 1_360_000_000, "513122": 18_100_000_000, "513123": 10_790_000_000 } },
        { jenis: "Dapem Rapel", nominal: 31_000_000_000, mak: { "513113": 5_100_000_000, "513114": 1_280_000_000, "513122": 16_000_000_000, "513123": 8_620_000_000 } },
      ],
      breakdownMAK: {
        "513113": 89_100_000_000,
        "513114": 21_300_000_000,
        "513122": 296_600_000_000,
        "513123": 184_500_000_000,
      }
    },
    {
      bulan: "Juli 2026",
      short: "Jul",
      periode: "2026-07",
      tglBayar: "01 Jul 2026",
      status: "Berjalan (Proses SP2D)",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan"],
      rekapIII: 415_000_000_000,
      lb: 0,
      sup: 1_600_000_000,
      totalNominal: 413_400_000_000, // 415.0M - 1.6M
      totalM: 413.4,
      jenisM: { induk: 375.0, susulan: 38.4, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 62.4, "513114": 14.8, "513122": 207.3, "513123": 128.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 375_000_000_000, mak: { "513113": 56_250_000_000, "513114": 13_320_000_000, "513122": 187_500_000_000, "513123": 117_930_000_000 } },
        { jenis: "Dapem Susulan", nominal: 38_400_000_000, mak: { "513113": 6_150_000_000, "513114": 1_480_000_000, "513122": 19_800_000_000, "513123": 10_970_000_000 } },
      ],
      breakdownMAK: {
        "513113": 62_400_000_000,
        "513114": 14_800_000_000,
        "513122": 207_300_000_000,
        "513123": 128_900_000_000,
      }
    },
  ];

  const revisiLog = [
    { no: "REV/2026/03/001", tgl: "15 Mar 2026", jenis: "Dapem Induk", sebelum: 4_000_000_000_000, sesudah: 4_200_000_000_000, alasan: "Revisi APBN TA 2026 — tambahan alokasi pensiun baru" },
    { no: "REV/2026/05/002", tgl: "20 Mei 2026", jenis: "Dapem Susulan", sebelum: 890_000_000_000, sesudah: 970_000_000_000, alasan: "Penyesuaian data pensiunan susulan triwulan II" },
    { no: "REV/2026/06/003", tgl: "10 Jun 2026", jenis: "Dapem ke-13", sebelum: 336_000_000_000, sesudah: 376_000_000_000, alasan: "Penyesuaian alokasi Dapem ke-13 sesuai PP terbaru" },
  ];

  const selectedIndex = pembayaranBulanan.findIndex(b => b.bulan === filterBulan);
  const activeIdx = hoveredIdx !== null ? hoveredIdx : (selectedIndex !== -1 ? selectedIndex : null);
  const activeMonthData = activeIdx !== null ? pembayaranBulanan[activeIdx] : null;

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* CLEAN ENTERPRISE RUNWAY ALERT BANNER */}
      {isAlert && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderLeft: "4px solid #DC2626",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 280 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#FEE2E2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <AlertTriangle size={16} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#991B1B" }}>
                  Peringatan Ketahanan Pagu DIPA TA 2026
                </span>
                <span
                  style={{
                    background: "#FEE2E2",
                    color: "#DC2626",
                    border: "1px solid #FECDD3",
                    padding: "1px 7px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Sisa Runway: ~{runwayBulan} Bulan
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#7F1D1D", marginTop: 3, lineHeight: 1.5 }}>
                Berdasarkan realisasi terakhir (<strong>{fmtM(lastMonthData.nominal)}</strong>/bln), sisa pagu <strong>{fmtM(grandSisa)}</strong> diproyeksikan tidak mencukupi kebutuhan <strong>{sisaBulanDalamSetahun} bulan ke depan ({fmtM(thresholdKebutuhanNominal)})</strong> dengan potensi defisit <strong>-{fmtM(defisitEstimasi)}</strong>.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setTab("revisi")}
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B91C1C")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#DC2626")}
            >
              <span>Ajukan Usulan Revisi DIPA</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 1: EXECUTIVE KPI SUMMARY BAR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 18 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pagu Berjalan TA 2026</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#1565C0", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>DIPA Induk + Rev</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(grand.pagu)}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
            Awal: {fmtM(paguAwal)} • Revisi: <strong style={{ color: "#7C3AED" }}>+{fmtM(revisiPagu)}</strong>
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Realisasi Terserap</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>{pctUsed}% Serapan</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", fontFamily: "monospace" }}>{fmtM(grand.real)}</div>
          <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${pctUsed}%`, height: "100%", background: "#059669", borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: isAlert ? "1.5px solid #FECACA" : "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Sisa Pagu DIPA</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: isAlert ? "#DC2626" : "#D97706", background: isAlert ? "#FEF2F2" : "#FFFBEB", padding: "1px 6px", borderRadius: 4 }}>
              {isAlert ? `Kritis (< ${sisaBulanDalamSetahun} Bln)` : `${pctSisa}% Tersisa`}
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: isAlert ? "#DC2626" : "#0F172A", fontFamily: "monospace" }}>{fmtM(grandSisa)}</div>
          <div style={{ fontSize: 11, color: isAlert ? "#DC2626" : "#64748B", marginTop: 4, fontWeight: 600 }}>
            {isAlert ? `Threshold ${sisaBulanDalamSetahun} Bln: ${fmtM(thresholdKebutuhanNominal)}` : "Status cadangan dana aman"}
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Rata-rata Realisasi</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>7 Bulan (Jan-Jul)</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(rataRataBulanan)}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
            Puncak: <strong style={{ color: "#7C3AED" }}>Maret (951,8 M)</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigasi */}
      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "realisasi", l: "Sisa Pagu & Pembayaran Bulanan" },
          { id: "revisi", l: "Riwayat Revisi Pagu", c: revisiLog.length },
          { id: "konfigurasi", l: "Pemantauan Alert Otomatis", alertDot: isAlert },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "9px 18px", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, background: "transparent",
            display: "flex", alignItems: "center", gap: 6,
            color: tab === t.id ? COLORS.blue : COLORS.gray500,
            borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            marginBottom: -2
          }}>
            {t.l}
            {t.c ? <span style={{ background: tab === t.id ? "#E3F2FD" : COLORS.gray200, color: tab === t.id ? COLORS.blue : COLORS.gray700, padding: "1px 7px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.c}</span> : null}
            {t.alertDot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", display: "inline-block" }} title="Peringatan Defisit Aktif" />}
          </button>
        ))}
      </div>

      {/* TAB 1: Sisa Pagu & Pembayaran Bulanan */}
      {tab === "realisasi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* LEVEL 2: DUAL-PERSPECTIVE ANALYTICS SECTION (65% / 35% GRID) */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 64%) minmax(0, 36%)", gap: 16 }}>
            
            {/* PANEL KIRI (64%): SMART STACKED BAR CHART */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "16px 18px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                      <BarChart3 size={16} color={COLORS.blue} />
                      Tren Pembayaran Dapem Bulanan
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
                      Visualisasi komposisi nominal pencairan SP2D (Januari s.d. Juli 2026)
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {/* Perspective Switcher */}
                    <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 6, padding: 2, border: "1px solid #E2E8F0" }}>
                      <button
                        onClick={() => setChartPerspective("jenis")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartPerspective === "jenis" ? "#FFFFFF" : "transparent",
                          color: chartPerspective === "jenis" ? COLORS.blue : "#64748B",
                          boxShadow: chartPerspective === "jenis" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        Jenis Dapem
                      </button>
                      <button
                        onClick={() => setChartPerspective("mak")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartPerspective === "mak" ? "#FFFFFF" : "transparent",
                          color: chartPerspective === "mak" ? COLORS.blue : "#64748B",
                          boxShadow: chartPerspective === "mak" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        4 MAK
                      </button>
                    </div>

                    {/* Type Switcher */}
                    <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 6, padding: 2, border: "1px solid #E2E8F0" }}>
                      <button
                        onClick={() => setChartType("stacked")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartType === "stacked" ? "#FFFFFF" : "transparent",
                          color: chartType === "stacked" ? COLORS.blue : "#64748B",
                          boxShadow: chartType === "stacked" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        Stacked
                      </button>
                      <button
                        onClick={() => setChartType("grouped")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartType === "grouped" ? "#FFFFFF" : "transparent",
                          color: chartType === "grouped" ? COLORS.blue : "#64748B",
                          boxShadow: chartType === "grouped" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        Grouped
                      </button>
                    </div>

                    {/* Filter Periode */}
                    <select
                      value={filterBulan}
                      onChange={e => setFilterBulan(e.target.value)}
                      style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontWeight: 600, color: "#334155", outline: "none", cursor: "pointer" }}
                    >
                      <option value="Semua">Semua Bulan</option>
                      {pembayaranBulanan.map((b, bi) => (
                        <option key={bi} value={b.bulan}>{b.bulan}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SVG Bar Chart Content */}
                {(() => {
                  const itemsList = chartPerspective === "jenis" ? jenisMeta : makMeta;
                  const getValueM = (month, item) => chartPerspective === "jenis" ? (month.jenisM[item.key] || 0) : (month.makM[item.key] || 0);
                  const isStacked = chartType === "stacked";
                  const maxY = isStacked ? 1000 : (chartPerspective === "jenis" ? 600 : 500);
                  const svgW = 680;
                  const svgH = 220;
                  const padL = 52;
                  const padR = 20;
                  const padT = 28;
                  const padB = 35;
                  const plotW = svgW - padL - padR;
                  const plotH = svgH - padT - padB;
                  const N = pembayaranBulanan.length;
                  const slotW = plotW / N;
                  const yTicks = isStacked ? [0, 250, 500, 750, 1000] : (chartPerspective === "jenis" ? [0, 150, 300, 450, 600] : [0, 125, 250, 375, 500]);

                  return (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto", minWidth: 480, display: "block" }}>
                        {/* Gridlines */}
                        {yTicks.map((val, idx) => {
                          const y = padT + plotH - (val / maxY) * plotH;
                          return (
                            <g key={idx}>
                              <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray={idx > 0 && idx < yTicks.length - 1 ? "3 3" : "none"} />
                              <text x={padL - 6} y={y + 3.5} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace" fontWeight="600">
                                {val === 0 ? "0" : `${val}M`}
                              </text>
                            </g>
                          );
                        })}

                        {/* Months Columns */}
                        {pembayaranBulanan.map((b, i) => {
                          const isSelected = b.bulan === filterBulan;
                          const isHovered = hoveredIdx === i;
                          const isActive = isHovered || isSelected;
                          const slotX = padL + i * slotW;
                          const slotCenterX = slotX + slotW / 2;

                          // Grouped
                          const numBars = itemsList.length;
                          const barW = numBars === 5 ? 9.5 : 12.5;
                          const barGap = 2;
                          const groupW = numBars * barW + (numBars - 1) * barGap;
                          const startX = slotCenterX - groupW / 2;

                          // Stacked
                          const stackBarW = 28;
                          const stackX = slotCenterX - stackBarW / 2;
                          let currentStackY = padT + plotH;

                          return (
                            <g
                              key={i}
                              style={{ cursor: "pointer" }}
                              onClick={() => setFilterBulan(b.bulan === filterBulan ? "Semua" : b.bulan)}
                              onMouseEnter={() => setHoveredIdx(i)}
                              onMouseLeave={() => { setHoveredIdx(null); setHoveredBar(null); }}
                            >
                              {/* Slot Background Highlight */}
                              {isActive && (
                                <rect x={slotX + 2} y={padT - 18} width={slotW - 4} height={plotH + 20} fill="#1565C0" opacity="0.07" rx="5" />
                              )}

                              {/* Bars Rendering */}
                              {!isStacked ? (
                                itemsList.map((item, k) => {
                                  const valM = getValueM(b, item);
                                  const barH = (valM / maxY) * plotH;
                                  const barX = startX + k * (barW + barGap);
                                  const barY = padT + plotH - barH;
                                  const isBarHovered = hoveredBar?.month === b.bulan && hoveredBar?.itemKey === item.key;

                                  return (
                                    <g key={k} onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      setHoveredBar({
                                        month: b.bulan, itemKey: item.key, label: item.nama, color: item.color, valM, totalM: b.totalM,
                                        pct: b.totalM ? ((valM / b.totalM) * 100).toFixed(1) : 0
                                      });
                                    }}>
                                      <rect
                                        x={barX} y={barY} width={barW} height={Math.max(barH, 0)} rx="2"
                                        fill={item.color}
                                        opacity={isBarHovered ? 1 : (hoveredBar ? 0.4 : (isActive ? 1 : 0.88))}
                                        stroke={isBarHovered ? "#0F172A" : "none"} strokeWidth={isBarHovered ? 1.5 : 0}
                                        style={{ transition: "all 0.15s ease" }}
                                      />
                                    </g>
                                  );
                                })
                              ) : (
                                <>
                                  {itemsList.map((item, k) => {
                                    const valM = getValueM(b, item);
                                    const segH = (valM / maxY) * plotH;
                                    const segY = currentStackY - segH;
                                    const isBarHovered = hoveredBar?.month === b.bulan && hoveredBar?.itemKey === item.key;
                                    const rectEl = (
                                      <rect
                                        key={k} x={stackX} y={segY} width={stackBarW} height={Math.max(segH, 0)}
                                        fill={item.color}
                                        opacity={isBarHovered ? 1 : (hoveredBar ? 0.45 : (isActive ? 1 : 0.9))}
                                        stroke={isBarHovered ? "#0F172A" : (k === 0 ? "none" : "#FFFFFF")}
                                        strokeWidth={isBarHovered ? 1.5 : (k === 0 ? 0 : 0.5)}
                                        style={{ transition: "all 0.15s ease" }}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setHoveredBar({
                                            month: b.bulan, itemKey: item.key, label: item.nama, color: item.color, valM, totalM: b.totalM,
                                            pct: b.totalM ? ((valM / b.totalM) * 100).toFixed(1) : 0
                                          });
                                        }}
                                      />
                                    );
                                    currentStackY = segY;
                                    return rectEl;
                                  })}
                                  {/* Total Label on Top of Stack */}
                                  <text x={slotCenterX} y={currentStackY - 4} fontSize="9" fontWeight="800" fontFamily="monospace" textAnchor="middle" fill="#0F172A">
                                    {b.totalM}M
                                  </text>
                                </>
                              )}

                              {/* X-Axis Label */}
                              <text x={slotCenterX} y={svgH - 12} textAnchor="middle" fontSize={isActive ? "11" : "10"} fontWeight={isActive ? "800" : "600"} fill={isActive ? COLORS.blue : "#64748B"}>
                                {b.short}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* Legend & Active Bar Info */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 10.5, color: "#475569" }}>
                  {(chartPerspective === "jenis" ? jenisMeta : makMeta).map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                      <span style={{ fontWeight: 600 }}>{item.nama}</span>
                    </div>
                  ))}
                </div>

                {hoveredBar && (
                  <div style={{ fontSize: 11, background: hoveredBar.color + "14", color: hoveredBar.color, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                    {hoveredBar.label}: {hoveredBar.valM}M ({hoveredBar.pct}%)
                  </div>
                )}
              </div>
            </div>

            {/* PANEL KANAN (36%): PROPORSI & KESEHATAN DANA 4 MAK */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "16px 18px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                      <PieChart size={16} color={COLORS.blue} />
                      Alokasi & Serapan 4 MAK
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
                      {filterBulan === "Semua" ? "Akumulasi Pagu DIPA TA 2026" : `Distribusi Bulan ${filterBulan}`}
                    </div>
                  </div>
                  {filterBulan !== "Semua" && (
                    <button
                      onClick={() => setFilterBulan("Semua")}
                      style={{ fontSize: 10.5, color: COLORS.blue, background: "#EFF6FF", border: "none", padding: "2px 6px", borderRadius: 4, fontWeight: 700, cursor: "pointer" }}
                    >
                      Semua TA
                    </button>
                  )}
                </div>

                {/* Donut Chart & Key Highlights */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <svg width="105" height="105" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                    {/* TNI */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#059669" strokeWidth="16" strokeDasharray={`${0.500 * 289.02} 289.02`} strokeDashoffset="0" />
                    {/* POLRI */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#7C3AED" strokeWidth="16" strokeDasharray={`${0.314 * 289.02} 289.02`} strokeDashoffset={`-${0.500 * 289.02}`} />
                    {/* Kemhan */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#1565C0" strokeWidth="16" strokeDasharray={`${0.150 * 289.02} 289.02`} strokeDashoffset={`-${(0.500 + 0.314) * 289.02}`} />
                    {/* PNS POLRI */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#0891B2" strokeWidth="16" strokeDasharray={`${0.036 * 289.02} 289.02`} strokeDashoffset={`-${(0.500 + 0.314 + 0.150) * 289.02}`} />
                  </svg>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#64748B" }}>Total Serapan Aktif:</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>
                      {filterBulan === "Semua" ? fmtM(grand.real) : fmtM(activeMonthData?.totalNominal || 0)}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#059669", fontWeight: 700, marginTop: 2 }}>
                      81,4% Alokasi Terbesar pada TNI & POLRI
                    </div>
                  </div>
                </div>

                {/* 4 MAK Rows Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {makSummary.map((m, idx) => {
                    const monthVal = activeMonthData ? (activeMonthData.breakdownMAK[m.kode] || 0) : null;
                    const makThresholdNominal = (m.pagu / (grand.pagu || 1)) * thresholdKebutuhanNominal;
                    const isWarn = m.sisa < makThresholdNominal;

                    return (
                      <div key={idx} style={{ background: "#F8FAFC", borderRadius: 6, padding: "7px 10px", border: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: 2, background: m.iconColor }} />
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1E293B" }}>MAK {m.kode}</span>
                            <span style={{ fontSize: 10, color: "#64748B" }}>({m.sub})</span>
                          </div>
                          <span style={{ fontSize: 10.5, fontWeight: 800, color: isWarn ? "#DC2626" : m.iconColor }}>
                            {filterBulan === "Semua" ? `${m.pct.toFixed(1)}%` : fmtRp(monthVal)}
                          </span>
                        </div>

                        {filterBulan === "Semua" ? (
                          <>
                            <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${m.pct}%`, height: "100%", background: isWarn ? "#DC2626" : m.iconColor, borderRadius: 2 }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#64748B", marginTop: 3 }}>
                              <span>Pagu: {fmtM(m.pagu)}</span>
                              <span>Sisa: <strong style={{ color: isWarn ? "#DC2626" : "#334155" }}>{fmtM(m.sisa)}</strong></span>
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: 9.5, color: "#64748B", display: "flex", justifyContent: "space-between" }}>
                            <span>Porsi Bulan {filterBulan}:</span>
                            <strong style={{ color: m.iconColor }}>{((monthVal / (activeMonthData.totalNominal || 1)) * 100).toFixed(1)}%</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 8, marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: "#64748B" }}>
                <span>Threshold: Rn × {sisaBulanDalamSetahun} Bulan ({fmtM(thresholdKebutuhanNominal)})</span>
                <span style={{ color: isAlert ? "#DC2626" : "#059669", fontWeight: 700 }}>
                  {isAlert ? "⚠️ Runway Defisit" : "✅ Alokasi Terkendali"}
                </span>
              </div>
            </div>
          </div>

          {/* LEVEL 3: PEMBAYARAN JENIS DAPEM (DISPLAY PER BULAN) */}
          {(() => {
            const activeMonthName = filterBulan === "Semua" ? "Maret 2026" : filterBulan;
            const selectedMonthObj = pembayaranBulanan.find(b => b.bulan === activeMonthName) || pembayaranBulanan[2];

            return (
              <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "18px 20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                {/* Header Card & Month Selector Dropdown */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={16} color={COLORS.blue} />
                      Pembayaran Jenis Dapem — {selectedMonthObj.bulan}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                      Rincian realisasi SP2D dan distribusi 4 MAK DAPEM per bulan
                    </div>
                  </div>

                  {/* Dropdown Filter & Export Button */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Periode Bulan:</span>
                      <select
                        value={activeMonthName}
                        onChange={e => setFilterBulan(e.target.value)}
                        style={{
                          padding: "6px 12px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          color: "#1E293B",
                          fontWeight: 700,
                          cursor: "pointer",
                          outline: "none"
                        }}
                      >
                        {pembayaranBulanan.map((b, bi) => (
                          <option key={bi} value={b.bulan}>
                            {b.bulan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Btn variant="outline" size="sm" onClick={() => setPreview({
                      title: `Rincian Pembayaran Dapem — ${selectedMonthObj.bulan}`,
                      subtitle: `Realisasi SP2D per Jenis & MAK DAPEM • ${selectedMonthObj.jenisDibayar.join(", ")}`,
                      type: "table",
                      fileName: `Pembayaran_Dapem_${selectedMonthObj.bulan.replace(/ /g, "_")}.xlsx`,
                      content: {
                        columns: ["Jenis Dapem", "513113 (PNS Kemhan)", "513114 (PNS Polri)", "513122 (TNI)", "513123 (Polri)", "Total Nominal"],
                        rows: [
                          ...selectedMonthObj.breakdownJenis.map(bj => [
                            bj.jenis,
                            fmtRp(bj.mak["513113"] || 0),
                            fmtRp(bj.mak["513114"] || 0),
                            fmtRp(bj.mak["513122"] || 0),
                            fmtRp(bj.mak["513123"] || 0),
                            fmtRp(bj.nominal)
                          ]),
                          ["TOTAL BULAN INI", fmtRp(selectedMonthObj.breakdownMAK["513113"]), fmtRp(selectedMonthObj.breakdownMAK["513114"]), fmtRp(selectedMonthObj.breakdownMAK["513122"]), fmtRp(selectedMonthObj.breakdownMAK["513123"]), fmtRp(selectedMonthObj.totalNominal)]
                        ],
                        totalRows: selectedMonthObj.breakdownJenis.length + 1
                      }
                    })}>
                      <Download size={13} /> Ekspor Excel ({selectedMonthObj.short})
                    </Btn>
                  </div>
                </div>

                {/* Banner Info Bulan Terpilih */}
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: COLORS.blue + "14",
                        color: COLORS.blue,
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800
                      }}>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{selectedMonthObj.bulan}</span>
                          <span style={{ fontSize: 10.5, background: selectedMonthObj.status.includes("Berjalan") ? "#FFFBEB" : "#ECFDF5", color: selectedMonthObj.status.includes("Berjalan") ? "#D97706" : "#059669", padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>
                            {selectedMonthObj.status}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Tgl SP2D: {selectedMonthObj.tglBayar} • Jenis Dapem Cair:</span>
                          {selectedMonthObj.jenisDibayar.map((jNama, ji) => {
                            const isTHR = jNama.includes("THR");
                            const isRapel = jNama.includes("Rapel");
                            const isSusulan = jNama.includes("Susulan");
                            return (
                              <span
                                key={ji}
                                style={{
                                  fontSize: 10.5, fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                                  background: isTHR ? "#7C3AED14" : isRapel ? "#FEF3C7" : isSusulan ? "#ECFDF5" : "#EFF6FF",
                                  color: isTHR ? "#7C3AED" : isRapel ? "#D97706" : isSusulan ? "#059669" : "#1565C0",
                                  border: `1px solid ${isTHR ? "#E9D5FF" : isRapel ? "#FDE68A" : isSusulan ? "#A7F3D0" : "#BFDBFE"}`
                                }}
                              >
                                {jNama}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Total Realisasi Bulan Ini:</div>
                      <div style={{ fontSize: 17, fontWeight: 900, fontFamily: "monospace", color: "#0F172A" }}>
                        {fmtRp(selectedMonthObj.totalNominal)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabel Matriks: Jenis Dapem vs 4 MAK Bulan Ini */}
                <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: "#FFFFFF" }}>
                        <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, borderRight: "1px solid #334155" }}>Jenis Dapem</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513113 (PNS Kemhan)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513114 (PNS Polri)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513122 (TNI)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513123 (Polri)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700 }}>Total Bulan Ini (Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMonthObj.breakdownJenis.map((bj, bji) => (
                        <tr
                          key={bji}
                          style={{ borderBottom: "1px solid #E2E8F0", background: bji % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = bji % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                        >
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            {bj.jenis}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513113"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513114"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513122"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513123"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#059669" }}>
                            {fmtRp(bj.nominal)}
                          </td>
                        </tr>
                      ))}
                      {/* Total Baris Bulan Ini */}
                      <tr style={{ background: "#E2E8F0", fontWeight: 800 }}>
                        <td style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                          TOTAL {selectedMonthObj.bulan.toUpperCase()}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513113"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513114"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513122"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513123"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", fontWeight: 900 }}>
                          {fmtRp(selectedMonthObj.totalNominal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: Riwayat Revisi Pagu */}
      {tab === "revisi" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Riwayat Revisi Pagu", subtitle: "Perubahan pagu DIPA TA 2026", type: "table", fileName: "Riwayat_Revisi_Pagu_2026.xlsx", content: { columns: ["No. Revisi", "Tanggal", "Jenis", "Sebelum", "Sesudah", "Selisih"], rows: revisiLog.map(r => [r.no, r.tgl, r.jenis, fmtRp(r.sebelum), fmtRp(r.sesudah), "+" + fmtRp(r.sesudah - r.sebelum)]), totalRows: revisiLog.length } })}>Ekspor</Btn>}>Riwayat Revisi Pagu DIPA</SectionTitle>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["No. Revisi", "Tanggal", "Jenis Dapem", "Pagu Sebelum", "Pagu Sesudah", "Selisih", "Alasan Revisi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: i >= 3 && i <= 5 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 6 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{revisiLog.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, color: "#7B1FA2", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, borderRight: "1px solid #E2E8F0" }}>{r.tgl}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color="blue">{r.jenis}</Badge></td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmtRp(r.sebelum)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmtRp(r.sesudah)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.green, fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>+{fmtRp(r.sesudah - r.sebelum)}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569", maxWidth: 280 }}>{r.alasan}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray500 }}>Revisi pagu diperbarui berdasarkan DIPA Revisi dari Kemenkeu • Data otomatis memperbarui pagu berjalan</div>
        </div>
      )}

      {/* TAB 3: Pemantauan Alert Otomatis Sistem */}
      {tab === "konfigurasi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Box 1: Aturan & Mekanisme Otomatis Sistem */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 24px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  Aturan Ambang Batas Alert (Perhitungan Otomatis Sistem)
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Sistem secara otomatis membaca nominal realisasi pencairan bulan terakhir dan mengalikannya dengan sisa bulan dalam setahun tanpa perlu input manual.
                </div>
              </div>

              <div style={{ background: isAlert ? "#FEF2F2" : "#ECFDF5", border: isAlert ? "1px solid #FECACA" : "1px solid #A7F3D0", padding: "6px 14px", borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: isAlert ? "#DC2626" : "#059669" }}>
                  {isAlert ? "⚠️ STATUS: ALERT KRITIS (DEFISIT RUNWAY)" : "✅ STATUS: SISA PAGU AMAN"}
                </span>
              </div>
            </div>

            {/* Formula Visual Banner */}
            <div style={{ marginTop: 16, background: "#F8FAFC", borderRadius: 8, padding: "16px 20px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                Formula Ambang Batas Otomatis:
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 13.5, fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                <span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "4px 10px", borderRadius: 6, border: "1px solid #BFDBFE" }}>
                  Threshold Ambang Kebutuhan (Rp)
                </span>
                <span>=</span>
                <span style={{ background: "#F3E8FF", color: "#7C3AED", padding: "4px 10px", borderRadius: 6, border: "1px solid #E9D5FF" }}>
                  Realisasi Bulan Terakhir
                </span>
                <span>×</span>
                <span style={{ background: "#FEF3C7", color: "#B45309", padding: "4px 10px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                  Sisa Bulan dalam Setahun (12 - Bulan Berjalan)
                </span>
              </div>

              {/* Live Evaluasi Formula Berjalan */}
              <div style={{ marginTop: 14, background: "#FFFFFF", padding: "10px 14px", borderRadius: 6, border: "1px solid #CBD5E1", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: "#475569" }}>Hasil Bacaan Sistem Saat Ini:</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                  Realisasi {lastMonthData.bulan} ({fmtM(lastMonthData.nominal)}) × {sisaBulanDalamSetahun} Bulan Sisa (Agustus s.d. Desember) = Threshold: <strong style={{ color: "#1D4ED8" }}>{fmtM(thresholdKebutuhanNominal)}</strong>
                </span>
              </div>

              {/* Aturan Khusus Komposisi Realisasi Dana DIPA */}
              <div style={{ marginTop: 14, background: "#F8FAFC", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                  📐 Ketentuan & Komposisi Realisasi Dana Pensiun DIPA:
                </div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>
                  <div style={{ marginBottom: 6 }}>
                    <code style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                      Dana Realisasi Netto = Rekapitulasi III (DAPEM) - Lebih Bayar Pajak (LB) - Saldo Uang Pensiun (SUP)
                    </code>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: "#475569" }}>
                    <li style={{ marginBottom: 4 }}>
                      <strong>Rekapitulasi III:</strong> Kebutuhan kotor tagihan pembayaran pensiun yang diterbitkan pada modul DAPEM.
                    </li>
                    <li style={{ marginBottom: 4 }}>
                      <strong>Lebih Bayar Pajak (LB):</strong> Kompensasi kelebihan setor PPh 21 dari akhir tahun anggaran sebelumnya (umumnya diperhitungkan pada bulan Januari).
                    </li>
                    <li>
                      <strong>Saldo Uang Pensiun (SUP):</strong> Penarikan kembali <em>(reversal)</em> uang pensiun bagi peserta yang <strong>tidak melakukan otentikasi biometrik selama 45 hari</strong> kalender, sehingga dananya ditarik kembali ke kas pengelola.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Ringkasan Telemetri Otomatis Sistem (2 Kolom) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Kolom 1: Data Riil yang Dibaca Sistem */}
            <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <SectionTitle>Bacaan Data Riil Sistem</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Bulan Berjalan Terdeteksi:</span>
                  <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{lastMonthData.bulan} (Bulan ke-{bulanBerjalanIndex} dari 12)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Realisasi Terakhir Terbaca:</span>
                  <strong style={{ fontSize: 12.5, color: "#0F172A", fontFamily: "monospace" }}>{fmtRp(lastMonthData.nominal)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Sisa Periode TA 2026:</span>
                  <strong style={{ fontSize: 12.5, color: "#D97706" }}>{sisaBulanDalamSetahun} Bulan (12 - {bulanBerjalanIndex})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#EFF6FF", borderRadius: 6, border: "1px solid #DBEAFE" }}>
                  <span style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 700 }}>Threshold Kebutuhan Otomatis:</span>
                  <strong style={{ fontSize: 13, color: "#1D4ED8", fontFamily: "monospace" }}>{fmtRp(thresholdKebutuhanNominal)}</strong>
                </div>
              </div>
            </div>

            {/* Kolom 2: Status Evaluasi & Ketahanan Sisa Dana */}
            <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <SectionTitle>Evaluasi Kecukupan Sisa Pagu</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Sisa Pagu DIPA Tersedia:</span>
                  <strong style={{ fontSize: 12.5, color: "#0F172A", fontFamily: "monospace" }}>{fmtRp(grandSisa)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isAlert ? "#FEF2F2" : "#ECFDF5", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: isAlert ? "#DC2626" : "#059669", fontWeight: 700 }}>Defisit / Surplus Proyeksi:</span>
                  <strong style={{ fontSize: 12.5, color: isAlert ? "#DC2626" : "#059669", fontFamily: "monospace" }}>
                    {isAlert ? `-${fmtRp(defisitEstimasi)} (Defisit)` : `+${fmtRp(grandSisa - thresholdKebutuhanNominal)} (Surplus)`}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Ketahanan Sisa Dana (Runway):</span>
                  <strong style={{ fontSize: 12.5, color: isAlert ? "#DC2626" : "#059669" }}>~{runwayBulan} Bulan</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isAlert ? "#FFF1F2" : "#F0FDF4", borderRadius: 6, border: isAlert ? "1px solid #FECDD3" : "1px solid #BBF7D0" }}>
                  <span style={{ fontSize: 12, color: isAlert ? "#9F1239" : "#166534", fontWeight: 700 }}>Rekomendasi Sistem:</span>
                  <strong style={{ fontSize: 11.5, color: isAlert ? "#9F1239" : "#166534" }}>
                    {isAlert ? "Perlu Pengajuan Revisi Tambahan Pagu" : "Alokasi Pagu DIPA Mencukupi"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Tabel Matriks Proyeksi Otomatis 12 Bulan TA 2026 */}
          {(() => {
            const namaBulanList = [
              { n: 1, nama: "Januari 2026", short: "Jan", real: 541_500_000_000, tipe: "Aktual" },
              { n: 2, nama: "Februari 2026", short: "Feb", real: 552_100_000_000, tipe: "Aktual" },
              { n: 3, nama: "Maret 2026", short: "Mar", real: 951_800_000_000, tipe: "Aktual" },
              { n: 4, nama: "April 2026", short: "Apr", real: 554_300_000_000, tipe: "Aktual" },
              { n: 5, nama: "Mei 2026", short: "Mei", real: 589_200_000_000, tipe: "Aktual" },
              { n: 6, nama: "Juni 2026", short: "Jun", real: 591_500_000_000, tipe: "Aktual" },
              { n: 7, nama: "Juli 2026", short: "Jul", real: 413_400_000_000, tipe: "Aktual (Terakhir)" },
              { n: 8, nama: "Agustus 2026", short: "Ags", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 9, nama: "September 2026", short: "Sep", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 10, nama: "Oktober 2026", short: "Okt", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 11, nama: "November 2026", short: "Nov", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 12, nama: "Desember 2026", short: "Des", real: 413_400_000_000, tipe: "Proyeksi" },
            ];

            return (
              <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                      Matriks Proyeksi Threshold Bulanan (Januari s.d. Desember TA 2026)
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                      Perkembangan pengali sisa bulan dan threshold kebutuhan untuk seluruh periode tahun anggaran
                    </div>
                  </div>

                  <Btn variant="outline" size="sm" onClick={() => setPreview({
                    title: "Pemantauan Threshold Alert TA 2026",
                    subtitle: "Tabel proyeksi ambang kebutuhan sisa bulan dalam setahun",
                    type: "table",
                    fileName: "Pemantauan_Threshold_Alert_2026.xlsx",
                    content: {
                      columns: ["No", "Bulan", "Status Data", "Realisasi / Estimasi", "Sisa Bulan (12 - n)", "Threshold Kebutuhan", "Sisa Pagu", "Status"],
                      rows: namaBulanList.map(b => {
                        const sisaBln = Math.max(0, 12 - b.n);
                        const threshNom = b.real * sisaBln;
                        const isWarn = grandSisa < threshNom;
                        return [
                          b.n,
                          b.nama,
                          b.tipe,
                          fmtRp(b.real),
                          `${sisaBln} Bulan`,
                          fmtRp(threshNom),
                          fmtRp(grandSisa),
                          isWarn ? "ALERT DEFISIT" : "AMAN"
                        ];
                      }),
                      totalRows: namaBulanList.length
                    }
                  })}>
                    <Download size={13} /> Ekspor Tabel (.xlsx)
                  </Btn>
                </div>

                <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: "#FFFFFF" }}>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, width: 40, borderRight: "1px solid #334155" }}>No</th>
                        <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, borderRight: "1px solid #334155" }}>Periode Bulan</th>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #334155" }}>Tipe Data</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>Realisasi (Rn)</th>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #334155" }}>Sisa Bulan (12 - n)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>Threshold Ambang (Rn × Sisa)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>Sisa Pagu DIPA</th>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700 }}>Status Alert</th>
                      </tr>
                    </thead>
                    <tbody>
                      {namaBulanList.map(b => {
                        const sisaBln = Math.max(0, 12 - b.n);
                        const threshNom = b.real * sisaBln;
                        const isWarn = grandSisa < threshNom;
                        const isCurrent = b.n === 7;

                        return (
                          <tr
                            key={b.n}
                            style={{
                              borderBottom: "1px solid #E2E8F0",
                              background: isCurrent ? "#EFF6FF" : b.n % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = isCurrent ? "#DBEAFE" : "#F1F5F9"}
                            onMouseLeave={e => e.currentTarget.style.background = isCurrent ? "#EFF6FF" : b.n % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                          >
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                              {b.n}
                            </td>
                            <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span>{b.nama}</span>
                                {isCurrent && (
                                  <span style={{ fontSize: 9.5, background: "#1565C0", color: "#FFFFFF", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>
                                    Bulan Ini
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>
                              <span style={{ padding: "1px 6px", borderRadius: 4, background: b.tipe.includes("Aktual") ? "#ECFDF5" : "#F1F5F9", color: b.tipe.includes("Aktual") ? "#059669" : "#64748B", fontWeight: 700 }}>
                                {b.tipe}
                              </span>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              {fmtRp(b.real)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 800, color: sisaBln > 0 ? "#D97706" : "#64748B", borderRight: "1px solid #E2E8F0" }}>
                              {sisaBln} Bulan
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                              {fmtRp(threshNom)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              {fmtRp(grandSisa)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center" }}>
                              <span style={{
                                fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 4,
                                background: isWarn ? "#FEE2E2" : "#ECFDF5",
                                color: isWarn ? "#DC2626" : "#059669",
                                border: `1px solid ${isWarn ? "#FECACA" : "#A7F3D0"}`
                              }}>
                                {isWarn ? "⚠️ DEFISIT" : "✅ AMAN"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
