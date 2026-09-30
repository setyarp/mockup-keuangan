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
  Edit3,
  X
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
  const [jenisIuranPFK, setJenisIuranPFK] = useState("THT_POLRI");

  // 3 Field Utama yang Sama untuk Semua Program:
  // 1. Nomor Surat (Format resmi: NoUrut/KU.06.06/KMR.N/Bulan/Tahun)
  // 2. Nominal
  // 3. Dokumen (Upload / Tergenerate)
  const [noSurat, setNoSurat] = useState("");
  const [nominal, setNominal] = useState("");
  const [dokumenFile, setDokumenFile] = useState(null);
  const [dokumenName, setDokumenName] = useState("SKP-PFK_Kemenkeu_Okt2024_THT_POLRI.pdf");

  // Field Pejabat Penandatangan Tagihan
  const [namaPejabat, setNamaPejabat] = useState("Helmi I Satriyo");
  const [jabatan, setJabatan] = useState("Direktur Keuangan dan Manajemen Resiko");

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

  // Efek sinkronisasi nomor surat, nominal, dan berkas sesuai pilihan Program dan Jenis Iuran
  useEffect(() => {
    if (selectedProgram === "THT_PENSIUN") {
      setNoSurat(""); // Default kosong untuk Nomor Surat PFK
      setNominal(""); // Default kosong untuk Nominal Tagihan PFK
      if (jenisIuranPFK === "THT_POLRI") {
        setDokumenName("SKP-PFK_Kemenkeu_Okt2024_THT_POLRI.pdf");
      } else if (jenisIuranPFK === "THT_TNI") {
        setDokumenName("SKP-PFK_Kemenkeu_Okt2024_THT_TNI.pdf");
      } else if (jenisIuranPFK === "PENSIUN_POLRI") {
        setDokumenName("SKP-PFK_Kemenkeu_Okt2024_Pensiun_POLRI.pdf");
      } else if (jenisIuranPFK === "PENSIUN_TNI") {
        setDokumenName("SKP-PFK_Kemenkeu_Okt2024_Pensiun_TNI.pdf");
      }
    } else if (selectedProgram === "JKK") {
      setNoSurat(formatNomorSuratPFK(nextNoUrutJKK_JKM, "IX", 2026));
      if (jenisIuranPFK === "JKK_TNI") {
        setNominal("1510000000"); // 8.208 peserta x 0,24%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKK_TNI_Juli2026.pdf");
      } else {
        setNominal("1120000000"); // 6.120 peserta x 0,24%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKK_POLRI_Juli2026.pdf");
      }
    } else if (selectedProgram === "JKM") {
      setNoSurat(formatNomorSuratPFK(nextNoUrutJKK_JKM, "IX", 2026));
      if (jenisIuranPFK === "JKM_TNI") {
        setNominal("1270000000"); // 8.208 peserta x 0,20%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKM_TNI_Juli2026.pdf");
      } else {
        setNominal("940000000"); // 6.120 peserta x 0,20%
        setDokumenFile(null);
        setDokumenName("Rekap_Iuran_JKM_POLRI_Juli2026.pdf");
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

  // Daftar Riwayat Tagihan - Terpisah per masing-masing Dana PFK (THT TNI, THT POLRI, Pensiun TNI, Pensiun POLRI)
  const [tagihanList, setTagihanList] = useState([
    {
      id: "TGH-001",
      noSurat: "S-1190/KU.06.06/KMR.N/X/2024",
      program: "THT TNI",
      danaPorsi: "Iuran THT Prajurit TNI & ASN Kemhan (3,25%)",
      matra: "TNI & Kemhan",
      periode: "Oktober 2024",
      tglGenerate: "15 Oktober 2024",
      tglCutoff: "10 Oktober 2024",
      noKEP: "KEP-41/PB/PB.3/2024",
      tglKEP: "14 Oktober 2024",
      tahunAnggaran: "2024",
      noBukti: "21/PFK.THT-AS/X/2024-Keu",
      nominal: "Rp 1.121.913.428",
      nominalNum: 1121913428,
      nominalLalu: 1059518554039,
      namaRekening: "THT Umum ASABRI",
      noRekening: "0261-01-000004-30-9",
      namaBank: "BRI Kantor Cabang Jakarta Krekot",
      acuan: "Keputusan Dirjen Perbendaharaan KEP-41/PB/PB.3/2024",
      dokumen: "SKP-PFK_Kemenkeu_Okt2024_THT_TNI.pdf",
      peserta: "266.150",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Oktober 2024",
      resiPos: "POS-JKT-20241017-0941",
      skpDetails: {
        noSurat: "KEP-41/PB/PB.3/2024",
        tglSurat: "14 Oktober 2024",
        fileName: "SKP-PFK_Kemenkeu_Okt2024_THT_TNI.pdf",
        nominal: "Rp 1.121.913.428"
      },
      items: [
        { jenis: "Iuran THT (3,25% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 1.121.913.428" }
      ],
      satkerList: SATKER_THT_TNI
    },
    {
      id: "TGH-002",
      noSurat: "S-1191/KU.06.06/KMR.N/X/2024",
      program: "THT POLRI",
      danaPorsi: "Iuran THT Anggota POLRI & PNS Polri (3,25%)",
      matra: "POLRI",
      periode: "Oktober 2024",
      tglGenerate: "15 Oktober 2024",
      tglCutoff: "10 Oktober 2024",
      noKEP: "KEP-41/PB/PB.3/2024",
      tglKEP: "14 Oktober 2024",
      tahunAnggaran: "2024",
      noBukti: "22/PFK.THT-POLRI/X/2024-Keu",
      nominal: "Rp 14.225.000.000",
      nominalNum: 14225000000,
      nominalLalu: 542180412000,
      namaRekening: "THT Umum ASABRI",
      noRekening: "0261-01-000004-30-9",
      namaBank: "BRI Kantor Cabang Jakarta Krekot",
      acuan: "Keputusan Dirjen Perbendaharaan KEP-41/PB/PB.3/2024",
      dokumen: "SKP-PFK_Kemenkeu_Okt2024_THT_POLRI.pdf",
      peserta: "142.200",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Oktober 2024",
      resiPos: "POS-JKT-20241017-0942",
      skpDetails: {
        noSurat: "KEP-41/PB/PB.3/2024",
        tglSurat: "14 Oktober 2024",
        fileName: "SKP-PFK_Kemenkeu_Okt2024_THT_POLRI.pdf",
        nominal: "Rp 14.225.000.000"
      },
      items: [
        { jenis: "Iuran THT (3,25% Gaji Pokok Anggota POLRI & PNS Polri)", peserta: "142.200", nominal: "Rp 14.225.000.000" }
      ],
      satkerList: SATKER_THT_POLRI
    },
    {
      id: "TGH-003",
      noSurat: "S-1192/KU.06.06/KMR.N/X/2024",
      program: "Pensiun TNI",
      danaPorsi: "Iuran Pensiun Prajurit TNI & ASN Kemhan (4,75%)",
      matra: "TNI & Kemhan",
      periode: "Oktober 2024",
      tglGenerate: "15 Oktober 2024",
      tglCutoff: "10 Oktober 2024",
      noKEP: "KEP-41/PB/PB.3/2024",
      tglKEP: "14 Oktober 2024",
      tahunAnggaran: "2024",
      noBukti: "24/PFK.PEN-TNI/X/2024-Keu",
      nominal: "Rp 41.710.000.000",
      nominalNum: 41710000000,
      nominalLalu: 1628410500000,
      namaRekening: "Pensiun ASABRI",
      noRekening: "0261-01-000005-30-5",
      namaBank: "BRI Kantor Cabang Jakarta Krekot",
      acuan: "Keputusan Dirjen Perbendaharaan KEP-41/PB/PB.3/2024",
      dokumen: "SKP-PFK_Kemenkeu_Okt2024_Pensiun_TNI.pdf",
      peserta: "266.150",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Oktober 2024",
      resiPos: "POS-JKT-20241017-0943",
      skpDetails: {
        noSurat: "KEP-41/PB/PB.3/2024",
        tglSurat: "14 Oktober 2024",
        fileName: "SKP-PFK_Kemenkeu_Okt2024_Pensiun_TNI.pdf",
        nominal: "Rp 41.710.000.000"
      },
      items: [
        { jenis: "Iuran Pensiun (4,75% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 41.710.000.000" }
      ],
      satkerList: SATKER_PENSIUN_TNI
    },
    {
      id: "TGH-004",
      noSurat: "S-1193/KU.06.06/KMR.N/X/2024",
      program: "Pensiun POLRI",
      danaPorsi: "Iuran Pensiun Anggota POLRI & PNS Polri (4,75%)",
      matra: "POLRI",
      periode: "Oktober 2024",
      tglGenerate: "15 Oktober 2024",
      tglCutoff: "10 Oktober 2024",
      noKEP: "KEP-41/PB/PB.3/2024",
      tglKEP: "14 Oktober 2024",
      tahunAnggaran: "2024",
      noBukti: "23/PFK.PEN-POLRI/X/2024-Keu",
      nominal: "Rp 20.805.000.000",
      nominalNum: 20805000000,
      nominalLalu: 812490210000,
      namaRekening: "Pensiun ASABRI",
      noRekening: "0261-01-000005-30-5",
      namaBank: "BRI Kantor Cabang Jakarta Krekot",
      acuan: "Keputusan Dirjen Perbendaharaan KEP-41/PB/PB.3/2024",
      dokumen: "SKP-PFK_Kemenkeu_Okt2024_Pensiun_POLRI.pdf",
      peserta: "142.200",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Oktober 2024",
      resiPos: "POS-JKT-20241017-0944",
      skpDetails: {
        noSurat: "KEP-41/PB/PB.3/2024",
        tglSurat: "14 Oktober 2024",
        fileName: "SKP-PFK_Kemenkeu_Okt2024_Pensiun_POLRI.pdf",
        nominal: "Rp 20.805.000.000"
      },
      items: [
        { jenis: "Iuran Pensiun (4,75% Gaji Pokok Anggota POLRI & PNS Polri)", peserta: "142.200", nominal: "Rp 20.805.000.000" }
      ],
      satkerList: SATKER_PENSIUN_POLRI
    },
    {
      id: "TGH-005",
      noSurat: "1194/KU.06.06/KMR.N/IX/2026",
      program: "JKK TNI",
      danaPorsi: "Iuran Jaminan Kecelakaan Kerja TNI (0,24%)",
      matra: "TNI & Kemhan",
      periode: "Juli 2026",
      tglGenerate: "25 Juli 2026",
      acuan: "Data Kepesertaan TNI & Kemhan (0,24%)",
      nominal: "Rp 1.510.000.000",
      nominalNum: 1510000000,
      dokumen: "Rekap_Iuran_JKK_TNI_Juli2026.pdf",
      peserta: "8.208",
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      skpDetails: null,
      items: [
        { jenis: "Iuran JKK (0,24% Basis GP Prajurit TNI & Kemhan)", peserta: "8.208", nominal: "Rp 1.510.000.000" }
      ]
    },
    {
      id: "TGH-006",
      noSurat: "1195/KU.06.06/KMR.N/IX/2026",
      program: "JKK POLRI",
      danaPorsi: "Iuran Jaminan Kecelakaan Kerja POLRI (0,24%)",
      matra: "POLRI",
      periode: "Juli 2026",
      tglGenerate: "25 Juli 2026",
      acuan: "Data Kepesertaan POLRI (0,24%)",
      nominal: "Rp 1.120.000.000",
      nominalNum: 1120000000,
      dokumen: "Rekap_Iuran_JKK_POLRI_Juli2026.pdf",
      peserta: "6.120",
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      skpDetails: null,
      items: [
        { jenis: "Iuran JKK (0,24% Basis GP Anggota POLRI & PNS Polri)", peserta: "6.120", nominal: "Rp 1.120.000.000" }
      ]
    },
    {
      id: "TGH-007",
      noSurat: "1196/KU.06.06/KMR.N/IX/2026",
      program: "JKM TNI",
      danaPorsi: "Iuran Jaminan Kematian TNI (0,20%)",
      matra: "TNI & Kemhan",
      periode: "Juli 2026",
      tglGenerate: "25 Juli 2026",
      acuan: "Data Kepesertaan TNI & Kemhan (0,20%)",
      nominal: "Rp 1.270.000.000",
      nominalNum: 1270000000,
      dokumen: "Rekap_Iuran_JKM_TNI_Juli2026.pdf",
      peserta: "8.208",
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      skpDetails: null,
      items: [
        { jenis: "Iuran JKM (0,20% Basis GP Prajurit TNI & Kemhan)", peserta: "8.208", nominal: "Rp 1.270.000.000" }
      ]
    },
    {
      id: "TGH-008",
      noSurat: "1197/KU.06.06/KMR.N/IX/2026",
      program: "JKM POLRI",
      danaPorsi: "Iuran Jaminan Kematian POLRI (0,20%)",
      matra: "POLRI",
      periode: "Juli 2026",
      tglGenerate: "25 Juli 2026",
      acuan: "Data Kepesertaan POLRI (0,20%)",
      nominal: "Rp 940.000.000",
      nominalNum: 940000000,
      dokumen: "Rekap_Iuran_JKM_POLRI_Juli2026.pdf",
      peserta: "6.120",
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      skpDetails: null,
      items: [
        { jenis: "Iuran JKM (0,20% Basis GP Anggota POLRI & PNS Polri)", peserta: "6.120", nominal: "Rp 940.000.000" }
      ]
    }
  ]);

  // Handler Generate Single Surat (Membuka Preview Modal terlebih dahulu sebelum diterbitkan)
  const handleGenerate = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    let curNoSurat = noSurat ? noSurat.trim() : "";
    let curNominal = nominal;
    let curDok = dokumenName ? dokumenName.trim() : "";

    if (selectedProgram === "THT_PENSIUN") {
      if (!curNoSurat) {
        if (jenisIuranPFK === "THT_TNI") curNoSurat = "S-1190/KU.06.06/KMR.N/X/2024";
        else if (jenisIuranPFK === "THT_POLRI") curNoSurat = "S-1191/KU.06.06/KMR.N/X/2024";
        else if (jenisIuranPFK === "PENSIUN_TNI") curNoSurat = "S-1192/KU.06.06/KMR.N/X/2024";
        else if (jenisIuranPFK === "PENSIUN_POLRI") curNoSurat = "S-1193/KU.06.06/KMR.N/X/2024";
        else curNoSurat = "S-1191/KU.06.06/KMR.N/X/2024";
      }
      if (!curNominal || Number(curNominal) <= 0) {
        if (jenisIuranPFK === "THT_TNI") curNominal = "1121913428";
        else if (jenisIuranPFK === "THT_POLRI") curNominal = "14225000000";
        else if (jenisIuranPFK === "PENSIUN_TNI") curNominal = "41710000000";
        else if (jenisIuranPFK === "PENSIUN_POLRI") curNominal = "20805000000";
        else curNominal = "14225000000";
      }
      if (!curDok) {
        curDok = `SKP-PFK_Kemenkeu_Okt2024_${jenisIuranPFK}.pdf`;
      }
    } else if (selectedProgram === "JKK") {
      const isPolri = jenisIuranPFK === "JKK_POLRI";
      if (!curNoSurat) curNoSurat = formatNomorSuratPFK(nextNoUrutJKK_JKM, "IX", 2026);
      if (!curNominal || Number(curNominal) <= 0) curNominal = isPolri ? "1120000000" : "1510000000";
      if (!curDok) curDok = `Rekap_Iuran_JKK_${isPolri ? "POLRI" : "TNI"}_Juli2026.pdf`;
    } else if (selectedProgram === "JKM") {
      const isPolri = jenisIuranPFK === "JKM_POLRI";
      if (!curNoSurat) curNoSurat = formatNomorSuratPFK(nextNoUrutJKK_JKM, "IX", 2026);
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
      porsiKet = `Iuran JKK (${isPolri ? "POLRI" : "TNI"} 0,24%)`;
      items = [{
        jenis: `Iuran JKK (0,24% Basis Gaji Pokok ${isPolri ? "Anggota POLRI & PNS Polri" : "Prajurit TNI & ASN Kemhan"})`,
        peserta: isPolri ? "6.120" : "8.208",
        nominal: formatRupiah(nomValue)
      }];
    } else if (selectedProgram === "JKM") {
      const isPolri = jenisIuranPFK === "JKM_POLRI";
      programName = isPolri ? "JKM POLRI" : "JKM TNI";
      matraName = isPolri ? "POLRI" : "TNI & Kemhan";
      porsiKet = `Iuran JKM (${isPolri ? "POLRI" : "TNI"} 0,20%)`;
      items = [{
        jenis: `Iuran JKM (0,20% Basis Gaji Pokok ${isPolri ? "Anggota POLRI & PNS Polri" : "Prajurit TNI & ASN Kemhan"})`,
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
      program: programName,
      danaPorsi: porsiKet,
      matra: matraName,
      periode: "Oktober 2024",
      tglGenerate: todayStr,
      tglCutoff: "10 Oktober 2024",
      noKEP: "KEP-41/PB/PB.3/2024",
      tglKEP: "14 Oktober 2024",
      tahunAnggaran: "2024",
      noBukti: isTHTProg ? (isPolriProg ? "22/PFK.THT-POLRI/X/2024-Keu" : "21/PFK.THT-AS/X/2024-Keu") : (isPolriProg ? "23/PFK.PEN-POLRI/X/2024-Keu" : "24/PFK.PEN-TNI/X/2024-Keu"),
      nominal: formatRupiah(nomValue),
      nominalNum: nomValue,
      nominalLalu: isTHTProg ? 1059518554039 : 812490210000,
      namaRekening: isTHTProg ? "THT Umum ASABRI" : "Pensiun ASABRI",
      noRekening: isTHTProg ? "0261-01-000004-30-9" : "0261-01-000005-30-5",
      namaBank: "BRI Kantor Cabang Jakarta Krekot",
      acuan: skpDetails ? `Keputusan Dirjen Perbendaharaan KEP-41/PB/PB.3/2024` : `Data Kepesertaan (${selectedProgram === "JKK" ? "0,24%" : "0,20%"})`,
      dokumen: curDok,
      peserta: programName.includes("TNI") ? "266.150" : (programName.includes("POLRI") ? "142.200" : "14.328"),
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      namaPejabat: namaPejabat || "Helmi I Satriyo",
      jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
      namaDirektur: namaPejabat || "Helmi I Satriyo",
      jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
      skpDetails: skpDetails,
      items: items,
      satkerList: satkerList
    };

    // Buka Modal Preview Terlebih Dahulu Sebelum Tagihan Dibuat/Disimpan
    if (selectedProgram === "THT_PENSIUN") {
      setPreview({
        title: `Pratinjau Surat Tagihan Iuran ${programName} — ${curNoSurat}`,
        subtitle: `Format Resmi Kemenkeu RI (3 Halaman) • Satker (440780)`,
        type: "surat_kemenkeu",
        fileName: `Surat_Tagihan_${programName.replace(/\s+/g, "_")}_${curNoSurat.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        bannerNotice: `🔍 Pratinjau Dokumen Sebelum Diterbitkan: Silakan periksa kelengkapan nomor surat dan rincian nominal di bawah ini. Klik "Konfirmasi & Terbitkan Tagihan" untuk menyimpan resmi ke Riwayat Penagihan.`,
        confirmAction: {
          label: `Konfirmasi & Terbitkan Tagihan ${programName}`,
          icon: <CheckCircle2 size={15} />,
          variant: "success",
          onClick: () => {
            setTagihanList((prev) => [newItem, ...prev]);
            setSuccessNotice(`Surat Tagihan ${programName} (${curNoSurat}) berhasil diterbitkan dan disimpan ke Riwayat Penagihan!`);
            setActiveTab("history");
            setTimeout(() => setSuccessNotice(null), 6000);
          }
        },
        content: {
          program: programName,
          noSurat: curNoSurat,
          tanggalSurat: todayStr,
          tglCutoff: "10 Oktober 2024",
          noKEP: "KEP-41/PB/PB.3/2024",
          tglKEP: "14 Oktober 2024",
          tahunAnggaran: "2024",
          nominalNum: nomValue,
          nominalStr: formatRupiah(nomValue),
          nominalLalu: isTHTProg ? 1059518554039 : 812490210000,
          noBukti: isTHTProg ? (isPolriProg ? "22/PFK.THT-POLRI/X/2024-Keu" : "21/PFK.THT-AS/X/2024-Keu") : (isPolriProg ? "23/PFK.PEN-POLRI/X/2024-Keu" : "24/PFK.PEN-TNI/X/2024-Keu"),
          namaRekening: isTHTProg ? "THT Umum ASABRI" : "Pensiun ASABRI",
          noRekening: isTHTProg ? "0261-01-000004-30-9" : "0261-01-000005-30-5",
          namaBank: "BRI Kantor Cabang Jakarta Krekot",
          namaPejabat: namaPejabat || "Helmi I Satriyo",
          jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
          namaDirektur: namaPejabat || "Helmi I Satriyo",
          jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko",
          namaPPK: "Nazif Azhari",
          isPFKKemenkeu: true,
          satkerList: satkerList
        }
      });
    } else {
      setPreview({
        title: `Pratinjau Surat Tagihan — ${programName}`,
        subtitle: `${curNoSurat} • Periode Juli 2026`,
        type: "surat",
        fileName: `Surat_Tagihan_${programName.replace(/\s+/g, "_")}_Juli_2026.pdf`,
        bannerNotice: `🔍 Pratinjau Dokumen Sebelum Diterbitkan: Silakan periksa rincian kepesertaan & nominal tagihan ${programName}. Klik "Konfirmasi & Terbitkan Tagihan" untuk menyimpan resmi ke Riwayat Penagihan.`,
        confirmAction: {
          label: `Konfirmasi & Terbitkan Tagihan ${programName}`,
          icon: <CheckCircle2 size={15} />,
          variant: "success",
          onClick: () => {
            setTagihanList((prev) => [newItem, ...prev]);
            setNextNoUrutJKK_JKM((prev) => prev + 1);
            setSuccessNotice(`Surat Tagihan ${programName} (${curNoSurat}) berhasil diterbitkan dan disimpan ke Riwayat Penagihan!`);
            setActiveTab("history");
            setTimeout(() => setSuccessNotice(null), 6000);
          }
        },
        content: {
          noSurat: curNoSurat,
          periode: "Juli 2026",
          program: programName,
          items: items,
          totalNominal: formatRupiah(nomValue),
          satkerList: satkerList,
          dasarSKP: null,
          namaPejabat: namaPejabat || "Helmi I Satriyo",
          jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
          namaDirektur: namaPejabat || "Helmi I Satriyo",
          jabatanDirektur: jabatan || "Direktur Keuangan dan Manajemen Resiko"
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
          setTagihanList((prev) => [...batchLetters, ...prev]);
          setSuccessNotice(`Sukses! 4 Surat Tagihan Per-Dana PFK (No. S-${start} s.d. S-${start + 3}) berhasil digenerate sekaligus sesuai format resmi Kemenkeu!`);
          setActiveTab("history");
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

  // Tandai sudah ditandatangani manual & dikirim
  const handleMarkAsSigned = (id) => {
    const today = new Date();
    const tglStr = today.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const resi = `POS-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    setTagihanList((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "Sudah Ditandatangani Manual & Dikirim",
              tglTTD: tglStr,
              resiPos: resi
            }
          : t
      )
    );
    setSuccessNotice(`Surat tagihan ${id} telah ditandai selesai ditandatangani basah dan dikirim ke Kemenkeu.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  // Filter Tabel Tagihan
  const [filterTable, setFilterTable] = useState("Semua");
  const displayedTagihan = tagihanList.filter((t) => {
    if (filterTable === "Semua") return true;
    if (filterTable === "DANA_PFK") return ["THT TNI", "THT POLRI", "Pensiun TNI", "Pensiun POLRI"].includes(t.program);
    return t.program === filterTable;
  });

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
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan resmi 1190/KU.06.06/KMR.N/IX/2026 diterbitkan ke Kemenkeu RI",
          user: "Helmi I Satriyo"
        },
        {
          tanggal: "18 September 2026",
          status: "Dana Diterima",
          catatan: "SP2D-260918-008921 cair dan tercatat di Rekening Giro Penampungan",
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
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan resmi 1191/KU.06.06/KMR.N/IX/2026 diterbitkan",
          user: "Helmi I Satriyo"
        },
        {
          tanggal: "18 September 2026",
          status: "Dana Diterima",
          catatan: "SP2D-260918-008922 masuk ke rekening",
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
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan resmi 1192/KU.06.06/KMR.N/IX/2026 diterbitkan",
          user: "Helmi I Satriyo"
        },
        {
          tanggal: "18 September 2026",
          status: "Dana Diterima",
          catatan: "SP2D-260918-008923 masuk ke rekening BNI",
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
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "15 September 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan resmi 1193/KU.06.06/KMR.N/IX/2026 diterbitkan ke Kemenkeu RI (menunggu pencairan dana)",
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
      jenisIuran: "Iuran JKK Anggota POLRI & PNS Polri (0,24%)",
      kodeTarif: "0,24% Basis Gaji Pokok",
      matraUtama: "POLRI (6.120 Personel)",
      noSuratTagihan: "002/ASABRI/TGH-JKK/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglTerimaDana: "28 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260728-004128",
      nominalTagihan: 1120000000,
      nominalDiterima: 1120000000,
      peserta: 6120,
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan 002/ASABRI/TGH-JKK/VII/2026 diterbitkan",
          user: "Helmi I Satriyo"
        },
        {
          tanggal: "28 Juli 2026",
          status: "Dana Diterima",
          catatan: "SP2D-260728-004128 masuk ke rekening penampungan",
          user: "Helmi I Satriyo"
        }
      ]
    },
    {
      id: "JKK-002",
      program: "JKK",
      danaType: "JKK_TNI",
      namaDana: "JKK TNI",
      jenisIuran: "Iuran JKK Prajurit TNI & ASN Kemhan (0,24%)",
      kodeTarif: "0,24% Basis Gaji Pokok",
      matraUtama: "TNI & Kemhan (8.208 Personel)",
      noSuratTagihan: "003/ASABRI/TGH-JKK/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglTerimaDana: "28 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260728-004130",
      nominalTagihan: 1510000000,
      nominalDiterima: 1510000000,
      peserta: 8208,
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan 003/ASABRI/TGH-JKK/VII/2026 diterbitkan",
          user: "Helmi I Satriyo"
        },
        {
          tanggal: "28 Juli 2026",
          status: "Dana Diterima",
          catatan: "SP2D-260728-004130 telah disalurkan",
          user: "Helmi I Satriyo"
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
      jenisIuran: "Iuran JKM Anggota POLRI & PNS Polri (0,20%)",
      kodeTarif: "0,20% Basis Gaji Pokok",
      matraUtama: "POLRI (6.120 Personel)",
      noSuratTagihan: "004/ASABRI/TGH-JKM/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglTerimaDana: "28 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260728-004129",
      nominalTagihan: 940000000,
      nominalDiterima: 940000000,
      peserta: 6120,
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan 004/ASABRI/TGH-JKM/VII/2026 diterbitkan",
          user: "Helmi I Satriyo"
        },
        {
          tanggal: "28 Juli 2026",
          status: "Dana Diterima",
          catatan: "SP2D-260728-004129 cair",
          user: "Helmi I Satriyo"
        }
      ]
    },
    {
      id: "JKM-002",
      program: "JKM",
      danaType: "JKM_TNI",
      namaDana: "JKM TNI",
      jenisIuran: "Iuran JKM Prajurit TNI & ASN Kemhan (0,20%)",
      kodeTarif: "0,20% Basis Gaji Pokok",
      matraUtama: "TNI & Kemhan (8.208 Personel)",
      noSuratTagihan: "005/ASABRI/TGH-JKM/VII/2026",
      tglSuratTagihan: "25 Juli 2026",
      tglTerimaDana: "28 Juli 2026",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      noSP2D: "SP2D-260728-004131",
      nominalTagihan: 1270000000,
      nominalDiterima: 1270000000,
      peserta: 8208,
      statusDana: "Dana Belum Diterima",
      statusTagihan: "Dana Belum Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: "Helmi I Satriyo",
      jabatan: "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: "25 Juli 2026",
          status: "Dana Belum Diterima",
          catatan: "Surat tagihan 005/ASABRI/TGH-JKM/VII/2026 diterbitkan ke Kemenkeu (menunggu pencairan SP2D)",
          user: "Helmi I Satriyo"
        }
      ]
    }
  ]);

  // Modal Detail Monitoring & Input Perubahan Status Tagihan
  const [selectedDetailMonitoring, setSelectedDetailMonitoring] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusEditForm, setStatusEditForm] = useState({
    statusTagihan: "Dana Diterima",
    noSP2D: "",
    tglTerimaDana: "",
    catatan: ""
  });

  const getStatusTagihanBadge = (status) => {
    const s = status || "Dana Belum Diterima";
    if (s === "Dana Diterima" || (s.includes("Diterima") && !s.includes("Belum")) || s.includes("Lunas") || s.includes("Masuk")) {
      return {
        bg: "#ECFDF5",
        text: "#047857",
        border: "#A7F3D0",
        label: "Dana Diterima"
      };
    }
    return {
      bg: "#FFFBEB",
      text: "#B45309",
      border: "#FDE68A",
      label: "Dana Belum Diterima"
    };
  };

  const renderStatusIcon = (status) => {
    const s = status || "";
    if (s === "Dana Diterima" || (s.includes("Diterima") && !s.includes("Belum")) || s.includes("Lunas") || s.includes("Masuk")) {
      return <CheckCircle2 size={12} />;
    }
    return <Clock size={12} />;
  };

  const handleOpenDetailModal = (item) => {
    const curStatus = item.statusTagihan || item.statusDana || "Dana Belum Diterima";
    const normalizedStatus = (curStatus === "Dana Diterima" || (curStatus.includes("Diterima") && !curStatus.includes("Belum")) || curStatus.includes("Lunas") || curStatus.includes("Masuk"))
      ? "Dana Diterima"
      : "Dana Belum Diterima";

    setSelectedDetailMonitoring(item);
    setIsEditingStatus(false);
    setStatusEditForm({
      statusTagihan: normalizedStatus,
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

  // Modal Input Realisasi SKP-PFK
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

  // Modal Input Realisasi JKK & JKM
  const [showInputModalJKK, setShowInputModalJKK] = useState(false);
  const [inputErrorJKK, setInputErrorJKK] = useState("");
  const [inputFormJKK, setInputFormJKK] = useState({
    program: "JKK",
    danaType: "JKK_POLRI",
    noSuratTagihan: "",
    tglSuratTagihan: "",
    tglTerimaDana: "",
    noSP2D: "",
    bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
    nominalTagihan: "",
    peserta: "6120"
  });

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
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: namaPejabat || "Helmi I Satriyo",
      jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: inputForm.tglSuratTagihan.trim(),
          status: "Dana Belum Diterima",
          catatan: `Surat tagihan ${inputForm.noSuratTagihan.trim()} diterbitkan ke Kemenkeu RI`,
          user: namaPejabat || "Helmi I Satriyo"
        },
        {
          tanggal: inputForm.tglTerimaDana.trim(),
          status: "Dana Diterima",
          catatan: `SP2D ${inputForm.noSP2D.trim()} diterima dan dana masuk rekening`,
          user: namaPejabat || "Helmi I Satriyo"
        }
      ],
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
    setSuccessNotice(`Data penerimaan dana ${newRecord.noSuratTagihan} (${namaDana}) berhasil dimasukkan ke dalam daftar monitoring!`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleSaveNewJKK = (e) => {
    e.preventDefault();
    if (
      !inputFormJKK.noSuratTagihan.trim() ||
      !inputFormJKK.tglSuratTagihan.trim() ||
      !inputFormJKK.tglTerimaDana.trim() ||
      !inputFormJKK.noSP2D.trim() ||
      !inputFormJKK.nominalTagihan ||
      Number(inputFormJKK.nominalTagihan) <= 0
    ) {
      setInputErrorJKK("Semua field bertanda bintang (*) wajib diisi lengkap!");
      return;
    }

    const nom = Number(inputFormJKK.nominalTagihan);
    const isPolri = inputFormJKK.danaType.includes("POLRI");
    const prog = inputFormJKK.program;
    const namaDana = isPolri ? `${prog} POLRI` : `${prog} TNI`;

    const newRecord = {
      id: `${inputFormJKK.program}-${Date.now().toString().slice(-4)}`,
      program: prog,
      danaType: inputFormJKK.danaType,
      namaDana: namaDana,
      jenisIuran: `Iuran ${prog} ${isPolri ? "Anggota POLRI & PNS Polri" : "Prajurit TNI & ASN Kemhan"} (${prog === "JKK" ? "0,24%" : "0,20%"})`,
      kodeTarif: `${prog === "JKK" ? "0,24%" : "0,20%"} Basis Gaji Pokok`,
      matraUtama: isPolri ? "POLRI & PNS Polri" : "TNI & ASN Kemhan",
      noSuratTagihan: inputFormJKK.noSuratTagihan.trim(),
      tglSuratTagihan: inputFormJKK.tglSuratTagihan.trim(),
      tglTerimaDana: inputFormJKK.tglTerimaDana.trim(),
      bankTujuan: inputFormJKK.bankTujuan,
      noSP2D: inputFormJKK.noSP2D.trim(),
      nominalTagihan: nom,
      nominalDiterima: nom,
      peserta: Number(inputFormJKK.peserta || (isPolri ? 6120 : 8208)),
      statusDana: "Dana Diterima",
      statusTagihan: "Dana Diterima",
      statusProses: "Dalam Monitoring",
      namaPejabat: namaPejabat || "Helmi I Satriyo",
      jabatan: jabatan || "Direktur Keuangan dan Manajemen Resiko",
      riwayatStatus: [
        {
          tanggal: inputFormJKK.tglSuratTagihan.trim(),
          status: "Dana Belum Diterima",
          catatan: `Surat tagihan ${inputFormJKK.noSuratTagihan.trim()} diterbitkan ke Kemenkeu RI`,
          user: namaPejabat || "Helmi I Satriyo"
        },
        {
          tanggal: inputFormJKK.tglTerimaDana.trim(),
          status: "Dana Diterima",
          catatan: `SP2D ${inputFormJKK.noSP2D.trim()} diterima dan dana masuk rekening`,
          user: namaPejabat || "Helmi I Satriyo"
        }
      ]
    };

    if (inputFormJKK.program === "JKK") {
      setMonitoringJKKList((prev) => [...prev, newRecord]);
    } else {
      setMonitoringJKMList((prev) => [...prev, newRecord]);
    }

    setShowInputModalJKK(false);
    setInputErrorJKK("");
    setInputFormJKK({
      program: monitoringProgram === "JKM" ? "JKM" : "JKK",
      danaType: monitoringProgram === "JKM" ? "JKM_POLRI" : "JKK_POLRI",
      noSuratTagihan: "",
      tglSuratTagihan: "",
      tglTerimaDana: "",
      noSP2D: "",
      bankTujuan: "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu",
      nominalTagihan: "",
      peserta: "6120"
    });
    setSuccessNotice(`Data penerimaan dana ${newRecord.noSuratTagihan} (${namaDana}) berhasil dimasukkan ke dalam daftar monitoring!`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const filteredMonitoringSKP = monitoringSKPList.filter((item) => {
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
        subtitle: `Format Resmi Kemenkeu RI (3 Halaman) • Satker (440780)`,
        type: "surat_kemenkeu",
        fileName: `Surat_Tagihan_${namaDana.replace(/[^a-zA-Z0-9]/g, "_")}_${(item.noSuratTagihan || item.noSurat || "").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          program: namaDana,
          noSurat: item.noSuratTagihan || item.noSurat || "S-1190/KU.06.06/KMR.N/X/2024",
          tanggalSurat: item.tglSuratTagihan || item.tglGenerate || "Oktober 2024",
          tglCutoff: item.tglCutoff || "10 Oktober 2024",
          noKEP: item.noKEP || (item.skpDetails?.noSurat) || "KEP-41/PB/PB.3/2024",
          tglKEP: item.tglKEP || (item.skpDetails?.tglSurat) || "14 Oktober 2024",
          tahunAnggaran: item.tahunAnggaran || "2024",
          nominalNum: item.nominalDanaSKP || item.nominalNum || item.nominalDiterima || (isTHT ? 1121913428 : 20805000000),
          nominalLalu: item.nominalLalu || (isTHT ? 1059518554039 : 812490210000),
          noBukti: item.noBukti || (isTHT ? (isPolri ? "22/PFK.THT-POLRI/X/2024-Keu" : "21/PFK.THT-AS/X/2024-Keu") : (isPolri ? "23/PFK.PEN-POLRI/X/2024-Keu" : "24/PFK.PEN-TNI/X/2024-Keu")),
          namaRekening: item.namaRekening || (isTHT ? "THT Umum ASABRI" : "Pensiun ASABRI"),
          noRekening: item.noRekening || (isTHT ? "0261-01-000004-30-9" : "0261-01-000005-30-5"),
          namaBank: item.namaBank || "BRI Kantor Cabang Jakarta Krekot",
          namaPejabat: item.namaPejabat || item.namaDirektur || namaPejabat || "Helmi I Satriyo",
          jabatan: item.jabatan || item.jabatanDirektur || jabatan || "Direktur Keuangan dan Manajemen Resiko",
          namaDirektur: item.namaPejabat || item.namaDirektur || namaPejabat || "Helmi I Satriyo",
          jabatanDirektur: item.jabatan || item.jabatanDirektur || jabatan || "Direktur Keuangan dan Manajemen Resiko",
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
        subtitle: `Kemenkeu RI / KPPN Khusus Jakarta II • Periode Juli 2026`,
        type: "surat",
        fileName: `Surat_Tagihan_${namaDana.replace(/[^a-zA-Z0-9]/g, "_")}_${(item.noSuratTagihan || item.noSurat || "").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        content: {
          judulSurat: `SURAT TAGIHAN IURAN ${namaDana.toUpperCase()}`,
          noSurat: item.noSuratTagihan || item.noSurat,
          tanggal: item.tglSuratTagihan || item.tglGenerate,
          periode: "Juli 2026",
          batchInfo: `Program: ${namaDana} • Tarif ${prog === "JKK" ? "0,24%" : "0,20%"}`,
          namaPejabat: item.namaPejabat || item.namaDirektur || namaPejabat || "Helmi I Satriyo",
          jabatan: item.jabatan || item.jabatanDirektur || jabatan || "Direktur Keuangan dan Manajemen Resiko",
          namaDirektur: item.namaPejabat || item.namaDirektur || namaPejabat || "Helmi I Satriyo",
          jabatanDirektur: item.jabatan || item.jabatanDirektur || jabatan || "Direktur Keuangan dan Manajemen Resiko",
          items: [
            {
              jenis: item.jenisIuran || (prog === "JKK" ? "Iuran JKK (0,24%)" : "Iuran JKM (0,20%)"),
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
            {monitoringSKPList.length + monitoringJKKList.length + monitoringJKMList.length}
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
            {tagihanList.length}
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

                  {/* FIELD 2: NOMOR SURAT */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      {selectedProgram === "THT_PENSIUN" ? "Nomor Surat PFK" : "Nomor Surat Tagihan"} <span style={{ color: "red" }}>*</span>
                    </label>
                    {selectedProgram === "THT_PENSIUN" ? (
                      <>
                        <input
                          type="text"
                          value={noSurat}
                          onChange={(e) => setNoSurat(e.target.value)}
                          placeholder="Masukkan Nomor Surat PFK (cth: S-184/PB.2/2026)"
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
                          Nomor Surat Keputusan / Penetapan PFK dari Kemenkeu RI
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={noSurat}
                          readOnly
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 13,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            background: "#F1F5F9",
                            color: "#1E40AF",
                            cursor: "not-allowed",
                            outline: "none"
                          }}
                        />
                        <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                          Nomor surat terisi otomatis dan tidak dapat diedit.
                        </div>
                      </>
                    )}
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
              <span>Jaminan Kecelakaan Kerja (JKK 0,24%)</span>
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
              <span>Jaminan Kematian (JKM 0,20%)</span>
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
                  placeholder="Cari surat / SKP / SP2D..."
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

            <div>
              {monitoringProgram === "THT_PENSIUN" ? (
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
                    setInputFormJKK((prev) => ({ ...prev, program: monitoringProgram }));
                    setShowInputModalJKK(true);
                  }}
                  style={{ background: monitoringTheme.primary, fontWeight: 700 }}
                >
                  <Plus size={14} style={{ marginRight: 4 }} />
                  Input Realisasi {monitoringProgram}
                </Btn>
              )}
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
                        <td colSpan={6} style={{ padding: 30, textAlign: "center", color: COLORS.gray500 }}>
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
                        const stBadge = getStatusTagihanBadge(item.statusTagihan || item.statusDana);

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
                                Tgl Surat: {item.tglSuratTagihan} • {item.matraUtama}
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
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: badgeColor.text }}>
                                {fmtB(item.nominalDanaSKP)}
                              </div>
                              <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                                {fmtNum(item.peserta)} Personel • Tarif {item.tarif || (isTHT ? "3,25%" : "4,75%")}
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
                                variant="primary"
                                style={{ padding: "5px 12px", fontSize: 11.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}
                                onClick={() => handleOpenDetailModal(item)}
                              >
                                <Eye size={12} />
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
                        <td colSpan={5} style={{ padding: 30, textAlign: "center", color: COLORS.gray500 }}>
                          Tidak ada data penerimaan tagihan {monitoringProgram} dalam monitoring aktif.
                        </td>
                      </tr>
                    ) : (
                      (monitoringProgram === "JKK" ? filteredMonitoringJKK : filteredMonitoringJKM).map((item) => {
                        const stBadge = getStatusTagihanBadge(item.statusTagihan || item.statusDana);
                        return (
                          <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.gray900 }}>
                                {item.namaDana || item.program}
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
                                Tgl Surat: {item.tglSuratTagihan} • {item.matraUtama}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "right" }}>
                              <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: monitoringTheme.primary }}>
                                {fmtB(item.nominalDiterima)}
                              </div>
                              <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 2 }}>
                                {fmtNum(item.peserta)} Personel
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
                                variant="primary"
                                style={{ padding: "5px 12px", fontSize: 11.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}
                                onClick={() => handleOpenDetailModal(item)}
                              >
                                <Eye size={12} />
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
                <option value="JKK TNI">JKK TNI (0,24%)</option>
                <option value="JKK POLRI">JKK POLRI (0,24%)</option>
                <option value="JKM TNI">JKM TNI (0,20%)</option>
                <option value="JKM POLRI">JKM POLRI (0,20%)</option>
              </select>
            </div>
          </div>

          {/* Tabel Riwayat Data */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: COLORS.gray600, textAlign: "left" }}>
                  <th style={{ padding: "9px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>No. Surat Resmi</th>
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jenis Dana / Porsi</th>
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra Peserta</th>
                  <th style={{ padding: "9px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tagihan</th>
                </tr>
              </thead>
              <tbody>
                {displayedTagihan.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                      Belum ada surat tagihan pada filter ini.
                    </td>
                  </tr>
                ) : (
                  displayedTagihan.map((t) => {
                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "10px 14px" }}>
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

                        <td style={{ padding: "10px 12px" }}>
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

                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 600, color: COLORS.gray800 }}>{t.matra}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>{t.peserta} Jiwa</div>
                        </td>

                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, fontFamily: "monospace", color: COLORS.blueDark, fontSize: 13 }}>
                          {t.nominal}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Input Realisasi SKP-PFK (THT & Pensiun) */}
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
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                    Input Realisasi Kas Surat Tagihan SKP-PFK
                  </div>
                  <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                    Pencatatan realisasi dana masuk iuran THT / Pensiun berdasarkan SP2D Kemenkeu RI
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
                      Pilihan Dana PFK <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <select
                      value={inputForm.danaType}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isTHT = val.startsWith("THT");
                        const nama =
                          val === "THT_TNI" ? "Iuran THT Prajurit TNI & ASN Kemhan" :
                          val === "THT_POLRI" ? "Iuran THT Anggota POLRI & PNS Polri" :
                          val === "PENSIUN_TNI" ? "Iuran Pensiun Prajurit TNI & ASN Kemhan" :
                          "Iuran Pensiun Anggota POLRI & PNS Polri";
                        const defaultPeserta = val.includes("TNI") ? "266150" : "142200";

                        setInputForm({
                          ...inputForm,
                          danaType: val,
                          jenisIuran: nama,
                          peserta: defaultPeserta
                        });
                      }}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, fontWeight: 600, outline: "none", boxSizing: "border-box" }}
                    >
                      <option value="THT_TNI">THT TNI (Prajurit TNI & Kemhan - Tarif 3,25%)</option>
                      <option value="THT_POLRI">THT POLRI (Anggota & PNS Polri - Tarif 3,25%)</option>
                      <option value="PENSIUN_TNI">Pensiun TNI (Prajurit TNI & Kemhan - Tarif 4,75%)</option>
                      <option value="PENSIUN_POLRI">Pensiun POLRI (Anggota & PNS Polri - Tarif 4,75%)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nama Uraian Jenis Iuran
                    </label>
                    <input
                      type="text"
                      value={inputForm.jenisIuran}
                      onChange={(e) => setInputForm({ ...inputForm, jenisIuran: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Nomor Surat Tagihan ASABRI <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 1194/KU.06.06/KMR.N/IX/2026"
                      value={inputForm.noSuratTagihan}
                      onChange={(e) => setInputForm({ ...inputForm, noSuratTagihan: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                    <div style={{ fontSize: 10.5, color: COLORS.gray500, marginTop: 3 }}>
                      Pola: NoUrut/KU.06.06/KMR.N/Bulan(Romawi)/Tahun
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Tanggal Surat Tagihan <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 15 September 2026"
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
                      placeholder="Contoh: S-184/PB.2/2026"
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
                      placeholder="Contoh: 14 September 2026"
                      value={inputForm.tglSKP}
                      onChange={(e) => setInputForm({ ...inputForm, tglSKP: e.target.value })}
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
                      placeholder="Contoh: 18 September 2026"
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
                      placeholder="Contoh: SP2D-260918-009412"
                      value={inputForm.noSP2D}
                      onChange={(e) => setInputForm({ ...inputForm, noSP2D: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
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
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Jumlah Peserta (Jiwa)
                    </label>
                    <input
                      type="number"
                      value={inputForm.peserta || ""}
                      onChange={(e) => setInputForm({ ...inputForm, peserta: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                    Nominal Tagihan Surat Ini (Rp) <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 28540000000"
                    value={inputForm.nominalDanaSKP}
                    onChange={(e) => setInputForm({ ...inputForm, nominalDanaSKP: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                  />
                  {inputForm.nominalDanaSKP && Number(inputForm.nominalDanaSKP) > 0 && (
                    <div style={{ fontSize: 11, color: COLORS.blue, marginTop: 4 }}>
                      Nominal: {fmtB(inputForm.nominalDanaSKP)} • Tarif: {(inputForm.danaType || "THT_TNI").startsWith("THT") ? "3,25% (THT)" : "4,75% (Pensiun)"}
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
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
                      Jenis Dana <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <select
                      value={inputFormJKK.danaType}
                      onChange={(e) => {
                        const val = e.target.value;
                        const pes = val.includes("POLRI") ? "6120" : "8208";
                        setInputFormJKK({ ...inputFormJKK, danaType: val, peserta: pes });
                      }}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, outline: "none", boxSizing: "border-box", fontWeight: 700 }}
                    >
                      {inputFormJKK.program === "JKK" ? (
                        <>
                          <option value="JKK_POLRI">JKK POLRI (0,24%)</option>
                          <option value="JKK_TNI">JKK TNI (0,24%)</option>
                        </>
                      ) : (
                        <>
                          <option value="JKM_POLRI">JKM POLRI (0,20%)</option>
                          <option value="JKM_TNI">JKM TNI (0,20%)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                      Jumlah Peserta <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 6120"
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
                    <div style={{ fontSize: 11, color: monitoringTheme.primary, marginTop: 4 }}>
                      Nominal Terbilang: {fmtB(Number(inputFormJKK.nominalTagihan))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 16 }}>
                  <Btn type="button" variant="ghost" size="sm" onClick={() => setShowInputModalJKK(false)}>
                    Batal
                  </Btn>
                  <Btn type="submit" variant="primary" size="sm" style={{ background: monitoringTheme.primary }}>
                    <Check size={14} style={{ marginRight: 4 }} />
                    Simpan & Masukkan ke List
                  </Btn>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Monitoring & Input Perubahan Status Tagihan */}
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
              maxWidth: 860,
              maxHeight: "92vh",
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
                    Detail Tagihan & Monitoring Penerimaan Dana
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.gray800 }}>
                      {selectedDetailMonitoring.noSuratTagihan || selectedDetailMonitoring.noSurat}
                    </span>
                    <span>•</span>
                    <span>{selectedDetailMonitoring.namaDana || selectedDetailMonitoring.program}</span>
                    <span>•</span>
                    <span>Periode {selectedDetailMonitoring.tglSuratTagihan}</span>
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

            {/* Body Modal (Scrollable) */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              {/* Banner Status & Tombol Input Perubahan Status */}
              <div
                style={{
                  background: "#F8FAFC",
                  border: `1px solid ${COLORS.gray200}`,
                  borderRadius: 10,
                  padding: "16px 18px",
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                      Status Pemrosesan Tagihan
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {(() => {
                        const b = getStatusTagihanBadge(selectedDetailMonitoring.statusTagihan || selectedDetailMonitoring.statusDana);
                        return (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "5px 12px",
                              borderRadius: 6,
                              fontSize: 12.5,
                              fontWeight: 700,
                              background: b.bg,
                              color: b.text,
                              border: `1px solid ${b.border}`
                            }}
                          >
                            {renderStatusIcon(b.label)}
                            {b.label}
                          </span>
                        );
                      })()}
                      <span style={{ fontSize: 12, color: COLORS.gray600 }}>
                        SP2D: <code style={{ fontWeight: 700, color: COLORS.gray800 }}>{selectedDetailMonitoring.noSP2D || "-"}</code>
                      </span>
                      <span style={{ fontSize: 12, color: COLORS.gray600 }}>
                        • Terima: <strong style={{ color: COLORS.gray800 }}>{selectedDetailMonitoring.tglTerimaDana || "-"}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Btn
                      size="sm"
                      variant="outline"
                      onClick={() => openSuratTagihanPreview(selectedDetailMonitoring)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}
                    >
                      <FileText size={14} />
                      Preview Dokumen
                    </Btn>
                    <Btn
                      size="sm"
                      variant={isEditingStatus ? "secondary" : "primary"}
                      onClick={() => setIsEditingStatus(!isEditingStatus)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}
                    >
                      <Edit3 size={14} />
                      {isEditingStatus ? "Batal Update Status" : "Update Status"}
                    </Btn>
                  </div>
                </div>

                {/* Form Perubahan Status Tagihan */}
                {isEditingStatus && (
                  <form
                    onSubmit={handleSaveStatusChange}
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: `1px dashed ${COLORS.gray300}`,
                      background: "#F0F9FF",
                      padding: 16,
                      borderRadius: 8,
                      border: "1px solid #BAE6FD"
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0369A1", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <Edit3 size={15} /> Form Update Status Tagihan
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                          Pilih Status Tagihan <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <select
                          value={statusEditForm.statusTagihan}
                          onChange={(e) => setStatusEditForm({ ...statusEditForm, statusTagihan: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 12,
                            fontWeight: 700,
                            outline: "none",
                            background: COLORS.white,
                            boxSizing: "border-box"
                          }}
                        >
                          <option value="Dana Belum Diterima">Dana Belum Diterima</option>
                          <option value="Dana Diterima">Dana Diterima</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                          Nomor SP2D Kemenkeu
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: SP2D-260918-008925"
                          value={statusEditForm.noSP2D}
                          onChange={(e) => setStatusEditForm({ ...statusEditForm, noSP2D: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 12,
                            outline: "none",
                            background: COLORS.white,
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                          Tanggal Penerimaan Dana
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 20 September 2026"
                          value={statusEditForm.tglTerimaDana}
                          onChange={(e) => setStatusEditForm({ ...statusEditForm, tglTerimaDana: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 12,
                            outline: "none",
                            background: COLORS.white,
                            boxSizing: "border-box"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
                          Catatan Perubahan / Keterangan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Verifikasi SP2D KPPN telah valid dan dana masuk rekening"
                          value={statusEditForm.catatan}
                          onChange={(e) => setStatusEditForm({ ...statusEditForm, catatan: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: `1px solid ${COLORS.gray300}`,
                            fontSize: 12,
                            outline: "none",
                            background: COLORS.white,
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <Btn
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setIsEditingStatus(false)}
                      >
                        Batal
                      </Btn>
                      <Btn
                        type="submit"
                        variant="primary"
                        size="xs"
                        style={{ fontWeight: 700 }}
                      >
                        <Check size={12} style={{ marginRight: 4 }} />
                        Simpan Perubahan Status
                      </Btn>
                    </div>
                  </form>
                )}
              </div>

              {/* 2 Kolom Informasi: Surat & Finansial */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {/* Kolom 1: Administrasi Surat & Pejabat */}
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
                    Informasi Surat Tagihan
                  </div>

                  <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500, width: "38%" }}>Nomor Surat</td>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: COLORS.gray900, fontFamily: "monospace" }}>
                          {selectedDetailMonitoring.noSuratTagihan || selectedDetailMonitoring.noSurat}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Tanggal Terbit</td>
                        <td style={{ padding: "7px 0", fontWeight: 600, color: COLORS.gray800 }}>
                          {selectedDetailMonitoring.tglSuratTagihan || "-"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Program / Dana</td>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: COLORS.blueDark }}>
                          {selectedDetailMonitoring.namaDana || selectedDetailMonitoring.program} ({selectedDetailMonitoring.tarif || selectedDetailMonitoring.kodeTarif || "-"})
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Matra Peserta</td>
                        <td style={{ padding: "7px 0", color: COLORS.gray800 }}>
                          {selectedDetailMonitoring.matraUtama} • <strong>{fmtNum(selectedDetailMonitoring.peserta)}</strong> Jiwa
                        </td>
                      </tr>
                      {selectedDetailMonitoring.noSKP && (
                        <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                          <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Dasar SKP-PFK</td>
                          <td style={{ padding: "7px 0", fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
                            {selectedDetailMonitoring.noSKP} (Tgl: {selectedDetailMonitoring.tglSKP})
                          </td>
                        </tr>
                      )}
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Nama Pejabat</td>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: COLORS.gray900 }}>
                          {selectedDetailMonitoring.namaPejabat || namaPejabat || "Helmi I Satriyo"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Jabatan Pejabat</td>
                        <td style={{ padding: "7px 0", color: COLORS.gray700 }}>
                          {selectedDetailMonitoring.jabatan || jabatan || "Direktur Keuangan dan Manajemen Resiko"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Kolom 2: Realisasi Keuangan & Rekening */}
                <div
                  style={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.gray200}`,
                    borderRadius: 10,
                    padding: "16px 18px"
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={15} color="#059669" />
                    Realisasi Keuangan & Perbankan
                  </div>

                  <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500, width: "38%" }}>Nominal Realisasi</td>
                        <td style={{ padding: "7px 0", fontWeight: 800, color: "#047857", fontSize: 13, fontFamily: "monospace" }}>
                          {fmtB(selectedDetailMonitoring.nominalDanaSKP || selectedDetailMonitoring.nominalTagihan || selectedDetailMonitoring.nominalDiterima)}
                        </td>
                      </tr>
                      {selectedDetailMonitoring.danaTHT > 0 && (
                        <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                          <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Porsi Dana THT</td>
                          <td style={{ padding: "7px 0", fontWeight: 700, color: "#1D4ED8", fontFamily: "monospace" }}>
                            {fmtB(selectedDetailMonitoring.danaTHT)}
                          </td>
                        </tr>
                      )}
                      {selectedDetailMonitoring.danaPensiun > 0 && (
                        <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                          <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Porsi Dana Pensiun</td>
                          <td style={{ padding: "7px 0", fontWeight: 700, color: "#047857", fontFamily: "monospace" }}>
                            {fmtB(selectedDetailMonitoring.danaPensiun)}
                          </td>
                        </tr>
                      )}
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Nomor SP2D</td>
                        <td style={{ padding: "7px 0", fontWeight: 700, color: COLORS.gray800, fontFamily: "monospace" }}>
                          {selectedDetailMonitoring.noSP2D || "-"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Tanggal Penerimaan</td>
                        <td style={{ padding: "7px 0", color: COLORS.gray800 }}>
                          {selectedDetailMonitoring.tglTerimaDana || "-"}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Rekening Penampung</td>
                        <td style={{ padding: "7px 0", color: COLORS.gray800, fontSize: 11.5 }}>
                          {selectedDetailMonitoring.bankTujuan || "Bank Mandiri - Rek. Giro Penampungan Iuran Kemenkeu"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "7px 0", color: COLORS.gray500 }}>Status Monitoring</td>
                        <td style={{ padding: "7px 0", color: COLORS.gray800 }}>
                          <span style={{ padding: "2px 8px", background: "#F1F5F9", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                            {selectedDetailMonitoring.statusProses || "Dalam Monitoring"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Satker List Preview (jika ada) */}
              {selectedDetailMonitoring.satkerList && selectedDetailMonitoring.satkerList.length > 0 && (
                <div
                  style={{
                    background: "#F8FAFC",
                    border: `1px solid ${COLORS.gray200}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Building2 size={18} color={COLORS.gray600} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray800 }}>
                        Distribusi Satuan Kerja (Satker)
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
                        Surat tagihan ini mencakup rincian gaji pokok dan potongan {selectedDetailMonitoring.satkerList.length} Satker Kemhan/TNI/Polri.
                      </div>
                    </div>
                  </div>
                  <Btn
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setSatkerModalData({
                        noSurat: selectedDetailMonitoring.noSuratTagihan || selectedDetailMonitoring.noSurat,
                        noSKP: selectedDetailMonitoring.noSKP || "S-184/PB.2/2026",
                        periode: selectedDetailMonitoring.tglSuratTagihan || "September 2026",
                        program: selectedDetailMonitoring.namaDana || selectedDetailMonitoring.program,
                        danaType: selectedDetailMonitoring.danaType,
                        satkerList: selectedDetailMonitoring.satkerList
                      });
                    }}
                    style={{ fontWeight: 600 }}
                  >
                    Lihat Rincian Satker
                  </Btn>
                </div>
              )}

              {/* Riwayat Perubahan Status (Audit Trail) */}
              <div
                style={{
                  background: COLORS.white,
                  border: `1px solid ${COLORS.gray200}`,
                  borderRadius: 10,
                  padding: "16px 18px"
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={15} color={COLORS.gray600} />
                  Riwayat Perubahan Status (Audit Trail)
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(selectedDetailMonitoring.riwayatStatus && selectedDetailMonitoring.riwayatStatus.length > 0
                    ? selectedDetailMonitoring.riwayatStatus
                    : [
                        {
                          tanggal: selectedDetailMonitoring.tglSuratTagihan || "15 September 2026",
                          status: "Dana Belum Diterima",
                          catatan: "Surat tagihan resmi diterbitkan oleh sistem",
                          user: selectedDetailMonitoring.namaPejabat || namaPejabat || "Helmi I Satriyo"
                        },
                        {
                          tanggal: selectedDetailMonitoring.tglTerimaDana || "18 September 2026",
                          status: selectedDetailMonitoring.statusTagihan || selectedDetailMonitoring.statusDana || "Dana Diterima",
                          catatan: `SP2D diterbitkan (${selectedDetailMonitoring.noSP2D || "-"}) dan dana telah masuk ke rekening giro`,
                          user: "KPPN / Helmi I Satriyo"
                        }
                      ]
                  ).map((hist, idx) => {
                    const hb = getStatusTagihanBadge(hist.status);
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "8px 12px",
                          background: "#F8FAFC",
                          borderRadius: 6,
                          border: `1px solid ${COLORS.gray100}`
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: hb.bg,
                            color: hb.text,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 2
                          }}
                        >
                          {renderStatusIcon(hist.status)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "1px 6px",
                                borderRadius: 4,
                                background: hb.bg,
                                color: hb.text,
                                border: `1px solid ${hb.border}`
                              }}
                            >
                              {hist.status}
                            </span>
                            <span style={{ fontSize: 11, color: COLORS.gray400 }}>
                              {hist.tanggal} • oleh <strong style={{ color: COLORS.gray600 }}>{hist.user}</strong>
                            </span>
                          </div>
                          <div style={{ fontSize: 11.5, color: COLORS.gray700, marginTop: 4 }}>
                            {hist.catatan}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                background: "#F8FAFC"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => openSuratTagihanPreview(selectedDetailMonitoring)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
                >
                  <FileText size={14} />
                  Preview Dokumen
                </Btn>
                <Btn
                  size="sm"
                  variant={isEditingStatus ? "secondary" : "primary"}
                  onClick={() => setIsEditingStatus(!isEditingStatus)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
                >
                  <Edit3 size={14} />
                  {isEditingStatus ? "Batal Update Status" : "Update Status"}
                </Btn>
              </div>

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
      )}
    </div>
  );
};

