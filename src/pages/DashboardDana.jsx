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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  CalendarRange,
  LineChart as LineChartIcon
} from "lucide-react";
import { COLORS, LINE_COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Badge, Select, SearchInput, Btn, NoData, PreviewModal, Tooltip } from "../components/common";

export const DashboardDana = () => {
  const [selectedMitraView, setSelectedMitraView] = useState("Semua Mitra (Konsolidasi)");
  const [selectedPeriodeSP, setSelectedPeriodeSP] = useState("Juli 2026 (Bulan Berjalan)");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-15");
  const [selectedProgramView, setSelectedProgramView] = useState("Semua Program (Konsolidasi)");
  const [panel1ProgramFilter, setPanel1ProgramFilter] = useState("Semua Program (Konsolidasi)");
  const [preview, setPreview] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [proyeksiChartType, setProyeksiChartType] = useState("line"); // "line" | "bar"
  const [hoveredP1Bar, setHoveredP1Bar] = useState(null);
  const [hoveredProyeksiPoint, setHoveredProyeksiPoint] = useState(null);

  const programOptions = [
    "Semua Program (Konsolidasi)",
    "THT (Tabungan Hari Tua)",
    "JKK (Jaminan Kecelakaan Kerja)",
    "JKm (Jaminan Kematian)",
  ];

  const bulanOptions = [
    "Juli 2026",
    "Agustus 2026",
    "September 2026",
    "Oktober 2026",
    "November 2026",
    "Desember 2026",
  ];

  const monthNamesIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const shortMonthNamesIndo = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];

  const formatIndoDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return `${String(day).padStart(2, '0')} ${monthNamesIndo[month] || ""} ${year}`;
  };

  const getDatesInRange = (startStr, endStr) => {
    if (!startStr || !endStr) return [];
    let start = new Date(startStr);
    let end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    const dates = [];
    const curr = new Date(start);
    while (curr <= end) {
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      const d = String(curr.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${d}`);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // Profil bobot distribusi pengeluaran harian dana manfaat dalam sebulan (Tgl 1 - 31)
  const baseDailyWeights = [
    0.12, 0.10, 0.09, 0.08, 0.06, // Tgl 1 - 5 (Puncak Siklus Pensiun & THT Awal Bulan: 45%)
    0.05, 0.04, 0.04, 0.04, 0.03, // Tgl 6 - 10 (Tahap Susulan & Verifikasi: 20%)
    0.025, 0.022, 0.020, 0.018, 0.025, // Tgl 11 - 15 (Klaim Reguler & Cut-off Tahap 1: 11%)
    0.018, 0.016, 0.015, 0.015, 0.016, // Tgl 16 - 20 (Reguler Pertengahan Bulan: 8%)
    0.012, 0.012, 0.012, 0.014, 0.035, // Tgl 21 - 25 (Klaim Akhir Bulan & Batch SP 2: 8.5%)
    0.015, 0.015, 0.013, 0.012, 0.010, 0.010 // Tgl 26 - 31 (Penutupan Bulan: 7.5%)
  ];

  const getDailyWeights = (totalDays) => {
    const slice = baseDailyWeights.slice(0, totalDays);
    const sum = slice.reduce((a, b) => a + b, 0);
    return slice.map(w => w / sum);
  };

  // Mapping data proyeksi mingguan per bulan untuk konsolidasi dan masing-masing mitra bayar
  const weeklyProjectionsByMonth = {
    "Juli 2026": {
      konsolidasi: [145, 235, 340, 155],
      "MTR-01": [16, 26, 40, 18],
      "MTR-02": [14, 22, 33, 15],
      "MTR-03": [11, 17, 26, 13],
      "MTR-04": [26, 39, 56, 25],
      "MTR-05": [7, 11, 16, 7],
      "MTR-06": [10, 16, 24, 11],
      "MTR-07": [5, 9, 13, 6],
      "MTR-08": [11, 18, 26, 12],
      "MTR-09": [3, 5, 8, 4],
      "MTR-10": [6, 10, 15, 7],
      "MTR-11": [4, 6, 9, 5],
      "MTR-12": [5, 8, 12, 6],
    },
    "Agustus 2026": {
      konsolidasi: [185, 295, 425, 195],
      "MTR-01": [21, 34, 52, 23],
      "MTR-02": [18, 28, 42, 19],
      "MTR-03": [14, 22, 33, 16],
      "MTR-04": [33, 49, 71, 31],
      "MTR-05": [9, 14, 20, 9],
      "MTR-06": [13, 20, 30, 14],
      "MTR-07": [7, 11, 16, 8],
      "MTR-08": [14, 23, 33, 15],
      "MTR-09": [4, 7, 10, 5],
      "MTR-10": [8, 13, 19, 9],
      "MTR-11": [5, 8, 11, 6],
      "MTR-12": [6, 10, 15, 7],
    },
    "September 2026": {
      konsolidasi: [230, 365, 530, 245],
      "MTR-01": [26, 42, 64, 29],
      "MTR-02": [23, 35, 52, 24],
      "MTR-03": [18, 28, 41, 20],
      "MTR-04": [41, 61, 89, 39],
      "MTR-05": [11, 17, 25, 11],
      "MTR-06": [16, 25, 38, 17],
      "MTR-07": [9, 14, 20, 10],
      "MTR-08": [17, 28, 41, 19],
      "MTR-09": [5, 9, 13, 6],
      "MTR-10": [10, 16, 24, 11],
      "MTR-11": [6, 10, 14, 7],
      "MTR-12": [7, 12, 18, 9],
    },
    "Oktober 2026": {
      konsolidasi: [155, 250, 360, 165],
      "MTR-01": [18, 29, 43, 20],
      "MTR-02": [15, 24, 35, 16],
      "MTR-03": [12, 19, 28, 14],
      "MTR-04": [28, 41, 60, 27],
      "MTR-05": [8, 12, 17, 8],
      "MTR-06": [11, 17, 26, 12],
      "MTR-07": [6, 10, 14, 7],
      "MTR-08": [12, 19, 28, 13],
      "MTR-09": [4, 6, 9, 4],
      "MTR-10": [7, 11, 16, 8],
      "MTR-11": [4, 7, 10, 5],
      "MTR-12": [5, 9, 13, 6],
    },
    "November 2026": {
      konsolidasi: [130, 210, 305, 140],
      "MTR-01": [15, 24, 36, 17],
      "MTR-02": [13, 20, 30, 14],
      "MTR-03": [10, 16, 24, 12],
      "MTR-04": [24, 35, 51, 23],
      "MTR-05": [7, 10, 15, 7],
      "MTR-06": [9, 15, 22, 10],
      "MTR-07": [5, 8, 12, 6],
      "MTR-08": [10, 16, 24, 11],
      "MTR-09": [3, 5, 8, 4],
      "MTR-10": [6, 9, 14, 7],
      "MTR-11": [3, 6, 8, 4],
      "MTR-12": [4, 8, 11, 5],
    },
    "Desember 2026": {
      konsolidasi: [115, 185, 265, 125],
      "MTR-01": [13, 21, 32, 15],
      "MTR-02": [11, 18, 26, 12],
      "MTR-03": [9, 14, 21, 10],
      "MTR-04": [21, 31, 45, 20],
      "MTR-05": [6, 9, 13, 6],
      "MTR-06": [8, 13, 19, 9],
      "MTR-07": [4, 7, 10, 5],
      "MTR-08": [9, 14, 21, 10],
      "MTR-09": [3, 4, 7, 3],
      "MTR-10": [5, 8, 12, 6],
      "MTR-11": [3, 5, 7, 4],
      "MTR-12": [4, 7, 10, 5],
    },
  };

  // Mapping Realisasi SP per Periode untuk 12 Mitra Bayar
  const spPeriodMap = {
    "Juli 2026 (Bulan Berjalan)": {
      "MTR-01": { spTotal: 480, spRealisasi: 465, nominalRealisasi: 105.2 },
      "MTR-02": { spTotal: 410, spRealisasi: 395, nominalRealisasi: 86.8 },
      "MTR-03": { spTotal: 320, spRealisasi: 304, nominalRealisasi: 71.5 },
      "MTR-04": { spTotal: 270, spRealisasi: 246, nominalRealisasi: 146.0 },
      "MTR-05": { spTotal: 160, spRealisasi: 155, nominalRealisasi: 43.5 },
      "MTR-06": { spTotal: 240, spRealisasi: 232, nominalRealisasi: 62.4 },
      "MTR-07": { spTotal: 130, spRealisasi: 124, nominalRealisasi: 33.8 },
      "MTR-08": { spTotal: 195, spRealisasi: 168, nominalRealisasi: 58.5 },
      "MTR-09": { spTotal: 85, spRealisasi: 81, nominalRealisasi: 19.2 },
      "MTR-10": { spTotal: 155, spRealisasi: 148, nominalRealisasi: 38.6 },
      "MTR-11": { spTotal: 105, spRealisasi: 100, nominalRealisasi: 24.2 },
      "MTR-12": { spTotal: 125, spRealisasi: 120, nominalRealisasi: 29.5 },
    },
    "Juni 2026": {
      "MTR-01": { spTotal: 465, spRealisasi: 458, nominalRealisasi: 101.8 },
      "MTR-02": { spTotal: 398, spRealisasi: 390, nominalRealisasi: 85.0 },
      "MTR-03": { spTotal: 310, spRealisasi: 301, nominalRealisasi: 69.4 },
      "MTR-04": { spTotal: 255, spRealisasi: 238, nominalRealisasi: 140.0 },
      "MTR-05": { spTotal: 155, spRealisasi: 150, nominalRealisasi: 41.2 },
      "MTR-06": { spTotal: 230, spRealisasi: 224, nominalRealisasi: 60.0 },
      "MTR-07": { spTotal: 125, spRealisasi: 120, nominalRealisasi: 32.5 },
      "MTR-08": { spTotal: 185, spRealisasi: 162, nominalRealisasi: 55.0 },
      "MTR-09": { spTotal: 80, spRealisasi: 78, nominalRealisasi: 18.5 },
      "MTR-10": { spTotal: 148, spRealisasi: 142, nominalRealisasi: 36.8 },
      "MTR-11": { spTotal: 100, spRealisasi: 96, nominalRealisasi: 23.0 },
      "MTR-12": { spTotal: 118, spRealisasi: 114, nominalRealisasi: 28.0 },
    },
    "Mei 2026": {
      "MTR-01": { spTotal: 450, spRealisasi: 442, nominalRealisasi: 98.5 },
      "MTR-02": { spTotal: 385, spRealisasi: 378, nominalRealisasi: 82.0 },
      "MTR-03": { spTotal: 295, spRealisasi: 288, nominalRealisasi: 66.8 },
      "MTR-04": { spTotal: 240, spRealisasi: 225, nominalRealisasi: 132.5 },
      "MTR-05": { spTotal: 148, spRealisasi: 144, nominalRealisasi: 39.5 },
      "MTR-06": { spTotal: 220, spRealisasi: 215, nominalRealisasi: 58.0 },
      "MTR-07": { spTotal: 120, spRealisasi: 115, nominalRealisasi: 31.0 },
      "MTR-08": { spTotal: 178, spRealisasi: 155, nominalRealisasi: 52.4 },
      "MTR-09": { spTotal: 75, spRealisasi: 73, nominalRealisasi: 17.5 },
      "MTR-10": { spTotal: 140, spRealisasi: 135, nominalRealisasi: 35.0 },
      "MTR-11": { spTotal: 95, spRealisasi: 91, nominalRealisasi: 21.8 },
      "MTR-12": { spTotal: 112, spRealisasi: 108, nominalRealisasi: 26.5 },
    },
    "Triwulan II 2026": {
      "MTR-01": { spTotal: 1380, spRealisasi: 1352, nominalRealisasi: 304.5 },
      "MTR-02": { spTotal: 1185, spRealisasi: 1155, nominalRealisasi: 252.0 },
      "MTR-03": { spTotal: 915, spRealisasi: 888, nominalRealisasi: 206.5 },
      "MTR-04": { spTotal: 745, spRealisasi: 698, nominalRealisasi: 412.0 },
      "MTR-05": { spTotal: 460, spRealisasi: 446, nominalRealisasi: 123.0 },
      "MTR-06": { spTotal: 685, spRealisasi: 668, nominalRealisasi: 179.5 },
      "MTR-07": { spTotal: 372, spRealisasi: 357, nominalRealisasi: 96.5 },
      "MTR-08": { spTotal: 550, spRealisasi: 482, nominalRealisasi: 164.0 },
      "MTR-09": { spTotal: 238, spRealisasi: 230, nominalRealisasi: 54.8 },
      "MTR-10": { spTotal: 438, spRealisasi: 421, nominalRealisasi: 109.5 },
      "MTR-11": { spTotal: 298, spRealisasi: 285, nominalRealisasi: 68.4 },
      "MTR-12": { spTotal: 350, spRealisasi: 338, nominalRealisasi: 83.2 },
    },
    "Tahun 2026 (YTD)": {
      "MTR-01": { spTotal: 3240, spRealisasi: 3165, nominalRealisasi: 712.5 },
      "MTR-02": { spTotal: 2760, spRealisasi: 2685, nominalRealisasi: 588.0 },
      "MTR-03": { spTotal: 2140, spRealisasi: 2072, nominalRealisasi: 482.0 },
      "MTR-04": { spTotal: 1750, spRealisasi: 1635, nominalRealisasi: 965.0 },
      "MTR-05": { spTotal: 1070, spRealisasi: 1038, nominalRealisasi: 288.0 },
      "MTR-06": { spTotal: 1610, spRealisasi: 1568, nominalRealisasi: 420.0 },
      "MTR-07": { spTotal: 870, spRealisasi: 836, nominalRealisasi: 226.0 },
      "MTR-08": { spTotal: 1290, spRealisasi: 1130, nominalRealisasi: 385.0 },
      "MTR-09": { spTotal: 560, spRealisasi: 540, nominalRealisasi: 128.0 },
      "MTR-10": { spTotal: 1025, spRealisasi: 985, nominalRealisasi: 256.0 },
      "MTR-11": { spTotal: 695, spRealisasi: 665, nominalRealisasi: 160.0 },
      "MTR-12": { spTotal: 820, spRealisasi: 792, nominalRealisasi: 194.5 },
    },
  };

  // Data 12 Mitra Bayar Real-time (Alokasi Saldo per Program THT, JKK, JKm & Kebutuhan SP)
  const initialMitraData = [
    {
      id: "MTR-01",
      mitra: "Bank Mandiri",
      shortName: "Bank Mandiri",
      noRekening: "124.00.0988776.2",
      manfaat: "THT, JKK, JKm",
      saldo: 750,
      kebutuhanProx: 110,
      saldoProgram: { THT: 510, JKK: 140, JKm: 100 },
      kebutuhanProgram: { THT: 75, JKK: 21, JKm: 14 },
      proyeksiBulanProgram: {
        THT: [58, 75, 98, 65, 54, 48],
        JKK: [15, 20, 26, 18, 15, 13],
        JKm: [11, 15, 19, 12, 10, 9],
      },
      proyeksiBulan: [84, 110, 143, 95, 79, 70],
      proyeksiMinggu: [16, 26, 40, 18],
      rekDropping: 0,
      spTotal: 480,
      spRealisasi: 465,
      spPending: 15,
      nominalRealisasi: 105.2,
      rateRealisasi: 96.9,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-02",
      mitra: "Bank Rakyat Indonesia (BRI)",
      shortName: "Bank BRI",
      noRekening: "0210.01.000998.30.1",
      manfaat: "THT, JKK, JKm",
      saldo: 620,
      kebutuhanProx: 90,
      saldoProgram: { THT: 420, JKK: 115, JKm: 85 },
      kebutuhanProgram: { THT: 62, JKK: 17, JKm: 11 },
      proyeksiBulanProgram: {
        THT: [48, 62, 80, 53, 45, 39],
        JKK: [13, 17, 22, 14, 12, 10],
        JKm: [9, 12, 15, 10, 8, 7],
      },
      proyeksiBulan: [70, 91, 117, 77, 65, 56],
      proyeksiMinggu: [14, 22, 33, 15],
      rekDropping: 0,
      spTotal: 410,
      spRealisasi: 395,
      spPending: 15,
      nominalRealisasi: 86.8,
      rateRealisasi: 96.3,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-03",
      mitra: "Bank Negara Indonesia (BNI)",
      shortName: "Bank BNI",
      noRekening: "0198.88.776655.1",
      manfaat: "THT, JKK, JKm",
      saldo: 410,
      kebutuhanProx: 75,
      saldoProgram: { THT: 280, JKK: 75, JKm: 55 },
      kebutuhanProgram: { THT: 50, JKK: 15, JKm: 10 },
      proyeksiBulanProgram: {
        THT: [38, 50, 64, 44, 36, 31],
        JKK: [11, 14, 18, 12, 10, 8],
        JKm: [7, 9, 11, 8, 6, 5],
      },
      proyeksiBulan: [56, 73, 93, 64, 52, 44],
      proyeksiMinggu: [11, 17, 26, 13],
      rekDropping: 0,
      spTotal: 320,
      spRealisasi: 304,
      spPending: 16,
      nominalRealisasi: 71.5,
      rateRealisasi: 95.0,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-04",
      mitra: "Bank Tabungan Negara (BTN)",
      shortName: "Bank BTN",
      noRekening: "0012.01.500223.4",
      manfaat: "THT, JKK",
      saldo: 210,
      kebutuhanProx: 160,
      saldoProgram: { THT: 140, JKK: 50, JKm: 20 },
      kebutuhanProgram: { THT: 110, JKK: 36, JKm: 14 },
      proyeksiBulanProgram: {
        THT: [85, 108, 138, 92, 78, 68],
        JKK: [25, 32, 41, 27, 23, 20],
        JKm: [15, 19, 24, 17, 14, 12],
      },
      proyeksiBulan: [125, 159, 203, 136, 115, 100],
      proyeksiMinggu: [26, 39, 56, 25],
      rekDropping: 15,
      spTotal: 270,
      spRealisasi: 246,
      spPending: 24,
      nominalRealisasi: 146.0,
      rateRealisasi: 91.1,
      jadwalDrop: "Transfer Rp 15 M s.d. 16 Juli (M-3)",
      actionStatus: "Perhatian"
    },
    {
      id: "MTR-05",
      mitra: "Bank Syariah Indonesia (BSI)",
      shortName: "Bank BSI",
      noRekening: "7100.99.882233.1",
      manfaat: "THT, JKK, JKm (Layanan Syariah)",
      saldo: 180,
      kebutuhanProx: 45,
      saldoProgram: { THT: 120, JKK: 35, JKm: 25 },
      kebutuhanProgram: { THT: 30, JKK: 9, JKm: 6 },
      proyeksiBulanProgram: {
        THT: [22, 28, 36, 24, 20, 18],
        JKK: [6, 8, 10, 7, 6, 5],
        JKm: [4, 6, 7, 5, 4, 3],
      },
      proyeksiBulan: [32, 42, 53, 36, 30, 26],
      proyeksiMinggu: [7, 11, 16, 7],
      rekDropping: 0,
      spTotal: 160,
      spRealisasi: 155,
      spPending: 5,
      nominalRealisasi: 43.5,
      rateRealisasi: 96.9,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-06",
      mitra: "Bank Mandiri Taspen",
      shortName: "Mandiri Taspen",
      noRekening: "560.10.887711.9",
      manfaat: "THT, JKK, JKm",
      saldo: 320,
      kebutuhanProx: 65,
      saldoProgram: { THT: 220, JKK: 60, JKm: 40 },
      kebutuhanProgram: { THT: 45, JKK: 12, JKm: 8 },
      proyeksiBulanProgram: {
        THT: [34, 44, 57, 38, 32, 28],
        JKK: [9, 12, 15, 10, 8, 7],
        JKm: [6, 8, 10, 7, 6, 5],
      },
      proyeksiBulan: [49, 64, 82, 55, 46, 40],
      proyeksiMinggu: [10, 16, 24, 11],
      rekDropping: 0,
      spTotal: 240,
      spRealisasi: 232,
      spPending: 8,
      nominalRealisasi: 62.4,
      rateRealisasi: 96.7,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-07",
      mitra: "Bank Woori Saudara (BWS)",
      shortName: "Bank BWS",
      noRekening: "212.00.778899.0",
      manfaat: "THT, JKK, JKm",
      saldo: 140,
      kebutuhanProx: 35,
      saldoProgram: { THT: 95, JKK: 27, JKm: 18 },
      kebutuhanProgram: { THT: 24, JKK: 7, JKm: 4 },
      proyeksiBulanProgram: {
        THT: [18, 23, 30, 20, 17, 15],
        JKK: [5, 7, 9, 6, 5, 4],
        JKm: [3, 4, 5, 4, 3, 3],
      },
      proyeksiBulan: [26, 34, 44, 30, 25, 22],
      proyeksiMinggu: [5, 9, 13, 6],
      rekDropping: 0,
      spTotal: 130,
      spRealisasi: 124,
      spPending: 6,
      nominalRealisasi: 33.8,
      rateRealisasi: 95.4,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-08",
      mitra: "Pos Indonesia",
      shortName: "Pos Indonesia",
      noRekening: "098.22.441199.0",
      manfaat: "THT, JKm (Wilayah 3T)",
      saldo: 55,
      kebutuhanProx: 70,
      saldoProgram: { THT: 35, JKK: 9, JKm: 11 },
      kebutuhanProgram: { THT: 45, JKK: 11, JKm: 14 },
      proyeksiBulanProgram: {
        THT: [35, 45, 58, 39, 32, 28],
        JKK: [8, 11, 14, 9, 8, 7],
        JKm: [11, 14, 18, 12, 10, 9],
      },
      proyeksiBulan: [54, 70, 90, 60, 50, 44],
      proyeksiMinggu: [11, 18, 26, 12],
      rekDropping: 25,
      spTotal: 195,
      spRealisasi: 168,
      spPending: 27,
      nominalRealisasi: 58.5,
      rateRealisasi: 86.2,
      jadwalDrop: "Transfer Segera Rp 25 M (Kas Kritis)",
      actionStatus: "Kritis"
    },
    {
      id: "MTR-09",
      mitra: "Bank Bumi Arta (BBA)",
      shortName: "Bank Bumi Arta",
      noRekening: "330.12.554433.8",
      manfaat: "THT, JKK",
      saldo: 65,
      kebutuhanProx: 20,
      saldoProgram: { THT: 44, JKK: 12, JKm: 9 },
      kebutuhanProgram: { THT: 14, JKK: 4, JKm: 2 },
      proyeksiBulanProgram: {
        THT: [10, 14, 18, 12, 10, 9],
        JKK: [3, 4, 5, 3, 3, 2],
        JKm: [2, 2, 3, 2, 2, 1],
      },
      proyeksiBulan: [15, 20, 26, 17, 15, 12],
      proyeksiMinggu: [3, 5, 8, 4],
      rekDropping: 0,
      spTotal: 85,
      spRealisasi: 81,
      spPending: 4,
      nominalRealisasi: 19.2,
      rateRealisasi: 95.3,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-10",
      mitra: "Bank Pembangunan Daerah Jawa Barat (BJB)",
      shortName: "Bank BJB",
      noRekening: "001.23.456789.1",
      manfaat: "THT, JKK, JKm",
      saldo: 160,
      kebutuhanProx: 40,
      saldoProgram: { THT: 110, JKK: 30, JKm: 20 },
      kebutuhanProgram: { THT: 28, JKK: 7, JKm: 5 },
      proyeksiBulanProgram: {
        THT: [21, 27, 35, 23, 20, 17],
        JKK: [5, 7, 9, 6, 5, 4],
        JKm: [4, 5, 6, 4, 4, 3],
      },
      proyeksiBulan: [30, 39, 50, 33, 29, 24],
      proyeksiMinggu: [6, 10, 15, 7],
      rekDropping: 0,
      spTotal: 155,
      spRealisasi: 148,
      spPending: 7,
      nominalRealisasi: 38.6,
      rateRealisasi: 95.5,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-11",
      mitra: "KB Bukopin",
      shortName: "KB Bukopin",
      noRekening: "441.00.112233.5",
      manfaat: "THT, JKK, JKm",
      saldo: 95,
      kebutuhanProx: 25,
      saldoProgram: { THT: 65, JKK: 18, JKm: 12 },
      kebutuhanProgram: { THT: 17, JKK: 5, JKm: 3 },
      proyeksiBulanProgram: {
        THT: [13, 17, 21, 14, 12, 11],
        JKK: [4, 5, 6, 4, 3, 3],
        JKm: [2, 3, 4, 3, 2, 2],
      },
      proyeksiBulan: [19, 25, 31, 21, 17, 16],
      proyeksiMinggu: [4, 6, 9, 5],
      rekDropping: 0,
      spTotal: 105,
      spRealisasi: 100,
      spPending: 5,
      nominalRealisasi: 24.2,
      rateRealisasi: 95.2,
      jadwalDrop: "Tidak Perlu (Surplus)",
      actionStatus: "Aman"
    },
    {
      id: "MTR-12",
      mitra: "Bank SMBC",
      shortName: "Bank SMBC",
      noRekening: "550.01.998877.3",
      manfaat: "THT, JKK, JKm",
      saldo: 120,
      kebutuhanProx: 30,
      saldoProgram: { THT: 82, JKK: 23, JKm: 15 },
      kebutuhanProgram: { THT: 21, JKK: 5, JKm: 4 },
      proyeksiBulanProgram: {
        THT: [16, 20, 26, 17, 15, 13],
        JKK: [4, 5, 7, 4, 4, 3],
        JKm: [3, 4, 5, 3, 3, 2],
      },
      proyeksiBulan: [23, 29, 38, 24, 22, 18],
      proyeksiMinggu: [5, 8, 12, 6],
      rekDropping: 0,
      spTotal: 125,
      spRealisasi: 120,
      spPending: 5,
      nominalRealisasi: 29.5,
      rateRealisasi: 96.0,
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

  // Agregasi Saldo & Kebutuhan per Program (THT, JKK, JKm)
  const totalSaldoTHT = computedMitra.reduce((a, m) => a + (m.saldoProgram?.THT || 0), 0);
  const totalSaldoJKK = computedMitra.reduce((a, m) => a + (m.saldoProgram?.JKK || 0), 0);
  const totalSaldoJKm = computedMitra.reduce((a, m) => a + (m.saldoProgram?.JKm || 0), 0);

  const totalKebutuhanTHT = computedMitra.reduce((a, m) => a + (m.kebutuhanProgram?.THT || 0), 0);
  const totalKebutuhanJKK = computedMitra.reduce((a, m) => a + (m.kebutuhanProgram?.JKK || 0), 0);
  const totalKebutuhanJKm = computedMitra.reduce((a, m) => a + (m.kebutuhanProgram?.JKm || 0), 0);

  // Filter & Komputasi Khusus untuk Panel 1
  const p1ProgKey = panel1ProgramFilter.includes("THT")
    ? "THT"
    : panel1ProgramFilter.includes("JKK")
    ? "JKK"
    : panel1ProgramFilter.includes("JKm")
    ? "JKm"
    : "Semua";

  const computedMitraP1 = computedMitra.map(m => {
    let saldoVal = m.saldo;
    let kebutuhanVal = m.kebutuhanProx;
    
    if (p1ProgKey === "THT") {
      saldoVal = m.saldoProgram?.THT || 0;
      kebutuhanVal = m.kebutuhanProgram?.THT || 0;
    } else if (p1ProgKey === "JKK") {
      saldoVal = m.saldoProgram?.JKK || 0;
      kebutuhanVal = m.kebutuhanProgram?.JKK || 0;
    } else if (p1ProgKey === "JKm") {
      saldoVal = m.saldoProgram?.JKm || 0;
      kebutuhanVal = m.kebutuhanProgram?.JKm || 0;
    }

    const selisihVal = saldoVal - kebutuhanVal;
    const cov = kebutuhanVal > 0 ? Math.round((saldoVal / kebutuhanVal) * 100) : 100;
    let statLabel = "■ AMAN";
    let statColor = "green";
    if (cov < 80) {
      statLabel = "● KRITIS";
      statColor = "red";
    } else if (cov <= 120) {
      statLabel = "▲ PERHATIAN";
      statColor = "yellow";
    }

    return {
      ...m,
      p1Saldo: saldoVal,
      p1Kebutuhan: kebutuhanVal,
      p1Selisih: selisihVal,
      p1Coverage: cov,
      p1StatusLabel: statLabel,
      p1StatusColor: statColor,
    };
  });

  const p1TotalSaldo = p1ProgKey === "THT" ? totalSaldoTHT : p1ProgKey === "JKK" ? totalSaldoJKK : p1ProgKey === "JKm" ? totalSaldoJKm : totalSaldoTersedia;
  const p1TotalKebutuhan = p1ProgKey === "THT" ? totalKebutuhanTHT : p1ProgKey === "JKK" ? totalKebutuhanJKK : p1ProgKey === "JKm" ? totalKebutuhanJKm : totalKebutuhanProx;
  const p1TotalSelisih = p1TotalSaldo - p1TotalKebutuhan;

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

  // Filtered / Active Chart Data with distinct wave dynamics
  const isKonsolidasi = selectedMitraView.startsWith("Semua");
  const activeMitra = mitraData.find(m => m.mitra === selectedMitraView);

  const activeDateRangeList = getDatesInRange(startDate, endDate);
  const selectedRangeDaysCount = activeDateRangeList.length || 1;

  // Menentukan program yang aktif: "Semua", "THT", "JKK", "JKm"
  const progKey = selectedProgramView.includes("THT")
    ? "THT"
    : selectedProgramView.includes("JKK")
    ? "JKK"
    : selectedProgramView.includes("JKm")
    ? "JKm"
    : "Semua";

  // Data Saldo & Kebutuhan Perspektif Aktif (Konsolidasi atau per Mitra)
  const activeMitraSaldoTotal = isKonsolidasi ? totalSaldoTersedia : (activeMitra?.saldo || 0);
  const activeMitraKebutuhanTotal = isKonsolidasi ? totalKebutuhanProx : (activeMitra?.kebutuhanProx || 0);

  const activeMitraSaldoTHT = isKonsolidasi ? totalSaldoTHT : (activeMitra?.saldoProgram?.THT || 0);
  const activeMitraSaldoJKK = isKonsolidasi ? totalSaldoJKK : (activeMitra?.saldoProgram?.JKK || 0);
  const activeMitraSaldoJKm = isKonsolidasi ? totalSaldoJKm : (activeMitra?.saldoProgram?.JKm || 0);

  const activeMitraKebutuhanTHT = isKonsolidasi ? totalKebutuhanTHT : (activeMitra?.kebutuhanProgram?.THT || 0);
  const activeMitraKebutuhanJKK = isKonsolidasi ? totalKebutuhanJKK : (activeMitra?.kebutuhanProgram?.JKK || 0);
  const activeMitraKebutuhanJKm = isKonsolidasi ? totalKebutuhanJKm : (activeMitra?.kebutuhanProgram?.JKm || 0);

  // Konsolidasi bulanan per program
  const konsolidasiBulanProgram = {
    THT: [284, 364, 466, 313, 264, 230],
    JKK: [78, 101, 131, 86, 73, 64],
    JKm: [58, 75, 83, 61, 53, 46],
  };

  // Kalkulasi Series Harian Dinamis Berdasarkan Kalender Rentang Tanggal
  const dailyLabels = [];
  const dailyTHTSeries = [];
  const dailyJKKSeries = [];
  const dailyJKmSeries = [];
  const dailyTotalSeries = [];

  activeDateRangeList.forEach(dateStr => {
    const dParts = dateStr.split("-");
    const yNum = parseInt(dParts[0]);
    const mNum = parseInt(dParts[1]) - 1; // 0..11
    const dNum = parseInt(dParts[2]);

    const daysInThisMonth = new Date(yNum, mNum + 1, 0).getDate();
    const semesterIdx = Math.max(0, Math.min(5, mNum - 6));

    const targetTHT = isKonsolidasi
      ? (konsolidasiBulanProgram.THT[semesterIdx] || 284)
      : (activeMitra?.proyeksiBulanProgram?.THT?.[semesterIdx] || 60);

    const targetJKK = isKonsolidasi
      ? (konsolidasiBulanProgram.JKK[semesterIdx] || 78)
      : (activeMitra?.proyeksiBulanProgram?.JKK?.[semesterIdx] || 16);

    const targetJKm = isKonsolidasi
      ? (konsolidasiBulanProgram.JKm[semesterIdx] || 58)
      : (activeMitra?.proyeksiBulanProgram?.JKm?.[semesterIdx] || 12);

    const weights = getDailyWeights(daysInThisMonth);
    const w = weights[dNum - 1] || (1 / daysInThisMonth);

    const thtVal = +(targetTHT * w).toFixed(1);
    const jkkVal = +(targetJKK * w).toFixed(1);
    const jkmVal = +(targetJKm * w).toFixed(1);
    const totVal = +(thtVal + jkkVal + jkmVal).toFixed(1);

    const lbl = `${dNum} ${shortMonthNamesIndo[mNum] || ""}`;
    dailyLabels.push(lbl);
    dailyTHTSeries.push(thtVal);
    dailyJKKSeries.push(jkkVal);
    dailyJKmSeries.push(jkmVal);
    dailyTotalSeries.push(totVal);
  });

  // Periode Labels & Program Series Dinamis Harian (Kalender)
  const periodLabels = dailyLabels;
  const seriesTHT = dailyTHTSeries;
  const seriesJKK = dailyJKKSeries;
  const seriesJKm = dailyJKmSeries;
  const seriesTotal = dailyTotalSeries;

  const chartKebutuhanSeries = progKey === "THT"
    ? seriesTHT
    : progKey === "JKK"
    ? seriesJKK
    : progKey === "JKm"
    ? seriesJKm
    : seriesTotal;

  const sumTHT = +(seriesTHT.reduce((a, b) => a + b, 0)).toFixed(1);
  const avgTHT = +(sumTHT / (seriesTHT.length || 1)).toFixed(1);
  const peakTHT = seriesTHT.length ? Math.max(...seriesTHT) : 0;

  const sumJKK = +(seriesJKK.reduce((a, b) => a + b, 0)).toFixed(1);
  const avgJKK = +(sumJKK / (seriesJKK.length || 1)).toFixed(1);
  const peakJKK = seriesJKK.length ? Math.max(...seriesJKK) : 0;

  const sumJKm = +(seriesJKm.reduce((a, b) => a + b, 0)).toFixed(1);
  const avgJKm = +(sumJKm / (seriesJKm.length || 1)).toFixed(1);
  const peakJKm = seriesJKm.length ? Math.max(...seriesJKm) : 0;

  const sumTotal = +(seriesTotal.reduce((a, b) => a + b, 0)).toFixed(1);
  const avgTotal = +(sumTotal / (seriesTotal.length || 1)).toFixed(1);
  const peakTotal = seriesTotal.length ? Math.max(...seriesTotal) : 0;

  // Nilai Saldo & Kebutuhan program terpilih untuk kartu indikator
  const currentProgSaldo = progKey === "THT"
    ? activeMitraSaldoTHT
    : progKey === "JKK"
    ? activeMitraSaldoJKK
    : progKey === "JKm"
    ? activeMitraSaldoJKm
    : activeMitraSaldoTotal;

  const currentProgKebutuhan = progKey === "THT"
    ? sumTHT
    : progKey === "JKK"
    ? sumJKK
    : progKey === "JKm"
    ? sumJKm
    : sumTotal;

  // Konfigurasi Tema Warna Berdasarkan Program
  const programThemes = {
    Semua: { label: "Konsolidasi (THT, JKK, JKm)", color: "#0141A8", lightBg: "#EFF6FF", badgeBg: "#DBEAFE", badgeColor: "#1E40AF" },
    THT: { label: "Program THT (Tabungan Hari Tua)", color: "#1D4ED8", lightBg: "#EFF6FF", badgeBg: "#DBEAFE", badgeColor: "#1E40AF" },
    JKK: { label: "Program JKK (Jaminan Kecelakaan Kerja)", color: "#EA580C", lightBg: "#FFF7ED", badgeBg: "#FFEDD5", badgeColor: "#9A3412" },
    JKm: { label: "Program JKm (Jaminan Kematian)", color: "#7C3AED", lightBg: "#FAF5FF", badgeBg: "#F3E8FF", badgeColor: "#6B21A8" },
  };
  const activeProgTheme = programThemes[progKey] || programThemes.Semua;

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

      {/* MONITORING KETERSEDIAAN DANA */}
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
            {/* Header & Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                  Saldo Ketersediaan Dana di Rekening Mitra Bayar (Real-Time)
                </h3>
                <Tooltip content="Posisi saldo rekening giro penyaluran CMS masing-masing mitra vs kebutuhan SP yang telah terbit untuk program THT, JKK, dan JKm.">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#F1F5F9",
                      color: "#64748B",
                      cursor: "pointer",
                      border: "1px solid #CBD5E1"
                    }}
                  >
                    <Info size={12} />
                  </span>
                </Tooltip>
                <span style={{ fontSize: 11.5, color: COLORS.green, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 2 }}>
                  <CircleDot size={10} /> Real-Time Live Feed
                </span>
              </div>

              <div>
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPreview({
                      title: `Laporan Ketersediaan Dana Mitra Bayar — ${p1ProgKey === "Semua" ? "Konsolidasi Program" : `Program ${p1ProgKey}`}`,
                      subtitle: `Data Posisi Saldo Rekening Giro Penyaluran CMS Real-Time Sesuai Program`,
                      type: "table",
                      fileName: `Monitoring_Saldo_Mitra_${p1ProgKey}.xlsx`,
                      content: {
                        columns: [
                          "Nama Mitra Bayar",
                          "No. Rekening Giro",
                          p1ProgKey === "Semua" ? "Program Manfaat" : "Fokus Program",
                          `Saldo ${p1ProgKey === "Semua" ? "Tersedia CMS" : `Program ${p1ProgKey}`}`,
                          `Kebutuhan ${p1ProgKey === "Semua" ? "Prox (SP)" : `SP ${p1ProgKey}`}`,
                          "Selisih (+/-)",
                          "Status"
                        ],
                        rows: computedMitraP1.map(m => [
                          m.mitra,
                          m.noRekening,
                          p1ProgKey === "Semua" ? m.manfaat : `Program ${p1ProgKey} (Coverage: ${m.p1Coverage}%)`,
                          `Rp ${m.p1Saldo} M`,
                          `Rp ${m.p1Kebutuhan} M`,
                          `${m.p1Selisih >= 0 ? "+" : ""}Rp ${m.p1Selisih} M`,
                          m.p1StatusLabel
                        ]),
                        totalRow: [
                          { colSpan: 3, text: `TOTAL KONSOLIDASI (${p1ProgKey.toUpperCase()})`, align: "left" },
                          { text: `Rp ${p1TotalSaldo} M`, align: "right" },
                          { text: `Rp ${p1TotalKebutuhan} M`, align: "right" },
                          { text: `${p1TotalSelisih >= 0 ? "+" : ""}Rp ${p1TotalSelisih} M`, align: "right" },
                          { text: p1TotalSelisih >= 0 ? "■ AMAN" : "● DEFISIT", align: "center" }
                        ],
                        totalRows: computedMitraP1.length
                      }
                    })
                  }
                >
                  <Download size={13} /> Ekspor Snapshot (Excel)
                </Btn>
              </div>
            </div>

            {/* Filter Program Pills & Quick Context Summary */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
                flexWrap: "wrap",
                gap: 10,
                background: p1ProgKey === "THT" ? "#EFF6FF" : p1ProgKey === "JKK" ? "#FFF7ED" : p1ProgKey === "JKm" ? "#FAF5FF" : "#F8FAFC",
                border: `1px solid ${p1ProgKey === "THT" ? "#BFDBFE" : p1ProgKey === "JKK" ? "#FED7AA" : p1ProgKey === "JKm" ? "#E9D5FF" : "#E2E8F0"}`,
                padding: "8px 12px",
                borderRadius: 8,
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", marginRight: 2 }}>
                  Filter Program:
                </span>
                {[
                  { id: "Semua Program (Konsolidasi)", short: "Semua Program", saldo: totalSaldoTersedia, color: "#0F172A", bg: "#F1F5F9" },
                  { id: "THT (Tabungan Hari Tua)", short: "Program THT", saldo: totalSaldoTHT, color: "#1D4ED8", bg: "#EFF6FF" },
                  { id: "JKK (Jaminan Kecelakaan Kerja)", short: "Program JKK", saldo: totalSaldoJKK, color: "#EA580C", bg: "#FFF7ED" },
                  { id: "JKm (Jaminan Kematian)", short: "Program JKm", saldo: totalSaldoJKm, color: "#7C3AED", bg: "#FAF5FF" },
                ].map(p => {
                  const isAct = panel1ProgramFilter === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPanel1ProgramFilter(p.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "5px 12px",
                        borderRadius: 20,
                        border: isAct ? `2px solid ${p.color}` : "1px solid #CBD5E1",
                        background: isAct ? p.color : "#FFFFFF",
                        color: isAct ? "#FFFFFF" : "#334155",
                        fontSize: 11.5,
                        fontWeight: isAct ? 800 : 600,
                        cursor: "pointer",
                        boxShadow: isAct ? "0 2px 5px rgba(0,0,0,0.14)" : "none",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span>{p.short}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: isAct ? "rgba(255,255,255,0.22)" : p.bg,
                          color: isAct ? "#FFFFFF" : p.color,
                          padding: "1px 6px",
                          borderRadius: 10
                        }}
                      >
                        Rp {p.saldo} M
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Live Context Stats */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, flexWrap: "wrap" }}>
                <span style={{ color: "#64748B" }}>
                  Saldo: <strong style={{ color: p1ProgKey === "THT" ? "#1D4ED8" : p1ProgKey === "JKK" ? "#EA580C" : p1ProgKey === "JKm" ? "#7C3AED" : "#0F172A", fontFamily: "monospace" }}>Rp {p1TotalSaldo} M</strong>
                </span>
                <span style={{ color: "#CBD5E1" }}>•</span>
                <span style={{ color: "#64748B" }}>
                  Kebutuhan: <strong style={{ color: COLORS.orange, fontFamily: "monospace" }}>Rp {p1TotalKebutuhan} M</strong>
                </span>
                <span style={{ color: "#CBD5E1" }}>•</span>
                <span style={{ fontWeight: 700, color: p1TotalSelisih >= 0 ? "#059669" : "#DC2626", fontFamily: "monospace" }}>
                  Selisih: {p1TotalSelisih >= 0 ? "+" : ""}Rp {p1TotalSelisih} M ({p1TotalSelisih >= 0 ? "Aman" : "Defisit"})
                </span>
              </div>
            </div>

            {/* VISUALISASI GROUPED BAR CHART: DISTRIBUSI SALDO 3 PROGRAM (THT, JKK, JKm) UNTUK 12 MITRA BAYAR */}
            <div style={{ background: COLORS.gray50, borderRadius: 8, padding: "16px 18px", border: `1px solid ${COLORS.gray200}`, marginBottom: 18 }}>
              {/* Header Toolbar Grafik Panel 1 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BarChart3 size={15} color={COLORS.blueDark} />
                  <strong style={{ fontSize: 13, color: COLORS.gray900 }}>
                    Grafik Komparasi Saldo 3 Program (THT, JKK, JKm) per Mitra Bayar
                  </strong>
                  {p1ProgKey !== "Semua" && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: "1px 8px",
                        borderRadius: 12,
                        background: p1ProgKey === "THT" ? "#EFF6FF" : p1ProgKey === "JKK" ? "#FFF7ED" : "#FAF5FF",
                        color: p1ProgKey === "THT" ? "#1D4ED8" : p1ProgKey === "JKK" ? "#EA580C" : "#7C3AED",
                        border: `1px solid ${p1ProgKey === "THT" ? "#93C5FD" : p1ProgKey === "JKK" ? "#FED7AA" : "#D8B4FE"}`
                      }}
                    >
                      Fokus: Program {p1ProgKey}
                    </span>
                  )}
                </div>

                {/* Interactive Legends with Program Toggle */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, flexWrap: "wrap" }}>
                  {[
                    { key: "THT", label: "Saldo THT", color: "#1D4ED8", full: "THT (Tabungan Hari Tua)" },
                    { key: "JKK", label: "Saldo JKK", color: "#EA580C", full: "JKK (Jaminan Kecelakaan Kerja)" },
                    { key: "JKm", label: "Saldo JKm", color: "#7C3AED", full: "JKm (Jaminan Kematian)" },
                  ].map(leg => {
                    const isFiltered = p1ProgKey === leg.key;
                    return (
                      <div
                        key={leg.key}
                        onClick={() => setPanel1ProgramFilter(isFiltered ? "Semua Program (Konsolidasi)" : leg.full)}
                        title={`Klik untuk filter dan highlight bar ${leg.label}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: isFiltered ? `${leg.color}18` : "transparent",
                          border: `1px solid ${isFiltered ? leg.color : "transparent"}`,
                          transition: "all 0.15s ease"
                        }}
                      >
                        <span style={{ width: 12, height: 12, background: leg.color, borderRadius: 3, display: "inline-block" }} />
                        <strong style={{ color: isFiltered ? leg.color : "#1E293B" }}>{leg.label}</strong>
                        {isFiltered && <span style={{ fontSize: 9.5, color: leg.color, fontWeight: 800 }}>[Aktif]</span>}
                      </div>
                    );
                  })}
                  {p1ProgKey !== "Semua" && (
                    <button
                      onClick={() => setPanel1ProgramFilter("Semua Program (Konsolidasi)")}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        border: "1px solid #CBD5E1",
                        background: "#FFFFFF",
                        color: "#475569",
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ✕ Tampilkan Semua
                    </button>
                  )}
                  <span style={{ color: "#94A3B8" }}>|</span>
                  <span style={{ fontSize: 11.5, color: "#64748B" }}>
                    💡 Arahkan kursor ke bar untuk melihat rincian
                  </span>
                </div>
              </div>

              {/* Grouped Bar SVG: 12 Mitra x 3 Batang Program */}
              {(() => {
                const maxProgSaldo = Math.max(
                  ...computedMitra.map(m => Math.max(m.saldoProgram?.THT || 0, m.saldoProgram?.JKK || 0, m.saldoProgram?.JKm || 0)),
                  50
                );
                const niceMax = maxProgSaldo <= 200 ? 250 : maxProgSaldo <= 400 ? 450 : 600;
                const W = 1180, H = 340, ML = 65, MR = 30, MT = 35, MB = 80;
                const plotW = W - ML - MR, plotH = H - MT - MB;
                const numGroups = computedMitra.length;
                const groupW = plotW / numGroups;
                const barW = 18;
                const gap = 4;
                const yAt = v => MT + plotH - (v / niceMax) * plotH;
                const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(niceMax * f));

                return (
                  <div style={{ width: "100%", overflowX: "auto" }}>
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 950, height: "auto", display: "block" }}>
                      {/* Gridlines */}
                      {yTicks.map((t, i) => (
                        <g key={i}>
                          <line x1={ML} y1={yAt(t)} x2={W - MR} y2={yAt(t)} stroke={COLORS.gray200} strokeWidth="1" strokeDasharray={t === 0 ? "0" : "4 4"} />
                          <text x={ML - 10} y={yAt(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.gray500} fontFamily="monospace">
                            Rp {t} M
                          </text>
                        </g>
                      ))}

                      {/* 12 Groups of 3 Bars per Mitra */}
                      {computedMitra.map((m, i) => {
                        const groupCenterX = ML + groupW * i + groupW / 2;
                        const isSelected = selectedMitraView === m.mitra;
                        const thtVal = m.saldoProgram?.THT || 0;
                        const jkkVal = m.saldoProgram?.JKK || 0;
                        const jkmVal = m.saldoProgram?.JKm || 0;

                        const h1 = (thtVal / niceMax) * plotH;
                        const h2 = (jkkVal / niceMax) * plotH;
                        const h3 = (jkmVal / niceMax) * plotH;

                        const x1 = groupCenterX - barW * 1.5 - gap;
                        const x2 = groupCenterX - barW / 2;
                        const x3 = groupCenterX + barW / 2 + gap;

                        const y1 = MT + plotH - h1;
                        const y2 = MT + plotH - h2;
                        const y3 = MT + plotH - h3;

                        // Program filter matching logic
                        const isTHTMatch = p1ProgKey === "Semua" || p1ProgKey === "THT";
                        const isJKKMatch = p1ProgKey === "Semua" || p1ProgKey === "JKK";
                        const isJKmMatch = p1ProgKey === "Semua" || p1ProgKey === "JKm";

                        // Hover matching logic
                        const isTHThovered = hoveredP1Bar?.mitra === (m.shortName || m.mitra) && hoveredP1Bar?.program === "THT";
                        const isJKKhovered = hoveredP1Bar?.mitra === (m.shortName || m.mitra) && hoveredP1Bar?.program === "JKK";
                        const isJKmhovered = hoveredP1Bar?.mitra === (m.shortName || m.mitra) && hoveredP1Bar?.program === "JKm";

                        const getOpacity = (isMatch, isHovered) => {
                          if (hoveredP1Bar) {
                            if (isHovered) return 1;
                            return isMatch ? 0.6 : 0.18;
                          }
                          return isMatch ? 1 : 0.22;
                        };

                        const op1 = getOpacity(isTHTMatch, isTHThovered);
                        const op2 = getOpacity(isJKKMatch, isJKKhovered);
                        const op3 = getOpacity(isJKmMatch, isJKmhovered);

                        return (
                          <g
                            key={m.id}
                            onClick={() => setSelectedMitraView(m.mitra)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Highlight box behind group */}
                            <rect
                              x={groupCenterX - groupW / 2 + 3}
                              y={MT - 8}
                              width={groupW - 6}
                              height={plotH + 75}
                              rx={8}
                              fill={isSelected ? "rgba(37,99,235,0.08)" : "transparent"}
                              stroke={isSelected ? "#3B82F6" : "transparent"}
                              strokeWidth="1.5"
                            />

                            {/* Bar 1: THT (Biru) */}
                            <rect
                              x={x1}
                              y={y1}
                              width={barW}
                              height={h1}
                              rx={3}
                              fill="#1D4ED8"
                              opacity={op1}
                              stroke={isTHThovered ? "#FFFFFF" : isTHTMatch && p1ProgKey === "THT" ? "#1E3A8A" : "none"}
                              strokeWidth={isTHThovered ? 2 : isTHTMatch && p1ProgKey === "THT" ? 1.5 : 0}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                filter: isTHThovered ? "brightness(1.2) drop-shadow(0 3px 6px rgba(29,78,216,0.45))" : "none"
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredP1Bar({
                                  mitra: m.shortName || m.mitra,
                                  fullName: m.mitra,
                                  program: "THT",
                                  value: thtVal,
                                  color: "#1D4ED8",
                                  x: x1 + barW / 2,
                                  y: y1
                                });
                              }}
                              onMouseLeave={() => setHoveredP1Bar(null)}
                            />
                            {h1 >= 14 && (isTHTMatch || isTHThovered) && (
                              <text
                                x={x1 + barW / 2}
                                y={y1 - 5}
                                textAnchor="middle"
                                fontSize={p1ProgKey === "THT" || isTHThovered ? "10.5" : "9.5"}
                                fontWeight="800"
                                fill="#1D4ED8"
                                fontFamily="monospace"
                                pointerEvents="none"
                              >
                                {thtVal}
                              </text>
                            )}

                            {/* Bar 2: JKK (Oranye) */}
                            <rect
                              x={x2}
                              y={y2}
                              width={barW}
                              height={h2}
                              rx={3}
                              fill="#EA580C"
                              opacity={op2}
                              stroke={isJKKhovered ? "#FFFFFF" : isJKKMatch && p1ProgKey === "JKK" ? "#9A3412" : "none"}
                              strokeWidth={isJKKhovered ? 2 : isJKKMatch && p1ProgKey === "JKK" ? 1.5 : 0}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                filter: isJKKhovered ? "brightness(1.2) drop-shadow(0 3px 6px rgba(234,88,12,0.45))" : "none"
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredP1Bar({
                                  mitra: m.shortName || m.mitra,
                                  fullName: m.mitra,
                                  program: "JKK",
                                  value: jkkVal,
                                  color: "#EA580C",
                                  x: x2 + barW / 2,
                                  y: y2
                                });
                              }}
                              onMouseLeave={() => setHoveredP1Bar(null)}
                            />
                            {h2 >= 14 && (isJKKMatch || isJKKhovered) && (
                              <text
                                x={x2 + barW / 2}
                                y={y2 - 5}
                                textAnchor="middle"
                                fontSize={p1ProgKey === "JKK" || isJKKhovered ? "10.5" : "9.5"}
                                fontWeight="800"
                                fill="#EA580C"
                                fontFamily="monospace"
                                pointerEvents="none"
                              >
                                {jkkVal}
                              </text>
                            )}

                            {/* Bar 3: JKm (Ungu) */}
                            <rect
                              x={x3}
                              y={y3}
                              width={barW}
                              height={h3}
                              rx={3}
                              fill="#7C3AED"
                              opacity={op3}
                              stroke={isJKmhovered ? "#FFFFFF" : isJKmMatch && p1ProgKey === "JKm" ? "#5B21B6" : "none"}
                              strokeWidth={isJKmhovered ? 2 : isJKmMatch && p1ProgKey === "JKm" ? 1.5 : 0}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                filter: isJKmhovered ? "brightness(1.2) drop-shadow(0 3px 6px rgba(124,58,237,0.45))" : "none"
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredP1Bar({
                                  mitra: m.shortName || m.mitra,
                                  fullName: m.mitra,
                                  program: "JKm",
                                  value: jkmVal,
                                  color: "#7C3AED",
                                  x: x3 + barW / 2,
                                  y: y3
                                });
                              }}
                              onMouseLeave={() => setHoveredP1Bar(null)}
                            />
                            {h3 >= 14 && (isJKmMatch || isJKmhovered) && (
                              <text
                                x={x3 + barW / 2}
                                y={y3 - 5}
                                textAnchor="middle"
                                fontSize={p1ProgKey === "JKm" || isJKmhovered ? "10.5" : "9.5"}
                                fontWeight="800"
                                fill="#7C3AED"
                                fontFamily="monospace"
                                pointerEvents="none"
                              >
                                {jkmVal}
                              </text>
                            )}

                            {/* Mitra Label below X-axis */}
                            <text
                              x={groupCenterX}
                              y={H - MB + 20}
                              textAnchor="middle"
                              fontSize="10.5"
                              fontWeight={isSelected ? "800" : "600"}
                              fill={isSelected ? "#1D4ED8" : "#0F172A"}
                              fontFamily="Inter, sans-serif"
                            >
                              {m.shortName || m.mitra}
                            </text>

                            {/* Total Saldo Tag */}
                            <rect
                              x={groupCenterX - 30}
                              y={H - MB + 28}
                              width={60}
                              height={18}
                              rx={4}
                              fill={isSelected ? "#EFF6FF" : "#FFFFFF"}
                              stroke={isSelected ? "#2563EB" : "#CBD5E1"}
                            />
                            <text
                              x={groupCenterX}
                              y={H - MB + 41}
                              textAnchor="middle"
                              fontSize="9"
                              fontWeight="800"
                              fill={isSelected ? "#1D4ED8" : "#334155"}
                              fontFamily="monospace"
                            >
                              Rp {m.saldo} M
                            </text>
                          </g>
                        );
                      })}

                      {/* Tooltip on Hover */}
                      {hoveredP1Bar && (
                        <g
                          transform={`translate(${
                            hoveredP1Bar.x < ML + 90
                              ? hoveredP1Bar.x + 8
                              : hoveredP1Bar.x > W - MR - 90
                              ? hoveredP1Bar.x - 170
                              : hoveredP1Bar.x - 80
                          }, ${Math.max(hoveredP1Bar.y - 58, 8)})`}
                          pointerEvents="none"
                        >
                          <rect
                            x="0"
                            y="0"
                            width="160"
                            height="48"
                            rx="6"
                            fill="#0F172A"
                            stroke="#334155"
                            strokeWidth="1"
                            filter="drop-shadow(0 4px 12px rgba(0,0,0,0.35))"
                          />
                          <text x="10" y="17" fill="#94A3B8" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                            {hoveredP1Bar.fullName}
                          </text>
                          <circle cx="16" cy="33" r="4" fill={hoveredP1Bar.color} />
                          <text x="25" y="36" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="monospace">
                            {hoveredP1Bar.program}: Rp {hoveredP1Bar.value} M
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                );
              })()}
            </div>

            {/* TABEL MATRIKS SALDO REAL-TIME CMS 12 MITRA BAYAR */}
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>Mitra Bayar</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>No. Rekening CMS</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#1D4ED8", borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", background: p1ProgKey === "THT" ? "#EFF6FF" : "inherit" }}>
                      Saldo THT
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#EA580C", borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", background: p1ProgKey === "JKK" ? "#FFF7ED" : "inherit" }}>
                      Saldo JKK
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#7C3AED", borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", background: p1ProgKey === "JKm" ? "#FAF5FF" : "inherit" }}>
                      Saldo JKm
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#0F172A", borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
                      Total Saldo CMS
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: COLORS.orange, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
                      Kebutuhan {p1ProgKey === "Semua" ? "Total SP" : `SP ${p1ProgKey}`}
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
                      Selisih Likuiditas (+/-)
                    </th>
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderBottom: "1px solid #E2E8F0" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {computedMitraP1.map((m, i) => {
                    const isSelectedRow = selectedMitraView === m.mitra;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMitraView(m.mitra)}
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                          background: isSelectedRow
                            ? "#EFF6FF"
                            : m.p1StatusColor === "red"
                            ? "#FFF1F2"
                            : m.p1StatusColor === "yellow"
                            ? "#FFF8E1"
                            : i % 2 === 1
                            ? "#F8FAFC"
                            : "#FFFFFF",
                          cursor: "pointer"
                        }}
                        onMouseEnter={e => { if (!isSelectedRow) e.currentTarget.style.background = "#F1F5F9"; }}
                        onMouseLeave={e => { if (!isSelectedRow) e.currentTarget.style.background = m.p1StatusColor === "red" ? "#FFF1F2" : m.p1StatusColor === "yellow" ? "#FFF8E1" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"; }}
                      >
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: isSelectedRow ? "#1D4ED8" : m.p1StatusColor === "red" ? "#BE123C" : "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                          {m.mitra}
                          {isSelectedRow && (
                            <span style={{ marginLeft: 6, fontSize: 10, background: "#1D4ED8", color: "#FFFFFF", padding: "1px 6px", borderRadius: 10 }}>
                              Terpilih
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontFamily: "monospace", fontSize: 11, color: COLORS.blueDark, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>
                          {m.noRekening}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1D4ED8", borderRight: "1px solid #E2E8F0", background: p1ProgKey === "THT" ? "#EFF6FF" : "inherit" }}>
                          Rp {m.saldoProgram?.THT || 0} M
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#EA580C", borderRight: "1px solid #E2E8F0", background: p1ProgKey === "JKK" ? "#FFF7ED" : "inherit" }}>
                          Rp {m.saldoProgram?.JKK || 0} M
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#7C3AED", borderRight: "1px solid #E2E8F0", background: p1ProgKey === "JKm" ? "#FAF5FF" : "inherit" }}>
                          Rp {m.saldoProgram?.JKm || 0} M
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                          Rp {m.saldo} M
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.orange, fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                          Rp {m.p1Kebutuhan} M
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: m.p1Selisih >= 0 ? COLORS.green : COLORS.red, borderRight: "1px solid #E2E8F0" }}>
                          {m.p1Selisih >= 0 ? "+" : ""}Rp {m.p1Selisih} M
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "center" }}>
                          <Badge color={m.p1StatusColor}>
                            {m.p1StatusLabel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* BARIS TOTAL KONSOLIDASI */}
                  <tr style={{ background: "#EDF2F7", fontWeight: 800, borderTop: `2px solid #CBD5E1` }}>
                    <td colSpan={2} style={{ padding: "10px 12px", color: COLORS.blueDark, borderRight: "1px solid #CBD5E1" }}>
                      TOTAL KONSOLIDASI SALUR 12 MITRA
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", borderRight: "1px solid #CBD5E1" }}>
                      Rp {totalSaldoTHT} M
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#EA580C", borderRight: "1px solid #CBD5E1" }}>
                      Rp {totalSaldoJKK} M
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", borderRight: "1px solid #CBD5E1" }}>
                      Rp {totalSaldoJKm} M
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                      Rp {totalSaldoTersedia} M
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.orange, borderRight: "1px solid #CBD5E1" }}>
                      Rp {p1TotalKebutuhan} M
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: p1TotalSelisih >= 0 ? COLORS.green : COLORS.red, borderRight: "1px solid #CBD5E1" }}>
                      {p1TotalSelisih >= 0 ? "+" : ""}Rp {p1TotalSelisih} M
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      <Badge color={p1TotalSelisih >= 0 ? "green" : "red"}>
                        {p1TotalSelisih >= 0 ? "■ AMAN" : "● DEFISIT"}
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

          {/* PANEL 2 — Proyeksi Kebutuhan Dana (THT, JKK, JKm) Dinamis Harian */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 22,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
            }}
          >
            {/* 1. HEADER TITLE */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                  Proyeksi Kebutuhan Dana (THT, JKK, JKm)
                </h3>
                <Tooltip content="Estimasi dan peramalan kebutuhan likuiditas klaim peserta berdasarkan program (THT, JKK, JKm) dan per mitra bayar untuk rentang tanggal harian dinamis, mingguan, maupun bulanan.">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#F1F5F9",
                      color: "#64748B",
                      cursor: "pointer",
                      border: "1px solid #CBD5E1"
                    }}
                  >
                    <Info size={12} />
                  </span>
                </Tooltip>
                <Badge color={isKonsolidasi ? "blue" : "purple"}>
                  Perspektif: {selectedMitraView}
                </Badge>
                <Badge color="green">
                  {`📅 Rentang: ${formatIndoDate(startDate)} — ${formatIndoDate(endDate)} (${selectedRangeDaysCount} Hari)`}
                </Badge>
              </div>
            </div>

            {/* 2. FILTERS DI BAWAH JUDUL: PER MITRA & SELEKSI RENTANG TANGGAL */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-end",
                flexWrap: "wrap",
                marginBottom: 16,
                padding: "12px 16px",
                background: "#F8FAFC",
                borderRadius: 8,
                border: "1px solid #E2E8F0"
              }}
            >
              {/* Mitra Selector: Per Mitra atau Konsolidasi */}
              <div style={{ display: "flex", flexDirection: "column", minWidth: 230, flex: "1 1 230px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                      color: COLORS.gray500,
                    }}
                  >
                    Mitra Bayar
                  </label>
                  <span style={{ color: "#CBD5E1", fontSize: 10 }}>•</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isKonsolidasi ? "#334155" : "#1D4ED8",
                      background: isKonsolidasi ? "#F1F5F9" : "#EFF6FF",
                      padding: "1px 6px",
                      borderRadius: 4,
                      border: `1px solid ${isKonsolidasi ? "#E2E8F0" : "#BFDBFE"}`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 150
                    }}
                  >
                    {selectedMitraView}
                  </span>
                </div>
                <select
                  value={selectedMitraView}
                  onChange={(e) => setSelectedMitraView(e.target.value)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray200}`,
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.gray900,
                    background: COLORS.white,
                    height: 35,
                    boxSizing: "border-box",
                    cursor: "pointer",
                    outline: "none",
                    width: "100%"
                  }}
                >
                  {["Semua Mitra (Konsolidasi)", ...initialMitraData.map(m => m.mitra)].map((o, i) => (
                    <option key={i} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Rentang Tanggal Proyeksi */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.gray500, display: "block", marginBottom: 6 }}>
                  Rentang Tanggal Proyeksi
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>
                  <span>Dari:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStartDate(val);
                      if (val > endDate) setEndDate(val);
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid #CBD5E1",
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray900,
                      background: COLORS.white,
                      height: 35,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                  <span style={{ marginLeft: 2, marginRight: 2 }}>s/d</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEndDate(val);
                      if (val < startDate) setStartDate(val);
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid #CBD5E1",
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray900,
                      background: COLORS.white,
                      height: 35,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Chart Type Toggle */}
              <div style={{ display: "flex", flexDirection: "column", marginLeft: "auto" }}>
                <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: COLORS.gray500, display: "block", marginBottom: 6 }}>
                  Tampilan Grafik
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 3, background: COLORS.white, padding: "3px 4px", borderRadius: 8, height: 35, boxSizing: "border-box", border: "1px solid #CBD5E1" }}>
                  <button
                    type="button"
                    onClick={() => setProyeksiChartType("line")}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "none",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: proyeksiChartType === "line" ? COLORS.blueDark : "transparent",
                      color: proyeksiChartType === "line" ? COLORS.white : COLORS.gray600,
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <LineChartIcon size={13} /> Line
                  </button>
                  <button
                    type="button"
                    onClick={() => setProyeksiChartType("bar")}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "none",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: proyeksiChartType === "bar" ? COLORS.blueDark : "transparent",
                      color: proyeksiChartType === "bar" ? COLORS.white : COLORS.gray600,
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <BarChart3 size={13} /> Bar
                  </button>
                </div>
              </div>
            </div>

            {/* 4. CARDS INDIKATOR PROYEKSI & KETAHANAN LIKUIDITAS (PERSPEKTIF AKTIF) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
              {/* Card THT */}
              <div
                onClick={() => setSelectedProgramView("THT (Tabungan Hari Tua)")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563EB";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedProgramView.includes("THT") ? "#2563EB" : "#E2E8F0";
                  e.currentTarget.style.boxShadow = selectedProgramView.includes("THT") ? "0 2px 6px rgba(37,99,235,0.12)" : "none";
                }}
                style={{
                  background: selectedProgramView.includes("THT") ? "#EFF6FF" : "#FFFFFF",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: `1.5px solid ${selectedProgramView.includes("THT") ? "#2563EB" : "#E2E8F0"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: selectedProgramView.includes("THT") ? "0 2px 6px rgba(37,99,235,0.12)" : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Proyeksi THT
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 10,
                      background: activeMitraSaldoTHT >= sumTHT ? "#ECFDF5" : "#FEF2F2",
                      color: activeMitraSaldoTHT >= sumTHT ? "#065F46" : "#DC2626",
                      border: `1px solid ${activeMitraSaldoTHT >= sumTHT ? "#A7F3D0" : "#FECACA"}`
                    }}
                  >
                    {activeMitraSaldoTHT >= sumTHT ? "Aman" : "Defisit"}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", lineHeight: 1.2 }}>
                  Rp {sumTHT} M
                </div>
                <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Saldo: <b>Rp {activeMitraSaldoTHT} M</b></span>
                  <span style={{ color: activeMitraSaldoTHT >= sumTHT ? "#059669" : "#DC2626", fontWeight: 700 }}>
                    {activeMitraSaldoTHT >= sumTHT ? "+" : ""}Rp {+(activeMitraSaldoTHT - sumTHT).toFixed(1)} M
                  </span>
                </div>
              </div>

              {/* Card JKK */}
              <div
                onClick={() => setSelectedProgramView("JKK (Jaminan Kecelakaan Kerja)")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#EA580C";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(234,88,12,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedProgramView.includes("JKK") ? "#EA580C" : "#E2E8F0";
                  e.currentTarget.style.boxShadow = selectedProgramView.includes("JKK") ? "0 2px 6px rgba(234,88,12,0.12)" : "none";
                }}
                style={{
                  background: selectedProgramView.includes("JKK") ? "#FFF7ED" : "#FFFFFF",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: `1.5px solid ${selectedProgramView.includes("JKK") ? "#EA580C" : "#E2E8F0"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: selectedProgramView.includes("JKK") ? "0 2px 6px rgba(234,88,12,0.12)" : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#EA580C", textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Proyeksi JKK
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 10,
                      background: activeMitraSaldoJKK >= sumJKK ? "#ECFDF5" : "#FEF2F2",
                      color: activeMitraSaldoJKK >= sumJKK ? "#065F46" : "#DC2626",
                      border: `1px solid ${activeMitraSaldoJKK >= sumJKK ? "#A7F3D0" : "#FECACA"}`
                    }}
                  >
                    {activeMitraSaldoJKK >= sumJKK ? "Aman" : "Defisit"}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", lineHeight: 1.2 }}>
                  Rp {sumJKK} M
                </div>
                <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Saldo: <b>Rp {activeMitraSaldoJKK} M</b></span>
                  <span style={{ color: activeMitraSaldoJKK >= sumJKK ? "#059669" : "#DC2626", fontWeight: 700 }}>
                    {activeMitraSaldoJKK >= sumJKK ? "+" : ""}Rp {+(activeMitraSaldoJKK - sumJKK).toFixed(1)} M
                  </span>
                </div>
              </div>

              {/* Card JKm */}
              <div
                onClick={() => setSelectedProgramView("JKm (Jaminan Kematian)")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedProgramView.includes("JKm") ? "#7C3AED" : "#E2E8F0";
                  e.currentTarget.style.boxShadow = selectedProgramView.includes("JKm") ? "0 2px 6px rgba(124,58,237,0.12)" : "none";
                }}
                style={{
                  background: selectedProgramView.includes("JKm") ? "#FAF5FF" : "#FFFFFF",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: `1.5px solid ${selectedProgramView.includes("JKm") ? "#7C3AED" : "#E2E8F0"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: selectedProgramView.includes("JKm") ? "0 2px 6px rgba(124,58,237,0.12)" : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Proyeksi JKm
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 10,
                      background: activeMitraSaldoJKm >= sumJKm ? "#ECFDF5" : "#FEF2F2",
                      color: activeMitraSaldoJKm >= sumJKm ? "#065F46" : "#DC2626",
                      border: `1px solid ${activeMitraSaldoJKm >= sumJKm ? "#A7F3D0" : "#FECACA"}`
                    }}
                  >
                    {activeMitraSaldoJKm >= sumJKm ? "Aman" : "Defisit"}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", lineHeight: 1.2 }}>
                  Rp {sumJKm} M
                </div>
                <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Saldo: <b>Rp {activeMitraSaldoJKm} M</b></span>
                  <span style={{ color: activeMitraSaldoJKm >= sumJKm ? "#059669" : "#DC2626", fontWeight: 700 }}>
                    {activeMitraSaldoJKm >= sumJKm ? "+" : ""}Rp {+(activeMitraSaldoJKm - sumJKm).toFixed(1)} M
                  </span>
                </div>
              </div>

              {/* Card Total Konsolidasi Salur */}
              <div
                onClick={() => setSelectedProgramView("Semua Program (Konsolidasi)")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0F172A";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,23,42,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedProgramView.startsWith("Semua") ? "#0F172A" : "#E2E8F0";
                  e.currentTarget.style.boxShadow = selectedProgramView.startsWith("Semua") ? "0 2px 6px rgba(15,23,42,0.12)" : "none";
                }}
                style={{
                  background: selectedProgramView.startsWith("Semua") ? "#F8FAFC" : "#FFFFFF",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: `1.5px solid ${selectedProgramView.startsWith("Semua") ? "#0F172A" : "#E2E8F0"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: selectedProgramView.startsWith("Semua") ? "0 2px 6px rgba(15,23,42,0.12)" : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#0F172A", textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Total Proyeksi
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 10,
                      background: activeMitraSaldoTotal >= sumTotal ? "#ECFDF5" : "#FEF2F2",
                      color: activeMitraSaldoTotal >= sumTotal ? "#065F46" : "#DC2626",
                      border: `1px solid ${activeMitraSaldoTotal >= sumTotal ? "#A7F3D0" : "#FECACA"}`
                    }}
                  >
                    {activeMitraSaldoTotal >= sumTotal ? "Aman" : "Defisit"}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", lineHeight: 1.2 }}>
                  Rp {sumTotal} M
                </div>
                <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Saldo CMS: <b>Rp {activeMitraSaldoTotal} M</b></span>
                  <span style={{ color: activeMitraSaldoTotal >= sumTotal ? "#059669" : "#DC2626", fontWeight: 700 }}>
                    {activeMitraSaldoTotal >= sumTotal ? "+" : ""}Rp {+(activeMitraSaldoTotal - sumTotal).toFixed(1)} M
                  </span>
                </div>
              </div>
            </div>

            {/* 5. GRAPHIC AREA: VISUALISASI PROYEKSI KEBUTUHAN DANA DINAMIS */}
            <div style={{ background: COLORS.gray50, borderRadius: 8, padding: "16px 18px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
              {/* Header Toolbar Grafik Proyeksi */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                    <LineChartIcon size={16} color={activeProgTheme.color} />
                    <span>
                      {selectedMitraView === "Semua Mitra (Konsolidasi)" 
                        ? "Semua Mitra (Konsolidasi)" 
                        : selectedMitraView}
                    </span>
                    <span style={{ color: "#94A3B8", fontWeight: 400, margin: "0 2px" }}>—</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: activeProgTheme.color }}>
                      {activeProgTheme.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                    Rentang Waktu: <strong>Kalender Harian ({formatIndoDate(startDate)} s.d. {formatIndoDate(endDate)} • {selectedRangeDaysCount} Hari)</strong>
                    <span style={{ marginLeft: 6, color: "#059669", fontWeight: 700 }}>
                      • Rata-rata: Rp {avgTotal} M/hari • Puncak: Rp {peakTotal} M
                    </span>
                  </div>
                </div>

                {/* Legends */}
                {progKey === "Semua" ? (
                  <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 4, background: "#1D4ED8", borderRadius: 2, display: "inline-block" }} />
                      <strong style={{ color: "#1E293B" }}>THT</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 4, background: "#EA580C", borderRadius: 2, display: "inline-block" }} />
                      <strong style={{ color: "#1E293B" }}>JKK</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 4, background: "#7C3AED", borderRadius: 2, display: "inline-block" }} />
                      <strong style={{ color: "#1E293B" }}>JKm</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 16, height: 3, background: "#0F172A", display: "inline-block", borderTop: "2px dashed #0F172A" }} />
                      <strong style={{ color: "#0F172A" }}>Total Proyeksi</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 2, background: "#059669", display: "inline-block", borderTop: "2px dashed #059669" }} />
                      <span style={{ color: "#059669", fontWeight: 700 }}>Saldo Tersedia (Rp {currentProgSaldo} M)</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 4, background: activeProgTheme.color, borderRadius: 2, display: "inline-block" }} />
                      <strong style={{ color: activeProgTheme.color }}>Proyeksi {progKey}</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 14, height: 2, background: currentProgSaldo >= sumTotal ? "#059669" : "#DC2626", display: "inline-block", borderTop: "2px dashed" }} />
                      <span style={{ color: currentProgSaldo >= sumTotal ? "#059669" : "#DC2626", fontWeight: 700 }}>
                        Saldo {progKey} Tersedia: Rp {currentProgSaldo} M ({currentProgSaldo >= sumTotal ? "Aman" : "Defisit"})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* RENDER GRAFIK PROYEKSI: MODE LINE ATAU BAR */}
              {(() => {
                const allPoints = progKey === "Semua"
                  ? [...seriesTotal, ...seriesTHT, ...seriesJKK, ...seriesJKm]
                  : [...chartKebutuhanSeries];
                const maxVal = Math.max(...allPoints, currentProgSaldo > 0 ? currentProgSaldo : 0, 10);
                const niceMax = maxVal <= 10 ? 12 : maxVal <= 25 ? 30 : maxVal <= 60 ? 70 : maxVal <= 120 ? 140 : maxVal <= 250 ? 280 : maxVal <= 500 ? 550 : 800;
                
                const numPeriods = periodLabels.length;
                const dynamicW = Math.max(1000, numPeriods * 46 + 100);
                const W = dynamicW, H = 320, ML = 65, MR = 40, MT = 35, MB = 55;
                const plotW = W - ML - MR, plotH = H - MT - MB;
                const xAt = i => ML + (plotW / (numPeriods > 1 ? numPeriods - 1 : 1)) * i;
                const yAt = v => MT + plotH - (v / niceMax) * plotH;
                const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => +(niceMax * f).toFixed(1));

                const ptsTHT = seriesTHT.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
                const ptsJKK = seriesJKK.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
                const ptsJKm = seriesJKm.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
                const ptsTotal = seriesTotal.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
                const ptsActive = chartKebutuhanSeries.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");

                const areaActive = numPeriods > 1
                  ? `${xAt(0)},${MT + plotH} ${ptsActive} ${xAt(numPeriods - 1)},${MT + plotH}`
                  : "";

                if (proyeksiChartType === "line") {
                  return (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: numPeriods > 15 ? 900 : 680, height: "auto", display: "block" }}>
                        {/* Gridlines */}
                        {yTicks.map((t, i) => (
                          <g key={i}>
                            <line x1={ML} y1={yAt(t)} x2={W - MR} y2={yAt(t)} stroke={COLORS.gray200} strokeWidth="1" strokeDasharray={t === 0 ? "0" : "4 4"} />
                            <text x={ML - 10} y={yAt(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.gray500} fontFamily="monospace">
                              Rp {t} M
                            </text>
                          </g>
                        ))}

                        {/* X-axis Labels */}
                        {periodLabels.map((p, i) => (
                          <text key={i} x={xAt(i)} y={H - MB + 24} textAnchor="middle" fontSize={numPeriods > 20 ? "10" : "11"} fill={COLORS.gray700} fontWeight="700" fontFamily="Inter, sans-serif">
                            {p}
                          </text>
                        ))}

                        {/* Average Line */}
                        {avgTotal > 0 && (
                          <g>
                            <line
                              x1={ML}
                              y1={yAt(avgTotal)}
                              x2={W - MR}
                              y2={yAt(avgTotal)}
                              stroke="#64748B"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={W - MR}
                              y={yAt(avgTotal) - 4}
                              textAnchor="end"
                              fontSize="9.5"
                              fontWeight="700"
                              fill="#64748B"
                              fontFamily="monospace"
                            >
                              Rata-rata: Rp {avgTotal} M/hari
                            </text>
                          </g>
                        )}

                        {/* Garis Referensi Saldo Tersedia (Threshold Line) */}
                        {currentProgSaldo > 0 && currentProgSaldo <= niceMax && (
                          <g>
                            <line
                              x1={ML}
                              y1={yAt(currentProgSaldo)}
                              x2={W - MR}
                              y2={yAt(currentProgSaldo)}
                              stroke={currentProgSaldo >= Math.max(...chartKebutuhanSeries, 0) ? "#059669" : "#DC2626"}
                              strokeWidth="2"
                              strokeDasharray="6 4"
                            />
                            <text
                              x={W - MR}
                              y={yAt(currentProgSaldo) - 6}
                              textAnchor="end"
                              fontSize="10"
                              fontWeight="800"
                              fill={currentProgSaldo >= Math.max(...chartKebutuhanSeries, 0) ? "#059669" : "#DC2626"}
                              fontFamily="monospace"
                            >
                              Saldo Tersedia: Rp {currentProgSaldo} M
                            </text>
                          </g>
                        )}

                        {/* KOMPARASI 3 PROGRAM (MULTILINE) vs FOKUS 1 PROGRAM */}
                        {progKey === "Semua" ? (
                          <>
                            {/* Line 1: THT (Biru) */}
                            <polyline points={ptsTHT} fill="none" stroke="#1D4ED8" strokeWidth="2.8" strokeLinejoin="round" />
                            {seriesTHT.map((v, i) => (
                              <circle key={`tht-${i}`} cx={xAt(i)} cy={yAt(v)} r="3.5" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2.5" />
                            ))}

                            {/* Line 2: JKK (Oranye) */}
                            <polyline points={ptsJKK} fill="none" stroke="#EA580C" strokeWidth="2.8" strokeLinejoin="round" />
                            {seriesJKK.map((v, i) => (
                              <circle key={`jkk-${i}`} cx={xAt(i)} cy={yAt(v)} r="3.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2.5" />
                            ))}

                            {/* Line 3: JKm (Ungu) */}
                            <polyline points={ptsJKm} fill="none" stroke="#7C3AED" strokeWidth="2.8" strokeLinejoin="round" />
                            {seriesJKm.map((v, i) => (
                              <circle key={`jkm-${i}`} cx={xAt(i)} cy={yAt(v)} r="3.5" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2.5" />
                            ))}

                            {/* Line 4: Total Konsolidasi (Navy Tebal Putus-putus) */}
                            <polyline points={ptsTotal} fill="none" stroke="#0F172A" strokeWidth="3.2" strokeDasharray="6 3" strokeLinejoin="round" />
                            {seriesTotal.map((v, i) => (
                              <g key={`tot-${i}`}>
                                <circle
                                  cx={xAt(i)}
                                  cy={yAt(v)}
                                  r={hoveredProyeksiPoint?.index === i ? "6.5" : "4.5"}
                                  fill="#0F172A"
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                  style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                                  onMouseEnter={() => setHoveredProyeksiPoint({
                                    index: i,
                                    label: periodLabels[i],
                                    tht: seriesTHT[i],
                                    jkk: seriesJKK[i],
                                    jkm: seriesJKm[i],
                                    total: v,
                                    x: xAt(i),
                                    y: yAt(v)
                                  })}
                                  onMouseLeave={() => setHoveredProyeksiPoint(null)}
                                />
                                {numPeriods <= 16 && (
                                  <text x={xAt(i)} y={yAt(v) - 9} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0F172A" fontFamily="monospace">
                                    {v}
                                  </text>
                                )}
                              </g>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Area Gradient Under Active Program Curve */}
                            {areaActive && (
                              <polygon points={areaActive} fill={progKey === "THT" ? "rgba(29,78,216,0.12)" : progKey === "JKK" ? "rgba(234,88,12,0.12)" : "rgba(124,58,237,0.12)"} />
                            )}
                            
                            {/* Main Active Program Curve */}
                            <polyline points={ptsActive} fill="none" stroke={activeProgTheme.color} strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
                            
                            {/* Data Points + Values */}
                            {chartKebutuhanSeries.map((v, i) => (
                              <g key={`p-${i}`}>
                                <circle
                                  cx={xAt(i)}
                                  cy={yAt(v)}
                                  r={hoveredProyeksiPoint?.index === i ? "6.5" : "4.5"}
                                  fill="#FFFFFF"
                                  stroke={activeProgTheme.color}
                                  strokeWidth="3"
                                  style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                                  onMouseEnter={() => setHoveredProyeksiPoint({
                                    index: i,
                                    label: periodLabels[i],
                                    tht: seriesTHT[i],
                                    jkk: seriesJKK[i],
                                    jkm: seriesJKm[i],
                                    total: seriesTotal[i],
                                    value: v,
                                    x: xAt(i),
                                    y: yAt(v)
                                  })}
                                  onMouseLeave={() => setHoveredProyeksiPoint(null)}
                                />
                                {numPeriods <= 20 && (
                                  <text x={xAt(i)} y={yAt(v) - 9} textAnchor="middle" fontSize="10" fontWeight="800" fill={activeProgTheme.color} fontFamily="monospace">
                                    {v}
                                  </text>
                                )}
                              </g>
                            ))}
                          </>
                        )}

                        {/* Interactive Tooltip Box on Hover */}
                        {hoveredProyeksiPoint && (
                          <g
                            transform={`translate(${
                              hoveredProyeksiPoint.x < ML + 110
                                ? hoveredProyeksiPoint.x + 10
                                : hoveredProyeksiPoint.x > W - MR - 110
                                ? hoveredProyeksiPoint.x - 190
                                : hoveredProyeksiPoint.x - 90
                            }, ${Math.max(hoveredProyeksiPoint.y - 78, 10)})`}
                            pointerEvents="none"
                          >
                            <rect
                              x="0"
                              y="0"
                              width="180"
                              height="72"
                              rx="8"
                              fill="#0F172A"
                              stroke="#334155"
                              strokeWidth="1"
                              filter="drop-shadow(0 6px 16px rgba(0,0,0,0.4))"
                            />
                            <text x="10" y="16" fill="#94A3B8" fontSize="10.5" fontWeight="700" fontFamily="sans-serif">
                              {hoveredProyeksiPoint.label}
                            </text>
                            <text x="10" y="32" fill="#93C5FD" fontSize="10" fontWeight="600" fontFamily="monospace">
                              • THT: Rp {hoveredProyeksiPoint.tht} M
                            </text>
                            <text x="10" y="46" fill="#FDBA74" fontSize="10" fontWeight="600" fontFamily="monospace">
                              • JKK: Rp {hoveredProyeksiPoint.jkk} M  |  JKm: Rp {hoveredProyeksiPoint.jkm} M
                            </text>
                            <text x="10" y="62" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="monospace">
                              Total Kebutuhan: Rp {hoveredProyeksiPoint.total} M
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>
                  );
                } else {
                  /* MODE BAR KOMPARASI PERIODE */
                  const groupColW = plotW / numPeriods;
                  const barColW = progKey === "Semua" ? (numPeriods > 15 ? 8 : 16) : (numPeriods > 15 ? 16 : 30);
                  const barColGap = numPeriods > 15 ? 2 : 4;

                  return (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: numPeriods > 15 ? 900 : 680, height: "auto", display: "block" }}>
                        {/* Gridlines */}
                        {yTicks.map((t, i) => (
                          <g key={i}>
                            <line x1={ML} y1={yAt(t)} x2={W - MR} y2={yAt(t)} stroke={COLORS.gray200} strokeWidth="1" strokeDasharray={t === 0 ? "0" : "4 4"} />
                            <text x={ML - 10} y={yAt(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.gray500} fontFamily="monospace">
                              Rp {t} M
                            </text>
                          </g>
                        ))}

                        {/* Threshold Line */}
                        {currentProgSaldo > 0 && currentProgSaldo <= niceMax && (
                          <line
                            x1={ML}
                            y1={yAt(currentProgSaldo)}
                            x2={W - MR}
                            y2={yAt(currentProgSaldo)}
                            stroke={currentProgSaldo >= Math.max(...chartKebutuhanSeries, 0) ? "#059669" : "#DC2626"}
                            strokeWidth="2"
                            strokeDasharray="6 4"
                          />
                        )}

                        {/* Bars per Period */}
                        {periodLabels.map((p, i) => {
                          const colCenterX = ML + groupColW * i + groupColW / 2;

                          if (progKey === "Semua") {
                            const v1 = seriesTHT[i] || 0;
                            const v2 = seriesJKK[i] || 0;
                            const v3 = seriesJKm[i] || 0;

                            const h1 = (v1 / niceMax) * plotH;
                            const h2 = (v2 / niceMax) * plotH;
                            const h3 = (v3 / niceMax) * plotH;

                            const bx1 = colCenterX - barColW * 1.5 - barColGap;
                            const bx2 = colCenterX - barColW / 2;
                            const bx3 = colCenterX + barColW / 2 + barColGap;

                            const by1 = MT + plotH - h1;
                            const by2 = MT + plotH - h2;
                            const by3 = MT + plotH - h3;

                            return (
                              <g key={i}>
                                {/* Bar THT */}
                                <rect x={bx1} y={by1} width={barColW} height={h1} rx={2} fill="#1D4ED8" />
                                {/* Bar JKK */}
                                <rect x={bx2} y={by2} width={barColW} height={h2} rx={2} fill="#EA580C" />
                                {/* Bar JKm */}
                                <rect x={bx3} y={by3} width={barColW} height={h3} rx={2} fill="#7C3AED" />

                                {numPeriods <= 12 && (
                                  <text x={bx2 + barColW / 2} y={Math.min(by1, by2, by3) - 4} textAnchor="middle" fontSize="9" fontWeight="800" fill="#0F172A" fontFamily="monospace">
                                    {seriesTotal[i]}
                                  </text>
                                )}

                                {/* Period Label */}
                                <text x={colCenterX} y={H - MB + 22} textAnchor="middle" fontSize={numPeriods > 20 ? "9.5" : "11"} fontWeight="700" fill={COLORS.gray800} fontFamily="Inter, sans-serif">
                                  {p}
                                </text>
                              </g>
                            );
                          } else {
                            const val = chartKebutuhanSeries[i] || 0;
                            const h = (val / niceMax) * plotH;
                            const bx = colCenterX - barColW / 2;
                            const by = MT + plotH - h;

                            return (
                              <g key={i}>
                                <rect x={bx} y={by} width={barColW} height={h} rx={3} fill={activeProgTheme.color} />
                                {numPeriods <= 20 && (
                                  <text x={colCenterX} y={by - 5} textAnchor="middle" fontSize="10" fontWeight="800" fill={activeProgTheme.color} fontFamily="monospace">
                                    {val}
                                  </text>
                                )}
                                <text x={colCenterX} y={H - MB + 22} textAnchor="middle" fontSize={numPeriods > 20 ? "9.5" : "11"} fontWeight="700" fill={COLORS.gray800} fontFamily="Inter, sans-serif">
                                  {p}
                                </text>
                              </g>
                            );
                          }
                        })}
                      </svg>
                    </div>
                  );
                }
              })()}
            </div>

            {/* 6. TABEL RINCIAN PROYEKSI KEBUTUHAN DANA DINAMIS */}
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>
                    Tabel Rincian Proyeksi Kebutuhan Dana — {selectedMitraView}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 1 }}>
                    Estimasi proyeksi klaim per program (Kalender Harian {formatIndoDate(startDate)} s.d. {formatIndoDate(endDate)} • {selectedRangeDaysCount} Hari)
                  </div>
                </div>

                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPreview({
                      title: `Laporan Proyeksi Kebutuhan Dana — ${selectedMitraView}`,
                      subtitle: `Periode Kalender Harian ${formatIndoDate(startDate)} s.d. ${formatIndoDate(endDate)} (THT, JKK, JKm)`,
                      type: "table",
                      fileName: `Proyeksi_Kalender_${startDate}_sd_${endDate}_${selectedMitraView.replace(/\s+/g, "_")}.xlsx`,
                      content: {
                        columns: [
                          "Program Manfaat",
                          ...periodLabels,
                          "Rata-rata/Hari",
                          "Puncak (Peak)",
                          "Total Proyeksi",
                          "Saldo Kas CMS",
                          "Ketahanan (+/-)",
                          "Status"
                        ],
                        rows: [
                          [
                            "THT (Tabungan Hari Tua)",
                            ...seriesTHT.map(v => `Rp ${v} M`),
                            `Rp ${avgTHT} M`,
                            `Rp ${peakTHT} M`,
                            `Rp ${sumTHT} M`,
                            `Rp ${activeMitraSaldoTHT} M`,
                            `${activeMitraSaldoTHT - sumTHT >= 0 ? "+" : ""}Rp ${+(activeMitraSaldoTHT - sumTHT).toFixed(1)} M`,
                            activeMitraSaldoTHT >= sumTHT ? "AMAN" : "DEFISIT"
                          ],
                          [
                            "JKK (Jaminan Kecelakaan Kerja)",
                            ...seriesJKK.map(v => `Rp ${v} M`),
                            `Rp ${avgJKK} M`,
                            `Rp ${peakJKK} M`,
                            `Rp ${sumJKK} M`,
                            `Rp ${activeMitraSaldoJKK} M`,
                            `${activeMitraSaldoJKK - sumJKK >= 0 ? "+" : ""}Rp ${+(activeMitraSaldoJKK - sumJKK).toFixed(1)} M`,
                            activeMitraSaldoJKK >= sumJKK ? "AMAN" : "DEFISIT"
                          ],
                          [
                            "JKm (Jaminan Kematian)",
                            ...seriesJKm.map(v => `Rp ${v} M`),
                            `Rp ${avgJKm} M`,
                            `Rp ${peakJKm} M`,
                            `Rp ${sumJKm} M`,
                            `Rp ${activeMitraSaldoJKm} M`,
                            `${activeMitraSaldoJKm - sumJKm >= 0 ? "+" : ""}Rp ${+(activeMitraSaldoJKm - sumJKm).toFixed(1)} M`,
                            activeMitraSaldoJKm >= sumJKm ? "AMAN" : "DEFISIT"
                          ],
                        ],
                        totalRow: [
                          { text: "TOTAL KONSOLIDASI PROGRAM", align: "left" },
                          ...seriesTotal.map(v => ({ text: `Rp ${v} M`, align: "right" })),
                          { text: `Rp ${avgTotal} M`, align: "right" },
                          { text: `Rp ${peakTotal} M`, align: "right" },
                          { text: `Rp ${sumTotal} M`, align: "right" },
                          { text: `Rp ${activeMitraSaldoTotal} M`, align: "right" },
                          { text: `${activeMitraSaldoTotal - sumTotal >= 0 ? "+" : ""}Rp ${+(activeMitraSaldoTotal - sumTotal).toFixed(1)} M`, align: "right" },
                          { text: activeMitraSaldoTotal >= sumTotal ? "■ AMAN" : "● DEFISIT", align: "center" }
                        ],
                        totalRows: 3
                      }
                    })
                  }
                >
                  <Download size={13} /> Ekspor Proyeksi (Excel)
                </Btn>
              </div>

              <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        Program Manfaat
                      </th>
                      {periodLabels.map((p, idx) => (
                        <th key={idx} style={{ padding: "9px 10px", textAlign: "right", fontWeight: 800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                          {p}
                        </th>
                      ))}
                      <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", background: "#F1F5F9", whiteSpace: "nowrap" }}>
                        Rata-rata/Hari
                      </th>
                      <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, color: COLORS.orange, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", background: "#FFF7ED", whiteSpace: "nowrap" }}>
                        Puncak
                      </th>
                      <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, color: COLORS.orange, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        Total Proyeksi
                      </th>
                      <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, color: COLORS.blueDark, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        Saldo Tersedia
                      </th>
                      <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 800, borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        Ketahanan Saldo (+/-)
                      </th>
                      <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 800, borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Baris 1: Program THT */}
                    <tr
                      onClick={() => setSelectedProgramView("THT (Tabungan Hari Tua)")}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        background: selectedProgramView.includes("THT") ? "#EFF6FF" : "#FFFFFF",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: "#1D4ED8", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        ● Program THT (Tabungan Hari Tua)
                      </td>
                      {seriesTHT.map((v, i) => (
                        <td key={i} style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                          Rp {v} M
                        </td>
                      ))}
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0", background: "#F1F5F9" }}>
                        Rp {avgTHT} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.orange, borderRight: "1px solid #E2E8F0", background: "#FFF7ED" }}>
                        Rp {peakTHT} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.orange, borderRight: "1px solid #E2E8F0" }}>
                        Rp {sumTHT} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0" }}>
                        Rp {activeMitraSaldoTHT} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: activeMitraSaldoTHT >= sumTHT ? COLORS.green : COLORS.red, borderRight: "1px solid #E2E8F0" }}>
                        {activeMitraSaldoTHT >= sumTHT ? "+" : ""}Rp {+(activeMitraSaldoTHT - sumTHT).toFixed(1)} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center" }}>
                        <Badge color={activeMitraSaldoTHT >= sumTHT ? "green" : "red"}>
                          {activeMitraSaldoTHT >= sumTHT ? "Aman" : "Defisit"}
                        </Badge>
                      </td>
                    </tr>

                    {/* Baris 2: Program JKK */}
                    <tr
                      onClick={() => setSelectedProgramView("JKK (Jaminan Kecelakaan Kerja)")}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        background: selectedProgramView.includes("JKK") ? "#FFF7ED" : "#FFFFFF",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: "#EA580C", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        ● Program JKK (Jaminan Kecelakaan Kerja)
                      </td>
                      {seriesJKK.map((v, i) => (
                        <td key={i} style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#EA580C", borderRight: "1px solid #E2E8F0" }}>
                          Rp {v} M
                        </td>
                      ))}
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0", background: "#F1F5F9" }}>
                        Rp {avgJKK} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.orange, borderRight: "1px solid #E2E8F0", background: "#FFF7ED" }}>
                        Rp {peakJKK} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.orange, borderRight: "1px solid #E2E8F0" }}>
                        Rp {sumJKK} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0" }}>
                        Rp {activeMitraSaldoJKK} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: activeMitraSaldoJKK >= sumJKK ? COLORS.green : COLORS.red, borderRight: "1px solid #E2E8F0" }}>
                        {activeMitraSaldoJKK >= sumJKK ? "+" : ""}Rp {+(activeMitraSaldoJKK - sumJKK).toFixed(1)} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center" }}>
                        <Badge color={activeMitraSaldoJKK >= sumJKK ? "green" : "red"}>
                          {activeMitraSaldoJKK >= sumJKK ? "Aman" : "Defisit"}
                        </Badge>
                      </td>
                    </tr>

                    {/* Baris 3: Program JKm */}
                    <tr
                      onClick={() => setSelectedProgramView("JKm (Jaminan Kematian)")}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        background: selectedProgramView.includes("JKm") ? "#FAF5FF" : "#FFFFFF",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: "#7C3AED", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        ● Program JKm (Jaminan Kematian)
                      </td>
                      {seriesJKm.map((v, i) => (
                        <td key={i} style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>
                          Rp {v} M
                        </td>
                      ))}
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0", background: "#F1F5F9" }}>
                        Rp {avgJKm} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.orange, borderRight: "1px solid #E2E8F0", background: "#FFF7ED" }}>
                        Rp {peakJKm} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.orange, borderRight: "1px solid #E2E8F0" }}>
                        Rp {sumJKm} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0" }}>
                        Rp {activeMitraSaldoJKm} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: activeMitraSaldoJKm >= sumJKm ? COLORS.green : COLORS.red, borderRight: "1px solid #E2E8F0" }}>
                        {activeMitraSaldoJKm >= sumJKm ? "+" : ""}Rp {+(activeMitraSaldoJKm - sumJKm).toFixed(1)} M
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center" }}>
                        <Badge color={activeMitraSaldoJKm >= sumJKm ? "green" : "red"}>
                          {activeMitraSaldoJKm >= sumJKm ? "Aman" : "Defisit"}
                        </Badge>
                      </td>
                    </tr>

                    {/* Baris 4: TOTAL KONSOLIDASI PROGRAM */}
                    <tr style={{ background: "#EDF2F7", fontWeight: 800, borderTop: "2px solid #CBD5E1" }}>
                      <td style={{ padding: "10px 12px", color: COLORS.blueDark, borderRight: "1px solid #CBD5E1", whiteSpace: "nowrap" }}>
                        TOTAL PROYEKSI KEBUTUHAN (KONSOLIDASI)
                      </td>
                      {seriesTotal.map((v, i) => (
                        <td key={i} style={{ padding: "10px 10px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                          Rp {v} M
                        </td>
                      ))}
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #CBD5E1", background: "#E2E8F0" }}>
                        Rp {avgTotal} M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.orange, borderRight: "1px solid #CBD5E1", background: "#FFEDD5" }}>
                        Rp {peakTotal} M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.orange, borderRight: "1px solid #CBD5E1" }}>
                        Rp {sumTotal} M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.blueDark, borderRight: "1px solid #CBD5E1" }}>
                        Rp {activeMitraSaldoTotal} M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: activeMitraSaldoTotal >= sumTotal ? COLORS.green : COLORS.red, borderRight: "1px solid #CBD5E1" }}>
                        {activeMitraSaldoTotal >= sumTotal ? "+" : ""}Rp {+(activeMitraSaldoTotal - sumTotal).toFixed(1)} M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <Badge color={activeMitraSaldoTotal >= sumTotal ? "green" : "red"}>
                          {activeMitraSaldoTotal >= sumTotal ? "■ AMAN" : "● DEFISIT"}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
            {/* Header Title */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                  Realisasi Surat Perintah (SP) oleh Mitra Bayar
                </h3>
                <Tooltip content="Komparasi volume Surat Perintah (SP) yang diterbitkan vs yang berhasil direalisasikan/ditransfer oleh masing-masing mitra bayar.">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#F1F5F9",
                      color: "#64748B",
                      cursor: "pointer",
                      border: "1px solid #CBD5E1"
                    }}
                  >
                    <Info size={12} />
                  </span>
                </Tooltip>
                <Badge color="green">
                  Total {totalSpTerealisasi} dari {totalSpDiterbitkan} SP Cair ({overallSuccessRate}%)
                </Badge>
              </div>
            </div>

            {/* Controls & Legends di Bawah Judul */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12,
                padding: "10px 14px",
                background: "#F8FAFC",
                borderRadius: 8,
                border: "1px solid #E2E8F0"
              }}
            >
              {/* Period Selector Filter */}
              <Select
                label="Filter Periode Realisasi SP"
                value={selectedPeriodeSP}
                onChange={setSelectedPeriodeSP}
                options={["Juli 2026 (Bulan Berjalan)", "Juni 2026", "Mei 2026", "Triwulan II 2026", "Tahun 2026 (YTD)"]}
                minW={220}
              />

              {/* Legends */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12, flexWrap: "wrap" }}>
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

            {/* SVG Grouped Bar Chart */}
            {(() => {
              const maxSPVal = Math.max(...computedSPMitra.map(m => m.spTotal));
              const step = maxSPVal > 2000 ? 500 : maxSPVal > 1000 ? 250 : 100;
              const maxSP = Math.ceil(maxSPVal / step) * step || 500;
              const W = 1180, H = 340, ML = 65, MR = 30, MT = 35, MB = 80;
              const plotW = W - ML - MR, plotH = H - MT - MB;
              const numGroups = computedSPMitra.length;
              const groupW = plotW / numGroups;
              const barW = 20;
              const gap = 5;
              const yAt = v => MT + plotH - (v / maxSP) * plotH;
              const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxSP * f));

              return (
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 950, height: "auto", display: "block" }}>
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
                            rx={3}
                            fill="#0141A8"
                            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          />
                          <text
                            x={x1 + barW / 2}
                            y={y1 - 6}
                            textAnchor="middle"
                            fontSize="10"
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
                            rx={3}
                            fill="#059669"
                            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          />
                          <text
                            x={x2 + barW / 2}
                            y={y2 - 6}
                            textAnchor="middle"
                            fontSize="10"
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
                            fontSize="10.5"
                            fontWeight="700"
                            fill={COLORS.gray900}
                            fontFamily="Inter, sans-serif"
                          >
                            {m.shortName || m.mitra}
                          </text>

                          {/* Success Rate Tag Under Mitra */}
                          <rect
                            x={groupCenterX - 30}
                            y={H - MB + 28}
                            width={60}
                            height={18}
                            rx={4}
                            fill={m.rateRealisasi >= 95 ? "#ECFDF5" : m.rateRealisasi >= 90 ? "#EFF6FF" : "#FFF8E1"}
                            stroke={m.rateRealisasi >= 95 ? "#A5D6A7" : m.rateRealisasi >= 90 ? "#90CAF9" : "#FFE082"}
                          />
                          <text
                            x={groupCenterX}
                            y={H - MB + 41}
                            textAnchor="middle"
                            fontSize="9.5"
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
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray900, marginBottom: 2 }}>{m.shortName || m.mitra}</div>
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
    </div>
  );
};

