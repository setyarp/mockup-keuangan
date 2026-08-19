import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { COLORS } from "../constants/colors";
import { SectionTitle, Select, Table, Badge, Btn, NoData, PreviewModal } from "../components/common";

export const RekonsIuran = () => {
  const [tab, setTab] = useState("tht_pensiun");
  const [filterJenis, setFilterJenis] = useState("THT");
  const [filterJenisJKK, setFilterJenisJKK] = useState("Semua");
  const [preview, setPreview] = useState(null);
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;

  const fmtB = n => `Rp ${n.toLocaleString("id-ID")}`;

  // Data Tab 1: Rekon THT/Pensiun vs SKP-PFK Kemenkeu
  const allRekonData = {
    THT: [
      { satker: "TNI AD", sistem: 8450000000, skp: 8450000000 },
      { satker: "TNI AL", sistem: 3690000000, skp: 3690000000 },
      { satker: "TNI AU", sistem: 3070000000, skp: 3070000000 },
      { satker: "POLRI (Anggota)", sistem: 8970000000, skp: 9025000000 },
      { satker: "PNS POLRI", sistem: 3330000000, skp: 3330000000 },
      { satker: "PPPK POLRI", sistem: 1930000000, skp: 1930000000 },
      { satker: "PNS Kemenhan", sistem: 10510000000, skp: 10510000000 },
      { satker: "PPPK Kemenhan", sistem: 4890000000, skp: 4890000000 },
    ],
    Pensiun: [
      { satker: "TNI AD", sistem: 12350000000, skp: 12350000000 },
      { satker: "TNI AL", sistem: 5400000000, skp: 5400000000 },
      { satker: "TNI AU", sistem: 4480000000, skp: 4480000000 },
      { satker: "POLRI (Anggota)", sistem: 13110000000, skp: 13200000000 },
      { satker: "PNS POLRI", sistem: 4860000000, skp: 4860000000 },
      { satker: "PPPK POLRI", sistem: 2830000000, skp: 2830000000 },
      { satker: "PNS Kemenhan", sistem: 15360000000, skp: 15360000000 },
      { satker: "PPPK Kemenhan", sistem: 7150000000, skp: 7150000000 },
    ],
  };

  const rekonRows = (allRekonData[filterJenis] || []).filter(r => filterSatker === "Semua" || r.satker === filterSatker);
  const totalSistem = rekonRows.reduce((a, r) => a + r.sistem, 0);
  const totalSKP = rekonRows.reduce((a, r) => a + r.skp, 0);

  // Data Tab 2: Rekon JKK/JKm vs Data Kepesertaan
  const rekonJKKData = [
    { satker: "TNI AD", pesertaAktif: 3250, realisasiJKK: 620000000, realisasiJKM: 520000000, potensiKepesertaan: 1140000000, status: "Match" },
    { satker: "TNI AL", pesertaAktif: 1420, realisasiJKK: 270000000, realisasiJKM: 230000000, potensiKepesertaan: 500000000, status: "Match" },
    { satker: "TNI AU", pesertaAktif: 1180, realisasiJKK: 230000000, realisasiJKM: 190000000, potensiKepesertaan: 420000000, status: "Match" },
    { satker: "POLRI (Anggota)", pesertaAktif: 3450, realisasiJKK: 660000000, realisasiJKM: 550000000, potensiKepesertaan: 1240000000, status: "Selisih Data" },
    { satker: "PNS POLRI", pesertaAktif: 1280, realisasiJKK: 250000000, realisasiJKM: 200000000, potensiKepesertaan: 450000000, status: "Match" },
    { satker: "PPPK POLRI", pesertaAktif: 850, realisasiJKK: 140000000, realisasiJKM: 120000000, potensiKepesertaan: 260000000, status: "Match" },
    { satker: "PNS Kemenhan", pesertaAktif: 4618, realisasiJKK: 770000000, realisasiJKM: 650000000, potensiKepesertaan: 1420000000, status: "Match" },
    { satker: "PPPK Kemenhan", pesertaAktif: 2150, realisasiJKK: 360000000, realisasiJKM: 300000000, potensiKepesertaan: 660000000, status: "Match" },
  ];

  const jkkFiltered = rekonJKKData.filter(r => filterSatker === "Semua" || r.satker === filterSatker);
  const totalRealisasiJKK = jkkFiltered.reduce((a, r) => a + (filterJenisJKK === "JKm" ? 0 : r.realisasiJKK), 0);
  const totalRealisasiJKM = jkkFiltered.reduce((a, r) => a + (filterJenisJKK === "JKK" ? 0 : r.realisasiJKM), 0);
  const totalRealJKKCombined = totalRealisasiJKK + totalRealisasiJKM;
  const totalPotensiKepesertaan = jkkFiltered.reduce((a, r) => a + r.potensiKepesertaan, 0);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "tht_pensiun", label: "Perbandingan THT/Pensiun vs SKP-PFK Kemenkeu" },
          { id: "jkk_jkm", label: "Perbandingan JKK/JKm vs Data Kepesertaan" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "12px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: 700,
              background: "transparent",
              color: tab === t.id ? COLORS.blue : COLORS.gray600,
              borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
              marginBottom: -2,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: THT & PENSIUN VS SKP-PFK */}
      {tab === "tht_pensiun" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
          <SectionTitle>Rekonsiliasi Iuran THT/Pensiun vs SKP-PFK Kemenkeu</SectionTitle>
          <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F57F17", display: "flex", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={14} />
            <span>Rekonsiliasi tab ini khusus membandingkan penerimaan <strong>THT (3,25%)</strong> dan <strong>Pensiun (4,75%)</strong> terhadap acuan penerimaan SKP-PFK Kementerian Keuangan.</span>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
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
            <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["THT", "Pensiun"]} minW={120} />
            <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI (Anggota)", "PNS POLRI", "PPPK POLRI", "PNS Kemenhan", "PPPK Kemenhan"]} minW={160} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "#E3F2FD", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total Target Realisasi ({filterJenis})</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue }}>{fmtB(totalSistem)}</div>
            </div>
            <div style={{ background: "#E8F5E9", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total SKP-PFK Kemenkeu</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.green }}>{fmtB(totalSKP)}</div>
            </div>
            <div style={{ background: totalSKP - totalSistem !== 0 ? COLORS.redLight : COLORS.greenLight, borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Selisih</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: totalSKP - totalSistem !== 0 ? COLORS.red : COLORS.green }}>{fmtB(Math.abs(totalSKP - totalSistem))}</div>
              {totalSKP - totalSistem !== 0 && <div style={{ fontSize: 11, color: COLORS.red }}>{totalSKP > totalSistem ? "SKP-PFK > Target Realisasi" : "Target Realisasi > SKP-PFK"}</div>}
              {totalSKP - totalSistem === 0 && <div style={{ fontSize: 11, color: COLORS.green }}>✅ Matched</div>}
            </div>
          </div>

          {rekonRows.length === 0 ? <NoData /> : (
            <Table columns={["Satker", "Target Realisasi", "SKP-PFK Kemenkeu", "Selisih", "Status", "Drill-down"]}
              data={rekonRows.map(r => {
                const sel = r.skp - r.sistem;
                return [
                  sel !== 0 ? <span style={{ color: COLORS.red, fontWeight: 600 }}>{r.satker}</span> : r.satker,
                  fmtB(r.sistem), fmtB(r.skp),
                  sel !== 0 ? <span style={{ color: COLORS.red, fontWeight: 700 }}>{fmtB(Math.abs(sel))}</span> : "Rp 0",
                  <Badge color={sel === 0 ? "green" : "red"}>{sel === 0 ? "Match" : "Selisih"}</Badge>,
                  sel !== 0 ? <Btn size="sm" variant="outline">Detail</Btn> : "—",
                ];
              })}
            />
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Rekonsiliasi THT/Pensiun vs SKP-PFK", subtitle: "Periode " + filterPeriode + " • " + filterJenis, type: "table", fileName: `Rekon_THT_Pensiun_SKP_${filterPeriode.replace(" ","_")}.xlsx`, content: { columns: ["Satker", "Target Realisasi", "SKP-PFK", "Selisih"], rows: rekonRows.map(r => [r.satker, fmtB(r.sistem), fmtB(r.skp), fmtB(Math.abs(r.skp - r.sistem))]), totalRows: rekonRows.length } })}>Unduh Excel</Btn>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Rekonsiliasi THT/Pensiun vs SKP-PFK", subtitle: "Format PDF", type: "table", fileName: `Rekon_THT_Pensiun_SKP_${filterPeriode.replace(" ","_")}.pdf`, content: { columns: ["Satker", "Target Realisasi", "SKP-PFK", "Selisih"], rows: rekonRows.map(r => [r.satker, fmtB(r.sistem), fmtB(r.skp), fmtB(Math.abs(r.skp - r.sistem))]), totalRows: rekonRows.length } })}>Unduh PDF</Btn>
          </div>
        </div>
      )}

      {/* TAB 2: JKK & JKM VS DATA KEPESERTAAN */}
      {tab === "jkk_jkm" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
          <SectionTitle>Rekonsiliasi Iuran JKK/JKm vs Data Kepesertaan</SectionTitle>
          <div style={{ background: "#E8F5E9", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#2E7D32", display: "flex", gap: 8, marginBottom: 16 }}>
            <CheckCircle2 size={14} />
            <span>Rekonsiliasi realisasi iuran per program <strong>JKK</strong> dan <strong>JKm</strong> dipadankan dengan <strong>Data Kepesertaan Aktif</strong> & kalkulasi potensi basis gaji peserta.</span>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
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
            <Select label="Program" value={filterJenisJKK} onChange={setFilterJenisJKK} options={["Semua", "JKK", "JKm"]} minW={120} />
            <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI (Anggota)", "PNS POLRI", "PPPK POLRI", "PNS Kemenhan", "PPPK Kemenhan"]} minW={160} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: "#FFF3E0", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total Realisasi Penerimaan (JKK+JKm)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.orange }}>{fmtB(totalRealJKKCombined)}</div>
            </div>
            <div style={{ background: "#E3F2FD", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total Potensi Data Kepesertaan</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue }}>{fmtB(totalPotensiKepesertaan)}</div>
            </div>
            <div style={{ background: Math.abs(totalRealJKKCombined - totalPotensiKepesertaan) > 10000000 ? COLORS.redLight : COLORS.greenLight, borderRadius: 8, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Selisih Realisasi vs Kepesertaan</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Math.abs(totalRealJKKCombined - totalPotensiKepesertaan) > 10000000 ? COLORS.red : COLORS.green }}>{fmtB(Math.abs(totalRealJKKCombined - totalPotensiKepesertaan))}</div>
              {Math.abs(totalRealJKKCombined - totalPotensiKepesertaan) <= 10000000 ? <div style={{ fontSize: 11, color: COLORS.green }}>✅ Data Sesuai</div> : <div style={{ fontSize: 11, color: COLORS.red }}>⚠️ Terdapat Selisih Data</div>}
            </div>
          </div>

          {jkkFiltered.length === 0 ? <NoData /> : (
            <Table columns={["Satker", "Jml Peserta Aktif", ...(filterJenisJKK !== "JKm" ? ["Realisasi JKK"] : []), ...(filterJenisJKK !== "JKK" ? ["Realisasi JKm"] : []), "Potensi Kepesertaan", "Selisih", "Status"]}
              data={jkkFiltered.map(r => {
                const totalReal = (filterJenisJKK === "JKm" ? 0 : r.realisasiJKK) + (filterJenisJKK === "JKK" ? 0 : r.realisasiJKM);
                const sel = r.potensiKepesertaan - totalReal;
                return [
                  r.satker,
                  r.pesertaAktif.toLocaleString(),
                  ...(filterJenisJKK !== "JKm" ? [fmtB(r.realisasiJKK)] : []),
                  ...(filterJenisJKK !== "JKK" ? [fmtB(r.realisasiJKM)] : []),
                  fmtB(r.potensiKepesertaan),
                  sel !== 0 ? <span style={{ color: COLORS.red, fontWeight: 700 }}>{fmtB(Math.abs(sel))}</span> : "Rp 0",
                  <Badge color={r.status === "Match" ? "green" : "red"}>{r.status}</Badge>
                ];
              })}
            />
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Rekonsiliasi JKK/JKm vs Data Kepesertaan", subtitle: "Periode " + filterPeriode, type: "table", fileName: `Rekon_JKK_JKM_Kepesertaan_${filterPeriode.replace(" ","_")}.xlsx`, content: { columns: ["Satker", "Peserta", "Realisasi JKK", "Realisasi JKm", "Potensi Kepesertaan", "Selisih"], rows: jkkFiltered.map(r => [r.satker, r.pesertaAktif.toLocaleString(), fmtB(r.realisasiJKK), fmtB(r.realisasiJKM), fmtB(r.potensiKepesertaan), fmtB(Math.abs(r.potensiKepesertaan - (r.realisasiJKK + r.realisasiJKM)))]), totalRows: jkkFiltered.length } })}>Unduh Excel</Btn>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Rekonsiliasi JKK/JKm vs Data Kepesertaan", subtitle: "Format PDF", type: "table", fileName: `Rekon_JKK_JKM_Kepesertaan_${filterPeriode.replace(" ","_")}.pdf`, content: { columns: ["Satker", "Peserta", "Realisasi JKK", "Realisasi JKm", "Potensi Kepesertaan", "Selisih"], rows: jkkFiltered.map(r => [r.satker, r.pesertaAktif.toLocaleString(), fmtB(r.realisasiJKK), fmtB(r.realisasiJKM), fmtB(r.potensiKepesertaan), fmtB(Math.abs(r.potensiKepesertaan - (r.realisasiJKK + r.realisasiJKM)))]), totalRows: jkkFiltered.length } })}>Unduh PDF</Btn>
          </div>
        </div>
      )}
    </div>
  );
};
