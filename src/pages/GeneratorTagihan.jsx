import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Printer,
  ExternalLink,
  FileText,
  UploadCloud,
  Clock,
  Building2
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Btn, PreviewModal, SatkerModal } from "../components/common";
import { SATKER_THT_PENSIUN_ALL, generateProportionalSatkerList } from "../constants/satkerData";

export const GeneratorTagihan = () => {
  // Tab Navigasi: "form" (Form Penagihan) | "history" (Riwayat Penagihan)
  const [activeTab, setActiveTab] = useState("form");

  // Pilihan Jenis Program Penagihan melalui Dropdown:
  // THT dan Pensiun adalah 1 Tagihan Terpadu, JKK, JKM
  const [selectedProgram, setSelectedProgram] = useState("THT_PENSIUN"); // "THT_PENSIUN" | "JKK" | "JKM"

  // 3 Field Utama yang Sama untuk Semua Program:
  // 1. Nomor Surat
  // 2. Nominal
  // 3. Dokumen (Upload / Tergenerate)
  const [noSurat, setNoSurat] = useState("");
  const [nominal, setNominal] = useState("");
  const [dokumenFile, setDokumenFile] = useState(null);
  const [dokumenName, setDokumenName] = useState("");

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

  // Efek ganti dropdown:
  // - Jika THT_PENSIUN: semua field KOSONG (menunggu input manual dari berkas SKP-PFK Kemenkeu)
  // - Jika JKK / JKM: field AUTOFILL dengan nomor surat terbaru, dokumen rekap, dan nominal sesuai data kepesertaan
  useEffect(() => {
    if (selectedProgram === "THT_PENSIUN") {
      setNoSurat("");
      setNominal("");
      setDokumenFile(null);
      setDokumenName("");
    } else if (selectedProgram === "JKK") {
      setNoSurat("003/ASABRI/TGH-JKK/VII/2026");
      setNominal("2630000000"); // 14.328 peserta x 0,24%
      setDokumenFile(null);
      setDokumenName("Rekap_Iuran_JKK_Juli2026_14328Peserta.pdf");
    } else if (selectedProgram === "JKM") {
      setNoSurat("004/ASABRI/TGH-JKM/VII/2026");
      setNominal("2210000000"); // 14.328 peserta x 0,20%
      setDokumenFile(null);
      setDokumenName("Rekap_Iuran_JKM_Juli2026_14328Peserta.pdf");
    }
  }, [selectedProgram]);

  // Handler Upload Dokumen
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDokumenFile(file);
      setDokumenName(file.name);
    }
  };

  // Daftar Riwayat Tagihan (THT dan Pensiun merupakan 1 Surat Tagihan dengan 1 Nomor Surat mencakup seluruh Satker)
  const [tagihanList, setTagihanList] = useState([
    {
      id: "TGH-001",
      noSurat: "001/ASABRI/TGH-THT-PEN/VII/2026",
      program: "THT & Pensiun",
      periode: "Juli 2026",
      tglGenerate: "15 Juli 2026",
      acuan: "SKP-PFK Kemenkeu No. S-184/PB.2/2026 (1 Surat Tagihan Resmi)",
      nominal: "Rp 105.280.000.000",
      nominalNum: 105280000000,
      dokumen: "SKP-PFK_Kemenkeu_Juli2026_Termin1.pdf",
      peserta: "408.350",
      status: "Sudah Ditandatangani Manual & Dikirim",
      tglTTD: "17 Juli 2026",
      resiPos: "POS-JKT-20260718-0941",
      skpDetails: {
        noSurat: "S-184/PB.2/2026",
        tglSurat: "14 Juli 2026",
        fileName: "SKP-PFK_Kemenkeu_Juli2026_Termin1.pdf",
        nominal: "Rp 105.280.000.000"
      },
      items: [
        { jenis: "Iuran THT (3,25% - Sesuai SKP-PFK Kemenkeu)", peserta: "408.350", nominal: "Rp 42.765.000.000" },
        { jenis: "Iuran Pensiun (4,75% - Sesuai SKP-PFK Kemenkeu)", peserta: "408.350", nominal: "Rp 62.515.000.000" }
      ],
      satkerList: SATKER_THT_PENSIUN_ALL
    },
    {
      id: "TGH-002",
      noSurat: "002/ASABRI/TGH-JKK/VII/2026",
      program: "JKK",
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
      id: "TGH-003",
      noSurat: "003/ASABRI/TGH-JKM/VII/2026",
      program: "JKM",
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

  // Handler Klik Generate Surat Tagihan
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
      const isTHTPensiun = selectedProgram === "THT_PENSIUN";

      let items = [];
      let skpDetails = null;
      let satkerList = null;
      let programName = selectedProgram;

      if (isTHTPensiun) {
        programName = "THT & Pensiun";
        const nomTHT = Math.round(nomValue * (3.25 / 8.0));
        const nomPensiun = nomValue - nomTHT;
        items = [
          { jenis: "Iuran THT (3,25% - Sesuai SKP-PFK)", peserta: "266.150", nominal: formatRupiah(nomTHT) },
          { jenis: "Iuran Pensiun (4,75% - Sesuai SKP-PFK)", peserta: "266.150", nominal: formatRupiah(nomPensiun) }
        ];
        skpDetails = {
          noSurat: noSurat,
          tglSurat: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          fileName: dokumenName,
          nominal: formatRupiah(nomValue)
        };
        satkerList = generateProportionalSatkerList(nomValue, SATKER_THT_PENSIUN_TNI);
      } else {
        const rate = selectedProgram === "JKK" ? "0,24%" : "0,20%";
        items = [
          { jenis: `Iuran ${selectedProgram} (${rate} Basis Gaji Pokok + Tunjangan)`, peserta: "14.328", nominal: formatRupiah(nomValue) }
        ];
      }

      const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      const newItem = {
        id: `TGH-${Date.now().toString().slice(-4)}`,
        noSurat: noSurat,
        program: programName,
        periode: "Juli 2026",
        tglGenerate: todayStr,
        acuan: isTHTPensiun ? `SKP-PFK Kemenkeu No. ${noSurat} (1 Tagihan Terpadu)` : `Data Kepesertaan (${selectedProgram === "JKK" ? "0,24%" : "0,20%"})`,
        nominal: formatRupiah(nomValue),
        nominalNum: nomValue,
        dokumen: dokumenName,
        peserta: isTHTPensiun ? "266.150" : "14.328",
        status: "Siap Cetak & TTD Manual",
        tglTTD: null,
        resiPos: null,
        skpDetails: skpDetails,
        items: items,
        satkerList: satkerList
      };

      setTagihanList((prev) => [newItem, ...prev]);
      setIsGenerating(false);
      setSuccessNotice(`Surat Tagihan ${programName} (${noSurat}) berhasil digenerate dalam 1 Tagihan Terpadu! Beralih ke tab 'Riwayat Penagihan'.`);
      setActiveTab("history"); // Otomatis membuka tab riwayat penagihan
      setTimeout(() => setSuccessNotice(null), 6000);
    }, 700);
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
    setSuccessNotice(`Tagihan ${id} telah ditandai selesai ditandatangani basah dan dikirim ke Kemenkeu.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  // Filter Tabel Tagihan
  const [filterTable, setFilterTable] = useState("Semua");
  const displayedTagihan = tagihanList.filter((t) => {
    if (filterTable === "Semua") return true;
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
          Form Penagihan
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
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                Pilih Jenis Penagihan Iuran:
              </label>
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
                <option value="THT_PENSIUN">THT & Pensiun (1 Tagihan Terpadu SKP-PFK)</option>
                <option value="JKK">JKK (Jaminan Kecelakaan Kerja)</option>
                <option value="JKM">JKM (Jaminan Kematian)</option>
              </select>
            </div>

            <form onSubmit={handleGenerate} style={{ width: "100%", boxSizing: "border-box" }}>
              {/* Row 1: Nomor Surat & Nominal */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 16,
                  marginBottom: 16,
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                {/* FIELD 1: NOMOR SURAT */}
                <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                    1. Nomor Surat {selectedProgram === "THT_PENSIUN" ? "SKP-PFK Kemenkeu / Tagihan THT & Pensiun" : "Tagihan ASABRI"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={noSurat}
                    readOnly={selectedProgram !== "THT_PENSIUN"}
                    tabIndex={selectedProgram !== "THT_PENSIUN" ? -1 : 0}
                    onChange={(e) => setNoSurat(e.target.value)}
                    placeholder={selectedProgram === "THT_PENSIUN" ? "Contoh: S-184/PB.2/2026 atau 001/ASABRI/TGH-THT-PEN/VII/2026" : "Nomor Surat Tagihan"}
                    title={selectedProgram !== "THT_PENSIUN" ? "Field terisi otomatis dan tidak dapat diubah" : undefined}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: `1px solid ${selectedProgram !== "THT_PENSIUN" ? "#CBD5E1" : COLORS.gray300}`,
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: 600,
                      boxSizing: "border-box",
                      background: selectedProgram !== "THT_PENSIUN" ? "#F1F5F9" : COLORS.white,
                      color: selectedProgram !== "THT_PENSIUN" ? COLORS.gray600 : COLORS.gray900,
                      cursor: selectedProgram !== "THT_PENSIUN" ? "not-allowed" : "text",
                      boxShadow: selectedProgram !== "THT_PENSIUN" ? "inset 0 1px 2px rgba(0,0,0,0.03)" : "none",
                      outline: "none"
                    }}
                    required
                  />
                </div>

                {/* FIELD 2: NOMINAL */}
                <div style={{ minWidth: 0, boxSizing: "border-box" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                    2. Nominal {selectedProgram === "THT_PENSIUN" ? "Tagihan THT & Pensiun (Rp)" : "Tagihan Iuran (Rp)"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={nominal}
                    readOnly={selectedProgram !== "THT_PENSIUN"}
                    tabIndex={selectedProgram !== "THT_PENSIUN" ? -1 : 0}
                    onChange={(e) => setNominal(e.target.value)}
                    placeholder="Masukkan total nominal tagihan gabungan"
                    title={selectedProgram !== "THT_PENSIUN" ? "Field dihitung otomatis dan tidak dapat diubah" : undefined}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: `1px solid ${selectedProgram !== "THT_PENSIUN" ? "#CBD5E1" : COLORS.gray300}`,
                      fontSize: 13.5,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: selectedProgram !== "THT_PENSIUN" ? "#334155" : "#1E40AF",
                      boxSizing: "border-box",
                      background: selectedProgram !== "THT_PENSIUN" ? "#F1F5F9" : COLORS.white,
                      cursor: selectedProgram !== "THT_PENSIUN" ? "not-allowed" : "text",
                      boxShadow: selectedProgram !== "THT_PENSIUN" ? "inset 0 1px 2px rgba(0,0,0,0.03)" : "none",
                      outline: "none"
                    }}
                    required
                  />
                  {selectedProgram === "THT_PENSIUN" && (
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                      💡 1 Dokumen Tagihan Terpadu mencakup porsi Dana THT (3,25%) dan Dana Pensiun (4,75%) dengan rincian per Satker.
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: 3. Dokumen Surat (Upload / Berkas Lampiran) */}
              <div style={{ marginBottom: 20, width: "100%", boxSizing: "border-box" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                  3. Dokumen Surat (Upload / Berkas Lampiran) <span style={{ color: "red" }}>*</span>
                </label>

                <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                  <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                    <input
                      type="file"
                      id="fileUpload"
                      disabled={selectedProgram !== "THT"}
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor={selectedProgram === "THT" ? "fileUpload" : undefined}
                      title={selectedProgram !== "THT" ? "Dokumen terlampir otomatis dari sistem dan tidak dapat diubah" : (dokumenName || "Pilih / Upload Dokumen (PDF)")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 12px",
                        borderRadius: 6,
                        border: selectedProgram !== "THT" ? "1px solid #CBD5E1" : `1px dashed ${dokumenName ? COLORS.blue : COLORS.gray300}`,
                        background: selectedProgram !== "THT" ? "#F1F5F9" : (dokumenName ? "#F0F7FF" : "#F8FAFC"),
                        cursor: selectedProgram !== "THT" ? "not-allowed" : "pointer",
                        fontSize: 12,
                        color: selectedProgram !== "THT" ? COLORS.gray600 : (dokumenName ? COLORS.blueDark : COLORS.gray600),
                        boxShadow: selectedProgram !== "THT" ? "inset 0 1px 2px rgba(0,0,0,0.03)" : "none",
                        boxSizing: "border-box",
                        width: "100%",
                        minWidth: 0,
                        overflow: "hidden"
                      }}
                    >
                      <UploadCloud size={16} style={{ flexShrink: 0, opacity: selectedProgram !== "THT" ? 0.6 : 1 }} />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                          minWidth: 0
                        }}
                        title={dokumenName || "Pilih / Upload Dokumen (PDF)"}
                      >
                        {dokumenName || "Pilih / Upload Dokumen (PDF)"}
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
                          subtitle: `Lampiran ${selectedProgram} • Periode Juli 2026`,
                          type: selectedProgram === "THT" ? "skp" : "surat",
                          fileName: dokumenName,
                          content: {
                            noSurat: noSurat || (selectedProgram === "THT" ? "S-215/PB.2/2026" : "003/ASABRI/TGH/VII/2026"),
                            periode: "Juli 2026",
                            nominal: formatRupiah(Number(nominal) || 0),
                            fileName: dokumenName,
                            batchInfo: `${selectedProgram} — Berkas Lampiran`
                          }
                        });
                      }}
                      style={{ padding: "9px 14px", whiteSpace: "nowrap", flexShrink: 0 }}
                    >
                      <ExternalLink size={13} style={{ marginRight: 4 }} />
                      Lihat Dokumen
                    </Btn>
                  )}
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
                  {isGenerating ? "Memproses..." : `Generate Surat Tagihan ${selectedProgram === "THT_PENSIUN" ? "THT & Pensiun" : selectedProgram}`}
                </Btn>
              </div>
            </form>
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
                Daftar & Riwayat Surat Tagihan Iuran
              </div>
              <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                Dokumen siap dicetak fisik untuk tanda tangan manual basah oleh Kepala Divisi Keuangan.
              </div>
            </div>

            {/* Filter Dropdown Program */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>Filter Program:</label>
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
                <option value="Semua">Semua Program</option>
                <option value="THT & Pensiun">THT & Pensiun (1 Tagihan)</option>
                <option value="JKK">JKK (Jaminan Kecelakaan Kerja)</option>
                <option value="JKM">JKM (Jaminan Kematian)</option>
              </select>
            </div>
          </div>

          {/* Tabel Riwayat Data */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: COLORS.gray600, textAlign: "left" }}>
                  <th style={{ padding: "9px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>No. Surat</th>
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Program</th>
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Dokumen Terlampir</th>
                  <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Nominal</th>
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

                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ fontWeight: 700, color: COLORS.gray900, fontFamily: "monospace" }}>
                            {t.noSurat}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>
                            Periode {t.periode} • Terbit: {t.tglGenerate}
                          </div>
                        </td>

                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 700, color: COLORS.gray800 }}>{t.program}</div>
                        </td>

                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ color: COLORS.gray700, fontFamily: "monospace", fontSize: 11 }}>
                            📄 {t.dokumen}
                          </div>
                          <button
                            onClick={() =>
                              setPreview({
                                title: `Dokumen: ${t.dokumen}`,
                                subtitle: `${t.noSurat} • Periode ${t.periode}`,
                                type: t.program === "THT" ? "skp" : "surat",
                                fileName: t.dokumen,
                                content: {
                                  noSurat: t.noSurat,
                                  periode: t.periode,
                                  nominal: t.nominal,
                                  fileName: t.dokumen
                                }
                              })
                            }
                            style={{
                              border: "none",
                              background: "none",
                              padding: 0,
                              color: COLORS.blue,
                              fontSize: 11,
                              cursor: "pointer",
                              textDecoration: "underline",
                              marginTop: 2
                            }}
                          >
                            Lihat Berkas
                          </button>
                        </td>

                        <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, fontFamily: "monospace", color: COLORS.blueDark }}>
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
                              {isSigned ? "Sudah TTD Manual & Dikirim" : "Siap Cetak & TTD Manual"}
                            </span>
                          </div>
                          {t.resiPos && (
                            <div style={{ fontSize: 10, color: COLORS.gray500, marginTop: 2 }}>
                              Resi Pos: {t.resiPos}
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
                                title="Lihat rincian Dana THT dan Pensiun per masing-masing Satker"
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
                                Rincian Satker
                              </button>
                            )}

                            <button
                              onClick={() =>
                                setPreview({
                                  title: `Surat Tagihan ${t.program}`,
                                  subtitle: `${t.noSurat} • Periode ${t.periode}`,
                                  type: "surat",
                                  fileName: `Surat_Tagihan_${t.program.replace(/\s+/g, "_")}_${t.periode.replace(" ", "_")}.pdf`,
                                  content: {
                                    noSurat: t.noSurat,
                                    periode: t.periode,
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
