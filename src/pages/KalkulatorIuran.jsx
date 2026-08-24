import { useState } from "react";
import { BarChart3, Shield, Lock, FileText } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, Select, Btn, PreviewModal, SectionTitle, Table, NoData } from "../components/common";

export const KalkulatorIuran = () => {
  const [selectedSatker, setSelectedSatker] = useState(null);
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;
  const [batchTagihan, setBatchTagihan] = useState("Batch 1 (Tanggal 15)");
  const [selectedJenisTagihan, setSelectedJenisTagihan] = useState("-- Pilih Jenis Tagihan Premi --");

  const allSatkerData = [
    { kode: "TNI_AD", nama: "TNI AD", peserta: 3250, gp: 260.0, tht: 8.45, Pensiun: 12.35, jkk: 0.62, jkm: 0.52,
      gol: [
        { gol: "TAMTAMA (Golongan I)", peserta: 1100, gp: 66.0, tht: 2.15, Pensiun: 3.14, jkk: 0.16, jkm: 0.13 },
        { gol: "BINTARA (Golongan II)", peserta: 1250, gp: 100.0, tht: 3.25, Pensiun: 4.75, jkk: 0.24, jkm: 0.20 },
        { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 520, gp: 52.0, tht: 1.69, Pensiun: 2.47, jkk: 0.12, jkm: 0.10 },
        { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 310, gp: 37.2, tht: 1.21, Pensiun: 1.77, jkk: 0.09, jkm: 0.07 },
        { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 70, gp: 4.8, tht: 0.16, Pensiun: 0.23, jkk: 0.01, jkm: 0.01 },
      ]},
    { kode: "TNI_AL", nama: "TNI AL", peserta: 1420, gp: 113.6, tht: 3.69, Pensiun: 5.40, jkk: 0.27, jkm: 0.23,
      gol: [
        { gol: "TAMTAMA (Golongan I)", peserta: 450, gp: 27.0, tht: 0.88, Pensiun: 1.28, jkk: 0.06, jkm: 0.05 },
        { gol: "BINTARA (Golongan II)", peserta: 560, gp: 44.8, tht: 1.46, Pensiun: 2.13, jkk: 0.11, jkm: 0.09 },
        { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 260, gp: 26.0, tht: 0.85, Pensiun: 1.24, jkk: 0.06, jkm: 0.05 },
        { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 120, gp: 14.4, tht: 0.47, Pensiun: 0.68, jkk: 0.03, jkm: 0.03 },
        { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 30, gp: 1.4, tht: 0.05, Pensiun: 0.07, jkk: 0.003, jkm: 0.003 },
      ]},
    { kode: "TNI_AU", nama: "TNI AU", peserta: 1180, gp: 94.4, tht: 3.07, Pensiun: 4.48, jkk: 0.23, jkm: 0.19,
      gol: [
        { gol: "TAMTAMA (Golongan I)", peserta: 370, gp: 22.2, tht: 0.72, Pensiun: 1.05, jkk: 0.05, jkm: 0.04 },
        { gol: "BINTARA (Golongan II)", peserta: 480, gp: 38.4, tht: 1.25, Pensiun: 1.82, jkk: 0.09, jkm: 0.08 },
        { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 200, gp: 20.0, tht: 0.65, Pensiun: 0.95, jkk: 0.05, jkm: 0.04 },
        { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 105, gp: 12.6, tht: 0.41, Pensiun: 0.60, jkk: 0.03, jkm: 0.03 },
        { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 25, gp: 1.2, tht: 0.04, Pensiun: 0.06, jkk: 0.003, jkm: 0.002 },
      ]},
    { kode: "POLRI", nama: "POLRI (Anggota)", peserta: 3450, gp: 276.0, tht: 8.97, Pensiun: 13.11, jkk: 0.66, jkm: 0.55,
      gol: [
        { gol: "TAMTAMA (Golongan I)", peserta: 1050, gp: 63.0, tht: 2.05, Pensiun: 2.99, jkk: 0.15, jkm: 0.13 },
        { gol: "BINTARA (Golongan II)", peserta: 1420, gp: 113.6, tht: 3.69, Pensiun: 5.40, jkk: 0.27, jkm: 0.23 },
        { gol: "PAMA — Perwira Pertama (Golongan III)", peserta: 650, gp: 65.0, tht: 2.11, Pensiun: 3.09, jkk: 0.16, jkm: 0.13 },
        { gol: "PAMEN — Perwira Menengah (Golongan IV)", peserta: 280, gp: 30.8, tht: 1.00, Pensiun: 1.46, jkk: 0.07, jkm: 0.06 },
        { gol: "PATI — Perwira Tinggi (Golongan IV)", peserta: 50, gp: 3.6, tht: 0.12, Pensiun: 0.17, jkk: 0.01, jkm: 0.01 },
      ]},
    { kode: "PNS_POLRI", nama: "PNS POLRI", peserta: 1280, gp: 102.4, tht: 3.33, Pensiun: 4.86, jkk: 0.25, jkm: 0.20,
      gol: [
        { gol: "Golongan I", peserta: 220, gp: 11.0, tht: 0.36, Pensiun: 0.52, jkk: 0.03, jkm: 0.02 },
        { gol: "Golongan II", peserta: 480, gp: 33.6, tht: 1.09, Pensiun: 1.60, jkk: 0.08, jkm: 0.07 },
        { gol: "Golongan III", peserta: 420, gp: 37.8, tht: 1.23, Pensiun: 1.80, jkk: 0.09, jkm: 0.08 },
        { gol: "Golongan IV", peserta: 160, gp: 20.0, tht: 0.65, Pensiun: 0.95, jkk: 0.05, jkm: 0.04 },
      ]},
    { kode: "PPPK_POLRI", nama: "PPPK POLRI", peserta: 850, gp: 59.5, tht: 1.93, Pensiun: 2.83, jkk: 0.14, jkm: 0.12,
      gol: [
        { gol: "Golongan IX", peserta: 210, gp: 10.5, tht: 0.34, Pensiun: 0.50, jkk: 0.03, jkm: 0.02 },
        { gol: "Golongan X", peserta: 290, gp: 20.3, tht: 0.66, Pensiun: 0.96, jkk: 0.05, jkm: 0.04 },
        { gol: "Golongan XI", peserta: 230, gp: 18.4, tht: 0.60, Pensiun: 0.87, jkk: 0.04, jkm: 0.04 },
        { gol: "Golongan XII", peserta: 120, gp: 10.3, tht: 0.33, Pensiun: 0.49, jkk: 0.02, jkm: 0.02 },
      ]},
    { kode: "PNS_KEMHAN", nama: "PNS Kemenhan", peserta: 4618, gp: 323.3, tht: 10.51, Pensiun: 15.36, jkk: 0.77, jkm: 0.65,
      gol: [
        { gol: "Golongan I", peserta: 920, gp: 46.0, tht: 1.50, Pensiun: 2.19, jkk: 0.11, jkm: 0.09 },
        { gol: "Golongan II", peserta: 1580, gp: 110.6, tht: 3.59, Pensiun: 5.25, jkk: 0.26, jkm: 0.22 },
        { gol: "Golongan III", peserta: 1450, gp: 116.0, tht: 3.77, Pensiun: 5.51, jkk: 0.28, jkm: 0.23 },
        { gol: "Golongan IV", peserta: 668, gp: 50.7, tht: 1.65, Pensiun: 2.41, jkk: 0.12, jkm: 0.10 },
      ]},
    { kode: "PPPK_KEMHAN", nama: "PPPK Kemenhan", peserta: 2150, gp: 150.5, tht: 4.89, Pensiun: 7.15, jkk: 0.36, jkm: 0.30,
      gol: [
        { gol: "Golongan IX", peserta: 420, gp: 21.0, tht: 0.68, Pensiun: 1.00, jkk: 0.05, jkm: 0.04 },
        { gol: "Golongan X", peserta: 680, gp: 47.6, tht: 1.55, Pensiun: 2.26, jkk: 0.11, jkm: 0.10 },
        { gol: "Golongan XI", peserta: 620, gp: 49.6, tht: 1.61, Pensiun: 2.36, jkk: 0.12, jkm: 0.10 },
        { gol: "Golongan XII", peserta: 430, gp: 32.3, tht: 1.05, Pensiun: 1.53, jkk: 0.08, jkm: 0.06 },
      ]},
  ];

  const satkerData = filterSatker === "Semua" ? allSatkerData : allSatkerData.filter(s => s.kode === filterSatker || s.nama === filterSatker);

  const showCol = (jenis) => filterJenis === "Semua" || filterJenis === jenis;

  const totalTHT = satkerData.reduce((a, s) => a + s.tht, 0);
  const totalPensiun = satkerData.reduce((a, s) => a + s.Pensiun, 0);
  const totalJKK = satkerData.reduce((a, s) => a + s.jkk, 0);
  const totalJKM = satkerData.reduce((a, s) => a + s.jkm, 0);
  const totalPeserta = satkerData.reduce((a, s) => a + s.peserta, 0);

  const [preview, setPreview] = useState(null);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {showCol("THT") && <StatCard icon={<BarChart3 size={IC} />} label="Total Iuran THT" value={`Rp ${totalTHT.toFixed(2)} M`} sub="3,25% × (GP+T.Istri+T.Anak)" color={COLORS.blue} />}
        {showCol("Pensiun") && <StatCard icon={<BarChart3 size={IC} />} label="Total Iuran Pensiun" value={`Rp ${totalPensiun.toFixed(2)} M`} sub="4,75% × (GP+T.Istri+T.Anak)" color={COLORS.green} />}
        {showCol("JKK") && <StatCard icon={<Shield size={IC} />} label="Total Iuran JKK" value={`Rp ${totalJKK.toFixed(2)} M`} sub="0,24% × (GP+T.Istri+T.Anak)" color={COLORS.orange} />}
        {showCol("JKm") && <StatCard icon={<Lock size={IC} />} label="Total Iuran JKm" value={`Rp ${totalJKM.toFixed(2)} M`} sub="0,20% × (GP+T.Istri+T.Anak)" color="#7B1FA2" />}
      </div>

      {/* Panel 1: Filter Tampilan Rekap Tabel */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Awal</label>
          <input
            type="date"
            value={tglAwal}
            onChange={e => setTglAwal(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, color: COLORS.gray800, background: COLORS.white }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Akhir</label>
          <input
            type="date"
            value={tglAkhir}
            onChange={e => setTglAkhir(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, color: COLORS.gray800, background: COLORS.white }}
          />
        </div>
        <Select label="Satker" value={filterSatker} onChange={v => { setFilterSatker(v); setSelectedSatker(null); }} options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI", "PNS POLRI", "PPPK POLRI", "PNS Kemenhan", "PPPK Kemenhan"]} minW={160} />
        <Select label="Jenis Iuran (Tabel)" value={filterJenis} onChange={setFilterJenis} options={["Semua", "THT", "Pensiun", "JKK", "JKm"]} minW={120} />
        <div style={{ marginLeft: "auto" }}>
          <Btn variant="outline" onClick={() => setPreview({ title: "Preview Ekspor Data Iuran", subtitle: `Periode ${filterPeriode} • ${filterSatker === "Semua" ? "Seluruh Satker" : filterSatker}`, type: "table", fileName: `Rekap_Iuran_${filterPeriode.replace(" ", "_")}.xlsx`, content: { columns: ["Satker", "Peserta", "THT", "Pensiun", "JKK", "JKm", "Total"], rows: satkerData.map(s => [s.nama, s.peserta.toLocaleString(), `Rp ${s.tht} M`, `Rp ${s.Pensiun} M`, `Rp ${s.jkk} M`, `Rp ${s.jkm} M`, `Rp ${(s.tht+s.Pensiun+s.jkk+s.jkm).toFixed(2)} M`]), totalRows: satkerData.length } })}>Ekspor Data Rekap</Btn>
        </div>
      </div>

      {/* Panel 2: Section Penerbitan Tagihan Iuran Kemenkeu Otomatis */}
      <div style={{ background: "#F0F4F8", borderRadius: 10, padding: "18px 20px", border: `1px solid ${COLORS.blue}`, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.blueDark, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={16} />
          <span>Penerbitan Surat Tagihan Iuran Otomatis ke Kemenkeu</span>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Select
            label="Pilih Jenis & Batch Tagihan Otomatis"
            value={selectedJenisTagihan}
            onChange={setSelectedJenisTagihan}
            options={[
              "-- Pilih Jenis Tagihan Premi --",
              "Tagihan THT & Pensiun — Batch 1",
              "Tagihan THT & Pensiun — Batch 2",
              "Tagihan Iuran JKK",
              "Tagihan Iuran JKm"
            ]}
            minW={340}
          />

          <button
            disabled={selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --"}
            onClick={() => {
              if (selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --") return;

              if (selectedJenisTagihan.includes("Batch 1")) {
                const thtB1 = totalTHT * 0.8;
                const penB1 = totalPensiun * 0.8;
                const totB1 = thtB1 + penB1;

                setPreview({
                  title: "Surat Tagihan Iuran THT & Pensiun (Batch 1)",
                  subtitle: `Periode ${filterPeriode} • Cut-off 15 Juli 2026 (Gaji Induk) — Surat Tagihan ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_THT_Pensiun_Batch1_${filterPeriode.replace(" ", "_")}.pdf`,
                  content: {
                    noSurat: `001/ASABRI/TGH-THT-PEN-B1/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    cutoff: "15 Juli 2026",
                    batchInfo: "Batch 1 (Tanggal 15) — Gaji Induk / Termin 1",
                    tanggal: "15 Jul 2026",
                    items: [
                      { jenis: "Iuran THT (3,25% - Batch 1 Gaji Induk)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${thtB1.toFixed(2)} M` },
                      { jenis: "Iuran Pensiun (4,75% - Batch 1 Gaji Induk)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${penB1.toFixed(2)} M` },
                    ],
                    totalNominal: `Rp ${totB1.toFixed(2)} M`
                  }
                });
              } else if (selectedJenisTagihan.includes("Batch 2")) {
                const thtB2 = totalTHT * 0.2;
                const penB2 = totalPensiun * 0.2;
                const totB2 = thtB2 + penB2;

                setPreview({
                  title: "Surat Tagihan Iuran THT & Pensiun (Batch 2)",
                  subtitle: `Periode ${filterPeriode} • Cut-off 25 Juli 2026 (Gaji Susulan) — Surat Tagihan ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_THT_Pensiun_Batch2_${filterPeriode.replace(" ", "_")}.pdf`,
                  content: {
                    noSurat: `002/ASABRI/TGH-THT-PEN-B2/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    cutoff: "25 Juli 2026",
                    batchInfo: "Batch 2 (Tanggal 25) — Gaji Susulan & Rekonsiliasi",
                    tanggal: "25 Jul 2026",
                    items: [
                      { jenis: "Iuran THT (3,25% - Batch 2 Susulan/Kekurangan)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${thtB2.toFixed(2)} M` },
                      { jenis: "Iuran Pensiun (4,75% - Batch 2 Susulan/Kekurangan)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${penB2.toFixed(2)} M` },
                    ],
                    totalNominal: `Rp ${totB2.toFixed(2)} M`
                  }
                });
              } else if (selectedJenisTagihan.includes("JKK")) {
                setPreview({
                  title: "Surat Tagihan Iuran JKK (Bulanan)",
                  subtitle: `Periode ${filterPeriode} • Tagihan Bulanan Tunggal (1x Sebulan) ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_JKK_${filterPeriode.replace(" ", "_")}.pdf`,
                  content: {
                    noSurat: `003/ASABRI/TGH-JKK/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    cutoff: "25 Juli 2026",
                    batchInfo: "Tagihan Bulanan Tunggal (1x per Bulan)",
                    tanggal: "25 Jul 2026",
                    items: [
                      { jenis: "Iuran JKK (0,24% Basis Gaji Pokok)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalJKK.toFixed(2)} M` },
                    ],
                    totalNominal: `Rp ${totalJKK.toFixed(2)} M`
                  }
                });
              } else if (selectedJenisTagihan.includes("JKm")) {
                setPreview({
                  title: "Surat Tagihan Iuran JKm (Bulanan)",
                  subtitle: `Periode ${filterPeriode} • Tagihan Bulanan Tunggal (1x Sebulan) ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_JKm_${filterPeriode.replace(" ", "_")}.pdf`,
                  content: {
                    noSurat: `004/ASABRI/TGH-JKM/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    cutoff: "25 Juli 2026",
                    batchInfo: "Tagihan Bulanan Tunggal (1x per Bulan)",
                    tanggal: "25 Jul 2026",
                    items: [
                      { jenis: "Iuran JKm (0,20% Basis Gaji Pokok)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalJKM.toFixed(2)} M` },
                    ],
                    totalNominal: `Rp ${totalJKM.toFixed(2)} M`
                  }
                });
              }
            }}
            style={{
              padding: "9px 20px",
              borderRadius: 6,
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --" ? "not-allowed" : "pointer",
              background: selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --" ? COLORS.gray300 : COLORS.blueDark,
              color: selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --" ? COLORS.gray600 : COLORS.white,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --" ? "none" : "0 2px 6px rgba(13,71,161,0.3)"
            }}
          >
            <FileText size={14} /> Preview & Download Surat Tagihan
          </button>
        </div>

        {selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --" ? (
          <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>ℹ️ <strong>Ketentuan Sistem:</strong> Tagihan THT & Pensiun dibuat 2 batch dalam sebulan (Batch 1 pada Tgl 15 & Batch 2 pada Tgl 25). Tagihan JKK dan JKm terbit otomatis 1 kali sebulan pada Tgl 25.</span>
          </div>
        ) : (
          <div style={{ fontSize: 11.5, color: COLORS.blueDark, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>✅ Surat tagihan siap dipratinjau dengan data kalkulasi aktif ({totalPeserta.toLocaleString()} peserta).</span>
          </div>
        )}
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Iuran", subtitle: "Format Excel (.xlsx)", type: "table", fileName: "Rekap_Iuran_Satker.xlsx", content: { columns: ["Satker", "Peserta", "THT", "Pensiun", "JKK", "JKm"], rows: satkerData.map(s => [s.nama, s.peserta.toLocaleString(), "Rp "+s.tht+" M", "Rp "+s.Pensiun+" M", "Rp "+s.jkk+" M", "Rp "+s.jkm+" M"]), totalRows: satkerData.length } })}>Ekspor Excel</Btn><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Iuran", subtitle: "Format PDF", type: "table", fileName: "Rekap_Iuran_Satker.pdf", content: { columns: ["Satker", "Peserta", "THT", "Pensiun", "JKK", "JKm"], rows: satkerData.map(s => [s.nama, s.peserta.toLocaleString(), "Rp "+s.tht+" M", "Rp "+s.Pensiun+" M", "Rp "+s.jkk+" M", "Rp "+s.jkm+" M"]), totalRows: satkerData.length } })}>Ekspor PDF</Btn></div>}>Rekap Iuran per Instansi, Satker & Golongan {filterSatker !== "Semua" && `— ${filterSatker}`} {filterJenis !== "Semua" && `(${filterJenis})`}</SectionTitle>
        
        {satkerData.length === 0 ? <NoData /> : (() => {
          const groups = [
            {
              id: "TNI",
              name: "TENTARA NASIONAL INDONESIA (TNI)",
              bgColor: "#1B5E20",
              badgeBg: "#E8F5E9",
              badgeColor: "#2E7D32",
              items: satkerData.filter(s => s.kode.startsWith("TNI"))
            },
            {
              id: "POLRI",
              name: "KEPOLISIAN NEGARA REPUBLIK INDONESIA (POLRI)",
              bgColor: "#0D47A1",
              badgeBg: "#E3F2FD",
              badgeColor: "#1565C0",
              items: satkerData.filter(s => s.kode.includes("POLRI"))
            },
            {
              id: "KEMHAN",
              name: "KEMENTERIAN PERTAHANAN (KEMENHAN)",
              bgColor: "#4A148C",
              badgeBg: "#F3E5F5",
              badgeColor: "#6A1B9A",
              items: satkerData.filter(s => s.kode.includes("KEMHAN"))
            }
          ].filter(g => g.items.length > 0);

          return groups.map((grp, gi) => {
            const grpPeserta = grp.items.reduce((a, s) => a + s.peserta, 0);
            const grpTotalIuran = grp.items.reduce((a, s) => a + (showCol("THT") ? s.tht : 0) + (showCol("Pensiun") ? s.Pensiun : 0) + (showCol("JKK") ? s.jkk : 0) + (showCol("JKm") ? s.jkm : 0), 0);

            return (
              <div key={gi} style={{ marginBottom: 24, borderRadius: 10, border: `1px solid ${COLORS.gray300}`, overflow: "hidden", background: COLORS.white }}>
                {/* Group Header */}
                <div style={{ padding: "14px 18px", background: grp.bgColor, color: COLORS.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield size={22} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>{grp.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{grp.items.length} Sub-Satker • {grpPeserta.toLocaleString()} Peserta Aktif</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.85 }}>Subtotal Iuran</div>
                    <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>Rp {grpTotalIuran.toFixed(2)} M</div>
                  </div>
                </div>

                {/* Sub Satker Accordion Cards */}
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12, background: "#FAFBFD" }}>
                  {grp.items.map((s, si) => (
                    <div key={si} style={{ border: `1px solid ${COLORS.gray300}`, borderRadius: 8, overflow: "hidden", background: COLORS.white }}>
                      <div onClick={() => setSelectedSatker(selectedSatker === s.kode ? null : s.kode)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: selectedSatker === s.kode ? "#ECEFF1" : COLORS.gray50, color: COLORS.gray900, borderBottom: selectedSatker === s.kode ? `2px solid ${grp.bgColor}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ padding: "3px 8px", borderRadius: 4, background: grp.badgeBg, color: grp.badgeColor, fontWeight: 700, fontSize: 12 }}>{s.nama}</span>
                          <span style={{ fontSize: 12.5, color: COLORS.gray600 }}>({s.peserta.toLocaleString()} peserta)</span>
                        </div>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12.5 }}>
                          {showCol("THT") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>THT: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.tht} M</strong></div>}
                          {showCol("Pensiun") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>Pensiun: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.Pensiun} M</strong></div>}
                          {showCol("JKK") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>JKK: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.jkk} M</strong></div>}
                          {showCol("JKm") && <div style={{ textAlign: "right" }}><span style={{ color: COLORS.gray500, fontSize: 10 }}>JKm: </span><strong style={{ fontFamily: "monospace" }}>Rp {s.jkm} M</strong></div>}
                          <span style={{ fontSize: 14, color: COLORS.gray600 }}>{selectedSatker === s.kode ? "▼" : "▶"}</span>
                        </div>
                      </div>
                      {selectedSatker === s.kode && (
                        <div style={{ padding: 0 }}>
                          <Table
                            columns={["Golongan / Pangkat", "Jml Peserta", "Total GP+Tunj", ...(showCol("THT") ? ["Iuran THT (3,25%)"] : []), ...(showCol("Pensiun") ? ["Iuran Pensiun (4,75%)"] : []), ...(showCol("JKK") ? ["Iuran JKK (0,24%)"] : []), ...(showCol("JKm") ? ["Iuran JKm (0,20%)"] : []), "Total"]}
                            data={s.gol.map(g => [
                              <span style={{ fontWeight: 600 }}>{g.gol}</span>, g.peserta.toLocaleString(), `Rp ${g.gp} M`,
                              ...(showCol("THT") ? [`Rp ${g.tht} M`] : []), ...(showCol("Pensiun") ? [`Rp ${g.Pensiun} M`] : []),
                              ...(showCol("JKK") ? [`Rp ${g.jkk} M`] : []), ...(showCol("JKm") ? [`Rp ${g.jkm} M`] : []),
                              <span style={{ fontWeight: 700 }}>Rp {((showCol("THT") ? g.tht : 0) + (showCol("Pensiun") ? g.Pensiun : 0) + (showCol("JKK") ? g.jkk : 0) + (showCol("JKm") ? g.jkm : 0)).toFixed(2)} M</span>,
                            ])}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          });
        })()}

        <div style={{ marginTop: 16, padding: "14px 16px", background: "#E3F2FD", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.blueDark }}>Grand Total {filterSatker !== "Semua" ? filterSatker : "Seluruh Instansi & Satker"} {filterJenis !== "Semua" ? `(${filterJenis})` : ""}</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: COLORS.blueDark }}>Rp {((showCol("THT") ? totalTHT : 0) + (showCol("Pensiun") ? totalPensiun : 0) + (showCol("JKK") ? totalJKK : 0) + (showCol("JKm") ? totalJKM : 0)).toFixed(2)} M</span>
        </div>
      </div>
    </div>
  );
};
