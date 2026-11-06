import { useState } from "react";
import {
  Building2,
  Users,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Layers,
  ShieldCheck,
  Shield,
  Eye,
  Search,
  Check,
  Plus,
  History,
  Clock,
  FileCheck,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Receipt,
  Landmark,
  ArrowRightLeft,
  Wallet,
  Calendar,
  ChevronRight,
  Lock,
  Unlock,
  CheckCheck,
  TableProperties,
  FileSpreadsheet,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Table, Badge, Btn, PreviewModal, SatkerModal } from "../components/common";
import { RekonsiliasiJKKJKM } from "../components/rekonsiliasi/RekonsiliasiJKKJKM";
import { PENERIMAAN_DANA_EXCEL_DATA } from "../data/penerimaanDanaExcelData";
import {
  SATKER_THT_PENSIUN_ALL,
  SATKER_THT_TNI,
  SATKER_THT_POLRI,
  SATKER_PENSIUN_TNI,
  SATKER_PENSIUN_POLRI,
  generateProportionalSatkerList,
  formatNomorSuratPFK
} from "../constants/satkerData";

export const RekonsIuran = () => {
  // =========================================================================
  // 1. STATE PERIODE BULAN & TAHUN (MONTHLY STORAGE & TRACKING)
  // Memungkinkan penyimpanan & visualisasi data per-bulan secara smooth
  // =========================================================================
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("ALL"); // Default: "ALL" (Menampilkan seluruh record dengan kolom Tanggal)
  const [showMatrixView, setShowMatrixView] = useState(false); // Toggle Matriks 12 Bulan (YTD)
  const [showAddMonthModal, setShowAddMonthModal] = useState(false); // Modal Rekam Bulan Baru

  // =========================================================================
  // 2. STATE PROGRAM UTAMA (4 PROGRAM TERPISAH):
  // "THT"     : Iuran Premi Tabungan Hari Tua (Tarif 3,25% Gaji Pokok)
  // "PENSIUN" : Iuran Premi Pensiun (Tarif 4,75% Gaji Pokok)
  // "JKK"     : Iuran Premi JKK (Tarif 0,62% Basis Gaji Pokok • Rekon 3 Bulan)
  // "JKM"     : Iuran Premi JKM (Tarif 0,81% Basis Gaji Pokok • Rekon 3 Bulan)
  // =========================================================================
  const [activeProgram, setActiveProgram] = useState("JKM");

  // =========================================================================
  // 3. STATE SUBTAB UTAMA:
  // "rekonsiliasi" : Modul Rekonsiliasi Aktif Bulan / Periode Terpilih
  // "rekap_resmi"  : Format Excel Resmi ASABRI (4 Tabel Konsolidasi)
  // "history"      : Riwayat Dokumen Berita Acara Rekonsiliasi (BAR) Sah
  // =========================================================================
  const [activeSubtab, setActiveSubtab] = useState("rekonsiliasi");

  // =========================================================================
  // 4. PILIHAN MODEL REKONSILIASI UNTUK THT & PENSIUN:
  // "penerimaan_vs_skp" : Rekonsiliasi Penerimaan Dana (SP2D) vs Ketetapan SKP Kemenkeu
  // "kepesertaan_vs_skp": Rekonsiliasi Data Kepesertaan vs Ketetapan SKP Kemenkeu
  // =========================================================================
  const [thtRekonMode, setThtRekonMode] = useState("penerimaan_vs_skp");
  const [pensiunRekonMode, setPensiunRekonMode] = useState("penerimaan_vs_skp");
  const [viewModeKomparasi, setViewModeKomparasi] = useState("rekap");

  // =========================================================================
  // 5. PILIHAN PERIODE REKONSILIASI UNTUK JKK & JKM:
  // "bulanan"   : Rekonsiliasi Penerimaan Dana vs Data Kepesertaan Bulanan
  // "triwulan"  : Rekonsiliasi Berkala Per 3 Bulan (Evaluasi Kurang / Lebih Bayar)
  // =========================================================================
  const [jkkPeriodMode, setJkkPeriodMode] = useState("bulanan");
  const [jkmPeriodMode, setJkmPeriodMode] = useState("bulanan");
  const [selectedQuarter, setSelectedQuarter] = useState("TW3"); // "TW1" | "TW2" | "TW3" | "TW4"

  // Skenario Interaktif Triwulan III (Aktif Berjalan):
  // "kurang_bayar" : Realisasi Kas < Seharusnya -> Memicu Surat Tagihan Kekurangan Bayar
  // "lebih_bayar"  : Realisasi Kas > Seharusnya -> Memicu Kompensasi Pengurangan Tagihan Bulan Berikutnya (Oktober)
  // "nihil"        : Realisasi Kas == Seharusnya
  const [tw3Scenario, setTw3Scenario] = useState("kurang_bayar");

  // Status kompensasi dan tagihan susulan yang telah diterbitkan
  const [appliedCompensations, setAppliedCompensations] = useState({
    JKK_TW3: false,
    JKM_TW3: false
  });
  const [issuedShortfallBills, setIssuedShortfallBills] = useState({
    JKK_TW3: false,
    JKM_TW3: false
  });

  // Filter Data THT & Pensiun
  const [filterJenisDana, setFilterJenisDana] = useState("Semua"); // "Semua" | "THT" | "PENSIUN"
  const [filterSubDana, setFilterSubDana] = useState("Semua");

  const handleJenisDanaChange = (newJenis) => {
    setFilterJenisDana(newJenis);
    if (newJenis === "THT") {
      setFilterSubDana("THT_ALL");
    } else if (newJenis === "PENSIUN") {
      setFilterSubDana("PENSIUN_ALL");
    } else {
      setFilterSubDana("Semua");
    }
  };

  // State Filter & Search Global
  const [searchTerm, setSearchTerm] = useState("");

  // Preview Modal, Drilldown & Toast
  const [preview, setPreview] = useState(null);
  const [satkerModalData, setSatkerModalData] = useState(null);
  const [notice, setNotice] = useState(null);
  const [selectedMatraDetail, setSelectedMatraDetail] = useState(null);
  const [confirmCompleteItem, setConfirmCompleteItem] = useState(null);

  // Form State untuk Rekam / Sinkronisasi Bulan Baru
  const [formNewMonth, setFormNewMonth] = useState({
    bulan: "2026-10",
    namaBulan: "Oktober 2026",
    autoSyncPenagihan: true,
    noSuratTagihan: "1205/KU.06.06/KMR.N/X/2026",
    tglSuratTagihan: "15 Oktober 2026",
    noSKP: "S-201/PB.2/2026",
    tglSKP: "14 Oktober 2026",
    noSP2D: "SP2D-261018-009941",
    tglTerimaDana: "18 Oktober 2026",
    bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
    nominalTotal: 105450000000
  });

  const fmtB = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const fmtNum = (n) => Number(n || 0).toLocaleString("id-ID");

  // =========================================================================
  // 12 BULAN DAFTAR KALENDER TAHUN ANGGARAN
  // =========================================================================
  const MONTHS_LIST = [
    { key: "2026-01", no: "01", label: "Januari", short: "Jan", statusDefault: "selesai" },
    { key: "2026-02", no: "02", label: "Februari", short: "Feb", statusDefault: "selesai" },
    { key: "2026-03", no: "03", label: "Maret", short: "Mar", statusDefault: "selesai" },
    { key: "2026-04", no: "04", label: "April", short: "Apr", statusDefault: "selesai" },
    { key: "2026-05", no: "05", label: "Mei", short: "Mei", statusDefault: "selesai" },
    { key: "2026-06", no: "06", label: "Juni", short: "Jun", statusDefault: "selesai" },
    { key: "2026-07", no: "07", label: "Juli", short: "Jul", statusDefault: "selesai" },
    { key: "2026-08", no: "08", label: "Agustus", short: "Agu", statusDefault: "selesai" },
    { key: "2026-09", no: "09", label: "September", short: "Sep", statusDefault: "aktif" },
    { key: "2026-10", no: "10", label: "Oktober", short: "Okt", statusDefault: "draft" },
    { key: "2026-11", no: "11", label: "November", short: "Nov", statusDefault: "belum_ada" },
    { key: "2026-12", no: "12", label: "Desember", short: "Des", statusDefault: "belum_ada" }
  ];

  // =========================================================================
  // DATASET MULTI-MONTH STORE (REPOSITORI BULANAN)
  // Menyimpan record 4 pilar THT/Pensiun dan JKK/JKM untuk setiap bulan
  // =========================================================================
  const [monthlyStore, setMonthlyStore] = useState({
    "2026-09": {
      monthKey: "2026-09",
      namaBulan: "September 2026",
      status: "aktif", // "selesai" | "aktif" | "draft" | "belum_ada"
      statusLabel: "Sedang Berjalan (Siap Terbitkan BAR)",
      badgeColor: "blue",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "18 September 2026",
      noBAR: "BAR-09/REKON-PFK/IX/2026",
      tglSelesai: "18 September 2026",
      // Butir a.1: Penerimaan Dana vs SKP
      thtPensiunPenerimaan: [
        { id: "SKP-PFK-THT-TNI", danaType: "THT_TNI", namaDana: "THT TNI", pilar: "THT TNI", tarif: "3,25%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1190/KU.06.06/KMR.N/IX/2026", tglSuratTagihan: "15 September 2026", noSKP: "S-184/PB.2/2026", tglSKP: "14 September 2026", tglTerimaDana: "18 September 2026", bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu", noSP2D: "SP2D-260918-008921", nominalDanaSKP: 28540000000, nominalDiterima: 28540000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-PFK-THT-POLRI", danaType: "THT_POLRI", namaDana: "THT POLRI", pilar: "THT POLRI", tarif: "3,25%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1191/KU.06.06/KMR.N/IX/2026", tglSuratTagihan: "15 September 2026", noSKP: "S-184/PB.2/2026", tglSKP: "14 September 2026", tglTerimaDana: "18 September 2026", bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu", noSP2D: "SP2D-260918-008922", nominalDanaSKP: 14225000000, nominalDiterima: 14225000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-PFK-PEN-TNI", danaType: "PENSIUN_TNI", namaDana: "Pensiun TNI", pilar: "Pensiun TNI", tarif: "4,75%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1192/KU.06.06/KMR.N/IX/2026", tglSuratTagihan: "15 September 2026", noSKP: "S-184/PB.2/2026", tglSKP: "14 September 2026", tglTerimaDana: "18 September 2026", bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu", noSP2D: "SP2D-260918-008923", nominalDanaSKP: 41710000000, nominalDiterima: 41710000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-PFK-PEN-POLRI", danaType: "PENSIUN_POLRI", namaDana: "Pensiun POLRI", pilar: "Pensiun POLRI", tarif: "4,75%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1193/KU.06.06/KMR.N/IX/2026", tglSuratTagihan: "15 September 2026", noSKP: "S-184/PB.2/2026", tglSKP: "14 September 2026", tglTerimaDana: "18 September 2026", bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu", noSP2D: "SP2D-260918-008924", nominalDanaSKP: 20805000000, nominalDiterima: 20805000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" }
      ],
      // Butir a.2: Data Kepesertaan vs SKP
      thtPensiunKepesertaan: [
        { id: "REKAP-THT-TNI-09", danaType: "THT_TNI", pilar: "THT TNI", namaDana: "THT TNI", tarif: "3,25%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285420, nominalSistem: 28526460000, pesertaSKP: 285500, nominalSKP: 28540000000, selisihNominal: -13540000, statusRekap: "Selisih Mutasi (-80)" },
        { id: "REKAP-THT-POLRI-09", danaType: "THT_POLRI", pilar: "THT POLRI", namaDana: "THT POLRI", tarif: "3,25%", matra: "POLRI & PNS Polri", pesertaSistem: 142200, nominalSistem: 14225000000, pesertaSKP: 142200, nominalSKP: 14225000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-PEN-TNI-09", danaType: "PENSIUN_TNI", pilar: "Pensiun TNI", namaDana: "Pensiun TNI", tarif: "4,75%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285420, nominalSistem: 41673540000, pesertaSKP: 285500, nominalSKP: 41710000000, selisihNominal: -36460000, statusRekap: "Selisih Mutasi (-80)" },
        { id: "REKAP-PEN-POLRI-09", danaType: "PENSIUN_POLRI", pilar: "Pensiun POLRI", namaDana: "Pensiun POLRI", tarif: "4,75%", matra: "POLRI & PNS Polri", pesertaSistem: 142200, nominalSistem: 20805000000, pesertaSKP: 142200, nominalSKP: 20805000000, selisihNominal: 0, statusRekap: "Match (100%)" }
      ],
      // Butir b: Penerimaan Dana vs Data Kepesertaan JKK/JKM (4 Pilar)
      jkkJkmPenerimaan: [
        { id: "REKON-JKK-TNI-09", pilar: "JKK TNI", namaDana: "JKK TNI", program: "JKK", tarif: "0,62%", matra: "TNI & ASN Kemhan", noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026", noNotaDinas: "ND-342/KPS/VII/2026", tglNotaDinas: "24 Juli 2026", tglTerimaDana: "28 Juli 2026", noSP2D: "SP2D-260728-004128", pesertaKepesertaan: 6370, gapokKepesertaan: 509600000000, nominalKepesertaan: 1223040000, nominalPenerimaan: 1223040000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKK-POLRI-09", pilar: "JKK Polri", namaDana: "JKK POLRI", program: "JKK", tarif: "0,62%", matra: "POLRI & PNS Polri", noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026", noNotaDinas: "ND-342/KPS/VII/2026", tglNotaDinas: "24 Juli 2026", tglTerimaDana: "28 Juli 2026", noSP2D: "SP2D-260728-004128", pesertaKepesertaan: 7958, gapokKepesertaan: 586200000000, nominalKepesertaan: 1406960000, nominalPenerimaan: 1406960000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKM-TNI-09", pilar: "JKM TNI", namaDana: "JKM TNI", program: "JKM", tarif: "0,81%", matra: "TNI & ASN Kemhan", noSuratTagihan: "003/ASABRI/TGH-JKM/VII/2026", noNotaDinas: "ND-343/KPS/VII/2026", tglNotaDinas: "24 Juli 2026", tglTerimaDana: "28 Juli 2026", noSP2D: "SP2D-260728-004129", pesertaKepesertaan: 6370, gapokKepesertaan: 509600000000, nominalKepesertaan: 1019200000, nominalPenerimaan: 1019200000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKM-POLRI-09", pilar: "JKM Polri", namaDana: "JKM POLRI", program: "JKM", tarif: "0,81%", matra: "POLRI & PNS Polri", noSuratTagihan: "003/ASABRI/TGH-JKM/VII/2026", noNotaDinas: "ND-343/KPS/VII/2026", tglNotaDinas: "24 Juli 2026", tglTerimaDana: "28 Juli 2026", noSP2D: "SP2D-260728-004129", pesertaKepesertaan: 7958, gapokKepesertaan: 586200000000, nominalKepesertaan: 1190760000, nominalPenerimaan: 1190760000, selisihNominal: 0, statusRekon: "Match (100%)" }
      ]
    },
    "2026-08": {
      monthKey: "2026-08",
      namaBulan: "Agustus 2026",
      status: "selesai",
      statusLabel: "Lunas & Selesai (BAR Sah)",
      badgeColor: "green",
      noSKP: "S-168/PB.2/2026",
      tglSKP: "14 Agustus 2026",
      tglTerimaDana: "18 Agustus 2026",
      noBAR: "BAR-08/REKON-PFK/VIII/2026",
      tglSelesai: "30 Agustus 2026",
      thtPensiunPenerimaan: [
        { id: "SKP-AUG-THT-TNI", danaType: "THT_TNI", namaDana: "THT TNI", pilar: "THT TNI", tarif: "3,25%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1140/KU.06.06/KMR.N/VIII/2026", tglSuratTagihan: "15 Agustus 2026", noSKP: "S-168/PB.2/2026", tglSKP: "14 Agustus 2026", tglTerimaDana: "18 Agustus 2026", bankTujuan: "Bank Mandiri", noSP2D: "SP2D-260818-007810", nominalDanaSKP: 28480000000, nominalDiterima: 28480000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-AUG-THT-POLRI", danaType: "THT_POLRI", namaDana: "THT POLRI", pilar: "THT POLRI", tarif: "3,25%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1141/KU.06.06/KMR.N/VIII/2026", tglSuratTagihan: "15 Agustus 2026", noSKP: "S-168/PB.2/2026", tglSKP: "14 Agustus 2026", tglTerimaDana: "18 Agustus 2026", bankTujuan: "Bank Mandiri", noSP2D: "SP2D-260818-007811", nominalDanaSKP: 14195000000, nominalDiterima: 14195000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-AUG-PEN-TNI", danaType: "PENSIUN_TNI", namaDana: "Pensiun TNI", pilar: "Pensiun TNI", tarif: "4,75%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1142/KU.06.06/KMR.N/VIII/2026", tglSuratTagihan: "15 Agustus 2026", noSKP: "S-168/PB.2/2026", tglSKP: "14 Agustus 2026", tglTerimaDana: "18 Agustus 2026", bankTujuan: "Bank BNI", noSP2D: "SP2D-260818-007812", nominalDanaSKP: 41620000000, nominalDiterima: 41620000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-AUG-PEN-POLRI", danaType: "PENSIUN_POLRI", namaDana: "Pensiun POLRI", pilar: "Pensiun POLRI", tarif: "4,75%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1143/KU.06.06/KMR.N/VIII/2026", tglSuratTagihan: "15 Agustus 2026", noSKP: "S-168/PB.2/2026", tglSKP: "14 Agustus 2026", tglTerimaDana: "18 Agustus 2026", bankTujuan: "Bank BNI", noSP2D: "SP2D-260818-007813", nominalDanaSKP: 20760000000, nominalDiterima: 20760000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" }
      ],
      thtPensiunKepesertaan: [
        { id: "REKAP-THT-TNI-08", danaType: "THT_TNI", pilar: "THT TNI", namaDana: "THT TNI", tarif: "3,25%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285350, nominalSistem: 28480000000, pesertaSKP: 285350, nominalSKP: 28480000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-THT-POLRI-08", danaType: "THT_POLRI", pilar: "THT POLRI", namaDana: "THT POLRI", tarif: "3,25%", matra: "POLRI & PNS Polri", pesertaSistem: 142100, nominalSistem: 14195000000, pesertaSKP: 142100, nominalSKP: 14195000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-PEN-TNI-08", danaType: "PENSIUN_TNI", pilar: "Pensiun TNI", namaDana: "Pensiun TNI", tarif: "4,75%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285350, nominalSistem: 41620000000, pesertaSKP: 285350, nominalSKP: 41620000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-PEN-POLRI-08", danaType: "PENSIUN_POLRI", pilar: "Pensiun POLRI", namaDana: "Pensiun POLRI", tarif: "4,75%", matra: "POLRI & PNS Polri", pesertaSistem: 142100, nominalSistem: 20760000000, pesertaSKP: 142100, nominalSKP: 20760000000, selisihNominal: 0, statusRekap: "Match (100%)" }
      ],
      jkkJkmPenerimaan: [
        { id: "REKON-JKK-TNI-08", pilar: "JKK TNI", namaDana: "JKK TNI", program: "JKK", tarif: "0,62%", matra: "TNI & ASN Kemhan", noSuratTagihan: "001/ASABRI/TGH-JKK/VI/2026", noNotaDinas: "ND-289/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003891", pesertaKepesertaan: 6360, gapokKepesertaan: 508800000000, nominalKepesertaan: 1221120000, nominalPenerimaan: 1221120000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKK-POLRI-08", pilar: "JKK Polri", namaDana: "JKK POLRI", program: "JKK", tarif: "0,62%", matra: "POLRI & PNS Polri", noSuratTagihan: "001/ASABRI/TGH-JKK/VI/2026", noNotaDinas: "ND-289/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003891", pesertaKepesertaan: 7930, gapokKepesertaan: 584100000000, nominalKepesertaan: 1401840000, nominalPenerimaan: 1401840000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKM-TNI-08", pilar: "JKM TNI", namaDana: "JKM TNI", program: "JKM", tarif: "0,81%", matra: "TNI & ASN Kemhan", noSuratTagihan: "001/ASABRI/TGH-JKM/VI/2026", noNotaDinas: "ND-290/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003892", pesertaKepesertaan: 6360, gapokKepesertaan: 508800000000, nominalKepesertaan: 1017600000, nominalPenerimaan: 1017600000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKM-POLRI-08", pilar: "JKM Polri", namaDana: "JKM POLRI", program: "JKM", tarif: "0,81%", matra: "POLRI & PNS Polri", noSuratTagihan: "001/ASABRI/TGH-JKM/VI/2026", noNotaDinas: "ND-290/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003892", pesertaKepesertaan: 7930, gapokKepesertaan: 584100000000, nominalKepesertaan: 1187400000, nominalPenerimaan: 1187400000, selisihNominal: 0, statusRekon: "Match (100%)" }
      ]
    },
    "2026-07": {
      monthKey: "2026-07",
      namaBulan: "Juli 2026",
      status: "selesai",
      statusLabel: "Lunas & Selesai (BAR Sah)",
      badgeColor: "green",
      noSKP: "S-155/PB.2/2026",
      tglSKP: "14 Juli 2026",
      tglTerimaDana: "18 Juli 2026",
      noBAR: "BAR-07/REKON-PFK/VII/2026",
      tglSelesai: "31 Juli 2026",
      thtPensiunPenerimaan: [
        { id: "SKP-JUL-THT-TNI", danaType: "THT_TNI", namaDana: "THT TNI", pilar: "THT TNI", tarif: "3,25%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1110/KU.06.06/KMR.N/VII/2026", tglSuratTagihan: "15 Juli 2026", noSKP: "S-155/PB.2/2026", tglSKP: "14 Juli 2026", tglTerimaDana: "18 Juli 2026", bankTujuan: "Bank Mandiri", noSP2D: "SP2D-260718-006520", nominalDanaSKP: 28450000000, nominalDiterima: 28450000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-JUL-THT-POLRI", danaType: "THT_POLRI", namaDana: "THT POLRI", pilar: "THT POLRI", tarif: "3,25%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1111/KU.06.06/KMR.N/VII/2026", tglSuratTagihan: "15 Juli 2026", noSKP: "S-155/PB.2/2026", tglSKP: "14 Juli 2026", tglTerimaDana: "18 Juli 2026", bankTujuan: "Bank Mandiri", noSP2D: "SP2D-260718-006521", nominalDanaSKP: 14180000000, nominalDiterima: 14180000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-JUL-PEN-TNI", danaType: "PENSIUN_TNI", namaDana: "Pensiun TNI", pilar: "Pensiun TNI", tarif: "4,75%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1112/KU.06.06/KMR.N/VII/2026", tglSuratTagihan: "15 Juli 2026", noSKP: "S-155/PB.2/2026", tglSKP: "14 Juli 2026", tglTerimaDana: "18 Juli 2026", bankTujuan: "Bank BNI", noSP2D: "SP2D-260718-006522", nominalDanaSKP: 41580000000, nominalDiterima: 41580000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: "SKP-JUL-PEN-POLRI", danaType: "PENSIUN_POLRI", namaDana: "Pensiun POLRI", pilar: "Pensiun POLRI", tarif: "4,75%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1113/KU.06.06/KMR.N/VII/2026", tglSuratTagihan: "15 Juli 2026", noSKP: "S-155/PB.2/2026", tglSKP: "14 Juli 2026", tglTerimaDana: "18 Juli 2026", bankTujuan: "Bank BNI", noSP2D: "SP2D-260718-006523", nominalDanaSKP: 20740000000, nominalDiterima: 20740000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" }
      ],
      thtPensiunKepesertaan: [
        { id: "REKAP-THT-TNI-07", danaType: "THT_TNI", pilar: "THT TNI", namaDana: "THT TNI", tarif: "3,25%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285100, nominalSistem: 28450000000, pesertaSKP: 285100, nominalSKP: 28450000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-THT-POLRI-07", danaType: "THT_POLRI", pilar: "THT POLRI", namaDana: "THT POLRI", tarif: "3,25%", matra: "POLRI & PNS Polri", pesertaSistem: 142000, nominalSistem: 14180000000, pesertaSKP: 142000, nominalSKP: 14180000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-PEN-TNI-07", danaType: "PENSIUN_TNI", pilar: "Pensiun TNI", namaDana: "Pensiun TNI", tarif: "4,75%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285100, nominalSistem: 41580000000, pesertaSKP: 285100, nominalSKP: 41580000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: "REKAP-PEN-POLRI-07", danaType: "PENSIUN_POLRI", pilar: "Pensiun POLRI", namaDana: "Pensiun POLRI", tarif: "4,75%", matra: "POLRI & PNS Polri", pesertaSistem: 142000, nominalSistem: 20740000000, pesertaSKP: 142000, nominalSKP: 20740000000, selisihNominal: 0, statusRekap: "Match (100%)" }
      ],
      jkkJkmPenerimaan: [
        { id: "REKON-JKK-TNI-07", pilar: "JKK TNI", namaDana: "JKK TNI", program: "JKK", tarif: "0,62%", matra: "TNI & ASN Kemhan", noSuratTagihan: "001/ASABRI/TGH-JKK/VI/2026", noNotaDinas: "ND-289/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003891", pesertaKepesertaan: 6360, gapokKepesertaan: 508800000000, nominalKepesertaan: 1221120000, nominalPenerimaan: 1221120000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKK-POLRI-07", pilar: "JKK Polri", namaDana: "JKK POLRI", program: "JKK", tarif: "0,62%", matra: "POLRI & PNS Polri", noSuratTagihan: "001/ASABRI/TGH-JKK/VI/2026", noNotaDinas: "ND-289/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003891", pesertaKepesertaan: 7930, gapokKepesertaan: 584100000000, nominalKepesertaan: 1401840000, nominalPenerimaan: 1401840000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKM-TNI-07", pilar: "JKM TNI", namaDana: "JKM TNI", program: "JKM", tarif: "0,81%", matra: "TNI & ASN Kemhan", noSuratTagihan: "001/ASABRI/TGH-JKM/VI/2026", noNotaDinas: "ND-290/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003892", pesertaKepesertaan: 6360, gapokKepesertaan: 508800000000, nominalKepesertaan: 1017600000, nominalPenerimaan: 1017600000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: "REKON-JKM-POLRI-07", pilar: "JKM Polri", namaDana: "JKM POLRI", program: "JKM", tarif: "0,81%", matra: "POLRI & PNS Polri", noSuratTagihan: "001/ASABRI/TGH-JKM/VI/2026", noNotaDinas: "ND-290/KPS/VI/2026", tglNotaDinas: "23 Juni 2026", tglTerimaDana: "27 Juni 2026", noSP2D: "SP2D-260627-003892", pesertaKepesertaan: 7930, gapokKepesertaan: 584100000000, nominalKepesertaan: 1187400000, nominalPenerimaan: 1187400000, selisihNominal: 0, statusRekon: "Match (100%)" }
      ]
    },
    "2026-10": {
      monthKey: "2026-10",
      namaBulan: "Oktober 2026",
      status: "draft",
      statusLabel: "Tagihan Terbit (Menunggu Pencairan SP2D)",
      badgeColor: "yellow",
      noSKP: "S-201/PB.2/2026",
      tglSKP: "14 Oktober 2026",
      tglTerimaDana: "Menunggu SP2D",
      noBAR: "Belum Diterbitkan",
      tglSelesai: "—",
      thtPensiunPenerimaan: [
        { id: "SKP-OCT-THT-TNI", danaType: "THT_TNI", namaDana: "THT TNI", pilar: "THT TNI", tarif: "3,25%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1205/KU.06.06/KMR.N/X/2026", tglSuratTagihan: "15 Oktober 2026", noSKP: "S-201/PB.2/2026", tglSKP: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", bankTujuan: "Bank Mandiri", noSP2D: "Proses Kemenkeu", nominalDanaSKP: 28590000000, nominalDiterima: 0, selisihNominal: 28590000000, statusRekon: "Menunggu SP2D" },
        { id: "SKP-OCT-THT-POLRI", danaType: "THT_POLRI", namaDana: "THT POLRI", pilar: "THT POLRI", tarif: "3,25%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1206/KU.06.06/KMR.N/X/2026", tglSuratTagihan: "15 Oktober 2026", noSKP: "S-201/PB.2/2026", tglSKP: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", bankTujuan: "Bank Mandiri", noSP2D: "Proses Kemenkeu", nominalDanaSKP: 14250000000, nominalDiterima: 0, selisihNominal: 14250000000, statusRekon: "Menunggu SP2D" },
        { id: "SKP-OCT-PEN-TNI", danaType: "PENSIUN_TNI", namaDana: "Pensiun TNI", pilar: "Pensiun TNI", tarif: "4,75%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: "1207/KU.06.06/KMR.N/X/2026", tglSuratTagihan: "15 Oktober 2026", noSKP: "S-201/PB.2/2026", tglSKP: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", bankTujuan: "Bank BNI", noSP2D: "Proses Kemenkeu", nominalDanaSKP: 41780000000, nominalDiterima: 0, selisihNominal: 41780000000, statusRekon: "Menunggu SP2D" },
        { id: "SKP-OCT-PEN-POLRI", danaType: "PENSIUN_POLRI", namaDana: "Pensiun POLRI", pilar: "Pensiun POLRI", tarif: "4,75%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: "1208/KU.06.06/KMR.N/X/2026", tglSuratTagihan: "15 Oktober 2026", noSKP: "S-201/PB.2/2026", tglSKP: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", bankTujuan: "Bank BNI", noSP2D: "Proses Kemenkeu", nominalDanaSKP: 20830000000, nominalDiterima: 0, selisihNominal: 20830000000, statusRekon: "Menunggu SP2D" }
      ],
      thtPensiunKepesertaan: [
        { id: "REKAP-THT-TNI-10", danaType: "THT_TNI", pilar: "THT TNI", namaDana: "THT TNI", tarif: "3,25%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285550, nominalSistem: 28590000000, pesertaSKP: 285550, nominalSKP: 28590000000, selisihNominal: 0, statusRekap: "Draft Siap Rekon" },
        { id: "REKAP-THT-POLRI-10", danaType: "THT_POLRI", pilar: "THT POLRI", namaDana: "THT POLRI", tarif: "3,25%", matra: "POLRI & PNS Polri", pesertaSistem: 142300, nominalSistem: 14250000000, pesertaSKP: 142300, nominalSKP: 14250000000, selisihNominal: 0, statusRekap: "Draft Siap Rekon" },
        { id: "REKAP-PEN-TNI-10", danaType: "PENSIUN_TNI", pilar: "Pensiun TNI", namaDana: "Pensiun TNI", tarif: "4,75%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285550, nominalSistem: 41780000000, pesertaSKP: 285550, nominalSKP: 41780000000, selisihNominal: 0, statusRekap: "Draft Siap Rekon" },
        { id: "REKAP-PEN-POLRI-10", danaType: "PENSIUN_POLRI", pilar: "Pensiun POLRI", namaDana: "Pensiun POLRI", tarif: "4,75%", matra: "POLRI & PNS Polri", pesertaSistem: 142300, nominalSistem: 20830000000, pesertaSKP: 142300, nominalSKP: 20830000000, selisihNominal: 0, statusRekap: "Draft Siap Rekon" }
      ],
      jkkJkmPenerimaan: [
        { id: "REKON-JKK-TNI-10", pilar: "JKK TNI", namaDana: "JKK TNI", program: "JKK", tarif: "0,62%", matra: "TNI & ASN Kemhan", noSuratTagihan: "004/ASABRI/TGH-JKK/X/2026", noNotaDinas: "ND-450/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", noSP2D: "Proses Kemenkeu", pesertaKepesertaan: 6380, gapokKepesertaan: 510400000000, nominalKepesertaan: 1224960000, nominalPenerimaan: 0, selisihNominal: 1224960000, statusRekon: "Menunggu SP2D" },
        { id: "REKON-JKK-POLRI-10", pilar: "JKK Polri", namaDana: "JKK POLRI", program: "JKK", tarif: "0,62%", matra: "POLRI & PNS Polri", noSuratTagihan: "004/ASABRI/TGH-JKK/X/2026", noNotaDinas: "ND-450/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", noSP2D: "Proses Kemenkeu", pesertaKepesertaan: 7980, gapokKepesertaan: 588000000000, nominalKepesertaan: 1411200000, nominalPenerimaan: 0, selisihNominal: 1411200000, statusRekon: "Menunggu SP2D" },
        { id: "REKON-JKM-TNI-10", pilar: "JKM TNI", namaDana: "JKM TNI", program: "JKM", tarif: "0,81%", matra: "TNI & ASN Kemhan", noSuratTagihan: "004/ASABRI/TGH-JKM/X/2026", noNotaDinas: "ND-451/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", noSP2D: "Proses Kemenkeu", pesertaKepesertaan: 6380, gapokKepesertaan: 510400000000, nominalKepesertaan: 1020800000, nominalPenerimaan: 0, selisihNominal: 1020800000, statusRekon: "Menunggu SP2D" },
        { id: "REKON-JKM-POLRI-10", pilar: "JKM Polri", namaDana: "JKM POLRI", program: "JKM", tarif: "0,81%", matra: "POLRI & PNS Polri", noSuratTagihan: "004/ASABRI/TGH-JKM/X/2026", noNotaDinas: "ND-451/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: "Menunggu SP2D", noSP2D: "Proses Kemenkeu", pesertaKepesertaan: 7980, gapokKepesertaan: 588000000000, nominalKepesertaan: 1176000000, nominalPenerimaan: 0, selisihNominal: 1176000000, statusRekon: "Menunggu SP2D" }
      ]
    }
  });

  // Flag apakah sedang menampilkan seluruh record dengan kolom tanggal
  const isAllDates = selectedMonth === "ALL";

  // Data bulan yang sedang aktif dipilih atau seluruh data kronologis
  const activeThtPensiunPenerimaan = isAllDates
    ? Object.values(monthlyStore).flatMap((m) =>
        (m.thtPensiunPenerimaan || []).map((item) => ({
          ...item,
          namaBulan: m.namaBulan,
          periodeBulan: m.namaBulan,
          tglSKP: item.tglSKP || m.tglSKP,
          tglTerimaDana: item.tglTerimaDana || m.tglTerimaDana
        }))
      )
    : (monthlyStore[selectedMonth]?.thtPensiunPenerimaan || []);

  const activeThtPensiunKepesertaan = isAllDates
    ? Object.values(monthlyStore).flatMap((m) =>
        (m.thtPensiunKepesertaan || []).map((item) => ({
          ...item,
          namaBulan: m.namaBulan,
          periodeBulan: m.namaBulan,
          tglSKP: m.tglSKP
        }))
      )
    : (monthlyStore[selectedMonth]?.thtPensiunKepesertaan || []);

  const activeJkkJkmPenerimaan = isAllDates
    ? Object.values(monthlyStore).flatMap((m) =>
        (m.jkkJkmPenerimaan || []).map((item) => ({
          ...item,
          namaBulan: m.namaBulan,
          periodeBulan: m.namaBulan
        }))
      )
    : (monthlyStore[selectedMonth]?.jkkJkmPenerimaan || []);

  // Filter 4 Program Terpisah
  const activeThtPenerimaan = activeThtPensiunPenerimaan.filter(
    (x) => x.danaType?.startsWith("THT") || x.pilar?.startsWith("THT")
  );
  const activeThtKepesertaan = activeThtPensiunKepesertaan.filter(
    (x) => x.danaType?.startsWith("THT") || x.pilar?.startsWith("THT")
  );

  const activePensiunPenerimaan = activeThtPensiunPenerimaan.filter(
    (x) => x.danaType?.startsWith("PENSIUN") || x.pilar?.startsWith("Pensiun")
  );
  const activePensiunKepesertaan = activeThtPensiunKepesertaan.filter(
    (x) => x.danaType?.startsWith("PENSIUN") || x.pilar?.startsWith("Pensiun")
  );

  const activeJkkPenerimaan = activeJkkJkmPenerimaan.filter(
    (x) => x.program === "JKK" || x.pilar?.startsWith("JKK") || x.namaDana?.startsWith("JKK")
  );
  const activeJkmPenerimaan = activeJkkJkmPenerimaan.filter(
    (x) => x.program === "JKM" || x.pilar?.startsWith("JKM") || x.namaDana?.startsWith("JKM")
  );

  // =========================================================================
  // DATA EVALUASI REKONSILIASI SETIAP 3 BULAN SEKALI (TRIWULANAN) JKK & JKM
  // Membandingkan Realisasi SP2D vs Data Kepesertaan untuk Kurang / Lebih Bayar
  // =========================================================================
  const getQuarterData = (prog, qKey) => {
    const isJKK = prog === "JKK";
    const tarif = isJKK ? "0,62%" : "0,81%";

    if (qKey === "TW1") {
      return {
        id: `TW1-${prog}`,
        title: "Triwulan I (Januari s.d. Maret 2026)",
        periodeBulan: ["Januari", "Februari", "Maret"],
        bulanKompensasi: "April 2026",
        status: "selesai",
        statusLabel: "Selesai Rekon • Surat Tagihan Kekurangan TW I Telah Diterbitkan",
        hasilRekon: "kurang_bayar",
        nominalSeharusnya: isJKK ? 59608456659 : 78858129341,
        nominalRealisasi: isJKK ? 58856369874 : 77875564350,
        selisih: isJKK ? -752086785 : -982564991, // Kurang Bayar
        tniSeharusnya: isJKK ? 30209050091 : 39467968673,
        tniRealisasi: isJKK ? 29474207196 : 38507931992,
        tniSelisih: isJKK ? -734842895 : -960036681,
        polriSeharusnya: isJKK ? 29398406568 : 39390160668,
        polriRealisasi: isJKK ? 29381162678 : 39367632358,
        polriSelisih: isJKK ? -17243890 : -22528310,
        noSuratTagihanSusulan: isJKK ? "S-1206/KU.06.05/KMR.N/V/2026" : "S-1207/KU.06.05/KMR.N/V/2026",
        tglSuratTagihanSusulan: "20 Mei 2026",
        tglCairSusulan: "22 Mei 2026",
        keterangan: `Hasil rekon TW I menunjukkan kekurangan bayar ${fmtB(isJKK ? 752086785 : 982564991)}. Surat Tagihan Kekurangan Bayar telah diterbitkan dan dana telah cair via SP2D tanggal 22 Mei 2026.`
      };
    }

    if (qKey === "TW2") {
      return {
        id: `TW2-${prog}`,
        title: "Triwulan II (April s.d. Juni 2026)",
        periodeBulan: ["April", "Mei", "Juni"],
        bulanKompensasi: "Juli & Agustus 2026",
        status: "selesai",
        statusLabel: "Selesai Rekon • TNI Kurang Bayar & POLRI Kompensasi Lebih Bayar",
        hasilRekon: "campuran",
        nominalSeharusnya: isJKK ? 60569201075 : 79185012500,
        nominalRealisasi: isJKK ? 60357695118 : 78908510250,
        selisih: isJKK ? -211505957 : -276502250,
        tniSeharusnya: isJKK ? 31068767331 : 40480000000,
        tniRealisasi: isJKK ? 30494547166 : 39729687600,
        tniSelisih: isJKK ? -574220165 : -750312400, // TNI Kurang Bayar -> Tagihan Susulan
        polriSeharusnya: isJKK ? 29500433744 : 38705012500,
        polriRealisasi: isJKK ? 29863147952 : 39178822650,
        polriSelisih: isJKK ? 362714208 : 473810150, // POLRI Lebih Bayar -> Kompensasi
        noSuratTagihanSusulan: isJKK ? "S-1869/KU.06.05/KMR.N/VIII/2026" : "S-1870/KU.06.05/KMR.N/VIII/2026",
        tglSuratTagihanSusulan: "19 Agustus 2026",
        tglCairSusulan: "27 Agustus 2026",
        keterangan: `TNI diterbitkan Surat Tagihan Kekurangan Bayar ${fmtB(isJKK ? 574220165 : 750312400)} (cair 27 Agu 2026). POLRI terdapat kelebihan bayar ${fmtB(isJKK ? 362714208 : 473810150)} yang telah dikompensasikan sebagai pengurang tagihan iuran bulan Juli & Agustus 2026.`
      };
    }

    if (qKey === "TW3") {
      // Triwulan III (Aktif Berjalan - Dinamis sesuai tw3Scenario)
      const baseSeharusnya = isJKK ? 61970503653 : 80560000000;
      let nominalRealisasi = baseSeharusnya;
      let selisih = 0;
      let tniSelisih = 0;
      let polriSelisih = 0;
      let hasilRekon = tw3Scenario;

      if (tw3Scenario === "kurang_bayar") {
        const diff = isJKK ? -150000000 : -125000000;
        nominalRealisasi = baseSeharusnya + diff;
        selisih = diff;
        tniSelisih = isJKK ? -120000000 : -100000000;
        polriSelisih = isJKK ? -30000000 : -25000000;
      } else if (tw3Scenario === "lebih_bayar") {
        const diff = isJKK ? 100000000 : 80000000;
        nominalRealisasi = baseSeharusnya + diff;
        selisih = diff;
        tniSelisih = isJKK ? 60000000 : 50000000;
        polriSelisih = isJKK ? 40000000 : 30000000;
      }

      const tniSeharusnya = isJKK ? 32338630283 : 41360000000;
      const polriSeharusnya = isJKK ? 29631873370 : 39200000000;

      return {
        id: `TW3-${prog}`,
        title: "Triwulan III (Juli s.d. September 2026)",
        periodeBulan: ["Juli", "Agustus", "September"],
        bulanKompensasi: "Oktober 2026",
        status: "aktif",
        statusLabel: "Evaluasi Triwulanan Berjalan (Siap Rekonsiliasi)",
        hasilRekon,
        nominalSeharusnya: baseSeharusnya,
        nominalRealisasi,
        selisih,
        tniSeharusnya,
        tniRealisasi: tniSeharusnya + tniSelisih,
        tniSelisih,
        polriSeharusnya,
        polriRealisasi: polriSeharusnya + polriSelisih,
        polriSelisih,
        noSuratTagihanSusulan: isJKK ? "S-2105/KU.06.05/KMR.N/X/2026" : "S-2106/KU.06.05/KMR.N/X/2026",
        tglSuratTagihanSusulan: "14 Oktober 2026",
        tagihanNormalBulanBerikutnya: isJKK ? 1224960000 : 1020800000,
        keterangan:
          selisih < 0
            ? `Hasil rekonsiliasi menunjukkan akumulasi kas 3 bulan (Jul-Sep) kurang bayar ${fmtB(Math.abs(selisih))}. Sistem menyiapkan Surat Tagihan Kekurangan Bayar untuk diterbitkan ke Kemenkeu RI.`
            : selisih > 0
            ? `Hasil rekonsiliasi menunjukkan terdapat kelebihan penerimaan kas sebesar ${fmtB(selisih)}. Selisih lebih ini diperlakukan sebagai kompensasi pengurangan tagihan iuran bulan Oktober 2026.`
            : "Akumulasi penerimaan kas 3 bulan 100% cocok dengan data kepesertaan (Nihil)."
      };
    }

    // TW4
    return {
      id: `TW4-${prog}`,
      title: "Triwulan IV (Oktober s.d. Desember 2026)",
      periodeBulan: ["Oktober", "November", "Desember"],
      bulanKompensasi: "Januari 2027",
      status: "draft",
      statusLabel: "Proyeksi Akhir Tahun Anggaran 2026",
      hasilRekon: "proyeksi",
      nominalSeharusnya: isJKK ? 62450000000 : 81200000000,
      nominalRealisasi: isJKK ? 11143600360 : 14500000000,
      selisih: 0,
      tniSeharusnya: isJKK ? 32600000000 : 41800000000,
      tniRealisasi: isJKK ? 11143600360 : 14500000000,
      tniSelisih: 0,
      polriSeharusnya: isJKK ? 29850000000 : 39400000000,
      polriRealisasi: 0,
      polriSelisih: 0,
      keterangan: "Menunggu penyelesaian realisasi kas penerimaan November dan Desember 2026."
    };
  };

  // Data ringkasan periode aktif
  const currentMonthData = isAllDates
    ? {
        monthKey: "ALL",
        namaBulan: "Semua Tanggal (TA 2026)",
        status: "selesai",
        statusLabel: "Menampilkan Seluruh Record Kronologis 2026",
        badgeColor: "blue",
        noSKP: "Konsolidasi TA 2026",
        tglSKP: "Jan - Okt 2026",
        tglTerimaDana: "Sepanjang TA 2026",
        noBAR: "BAR-KONSOLIDASI/2026",
        tglSelesai: "18 September 2026",
        thtPensiunPenerimaan: activeThtPensiunPenerimaan,
        thtPensiunKepesertaan: activeThtPensiunKepesertaan,
        jkkJkmPenerimaan: activeJkkJkmPenerimaan
      }
    : (monthlyStore[selectedMonth] || {
        monthKey: selectedMonth,
        namaBulan: MONTHS_LIST.find((m) => m.key === selectedMonth)?.label + " " + selectedYear,
        status: "belum_ada",
        statusLabel: "Belum Ada Data Rekonsiliasi",
        thtPensiunPenerimaan: [],
        thtPensiunKepesertaan: [],
        jkkJkmPenerimaan: []
      });

  // Handler Menyimpan Bulan Baru / Input Data Periode Baru
  const handleSaveNewMonthRecord = (e) => {
    e.preventDefault();
    const bKey = formNewMonth.bulan;
    const mInfo = MONTHS_LIST.find((m) => m.key === bKey);
    const mName = mInfo ? `${mInfo.label} ${selectedYear}` : bKey;

    const newRecord = {
      monthKey: bKey,
      namaBulan: mName,
      status: "aktif",
      statusLabel: "Sedang Berjalan (Data Baru Direkam)",
      badgeColor: "blue",
      noSKP: formNewMonth.noSKP,
      tglSKP: formNewMonth.tglSKP,
      tglTerimaDana: formNewMonth.tglTerimaDana,
      noBAR: `BAR-${mInfo?.no || "10"}/REKON-PFK/X/2026`,
      tglSelesai: formNewMonth.tglTerimaDana,
      thtPensiunPenerimaan: [
        { id: `SKP-${bKey}-THT-TNI`, danaType: "THT_TNI", namaDana: "THT TNI", pilar: "THT TNI", tarif: "3,25%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: formNewMonth.noSuratTagihan, tglSuratTagihan: formNewMonth.tglSuratTagihan, noSKP: formNewMonth.noSKP, tglSKP: formNewMonth.tglSKP, tglTerimaDana: formNewMonth.tglTerimaDana, bankTujuan: "Bank Mandiri", noSP2D: formNewMonth.noSP2D, nominalDanaSKP: 28590000000, nominalDiterima: 28590000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: `SKP-${bKey}-THT-POLRI`, danaType: "THT_POLRI", namaDana: "THT POLRI", pilar: "THT POLRI", tarif: "3,25%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: formNewMonth.noSuratTagihan, tglSuratTagihan: formNewMonth.tglSuratTagihan, noSKP: formNewMonth.noSKP, tglSKP: formNewMonth.tglSKP, tglTerimaDana: formNewMonth.tglTerimaDana, bankTujuan: "Bank Mandiri", noSP2D: formNewMonth.noSP2D, nominalDanaSKP: 14250000000, nominalDiterima: 14250000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: `SKP-${bKey}-PEN-TNI`, danaType: "PENSIUN_TNI", namaDana: "Pensiun TNI", pilar: "Pensiun TNI", tarif: "4,75%", matraUtama: "TNI & ASN Kemhan", noSuratTagihan: formNewMonth.noSuratTagihan, tglSuratTagihan: formNewMonth.tglSuratTagihan, noSKP: formNewMonth.noSKP, tglSKP: formNewMonth.tglSKP, tglTerimaDana: formNewMonth.tglTerimaDana, bankTujuan: "Bank BNI", noSP2D: formNewMonth.noSP2D, nominalDanaSKP: 41780000000, nominalDiterima: 41780000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" },
        { id: `SKP-${bKey}-PEN-POLRI`, danaType: "PENSIUN_POLRI", namaDana: "Pensiun POLRI", pilar: "Pensiun POLRI", tarif: "4,75%", matraUtama: "POLRI & PNS Polri", noSuratTagihan: formNewMonth.noSuratTagihan, tglSuratTagihan: formNewMonth.tglSuratTagihan, noSKP: formNewMonth.noSKP, tglSKP: formNewMonth.tglSKP, tglTerimaDana: formNewMonth.tglTerimaDana, bankTujuan: "Bank BNI", noSP2D: formNewMonth.noSP2D, nominalDanaSKP: 20830000000, nominalDiterima: 20830000000, selisihNominal: 0, statusRekon: "Match (Lunas 100%)" }
      ],
      thtPensiunKepesertaan: [
        { id: `REKAP-${bKey}-THT-TNI`, danaType: "THT_TNI", pilar: "THT TNI", namaDana: "THT TNI", tarif: "3,25%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285550, nominalSistem: 28590000000, pesertaSKP: 285550, nominalSKP: 28590000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: `REKAP-${bKey}-THT-POLRI`, danaType: "THT_POLRI", pilar: "THT POLRI", namaDana: "THT POLRI", tarif: "3,25%", matra: "POLRI & PNS Polri", pesertaSistem: 142300, nominalSistem: 14250000000, pesertaSKP: 142300, nominalSKP: 14250000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: `REKAP-${bKey}-PEN-TNI`, danaType: "PENSIUN_TNI", pilar: "Pensiun TNI", namaDana: "Pensiun TNI", tarif: "4,75%", matra: "TNI AD, AL, AU, PNS & PPPK Kemhan", pesertaSistem: 285550, nominalSistem: 41780000000, pesertaSKP: 285550, nominalSKP: 41780000000, selisihNominal: 0, statusRekap: "Match (100%)" },
        { id: `REKAP-${bKey}-PEN-POLRI`, danaType: "PENSIUN_POLRI", pilar: "Pensiun POLRI", namaDana: "Pensiun POLRI", tarif: "4,75%", matra: "POLRI & PNS Polri", pesertaSistem: 142300, nominalSistem: 20830000000, pesertaSKP: 142300, nominalSKP: 20830000000, selisihNominal: 0, statusRekap: "Match (100%)" }
      ],
      jkkJkmPenerimaan: [
        { id: `REKON-${bKey}-JKK-TNI`, pilar: "JKK TNI", namaDana: "JKK TNI", program: "JKK", tarif: "0,62%", matra: "TNI & ASN Kemhan", noSuratTagihan: "004/ASABRI/TGH-JKK/X/2026", noNotaDinas: "ND-450/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: formNewMonth.tglTerimaDana, noSP2D: formNewMonth.noSP2D, pesertaKepesertaan: 6380, gapokKepesertaan: 510400000000, nominalKepesertaan: 3164480000, nominalPenerimaan: 3164480000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: `REKON-${bKey}-JKK-POLRI`, pilar: "JKK Polri", namaDana: "JKK POLRI", program: "JKK", tarif: "0,62%", matra: "POLRI & PNS Polri", noSuratTagihan: "004/ASABRI/TGH-JKK/X/2026", noNotaDinas: "ND-450/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: formNewMonth.tglTerimaDana, noSP2D: formNewMonth.noSP2D, pesertaKepesertaan: 7980, gapokKepesertaan: 588000000000, nominalKepesertaan: 3645600000, nominalPenerimaan: 3645600000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: `REKON-${bKey}-JKM-TNI`, pilar: "JKM TNI", namaDana: "JKM TNI", program: "JKM", tarif: "0,81%", matra: "TNI & ASN Kemhan", noSuratTagihan: "004/ASABRI/TGH-JKM/X/2026", noNotaDinas: "ND-451/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: formNewMonth.tglTerimaDana, noSP2D: formNewMonth.noSP2D, pesertaKepesertaan: 6380, gapokKepesertaan: 510400000000, nominalKepesertaan: 4134240000, nominalPenerimaan: 4134240000, selisihNominal: 0, statusRekon: "Match (100%)" },
        { id: `REKON-${bKey}-JKM-POLRI`, pilar: "JKM Polri", namaDana: "JKM POLRI", program: "JKM", tarif: "0,81%", matra: "POLRI & PNS Polri", noSuratTagihan: "004/ASABRI/TGH-JKM/X/2026", noNotaDinas: "ND-451/KPS/X/2026", tglNotaDinas: "14 Oktober 2026", tglTerimaDana: formNewMonth.tglTerimaDana, noSP2D: formNewMonth.noSP2D, pesertaKepesertaan: 7980, gapokKepesertaan: 588000000000, nominalKepesertaan: 4762800000, nominalPenerimaan: 4762800000, selisihNominal: 0, statusRekon: "Match (100%)" }
      ]
    };

    setMonthlyStore((prev) => ({
      ...prev,
      [bKey]: newRecord
    }));

    setSelectedMonth(bKey);
    setShowAddMonthModal(false);
    setNotice(`Data rekonsiliasi periode ${mName} berhasil direkam dan otomatis tersimpan ke sistem!`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Handler Selesaikan Rekonsiliasi Bulan Ini & Terbitkan BAR
  const handleFinalizeMonth = () => {
    const mName = currentMonthData.namaBulan;
    const barNo = currentMonthData.noBAR || `BAR-${selectedMonth.split("-")[1]}/REKON-PFK/IX/2026`;

    setMonthlyStore((prev) => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        status: "selesai",
        statusLabel: "Lunas & Selesai (BAR Sah)",
        badgeColor: "green",
        noBAR: barNo
      }
    }));

    setConfirmCompleteItem(null);
    setNotice(`Proses rekonsiliasi ${mName} telah diselesaikan 100%! Berita Acara Rekonsiliasi (${barNo}) telah terbit dan tersimpan sah.`);
    setTimeout(() => setNotice(null), 6000);
  };

  // Helper Preview Surat Tagihan Kemenkeu
  const openSuratTagihanPreview = (item) => {
    if (activeProgram === "THT" || activeProgram === "PENSIUN") {
      const isTHT = item.danaType?.startsWith("THT") || item.pilar?.startsWith("THT") || activeProgram === "THT";
      const isPolri = item.danaType?.includes("POLRI") || item.pilar?.includes("POLRI") || item.matra?.includes("POLRI");
      const namaDana = item.namaDana || item.pilar || (isTHT ? (isPolri ? "THT POLRI" : "THT TNI") : (isPolri ? "Pensiun POLRI" : "Pensiun TNI"));

      setPreview({
        title: `Surat Tagihan Iuran ${namaDana} — ${item.noSuratTagihan || item.noSurat}`,
        subtitle: `Format Resmi Kemenkeu RI (3 Halaman) • Satker (440780)`,
        type: "surat_kemenkeu",
        fileName: `Surat_Tagihan_${namaDana.replace(/[^a-zA-Z0-9]/g, "_")}_${(item.noSuratTagihan || item.noSurat).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          program: namaDana,
          noSurat: item.noSuratTagihan || item.noSurat,
          tanggalSurat: item.tglSuratTagihan || "15 September 2026",
          tglCutoff: "10 September 2026",
          noKEP: item.noSKP || currentMonthData.noSKP,
          tglKEP: item.tglSKP || currentMonthData.tglSKP,
          tahunAnggaran: selectedYear,
          nominalNum: item.nominalDanaSKP || item.nominalSKP || (isTHT ? 28540000000 : 41710000000),
          nominalLalu: isTHT ? 1059518554039 : 812490210000,
          noBukti: isTHT ? (isPolri ? "22/PFK.THT-POLRI/IX/2026-Keu" : "21/PFK.THT-AS/IX/2026-Keu") : (isPolri ? "23/PFK.PEN-POLRI/IX/2026-Keu" : "24/PFK.PEN-TNI/IX/2026-Keu"),
          namaRekening: isTHT ? "THT Umum ASABRI" : "Pensiun ASABRI",
          noRekening: isTHT ? "0261-01-000004-30-9" : "0261-01-000005-30-5",
          namaBank: isTHT ? "Bank Mandiri KCP Jakarta Penampungan" : "Bank BNI KCP Jakarta Penampungan",
          namaDirektur: "HELMI I. SATRIYONO",
          jabatanDirektur: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaPPK: "Nazif Azhari",
          isPFKKemenkeu: true,
          satkerList: item.satkerList || SATKER_THT_PENSIUN_ALL
        }
      });
    } else {
      const prog = item.pilar || item.program || activeProgram;
      setPreview({
        title: `Surat Tagihan Iuran ${prog} — ${item.noSuratTagihan}`,
        subtitle: `Kemenkeu RI / KPPN Khusus Jakarta II • Periode ${currentMonthData.namaBulan}`,
        type: "surat",
        fileName: `Surat_Tagihan_${prog.replace(/[^a-zA-Z0-9]/g, "_")}_${item.noSuratTagihan.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          noSurat: item.noSuratTagihan,
          tanggal: item.tglSuratTagihan || currentMonthData.tglSKP,
          items: [
            {
              jenis: `Iuran ${prog} (${item.tarif || (activeProgram === "JKK" ? "0,62%" : "0,81%")})`,
              peserta: `${fmtNum(item.pesertaKepesertaan || item.peserta || 14328)} Jiwa`,
              nominal: fmtB(item.nominalKepesertaan || item.nominalPenerimaan || item.nominalTagihan)
            }
          ],
          totalNominal: fmtB(item.nominalKepesertaan || item.nominalPenerimaan || item.nominalTagihan)
        }
      });
    }
  };

  // Helper Preview Berita Acara Rekonsiliasi (BAR)
  const openBARPreview = (item) => {
    const progTitle = item?.pilar || item?.namaDana || (activeProgram === "THT" ? "THT (3,25%)" : activeProgram === "PENSIUN" ? "Pensiun (4,75%)" : activeProgram === "JKK" ? "JKK (0,62%)" : "JKM (0,81%)");
    const dokDasar = item?.noSKP || currentMonthData.noSKP
      ? `Surat SKP-PFK Kemenkeu No. ${item?.noSKP || currentMonthData.noSKP} (Tgl: ${item?.tglSKP || currentMonthData.tglSKP})`
      : `Nota Dinas Kepesertaan No. ${item?.noNotaDinas || "ND-342/KPS/2026"}`;

    const progNominal =
      activeProgram === "THT"
        ? (activeThtPenerimaan || []).reduce((a, b) => a + (b.nominalDiterima || 0), 0)
        : activeProgram === "PENSIUN"
        ? (activePensiunPenerimaan || []).reduce((a, b) => a + (b.nominalDiterima || 0), 0)
        : activeProgram === "JKK"
        ? (activeJkkPenerimaan || []).reduce((a, b) => a + (b.nominalPenerimaan || 0), 0)
        : (activeJkmPenerimaan || []).reduce((a, b) => a + (b.nominalPenerimaan || 0), 0);

    setPreview({
      title: `Berita Acara Rekonsiliasi (BAR) — ${currentMonthData.noBAR || "BAR-09/REKON/IX/2026"}`,
      subtitle: `Penetapan Bersama PT ASABRI (Persero) & Ditjen Perbendaharaan Kemenkeu RI`,
      type: "bar",
      fileName: `BAR_${activeProgram}_${(currentMonthData.noBAR || "BAR-09").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
      content: {
        noBAR: currentMonthData.noBAR || "BAR-09/REKON/IX/2026",
        hariTanggal: `Selasa, ${currentMonthData.tglSelesai || "18 September 2026"}`,
        programJudul: `REKONSILIASI IURAN ${progTitle.toUpperCase()}`,
        periode: currentMonthData.namaBulan,
        noSuratTagihan: item?.noSuratTagihan || "1190-1193/KU.06.06/KMR.N/2026",
        dokumenDasar: dokDasar,
        noSP2D: item?.noSP2D || currentMonthData.noSP2D,
        tglSP2D: item?.tglTerimaDana || currentMonthData.tglTerimaDana,
        bankTujuan: item?.bankTujuan || "Bank Mandiri & BNI Giro Penampungan Kemenkeu",
        nominal: fmtB(progNominal)
      }
    });
  };

  // Helper Terbitkan Surat Tagihan Kekurangan Bayar (Untuk JKK & JKM Rekon Triwulanan)
  const handleOpenSuratKekuranganBayar = (program, twKey, qData) => {
    const isJKK = program === "JKK";
    const tarif = isJKK ? "0,62%" : "0,81%";
    const noSurat = qData.noSuratTagihanSusulan || (isJKK ? "S-2105/KU.06.05/KMR.N/X/2026" : "S-2106/KU.06.05/KMR.N/X/2026");
    const tglSurat = qData.tglSuratTagihanSusulan || "14 Oktober 2026";
    const nominalKurang = Math.abs(qData.selisih);

    setPreview({
      title: `Surat Tagihan Kekurangan Bayar Iuran ${program} — ${noSurat}`,
      subtitle: `Format Baku Kemenkeu RI (3 Halaman) • Rekonsiliasi ${qData.title}`,
      type: "surat_kemenkeu",
      fileName: `Surat_Tagihan_Kekurangan_${program}_${twKey}.pdf`,
      content: {
        program: `Kekurangan Iuran ${program}`,
        halProgram: `Kekurangan ${program} TA 2026`,
        namaProgramFull: `Kekurangan Pembayaran Iuran ${program} (${tarif})`,
        noSurat: noSurat,
        tanggalSurat: tglSurat,
        tglCutoff: "30 September 2026",
        noKEP: `BAR-${twKey}/REKON-${program}/X/2026`,
        tglKEP: "05 Oktober 2026",
        tahunAnggaran: selectedYear,
        nominalNum: nominalKurang,
        nominalLalu: qData.nominalRealisasi,
        noBukti: isJKK ? "31/JKK-SUSULAN/TW3/2026-Keu" : "32/JKM-SUSULAN/TW3/2026-Keu",
        namaRekening: isJKK ? "Giro Penampungan Iuran JKK ASABRI" : "Giro Penampungan Iuran JKM ASABRI",
        noRekening: isJKK ? "0261-01-000008-30-2" : "0261-01-000009-30-6",
        namaBank: "Bank Mandiri KCP Jakarta Penampungan",
        namaDirektur: "HELMI I. SATRIYONO",
        jabatanDirektur: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
        namaPPK: "Nazif Azhari",
        isPFKKemenkeu: false,
        perihal: `Permohonan Penyaluran Kekurangan Pembayaran Iuran ${program} (${tarif}) Hasil Rekonsiliasi ${qData.title}`
      },
      confirmAction: {
        label: `Konfirmasi & Terbitkan Surat Tagihan Kekurangan Bayar ${program}`,
        icon: <CheckCircle2 size={15} />,
        variant: "success",
        onClick: () => {
          setIssuedShortfallBills((prev) => ({ ...prev, [`${program}_${twKey}`]: true }));
          setPreview(null);
          setNotice(`Sukses! Surat Tagihan Kekurangan Bayar Iuran ${program} (${noSurat}) sebesar ${fmtB(nominalKurang)} berhasil diterbitkan dan masuk ke antrean pencairan Kemenkeu RI!`);
          setTimeout(() => setNotice(null), 7000);
        }
      }
    });
  };

  // Helper Terapkan Kompensasi Pengurangan Tagihan Bulan Setelah Rekon
  const handleApplyCompensation = (program, twKey, qData) => {
    const surplus = Math.abs(qData.selisih);
    const bln = qData.bulanKompensasi || "Oktober 2026";
    const tagihanNormal = qData.tagihanNormalBulanBerikutnya || (program === "JKK" ? 1224960000 : 1020800000);
    const netTagihan = Math.max(0, tagihanNormal - surplus);

    setAppliedCompensations((prev) => ({ ...prev, [`${program}_${twKey}`]: true }));
    setNotice(`Sukses! Saldo kompensasi lebih bayar ${program} sebesar ${fmtB(surplus)} berhasil diterapkan! Tagihan ${bln} otomatis dikurangi menjadi ${fmtB(netTagihan)} net.`);
    setTimeout(() => setNotice(null), 7000);
  };

  // Helper Preview Berita Acara Kompensasi Lebih Bayar
  const handlePreviewBAKompensasi = (program, twKey, qData) => {
    const surplus = Math.abs(qData.selisih);
    const bln = qData.bulanKompensasi || "Oktober 2026";
    const tagihanNormal = qData.tagihanNormalBulanBerikutnya || (program === "JKK" ? 1224960000 : 1020800000);
    const netTagihan = Math.max(0, tagihanNormal - surplus);

    setPreview({
      title: `Berita Acara Kompensasi Lebih Bayar — BA-KOMP-03/${program}/X/2026`,
      subtitle: `Penetapan Kompensasi Lebih Bayar Iuran ${program} ${qData.title}`,
      type: "bar",
      fileName: `BA_Kompensasi_Lebih_Bayar_${program}_${twKey}.pdf`,
      content: {
        noBAR: `BA-KOMP-03/${program}/X/2026`,
        hariTanggal: `Rabu, 14 Oktober 2026`,
        programJudul: `KOMPENSASI LEBIH BAYAR IURAN ${program} (${qData.title.toUpperCase()})`,
        periode: qData.title,
        noSuratTagihan: `Kompensasi Tagihan ${bln}`,
        dokumenDasar: `Rekonsiliasi Triwulanan Iuran ${program} TA 2026`,
        noSP2D: `Surplus Kas ${qData.title}`,
        tglSP2D: `Realisasi Kas s.d September 2026`,
        bankTujuan: "Bank Mandiri Rek. Giro Penampungan Iuran Kemenkeu",
        nominal: fmtB(surplus)
      }
    });
  };

  // Helper Preview Surat Tagihan Bulan Berikutnya Setelah Kompensasi
  const handlePreviewTagihanSetelahKompensasi = (program, twKey, qData) => {
    const surplus = Math.abs(qData.selisih);
    const bln = qData.bulanKompensasi || "Oktober 2026";
    const tagihanNormal = qData.tagihanNormalBulanBerikutnya || (program === "JKK" ? 1224960000 : 1020800000);
    const netTagihan = Math.max(0, tagihanNormal - surplus);
    const noSurat = `S-2236/KU.06.05/KEU.M/X/2026`;

    setPreview({
      title: `Surat Tagihan Iuran ${program} Bulan ${bln} (Setelah Kompensasi) — ${noSurat}`,
      subtitle: `Format Resmi Kemenkeu RI • Memperhitungkan Potongan Kompensasi Lebih Bayar ${qData.title}`,
      type: "surat",
      fileName: `Surat_Tagihan_${program}_${bln.replace(/\s+/g, "_")}_Net.pdf`,
      content: {
        noSurat,
        tanggal: "06 Oktober 2026",
        items: [
          {
            jenis: `Iuran ${program} Normal Bulan ${bln}`,
            peserta: "14.360 Jiwa",
            nominal: fmtB(tagihanNormal)
          },
          {
            jenis: `Potongan Kompensasi Lebih Bayar (${qData.title})`,
            peserta: "Penyesuaian TW",
            nominal: `- ${fmtB(surplus)}`
          }
        ],
        totalNominal: fmtB(netTagihan)
      }
    });
  };

  // State Sub-Program untuk Tampilan Rekap Format Resmi Excel ASABRI
  const [selectedOfficialProgram, setSelectedOfficialProgram] = useState("ALL"); // "ALL" | "DAPEN" | "THT" | "JKK" | "JKM"

  // Helper Ekspor Format Resmi Excel ASABRI (Sesuai D:/Kerjaan/ASABRI/Penerimaan Dana Iuran.xlsx)
  const handleExportFormatResmi = (progKey = selectedOfficialProgram) => {
    let title = "DAFTAR REALISASI PENERIMAAN IURAN TAHUN 2026 - PT ASABRI (PERSERO)";
    let subtitle = "Rekapitulasi Penerimaan Iuran Sesuai Dokumen Sumber Resmi Kementerian Keuangan & Kepesertaan";
    let fileName = "Penerimaan_Dana_Iuran_ASABRI_TA2026.xlsx";
    let cols = [];
    let rows = [];
    let totalRow = [];

    if (progKey === "DAPEN") {
      title = "PENERIMAAN PREMI DAPEN (4,75%) TAHUN 2026 - PT ASABRI (Persero)";
      subtitle = "Berdasarkan SKP-PFK Kemenkeu RI & Surat Tagihan ASABRI (2 Termin PFK per Bulan)";
      fileName = "Penerimaan_Premi_DAPEN_4.75%_TA2026.xlsx";
      cols = ["Bulan", "No SKP", "Tanggal SKP", "Surat Tagihan", "Tanggal Surat Tagihan", "Tanggal Surat Tagihan Diterima", "Tanggal Pencairan Dana", "TNI (Rp)", "POLRI (Rp)", "TOTAL (Rp)"];
      rows = PENERIMAAN_DANA_EXCEL_DATA.dapen.map(r => [
        r.bulan,
        r.noSKP,
        r.tglSKP,
        r.suratTagihan,
        r.tglSuratTagihan,
        r.tglDiterima,
        r.tglCair,
        fmtB(r.tni),
        fmtB(r.polri),
        fmtB(r.total)
      ]);
      const totTNI = PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.tni || 0), 0);
      const totPolri = PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.polri || 0), 0);
      const totAll = PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.total || 0), 0);
      totalRow = ["TOTAL REALISASI YTD (Jan s.d Okt)", "—", "—", "40 Surat Tagihan", "—", "—", "SP2D Cair", fmtB(totTNI), fmtB(totPolri), fmtB(totAll)];
    } else if (progKey === "THT") {
      title = "PENERIMAAN PREMI THT (3,25%) TAHUN 2026 - PT ASABRI (Persero)";
      subtitle = "Berdasarkan SKP-PFK Kemenkeu RI & Surat Tagihan ASABRI (2 Termin PFK per Bulan)";
      fileName = "Penerimaan_Premi_THT_3.25%_TA2026.xlsx";
      cols = ["Bulan", "No SKP", "Tanggal SKP", "Surat Tagihan", "Tanggal Surat Tagihan", "Tanggal Surat Tagihan Diterima", "Tanggal Pencairan Dana", "TNI (Rp)", "POLRI (Rp)", "TOTAL (Rp)"];
      rows = PENERIMAAN_DANA_EXCEL_DATA.tht.map(r => [
        r.bulan,
        r.noSKP,
        r.tglSKP,
        r.suratTagihan,
        r.tglSuratTagihan,
        r.tglDiterima,
        r.tglCair,
        fmtB(r.tni),
        fmtB(r.polri),
        fmtB(r.total)
      ]);
      const totTNI = PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.tni || 0), 0);
      const totPolri = PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.polri || 0), 0);
      const totAll = PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.total || 0), 0);
      totalRow = ["TOTAL REALISASI YTD (Jan s.d Okt)", "—", "—", "20 Surat Tagihan", "—", "—", "SP2D Cair", fmtB(totTNI), fmtB(totPolri), fmtB(totAll)];
    } else if (progKey === "JKK") {
      title = "DAFTAR REALISASI PENERIMAAN IURAN JKK TAHUN 2026 - PT ASABRI (Persero)";
      subtitle = "Berdasarkan ND Kepesertaan & Surat Tagihan Kemenkeu (Termasuk Penyesuaian Triwulan)";
      fileName = "Realisasi_Penerimaan_JKK_TA2026.xlsx";
      cols = ["No", "Bulan", "ND Kepesertaan", "Tgl ND", "Surat Tagihan", "Tanggal Surat Tagihan", "Tanggal Surat Tagihan Diterima", "Tanggal Pencairan Dana", "TNI (Rp)", "POLRI (Rp)", "TOTAL (Rp)"];
      rows = PENERIMAAN_DANA_EXCEL_DATA.jkk.map(r => [
        r.no || "—",
        r.bulan,
        r.ndKepesertaan,
        r.tglND,
        r.suratTagihan,
        r.tglSuratTagihan,
        r.tglDiterima,
        r.tglCair,
        fmtB(r.tni),
        fmtB(r.polri),
        fmtB(r.total)
      ]);
      const totTNI = PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.tni || 0), 0);
      const totPolri = PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.polri || 0), 0);
      const totAll = PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.total || 0), 0);
      totalRow = ["—", "Jml Realisasi Jan s.d Des 2026", "—", "—", "—", "—", "—", "SP2D Cair", fmtB(totTNI), fmtB(totPolri), fmtB(totAll)];
    } else if (progKey === "JKM") {
      title = "DAFTAR REALISASI PENERIMAAN IURAN JKM TAHUN 2026 - PT ASABRI (Persero)";
      subtitle = "Berdasarkan ND Kepesertaan & Surat Tagihan Kemenkeu (Termasuk Penyesuaian Triwulan)";
      fileName = "Realisasi_Penerimaan_JKM_TA2026.xlsx";
      cols = ["No", "Bulan", "ND Kepesertaan", "Tgl ND", "Surat Tagihan", "Tanggal Surat Tagihan", "Tanggal Surat Tagihan Diterima", "Tanggal Pencairan Dana", "TNI (Rp)", "POLRI (Rp)", "TOTAL (Rp)"];
      rows = PENERIMAAN_DANA_EXCEL_DATA.jkm.map(r => [
        r.no || "—",
        r.bulan,
        r.ndKepesertaan,
        r.tglND,
        r.suratTagihan,
        r.tglSuratTagihan,
        r.tglDiterima,
        r.tglCair,
        fmtB(r.tni),
        fmtB(r.polri),
        fmtB(r.total)
      ]);
      const totTNI = PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.tni || 0), 0);
      const totPolri = PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.polri || 0), 0);
      const totAll = PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.total || 0), 0);
      totalRow = ["—", "Jml Realisasi Jan s.d Des 2026", "—", "—", "—", "—", "—", "SP2D Cair", fmtB(totTNI), fmtB(totPolri), fmtB(totAll)];
    } else {
      // Konsolidasi Semua Program
      title = "REKAPITULASI KONSOLIDASI PENERIMAAN DANA IURAN TA 2026 - PT ASABRI (PERSERO)";
      subtitle = "Rekap Realisasi 4 Program: DAPEN (4,75%), THT (3,25%), JKK, dan JKM (TNI & POLRI)";
      fileName = "Rekapitulasi_Penerimaan_Dana_Iuran_Konsolidasi_TA2026.xlsx";
      cols = ["Program Iuran", "Dasar Dokumen", "Siklus / Termin", "Tarif Iuran", "Realisasi TNI (Rp)", "Realisasi POLRI (Rp)", "Total Kas Masuk (Rp)", "Porsi TNI", "Porsi POLRI"];
      const dapenTNI = PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.tni || 0), 0);
      const dapenPolri = PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.polri || 0), 0);
      const dapenTotal = dapenTNI + dapenPolri;

      const thtTNI = PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.tni || 0), 0);
      const thtPolri = PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.polri || 0), 0);
      const thtTotal = thtTNI + thtPolri;

      const jkkTNI = PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.tni || 0), 0);
      const jkkPolri = PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.polri || 0), 0);
      const jkkTotal = jkkTNI + jkkPolri;

      const jkmTNI = PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.tni || 0), 0);
      const jkmPolri = PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.polri || 0), 0);
      const jkmTotal = jkmTNI + jkmPolri;

      const gTNI = dapenTNI + thtTNI + jkkTNI + jkmTNI;
      const gPolri = dapenPolri + thtPolri + jkkPolri + jkmPolri;
      const gTotal = dapenTotal + thtTotal + jkkTotal + jkmTotal;

      rows = [
        ["1. Premi DAPEN", "SKP-PFK Kemenkeu", "2 Termin / Bulan (s.d 01 & s.d 10)", "4,75%", fmtB(dapenTNI), fmtB(dapenPolri), fmtB(dapenTotal), `${((dapenTNI / dapenTotal) * 100).toFixed(1)}%`, `${((dapenPolri / dapenTotal) * 100).toFixed(1)}%`],
        ["2. Premi THT", "SKP-PFK Kemenkeu", "2 Termin / Bulan (s.d 01 & s.d 10)", "3,25%", fmtB(thtTNI), fmtB(thtPolri), fmtB(thtTotal), `${((thtTNI / thtTotal) * 100).toFixed(1)}%`, `${((thtPolri / thtTotal) * 100).toFixed(1)}%`],
        ["3. Iuran JKK", "Nota Dinas Div. Kepesertaan", "Bulanan + Penyesuaian TW", "0,62%", fmtB(jkkTNI), fmtB(jkkPolri), fmtB(jkkTotal), `${((jkkTNI / jkkTotal) * 100).toFixed(1)}%`, `${((jkkPolri / jkkTotal) * 100).toFixed(1)}%`],
        ["4. Iuran JKM", "Nota Dinas Div. Kepesertaan", "Bulanan + Penyesuaian TW", "0,81%", fmtB(jkmTNI), fmtB(jkmPolri), fmtB(jkmTotal), `${((jkmTNI / jkmTotal) * 100).toFixed(1)}%`, `${((jkmPolri / jkmTotal) * 100).toFixed(1)}%`]
      ];

      totalRow = [
        "GRAND TOTAL REALISASI KAS (Jan - Okt 2026)",
        "—",
        "Tahun Berjalan 2026",
        "9,43%",
        fmtB(gTNI),
        fmtB(gPolri),
        fmtB(gTotal),
        `${((gTNI / gTotal) * 100).toFixed(1)}%`,
        `${((gPolri / gTotal) * 100).toFixed(1)}%`
      ];
    }

    setPreview({
      title,
      subtitle,
      type: "table",
      fileName,
      content: {
        columns: cols,
        rows,
        totalRow,
        totalRows: rows.length
      }
    });
  };

  // Helper Ekspor Excel
  const handleExportExcel = () => {
    const list =
      activeProgram === "THT"
        ? activeThtPenerimaan
        : activeProgram === "PENSIUN"
        ? activePensiunPenerimaan
        : activeProgram === "JKK"
        ? activeJkkPenerimaan
        : activeJkmPenerimaan;

    const progTitle =
      activeProgram === "THT"
        ? "THT (3,25%)"
        : activeProgram === "PENSIUN"
        ? "Pensiun (4,75%)"
        : activeProgram === "JKK"
        ? "JKK (0,62%)"
        : "JKM (0,81%)";

    setPreview({
      title: `Laporan Rekonsiliasi Iuran ${progTitle} — ${currentMonthData.namaBulan}`,
      subtitle: `Tahun Anggaran ${selectedYear} • Status: ${currentMonthData.statusLabel}`,
      type: "table",
      fileName: `Rekonsiliasi_${activeProgram}_${selectedMonth}.xlsx`,
      content: {
        columns: ["Pilar / Program", "Tarif", "Surat Tagihan ASABRI", "Dokumen Kemenkeu", "Nomor SP2D", "Realisasi Kas (Rp)", "Selisih Kas", "Status Rekon"],
        rows: list.map((r) => [
          r.pilar || r.namaDana,
          r.tarif,
          r.noSuratTagihan,
          r.noSKP || r.noNotaDinas,
          r.noSP2D,
          fmtB(r.nominalDiterima || r.nominalPenerimaan),
          r.selisihNominal === 0 ? "Rp 0" : fmtB(r.selisihNominal),
          r.statusRekon
        ]),
        totalRow: [
          "TOTAL KONSOLIDASI", "—", `${list.length} Tagihan`, currentMonthData.noSKP || "Nota Dinas", "SP2D Cair",
          fmtB(list.reduce((a, b) => a + (b.nominalDiterima || b.nominalPenerimaan || 0), 0)),
          "Rp 0",
          currentMonthData.statusLabel
        ],
        totalRows: list.length
      }
    });
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
      <SatkerModal data={satkerModalData} onClose={() => setSatkerModalData(null)} />

      {/* =========================================================================
          MODAL REKAM / SINKRONISASI BULAN BARU (SMART STORE)
         ========================================================================= */}
      {showAddMonthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(3px)"
          }}
          onClick={() => setShowAddMonthModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 580,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "18px 22px", background: "#F8FAFC", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: "#DBEAFE", color: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                    Rekam / Sinkronisasi Data Rekonsiliasi Bulan Baru
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray600 }}>
                    Menyimpan & mengaktifkan periode rekonsiliasi bulanan baru
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAddMonthModal(false)} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNewMonthRecord} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Field 1: Pilih Bulan */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                  Pilih Periode Bulan & Tahun Anggaran *
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    value={formNewMonth.bulan}
                    onChange={(e) => {
                      const val = e.target.value;
                      const mInfo = MONTHS_LIST.find((m) => m.key === val);
                      setFormNewMonth({
                        ...formNewMonth,
                        bulan: val,
                        namaBulan: mInfo ? `${mInfo.label} ${selectedYear}` : val
                      });
                    }}
                    style={{ flex: 1, height: 38, padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 600 }}
                  >
                    {MONTHS_LIST.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.label} {selectedYear} ({monthlyStore[m.key] ? "Sudah Ada Data" : "Periode Baru"})
                      </option>
                    ))}
                  </select>
                  <div style={{ height: 38, padding: "0 14px", background: "#F1F5F9", borderRadius: 6, display: "flex", alignItems: "center", fontWeight: 700, fontSize: 13, color: COLORS.gray700 }}>
                    TA {selectedYear}
                  </div>
                </div>
              </div>

              {/* Banner Sinkronisasi Otomatis */}
              <div style={{ padding: "10px 14px", background: "#EFF6FF", borderLeft: `3px solid ${COLORS.blue}`, borderRadius: 6, fontSize: 12, color: COLORS.blueDark, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <b>⚡ Sinkronisasi Otomatis:</b> Tarik data dari surat tagihan yang telah digenerate pada modul <b>Penagihan Iuran</b>.
                </div>
              </div>

              {/* Field 2 & 3: Nomor Surat Tagihan & SKP Kemenkeu */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    No. Surat Tagihan ASABRI *
                  </label>
                  <input
                    type="text"
                    value={formNewMonth.noSuratTagihan}
                    onChange={(e) => setFormNewMonth({ ...formNewMonth, noSuratTagihan: e.target.value })}
                    style={{ width: "100%", height: 36, padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    No. SKP-PFK Kemenkeu *
                  </label>
                  <input
                    type="text"
                    value={formNewMonth.noSKP}
                    onChange={(e) => setFormNewMonth({ ...formNewMonth, noSKP: e.target.value })}
                    style={{ width: "100%", height: 36, padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Field 4 & 5: SP2D & Tgl Terima Dana */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    No. SP2D Realisasi Kas *
                  </label>
                  <input
                    type="text"
                    value={formNewMonth.noSP2D}
                    onChange={(e) => setFormNewMonth({ ...formNewMonth, noSP2D: e.target.value })}
                    style={{ width: "100%", height: 36, padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tanggal Kas Masuk (SP2D) *
                  </label>
                  <input
                    type="text"
                    value={formNewMonth.tglTerimaDana}
                    onChange={(e) => setFormNewMonth({ ...formNewMonth, tglTerimaDana: e.target.value })}
                    style={{ width: "100%", height: 36, padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Btn variant="ghost" size="sm" type="button" onClick={() => setShowAddMonthModal(false)}>
                  Batal
                </Btn>
                <Btn variant="primary" size="sm" type="submit">
                  <Check size={14} style={{ marginRight: 4 }} />
                  Simpan & Buka Periode Ini
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL KONFIRMASI SELESAIKAN BULAN INI & TERBITKAN BAR
         ========================================================================= */}
      {confirmCompleteItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(2px)"
          }}
          onClick={() => setConfirmCompleteItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 12,
              width: "100%",
              maxWidth: 520,
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "18px 22px", background: "#F8FAFC", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#D1FAE5", color: "#065F46", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                  Konfirmasi Selesaikan Rekonsiliasi & Kunci Periode
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray600 }}>
                  Periode: <b>{currentMonthData.namaBulan}</b>
                </div>
              </div>
            </div>

            <div style={{ padding: "20px 22px", fontSize: 12.5, color: COLORS.gray700, lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                Apakah Anda yakin ingin menyelesaikan proses rekonsiliasi untuk periode <strong>{currentMonthData.namaBulan}</strong>?
              </p>
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#ECFDF5", borderLeft: `3px solid #10B981`, borderRadius: 4, fontSize: 12, color: "#065F46" }}>
                📌 <b>Setelah diselesaikan:</b>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: 18 }}>
                  <li>Status bulan {currentMonthData.namaBulan} akan berubah menjadi <b>✓ Lunas & Selesai</b>.</li>
                  <li>Sistem otomatis menerbitkan <b>Berita Acara Rekonsiliasi (BAR)</b> resmi bersama DJPb Kemenkeu.</li>
                  <li>Data terkunci rapi di repositori bulanan untuk kebutuhan audit BPK & DJPb.</li>
                </ul>
              </div>
            </div>

            <div style={{ padding: "14px 22px", background: "#F8FAFC", borderTop: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Btn variant="ghost" size="sm" onClick={() => setConfirmCompleteItem(null)}>
                Batal
              </Btn>
              <Btn
                variant="primary"
                size="sm"
                style={{ background: "#059669" }}
                onClick={handleFinalizeMonth}
              >
                <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                Ya, Selesaikan & Terbitkan BAR
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Bar Notifikasi Interaksi */}
      {notice && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 18px",
            background: "#ECFDF5",
            borderRadius: 8,
            border: `1px solid #10B981`,
            color: "#065F46",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}
        >
          <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>{notice}</span>
        </div>
      )}

      {/* =========================================================================
          PROGRAM SWITCHER UTAMA
         ========================================================================= */}
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 12,
          padding: "6px",
          display: "inline-flex",
          gap: 8,
          marginBottom: 16,
          border: `1px solid ${COLORS.gray200}`,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}
      >
        <button
          onClick={() => { setActiveProgram("THT"); setActiveSubtab("rekonsiliasi"); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: activeProgram === "THT" && activeSubtab === "rekonsiliasi" ? COLORS.white : "transparent",
            color: activeProgram === "THT" && activeSubtab === "rekonsiliasi" ? COLORS.blue : COLORS.gray600,
            boxShadow: activeProgram === "THT" && activeSubtab === "rekonsiliasi" ? "0 2px 6px rgba(37,99,235,0.12)" : "none"
          }}
        >
          <Building2 size={16} color={activeProgram === "THT" && activeSubtab === "rekonsiliasi" ? COLORS.blue : COLORS.gray500} />
          <span>1. THT (3,25%)</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: activeProgram === "THT" && activeSubtab === "rekonsiliasi" ? "#DBEAFE" : "#E2E8F0", color: activeProgram === "THT" && activeSubtab === "rekonsiliasi" ? "#1E40AF" : COLORS.gray600, fontWeight: 700 }}>
            THT TNI &amp; Polri
          </span>
        </button>

        <button
          onClick={() => { setActiveProgram("PENSIUN"); setActiveSubtab("rekonsiliasi"); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" ? COLORS.white : "transparent",
            color: activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" ? "#4F46E5" : COLORS.gray600,
            boxShadow: activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" ? "0 2px 6px rgba(79,70,229,0.12)" : "none"
          }}
        >
          <Landmark size={16} color={activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" ? "#4F46E5" : COLORS.gray500} />
          <span>2. Pensiun (4,75%)</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" ? "#EEF2FF" : "#E2E8F0", color: activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" ? "#3730A3" : COLORS.gray600, fontWeight: 700 }}>
            Pensiun TNI &amp; Polri
          </span>
        </button>

        <button
          onClick={() => { setActiveProgram("JKK"); setActiveSubtab("rekonsiliasi"); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: activeProgram === "JKK" && activeSubtab === "rekonsiliasi" ? COLORS.white : "transparent",
            color: activeProgram === "JKK" && activeSubtab === "rekonsiliasi" ? "#047857" : COLORS.gray600,
            boxShadow: activeProgram === "JKK" && activeSubtab === "rekonsiliasi" ? "0 2px 6px rgba(4,120,87,0.12)" : "none"
          }}
        >
          <Shield size={16} color={activeProgram === "JKK" && activeSubtab === "rekonsiliasi" ? "#047857" : COLORS.gray500} />
          <span>3. JKK (0,62%)</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: activeProgram === "JKK" && activeSubtab === "rekonsiliasi" ? "#D1FAE5" : "#E2E8F0", color: activeProgram === "JKK" && activeSubtab === "rekonsiliasi" ? "#065F46" : COLORS.gray600, fontWeight: 700 }}>
            Rekon 3 Bulan
          </span>
        </button>

        <button
          onClick={() => { setActiveProgram("JKM"); setActiveSubtab("rekonsiliasi"); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: activeProgram === "JKM" && activeSubtab === "rekonsiliasi" ? COLORS.white : "transparent",
            color: activeProgram === "JKM" && activeSubtab === "rekonsiliasi" ? "#0D9488" : COLORS.gray600,
            boxShadow: activeProgram === "JKM" && activeSubtab === "rekonsiliasi" ? "0 2px 6px rgba(13,148,136,0.12)" : "none"
          }}
        >
          <ShieldCheck size={16} color={activeProgram === "JKM" && activeSubtab === "rekonsiliasi" ? "#0D9488" : COLORS.gray500} />
          <span>4. JKM (0,81%)</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: activeProgram === "JKM" && activeSubtab === "rekonsiliasi" ? "#CCFBF1" : "#E2E8F0", color: activeProgram === "JKM" && activeSubtab === "rekonsiliasi" ? "#115E59" : COLORS.gray600, fontWeight: 700 }}>
            Rekon 3 Bulan
          </span>
        </button>

        <button
          onClick={() => setActiveSubtab("rekap_resmi")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            background: activeSubtab === "rekap_resmi" ? COLORS.white : "transparent",
            color: activeSubtab === "rekap_resmi" ? "#059669" : COLORS.gray600,
            boxShadow: activeSubtab === "rekap_resmi" ? "0 2px 6px rgba(5,150,105,0.12)" : "none"
          }}
        >
          <FileSpreadsheet size={16} color={activeSubtab === "rekap_resmi" ? "#059669" : COLORS.gray500} />
          <span>Format Resmi Excel</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: activeSubtab === "rekap_resmi" ? "#ECFDF5" : "#E2E8F0", color: activeSubtab === "rekap_resmi" ? "#065F46" : COLORS.gray600, fontWeight: 700 }}>
            Penerimaan Dana Iuran.xlsx
          </span>
        </button>
      </div>

      {/* =========================================================================
          KONTEN JKK (0,62%) & JKM (0,81%) — MENGGUNAKAN DESAIN REFERENSI RESMI
         ========================================================================= */}
      {(activeProgram === "JKK" || activeProgram === "JKM") && activeSubtab === "rekonsiliasi" ? (
        <RekonsiliasiJKKJKM
          initialProgram={activeProgram}
          onSelectTHT={() => {
            setActiveProgram("THT");
            setActiveSubtab("rekonsiliasi");
          }}
          onSelectPensiun={() => {
            setActiveProgram("PENSIUN");
            setActiveSubtab("rekonsiliasi");
          }}
          onSelectExcelFormat={() => {
            setActiveSubtab("rekap_resmi");
          }}
          onOpenSuratPreview={(suratData) => {
            setPreview({
              title: `Surat Tagihan — ${suratData.noSurat}`,
              subtitle: `Kemenkeu RI / KPPN Khusus Jakarta II • Rekonsiliasi Triwulanan`,
              type: "surat_kemenkeu",
              fileName: `Surat_Tagihan_${suratData.noSurat.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
              content: {
                program: suratData.items?.[0]?.jenis || `Iuran ${activeProgram}`,
                halProgram: `Tagihan Iuran ${activeProgram} TA 2026`,
                namaProgramFull: suratData.items?.[0]?.jenis || `Iuran ${activeProgram}`,
                noSurat: suratData.noSurat,
                tanggalSurat: suratData.tanggal,
                kepada: "Direktur Jenderal Perbendaharaan Kemenkeu RI",
                totalNominal: suratData.totalNominal,
                items: suratData.items || []
              }
            });
          }}
          onOpenBARPreview={(barData) => {
            setPreview({
              title: `Berita Acara Rekonsiliasi (BAR) — ${barData.noBAR}`,
              subtitle: `Penetapan Bersama PT ASABRI (Persero) & Ditjen Perbendaharaan Kemenkeu RI`,
              type: "bar",
              fileName: `${barData.noBAR.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
              content: {
                noBAR: barData.noBAR,
                hariTanggal: barData.hariTanggal,
                programJudul: barData.programJudul,
                periode: barData.periode,
                noSuratTagihan: "S-1502/KU.06.05/2026",
                dokumenDasar: "Nota Dinas Divisi Kepesertaan",
                noSP2D: "SP2D-260728-004129",
                tglSP2D: "28 Juli 2026",
                bankTujuan: "Bank Mandiri Rek. Penampungan Iuran Kemenkeu",
                nominal: "Rp 79.810.000.000"
              }
            });
          }}
        />
      ) : (
        <>
          {/* =========================================================================
              FITUR 1: TIMELINE BULANAN (MONTHLY SWITCHER & STORAGE BAR)
          Membuat user journey berpindah antar-bulan menjadi instan, jelas, dan smooth
         ========================================================================= */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 12,
          padding: "14px 18px",
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 16,
          boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={18} color={COLORS.blue} />
            <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900 }}>
              Timeline Rekonsiliasi Bulanan — Tahun Anggaran {selectedYear}
            </span>
            <span style={{ fontSize: 11, background: "#EFF6FF", color: COLORS.blueDark, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
              Tersimpan {Object.keys(monthlyStore).length} dari 12 Bulan
            </span>
          </div>

          {/* Quick Actions Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setShowMatrixView(!showMatrixView)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${showMatrixView ? COLORS.blue : COLORS.gray300}`,
                background: showMatrixView ? "#EFF6FF" : COLORS.white,
                color: showMatrixView ? COLORS.blue : COLORS.gray700,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <TableProperties size={13} />
              <span>{showMatrixView ? "Tutup Matriks 12 Bulan" : "Lihat Matriks 12 Bulan"}</span>
            </button>

            <button
              onClick={() => setShowAddMonthModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: COLORS.blue,
                color: COLORS.white,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(30,58,138,0.2)"
              }}
            >
              <Plus size={14} />
              <span>+ Rekam Bulan Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Tanggal & Periode (Semua Tanggal vs Per-Bulan) */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, alignItems: "center" }}>
          {/* Tombol Utama: Semua Tanggal (Menampilkan seluruh record secara kronologis dengan kolom Tanggal) */}
          <button
            onClick={() => {
              setSelectedMonth("ALL");
              setShowMatrixView(false);
            }}
            style={{
              flex: "0 0 auto",
              padding: "7px 14px",
              borderRadius: 8,
              border: selectedMonth === "ALL" ? `2px solid ${COLORS.blue}` : `1px solid ${COLORS.gray200}`,
              background: selectedMonth === "ALL" ? "#EFF6FF" : COLORS.white,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease",
              boxShadow: selectedMonth === "ALL" ? "0 2px 6px rgba(37,99,235,0.15)" : "none"
            }}
          >
            <Calendar size={16} color={selectedMonth === "ALL" ? COLORS.blue : COLORS.gray500} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: selectedMonth === "ALL" ? 800 : 700, color: selectedMonth === "ALL" ? COLORS.blue : COLORS.gray800 }}>
                Semua Tanggal
              </div>
              <div style={{ fontSize: 10, color: COLORS.gray500 }}>
                Seluruh Record TA {selectedYear}
              </div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: selectedMonth === "ALL" ? COLORS.blue : "#F1F5F9", color: selectedMonth === "ALL" ? COLORS.white : COLORS.gray600 }}>
              {activeProgram === "THT" ? activeThtPenerimaan.length : activeProgram === "PENSIUN" ? activePensiunPenerimaan.length : activeProgram === "JKK" ? activeJkkPenerimaan.length : activeJkmPenerimaan.length}
            </span>
          </button>

          <div style={{ width: 1, height: 28, background: COLORS.gray200, flexShrink: 0, margin: "0 2px" }} />

          {MONTHS_LIST.map((m) => {
            const stored = monthlyStore[m.key];
            const isSelected = selectedMonth === m.key;
            const status = stored ? stored.status : m.statusDefault;

            let badgeBg = "#F1F5F9";
            let badgeText = COLORS.gray500;
            let statusIcon = null;

            if (status === "selesai") {
              badgeBg = isSelected ? "#065F46" : "#ECFDF5";
              badgeText = isSelected ? COLORS.white : "#065F46";
              statusIcon = <CheckCheck size={12} />;
            } else if (status === "aktif") {
              badgeBg = isSelected ? COLORS.blue : "#DBEAFE";
              badgeText = isSelected ? COLORS.white : "#1E40AF";
              statusIcon = <Clock size={12} />;
            } else if (status === "draft") {
              badgeBg = isSelected ? "#B45309" : "#FEF3C7";
              badgeText = isSelected ? COLORS.white : "#92400E";
              statusIcon = <FileText size={12} />;
            }

            return (
              <button
                key={m.key}
                onClick={() => {
                  setSelectedMonth(m.key);
                  setShowMatrixView(false);
                }}
                style={{
                  flex: "1 0 88px",
                  minWidth: 88,
                  padding: "8px 6px",
                  borderRadius: 8,
                  border: isSelected ? `2px solid ${status === "selesai" ? "#059669" : COLORS.blue}` : `1px solid ${COLORS.gray200}`,
                  background: isSelected ? (status === "selesai" ? "#F0FDF4" : "#EFF6FF") : COLORS.white,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
                }}
              >
                <div style={{ fontSize: 12, fontWeight: isSelected ? 800 : 700, color: isSelected ? COLORS.gray900 : COLORS.gray700 }}>
                  {m.short}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: badgeBg,
                    color: badgeText,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    whiteSpace: "nowrap"
                  }}
                >
                  {statusIcon}
                  <span>
                    {status === "selesai" ? "Lunas" : status === "aktif" ? "Aktif" : status === "draft" ? "Draft" : "—"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          FITUR 2: VIEW MATRIKS 12 BULAN (YEAR-TO-DATE AUDIT MONITORING)
         ========================================================================= */}
      {showMatrixView && (
        <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, marginBottom: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "14px 18px", background: "#F8FAFC", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                Matriks Rekonsiliasi Iuran 12 Bulan — TA {selectedYear}
              </div>
              <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 2 }}>
                Penyimpanan & monitoring status penyelesaian rekonsiliasi sepanjang tahun anggaran
              </div>
            </div>
            <span style={{ fontSize: 11.5, color: COLORS.gray500 }}>
              Klik <b>"Buka Rekon"</b> untuk mengaktifkan detail bulan
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan Periode</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Rekon</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat SKP Kemenkeu</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Realisasi SP2D</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Ketetapan (Rp)</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Penerimaan Kas (Rp)</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Dokumen BAR</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {MONTHS_LIST.map((m) => {
                  const stored = monthlyStore[m.key];
                  const hasData = !!stored;
                  const isCur = selectedMonth === m.key;

                  return (
                    <tr key={m.key} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: isCur ? "#EFF6FF" : "transparent" }}>
                      <td style={{ padding: "11px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                        {m.label} {selectedYear}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: stored?.status === "selesai" ? "#ECFDF5" : stored?.status === "aktif" ? "#DBEAFE" : "#FEF3C7",
                            color: stored?.status === "selesai" ? "#065F46" : stored?.status === "aktif" ? "#1E40AF" : "#92400E"
                          }}
                        >
                          {stored?.statusLabel || "Belum Ada Data"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 11.5 }}>
                        {stored?.noSKP || "—"}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 11.5 }}>
                        {stored?.tglTerimaDana || "—"}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace" }}>
                        {hasData ? fmtB(105280000000) : "—"}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                        {hasData ? (stored.status === "draft" ? "Rp 0" : fmtB(105280000000)) : "—"}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46", fontWeight: 700 }}>
                        {hasData ? "Rp 0" : "—"}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 11.5, fontFamily: "monospace", color: "#065F46" }}>
                        {stored?.noBAR || "—"}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>
                        <button
                          onClick={() => {
                            setSelectedMonth(m.key);
                            setShowMatrixView(false);
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 4,
                            border: `1px solid ${COLORS.gray300}`,
                            background: isCur ? COLORS.blue : COLORS.white,
                            color: isCur ? COLORS.white : COLORS.gray700,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {isCur ? "Sedang Dibuka" : "Buka Rekon"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          FITUR 3: BANNER PERIODE BULAN AKTIF (ACTIVE MONTH CONTEXT)
         ========================================================================= */}
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 10,
          border: `1px solid ${COLORS.gray200}`,
          padding: "12px 18px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: currentMonthData.status === "selesai" ? "#D1FAE5" : "#DBEAFE", color: currentMonthData.status === "selesai" ? "#065F46" : COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {currentMonthData.status === "selesai" ? <CheckCheck size={22} /> : <Calendar size={22} />}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                Periode Rekonsiliasi: {currentMonthData.namaBulan}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: currentMonthData.status === "selesai" ? "#ECFDF5" : "#EFF6FF",
                  color: currentMonthData.status === "selesai" ? "#065F46" : COLORS.blue,
                  border: `1px solid ${currentMonthData.status === "selesai" ? "#A7F3D0" : "#BFDBFE"}`
                }}
              >
                {currentMonthData.statusLabel}
              </span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 2 }}>
              Surat Tagihan: <b>1190-1193/KU.06.06</b> • SKP Kemenkeu: <b>{currentMonthData.noSKP}</b> • SP2D: <b>{currentMonthData.noSP2D}</b>
            </div>
          </div>
        </div>

        {/* Action Button: Selesaikan Bulan Ini / Cetak BAR */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {currentMonthData.status === "aktif" && (
            <Btn
              variant="primary"
              size="sm"
              style={{ background: "#059669" }}
              onClick={() => setConfirmCompleteItem(currentMonthData)}
            >
              <CheckCircle2 size={13} style={{ marginRight: 4 }} />
              Selesaikan Rekonsiliasi & Terbitkan BAR
            </Btn>
          )}

          {currentMonthData.status === "selesai" && (
            <Btn
              variant="outline"
              size="sm"
              style={{ color: "#065F46", borderColor: "#A7F3D0", background: "#ECFDF5" }}
              onClick={() => openBARPreview()}
            >
              <FileCheck size={13} style={{ marginRight: 4 }} />
              Cetak BAR Sah ({currentMonthData.noBAR})
            </Btn>
          )}
        </div>
      </div>

            {/* Subtab Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${COLORS.gray200}`, marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: -2 }}>
          <button
            onClick={() => setActiveSubtab("rekonsiliasi")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSubtab === "rekonsiliasi" ? 800 : 600,
              color: activeSubtab === "rekonsiliasi" ? (activeProgram === "THT" ? COLORS.blue : activeProgram === "PENSIUN" ? "#4F46E5" : activeProgram === "JKK" ? "#047857" : "#0D9488") : COLORS.gray600,
              borderBottom: activeSubtab === "rekonsiliasi" ? `3px solid ${activeProgram === "THT" ? COLORS.blue : activeProgram === "PENSIUN" ? "#4F46E5" : activeProgram === "JKK" ? "#047857" : "#0D9488"}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <ArrowRightLeft size={16} />
            Rekonsiliasi {activeProgram} ({currentMonthData.namaBulan})
          </button>

          <button
            onClick={() => setActiveSubtab("rekap_resmi")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSubtab === "rekap_resmi" ? 800 : 600,
              color: activeSubtab === "rekap_resmi" ? "#047857" : COLORS.gray600,
              borderBottom: activeSubtab === "rekap_resmi" ? "3px solid #047857" : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <FileSpreadsheet size={16} />
            Rekap Penerimaan Dana Resmi (Format Excel ASABRI)
            <span style={{ fontSize: 10, padding: "2px 6px", background: "#ECFDF5", color: "#065F46", borderRadius: 10, fontWeight: 700 }}>
              Template Resmi
            </span>
          </button>

          <button
            onClick={() => setActiveSubtab("history")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSubtab === "history" ? 800 : 600,
              color: activeSubtab === "history" ? (activeProgram === "THT" ? COLORS.blue : activeProgram === "PENSIUN" ? "#4F46E5" : activeProgram === "JKK" ? "#047857" : "#0D9488") : COLORS.gray600,
              borderBottom: activeSubtab === "history" ? `3px solid ${activeProgram === "THT" ? COLORS.blue : activeProgram === "PENSIUN" ? "#4F46E5" : activeProgram === "JKK" ? "#047857" : "#0D9488"}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <History size={16} />
            Riwayat Dokumen BAR Sah
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="outline" size="sm" onClick={handleExportExcel}>
            <Download size={13} style={{ marginRight: 4 }} />
            Ekspor Excel Bulan Ini
          </Btn>
          <Btn size="sm" style={{ background: "#059669", color: "#FFFFFF", border: "none" }} onClick={() => handleExportFormatResmi()}>
            <FileSpreadsheet size={13} style={{ marginRight: 4 }} />
            Ekspor Format Resmi ASABRI (.xlsx)
          </Btn>
        </div>
      </div>

      {/* =========================================================================
          KONTEN A: PROGRAM 1 — THT (3,25%)
         ========================================================================= */}
      {activeProgram === "THT" && activeSubtab === "rekonsiliasi" && (
        <div>
          {/* Toggle 2 Model Rekonsiliasi THT */}
          <div style={{ background: "#F0F7FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#1E3A8A" }}>
                Pilih Model Rekonsiliasi THT (3,25%):
              </div>
              <div style={{ fontSize: 11.5, color: "#3B82F6" }}>
                Periode {currentMonthData.namaBulan} &bull; Pilar: <b>THT TNI &amp; THT Polri</b> (SKP-PFK Kemenkeu)
              </div>
            </div>

            <div style={{ display: "flex", background: COLORS.white, borderRadius: 8, padding: 3, border: "1px solid #93C5FD", gap: 4 }}>
              <button
                onClick={() => setThtRekonMode("penerimaan_vs_skp")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  background: thtRekonMode === "penerimaan_vs_skp" ? COLORS.blue : "transparent",
                  color: thtRekonMode === "penerimaan_vs_skp" ? COLORS.white : COLORS.gray700
                }}
              >
                <Landmark size={14} />
                <span>1. Penerimaan Dana vs SKP (THT TNI &amp; Polri)</span>
              </button>

              <button
                onClick={() => setThtRekonMode("kepesertaan_vs_skp")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  background: thtRekonMode === "kepesertaan_vs_skp" ? COLORS.blue : "transparent",
                  color: thtRekonMode === "kepesertaan_vs_skp" ? COLORS.white : COLORS.gray700
                }}
              >
                <Users size={14} />
                <span>2. Data Kepesertaan vs SKP (THT TNI &amp; Polri)</span>
              </button>
            </div>
          </div>

          {/* Model 1: Penerimaan Dana vs SKP */}
          {thtRekonMode === "penerimaan_vs_skp" && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 145 }}>Tanggal Realisasi</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Pilar / Program</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan ASABRI</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Ketetapan SKP Kemenkeu</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Realisasi Kas (SP2D)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal SKP (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Penerimaan Dana (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Kas</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Rekon</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeThtPenerimaan.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={13} color="#2563EB" />
                            <span style={{ fontWeight: 800, fontSize: 12.5, color: COLORS.gray900 }}>
                              {item.tglTerimaDana || "18 Sep 2026"}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                            {item.periodeBulan || currentMonthData.namaBulan}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: item.pilar.includes("TNI") ? "#EFF6FF" : "#F0FDF4", color: item.pilar.includes("TNI") ? "#1D4ED8" : "#15803D" }}>
                            {item.pilar}
                          </span>
                          <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                            Tarif {item.tarif} &bull; {item.matraUtama}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12 }}>{item.noSuratTagihan}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>Tgl: {item.tglSuratTagihan}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>{item.noSKP}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>Tgl: {item.tglSKP}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>{item.noSP2D}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray600 }}>Cair: <b>{item.tglTerimaDana}</b></div>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                          {fmtB(item.nominalDanaSKP)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#065F46" }}>
                          {fmtB(item.nominalDiterima)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                          {item.selisihNominal === 0 ? "Rp 0" : fmtB(item.selisihNominal)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#ECFDF5", color: "#065F46" }}>
                            {item.statusRekon}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <Btn size="xs" variant="outline" onClick={() => openSuratTagihanPreview(item)}>
                            <FileText size={11} style={{ marginRight: 3 }} />
                            Surat
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={5} style={{ padding: "12px 14px" }}>
                        TOTAL THT {currentMonthData.namaBulan.toUpperCase()}:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                        {fmtB(activeThtPenerimaan.reduce((a, b) => a + (b.nominalDanaSKP || 0), 0))}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46" }}>
                        {fmtB(activeThtPenerimaan.reduce((a, b) => a + (b.nominalDiterima || 0), 0))}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46" }}>
                        Rp 0
                      </td>
                      <td colSpan={2} style={{ padding: "12px 14px", textAlign: "center", color: "#065F46" }}>
                        Match (100% Selesai)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Model 2: Data Kepesertaan vs SKP */}
          {thtRekonMode === "kepesertaan_vs_skp" && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 145 }}>Tanggal SKP</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Pilar / Program</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra Cakupan</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Tarif</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Sistem</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Kepesertaan (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta SKP</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal SKP (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Rekon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeThtKepesertaan.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={13} color="#2563EB" />
                            <span style={{ fontWeight: 800, fontSize: 12.5, color: COLORS.gray900 }}>
                              {item.tglSKP || "14 Sep 2026"}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                            {item.periodeBulan || currentMonthData.namaBulan}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: "#EFF6FF", color: "#1D4ED8" }}>
                            {item.pilar}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", color: COLORS.gray800 }}>{item.matra}</td>
                        <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "monospace", fontWeight: 800 }}>{item.tarif}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmtNum(item.pesertaSistem)} Jiwa</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmtB(item.nominalSistem)}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmtNum(item.pesertaSKP)} Jiwa</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>{fmtB(item.nominalSKP)}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: item.selisihNominal < 0 ? "#DC2626" : "#065F46" }}>
                          {item.selisihNominal === 0 ? "Rp 0" : fmtB(item.selisihNominal)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: item.selisihNominal === 0 ? "#ECFDF5" : "#FEF3C7", color: item.selisihNominal === 0 ? "#065F46" : "#92400E" }}>
                            {item.statusRekap}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          KONTEN B: PROGRAM 2 — PENSIUN (4,75%)
         ========================================================================= */}
      {activeProgram === "PENSIUN" && activeSubtab === "rekonsiliasi" && (
        <div>
          {/* Toggle 2 Model Rekonsiliasi Pensiun */}
          <div style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#3730A3" }}>
                Pilih Model Rekonsiliasi Pensiun / DAPEN (4,75%):
              </div>
              <div style={{ fontSize: 11.5, color: "#4F46E5" }}>
                Periode {currentMonthData.namaBulan} &bull; Pilar: <b>Pensiun TNI &amp; Pensiun Polri</b> (SKP-PFK Kemenkeu)
              </div>
            </div>

            <div style={{ display: "flex", background: COLORS.white, borderRadius: 8, padding: 3, border: "1px solid #A5B4FC", gap: 4 }}>
              <button
                onClick={() => setPensiunRekonMode("penerimaan_vs_skp")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  background: pensiunRekonMode === "penerimaan_vs_skp" ? "#4F46E5" : "transparent",
                  color: pensiunRekonMode === "penerimaan_vs_skp" ? COLORS.white : COLORS.gray700
                }}
              >
                <Landmark size={14} />
                <span>1. Penerimaan Dana vs SKP (Pensiun TNI &amp; Polri)</span>
              </button>

              <button
                onClick={() => setPensiunRekonMode("kepesertaan_vs_skp")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  background: pensiunRekonMode === "kepesertaan_vs_skp" ? "#4F46E5" : "transparent",
                  color: pensiunRekonMode === "kepesertaan_vs_skp" ? COLORS.white : COLORS.gray700
                }}
              >
                <Users size={14} />
                <span>2. Data Kepesertaan vs SKP (Pensiun TNI &amp; Polri)</span>
              </button>
            </div>
          </div>

          {/* Model 1: Penerimaan Dana vs SKP */}
          {pensiunRekonMode === "penerimaan_vs_skp" && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 145 }}>Tanggal Realisasi</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Pilar / Program</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan ASABRI</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Ketetapan SKP Kemenkeu</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Realisasi Kas (SP2D)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal SKP (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Penerimaan Dana (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Kas</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Rekon</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePensiunPenerimaan.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={13} color="#4F46E5" />
                            <span style={{ fontWeight: 800, fontSize: 12.5, color: COLORS.gray900 }}>
                              {item.tglTerimaDana || "18 Sep 2026"}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                            {item.periodeBulan || currentMonthData.namaBulan}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: "#EEF2FF", color: "#3730A3" }}>
                            {item.pilar}
                          </span>
                          <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                            Tarif {item.tarif} &bull; {item.matraUtama}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12 }}>{item.noSuratTagihan}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>Tgl: {item.tglSuratTagihan}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#4F46E5" }}>{item.noSKP}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>Tgl: {item.tglSKP}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>{item.noSP2D}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray600 }}>Cair: <b>{item.tglTerimaDana}</b></div>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                          {fmtB(item.nominalDanaSKP)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#065F46" }}>
                          {fmtB(item.nominalDiterima)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                          {item.selisihNominal === 0 ? "Rp 0" : fmtB(item.selisihNominal)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#ECFDF5", color: "#065F46" }}>
                            {item.statusRekon}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <Btn size="xs" variant="outline" onClick={() => openSuratTagihanPreview(item)}>
                            <FileText size={11} style={{ marginRight: 3 }} />
                            Surat
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={5} style={{ padding: "12px 14px" }}>
                        TOTAL PENSIUN {currentMonthData.namaBulan.toUpperCase()}:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                        {fmtB(activePensiunPenerimaan.reduce((a, b) => a + (b.nominalDanaSKP || 0), 0))}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46" }}>
                        {fmtB(activePensiunPenerimaan.reduce((a, b) => a + (b.nominalDiterima || 0), 0))}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46" }}>
                        Rp 0
                      </td>
                      <td colSpan={2} style={{ padding: "12px 14px", textAlign: "center", color: "#065F46" }}>
                        Match (100% Selesai)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Model 2: Data Kepesertaan vs SKP */}
          {pensiunRekonMode === "kepesertaan_vs_skp" && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 145 }}>Tanggal SKP</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Pilar / Program</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra Cakupan</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Tarif</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Sistem</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Kepesertaan (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta SKP</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal SKP (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                      <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Rekon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePensiunKepesertaan.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={13} color="#4F46E5" />
                            <span style={{ fontWeight: 800, fontSize: 12.5, color: COLORS.gray900 }}>
                              {item.tglSKP || "14 Sep 2026"}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                            {item.periodeBulan || currentMonthData.namaBulan}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: "#EEF2FF", color: "#3730A3" }}>
                            {item.pilar}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", color: COLORS.gray800 }}>{item.matra}</td>
                        <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "monospace", fontWeight: 800 }}>{item.tarif}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmtNum(item.pesertaSistem)} Jiwa</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmtB(item.nominalSistem)}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmtNum(item.pesertaSKP)} Jiwa</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#4F46E5" }}>{fmtB(item.nominalSKP)}</td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: item.selisihNominal < 0 ? "#DC2626" : "#065F46" }}>
                          {item.selisihNominal === 0 ? "Rp 0" : fmtB(item.selisihNominal)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: item.selisihNominal === 0 ? "#ECFDF5" : "#FEF3C7", color: item.selisihNominal === 0 ? "#065F46" : "#92400E" }}>
                            {item.statusRekap}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

            {/* =========================================================================
          KONTEN B.2: REKAP PENERIMAAN DANA RESMI (FORMAT EXCEL RESMI ASABRI)
          Diadaptasi langsung dari D:/Kerjaan/ASABRI/Penerimaan Dana Iuran.xlsx
         ========================================================================= */}
      {activeSubtab === "rekap_resmi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Header Panel & Filter Program Resmi */}
          <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "3px 8px", background: "#ECFDF5", color: "#065F46", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                    EXCEL ARTIFACT REFERENCE
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                    Rekapitulasi Penerimaan Dana Iuran TA 2026 — PT ASABRI (Persero)
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: COLORS.gray600, marginTop: 4 }}>
                  Visualisasi &amp; template ekspor 100% identik dengan format resmi pembukuan kas <code>Penerimaan Dana Iuran.xlsx</code> mencakup 4 tabel utama: <b>DAPEN (4,75%)</b>, <b>THT (3,25%)</b>, <b>JKK (0,62%)</b>, dan <b>JKm (0,81%)</b>.
                </div>
              </div>

              {/* Action Ekspor */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="outline" onClick={() => handleExportFormatResmi(selectedOfficialProgram)}>
                  <Download size={13} style={{ marginRight: 4 }} />
                  Pratinjau / Ekspor Tabel Terpilih
                </Btn>
                <Btn size="sm" style={{ background: "#059669", color: "#FFFFFF", border: "none" }} onClick={() => handleExportFormatResmi("ALL")}>
                  <FileSpreadsheet size={13} style={{ marginRight: 4 }} />
                  Ekspor Konsolidasi Seluruh Program (.xlsx)
                </Btn>
              </div>
            </div>

            {/* Program Selection Pills */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.gray200}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, marginRight: 4 }}>
                Pilih Tampilan Tabel:
              </span>
              {[
                { id: "ALL", label: "Semua Program (4 Tabel Lengkap)" },
                { id: "DAPEN", label: "1. Premi DAPEN (4,75%)" },
                { id: "THT", label: "2. Premi THT (3,25%)" },
                { id: "JKK", label: "3. Iuran JKK (0,62%)" },
                { id: "JKM", label: "4. Iuran JKm (0,81%)" }
              ].map((p) => {
                const isActive = selectedOfficialProgram === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedOfficialProgram(p.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: isActive ? "1px solid #059669" : `1px solid ${COLORS.gray300}`,
                      background: isActive ? "#ECFDF5" : COLORS.white,
                      color: isActive ? "#065F46" : COLORS.gray700,
                      fontWeight: isActive ? 800 : 600,
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.15s ease"
                    }}
                  >
                    {isActive && <CheckCircle2 size={13} color="#059669" />}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 KPI Stat Cards Konsolidasi */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
            <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${COLORS.gray200}`, borderTop: "4px solid #1D4ED8" }}>
              <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 700, textTransform: "uppercase" }}>DAPEN 4,75% (YTD Jan-Okt)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1D4ED8", fontFamily: "monospace", marginTop: 4 }}>
                Rp 1.671,30 M
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span>TNI: <b>Rp 856,17 M</b></span>
                <span>POLRI: <b>Rp 815,13 M</b></span>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${COLORS.gray200}`, borderTop: "4px solid #7C3AED" }}>
              <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 700, textTransform: "uppercase" }}>THT 3,25% (YTD Jan-Okt)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#7C3AED", fontFamily: "monospace", marginTop: 4 }}>
                Rp 1.143,52 M
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span>TNI: <b>Rp 585,80 M</b></span>
                <span>POLRI: <b>Rp 557,72 M</b></span>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${COLORS.gray200}`, borderTop: "4px solid #D97706" }}>
              <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 700, textTransform: "uppercase" }}>JKK 0,62% (YTD Jan-Okt)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#D97706", fontFamily: "monospace", marginTop: 4 }}>
                Rp 204,11 M
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span>TNI: <b>Rp 106,07 M</b></span>
                <span>POLRI: <b>Rp 98,04 M</b></span>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${COLORS.gray200}`, borderTop: "4px solid #059669" }}>
              <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 700, textTransform: "uppercase" }}>JKM 0,81% (YTD Jan-Okt)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#059669", fontFamily: "monospace", marginTop: 4 }}>
                Rp 266,66 M
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span>TNI: <b>Rp 138,58 M</b></span>
                <span>POLRI: <b>Rp 128,09 M</b></span>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderRadius: 10, padding: "14px 16px", color: COLORS.white, boxShadow: "0 4px 12px rgba(15,23,42,0.15)" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>TOTAL PENERIMAAN YTD</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "#38BDF8", fontFamily: "monospace", marginTop: 4 }}>
                Rp 3.285,60 M
              </div>
              <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>
                Rp 3,28 Triliun (Jan - Okt 2026)
              </div>
            </div>
          </div>

          {/* Banner Insight Bisnis & Korelasi Komponen Excel */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Sparkles size={16} color="#0284C7" />
              Komponen Kunci dari Dokumen Excel Resmi yang Terintegrasi di Front-End:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, fontSize: 12, color: "#334155" }}>
              <div style={{ background: COLORS.white, padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <b style={{ color: "#1D4ED8" }}>1. Dua Termin Cut-Off PFK Bulanan:</b>
                <div style={{ marginTop: 3 }}>
                  Data THT &amp; Dapen dibagi 2 termin: <b>PFK s.d 01</b> (Gaji Induk / 97,8% kas) dan <b>PFK s.d 10</b> (Kekurangan / 2,2% kas).
                </div>
              </div>
              <div style={{ background: COLORS.white, padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <b style={{ color: "#059669" }}>2. SLA Alur Dokumen 3 Tanggal:</b>
                <div style={{ marginTop: 3 }}>
                  Pelacakan transparan: <b>Tgl Surat Tagihan</b> &rarr; <b>Tgl Diterima DJPb</b> &rarr; <b>Tgl Pencairan Dana (SP2D Cair)</b> rata-rata 3–6 hari kerja.
                </div>
              </div>
              <div style={{ background: COLORS.white, padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <b style={{ color: "#D97706" }}>3. Nota Dinas &amp; Penyesuaian Triwulan:</b>
                <div style={{ marginTop: 3 }}>
                  JKK &amp; JKM menggunakan dasar <b>ND Kepesertaan</b> (bukan SKP), serta mencatat baris khusus <b>Kekurangan TW I / II</b> untuk penyesuaian nominal.
                </div>
              </div>
            </div>
          </div>

          {/* TABEL 1: DAPEN (4,75%) */}
          {(selectedOfficialProgram === "ALL" || selectedOfficialProgram === "DAPEN") && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", background: "#EFF6FF", borderBottom: "1px solid #BFDBFE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1E3A8A" }}>
                    PENERIMAAN PREMI DAPEN (4,75%) TAHUN 2026 — PT ASABRI (PERSERO)
                  </div>
                  <div style={{ fontSize: 11.5, color: "#3B82F6", marginTop: 2 }}>
                    Ketetapan SKP-PFK Direktorat Pengelolaan Kas Negara DJPb &bull; Multi-Surat Tagihan (TNI &amp; POLRI) &bull; 2 Termin Cut-off PFK
                  </div>
                </div>
                <Btn size="xs" variant="outline" style={{ background: COLORS.white }} onClick={() => handleExportFormatResmi("DAPEN")}>
                  <Download size={11} style={{ marginRight: 3 }} />
                  Ekspor Dapen (.xlsx)
                </Btn>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan / Termin Cut-off</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>No SKP</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl SKP</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan (TNI &amp; Polri)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Diterima</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Cair SP2D</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TNI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>POLRI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TOTAL (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENERIMAAN_DANA_EXCEL_DATA.dapen.map((r, idx) => {
                      const isTermin1 = r.bulan.includes("01");
                      const hasData = r.total > 0;
                      return (
                        <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: !hasData ? "#FAFAFA" : (isTermin1 ? "#FFFFFF" : "#F8FAFC") }}>
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            <span style={{ display: "inline-block", padding: "2px 6px", borderRadius: 4, fontSize: 10.5, marginRight: 6, background: isTermin1 ? "#DBEAFE" : "#FEF3C7", color: isTermin1 ? "#1E40AF" : "#92400E", fontWeight: 800 }}>
                              {isTermin1 ? "s.d 01" : "s.d 10"}
                            </span>
                            {r.bulan}
                          </td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", color: hasData ? COLORS.blueDark : COLORS.gray400 }}>
                            {r.noSKP}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglSKP}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 10.5, color: hasData ? COLORS.gray800 : COLORS.gray400, whiteSpace: "pre-line" }}>
                            {r.suratTagihan}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglSuratTagihan}</td>
                          <td style={{ padding: "9px 12px", color: hasData ? "#065F46" : COLORS.gray400 }}>{r.tglDiterima}</td>
                          <td style={{ padding: "9px 12px", fontWeight: 600, color: hasData ? "#15803D" : COLORS.gray400 }}>{r.tglCair}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            {hasData ? fmtB(r.tni) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            {hasData ? fmtB(r.polri) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: hasData ? "#1D4ED8" : COLORS.gray400 }}>
                            {hasData ? fmtB(r.total) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#1E293B", color: COLORS.white, fontWeight: 800 }}>
                      <td colSpan={7} style={{ padding: "11px 12px", textTransform: "uppercase" }}>
                        TOTAL REALISASI DAPEN (Jan s.d Okt 2026)
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#38BDF8" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.tni || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#38BDF8" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.polri || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#4ADE80", fontSize: 13 }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.dapen.reduce((a, b) => a + (b.total || 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABEL 2: THT (3,25%) */}
          {(selectedOfficialProgram === "ALL" || selectedOfficialProgram === "THT") && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", background: "#F5F3FF", borderBottom: "1px solid #DDD6FE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#5B21B6" }}>
                    PENERIMAAN PREMI THT (3,25%) TAHUN 2026 — PT ASABRI (PERSERO)
                  </div>
                  <div style={{ fontSize: 11.5, color: "#7C3AED", marginTop: 2 }}>
                    Ketetapan SKP-PFK Kemenkeu RI &bull; 1 Surat Tagihan Resmi per Termin &bull; Pembagian Porsi TNI vs POLRI
                  </div>
                </div>
                <Btn size="xs" variant="outline" style={{ background: COLORS.white }} onClick={() => handleExportFormatResmi("THT")}>
                  <Download size={11} style={{ marginRight: 3 }} />
                  Ekspor THT (.xlsx)
                </Btn>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan / Termin Cut-off</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>No SKP</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl SKP</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Diterima</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Cair SP2D</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TNI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>POLRI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TOTAL (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENERIMAAN_DANA_EXCEL_DATA.tht.map((r, idx) => {
                      const isTermin1 = r.bulan.includes("01");
                      const hasData = r.total > 0;
                      return (
                        <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: !hasData ? "#FAFAFA" : (isTermin1 ? "#FFFFFF" : "#F8FAFC") }}>
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            <span style={{ display: "inline-block", padding: "2px 6px", borderRadius: 4, fontSize: 10.5, marginRight: 6, background: isTermin1 ? "#EDE9FE" : "#FEF3C7", color: isTermin1 ? "#6D28D9" : "#92400E", fontWeight: 800 }}>
                              {isTermin1 ? "s.d 01" : "s.d 10"}
                            </span>
                            {r.bulan}
                          </td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", color: hasData ? "#6D28D9" : COLORS.gray400 }}>{r.noSKP}</td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglSKP}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 10.5, color: hasData ? COLORS.gray800 : COLORS.gray400 }}>
                            {r.suratTagihan}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglSuratTagihan}</td>
                          <td style={{ padding: "9px 12px", color: hasData ? "#065F46" : COLORS.gray400 }}>{r.tglDiterima}</td>
                          <td style={{ padding: "9px 12px", fontWeight: 600, color: hasData ? "#15803D" : COLORS.gray400 }}>{r.tglCair}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            {hasData ? fmtB(r.tni) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            {hasData ? fmtB(r.polri) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: hasData ? "#7C3AED" : COLORS.gray400 }}>
                            {hasData ? fmtB(r.total) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#1E293B", color: COLORS.white, fontWeight: 800 }}>
                      <td colSpan={7} style={{ padding: "11px 12px", textTransform: "uppercase" }}>
                        TOTAL REALISASI THT (Jan s.d Okt 2026)
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#DDD6FE" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.tni || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#DDD6FE" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.polri || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#C084FC", fontSize: 13 }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.tht.reduce((a, b) => a + (b.total || 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABEL 3: JKK (0,62%) */}
          {(selectedOfficialProgram === "ALL" || selectedOfficialProgram === "JKK") && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#92400E" }}>
                    DAFTAR REALISASI PENERIMAAN IURAN JAMINAN KECELAKAAN KERJA (JKK) TAHUN ANGGARAN 2026
                  </div>
                  <div style={{ fontSize: 11.5, color: "#B45309", marginTop: 2 }}>
                    Dokumen Sumber: Nota Dinas (ND) Divisi Kepesertaan &bull; Siklus Bulanan + Penyesuaian Triwulan (Kekurangan TW I / II)
                  </div>
                </div>
                <Btn size="xs" variant="outline" style={{ background: COLORS.white }} onClick={() => handleExportFormatResmi("JKK")}>
                  <Download size={11} style={{ marginRight: 3 }} />
                  Ekspor JKK (.xlsx)
                </Btn>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, width: 45 }}>No</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan / Uraian</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>ND Kepesertaan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl ND</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Diterima</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Cair SP2D</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TNI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>POLRI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TOTAL (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENERIMAAN_DANA_EXCEL_DATA.jkk.map((r, idx) => {
                      const hasData = r.total !== 0;
                      return (
                        <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: r.isKekurangan ? "#FEF3C7" : (!hasData ? "#FAFAFA" : "#FFFFFF") }}>
                          <td style={{ padding: "9px 12px", textAlign: "center", color: COLORS.gray500, fontWeight: 700 }}>
                            {r.no || "—"}
                          </td>
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: r.isKekurangan ? "#92400E" : (hasData ? COLORS.gray900 : COLORS.gray400) }}>
                            {r.isKekurangan && (
                              <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, fontSize: 10, marginRight: 6, background: "#F59E0B", color: "#FFFFFF", fontWeight: 800 }}>
                                Penyesuaian TW
                              </span>
                            )}
                            {r.bulan}
                          </td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", color: hasData ? "#059669" : COLORS.gray400 }}>
                            {r.ndKepesertaan}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglND}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 10.5, color: hasData ? COLORS.gray800 : COLORS.gray400 }}>
                            {r.suratTagihan}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglSuratTagihan}</td>
                          <td style={{ padding: "9px 12px", color: hasData ? "#065F46" : COLORS.gray400 }}>{r.tglDiterima}</td>
                          <td style={{ padding: "9px 12px", fontWeight: 600, color: hasData ? "#15803D" : COLORS.gray400 }}>{r.tglCair}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            {hasData ? fmtB(r.tni) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? (r.polri < 0 ? "#DC2626" : COLORS.gray900) : COLORS.gray400 }}>
                            {hasData ? fmtB(r.polri) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: hasData ? "#B45309" : COLORS.gray400 }}>
                            {hasData ? fmtB(r.total) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#1E293B", color: COLORS.white, fontWeight: 800 }}>
                      <td colSpan={8} style={{ padding: "11px 12px", textTransform: "uppercase" }}>
                        JML REALISASI JKK (Jan s.d Des 2026)
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#FDE68A" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.tni || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#FDE68A" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.polri || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#FBBF24", fontSize: 13 }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.jkk.reduce((a, b) => a + (b.total || 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TABEL 4: JKM (0,81%) */}
          {(selectedOfficialProgram === "ALL" || selectedOfficialProgram === "JKM") && (
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", background: "#ECFDF5", borderBottom: "1px solid #A7F3D0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#065F46" }}>
                    DAFTAR REALISASI PENERIMAAN IURAN JAMINAN KEMATIAN (JKm) TAHUN ANGGARAN 2026
                  </div>
                  <div style={{ fontSize: 11.5, color: "#047857", marginTop: 2 }}>
                    Dokumen Sumber: Nota Dinas (ND) Divisi Kepesertaan &bull; Siklus Bulanan + Penyesuaian Triwulan (Kekurangan TW I / II)
                  </div>
                </div>
                <Btn size="xs" variant="outline" style={{ background: COLORS.white }} onClick={() => handleExportFormatResmi("JKM")}>
                  <Download size={11} style={{ marginRight: 3 }} />
                  Ekspor JKM (.xlsx)
                </Btn>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, width: 45 }}>No</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan / Uraian</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>ND Kepesertaan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl ND</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Tagihan</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Diterima</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tgl Cair SP2D</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TNI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>POLRI (Rp)</th>
                      <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>TOTAL (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENERIMAAN_DANA_EXCEL_DATA.jkm.map((r, idx) => {
                      const hasData = r.total !== 0;
                      return (
                        <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: r.isKekurangan ? "#ECFDF5" : (!hasData ? "#FAFAFA" : "#FFFFFF") }}>
                          <td style={{ padding: "9px 12px", textAlign: "center", color: COLORS.gray500, fontWeight: 700 }}>
                            {r.no || "—"}
                          </td>
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: r.isKekurangan ? "#065F46" : (hasData ? COLORS.gray900 : COLORS.gray400) }}>
                            {r.isKekurangan && (
                              <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, fontSize: 10, marginRight: 6, background: "#10B981", color: "#FFFFFF", fontWeight: 800 }}>
                                Penyesuaian TW
                              </span>
                            )}
                            {r.bulan}
                          </td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", color: hasData ? "#059669" : COLORS.gray400 }}>
                            {r.ndKepesertaan}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglND}</td>
                          <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 10.5, color: hasData ? COLORS.gray800 : COLORS.gray400 }}>
                            {r.suratTagihan}
                          </td>
                          <td style={{ padding: "9px 12px", color: hasData ? COLORS.gray700 : COLORS.gray400 }}>{r.tglSuratTagihan}</td>
                          <td style={{ padding: "9px 12px", color: hasData ? "#065F46" : COLORS.gray400 }}>{r.tglDiterima}</td>
                          <td style={{ padding: "9px 12px", fontWeight: 600, color: hasData ? "#15803D" : COLORS.gray400 }}>{r.tglCair}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? COLORS.gray900 : COLORS.gray400 }}>
                            {hasData ? fmtB(r.tni) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: hasData ? (r.polri < 0 ? "#DC2626" : COLORS.gray900) : COLORS.gray400 }}>
                            {hasData ? fmtB(r.polri) : "—"}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: hasData ? "#059669" : COLORS.gray400 }}>
                            {hasData ? fmtB(r.total) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#1E293B", color: COLORS.white, fontWeight: 800 }}>
                      <td colSpan={8} style={{ padding: "11px 12px", textTransform: "uppercase" }}>
                        JML REALISASI JKM (Jan s.d Des 2026)
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#A7F3D0" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.tni || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#A7F3D0" }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.polri || 0), 0))}
                      </td>
                      <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "monospace", color: "#34D399", fontSize: 13 }}>
                        {fmtB(PENERIMAAN_DANA_EXCEL_DATA.jkm.reduce((a, b) => a + (b.total || 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          KONTEN C: RIWAYAT DOKUMEN BAR SAH (ALL RECORDED MONTHS)
         ========================================================================= */}
      {activeSubtab === "history" && (
        <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", background: "#F8FAFC", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                Arsip Riwayat Berita Acara Rekonsiliasi (BAR) Sah DJPb Kemenkeu RI
              </div>
              <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 2 }}>
                Daftar dokumen BAR resmi per-bulan yang telah disahkan dan diarsipkan untuk kebutuhan audit
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#065F46", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>
              Audit-Ready Repository
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Periode Bulan</th>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nomor BAR Resmi</th>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Ketetapan SKP Kemenkeu</th>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Cair SP2D</th>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Total Nominal (Rp)</th>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Audit</th>
                  <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(monthlyStore)
                  .filter((m) => m.status === "selesai")
                  .map((item) => (
                    <tr key={item.monthKey} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                        {item.namaBulan}
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                        {item.noBAR}
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", color: COLORS.blue }}>
                        {item.noSKP}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {item.tglTerimaDana}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800 }}>
                        {fmtB(105280000000)}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#ECFDF5", color: "#065F46", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <CheckCircle2 size={12} color="#059669" />
                          BAR Sah & Terarsip
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <Btn size="xs" variant="primary" style={{ background: "#059669" }} onClick={() => openBARPreview({ noSKP: item.noSKP, tglSKP: item.tglSKP, tglTerimaDana: item.tglTerimaDana, noSP2D: item.noSP2D })}>
                          <FileCheck size={11} style={{ marginRight: 3 }} />
                          Cetak BAR
                        </Btn>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
