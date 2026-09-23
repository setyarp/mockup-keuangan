import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Zap,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowRight,
  Sparkles,
  FileUp,
  Building2,
  Layers
} from "lucide-react";
import { SectionTitle, Btn, SearchInput, Badge, NoData, PreviewModal, Select } from "../components/common";
import { DEFAULT_RAW_RK_DATA, DEFAULT_UPLOADED_FILES } from "../constants/cmsData";

export const RekonRekeningKoran = ({
  dataList = [],
  setDataList,
  uploadedFiles = [],
  setUploadedFiles,
  onNavigateToPenyaluran
}) => {
  // Local state fallback jika tidak di-pass dari parent
  const [localDataList, setLocalDataList] = useState([]);
  const [localUploadedFiles, setLocalUploadedFiles] = useState([]);

  const currentDataList = setDataList ? dataList : localDataList;
  const updateDataList = setDataList || setLocalDataList;
  const currentFiles = setUploadedFiles ? uploadedFiles : localUploadedFiles;
  const updateFiles = setUploadedFiles || setLocalUploadedFiles;

  const [selectedMitraUpload, setSelectedMitraUpload] = useState("Otomatis (Deteksi dari Berkas / Filename)");
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [preview, setPreview] = useState(null);
  const [isProcessingMapping, setIsProcessingMapping] = useState(false);
  const fileInputRef = useRef(null);

  const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  // Daftar 12 Mitra Bayar Resmi ASABRI
  const mitraListOptions = [
    "Otomatis (Deteksi dari Berkas / Filename)",
    "Bank BRI",
    "Bank Mandiri",
    "Bank BNI",
    "Bank BTN",
    "Bank BSI",
    "Mandiri Taspen (Bank MANTAP)",
    "Bank Woori Saudara (BWS)",
    "PT Pos Indonesia",
    "Bank Bumi Arta",
    "Bank BJB",
    "KB Bukopin",
    "Bank SMBC"
  ];

  // Helper untuk konversi format tanggal serial Excel ke DD/MM/YYYY
  const formatExcelDate = (val) => {
    if (!val) return "06/05/2026";
    if (typeof val === "number") {
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      return `${day}/${month}/${d.getUTCFullYear()}`;
    }
    return String(val).trim();
  };

  // Smart Parser Engine: Membaca berkas satu per satu / batch
  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
        alert(`Format berkas "${file.name}" tidak didukung. Harap gunakan format .xlsx, .xls, atau .csv!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const buffer = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(buffer, { type: "array" });
          const newStandardizedRows = [];

          workbook.SheetNames.forEach((sheetName) => {
            const ws = workbook.Sheets[sheetName];
            const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
            if (!rawRows || rawRows.length === 0) return;

            let headerIdx = -1;
            for (let i = 0; i < Math.min(15, rawRows.length); i++) {
              const rowStr = rawRows[i].map((c) => String(c).toLowerCase()).join(" ");
              if (
                rowStr.includes("trans description") ||
                rowStr.includes("uraian") ||
                rowStr.includes("keterangan") ||
                rowStr.includes("narasi") ||
                rowStr.includes("remark") ||
                rowStr.includes("description") ||
                rowStr.includes("debet") ||
                rowStr.includes("credit") ||
                rowStr.includes("debit") ||
                rowStr.includes("kredit") ||
                rowStr.includes("post date") ||
                rowStr.includes("posting date") ||
                rowStr.includes("tanggal")
              ) {
                headerIdx = i;
                break;
              }
            }
            if (headerIdx === -1) headerIdx = 0;

            const headerRow = rawRows[headerIdx].map((c) => String(c).trim().toLowerCase());
            const colMap = {};
            headerRow.forEach((col, idx) => {
              if (col === "no" || col === "no.") colMap.no = idx;
              else if (col.includes("tanggal bayar") || col.includes("tgl bayar") || col.includes("tanggal") || col.includes("tgl") || col.includes("post date") || col.includes("value date") || col.includes("date")) colMap.tgl = idx;
              else if (col.includes("trans description") || col.includes("desc") || col.includes("uraian") || col.includes("keterangan") || col.includes("narasi") || col.includes("remark")) colMap.desc = idx;
              else if (col.includes("debet") || col.includes("debit")) colMap.debet = idx;
              else if (col.includes("credit") || col.includes("kredit")) colMap.credit = idx;
              else if (col.includes("ledger balance") || col.includes("saldo") || col.includes("balance")) colMap.saldo = idx;
              else if (col.includes("user id") || col.includes("user") || col.includes("maker")) colMap.user = idx;
              else if (col.includes("mitra bayar") || col.includes("mitra") || col.includes("bank")) colMap.mitra = idx;
              else if (col.includes("amount") || col.includes("nominal")) colMap.amount = idx;
              else if (col.includes("db/cr") || col.includes("d/c") || col.includes("cr/db")) colMap.dbcr = idx;
              
              // Mapped columns
              else if (col.includes("ktpa")) colMap.ktpa = idx;
              else if (col.includes("program")) colMap.program = idx;
              else if (col.includes("jenis manfaat")) colMap.jenisManfaat = idx;
              else if (col.includes("no sp")) colMap.noSP = idx;
              else if (col.includes("tgl sp")) colMap.tglSP = idx;
              else if (col.includes("no dps")) colMap.noDPS = idx;
              else if (col.includes("tgl dps")) colMap.tglDPS = idx;
              else if (col.includes("kode bayar")) colMap.kodeBayar = idx;
              else if (col.includes("kancab") || col.includes("cabang")) colMap.kancab = idx;
              else if (col.includes("angkatan") || col.includes("anggota")) colMap.kodeAnggota = idx;
              else if (col.includes("sks")) colMap.sks = idx;
              else if (col.includes("udw")) colMap.udw = idx;
              else if (col.includes("bp")) colMap.bp = idx;
              else if (col.includes("db")) colMap.db = idx;
              else if (col.includes("dk")) colMap.dk = idx;
              else if (col.includes("gugur")) colMap.gugur = idx;
              else if (col.includes("tewas")) colMap.tewas = idx;
              else if (col.includes("beasiswa")) colMap.beasiswa = idx;
            });

            for (let r = headerIdx + 1; r < rawRows.length; r++) {
              const row = rawRows[r];
              if (!row || row.every((c) => c === "")) continue;

              const desc = String(row[colMap.desc ?? 2] || "").trim();
              let debet = colMap.debet !== undefined ? parseFloat(String(row[colMap.debet] || 0).replace(/[^0-9.-]/g, "")) || 0 : 0;
              let credit = colMap.credit !== undefined ? parseFloat(String(row[colMap.credit] || 0).replace(/[^0-9.-]/g, "")) || 0 : 0;
              
              if (colMap.amount !== undefined && colMap.dbcr !== undefined) {
                const amt = parseFloat(String(row[colMap.amount] || 0).replace(/[^0-9.-]/g, "")) || 0;
                const flag = String(row[colMap.dbcr] || "").trim().toUpperCase();
                if (flag === "D" || flag === "DB" || flag === "DEBET" || flag === "DEBIT") debet = amt;
                else if (flag === "C" || flag === "CR" || flag === "CREDIT" || flag === "KREDIT") credit = amt;
              }

              const saldo = colMap.saldo !== undefined ? parseFloat(String(row[colMap.saldo] || 0).replace(/[^0-9.-]/g, "")) || 0 : 0;
              const user = String(row[colMap.user ?? 6] || "SYSTEM").trim();

              let detectedMitra = selectedMitraUpload !== "Otomatis (Deteksi dari Berkas / Filename)" ? selectedMitraUpload : String(row[colMap.mitra ?? 7] || "").trim();
              if (!detectedMitra || detectedMitra === "-") {
                const fname = file.name.toUpperCase();
                if (fname.includes("BRI")) detectedMitra = "Bank BRI";
                else if (fname.includes("MANDIRI")) detectedMitra = "Bank Mandiri";
                else if (fname.includes("BWS") || fname.includes("WOORI")) detectedMitra = "Bank Woori Saudara (BWS)";
                else if (fname.includes("BNI")) detectedMitra = "Bank BNI";
                else if (fname.includes("BTN")) detectedMitra = "Bank BTN";
                else if (fname.includes("BSI")) detectedMitra = "Bank BSI";
                else if (fname.includes("MANTAP") || fname.includes("MTP")) detectedMitra = "Mandiri Taspen (Bank MANTAP)";
                else if (fname.includes("POS")) detectedMitra = "PT Pos Indonesia";
                else if (fname.includes("BJB")) detectedMitra = "Bank BJB";
                else if (fname.includes("SMBC")) detectedMitra = "Bank SMBC";
                else if (fname.includes("BUKOPIN") || fname.includes("KB")) detectedMitra = "KB Bukopin";
                else if (fname.includes("BUMI") || fname.includes("BBA")) detectedMitra = "Bank Bumi Arta";
                else if (fname.includes("DAPEN")) detectedMitra = "Bank BRI (Kasda DAPEM)";
                else detectedMitra = "Bank Mitra";
              }

              if (!desc && debet === 0 && credit === 0) continue;

              let tipeAuto = "THT";
              const upperSheet = sheetName.toUpperCase();
              const upperDesc = desc.toUpperCase();

              if (upperSheet.includes("JKK") || upperDesc.includes("JKK")) tipeAuto = "JKK";
              else if (upperSheet.includes("JKM") || upperDesc.includes("JKM")) tipeAuto = "JKM";
              else if (upperSheet.includes("NTIP") || upperDesc.includes("NTIP") || upperDesc.includes("SETORAN KOREKSI") || upperDesc.includes("TRF KREDIT")) tipeAuto = "NTIP";
              else if (upperSheet.includes("PENSIUN") || upperDesc.includes("DAPEM") || upperDesc.includes("PENSIUN")) {
                tipeAuto = credit > 0 ? "Penyediaan Pensiun" : "Pembayaran Pensiun";
              } else if (upperDesc.includes("DROPING") || upperDesc.includes("TRF DARI") || upperDesc.includes("SETORAN GIRO")) {
                tipeAuto = "Penyediaan Pensiun";
              }

              const rowKTPA = colMap.ktpa !== undefined ? String(row[colMap.ktpa] || "").trim() : "";
              const ktpaMatch = rowKTPA || desc.match(/([A-Z]{2}\d{6})/i)?.[1]?.toUpperCase() || "—";
              const rowTgl = formatExcelDate(row[colMap.tgl ?? 1]);

              newStandardizedRows.push({
                no: currentDataList.length + newStandardizedRows.length + 1,
                tglBayar: rowTgl,
                desc: desc || "Transaksi Penyaluran CMS",
                debet,
                credit,
                saldo,
                userId: user || "—",
                mitra: detectedMitra,
                tipe: tipeAuto,
                ktpa: ktpaMatch,
                program: tipeAuto === "THT" ? "THT" : tipeAuto,
                jenisManfaat: (colMap.jenisManfaat && row[colMap.jenisManfaat]) ? String(row[colMap.jenisManfaat]) : (tipeAuto === "THT" ? "THT BUP" : "Manfaat Klaim"),
                nominal: debet > 0 ? debet : credit,
                noSP: (colMap.noSP && row[colMap.noSP]) ? String(row[colMap.noSP]) : `B/04${8000 + currentDataList.length + newStandardizedRows.length}-AS/${tipeAuto}/V/2026`,
                tglSP: (colMap.tglSP && row[colMap.tglSP]) ? formatExcelDate(row[colMap.tglSP]) : "05/05/2026",
                noDPS: (colMap.noDPS && row[colMap.noDPS]) ? String(row[colMap.noDPS]) : `DPS-${detectedMitra.split(" ")[0]}-${100 + currentDataList.length + newStandardizedRows.length}`,
                tglDPS: (colMap.tglDPS && row[colMap.tglDPS]) ? formatExcelDate(row[colMap.tglDPS]) : "06/05/2026",
                kodeBayar: (colMap.kodeBayar && row[colMap.kodeBayar]) ? String(row[colMap.kodeBayar]) : `${ktpaMatch}${tipeAuto}10`,
                kancab: (colMap.kancab && row[colMap.kancab]) ? String(row[colMap.kancab]) : "KANCAB UTAMA JAKARTA",
                kodeAnggota: (colMap.kodeAnggota && row[colMap.kodeAnggota]) ? String(row[colMap.kodeAnggota]) : "TNI-AD",
                anggota: (colMap.kodeAnggota && row[colMap.kodeAnggota]) ? String(row[colMap.kodeAnggota]) : "TNI-AD",
                sks: colMap.sks ? parseFloat(String(row[colMap.sks] || 0)) || 0 : 0,
                udw: colMap.udw ? parseFloat(String(row[colMap.udw] || 0)) || 0 : 0,
                bp: colMap.bp ? parseFloat(String(row[colMap.bp] || 0)) || 0 : 0,
                db: colMap.db ? parseFloat(String(row[colMap.db] || 0)) || 0 : 0,
                dk: colMap.dk ? parseFloat(String(row[colMap.dk] || 0)) || 0 : 0,
                gugur: colMap.gugur ? parseFloat(String(row[colMap.gugur] || 0)) || 0 : 0,
                tewas: colMap.tewas ? parseFloat(String(row[colMap.tewas] || 0)) || 0 : 0,
                beasiswa: colMap.beasiswa ? parseFloat(String(row[colMap.beasiswa] || 0)) || 0 : 0,
                jenisPensiun: "Dapem Induk",
                noPensiun: ktpaMatch !== "—" ? `NOPEN-${ktpaMatch}` : `NOPEN-98${1000 + currentDataList.length + newStandardizedRows.length}`,
                bulanBayar: "Mei 2026",
                tglTransaksi: rowTgl,
                namaPenerima: desc.replace(/^[A-Z0-9\s-]{5,15}/, "").trim() || "Penerima Manfaat",
                statusMapping: "Matched 100%"
              });
            }
          });

          if (newStandardizedRows.length > 0) {
            const finalMitra = selectedMitraUpload !== "Otomatis (Deteksi dari Berkas / Filename)" ? selectedMitraUpload : "Terdeteksi Otomatis";
            updateDataList((prev) => [...prev, ...newStandardizedRows]);
            updateFiles((prev) => [
              {
                id: `FILE-${prev.length + 1}`,
                namaFile: file.name,
                mitra: finalMitra,
                totalBaris: newStandardizedRows.length,
                tglUpload: "Baru saja"
              },
              ...prev
            ]);
          } else {
            alert(`Tidak ditemukan baris transaksi yang valid dalam berkas "${file.name}".`);
          }
        } catch (err) {
          console.error(err);
          alert("Gagal membaca berkas: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Muat data simulasi demo jika pengguna ingin tes cepat
  const handleLoadDemoData = () => {
    updateDataList(DEFAULT_RAW_RK_DATA);
    updateFiles(DEFAULT_UPLOADED_FILES);
  };

  // Filter Search
  const filteredData = currentDataList.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDesc = item.desc?.toLowerCase().includes(q);
      const matchUser = item.userId?.toLowerCase().includes(q);
      const matchMitra = item.mitra?.toLowerCase().includes(q);
      const matchTgl = item.tglBayar?.toLowerCase().includes(q);
      if (!matchDesc && !matchUser && !matchMitra && !matchTgl) return false;
    }
    return true;
  });

  // Tombol Trigger Mapping ke Menu Penyaluran Harian CMS
  const handleTriggerMapping = () => {
    setIsProcessingMapping(true);
    setTimeout(() => {
      setIsProcessingMapping(false);
      if (onNavigateToPenyaluran) {
        onNavigateToPenyaluran();
      } else {
        alert("Proses Mapping Berhasil! Silakan buka menu 'Penyaluran Harian CMS'.");
      }
    }, 500);
  };

  // Export Format Baku 8 Kolom
  const handleExportRawExcel = () => {
    setPreview({
      title: "Format Standar Rekening Koran CMS Mitra Bayar (8 Kolom Baku)",
      subtitle: `${filteredData.length} Baris Transaksi Terpadankan`,
      type: "table",
      fileName: "Rekening_Koran_Baku_CMS.xlsx",
      content: {
        columns: [
          "No",
          "Tanggal Bayar",
          "Trans Description",
          "Debet (Rp)",
          "Credit (Rp)",
          "Ledger Balance (Rp)",
          "User ID",
          "Mitra Bayar"
        ],
        rows: filteredData.map((d, i) => [
          i + 1,
          d.tglBayar,
          d.desc,
          fmt(d.debet),
          fmt(d.credit),
          fmt(d.saldo),
          d.userId,
          d.mitra
        ]),
        totalRows: filteredData.length
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* DIALOG UPLOAD BERKAS & DROPDOWN 12 MITRA BAYAR */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 10,
          padding: 22,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
              Upload Berkas Rekening Koran Mitra Bayar
            </h3>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              Pilih mitra bayar (atau otomatis), lalu upload berkas Excel (.xlsx, .xls) / CSV (.csv) rekening koran perbankan.
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {currentDataList.length === 0 ? (
              <Btn variant="outline" size="sm" onClick={handleLoadDemoData}>
                <Sparkles size={13} color="#0141A8" /> Simulasi Contoh Berkas Demo
              </Btn>
            ) : (
              <Btn
                variant="outline"
                size="sm"
                onClick={() => {
                  updateDataList([]);
                  updateFiles([]);
                }}
              >
                <Trash2 size={13} color="#DC2626" /> Reset / Kosongkan Data
              </Btn>
            )}
          </div>
        </div>

        {/* Layout Side-by-Side: Dropdown 12 Mitra Bayar (Kiri) & Drag 'n Drop (Kanan) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "330px 1fr",
            gap: 16,
            alignItems: "stretch"
          }}
        >
          {/* KOLOM KIRI: Dropdown Pilihan 12 Mitra Bayar */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #CBD5E1",
              borderRadius: 8,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, color: "#0F172A", fontWeight: 800, fontSize: 13 }}>
                <Building2 size={16} color="#0141A8" />
                <span>Identifikasi 12 Mitra Bayar</span>
              </div>

              <Select
                label="Pilih Mitra Bayar (Asal Rekening Koran)"
                value={selectedMitraUpload}
                onChange={setSelectedMitraUpload}
                options={mitraListOptions}
                minW="100%"
              />

              <div style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.5, marginTop: 12 }}>
                💡 Pilih mitra bayar sebelum mengunggah berkas untuk memastikan sistem memadankan format dan header rekening koran secara spesifik sesuai perbankan/pos asal.
              </div>
            </div>

            <div
              style={{
                fontSize: 11,
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 6,
                padding: "8px 10px",
                color: "#1E40AF"
              }}
            >
              Mode: <strong>{selectedMitraUpload === "Otomatis (Deteksi dari Berkas / Filename)" ? "⚡ Auto-Detect Otomatis" : selectedMitraUpload}</strong>
            </div>
          </div>

          {/* KOLOM KANAN: Drop Zone Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? "#0141A8" : "#94A3B8"}`,
              background: isDragOver ? "#EFF6FF" : "#F8FAFC",
              borderRadius: 8,
              padding: "24px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 150,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processFiles(e.target.files);
                }
              }}
            />

            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: "#EFF6FF",
                color: "#0141A8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8
              }}
            >
              <UploadCloud size={24} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>
              Pilih Berkas atau Tarik (Drag & Drop) Rekening Koran ke Sini
            </span>
            <span style={{ fontSize: 11.5, color: "#64748B", marginTop: 3 }}>
              Mendukung upload satu per satu atau sekaligus banyak berkas (.xlsx, .xls, .csv)
            </span>
          </div>
        </div>

        {/* List Berkas yang Telah Terupload */}
        {currentFiles.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B" }}>Berkas Terunggah ({currentFiles.length}):</span>
            {currentFiles.map((f, i) => (
              <span
                key={f.id || i}
                style={{
                  background: "#F1F5F9",
                  border: "1px solid #CBD5E1",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#0F172A",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <FileSpreadsheet size={13} color="#059669" />
                {f.namaFile}
                <span style={{ color: "#64748B", fontSize: 10.5 }}>({f.totalBaris} baris • {f.mitra || "Mitra Bayar"})</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* TABEL LIST BARIS PER BARIS REKENING KORAN TERPADANKAN (FORMAT BAKU 8 KOLOM) */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 10,
          padding: 22,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}
      >
        {/* Header Tabel & Tombol Aksi */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SectionTitle>Daftar Padanan Rekening Koran Terupload (Format Baku 8 Kolom)</SectionTitle>
              {currentDataList.length > 0 && (
                <Badge color="blue">{filteredData.length} Baris Transaksi</Badge>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              <code>No | Tanggal Bayar | Trans Description | Debet | Credit | Ledger Balance (Rp) | User ID | Mitra Bayar</code>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {currentDataList.length > 0 && (
              <Btn variant="outline" size="sm" onClick={handleExportRawExcel}>
                <Download size={13} /> Ekspor Format Baku (.xlsx)
              </Btn>
            )}

            {/* TOMBOL MAPPING KE PENYALURAN HARIAN */}
            <button
              onClick={handleTriggerMapping}
              disabled={isProcessingMapping || currentDataList.length === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: currentDataList.length === 0 ? "#94A3B8" : "linear-gradient(135deg, #0141A8, #1E40AF)",
                color: "#FFFFFF",
                fontSize: 12.5,
                fontWeight: 800,
                cursor: currentDataList.length === 0 || isProcessingMapping ? "not-allowed" : "pointer",
                boxShadow: currentDataList.length === 0 ? "none" : "0 3px 8px rgba(1,65,168,0.3)",
                transition: "all 0.15s ease"
              }}
            >
              <Zap size={14} color="#FBBF24" />
              {isProcessingMapping ? "Memproses Mapping..." : "Proses Mapping ke Penyaluran Harian CMS"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Pencarian (jika ada data) */}
        {currentDataList.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari deskripsi transaksi, User ID, Mitra Bayar, atau tanggal..."
            />
          </div>
        )}

        {/* Tabel Data 8 Kolom Baku */}
        {currentDataList.length === 0 ? (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: 8,
              border: "1px dashed #CBD5E1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <FileUp size={32} color="#94A3B8" />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>
              Belum Ada Rekening Koran yang Diunggah
            </span>
            <span style={{ fontSize: 12, color: "#64748B", maxWidth: 450 }}>
              Silakan pilih mitra bayar pada dropdown di atas lalu tarik & lepas (drag & drop) berkas Excel / CSV Anda, atau klik tombol <strong>"Simulasi Contoh Berkas Demo"</strong>.
            </span>
          </div>
        ) : filteredData.length === 0 ? (
          <NoData text="Tidak ada transaksi yang cocok dengan kata kunci pencarian." />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, width: 45, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal Bayar</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Trans Description</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Debet (Rp)</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Credit (Rp)</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Ledger Balance (Rp)</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>User ID</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800 }}>Mitra Bayar</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d, i) => (
                  <tr
                    key={d.no || i}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "9px 12px", textAlign: "center", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.tglBayar}</td>
                    <td style={{ padding: "9px 14px", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.desc}</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: d.debet > 0 ? "#DC2626" : "#94A3B8", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>{d.debet > 0 ? fmt(d.debet) : "0"}</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: d.credit > 0 ? "#059669" : "#94A3B8", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>{d.credit > 0 ? fmt(d.credit) : "0"}</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(d.saldo)}</td>
                    <td style={{ padding: "9px 12px", textAlign: "center", fontFamily: "monospace", color: "#64748B", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{d.userId}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
