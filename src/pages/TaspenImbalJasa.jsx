import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Percent,
  Banknote,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Settings,
  HelpCircle,
  TrendingUp,
  Receipt,
  Scale,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Info,
  Sliders,
  ShieldCheck,
  Building2,
  User,
  Calendar,
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

export const TaspenImbalJasa = () => {
  // Hanya 2 Tab Utama: "tpb" vs "tds" (Sesuai Permintaan User)
  const [activeTab, setActiveTab] = useState("tpb"); // "tpb" | "tds"

  // Filter & Search States
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Parameter Rates
  const [tarifTPB, setTarifTPB] = useState(3.0); // 3.0% untuk TPB
  const [tarifTDS, setTarifTDS] = useState(2.5); // 2.5% untuk TDS
  const [pphRate, setPphRate] = useState(2.0); // 2% PPh 23
  const [ppnRate, setPpnRate] = useState(12.0); // 12% PPN
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Modal States
  const [detailModal, setDetailModal] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tambahModal, setTambahModal] = useState(false);

  // Helper Formatter
  const fmt = (n) =>
    typeof n === "number" ? `Rp ${Math.round(n).toLocaleString("id-ID")}` : "—";

  // -------------------------------------------------------------
  // DATA MOCK RESMI SPESIFIKASI BRD V5 (Line 271-273)
  // Format Kolom Identik:
  // No | Bulan | Peserta | KTPA | Nominal | Nomor Polis | Tanggal Polis |
  // Tanggal Bayar Polis | Imbal Jasa | DPP 11/12 | PPN (DPP X 12%) |
  // PPH 23 (Imbal Jasa X 2%) | Jumlah Tagihan | Imbal Jasa yang Diterima |
  // Tanggal Terima Imbal Jasa
  // -------------------------------------------------------------
  const [rawTpbData, setRawTpbData] = useState([
    {
      id: "TPB-001",
      no: 1,
      bulan: "Juni 2026",
      peserta: "Letkol Bambang Suharto",
      ktpa: "KTPA-0012847",
      nominalPremi: 7440000,
      noPolis: "TL-JKK-2026-00089",
      tanggalPolis: "08 Mar 2026",
      tanggalBayarPolis: "18 Mar 2026",
      programSub: "TPB-JKK",
      tanggalTerima: "15 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TPB-002",
      no: 2,
      bulan: "Juni 2026",
      peserta: "Penata Tk.I Siti Nurhaliza",
      ktpa: "KTPA-0012848",
      nominalPremi: 6480000,
      noPolis: "TL-JKK-2026-00090",
      tanggalPolis: "10 Apr 2026",
      tanggalBayarPolis: "20 Apr 2026",
      programSub: "TPB-JKK",
      tanggalTerima: "15 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TPB-003",
      no: 3,
      bulan: "Juni 2026",
      peserta: "AKP Dedi Kurniawan",
      ktpa: "KTPA-0012849",
      nominalPremi: 3720000,
      noPolis: "TL-JKM-2026-00034",
      tanggalPolis: "12 Mei 2026",
      tanggalBayarPolis: "20 Mei 2026",
      programSub: "TPB-JKM",
      tanggalTerima: "18 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TPB-004",
      no: 4,
      bulan: "Juni 2026",
      peserta: "Pembina Utama Dr. Ratna",
      ktpa: "KTPA-0012851",
      nominalPremi: 3480000,
      noPolis: "TL-JKM-2026-00035",
      tanggalPolis: "15 Jun 2026",
      tanggalBayarPolis: "22 Jun 2026",
      programSub: "TPB-JKM",
      tanggalTerima: "25 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TPB-005",
      no: 5,
      bulan: "Juni 2026",
      peserta: "Kapten Inf. Agus Salim",
      ktpa: "KTPA-0012853",
      nominalPremi: 5200000,
      noPolis: "TL-JKK-2026-00095",
      tanggalPolis: "18 Jun 2026",
      tanggalBayarPolis: "25 Jun 2026",
      programSub: "TPB-JKK",
      tanggalTerima: "—",
      status: "Belum Diterima",
    },
    {
      id: "TPB-006",
      no: 6,
      bulan: "Juni 2026",
      peserta: "Mayor Mar. Joko Prasetyo",
      ktpa: "KTPA-0012855",
      nominalPremi: 4800000,
      noPolis: "TL-JKM-2026-00039",
      tanggalPolis: "20 Jun 2026",
      tanggalBayarPolis: "28 Jun 2026",
      programSub: "TPB-JKM",
      tanggalTerima: "—",
      status: "Belum Diterima",
    },
  ]);

  const [rawTdsData, setRawTdsData] = useState([
    {
      id: "TDS-001",
      no: 1,
      bulan: "Juni 2026",
      peserta: "Serka Ahmad Fauzi",
      ktpa: "KTPA-0012845",
      nominalPremi: 6000000,
      noPolis: "TL-TDS-2026-00145",
      tanggalPolis: "05 Jan 2026",
      tanggalBayarPolis: "15 Jan 2026",
      programSub: "TDS-Pensiun",
      tanggalTerima: "10 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TDS-002",
      no: 2,
      bulan: "Juni 2026",
      peserta: "Briptu Rina Marlina",
      ktpa: "KTPA-0012846",
      nominalPremi: 6000000,
      noPolis: "TL-TDS-2026-00146",
      tanggalPolis: "05 Feb 2026",
      tanggalBayarPolis: "15 Feb 2026",
      programSub: "TDS-Pensiun",
      tanggalTerima: "10 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TDS-003",
      no: 3,
      bulan: "Juni 2026",
      peserta: "Peltu Hendra Wijaya",
      ktpa: "KTPA-0012850",
      nominalPremi: 12000000,
      noPolis: "TL-TDS-2026-00147",
      tanggalPolis: "10 Mar 2026",
      tanggalBayarPolis: "20 Mar 2026",
      programSub: "TDS-Pensiun",
      tanggalTerima: "12 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TDS-004",
      no: 4,
      bulan: "Juni 2026",
      peserta: "Bripka Anwar Ibrahim",
      ktpa: "KTPA-0012852",
      nominalPremi: 6000000,
      noPolis: "TL-TDS-2026-00148",
      tanggalPolis: "12 Apr 2026",
      tanggalBayarPolis: "22 Apr 2026",
      programSub: "TDS-Pensiun",
      tanggalTerima: "15 Jul 2026",
      status: "Diterima",
    },
    {
      id: "TDS-005",
      no: 5,
      bulan: "Juni 2026",
      peserta: "Kolonel Cpl. Bambang Tri",
      ktpa: "KTPA-0012854",
      nominalPremi: 18000000,
      noPolis: "TL-TDS-2026-00149",
      tanggalPolis: "15 Mei 2026",
      tanggalBayarPolis: "25 Mei 2026",
      programSub: "TDS-Pensiun",
      tanggalTerima: "—",
      status: "Belum Diterima",
    },
    {
      id: "TDS-006",
      no: 6,
      bulan: "Juni 2026",
      peserta: "Letda Kav. Supriyadi",
      ktpa: "KTPA-0012856",
      nominalPremi: 6000000,
      noPolis: "TL-TDS-2026-00150",
      tanggalPolis: "18 Jun 2026",
      tanggalBayarPolis: "28 Jun 2026",
      programSub: "TDS-Pensiun",
      tanggalTerima: "—",
      status: "Belum Diterima",
    },
  ]);

  // Form State untuk Tambah Baris
  const [newRow, setNewRow] = useState({
    bulan: "Juni 2026",
    peserta: "Mayor Laut Faisal",
    ktpa: "KTPA-0012860",
    nominalPremi: 6000000,
    noPolis: "TL-2026-NEW",
    tanggalPolis: "20 Jun 2026",
    tanggalBayarPolis: "28 Jun 2026",
    tanggalTerima: "—",
    status: "Belum Diterima",
  });

  // Kalkulator Baris Pajak Resmi BRD
  const calcRow = (item, currentTarif) => {
    const nominalPremi = item.nominalPremi || 0;
    // Imbal Jasa (Nominal x Tarif %)
    const imbalJasa = (nominalPremi * currentTarif) / 100;
    // DPP 11/12 (DPP x Imbal Jasa)
    const dpp = (11 / 12) * imbalJasa;
    // PPN (DPP X 12%)
    const ppn = (ppnRate / 100) * dpp; // = 11% x Imbal Jasa
    // PPH 23 (Imbal Jasa X 2%)
    const pph23 = (pphRate / 100) * imbalJasa;
    // Jumlah Tagihan (Imbal Jasa + PPN)
    const jumlahTagihan = imbalJasa + ppn;
    // Imbal Jasa yang Diterima (Imbal Jasa + PPN - PPh 23)
    const imbalJasaDiterima = jumlahTagihan - pph23;

    return {
      ...item,
      tarif: currentTarif,
      imbalJasa,
      dpp,
      ppn,
      pph23,
      jumlahTagihan,
      imbalJasaDiterima,
    };
  };

  // Computed Data TPB & TDS
  const computedTpb = useMemo(
    () => rawTpbData.map((r) => calcRow(r, tarifTPB)),
    [rawTpbData, tarifTPB, ppnRate, pphRate]
  );

  const computedTds = useMemo(
    () => rawTdsData.map((r) => calcRow(r, tarifTDS)),
    [rawTdsData, tarifTDS, ppnRate, pphRate]
  );

  // Filtered Data Sesuai Tab Aktif
  const activeComputedList = useMemo(() => {
    const source = activeTab === "tpb" ? computedTpb : computedTds;
    return source.filter((row) => {
      if (filterBulan !== "Semua" && row.bulan !== filterBulan) return false;
      if (filterStatus !== "Semua" && row.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          row.peserta.toLowerCase().includes(q) ||
          row.ktpa.toLowerCase().includes(q) ||
          row.noPolis.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [activeTab, computedTpb, computedTds, filterBulan, filterStatus, searchQuery]);

  // Agregat Tab Aktif
  const agg = useMemo(() => {
    const totalPremi = activeComputedList.reduce((a, b) => a + b.nominalPremi, 0);
    const totalImbalJasa = activeComputedList.reduce((a, b) => a + b.imbalJasa, 0);
    const totalDPP = activeComputedList.reduce((a, b) => a + b.dpp, 0);
    const totalPPN = activeComputedList.reduce((a, b) => a + b.ppn, 0);
    const totalPPh23 = activeComputedList.reduce((a, b) => a + b.pph23, 0);
    const totalTagihan = activeComputedList.reduce((a, b) => a + b.jumlahTagihan, 0);
    const totalDiterima = activeComputedList.reduce((a, b) => a + b.imbalJasaDiterima, 0);
    const countLunas = activeComputedList.filter((r) => r.status === "Diterima").length;
    const countBelum = activeComputedList.filter((r) => r.status === "Belum Diterima").length;
    return {
      totalPremi,
      totalImbalJasa,
      totalDPP,
      totalPPN,
      totalPPh23,
      totalTagihan,
      totalDiterima,
      countLunas,
      countBelum,
    };
  }, [activeComputedList]);

  // Handler: Tambah Data
  const handleSaveTambah = () => {
    const newItem = {
      id: `${activeTab.toUpperCase()}-${String(Date.now()).slice(-4)}`,
      no: (activeTab === "tpb" ? rawTpbData.length : rawTdsData.length) + 1,
      bulan: newRow.bulan,
      peserta: newRow.peserta,
      ktpa: newRow.ktpa,
      nominalPremi: Number(newRow.nominalPremi),
      noPolis: newRow.noPolis,
      tanggalPolis: newRow.tanggalPolis,
      tanggalBayarPolis: newRow.tanggalBayarPolis,
      programSub: activeTab === "tpb" ? "TPB-JKK" : "TDS-Pensiun",
      tanggalTerima: newRow.tanggalTerima,
      status: newRow.status,
    };

    if (activeTab === "tpb") {
      setRawTpbData([...rawTpbData, newItem]);
    } else {
      setRawTdsData([...rawTdsData, newItem]);
    }
    setTambahModal(false);
  };

  // Handler: Ekspor Excel
  const handleEksporExcel = () => {
    const progLabel = activeTab === "tpb" ? "TPB" : "TDS";
    setPreview({
      title: `Ekspor Rekapitulasi Tagihan Imbal Jasa ${progLabel}`,
      subtitle: `Format Resmi 15 Kolom BRD Keuangan (Tarif ${activeTab === "tpb" ? tarifTPB : tarifTDS}%)`,
      type: "table",
      fileName: `Rekap_Imbal_Jasa_${progLabel}_TaspenLife.xlsx`,
      content: {
        columns: [
          "No.",
          "Bulan",
          "Peserta",
          "KTPA",
          "Nominal",
          "Nomor Polis",
          "Tanggal Polis",
          "Tanggal Bayar Polis",
          `Imbal Jasa (${activeTab === "tpb" ? tarifTPB : tarifTDS}%)`,
          "DPP 11/12",
          "PPN 12%",
          "PPh 23 (2%)",
          "Jumlah Tagihan",
          "Imbal Jasa Diterima",
          "Tanggal Terima",
        ],
        rows: activeComputedList.map((r) => [
          r.no,
          r.bulan,
          r.peserta,
          r.ktpa,
          fmt(r.nominalPremi),
          r.noPolis,
          r.tanggalPolis,
          r.tanggalBayarPolis,
          fmt(r.imbalJasa),
          fmt(r.dpp),
          fmt(r.ppn),
          fmt(r.pph23),
          fmt(r.jumlahTagihan),
          fmt(r.imbalJasaDiterima),
          r.tanggalTerima,
        ]),
        totalRows: activeComputedList.length,
      },
    });
  };

  // Handler: Cetak Surat Tagihan Resmi
  const handleCetakTagihan = (item) => {
    const isTPB = activeTab === "tpb";
    setPreview({
      title: "Surat Tagihan Imbal Jasa Taspen Life",
      subtitle: `${item.peserta} — Polis: ${item.noPolis}`,
      type: "surat",
      fileName: `Surat_Tagihan_ImbalJasa_${item.ktpa}.pdf`,
      content: {
        noSurat: `S-TAG/KEU/TL-${isTPB ? "TPB" : "TDS"}/2026/06/${String(item.no).padStart(3, "0")}`,
        tujuan: "Direksi PT Asuransi Jiwa Taspen (Taspen Life)",
        periode: `Imbal Jasa ${isTPB ? "Taspen Proteksi Beasiswa (TPB)" : "Taspen Dwiguna Sejahtera (TDS)"} — Periode ${item.bulan}`,
        cutoff: "14 Hari Kerja",
        tanggal: "15 Juli 2026",
        items: [
          { jenis: "Nama Peserta / Pemegang Polis", peserta: item.peserta, nominal: "KTPA: " + item.ktpa },
          { jenis: "Nomor Polis & Tanggal Penerbitan", peserta: item.noPolis, nominal: "Tgl: " + item.tanggalPolis },
          { jenis: "Tanggal Pembayaran Premi oleh Peserta", peserta: "Verifikasi Kas", nominal: item.tanggalBayarPolis },
          { jenis: "Nominal Premi Bruto", peserta: "Basis Premi", nominal: fmt(item.nominalPremi) },
          { jenis: `Imbal Jasa (${isTPB ? tarifTPB : tarifTDS}% × Nominal Premi)`, peserta: "Fee Base", nominal: fmt(item.imbalJasa) },
          { jenis: "Dasar Pengenaan Pajak (11/12 × Imbal Jasa)", peserta: "DPP Nilai Lain", nominal: fmt(item.dpp) },
          { jenis: "PPN 12% (12% × DPP)", peserta: "PPN Terutang", nominal: fmt(item.ppn) },
          { jenis: "PPh Pasal 23 (2% × Imbal Jasa)", peserta: "Potongan Pajak", nominal: `-${fmt(item.pph23)}` },
          { jenis: "TOTAL JUMLAH TAGIHAN KE TASPEN LIFE", peserta: "Imbal Jasa + PPN", nominal: fmt(item.jumlahTagihan) },
          { jenis: "IMBAL JASA BERSIH DITERIMA ASABRI (NETO)", peserta: "Hak Bersih ASABRI", nominal: fmt(item.imbalJasaDiterima) },
        ],
      },
    });
  };

  return (
    <div>
      {/* Global Preview Modal */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Modal Pengaturan Parameter Tarif */}
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
                <div style={{ background: "#EFF6FF", padding: 8, borderRadius: 8, color: COLORS.blue }}>
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                    Parameter Tarif Imbal Jasa & Perpajakan
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: COLORS.gray500 }}>
                    Sesuai Ketentuan BRD V5 (Line 271-273)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.gray400 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 6 }}>
                  Tarif Imbal Jasa TPB (Taspen Proteksi Beasiswa)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    step="0.1"
                    value={tarifTPB}
                    onChange={(e) => setTarifTPB(parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.gray300}`, fontSize: 14, fontWeight: 700 }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600 }}>%</span>
                </div>
                <span style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4, display: "block" }}>
                  Standar BRD: 3,00% dari Premi Bruto Program TPB (JKK & JKm)
                </span>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 6 }}>
                  Tarif Imbal Jasa TDS (Taspen Dwiguna Sejahtera)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    step="0.1"
                    value={tarifTDS}
                    onChange={(e) => setTarifTDS(parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.gray300}`, fontSize: 14, fontWeight: 700 }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600 }}>%</span>
                </div>
                <span style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4, display: "block" }}>
                  Standar BRD: 2,50% dari Premi Bruto Program TDS (Tabungan Asuransi Pensiun)
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tarif PPN
                  </label>
                  <input
                    type="number"
                    value={ppnRate}
                    onChange={(e) => setPpnRate(parseFloat(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                  />
                  <span style={{ fontSize: 11, color: COLORS.gray400, marginTop: 2, display: "block" }}>
                    12% × DPP (11/12)
                  </span>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tarif PPh Pasal 23
                  </label>
                  <input
                    type="number"
                    value={pphRate}
                    onChange={(e) => setPphRate(parseFloat(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                  />
                  <span style={{ fontSize: 11, color: COLORS.gray400, marginTop: 2, display: "block" }}>
                    2% × Imbal Jasa
                  </span>
                </div>
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

      {/* Modal Detail Perhitungan Baris */}
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
              width: 620,
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
                  <Badge color={activeTab === "tpb" ? "orange" : "blue"}>
                    {activeTab === "tpb" ? "Taspen Proteksi Beasiswa (TPB)" : "Taspen Dwiguna Sejahtera (TDS)"}
                  </Badge>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray500 }}>
                    {detailModal.ktpa}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORS.gray900 }}>
                  Detail Perhitungan Imbal Jasa & Pajak Polis
                </h3>
                <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 2 }}>
                  Peserta: <b>{detailModal.peserta}</b> • No. Polis: {detailModal.noPolis}
                </div>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.gray400, fontSize: 22 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Informasi Polis */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", color: COLORS.gray700, marginBottom: 10 }}>
                  Informasi Kepesertaan & Polis
                </div>
                <div style={{ background: COLORS.gray50, padding: 14, borderRadius: 8, border: `1px solid ${COLORS.gray200}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5 }}>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Nama Peserta:</span>
                    <div style={{ fontWeight: 700, color: COLORS.gray900 }}>{detailModal.peserta}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Nomor KTPA:</span>
                    <div style={{ fontWeight: 700, fontFamily: "monospace" }}>{detailModal.ktpa}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Nomor Polis:</span>
                    <div style={{ fontWeight: 700, color: COLORS.blue }}>{detailModal.noPolis}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Tanggal Terbit Polis:</span>
                    <div style={{ fontWeight: 600 }}>{detailModal.tanggalPolis}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Tanggal Bayar Polis:</span>
                    <div style={{ fontWeight: 600 }}>{detailModal.tanggalBayarPolis}</div>
                  </div>
                  <div>
                    <span style={{ color: COLORS.gray500 }}>Tanggal Terima Imbal Jasa:</span>
                    <div style={{ fontWeight: 700, color: detailModal.status === "Diterima" ? COLORS.green : COLORS.red }}>
                      {detailModal.tanggalTerima}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Verifikasi Perhitungan Pajak */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", color: COLORS.gray700, marginBottom: 10 }}>
                  Verifikasi Formula Perpajakan (BRD Line 271-273)
                </div>
                <div style={{ border: `1px solid ${COLORS.gray200}`, borderRadius: 8, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>Nominal Premi Bruto</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>
                          {fmt(detailModal.nominalPremi)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.gray50 }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          Imbal Jasa <span style={{ fontSize: 11, color: COLORS.gray400 }}>({detailModal.tarif}% × Nominal Premi)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.blue }}>
                          {fmt(detailModal.imbalJasa)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          DPP PPN Nilai Lain <span style={{ fontSize: 11, color: COLORS.gray400 }}>(11/12 × Imbal Jasa)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600 }}>
                          {fmt(detailModal.dpp)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          PPN 12% <span style={{ fontSize: 11, color: COLORS.gray400 }}>(12% × DPP PPN)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#4F46E5" }}>
                          +{fmt(detailModal.ppn)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                        <td style={{ padding: "10px 14px", color: COLORS.gray600 }}>
                          Tax / PPh Pasal 23 <span style={{ fontSize: 11, color: COLORS.gray400 }}>(2% × Imbal Jasa)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.red }}>
                          -{fmt(detailModal.pph23)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.gray50 }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: COLORS.gray800 }}>
                          Jumlah Tagihan ke Taspen Life <span style={{ fontSize: 11, color: COLORS.gray400 }}>(Imbal Jasa + PPN)</span>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900 }}>
                          {fmt(detailModal.jumlahTagihan)}
                        </td>
                      </tr>
                      <tr style={{ background: "#EFF6FF" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: COLORS.blue }}>
                          Imbal Jasa yang Diterima PT ASABRI (Neto / NAT)
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: COLORS.blue, fontSize: 15 }}>
                          {fmt(detailModal.imbalJasaDiterima)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                <Btn variant="outline" onClick={() => handleCetakTagihan(detailModal)}>
                  <FileText size={14} /> Cetak Nota Tagihan
                </Btn>
                <Btn variant="primary" onClick={() => setDetailModal(null)}>
                  Tutup
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Baris Baru */}
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
          onClick={() => setTambahModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 560,
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
                  Tambah Data Imbal Jasa ({activeTab === "tpb" ? "TPB - 3%" : "TDS - 2,5%"})
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: COLORS.gray500 }}>
                  Perhitungan DPP (11/12), PPN 12%, PPh 23 (2%), dan Imbal Jasa Diterima dihitung otomatis
                </p>
              </div>
              <button
                onClick={() => setTambahModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.gray400 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Nama Peserta
                  </label>
                  <input
                    type="text"
                    value={newRow.peserta}
                    onChange={(e) => setNewRow({ ...newRow, peserta: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Nomor KTPA
                  </label>
                  <input
                    type="text"
                    value={newRow.ktpa}
                    onChange={(e) => setNewRow({ ...newRow, ktpa: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Bulan / Periode
                  </label>
                  <input
                    type="text"
                    value={newRow.bulan}
                    onChange={(e) => setNewRow({ ...newRow, bulan: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Nominal Premi (Rp)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={newRow.nominalPremi}
                    onChange={(e) => setNewRow({ ...newRow, nominalPremi: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 14, fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Nomor Polis
                  </label>
                  <input
                    type="text"
                    value={newRow.noPolis}
                    onChange={(e) => setNewRow({ ...newRow, noPolis: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tanggal Terbit Polis
                  </label>
                  <input
                    type="text"
                    value={newRow.tanggalPolis}
                    onChange={(e) => setNewRow({ ...newRow, tanggalPolis: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tanggal Bayar Polis
                  </label>
                  <input
                    type="text"
                    value={newRow.tanggalBayarPolis}
                    onChange={(e) => setNewRow({ ...newRow, tanggalBayarPolis: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tanggal Terima Imbal Jasa
                  </label>
                  <input
                    type="text"
                    value={newRow.tanggalTerima}
                    onChange={(e) => setNewRow({ ...newRow, tanggalTerima: e.target.value })}
                    placeholder="Contoh: 15 Jul 2026 atau —"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ background: COLORS.gray50, padding: 12, borderRadius: 8, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Tarif Imbal Jasa:</span>
                  <b>{activeTab === "tpb" ? tarifTPB : tarifTDS}%</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Estimasi Imbal Jasa:</span>
                  <b>{fmt((Number(newRow.nominalPremi) || 0) * ((activeTab === "tpb" ? tarifTPB : tarifTDS) / 100))}</b>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <Btn variant="outline" onClick={() => setTambahModal(false)}>
                  Batal
                </Btn>
                <Btn variant="primary" onClick={handleSaveTambah}>
                  Simpan Data Polis
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
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
            Administrasi Penagihan Imbal Jasa Kemitraan Asuransi Jiwa Taspen Life (BRD Keuangan & Perpajakan V5)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <Badge color="orange">Tarif TPB: {tarifTPB.toFixed(1)}%</Badge>
            <Badge color="blue">Tarif TDS: {tarifTDS.toFixed(1)}%</Badge>
            <Badge color="green">DPP Nilai Lain: 11/12 (91,67%)</Badge>
            <Badge color="gray">PPN 12% • PPh 23: 2%</Badge>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Btn variant="outline" onClick={() => setShowConfigModal(true)}>
            <Sliders size={14} /> Atur Parameter Tarif
          </Btn>
          <Btn variant="outline" onClick={handleEksporExcel}>
            <Download size={14} /> Ekspor Tabel (Excel)
          </Btn>
          <Btn variant="primary" onClick={() => setTambahModal(true)}>
            <Plus size={15} /> Tambah Data Polis
          </Btn>
        </div>
      </div>

      {/* TAB NAVIGATION: HANYA 2 TAB (TPB & TDS) */}
      <div
        style={{
          borderBottom: `2px solid ${COLORS.gray200}`,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", gap: 6, marginBottom: -2 }}>
          {[
            {
              id: "tpb",
              label: "Imbal Jasa TPB (Taspen Proteksi Beasiswa)",
              tarif: `${tarifTPB}%`,
              count: computedTpb.length,
              badgeCol: "orange",
            },
            {
              id: "tds",
              label: "Imbal Jasa TDS (Taspen Dwiguna Sejahtera)",
              tarif: `${tarifTDS}%`,
              count: computedTds.length,
              badgeCol: "blue",
            },
          ].map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 20px",
                  border: "none",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontSize: 13.5,
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
                <span>{t.label}</span>
                <span
                  style={{
                    background: isActive ? "#EFF6FF" : COLORS.gray100,
                    color: isActive ? COLORS.blue : COLORS.gray600,
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Tarif {t.tarif} • {t.count} Polis
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ paddingBottom: 6, fontSize: 12, color: COLORS.gray500 }}>
          Format Tabel 15 Kolom Resmi Sesuai Spesifikasi BRD Keuangan
        </div>
      </div>

      {/* Stat Cards Tab Aktif */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard
          icon={<Banknote size={IC} />}
          label={`Total Premi Bruto (${activeTab === "tpb" ? "TPB" : "TDS"})`}
          value={fmt(agg.totalPremi)}
          sub={`${activeComputedList.length} Polis Terdaftar`}
          color={activeTab === "tpb" ? COLORS.orange : COLORS.blue}
        />
        <StatCard
          icon={<Receipt size={IC} />}
          label={`Imbal Jasa (Nominal × ${activeTab === "tpb" ? tarifTPB : tarifTDS}%)`}
          value={fmt(agg.totalImbalJasa)}
          sub={`DPP Nilai Lain (11/12): ${fmt(agg.totalDPP)}`}
          color={COLORS.blueLight}
        />
        <StatCard
          icon={<ShieldCheck size={IC} />}
          label="Imbal Jasa Diterima (Neto / NAT)"
          value={fmt(agg.totalDiterima)}
          sub={`PPN: +${fmt(agg.totalPPN)} • PPh 23: -${fmt(agg.totalPPh23)}`}
          color={COLORS.green}
        />
        <StatCard
          icon={<CheckCircle2 size={IC} />}
          label="Realisasi Penerimaan Fee"
          value={`${agg.countLunas} Lunas`}
          sub={`${agg.countBelum} Belum Diterima`}
          color={agg.countBelum > 0 ? COLORS.orange : COLORS.green}
        />
      </div>

      {/* Filter Bar Terpadu */}
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
            label="Bulan"
            value={filterBulan}
            onChange={setFilterBulan}
            options={["Semua", "Juni 2026", "Juli 2026"]}
            minW={140}
          />
          <Select
            label="Status Penerimaan"
            value={filterStatus}
            onChange={setFilterStatus}
            options={["Semua", "Diterima", "Belum Diterima"]}
            minW={160}
          />
        </div>

        <div style={{ minWidth: 260 }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari Peserta, KTPA, No. Polis..."
          />
        </div>
      </div>

      {/* TABEL LENGKAP 15 KOLOM SPESIFIKASI BRD UNTUK TPB & TDS */}
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
              Tabel Rincian Imbal Jasa {activeTab === "tpb" ? "Taspen Proteksi Beasiswa (TPB)" : "Taspen Dwiguna Sejahtera (TDS)"}
            </h3>
            <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
              Struktur 15 Kolom Data Lengkap Sesuai Dokumen BRD Keuangan (Line 271-273)
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
              Rumus: Imbal Jasa = Premi × {activeTab === "tpb" ? "3%" : "2,5%"} | DPP = 11/12 | PPN 12% | PPh 23 (2%) | Tagihan = Imbal Jasa + PPN | Diterima = Tagihan - PPh 23
            </span>
          </div>
        </div>

        {activeComputedList.length === 0 ? (
          <NoData message={`Tidak ada data polis ${activeTab.toUpperCase()} yang sesuai dengan filter.`} />
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
                  {/* 2. Bulan */}
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                    Bulan
                  </th>
                  {/* 3. Peserta */}
                  <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray300}`, background: "#E2E8F0", position: "sticky", left: 45, zIndex: 11 }}>
                    Peserta
                  </th>
                  {/* 4. KTPA */}
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                    KTPA
                  </th>
                  {/* 5. Nominal (Premi) */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray900, background: "#EFF6FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                    Nominal
                  </th>
                  {/* 6. Nomor Polis */}
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.blue, borderRight: `1px solid ${COLORS.gray200}` }}>
                    Nomor Polis
                  </th>
                  {/* 7. Tanggal Polis */}
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                    Tanggal Polis
                  </th>
                  {/* 8. Tanggal Bayar Polis */}
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                    Tanggal Bayar Polis
                  </th>
                  {/* 9. Imbal Jasa (Tarif) */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.blue, background: "#EFF6FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                    Imbal Jasa (Nominal x {activeTab === "tpb" ? "3%" : "2,5%"})
                  </th>
                  {/* 10. DPP 11/12 (DPP x Imbal Jasa) */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray800, background: "#F8FAFC", borderRight: `1px solid ${COLORS.gray200}` }}>
                    DPP 11/12 (DPP x Imbal Jasa)
                  </th>
                  {/* 11. PPN (DPP X 12%) */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#4F46E5", background: "#EEF2FF", borderRight: `1px solid ${COLORS.gray200}` }}>
                    PPN (DPP X 12%)
                  </th>
                  {/* 12. PPH 23 (Imbal Jasa X 2%) */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.red, background: "#FFF1F2", borderRight: `1px solid ${COLORS.gray200}` }}>
                    PPH 23 (Imbal Jasa X 2%)
                  </th>
                  {/* 13. Jumlah Tagihan (Imbal Jasa + PPN) */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray900, background: "#F1F5F9", borderRight: `1px solid ${COLORS.gray200}` }}>
                    Jumlah Tagihan (Imbal Jasa + PPN)
                  </th>
                  {/* 14. Imbal Jasa yang Diterima */}
                  <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green, background: "#ECFDF5", borderRight: `1px solid ${COLORS.gray200}` }}>
                    Imbal Jasa yang Diterima
                  </th>
                  {/* 15. Tanggal Terima Imbal Jasa */}
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                    Tanggal Terima Imbal Jasa
                  </th>
                  {/* Aksi */}
                  <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, color: COLORS.gray700 }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeComputedList.map((row, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: `1px solid ${COLORS.gray200}`,
                        background:
                          row.status === "Belum Diterima"
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
                      {/* 2. Bulan */}
                      <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                        {row.bulan}
                      </td>
                      {/* 3. Peserta */}
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray300}`, background: isEven ? "#F1F5F9" : "#F8FAFC", position: "sticky", left: 45, zIndex: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <User size={13} color={COLORS.blue} />
                          <span>{row.peserta}</span>
                        </div>
                      </td>
                      {/* 4. KTPA */}
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {row.ktpa}
                      </td>
                      {/* 5. Nominal */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {fmt(row.nominalPremi)}
                      </td>
                      {/* 6. Nomor Polis */}
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {row.noPolis}
                      </td>
                      {/* 7. Tanggal Polis */}
                      <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                        {row.tanggalPolis}
                      </td>
                      {/* 8. Tanggal Bayar Polis */}
                      <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                        {row.tanggalBayarPolis}
                      </td>
                      {/* 9. Imbal Jasa */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.blue, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {fmt(row.imbalJasa)}
                      </td>
                      {/* 10. DPP */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.gray700, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {fmt(row.dpp)}
                      </td>
                      {/* 11. PPN 12% */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#4F46E5", borderRight: `1px solid ${COLORS.gray200}` }}>
                        +{fmt(row.ppn)}
                      </td>
                      {/* 12. PPh 23 */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: COLORS.red, borderRight: `1px solid ${COLORS.gray200}` }}>
                        -{fmt(row.pph23)}
                      </td>
                      {/* 13. Jumlah Tagihan */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {fmt(row.jumlahTagihan)}
                      </td>
                      {/* 14. Imbal Jasa yang Diterima */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: COLORS.green, borderRight: `1px solid ${COLORS.gray200}` }}>
                        {fmt(row.imbalJasaDiterima)}
                      </td>
                      {/* 15. Tanggal Terima Imbal Jasa */}
                      <td style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.gray200}` }}>
                        {row.tanggalTerima !== "—" ? (
                          <span style={{ fontWeight: 600, color: COLORS.green }}>{row.tanggalTerima}</span>
                        ) : (
                          <span style={{ color: COLORS.orange, fontWeight: 700 }}>Menunggu Pembayaran</span>
                        )}
                      </td>
                      {/* Aksi */}
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <Btn
                            size="xs"
                            variant="outline"
                            onClick={() => setDetailModal(row)}
                          >
                            <Eye size={12} /> Detail
                          </Btn>
                          <Btn
                            size="xs"
                            variant="outline"
                            onClick={() => handleCetakTagihan(row)}
                          >
                            <FileText size={12} /> Cetak
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* FOOTER TOTAL TABLE */}
              <tfoot style={{ background: "#F1F5F9", borderTop: `2px solid ${COLORS.gray300}` }}>
                <tr style={{ fontWeight: 800 }}>
                  <td colSpan={4} style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700 }}>
                    TOTAL REKAPITULASI {activeTab.toUpperCase()}:
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray900 }}>
                    {fmt(agg.totalPremi)}
                  </td>
                  <td colSpan={3} style={{ padding: "12px 14px" }}></td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.blue }}>
                    {fmt(agg.totalImbalJasa)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700 }}>
                    {fmt(agg.totalDPP)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: "#4F46E5" }}>
                    {fmt(agg.totalPPN)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.red }}>
                    {fmt(agg.totalPPh23)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray900 }}>
                    {fmt(agg.totalTagihan)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.green, fontSize: 13 }}>
                    {fmt(agg.totalDiterima)}
                  </td>
                  <td colSpan={2} style={{ padding: "12px 14px" }}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
