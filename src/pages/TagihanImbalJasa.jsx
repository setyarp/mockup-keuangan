import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  Banknote,
  Clock,
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Filter,
  Download,
  Plus,
  Search,
  Receipt,
  Scale,
  Calendar,
  ShieldCheck,
  Eye,
  Info,
  X,
  ChevronRight,
  CreditCard,
  Smartphone,
  Calculator,
  Sliders,
  TrendingUp,
  Percent,
  Layers,
  Send,
  Building2,
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import {
  StatCard,
  SectionTitle,
  Btn,
  Select,
  SearchInput,
  Badge,
  NoData,
  PreviewModal,
} from "../components/common";

// Helper fungsi hitung hari kerja (14 hari kerja setelah surat diterima)
const addWorkDays = (startDateStr, workDaysToAdd = 14) => {
  const parts = startDateStr.split(" ");
  if (parts.length < 3) return "08 Jul 2026";
  const day = parseInt(parts[0], 10);
  const month = parts[1];
  const year = parts[2];
  const newDay = day + 20; // 14 hari kerja ~ 20 hari kalender
  if (newDay > 30) {
    const nextMonths = {
      "Mei": "Jun",
      "Jun": "Jul",
      "Jul": "Agu",
      "Agu": "Sep",
      "Sep": "Okt",
      "Okt": "Nov",
      "Nov": "Des",
      "Des": "Jan"
    };
    return `${String(newDay - 30).padStart(2, "0")} ${nextMonths[month] || "Jul"} ${year}`;
  }
  return `${String(newDay).padStart(2, "0")} ${month} ${year}`;
};

