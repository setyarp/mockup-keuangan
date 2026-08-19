import { useState } from "react";
import { COLORS } from "../constants/colors";
import { SectionTitle, Select, Table } from "../components/common";

export const ReportGenerator = () => {
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const allReports = [
    { cat: "Penagihan Iuran", reports: ["Tabel 1 BRS II — Rekonsiliasi THT/Pensiun", "Tabel 2 BRS II — Template Tagihan", "Rekap Tagihan per Satker"] },
    { cat: "Klaim & Pembayaran", reports: ["Tabel 2 BRS I — Rekap Klaim JKK", "Tabel 4 BRS I — SPP Format Resmi", "Tabel 5 BRS I — Monitoring Taspen Life"] },
    { cat: "Perpajakan", reports: ["Bukti Potong 1721-A2 (Bulanan)", "Bukti Potong 1721-A3 (Tahunan)", "Tabel 25 BRS I — TER vs Pasal 17"] },
    { cat: "DIPA & SP2D", reports: ["Tabel 12 BRS I — Sisa Pagu DIPA", "Tabel 14–16 BRS I — Realisasi SP2D", "Tabel 17 BRS I — BOP Dapem"] },
    { cat: "Rekonsiliasi BPJS", reports: ["Tabel 11 BRS I — Kompensasi BPJS", "Tabel 13 BRS I — Setoran Triwulan"] },
    { cat: "Utang & Piutang", reports: ["Tabel 9 BRS I — NTPN Non-TGR", "Tabel 10 BRS I — Potongan per Satker", "Tabel 5 BRS II — PUM KPR"] },
  ];
  const filtered = filterKategori === "Semua" ? allReports : allReports.filter(g => g.cat === filterKategori);
  return (
    <div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Generator Laporan Standar — 32+ Format</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
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
          <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={140} />
          <Select label="Kategori" value={filterKategori} onChange={setFilterKategori} options={["Semua", ...allReports.map(g => g.cat)]} minW={170} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: filtered.length === 1 ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          {filtered.map((g, i) => (
            <div key={i} style={{ padding: 16, background: COLORS.gray50, borderRadius: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.blueDark, marginBottom: 8 }}>{g.cat}</div>
              {g.reports.map((r, j) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: j < g.reports.length - 1 ? `1px solid ${COLORS.gray200}` : "none" }}>
                  <span style={{ fontSize: 12, color: COLORS.gray700 }}>{r}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, background: COLORS.white, cursor: "pointer" }}>XLS</button>
                    <button style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, background: COLORS.white, cursor: "pointer" }}>PDF</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Audit Trail & Log Perubahan</SectionTitle>
        <Table columns={["Timestamp", "User", "Modul", "Aksi", "Detail"]} data={[
          ["06 Jul 2026 14:32", "Adm. Wirata Atmaja", "Penagihan", "UPDATE", "Tagihan TGH/07/003 → Terkirim"],
          ["06 Jul 2026 13:15", "Staf Yarpen B", "Klaim JKK", "CREATE", "Klaim SPP/07/104 — Rp 32 jt"],
          ["06 Jul 2026 11:08", "Staf Pajak A", "Perpajakan", "UPDATE", "Tarif TER diperbarui"],
          ["05 Jul 2026 16:45", "System", "Integrasi", "SYNC", "1.248 transaksi → Axapta"],
        ]} />
        <div style={{ marginTop: 8, fontSize: 12, color: COLORS.gray500 }}>Log bersifat read-only</div>
      </div>
    </div>
  );
};
