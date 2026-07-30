import { useState } from "react";
import { LayoutDashboard, Activity, Calculator, RefreshCw, FileText, Building2, ClipboardList, CreditCard, Receipt, TrendingDown, Cross, PenLine, Search, Download, Upload, Calendar, CheckCircle2, AlertTriangle, Banknote, Eye, PenTool, Mail, Bell, Menu, ChevronRight, ChevronDown, CircleDot, Shield, Lock, BarChart3, Users, Clock, XCircle, FileUp, Filter, Printer, ExternalLink, ArrowRight, FolderOpen, CircleCheck, CircleAlert, CircleDashed, FileCheck, FileClock, FileX, Landmark, TrendingUp, Wallet, DollarSign, Percent, Hash, UserCheck, FilePlus, ArrowUpDown, MoreHorizontal } from "lucide-react";

const LINE_COLORS = ["#1565C0", "#2E7D32", "#EF6C00", "#7B1FA2", "#C62828", "#00838F"];

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

// ===== PREVIEW MODAL (reusable) =====
const PreviewModal = ({ preview, onClose }) => {
  if (!preview) return null;
  const { title, subtitle, type, content, fileName } = preview;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 680, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
        </div>
        {/* Preview Area */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ border: `1px solid ${COLORS.gray200}`, borderRadius: 8, background: COLORS.gray50, minHeight: 320 }}>
            {type === "surat" && (
              <div style={{ padding: "32px 40px", background: COLORS.white, margin: 16, borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontFamily: "'Times New Roman', serif" }}>
                <div style={{ textAlign: "center", marginBottom: 24, borderBottom: `2px solid ${COLORS.gray900}`, paddingBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>PT ASABRI (PERSERO)</div>
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>Jl. Mayjen Sutoyo No.11, Jakarta Timur 13630</div>
                </div>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, textDecoration: "underline" }}>SURAT TAGIHAN</div>
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>{content?.noSurat || "No. 001/ASABRI/TGH/VII/2026"}</div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: COLORS.gray800 }}>
                  <p>Kepada Yth,<br/><strong>{content?.tujuan || "Direktur Jenderal Perbendaharaan — Kementerian Keuangan RI"}</strong></p>
                  <p style={{ marginTop: 12 }}>Berdasarkan data kepesertaan per tanggal cut-off <strong>{content?.cutoff || "25 Juni 2026"}</strong>, bersama ini kami sampaikan tagihan iuran untuk periode <strong>{content?.periode || "Juli 2026"}</strong> dengan rincian sebagai berikut:</p>
                  <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 12 }}>
                    <thead><tr style={{ background: COLORS.gray100 }}><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "left" }}>Jenis Iuran</th><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Peserta</th><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Nominal</th></tr></thead>
                    <tbody>
                      {(content?.items || [
                        { jenis: "THT (3,25%)", peserta: "14.328", nominal: "Rp 35.760.000.000" },
                        { jenis: "Dapen (4,75%)", peserta: "14.328", nominal: "Rp 52.250.000.000" },
                        { jenis: "JKK (0,24%)", peserta: "14.328", nominal: "Rp 2.630.000.000" },
                        { jenis: "JKm (0,20%)", peserta: "14.328", nominal: "Rp 2.210.000.000" },
                      ]).map((r, i) => (
                        <tr key={i}><td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6 }}>{r.jenis}</td><td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>{r.peserta}</td><td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right", fontWeight: 600 }}>{r.nominal}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <p>Demikian surat tagihan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>
                  <div style={{ marginTop: 32, textAlign: "right" }}>
                    <div>Jakarta, {content?.tanggal || "01 Juli 2026"}</div>
                    <div style={{ marginTop: 8, fontWeight: 700 }}>Kepala Divisi Keuangan</div>
                    <div style={{ marginTop: 48, borderBottom: `1px solid ${COLORS.gray800}`, width: 200, marginLeft: "auto" }} />
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>NIP. ___________________</div>
                  </div>
                </div>
              </div>
            )}
            {type === "table" && (
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 12 }}>Preview data yang akan diekspor:</div>
                <div style={{ background: COLORS.white, borderRadius: 6, padding: 16, border: `1px solid ${COLORS.gray200}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr style={{ background: COLORS.gray100 }}>{(content?.columns || []).map((c, i) => <th key={i} style={{ padding: "6px 10px", textAlign: "left", borderBottom: `1px solid ${COLORS.gray300}`, fontWeight: 600, color: COLORS.gray700 }}>{c}</th>)}</tr></thead>
                    <tbody>{(content?.rows || []).map((row, i) => <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>{row.map((cell, j) => <td key={j} style={{ padding: "6px 10px", color: COLORS.gray800 }}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                  {(content?.totalRows || 0) > 5 && <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 8, textAlign: "center" }}>... dan {content.totalRows - 5} baris lainnya</div>}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: COLORS.gray500 }}>
            <FileText size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
            {fileName || "document.pdf"} • {type === "surat" ? "PDF" : "Excel / PDF"}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={onClose}>Batal</Btn>
            <Btn onClick={onClose}>
              <Download size={14} /> Unduh File
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ PAGES ============

const DashboardKeuangan = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <StatCard icon={<DollarSign size={IC} />} label="Total Tagihan Bulan Ini" value="Rp 847,2 M" sub="THT + Dapen + JKK + JKm" color={COLORS.blue} link="Lihat Rincian" />
      <StatCard icon={<BarChart3 size={IC} />} label="Realisasi Penerimaan" value="Rp 812,5 M" sub="95.9% dari tagihan" color={COLORS.green} link="Rekonsiliasi" />
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
      <SectionTitle>Penagihan Iuran ke Kemenkeu — Juli 2026</SectionTitle>
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: COLORS.gray100 }}>
            {["No. Surat", "Jenis Iuran", "Acuan", "Nominal", "Cut-off", "Status Dokumen", ""].map((c, i) => (
              <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr></thead>
          <tbody>
            {[
              { no: "001/ASABRI/TGH-THT/VII/2026", jenis: "THT", acuan: "SKP-PFK", nominal: "Rp 35.760.000.000", cutoff: "25 Jun 2026", status: "Dokumen di-TTD", color: "green" },
              { no: "002/ASABRI/TGH-DAP/VII/2026", jenis: "Dapen", acuan: "SKP-PFK", nominal: "Rp 52.250.000.000", cutoff: "25 Jun 2026", status: "Dokumen di-TTD", color: "green" },
              { no: "003/ASABRI/TGH-JKK/VII/2026", jenis: "JKK", acuan: "Data Klaim", nominal: "Rp 2.630.000.000", cutoff: "25 Jun 2026", status: "Siap Download", color: "blue" },
              { no: "004/ASABRI/TGH-JKM/VII/2026", jenis: "JKm", acuan: "Data Klaim", nominal: "Rp 2.210.000.000", cutoff: "25 Jun 2026", status: "Draft Tersedia", color: "yellow" },
            ].map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: COLORS.blue, fontWeight: 500 }}>{t.no}</td>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>{t.jenis}</td>
                <td style={{ padding: "10px 14px" }}><Badge color={t.acuan === "SKP-PFK" ? "blue" : "orange"}>{t.acuan}</Badge></td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 600 }}>{t.nominal}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: COLORS.gray500 }}>{t.cutoff}</td>
                <td style={{ padding: "10px 14px" }}><Badge color={t.color}>{t.status}</Badge></td>
                <td style={{ padding: "10px 14px" }}><Btn size="sm" variant="ghost">Download</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: COLORS.gray500, display: "flex", justifyContent: "space-between" }}>
        <span>THT & Dapen acuan: SKP-PFK Kemenkeu • JKK & JKm acuan: Data Klaim & Kalkulasi Sistem</span>
        <span style={{ color: COLORS.gray400 }}>Proses pengiriman ke Kemenkeu dilakukan secara manual</span>
      </div>
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
    { kode: "PPPK", nama: "PPPK", peserta: 2150, gp: 150.5, tht: 4.89, dapen: 7.15, jkk: 0.36, jkm: 0.30,
      gol: [
        { gol: "Golongan IX", peserta: 420, gp: 21.0, tht: 0.68, dapen: 1.00, jkk: 0.05, jkm: 0.04 },
        { gol: "Golongan X", peserta: 680, gp: 47.6, tht: 1.55, dapen: 2.26, jkk: 0.11, jkm: 0.10 },
        { gol: "Golongan XI", peserta: 620, gp: 49.6, tht: 1.61, dapen: 2.36, jkk: 0.12, jkm: 0.10 },
        { gol: "Golongan XII", peserta: 430, gp: 32.3, tht: 1.05, dapen: 1.53, jkk: 0.08, jkm: 0.06 },
      ]},
  ];

  const allPesertaList = [
    { nrp: "198701234", nama: "Serka Ahmad Fauzi", satker: "TNI", unor: "Kodam Jaya", gol: "Gol. II", gp: 3200000, ti: 320000, ta: 192000 },
    { nrp: "199205678", nama: "Briptu Rina Marlina", satker: "POLRI", unor: "Polda Metro Jaya", gol: "Gol. II", gp: 3050000, ti: 305000, ta: 183000 },
    { nrp: "197803456", nama: "Letkol Bambang Suharto", satker: "TNI", unor: "Mabes TNI", gol: "Gol. IV", gp: 5800000, ti: 580000, ta: 348000 },
    { nrp: "198512345", nama: "AKP Dedi Kurniawan", satker: "POLRI", unor: "Polda Jabar", gol: "Gol. III", gp: 4500000, ti: 450000, ta: 270000 },
    { nrp: "199008765", nama: "Peltu Hendra Wijaya", satker: "TNI", unor: "Kodam Iskandar Muda", gol: "Gol. II", gp: 3400000, ti: 340000, ta: 204000 },
    { nrp: "198604321", nama: "Penata Tk.I Siti Nurhaliza", satker: "ASN Kemenhan", unor: "Ditjen Strahan", gol: "Gol. III", gp: 4200000, ti: 420000, ta: 252000 },
    { nrp: "199312345", nama: "Praka Rizki Pratama", satker: "TNI", unor: "Lantamal III", gol: "Gol. I", gp: 2800000, ti: 280000, ta: 168000 },
    { nrp: "198907654", nama: "Bripda Mega Putri", satker: "POLRI", unor: "Polda Jatim", gol: "Gol. I", gp: 2900000, ti: 290000, ta: 174000 },
    { nrp: "197506789", nama: "Pengatur Muda Agus Salim", satker: "ASN Kemenhan", unor: "Setjen Kemhan", gol: "Gol. II", gp: 3100000, ti: 310000, ta: 186000 },
    { nrp: "198211111", nama: "Pembina Utama Dr. Ratna", satker: "ASN Kemenhan", unor: "Bainstrahan", gol: "Gol. IV", gp: 5500000, ti: 550000, ta: 330000 },
    { nrp: "199401234", nama: "Kopda Joko Widodo", satker: "TNI", unor: "Kodam Diponegoro", gol: "Gol. I", gp: 2750000, ti: 275000, ta: 165000 },
    { nrp: "198802345", nama: "Bripka Anwar Ibrahim", satker: "POLRI", unor: "Mabes Polri", gol: "Gol. III", gp: 4100000, ti: 410000, ta: 246000 },
    { nrp: "199103456", nama: "Pengatur Sri Wahyuni", satker: "ASN Kemenhan", unor: "Ditjen Pothan", gol: "Gol. I", gp: 2600000, ti: 260000, ta: 156000 },
    { nrp: "197604567", nama: "Mayor Inf. Surya Darma", satker: "TNI", unor: "Lanud Halim", gol: "Gol. III", gp: 4800000, ti: 480000, ta: 288000 },
    { nrp: "198705678", nama: "IPTU Dewi Sartika", satker: "POLRI", unor: "Polda Bali", gol: "Gol. IV", gp: 5200000, ti: 520000, ta: 312000 },
    { nrp: "199501234", nama: "Danu Prasetyo", satker: "PPPK", unor: "Ditjen Strahan", gol: "Gol. X", gp: 3300000, ti: 330000, ta: 198000 },
    { nrp: "199602345", nama: "Lestari Handayani", satker: "PPPK", unor: "Setjen Kemhan", gol: "Gol. XI", gp: 3800000, ti: 380000, ta: 228000 },
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
  const [preview, setPreview] = useState(null);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
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
                  <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 2 }}>NRP/NIP: <span style={{ fontFamily: "monospace" }}>{p.nrp}</span> • <Badge color={p.satker === "TNI" ? "green" : p.satker === "POLRI" ? "blue" : p.satker === "PPPK" ? "yellow" : "orange"}>{p.satker}</Badge> • {p.unor && <span style={{ color: COLORS.gray600 }}>{p.unor} • </span>}{p.gol}</div>
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
        <Select label="Satker" value={filterSatker} onChange={v => { setFilterSatker(v); setSelectedSatker(null); }} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={140} />
        <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["Semua", "THT", "Dapen", "JKK", "JKm"]} minW={120} />
        <Select label="Tanggal Cut-off" value="30 Jun 2026" onChange={() => {}} options={["30 Jun 2026", "31 Mei 2026", "30 Apr 2026"]} minW={130} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Btn variant="outline" onClick={() => setPreview({ title: "Preview Ekspor Data Iuran", subtitle: `Periode ${filterPeriode} • ${filterSatker === "Semua" ? "Seluruh Satker" : filterSatker}`, type: "table", fileName: `Rekap_Iuran_${filterPeriode.replace(" ", "_")}.xlsx`, content: { columns: ["Satker", "Peserta", "THT", "Dapen", "JKK", "JKm", "Total"], rows: satkerData.map(s => [s.nama, s.peserta.toLocaleString(), `Rp ${s.tht} M`, `Rp ${s.dapen} M`, `Rp ${s.jkk} M`, `Rp ${s.jkm} M`, `Rp ${(s.tht+s.dapen+s.jkk+s.jkm).toFixed(2)} M`]), totalRows: satkerData.length } })}>Ekspor Data</Btn>
          <Btn onClick={() => setPreview({ title: "Preview Surat Tagihan Iuran", subtitle: `Periode ${filterPeriode} — Surat Tagihan ke Kemenkeu`, type: "surat", fileName: `Surat_Tagihan_Iuran_${filterPeriode.replace(" ", "_")}.pdf`, content: { noSurat: `001/ASABRI/TGH/${filterPeriode.replace(" ", "/")}`, periode: filterPeriode, cutoff: "25 Jun 2026", tanggal: "01 Jul 2026", items: [ { jenis: "THT (3,25%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalTHT.toFixed(2)} M` }, { jenis: "Dapen (4,75%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalDapen.toFixed(2)} M` }, { jenis: "JKK (0,24%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalJKK.toFixed(2)} M` }, { jenis: "JKm (0,20%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalJKM.toFixed(2)} M` } ] } })}>
            <FileText size={14} /> Buat Tagihan
          </Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["rekap", "peserta", "tidak_lengkap"].map(t => (
          <button key={t} disabled={t === "tidak_lengkap" || t === "peserta"} onClick={() => setTab(t)} style={{ padding: "8px 18px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: (t === "tidak_lengkap" || t === "peserta") ? "not-allowed" : "pointer", opacity: (t === "tidak_lengkap" || t === "peserta") ? 0.5 : 1, background: tab === t ? COLORS.blue : COLORS.gray200, color: tab === t ? COLORS.white : COLORS.gray700 }}>
            {t === "rekap" ? "Rekap per Satker & Golongan" : t === "peserta" ? "List per Nama Peserta" : "Data Tidak Lengkap (23)"}
          </button>
        ))}
      </div>

      {tab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Iuran", subtitle: "Format Excel (.xlsx)", type: "table", fileName: "Rekap_Iuran_Satker.xlsx", content: { columns: ["Satker", "Peserta", "THT", "Dapen", "JKK", "JKm"], rows: satkerData.map(s => [s.nama, s.peserta.toLocaleString(), "Rp "+s.tht+" M", "Rp "+s.dapen+" M", "Rp "+s.jkk+" M", "Rp "+s.jkm+" M"]), totalRows: satkerData.length } })}>Ekspor Excel</Btn><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Iuran", subtitle: "Format PDF", type: "table", fileName: "Rekap_Iuran_Satker.pdf", content: { columns: ["Satker", "Peserta", "THT", "Dapen", "JKK", "JKm"], rows: satkerData.map(s => [s.nama, s.peserta.toLocaleString(), "Rp "+s.tht+" M", "Rp "+s.dapen+" M", "Rp "+s.jkk+" M", "Rp "+s.jkm+" M"]), totalRows: satkerData.length } })}>Ekspor PDF</Btn></div>}>Rekap Iuran per Satker & Golongan {filterSatker !== "Semua" && `— ${filterSatker}`} {filterJenis !== "Semua" && `(${filterJenis})`}</SectionTitle>
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
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Daftar Peserta", subtitle: "Data iuran per nama peserta", type: "table", fileName: "Daftar_Iuran_Peserta.xlsx", content: { columns: ["NRP", "Nama", "Satker", "Gol."], rows: pesertaFiltered.slice(0,5).map(p => [p.nrp, p.nama, p.satker, p.gol]), totalRows: pesertaFiltered.length } })}>Ekspor Excel</Btn><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Daftar Peserta", subtitle: "Format PDF", type: "table", fileName: "Daftar_Iuran_Peserta.pdf", content: { columns: ["NRP", "Nama", "Satker", "Gol."], rows: pesertaFiltered.slice(0,5).map(p => [p.nrp, p.nama, p.satker, p.gol]), totalRows: pesertaFiltered.length } })}>Ekspor PDF</Btn></div>}>Daftar Iuran per Nama Peserta</SectionTitle>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
            <Select label="Satker" value={filterSatkerPeserta} onChange={setFilterSatkerPeserta} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={130} />
            <Select label="Golongan" value={filterGolPeserta} onChange={setFilterGolPeserta} options={["Semua", "Gol. I", "Gol. II", "Gol. III", "Gol. IV"]} minW={120} />
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari NRP/Nama</label><SearchInput value={searchPeserta} onChange={setSearchPeserta} placeholder="Ketik NRP atau nama..." /></div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Menampilkan {pesertaFiltered.length} dari {allPesertaList.length} peserta</div>
          {pesertaFiltered.length === 0 ? <NoData /> : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["No", "NRP/NIP", "Nama Peserta", "Satker", "Unor", "Golongan", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr></thead>
                <tbody>{pesertaFiltered.map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 14px", color: COLORS.gray500 }}>{i + 1}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12 }}>{p.nrp}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: COLORS.gray800 }}>{p.nama}</td>
                    <td style={{ padding: "10px 14px" }}><Badge color={p.satker === "TNI" ? "green" : p.satker === "POLRI" ? "blue" : p.satker === "PPPK" ? "yellow" : "orange"}>{p.satker}</Badge></td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: COLORS.gray600 }}>{p.unor || "—"}</td>
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
  const [preview, setPreview] = useState(null);
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterPeriode, setFilterPeriode] = useState("Juli 2026");

  const allRekonData = {
    THT: [
      { satker: "TNI", sistem: 6084500000, skp: 6084500000 },
      { satker: "POLRI", sistem: 4912300000, skp: 4969970000 },
      { satker: "ASN Kemenhan", sistem: 2914200000, skp: 2914200000 },
      { satker: "PPPK", sistem: 489000000, skp: 489000000 },
    ],
    Dapen: [
      { satker: "TNI", sistem: 8890000000, skp: 8890000000 },
      { satker: "POLRI", sistem: 7180000000, skp: 7250000000 },
      { satker: "ASN Kemenhan", sistem: 4260000000, skp: 4260000000 },
      { satker: "PPPK", sistem: 715000000, skp: 715000000 },
    ],
  };

  const rekonRows = (allRekonData[filterJenis] || []).filter(r => filterSatker === "Semua" || r.satker === filterSatker);
  const totalSistem = rekonRows.reduce((a, r) => a + r.sistem, 0);
  const totalSKP = rekonRows.reduce((a, r) => a + r.skp, 0);
  const fmtB = n => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <PreviewModal preview={preview} onClose={() => setPreview(null)} />
        <SectionTitle>Rekonsiliasi Iuran vs SKP-PFK Kemenkeu</SectionTitle>
        <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F57F17", display: "flex", gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={14} />
          <span>Rekonsiliasi hanya berlaku untuk iuran <strong>THT</strong> dan <strong>Dapen</strong> karena acuan tagihannya berdasarkan SKP-PFK dari Kemenkeu. Iuran JKK dan JKm menggunakan acuan terpisah (Data Klaim & Kalkulasi Sistem).</span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Periode" value={filterPeriode} onChange={setFilterPeriode} options={["Juli 2026", "Juni 2026", "Mei 2026", "April 2026"]} minW={130} />
          <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["THT", "Dapen"]} minW={120} />
          <Select label="Satker" value={filterSatker} onChange={setFilterSatker} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={140} />
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
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Tabel 1 BRS II", subtitle: "Rekonsiliasi " + filterJenis + " vs SKP-PFK", type: "table", fileName: "Tabel1_BRS_II_Rekon.xlsx", content: { columns: ["Satker", "Hitung Sistem", "SKP-PFK", "Selisih"], rows: rekonRows.map(r => [r.satker, fmtB(r.sistem), fmtB(r.skp), fmtB(Math.abs(r.skp - r.sistem))]), totalRows: rekonRows.length } })}>Unduh Tabel 1 BRS II (Excel)</Btn>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Tabel 1 BRS II", subtitle: "Format PDF", type: "table", fileName: "Tabel1_BRS_II_Rekon.pdf", content: { columns: ["Satker", "Hitung Sistem", "SKP-PFK", "Selisih"], rows: rekonRows.map(r => [r.satker, fmtB(r.sistem), fmtB(r.skp), fmtB(Math.abs(r.skp - r.sistem))]), totalRows: rekonRows.length } })}>Unduh PDF</Btn>
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
  const [preview, setPreview] = useState(null);

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
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
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
                  {t.currentStep >= 1 && <Btn size="sm" variant="outline" onClick={e => { e.stopPropagation(); setPreview({ title: "Preview Surat Tagihan " + t.jenis, subtitle: t.noSurat + " • Periode " + t.periode, type: "surat", fileName: "Surat_Tagihan_" + t.jenis + "_" + t.periode.replace(" ","_") + ".pdf", content: { noSurat: t.noSurat, periode: t.periode, cutoff: t.cutoff } }); }}>Download Surat</Btn>}
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
                    <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Surat Tagihan " + t.jenis, subtitle: t.noSurat, type: "surat", fileName: "Surat_Tagihan_" + t.jenis + ".pdf", content: { noSurat: t.noSurat, periode: t.periode, cutoff: t.cutoff } })}>Download Surat Tagihan (PDF)</Btn>
                    <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Rekap Premi " + t.jenis, subtitle: "Periode " + t.periode + " • " + t.peserta + " peserta", type: "table", fileName: "Rekap_Premi_" + t.jenis + ".xlsx", content: { columns: ["Satker", "Golongan", "Peserta", "Nominal"], rows: [["TNI", "Gol. I-IV", "5.480", "Rp 14,25 M"], ["POLRI", "Gol. I-IV", "4.230", "Rp 11,00 M"], ["ASN Kemenhan", "Gol. I-IV", "4.618", "Rp 10,51 M"]], totalRows: 12 } })}>Lihat Rekap Premi</Btn>
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
    { spp: "SPP/2026/07/101", rekap: "RK-001", peserta: "Serma Agus P.", satker: "TNI", unor: "Kodam Jaya", jenisKlaim: "Rawat Inap", nominal: "Rp 45.000.000", status: "Dibayar", riwayat: "4 tahap", pic: "Staf Yarpen A", mitra: "Bank Mandiri" },
    { spp: "SPP/2026/07/102", rekap: "RK-001", peserta: "Pratu Dedi S.", satker: "TNI", unor: "Kodam IM", jenisKlaim: "Rawat Jalan", nominal: "Rp 8.500.000", status: "Disetujui", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "BRI" },
    { spp: "SPP/2026/07/103", rekap: "RK-002", peserta: "Bripka Rina M.", satker: "POLRI", unor: "Polda Metro Jaya", jenisKlaim: "Operasi", nominal: "Rp 120.000.000", status: "Verifikasi", riwayat: "2 tahap", pic: "Staf Yarpen B", mitra: "BNI" },
    { spp: "SPP/2026/07/104", rekap: "RK-002", peserta: "Koptu Hasan F.", satker: "TNI", unor: "Lantamal III", jenisKlaim: "Rawat Inap", nominal: "Rp 32.000.000", status: "Pengajuan", riwayat: "1 tahap", pic: "—", mitra: "Bank Mandiri" },
    { spp: "SPP/2026/07/105", rekap: "RK-003", peserta: "Kapten Lina W.", satker: "TNI", unor: "Mabes TNI", jenisKlaim: "Rawat Jalan", nominal: "Rp 5.200.000", status: "Ditolak", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "BRI" },
    { spp: "SPP/2026/07/106", rekap: "RK-003", peserta: "Pelda Susanto", satker: "ASN Kemenhan", unor: "Ditjen Strahan", jenisKlaim: "Operasi", nominal: "Rp 87.000.000", status: "Dibayar", riwayat: "4 tahap", pic: "Staf Yarpen A", mitra: "BNI" },
    { spp: "SPP/2026/07/107", rekap: "RK-004", peserta: "Briptu Mega S.", satker: "POLRI", unor: "Polda Jabar", jenisKlaim: "Rawat Inap", nominal: "Rp 28.000.000", status: "Verifikasi", riwayat: "2 tahap", pic: "Staf Yarpen B", mitra: "BTN" },
    { spp: "SPP/2026/07/108", rekap: "RK-004", peserta: "Sertu Ahmad R.", satker: "PPPK", unor: "Setjen Kemhan", jenisKlaim: "Rawat Jalan", nominal: "Rp 12.800.000", status: "Disetujui", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "Bank Mandiri" },
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
          <Table columns={["No. SPP", "No. Rekap", "Peserta", "Satker", "Unor", "Jenis Klaim", "Nominal", "Mitra Bayar", "Status", "Riwayat"]}
            data={filtered.map(k => [k.spp, k.rekap, k.peserta, <Badge color={k.satker === "TNI" ? "green" : k.satker === "POLRI" ? "blue" : k.satker === "PPPK" ? "yellow" : "orange"}>{k.satker || "—"}</Badge>, <span style={{ fontSize: 12, color: COLORS.gray600 }}>{k.unor || "—"}</span>, k.jenisKlaim, k.nominal, k.mitra, <Badge color={statusBadge(k.status)}>{k.status}</Badge>, k.riwayat])} />
        )}
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
  const [preview, setPreview] = useState(null);

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

  const mitraData = [
    { mitra: "Bank Mandiri", saldo: 820, kebutuhan: 120, status: "Aman", saldoMei: 780, saldoJun: 800, saldoJul: 820 },
    { mitra: "BRI", saldo: 650, kebutuhan: 95, status: "Aman", saldoMei: 610, saldoJun: 630, saldoJul: 650 },
    { mitra: "BNI", saldo: 420, kebutuhan: 80, status: "Aman", saldoMei: 400, saldoJun: 410, saldoJul: 420 },
    { mitra: "BTN", saldo: 180, kebutuhan: 155, status: "Perhatian", saldoMei: 210, saldoJun: 195, saldoJul: 180 },
    { mitra: "PT Pos Indonesia", saldo: 45, kebutuhan: 62, status: "Kritis", saldoMei: 80, saldoJun: 60, saldoJul: 45 },
  ];
  const totalSaldo = mitraData.reduce((a, m) => a + m.saldo, 0);
  const kebutuhanDapem = 380;
  const kebutuhanTHR = 0;
  const totalKebutuhan = kebutuhanDapem + kebutuhanTHR;
  const surplus = totalSaldo - totalKebutuhan;
  const alertMitra = mitraData.filter(m => m.status !== "Aman");

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Alert Banner for critical mitra */}
      {alertMitra.some(m => m.status === "Kritis") && (
        <div style={{ background: COLORS.redLight, border: `1px solid #FFCDD2`, borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={20} color={COLORS.red} />
          <div>
            <div style={{ fontWeight: 700, color: COLORS.red, fontSize: 14 }}>Alert: Saldo Mitra Kritis</div>
            <div style={{ fontSize: 12, color: COLORS.gray700 }}>{alertMitra.filter(m => m.status === "Kritis").map(m => m.mitra).join(", ")} — saldo di bawah kebutuhan proyeksi. Notifikasi telah dikirim ke Kadiv Keuangan.</div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Building2 size={IC} />} label="Total Saldo Mitra" value={`Rp ${totalSaldo} M`} sub={`${mitraData.length} Mitra Bayar aktif`} color={COLORS.blue} />
        <StatCard icon={<TrendingUp size={IC} />} label="Total Kebutuhan Prox" value={`Rp ${totalKebutuhan} M`} sub="Proyeksi bulan berjalan" color={COLORS.orange} />
        <StatCard icon={surplus >= 0 ? <CheckCircle2 size={IC} /> : <AlertTriangle size={IC} />} label="Surplus / Defisit" value={`${surplus >= 0 ? "+" : ""}Rp ${surplus} M`} sub={surplus >= 0 ? "Dana mencukupi" : "Perlu top-up"} color={surplus >= 0 ? COLORS.green : COLORS.red} />
        <StatCard icon={<CircleAlert size={IC} />} label="Mitra Perlu Perhatian" value={alertMitra.length.toString()} sub={alertMitra.map(m => m.mitra).join(", ") || "Semua aman"} color={alertMitra.length > 0 ? COLORS.red : COLORS.green} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[{ id: "monitoring", label: "Monitoring Saldo" }, { id: "rekap", label: "Rekap Harian Rekening Koran" }, { id: "upload", label: "Upload Rekening Koran" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "12px 24px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: "transparent", color: activeTab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "monitoring" && (
        <div>
          {/* PANEL 1 — Saldo Per Mitra Bayar (Real-time) */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle action={<span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CircleDot size={10} /> Real-time</span>}>
              Panel 1 — Saldo Per Mitra Bayar
            </SectionTitle>
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["Mitra", "Saldo Tersedia", "Kebutuhan Prox", "Coverage", "Status"].map((c, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: i >= 1 && i <= 3 ? "right" : "left", fontWeight: 700, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}` }}>{c}</th>
                  ))}
                </tr></thead>
                <tbody>{mitraData.map((m, i) => {
                  const cov = ((m.saldo / m.kebutuhan) * 100).toFixed(0);
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: m.status === "Kritis" ? COLORS.redLight : m.status === "Perhatian" ? COLORS.yellowLight : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: m.status === "Kritis" ? COLORS.red : COLORS.gray800 }}>{m.mitra}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>Rp {m.saldo} M</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace" }}>Rp {m.kebutuhan} M</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: parseInt(cov) > 120 ? COLORS.green : parseInt(cov) > 80 ? COLORS.orange : COLORS.red }}>{cov}%</td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge color={m.status === "Aman" ? "green" : m.status === "Perhatian" ? "yellow" : "red"}>
                          {m.status === "Aman" ? "■ AMAN" : m.status === "Perhatian" ? "▲ PERHATIAN" : "● KRITIS"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray500 }}>Data saldo diperbarui real-time dari masing-masing mitra bayar • Terakhir: 06 Jul 2026, 14:30 WIB</div>
          </div>

          {/* PANEL 2 & PANEL 4 side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* PANEL 2 — Proyeksi Kebutuhan Dana */}
            <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
              <SectionTitle>Panel 2 — Proyeksi Kebutuhan Dana</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Kebutuhan Dapem Bulan Ini", value: `Rp ${kebutuhanDapem} M`, color: COLORS.gray800 },
                  { label: "Kebutuhan THR/Ke-13 (jika bulan ini)", value: kebutuhanTHR > 0 ? `Rp ${kebutuhanTHR} M` : "—", color: COLORS.gray400 },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
                    <span style={{ fontSize: 13, color: COLORS.gray600 }}>{item.label}</span>
                    <span style={{ fontWeight: 600, fontFamily: "monospace", color: item.color }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 8, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#E3F2FD", borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.blueDark }}>Total Kebutuhan</span>
                    <span style={{ fontWeight: 800, fontFamily: "monospace", color: COLORS.blueDark }}>Rp {totalKebutuhan} M</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: COLORS.gray600 }}>Total Saldo Tersedia</span>
                    <span style={{ fontWeight: 600, fontFamily: "monospace" }}>Rp {totalSaldo} M</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: surplus >= 0 ? COLORS.greenLight : COLORS.redLight, borderRadius: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: surplus >= 0 ? COLORS.green : COLORS.red }}>Surplus / Defisit</span>
                    <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: surplus >= 0 ? COLORS.green : COLORS.red }}>{surplus >= 0 ? "+" : ""}Rp {surplus} M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 4 — Alert Aktif */}
            <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
              <SectionTitle>Panel 4 — Alert Aktif</SectionTitle>
              {alertMitra.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: COLORS.green }}>
                  <CheckCircle2 size={32} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Semua mitra dalam status AMAN</div>
                  <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 4 }}>Tidak ada alert aktif saat ini</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {alertMitra.map((m, i) => (
                    <div key={i} style={{ padding: "14px 16px", borderRadius: 8, border: `1px solid ${m.status === "Kritis" ? "#FFCDD2" : "#FFE0B2"}`, background: m.status === "Kritis" ? COLORS.redLight : COLORS.orangeLight, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: m.status === "Kritis" ? COLORS.red : COLORS.orange }}>{m.mitra}</div>
                        <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 2 }}>Saldo: Rp {m.saldo} M • Kebutuhan: Rp {m.kebutuhan} M</div>
                      </div>
                      <Badge color={m.status === "Kritis" ? "red" : "yellow"}>
                        {m.status === "Kritis" ? "● KRITIS" : "▲ PERHATIAN"}
                      </Badge>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>Notifikasi email + SMS dikirim ke Kadiv Keuangan ketika saldo mitra mendekati batas aman</div>
                </div>
              )}
            </div>
          </div>

          {/* PANEL 3 — Trend Saldo 3 Bulan Terakhir (Line Chart) */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle action={
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {mitraData.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: COLORS.gray600 }}>
                    <span style={{ width: 14, height: 3, background: LINE_COLORS[i % LINE_COLORS.length], borderRadius: 2, display: "inline-block" }} />
                    {m.mitra}
                  </div>
                ))}
              </div>
            }>Panel 3 — Trend Saldo 3 Bulan Terakhir</SectionTitle>

            {(() => {
              const months = ["Mei 2026", "Jun 2026", "Jul 2026"];
              const series = mitraData.map(m => [m.saldoMei, m.saldoJun, m.saldoJul]);
              const allVals = series.flat();
              const rawMax = Math.max(...allVals);
              const niceMax = Math.ceil(rawMax / 200) * 200 || 200;
              const W = 900, H = 300, ML = 66, MR = 20, MT = 16, MB = 40;
              const plotW = W - ML - MR, plotH = H - MT - MB;
              const xAt = i => ML + (plotW / (months.length - 1)) * i;
              const yAt = v => MT + plotH - (v / niceMax) * plotH;
              const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(niceMax * f));

              return (
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}>
                    {/* Horizontal gridlines + Y axis labels */}
                    {yTicks.map((t, i) => (
                      <g key={i}>
                        <line x1={ML} y1={yAt(t)} x2={W - MR} y2={yAt(t)} stroke={COLORS.gray200} strokeWidth="1" strokeDasharray={t === 0 ? "0" : "4 4"} />
                        <text x={ML - 10} y={yAt(t) + 4} textAnchor="end" fontSize="11" fill={COLORS.gray500} fontFamily="Inter, sans-serif">Rp {t} M</text>
                      </g>
                    ))}

                    {/* X axis labels */}
                    {months.map((mo, i) => (
                      <text key={i} x={xAt(i)} y={H - MB + 22} textAnchor="middle" fontSize="12" fill={COLORS.gray600} fontWeight="600" fontFamily="Inter, sans-serif">{mo}</text>
                    ))}

                    {/* Lines + points */}
                    {series.map((vals, si) => {
                      const color = LINE_COLORS[si % LINE_COLORS.length];
                      const pts = vals.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
                      return (
                        <g key={si}>
                          <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                          {vals.map((v, i) => (
                            <g key={i}>
                              <circle cx={xAt(i)} cy={yAt(v)} r="4.5" fill={COLORS.white} stroke={color} strokeWidth="2.5" />
                              {i === vals.length - 1 && (
                                <text x={xAt(i) + 10} y={yAt(v) + 4} fontSize="11" fontWeight="700" fill={color} fontFamily="Inter, sans-serif">Rp {v} M</text>
                              )}
                            </g>
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}

            {/* Ringkasan perubahan per mitra */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginTop: 16 }}>
              {mitraData.map((m, i) => {
                const delta = m.saldoJul - m.saldoMei;
                const pct = (delta / m.saldoMei * 100).toFixed(1);
                const down = delta < 0;
                return (
                  <div key={i} style={{ padding: "10px 12px", background: COLORS.gray50, borderRadius: 8, borderLeft: `3px solid ${LINE_COLORS[i % LINE_COLORS.length]}` }}>
                    <div style={{ fontSize: 11, color: COLORS.gray600, marginBottom: 3 }}>{m.mitra}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace", color: COLORS.gray900 }}>Rp {m.saldoJul} M</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: down ? COLORS.red : COLORS.green }}>{down ? "↓" : "↑"} {pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: COLORS.gray500 }}>Perbandingan saldo akhir bulan per mitra bayar • Sumber: rekening koran CMS masing-masing mitra</div>
          </div>
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
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Harian", subtitle: "Data pembayaran mitra ke peserta", type: "table", fileName: "Rekap_Harian_Pembayaran.xlsx", content: { columns: ["No. Ref", "Nama", "Jenis", "Mitra", "Nominal", "Status"], rows: filteredRekap.slice(0,5).map(r => [r.noRef, r.nama, r.jenis, r.mitra, r.nominal, r.status]), totalRows: filteredRekap.length } })}>Excel</Btn><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Harian", subtitle: "Format PDF", type: "table", fileName: "Rekap_Harian_Pembayaran.pdf", content: { columns: ["No. Ref", "Nama", "Jenis", "Mitra", "Nominal", "Status"], rows: filteredRekap.slice(0,5).map(r => [r.noRef, r.nama, r.jenis, r.mitra, r.nominal, r.status]), totalRows: filteredRekap.length } })}>PDF</Btn></div>}>Rekap Pembayaran Mitra ke Peserta</SectionTitle>
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
  const [expandedSatker, setExpandedSatker] = useState(null);
  const [uploadStep, setUploadStep] = useState(0); // 0=belum upload, 1=terunggah & tercocokkan, 2=terdistribusi
  const [preview, setPreview] = useState(null);

  const allData = [
    { nrp: "198701234", nama: "Purn. Kol. Ahmad Rifai", satker: "TNI", unor: "Kodam Jaya", bruto: 8500000, p17: 125000, ter: 127500, npwp: "09.123.456.7-011.000", email: "a.rifai@mail.com", matched: true },
    { nrp: "198805678", nama: "Purn. Lettu Budi K.", satker: "TNI", unor: "Mabes TNI", bruto: 6200000, p17: 62000, ter: 62000, npwp: "—", email: "budi.k@mail.com", matched: false },
    { nrp: "199012345", nama: "Purn. AKP Citra D.", satker: "POLRI", unor: "Polda Metro Jaya", bruto: 12800000, p17: 450000, ter: 460800, npwp: "08.234.567.8-021.000", email: "citra.d@mail.com", matched: true },
    { nrp: "199205678", nama: "Purn. Penata Sri W.", satker: "ASN Kemenhan", unor: "Ditjen Strahan", bruto: 7400000, p17: 95000, ter: 96200, npwp: "07.345.678.9-031.000", email: "sri.w@mail.com", matched: true },
    { nrp: "198604321", nama: "Purn. Bripka Anwar I.", satker: "POLRI", unor: "Polda Jabar", bruto: 9200000, p17: 215000, ter: 220800, npwp: "06.456.789.0-041.000", email: "anwar.i@mail.com", matched: true },
    { nrp: "197506789", nama: "Purn. Pembina Agus S.", satker: "PPPK", unor: "Setjen Kemhan", bruto: 5800000, p17: 48000, ter: 48000, npwp: "05.567.890.1-051.000", email: "agus.s@mail.com", matched: true },
  ];
  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  const satkerColor = s => s === "TNI" ? "green" : s === "POLRI" ? "blue" : s === "PPPK" ? "yellow" : "orange";

  // ===== Agregasi TER vs Pasal 17 PER SATKER =====
  const satkerList = ["TNI", "POLRI", "ASN Kemenhan", "PPPK"];
  const satkerAgg = satkerList.map(sk => {
    const rows = allData.filter(d => d.satker === sk);
    return {
      satker: sk,
      count: rows.length,
      bruto: rows.reduce((a, d) => a + d.bruto, 0),
      p17: rows.reduce((a, d) => a + d.p17, 0),
      ter: rows.reduce((a, d) => a + d.ter, 0),
      rows,
    };
  }).filter(s => s.count > 0);
  const aggFiltered = filterSatker === "Semua" ? satkerAgg : satkerAgg.filter(s => s.satker === filterSatker);
  const totalRow = aggFiltered.reduce((a, s) => ({ count: a.count + s.count, bruto: a.bruto + s.bruto, p17: a.p17 + s.p17, ter: a.ter + s.ter }), { count: 0, bruto: 0, p17: 0, ter: 0 });

  // ===== Distribusi Bukti Potong (dari Coretax) =====
  const totalBukpot = allData.length;
  const cocok = allData.filter(d => d.matched);
  const tidakCocok = allData.filter(d => !d.matched);
  const bukpotStatus = d => {
    if (!d.matched) return { label: "NIK/NPWP tidak cocok", color: "red" };
    if (uploadStep < 2) return { label: "Siap Kirim", color: "yellow" };
    // simulasi: peserta pertama sudah membuka portal / mengunduh
    return d.nrp === "198701234" ? { label: "Terunduh", color: "green" } : { label: "Terkirim", color: "blue" };
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Calculator size={IC} />} label="PPh 21 Terhitung" value="128.450 WP" sub="Periode Juli 2026 (TER)" color={COLORS.blue} />
        <StatCard icon={<Receipt size={IC} />} label="Bukti Potong A2" value="128.320" sub="130 tertunda" color={COLORS.green} />
        <StatCard icon={<AlertTriangle size={IC} />} label="NIK/NPWP Bermasalah" value="347 Peserta" color={COLORS.red} />
      </div>

      {/* ===== PERBANDINGAN TER vs PASAL 17 — PER SATKER ===== */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle action={
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Perbandingan TER vs Pasal 17", subtitle: "Rekap per Satker", type: "table", fileName: "Perbandingan_TER_vs_Pasal17_per_Satker.xlsx", content: { columns: ["Satker", "Jumlah WP", "Bruto", "PPh Pasal 17", "PPh 21 TER", "Selisih"], rows: aggFiltered.map(s => [s.satker, s.count, fmt(s.bruto), fmt(s.p17), fmt(s.ter), fmt(s.ter - s.p17)]), totalRows: aggFiltered.length } })}>Ekspor Rekap</Btn>
        }>Perbandingan TER vs Pasal 17 per Satker</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Satker" value={filterSatker} onChange={v => { setFilterSatker(v); setExpandedSatker(null); }} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={140} />
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Klik baris satker untuk melihat rincian per peserta. Selisih = PPh 21 TER − PPh Pasal 17.</div>
        {aggFiltered.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["Satker", "Jumlah WP", "Penghasilan Bruto", "PPh Pasal 17", "PPh 21 TER", "Selisih", ""].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: i >= 1 && i <= 5 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>
                {aggFiltered.flatMap((s) => {
                  const selisih = s.ter - s.p17;
                  const open = expandedSatker === s.satker;
                  const rows = [
                    <tr key={s.satker} onClick={() => setExpandedSatker(open ? null : s.satker)} style={{ borderBottom: `1px solid ${COLORS.gray200}`, cursor: "pointer", background: open ? COLORS.gray50 : "transparent" }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = open ? COLORS.gray50 : "transparent"}>
                      <td style={{ padding: "10px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{open ? <ChevronDown size={14} color={COLORS.gray500} /> : <ChevronRight size={14} color={COLORS.gray500} />}<Badge color={satkerColor(s.satker)}>{s.satker}</Badge></div></td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>{s.count} WP</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmt(s.bruto)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmt(s.p17)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(s.ter)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: selisih === 0 ? COLORS.gray500 : selisih > 0 ? COLORS.red : COLORS.green, fontWeight: 600 }}>{selisih > 0 ? "+" : ""}{fmt(selisih)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>{selisih === 0 ? <Badge color="gray">Setara</Badge> : selisih > 0 ? <Badge color="red">TER lebih tinggi</Badge> : <Badge color="green">TER lebih rendah</Badge>}</td>
                    </tr>
                  ];
                  if (open) s.rows.forEach((d, j) => {
                    const sel = d.ter - d.p17;
                    rows.push(
                      <tr key={s.satker + "-" + j} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.gray50, fontSize: 12 }}>
                        <td style={{ padding: "8px 14px 8px 40px", color: COLORS.gray800 }}><div style={{ fontWeight: 600 }}>{d.nama}</div><div style={{ fontSize: 11, color: COLORS.gray400 }}>NRP {d.nrp} · {d.unor}</div></td>
                        <td style={{ padding: "8px 14px", textAlign: "right", color: COLORS.gray400 }}>1 WP</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.gray600 }}>{fmt(d.bruto)}</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.gray600 }}>{fmt(d.p17)}</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.gray600 }}>{fmt(d.ter)}</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: sel === 0 ? COLORS.gray400 : sel > 0 ? COLORS.red : COLORS.green }}>{sel > 0 ? "+" : ""}{fmt(sel)}</td>
                        <td />
                      </tr>
                    );
                  });
                  return rows;
                })}
                <tr style={{ background: COLORS.gray100, fontWeight: 700 }}>
                  <td style={{ padding: "10px 14px" }}>TOTAL {filterSatker !== "Semua" ? `— ${filterSatker}` : ""}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>{totalRow.count} WP</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmt(totalRow.bruto)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmt(totalRow.p17)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmt(totalRow.ter)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: totalRow.ter - totalRow.p17 > 0 ? COLORS.red : COLORS.green }}>{totalRow.ter - totalRow.p17 > 0 ? "+" : ""}{fmt(totalRow.ter - totalRow.p17)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== UPLOAD & DISTRIBUSI BUKTI POTONG (DARI CORETAX) ===== */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle action={uploadStep > 0 && <Btn variant="ghost" size="sm" onClick={() => setUploadStep(0)}><RefreshCw size={13} /> Ulangi Upload</Btn>}>Bukti Potong PPh 21 — Upload & Distribusi ke Peserta</SectionTitle>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {[{ n: 1, t: "Unggah dari Coretax" }, { n: 2, t: "Pencocokan NPWP/NIK" }, { n: 3, t: "Distribusi ke Peserta" }].map((st, i) => {
            const done = uploadStep >= st.n;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: done ? "#E3F2FD" : COLORS.gray100, color: done ? COLORS.blue : COLORS.gray500, fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: done ? COLORS.blue : COLORS.gray300, color: COLORS.white, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{done ? <CheckCircle2 size={13} /> : st.n}</span>
                {st.t}
              </div>
            );
          })}
        </div>

        {uploadStep === 0 && (
          <>
            <div style={{ border: `2px dashed ${COLORS.gray300}`, borderRadius: 10, padding: "36px 24px", textAlign: "center", background: COLORS.gray50 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#E3F2FD", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><FileUp size={24} color={COLORS.blue} /></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.gray900 }}>Unggah berkas bukti potong dari Coretax</div>
              <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 6, maxWidth: 560, margin: "6px auto 0" }}>Sumber bukti potong hanya dari Coretax DJP. Unggah paket massal (ZIP berisi PDF per peserta) beserta berkas manifes XML/CSV yang memuat NPWP/NIK setiap peserta untuk pencocokan otomatis.</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
                <Btn onClick={() => setUploadStep(1)}><Upload size={14} /> Pilih Berkas Coretax</Btn>
                <Btn variant="outline" onClick={() => setUploadStep(1)}>Tarik dari Coretax (API)</Btn>
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 14 }}>Format didukung: ZIP (PDF 1721-A2), XML/CSV manifes • Maks. 200 MB</div>
            </div>
            {/* <div style={{ marginTop: 16, background: COLORS.gray50, border: `1px solid ${COLORS.gray200}`, borderRadius: 8, padding: "14px 18px", fontSize: 13, color: COLORS.gray700 }}>
              <div style={{ fontWeight: 700, color: COLORS.gray800, marginBottom: 8 }}>Alur ideal agar tiap bukti potong sampai ke peserta yang benar</div>
              <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                <li><strong>Kunci pencocokan = NPWP/NIK.</strong> Sistem memetakan tiap PDF bukpot ke satu peserta lewat NPWP/NIK pada manifes — bukan nama, agar tidak tertukar.</li>
                <li><strong>Peserta cocok → Portal Peserta + Email.</strong> Bukpot terbit di akun masing-masing peserta (unduh mandiri) dan notifikasi tautan aman dikirim ke email. Tiap peserta hanya melihat miliknya sendiri.</li>
                <li><strong>Peserta tidak cocok → antrian perbaikan.</strong> NPWP/NIK bermasalah ditahan, tidak dikirim, sampai data dibetulkan agar tak salah kirim.</li>
                <li><strong>Lacak status per peserta:</strong> Terkirim → Terunduh, sehingga bisa dibuktikan bukpot benar-benar diterima.</li>
              </ol>
            </div> */}
          </>
        )}

        {uploadStep >= 1 && (
          <>
            {/* Ringkasan pencocokan */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 160, background: COLORS.gray50, border: `1px solid ${COLORS.gray200}`, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: COLORS.gray500 }}>Bukpot terbaca</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray900 }}>{totalBukpot}</div>
              </div>
              <div style={{ flex: 1, minWidth: 160, background: COLORS.greenLight, border: `1px solid ${COLORS.green}22`, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: COLORS.green }}>Cocok dengan peserta</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.green }}>{cocok.length}</div>
              </div>
              <div style={{ flex: 1, minWidth: 160, background: COLORS.redLight, border: `1px solid ${COLORS.red}22`, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: COLORS.red }}>NPWP/NIK tidak cocok</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.red }}>{tidakCocok.length}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 13, color: COLORS.gray600 }}>
                {uploadStep < 2
                  ? <>Kanal distribusi: <strong>Portal Peserta + Email</strong>. Hanya bukpot yang cocok yang dapat dikirim.</>
                  : <><CheckCircle2 size={14} color={COLORS.green} style={{ verticalAlign: "middle" }} /> <strong>{cocok.length} bukpot</strong> telah didistribusikan ke Portal Peserta & email masing-masing.</>}
              </div>
              {uploadStep < 2
                ? <Btn onClick={() => setUploadStep(2)}><Mail size={14} /> Kirim ke {cocok.length} Peserta</Btn>
                : <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Log Distribusi Bukti Potong", subtitle: "Portal Peserta + Email", type: "table", fileName: "Log_Distribusi_Bukpot_PPh21.xlsx", content: { columns: ["Nama", "NPWP", "Satker", "Kanal", "Status"], rows: cocok.map(d => [d.nama, d.npwp, d.satker, "Portal + Email", bukpotStatus(d).label]), totalRows: cocok.length } })}>Unduh Log Distribusi</Btn>}
            </div>

            {/* Tabel distribusi per peserta */}
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["Nama Peserta", "NPWP", "Satker", "Kanal", "Status Distribusi", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {allData.map((d, i) => {
                    const st = bukpotStatus(d);
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "10px 14px" }}><div style={{ fontWeight: 600, color: COLORS.gray800 }}>{d.nama}</div><div style={{ fontSize: 11, color: COLORS.gray400 }}>NRP {d.nrp}</div></td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: d.matched ? COLORS.gray700 : COLORS.red }}>{d.npwp}</td>
                        <td style={{ padding: "10px 14px" }}><Badge color={satkerColor(d.satker)}>{d.satker}</Badge></td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: COLORS.gray600 }}>{d.matched ? "Portal + Email" : "—"}</td>
                        <td style={{ padding: "10px 14px" }}><Badge color={st.color}>{st.label}</Badge></td>
                        <td style={{ padding: "10px 14px" }}>
                          {d.matched
                            ? <Btn size="sm" variant="ghost" onClick={() => setPreview({ title: "Preview Bukti Potong 1721-A2", subtitle: `${d.nama} — ${d.satker}`, type: "table", fileName: `Bukpot_A2_${d.nrp}.pdf`, content: { columns: ["Uraian", "Nilai"], rows: [["NPWP", d.npwp], ["Penghasilan Bruto", fmt(d.bruto)], ["PPh 21 Dipotong (TER)", fmt(d.ter)], ["Masa Pajak", "Juli 2026"], ["Pemotong", "PT ASABRI (Persero)"]], totalRows: 5 } })}><Eye size={13} /> Lihat</Btn>
                            : <Btn size="sm" variant="outline" onClick={() => setPreview({ title: "Perbaikan Data NPWP/NIK", subtitle: `${d.nama} — bukpot ditahan`, type: "table", fileName: "Antrian_Perbaikan.xlsx", content: { columns: ["Field", "Nilai"], rows: [["Nama", d.nama], ["NRP", d.nrp], ["NPWP", "Tidak ditemukan / tidak valid"], ["Tindakan", "Padankan NPWP dari Coretax lalu unggah ulang"]], totalRows: 4 } })}><PenLine size={13} /> Perbaiki</Btn>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: COLORS.gray500 }}>Peserta dengan NPWP/NIK tidak cocok ditahan otomatis dan tidak dikirim hingga datanya dibetulkan — mencegah bukti potong salah kirim.</div>
          </>
        )}
      </div>
    </div>
  );
};

const KreditPiutang = () => {
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
  const totalSaldo = allKasus.reduce((a, k) => a + k.jumlah, 0);
  const totalDikembalikan = allKasus.reduce((a, k) => a + k.dikembalikan, 0);
  const satkerList = [...new Set(allKasus.map(k => k.satker))];
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
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["No", "Ref / Tgl Pengajuan", "Nama Peserta", "NRP/NIP", "Satker", "Unor", "Jumlah (Rp)", "Status", "Aksi"].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: i === 5 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{filtered.map((k, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 14px", color: COLORS.gray500 }}>{k.no}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 600, color: COLORS.blue }}>{k.ref}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>{k.tgl}</div>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 500, color: COLORS.gray800 }}>{k.nama}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12 }}>{k.nrp}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color={k.satker === "TNI" ? "green" : k.satker === "POLRI" ? "blue" : k.satker === "PPPK" ? "yellow" : "orange"}>{k.satker}</Badge></td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: COLORS.gray600 }}>{k.unor || "—"}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(k.jumlah)}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color={statusColor(k.status)}>{k.status}</Badge></td>
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
            <div style={{ borderRadius: 8, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}` }}>Tanggal Deskripsi</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}` }}>Nominal</th>
                </tr></thead>
                <tbody>
                  <tr><td style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray100}` }}>28/01/2026</td><td style={{ padding: "8px 12px", borderBottom: `1px solid ${COLORS.gray100}` }}>
                    <div style={{ fontSize: 11, color: COLORS.gray500 }}>KREDIT UDW KOALISI SATKER A</div>
                    <div style={{ fontWeight: 700, fontFamily: "monospace" }}>45.000.000</div>
                  </td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Data Sistem (Total Tagihan)</div>
            <div style={{ borderRadius: 8, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}` }}>Satker</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}` }}>Jml Kasus</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}` }}>Total Tagihan</th>
                </tr></thead>
                <tbody>
                  <tr><td style={{ padding: "8px 12px" }}>Kodam Jaya</td><td style={{ padding: "8px 12px", textAlign: "center" }}>3 Kasus</td><td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontFamily: "monospace", color: COLORS.orange }}>46.500.000</td></tr>
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

const DashboardDIPA = () => {
  const [tab, setTab] = useState("realisasi");
  const [openJenis, setOpenJenis] = useState(null);
  const [threshold, setThreshold] = useState(15);
  const [preview, setPreview] = useState(null);

  const fmtM = n => `Rp ${n.toLocaleString("id-ID")} M`;
  const fmtRp = n => `Rp ${n.toLocaleString("id-ID")}`;

  // Rincian MAK per jenis dapem (nilai dalam rupiah penuh)
  const jenisDapem = [
    { key: "induk", nama: "Dapem Induk", icon: "wallet", warna: COLORS.blue, mak: [
      { kode: "511111", uraian: "Belanja Pensiun Pokok", pagu: 3_120_000_000_000, real: 2_340_000_000_000 },
      { kode: "511119", uraian: "Belanja Tunjangan Keluarga Pensiun", pagu: 680_000_000_000, real: 512_000_000_000 },
      { kode: "511121", uraian: "Belanja Tunjangan Beras Pensiun", pagu: 400_000_000_000, real: 298_000_000_000 },
    ]},
    { key: "susulan", nama: "Dapem Susulan", icon: "clock", warna: COLORS.green, mak: [
      { kode: "511112", uraian: "Belanja Pensiun Susulan Pokok", pagu: 640_000_000_000, real: 318_000_000_000 },
      { kode: "511120", uraian: "Belanja Tunjangan Keluarga Susulan", pagu: 210_000_000_000, real: 92_000_000_000 },
      { kode: "511122", uraian: "Belanja Tunjangan Beras Susulan", pagu: 120_000_000_000, real: 35_000_000_000 },
    ]},
    { key: "rapel", nama: "Dapem Rapel", icon: "trendup", warna: COLORS.orange, mak: [
      { kode: "511113", uraian: "Belanja Rapel Kenaikan Pensiun Pokok", pagu: 280_000_000_000, real: 196_000_000_000 },
      { kode: "511123", uraian: "Belanja Rapel Tunjangan", pagu: 90_000_000_000, real: 61_000_000_000 },
    ]},
    { key: "thr", nama: "THR Pensiun", icon: "gift", warna: "#7B1FA2", mak: [
      { kode: "511131", uraian: "Belanja THR Pensiun Pokok", pagu: 320_000_000_000, real: 318_500_000_000 },
      { kode: "511132", uraian: "Belanja THR Tunjangan Keluarga", pagu: 68_000_000_000, real: 67_200_000_000 },
    ]},
    { key: "ke13", nama: "Dapem ke-13", icon: "calendar", warna: "#00838F", mak: [
      { kode: "511141", uraian: "Belanja Pensiun ke-13 Pokok", pagu: 310_000_000_000, real: 0 },
      { kode: "511142", uraian: "Belanja Pensiun ke-13 Tunjangan", pagu: 66_000_000_000, real: 0 },
    ]},
    { key: "jkk", nama: "JKK Perawatan", icon: "shield", warna: COLORS.red, mak: [
      { kode: "594211", uraian: "Belanja Santunan JKK Perawatan", pagu: 180_000_000_000, real: 121_000_000_000 },
      { kode: "594212", uraian: "Belanja Santunan JKK Cacat", pagu: 95_000_000_000, real: 58_000_000_000 },
    ]},
    { key: "taspen", nama: "Taspen Life", icon: "bank", warna: "#5D4037", mak: [
      { kode: "594213", uraian: "Belanja Premi Taspen Life (TDS/TPB)", pagu: 48_000_000_000, real: 31_500_000_000 },
      { kode: "594214", uraian: "Belanja Premi Proteksi Beasiswa", pagu: 22_000_000_000, real: 12_800_000_000 },
    ]},
  ];

  const jenisTotal = j => {
    const pagu = j.mak.reduce((a, m) => a + m.pagu, 0);
    const real = j.mak.reduce((a, m) => a + m.real, 0);
    return { pagu, real, sisa: pagu - real, pct: pagu ? (real / pagu) * 100 : 0 };
  };
  const grand = jenisDapem.reduce((a, j) => { const t = jenisTotal(j); return { pagu: a.pagu + t.pagu, real: a.real + t.real }; }, { pagu: 0, real: 0 });
  const grandSisa = grand.pagu - grand.real;
  const pctUsed = ((grand.real / grand.pagu) * 100).toFixed(1);
  const pctSisa = ((grandSisa / grand.pagu) * 100).toFixed(1);
  const isAlert = parseFloat(pctSisa) <= threshold;
  const paguAwal = grand.pagu - 320_000_000_000;
  const revisiPagu = 320_000_000_000;

  const jenisIcon = (k, size = 18) => ({ wallet: <Wallet size={size} />, clock: <Clock size={size} />, trendup: <TrendingUp size={size} />, gift: <Banknote size={size} />, calendar: <Calendar size={size} />, shield: <Shield size={size} />, bank: <Building2 size={size} /> }[k] || <FileText size={size} />);

  const sp2dLog = [
    { no: "SP2D/2026/07/0234", tgl: "06 Jul 2026 14:30", jenis: "Dapem Induk", nominal: 42_500_000_000, penerima: "Bank Mandiri", sisa: 1_847_000_000_000 },
    { no: "SP2D/2026/07/0233", tgl: "05 Jul 2026 11:15", jenis: "Dapem Susulan", nominal: 8_200_000_000, penerima: "BRI", sisa: 1_889_500_000_000 },
    { no: "SP2D/2026/07/0232", tgl: "04 Jul 2026 09:45", jenis: "JKK Perawatan", nominal: 3_100_000_000, penerima: "BNI", sisa: 1_897_700_000_000 },
    { no: "SP2D/2026/07/0231", tgl: "03 Jul 2026 16:20", jenis: "Dapem Rapel", nominal: 12_400_000_000, penerima: "Bank Mandiri", sisa: 1_900_800_000_000 },
    { no: "SP2D/2026/07/0230", tgl: "02 Jul 2026 13:10", jenis: "Taspen Life", nominal: 2_050_000_000, penerima: "Taspen Life", sisa: 1_913_200_000_000 },
    { no: "SP2D/2026/06/0228", tgl: "28 Jun 2026 10:00", jenis: "THR Pensiun", nominal: 385_700_000_000, penerima: "BTN", sisa: 1_939_700_000_000 },
  ];

  const revisiLog = [
    { no: "REV/2026/03/001", tgl: "15 Mar 2026", jenis: "Dapem Induk", sebelum: 4_000_000_000_000, sesudah: 4_200_000_000_000, alasan: "Revisi APBN TA 2026 — tambahan alokasi pensiun baru" },
    { no: "REV/2026/05/002", tgl: "20 Mei 2026", jenis: "Dapem Susulan", sebelum: 890_000_000_000, sesudah: 970_000_000_000, alasan: "Penyesuaian data pensiunan susulan triwulan II" },
    { no: "REV/2026/06/003", tgl: "10 Jun 2026", jenis: "Dapem ke-13", sebelum: 336_000_000_000, sesudah: 376_000_000_000, alasan: "Penyesuaian alokasi Dapem ke-13 sesuai PP terbaru" },
  ];

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {isAlert && (
        <div style={{ background: COLORS.redLight, border: `1px solid #FFCDD2`, borderRadius: 10, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={20} color={COLORS.red} />
          <div>
            <div style={{ fontWeight: 700, color: COLORS.red, fontSize: 14 }}>Sisa Pagu di Bawah Threshold ({threshold}%)</div>
            <div style={{ fontSize: 12, color: COLORS.gray700 }}>Sisa pagu saat ini <strong>{fmtRp(grandSisa)} ({pctSisa}%)</strong> dari pagu berjalan {fmtRp(grand.pagu)}. Notifikasi telah dikirim ke Kadiv Keuangan.</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<BarChart3 size={IC} />} label="Pagu DIPA Awal" value={fmtRp(paguAwal)} sub="TA 2026 (DIPA Induk)" color={COLORS.blue} />
        <StatCard icon={<TrendingUp size={IC} />} label="Revisi Pagu" value={"+" + fmtRp(revisiPagu)} sub={`${revisiLog.length} kali revisi`} color="#7B1FA2" />
        <StatCard icon={<Banknote size={IC} />} label="Pagu Berjalan" value={fmtRp(grand.pagu)} sub="Pagu Awal + Revisi" color={COLORS.blueDark} />
        <StatCard icon={<Wallet size={IC} />} label="Realisasi SP2D" value={fmtRp(grand.real)} sub={`${pctUsed}% terserap`} color={COLORS.green} />
        <StatCard icon={<TrendingDown size={IC} />} label="Sisa Pagu" value={fmtRp(grandSisa)} sub={`${pctSisa}% tersisa`} color={isAlert ? COLORS.red : COLORS.orange} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "realisasi", l: "Realisasi per Jenis Dapem" },
          { id: "sp2d", l: "Riwayat Pencairan SP2D", c: sp2dLog.length },
          { id: "revisi", l: "Riwayat Revisi Pagu", c: revisiLog.length },
          { id: "konfigurasi", l: "Konfigurasi Alert" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "transparent", display: "flex", alignItems: "center", gap: 6, color: tab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>
            {t.l}
            {t.c ? <span style={{ background: tab === t.id ? "#E3F2FD" : COLORS.gray200, color: tab === t.id ? COLORS.blue : COLORS.gray700, padding: "1px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.c}</span> : null}
          </button>
        ))}
      </div>

      {/* TAB: Realisasi per Jenis Dapem */}
      {tab === "realisasi" && (
        <div>
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle>Realisasi Pagu DIPA — TA 2026</SectionTitle>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: COLORS.gray500 }}>Realisasi <strong style={{ color: COLORS.gray900 }}>{fmtRp(grand.real)}</strong> dari <strong>{fmtRp(grand.pagu)}</strong></span>
              <span style={{ fontWeight: 700, color: parseFloat(pctUsed) > 85 ? COLORS.red : COLORS.blue }}>{pctUsed}%</span>
            </div>
            <div style={{ height: 20, background: COLORS.gray200, borderRadius: 10, overflow: "hidden", position: "relative" }}>
              <div style={{ height: "100%", width: `${pctUsed}%`, background: `linear-gradient(90deg, ${COLORS.blue} 0%, ${parseFloat(pctUsed) > 85 ? COLORS.red : COLORS.green} 100%)`, borderRadius: 10, transition: "width 0.6s" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${100 - threshold}%`, width: 2, background: COLORS.red, opacity: 0.7 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4, color: COLORS.gray400 }}>
              <span>Rp 0</span><span style={{ color: COLORS.red }}>Threshold {threshold}%</span><span>{fmtRp(grand.pagu)}</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Klik kartu untuk melihat rincian MAK (Mata Anggaran Kegiatan)</div>

          <div style={{ maxHeight: 460, overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 10 }}>
            {jenisDapem.map((j, i) => {
              const t = jenisTotal(j);
              const warn = t.pagu > 0 && (t.sisa / t.pagu) * 100 <= threshold;
              return (
                <div key={i} onClick={() => setOpenJenis(j.key)}
                  style={{ background: COLORS.white, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all .18s", border: `1px solid ${COLORS.gray200}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = j.warna; e.currentTarget.style.boxShadow = `0 2px 10px ${j.warna}1F`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.gray200; e.currentTarget.style.boxShadow = "none"; }}>

                  {/* Baris judul */}
                  <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: j.warna + "18", color: j.warna, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{jenisIcon(j.icon, 18)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray800 }}>{j.nama}</div>
                      <div style={{ fontSize: 11, color: COLORS.gray400 }}>{j.mak.length} MAK</div>
                    </div>
                    {warn && <Badge color="red">Di bawah threshold</Badge>}
                    <ChevronRight size={16} color={COLORS.gray400} style={{ flexShrink: 0 }} />
                  </div>

                  {/* Angka ringkas — wrap otomatis bila sempit */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", marginBottom: 10 }}>
                    {[
                      { l: "Pagu", v: fmtRp(t.pagu), c: COLORS.gray800 },
                      { l: "Realisasi", v: fmtRp(t.real), c: COLORS.green },
                      { l: "Sisa", v: fmtRp(t.sisa), c: warn ? COLORS.red : COLORS.gray800 },
                    ].map((x, k) => (
                      <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                        <span style={{ fontSize: 10, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.4 }}>{x.l}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: x.c }}>{x.v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                    <span style={{ color: COLORS.gray500 }}>Terserap</span>
                    <span style={{ fontWeight: 700, color: warn ? COLORS.red : j.warna }}>{t.pct.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={t.real} max={t.pagu || 1} color={warn ? COLORS.red : j.warna} />
                </div>
              );
            })}
          </div>

          {/* Modal rincian MAK */}
          {openJenis && (() => {
            const j = jenisDapem.find(x => x.key === openJenis);
            const t = jenisTotal(j);
            return (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setOpenJenis(null)}>
                <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: "100%", maxWidth: 780, maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                  <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 9, background: j.warna + "18", color: j.warna, display: "flex", alignItems: "center", justifyContent: "center" }}>{jenisIcon(j.icon, 19)}</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900 }}>Rincian MAK — {j.nama}</div>
                        <div style={{ fontSize: 12, color: COLORS.gray500 }}>{j.mak.length} mata anggaran • TA 2026</div>
                      </div>
                    </div>
                    <button onClick={() => setOpenJenis(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
                  </div>

                  <div style={{ padding: "18px 24px", overflowY: "auto", flex: 1 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                      {[
                        { l: "Pagu DIPA", v: fmtRp(t.pagu), c: COLORS.blue, bg: "#E3F2FD" },
                        { l: "Realisasi", v: fmtRp(t.real), c: COLORS.green, bg: COLORS.greenLight },
                        { l: "Sisa Pagu", v: fmtRp(t.sisa), c: t.sisa / t.pagu * 100 <= threshold ? COLORS.red : COLORS.orange, bg: t.sisa / t.pagu * 100 <= threshold ? COLORS.redLight : COLORS.orangeLight },
                      ].map((x, k) => (
                        <div key={k} style={{ flex: "1 1 180px", padding: "12px 14px", background: x.bg, borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: COLORS.gray600 }}>{x.l}</div>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: x.c }}>{x.v}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead><tr style={{ background: COLORS.gray100 }}>
                          {["MAK", "Uraian", "Pagu DIPA (Rp)", "Realisasi (Rp)", "Sisa (Rp)"].map((c, k) => (
                            <th key={k} style={{ padding: "11px 14px", textAlign: k >= 2 ? "right" : "left", fontWeight: 700, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                          ))}
                        </tr></thead>
                        <tbody>
                          {(() => {
                            const warn = t.pagu > 0 && (t.sisa / t.pagu) * 100 <= threshold;
                            return (
                              <tr style={{ background: warn ? COLORS.redLight : "transparent" }}>
                                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 600, color: j.warna }}>{j.mak.map(m => m.kode).join(", ")}</td>
                                <td style={{ padding: "12px 14px", fontWeight: 600, color: COLORS.gray800 }}>{j.nama}</td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>{fmtRp(t.pagu)}</td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.green }}>{fmtRp(t.real)}</td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: warn ? COLORS.red : COLORS.gray900 }}>{fmtRp(t.sisa)}</td>
                              </tr>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, color: COLORS.gray500 }}>Nilai merupakan akumulasi seluruh MAK pada jenis ini • Latar merah = sisa pagu di bawah threshold {threshold}%</div>
                  </div>

                  <div style={{ padding: "14px 24px", borderTop: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
                    <Btn variant="outline" size="sm" onClick={() => setPreview({ title: `Preview Rincian MAK — ${j.nama}`, subtitle: "Pagu, realisasi, dan sisa per mata anggaran", type: "table", fileName: `Rincian_MAK_${j.nama.replace(/ /g, "_")}.xlsx`, content: { columns: ["MAK", "Uraian", "Pagu DIPA", "Realisasi", "Sisa"], rows: [[j.mak.map(m => m.kode).join(", "), j.nama, fmtRp(t.pagu), fmtRp(t.real), fmtRp(t.sisa)]], totalRows: 1 } })}>Ekspor Excel</Btn>
                    <Btn size="sm" onClick={() => setOpenJenis(null)}>Tutup</Btn>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB: Riwayat SP2D */}
      {tab === "sp2d" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CircleDot size={10} /> Real-time</span>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Riwayat SP2D", subtitle: "Data pencairan SP2D TA 2026", type: "table", fileName: "Riwayat_SP2D_2026.xlsx", content: { columns: ["No. SP2D", "Tanggal", "Jenis", "Nominal", "Penerima"], rows: sp2dLog.map(s => [s.no, s.tgl, s.jenis, fmtRp(s.nominal), s.penerima]), totalRows: sp2dLog.length } })}>Ekspor</Btn>
          </div>}>Riwayat Pencairan SP2D</SectionTitle>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["No. SP2D", "Tanggal & Waktu", "Jenis Dapem", "Nominal Pencairan", "Mitra Bayar", "Sisa Pagu Setelah"].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: i >= 3 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{sp2dLog.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: COLORS.blue, fontWeight: 500 }}>{s.no}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12 }}>{s.tgl}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color={s.jenis.includes("Induk") ? "blue" : s.jenis.includes("Susulan") ? "green" : s.jenis.includes("JKK") ? "red" : "orange"}>{s.jenis}</Badge></td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmtRp(s.nominal)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>{s.penerima}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontSize: 12, color: COLORS.gray500 }}>{fmtRp(s.sisa)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray500 }}>Data diperbarui otomatis setiap kali SP2D baru diterbitkan • Terakhir: 06 Jul 2026, 14:30 WIB</div>
        </div>
      )}

      {/* TAB: Riwayat Revisi Pagu */}
      {tab === "revisi" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Riwayat Revisi Pagu", subtitle: "Perubahan pagu DIPA TA 2026", type: "table", fileName: "Riwayat_Revisi_Pagu_2026.xlsx", content: { columns: ["No. Revisi", "Tanggal", "Jenis", "Sebelum", "Sesudah", "Selisih"], rows: revisiLog.map(r => [r.no, r.tgl, r.jenis, fmtRp(r.sebelum), fmtRp(r.sesudah), "+" + fmtRp(r.sesudah - r.sebelum)]), totalRows: revisiLog.length } })}>Ekspor</Btn>}>Riwayat Revisi Pagu DIPA</SectionTitle>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["No. Revisi", "Tanggal", "Jenis Dapem", "Pagu Sebelum", "Pagu Sesudah", "Selisih", "Alasan Revisi"].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: i >= 3 && i <= 5 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{revisiLog.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#7B1FA2", fontWeight: 500 }}>{r.no}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12 }}>{r.tgl}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color="blue">{r.jenis}</Badge></td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmtRp(r.sebelum)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmtRp(r.sesudah)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.green, fontWeight: 700 }}>+{fmtRp(r.sesudah - r.sebelum)}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: COLORS.gray600, maxWidth: 280 }}>{r.alasan}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray500 }}>Revisi pagu diperbarui berdasarkan DIPA Revisi dari Kemenkeu • Data otomatis memperbarui pagu berjalan</div>
        </div>
      )}

      {/* TAB: Konfigurasi Alert */}
      {tab === "konfigurasi" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle>Parameter Ambang Batas</SectionTitle>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Threshold Peringatan (%)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: 90, fontSize: 14, fontWeight: 700 }} />
                <span style={{ fontSize: 13, color: COLORS.gray500 }}>% dari pagu berjalan</span>
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>Alert muncul jika sisa pagu ≤ {threshold}%</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Notifikasi Dikirim Ke</label>
              <input defaultValue="kadiv.keuangan@asabri.co.id" style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: "100%", fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>CC Notifikasi</label>
              <input defaultValue="staf.anggaran@asabri.co.id" style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: "100%", fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <Btn size="sm">Simpan Konfigurasi</Btn>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle>Status Pemantauan</SectionTitle>
            <div style={{ padding: 16, background: isAlert ? COLORS.redLight : COLORS.greenLight, borderRadius: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: isAlert ? COLORS.red : COLORS.green, display: "flex", alignItems: "center", gap: 8 }}>
                {isAlert ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                {isAlert ? "ALERT — Sisa pagu di bawah threshold" : "AMAN — Sisa pagu di atas threshold"}
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 6 }}>Sisa saat ini: <strong>{pctSisa}%</strong> • Threshold: <strong>{threshold}%</strong></div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, marginBottom: 8 }}>Jenis Dapem di Bawah Threshold</div>
            {(() => {
              const warnList = jenisDapem.filter(j => { const t = jenisTotal(j); return t.pagu > 0 && (t.sisa / t.pagu) * 100 <= threshold; });
              return warnList.length === 0 ? (
                <div style={{ padding: 14, background: COLORS.gray50, borderRadius: 8, fontSize: 12, color: COLORS.gray500 }}>Tidak ada jenis dapem yang melewati ambang batas.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {warnList.map((j, i) => { const t = jenisTotal(j); return (
                    <div key={i} style={{ padding: "10px 14px", background: COLORS.redLight, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.red }}>{j.nama}</span>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: COLORS.gray700 }}>Sisa {fmtRp(t.sisa)} ({((t.sisa / t.pagu) * 100).toFixed(1)}%)</span>
                    </div>
                  ); })}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

const RekonBPJS = () => {
  const [filterBulan, setFilterBulan] = useState("Juni 2026");
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [activeTab, setActiveTab] = useState("rekap");
  const [searchPeserta, setSearchPeserta] = useState("");
  const [preview, setPreview] = useState(null);

  const fmt = n => `Rp ${Math.abs(n).toLocaleString("id-ID")}`;

  const rekapData = [
    { kelompok: "TNI", targetRekap3: 22300000000, realisasi: 22300000000 },
    { kelompok: "POLRI", targetRekap3: 7800000000, realisasi: 7560000000 },
    { kelompok: "ASN Kemhan", targetRekap3: 18500000000, realisasi: 18720000000 },
    { kelompok: "PPPK", targetRekap3: 1200000000, realisasi: 1200000000 },
  ];
  const filteredRekap = filterKelompok === "Semua" ? rekapData : rekapData.filter(r => r.kelompok === filterKelompok);
  const totalTarget = filteredRekap.reduce((a, r) => a + r.targetRekap3, 0);
  const totalRealisasi = filteredRekap.reduce((a, r) => a + r.realisasi, 0);
  const totalKompensasi = totalRealisasi - totalTarget;

  const detailPeserta = [
    { nrp: "198701234", nama: "Serka Ahmad Fauzi", kelompok: "TNI", unor: "Kodam Jaya", target: 185000, realisasi: 185000, kompensasi: 0, alasan: "—" },
    { nrp: "199205678", nama: "Briptu Rina Marlina", kelompok: "POLRI", unor: "Polda Metro Jaya", target: 162000, realisasi: 158000, kompensasi: -4000, alasan: "Potongan kurang — data tanggungan belum update" },
    { nrp: "198604321", nama: "Penata Tk.I Siti Nurhaliza", kelompok: "ASN Kemhan", unor: "Ditjen Renhan", target: 210000, realisasi: 225000, kompensasi: 15000, alasan: "Lebih potong — kenaikan gaji belum tersinkron di Rekap III" },
    { nrp: "197803456", nama: "Letkol Bambang Suharto", kelompok: "TNI", unor: "Kodam IM", target: 320000, realisasi: 320000, kompensasi: 0, alasan: "—" },
    { nrp: "198512345", nama: "AKP Dedi Kurniawan", kelompok: "POLRI", unor: "Polda Jabar", target: 245000, realisasi: 230000, kompensasi: -15000, alasan: "Kurang potong — perubahan kelas rawat" },
    { nrp: "202101234", nama: "Sari Indah Permata", kelompok: "PPPK", unor: "Ditjen Renhan", target: 148000, realisasi: 148000, kompensasi: 0, alasan: "—" },
    { nrp: "198211111", nama: "Pembina Utama Dr. Ratna", kelompok: "ASN Kemhan", unor: "Itjen Kemhan", target: 380000, realisasi: 395000, kompensasi: 15000, alasan: "Lebih potong — tunjangan keluarga belum disesuaikan" },
    { nrp: "198802345", nama: "Bripka Anwar Ibrahim", kelompok: "POLRI", unor: "Polda Jateng", target: 195000, realisasi: 190000, kompensasi: -5000, alasan: "Kurang potong — tanggungan anak bertambah" },
  ];

  const filteredPeserta = detailPeserta.filter(p => {
    if (filterKelompok !== "Semua" && p.kelompok !== filterKelompok) return false;
    if (searchPeserta && !p.nama.toLowerCase().includes(searchPeserta.toLowerCase()) && !p.nrp.includes(searchPeserta)) return false;
    return true;
  });
  const pesertaKompensasi = filteredPeserta.filter(p => p.kompensasi !== 0);

  const setoranLog = [
    { bulan: "April 2026", dapem: "Dapem Induk", peserta: "98.200", setoran: 41230000000, ntpn: "1234567890ABCDEF", tgl: "10 Apr 2026", status: "Tervalidasi" },
    { bulan: "April 2026", dapem: "Dapem Susulan", peserta: "15.300", setoran: 3420000000, ntpn: "ABCDEF1234567890", tgl: "12 Apr 2026", status: "Tervalidasi" },
    { bulan: "Mei 2026", dapem: "Dapem Induk", peserta: "98.450", setoran: 41580000000, ntpn: "5678901234ABCDEF", tgl: "09 Mei 2026", status: "Tervalidasi" },
    { bulan: "Juni 2026", dapem: "Dapem Induk", peserta: "98.600", setoran: 41890000000, ntpn: "ABCD901234567890", tgl: "10 Jun 2026", status: "Tervalidasi" },
    { bulan: "Juni 2026", dapem: "Non-Dapem", peserta: "14.500", setoran: 2870000000, ntpn: "CDEF567890123456", tgl: "11 Jun 2026", status: "Pending" },
  ];

  const filteredSetoran = filterBulan === "Semua" ? setoranLog : setoranLog.filter(s => s.bulan === filterBulan);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Info distribusi */}
      <div style={{ background: "#E3F2FD", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
        <span style={{ color: COLORS.gray700 }}>Dokumen rekonsiliasi ini didistribusikan ke <strong>BPJS Kesehatan</strong> dan <strong>DJPb (Direktorat Jenderal Perbendaharaan)</strong></span>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Laporan Rekonsiliasi BPJS", subtitle: "Periode " + filterBulan + " — Format Excel", type: "table", fileName: "Rekonsiliasi_BPJS_" + filterBulan.replace(" ", "_") + ".xlsx", content: { columns: ["Kelompok", "Target Rekap III", "Realisasi", "Kompensasi"], rows: filteredRekap.map(r => [r.kelompok, fmt(r.targetRekap3), fmt(r.realisasi), (r.realisasi - r.targetRekap3 >= 0 ? "+" : "-") + " " + fmt(r.realisasi - r.targetRekap3)]), totalRows: filteredRekap.length + 1 } })}>Ekspor Excel</Btn>
          <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Laporan Rekonsiliasi BPJS", subtitle: "Periode " + filterBulan + " — Format PDF", type: "table", fileName: "Rekonsiliasi_BPJS_" + filterBulan.replace(" ", "_") + ".pdf", content: { columns: ["Kelompok", "Target Rekap III", "Realisasi", "Kompensasi"], rows: filteredRekap.map(r => [r.kelompok, fmt(r.targetRekap3), fmt(r.realisasi), (r.realisasi - r.targetRekap3 >= 0 ? "+" : "-") + " " + fmt(r.realisasi - r.targetRekap3)]), totalRows: filteredRekap.length + 1 } })}>Ekspor PDF</Btn>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Cross size={IC} />} label="Target Rekap III BPJS" value={`Rp ${(totalTarget / 1e9).toFixed(1)} M`} sub={"Potongan seharusnya · " + filterBulan} color={COLORS.blue} />
        <StatCard icon={<Banknote size={IC} />} label="Realisasi Setoran" value={`Rp ${(totalRealisasi / 1e9).toFixed(1)} M`} sub="Disetor ke Kas Negara" color={COLORS.green} />
        <StatCard icon={<AlertTriangle size={IC} />} label="Kompensasi (+/-)" value={(totalKompensasi >= 0 ? "+" : "-") + " " + fmt(totalKompensasi)} sub={totalKompensasi > 0 ? "Lebih setor — perlu restitusi" : totalKompensasi < 0 ? "Kurang setor — perlu tagih" : "Matched"} color={totalKompensasi === 0 ? COLORS.green : COLORS.orange} />
        <StatCard icon={<Users size={IC} />} label="Peserta Kompensasi" value={detailPeserta.filter(p => p.kompensasi !== 0).length.toString()} sub="Peserta dengan selisih" color={COLORS.red} />
      </div>

      {/* Filters */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Select label="Periode Bulan" value={filterBulan} onChange={setFilterBulan} options={["Semua", "April 2026", "Mei 2026", "Juni 2026"]} minW={140} />
        <Select label="Kelompok" value={filterKelompok} onChange={setFilterKelompok} options={["Semua", "TNI", "POLRI", "ASN Kemhan", "PPPK"]} minW={140} />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "rekap", label: "Bagian A — Rekap Per Kelompok" },
          { id: "detail", label: `Bagian B — Detail Per Peserta (${pesertaKompensasi.length} kompensasi)` },
          { id: "setoran", label: "Riwayat Setoran" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "transparent", color: activeTab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>{t.label}</button>
        ))}
      </div>

      {/* BAGIAN A — Rekap Per Kelompok Peserta */}
      {activeTab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle>Rekap Per Kelompok Peserta — {filterBulan}</SectionTitle>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["Kelompok", "Target Rekap III", "Realisasi", "Kompensasi (+/-)"].map((c, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: i >= 1 ? "right" : "left", fontWeight: 700, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}` }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredRekap.map((r, i) => {
                  const komp = r.realisasi - r.targetRekap3;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: COLORS.gray800 }}>{r.kelompok}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace" }}>{fmt(r.targetRekap3)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace" }}>{fmt(r.realisasi)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: komp === 0 ? COLORS.green : komp > 0 ? COLORS.red : COLORS.orange }}>
                        {komp === 0 ? "Rp 0" : (komp > 0 ? "+ " : "- ") + fmt(komp)}
                        {komp !== 0 && <span style={{ marginLeft: 8 }}><Badge color={komp > 0 ? "red" : "orange"}>{komp > 0 ? "Lebih Setor" : "Kurang Setor"}</Badge></span>}
                      </td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr style={{ background: COLORS.blueDark }}>
                  <td style={{ padding: "12px 16px", fontWeight: 800, color: COLORS.white }}>TOTAL</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.white }}>{fmt(totalTarget)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.white }}>{fmt(totalRealisasi)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.accent }}>
                    {totalKompensasi === 0 ? "Rp 0" : (totalKompensasi > 0 ? "+ " : "- ") + fmt(totalKompensasi)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {totalKompensasi !== 0 && (
            <div style={{ marginTop: 12, background: totalKompensasi > 0 ? COLORS.redLight : COLORS.orangeLight, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <AlertTriangle size={16} color={totalKompensasi > 0 ? COLORS.red : COLORS.orange} />
              <span style={{ color: totalKompensasi > 0 ? COLORS.red : COLORS.orange }}>
                {totalKompensasi > 0
                  ? `Terdapat kelebihan setor sebesar ${fmt(totalKompensasi)}. Perlu dilakukan restitusi ke Kas Negara atau kompensasi di periode berikutnya.`
                  : `Terdapat kekurangan setor sebesar ${fmt(totalKompensasi)}. Perlu dilakukan penagihan tambahan ke Kemenkeu.`
                }
              </span>
            </div>
          )}
        </div>
      )}

      {/* BAGIAN B — Detail Per Peserta (Lampiran) */}
      {activeTab === "detail" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Lampiran Detail Peserta", subtitle: "Nominatif peserta dengan kompensasi", type: "table", fileName: "Lampiran_Kompensasi_BPJS.xlsx", content: { columns: ["NRP", "Nama", "Kelompok", "Target", "Realisasi", "Kompensasi"], rows: pesertaKompensasi.map(p => [p.nrp, p.nama, p.kelompok, fmt(p.target), fmt(p.realisasi), (p.kompensasi >= 0 ? "+" : "-") + " " + fmt(p.kompensasi)]), totalRows: pesertaKompensasi.length } })}>Ekspor Lampiran</Btn>}>
            Detail Per Peserta — Nominatif Kompensasi Lebih/Kurang
          </SectionTitle>
          <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#F57F17", display: "flex", gap: 8 }}>
            <AlertTriangle size={14} />
            <span>Lampiran ini berisi daftar peserta yang memiliki kompensasi lebih/kurang beserta alasannya. Didistribusikan ke BPJS Kesehatan dan DJPb sebagai dokumen rekonsiliasi.</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari Peserta</label><SearchInput value={searchPeserta} onChange={setSearchPeserta} placeholder="NRP / Nama peserta..." /></div>
            <Btn variant={searchPeserta || filterKelompok !== "Semua" ? "outline" : "ghost"} size="sm" onClick={() => { setSearchPeserta(""); setFilterKelompok("Semua"); }}>Reset Filter</Btn>
          </div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filteredPeserta.length} peserta ({pesertaKompensasi.length} dengan kompensasi)</div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["NRP/NIP", "Nama Peserta", "Kelompok", "Unor", "Target Rekap III", "Realisasi Potong", "Kompensasi (+/-)", "Alasan"].map((c, i) => (
                  <th key={i} style={{ padding: "8px 12px", textAlign: i >= 4 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{filteredPeserta.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: p.kompensasi !== 0 ? (p.kompensasi > 0 ? COLORS.redLight : COLORS.yellowLight) : "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 11 }}>{p.nrp}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 500, color: COLORS.gray800 }}>{p.nama}</td>
                  <td style={{ padding: "8px 12px" }}><Badge color={p.kelompok === "TNI" ? "green" : p.kelompok === "POLRI" ? "blue" : p.kelompok === "PPPK" ? "yellow" : "orange"}>{p.kelompok}</Badge></td>
                  <td style={{ padding: "8px 12px", fontSize: 11, color: COLORS.gray600 }}>{p.unor}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.target)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.realisasi)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: p.kompensasi === 0 ? COLORS.green : p.kompensasi > 0 ? COLORS.red : COLORS.orange }}>
                    {p.kompensasi === 0 ? "—" : (p.kompensasi > 0 ? "+" : "-") + " " + fmt(p.kompensasi)}
                  </td>
                  <td style={{ padding: "8px 12px", fontSize: 11, color: COLORS.gray600, maxWidth: 220 }}>{p.alasan}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Riwayat Setoran ke Kas Negara */}
      {activeTab === "setoran" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle>Riwayat Setoran Iuran BPJS Kesehatan ke Kas Negara</SectionTitle>
          {filteredSetoran.length === 0 ? <NoData /> : (
            <Table columns={["Bulan", "Jenis Dapem", "Jumlah Peserta", "Jumlah Setoran", "NTPN", "Tanggal Setor", "Status"]}
              data={filteredSetoran.map(s => [s.bulan, s.dapem, s.peserta, fmt(s.setoran), <span style={{ fontFamily: "monospace", fontSize: 11 }}>{s.ntpn}</span>, s.tgl, <Badge color={s.status === "Tervalidasi" ? "green" : "yellow"}>{s.status}</Badge>])} />
          )}
        </div>
      )}
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

// ===== TAGIHAN IMBAL JASA MITRA BAYAR =====
const TagihanImbalJasa = () => {
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [searchTagihan, setSearchTagihan] = useState("");
  const [detailTagihan, setDetailTagihan] = useState(null);
  const [preview, setPreview] = useState(null);

  const allTagihan = [
    { no: "IJ-2606-001", mitra: "BRI", program: "THT/Pensiun", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "15 Jun 2026", ppn: 128000000, netto: 1152000000, totalTagihan: 1280000000, hariTerlambat: 0, denda: 0, status: "Dibayar" },
    { no: "IJ-2606-002", mitra: "BRI", program: "JKK", jenis: "Autentikasi Digital", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "14 Jun 2026", ppn: 14000000, netto: 126000000, totalTagihan: 140000000, hariTerlambat: 0, denda: 0, status: "Dibayar" },
    { no: "IJ-2606-003", mitra: "BNI", program: "THT/Pensiun", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "23 Jun 2026", ppn: 98000000, netto: 882000000, totalTagihan: 980000000, hariTerlambat: 6, denda: 5880000, status: "Terlambat" },
    { no: "IJ-2606-004", mitra: "Mandiri", program: "JKm", jenis: "Penyaluran Santunan", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "16 Jun 2026", ppn: 156000000, netto: 1404000000, totalTagihan: 1560000000, hariTerlambat: 0, denda: 0, status: "Dibayar" },
    { no: "IJ-2606-005", mitra: "BTN", program: "THT/Pensiun", jenis: "Penyaluran Pensiun", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: null, ppn: 22000000, netto: 198000000, totalTagihan: 220000000, hariTerlambat: 19, denda: 6820000, status: "Belum Dibayar" },
    { no: "IJ-2606-006", mitra: "Mandiri", program: "JKK", jenis: "Autentikasi Digital", periode: "Jun 2026", tglTerbit: "02 Jun 2026", jatuhTempo: "17 Jun 2026", tglBayar: "20 Jun 2026", ppn: 8000000, netto: 72000000, totalTagihan: 80000000, hariTerlambat: 3, denda: 1720000, status: "Terlambat" },
  ];

  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  const programColor = p => p === "THT/Pensiun" ? "blue" : p === "JKK" ? "orange" : "green";
  const tagihDenda = (t) => setPreview({
    title: "Surat Tagihan Denda Keterlambatan",
    subtitle: `${t.mitra} — ${t.no} • ${t.hariTerlambat} hari terlambat`,
    type: "surat",
    fileName: `Tagihan_Denda_${t.no}.pdf`,
    content: {
      noSurat: `${t.no.replace(/^IJ/, "DENDA")}`,
      tujuan: `Mitra Bayar — ${t.mitra}`,
      periode: `${t.jenis} (${t.program}) — ${t.periode}`,
      cutoff: t.jatuhTempo,
      tanggal: "07 Jul 2026",
      items: [
        { jenis: "Nilai Netto Tagihan", peserta: "—", nominal: fmt(t.netto) },
        { jenis: `Hari keterlambatan (jatuh tempo ${t.jatuhTempo})`, peserta: `${t.hariTerlambat} hari`, nominal: "—" },
        { jenis: "Denda (Netto × 5,75% × hari ÷ 365)", peserta: "—", nominal: fmt(t.denda) },
      ],
    },
  });
  const filtered = allTagihan.filter(t => {
    if (filterMitra !== "Semua" && t.mitra !== filterMitra) return false;
    if (filterProgram !== "Semua" && t.program !== filterProgram) return false;
    if (searchTagihan && !t.no.toLowerCase().includes(searchTagihan.toLowerCase()) && !t.mitra.toLowerCase().includes(searchTagihan.toLowerCase())) return false;
    return true;
  });

  const totalTagihanAll = allTagihan.reduce((a, t) => a + t.totalTagihan, 0);
  const totalDenda = allTagihan.reduce((a, t) => a + t.denda, 0);
  const terlambatCount = allTagihan.filter(t => t.hariTerlambat > 0).length;
  const avgTerlambat = terlambatCount > 0 ? Math.round(allTagihan.filter(t => t.hariTerlambat > 0).reduce((a, t) => a + t.hariTerlambat, 0) / terlambatCount) : 0;

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />
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
                    ["Program", t.program],
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
                  <Btn variant="outline" size="sm" onClick={() => { setDetailTagihan(null); setPreview({ title: "Preview Unduh Tagihan " + t.no, subtitle: t.mitra + " - " + t.jenis + " - " + t.periode, type: "table", fileName: "Tagihan_" + t.no + ".pdf", content: { columns: ["Item", "Nilai"], rows: [["Nilai Netto", fmt(t.netto)], ["PPN", fmt(t.ppn)], ["Total Tagihan", fmt(t.totalTagihan)], ["Denda", fmt(t.denda)], ["Grand Total", fmt(t.totalTagihan + t.denda)]], totalRows: 5 } }); }}>Unduh Tagihan</Btn>
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
          <Btn variant="outline" onClick={() => setPreview({ title: "Preview Ekspor Tagihan Imbal Jasa", subtitle: "Data seluruh tagihan imbal jasa", type: "table", fileName: "Tagihan_Imbal_Jasa.xlsx", content: { columns: ["No.", "Mitra", "Program", "Jenis", "Periode", "Total Tagihan", "Status"], rows: allTagihan.slice(0,5).map(t => [t.no, t.mitra, t.program, t.jenis, t.periode, fmt(t.totalTagihan), t.status]), totalRows: allTagihan.length } })}>Ekspor Excel</Btn>
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
          <Select label="Program" value={filterProgram} onChange={setFilterProgram} options={["Semua", "THT/Pensiun", "JKK", "JKm"]} minW={140} />
          <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchTagihan} onChange={setSearchTagihan} placeholder="Cari no. tagihan atau mitra bayar..." minW={240} /></div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allTagihan.length} tagihan</div>
        {filtered.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["No. Tagihan", "Mitra Bayar", "Program", "Jenis Imbal Jasa", "Periode", "Tgl. Terbit", "Jatuh Tempo", "Tgl. Dibayar", "Status", ""].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{filtered.map((t, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : COLORS.gray50}
                  onMouseLeave={e => e.currentTarget.style.background = t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : "transparent"}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 500 }}>{t.no}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{t.mitra}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color={programColor(t.program)}>{t.program}</Badge></td>
                  <td style={{ padding: "10px 14px" }}>{t.jenis}</td>
                  <td style={{ padding: "10px 14px" }}>{t.periode}</td>
                  <td style={{ padding: "10px 14px" }}>{t.tglTerbit}</td>
                  <td style={{ padding: "10px 14px" }}>{t.jatuhTempo}</td>
                  <td style={{ padding: "10px 14px" }}>{t.tglBayar || <span style={{ color: COLORS.gray400 }}>—</span>}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color={t.status === "Dibayar" ? "green" : t.status === "Terlambat" ? "orange" : "red"}>{t.status}</Badge></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="outline" onClick={() => setDetailTagihan(t)}>Detail</Btn>
                      {t.hariTerlambat > 0 && <Btn size="sm" variant="danger" onClick={() => tagihDenda(t)}><Bell size={13} /> Tagih Denda</Btn>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== DAFTAR DAPEM & PEMBAYARAN PENSIUN (per MAK, terhubung Pagu DIPA) =====
const PembayaranPensiun = () => {
  const [tab, setTab] = useState("dapem"); // dapem | nondapem
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [selected, setSelected] = useState({});
  const [preview, setPreview] = useState(null);
  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  const satkerColor = s => s === "TNI" ? "green" : s === "POLRI" ? "blue" : s === "PPPK" ? "yellow" : "orange";

  // ==== DAPEM (PENSIUN) — data peserta per MAK ====
  const dapemRows = [
    { id: "D1", nrp: "198701234", nama: "Purn. Kol. Ahmad Rifai", satker: "TNI", unor: "Kodam Jaya", jenis: "Dapem Induk", mak: "511111", makNama: "Belanja Pensiun Pokok", nominal: 4850000 },
    { id: "D2", nrp: "198805678", nama: "Purn. Lettu Budi K.", satker: "TNI", unor: "Mabes TNI", jenis: "Dapem Induk", mak: "511111", makNama: "Belanja Pensiun Pokok", nominal: 3200000 },
    { id: "D3", nrp: "199012345", nama: "Purn. AKP Citra D.", satker: "POLRI", unor: "Polda Metro Jaya", jenis: "Dapem Induk", mak: "511111", makNama: "Belanja Pensiun Pokok", nominal: 5100000 },
    { id: "D4", nrp: "198604321", nama: "Ny. Ratna S. (Warakawuri)", satker: "POLRI", unor: "Polda Jabar", jenis: "Dapem Induk", mak: "511119", makNama: "Belanja Tunjangan Keluarga", nominal: 1250000 },
    { id: "D5", nrp: "199205678", nama: "Purn. Penata Sri W.", satker: "ASN Kemenhan", unor: "Ditjen Strahan", jenis: "Dapem Induk", mak: "511121", makNama: "Belanja Tunjangan Beras", nominal: 720000 },
    { id: "D6", nrp: "197506789", nama: "Purn. Serma Agus S.", satker: "TNI", unor: "Kodam V/Brawijaya", jenis: "Dapem Susulan", mak: "511112", makNama: "Belanja Pensiun Susulan", nominal: 6400000 },
    { id: "D7", nrp: "196904111", nama: "Purn. Kompol Hadi P.", satker: "POLRI", unor: "Polda Jateng", jenis: "Dapem Susulan", mak: "511112", makNama: "Belanja Pensiun Susulan", nominal: 3900000 },
  ];

  // ==== NON-DAPEM (KLAIM) — data klaim per MAK ====
  const klaimRows = [
    { id: "K1", nrp: "KLM/2026/07/018", nama: "Purn. Kapten Dedi M.", satker: "TNI", unor: "Kodam Jaya", jenis: "Nilai Tunai THT", mak: "594211", makNama: "Belanja Klaim THT", nominal: 42500000, status: "Terverifikasi" },
    { id: "K2", nrp: "KLM/2026/07/021", nama: "Ny. Sulastri (Ahli Waris)", satker: "POLRI", unor: "Polda Metro Jaya", jenis: "Santunan JKm", mak: "594213", makNama: "Belanja Klaim JKm", nominal: 85000000, status: "Terverifikasi" },
    { id: "K3", nrp: "KLM/2026/07/025", nama: "Serda Bima Prakoso", satker: "TNI", unor: "Lanud Halim", jenis: "Santunan JKK", mak: "594212", makNama: "Belanja Klaim JKK", nominal: 18500000, status: "Menunggu Verifikasi" },
    { id: "K4", nrp: "KLM/2026/07/029", nama: "Purn. AKBP Rudi H.", satker: "POLRI", unor: "Polda Jabar", jenis: "Nilai Tunai THT", mak: "594211", makNama: "Belanja Klaim THT", nominal: 56000000, status: "Terverifikasi" },
    { id: "K5", nrp: "KLM/2026/07/033", nama: "Purn. Pembina Yanti K.", satker: "ASN Kemenhan", unor: "Setjen Kemhan", jenis: "Biaya Pemakaman", mak: "594214", makNama: "Belanja Klaim Pemakaman", nominal: 12000000, status: "Terverifikasi" },
  ];

  const isDapem = tab === "dapem";
  const curAll = isDapem ? dapemRows : klaimRows;
  const curRows = filterSatker === "Semua" ? curAll : curAll.filter(r => r.satker === filterSatker);
  const billable = r => isDapem || r.status === "Terverifikasi"; // klaim harus terverifikasi

  // Kelompokkan per MAK
  const groups = [];
  curRows.forEach(r => {
    let g = groups.find(x => x.mak === r.mak);
    if (!g) { g = { mak: r.mak, makNama: r.makNama, rows: [], total: 0 }; groups.push(g); }
    g.rows.push(r); g.total += r.nominal;
  });

  // Seleksi
  const toggleRow = id => setSelected(s => ({ ...s, [id]: !s[id] }));
  const selectedRows = curRows.filter(r => selected[r.id] && billable(r));
  const selTotal = selectedRows.reduce((a, r) => a + r.nominal, 0);
  const allBillable = curRows.filter(billable);
  const allSelected = allBillable.length > 0 && allBillable.every(r => selected[r.id]);
  const toggleAll = () => {
    setSelected(s => { const n = { ...s }; allBillable.forEach(r => { n[r.id] = !allSelected; }); return n; });
  };
  const switchTab = t => { setTab(t); setSelected({}); setFilterSatker("Semua"); };

  // Ringkasan Pagu DIPA (sumber: Monitoring Pagu DIPA — dalam juta)
  const paguRef = isDapem
    ? { label: "Dapem Induk + Susulan", pagu: 5370, realisasi: 3595 }
    : { label: "Non-Dapem (Klaim/Harian)", pagu: 360, realisasi: 288 };
  const sisaPaguM = paguRef.pagu - paguRef.realisasi;

  const totalDapem = dapemRows.reduce((a, r) => a + r.nominal, 0);
  const totalKlaim = klaimRows.reduce((a, r) => a + r.nominal, 0);

  const buatTagihan = () => {
    if (!selectedRows.length) return;
    const byMak = {};
    selectedRows.forEach(r => { (byMak[r.mak] = byMak[r.mak] || { makNama: r.makNama, mak: r.mak, count: 0, sum: 0 }); byMak[r.mak].count++; byMak[r.mak].sum += r.nominal; });
    const items = Object.values(byMak).map(g => ({ jenis: `${g.makNama} (MAK ${g.mak})`, peserta: g.count.toString(), nominal: fmt(g.sum) }));
    setPreview({
      title: isDapem ? "Buat Tagihan Pembayaran — DAPEM Pensiun" : "Buat Tagihan Pembayaran — Non-Dapem (Klaim)",
      subtitle: `${selectedRows.length} item • Total ${fmt(selTotal)} • diterbitkan Divisi Keuangan`,
      type: "surat",
      fileName: `Tagihan_${isDapem ? "DAPEM_Pensiun" : "NonDapem_Klaim"}_Juli_2026.pdf`,
      content: { noSurat: `SPP/${isDapem ? "DAPEM" : "NONDAPEM"}/VII/2026`, tujuan: "Kuasa Pengguna Anggaran — DJPb Kementerian Keuangan", periode: "Juli 2026", cutoff: "06 Jul 2026", tanggal: "07 Jul 2026", items },
    });
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Ringkasan */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Wallet size={IC} />} label="Total DAPEM (Pensiun)" value={`Rp ${(totalDapem / 1e6).toFixed(1)} Jt`} sub={`${dapemRows.length} peserta • Juli 2026`} color={COLORS.blue} />
        <StatCard icon={<Cross size={IC} />} label="Total Non-Dapem (Klaim)" value={`Rp ${(totalKlaim / 1e6).toFixed(1)} Jt`} sub={`${klaimRows.length} klaim diajukan`} color={COLORS.orange} />
        <StatCard icon={<TrendingDown size={IC} />} label={`Sisa Pagu — ${paguRef.label}`} value={`Rp ${sisaPaguM} M`} sub="Sumber: Monitoring Pagu DIPA" color={COLORS.green} />
        <StatCard icon={<FileText size={IC} />} label="Dipilih untuk Tagihan" value={selectedRows.length ? `Rp ${(selTotal / 1e6).toFixed(1)} Jt` : "—"} sub={`${selectedRows.length} item dipilih`} color={selectedRows.length ? COLORS.blueDark : COLORS.gray400} />
      </div>

      {/* Referensi pagu DIPA */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "14px 20px", border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: COLORS.gray600 }}><TrendingDown size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />Realisasi Pagu DIPA — <strong>{paguRef.label}</strong> (terhubung ke Monitoring Pagu DIPA)</span>
          <span style={{ color: COLORS.gray500 }}>Realisasi Rp {paguRef.realisasi} M / Pagu Rp {paguRef.pagu} M</span>
        </div>
        <ProgressBar value={paguRef.realisasi} max={paguRef.pagu} color={sisaPaguM / paguRef.pagu <= 0.15 ? COLORS.red : COLORS.blue} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ k: "dapem", t: "Dapem (Pensiun)" }, { k: "nondapem", t: "Non-Dapem (Klaim)" }].map(x => (
          <button key={x.k} onClick={() => switchTab(x.k)} style={{ padding: "8px 18px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === x.k ? COLORS.blue : COLORS.gray200, color: tab === x.k ? COLORS.white : COLORS.gray700 }}>{x.t}</button>
        ))}
      </div>

      {/* Daftar DAPEM per MAK */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle action={
          <Btn size="sm" onClick={buatTagihan} variant={selectedRows.length ? "primary" : "ghost"}>
            <FilePlus size={14} /> Buat Tagihan{selectedRows.length ? ` (${selectedRows.length} • ${fmt(selTotal)})` : ""}
          </Btn>
        }>{isDapem ? "Daftar DAPEM Pensiun per MAK" : "Daftar Non-Dapem (Klaim) per MAK"}</SectionTitle>

        <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" }}>
          <Select label="Satker" value={filterSatker} onChange={v => setFilterSatker(v)} options={["Semua", "TNI", "POLRI", "ASN Kemenhan", "PPPK"]} minW={150} />
          <div style={{ fontSize: 12, color: COLORS.gray500 }}>
            {isDapem ? "Pilih baris peserta lalu Buat Tagihan (SPP) untuk diteruskan Divisi Keuangan ke DJPb." : "Hanya klaim berstatus Terverifikasi yang dapat ditagihkan."}
          </div>
        </div>

        {groups.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                <th style={{ padding: "10px 14px", textAlign: "center", borderBottom: `1px solid ${COLORS.gray300}`, width: 36 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </th>
                {[isDapem ? "NRP" : "No. Klaim", "Nama Peserta", "Satker", isDapem ? "Jenis Dapem" : "Jenis Klaim", isDapem ? "" : "Status", "Nominal"].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: c === "Nominal" ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>
                {groups.flatMap(g => {
                  const rows = [
                    <tr key={"h-" + g.mak} style={{ background: COLORS.gray50 }}>
                      <td colSpan={7} style={{ padding: "8px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray800 }}><Hash size={12} style={{ verticalAlign: "middle" }} /> MAK {g.mak} — {g.makNama} <span style={{ color: COLORS.gray400, fontWeight: 400 }}>({g.rows.length} {isDapem ? "peserta" : "klaim"})</span></span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, fontFamily: "monospace" }}>{fmt(g.total)}</span>
                        </div>
                      </td>
                    </tr>
                  ];
                  g.rows.forEach(r => {
                    const canBill = billable(r);
                    rows.push(
                      <tr key={r.id} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: selected[r.id] ? "#E3F2FD55" : "transparent" }} onMouseEnter={e => { if (!selected[r.id]) e.currentTarget.style.background = COLORS.gray50; }} onMouseLeave={e => { if (!selected[r.id]) e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "9px 14px", textAlign: "center" }}>
                          <input type="checkbox" disabled={!canBill} checked={!!selected[r.id]} onChange={() => toggleRow(r.id)} style={{ cursor: canBill ? "pointer" : "not-allowed" }} />
                        </td>
                        <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 12, color: COLORS.gray700 }}>{r.nrp}</td>
                        <td style={{ padding: "9px 14px" }}><div style={{ fontWeight: 600, color: COLORS.gray800 }}>{r.nama}</div><div style={{ fontSize: 11, color: COLORS.gray400 }}>{r.unor}</div></td>
                        <td style={{ padding: "9px 14px" }}><Badge color={satkerColor(r.satker)}>{r.satker}</Badge></td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: COLORS.gray600 }}>{r.jenis}</td>
                        {!isDapem && <td style={{ padding: "9px 14px" }}><Badge color={r.status === "Terverifikasi" ? "green" : "orange"}>{r.status}</Badge></td>}
                        {isDapem && <td />}
                        <td style={{ padding: "9px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(r.nominal)}</td>
                      </tr>
                    );
                  });
                  return rows;
                })}
                <tr style={{ background: COLORS.gray100, fontWeight: 700 }}>
                  <td />
                  <td colSpan={isDapem ? 4 : 4} style={{ padding: "10px 14px" }}>TOTAL {isDapem ? "DAPEM" : "NON-DAPEM"} {filterSatker !== "Semua" ? `— ${filterSatker}` : ""}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{fmt(curRows.reduce((a, r) => a + r.nominal, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 10, fontSize: 12, color: COLORS.gray500 }}>Menampilkan {curRows.length} {isDapem ? "peserta pensiun" : "klaim"} dalam {groups.length} MAK. Tagihan yang dibuat akan mengurangi sisa pagu DIPA pada jenis terkait.</div>
      </div>
    </div>
  );
};

// ============ MAIN APP ============

// ===== MONITORING POLIS TASPEN LIFE (TL-F01..F07) =====
const TaspenPolis = () => {
  const [tab, setTab] = useState("dashboard");
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterCabang, setFilterCabang] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [baState, setBaState] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedSP, setSelectedSP] = useState({});

  const fmt = n => `Rp ${n.toLocaleString("id-ID")}`;
  const progColor = p => p === "TDS (THT)" ? "blue" : p === "Proteksi Beasiswa JKK" ? "orange" : "green";
  const progShort = p => p === "TDS (THT)" ? "TDS" : p === "Proteksi Beasiswa JKK" ? "JKK" : "JKm";

  // Data polis per individu (FR-TL-02, format Tabel 5 BRS)
  const polis = [
    { id: "P1", nik: "3201010101850001", ktpa: "KTPA-0012845", noPolis: "TL-TDS-2026-00145", noSP: "SP/TL/2026/07/001", cabang: "KC Jakarta", program: "TDS (THT)", tglAju: "05 Jun 2026", tglLahir: "01 Jan 1985", nama: "Serka Ahmad Fauzi", premi: 450000, status: "Sudah Dibayar", nikValid: true },
    { id: "P2", nik: "3175020202920002", ktpa: "KTPA-0012846", noPolis: "TL-TDS-2026-00146", noSP: "SP/TL/2026/07/001", cabang: "KC Jakarta", program: "TDS (THT)", tglAju: "05 Jun 2026", tglLahir: "02 Feb 1992", nama: "Briptu Rina Marlina", premi: 380000, status: "Sudah Dibayar", nikValid: true },
    { id: "P3", nik: "3674030303780003", ktpa: "KTPA-0012847", noPolis: "TL-JKK-2026-00089", noSP: "SP/TL/2026/07/002", cabang: "KC Bandung", program: "Proteksi Beasiswa JKK", tglAju: "08 Jun 2026", tglLahir: "03 Mar 1978", nama: "Letkol Bambang Suharto", premi: 620000, status: "Dalam Proses", nikValid: true },
    { id: "P4", nik: "35780404048600", ktpa: "KTPA-0012848", noPolis: "TL-JKK-2026-00090", noSP: "—", cabang: "KC Surabaya", program: "Proteksi Beasiswa JKK", tglAju: "10 Jun 2026", tglLahir: "04 Apr 1986", nama: "Penata Tk.I Siti Nurhaliza", premi: 540000, status: "Belum Dibayar", nikValid: false },
    { id: "P5", nik: "3273050505850005", ktpa: "KTPA-0012849", noPolis: "TL-JKM-2026-00034", noSP: "SP/TL/2026/07/003", cabang: "KC Bandung", program: "Proteksi Beasiswa JKm", tglAju: "12 Jun 2026", tglLahir: "05 Mei 1985", nama: "AKP Dedi Kurniawan", premi: 310000, status: "Sudah Dibayar", nikValid: true },
    { id: "P6", nik: "", ktpa: "KTPA-0012850", noPolis: "TL-TDS-2026-00147", noSP: "—", cabang: "KC Medan", program: "TDS (THT)", tglAju: "14 Jun 2026", tglLahir: "06 Jun 1990", nama: "Peltu Hendra Wijaya", premi: 420000, status: "Belum Dibayar", nikValid: false },
    { id: "P7", nik: "3171070707820007", ktpa: "KTPA-0012851", noPolis: "TL-JKM-2026-00035", noSP: "SP/TL/2026/07/003", cabang: "KC Jakarta", program: "Proteksi Beasiswa JKm", tglAju: "15 Jun 2026", tglLahir: "07 Jul 1982", nama: "Pembina Utama Dr. Ratna", premi: 290000, status: "Sudah Dibayar", nikValid: true },
    { id: "P8", nik: "3578090909880009", ktpa: "KTPA-0012852", noPolis: "TL-TDS-2026-00148", noSP: "—", cabang: "KC Surabaya", program: "TDS (THT)", tglAju: "18 Jun 2026", tglLahir: "09 Sep 1988", nama: "Bripka Anwar Ibrahim", premi: 465000, status: "Belum Dibayar", nikValid: true },
  ];

  const cabangList = [...new Set(polis.map(p => p.cabang))];
  const rows = polis.filter(p => {
    if (filterProgram !== "Semua" && p.program !== filterProgram) return false;
    if (filterCabang !== "Semua" && p.cabang !== filterCabang) return false;
    if (filterStatus !== "Semua" && p.status !== filterStatus) return false;
    if (search) { const q = search.toLowerCase(); if (!p.nama.toLowerCase().includes(q) && !p.nik.includes(search) && !p.ktpa.toLowerCase().includes(q) && !p.noPolis.toLowerCase().includes(q)) return false; }
    return true;
  });

  const programs = ["TDS (THT)", "Proteksi Beasiswa JKK", "Proteksi Beasiswa JKm"];
  const stat = pr => { const g = polis.filter(p => p.program === pr); return { n: g.length, premi: g.reduce((a, p) => a + p.premi, 0), lunas: g.filter(p => p.status === "Sudah Dibayar").length }; };
  const invalidNik = polis.filter(p => !p.nikValid);
  const totalPremi = polis.reduce((a, p) => a + p.premi, 0);

  // SP Premi (TL-F05, F06, F07)
  const spRows = [
    { id: "S1", noSP: "SP/TL/2026/07/001", periode: "Juni 2026", program: "TDS (THT)", jml: 2, nominal: 830000, tglTerbit: "16 Jul 2026", jatuhTempo: "20 Jul 2026", status: "Disetujui", approver: "Kadiv Keuangan", bank: "Bank Mandiri", rek: "1234567890" },
    { id: "S2", noSP: "SP/TL/2026/07/002", periode: "Juni 2026", program: "Proteksi Beasiswa JKK", jml: 1, nominal: 620000, tglTerbit: "16 Jul 2026", jatuhTempo: "20 Jul 2026", status: "Menunggu Approval", approver: "Kabag Anggaran", bank: "Bank Mandiri", rek: "1234567890" },
    { id: "S3", noSP: "SP/TL/2026/07/003", periode: "Juni 2026", program: "Proteksi Beasiswa JKm", jml: 2, nominal: 600000, tglTerbit: "16 Jul 2026", jatuhTempo: "20 Jul 2026", status: "Disetujui", approver: "Kadiv Keuangan", bank: "Bank Mandiri", rek: "1234567890" },
    { id: "S4", noSP: "—", periode: "Juli 2026", program: "TDS (THT)", jml: 2, nominal: 885000, tglTerbit: "—", jatuhTempo: "20 Agu 2026", status: "Draft", approver: "—", bank: "Bank Mandiri", rek: "1234567890" },
  ];
  const spStatusColor = s => s === "Disetujui" ? "green" : s === "Menunggu Approval" ? "orange" : "gray";
  const belumBayar = polis.filter(p => p.status === "Belum Dibayar");
  const totalBelum = belumBayar.reduce((a, p) => a + p.premi, 0);
  const toggleSP = id => setSelectedSP(s => ({ ...s, [id]: !s[id] }));
  const selSP = belumBayar.filter(p => selectedSP[p.id]);
  const selSPTotal = selSP.reduce((a, p) => a + p.premi, 0);

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Alert NIK tidak valid */}
      {invalidNik.length > 0 && (
        <div style={{ background: COLORS.orangeLight, border: `1px solid #FFE0B2`, borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={18} color={COLORS.orange} />
          <div style={{ fontSize: 13 }}>
            <strong style={{ color: COLORS.orange }}>{invalidNik.length} polis dengan NIK tidak valid</strong>
            <span style={{ color: COLORS.gray700 }}> — ditandai sebagai pengecualian, tidak menghambat pembayaran premi periode berjalan (BR-TL-07).</span>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Shield size={IC} />} label="Total Polis Aktif" value={polis.length.toString()} sub="3 program Taspen Life" color={COLORS.blue} />
        <StatCard icon={<Banknote size={IC} />} label="Total Premi Periode" value={fmt(totalPremi)} sub="Juni 2026" color={COLORS.green} />
        <StatCard icon={<Clock size={IC} />} label="Belum Dibayar" value={belumBayar.length.toString()} sub={fmt(totalBelum)} color={COLORS.orange} />
        <StatCard icon={<AlertTriangle size={IC} />} label="NIK Tidak Valid" value={invalidNik.length.toString()} sub="Perlu tindak lanjut" color={COLORS.red} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[{ id: "dashboard", l: "Dashboard Program" }, { id: "peserta", l: "Daftar Peserta" }, { id: "sp", l: "SP Premi", c: spRows.filter(s => s.status !== "Disetujui").length }, { id: "ba", l: "Berita Acara" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "transparent", display: "flex", alignItems: "center", gap: 6, color: tab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>
            {t.l}
            {t.c ? <span style={{ background: tab === t.id ? "#E3F2FD" : COLORS.gray200, color: tab === t.id ? COLORS.blue : COLORS.gray700, padding: "1px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.c}</span> : null}
          </button>
        ))}
      </div>

      {/* TAB: Dashboard per Program */}
      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            {programs.map((pr, i) => {
              const s = stat(pr);
              const pct = s.n ? Math.round((s.lunas / s.n) * 100) : 0;
              return (
                <div key={i} style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Badge color={progColor(pr)}>{progShort(pr)}</Badge>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800 }}>{pr}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div><div style={{ fontSize: 11, color: COLORS.gray500 }}>Peserta</div><div style={{ fontSize: 24, fontWeight: 800, color: COLORS.gray900 }}>{s.n}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: COLORS.gray500 }}>Premi</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: COLORS.blueDark }}>{fmt(s.premi)}</div></div>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 4, display: "flex", justifyContent: "space-between" }}><span>Status pembayaran</span><span style={{ fontWeight: 700, color: pct === 100 ? COLORS.green : COLORS.orange }}>{s.lunas}/{s.n} lunas</span></div>
                  <ProgressBar value={s.lunas} max={s.n} color={pct === 100 ? COLORS.green : COLORS.orange} />
                </div>
              );
            })}
          </div>

          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle action={<span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CircleDot size={10} /> Sinkron harian dari Aplikasi Polis</span>}>Rekap Status Pembayaran Premi</SectionTitle>
            <Table columns={["Program", "Jumlah Peserta", "Total Premi", "Sudah Dibayar", "Dalam Proses", "Belum Dibayar"]}
              data={programs.map(pr => { const g = polis.filter(p => p.program === pr); return [
                <Badge color={progColor(pr)}>{pr}</Badge>, g.length, fmt(g.reduce((a, p) => a + p.premi, 0)),
                <span style={{ color: COLORS.green, fontWeight: 700 }}>{g.filter(p => p.status === "Sudah Dibayar").length}</span>,
                <span style={{ color: COLORS.orange, fontWeight: 700 }}>{g.filter(p => p.status === "Dalam Proses").length}</span>,
                <span style={{ color: COLORS.red, fontWeight: 700 }}>{g.filter(p => p.status === "Belum Dibayar").length}</span>,
              ]; })} />
            <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray500 }}>Terakhir sinkron: 22 Jul 2026, 06:00 WIB • Sumber: Aplikasi Polis Taspen Life (web service)</div>
          </div>
        </div>
      )}

      {/* TAB: Daftar Peserta (Tabel 5 BRS) */}
      {tab === "peserta" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Daftar Peserta Taspen Life", subtitle: "Format Tabel 5 BRS", type: "table", fileName: "Tabel5_Daftar_Polis_TaspenLife.xlsx", content: { columns: ["Cabang", "KTPA", "No. Polis", "Nama", "Program", "Premi"], rows: rows.slice(0, 5).map(p => [p.cabang, p.ktpa, p.noPolis, p.nama, progShort(p.program), fmt(p.premi)]), totalRows: rows.length } })}>Ekspor Excel</Btn>
            <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Daftar Peserta Taspen Life", subtitle: "Format PDF", type: "table", fileName: "Tabel5_Daftar_Polis_TaspenLife.pdf", content: { columns: ["Cabang", "KTPA", "No. Polis", "Nama", "Program", "Premi"], rows: rows.slice(0, 5).map(p => [p.cabang, p.ktpa, p.noPolis, p.nama, progShort(p.program), fmt(p.premi)]), totalRows: rows.length } })}>Ekspor PDF</Btn>
          </div>}>Daftar Peserta per Program — Tabel 5 BRS</SectionTitle>

          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <Select label="Program" value={filterProgram} onChange={setFilterProgram} options={["Semua", ...programs]} minW={190} />
            <Select label="Cabang" value={filterCabang} onChange={setFilterCabang} options={["Semua", ...cabangList]} minW={140} />
            <Select label="Status Polis" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Belum Dibayar", "Dalam Proses", "Sudah Dibayar"]} minW={150} />
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={search} onChange={setSearch} placeholder="NIK / KTPA / No. Polis / Nama..." minW={230} /></div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {rows.length} dari {polis.length} polis</div>

          {rows.length === 0 ? <NoData /> : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["Cabang", "No. KTPA", "No. Polis", "Tgl Ajuan", "No. SP", "Tgl Lahir", "Nama Pemegang Polis", "Program", "NIK", "Premi", "Status"].map((c, i) => (
                    <th key={i} style={{ padding: "8px 10px", textAlign: i === 9 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}`, whiteSpace: "nowrap", fontSize: 11 }}>{c}</th>
                  ))}
                </tr></thead>
                <tbody>{rows.map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: !p.nikValid ? COLORS.orangeLight : "transparent" }}
                    onMouseEnter={e => { if (p.nikValid) e.currentTarget.style.background = COLORS.gray50; }} onMouseLeave={e => { if (p.nikValid) e.currentTarget.style.background = "transparent"; }}>
                    <td style={{ padding: "8px 10px" }}>{p.cabang}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11 }}>{p.ktpa}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11, color: COLORS.blue, fontWeight: 500 }}>{p.noPolis}</td>
                    <td style={{ padding: "8px 10px" }}>{p.tglAju}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11, color: p.noSP === "—" ? COLORS.gray400 : COLORS.gray700 }}>{p.noSP}</td>
                    <td style={{ padding: "8px 10px" }}>{p.tglLahir}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 600, color: COLORS.gray800 }}>{p.nama}</td>
                    <td style={{ padding: "8px 10px" }}><Badge color={progColor(p.program)}>{progShort(p.program)}</Badge></td>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11 }}>
                      {p.nikValid ? p.nik : <span style={{ color: COLORS.red, fontWeight: 600 }}>{p.nik || "(kosong)"} <AlertTriangle size={11} style={{ verticalAlign: "middle" }} /></span>}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(p.premi)}</td>
                    <td style={{ padding: "8px 10px" }}><Badge color={p.status === "Sudah Dibayar" ? "green" : p.status === "Dalam Proses" ? "orange" : "gray"}>{p.status}</Badge></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {invalidNik.length > 0 && (
            <div style={{ marginTop: 12, background: COLORS.orangeLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: COLORS.orange, display: "flex", gap: 8 }}>
              <AlertTriangle size={14} />
              <span>Baris berlatar oranye = NIK tidak valid (bukan 16 digit atau kosong). Data tetap dihitung dalam premi periode berjalan, namun perlu dilengkapi.</span>
            </div>
          )}
        </div>
      )}

      {/* TAB: SP Premi */}
      {tab === "sp" && (
        <div>
          <div style={{ background: "#E3F2FD", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 12, color: COLORS.gray700, display: "flex", gap: 8, alignItems: "center" }}>
            <Calendar size={14} color={COLORS.blue} />
            <span>Pembayaran premi ke Taspen Life dilakukan <strong>setelah tanggal 15 bulan berikutnya</strong> dari periode premi (BR-TL-01). Hari ini <strong>22 Jul 2026</strong> — SP untuk periode Juni 2026 sudah dapat diterbitkan.</span>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle action={
              <Btn onClick={() => { if (!selSP.length) return; const byProg = {}; selSP.forEach(p => { (byProg[p.program] = byProg[p.program] || { count: 0, sum: 0 }); byProg[p.program].count++; byProg[p.program].sum += p.premi; });
                setPreview({ title: "Preview Surat Perintah Pembayaran Premi", subtitle: `${selSP.length} polis • Total ${fmt(selSPTotal)} • Format Tabel 6 BRS`, type: "surat", fileName: "SP_Premi_TaspenLife_Juli2026.pdf", content: { noSurat: "SP/TL/2026/07/XXX", tujuan: "PT Asuransi Jiwa Taspen (Taspen Life)\\nBank Mandiri — Rek. 1234567890", periode: "Juni 2026", cutoff: "30 Jun 2026", tanggal: "22 Jul 2026", items: Object.entries(byProg).map(([pr, g]) => ({ jenis: pr, peserta: g.count.toString(), nominal: fmt(g.sum) })) } }); }}>
                <FileText size={14} /> Terbitkan SP Premi ({selSP.length})
              </Btn>
            }>Polis Belum Dibayar — Siap Diterbitkan SP</SectionTitle>

            {belumBayar.length === 0 ? <NoData text="Semua premi periode ini sudah dibayar." /> : (
              <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: COLORS.gray100 }}>
                    {["", "No. Polis", "Nama Pemegang Polis", "Cabang", "Program", "Premi"].map((c, i) => (
                      <th key={i} style={{ padding: "10px 12px", textAlign: i === 5 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                    ))}
                  </tr></thead>
                  <tbody>{belumBayar.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: selectedSP[p.id] ? "#E3F2FD" : "transparent" }}>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}><input type="checkbox" checked={!!selectedSP[p.id]} onChange={() => toggleSP(p.id)} style={{ cursor: "pointer", width: 16, height: 16 }} /></td>
                      <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: COLORS.blue }}>{p.noPolis}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{p.nama}</td>
                      <td style={{ padding: "10px 12px" }}>{p.cabang}</td>
                      <td style={{ padding: "10px 12px" }}><Badge color={progColor(p.program)}>{progShort(p.program)}</Badge></td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(p.premi)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {selSP.length > 0 && (
              <div style={{ marginTop: 12, padding: "12px 16px", background: "#E3F2FD", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: COLORS.blueDark }}><strong>{selSP.length}</strong> polis dipilih — Total premi: <strong>{fmt(selSPTotal)}</strong></span>
                <span style={{ fontSize: 11, color: COLORS.gray600 }}>Rekening tujuan: Bank Mandiri — 1234567890 a.n. PT Asuransi Jiwa Taspen</span>
              </div>
            )}
          </div>

          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle>Riwayat SP Premi & Status Approval</SectionTitle>
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ background: COLORS.gray100 }}>
                  {["No. SP", "Periode", "Program", "Jml Polis", "Nominal", "Tgl Terbit", "Jatuh Tempo", "Status", "Approver"].map((c, i) => (
                    <th key={i} style={{ padding: "10px 12px", textAlign: i === 3 || i === 4 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `2px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr></thead>
                <tbody>{spRows.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }} onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: s.noSP === "—" ? COLORS.gray400 : COLORS.blue, fontWeight: 500 }}>{s.noSP}</td>
                    <td style={{ padding: "10px 12px" }}>{s.periode}</td>
                    <td style={{ padding: "10px 12px" }}><Badge color={progColor(s.program)}>{progShort(s.program)}</Badge></td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>{s.jml}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(s.nominal)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>{s.tglTerbit}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>{s.jatuhTempo}</td>
                    <td style={{ padding: "10px 12px" }}><Badge color={spStatusColor(s.status)}>{s.status}</Badge></td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: COLORS.gray600 }}>{s.approver}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Berita Acara */}
      {tab === "ba" && (
        <div>
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 24, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle>Unggah Berita Acara dari Divisi Kepesertaan</SectionTitle>
            <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#F57F17", display: "flex", gap: 8 }}>
              <AlertTriangle size={14} />
              <span>Pembayaran premi hanya dapat diproses apabila Berita Acara telah diterima dan direkonsiliasi bersama Divisi Layanan (BR-TL-02).</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
              <Select label="Periode Berita Acara" value="Juni 2026" onChange={() => {}} options={["Juni 2026", "Mei 2026", "April 2026"]} />
              <Select label="Program" value="Semua Program" onChange={() => {}} options={["Semua Program", ...programs]} />
              <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Berita Acara</label><input type="date" defaultValue="2026-07-01" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, boxSizing: "border-box" }} /></div>
            </div>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setBaState("uploading"); setTimeout(() => setBaState("done"), 1400); }}
              onClick={() => { setBaState("uploading"); setTimeout(() => setBaState("done"), 1400); }}
              style={{ border: `2px dashed ${dragOver ? COLORS.blue : COLORS.gray300}`, borderRadius: 12, padding: "40px 24px", textAlign: "center", background: dragOver ? "#E3F2FD" : COLORS.gray50, cursor: "pointer" }}>
              {baState === "idle" && (<>
                <div style={{ marginBottom: 10, opacity: 0.4 }}><Upload size={40} /></div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.gray800, marginBottom: 4 }}>Drag &amp; drop Berita Acara di sini</div>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 14 }}>atau klik untuk memilih file dari komputer</div>
                <div style={{ display: "inline-flex", padding: "8px 20px", background: COLORS.blue, color: COLORS.white, borderRadius: 6, fontSize: 13, fontWeight: 600 }}>Pilih File</div>
                <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 10 }}>Format: PDF, XLSX — Maks. 20 MB</div>
              </>)}
              {baState === "uploading" && (<>
                <div style={{ marginBottom: 10, color: COLORS.blue }}><Clock size={40} /></div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.blue }}>Mengunggah &amp; mencocokkan dengan data polis...</div>
              </>)}
              {baState === "done" && (<>
                <div style={{ marginBottom: 10, color: COLORS.green }}><CheckCircle2 size={40} /></div>
                <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>Berita Acara berhasil diunggah</div>
                <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 12 }}>8 polis dicocokkan • 6 sesuai • 2 selisih ditemukan</div>
                <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setBaState("idle"); }}>Unggah Ulang</Btn>
              </>)}
            </div>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle>Riwayat Berita Acara &amp; Status Rekonsiliasi</SectionTitle>
            <Table columns={["No. Berita Acara", "Periode", "Tgl Terima", "Jml Polis (BA)", "Jml Polis (Sistem)", "Selisih", "Status", "Diunggah Oleh"]} data={[
              ["BA/KEP/2026/06/012", "Juni 2026", "01 Jul 2026", "8", "8", <span style={{ color: COLORS.orange, fontWeight: 700 }}>2 selisih</span>, <Badge color="orange">Perlu Rekonsiliasi</Badge>, "Staf Keuangan A"],
              ["BA/KEP/2026/05/011", "Mei 2026", "02 Jun 2026", "7", "7", <span style={{ color: COLORS.green }}>0</span>, <Badge color="green">Tervalidasi</Badge>, "Staf Keuangan A"],
              ["BA/KEP/2026/04/010", "April 2026", "03 Mei 2026", "7", "7", <span style={{ color: COLORS.green }}>0</span>, <Badge color="green">Tervalidasi</Badge>, "Staf Keuangan B"],
            ]} />
          </div>
        </div>
      )}
    </div>
  );
};