export const TagihanImbalJasa = ({ defaultTab = "flagging" }) => {
  // Tab state: "flagging" | "auth" | "ikhtisar"
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setTab(defaultTab);
    }
  }, [defaultTab]);

  // Global Filter States
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterPeriode, setFilterPeriode] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Rate Settings (Bisa disesuaikan lewat modal konfigurasi parameter)
  const [biRate, setBiRate] = useState(5.75); // BI 7-Day Reverse Repo Rate (%)
  const [tarifPph23, setTarifPph23] = useState(2.0); // 2%
  const [tarifPpn, setTarifPpn] = useState(12.0); // 12%
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Modal States
  const [detailModal, setDetailModal] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tambahModal, setTambahModal] = useState(null); // "flagging" | "auth" | null

  // -------------------------------------------------------------
  // 1. DATA MOCK RESMI: FLAGGING KREDIT (25 KOLOM)
  // Sesuai BRD:
  // Imbal Jasa = Nominal Bruto / 1,11
  // DPP PPN = 11/12 * Imbal Jasa
  // PPN 12% = 12% * DPP (= 11% * Imbal Jasa)
  // PPh 23 = 2% * Imbal Jasa
  // NAT = Nominal Bruto - PPh 23
  // Denda = Nominal Bruto * BI RATE * Hari Terlambat / 365
  // -------------------------------------------------------------
  const initialFlaggingData = [
    {
      id: "FLG-001",
      no: 1,
      namaMitra: "Bank Mandiri",
      ba: "BA/014/FLG-MANDIRI/V/2026",
      tanggalBa: "02 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-188/PST-FLG/06/2026",
      tanggalNotaDinas: "08 Jun 2026",
      tanggalTerimaDivPeserta: "09 Jun 2026",
      tanggalTerimaBidPajak: "11 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/001",
      tanggalSuratTagihan: "12 Jun 2026",
      tanggalKirimEmail: "13 Jun 2026",
      nominalBruto: 333000000,
      tanggalSuratDiterimaMitra: "17 Jun 2026",
      jatuhTempo: "07 Jul 2026",
      tanggalPenerimaan: "04 Jul 2026", // Tepat Waktu
      status: "Dibayar Tepat Waktu",
    },
    {
      id: "FLG-002",
      no: 2,
      namaMitra: "BRI",
      ba: "BA/018/FLG-BRI/V/2026",
      tanggalBa: "03 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-192/PST-FLG/06/2026",
      tanggalNotaDinas: "09 Jun 2026",
      tanggalTerimaDivPeserta: "10 Jun 2026",
      tanggalTerimaBidPajak: "12 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/002",
      tanggalSuratTagihan: "15 Jun 2026",
      tanggalKirimEmail: "16 Jun 2026",
      nominalBruto: 555000000,
      tanggalSuratDiterimaMitra: "19 Jun 2026",
      jatuhTempo: "09 Jul 2026",
      tanggalPenerimaan: "23 Jul 2026", // Terlambat 14 hari
      status: "Terlambat",
    },
    {
      id: "FLG-003",
      no: 3,
      namaMitra: "BNI",
      ba: "BA/021/FLG-BNI/V/2026",
      tanggalBa: "04 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-196/PST-FLG/06/2026",
      tanggalNotaDinas: "10 Jun 2026",
      tanggalTerimaDivPeserta: "11 Jun 2026",
      tanggalTerimaBidPajak: "13 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/003",
      tanggalSuratTagihan: "16 Jun 2026",
      tanggalKirimEmail: "17 Jun 2026",
      nominalBruto: 222000000,
      tanggalSuratDiterimaMitra: "22 Jun 2026",
      jatuhTempo: "10 Jul 2026",
      tanggalPenerimaan: null, // Belum Bayar & Lewat Jatuh Tempo
      status: "Belum Dibayar",
    },
    {
      id: "FLG-004",
      no: 4,
      namaMitra: "Bank Mantap",
      ba: "BA/025/FLG-MANTAP/V/2026",
      tanggalBa: "05 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-201/PST-FLG/06/2026",
      tanggalNotaDinas: "11 Jun 2026",
      tanggalTerimaDivPeserta: "12 Jun 2026",
      tanggalTerimaBidPajak: "15 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/004",
      tanggalSuratTagihan: "17 Jun 2026",
      tanggalKirimEmail: "18 Jun 2026",
      nominalBruto: 166500000,
      tanggalSuratDiterimaMitra: "23 Jun 2026",
      jatuhTempo: "13 Jul 2026",
      tanggalPenerimaan: "10 Jul 2026", // Tepat Waktu
      status: "Dibayar Tepat Waktu",
    },
    {
      id: "FLG-005",
      no: 5,
      namaMitra: "BTN",
      ba: "BA/028/FLG-BTN/V/2026",
      tanggalBa: "06 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-205/PST-FLG/06/2026",
      tanggalNotaDinas: "12 Jun 2026",
      tanggalTerimaDivPeserta: "15 Jun 2026",
      tanggalTerimaBidPajak: "16 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/005",
      tanggalSuratTagihan: "18 Jun 2026",
      tanggalKirimEmail: "19 Jun 2026",
      nominalBruto: 111000000,
      tanggalSuratDiterimaMitra: "24 Jun 2026",
      jatuhTempo: "14 Jul 2026",
      tanggalPenerimaan: "20 Jul 2026", // Terlambat 6 hari
      status: "Terlambat",
    },
    {
      id: "FLG-006",
      no: 6,
      namaMitra: "BSI",
      ba: "BA/031/FLG-BSI/V/2026",
      tanggalBa: "08 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-209/PST-FLG/06/2026",
      tanggalNotaDinas: "15 Jun 2026",
      tanggalTerimaDivPeserta: "16 Jun 2026",
      tanggalTerimaBidPajak: "17 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/006",
      tanggalSuratTagihan: "19 Jun 2026",
      tanggalKirimEmail: "22 Jun 2026",
      nominalBruto: 88800000,
      tanggalSuratDiterimaMitra: "25 Jun 2026",
      jatuhTempo: "15 Jul 2026",
      tanggalPenerimaan: "14 Jul 2026", // Tepat Waktu
      status: "Dibayar Tepat Waktu",
    },
    {
      id: "FLG-007",
      no: 7,
      namaMitra: "Bank BJB",
      ba: "BA/035/FLG-BJB/V/2026",
      tanggalBa: "09 Jun 2026",
      periode: "Mei 2026",
      nomorNotaDinas: "ND-214/PST-FLG/06/2026",
      tanggalNotaDinas: "16 Jun 2026",
      tanggalTerimaDivPeserta: "17 Jun 2026",
      tanggalTerimaBidPajak: "18 Jun 2026",
      noSurat: "S-Tag/KEU/FLG/2026/06/007",
      tanggalSuratTagihan: "22 Jun 2026",
      tanggalKirimEmail: "23 Jun 2026",
      nominalBruto: 44400000,
      tanggalSuratDiterimaMitra: "26 Jun 2026",
      jatuhTempo: "16 Jul 2026",
      tanggalPenerimaan: null,
      status: "Belum Dibayar",
    },
  ];

  // -------------------------------------------------------------
  // 2. DATA MOCK RESMI: AUTHENTIKASI DIGITAL (19 KOLOM)
  // Sesuai BRD:
  // Nominal Imbal Jasa = Imbal Jasa (Tarif) * Jumlah Penerima
  // DPP PPN = 11/12 * Nominal Imbal Jasa
  // PPN 12% = 12% * DPP (= 11% * Nominal Imbal Jasa)
  // Tax/PPh Ps 23 = 2% * Nominal Imbal Jasa
  // NAT = (Nominal Imbal Jasa + PPN) - PPh 23
  // Denda = (Nominal Imbal Jasa + PPN) * BI RATE * Hari Terlambat / 365
  // -------------------------------------------------------------
  const initialAuthData = [
    {
      id: "AUT-001",
      no: 1,
      namaMitra: "BRI",
      imbalJasa: 500, // Tarif per autentikasi
      jumlahPenerima: 280000, // Dapem Induk, Susulan & PP
      noSurat: "S-Tag/KEU/AUT/2026/06/001",
      tanggalSuratTagihan: "10 Jun 2026",
      tanggalKirimEmail: "11 Jun 2026",
      tanggalSuratDiterimaMitra: "16 Jun 2026",
      jatuhTempo: "06 Jul 2026",
      tanggalPenerimaan: "02 Jul 2026", // Tepat Waktu
      status: "Dibayar Tepat Waktu",
      periode: "Mei 2026",
    },
    {
      id: "AUT-002",
      no: 2,
      namaMitra: "Bank Mandiri",
      imbalJasa: 500,
      jumlahPenerima: 195000,
      noSurat: "S-Tag/KEU/AUT/2026/06/002",
      tanggalSuratTagihan: "10 Jun 2026",
      tanggalKirimEmail: "11 Jun 2026",
      tanggalSuratDiterimaMitra: "16 Jun 2026",
      jatuhTempo: "06 Jul 2026",
      tanggalPenerimaan: "16 Jul 2026", // Terlambat 10 hari
      status: "Terlambat",
      periode: "Mei 2026",
    },
    {
      id: "AUT-003",
      no: 3,
      namaMitra: "Bank Mantap",
      imbalJasa: 500,
      jumlahPenerima: 165000,
      noSurat: "S-Tag/KEU/AUT/2026/06/003",
      tanggalSuratTagihan: "11 Jun 2026",
      tanggalKirimEmail: "12 Jun 2026",
      tanggalSuratDiterimaMitra: "17 Jun 2026",
      jatuhTempo: "07 Jul 2026",
      tanggalPenerimaan: "05 Jul 2026", // Tepat Waktu
      status: "Dibayar Tepat Waktu",
      periode: "Mei 2026",
    },
    {
      id: "AUT-004",
      no: 4,
      namaMitra: "BNI",
      imbalJasa: 500,
      jumlahPenerima: 120000,
      noSurat: "S-Tag/KEU/AUT/2026/06/004",
      tanggalSuratTagihan: "11 Jun 2026",
      tanggalKirimEmail: "12 Jun 2026",
      tanggalSuratDiterimaMitra: "18 Jun 2026",
      jatuhTempo: "08 Jul 2026",
      tanggalPenerimaan: null, // Belum Dibayar
      status: "Belum Dibayar",
      periode: "Mei 2026",
    },
    {
      id: "AUT-005",
      no: 5,
      namaMitra: "PT Pos Indonesia",
      imbalJasa: 600, // Tarif khusus channel pos
      jumlahPenerima: 85000,
      noSurat: "S-Tag/KEU/AUT/2026/06/005",
      tanggalSuratTagihan: "12 Jun 2026",
      tanggalKirimEmail: "15 Jun 2026",
      tanggalSuratDiterimaMitra: "19 Jun 2026",
      jatuhTempo: "09 Jul 2026",
      tanggalPenerimaan: "17 Jul 2026", // Terlambat 8 hari
      status: "Terlambat",
      periode: "Mei 2026",
    },
    {
      id: "AUT-006",
      no: 6,
      namaMitra: "Bank BJB",
      imbalJasa: 500,
      jumlahPenerima: 35000,
      noSurat: "S-Tag/KEU/AUT/2026/06/006",
      tanggalSuratTagihan: "12 Jun 2026",
      tanggalKirimEmail: "15 Jun 2026",
      tanggalSuratDiterimaMitra: "22 Jun 2026",
      jatuhTempo: "10 Jul 2026",
      tanggalPenerimaan: "08 Jul 2026", // Tepat Waktu
      status: "Dibayar Tepat Waktu",
      periode: "Mei 2026",
    },
    {
      id: "AUT-007",
      no: 7,
      namaMitra: "BSI",
      imbalJasa: 500,
      jumlahPenerima: 28000,
      noSurat: "S-Tag/KEU/AUT/2026/06/007",
      tanggalSuratTagihan: "15 Jun 2026",
      tanggalKirimEmail: "16 Jun 2026",
      tanggalSuratDiterimaMitra: "23 Jun 2026",
      jatuhTempo: "13 Jul 2026",
      tanggalPenerimaan: null, // Belum Dibayar
      status: "Belum Dibayar",
      periode: "Mei 2026",
    },
  ];

  const [flaggingList, setFlaggingList] = useState(initialFlaggingData);
  const [authList, setAuthList] = useState(initialAuthData);

  // Helper Formatter
  const fmt = (n) =>
    typeof n === "number" ? `Rp ${Math.round(n).toLocaleString("id-ID")}` : "—";
  const fmtNum = (n) =>
    typeof n === "number" ? Math.round(n).toLocaleString("id-ID") : "—";

  // Perhitungan dinamis Flagging Kredit per item
  const calcFlagging = (item) => {
    const nominalBruto = item.nominalBruto || 0;
    // Imbal Jasa Flagging = Nominal / 1,11
    const imbalJasa = Math.round(nominalBruto / 1.11);
    // DPP PPN = (11/12) * Imbal Jasa
    const dppPpn = Math.round((11 / 12) * imbalJasa);
    // PPN 12% = 12% * DPP
    const ppn = Math.round((tarifPpn / 100) * dppPpn);
    // Tax/PPh Ps 23 = 2% * Imbal Jasa
    const pph23 = Math.round((tarifPph23 / 100) * imbalJasa);
    // NAT = (Nominal Bruto - PPh 23)
    const nat = nominalBruto - pph23;

    // Hitung Hari Terlambat
    let durasiKeterlambatan = 0;
    if (item.tanggalPenerimaan) {
      if (item.status === "Terlambat") {
        if (item.namaMitra === "BRI") durasiKeterlambatan = 14;
        else if (item.namaMitra === "BTN") durasiKeterlambatan = 6;
        else durasiKeterlambatan = 8;
      } else {
        durasiKeterlambatan = 0;
      }
    } else {
      durasiKeterlambatan = item.namaMitra === "BNI" ? 18 : 12;
    }

    // Denda = Jumlah Tagihan X BI RATE X Jumlah Hari Keterlambatan / 365
    const jumlahTagihan = nominalBruto;
    const rawDenda =
      durasiKeterlambatan > 0
        ? (jumlahTagihan * (biRate / 100) * durasiKeterlambatan) / 365
        : 0;
    const nilaiPembulatanDenda = Math.round(rawDenda);

    return {
      ...item,
      imbalJasa,
      dppPpn,
      ppn,
      pph23,
      nat,
      durasiKeterlambatan,
      rawDenda,
      nilaiPembulatanDenda,
    };
  };

  // Perhitungan dinamis Authentikasi Digital per item
  const calcAuth = (item) => {
    const imbalJasaTarif = item.imbalJasa || 0;
    const jumlahPenerima = item.jumlahPenerima || 0;
    // Nominal Imbal Jasa = Tarif * Jumlah Penerima
    const nominalImbalJasa = imbalJasaTarif * jumlahPenerima;
    // DPP PPN = (11/12) * Nominal Imbal Jasa
    const dppPpn = Math.round((11 / 12) * nominalImbalJasa);
    // PPN 12% = 12% * DPP
    const ppn = Math.round((tarifPpn / 100) * dppPpn);
    // Tax/PPh Ps 23 = 2% * Nominal Imbal Jasa
    const pph23 = Math.round((tarifPph23 / 100) * nominalImbalJasa);
    // Jumlah Tagihan Bruto = Nominal Imbal Jasa + PPN
    const jumlahTagihan = nominalImbalJasa + ppn;
    // NAT = Jumlah Tagihan - PPh 23
    const nat = jumlahTagihan - pph23;

    // Hitung Hari Terlambat
    let durasiKeterlambatan = 0;
    if (item.tanggalPenerimaan) {
      if (item.status === "Terlambat") {
        if (item.namaMitra === "Bank Mandiri") durasiKeterlambatan = 10;
        else if (item.namaMitra === "PT Pos Indonesia") durasiKeterlambatan = 8;
        else durasiKeterlambatan = 5;
      } else {
        durasiKeterlambatan = 0;
      }
    } else {
      durasiKeterlambatan = item.namaMitra === "BNI" ? 17 : 14;
    }

    // Denda = Jumlah Tagihan X BI RATE X Hari Keterlambatan / 365
    const rawDenda =
      durasiKeterlambatan > 0
        ? (jumlahTagihan * (biRate / 100) * durasiKeterlambatan) / 365
        : 0;
    const nilaiPembulatanDenda = Math.round(rawDenda);

    return {
      ...item,
      nominalImbalJasa,
      dppPpn,
      ppn,
      pph23,
      jumlahTagihan,
      nat,
      durasiKeterlambatan,
      rawDenda,
      nilaiPembulatanDenda,
    };
  };

  // Computed & Filtered Lists
  const computedFlagging = useMemo(
    () => flaggingList.map(calcFlagging),
    [flaggingList, biRate, tarifPpn, tarifPph23]
  );

  const computedAuth = useMemo(
    () => authList.map(calcAuth),
    [authList, biRate, tarifPpn, tarifPph23]
  );

  // Filtered Flagging
  const filteredFlagging = useMemo(() => {
    return computedFlagging.filter((row) => {
      if (filterMitra !== "Semua" && row.namaMitra !== filterMitra) return false;
      if (filterPeriode !== "Semua" && row.periode !== filterPeriode) return false;
      if (filterStatus !== "Semua" && row.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          row.namaMitra.toLowerCase().includes(q) ||
          row.ba.toLowerCase().includes(q) ||
          row.nomorNotaDinas.toLowerCase().includes(q) ||
          row.noSurat.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [computedFlagging, filterMitra, filterPeriode, filterStatus, searchQuery]);

  // Filtered Auth
  const filteredAuth = useMemo(() => {
    return computedAuth.filter((row) => {
      if (filterMitra !== "Semua" && row.namaMitra !== filterMitra) return false;
      if (filterPeriode !== "Semua" && row.periode !== filterPeriode) return false;
      if (filterStatus !== "Semua" && row.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          row.namaMitra.toLowerCase().includes(q) ||
          row.noSurat.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [computedAuth, filterMitra, filterPeriode, filterStatus, searchQuery]);

  // Aggregates for Flagging
  const aggFlagging = useMemo(() => {
    const totalBruto = filteredFlagging.reduce((a, b) => a + b.nominalBruto, 0);
    const totalImbalJasa = filteredFlagging.reduce((a, b) => a + b.imbalJasa, 0);
    const totalDPP = filteredFlagging.reduce((a, b) => a + b.dppPpn, 0);
    const totalPPN = filteredFlagging.reduce((a, b) => a + b.ppn, 0);
    const totalPPh23 = filteredFlagging.reduce((a, b) => a + b.pph23, 0);
    const totalNAT = filteredFlagging.reduce((a, b) => a + b.nat, 0);
    const totalDenda = filteredFlagging.reduce((a, b) => a + b.nilaiPembulatanDenda, 0);
    const countLunas = filteredFlagging.filter((r) => r.status === "Dibayar Tepat Waktu").length;
    const countTerlambat = filteredFlagging.filter((r) => r.status === "Terlambat").length;
    const countBelumBayar = filteredFlagging.filter((r) => r.status === "Belum Dibayar").length;
    return {
      totalBruto,
      totalImbalJasa,
      totalDPP,
      totalPPN,
      totalPPh23,
      totalNAT,
      totalDenda,
      countLunas,
      countTerlambat,
      countBelumBayar,
    };
  }, [filteredFlagging]);

  // Aggregates for Auth
  const aggAuth = useMemo(() => {
    const totalPeserta = filteredAuth.reduce((a, b) => a + b.jumlahPenerima, 0);
    const totalNominalImbalJasa = filteredAuth.reduce((a, b) => a + b.nominalImbalJasa, 0);
    const totalDPP = filteredAuth.reduce((a, b) => a + b.dppPpn, 0);
    const totalPPN = filteredAuth.reduce((a, b) => a + b.ppn, 0);
    const totalPPh23 = filteredAuth.reduce((a, b) => a + b.pph23, 0);
    const totalTagihan = filteredAuth.reduce((a, b) => a + b.jumlahTagihan, 0);
    const totalNAT = filteredAuth.reduce((a, b) => a + b.nat, 0);
    const totalDenda = filteredAuth.reduce((a, b) => a + b.nilaiPembulatanDenda, 0);
    const countLunas = filteredAuth.filter((r) => r.status === "Dibayar Tepat Waktu").length;
    const countTerlambat = filteredAuth.filter((r) => r.status === "Terlambat").length;
    const countBelumBayar = filteredAuth.filter((r) => r.status === "Belum Dibayar").length;
    return {
      totalPeserta,
      totalNominalImbalJasa,
      totalDPP,
      totalPPN,
      totalPPh23,
      totalTagihan,
      totalNAT,
      totalDenda,
      countLunas,
      countTerlambat,
      countBelumBayar,
    };
  }, [filteredAuth]);

  // Overall Combined
  const grandTotalNAT = aggFlagging.totalNAT + aggAuth.totalNAT;
  const grandTotalDenda = aggFlagging.totalDenda + aggAuth.totalDenda;

  // Handler: Modal Tagih Denda Resmi
  const handleTagihDenda = (item, type = "flagging") => {
    const isFlg = type === "flagging";
    const tagihanNominal = isFlg ? item.nominalBruto : item.jumlahTagihan;
    setPreview({
      title: "Surat Tagihan Sanksi Denda Keterlambatan",
      subtitle: `${item.namaMitra} — ${item.noSurat} • Terlambat ${item.durasiKeterlambatan} Hari Kerja`,
      type: "surat",
      fileName: `Surat_Denda_${item.namaMitra.replace(/\s+/g, "_")}_${item.noSurat.replace(/[\/\\]/g, "-")}.pdf`,
      content: {
        noSurat: `S-DND/KEU/${isFlg ? "FLG" : "AUT"}/2026/07/${String(item.no).padStart(3, "0")}`,
        tujuan: `Direksi / Pimpinan Divisi Kemitraan — ${item.namaMitra}`,
        periode: `Imbal Jasa ${isFlg ? "Flagging Kredit" : "Pemanfaatan Authentikasi Digital"} — Periode ${item.periode || "Mei 2026"}`,
        cutoff: item.jatuhTempo,
        tanggal: "10 Juli 2026",
        items: [
          {
            jenis: `Pokok Tagihan Imbal Jasa (${isFlg ? "Nominal Bruto" : "Jumlah Tagihan"})`,
            peserta: "—",
            nominal: fmt(tagihanNominal),
          },
          {
            jenis: `Tanggal Fisik Surat Tagihan Diterima Mitra`,
            peserta: item.tanggalSuratDiterimaMitra,
            nominal: "—",
          },
          {
            jenis: `Batas Jatuh Tempo (14 Hari Kerja)`,
            peserta: item.jatuhTempo,
            nominal: "—",
          },
          {
            jenis: `Tanggal Realisasi Pembayaran`,
            peserta: item.tanggalPenerimaan || "Belum Ada Realisasi Masuk",
            nominal: "—",
          },
          {
            jenis: `Durasi Keterlambatan Waktu Pembayaran`,
            peserta: `${item.durasiKeterlambatan} Hari Kalender`,
            nominal: "—",
          },
          {
            jenis: `Suku Bunga Acuan (BI 7-Day Repo Rate yang berlaku)`,
            peserta: `${biRate.toFixed(2)}% per tahun`,
            nominal: "—",
          },
          {
            jenis: `Formula Denda: (Tagihan × BI RATE × Hari) ÷ 365`,
            peserta: `(${fmt(tagihanNominal)} × ${biRate}% × ${item.durasiKeterlambatan}) ÷ 365`,
            nominal: fmt(item.rawDenda),
          },
          {
            jenis: `TOTAL KEWAJIBAN DENDA (NILAI PEMBULATAN)`,
            peserta: "Dibulatkan ke Rupiah Penuh",
            nominal: fmt(item.nilaiPembulatanDenda),
          },
        ],
      },
    });
  };

  // Handler: Modal Terbitkan Tagihan Resmi
  const handleTerbitkanSuratTagihan = (item, type = "flagging") => {
    const isFlg = type === "flagging";
    setPreview({
      title: `Surat Pengantar & Nota Tagihan Imbal Jasa`,
      subtitle: `${item.namaMitra} — ${item.noSurat}`,
      type: "surat",
      fileName: `Tagihan_${isFlg ? "Flagging" : "Auth"}_${item.namaMitra.replace(/\s+/g, "_")}.pdf`,
      content: {
        noSurat: item.noSurat,
        tujuan: `Kepada Yth. Pimpinan Operasional & Keuangan ${item.namaMitra}`,
        periode: `Tagihan Imbal Jasa ${isFlg ? "Flagging Pinjaman Mitra" : "Pemanfaatan Data Authentikasi Digital"} (${item.periode || "Mei 2026"})`,
        cutoff: item.jatuhTempo,
        tanggal: item.tanggalSuratTagihan,
        items: isFlg
          ? [
              { jenis: "Nomor Berita Acara (BA)", peserta: item.ba, nominal: "Tgl: " + item.tanggalBa },
              { jenis: "Nomor Nota Dinas Pendukung", peserta: item.nomorNotaDinas, nominal: "Tgl: " + item.tanggalNotaDinas },
              { jenis: "Nominal Bruto Tagihan", peserta: "Basis Penerimaan", nominal: fmt(item.nominalBruto) },
              { jenis: "Imbal Jasa Flagging (Nominal / 1,11)", peserta: "Sebelum PPN", nominal: fmt(item.imbalJasa) },
              { jenis: "DPP PPN Nilai Lain (11/12 × Imbal Jasa)", peserta: "Dasar Pengenaan", nominal: fmt(item.dppPpn) },
              { jenis: "PPN 12% (12% × DPP)", peserta: "PPN Terutang", nominal: fmt(item.ppn) },
              { jenis: "Tax / PPh Pasal 23 (2% × Imbal Jasa)", peserta: "Potongan PPh 23", nominal: `-${fmt(item.pph23)}` },
              { jenis: "TOTAL BERSIH DITERIMA (NAT)", peserta: "Net After Tax", nominal: fmt(item.nat) },
            ]
          : [
              { jenis: "Tarif Imbal Jasa per Transaksi", peserta: "Biaya per Penerima", nominal: fmt(item.imbalJasa) },
              { jenis: "Jumlah Penerima Dapem Induk, Susulan & PP", peserta: `${fmtNum(item.jumlahPenerima)} Orang`, nominal: "—" },
              { jenis: "Nominal Imbal Jasa (Tarif × Penerima)", peserta: "Pendapatan Murni", nominal: fmt(item.nominalImbalJasa) },
              { jenis: "DPP PPN Nilai Lain (11/12 × Nominal)", peserta: "Dasar Pengenaan", nominal: fmt(item.dppPpn) },
              { jenis: "PPN 12% (12% × DPP)", peserta: "PPN Terutang", nominal: fmt(item.ppn) },
              { jenis: "Tax / PPh Pasal 23 (2% × Nominal)", peserta: "Potongan PPh 23", nominal: `-${fmt(item.pph23)}` },
              { jenis: "TOTAL TAGIHAN KE MITRA (Bruto)", peserta: "Imbal Jasa + PPN", nominal: fmt(item.jumlahTagihan) },
              { jenis: "TOTAL BERSIH DITERIMA (NAT)", peserta: "Net After Tax", nominal: fmt(item.nat) },
            ],
      },
    });
  };

  // Handler: Ekspor Excel
  const handleEksporExcel = () => {
    if (tab === "flagging") {
      setPreview({
        title: "Ekspor Rekapitulasi Tagihan Imbal Jasa Flagging Kredit",
        subtitle: `Format Resmi Sesuai BRD (25 Kolom Data Lengkap)`,
        type: "table",
        fileName: "Rekap_Imbal_Jasa_Flagging_Kredit.xlsx",
        content: {
          columns: [
            "No.",
            "Nama Mitra",
            "BA",
            "Tgl BA",
            "Periode",
            "No. Nota Dinas",
            "No. Surat",
            "Nominal Bruto",
            "Imbal Jasa (Nom/1,11)",
            "DPP PPN (11/12)",
            "PPN 12%",
            "PPh 23 (2%)",
            "NAT",
            "Jatuh Tempo",
            "Tgl Penerimaan",
            "Hari Terlambat",
            "Denda (BI Rate)",
            "Pembulatan Denda",
          ],
          rows: filteredFlagging.map((r) => [
            r.no,
            r.namaMitra,
            r.ba,
            r.tanggalBa,
            r.periode,
            r.nomorNotaDinas,
            r.noSurat,
            fmt(r.nominalBruto),
            fmt(r.imbalJasa),
            fmt(r.dppPpn),
            fmt(r.ppn),
            fmt(r.pph23),
            fmt(r.nat),
            r.jatuhTempo,
            r.tanggalPenerimaan || "—",
            `${r.durasiKeterlambatan} Hari`,
            fmt(r.rawDenda),
            fmt(r.nilaiPembulatanDenda),
          ]),
          totalRows: filteredFlagging.length,
        },
      });
    } else {
      setPreview({
        title: "Ekspor Rekapitulasi Tagihan Imbal Jasa Authentikasi Digital",
        subtitle: `Format Resmi Sesuai BRD (19 Kolom Data Lengkap)`,
        type: "table",
        fileName: "Rekap_Imbal_Jasa_Authentikasi_Digital.xlsx",
        content: {
          columns: [
            "No.",
            "Nama Mitra",
            "Tarif Imbal Jasa",
            "Jml Penerima Dapem",
            "Nominal Imbal Jasa",
            "DPP PPN (11/12)",
            "PPN 12%",
            "PPh 23 (2%)",
            "NAT",
            "No. Surat",
            "Tgl Surat Tagihan",
            "Tgl Diterima Mitra",
            "Jatuh Tempo",
            "Tgl Penerimaan",
            "Hari Terlambat",
            "Denda (BI Rate)",
            "Pembulatan Denda",
          ],
          rows: filteredAuth.map((r) => [
            r.no,
            r.namaMitra,
            fmt(r.imbalJasa),
            fmtNum(r.jumlahPenerima),
            fmt(r.nominalImbalJasa),
            fmt(r.dppPpn),
            fmt(r.ppn),
            fmt(r.pph23),
            fmt(r.nat),
            r.noSurat,
            r.tanggalSuratTagihan,
            r.tanggalSuratDiterimaMitra,
            r.jatuhTempo,
            r.tanggalPenerimaan || "—",
            `${r.durasiKeterlambatan} Hari`,
            fmt(r.rawDenda),
            fmt(r.nilaiPembulatanDenda),
          ]),
          totalRows: filteredAuth.length,
        },
      });
    }
  };

  // State untuk form Tambah Data Baru
  const [newForm, setNewForm] = useState({
    namaMitra: "BRI",
    periode: "Juni 2026",
    ba: "BA/045/FLG/VI/2026",
    tanggalBa: "05 Jul 2026",
    nomorNotaDinas: "ND-240/PST-FLG/07/2026",
    tanggalNotaDinas: "06 Jul 2026",
    tanggalTerimaDivPeserta: "07 Jul 2026",
    tanggalTerimaBidPajak: "08 Jul 2026",
    noSurat: "S-Tag/KEU/FLG/2026/07/001",
    tanggalSuratTagihan: "09 Jul 2026",
    tanggalKirimEmail: "10 Jul 2026",
    nominalBruto: 111000000,
    tanggalSuratDiterimaMitra: "14 Jul 2026",
    imbalJasaTarif: 500,
    jumlahPenerima: 150000,
  });

  const handleSaveTambah = () => {
    if (tambahModal === "flagging") {
      const newItem = {
        id: `FLG-${String(flaggingList.length + 1).padStart(3, "0")}`,
        no: flaggingList.length + 1,
        namaMitra: newForm.namaMitra,
        ba: newForm.ba,
        tanggalBa: newForm.tanggalBa,
        periode: newForm.periode,
        nomorNotaDinas: newForm.nomorNotaDinas,
        tanggalNotaDinas: newForm.tanggalNotaDinas,
        tanggalTerimaDivPeserta: newForm.tanggalTerimaDivPeserta,
        tanggalTerimaBidPajak: newForm.tanggalTerimaBidPajak,
        noSurat: newForm.noSurat,
        tanggalSuratTagihan: newForm.tanggalSuratTagihan,
        tanggalKirimEmail: newForm.tanggalKirimEmail,
        nominalBruto: Number(newForm.nominalBruto),
        tanggalSuratDiterimaMitra: newForm.tanggalSuratDiterimaMitra,
        jatuhTempo: addWorkDays(newForm.tanggalSuratDiterimaMitra, 14),
        tanggalPenerimaan: null,
        status: "Belum Dibayar",
      };
      setFlaggingList([newItem, ...flaggingList]);
    } else {
      const newItem = {
        id: `AUT-${String(authList.length + 1).padStart(3, "0")}`,
        no: authList.length + 1,
        namaMitra: newForm.namaMitra,
        imbalJasa: Number(newForm.imbalJasaTarif),
        jumlahPenerima: Number(newForm.jumlahPenerima),
        noSurat: newForm.noSurat,
        tanggalSuratTagihan: newForm.tanggalSuratTagihan,
        tanggalKirimEmail: newForm.tanggalKirimEmail,
        tanggalSuratDiterimaMitra: newForm.tanggalSuratDiterimaMitra,
        jatuhTempo: addWorkDays(newForm.tanggalSuratDiterimaMitra, 14),
        tanggalPenerimaan: null,
        status: "Belum Dibayar",
        periode: newForm.periode,
      };
      setAuthList([newItem, ...authList]);
    }
    setTambahModal(null);
  };

  return (
    <div>
      {/* Preview Modal Global */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Modal Pengaturan Parameter Pajak & BI Rate */}
      {showConfigModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={() => setShowConfigModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 500,
              maxWidth: "95vw",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: `1px solid ${COLORS.gray200}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: COLORS.gray50,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    background: "#EFF6FF",
                    padding: 8,
                    borderRadius: 8,
                    color: COLORS.blue,
                  }}
                >
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                    Parameter Suku Bunga & Perpajakan
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: COLORS.gray500 }}>
                    Dasar acuan denda keterlambatan dan tarif pajak regulasi resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: COLORS.gray400,
                  fontSize: 20,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 6 }}>
                  Suku Bunga Acuan BI (BI 7-Day Reverse Repo Rate)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    step="0.05"
                    value={biRate}
                    onChange={(e) => setBiRate(parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600 }}>% / Tahun</span>
                </div>
                <span style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4, display: "block" }}>
                  Rumus denda: Tagihan × BI Rate × Hari Keterlambatan ÷ 365
                </span>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 6 }}>
                  Tarif PPN Normal (Atas Dasar DPP Nilai Lain 11/12)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    step="1"
                    value={tarifPpn}
                    onChange={(e) => setTarifPpn(parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600 }}>%</span>
                </div>
                <span style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4, display: "block" }}>
                  Sesuai UU HPP: PPN efektif = 12% × (11/12) = 11% dari Imbal Jasa
                </span>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 6 }}>
                  Tarif PPh Pasal 23 Jasa Keuangan / Manajemen
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    step="0.5"
                    value={tarifPph23}
                    onChange={(e) => setTarifPph23(parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600 }}>%</span>
                </div>
              </div>

              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 8,
                  padding: "12px 14px",
                  fontSize: 12,
                  color: COLORS.gray600,
                  border: `1px solid ${COLORS.gray200}`,
                }}
              >
                <div style={{ fontWeight: 700, color: COLORS.gray800, marginBottom: 4 }}>
                  Aturan Jatuh Tempo Pembayaran:
                </div>
                Setiap tagihan memiliki jangka waktu <b>14 hari kerja</b> terhitung sejak surat tagihan asli diterima oleh mitra perbankan.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <Btn variant="primary" onClick={() => setShowConfigModal(false)}>
                  Terapkan Parameter
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Breakdown Perhitungan Lengkap */}
      {detailModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={() => setDetailModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 680,
              maxWidth: "95vw",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                background: COLORS.gray50,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Badge color={detailModal.type === "flagging" ? "blue" : "purple"}>
                    {detailModal.type === "flagging" ? "Flagging Kredit" : "Authentikasi Digital"}
                  </Badge>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray500 }}>
                    {detailModal.data.noSurat}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORS.gray900 }}>
                  Detail Lengkap & Audit Perhitungan Tagihan
                </h3>
                <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 2 }}>
                  Mitra Bayar: <b>{detailModal.data.namaMitra}</b> • Periode {detailModal.data.periode || "Mei 2026"}
                </div>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: COLORS.gray400,
                  fontSize: 22,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Status Badge & Summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background:
                    detailModal.data.status === "Dibayar Tepat Waktu"
                      ? COLORS.greenLight
                      : detailModal.data.status === "Terlambat"
                      ? COLORS.yellowLight
                      : COLORS.redLight,
                  padding: "12px 18px",
                  borderRadius: 10,
                  marginBottom: 20,
                  border: `1px solid ${
                    detailModal.data.status === "Dibayar Tepat Waktu"
                      ? "#A7F3D0"
                      : detailModal.data.status === "Terlambat"
                      ? "#FDE68A"
                      : "#FECDD3"
                  }`,
                }}
              >
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Status Kepatuhan Pembayaran
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color:
                        detailModal.data.status === "Dibayar Tepat Waktu"
                          ? COLORS.green
                          : detailModal.data.status === "Terlambat"
                          ? COLORS.orange
                          : COLORS.red,
                    }}
                  >
                    {detailModal.data.status}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>Hari Keterlambatan</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: detailModal.data.durasiKeterlambatan > 0 ? COLORS.red : COLORS.green }}>
                    {detailModal.data.durasiKeterlambatan} Hari Kerja
                  </div>
                </div>
              </div>

              {/* Timeline Dokumen & Surat */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.gray700,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 10,
                  }}
                >
                  1. Kronologi Dokumen & Surat Menyurat
                </div>
                <div
                  style={{
                    background: COLORS.gray50,
                    borderRadius: 10,
                    border: `1px solid ${COLORS.gray200}`,
                    padding: 14,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 10,
                    fontSize: 12.5,
                  }}
                >
                  {detailModal.type === "flagging" ? (
                    <>
                      <div>
                        <span style={{ color: COLORS.gray500 }}>Berita Acara (BA):</span>
                        <div style={{ fontWeight: 700, color: COLORS.gray800 }}>{detailModal.data.ba}</div>
                        <span style={{ fontSize: 11, color: COLORS.gray400 }}>Tgl BA: {detailModal.data.tanggalBa}</span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.gray500 }}>Nota Dinas:</span>
                        <div style={{ fontWeight: 700, color: COLORS.gray800 }}>{detailModal.data.nomorNotaDinas}</div>
                        <span style={{ fontSize: 11, color: COLORS.gray400 }}>Tgl ND: {detailModal.data.tanggalNotaDinas}</span>
                      </div>
                      <div>
                        <span style={{ color: COLORS.gray500 }}>Diterima Div. Peserta:</span>
                        <div style={{ fontWeight: 600 }}>{detailModal.data.tanggalTerimaDivPeserta}</div>
                      </div>
                      <div>
                        <span style={{ color: COLORS.gray500 }}>Diterima Bid. Pajak:</span>
                        <div style={{ fontWeight: 600 }}>{detailModal.data.tanggalTerimaBidPajak}</div>
                      </div>
                    </>
                  ) : null}
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Nomor Surat Tagihan:</span>
                    <div style={{ fontWeight: 700, color: COLORS.gray800 }}>{detailModal.data.noSurat}</div>
                    <span style={{ fontSize: 11, color: COLORS.gray400 }}>Tgl Surat: {detailModal.data.tanggalSuratTagihan}</span>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Tgl Kirim Email / Ekspedisi:</span>
                    <div style={{ fontWeight: 600 }}>{detailModal.data.tanggalKirimEmail}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Tgl Fisik Diterima Mitra:</span>
                    <div style={{ fontWeight: 700, color: COLORS.blue }}>{detailModal.data.tanggalSuratDiterimaMitra}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Batas Jatuh Tempo (14 Hari Kerja):</span>
                    <div style={{ fontWeight: 700, color: COLORS.orange }}>{detailModal.data.jatuhTempo}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Tanggal Pembayaran Diterima:</span>
                    <div style={{ fontWeight: 700, color: detailModal.data.tanggalPenerimaan ? COLORS.green : COLORS.red }}>
                      {detailModal.data.tanggalPenerimaan || "Belum Ada Mutasi Masuk"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Finansial & Pajak */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.gray700,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 10,
                  }}
                >
                  2. Rincian Perhitungan Pajak & NAT (Net After Tax)
                </div>
                <div style={{ border: `1px solid ${COLORS.gray200}`, borderRadius: 10, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <tbody>
                      {detailModal.type === "flagging" ? (
                        <>
                          <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                            <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>Nominal Bruto Tagihan</td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>
                              {fmt(detailModal.data.nominalBruto)}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.gray50 }}>
                            <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                              Imbal Jasa Flagging <span style={{ fontSize: 11, color: COLORS.gray400 }}>(Nominal / 1,11)</span>
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.blue }}>
                              {fmt(detailModal.data.imbalJasa)}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                            <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                              Tarif Imbal Jasa per Autentikasi
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>
                              {fmt(detailModal.data.imbalJasa)} / peserta
                            </td>
                          </tr>
                          <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                            <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                              Jumlah Penerima Dapem Induk, Susulan & PP
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>
                              {fmtNum(detailModal.data.jumlahPenerima)} orang
                            </td>
                          </tr>
                          <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.gray50 }}>
                            <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                              Nominal Imbal Jasa <span style={{ fontSize: 11, color: COLORS.gray400 }}>(Tarif × Jumlah)</span>
                            </td>
                            <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.blue }}>
                              {fmt(detailModal.data.nominalImbalJasa)}
                            </td>
                          </tr>
                        </>
                      )}
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          DPP PPN Nilai Lain <span style={{ fontSize: 11, color: COLORS.gray400 }}>(11/12 × Imbal Jasa)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>
                          {fmt(detailModal.data.dppPpn)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          PPN 12% <span style={{ fontSize: 11, color: COLORS.gray400 }}>(12% × DPP PPN)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#4F46E5" }}>
                          +{fmt(detailModal.data.ppn)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          Tax / PPh Pasal 23 <span style={{ fontSize: 11, color: COLORS.gray400 }}>(2% × Imbal Jasa)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.red }}>
                          -{fmt(detailModal.data.pph23)}
                        </td>
                      </tr>
                      <tr style={{ background: "#EFF6FF" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: COLORS.blue }}>
                          NAT (Net After Tax) yang Diterima PT ASABRI
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: COLORS.blue, fontSize: 15 }}>
                          {fmt(detailModal.data.nat)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rincian Sanksi Denda Keterlambatan */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.gray700,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 10,
                  }}
                >
                  3. Perhitungan Denda Keterlambatan (Berdasarkan BI Rate)
                </div>
                <div
                  style={{
                    background: detailModal.data.durasiKeterlambatan > 0 ? "#FFF1F2" : COLORS.greenLight,
                    border: `1px solid ${detailModal.data.durasiKeterlambatan > 0 ? "#FECDD3" : "#A7F3D0"}`,
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: COLORS.gray600 }}>Dasar Jumlah Tagihan Dikenakan Denda:</span>
                    <span style={{ fontWeight: 700 }}>
                      {fmt(detailModal.type === "flagging" ? detailModal.data.nominalBruto : detailModal.data.jumlahTagihan)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: COLORS.gray600 }}>Suku Bunga Acuan (BI Rate):</span>
                    <span style={{ fontWeight: 700 }}>{biRate.toFixed(2)}% per tahun</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: COLORS.gray600 }}>Jumlah Hari Keterlambatan:</span>
                    <span style={{ fontWeight: 700, color: detailModal.data.durasiKeterlambatan > 0 ? COLORS.red : COLORS.green }}>
                      {detailModal.data.durasiKeterlambatan} Hari
                    </span>
                  </div>
                  <div
                    style={{
                      borderTop: `1px dashed ${COLORS.gray300}`,
                      paddingTop: 10,
                      marginTop: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: detailModal.data.durasiKeterlambatan > 0 ? COLORS.red : COLORS.green }}>
                        Nilai Pembulatan Denda Terutang:
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>
                        (Tagihan × {biRate}% × {detailModal.data.durasiKeterlambatan} ÷ 365)
                      </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: detailModal.data.durasiKeterlambatan > 0 ? COLORS.red : COLORS.green }}>
                      {fmt(detailModal.data.nilaiPembulatanDenda)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
                <Btn
                  variant="outline"
                  onClick={() => handleTerbitkanSuratTagihan(detailModal.data, detailModal.type)}
                >
                  <FileText size={14} /> Cetak Tagihan
                </Btn>
                {detailModal.data.durasiKeterlambatan > 0 && (
                  <Btn
                    variant="danger"
                    onClick={() => handleTagihDenda(detailModal.data, detailModal.type)}
                  >
                    <Bell size={14} /> Terbitkan Surat Denda
                  </Btn>
                )}
                <Btn variant="primary" onClick={() => setDetailModal(null)}>
                  Tutup
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Data Rekapitulasi Tagihan */}
      {tambahModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={() => setTambahModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 580,
              maxWidth: "95vw",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: COLORS.gray50,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                  Input Tagihan Imbal Jasa Baru ({tambahModal === "flagging" ? "Flagging Kredit" : "Authentikasi Digital"})
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: COLORS.gray500 }}>
                  Semua perhitungan DPP, PPN 12%, PPh 23, dan NAT dihitung otomatis oleh sistem
                </p>
              </div>
              <button
                onClick={() => setTambahModal(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.gray400 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Nama Mitra Bayar
                  </label>
                  <select
                    value={newForm.namaMitra}
                    onChange={(e) => setNewForm({ ...newForm, namaMitra: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 13,
                    }}
                  >
                    <option>BRI</option>
                    <option>Bank Mandiri</option>
                    <option>BNI</option>
                    <option>BTN</option>
                    <option>Bank Mantap</option>
                    <option>BSI</option>
                    <option>PT Pos Indonesia</option>
                    <option>Bank BJB</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Periode Tagihan
                  </label>
                  <input
                    type="text"
                    value={newForm.periode}
                    onChange={(e) => setNewForm({ ...newForm, periode: e.target.value })}
                    placeholder="Contoh: Juni 2026"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
              </div>

              {tambahModal === "flagging" ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                        Nomor Berita Acara (BA)
                      </label>
                      <input
                        type="text"
                        value={newForm.ba}
                        onChange={(e) => setNewForm({ ...newForm, ba: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                        Tanggal BA
                      </label>
                      <input
                        type="text"
                        value={newForm.tanggalBa}
                        onChange={(e) => setNewForm({ ...newForm, tanggalBa: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                        Nomor Nota Dinas
                      </label>
                      <input
                        type="text"
                        value={newForm.nomorNotaDinas}
                        onChange={(e) => setNewForm({ ...newForm, nomorNotaDinas: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                        Tanggal Nota Dinas
                      </label>
                      <input
                        type="text"
                        value={newForm.tanggalNotaDinas}
                        onChange={(e) => setNewForm({ ...newForm, tanggalNotaDinas: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Nominal Bruto Tagihan (Rp)
                    </label>
                    <input
                      type="number"
                      step="1000000"
                      value={newForm.nominalBruto}
                      onChange={(e) => setNewForm({ ...newForm, nominalBruto: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    />
                    <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 11.5, color: COLORS.gray600 }}>
                      <span>
                        Imbal Jasa (Nom/1,11): <b>{fmt(Math.round((Number(newForm.nominalBruto) || 0) / 1.11))}</b>
                      </span>
                      <span>
                        PPN 12%: <b>{fmt(Math.round(0.11 * Math.round((Number(newForm.nominalBruto) || 0) / 1.11)))}</b>
                      </span>
                      <span>
                        PPh 23: <b>{fmt(Math.round(0.02 * Math.round((Number(newForm.nominalBruto) || 0) / 1.11)))}</b>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                        Tarif Imbal Jasa per Transaksi (Rp)
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={newForm.imbalJasaTarif}
                        onChange={(e) => setNewForm({ ...newForm, imbalJasaTarif: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                        Jumlah Penerima Dapem Induk, Susulan & PP
                      </label>
                      <input
                        type="number"
                        step="1000"
                        value={newForm.jumlahPenerima}
                        onChange={(e) => setNewForm({ ...newForm, jumlahPenerima: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                      />
                    </div>
                  </div>
                  <div style={{ background: COLORS.gray50, padding: 10, borderRadius: 6, fontSize: 12 }}>
                    Nominal Imbal Jasa:{" "}
                    <b>{fmt((Number(newForm.imbalJasaTarif) || 0) * (Number(newForm.jumlahPenerima) || 0))}</b>
                  </div>
                </>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    No. Surat Tagihan
                  </label>
                  <input
                    type="text"
                    value={newForm.noSurat}
                    onChange={(e) => setNewForm({ ...newForm, noSurat: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tgl Surat Diterima Mitra
                  </label>
                  <input
                    type="text"
                    value={newForm.tanggalSuratDiterimaMitra}
                    onChange={(e) => setNewForm({ ...newForm, tanggalSuratDiterimaMitra: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <Btn variant="outline" onClick={() => setTambahModal(null)}>
                  Batal
                </Btn>
                <Btn variant="primary" onClick={handleSaveTambah}>
                  Simpan & Terbitkan Data
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar Utama */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 2 }}>
            Sistem Penagihan Imbal Jasa Pengembangan Manfaat, Rekonsiliasi Pajak (PPN & PPh 23), dan Sanksi Denda Keterlambatan
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <Badge color="blue">Suku Bunga Acuan BI: {biRate.toFixed(2)}%</Badge>
            <Badge color="green">PPN Nilai Lain: 12% (11/12 DPP)</Badge>
            <Badge color="orange">PPh Pasal 23: 2%</Badge>
            <Badge color="gray">Jatuh Tempo: 14 Hari Kerja</Badge>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Btn variant="outline" onClick={() => setShowConfigModal(true)}>
            <Sliders size={14} /> Atur BI Rate & Pajak
          </Btn>
          <Btn variant="outline" onClick={handleEksporExcel}>
            <Download size={14} /> Ekspor Rekap (Excel)
          </Btn>
          <Btn
            variant="primary"
            onClick={() => setTambahModal(tab === "auth" ? "auth" : "flagging")}
          >
            <Plus size={15} /> Tambah Tagihan Baru
          </Btn>
        </div>
      </div>

      {/* Tab Navigasi Sub-Menu */}
      <div
        style={{
          borderBottom: `2px solid ${COLORS.gray200}`,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: -2 }}>
          {[
            {
              id: "flagging",
              label: "Sub-Menu Flagging Kredit",
              icon: CreditCard,
              count: flaggingList.length,
              badgeCol: "blue",
            },
            {
              id: "auth",
              label: "Sub-Menu Authentikasi Digital",
              icon: Smartphone,
              count: authList.length,
              badgeCol: "purple",
            },
            {
              id: "ikhtisar",
              label: "Dashboard Ikhtisar & Monitoring",
              icon: BarChart3,
              count: null,
              badgeCol: "gray",
            },
          ].map((t) => {
            const isActive = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? COLORS.white : "transparent",
                  color: isActive ? COLORS.blue : COLORS.gray600,
                  borderBottom: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                  borderTop: isActive ? `1px solid ${COLORS.gray200}` : "1px solid transparent",
                  borderLeft: isActive ? `1px solid ${COLORS.gray200}` : "1px solid transparent",
                  borderRight: isActive ? `1px solid ${COLORS.gray200}` : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={15} color={isActive ? COLORS.blue : COLORS.gray400} />
                <span>{t.label}</span>
                {t.count !== null && (
                  <span
                    style={{
                      background: isActive ? "#EFF6FF" : COLORS.gray100,
                      color: isActive ? COLORS.blue : COLORS.gray500,
                      padding: "2px 7px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ paddingBottom: 6, fontSize: 12, color: COLORS.gray500 }}>
          {tab === "flagging"
            ? "Tabel Resmi 25 Kolom Data Flagging Kredit"
            : tab === "auth"
            ? "Tabel Resmi 19 Kolom Data Authentikasi Digital"
            : "Komparasi Kinerja Penagihan Antar Mitra"}
        </div>
      </div>

      {/* FILTER BAR TERPADU */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: "14px 18px",
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.gray500, fontSize: 12, fontWeight: 700 }}>
            <Filter size={14} /> Filter:
          </div>
          <Select
            label="Mitra Bayar"
            value={filterMitra}
            onChange={setFilterMitra}
            options={["Semua", "BRI", "Bank Mandiri", "BNI", "BTN", "Bank Mantap", "BSI", "PT Pos Indonesia", "Bank BJB"]}
            minW={150}
          />
          <Select
            label="Periode"
            value={filterPeriode}
            onChange={setFilterPeriode}
            options={["Semua", "Mei 2026", "Juni 2026"]}
            minW={130}
          />
          <Select
            label="Status Pembayaran"
            value={filterStatus}
            onChange={setFilterStatus}
            options={["Semua", "Dibayar Tepat Waktu", "Terlambat", "Belum Dibayar"]}
            minW={170}
          />
        </div>

        <div style={{ minWidth: 260 }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari Mitra, No. Surat, BA, Nota Dinas..."
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* KONTEN TAB 1: FLAGGING KREDIT                             */}
      {/* ========================================================= */}
      {tab === "flagging" && (
        <>
          {/* Stat Cards Flagging */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            <StatCard
              icon={<Banknote size={IC} />}
              label="Total Tagihan Bruto"
              value={fmt(aggFlagging.totalBruto)}
              sub={`${filteredFlagging.length} Mitra Bayar Flagging`}
              color={COLORS.blue}
            />
            <StatCard
              icon={<Receipt size={IC} />}
              label="Imbal Jasa (Bruto / 1,11)"
              value={fmt(aggFlagging.totalImbalJasa)}
              sub={`DPP PPN (11/12): ${fmt(aggFlagging.totalDPP)}`}
              color={COLORS.blueLight}
            />
            <StatCard
              icon={<ShieldCheck size={IC} />}
              label="Total Bersih Diterima (NAT)"
              value={fmt(aggFlagging.totalNAT)}
              sub={`PPN 12%: ${fmt(aggFlagging.totalPPN)} • PPh 23: -${fmt(aggFlagging.totalPPh23)}`}
              color={COLORS.green}
            />
            <StatCard
              icon={<AlertTriangle size={IC} />}
              label="Total Denda Keterlambatan"
              value={fmt(aggFlagging.totalDenda)}
              sub={`${aggFlagging.countTerlambat + aggFlagging.countBelumBayar} tagihan lewat jatuh tempo`}
              color={COLORS.red}
            />
          </div>

          {/* TABEL LENGKAP 25 KOLOM DATA FLAGGING KREDIT */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                  Tabel Tagihan Imbal Jasa Flagging Kredit (25 Kolom Sesuai BRD)
                </h3>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                  Menampilkan {filteredFlagging.length} baris data • Geser tabel ke kanan untuk melihat rincian pajak & sanksi denda
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    background: "#F8FAFC",
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray200}`,
                  }}
                >
                  <Info size={13} color={COLORS.blue} />
                  Formula: Imbal Jasa = Nominal/1,11 | DPP = 11/12 X Imbal Jasa | PPN 12% | PPh 23 (2%)
                </span>
              </div>
            </div>

            {filteredFlagging.length === 0 ? (
              <NoData message="Tidak ada data tagihan flagging kredit yang sesuai filter." />
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.gray300}`,
                  maxHeight: "68vh",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, whiteSpace: "nowrap" }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F1F5F9" }}>
                    <tr style={{ borderBottom: `2px solid ${COLORS.gray300}` }}>
                      {/* 1. No */}
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray300}`, background: "#E2E8F0", position: "sticky", left: 0, zIndex: 11 }}>
                        No.
                      </th>
                      {/* 2. Nama Mitra */}
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray300}`, background: "#E2E8F0", position: "sticky", left: 45, zIndex: 11 }}>
                        Nama Mitra
                      </th>
                      {/* 3. BA */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        BA
                      </th>
                      {/* 4. Tanggal BA */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal BA
                      </th>
                      {/* 5. Periode */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Periode
                      </th>
                      {/* 6. Nomor Nota Dinas */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Nomor Nota Dinas
                      </th>
                      {/* 7. Tanggal Nota Dinas */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Nota Dinas
                      </th>
                      {/* 8. Tanggal Terima dari Div. Peserta */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Terima dari Div. Peserta
                      </th>
                      {/* 9. Tanggal Terima dari Bid. Pajak */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Terima dari Bid. Pajak
                      </th>
                      {/* 10. No. Surat */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        No. Surat
                      </th>
                      {/* 11. Tanggal Surat Tagihan */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Surat Tagihan
                      </th>
                      {/* 12. Tanggal Kirim Email/Surat */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Kirim Email/Surat
                      </th>
                      {/* 13. Nominal Bruto */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, background: "#EFF6FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Nominal Bruto
                      </th>
                      {/* 14. Imbal Jasa Flagging (Nominal/1,11) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.blue, background: "#EFF6FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Imbal Jasa Flagging (Nominal/1,11)
                      </th>
                      {/* 15. DPP PPN (11/12 X Imbal Jasa) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, background: "#F8FAFC", borderRight: `1px solid ${COLORS.gray200}` }}>
                        DPP PPN (11/12 X Imbal Jasa)
                      </th>
                      {/* 16. PPN 12% (12% X DPP) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#4F46E5", background: "#EEF2FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                        PPN 12% (12% X DPP)
                      </th>
                      {/* 17. Tax/PPh Ps 23 (2% X Imbal Jasa) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFF1F2", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tax/PPh Ps 23 (2% X Imbal Jasa)
                      </th>
                      {/* 18. NAT */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green, background: "#ECFDF5", borderRight: `1px solid ${COLORS.gray200}` }}>
                        NAT
                      </th>
                      {/* 19. Tanggal Surat Diterima Mitra */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Surat Diterima Mitra
                      </th>
                      {/* 20. Jatuh Tempo (14 hari kerja...) */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.orange, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Jatuh Tempo (14 hari kerja)
                      </th>
                      {/* 21. Tanggal Penerimaan */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Penerimaan
                      </th>
                      {/* 22. Durasi Keterlambatan */}
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Durasi Keterlambatan
                      </th>
                      {/* 23. BI RATE */}
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        BI RATE
                      </th>
                      {/* 24. Denda */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFF1F2", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Denda (Tagihan X BI RATE X Hari/365)
                      </th>
                      {/* 25. Nilai Pembulatan Denda */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFE4E6", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Nilai Pembulatan Denda
                      </th>
                      {/* Kolom Aksi Tambahan */}
                      <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, color: COLORS.gray700 }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlagging.map((row, idx) => {
                      const isEven = idx % 2 === 1;
                      return (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: `1px solid ${COLORS.gray200}`,
                            background:
                              row.status === "Belum Dibayar"
                                ? "#FFF5F5"
                                : row.status === "Terlambat"
                                ? "#FFFBEB"
                                : isEven
                                ? "#F8FAFC"
                                : "#FFFFFF",
                          }}
                        >
                          {/* 1. No */}
                          <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, borderRight: `1px solid ${COLORS.gray300}`, background: isEven ? "#F1F5F9" : "#F8FAFC", position: "sticky", left: 0, zIndex: 2 }}>
                            {row.no}
                          </td>
                          {/* 2. Nama Mitra */}
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray300}`, background: isEven ? "#F1F5F9" : "#F8FAFC", position: "sticky", left: 45, zIndex: 2 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Building2 size={13} color={COLORS.blue} />
                              <span>{row.namaMitra}</span>
                            </div>
                          </td>
                          {/* 3. BA */}
                          <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.ba}
                          </td>
                          {/* 4. Tanggal BA */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalBa}
                          </td>
                          {/* 5. Periode */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            <span style={{ fontWeight: 600 }}>{row.periode}</span>
                          </td>
                          {/* 6. Nomor Nota Dinas */}
                          <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.nomorNotaDinas}
                          </td>
                          {/* 7. Tanggal Nota Dinas */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalNotaDinas}
                          </td>
                          {/* 8. Tanggal Terima dari Div. Peserta */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalTerimaDivPeserta}
                          </td>
                          {/* 9. Tanggal Terima dari Bid. Pajak */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalTerimaBidPajak}
                          </td>
                          {/* 10. No. Surat */}
                          <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 700, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.noSurat}
                          </td>
                          {/* 11. Tanggal Surat Tagihan */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalSuratTagihan}
                          </td>
                          {/* 12. Tanggal Kirim Email/Surat */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalKirimEmail}
                          </td>
                          {/* 13. Nominal Bruto */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.nominalBruto)}
                          </td>
                          {/* 14. Imbal Jasa Flagging (Nominal/1,11) */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.blue, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.imbalJasa)}
                          </td>
                          {/* 15. DPP PPN (11/12 X Imbal Jasa) */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.dppPpn)}
                          </td>
                          {/* 16. PPN 12% (12% X DPP) */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#4F46E5", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.ppn)}
                          </td>
                          {/* 17. Tax/PPh Ps 23 (2% X Imbal Jasa) */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.red, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.pph23)}
                          </td>
                          {/* 18. NAT */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.nat)}
                          </td>
                          {/* 19. Tanggal Surat Diterima Mitra */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalSuratDiterimaMitra}
                          </td>
                          {/* 20. Jatuh Tempo (14 hari kerja...) */}
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: COLORS.orange, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.jatuhTempo}
                          </td>
                          {/* 21. Tanggal Penerimaan */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalPenerimaan ? (
                              <span style={{ fontWeight: 600, color: COLORS.green }}>{row.tanggalPenerimaan}</span>
                            ) : (
                              <span style={{ color: COLORS.red, fontWeight: 700 }}>Belum Diterima</span>
                            )}
                          </td>
                          {/* 22. Durasi Keterlambatan */}
                          <td style={{ padding: "10px 12px", textAlign: "center", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.durasiKeterlambatan > 0 ? (
                              <span
                                style={{
                                  background: "#FFE4E6",
                                  color: COLORS.red,
                                  padding: "3px 8px",
                                  borderRadius: 12,
                                  fontWeight: 800,
                                  fontSize: 11,
                                }}
                              >
                                {row.durasiKeterlambatan} Hari
                              </span>
                            ) : (
                              <span
                                style={{
                                  background: "#ECFDF5",
                                  color: COLORS.green,
                                  padding: "3px 8px",
                                  borderRadius: 12,
                                  fontWeight: 700,
                                  fontSize: 11,
                                }}
                              >
                                0 Hari (Tepat)
                              </span>
                            )}
                          </td>
                          {/* 23. BI RATE */}
                          <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {biRate.toFixed(2)}%
                          </td>
                          {/* 24. Denda */}
                          <td style={{ padding: "10px 14px", textAlign: "right", color: row.rawDenda > 0 ? COLORS.red : COLORS.gray400, fontWeight: 600, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.rawDenda)}
                          </td>
                          {/* 25. Nilai Pembulatan Denda */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: row.nilaiPembulatanDenda > 0 ? COLORS.red : COLORS.gray400, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.nilaiPembulatanDenda)}
                          </td>
                          {/* Kolom Aksi */}
                          <td style={{ padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                onClick={() => setDetailModal({ data: row, type: "flagging" })}
                              >
                                <Eye size={12} /> Detail
                              </Btn>
                              {row.durasiKeterlambatan > 0 && (
                                <Btn
                                  size="xs"
                                  variant="danger"
                                  onClick={() => handleTagihDenda(row, "flagging")}
                                >
                                  <Bell size={12} /> Denda
                                </Btn>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* FOOTER TOTAL TABLE FLAGGING */}
                  <tfoot style={{ background: "#F1F5F9", borderTop: `2px solid ${COLORS.gray300}` }}>
                    <tr style={{ fontWeight: 800 }}>
                      <td colSpan={12} style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700 }}>
                        TOTAL REKAPITULASI FLAGGING KREDIT:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray900 }}>
                        {fmt(aggFlagging.totalBruto)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.blue }}>
                        {fmt(aggFlagging.totalImbalJasa)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700 }}>
                        {fmt(aggFlagging.totalDPP)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: "#4F46E5" }}>
                        {fmt(aggFlagging.totalPPN)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red }}>
                        {fmt(aggFlagging.totalPPh23)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.green, fontSize: 13 }}>
                        {fmt(aggFlagging.totalNAT)}
                      </td>
                      <td colSpan={5} style={{ padding: "12px 14px" }}></td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red }}>
                        {fmt(aggFlagging.totalDenda)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red, fontSize: 13 }}>
                        {fmt(aggFlagging.totalDenda)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* KONTEN TAB 2: AUTHENTIKASI DIGITAL                        */}
      {/* ========================================================= */}
      {tab === "auth" && (
        <>
          {/* Stat Cards Auth Digital */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            <StatCard
              icon={<Smartphone size={IC} />}
              label="Total Penerima Diautentikasi"
              value={`${fmtNum(aggAuth.totalPeserta)} Orang`}
              sub={`${filteredAuth.length} Mitra Bayar Pensiun`}
              color="#7C3AED"
            />
            <StatCard
              icon={<Banknote size={IC} />}
              label="Nominal Imbal Jasa (Tarif × Jml)"
              value={fmt(aggAuth.totalNominalImbalJasa)}
              sub={`DPP PPN (11/12): ${fmt(aggAuth.totalDPP)}`}
              color={COLORS.blue}
            />
            <StatCard
              icon={<ShieldCheck size={IC} />}
              label="Total Bersih Diterima (NAT)"
              value={fmt(aggAuth.totalNAT)}
              sub={`Bruto Tagihan: ${fmt(aggAuth.totalTagihan)} • PPh 23: -${fmt(aggAuth.totalPPh23)}`}
              color={COLORS.green}
            />
            <StatCard
              icon={<AlertTriangle size={IC} />}
              label="Total Denda Keterlambatan"
              value={fmt(aggAuth.totalDenda)}
              sub={`${aggAuth.countTerlambat + aggAuth.countBelumBayar} tagihan belum/terlambat dibayar`}
              color={COLORS.red}
            />
          </div>

          {/* TABEL LENGKAP 19 KOLOM DATA AUTHENTIKASI DIGITAL */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                  Tabel Tagihan Imbal Jasa Authentikasi Digital (19 Kolom Sesuai BRD)
                </h3>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                  Menampilkan {filteredAuth.length} baris data • Geser ke samping untuk melihat perhitungan pajak dan sanksi denda
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    background: "#F8FAFC",
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray200}`,
                  }}
                >
                  <Info size={13} color="#7C3AED" />
                  Formula: Nominal = Tarif X Penerima | DPP = 11/12 X Nominal | PPN 12% | PPh 23 (2%) | NAT
                </span>
              </div>
            </div>

            {filteredAuth.length === 0 ? (
              <NoData message="Tidak ada data tagihan autentikasi digital yang sesuai filter." />
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.gray300}`,
                  maxHeight: "68vh",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, whiteSpace: "nowrap" }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F1F5F9" }}>
                    <tr style={{ borderBottom: `2px solid ${COLORS.gray300}` }}>
                      {/* 1. No */}
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray300}`, background: "#E2E8F0", position: "sticky", left: 0, zIndex: 11 }}>
                        No.
                      </th>
                      {/* 2. Nama Mitra */}
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray300}`, background: "#E2E8F0", position: "sticky", left: 45, zIndex: 11 }}>
                        Nama Mitra
                      </th>
                      {/* 3. Imbal Jasa (Tarif) */}
                      <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Imbal Jasa
                      </th>
                      {/* 4. Jumlah Penerima Dapem Induk, Susulan & PP */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, background: "#F5F3FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Jumlah Penerima Dapem Induk, Dapem Susulan & Pensiun Pertama (PP)
                      </th>
                      {/* 5. Nominal Imbal Jasa */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.blue, background: "#EFF6FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Nominal Imbal Jasa
                      </th>
                      {/* 6. DPP PPN (11/12 X Nominal Imbal Jasa) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, background: "#F8FAFC", borderRight: `1px solid ${COLORS.gray200}` }}>
                        DPP PPN (11/12 X Nominal Imbal Jasa)
                      </th>
                      {/* 7. PPN 12% (12% X DPP) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#4F46E5", background: "#EEF2FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                        PPN 12% (12% X DPP)
                      </th>
                      {/* 8. Tax/PPh Ps 23 (2% X Nominal Imbal Jasa) */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFF1F2", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tax/PPh Ps 23 (2% X Nominal Imbal Jasa)
                      </th>
                      {/* 9. NAT */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green, background: "#ECFDF5", borderRight: `1px solid ${COLORS.gray200}` }}>
                        NAT
                      </th>
                      {/* 10. No. Surat */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.blue, borderRight: `1px solid ${COLORS.gray200}` }}>
                        No. Surat
                      </th>
                      {/* 11. Tanggal Surat Tagihan */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Surat Tagihan
                      </th>
                      {/* 12. Tanggal Kirim Email/Surat */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Kirim Email/Surat
                      </th>
                      {/* 13. Tanggal Surat Diterima Mitra */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Surat Diterima Mitra
                      </th>
                      {/* 14. Jatuh Tempo (14 hari kerja...) */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.orange, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Jatuh Tempo (14 hari kerja)
                      </th>
                      {/* 15. Tanggal Penerimaan */}
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Tanggal Penerimaan
                      </th>
                      {/* 16. Durasi Keterlambatan */}
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        Durasi Keterlambatan
                      </th>
                      {/* 17. BI RATE */}
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        BI RATE
                      </th>
                      {/* 18. Denda */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFF1F2", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Denda (Tagihan X BI RATE X Hari/365)
                      </th>
                      {/* 19. Nilai Pembulatan Denda */}
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFE4E6", borderRight: `1px solid ${COLORS.gray200}` }}>
                        Nilai Pembulatan Denda
                      </th>
                      {/* Aksi */}
                      <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, color: COLORS.gray700 }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuth.map((row, idx) => {
                      const isEven = idx % 2 === 1;
                      return (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: `1px solid ${COLORS.gray200}`,
                            background:
                              row.status === "Belum Dibayar"
                                ? "#FFF5F5"
                                : row.status === "Terlambat"
                                ? "#FFFBEB"
                                : isEven
                                ? "#F8FAFC"
                                : "#FFFFFF",
                          }}
                        >
                          {/* 1. No */}
                          <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, borderRight: `1px solid ${COLORS.gray300}`, background: isEven ? "#F1F5F9" : "#F8FAFC", position: "sticky", left: 0, zIndex: 2 }}>
                            {row.no}
                          </td>
                          {/* 2. Nama Mitra */}
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray300}`, background: isEven ? "#F1F5F9" : "#F8FAFC", position: "sticky", left: 45, zIndex: 2 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Smartphone size={13} color="#7C3AED" />
                              <span>{row.namaMitra}</span>
                            </div>
                          </td>
                          {/* 3. Imbal Jasa (Tarif) */}
                          <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.imbalJasa)}
                          </td>
                          {/* 4. Jumlah Penerima */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#6D28D9", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmtNum(row.jumlahPenerima)}
                          </td>
                          {/* 5. Nominal Imbal Jasa */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.blue, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.nominalImbalJasa)}
                          </td>
                          {/* 6. DPP PPN */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.dppPpn)}
                          </td>
                          {/* 7. PPN 12% */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#4F46E5", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.ppn)}
                          </td>
                          {/* 8. PPh 23 */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.red, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.pph23)}
                          </td>
                          {/* 9. NAT */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.nat)}
                          </td>
                          {/* 10. No Surat */}
                          <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 700, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.noSurat}
                          </td>
                          {/* 11. Tanggal Surat Tagihan */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalSuratTagihan}
                          </td>
                          {/* 12. Tanggal Kirim Email */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalKirimEmail}
                          </td>
                          {/* 13. Tanggal Diterima Mitra */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalSuratDiterimaMitra}
                          </td>
                          {/* 14. Jatuh Tempo */}
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: COLORS.orange, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.jatuhTempo}
                          </td>
                          {/* 15. Tanggal Penerimaan */}
                          <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.tanggalPenerimaan ? (
                              <span style={{ fontWeight: 600, color: COLORS.green }}>{row.tanggalPenerimaan}</span>
                            ) : (
                              <span style={{ color: COLORS.red, fontWeight: 700 }}>Belum Diterima</span>
                            )}
                          </td>
                          {/* 16. Durasi Keterlambatan */}
                          <td style={{ padding: "10px 12px", textAlign: "center", borderRight: `1px solid ${COLORS.gray200}` }}>
                            {row.durasiKeterlambatan > 0 ? (
                              <span
                                style={{
                                  background: "#FFE4E6",
                                  color: COLORS.red,
                                  padding: "3px 8px",
                                  borderRadius: 12,
                                  fontWeight: 800,
                                  fontSize: 11,
                                }}
                              >
                                {row.durasiKeterlambatan} Hari
                              </span>
                            ) : (
                              <span
                                style={{
                                  background: "#ECFDF5",
                                  color: COLORS.green,
                                  padding: "3px 8px",
                                  borderRadius: 12,
                                  fontWeight: 700,
                                  fontSize: 11,
                                }}
                              >
                                0 Hari (Tepat)
                              </span>
                            )}
                          </td>
                          {/* 17. BI Rate */}
                          <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {biRate.toFixed(2)}%
                          </td>
                          {/* 18. Denda */}
                          <td style={{ padding: "10px 14px", textAlign: "right", color: row.rawDenda > 0 ? COLORS.red : COLORS.gray400, fontWeight: 600, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.rawDenda)}
                          </td>
                          {/* 19. Nilai Pembulatan Denda */}
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: row.nilaiPembulatanDenda > 0 ? COLORS.red : COLORS.gray400, borderRight: `1px solid ${COLORS.gray200}` }}>
                            {fmt(row.nilaiPembulatanDenda)}
                          </td>
                          {/* Aksi */}
                          <td style={{ padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                onClick={() => setDetailModal({ data: row, type: "auth" })}
                              >
                                <Eye size={12} /> Detail
                              </Btn>
                              {row.durasiKeterlambatan > 0 && (
                                <Btn
                                  size="xs"
                                  variant="danger"
                                  onClick={() => handleTagihDenda(row, "auth")}
                                >
                                  <Bell size={12} /> Denda
                                </Btn>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* FOOTER TOTAL TABLE AUTH */}
                  <tfoot style={{ background: "#F1F5F9", borderTop: `2px solid ${COLORS.gray300}` }}>
                    <tr style={{ fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700 }}>
                        TOTAL REKAPITULASI AUTHENTIKASI DIGITAL:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: "#6D28D9" }}>
                        {fmtNum(aggAuth.totalPeserta)} Org
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.blue }}>
                        {fmt(aggAuth.totalNominalImbalJasa)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700 }}>
                        {fmt(aggAuth.totalDPP)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: "#4F46E5" }}>
                        {fmt(aggAuth.totalPPN)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red }}>
                        {fmt(aggAuth.totalPPh23)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.green, fontSize: 13 }}>
                        {fmt(aggAuth.totalNAT)}
                      </td>
                      <td colSpan={7} style={{ padding: "12px 14px" }}></td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red }}>
                        {fmt(aggAuth.totalDenda)}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red, fontSize: 13 }}>
                        {fmt(aggAuth.totalDenda)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* KONTEN TAB 3: DASHBOARD IKHTISAR & MONITORING DENDA       */}
      {/* ========================================================= */}
      {tab === "ikhtisar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Komparasi Global Kedua Stream */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {/* Stream 1 Card */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: 12,
                border: `1px solid ${COLORS.gray200}`,
                padding: 20,
                boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: "#EFF6FF", padding: 8, borderRadius: 8, color: COLORS.blue }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                      Stream Flagging Kredit
                    </h4>
                    <span style={{ fontSize: 12, color: COLORS.gray500 }}>
                      Jasa penguncian data pensiun mitra perbankan
                    </span>
                  </div>
                </div>
                <Badge color="blue">{flaggingList.length} Mitra</Badge>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>Nominal Bruto Tagihan:</span>
                  <span style={{ fontWeight: 700 }}>{fmt(aggFlagging.totalBruto)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>Imbal Jasa (Nominal/1,11):</span>
                  <span style={{ fontWeight: 700, color: COLORS.blue }}>{fmt(aggFlagging.totalImbalJasa)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>PPN 12% (11/12 DPP):</span>
                  <span style={{ fontWeight: 600, color: "#4F46E5" }}>+{fmt(aggFlagging.totalPPN)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>PPh Pasal 23 (2%):</span>
                  <span style={{ fontWeight: 600, color: COLORS.red }}>-{fmt(aggFlagging.totalPPh23)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", background: "#EFF6FF", borderRadius: 6, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={{ fontWeight: 800, color: COLORS.blue }}>NAT Bersih Diterima:</span>
                  <span style={{ fontWeight: 800, color: COLORS.blue, fontSize: 14 }}>{fmt(aggFlagging.totalNAT)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ color: COLORS.gray500 }}>Total Sanksi Denda Keterlambatan:</span>
                  <span style={{ fontWeight: 800, color: COLORS.red }}>{fmt(aggFlagging.totalDenda)}</span>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <Btn variant="outline" size="sm" style={{ width: "100%" }} onClick={() => setTab("flagging")}>
                  Buka Sub-Menu Flagging Kredit <ChevronRight size={14} />
                </Btn>
              </div>
            </div>

            {/* Stream 2 Card */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: 12,
                border: `1px solid ${COLORS.gray200}`,
                padding: 20,
                boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: "#F5F3FF", padding: 8, borderRadius: 8, color: "#7C3AED" }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                      Stream Authentikasi Digital
                    </h4>
                    <span style={{ fontSize: 12, color: COLORS.gray500 }}>
                      Pemanfaatan data biometrik autentikasi Dapem
                    </span>
                  </div>
                </div>
                <Badge color="purple">{authList.length} Mitra</Badge>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>Total Penerima Dapem & PP:</span>
                  <span style={{ fontWeight: 700, color: "#6D28D9" }}>{fmtNum(aggAuth.totalPeserta)} Orang</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>Nominal Imbal Jasa:</span>
                  <span style={{ fontWeight: 700, color: COLORS.blue }}>{fmt(aggAuth.totalNominalImbalJasa)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>PPN 12% (11/12 DPP):</span>
                  <span style={{ fontWeight: 600, color: "#4F46E5" }}>+{fmt(aggAuth.totalPPN)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <span style={{ color: COLORS.gray500 }}>PPh Pasal 23 (2%):</span>
                  <span style={{ fontWeight: 600, color: COLORS.red }}>-{fmt(aggAuth.totalPPh23)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", background: "#F5F3FF", borderRadius: 6, paddingLeft: 8, paddingRight: 8 }}>
                  <span style={{ fontWeight: 800, color: "#7C3AED" }}>NAT Bersih Diterima:</span>
                  <span style={{ fontWeight: 800, color: "#7C3AED", fontSize: 14 }}>{fmt(aggAuth.totalNAT)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ color: COLORS.gray500 }}>Total Sanksi Denda Keterlambatan:</span>
                  <span style={{ fontWeight: 800, color: COLORS.red }}>{fmt(aggAuth.totalDenda)}</span>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <Btn variant="outline" size="sm" style={{ width: "100%" }} onClick={() => setTab("auth")}>
                  Buka Sub-Menu Authentikasi Digital <ChevronRight size={14} />
                </Btn>
              </div>
            </div>
          </div>

          {/* Ranking & Status Kepatuhan Mitra */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              border: `1px solid ${COLORS.gray200}`,
              padding: 20,
              boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                  Monitoring Kepatuhan Pembayaran & Akumulasi Denda per Mitra
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                  Daftar kompilasi seluruh mitra bayar lintas stream Flagging Kredit & Authentikasi Digital
                </p>
              </div>
              <Badge color="red">Total Denda Terakumulasi: {fmt(grandTotalDenda)}</Badge>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.gray200}`, color: COLORS.gray600 }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Mitra Bayar</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Tagihan Flagging</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Tagihan Auth Digital</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Total NAT</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700 }}>Status Flagging</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700 }}>Status Auth</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.red }}>Total Denda</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700 }}>Aksi Tagih</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "BRI",
                    "Bank Mandiri",
                    "BNI",
                    "Bank Mantap",
                    "BTN",
                    "BSI",
                    "PT Pos Indonesia",
                    "Bank BJB",
                  ].map((mitra, i) => {
                    const flg = computedFlagging.find((f) => f.namaMitra === mitra);
                    const aut = computedAuth.find((a) => a.namaMitra === mitra);
                    const natFlg = flg ? flg.nat : 0;
                    const natAut = aut ? aut.nat : 0;
                    const totNat = natFlg + natAut;
                    const dndFlg = flg ? flg.nilaiPembulatanDenda : 0;
                    const dndAut = aut ? aut.nilaiPembulatanDenda : 0;
                    const totDenda = dndFlg + dndAut;

                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: totDenda > 0 ? "#FFFDFD" : COLORS.white }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Building2 size={15} color={COLORS.blue} />
                            <span>{mitra}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>
                          {flg ? fmt(flg.nominalBruto) : "—"}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>
                          {aut ? fmt(aut.nominalImbalJasa) : "—"}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green }}>
                          {fmt(totNat)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          {flg ? (
                            <Badge
                              color={
                                flg.status === "Dibayar Tepat Waktu"
                                  ? "green"
                                  : flg.status === "Terlambat"
                                  ? "orange"
                                  : "red"
                              }
                            >
                              {flg.status === "Dibayar Tepat Waktu" ? "Tepat Waktu" : flg.status}
                            </Badge>
                          ) : (
                            <span style={{ color: COLORS.gray400 }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          {aut ? (
                            <Badge
                              color={
                                aut.status === "Dibayar Tepat Waktu"
                                  ? "green"
                                  : aut.status === "Terlambat"
                                  ? "orange"
                                  : "red"
                              }
                            >
                              {aut.status === "Dibayar Tepat Waktu" ? "Tepat Waktu" : aut.status}
                            </Badge>
                          ) : (
                            <span style={{ color: COLORS.gray400 }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: totDenda > 0 ? COLORS.red : COLORS.gray400 }}>
                          {fmt(totDenda)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          {totDenda > 0 ? (
                            <Btn
                              size="xs"
                              variant="danger"
                              onClick={() => {
                                const target = flg && flg.durasiKeterlambatan > 0 ? flg : aut;
                                const targetType = flg && flg.durasiKeterlambatan > 0 ? "flagging" : "auth";
                                if (target) handleTagihDenda(target, targetType);
                              }}
                            >
                              <Bell size={12} /> Surat Denda
                            </Btn>
                          ) : (
                            <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 700 }}>
                              ✓ Tertib
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
