import { useState } from "react";
import { LayoutDashboard, Activity, Calculator, RefreshCw, FileText, Building2, ClipboardList, CreditCard, Receipt, TrendingDown, Cross, PenLine, Search, Download, Upload, Calendar, CheckCircle2, AlertTriangle, Banknote, Eye, PenTool, Mail, Bell, Menu, ChevronRight, ChevronDown, CircleDot, Shield, Lock, BarChart3, Users, Clock, XCircle, FileUp, Filter, Printer, ExternalLink, ArrowRight, FolderOpen, CircleCheck, CircleAlert, CircleDashed, FileCheck, FileClock, FileX, Landmark, TrendingUp, Wallet, DollarSign, Percent, Hash, UserCheck, FilePlus, ArrowUpDown, MoreHorizontal } from "lucide-react";

const IC = 18; // default icon size

const COLORS = {
  navy: "#0A1628", blue: "#1565C0", blueLight: "#1E88E5", blueDark: "#0D3B7A",
  accent: "#F9A825", green: "#2E7D32", greenLight: "#E8F5E9", red: "#C62828",
  redLight: "#FFEBEE", orange: "#EF6C00", orangeLight: "#FFF3E0", yellowLight: "#FFFDE7",
  gray50: "#FAFAFA", gray100: "#F5F5F5", gray200: "#EEEEEE", gray300: "#E0E0E0",
  gray400: "#BDBDBD", gray500: "#9E9E9E", gray700: "#616161", gray800: "#424242", gray900: "#212121", white: "#FFFFFF",
};

const Badge = ({ children, color = "blue" }) => {
  const map = { blue: { bg: "#E3F2FD", text: COLORS.blue }, green: { bg: COLORS.greenLight, text: COLORS.green }, red: { bg: COLORS.redLight, text: COLORS.red }, orange: { bg: COLORS.orangeLight, text: COLORS.orange }, yellow: { bg: COLORS.yellowLight, text: "#F57F17" }, gray: { bg: COLORS.gray200, text: COLORS.gray700 } };
  const c = map[color] || map.blue;
  return <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</span>;
};

const StatCard = ({ icon, label, value, sub, color = COLORS.blue, link }) => (
  <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 24px", flex: 1, minWidth: 200, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.gray200}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <span style={{ fontSize: 12, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{label}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.gray900, marginBottom: 4 }}>{value}</div>
    {sub && <div style={{ fontSize: 13, color: COLORS.gray500 }}>{sub}</div>}
    {link && <div style={{ fontSize: 13, color: COLORS.blue, marginTop: 8, cursor: "pointer", fontWeight: 500 }}>{link} ↗</div>}
  </div>
);

const Table = ({ columns, data }) => (
  <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead><tr style={{ background: COLORS.gray100 }}>{columns.map((c, i) => <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>)}</tr></thead>
      <tbody>{data.map((row, i) => <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{row.map((cell, j) => <td key={j} style={{ padding: "10px 14px", color: COLORS.gray800 }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const Btn = ({ children, variant = "primary", onClick, size = "md" }) => {
  const styles = { primary: { background: COLORS.blue, color: COLORS.white, border: "none" }, outline: { background: "transparent", color: COLORS.blue, border: `1px solid ${COLORS.blue}` }, danger: { background: COLORS.red, color: COLORS.white, border: "none" }, ghost: { background: "transparent", color: COLORS.gray700, border: `1px solid ${COLORS.gray300}` } };
  const s = styles[variant]; const pd = size === "sm" ? "6px 12px" : "8px 18px";
  return <button onClick={onClick} style={{ ...s, padding: pd, borderRadius: 6, fontSize: size === "sm" ? 12 : 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>{children}</button>;
};

const Select = ({ label, value, onChange, options, minW = 140 }) => (
  <div>
    {label && <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, color: COLORS.gray700, background: COLORS.white, minWidth: minW, width: label ? "100%" : undefined }}>{options.map((o, i) => <option key={i} value={typeof o === "string" ? o : o.value}>{typeof o === "string" ? o : o.label}</option>)}</select>
  </div>
);

const SearchInput = ({ value, onChange, placeholder = "Cari...", minW = 180 }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, minWidth: minW }} />
);

const ProgressBar = ({ value, max, color = COLORS.blue }) => (
  <div style={{ height: 8, background: COLORS.gray200, borderRadius: 4, overflow: "hidden", width: "100%" }}>
    <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 4, transition: "width 0.4s" }} />
  </div>
);

const SectionTitle = ({ children, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>{children}</h3>
    {action}
  </div>
);

const NoData = ({ text = "Tidak ada data yang sesuai filter." }) => (
  <div style={{ padding: 40, textAlign: "center", color: COLORS.gray500, fontSize: 14 }}>{text}</div>
);

// ============ PAGES ============

const DashboardKeuangan = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <StatCard icon={<DollarSign size={IC} />} label="Total Tagihan Bulan Ini" value="Rp 847,2 M" sub="THT + Dapen + JKK + JKm" color={COLORS.blue} link="Lihat Rincian" />
      <StatCard icon={<BarChart3 size={IC} />} label="Realisasi Penerimaan" value="Rp 812,5 M" sub="95.9% dari tagihan" color={COLORS.green} link="Rekonsiliasi" />
      <StatCard icon={<AlertTriangle size={IC} />} label="Satker Menunggak" value="12 Satker" sub="3 lebih dari 1 periode" color={COLORS.orange} link="Detail Tunggakan" />
      <StatCard icon={<FileText size={IC} />} label="Klaim Pending" value="156 Berkas" sub="Rp 23,1 M pending pembayaran" color={COLORS.red} link="Proses Klaim" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Sisa Pagu DIPA</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[{ label: "Dapem Induk", pagu: 4200, realisasi: 3150 }, { label: "Dapem Susulan", pagu: 890, realisasi: 445 }, { label: "Non-Dapem (Harian)", pagu: 320, realisasi: 288 }].map((d, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: COLORS.gray800 }}>{d.label}</span>
                <span style={{ color: COLORS.gray500 }}>Sisa: Rp {(d.pagu - d.realisasi).toLocaleString()} M ({Math.round(((d.pagu - d.realisasi) / d.pagu) * 100)}%)</span>
              </div>
              <ProgressBar value={d.realisasi} max={d.pagu} color={d.realisasi / d.pagu > 0.85 ? COLORS.orange : COLORS.blue} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Status Integrasi Axapta</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ label: "Tersinkron", value: "1.248", badge: "green" }, { label: "Tertunda", value: "23", badge: "yellow" }, { label: "Gagal Sinkron", value: "5", badge: "red" }].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: COLORS.gray700, fontWeight: 500 }}>{s.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray900 }}>{s.value}</span><Badge color={s.badge}>transaksi</Badge></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: COLORS.gray500 }}>Terakhir update: 06 Jul 2026, 14:32 WIB</div>
      </div>
    </div>
    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
      <SectionTitle action={<Btn variant="outline" size="sm">Lihat Semua</Btn>}>Tagihan Terbaru</SectionTitle>
      <Table columns={["No. Surat", "Satker", "Jenis", "Nominal", "Status", "Jatuh Tempo"]} data={[
        ["TGH/2026/07/001", "TNI", "THT + Dapen", "Rp 12.450.000.000", <Badge color="green">Lunas</Badge>, "15 Jul 2026"],
        ["TGH/2026/07/002", "POLRI", "THT + Dapen", "Rp 8.230.000.000", <Badge color="yellow">Menunggu</Badge>, "15 Jul 2026"],
        ["TGH/2026/07/003", "ASN Kemenhan", "JKK + JKm", "Rp 5.670.000.000", <Badge color="blue">Terkirim</Badge>, "20 Jul 2026"],
      ]} />
    </div>
  </div>
);

