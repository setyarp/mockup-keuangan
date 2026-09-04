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
  Users,
  ShieldCheck,
  Info,
  X,
  ChevronRight,
  FileText
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, Badge, NoData, PreviewModal } from "../components/common";

export const Perpajakan = () => {
  const [tab, setTab] = useState("ter_jan_nov");
  const [filterBulanTER, setFilterBulanTER] = useState("Juli");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterMAK, setFilterMAK] = useState("Semua");
  const [filterStatusPeserta, setFilterStatusPeserta] = useState("Semua");
  const [filterTunjukSilang, setFilterTunjukSilang] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadStep, setUploadStep] = useState(0); // 0=belum upload, 1=terunggah & cocok, 2=terdistribusi
  const [preview, setPreview] = useState(null);
  const [detailKalkulasi, setDetailKalkulasi] = useState(null);

  const fmt = (n) =>
    n < 0
      ? `-Rp ${Math.abs(Math.round(n)).toLocaleString("id-ID")}`
      : `Rp ${Math.round(n || 0).toLocaleString("id-ID")}`;

  const BULAN_OPTIONS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November"
  ];
  const currentMonthIdx = BULAN_OPTIONS.indexOf(filterBulanTER) + 1;

  // Master Data Peserta Pensiun untuk Simulasi Perpajakan (Lengkap dengan Kode Jiwa, TER, P17, Tunjuk Silang, dan Pemadanan NIK)
  const masterPesertaPajak = [
    {
      id: 1,
      nik: "3171012304650001",
      nrp: "1965042301",
      nama: "Mayjen TNI (Purn) Soedirman H.",
      jabatan: "Perwira Tinggi (Pati) Mabesad",
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
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 2,
      nik: "3273024508680003",
      nrp: "1968081202",
      nama: "Kolonel Laut (Purn) Bambang S.",
      jabatan: "Perwira Menengah (Pamen) Koarmada I",
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
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 3,
      nik: "3175085409700002",
      nrp: "1970091503",
      nama: "Kombes Pol (Purn) Dra. Hj. Ratna S.",
      jabatan: "Perwira Menengah (Pamen) Polda Metro",
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
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 4,
      nik: "3172031102720005",
      nrp: "1972021104",
      nama: "Pembina Tk.I (Purn) Ir. Hendro W.",
      jabatan: "PNS Ditjen Strahan (Gol. IV/b)",
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
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 5,
      nik: "3374092205690004",
      nrp: "1969052205",
      nama: "AKBP (Purn) Drs. Agus Hartono",
      jabatan: "Perwira Menengah (Pamen) Polda Jateng",
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
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 6,
      nik: "3271046708660002",
      nrp: "1966081406",
      nama: "Letkol Inf (Purn) Dedi Supriadi",
      jabatan: "Perwira Menengah (Pamen) Kodam III/Slw",
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
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: true,
      bulanBerhentiNama: "Mei",
      bulanBerhentiIdx: 5,
      alasanBerhenti: "Meninggal Dunia (Wafat Mei 2026)",
    },
    {
      id: 7,
      nik: "3174051203740001",
      nrp: "1974031207",
      nama: "Penata (Purn) Sri Rahayu, S.Sos",
      jabatan: "PNS Puskeu Polri (Gol. III/c)",
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
      npwp: "3174051203740001 (Format NIK 16-Digit)",
      statusNPWP: "NIK = NPWP (Normal / Bebas Sanksi 20%)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 8,
      nik: "3578013009710006",
      nrp: "1971093008",
      nama: "Mayor Mar (Purn) Wahyudi Eko",
      jabatan: "Perwira Menengah (Pamen) Pasmar 2",
      satker: "TNI AL",
      unor: "Pasmar 2",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/2",
      ptkp: 67500000,
      kategoriTER: "TER B",
      tarifTER: 0.0125, // 1.25%
      gpPensiun: 7800000,
      tunjanganKeluarga: 780000,
      tunjanganBeras: 580000,
      tunjanganLain: 1040000,
      brutoBulanan: 10200000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "07.890.123.4-071.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 9,
      nik: "3276011406670005",
      nrp: "1967061409",
      nama: "Kolonel Inf (Purn) Suryanto, M.Si.",
      jabatan: "Perwira Menengah (Pamen) Dispenad",
      satker: "TNI AD",
      unor: "Dispenad",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "TK/0",
      ptkp: 54000000,
      kategoriTER: "TER A",
      tarifTER: 0.015, // 1.5%
      gpPensiun: 13800000,
      tunjanganKeluarga: 0,
      tunjanganBeras: 290000,
      tunjanganLain: 3910000,
      brutoBulanan: 18000000,
      terStatus: "Berhenti (Masa Juli)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "08.901.234.5-081.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: true,
      bulanBerhentiNama: "Juli",
      bulanBerhentiIdx: 7,
      alasanBerhenti: "Tutup Hak Pensiun / Wafat Juli 2026",
    },
    {
      id: 10,
      nik: "NIK-S-202607-0042",
      nrp: "1973041510",
      nama: "Peltu (Purn) M. Yusuf",
      jabatan: "Bintara Tinggi Lanud Hlm",
      satker: "TNI AU",
      unor: "Lanud Hlm",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/1",
      ptkp: 63000000,
      kategoriTER: "TER A",
      tarifTER: 0.0075, // 0.75%
      gpPensiun: 5900000,
      tunjanganKeluarga: 590000,
      tunjanganBeras: 290000,
      tunjanganLain: 720000,
      brutoBulanan: 7500000,
      terStatus: "Reguler",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "NIK Sementara (Pending)",
      statusNPWP: "NIK Sementara (Tarif Standar 100% / Tanpa Denda 20%)",
      statusNIK: "NIK Sementara (Proses Dukcapil)",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 11,
      nik: "3372010804710003",
      nrp: "1971040811",
      nama: "Mayor Inf (Purn) Suhardi, S.E.",
      jabatan: "Perwira Menengah (Pamen) Kodam IV/Dip",
      satker: "TNI AD",
      unor: "Kodam IV/Dip",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/1",
      ptkp: 63000000,
      kategoriTER: "TER A",
      tarifTER: 0.005, // 0.5%
      gpPensiun: 5200000,
      tunjanganKeluarga: 520000,
      tunjanganBeras: 290000,
      tunjanganLain: 490000,
      brutoBulanan: 6500000,
      terStatus: "Berhenti (Masa Juli - Lebih Bayar)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "09.234.567.8-091.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: true,
      bulanBerhentiNama: "Juli",
      bulanBerhentiIdx: 7,
      alasanBerhenti: "Habis Hak Pensiun / Wafat Juli 2026 (Dapem Terakhir)",
    },
    {
      id: 12,
      nik: "1271031505730004",
      nrp: "1973051512",
      nama: "Serma (Purn) Tarigan Sembiring",
      jabatan: "Bintara (Purn) Kodam I/BB",
      satker: "TNI AD",
      unor: "Kodam I/BB",
      mak: "513122",
      dapem: "Dapem Induk",
      kodeJiwa: "K/2",
      ptkp: 67500000,
      kategoriTER: "TER B",
      tarifTER: 0.0, // 0.0% (Bawah PTKP)
      gpPensiun: 3900000,
      tunjanganKeluarga: 390000,
      tunjanganBeras: 290000,
      tunjanganLain: 220000,
      brutoBulanan: 4800000,
      terStatus: "Reguler (Nihil Pajak)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "12.345.678.9-121.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 13,
      nik: "3175024508600001",
      nrp: "1960081513",
      nama: "Ny. Hj. Aminah Subagyo",
      jabatan: "Warakawuri TNI AU (Pens. Janda Mayor AU)",
      satker: "TNI AU",
      unor: "Koopsud I",
      mak: "513122",
      dapem: "Dapem Janda",
      kodeJiwa: "TK/2",
      ptkp: 63000000,
      kategoriTER: "TER B",
      tarifTER: 0.0, // 0.0% (Bawah PTKP)
      gpPensiun: 3200000,
      tunjanganKeluarga: 320000,
      tunjanganBeras: 290000,
      tunjanganLain: 390000,
      brutoBulanan: 4200000,
      terStatus: "Pensiun Janda (Warakawuri)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "13.456.789.0-131.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: false,
      bulanBerhentiNama: null,
      bulanBerhentiIdx: null,
    },
    {
      id: 14,
      nik: "3275082107010005",
      nrp: "2001072114",
      nama: "Reza Pratama, S.Kom.",
      jabatan: "Penerima Pensiun Anak Yatim TNI AL",
      satker: "TNI AL",
      unor: "Lantamal III",
      mak: "513122",
      dapem: "Dapem Anak Yatim",
      kodeJiwa: "TK/0",
      ptkp: 54000000,
      kategoriTER: "TER A",
      tarifTER: 0.005, // 0.5%
      gpPensiun: 4500000,
      tunjanganKeluarga: 0,
      tunjanganBeras: 290000,
      tunjanganLain: 1010000,
      brutoBulanan: 5800000,
      terStatus: "Berhenti (Habis Hak Usia 25 Thn - Lebih Bayar)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "14.567.890.1-141.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: true,
      bulanBerhentiNama: "Juli",
      bulanBerhentiIdx: 7,
      alasanBerhenti: "Tutup Hak Anak Pensiun / Usia Genap 25 Tahun (Dapem Terakhir)",
    },
    {
      id: 15,
      nik: "3578021409720002",
      nrp: "1972091415",
      nama: "Aiptu (Purn) Sugeng Riyadi",
      jabatan: "Bintara (Purn) Polrestabes Surabaya",
      satker: "POLRI",
      unor: "Polrestabes Surabaya",
      mak: "513123",
      dapem: "Dapem Induk",
      kodeJiwa: "K/1",
      ptkp: 63000000,
      kategoriTER: "TER A",
      tarifTER: 0.005, // 0.5%
      gpPensiun: 4600000,
      tunjanganKeluarga: 460000,
      tunjanganBeras: 290000,
      tunjanganLain: 450000,
      brutoBulanan: 5800000,
      terStatus: "Reguler (Berhenti September)",
      tunjukSilang: false,
      sumberPensiunGanda: null,
      npwp: "15.678.901.2-151.000",
      statusNPWP: "NIK Terpadan Valid (PMK 168)",
      statusNIK: "Valid Dukcapil",
      isBerhenti: true,
      bulanBerhentiNama: "September",
      bulanBerhentiIdx: 9,
      alasanBerhenti: "Tutup Hak Pensiun / Wafat September 2026",
    }
  ];

  // Helper kalkulasi PPh Pasal 17 Tahunan (Progresif UU HPP - PMK 168/2023)
  // Sanksi tarif 20% lebih tinggi dihapuskan, tarif menggunakan 100% normal
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

  // 1. EVALUASI DINAMIS REKAP PPH 21 BULANAN (TAB 1)
  // Berdasarkan filterBulanTER (Januari s.d. November)
  const dataBulanan = masterPesertaPajak.map((p) => {
    let statusBulanIni = "Aktif (TER)";
    let brutoBulanIni = p.brutoBulanan;
    let kumulatifBruto = p.brutoBulanan * currentMonthIdx;
    let metodePerhitungan = p.tarifTER === 0 ? "TER 0% (Bawah PTKP)" : "TER Bulanan";
    let tarifBulanIniStr = p.tarifTER === 0 ? "0.00% (Nihil)" : `${(p.tarifTER * 100).toFixed(2)}% (${p.kategoriTER})`;
    let pphTERBulanIni = p.brutoBulanan * p.tarifTER;
    let pphP17BulanIni = 0;
    let pphDipotongBulanIni = pphTERBulanIni;
    let pphTERSebelumnya = 0;
    let biayaPensiunKumulatif = 0;
    let nettoKumulatif = 0;
    let pkpKumulatif = 0;
    let pphP17Terutang = 0;
    let statusKepesertaanFilter = p.tarifTER === 0 ? "TER 0% (Bawah PTKP)" : "TER Reguler (Aktif)";
    let isDapemTerakhir = false;
    let isPascaBerhenti = false;
    let isLebihBayar = false;
    let pphKumulatifJanBulanIni = 0;

    if (p.isBerhenti) {
      if (currentMonthIdx < p.bulanBerhentiIdx) {
        // Masih aktif sebelum bulan berhenti
        statusBulanIni = "Aktif (TER)";
        statusKepesertaanFilter = p.tarifTER === 0 ? "TER 0% (Bawah PTKP)" : "TER Reguler (Aktif)";
        brutoBulanIni = p.brutoBulanan;
        kumulatifBruto = p.brutoBulanan * currentMonthIdx;
        metodePerhitungan = p.tarifTER === 0 ? "TER 0% (Bawah PTKP)" : "TER Bulanan";
        tarifBulanIniStr = p.tarifTER === 0 ? "0.00% (Nihil)" : `${(p.tarifTER * 100).toFixed(2)}% (${p.kategoriTER})`;
        pphTERBulanIni = p.brutoBulanan * p.tarifTER;
        pphP17BulanIni = 0;
        pphDipotongBulanIni = pphTERBulanIni;
        pphKumulatifJanBulanIni = pphTERBulanIni * currentMonthIdx;
      } else if (currentMonthIdx === p.bulanBerhentiIdx) {
        // BULAN BERHENTI: DAPEM TERAKHIR SEBELUM DESEMBER
        // Sesuai BRD PJK 01.1 & PMK 168/2023: Menggunakan Tarif PPh Pasal 17
        isDapemTerakhir = true;
        statusBulanIni = "Pasal 17 (Dapem Terakhir)";
        statusKepesertaanFilter = "Pasal 17 (Dapem Terakhir)";
        brutoBulanIni = p.brutoBulanan;
        kumulatifBruto = p.brutoBulanan * p.bulanBerhentiIdx;
        biayaPensiunKumulatif = Math.min(kumulatifBruto * 0.05, 200000 * p.bulanBerhentiIdx);
        nettoKumulatif = kumulatifBruto - biayaPensiunKumulatif;
        pkpKumulatif = Math.max(0, nettoKumulatif - p.ptkp);
        pphP17Terutang = calcPPhPasal17(pkpKumulatif);
        pphTERSebelumnya = (p.bulanBerhentiIdx - 1) * (p.brutoBulanan * p.tarifTER);

        // Perhitungan Selisih: Jika P17 < PPh TER yang telah dipotong sebelumnya,
        // maka terjadi LEBIH BAYAR (angka negatif, dikembalikan ke peserta sesuai PMK 168/2023 Pasal 17 ayat 3)
        const selisihP17vsTER = pphP17Terutang - pphTERSebelumnya;
        pphDipotongBulanIni = selisihP17vsTER;
        isLebihBayar = selisihP17vsTER < 0;
        statusBulanIni = isLebihBayar ? "Pasal 17 (Lebih Bayar)" : "Pasal 17 (Dapem Terakhir)";
        statusKepesertaanFilter = isLebihBayar ? "Lebih Bayar (LB Dikembalikan)" : "Pasal 17 (Dapem Terakhir)";
        metodePerhitungan = isLebihBayar ? "Pasal 17 (Lebih Bayar)" : "PPh Pasal 17 (Dapem Terakhir)";
        tarifBulanIniStr = "Pasal 17 Progresif";
        pphTERBulanIni = p.brutoBulanan * p.tarifTER;
        pphP17BulanIni = pphP17Terutang;
        // PPh Kumulatif Jan s.d. Bulan Ini = net setoran ke kas negara setelah dikurangi kelebihan bayar yang dikembalikan
        pphKumulatifJanBulanIni = pphTERSebelumnya + pphDipotongBulanIni;
      } else {
        // Pasca bulan berhenti (Dapem ditutup)
        isPascaBerhenti = true;
        statusBulanIni = "Non-Aktif";
        statusKepesertaanFilter = "Non-Aktif (Pasca Berhenti)";
        brutoBulanIni = 0;
        kumulatifBruto = p.brutoBulanan * p.bulanBerhentiIdx;
        biayaPensiunKumulatif = Math.min(kumulatifBruto * 0.05, 200000 * p.bulanBerhentiIdx);
        nettoKumulatif = kumulatifBruto - biayaPensiunKumulatif;
        pkpKumulatif = Math.max(0, nettoKumulatif - p.ptkp);
        pphP17Terutang = calcPPhPasal17(pkpKumulatif);
        pphTERSebelumnya = (p.bulanBerhentiIdx - 1) * (p.brutoBulanan * p.tarifTER);
        pphDipotongBulanIni = 0;
        metodePerhitungan = "Non-Aktif (Pasca Berhenti)";
        tarifBulanIniStr = "—";
        pphTERBulanIni = 0;
        pphP17BulanIni = 0;
        pphKumulatifJanBulanIni = pphP17Terutang;
      }
    } else {
      pphKumulatifJanBulanIni = pphTERBulanIni * currentMonthIdx;
    }

    return {
      ...p,
      statusBulanIni,
      statusKepesertaanFilter,
      brutoBulanIni,
      kumulatifBruto,
      pphKumulatifJanBulanIni,
      isLebihBayar,
      metodePerhitungan,
      tarifBulanIniStr,
      pphTERBulanIni,
      pphP17BulanIni,
      pphDipotongBulanIni,
      pphTERSebelumnya,
      biayaPensiunKumulatif,
      nettoKumulatif,
      pkpKumulatif,
      pphP17Terutang,
      isDapemTerakhir,
      isPascaBerhenti,
    };
  });

  // Filter Data Bulanan (Tab 1)
  const filteredDataBulanan = dataBulanan.filter((d) => {
    const matchSatker = filterSatker === "Semua" || d.satker === filterSatker;
    const matchMAK = filterMAK === "Semua" || d.mak === filterMAK;
    const matchTS = filterTunjukSilang === "Semua" || (filterTunjukSilang === "Ya" ? d.tunjukSilang : !d.tunjukSilang);
    const matchStatus = filterStatusPeserta === "Semua" ||
      (filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)"
        ? d.isLebihBayar
        : filterStatusPeserta === "TER 0% (Bawah PTKP)"
        ? d.statusKepesertaanFilter === "TER 0% (Bawah PTKP)"
        : filterStatusPeserta === "Pasal 17 (Dapem Terakhir)"
        ? d.isDapemTerakhir
        : d.statusKepesertaanFilter === filterStatusPeserta);
    const matchSearch = searchQuery === "" ||
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nik.includes(searchQuery) ||
      d.nrp.includes(searchQuery) ||
      (d.jabatan && d.jabatan.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSatker && matchMAK && matchTS && matchStatus && matchSearch;
  });

  // 2. DATA TAHUNAN & PENYESUAIAN AKHIR (TAB 2, 3, 4, 5)
  const dataTahunan = masterPesertaPajak.map((p) => {
    const bulanDiterima = p.isBerhenti ? p.bulanBerhentiIdx : 12;
    const brutoSetahun = p.brutoBulanan * bulanDiterima;
    const biayaPensiunSetahun = Math.min(brutoSetahun * 0.05, 200000 * bulanDiterima);
    const nettoSetahun = brutoSetahun - biayaPensiunSetahun;
    const pkp = Math.max(0, nettoSetahun - p.ptkp);
    const pphTerutangSetahunP17 = calcPPhPasal17(pkp); // Tanpa denda 20%

    // Pemotongan PPh 21 TER
    const pphTERBulanan = p.brutoBulanan * p.tarifTER; // Tanpa denda 20%
    const bulanTER = p.isBerhenti ? Math.max(0, bulanDiterima - 1) : 11;
    const pphDipotongJanNov = pphTERBulanan * bulanTER;

    // Pemotongan Penyesuaian Akhir (Masa Desember atau Dapem Terakhir)
    // Sesuai PMK 168/2023: bisa bernilai negatif (Lebih Bayar Dikembalikan)
    const pphPenyesuaianAkhir = pphTerutangSetahunP17 - pphDipotongJanNov;
    const isLebihBayarTahunan = pphPenyesuaianAkhir < 0;

    // PPh Bulanan Metode Lama (Pasal 17 Rata-Rata)
    const pphP17Bulanan = pphTerutangSetahunP17 / bulanDiterima;

    return {
      ...p,
      bulanDiterima,
      brutoSetahun,
      biayaPensiunSetahun,
      nettoSetahun,
      pkp,
      pphTerutangSetahunP17,
      pphTERBulanan,
      bulanTER,
      pphDipotongJanNov,
      pphPenyesuaianAkhir,
      isLebihBayarTahunan,
      pphP17Bulanan,
      selisihBulanan: pphTERBulanan - pphP17Bulanan,
      selisihPersen: pphP17Bulanan > 0 ? (((pphTERBulanan - pphP17Bulanan) / pphP17Bulanan) * 100).toFixed(1) : "0",
      masaPerolehanStr: p.isBerhenti ? `01 - 0${bulanDiterima}` : "01 - 12",
      keteranganPelunasan: p.isBerhenti
        ? (isLebihBayarTahunan ? `Lebih Bayar Dikembalikan (Masa ${p.bulanBerhentiNama})` : `Lunas Masa ${p.bulanBerhentiNama} (Dapem Terakhir)`)
        : (isLebihBayarTahunan ? "Lebih Bayar Dikembalikan (Masa Des)" : "Lunas Masa Desember")
    };
  });

  // Filter Data Tahunan
  const filteredDataTahunan = dataTahunan.filter((d) => {
    const matchSatker = filterSatker === "Semua" || d.satker === filterSatker;
    const matchMAK = filterMAK === "Semua" || d.mak === filterMAK;
    const matchTS = filterTunjukSilang === "Semua" || (filterTunjukSilang === "Ya" ? d.tunjukSilang : !d.tunjukSilang);
    const matchSearch = searchQuery === "" ||
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nik.includes(searchQuery) ||
      d.nrp.includes(searchQuery) ||
      (d.jabatan && d.jabatan.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSatker && matchMAK && matchTS && matchSearch;
  });

  // Summary Metrics Bulanan (Dasar Penyetoran & Tagihan ke Kemenkeu)
  const totalPesertaBulanIni = filteredDataBulanan.length;
  const totalBrutoBulanIni = filteredDataBulanan.reduce((a, b) => a + b.brutoBulanIni, 0);
  const totalKumulatifBrutoBulanIni = filteredDataBulanan.reduce((a, b) => a + b.kumulatifBruto, 0);
  const totalPPhKumulatifBulanIni = filteredDataBulanan.reduce((a, b) => a + b.pphKumulatifJanBulanIni, 0);
  const totalPPhDipotongBulanIni = filteredDataBulanan.reduce((a, b) => a + b.pphDipotongBulanIni, 0);
  const totalLebihBayarBulanIni = dataBulanan
    .filter((d) => d.pphDipotongBulanIni < 0)
    .reduce((a, b) => a + Math.abs(b.pphDipotongBulanIni), 0);
  const jumlahPesertaLebihBayar = dataBulanan.filter((d) => d.pphDipotongBulanIni < 0).length;
  const totalPesertaTER = filteredDataBulanan.filter((d) => d.statusKepesertaanFilter === "TER Reguler (Aktif)" || d.statusKepesertaanFilter === "TER 0% (Bawah PTKP)").length;
  const totalPesertaNihil = filteredDataBulanan.filter((d) => d.statusKepesertaanFilter === "TER 0% (Bawah PTKP)").length;
  const totalPesertaP17Berhenti = filteredDataBulanan.filter((d) => d.isDapemTerakhir).length;
  const totalPesertaNonAktif = filteredDataBulanan.filter((d) => d.statusKepesertaanFilter === "Non-Aktif (Pasca Berhenti)").length;

  const tabsConfig = [
    {
      id: "ter_jan_nov",
      label: "Rekap PPh 21 Bulanan (Jan–Nov)",
      icon: <Calculator size={15} />,
      badge: "TER & P17 Berhenti"
    },
    {
      id: "pasal17_des",
      label: "PPh Pasal 17 Penyesuaian (Des & Berhenti)",
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
      label: "Bukti Potong 1721-A2 & Coretax",
      icon: <Receipt size={15} />,
    },
  ];

  const handleExportTab = () => {
    if (tab === "ter_jan_nov") {
      setPreview({
        title: `Laporan Rekap PPh 21 Bulanan — Masa ${filterBulanTER} 2026`,
        subtitle: `Rekapitulasi Perhitungan PPh 21 Menggunakan Tarif TER dan Tarif Pasal 17 (Dapem Terakhir Peserta Berhenti) — Sesuai PMK 168/2023`,
        type: "table",
        fileName: `Rekap_PPh21_Bulanan_${filterBulanTER}_2026.xlsx`,
        content: {
          columns: [
            "No",
            "MAK",
            "NIK",
            "NRP / Nopens",
            "Peserta Pensiun",
            "Jabatan Terakhir",
            "Status PTKP",
            "Bruto Bulan Ini",
            "PPh Kumulatif",
            "Metode Perhitungan",
            "Tarif Berlaku",
            "PPh 21 TER",
            "PPh P17 (Berhenti)",
            "PPh Dipotong Bulan Ini",
            "Tunjuk Silang",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "left",
            "left",
            "center",
            "right",
            "right",
            "center",
            "center",
            "right",
            "right",
            "right",
            "center",
          ],
          rows: filteredDataBulanan.map((d, i) => [
            i + 1,
            d.mak,
            d.nik,
            d.nrp,
            d.nama,
            d.jabatan,
            `${d.kodeJiwa} (${fmt(d.ptkp)})`,
            fmt(d.brutoBulanIni),
            fmt(d.pphKumulatifJanBulanIni),
            d.metodePerhitungan,
            d.tarifBulanIniStr,
            d.isPascaBerhenti ? "—" : fmt(d.pphTERBulanIni),
            d.isDapemTerakhir ? fmt(d.pphP17BulanIni) : "—",
            d.pphDipotongBulanIni < 0
              ? `- ${fmt(Math.abs(d.pphDipotongBulanIni))} (LB Dikembalikan)`
              : fmt(d.pphDipotongBulanIni),
            d.tunjukSilang ? "Ganda" : "—",
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL MASA ${filterBulanTER.toUpperCase()} (${filteredDataBulanan.length} PESERTA)`,
              align: "left",
            },
            { text: fmt(totalBrutoBulanIni), align: "right" },
            { text: fmt(totalPPhKumulatifBulanIni), align: "right" },
            { colSpan: 2, text: "—", align: "center" },
            {
              text: fmt(filteredDataBulanan.reduce((a, b) => a + b.pphTERBulanIni, 0)),
              align: "right",
              color: "#1D4ED8",
            },
            {
              text: fmt(filteredDataBulanan.reduce((a, b) => a + b.pphP17BulanIni, 0)),
              align: "right",
              color: "#7C3AED",
            },
            {
              text: fmt(totalPPhDipotongBulanIni),
              align: "right",
              color: totalPPhDipotongBulanIni >= 0 ? "#1D4ED8" : "#059669",
            },
            { text: "—", align: "center" },
          ],
          totalRows: filteredDataBulanan.length,
        },
      });
    } else if (tab === "pasal17_des") {
      setPreview({
        title: "Laporan Rekap PPh Pasal 17 Penyesuaian Akhir Tahun & Masa Terakhir 2026",
        subtitle: "Perhitungan Penyesuaian Akhir Tahun Masa Desember dan Dapem Terakhir Peserta Berhenti",
        type: "table",
        fileName: "Rekap_PPh_Pasal17_Penyesuaian_2026.xlsx",
        content: {
          columns: [
            "No",
            "MAK",
            "NIK",
            "NRP / Nopens",
            "Peserta Pensiun",
            "Jabatan Terakhir",
            "Masa Perolehan",
            "Bruto Kumulatif",
            "Biaya Pensiun",
            "PTKP",
            "PKP",
            "PPh Terutang (P17)",
            "PPh TER Sebelumnya",
            "PPh Dipotong Terakhir",
            "Status Pelunasan",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "left",
            "left",
            "center",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.mak,
            d.nik,
            d.nrp,
            d.nama,
            d.jabatan,
            `${d.bulanDiterima} Bulan (${d.masaPerolehanStr})`,
            fmt(d.brutoSetahun),
            fmt(d.biayaPensiunSetahun),
            fmt(d.ptkp),
            fmt(d.pkp),
            fmt(d.pphTerutangSetahunP17),
            fmt(d.pphDipotongJanNov),
            d.pphPenyesuaianAkhir < 0
              ? `- ${fmt(Math.abs(d.pphPenyesuaianAkhir))} (LB Dikembalikan)`
              : fmt(d.pphPenyesuaianAkhir),
            d.keteranganPelunasan,
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL AKUMULASI SELURUH PESERTA (${filteredDataTahunan.length} WP)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoSetahun, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.biayaPensiunSetahun, 0)),
              align: "right",
            },
            { text: "—", align: "center" },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pkp, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphDipotongJanNov, 0)),
              align: "right",
              color: "#059669",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphPenyesuaianAkhir, 0)),
              align: "right",
              color: "#7C3AED",
            },
            { text: "100% Selaras", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    } else if (tab === "spt_tahunan") {
      setPreview({
        title: "Laporan Rekapitulasi SPT Tahunan PPh 21 Badan PT ASABRI ke DJP Online",
        subtitle: "Dasar Pengisian Formulir SPT Tahunan PPh 21 Badan (100% Tarif Normal Sesuai PMK 168/2023)",
        type: "table",
        fileName: "Rekap_SPT_Tahunan_PPh21_2026.xlsx",
        content: {
          columns: [
            "No",
            "MAK",
            "NIK",
            "NRP / Nopens",
            "Peserta Pensiun",
            "Jabatan Terakhir",
            "Kode Jiwa",
            "Masa",
            "Bruto Setahun",
            "Biaya Pensiun",
            "PKP Setahun",
            "PPh Terutang Setahun",
            "Kredit PPh TER",
            "PPh Pelunasan",
            "Status Pemadanan NPWP",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "left",
            "left",
            "center",
            "center",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.mak,
            d.nik,
            d.nrp,
            d.nama,
            d.jabatan,
            d.kodeJiwa,
            d.masaPerolehanStr,
            fmt(d.brutoSetahun),
            fmt(d.biayaPensiunSetahun),
            fmt(d.pkp),
            fmt(d.pphTerutangSetahunP17),
            fmt(d.pphDipotongJanNov),
            fmt(d.pphPenyesuaianAkhir),
            d.statusNPWP.includes("Sementara") ? "NIK Sementara (Validasi)" : "NIK Terpadan Valid",
          ]),
          totalRow: [
            {
              colSpan: 8,
              text: `TOTAL AKUMULASI TAHUNAN (${filteredDataTahunan.length} WP)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoSetahun, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.biayaPensiunSetahun, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pkp, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0)),
              align: "right",
              color: "#1E40AF",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphDipotongJanNov, 0)),
              align: "right",
              color: "#059669",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphPenyesuaianAkhir, 0)),
              align: "right",
              color: "#7C3AED",
            },
            { text: "100% Terpadan Valid", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    } else if (tab === "komparasi_audit") {
      setPreview({
        title: "Laporan Audit Komparatif: PPh 21 Metode TER vs PPh Pasal 17",
        subtitle: "Alat Uji Petik Verifikasi dan Audit Kepatuhan Perpajakan PT ASABRI",
        type: "table",
        fileName: "Audit_Komparasi_TER_vs_Pasal17_2026.xlsx",
        content: {
          columns: [
            "No",
            "NIK",
            "NRP / Nopens",
            "Peserta Pensiun",
            "Jabatan Terakhir",
            "Masa Pajak",
            "Bruto Bulanan",
            "PPh 21 Metode TER (Baru)",
            "PPh 21 Metode Pasal 17 (Lama)",
            "Selisih (TER - P17)",
            "% Selisih",
            "Status Evaluasi",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "left",
            "left",
            "center",
            "right",
            "right",
            "right",
            "right",
            "center",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.nik,
            d.nrp,
            d.nama,
            d.jabatan,
            `${filterBulanTER} 2026`,
            fmt(d.brutoBulanan),
            fmt(d.pphTERBulanan),
            fmt(d.pphP17Bulanan),
            (d.selisihBulanan > 0 ? "+" : "") + fmt(d.selisihBulanan),
            `${d.selisihPersen}%`,
            d.selisihBulanan === 0 ? "Setara" : d.selisihBulanan > 0 ? "TER Lebih Tinggi" : "TER Lebih Rendah",
          ]),
          totalRow: [
            {
              colSpan: 6,
              text: `TOTAL EVALUASI AUDIT (${filteredDataTahunan.length} SAMPEL)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoBulanan, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTERBulanan, 0)),
              align: "right",
              color: "#1D4ED8",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphP17Bulanan, 0)),
              align: "right",
            },
            {
              text:
                (filteredDataTahunan.reduce((a, b) => a + b.selisihBulanan, 0) > 0 ? "+" : "") +
                fmt(filteredDataTahunan.reduce((a, b) => a + b.selisihBulanan, 0)),
              align: "right",
              color: filteredDataTahunan.reduce((a, b) => a + b.selisihBulanan, 0) > 0 ? "#DC2626" : "#059669",
            },
            { text: "—", align: "center" },
            { text: "TER Terverifikasi", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    } else {
      setPreview({
        title: "Penerbitan Digital Bukti Potong 1721-A2 & Integrasi Coretax DJP",
        subtitle: "Monitoring Distribusi Digital Bukti Potong ke Peserta Pensiun (Tanpa Sanksi 20%)",
        type: "table",
        fileName: "Log_Distribusi_Bukti_Potong_1721A2.xlsx",
        content: {
          columns: [
            "No",
            "NIK Dukcapil",
            "NRP / Nopens",
            "Nama Peserta",
            "Jabatan Terakhir",
            "NPWP / Status Coretax",
            "Masa Perolehan",
            "PPh 21 Terutang (A2)",
            "Kanal Akses",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "left",
            "left",
            "center",
            "center",
            "right",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.nik,
            d.nrp,
            d.nama,
            d.jabatan,
            d.npwp,
            d.masaPerolehanStr,
            fmt(d.pphTerutangSetahunP17),
            "Portal Peserta / AMA",
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL DOKUMEN 1721-A2 (${filteredDataTahunan.length} DOKUMEN)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0)),
              align: "right",
              color: "#1E293B",
            },
            { text: "100% Siap Akses", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    }
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* MODAL AUDIT TRAIL / RINCIAN KALKULASI PESERTA */}
      {detailKalkulasi && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 16,
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setDetailKalkulasi(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              width: "100%",
              maxWidth: 720,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              border: "1px solid #CBD5E1",
              overflow: "hidden",
            }}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                    Rincian Perhitungan Pajak PPh 21
                  </span>
                  <Badge color={detailKalkulasi.isDapemTerakhir ? "purple" : detailKalkulasi.isPascaBerhenti ? "gray" : "blue"}>
                    {detailKalkulasi.isDapemTerakhir ? "Pasal 17 (Dapem Terakhir)" : detailKalkulasi.isPascaBerhenti ? "Non-Aktif" : "TER Bulanan"}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                  Masa Pajak: <strong>{filterBulanTER} 2026</strong> • Dasar Regulasi: <strong>BRD PJK 01 &amp; PMK No. 168 Tahun 2023</strong>
                </div>
              </div>
              <button
                onClick={() => setDetailKalkulasi(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Isi Modal */}
            <div style={{ padding: 20, overflowY: "auto", flex: 1, fontSize: 12.5 }}>
              {/* Profil Peserta Card */}
              <div
                style={{
                  background: "#F1F5F9",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Nama Peserta Pensiun</div>
                  <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 13 }}>{detailKalkulasi.nama}</div>
                  <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600, marginTop: 2 }}>
                    Satker: {detailKalkulasi.satker}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Jabatan Terakhir</div>
                  <div style={{ fontWeight: 700, color: "#1E293B" }}>{detailKalkulasi.jabatan}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                    Unit Organisasi (Unor): <strong>{detailKalkulasi.unor}</strong>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>NRP / Nopens</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace", color: "#1E293B" }}>{detailKalkulasi.nrp}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>MAK: {detailKalkulasi.mak}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>NIK Dukcapil (16-Digit)</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace", color: "#1E293B" }}>{detailKalkulasi.nik}</div>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>{detailKalkulasi.statusNIK}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Status NPWP &amp; Tarif</div>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{detailKalkulasi.npwp}</div>
                  <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600 }}>{detailKalkulasi.statusNPWP}</div>
                </div>
              </div>

              {/* Status Peserta Berhenti Compact Indicator with Tooltip */}
              {detailKalkulasi.isDapemTerakhir && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    marginBottom: 14,
                    fontSize: 12,
                    color: "#334155",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge color="purple">Dapem Terakhir</Badge>
                    <span style={{ fontWeight: 600 }}>
                      Masa {detailKalkulasi.bulanBerhentiNama} 2026 ({detailKalkulasi.alasanBerhenti})
                    </span>
                  </div>
                  <span
                    title="Ketentuan Khusus Peserta Berhenti (BRD PJK 01.1 & Line 566): Pemotongan PPh 21 pada Dapem Terakhir menggunakan Tarif PPh Pasal 17 setahun dikurangi kredit PPh TER bulan-bulan sebelumnya."
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#64748B",
                      cursor: "help",
                      fontWeight: 600,
                    }}
                  >
                    <Info size={12} color="#7C3AED" /> Info Ketentuan P17
                  </span>
                </div>
              )}

              {detailKalkulasi.isPascaBerhenti && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    marginBottom: 14,
                    fontSize: 12,
                    color: "#334155",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge color="gray">Dapem Ditutup</Badge>
                    <span>
                      Berhenti menerima pensiun sejak <strong>{detailKalkulasi.bulanBerhentiNama} 2026</strong> ({detailKalkulasi.alasanBerhenti})
                    </span>
                  </div>
                  <span
                    title="Status Pasca Berhenti: Hak pensiun telah berakhir. Pada masa pajak berjalan penghasilan bruto dan potongan pajak bernilai Rp 0."
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#64748B",
                      cursor: "help",
                      fontWeight: 600,
                    }}
                  >
                    <Info size={12} color="#94A3B8" /> Info Non-Aktif
                  </span>
                </div>
              )}

              {/* Tabel Tahapan Perhitungan Matematis */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B", fontSize: 11.5, textTransform: "uppercase" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", width: 40 }}>No</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Komponen Penghasilan &amp; Kalkulasi</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Dasar Rumus / Aturan</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", width: 160 }}>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>1</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Penghasilan Bruto Bulan Ini</td>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>Gaji Pokok + Seluruh Tunjangan</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                        {fmt(detailKalkulasi.brutoBulanIni)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>2</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>
                        Akumulasi Penghasilan Bruto (Jan s.d. Bulan Ini)
                      </td>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>
                        {detailKalkulasi.isDapemTerakhir || detailKalkulasi.isPascaBerhenti
                          ? `${detailKalkulasi.bulanBerhentiIdx} Bulan Penerimaan Pensiun`
                          : `${currentMonthIdx} Bulan Penerimaan Pensiun`}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B" }}>
                        {fmt(detailKalkulasi.kumulatifBruto)}
                      </td>
                    </tr>

                    {/* Khusus Peserta Berhenti atau Masa Terakhir */}
                    {(detailKalkulasi.isDapemTerakhir || detailKalkulasi.isPascaBerhenti) ? (
                      <>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>3</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Pengurang: Biaya Pensiun Prorata</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>5% × Bruto (Maks Rp 200.000 × {detailKalkulasi.bulanBerhentiIdx} Bulan)</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#DC2626" }}>
                            - {fmt(detailKalkulasi.biayaPensiunKumulatif)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>4</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Penghasilan Netto Kumulatif</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Bruto Kumulatif - Biaya Pensiun</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                            {fmt(detailKalkulasi.nettoKumulatif)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>5</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>PTKP Sesuai Kode Jiwa ({detailKalkulasi.kodeJiwa})</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Dasar PTKP Setahun Penuh</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#64748B" }}>
                            {fmt(detailKalkulasi.ptkp)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>6</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0F172A" }}>Penghasilan Kena Pajak (PKP)</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Netto Kumulatif - PTKP</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                            {fmt(detailKalkulasi.pkpKumulatif)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>7</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700, color: "#5B21B6" }}>PPh Terutang PPh Pasal 17 (Tahunan)</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Tarif Progresif UU HPP (5%, 15%, 25%, 30%)</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#5B21B6" }}>
                            {fmt(detailKalkulasi.pphP17Terutang)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>8</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#059669" }}>
                            Kredit PPh 21 TER yang Telah Dipotong Sebelumnya
                          </td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>
                            {detailKalkulasi.bulanBerhentiIdx - 1} Bulan × {fmt(detailKalkulasi.brutoBulanan * detailKalkulasi.tarifTER)}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#059669" }}>
                            - {fmt(detailKalkulasi.pphTERSebelumnya)}
                          </td>
                        </tr>
                        <tr style={{ background: detailKalkulasi.pphDipotongBulanIni < 0 ? "#ECFDF5" : "#EDE9FE", fontWeight: 800 }}>
                          <td style={{ padding: "10px 12px", color: detailKalkulasi.pphDipotongBulanIni < 0 ? "#065F46" : "#5B21B6" }}>9</td>
                          <td colSpan={2} style={{ padding: "10px 12px", color: detailKalkulasi.pphDipotongBulanIni < 0 ? "#065F46" : "#4C1D95", fontSize: 13 }}>
                            {detailKalkulasi.pphDipotongBulanIni < 0
                              ? `Posisi PPh 21 Dapem Terakhir (Masa ${detailKalkulasi.bulanBerhentiNama} 2026)`
                              : `PPh 21 yang Dipotong pada Dapem Terakhir (${detailKalkulasi.bulanBerhentiNama} 2026)`}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 14, color: detailKalkulasi.pphDipotongBulanIni < 0 ? "#059669" : "#4338CA" }}>
                            {detailKalkulasi.isDapemTerakhir ? (
                              detailKalkulasi.pphDipotongBulanIni < 0 ? (
                                <div>
                                  <span>- {fmt(Math.abs(detailKalkulasi.pphDipotongBulanIni))}</span>
                                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#065F46", marginTop: 2 }}>
                                    Lebih Bayar (Wajib Dikembalikan ke Peserta)
                                  </div>
                                </div>
                              ) : (
                                fmt(detailKalkulasi.pphDipotongBulanIni)
                              )
                            ) : (
                              "Rp 0 (Non-Aktif)"
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>3</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Kategori &amp; Tarif TER Bulanan</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>{detailKalkulasi.kategoriTER} (Status {detailKalkulasi.kodeJiwa})</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#059669" }}>
                            {(detailKalkulasi.tarifTER * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr style={{ background: "#EFF6FF", fontWeight: 800 }}>
                          <td style={{ padding: "10px 12px", color: "#1E40AF" }}>4</td>
                          <td colSpan={2} style={{ padding: "10px 12px", color: "#1E3A8A", fontSize: 13 }}>
                            PPh 21 TER yang Dipotong Bulan Ini
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 14, color: "#1D4ED8" }}>
                            {fmt(detailKalkulasi.pphDipotongBulanIni)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Informasi Khusus Lebih Bayar Peserta Berhenti (Compact with Tooltip) */}
              {detailKalkulasi.pphDipotongBulanIni < 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#059669" }}>
                      Kompensasi Lebih Bayar: {fmt(Math.abs(detailKalkulasi.pphDipotongBulanIni))}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>
                      (Dikembalikan ke slip pensiun {detailKalkulasi.bulanBerhentiNama})
                    </span>
                  </div>
                  <span
                    title={`PMK No. 168/2023 Ps. 17(3) & BRD PJK 01.1: Akumulasi PPh TER (${fmt(detailKalkulasi.pphTERSebelumnya)}) melebihi PPh P17 setahun (${fmt(detailKalkulasi.pphP17Terutang)}). Kelebihan wajib dikembalikan ASABRI pada slip Dapem berjalan dan mengurangi setoran kas negara.`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#059669",
                      background: "#F0FDF4",
                      border: "1px solid #A7F3D0",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "help",
                      fontWeight: 600,
                    }}
                  >
                    <Info size={12} color="#059669" /> Ketentuan LB
                  </span>
                </div>
              )}

              {/* Status Pemadanan Regulasi Footer Compact Badge with Tooltip */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <span
                  title="PMK No. 168/2023 & UU HPP: Seluruh perhitungan menggunakan Tarif Normal 100% (sanksi kenaikan 20% non-NPWP resmi dihapus). Terhubung pemadanan NIK 16-digit Dukcapil dan Coretax DJP."
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11.5,
                    color: "#475569",
                    cursor: "help",
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  Kepatuhan PMK No. 168/2023 (Tarif Normal 100% Bebas Denda 20%)
                  <Info size={11} color="#94A3B8" />
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>Data tervalidasi Coretax DJP</span>
              </div>
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                background: "#F8FAFC",
              }}
            >
              <Btn variant="ghost" size="sm" onClick={() => setDetailKalkulasi(null)}>
                Tutup
              </Btn>
              <Btn
                size="sm"
                onClick={() => {
                  setPreview({
                    title: `Lembar Audit PPh 21 — ${detailKalkulasi.nama}`,
                    subtitle: `Masa Pajak ${filterBulanTER} 2026 • Metode: ${detailKalkulasi.metodePerhitungan}`,
                    type: "table",
                    fileName: `Audit_Pajak_${detailKalkulasi.nrp}_${filterBulanTER}.pdf`,
                    content: {
                      columns: ["Komponen Kalkulasi", "Nilai / Keterangan"],
                      rows: [
                        ["Nama Peserta", detailKalkulasi.nama],
                        ["Jabatan Terakhir", detailKalkulasi.jabatan],
                        ["Satker / Unor", `${detailKalkulasi.satker} • ${detailKalkulasi.unor}`],
                        ["NRP / NIK", `${detailKalkulasi.nrp} / ${detailKalkulasi.nik}`],
                        ["Kode Jiwa / PTKP", `${detailKalkulasi.kodeJiwa} (${fmt(detailKalkulasi.ptkp)})`],
                        ["Status NPWP (PMK 168)", detailKalkulasi.statusNPWP],
                        ["Penghasilan Bruto Bulan Ini", fmt(detailKalkulasi.brutoBulanIni)],
                        ["Penghasilan Bruto Kumulatif", fmt(detailKalkulasi.kumulatifBruto)],
                        ["Metode Perhitungan", detailKalkulasi.metodePerhitungan],
                        ["Tarif yang Berlaku", detailKalkulasi.tarifBulanIniStr],
                        ["PPh Terutang P17 (Khusus Berhenti)", detailKalkulasi.isDapemTerakhir ? fmt(detailKalkulasi.pphP17BulanIni) : "—"],
                        ["Kredit PPh TER Sebelumnya", detailKalkulasi.isDapemTerakhir ? fmt(detailKalkulasi.pphTERSebelumnya) : "—"],
                        ["PPh 21 Dipotong Bulan Ini", fmt(detailKalkulasi.pphDipotongBulanIni)],
                      ],
                      totalRows: 11,
                    },
                  });
                }}
              >
                <Download size={13} /> Ekspor Lembar Audit
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ENTERPRISE TAB BAR WITH INTEGRATED CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid #CBD5E1`,
          marginBottom: 16,
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
                {t.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: isActive ? "#EFF6FF" : "#F1F5F9",
                      color: isActive ? COLORS.blue : "#64748B",
                      padding: "1px 6px",
                      borderRadius: 10,
                      border: `1px solid ${isActive ? "#BFDBFE" : "#E2E8F0"}`,
                    }}
                  >
                    {t.badge}
                  </span>
                )}
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
            label="Masa Pajak (Bulan)"
            value={filterBulanTER}
            onChange={setFilterBulanTER}
            options={BULAN_OPTIONS}
            minW={130}
          />
        )}
        <Select
          label="Satker / Unor"
          value={filterSatker}
          onChange={setFilterSatker}
          options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI", "ASN Kemenhan", "ASN Polri"]}
          minW={130}
        />
        <Select
          label="Kode MAK"
          value={filterMAK}
          onChange={setFilterMAK}
          options={["Semua", "513113", "513114", "513122", "513123"]}
          minW={110}
        />
        {tab === "ter_jan_nov" && (
          <Select
            label="Status Peserta / Metode"
            value={filterStatusPeserta}
            onChange={setFilterStatusPeserta}
            options={["Semua", "TER Reguler (Aktif)", "TER 0% (Bawah PTKP)", "Pasal 17 (Dapem Terakhir)", "Lebih Bayar (LB Dikembalikan)", "Non-Aktif (Pasca Berhenti)"]}
            minW={220}
          />
        )}
        <Select
          label="Tunjuk Silang"
          value={filterTunjukSilang}
          onChange={setFilterTunjukSilang}
          options={["Semua", "Ya", "Tidak"]}
          minW={120}
        />

        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11.5, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>
            Pencarian Peserta (Nama / NIK / NRP / Jabatan)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Cari nama, NIK, NRP, atau jabatan..."
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
      {/* TAB 1: REKAP PERHITUNGAN PPH 21 BULANAN (BRD 4.5.21 & PJK 01) */}
      {/* ========================================================================= */}
      {tab === "ter_jan_nov" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          {/* Quick Metrics Bar Tab 1 - Clean & Neutral */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {/* Card 1: Total Peserta */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "12px 16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Total Peserta Terdaftar</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{totalPesertaBulanIni} Peserta</div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>
                Aktif: {totalPesertaBulanIni - totalPesertaNonAktif} • Non-Aktif: {totalPesertaNonAktif}
              </div>
            </div>

            {/* Card 2: Total Bruto */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "12px 16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Total Bruto Masa {filterBulanTER}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>
                {fmt(totalBrutoBulanIni)}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Dasar pengenaan TER / P17</div>
            </div>

            {/* Card 3: PPh 21 Dipotong */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "12px 16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>PPh 21 Dipotong (Netto)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>
                {fmt(totalPPhDipotongBulanIni)}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Netto setoran ke Kas Negara</div>
            </div>

            {/* Card 4: PPh Kumulatif */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "12px 16px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>PPh Kumulatif (s.d. {filterBulanTER})</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>
                {fmt(totalPPhKumulatifBulanIni)}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Dasar rekonsiliasi Kemenkeu</div>
            </div>

            {/* Card 5: Posisi Lebih Bayar */}
            <div
              onClick={() => {
                if (totalLebihBayarBulanIni > 0) {
                  setFilterStatusPeserta((prev) =>
                    prev === "Lebih Bayar (LB Dikembalikan)" ? "Semua" : "Lebih Bayar (LB Dikembalikan)"
                  );
                }
              }}
              style={{
                background: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "#F8FAFC" : "#FFFFFF",
                borderRadius: 8,
                padding: "12px 16px",
                border: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "2px solid #0F172A" : "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: totalLebihBayarBulanIni > 0 ? "pointer" : "default",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}
                  title="PMK 168/2023 Ps. 17(3): Nilai Lebih Bayar wajib dikembalikan langsung kepada peserta pada slip Dapem bulan berjalan dan mengurangi setoran kas negara."
                >
                  Posisi Lebih Bayar (LB)
                  <Info size={12} color="#94A3B8" style={{ cursor: "help" }} />
                </span>
                {totalLebihBayarBulanIni > 0 && (
                  <span
                    style={{
                      fontSize: 9.5,
                      background: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "#0F172A" : "#F1F5F9",
                      color: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "#FFFFFF" : "#475569",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontWeight: 700,
                      border: "1px solid #CBD5E1",
                    }}
                  >
                    {filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "Filter Aktif" : "Filter"}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: totalLebihBayarBulanIni > 0 ? "#059669" : "#64748B", fontFamily: "monospace", marginTop: 2 }}>
                {totalLebihBayarBulanIni > 0 ? `- ${fmt(totalLebihBayarBulanIni)}` : "Nihil (Rp 0)"}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>
                {totalLebihBayarBulanIni > 0
                  ? `${jumlahPesertaLebihBayar} WP • Dikembalikan ke Slip`
                  : `TER: ${totalPesertaTER} • P17: ${totalPesertaP17Berhenti}`}
              </div>
            </div>
          </div>

          {/* Section Header with Concise Tooltip Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Rekap PPh 21 Bulanan — Masa {filterBulanTER} 2026
              </h3>
              <span
                title="PMK No. 168/2023 & BRD PJK 01: Menerapkan tarif TER untuk peserta reguler aktif dan tarif PPh Pasal 17 pada Dapem terakhir peserta berhenti. Sanksi kenaikan 20% non-NPWP telah resmi dihapuskan (tarif standar 100% normal)."
                style={{
                  fontSize: 11,
                  color: "#475569",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  padding: "2.5px 8px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "help",
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={13} color="#059669" />
                PMK 168/2023 Compliant
                <Info size={11} color="#94A3B8" />
              </span>
            </div>

            {totalLebihBayarBulanIni > 0 && (
              <button
                onClick={() =>
                  setFilterStatusPeserta((prev) =>
                    prev === "Lebih Bayar (LB Dikembalikan)" ? "Semua" : "Lebih Bayar (LB Dikembalikan)"
                  )
                }
                title="PMK 168/2023 Ps. 17(3): Nilai LB dikembalikan ke slip Dapem peserta dan mengompensasi setoran kas negara."
                style={{
                  background: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "#0F172A" : "#F8FAFC",
                  color: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "#FFFFFF" : "#065F46",
                  border: filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "1px solid #0F172A" : "1px solid #A7F3D0",
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <AlertTriangle size={12} color={filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "#FCD34D" : "#059669"} />
                <span>{jumlahPesertaLebihBayar} WP Lebih Bayar (-{fmt(totalLebihBayarBulanIni)})</span>
                <span style={{ fontSize: 10, opacity: 0.8 }}>
                  {filterStatusPeserta === "Lebih Bayar (LB Dikembalikan)" ? "• Reset" : "• Lihat WP"}
                </span>
              </button>
            )}
          </div>

          {filteredDataBulanan.length === 0 ? (
            <NoData />
          ) : (
            <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                    <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP / Nopens</th>
                    <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                    <th style={{ padding: "9px 10px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Jabatan Terakhir</th>
                    <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Status PTKP</th>
                    <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Bulan Ini</th>
                    <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Kumulatif</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Metode Perhitungan</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Tarif Berlaku</th>
                    <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 TER</th>
                    <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh P17 (Berhenti)</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong Bulan Ini</th>
                    <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Tunjuk Silang</th>
                    <th style={{ padding: "9px 10px", textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataBulanan.map((d, i) => (
                    <tr
                      key={d.id}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        background: d.isLebihBayar
                          ? "#F0FDF4"
                          : d.isDapemTerakhir
                          ? "#FAF5FF"
                          : d.isPascaBerhenti
                          ? "#F8FAFC"
                          : i % 2 === 1
                          ? "#F8FAFC"
                          : "#FFFFFF",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = d.isLebihBayar ? "#DCFCE7" : "#F1F5F9")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = d.isLebihBayar
                          ? "#F0FDF4"
                          : d.isDapemTerakhir
                          ? "#FAF5FF"
                          : d.isPascaBerhenti
                          ? "#F8FAFC"
                          : i % 2 === 1
                          ? "#F8FAFC"
                          : "#FFFFFF")
                      }
                    >
                      <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "8px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                        {d.mak}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                        {d.nik}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                        {d.nrp}
                      </td>
                      <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                        {d.nama}
                      </td>
                      <td style={{ padding: "8px 10px", borderRight: "1px solid #E2E8F0", fontSize: 11.5, color: "#1E293B", fontWeight: 600 }}>
                        {d.jabatan}
                      </td>
                      <td style={{ padding: "8px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <span style={{ fontWeight: 700, color: "#0F172A" }}>{d.kodeJiwa}</span>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{fmt(d.ptkp)}</div>
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: d.brutoBulanIni === 0 ? "#94A3B8" : "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.brutoBulanIni)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(d.pphKumulatifJanBulanIni)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <Badge color={d.isLebihBayar ? "green" : d.isDapemTerakhir ? "purple" : d.isPascaBerhenti ? "gray" : "blue"}>
                          {d.metodePerhitungan}
                        </Badge>
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: d.isDapemTerakhir ? "#7C3AED" : "#059669", borderRight: "1px solid #E2E8F0" }}>
                        {d.tarifBulanIniStr}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                        {d.isPascaBerhenti ? "—" : fmt(d.pphTERBulanIni)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: d.isDapemTerakhir ? "#7C3AED" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {d.isDapemTerakhir ? fmt(d.pphP17BulanIni) : "—"}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>
                        {d.pphDipotongBulanIni < 0 ? (
                          <div>
                            <span style={{ color: "#059669", fontWeight: 800, fontSize: 13 }}>
                              - {fmt(Math.abs(d.pphDipotongBulanIni))}
                            </span>
                            <div style={{ marginTop: 2 }}>
                              <span
                                style={{
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  background: "#ECFDF5",
                                  color: "#065F46",
                                  padding: "1.5px 6px",
                                  borderRadius: 4,
                                  border: "1px solid #A7F3D0",
                                  display: "inline-block",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                ● LB (Dikembalikan ke Slip)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: d.pphDipotongBulanIni > 0 ? (d.isDapemTerakhir ? "#6D28D9" : "#1D4ED8") : "#64748B" }}>
                            {fmt(d.pphDipotongBulanIni)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "8px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        {d.tunjukSilang ? (
                          <span
                            title={d.sumberPensiunGanda}
                            style={{
                              background: "#FEF3C7",
                              color: "#B45309",
                              border: "1px solid #FDE68A",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <Link2 size={10} /> Ganda
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <button
                          onClick={() => setDetailKalkulasi(d)}
                          style={{
                            background: "#EFF6FF",
                            border: `1px solid #BFDBFE`,
                            color: COLORS.blue,
                            padding: "3px 8px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Eye size={12} /> Rincian
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                    <td colSpan={7} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                      TOTAL MASA {filterBulanTER.toUpperCase()} ({filteredDataBulanan.length} PESERTA)
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                      {fmt(totalBrutoBulanIni)}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                      {fmt(totalPPhKumulatifBulanIni)}
                    </td>
                    <td colSpan={2} style={{ borderRight: "1px solid #CBD5E1" }} />
                    <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", borderRight: "1px solid #CBD5E1" }}>
                      {fmt(filteredDataBulanan.reduce((a, b) => a + b.pphTERBulanIni, 0))}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", borderRight: "1px solid #CBD5E1" }}>
                      {fmt(filteredDataBulanan.reduce((a, b) => a + b.pphP17BulanIni, 0))}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                      <div style={{ color: totalPPhDipotongBulanIni >= 0 ? "#1D4ED8" : "#059669", fontWeight: 900, fontSize: 13 }}>
                        {fmt(totalPPhDipotongBulanIni)}
                      </div>
                      {totalLebihBayarBulanIni > 0 && (
                        <div style={{ fontSize: 9.5, color: "#059669", fontWeight: 700, marginTop: 1 }}>
                          (Kompensasi LB: -{fmt(totalLebihBayarBulanIni)})
                        </div>
                      )}
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
      {/* TAB 2: REKAP PPH PASAL 17 PENYESUAIAN AKHIR (BRD 4.5.22) */}
      {/* ========================================================================= */}
      {tab === "pasal17_des" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Rekap PPh Pasal 17 Penyesuaian (Dapem Desember &amp; Terakhir)
              </h3>
              <span
                title="Cakupan BRD PJK 01.1:&#10;1. Peserta Reguler: Penyesuaian akhir tahun pada Dapem Masa Desember (akumulasi 12 bln).&#10;2. Peserta Berhenti Sebelum Desember: Penyesuaian dihitung pada Dapem terakhir saat berhenti."
                style={{
                  fontSize: 11,
                  color: "#475569",
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  padding: "2.5px 8px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "help",
                  fontWeight: 600,
                }}
              >
                <Info size={11} color="#64748B" /> Ketentuan Cakupan P17
              </span>
            </div>
            <span style={{ fontSize: 11.5, color: "#64748B" }}>
              Dasar Regulasi: <strong>PMK No. 168/2023 Ps. 16 &amp; 17</strong>
            </span>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP / Nopens</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Jabatan Terakhir</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa Perolehan</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Kumulatif</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Biaya Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PTKP</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PKP</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Terutang (P17)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh TER Sebelumnya</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong Terakhir</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status Pelunasan</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataTahunan.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: d.isBerhenti ? "#FAF5FF" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = d.isBerhenti ? "#FAF5FF" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                    }
                  >
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>{d.mak}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>{d.nik}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>{d.nrp}</td>
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                      {d.nama}
                    </td>
                    <td style={{ padding: "8px 10px", borderRight: "1px solid #E2E8F0", fontSize: 11.5, color: "#1E293B", fontWeight: 600 }}>
                      {d.jabatan}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                      <Badge color={d.isBerhenti ? "purple" : "blue"}>
                        {d.bulanDiterima} Bulan ({d.masaPerolehanStr})
                      </Badge>
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
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>
                      {d.pphPenyesuaianAkhir < 0 ? (
                        <div>
                          <span style={{ color: "#059669", fontWeight: 800, fontSize: 12.5 }}>
                            - {fmt(Math.abs(d.pphPenyesuaianAkhir))}
                          </span>
                          <div style={{ marginTop: 2 }}>
                            <span
                              style={{
                                fontSize: 9.5,
                                fontWeight: 700,
                                background: "#ECFDF5",
                                color: "#065F46",
                                padding: "1.5px 6px",
                                borderRadius: 4,
                                border: "1px solid #A7F3D0",
                                display: "inline-block",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Lebih Bayar (Dikembalikan)
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#7C3AED" }}>{fmt(d.pphPenyesuaianAkhir)}</span>
                      )}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <Badge color={d.pphPenyesuaianAkhir < 0 ? "orange" : "green"}>{d.keteranganPelunasan}</Badge>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                  <td colSpan={7} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                    TOTAL AKUMULASI SELURUH PESERTA ({filteredDataTahunan.length} WP)
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoSetahun, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.biayaPensiunSetahun, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>—</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pkp, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pphDipotongJanNov, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", fontWeight: 900, borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pphPenyesuaianAkhir, 0))}
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
                  <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP / Nopens</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Jabatan Terakhir</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kode Jiwa</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Setahun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Biaya Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PKP Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Terutang Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Kredit PPh TER</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Pelunasan</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status Pemadanan NPWP</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataTahunan.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                      {d.mak}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      {d.nik}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      {d.nrp}
                    </td>
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                      {d.nama}
                    </td>
                    <td style={{ padding: "8px 10px", borderRight: "1px solid #E2E8F0", fontSize: 11.5, color: "#1E293B", fontWeight: 600 }}>
                      {d.jabatan}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                      {d.kodeJiwa}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                      <Badge color={d.isBerhenti ? "purple" : "gray"}>{d.masaPerolehanStr}</Badge>
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
                      {fmt(d.pphPenyesuaianAkhir)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <Badge color={d.statusNPWP.includes("Sementara") ? "yellow" : "green"}>
                        {d.statusNPWP.includes("Sementara") ? "NIK Sementara (Validasi)" : "NIK Terpadan Valid"}
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
                  <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP / Nopens</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Jabatan Terakhir</th>
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
                {filteredDataTahunan.map((d, i) => {
                  const isZero = d.selisihBulanan === 0;
                  const isHigher = d.selisihBulanan > 0;
                  return (
                    <tr
                      key={d.id}
                      style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                    >
                      <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                        {d.nik}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                        {d.nrp}
                      </td>
                      <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                        {d.nama}
                      </td>
                      <td style={{ padding: "8px 10px", borderRight: "1px solid #E2E8F0", fontSize: 11.5, color: "#1E293B", fontWeight: 600 }}>
                        {d.jabatan}
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
            Penerbitan Digital Bukti Potong 1721-A2 &amp; Integrasi Coretax DJP
          </SectionTitle>

          {/* Stepper Wizard */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { n: 1, t: "Impor Data / Manifes Coretax" },
              { n: 2, t: "Validasi NIK 16-Digit Dukcapil (PMK 168/2023)" },
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
                Sinkronisasi &amp; Impor Data Manifes Bukti Potong dari Coretax DJP
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, maxWidth: 540, margin: "4px auto 0" }}>
                Sesuai BRD PJK 03 (Line 589): Bukti Potong PPh 21 bentuk 1721-A2 otomatis diterbitkan untuk <strong>Masa Desember</strong> atau <strong>Masa Terakhir</strong> penerima pensiun yang berhenti sebelum Desember (100% tarif normal tanpa sanksi 20%).
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
              {/* Ringkasan Validasi Pemadanan NIK/NPWP - Clean & Neutral */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Total Bukpot Diterbitkan</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{filteredDataTahunan.length} Dokumen</div>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Masa Desember &amp; Terakhir</div>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Pemadanan NIK = NPWP</span>
                    <span style={{ fontSize: 9.5, background: "#F1F5F9", color: "#475569", padding: "1px 6px", borderRadius: 4, fontWeight: 700, border: "1px solid #CBD5E1" }}>
                      Normal
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                    {filteredDataTahunan.filter((d) => !d.statusNIK.includes("Sementara")).length} Dokumen
                  </div>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>100% Bebas Denda 20% PMK 168</div>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>NIK Sementara (Validasi)</span>
                    <span
                      title="Sesuai BRD PJK 02.3: Peserta dengan status NIK sementara dalam proses rekonsiliasi data Dukcapil tetap dilayani dengan tarif normal tanpa potongan denda."
                      style={{ cursor: "help", display: "inline-flex", alignItems: "center" }}
                    >
                      <Info size={12} color="#94A3B8" />
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                    {filteredDataTahunan.filter((d) => d.statusNIK.includes("Sementara")).length} Dokumen
                  </div>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>BRD PJK 02.3 Validasi Dukcapil</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  {uploadStep < 2
                    ? "Status: Berkas manifes Coretax terverifikasi dan siap diaktifkan untuk akses mandiri via Portal Peserta & Aplikasi AMA."
                    : "Status: Bukti Potong 1721-A2 telah aktif dan dapat diunduh secara mandiri oleh peserta."}
                </div>
                {uploadStep < 2 ? (
                  <Btn onClick={() => setUploadStep(2)}>
                    <Mail size={14} /> Aktifkan Distribusi ke Portal Peserta
                  </Btn>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={15} /> Layanan Unduh Mandiri Aktif
                  </span>
                )}
              </div>

              {/* Tabel Bukpot per Peserta */}
              <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK Dukcapil</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP / Nopens</th>
                      <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Nama Peserta</th>
                      <th style={{ padding: "9px 10px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Jabatan Terakhir</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NPWP / Status Coretax</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa Perolehan</th>
                      <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Terutang (A2)</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kanal Akses</th>
                      <th style={{ padding: "9px 10px", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataTahunan.map((d, i) => (
                      <tr
                        key={d.id}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nik}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nrp}
                        </td>
                        <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                          {d.nama}
                        </td>
                        <td style={{ padding: "8px 10px", borderRight: "1px solid #E2E8F0", fontSize: 11.5, color: "#1E293B", fontWeight: 600 }}>
                          {d.jabatan}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                          {d.npwp}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={d.isBerhenti ? "purple" : "gray"}>{d.masaPerolehanStr}</Badge>
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
                                title: `Formulir 1721-A2 — Bukti Potong PPh 21 Tahun Pajak 2026`,
                                subtitle: `${d.nama} (${d.satker}) • Masa: ${d.masaPerolehanStr} • Pemotong: PT ASABRI (Persero)`,
                                type: "table",
                                fileName: `Bukti_Potong_1721_A2_${d.nrp}.pdf`,
                                content: {
                                  columns: ["Komponen Penghasilan & Pajak", "Rincian Resmi"],
                                  rows: [
                                    ["Nama Peserta Penerima Pensiun", d.nama],
                                    ["Nomor Induk Kependudukan (NIK)", d.nik],
                                    ["Nomor Pokok Wajib Pajak (NPWP)", d.npwp],
                                    ["Masa Perolehan Penghasilan", `${d.masaPerolehanStr} (${d.bulanDiterima} Bulan)`],
                                    ["Status Kode Jiwa / PTKP", `${d.kodeJiwa} (${fmt(d.ptkp)})`],
                                    ["Dasar Regulasi Pemotongan", "PMK 168/2023 & UU HPP (Tarif Standar Normal)"],
                                    ["A. Penghasilan Bruto Kumulatif", fmt(d.brutoSetahun)],
                                    ["B. Pengurang: Biaya Pensiun Prorata (5%)", fmt(d.biayaPensiunSetahun)],
                                    ["C. Penghasilan Netto Kumulatif (A - B)", fmt(d.nettoSetahun)],
                                    ["D. Penghasilan Kena Pajak / PKP (C - PTKP)", fmt(d.pkp)],
                                    ["E. PPh 21 Terutang (Pasal 17 Normal)", fmt(d.pphTerutangSetahunP17)],
                                    ["F. PPh 21 Telah Dipotong Sebelumnya (TER)", fmt(d.pphDipotongJanNov)],
                                    ["G. PPh 21 Dipotong Masa Terakhir (E - F)", fmt(d.pphPenyesuaianAkhir)],
                                    ["Status Sanksi Non-NPWP 20%", "TIDAK DIKENAKAN (Resmi Dihapuskan PMK 168)"],
                                  ],
                                  totalRows: 14,
                                },
                              })
                            }
                          >
                            <Eye size={12} /> Rincian
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
