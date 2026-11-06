import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Printer,
  ExternalLink,
  FileText,
  UploadCloud,
  Clock,
  Building2,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Shield,
  Search,
  Plus,
  Check,
  AlertCircle,
  Eye,
  DollarSign,
  Calendar,
  Edit3,
  X,
  Lock
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Btn, PreviewModal, SatkerModal } from "../components/common";
import {
  SATKER_THT_PENSIUN_ALL,
  SATKER_THT_TNI,
  SATKER_THT_POLRI,
  SATKER_PENSIUN_TNI,
  SATKER_PENSIUN_POLRI,
  formatNomorSuratPFK,
  generateProportionalSatkerList
} from "../constants/satkerData";

export const GeneratorTagihan = () => {
  // Tab Navigasi: "form" (Form Penagihan) | "monitoring" (Monitoring Penerimaan Dana) | "history" (Riwayat Penagihan)
  const [activeTab, setActiveTab] = useState("form");

  // Pilihan Program Penagihan Utama (THT & Pensiun dijadikan satu opsi):
  // "THT_PENSIUN" | "JKK" | "JKM" | "BATCH_PFK"
  const [selectedProgram, setSelectedProgram] = useState("THT_PENSIUN");

  // Field Jenis Iuran khusus THT & Pensiun:
  // "THT_TNI" | "THT_POLRI" | "PENSIUN_TNI" | "PENSIUN_POLRI" | etc.
  const [jenisIuranPFK, setJenisIuranPFK] = useState("PENSIUN_TNI");

  // 3 Field Utama yang Sama untuk Semua Program:
  // 1. Nomor Surat (Freetext untuk semua program penagihan)
  // 2. Nominal
  // 3. Dokumen (Upload / Tergenerate)
  const [noSurat, setNoSurat] = useState("S-1156/KU.06.06/KMR.N/V/2026");
  const [nominal, setNominal] = useState("3002772913");
  const [dokumenFile, setDokumenFile] = useState(null);
  const [dokumenName, setDokumenName] = useState("SKP-PFK_Kemenkeu_Mei2026_Pensiun_TNI.pdf");

  // Field Khusus Program JKK & JKM:
  // 1. Nomor Nota Dinas dari Divisi Kepesertaan (free text)
  // 2. Upload Nota Dinas (file & file name)
  // 3. Nomor SP Dipa (free text)
  const [noNotaDinas, setNoNotaDinas] = useState("ND-108/KEP/VII/2026");
  const [notaDinasFile, setNotaDinasFile] = useState(null);
  const [notaDinasFileName, setNotaDinasFileName] = useState("Nota_Dinas_Divisi_Kepesertaan_JKK.pdf");
  const [noSPDipa, setNoSPDipa] = useState("SP-DIPA-023.01.2.690523/2026");

  // Field Pejabat Penandatangan Tagihan (Sesuai Dokumen Resmi PDF Surat Tagihan ASABRI)
  const [namaPejabat, setNamaPejabat] = useState("HELMI I. SATRIYONO");
  const [jabatan, setJabatan] = useState("DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO");

  // Field Perihal Surat (freetext). Jika dikosongkan, surat memakai perihal standar sesuai program.
  const [perihal, setPerihal] = useState("");

  // Nomor Urut Berjalan untuk Tagihan Otomatis JKK & JKM (tidak berubah selagi tagihan belum dibuat)
  const [nextNoUrutJKK_JKM, setNextNoUrutJKK_JKM] = useState(1198);

  // Batch Form State
  const [batchNoSKP, setBatchNoSKP] = useState("S-184/PB.2/2026");
  const [batchDocName, setBatchDocName] = useState("SKP-PFK_Kemenkeu_Juli2026_Termin1.pdf");
  const [batchStartNo, setBatchStartNo] = useState(1190);

  const [preview, setPreview] = useState(null);
  const [satkerModalData, setSatkerModalData] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper currency format
  const formatRupiah = (number) => {
    if (!number || isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(number);
  };

  // Helper label nama program & dana aktif
  const getProgramDisplayName = () => {
    if (selectedProgram === "THT_PENSIUN") {
      if (jenisIuranPFK.startsWith("THT")) {
        return jenisIuranPFK.includes("POLRI") ? "THT POLRI" : "THT TNI";
      }
      return jenisIuranPFK.includes("POLRI") ? "Pensiun POLRI" : "Pensiun TNI";
    }
    if (selectedProgram === "JKK") {
      return jenisIuranPFK === "JKK_TNI" ? "JKK TNI" : "JKK POLRI";
    }
    if (selectedProgram === "JKM") {
      return jenisIuranPFK === "JKM_TNI" ? "JKM TNI" : "JKM POLRI";
    }
    return selectedProgram;
  };

  // Perihal standar surat tagihan (placeholder & fallback jika field Perihal dikosongkan)
  const getDefaultPerihal = () => {
    if (selectedProgram === "THT_PENSIUN") {
      const isTHT = jenisIuranPFK.startsWith("THT");
      const isPolri = jenisIuranPFK.includes("POLRI");
      const halProgram = isTHT ? (isPolri ? "THT POLRI" : "THT TNI") : (isPolri ? "Pensiun POLRI" : "Dapen TNI");
      return `Tagihan/Permintaan Pembayaran Dana PFK ${isTHT ? "3,25%" : "4,75%"} untuk ${halProgram} s.d. Tanggal 10 Mei 2026`;
    }
    return `Tagihan Iuran ${getProgramDisplayName()} Periode Juli 2026`;
  };

  // Konversi surat tagihan yang baru diterbitkan menjadi record Monitoring Penerimaan Dana.
  // Tagihan baru selalu masuk Monitoring dahulu, dan baru tampil di Riwayat setelah ditandai "Selesai".
  const buildMonitoringRecord = (t, danaType) => {
    const isPFK = danaType.startsWith("THT") || danaType.startsWith("PENSIUN");
    const isTHT = danaType.startsWith("THT");
    const prog = danaType.startsWith("JKK") ? "JKK" : (danaType.startsWith("JKM") ? "JKM" : undefined);
    const tarif = isPFK ? (isTHT ? "3,25%" : "4,75%") : (prog === "JKK" ? "0,62%" : "0,81%");
    const user = t.namaPejabat || "HELMI I. SATRIYONO";
    const hasSuratDiterima = Boolean(t.tglSuratDiterima && String(t.tglSuratDiterima).trim());
    const initialStatus = hasSuratDiterima ? "Dana Belum Diterima" : "Surat Belum Diterima";

    return {
      ...t,
      id: `MON-${t.id}`,
      program: prog,
      danaType,
      namaDana: t.program,
      jenisIuran: t.danaPorsi,
      kodeTarif: `${tarif} ${isPFK ? "Gaji Pokok" : "Basis Gaji Pokok"}`,
      tarif,
      peserta: Number(String(t.items?.[0]?.peserta || t.peserta || 0).replace(/\./g, "")),
      matraUtama: t.matra,
      noSuratTagihan: t.noSurat,
      tglSuratTagihan: t.tglGenerate,
      tglSuratDiterima: t.tglSuratDiterima || "",
      statusSuratTagihan: hasSuratDiterima ? "Diterima Kemenkeu RI" : "Terbit (Tergenerate)",
      noSKP: isPFK ? t.noKEP : undefined,
      tglSKP: isPFK ? t.tglKEP : undefined,
      noNotaDinas: t.noNotaDinas,
      namaNotaDinas: t.namaNotaDinas || t.notaDinasFileName,
      noSPDipa: t.noSPDipa,
      tglTerimaDana: "",
      noSP2D: isPFK ? undefined : "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: isPFK ? t.nominalNum : undefined,
      danaTHT: isPFK && isTHT ? t.nominalNum : 0,
      danaPensiun: isPFK && !isTHT ? t.nominalNum : 0,
      nominalTagihan: isPFK ? undefined : t.nominalNum,
      nominalDiterima: t.nominalNum,
      statusDana: initialStatus,
      statusTagihan: initialStatus,
      statusProses: "Dalam Monitoring",
      riwayatStatus: [
        {
          tanggal: t.tglGenerate,
          status: initialStatus,
          catatan: hasSuratDiterima
            ? `Surat tagihan ${t.noSurat} telah diterima Kemenkeu RI (menunggu penerimaan dana)`
            : `Surat tagihan ${t.noSurat} diterbitkan ke Kemenkeu RI (menunggu tanda terima surat)`,
          user
        }
      ]
    };
  };

  // Efek sinkronisasi nomor surat, nominal, dan berkas sesuai pilihan Program dan Jenis Iuran
  useEffect(() => {
    if (selectedProgram === "THT_PENSIUN") {
      if (jenisIuranPFK === "PENSIUN_TNI") {
        setNoSurat("S-1156/KU.06.06/KMR.N/V/2026");
        setNominal("3002772913");
        setDokumenName("SKP-PFK_Kemenkeu_Mei2026_Pensiun_TNI.pdf");
      } else if (jenisIuranPFK === "THT_TNI") {
        setNoSurat("S-1155/KU.06.06/KMR.N/V/2026");
        setNominal("2055120400");
        setDokumenName("SKP-PFK_Kemenkeu_Mei2026_THT_TNI.pdf");
      } else if (jenisIuranPFK === "PENSIUN_POLRI") {
        setNoSurat("S-1158/KU.06.06/KMR.N/V/2026");
        setNominal("20805000000");
        setDokumenName("SKP-PFK_Kemenkeu_Mei2026_Pensiun_POLRI.pdf");
      } else if (jenisIuranPFK === "THT_POLRI") {
        setNoSurat("S-1157/KU.06.06/KMR.N/V/2026");
        setNominal("14225000000");
        setDokumenName("SKP-PFK_Kemenkeu_Mei2026_THT_POLRI.pdf");
      }
    } else if (selectedProgram === "JKK") {
      setNoSurat("S-1198/KU.06.06/KMR.N/IX/2026");
      if (jenisIuranPFK === "JKK_TNI") {
        setNominal("1510000000"); // 8.208 peserta x 0,62%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKK_TNI_Juli2026.pdf");
        setNoNotaDinas("ND-108/KEP/VII/2026");
        setNotaDinasFileName("Nota_Dinas_Divisi_Kepesertaan_JKK_TNI.pdf");
        setNoSPDipa("SP-DIPA-023.01.2.690523/2026");
      } else {
        setNominal("1120000000"); // 6.120 peserta x 0,62%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKK_POLRI_Juli2026.pdf");
        setNoNotaDinas("ND-109/KEP/VII/2026");
        setNotaDinasFileName("Nota_Dinas_Divisi_Kepesertaan_JKK_POLRI.pdf");
        setNoSPDipa("SP-DIPA-023.01.2.690524/2026");
      }
    } else if (selectedProgram === "JKM") {
      setNoSurat("S-1199/KU.06.06/KMR.N/IX/2026");
      if (jenisIuranPFK === "JKM_TNI") {
        setNominal("1270000000"); // 8.208 peserta x 0,81%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKM_TNI_Juli2026.pdf");
        setNoNotaDinas("ND-110/KEP/VII/2026");
        setNotaDinasFileName("Nota_Dinas_Divisi_Kepesertaan_JKM_TNI.pdf");
        setNoSPDipa("SP-DIPA-023.01.2.690525/2026");
      } else {
        setNominal("940000000"); // 6.120 peserta x 0,81%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKM_POLRI_Juli2026.pdf");
        setNoNotaDinas("ND-111/KEP/VII/2026");
        setNotaDinasFileName("Nota_Dinas_Divisi_Kepesertaan_JKM_POLRI.pdf");
        setNoSPDipa("SP-DIPA-023.01.2.690526/2026");
      }
    }
  }, [selectedProgram, jenisIuranPFK, nextNoUrutJKK_JKM]);

  // Handler Upload Dokumen
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDokumenFile(file);
      setDokumenName(file.name);
    }
  };

  // Handler Generate Single Surat (Membuka Preview Modal terlebih dahulu sebelum diterbitkan)
  const handleGenerate = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    let curNoSurat = noSurat ? noSurat.trim() : "";
    let curNominal = nominal;
    let curDok = dokumenName ? dokumenName.trim() : "";
    const curPerihal = perihal.trim() || getDefaultPerihal();

    if (selectedProgram === "THT_PENSIUN") {
      if (!curNoSurat) {
        if (jenisIuranPFK === "THT_TNI") curNoSurat = "S-1155/KU.06.06/KMR.N/V/2026";
        else if (jenisIuranPFK === "THT_POLRI") curNoSurat = "S-1157/KU.06.06/KMR.N/V/2026";
        else if (jenisIuranPFK === "PENSIUN_TNI") curNoSurat = "S-1156/KU.06.06/KMR.N/V/2026";
        else if (jenisIuranPFK === "PENSIUN_POLRI") curNoSurat = "S-1158/KU.06.06/KMR.N/V/2026";
        else curNoSurat = "S-1156/KU.06.06/KMR.N/V/2026";
      }
      if (!curNominal || Number(curNominal) <= 0) {
        if (jenisIuranPFK === "THT_TNI") curNominal = "2055120400";
        else if (jenisIuranPFK === "THT_POLRI") curNominal = "14225000000";
        else if (jenisIuranPFK === "PENSIUN_TNI") curNominal = "3002772913";
        else if (jenisIuranPFK === "PENSIUN_POLRI") curNominal = "20805000000";
        else curNominal = "3002772913";
      }
      if (!curDok) {
        curDok = `SKP-PFK_Kemenkeu_Mei2026_${jenisIuranPFK}.pdf`;
      }
    } else if (selectedProgram === "JKK") {
      const isPolri = jenisIuranPFK === "JKK_POLRI";
      if (!curNoSurat) curNoSurat = "S-1198/KU.06.06/KMR.N/IX/2026";
      if (!curNominal || Number(curNominal) <= 0) curNominal = isPolri ? "1120000000" : "1510000000";
      if (!curDok) curDok = `Rekap_Iuran_JKK_${isPolri ? "POLRI" : "TNI"}_Juli2026.pdf`;
    } else if (selectedProgram === "JKM") {
      const isPolri = jenisIuranPFK === "JKM_POLRI";
      if (!curNoSurat) curNoSurat = "S-1199/KU.06.06/KMR.N/IX/2026";
      if (!curNominal || Number(curNominal) <= 0) curNominal = isPolri ? "940000000" : "1270000000";
      if (!curDok) curDok = `Rekap_Iuran_JKM_${isPolri ? "POLRI" : "TNI"}_Juli2026.pdf`;
    }

    const nomValue = Number(curNominal);
    let items = [];
    let skpDetails = null;
    let satkerList = null;
    let programName = selectedProgram;
    let matraName = "TNI, Kemhan & POLRI";
    let porsiKet = "";

    if (selectedProgram === "THT_PENSIUN") {
      const isPolri = jenisIuranPFK.includes("POLRI");
      const isSusulan = jenisIuranPFK.includes("SUSULAN");
      const isTHR = jenisIuranPFK.includes("THR");
      const isTHT = jenisIuranPFK.startsWith("THT");

      if (isTHT) {
        programName = isPolri ? "THT POLRI" : "THT TNI";
        matraName = isPolri ? "POLRI" : "TNI & Kemhan";
        satkerList = isPolri ? SATKER_THT_POLRI : SATKER_THT_TNI;

        if (isPolri) {
          porsiKet = isSusulan
            ? "Iuran THT Anggota POLRI & PNS Polri (Susulan / Kekurangan 3,25%)"
            : (isTHR ? "Iuran THT POLRI (Gaji Ke-13 / THR 3,25%)" : "Iuran THT Anggota POLRI & PNS Polri (3,25%)");
          const pes = isSusulan ? "7.850" : "142.200";
          items = [{ jenis: `Iuran THT (3,25% Gaji Pokok Anggota POLRI & PNS Polri)`, peserta: pes, nominal: formatRupiah(nomValue) }];
        } else {
          porsiKet = isSusulan
            ? "Iuran THT Prajurit TNI & ASN Kemhan (Susulan / Kekurangan 3,25%)"
            : (isTHR ? "Iuran THT TNI & Kemhan (Gaji Ke-13 / THR 3,25%)" : "Iuran THT Prajurit TNI & ASN Kemhan (3,25%)");
          const pes = isSusulan ? "12.450" : "266.150";
          items = [{ jenis: `Iuran THT (3,25% Gaji Pokok Prajurit TNI & ASN Kemhan)`, peserta: pes, nominal: formatRupiah(nomValue) }];
        }
      } else {
        programName = isPolri ? "Pensiun POLRI" : "Pensiun TNI";
        matraName = isPolri ? "POLRI" : "TNI & Kemhan";
        satkerList = isPolri ? SATKER_PENSIUN_POLRI : SATKER_PENSIUN_TNI;

        if (isPolri) {
          porsiKet = isSusulan
            ? "Iuran Pensiun Anggota POLRI & PNS Polri (Susulan / Kekurangan 4,75%)"
            : "Iuran Pensiun Anggota POLRI & PNS Polri (4,75%)";
          const pes = isSusulan ? "7.850" : "142.200";
          items = [{ jenis: `Iuran Pensiun (4,75% Gaji Pokok Anggota POLRI & PNS Polri)`, peserta: pes, nominal: formatRupiah(nomValue) }];
        } else {
          porsiKet = isSusulan
            ? "Iuran Pensiun Prajurit TNI & ASN Kemhan (Susulan / Kekurangan 4,75%)"
            : "Iuran Pensiun Prajurit TNI & ASN Kemhan (4,75%)";
          const pes = isSusulan ? "12.450" : "266.150";
          items = [{ jenis: `Iuran Pensiun (4,75% Gaji Pokok Prajurit TNI & ASN Kemhan)`, peserta: pes, nominal: formatRupiah(nomValue) }];
        }
      }
      skpDetails = { noSurat: curNoSurat, tglSurat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), fileName: curDok, nominal: formatRupiah(nomValue) };
    } else if (selectedProgram === "JKK") {
      const isPolri = jenisIuranPFK === "JKK_POLRI";
      programName = isPolri ? "JKK POLRI" : "JKK TNI";
      matraName = isPolri ? "POLRI" : "TNI & Kemhan";
      porsiKet = `Iuran JKK (${isPolri ? "POLRI" : "TNI"} 0,62%)`;
      items = [{
        jenis: `Iuran JKK (0,62% Basis Gaji Pokok ${isPolri ? "Anggota POLRI & PNS Polri" : "Prajurit TNI & ASN Kemhan"})`,
        peserta: isPolri ? "6.120" : "8.208",
        nominal: formatRupiah(nomValue)
      }];
    } else if (selectedProgram === "JKM") {
      const isPolri = jenisIuranPFK === "JKM_POLRI";
      programName = isPolri ? "JKM POLRI" : "JKM TNI";
      matraName = isPolri ? "POLRI" : "TNI & Kemhan";
      porsiKet = `Iuran JKM (${isPolri ? "POLRI" : "TNI"} 0,81%)`;
      items = [{
        jenis: `Iuran JKM (0,81% Basis Gaji Pokok ${isPolri ? "Anggota POLRI & PNS Polri" : "Prajurit TNI & ASN Kemhan"})`,
        peserta: isPolri ? "6.120" : "8.208",
        nominal: formatRupiah(nomValue)
      }];
    }

    const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const isTHTProg = programName.startsWith("THT");
    const isPolriProg = programName.includes("POLRI");

    const newItem = {
      id: `TGH-${Date.now().toString().slice(-4)}`,
      noSurat: curNoSurat,
      perihal: curPerihal,
      program: programName,
      danaPorsi: porsiKet,
      matra: matraName,
      periode: selectedProgram === "THT_PENSIUN" ? "Mei 2026" : "Juli 2026",
      tglGenerate: todayStr,
      tglCutoff: "10 Mei 2026",
      noKEP: "KEP-16/PB/PB.3/2026",
      tglKEP: "11 Mei 2026",
      tahunAnggaran: "2026",
      noBukti: isTHTProg ? (isPolriProg ? "22/PFK.THT-POLRI/V/2026-Keu" : "21/PFK.THT-AS/V/2026-Keu") : (isPolriProg ? "23/PFK.PEN-POLRI/V/2026-Keu" : "24/PFK.PEN-TNI/V/2026-Keu"),
      nominal: formatRupiah(nomValue),
      nominalNum: nomValue,
      nominalLalu: isTHTProg ? 284150320000 : 414729482733,
      namaRekening: isTHTProg ? (isPolriProg ? "THT POLRI ASABRI" : "THT TNI ASABRI") : (isPolriProg ? "Dapen POLRI ASABRI" : "Dapen TNI ASABRI"),
      noRekening: isTHTProg ? (isPolriProg ? "0261-01-000005-30-5" : "0261-01-000004-30-9") : (isPolriProg ? "0261-01-000629-30-3" : "0261-01-000628-30-7"),
      namaBank: "BRI Kantor Cabang Jakarta Krekot",
      acuan: skpDetails ? `Keputusan Dirjen Perbendaharaan KEP-16/PB/PB.3/2026` : `Nota Dinas Kepesertaan (${noNotaDinas})`,
      dokumen: curDok,
      noNotaDinas: (selectedProgram === "JKK" || selectedProgram === "JKM") ? noNotaDinas : undefined,
      namaNotaDinas: (selectedProgram === "JKK" || selectedProgram === "JKM") ? (notaDinasFile?.name || notaDinasFileName) : undefined,
      noSPDipa: (selectedProgram === "JKK" || selectedProgram === "JKM") ? noSPDipa : undefined,
      peserta: programName.includes("TNI") ? "266.150" : (programName.includes("POLRI") ? "142.200" : "14.328"),
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      namaPejabat: namaPejabat || "HELMI I. SATRIYONO",
      jabatan: jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
      namaDirektur: namaPejabat || "HELMI I. SATRIYONO",
      jabatanDirektur: jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
      skpDetails: skpDetails,
      items: items,
      satkerList: satkerList
    };

    // Buka Modal Preview Terlebih Dahulu Sebelum Tagihan Dibuat/Disimpan
    if (selectedProgram === "THT_PENSIUN") {
      setPreview({
        title: `Pratinjau Surat Tagihan Iuran ${programName} — ${curNoSurat}`,
        subtitle: `Format Resmi Sesuai SuratTagihan_PensiunTNI.pdf • Satker (440780)`,
        type: "surat_kemenkeu",
        fileName: `Surat_Tagihan_${programName.replace(/\s+/g, "_")}_${curNoSurat.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        bannerNotice: `🔍 Pratinjau Dokumen: Format surat tagihan resmi per-dana THT & Pensiun disusun persis sesuai dokumen resmi SuratTagihan_PensiunTNI.pdf (Satker 440780).`,
        confirmAction: {
          label: `Konfirmasi & Terbitkan Tagihan ${programName}`,
          icon: <CheckCircle2 size={15} />,
          variant: "success",
          onClick: () => {
            setMonitoringSKPList((prev) => [buildMonitoringRecord(newItem, jenisIuranPFK), ...prev]);
            setMonitoringProgram("THT_PENSIUN");
            setMonFilterDanaPFK("Semua");
            setMonSearchTerm("");
            setPerihal("");
            setSuccessNotice(`Surat Tagihan ${programName} (${curNoSurat}) berhasil diterbitkan dan masuk ke Monitoring Penerimaan Dana.`);
            setActiveTab("monitoring");
            setTimeout(() => setSuccessNotice(null), 6000);
          }
        },
        content: {
          program: programName,
          noSurat: curNoSurat,
          perihal: curPerihal,
          tanggalSurat: "12 Mei 2026",
          tglCutoff: "10 Mei 2026",
          noKEP: "KEP-16/PB/PB.3/2026",
          tglKEP: "11 Mei 2026",
          tahunAnggaran: "2026",
          nominalNum: nomValue,
          nominalStr: formatRupiah(nomValue),
          nominalLalu: isTHTProg ? 284150320000 : 414729482733,
          noBukti: isTHTProg ? (isPolriProg ? "22/PFK.THT-POLRI/V/2026-Keu" : "21/PFK.THT-AS/V/2026-Keu") : (isPolriProg ? "23/PFK.PEN-POLRI/V/2026-Keu" : "24/PFK.PEN-TNI/V/2026-Keu"),
          namaRekening: isTHTProg ? (isPolriProg ? "THT POLRI ASABRI" : "THT TNI ASABRI") : (isPolriProg ? "Dapen POLRI ASABRI" : "Dapen TNI ASABRI"),
          noRekening: isTHTProg ? (isPolriProg ? "0261-01-000005-30-5" : "0261-01-000004-30-9") : (isPolriProg ? "0261-01-000629-30-3" : "0261-01-000628-30-7"),
          namaBank: "BRI Kantor Cabang Jakarta Krekot",
          namaPejabat: namaPejabat || "HELMI I. SATRIYONO",
          jabatan: jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaDirektur: namaPejabat || "HELMI I. SATRIYONO",
          jabatanDirektur: jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaPPK: "Nazif Azhari",
          isPFKKemenkeu: true,
          satkerList: satkerList
        }
      });
    } else {
      setPreview({
        title: `Pratinjau Surat Tagihan — ${programName}`,
        subtitle: `${curNoSurat} • Divisi Kepesertaan & SP DIPA`,
        type: "surat",
        fileName: `Surat_Tagihan_${programName.replace(/\s+/g, "_")}_Juli_2026.pdf`,
        bannerNotice: `🔍 Pratinjau Dokumen Tagihan ${programName}: Menampilkan nomor surat freetext, nomor Nota Dinas Divisi Kepesertaan, berkas upload, serta SP DIPA.`,
        confirmAction: {
          label: `Konfirmasi & Terbitkan Tagihan ${programName}`,
          icon: <CheckCircle2 size={15} />,
          variant: "success",
          onClick: () => {
            const monRecord = buildMonitoringRecord(newItem, jenisIuranPFK);
            if (selectedProgram === "JKK") {
              setMonitoringJKKList((prev) => [monRecord, ...prev]);
              setMonFilterDanaJKK("Semua");
            } else {
              setMonitoringJKMList((prev) => [monRecord, ...prev]);
              setMonFilterDanaJKM("Semua");
            }
            setMonitoringProgram(selectedProgram);
            setMonSearchTerm("");
            setNextNoUrutJKK_JKM((prev) => prev + 1);
            setPerihal("");
            setSuccessNotice(`Surat Tagihan ${programName} (${curNoSurat}) berhasil diterbitkan dan masuk ke Monitoring Penerimaan Dana.`);
            setActiveTab("monitoring");
            setTimeout(() => setSuccessNotice(null), 6000);
          }
        },
        content: {
          noSurat: curNoSurat,
          noNotaDinas: noNotaDinas,
          namaNotaDinas: notaDinasFile?.name || notaDinasFileName,
          noSPDipa: noSPDipa,
          perihal: curPerihal,
          periode: "Juli 2026",
          program: programName,
          items: items,
          totalNominal: formatRupiah(nomValue),
          satkerList: satkerList,
          dasarSKP: null,
          namaPejabat: namaPejabat || "HELMI I. SATRIYONO",
          jabatan: jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaDirektur: namaPejabat || "HELMI I. SATRIYONO",
          jabatanDirektur: jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO"
        }
      });
    }
  };

  // Handler Generate Sekaligus 4 Surat Dana PFK (Batch)
  const handleGenerateBatch = () => {
    const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const start = Number(batchStartNo) || 1190;

    const batchLetters = [
      {
        id: `TGH-${Date.now().toString().slice(-4)}-1`,
        noSurat: `S-${start}/KU.06.06/KMR.N/X/2024`,
        program: "THT TNI",
        danaPorsi: "Iuran THT Prajurit TNI & ASN Kemhan (3,25%)",
        matra: "TNI & Kemhan",
        periode: "Oktober 2024",
        tglGenerate: todayStr,
        tglCutoff: "10 Oktober 2024",
        noKEP: batchNoSKP || "KEP-41/PB/PB.3/2024",
        tglKEP: todayStr,
        tahunAnggaran: "2024",
        noBukti: "21/PFK.THT-AS/X/2024-Keu",
        acuan: `Keputusan Dirjen Perbendaharaan No. ${batchNoSKP}`,
        nominal: "Rp 1.121.913.428",
        nominalNum: 1121913428,
        nominalLalu: 1059518554039,
        namaRekening: "THT Umum ASABRI",
        noRekening: "0261-01-000004-30-9",
        namaBank: "BRI Kantor Cabang Jakarta Krekot",
        namaPejabat: namaPejabat || "Helmi I Satriyo",
        jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        namaDirektur: namaPejabat || "Helmi I Satriyo",
        jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        dokumen: batchDocName,
        peserta: "266.150",
        status: "Siap Cetak & TTD Manual",
        tglTTD: null,
        resiPos: null,
        skpDetails: { noSurat: batchNoSKP, tglSurat: todayStr, fileName: batchDocName, nominal: "Rp 1.121.913.428" },
        items: [{ jenis: "Iuran THT (3,25% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 1.121.913.428" }],
        satkerList: SATKER_THT_TNI
      },
      {
        id: `TGH-${Date.now().toString().slice(-4)}-2`,
        noSurat: `S-${start + 1}/KU.06.06/KMR.N/X/2024`,
        program: "THT POLRI",
        danaPorsi: "Iuran THT Anggota POLRI & PNS Polri (3,25%)",
        matra: "POLRI",
        periode: "Oktober 2024",
        tglGenerate: todayStr,
        tglCutoff: "10 Oktober 2024",
        noKEP: batchNoSKP || "KEP-41/PB/PB.3/2024",
        tglKEP: todayStr,
        tahunAnggaran: "2024",
        noBukti: "22/PFK.THT-POLRI/X/2024-Keu",
        acuan: `Keputusan Dirjen Perbendaharaan No. ${batchNoSKP}`,
        nominal: "Rp 14.225.000.000",
        nominalNum: 14225000000,
        nominalLalu: 542180412000,
        namaRekening: "THT Umum ASABRI",
        noRekening: "0261-01-000004-30-9",
        namaBank: "BRI Kantor Cabang Jakarta Krekot",
        namaPejabat: namaPejabat || "Helmi I Satriyo",
        jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        namaDirektur: namaPejabat || "Helmi I Satriyo",
        jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        dokumen: batchDocName,
        peserta: "142.200",
        status: "Siap Cetak & TTD Manual",
        tglTTD: null,
        resiPos: null,
        skpDetails: { noSurat: batchNoSKP, tglSurat: todayStr, fileName: batchDocName, nominal: "Rp 14.225.000.000" },
        items: [{ jenis: "Iuran THT (3,25% Gaji Pokok Anggota POLRI & PNS Polri)", peserta: "142.200", nominal: "Rp 14.225.000.000" }],
        satkerList: SATKER_THT_POLRI
      },
      {
        id: `TGH-${Date.now().toString().slice(-4)}-3`,
        noSurat: `S-${start + 2}/KU.06.06/KMR.N/X/2024`,
        program: "Pensiun TNI",
        danaPorsi: "Iuran Pensiun Prajurit TNI & ASN Kemhan (4,75%)",
        matra: "TNI & Kemhan",
        periode: "Oktober 2024",
        tglGenerate: todayStr,
        tglCutoff: "10 Oktober 2024",
        noKEP: batchNoSKP || "KEP-41/PB/PB.3/2024",
        tglKEP: todayStr,
        tahunAnggaran: "2024",
        noBukti: "24/PFK.PEN-TNI/X/2024-Keu",
        acuan: `Keputusan Dirjen Perbendaharaan No. ${batchNoSKP}`,
        nominal: "Rp 41.710.000.000",
        nominalNum: 41710000000,
        nominalLalu: 1628410500000,
        namaRekening: "Pensiun ASABRI",
        noRekening: "0261-01-000005-30-5",
        namaBank: "BRI Kantor Cabang Jakarta Krekot",
        namaPejabat: namaPejabat || "Helmi I Satriyo",
        jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        namaDirektur: namaPejabat || "Helmi I Satriyo",
        jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        dokumen: batchDocName,
        peserta: "266.150",
        status: "Siap Cetak & TTD Manual",
        tglTTD: null,
        resiPos: null,
        skpDetails: { noSurat: batchNoSKP, tglSurat: todayStr, fileName: batchDocName, nominal: "Rp 41.710.000.000" },
        items: [{ jenis: "Iuran Pensiun (4,75% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 41.710.000.000" }],
        satkerList: SATKER_PENSIUN_TNI
      },
      {
        id: `TGH-${Date.now().toString().slice(-4)}-4`,
        noSurat: `S-${start + 3}/KU.06.06/KMR.N/X/2024`,
        program: "Pensiun POLRI",
        danaPorsi: "Iuran Pensiun Anggota POLRI & PNS Polri (4,75%)",
        matra: "POLRI",
        periode: "Oktober 2024",
        tglGenerate: todayStr,
        tglCutoff: "10 Oktober 2024",
        noKEP: batchNoSKP || "KEP-41/PB/PB.3/2024",
        tglKEP: todayStr,
        tahunAnggaran: "2024",
        noBukti: "23/PFK.PEN-POLRI/X/2024-Keu",
        acuan: `Keputusan Dirjen Perbendaharaan No. ${batchNoSKP}`,
        nominal: "Rp 20.805.000.000",
        nominalNum: 20805000000,
        nominalLalu: 812490210000,
        namaRekening: "Pensiun ASABRI",
        noRekening: "0261-01-000005-30-5",
        namaBank: "BRI Kantor Cabang Jakarta Krekot",
        namaPejabat: namaPejabat || "Helmi I Satriyo",
        jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        namaDirektur: namaPejabat || "Helmi I Satriyo",
        jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        dokumen: batchDocName,
        peserta: "142.200",
        status: "Siap Cetak & TTD Manual",
        tglTTD: null,
        resiPos: null,
        skpDetails: { noSurat: batchNoSKP, tglSurat: todayStr, fileName: batchDocName, nominal: "Rp 20.805.000.000" },
        items: [{ jenis: "Iuran Pensiun (4,75% Gaji Pokok Anggota POLRI & PNS Polri)", peserta: "142.200", nominal: "Rp 20.805.000.000" }],
        satkerList: SATKER_PENSIUN_POLRI
      }
    ];

    setPreview({
      title: `Pratinjau Batch: 4 Surat Tagihan Per-Dana PFK (No. S-${start} s.d. S-${start + 3})`,
      subtitle: `Format Resmi Kemenkeu RI (3 Halaman) • SKP: ${batchNoSKP || "KEP-41/PB/PB.3/2024"}`,
      type: "surat_kemenkeu",
      fileName: `Surat_Tagihan_Batch_PFK_S_${start}.pdf`,
      bannerNotice: `🔍 Pratinjau Batch: Menampilkan rincian Surat 1 (THT TNI). Sebanyak 4 Surat Tagihan resmi (THT TNI, THT POLRI, Pensiun TNI, Pensiun POLRI) akan diterbitkan sekaligus.`,
      confirmAction: {
        label: `Konfirmasi & Terbitkan 4 Surat Sekaligus`,
        icon: <Sparkles size={15} />,
        variant: "success",
        onClick: () => {
          const batchDanaTypes = ["THT_TNI", "THT_POLRI", "PENSIUN_TNI", "PENSIUN_POLRI"];
          setMonitoringSKPList((prev) => [...batchLetters.map((l, i) => buildMonitoringRecord(l, batchDanaTypes[i])), ...prev]);
          setMonitoringProgram("THT_PENSIUN");
          setMonFilterDanaPFK("Semua");
          setSuccessNotice(`Sukses! 4 Surat Tagihan Per-Dana PFK (No. S-${start} s.d. S-${start + 3}) berhasil digenerate sekaligus dan masuk ke Monitoring Penerimaan Dana.`);
          setActiveTab("monitoring");
          setTimeout(() => setSuccessNotice(null), 6000);
        }
      },
      content: {
        program: "THT TNI",
        noSurat: `S-${start}/KU.06.06/KMR.N/X/2024`,
        tanggalSurat: todayStr,
        tglCutoff: "10 Oktober 2024",
        noKEP: batchNoSKP || "KEP-41/PB/PB.3/2024",
        tglKEP: todayStr,
        tahunAnggaran: "2024",
        nominalNum: 1121913428,
        nominalStr: "Rp 1.121.913.428",
        nominalLalu: 1059518554039,
        noBukti: "21/PFK.THT-AS/X/2024-Keu",
        namaRekening: "THT Umum ASABRI",
        noRekening: "0261-01-000004-30-9",
        namaBank: "BRI Kantor Cabang Jakarta Krekot",
        namaPejabat: namaPejabat || "Helmi I Satriyo",
        jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        namaDirektur: namaPejabat || "Helmi I Satriyo",
        jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
        namaPPK: "Nazif Azhari",
        isPFKKemenkeu: true,
        satkerList: SATKER_THT_TNI
      }
    });
  };

  // Filter Tabel Riwayat Penagihan (data riwayat diturunkan dari monitoring berstatus "Selesai", lihat riwayatList)
  const [filterTable, setFilterTable] = useState("Semua");

  // =========================================================================
  // STATE & DATASET TAB 2: MONITORING PENERIMAAN DANA
  // =========================================================================
  const fmtB = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const fmtNum = (n) => Number(n || 0).toLocaleString("id-ID");

  const [monitoringProgram, setMonitoringProgram] = useState("THT_PENSIUN");
  const [monTglAwal, setMonTglAwal] = useState("2026-07-01");
  const [monTglAkhir, setMonTglAkhir] = useState("2026-09-30");
  const [monFilterDanaPFK, setMonFilterDanaPFK] = useState("Semua");
  const [monFilterDanaJKK, setMonFilterDanaJKK] = useState("Semua");
  const [monFilterDanaJKM, setMonFilterDanaJKM] = useState("Semua");
  const [monSearchTerm, setMonSearchTerm] = useState("");

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
      tglSuratDiterima: "16 September 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: 28540000000,
      danaTHT: 28540000000,
      danaPensiun: 0,
      nominalDiterima: 28540000000,
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan resmi 1190/KU.06.06/KMR.N/IX/2026 diterbitkan ke Kemenkeu RI (menunggu realisasi penerimaan dana)",
          user: "Helmi I Satriyo"
        }
      ],
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
      tglSuratDiterima: "",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: 14225000000,
      danaTHT: 14225000000,
      danaPensiun: 0,
      nominalDiterima: 14225000000,
      statusDana: "Surat Belum Diterima",
      statusTagihan: "Surat Belum Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Surat Belum Diterima",
          catatan: "Surat tagihan resmi 1191/KU.06.06/KMR.N/IX/2026 diterbitkan ke Kemenkeu RI (menunggu tanda terima surat)",
          user: "Helmi I Satriyo"
        }
      ],
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
      tglSuratDiterima: "16 September 2026",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "",
      bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: 41710000000,
      danaTHT: 0,
      danaPensiun: 41710000000,
      nominalDiterima: 41710000000,
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan resmi 1192/KU.06.06/KMR.N/IX/2026 diterbitkan ke Kemenkeu RI (menunggu realisasi penerimaan dana)",
          user: "Helmi I Satriyo"
        }
      ],
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
      tglSuratDiterima: "",
      statusSuratTagihan: "Terbit (Tergenerate)",
      noSKP: "S-184/PB.2/2026",
      tglSKP: "14 September 2026",
      tglTerimaDana: "",
      bankTujuan: "Bank BNI - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalDanaSKP: 20805000000,
      danaTHT: 0,
      danaPensiun: 20805000000,
      nominalDiterima: 20805000000,
      statusDana: "Surat Belum Diterima",
      statusTagihan: "Surat Belum Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Surat Belum Diterima",
          catatan: "Surat tagihan resmi 1193/KU.06.06/KMR.N/IX/2026 diterbitkan ke Kemenkeu RI (menunggu tanda terima surat)",
          user: "Helmi I Satriyo"
        }
      ],
      satkerList: SATKER_PENSIUN_POLRI
    }
  ]);

  const [monitoringJKKList, setMonitoringJKKList] = useState([
    {
      id: "JKK-001",
      program: "JKK",
      danaType: "JKK_POLRI",
      namaDana: "JKK POLRI",
      jenisIuran: "Iuran JKK Anggota POLRI & PNS Polri (0,62%)",
      kodeTarif: "0,62% Basis Gaji Pokok",
      matraUtama: "POLRI (6.120 Personel)",
      noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglSuratDiterima: "26 Juli 2026",
      tglTerimaDana: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "",
      nominalTagihan: 1120000000,
      nominalDiterima: 1120000000,
      peserta: 6120,
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      statusProses: "Dalam Monitoring",
      noNotaDinas: "ND-084/ASABRI/KEP/VII/2026",
      namaNotaDinas: "Nota_Dinas_Divisi_Kepesertaan_JKK_POLRI.pdf",
      noSPDipa: "SP-DIPA-023.01.2.690523/2026",
      namaPejabat: "HELMI I. SATRIYONO",
      jabatan: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan 002/ASABRI/TGH-JKK/VII/2026 diterbitkan ke Kemenkeu (menunggu pencairan SP2D)",
          user: "HELMI I. SATRIYONO"
        }
      ]
    },
    {
      id: "JKK-002",
      program: "JKK",
      danaType: "JKK_TNI",
      namaDana: "JKK TNI",
      jenisIuran: "Iuran JKK Prajurit TNI & ASN Kemhan (0,62%)",
      kodeTarif: "0,62% Basis Gaji Pokok",
      matraUtama: "TNI & Kemhan (8.208 Personel)",
      noSuratTagihan: "003/ASABRI/TGH-JKK/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglSuratDiterima: "",
      tglTerimaDana: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "",
      nominalTagihan: 1510000000,
      nominalDiterima: 1510000000,
      peserta: 8208,
      statusDana: "Surat Belum Diterima",
      statusTagihan: "Surat Belum Diterima",
      statusProses: "Dalam Monitoring",
      noNotaDinas: "ND-085/ASABRI/KEP/VII/2026",
      namaNotaDinas: "Nota_Dinas_Divisi_Kepesertaan_JKK_TNI.pdf",
      noSPDipa: "SP-DIPA-023.01.2.690524/2026",
      namaPejabat: "HELMI I. SATRIYONO",
      jabatan: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Surat Belum Diterima",
          catatan: "Surat tagihan 003/ASABRI/TGH-JKK/VII/2026 diterbitkan ke Kemenkeu (menunggu tanda terima surat)",
          user: "HELMI I. SATRIYONO"
        }
      ]
    }
  ]);

  const [monitoringJKMList, setMonitoringJKMList] = useState([
    {
      id: "JKM-001",
      program: "JKM",
      danaType: "JKM_POLRI",
      namaDana: "JKM POLRI",
      jenisIuran: "Iuran JKM Anggota POLRI & PNS Polri (0,81%)",
      kodeTarif: "0,81% Basis Gaji Pokok",
      matraUtama: "POLRI (6.120 Personel)",
      noSuratTagihan: "004/ASABRI/TGH-JKM/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglSuratDiterima: "26 Juli 2026",
      tglTerimaDana: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "",
      nominalTagihan: 940000000,
      nominalDiterima: 940000000,
      peserta: 6120,
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      statusProses: "Dalam Monitoring",
      noNotaDinas: "ND-086/ASABRI/KEP/VII/2026",
      namaNotaDinas: "Nota_Dinas_Divisi_Kepesertaan_JKM_POLRI.pdf",
      noSPDipa: "SP-DIPA-023.01.2.690525/2026",
      namaPejabat: "HELMI I. SATRIYONO",
      jabatan: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan 004/ASABRI/TGH-JKM/VII/2026 diterbitkan ke Kemenkeu (menunggu pencairan SP2D)",
          user: "HELMI I. SATRIYONO"
        }
      ]
    },
    {
      id: "JKM-002",
      program: "JKM",
      danaType: "JKM_TNI",
      namaDana: "JKM TNI",
      jenisIuran: "Iuran JKM Prajurit TNI & ASN Kemhan (0,81%)",
      kodeTarif: "0,81% Basis Gaji Pokok",
      matraUtama: "TNI & Kemhan (8.208 Personel)",
      noSuratTagihan: "005/ASABRI/TGH-JKM/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglSuratDiterima: "",
      tglTerimaDana: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "",
      nominalTagihan: 1270000000,
      nominalDiterima: 1270000000,
      peserta: 8208,
      statusDana: "Surat Belum Diterima",
      statusTagihan: "Surat Belum Diterima",
      statusProses: "Dalam Monitoring",
      noNotaDinas: "ND-087/ASABRI/KEP/VII/2026",
      namaNotaDinas: "Nota_Dinas_Divisi_Kepesertaan_JKM_TNI.pdf",
      noSPDipa: "SP-DIPA-023.01.2.690526/2026",
      namaPejabat: "HELMI I. SATRIYONO",
      jabatan: "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Surat Belum Diterima",
          catatan: "Surat tagihan 005/ASABRI/TGH-JKM/VII/2026 diterbitkan ke Kemenkeu (menunggu tanda terima surat)",
          user: "HELMI I. SATRIYONO"
        }
      ]
    }
  ]);

  // Data Riwayat Penagihan: diturunkan dari seluruh item monitoring yang telah dinyatakan "Selesai"
  const allCompletedTagihan = [
    ...monitoringSKPList.filter((x) => x.statusProses === "Selesai"),
    ...monitoringJKKList.filter((x) => x.statusProses === "Selesai"),
    ...monitoringJKMList.filter((x) => x.statusProses === "Selesai")
  ].map((item) => {
    const isTHT = (item.danaType || item.program || "").startsWith("THT");
    const isPolri = (item.danaType || item.program || "").includes("POLRI");
    const nom = Number(item.nominalDanaSKP || item.nominalTagihan || item.nominalDiterima || item.nominalNum || 0);
    const progName = item.program || item.namaDana || (isTHT ? (isPolri ? "THT POLRI" : "THT TNI") : (isPolri ? "Pensiun POLRI" : "Pensiun TNI"));
    return {
      ...item,
      id: item.id,
      noSurat: item.noSuratTagihan || item.noSurat || "-",
      perihal: item.perihal || `Tagihan Iuran ${progName}`,
      program: progName,
      danaPorsi: item.jenisIuran || item.danaPorsi || item.kodeTarif || "-",
      matra: item.matraUtama || item.matra || (isPolri ? "POLRI" : "TNI & Kemhan"),
      periode: item.periode || "Oktober 2024",
      tglGenerate: item.tglSuratTagihan || item.tglGenerate || "-",
      tglSelesai: item.tglSelesai || "-",
      dokumen: item.dokumen || item.noSKP || `SKP-PFK_${progName.replace(/\s+/g, "_")}.pdf`,
      peserta: typeof item.peserta === "number" ? fmtNum(item.peserta) : (item.peserta || "-"),
      nominal: typeof item.nominal === "string" && item.nominal.startsWith("Rp") ? item.nominal : fmtB(nom),
      nominalNum: nom,
      namaPejabat: item.namaPejabat || item.namaDirektur || "Helmi I Satriyo",
      jabatan: item.jabatan || item.jabatanDirektur || "Direktur Keuangan dan Manajemen Resiko",
      statusProses: "Selesai"
    };
  });

  const displayedTagihan = allCompletedTagihan.filter((t) => {
    if (filterTable === "Semua") return true;
    if (filterTable === "DANA_PFK") return ["THT TNI", "THT POLRI", "Pensiun TNI", "Pensiun POLRI"].includes(t.program);
    return t.program === filterTable;
  });

  const activeMonitoringCount =
    monitoringSKPList.filter((x) => x.statusProses !== "Selesai").length +
    monitoringJKKList.filter((x) => x.statusProses !== "Selesai").length +
    monitoringJKMList.filter((x) => x.statusProses !== "Selesai").length;

  // Modal Detail Monitoring & Input Perubahan Status Tagihan
  const [selectedDetailMonitoring, setSelectedDetailMonitoring] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusEditForm, setStatusEditForm] = useState({
    statusTagihan: "Dana Diterima",
    noSP2D: "",
    tglTerimaDana: "",
    catatan: ""
  });

  const getItemCalculatedStatus = (item) => {
    if (!item) return "Surat Belum Diterima";
    if (
      item.statusProses === "Selesai" ||
      item.statusDana === "Dana Diterima" ||
      item.statusTagihan === "Dana Diterima" ||
      (item.tglTerimaDana && String(item.tglTerimaDana).trim())
    ) {
      return "Dana Diterima";
    }
    if (item.tglSuratDiterima && String(item.tglSuratDiterima).trim()) {
      return "Dana Belum Diterima";
    }
    return "Surat Belum Diterima";
  };

  const getStatusTagihanBadge = (input) => {
    let s = "";
    if (typeof input === "object" && input !== null) {
      s = getItemCalculatedStatus(input);
    } else {
      s = input || "Surat Belum Diterima";
    }

    if (
      s === "Dana Diterima" ||
      s.includes("Selesai") ||
      (s.includes("Diterima") && !s.includes("Belum") && !s.includes("Surat"))
    ) {
      return {
        bg: "#ECFDF5",
        text: "#047857",
        border: "#A7F3D0",
        label: "Dana Diterima",
        iconColor: "#059669"
      };
    }
    if (
      s === "Dana Belum Diterima" ||
      (s.includes("Dana") && s.includes("Belum"))
    ) {
      return {
        bg: "#EFF6FF",
        text: "#1D4ED8",
        border: "#BFDBFE",
        label: "Dana Belum Diterima",
        iconColor: "#2563EB"
      };
    }
    return {
      bg: "#FFFBEB",
      text: "#B45309",
      border: "#FDE68A",
      label: "Surat Belum Diterima",
      iconColor: "#D97706"
    };
  };

  const renderStatusIcon = (label) => {
    if (label === "Dana Diterima" || label?.includes("Selesai")) {
      return <CheckCircle2 size={12} color="#059669" />;
    }
    if (label === "Dana Belum Diterima") {
      return <Clock size={12} color="#2563EB" />;
    }
    return <Clock size={12} color="#D97706" />;
  };

  const handleOpenDetailModal = (item) => {
    const calcStatus = getItemCalculatedStatus(item);
    setSelectedDetailMonitoring(item);
    setIsEditingStatus(false);
    setStatusEditForm({
      statusTagihan: calcStatus,
      noSP2D: item.noSP2D || "",
      tglTerimaDana: item.tglTerimaDana || "",
      catatan: ""
    });
  };

  const handleSaveStatusChange = (e) => {
    e.preventDefault();
    if (!selectedDetailMonitoring) return;

    const newStatus = statusEditForm.statusTagihan === "Dana Diterima" ? "Dana Diterima" : "Dana Belum Diterima";
    const newNoSP2D = statusEditForm.noSP2D?.trim() || selectedDetailMonitoring.noSP2D || "";
    const newTglTerima = statusEditForm.tglTerimaDana?.trim() || selectedDetailMonitoring.tglTerimaDana || "";
    const catatan = statusEditForm.catatan?.trim() || `Status tagihan diperbarui menjadi ${newStatus}`;

    const newHistoryEntry = {
      tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: newStatus,
      catatan: catatan,
      user: selectedDetailMonitoring.namaPejabat || namaPejabat || "Helmi I Satriyo"
    };

    const existingHistory = selectedDetailMonitoring.riwayatStatus && selectedDetailMonitoring.riwayatStatus.length > 0
      ? selectedDetailMonitoring.riwayatStatus
      : [
          {
            tanggal: selectedDetailMonitoring.tglSuratTagihan || "15 September 2026",
            status: "Dana Belum Diterima",
            catatan: "Surat tagihan diterbitkan ke Kemenkeu RI",
            user: selectedDetailMonitoring.namaPejabat || namaPejabat || "Helmi I Satriyo"
          }
        ];

    const updatedItem = {
      ...selectedDetailMonitoring,
      statusTagihan: newStatus,
      statusDana: newStatus,
      noSP2D: newNoSP2D,
      tglTerimaDana: newTglTerima,
      riwayatStatus: [...existingHistory, newHistoryEntry]
    };

    setMonitoringSKPList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKKList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKMList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));

    setSelectedDetailMonitoring(updatedItem);
    setIsEditingStatus(false);
    setSuccessNotice(`Status tagihan nomor ${updatedItem.noSuratTagihan || updatedItem.id} berhasil diubah menjadi "${newStatus}"!`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  // Tandai proses monitoring selesai: tagihan keluar dari daftar Monitoring aktif dan masuk ke tab Riwayat Penagihan
  const handleMarkMonitoringSelesai = () => {
    if (!selectedDetailMonitoring) return;
    const noSuratLabel = selectedDetailMonitoring.noSuratTagihan || selectedDetailMonitoring.id;
    if (!window.confirm(`Nyatakan monitoring tagihan ${noSuratLabel} selesai?\nTagihan akan dipindahkan dari Monitoring ke Riwayat Penagihan.`)) return;

    const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const updatedItem = {
      ...selectedDetailMonitoring,
      statusProses: "Selesai",
      tglSelesai: todayStr,
      selesaiAt: Date.now(),
      riwayatStatus: [
        ...(selectedDetailMonitoring.riwayatStatus || []),
        {
          tanggal: todayStr,
          status: "Monitoring Selesai",
          catatan: `Proses monitoring dinyatakan selesai (status dana terakhir: ${selectedDetailMonitoring.statusTagihan || selectedDetailMonitoring.statusDana || "Dana Belum Diterima"})`,
          user: selectedDetailMonitoring.namaPejabat || namaPejabat || "Helmi I Satriyo"
        }
      ]
    };

    setMonitoringSKPList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKKList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKMList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));

    setSelectedDetailMonitoring(null);
    setIsEditingStatus(false);
    setSuccessNotice(`Monitoring tagihan ${noSuratLabel} dinyatakan selesai dan telah dipindahkan ke Riwayat Penagihan.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  // Helper konversi format tanggal ke bahasa Indonesia
  const formatTglIndo = (dStr) => {
    if (!dStr) return "-";
    if (typeof dStr === "string" && dStr.includes(" ") && !dStr.includes("-")) return dStr;
    try {
      const parts = dStr.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
        }
      }
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      }
      return dStr;
    } catch (e) {
      return dStr;
    }
  };

  // Helper konversi tanggal teks/string ke format YYYY-MM-DD untuk input kalender
  const toISODate = (dStr) => {
    if (!dStr) return new Date().toISOString().split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) return dStr;
    try {
      const months = {
        januari: "01", februari: "02", maret: "03", april: "04", mei: "05", juni: "06",
        juli: "07", agustus: "08", september: "09", oktober: "10", november: "11", desember: "12",
        jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
        jul: "07", aug: "08", sep: "09", okt: "10", oct: "10", nov: "11", des: "12", dec: "12"
      };
      const parts = dStr.toLowerCase().split(/\s+/);
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = months[parts[1]] || "09";
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    } catch (e) {
      // fallback
    }
    return new Date().toISOString().split("T")[0];
  };

  // State Modal Update Status (Menyesuaikan Alur: Step 1 Tanggal Surat Diterima, Step 2 Tanggal Diterima beserta Nominalnya)
  const [updateStatusModal, setUpdateStatusModal] = useState({
    open: false,
    item: null,
    step: 1, // 1: Belum set tanggal surat diterima -> Form Tanggal Surat Diterima
             // 2: Sudah set tanggal surat diterima -> Form Tanggal Diterima beserta Nominalnya
    tglSuratDiterima: "",
    tglTerimaDana: "",
    nominalDiterima: "",
    noSP2D: "",
    bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
    catatan: "",
    error: ""
  });

  // Handler membuka modal Update Status dari kolom Aksi
  const handleOpenUpdateStatus = (item) => {
    if (!item) return;
    const hasTglSuratDiterima = Boolean(item.tglSuratDiterima && item.tglSuratDiterima.trim());
    const rawNom = item.nominalDanaSKP || item.nominalTagihan || item.nominalDiterima || item.nominalNum || 0;
    const isJKKorJKM = item.program === "JKK" || item.program === "JKM" || item.danaType?.startsWith("JKK") || item.danaType?.startsWith("JKM");

    const tglDiterimaISO = hasTglSuratDiterima ? toISODate(item.tglSuratDiterima) : toISODate(item.tglSuratTagihan || "");
    const tglTerimaDanaISO = item.tglTerimaDana ? toISODate(item.tglTerimaDana) : (hasTglSuratDiterima ? tglDiterimaISO : "");

    setUpdateStatusModal({
      open: true,
      item,
      step: hasTglSuratDiterima ? 2 : 1,
      tglSuratDiterima: tglDiterimaISO,
      tglTerimaDana: tglTerimaDanaISO,
      nominalDiterima: String(rawNom),
      noSP2D: isJKKorJKM ? (item.noSP2D || (item.danaType?.includes("POLRI") ? "SP2D-260728-004128" : "SP2D-260728-004129")) : "",
      bankTujuan: item.bankTujuan || "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      catatan: "",
      error: ""
    });
  };

  // Handler Simpan Step 1: Simpan Tanggal Surat Diterima Kemenkeu
  const handleSaveStep1TglSuratDiterima = (e, andProceed = false) => {
    if (e && e.preventDefault) e.preventDefault();
    const item = updateStatusModal.item;
    if (!item || !updateStatusModal.tglSuratDiterima) {
      setUpdateStatusModal((prev) => ({ ...prev, error: "Tanggal Surat Diterima Kemenkeu RI wajib diisi!" }));
      return;
    }

    const dateFormatted = formatTglIndo(updateStatusModal.tglSuratDiterima);
    const noSurat = item.noSuratTagihan || item.noSurat || item.id;
    const note = updateStatusModal.catatan?.trim() || `Surat tagihan resmi ${noSurat} telah diterima oleh Kemenkeu RI pada ${dateFormatted}`;

    const newHistoryEntry = {
      tanggal: dateFormatted,
      status: "Surat Diterima Kemenkeu",
      catatan: note,
      user: item.namaPejabat || namaPejabat || "Helmi I Satriyo"
    };

    const updatedItem = {
      ...item,
      tglSuratDiterima: dateFormatted,
      statusSuratTagihan: "Diterima Kemenkeu RI",
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      riwayatStatus: [...(item.riwayatStatus || []), newHistoryEntry]
    };

    setMonitoringSKPList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKKList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKMList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));

    if (selectedDetailMonitoring && selectedDetailMonitoring.id === updatedItem.id) {
      setSelectedDetailMonitoring(updatedItem);
    }

    if (andProceed) {
      setUpdateStatusModal((prev) => ({
        ...prev,
        item: updatedItem,
        step: 2,
        tglSuratDiterima: toISODate(dateFormatted),
        tglTerimaDana: toISODate(dateFormatted),
        error: ""
      }));
      setSuccessNotice(`Tanggal Surat Diterima (${dateFormatted}) tersimpan. Lanjutkan input realisasi penerimaan dana.`);
    } else {
      setUpdateStatusModal({ open: false, item: null, step: 1, tglSuratDiterima: "", tglTerimaDana: "", nominalDiterima: "", noSP2D: "", bankTujuan: "", catatan: "", error: "" });
      setSuccessNotice(`Berhasil: Tanggal Surat Diterima untuk ${noSurat} telah diset ke ${dateFormatted}.`);
    }
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  // Handler Simpan Step 2: Simpan Realisasi Penerimaan Dana beserta Nominalnya
  const handleSaveStep2PenerimaanDana = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const item = updateStatusModal.item;
    if (!item) return;

    if (!updateStatusModal.tglSuratDiterima) {
      setUpdateStatusModal((prev) => ({ ...prev, error: "Tanggal Surat Diterima Kemenkeu RI wajib diisi!" }));
      return;
    }
    if (!updateStatusModal.tglTerimaDana) {
      setUpdateStatusModal((prev) => ({ ...prev, error: "Tanggal realisasi penerimaan dana masuk kas wajib diisi!" }));
      return;
    }
    if (updateStatusModal.tglTerimaDana < updateStatusModal.tglSuratDiterima) {
      setUpdateStatusModal((prev) => ({
        ...prev,
        error: `Tanggal penerimaan dana (${formatTglIndo(updateStatusModal.tglTerimaDana)}) tidak boleh lebih awal dari tanggal surat diterima Kemenkeu (${formatTglIndo(updateStatusModal.tglSuratDiterima)})!`
      }));
      return;
    }
    if (!updateStatusModal.nominalDiterima || Number(updateStatusModal.nominalDiterima) <= 0) {
      setUpdateStatusModal((prev) => ({ ...prev, error: "Nominal dana masuk harus lebih dari Rp 0!" }));
      return;
    }

    const noSuratLabel = item.noSuratTagihan || item.noSurat || item.id;
    const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const nomVal = Number(updateStatusModal.nominalDiterima);
    const dateFormatted = formatTglIndo(updateStatusModal.tglTerimaDana);
    const tglSuratDiterimaFormatted = formatTglIndo(updateStatusModal.tglSuratDiterima);
    const isJKKorJKM = item.program === "JKK" || item.program === "JKM" || item.danaType?.startsWith("JKK") || item.danaType?.startsWith("JKM");

    const updatedItem = {
      ...item,
      tglSuratDiterima: tglSuratDiterimaFormatted,
      tglTerimaDana: dateFormatted,
      nominalDiterima: nomVal,
      noSP2D: isJKKorJKM ? (updateStatusModal.noSP2D ? updateStatusModal.noSP2D.trim() : item.noSP2D) : undefined,
      bankTujuan: updateStatusModal.bankTujuan || item.bankTujuan,
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Selesai",
      tglSelesai: todayStr,
      selesaiAt: Date.now(),
      riwayatStatus: [
        ...(item.riwayatStatus || []),
        {
          tanggal: dateFormatted || todayStr,
          status: "Dana Diterima & Validasi Selesai",
          catatan: isJKKorJKM
            ? `Surat diterima Kemenkeu tgl ${tglSuratDiterimaFormatted}. Realisasi dana kas sebesar ${fmtB(nomVal)} telah divalidasi masuk rekening penampungan (${updateStatusModal.noSP2D || "SP2D"}). Monitoring selesai.`
            : `Surat diterima Kemenkeu tgl ${tglSuratDiterimaFormatted}. Realisasi penerimaan dana PFK sebesar ${fmtB(nomVal)} telah divalidasi masuk rekening penampungan. Monitoring selesai.`,
          user: item.namaPejabat || namaPejabat || "Helmi I Satriyo"
        }
      ]
    };

    setMonitoringSKPList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKKList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setMonitoringJKMList((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));

    setUpdateStatusModal({ open: false, item: null, step: 1, tglSuratDiterima: "", tglTerimaDana: "", nominalDiterima: "", noSP2D: "", bankTujuan: "", catatan: "", error: "" });
    if (selectedDetailMonitoring) setSelectedDetailMonitoring(null);
    setSuccessNotice(`Update Status Berhasil! Tagihan ${noSuratLabel} sebesar ${fmtB(nomVal)} telah selesai dan tersimpan di Riwayat Penagihan.`);
    setTimeout(() => setSuccessNotice(null), 6000);
  };

  const filteredMonitoringSKP = monitoringSKPList.filter((item) => {
    if (item.statusProses === "Selesai") return false;
    if (monFilterDanaPFK !== "Semua" && item.danaType !== monFilterDanaPFK) return false;
    if (monSearchTerm.trim()) {
      const q = monSearchTerm.toLowerCase();
      const matchSurat = item.noSuratTagihan?.toLowerCase().includes(q);
      const matchSKP = item.noSKP?.toLowerCase().includes(q);
      const matchSP2D = item.noSP2D?.toLowerCase().includes(q);
      const matchDana = item.namaDana?.toLowerCase().includes(q);
      if (!matchSurat && !matchSKP && !matchSP2D && !matchDana) return false;
    }
    return true;
  });

  const filteredMonitoringJKK = monitoringJKKList.filter((item) => {
    if (item.statusProses === "Selesai") return false;
    if (monFilterDanaJKK !== "Semua" && item.danaType !== monFilterDanaJKK) return false;
    if (monSearchTerm.trim()) {
      const q = monSearchTerm.toLowerCase();
      const matchSurat = item.noSuratTagihan?.toLowerCase().includes(q);
      const matchDana = item.namaDana?.toLowerCase().includes(q);
      const matchSP2D = item.noSP2D?.toLowerCase().includes(q);
      if (!matchSurat && !matchDana && !matchSP2D) return false;
    }
    return true;
  });

  const filteredMonitoringJKM = monitoringJKMList.filter((item) => {
    if (item.statusProses === "Selesai") return false;
    if (monFilterDanaJKM !== "Semua" && item.danaType !== monFilterDanaJKM) return false;
    if (monSearchTerm.trim()) {
      const q = monSearchTerm.toLowerCase();
      const matchSurat = item.noSuratTagihan?.toLowerCase().includes(q);
      const matchDana = item.namaDana?.toLowerCase().includes(q);
      const matchSP2D = item.noSP2D?.toLowerCase().includes(q);
      if (!matchSurat && !matchDana && !matchSP2D) return false;
    }
    return true;
  });

  const monitoringTheme = {
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
      title: "Jaminan Kecelakaan Kerja (JKK 0,62%)",
      badgeText: "Tarif 0,62%"
    },
    JKM: {
      primary: "#0D9488",
      lightBg: "#F0FDFA",
      badgeBg: "#CCFBF1",
      badgeColor: "#0F766E",
      title: "Jaminan Kematian (JKM 0,81%)",
      badgeText: "Tarif 0,81%"
    }
  }[monitoringProgram];

  const openSuratTagihanPreview = (item) => {
    if (!item) return;
    const isPFK = item.danaType?.startsWith("THT") || item.danaType?.startsWith("PENSIUN") || item.program?.includes("THT") || item.program?.includes("PENSIUN") || (!item.program?.startsWith("JK") && monitoringProgram === "THT_PENSIUN");
    if (isPFK) {
      const isTHT = (item.danaType || item.program || "").startsWith("THT");
      const isPolri = (item.danaType || item.program || "").includes("POLRI");
      const isPensiun = (item.danaType || item.program || "").includes("PENSIUN") || (item.danaType || item.program || "").includes("Pensiun");

      const namaDana = item.namaDana || item.program || (isTHT ? (isPolri ? "THT POLRI" : "THT TNI") : (isPolri ? "Pensiun POLRI" : "Pensiun TNI"));

      setPreview({
        title: `Surat Tagihan Iuran ${namaDana} — ${item.noSuratTagihan || item.noSurat}`,
        subtitle: `Format Resmi Sesuai Dokumen ASABRI • Satker (440780)`,
        type: "surat_kemenkeu",
        fileName: `Surat_Tagihan_${namaDana.replace(/[^a-zA-Z0-9]/g, "_")}_${(item.noSuratTagihan || item.noSurat || "").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          program: namaDana,
          noSurat: item.noSuratTagihan || item.noSurat || (isTHT ? "S-1155/KU.06.06/KMR.N/V/2026" : "S-1156/KU.06.06/KMR.N/V/2026"),
          tanggalSurat: item.tglSuratTagihan || item.tglGenerate || "12 Mei 2026",
          tglCutoff: item.tglCutoff || "10 Mei 2026",
          noKEP: item.noKEP || (item.skpDetails?.noSurat) || "KEP-16/PB/PB.3/2026",
          tglKEP: item.tglKEP || (item.skpDetails?.tglSurat) || "11 Mei 2026",
          tahunAnggaran: item.tahunAnggaran || "2026",
          nominalNum: item.nominalDanaSKP || item.nominalNum || item.nominalDiterima || (isTHT ? 2055120400 : 3002772913),
          nominalLalu: item.nominalLalu || (isTHT ? 284150320000 : 414729482733),
          noBukti: item.noBukti || (isTHT ? (isPolri ? "22/PFK.THT-POLRI/V/2026-Keu" : "21/PFK.THT-AS/V/2026-Keu") : (isPolri ? "23/PFK.PEN-POLRI/V/2026-Keu" : "24/PFK.PEN-TNI/V/2026-Keu")),
          namaRekening: item.namaRekening || (isTHT ? (isPolri ? "THT POLRI ASABRI" : "THT TNI ASABRI") : (isPolri ? "Dapen POLRI ASABRI" : "Dapen TNI ASABRI")),
          noRekening: item.noRekening || (isTHT ? (isPolri ? "0261-01-000005-30-5" : "0261-01-000004-30-9") : (isPolri ? "0261-01-000629-30-3" : "0261-01-000628-30-7")),
          namaBank: item.namaBank || "BRI Kantor Cabang Jakarta Krekot",
          namaPejabat: item.namaPejabat || item.namaDirektur || namaPejabat || "HELMI I. SATRIYONO",
          jabatan: item.jabatan || item.jabatanDirektur || jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaDirektur: item.namaPejabat || item.namaDirektur || namaPejabat || "HELMI I. SATRIYONO",
          jabatanDirektur: item.jabatan || item.jabatanDirektur || jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaPPK: "Nazif Azhari",
          isPFKKemenkeu: true,
          satkerList: item.satkerList || SATKER_THT_PENSIUN_ALL
        }
      });
    } else {
      const prog = item.program || monitoringProgram || "JKK";
      const namaDana = item.namaDana || (prog === "JKK" ? "JKK" : "JKM");
      setPreview({
        title: `Surat Tagihan Iuran ${namaDana} — ${item.noSuratTagihan || item.noSurat}`,
        subtitle: `${item.noSuratTagihan || item.noSurat} • Divisi Kepesertaan & SP DIPA`,
        type: "surat",
        fileName: `Surat_Tagihan_${namaDana.replace(/[^a-zA-Z0-9]/g, "_")}_${(item.noSuratTagihan || item.noSurat || "").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          judulSurat: `SURAT TAGIHAN IURAN ${namaDana.toUpperCase()}`,
          noSurat: item.noSuratTagihan || item.noSurat,
          noNotaDinas: item.noNotaDinas,
          namaNotaDinas: item.namaNotaDinas,
          noSPDipa: item.noSPDipa,
          tanggal: item.tglSuratTagihan || item.tglGenerate || "25 Juli 2026",
          periode: "Juli 2026",
          batchInfo: `Program: ${namaDana} • Tarif ${prog === "JKK" ? "0,62%" : "0,81%"}`,
          namaPejabat: item.namaPejabat || item.namaDirektur || namaPejabat || "HELMI I. SATRIYONO",
          jabatan: item.jabatan || item.jabatanDirektur || jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          namaDirektur: item.namaPejabat || item.namaDirektur || namaPejabat || "HELMI I. SATRIYONO",
          jabatanDirektur: item.jabatan || item.jabatanDirektur || jabatan || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO",
          items: [
            {
              jenis: item.jenisIuran || (prog === "JKK" ? "Iuran JKK (0,62%)" : "Iuran JKM (0,81%)"),
              peserta: `${fmtNum(item.peserta || (item.matraUtama?.includes("POLRI") ? 6120 : 8208))} Personel`,
              nominal: fmtB(item.nominalTagihan || item.nominalDiterima)
            }
          ],
          totalNominal: fmtB(item.nominalTagihan || item.nominalDiterima)
        }
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
      <SatkerModal data={satkerModalData} onClose={() => setSatkerModalData(null)} />

      {/* Bar Navigasi Tab (Form Penagihan vs Monitoring vs Riwayat Penagihan) */}
      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${COLORS.gray200}`,
          marginBottom: 20,
          gap: 6
        }}
      >
        <button
          onClick={() => setActiveTab("form")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13.5,
            fontWeight: activeTab === "form" ? 800 : 500,
            color: activeTab === "form" ? COLORS.blue : COLORS.gray600,
            borderBottom: activeTab === "form" ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            marginBottom: -2,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease"
          }}
        >
          <FileText size={16} />
          Form Penagihan Per-Dana
        </button>

        <button
          onClick={() => setActiveTab("monitoring")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13.5,
            fontWeight: activeTab === "monitoring" ? 800 : 500,
            color: activeTab === "monitoring" ? COLORS.blue : COLORS.gray600,
            borderBottom: activeTab === "monitoring" ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            marginBottom: -2,
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
              background: activeTab === "monitoring" ? "#DBEAFE" : "#F1F5F9",
              color: activeTab === "monitoring" ? "#1E40AF" : COLORS.gray600,
              padding: "2px 8px",
              borderRadius: 10,
              fontWeight: 700
            }}
          >
            {activeMonitoringCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13.5,
            fontWeight: activeTab === "history" ? 800 : 500,
            color: activeTab === "history" ? COLORS.blue : COLORS.gray600,
            borderBottom: activeTab === "history" ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            marginBottom: -2,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease"
          }}
        >
          <Clock size={16} />
          Riwayat Penagihan
          <span
            style={{
              fontSize: 11,
              background: activeTab === "history" ? "#DBEAFE" : "#F1F5F9",
              color: activeTab === "history" ? "#1E40AF" : COLORS.gray600,
              padding: "2px 8px",
              borderRadius: 10,
              fontWeight: 700
            }}
          >
            {allCompletedTagihan.length}
          </span>
        </button>
      </div>

      {/* Notifikasi Sukses */}
      {successNotice && (
        <div
          style={{
            marginBottom: 18,
            padding: "11px 16px",
            background: "#ECFDF5",
            borderRadius: 8,
            border: `1px solid #10B981`,
            color: "#065F46",
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <CheckCircle2 size={17} color="#10B981" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: FORM PENAGIHAN
         ========================================================================= */}
      {activeTab === "form" && (
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: "22px 24px",
              border: `1px solid ${COLORS.gray300}`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            {/* Header & Dropdown Pilihan Jenis Penagihan */}
            <div style={{ marginBottom: 20, borderBottom: `1px solid ${COLORS.gray200}`, paddingBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 800, color: COLORS.gray900, marginBottom: 4 }}>
                  Pilih Jenis Penagihan:
                </label>
                <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
                  Pilih program penagihan untuk penerbitan surat tagihan resmi ke Kemenkeu RI.
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <select
                  value={selectedProgram}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedProgram(val);
                    if (val === "THT_PENSIUN") setJenisIuranPFK("THT_POLRI");
                    else if (val === "JKK") setJenisIuranPFK("JKK_POLRI");
                    else if (val === "JKM") setJenisIuranPFK("JKM_POLRI");
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.gray800,
                    background: "#F8FAFC",
                    outline: "none",
                    boxSizing: "border-box",
                    cursor: "pointer"
                  }}
                >
                  <option value="THT_PENSIUN">THT/Pensiun</option>
                  <option value="JKK">JKK (Jaminan Kecelakaan Kerja)</option>
                  <option value="JKM">JKM (Jaminan Kematian)</option>
                </select>
              </div>
            </div>

            {/* FORM PENAGIHAN (THT/PENSIUN, JKK, & JKM) */}
            <form onSubmit={handleGenerate} style={{ width: "100%", boxSizing: "border-box" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                >
                  {/* FIELD 1: JENIS DANA */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Jenis Dana {selectedProgram === "THT_PENSIUN" ? "PFK" : selectedProgram} <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={jenisIuranPFK}
                      onChange={(e) => setJenisIuranPFK(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.gray800,
                        background: COLORS.white,
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "pointer"
                      }}
                    >
                      {selectedProgram === "THT_PENSIUN" ? (
                        <>
                          <option value="THT_POLRI">THT Polri (3,25%)</option>
                          <option value="THT_TNI">THT TNI (3,25%)</option>
                          <option value="PENSIUN_POLRI">Pensiun Polri (4,75%)</option>
                          <option value="PENSIUN_TNI">Pensiun TNI (4,75%)</option>
                        </>
                      ) : selectedProgram === "JKK" ? (
                        <>
                          <option value="JKK_POLRI">JKK Polri</option>
                          <option value="JKK_TNI">JKK TNI</option>
                        </>
                      ) : (
                        <>
                          <option value="JKM_POLRI">JKM Polri</option>
                          <option value="JKM_TNI">JKM TNI</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* FIELD 2: NOMOR SURAT (FREETEXT UNTUK SEMUA PROGRAM PENAGIHAN) */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      {selectedProgram === "THT_PENSIUN" ? "Nomor Surat PFK" : "Nomor Surat Tagihan"} <span style={{ color: "red" }}>*</span> <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.blue }}>(Free Text)</span>
                    </label>
                    <input
                      type="text"
                      value={noSurat}
                      onChange={(e) => setNoSurat(e.target.value)}
                      placeholder={selectedProgram === "THT_PENSIUN" ? "Masukkan Nomor Surat PFK (cth: S-1156/KU.06.06/KMR.N/V/2026)" : "Masukkan Nomor Surat Tagihan (cth: S-1198/KU.06.06/KMR.N/IX/2026)"}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 13,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        boxSizing: "border-box",
                        background: COLORS.white,
                        color: "#1E40AF",
                        outline: "none"
                      }}
                      required
                    />
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                      Nomor surat bebas diinput (free text) sesuai tata naskah kedinasan resmi.
                    </div>
                  </div>

                  {/* FIELD KHUSUS JENIS DANA JKK DAN JKM: NOTA DINAS DIVISI KEPESERTAAN & SP DIPA */}
                  {(selectedProgram === "JKK" || selectedProgram === "JKM") && (
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: 8,
                        padding: "16px 18px",
                        boxSizing: "border-box",
                        marginBottom: 4
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <ShieldCheck size={18} color="#16A34A" />
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
                            Kelengkapan Administrasi Divisi Kepesertaan ({selectedProgram === "JKK" ? "JKK 0,62%" : "JKM 0,81%"})
                          </span>
                        </div>
                        <span style={{ fontSize: 11, background: "#DCFCE7", color: "#15803D", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                          Persyaratan Iuran {selectedProgram}
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                        {/* 1. NOMOR NOTA DINAS DARI DIVISI KEPESERTAAN (FREE TEXT) */}
                        <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                            Nomor Nota Dinas dari Divisi Kepesertaan <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={noNotaDinas}
                            onChange={(e) => setNoNotaDinas(e.target.value)}
                            placeholder="Cth: ND-108/KEP/VII/2026"
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: 6,
                              border: `1px solid ${COLORS.gray300}`,
                              fontSize: 12.5,
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: "#166534",
                              background: COLORS.white,
                              outline: "none",
                              boxSizing: "border-box"
                            }}
                            required
                          />
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 4 }}>
                            Free text dari Divisi Kepesertaan
                          </div>
                        </div>

                        {/* 2. UPLOAD NOTA DINAS */}
                        <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                            Upload Nota Dinas <span style={{ color: "red" }}>*</span>
                          </label>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input
                              type="file"
                              id="uploadNotaDinas"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setNotaDinasFile(file);
                                  setNotaDinasFileName(file.name);
                                }
                              }}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx"
                            />
                            <label
                              htmlFor="uploadNotaDinas"
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "9px 10px",
                                borderRadius: 6,
                                border: `1px dashed ${notaDinasFileName ? "#16A34A" : COLORS.gray300}`,
                                background: notaDinasFileName ? "#DCFCE7" : COLORS.white,
                                cursor: "pointer",
                                fontSize: 12,
                                color: notaDinasFileName ? "#166534" : COLORS.gray600,
                                boxSizing: "border-box",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis"
                              }}
                              title={notaDinasFileName || "Pilih Berkas Nota Dinas (PDF)"}
                            >
                              <UploadCloud size={15} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
                                {notaDinasFileName || "Pilih / Upload Nota Dinas"}
                              </span>
                            </label>
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 4 }}>
                            Lampiran berkas Nota Dinas (.pdf / .docx)
                          </div>
                        </div>

                        {/* 3. NOMOR SP DIPA (FREE TEXT) */}
                        <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                            Nomor SP Dipa <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={noSPDipa}
                            onChange={(e) => setNoSPDipa(e.target.value)}
                            placeholder="Cth: SP-DIPA-023.01.2.690523/2026"
                            style={{
                              width: "100%",
                              padding: "9px 12px",
                              borderRadius: 6,
                              border: `1px solid ${COLORS.gray300}`,
                              fontSize: 12.5,
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: "#166534",
                              background: COLORS.white,
                              outline: "none",
                              boxSizing: "border-box"
                            }}
                            required
                          />
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 4 }}>
                            Nomor SP DIPA Kemenkeu RI (free text)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FIELD NOMINAL & DOKUMEN KHUSUS JKK & JKM */}
                  {(selectedProgram === "JKK" || selectedProgram === "JKM") && (
                    <>
                      <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                          Nominal Tagihan ({getProgramDisplayName()}) <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          value={nominal}
                          onChange={(e) => setNominal(e.target.value)}
                          placeholder="Masukkan nominal tagihan (Rp)..."
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 13.5,
                            fontWeight: 700,
                            fontFamily: "monospace",
                            color: "#1E40AF",
                            boxSizing: "border-box",
                            background: COLORS.white,
                            outline: "none"
                          }}
                          required
                        />
                        <div style={{ fontSize: 11, color: Number(nominal) > 0 ? COLORS.blue : COLORS.gray400, marginTop: 4 }}>
                          Terbilang: <strong>{Number(nominal) > 0 ? formatRupiah(Number(nominal)) : "Rp 0"}</strong>
                        </div>
                      </div>

                      <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                          Dokumen Rekapitulasi Iuran ({selectedProgram}) <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                            <input
                              type="file"
                              id="fileUploadJKK"
                              onChange={handleFileUpload}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx"
                            />
                            <label
                              htmlFor="fileUploadJKK"
                              title={dokumenName || `Pilih Berkas Rekap Iuran ${selectedProgram}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "9px 12px",
                                borderRadius: 6,
                                border: `1px dashed ${dokumenName ? COLORS.blue : COLORS.gray300}`,
                                background: dokumenName ? "#F0F7FF" : "#F8FAFC",
                                cursor: "pointer",
                                fontSize: 12,
                                color: dokumenName ? COLORS.blueDark : COLORS.gray600,
                                boxSizing: "border-box",
                                width: "100%",
                                minWidth: 0,
                                overflow: "hidden"
                              }}
                            >
                              <UploadCloud size={16} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                                {dokumenName || `Pilih / Upload Rekap Iuran ${selectedProgram} (PDF)`}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                          Berkas data nominatif pendukung tagihan
                        </div>
                      </div>
                    </>
                  )}

                  {/* FIELD: PERIHAL SURAT (FREETEXT) */}
                  <div style={{ gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Perihal Surat <span style={{ color: COLORS.gray400, fontWeight: 400 }}>(Freetext)</span>
                    </label>
                    <input
                      type="text"
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)}
                      placeholder={getDefaultPerihal()}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 13,
                        fontWeight: 500,
                        color: COLORS.gray900,
                        background: COLORS.white,
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                      Ketik perihal surat secara bebas. Jika dikosongkan, surat otomatis menggunakan: <em>"{getDefaultPerihal()}"</em>
                    </div>
                  </div>

                  {/* FIELD 3 & 4: HANYA DITAMPILKAN UNTUK THT / PENSIUN */}
                  {selectedProgram === "THT_PENSIUN" && (
                    <>
                      {/* FIELD 3: NOMINAL */}
                      <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                          Nominal Tagihan ({getProgramDisplayName()}) <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="number"
                          value={nominal}
                          onChange={(e) => setNominal(e.target.value)}
                          placeholder="Masukkan nominal tagihan (Rp)..."
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 13.5,
                            fontWeight: 700,
                            fontFamily: "monospace",
                            color: "#1E40AF",
                            boxSizing: "border-box",
                            background: COLORS.white,
                            outline: "none"
                          }}
                          required
                        />
                        <div style={{ fontSize: 11, color: Number(nominal) > 0 ? COLORS.blue : COLORS.gray400, marginTop: 4 }}>
                          Terbilang: <strong>{Number(nominal) > 0 ? formatRupiah(Number(nominal)) : "Rp 0 (Belum diisi)"}</strong>
                        </div>
                      </div>

                      {/* FIELD 4: DOKUMEN LAMPIRAN */}
                      <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                          Dokumen Lampiran / Dasar SKP-PFK <span style={{ color: "red" }}>*</span>
                        </label>

                        <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                            <input
                              type="file"
                              id="fileUpload"
                              onChange={handleFileUpload}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx"
                            />
                            <label
                              htmlFor="fileUpload"
                              title={dokumenName || "Pilih / Upload Dokumen SKP-PFK (PDF)"}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "9px 12px",
                                borderRadius: 6,
                                border: `1px dashed ${dokumenName ? COLORS.blue : COLORS.gray300}`,
                                background: dokumenName ? "#F0F7FF" : "#F8FAFC",
                                cursor: "pointer",
                                fontSize: 12,
                                color: dokumenName ? COLORS.blueDark : COLORS.gray600,
                                boxSizing: "border-box",
                                width: "100%",
                                minWidth: 0,
                                overflow: "hidden"
                              }}
                            >
                              <UploadCloud size={16} style={{ flexShrink: 0 }} />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                  minWidth: 0
                                }}
                              >
                                {dokumenName || "Pilih / Upload Berkas SKP-PFK (PDF)"}
                              </span>
                            </label>
                          </div>

                          {dokumenName && (
                            <Btn
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreview({
                                  title: `Preview Dokumen: ${dokumenName}`,
                                  subtitle: `Lampiran ${getProgramDisplayName()} • Periode Juli 2026`,
                                  type: "skp",
                                  fileName: dokumenName,
                                  content: {
                                    noSurat: noSurat,
                                    periode: "Juli 2026",
                                    nominal: formatRupiah(Number(nominal) || 0),
                                    fileName: dokumenName,
                                    batchInfo: `${getProgramDisplayName()} — Berkas Lampiran`
                                  }
                                });
                              }}
                              style={{ padding: "9px 14px", whiteSpace: "nowrap", flexShrink: 0 }}
                            >
                              <ExternalLink size={13} style={{ marginRight: 4 }} />
                              Lihat
                            </Btn>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* FIELD NAMA PEJABAT & JABATAN SEJAJAR */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                >
                  {/* FIELD: NAMA PEJABAT */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Nama Pejabat <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={namaPejabat}
                      onChange={(e) => setNamaPejabat(e.target.value)}
                      placeholder="Contoh: Helmi I Satriyo"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.gray800,
                        background: COLORS.white,
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                      Nama pejabat penandatangan tagihan
                    </div>
                  </div>

                  {/* FIELD: JABATAN */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Jabatan <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Contoh: Direktur Keuangan dan Manajemen Resiko"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.gray800,
                        background: COLORS.white,
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                      Jabatan pejabat penandatangan
                    </div>
                  </div>
                </div>

                {/* Tombol Generate Tagihan */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 14 }}>
                  <Btn
                    type="submit"
                    disabled={isGenerating}
                    style={{
                      background: COLORS.blue,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <Eye size={15} />
                    Preview & Terbitkan Tagihan {getProgramDisplayName()}
                  </Btn>
                </div>
              </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MONITORING PENERIMAAN DANA
         ========================================================================= */}
      {activeTab === "monitoring" && (
        <div>
          {/* 1. Program Switcher (THT & Pensiun | JKK | JKM) */}
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
            {/* Program 1: THT & Pensiun */}
            <button
              onClick={() => {
                setMonitoringProgram("THT_PENSIUN");
                setMonSearchTerm("");
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
                background: monitoringProgram === "THT_PENSIUN" ? COLORS.white : "transparent",
                color: monitoringProgram === "THT_PENSIUN" ? COLORS.blue : COLORS.gray600,
                boxShadow: monitoringProgram === "THT_PENSIUN" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <Building2 size={16} color={monitoringProgram === "THT_PENSIUN" ? COLORS.blue : COLORS.gray500} />
              <span>THT & Pensiun (SKP-PFK 8,00%)</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: monitoringProgram === "THT_PENSIUN" ? "#DBEAFE" : "#E2E8F0",
                  color: monitoringProgram === "THT_PENSIUN" ? "#1E40AF" : COLORS.gray600,
                  fontWeight: 700
                }}
              >
                Tagihan Tunggal
              </span>
            </button>

            {/* Program 2: JKK */}
            <button
              onClick={() => {
                setMonitoringProgram("JKK");
                setMonSearchTerm("");
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
                background: monitoringProgram === "JKK" ? COLORS.white : "transparent",
                color: monitoringProgram === "JKK" ? "#047857" : COLORS.gray600,
                boxShadow: monitoringProgram === "JKK" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <Shield size={16} color={monitoringProgram === "JKK" ? "#047857" : COLORS.gray500} />
              <span>Jaminan Kecelakaan Kerja (JKK 0,62%)</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: monitoringProgram === "JKK" ? "#D1FAE5" : "#E2E8F0",
                  color: monitoringProgram === "JKK" ? "#065F46" : COLORS.gray600,
                  fontWeight: 700
                }}
              >
                {monitoringJKKList.length} Monitoring
              </span>
            </button>

            {/* Program 3: JKM */}
            <button
              onClick={() => {
                setMonitoringProgram("JKM");
                setMonSearchTerm("");
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
                background: monitoringProgram === "JKM" ? COLORS.white : "transparent",
                color: monitoringProgram === "JKM" ? "#0D9488" : COLORS.gray600,
                boxShadow: monitoringProgram === "JKM" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <Shield size={16} color={monitoringProgram === "JKM" ? "#0D9488" : COLORS.gray500} />
              <span>Jaminan Kematian (JKM 0,81%)</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: monitoringProgram === "JKM" ? "#CCFBF1" : "#E2E8F0",
                  color: monitoringProgram === "JKM" ? "#0F766E" : COLORS.gray600,
                  fontWeight: 700
                }}
              >
                {monitoringJKMList.length} Monitoring
              </span>
            </button>
          </div>

          {/* 2. Toolbar Filter & Tombol Input */}
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
                  value={monTglAwal}
                  onChange={(e) => setMonTglAwal(e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                />
                <span style={{ fontSize: 12, color: COLORS.gray500 }}>s.d.</span>
                <input
                  type="date"
                  value={monTglAkhir}
                  onChange={(e) => setMonTglAkhir(e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12 }}
                />
              </div>

              {monitoringProgram === "THT_PENSIUN" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Filter Dana:</span>
                  <select
                    value={monFilterDanaPFK}
                    onChange={(e) => setMonFilterDanaPFK(e.target.value)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12,
                      background: COLORS.white,
                      fontWeight: 700,
                      color: COLORS.gray800
                    }}
                  >
                    <option value="Semua">Semua Surat Dana PFK (4 Surat)</option>
                    <option value="THT_TNI">THT TNI (Prajurit TNI & Kemhan)</option>
                    <option value="THT_POLRI">THT POLRI (Anggota & PNS Polri)</option>
                    <option value="PENSIUN_TNI">Pensiun TNI (Prajurit TNI & Kemhan)</option>
                    <option value="PENSIUN_POLRI">Pensiun POLRI (Anggota & PNS Polri)</option>
                  </select>
                </div>
              )}

              {monitoringProgram === "JKK" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Filter Dana:</span>
                  <select
                    value={monFilterDanaJKK}
                    onChange={(e) => setMonFilterDanaJKK(e.target.value)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12,
                      background: COLORS.white,
                      fontWeight: 700,
                      color: COLORS.gray800
                    }}
                  >
                    <option value="Semua">Semua Dana JKK (JKK Polri & JKK TNI)</option>
                    <option value="JKK_POLRI">JKK POLRI</option>
                    <option value="JKK_TNI">JKK TNI</option>
                  </select>
                </div>
              )}

              {monitoringProgram === "JKM" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Filter Dana:</span>
                  <select
                    value={monFilterDanaJKM}
                    onChange={(e) => setMonFilterDanaJKM(e.target.value)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12,
                      background: COLORS.white,
                      fontWeight: 700,
                      color: COLORS.gray800
                    }}
                  >
                    <option value="Semua">Semua Dana JKM (JKM Polri & JKM TNI)</option>
                    <option value="JKM_POLRI">JKM POLRI</option>
                    <option value="JKM_TNI">JKM TNI</option>
                  </select>
                </div>
              )}

              <div style={{ position: "relative", width: 240 }}>
                <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 9 }} />
                <input
                  type="text"
                  placeholder={monitoringProgram === "THT_PENSIUN" ? "Cari surat / SKP-PFK..." : "Cari surat / SP2D..."}
                  value={monSearchTerm}
                  onChange={(e) => setMonSearchTerm(e.target.value)}
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
          </div>

          {/* 3. Tabel Monitoring */}
          {monitoringProgram === "THT_PENSIUN" ? (
            /* TABEL THT & PENSIUN */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 135 }}>Tanggal Tagihan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jenis Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Dasar SKP-PFK Kemenkeu</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tagihan (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Tagihan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonitoringSKP.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: 30, textAlign: "center", color: COLORS.gray500 }}>
                          Tidak ada data penerimaan SKP-PFK dalam monitoring aktif.
                        </td>
                      </tr>
                    ) : (
                      filteredMonitoringSKP.map((item) => {
                        const isTHT = item.danaType?.startsWith("THT");
                        const badgeColor =
                          item.danaType === "THT_TNI" ? { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" } :
                          item.danaType === "THT_POLRI" ? { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" } :
                          item.danaType === "PENSIUN_TNI" ? { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" } :
                          { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" };
                        const stBadge = getStatusTagihanBadge(item);

                        return (
                          <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                            <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Calendar size={13} color="#2563EB" />
                                <span style={{ fontWeight: 700, fontSize: 12.5, color: COLORS.gray900 }}>
                                  {item.tglSuratTagihan || "15 Sep 2026"}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.gray900 }}>
                                {item.namaDana || "Dana PFK"}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12.5, color: COLORS.gray900 }}>
                                {item.noSuratTagihan}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                                {item.matraUtama}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
                                {item.noSKP}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: badgeColor.text }}>
                                {fmtB(item.nominalDanaSKP)}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "center" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  padding: "3px 8px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: stBadge.bg,
                                  color: stBadge.text,
                                  border: `1px solid ${stBadge.border}`
                                }}
                              >
                                {renderStatusIcon(stBadge.label)}
                                {stBadge.label}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "center" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                style={{
                                  padding: "5px 14px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  borderColor: COLORS.gray300,
                                  color: COLORS.blue,
                                  background: "#FFFFFF"
                                }}
                                onClick={() => handleOpenDetailModal(item)}
                              >
                                <Eye size={13} />
                                Detail
                              </Btn>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", textAlign: "right" }}>
                        Total Realisasi Dana SKP-PFK ({filteredMonitoringSKP.length} Surat Tagihan):
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.blue, fontSize: 13 }}>
                        {fmtB(filteredMonitoringSKP.reduce((acc, it) => acc + (it.nominalDanaSKP || 0), 0))}
                      </td>
                      <td colSpan={2} style={{ padding: "12px 14px", textAlign: "center", color: COLORS.gray400 }}>
                        —
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            /* TABEL JKK ATAU JKM */
            <div style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 135 }}>Tanggal Tagihan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jenis Dana</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Tagihan Resmi</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Realisasi (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Tagihan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(monitoringProgram === "JKK" ? filteredMonitoringJKK : filteredMonitoringJKM).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: 30, textAlign: "center", color: COLORS.gray500 }}>
                          Tidak ada data penerimaan tagihan {monitoringProgram} dalam monitoring aktif.
                        </td>
                      </tr>
                    ) : (
                      (monitoringProgram === "JKK" ? filteredMonitoringJKK : filteredMonitoringJKM).map((item) => {
                        const stBadge = getStatusTagihanBadge(item);
                        return (
                          <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                            <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Calendar size={13} color="#059669" />
                                <span style={{ fontWeight: 700, fontSize: 12.5, color: COLORS.gray900 }}>
                                  {item.tglSuratTagihan || "24 Jul 2026"}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.gray900 }}>
                                {item.namaDana || item.program}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900 }}>
                                {item.noSuratTagihan}
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                                {item.matraUtama}
                              </div>
                              {item.noNotaDinas && (
                                <div style={{ fontSize: 10.5, color: "#166534", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                                  <span>ND: <strong>{item.noNotaDinas}</strong></span>
                                  {item.namaNotaDinas && <span title={item.namaNotaDinas}>📎</span>}
                                </div>
                              )}
                              {item.noSPDipa && (
                                <div style={{ fontSize: 10.5, color: "#1E40AF", marginTop: 1 }}>
                                  SP DIPA: <strong>{item.noSPDipa}</strong>
                                </div>
                              )}
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: monitoringTheme.primary }}>
                                {fmtB(item.nominalDiterima)}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "center" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  padding: "3px 8px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: stBadge.bg,
                                  color: stBadge.text,
                                  border: `1px solid ${stBadge.border}`
                                }}
                              >
                                {renderStatusIcon(stBadge.label)}
                                {stBadge.label}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "center" }}>
                              <Btn
                                size="xs"
                                variant="outline"
                                style={{
                                  padding: "5px 14px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  borderColor: COLORS.gray300,
                                  color: COLORS.blue,
                                  background: "#FFFFFF"
                                }}
                                onClick={() => handleOpenDetailModal(item)}
                              >
                                <Eye size={13} />
                                Detail
                              </Btn>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td colSpan={2} style={{ padding: "12px 14px", textAlign: "right" }}>
                        Total Realisasi Iuran {monitoringProgram}:
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: monitoringTheme.primary, fontSize: 13 }}>
                        {fmtB((monitoringProgram === "JKK" ? filteredMonitoringJKK : filteredMonitoringJKM).reduce((acc, it) => acc + (it.nominalDiterima || 0), 0))}
                      </td>
                      <td colSpan={2} style={{ padding: "12px 14px", textAlign: "center", color: COLORS.gray400 }}>
                        —
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
          TAB 3: RIWAYAT PENAGIHAN
         ========================================================================= */}
      {activeTab === "history" && (
        <div
          style={{
            background: COLORS.white,
            borderRadius: 10,
            border: `1px solid ${COLORS.gray200}`,
            overflow: "hidden"
          }}
        >
          {/* Header Tabel & Filter Program */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.gray900 }}>
                Daftar & Riwayat Surat Tagihan Per-Dana
              </div>
              <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                Setiap Dana dipisahkan dalam surat tersendiri dengan penomoran resmi <code>KU.06.06/KMR.N</code> untuk monitoring terpisah.
              </div>
            </div>

            {/* Filter Dropdown Program */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>Filter Dana:</label>
              <select
                value={filterTable}
                onChange={(e) => setFilterTable(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.gray800,
                  background: COLORS.white,
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="Semua">Semua Program & Dana</option>
                <option value="DANA_PFK">Semua Dana PFK (THT & Pensiun)</option>
                <option value="THT TNI">THT TNI (3,25%)</option>
                <option value="THT POLRI">THT POLRI (3,25%)</option>
                <option value="Pensiun TNI">Pensiun TNI (4,75%)</option>
                <option value="Pensiun POLRI">Pensiun POLRI (4,75%)</option>
                <option value="JKK TNI">JKK TNI (0,62%)</option>
                <option value="JKK POLRI">JKK POLRI (0,62%)</option>
                <option value="JKM TNI">JKM TNI (0,81%)</option>
                <option value="JKM POLRI">JKM POLRI (0,81%)</option>
              </select>
            </div>
          </div>

          {/* Tabel Riwayat Data (Hanya menampilkan data setelah proses monitoring selesai) */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: COLORS.gray600, textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, width: 135 }}>Tanggal Terbit</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>No. Surat Resmi</th>
                  <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Perihal Surat</th>
                  <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jenis Dana / Porsi</th>
                  <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra Peserta</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tagihan</th>
                  <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status Monitoring</th>
                </tr>
              </thead>
              <tbody>
                {displayedTagihan.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F1F5F9", display: "inline-flex", alignItems: "center", justifyContent: "center", color: COLORS.gray400, marginBottom: 10 }}>
                        <Clock size={22} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray800 }}>
                        Belum Ada Data di Riwayat Penagihan
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.gray500, maxWidth: 520, margin: "6px auto 0", lineHeight: 1.5 }}>
                        Data surat tagihan akan otomatis muncul di Riwayat setelah proses monitoring penerimaan dana dinyatakan <strong>Selesai</strong> pada tab <em>Monitoring Penerimaan Dana</em>.
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedTagihan.map((t) => {
                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Calendar size={13} color="#4B5563" />
                            <span style={{ fontWeight: 800, fontSize: 12.5, color: COLORS.gray900 }}>
                              {t.tglGenerate || t.tglSurat || "15 Sep 2026"}
                            </span>
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                            Periode: {t.periode || "Sep 2026"}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontWeight: 800, color: COLORS.blueDark, fontFamily: "monospace", fontSize: 12.5 }}>
                            {t.noSurat}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                            Periode {t.periode} • Terbit: {t.tglGenerate}
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray600, fontFamily: "monospace", marginTop: 2 }}>
                            📄 {t.dokumen}
                          </div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                            ✍️ {t.namaPejabat || t.namaDirektur || "Helmi I Satriyo"} ({t.jabatan || t.jabatanDirektur || "Direktur Keuangan dan Manajemen Resiko"})
                          </div>
                        </td>

                        <td style={{ padding: "12px 12px", maxWidth: 260 }}>
                          <div style={{ fontWeight: 600, color: COLORS.gray800, fontSize: 12, lineHeight: 1.4 }}>
                            {t.perihal}
                          </div>
                        </td>

                        <td style={{ padding: "12px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                background: t.program.includes("THT") ? "#DBEAFE" : (t.program.includes("Pensiun") ? "#DCFCE7" : "#FEF3C7"),
                                color: t.program.includes("THT") ? "#1E40AF" : (t.program.includes("Pensiun") ? "#166534" : "#92400E")
                              }}
                            >
                              {t.program}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 3 }}>
                            {t.danaPorsi || t.acuan}
                          </div>
                        </td>

                        <td style={{ padding: "12px 12px" }}>
                          <div style={{ fontWeight: 600, color: COLORS.gray800 }}>{t.matra}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>{t.peserta} Jiwa</div>
                        </td>

                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, fontFamily: "monospace", color: COLORS.blueDark, fontSize: 13 }}>
                          {t.nominal}
                        </td>

                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "4px 9px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background: "#EEF2FF",
                              color: "#4338CA",
                              border: "1px solid #C7D2FE"
                            }}
                          >
                            <CheckCircle2 size={12} />
                            Monitoring Selesai
                          </span>
                          {t.tglSelesai && t.tglSelesai !== "-" && (
                            <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 3 }}>
                              {t.tglSelesai}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {displayedTagihan.length > 0 && (
                <tfoot>
                  <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                    <td colSpan={4} style={{ padding: "12px 14px", textAlign: "right" }}>
                      Total Realisasi Tagihan Selesai ({displayedTagihan.length} Surat):
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.blueDark, fontSize: 13 }}>
                      {fmtB(displayedTagihan.reduce((acc, it) => acc + (it.nominalNum || 0), 0))}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: COLORS.gray400 }}>
                      —
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Informasi Surat Tagihan ke Kemenkeu RI */}
      {selectedDetailMonitoring && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(2px)"
          }}
          onClick={() => setSelectedDetailMonitoring(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 780,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden"
            }}
          >
            {/* Header Modal */}
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
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: COLORS.blueLight,
                    color: COLORS.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                    Detail Informasi Surat Tagihan ke Kemenkeu RI
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.gray800 }}>
                      {selectedDetailMonitoring.noSuratTagihan || selectedDetailMonitoring.noSurat}
                    </span>
                    <span>•</span>
                    <span>{selectedDetailMonitoring.namaDana || selectedDetailMonitoring.program}</span>
                    <span>•</span>
                    <span>Periode {selectedDetailMonitoring.tglSuratTagihan || "-"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailMonitoring(null)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: COLORS.gray400,
                  padding: 4,
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Body Modal */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Banner Status Surat Tagihan */}
              {(() => {
                const modalStatus = getItemCalculatedStatus(selectedDetailMonitoring);
                if (modalStatus === "Dana Diterima") {
                  return (
                    <div
                      style={{
                        background: "#ECFDF5",
                        border: "1px solid #A7F3D0",
                        borderRadius: 8,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle2 size={20} color="#059669" />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>
                            Dana Iuran Telah Diterima (Pencairan Kas Selesai)
                          </div>
                          <div style={{ fontSize: 11, color: "#047857", marginTop: 2 }}>
                            Dana telah masuk ke Rekening Giro Penampungan • Monitoring penagihan selesai &amp; tersimpan di Riwayat Penagihan.
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#047857",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          padding: "4px 10px",
                          borderRadius: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <CheckCircle2 size={12} color="#059669" />
                        Dana Diterima
                      </span>
                    </div>
                  );
                }
                if (modalStatus === "Dana Belum Diterima") {
                  return (
                    <div
                      style={{
                        background: "#EFF6FF",
                        border: "1px solid #BFDBFE",
                        borderRadius: 8,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Clock size={19} color="#2563EB" />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>
                            Surat Tagihan Telah Diterima Kemenkeu RI (Menunggu Realisasi Pencairan)
                          </div>
                          <div style={{ fontSize: 11, color: "#1D4ED8", marginTop: 2 }}>
                            Surat telah diterima Ditjen Perbendaharaan Kemenkeu RI pada {selectedDetailMonitoring.tglSuratDiterima} • Menunggu proses pencairan SP2D / realisasi kas masuk.
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#1D4ED8",
                          background: "#EFF6FF",
                          border: "1px solid #BFDBFE",
                          padding: "4px 10px",
                          borderRadius: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <Clock size={12} color="#2563EB" />
                        Dana Belum Diterima
                      </span>
                    </div>
                  );
                }
                // modalStatus === "Surat Belum Diterima"
                return (
                  <div
                    style={{
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      borderRadius: 8,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Clock size={19} color="#D97706" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#B45309" }}>
                          Surat Tagihan Terbit (Menunggu Konfirmasi Tanggal Surat Diterima)
                        </div>
                        <div style={{ fontSize: 11, color: "#92400E", marginTop: 2 }}>
                          Surat tagihan resmi telah diterbitkan • Silakan update status untuk mencatat tanggal surat diterima oleh Kemenkeu RI.
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#B45309",
                        background: "#FFFBEB",
                        border: "1px solid #FDE68A",
                        padding: "4px 10px",
                        borderRadius: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      <Clock size={12} color="#D97706" />
                      Surat Belum Diterima
                    </span>
                  </div>
                );
              })()}

              {/* Tabel Data Informasi Surat Tagihan */}
              <div
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.gray200}`,
                  borderRadius: 10,
                  padding: "16px 18px"
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={15} color={COLORS.blue} />
                  Informasi Dokumen &amp; Tagihan
                </div>

                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500, width: "35%" }}>Nomor Surat Resmi</td>
                      <td style={{ padding: "8px 0", fontWeight: 700, color: COLORS.gray900, fontFamily: "monospace", fontSize: 12.5 }}>
                        {selectedDetailMonitoring.noSuratTagihan || selectedDetailMonitoring.noSurat}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Tanggal Surat Tagihan</td>
                      <td style={{ padding: "8px 0", fontWeight: 600, color: COLORS.gray800 }}>
                        {selectedDetailMonitoring.tglSuratTagihan || "-"}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Tanggal Surat Diterima Kemenkeu</td>
                      <td style={{ padding: "8px 0" }}>
                        {selectedDetailMonitoring.tglSuratDiterima ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 700, color: "#065F46", fontSize: 12.5, display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <CheckCircle2 size={13} color="#059669" />
                              {selectedDetailMonitoring.tglSuratDiterima}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenUpdateStatus(selectedDetailMonitoring);
                                setUpdateStatusModal((prev) => ({ ...prev, step: 1 }));
                              }}
                              style={{
                                fontSize: 11,
                                padding: "2px 8px",
                                borderRadius: 4,
                                border: "1px solid #CBD5E1",
                                background: "#F8FAFC",
                                color: COLORS.blue,
                                cursor: "pointer",
                                fontWeight: 600
                              }}
                            >
                              Ubah Tanggal
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 5,
                              background: "#FFFBEB",
                              color: "#B45309",
                              border: "1px solid #FDE68A"
                            }}>
                              <Clock size={12} color="#D97706" />
                              Surat Belum Diterima
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenUpdateStatus(selectedDetailMonitoring)}
                              style={{
                                padding: "3px 10px",
                                fontSize: 11,
                                fontWeight: 700,
                                background: "#FEF3C7",
                                color: "#92400E",
                                border: "1px solid #FCD34D",
                                borderRadius: 5,
                                cursor: "pointer"
                              }}
                            >
                              + Set Tanggal Diterima
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Perihal Surat</td>
                      <td style={{ padding: "8px 0", fontWeight: 600, color: COLORS.gray800 }}>
                        {selectedDetailMonitoring.perihal || `Permohonan Penyaluran Dana Iuran ${selectedDetailMonitoring.namaDana || selectedDetailMonitoring.program || "PFK"} Bulan ${selectedDetailMonitoring.tglSuratTagihan || "September 2026"}`}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Program / Jenis Dana</td>
                      <td style={{ padding: "8px 0", fontWeight: 700, color: COLORS.blueDark }}>
                        {selectedDetailMonitoring.namaDana || selectedDetailMonitoring.program} ({selectedDetailMonitoring.tarif || selectedDetailMonitoring.kodeTarif || "-"})
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Matra Peserta</td>
                      <td style={{ padding: "8px 0", color: COLORS.gray800 }}>
                        {selectedDetailMonitoring.matraUtama || (selectedDetailMonitoring.danaType?.includes("POLRI") ? "POLRI & PNS Polri" : "Prajurit TNI & ASN Kemhan")}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Jumlah Peserta</td>
                      <td style={{ padding: "8px 0", fontWeight: 600, color: COLORS.gray800 }}>
                        <strong>{fmtNum(selectedDetailMonitoring.peserta)}</strong> Jiwa
                      </td>
                    </tr>
                    {selectedDetailMonitoring.noSKP && (
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Dasar SKP-PFK Kemenkeu</td>
                        <td style={{ padding: "8px 0", fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
                          {selectedDetailMonitoring.noSKP} {selectedDetailMonitoring.tglSKP ? `(Tgl: ${selectedDetailMonitoring.tglSKP})` : ""}
                        </td>
                      </tr>
                    )}
                    {selectedDetailMonitoring.noNotaDinas && (
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Nomor Nota Dinas Kepesertaan</td>
                        <td style={{ padding: "8px 0", fontFamily: "monospace", fontWeight: 700, color: "#166534" }}>
                          {selectedDetailMonitoring.noNotaDinas}
                          {selectedDetailMonitoring.namaNotaDinas && (
                            <span style={{ marginLeft: 8, fontSize: 11, padding: "2px 8px", background: "#DCFCE7", color: "#15803D", borderRadius: 4, fontWeight: 600 }}>
                              📎 {selectedDetailMonitoring.namaNotaDinas}
                            </span>
                          )}
                        </td>
                      </tr>
                    )}
                    {selectedDetailMonitoring.noSPDipa && (
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Nomor SP DIPA</td>
                        <td style={{ padding: "8px 0", fontFamily: "monospace", fontWeight: 700, color: "#166534" }}>
                          {selectedDetailMonitoring.noSPDipa}
                        </td>
                      </tr>
                    )}
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Nominal Tagihan</td>
                      <td style={{ padding: "8px 0", fontWeight: 800, color: "#1E3A8A", fontSize: 13.5, fontFamily: "monospace" }}>
                        {fmtB(selectedDetailMonitoring.nominalDanaSKP || selectedDetailMonitoring.nominalTagihan || selectedDetailMonitoring.nominalDiterima || selectedDetailMonitoring.nominalNum)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Pejabat Penandatangan</td>
                      <td style={{ padding: "8px 0", fontWeight: 700, color: COLORS.gray900 }}>
                        {selectedDetailMonitoring.namaPejabat || namaPejabat || "Helmi I Satriyo"}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Jabatan Penandatangan</td>
                      <td style={{ padding: "8px 0", color: COLORS.gray700 }}>
                        {selectedDetailMonitoring.jabatan || jabatan || "Direktur Keuangan dan Manajemen Resiko"}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Rekening Penampung Tujuan</td>
                      <td style={{ padding: "8px 0", color: COLORS.gray800 }}>
                        {selectedDetailMonitoring.bankTujuan || "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu"}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 0", color: COLORS.gray500 }}>Dokumen Lampiran</td>
                      <td style={{ padding: "8px 0", fontFamily: "monospace", color: COLORS.gray700, fontSize: 11.5 }}>
                        📄 {selectedDetailMonitoring.dokumen || "SKP-PFK_Kemenkeu_Juli2026_Termin1.pdf"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC",
                gap: 12,
                flexWrap: "wrap"
              }}
            >
              <Btn
                size="sm"
                variant="outline"
                onClick={() => openSuratTagihanPreview(selectedDetailMonitoring)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}
              >
                <FileText size={14} />
                Preview Dokumen Surat Tagihan
              </Btn>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {selectedDetailMonitoring.statusProses === "Selesai" || getItemCalculatedStatus(selectedDetailMonitoring) === "Dana Diterima" ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 6,
                      background: "#ECFDF5",
                      color: "#047857",
                      border: "1px solid #A7F3D0",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    <CheckCircle2 size={15} color="#059669" />
                    Dana Diterima • Monitoring Selesai
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenUpdateStatus(selectedDetailMonitoring)}
                    style={{
                      background: !selectedDetailMonitoring.tglSuratDiterima ? "#FEF3C7" : "#2563EB",
                      borderColor: !selectedDetailMonitoring.tglSuratDiterima ? "#FCD34D" : "#1D4ED8",
                      color: !selectedDetailMonitoring.tglSuratDiterima ? "#92400E" : "#FFFFFF",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 18px",
                      borderRadius: 6,
                      fontSize: 12.5,
                      cursor: "pointer",
                      border: "1px solid",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                    }}
                  >
                    <Edit3 size={14} />
                    Update Status
                  </button>
                )}

                <Btn
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedDetailMonitoring(null)}
                  style={{ fontWeight: 600 }}
                >
                  Tutup
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL UPDATE STATUS TAGIHAN & REALISASI PENERIMAAN DANA
         ========================================================================= */}
      {updateStatusModal.open && updateStatusModal.item && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(3px)"
          }}
          onClick={() => setUpdateStatusModal({ open: false, item: null, step: 1, tglSuratDiterima: "", tglTerimaDana: "", nominalDiterima: "", noSP2D: "", bankTujuan: "", catatan: "", error: "" })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: updateStatusModal.step === 1 ? "#FFFBEB" : "#F0FDF4"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: updateStatusModal.step === 1 ? "#FEF3C7" : "#DCFCE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: updateStatusModal.step === 1 ? "#D97706" : "#16A34A"
                  }}
                >
                  {updateStatusModal.step === 1 ? <Calendar size={22} /> : <DollarSign size={22} />}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                    {updateStatusModal.step === 1
                      ? "Update Status — Tanggal Surat Diterima"
                      : "Update Status — Realisasi Penerimaan Dana"}
                  </div>
                  <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 1 }}>
                    {updateStatusModal.step === 1
                      ? "Pencatatan tanggal resmi surat diterima Kemenkeu RI"
                      : "Pencatatan tanggal realisasi dana masuk kas beserta nominalnya"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUpdateStatusModal({ open: false, item: null, step: 1, tglSuratDiterima: "", tglTerimaDana: "", nominalDiterima: "", noSP2D: "", bankTujuan: "", catatan: "", error: "" })}
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

            {/* Error Message */}
            {updateStatusModal.error && (
              <div
                style={{
                  margin: "14px 20px 0 20px",
                  padding: "10px 14px",
                  background: "#FEF2F2",
                  border: "1px solid #F87171",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#B91C1C",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                <span>{updateStatusModal.error}</span>
              </div>
            )}

            {/* Body */}
            {updateStatusModal.step === 1 ? (
              /* STEP 1: HANYA FIELD UNTUK MENGISI TANGGAL SURAT DITERIMA */
              <form onSubmit={(e) => handleSaveStep1TglSuratDiterima(e, false)}>
                <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Info Surat */}
                  <div
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      borderRadius: 8,
                      padding: "12px 14px"
                    }}
                  >
                    <div style={{ fontSize: 11, color: COLORS.blue, fontWeight: 700, textTransform: "uppercase" }}>
                      Surat Tagihan Terkait
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1E40AF", fontFamily: "monospace", marginTop: 2 }}>
                      {updateStatusModal.item.noSuratTagihan || updateStatusModal.item.noSurat}
                    </div>
                    <div style={{ fontSize: 11.5, color: COLORS.gray700, marginTop: 3 }}>
                      Program: <strong>{updateStatusModal.item.namaDana || updateStatusModal.item.program}</strong> • Terbit: {updateStatusModal.item.tglSuratTagihan || "-"}
                    </div>
                  </div>

                  {/* Input Tanggal Surat Diterima */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                      Tanggal Surat Diterima Kemenkeu RI <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="date"
                        required
                        value={updateStatusModal.tglSuratDiterima}
                        onClick={(e) => {
                          try {
                            if (e.target.showPicker) e.target.showPicker();
                          } catch (err) {}
                        }}
                        onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, tglSuratDiterima: e.target.value, error: "" })}
                        style={{
                          width: "100%",
                          padding: "9px 12px 9px 38px",
                          borderRadius: 6,
                          border: "1.5px solid #2563EB",
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLORS.gray900,
                          outline: "none",
                          boxSizing: "border-box",
                          cursor: "pointer",
                          background: COLORS.white
                        }}
                      />
                      <Calendar size={16} color="#2563EB" style={{ position: "absolute", left: 11, top: 11, pointerEvents: "none" }} />
                    </div>
                    {updateStatusModal.tglSuratDiterima && (
                      <div style={{ fontSize: 11, color: "#1D4ED8", marginTop: 4 }}>
                        📅 Format: <strong>{formatTglIndo(updateStatusModal.tglSuratDiterima)}</strong>
                      </div>
                    )}
                  </div>

                  {/* Input Catatan / Tanda Terima Kemenkeu */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                      Catatan / No. Agenda Tanda Terima Kemenkeu <span style={{ color: COLORS.gray400, fontWeight: 400 }}>(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Agenda No. 41829/DJPb/2026 atau Resi Pos POS-99120"
                      value={updateStatusModal.catatan}
                      onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, catatan: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Footer Step 1 */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderTop: `1px solid ${COLORS.gray200}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#F8FAFC",
                    gap: 10
                  }}
                >
                  <Btn
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setUpdateStatusModal({ open: false, item: null, step: 1, tglSuratDiterima: "", tglTerimaDana: "", nominalDiterima: "", noSP2D: "", bankTujuan: "", catatan: "", error: "" })}
                  >
                    Batal
                  </Btn>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn
                      type="submit"
                      variant="primary"
                      size="sm"
                      style={{
                        background: "#2563EB",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <Check size={14} />
                      Simpan Tanggal Diterima
                    </Btn>
                    <button
                      type="button"
                      onClick={(e) => handleSaveStep1TglSuratDiterima(e, true)}
                      style={{
                        background: "#059669",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 14px",
                        borderRadius: 6,
                        border: "1px solid #059669",
                        fontSize: 12,
                        cursor: "pointer"
                      }}
                    >
                      Simpan &amp; Lanjut Input Nominal →
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* STEP 2: ISINYA TANGGAL DITERIMA BESERTA NOMINALNYA */
              <form onSubmit={handleSaveStep2PenerimaanDana}>
                <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Card Info: Tanggal Surat Diterima yang sudah diset */}
                  <div
                    style={{
                      background: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      borderRadius: 8,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: "#065F46", fontWeight: 700, textTransform: "uppercase" }}>
                        Tanggal Surat Diterima Kemenkeu RI
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#047857", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={15} color="#059669" />
                        <span>{formatTglIndo(updateStatusModal.tglSuratDiterima)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUpdateStatusModal((prev) => ({ ...prev, step: 1 }))}
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 5,
                        border: "1px solid #6EE7B7",
                        background: COLORS.white,
                        color: "#047857",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      ✏️ Ubah Tanggal
                    </button>
                  </div>

                  {/* Field: Tanggal Realisasi Penerimaan Dana (SP2D Masuk Kas) */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                      Tanggal Penerimaan Dana Masuk Kas (SP2D Cair) <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="date"
                        required
                        min={updateStatusModal.tglSuratDiterima || undefined}
                        value={updateStatusModal.tglTerimaDana}
                        onClick={(e) => {
                          try {
                            if (e.target.showPicker) e.target.showPicker();
                          } catch (err) {}
                        }}
                        onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, tglTerimaDana: e.target.value, error: "" })}
                        style={{
                          width: "100%",
                          padding: "9px 12px 9px 38px",
                          borderRadius: 6,
                          border: "1.5px solid #10B981",
                          fontSize: 13,
                          fontWeight: 700,
                          color: COLORS.gray900,
                          outline: "none",
                          boxSizing: "border-box",
                          cursor: "pointer",
                          background: COLORS.white
                        }}
                      />
                      <Calendar size={16} color="#059669" style={{ position: "absolute", left: 11, top: 11, pointerEvents: "none" }} />
                    </div>
                    {updateStatusModal.tglTerimaDana && (
                      <div style={{ fontSize: 11, color: "#065F46", marginTop: 4 }}>
                        📅 Tanggal Kas: <strong>{formatTglIndo(updateStatusModal.tglTerimaDana)}</strong>
                      </div>
                    )}
                  </div>

                  {/* Field: Nominal Dana Masuk (Rp) */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                      Nominal Realisasi Penerimaan Dana (Rp) <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 28540000000"
                      value={updateStatusModal.nominalDiterima}
                      onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, nominalDiterima: e.target.value, error: "" })}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: `1.5px solid ${COLORS.gray300}`,
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "monospace",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    {updateStatusModal.nominalDiterima && Number(updateStatusModal.nominalDiterima) > 0 && (
                      <div style={{ fontSize: 11.5, color: "#059669", fontWeight: 700, marginTop: 4 }}>
                        Nominal: {fmtB(updateStatusModal.nominalDiterima)}
                      </div>
                    )}
                  </div>

                  {/* Field: SP2D (Jika JKK/JKM) & Bank Penampungan */}
                  {(() => {
                    const item = updateStatusModal.item;
                    const isJKKorJKM = item?.program === "JKK" || item?.program === "JKM" || item?.danaType?.startsWith("JKK") || item?.danaType?.startsWith("JKM");
                    if (isJKKorJKM) {
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                              Nomor SP2D Kemenkeu
                            </label>
                            <input
                              type="text"
                              placeholder="SP2D-260728-004128"
                              value={updateStatusModal.noSP2D}
                              onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, noSP2D: e.target.value })}
                              style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: 6,
                                border: `1px solid ${COLORS.gray300}`,
                                fontSize: 12,
                                outline: "none",
                                boxSizing: "border-box"
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                              Bank Penampungan
                            </label>
                            <input
                              type="text"
                              value={updateStatusModal.bankTujuan}
                              onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, bankTujuan: e.target.value })}
                              style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: 6,
                                border: `1px solid ${COLORS.gray300}`,
                                fontSize: 11.5,
                                outline: "none",
                                boxSizing: "border-box"
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                          Bank Penampungan
                        </label>
                        <input
                          type="text"
                          value={updateStatusModal.bankTujuan}
                          onChange={(e) => setUpdateStatusModal({ ...updateStatusModal, bankTujuan: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 11.5,
                            outline: "none",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    );
                  })()}
                </div>

                {/* Footer Step 2 */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderTop: `1px solid ${COLORS.gray200}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#F8FAFC",
                    gap: 10
                  }}
                >
                  <Btn
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setUpdateStatusModal({ open: false, item: null, step: 1, tglSuratDiterima: "", tglTerimaDana: "", nominalDiterima: "", noSP2D: "", bankTujuan: "", catatan: "", error: "" })}
                  >
                    Batal
                  </Btn>
                  <Btn
                    type="submit"
                    variant="success"
                    size="sm"
                    style={{
                      background: "#059669",
                      borderColor: "#059669",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 18px",
                      boxShadow: "0 2px 6px rgba(5,150,105,0.25)"
                    }}
                  >
                    <CheckCircle2 size={15} />
                    Simpan Penerimaan Dana &amp; Selesai
                  </Btn>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

