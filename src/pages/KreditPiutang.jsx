import { useState } from "react";
import { Users, Wallet, BarChart3, Banknote, AlertTriangle } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const KreditPiutang = () => {
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchUDW, setSearchUDW] = useState("");
  const [detailKasus, setDetailKasus] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mappingSatker, setMappingSatker] = useState("Pilih Satker...");

  const allKasus = [
    { no: 1, ref: "UDW/2026/01/001", tgl: "15 Jan 2026", nama: "Kolonel Inf. Agus Setiawan", nrp: "11020014250", satker: "TNI", unor: "Kodam Jaya", jumlah: 15420000, status: "Diproses", tglBayar: "15 Jan 2026", tglSurat: "18 Jan 2026", dikembalikan: 5140000, catatan: "Pengembalian dicicil 2 tahap, tahap pertama diterima via transfer Satker Kodam Jaya." },
    { no: 2, ref: "UDW/2026/01/042", tgl: "12 Jan 2026", nama: "Ny. Ratna Sari (Warakawuri)", nrp: "PNS-00125492", satker: "POLRI", unor: "Polda Metro Jaya", jumlah: 12800000, status: "Selesai", tglBayar: "12 Jan 2026", tglSurat: "14 Jan 2026", dikembalikan: 12800000, catatan: "Pengembalian penuh via transfer langsung." },
    { no: 3, ref: "UDW/2026/01/089", tgl: "10 Jan 2026", nama: "Sertu Bima Prakoso", nrp: "21120485901", satker: "TNI", unor: "Lanud Halim", jumlah: 18500000, status: "Diproses", tglBayar: "10 Jan 2026", tglSurat: "12 Jan 2026", dikembalikan: 8500000, catatan: "Cicilan pertama dari 3 tahap." },
    { no: 4, ref: "UDW/2026/01/112", tgl: "08 Jan 2026", nama: "Laksamana Muda Yudi K.", nrp: "74080124110", satker: "TNI", unor: "Mabes AL", jumlah: 22340000, status: "Ditolak", tglBayar: "08 Jan 2026", tglSurat: "10 Jan 2026", dikembalikan: 0, catatan: "Ditolak — peserta mengajukan keberatan, dalam proses mediasi." },
    { no: 5, ref: "UDW/2026/01/156", tgl: "05 Jan 2026", nama: "Mayor (P) Hendra Gunawan", nrp: "5109820012", satker: "TNI", unor: "Koarmada I", jumlah: 14200000, status: "Selesai", tglBayar: "05 Jan 2026", tglSurat: "07 Jan 2026", dikembalikan: 14200000, catatan: "Pengembalian penuh via potongan pensiun bulan Februari." },
    { no: 6, ref: "UDW/2026/01/201", tgl: "02 Jan 2026", nama: "Brigjen Pol. Sutrisno", nrp: "6201089201", satker: "POLRI", unor: "Mabes Polri", jumlah: 25000000, status: "Selesai", tglBayar: "02 Jan 2026", tglSurat: "05 Jan 2026", dikembalikan: 25000000, catatan: "Pengembalian penuh via transfer." },
  ];

  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  const filtered = allKasus.filter(k => {
    if (filterSatker !== "Semua" && k.satker !== filterSatker) return false;
    if (filterStatus !== "Semua" && k.status !== filterStatus) return false;
    if (searchUDW && !k.nama.toLowerCase().includes(searchUDW.toLowerCase()) && !k.ref.toLowerCase().includes(searchUDW.toLowerCase()) && !k.nrp.includes(searchUDW)) return false;
    return true;
  });

  const statusColor = s => s === "Selesai" ? "green" : s === "Diproses" ? "orange" : "red";

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Detail Modal */}
      {detailKasus && (() => {
        const k = detailKasus;
        const sisa = k.jumlah - k.dikembalikan;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailKasus(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 540, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900 }}>Detail kasus {k.ref}</div>
                <button onClick={() => setDetailKasus(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
              </div>
              <div style={{ padding: "16px 24px", background: COLORS.gray50, display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${COLORS.gray200}` }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={22} color={COLORS.blue} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900 }}>{k.nama}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray500 }}>{k.satker} · {k.unor} · NRP {k.nrp}</div>
                  <div style={{ marginTop: 4 }}><Badge color={statusColor(k.status)}>{k.status}</Badge></div>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                {[
                  ["No.", k.no],
                  ["NRP/Nopens", k.nrp],
                  ["Nama", k.nama],
                  ["Tanggal bayar UDW", k.tglBayar],
                  ["Nilai UDW terlanjur dibayar", <span style={{ fontWeight: 700 }}>{fmt(k.jumlah)}</span>],
                  ["Tanggal surat tagihan", k.tglSurat],
                  ["Status pengembalian", <Badge color={statusColor(k.status)}>{k.status}</Badge>],
                  ["Tanggal dikembalikan", k.status === "Selesai" ? k.tglSurat : "—"],
                  ["Nilai yang dikembalikan", fmt(k.dikembalikan)],
                  ["Sisa belum dikembalikan", <span style={{ color: sisa > 0 ? COLORS.red : COLORS.green, fontWeight: 700 }}>{fmt(sisa)}</span>],
                  ["Catatan", <span style={{ fontSize: 12, color: COLORS.gray600 }}>{k.catatan}</span>],
                ].map(([label, val], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${COLORS.gray100}`, fontSize: 13 }}>
                    <span style={{ color: COLORS.gray500, minWidth: 180, flexShrink: 0 }}>{label}</span>
                    <span style={{ textAlign: "right", color: COLORS.gray900 }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                  <Btn variant="outline" size="sm" onClick={() => { setDetailKasus(null); setPreview({ title: "Preview Surat Tagihan UDW", subtitle: k.ref + " — " + k.nama, type: "surat", fileName: "Surat_Tagihan_" + k.ref.replace(/\//g, "_") + ".pdf", content: { noSurat: k.ref, tujuan: k.nama + " — " + k.satker, periode: "Penagihan UDW Punah", cutoff: k.tglBayar, tanggal: k.tglSurat, items: [{ jenis: "UDW Terlanjur Dibayar", peserta: "1", nominal: fmt(k.jumlah) }, { jenis: "Sudah Dikembalikan", peserta: "—", nominal: fmt(k.dikembalikan) }, { jenis: "Sisa Tagihan", peserta: "—", nominal: fmt(k.jumlah - k.dikembalikan) }] } }); }}>Unduh surat tagihan</Btn>
                  <Btn variant="danger" size="sm" onClick={() => setDetailKasus(null)}>Tutup</Btn>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Users size={IC} />} label="Jumlah Peserta Terdaftar" value="12.482" sub="Peserta UDW aktif" color={COLORS.blue} />
        <StatCard icon={<Wallet size={IC} />} label="Total Saldo UDW" value="Rp 4.4B" sub="Akumulasi seluruh peserta" color={COLORS.blue} />
        <StatCard icon={<BarChart3 size={IC} />} label="Rata-rata Per Peserta" value="Rp 1.2M" sub="Saldo rata-rata UDW" color={COLORS.blue} />
        <StatCard icon={<Banknote size={IC} />} label="Total Tabungan Peserta" value="842.1M" sub="Tabungan terkumpul" color={COLORS.blue} />
      </div>

      {/* Filters */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={150} />
        <Select label="Status" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Diproses", "Selesai", "Ditolak"]} minW={130} />
        <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchUDW} onChange={setSearchUDW} placeholder="Cari ref / nama / NRP..." minW={200} /></div>
      </div>

      {/* Table */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle action={<div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Data UDW Punah", subtitle: "Monitoring penarikan per kasus", type: "table", fileName: "Monitoring_UDW_Punah.pdf", content: { columns: ["Ref", "Nama", "NRP", "Satker", "Jumlah", "Status"], rows: filtered.slice(0,5).map(k => [k.ref, k.nama, k.nrp, k.satker, fmt(k.jumlah), k.status]), totalRows: filtered.length } })}>Ekspor PDF</Btn>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Data UDW Punah", subtitle: "Format Excel", type: "table", fileName: "Monitoring_UDW_Punah.xlsx", content: { columns: ["Ref", "Nama", "NRP", "Satker", "Jumlah", "Status"], rows: filtered.slice(0,5).map(k => [k.ref, k.nama, k.nrp, k.satker, fmt(k.jumlah), k.status]), totalRows: filtered.length } })}>Ekspor Excel</Btn>
        </div>}>Monitoring Penarikan UDW Punah per Kasus</SectionTitle>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Menampilkan {filtered.length} dari {allKasus.length} data pengajuan</div>
        {filtered.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["No", "Ref / Tgl Pengajuan", "Nama Peserta", "NRP/NIP", "Satker", "Unor", "Jumlah (Rp)", "Status", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: i === 6 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 8 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{filtered.map((k, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                  <td style={{ padding: "10px 14px", color: "#64748B", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{k.no}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>
                    <div style={{ fontWeight: 700, color: COLORS.blue }}>{k.ref}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{k.tgl}</div>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{k.nama}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, borderRight: "1px solid #E2E8F0" }}>{k.nrp}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={k.satker === "TNI" ? "green" : k.satker === "POLRI" ? "blue" : k.satker === "PPPK" ? "yellow" : "orange"}>{k.satker}</Badge></td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{k.unor || "—"}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(k.jumlah)}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={statusColor(k.status)}>{k.status}</Badge></td>
                  <td style={{ padding: "10px 14px" }}><Btn size="sm" variant="outline" onClick={() => setDetailKasus(k)}>Detail</Btn></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Konfirmasi Penarikan Kolektif / Mapping Rekening Koran */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle action={<div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <Select value={mappingSatker} onChange={setMappingSatker} options={["Pilih Satker...", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={160} />
          <Btn>Proses Mapping</Btn>
        </div>}>Konfirmasi Penarikan Kolektif / Mapping Rekening Koran</SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Data Rekening Koran (Kredit)</div>
            <div style={{ borderRadius: 8, border: `1px solid #CBD5E1`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: `1px solid #334155` }}>Tanggal Deskripsi</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155` }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "9px 12px", borderRight: `1px solid #E2E8F0`, color: "#0F172A" }}>
                      <div style={{ fontWeight: 600 }}>28/01/2026</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>KREDIT UDW KOALISI SATKER A</div>
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontFamily: "monospace", color: "#0F172A" }}>
                      45.000.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Data Sistem (Total Tagihan)</div>
            <div style={{ borderRadius: 8, border: `1px solid #CBD5E1`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: `1px solid #334155` }}>Satker</th>
                    <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: `1px solid #334155` }}>Jml Kasus</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155` }}>Total Tagihan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "9px 12px", fontWeight: 600, color: "#0F172A", borderRight: `1px solid #E2E8F0` }}>Kodam Jaya</td>
                    <td style={{ padding: "9px 12px", textAlign: "center", borderRight: `1px solid #E2E8F0` }}><Badge color="blue">3 Kasus</Badge></td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontFamily: "monospace", color: COLORS.orange }}>46.500.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <AlertTriangle size={16} color="#F57F17" />
          <span style={{ color: "#F57F17" }}>Selisih ditemukan: <strong>-Rp 1.500.000</strong>. Mohon periksa kembali data mutasi rekening koran dan data pengajuan kolektif.</span>
        </div>
      </div>
    </div>
  );
};
