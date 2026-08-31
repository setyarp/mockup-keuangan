import { useState } from "react";
import { Cross, Banknote, CheckCircle2, Users } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const RekonBPJS = () => {
  const [tglAwal, setTglAwal] = useState("2026-06-01");
  const [tglAkhir, setTglAkhir] = useState("2026-06-30");
  const filterBulan = `${tglAwal} s.d. ${tglAkhir}`;
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [activeTab, setActiveTab] = useState("rekap");
  const [searchPeserta, setSearchPeserta] = useState("");
  const [preview, setPreview] = useState(null);

  const fmt = n => `Rp ${Math.abs(n).toLocaleString("id-ID")}`;
  const fmtJiwa = n => `${n.toLocaleString("id-ID")} Jiwa`;

  // Data Rekon BPJS Kesehatan Sesuai MAK & Target Rekap III pada Menu DAPEM
  const rekapData = [
    { no: "1", mak: "513113", kelompok: "PENS PNS KEMHAN", namaKelompok: "Pensiunan PNS Kemenhan (513113)", jiwa: 2160, penerima: 1340, targetRekap3: 52880600, realisasi: 52880600 },
    { no: "2", mak: "513114", kelompok: "PENS PNS POLRI", namaKelompok: "Pensiunan PNS POLRI (513114)", jiwa: 522, penerima: 324, targetRekap3: 12399100, realisasi: 12399100 },
    { no: "3", mak: "513122", kelompok: "PENS TNI", namaKelompok: "Pensiunan TNI (513122)", jiwa: 8806, penerima: 5253, targetRekap3: 192179800, realisasi: 192179800 },
    { no: "4", mak: "513123", kelompok: "PENS POLRI", namaKelompok: "Pensiunan POLRI (513123)", jiwa: 5948, penerima: 3475, targetRekap3: 98358279, realisasi: 98358279 },
  ];

  const filteredRekap = filterKelompok === "Semua" ? rekapData : rekapData.filter(r => r.mak === filterKelompok || r.kelompok === filterKelompok);
  const totalJiwa = filteredRekap.reduce((a, r) => a + r.jiwa, 0);
  const totalPenerima = filteredRekap.reduce((a, r) => a + r.penerima, 0);
  const totalTarget = filteredRekap.reduce((a, r) => a + r.targetRekap3, 0);
  const totalRealisasi = filteredRekap.reduce((a, r) => a + r.realisasi, 0);
  const totalKompensasi = totalRealisasi - totalTarget;

  const detailPeserta = [
    { nrp: "198701234", nama: "Purn. Kol. Inf. Ahmad Fauzi", mak: "513122", kelompok: "PENS TNI", unor: "Kodam Jaya", target: 38500, realisasi: 38500, kompensasi: 0, alasan: "—" },
    { nrp: "197803456", nama: "Purn. Letkol Laut Bambang Suharto", mak: "513122", kelompok: "PENS TNI", unor: "Koarmada I", target: 36200, realisasi: 36200, kompensasi: 0, alasan: "—" },
    { nrp: "198512345", nama: "Purn. AKP Dedi Kurniawan", mak: "513123", kelompok: "PENS POLRI", unor: "Polda Jabar", target: 28500, realisasi: 28500, kompensasi: 0, alasan: "—" },
    { nrp: "198802345", nama: "Purn. Bripka Anwar Ibrahim", mak: "513123", kelompok: "PENS POLRI", unor: "Polda Jateng", target: 24200, realisasi: 24200, kompensasi: 0, alasan: "—" },
    { nrp: "198604321", nama: "Purn. Penata Tk.I Siti Nurhaliza", mak: "513113", kelompok: "PENS PNS KEMHAN", unor: "Ditjen Renhan", target: 26500, realisasi: 26500, kompensasi: 0, alasan: "—" },
    { nrp: "198211111", nama: "Purn. Pembina Dr. Ratna Dewi", mak: "513113", kelompok: "PENS PNS KEMHAN", unor: "Itjen Kemhan", target: 32000, realisasi: 32000, kompensasi: 0, alasan: "—" },
    { nrp: "199205678", nama: "Purn. Penata Budi Utomo", mak: "513114", kelompok: "PENS PNS POLRI", unor: "Mabes Polri", target: 25800, realisasi: 25800, kompensasi: 0, alasan: "—" },
    { nrp: "199012345", nama: "Purn. Pengatur Tk.I Hendra W.", mak: "513114", kelompok: "PENS PNS POLRI", unor: "Polda Metro Jaya", target: 21400, realisasi: 21400, kompensasi: 0, alasan: "—" },
  ];

  const filteredPeserta = detailPeserta.filter(p => {
    if (filterKelompok !== "Semua" && p.mak !== filterKelompok && p.kelompok !== filterKelompok) return false;
    if (searchPeserta && !p.nama.toLowerCase().includes(searchPeserta.toLowerCase()) && !p.nrp.includes(searchPeserta)) return false;
    return true;
  });

  const setoranLog = [
    {
      no: 1,
      bulan: "Juni 2026",
      mak: "513113",
      kelompok: "PENS PNS KEMHAN (513113)",
      peserta: 2160,
      totalRekap3: 52880600,
      potongDapem: 52880600,
      setoranNtpn: 52880600,
      ntpn: "761928005288CDEF",
      tglSetor: "10 Jun 2026",
      selisih: 0,
    },
    {
      no: 2,
      bulan: "Juni 2026",
      mak: "513114",
      kelompok: "PENS PNS POLRI (513114)",
      peserta: 522,
      totalRekap3: 12399100,
      potongDapem: 12399100,
      setoranNtpn: 12399100,
      ntpn: "651837001239DEFG",
      tglSetor: "10 Jun 2026",
      selisih: 0,
    },
    {
      no: 3,
      bulan: "Juni 2026",
      mak: "513122",
      kelompok: "PENS TNI (513122)",
      peserta: 8806,
      totalRekap3: 192179800,
      potongDapem: 192179800,
      setoranNtpn: 192179800,
      ntpn: "981245019217ABCD",
      tglSetor: "10 Jun 2026",
      selisih: 0,
    },
    {
      no: 4,
      bulan: "Juni 2026",
      mak: "513123",
      kelompok: "PENS POLRI (513123)",
      peserta: 5948,
      totalRekap3: 98358279,
      potongDapem: 98358279,
      setoranNtpn: 98358279,
      ntpn: "871239009835BCDE",
      tglSetor: "10 Jun 2026",
      selisih: 0,
    },
  ];

  const filteredSetoran = setoranLog.filter(s => {
    if (filterKelompok !== "Semua" && s.mak !== filterKelompok && !s.kelompok.includes(filterKelompok)) return false;
    return true;
  });
  const totalSetoranPeserta = filteredSetoran.reduce((a, s) => a + s.peserta, 0);
  const totalSetoranRekap3 = filteredSetoran.reduce((a, s) => a + s.totalRekap3, 0);
  const totalSetoranPotongDapem = filteredSetoran.reduce((a, s) => a + s.potongDapem, 0);
  const totalSetoranNtpn = filteredSetoran.reduce((a, s) => a + s.setoranNtpn, 0);
  const totalSetoranSelisih = totalSetoranNtpn - totalSetoranRekap3;

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Info Distribusi */}
      <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "12px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, border: `1px solid ${COLORS.blue}40` }}>
        <span style={{ color: "#0F172A" }}>Dokumen Rekonsiliasi Iuran BPJS Kesehatan (ASKES) diselaraskan langsung dengan <strong>4 MAK DAPEM Resmi (Rekapitulasi III)</strong> untuk didistribusikan ke <strong>BPJS Kesehatan</strong> dan <strong>DJPb Kemenkeu</strong>.</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Laporan Rekonsiliasi BPJS Kesehatan (Rekap III DAPEM)", subtitle: `Periode ${filterBulan} — Format Resmi DJPb`, type: "table", fileName: `Rekonsiliasi_BPJS_DAPEM_${filterBulan.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`, content: { columns: ["No", "Kode MAK", "Kelompok Pensiun DAPEM", "Total Jiwa", "Target Rekap III (Pot. ASKES)", "Realisasi Setoran", "Kompensasi (+/-)"], rows: filteredRekap.map(r => [r.no, r.mak, r.namaKelompok, fmtJiwa(r.jiwa), fmt(r.targetRekap3), fmt(r.realisasi), (r.realisasi - r.targetRekap3 >= 0 ? "+" : "-") + " " + fmt(r.realisasi - r.targetRekap3)]), totalRows: filteredRekap.length + 1 } })}>Ekspor Excel</Btn>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Laporan Rekonsiliasi BPJS Kesehatan (Rekap III DAPEM)", subtitle: `Periode ${filterBulan} — Format Resmi PDF`, type: "table", fileName: `Rekonsiliasi_BPJS_DAPEM_${filterBulan.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`, content: { columns: ["No", "Kode MAK", "Kelompok Pensiun DAPEM", "Total Jiwa", "Target Rekap III (Pot. ASKES)", "Realisasi Setoran", "Kompensasi (+/-)"], rows: filteredRekap.map(r => [r.no, r.mak, r.namaKelompok, fmtJiwa(r.jiwa), fmt(r.targetRekap3), fmt(r.realisasi), (r.realisasi - r.targetRekap3 >= 0 ? "+" : "-") + " " + fmt(r.realisasi - r.targetRekap3)]), totalRows: filteredRekap.length + 1 } })}>Ekspor PDF</Btn>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Cross size={IC} />} label="Target Rekap III BPJS (ASKES)" value={fmt(totalTarget)} sub={`4 Kelompok MAK DAPEM • ${fmtJiwa(totalJiwa)}`} color={COLORS.blue} />
        <StatCard icon={<Banknote size={IC} />} label="Realisasi Setoran BPJS" value={fmt(totalRealisasi)} sub="Setoran Kas Negara Tervalidasi" color={COLORS.green} />
        <StatCard icon={<CheckCircle2 size={IC} />} label="Kompensasi (+/-)" value={totalKompensasi === 0 ? "Rp 0 (Match)" : (totalKompensasi >= 0 ? "+" : "-") + " " + fmt(totalKompensasi)} sub={totalKompensasi === 0 ? "100% Selaras dengan Rekap III DAPEM" : totalKompensasi > 0 ? "Lebih setor" : "Kurang setor"} color={COLORS.green} />
        <StatCard icon={<Users size={IC} />} label="Total Jiwa Penerima DAPEM" value={fmtJiwa(totalJiwa)} sub={`${fmtJiwa(totalPenerima)} Penerima Manfaat`} color={COLORS.blueDark} />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid #E2E8F0` }}>
        {[
          { id: "rekap", label: "Rekap Per MAK DAPEM (Rekapitulasi III)" },
          { id: "detail", label: "Detail Nominatif Peserta" },
          { id: "setoran", label: "Riwayat Setoran NTPN Kas Negara" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "11px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              background: "transparent",
              color: activeTab === t.id ? "#0F172A" : "#64748B",
              borderBottom: activeTab === t.id ? `3px solid #0F172A` : "3px solid transparent",
              marginBottom: -2
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1 — Rekap Per Kelompok MAK DAPEM */}
      {activeTab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid #CBD5E1`, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
          <SectionTitle>Rekapitulasi Iuran BPJS Kesehatan per Kelompok MAK DAPEM</SectionTitle>

          {/* Filter Toolbar Tab Rekap */}
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 16px", border: `1px solid #CBD5E1`, marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Tanggal Awal</label>
              <input
                type="date"
                value={tglAwal}
                onChange={e => setTglAwal(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Tanggal Akhir</label>
              <input
                type="date"
                value={tglAkhir}
                onChange={e => setTglAkhir(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Kelompok MAK DAPEM</label>
              <select
                value={filterKelompok}
                onChange={e => setFilterKelompok(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600, minWidth: 200 }}
              >
                <option value="Semua">Semua MAK (4 Kelompok)</option>
                <option value="513113">1. PNS KEMHAN (513113)</option>
                <option value="513114">2. PNS POLRI (513114)</option>
                <option value="513122">3. PENS TNI (513122)</option>
                <option value="513123">4. PENS POLRI (513123)</option>
              </select>
            </div>
            {filterKelompok !== "Semua" && (
              <button
                onClick={() => setFilterKelompok("Semua")}
                style={{ background: "none", border: "none", color: "#DC2626", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}
              >
                ✕ Reset Filter
              </button>
            )}
          </div>

          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 800, width: 50, borderRight: "1px solid #E2E8F0" }}>NO</th>
                  <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 800, width: 120, borderRight: "1px solid #E2E8F0" }}>KODE MAK</th>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>KELOMPOK PENSIUN DAPEM</th>
                  <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, width: 130, borderRight: "1px solid #E2E8F0" }}>TOTAL JIWA</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>TARGET REKAP III (ASKES)</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>REALISASI SETORAN</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 800, width: 160, borderRight: "1px solid #E2E8F0" }}>KOMPENSASI (+/-)</th>
                  <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 800, width: 100 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRekap.map((r, i) => {
                  const komp = r.realisasi - r.targetRekap3;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                      <td style={{ padding: "11px 14px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                      <td style={{ padding: "11px 14px", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.mak}</td>
                      <td style={{ padding: "11px 16px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.namaKelompok}</td>
                      <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmtJiwa(r.jiwa)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(r.targetRekap3)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#15803D", borderRight: "1px solid #E2E8F0" }}>{fmt(r.realisasi)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: komp === 0 ? "#15803D" : komp > 0 ? "#DC2626" : "#D97706", borderRight: "1px solid #E2E8F0" }}>
                        {komp === 0 ? "Rp 0" : (komp > 0 ? "+ " : "- ") + fmt(komp)}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>
                        <Badge color={komp === 0 ? "green" : "red"}>{komp === 0 ? "Match" : "Selisih"}</Badge>
                      </td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr style={{ background: "#F8FAFC", borderTop: "2px solid #E2E8F0", color: "#1E293B", fontWeight: 800 }}>
                  <td colSpan={3} style={{ padding: "12px 16px", fontWeight: 800, color: "#1E293B", letterSpacing: 0.3 }}>
                    JUMLAH GRAND TOTAL (SELURUH MAK DAPEM)
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1D4ED8" }}>
                    {fmtJiwa(totalJiwa)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1E293B" }}>
                    {fmt(totalTarget)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#047857" }}>
                    {fmt(totalRealisasi)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 900, color: "#F59E0B" }}>
                    {totalKompensasi === 0 ? "Rp 0 (Match)" : (totalKompensasi > 0 ? "+ " : "- ") + fmt(totalKompensasi)}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    <Badge color="green">Match</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "#64748B" }}>
            * Nilai Target Rekap III BPJS Kesehatan (ASKES) di atas bersumber langsung dari Kolom Potongan ASKES Rekapitulasi III DAPEM SP {filterBulan}.
          </div>
        </div>
      )}

      {/* TAB 2 — Detail Per Peserta (Lampiran) */}
      {activeTab === "detail" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid #CBD5E1`, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
          <SectionTitle action={<Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Lampiran Detail Peserta BPJS", subtitle: "Nominatif Peserta DAPEM", type: "table", fileName: "Lampiran_Peserta_BPJS_DAPEM.xlsx", content: { columns: ["NRP", "Nama", "Kode MAK", "Kelompok", "Unor", "Target Rekap III", "Realisasi Potong", "Kompensasi"], rows: filteredPeserta.map(p => [p.nrp, p.nama, p.mak, p.kelompok, p.unor, fmt(p.target), fmt(p.realisasi), (p.kompensasi >= 0 ? "+" : "-") + " " + fmt(p.kompensasi)]), totalRows: filteredPeserta.length } })}>Ekspor Lampiran</Btn>}>
            Detail Nominatif Peserta Pensiun per MAK DAPEM
          </SectionTitle>

          {/* Filter Toolbar Tab Detail */}
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 16px", border: `1px solid #CBD5E1`, marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Tanggal Awal</label>
              <input
                type="date"
                value={tglAwal}
                onChange={e => setTglAwal(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Tanggal Akhir</label>
              <input
                type="date"
                value={tglAkhir}
                onChange={e => setTglAkhir(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Kelompok MAK DAPEM</label>
              <select
                value={filterKelompok}
                onChange={e => setFilterKelompok(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600, minWidth: 190 }}
              >
                <option value="Semua">Semua MAK (4 Kelompok)</option>
                <option value="513113">1. PNS KEMHAN (513113)</option>
                <option value="513114">2. PNS POLRI (513114)</option>
                <option value="513122">3. PENS TNI (513122)</option>
                <option value="513123">4. PENS POLRI (513123)</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Cari Peserta</label>
              <SearchInput value={searchPeserta} onChange={setSearchPeserta} placeholder="NRP / Nama peserta..." minW={200} />
            </div>
            {(searchPeserta || filterKelompok !== "Semua") && (
              <Btn variant="outline" size="sm" onClick={() => { setSearchPeserta(""); setFilterKelompok("Semua"); }}>Reset Filter</Btn>
            )}
          </div>

          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>Menampilkan sample nominatif peserta dari total {fmtJiwa(totalJiwa)} peserta Rekap III</div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  {["NRP/NIP", "Nama Peserta", "Kode MAK", "Kelompok DAPEM", "Unor / Satker", "Target Rekap III", "Realisasi Potong", "Kompensasi (+/-)", "Keterangan"].map((c, i) => (
                    <th key={i} style={{ padding: "9px 12px", textAlign: i >= 5 && i <= 7 ? "right" : "left", fontWeight: 800, color: "#64748B", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{filteredPeserta.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11.5, fontWeight: 600, color: "#0F172A" }}>{p.nrp}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A" }}>{p.nama}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 700, color: "#1E40AF" }}>{p.mak}</td>
                  <td style={{ padding: "9px 12px" }}><Badge color="blue">{p.kelompok}</Badge></td>
                  <td style={{ padding: "9px 12px", fontSize: 11.5, color: "#475569" }}>{p.unor}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(p.target)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "#15803D" }}>{fmt(p.realisasi)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: p.kompensasi === 0 ? "#15803D" : "#DC2626" }}>
                    {p.kompensasi === 0 ? "Rp 0" : (p.kompensasi > 0 ? "+" : "-") + " " + fmt(p.kompensasi)}
                  </td>
                  <td style={{ padding: "9px 12px", fontSize: 11.5, color: "#64748B" }}>{p.alasan}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3 — Riwayat Setoran ke Kas Negara */}
      {activeTab === "setoran" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid #CBD5E1`, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
          <SectionTitle action={
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm" onClick={() => setPreview({
                title: "Preview Riwayat Setoran Iuran BPJS (NTPN)",
                subtitle: `Sumber: DAPEM — Periode ${filterBulan}`,
                type: "table",
                fileName: "Riwayat_Setoran_NTPN_BPJS.xlsx",
                content: {
                  columns: ["No.", "Bulan", "Kelompok Peserta", "Jumlah Peserta", "Total Iuran (Rekap III)", "Iuran yang Dipotong dari Dapem", "Iuran yang Disetor (NTPN)", "Tanggal Setor", "Selisih"],
                  rows: [
                    ...filteredSetoran.map(s => [s.no, s.bulan, s.kelompok, fmtJiwa(s.peserta), fmt(s.totalRekap3), fmt(s.potongDapem), `${fmt(s.setoranNtpn)} (${s.ntpn})`, s.tglSetor, s.selisih === 0 ? "Rp 0" : fmt(s.selisih)]),
                    ["", "TOTAL", "JUMLAH GRAND TOTAL", fmtJiwa(totalSetoranPeserta), fmt(totalSetoranRekap3), fmt(totalSetoranPotongDapem), fmt(totalSetoranNtpn), "10 Jun 2026", totalSetoranSelisih === 0 ? "Rp 0" : fmt(totalSetoranSelisih)]
                  ],
                  totalRows: filteredSetoran.length + 1
                }
              })}>Ekspor Excel</Btn>
              <Btn variant="outline" size="sm" onClick={() => setPreview({
                title: "Preview Riwayat Setoran Iuran BPJS (NTPN)",
                subtitle: "Format PDF Resmi",
                type: "table",
                fileName: "Riwayat_Setoran_NTPN_BPJS.pdf",
                content: {
                  columns: ["No.", "Bulan", "Kelompok Peserta", "Jumlah Peserta", "Total Iuran (Rekap III)", "Iuran yang Dipotong dari Dapem", "Iuran yang Disetor (NTPN)", "Tanggal Setor", "Selisih"],
                  rows: [
                    ...filteredSetoran.map(s => [s.no, s.bulan, s.kelompok, fmtJiwa(s.peserta), fmt(s.totalRekap3), fmt(s.potongDapem), `${fmt(s.setoranNtpn)} (${s.ntpn})`, s.tglSetor, s.selisih === 0 ? "Rp 0" : fmt(s.selisih)]),
                    ["", "TOTAL", "JUMLAH GRAND TOTAL", fmtJiwa(totalSetoranPeserta), fmt(totalSetoranRekap3), fmt(totalSetoranPotongDapem), fmt(totalSetoranNtpn), "10 Jun 2026", totalSetoranSelisih === 0 ? "Rp 0" : fmt(totalSetoranSelisih)]
                  ],
                  totalRows: filteredSetoran.length + 1
                }
              })}>Ekspor PDF</Btn>
            </div>
          }>
            Riwayat Setoran Iuran BPJS Kesehatan (NTPN) — Bersumber dari DAPEM
          </SectionTitle>

          {/* Filter Toolbar Tab Setoran */}
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 16px", border: `1px solid #CBD5E1`, marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Tanggal Awal</label>
              <input
                type="date"
                value={tglAwal}
                onChange={e => setTglAwal(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Tanggal Akhir</label>
              <input
                type="date"
                value={tglAkhir}
                onChange={e => setTglAkhir(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>Kelompok MAK DAPEM</label>
              <select
                value={filterKelompok}
                onChange={e => setFilterKelompok(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, color: "#0F172A", background: "#FFFFFF", fontWeight: 600, minWidth: 200 }}
              >
                <option value="Semua">Semua MAK (4 Kelompok)</option>
                <option value="513113">1. PNS KEMHAN (513113)</option>
                <option value="513114">2. PNS POLRI (513114)</option>
                <option value="513122">3. PENS TNI (513122)</option>
                <option value="513123">4. PENS POLRI (513123)</option>
              </select>
            </div>
            {filterKelompok !== "Semua" && (
              <button
                onClick={() => setFilterKelompok("Semua")}
                style={{ background: "none", border: "none", color: "#DC2626", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}
              >
                ✕ Reset Filter
              </button>
            )}
          </div>

          {filteredSetoran.length === 0 ? <NoData text="Tidak ada data setoran yang sesuai filter." /> : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 800, width: 45, borderRight: "1px solid #E2E8F0" }}>No.</th>
                    <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 800, width: 95, borderRight: "1px solid #E2E8F0" }}>Bulan</th>
                    <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kelompok Peserta</th>
                    <th style={{ padding: "11px 12px", textAlign: "right", fontWeight: 800, width: 115, borderRight: "1px solid #E2E8F0" }}>Jumlah Peserta</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, width: 155, borderRight: "1px solid #E2E8F0" }}>Total Iuran (Rekap III)</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, width: 175, borderRight: "1px solid #E2E8F0" }}>Iuran yang Dipotong dari Dapem</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, width: 175, borderRight: "1px solid #E2E8F0" }}>Iuran yang Disetor (NTPN)</th>
                    <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 800, width: 105, borderRight: "1px solid #E2E8F0" }}>Tanggal Setor</th>
                    <th style={{ padding: "11px 12px", textAlign: "right", fontWeight: 800, width: 110 }}>Selisih</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSetoran.map((s, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{s.no}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{s.bulan}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{s.kelompok}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmtJiwa(s.peserta)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(s.totalRekap3)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E40AF", borderRight: "1px solid #E2E8F0" }}>{fmt(s.potongDapem)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        <div style={{ fontWeight: 700, color: "#15803D" }}>{fmt(s.setoranNtpn)}</div>
                        <div style={{ fontSize: 10.5, color: "#64748B", fontFamily: "monospace" }}>NTPN: {s.ntpn}</div>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{s.tglSetor}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800 }}>
                        {s.selisih === 0 ? <Badge color="green">Rp 0</Badge> : <span style={{ color: "#DC2626" }}>{fmt(s.selisih)}</span>}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr style={{ background: "#F8FAFC", borderTop: "2px solid #E2E8F0", color: "#1E293B", fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: "12px 14px", fontWeight: 800, color: "#1E293B", letterSpacing: 0.3 }}>
                      JUMLAH GRAND TOTAL (SELURUH MAK DAPEM)
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1D4ED8" }}>
                      {fmtJiwa(totalSetoranPeserta)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1E293B" }}>
                      {fmt(totalSetoranRekap3)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1D4ED8" }}>
                      {fmt(totalSetoranPotongDapem)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#047857" }}>
                      {fmt(totalSetoranNtpn)}
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "center", fontSize: 12, color: "#CBD5E1" }}>
                      10 Jun 2026
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 900, color: "#047857" }}>
                      {totalSetoranSelisih === 0 ? "Rp 0 (Match)" : fmt(totalSetoranSelisih)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: 14, fontSize: 12, color: "#64748B" }}>
            * Seluruh data Total Iuran (Rekap III) dan Iuran yang Dipotong bersumber langsung dari Daftar Rekapitulasi III Pembayaran Pensiun (DAPEM).
          </div>
        </div>
      )}
    </div>
  );
};
