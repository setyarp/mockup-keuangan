import { useState } from "react";
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
  const [subTab, setSubTab] = useState("tagihan"); // "tagihan" vs "rincian_brd"
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchTagihan, setSearchTagihan] = useState("");
  const [detailTagihan, setDetailTagihan] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showTarif, setShowTarif] = useState(false);
  const [tarifTDS, setTarifTDS] = useState(2.5);
  const [tarifTPB, setTarifTPB] = useState(3.0);
  const [pphRate, setPphRate] = useState(2.0); // 2% PPh 23
  const [ppnRate, setPpnRate] = useState(12.0); // 12% PPN
  const [dppRatio, setDppRatio] = useState(11 / 12); // DPP Nilai Lain 11/12
  const [biRate, setBiRate] = useState(5.75); // BI Rate 5.75%

  const fmt = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
  const progColor = (p) =>
    p.includes("TDS")
      ? "blue"
      : p.includes("JKK")
      ? "orange"
      : "green";
  const progShort = (p) =>
    p.includes("TDS")
      ? "TDS (2,5%)"
      : p.includes("JKK")
      ? "TPB-JKK (3%)"
      : "TPB-JKM (3%)";

  // Data tagihan imbal jasa berbasis SP Premi yang telah diselesaikan
  const allTagihan = [
    {
      no: "TIJ-2606-001",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      noSP: "SP/TL/2026/06/001",
      periode: "Mei 2026",
      jmlPolis: 2,
      premi: 12000000,
      tarif: 2.5,
      tglTerbit: "18 Jun 2026",
      jatuhTempo: "08 Jul 2026", // 14 hari kerja
      tglBayar: "02 Jul 2026",
      hariTerlambat: 0,
      status: "Dibayar",
      pesertaContoh: "Serka Ahmad Fauzi, Briptu Rina Marlina",
    },
    {
      no: "TIJ-2606-002",
      program: "TPB - Proteksi Beasiswa JKK",
      kodeProgram: "TPB_JKK",
      noSP: "SP/TL/2026/06/002",
      periode: "Mei 2026",
      jmlPolis: 1,
      premi: 7440000,
      tarif: 3.0,
      tglTerbit: "18 Jun 2026",
      jatuhTempo: "08 Jul 2026",
      tglBayar: null,
      hariTerlambat: 12,
      status: "Belum Dibayar",
      pesertaContoh: "Letkol Bambang Suharto",
    },
    {
      no: "TIJ-2606-003",
      program: "TPB - Proteksi Beasiswa JKm",
      kodeProgram: "TPB_JKM",
      noSP: "SP/TL/2026/06/003",
      periode: "Mei 2026",
      jmlPolis: 2,
      premi: 7200000,
      tarif: 3.0,
      tglTerbit: "18 Jun 2026",
      jatuhTempo: "08 Jul 2026",
      tglBayar: "05 Jul 2026",
      hariTerlambat: 0,
      status: "Dibayar",
      pesertaContoh: "AKP Dedi Kurniawan, Pembina Utama Dr. Ratna",
    },
    {
      no: "TIJ-2605-001",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      noSP: "SP/TL/2026/05/001",
      periode: "April 2026",
      jmlPolis: 2,
      premi: 12000000,
      tarif: 2.5,
      tglTerbit: "18 Mei 2026",
      jatuhTempo: "08 Jun 2026",
      tglBayar: "15 Jun 2026",
      hariTerlambat: 7,
      status: "Terlambat",
      pesertaContoh: "Peltu Hendra Wijaya, Bripka Anwar Ibrahim",
    },
    {
      no: "TIJ-2605-002",
      program: "TPB - Proteksi Beasiswa JKK",
      kodeProgram: "TPB_JKK",
      noSP: "SP/TL/2026/05/002",
      periode: "April 2026",
      jmlPolis: 1,
      premi: 6480000,
      tarif: 3.0,
      tglTerbit: "18 Mei 2026",
      jatuhTempo: "08 Jun 2026",
      tglBayar: "28 Mei 2026",
      hariTerlambat: 0,
      status: "Dibayar",
      pesertaContoh: "Penata Tk.I Siti Nurhaliza",
    },
    {
      no: "TIJ-2607-001",
      program: "TDS (Taspen Dwiguna Sejahtera)",
      kodeProgram: "TDS",
      noSP: "SP/TL/2026/07/001",
      periode: "Juni 2026",
      jmlPolis: 2,
      premi: 12000000,
      tarif: 2.5,
      tglTerbit: "20 Jul 2026",
      jatuhTempo: "10 Agu 2026",
      tglBayar: null,
      hariTerlambat: 0,
      status: "Menunggu Pembayaran",
      pesertaContoh: "Serka Ahmad Fauzi, Briptu Rina Marlina",
    },
  ];

  // Data Rincian Individu Format BRD V5 (Line 271-273)
  const rincianBRD = [
    {
      id: "R1",
      bulan: "Juni 2026",
      peserta: "Serka Ahmad Fauzi",
      ktpa: "KTPA-0012845",
      nominalPremi: 6000000,
      noPolis: "TL-TDS-2026-00145",
      tglPolis: "05 Jan 2026",
      tglBayarPolis: "15 Jan 2026",
      program: "TDS",
      tarif: 0.025,
      tglTerima: "10 Jul 2026",
    },
    {
      id: "R2",
      bulan: "Juni 2026",
      peserta: "Briptu Rina Marlina",
      ktpa: "KTPA-0012846",
      nominalPremi: 6000000,
      noPolis: "TL-TDS-2026-00146",
      tglPolis: "05 Feb 2026",
      tglBayarPolis: "15 Feb 2026",
      program: "TDS",
      tarif: 0.025,
      tglTerima: "10 Jul 2026",
    },
    {
      id: "R3",
      bulan: "Juni 2026",
      peserta: "Letkol Bambang Suharto",
      ktpa: "KTPA-0012847",
      nominalPremi: 7440000,
      noPolis: "TL-JKK-2026-00089",
      tglPolis: "08 Mar 2026",
      tglBayarPolis: "18 Mar 2026",
      program: "TPB",
      tarif: 0.03,
      tglTerima: "—",
    },
    {
      id: "R4",
      bulan: "Juni 2026",
      peserta: "Penata Tk.I Siti Nurhaliza",
      ktpa: "KTPA-0012848",
      nominalPremi: 6480000,
      noPolis: "TL-JKK-2026-00090",
      tglPolis: "10 Apr 2026",
      tglBayarPolis: "20 Apr 2026",
      program: "TPB",
      tarif: 0.03,
      tglTerima: "—",
    },
    {
      id: "R5",
      bulan: "Juni 2026",
      peserta: "AKP Dedi Kurniawan",
      ktpa: "KTPA-0012849",
      nominalPremi: 3720000,
      noPolis: "TL-JKM-2026-00034",
      tglPolis: "12 Mei 2026",
      tglBayarPolis: "20 Mei 2026",
      program: "TPB",
      tarif: 0.03,
      tglTerima: "15 Jul 2026",
    },
    {
      id: "R6",
      bulan: "Juni 2026",
      peserta: "Pembina Utama Dr. Ratna",
      ktpa: "KTPA-0012851",
      nominalPremi: 3480000,
      noPolis: "TL-JKM-2026-00035",
      tglPolis: "15 Jun 2026",
      tglBayarPolis: "22 Jun 2026",
      program: "TPB",
      tarif: 0.03,
      tglTerima: "15 Jul 2026",
    },
  ];

  // Rumus Perpajakan Resmi BRD V5 (Line 271-273 & Line 275-277)
  const calcTax = (premi, tarifPercent, hariTerlambat = 0) => {
    const imbalJasaBruto = (premi * tarifPercent) / 100;
    const dpp = (11 / 12) * imbalJasaBruto;
    const ppn = (ppnRate / 100) * dpp; // 12% x (11/12 x Imbal Jasa) = 11% x Imbal Jasa
    const pph23 = (pphRate / 100) * imbalJasaBruto; // 2% x Imbal Jasa
    const jumlahTagihan = imbalJasaBruto + ppn; // Tagihan Bruto ke Mitra
    const imbalJasaNeto = imbalJasaBruto + ppn - pph23; // Imbal Jasa yang Diterima
    const denda =
      hariTerlambat > 0
        ? Math.round(
            (jumlahTagihan * (biRate / 100) * hariTerlambat) / 365
          )
        : 0;
    return {
      imbalJasaBruto,
      dpp,
      ppn,
      pph23,
      jumlahTagihan,
      imbalJasaNeto,
      denda,
    };
  };

  const statusColor = (s) =>
    s === "Dibayar"
      ? "green"
      : s === "Terlambat"
      ? "orange"
      : s === "Belum Dibayar"
      ? "red"
      : "gray";

  const filtered = allTagihan.filter((t) => {
    if (filterProgram !== "Semua" && t.program !== filterProgram) return false;
    if (filterStatus !== "Semua" && t.status !== filterStatus) return false;
    if (
      searchTagihan &&
      !t.no.toLowerCase().includes(searchTagihan.toLowerCase()) &&
      !t.noSP.toLowerCase().includes(searchTagihan.toLowerCase())
    )
      return false;
    return true;
  });

  const totalBruto = allTagihan.reduce((a, t) => a + calcTax(t.premi, t.tarif).imbalJasaBruto, 0);
  const totalNeto = allTagihan.reduce((a, t) => a + calcTax(t.premi, t.tarif).imbalJasaNeto, 0);
  const totalDenda = allTagihan.reduce(
    (a, t) => a + calcTax(t.premi, t.tarif, t.hariTerlambat).denda,
    0
  );
  const terlambatCount = allTagihan.filter((t) => t.hariTerlambat > 0).length;
  const lunasCount = allTagihan.filter((t) => t.status === "Dibayar").length;

  const riwayatTarif = [
    {
      tgl: "01 Jan 2026",
      prog: "TDS (Taspen Dwiguna Sejahtera)",
      lama: "2,0%",
      baru: "2,5%",
      oleh: "Kadiv Keuangan",
      ket: "Perjanjian Kerjasama Pemasaran & Administrasi 2026",
    },
    {
      tgl: "01 Jan 2026",
      prog: "TPB (Proteksi Beasiswa)",
      lama: "2,5%",
      baru: "3,0%",
      oleh: "Kadiv Keuangan",
      ket: "Peningkatan tarif imbal jasa program perlindungan anak",
    },
  ];

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Modal Parameter Tarif & Perpajakan */}
      {showTarif && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowTarif(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 660,
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: `1px solid ${COLORS.gray200}`,
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                background: "#0F172A",
                color: COLORS.white,
                borderRadius: "14px 14px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  Parameter Tarif Imbal Jasa &amp; Perpajakan BRD V5
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  Sesuai acuan BR-TL-08 &amp; Ketentuan Pajak UU HPP / PMK
                </div>
              </div>
              <button
                onClick={() => setShowTarif(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: COLORS.white,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Parameter Tarif Program */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.gray700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                1. Tarif Imbal Jasa per Program (Fee Base)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  {
                    l: "TDS (Taspen Dwiguna Sejahtera)",
                    v: tarifTDS,
                    set: setTarifTDS,
                    c: "blue",
                    note: "Khusus pensiunan dari potongan Tabungan Asuransi",
                  },
                  {
                    l: "TPB (Taspen Proteksi Beasiswa)",
                    v: tarifTPB,
                    set: setTarifTPB,
                    c: "orange",
                    note: "Program perlindungan beasiswa anak prajurit JKK/JKm",
                  },
                ].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      background: COLORS.gray50,
                      borderRadius: 8,
                      border: `1px solid ${COLORS.gray200}`,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Badge color={x.c}>{x.l.split(" ")[0]}</Badge>
                        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>
                          {x.l}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 4 }}>
                        {x.note}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        type="number"
                        step="0.1"
                        value={x.v}
                        onChange={(e) => x.set(Number(e.target.value))}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: `1px solid ${COLORS.gray300}`,
                          width: 75,
                          fontSize: 14,
                          textAlign: "right",
                          fontWeight: 700,
                        }}
                      />
                      <span style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Parameter Perpajakan & Denda */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.gray700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                2. Parameter Perpajakan &amp; Suku Bunga Denda (BI Rate)
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div style={{ padding: 12, background: COLORS.gray50, borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray800, marginBottom: 4 }}>
                    DPP PPN Nilai Lain
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.blueDark }}>
                    11 / 12 (91,67%)
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 2 }}>
                    Dasar Pengenaan Pajak
                  </div>
                </div>

                <div style={{ padding: 12, background: COLORS.gray50, borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray800, marginBottom: 4 }}>
                    Tarif PPN
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="number"
                      value={ppnRate}
                      onChange={(e) => setPpnRate(Number(e.target.value))}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        width: 60,
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    />
                    <span style={{ fontSize: 12 }}>%</span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 2 }}>
                    12% × DPP (efektif 11%)
                  </div>
                </div>

                <div style={{ padding: 12, background: COLORS.gray50, borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray800, marginBottom: 4 }}>
                    Suku Bunga BI Rate
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="number"
                      step="0.25"
                      value={biRate}
                      onChange={(e) => setBiRate(Number(e.target.value))}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        width: 60,
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    />
                    <span style={{ fontSize: 12 }}>%</span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 2 }}>
                    Acuan denda tahunan/365
                  </div>
                </div>
              </div>

              {/* Live Simulasi */}
              <div
                style={{
                  padding: 16,
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 10,
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
                  Simulasi Formula Resmi BRD V5 — Contoh Premi Rp 10.000.000 (Tarif TPB {tarifTPB}%)
                </div>
                {(() => {
                  const s = calcTax(10000000, tarifTPB);
                  return (
                    <div style={{ fontSize: 12, fontFamily: "monospace", color: "#14532D", lineHeight: 1.8 }}>
                      • <strong>Imbal Jasa Bruto:</strong> {fmt(s.imbalJasaBruto)} ({tarifTPB}% × Premi)<br />
                      • <strong>DPP 11/12:</strong> {fmt(s.dpp)} (11/12 × Imbal Jasa)<br />
                      • <strong>PPN 12%:</strong> +{fmt(s.ppn)} (12% × DPP)<br />
                      • <strong>PPh 23 (2%):</strong> −{fmt(s.pph23)} (2% × Imbal Jasa)<br />
                      • <strong>Jumlah Tagihan Bruto:</strong> {fmt(s.jumlahTagihan)} (Imbal Jasa + PPN)<br />
                      • <strong>Imbal Jasa Diterima (Neto):</strong>{" "}
                      <strong style={{ color: COLORS.blueDark, fontSize: 13 }}>
                        {fmt(s.imbalJasaNeto)}
                      </strong>{" "}
                      (Imbal Jasa + PPN − PPh 23)
                    </div>
                  );
                })()}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="ghost" size="sm" onClick={() => setShowTarif(false)}>
                  Batal
                </Btn>
                <Btn size="sm" onClick={() => setShowTarif(false)}>
                  Simpan Parameter
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Tagihan Lengkap */}
      {detailTagihan &&
        (() => {
          const t = detailTagihan;
          const c = calcTax(t.premi, t.tarif, t.hariTerlambat);
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={() => setDetailTagihan(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: COLORS.white,
                  borderRadius: 14,
                  width: 560,
                  maxHeight: "90vh",
                  overflow: "auto",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  border: `1px solid ${COLORS.gray200}`,
                }}
              >
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: `1px solid ${COLORS.gray200}`,
                    background: "#0F172A",
                    color: COLORS.white,
                    borderRadius: "14px 14px 0 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>
                      Surat Tagihan Imbal Jasa PT ASABRI (Persero)
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                      {t.no}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#CBD5E1", marginTop: 2 }}>
                      {t.program} • Periode {t.periode}
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailTagihan(null)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: COLORS.white,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Badge color={statusColor(t.status)}>
                      {t.hariTerlambat === 0 && t.status === "Dibayar"
                        ? "Dibayar tepat waktu"
                        : t.status}
                    </Badge>
                    <span style={{ fontSize: 12, color: COLORS.gray500 }}>
                      No. SP Premi: <strong style={{ color: COLORS.gray800 }}>{t.noSP}</strong>
                    </span>
                  </div>

                  {/* Rincian Header */}
                  <div
                    style={{
                      borderTop: `1px solid ${COLORS.gray200}`,
                      paddingTop: 14,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: COLORS.gray600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Informasi Penagihan
                    </div>
                    {[
                      ["Mitra Pembayar", "PT Asuransi Jiwa Taspen (Taspen Life)"],
                      ["Jumlah Polis Terkait", `${t.jmlPolis} Polis Peserta`],
                      ["Nama Peserta", t.pesertaContoh],
                      ["Tanggal Terbit", t.tglTerbit],
                      ["Jatuh Tempo (14 Hari Kerja)", t.jatuhTempo],
                      ["Tanggal Penerimaan Pembayaran", t.tglBayar || "— (Belum Diterima)"],
                    ].map(([label, val], i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          borderBottom: `1px solid ${COLORS.gray100}`,
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ color: COLORS.gray500 }}>{label}</span>
                        <span style={{ fontWeight: 600, color: COLORS.gray900 }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rincian Perpajakan BRD V5 */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: COLORS.gray600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Rincian Perhitungan Perpajakan (BRD Line 271-273)
                    </div>
                    {[
                      ["Total Premi Asuransi", fmt(t.premi)],
                      [`Imbal Jasa Bruto (${t.tarif}%)`, fmt(c.imbalJasaBruto)],
                      ["DPP PPN Nilai Lain (11/12 × Imbal Jasa)", fmt(c.dpp)],
                      [`PPN ${ppnRate}% (12% × DPP)`, "+ " + fmt(c.ppn)],
                      [`PPh 23 (2% × Imbal Jasa)`, "− " + fmt(c.pph23)],
                      ["Jumlah Tagihan Bruto ke Mitra (Imbal Jasa + PPN)", fmt(c.jumlahTagihan)],
                    ].map(([label, val], i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          borderBottom: `1px solid ${COLORS.gray100}`,
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ color: COLORS.gray600 }}>{label}</span>
                        <span style={{ fontWeight: 500, color: COLORS.gray800, fontFamily: "monospace" }}>
                          {val}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        fontSize: 13,
                        background: "#EFF6FF",
                        borderRadius: 6,
                        marginTop: 6,
                        paddingLeft: 8,
                        paddingRight: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: COLORS.blueDark }}>
                        Imbal Jasa Bersih Diterima (Neto)
                      </span>
                      <span style={{ fontWeight: 800, color: COLORS.blueDark, fontFamily: "monospace" }}>
                        {fmt(c.imbalJasaNeto)}
                      </span>
                    </div>
                  </div>

                  {/* Denda Keterlambatan */}
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: COLORS.gray600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 8,
                      }}
                    >
                      Denda Keterlambatan Pembayaran
                    </div>
                    {c.denda === 0 ? (
                      <div
                        style={{
                          background: "#F0FDF4",
                          borderRadius: 8,
                          padding: "10px 14px",
                          fontSize: 12.5,
                          color: "#166534",
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Tidak ada denda — pembayaran tepat waktu atau belum melewati jatuh tempo</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          borderRadius: 8,
                          padding: "10px 14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0",
                            fontSize: 12.5,
                          }}
                        >
                          <span style={{ color: COLORS.gray600 }}>Durasi Keterlambatan</span>
                          <span style={{ fontWeight: 700, color: COLORS.red }}>
                            {t.hariTerlambat} hari kalender
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0",
                            fontSize: 12.5,
                          }}
                        >
                          <span style={{ color: COLORS.gray600 }}>
                            Formula Denda (Tagihan × {biRate}% × {t.hariTerlambat} / 365)
                          </span>
                          <span style={{ fontWeight: 800, color: COLORS.red, fontFamily: "monospace" }}>
                            {fmt(c.denda)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderTop: `2px solid ${COLORS.gray300}`,
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.gray800 }}>
                      Grand Total Tagihan + Denda:
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: COLORS.gray900,
                        fontFamily: "monospace",
                      }}
                    >
                      {fmt(c.jumlahTagihan + c.denda)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "flex-end",
                      marginTop: 16,
                    }}
                  >
                    <Btn
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailTagihan(null);
                        setPreview({
                          title: `Surat Tagihan Imbal Jasa ${t.no}`,
                          subtitle: `PT Asuransi Jiwa Taspen • Periode ${t.periode}`,
                          type: "surat",
                          fileName: `Surat_Tagihan_${t.no}.pdf`,
                          content: {
                            noSurat: t.no,
                            tujuan: "Direksi PT Asuransi Jiwa Taspen (Taspen Life)",
                            periode: t.periode,
                            cutoff: t.jatuhTempo,
                            tanggal: t.tglTerbit,
                            items: [
                              {
                                jenis: `${t.program} (Imbal Jasa Bruto ${t.tarif}%)`,
                                peserta: `${t.jmlPolis} Polis`,
                                nominal: fmt(c.imbalJasaBruto),
                              },
                              {
                                jenis: `PPN ${ppnRate}% atas DPP Nilai Lain (${fmt(c.dpp)})`,
                                peserta: "—",
                                nominal: fmt(c.ppn),
                              },
                              {
                                jenis: `Potongan PPh 23 (2%)`,
                                peserta: "—",
                                nominal: `(${fmt(c.pph23)})`,
                              },
                              ...(c.denda > 0
                                ? [
                                    {
                                      jenis: `Denda Keterlambatan (${t.hariTerlambat} hari × BI Rate ${biRate}%)`,
                                      peserta: "—",
                                      nominal: fmt(c.denda),
                                    },
                                  ]
                                : []),
                            ],
                          },
                        });
                      }}
                    >
                      Cetak Surat Tagihan Resmi
                    </Btn>
                    <Btn size="sm" onClick={() => setDetailTagihan(null)}>
                      Tutup
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Action Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 4 }}>
            Pengelolaan &amp; penagihan imbal jasa (*management fee*) dari PT Asuransi Jiwa Taspen atas portofolio polis TPB &amp; TDS sesuai BRD Divisi Keuangan.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="ghost" onClick={() => setShowTarif(true)}>
            <Settings size={14} style={{ marginRight: 4 }} /> Parameter Tarif &amp; Pajak
          </Btn>
          <Btn
            variant="outline"
            onClick={() =>
              setPreview({
                title: "Laporan Tagihan Imbal Jasa Taspen Life",
                subtitle: "Rekapitulasi Imbal Jasa, Pajak DPP/PPN/PPh 23 & Denda Periode 2026",
                type: "table",
                fileName: "Tagihan_ImbalJasa_TaspenLife.xlsx",
                content: {
                  columns: [
                    "No Tagihan",
                    "Program",
                    "Periode",
                    "Premi Bruto",
                    "Imbal Jasa Bruto",
                    "PPN 12%",
                    "PPh 23",
                    "Neto Diterima",
                    "Denda",
                    "Status",
                  ],
                  rows: allTagihan.map((t) => {
                    const c = calcTax(t.premi, t.tarif, t.hariTerlambat);
                    return [
                      t.no,
                      progShort(t.program),
                      t.periode,
                      fmt(t.premi),
                      fmt(c.imbalJasaBruto),
                      fmt(c.ppn),
                      fmt(c.pph23),
                      fmt(c.imbalJasaNeto),
                      fmt(c.denda),
                      t.status,
                    ];
                  }),
                  totalRows: allTagihan.length,
                },
              })
            }
          >
            <FileSpreadsheet size={14} style={{ marginRight: 4 }} /> Ekspor Excel
          </Btn>
          <Btn
            onClick={() =>
              setPreview({
                title: "Surat Tagihan Imbal Jasa Resmi",
                subtitle: "Kompilasi Tagihan Aktif Periode Berjalan • Format Surat Resmi ASABRI",
                type: "surat",
                fileName: "Surat_Tagihan_ImbalJasa_Kompilasi.pdf",
                content: {
                  noSurat: "ASABRI/KEU/TIJ/2026/07/045",
                  tujuan: "PT Asuransi Jiwa Taspen (Taspen Life)",
                  periode: "Juni 2026",
                  cutoff: "10 Agustus 2026",
                  tanggal: "20 Agustus 2026",
                  items: allTagihan
                    .filter((t) => t.periode === "Juni 2026" || t.status === "Menunggu Pembayaran")
                    .map((t) => {
                      const c = calcTax(t.premi, t.tarif, t.hariTerlambat);
                      return {
                        jenis: `${t.program} — Imbal Jasa ${t.tarif}% (SP: ${t.noSP})`,
                        peserta: `${t.jmlPolis} Polis`,
                        nominal: fmt(c.jumlahTagihan),
                      };
                    }),
                },
              })
            }
          >
            <Receipt size={14} style={{ marginRight: 4 }} /> Terbitkan &amp; Kirim Surat Tagihan
          </Btn>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard
          icon={<Banknote size={IC} />}
          label="Total Imbal Jasa Bruto"
          value={fmt(totalBruto)}
          sub={`${allTagihan.length} tagihan terdata`}
          color={COLORS.blue}
        />
        <StatCard
          icon={<TrendingUp size={IC} />}
          label="Total Imbal Jasa Bersih (Neto)"
          value={fmt(totalNeto)}
          sub="Setelah PPN &amp; PPh 23"
          color="#7C3AED"
        />
        <StatCard
          icon={<CheckCircle2 size={IC} />}
          label="Tagihan Sudah Lunas"
          value={`${lunasCount} Tagihan`}
          sub={`Dari total ${allTagihan.length} tagihan`}
          color={COLORS.green}
        />
        <StatCard
          icon={<AlertTriangle size={IC} />}
          label="Total Denda Keterlambatan"
          value={fmt(totalDenda)}
          sub={`${terlambatCount} tagihan terlambat (BI Rate ${biRate}%)`}
          color={COLORS.red}
        />
      </div>

      {/* Tabs View: Tagihan SP vs Format BRD Rincian TPB & TDS */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          borderBottom: `2px solid ${COLORS.gray200}`,
        }}
      >
        {[
          { id: "tagihan", l: "Daftar Tagihan Imbal Jasa & Denda Keterlambatan" },
          { id: "rincian_brd", l: "Format BRD Rincian TPB & TDS (Line 271-273)" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              padding: "11px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: 600,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: subTab === t.id ? COLORS.blue : COLORS.gray500,
              borderBottom:
                subTab === t.id
                  ? `3px solid ${COLORS.blue}`
                  : "3px solid transparent",
              marginBottom: -2,
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: DAFTAR TAGIHAN & DENDA */}
      {subTab === "tagihan" && (
        <div
          style={{
            background: COLORS.white,
            borderRadius: 10,
            padding: 20,
            border: `1px solid ${COLORS.gray200}`,
          }}
        >
          <SectionTitle
            action={
              <span style={{ fontSize: 12, color: COLORS.gray500 }}>
                Tarif aktif: TDS {tarifTDS}% • TPB {tarifTPB}% • BI Rate {biRate}%
              </span>
            }
          >
            Daftar Surat Tagihan Imbal Jasa Taspen Life
          </SectionTitle>

          <div
            style={{
              background: "#FFFBEB",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 12.5,
              color: "#92400E",
              display: "flex",
              gap: 8,
            }}
          >
            <AlertTriangle size={16} />
            <span>
              <strong>Aturan Bisnis (BR-TL-05):</strong> Surat tagihan imbal jasa hanya dapat diterbitkan secara otomatis setelah pembayaran premi kepada Taspen Life selesai diproses dan Berita Acara tervalidasi.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Select
              label="Program"
              value={filterProgram}
              onChange={setFilterProgram}
              options={[
                "Semua",
                "TDS (Taspen Dwiguna Sejahtera)",
                "TPB - Proteksi Beasiswa JKK",
                "TPB - Proteksi Beasiswa JKm",
              ]}
              minW={220}
            />
            <Select
              label="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={["Semua", "Dibayar", "Terlambat", "Belum Dibayar", "Menunggu Pembayaran"]}
              minW={170}
            />
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: COLORS.gray500,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Pencarian
              </label>
              <SearchInput
                value={searchTagihan}
                onChange={setSearchTagihan}
                placeholder="Cari no. tagihan atau no. SP..."
                minW={240}
              />
            </div>
          </div>

          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{allTagihan.length}</strong> tagihan
          </div>

          {filtered.length === 0 ? (
            <NoData />
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 8,
                border: `1px solid #CBD5E1`,
                boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12.5,
                }}
              >
                <thead>
                  <tr style={{ background: "#0F172A", color: COLORS.white }}>
                    {[
                      "No. Tagihan",
                      "Program",
                      "No. SP Premi",
                      "Periode",
                      "Premi Bruto",
                      "Imbal Jasa (Bruto)",
                      "Neto Diterima",
                      "Jatuh Tempo",
                      "Denda BI Rate",
                      "Status",
                      "Aksi",
                    ].map((c, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "11px 13px",
                          textAlign: i === 4 || i === 5 || i === 6 || i === 8 ? "right" : "left",
                          fontWeight: 700,
                          color: COLORS.white,
                          borderBottom: `1px solid #334155`,
                          borderRight: i < 10 ? "1px solid #334155" : "none",
                          whiteSpace: "nowrap",
                          fontSize: 11.5,
                        }}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => {
                    const c = calcTax(t.premi, t.tarif, t.hariTerlambat);
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                          background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#F1F5F9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                        }
                      >
                        <td
                          style={{
                            padding: "10px 13px",
                            fontFamily: "monospace",
                            color: COLORS.blue,
                            fontWeight: 700,
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.no}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Badge color={progColor(t.program)}>
                            {progShort(t.program)}
                          </Badge>
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.noSP}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.periode}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(t.premi)}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 600,
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(c.imbalJasaBruto)}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "#7C3AED",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(c.imbalJasaNeto)}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.jatuhTempo}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: c.denda > 0 ? COLORS.red : COLORS.gray400,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {c.denda > 0 ? fmt(c.denda) : "—"}
                        </td>
                        <td
                          style={{
                            padding: "10px 13px",
                            borderRight: "1px solid #E2E8F0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Badge color={statusColor(t.status)}>{t.status}</Badge>
                        </td>
                        <td style={{ padding: "10px 13px", textAlign: "center" }}>
                          <Btn
                            size="xs"
                            variant="outline"
                            onClick={() => setDetailTagihan(t)}
                          >
                            Detail Tagihan
                          </Btn>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: FORMAT BRD RINCIAN TPB & TDS (Line 271-273) */}
      {subTab === "rincian_brd" && (
        <div
          style={{
            background: COLORS.white,
            borderRadius: 10,
            padding: 20,
            border: `1px solid ${COLORS.gray200}`,
          }}
        >
          <SectionTitle
            action={
              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Format BRD Rincian Imbal Jasa TPB & TDS",
                    subtitle: "Sesuai Format Kolom BRD V5 Line 271-273",
                    type: "table",
                    fileName: "Format_BRD_Rincian_ImbalJasa_TPB_TDS.xlsx",
                    content: {
                      columns: [
                        "No",
                        "Bulan",
                        "Peserta",
                        "KTPA",
                        "Nominal",
                        "No Polis",
                        "Tgl Polis",
                        "Tgl Bayar",
                        "Imbal Jasa",
                        "DPP 11/12",
                        "PPN 12%",
                        "PPh 23 (2%)",
                        "Tagihan",
                        "Diterima (Neto)",
                        "Tgl Terima",
                      ],
                      rows: rincianBRD.map((r, idx) => {
                        const c = calcTax(r.nominalPremi, r.tarif * 100);
                        return [
                          idx + 1,
                          r.bulan,
                          r.peserta,
                          r.ktpa,
                          fmt(r.nominalPremi),
                          r.noPolis,
                          r.tglPolis,
                          r.tglBayarPolis,
                          fmt(c.imbalJasaBruto),
                          fmt(c.dpp),
                          fmt(c.ppn),
                          fmt(c.pph23),
                          fmt(c.jumlahTagihan),
                          fmt(c.imbalJasaNeto),
                          r.tglTerima,
                        ];
                      }),
                      totalRows: rincianBRD.length,
                    },
                  })
                }
              >
                Ekspor Format BRD Excel
              </Btn>
            }
          >
            Tabel Rincian Imbal Jasa Per Peserta (Format Spesifikasi BRD V5)
          </SectionTitle>

          <div
            style={{
              padding: "10px 14px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 12,
              color: COLORS.gray600,
            }}
          >
            Format tabel di bawah menyajikan seluruh 15 kolom data resmi untuk <strong>Taspen Proteksi Beasiswa (TPB - 3%)</strong> dan <strong>Taspen Dwiguna Sejahtera (TDS - 2,5%)</strong> sebagaimana dispesifikasikan pada dokumen BRD Keuangan &amp; Perpajakan V5.
          </div>

          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: `1px solid #CBD5E1`,
              boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11.5,
              }}
            >
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {[
                    "No",
                    "Bulan",
                    "Peserta",
                    "KTPA",
                    "Nominal Premi",
                    "Nomor Polis",
                    "Tgl Polis",
                    "Tgl Bayar Polis",
                    "Imbal Jasa (Tarif)",
                    "DPP (11/12)",
                    "PPN (12%×DPP)",
                    "PPh 23 (2%)",
                    "Jml Tagihan",
                    "Imbal Jasa Diterima (Neto)",
                    "Tgl Terima",
                  ].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "9px 10px",
                        textAlign:
                          i === 4 || (i >= 8 && i <= 13) ? "right" : "left",
                        fontWeight: 700,
                        borderBottom: `1px solid #334155`,
                        borderRight: i < 14 ? "1px solid #334155" : "none",
                        whiteSpace: "nowrap",
                        fontSize: 11,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rincianBRD.map((r, i) => {
                  const c = calcTax(r.nominalPremi, r.tarif * 100);
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid #E2E8F0`,
                        background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F1F5F9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                      }
                    >
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "center",
                          color: "#64748B",
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.bulan}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontWeight: 700,
                          color: "#0F172A",
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.peserta}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "monospace",
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.ktpa}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: 600,
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {fmt(r.nominalPremi)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "monospace",
                          color: COLORS.blue,
                          fontWeight: 600,
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.noPolis}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.tglPolis}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.tglBayarPolis}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: 600,
                          color: "#0F172A",
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {fmt(c.imbalJasaBruto)} ({(r.tarif * 100).toFixed(1)}%)
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          color: COLORS.gray600,
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {fmt(c.dpp)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          color: "#16A34A",
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        +{fmt(c.ppn)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          color: COLORS.red,
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        −{fmt(c.pph23)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: 600,
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {fmt(c.jumlahTagihan)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: 800,
                          color: "#7C3AED",
                          borderRight: "1px solid #E2E8F0",
                        }}
                      >
                        {fmt(c.imbalJasaNeto)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          borderRight: "1px solid #E2E8F0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.tglTerima}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
