import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  ShieldCheck,
  Building2,
  Wallet,
  CheckCircle2,
  TrendingUp,
  Layers,
  FileText,
  Filter,
  Users,
  CreditCard,
  ChevronRight,
  Info
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { SectionTitle, Btn, Badge, PreviewModal } from "../components/common";

export const DashboardDIPA = () => {
  // Top-level active program tab
  const [activeProgramTab, setActiveProgramTab] = useState("konsolidasi"); // "konsolidasi" | "pensiun" | "jkk" | "jkm" | "bop"

  // Belanja Pensiun (DAPEM) internal tabs & states
  const [pensiunSubTab, setPensiunSubTab] = useState("realisasi"); // "realisasi" | "revisi" | "konfigurasi"
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [chartPerspective, setChartPerspective] = useState("jenis"); // "jenis" | "mak"
  const [chartType, setChartType] = useState("stacked"); // "stacked" | "grouped"
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Filters for JKK, JKM, BOP
  const [filterSatkerJKK, setFilterSatkerJKK] = useState("Semua");
  const [filterSatkerJKM, setFilterSatkerJKM] = useState("Semua");
  const [filterBulanBOP, setFilterBulanBOP] = useState("Juli 2026");
  const [filterJenisDapemBOP, setFilterJenisDapemBOP] = useState("Semua");
  const [filterBulanMAK_BOP, setFilterBulanMAK_BOP] = useState("Juli 2026");
  const [filterTipeMAK_BOP, setFilterTipeMAK_BOP] = useState("Semua");

  const fmtM = n => `Rp ${n >= 1_000_000_000 ? (n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) : n.toLocaleString("id-ID")} M`;
  const fmtRp = n => `Rp ${n.toLocaleString("id-ID")}`;

  // ==========================================
  // DATASET 1: BELANJA PENSIUN (DAPEM - 4 MAK)
  // ==========================================
  const jenisDapem = [
    {
      key: "induk",
      nama: "Dapem Induk",
      icon: "wallet",
      warna: "#0141A8",
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
  const grandPensiun = jenisDapem.reduce((a, j) => { const t = jenisTotal(j); return { pagu: a.pagu + t.pagu, real: a.real + t.real }; }, { pagu: 0, real: 0 });
  const grandPensiunSisa = grandPensiun.pagu - grandPensiun.real;
  const pctPensiunUsed = ((grandPensiun.real / grandPensiun.pagu) * 100).toFixed(1);
  const pctPensiunSisa = ((grandPensiunSisa / grandPensiun.pagu) * 100).toFixed(1);

  // RULES THRESHOLD ALERT DAPEM (OTOMATIS SISTEM):
  const bulanBerjalanIndex = 7; // Juli 2026 (bulan ke-7 dari 12)
  const lastMonthData = {
    bulan: "Juli 2026",
    short: "Jul",
    nominal: 413_400_000_000,
    nominalM: 413.4
  };
  const sisaBulanDalamSetahun = Math.max(0, 12 - bulanBerjalanIndex); // 5 bulan (Agustus - Desember)
  const thresholdKebutuhanNominal = lastMonthData.nominal * sisaBulanDalamSetahun; // 413,4 M * 5 = 2.067,0 M
  const isPensiunAlert = grandPensiunSisa < thresholdKebutuhanNominal;
  const defisitEstimasi = Math.max(0, thresholdKebutuhanNominal - grandPensiunSisa);
  const runwayBulan = lastMonthData.nominal > 0 ? (grandPensiunSisa / lastMonthData.nominal).toFixed(1) : "0";

  const revisiPagu = 320_000_000_000;
  const paguAwalPensiun = grandPensiun.pagu - revisiPagu;
  const rataRataBulananPensiun = grandPensiun.real / 7;

  // Akumulasi Pagu & Realisasi Terserap per 4 MAK DAPEM
  const makList = [
    { kode: "513122", nama: "PENS TNI", sub: "TNI (AD, AL, AU)", iconColor: "#059669" },
    { kode: "513123", nama: "PENS POLRI", sub: "POLRI", iconColor: "#7C3AED" },
    { kode: "513113", nama: "PENS PNS KEMHAN", sub: "PNS Kemenhan", iconColor: "#0141A8" },
    { kode: "513114", nama: "PENS PNS POLRI", sub: "PNS POLRI", iconColor: "#0891B2" },
  ];

  const jenisMeta = [
    { key: "induk", nama: "Dapem Induk", color: "#0141A8" },
    { key: "susulan", nama: "Dapem Susulan", color: "#059669" },
    { key: "rapel", nama: "Dapem Rapel", color: "#D97706" },
    { key: "thr", nama: "Dapem THR", color: "#7C3AED" },
    { key: "ke13", nama: "Dapem ke-13", color: "#0891B2" },
  ];

  const makMeta = [
    { key: "513122", nama: "513122 (TNI)", short: "TNI", color: "#059669" },
    { key: "513123", nama: "513123 (POLRI)", short: "POLRI", color: "#7C3AED" },
    { key: "513113", nama: "513113 (PNS Kemhan)", short: "PNS Kemhan", color: "#0141A8" },
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
    const shareOfTotal = grandPensiun.real ? (real / grandPensiun.real) * 100 : 0;
    return { ...item, pagu, real, sisa, pct, shareOfTotal };
  });

  // Data Pembayaran Jenis Dapem per Bulan (TA 2026)
  const pembayaranBulanan = [
    {
      bulan: "Januari 2026",
      short: "Jan",
      periode: "2026-01",
      tglBayar: "02 Jan 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      rekapIII: 585_400_000_000,
      lb: 42_500_000_000,
      sup: 1_400_000_000,
      totalNominal: 541_500_000_000,
      totalM: 541.5,
      jenisM: { induk: 485.0, susulan: 35.5, rapel: 21.0, thr: 0, ke13: 0 },
      makM: { "513113": 81.6, "513114": 19.5, "513122": 271.5, "513123": 168.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 485_000_000_000, mak: { "513113": 72_750_000_000, "513114": 17_240_000_000, "513122": 242_500_000_000, "513123": 152_510_000_000 } },
        { jenis: "Dapem Susulan", nominal: 35_500_000_000, mak: { "513113": 5_320_000_000, "513114": 1_280_000_000, "513122": 17_750_000_000, "513123": 11_150_000_000 } },
        { jenis: "Dapem Rapel", nominal: 21_000_000_000, mak: { "513113": 3_530_000_000, "513114": 980_000_000, "513122": 11_250_000_000, "513123": 5_240_000_000 } },
      ],
      breakdownMAK: { "513113": 81_600_000_000, "513114": 19_500_000_000, "513122": 271_500_000_000, "513123": 168_900_000_000 }
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
      totalNominal: 552_100_000_000,
      totalM: 552.1,
      jenisM: { induk: 525.0, susulan: 27.1, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 83.0, "513114": 19.8, "513122": 277.0, "513123": 172.3 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 27_100_000_000, mak: { "513113": 4_250_000_000, "513114": 1_140_000_000, "513122": 14_500_000_000, "513123": 7_210_000_000 } },
      ],
      breakdownMAK: { "513113": 83_000_000_000, "513114": 19_800_000_000, "513122": 277_000_000_000, "513123": 172_300_000_000 }
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
      totalNominal: 951_800_000_000,
      totalM: 951.8,
      jenisM: { induk: 525.0, susulan: 26.1, rapel: 15.0, thr: 385.7, ke13: 0 },
      makM: { "513113": 144.3, "513114": 34.2, "513122": 478.5, "513123": 294.8 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 26_100_000_000, mak: { "513113": 3_950_000_000, "513114": 940_000_000, "513122": 13_800_000_000, "513123": 7_410_000_000 } },
        { jenis: "Dapem Rapel", nominal: 15_000_000_000, mak: { "513113": 3_800_000_000, "513114": 700_000_000, "513122": 8_400_000_000, "513123": 2_100_000_000 } },
        { jenis: "Dapem THR", nominal: 385_700_000_000, mak: { "513113": 57_800_000_000, "513114": 13_900_000_000, "513122": 193_800_000_000, "513123": 120_200_000_000 } },
      ],
      breakdownMAK: { "513113": 144_300_000_000, "513114": 34_200_000_000, "513122": 478_500_000_000, "513123": 294_800_000_000 }
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
      totalNominal: 554_300_000_000,
      totalM: 554.3,
      jenisM: { induk: 525.0, susulan: 29.3, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 83.5, "513114": 19.9, "513122": 278.0, "513123": 172.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 29_300_000_000, mak: { "513113": 4_750_000_000, "513114": 1_240_000_000, "513122": 15_500_000_000, "513123": 7_810_000_000 } },
      ],
      breakdownMAK: { "513113": 83_500_000_000, "513114": 19_900_000_000, "513122": 278_000_000_000, "513123": 172_900_000_000 }
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
      totalNominal: 589_200_000_000,
      totalM: 589.2,
      jenisM: { induk: 525.0, susulan: 32.2, rapel: 32.0, thr: 0, ke13: 0 },
      makM: { "513113": 88.8, "513114": 21.2, "513122": 295.4, "513123": 183.8 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 32_200_000_000, mak: { "513113": 4_950_000_000, "513114": 1_280_000_000, "513122": 16_800_000_000, "513123": 9_170_000_000 } },
        { jenis: "Dapem Rapel", nominal: 32_000_000_000, mak: { "513113": 5_100_000_000, "513114": 1_260_000_000, "513122": 16_100_000_000, "513123": 9_540_000_000 } },
      ],
      breakdownMAK: { "513113": 88_800_000_000, "513114": 21_200_000_000, "513122": 295_400_000_000, "513123": 183_800_000_000 }
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
      totalNominal: 591_500_000_000,
      totalM: 591.5,
      jenisM: { induk: 525.0, susulan: 35.5, rapel: 31.0, thr: 0, ke13: 0 },
      makM: { "513113": 89.1, "513114": 21.3, "513122": 296.6, "513123": 184.5 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 35_500_000_000, mak: { "513113": 5_250_000_000, "513114": 1_360_000_000, "513122": 18_100_000_000, "513123": 10_790_000_000 } },
        { jenis: "Dapem Rapel", nominal: 31_000_000_000, mak: { "513113": 5_100_000_000, "513114": 1_280_000_000, "513122": 16_000_000_000, "513123": 8_620_000_000 } },
      ],
      breakdownMAK: { "513113": 89_100_000_000, "513114": 21_300_000_000, "513122": 296_600_000_000, "513123": 184_500_000_000 }
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
      totalNominal: 413_400_000_000,
      totalM: 413.4,
      jenisM: { induk: 375.0, susulan: 38.4, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 62.4, "513114": 14.8, "513122": 207.3, "513123": 128.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 375_000_000_000, mak: { "513113": 56_250_000_000, "513114": 13_320_000_000, "513122": 187_500_000_000, "513123": 117_930_000_000 } },
        { jenis: "Dapem Susulan", nominal: 38_400_000_000, mak: { "513113": 6_150_000_000, "513114": 1_480_000_000, "513122": 19_800_000_000, "513123": 10_970_000_000 } },
      ],
      breakdownMAK: { "513113": 62_400_000_000, "513114": 14_800_000_000, "513122": 207_300_000_000, "513123": 128_900_000_000 }
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

  // ==========================================
  // DATASET 2: IURAN JKK (0,24% APBN)
  // ==========================================
  const paguJKKTotal = 31_560_000_000;
  const realisasiJKKTotal = 18_410_000_000;
  const sisaJKKTotal = paguJKKTotal - realisasiJKKTotal;
  const pctJKKUsed = ((realisasiJKKTotal / paguJKKTotal) * 100).toFixed(1);

  const satkerJKKList = [
    { kode: "TNI-AD", nama: "TNI Angkatan Darat", matra: "TNI AD", pagu: 7_490_000_000, real: 4_370_000_000, peserta: 348_210, mak: "511129 (Belanja JKK TNI)" },
    { kode: "TNI-AL", nama: "TNI Angkatan Laut", matra: "TNI AL", pagu: 3_270_000_000, real: 1_910_000_000, peserta: 74_150, mak: "511129 (Belanja JKK TNI)" },
    { kode: "TNI-AU", nama: "TNI Angkatan Udara", matra: "TNI AU", pagu: 2_720_000_000, real: 1_585_000_000, peserta: 42_800, mak: "511129 (Belanja JKK TNI)" },
    { kode: "KEMHAN", nama: "PNS Kemhan & Mabes TNI", matra: "PNS Kemhan", pagu: 1_200_000_000, real: 705_000_000, peserta: 49_320, mak: "511129 (Belanja JKK PNS)" },
    { kode: "POLRI", nama: "Kepolisian Negara RI (POLRI)", matra: "POLRI", pagu: 16_880_000_000, real: 9_840_000_000, peserta: 445_600, mak: "511129 (Belanja JKK Polri)" },
  ];

  const transaksiSP2D_JKK = [
    { noSP2D: "SP2D-JKK/2026/01/01284", tgl: "05 Jan 2026", satker: "POLRI", kppn: "KPPN Jakarta I", nominal: 1_405_700_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/01/01285", tgl: "05 Jan 2026", satker: "TNI Angkatan Darat", kppn: "KPPN Jakarta II", nominal: 624_285_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/01/01286", tgl: "05 Jan 2026", satker: "TNI Angkatan Laut", kppn: "KPPN Jakarta II", nominal: 272_850_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/01/01287", tgl: "05 Jan 2026", satker: "TNI Angkatan Udara", kppn: "KPPN Jakarta II", nominal: 226_420_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/01/01288", tgl: "05 Jan 2026", satker: "PNS Kemhan & Mabes TNI", kppn: "KPPN Jakarta I", nominal: 100_745_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/03/03551", tgl: "06 Mar 2026", satker: "POLRI", kppn: "KPPN Jakarta I", nominal: 1_405_700_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/06/07104", tgl: "05 Jun 2026", satker: "TNI Angkatan Darat", kppn: "KPPN Jakarta II", nominal: 624_285_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKK/2026/07/08340", tgl: "03 Jul 2026", satker: "POLRI", kppn: "KPPN Jakarta I", nominal: 1_405_700_000, status: "Dalam Proses Pencairan" },
  ];

  // ==========================================
  // DATASET 3: IURAN JKM (0,20% APBN)
  // ==========================================
  const paguJKMTotal = 26_520_000_000;
  const realisasiJKMTotal = 15_470_000_000;
  const sisaJKMTotal = paguJKMTotal - realisasiJKMTotal;
  const pctJKMUsed = ((realisasiJKMTotal / paguJKMTotal) * 100).toFixed(1);

  const satkerJKMList = [
    { kode: "TNI-AD", nama: "TNI Angkatan Darat", matra: "TNI AD", pagu: 6_240_000_000, real: 3_640_000_000, peserta: 348_210, mak: "511130 (Belanja JKM TNI)" },
    { kode: "TNI-AL", nama: "TNI Angkatan Laut", matra: "TNI AL", pagu: 2_730_000_000, real: 1_590_000_000, peserta: 74_150, mak: "511130 (Belanja JKM TNI)" },
    { kode: "TNI-AU", nama: "TNI Angkatan Udara", matra: "TNI AU", pagu: 2_260_000_000, real: 1_320_000_000, peserta: 42_800, mak: "511130 (Belanja JKM TNI)" },
    { kode: "KEMHAN", nama: "PNS Kemhan & Mabes TNI", matra: "PNS Kemhan", pagu: 1_000_000_000, real: 580_000_000, peserta: 49_320, mak: "511130 (Belanja JKM PNS)" },
    { kode: "POLRI", nama: "Kepolisian Negara RI (POLRI)", matra: "POLRI", pagu: 14_290_000_000, real: 8_340_000_000, peserta: 445_600, mak: "511130 (Belanja JKM Polri)" },
  ];

  const transaksiSP2D_JKM = [
    { noSP2D: "SP2D-JKM/2026/01/01289", tgl: "05 Jan 2026", satker: "POLRI", kppn: "KPPN Jakarta I", nominal: 1_191_428_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/01/01290", tgl: "05 Jan 2026", satker: "TNI Angkatan Darat", kppn: "KPPN Jakarta II", nominal: 520_000_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/01/01291", tgl: "05 Jan 2026", satker: "TNI Angkatan Laut", kppn: "KPPN Jakarta II", nominal: 227_142_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/01/01292", tgl: "05 Jan 2026", satker: "TNI Angkatan Udara", kppn: "KPPN Jakarta II", nominal: 188_571_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/01/01293", tgl: "05 Jan 2026", satker: "PNS Kemhan & Mabes TNI", kppn: "KPPN Jakarta I", nominal: 82_857_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/03/03552", tgl: "06 Mar 2026", satker: "POLRI", kppn: "KPPN Jakarta I", nominal: 1_191_428_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/06/07105", tgl: "05 Jun 2026", satker: "TNI Angkatan Darat", kppn: "KPPN Jakarta II", nominal: 520_000_000, status: "Tuntas Terbit" },
    { noSP2D: "SP2D-JKM/2026/07/08341", tgl: "03 Jul 2026", satker: "POLRI", kppn: "KPPN Jakarta I", nominal: 1_191_428_000, status: "Dalam Proses Pencairan" },
  ];

  // ==========================================
  // DATASET 4: BOP PENSIUN (0,50% DIPA KEMENKEU)
  // ==========================================
  const paguBOPTotal = 28_400_000_000;
  const realisasiBOPTotal = 20_700_000_000;
  const sisaBOPTotal = paguBOPTotal - realisasiBOPTotal;
  const pctBOPUsed = ((realisasiBOPTotal / paguBOPTotal) * 100).toFixed(1);



  // Rekapitulasi BOP Dapem Induk & Susulan per Mitra Bayar
  const rekapBOPMitraList = [
    { no: 1, mitra: "Bank BRI", jenisDapem: "Dapem Induk", periode: "Juli 2026", jmlPenerima: 175200, totalDapem: 150_000_000_000, bop: 750_000_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Induk BRI" },
    { no: 2, mitra: "Bank BRI", jenisDapem: "Dapem Susulan", periode: "Juli 2026", jmlPenerima: 9320, totalDapem: 15_360_000_000, bop: 76_800_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Susulan BRI" },
    { no: 3, mitra: "Bank Mandiri", jenisDapem: "Dapem Induk", periode: "Juli 2026", jmlPenerima: 96400, totalDapem: 82_500_000_000, bop: 412_500_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Induk Mandiri" },
    { no: 4, mitra: "Bank Mandiri", jenisDapem: "Dapem Susulan", periode: "Juli 2026", jmlPenerima: 5080, totalDapem: 8_448_000_000, bop: 42_240_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Susulan Mandiri" },
    { no: 5, mitra: "Bank BNI", jenisDapem: "Dapem Induk", periode: "Juli 2026", jmlPenerima: 65740, totalDapem: 56_250_000_000, bop: 281_250_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Induk BNI" },
    { no: 6, mitra: "Bank BNI", jenisDapem: "Dapem Susulan", periode: "Juli 2026", jmlPenerima: 3460, totalDapem: 5_760_000_000, bop: 28_800_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Susulan BNI" },
    { no: 7, mitra: "Bank BTN", jenisDapem: "Dapem Induk", periode: "Juli 2026", jmlPenerima: 43800, totalDapem: 37_500_000_000, bop: 187_500_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Induk BTN" },
    { no: 8, mitra: "Bank BTN", jenisDapem: "Dapem Susulan", periode: "Juli 2026", jmlPenerima: 2330, totalDapem: 3_840_000_000, bop: 19_200_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Susulan BTN" },
    { no: 9, mitra: "PT Pos Indonesia", jenisDapem: "Dapem Induk", periode: "Juli 2026", jmlPenerima: 35050, totalDapem: 30_000_000_000, bop: 150_000_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Induk Pos" },
    { no: 10, mitra: "PT Pos Indonesia", jenisDapem: "Dapem Susulan", periode: "Juli 2026", jmlPenerima: 1850, totalDapem: 3_072_000_000, bop: 15_360_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Susulan Pos" },
    { no: 11, mitra: "Bank BSI / Lainnya", jenisDapem: "Dapem Induk", periode: "Juli 2026", jmlPenerima: 21900, totalDapem: 18_750_000_000, bop: 93_750_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Induk BSI" },
    { no: 12, mitra: "Bank BSI / Lainnya", jenisDapem: "Dapem Susulan", periode: "Juli 2026", jmlPenerima: 1170, totalDapem: 1_920_000_000, bop: 9_600_000, pctBOP: "0,50%", dasarHitung: "0,50% × Realisasi DAPEM Susulan BSI" },
  ];

  // Rincian BOP per MAK DAPEM
  const rincianBOPMAKList = [
    { no: 1, mak: "513113", namaMAK: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", jmlPenerima: 84150, biayaSatuan: 32500, total: 2_734_875_000, color: "#0141A8" },
    { no: 2, mak: "513114", namaMAK: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", jmlPenerima: 21050, biayaSatuan: 31000, total: 652_550_000, color: "#0891B2" },
    { no: 3, mak: "513122", namaMAK: "PENS TNI (513122)", kelompok: "TNI (AD, AL, AU)", jmlPenerima: 280400, biayaSatuan: 38500, total: 10_795_400_000, color: "#059669" },
    { no: 4, mak: "513123", namaMAK: "PENS POLRI (513123)", kelompok: "POLRI", jmlPenerima: 176400, biayaSatuan: 36945, total: 6_517_175_000, color: "#7C3AED" },
  ];

  // ==========================================
  // DATASET 5: KONSOLIDASI SELURUH PAGU DIPA
  // ==========================================
  const totalPaguKonsolidasi = grandPensiun.pagu + paguJKKTotal + paguJKMTotal + paguBOPTotal; // ~4.226,48 M
  const totalRealKonsolidasi = grandPensiun.real + realisasiJKKTotal + realisasiJKMTotal + realisasiBOPTotal; // ~3.848,38 M
  const totalSisaKonsolidasi = totalPaguKonsolidasi - totalRealKonsolidasi;
  const pctKonsolidasiUsed = ((totalRealKonsolidasi / totalPaguKonsolidasi) * 100).toFixed(1);
  const pctKonsolidasiSisa = ((totalSisaKonsolidasi / totalPaguKonsolidasi) * 100).toFixed(1);

  const pilarDIPAList = [
    {
      id: "pensiun",
      nama: "Belanja Pensiun (DAPEM)",
      deskripsi: "Pembayaran Manfaat Pensiun Pokok, Susulan, Rapel, THR, dan Pensiun ke-13",
      pagu: grandPensiun.pagu,
      real: grandPensiun.real,
      sisa: grandPensiunSisa,
      pct: pctPensiunUsed,
      mak: "513113, 513114, 513122, 513123",
      rekening: "Rekening Penampung DAPEM APBN",
      color: "#0141A8",
      status: isPensiunAlert ? "⚠️ Defisit Runway" : "✅ Aman",
      statusColor: isPensiunAlert ? "#DC2626" : "#059669"
    },
    {
      id: "jkk",
      nama: "Iuran JKK (0,24%)",
      deskripsi: "Iuran Jaminan Kecelakaan Kerja Peserta Aktif TNI, Kemhan, & POLRI",
      pagu: paguJKKTotal,
      real: realisasiJKKTotal,
      sisa: sisaJKKTotal,
      pct: pctJKKUsed,
      mak: "511129 (Belanja Pegawai JKK)",
      rekening: "Rekening Kas Iuran JKK ASABRI",
      color: "#059669",
      status: "✅ Aman (~5 Bulan)",
      statusColor: "#059669"
    },
    {
      id: "jkm",
      nama: "Iuran JKM (0,20%)",
      deskripsi: "Iuran Jaminan Kematian Peserta Aktif TNI, Kemhan, & POLRI",
      pagu: paguJKMTotal,
      real: realisasiJKMTotal,
      sisa: sisaJKMTotal,
      pct: pctJKMUsed,
      mak: "511130 (Belanja Pegawai JKM)",
      rekening: "Rekening Kas Iuran JKM ASABRI",
      color: "#0D9488",
      status: "✅ Aman (~5 Bulan)",
      statusColor: "#0D9488"
    },
    {
      id: "bop",
      nama: "Biaya Operasional (BOP)",
      deskripsi: "Imbal Jasa 0,50% x DAPEM untuk Fee Mitra Bayar & Operasional ASABRI",
      pagu: paguBOPTotal,
      real: realisasiBOPTotal,
      sisa: sisaBOPTotal,
      pct: pctBOPUsed,
      mak: "DIPA BA BUN Kemenkeu",
      rekening: "Rekening Kas Operasional ASABRI",
      color: "#7C3AED",
      status: "✅ Terkendali",
      statusColor: "#7C3AED"
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* HEADER UTAMA DASHBOARD PAGU DIPA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", letterSpacing: -0.3 }}>
              Dashboard Pagu DIPA APBN TA 2026
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: 4 }}>
              Kemenkeu & Mabes TNI/Polri
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 3 }}>
            Monitoring Terpadu Pagu, Realisasi Pencairan SP2D Kemenkeu, dan Pemantauan Sisa Anggaran Multi-Program
          </div>
        </div>

        {/* Global Export Summary */}
        <Btn variant="outline" size="sm" onClick={() => setPreview({
          title: "Ringkasan Eksekutif Konsolidasi DIPA APBN TA 2026",
          subtitle: "Komparasi Pagu, Realisasi SP2D, dan Sisa Anggaran 4 Pilar Program",
          type: "table",
          fileName: "Konsolidasi_Pagu_DIPA_2026.xlsx",
          content: {
            columns: ["Program DIPA", "Akun MAK / Sumber", "Pagu DIPA (Rp)", "Realisasi SP2D (Rp)", "Sisa Pagu (Rp)", "Serapan (%)", "Status Ketahanan"],
            rows: [
              ...pilarDIPAList.map(p => [
                p.nama,
                p.mak,
                fmtRp(p.pagu),
                fmtRp(p.real),
                fmtRp(p.sisa),
                `${p.pct}%`,
                p.status.replace(/[^\w\s(~)]/gi, "").trim()
              ]),
              ["TOTAL KONSOLIDASI", "4 Pilar DIPA", fmtRp(totalPaguKonsolidasi), fmtRp(totalRealKonsolidasi), fmtRp(totalSisaKonsolidasi), `${pctKonsolidasiUsed}%`, isPensiunAlert ? "Perhatian Khusus DAPEM" : "Semua Aman"]
            ],
            totalRows: pilarDIPAList.length + 1
          }
        })}>
          <Download size={13} /> Ekspor Konsolidasi Excel
        </Btn>
      </div>

      {/* TOP-LEVEL 5 PROGRAM TABS */}
      <div style={{
        display: "flex",
        gap: 6,
        background: "#F8FAFC",
        padding: 5,
        borderRadius: 10,
        border: "1px solid #E2E8F0",
        overflowX: "auto"
      }}>
        {[
          { id: "konsolidasi", label: "🌐 Konsolidasi Seluruh Pagu DIPA", badge: "4 Pilar", color: "#1E293B" },
          { id: "pensiun", label: "🎖️ Belanja Pensiun (DAPEM)", badge: `${pctPensiunUsed}%`, color: "#0141A8", alertDot: isPensiunAlert },
          { id: "jkk", label: "🛡️ Iuran JKK (0,24%)", badge: `${pctJKKUsed}%`, color: "#059669" },
          { id: "jkm", label: "🕊️ Iuran JKM (0,20%)", badge: `${pctJKMUsed}%`, color: "#0D9488" },
          { id: "bop", label: "🏢 Biaya Operasional (BOP)", badge: `${pctBOPUsed}%`, color: "#7C3AED" },
        ].map(t => {
          const isActive = activeProgramTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveProgramTab(t.id)}
              style={{
                padding: "9px 15px",
                border: "none",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: isActive ? 800 : 600,
                background: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? t.color : "#64748B",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              }}
            >
              <span>{t.label}</span>
              <span style={{
                background: isActive ? t.color + "14" : "#E2E8F0",
                color: isActive ? t.color : "#475569",
                padding: "1px 7px",
                borderRadius: 10,
                fontSize: 10.5,
                fontWeight: 700
              }}>
                {t.badge}
              </span>
              {t.alertDot && (
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", display: "inline-block" }} title="Peringatan Defisit Aktif" />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PROGRAM 1: KONSOLIDASI SELURUH PAGU DIPA APBN TA 2026 */}
      {/* ========================================================================= */}
      {activeProgramTab === "konsolidasi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* Executive Konsolidasi KPI Summary Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Total Pagu DIPA APBN</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0141A8", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>4 Program DIPA</span>
              </div>
              <div style={{ fontSize: 21, fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(totalPaguKonsolidasi)}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                DAPEM ({fmtM(grandPensiun.pagu)}) + JKK/JKM/BOP ({fmtM(paguJKKTotal + paguJKMTotal + paguBOPTotal)})
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Total Realisasi SP2D</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>{pctKonsolidasiUsed}% Serapan</span>
              </div>
              <div style={{ fontSize: 21, fontWeight: 900, color: "#059669", fontFamily: "monospace" }}>{fmtM(totalRealKonsolidasi)}</div>
              <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pctKonsolidasiUsed}%`, height: "100%", background: "#059669", borderRadius: 4 }} />
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: isPensiunAlert ? "1.5px solid #FECACA" : "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Total Sisa Pagu DIPA</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: isPensiunAlert ? "#DC2626" : "#D97706", background: isPensiunAlert ? "#FEF2F2" : "#FFFBEB", padding: "1px 6px", borderRadius: 4 }}>
                  {pctKonsolidasiSisa}% Sisa Dana
                </span>
              </div>
              <div style={{ fontSize: 21, fontWeight: 900, color: isPensiunAlert ? "#DC2626" : "#0F172A", fontFamily: "monospace" }}>{fmtM(totalSisaKonsolidasi)}</div>
              <div style={{ fontSize: 11, color: isPensiunAlert ? "#DC2626" : "#64748B", marginTop: 4, fontWeight: 600 }}>
                {isPensiunAlert ? "⚠️ Perhatian Khusus: Belanja Pensiun (DAPEM)" : "Cadangan pagu multi-program aman"}
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pencairan SP2D</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>Periode Jan-Jul</span>
              </div>
              <div style={{ fontSize: 21, fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>4 SP2D Kemenkeu</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                DAPEM • Iuran JKK • Iuran JKM • BOP
              </div>
            </div>
          </div>

          {/* Matriks & Rincian 4 Pilar Program DIPA APBN */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                  <Layers size={18} color="#0141A8" />
                  Struktur Pagu & Serapan Realisasi 4 Pilar DIPA APBN TA 2026
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                  Komparasi komprehensif alokasi belanja pensiun, iuran jaminan kerja aktif, dan biaya operasional
                </div>
              </div>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Pilar Program DIPA</th>
                    <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Akun MAK & Sumber Dana</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Pagu APBN (Rp)</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Realisasi SP2D (Rp)</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Sisa Pagu (Rp)</th>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Serapan</th>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Status Ketahanan</th>
                    <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 800 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pilarDIPAList.map((p, idx) => (
                    <tr
                      key={idx}
                      style={{ borderBottom: "1px solid #E2E8F0", background: idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                    >
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 9, height: 9, borderRadius: 2, background: p.color }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800 }}>{p.nama}</div>
                            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>{p.deskripsi}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ fontWeight: 700, color: "#1E293B" }}>{p.mak}</div>
                        <div style={{ fontSize: 10.5, color: "#64748B" }}>{p.rekening}</div>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmtRp(p.pagu)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                        {fmtRp(p.real)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: p.status.includes("Defisit") ? "#DC2626" : "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmtRp(p.sisa)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: p.color }}>{p.pct}%</span>
                          <div style={{ width: 60, height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: `${p.pct}%`, height: "100%", background: p.color }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: p.status.includes("Defisit") ? "#FEF2F2" : "#ECFDF5",
                          color: p.status.includes("Defisit") ? "#DC2626" : "#059669",
                          border: `1px solid ${p.status.includes("Defisit") ? "#FECACA" : "#A7F3D0"}`
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <button
                          onClick={() => setActiveProgramTab(p.id)}
                          style={{
                            background: "#EFF6FF",
                            color: "#1D4ED8",
                            border: "1px solid #BFDBFE",
                            borderRadius: 5,
                            padding: "4px 9px",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          Detail <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr style={{ background: "#E2E8F0", fontWeight: 900 }}>
                    <td style={{ padding: "12px 14px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                      TOTAL KONSOLIDASI SELURUH DIPA
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 11.5, color: "#334155", borderRight: "1px solid #CBD5E1" }}>
                      4 Pilar Anggaran APBN TA 2026
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                      {fmtRp(totalPaguKonsolidasi)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #CBD5E1" }}>
                      {fmtRp(totalRealKonsolidasi)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: isPensiunAlert ? "#DC2626" : "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                      {fmtRp(totalSisaKonsolidasi)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "#0141A8", borderRight: "1px solid #CBD5E1" }}>
                      {pctKonsolidasiUsed}%
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", borderRight: "1px solid #CBD5E1" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: isPensiunAlert ? "#DC2626" : "#059669" }}>
                        {isPensiunAlert ? "⚠️ Perhatian DAPEM" : "✅ Konsolidasi Aman"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontSize: 11, color: "#64748B" }}>
                      Terpadu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Arsitektur Aliran 4 SP2D Kemenkeu Information Banner */}
          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "18px 20px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Info size={16} color="#0141A8" />
              Arsitektur Alur Penerbitan SP2D Kemenkeu ke Rekening Penampung & Kas PT ASABRI (Persero)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 12 }}>
              <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#0141A8", textTransform: "uppercase" }}>1. SP2D Belanja Pensiun (DAPEM)</div>
                <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>
                  Diterbitkan Kemenkeu per bulan (4 MAK 513113, 513114, 513122, 513123) ke <strong>Rekening Penampung DAPEM ASABRI</strong> untuk disalurkan ke mitra bayar bank/pos.
                </div>
              </div>

              <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>2. SP2D Iuran JKK (0,24%)</div>
                <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>
                  Diterbitkan Kemenkeu atas beban DIPA Belanja Pegawai Mabes TNI & Mabes POLRI langsung ke <strong>Kas Program JKK ASABRI</strong> untuk manfaat kecelakaan kerja peserta aktif.
                </div>
              </div>

              <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#0D9488", textTransform: "uppercase" }}>3. SP2D Iuran JKM (0,20%)</div>
                <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>
                  Diterbitkan Kemenkeu atas beban DIPA Belanja Pegawai Mabes TNI & Mabes POLRI langsung ke <strong>Kas Program JKM ASABRI</strong> untuk santunan kematian dinas / tewas.
                </div>
              </div>

              <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase" }}>4. SP2D Tagihan BOP (0,50%)</div>
                <div style={{ fontSize: 11.5, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>
                  Diterbitkan Kemenkeu atas tagihan ASABRI (0,50% x Realisasi DAPEM) via DIPA BA BUN ke <strong>Kas Operasional ASABRI</strong> untuk imbal jasa perbankan & operasional.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRAM 2: BELANJA PENSIUN (DAPEM - 4 MAK) */}
      {/* ========================================================================= */}
      {activeProgramTab === "pensiun" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* CLEAN ENTERPRISE RUNWAY ALERT BANNER */}
          {isPensiunAlert && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderLeft: "4px solid #DC2626",
                borderRadius: 8,
                padding: "12px 16px",
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
                      Peringatan Ketahanan Pagu Belanja Pensiun (DAPEM) TA 2026
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
                    Berdasarkan realisasi terakhir (<strong>{fmtM(lastMonthData.nominal)}</strong>/bln), sisa pagu <strong>{fmtM(grandPensiunSisa)}</strong> diproyeksikan tidak mencukupi kebutuhan <strong>{sisaBulanDalamSetahun} bulan ke depan ({fmtM(thresholdKebutuhanNominal)})</strong> dengan potensi defisit <strong>-{fmtM(defisitEstimasi)}</strong>.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setPensiunSubTab("revisi")}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pagu DAPEM TA 2026</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0141A8", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>DIPA Induk + Rev</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(grandPensiun.pagu)}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Awal: {fmtM(paguAwalPensiun)} • Revisi: <strong style={{ color: "#7C3AED" }}>+{fmtM(revisiPagu)}</strong>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Realisasi DAPEM</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>{pctPensiunUsed}% Serapan</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", fontFamily: "monospace" }}>{fmtM(grandPensiun.real)}</div>
              <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pctPensiunUsed}%`, height: "100%", background: "#059669", borderRadius: 4 }} />
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: isPensiunAlert ? "1.5px solid #FECACA" : "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Sisa Pagu DAPEM</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: isPensiunAlert ? "#DC2626" : "#D97706", background: isPensiunAlert ? "#FEF2F2" : "#FFFBEB", padding: "1px 6px", borderRadius: 4 }}>
                  {isPensiunAlert ? `Kritis (< ${sisaBulanDalamSetahun} Bln)` : `${pctPensiunSisa}% Tersisa`}
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: isPensiunAlert ? "#DC2626" : "#0F172A", fontFamily: "monospace" }}>{fmtM(grandPensiunSisa)}</div>
              <div style={{ fontSize: 11, color: isPensiunAlert ? "#DC2626" : "#64748B", marginTop: 4, fontWeight: 600 }}>
                {isPensiunAlert ? `Threshold ${sisaBulanDalamSetahun} Bln: ${fmtM(thresholdKebutuhanNominal)}` : "Status cadangan dana aman"}
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Rata-rata Realisasi</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>7 Bulan (Jan-Jul)</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(rataRataBulananPensiun)}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Puncak: <strong style={{ color: "#7C3AED" }}>Maret ({fmtM(951_800_000_000)})</strong>
              </div>
            </div>
          </div>

          {/* Sub-Tabs Navigasi Belanja Pensiun */}
          <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${COLORS.gray200}` }}>
            {[
              { id: "realisasi", l: "Sisa Pagu & Pembayaran Bulanan" },
              { id: "revisi", l: "Riwayat Revisi Pagu", c: revisiLog.length },
              { id: "konfigurasi", l: "Pemantauan Alert Otomatis", alertDot: isPensiunAlert },
            ].map(t => (
              <button key={t.id} onClick={() => setPensiunSubTab(t.id)} style={{
                padding: "9px 18px", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, background: "transparent",
                display: "flex", alignItems: "center", gap: 6,
                color: pensiunSubTab === t.id ? COLORS.blue : COLORS.gray500,
                borderBottom: pensiunSubTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                marginBottom: -2
              }}>
                {t.l}
                {t.c ? <span style={{ background: pensiunSubTab === t.id ? "#EFF6FF" : COLORS.gray200, color: pensiunSubTab === t.id ? COLORS.blue : COLORS.gray700, padding: "1px 7px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.c}</span> : null}
                {t.alertDot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", display: "inline-block" }} title="Peringatan Defisit Aktif" />}
              </button>
            ))}
          </div>

          {/* SUB-TAB 1: Sisa Pagu & Pembayaran Bulanan */}
          {pensiunSubTab === "realisasi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* DUAL-PERSPECTIVE ANALYTICS SECTION (64% / 36% GRID) */}
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
                                  {isActive && (
                                    <rect x={slotX + 2} y={padT - 18} width={slotW - 4} height={plotH + 20} fill="#0141A8" opacity="0.07" rx="5" />
                                  )}

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
                                      <text x={slotCenterX} y={currentStackY - 4} fontSize="9" fontWeight="800" fontFamily="monospace" textAnchor="middle" fill="#0F172A">
                                        {b.totalM}M
                                      </text>
                                    </>
                                  )}

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
                        <circle cx="60" cy="60" r="46" fill="transparent" stroke="#059669" strokeWidth="16" strokeDasharray={`${0.500 * 289.02} 289.02`} strokeDashoffset="0" />
                        <circle cx="60" cy="60" r="46" fill="transparent" stroke="#7C3AED" strokeWidth="16" strokeDasharray={`${0.314 * 289.02} 289.02`} strokeDashoffset={`-${0.500 * 289.02}`} />
                        <circle cx="60" cy="60" r="46" fill="transparent" stroke="#0141A8" strokeWidth="16" strokeDasharray={`${0.150 * 289.02} 289.02`} strokeDashoffset={`-${(0.500 + 0.314) * 289.02}`} />
                        <circle cx="60" cy="60" r="46" fill="transparent" stroke="#0891B2" strokeWidth="16" strokeDasharray={`${0.036 * 289.02} 289.02`} strokeDashoffset={`-${(0.500 + 0.314 + 0.150) * 289.02}`} />
                      </svg>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "#64748B" }}>Total Serapan DAPEM:</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>
                          {filterBulan === "Semua" ? fmtM(grandPensiun.real) : fmtM(activeMonthData?.totalNominal || 0)}
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
                        const makThresholdNominal = (m.pagu / (grandPensiun.pagu || 1)) * thresholdKebutuhanNominal;
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
                    <span style={{ color: isPensiunAlert ? "#DC2626" : "#059669", fontWeight: 700 }}>
                      {isPensiunAlert ? "⚠️ Runway Defisit" : "✅ Alokasi Terkendali"}
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
                                      color: isTHR ? "#7C3AED" : isRapel ? "#D97706" : isSusulan ? "#059669" : "#0141A8",
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
                          <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                            <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jenis Dapem</th>
                            <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>513113 (PNS Kemhan)</th>
                            <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>513114 (PNS Polri)</th>
                            <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>513122 (TNI)</th>
                            <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>513123 (Polri)</th>
                            <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800 }}>Total Bulan Ini (Rp)</th>
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

          {/* SUB-TAB 2: Riwayat Revisi Pagu */}
          {pensiunSubTab === "revisi" && (
            <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
              <SectionTitle action={<Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Riwayat Revisi Pagu", subtitle: "Perubahan pagu DIPA TA 2026", type: "table", fileName: "Riwayat_Revisi_Pagu_2026.xlsx", content: { columns: ["No. Revisi", "Tanggal", "Jenis", "Sebelum", "Sesudah", "Selisih"], rows: revisiLog.map(r => [r.no, r.tgl, r.jenis, fmtRp(r.sebelum), fmtRp(r.sesudah), "+" + fmtRp(r.sesudah - r.sebelum)]), totalRows: revisiLog.length } })}>Ekspor</Btn>}>Riwayat Revisi Pagu Belanja Pensiun</SectionTitle>
              <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      {["No. Revisi", "Tanggal", "Jenis Dapem", "Pagu Sebelum", "Pagu Sesudah", "Selisih", "Alasan Revisi"].map((c, i) => (
                        <th key={i} style={{ padding: "11px 14px", textAlign: i >= 3 && i <= 5 ? "right" : "left", fontWeight: 800, color: "#64748B", borderBottom: `1px solid #E2E8F0`, borderRight: i < 6 ? "1px solid #E2E8F0" : "none", whiteSpace: "nowrap" }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{revisiLog.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, color: "#7C3AED", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
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

          {/* SUB-TAB 3: Pemantauan Alert Otomatis Sistem */}
          {pensiunSubTab === "konfigurasi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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

                  <div style={{ background: isPensiunAlert ? "#FEF2F2" : "#ECFDF5", border: isPensiunAlert ? "1px solid #FECACA" : "1px solid #A7F3D0", padding: "6px 14px", borderRadius: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isPensiunAlert ? "#DC2626" : "#059669" }}>
                      {isPensiunAlert ? "⚠️ STATUS: ALERT KRITIS (DEFISIT RUNWAY)" : "✅ STATUS: SISA PAGU AMAN"}
                    </span>
                  </div>
                </div>

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

                  <div style={{ marginTop: 14, background: "#FFFFFF", padding: "10px 14px", borderRadius: 6, border: "1px solid #CBD5E1", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: "#475569" }}>Hasil Bacaan Sistem Saat Ini:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                      Realisasi {lastMonthData.bulan} ({fmtM(lastMonthData.nominal)}) × {sisaBulanDalamSetahun} Bulan Sisa (Agustus s.d. Desember) = Threshold: <strong style={{ color: "#1D4ED8" }}>{fmtM(thresholdKebutuhanNominal)}</strong>
                    </span>
                  </div>

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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
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

                <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                  <SectionTitle>Evaluasi Kecukupan Sisa Pagu</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                      <span style={{ fontSize: 12, color: "#64748B" }}>Sisa Pagu DAPEM Tersedia:</span>
                      <strong style={{ fontSize: 12.5, color: "#0F172A", fontFamily: "monospace" }}>{fmtRp(grandPensiunSisa)}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isPensiunAlert ? "#FEF2F2" : "#ECFDF5", borderRadius: 6 }}>
                      <span style={{ fontSize: 12, color: isPensiunAlert ? "#DC2626" : "#059669", fontWeight: 700 }}>Defisit / Surplus Proyeksi:</span>
                      <strong style={{ fontSize: 12.5, color: isPensiunAlert ? "#DC2626" : "#059669", fontFamily: "monospace" }}>
                        {isPensiunAlert ? `-${fmtRp(defisitEstimasi)} (Defisit)` : `+${fmtRp(grandPensiunSisa - thresholdKebutuhanNominal)} (Surplus)`}
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                      <span style={{ fontSize: 12, color: "#64748B" }}>Ketahanan Sisa Dana (Runway):</span>
                      <strong style={{ fontSize: 12.5, color: isPensiunAlert ? "#DC2626" : "#059669" }}>~{runwayBulan} Bulan</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isPensiunAlert ? "#FFF1F2" : "#F0FDF4", borderRadius: 6, border: isPensiunAlert ? "1px solid #FECDD3" : "1px solid #BBF7D0" }}>
                      <span style={{ fontSize: 12, color: isPensiunAlert ? "#9F1239" : "#166534", fontWeight: 700 }}>Rekomendasi Sistem:</span>
                      <strong style={{ fontSize: 11.5, color: isPensiunAlert ? "#9F1239" : "#166534" }}>
                        {isPensiunAlert ? "Perlu Pengajuan Revisi Tambahan Pagu" : "Alokasi Pagu DAPEM Mencukupi"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRAM 3: IURAN JKK (0,24% APBN) */}
      {/* ========================================================================= */}
      {activeProgramTab === "jkk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* Info Banner JKK */}
          <div style={{
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            borderLeft: "4px solid #059669",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#D1FAE5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#065F46" }}>
                    Program DIPA Iuran Jaminan Kecelakaan Kerja (JKK - 0,24%)
                  </span>
                  <span style={{ background: "#D1FAE5", color: "#059669", padding: "1px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    Tarif 0,24% Gaji Pokok + Tunjangan Keluarga
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#047857", marginTop: 3 }}>
                  Iuran bersumber dari DIPA APBN Belanja Pegawai Satker Kemenkeu/Kemhan/Mabes TNI/POLRI yang diterbitkan via SP2D Kemenkeu langsung ke Kas Program JKK ASABRI.
                </div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "4px 10px", borderRadius: 6, border: "1px solid #A7F3D0", fontSize: 11.5, fontWeight: 700, color: "#059669" }}>
              ✅ Ketahanan Pagu: ~5,0 Bulan (Aman)
            </div>
          </div>

          {/* JKK KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pagu DIPA JKK</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>DIPA TA 2026</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(paguJKKTotal)}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Total 5 Kotama / Satker TNI & POLRI
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Realisasi SP2D JKK</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>{pctJKKUsed}% Serapan</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", fontFamily: "monospace" }}>{fmtM(realisasiJKKTotal)}</div>
              <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pctJKKUsed}%`, height: "100%", background: "#059669", borderRadius: 4 }} />
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Sisa Pagu JKK</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>41,7% Tersisa</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(sisaJKKTotal)}</div>
              <div style={{ fontSize: 11, color: "#059669", marginTop: 4, fontWeight: 600 }}>
                Status: Kecukupan Pagu Terjamin
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Peserta Terlindungi</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#1D4ED8", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>Aktif Berdinas</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>960.080 Jiwa</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                TNI AD, AL, AU, PNS Kemhan & POLRI
              </div>
            </div>
          </div>

          {/* Satker Breakdown Cards */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                  Distribusi Pagu & Realisasi SP2D Iuran JKK per Satker
                </div>
                <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                  Rincian alokasi tarif 0,24% berdasarkan DIPA Belanja Pegawai masing-masing instansi pertahanan & kepolisian
                </div>
              </div>

              {/* Filter Satker */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Filter Satker:</span>
                <select
                  value={filterSatkerJKK}
                  onChange={e => setFilterSatkerJKK(e.target.value)}
                  style={{
                    padding: "5px 10px",
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    fontWeight: 700,
                    color: "#1E293B",
                    cursor: "pointer"
                  }}
                >
                  <option value="Semua">Semua Satker ({satkerJKKList.length})</option>
                  {satkerJKKList.map((s, si) => (
                    <option key={si} value={s.nama}>{s.nama}</option>
                  ))}
                </select>

                <Btn variant="outline" size="sm" onClick={() => setPreview({
                  title: "Rincian Pagu & Realisasi Iuran JKK TA 2026",
                  subtitle: "Distribusi DIPA Belanja Pegawai JKK 0,24% per Satker",
                  type: "table",
                  fileName: "Pagu_Realisasi_JKK_2026.xlsx",
                  content: {
                    columns: ["Kode", "Nama Satker", "Akun MAK", "Jumlah Peserta", "Pagu DIPA (Rp)", "Realisasi SP2D (Rp)", "Sisa Pagu (Rp)", "Serapan (%)"],
                    rows: [
                      ...satkerJKKList.map(s => [
                        s.kode,
                        s.nama,
                        s.mak,
                        s.peserta.toLocaleString("id-ID"),
                        fmtRp(s.pagu),
                        fmtRp(s.real),
                        fmtRp(s.pagu - s.real),
                        `${((s.real / s.pagu) * 100).toFixed(1)}%`
                      ]),
                      ["TOTAL", "Seluruh Satker", "511129", "960.080", fmtRp(paguJKKTotal), fmtRp(realisasiJKKTotal), fmtRp(sisaJKKTotal), `${pctJKKUsed}%`]
                    ],
                    totalRows: satkerJKKList.length + 1
                  }
                })}>
                  <Download size={13} /> Ekspor Excel
                </Btn>
              </div>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nama Satker / Instansi</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Akun MAK APBN</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jumlah Peserta</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Pagu DIPA (Rp)</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Realisasi SP2D (Rp)</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Sisa Pagu (Rp)</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800 }}>Serapan</th>
                  </tr>
                </thead>
                <tbody>
                  {satkerJKKList
                    .filter(s => filterSatkerJKK === "Semua" || s.nama === filterSatkerJKK)
                    .map((s, si) => {
                      const sisa = s.pagu - s.real;
                      const pct = ((s.real / s.pagu) * 100).toFixed(1);
                      return (
                        <tr
                          key={si}
                          style={{ borderBottom: "1px solid #E2E8F0", background: si % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = si % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                        >
                          <td style={{ padding: "11px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <ShieldCheck size={14} color="#059669" />
                              <span>{s.nama}</span>
                            </div>
                          </td>
                          <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                            {s.mak}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {s.peserta.toLocaleString("id-ID")} Jiwa
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(s.pagu)}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(s.real)}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(sisa)}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "2px 7px", borderRadius: 4 }}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Log Transaksi SP2D JKK Terbaru */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={16} color="#059669" />
              Riwayat Penerbitan SP2D Kemenkeu Iuran JKK (Sample Terbaru TA 2026)
            </div>

            <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor SP2D</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal SP2D</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Satker / Pemohon</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>KPPN Penerbit</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nominal Iuran (Rp)</th>
                    <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 800 }}>Status SP2D</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksiSP2D_JKK.map((t, ti) => (
                    <tr key={ti} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 700, color: "#059669", borderRight: "1px solid #E2E8F0" }}>{t.noSP2D}</td>
                      <td style={{ padding: "8px 12px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{t.tgl}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{t.satker}</td>
                      <td style={{ padding: "8px 12px", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{t.kppn}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmtRp(t.nominal)}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: t.status.includes("Tuntas") ? "#ECFDF5" : "#FFFBEB", color: t.status.includes("Tuntas") ? "#059669" : "#D97706" }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRAM 4: IURAN JKM (0,20% APBN) */}
      {/* ========================================================================= */}
      {activeProgramTab === "jkm" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* Info Banner JKM */}
          <div style={{
            background: "#F0FDFA",
            border: "1px solid #99F6E4",
            borderLeft: "4px solid #0D9488",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#CCFBF1", color: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#115E59" }}>
                    Program DIPA Iuran Jaminan Kematian (JKM - 0,20%)
                  </span>
                  <span style={{ background: "#CCFBF1", color: "#0D9488", padding: "1px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    Tarif 0,20% Gaji Pokok + Tunjangan Keluarga
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#0F766E", marginTop: 3 }}>
                  Iuran bersumber dari DIPA APBN Belanja Pegawai Satker Kemenkeu/Kemhan/Mabes TNI/POLRI yang diterbitkan via SP2D Kemenkeu langsung ke Kas Program JKM ASABRI.
                </div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "4px 10px", borderRadius: 6, border: "1px solid #99F6E4", fontSize: 11.5, fontWeight: 700, color: "#0D9488" }}>
              ✅ Ketahanan Pagu: ~5,0 Bulan (Aman)
            </div>
          </div>

          {/* JKM KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pagu DIPA JKM</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0D9488", background: "#F0FDFA", padding: "1px 6px", borderRadius: 4 }}>DIPA TA 2026</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(paguJKMTotal)}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Total 5 Kotama / Satker TNI & POLRI
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Realisasi SP2D JKM</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#0D9488", background: "#F0FDFA", padding: "1px 6px", borderRadius: 4 }}>{pctJKMUsed}% Serapan</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0D9488", fontFamily: "monospace" }}>{fmtM(realisasiJKMTotal)}</div>
              <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pctJKMUsed}%`, height: "100%", background: "#0D9488", borderRadius: 4 }} />
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Sisa Pagu JKM</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#0D9488", background: "#F0FDFA", padding: "1px 6px", borderRadius: 4 }}>41,7% Tersisa</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(sisaJKMTotal)}</div>
              <div style={{ fontSize: 11, color: "#0D9488", marginTop: 4, fontWeight: 600 }}>
                Status: Kecukupan Pagu Terjamin
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Peserta Terlindungi</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#1D4ED8", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>Aktif Berdinas</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>960.080 Jiwa</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Santunan Kematian & Gugur Tugas
              </div>
            </div>
          </div>

          {/* Satker Breakdown Cards */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                  Distribusi Pagu & Realisasi SP2D Iuran JKM per Satker
                </div>
                <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                  Rincian alokasi tarif 0,20% berdasarkan DIPA Belanja Pegawai masing-masing instansi pertahanan & kepolisian
                </div>
              </div>

              {/* Filter Satker */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Filter Satker:</span>
                <select
                  value={filterSatkerJKM}
                  onChange={e => setFilterSatkerJKM(e.target.value)}
                  style={{
                    padding: "5px 10px",
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    fontWeight: 700,
                    color: "#1E293B",
                    cursor: "pointer"
                  }}
                >
                  <option value="Semua">Semua Satker ({satkerJKMList.length})</option>
                  {satkerJKMList.map((s, si) => (
                    <option key={si} value={s.nama}>{s.nama}</option>
                  ))}
                </select>

                <Btn variant="outline" size="sm" onClick={() => setPreview({
                  title: "Rincian Pagu & Realisasi Iuran JKM TA 2026",
                  subtitle: "Distribusi DIPA Belanja Pegawai JKM 0,20% per Satker",
                  type: "table",
                  fileName: "Pagu_Realisasi_JKM_2026.xlsx",
                  content: {
                    columns: ["Kode", "Nama Satker", "Akun MAK", "Jumlah Peserta", "Pagu DIPA (Rp)", "Realisasi SP2D (Rp)", "Sisa Pagu (Rp)", "Serapan (%)"],
                    rows: [
                      ...satkerJKMList.map(s => [
                        s.kode,
                        s.nama,
                        s.mak,
                        s.peserta.toLocaleString("id-ID"),
                        fmtRp(s.pagu),
                        fmtRp(s.real),
                        fmtRp(s.pagu - s.real),
                        `${((s.real / s.pagu) * 100).toFixed(1)}%`
                      ]),
                      ["TOTAL", "Seluruh Satker", "511130", "960.080", fmtRp(paguJKMTotal), fmtRp(realisasiJKMTotal), fmtRp(sisaJKMTotal), `${pctJKMUsed}%`]
                    ],
                    totalRows: satkerJKMList.length + 1
                  }
                })}>
                  <Download size={13} /> Ekspor Excel
                </Btn>
              </div>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nama Satker / Instansi</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Akun MAK APBN</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jumlah Peserta</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Pagu DIPA (Rp)</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Realisasi SP2D (Rp)</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Sisa Pagu (Rp)</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800 }}>Serapan</th>
                  </tr>
                </thead>
                <tbody>
                  {satkerJKMList
                    .filter(s => filterSatkerJKM === "Semua" || s.nama === filterSatkerJKM)
                    .map((s, si) => {
                      const sisa = s.pagu - s.real;
                      const pct = ((s.real / s.pagu) * 100).toFixed(1);
                      return (
                        <tr
                          key={si}
                          style={{ borderBottom: "1px solid #E2E8F0", background: si % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = si % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                        >
                          <td style={{ padding: "11px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <ShieldCheck size={14} color="#0D9488" />
                              <span>{s.nama}</span>
                            </div>
                          </td>
                          <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                            {s.mak}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {s.peserta.toLocaleString("id-ID")} Jiwa
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(s.pagu)}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0D9488", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(s.real)}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(sisa)}
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#0D9488", background: "#F0FDFA", padding: "2px 7px", borderRadius: 4 }}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Log Transaksi SP2D JKM Terbaru */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={16} color="#0D9488" />
              Riwayat Penerbitan SP2D Kemenkeu Iuran JKM (Sample Terbaru TA 2026)
            </div>

            <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor SP2D</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal SP2D</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Satker / Pemohon</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>KPPN Penerbit</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nominal Iuran (Rp)</th>
                    <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 800 }}>Status SP2D</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksiSP2D_JKM.map((t, ti) => (
                    <tr key={ti} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 700, color: "#0D9488", borderRight: "1px solid #E2E8F0" }}>{t.noSP2D}</td>
                      <td style={{ padding: "8px 12px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{t.tgl}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{t.satker}</td>
                      <td style={{ padding: "8px 12px", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{t.kppn}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmtRp(t.nominal)}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: t.status.includes("Tuntas") ? "#F0FDFA" : "#FFFBEB", color: t.status.includes("Tuntas") ? "#0D9488" : "#D97706" }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRAM 5: BIAYA OPERASIONAL PENYELENGGARAAN (BOP - 0,50% DIPA KEMENKEU) */}
      {/* ========================================================================= */}
      {activeProgramTab === "bop" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* Info Banner BOP */}
          <div style={{
            background: "#FAF5FF",
            border: "1px solid #E9D5FF",
            borderLeft: "4px solid #7C3AED",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#F3E8FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Building2 size={16} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#581C87" }}>
                    Program DIPA Biaya Operasional Penyelenggaraan (BOP Pensiun — 0,50%)
                  </span>
                  <span style={{ background: "#F3E8FF", color: "#7C3AED", padding: "1px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    Tarif 0,50% x Realisasi Pencairan DAPEM
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6B21A8", marginTop: 3, lineHeight: 1.5 }}>
                  BOP Pensiun bersumber dari <strong>DIPA BA BUN Kemenkeu</strong> yang diterbitkan via SP2D Kemenkeu ke <strong>Kas Operasional ASABRI (di luar Rekening DAPEM)</strong> untuk membiayai fee mitra bayar perbankan/pos & operasional pelayanan pensiun.
                </div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "4px 10px", borderRadius: 6, border: "1px solid #E9D5FF", fontSize: 11.5, fontWeight: 700, color: "#7C3AED" }}>
              ✅ Serapan BOP: {pctBOPUsed}% (Terkendali)
            </div>
          </div>

          {/* BOP KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pagu DIPA BOP</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#7C3AED", background: "#FAF5FF", padding: "1px 6px", borderRadius: 4 }}>DIPA BA BUN</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(paguBOPTotal)}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Alokasi Pagu Kemenkeu TA 2026
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Realisasi SP2D BOP</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", background: "#FAF5FF", padding: "1px 6px", borderRadius: 4 }}>{pctBOPUsed}% Serapan</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#7C3AED", fontFamily: "monospace" }}>{fmtM(realisasiBOPTotal)}</div>
              <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${pctBOPUsed}%`, height: "100%", background: "#7C3AED", borderRadius: 4 }} />
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Sisa Pagu BOP</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", background: "#FAF5FF", padding: "1px 6px", borderRadius: 4 }}>27,1% Tersisa</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(sisaBOPTotal)}</div>
              <div style={{ fontSize: 11, color: "#7C3AED", marginTop: 4, fontWeight: 600 }}>
                Status: Kecukupan Pagu Terjamin
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Dasar Perhitungan</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>Tarif Tetap</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", fontFamily: "monospace" }}>0,50% DAPEM</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                DIPA BA BUN Kemenkeu
              </div>
            </div>
          </div>

          {/* TABEL 1: REKAPITULASI BOP DAPEM INDUK & SUSULAN PER MITRA BAYAR */}
          {(() => {
            const filteredRekapMitra = rekapBOPMitraList.filter(item => {
              const matchJenis = filterJenisDapemBOP === "Semua" || item.jenisDapem === filterJenisDapemBOP;
              const matchBulan = filterBulanBOP === "Semua Bulan" || item.periode === filterBulanBOP;
              return matchJenis && matchBulan;
            });

            const totPenerimaRekap = filteredRekapMitra.reduce((a, b) => a + b.jmlPenerima, 0);
            const totDapemRekap = filteredRekapMitra.reduce((a, b) => a + b.totalDapem, 0);
            const totBOPRekap = filteredRekapMitra.reduce((a, b) => a + b.bop, 0);

            return (
              <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                      <Wallet size={18} color="#7C3AED" />
                      Rekapitulasi Biaya Operasional Penyelenggaraan (BOP) Dapem Induk & Susulan per Mitra Bayar
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                      Rekapitulasi nominal DAPEM tersalurkan, persentase imbal jasa 0,50%, dan hak BOP masing-masing mitra bayar perbankan/pos
                    </div>
                  </div>

                  {/* Filter Periode, Jenis Dapem, & Export Excel */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Periode:</span>
                      <select
                        value={filterBulanBOP}
                        onChange={e => setFilterBulanBOP(e.target.value)}
                        style={{
                          padding: "5px 10px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          fontWeight: 700,
                          color: "#1E293B",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Juli 2026">Juli 2026 (Bulan Berjalan)</option>
                        <option value="Juni 2026">Juni 2026</option>
                        <option value="Mei 2026">Mei 2026</option>
                        <option value="April 2026">April 2026</option>
                        <option value="Maret 2026">Maret 2026 (THR)</option>
                        <option value="Februari 2026">Februari 2026</option>
                        <option value="Januari 2026">Januari 2026</option>
                        <option value="Semua Bulan">Semua Bulan (Akumulasi)</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Jenis Dapem:</span>
                      <select
                        value={filterJenisDapemBOP}
                        onChange={e => setFilterJenisDapemBOP(e.target.value)}
                        style={{
                          padding: "5px 10px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          fontWeight: 700,
                          color: "#1E293B",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Semua">Semua Jenis ({rekapBOPMitraList.length})</option>
                        <option value="Dapem Induk">Dapem Induk</option>
                        <option value="Dapem Susulan">Dapem Susulan</option>
                      </select>
                    </div>

                    <Btn variant="outline" size="sm" onClick={() => setPreview({
                      title: `Rekapitulasi BOP Dapem Induk & Susulan — ${filterBulanBOP}`,
                      subtitle: `Imbal Jasa Mitra Bayar • Filter Jenis: ${filterJenisDapemBOP}`,
                      type: "table",
                      fileName: `Rekap_BOP_MitraBayar_${filterBulanBOP.replace(/ /g, "_")}.xlsx`,
                      content: {
                        columns: ["No.", "Mitra Bayar", "Jenis Dapem", "Periode", "Jumlah Penerima", "Total Nilai Dapem", "Biaya Operasional (BOP)", "Persentase BOP", "Dasar Perhitungan BOP"],
                        rows: [
                          ...filteredRekapMitra.map((r, ri) => [
                            ri + 1,
                            r.mitra,
                            r.jenisDapem,
                            r.periode,
                            r.jmlPenerima.toLocaleString("id-ID"),
                            fmtRp(r.totalDapem),
                            fmtRp(r.bop),
                            r.pctBOP,
                            r.dasarHitung
                          ]),
                          ["TOTAL", "Seluruh Mitra Bayar", filterJenisDapemBOP, filterBulanBOP, totPenerimaRekap.toLocaleString("id-ID"), fmtRp(totDapemRekap), fmtRp(totBOPRekap), "0,50%", "0,50% x Total Realisasi DAPEM"]
                        ],
                        totalRows: filteredRekapMitra.length + 1
                      }
                    })}>
                      <Download size={13} /> Ekspor Rekap Excel
                    </Btn>
                  </div>
                </div>

                {/* Tabel Rekapitulasi Data */}
                <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, width: 45, borderRight: "1px solid #E2E8F0" }}>No.</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Mitra Bayar</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jenis Dapem</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Periode</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jumlah Penerima</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Total Nilai Dapem (Rp)</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Biaya Operasional (BOP) (Rp)</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Persentase BOP</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800 }}>Dasar Perhitungan BOP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRekapMitra.map((r, ri) => (
                        <tr
                          key={ri}
                          style={{ borderBottom: "1px solid #E2E8F0", background: ri % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = ri % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                        >
                          <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                            {ri + 1}
                          </td>
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            {r.mitra}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                            <span style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: 4,
                              background: r.jenisDapem.includes("Induk") ? "#EFF6FF" : "#ECFDF5",
                              color: r.jenisDapem.includes("Induk") ? "#0141A8" : "#059669",
                              border: `1px solid ${r.jenisDapem.includes("Induk") ? "#BFDBFE" : "#A7F3D0"}`
                            }}>
                              {r.jenisDapem}
                            </span>
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "center", color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                            {r.periode}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            {r.jmlPenerima.toLocaleString("id-ID")}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(r.totalDapem)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(r.bop)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 800, color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>
                            {r.pctBOP}
                          </td>
                          <td style={{ padding: "9px 12px", fontSize: 11, color: "#64748B" }}>
                            {r.dasarHitung}
                          </td>
                        </tr>
                      ))}

                      {/* Baris Total Rekapitulasi */}
                      <tr style={{ background: "#E2E8F0", fontWeight: 900 }}>
                        <td colSpan={4} style={{ padding: "10px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1", textAlign: "left" }}>
                          TOTAL REKAPITULASI BOP ({filterJenisDapemBOP.toUpperCase()})
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {totPenerimaRekap.toLocaleString("id-ID")}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(totDapemRekap)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", fontWeight: 900, borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(totBOPRekap)}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#7C3AED", borderRight: "1px solid #CBD5E1" }}>
                          0,50%
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 11, color: "#334155" }}>
                          0,50% × Realisasi Bersih DAPEM Tersalurkan
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* TABEL 2: RINCIAN BOP PER MAK DAPEM */}
          {(() => {
            const makMetaList = [
              { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", color: "#0141A8", jmlIndukBln: 65200, jmlSusulanBln: 3650, jmlIndukAkum: 79200, jmlSusulanAkum: 4950 },
              { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", color: "#0891B2", jmlIndukBln: 16300, jmlSusulanBln: 880, jmlIndukAkum: 19800, jmlSusulanAkum: 1250 },
              { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI (AD, AL, AU)", color: "#059669", jmlIndukBln: 218400, jmlSusulanBln: 11850, jmlIndukAkum: 265000, jmlSusulanAkum: 15400 },
              { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", color: "#7C3AED", jmlIndukBln: 138190, jmlSusulanBln: 6830, jmlIndukAkum: 166000, jmlSusulanAkum: 10400 },
            ];

            const isAkumulasi = filterBulanMAK_BOP === "Semua Bulan";
            const selectedMonthObj = !isAkumulasi ? (pembayaranBulanan.find(b => b.bulan === filterBulanMAK_BOP) || pembayaranBulanan[6]) : null;

            const computedMAKRows = makMetaList.map((m, mi) => {
              let dapemNominal = 0;
              let jmlPenerima = 0;

              if (isAkumulasi) {
                pembayaranBulanan.forEach(b => {
                  const induk = b.breakdownJenis.find(j => j.jenis.includes("Induk"));
                  const susulan = b.breakdownJenis.find(j => j.jenis.includes("Susulan"));

                  if (filterTipeMAK_BOP === "Dapem Induk") {
                    dapemNominal += (induk?.mak[m.kode] || 0);
                  } else if (filterTipeMAK_BOP === "Dapem Susulan") {
                    dapemNominal += (susulan?.mak[m.kode] || 0);
                  } else {
                    dapemNominal += (induk?.mak[m.kode] || 0) + (susulan?.mak[m.kode] || 0);
                  }
                });

                if (filterTipeMAK_BOP === "Dapem Induk") {
                  jmlPenerima = m.jmlIndukAkum;
                } else if (filterTipeMAK_BOP === "Dapem Susulan") {
                  jmlPenerima = m.jmlSusulanAkum;
                } else {
                  jmlPenerima = m.jmlIndukAkum + m.jmlSusulanAkum;
                }
              } else {
                const induk = selectedMonthObj?.breakdownJenis.find(j => j.jenis.includes("Induk"));
                const susulan = selectedMonthObj?.breakdownJenis.find(j => j.jenis.includes("Susulan"));

                if (filterTipeMAK_BOP === "Dapem Induk") {
                  dapemNominal = induk?.mak[m.kode] || 0;
                  jmlPenerima = m.jmlIndukBln;
                } else if (filterTipeMAK_BOP === "Dapem Susulan") {
                  dapemNominal = susulan?.mak[m.kode] || 0;
                  jmlPenerima = m.jmlSusulanBln;
                } else {
                  dapemNominal = (induk?.mak[m.kode] || 0) + (susulan?.mak[m.kode] || 0);
                  jmlPenerima = m.jmlIndukBln + m.jmlSusulanBln;
                }
              }

              const totalBOP = Math.round(dapemNominal * 0.005); // 0.50% dari Dapem
              const biayaSatuan = jmlPenerima > 0 ? Math.round(totalBOP / jmlPenerima) : 0;

              return {
                no: mi + 1,
                kode: m.kode,
                uraian: m.uraian,
                color: m.color,
                jmlPenerima,
                biayaSatuan,
                total: totalBOP,
                dapemNominal
              };
            });

            const totPenerimaMAK = computedMAKRows.reduce((a, b) => a + b.jmlPenerima, 0);
            const totBOPMAK = computedMAKRows.reduce((a, b) => a + b.total, 0);
            const avgBiayaSatuan = totPenerimaMAK > 0 ? Math.round(totBOPMAK / totPenerimaMAK) : 0;

            return (
              <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 22px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                      <Layers size={18} color="#0141A8" />
                      Rincian Biaya Operasional Penyelenggaraan (BOP) per MAK DAPEM
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                      Distribusi alokasi BOP berdasarkan Mata Anggaran Keluaran (4 MAK Pensiun Kemenkeu) beserta biaya satuan operasional per penerima
                    </div>
                  </div>

                  {/* Filter Periode, Tipe Dapem, & Export Excel */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Periode:</span>
                      <select
                        value={filterBulanMAK_BOP}
                        onChange={e => setFilterBulanMAK_BOP(e.target.value)}
                        style={{
                          padding: "5px 10px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          fontWeight: 700,
                          color: "#1E293B",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Juli 2026">Juli 2026 (Bulan Berjalan)</option>
                        <option value="Juni 2026">Juni 2026</option>
                        <option value="Mei 2026">Mei 2026</option>
                        <option value="April 2026">April 2026</option>
                        <option value="Maret 2026">Maret 2026 (THR)</option>
                        <option value="Februari 2026">Februari 2026</option>
                        <option value="Januari 2026">Januari 2026</option>
                        <option value="Semua Bulan">Semua Bulan (Akumulasi Jan-Jul)</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Tipe Dapem:</span>
                      <select
                        value={filterTipeMAK_BOP}
                        onChange={e => setFilterTipeMAK_BOP(e.target.value)}
                        style={{
                          padding: "5px 10px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          fontWeight: 700,
                          color: "#1E293B",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Semua">Semua (Total Induk + Susulan)</option>
                        <option value="Dapem Induk">Dapem Induk</option>
                        <option value="Dapem Susulan">Dapem Susulan</option>
                      </select>
                    </div>

                    <Btn variant="outline" size="sm" onClick={() => setPreview({
                      title: `Rincian BOP per MAK DAPEM — ${filterBulanMAK_BOP}`,
                      subtitle: `Tipe: ${filterTipeMAK_BOP === "Semua" ? "Total Induk + Susulan" : filterTipeMAK_BOP} • Alokasi 4 MAK Pensiun`,
                      type: "table",
                      fileName: `Rincian_BOP_MAK_${filterBulanMAK_BOP.replace(/ /g, "_")}_${filterTipeMAK_BOP.replace(/ /g, "_")}.xlsx`,
                      content: {
                        columns: ["No", "MAK", "Jumlah Penerima pensiun", "Biaya satuan", "Total"],
                        rows: [
                          ...computedMAKRows.map(m => [
                            m.no,
                            m.uraian,
                            m.jmlPenerima.toLocaleString("id-ID"),
                            fmtRp(m.biayaSatuan),
                            fmtRp(m.total)
                          ]),
                          ["TOTAL", `4 MAK DAPEM (${filterTipeMAK_BOP})`, totPenerimaMAK.toLocaleString("id-ID"), fmtRp(avgBiayaSatuan) + " (Rata-rata)", fmtRp(totBOPMAK)]
                        ],
                        totalRows: computedMAKRows.length + 1
                      }
                    })}>
                      <Download size={13} /> Ekspor Rincian MAK (.xlsx)
                    </Btn>
                  </div>
                </div>

                {/* Tabel Format Kolom Sesuai Permintaan Pengguna */}
                <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                        <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, width: 50, borderRight: "1px solid #E2E8F0" }}>No</th>
                        <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>MAK</th>
                        <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jumlah Penerima pensiun</th>
                        <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Biaya satuan (Rp)</th>
                        <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800 }}>Total (Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {computedMAKRows.map((m, mi) => (
                        <tr
                          key={mi}
                          style={{ borderBottom: "1px solid #E2E8F0", background: mi % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = mi % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                        >
                          <td style={{ padding: "11px 14px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                            {m.no}
                          </td>
                          <td style={{ padding: "11px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: 2, background: m.color }} />
                              <div>
                                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>MAK {m.kode}</span>
                                <span style={{ fontSize: 11, color: "#64748B", marginLeft: 6 }}>({m.uraian})</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {m.jmlPenerima.toLocaleString("id-ID")} Orang
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0141A8", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(m.biayaSatuan)} / pensiunan
                          </td>
                          <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#059669" }}>
                            {fmtRp(m.total)}
                          </td>
                        </tr>
                      ))}

                      {/* Baris Total Rincian MAK */}
                      <tr style={{ background: "#E2E8F0", fontWeight: 900 }}>
                        <td style={{ padding: "11px 14px", textAlign: "center", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                          -
                        </td>
                        <td style={{ padding: "11px 14px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                          TOTAL SELURUH MAK DAPEM ({filterTipeMAK_BOP.toUpperCase()})
                        </td>
                        <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {totPenerimaMAK.toLocaleString("id-ID")} Orang
                        </td>
                        <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#0141A8", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(avgBiayaSatuan)} (Rata-rata)
                        </td>
                        <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#059669", fontWeight: 900 }}>
                          {fmtRp(totBOPMAK)}
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
    </div>
  );
};
