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
  ArrowRight
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
  // Tab Navigasi: "form" (Form Penagihan) | "history" (Riwayat Penagihan)
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
  const [dokumenName, setDokumenName] = useState("");

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
    return selectedProgram;
  };

  // Efek sinkronisasi nomor surat, nominal, dan berkas sesuai pilihan Program dan Jenis Iuran
  useEffect(() => {
    if (selectedProgram === "THT_PENSIUN") {
      if (jenisIuranPFK === "THT_TNI") {
        setNoSurat(formatNomorSuratPFK(1190, "IX", 2026));
        setNominal("28540000000"); // Rp 28,54 M
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Kemenkeu_Juli2026_THT_TNI.pdf");
      } else if (jenisIuranPFK === "THT_POLRI") {
        setNoSurat(formatNomorSuratPFK(1191, "IX", 2026));
        setNominal("14225000000"); // Rp 14,225 M
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Kemenkeu_Juli2026_THT_POLRI.pdf");
      } else if (jenisIuranPFK === "PENSIUN_TNI") {
        setNoSurat(formatNomorSuratPFK(1192, "IX", 2026));
        setNominal("41710000000"); // Rp 41,71 M
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Kemenkeu_Juli2026_Pensiun_TNI.pdf");
      } else if (jenisIuranPFK === "PENSIUN_POLRI") {
        setNoSurat(formatNomorSuratPFK(1193, "IX", 2026));
        setNominal("20805000000"); // Rp 20,805 M
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Kemenkeu_Juli2026_Pensiun_POLRI.pdf");
      } else if (jenisIuranPFK === "THT_TNI_SUSULAN") {
        setNoSurat(formatNomorSuratPFK(1196, "IX", 2026));
        setNominal("1450000000"); // Rp 1,45 M
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Susulan_THT_TNI_Juli2026.pdf");
      } else if (jenisIuranPFK === "THT_POLRI_SUSULAN") {
        setNoSurat(formatNomorSuratPFK(1197, "IX", 2026));
        setNominal("820000000"); // Rp 820 Juta
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Susulan_THT_POLRI_Juli2026.pdf");
      } else if (jenisIuranPFK === "PENSIUN_TNI_SUSULAN") {
        setNoSurat(formatNomorSuratPFK(1200, "IX", 2026));
        setNominal("2110000000");
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Susulan_Pensiun_TNI_Juli2026.pdf");
      } else if (jenisIuranPFK === "PENSIUN_POLRI_SUSULAN") {
        setNoSurat(formatNomorSuratPFK(1201, "IX", 2026));
        setNominal("1050000000");
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Susulan_Pensiun_POLRI_Juli2026.pdf");
      } else if (jenisIuranPFK === "THT_TNI_THR") {
        setNoSurat(formatNomorSuratPFK(1198, "IX", 2026));
        setNominal("26800000000");
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Gaji13_THR_THT_TNI_2026.pdf");
      } else if (jenisIuranPFK === "THT_POLRI_THR") {
        setNoSurat(formatNomorSuratPFK(1199, "IX", 2026));
        setNominal("13400000000");
        setDokumenFile(null);
        setDokumenName("SKP-PFK_Gaji13_THR_THT_POLRI_2026.pdf");
      }
    } else if (selectedProgram === "JKK") {
      setNoSurat(formatNomorSuratPFK(1194, "IX", 2026));
      setNominal("2630000000"); // 14.328 peserta x 0,24%
      setDokumenFile(null);
      setDokumenName("Rekap_Iuran_JKK_Juli2026_14328Peserta.pdf");
    } else if (selectedProgram === "JKM") {
      setNoSurat(formatNomorSuratPFK(1195, "IX", 2026));
      setNominal("2210000000"); // 14.328 peserta x 0,20%
      setDokumenFile(null);
      setDokumenName("Rekap_Iuran_JKM_Juli2026_14328Peserta.pdf");
    }
  }, [selectedProgram, jenisIuranPFK]);

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
      noSurat: "1190/KU.06.06/KMR.N/IX/2026",
      program: "THT TNI",
      danaPorsi: "Iuran THT Prajurit TNI & ASN Kemhan (3,25%)",
      matra: "TNI & Kemhan",
      periode: "Juli 2026",
      tglGenerate: "15 Juli 2026",
      acuan: "SKP-PFK Kemenkeu No. S-184/PB.2/2026",
      nominal: "Rp 28.540.000.000",
      nominalNum: 28540000000,
      dokumen: "SKP-PFK_Kemenkeu_Juli2026_THT_TNI.pdf",
      peserta: "266.150",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Juli 2026",
      resiPos: "POS-JKT-20260718-0941",
      skpDetails: {
        noSurat: "S-184/PB.2/2026",
        tglSurat: "14 Juli 2026",
        fileName: "SKP-PFK_Kemenkeu_Juli2026_THT_TNI.pdf",
        nominal: "Rp 28.540.000.000"
      },
      items: [
        { jenis: "Iuran THT (3,25% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 28.540.000.000" }
      ],
      satkerList: SATKER_THT_TNI
    },
    {
      id: "TGH-002",
      noSurat: "1191/KU.06.06/KMR.N/IX/2026",
      program: "THT POLRI",
      danaPorsi: "Iuran THT Anggota POLRI & PNS Polri (3,25%)",
      matra: "POLRI",
      periode: "Juli 2026",
      tglGenerate: "15 Juli 2026",
      acuan: "SKP-PFK Kemenkeu No. S-184/PB.2/2026",
      nominal: "Rp 14.225.000.000",
      nominalNum: 14225000000,
      dokumen: "SKP-PFK_Kemenkeu_Juli2026_THT_POLRI.pdf",
      peserta: "142.200",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Juli 2026",
      resiPos: "POS-JKT-20260718-0942",
      skpDetails: {
        noSurat: "S-184/PB.2/2026",
        tglSurat: "14 Juli 2026",
        fileName: "SKP-PFK_Kemenkeu_Juli2026_THT_POLRI.pdf",
        nominal: "Rp 14.225.000.000"
      },
      items: [
        { jenis: "Iuran THT (3,25% Gaji Pokok Anggota POLRI & PNS Polri)", peserta: "142.200", nominal: "Rp 14.225.000.000" }
      ],
      satkerList: SATKER_THT_POLRI
    },
    {
      id: "TGH-003",
      noSurat: "1192/KU.06.06/KMR.N/IX/2026",
      program: "Pensiun TNI",
      danaPorsi: "Iuran Pensiun Prajurit TNI & ASN Kemhan (4,75%)",
      matra: "TNI & Kemhan",
      periode: "Juli 2026",
      tglGenerate: "15 Juli 2026",
      acuan: "SKP-PFK Kemenkeu No. S-184/PB.2/2026",
      nominal: "Rp 41.710.000.000",
      nominalNum: 41710000000,
      dokumen: "SKP-PFK_Kemenkeu_Juli2026_Pensiun_TNI.pdf",
      peserta: "266.150",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Juli 2026",
      resiPos: "POS-JKT-20260718-0943",
      skpDetails: {
        noSurat: "S-184/PB.2/2026",
        tglSurat: "14 Juli 2026",
        fileName: "SKP-PFK_Kemenkeu_Juli2026_Pensiun_TNI.pdf",
        nominal: "Rp 41.710.000.000"
      },
      items: [
        { jenis: "Iuran Pensiun (4,75% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 41.710.000.000" }
      ],
      satkerList: SATKER_PENSIUN_TNI
    },
    {
      id: "TGH-004",
      noSurat: "1193/KU.06.06/KMR.N/IX/2026",
      program: "Pensiun POLRI",
      danaPorsi: "Iuran Pensiun Anggota POLRI & PNS Polri (4,75%)",
      matra: "POLRI",
      periode: "Juli 2026",
      tglGenerate: "15 Juli 2026",
      acuan: "SKP-PFK Kemenkeu No. S-184/PB.2/2026",
      nominal: "Rp 20.805.000.000",
      nominalNum: 20805000000,
      dokumen: "SKP-PFK_Kemenkeu_Juli2026_Pensiun_POLRI.pdf",
      peserta: "142.200",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Juli 2026",
      resiPos: "POS-JKT-20260718-0944",
      skpDetails: {
        noSurat: "S-184/PB.2/2026",
        tglSurat: "14 Juli 2026",
        fileName: "SKP-PFK_Kemenkeu_Juli2026_Pensiun_POLRI.pdf",
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
      program: "JKK",
      danaPorsi: "Iuran Jaminan Kecelakaan Kerja (0,24%)",
      matra: "TNI, Kemhan & POLRI",
      periode: "Juli 2026",
      tglGenerate: "25 Juli 2026",
      acuan: "Data Kepesertaan (0,24% Basis GP)",
      nominal: "Rp 2.630.000.000",
      nominalNum: 2630000000,
      dokumen: "Rekap_Iuran_JKK_Juli2026.pdf",
      peserta: "14.328",
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      skpDetails: null,
      items: [
        { jenis: "Iuran JKK (0,24% Basis GP + Tunjangan)", peserta: "14.328", nominal: "Rp 2.630.000.000" }
      ]
    },
    {
      id: "TGH-006",
      noSurat: "1195/KU.06.06/KMR.N/IX/2026",
      program: "JKM",
      danaPorsi: "Iuran Jaminan Kematian (0,20%)",
      matra: "TNI, Kemhan & POLRI",
      periode: "Juli 2026",
      tglGenerate: "25 Juli 2026",
      acuan: "Data Kepesertaan (0,20% Basis GP)",
      nominal: "Rp 2.210.000.000",
      nominalNum: 2210000000,
      dokumen: "Rekap_Iuran_JKM_Juli2026.pdf",
      peserta: "14.328",
      status: "Siap Cetak & TTD Manual",
      tglTTD: null,
      resiPos: null,
      skpDetails: null,
      items: [
        { jenis: "Iuran JKM (0,20% Basis GP + Tunjangan)", peserta: "14.328", nominal: "Rp 2.210.000.000" }
      ]
    }
  ]);

  // Handler Generate Single Surat
  const handleGenerate = (e) => {
    e.preventDefault();

    if (!noSurat.trim()) {
      alert("Mohon isi Nomor Surat!");
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      alert("Mohon isi Nominal!");
      return;
    }
    if (!dokumenName) {
      alert("Mohon upload/pilih berkas dokumen terlebih dahulu!");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const nomValue = Number(nominal);
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
        skpDetails = { noSurat: noSurat, tglSurat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), fileName: dokumenName, nominal: formatRupiah(nomValue) };
      } else {
        const rate = selectedProgram === "JKK" ? "0,24%" : "0,20%";
        programName = selectedProgram;
        matraName = "TNI, Kemhan & POLRI";
        porsiKet = `Iuran ${selectedProgram} (${rate})`;
        items = [{ jenis: `Iuran ${selectedProgram} (${rate} Basis Gaji Pokok + Tunjangan)`, peserta: "14.328", nominal: formatRupiah(nomValue) }];
      }

      const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      const newItem = {
        id: `TGH-${Date.now().toString().slice(-4)}`,
        noSurat: noSurat,
        program: programName,
        danaPorsi: porsiKet,
        matra: matraName,
        periode: "Juli 2026",
        tglGenerate: todayStr,
        acuan: skpDetails ? `SKP-PFK Kemenkeu (${programName})` : `Data Kepesertaan (${selectedProgram === "JKK" ? "0,24%" : "0,20%"})`,
        nominal: formatRupiah(nomValue),
        nominalNum: nomValue,
        dokumen: dokumenName,
        peserta: programName.includes("TNI") ? "266.150" : (programName.includes("POLRI") ? "142.200" : "14.328"),
        status: "Siap Cetak & TTD Manual",
        tglTTD: null,
        resiPos: null,
        skpDetails: skpDetails,
        items: items,
        satkerList: satkerList
      };

      setTagihanList((prev) => [newItem, ...prev]);
      setIsGenerating(false);
      setSuccessNotice(`Surat Tagihan ${programName} (${noSurat}) berhasil digenerate! Beralih ke tab 'Riwayat Penagihan'.`);
      setActiveTab("history");
      setTimeout(() => setSuccessNotice(null), 6000);
    }, 600);
  };

  // Handler Generate Sekaligus 4 Surat Dana PFK (Batch)
  const handleGenerateBatch = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      const start = Number(batchStartNo) || 1190;

      const batchLetters = [
        {
          id: `TGH-${Date.now().toString().slice(-4)}-1`,
          noSurat: formatNomorSuratPFK(start, "IX", 2026),
          program: "THT TNI",
          danaPorsi: "Iuran THT Prajurit TNI & ASN Kemhan (3,25%)",
          matra: "TNI & Kemhan",
          periode: "Juli 2026",
          tglGenerate: todayStr,
          acuan: `SKP-PFK Kemenkeu No. ${batchNoSKP}`,
          nominal: "Rp 28.540.000.000",
          nominalNum: 28540000000,
          dokumen: batchDocName,
          peserta: "266.150",
          status: "Siap Cetak & TTD Manual",
          tglTTD: null,
          resiPos: null,
          skpDetails: { noSurat: batchNoSKP, tglSurat: todayStr, fileName: batchDocName, nominal: "Rp 28.540.000.000" },
          items: [{ jenis: "Iuran THT (3,25% Gaji Pokok Prajurit TNI & ASN Kemhan)", peserta: "266.150", nominal: "Rp 28.540.000.000" }],
          satkerList: SATKER_THT_TNI
        },
        {
          id: `TGH-${Date.now().toString().slice(-4)}-2`,
          noSurat: formatNomorSuratPFK(start + 1, "IX", 2026),
          program: "THT POLRI",
          danaPorsi: "Iuran THT Anggota POLRI & PNS Polri (3,25%)",
          matra: "POLRI",
          periode: "Juli 2026",
          tglGenerate: todayStr,
          acuan: `SKP-PFK Kemenkeu No. ${batchNoSKP}`,
          nominal: "Rp 14.225.000.000",
          nominalNum: 14225000000,
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
          noSurat: formatNomorSuratPFK(start + 2, "IX", 2026),
          program: "Pensiun TNI",
          danaPorsi: "Iuran Pensiun Prajurit TNI & ASN Kemhan (4,75%)",
          matra: "TNI & Kemhan",
          periode: "Juli 2026",
          tglGenerate: todayStr,
          acuan: `SKP-PFK Kemenkeu No. ${batchNoSKP}`,
          nominal: "Rp 41.710.000.000",
          nominalNum: 41710000000,
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
          noSurat: formatNomorSuratPFK(start + 3, "IX", 2026),
          program: "Pensiun POLRI",
          danaPorsi: "Iuran Pensiun Anggota POLRI & PNS Polri (4,75%)",
          matra: "POLRI",
          periode: "Juli 2026",
          tglGenerate: todayStr,
          acuan: `SKP-PFK Kemenkeu No. ${batchNoSKP}`,
          nominal: "Rp 20.805.000.000",
          nominalNum: 20805000000,
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

      setTagihanList((prev) => [...batchLetters, ...prev]);
      setIsGenerating(false);
      setSuccessNotice(`Sukses! 4 Surat Tagihan Per-Dana PFK (No. ${start} s.d. ${start + 3}) berhasil digenerate sekaligus dari SKP ${batchNoSKP}!`);
      setActiveTab("history");
      setTimeout(() => setSuccessNotice(null), 6000);
    }, 800);
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

  return (
    <div style={{ width: "100%" }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
      <SatkerModal data={satkerModalData} onClose={() => setSatkerModalData(null)} />

      {/* Bar Navigasi Tab (Form Penagihan vs Riwayat Penagihan) */}
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
                  onChange={(e) => setSelectedProgram(e.target.value)}
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
                  <option value="BATCH_PFK">⚡ Batch Generator: 4 Surat Dana PFK Sekaligus</option>
                </select>
              </div>
            </div>

            {/* JIKA MODE BATCH GENERATE 4 SURAT SEKALIGUS */}
            {selectedProgram === "BATCH_PFK" ? (
              <div style={{ width: "100%", boxSizing: "border-box" }}>
                <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)", borderRadius: 8, border: "1px solid #86EFAC", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Sparkles size={20} color="#059669" />
                    <strong style={{ fontSize: 14, color: "#065F46" }}>Batch Generator: 4 Surat Tagihan Per-Dana Sekaligus</strong>
                  </div>
                  <div style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.6 }}>
                    Fitur ini otomatis menerbitkan <strong>4 Surat Tagihan terpisah</strong> dengan 4 nomor surat berurutan (incremental) berdasarkan 1 dokumen sumber <strong>SKP-PFK Kemenkeu</strong> total Rp 105.280.000.000.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Nomor Dasar SKP-PFK Kemenkeu <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={batchNoSKP}
                      onChange={(e) => setBatchNoSKP(e.target.value)}
                      placeholder="Contoh: S-184/PB.2/2026"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontFamily: "monospace", fontWeight: 700, boxSizing: "border-box" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Nomor Urut Awal Surat (Incremental) <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={batchStartNo}
                      onChange={(e) => setBatchStartNo(e.target.value)}
                      placeholder="Contoh: 1190"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontFamily: "monospace", fontWeight: 700, boxSizing: "border-box" }}
                      required
                    />
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                      Nomor surat akan digenerate otomatis: <code>{formatNomorSuratPFK(batchStartNo, "IX", 2026)}</code> s.d. <code>{formatNomorSuratPFK(Number(batchStartNo) + 3, "IX", 2026)}</code>
                    </div>
                  </div>
                </div>

                {/* Preview 4 Surat yang akan Digenerate */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 8 }}>
                    Rincian 4 Surat yang Akan Diterbitkan:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #BFDBFE", background: "#F0F7FF" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF" }}>1. SURAT TAGIHAN THT TNI</div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900, marginTop: 4 }}>{formatNomorSuratPFK(batchStartNo, "IX", 2026)}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#1D4ED8", marginTop: 4 }}>Rp 28.540.000.000</div>
                      <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>266.150 Peserta • Tarif 3,25%</div>
                    </div>

                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #BFDBFE", background: "#F0F7FF" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF" }}>2. SURAT TAGIHAN THT POLRI</div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900, marginTop: 4 }}>{formatNomorSuratPFK(Number(batchStartNo) + 1, "IX", 2026)}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#1D4ED8", marginTop: 4 }}>Rp 14.225.000.000</div>
                      <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>142.200 Peserta • Tarif 3,25%</div>
                    </div>

                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #D1FAE5", background: "#F0FDF4" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#065F46" }}>3. SURAT TAGIHAN PENSIUN TNI</div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900, marginTop: 4 }}>{formatNomorSuratPFK(Number(batchStartNo) + 2, "IX", 2026)}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginTop: 4 }}>Rp 41.710.000.000</div>
                      <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>266.150 Peserta • Tarif 4,75%</div>
                    </div>

                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #D1FAE5", background: "#F0FDF4" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#065F46" }}>4. SURAT TAGIHAN PENSIUN POLRI</div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900, marginTop: 4 }}>{formatNomorSuratPFK(Number(batchStartNo) + 3, "IX", 2026)}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginTop: 4 }}>Rp 20.805.000.000</div>
                      <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>142.200 Peserta • Tarif 4,75%</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 14 }}>
                  <Btn
                    type="button"
                    onClick={handleGenerateBatch}
                    disabled={isGenerating}
                    style={{
                      background: "#059669",
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700
                    }}
                  >
                    <Sparkles size={15} style={{ marginRight: 6 }} />
                    {isGenerating ? "Memproses Batch..." : "Generate Sekaligus 4 Surat Tagihan Per-Dana"}
                  </Btn>
                </div>
              </div>
            ) : (
              /* FORM SINGLE SURAT TAGIHAN */
              <form onSubmit={handleGenerate} style={{ width: "100%", boxSizing: "border-box" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 16,
                    marginBottom: 16,
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                >
                  {/* FIELD 1: JENIS IURAN (Hanya muncul jika dipilih Dana PFK THT & Pensiun) */}
                  {selectedProgram === "THT_PENSIUN" && (
                    <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                        Jenis Iuran <span style={{ color: "red" }}>*</span>
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
                        <option value="THT_POLRI">THT Polri</option>
                        <option value="THT_TNI">THT TNI</option>
                        <option value="PENSIUN_POLRI">Pensiun Polri</option>
                        <option value="PENSIUN_TNI">Pensiun TNI</option>
                      </select>
                    </div>
                  )}

                  {/* FIELD 2: NOMOR SURAT RESMI */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Nomor Surat Resmi <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={noSurat}
                      onChange={(e) => setNoSurat(e.target.value)}
                      placeholder="Contoh: 1190/KU.06.06/KMR.N/IX/2026"
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
                      Format: <code>[NoUrut]/KU.06.06/KMR.N/[BulanRomawi]/[Tahun]</code>
                    </div>
                  </div>

                  {/* FIELD 3: NOMINAL */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Nominal Tagihan ({getProgramDisplayName()}) <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                      placeholder="Masukkan nominal tagihan"
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
                    <div style={{ fontSize: 11, color: COLORS.blue, marginTop: 4 }}>
                      Terbilang: <strong>{formatRupiah(Number(nominal))}</strong>
                    </div>
                  </div>

                  {/* FIELD 4: DOKUMEN LAMPIRAN */}
                  <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                      Dokumen Lampiran / Dasar Surat <span style={{ color: "red" }}>*</span>
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
                          title={dokumenName || "Pilih / Upload Dokumen (PDF)"}
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
                            {dokumenName || "Pilih / Upload Berkas (PDF)"}
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
                </div>

                {/* Tombol Generate Tagihan */}
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 14 }}>
                  <Btn
                    type="submit"
                    disabled={isGenerating}
                    style={{
                      background: COLORS.blue,
                      padding: "10px 24px",
                      fontSize: 13,
                      fontWeight: 700
                    }}
                  >
                    {isGenerating ? "Memproses..." : `Generate Surat Tagihan ${getProgramDisplayName()}`}
                  </Btn>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RIWAYAT PENAGIHAN
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
                <option value="JKK">JKK (0,24%)</option>
                <option value="JKM">JKM (0,20%)</option>
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
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal Tagihan</th>
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Dokumen</th>
                  <th style={{ padding: "9px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedTagihan.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                      Belum ada surat tagihan pada filter ini.
                    </td>
                  </tr>
                ) : (
                  displayedTagihan.map((t) => {
                    const isSigned = t.status.includes("Sudah Ditandatangani");
                    const isTNI = t.program.includes("TNI");
                    const isPolri = t.program.includes("POLRI");

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

                        <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, fontFamily: "monospace", color: COLORS.blueDark, fontSize: 13 }}>
                          {t.nominal}
                        </td>

                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: isSigned ? "#10B981" : "#F59E0B"
                              }}
                            />
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: isSigned ? "#065F46" : "#92400E" }}>
                              {isSigned ? "Sudah TTD & Dikirim" : "Siap Cetak & TTD"}
                            </span>
                          </div>
                          {t.resiPos && (
                            <div style={{ fontSize: 10, color: COLORS.gray500, marginTop: 2, fontFamily: "monospace" }}>
                              Resi: {t.resiPos}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
                            {t.satkerList && (
                              <button
                                onClick={() =>
                                  setSatkerModalData({
                                    noSurat: t.noSurat,
                                    noSKP: t.skpDetails?.noSurat || t.acuan,
                                    periode: t.periode,
                                    program: t.program,
                                    satkerList: t.satkerList
                                  })
                                }
                                title="Lihat rincian per masing-masing Satker"
                                style={{
                                  padding: "4px 9px",
                                  borderRadius: 4,
                                  border: `1px solid #BFDBFE`,
                                  background: "#EFF6FF",
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#1E40AF",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4
                                }}
                              >
                                <Building2 size={12} color="#1D4ED8" />
                                Satker
                              </button>
                            )}

                            <button
                              onClick={() =>
                                setPreview({
                                  title: `Surat Tagihan — ${t.program}`,
                                  subtitle: `${t.noSurat} • Periode ${t.periode}`,
                                  type: "surat",
                                  fileName: `Surat_Tagihan_${t.program.replace(/\s+/g, "_")}_${t.periode.replace(" ", "_")}.pdf`,
                                  content: {
                                    noSurat: t.noSurat,
                                    periode: t.periode,
                                    program: t.program,
                                    items: t.items,
                                    totalNominal: t.nominal,
                                    satkerList: t.satkerList,
                                    dasarSKP: t.skpDetails ? { noSurat: t.skpDetails.noSurat, tglSurat: t.skpDetails.tglSurat } : null
                                  }
                                })
                              }
                              style={{
                                padding: "4px 8px",
                                borderRadius: 4,
                                border: `1px solid ${COLORS.gray300}`,
                                background: COLORS.white,
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 600,
                                color: COLORS.gray700
                              }}
                            >
                              Preview / Cetak
                            </button>

                            {!isSigned && (
                              <button
                                onClick={() => handleMarkAsSigned(t.id)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 4,
                                  border: "none",
                                  background: "#10B981",
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: COLORS.white
                                }}
                              >
                                Tandai TTD
                              </button>
                            )}
                          </div>
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
    </div>
  );
};

