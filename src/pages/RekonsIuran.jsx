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
  SlidersHorizontal
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Table, Badge, Btn, PreviewModal, SatkerModal } from "../components/common";
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
  // 3 TAB PROGRAM UTAMA:
  // "THT_PENSIUN" : THT & Pensiun (SKP-PFK 8,00%) - Tagihan Dipisah Per Dana
  // "JKK"         : Jaminan Kecelakaan Kerja (0,24%)
  // "JKM"         : Jaminan Kematian (0,20%)
  const [activeProgram, setActiveProgram] = useState("THT_PENSIUN");

  // SUBTAB PER PROGRAM:
  // "komparasi"  : Komparasi Data Kepesertaan (1 tab saja, filter view: Secara Rekap / Secara Per-Matra)
  // "history"    : Riwayat Proses Selesai (The Complete Process & Berita Acara Rekonsiliasi)
  const [activeSubtab, setActiveSubtab] = useState("komparasi");

  // FILTER TAMPILAN PADA TAB KOMPARASI:
  // "rekap" | "per_matra"
  const [viewModeKomparasi, setViewModeKomparasi] = useState("rekap");
  const [filterJenisDana, setFilterJenisDana] = useState("Semua"); // "Semua" | "THT" | "PENSIUN"
  const [filterSubDana, setFilterSubDana] = useState("Semua"); // Nilai dinamis mengikuti Jenis Dana

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

  // State Filter & Search
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterGolongan, setFilterGolongan] = useState("Semua");
  const [filterDanaPFK, setFilterDanaPFK] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-09-30");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;

  // Preview Modal, Drilldown & Toast
  const [preview, setPreview] = useState(null);
  const [satkerModalData, setSatkerModalData] = useState(null);
  const [notice, setNotice] = useState(null);
  const [selectedMatraDetail, setSelectedMatraDetail] = useState(null);

  // State Modal Complete Process & Konfirmasi Selesai
  const [selectedCompleteProcess, setSelectedCompleteProcess] = useState(null);
  const [confirmCompleteItem, setConfirmCompleteItem] = useState(null);

  // Modal Input Realisasi Tagihan THT & Pensiun
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputError, setInputError] = useState("");
  const [inputForm, setInputForm] = useState({
    danaType: "THT_TNI",
    noSuratTagihan: "1194/KU.06.06/KMR.N/IX/2026",
    tglSuratTagihan: "15 September 2026",
    noSKP: "S-184/PB.2/2026",
    tglSKP: "14 September 2026",
    jenisIuran: "Iuran THT Prajurit TNI & ASN Kemhan",
    tglTerimaDana: "18 September 2026",
    noSP2D: "SP2D-260918-009412",
    bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
    nominalDanaSKP: "28540000000",
    peserta: "266150"
  });

  // Modal Input Realisasi Tagihan JKK & JKM
  const [showInputModalJKK, setShowInputModalJKK] = useState(false);
  const [inputErrorJKK, setInputErrorJKK] = useState("");
  const [inputFormJKK, setInputFormJKK] = useState({
    program: "JKK",
    noSuratTagihan: "",
    tglSuratTagihan: "",
    noNotaDinas: "",
    tglNotaDinas: "",
    tglTerimaDana: "",
    noSP2D: "",
    bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
    nominalTagihan: "",
    peserta: "14328"
  });

  const fmtB = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const fmtNum = (n) => Number(n || 0).toLocaleString("id-ID");

  // Tema warna per Program
  const currentTheme = {
    THT_PENSIUN: {
      primary: COLORS.blue,
      lightBg: "#EFF6FF",
      badgeBg: "#DBEAFE",
      badgeColor: "#1E40AF",
      title: "THT & Pensiun (SKP-PFK)",
      badgeText: "Tagihan Tunggal"
    },
    JKK: {
      primary: "#047857",
      lightBg: "#ECFDF5",
      badgeBg: "#D1FAE5",
      badgeColor: "#065F46",
      title: "Jaminan Kecelakaan Kerja (JKK)",
      badgeText: "Program JKK"
    },
    JKM: {
      primary: "#0D9488",
      lightBg: "#F0FDFA",
      badgeBg: "#CCFBF1",
      badgeColor: "#0F766E",
      title: "Jaminan Kematian (JKM)",
      badgeText: "Program JKM"
    }
  }[activeProgram];

  // =========================================================================
  // DATASET 1: MONITORING & HISTORY PENERIMAAN DANA SKP-PFK (THT & PENSIUN)
  // Dipisah per Dana: THT TNI, THT POLRI, Pensiun TNI, Pensiun POLRI
  // Format Nomor Surat: {NoUrut}/KU.06.06/KMR.N/{BulanRomawi}/{Tahun}
  // Total 4 Surat = Rp 105.280.000.000 (Sesuai SKP-PFK No. S-184/PB.2/2026)
  // =========================================================================
  const [monitoringSKPList, setMonitoringSKPList] = useState([
    {
      id: "SKP-PFK-THT-TNI",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      jenisIuran: "Iuran Tabungan Hari Tua (THT) TNI & ASN Kemhan",
      kodeTarif: "3,25% Gaji Pokok",
      tarif: "3,25%",
      peserta: 266150,
      matraUtama: "TNI & ASN Kemhan",
      noSuratTagihan: "1190/KU.06.06/KMR.N/IX/2026",
      tglSuratTagihan: "15 September 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "18 September 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260918-008921",
      nominalDanaSKP: 28540000000,
      danaTHT: 28540000000,
      danaPensiun: 0,
      nominalDiterima: 28540000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: SATKER_THT_TNI
    },
    {
      id: "SKP-PFK-THT-POLRI",
      danaType: "THT_POLRI",
      namaDana: "THT POLRI",
      jenisIuran: "Iuran Tabungan Hari Tua (THT) Anggota POLRI & PNS Polri",
      kodeTarif: "3,25% Gaji Pokok",
      tarif: "3,25%",
      peserta: 142200,
      matraUtama: "POLRI & PNS Polri",
      noSuratTagihan: "1191/KU.06.06/KMR.N/IX/2026",
      tglSuratTagihan: "15 September 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "18 September 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260918-008922",
      nominalDanaSKP: 14225000000,
      danaTHT: 14225000000,
      danaPensiun: 0,
      nominalDiterima: 14225000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: SATKER_THT_POLRI
    },
    {
      id: "SKP-PFK-PEN-TNI",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      jenisIuran: "Iuran Pensiun Prajurit TNI & ASN Kemhan",
      kodeTarif: "4,75% Gaji Pokok",
      tarif: "4,75%",
      peserta: 266150,
      matraUtama: "TNI & ASN Kemhan",
      noSuratTagihan: "1192/KU.06.06/KMR.N/IX/2026",
      tglSuratTagihan: "15 September 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "18 September 2026",
      bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260918-008923",
      nominalDanaSKP: 41710000000,
      danaTHT: 0,
      danaPensiun: 41710000000,
      nominalDiterima: 41710000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: SATKER_PENSIUN_TNI
    },
    {
      id: "SKP-PFK-PEN-POLRI",
      danaType: "PENSIUN_POLRI",
      namaDana: "Pensiun POLRI",
      jenisIuran: "Iuran Pensiun Anggota POLRI & PNS Polri",
      kodeTarif: "4,75% Gaji Pokok",
      tarif: "4,75%",
      peserta: 142200,
      matraUtama: "POLRI & PNS Polri",
      noSuratTagihan: "1193/KU.06.06/KMR.N/IX/2026",
      tglSuratTagihan: "15 September 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "18 September 2026",
      bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260918-008924",
      nominalDanaSKP: 20805000000,
      danaTHT: 0,
      danaPensiun: 20805000000,
      nominalDiterima: 20805000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: SATKER_PENSIUN_POLRI
    }
  ]);

  const [historySKPList, setHistorySKPList] = useState([
    {
      id: "HIST-SKP-1080",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      jenisIuran: "Tagihan Iuran THT Prajurit TNI & ASN Kemhan (Gaji Induk Juni 2026)",
      kodeTarif: "3,25% Gaji Pokok",
      tarif: "3,25%",
      peserta: 265800,
      matraUtama: "TNI & ASN Kemhan",
      noSuratTagihan: "1080/KU.06.06/KMR.N/VI/2026",
      tglSuratTagihan: "15 Juni 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-142/PB.2/2026",
      tglSKP: "14 Juni 2026",
      tglTerimaDana: "18 Juni 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260618-007140",
      nominalDanaSKP: 28420000000,
      danaTHT: 28420000000,
      danaPensiun: 0,
      nominalDiterima: 28420000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06A/REKON-THT-TNI/VI/2026",
      keterangan: "Proses rekonsiliasi tuntas 100%. Komparasi data kepesertaan cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit.",
      satkerList: SATKER_THT_TNI
    },
    {
      id: "HIST-SKP-1081",
      danaType: "THT_POLRI",
      namaDana: "THT POLRI",
      jenisIuran: "Tagihan Iuran THT Anggota POLRI & PNS Polri (Gaji Induk Juni 2026)",
      kodeTarif: "3,25% Gaji Pokok",
      tarif: "3,25%",
      peserta: 141900,
      matraUtama: "POLRI & PNS Polri",
      noSuratTagihan: "1081/KU.06.06/KMR.N/VI/2026",
      tglSuratTagihan: "15 Juni 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-142/PB.2/2026",
      tglSKP: "14 Juni 2026",
      tglTerimaDana: "18 Juni 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260618-007141",
      nominalDanaSKP: 14171000000,
      danaTHT: 14171000000,
      danaPensiun: 0,
      nominalDiterima: 14171000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06B/REKON-THT-POLRI/VI/2026",
      keterangan: "Proses rekonsiliasi tuntas 100%. Komparasi data kepesertaan cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit.",
      satkerList: SATKER_THT_POLRI
    },
    {
      id: "HIST-SKP-1082",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      jenisIuran: "Tagihan Iuran Pensiun Prajurit TNI & ASN Kemhan (Gaji Induk Juni 2026)",
      kodeTarif: "4,75% Gaji Pokok",
      tarif: "4,75%",
      peserta: 265800,
      matraUtama: "TNI & ASN Kemhan",
      noSuratTagihan: "1082/KU.06.06/KMR.N/VI/2026",
      tglSuratTagihan: "15 Juni 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-142/PB.2/2026",
      tglSKP: "14 Juni 2026",
      tglTerimaDana: "18 Juni 2026",
      bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260618-007142",
      nominalDanaSKP: 41537000000,
      danaTHT: 0,
      danaPensiun: 41537000000,
      nominalDiterima: 41537000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06C/REKON-PEN-TNI/VI/2026",
      keterangan: "Proses rekonsiliasi tuntas 100%. Komparasi data kepesertaan cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit.",
      satkerList: SATKER_PENSIUN_TNI
    },
    {
      id: "HIST-SKP-1083",
      danaType: "PENSIUN_POLRI",
      namaDana: "Pensiun POLRI",
      jenisIuran: "Tagihan Iuran Pensiun Anggota POLRI & PNS Polri (Gaji Induk Juni 2026)",
      kodeTarif: "4,75% Gaji Pokok",
      tarif: "4,75%",
      peserta: 141900,
      matraUtama: "POLRI & PNS Polri",
      noSuratTagihan: "1083/KU.06.06/KMR.N/VI/2026",
      tglSuratTagihan: "15 Juni 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-142/PB.2/2026",
      tglSKP: "14 Juni 2026",
      tglTerimaDana: "18 Juni 2026",
      bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260618-007143",
      nominalDanaSKP: 20722000000,
      danaTHT: 0,
      danaPensiun: 20722000000,
      nominalDiterima: 20722000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06D/REKON-PEN-POLRI/VI/2026",
      keterangan: "Proses rekonsiliasi tuntas 100%. Komparasi data kepesertaan cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit.",
      satkerList: SATKER_PENSIUN_POLRI
    }
  ]);

  // Handler Input Data Baru SKP-PFK dengan Validasi Kelengkapan Field
  const handleSaveNewSKP = (e) => {
    e.preventDefault();
    if (
      !inputForm.noSuratTagihan.trim() ||
      !inputForm.tglSuratTagihan.trim() ||
      !inputForm.noSKP.trim() ||
      !inputForm.tglSKP.trim() ||
      !inputForm.tglTerimaDana.trim() ||
      !inputForm.noSP2D.trim() ||
      !inputForm.nominalDanaSKP ||
      Number(inputForm.nominalDanaSKP) <= 0
    ) {
      setInputError("Semua field bertanda bintang (*) wajib diisi lengkap!");
      return;
    }

    const nom = Number(inputForm.nominalDanaSKP);
    const dType = inputForm.danaType || "THT_TNI";
    const isTHT = dType.startsWith("THT");
    const tarif = isTHT ? "3,25%" : "4,75%";
    const namaDana =
      dType === "THT_TNI" ? "THT TNI" :
      dType === "THT_POLRI" ? "THT POLRI" :
      dType === "PENSIUN_TNI" ? "Pensiun TNI" :
      "Pensiun POLRI";

    const baseSatker =
      dType === "THT_TNI" ? SATKER_THT_TNI :
      dType === "THT_POLRI" ? SATKER_THT_POLRI :
      dType === "PENSIUN_TNI" ? SATKER_PENSIUN_TNI :
      SATKER_PENSIUN_POLRI;

    const newRecord = {
      id: `SKP-${Date.now().toString().slice(-4)}`,
      danaType: dType,
      namaDana,
      jenisIuran: inputForm.jenisIuran,
      kodeTarif: `${tarif} Gaji Pokok`,
      tarif,
      peserta: Number(inputForm.peserta || (dType.includes("TNI") ? 266150 : 142200)),
      matraUtama: dType.includes("TNI") ? "TNI & ASN Kemhan" : "POLRI & PNS Polri",
      noSuratTagihan: inputForm.noSuratTagihan.trim(),
      tglSuratTagihan: inputForm.tglSuratTagihan.trim(),
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: inputForm.noSKP.trim(),
      tglSKP: inputForm.tglSKP.trim(),
      tglTerimaDana: inputForm.tglTerimaDana.trim(),
      bankTujuan: inputForm.bankTujuan,
      noSP2D: inputForm.noSP2D.trim(),
      nominalDanaSKP: nom,
      danaTHT: isTHT ? nom : 0,
      danaPensiun: isTHT ? 0 : nom,
      nominalDiterima: nom,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: generateProportionalSatkerList(nom, baseSatker, dType)
    };

    setMonitoringSKPList((prev) => [...prev, newRecord]);
    setShowInputModal(false);
    setInputError("");
    setInputForm({
      danaType: "THT_TNI",
      noSuratTagihan: "1194/KU.06.06/KMR.N/IX/2026",
      tglSuratTagihan: "15 September 2026",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      jenisIuran: "Iuran THT Prajurit TNI & ASN Kemhan",
      tglTerimaDana: "18 September 2026",
      noSP2D: "SP2D-260918-009412",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: "28540000000",
      peserta: "266150"
    });
    setNotice(`Data penerimaan dana ${newRecord.noSuratTagihan} (${namaDana}) berhasil dimasukkan ke dalam daftar monitoring!`);
    setTimeout(() => setNotice(null), 5000);
  };

  // =========================================================================
  // DATASET 2: MONITORING & HISTORY PENERIMAAN DANA JKK & JKM
  // Sesuai permintaan: Surat SKP diganti dengan Nota Dinas Kepesertaan
  // =========================================================================
  const [monitoringJKKList, setMonitoringJKKList] = useState([
    {
      id: "JKK-001",
      program: "JKK",
      jenisIuran: "Iuran Jaminan Kecelakaan Kerja (JKK)",
      kodeTarif: "0,24% Basis Gaji Pokok",
      matraUtama: "TNI, Kemhan & POLRI (14.328 Personel)",
      noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      noNotaDinas: "ND-342/KPS/VII/2026",
      tglNotaDinas: "24 Juli 2026",
      tglTerimaDana: "28 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260728-004128",
      nominalTagihan: 2630000000,
      nominalDiterima: 2630000000,
      peserta: 14328,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring"
    }
  ]);

  const [historyJKKList, setHistoryJKKList] = useState([
    {
      id: "HIST-JKK-001",
      program: "JKK",
      jenisIuran: "Iuran Jaminan Kecelakaan Kerja (JKK)",
      kodeTarif: "0,24% Basis Gaji Pokok",
      matraUtama: "TNI, Kemhan & POLRI (14.290 Personel)",
      noSuratTagihan: "099/ASABRI/TGH-JKK/VI/2026",
      tglSuratTagihan: "24 Juni 2026",
      noNotaDinas: "ND-289/KPS/VI/2026",
      tglNotaDinas: "23 Juni 2026",
      tglTerimaDana: "27 Juni 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260627-003891",
      nominalTagihan: 2615000000,
      nominalDiterima: 2615000000,
      peserta: 14290,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06/REKON-JKK/VI/2026",
      keterangan: "Realisasi SP2D 100% sesuai potensi DIPA Belanja Pegawai 6 Matra. BAR penetapan iuran JKK selesai."
    }
  ]);

  const [monitoringJKMList, setMonitoringJKMList] = useState([
    {
      id: "JKM-001",
      program: "JKM",
      jenisIuran: "Iuran Jaminan Kematian (JKM)",
      kodeTarif: "0,20% Basis Gaji Pokok",
      matraUtama: "TNI, Kemhan & POLRI (14.328 Personel)",
      noSuratTagihan: "003/ASABRI/TGH-JKM/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      noNotaDinas: "ND-343/KPS/VII/2026",
      tglNotaDinas: "24 Juli 2026",
      tglTerimaDana: "28 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260728-004129",
      nominalTagihan: 2210000000,
      nominalDiterima: 2210000000,
      peserta: 14328,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring"
    }
  ]);

  const [historyJKMList, setHistoryJKMList] = useState([
    {
      id: "HIST-JKM-001",
      program: "JKM",
      jenisIuran: "Iuran Jaminan Kematian (JKM)",
      kodeTarif: "0,20% Basis Gaji Pokok",
      matraUtama: "TNI, Kemhan & POLRI (14.290 Personel)",
      noSuratTagihan: "100/ASABRI/TGH-JKM/VI/2026",
      tglSuratTagihan: "24 Juni 2026",
      noNotaDinas: "ND-290/KPS/VI/2026",
      tglNotaDinas: "23 Juni 2026",
      tglTerimaDana: "27 Juni 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260627-003892",
      nominalTagihan: 2195000000,
      nominalDiterima: 2195000000,
      peserta: 14290,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06/REKON-JKM/VI/2026",
      keterangan: "Realisasi SP2D 100% sesuai potensi DIPA Belanja Pegawai 6 Matra. BAR penetapan iuran JKM selesai."
    }
  ]);

  // Handler Input Data Baru JKK / JKM dengan Validasi Kelengkapan Field
  const handleSaveNewJKK = (e) => {
    e.preventDefault();
    if (
      !inputFormJKK.noSuratTagihan.trim() ||
      !inputFormJKK.tglSuratTagihan.trim() ||
      !inputFormJKK.noNotaDinas.trim() ||
      !inputFormJKK.tglNotaDinas.trim() ||
      !inputFormJKK.tglTerimaDana.trim() ||
      !inputFormJKK.noSP2D.trim() ||
      !inputFormJKK.nominalTagihan ||
      Number(inputFormJKK.nominalTagihan) <= 0
    ) {
      setInputErrorJKK("Semua field bertanda bintang (*) wajib diisi lengkap!");
      return;
    }

    const nom = Number(inputFormJKK.nominalTagihan);
    const newRecord = {
      id: `${inputFormJKK.program}-${Date.now().toString().slice(-4)}`,
      program: inputFormJKK.program,
      jenisIuran: inputFormJKK.program === "JKK" ? "Iuran Jaminan Kecelakaan Kerja (JKK)" : "Iuran Jaminan Kematian (JKM)",
      kodeTarif: inputFormJKK.program === "JKK" ? "0,24% Basis Gaji Pokok" : "0,20% Basis Gaji Pokok",
      matraUtama: "TNI, Kemhan & POLRI",
      noSuratTagihan: inputFormJKK.noSuratTagihan.trim(),
      tglSuratTagihan: inputFormJKK.tglSuratTagihan.trim(),
      noNotaDinas: inputFormJKK.noNotaDinas.trim(),
      tglNotaDinas: inputFormJKK.tglNotaDinas.trim(),
      tglTerimaDana: inputFormJKK.tglTerimaDana.trim(),
      bankTujuan: inputFormJKK.bankTujuan,
      noSP2D: inputFormJKK.noSP2D.trim(),
      nominalTagihan: nom,
      nominalDiterima: nom,
      peserta: Number(inputFormJKK.peserta || 14328),
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring"
    };

    if (inputFormJKK.program === "JKK") {
      setMonitoringJKKList((prev) => [...prev, newRecord]);
    } else {
      setMonitoringJKMList((prev) => [...prev, newRecord]);
    }

    setShowInputModalJKK(false);
    setInputErrorJKK("");
    setInputFormJKK({
      program: activeProgram === "JKM" ? "JKM" : "JKK",
      noSuratTagihan: "",
      tglSuratTagihan: "",
      noNotaDinas: "",
      tglNotaDinas: "",
      tglTerimaDana: "",
      noSP2D: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalTagihan: "",
      peserta: "14328"
    });
    setNotice(`Data penerimaan dana ${newRecord.noSuratTagihan} berhasil dimasukkan ke dalam daftar monitoring!`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Handler Selesaikan Monitoring & Pindahkan ke Tab History
  const handleCompleteMonitoring = (item) => {
    const tglHariIni = "15 September 2026";
    const kodeProg = item.danaType ? item.danaType.replace("_", "-") : (activeProgram === "THT_PENSIUN" ? "PFK" : activeProgram);
    const noUrutBar = Math.floor(Math.random() * 80) + 10;
    const noBARBaru = `BAR-${noUrutBar}/REKON-${kodeProg}/IX/2026`;

    if (activeProgram === "THT_PENSIUN") {
      setMonitoringSKPList((prev) => prev.filter((x) => x.id !== item.id));
      setHistorySKPList((prev) => [
        {
          ...item,
          statusProses: "Selesai (Completed)",
          tglSelesai: tglHariIni,
          noBAR: noBARBaru,
          keterangan: `Proses rekonsiliasi dan monitoring surat tagihan ${item.namaDana || "Dana PFK"} tuntas 100%. Komparasi data kepesertaan cocok dan Berita Acara Rekonsiliasi (BAR) telah diterbitkan bersama DJPb Kemenkeu RI.`
        },
        ...prev
      ]);
    } else if (activeProgram === "JKK") {
      setMonitoringJKKList((prev) => prev.filter((x) => x.id !== item.id));
      setHistoryJKKList((prev) => [
        {
          ...item,
          statusProses: "Selesai (Completed)",
          tglSelesai: tglHariIni,
          noBAR: noBARBaru,
          keterangan: "Proses rekonsiliasi JKK telah selesai 100%. Realisasi kas SP2D sesuai penetapan Nota Dinas Kepesertaan dan BAR telah terbit."
        },
        ...prev
      ]);
    } else {
      setMonitoringJKMList((prev) => prev.filter((x) => x.id !== item.id));
      setHistoryJKMList((prev) => [
        {
          ...item,
          statusProses: "Selesai (Completed)",
          tglSelesai: tglHariIni,
          noBAR: noBARBaru,
          keterangan: "Proses rekonsiliasi JKM telah selesai 100%. Realisasi kas SP2D sesuai penetapan Nota Dinas Kepesertaan dan BAR telah terbit."
        },
        ...prev
      ]);
    }

    setConfirmCompleteItem(null);
    setNotice(`Proses monitoring ${item.noSuratTagihan} (${item.namaDana || activeProgram}) berhasil diselesaikan! Dokumen tersimpan di Tab History dengan Berita Acara: ${noBARBaru}.`);
    setTimeout(() => setNotice(null), 6000);
  };

  // Helper Preview Surat Tagihan
  const openSuratTagihanPreview = (item) => {
    if (activeProgram === "THT_PENSIUN") {
      const isTHT = item.danaType === "THT_TNI" || item.danaType === "THT_POLRI";
      const isPensiun = item.danaType === "PENSIUN_TNI" || item.danaType === "PENSIUN_POLRI";

      let items = [];
      if (isTHT) {
        items = [
          { jenis: `Iuran Tabungan Hari Tua (${item.tarif || "3,25%"})`, peserta: `${fmtNum(item.peserta || 266150)} Personel`, nominal: fmtB(item.nominalDanaSKP || item.danaTHT) }
        ];
      } else if (isPensiun) {
        items = [
          { jenis: `Iuran Pensiun (${item.tarif || "4,75%"})`, peserta: `${fmtNum(item.peserta || 266150)} Personel`, nominal: fmtB(item.nominalDanaSKP || item.danaPensiun) }
        ];
      } else {
        items = [
          { jenis: "Iuran THT (3,25%)", peserta: `${fmtNum(item.peserta || 427620)} Personel`, nominal: fmtB(item.danaTHT) },
          { jenis: "Iuran Pensiun (4,75%)", peserta: `${fmtNum(item.peserta || 427620)} Personel`, nominal: fmtB(item.danaPensiun) }
        ];
      }

      const namaDana = item.namaDana || (isTHT ? (isPolri ? "THT POLRI" : "THT TNI") : (isPolri ? "Pensiun POLRI" : "Pensiun TNI"));

      setPreview({
        title: `Surat Tagihan Iuran ${namaDana} — ${item.noSuratTagihan}`,
        subtitle: `Format Resmi Kemenkeu RI (3 Halaman) • Satker (440780)`,
        type: "surat_kemenkeu",
        fileName: `Surat_Tagihan_${namaDana.replace(/[^a-zA-Z0-9]/g, "_")}_${item.noSuratTagihan.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          program: namaDana,
          noSurat: item.noSuratTagihan,
          tanggalSurat: item.tglSuratTagihan || "Oktober 2024",
          tglCutoff: item.tglCutoff || "10 Oktober 2024",
          noKEP: item.noSKP || "KEP-41/PB/PB.3/2024",
          tglKEP: item.tglSKP || "14 Oktober 2024",
          tahunAnggaran: "2024",
          nominalNum: item.nominalDanaSKP || (isTHT ? 1121913428 : 20805000000),
          nominalLalu: isTHT ? 1059518554039 : 812490210000,
          noBukti: isTHT ? (isPolri ? "22/PFK.THT-POLRI/X/2024-Keu" : "21/PFK.THT-AS/X/2024-Keu") : (isPolri ? "23/PFK.PEN-POLRI/X/2024-Keu" : "24/PFK.PEN-TNI/X/2024-Keu"),
          namaRekening: isTHT ? "THT Umum ASABRI" : "Pensiun ASABRI",
          noRekening: isTHT ? "0261-01-000004-30-9" : "0261-01-000005-30-5",
          namaBank: "BRI Kantor Cabang Jakarta Krekot",
          namaDirektur: "HELMI I. SATRIYONO",
          jabatanDirektur: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaPPK: "Nazif Azhari",
          isPFKKemenkeu: true,
          satkerList: item.satkerList || SATKER_THT_PENSIUN_ALL
        }
      });
    } else {
      const prog = activeProgram;
      setPreview({
        title: `Surat Tagihan Iuran ${prog} — ${item.noSuratTagihan}`,
        subtitle: `Kemenkeu RI / KPPN Khusus Jakarta II • Periode Juli 2026`,
        type: "surat",
        fileName: `Surat_Tagihan_${prog}_${item.noSuratTagihan.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          noSurat: item.noSuratTagihan,
          tanggal: item.tglSuratTagihan,
          items: [
            {
              jenis: prog === "JKK" ? "Iuran JKK (0,24%)" : "Iuran JKM (0,20%)",
              peserta: `${fmtNum(item.peserta || 14328)} Jiwa`,
              nominal: fmtB(item.nominalTagihan || item.nominalDiterima)
            }
          ],
          totalNominal: fmtB(item.nominalTagihan || item.nominalDiterima)
        }
      });
    }
  };

  // Helper Preview Berita Acara Rekonsiliasi (BAR)
  const openBARPreview = (item) => {
    const progTitle =
      activeProgram === "JKK"
        ? "Jaminan Kecelakaan Kerja (JKK 0,24%)"
        : activeProgram === "JKM"
        ? "Jaminan Kematian (JKM 0,20%)"
        : item.namaDana
        ? `Iuran ${item.namaDana} (SKP-PFK Kemenkeu)`
        : "THT dan Pensiun (SKP-PFK 8,00%)";

    const dokDasar =
      activeProgram === "THT_PENSIUN"
        ? `Surat SKP-PFK Kemenkeu No. ${item.noSKP} (Tgl: ${item.tglSKP})`
        : `Nota Dinas Kepesertaan No. ${item.noNotaDinas} (Tgl: ${item.tglNotaDinas})`;

    setPreview({
      title: `Berita Acara Rekonsiliasi (BAR) — ${item.noBAR || "BAR-01/REKON-IURAN/2026"}`,
      subtitle: `Penetapan Bersama PT ASABRI (Persero) & Ditjen Perbendaharaan Kemenkeu RI`,
      type: "bar",
      fileName: `BAR_${(item.noBAR || "BAR-01").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
      content: {
        noBAR: item.noBAR || "BAR-01/REKON-IURAN/2026",
        hariTanggal: item.tglSelesai ? `Selasa, ${item.tglSelesai}` : "Selasa, 15 September 2026",
        programJudul: progTitle.toUpperCase(),
        periode: "September 2026",
        noSuratTagihan: item.noSuratTagihan,
        dokumenDasar: dokDasar,
        noSP2D: item.noSP2D,
        tglSP2D: item.tglTerimaDana,
        bankTujuan: item.bankTujuan,
        nominal: fmtB(item.nominalDanaSKP || item.nominalDiterima || item.nominalTagihan)
      }
    });
  };

  // =========================================================================
  // DATASET KOMPARASI 4 DANA: THT TNI, THT POLRI, PENSIUN TNI, PENSIUN POLRI
  // =========================================================================
  const rekapSKPData = [
    {
      id: "REKAP-THT-TNI",
      danaType: "THT_TNI",
      pilar: "THT TNI",
      namaDana: "THT TNI",
      noSurat: "1190/KU.06.06/KMR.N/IX/2026",
      noSKP: "S-184/PB.2/2026",
      deskripsi: "Iuran Tabungan Hari Tua (THT) Prajurit TNI & ASN Kemhan",
      matra: "TNI AD, AL, AU, PNS & PPPK Kemhan",
      tarif: "3,25%",
      pesertaSistem: 285420,
      nominalSistem: 28526460000,
      pesertaSKP: 285500,
      nominalSKP: 28540000000,
      selisihNominal: -13540000,
      persenSelisih: -0.05,
      analisis: "Potongan 3,25% TNI AD, AU, dan Kemhan 100% cocok. Selisih 80 personel mutasi Koarmada II TNI AL dalam proses pemadanan SK.",
      statusRekap: "Selisih Mutasi (-80)",
      badgeColor: "yellow"
    },
    {
      id: "REKAP-THT-POLRI",
      danaType: "THT_POLRI",
      pilar: "THT POLRI",
      namaDana: "THT POLRI",
      noSurat: "1191/KU.06.06/KMR.N/IX/2026",
      noSKP: "S-184/PB.2/2026",
      deskripsi: "Iuran Tabungan Hari Tua (THT) Anggota POLRI & PNS Polri",
      matra: "POLRI & PNS Polri",
      tarif: "3,25%",
      pesertaSistem: 142200,
      nominalSistem: 14225000000,
      pesertaSKP: 142200,
      nominalSKP: 14225000000,
      selisihNominal: 0,
      persenSelisih: 0,
      analisis: "Data potongan THT 3,25% personel POLRI cocok 100% dengan penetapan SKP-PFK Kemenkeu RI tanpa selisih.",
      statusRekap: "Match (100%)",
      badgeColor: "green"
    },
    {
      id: "REKAP-PEN-TNI",
      danaType: "PENSIUN_TNI",
      pilar: "Pensiun TNI",
      namaDana: "Pensiun TNI",
      noSurat: "1192/KU.06.06/KMR.N/IX/2026",
      noSKP: "S-184/PB.2/2026",
      deskripsi: "Iuran Pensiun Prajurit TNI & ASN Kemhan",
      matra: "TNI AD, AL, AU, PNS & PPPK Kemhan",
      tarif: "4,75%",
      pesertaSistem: 285420,
      nominalSistem: 41673540000,
      pesertaSKP: 285500,
      nominalSKP: 41710000000,
      selisihNominal: -36460000,
      persenSelisih: -0.09,
      analisis: "Potongan 4,75% TNI AD, AU, dan Kemhan tuntas. Selisih 80 personel mutasi Koarmada II TNI AL pada pilar pensiun sedang divalidasi.",
      statusRekap: "Selisih Mutasi (-80)",
      badgeColor: "yellow"
    },
    {
      id: "REKAP-PEN-POLRI",
      danaType: "PENSIUN_POLRI",
      pilar: "Pensiun POLRI",
      namaDana: "Pensiun POLRI",
      noSurat: "1193/KU.06.06/KMR.N/IX/2026",
      noSKP: "S-184/PB.2/2026",
      deskripsi: "Iuran Pensiun Anggota POLRI & PNS Polri",
      matra: "POLRI & PNS Polri",
      tarif: "4,75%",
      pesertaSistem: 142200,
      nominalSistem: 20805000000,
      pesertaSKP: 142200,
      nominalSKP: 20805000000,
      selisihNominal: 0,
      persenSelisih: 0,
      analisis: "Potongan 4,75% POLRI tervalidasi 100% cocok dengan penetapan SKP-PFK DJPb Kemenkeu.",
      statusRekap: "Match (100%)",
      badgeColor: "green"
    }
  ];

  const bnbaMatraData = [
    // 1. THT TNI (3,25%)
    {
      id: "BNBA-THT-01",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      tarif: "3,25%",
      matra: "TNI AD",
      jenisIuran: "THT TNI (3,25%)",
      pesertaSistem: 154200,
      nominalSistem: 15417187500,
      pesertaBNBA: 154200,
      nominalBNBA: 15417187500,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Seluruh 154.200 personel TNI AD terpetakan by NRP & potongan THT 3,25% sesuai penuh."
    },
    {
      id: "BNBA-THT-02",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      tarif: "3,25%",
      matra: "TNI AL",
      jenisIuran: "THT TNI (3,25%)",
      pesertaSistem: 68450,
      nominalSistem: 6827031250,
      pesertaBNBA: 68530,
      nominalBNBA: 6847331250,
      selisihJiwa: -80,
      selisihNominal: -20300000,
      status: "Selisih Mutasi",
      catatan: "80 personel mutasi masuk Koarmada II sedang dalam proses pemadanan SK THT."
    },
    {
      id: "BNBA-THT-03",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      tarif: "3,25%",
      matra: "TNI AU",
      jenisIuran: "THT TNI (3,25%)",
      pesertaSistem: 42150,
      nominalSistem: 4216875000,
      pesertaBNBA: 42150,
      nominalBNBA: 4216875000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Data prajurit Lanud & Kohanudnas potongan THT 3,25% tervalidasi."
    },
    {
      id: "BNBA-THT-04A",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      tarif: "3,25%",
      matra: "PNS Kemhan",
      jenisIuran: "THT TNI (3,25%)",
      pesertaSistem: 16500,
      nominalSistem: 1652666250,
      pesertaBNBA: 16500,
      nominalBNBA: 1652666250,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "PNS Kemhan terintegrasi NIP & potongan THT 3,25% BKN-Kemenkeu."
    },
    {
      id: "BNBA-THT-04B",
      danaType: "THT_TNI",
      namaDana: "THT TNI",
      tarif: "3,25%",
      matra: "PPPK Kemhan",
      jenisIuran: "THT TNI (3,25%)",
      pesertaSistem: 4120,
      nominalSistem: 412700000,
      pesertaBNBA: 4120,
      nominalBNBA: 412700000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "PPPK Kemhan terintegrasi NI PPPK & potongan THT 3,25% BKN-Kemenkeu."
    },

    // 2. THT POLRI (3,25%)
    {
      id: "BNBA-THT-05",
      danaType: "THT_POLRI",
      namaDana: "THT POLRI",
      tarif: "3,25%",
      matra: "POLRI",
      jenisIuran: "THT POLRI (3,25%)",
      pesertaSistem: 142200,
      nominalSistem: 14225000000,
      pesertaBNBA: 142200,
      nominalBNBA: 14225000000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Seluruh Polda & Mabes Polri cocok dengan penetapan THT 3,25% Gaji Web Polri."
    },

    // 3. Pensiun TNI (4,75%)
    {
      id: "BNBA-PEN-01",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      tarif: "4,75%",
      matra: "TNI AD",
      jenisIuran: "Pensiun TNI (4,75%)",
      pesertaSistem: 154200,
      nominalSistem: 22532812500,
      pesertaBNBA: 154200,
      nominalBNBA: 22532812500,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Seluruh personel TNI AD potongan Pensiun 4,75% sesuai penuh."
    },
    {
      id: "BNBA-PEN-02",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      tarif: "4,75%",
      matra: "TNI AL",
      jenisIuran: "Pensiun TNI (4,75%)",
      pesertaSistem: 68450,
      nominalSistem: 9977968750,
      pesertaBNBA: 68530,
      nominalBNBA: 10007668750,
      selisihJiwa: -80,
      selisihNominal: -29700000,
      status: "Selisih Mutasi",
      catatan: "80 personel mutasi Koarmada II pilar pensiun 4,75% dalam rekonsiliasi."
    },
    {
      id: "BNBA-PEN-03",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      tarif: "4,75%",
      matra: "TNI AU",
      jenisIuran: "Pensiun TNI (4,75%)",
      pesertaSistem: 42150,
      nominalSistem: 6163125000,
      pesertaBNBA: 42150,
      nominalBNBA: 6163125000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Data personel TNI AU potongan Pensiun 4,75% cocok."
    },
    {
      id: "BNBA-PEN-04A",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      tarif: "4,75%",
      matra: "PNS Kemhan",
      jenisIuran: "Pensiun TNI (4,75%)",
      pesertaSistem: 16500,
      nominalSistem: 2403903750,
      pesertaBNBA: 16500,
      nominalBNBA: 2403903750,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "PNS Kemhan potongan Pensiun 4,75% tervalidasi."
    },
    {
      id: "BNBA-PEN-04B",
      danaType: "PENSIUN_TNI",
      namaDana: "Pensiun TNI",
      tarif: "4,75%",
      matra: "PPPK Kemhan",
      jenisIuran: "Pensiun TNI (4,75%)",
      pesertaSistem: 4120,
      nominalSistem: 600730000,
      pesertaBNBA: 4120,
      nominalBNBA: 600730000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "PPPK Kemhan potongan Pensiun 4,75% tervalidasi."
    },

    // 4. Pensiun POLRI (4,75%)
    {
      id: "BNBA-PEN-05",
      danaType: "PENSIUN_POLRI",
      namaDana: "Pensiun POLRI",
      tarif: "4,75%",
      matra: "POLRI",
      jenisIuran: "Pensiun POLRI (4,75%)",
      pesertaSistem: 142200,
      nominalSistem: 20805000000,
      pesertaBNBA: 142200,
      nominalBNBA: 20805000000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Seluruh jajaran POLRI potongan Pensiun 4,75% cocok 100%."
    }
  ];

  const sampleBNBADetail = [
    { nrp: "31080194820188", nama: "Kapten Laut (T) Bambang Suryadi", pangkat: "Kapten", satker: "Koarmada II (TNI AL)", gapok: 4250000, tht: 138125, pensiun: 201875, totalPotongan: 340000, status: "Cocok (API Kemenkeu)" },
    { nrp: "31090284710291", nama: "Lettu Laut (P) Dimas Arya", pangkat: "Lettu", satker: "KRI Frans Kaisiepo-368", gapok: 3820000, tht: 124150, pensiun: 181450, totalPotongan: 305600, status: "Cocok (API Kemenkeu)" },
    { nrp: "31110398471099", nama: "Serka Nav Hendra Pratama", pangkat: "Serka", satker: "Lantamal V Surabaya", gapok: 3410000, tht: 110825, pensiun: 161975, totalPotongan: 272800, status: "Mutasi Masuk (Perlu SK)" },
    { nrp: "31120489510103", nama: "Kopda Bah Faisal Reza", pangkat: "Kopda", satker: "Koarmada II (TNI AL)", gapok: 2980000, tht: 96850, pensiun: 141550, totalPotongan: 238400, status: "Mutasi Masuk (Perlu SK)" },
    { nrp: "31070081290382", nama: "Mayor Cba Hendrawan", pangkat: "Mayor", satker: "Bekangdam Jaya (TNI AD)", gapok: 4890000, tht: 158925, pensiun: 232275, totalPotongan: 391200, status: "Cocok (API Kemenkeu)" },
    { nrp: "198504122010011002", nama: "Penata Tk.I Agus Priyono, S.Sos", pangkat: "Penata Tk.I (PNS)", satker: "Ditjen Renhan Kemhan (PNS)", gapok: 3850000, tht: 125125, pensiun: 182875, totalPotongan: 308000, status: "Cocok (API Kemenkeu)" },
    { nrp: "199408252024211001", nama: "Dian Wahyuni, S.Kom", pangkat: "Ahli Pertama (PPPK)", satker: "Pusdatin Kemhan (PPPK)", gapok: 3600000, tht: 117000, pensiun: 171000, totalPotongan: 288000, status: "Cocok (API Kemenkeu)" }
  ];

  // =========================================================================
  // DATASET KOMPARASI JKK & JKM
  // =========================================================================
  const rekapJKKData = [
    { program: "Jaminan Kecelakaan Kerja (JKK)", tarif: "0,24%", noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026", peserta: 14328, nominalPotensi: 2630000000, nominalRealisasi: 2630000000, selisih: 0, status: "Terverifikasi Lunas (100%)", analisis: "Seluruh alokasi iuran JKK dari 6 Matra telah disalurkan penuh oleh Kemenkeu sesuai SP2D-260728-004128." },
    { program: "Jaminan Kematian (JKM)", tarif: "0,20%", noSuratTagihan: "003/ASABRI/TGH-JKM/VII/2026", peserta: 14328, nominalPotensi: 2210000000, nominalRealisasi: 2210000000, selisih: 0, status: "Terverifikasi Lunas (100%)", analisis: "Seluruh alokasi iuran JKM dari 6 Matra telah disalurkan penuh oleh Kemenkeu sesuai SP2D-260728-004129." }
  ];

  const komparasiJKKMatraData = [
    { id: "KOMP-JKK-01", matra: "TNI AD", peserta: 3250, gapokTotal: 260000000000, nominalJKKSistem: 624000000, nominalJKMSistem: 520000000, realisasiKasJKK: 624000000, realisasiKasJKM: 520000000, selisih: 0, status: "Match (100%)", catatan: "SP2D KPPN sesuai alokasi DIPA Belanja Pegawai TNI AD." },
    { id: "KOMP-JKK-02", matra: "TNI AL", peserta: 1420, gapokTotal: 113600000000, nominalJKKSistem: 272640000, nominalJKMSistem: 227200000, realisasiKasJKK: 272640000, realisasiKasJKM: 227200000, selisih: 0, status: "Match (100%)", catatan: "Lunas tervalidasi KPPN Khusus Jakarta II." },
    { id: "KOMP-JKK-03", matra: "TNI AU", peserta: 1180, gapokTotal: 94400000000, nominalJKKSistem: 226560000, nominalJKMSistem: 188800000, realisasiKasJKK: 226560000, realisasiKasJKM: 188800000, selisih: 0, status: "Match (100%)", catatan: "Lunas tervalidasi KPPN Khusus Jakarta II." },
    { id: "KOMP-JKK-04A", matra: "PNS Kemhan", peserta: 400, gapokTotal: 32000000000, nominalJKKSistem: 76800000, nominalJKMSistem: 64000000, realisasiKasJKK: 76800000, realisasiKasJKM: 64000000, selisih: 0, status: "Match (100%)", catatan: "Sesuai potongan belanja pegawai satker PNS Kemhan Pusat." },
    { id: "KOMP-JKK-04B", matra: "PPPK Kemhan", peserta: 120, gapokTotal: 9600000000, nominalJKKSistem: 23040000, nominalJKMSistem: 19200000, realisasiKasJKK: 23040000, realisasiKasJKM: 19200000, selisih: 0, status: "Match (100%)", catatan: "Sesuai potongan belanja pegawai satker PPPK Kemhan Pusat." },
    { id: "KOMP-JKK-05", matra: "POLRI", peserta: 7958, gapokTotal: 586200000000, nominalJKKSistem: 1406960000, nominalJKMSistem: 1190760000, realisasiKasJKK: 1406960000, realisasiKasJKM: 1190760000, selisih: 0, status: "Match (100%)", catatan: "Lunas 100% SP2D Kemenkeu ke giro penampungan Mandiri." }
  ];

  // Filtering Monitoring per Program
  const filteredMonitoringSKP = monitoringSKPList.filter((item) => {
    if (filterDanaPFK !== "Semua" && item.danaType !== filterDanaPFK) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchSurat = item.noSuratTagihan.toLowerCase().includes(q);
      const matchSKP = item.noSKP.toLowerCase().includes(q);
      const matchJenis = item.jenisIuran.toLowerCase().includes(q);
      const matchNama = item.namaDana?.toLowerCase().includes(q);
      if (!matchSurat && !matchSKP && !matchJenis && !matchNama) return false;
    }
    return true;
  });

  const filteredMonitoringJKKOnly = monitoringJKKList.filter((item) => {
    if (searchTerm && !item.noSuratTagihan.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noNotaDinas?.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noSP2D.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredMonitoringJKMOnly = monitoringJKMList.filter((item) => {
    if (searchTerm && !item.noSuratTagihan.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noNotaDinas?.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noSP2D.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Filtering History per Program
  const filteredHistorySKP = historySKPList.filter((item) => {
    if (filterDanaPFK !== "Semua" && item.danaType !== filterDanaPFK) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchSurat = item.noSuratTagihan.toLowerCase().includes(q);
      const matchSKP = item.noSKP.toLowerCase().includes(q);
      const matchBAR = item.noBAR?.toLowerCase().includes(q);
      const matchNama = item.namaDana?.toLowerCase().includes(q);
      if (!matchSurat && !matchSKP && !matchBAR && !matchNama) return false;
    }
    return true;
  });

  const filteredHistoryJKK = historyJKKList.filter((item) => {
    if (searchTerm && !item.noSuratTagihan.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noNotaDinas?.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noBAR?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredHistoryJKM = historyJKMList.filter((item) => {
    if (searchTerm && !item.noSuratTagihan.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noNotaDinas?.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noBAR?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const currentMonitoringCount =
    activeProgram === "THT_PENSIUN"
      ? filteredMonitoringSKP.length
      : activeProgram === "JKK"
      ? filteredMonitoringJKKOnly.length
      : filteredMonitoringJKMOnly.length;

  const currentHistoryCount =
    activeProgram === "THT_PENSIUN"
      ? filteredHistorySKP.length
      : activeProgram === "JKK"
      ? filteredHistoryJKK.length
      : filteredHistoryJKM.length;

  // Helper Opsi & Konversi Golongan
  const GOLONGAN_OPTIONS = [
    { key: "Semua", label: "Semua Golongan & Pangkat" },
    { key: "PATI_PAMEN", label: "Perwira Tinggi & Menengah (Pati/Pamen)" },
    { key: "PAMA", label: "Perwira Pertama (Pama)" },
    { key: "BINTARA_TAMTAMA", label: "Bintara & Tamtama (Ba/Ta)" },
    { key: "PNS_GOL", label: "PNS Kemhan/Polri (Gol I - IV)" },
    { key: "PPPK", label: "PPPK (Pegawai Pemerintah dg Perjanjian Kerja)" }
  ];

  const getGolonganRatio = (gol) => {
    switch (gol) {
      case "PATI_PAMEN":
        return { peserta: 0.12, nominal: 0.22, label: "Perwira (Pati/Pamen)" };
      case "PAMA":
        return { peserta: 0.16, nominal: 0.18, label: "Perwira Pertama (Pama)" };
      case "BINTARA_TAMTAMA":
        return { peserta: 0.62, nominal: 0.52, label: "Bintara & Tamtama" };
      case "PNS_GOL":
        return { peserta: 0.08, nominal: 0.06, label: "PNS Gol I-IV" };
      case "PPPK":
        return { peserta: 0.02, nominal: 0.02, label: "PPPK" };
      default:
        return { peserta: 1, nominal: 1, label: "Semua Golongan" };
    }
  };

  const getSatkerLabel = (s = filterSatker) => {
    switch (s) {
      case "TNI":
      case "TNI_ALL": return "TNI";
      case "POLRI":
      case "POLRI_ALL": return "POLRI";
      case "KEMHAN_ALL": return "Kemhan (PNS & PPPK)";
      case "Semua": return "Semua Satker";
      default: return s;
    }
  };

  const getMatraLabel = getSatkerLabel;

  const getDanaLabel = (sub = filterSubDana, jenis = filterJenisDana) => {
    if (activeProgram === "THT_PENSIUN") {
      if (jenis === "THT") {
        if (sub === "THT_TNI") return "THT TNI";
        if (sub === "THT_POLRI") return "THT POLRI";
        return "Semua Dana THT";
      }
      if (jenis === "PENSIUN") {
        if (sub === "PENSIUN_TNI") return "Pensiun TNI";
        if (sub === "PENSIUN_POLRI") return "Pensiun POLRI";
        return "Semua Dana Pensiun";
      }
      if (sub === "THT_TNI") return "THT TNI";
      if (sub === "THT_POLRI") return "THT POLRI";
      if (sub === "PENSIUN_TNI") return "Pensiun TNI";
      if (sub === "PENSIUN_POLRI") return "Pensiun POLRI";
      if (sub === "THT_ALL") return "Semua Dana THT";
      if (sub === "PENSIUN_ALL") return "Semua Dana Pensiun";
      return "4 Dana (THT & Pensiun)";
    } else if (activeProgram === "JKK") {
      if (sub === "JKK_TNI") return "JKK TNI";
      if (sub === "JKK_POLRI") return "JKK POLRI";
      return "Semua JKK";
    } else {
      if (sub === "JKM_TNI") return "JKM TNI";
      if (sub === "JKM_POLRI") return "JKM POLRI";
      return "Semua JKM";
    }
  };

  const getGolonganLabel = (g) => {
    const it = GOLONGAN_OPTIONS.find(x => x.key === g);
    return it ? it.label : g;
  };

  const getFilterSummaryText = () => {
    const dLabel = getDanaLabel();
    const sLabel = getSatkerLabel(filterSatker);
    const gLabel = getGolonganLabel(filterGolongan);
    const modeLabel = viewModeKomparasi === "rekap" ? "Secara Rekap (Makro)" : "Secara Per-Matra (BNBA)";
    return `Program/Dana: ${dLabel} • Satker: ${sLabel} • Golongan: ${gLabel} • Tampilan: ${modeLabel}`;
  };

  // Filter Rekap SKP 4 Dana (THT/Pensiun)
  const filteredRekapSKP = rekapSKPData.filter((item) => {
    // 1. Filter Jenis Dana & Sub-Dana
    if (filterJenisDana === "THT" && !item.danaType.startsWith("THT")) return false;
    if (filterJenisDana === "PENSIUN" && !item.danaType.startsWith("PENSIUN")) return false;

    if (filterSubDana === "THT_ALL" && !item.danaType.startsWith("THT")) return false;
    if (filterSubDana === "PENSIUN_ALL" && !item.danaType.startsWith("PENSIUN")) return false;
    if (filterSubDana === "THT_TNI" && item.danaType !== "THT_TNI") return false;
    if (filterSubDana === "THT_POLRI" && item.danaType !== "THT_POLRI") return false;
    if (filterSubDana === "PENSIUN_TNI" && item.danaType !== "PENSIUN_TNI") return false;
    if (filterSubDana === "PENSIUN_POLRI" && item.danaType !== "PENSIUN_POLRI") return false;

    // 2. Filter Satker (TNI vs POLRI)
    if ((filterSatker === "TNI" || filterSatker === "TNI_ALL") && item.danaType.includes("POLRI")) return false;
    if ((filterSatker === "POLRI" || filterSatker === "POLRI_ALL") && item.danaType.includes("TNI")) return false;
    if (filterSatker === "KEMHAN_ALL" && item.danaType.includes("POLRI")) return false;
    if ((filterSatker === "TNI AD" || filterSatker === "TNI AL" || filterSatker === "TNI AU" || filterSatker === "PNS Kemhan" || filterSatker === "PPPK Kemhan") && item.danaType.includes("POLRI")) return false;
    if (filterSatker === "POLRI" && item.danaType.includes("TNI")) return false;

    return true;
  }).map((item) => {
    if (filterGolongan === "Semua") return item;
    const g = getGolonganRatio(filterGolongan);
    const pSistem = Math.round(item.pesertaSistem * g.peserta);
    const nSistem = Math.round(item.nominalSistem * g.nominal);
    const pSKP = Math.round(item.pesertaSKP * g.peserta);
    const nSKP = Math.round(item.nominalSKP * g.nominal);
    return {
      ...item,
      pilar: `${item.pilar} (${g.label})`,
      pesertaSistem: pSistem,
      nominalSistem: nSistem,
      pesertaSKP: pSKP,
      nominalSKP: nSKP,
      selisihNominal: nSistem - nSKP
    };
  });

  // Filter BNBA Per-Matra (THT/Pensiun)
  const filteredBNBA = bnbaMatraData.filter((item) => {
    // 1. Filter Jenis Dana & Sub-Dana
    if (filterJenisDana === "THT" && !item.danaType.startsWith("THT")) return false;
    if (filterJenisDana === "PENSIUN" && !item.danaType.startsWith("PENSIUN")) return false;

    if (filterSubDana === "THT_ALL" && !item.danaType.startsWith("THT")) return false;
    if (filterSubDana === "PENSIUN_ALL" && !item.danaType.startsWith("PENSIUN")) return false;
    if (filterSubDana === "THT_TNI" && item.danaType !== "THT_TNI") return false;
    if (filterSubDana === "THT_POLRI" && item.danaType !== "THT_POLRI") return false;
    if (filterSubDana === "PENSIUN_TNI" && item.danaType !== "PENSIUN_TNI") return false;
    if (filterSubDana === "PENSIUN_POLRI" && item.danaType !== "PENSIUN_POLRI") return false;

    // 2. Filter Satker (TNI vs POLRI)
    if ((filterSatker === "TNI" || filterSatker === "TNI_ALL") && item.matra === "POLRI") return false;
    if ((filterSatker === "POLRI" || filterSatker === "POLRI_ALL") && item.matra !== "POLRI") return false;
    if (filterSatker === "KEMHAN_ALL" && !(item.matra === "PNS Kemhan" || item.matra === "PPPK Kemhan")) return false;
    if (filterSatker !== "Semua" && filterSatker !== "TNI" && filterSatker !== "TNI_ALL" && filterSatker !== "POLRI" && filterSatker !== "POLRI_ALL" && filterSatker !== "KEMHAN_ALL" && item.matra !== filterSatker) return false;

    // 3. Search Term
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchMatra = item.matra.toLowerCase().includes(q);
      const matchDana = item.namaDana.toLowerCase().includes(q);
      const matchCatatan = item.catatan?.toLowerCase().includes(q);
      if (!matchMatra && !matchDana && !matchCatatan) return false;
    }

    return true;
  }).map((item) => {
    if (filterGolongan === "Semua") return item;
    const g = getGolonganRatio(filterGolongan);
    const pSistem = Math.round(item.pesertaSistem * g.peserta);
    const nSistem = Math.round(item.nominalSistem * g.nominal);
    const pBNBA = Math.round(item.pesertaBNBA * g.peserta);
    const nBNBA = Math.round(item.nominalBNBA * g.nominal);
    return {
      ...item,
      matra: `${item.matra} — ${g.label}`,
      pesertaSistem: pSistem,
      nominalSistem: nSistem,
      pesertaBNBA: pBNBA,
      nominalBNBA: nBNBA,
      selisihJiwa: pSistem - pBNBA,
      selisihNominal: nSistem - nBNBA
    };
  });

  // Filter Komparasi JKK & JKM Per-Matra
  const filteredKomparasiJKKMatra = komparasiJKKMatraData.filter((item) => {
    // 1. Filter Sub-Dana (TNI vs POLRI)
    if ((filterSubDana === "JKK_TNI" || filterSubDana === "JKM_TNI") && item.matra === "POLRI") return false;
    if ((filterSubDana === "JKK_POLRI" || filterSubDana === "JKM_POLRI") && item.matra !== "POLRI") return false;

    // 2. Filter Satker (TNI vs POLRI)
    if ((filterSatker === "TNI" || filterSatker === "TNI_ALL") && item.matra === "POLRI") return false;
    if ((filterSatker === "POLRI" || filterSatker === "POLRI_ALL") && item.matra !== "POLRI") return false;
    if (filterSatker === "KEMHAN_ALL" && !(item.matra === "PNS Kemhan" || item.matra === "PPPK Kemhan")) return false;
    if (filterSatker !== "Semua" && filterSatker !== "TNI" && filterSatker !== "TNI_ALL" && filterSatker !== "POLRI" && filterSatker !== "POLRI_ALL" && filterSatker !== "KEMHAN_ALL" && item.matra !== filterSatker) return false;

    // 3. Search Term
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchMatra = item.matra.toLowerCase().includes(q);
      if (!matchMatra) return false;
    }

    return true;
  }).map((item) => {
    if (filterGolongan === "Semua") return item;
    const g = getGolonganRatio(filterGolongan);
    const p = Math.round(item.peserta * g.peserta);
    const gp = Math.round(item.gapokTotal * g.nominal);
    const njkk = Math.round(item.nominalJKKSistem * g.nominal);
    const njkm = Math.round(item.nominalJKMSistem * g.nominal);
    return {
      ...item,
      matra: `${item.matra} — ${g.label}`,
      peserta: p,
      gapokTotal: gp,
      nominalJKKSistem: njkk,
      nominalJKMSistem: njkm,
      realisasiKasJKK: njkk,
      realisasiKasJKM: njkm
    };
  });

  // Handler Preview Rekap & Laporan Sesuai Filter Aktif
  const handlePreviewRekapLaporan = () => {
    if (activeSubtab === "history") {
      handleExportExcel();
      return;
    }

    if (activeProgram === "THT_PENSIUN") {
      const isRekap = viewModeKomparasi === "rekap";
      const dTitle = getDanaLabel();
      const sTitle = getSatkerLabel(filterSatker);
      const gTitle = getGolonganLabel(filterGolongan);

      if (isRekap) {
        const rows = filteredRekapSKP.map((r) => [
          r.namaDana,
          r.matra,
          r.tarif,
          `${fmtNum(r.pesertaSistem)} Jiwa`,
          fmtB(r.nominalSistem),
          `${fmtNum(r.pesertaSKP)} Jiwa`,
          fmtB(r.nominalSKP),
          r.selisihNominal === 0 ? "Rp 0 (Cocok)" : fmtB(r.selisihNominal),
          r.statusRekap
        ]);
        const totPSistem = filteredRekapSKP.reduce((a, b) => a + b.pesertaSistem, 0);
        const totNSistem = filteredRekapSKP.reduce((a, b) => a + b.nominalSistem, 0);
        const totPSKP = filteredRekapSKP.reduce((a, b) => a + b.pesertaSKP, 0);
        const totNSKP = filteredRekapSKP.reduce((a, b) => a + b.nominalSKP, 0);
        const totSelisih = filteredRekapSKP.reduce((a, b) => a + b.selisihNominal, 0);

        setPreview({
          title: `Laporan Rekapitulasi Komparasi Iuran ${dTitle}`,
          subtitle: `Filter: Satker ${sTitle} • Golongan ${gTitle} • Periode Juli - September 2026`,
          type: "table",
          fileName: `Laporan_Rekap_Komparasi_${filterJenisDana}_${filterSubDana}_${filterSatker}.xlsx`,
          content: {
            columns: ["Program Dana", "Matra Cakupan", "Tarif", "Peserta Sistem", "Nominal Sistem", "Peserta SKP", "Nominal SKP", "Selisih Nominal", "Status Rekon"],
            rows: rows,
            totalRow: ["TOTAL REKAPITULASI", sTitle, "—", `${fmtNum(totPSistem)} Jiwa`, fmtB(totNSistem), `${fmtNum(totPSKP)} Jiwa`, fmtB(totNSKP), totSelisih === 0 ? "Rp 0 (Match 100%)" : fmtB(totSelisih), "Lunas SKP-PFK"],
            totalRows: rows.length
          }
        });
      } else {
        const rows = filteredBNBA.map((b) => [
          b.namaDana,
          b.matra,
          b.tarif,
          `${fmtNum(b.pesertaSistem)} Jiwa`,
          fmtB(b.nominalSistem),
          `${fmtNum(b.pesertaBNBA)} Jiwa`,
          fmtB(b.nominalBNBA),
          b.selisihJiwa === 0 ? "0" : String(b.selisihJiwa),
          b.selisihNominal === 0 ? "Rp 0" : fmtB(b.selisihNominal),
          b.status
        ]);
        const totPSistem = filteredBNBA.reduce((a, b) => a + b.pesertaSistem, 0);
        const totNSistem = filteredBNBA.reduce((a, b) => a + b.nominalSistem, 0);
        const totPBNBA = filteredBNBA.reduce((a, b) => a + b.pesertaBNBA, 0);
        const totNBNBA = filteredBNBA.reduce((a, b) => a + b.nominalBNBA, 0);
        const totSelJiwa = filteredBNBA.reduce((a, b) => a + b.selisihJiwa, 0);
        const totSelNom = filteredBNBA.reduce((a, b) => a + b.selisihNominal, 0);

        setPreview({
          title: `Laporan Komparasi BNBA Per-Satker — ${dTitle}`,
          subtitle: `Filter: Satker ${sTitle} • Golongan ${gTitle} • Periode Juli - September 2026`,
          type: "table",
          fileName: `Laporan_BNBA_PerSatker_${filterJenisDana}_${filterSubDana}_${filterSatker}.xlsx`,
          content: {
            columns: ["Program Dana", "Matra / Kesatuan", "Tarif", "Peserta Sistem", "Nominal Sistem", "Peserta BNBA", "Nominal BNBA", "Selisih Jiwa", "Selisih Nominal", "Status Validasi"],
            rows: rows,
            totalRow: ["TOTAL PER-SATKER", sTitle, "—", `${fmtNum(totPSistem)} Jiwa`, fmtB(totNSistem), `${fmtNum(totPBNBA)} Jiwa`, fmtB(totNBNBA), String(totSelJiwa), totSelNom === 0 ? "Rp 0" : fmtB(totSelNom), "Tervalidasi API SPAN"],
            totalRows: rows.length
          }
        });
      }
    } else {
      // JKK / JKM
      const prog = activeProgram;
      const sTitle = getSatkerLabel(filterSatker);
      const gTitle = getGolonganLabel(filterGolongan);
      const isRekap = viewModeKomparasi === "rekap";

      if (isRekap) {
        const item = rekapJKKData.find(r => r.program.includes(prog));
        const g = getGolonganRatio(filterGolongan);
        const p = Math.round((item?.peserta || 14328) * g.peserta);
        const nomPot = Math.round((item?.nominalPotensi || (prog === "JKK" ? 2630000000 : 2210000000)) * g.nominal);
        const nomReal = nomPot;

        setPreview({
          title: `Laporan Rekapitulasi Iuran ${prog}`,
          subtitle: `Filter: Satker ${sTitle} • Golongan ${gTitle} • Periode Juli - September 2026`,
          type: "table",
          fileName: `Laporan_Rekap_${prog}_${filterSatker}.xlsx`,
          content: {
            columns: ["Program Iuran", "Matra Cakupan", "Tarif", "Peserta", "Potensi Sistem", "Realisasi SP2D", "Selisih Nominal", "Status"],
            rows: [[
              `${prog} (${gTitle})`,
              sTitle,
              prog === "JKK" ? "0,24%" : "0,20%",
              `${fmtNum(p)} Jiwa`,
              fmtB(nomPot),
              fmtB(nomReal),
              "Rp 0",
              "Terverifikasi Lunas 100%"
            ]],
            totalRow: ["TOTAL REKAPITULASI", sTitle, prog === "JKK" ? "0,24%" : "0,20%", `${fmtNum(p)} Jiwa`, fmtB(nomPot), fmtB(nomReal), "Rp 0", "Lunas SP2D"],
            totalRows: 1
          }
        });
      } else {
        const rows = filteredKomparasiJKKMatra.map((k) => [
          k.matra,
          `${fmtNum(k.peserta)} Jiwa`,
          fmtB(k.gapokTotal),
          fmtB(prog === "JKK" ? k.nominalJKKSistem : k.nominalJKMSistem),
          fmtB(prog === "JKK" ? k.realisasiKasJKK : k.realisasiKasJKM),
          "Rp 0",
          k.status
        ]);
        const totP = filteredKomparasiJKKMatra.reduce((a, b) => a + b.peserta, 0);
        const totGapok = filteredKomparasiJKKMatra.reduce((a, b) => a + b.gapokTotal, 0);
        const totPot = filteredKomparasiJKKMatra.reduce((a, b) => a + (prog === "JKK" ? b.nominalJKKSistem : b.nominalJKMSistem), 0);
        const totReal = filteredKomparasiJKKMatra.reduce((a, b) => a + (prog === "JKK" ? b.realisasiKasJKK : b.realisasiKasJKM), 0);

        setPreview({
          title: `Laporan Komparasi Iuran ${prog} Per-Satker`,
          subtitle: `Filter: Satker ${sTitle} • Golongan ${gTitle} • Periode Juli - September 2026`,
          type: "table",
          fileName: `Laporan_PerSatker_${prog}_${filterSatker}.xlsx`,
          content: {
            columns: ["Matra / Satuan Kerja", "Peserta Terlindungi", "Total Gaji Pokok", `Potensi ${prog} (Rp)`, `Realisasi SP2D (Rp)`, "Selisih Nominal", "Status"],
            rows: rows,
            totalRow: ["TOTAL (TERFILTER)", `${fmtNum(totP)} Jiwa`, fmtB(totGapok), fmtB(totPot), fmtB(totReal), "Rp 0", "Lunas 100%"],
            totalRows: rows.length
          }
        });
      }
    }
  };

  // Handler Global Ekspor Excel (Sesuai Filter Aktif)
  const handleExportExcel = () => {
    if (activeSubtab === "history") {
      const targetHist =
        activeProgram === "THT_PENSIUN"
          ? filteredHistorySKP
          : activeProgram === "JKK"
          ? filteredHistoryJKK
          : filteredHistoryJKM;

      const dokCol = activeProgram === "THT_PENSIUN" ? "Surat SKP-PFK Kemenkeu" : "Nota Dinas Kepesertaan";

      setPreview({
        title: `Ekspor Excel Riwayat Proses Selesai (History) — ${activeProgram}`,
        subtitle: `Periode ${filterPeriode}`,
        type: "table",
        fileName: `History_Complete_Process_${activeProgram}_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
        content: {
          columns: ["Surat Tagihan Resmi", dokCol, "Nomor SP2D", "Tgl Cair SP2D", "Nominal Realisasi", "Nomor BAR", "Tgl Selesai", "Status"],
          rows: targetHist.map((m) => [
            m.noSuratTagihan,
            activeProgram === "THT_PENSIUN" ? m.noSKP : m.noNotaDinas,
            m.noSP2D,
            m.tglTerimaDana,
            fmtB(m.nominalDanaSKP || m.nominalDiterima || m.nominalTagihan),
            m.noBAR,
            m.tglSelesai,
            m.statusProses
          ]),
          totalRows: targetHist.length
        }
      });
      return;
    }

    // Untuk tab Komparasi: Generate tabel ekspor yang persis sesuai filter yang sedang aktif
    handlePreviewRekapLaporan();
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
      <SatkerModal data={satkerModalData} onClose={() => setSatkerModalData(null)} />

      {/* MODAL THE COMPLETE PROCESS (Riwayat Audit Trail Siklus Lengkap) */}
      {selectedCompleteProcess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setSelectedCompleteProcess(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 840,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: currentTheme.lightBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: currentTheme.primary
                  }}
                >
                  <History size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                    The Complete Process — Siklus Rekonsiliasi & Monitoring Selesai
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 2 }}>
                    Tagihan: <b>{selectedCompleteProcess.noSuratTagihan}</b> • {currentTheme.title}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompleteProcess(null)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: COLORS.gray400
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              {/* Status Header Banner */}
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "#ECFDF5",
                  border: "1px solid #10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 10
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>
                    PROSES REKONSILIASI TELAH SELESAI & TUNTAS 100% (COMPLETED PROCESS)
                  </span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#047857", background: "#D1FAE5", padding: "3px 10px", borderRadius: 12 }}>
                  BAR: {selectedCompleteProcess.noBAR || "BAR-01/REKON/2026"}
                </span>
              </div>

              {/* Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                <div style={{ padding: 12, background: "#F8FAFC", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 600 }}>Nomor Berita Acara (BAR)</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.blueDark, marginTop: 4, fontFamily: "monospace" }}>
                    {selectedCompleteProcess.noBAR || "BAR-01/REKON/2026"}
                  </div>
                  <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                    Tgl Selesai: {selectedCompleteProcess.tglSelesai || "31 Juli 2026"}
                  </div>
                </div>

                <div style={{ padding: 12, background: "#F8FAFC", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 600 }}>Total Nominal Realisasi</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginTop: 4, fontFamily: "monospace" }}>
                    {fmtB(selectedCompleteProcess.nominalDanaSKP || selectedCompleteProcess.nominalDiterima || selectedCompleteProcess.nominalTagihan)}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#059669", marginTop: 2, fontWeight: 600 }}>
                    Lunas Masuk Kas via SP2D
                  </div>
                </div>

                <div style={{ padding: 12, background: "#F8FAFC", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 11, color: COLORS.gray500, fontWeight: 600 }}>
                    {activeProgram === "THT_PENSIUN" ? "Surat SKP-PFK Kemenkeu" : "Nota Dinas Kepesertaan"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: currentTheme.primary, marginTop: 4, fontFamily: "monospace" }}>
                    {activeProgram === "THT_PENSIUN" ? selectedCompleteProcess.noSKP : selectedCompleteProcess.noNotaDinas}
                  </div>
                  <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                    Tgl: {activeProgram === "THT_PENSIUN" ? selectedCompleteProcess.tglSKP : selectedCompleteProcess.tglNotaDinas}
                  </div>
                </div>
              </div>

              {/* 5-STAGE TIMELINE / LIFECYCLE AUDIT TRAIL */}
              <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900, marginBottom: 14 }}>
                Siklus Perjalanan Proses (End-to-End Audit Trail)
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Tahap 1 */}
                <div style={{ display: "flex", gap: 14, background: "#FFFFFF", border: `1px solid ${COLORS.gray200}`, borderRadius: 10, padding: 14, position: "relative" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DBEAFE", color: "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>
                        Penerbitan Surat Tagihan Resmi ASABRI
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", background: "#EFF6FF", color: "#1E40AF", borderRadius: 4 }}>
                        Langkah 1
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>
                      Surat tagihan resmi diterbitkan secara otomatis oleh sistem ASABRI kepada Direktur Jenderal Perbendaharaan Kemenkeu RI cq. KPPN Khusus Jakarta II.
                    </div>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#F8FAFC", borderRadius: 6, fontSize: 11.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>Nomor Surat: <b>{selectedCompleteProcess.noSuratTagihan}</b></div>
                      <div>Tanggal Surat: <b>{selectedCompleteProcess.tglSuratTagihan}</b></div>
                      <div>Nominal Tagihan: <b style={{ color: COLORS.blueDark }}>{fmtB(selectedCompleteProcess.nominalDanaSKP || selectedCompleteProcess.nominalDiterima || selectedCompleteProcess.nominalTagihan)}</b></div>
                      <div>Status Pengiriman: <b style={{ color: "#059669" }}>Terkirim & Terdaftar Resmi</b></div>
                    </div>
                  </div>
                </div>

                {/* Tahap 2 */}
                <div style={{ display: "flex", gap: 14, background: "#FFFFFF", border: `1px solid ${COLORS.gray200}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FEF3C7", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>
                        {activeProgram === "THT_PENSIUN" ? "Verifikasi Penetapan SKP-PFK Kemenkeu RI" : "Verifikasi Nota Dinas Kepesertaan"}
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", background: "#FEF3C7", color: "#92400E", borderRadius: 4 }}>
                        Langkah 2
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>
                      {activeProgram === "THT_PENSIUN"
                        ? "Penetapan Perhitungan Fihak Ketiga (SKP-PFK) dari Ditjen Perbendaharaan diterima dan dicocokkan dengan data potongan iuran 8,00%."
                        : "Nota Dinas penetapan kepesertaan divalidasi terhadap daftar personel terlindungi dan basis gaji pokok 6 Matra kedinasan."}
                    </div>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#F8FAFC", borderRadius: 6, fontSize: 11.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>
                        {activeProgram === "THT_PENSIUN" ? "Nomor SKP-PFK: " : "Nomor Nota Dinas: "}
                        <b>{activeProgram === "THT_PENSIUN" ? selectedCompleteProcess.noSKP : selectedCompleteProcess.noNotaDinas}</b>
                      </div>
                      <div>
                        Tanggal Dokumen: <b>{activeProgram === "THT_PENSIUN" ? selectedCompleteProcess.tglSKP : selectedCompleteProcess.tglNotaDinas}</b>
                      </div>
                      <div>Penerbit: <b>{activeProgram === "THT_PENSIUN" ? "DJPb Kemenkeu RI" : "Divisi Kepesertaan ASABRI"}</b></div>
                      <div>Status Verifikasi: <b style={{ color: "#059669" }}>Tervalidasi Sah (100%)</b></div>
                    </div>
                  </div>
                </div>

                {/* Tahap 3 */}
                <div style={{ display: "flex", gap: 14, background: "#FFFFFF", border: `1px solid ${COLORS.gray200}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#D1FAE5", color: "#065F46", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>
                        Penerimaan Kas & Penyaluran SP2D Kemenkeu
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", background: "#D1FAE5", color: "#065F46", borderRadius: 4 }}>
                        Langkah 3
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>
                      Kemenkeu mencairkan dana melalui Surat Perintah Pencairan Dana (SP2D) langsung ke rekening giro penampungan iuran PT ASABRI (Persero).
                    </div>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#F8FAFC", borderRadius: 6, fontSize: 11.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>Nomor SP2D: <b>{selectedCompleteProcess.noSP2D}</b></div>
                      <div>Tanggal Cair Kas: <b>{selectedCompleteProcess.tglTerimaDana}</b></div>
                      <div>Rekening Penampungan: <b>{selectedCompleteProcess.bankTujuan}</b></div>
                      <div>Nominal Masuk: <b style={{ color: "#059669" }}>{fmtB(selectedCompleteProcess.nominalDanaSKP || selectedCompleteProcess.nominalDiterima || selectedCompleteProcess.nominalTagihan)}</b></div>
                    </div>
                  </div>
                </div>

                {/* Tahap 4 */}
                <div style={{ display: "flex", gap: 14, background: "#FFFFFF", border: `1px solid ${COLORS.gray200}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E0E7FF", color: "#3730A3", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    4
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>
                        Komparasi Data Kepesertaan (6 Matra Kedinasan)
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", background: "#E0E7FF", color: "#3730A3", borderRadius: 4 }}>
                        Langkah 4
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>
                      Pencocokan rekonsiliasi antara realisasi kas yang masuk dengan rincian peserta per Matra (TNI AD, TNI AL, TNI AU, PNS Kemhan, PPPK Kemhan, POLRI).
                    </div>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#F8FAFC", borderRadius: 6, fontSize: 11.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>Cakupan Matra: <b>6 Matra (TNI AD, AL, AU, PNS Kemhan, PPPK Kemhan, POLRI)</b></div>
                      <div>Status Komparasi: <b style={{ color: "#059669" }}>Cocok 100% (Zero Discrepancy)</b></div>
                      <div>Sinkronisasi SPAN: <b>Tervalidasi API BNBA Kemenkeu</b></div>
                      <div>Selisih Gantung: <b style={{ color: "#059669" }}>Rp 0 (Seimbang)</b></div>
                    </div>
                  </div>
                </div>

                {/* Tahap 5 */}
                <div style={{ display: "flex", gap: 14, background: "#ECFDF5", border: "1px solid #10B981", borderRadius: 10, padding: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    ✓
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#065F46" }}>
                        Penyelesaian Proses & Berita Acara Rekonsiliasi (BAR)
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 8px", background: "#059669", color: "#FFFFFF", borderRadius: 4 }}>
                        Tuntas (Completed)
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#065F46", marginTop: 4 }}>
                      Kedua belah pihak (PT ASABRI dan Direktorat Jenderal Perbendaharaan Kemenkeu RI) menandatangani Berita Acara Rekonsiliasi resmi. Proses monitoring resmi ditutup dan disimpan permanen di Tab History.
                    </div>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#FFFFFF", borderRadius: 6, fontSize: 11.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, border: "1px solid #A7F3D0" }}>
                      <div>Nomor BAR Resmi: <b style={{ color: "#065F46" }}>{selectedCompleteProcess.noBAR}</b></div>
                      <div>Tanggal Penetapan BAR: <b>{selectedCompleteProcess.tglSelesai}</b></div>
                      <div>Status Arsip: <b style={{ color: "#059669" }}>Arsip Permanen History</b></div>
                      <div>Kekuatan Hukum: <b>Ditandatangani Para Pihak (Sah)</b></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC"
              }}
            >
              <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
                💡 Dokumen The Complete Process tersimpan abadi di Tab History untuk keperluan audit BPK dan DJPb.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() => openSuratTagihanPreview(selectedCompleteProcess)}
                >
                  <FileText size={13} style={{ marginRight: 4 }} />
                  Surat Tagihan
                </Btn>
                <Btn
                  variant="primary"
                  size="sm"
                  style={{ background: "#059669" }}
                  onClick={() => {
                    openBARPreview(selectedCompleteProcess);
                  }}
                >
                  <CheckCircle2 size={13} style={{ marginRight: 4 }} />
                  Cetak Berita Acara (BAR)
                </Btn>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCompleteProcess(null)}
                >
                  Tutup
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI SELESAIKAN PROSES MONITORING */}
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
                  Konfirmasi Selesaikan Monitoring & Pindahkan ke History
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray600 }}>
                  Surat Tagihan: <b>{confirmCompleteItem.noSuratTagihan}</b>
                </div>
              </div>
            </div>

            <div style={{ padding: "20px 22px", fontSize: 12.5, color: COLORS.gray700, lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                Apakah Anda yakin ingin menyelesaikan proses monitoring untuk tagihan <strong>{confirmCompleteItem.noSuratTagihan}</strong>?
              </p>
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#EFF6FF", borderLeft: `3px solid ${COLORS.blue}`, borderRadius: 4, fontSize: 12, color: COLORS.blueDark }}>
                📌 <b>Setelah diselesaikan:</b>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: 18 }}>
                  <li>Tagihan akan dipindahkan dari tabel monitoring aktif ke <b>Tab History</b>.</li>
                  <li>Sistem akan menerbitkan <b>Berita Acara Rekonsiliasi (BAR)</b> resmi.</li>
                  <li>Seluruh siklus <b>The Complete Process</b> akan disimpan permanen untuk audit.</li>
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
                onClick={() => handleCompleteMonitoring(confirmCompleteItem)}
              >
                <CheckCircle2 size={14} style={{ marginRight: 4 }} />
                Ya, Selesaikan & Simpan ke History
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal Drilldown BNBA */}
      {selectedMatraDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16
          }}
          onClick={() => setSelectedMatraDetail(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 12,
              width: "100%",
              maxWidth: 860,
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC"
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                  Drilldown By-Name-By-Address (API BNBA Kemenkeu)
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 2 }}>
                  Program Dana: <b>{selectedMatraDetail.namaDana || selectedMatraDetail.jenisIuran}</b> ({selectedMatraDetail.tarif || "3,25%"}) • Matra: <b>{selectedMatraDetail.matra}</b> • Periode Juli 2026
                </div>
              </div>
              <button
                onClick={() => setSelectedMatraDetail(null)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: COLORS.gray500,
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              <div style={{ marginBottom: 14, padding: "10px 14px", background: "#EFF6FF", borderLeft: `4px solid ${COLORS.blue}`, borderRadius: 4, fontSize: 12, color: COLORS.blueDark }}>
                Menampilkan sampel records transaksi potongan gaji induk per prajurit/anggota berdasarkan rekonsiliasi data Kemenkeu RI.
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}` }}>NRP / NIP</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}` }}>Nama Prajurit / Anggota</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}` }}>Pangkat / Kesatuan</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Gaji Pokok</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Pot. THT (3,25%)</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Pot. Pensiun (4,75%)</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Total Tagihan (8,00%)</th>
                      <th style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray300}` }}>Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleBNBADetail.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray200}` }}>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700 }}>{p.nrp}</td>
                        <td style={{ padding: "9px 12px", fontWeight: 600 }}>{p.nama}</td>
                        <td style={{ padding: "9px 12px", color: COLORS.gray600 }}>{p.pangkat} • {p.satker}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace" }}>{fmtB(p.gapok)}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.blue }}>{fmtB(p.tht)}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.green }}>{fmtB(p.pensiun)}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E40AF" }}>{fmtB(p.totalPotongan)}</td>
                        <td style={{ padding: "9px 12px" }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: p.status.includes("Cocok") ? "#ECFDF5" : "#FEF3C7",
                              color: p.status.includes("Cocok") ? "#065F46" : "#92400E"
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "flex-end", background: "#F8FAFC" }}>
              <Btn size="sm" variant="ghost" onClick={() => setSelectedMatraDetail(null)}>Tutup</Btn>
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
          1. PILAR / PROGRAM SWITCHER (THT & PENSIUN | JKK | JKM)
          Sesuai permintaan: JKK dan JKM dipisah tabnya masing-masing
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
          flexWrap: "wrap"
        }}
      >
        {/* Tab 1: THT & Pensiun */}
        <button
          onClick={() => {
            setActiveProgram("THT_PENSIUN");
            setSearchTerm("");
          }}
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
            background: activeProgram === "THT_PENSIUN" ? COLORS.white : "transparent",
            color: activeProgram === "THT_PENSIUN" ? COLORS.blue : COLORS.gray600,
            boxShadow: activeProgram === "THT_PENSIUN" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease"
          }}
        >
          <Building2 size={16} color={activeProgram === "THT_PENSIUN" ? COLORS.blue : COLORS.gray500} />
          <span>THT & Pensiun</span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeProgram === "THT_PENSIUN" ? "#DBEAFE" : "#E2E8F0",
              color: activeProgram === "THT_PENSIUN" ? "#1E40AF" : COLORS.gray600,
              fontWeight: 700
            }}
          >
            Tagihan Tunggal
          </span>
        </button>

        {/* Tab 2: JKK */}
        <button
          onClick={() => {
            setActiveProgram("JKK");
            setSearchTerm("");
          }}
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
            background: activeProgram === "JKK" ? COLORS.white : "transparent",
            color: activeProgram === "JKK" ? "#047857" : COLORS.gray600,
            boxShadow: activeProgram === "JKK" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease"
          }}
        >
          <Shield size={16} color={activeProgram === "JKK" ? "#047857" : COLORS.gray500} />
          <span>Jaminan Kecelakaan Kerja (JKK)</span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeProgram === "JKK" ? "#D1FAE5" : "#E2E8F0",
              color: activeProgram === "JKK" ? "#065F46" : COLORS.gray600,
              fontWeight: 700
            }}
          >
            Program JKK
          </span>
        </button>

        {/* Tab 3: JKM */}
        <button
          onClick={() => {
            setActiveProgram("JKM");
            setSearchTerm("");
          }}
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
            background: activeProgram === "JKM" ? COLORS.white : "transparent",
            color: activeProgram === "JKM" ? "#0D9488" : COLORS.gray600,
            boxShadow: activeProgram === "JKM" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s ease"
          }}
        >
          <Shield size={16} color={activeProgram === "JKM" ? "#0D9488" : COLORS.gray500} />
          <span>Jaminan Kematian (JKM)</span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeProgram === "JKM" ? "#CCFBF1" : "#E2E8F0",
              color: activeProgram === "JKM" ? "#0F766E" : COLORS.gray600,
              fontWeight: 700
            }}
          >
            Program JKM
          </span>
        </button>
      </div>

      {/* =========================================================================
          2. NAVIGASI 2 SUBTAB UTAMA: KOMPARASI DAN HISTORY
         ========================================================================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${COLORS.gray200}`,
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: -2 }}>
          {/* SUBTAB 1: KOMPARASI DATA KEPESERTAAN */}
          <button
            onClick={() => setActiveSubtab("komparasi")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSubtab === "komparasi" ? 800 : 600,
              color: activeSubtab === "komparasi" ? currentTheme.primary : COLORS.gray600,
              borderBottom: activeSubtab === "komparasi" ? `3px solid ${currentTheme.primary}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease"
            }}
          >
            <Users size={16} />
            Komparasi Data Kepesertaan
          </button>

          {/* SUBTAB 2: HISTORY / RIWAYAT PROSES */}
          <button
            onClick={() => setActiveSubtab("history")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSubtab === "history" ? 800 : 600,
              color: activeSubtab === "history" ? currentTheme.primary : COLORS.gray600,
              borderBottom: activeSubtab === "history" ? `3px solid ${currentTheme.primary}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease"
            }}
          >
            <History size={16} />
            History / Riwayat Proses
            <span
              style={{
                fontSize: 11,
                background: activeSubtab === "history" ? currentTheme.lightBg : "#F1F5F9",
                color: activeSubtab === "history" ? currentTheme.primary : COLORS.gray600,
                padding: "2px 8px",
                borderRadius: 10,
                fontWeight: 700
              }}
            >
              {currentHistoryCount}
            </span>
          </button>
        </div>

        {/* Global Action Export */}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
          >
            <Download size={13} style={{ marginRight: 4 }} />
            Ekspor Excel
          </Btn>
        </div>
      </div>

      {/* =========================================================================
          KONTEN SUBTAB 2: KOMPARASI DATA KEPESERTAAN (HANYA 1 TAB)
          Sesuai permintaan:
          - Dibuat 1 tab saja
          - Bisa filter tampilannya: Secara Rekap atau Secara Per-Matra
          - Card pada setiap tab dihilangkan!
         ========================================================================= */}
      {activeSubtab === "komparasi" && (
        <div>
          {/* =========================================================================
              BAR FILTER KOMPARASI (PROPORSIONAL, ELEGAN, DAN USER-FRIENDLY)
             ========================================================================= */}
          <div
            style={{
              background: COLORS.white,
              padding: "14px 18px",
              borderRadius: 10,
              border: `1px solid ${COLORS.gray200}`,
              marginBottom: 16,
              boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
              display: "flex",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "12px 14px"
            }}
          >
            {/* Field 1: Mode Tampilan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 160 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, display: "flex", alignItems: "center", gap: 5 }}>
                <Layers size={13} color={currentTheme.primary} />
                Mode Tampilan
              </label>
              <select
                value={viewModeKomparasi}
                onChange={(e) => setViewModeKomparasi(e.target.value)}
                style={{
                  height: 36,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  background: COLORS.white,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: COLORS.gray800,
                  outline: "none"
                }}
              >
                <option value="rekap">Secara Rekap (Makro)</option>
                <option value="per_matra">Secara Per-Matra (BNBA)</option>
              </select>
            </div>

            {/* Field 2: Jenis Dana */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 165 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, display: "flex", alignItems: "center", gap: 5 }}>
                <Building2 size={13} color={COLORS.blue} />
                Jenis Dana
              </label>
              {activeProgram === "THT_PENSIUN" ? (
                <select
                  value={filterJenisDana}
                  onChange={(e) => handleJenisDanaChange(e.target.value)}
                  style={{
                    height: 36,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid ${filterJenisDana !== "Semua" ? currentTheme.primary : COLORS.gray300}`,
                    background: filterJenisDana !== "Semua" ? currentTheme.lightBg : COLORS.white,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: filterJenisDana !== "Semua" ? currentTheme.primary : COLORS.gray800,
                    outline: "none"
                  }}
                >
                  <option value="Semua">Semua Jenis Dana</option>
                  <option value="THT">THT (Tabungan Hari Tua)</option>
                  <option value="PENSIUN">Pensiun</option>
                </select>
              ) : (
                <select
                  disabled
                  value={activeProgram}
                  style={{
                    height: 36,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    background: "#F8FAFC",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: COLORS.gray800,
                    outline: "none"
                  }}
                >
                  <option value={activeProgram}>
                    {activeProgram === "JKK" ? "JKK (Kecelakaan Kerja)" : "JKM (Kematian)"}
                  </option>
                </select>
              )}
            </div>

            {/* Field 3: Sub-Jenis Dana */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 185 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, display: "flex", alignItems: "center", gap: 5 }}>
                <SlidersHorizontal size={13} color={currentTheme.primary} />
                Sub-Jenis Dana
              </label>
              <select
                value={filterSubDana}
                onChange={(e) => setFilterSubDana(e.target.value)}
                style={{
                  height: 36,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${filterSubDana !== "Semua" && filterSubDana !== "THT_ALL" && filterSubDana !== "PENSIUN_ALL" ? currentTheme.primary : COLORS.gray300}`,
                  background: filterSubDana !== "Semua" && filterSubDana !== "THT_ALL" && filterSubDana !== "PENSIUN_ALL" ? currentTheme.lightBg : COLORS.white,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: filterSubDana !== "Semua" && filterSubDana !== "THT_ALL" && filterSubDana !== "PENSIUN_ALL" ? currentTheme.primary : COLORS.gray800,
                  outline: "none"
                }}
              >
                {activeProgram === "THT_PENSIUN" ? (
                  filterJenisDana === "THT" ? (
                    <>
                      <option value="THT_ALL">Semua THT (TNI & POLRI)</option>
                      <option value="THT_TNI">THT TNI (Prajurit TNI & ASN Kemhan)</option>
                      <option value="THT_POLRI">THT POLRI (Anggota POLRI & PNS Polri)</option>
                    </>
                  ) : filterJenisDana === "PENSIUN" ? (
                    <>
                      <option value="PENSIUN_ALL">Semua Pensiun (TNI & POLRI)</option>
                      <option value="PENSIUN_TNI">Pensiun TNI (Prajurit TNI & ASN Kemhan)</option>
                      <option value="PENSIUN_POLRI">Pensiun POLRI (Anggota POLRI & PNS Polri)</option>
                    </>
                  ) : (
                    <>
                      <option value="Semua">Semua Sub-Dana</option>
                      <optgroup label="── Sub-Dana THT ──">
                        <option value="THT_ALL">Semua THT</option>
                        <option value="THT_TNI">THT TNI</option>
                        <option value="THT_POLRI">THT POLRI</option>
                      </optgroup>
                      <optgroup label="── Sub-Dana Pensiun ──">
                        <option value="PENSIUN_ALL">Semua Pensiun</option>
                        <option value="PENSIUN_TNI">Pensiun TNI</option>
                        <option value="PENSIUN_POLRI">Pensiun POLRI</option>
                      </optgroup>
                    </>
                  )
                ) : activeProgram === "JKK" ? (
                  <>
                    <option value="Semua">Semua JKK</option>
                    <option value="JKK_TNI">JKK TNI</option>
                    <option value="JKK_POLRI">JKK POLRI</option>
                  </>
                ) : (
                  <>
                    <option value="Semua">Semua JKM</option>
                    <option value="JKM_TNI">JKM TNI</option>
                    <option value="JKM_POLRI">JKM POLRI</option>
                  </>
                )}
              </select>
            </div>

            {/* Field 4: Filter Satker */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 125 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, display: "flex", alignItems: "center", gap: 5 }}>
                <Building2 size={13} color={COLORS.gray500} />
                Satker / Matra
              </label>
              <select
                value={filterSatker}
                onChange={(e) => setFilterSatker(e.target.value)}
                style={{
                  height: 36,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${filterSatker !== "Semua" ? currentTheme.primary : COLORS.gray300}`,
                  background: filterSatker !== "Semua" ? currentTheme.lightBg : COLORS.white,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: filterSatker !== "Semua" ? currentTheme.primary : COLORS.gray800,
                  outline: "none"
                }}
              >
                <option value="Semua">Semua Satker</option>
                <option value="TNI">TNI</option>
                <option value="POLRI">POLRI</option>
              </select>
            </div>

            {/* Field 5: Filter Golongan / Kepangkatan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 155 }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, display: "flex", alignItems: "center", gap: 5 }}>
                <SlidersHorizontal size={13} color={COLORS.gray500} />
                Golongan
              </label>
              <select
                value={filterGolongan}
                onChange={(e) => setFilterGolongan(e.target.value)}
                style={{
                  height: 36,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${filterGolongan !== "Semua" ? currentTheme.primary : COLORS.gray300}`,
                  background: filterGolongan !== "Semua" ? currentTheme.lightBg : COLORS.white,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: filterGolongan !== "Semua" ? currentTheme.primary : COLORS.gray800,
                  outline: "none"
                }}
              >
                <option value="Semua">Semua Golongan</option>
                <option value="PATI_PAMEN">Pati & Pamen</option>
                <option value="PAMA">Pama</option>
                <option value="BINTARA_TAMTAMA">Bintara & Tamtama</option>
                <option value="PNS_GOL">PNS Kemhan/Polri</option>
                <option value="PPPK">PPPK</option>
              </select>
            </div>

            {/* Field 6: Cari Data */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 170, flex: "1 1 170px" }}>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, display: "flex", alignItems: "center", gap: 5 }}>
                <Search size={13} color={COLORS.gray500} />
                Pencarian Data
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 11 }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari matra, satker..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: 36,
                    padding: "6px 28px 6px 32px",
                    borderRadius: 6,
                    border: `1px solid ${searchTerm ? currentTheme.primary : COLORS.gray300}`,
                    fontSize: 12.5,
                    outline: "none"
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      fontSize: 12,
                      cursor: "pointer",
                      color: COLORS.gray400
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons: Reset & Ekspor Excel */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              {(filterJenisDana !== "Semua" || filterSubDana !== "Semua" || filterSatker !== "Semua" || filterGolongan !== "Semua" || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterJenisDana("Semua");
                    setFilterSubDana("Semua");
                    setFilterSatker("Semua");
                    setFilterGolongan("Semua");
                    setSearchTerm("");
                  }}
                  title="Reset Filter ke Default"
                  style={{
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    background: COLORS.white,
                    color: "#DC2626",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}

              <Btn
                variant="primary"
                size="sm"
                onClick={handleExportExcel}
                style={{
                  height: 36,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  padding: "0 14px",
                  fontSize: 12.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <Download size={13} />
                Ekspor Excel
              </Btn>
            </div>
          </div>

          {/* =====================================================================
              A. TAMPILAN SECARA REKAP (MAKRO)
             ===================================================================== */}
          {viewModeKomparasi === "rekap" && (
            <div>
              {activeProgram === "THT_PENSIUN" ? (
                /* REKAP THT & PENSIUN 4 DANA */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Rekapitulasi Komparasi Iuran vs SKP-PFK Kemenkeu</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#DBEAFE", color: "#1E40AF" }}>
                          {getDanaLabel()}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                        Data perbandingan Sistem ASABRI terhadap SKP-PFK Kemenkeu No. S-184/PB.2/2026 • Satker: <b>{getSatkerLabel(filterSatker)}</b> • Golongan: <b>{getGolonganLabel(filterGolongan)}</b>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>
                        Menampilkan: <b>{filteredRekapSKP.length} Dana/Baris</b>
                      </span>
                      <Btn size="xs" variant="outline" onClick={handleExportExcel}>
                        <Download size={12} style={{ marginRight: 3 }} />
                        Ekspor Excel
                      </Btn>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Program Dana</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra Cakupan</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Tarif</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Sistem</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Sistem (Rp)</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta SKP</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal SKP (Rp)</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Rekon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRekapSKP.length === 0 ? (
                          <tr>
                            <td colSpan={9} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                              Tidak ada data rekap yang sesuai dengan filter yang dipilih.
                            </td>
                          </tr>
                        ) : (
                          filteredRekapSKP.map((item, idx) => {
                            const isTHT = item.danaType.startsWith("THT");
                            const isTNI = item.danaType.includes("TNI");
                            const badgeBg = isTNI ? (isTHT ? "#EFF6FF" : "#F5F3FF") : (isTHT ? "#F0FDF4" : "#ECFEFF");
                            const badgeBorder = isTNI ? (isTHT ? "#BFDBFE" : "#DDD6FE") : (isTHT ? "#BBF7D0" : "#A5F3FC");
                            const badgeTxt = isTNI ? (isTHT ? "#1D4ED8" : "#6D28D9") : (isTHT ? "#15803D" : "#0E7490");

                            return (
                              <tr key={item.id || idx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                                <td style={{ padding: "12px 14px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 800,
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        background: badgeBg,
                                        border: `1px solid ${badgeBorder}`,
                                        color: badgeTxt,
                                        whiteSpace: "nowrap"
                                      }}
                                    >
                                      {item.namaDana}
                                    </span>
                                    <span style={{ fontWeight: 700, color: COLORS.gray900 }}>{item.pilar}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 14px", color: COLORS.gray800, fontWeight: 600 }}>
                                  {item.matra}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: isTHT ? COLORS.blue : "#7C3AED" }}>
                                  {item.tarif}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtNum(item.pesertaSistem)} Jiwa
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                                  {fmtB(item.nominalSistem)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtNum(item.pesertaSKP)} Jiwa
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
                                  {fmtB(item.nominalSKP)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: item.selisihNominal < 0 ? "#DC2626" : "#065F46" }}>
                                  {item.selisihNominal === 0 ? "Rp 0" : fmtB(item.selisihNominal)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                  <span
                                    style={{
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                      padding: "2px 8px",
                                      borderRadius: 4,
                                      background: item.badgeColor === "green" ? "#ECFDF5" : "#FEF3C7",
                                      color: item.badgeColor === "green" ? "#065F46" : "#92400E"
                                    }}
                                  >
                                    {item.statusRekap}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                          <td colSpan={3} style={{ padding: "12px 14px", textAlign: "left", color: COLORS.gray900 }}>
                            TOTAL REKAPITULASI ({getDanaLabel()}):
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(filteredRekapSKP.reduce((acc, it) => acc + it.pesertaSistem, 0))} Jiwa
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800 }}>
                            {fmtB(filteredRekapSKP.reduce((acc, it) => acc + it.nominalSistem, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(filteredRekapSKP.reduce((acc, it) => acc + it.pesertaSKP, 0))} Jiwa
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blue }}>
                            {fmtB(filteredRekapSKP.reduce((acc, it) => acc + it.nominalSKP, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: filteredRekapSKP.reduce((acc, it) => acc + it.selisihNominal, 0) < 0 ? "#DC2626" : "#065F46" }}>
                            {filteredRekapSKP.reduce((acc, it) => acc + it.selisihNominal, 0) === 0
                              ? "Rp 0"
                              : fmtB(filteredRekapSKP.reduce((acc, it) => acc + it.selisihNominal, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", color: "#065F46" }}>
                            Lunas SKP-PFK
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                /* REKAP JKK ATAU JKM */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                        Rekapitulasi Tagihan vs Realisasi Kas {activeProgram === "JKK" ? "JKK" : "JKM"}
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                        Konsolidasi perhitungan potensi iuran pemberi kerja terhadap realisasi SP2D Kemenkeu RI • Satker: <b>{getSatkerLabel(filterSatker)}</b> • Golongan: <b>{getGolonganLabel(filterGolongan)}</b>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Btn size="xs" variant="outline" onClick={handleExportExcel}>
                        <Download size={12} style={{ marginRight: 3 }} />
                        Ekspor Excel
                      </Btn>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Program Iuran</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra Cakupan</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Tarif</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Potensi Sistem (Rp)</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Realisasi Kas SP2D (Rp)</th>
                          <th style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rekapJKKData
                          .filter((item) => item.program.includes(activeProgram))
                          .map((item, idx) => {
                            const g = getGolonganRatio(filterGolongan);
                            const p = Math.round(item.peserta * g.peserta);
                            const nomPot = Math.round(item.nominalPotensi * g.nominal);
                            const nomReal = Math.round(item.nominalRealisasi * g.nominal);

                            return (
                              <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                                <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                                  {item.program} {filterGolongan !== "Semua" && `(${g.label})`}
                                </td>
                                <td style={{ padding: "12px 14px", color: COLORS.gray800, fontWeight: 600 }}>
                                  {getSatkerLabel(filterSatker)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: currentTheme.primary }}>
                                  {item.tarif}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtNum(p)} Jiwa
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                                  {fmtB(nomPot)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: currentTheme.primary }}>
                                  {fmtB(nomReal)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                                  Rp 0
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                          <td colSpan={3} style={{ padding: "12px 14px", textAlign: "left", color: COLORS.gray900 }}>
                            TOTAL REKAPITULASI {activeProgram}:
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(Math.round((rekapJKKData.find(i => i.program.includes(activeProgram))?.peserta || 14328) * getGolonganRatio(filterGolongan).peserta))} Jiwa
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800 }}>
                            {fmtB(Math.round((rekapJKKData.find(i => i.program.includes(activeProgram))?.nominalPotensi || 0) * getGolonganRatio(filterGolongan).nominal))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: currentTheme.primary }}>
                            {fmtB(Math.round((rekapJKKData.find(i => i.program.includes(activeProgram))?.nominalRealisasi || 0) * getGolonganRatio(filterGolongan).nominal))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#065F46" }}>
                            Rp 0
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              B. TAMPILAN SECARA PER-MATRA (BNBA)
             ===================================================================== */}
          {viewModeKomparasi === "per_matra" && (
            <div>
              {activeProgram === "THT_PENSIUN" ? (
                /* PER-MATRA THT & PENSIUN 4 DANA */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Komparasi Data Kepesertaan vs API BNBA Kemenkeu Per-Matra</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#DBEAFE", color: "#1E40AF" }}>
                          {getDanaLabel()}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                        Perbandingan by-name-by-address personel per Satker terhadap potongan gaji induk Kemenkeu SPAN • Satker: <b>{getSatkerLabel(filterSatker)}</b> • Golongan: <b>{getGolonganLabel(filterGolongan)}</b>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>
                        Menampilkan: <b>{filteredBNBA.length} baris</b>
                      </span>
                      <Btn size="xs" variant="outline" onClick={handleExportExcel}>
                        <Download size={12} style={{ marginRight: 3 }} />
                        Ekspor Excel
                      </Btn>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Program Dana</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra / Kesatuan</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Tarif</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Sistem</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Sistem (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta BNBA</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal BNBA (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Jiwa</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBNBA.length === 0 ? (
                          <tr>
                            <td colSpan={10} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                              Tidak ada data komparasi yang sesuai dengan kombinasi filter yang dipilih.
                            </td>
                          </tr>
                        ) : (
                          filteredBNBA.map((row) => {
                            const isTHT = row.danaType.startsWith("THT");
                            const isTNI = row.danaType.includes("TNI");
                            const badgeBg = isTNI ? (isTHT ? "#EFF6FF" : "#F5F3FF") : (isTHT ? "#F0FDF4" : "#ECFEFF");
                            const badgeBorder = isTNI ? (isTHT ? "#BFDBFE" : "#DDD6FE") : (isTHT ? "#BBF7D0" : "#A5F3FC");
                            const badgeTxt = isTNI ? (isTHT ? "#1D4ED8" : "#6D28D9") : (isTHT ? "#15803D" : "#0E7490");

                            return (
                              <tr key={row.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                                <td style={{ padding: "12px 14px" }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 800,
                                      padding: "2px 8px",
                                      borderRadius: 4,
                                      background: badgeBg,
                                      border: `1px solid ${badgeBorder}`,
                                      color: badgeTxt,
                                      whiteSpace: "nowrap"
                                    }}
                                  >
                                    {row.namaDana}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                                  {row.matra}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: isTHT ? COLORS.blue : "#7C3AED" }}>
                                  {row.tarif}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtNum(row.pesertaSistem)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtB(row.nominalSistem)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtNum(row.pesertaBNBA)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                                  {fmtB(row.nominalBNBA)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: row.selisihJiwa === 0 ? "#065F46" : "#DC2626", fontWeight: 700 }}>
                                  {row.selisihJiwa === 0 ? "0" : row.selisihJiwa}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: row.selisihNominal === 0 ? "#065F46" : "#DC2626", fontWeight: 700 }}>
                                  {row.selisihNominal === 0 ? "Rp 0" : fmtB(row.selisihNominal)}
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                  <Btn
                                    size="xs"
                                    variant="outline"
                                    onClick={() => setSelectedMatraDetail(row)}
                                  >
                                    <Eye size={12} style={{ marginRight: 3 }} />
                                    Drilldown BNBA
                                  </Btn>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                          <td colSpan={3} style={{ padding: "12px 14px" }}>
                            TOTAL ({getDanaLabel()}):
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(filteredBNBA.reduce((a, b) => a + b.pesertaSistem, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtB(filteredBNBA.reduce((a, b) => a + b.nominalSistem, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(filteredBNBA.reduce((a, b) => a + b.pesertaBNBA, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtB(filteredBNBA.reduce((a, b) => a + b.nominalBNBA, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: filteredBNBA.reduce((a, b) => a + b.selisihJiwa, 0) < 0 ? "#DC2626" : "#065F46" }}>
                            {filteredBNBA.reduce((a, b) => a + b.selisihJiwa, 0)}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: filteredBNBA.reduce((a, b) => a + b.selisihNominal, 0) < 0 ? "#DC2626" : "#065F46" }}>
                            {fmtB(filteredBNBA.reduce((a, b) => a + b.selisihNominal, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center", color: COLORS.gray400 }}>—</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                /* PER-MATRA JKK ATAU JKM */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                        Komparasi Kepesertaan vs Realisasi Kas {activeProgram === "JKK" ? "JKK (0,24%)" : "JKM (0,20%)"} Per-Satker
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                        Perhitungan potensi iuran berdasarkan DIPA Belanja Pegawai terhadap realisasi pencairan kas SP2D Kemenkeu • Satker: <b>{getSatkerLabel(filterSatker)}</b> • Golongan: <b>{getGolonganLabel(filterGolongan)}</b>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>
                        Menampilkan: <b>{filteredKomparasiJKKMatra.length} Satker</b>
                      </span>
                      <Btn size="xs" variant="outline" onClick={handleExportExcel}>
                        <Download size={12} style={{ marginRight: 3 }} />
                        Ekspor Excel
                      </Btn>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra / Satuan Kerja</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Terlindungi</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Total Gaji Pokok (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Potensi {activeProgram} (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Realisasi Kas SP2D (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredKomparasiJKKMatra.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                              Tidak ada data komparasi yang sesuai dengan filter yang dipilih.
                            </td>
                          </tr>
                        ) : (
                          filteredKomparasiJKKMatra.map((row) => (
                            <tr key={row.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                              <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                                {row.matra}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                {fmtNum(row.peserta)} Jiwa
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                {fmtB(row.gapokTotal)}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: currentTheme.primary, fontWeight: 700 }}>
                                {fmtB(activeProgram === "JKK" ? row.nominalJKKSistem : row.nominalJKMSistem)}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#065F46" }}>
                                {fmtB(activeProgram === "JKK" ? row.realisasiKasJKK : row.realisasiKasJKM)}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                                Rp 0
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                          <td style={{ padding: "12px 14px" }}>TOTAL ({getSatkerLabel(filterSatker)}):</td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(filteredKomparasiJKKMatra.reduce((a, b) => a + b.peserta, 0))} Jiwa
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtB(filteredKomparasiJKKMatra.reduce((a, b) => a + b.gapokTotal, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: currentTheme.primary, fontSize: 13 }}>
                            {fmtB(filteredKomparasiJKKMatra.reduce((a, b) => a + (activeProgram === "JKK" ? b.nominalJKKSistem : b.nominalJKMSistem), 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46", fontSize: 13 }}>
                            {fmtB(filteredKomparasiJKKMatra.reduce((a, b) => a + (activeProgram === "JKK" ? b.realisasiKasJKK : b.realisasiKasJKM), 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46" }}>
                            Rp 0
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          KONTEN SUBTAB 3: HISTORY / RIWAYAT PROSES SELESAI (THE COMPLETE PROCESS)
          Menyimpan seluruh proses rekonsiliasi yang telah tuntas 100%:
          - Dokumen Berita Acara Rekonsiliasi (BAR) resmi
          - End-to-End audit trail (Complete Process)
          - Rincian realisasi kas SP2D & Surat Tagihan
          - Arsip data permanen untuk audit BPK & DJPb
         ========================================================================= */}
      {activeSubtab === "history" && (
        <div>
          {/* BAR INFORMASI & FILTER RIWAYAT */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              background: COLORS.white,
              padding: "14px 18px",
              borderRadius: 10,
              border: `1px solid ${COLORS.gray200}`,
              marginBottom: 16,
              boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
              flexWrap: "wrap",
              gap: "12px 16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700 }}>Periode Tanggal</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="date"
                    value={tglAwal}
                    onChange={(e) => setTglAwal(e.target.value)}
                    style={{ height: 36, padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5 }}
                  />
                  <span style={{ fontSize: 11.5, color: COLORS.gray400, fontWeight: 600 }}>s.d.</span>
                  <input
                    type="date"
                    value={tglAkhir}
                    onChange={(e) => setTglAkhir(e.target.value)}
                    style={{ height: 36, padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5 }}
                  />
                </div>
              </div>

              {/* Filter Dana PFK */}
              {activeProgram === "THT_PENSIUN" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 170 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700 }}>Pilihan Dana PFK</span>
                  <select
                    value={filterDanaPFK}
                    onChange={(e) => setFilterDanaPFK(e.target.value)}
                    style={{
                      height: 36,
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12.5,
                      background: COLORS.white,
                      fontWeight: 600,
                      color: COLORS.gray800
                    }}
                  >
                    <option value="Semua">Semua Surat Dana PFK</option>
                    <option value="THT_TNI">THT TNI</option>
                    <option value="THT_POLRI">THT POLRI</option>
                    <option value="PENSIUN_TNI">Pensiun TNI</option>
                    <option value="PENSIUN_POLRI">Pensiun POLRI</option>
                  </select>
                </div>
              )}

              {/* Pencarian */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 220 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray700 }}>Pencarian Dokumen</span>
                <div style={{ position: "relative", width: "100%" }}>
                  <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 11 }} />
                  <input
                    type="text"
                    placeholder={
                      activeProgram === "THT_PENSIUN"
                        ? "Cari surat / SKP / BAR / SP2D..."
                        : "Cari surat / Nota Dinas / BAR..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      height: 36,
                      padding: "6px 10px 6px 32px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12.5,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#065F46",
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  padding: "0 14px",
                  borderRadius: 6,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  height: 36,
                  boxSizing: "border-box"
                }}
              >
                <CheckCircle2 size={14} color="#059669" />
                <span>{currentHistoryCount} Dokumen Tuntas (BAR Sah)</span>
              </div>
            </div>
          </div>

          {/* TABEL HISTORY SESUAI PROGRAM AKTIF */}
          {activeProgram === "THT_PENSIUN" ? (
            /* TABEL HISTORY THT & PENSIUN - DIPISAH PER DANA */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jenis Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat SKP-PFK Kemenkeu</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Penerimaan Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tuntas (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Berita Acara (BAR)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Proses</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistorySKP.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: 36, textAlign: "center", color: COLORS.gray500 }}>
                          <History size={32} color={COLORS.gray400} style={{ marginBottom: 8 }} />
                          <div style={{ fontWeight: 600 }}>Belum ada riwayat rekonsiliasi yang tuntas pada periode ini.</div>
                          <div style={{ fontSize: 11.5, color: COLORS.gray400, marginTop: 4 }}>
                            Tagihan di tab Monitoring yang telah selesai direkonsiliasi otomatis tersimpan permanen di Tab History.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredHistorySKP.map((item) => {
                        const isTHT = item.danaType?.startsWith("THT");

                        return (
                          <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.gray900 }}>
                                {item.namaDana || "Dana PFK"}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                                Tarif {item.tarif || (isTHT ? "3,25%" : "4,75%")}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12.5, color: COLORS.gray900 }}>
                                {item.noSuratTagihan}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                                Tgl Surat: {item.tglSuratTagihan}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
                                {item.noSKP}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                                Tgl SKP: {item.tglSKP}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, color: COLORS.gray900 }}>
                                {item.tglTerimaDana}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2, fontFamily: "monospace" }}>
                                SP2D: {item.noSP2D} • {item.bankTujuan.split(" - ")[0]}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: COLORS.blueDark }}>
                                {fmtB(item.nominalDanaSKP)}
                              </div>
                              <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                                {fmtNum(item.peserta)} Personel • Tarif {item.tarif || (isTHT ? "3,25%" : "4,75%")}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                                {item.noBAR}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                                Selesai: {item.tglSelesai}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: 4,
                                  background: "#ECFDF5",
                                  color: "#065F46",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4
                                }}
                              >
                                <CheckCircle2 size={12} color="#059669" />
                                {item.statusProses}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "center" }}>
                              <div style={{ display: "flex", justifyContent: "center" }}>
                                <Btn
                                  size="xs"
                                  variant="outline"
                                  style={{ padding: "3px 8px", fontSize: 11, fontWeight: 600, gap: 4 }}
                                  onClick={() => openSuratTagihanPreview(item)}
                                >
                                  <FileText size={11} />
                                  Surat Tagihan
                                </Btn>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={4} style={{ padding: "12px 14px", textAlign: "right" }}>
                        TOTAL DANA TUNTAS TEREPOSITORI ({filteredHistorySKP.length} Surat Tagihan):
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.blueDark, fontSize: 13 }}>
                        {fmtB(filteredHistorySKP.reduce((acc, it) => acc + (it.nominalDanaSKP || 0), 0))}
                      </td>
                      <td colSpan={3} style={{ padding: "12px 14px", color: "#065F46", fontSize: 11.5 }}>
                        ✅ Seluruh Berita Acara Rekonsiliasi (BAR) Sah & Tervalidasi DJPb Kemenkeu RI
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            /* TABEL HISTORY JKK ATAU JKM */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jenis Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nota Dinas Kepesertaan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Penerimaan Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tuntas (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Berita Acara (BAR)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Proses</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeProgram === "JKK" ? filteredHistoryJKK : filteredHistoryJKM).length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: 36, textAlign: "center", color: COLORS.gray500 }}>
                          <History size={32} color={COLORS.gray400} style={{ marginBottom: 8 }} />
                          <div style={{ fontWeight: 600 }}>Belum ada riwayat proses {activeProgram} yang tuntas pada periode ini.</div>
                          <div style={{ fontSize: 11.5, color: COLORS.gray400, marginTop: 4 }}>
                            Tagihan di tab Monitoring yang telah selesai direkonsiliasi otomatis tersimpan permanen di Tab History.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      (activeProgram === "JKK" ? filteredHistoryJKK : filteredHistoryJKM).map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.gray900 }}>
                              {item.program}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                              Tarif {item.program === "JKK" ? "0,24%" : "0,20%"}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900 }}>
                              {item.noSuratTagihan}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                              Tgl Surat: {item.tglSuratTagihan}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontFamily: "monospace", fontWeight: 700, color: currentTheme.primary }}>
                              {item.noNotaDinas}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                              Tgl ND: {item.tglNotaDinas}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontWeight: 700, color: COLORS.gray900 }}>
                              {item.tglTerimaDana}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2, fontFamily: "monospace" }}>
                              SP2D: {item.noSP2D} • {item.bankTujuan.split(" - ")[0]}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: currentTheme.primary }}>
                              {fmtB(item.nominalDiterima || item.nominalTagihan)}
                            </div>
                            <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                              {fmtNum(item.peserta)} Personel (6 Matra)
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                              {item.noBAR}
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                              Selesai: {item.tglSelesai}
                            </div>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: 4,
                                background: "#ECFDF5",
                                color: "#065F46",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              <CheckCircle2 size={12} color="#059669" />
                              {item.statusProses}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                style={{ padding: "3px 8px", fontSize: 11, fontWeight: 600, gap: 4 }}
                                onClick={() => openSuratTagihanPreview(item)}
                              >
                                <FileText size={11} />
                                Surat Tagihan
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={4} style={{ padding: "12px 14px", textAlign: "right" }}>
                        TOTAL REALISASI TUNTAS {activeProgram}:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: currentTheme.primary, fontSize: 13 }}>
                        {fmtB((activeProgram === "JKK" ? filteredHistoryJKK : filteredHistoryJKM).reduce((acc, it) => acc + (it.nominalDiterima || it.nominalTagihan || 0), 0))}
                      </td>
                      <td colSpan={3} style={{ padding: "12px 14px", color: "#065F46", fontSize: 11.5 }}>
                        ✅ Seluruh Berita Acara Rekonsiliasi (BAR) Sah & Tervalidasi DJPb Kemenkeu RI
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