// ===== TAGIHAN IMBAL JASA TASPEN LIFE (TL-F08..F11) =====
const TaspenImbalJasa = () => {
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchTagihan, setSearchTagihan] = useState("");
  const [detailTagihan, setDetailTagihan] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showTarif, setShowTarif] = useState(false);
  const [tarifTDS, setTarifTDS] = useState(2.5);
  const [tarifJKK, setTarifJKK] = useState(3);
  const [tarifJKm, setTarifJKm] = useState(3);
  const [pphRate, setPphRate] = useState(2);
  const [ppnRate, setPpnRate] = useState(11);

  const fmt = n => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
  const progColor = p => p === "TDS (THT)" ? "blue" : p === "Proteksi Beasiswa JKK" ? "orange" : "green";
  const progShort = p => p === "TDS (THT)" ? "TDS" : p === "Proteksi Beasiswa JKK" ? "JKK" : "JKm";

  const allTagihan = [
    { no: "TIJ-2606-001", program: "TDS (THT)", noSP: "SP/TL/2026/06/001", periode: "Mei 2026", jmlPolis: 2, premi: 830000, tarif: 2.5, tglTerbit: "18 Jun 2026", jatuhTempo: "18 Jul 2026", tglBayar: "10 Jul 2026", hariTerlambat: 0, status: "Dibayar" },
    { no: "TIJ-2606-002", program: "Proteksi Beasiswa JKK", noSP: "SP/TL/2026/06/002", periode: "Mei 2026", jmlPolis: 1, premi: 620000, tarif: 3, tglTerbit: "18 Jun 2026", jatuhTempo: "18 Jul 2026", tglBayar: null, hariTerlambat: 4, status: "Belum Dibayar" },
    { no: "TIJ-2606-003", program: "Proteksi Beasiswa JKm", noSP: "SP/TL/2026/06/003", periode: "Mei 2026", jmlPolis: 2, premi: 600000, tarif: 3, tglTerbit: "18 Jun 2026", jatuhTempo: "18 Jul 2026", tglBayar: "15 Jul 2026", hariTerlambat: 0, status: "Dibayar" },
    { no: "TIJ-2605-001", program: "TDS (THT)", noSP: "SP/TL/2026/05/001", periode: "April 2026", jmlPolis: 2, premi: 792000, tarif: 2.5, tglTerbit: "18 Mei 2026", jatuhTempo: "18 Jun 2026", tglBayar: "25 Jun 2026", hariTerlambat: 7, status: "Terlambat" },
    { no: "TIJ-2605-002", program: "Proteksi Beasiswa JKK", noSP: "SP/TL/2026/05/002", periode: "April 2026", jmlPolis: 1, premi: 600000, tarif: 3, tglTerbit: "18 Mei 2026", jatuhTempo: "18 Jun 2026", tglBayar: "05 Jun 2026", hariTerlambat: 0, status: "Dibayar" },
    { no: "TIJ-2607-001", program: "TDS (THT)", noSP: "SP/TL/2026/07/001", periode: "Juni 2026", jmlPolis: 2, premi: 830000, tarif: 2.5, tglTerbit: "20 Jul 2026", jatuhTempo: "20 Agu 2026", tglBayar: null, hariTerlambat: 0, status: "Menunggu Pembayaran" },
  ];

  const calc = t => {
    const bruto = t.premi * t.tarif / 100;
    const ppn = bruto * ppnRate / 100;
    const pph = bruto * pphRate / 100;
    const neto = bruto + ppn - pph;
    const denda = t.hariTerlambat > 0 ? neto * 0.0575 * t.hariTerlambat / 365 : 0;
    return { bruto, ppn, pph, neto, denda };
  };

  const statusColor = s => s === "Dibayar" ? "green" : s === "Terlambat" ? "orange" : s === "Belum Dibayar" ? "red" : "gray";

  const tagihDenda = (t) => { const c = calc(t); setPreview({
    title: "Surat Tagihan Denda Keterlambatan",
    subtitle: `Taspen Life — ${t.no} • ${t.hariTerlambat} hari terlambat`,
    type: "surat",
    fileName: `Tagihan_Denda_${t.no}.pdf`,
    content: {
      noSurat: t.no.replace(/^TIJ/, "DENDA"),
      tujuan: "PT Asuransi Jiwa Taspen (Taspen Life)",
      periode: `${t.program} — ${t.periode}`,
      cutoff: t.jatuhTempo,
      tanggal: "22 Jul 2026",
      items: [
        { jenis: "Nilai Neto Tagihan", peserta: "—", nominal: fmt(c.neto) },
        { jenis: `Hari keterlambatan (jatuh tempo ${t.jatuhTempo})`, peserta: `${t.hariTerlambat} hari`, nominal: "—" },
        { jenis: "Denda (Neto × 5,75% × hari ÷ 365)", peserta: "—", nominal: fmt(c.denda) },
      ],
    },
  }); };

  const filtered = allTagihan.filter(t => {
    if (filterProgram !== "Semua" && t.program !== filterProgram) return false;
    if (filterStatus !== "Semua" && t.status !== filterStatus) return false;
    if (searchTagihan && !t.no.toLowerCase().includes(searchTagihan.toLowerCase()) && !t.noSP.toLowerCase().includes(searchTagihan.toLowerCase())) return false;
    return true;
  });

  const totalNeto = allTagihan.reduce((a, t) => a + calc(t).neto, 0);
  const totalDenda = allTagihan.reduce((a, t) => a + calc(t).denda, 0);
  const terlambatCount = allTagihan.filter(t => t.hariTerlambat > 0).length;
  const lunasCount = allTagihan.filter(t => t.status === "Dibayar").length;

  const riwayatTarif = [
    { tgl: "01 Jan 2026", prog: "TDS (THT)", lama: "2,0%", baru: "2,5%", oleh: "Kadiv Keuangan", ket: "Penyesuaian kontrak kerjasama 2026" },
    { tgl: "01 Jan 2026", prog: "Proteksi Beasiswa JKK", lama: "2,5%", baru: "3,0%", oleh: "Kadiv Keuangan", ket: "Penyesuaian kontrak kerjasama 2026" },
    { tgl: "01 Jan 2026", prog: "Proteksi Beasiswa JKm", lama: "2,5%", baru: "3,0%", oleh: "Kadiv Keuangan", ket: "Mengikuti tarif JKK" },
  ];

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Modal Parameter Tarif */}
      {showTarif && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowTarif(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 640, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900 }}>Parameter Tarif Imbal Jasa</div>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>Perubahan berlaku prospektif sesuai periode yang ditetapkan (BR-TL-08)</div>
              </div>
              <button onClick={() => setShowTarif(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Tarif per Program</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[{ l: "TDS (THT)", v: tarifTDS, set: setTarifTDS, c: "blue" }, { l: "Proteksi Beasiswa JKK", v: tarifJKK, set: setTarifJKK, c: "orange" }, { l: "Proteksi Beasiswa JKm", v: tarifJKm, set: setTarifJKm, c: "green" }].map((x, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: COLORS.gray50, borderRadius: 8 }}>
                    <Badge color={x.c}>{x.l}</Badge>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="number" step="0.1" value={x.v} onChange={e => x.set(Number(e.target.value))} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: 80, fontSize: 14, textAlign: "right", fontWeight: 700 }} />
                      <span style={{ fontSize: 13, color: COLORS.gray500 }}>% dari premi</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Parameter Perpajakan</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[{ l: "PPh atas Imbal Jasa", v: pphRate, set: setPphRate, note: "Dipotong dari bruto" }, { l: "PPN atas Imbal Jasa", v: ppnRate, set: setPpnRate, note: "Ditambahkan ke bruto" }].map((x, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: COLORS.gray50, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray800, marginBottom: 6 }}>{x.l}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="number" step="0.5" value={x.v} onChange={e => x.set(Number(e.target.value))} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: 70, fontSize: 14, textAlign: "right", fontWeight: 700 }} />
                      <span style={{ fontSize: 13, color: COLORS.gray500 }}>%</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>{x.note}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, background: "#E3F2FD", borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: COLORS.gray600, marginBottom: 4 }}>Simulasi — premi Rp 1.000.000 (tarif TDS {tarifTDS}%)</div>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: COLORS.blueDark, lineHeight: 1.7 }}>
                  Bruto: {fmt(1000000 * tarifTDS / 100)} • PPN {ppnRate}%: +{fmt(1000000 * tarifTDS / 100 * ppnRate / 100)} • PPh {pphRate}%: −{fmt(1000000 * tarifTDS / 100 * pphRate / 100)}<br />
                  <strong>Neto: {fmt(1000000 * tarifTDS / 100 * (1 + ppnRate / 100 - pphRate / 100))}</strong>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Riwayat Perubahan Tarif</div>
              <div style={{ borderRadius: 8, border: `1px solid ${COLORS.gray200}`, overflow: "hidden", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead><tr style={{ background: COLORS.gray100 }}>{["Berlaku", "Program", "Lama", "Baru", "Diubah Oleh"].map((c, i) => <th key={i} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}` }}>{c}</th>)}</tr></thead>
                  <tbody>{riwayatTarif.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                      <td style={{ padding: "8px 10px" }}>{r.tgl}</td>
                      <td style={{ padding: "8px 10px" }}><Badge color={progColor(r.prog)}>{progShort(r.prog)}</Badge></td>
                      <td style={{ padding: "8px 10px", color: COLORS.gray500 }}>{r.lama}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 700 }}>{r.baru}</td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: COLORS.gray600 }}>{r.oleh}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="ghost" size="sm" onClick={() => setShowTarif(false)}>Batal</Btn>
                <Btn size="sm" onClick={() => setShowTarif(false)}>Simpan Parameter</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Tagihan */}
      {detailTagihan && (() => {
        const t = detailTagihan; const c = calc(t);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailTagihan(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "24px 28px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray900 }}>Detail tagihan {t.no}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 2 }}>Taspen Life - {t.program} - {t.periode}</div>
                  </div>
                  <button onClick={() => setDetailTagihan(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Badge color={statusColor(t.status)}>{t.hariTerlambat === 0 && t.status === "Dibayar" ? "Dibayar tepat waktu" : t.status}</Badge>
                </div>
              </div>
              <div style={{ padding: "0 28px 24px" }}>
                <div style={{ borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Informasi Tagihan</div>
                  {[
                    ["Penerbit", "PT ASABRI (Persero)"],
                    ["Ditagihkan kepada", "PT Asuransi Jiwa Taspen"],
                    ["Program", t.program],
                    ["No. SP Premi", t.noSP],
                    ["Jumlah polis", `${t.jmlPolis} polis`],
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
                    ["Total premi", fmt(t.premi)],
                    [`Tarif imbal jasa (${t.tarif}%)`, fmt(c.bruto)],
                    [`PPN ${ppnRate}%`, "+ " + fmt(c.ppn)],
                    [`PPh ${pphRate}%`, "− " + fmt(c.pph)],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.gray100}`, fontSize: 13 }}>
                      <span style={{ color: COLORS.gray500 }}>{label}</span><span style={{ fontWeight: 500, color: COLORS.gray800 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: COLORS.gray900 }}>Nilai neto tagihan</span>
                    <span style={{ fontWeight: 700, color: COLORS.gray900 }}>{fmt(c.neto)}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Denda Keterlambatan</div>
                  {c.denda === 0 ? (
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
                        <span style={{ color: COLORS.gray500 }}>Denda (Neto × 5,75% × hari / 365)</span><span style={{ fontWeight: 700, color: COLORS.red }}>{fmt(c.denda)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${COLORS.gray200}` }}>
                  <span style={{ fontSize: 14, color: COLORS.gray700 }}>Total tagihan + denda</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: COLORS.gray900, fontFamily: "monospace" }}>{fmt(c.neto + c.denda)}</span>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                  <Btn variant="outline" size="sm" onClick={() => { setDetailTagihan(null); setPreview({ title: "Preview Unduh Tagihan " + t.no, subtitle: `Taspen Life - ${t.program} - ${t.periode}`, type: "table", fileName: "Tagihan_" + t.no + ".pdf", content: { columns: ["Item", "Nilai"], rows: [["Total Premi", fmt(t.premi)], [`Imbal Jasa ${t.tarif}%`, fmt(c.bruto)], [`PPN ${ppnRate}%`, "+" + fmt(c.ppn)], [`PPh ${pphRate}%`, "−" + fmt(c.pph)], ["Nilai Neto", fmt(c.neto)], ["Denda", fmt(c.denda)], ["Grand Total", fmt(c.neto + c.denda)]], totalRows: 7 } }); }}>Unduh Tagihan</Btn>
                  <Btn variant="danger" size="sm" onClick={() => setDetailTagihan(null)}>Tutup</Btn>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 4 }}>Daftar tagihan imbal jasa kepada Taspen Life atas jasa pemasaran dan administrasi polis, termasuk keterlambatan dan denda</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setShowTarif(true)}><Percent size={14} /> Parameter Tarif</Btn>
          <Btn variant="outline" onClick={() => setPreview({ title: "Preview Ekspor Tagihan Imbal Jasa Taspen Life", subtitle: "Format Tabel 7 BRS", type: "table", fileName: "Tagihan_ImbalJasa_TaspenLife.xlsx", content: { columns: ["No.", "Program", "Periode", "Premi", "Tarif", "Neto", "Status"], rows: allTagihan.slice(0, 5).map(t => [t.no, progShort(t.program), t.periode, fmt(t.premi), t.tarif + "%", fmt(calc(t).neto), t.status]), totalRows: allTagihan.length } })}>Ekspor Excel</Btn>
          <Btn onClick={() => setPreview({ title: "Preview Surat Tagihan Imbal Jasa", subtitle: "Format Tabel 7 BRS + kuitansi tanda terima", type: "surat", fileName: "Surat_Tagihan_ImbalJasa_TaspenLife.pdf", content: { noSurat: "TIJ/2026/07/XXX", tujuan: "PT Asuransi Jiwa Taspen (Taspen Life)", periode: "Juni 2026", cutoff: "18 Jul 2026", tanggal: "22 Jul 2026", items: allTagihan.filter(t => t.periode === "Juni 2026").map(t => { const c = calc(t); return { jenis: `${t.program} — imbal jasa ${t.tarif}%`, peserta: t.jmlPolis.toString(), nominal: fmt(c.neto) }; }) } })}>Terbitkan & Kirim ke Taspen Life</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Banknote size={IC} />} label="Total nilai neto tagihan" value={fmt(totalNeto)} sub={`${allTagihan.length} tagihan diterbitkan`} color={COLORS.blue} />
        <StatCard icon={<CheckCircle2 size={IC} />} label="Tagihan sudah lunas" value={`${lunasCount} tagihan`} sub={`Dari ${allTagihan.length} tagihan`} color={COLORS.green} />
        <StatCard icon={<Clock size={IC} />} label="Tagihan terlambat" value={`${terlambatCount} tagihan`} sub="Melewati jatuh tempo" color={COLORS.orange} />
        <StatCard icon={<AlertTriangle size={IC} />} label="Total denda keterlambatan" value={fmt(totalDenda)} sub="Akumulasi periode ini" color={COLORS.red} />
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle action={<span style={{ fontSize: 12, color: COLORS.gray500 }}>Tarif aktif: TDS {tarifTDS}% • JKK {tarifJKK}% • JKm {tarifJKm}%</span>}>Daftar Tagihan Imbal Jasa Taspen Life</SectionTitle>
        <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#F57F17", display: "flex", gap: 8 }}>
          <AlertTriangle size={14} />
          <span>Surat tagihan imbal jasa hanya diterbitkan setelah pembayaran premi kepada Taspen Life selesai dilakukan (BR-TL-05).</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Program" value={filterProgram} onChange={setFilterProgram} options={["Semua", "TDS (THT)", "Proteksi Beasiswa JKK", "Proteksi Beasiswa JKm"]} minW={190} />
          <Select label="Status" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Dibayar", "Terlambat", "Belum Dibayar", "Menunggu Pembayaran"]} minW={170} />
          <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchTagihan} onChange={setSearchTagihan} placeholder="Cari no. tagihan atau no. SP..." minW={240} /></div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allTagihan.length} tagihan</div>
        {filtered.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: COLORS.gray100 }}>
                {["No. Tagihan", "Program", "No. SP Premi", "Periode", "Tgl. Terbit", "Jatuh Tempo", "Tgl. Dibayar", "Status", ""].map((c, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr></thead>
              <tbody>{filtered.map((t, i) => {
                const bg = t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : "transparent";
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: bg }}
                    onMouseEnter={e => e.currentTarget.style.background = bg === "transparent" ? COLORS.gray50 : bg}
                    onMouseLeave={e => e.currentTarget.style.background = bg}>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 500 }}>{t.no}</td>
                    <td style={{ padding: "10px 14px" }}><Badge color={progColor(t.program)}>{progShort(t.program)}</Badge></td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11 }}>{t.noSP}</td>
                    <td style={{ padding: "10px 14px" }}>{t.periode}</td>
                    <td style={{ padding: "10px 14px" }}>{t.tglTerbit}</td>
                    <td style={{ padding: "10px 14px", color: t.hariTerlambat > 0 ? COLORS.red : COLORS.gray800, fontWeight: t.hariTerlambat > 0 ? 700 : 400 }}>{t.jatuhTempo}</td>
                    <td style={{ padding: "10px 14px" }}>{t.tglBayar || <span style={{ color: COLORS.gray400 }}>—</span>}</td>
                    <td style={{ padding: "10px 14px" }}><Badge color={statusColor(t.status)}>{t.status}</Badge></td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn size="sm" variant="outline" onClick={() => setDetailTagihan(t)}>Detail</Btn>
                        {t.hariTerlambat > 0 && <Btn size="sm" variant="danger" onClick={() => tagihDenda(t)}><Bell size={13} /> Tagih Denda</Btn>}
                      </div>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ICON_MAP = {
  chart: BarChart3, calc: Calculator, sync: RefreshCw, file: FileText,
  bank: Building2, clip: ClipboardList, card: CreditCard, receipt: Receipt,
  trend: TrendingDown, cross: Cross, pen: PenLine, dollar: DollarSign,
  shield: Shield, wallet: Wallet,
};

const MENU = [
  { section: "IKHTISAR", items: [
    { id: "dashboard", icon: "chart", label: "Ikhtisar Keuangan" },
  ]},
  { section: "PENERIMAAN IURAN", items: [
    { icon: "dollar", label: "Administrasi Iuran Peserta", children: [
      { id: "kalkulator", label: "Perhitungan Iuran Peserta" },
      { id: "rekonsiliasi", label: "Rekonsiliasi SKP-PFK Kemenkeu" },
      { id: "tagihan", label: "Penerbitan Tagihan Kemenkeu", disabled: true },
    ]},
  ]},
  { section: "PEMBAYARAN MANFAAT", items: [
    { icon: "bank", label: "Realisasi Pembayaran Manfaat", children: [
      { id: "bayarpensiun", label: "Daftar DAPEM & Penerbitan SPP" },
      { id: "klaim", label: "Penyelesaian Klaim JKK" },
    ]},
    { icon: "trend", label: "Pengendalian Anggaran", children: [
      { id: "dipa", label: "Realisasi & Sisa Pagu DIPA" },
      { id: "dana", label: "Ketersediaan Dana Mitra Bayar" },
    ]},
  ]},
  { section: "PENAGIHAN & PIUTANG", items: [
    { icon: "shield", label: "Penagihan Kelebihan Bayar", children: [
      { id: "kredit", label: "Penarikan UDW Punah" },
    ]},
    { icon: "card", label: "Penagihan Imbal Jasa", children: [
      { id: "imbaljasa", label: "Imbal Jasa Mitra Bayar" },
      { id: "tlimbaljasa", label: "Imbal Jasa Taspen Life" },
    ]},
  ]},
  { section: "KEMITRAAN ASURANSI", items: [
    { icon: "wallet", label: "Administrasi Taspen Life", children: [
      { id: "tlpolis", label: "Portofolio Polis & Premi" },
    ]},
  ]},
  { section: "PERPAJAKAN & REKONSILIASI", items: [
    { icon: "receipt", label: "Administrasi Perpajakan", children: [
      { id: "pajak", label: "PPh 21 & Bukti Potong" },
    ]},
    { icon: "cross", label: "Rekonsiliasi Jaminan Kesehatan", children: [
      { id: "bpjs", label: "Iuran BPJS Kesehatan" },
    ]},
  ]},
  { section: "PELAPORAN", items: [
    { id: "laporan", icon: "pen", label: "Laporan & Ekspor Data" },
  ]},
];

const PAGES = {
  dashboard: { title: "Ikhtisar Keuangan", component: DashboardKeuangan },
  kalkulator: { title: "Perhitungan Iuran Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "Rekonsiliasi SKP-PFK Kemenkeu", component: RekonsIuran },
  tagihan: { title: "Penerbitan Tagihan Iuran ke Kemenkeu", component: GeneratorTagihan },
  bayarpensiun: { title: "Daftar DAPEM per MAK & Penerbitan SPP", component: PembayaranPensiun },
  dana: { title: "Ketersediaan Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  klaim: { title: "Penyelesaian Klaim JKK Perawatan", component: MonitoringKlaim },
  kredit: { title: "Penarikan Kelebihan Bayar UDW Punah", component: KreditPiutang },
  imbaljasa: { title: "Tagihan Imbal Jasa Mitra Bayar", component: TagihanImbalJasa },
  tlpolis: { title: "Portofolio Polis & Premi Taspen Life", component: TaspenPolis },
  tlimbaljasa: { title: "Tagihan Imbal Jasa Taspen Life", component: TaspenImbalJasa },
  pajak: { title: "Administrasi PPh 21 & Bukti Potong", component: Perpajakan },
  dipa: { title: "Realisasi & Sisa Pagu DIPA TA 2026", component: DashboardDIPA },
  bpjs: { title: "Rekonsiliasi Iuran BPJS Kesehatan", component: RekonBPJS },
  laporan: { title: "Laporan & Ekspor Data", component: ReportGenerator },
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState(["Administrasi Iuran Peserta"]);
  const page = PAGES[activePage];
  const PageComp = page.component;

  const toggleMenu = (label) => {
    setExpandedMenus(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]);
  };

  // Auto-expand parent when child is active
  const isChildActive = (children) => children?.some(c => c.id === activePage);

  const renderIcon = (iconKey, size = 16, color) => {
    const IconComp = ICON_MAP[iconKey];
    return IconComp ? <IconComp size={size} color={color} /> : null;
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: COLORS.gray100, color: COLORS.gray900 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.blueDark} 100%)`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: COLORS.white, fontSize: 20, cursor: "pointer", padding: 4 }}>
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: COLORS.navy }}>A</div>
            <div>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>YANDU <span style={{ color: COLORS.accent }}>NEXTGEN</span> ASABRI</div>
              <div style={{ color: COLORS.gray400, fontSize: 10, letterSpacing: 1 }}>DIVISI KEUANGAN</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Search size={14} color={COLORS.gray400} />
            <span style={{ fontSize: 12, color: COLORS.gray400 }}>Cari Peserta / NRP / NIP...</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: COLORS.gray300 }}>ROLE: <strong style={{ color: COLORS.white }}>Super Administrator</strong></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={18} color={COLORS.gray300} />
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 12, fontWeight: 700 }}>WA</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width: 256, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, overflowY: "auto", flexShrink: 0 }}>
            {MENU.map((section, si) => (
              <div key={si} style={{ paddingTop: si === 0 ? 12 : 4, paddingBottom: 4 }}>
                {/* Section Header */}
                <div style={{ padding: "8px 20px 6px", fontSize: 10, fontWeight: 800, color: COLORS.gray400, letterSpacing: 1.2, textTransform: "uppercase" }}>
                  {section.section}
                </div>

                {section.items.map((item, ii) => {
                  // Standalone item (no children)
                  if (!item.children) {
                    const isActive = activePage === item.id;
                    return (
                      <button key={ii} onClick={() => setActivePage(item.id)} style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 20px",
                        border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", transition: "all 0.15s",
                        background: isActive ? "#E3F2FD" : "transparent",
                        color: isActive ? COLORS.blue : COLORS.gray700,
                        fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                      }}>
                        <span style={{ display: "flex", opacity: isActive ? 1 : 0.6 }}>{renderIcon(item.icon, 16, isActive ? COLORS.blue : COLORS.gray500)}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  }

                  // Parent with children (collapsible)
                  const isExpanded = expandedMenus.includes(item.label) || isChildActive(item.children);
                  const hasActiveChild = isChildActive(item.children);

                  return (
                    <div key={ii}>
                      {/* Parent button */}
                      <button onClick={() => toggleMenu(item.label)} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                        padding: "9px 20px", border: "none", cursor: "pointer", fontSize: 13, textAlign: "left",
                        background: "transparent", transition: "all 0.15s",
                        color: hasActiveChild ? COLORS.blue : COLORS.gray700,
                        fontWeight: hasActiveChild ? 600 : 500,
                        borderLeft: "3px solid transparent",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ display: "flex", opacity: hasActiveChild ? 1 : 0.6 }}>{renderIcon(item.icon, 16, hasActiveChild ? COLORS.blue : COLORS.gray500)}</span>
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown size={14} color={COLORS.gray400} style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
                      </button>

                      {/* Children */}
                      {isExpanded && (
                        <div style={{ overflow: "hidden" }}>
                          {item.children.map((child, ci) => {
                            const isActive = activePage === child.id;
                            const isDisabled = child.disabled;
                            return (
                              <button key={ci} onClick={() => !isDisabled && setActivePage(child.id)} style={{
                                display: "flex", alignItems: "center", gap: 8, width: "100%",
                                padding: "7px 20px 7px 48px", border: "none",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                fontSize: 12.5, textAlign: "left", transition: "all 0.15s",
                                background: isActive ? "#E3F2FD" : "transparent",
                                color: isDisabled ? COLORS.gray400 : isActive ? COLORS.blue : COLORS.gray600,
                                fontWeight: isActive ? 600 : 400,
                                opacity: isDisabled ? 0.5 : 1,
                                borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                              }}>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: isDisabled ? COLORS.gray300 : isActive ? COLORS.blue : COLORS.gray400, flexShrink: 0 }} />
                                <span>{child.label}</span>
                                {isDisabled && <span style={{ fontSize: 9, background: COLORS.gray200, color: COLORS.gray500, padding: "1px 6px", borderRadius: 3, marginLeft: "auto", fontWeight: 600 }}>SOON</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Section divider */}
                {si < MENU.length - 1 && <div style={{ margin: "8px 20px", borderBottom: `1px solid ${COLORS.gray200}` }} />}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 2 }}>Beranda › Keuangan › {page.title}</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>{page.title}</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={14} color={COLORS.white} />
              <span style={{ background: COLORS.blueDark, color: COLORS.white, padding: "6px 14px", borderRadius: 6, fontSize: 12 }}>Minggu, 06 Juli 2026</span>
            </div>
          </div>
          <PageComp />
        </div>
      </div>
    </div>
  );
}
