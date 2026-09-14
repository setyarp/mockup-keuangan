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
  FileCheck
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Table, Badge, Btn, PreviewModal, SatkerModal } from "../components/common";
import {
  SATKER_THT_PENSIUN_ALL,
  generateProportionalSatkerList
} from "../constants/satkerData";

export const RekonsIuran = () => {
  // 3 TAB PROGRAM UTAMA:
  // "THT_PENSIUN" : THT & Pensiun (SKP-PFK 8,00%) - Tagihan Tunggal Resmi
  // "JKK"         : Jaminan Kecelakaan Kerja (0,24%)
  // "JKM"         : Jaminan Kematian (0,20%)
  const [activeProgram, setActiveProgram] = useState("THT_PENSIUN");

  // SUBTAB PER PROGRAM:
  // "monitoring" : Monitoring Penerimaan Dana
  // "komparasi"  : Komparasi Data Kepesertaan (1 tab saja, filter view: Secara Rekap / Secara Per-Matra)
  // "history"    : Riwayat Proses Selesai (The Complete Process & Berita Acara Rekonsiliasi)
  const [activeSubtab, setActiveSubtab] = useState("monitoring");

  // FILTER TAMPILAN PADA TAB KOMPARASI:
  // "rekap" | "per_matra"
  const [viewModeKomparasi, setViewModeKomparasi] = useState("rekap");

  // State Filter & Search
  const [filterMatra, setFilterMatra] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;

  // Preview Modal, Drilldown & Toast
  const [preview, setPreview] = useState(null);
  const [satkerModalData, setSatkerModalData] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isSyncingBNBA, setIsSyncingBNBA] = useState(false);
  const [selectedMatraDetail, setSelectedMatraDetail] = useState(null);

  // State Modal Complete Process & Konfirmasi Selesai
  const [selectedCompleteProcess, setSelectedCompleteProcess] = useState(null);
  const [confirmCompleteItem, setConfirmCompleteItem] = useState(null);

  // Modal Input Realisasi Tagihan THT & Pensiun
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputError, setInputError] = useState("");
  const [inputForm, setInputForm] = useState({
    noSuratTagihan: "",
    tglSuratTagihan: "",
    noSKP: "",
    tglSKP: "",
    jenisIuran: "Tagihan Iuran THT & Pensiun Susulan (Batch 2)",
    tglTerimaDana: "",
    noSP2D: "",
    bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
    nominalDanaSKP: ""
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
      title: "THT & Pensiun (SKP-PFK 8,00%)",
      badgeText: "Tagihan Tunggal"
    },
    JKK: {
      primary: "#047857",
      lightBg: "#ECFDF5",
      badgeBg: "#D1FAE5",
      badgeColor: "#065F46",
      title: "Jaminan Kecelakaan Kerja (JKK 0,24%)",
      badgeText: "Tarif 0,24%"
    },
    JKM: {
      primary: "#0D9488",
      lightBg: "#F0FDFA",
      badgeBg: "#CCFBF1",
      badgeColor: "#0F766E",
      title: "Jaminan Kematian (JKM 0,20%)",
      badgeText: "Tarif 0,20%"
    }
  }[activeProgram];

  // =========================================================================
  // DATASET 1: MONITORING & HISTORY PENERIMAAN DANA SKP-PFK (THT & PENSIUN)
  // Aturan: Hanya yang lengkap seluruh komponen fieldnya yang masuk list
  // =========================================================================
  const [monitoringSKPList, setMonitoringSKPList] = useState([
    {
      id: "SKP-002",
      jenisIuran: "Tagihan Iuran THT & Pensiun Susulan (Batch 2)",
      kodeTarif: "8,00% Terpadu (THT 3,25% + Pensiun 4,75%)",
      matraUtama: "TNI, Kemhan & POLRI (Susulan Mutasi Koarmada II)",
      noSuratTagihan: "002/ASABRI/TGH-THT-PEN-SUS/VII/2026",
      tglSuratTagihan: "18 Juli 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-190/PB.2/2026",
      tglSKP: "17 Juli 2026",
      tglTerimaDana: "21 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260721-009412",
      nominalDanaSKP: 3120000000,
      danaTHT: 1267500000,
      danaPensiun: 1852500000,
      nominalDiterima: 3120000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: generateProportionalSatkerList(3120000000, SATKER_THT_PENSIUN_ALL)
    }
  ]);

  const [historySKPList, setHistorySKPList] = useState([
    {
      id: "HIST-SKP-001",
      jenisIuran: "Tagihan Iuran THT & Pensiun (Gaji Induk)",
      kodeTarif: "8,00% Terpadu (THT 3,25% + Pensiun 4,75%)",
      matraUtama: "TNI, Kemhan & POLRI (Keseluruhan SKP-PFK)",
      noSuratTagihan: "001/ASABRI/TGH-THT-PEN/VII/2026",
      tglSuratTagihan: "15 Juli 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 Juli 2026",
      tglTerimaDana: "18 Juli 2026",
      bankTujuan: "Bank Mandiri & BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260718-008921",
      nominalDanaSKP: 105280000000,
      danaTHT: 42765000000,
      danaPensiun: 62515000000,
      nominalDiterima: 105280000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "31 Juli 2026",
      noBAR: "BAR-01/REKON-THT-PEN/VII/2026",
      keterangan: "Proses rekonsiliasi tuntas 100%. Komparasi data kepesertaan 5 matra cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit.",
      satkerList: SATKER_THT_PENSIUN_ALL
    },
    {
      id: "HIST-SKP-002",
      jenisIuran: "Tagihan Iuran THT & Pensiun (Gaji Induk Juni 2026)",
      kodeTarif: "8,00% Terpadu (THT 3,25% + Pensiun 4,75%)",
      matraUtama: "TNI, Kemhan & POLRI (Keseluruhan SKP-PFK)",
      noSuratTagihan: "098/ASABRI/TGH-THT-PEN/VI/2026",
      tglSuratTagihan: "15 Juni 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-142/PB.2/2026",
      tglSKP: "14 Juni 2026",
      tglTerimaDana: "18 Juni 2026",
      bankTujuan: "Bank Mandiri & BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260618-007142",
      nominalDanaSKP: 104850000000,
      danaTHT: 42591000000,
      danaPensiun: 62259000000,
      nominalDiterima: 104850000000,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Selesai (Completed)",
      tglSelesai: "30 Juni 2026",
      noBAR: "BAR-06/REKON-THT-PEN/VI/2026",
      keterangan: "Proses rekonsiliasi tuntas 100%. Komparasi data kepesertaan 5 matra cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit.",
      satkerList: SATKER_THT_PENSIUN_ALL
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
    const nomTHT = Math.round(nom * (3.25 / 8.0));
    const nomPensiun = nom - nomTHT;

    const newRecord = {
      id: `SKP-${Date.now().toString().slice(-4)}`,
      jenisIuran: inputForm.jenisIuran,
      kodeTarif: "8,00% Terpadu (THT 3,25% + Pensiun 4,75%)",
      matraUtama: "TNI, Kemhan & POLRI (Keseluruhan SKP-PFK)",
      noSuratTagihan: inputForm.noSuratTagihan.trim(),
      tglSuratTagihan: inputForm.tglSuratTagihan.trim(),
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: inputForm.noSKP.trim(),
      tglSKP: inputForm.tglSKP.trim(),
      tglTerimaDana: inputForm.tglTerimaDana.trim(),
      bankTujuan: inputForm.bankTujuan,
      noSP2D: inputForm.noSP2D.trim(),
      nominalDanaSKP: nom,
      danaTHT: nomTHT,
      danaPensiun: nomPensiun,
      nominalDiterima: nom,
      statusDana: "Dana Masuk (Lunas)",
      statusProses: "Dalam Monitoring",
      satkerList: generateProportionalSatkerList(nom, SATKER_THT_PENSIUN_ALL)
    };

    setMonitoringSKPList((prev) => [...prev, newRecord]);
    setShowInputModal(false);
    setInputError("");
    setInputForm({
      noSuratTagihan: "",
      tglSuratTagihan: "",
      noSKP: "",
      tglSKP: "",
      jenisIuran: "Tagihan Iuran THT & Pensiun Susulan (Batch 2)",
      tglTerimaDana: "",
      noSP2D: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: ""
    });
    setNotice(`Data penerimaan dana ${newRecord.noSuratTagihan} berhasil dimasukkan ke dalam daftar monitoring!`);
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
      keterangan: "Realisasi SP2D 100% sesuai potensi DIPA Belanja Pegawai 5 Matra. BAR penetapan iuran JKK selesai."
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
      keterangan: "Realisasi SP2D 100% sesuai potensi DIPA Belanja Pegawai 5 Matra. BAR penetapan iuran JKM selesai."
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
    const tglHariIni = "14 September 2026";
    const kodeProg = activeProgram === "THT_PENSIUN" ? "THT-PEN" : activeProgram;
    const noBARBaru = `BAR-0${Math.floor(Math.random() * 8) + 2}/REKON-${kodeProg}/VII/2026`;

    if (activeProgram === "THT_PENSIUN") {
      setMonitoringSKPList((prev) => prev.filter((x) => x.id !== item.id));
      setHistorySKPList((prev) => [
        {
          ...item,
          statusProses: "Selesai (Completed)",
          tglSelesai: tglHariIni,
          noBAR: noBARBaru,
          keterangan: "Proses rekonsiliasi dan monitoring telah rampung 100%. Komparasi data kepesertaan cocok dan Berita Acara Rekonsiliasi (BAR) telah terbit."
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
    setNotice(`Proses monitoring ${item.noSuratTagihan} berhasil diselesaikan! Dokumen tersimpan di Tab History dengan nomor Berita Acara: ${noBARBaru}.`);
    setTimeout(() => setNotice(null), 6000);
  };

  // Helper Preview Surat Tagihan
  const openSuratTagihanPreview = (item) => {
    if (activeProgram === "THT_PENSIUN") {
      setPreview({
        title: `Surat Tagihan Terpadu — ${item.noSuratTagihan}`,
        subtitle: `Kemenkeu RI / KPPN Khusus Jakarta II • Periode Juli 2026`,
        type: "surat",
        fileName: `Surat_Tagihan_${item.noSuratTagihan.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          noSurat: item.noSuratTagihan,
          tanggal: item.tglSuratTagihan,
          dasarSKP: {
            noSurat: item.noSKP,
            tglSurat: item.tglSKP
          },
          items: [
            { jenis: "Iuran THT (3,25%)", peserta: "427.620", nominal: fmtB(item.danaTHT) },
            { jenis: "Iuran Pensiun (4,75%)", peserta: "427.620", nominal: fmtB(item.danaPensiun) }
          ],
          totalNominal: fmtB(item.nominalDanaSKP),
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
        hariTanggal: item.tglSelesai ? `Jumat, ${item.tglSelesai}` : "Jumat, 31 Juli 2026",
        programJudul: progTitle.toUpperCase(),
        periode: "Juli 2026",
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
  // DATASET KOMPARASI THT & PENSIUN (8,00%)
  // =========================================================================
  const rekapSKPData = [
    {
      pilar: "Surat Tagihan THT & Pensiun (Gaji Induk)",
      deskripsi: "1 Surat Tagihan Resmi (No. 001/ASABRI/TGH-THT-PEN/VII/2026) — TNI, Kemhan & POLRI",
      tarif: "8,00% (THT 3,25% + PEN 4,75%)",
      pesertaSistem: 427620,
      nominalSistem: 105230000000,
      pesertaSKP: 427700,
      nominalSKP: 105280000000,
      selisihNominal: -50000000,
      persenSelisih: -0.05,
      analisis: "Selisih 80 personel TNI AL mutasi Koarmada II. Seluruh komponen field telah tervalidasi dan tercatat dalam daftar tagihan resmi.",
      statusRekap: "Terverifikasi Lengkap"
    }
  ];

  const bnbaMatraData = [
    {
      id: "BNBA-01",
      matra: "TNI AD",
      jenisIuran: "THT & Pensiun (8,00%)",
      pesertaSistem: 154200,
      nominalSistem: 37950000000,
      pesertaBNBA: 154200,
      nominalBNBA: 37950000000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Seluruh personel 154.200 terpetakan by NRP & potongan 8,00% sesuai penuh."
    },
    {
      id: "BNBA-02",
      matra: "TNI AL",
      jenisIuran: "THT & Pensiun (8,00%)",
      pesertaSistem: 68450,
      nominalSistem: 16805000000,
      pesertaBNBA: 68530,
      nominalBNBA: 16855000000,
      selisihJiwa: -80,
      selisihNominal: -50000000,
      status: "Selisih Mutasi",
      catatan: "80 personel mutasi masuk Koarmada II belum selesai update SK kepesertaan."
    },
    {
      id: "BNBA-03",
      matra: "TNI AU",
      jenisIuran: "THT & Pensiun (8,00%)",
      pesertaSistem: 42150,
      nominalSistem: 10380000000,
      pesertaBNBA: 42150,
      nominalBNBA: 10380000000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Data prajurit Lanud & Kohanudnas potongan 8,00% tervalidasi."
    },
    {
      id: "BNBA-04",
      matra: "Kemhan (PNS/PPPK)",
      jenisIuran: "THT & Pensiun (8,00%)",
      pesertaSistem: 20620,
      nominalSistem: 5070000000,
      pesertaBNBA: 20620,
      nominalBNBA: 5070000000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "ASN Kemhan terintegrasi NIP & potongan 8,00% BKN-Kemenkeu."
    },
    {
      id: "BNBA-05",
      matra: "POLRI",
      jenisIuran: "THT & Pensiun (8,00%)",
      pesertaSistem: 142200,
      nominalSistem: 35030000000,
      pesertaBNBA: 142200,
      nominalBNBA: 35030000000,
      selisihJiwa: 0,
      selisihNominal: 0,
      status: "Match (100%)",
      catatan: "Seluruh Polda & Mabes Polri cocok dengan penetapan PFK Gaji Web Polri."
    }
  ];

  const sampleBNBADetail = [
    { nrp: "31080194820188", nama: "Kapten Laut (T) Bambang Suryadi", pangkat: "Kapten", satker: "Koarmada II (TNI AL)", gapok: 4250000, tht: 138125, pensiun: 201875, totalPotongan: 340000, status: "Cocok (API Kemenkeu)" },
    { nrp: "31090284710291", nama: "Lettu Laut (P) Dimas Arya", pangkat: "Lettu", satker: "KRI Frans Kaisiepo-368", gapok: 3820000, tht: 124150, pensiun: 181450, totalPotongan: 305600, status: "Cocok (API Kemenkeu)" },
    { nrp: "31110398471099", nama: "Serka Nav Hendra Pratama", pangkat: "Serka", satker: "Lantamal V Surabaya", gapok: 3410000, tht: 110825, pensiun: 161975, totalPotongan: 272800, status: "Mutasi Masuk (Perlu SK)" },
    { nrp: "31120489510103", nama: "Kopda Bah Faisal Reza", pangkat: "Kopda", satker: "Koarmada II (TNI AL)", gapok: 2980000, tht: 96850, pensiun: 141550, totalPotongan: 238400, status: "Mutasi Masuk (Perlu SK)" },
    { nrp: "31070081290382", nama: "Mayor Cba Hendrawan", pangkat: "Mayor", satker: "Bekangdam Jaya (TNI AD)", gapok: 4890000, tht: 158925, pensiun: 232275, totalPotongan: 391200, status: "Cocok (API Kemenkeu)" }
  ];

  const handleSyncBNBA = () => {
    setIsSyncingBNBA(true);
    setTimeout(() => {
      setIsSyncingBNBA(false);
      setNotice("Sinkronisasi real-time dengan API BNBA SPAN Kemenkeu berhasil diselesaikan (5 Matra terhubung).");
      setTimeout(() => setNotice(null), 5000);
    }, 1200);
  };

  // =========================================================================
  // DATASET KOMPARASI JKK & JKM
  // =========================================================================
  const rekapJKKData = [
    { program: "Jaminan Kecelakaan Kerja (JKK)", tarif: "0,24%", noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026", peserta: 14328, nominalPotensi: 2630000000, nominalRealisasi: 2630000000, selisih: 0, status: "Terverifikasi Lunas (100%)", analisis: "Seluruh alokasi iuran JKK dari 5 Matra telah disalurkan penuh oleh Kemenkeu sesuai SP2D-260728-004128." },
    { program: "Jaminan Kematian (JKM)", tarif: "0,20%", noSuratTagihan: "003/ASABRI/TGH-JKM/VII/2026", peserta: 14328, nominalPotensi: 2210000000, nominalRealisasi: 2210000000, selisih: 0, status: "Terverifikasi Lunas (100%)", analisis: "Seluruh alokasi iuran JKM dari 5 Matra telah disalurkan penuh oleh Kemenkeu sesuai SP2D-260728-004129." }
  ];

  const komparasiJKKMatraData = [
    { id: "KOMP-JKK-01", matra: "TNI AD", peserta: 3250, gapokTotal: 260000000000, nominalJKKSistem: 624000000, nominalJKMSistem: 520000000, realisasiKasJKK: 624000000, realisasiKasJKM: 520000000, selisih: 0, status: "Match (100%)", catatan: "SP2D KPPN sesuai alokasi DIPA Belanja Pegawai TNI AD." },
    { id: "KOMP-JKK-02", matra: "TNI AL", peserta: 1420, gapokTotal: 113600000000, nominalJKKSistem: 272640000, nominalJKMSistem: 227200000, realisasiKasJKK: 272640000, realisasiKasJKM: 227200000, selisih: 0, status: "Match (100%)", catatan: "Lunas tervalidasi KPPN Khusus Jakarta II." },
    { id: "KOMP-JKK-03", matra: "TNI AU", peserta: 1180, gapokTotal: 94400000000, nominalJKKSistem: 226560000, nominalJKMSistem: 188800000, realisasiKasJKK: 226560000, realisasiKasJKM: 188800000, selisih: 0, status: "Match (100%)", catatan: "Lunas tervalidasi KPPN Khusus Jakarta II." },
    { id: "KOMP-JKK-04", matra: "Kemhan (PNS/PPPK)", peserta: 520, gapokTotal: 41600000000, nominalJKKSistem: 99840000, nominalJKMSistem: 83200000, realisasiKasJKK: 99840000, realisasiKasJKM: 83200000, selisih: 0, status: "Match (100%)", catatan: "Sesuai potongan belanja pegawai satker Kemhan Pusat." },
    { id: "KOMP-JKK-05", matra: "POLRI", peserta: 7958, gapokTotal: 586200000000, nominalJKKSistem: 1406960000, nominalJKMSistem: 1190760000, realisasiKasJKK: 1406960000, realisasiKasJKM: 1190760000, selisih: 0, status: "Match (100%)", catatan: "Lunas 100% SP2D Kemenkeu ke giro penampungan Mandiri." }
  ];

  // Filtering Monitoring per Program
  const filteredMonitoringSKP = monitoringSKPList.filter((item) => {
    if (searchTerm && !item.noSuratTagihan.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noSKP.toLowerCase().includes(searchTerm.toLowerCase()) && !item.jenisIuran.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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
    if (searchTerm && !item.noSuratTagihan.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noSKP.toLowerCase().includes(searchTerm.toLowerCase()) && !item.noBAR?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
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

  const filteredBNBA = bnbaMatraData.filter((item) => {
    if (filterMatra !== "Semua" && item.matra !== filterMatra) return false;
    return true;
  });

  // Handler Global Ekspor Excel
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
        title: `Ekspor Riwayat Proses Selesai (History) — ${activeProgram}`,
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

    if (activeProgram === "THT_PENSIUN") {
      if (activeSubtab === "monitoring") {
        setPreview({
          title: `Ekspor Monitoring Penerimaan SKP-PFK`,
          subtitle: `Periode ${filterPeriode}`,
          type: "table",
          fileName: `Monitoring_Penerimaan_SKP_PFK_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
          content: {
            columns: ["Surat Tagihan Resmi", "Nomor SKP-PFK", "Nomor SP2D", "Tgl Realisasi", "Nominal SKP", "Status"],
            rows: filteredMonitoringSKP.map((m) => [m.noSuratTagihan, m.noSKP, m.noSP2D, m.tglTerimaDana, fmtB(m.nominalDanaSKP), m.statusDana]),
            totalRows: filteredMonitoringSKP.length
          }
        });
      } else {
        setPreview({
          title: `Ekspor Komparasi Data Kepesertaan THT & Pensiun`,
          subtitle: `Mode: ${viewModeKomparasi === "rekap" ? "Secara Rekap" : "Secara Per-Matra"}`,
          type: "table",
          fileName: `Komparasi_THT_Pensiun_${viewModeKomparasi}.xlsx`,
          content: {
            columns: ["Matra / Komponen", "Peserta Sistem", "Nominal Sistem", "Peserta BNBA / SKP", "Nominal BNBA / SKP", "Selisih", "Status"],
            rows: viewModeKomparasi === "rekap"
              ? rekapSKPData.map(r => [r.pilar, `${fmtNum(r.pesertaSistem)} Jiwa`, fmtB(r.nominalSistem), `${fmtNum(r.pesertaSKP)} Jiwa`, fmtB(r.nominalSKP), fmtB(r.selisihNominal), r.statusRekap])
              : bnbaMatraData.map(b => [b.matra, `${fmtNum(b.pesertaSistem)} Jiwa`, fmtB(b.nominalSistem), `${fmtNum(b.pesertaBNBA)} Jiwa`, fmtB(b.nominalBNBA), fmtB(b.selisihNominal), b.status]),
            totalRows: viewModeKomparasi === "rekap" ? rekapSKPData.length : bnbaMatraData.length
          }
        });
      }
    } else {
      const prog = activeProgram;
      const targetList = prog === "JKK" ? filteredMonitoringJKKOnly : filteredMonitoringJKMOnly;
      if (activeSubtab === "monitoring") {
        setPreview({
          title: `Ekspor Monitoring Realisasi ${prog}`,
          subtitle: `Periode ${filterPeriode}`,
          type: "table",
          fileName: `Monitoring_Realisasi_${prog}_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
          content: {
            columns: ["Surat Tagihan Resmi", "Nota Dinas Kepesertaan", "Nomor SP2D", "Tgl Cair", "Nominal Realisasi", "Status"],
            rows: targetList.map((m) => [m.noSuratTagihan, m.noNotaDinas, m.noSP2D, m.tglTerimaDana, fmtB(m.nominalDiterima), m.statusDana]),
            totalRows: targetList.length
          }
        });
      } else {
        setPreview({
          title: `Ekspor Komparasi Data Kepesertaan ${prog}`,
          subtitle: `Mode: ${viewModeKomparasi === "rekap" ? "Secara Rekap" : "Secara Per-Matra"}`,
          type: "table",
          fileName: `Komparasi_${prog}_${viewModeKomparasi}.xlsx`,
          content: {
            columns: ["Matra / Program", "Peserta", "Total Gaji Pokok", `Potensi ${prog}`, `Realisasi SP2D`, "Selisih", "Status"],
            rows: viewModeKomparasi === "rekap"
              ? [rekapJKKData.find(r => r.program.includes(prog))].map(r => [r.program, `${fmtNum(r.peserta)} Jiwa`, "—", fmtB(r.nominalPotensi), fmtB(r.nominalRealisasi), "Rp 0", r.status])
              : komparasiJKKMatraData.map(k => [k.matra, `${fmtNum(k.peserta)} Jiwa`, fmtB(k.gapokTotal), fmtB(prog === "JKK" ? k.nominalJKKSistem : k.nominalJKMSistem), fmtB(prog === "JKK" ? k.realisasiKasJKK : k.realisasiKasJKM), "Rp 0", k.status]),
            totalRows: viewModeKomparasi === "rekap" ? 1 : komparasiJKKMatraData.length
          }
        });
      }
    }
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
                        : "Nota Dinas penetapan kepesertaan divalidasi terhadap daftar personel terlindungi dan basis gaji pokok 5 Matra kedinasan."}
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
                        Komparasi Data Kepesertaan (5 Matra Kedinasan)
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", background: "#E0E7FF", color: "#3730A3", borderRadius: 4 }}>
                        Langkah 4
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>
                      Pencocokan rekonsiliasi antara realisasi kas yang masuk dengan rincian peserta per Matra (TNI AD, TNI AL, TNI AU, Kemhan, POLRI).
                    </div>
                    <div style={{ marginTop: 8, padding: "8px 12px", background: "#F8FAFC", borderRadius: 6, fontSize: 11.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>Cakupan Matra: <b>5 Matra (TNI AD, AL, AU, Kemhan, POLRI)</b></div>
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

      {/* Modal Input Realisasi SKP-PFK */}
      {showInputModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(2px)"
          }}
          onClick={() => setShowInputModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.blue
                  }}
                >
                  <Plus size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                    Input Realisasi Penerimaan Tagihan SKP-PFK
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowInputModal(false)}
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

              {inputError && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: "10px 14px",
                    background: "#FEF2F2",
                    border: `1px solid #F87171`,
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#B91C1C",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >
                  <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{inputError}</span>
                </div>
              )}

              <form onSubmit={handleSaveNewSKP}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor Surat Tagihan Resmi <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 002/ASABRI/TGH-THT-PEN-SUS/VII/2026"
                      value={inputForm.noSuratTagihan}
                      onChange={(e) => setInputForm({ ...inputForm, noSuratTagihan: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal Surat Tagihan <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 16 Juli 2026"
                      value={inputForm.tglSuratTagihan}
                      onChange={(e) => setInputForm({ ...inputForm, tglSuratTagihan: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor SKP-PFK Kemenkeu <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: S-185/PB.2/2026"
                      value={inputForm.noSKP}
                      onChange={(e) => setInputForm({ ...inputForm, noSKP: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal SKP-PFK <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 15 Juli 2026"
                      value={inputForm.tglSKP}
                      onChange={(e) => setInputForm({ ...inputForm, tglSKP: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                    Jenis Iuran <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <select
                    value={inputForm.jenisIuran}
                    onChange={(e) => setInputForm({ ...inputForm, jenisIuran: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                  >
                    <option value="Tagihan Iuran THT & Pensiun (Gaji Induk)">Tagihan Iuran THT & Pensiun (Gaji Induk)</option>
                    <option value="Tagihan Iuran THT & Pensiun Susulan (Batch 2)">Tagihan Iuran THT & Pensiun Susulan (Batch 2)</option>
                    <option value="Tagihan Iuran THT & Pensiun Selisih Kenaikan Gaji">Tagihan Iuran THT & Pensiun Selisih Kenaikan Gaji</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal Penerimaan Dana Masuk <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 20 Juli 2026"
                      value={inputForm.tglTerimaDana}
                      onChange={(e) => setInputForm({ ...inputForm, tglTerimaDana: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor SP2D Kemenkeu <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: SP2D-260720-009104"
                      value={inputForm.noSP2D}
                      onChange={(e) => setInputForm({ ...inputForm, noSP2D: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                    Bank Rekening Giro Penampungan <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={inputForm.bankTujuan}
                    onChange={(e) => setInputForm({ ...inputForm, bankTujuan: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                    Nominal Dana dari SKP-PFK (Rp) <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 3120000000"
                    value={inputForm.nominalDanaSKP}
                    onChange={(e) => setInputForm({ ...inputForm, nominalDanaSKP: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                  />
                  {inputForm.nominalDanaSKP && Number(inputForm.nominalDanaSKP) > 0 && (
                    <div style={{ fontSize: 11, color: COLORS.blue, marginTop: 4 }}>
                      Alokasi: THT (3,25%) = {fmtB(Math.round(Number(inputForm.nominalDanaSKP) * 3.25 / 8.0))} • Pensiun (4,75%) = {fmtB(Number(inputForm.nominalDanaSKP) - Math.round(Number(inputForm.nominalDanaSKP) * 3.25 / 8.0))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 16 }}>
                  <Btn type="button" variant="ghost" size="sm" onClick={() => setShowInputModal(false)}>
                    Batal
                  </Btn>
                  <Btn type="submit" variant="primary" size="sm">
                    <Check size={14} style={{ marginRight: 4 }} />
                    Simpan & Masukkan ke List
                  </Btn>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Realisasi JKK & JKM */}
      {showInputModalJKK && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(2px)"
          }}
          onClick={() => setShowInputModalJKK(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: inputFormJKK.program === "JKK" ? "#ECFDF5" : "#F0FDFA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: inputFormJKK.program === "JKK" ? "#047857" : "#0D9488"
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                    Input Realisasi Tagihan Iuran {inputFormJKK.program} ({inputFormJKK.program === "JKK" ? "0,24%" : "0,20%"})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowInputModalJKK(false)}
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

              {inputErrorJKK && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: "10px 14px",
                    background: "#FEF2F2",
                    border: `1px solid #F87171`,
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#B91C1C",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >
                  <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{inputErrorJKK}</span>
                </div>
              )}

              <form onSubmit={handleSaveNewJKK}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Program Iuran <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={inputFormJKK.program === "JKK" ? "Jaminan Kecelakaan Kerja (JKK 0,24%)" : "Jaminan Kematian (JKM 0,20%)"}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, background: "#F1F5F9", fontSize: 12, fontWeight: 700, color: COLORS.gray700, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Jumlah Peserta Terlindungi <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 14328"
                      value={inputFormJKK.peserta}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, peserta: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor Surat Tagihan <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Contoh: 004/ASABRI/TGH-${inputFormJKK.program}/VIII/2026`}
                      value={inputFormJKK.noSuratTagihan}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, noSuratTagihan: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal Surat Tagihan <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 26 Juli 2026"
                      value={inputFormJKK.tglSuratTagihan}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, tglSuratTagihan: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor Nota Dinas Kepesertaan <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Contoh: ND-355/KPS/VII/2026`}
                      value={inputFormJKK.noNotaDinas}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, noNotaDinas: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal Nota Dinas Kepesertaan <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 25 Juli 2026"
                      value={inputFormJKK.tglNotaDinas}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, tglNotaDinas: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal Penerimaan Dana Masuk <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 29 Juli 2026"
                      value={inputFormJKK.tglTerimaDana}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, tglTerimaDana: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor SP2D Kemenkeu <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: SP2D-260729-005102"
                      value={inputFormJKK.noSP2D}
                      onChange={(e) => setInputFormJKK({ ...inputFormJKK, noSP2D: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                    Bank Rekening Giro Penampungan <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={inputFormJKK.bankTujuan}
                    onChange={(e) => setInputFormJKK({ ...inputFormJKK, bankTujuan: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                    Nominal Dana Realisasi Masuk (Rp) <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 150000000"
                    value={inputFormJKK.nominalTagihan}
                    onChange={(e) => setInputFormJKK({ ...inputFormJKK, nominalTagihan: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                  />
                  {inputFormJKK.nominalTagihan && Number(inputFormJKK.nominalTagihan) > 0 && (
                    <div style={{ fontSize: 11, color: currentTheme.primary, marginTop: 4 }}>
                      Nominal Terbilang: {fmtB(Number(inputFormJKK.nominalTagihan))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 16 }}>
                  <Btn type="button" variant="ghost" size="sm" onClick={() => setShowInputModalJKK(false)}>
                    Batal
                  </Btn>
                  <Btn type="submit" variant="primary" size="sm" style={{ background: currentTheme.primary }}>
                    <Check size={14} style={{ marginRight: 4 }} />
                    Simpan & Masukkan ke List
                  </Btn>
                </div>
              </form>
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
                  Matra: <b>{selectedMatraDetail.matra}</b> • Program: <b>{selectedMatraDetail.jenisIuran}</b> • Periode Juli 2026
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
                Menampilkan sampel records transaksi potongan gaji induk per prajurit/anggota yang ditarik secara terpusat melalui API BNBA Kemenkeu RI (SPAN).
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
          <span>THT & Pensiun (SKP-PFK 8,00%)</span>
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
          <span>Jaminan Kecelakaan Kerja (JKK 0,24%)</span>
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
            {monitoringJKKList.length} Monitoring
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
          <span>Jaminan Kematian (JKM 0,20%)</span>
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
            {monitoringJKMList.length} Monitoring
          </span>
        </button>
      </div>

      {/* =========================================================================
          2. NAVIGASI 3 SUBTAB UTAMA: MONITORING, KOMPARASI, DAN HISTORY
          Sesuai permintaan:
          - Tab ledger & integrasi D365 dihilangkan
          - Komparasi dibuat 1 tab saja
          - Tab History untuk menyimpan complete process rekonsiliasi yang telah tuntas
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
          {/* SUBTAB 1: MONITORING PENERIMAAN DANA */}
          <button
            onClick={() => setActiveSubtab("monitoring")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeSubtab === "monitoring" ? 800 : 600,
              color: activeSubtab === "monitoring" ? currentTheme.primary : COLORS.gray600,
              borderBottom: activeSubtab === "monitoring" ? `3px solid ${currentTheme.primary}` : "3px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease"
            }}
          >
            <ShieldCheck size={16} />
            Monitoring Penerimaan Dana
            <span
              style={{
                fontSize: 11,
                background: activeSubtab === "monitoring" ? currentTheme.lightBg : "#F1F5F9",
                color: activeSubtab === "monitoring" ? currentTheme.primary : COLORS.gray600,
                padding: "2px 8px",
                borderRadius: 10,
                fontWeight: 700
              }}
            >
              {currentMonitoringCount}
            </span>
          </button>

          {/* SUBTAB 2: KOMPARASI DATA KEPESERTAAN (HANYA 1 TAB) */}
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

          {/* SUBTAB 3: HISTORY / RIWAYAT PROSES (THE COMPLETE PROCESS) */}
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
          KONTEN SUBTAB 1: MONITORING PENERIMAAN DANA
          Sesuai permintaan: Card KPI di setiap tab dihilangkan!
         ========================================================================= */}
      {activeSubtab === "monitoring" && (
        <div>
          {/* Toolbar Filter & Tombol Input */}
          <div
            style={{
              background: COLORS.white,
              padding: "12px 16px",
              borderRadius: 10,
              border: `1px solid ${COLORS.gray200}`,
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Periode:</span>
                <input
                  type="date"
                  value={tglAwal}
                  onChange={(e) => setTglAwal(e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                />
                <span style={{ fontSize: 12, color: COLORS.gray500 }}>s.d.</span>
                <input
                  type="date"
                  value={tglAkhir}
                  onChange={(e) => setTglAkhir(e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                />
              </div>

              <div style={{ position: "relative", width: 240 }}>
                <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 9 }} />
                <input
                  type="text"
                  placeholder="Cari surat / SKP / SP2D..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px 6px 30px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              {activeProgram === "THT_PENSIUN" ? (
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => setShowInputModal(true)}
                  style={{ fontWeight: 700 }}
                >
                  <Plus size={14} style={{ marginRight: 4 }} />
                  Input Realisasi SKP-PFK
                </Btn>
              ) : (
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setInputFormJKK((prev) => ({ ...prev, program: activeProgram }));
                    setShowInputModalJKK(true);
                  }}
                  style={{ background: currentTheme.primary, fontWeight: 700 }}
                >
                  <Plus size={14} style={{ marginRight: 4 }} />
                  Input Realisasi {activeProgram}
                </Btn>
              )}
            </div>
          </div>

          {/* TABEL MONITORING SESUAI PROGRAM AKTIF */}
          {activeProgram === "THT_PENSIUN" ? (
            /* TABEL THT & PENSIUN */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat SKP-PFK Kemenkeu</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Penerimaan Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nominal SKP (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Kas</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonitoringSKP.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: 30, textAlign: "center", color: COLORS.gray500 }}>
                          Tidak ada data penerimaan SKP-PFK dalam monitoring aktif atau semua tagihan telah dipindahkan ke History.
                        </td>
                      </tr>
                    ) : (
                      filteredMonitoringSKP.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900 }}>
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
                            <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: COLORS.blue }}>
                              {fmtB(item.nominalDanaSKP)}
                            </div>
                            <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                              THT: {fmtB(item.danaTHT)} • PEN: {fmtB(item.danaPensiun)}
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
                              <CheckCircle2 size={12} />
                              {item.statusDana}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "nowrap" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                onClick={() => openSuratTagihanPreview(item)}
                              >
                                <FileText size={12} style={{ marginRight: 3 }} />
                                Surat Tagihan
                              </Btn>
                              <Btn
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  setSatkerModalData({
                                    satkerList: item.satkerList || SATKER_THT_PENSIUN_ALL,
                                    suratRef: item.noSuratTagihan
                                  })
                                }
                              >
                                <Building2 size={12} style={{ marginRight: 3 }} />
                                Rincian Satker
                              </Btn>
                              <Btn
                                size="xs"
                                variant="primary"
                                style={{ background: "#059669", color: COLORS.white, fontWeight: 700 }}
                                onClick={() => setConfirmCompleteItem(item)}
                              >
                                <CheckCircle2 size={12} style={{ marginRight: 3 }} />
                                Selesaikan Proses
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", textAlign: "right" }}>
                        Total Realisasi Dana SKP-PFK:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.blue, fontSize: 13 }}>
                        {fmtB(filteredMonitoringSKP.reduce((acc, it) => acc + (it.nominalDanaSKP || 0), 0))}
                      </td>
                      <td colSpan={2} style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11 }}>
                        Lunas 100% SP2D Kemenkeu
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            /* TABEL JKK ATAU JKM (Disamakan dengan format tabel THT, tanpa tarif, SKP diganti Nota Dinas Kepesertaan) */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nota Dinas Kepesertaan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Penerimaan Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Realisasi (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Kas</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeProgram === "JKK" ? filteredMonitoringJKKOnly : filteredMonitoringJKMOnly).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: 30, textAlign: "center", color: COLORS.gray500 }}>
                          Tidak ada data penerimaan tagihan {activeProgram} dalam monitoring aktif atau semua tagihan telah dipindahkan ke History.
                        </td>
                      </tr>
                    ) : (
                      (activeProgram === "JKK" ? filteredMonitoringJKKOnly : filteredMonitoringJKMOnly).map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
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
                              {fmtB(item.nominalDiterima)}
                            </div>
                            <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                              {fmtNum(item.peserta)} Personel (5 Matra)
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
                              <CheckCircle2 size={12} />
                              {item.statusDana}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "nowrap" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                onClick={() => openSuratTagihanPreview(item)}
                              >
                                <FileText size={12} style={{ marginRight: 3 }} />
                                Surat Tagihan
                              </Btn>
                              <Btn
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  setPreview({
                                    title: `Detail Rekapitulasi Matra — ${item.program}`,
                                    subtitle: `Surat Tagihan: ${item.noSuratTagihan} • SP2D: ${item.noSP2D}`,
                                    type: "table",
                                    fileName: `Rekap_Matra_${item.program}_Juli2026.xlsx`,
                                    content: {
                                      columns: ["Matra / Komponen", "Jumlah Peserta", "Total Gaji Pokok (Rp)", `Alokasi Iuran ${item.program} (Rp)`, "Status Validasi"],
                                      rows: komparasiJKKMatraData.map((k) => [
                                        k.matra,
                                        `${fmtNum(k.peserta)} Jiwa`,
                                        fmtB(k.gapokTotal),
                                        fmtB(item.program === "JKK" ? k.nominalJKKSistem : k.nominalJKMSistem),
                                        k.status
                                      ]),
                                      totalRows: komparasiJKKMatraData.length
                                    }
                                  })
                                }
                              >
                                <Building2 size={12} style={{ marginRight: 3 }} />
                                Detail Matra
                              </Btn>
                              <Btn
                                size="xs"
                                variant="primary"
                                style={{ background: "#059669", color: COLORS.white, fontWeight: 700 }}
                                onClick={() => setConfirmCompleteItem(item)}
                              >
                                <CheckCircle2 size={12} style={{ marginRight: 3 }} />
                                Selesaikan Proses
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", textAlign: "right" }}>
                        Total Realisasi Iuran {activeProgram}:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: currentTheme.primary, fontSize: 13 }}>
                        {fmtB((activeProgram === "JKK" ? filteredMonitoringJKKOnly : filteredMonitoringJKMOnly).reduce((acc, it) => acc + (it.nominalDiterima || 0), 0))}
                      </td>
                      <td colSpan={2} style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11 }}>
                        Lunas 100% SP2D Kemenkeu
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
          KONTEN SUBTAB 2: KOMPARASI DATA KEPESERTAAN (HANYA 1 TAB)
          Sesuai permintaan:
          - Dibuat 1 tab saja
          - Bisa filter tampilannya: Secara Rekap atau Secara Per-Matra
          - Card pada setiap tab dihilangkan!
         ========================================================================= */}
      {activeSubtab === "komparasi" && (
        <div>
          {/* BAR FILTER TAMPILAN KOMPARASI: REKAP VS PER-MATRA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: COLORS.white,
              padding: "12px 16px",
              borderRadius: 10,
              border: `1px solid ${COLORS.gray200}`,
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700 }}>
                Filter Tampilan Komparasi:
              </span>
              <div style={{ display: "inline-flex", background: "#F1F5F9", padding: 3, borderRadius: 8, gap: 4 }}>
                <button
                  onClick={() => setViewModeKomparasi("rekap")}
                  style={{
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: viewModeKomparasi === "rekap" ? 800 : 600,
                    background: viewModeKomparasi === "rekap" ? COLORS.white : "transparent",
                    color: viewModeKomparasi === "rekap" ? currentTheme.primary : COLORS.gray600,
                    boxShadow: viewModeKomparasi === "rekap" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease"
                  }}
                >
                  <Layers size={14} />
                  Secara Rekap
                </button>

                <button
                  onClick={() => setViewModeKomparasi("per_matra")}
                  style={{
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: viewModeKomparasi === "per_matra" ? 800 : 600,
                    background: viewModeKomparasi === "per_matra" ? COLORS.white : "transparent",
                    color: viewModeKomparasi === "per_matra" ? currentTheme.primary : COLORS.gray600,
                    boxShadow: viewModeKomparasi === "per_matra" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease"
                  }}
                >
                  <Users size={14} />
                  Secara Per-Matra
                </button>
              </div>
            </div>

            {/* Opsi Khusus jika THT & Pensiun pada mode Per-Matra */}
            {activeProgram === "THT_PENSIUN" && viewModeKomparasi === "per_matra" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Matra:</span>
                  <select
                    value={filterMatra}
                    onChange={(e) => setFilterMatra(e.target.value)}
                    style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                  >
                    <option value="Semua">Semua Matra (5 Matra)</option>
                    <option value="TNI AD">TNI AD</option>
                    <option value="TNI AL">TNI AL</option>
                    <option value="TNI AU">TNI AU</option>
                    <option value="Kemhan (PNS/PPPK)">Kemhan (PNS/PPPK)</option>
                    <option value="POLRI">POLRI</option>
                  </select>
                </div>

                <Btn
                  variant="primary"
                  size="sm"
                  disabled={isSyncingBNBA}
                  onClick={handleSyncBNBA}
                >
                  <RefreshCw size={13} className={isSyncingBNBA ? "animate-spin" : ""} style={{ marginRight: 4 }} />
                  {isSyncingBNBA ? "Sinkronisasi..." : "Tarik API BNBA Kemenkeu"}
                </Btn>
              </div>
            )}
          </div>

          {/* =====================================================================
              A. TAMPILAN SECARA REKAP (MAKRO)
             ===================================================================== */}
          {viewModeKomparasi === "rekap" && (
            <div>
              {activeProgram === "THT_PENSIUN" ? (
                /* REKAP THT & PENSIUN */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                      Rekapitulasi Makro Kepesertaan vs SKP-PFK (THT & Pensiun 8,00%)
                    </div>
                    <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                      Konsolidasi data peserta sistem ASABRI dibandingkan penetapan SKP-PFK Kemenkeu RI.
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Dokumen Tagihan</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tarif</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Sistem</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Sistem (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta SKP</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal SKP (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rekapSKPData.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, color: COLORS.gray900 }}>{item.pilar}</div>
                              <div style={{ fontSize: 11, color: COLORS.gray500 }}>{item.deskripsi}</div>
                            </td>
                            <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
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
                              {fmtB(item.selisihNominal)} ({item.persenSelisih}%)
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#ECFDF5", color: "#065F46" }}>
                                {item.statusRekap}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ padding: "14px 18px", background: "#F8FAFC", borderTop: `1px solid ${COLORS.gray200}`, fontSize: 12, color: COLORS.gray600 }}>
                    <b>Analisis Rekapitulasi:</b> {rekapSKPData[0]?.analisis}
                  </div>
                </div>
              ) : (
                /* REKAP JKK ATAU JKM */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                      Rekapitulasi Makro Tagihan vs Realisasi Kas {activeProgram === "JKK" ? "JKK (0,24%)" : "JKM (0,20%)"}
                    </div>
                    <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                      Konsolidasi perhitungan potensi iuran pemberi kerja terhadap realisasi SP2D Kemenkeu RI.
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Program Iuran</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tarif</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nomor Surat Tagihan</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Potensi Sistem (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Realisasi Kas SP2D (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Rekap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rekapJKKData
                          .filter((item) => item.program.includes(activeProgram))
                          .map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                              <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                                {item.program}
                              </td>
                              <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: currentTheme.primary }}>
                                {item.tarif}
                              </td>
                              <td style={{ padding: "12px 14px", fontFamily: "monospace" }}>
                                {item.noSuratTagihan}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                                {fmtNum(item.peserta)} Jiwa
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                                {fmtB(item.nominalPotensi)}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: currentTheme.primary }}>
                                {fmtB(item.nominalRealisasi)}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#065F46" }}>
                                Rp 0
                              </td>
                              <td style={{ padding: "12px 14px" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#ECFDF5", color: "#065F46" }}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ padding: "14px 18px", background: "#F8FAFC", borderTop: `1px solid ${COLORS.gray200}`, fontSize: 12, color: COLORS.gray600 }}>
                    <b>Analisis Rekapitulasi:</b> {rekapJKKData.find(i => i.program.includes(activeProgram))?.analisis}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              B. TAMPILAN SECARA PER-MATRA
             ===================================================================== */}
          {viewModeKomparasi === "per_matra" && (
            <div>
              {activeProgram === "THT_PENSIUN" ? (
                /* PER-MATRA THT & PENSIUN */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                      Komparasi Data Kepesertaan vs API BNBA Kemenkeu Per-Matra
                    </div>
                    <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                      Perbandingan by-name-by-address personel per Matra terhadap potongan gaji induk 8,00% (THT 3,25% + Pensiun 4,75%).
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra / Kesatuan</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Sistem</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Sistem (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta BNBA</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal BNBA (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Jiwa</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih Nominal (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBNBA.map((row) => (
                          <tr key={row.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                            <td style={{ padding: "12px 14px", fontWeight: 700, color: COLORS.gray900 }}>
                              {row.matra}
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
                            <td style={{ padding: "12px 14px" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  background: row.status.includes("Match") ? "#ECFDF5" : "#FEF3C7",
                                  color: row.status.includes("Match") ? "#065F46" : "#92400E"
                                }}
                              >
                                {row.status}
                              </span>
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
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                          <td style={{ padding: "12px 14px" }}>TOTAL (5 MATRA):</td>
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
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#DC2626" }}>
                            {filteredBNBA.reduce((a, b) => a + b.selisihJiwa, 0)}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#DC2626" }}>
                            {fmtB(filteredBNBA.reduce((a, b) => a + b.selisihNominal, 0))}
                          </td>
                          <td colSpan={2} style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11 }}>
                            Tingkat Kesesuaian: 99.95%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                /* PER-MATRA JKK ATAU JKM */
                <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.gray200}`, background: "#F8FAFC" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                      Komparasi Kepesertaan vs Realisasi Kas {activeProgram === "JKK" ? "JKK (0,24%)" : "JKM (0,20%)"} Per-Matra
                    </div>
                    <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                      Perhitungan potensi iuran berdasarkan DIPA Belanja Pegawai 5 Matra terhadap realisasi pencairan kas SP2D Kemenkeu.
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra / Satuan Kerja</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Peserta Terlindungi</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Total Gaji Pokok (Rp)</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Potensi {activeProgram} ({activeProgram === "JKK" ? "0,24%" : "0,20%"})</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Realisasi Kas SP2D</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Selisih</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status</th>
                          <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Catatan KPPN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {komparasiJKKMatraData.map((row) => (
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
                            <td style={{ padding: "12px 14px" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  background: "#ECFDF5",
                                  color: "#065F46"
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", fontSize: 11.5, color: COLORS.gray600 }}>
                              {row.catatan}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                          <td style={{ padding: "12px 14px" }}>TOTAL (5 MATRA):</td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtNum(komparasiJKKMatraData.reduce((a, b) => a + b.peserta, 0))} Jiwa
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmtB(komparasiJKKMatraData.reduce((a, b) => a + b.gapokTotal, 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: currentTheme.primary, fontSize: 13 }}>
                            {fmtB(komparasiJKKMatraData.reduce((a, b) => a + (activeProgram === "JKK" ? b.nominalJKKSistem : b.nominalJKMSistem), 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46", fontSize: 13 }}>
                            {fmtB(komparasiJKKMatraData.reduce((a, b) => a + (activeProgram === "JKK" ? b.realisasiKasJKK : b.realisasiKasJKM), 0))}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: "#065F46" }}>
                            Rp 0
                          </td>
                          <td colSpan={2} style={{ padding: "12px 14px" }}>
                            <span style={{ fontSize: 11, color: "#065F46", background: "#ECFDF5", padding: "3px 8px", borderRadius: 4, fontWeight: 800 }}>
                              ✅ MATCH 100% (SEIMBANG)
                            </span>
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
              alignItems: "center",
              background: COLORS.white,
              padding: "14px 18px",
              borderRadius: 10,
              border: `1px solid ${COLORS.gray200}`,
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Periode:</span>
                <input
                  type="date"
                  value={tglAwal}
                  onChange={(e) => setTglAwal(e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                />
                <span style={{ fontSize: 12, color: COLORS.gray500 }}>s.d.</span>
                <input
                  type="date"
                  value={tglAkhir}
                  onChange={(e) => setTglAkhir(e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                />
              </div>

              <div style={{ position: "relative", width: 260 }}>
                <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 9 }} />
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
                    padding: "6px 10px 6px 30px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#065F46",
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <CheckCircle2 size={14} color="#059669" />
                <span>{currentHistoryCount} Dokumen Tuntas (BAR Sah)</span>
              </div>
            </div>
          </div>

          {/* TABEL HISTORY SESUAI PROGRAM AKTIF */}
          {activeProgram === "THT_PENSIUN" ? (
            /* TABEL HISTORY THT & PENSIUN */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat SKP-PFK Kemenkeu</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Penerimaan Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tuntas (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Berita Acara (BAR)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Proses</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi (The Complete Process)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistorySKP.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: 36, textAlign: "center", color: COLORS.gray500 }}>
                          <History size={32} color={COLORS.gray400} style={{ marginBottom: 8 }} />
                          <div style={{ fontWeight: 600 }}>Belum ada riwayat rekonsiliasi yang tuntas pada periode ini.</div>
                          <div style={{ fontSize: 11.5, color: COLORS.gray400, marginTop: 4 }}>
                            Tagihan di tab Monitoring yang telah selesai direkonsiliasi dapat diklik &quot;Selesaikan Proses&quot; untuk disimpan permanen ke History.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredHistorySKP.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900 }}>
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
                              THT: {fmtB(item.danaTHT)} • Pens: {fmtB(item.danaPensiun)}
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
                            <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "nowrap" }}>
                              <Btn
                                size="xs"
                                variant="primary"
                                style={{ background: "#3B82F6", fontWeight: 700 }}
                                onClick={() => setSelectedCompleteProcess(item)}
                              >
                                <History size={12} style={{ marginRight: 3 }} />
                                Complete Process
                              </Btn>
                              <Btn
                                size="xs"
                                variant="outline"
                                style={{ borderColor: "#10B981", color: "#065F46", fontWeight: 700 }}
                                onClick={() => openBARPreview(item)}
                              >
                                <FileCheck size={12} style={{ marginRight: 3 }} />
                                Cetak BAR
                              </Btn>
                              <Btn
                                size="xs"
                                variant="outline"
                                onClick={() => openSuratTagihanPreview(item)}
                              >
                                <FileText size={12} style={{ marginRight: 3 }} />
                                Surat Tagihan
                              </Btn>
                              <Btn
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  setSatkerModalData({
                                    noSuratTagihan: item.noSuratTagihan,
                                    satkerList: item.satkerList || SATKER_THT_PENSIUN_ALL
                                  })
                                }
                              >
                                <Building2 size={12} style={{ marginRight: 3 }} />
                                Rincian Satker
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", textAlign: "right" }}>
                        TOTAL DANA TUNTAS TEREPOSITORI (THT & PENSIUN):
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
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nota Dinas Kepesertaan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Tanggal Penerimaan Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tuntas (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Berita Acara (BAR)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Proses</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi (The Complete Process)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeProgram === "JKK" ? filteredHistoryJKK : filteredHistoryJKM).length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: 36, textAlign: "center", color: COLORS.gray500 }}>
                          <History size={32} color={COLORS.gray400} style={{ marginBottom: 8 }} />
                          <div style={{ fontWeight: 600 }}>Belum ada riwayat proses {activeProgram} yang tuntas pada periode ini.</div>
                          <div style={{ fontSize: 11.5, color: COLORS.gray400, marginTop: 4 }}>
                            Tagihan di tab Monitoring yang telah selesai direkonsiliasi dapat diklik &quot;Selesaikan Proses&quot; untuk disimpan permanen ke History.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      (activeProgram === "JKK" ? filteredHistoryJKK : filteredHistoryJKM).map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
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
                              {fmtNum(item.peserta)} Personel (5 Matra)
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
                            <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "nowrap" }}>
                              <Btn
                                size="xs"
                                variant="primary"
                                style={{ background: currentTheme.primary, fontWeight: 700 }}
                                onClick={() => setSelectedCompleteProcess(item)}
                              >
                                <History size={12} style={{ marginRight: 3 }} />
                                Complete Process
                              </Btn>
                              <Btn
                                size="xs"
                                variant="outline"
                                style={{ borderColor: "#10B981", color: "#065F46", fontWeight: 700 }}
                                onClick={() => openBARPreview(item)}
                              >
                                <FileCheck size={12} style={{ marginRight: 3 }} />
                                Cetak BAR
                              </Btn>
                              <Btn
                                size="xs"
                                variant="outline"
                                onClick={() => openSuratTagihanPreview(item)}
                              >
                                <FileText size={12} style={{ marginRight: 3 }} />
                                Surat Tagihan
                              </Btn>
                              <Btn
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  setPreview({
                                    title: `Detail Rekapitulasi Matra — ${item.program}`,
                                    subtitle: `Surat Tagihan: ${item.noSuratTagihan} • BAR: ${item.noBAR}`,
                                    type: "table",
                                    fileName: `Rekap_Matra_${item.program}_History.xlsx`,
                                    content: {
                                      columns: ["Matra / Komponen", "Jumlah Peserta", "Total Gaji Pokok (Rp)", `Alokasi Iuran ${item.program} (Rp)`, "Status Penetapan"],
                                      rows: komparasiJKKMatraData.map((k) => [
                                        k.matra,
                                        `${fmtNum(k.peserta)} Jiwa`,
                                        fmtB(k.gapokTotal),
                                        fmtB(item.program === "JKK" ? k.nominalJKKSistem : k.nominalJKMSistem),
                                        "Tuntas & Ditetapkan (BAR)"
                                      ]),
                                      totalRows: komparasiJKKMatraData.length
                                    }
                                  })
                                }
                              >
                                <Building2 size={12} style={{ marginRight: 3 }} />
                                Detail Matra
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", textAlign: "right" }}>
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
