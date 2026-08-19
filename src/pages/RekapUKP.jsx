import { useState } from "react";
import { Users, DollarSign, TrendingUp, RefreshCw, Download, FileText } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const RekapUKP = () => {
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;
  const [filterJenisUKP, setFilterJenisUKP] = useState("Semua");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterPTKP, setFilterPTKP] = useState("Semua");
  const [searchPeserta, setSearchPeserta] = useState("");
  const [detailPeserta, setDetailPeserta] = useState(null);
  const [preview, setPreview] = useState(null);

  const allUKPData = [
    {
      no: 1,
      nik: "3171012304650001",
      nrp: "198701234",
      nama: "Purn. Kol. Ahmad Rifai",
      kodeJiwa: "1102",
      jabatan: "Perwira Menengah / Kolonel (TNI AD)",
      satker: "TNI",
      unor: "Kodam Jaya",
      jenisUKP: "Dapem Induk",
      blnDiterima: 12,
      blnDikembalikan: 0,
      ptkp: "K/2",
      ukpNetoBulanIni: 8500000,
      ukpKumulatif: 59500000,
      history: [
        { bln: "Jan 2026", bruto: 8500000, pot: 0, neto: 8500000 },
        { bln: "Feb 2026", bruto: 8500000, pot: 0, neto: 8500000 },
        { bln: "Mar 2026", bruto: 8500000, pot: 0, neto: 8500000 },
        { bln: "Apr 2026", bruto: 8500000, pot: 0, neto: 8500000 },
        { bln: "Mei 2026", bruto: 8500000, pot: 0, neto: 8500000 },
        { bln: "Jun 2026", bruto: 8500000, pot: 0, neto: 8500000 },
        { bln: "Jul 2026", bruto: 8500000, pot: 0, neto: 8500000 },
      ]
    },
    {
      no: 2,
      nik: "3273021508700002",
      nrp: "199205678",
      nama: "Purn. Lettu Budi Kartono",
      kodeJiwa: "1101",
      jabatan: "Perwira Pertama / Lettu (TNI AD)",
      satker: "TNI",
      unor: "Mabes TNI",
      jenisUKP: "Dapem Susulan",
      blnDiterima: 6,
      blnDikembalikan: 0,
      ptkp: "K/1",
      ukpNetoBulanIni: 6200000,
      ukpKumulatif: 37200000,
      history: [
        { bln: "Feb 2026", bruto: 6200000, pot: 0, neto: 6200000 },
        { bln: "Mar 2026", bruto: 6200000, pot: 0, neto: 6200000 },
        { bln: "Apr 2026", bruto: 6200000, pot: 0, neto: 6200000 },
        { bln: "Mei 2026", bruto: 6200000, pot: 0, neto: 6200000 },
        { bln: "Jun 2026", bruto: 6200000, pot: 0, neto: 6200000 },
        { bln: "Jul 2026", bruto: 6200000, pot: 0, neto: 6200000 },
      ]
    },
    {
      no: 3,
      nik: "3175031109820004",
      nrp: "199012345",
      nama: "Purn. AKP Citra Dewi",
      kodeJiwa: "0101",
      jabatan: "Perwira Pertama / AKP (POLRI)",
      satker: "POLRI",
      unor: "Polda Metro Jaya",
      jenisUKP: "Dapem Induk",
      blnDiterima: 12,
      blnDikembalikan: 0,
      ptkp: "K/1",
      ukpNetoBulanIni: 12800000,
      ukpKumulatif: 89600000,
      history: [
        { bln: "Jan 2026", bruto: 12800000, pot: 0, neto: 12800000 },
        { bln: "Feb 2026", bruto: 12800000, pot: 0, neto: 12800000 },
        { bln: "Mar 2026", bruto: 12800000, pot: 0, neto: 12800000 },
        { bln: "Apr 2026", bruto: 12800000, pot: 0, neto: 12800000 },
        { bln: "Mei 2026", bruto: 12800000, pot: 0, neto: 12800000 },
        { bln: "Jun 2026", bruto: 12800000, pot: 0, neto: 12800000 },
        { bln: "Jul 2026", bruto: 12800000, pot: 0, neto: 12800000 },
      ]
    },
    {
      no: 4,
      nik: "3204052203750003",
      nrp: "197506789",
      nama: "Purn. Pengatur Agus Salim",
      kodeJiwa: "0100",
      jabatan: "Pengatur Muda / Gol. II (ASN Kemhan)",
      satker: "ASN Kemenhan",
      unor: "Setjen Kemhan",
      jenisUKP: "UDW Punah (Dikembalikan)",
      blnDiterima: 10,
      blnDikembalikan: 2,
      ptkp: "TK/0",
      ukpNetoBulanIni: 3100000,
      ukpKumulatif: 24800000,
      history: [
        { bln: "Jan 2026", bruto: 3100000, pot: 0, neto: 3100000 },
        { bln: "Feb 2026", bruto: 3100000, pot: 0, neto: 3100000 },
        { bln: "Mar 2026", bruto: 3100000, pot: 0, neto: 3100000 },
        { bln: "Apr 2026", bruto: 3100000, pot: 0, neto: 3100000 },
        { bln: "Mei 2026", bruto: 3100000, pot: 0, neto: 3100000 },
        { bln: "Jun 2026", bruto: 3100000, pot: 6200000, neto: -3100000 },
        { bln: "Jul 2026", bruto: 3100000, pot: 0, neto: 3100000 },
      ]
    },
    {
      no: 5,
      nik: "3578011210860005",
      nrp: "198604321",
      nama: "Purn. Bripka Anwar Ibrahim",
      kodeJiwa: "1102",
      jabatan: "Bintara / Bripka (POLRI)",
      satker: "POLRI",
      unor: "Polda Jabar",
      jenisUKP: "Dapem Rapel",
      blnDiterima: 12,
      blnDikembalikan: 0,
      ptkp: "K/2",
      ukpNetoBulanIni: 9200000,
      ukpKumulatif: 64400000,
      history: [
        { bln: "Jan 2026", bruto: 9200000, pot: 0, neto: 9200000 },
        { bln: "Feb 2026", bruto: 9200000, pot: 0, neto: 9200000 },
        { bln: "Mar 2026", bruto: 9200000, pot: 0, neto: 9200000 },
        { bln: "Apr 2026", bruto: 9200000, pot: 0, neto: 9200000 },
        { bln: "Mei 2026", bruto: 9200000, pot: 0, neto: 9200000 },
        { bln: "Jun 2026", bruto: 9200000, pot: 0, neto: 9200000 },
        { bln: "Jul 2026", bruto: 9200000, pot: 0, neto: 9200000 },
      ]
    },
    {
      no: 6,
      nik: "3174092511940006",
      nrp: "199401234",
      nama: "Danu Prasetyo",
      kodeJiwa: "1000",
      jabatan: "Pegawai PPPK / Gol. X (Kemhan)",
      satker: "PPPK",
      unor: "Ditjen Strahan",
      jenisUKP: "Dapem Induk",
      blnDiterima: 7,
      blnDikembalikan: 0,
      ptkp: "TK/0",
      ukpNetoBulanIni: 4800000,
      ukpKumulatif: 33600000,
      history: [
        { bln: "Jan 2026", bruto: 4800000, pot: 0, neto: 4800000 },
        { bln: "Feb 2026", bruto: 4800000, pot: 0, neto: 4800000 },
        { bln: "Mar 2026", bruto: 4800000, pot: 0, neto: 4800000 },
        { bln: "Apr 2026", bruto: 4800000, pot: 0, neto: 4800000 },
        { bln: "Mei 2026", bruto: 4800000, pot: 0, neto: 4800000 },
        { bln: "Jun 2026", bruto: 4800000, pot: 0, neto: 4800000 },
        { bln: "Jul 2026", bruto: 4800000, pot: 0, neto: 4800000 },
      ]
    },
    {
      no: 7,
      nik: "3374020807760007",
      nrp: "197604567",
      nama: "Purn. Mayor Inf. Surya Darma",
      kodeJiwa: "1101",
      jabatan: "Perwira Menengah / Mayor (TNI AU)",
      satker: "TNI",
      unor: "Lanud Halim",
      jenisUKP: "THR / Dapem ke-13",
      blnDiterima: 12,
      blnDikembalikan: 0,
      ptkp: "K/1",
      ukpNetoBulanIni: 14500000,
      ukpKumulatif: 101500000,
      history: [
        { bln: "Jan 2026", bruto: 14500000, pot: 0, neto: 14500000 },
        { bln: "Feb 2026", bruto: 14500000, pot: 0, neto: 14500000 },
        { bln: "Mar 2026", bruto: 14500000, pot: 0, neto: 14500000 },
        { bln: "Apr 2026", bruto: 14500000, pot: 0, neto: 14500000 },
        { bln: "Mei 2026", bruto: 14500000, pot: 0, neto: 14500000 },
        { bln: "Jun 2026", bruto: 14500000, pot: 0, neto: 14500000 },
        { bln: "Jul 2026", bruto: 14500000, pot: 0, neto: 14500000 },
      ]
    }
  ];

  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;

  const filtered = allUKPData.filter(d => {
    if (filterJenisUKP !== "Semua" && d.jenisUKP !== filterJenisUKP) return false;
    if (filterSatker !== "Semua" && d.satker !== filterSatker) return false;
    if (filterPTKP !== "Semua" && d.ptkp !== filterPTKP) return false;
    if (searchPeserta && !d.nama.toLowerCase().includes(searchPeserta.toLowerCase()) && !d.nrp.includes(searchPeserta) && !d.nik.includes(searchPeserta)) return false;
    return true;
  });

  const totalPeserta = filtered.length;
  const totalUkpBulanIni = filtered.reduce((a, b) => a + b.ukpNetoBulanIni, 0);
  const totalUkpKumulatif = filtered.reduce((a, b) => a + b.ukpKumulatif, 0);
  const totalDikembalikan = filtered.reduce((a, b) => a + (b.blnDikembalikan > 0 ? b.blnDikembalikan * (b.ukpNetoBulanIni) : 0), 0);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Detail Modal */}
      {detailPeserta && (() => {
        const d = detailPeserta;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailPeserta(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 620, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray900 }}>{d.nama}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>NIK: <span style={{ fontFamily: "monospace" }}>{d.nik}</span> • NRP/Nopens: <span style={{ fontFamily: "monospace" }}>{d.nrp}</span></div>
                </div>
                <button onClick={() => setDetailPeserta(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
              </div>

              <div style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20, background: COLORS.gray50, padding: 14, borderRadius: 8 }}>
                  <div><span style={{ fontSize: 11, color: COLORS.gray500 }}>Satker / Unor</span><div style={{ fontSize: 13, fontWeight: 600 }}>{d.satker} ({d.unor})</div></div>
                  <div><span style={{ fontSize: 11, color: COLORS.gray500 }}>Kode Jiwa / PTKP</span><div style={{ fontSize: 13, fontWeight: 600 }}>{d.kodeJiwa} / <Badge color="blue">{d.ptkp}</Badge></div></div>
                  <div><span style={{ fontSize: 11, color: COLORS.gray500 }}>Pangkat / Jabatan</span><div style={{ fontSize: 13, fontWeight: 600 }}>{d.jabatan}</div></div>
                  <div><span style={{ fontSize: 11, color: COLORS.gray500 }}>Jenis UKP</span><div style={{ fontSize: 13, fontWeight: 600 }}>{d.jenisUKP}</div></div>
                </div>

                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800, marginBottom: 10 }}>Ringkasan Penerimaan UKP</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                  <div style={{ padding: 12, background: "#E3F2FD", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: COLORS.blue }}>Bln. Diterima</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.blueDark }}>{d.blnDiterima} Bulan</div>
                  </div>
                  <div style={{ padding: 12, background: d.blnDikembalikan > 0 ? COLORS.redLight : COLORS.gray100, borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: d.blnDikembalikan > 0 ? COLORS.red : COLORS.gray600 }}>Bln. Dikembalikan</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: d.blnDikembalikan > 0 ? COLORS.red : COLORS.gray800 }}>{d.blnDikembalikan} Bulan</div>
                  </div>
                  <div style={{ padding: 12, background: COLORS.greenLight, borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: COLORS.green }}>Kumulatif Tahun Ini</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: COLORS.green }}>{fmt(d.ukpKumulatif)}</div>
                  </div>
                </div>

                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800, marginBottom: 10 }}>Riwayat Bulanan (Jan - Jul 2026)</div>
                <div style={{ border: `1px solid #CBD5E1`, borderRadius: 8, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: COLORS.white }}>
                        <th style={{ padding: "8px 12px", textAlign: "left", color: COLORS.white, borderRight: "1px solid #334155" }}>Bulan</th>
                        <th style={{ padding: "8px 12px", textAlign: "right", color: COLORS.white, borderRight: "1px solid #334155" }}>Penghasilan Bruto</th>
                        <th style={{ padding: "8px 12px", textAlign: "right", color: COLORS.white, borderRight: "1px solid #334155" }}>Pengembalian</th>
                        <th style={{ padding: "8px 12px", textAlign: "right", color: COLORS.white }}>UKP Neto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.history.map((h, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                          <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{h.bln}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(h.bruto)}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: h.pot > 0 ? COLORS.red : "#64748B", borderRight: "1px solid #E2E8F0" }}>{h.pot > 0 ? `-${fmt(h.pot)}` : "—"}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: h.neto < 0 ? COLORS.red : "#0F172A" }}>{fmt(h.neto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <Btn variant="outline" size="sm" onClick={() => { setDetailPeserta(null); setPreview({ title: `Preview Cetak Rincian UKP — ${d.nama}`, subtitle: `NRP: ${d.nrp} • NIK: ${d.nik}`, type: "surat", fileName: `Rincian_UKP_${d.nrp}.pdf`, content: { noSurat: `UKP/2026/${d.nrp}`, tujuan: `${d.nama} (${d.jabatan})`, periode: filterPeriode, cutoff: "31 Jul 2026", tanggal: "06 Agu 2026", items: [{ jenis: "Penerimaan UKP Neto Bulan Ini", peserta: `${d.blnDiterima} bln`, nominal: fmt(d.ukpNetoBulanIni) }, { jenis: "UKP Kumulatif Tahun Ini", peserta: "Jan-Jul", nominal: fmt(d.ukpKumulatif) }] } }); }}>Cetak Rincian UKP</Btn>
                  <Btn size="sm" onClick={() => setDetailPeserta(null)}>Tutup</Btn>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Users size={IC} />} label="Total Peserta UKP" value={`${totalPeserta} Peserta`} sub={`Periode ${filterPeriode}`} color={COLORS.blue} />
        <StatCard icon={<DollarSign size={IC} />} label="UKP Neto Bulan Ini" value={fmt(totalUkpBulanIni)} sub="Rekapitulasi bulanan" color={COLORS.green} />
        <StatCard icon={<TrendingUp size={IC} />} label="UKP Kumulatif Tahun Ini" value={fmt(totalUkpKumulatif)} sub="Akumulasi TA 2026" color={COLORS.blueDark} />
        <StatCard icon={<RefreshCw size={IC} />} label="UKP Dikembalikan" value={fmt(totalDikembalikan)} sub="Kelebihan bayar / UDW" color={COLORS.orange} />
      </div>

      {/* Filter & Control Box */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap UKP Peserta Pensiun (Tabel 24)", subtitle: `Periode ${filterPeriode} • ${filterSatker}`, type: "table", fileName: `Tabel_24_Rekap_UKP_${filterPeriode.replace(" ", "_")}.xlsx`, content: { columns: ["No", "NIK", "NRP/Nopens", "Nama", "Kode Jiwa", "Jabatan", "Jenis UKP", "Diterima", "Dikembalikan", "PTKP", "UKP Neto", "UKP Kumulatif"], rows: filtered.map((d, i) => [i + 1, d.nik, d.nrp, d.nama, d.kodeJiwa, d.jabatan, d.jenisUKP, `${d.blnDiterima} bln`, `${d.blnDikembalikan} bln`, d.ptkp, fmt(d.ukpNetoBulanIni), fmt(d.ukpKumulatif)]), totalRows: filtered.length } })}>
              <Download size={14} /> Ekspor Excel (.xlsx)
            </Btn>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Laporan Resmi Tabel 24 - Rekap UKP Pensiun", subtitle: "Untuk Rekonsiliasi Kementerian Keuangan", type: "surat", fileName: `Laporan_Tabel24_UKP_${filterPeriode.replace(" ", "_")}.pdf`, content: { noSurat: "024/ASABRI/PAJAK-UKP/VII/2026", tujuan: "Direktur Jenderal Perbendaharaan / Direktorat Jenderal Pajak — Kemenkeu RI", periode: filterPeriode, cutoff: "31 Juli 2026", tanggal: "06 Agustus 2026", items: [{ jenis: "Total UKP Neto Bulan Ini", peserta: `${totalPeserta} peserta`, nominal: fmt(totalUkpBulanIni) }, { jenis: "Total UKP Kumulatif TA 2026", peserta: `${totalPeserta} peserta`, nominal: fmt(totalUkpKumulatif) }] } })}>
              <FileText size={14} /> Ekspor PDF Laporan
            </Btn>
          </div>
        }>Tabel 24 — Rekap UKP (Uang Kena Pajak) Peserta Pensiun Bulanan</SectionTitle>

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
          <Select label="Jenis UKP" value={filterJenisUKP} onChange={setFilterJenisUKP} options={["Semua", "Dapem Induk", "Dapem Susulan", "Dapem Rapel", "UDW Punah (Dikembalikan)", "THR / Dapem ke-13"]} minW={180} />
          <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPKP", "PPPK"]} minW={130} />
          <Select label="PTKP" value={filterPTKP} onChange={setFilterPTKP} options={["Semua", "TK/0", "K/0", "K/1", "K/2", "K/3"]} minW={110} />
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari Peserta</label>
            <SearchInput value={searchPeserta} onChange={setSearchPeserta} placeholder="Cari NIK / NRP / Nama / Jabatan..." minW={240} />
          </div>
        </div>

        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Menampilkan {filtered.length} dari {allUKPData.length} data penerimaan UKP • Laporan resmi Divisi Keuangan (Bidang Pajak)</div>

        {filtered.length === 0 ? <NoData text="Tidak ada data UKP yang sesuai filter." /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["No.", "NIK", "NRP/Nopens", "Nama", "Kode Jiwa", "Jabatan / Pangkat", "Jenis UKP", "Bln. Diterima", "Bln. Dikembalikan", "PTKP", "Total UKP Neto Bulan Ini", "UKP Kumulatif Tahun Ini", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 12px", textAlign: i >= 10 && i <= 11 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 12 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                    <td style={{ padding: "10px 12px", color: "#64748B", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, borderRight: "1px solid #E2E8F0" }}>{d.nik}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{d.nrp}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.nama}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}><span style={{ fontFamily: "monospace", background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{d.kodeJiwa}</span></td>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.jabatan}</td>
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color={d.jenisUKP.includes("Induk") ? "blue" : d.jenisUKP.includes("Susulan") ? "green" : d.jenisUKP.includes("Dikembalikan") ? "red" : "orange"}>{d.jenisUKP}</Badge></td>
                    <td style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{d.blnDiterima} bln</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", color: d.blnDikembalikan > 0 ? COLORS.red : "#64748B", fontWeight: d.blnDikembalikan > 0 ? 700 : 400, borderRight: "1px solid #E2E8F0" }}>{d.blnDikembalikan > 0 ? `${d.blnDikembalikan} bln` : "0 bln"}</td>
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color="blue">{d.ptkp}</Badge></td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(d.ukpNetoBulanIni)}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0" }}>{fmt(d.ukpKumulatif)}</td>
                    <td style={{ padding: "10px 12px" }}><Btn size="sm" variant="outline" onClick={() => setDetailPeserta(d)}>Detail</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 12, padding: "10px 14px", background: COLORS.gray50, borderRadius: 6, border: `1px solid ${COLORS.gray200}`, fontSize: 11.5, color: COLORS.gray700 }}>
          <strong>Formula Kode Jiwa:</strong> <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>1000</span> = Single (Pria/Wanita) • <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>1100</span> = Menikah (Pria) • <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>1101</span> = Menikah (Anak 1) • <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>1102</span> = Menikah (Anak 2) • <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>0100</span> = Janda/Duda • <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>0101</span> = Janda/Duda (Anak 1)
        </div>
      </div>
    </div>
  );
};