// ===== KALKULATOR IURAN (ALL FILTERS ACTIVE) =====
const KalkulatorIuran = () => {
  const [tab, setTab] = useState("rekap");
  const [selectedSatker, setSelectedSatker] = useState(null);
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterPeriode, setFilterPeriode] = useState("Juli 2026");
  const [searchPeserta, setSearchPeserta] = useState("");
  const [filterGolPeserta, setFilterGolPeserta] = useState("Semua");
  const [filterSatkerPeserta, setFilterSatkerPeserta] = useState("Semua");

  const allSatkerData = [
    { kode: "TNI", nama: "TNI", peserta: 5480, gp: 438.4, tht: 14.25, dapen: 20.82, jkk: 1.05, jkm: 0.88,
      gol: [
        { gol: "Golongan I (Tamtama)", peserta: 1820, gp: 109.2, tht: 3.55, dapen: 5.19, jkk: 0.26, jkm: 0.22 },
        { gol: "Golongan II (Bintara)", peserta: 2140, gp: 171.2, tht: 5.56, dapen: 8.13, jkk: 0.41, jkm: 0.34 },
        { gol: "Golongan III (Perwira Pertama)", peserta: 1050, gp: 105.0, tht: 3.41, dapen: 4.99, jkk: 0.25, jkm: 0.21 },
        { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 470, gp: 53.0, tht: 1.72, dapen: 2.52, jkk: 0.13, jkm: 0.11 },
      ]},
    { kode: "POLRI", nama: "POLRI", peserta: 4230, gp: 338.4, tht: 11.00, dapen: 16.07, jkk: 0.81, jkm: 0.68,
      gol: [
        { gol: "Golongan I (Tamtama)", peserta: 1350, gp: 81.0, tht: 2.63, dapen: 3.85, jkk: 0.19, jkm: 0.16 },
        { gol: "Golongan II (Bintara)", peserta: 1680, gp: 134.4, tht: 4.37, dapen: 6.38, jkk: 0.32, jkm: 0.27 },
        { gol: "Golongan III (Perwira Pertama)", peserta: 820, gp: 82.0, tht: 2.67, dapen: 3.90, jkk: 0.20, jkm: 0.16 },
        { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 380, gp: 41.0, tht: 1.33, dapen: 1.95, jkk: 0.10, jkm: 0.08 },
      ]},
    { kode: "ASN", nama: "ASN Kemenhan", peserta: 4618, gp: 323.3, tht: 10.51, dapen: 15.36, jkk: 0.77, jkm: 0.65,
      gol: [
        { gol: "Golongan I", peserta: 920, gp: 46.0, tht: 1.50, dapen: 2.19, jkk: 0.11, jkm: 0.09 },
        { gol: "Golongan II", peserta: 1580, gp: 110.6, tht: 3.59, dapen: 5.25, jkk: 0.26, jkm: 0.22 },
        { gol: "Golongan III", peserta: 1450, gp: 116.0, tht: 3.77, dapen: 5.51, jkk: 0.28, jkm: 0.23 },
        { gol: "Golongan IV", peserta: 668, gp: 50.7, tht: 1.65, dapen: 2.41, jkk: 0.12, jkm: 0.10 },
      ]},
  ];

  const allPesertaList = [
    { nrp: "198701234", nama: "Serka Ahmad Fauzi", satker: "TNI", gol: "Gol. II", gp: 3200000, ti: 320000, ta: 192000 },
    { nrp: "199205678", nama: "Briptu Rina Marlina", satker: "POLRI", gol: "Gol. II", gp: 3050000, ti: 305000, ta: 183000 },
    { nrp: "197803456", nama: "Letkol Bambang Suharto", satker: "TNI", gol: "Gol. IV", gp: 5800000, ti: 580000, ta: 348000 },
    { nrp: "198512345", nama: "AKP Dedi Kurniawan", satker: "POLRI", gol: "Gol. III", gp: 4500000, ti: 450000, ta: 270000 },
    { nrp: "199008765", nama: "Peltu Hendra Wijaya", satker: "TNI", gol: "Gol. II", gp: 3400000, ti: 340000, ta: 204000 },
    { nrp: "198604321", nama: "Penata Tk.I Siti Nurhaliza", satker: "ASN Kemenhan", gol: "Gol. III", gp: 4200000, ti: 420000, ta: 252000 },
    { nrp: "199312345", nama: "Praka Rizki Pratama", satker: "TNI", gol: "Gol. I", gp: 2800000, ti: 280000, ta: 168000 },
    { nrp: "198907654", nama: "Bripda Mega Putri", satker: "POLRI", gol: "Gol. I", gp: 2900000, ti: 290000, ta: 174000 },
    { nrp: "197506789", nama: "Pengatur Muda Agus Salim", satker: "ASN Kemenhan", gol: "Gol. II", gp: 3100000, ti: 310000, ta: 186000 },
    { nrp: "198211111", nama: "Pembina Utama Dr. Ratna", satker: "ASN Kemenhan", gol: "Gol. IV", gp: 5500000, ti: 550000, ta: 330000 },
    { nrp: "199401234", nama: "Kopda Joko Widodo", satker: "TNI", gol: "Gol. I", gp: 2750000, ti: 275000, ta: 165000 },
    { nrp: "198802345", nama: "Bripka Anwar Ibrahim", satker: "POLRI", gol: "Gol. III", gp: 4100000, ti: 410000, ta: 246000 },
    { nrp: "199103456", nama: "Pengatur Sri Wahyuni", satker: "ASN Kemenhan", gol: "Gol. I", gp: 2600000, ti: 260000, ta: 156000 },
    { nrp: "197604567", nama: "Mayor Inf. Surya Darma", satker: "TNI", gol: "Gol. III", gp: 4800000, ti: 480000, ta: 288000 },
    { nrp: "198705678", nama: "IPTU Dewi Sartika", satker: "POLRI", gol: "Gol. IV", gp: 5200000, ti: 520000, ta: 312000 },
  ];

  const satkerData = filterSatker === "Semua" ? allSatkerData : allSatkerData.filter(s => s.kode === filterSatker || s.nama === filterSatker);

  const pesertaFiltered = allPesertaList.filter(p => {
    if (filterSatkerPeserta !== "Semua" && p.satker !== filterSatkerPeserta) return false;
    if (filterGolPeserta !== "Semua" && p.gol !== filterGolPeserta) return false;
    if (searchPeserta && !p.nama.toLowerCase().includes(searchPeserta.toLowerCase()) && !p.nrp.includes(searchPeserta)) return false;
    return true;
  });

  const fmt = (n) => `Rp ${n.toLocaleString("id-ID")}`;
  const showCol = (jenis) => filterJenis === "Semua" || filterJenis === jenis;

  const totalTHT = satkerData.reduce((a, s) => a + s.tht, 0);
  const totalDapen = satkerData.reduce((a, s) => a + s.dapen, 0);
  const totalJKK = satkerData.reduce((a, s) => a + s.jkk, 0);
  const totalJKM = satkerData.reduce((a, s) => a + s.jkm, 0);
  const totalPeserta = satkerData.reduce((a, s) => a + s.peserta, 0);

  const [detailPeserta, setDetailPeserta] = useState(null);

  return (
    <div>
      {/* Modal Detail Peserta */}
      {detailPeserta && (() => {
        const p = detailPeserta;
        const dasar = p.gp + p.ti + p.ta;
        const tht = Math.round(dasar * 0.0325); const dapen = Math.round(dasar * 0.0475);
        const jkk = Math.round(dasar * 0.0024); const jkm = Math.round(dasar * 0.002);
        const total = tht + dapen + jkk + jkm;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailPeserta(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray900 }}>{p.nama}</div>
                  <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 2 }}>NRP/NIP: <span style={{ fontFamily: "monospace" }}>{p.nrp}</span> • <Badge color={p.satker === "TNI" ? "green" : p.satker === "POLRI" ? "blue" : "orange"}>{p.satker}</Badge> • {p.gol}</div>
                </div>
                <button onClick={() => setDetailPeserta(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.gray500, padding: 4 }}>✕</button>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Komponen Gaji</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[{ label: "Gaji Pokok", value: p.gp }, { label: "Tunj. Istri (10%)", value: p.ti }, { label: "Tunj. Anak (2%×anak)", value: p.ta }].map((item, i) => (
                    <div key={i} style={{ padding: 14, background: COLORS.gray50, borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: COLORS.gray900 }}>{fmt(item.value)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 14, background: "#E3F2FD", borderRadius: 8, textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: COLORS.gray700 }}>Dasar Perhitungan (GP + T.Istri + T.Anak)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: COLORS.blueDark }}>{fmt(dasar)}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Rincian Iuran</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[
                    { label: "Iuran THT", rate: "3,25%", value: tht, color: COLORS.blue },
                    { label: "Iuran Dapen", rate: "4,75%", value: dapen, color: COLORS.green },
                    { label: "Iuran JKK", rate: "0,24%", value: jkk, color: COLORS.orange },
                    { label: "Iuran JKm", rate: "0,20%", value: jkm, color: "#7B1FA2" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                        <span style={{ fontSize: 13, color: COLORS.gray700 }}>{item.label}</span>
                        <span style={{ fontSize: 11, color: COLORS.gray400 }}>({item.rate})</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: COLORS.gray900 }}>{fmt(item.value)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 16, background: COLORS.blueDark, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 15 }}>Total Iuran Bulanan</span>
                  <span style={{ color: COLORS.accent, fontWeight: 800, fontSize: 22, fontFamily: "monospace" }}>{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {showCol("THT") && <StatCard icon={<BarChart3 size={IC} />} label="Total Iuran THT" value={`Rp ${totalTHT.toFixed(2)} M`} sub="3,25% × (GP+T.Istri+T.Anak)" color={COLORS.blue} />}
        {showCol("Dapen") && <StatCard icon={<BarChart3 size={IC} />} label="Total Iuran Dapen" value={`Rp ${totalDapen.toFixed(2)} M`} sub="4,75% × (GP+T.Istri+T.Anak)" color={COLORS.green} />}
        {showCol("JKK") && <StatCard icon={<Shield size={IC} />} label="Total Iuran JKK" value={`Rp ${totalJKK.toFixed(2)} M`} sub="0,24% × (GP+T.Istri+T.Anak)" color={COLORS.orange} />}
        {showCol("JKm") && <StatCard icon={<Lock size={IC} />} label="Total Iuran JKm" value={`Rp ${totalJKM.toFixed(2)} M`} sub="0,20% × (GP+T.Istri+T.Anak)" color="#7B1FA2" />}
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Select label="Periode" value={filterPeriode} onChange={setFilterPeriode} options={["Juli 2026", "Juni 2026", "Mei 2026", "April 2026", "Maret 2026", "Februari 2026", "Januari 2026"]} minW={130} />
        <Select label="Satker" value={filterSatker} onChange={v => { setFilterSatker(v); setSelectedSatker(null); }} options={["Semua", "TNI", "POLRI", "ASN Kemenhan"]} minW={140} />
        <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["Semua", "THT", "Dapen", "JKK", "JKm"]} minW={120} />
        <Select label="Tanggal Cut-off" value="30 Jun 2026" onChange={() => {}} options={["30 Jun 2026", "31 Mei 2026", "30 Apr 2026"]} minW={130} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["rekap", "peserta", "tidak_lengkap"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === t ? COLORS.blue : COLORS.gray200, color: tab === t ? COLORS.white : COLORS.gray700 }}>
            {t === "rekap" ? "Rekap per Satker & Golongan" : t === "peserta" ? "List per Nama Peserta" : "Data Tidak Lengkap (23)"}
          </button>
        ))}
      </div>

      {tab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm">Ekspor Excel</Btn><Btn variant="outline" size="sm">Ekspor PDF</Btn></div>}>Rekap Iuran per Satker & Golongan {filterSatker !== "Semua" && `— ${filterSatker}`} {filterJenis !== "Semua" && `(${filterJenis})`}</SectionTitle>
          {satkerData.length === 0 ? <NoData /> : satkerData.map((s, si) => (
            <div key={si} style={{ marginBottom: si < satkerData.length - 1 ? 20 : 0 }}>
              <div onClick={() => setSelectedSatker(selectedSatker === s.kode ? null : s.kode)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: COLORS.blueDark, borderRadius: selectedSatker === s.kode ? "8px 8px 0 0" : 8, color: COLORS.white }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{s.kode === "TNI" ? <Shield size={20} /> : s.kode === "POLRI" ? <Shield size={20} /> : <Landmark size={20} />}</span>
                  <div><div style={{ fontWeight: 700, fontSize: 15 }}>{s.nama}</div><div style={{ fontSize: 12, opacity: 0.8 }}>{s.peserta.toLocaleString()} peserta aktif</div></div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 13 }}>
                  {showCol("THT") && <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>THT</div><div style={{ fontWeight: 700 }}>Rp {s.tht} M</div></div>}
                  {showCol("Dapen") && <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>Dapen</div><div style={{ fontWeight: 700 }}>Rp {s.dapen} M</div></div>}
                  {showCol("JKK") && <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>JKK</div><div style={{ fontWeight: 700 }}>Rp {s.jkk} M</div></div>}
                  {showCol("JKm") && <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>JKm</div><div style={{ fontWeight: 700 }}>Rp {s.jkm} M</div></div>}
                  <span style={{ fontSize: 16 }}>{selectedSatker === s.kode ? "▼" : "▶"}</span>
                </div>
              </div>
              {selectedSatker === s.kode && (
                <div style={{ border: `1px solid ${COLORS.gray200}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                  <Table
                    columns={["Golongan", "Jml Peserta", "Total GP+Tunj", ...(showCol("THT") ? ["Iuran THT (3,25%)"] : []), ...(showCol("Dapen") ? ["Iuran Dapen (4,75%)"] : []), ...(showCol("JKK") ? ["Iuran JKK (0,24%)"] : []), ...(showCol("JKm") ? ["Iuran JKm (0,20%)"] : []), "Total"]}
                    data={s.gol.map(g => [
                      <span style={{ fontWeight: 600 }}>{g.gol}</span>, g.peserta.toLocaleString(), `Rp ${g.gp} M`,
                      ...(showCol("THT") ? [`Rp ${g.tht} M`] : []), ...(showCol("Dapen") ? [`Rp ${g.dapen} M`] : []),
                      ...(showCol("JKK") ? [`Rp ${g.jkk} M`] : []), ...(showCol("JKm") ? [`Rp ${g.jkm} M`] : []),
                      <span style={{ fontWeight: 700 }}>Rp {((showCol("THT") ? g.tht : 0) + (showCol("Dapen") ? g.dapen : 0) + (showCol("JKK") ? g.jkk : 0) + (showCol("JKm") ? g.jkm : 0)).toFixed(2)} M</span>,
                    ])}
                  />
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px 16px", background: "#E3F2FD", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.blueDark }}>Grand Total {filterSatker !== "Semua" ? filterSatker : "Seluruh Satker"} {filterJenis !== "Semua" ? `(${filterJenis})` : ""}</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: COLORS.blueDark }}>Rp {((showCol("THT") ? totalTHT : 0) + (showCol("Dapen") ? totalDapen : 0) + (showCol("JKK") ? totalJKK : 0) + (showCol("JKm") ? totalJKM : 0)).toFixed(2)} M</span>
          </div>
        </div>
      )}

      {tab === "peserta" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm">Ekspor Excel</Btn><Btn variant="outline" size="sm">Ekspor PDF</Btn></div>}>Daftar Iuran per Nama Peserta</SectionTitle>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
            <Select label="Satker" value={filterSatkerPeserta} onChange={setFilterSatkerPeserta} options={["Semua", "TNI", "POLRI", "ASN Kemenhan"]} minW={130} />
            <Select label="Golongan" value={filterGolPeserta} onChange={setFilterGolPeserta} options={["Semua", "Gol. I", "Gol. II", "Gol. III", "Gol. IV"]} minW={120} />
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari NRP/Nama</label><SearchInput value={searchPeserta} onChange={setSearchPeserta} placeholder="Ketik NRP atau nama..." /></div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Menampilkan {pesertaFiltered.length} dari {allPesertaList.length} peserta</div>
          {pesertaFiltered.length === 0 ? <NoData /> : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["No", "NRP/NIP", "Nama Peserta", "Satker", "Golongan", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr></thead>
                <tbody>{pesertaFiltered.map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 14px", color: COLORS.gray500 }}>{i + 1}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12 }}>{p.nrp}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: COLORS.gray800 }}>{p.nama}</td>
                    <td style={{ padding: "10px 14px" }}><Badge color={p.satker === "TNI" ? "green" : p.satker === "POLRI" ? "blue" : "orange"}>{p.satker}</Badge></td>
                    <td style={{ padding: "10px 14px" }}>{p.gol}</td>
                    <td style={{ padding: "10px 14px" }}><Btn size="sm" variant="outline" onClick={() => setDetailPeserta(p)}>Detail</Btn></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "tidak_lengkap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <div style={{ background: COLORS.orangeLight, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, display: "flex", gap: 8 }}><AlertTriangle size={14} /><span>Peserta berikut dikecualikan dari total tagihan karena data gaji tidak lengkap.</span></div>
          <Table columns={["NRP/NIP", "Nama", "Satker", "Golongan", "Komponen Kosong", "Status", "Aksi"]} data={[
            ["198701234", "Serka Ahmad Fauzi", <Badge color="green">TNI</Badge>, "Gol. II", <Badge color="red">Tunj. Anak</Badge>, <Badge color="orange">Belum Lengkap</Badge>, <Btn size="sm" variant="outline">Lengkapi</Btn>],
            ["198805678", "Briptu Budi Santoso", <Badge color="blue">POLRI</Badge>, "Gol. I", <Badge color="red">Gaji Pokok</Badge>, <Badge color="orange">Belum Lengkap</Badge>, <Btn size="sm" variant="outline">Lengkapi</Btn>],
            ["199012345", "Penata Citra Dewi", <Badge color="orange">ASN Kemenhan</Badge>, "Gol. III", <Badge color="red">Tunj. Istri</Badge>, <Badge color="orange">Belum Lengkap</Badge>, <Btn size="sm" variant="outline">Lengkapi</Btn>],
          ]} />
        </div>
      )}
    </div>
  );
};

// ===== REKONSILIASI IURAN (ALL FILTERS ACTIVE) =====
const RekonsIuran = () => {
  const [filterJenis, setFilterJenis] = useState("THT");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterPeriode, setFilterPeriode] = useState("Juli 2026");

  const allRekonData = {
    THT: [
      { satker: "TNI", sistem: 6084500000, skp: 6084500000 },
      { satker: "POLRI", sistem: 4912300000, skp: 4969970000 },
      { satker: "ASN Kemenhan", sistem: 2914200000, skp: 2914200000 },
    ],
    Dapen: [
      { satker: "TNI", sistem: 8890000000, skp: 8890000000 },
      { satker: "POLRI", sistem: 7180000000, skp: 7250000000 },
      { satker: "ASN Kemenhan", sistem: 4260000000, skp: 4260000000 },
    ],
  };

  const rekonRows = (allRekonData[filterJenis] || []).filter(r => filterSatker === "Semua" || r.satker === filterSatker);
  const totalSistem = rekonRows.reduce((a, r) => a + r.sistem, 0);
  const totalSKP = rekonRows.reduce((a, r) => a + r.skp, 0);
  const fmtB = n => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Rekonsiliasi Iuran vs SKP-PFK Kemenkeu</SectionTitle>
        <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F57F17", display: "flex", gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={14} />
          <span>Rekonsiliasi hanya berlaku untuk iuran <strong>THT</strong> dan <strong>Dapen</strong> karena acuan tagihannya berdasarkan SKP-PFK dari Kemenkeu. Iuran JKK dan JKm menggunakan acuan terpisah (Data Klaim & Kalkulasi Sistem).</span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Periode" value={filterPeriode} onChange={setFilterPeriode} options={["Juli 2026", "Juni 2026", "Mei 2026", "April 2026"]} minW={130} />
          <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["THT", "Dapen"]} minW={120} />
          <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan"]} minW={140} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#E3F2FD", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total Hitung Sistem ({filterJenis})</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue }}>{fmtB(totalSistem)}</div>
          </div>
          <div style={{ background: "#E8F5E9", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total SKP-PFK Kemenkeu</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.green }}>{fmtB(totalSKP)}</div>
          </div>
          <div style={{ background: totalSKP - totalSistem !== 0 ? COLORS.redLight : COLORS.greenLight, borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Selisih</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: totalSKP - totalSistem !== 0 ? COLORS.red : COLORS.green }}>{fmtB(Math.abs(totalSKP - totalSistem))}</div>
            {totalSKP - totalSistem !== 0 && <div style={{ fontSize: 11, color: COLORS.red }}>{totalSKP > totalSistem ? "SKP-PFK > Hitung Sistem" : "Hitung Sistem > SKP-PFK"}</div>}
            {totalSKP - totalSistem === 0 && <div style={{ fontSize: 11, color: COLORS.green }}>✅ Matched</div>}
          </div>
        </div>
        {rekonRows.length === 0 ? <NoData /> : (
          <Table columns={["Satker", "Hitung Sistem", "SKP-PFK", "Selisih", "Status", "Drill-down"]}
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
          <Btn variant="outline" size="sm">Unduh Tabel 1 BRS II (Excel)</Btn>
          <Btn variant="outline" size="sm">Unduh PDF</Btn>
        </div>
      </div>
    </div>
  );
};

// ===== PENAGIHAN IURAN KE KEMENKEU =====
const GeneratorTagihan = () => {
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const steps = ["Cut-off Data", "Draft Surat", "Download & Cetak", "Dokumen di-TTD"];
  const stepIcon = (idx, currentStep) => {
    if (idx < currentStep) return { bg: COLORS.green, icon: "✓", color: COLORS.white };
    if (idx === currentStep) return { bg: COLORS.blue, icon: (idx + 1).toString(), color: COLORS.white };
    return { bg: COLORS.gray300, icon: (idx + 1).toString(), color: COLORS.gray500 };
  };

  const allTagihan = [
    { id: "TGH-001", noSurat: "001/ASABRI/TGH-THT/VII/2026", jenis: "THT", acuan: "SKP-PFK", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 35.760.000.000", peserta: "14.328", currentStep: 3, tglDraft: "26 Jun 2026", tglDownload: "27 Jun 2026", tglTTD: "28 Jun 2026", fileTTD: "Surat_Tagihan_THT_Juli2026_signed.pdf", icon: "banknote" },
    { id: "TGH-002", noSurat: "002/ASABRI/TGH-DAP/VII/2026", jenis: "Dapen", acuan: "SKP-PFK", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 52.250.000.000", peserta: "14.328", currentStep: 3, tglDraft: "26 Jun 2026", tglDownload: "27 Jun 2026", tglTTD: "28 Jun 2026", fileTTD: "Surat_Tagihan_Dapen_Juli2026_signed.pdf", icon: "barchart" },
    { id: "TGH-003", noSurat: "003/ASABRI/TGH-JKK/VII/2026", jenis: "JKK", acuan: "Data Klaim", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 2.630.000.000", peserta: "14.328", currentStep: 2, tglDraft: "26 Jun 2026", tglDownload: "27 Jun 2026", tglTTD: null, fileTTD: null, icon: "shield" },
    { id: "TGH-004", noSurat: "004/ASABRI/TGH-JKM/VII/2026", jenis: "JKm", acuan: "Data Klaim", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 2.210.000.000", peserta: "14.328", currentStep: 1, tglDraft: "26 Jun 2026", tglDownload: null, tglTTD: null, fileTTD: null, icon: "lock" },
    { id: "TGH-005", noSurat: "005/ASABRI/TGH-THT/VI/2026", jenis: "THT", acuan: "SKP-PFK", periode: "Juni 2026", cutoff: "25 Mei 2026", nominal: "Rp 35.420.000.000", peserta: "14.290", currentStep: 3, tglDraft: "26 Mei 2026", tglDownload: "26 Mei 2026", tglTTD: "27 Mei 2026", fileTTD: "Surat_Tagihan_THT_Juni2026_signed.pdf", icon: "banknote" },
    { id: "TGH-006", noSurat: "006/ASABRI/TGH-DAP/VI/2026", jenis: "Dapen", acuan: "SKP-PFK", periode: "Juni 2026", cutoff: "25 Mei 2026", nominal: "Rp 51.800.000.000", peserta: "14.290", currentStep: 3, tglDraft: "26 Mei 2026", tglDownload: "26 Mei 2026", tglTTD: "27 Mei 2026", fileTTD: "Surat_Tagihan_Dapen_Juni2026_signed.pdf", icon: "barchart" },
  ];

  const statusLabel = (step) => {
    if (step >= 3) return { label: "Dokumen di-TTD", color: "green" };
    if (step >= 2) return { label: "Siap Download", color: "blue" };
    if (step >= 1) return { label: "Draft Tersedia", color: "yellow" };
    return { label: "Menunggu Cut-off", color: "gray" };
  };

  const filtered = allTagihan.filter(t => {
    if (filterJenis !== "Semua" && t.jenis !== filterJenis) return false;
    if (filterStatus === "Menunggu TTD" && t.currentStep >= 3) return false;
    if (filterStatus === "Menunggu TTD" && t.currentStep < 2) return false;
    if (filterStatus === "Sudah TTD" && t.currentStep < 3) return false;
    if (filterStatus === "Belum Download" && t.currentStep >= 2) return false;
    return true;
  });

  const countTTD = allTagihan.filter(t => t.currentStep >= 3).length;
  const countBelumTTD = allTagihan.filter(t => t.currentStep >= 2 && t.currentStep < 3).length;
  const countDraft = allTagihan.filter(t => t.currentStep < 2).length;

  return (
    <div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "16px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📅</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900 }}>Cut-off Tagihan Periode Juli 2026</div>
            <div style={{ fontSize: 12, color: COLORS.gray500 }}>Tanggal cut-off: <strong>25 Juni 2026</strong> — Data kepesertaan & gaji terkunci untuk kalkulasi tagihan</div>
          </div>
        </div>
        <Badge color="green">✅ Data Terkunci</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#E3F2FD", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.blueDark }}>THT & Dapen</div><div style={{ fontSize: 12, color: COLORS.gray700 }}>Acuan tagihan: <strong>SKP-PFK Kemenkeu</strong></div></div>
        </div>
        <div style={{ background: COLORS.orangeLight, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.orange }}>JKK & JKm</div><div style={{ fontSize: 12, color: COLORS.gray700 }}>Acuan tagihan: <strong>Data Klaim & Kalkulasi Sistem</strong></div></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="📄" label="Total Surat Tagihan" value={allTagihan.length.toString()} sub="Aktif + riwayat" color={COLORS.blue} />
        <StatCard icon="success" label="Sudah di-TTD" value={countTTD.toString()} sub="Siap kirim manual" color={COLORS.green} />
        <StatCard icon="✍️" label="Menunggu TTD" value={countBelumTTD.toString()} sub="Sudah didownload" color={COLORS.orange} />
        <StatCard icon="📝" label="Draft / Belum Download" value={countDraft.toString()} sub="Perlu diproses" color={COLORS.red} />
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["Semua", "THT", "Dapen", "JKK", "JKm"]} minW={120} />
        <Select label="Status" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Sudah TTD", "Menunggu TTD", "Belum Download"]} minW={160} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? <NoData text="Tidak ada tagihan yang sesuai filter." /> : filtered.map(t => {
          const st = statusLabel(t.currentStep);
          const isExpanded = expandedId === t.id;
          const isUploading = uploadingId === t.id;
          return (
            <div key={t.id} style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <div onClick={() => setExpandedId(isExpanded ? null : t.id)} style={{ cursor: "pointer", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ display: "flex" }}>{{"banknote": <Banknote size={24} />, "barchart": <BarChart3 size={24} />, "shield": <Shield size={24} />, "lock": <Lock size={24} />}[t.icon] || t.icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.gray900 }}>Tagihan {t.jenis}</span>
                      <Badge color={st.color}>{st.label}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.gray500 }}>{t.noSurat} • Periode {t.periode} • {t.peserta} peserta</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.blueDark, fontFamily: "monospace" }}>{t.nominal}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray500 }}>Cut-off: {t.cutoff}</div>
                  </div>
                  {t.currentStep >= 1 && <Btn size="sm" variant="outline" onClick={e => e.stopPropagation()}>Download Surat</Btn>}
                  <span style={{ fontSize: 14, color: COLORS.gray400 }}>{isExpanded ? "▼" : "▶"}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: `1px solid ${COLORS.gray200}`, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 24 }}>
                    {steps.map((step, idx) => {
                      const s = stepIcon(idx, t.currentStep);
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{s.icon}</div>
                            <div style={{ fontSize: 11, textAlign: "center", color: idx <= t.currentStep ? COLORS.gray800 : COLORS.gray400, fontWeight: idx === t.currentStep ? 700 : 400, lineHeight: 1.3 }}>{step}</div>
                          </div>
                          {idx < steps.length - 1 && <div style={{ height: 3, flex: 1, background: idx < t.currentStep ? COLORS.green : COLORS.gray300, marginTop: -18, borderRadius: 2 }} />}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                    <div style={{ padding: "12px 14px", background: COLORS.greenLight, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>📅 Cut-off Data</div>
                      <div style={{ fontWeight: 700, color: COLORS.gray800, marginTop: 2 }}>{t.cutoff}</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: t.tglDraft ? COLORS.greenLight : COLORS.gray50, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>📝 Draft Dibuat</div>
                      <div style={{ fontWeight: 700, color: COLORS.gray800, marginTop: 2 }}>{t.tglDraft}</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: t.tglDownload ? COLORS.greenLight : COLORS.gray50, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>Download & Cetak</div>
                      <div style={{ fontWeight: 700, color: COLORS.gray800, marginTop: 2 }}>{t.tglDownload || <span style={{ color: COLORS.gray400 }}>Belum</span>}</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: t.tglTTD ? COLORS.greenLight : COLORS.yellowLight, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>✍️ Tanda Tangan Kadiv</div>
                      <div style={{ fontWeight: 700, color: t.tglTTD ? COLORS.green : "#F57F17", marginTop: 2 }}>{t.tglTTD || "Menunggu TTD"}</div>
                    </div>
                  </div>

                  {!t.fileTTD ? (
                    <div style={{ border: `2px dashed ${COLORS.gray300}`, borderRadius: 10, padding: "24px 20px", textAlign: "center", background: COLORS.gray50, marginBottom: 16 }}>
                      <div style={{ marginBottom: 8, opacity: 0.4 }}><PenTool size={36} /></div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray800, marginBottom: 4 }}>Upload Dokumen Tagihan yang Sudah di-TTD</div>
                      <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 14 }}>Upload file PDF surat tagihan yang sudah ditandatangani oleh Kadiv Keuangan</div>
                      <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap" }}>
                        <div>
                          <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 3 }}>Tanggal TTD</label>
                          <input type="date" style={{ padding: "7px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }} />
                        </div>
                        <Btn onClick={() => { setUploadingId(t.id); setTimeout(() => setUploadingId(null), 1500); }}>
                          {isUploading ? "Mengupload..." : "Pilih File & Upload"}
                        </Btn>
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 10 }}>Format: PDF — Maks. 20 MB</div>
                    </div>
                  ) : (
                    <div style={{ border: `1px solid ${COLORS.green}`, borderRadius: 10, padding: "16px 20px", background: COLORS.greenLight, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CheckCircle2 size={24} color={COLORS.green} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.green }}>Dokumen sudah ditandatangani</div>
                          <div style={{ fontSize: 12, color: COLORS.gray700 }}>
                            Tanggal TTD: <strong>{t.tglTTD}</strong> • File: <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.blue }}>{t.fileTTD}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn size="sm" variant="outline">Lihat</Btn>
                        <Btn size="sm" variant="ghost">Ganti File</Btn>
                      </div>
                    </div>
                  )}

                  <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F57F17", display: "flex", gap: 8, marginBottom: 12 }}>
                    <Mail size={14} />
                    <span>Proses selanjutnya dilakukan secara manual: surat tagihan yang sudah di-TTD dikirimkan ke Kemenkeu melalui Kantor Pos oleh Divisi Keuangan.</span>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="outline" size="sm">Download Surat Tagihan (PDF)</Btn>
                    <Btn variant="outline" size="sm">Lihat Rekap Premi</Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== MONITORING KLAIM (ALL FILTERS ACTIVE) =====
const MonitoringKlaim = () => {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [searchKlaim, setSearchKlaim] = useState("");

  const allKlaim = [
    { spp: "SPP/2026/07/101", rekap: "RK-001", peserta: "Serma Agus P.", jenisKlaim: "Rawat Inap", nominal: "Rp 45.000.000", status: "Dibayar", riwayat: "4 tahap", pic: "Staf Yarpen A", mitra: "Bank Mandiri" },
    { spp: "SPP/2026/07/102", rekap: "RK-001", peserta: "Pratu Dedi S.", jenisKlaim: "Rawat Jalan", nominal: "Rp 8.500.000", status: "Disetujui", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "BRI" },
    { spp: "SPP/2026/07/103", rekap: "RK-002", peserta: "Bripka Rina M.", jenisKlaim: "Operasi", nominal: "Rp 120.000.000", status: "Verifikasi", riwayat: "2 tahap", pic: "Staf Yarpen B", mitra: "BNI" },
    { spp: "SPP/2026/07/104", rekap: "RK-002", peserta: "Koptu Hasan F.", jenisKlaim: "Rawat Inap", nominal: "Rp 32.000.000", status: "Pengajuan", riwayat: "1 tahap", pic: "—", mitra: "Bank Mandiri" },
    { spp: "SPP/2026/07/105", rekap: "RK-003", peserta: "Kapten Lina W.", jenisKlaim: "Rawat Jalan", nominal: "Rp 5.200.000", status: "Ditolak", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "BRI" },
    { spp: "SPP/2026/07/106", rekap: "RK-003", peserta: "Pelda Susanto", jenisKlaim: "Operasi", nominal: "Rp 87.000.000", status: "Dibayar", riwayat: "4 tahap", pic: "Staf Yarpen A", mitra: "BNI" },
    { spp: "SPP/2026/07/107", rekap: "RK-004", peserta: "Briptu Mega S.", jenisKlaim: "Rawat Inap", nominal: "Rp 28.000.000", status: "Verifikasi", riwayat: "2 tahap", pic: "Staf Yarpen B", mitra: "BTN" },
    { spp: "SPP/2026/07/108", rekap: "RK-004", peserta: "Sertu Ahmad R.", jenisKlaim: "Rawat Jalan", nominal: "Rp 12.800.000", status: "Disetujui", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "Bank Mandiri" },
  ];

  const statusBadge = s => s === "Dibayar" ? "green" : s === "Disetujui" ? "blue" : s === "Verifikasi" ? "orange" : s === "Ditolak" ? "red" : "gray";

  const filtered = allKlaim.filter(k => {
    if (filterStatus !== "Semua" && k.status !== filterStatus) return false;
    if (filterMitra !== "Semua" && k.mitra !== filterMitra) return false;
    if (filterJenis !== "Semua" && k.jenisKlaim !== filterJenis) return false;
    if (searchKlaim && !k.peserta.toLowerCase().includes(searchKlaim.toLowerCase()) && !k.spp.toLowerCase().includes(searchKlaim.toLowerCase())) return false;
    return true;
  });

  const counts = { total: allKlaim.length, verif: allKlaim.filter(k => k.status === "Verifikasi").length, setuju: allKlaim.filter(k => k.status === "Disetujui" || k.status === "Dibayar").length, tolak: allKlaim.filter(k => k.status === "Ditolak").length };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<ClipboardList size={IC} />} label="Total Klaim Bulan Ini" value={counts.total.toString()} color={COLORS.blue} />
        <StatCard icon={<Search size={IC} />} label="Dalam Verifikasi" value={counts.verif.toString()} color={COLORS.orange} />
        <StatCard icon={<CheckCircle2 size={IC} />} label="Disetujui/Dibayar" value={counts.setuju.toString()} color={COLORS.green} />
        <StatCard icon={<XCircle size={IC} />} label="Ditolak" value={counts.tolak.toString()} color={COLORS.red} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Tracking Klaim JKK Perawatan</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Status" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Pengajuan", "Verifikasi", "Disetujui", "Ditolak", "Dibayar"]} minW={130} />
          <Select label="Mitra Bayar" value={filterMitra} onChange={setFilterMitra} options={["Semua", "Bank Mandiri", "BRI", "BNI", "BTN"]} minW={140} />
          <Select label="Jenis Klaim" value={filterJenis} onChange={setFilterJenis} options={["Semua", "Rawat Inap", "Rawat Jalan", "Operasi"]} minW={130} />
          <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchKlaim} onChange={setSearchKlaim} placeholder="SPP / Nama peserta..." /></div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allKlaim.length} klaim</div>
        {filtered.length === 0 ? <NoData /> : (
          <Table columns={["No. SPP", "No. Rekap", "Peserta", "Jenis Klaim", "Nominal", "Mitra Bayar", "Status", "Riwayat", "PIC Terakhir"]}
            data={filtered.map(k => [k.spp, k.rekap, k.peserta, k.jenisKlaim, k.nominal, k.mitra, <Badge color={statusBadge(k.status)}>{k.status}</Badge>, k.riwayat, k.pic])} />
        )}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Alur Status Klaim</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "10px 0" }}>
          {["Pengajuan", "Verifikasi", "Disetujui / Ditolak", "Dibayar"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "10px 20px", borderRadius: 8, background: i === 0 ? COLORS.gray200 : i === 1 ? COLORS.orangeLight : i === 2 ? "#E3F2FD" : COLORS.greenLight, fontWeight: 600, fontSize: 13, color: COLORS.gray800, textAlign: "center" }}>{s}</div>
              {i < 3 && <div style={{ width: 40, height: 2, background: COLORS.gray300 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== DASHBOARD DANA (ALL FILTERS ACTIVE) =====
const DashboardDana = () => {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [uploadState, setUploadState] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterStatusBayar, setFilterStatusBayar] = useState("Semua");
  const [searchRekap, setSearchRekap] = useState("");

  const rekapHarian = [
    { no: 1, noRef: "MND-20260706-00142", nrp: "198701234", nama: "Purn. Kol. Ahmad Rifai", jenis: "Pensiun Bulanan", mitra: "Bank Mandiri", nominal: "Rp 8.500.000", status: "Berhasil", waktu: "06:15" },
    { no: 2, noRef: "MND-20260706-00143", nrp: "199205678", nama: "Purn. Letda Budi Kartono", jenis: "Pensiun Bulanan", mitra: "Bank Mandiri", nominal: "Rp 6.200.000", status: "Berhasil", waktu: "06:15" },
    { no: 3, noRef: "MND-20260706-00187", nrp: "198604321", nama: "Purn. AKP Siti Nurhaliza", jenis: "Klaim JKK", mitra: "Bank Mandiri", nominal: "Rp 45.000.000", status: "Berhasil", waktu: "08:30" },
    { no: 4, noRef: "BRI-20260706-01205", nrp: "197803456", nama: "Purn. Serma Hendra W.", jenis: "Pensiun Bulanan", mitra: "BRI", nominal: "Rp 7.800.000", status: "Berhasil", waktu: "06:00" },
    { no: 5, noRef: "BRI-20260706-01289", nrp: "199312345", nama: "Janda Alm. Koptu Andi S.", jenis: "Pensiun Janda/Duda", mitra: "BRI", nominal: "Rp 4.200.000", status: "Berhasil", waktu: "06:00" },
    { no: 6, noRef: "BRI-20260706-01334", nrp: "198512890", nama: "Purn. Bripka Dedi K.", jenis: "Klaim JKm", mitra: "BRI", nominal: "Rp 32.000.000", status: "Berhasil", waktu: "10:00" },
    { no: 7, noRef: "BNI-20260706-00891", nrp: "199008765", nama: "Purn. Peltu Rizki P.", jenis: "Pensiun Bulanan", mitra: "BNI", nominal: "Rp 5.900.000", status: "Berhasil", waktu: "06:30" },
    { no: 8, noRef: "BNI-20260706-00923", nrp: "198907654", nama: "Purn. Kapten Mega Putri", jenis: "THT", mitra: "BNI", nominal: "Rp 120.000.000", status: "Berhasil", waktu: "09:45" },
    { no: 9, noRef: "MND-20260706-00245", nrp: "197506789", nama: "Purn. Pengatur Agus S.", jenis: "Pensiun Bulanan", mitra: "Bank Mandiri", nominal: "Rp 5.400.000", status: "Gagal", waktu: "06:15", keterangan: "Rekening dormant" },
    { no: 10, noRef: "BNI-20260706-00956", nrp: "198211111", nama: "Purn. Pembina Dr. Ratna", jenis: "Klaim JKK", mitra: "BNI", nominal: "Rp 68.500.000", status: "Berhasil", waktu: "11:20" },
  ];

  const filteredRekap = rekapHarian.filter(r => {
    if (selectedMitra !== "Semua" && r.mitra !== selectedMitra) return false;
    if (filterJenis !== "Semua" && r.jenis !== filterJenis) return false;
    if (filterStatusBayar !== "Semua" && r.status !== filterStatusBayar) return false;
    if (searchRekap && !r.nama.toLowerCase().includes(searchRekap.toLowerCase()) && !r.nrp.includes(searchRekap)) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Building2 size={IC} />} label="Total Saldo Mitra Bayar" value="Rp 2,34 T" sub="8 Mitra Bayar aktif" color={COLORS.blue} />
        <StatCard icon={<TrendingUp size={IC} />} label="Kebutuhan Minggu Depan" value="Rp 412 M" sub="Proyeksi klaim disetujui" color={COLORS.orange} />
        <StatCard icon={<CheckCircle2 size={IC} />} label="Pembayaran Hari Ini" value="825 Transaksi" sub="Rp 42,55 M tersalurkan" color={COLORS.green} />
        <StatCard icon={<CircleAlert size={IC} />} label="Gagal Bayar" value="3 Transaksi" sub="Perlu tindak lanjut" color={COLORS.red} />
      </div>

      {/* Trend Pembayaran 3 Bulan Terakhir */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Trend Pembayaran Manfaat — 3 Bulan Terakhir</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          {[
            { bulan: "Mei 2026", total: 38.2, trx: 12450, gagal: 8, pct: 99.9 },
            { bulan: "Juni 2026", total: 41.8, trx: 12820, gagal: 5, pct: 99.96 },
            { bulan: "Juli 2026", total: 42.55, trx: 13100, gagal: 3, pct: 99.98 },
          ].map((m, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 8, border: `1px solid ${COLORS.gray200}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(m.total / 45) * 100}%`, background: `${COLORS.blue}08`, transition: "height 0.4s" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 12, color: COLORS.gray500, fontWeight: 600, marginBottom: 8 }}>{m.bulan}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.blueDark, fontFamily: "monospace" }}>Rp {m.total} M</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: COLORS.gray500 }}>{m.trx.toLocaleString()} trx</span>
                  <span style={{ color: COLORS.green, fontWeight: 600 }}>{m.pct}% berhasil</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12 }}>
                  <span style={{ color: COLORS.gray500 }}>Gagal: <span style={{ color: COLORS.red, fontWeight: 600 }}>{m.gagal}</span></span>
                  {i > 0 && <span style={{ color: COLORS.green, fontWeight: 600 }}>+{((m.total / [38.2, 38.2, 41.8][i]) * 100 - 100).toFixed(1)}%</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: COLORS.gray500 }}>
          <span>Total 3 bulan: <strong style={{ color: COLORS.gray900 }}>Rp 122,55 M</strong></span>
          <span>•</span>
          <span>Rata-rata: <strong style={{ color: COLORS.gray900 }}>Rp 40,85 M/bulan</strong></span>
          <span>•</span>
          <span>Trend: <strong style={{ color: COLORS.green }}>Naik +5,9%</strong></span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[{ id: "monitoring", label: "📊 Monitoring Saldo" }, { id: "rekap", label: "📋 Rekap Harian Rekening Koran" }, { id: "upload", label: "📤 Upload Rekening Koran" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "12px 24px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: "transparent", color: activeTab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>{t.label}</button>
        ))}
      </div>
      {activeTab === "monitoring" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle>Saldo & Proyeksi per Mitra Bayar</SectionTitle>
          <Table columns={["Mitra Bayar", "Saldo Terkini", "Kebutuhan 7 Hari", "Kebutuhan 30 Hari", "Coverage", "Status", "Update"]} data={[
            ["Bank Mandiri", "Rp 820 M", "Rp 120 M", "Rp 480 M", "170%", <Badge color="green">Aman</Badge>, "14:30"],
            ["BRI", "Rp 650 M", "Rp 95 M", "Rp 380 M", "171%", <Badge color="green">Aman</Badge>, "14:28"],
            ["BNI", "Rp 420 M", "Rp 80 M", "Rp 320 M", "131%", <Badge color="green">Aman</Badge>, "14:31"],
            ["BTN", "Rp 180 M", "Rp 55 M", "Rp 220 M", "82%", <Badge color="yellow">Perhatian</Badge>, "14:29"],
            [<span style={{ fontWeight: 700, color: COLORS.red }}>PT Pos Indonesia</span>, "Rp 45 M", "Rp 62 M", "Rp 248 M", <span style={{ color: COLORS.red, fontWeight: 700 }}>18%</span>, <Badge color="red">Kritis</Badge>, "14:25"],
          ]} />
        </div>
      )}
      {activeTab === "upload" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 24, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle>Upload File Rekening Koran Mitra Bayar</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
            <Select label="Mitra Bayar" value="Pilih..." onChange={() => {}} options={["Pilih...", "Bank Mandiri", "BRI", "BNI", "BTN", "PT Pos Indonesia"]} />
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal</label><input type="date" defaultValue="2026-07-06" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, boxSizing: "border-box" }} /></div>
            <Select label="Format" value="CSV (.csv)" onChange={() => {}} options={["CSV (.csv)", "Excel (.xlsx)"]} />
          </div>
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); setUploadState("uploading"); setTimeout(() => setUploadState("success"), 1500); }}
            onClick={() => { setUploadState("uploading"); setTimeout(() => setUploadState("success"), 1500); }}
            style={{ border: `2px dashed ${dragOver ? COLORS.blue : COLORS.gray300}`, borderRadius: 12, padding: "48px 24px", textAlign: "center", background: dragOver ? "#E3F2FD" : COLORS.gray50, cursor: "pointer", marginBottom: 16 }}>
            {uploadState === "idle" && <><div style={{ marginBottom: 12, opacity: 0.4 }}><Upload size={48} /></div><div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>Drag & drop file rekening koran di sini</div><div style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 16 }}>atau klik untuk memilih file dari komputer</div><div style={{ display: "inline-flex", padding: "8px 20px", background: COLORS.blue, color: COLORS.white, borderRadius: 6, fontSize: 13, fontWeight: 600 }}>Pilih File</div><div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 12 }}>Format: .csv, .xlsx — Maks. 50 MB</div></>}
            {uploadState === "uploading" && <><div style={{ marginBottom: 12, color: COLORS.blue }}><Clock size={48} /></div><div style={{ fontSize: 16, fontWeight: 700, color: COLORS.blue }}>Mengupload & memproses file...</div></>}
            {uploadState === "success" && <><div style={{ marginBottom: 12, color: COLORS.green }}><CheckCircle2 size={48} /></div><div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green, marginBottom: 6 }}>File berhasil diupload & diparsing!</div><div style={{ fontSize: 13, color: COLORS.gray700, marginBottom: 12 }}>342 transaksi pembayaran terdeteksi — total Rp 18.450.000.000</div><div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Btn size="sm" variant="outline" onClick={e => { e.stopPropagation(); setActiveTab("rekap"); }}>Lihat Hasil</Btn><Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setUploadState("idle"); }}>Upload Lain</Btn></div></>}
          </div>
        </div>
      )}
      {activeTab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm">Excel</Btn><Btn variant="outline" size="sm">PDF</Btn></div>}>Rekap Pembayaran Mitra ke Peserta</SectionTitle>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <Select label="Mitra Bayar" value={selectedMitra} onChange={setSelectedMitra} options={["Semua", "Bank Mandiri", "BRI", "BNI"]} minW={140} />
            <Select label="Jenis Pembayaran" value={filterJenis} onChange={setFilterJenis} options={["Semua", "Pensiun Bulanan", "Pensiun Janda/Duda", "Klaim JKK", "Klaim JKm", "THT"]} minW={160} />
            <Select label="Status" value={filterStatusBayar} onChange={setFilterStatusBayar} options={["Semua", "Berhasil", "Gagal"]} minW={100} />
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchRekap} onChange={setSearchRekap} placeholder="NRP / Nama peserta..." /></div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filteredRekap.length} dari {rekapHarian.length} transaksi</div>
          {filteredRekap.length === 0 ? <NoData /> : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["No", "No. Referensi", "NRP/NIP", "Nama Peserta", "Jenis", "Mitra", "Nominal", "Waktu", "Status", "Ket."].map((c, i) => <th key={i} style={{ padding: "8px 10px", textAlign: i === 6 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>)}
                </tr></thead>
                <tbody>{filteredRekap.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: r.status === "Gagal" ? COLORS.redLight : "transparent" }} onMouseEnter={e => { if (r.status !== "Gagal") e.currentTarget.style.background = COLORS.gray50; }} onMouseLeave={e => { if (r.status !== "Gagal") e.currentTarget.style.background = r.status === "Gagal" ? COLORS.redLight : "transparent"; }}>
                    <td style={{ padding: "8px 10px", color: COLORS.gray500 }}>{r.no}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11, color: COLORS.blue }}>{r.noRef}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11 }}>{r.nrp}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>{r.nama}</td>
                    <td style={{ padding: "8px 10px" }}><Badge color={r.jenis.includes("JKK") ? "orange" : r.jenis.includes("JKm") ? "red" : r.jenis === "THT" ? "green" : "blue"}>{r.jenis}</Badge></td>
                    <td style={{ padding: "8px 10px" }}>{r.mitra}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{r.nominal}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: COLORS.gray500 }}>{r.waktu}</td>
                    <td style={{ padding: "8px 10px" }}><Badge color={r.status === "Berhasil" ? "green" : "red"}>{r.status}</Badge></td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: COLORS.red }}>{r.keterangan || "—"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===== REMAINING PAGES (Perpajakan, KreditPiutang, DashboardDIPA, RekonBPJS, ReportGenerator) =====
const Perpajakan = () => {
  const [filterSatker, setFilterSatker] = useState("Semua");
  const allData = [
    { nrp: "198701234", nama: "Purn. Kol. Ahmad Rifai", satker: "TNI", bruto: 8500000, p17: 125000, ter: 127500 },
    { nrp: "198805678", nama: "Purn. Lettu Budi K.", satker: "TNI", bruto: 6200000, p17: 62000, ter: 62000 },
    { nrp: "199012345", nama: "Purn. AKP Citra D.", satker: "POLRI", bruto: 12800000, p17: 450000, ter: 460800 },
    { nrp: "199205678", nama: "Purn. Penata Sri W.", satker: "ASN Kemenhan", bruto: 7400000, p17: 95000, ter: 96200 },
    { nrp: "198604321", nama: "Purn. Bripka Anwar I.", satker: "POLRI", bruto: 9200000, p17: 215000, ter: 220800 },
    { nrp: "197506789", nama: "Purn. Pembina Agus S.", satker: "ASN Kemenhan", bruto: 5800000, p17: 48000, ter: 48000 },
  ];
  const filtered = filterSatker === "Semua" ? allData : allData.filter(d => d.satker === filterSatker);
  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Calculator size={IC} />} label="PPh 21 Terhitung" value="128.450 WP" sub="Periode Juli 2026 (TER)" color={COLORS.blue} />
        <StatCard icon={<Receipt size={IC} />} label="Bukti Potong A2" value="128.320" sub="130 tertunda" color={COLORS.green} />
        <StatCard icon={<AlertTriangle size={IC} />} label="NIK/NPWP Bermasalah" value="347 Peserta" color={COLORS.red} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Perbandingan TER vs Pasal 17</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan"]} minW={140} />
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allData.length}</div>
        {filtered.length === 0 ? <NoData /> : (
          <Table columns={["NRP", "Nama", "Satker", "Penghasilan Bruto", "PPh Pasal 17", "PPh 21 TER", "Selisih"]}
            data={filtered.map(d => [d.nrp, d.nama, <Badge color={d.satker === "TNI" ? "green" : d.satker === "POLRI" ? "blue" : "orange"}>{d.satker}</Badge>, fmt(d.bruto), fmt(d.p17), fmt(d.ter), <span style={{ color: d.ter - d.p17 === 0 ? COLORS.green : COLORS.red }}>{fmt(Math.abs(d.ter - d.p17))}</span>])} />
        )}
      </div>
    </div>
  );
};

const KreditPiutang = () => {
  const [filterBank, setFilterBank] = useState("Semua");
  const [filterStatusDenda, setFilterStatusDenda] = useState("Semua");
  const allDenda = [
    { bank: "BRI", tagihan: "Rp 3.200.000.000", tglDoc: "01 Jun 2026", jt: "15 Jun 2026", tglTerima: "14 Jun 2026", terlambat: 0, denda: "Rp 0", status: "Tepat Waktu" },
    { bank: "Mandiri", tagihan: "Rp 4.500.000.000", tglDoc: "01 Jun 2026", jt: "15 Jun 2026", tglTerima: "22 Jun 2026", terlambat: 7, denda: "Rp 5.876.712", status: "Terlambat" },
    { bank: "BNI", tagihan: "Rp 2.800.000.000", tglDoc: "01 Jun 2026", jt: "15 Jun 2026", tglTerima: "—", terlambat: 21, denda: "Rp 11.104.110", status: "Belum Bayar" },
  ];
  const filtered = allDenda.filter(d => {
    if (filterBank !== "Semua" && d.bank !== filterBank) return false;
    if (filterStatusDenda !== "Semua" && d.status !== filterStatusDenda) return false;
    return true;
  });
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<CreditCard size={IC} />} label="Imbal Jasa Flagging" value="Rp 12,8 M" sub="Bulan ini, 6 Bank" color={COLORS.blue} />
        <StatCard icon={<Landmark size={IC} />} label="Piutang PUM KPR" value="Rp 245 M" sub="1.230 peserta aktif" color={COLORS.orange} />
        <StatCard icon={<AlertTriangle size={IC} />} label="UDW Punah Terdeteksi" value="18 Kasus" sub="Rp 890 jt belum kembali" color={COLORS.red} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Monitoring Imbal Jasa & Denda Keterlambatan</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Bank Mitra" value={filterBank} onChange={setFilterBank} options={["Semua", "BRI", "Mandiri", "BNI"]} minW={130} />
          <Select label="Status" value={filterStatusDenda} onChange={setFilterStatusDenda} options={["Semua", "Tepat Waktu", "Terlambat", "Belum Bayar"]} minW={140} />
        </div>
        {filtered.length === 0 ? <NoData /> : (
          <Table columns={["Bank Mitra", "Tagihan Netto", "Tgl Dokumen", "Jatuh Tempo", "Tgl Terima Dana", "Hari Terlambat", "Denda", "Status"]}
            data={filtered.map(d => [d.bank, d.tagihan, d.tglDoc, d.jt, d.tglTerima, d.terlambat > 0 ? <span style={{ color: COLORS.red, fontWeight: 700 }}>{d.terlambat}</span> : "0", d.terlambat > 0 ? <span style={{ color: COLORS.red }}>{d.denda}</span> : d.denda, <Badge color={d.status === "Tepat Waktu" ? "green" : "red"}>{d.status}</Badge>])} />
        )}
        <div style={{ marginTop: 12, fontSize: 12, color: COLORS.gray500 }}>Formula denda: (Tagihan Netto × BI Rate × Hari Terlambat) / 365 — BI Rate: 5,75%</div>
      </div>
    </div>
  );
};

const DashboardDIPA = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <StatCard icon={<BarChart3 size={IC} />} label="Pagu DIPA Total" value="Rp 5.410 M" sub="TA 2026" color={COLORS.blue} />
      <StatCard icon={<Wallet size={IC} />} label="Realisasi SP2D" value="Rp 3.883 M" sub="71,8% terserap" color={COLORS.green} />
      <StatCard icon={<TrendingDown size={IC} />} label="Sisa Pagu" value="Rp 1.527 M" sub="28,2% tersisa" color={COLORS.orange} />
    </div>
    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle>Breakdown per Jenis Dapem</SectionTitle>
      {[{ label: "Dapem Induk", pagu: 4200, realisasi: 3150, color: COLORS.blue }, { label: "Dapem Susulan", pagu: 890, realisasi: 445, color: COLORS.green }, { label: "Non-Dapem (Harian)", pagu: 320, realisasi: 288, color: COLORS.orange }].map((d, i) => (
        <div key={i} style={{ padding: 16, background: COLORS.gray50, borderRadius: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 700 }}>{d.label}</span>
            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
              <span>Pagu: <strong>Rp {d.pagu} M</strong></span><span>Realisasi: <strong>Rp {d.realisasi} M</strong></span>
              <span style={{ color: d.realisasi / d.pagu > 0.85 ? COLORS.red : COLORS.green }}>Sisa: <strong>Rp {d.pagu - d.realisasi} M</strong></span>
            </div>
          </div>
          <ProgressBar value={d.realisasi} max={d.pagu} color={d.color} />
          {d.realisasi / d.pagu > 0.85 && <div style={{ marginTop: 8, fontSize: 12, color: COLORS.red }}>⚠ Sisa pagu di bawah threshold 15%</div>}
        </div>
      ))}
    </div>
  </div>
);

const RekonBPJS = () => {
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [filterDapem, setFilterDapem] = useState("Semua");
  const allSetoran = [
    { bulan: "April 2026", dapem: "Dapem Induk", peserta: "98.200", setoran: "Rp 41.230.000.000", ntpn: "1234567890ABCDEF", tgl: "10 Apr 2026", status: "Tervalidasi" },
    { bulan: "April 2026", dapem: "Dapem Susulan", peserta: "15.300", setoran: "Rp 3.420.000.000", ntpn: "ABCDEF1234567890", tgl: "12 Apr 2026", status: "Tervalidasi" },
    { bulan: "Mei 2026", dapem: "Dapem Induk", peserta: "98.450", setoran: "Rp 41.580.000.000", ntpn: "5678901234ABCDEF", tgl: "09 Mei 2026", status: "Tervalidasi" },
    { bulan: "Juni 2026", dapem: "Non-Dapem", peserta: "14.500", setoran: "Rp 2.870.000.000", ntpn: "CDEF567890123456", tgl: "11 Jun 2026", status: "Pending" },
  ];
  const filtered = allSetoran.filter(s => {
    if (filterBulan !== "Semua" && s.bulan !== filterBulan) return false;
    if (filterDapem !== "Semua" && s.dapem !== filterDapem) return false;
    return true;
  });
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Cross size={IC} />} label="Potongan BPJS Bulan Ini" value="Rp 48,2 M" sub="128.450 peserta" color={COLORS.blue} />
        <StatCard icon={<BarChart3 size={IC} />} label="Setoran Triwulan II" value="Rp 144,6 M" sub="Apr–Jun 2026" color={COLORS.green} />
        <StatCard icon={<AlertTriangle size={IC} />} label="Selisih Teridentifikasi" value="Rp 2,3 M" color={COLORS.orange} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Rekap Setoran Iuran Jamkes — Triwulan II 2026</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Bulan" value={filterBulan} onChange={setFilterBulan} options={["Semua", "April 2026", "Mei 2026", "Juni 2026"]} minW={130} />
          <Select label="Jenis Dapem" value={filterDapem} onChange={setFilterDapem} options={["Semua", "Dapem Induk", "Dapem Susulan", "Non-Dapem"]} minW={140} />
        </div>
        {filtered.length === 0 ? <NoData /> : (
          <Table columns={["Bulan", "Jenis Dapem", "Jumlah Peserta", "Jumlah Setoran", "NTPN", "Tanggal Setor", "Status"]}
            data={filtered.map(s => [s.bulan, s.dapem, s.peserta, s.setoran, <span style={{ fontFamily: "monospace", fontSize: 11 }}>{s.ntpn}</span>, s.tgl, <Badge color={s.status === "Tervalidasi" ? "green" : "yellow"}>{s.status}</Badge>])} />
        )}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Kalkulator Kompensasi Lebih/Kurang BPJS</SectionTitle>
        <Table columns={["Kelompok Pensiun", "Potongan Seharusnya", "Setoran Aktual", "Selisih", "Keterangan"]} data={[
          ["PNS Kemhan", "Rp 18.500.000.000", "Rp 18.720.000.000", <span style={{ color: COLORS.red }}>+Rp 220.000.000</span>, <Badge color="orange">Restitusi</Badge>],
          ["TNI", "Rp 22.300.000.000", "Rp 22.300.000.000", <span style={{ color: COLORS.green }}>Rp 0</span>, <Badge color="green">Match</Badge>],
          ["Polri", "Rp 7.800.000.000", "Rp 7.560.000.000", <span style={{ color: COLORS.orange }}>-Rp 240.000.000</span>, <Badge color="red">Kurang Setor</Badge>],
        ]} />
      </div>
    </div>
  );
};

const ReportGenerator = () => {
  const [filterPeriode, setFilterPeriode] = useState("Juli 2026");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const allReports = [
    { cat: "Penagihan Iuran", reports: ["Tabel 1 BRS II — Rekonsiliasi THT/Dapen", "Tabel 2 BRS II — Template Tagihan", "Rekap Tagihan per Satker"] },
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
          <Select label="Periode" value={filterPeriode} onChange={setFilterPeriode} options={["Juli 2026", "Juni 2026", "Mei 2026", "Triwulan II 2026", "Semester I 2026"]} minW={140} />
          <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan"]} minW={140} />
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

// ===== TAGIHAN IMBAL JASA MITRA BAYAR =====
const TagihanImbalJasa = () => {
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [searchTagihan, setSearchTagihan] = useState("");
  const [detailTagihan, setDetailTagihan] = useState(null);

  const allTagihan = [
    { no: "IJ-2606-001", mitra: "BRI", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "15 Jun 2026", ppn: 128000000, netto: 1152000000, totalTagihan: 1280000000, hariTerlambat: 0, denda: 0, status: "Dibayar" },
    { no: "IJ-2606-002", mitra: "BRI", jenis: "Autentikasi Digital", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "14 Jun 2026", ppn: 14000000, netto: 126000000, totalTagihan: 140000000, hariTerlambat: 0, denda: 0, status: "Dibayar" },
    { no: "IJ-2606-003", mitra: "BNI", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "23 Jun 2026", ppn: 98000000, netto: 882000000, totalTagihan: 980000000, hariTerlambat: 6, denda: 5880000, status: "Terlambat" },
    { no: "IJ-2606-004", mitra: "Mandiri", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "16 Jun 2026", ppn: 156000000, netto: 1404000000, totalTagihan: 1560000000, hariTerlambat: 0, denda: 0, status: "Dibayar" },
    { no: "IJ-2606-005", mitra: "BTN", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: null, ppn: 22000000, netto: 198000000, totalTagihan: 220000000, hariTerlambat: 19, denda: 6820000, status: "Belum Dibayar" },
    { no: "IJ-2606-006", mitra: "Mandiri", jenis: "Autentikasi Digital", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "20 Jun 2026", ppn: 8000000, netto: 72000000, totalTagihan: 80000000, hariTerlambat: 3, denda: 1720000, status: "Terlambat" },
  ];

  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  const filtered = allTagihan.filter(t => {
    if (filterMitra !== "Semua" && t.mitra !== filterMitra) return false;
    if (searchTagihan && !t.no.toLowerCase().includes(searchTagihan.toLowerCase()) && !t.mitra.toLowerCase().includes(searchTagihan.toLowerCase())) return false;
    return true;
  });

  const totalTagihanAll = allTagihan.reduce((a, t) => a + t.totalTagihan, 0);
  const totalDenda = allTagihan.reduce((a, t) => a + t.denda, 0);
  const terlambatCount = allTagihan.filter(t => t.hariTerlambat > 0).length;
  const avgTerlambat = terlambatCount > 0 ? Math.round(allTagihan.filter(t => t.hariTerlambat > 0).reduce((a, t) => a + t.hariTerlambat, 0) / terlambatCount) : 0;

  return (
    <div>
      {/* Detail Modal */}
      {detailTagihan && (() => {
        const t = detailTagihan;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailTagihan(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "24px 28px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray900 }}>Detail tagihan {t.no}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 2 }}>{t.mitra} - {t.jenis} - {t.periode}</div>
                  </div>
                  <button onClick={() => setDetailTagihan(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Badge color={t.status === "Dibayar" ? "green" : t.status === "Terlambat" ? "orange" : "red"}>
                    {t.hariTerlambat === 0 && t.status === "Dibayar" ? "Dibayar tepat waktu" : t.status}
                  </Badge>
                </div>
              </div>
              <div style={{ padding: "0 28px 24px" }}>
                <div style={{ borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Informasi Tagihan</div>
                  {[
                    ["Mitra bayar", t.mitra],
                    ["Jenis imbal jasa", t.jenis],
                    ["Periode", t.periode],
                    ["Tanggal terbit", t.tglTerbit],
                    ["Jatuh tempo", t.jatuhTempo],
                    ["Tanggal dibayar", t.tglBayar || "—"],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.gray100}`, fontSize: 13 }}>
                      <span style={{ color: COLORS.gray500 }}>{label}</span>
                      <span style={{ fontWeight: 600, color: COLORS.gray900 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Rincian Nilai Tagihan</div>
                  {[
                    ["Nilai netto", fmt(t.netto)],
                    ["PPN", fmt(t.ppn)],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.gray100}`, fontSize: 13 }}>
                      <span style={{ color: COLORS.gray500 }}>{label}</span><span style={{ fontWeight: 500, color: COLORS.gray800 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: COLORS.gray900 }}>Total tagihan</span>
                    <span style={{ fontWeight: 700, color: COLORS.gray900 }}>{fmt(t.totalTagihan)}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Denda Keterlambatan</div>
                  {t.denda === 0 ? (
                    <div style={{ background: COLORS.greenLight, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: COLORS.green, display: "flex", gap: 8, alignItems: "center" }}>
                      <CheckCircle2 size={16} />
                      <span>Tidak ada denda — pembayaran sesuai atau belum melewati jatuh tempo</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.gray100}`, fontSize: 13 }}>
                        <span style={{ color: COLORS.gray500 }}>Hari terlambat</span><span style={{ fontWeight: 600, color: COLORS.red }}>{t.hariTerlambat} hari</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                        <span style={{ color: COLORS.gray500 }}>Denda (Netto × 5,75% × hari / 365)</span><span style={{ fontWeight: 700, color: COLORS.red }}>{fmt(t.denda)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${COLORS.gray200}` }}>
                  <span style={{ fontSize: 14, color: COLORS.gray700 }}>Total tagihan + denda</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.gray900, fontFamily: "monospace" }}>{fmt(t.totalTagihan + t.denda)}</span>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                  <Btn variant="outline" size="sm">Unduh Tagihan</Btn>
                  <Btn variant="danger" size="sm" onClick={() => setDetailTagihan(null)}>Tutup</Btn>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 4 }}>Daftar lengkap tagihan imbal jasa per mitra bayar, termasuk keterlambatan dan denda yang dikenakan</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="outline">Ekspor Excel</Btn>
          <Btn>Terbitkan & Kirim ke Mitra</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Banknote size={IC} />} label="Total tagihan periode ini" value={`Rp ${(totalTagihanAll / 1e9).toFixed(1)} M`} sub={`${allTagihan.length} mitra bayar · Juni 2026`} color={COLORS.blue} />
        <StatCard icon={<Clock size={IC} />} label="Tagihan terlambat dibayar" value={`${terlambatCount} tagihan`} sub={`Dari ${allTagihan.length} tagihan diterbitkan`} color={COLORS.orange} />
        <StatCard icon={<AlertTriangle size={IC} />} label="Total denda keterlambatan" value={fmt(totalDenda)} sub="Akumulasi periode ini" color={COLORS.red} />
        <StatCard icon={<BarChart3 size={IC} />} label="Rata-rata hari terlambat" value={`${avgTerlambat} hari`} sub="Dari tagihan yang terlambat" color={COLORS.orange} />
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle action={<span style={{ fontSize: 12, color: COLORS.gray500 }}>Termasuk hari terlambat & denda otomatis</span>}>Daftar Tagihan Imbal Jasa</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Mitra Bayar" value={filterMitra} onChange={setFilterMitra} options={["Semua", "BRI", "BNI", "Mandiri", "BTN"]} minW={140} />
          <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchTagihan} onChange={setSearchTagihan} placeholder="Cari no. tagihan atau mitra bayar..." minW={240} /></div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allTagihan.length} tagihan</div>
        {filtered.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["No. Tagihan", "Mitra Bayar", "Jenis Imbal Jasa", "Periode", "Tgl. Terbit", "Jatuh Tempo", "Tgl. Dibayar", "PPN", "Nilai Netto", "Total Tagihan", "Hari Terlambat", "Denda", "Total + Denda", "Status", ""].map((c, i) => (
                  <th key={i} style={{ padding: "8px 10px", textAlign: i >= 7 && i <= 12 ? "right" : "left", fontWeight: 600, color: COLORS.gray500, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap", fontSize: 11 }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{filtered.map((t, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <td style={{ padding: "8px 10px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 500 }}>{t.no}</td>
                  <td style={{ padding: "8px 10px", fontWeight: 600 }}>{t.mitra}</td>
                  <td style={{ padding: "8px 10px" }}>{t.jenis}</td>
                  <td style={{ padding: "8px 10px" }}>{t.periode}</td>
                  <td style={{ padding: "8px 10px" }}>{t.tglTerbit}</td>
                  <td style={{ padding: "8px 10px" }}>{t.jatuhTempo}</td>
                  <td style={{ padding: "8px 10px" }}>{t.tglBayar || "—"}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(t.ppn)}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(t.netto)}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(t.totalTagihan)}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: t.hariTerlambat > 0 ? COLORS.red : COLORS.gray400 }}>{t.hariTerlambat > 0 ? t.hariTerlambat : "—"}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: t.denda > 0 ? COLORS.red : COLORS.gray400 }}>{t.denda > 0 ? fmt(t.denda) : "—"}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>{fmt(t.totalTagihan + t.denda)}</td>
                  <td style={{ padding: "8px 10px" }}><Badge color={t.status === "Dibayar" ? "green" : t.status === "Terlambat" ? "orange" : "red"}>{t.status}</Badge></td>
                  <td style={{ padding: "8px 10px" }}><Btn size="sm" variant="ghost" onClick={() => setDetailTagihan(t)}>Detail</Btn></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ MAIN APP ============
const MENU = [
  { group: "OPERASIONAL UTAMA", items: [{ id: "dashboard", icon: "chart", label: "Dashboard Keuangan" }] },
  { group: "MODUL 1 — PENAGIHAN IURAN", items: [{ id: "kalkulator", icon: "calc", label: "Kalkulator Iuran" }, { id: "rekonsiliasi", icon: "sync", label: "Rekonsiliasi SKP-PFK" }, { id: "tagihan", icon: "file", label: "Penagihan ke Kemenkeu" }] },
  { group: "MODUL 2 — KLAIM & MANFAAT", items: [{ id: "dana", icon: "bank", label: "Dana & Rekening Koran" }, { id: "klaim", icon: "clip", label: "Monitoring Klaim JKK" }] },
  { group: "MODUL 3 — KREDIT & PIUTANG", items: [{ id: "kredit", icon: "card", label: "Kredit & Piutang" }, { id: "imbaljasa", icon: "receipt", label: "Tagihan Imbal Jasa" }] },
  { group: "MODUL 4 — PERPAJAKAN", items: [{ id: "pajak", icon: "receipt", label: "PPh 21 & Bukti Potong" }] },
  { group: "MODUL 5 — DIPA & PENSIUN", items: [{ id: "dipa", icon: "trend", label: "Dashboard DIPA" }] },
  { group: "MODUL 6 — REKON BPJS", items: [{ id: "bpjs", icon: "cross", label: "Rekonsiliasi BPJS" }] },
  { group: "MODUL 7 — PELAPORAN", items: [{ id: "laporan", icon: "pen", label: "Generator Laporan" }] },
];

const PAGES = {
  dashboard: { title: "Dashboard Keuangan", component: DashboardKeuangan },
  kalkulator: { title: "US-1.1 — Kalkulator Iuran Per Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "US-1.2 — Rekonsiliasi THT/Dapen vs SKP-PFK", component: RekonsIuran },
  tagihan: { title: "US-1.3 — Penagihan Iuran ke Kemenkeu", component: GeneratorTagihan },
  dana: { title: "US-2.2 & 2.7 — Dashboard Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  klaim: { title: "US-2.3 — Monitoring Klaim JKK Perawatan", component: MonitoringKlaim },
  kredit: { title: "US-3.x — Kredit, Piutang & UDW Punah", component: KreditPiutang },
  imbaljasa: { title: "Tagihan Imbal Jasa Mitra Bayar", component: TagihanImbalJasa },
  pajak: { title: "US-4.x — Perpajakan PPh 21", component: Perpajakan },
  dipa: { title: "US-5.x — Dashboard DIPA & Pembayaran Pensiun", component: DashboardDIPA },
  bpjs: { title: "US-6.x — Rekonsiliasi BPJS Kesehatan", component: RekonBPJS },
  laporan: { title: "US-7.x — Pelaporan & Integrasi Sistem", component: ReportGenerator },
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const page = PAGES[activePage];
  const PageComp = page.component;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: COLORS.gray100, color: COLORS.gray900 }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.blueDark} 100%)`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: COLORS.white, fontSize: 20, cursor: "pointer", padding: 4 }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: COLORS.navy }}>A</div>
            <div><div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>YANDU <span style={{ color: COLORS.accent }}>NEXTGEN</span> ASABRI</div><div style={{ color: COLORS.gray400, fontSize: 10, letterSpacing: 1 }}>DIVISI KEUANGAN</div></div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 12, color: COLORS.gray400 }}>Cari Peserta / NRP / NIP...</span></div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: COLORS.gray300 }}>ROLE: <strong style={{ color: COLORS.white }}>Super Administrator</strong></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Bell size={18} color={COLORS.gray300} /><div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 12, fontWeight: 700 }}>WA</div></div>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {sidebarOpen && (
          <div style={{ width: 250, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, overflowY: "auto", flexShrink: 0, padding: "8px 0" }}>
            {MENU.map((g, gi) => (
              <div key={gi} style={{ marginBottom: 4 }}>
                <div style={{ padding: "10px 16px 4px", fontSize: 10, fontWeight: 700, color: COLORS.gray500, letterSpacing: 0.8, textTransform: "uppercase" }}>{g.group}</div>
                {g.items.map(item => (
                  <button key={item.id} onClick={() => setActivePage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 16px", border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", background: activePage === item.id ? "#E3F2FD" : "transparent", color: activePage === item.id ? COLORS.blue : COLORS.gray700, fontWeight: activePage === item.id ? 600 : 400, borderRight: activePage === item.id ? `3px solid ${COLORS.blue}` : "3px solid transparent" }}>
                    <span style={{ display: "flex" }}>{{"chart": <BarChart3 size={16} />, "calc": <Calculator size={16} />, "sync": <RefreshCw size={16} />, "file": <FileText size={16} />, "bank": <Building2 size={16} />, "clip": <ClipboardList size={16} />, "card": <CreditCard size={16} />, "receipt": <Receipt size={16} />, "trend": <TrendingDown size={16} />, "cross": <Cross size={16} />, "pen": <PenLine size={16} />}[item.icon] || item.icon}</span><span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 2 }}>Beranda › Keuangan › {page.title.split("—")[0].trim()}</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>{page.title}</h2>
            </div>
            <div style={{ background: COLORS.blueDark, color: COLORS.white, padding: "6px 14px", borderRadius: 6, fontSize: 12 }}>📅 Minggu, 06 Juli 2026</div>
          </div>
          <PageComp />
        </div>
      </div>
    </div>
  );
}
