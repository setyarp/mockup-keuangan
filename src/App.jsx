import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { LayoutDashboard, Activity, Calculator, RefreshCw, FileText, Building2, ClipboardList, CreditCard, Receipt, TrendingDown, Cross, PenLine, Search, Download, Upload, Calendar, CheckCircle2, AlertTriangle, Banknote, Eye, PenTool, Mail, Bell, Menu, ChevronRight, ChevronDown, CircleDot, Shield, Lock, BarChart3, Users, Clock, XCircle, FileUp, Filter, Printer, ExternalLink, ArrowRight, FolderOpen, CircleCheck, CircleAlert, CircleDashed, FileCheck, FileClock, FileX, Landmark, TrendingUp, Wallet, DollarSign, Percent, Hash, UserCheck, FilePlus, ArrowUpDown, MoreHorizontal, Check, Database, Sparkles, Layers, PieChart } from "lucide-react";

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

const StatCard = ({ icon, label, value, sub, color = COLORS.blue, link }) => {
  const strVal = String(value || "");
  const fontSize = strVal.length > 20 ? 14 : strVal.length > 16 ? 16 : strVal.length > 12 ? 19 : strVal.length > 9 ? 22 : 26;
  return (
    <div
      className="hover-lift"
      style={{
        background: COLORS.white,
        borderRadius: 10,
        padding: "18px 20px",
        flex: 1,
        minWidth: 180,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: `1px solid ${COLORS.gray200}`,
        overflow: "hidden",
        cursor: link ? "pointer" : "default"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "transform 0.2s ease" }}>{icon}</div>
        <span style={{ fontSize: 11, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      </div>
      <div style={{ fontSize: fontSize, fontWeight: 700, color: COLORS.gray900, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={strVal}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.gray500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</div>}
      {link && <div style={{ fontSize: 12, color: COLORS.blue, marginTop: 8, cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>{link} ↗</div>}
    </div>
  );
};

const Table = ({ columns, data, alignRightCols = [] }) => (
  <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
      <thead>
        <tr style={{ background: "#1E293B", color: COLORS.white }}>
          {columns.map((c, i) => (
            <th
              key={i}
              style={{
                padding: "11px 14px",
                textAlign: alignRightCols.includes(i) ? "right" : "left",
                fontWeight: 700,
                color: COLORS.white,
                borderBottom: "1px solid #334155",
                borderRight: i < columns.length - 1 ? "1px solid #334155" : "none",
                whiteSpace: "nowrap",
                letterSpacing: 0.2
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            style={{
              borderBottom: `1px solid #E2E8F0`,
              background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
              transition: "background 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "10px 14px",
                  color: "#0F172A",
                  borderRight: j < row.length - 1 ? "1px solid #E2E8F0" : "none",
                  textAlign: alignRightCols.includes(j) ? "right" : "left",
                  fontSize: 12.5
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Btn = ({ children, variant = "primary", onClick, size = "md", style, disabled, ...props }) => {
  const styles = {
    primary: { background: COLORS.blue, color: COLORS.white, border: "none", hoverBg: COLORS.blueDark, shadow: "0 2px 6px rgba(21,101,192,0.25)" },
    outline: { background: "transparent", color: COLORS.blue, border: `1px solid ${COLORS.blue}`, hoverBg: "#E3F2FD", shadow: "0 2px 4px rgba(21,101,192,0.12)" },
    danger: { background: COLORS.red, color: COLORS.white, border: "none", hoverBg: "#B71C1C", shadow: "0 2px 6px rgba(198,40,40,0.25)" },
    ghost: { background: "transparent", color: COLORS.gray700, border: `1px solid ${COLORS.gray300}`, hoverBg: "#F1F5F9", shadow: "0 1px 3px rgba(0,0,0,0.06)" }
  };
  const s = styles[variant] || styles.primary;
  const pd = size === "sm" ? "6px 12px" : "8px 18px";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s,
        padding: pd,
        borderRadius: 6,
        fontSize: size === "sm" ? 12 : 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = s.hoverBg;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = s.shadow;
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.background = s.background;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      onMouseDown={e => {
        if (!disabled) e.currentTarget.style.transform = "translateY(0) scale(0.97)";
      }}
      onMouseUp={e => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const Select = ({ label, value, onChange, options, minW = 140 }) => (
  <div>
    {label && <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${COLORS.gray300}`,
        fontSize: 13,
        color: COLORS.gray700,
        background: COLORS.white,
        minWidth: minW,
        width: label ? "100%" : undefined,
        cursor: "pointer",
        transition: "all 0.15s ease"
      }}
    >
      {options.map((o, i) => (
        <option key={i} value={typeof o === "string" ? o : o.value}>
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  </div>
);

const SearchInput = ({ value, onChange, placeholder = "Cari...", minW = 180 }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      padding: "8px 12px",
      borderRadius: 6,
      border: `1px solid ${COLORS.gray300}`,
      fontSize: 13,
      minWidth: minW,
      transition: "all 0.15s ease"
    }}
  />
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
                        { jenis: "Pensiun (4,75%)", peserta: "14.328", nominal: "Rp 52.250.000.000" },
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
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800, marginBottom: 12 }}>Preview data yang akan diekspor:</div>
                <div style={{ background: COLORS.white, borderRadius: 8, overflow: "hidden", border: `1px solid #CBD5E1` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: COLORS.white }}>
                        {(content?.columns || []).map((c, i) => (
                          <th key={i} style={{ padding: "9px 12px", textAlign: "left", borderBottom: `1px solid #334155`, borderRight: i < (content?.columns?.length || 0) - 1 ? "1px solid #334155" : "none", fontWeight: 700, color: COLORS.white }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(content?.rows || []).map((row, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                          {row.map((cell, j) => (
                            <td key={j} style={{ padding: "8px 12px", color: "#0F172A", borderRight: j < row.length - 1 ? "1px solid #E2E8F0" : "none" }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(content?.totalRows || 0) > 5 && <div style={{ fontSize: 11, color: COLORS.gray500, padding: 10, textAlign: "center", background: "#F8FAFC" }}>... dan {content.totalRows - 5} baris lainnya</div>}
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
      <StatCard icon={<DollarSign size={IC} />} label="Total Tagihan Bulan Ini" value="Rp 847,2 M" sub="THT + Pensiun + JKK + JKm" color={COLORS.blue} link="Lihat Rincian" />
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
      <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "#1E293B", color: COLORS.white }}>
              {["No. Surat", "Jenis Iuran", "Acuan", "Nominal", "Cut-off", "Status Dokumen", "Aksi"].map((c, i) => (
                <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 6 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { no: "001/ASABRI/TGH-THT/VII/2026", jenis: "THT", acuan: "SKP-PFK", nominal: "Rp 35.760.000.000", cutoff: "25 Jun 2026", status: "Dokumen di-TTD", color: "green" },
              { no: "002/ASABRI/TGH-DAP/VII/2026", jenis: "Pensiun", acuan: "SKP-PFK", nominal: "Rp 52.250.000.000", cutoff: "25 Jun 2026", status: "Dokumen di-TTD", color: "green" },
              { no: "003/ASABRI/TGH-JKK/VII/2026", jenis: "JKK", acuan: "Data Klaim", nominal: "Rp 2.630.000.000", cutoff: "25 Jun 2026", status: "Siap Download", color: "blue" },
              { no: "004/ASABRI/TGH-JKM/VII/2026", jenis: "JKm", acuan: "Data Klaim", nominal: "Rp 2.210.000.000", cutoff: "25 Jun 2026", status: "Draft Tersedia", color: "yellow" },
            ].map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{t.no}</td>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{t.jenis}</td>
                <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={t.acuan === "SKP-PFK" ? "blue" : "orange"}>{t.acuan}</Badge></td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{t.nominal}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{t.cutoff}</td>
                <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={t.color}>{t.status}</Badge></td>
                <td style={{ padding: "10px 14px" }}><Btn size="sm" variant="ghost">Download</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: COLORS.gray500, display: "flex", justifyContent: "space-between" }}>
        <span>THT & Pensiun acuan: SKP-PFK Kemenkeu • JKK & JKm acuan: Data Klaim & Kalkulasi Sistem</span>
        <span style={{ color: COLORS.gray400 }}>Proses pengiriman ke Kemenkeu dilakukan secara manual</span>
      </div>
    </div>
  </div>
);

// ===== KALKULATOR IURAN (ALL FILTERS ACTIVE) =====
const KalkulatorIuran = () => {
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

      {/* Panel 2: Section Penerbitan Tagihan Iuran Kemenkeu */}
      <div style={{ background: "#F0F4F8", borderRadius: 10, padding: "16px 20px", border: `1px solid ${COLORS.blue}`, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.blueDark, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={16} />
          <span>Penerbitan Surat Tagihan Iuran Kemenkeu</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Select
            label="Pilih Jenis Tagihan Premi (Wajib)"
            value={selectedJenisTagihan}
            onChange={setSelectedJenisTagihan}
            options={[
              "-- Pilih Jenis Tagihan Premi --",
              "Tagihan Iuran THT & Pensiun (Digabung)",
              "Tagihan Iuran JKK (Terpisah)",
              "Tagihan Iuran JKm (Terpisah)"
            ]}
            minW={280}
          />

          <Select
            label="Batch Tagihan (Khusus THT/Pensiun)"
            value={batchTagihan}
            onChange={setBatchTagihan}
            options={["Batch 1 (Tanggal 15)", "Batch 2 (Tanggal 25 / Akhir Bulan)"]}
            minW={220}
          />

          <button
            disabled={selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --"}
            onClick={() => {
              if (selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --") return;

              if (selectedJenisTagihan === "Tagihan Iuran THT & Pensiun (Digabung)") {
                setPreview({
                  title: "Surat Tagihan Iuran THT & Pensiun (Digabung)",
                  subtitle: `Periode ${filterPeriode} • ${batchTagihan} — Surat Tagihan ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_THT_Pensiun_${filterPeriode.replace(" ", "_")}_${batchTagihan.slice(0,7)}.pdf`,
                  content: {
                    noSurat: `001/ASABRI/TGH-THT-PEN/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    batchInfo: batchTagihan,
                    tanggal: "01 Jul 2026",
                    items: [
                      { jenis: "Iuran THT (3,25%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalTHT.toFixed(2)} M` },
                      { jenis: "Iuran Pensiun (4,75%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalPensiun.toFixed(2)} M` },
                    ]
                  }
                });
              } else if (selectedJenisTagihan === "Tagihan Iuran JKK (Terpisah)") {
                setPreview({
                  title: "Surat Tagihan Iuran JKK (Terpisah)",
                  subtitle: `Periode ${filterPeriode} — Surat Tagihan Khusus JKK ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_JKK_${filterPeriode.replace(" ", "_")}.pdf`,
                  content: {
                    noSurat: `002/ASABRI/TGH-JKK/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    batchInfo: "Tagihan Bulanan JKK",
                    tanggal: "01 Jul 2026",
                    items: [
                      { jenis: "Iuran JKK (0,24%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalJKK.toFixed(2)} M` },
                    ]
                  }
                });
              } else if (selectedJenisTagihan === "Tagihan Iuran JKm (Terpisah)") {
                setPreview({
                  title: "Surat Tagihan Iuran JKm (Terpisah)",
                  subtitle: `Periode ${filterPeriode} — Surat Tagihan Khusus JKm ke Kemenkeu`,
                  type: "surat",
                  fileName: `Surat_Tagihan_JKm_${filterPeriode.replace(" ", "_")}.pdf`,
                  content: {
                    noSurat: `003/ASABRI/TGH-JKM/${filterPeriode.replace(" ", "/")}`,
                    periode: filterPeriode,
                    batchInfo: "Tagihan Bulanan JKm",
                    tanggal: "01 Jul 2026",
                    items: [
                      { jenis: "Iuran JKm (0,20%)", peserta: totalPeserta.toLocaleString(), nominal: `Rp ${totalJKM.toFixed(2)} M` },
                    ]
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
            <FileText size={14} /> Download Surat Tagihan
          </button>
        </div>

        {selectedJenisTagihan === "-- Pilih Jenis Tagihan Premi --" && (
          <div style={{ fontSize: 11.5, color: COLORS.orange, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <span>⚠️ Silakan pilih field <strong>"Pilih Jenis Tagihan Premi"</strong> di atas terlebih dahulu untuk mengaktifkan tombol Download Surat Tagihan.</span>
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

// ===== REKONSILIASI PENERIMAAN DANA =====
const RekonsIuran = () => {
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
    { id: "TGH-002", noSurat: "002/ASABRI/TGH-DAP/VII/2026", jenis: "Pensiun", acuan: "SKP-PFK", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 52.250.000.000", peserta: "14.328", currentStep: 3, tglDraft: "26 Jun 2026", tglDownload: "27 Jun 2026", tglTTD: "28 Jun 2026", fileTTD: "Surat_Tagihan_Pensiun_Juli2026_signed.pdf", icon: "barchart" },
    { id: "TGH-003", noSurat: "003/ASABRI/TGH-JKK/VII/2026", jenis: "JKK", acuan: "Data Klaim", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 2.630.000.000", peserta: "14.328", currentStep: 2, tglDraft: "26 Jun 2026", tglDownload: "27 Jun 2026", tglTTD: null, fileTTD: null, icon: "shield" },
    { id: "TGH-004", noSurat: "004/ASABRI/TGH-JKM/VII/2026", jenis: "JKm", acuan: "Data Klaim", periode: "Juli 2026", cutoff: "25 Jun 2026", nominal: "Rp 2.210.000.000", peserta: "14.328", currentStep: 1, tglDraft: "26 Jun 2026", tglDownload: null, tglTTD: null, fileTTD: null, icon: "lock" },
    { id: "TGH-005", noSurat: "005/ASABRI/TGH-THT/VI/2026", jenis: "THT", acuan: "SKP-PFK", periode: "Juni 2026", cutoff: "25 Mei 2026", nominal: "Rp 35.420.000.000", peserta: "14.290", currentStep: 3, tglDraft: "26 Mei 2026", tglDownload: "26 Mei 2026", tglTTD: "27 Mei 2026", fileTTD: "Surat_Tagihan_THT_Juni2026_signed.pdf", icon: "banknote" },
    { id: "TGH-006", noSurat: "006/ASABRI/TGH-DAP/VI/2026", jenis: "Pensiun", acuan: "SKP-PFK", periode: "Juni 2026", cutoff: "25 Mei 2026", nominal: "Rp 51.800.000.000", peserta: "14.290", currentStep: 3, tglDraft: "26 Mei 2026", tglDownload: "26 Mei 2026", tglTTD: "27 Mei 2026", fileTTD: "Surat_Tagihan_Pensiun_Juni2026_signed.pdf", icon: "barchart" },
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
          <div><div style={{ fontSize: 13, fontWeight: 700, color: COLORS.blueDark }}>THT & Pensiun</div><div style={{ fontSize: 12, color: COLORS.gray700 }}>Acuan tagihan: <strong>SKP-PFK Kemenkeu</strong></div></div>
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
        <Select label="Jenis Iuran" value={filterJenis} onChange={setFilterJenis} options={["Semua", "THT", "Pensiun", "JKK", "JKm"]} minW={120} />
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
          <Table columns={["No. SPP", "No. Rekap", "Peserta", "Satker", "Unor", "Jenis Klaim", "Nominal", "Mitra Bayar", "Status"]}
            data={filtered.map(k => [k.spp, k.rekap, k.peserta, <Badge color={k.satker === "TNI" ? "green" : k.satker === "POLRI" ? "blue" : k.satker === "PPPK" ? "yellow" : "orange"}>{k.satker || "—"}</Badge>, <span style={{ fontSize: 12, color: COLORS.gray600 }}>{k.unor || "—"}</span>, k.jenisKlaim, k.nominal, k.mitra, <Badge color={statusBadge(k.status)}>{k.status}</Badge>])} />
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
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
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
        {[{ id: "monitoring", label: "Monitoring Saldo" }, { id: "rekap", label: "Rekap Harian Rekening Koran" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "12px 24px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: "transparent", color: activeTab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "monitoring" && (
        <div>
          {/* PANEL 1 — Saldo Per Mitra Bayar (Real-time) */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle action={<span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><CircleDot size={10} /> Real-time</span>}>
              Saldo Per Mitra Bayar
            </SectionTitle>
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    {["Mitra", "Saldo Tersedia", "Kebutuhan Prox", "Coverage", "Status"].map((c, i) => (
                      <th key={i} style={{ padding: "11px 16px", textAlign: i >= 1 && i <= 3 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 4 ? "1px solid #334155" : "none" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{mitraData.map((m, i) => {
                  const cov = ((m.saldo / m.kebutuhan) * 100).toFixed(0);
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: m.status === "Kritis" ? COLORS.redLight : m.status === "Perhatian" ? COLORS.yellowLight : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      <td style={{ padding: "11px 16px", fontWeight: 700, color: m.status === "Kritis" ? COLORS.red : "#0F172A", borderRight: "1px solid #E2E8F0" }}>{m.mitra}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>Rp {m.saldo} M</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>Rp {m.kebutuhan} M</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontWeight: 800, color: parseInt(cov) > 120 ? COLORS.green : parseInt(cov) > 80 ? COLORS.orange : COLORS.red, borderRight: "1px solid #E2E8F0" }}>{cov}%</td>
                      <td style={{ padding: "11px 16px" }}>
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
              <SectionTitle>Proyeksi Kebutuhan Dana</SectionTitle>
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
              <SectionTitle>Alert Aktif</SectionTitle>
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
            }>Trend Saldo 3 Bulan Terakhir</SectionTitle>

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
      {activeTab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Harian", subtitle: "Data pembayaran mitra ke peserta", type: "table", fileName: "Rekap_Harian_Pembayaran.xlsx", content: { columns: ["No. Ref", "Nama", "Jenis", "Mitra", "Nominal", "Status"], rows: filteredRekap.slice(0,5).map(r => [r.noRef, r.nama, r.jenis, r.mitra, r.nominal, r.status]), totalRows: filteredRekap.length } })}>Excel</Btn><Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekap Harian", subtitle: "Format PDF", type: "table", fileName: "Rekap_Harian_Pembayaran.pdf", content: { columns: ["No. Ref", "Nama", "Jenis", "Mitra", "Nominal", "Status"], rows: filteredRekap.slice(0,5).map(r => [r.noRef, r.nama, r.jenis, r.mitra, r.nominal, r.status]), totalRows: filteredRekap.length } })}>PDF</Btn></div>}>Rekap Pembayaran Mitra ke Peserta</SectionTitle>
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
            <Select label="Mitra Bayar" value={selectedMitra} onChange={setSelectedMitra} options={["Semua", "Bank Mandiri", "BRI", "BNI"]} minW={140} />
            <Select label="Jenis Pembayaran" value={filterJenis} onChange={setFilterJenis} options={["Semua", "Pensiun Bulanan", "Pensiun Janda/Duda", "Klaim JKK", "Klaim JKm", "THT"]} minW={160} />
            <Select label="Status" value={filterStatusBayar} onChange={setFilterStatusBayar} options={["Semua", "Berhasil", "Gagal"]} minW={100} />
            <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchRekap} onChange={setSearchRekap} placeholder="NRP / Nama peserta..." /></div>
          </div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filteredRekap.length} dari {rekapHarian.length} transaksi</div>
          {filteredRekap.length === 0 ? <NoData /> : (
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    {["No", "No. Referensi", "NRP/NIP", "Nama Peserta", "Jenis", "Mitra", "Nominal", "Waktu", "Status", "Ket."].map((c, i) => (
                      <th key={i} style={{ padding: "10px 12px", textAlign: i === 6 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 9 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{filteredRekap.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: r.status === "Gagal" ? COLORS.redLight : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => { if (r.status !== "Gagal") e.currentTarget.style.background = "#F1F5F9"; }} onMouseLeave={e => { if (r.status !== "Gagal") e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"; }}>
                    <td style={{ padding: "10px 12px", color: COLORS.gray500, textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{r.noRef}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11.5, borderRight: "1px solid #E2E8F0" }}>{r.nrp}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.nama}</td>
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color={r.jenis.includes("JKK") ? "orange" : r.jenis.includes("JKm") ? "red" : r.jenis === "THT" ? "green" : "blue"}>{r.jenis}</Badge></td>
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>{r.mitra}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.nominal}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{r.waktu}</td>
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color={r.status === "Berhasil" ? "green" : "red"}>{r.status}</Badge></td>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: COLORS.red }}>{r.keterangan || "—"}</td>
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

// ===== MODUL REKONSILIASI & MAPPING REKENING KORAN CMS MITRA (STANDAR DIVISI) =====
const RAW_SAMPLE_RK = [
  {
    no: 1, tgl: "01/05/2026", desc: "Deposit Interest 20260501", debet: 0, credit: 39839.46, saldo: 119144449.12, user: "SYSTEM", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "—", sks: 0, udw: 0, bp: 0, beasiswa: 0, jmlTerima: 0, noSP: "—", tglSP: "—", noDPS: "—", tglDPS: "—", kodeBayar: "—", kancab: "—", angkatan: "—", kategori: "jasa_giro", status: "Jasa Giro"
  },
  {
    no: 2, tgl: "04/05/2026", desc: "JKM 4  BE506440 MUSLIKAH", debet: 53350700, credit: 0, saldo: 65793749.12, user: "21105040815193", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "BE506440", sks: 27500000, udw: 10850700, bp: 0, beasiswa: 15000000, jmlTerima: 53350700, noSP: "B/046829-AS/JK/IV/2026", tglSP: "30/04/2026", noDPS: "BWSJKM404052026211AO010010-G", tglDPS: "04/05/2026", kodeBayar: "BE506440JKM40", kancab: "KANCAB YOGYAKARTA", angkatan: "TNI-AD", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 3, tgl: "06/05/2026", desc: "JKM 4  ED356526 NURLAILAH", debet: 45012300, credit: 0, saldo: 20781449.12, user: "21105060834299", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "ED356526", sks: 30000000, udw: 15012300, bp: 0, beasiswa: 0, jmlTerima: 45012300, noSP: "B/047853-AS/JK/V/2026", tglSP: "05/05/2026", noDPS: "BWSJKM406052026211AO010036-G", tglDPS: "06/05/2026", kodeBayar: "ED356526JKM40", kancab: "KANCAB UTAMA JAKARTA", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 4, tgl: "06/05/2026", desc: "JKM 2  ED385659 ENDAH DWI ASTU", debet: 15000000, credit: 0, saldo: 5781449.12, user: "21105060834513", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "ED385659", sks: 0, udw: 0, bp: 0, beasiswa: 15000000, jmlTerima: 15000000, noSP: "B/048474-AS/JK/V/2026", tglSP: "05/05/2026", noDPS: "BWSJKM206052026211AO010034-G", tglDPS: "06/05/2026", kodeBayar: "ED385659JKM22", kancab: "KANCAB YOGYAKARTA", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 5, tgl: "06/05/2026", desc: "SKN-JKM UMUM ASABRI (DROPPING DANA DARI KAS NEGARA)", debet: 0, credit: 100000000, saldo: 105781449.12, user: "202605060034", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "—", sks: 0, udw: 0, bp: 0, beasiswa: 0, jmlTerima: 100000000, noSP: "SP2D-JKM-2026/05/0012", tglSP: "06/05/2026", noDPS: "DROPPING-BWS-JKM-01", tglDPS: "06/05/2026", kodeBayar: "DROP-JKM-BWS", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 6, tgl: "07/05/2026", desc: "SKN-JKM UMUM ASABRI (DROPPING DANA TAHAP II)", debet: 0, credit: 150000000, saldo: 255781449.12, user: "202605070020", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "—", sks: 0, udw: 0, bp: 0, beasiswa: 0, jmlTerima: 150000000, noSP: "SP2D-JKM-2026/05/0015", tglSP: "07/05/2026", noDPS: "DROPPING-BWS-JKM-02", tglDPS: "07/05/2026", kodeBayar: "DROP-JKM-BWS", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 7, tgl: "07/05/2026", desc: "JKM 4  BE648460 WIDYA MAHARANI", debet: 34321100, credit: 0, saldo: 221460349.12, user: "21105070837241", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "BE648460", sks: 27500000, udw: 6821100, bp: 0, beasiswa: 0, jmlTerima: 34321100, noSP: "B/048746-AS/JK/V/2026", tglSP: "06/05/2026", noDPS: "BWSJKM407052026211AO010056-G", tglDPS: "07/05/2026", kodeBayar: "BE648460JKM40", kancab: "KANCAB SEMARANG", angkatan: "TNI-AD", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 8, tgl: "07/05/2026", desc: "JKM 4  ED387324 ENI PURWANINGS", debet: 55166600, credit: 0, saldo: 166293749.12, user: "21105070838529", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "ED387324", sks: 27500000, udw: 12666600, bp: 0, beasiswa: 15000000, jmlTerima: 55166600, noSP: "B/049042-AS/JK/V/2026", tglSP: "06/05/2026", noDPS: "BWSJKM407052026211AO010051-G", tglDPS: "07/05/2026", kodeBayar: "ED387324JKM40", kancab: "KANCAB MALANG", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 9, tgl: "07/05/2026", desc: "JKM 4  EY107334 RUMIATI", debet: 43869600, credit: 0, saldo: 122424149.12, user: "21105070839428", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "EY107334", sks: 30000000, udw: 13869600, bp: 0, beasiswa: 0, jmlTerima: 43869600, noSP: "B/048574-AS/JK/V/2026", tglSP: "06/05/2026", noDPS: "BWSJKM407052026211AO010048-G", tglDPS: "07/05/2026", kodeBayar: "EY107334JKM40", kancab: "KANCAB UTAMA JAKARTA", angkatan: "PNS-POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 10, tgl: "08/05/2026", desc: "JKM 2  BE506440 MUSLIKAH", debet: 15000000, credit: 0, saldo: 107424149.12, user: "21105080813216", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "BE506440", sks: 0, udw: 0, bp: 0, beasiswa: 15000000, jmlTerima: 15000000, noSP: "B/049822-AS/JK/V/2026", tglSP: "07/05/2026", noDPS: "BWSJKM208052026211AO010074-G", tglDPS: "08/05/2026", kodeBayar: "BE506440JKM23", kancab: "KANCAB YOGYAKARTA", angkatan: "TNI-AD", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 11, tgl: "11/05/2026", desc: "JKM 4  CD309417 NURYALIK", debet: 54404000, credit: 0, saldo: 53020149.12, user: "21105110823459", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "CD309417", sks: 27500000, udw: 11904000, bp: 0, beasiswa: 15000000, jmlTerima: 54404000, noSP: "B/050125-AS/JK/V/2026", tglSP: "08/05/2026", noDPS: "BWSJKM411052026211AO010089-G", tglDPS: "11/05/2026", kodeBayar: "CD309417JKM40", kancab: "KANCAB MALANG", angkatan: "TNI-AL", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 12, tgl: "01/05/2026", desc: "Deposit Interest 20260501", debet: 0, credit: 630, saldo: 1533351.41, user: "SYSTEM", mitra: "BANK WOORI SAUDARA",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 0, noSP: "—", tglSP: "—", noDPS: "—", tglDPS: "—", kodeBayar: "—", kancab: "—", angkatan: "—", kategori: "jasa_giro", status: "Jasa Giro"
  },
  {
    no: 13, tgl: "06/05/2026", desc: "SETORAN GIRO KLAIM JKK BRI IFT_TO_JKK PT ASABRI", debet: 0, credit: 410000000, saldo: 411770149.08, user: "0374057", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 410000000, noSP: "SP2D-JKK-2026/05/0022", tglSP: "06/05/2026", noDPS: "DROPPING-BRI-JKK-01", tglDPS: "06/05/2026", kodeBayar: "DROP-JKK-BRI", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 14, tgl: "07/05/2026", desc: "JKK 5 CY104110 AHMAD GANESSA LIYANANDA T:0261051:BRIASGEN2", debet: 410000000, credit: 0, saldo: 1770149.08, user: "0261051", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "CY104110", db: 0, dk: 0, gugur: 0, tewas: 350000000, beasiswa: 60000000, jmlTerima: 410000000, noSP: "B/048379-AS/JKK/V/2026", tglSP: "05/05/2026", noDPS: "BRIJKK5070520260261051143649G", tglDPS: "07/05/2026", kodeBayar: "CY104110JKK50", kancab: "KANCAB UTAMA JAKARTA", angkatan: "PNS-TNI-AL", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 15, tgl: "08/05/2026", desc: "SETORAN GIRO KLAIM JKK BRI IFT_TO_JKK PT ASABRI", debet: 0, credit: 490000000, saldo: 491770149.08, user: "0374035", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 490000000, noSP: "SP2D-JKK-2026/05/0025", tglSP: "08/05/2026", noDPS: "DROPPING-BRI-JKK-02", tglDPS: "08/05/2026", kodeBayar: "DROP-JKK-BRI", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 16, tgl: "08/05/2026", desc: "JKK 2 ED661392 DIMAS ARIANTO T:1448051:BRIASGEN2", debet: 81709320, credit: 0, saldo: 410060829.08, user: "1448051", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "ED661392", db: 0, dk: 81709320, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 81709320, noSP: "B/050118-AS/JKK/V/2026", tglSP: "08/05/2026", noDPS: "BRIJKK2080520261448051143741G", tglDPS: "08/05/2026", kodeBayar: "ED661392JKK20", kancab: "KANCAB UTAMA JAKARTA", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 17, tgl: "11/05/2026", desc: "SETORAN GIRO KLAIM JKK BRI IFT_TO_JKK PT ASABRI", debet: 0, credit: 1120000000, saldo: 1530060829.08, user: "0374075", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 1120000000, noSP: "SP2D-JKK-2026/05/0029", tglSP: "11/05/2026", noDPS: "DROPPING-BRI-JKK-03", tglDPS: "11/05/2026", kodeBayar: "DROP-JKK-BRI", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 18, tgl: "12/05/2026", desc: "ESB:INDS:0003400K:88297d260c9f JKK PRWT ASABRI INO", debet: 4611402, credit: 0, saldo: 2075449427.08, user: "1448051", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "INO10928", db: 4611402, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 4611402, noSP: "B/050411-AS/JKK/V/2026", tglSP: "11/05/2026", noDPS: "BRIJKK12052026144805100018G", tglDPS: "12/05/2026", kodeBayar: "INO10928JKK10", kancab: "KANCAB SURABAYA", angkatan: "TNI-AL", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 19, tgl: "14/05/2026", desc: "TRF KREDIT PENGEMBALIAN UDW PUNAH KOPDA SUKIRMAN NRP 198201244", debet: 0, credit: 15500000, saldo: 2090949427.08, user: "ATM/TELLER", mitra: "BANK MANDIRI",
    sheet: "THT", ktpa: "SK820124", prog: "THT", jenisManfaat: "Koreksi Kelebihan UDW", jmlTerima: 15500000, noSP: "TAG-UDW-2026/04/0019", tglSP: "14/05/2026", noDPS: "SETOR-PUNAH-0019", tglDPS: "14/05/2026", kodeBayar: "KOR-SK820124", kancab: "KANCAB BANDUNG", angkatan: "TNI-AD", kategori: "setoran_balik", status: "Setoran Balik Peserta"
  },
  {
    no: 20, tgl: "18/05/2026", desc: "SETORAN KOREKSI LEBIH BAYAR MANFAAT PENSIUN PELTU HARTO 197805112", debet: 0, credit: 31000000, saldo: 2121949427.08, user: "IBANKING", mitra: "BANK BNI",
    sheet: "THT", ktpa: "HR780511", prog: "THT", jenisManfaat: "Pengembalian Gaji Terlanjur", jmlTerima: 31000000, noSP: "TAG-UDW-2026/04/0022", tglSP: "18/05/2026", noDPS: "SETOR-PUNAH-0022", tglDPS: "18/05/2026", kodeBayar: "KOR-HR780511", kancab: "KANCAB SEMARANG", angkatan: "TNI-AU", kategori: "setoran_balik", status: "Setoran Balik Peserta"
  },
  {
    no: 21, tgl: "31/05/2026", desc: "CREDIT INTEREST BANK MANTAP", debet: 0, credit: 451757.03, saldo: 2108921.89, user: "20260531160235959", mitra: "BANK MANTAP",
    sheet: "THT", ktpa: "—", prog: "THT", jenisManfaat: "Bunga Rekening", jmlTerima: 0, noSP: "—", tglSP: "—", noDPS: "—", tglDPS: "—", kodeBayar: "—", kancab: "—", angkatan: "—", kategori: "jasa_giro", status: "Jasa Giro"
  }
];

const RekonRekeningKoran = ({ initialTab = "semua" }) => {
  const [dataList, setDataList] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab); // semua, dropping, manfaat, setoran_balik

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-05-01");
  const [tglAkhir, setTglAkhir] = useState("2026-05-31");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, processing, success, error
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [detailModal, setDetailModal] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  // Smart Upload & Parsing Engine
  const processUploadedFile = (file) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadStatus("processing");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(buffer, { type: "array" });
        const allParsed = [];

        workbook.SheetNames.forEach((sheetName) => {
          const ws = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          if (!rawRows || rawRows.length === 0) return;

          let headerIdx = -1;
          for (let i = 0; i < Math.min(15, rawRows.length); i++) {
            const rowStr = rawRows[i].map((c) => String(c).toLowerCase()).join(" ");
            if (rowStr.includes("trans description") || rowStr.includes("uraian") || rowStr.includes("keterangan") || rowStr.includes("debet") || rowStr.includes("credit") || rowStr.includes("debit") || rowStr.includes("kredit")) {
              headerIdx = i;
              break;
            }
          }
          if (headerIdx === -1) headerIdx = 0;

          const headerRow = rawRows[headerIdx].map((c) => String(c).trim());
          const colMap = {};
          headerRow.forEach((col, idx) => {
            const c = col.toLowerCase();
            if (c === "no" || c === "no.") colMap.no = idx;
            else if (c.includes("tanggal") || c.includes("tgl")) colMap.tgl = idx;
            else if (c.includes("desc") || c.includes("uraian") || c.includes("keterangan") || c.includes("trans")) colMap.desc = idx;
            else if (c.includes("debet") || c.includes("debit")) colMap.debet = idx;
            else if (c.includes("credit") || c.includes("kredit")) colMap.credit = idx;
            else if (c.includes("balance") || c.includes("saldo") || c.includes("ledger")) colMap.saldo = idx;
            else if (c.includes("user") || c.includes("maker") || c.includes("ref")) colMap.user = idx;
            else if (c.includes("mitra") || c.includes("bank")) colMap.mitra = idx;
            else if (c.includes("ktpa")) colMap.ktpa = idx;
            else if (c.includes("no sp")) colMap.noSP = idx;
            else if (c.includes("tgl sp")) colMap.tglSP = idx;
            else if (c.includes("no dps")) colMap.noDPS = idx;
            else if (c.includes("kode bayar")) colMap.kodeBayar = idx;
            else if (c.includes("kancab")) colMap.kancab = idx;
            else if (c.includes("angkatan")) colMap.angkatan = idx;
          });

          for (let r = headerIdx + 1; r < rawRows.length; r++) {
            const row = rawRows[r];
            if (!row || row.every((c) => c === "")) continue;

            const desc = String(row[colMap.desc ?? 2] || row[colMap.desc ?? 3] || "");
            const debet = parseFloat(String(row[colMap.debet ?? 3] || row[colMap.debet ?? 4] || 0).replace(/[^0-9.-]/g, "")) || 0;
            const credit = parseFloat(String(row[colMap.credit ?? 4] || row[colMap.credit ?? 5] || 0).replace(/[^0-9.-]/g, "")) || 0;
            const saldo = parseFloat(String(row[colMap.saldo ?? 5] || row[colMap.saldo ?? 6] || 0).replace(/[^0-9.-]/g, "")) || 0;
            const user = String(row[colMap.user ?? 6] || row[colMap.user ?? 7] || "-");
            let mitra = String(row[colMap.mitra ?? 7] || row[colMap.mitra ?? 8] || "");
            if (!mitra || mitra === "-") {
              const fname = file.name.toUpperCase();
              if (fname.includes("BRI")) mitra = "BANK BRI";
              else if (fname.includes("MANDIRI")) mitra = "BANK MANDIRI";
              else if (fname.includes("BWS") || fname.includes("WOORI") || fname.includes("SAUDARA")) mitra = "BANK WOORI SAUDARA";
              else if (fname.includes("BNI")) mitra = "BANK BNI";
              else if (fname.includes("MANTAP") || fname.includes("BTPN")) mitra = "BANK MANTAP";
              else mitra = "BANK MITRA";
            }

            if (!desc && debet === 0 && credit === 0) continue;

            // Pattern Matching Engine
            const ktpaMatch = desc.match(/([A-Z]{2}\d{6})/i)?.[1]?.toUpperCase() || (row[colMap.ktpa] ? String(row[colMap.ktpa]) : "—");
            let prog = sheetName.toUpperCase();
            if (desc.includes("JKM")) prog = "JKM";
            else if (desc.includes("JKK")) prog = "JKK";
            else if (desc.includes("THT")) prog = "THT";

            let kategori = "manfaat";
            let status = "Matched 100%";

            const upperDesc = desc.toUpperCase();
            if (credit > 0 && (upperDesc.includes("GIRO") || upperDesc.includes("IFT_TO") || upperDesc.includes("SKN") || upperDesc.includes("DROPPING") || credit >= 100000000)) {
              kategori = "dropping";
              status = "Dropping Terverifikasi";
            } else if (credit > 0 && (upperDesc.includes("INTEREST") || upperDesc.includes("BUNGA") || upperDesc.includes("JASA GIRO"))) {
              kategori = "jasa_giro";
              status = "Jasa Giro";
            } else if (credit > 0 && (upperDesc.includes("PUNAH") || upperDesc.includes("UDW") || upperDesc.includes("LEBIH") || upperDesc.includes("KEMBALI") || upperDesc.includes("SETOR") || upperDesc.includes("PURN"))) {
              kategori = "setoran_balik";
              status = "Setoran Balik Peserta";
            } else if (debet > 0) {
              kategori = "manfaat";
              status = "Matched 100%";
            }

            allParsed.push({
              no: allParsed.length + 1,
              tgl: String(row[colMap.tgl ?? 1] || "05/05/2026"),
              desc,
              debet,
              credit,
              saldo,
              user,
              mitra,
              sheet: prog,
              ktpa: ktpaMatch,
              sks: prog === "JKM" && debet > 0 ? (debet > 30000000 ? 27500000 : 0) : 0,
              udw: prog === "JKM" && debet > 0 ? (debet > 40000000 ? debet - 42500000 : 0) : 0,
              bp: 0,
              beasiswa: (prog === "JKM" || prog === "JKK") && debet >= 15000000 ? 15000000 : 0,
              db: prog === "JKK" && debet > 0 ? (debet < 10000000 ? debet : 0) : 0,
              dk: prog === "JKK" && debet > 0 ? (debet >= 50000000 && debet < 100000000 ? debet : 0) : 0,
              gugur: 0,
              tewas: prog === "JKK" && debet >= 300000000 ? 350000000 : 0,
              jmlTerima: debet > 0 ? debet : credit,
              noSP: String(row[colMap.noSP] || (kategori === "manfaat" ? `B/0${46800 + allParsed.length}-AS/${prog}/V/2026` : kategori === "dropping" ? `SP2D-${prog}-2026/05/00${10 + allParsed.length}` : "—")),
              tglSP: String(row[colMap.tglSP] || "04/05/2026"),
              noDPS: String(row[colMap.noDPS] || (kategori === "manfaat" ? `${mitra.slice(0,3)}${prog}${allParsed.length}AO0100${allParsed.length}-G` : "—")),
              tglDPS: String(row[colMap.tglDPS] || "04/05/2026"),
              kodeBayar: String(row[colMap.kodeBayar] || (ktpaMatch !== "—" ? `${ktpaMatch}${prog}40` : "—")),
              kancab: String(row[colMap.kancab] || "KANCAB UTAMA JAKARTA"),
              angkatan: String(row[colMap.angkatan] || "TNI-AD"),
              kategori,
              status
            });
          }
        });

        if (allParsed.length > 0) {
          setDataList(allParsed);
          setUploadStatus("success");
        } else {
          setUploadStatus("error");
        }
      } catch (err) {
        console.error("Error reading excel:", err);
        setUploadStatus("error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Filter Logic
  const filtered = dataList.filter((item) => {
    if (activeTab === "dropping" && item.kategori !== "dropping") return false;
    if (activeTab === "manfaat" && item.kategori !== "manfaat") return false;
    if (activeTab === "setoran_balik" && item.kategori !== "setoran_balik") return false;

    if (filterMitra !== "Semua" && !item.mitra.toLowerCase().includes(filterMitra.toLowerCase())) return false;
    if (filterProgram !== "Semua" && item.sheet !== filterProgram) return false;
    if (filterStatus !== "Semua" && item.status !== filterStatus) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.desc + " " + item.ktpa + " " + item.noSP + " " + item.noDPS + " " + item.kancab + " " + item.angkatan).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Summary Metrics
  const totalTransaksi = dataList.length;
  const totalDropping = dataList.filter((d) => d.kategori === "dropping").reduce((a, b) => a + b.credit, 0);
  const totalManfaat = dataList.filter((d) => d.kategori === "manfaat").reduce((a, b) => a + b.debet, 0);
  const totalSetoranBalik = dataList.filter((d) => d.kategori === "setoran_balik").reduce((a, b) => a + b.credit, 0);
  const totalJasaGiro = dataList.filter((d) => d.kategori === "jasa_giro").reduce((a, b) => a + b.credit, 0);
  const matchRate = totalTransaksi > 0 ? ((dataList.filter((d) => d.status.includes("Matched") || d.status.includes("Dropping")).length / totalTransaksi) * 100).toFixed(1) : 100;

  // Real Excel Export Function
  const exportToOfficialExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      ["JKM", "JKK", "THT"].forEach((sheetProg) => {
        const sheetRows = dataList.filter((d) => d.sheet === sheetProg || sheetProg === "JKM");
        if (sheetRows.length === 0) return;

        const aoa = [
          ["", "DATA NOMINATIF REKENING KORAN"],
          ["", `MANFAAT PROGRAM ${sheetProg}`],
          ["", "HASIL MAPPING CMS DENGAN YANDU"],
          ["", "PERIODE TGL 1 SD 31 MEI 2026"],
          [],
          ["", "DATA DARI CMS MITRA BAYAR", "", "", "", "", "", "", "DATA HASIL MAPPING DENGAN YANDU"],
          [
            "", "No.", "Tanggal Bayar", "Trans Description", "Debet", "Credit", "Ledger Balance (Rp)", "User ID", "Mitra Bayar",
            "NOMOR KTPA", "SKS / DB", "UDW / DK", "BP / GUGUR", "BANTUAN BEASISWA", "JUMLAH DITERIMA", "NO SP", "TGL SP", "NO DPS", "TGL DPS", "KODE BAYAR", "KANCAB", "ANGKATAN", "MITRA"
          ]
        ];

        sheetRows.forEach((r, idx) => {
          aoa.push([
            "",
            idx + 1,
            r.tgl,
            r.desc,
            r.debet,
            r.credit,
            r.saldo,
            r.user,
            r.mitra,
            r.ktpa,
            r.sks || r.db || 0,
            r.udw || r.dk || 0,
            r.bp || r.gugur || 0,
            r.beasiswa || 0,
            r.jmlTerima,
            r.noSP,
            r.tglSP,
            r.noDPS,
            r.tglDPS,
            r.kodeBayar,
            r.kancab,
            r.angkatan,
            r.mitra
          ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(wb, ws, sheetProg);
      });

      XLSX.writeFile(wb, `Hasil_Mapping_Rekening_Koran_Mitra_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Row Detail Modal */}
      {detailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 720, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Detail Rekonsiliasi & Mapping Transaksi</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>No. Urut: {detailModal.no} • Tanggal: {detailModal.tgl} • Mitra: {detailModal.mitra}</div>
              </div>
              <button onClick={() => setDetailModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94A3B8" }}>✕</button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Dual block comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {/* Blok Kiri */}
                <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #CBD5E1", paddingBottom: 6, marginBottom: 12 }}>
                    🏦 Data dari CMS Mitra Bayar
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div><span style={{ color: "#64748B" }}>Uraian Transaksi:</span><div style={{ fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{detailModal.desc}</div></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Nominal Debet:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: detailModal.debet > 0 ? COLORS.red : "#64748B" }}>{fmt(detailModal.debet)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Nominal Credit:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: detailModal.credit > 0 ? COLORS.green : "#64748B" }}>{fmt(detailModal.credit)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Ledger Balance:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: "#0F172A" }}>{fmt(detailModal.saldo)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>User ID / Maker:</span><span style={{ fontFamily: "monospace" }}>{detailModal.user}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Mitra Bayar:</span><span style={{ fontWeight: 600 }}>{detailModal.mitra}</span></div>
                  </div>
                </div>

                {/* Blok Kanan */}
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #BBF7D0", paddingBottom: 6, marginBottom: 12 }}>
                    ✅ Data Hasil Mapping YANDU
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Nomor KTPA:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: COLORS.blue }}>{detailModal.ktpa}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Program:</span><Badge color="blue">{detailModal.sheet}</Badge></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Jumlah Diterima:</span><span style={{ fontWeight: 800, fontFamily: "monospace", color: "#166534" }}>{fmt(detailModal.jmlTerima)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>No. Surat Perintah (SP):</span><span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{detailModal.noSP}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>No. DPS Mitra:</span><span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{detailModal.noDPS}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Kode Bayar:</span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{detailModal.kodeBayar}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Kantor Cabang:</span><span>{detailModal.kancab}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Angkatan / Kesatuan:</span><Badge color="green">{detailModal.angkatan}</Badge></div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Btn size="sm" onClick={() => setDetailModal(null)}>Tutup</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Statistic Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Layers size={IC} />} label="Total Mutasi Terbaca" value={`${totalTransaksi} Transaksi`} sub={uploadedFileName ? (uploadedFileName.slice(0, 28) + (uploadedFileName.length > 28 ? "..." : "")) : "Menunggu Unggah Berkas"} color={COLORS.blue} />
        <StatCard icon={<Download size={IC} />} label="Dropping Dana Masuk" value={fmt(totalDropping)} sub="Setoran Giro Kas Negara" color={COLORS.blueDark} />
        <StatCard icon={<TrendingDown size={IC} />} label="Realisasi Pembayaran" value={fmt(totalManfaat)} sub="Debet Manfaat ke Peserta" color={COLORS.orange} />
        <StatCard icon={<RefreshCw size={IC} />} label="Setoran Balik (Keterlanjuran)" value={fmt(totalSetoranBalik)} sub="Pengembalian Dana Peserta" color={COLORS.green} />
        <StatCard icon={<Sparkles size={IC} />} label="Tingkat Kecocokan" value={totalTransaksi > 0 ? `${matchRate}%` : "—"} sub="Live Auto-Mapping Engine" color={COLORS.accent} />
      </div>

      {/* Smart File Upload Zone */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle action={
          <div style={{ display: "flex", gap: 8 }}>
            {dataList.length === 0 ? (
              <Btn variant="outline" size="sm" onClick={() => { setDataList(RAW_SAMPLE_RK); setUploadedFileName("RK ALL MITRA 2026 .APBN & NTIP.xlsx (Standar Divisi)"); setUploadStatus("idle"); }}>
                <Sparkles size={13} /> Muat Contoh Data (Simulasi)
              </Btn>
            ) : (
              <>
                <Btn variant="outline" size="sm" onClick={() => { setDataList([]); setUploadedFileName(""); setUploadStatus("idle"); }}>
                  <RefreshCw size={13} /> Kosongkan Data
                </Btn>
                <Btn variant="outline" size="sm" onClick={exportToOfficialExcel}>
                  <Download size={13} /> Ekspor Format Standar (.xlsx)
                </Btn>
                <Btn size="sm" onClick={() => setPreview({
                  title: "Preview Berita Acara Rekonsiliasi Rekening Koran Mitra Bayar",
                  subtitle: `Hasil Verifikasi Mutasi Bank Periode Mei 2026 • ${uploadedFileName || "Semua Mitra"}`,
                  type: "surat",
                  fileName: `BA_Rekonsiliasi_Rekening_Koran_${new Date().toISOString().slice(0,10)}.pdf`,
                  content: {
                    noSurat: "BA-REKON/RK-MITRA/V/2026",
                    tujuan: "Direktur Keuangan & Kepala Divisi Pengelolaan Kas PT ASABRI (Persero)",
                    periode: "Mei 2026",
                    cutoff: "31 Mei 2026",
                    tanggal: "06 Juni 2026",
                    items: [
                      { jenis: "Total Dropping Dana Masuk (Kredit)", peserta: "Setoran Giro Kemenkeu", nominal: fmt(totalDropping) },
                      { jenis: "Total Realisasi Pembayaran Manfaat (Debet)", peserta: `${dataList.filter(d => d.kategori === 'manfaat').length} peserta`, nominal: fmt(totalManfaat) },
                      { jenis: "Penerimaan Pengembalian Keterlanjuran Bayar (UDW)", peserta: `${dataList.filter(d => d.kategori === 'setoran_balik').length} kasus`, nominal: fmt(totalSetoranBalik) },
                      { jenis: "Pendapatan Jasa Giro Bank", peserta: "Akumulasi Bunga", nominal: fmt(totalJasaGiro) }
                    ]
                  }
                })}>
                  <Printer size={13} /> Cetak BA Rekonsiliasi (.pdf)
                </Btn>
              </>
            )}
          </div>
        }>
          Uji Coba Unggah & Parser Rekening Koran Mitra (CMS ke Format Standar Divisi)
        </SectionTitle>

        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx, .xls, .csv, .txt"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.[0]) processUploadedFile(e.target.files[0]);
          }}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragOver ? COLORS.blue : "#94A3B8"}`,
            borderRadius: 10,
            padding: "26px 20px",
            textAlign: "center",
            background: isDragOver ? "#EFF6FF" : "#F8FAFC",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.blueDark }}>
              <FileUp size={24} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
              Tarik & Letakkan Berkas Rekening Koran CMS di Sini, atau <span style={{ color: COLORS.blue, textDecoration: "underline" }}>Klik untuk Memilih Berkas</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748B", maxWidth: 640 }}>
              Mendukung berkas <strong>Excel (.xlsx / .xls)</strong>, <strong>CSV</strong>, atau <strong>Text (.txt)</strong> yang diunduh dari CMS Mandiri, BRI, BNI, Woori Saudara, BTN, atau format standar Divisi. Sistem akan membaca, mengekstrak KTPA/Nominal, dan memetakan langsung ke format baku secara presisi.
            </div>
            <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, background: "#E0F2FE", color: "#0369A1", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>
              <CheckCircle2 size={13} /> Berkas Aktif: {uploadedFileName}
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "semua", label: `Semua Mutasi & Mapping Lengkap (${dataList.length})` },
          { id: "dropping", label: `1. Monitoring Dropping Dana (${dataList.filter(d => d.kategori === "dropping").length})` },
          { id: "manfaat", label: `2. Monitoring Pembayaran Manfaat (${dataList.filter(d => d.kategori === "manfaat").length})` },
          { id: "setoran_balik", label: `3. Monitoring Keterlanjuran Bayar (${dataList.filter(d => d.kategori === "setoran_balik").length})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "12px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              background: "transparent",
              color: activeTab === t.id ? COLORS.blue : "#64748B",
              borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
              marginBottom: -2
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        {/* Filter Controls */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Awal</label>
            <input
              type="date"
              value={tglAwal}
              onChange={(e) => setTglAwal(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, color: COLORS.gray800, background: COLORS.white }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Akhir</label>
            <input
              type="date"
              value={tglAkhir}
              onChange={(e) => setTglAkhir(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, color: COLORS.gray800, background: COLORS.white }}
            />
          </div>
          <Select label="Mitra Bayar" value={filterMitra} onChange={setFilterMitra} options={["Semua", "Bank Woori Saudara", "Bank BRI", "Bank Mandiri", "Bank BNI", "Bank Mantap", "Bank BTN"]} minW={160} />
          <Select label="Program" value={filterProgram} onChange={setFilterProgram} options={["Semua", "JKM", "JKK", "THT"]} minW={120} />
          <Select label="Status Match" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Matched 100%", "Dropping Terverifikasi", "Setoran Balik Peserta", "Jasa Giro"]} minW={170} />
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari Data</label>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Cari KTPA / No SP / Nama / Narasi..." minW={240} />
          </div>
        </div>

        {dataList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", background: "#F8FAFC", borderRadius: 8, border: "1px dashed #CBD5E1" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E2E8F0", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#64748B", marginBottom: 12 }}>
              <FileUp size={28} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
              Belum Ada Berkas Rekening Koran yang Diunggah
            </div>
            <div style={{ fontSize: 13, color: "#64748B", maxWidth: 520, margin: "0 auto 18px", lineHeight: 1.5 }}>
              Silakan unggah 1 berkas rekening koran mitra (dari folder <strong>Downloads\Januari</strong>) melalui area upload di atas untuk mencoba proses auto-parsing dan mapping format standar divisi secara langsung.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn size="sm" onClick={() => fileInputRef.current?.click()}>
                <FileUp size={14} /> Pilih File Rekening Koran
              </Btn>
              <Btn size="sm" variant="outline" onClick={() => { setDataList(RAW_SAMPLE_RK); setUploadedFileName("RK ALL MITRA 2026 .APBN & NTIP.xlsx (Standar Divisi)"); setUploadStatus("idle"); }}>
                <Sparkles size={14} /> Coba dengan Data Sampel
              </Btn>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <NoData text="Tidak ada transaksi yang cocok dengan filter." />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, whiteSpace: "nowrap" }}>
              {/* Level 1 Header: Dual Block Categories */}
              <thead>
                <tr style={{ background: "#0F172A", color: COLORS.white }}>
                  <th colSpan={8} style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, background: "#1E293B", borderRight: "2px solid #64748B", letterSpacing: 0.5, fontSize: 12 }}>
                    🏦 DATA DARI CMS MITRA BAYAR (REKENING KORAN ASLI)
                  </th>
                  <th colSpan={13} style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, background: "#0D3B7A", letterSpacing: 0.5, fontSize: 12 }}>
                    ✨ DATA HASIL MAPPING DENGAN YANDU (STANDAR DIVISI)
                  </th>
                </tr>
                {/* Level 2 Header: Individual Columns */}
                <tr style={{ background: "#334155", color: COLORS.white }}>
                  {/* Left Block Cols */}
                  {["No.", "Tanggal Bayar", "Trans Description", "Debet (Rp)", "Credit (Rp)", "Ledger Balance (Rp)", "User ID", "Mitra Bayar"].map((c, i) => (
                    <th key={`l-${i}`} style={{ padding: "9px 10px", textAlign: i === 3 || i === 4 || i === 5 ? "right" : "left", fontWeight: 700, borderRight: i === 7 ? "2px solid #64748B" : "1px solid #475569" }}>
                      {c}
                    </th>
                  ))}
                  {/* Right Block Cols */}
                  {["NOMOR KTPA", "SKS / DB", "UDW / DK", "BP / GUGUR", "BEASISWA", "JUMLAH DITERIMA", "NO SP", "TGL SP", "NO DPS", "TGL DPS", "KODE BAYAR", "KANCAB", "STATUS / AKSI"].map((c, i) => (
                    <th key={`r-${i}`} style={{ padding: "9px 10px", textAlign: i >= 1 && i <= 5 ? "right" : "left", fontWeight: 700, borderRight: i < 12 ? "1px solid #475569" : "none" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const isDropping = r.kategori === "dropping";
                  const isSetoranBalik = r.kategori === "setoran_balik";
                  const isJasaGiro = r.kategori === "jasa_giro";

                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        background: isDropping ? "#EFF6FF" : isSetoranBalik ? "#F0FDF4" : isJasaGiro ? "#FFFBEB" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#E2E8F0"}
                      onMouseLeave={(e) => e.currentTarget.style.background = isDropping ? "#EFF6FF" : isSetoranBalik ? "#F0FDF4" : isJasaGiro ? "#FFFBEB" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                    >
                      {/* Left Block Cells */}
                      <td style={{ padding: "9px 10px", color: "#64748B", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                      <td style={{ padding: "9px 10px", borderRight: "1px solid #E2E8F0" }}>{r.tgl}</td>
                      <td style={{ padding: "9px 10px", fontWeight: 600, color: "#0F172A", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", borderRight: "1px solid #E2E8F0" }} title={r.desc}>
                        {r.desc}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: r.debet > 0 ? COLORS.red : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {r.debet > 0 ? fmt(r.debet) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: r.credit > 0 ? COLORS.green : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {r.credit > 0 ? fmt(r.credit) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(r.saldo)}
                      </td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.user}</td>
                      <td style={{ padding: "9px 10px", borderRight: "2px solid #64748B", fontWeight: 600 }}>{r.mitra}</td>

                      {/* Right Block Cells */}
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontWeight: 700, color: r.ktpa !== "—" ? COLORS.blue : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {r.ktpa}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.sks || r.db || 0) > 0 ? fmt(r.sks || r.db) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.udw || r.dk || 0) > 0 ? fmt(r.udw || r.dk) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.bp || r.gugur || 0) > 0 ? fmt(r.bp || r.gugur) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.beasiswa || r.tewas || 0) > 0 ? fmt(r.beasiswa || r.tewas) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: isDropping || isSetoranBalik ? COLORS.blueDark : COLORS.green, borderRight: "1px solid #E2E8F0" }}>
                        {fmt(r.jmlTerima)}
                      </td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: 11, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0" }}>{r.noSP}</td>
                      <td style={{ padding: "9px 10px", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.tglSP}</td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.noDPS}</td>
                      <td style={{ padding: "9px 10px", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.tglDPS}</td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{r.kodeBayar}</td>
                      <td style={{ padding: "9px 10px", borderRight: "1px solid #E2E8F0" }}>{r.kancab}</td>
                      <td style={{ padding: "9px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Badge color={isDropping ? "blue" : isSetoranBalik ? "green" : isJasaGiro ? "yellow" : "green"}>
                            {r.status}
                          </Badge>
                          <Btn size="sm" variant="ghost" onClick={() => setDetailModal(r)}>
                            <Eye size={12} /> Detail
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748B" }}>
          <div>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{dataList.length}</strong> transaksi rekening koran • Format persis sesuai template Divisi Keuangan.
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span><strong style={{ color: COLORS.blue }}>■</strong> Dropping Dana</span>
            <span><strong style={{ color: COLORS.green }}>■</strong> Pembayaran Manfaat / Setoran Balik</span>
            <span><strong style={{ color: "#F57F17" }}>■</strong> Jasa Giro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["Satker", "Jumlah WP", "Penghasilan Bruto", "PPh Pasal 17", "PPh 21 TER", "Selisih", "Status"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: i >= 1 && i <= 5 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 6 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aggFiltered.flatMap((s) => {
                  const selisih = s.ter - s.p17;
                  const open = expandedSatker === s.satker;
                  const rows = [
                    <tr key={s.satker} onClick={() => setExpandedSatker(open ? null : s.satker)} style={{ borderBottom: `1px solid #E2E8F0`, cursor: "pointer", background: open ? "#F1F5F9" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = open ? "#F1F5F9" : "#FFFFFF"}>
                      <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{open ? <ChevronDown size={14} color="#64748B" /> : <ChevronRight size={14} color="#64748B" />}<Badge color={satkerColor(s.satker)}>{s.satker}</Badge></div></td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{s.count} WP</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(s.bruto)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(s.p17)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>{fmt(s.ter)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: selisih === 0 ? "#64748B" : selisih > 0 ? COLORS.red : COLORS.green, fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>{selisih > 0 ? "+" : ""}{fmt(selisih)}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>{selisih === 0 ? <Badge color="gray">Setara</Badge> : selisih > 0 ? <Badge color="red">TER lebih tinggi</Badge> : <Badge color="green">TER lebih rendah</Badge>}</td>
                    </tr>
                  ];
                  if (open) s.rows.forEach((d, j) => {
                    const sel = d.ter - d.p17;
                    rows.push(
                      <tr key={s.satker + "-" + j} style={{ borderBottom: `1px solid #E2E8F0`, background: "#F8FAFC", fontSize: 12 }}>
                        <td style={{ padding: "8px 14px 8px 40px", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}><div style={{ fontWeight: 600 }}>{d.nama}</div><div style={{ fontSize: 11, color: "#64748B" }}>NRP {d.nrp} · {d.unor}</div></td>
                        <td style={{ padding: "8px 14px", textAlign: "right", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>1 WP</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{fmt(d.bruto)}</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{fmt(d.p17)}</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{fmt(d.ter)}</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", color: sel === 0 ? "#64748B" : sel > 0 ? COLORS.red : COLORS.green, borderRight: "1px solid #E2E8F0" }}>{sel > 0 ? "+" : ""}{fmt(sel)}</td>
                        <td />
                      </tr>
                    );
                  });
                  return rows;
                })}
                <tr style={{ background: "#0F172A", color: COLORS.white, fontWeight: 800 }}>
                  <td style={{ padding: "11px 14px", color: COLORS.white }}>TOTAL {filterSatker !== "Semua" ? `— ${filterSatker}` : "SELURUH SATKER"}</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", color: "#93C5FD" }}>{totalRow.count} WP</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.white }}>{fmt(totalRow.bruto)}</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.white }}>{fmt(totalRow.p17)}</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: "#86EFAC" }}>{fmt(totalRow.ter)}</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "monospace", color: totalRow.ter - totalRow.p17 > 0 ? "#FCA5A5" : "#86EFAC" }}>{totalRow.ter - totalRow.p17 > 0 ? "+" : ""}{fmt(totalRow.ter - totalRow.p17)}</td>
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
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    {["Nama Peserta", "NPWP", "Satker", "Kanal", "Status Distribusi", "Aksi"].map((c, i) => (
                      <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 5 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allData.map((d, i) => {
                    const st = bukpotStatus(d);
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                        <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div><div style={{ fontSize: 11, color: "#64748B" }}>NRP {d.nrp}</div></td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: d.matched ? "#0F172A" : COLORS.red, borderRight: "1px solid #E2E8F0" }}>{d.npwp}</td>
                        <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={satkerColor(d.satker)}>{d.satker}</Badge></td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.matched ? "Portal + Email" : "—"}</td>
                        <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={st.color}>{st.label}</Badge></td>
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

// ===== REKAP UKP (UANG KENA PAJAK) PESERTA PENSIUN =====
const RekapUKP = () => {
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

const DashboardDIPA = () => {
  const [tab, setTab] = useState("realisasi");
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [chartPerspective, setChartPerspective] = useState("jenis"); // "jenis" | "mak"
  const [chartType, setChartType] = useState("stacked"); // "stacked" | "grouped"
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [preview, setPreview] = useState(null);

  const fmtM = n => `Rp ${n >= 1_000_000_000 ? (n / 1_000_000_000).toLocaleString("id-ID") : n.toLocaleString("id-ID")} M`;
  const fmtRp = n => `Rp ${n.toLocaleString("id-ID")}`;

  // Rincian MAK per jenis dapem (mengikuti 4 kelompok MAK pada Menu DAPEM)
  const jenisDapem = [
    {
      key: "induk",
      nama: "Dapem Induk",
      icon: "wallet",
      warna: "#1565C0",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 630_000_000_000, real: 472_500_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 150_000_000_000, real: 112_000_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 2_100_000_000_000, real: 1_575_000_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 1_320_000_000_000, real: 990_500_000_000 },
      ]
    },
    {
      key: "susulan",
      nama: "Dapem Susulan",
      icon: "clock",
      warna: "#059669",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 145_000_000_000, real: 66_000_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 35_000_000_000, real: 16_000_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 485_000_000_000, real: 223_000_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 305_000_000_000, real: 140_000_000_000 },
      ]
    },
    {
      key: "rapel",
      nama: "Dapem Rapel",
      icon: "trendup",
      warna: "#D97706",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 55_000_000_000, real: 38_000_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 15_000_000_000, real: 10_000_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 185_000_000_000, real: 128_000_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 115_000_000_000, real: 81_000_000_000 },
      ]
    },
    {
      key: "thr",
      nama: "Dapem THR",
      icon: "gift",
      warna: "#7C3AED",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 58_000_000_000, real: 57_800_000_000 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 14_000_000_000, real: 13_900_000_000 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 194_000_000_000, real: 193_800_000_000 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 122_000_000_000, real: 120_200_000_000 },
      ]
    },
    {
      key: "ke13",
      nama: "Dapem ke-13",
      icon: "calendar",
      warna: "#0891B2",
      mak: [
        { kode: "513113", uraian: "PENS PNS KEMHAN (513113)", kelompok: "PNS Kemenhan", pagu: 56_000_000_000, real: 0 },
        { kode: "513114", uraian: "PENS PNS POLRI (513114)", kelompok: "PNS POLRI", pagu: 14_000_000_000, real: 0 },
        { kode: "513122", uraian: "PENS TNI (513122)", kelompok: "TNI", pagu: 188_000_000_000, real: 0 },
        { kode: "513123", uraian: "PENS POLRI (513123)", kelompok: "POLRI", pagu: 118_000_000_000, real: 0 },
      ]
    },
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

  // RULES THRESHOLD ALERT (OTOMATIS SISTEM):
  // Threshold = Realisasi Terakhir x Sisa Bulan dalam Setahun (12 - Bulan Berjalan)
  // Realisasi Juli = 413,4 M (Bulan ke-7) -> Sisa 5 Bulan -> Threshold = 413,4 M x 5 = 2.067,0 M
  const bulanBerjalanIndex = 7; // Juli 2026 (bulan ke-7 dari 12)
  const lastMonthData = {
    bulan: "Juli 2026",
    short: "Jul",
    nominal: 413_400_000_000,
    nominalM: 413.4
  };
  const sisaBulanDalamSetahun = Math.max(0, 12 - bulanBerjalanIndex); // 5 bulan (Agustus - Desember)
  const thresholdKebutuhanNominal = lastMonthData.nominal * sisaBulanDalamSetahun; // 413,4 M * 5 = 2.067,0 M
  const isAlert = grandSisa < thresholdKebutuhanNominal;
  const defisitEstimasi = Math.max(0, thresholdKebutuhanNominal - grandSisa);
  const runwayBulan = lastMonthData.nominal > 0 ? (grandSisa / lastMonthData.nominal).toFixed(1) : "0";

  const revisiPagu = 320_000_000_000;
  const paguAwal = grand.pagu - revisiPagu;
  const rataRataBulanan = grand.real / 7;

  // Akumulasi Pagu & Realisasi Terserap per 4 MAK DAPEM
  const makList = [
    { kode: "513122", nama: "PENS TNI", sub: "TNI (AD, AL, AU)", iconColor: "#059669" },
    { kode: "513123", nama: "PENS POLRI", sub: "POLRI", iconColor: "#7C3AED" },
    { kode: "513113", nama: "PENS PNS KEMHAN", sub: "PNS Kemenhan", iconColor: "#1565C0" },
    { kode: "513114", nama: "PENS PNS POLRI", sub: "PNS POLRI", iconColor: "#0891B2" },
  ];

  const jenisMeta = [
    { key: "induk", nama: "Dapem Induk", color: "#1565C0" },
    { key: "susulan", nama: "Dapem Susulan", color: "#059669" },
    { key: "rapel", nama: "Dapem Rapel", color: "#D97706" },
    { key: "thr", nama: "Dapem THR", color: "#7C3AED" },
    { key: "ke13", nama: "Dapem ke-13", color: "#0891B2" },
  ];

  const makMeta = [
    { key: "513122", nama: "513122 (TNI)", short: "TNI", color: "#059669" },
    { key: "513123", nama: "513123 (POLRI)", short: "POLRI", color: "#7C3AED" },
    { key: "513113", nama: "513113 (PNS Kemhan)", short: "PNS Kemhan", color: "#1565C0" },
    { key: "513114", nama: "513114 (PNS Polri)", short: "PNS Polri", color: "#0891B2" },
  ];

  const makSummary = makList.map(item => {
    let pagu = 0;
    let real = 0;
    jenisDapem.forEach(j => {
      const match = j.mak.find(m => m.kode === item.kode);
      if (match) {
        pagu += match.pagu;
        real += match.real;
      }
    });
    const sisa = pagu - real;
    const pct = pagu ? (real / pagu) * 100 : 0;
    const shareOfTotal = grand.real ? (real / grand.real) * 100 : 0;
    return { ...item, pagu, real, sisa, pct, shareOfTotal };
  });

  // Data Pembayaran Jenis Dapem per Bulan (TA 2026)
  const pembayaranBulanan = [
    {
      bulan: "Januari 2026",
      short: "Jan",
      periode: "2026-01",
      tglBayar: "02 Jan 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      totalNominal: 585_400_000_000,
      totalM: 585.4,
      jenisM: { induk: 525.0, susulan: 38.4, rapel: 22.0, thr: 0, ke13: 0 },
      makM: { "513113": 88.2, "513114": 21.1, "513122": 293.5, "513123": 182.6 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 38_400_000_000, mak: { "513113": 5_760_000_000, "513114": 1_380_000_000, "513122": 19_200_000_000, "513123": 12_060_000_000 } },
        { jenis: "Dapem Rapel", nominal: 22_000_000_000, mak: { "513113": 3_690_000_000, "513114": 1_060_000_000, "513122": 11_800_000_000, "513123": 5_450_000_000 } },
      ],
      breakdownMAK: {
        "513113": 88_200_000_000,
        "513114": 21_100_000_000,
        "513122": 293_500_000_000,
        "513123": 182_600_000_000,
      }
    },
    {
      bulan: "Februari 2026",
      short: "Feb",
      periode: "2026-02",
      tglBayar: "02 Feb 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan"],
      totalNominal: 552_100_000_000,
      totalM: 552.1,
      jenisM: { induk: 525.0, susulan: 27.1, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 83.0, "513114": 19.8, "513122": 277.0, "513123": 172.3 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 27_100_000_000, mak: { "513113": 4_250_000_000, "513114": 1_140_000_000, "513122": 14_500_000_000, "513123": 7_210_000_000 } },
      ],
      breakdownMAK: {
        "513113": 83_000_000_000,
        "513114": 19_800_000_000,
        "513122": 277_000_000_000,
        "513123": 172_300_000_000,
      }
    },
    {
      bulan: "Maret 2026",
      short: "Mar",
      periode: "2026-03",
      tglBayar: "25 Mar 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel", "Dapem THR"],
      totalNominal: 951_800_000_000,
      totalM: 951.8,
      jenisM: { induk: 525.0, susulan: 26.1, rapel: 15.0, thr: 385.7, ke13: 0 },
      makM: { "513113": 144.3, "513114": 34.2, "513122": 478.5, "513123": 294.8 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 26_100_000_000, mak: { "513113": 3_950_000_000, "513114": 940_000_000, "513122": 13_800_000_000, "513123": 7_410_000_000 } },
        { jenis: "Dapem Rapel", nominal: 15_000_000_000, mak: { "513113": 3_800_000_000, "513114": 700_000_000, "513122": 8_400_000_000, "513123": 2_100_000_000 } },
        { jenis: "Dapem THR", nominal: 385_700_000_000, mak: { "513113": 57_800_000_000, "513114": 13_900_000_000, "513122": 193_800_000_000, "513123": 120_200_000_000 } },
      ],
      breakdownMAK: {
        "513113": 144_300_000_000,
        "513114": 34_200_000_000,
        "513122": 478_500_000_000,
        "513123": 294_800_000_000,
      }
    },
    {
      bulan: "April 2026",
      short: "Apr",
      periode: "2026-04",
      tglBayar: "01 Apr 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan"],
      totalNominal: 554_300_000_000,
      totalM: 554.3,
      jenisM: { induk: 525.0, susulan: 29.3, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 83.5, "513114": 19.9, "513122": 278.0, "513123": 172.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 29_300_000_000, mak: { "513113": 4_750_000_000, "513114": 1_240_000_000, "513122": 15_500_000_000, "513123": 7_810_000_000 } },
      ],
      breakdownMAK: {
        "513113": 83_500_000_000,
        "513114": 19_900_000_000,
        "513122": 278_000_000_000,
        "513123": 172_900_000_000,
      }
    },
    {
      bulan: "Mei 2026",
      short: "Mei",
      periode: "2026-05",
      tglBayar: "02 Mei 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      totalNominal: 589_200_000_000,
      totalM: 589.2,
      jenisM: { induk: 525.0, susulan: 32.2, rapel: 32.0, thr: 0, ke13: 0 },
      makM: { "513113": 88.8, "513114": 21.2, "513122": 295.4, "513123": 183.8 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 32_200_000_000, mak: { "513113": 4_950_000_000, "513114": 1_280_000_000, "513122": 16_800_000_000, "513123": 9_170_000_000 } },
        { jenis: "Dapem Rapel", nominal: 32_000_000_000, mak: { "513113": 5_100_000_000, "513114": 1_260_000_000, "513122": 16_100_000_000, "513123": 9_540_000_000 } },
      ],
      breakdownMAK: {
        "513113": 88_800_000_000,
        "513114": 21_200_000_000,
        "513122": 295_400_000_000,
        "513123": 183_800_000_000,
      }
    },
    {
      bulan: "Juni 2026",
      short: "Jun",
      periode: "2026-06",
      tglBayar: "02 Jun 2026",
      status: "Selesai Cair",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan", "Dapem Rapel"],
      totalNominal: 591_500_000_000,
      totalM: 591.5,
      jenisM: { induk: 525.0, susulan: 35.5, rapel: 31.0, thr: 0, ke13: 0 },
      makM: { "513113": 89.1, "513114": 21.3, "513122": 296.6, "513123": 184.5 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 525_000_000_000, mak: { "513113": 78_750_000_000, "513114": 18_660_000_000, "513122": 262_500_000_000, "513123": 165_090_000_000 } },
        { jenis: "Dapem Susulan", nominal: 35_500_000_000, mak: { "513113": 5_250_000_000, "513114": 1_360_000_000, "513122": 18_100_000_000, "513123": 10_790_000_000 } },
        { jenis: "Dapem Rapel", nominal: 31_000_000_000, mak: { "513113": 5_100_000_000, "513114": 1_280_000_000, "513122": 16_000_000_000, "513123": 8_620_000_000 } },
      ],
      breakdownMAK: {
        "513113": 89_100_000_000,
        "513114": 21_300_000_000,
        "513122": 296_600_000_000,
        "513123": 184_500_000_000,
      }
    },
    {
      bulan: "Juli 2026",
      short: "Jul",
      periode: "2026-07",
      tglBayar: "01 Jul 2026",
      status: "Berjalan (Proses SP2D)",
      jenisDibayar: ["Dapem Induk", "Dapem Susulan"],
      totalNominal: 413_400_000_000,
      totalM: 413.4,
      jenisM: { induk: 375.0, susulan: 38.4, rapel: 0, thr: 0, ke13: 0 },
      makM: { "513113": 62.4, "513114": 14.8, "513122": 207.3, "513123": 128.9 },
      breakdownJenis: [
        { jenis: "Dapem Induk", nominal: 375_000_000_000, mak: { "513113": 56_250_000_000, "513114": 13_320_000_000, "513122": 187_500_000_000, "513123": 117_930_000_000 } },
        { jenis: "Dapem Susulan", nominal: 38_400_000_000, mak: { "513113": 6_150_000_000, "513114": 1_480_000_000, "513122": 19_800_000_000, "513123": 10_970_000_000 } },
      ],
      breakdownMAK: {
        "513113": 62_400_000_000,
        "513114": 14_800_000_000,
        "513122": 207_300_000_000,
        "513123": 128_900_000_000,
      }
    },
  ];

  const filteredPembayaranBulanan = pembayaranBulanan.filter(b => {
    if (filterBulan !== "Semua" && b.bulan !== filterBulan) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = b.bulan.toLowerCase().includes(q);
      const matchJenis = b.jenisDibayar.some(j => j.toLowerCase().includes(q));
      if (!matchName && !matchJenis) return false;
    }
    return true;
  });

  const revisiLog = [
    { no: "REV/2026/03/001", tgl: "15 Mar 2026", jenis: "Dapem Induk", sebelum: 4_000_000_000_000, sesudah: 4_200_000_000_000, alasan: "Revisi APBN TA 2026 — tambahan alokasi pensiun baru" },
    { no: "REV/2026/05/002", tgl: "20 Mei 2026", jenis: "Dapem Susulan", sebelum: 890_000_000_000, sesudah: 970_000_000_000, alasan: "Penyesuaian data pensiunan susulan triwulan II" },
    { no: "REV/2026/06/003", tgl: "10 Jun 2026", jenis: "Dapem ke-13", sebelum: 336_000_000_000, sesudah: 376_000_000_000, alasan: "Penyesuaian alokasi Dapem ke-13 sesuai PP terbaru" },
  ];

  const selectedIndex = pembayaranBulanan.findIndex(b => b.bulan === filterBulan);
  const activeIdx = hoveredIdx !== null ? hoveredIdx : (selectedIndex !== -1 ? selectedIndex : null);
  const activeMonthData = activeIdx !== null ? pembayaranBulanan[activeIdx] : null;

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* EXECUTIVE HIGH-IMPACT ALERT BANNER */}
      {isAlert && (
        <div style={{
          background: "linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 50%, #FFFBEB 100%)",
          border: "1px solid #FECDD3",
          borderLeft: "5px solid #E11D48",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 18,
          boxShadow: "0 4px 16px rgba(225, 29, 72, 0.08)"
        }}>
          {/* Header Row: Status Badge, Title & Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: "#E11D48", color: "#FFFFFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 6px rgba(225, 29, 72, 0.3)"
              }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14.5, fontWeight: 900, color: "#9F1239", letterSpacing: -0.2 }}>
                    PERINGATAN AMBANG BATAS PAGU DIPA (RUNWAY ALERT)
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                    background: "#FFE4E6", color: "#E11D48",
                    padding: "2px 8px", borderRadius: 12, border: "1px solid #FECDD3",
                    display: "inline-flex", alignItems: "center", gap: 5
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E11D48", display: "inline-block" }} />
                    Sisa Ketahanan Dana: ~{runwayBulan} Bulan
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                  Sisa pagu saat ini tidak mencukupi proyeksi kebutuhan hingga akhir TA 2026 berdasarkan laju realisasi terakhir
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setTab("konfigurasi")}
                style={{
                  background: "#FFFFFF", border: "1px solid #FDA4AF",
                  color: "#9F1239", borderRadius: 6, padding: "6px 12px",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FFE4E6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; }}
              >
                <span>Detail Aturan & Status Sistem</span>
                <span>→</span>
              </button>
              <button
                onClick={() => setTab("revisi")}
                style={{
                  background: "#E11D48", border: "none",
                  color: "#FFFFFF", borderRadius: 6, padding: "6px 14px",
                  fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  boxShadow: "0 2px 6px rgba(225, 29, 72, 0.25)",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#BE123C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#E11D48"; }}
              >
                <span>Usulan Revisi DIPA</span>
              </button>
            </div>
          </div>

          {/* 3 Visual Metric Cards Strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 10,
            marginBottom: 12
          }}>
            {/* Box 1: Realisasi & Sisa Bulan */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "10px 14px", border: "1px solid #FEE2E2" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Laju Realisasi Terakhir</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>
                {fmtM(lastMonthData.nominal)} <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706" }}>× {sisaBulanDalamSetahun} Bulan Sisa</span>
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>
                Basis: Realisasi {lastMonthData.bulan} (Agustus s.d. Desember)
              </div>
            </div>

            {/* Box 2: Threshold Kebutuhan */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "10px 14px", border: "1px solid #DBEAFE" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase" }}>Threshold Kebutuhan 5 Bulan</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1D4ED8", fontFamily: "monospace", marginTop: 2 }}>
                {fmtM(thresholdKebutuhanNominal)}
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>
                Target dana yang dibutuhkan s.d. akhir tahun
              </div>
            </div>

            {/* Box 3: Sisa Pagu vs Defisit */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "10px 14px", border: "1px solid #FECDD3" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#E11D48", textTransform: "uppercase" }}>Sisa Pagu / Estimasi Defisit</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#E11D48", fontFamily: "monospace", marginTop: 2 }}>
                {fmtM(grandSisa)} <span style={{ fontSize: 11, fontWeight: 800, color: "#DC2626" }}>(-{fmtM(defisitEstimasi)})</span>
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>
                Sisa dana riil saat ini vs kekurangan anggaran
              </div>
            </div>
          </div>

          {/* Visual Runway Progress Bar */}
          <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 8, padding: "10px 14px", border: "1px solid #FEE2E2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 11 }}>
              <span style={{ fontWeight: 700, color: "#334155" }}>
                Visualisasi Ketahanan Runway (Sisa Dana vs Target 5 Bulan):
              </span>
              <span style={{ fontWeight: 800, color: "#E11D48" }}>
                Tersedia {((grandSisa / thresholdKebutuhanNominal) * 100).toFixed(1)}% dari Threshold (Ketahanan ~{runwayBulan} Bulan)
              </span>
            </div>

            <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, position: "relative", overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(100, (grandSisa / thresholdKebutuhanNominal) * 100)}%`,
                height: "100%",
                background: "linear-gradient(90deg, #E11D48 0%, #F43F5E 100%)",
                borderRadius: 4
              }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, fontSize: 10, color: "#64748B" }}>
              <span>Posisi Sisa Dana: <strong>{fmtM(grandSisa)}</strong></span>
              <span style={{ color: "#E11D48", fontWeight: 700 }}>⚠️ Defisit Proyeksi: -{fmtM(defisitEstimasi)}</span>
              <span>Target Ambang: <strong>{fmtM(thresholdKebutuhanNominal)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 1: EXECUTIVE KPI SUMMARY BAR */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 18 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Pagu Berjalan TA 2026</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#1565C0", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>DIPA Induk + Rev</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(grand.pagu)}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
            Awal: {fmtM(paguAwal)} • Revisi: <strong style={{ color: "#7C3AED" }}>+{fmtM(revisiPagu)}</strong>
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Realisasi Terserap</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 4 }}>{pctUsed}% Serapan</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", fontFamily: "monospace" }}>{fmtM(grand.real)}</div>
          <div style={{ marginTop: 6, height: 6, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${pctUsed}%`, height: "100%", background: "#059669", borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: isAlert ? "1.5px solid #FECACA" : "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Sisa Pagu DIPA</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: isAlert ? "#DC2626" : "#D97706", background: isAlert ? "#FEF2F2" : "#FFFBEB", padding: "1px 6px", borderRadius: 4 }}>
              {isAlert ? `Kritis (< ${sisaBulanDalamSetahun} Bln)` : `${pctSisa}% Tersisa`}
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: isAlert ? "#DC2626" : "#0F172A", fontFamily: "monospace" }}>{fmtM(grandSisa)}</div>
          <div style={{ fontSize: 11, color: isAlert ? "#DC2626" : "#64748B", marginTop: 4, fontWeight: 600 }}>
            {isAlert ? `Threshold ${sisaBulanDalamSetahun} Bln: ${fmtM(thresholdKebutuhanNominal)}` : "Status cadangan dana aman"}
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "14px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>Rata-rata Realisasi</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>7 Bulan (Jan-Jul)</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{fmtM(rataRataBulanan)}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
            Puncak: <strong style={{ color: "#7C3AED" }}>Maret (951,8 M)</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigasi */}
      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "realisasi", l: "Sisa Pagu & Pembayaran Bulanan" },
          { id: "revisi", l: "Riwayat Revisi Pagu", c: revisiLog.length },
          { id: "konfigurasi", l: "Pemantauan Alert Otomatis", alertDot: isAlert },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "9px 18px", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, background: "transparent",
            display: "flex", alignItems: "center", gap: 6,
            color: tab === t.id ? COLORS.blue : COLORS.gray500,
            borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            marginBottom: -2
          }}>
            {t.l}
            {t.c ? <span style={{ background: tab === t.id ? "#E3F2FD" : COLORS.gray200, color: tab === t.id ? COLORS.blue : COLORS.gray700, padding: "1px 7px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.c}</span> : null}
            {t.alertDot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", display: "inline-block" }} title="Peringatan Defisit Aktif" />}
          </button>
        ))}
      </div>

      {/* TAB 1: Sisa Pagu & Pembayaran Bulanan */}
      {tab === "realisasi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* LEVEL 2: DUAL-PERSPECTIVE ANALYTICS SECTION (65% / 35% GRID) */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 64%) minmax(0, 36%)", gap: 16 }}>
            
            {/* PANEL KIRI (64%): SMART STACKED BAR CHART */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "16px 18px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                      <BarChart3 size={16} color={COLORS.blue} />
                      Tren Pembayaran Dapem Bulanan
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
                      Visualisasi komposisi nominal pencairan SP2D (Januari s.d. Juli 2026)
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {/* Perspective Switcher */}
                    <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 6, padding: 2, border: "1px solid #E2E8F0" }}>
                      <button
                        onClick={() => setChartPerspective("jenis")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartPerspective === "jenis" ? "#FFFFFF" : "transparent",
                          color: chartPerspective === "jenis" ? COLORS.blue : "#64748B",
                          boxShadow: chartPerspective === "jenis" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        Jenis Dapem
                      </button>
                      <button
                        onClick={() => setChartPerspective("mak")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartPerspective === "mak" ? "#FFFFFF" : "transparent",
                          color: chartPerspective === "mak" ? COLORS.blue : "#64748B",
                          boxShadow: chartPerspective === "mak" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        4 MAK
                      </button>
                    </div>

                    {/* Type Switcher */}
                    <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 6, padding: 2, border: "1px solid #E2E8F0" }}>
                      <button
                        onClick={() => setChartType("stacked")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartType === "stacked" ? "#FFFFFF" : "transparent",
                          color: chartType === "stacked" ? COLORS.blue : "#64748B",
                          boxShadow: chartType === "stacked" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        Stacked
                      </button>
                      <button
                        onClick={() => setChartType("grouped")}
                        style={{
                          padding: "4px 8px", borderRadius: 4, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          background: chartType === "grouped" ? "#FFFFFF" : "transparent",
                          color: chartType === "grouped" ? COLORS.blue : "#64748B",
                          boxShadow: chartType === "grouped" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                        }}
                      >
                        Grouped
                      </button>
                    </div>

                    {/* Filter Periode */}
                    <select
                      value={filterBulan}
                      onChange={e => setFilterBulan(e.target.value)}
                      style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontWeight: 600, color: "#334155", outline: "none", cursor: "pointer" }}
                    >
                      <option value="Semua">Semua Bulan</option>
                      {pembayaranBulanan.map((b, bi) => (
                        <option key={bi} value={b.bulan}>{b.bulan}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SVG Bar Chart Content */}
                {(() => {
                  const itemsList = chartPerspective === "jenis" ? jenisMeta : makMeta;
                  const getValueM = (month, item) => chartPerspective === "jenis" ? (month.jenisM[item.key] || 0) : (month.makM[item.key] || 0);
                  const isStacked = chartType === "stacked";
                  const maxY = isStacked ? 1000 : (chartPerspective === "jenis" ? 600 : 500);
                  const svgW = 680;
                  const svgH = 220;
                  const padL = 52;
                  const padR = 20;
                  const padT = 28;
                  const padB = 35;
                  const plotW = svgW - padL - padR;
                  const plotH = svgH - padT - padB;
                  const N = pembayaranBulanan.length;
                  const slotW = plotW / N;
                  const yTicks = isStacked ? [0, 250, 500, 750, 1000] : (chartPerspective === "jenis" ? [0, 150, 300, 450, 600] : [0, 125, 250, 375, 500]);

                  return (
                    <div style={{ width: "100%", overflowX: "auto" }}>
                      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto", minWidth: 480, display: "block" }}>
                        {/* Gridlines */}
                        {yTicks.map((val, idx) => {
                          const y = padT + plotH - (val / maxY) * plotH;
                          return (
                            <g key={idx}>
                              <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray={idx > 0 && idx < yTicks.length - 1 ? "3 3" : "none"} />
                              <text x={padL - 6} y={y + 3.5} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace" fontWeight="600">
                                {val === 0 ? "0" : `${val}M`}
                              </text>
                            </g>
                          );
                        })}

                        {/* Months Columns */}
                        {pembayaranBulanan.map((b, i) => {
                          const isSelected = b.bulan === filterBulan;
                          const isHovered = hoveredIdx === i;
                          const isActive = isHovered || isSelected;
                          const slotX = padL + i * slotW;
                          const slotCenterX = slotX + slotW / 2;

                          // Grouped
                          const numBars = itemsList.length;
                          const barW = numBars === 5 ? 9.5 : 12.5;
                          const barGap = 2;
                          const groupW = numBars * barW + (numBars - 1) * barGap;
                          const startX = slotCenterX - groupW / 2;

                          // Stacked
                          const stackBarW = 28;
                          const stackX = slotCenterX - stackBarW / 2;
                          let currentStackY = padT + plotH;

                          return (
                            <g
                              key={i}
                              style={{ cursor: "pointer" }}
                              onClick={() => setFilterBulan(b.bulan === filterBulan ? "Semua" : b.bulan)}
                              onMouseEnter={() => setHoveredIdx(i)}
                              onMouseLeave={() => { setHoveredIdx(null); setHoveredBar(null); }}
                            >
                              {/* Slot Background Highlight */}
                              {isActive && (
                                <rect x={slotX + 2} y={padT - 18} width={slotW - 4} height={plotH + 20} fill="#1565C0" opacity="0.07" rx="5" />
                              )}

                              {/* Bars Rendering */}
                              {!isStacked ? (
                                itemsList.map((item, k) => {
                                  const valM = getValueM(b, item);
                                  const barH = (valM / maxY) * plotH;
                                  const barX = startX + k * (barW + barGap);
                                  const barY = padT + plotH - barH;
                                  const isBarHovered = hoveredBar?.month === b.bulan && hoveredBar?.itemKey === item.key;

                                  return (
                                    <g key={k} onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      setHoveredBar({
                                        month: b.bulan, itemKey: item.key, label: item.nama, color: item.color, valM, totalM: b.totalM,
                                        pct: b.totalM ? ((valM / b.totalM) * 100).toFixed(1) : 0
                                      });
                                    }}>
                                      <rect
                                        x={barX} y={barY} width={barW} height={Math.max(barH, 0)} rx="2"
                                        fill={item.color}
                                        opacity={isBarHovered ? 1 : (hoveredBar ? 0.4 : (isActive ? 1 : 0.88))}
                                        stroke={isBarHovered ? "#0F172A" : "none"} strokeWidth={isBarHovered ? 1.5 : 0}
                                        style={{ transition: "all 0.15s ease" }}
                                      />
                                    </g>
                                  );
                                })
                              ) : (
                                <>
                                  {itemsList.map((item, k) => {
                                    const valM = getValueM(b, item);
                                    const segH = (valM / maxY) * plotH;
                                    const segY = currentStackY - segH;
                                    const isBarHovered = hoveredBar?.month === b.bulan && hoveredBar?.itemKey === item.key;
                                    const rectEl = (
                                      <rect
                                        key={k} x={stackX} y={segY} width={stackBarW} height={Math.max(segH, 0)}
                                        fill={item.color}
                                        opacity={isBarHovered ? 1 : (hoveredBar ? 0.45 : (isActive ? 1 : 0.9))}
                                        stroke={isBarHovered ? "#0F172A" : (k === 0 ? "none" : "#FFFFFF")}
                                        strokeWidth={isBarHovered ? 1.5 : (k === 0 ? 0 : 0.5)}
                                        style={{ transition: "all 0.15s ease" }}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setHoveredBar({
                                            month: b.bulan, itemKey: item.key, label: item.nama, color: item.color, valM, totalM: b.totalM,
                                            pct: b.totalM ? ((valM / b.totalM) * 100).toFixed(1) : 0
                                          });
                                        }}
                                      />
                                    );
                                    currentStackY = segY;
                                    return rectEl;
                                  })}
                                  {/* Total Label on Top of Stack */}
                                  <text x={slotCenterX} y={currentStackY - 4} fontSize="9" fontWeight="800" fontFamily="monospace" textAnchor="middle" fill="#0F172A">
                                    {b.totalM}M
                                  </text>
                                </>
                              )}

                              {/* X-Axis Label */}
                              <text x={slotCenterX} y={svgH - 12} textAnchor="middle" fontSize={isActive ? "11" : "10"} fontWeight={isActive ? "800" : "600"} fill={isActive ? COLORS.blue : "#64748B"}>
                                {b.short}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* Legend & Active Bar Info */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 10.5, color: "#475569" }}>
                  {(chartPerspective === "jenis" ? jenisMeta : makMeta).map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                      <span style={{ fontWeight: 600 }}>{item.nama}</span>
                    </div>
                  ))}
                </div>

                {hoveredBar && (
                  <div style={{ fontSize: 11, background: hoveredBar.color + "14", color: hoveredBar.color, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                    {hoveredBar.label}: {hoveredBar.valM}M ({hoveredBar.pct}%)
                  </div>
                )}
              </div>
            </div>

            {/* PANEL KANAN (36%): PROPORSI & KESEHATAN DANA 4 MAK */}
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "16px 18px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                      <PieChart size={16} color={COLORS.blue} />
                      Alokasi & Serapan 4 MAK
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
                      {filterBulan === "Semua" ? "Akumulasi Pagu DIPA TA 2026" : `Distribusi Bulan ${filterBulan}`}
                    </div>
                  </div>
                  {filterBulan !== "Semua" && (
                    <button
                      onClick={() => setFilterBulan("Semua")}
                      style={{ fontSize: 10.5, color: COLORS.blue, background: "#EFF6FF", border: "none", padding: "2px 6px", borderRadius: 4, fontWeight: 700, cursor: "pointer" }}
                    >
                      Semua TA
                    </button>
                  )}
                </div>

                {/* Donut Chart & Key Highlights */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <svg width="105" height="105" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                    {/* TNI */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#059669" strokeWidth="16" strokeDasharray={`${0.500 * 289.02} 289.02`} strokeDashoffset="0" />
                    {/* POLRI */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#7C3AED" strokeWidth="16" strokeDasharray={`${0.314 * 289.02} 289.02`} strokeDashoffset={`-${0.500 * 289.02}`} />
                    {/* Kemhan */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#1565C0" strokeWidth="16" strokeDasharray={`${0.150 * 289.02} 289.02`} strokeDashoffset={`-${(0.500 + 0.314) * 289.02}`} />
                    {/* PNS POLRI */}
                    <circle cx="60" cy="60" r="46" fill="transparent" stroke="#0891B2" strokeWidth="16" strokeDasharray={`${0.036 * 289.02} 289.02`} strokeDashoffset={`-${(0.500 + 0.314 + 0.150) * 289.02}`} />
                  </svg>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#64748B" }}>Total Serapan Aktif:</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>
                      {filterBulan === "Semua" ? fmtM(grand.real) : fmtM(activeMonthData?.totalNominal || 0)}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#059669", fontWeight: 700, marginTop: 2 }}>
                      81,4% Alokasi Terbesar pada TNI & POLRI
                    </div>
                  </div>
                </div>

                {/* 4 MAK Rows Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {makSummary.map((m, idx) => {
                    const monthVal = activeMonthData ? (activeMonthData.breakdownMAK[m.kode] || 0) : null;
                    const makThresholdNominal = (m.pagu / (grand.pagu || 1)) * thresholdKebutuhanNominal;
                    const isWarn = m.sisa < makThresholdNominal;

                    return (
                      <div key={idx} style={{ background: "#F8FAFC", borderRadius: 6, padding: "7px 10px", border: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: 2, background: m.iconColor }} />
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1E293B" }}>MAK {m.kode}</span>
                            <span style={{ fontSize: 10, color: "#64748B" }}>({m.sub})</span>
                          </div>
                          <span style={{ fontSize: 10.5, fontWeight: 800, color: isWarn ? "#DC2626" : m.iconColor }}>
                            {filterBulan === "Semua" ? `${m.pct.toFixed(1)}%` : fmtRp(monthVal)}
                          </span>
                        </div>

                        {filterBulan === "Semua" ? (
                          <>
                            <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ width: `${m.pct}%`, height: "100%", background: isWarn ? "#DC2626" : m.iconColor, borderRadius: 2 }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#64748B", marginTop: 3 }}>
                              <span>Pagu: {fmtM(m.pagu)}</span>
                              <span>Sisa: <strong style={{ color: isWarn ? "#DC2626" : "#334155" }}>{fmtM(m.sisa)}</strong></span>
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: 9.5, color: "#64748B", display: "flex", justifyContent: "space-between" }}>
                            <span>Porsi Bulan {filterBulan}:</span>
                            <strong style={{ color: m.iconColor }}>{((monthVal / (activeMonthData.totalNominal || 1)) * 100).toFixed(1)}%</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 8, marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: "#64748B" }}>
                <span>Threshold: Rn × {sisaBulanDalamSetahun} Bulan ({fmtM(thresholdKebutuhanNominal)})</span>
                <span style={{ color: isAlert ? "#DC2626" : "#059669", fontWeight: 700 }}>
                  {isAlert ? "⚠️ Runway Defisit" : "✅ Alokasi Terkendali"}
                </span>
              </div>
            </div>
          </div>

          {/* LEVEL 3: PEMBAYARAN JENIS DAPEM (DISPLAY PER BULAN) */}
          {(() => {
            const activeMonthName = filterBulan === "Semua" ? "Maret 2026" : filterBulan;
            const selectedMonthObj = pembayaranBulanan.find(b => b.bulan === activeMonthName) || pembayaranBulanan[2];

            return (
              <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "18px 20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                {/* Header Card & Month Selector Dropdown */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={16} color={COLORS.blue} />
                      Pembayaran Jenis Dapem — {selectedMonthObj.bulan}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                      Rincian realisasi SP2D dan distribusi 4 MAK DAPEM per bulan
                    </div>
                  </div>

                  {/* Dropdown Filter & Export Button */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>Periode Bulan:</span>
                      <select
                        value={activeMonthName}
                        onChange={e => setFilterBulan(e.target.value)}
                        style={{
                          padding: "6px 12px",
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid #CBD5E1",
                          background: "#FFFFFF",
                          color: "#1E293B",
                          fontWeight: 700,
                          cursor: "pointer",
                          outline: "none"
                        }}
                      >
                        {pembayaranBulanan.map((b, bi) => (
                          <option key={bi} value={b.bulan}>
                            {b.bulan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Btn variant="outline" size="sm" onClick={() => setPreview({
                      title: `Rincian Pembayaran Dapem — ${selectedMonthObj.bulan}`,
                      subtitle: `Realisasi SP2D per Jenis & MAK DAPEM • ${selectedMonthObj.jenisDibayar.join(", ")}`,
                      type: "table",
                      fileName: `Pembayaran_Dapem_${selectedMonthObj.bulan.replace(/ /g, "_")}.xlsx`,
                      content: {
                        columns: ["Jenis Dapem", "513113 (PNS Kemhan)", "513114 (PNS Polri)", "513122 (TNI)", "513123 (Polri)", "Total Nominal"],
                        rows: [
                          ...selectedMonthObj.breakdownJenis.map(bj => [
                            bj.jenis,
                            fmtRp(bj.mak["513113"] || 0),
                            fmtRp(bj.mak["513114"] || 0),
                            fmtRp(bj.mak["513122"] || 0),
                            fmtRp(bj.mak["513123"] || 0),
                            fmtRp(bj.nominal)
                          ]),
                          ["TOTAL BULAN INI", fmtRp(selectedMonthObj.breakdownMAK["513113"]), fmtRp(selectedMonthObj.breakdownMAK["513114"]), fmtRp(selectedMonthObj.breakdownMAK["513122"]), fmtRp(selectedMonthObj.breakdownMAK["513123"]), fmtRp(selectedMonthObj.totalNominal)]
                        ],
                        totalRows: selectedMonthObj.breakdownJenis.length + 1
                      }
                    })}>
                      <Download size={13} /> Ekspor Excel ({selectedMonthObj.short})
                    </Btn>
                  </div>
                </div>

                {/* Banner Info Bulan Terpilih */}
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: COLORS.blue + "14",
                        color: COLORS.blue,
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800
                      }}>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{selectedMonthObj.bulan}</span>
                          <span style={{ fontSize: 10.5, background: selectedMonthObj.status.includes("Berjalan") ? "#FFFBEB" : "#ECFDF5", color: selectedMonthObj.status.includes("Berjalan") ? "#D97706" : "#059669", padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>
                            {selectedMonthObj.status}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Tgl SP2D: {selectedMonthObj.tglBayar} • Jenis Dapem Cair:</span>
                          {selectedMonthObj.jenisDibayar.map((jNama, ji) => {
                            const isTHR = jNama.includes("THR");
                            const isRapel = jNama.includes("Rapel");
                            const isSusulan = jNama.includes("Susulan");
                            return (
                              <span
                                key={ji}
                                style={{
                                  fontSize: 10.5, fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                                  background: isTHR ? "#7C3AED14" : isRapel ? "#FEF3C7" : isSusulan ? "#ECFDF5" : "#EFF6FF",
                                  color: isTHR ? "#7C3AED" : isRapel ? "#D97706" : isSusulan ? "#059669" : "#1565C0",
                                  border: `1px solid ${isTHR ? "#E9D5FF" : isRapel ? "#FDE68A" : isSusulan ? "#A7F3D0" : "#BFDBFE"}`
                                }}
                              >
                                {jNama}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Total Realisasi Cair Bulan Ini:</div>
                      <div style={{ fontSize: 17, fontWeight: 900, fontFamily: "monospace", color: "#0F172A" }}>
                        {fmtRp(selectedMonthObj.totalNominal)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabel Matriks: Jenis Dapem vs 4 MAK Bulan Ini */}
                <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: "#FFFFFF" }}>
                        <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, borderRight: "1px solid #334155" }}>Jenis Dapem</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513113 (PNS Kemhan)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513114 (PNS Polri)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513122 (TNI)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>513123 (Polri)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700 }}>Total Bulan Ini (Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMonthObj.breakdownJenis.map((bj, bji) => (
                        <tr
                          key={bji}
                          style={{ borderBottom: "1px solid #E2E8F0", background: bji % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                          onMouseLeave={e => e.currentTarget.style.background = bji % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                        >
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                            {bj.jenis}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513113"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513114"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513122"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                            {fmtRp(bj.mak["513123"] || 0)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#059669" }}>
                            {fmtRp(bj.nominal)}
                          </td>
                        </tr>
                      ))}
                      {/* Total Baris Bulan Ini */}
                      <tr style={{ background: "#E2E8F0", fontWeight: 800 }}>
                        <td style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                          TOTAL {selectedMonthObj.bulan.toUpperCase()}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513113"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513114"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513122"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                          {fmtRp(selectedMonthObj.breakdownMAK["513123"])}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", fontWeight: 900 }}>
                          {fmtRp(selectedMonthObj.totalNominal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: Riwayat Revisi Pagu */}
      {tab === "revisi" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Riwayat Revisi Pagu", subtitle: "Perubahan pagu DIPA TA 2026", type: "table", fileName: "Riwayat_Revisi_Pagu_2026.xlsx", content: { columns: ["No. Revisi", "Tanggal", "Jenis", "Sebelum", "Sesudah", "Selisih"], rows: revisiLog.map(r => [r.no, r.tgl, r.jenis, fmtRp(r.sebelum), fmtRp(r.sesudah), "+" + fmtRp(r.sesudah - r.sebelum)]), totalRows: revisiLog.length } })}>Ekspor</Btn>}>Riwayat Revisi Pagu DIPA</SectionTitle>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["No. Revisi", "Tanggal", "Jenis Dapem", "Pagu Sebelum", "Pagu Sesudah", "Selisih", "Alasan Revisi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: i >= 3 && i <= 5 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 6 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{revisiLog.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, color: "#7B1FA2", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, borderRight: "1px solid #E2E8F0" }}>{r.tgl}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color="blue">{r.jenis}</Badge></td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmtRp(r.sebelum)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmtRp(r.sesudah)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.green, fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>+{fmtRp(r.sesudah - r.sebelum)}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569", maxWidth: 280 }}>{r.alasan}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: COLORS.gray500 }}>Revisi pagu diperbarui berdasarkan DIPA Revisi dari Kemenkeu • Data otomatis memperbarui pagu berjalan</div>
        </div>
      )}

      {/* TAB 3: Pemantauan Alert Otomatis Sistem */}
      {tab === "konfigurasi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Box 1: Aturan & Mekanisme Otomatis Sistem */}
          <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "20px 24px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={18} color="#DC2626" />
                  Aturan Ambang Batas Alert (Perhitungan Otomatis Sistem)
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Sistem secara otomatis membaca nominal realisasi pencairan bulan terakhir dan mengalikannya dengan sisa bulan dalam setahun tanpa perlu input manual.
                </div>
              </div>

              <div style={{ background: isAlert ? "#FEF2F2" : "#ECFDF5", border: isAlert ? "1px solid #FECACA" : "1px solid #A7F3D0", padding: "6px 14px", borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: isAlert ? "#DC2626" : "#059669" }}>
                  {isAlert ? "⚠️ STATUS: ALERT KRITIS (DEFISIT RUNWAY)" : "✅ STATUS: SISA PAGU AMAN"}
                </span>
              </div>
            </div>

            {/* Formula Visual Banner */}
            <div style={{ marginTop: 16, background: "#F8FAFC", borderRadius: 8, padding: "16px 20px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                Formula Ambang Batas Otomatis:
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 13.5, fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                <span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "4px 10px", borderRadius: 6, border: "1px solid #BFDBFE" }}>
                  Threshold Ambang Kebutuhan (Rp)
                </span>
                <span>=</span>
                <span style={{ background: "#F3E8FF", color: "#7C3AED", padding: "4px 10px", borderRadius: 6, border: "1px solid #E9D5FF" }}>
                  Realisasi Bulan Terakhir
                </span>
                <span>×</span>
                <span style={{ background: "#FEF3C7", color: "#B45309", padding: "4px 10px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                  Sisa Bulan dalam Setahun (12 - Bulan Berjalan)
                </span>
              </div>

              {/* Live Evaluasi Formula Berjalan */}
              <div style={{ marginTop: 14, background: "#FFFFFF", padding: "10px 14px", borderRadius: 6, border: "1px solid #CBD5E1", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: "#475569" }}>Hasil Bacaan Sistem Saat Ini:</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                  Realisasi {lastMonthData.bulan} ({fmtM(lastMonthData.nominal)}) × {sisaBulanDalamSetahun} Bulan Sisa (Agustus s.d. Desember) = Threshold: <strong style={{ color: "#1D4ED8" }}>{fmtM(thresholdKebutuhanNominal)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Ringkasan Telemetri Otomatis Sistem (2 Kolom) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Kolom 1: Data Riil yang Dibaca Sistem */}
            <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <SectionTitle>Bacaan Data Riil Sistem</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Bulan Berjalan Terdeteksi:</span>
                  <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{lastMonthData.bulan} (Bulan ke-{bulanBerjalanIndex} dari 12)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Realisasi Terakhir Terbaca:</span>
                  <strong style={{ fontSize: 12.5, color: "#0F172A", fontFamily: "monospace" }}>{fmtRp(lastMonthData.nominal)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Sisa Periode TA 2026:</span>
                  <strong style={{ fontSize: 12.5, color: "#D97706" }}>{sisaBulanDalamSetahun} Bulan (12 - {bulanBerjalanIndex})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#EFF6FF", borderRadius: 6, border: "1px solid #DBEAFE" }}>
                  <span style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 700 }}>Threshold Kebutuhan Otomatis:</span>
                  <strong style={{ fontSize: 13, color: "#1D4ED8", fontFamily: "monospace" }}>{fmtRp(thresholdKebutuhanNominal)}</strong>
                </div>
              </div>
            </div>

            {/* Kolom 2: Status Evaluasi & Ketahanan Sisa Dana */}
            <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <SectionTitle>Evaluasi Kecukupan Sisa Pagu</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Sisa Pagu DIPA Tersedia:</span>
                  <strong style={{ fontSize: 12.5, color: "#0F172A", fontFamily: "monospace" }}>{fmtRp(grandSisa)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isAlert ? "#FEF2F2" : "#ECFDF5", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: isAlert ? "#DC2626" : "#059669", fontWeight: 700 }}>Defisit / Surplus Proyeksi:</span>
                  <strong style={{ fontSize: 12.5, color: isAlert ? "#DC2626" : "#059669", fontFamily: "monospace" }}>
                    {isAlert ? `-${fmtRp(defisitEstimasi)} (Defisit)` : `+${fmtRp(grandSisa - thresholdKebutuhanNominal)} (Surplus)`}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Ketahanan Sisa Dana (Runway):</span>
                  <strong style={{ fontSize: 12.5, color: isAlert ? "#DC2626" : "#059669" }}>~{runwayBulan} Bulan</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: isAlert ? "#FFF1F2" : "#F0FDF4", borderRadius: 6, border: isAlert ? "1px solid #FECDD3" : "1px solid #BBF7D0" }}>
                  <span style={{ fontSize: 12, color: isAlert ? "#9F1239" : "#166534", fontWeight: 700 }}>Rekomendasi Sistem:</span>
                  <strong style={{ fontSize: 11.5, color: isAlert ? "#9F1239" : "#166534" }}>
                    {isAlert ? "Perlu Pengajuan Revisi Tambahan Pagu" : "Alokasi Pagu DIPA Mencukupi"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Tabel Matriks Proyeksi Otomatis 12 Bulan TA 2026 */}
          {(() => {
            const namaBulanList = [
              { n: 1, nama: "Januari 2026", short: "Jan", real: 541_500_000_000, tipe: "Aktual" },
              { n: 2, nama: "Februari 2026", short: "Feb", real: 552_100_000_000, tipe: "Aktual" },
              { n: 3, nama: "Maret 2026", short: "Mar", real: 951_800_000_000, tipe: "Aktual" },
              { n: 4, nama: "April 2026", short: "Apr", real: 554_300_000_000, tipe: "Aktual" },
              { n: 5, nama: "Mei 2026", short: "Mei", real: 589_200_000_000, tipe: "Aktual" },
              { n: 6, nama: "Juni 2026", short: "Jun", real: 591_500_000_000, tipe: "Aktual" },
              { n: 7, nama: "Juli 2026", short: "Jul", real: 413_400_000_000, tipe: "Aktual (Terakhir)" },
              { n: 8, nama: "Agustus 2026", short: "Ags", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 9, nama: "September 2026", short: "Sep", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 10, nama: "Oktober 2026", short: "Okt", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 11, nama: "November 2026", short: "Nov", real: 413_400_000_000, tipe: "Proyeksi" },
              { n: 12, nama: "Desember 2026", short: "Des", real: 413_400_000_000, tipe: "Proyeksi" },
            ];

            return (
              <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 20, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                      Matriks Proyeksi Threshold Bulanan (Januari s.d. Desember TA 2026)
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                      Perkembangan pengali sisa bulan dan threshold kebutuhan untuk seluruh periode tahun anggaran
                    </div>
                  </div>

                  <Btn variant="outline" size="sm" onClick={() => setPreview({
                    title: "Pemantauan Threshold Alert TA 2026",
                    subtitle: "Tabel proyeksi ambang kebutuhan sisa bulan dalam setahun",
                    type: "table",
                    fileName: "Pemantauan_Threshold_Alert_2026.xlsx",
                    content: {
                      columns: ["No", "Bulan", "Status Data", "Realisasi / Estimasi", "Sisa Bulan (12 - n)", "Threshold Kebutuhan", "Sisa Pagu", "Status"],
                      rows: namaBulanList.map(b => {
                        const sisaBln = Math.max(0, 12 - b.n);
                        const threshNom = b.real * sisaBln;
                        const isWarn = grandSisa < threshNom;
                        return [
                          b.n,
                          b.nama,
                          b.tipe,
                          fmtRp(b.real),
                          `${sisaBln} Bulan`,
                          fmtRp(threshNom),
                          fmtRp(grandSisa),
                          isWarn ? "ALERT DEFISIT" : "AMAN"
                        ];
                      }),
                      totalRows: namaBulanList.length
                    }
                  })}>
                    <Download size={13} /> Ekspor Tabel (.xlsx)
                  </Btn>
                </div>

                <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: "#FFFFFF" }}>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, width: 40, borderRight: "1px solid #334155" }}>No</th>
                        <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, borderRight: "1px solid #334155" }}>Periode Bulan</th>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #334155" }}>Tipe Data</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>Realisasi (Rn)</th>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #334155" }}>Sisa Bulan (12 - n)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>Threshold Ambang (Rn × Sisa)</th>
                        <th style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>Sisa Pagu DIPA</th>
                        <th style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700 }}>Status Alert</th>
                      </tr>
                    </thead>
                    <tbody>
                      {namaBulanList.map(b => {
                        const sisaBln = Math.max(0, 12 - b.n);
                        const threshNom = b.real * sisaBln;
                        const isWarn = grandSisa < threshNom;
                        const isCurrent = b.n === 7;

                        return (
                          <tr
                            key={b.n}
                            style={{
                              borderBottom: "1px solid #E2E8F0",
                              background: isCurrent ? "#EFF6FF" : b.n % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = isCurrent ? "#DBEAFE" : "#F1F5F9"}
                            onMouseLeave={e => e.currentTarget.style.background = isCurrent ? "#EFF6FF" : b.n % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                          >
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                              {b.n}
                            </td>
                            <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span>{b.nama}</span>
                                {isCurrent && (
                                  <span style={{ fontSize: 9.5, background: "#1565C0", color: "#FFFFFF", padding: "1px 5px", borderRadius: 3, fontWeight: 800 }}>
                                    Bulan Ini
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>
                              <span style={{ padding: "1px 6px", borderRadius: 4, background: b.tipe.includes("Aktual") ? "#ECFDF5" : "#F1F5F9", color: b.tipe.includes("Aktual") ? "#059669" : "#64748B", fontWeight: 700 }}>
                                {b.tipe}
                              </span>
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              {fmtRp(b.real)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 800, color: sisaBln > 0 ? "#D97706" : "#64748B", borderRight: "1px solid #E2E8F0" }}>
                              {sisaBln} Bulan
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                              {fmtRp(threshNom)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              {fmtRp(grandSisa)}
                            </td>
                            <td style={{ padding: "8px 12px", textAlign: "center" }}>
                              <span style={{
                                fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 4,
                                background: isWarn ? "#FEE2E2" : "#ECFDF5",
                                color: isWarn ? "#DC2626" : "#059669",
                                border: `1px solid ${isWarn ? "#FECACA" : "#A7F3D0"}`
                              }}>
                                {isWarn ? "⚠️ DEFISIT" : "✅ AMAN"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

const RekonBPJS = () => {
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
  const pesertaKompensasi = filteredPeserta.filter(p => p.kompensasi !== 0);

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
      <div style={{ background: "#E3F2FD", borderRadius: 8, padding: "12px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, border: `1px solid ${COLORS.blue}40` }}>
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
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 700, width: 50, borderRight: "1px solid #334155" }}>NO</th>
                  <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, width: 120, borderRight: "1px solid #334155" }}>KODE MAK</th>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 700, borderRight: "1px solid #334155" }}>KELOMPOK PENSIUN DAPEM</th>
                  <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 700, width: 130, borderRight: "1px solid #334155" }}>TOTAL JIWA</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>TARGET REKAP III (ASKES)</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, borderRight: "1px solid #334155" }}>REALISASI SETORAN</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, width: 160, borderRight: "1px solid #334155" }}>KOMPENSASI (+/-)</th>
                  <th style={{ padding: "11px 14px", textAlign: "center", fontWeight: 700, width: 100 }}>STATUS</th>
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
                <tr style={{ background: "#0F172A", color: COLORS.white, fontWeight: 800 }}>
                  <td colSpan={3} style={{ padding: "12px 16px", fontWeight: 800, color: COLORS.white, letterSpacing: 0.3 }}>
                    JUMLAH GRAND TOTAL (SELURUH MAK DAPEM)
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#93C5FD" }}>
                    {fmtJiwa(totalJiwa)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.white }}>
                    {fmt(totalTarget)}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#86EFAC" }}>
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
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["NRP/NIP", "Nama Peserta", "Kode MAK", "Kelompok DAPEM", "Unor / Satker", "Target Rekap III", "Realisasi Potong", "Kompensasi (+/-)", "Keterangan"].map((c, i) => (
                    <th key={i} style={{ padding: "9px 12px", textAlign: i >= 5 && i <= 7 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderRight: "1px solid #334155", whiteSpace: "nowrap" }}>{c}</th>
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
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, width: 45, borderRight: "1px solid #334155" }}>No.</th>
                    <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, width: 95, borderRight: "1px solid #334155" }}>Bulan</th>
                    <th style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, borderRight: "1px solid #334155" }}>Kelompok Peserta</th>
                    <th style={{ padding: "11px 12px", textAlign: "right", fontWeight: 700, width: 115, borderRight: "1px solid #334155" }}>Jumlah Peserta</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 700, width: 155, borderRight: "1px solid #334155" }}>Total Iuran (Rekap III)</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 700, width: 175, borderRight: "1px solid #334155" }}>Iuran yang Dipotong dari Dapem</th>
                    <th style={{ padding: "11px 14px", textAlign: "right", fontWeight: 700, width: 175, borderRight: "1px solid #334155" }}>Iuran yang Disetor (NTPN)</th>
                    <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700, width: 105, borderRight: "1px solid #334155" }}>Tanggal Setor</th>
                    <th style={{ padding: "11px 12px", textAlign: "right", fontWeight: 700, width: 110 }}>Selisih</th>
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
                  <tr style={{ background: "#0F172A", color: COLORS.white, fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: "12px 14px", fontWeight: 800, color: COLORS.white, letterSpacing: 0.3 }}>
                      JUMLAH GRAND TOTAL (SELURUH MAK DAPEM)
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#93C5FD" }}>
                      {fmtJiwa(totalSetoranPeserta)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.white }}>
                      {fmt(totalSetoranRekap3)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#93C5FD" }}>
                      {fmt(totalSetoranPotongDapem)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#86EFAC" }}>
                      {fmt(totalSetoranNtpn)}
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "center", fontSize: 12, color: "#CBD5E1" }}>
                      10 Jun 2026
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 900, color: "#86EFAC" }}>
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

const ReportGenerator = () => {
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

// ===== TAGIHAN IMBAL JASA MITRA BAYAR =====
const TagihanImbalJasa = () => {
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-06-01");
  const [tglAkhir, setTglAkhir] = useState("2026-06-30");
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
          <Select label="Mitra Bayar" value={filterMitra} onChange={setFilterMitra} options={["Semua", "BRI", "BNI", "Mandiri", "BTN"]} minW={140} />
          <Select label="Program" value={filterProgram} onChange={setFilterProgram} options={["Semua", "THT/Pensiun", "JKK", "JKm"]} minW={140} />
          <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchTagihan} onChange={setSearchTagihan} placeholder="Cari no. tagihan atau mitra bayar..." minW={240} /></div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allTagihan.length} tagihan</div>
        {filtered.length === 0 ? <NoData /> : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["No. Tagihan", "Mitra Bayar", "Program", "Jenis Imbal Jasa", "Periode", "Tgl. Terbit", "Jatuh Tempo", "Tgl. Dibayar", "Status", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 9 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{filtered.map((t, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                  onMouseEnter={e => e.currentTarget.style.background = t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : "#F1F5F9"}
                  onMouseLeave={e => e.currentTarget.style.background = t.status === "Belum Dibayar" ? COLORS.redLight : t.status === "Terlambat" ? COLORS.yellowLight : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{t.no}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{t.mitra}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={programColor(t.program)}>{t.program}</Badge></td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.jenis}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.periode}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.tglTerbit}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.jatuhTempo}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.tglBayar || <span style={{ color: "#94A3B8" }}>—</span>}</td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={t.status === "Dibayar" ? "green" : t.status === "Terlambat" ? "orange" : "red"}>{t.status}</Badge></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="outline" onClick={() => setDetailTagihan(t)}>Detail</Btn>
                      {t.status === "Belum Dibayar" && <Btn size="sm" variant="danger" onClick={() => tagihDenda(t)}><Bell size={13} /> Tagih Denda</Btn>}
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

// ===== DAFTAR REKAPITULASI III (DAPEM & NON-DAPEM) SESUAI OUTPUT YANG DIHARAPKAN =====
const PembayaranPensiun = () => {
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [filterJenisPensiun, setFilterJenisPensiun] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-06-01");
  const [tglAkhir, setTglAkhir] = useState("2026-06-30");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;
  const [filterPenyaluran, setFilterPenyaluran] = useState("Gabungan POS dan Bank");
  const [selectedDropdownDapem, setSelectedDropdownDapem] = useState("semua");
  const [expandedDapem, setExpandedDapem] = useState({
    "513113": false,
    "513114": false,
    "513122": false,
    "513123": false,
    "total": false,
  });
  const [preview, setPreview] = useState(null);

  const fmt = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
  const fmtJiwa = (n) => (n || 0).toLocaleString("id-ID");

  // Data Rekapitulasi III Lengkap (sesuai Sheet Ouput yang diharapkan & data aktual)
  const dapemData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113)",
      singkatan: "PNS Kemenhan",
      kategori: "PNS KEMHAN",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 1110, istriSuami: 310, anak: 170, cacat: 0, total: 1590 },
          bruto: { pensiunPokok: 6980570000, tunjKeluarga: 265330000, tunjBeras: 215270000, cacatLain: 0, lainLain: 342880000, total: 7804050000 },
          potongan: { pph21: 346622000, askes: 44753000, tgr: 0, nonTgr: 22911000, lainLain: 0, total: 414286000 },
          netto: 7389764000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 395, istriSuami: 51, anak: 34, cacat: 0, total: 480 },
          bruto: { pensiunPokok: 2074000610, tunjKeluarga: 53066477, tunjBeras: 63999140, cacatLain: 0, lainLain: 101939853, total: 2293006080 },
          potongan: { pph21: 97054000, askes: 12531000, tgr: 0, nonTgr: 6415000, lainLain: 0, total: 116000000 },
          netto: 2177006080
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 72, istriSuami: 0, anak: 10, cacat: 0, total: 82 },
          bruto: { pensiunPokok: 338280000, tunjKeluarga: 11608000, tunjBeras: 10472000, cacatLain: 0, lainLain: 16683000, total: 377043000 },
          potongan: { pph21: 16637239, askes: 2148967, tgr: 0, nonTgr: 1098074, lainLain: 0, total: 19884280 },
          netto: 357158720
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 8, istriSuami: 0, anak: 0, cacat: 0, total: 8 },
          bruto: { pensiunPokok: 39000000, tunjKeluarga: 1660000, tunjBeras: 1170000, cacatLain: 0, lainLain: 1855000, total: 43685000 },
          potongan: { pph21: 1850000, askes: 239000, tgr: 0, nonTgr: 124000, lainLain: 0, total: 2213000 },
          netto: 41472000
        }
      ],
      totalJiwa: { penerima: 1585, istriSuami: 361, anak: 214, cacat: 0, total: 2160 },
      totalBruto: { pensiunPokok: 9431850610, tunjKeluarga: 331664477, tunjBeras: 290911140, cacatLain: 0, lainLain: 463357853, total: 10517784080 },
      totalPotongan: { pph21: 462163239, askes: 59671967, tgr: 0, nonTgr: 30548074, lainLain: 0, total: 552383280 },
      totalNetto: 9965400800
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114)",
      singkatan: "PNS POLRI",
      kategori: "PNS POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 261, istriSuami: 75, anak: 48, cacat: 0, total: 384 },
          bruto: { pensiunPokok: 1655734000, tunjKeluarga: 63110000, tunjBeras: 49946000, cacatLain: 0, lainLain: 80019000, total: 1848809000 },
          potongan: { pph21: 79334000, askes: 11426000, tgr: 0, nonTgr: 6543000, lainLain: 0, total: 97303000 },
          netto: 1751506000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 94, istriSuami: 12, anak: 11, cacat: 0, total: 117 },
          bruto: { pensiunPokok: 492244820, tunjKeluarga: 12622008, tunjBeras: 14849440, cacatLain: 0, lainLain: 23789109, total: 543505377 },
          potongan: { pph21: 23585000, askes: 3396000, tgr: 0, nonTgr: 1945000, lainLain: 0, total: 28926000 },
          netto: 514579377
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 16, istriSuami: 0, anak: 3, cacat: 0, total: 19 },
          bruto: { pensiunPokok: 80500000, tunjKeluarga: 2756000, tunjBeras: 2420000, cacatLain: 0, lainLain: 3876000, total: 89552000 },
          potongan: { pph21: 3859141, askes: 555836, tgr: 0, nonTgr: 318800, lainLain: 0, total: 4733777 },
          netto: 84818223
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 2, istriSuami: 0, anak: 0, cacat: 0, total: 2 },
          bruto: { pensiunPokok: 9000000, tunjKeluarga: 400000, tunjBeras: 280000, cacatLain: 0, lainLain: 450000, total: 10130000 },
          potongan: { pph21: 430000, askes: 63000, tgr: 0, nonTgr: 36000, lainLain: 0, total: 529000 },
          netto: 9601000
        }
      ],
      totalJiwa: { penerima: 373, istriSuami: 87, anak: 62, cacat: 0, total: 522 },
      totalBruto: { pensiunPokok: 2237478820, tunjKeluarga: 78888008, tunjBeras: 67495440, cacatLain: 0, lainLain: 108134109, total: 2491996377 },
      totalPotongan: { pph21: 107208141, askes: 15440836, tgr: 0, nonTgr: 8842800, lainLain: 0, total: 131491777 },
      totalNetto: 2360504600
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122)",
      singkatan: "TNI",
      kategori: "TNI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 3595, istriSuami: 820, anak: 2130, cacat: 0, total: 6545 },
          bruto: { pensiunPokok: 22709277000, tunjKeluarga: 1072148000, tunjBeras: 840410000, cacatLain: 0, lainLain: 1353663000, total: 25995498000 },
          potongan: { pph21: 1347618000, askes: 135030000, tgr: 0, nonTgr: 207408000, lainLain: 0, total: 1690056000 },
          netto: 24305442000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 1335, istriSuami: 145, anak: 484, cacat: 0, total: 1964 },
          bruto: { pensiunPokok: 6751406440, tunjKeluarga: 214429078, tunjBeras: 249851440, cacatLain: 0, lainLain: 402440341, total: 7618127299 },
          potongan: { pph21: 400643000, askes: 40144000, tgr: 0, nonTgr: 61662000, lainLain: 0, total: 502449000 },
          netto: 7115678299
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 185, istriSuami: 0, anak: 90, cacat: 0, total: 275 },
          bruto: { pensiunPokok: 1107529000, tunjKeluarga: 47608000, tunjBeras: 40885000, cacatLain: 0, lainLain: 65854000, total: 1261876000 },
          potongan: { pph21: 65559493, askes: 6568689, tgr: 0, nonTgr: 10089317, lainLain: 0, total: 82217499 },
          netto: 1179658501
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 22, istriSuami: 0, anak: 0, cacat: 0, total: 22 },
          bruto: { pensiunPokok: 120000000, tunjKeluarga: 6000000, tunjBeras: 4544000, cacatLain: 0, lainLain: 7318000, total: 137862000 },
          potongan: { pph21: 7285000, askes: 731000, tgr: 0, nonTgr: 1122000, lainLain: 0, total: 9138000 },
          netto: 128724000
        }
      ],
      totalJiwa: { penerima: 5137, istriSuami: 965, anak: 2704, cacat: 0, total: 8806 },
      totalBruto: { pensiunPokok: 30688212440, tunjKeluarga: 1340185078, tunjBeras: 1135690440, cacatLain: 0, lainLain: 1829275341, total: 34993363299 },
      totalPotongan: { pph21: 1821105493, askes: 182473689, tgr: 0, nonTgr: 280281317, lainLain: 0, total: 2283860499 },
      totalNetto: 32709502800
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123)",
      singkatan: "POLRI",
      kategori: "POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 2308, istriSuami: 580, anak: 1550, cacat: 0, total: 4438 },
          bruto: { pensiunPokok: 14635950000, tunjKeluarga: 493151000, tunjBeras: 402313000, cacatLain: 0, lainLain: 773566000, total: 16304980000 },
          potongan: { pph21: 769569000, askes: 72691000, tgr: 0, nonTgr: 104366000, lainLain: 0, total: 946626000 },
          netto: 15358354000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 860, istriSuami: 104, anak: 352, cacat: 0, total: 1316 },
          bruto: { pensiunPokok: 4351228090, tunjKeluarga: 98630956, tunjBeras: 119606650, cacatLain: 0, lainLain: 229979098, total: 4799444794 },
          potongan: { pph21: 228791000, askes: 21610000, tgr: 0, nonTgr: 31027000, lainLain: 0, total: 281428000 },
          netto: 4518016794
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 114, istriSuami: 0, anak: 65, cacat: 0, total: 179 },
          bruto: { pensiunPokok: 716133000, tunjKeluarga: 22157000, tunjBeras: 19571000, cacatLain: 0, lainLain: 37845000, total: 795706000 },
          potongan: { pph21: 37649488, askes: 3556287, tgr: 0, nonTgr: 5105219, lainLain: 0, total: 46310994 },
          netto: 749395006
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 15, istriSuami: 0, anak: 0, cacat: 0, total: 15 },
          bruto: { pensiunPokok: 75000000, tunjKeluarga: 2500000, tunjBeras: 2176000, cacatLain: 0, lainLain: 3970000, total: 83646000 },
          potongan: { pph21: 3950000, askes: 374000, tgr: 0, nonTgr: 538000, lainLain: 0, total: 4862000 },
          netto: 78784000
        }
      ],
      totalJiwa: { penerima: 3297, istriSuami: 684, anak: 1967, cacat: 0, total: 5948 },
      totalBruto: { pensiunPokok: 19778311090, tunjKeluarga: 616438956, tunjBeras: 543666650, cacatLain: 0, lainLain: 1045360098, total: 21983776794 },
      totalPotongan: { pph21: 1039959488, askes: 98231287, tgr: 0, nonTgr: 141036219, lainLain: 0, total: 1279226994 },
      totalNetto: 20704549800
    }
  ];

  // Filter DAPEM
  const filteredDapemList = dapemData.filter(d => {
    if (filterKelompok !== "Semua" && d.namaKelompok !== filterKelompok) return false;
    if (selectedDropdownDapem !== "semua" && d.kodeMAK !== selectedDropdownDapem) return false;
    return true;
  });

  // Grand Totals
  const grandTotalJiwa = {
    penerima: dapemData.reduce((a, d) => a + d.totalJiwa.penerima, 0),
    istriSuami: dapemData.reduce((a, d) => a + d.totalJiwa.istriSuami, 0),
    anak: dapemData.reduce((a, d) => a + d.totalJiwa.anak, 0),
    cacat: dapemData.reduce((a, d) => a + d.totalJiwa.cacat, 0),
    total: dapemData.reduce((a, d) => a + d.totalJiwa.total, 0),
  };

  const grandTotalBruto = {
    pensiunPokok: dapemData.reduce((a, d) => a + d.totalBruto.pensiunPokok, 0),
    tunjKeluarga: dapemData.reduce((a, d) => a + d.totalBruto.tunjKeluarga, 0),
    tunjBeras: dapemData.reduce((a, d) => a + d.totalBruto.tunjBeras, 0),
    cacatLain: dapemData.reduce((a, d) => a + d.totalBruto.cacatLain, 0),
    lainLain: dapemData.reduce((a, d) => a + d.totalBruto.lainLain, 0),
    total: dapemData.reduce((a, d) => a + d.totalBruto.total, 0),
  };

  const grandTotalPotongan = {
    pph21: dapemData.reduce((a, d) => a + d.totalPotongan.pph21, 0),
    askes: dapemData.reduce((a, d) => a + d.totalPotongan.askes, 0),
    tgr: dapemData.reduce((a, d) => a + d.totalPotongan.tgr, 0),
    nonTgr: dapemData.reduce((a, d) => a + d.totalPotongan.nonTgr, 0),
    lainLain: dapemData.reduce((a, d) => a + d.totalPotongan.lainLain, 0),
    total: dapemData.reduce((a, d) => a + d.totalPotongan.total, 0),
  };

  const grandTotalNetto = dapemData.reduce((a, d) => a + d.totalNetto, 0);

  // Grand total per jenis pensiun
  const jenisKeys = ["a", "b", "c", "d"];
  const grandTotalJenisList = jenisKeys.map(k => {
    const matching = dapemData.map(d => d.jenisList.find(j => j.id === k)).filter(Boolean);
    const nama = matching[0]?.nama || "";
    return {
      id: k,
      nama,
      jiwa: {
        penerima: matching.reduce((a, m) => a + m.jiwa.penerima, 0),
        istriSuami: matching.reduce((a, m) => a + m.jiwa.istriSuami, 0),
        anak: matching.reduce((a, m) => a + m.jiwa.anak, 0),
        cacat: matching.reduce((a, m) => a + m.jiwa.cacat, 0),
        total: matching.reduce((a, m) => a + m.jiwa.total, 0),
      },
      bruto: {
        pensiunPokok: matching.reduce((a, m) => a + m.bruto.pensiunPokok, 0),
        tunjKeluarga: matching.reduce((a, m) => a + m.bruto.tunjKeluarga, 0),
        tunjBeras: matching.reduce((a, m) => a + m.bruto.tunjBeras, 0),
        cacatLain: matching.reduce((a, m) => a + m.bruto.cacatLain, 0),
        lainLain: matching.reduce((a, m) => a + m.bruto.lainLain, 0),
        total: matching.reduce((a, m) => a + m.bruto.total, 0),
      },
      potongan: {
        pph21: matching.reduce((a, m) => a + m.potongan.pph21, 0),
        askes: matching.reduce((a, m) => a + m.potongan.askes, 0),
        tgr: matching.reduce((a, m) => a + m.potongan.tgr, 0),
        nonTgr: matching.reduce((a, m) => a + m.potongan.nonTgr, 0),
        lainLain: matching.reduce((a, m) => a + m.potongan.lainLain, 0),
        total: matching.reduce((a, m) => a + m.potongan.total, 0),
      },
      netto: matching.reduce((a, m) => a + m.netto, 0),
    };
  });

  const toggleExpand = (kode) => {
    setExpandedDapem(prev => ({ ...prev, [kode]: !prev[kode] }));
  };

  const renderJenisRows = (jenis, index, isSubtotal = false, customLabel = null) => {
    const isFilteredOut = filterJenisPensiun !== "Semua" && jenis.nama !== filterJenisPensiun && !isSubtotal;
    if (isFilteredOut) return null;

    const rowBg = isSubtotal ? "#E2E8F0" : index % 2 === 0 ? COLORS.white : "#F8FAFC";
    const textWeight = isSubtotal ? 800 : 500;
    const labelColor = isSubtotal ? "#0F172A" : "#1E293B";

    return (
      <tr key={jenis.id || "subtotal"} style={{ borderBottom: `1px solid ${isSubtotal ? "#94A3B8" : "#E2E8F0"}`, background: rowBg }}>
        {/* Kolom Jenis Pensiun */}
        <td style={{ padding: "9px 12px", fontWeight: textWeight, color: labelColor, verticalAlign: "top", borderRight: `1px solid #E2E8F0` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isSubtotal ? <strong style={{ color: "#0F172A" }}>{customLabel || "TOTAL / SUBTOTAL"}</strong> : <span>{jenis.nama}</span>}
          </div>
        </td>

        {/* Kolom Jumlah Jiwa (A, B, C, D, TOTAL) */}
        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Penerima:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.penerima)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. Istri/Suami:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.istriSuami)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>C. Anak:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.anak)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>D. Cacat:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.cacat)}</strong></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#0F172A" }}>
              <span>Total Jiwa:</span> <span style={{ fontFamily: "monospace" }}>{fmtJiwa(jenis.jiwa.total)}</span>
            </div>
          </div>
        </td>

        {/* Kolom Jumlah Bruto (A, B, C, D, E, TOTAL) */}
        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Pokok:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.pensiunPokok)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. T.Keluarga:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjKeluarga)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>C. T.Beras:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjBeras)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>D. Cacat:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.cacatLain)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>E. Lain-lain:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.lainLain)}</span></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#15803D" }}>
              <span>Total Bruto:</span> <span style={{ fontFamily: "monospace" }}>{fmt(jenis.bruto.total)}</span>
            </div>
          </div>
        </td>

        {/* Kolom Potongan PPH 21 */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.pph21)}
        </td>

        {/* Kolom Potongan ASKES */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.askes)}
        </td>

        {/* Kolom Potongan TGR */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: jenis.potongan.tgr > 0 ? "#DC2626" : "#94A3B8" }}>
          {fmt(jenis.potongan.tgr)}
        </td>

        {/* Kolom Potongan Non TGR */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.nonTgr)}
        </td>

        {/* Kolom Potongan Lain-lain */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: jenis.potongan.lainLain > 0 ? "#D97706" : "#94A3B8" }}>
          {fmt(jenis.potongan.lainLain)}
        </td>

        {/* Kolom Jumlah Potongan */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, fontWeight: 700, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#DC2626", background: isSubtotal ? "#FEE2E2" : "#FEF2F2" }}>
          {fmt(jenis.potongan.total)}
        </td>

        {/* Kolom Jumlah Netto */}
        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 12.5, fontWeight: 800, verticalAlign: "middle", color: "#0F172A", background: isSubtotal ? "#E0F2FE" : "#F0F9FF" }}>
          {fmt(jenis.netto)}
        </td>
      </tr>
    );
  };

  const closeAllDetails = () => {
    setExpandedDapem({
      "513113": false,
      "513114": false,
      "513122": false,
      "513123": false,
      "total": false,
    });
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Stat Cards Ringkasan */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard
          icon={<Users size={IC} />}
          label="Total Jiwa & Penerima"
          value={`${fmtJiwa(grandTotalJiwa.total)} Jiwa`}
          sub={`${fmtJiwa(grandTotalJiwa.penerima)} Penerima • ${fmtJiwa(grandTotalJiwa.istriSuami)} Pasangan • ${fmtJiwa(grandTotalJiwa.anak)} Anak`}
          color={COLORS.blue}
        />
        <StatCard
          icon={<Banknote size={IC} />}
          label="Total Jumlah Bruto"
          value={fmt(grandTotalBruto.total)}
          sub={`Pokok ${fmt(grandTotalBruto.pensiunPokok)} + Tunjangan`}
          color={COLORS.green}
        />
        <StatCard
          icon={<Receipt size={IC} />}
          label="Total Potongan"
          value={fmt(grandTotalPotongan.total)}
          sub={`PPh21 ${fmt(grandTotalPotongan.pph21)} • Askes ${fmt(grandTotalPotongan.askes)}`}
          color={COLORS.red}
        />
        <StatCard
          icon={<Wallet size={IC} />}
          label="Total Netto Disalurkan"
          value={fmt(grandTotalNetto)}
          sub="Realisasi Bersih Pembayaran Pensiun"
          color={COLORS.blueDark}
        />
      </div>

      {/* CARD TUNGGAL: DAFTAR DAPEM + FILTER TERINTEGRASI */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid #CBD5E1`, marginBottom: 24, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
        
        {/* CORPORATE UNIFIED CONTROL TOOLBAR */}
        <div style={{
          background: "#F8FAFC",
          borderRadius: 8,
          border: "1px solid #CBD5E1",
          padding: "12px 16px",
          marginBottom: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          {/* Baris 1: Segmented Control Kelompok DAPEM (Kiri) & Action Buttons (Kanan) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #E2E8F0", paddingBottom: 11 }}>
            {/* Segmented Controller Tab */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>
                Kelompok DAPEM:
              </span>
              <div style={{ display: "inline-flex", background: "#E2E8F0", padding: 3, borderRadius: 7, gap: 3 }}>
                {[
                  { id: "semua", label: "Semua (4 DAPEM)" },
                  { id: "513113", label: "PNS KEMHAN (513113)" },
                  { id: "513114", label: "PNS POLRI (513114)" },
                  { id: "513122", label: "TNI (513122)" },
                  { id: "513123", label: "POLRI (513123)" },
                ].map((item) => {
                  const isSelected = selectedDropdownDapem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDropdownDapem(item.id);
                        if (item.id !== "semua") {
                          setExpandedDapem(prev => ({ ...prev, [item.id]: true }));
                        }
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 500,
                        border: "none",
                        background: isSelected ? "#FFFFFF" : "transparent",
                        color: isSelected ? "#0F172A" : "#475569",
                        boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <button
                onClick={closeAllDetails}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid #CBD5E1`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  transition: "all 0.18s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFFFFF"}
                title="Tutup seluruh rincian sub-detail DAPEM"
              >
                <ChevronDown size={14} color="#475569" style={{ transform: "rotate(180deg)" }} />
                <span>Tutup Semua Detail</span>
              </button>

              <Btn
                variant="primary"
                size="sm"
                onClick={() => {
                  setPreview({
                    title: "Daftar Rekapitulasi III DAPEM & Non DAPEM",
                    subtitle: `${filterPeriode} • ${filterPenyaluran} — Rekapitulasi Pembayaran Pensiun Resmi`,
                    type: "table",
                    fileName: `Daftar_Rekapitulasi_III_DAPEM_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                    content: {
                      columns: ["No", "Kelompok Pensiun (MAK)", "Jenis Pensiun", "Total Jiwa", "Pensiun Pokok", "Total Bruto", "PPh 21", "ASKES", "Non TGR", "Total Potongan", "Jumlah Netto"],
                      rows: dapemData.flatMap(d => [
                        ...d.jenisList.map(j => [d.no, d.namaKelompok, j.nama, j.jiwa.total.toLocaleString(), fmt(j.bruto.pensiunPokok), fmt(j.bruto.total), fmt(j.potongan.pph21), fmt(j.potongan.askes), fmt(j.potongan.nonTgr), fmt(j.potongan.total), fmt(j.netto)]),
                        ["", `SUBTOTAL ${d.singkatan}`, "TOTAL", d.totalJiwa.total.toLocaleString(), fmt(d.totalBruto.pensiunPokok), fmt(d.totalBruto.total), fmt(d.totalPotongan.pph21), fmt(d.totalPotongan.askes), fmt(d.totalPotongan.nonTgr), fmt(d.totalPotongan.total), fmt(d.totalNetto)],
                      ]),
                      totalRows: dapemData.length * 5,
                    }
                  });
                }}
              >
                <Download size={14} /> Ekspor Data
              </Btn>
            </div>
          </div>

          {/* Baris 2: Parameter Filter Dropdown Rinci */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
              <Filter size={13} color="#64748B" />
              <span style={{ fontWeight: 600 }}>Filter Rincian:</span>
            </div>

            {/* Filter Jenis Pensiun */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Jenis:</span>
              <select
                value={filterJenisPensiun}
                onChange={e => setFilterJenisPensiun(e.target.value)}
                style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              >
                <option value="Semua">Semua Jenis Pensiun</option>
                <option value="a. Pensiun Sendiri">a. Pensiun Sendiri</option>
                <option value="b. Pensiun Warakawuri/Janda/Duda">b. Pensiun Warakawuri/Janda/Duda</option>
                <option value="c. Tunjangan Yatim Piatu">c. Tunjangan Yatim Piatu</option>
                <option value="d. Tunjangan Orang Tua">d. Tunjangan Orang Tua</option>
              </select>
            </div>

            {/* Filter Tanggal / Periode SP */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Tgl Awal:</span>
              <input
                type="date"
                value={tglAwal}
                onChange={e => setTglAwal(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Tgl Akhir:</span>
              <input
                type="date"
                value={tglAkhir}
                onChange={e => setTglAkhir(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>

            {/* Filter Metode Penyaluran */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Penyaluran:</span>
              <select
                value={filterPenyaluran}
                onChange={e => setFilterPenyaluran(e.target.value)}
                style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              >
                <option value="Gabungan POS dan Bank">Gabungan POS dan Bank</option>
                <option value="Bank Mandiri / BSI">Bank Mandiri / BSI</option>
                <option value="BRI / BNI">BRI / BNI</option>
                <option value="PT POS Indonesia">PT POS Indonesia</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(selectedDropdownDapem !== "semua" || filterJenisPensiun !== "Semua") && (
              <button
                onClick={() => {
                  setSelectedDropdownDapem("semua");
                  setFilterJenisPensiun("Semua");
                }}
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  color: "#B91C1C",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginLeft: "auto"
                }}
              >
                ✕ Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* TABEL LIST REKAPITULASI III (NETRAL SERAGAM & KONTRAS TINGGI) */}
        {filteredDapemList.length === 0 ? (
          <NoData />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredDapemList.map((dapem) => {
              const isOpen = !!expandedDapem[dapem.kodeMAK];

              return (
                <div key={dapem.kodeMAK} style={{ borderRadius: 8, border: `1px solid #CBD5E1`, overflow: "hidden", background: COLORS.white, boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}>
                  {/* DAPEM Card Header Netral & Seragam (Clickable Accordion) */}
                  <div
                    onClick={() => toggleExpand(dapem.kodeMAK)}
                    style={{
                      padding: "12px 18px",
                      background: "#F8FAFC",
                      color: "#0F172A",
                      borderBottom: isOpen ? `1px solid #CBD5E1` : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      userSelect: "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 4, background: "#334155", color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {dapem.no}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                          {dapem.namaKelompok}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
                          MAK: <strong style={{ color: "#334155" }}>{dapem.kodeMAK}</strong> • {fmtJiwa(dapem.totalJiwa.total)} Jiwa ({fmtJiwa(dapem.totalJiwa.penerima)} Penerima)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#64748B", fontWeight: 600 }}>Total Bruto</div>
                        <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace", color: "#0F172A" }}>{fmt(dapem.totalBruto.total)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#64748B", fontWeight: 600 }}>Total Potongan</div>
                        <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace", color: "#DC2626" }}>{fmt(dapem.totalPotongan.total)}</div>
                      </div>
                      <div style={{ textAlign: "right", background: "#FFFFFF", border: `1.5px solid #0F172A`, padding: "4px 12px", borderRadius: 6 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>Jumlah Netto</div>
                        <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "monospace", color: "#0F172A" }}>{fmt(dapem.totalNetto)}</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#475569", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Body: Detail Matrix Table per DAPEM */}
                  {isOpen && (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#1E293B", color: COLORS.white }}>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.white, width: 220, borderRight: `1px solid #334155` }}>JENIS PENSIUN</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: COLORS.white, width: 170, borderRight: `1px solid #334155` }}>JUMLAH JIWA</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: COLORS.white, width: 210, borderRight: `1px solid #334155` }}>JUMLAH BRUTO</th>
                            <th colSpan={6} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: `1px solid #334155` }}>POTONGAN</th>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#93C5FD", width: 160 }}>JUMLAH NETTO</th>
                          </tr>
                          <tr style={{ background: "#334155", color: "#F8FAFC", fontSize: 11 }}>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>PPh 21</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>ASKES</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>TGR</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>NON TGR</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>Lain-Lain</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, color: "#FCA5A5", borderRight: `1px solid #475569` }}>Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dapem.jenisList.map((jenis, jIdx) => renderJenisRows(jenis, jIdx))}
                          {renderJenisRows(
                            {
                              id: "subtotal",
                              nama: `TOTAL / SUBTOTAL ${dapem.namaKelompok}`,
                              jiwa: dapem.totalJiwa,
                              bruto: dapem.totalBruto,
                              potongan: dapem.totalPotongan,
                              netto: dapem.totalNetto
                            },
                            999,
                            true,
                            `TOTAL SUBTOTAL (${dapem.singkatan})`
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            {/* GRAND TOTAL SUMMARY CARD (SESUAI SHEET EXCEL) */}
            <div style={{ borderRadius: 8, border: `1.5px solid #0F172A`, overflow: "hidden", background: COLORS.white, marginTop: 6 }}>
              <div
                onClick={() => toggleExpand("total")}
                style={{
                  padding: "13px 18px",
                  background: "#0F172A",
                  color: COLORS.white,
                  borderBottom: expandedDapem["total"] ? `1px solid #334155` : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Shield size={20} color="#F59E0B" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.white, letterSpacing: 0.3 }}>
                      JUMLAH GRAND TOTAL (SELURUH KELOMPOK PENSIUN DAPEM)
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                      4 Kelompok Pensiun • {fmtJiwa(grandTotalJiwa.total)} Total Jiwa • {fmtJiwa(grandTotalJiwa.penerima)} Penerima Manfaat
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#94A3B8" }}>Total Bruto</div>
                    <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "monospace", color: COLORS.white }}>{fmt(grandTotalBruto.total)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#94A3B8" }}>Total Potongan</div>
                    <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "monospace", color: "#FCA5A5" }}>{fmt(grandTotalPotongan.total)}</div>
                  </div>
                  <div style={{ textAlign: "right", background: "#F59E0B", color: "#0F172A", padding: "5px 14px", borderRadius: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Grand Total Netto</div>
                    <div style={{ fontWeight: 900, fontSize: 16, fontFamily: "monospace" }}>{fmt(grandTotalNetto)}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#94A3B8", transform: expandedDapem["total"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </div>
                </div>
              </div>

              {expandedDapem["total"] && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#1E293B", color: COLORS.white }}>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: COLORS.white, width: 220, borderRight: `1px solid #334155` }}>REKAP PER JENIS PENSIUN</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: COLORS.white, width: 170, borderRight: `1px solid #334155` }}>JUMLAH JIWA</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 700, color: COLORS.white, width: 210, borderRight: `1px solid #334155` }}>JUMLAH BRUTO</th>
                        <th colSpan={6} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: `1px solid #334155` }}>TOTAL POTONGAN GABUNGAN</th>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#93C5FD", width: 160 }}>JUMLAH NETTO</th>
                      </tr>
                      <tr style={{ background: "#334155", color: "#F8FAFC", fontSize: 11 }}>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>PPh 21</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>ASKES</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>TGR</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>NON TGR</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#F8FAFC", borderRight: `1px solid #475569` }}>Lain-Lain</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, color: "#FCA5A5", borderRight: `1px solid #475569` }}>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grandTotalJenisList.map((jenis, jIdx) => renderJenisRows(jenis, jIdx))}
                      {renderJenisRows(
                        {
                          id: "grandtotal",
                          nama: "GRAND TOTAL SELURUHNYA",
                          jiwa: grandTotalJiwa,
                          bruto: grandTotalBruto,
                          potongan: grandTotalPotongan,
                          netto: grandTotalNetto
                        },
                        999,
                        true,
                        "GRAND TOTAL REKAPITULASI III"
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
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
  const [tglAwal, setTglAwal] = useState("2026-01-01");
  const [tglAkhir, setTglAkhir] = useState("2026-12-31");
  const [filterRekapBulan, setFilterRekapBulan] = useState("Semua");
  const [filterRekapTahun, setFilterRekapTahun] = useState("2026");
  const [filterRekapProgram, setFilterRekapProgram] = useState("Semua Program");

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
        {[{ id: "dashboard", l: "Dashboard Program" }, { id: "peserta", l: "Daftar Peserta (Tabel 5)" }, { id: "rekap", l: "Rekapitulasi Polis" }, { id: "ba", l: "Berita Acara" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "transparent", display: "flex", alignItems: "center", gap: 6, color: tab === t.id ? COLORS.blue : COLORS.gray500, borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", marginBottom: -2 }}>
            {t.l}
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

      {/* TAB: Rekapitulasi Polis (Tabel 8 BRS) */}
      {tab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Rekapitulasi Polis Taspen Life (Tabel 8 BRS)", subtitle: `Filter: ${filterRekapBulan} ${filterRekapTahun}`, type: "table", fileName: `Rekapitulasi_Polis_${filterRekapTahun}_${filterRekapBulan}.xlsx`, content: { columns: ["No", "Bulan Polis", "Program", "Jumlah Peserta", "Nominal Premi", "Total Fee Base (Imbal Jasa)"], rows: [
                [1, "Januari 2026", "TDS (THT)", 1240, fmt(558000000), fmt(558000000 * 0.025)],
                [2, "Februari 2026", "TDS (THT)", 1255, fmt(564750000), fmt(564750000 * 0.025)],
                [3, "Maret 2026", "TDS (THT)", 1260, fmt(567000000), fmt(567000000 * 0.025)],
                [4, "April 2026", "TDS (THT)", 1280, fmt(576000000), fmt(576000000 * 0.025)],
                [5, "Mei 2026", "TDS (THT)", 1290, fmt(580500000), fmt(580500000 * 0.025)],
                [6, "Juni 2026", "TDS (THT)", 1310, fmt(589500000), fmt(589500000 * 0.025)],
                [7, "Juli 2026", "TDS (THT)", 1325, fmt(596250000), fmt(596250000 * 0.025)],
              ], totalRows: 7 } })}>Ekspor Excel</Btn>
            </div>
          }>Rekapitulasi Polis — Tabel 8 BRS</SectionTitle>

          <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
            <Select label="Program Taspen Life" value={filterRekapProgram} onChange={setFilterRekapProgram} options={["Semua Program", "TDS (THT)", "Proteksi Beasiswa JKK", "Proteksi Beasiswa JKm"]} minW={220} />
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
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { progKey: "TDS (THT)", title: "REKAPITULASI POLIS ASURANSI TASPEN DWIGUNA SEJAHTERA (PROGRAM THT — TARIF 2,5%)", color: "blue", rate: 0.025, data: [
                { bln: "Januari", thn: "2026", peserta: 1240, premi: 558000000 },
                { bln: "Februari", thn: "2026", peserta: 1255, premi: 564750000 },
                { bln: "Maret", thn: "2026", peserta: 1260, premi: 567000000 },
                { bln: "April", thn: "2026", peserta: 1280, premi: 576000000 },
                { bln: "Mei", thn: "2026", peserta: 1290, premi: 580500000 },
                { bln: "Juni", thn: "2026", peserta: 1310, premi: 589500000 },
                { bln: "Juli", thn: "2026", peserta: 1325, premi: 596250000 },
                { bln: "Januari", thn: "2025", peserta: 1100, premi: 495000000 },
                { bln: "Februari", thn: "2025", peserta: 1120, premi: 504000000 },
                { bln: "Maret", thn: "2025", peserta: 1135, premi: 510750000 },
                { bln: "April", thn: "2025", peserta: 1150, premi: 517500000 },
                { bln: "Mei", thn: "2025", peserta: 1170, premi: 526500000 },
                { bln: "Juni", thn: "2025", peserta: 1190, premi: 535500000 },
                { bln: "Juli", thn: "2025", peserta: 1200, premi: 540000000 },
                { bln: "Agustus", thn: "2025", peserta: 1210, premi: 544500000 },
                { bln: "September", thn: "2025", peserta: 1220, premi: 549000000 },
                { bln: "Oktober", thn: "2025", peserta: 1225, premi: 551250000 },
                { bln: "November", thn: "2025", peserta: 1230, premi: 553500000 },
                { bln: "Desember", thn: "2025", peserta: 1235, premi: 555750000 },
              ]},
              { progKey: "Proteksi Beasiswa JKK", title: "REKAPITULASI POLIS ASURANSI TASPEN PROTEKSI BEASISWA (PROGRAM JKK — TARIF 3,0%)", color: "orange", rate: 0.03, data: [
                { bln: "Januari", thn: "2026", peserta: 820, premi: 442800000 },
                { bln: "Februari", thn: "2026", peserta: 835, premi: 450900000 },
                { bln: "Maret", thn: "2026", peserta: 840, premi: 453600000 },
                { bln: "April", thn: "2026", peserta: 850, premi: 459000000 },
                { bln: "Mei", thn: "2026", peserta: 860, premi: 464400000 },
                { bln: "Juni", thn: "2026", peserta: 875, premi: 472500000 },
                { bln: "Juli", thn: "2026", peserta: 890, premi: 480600000 },
                { bln: "Januari", thn: "2025", peserta: 710, premi: 383400000 },
                { bln: "Februari", thn: "2025", peserta: 720, premi: 388800000 },
                { bln: "Maret", thn: "2025", peserta: 730, premi: 394200000 },
                { bln: "April", thn: "2025", peserta: 745, premi: 402300000 },
                { bln: "Mei", thn: "2025", peserta: 760, premi: 410400000 },
                { bln: "Juni", thn: "2025", peserta: 775, premi: 418500000 },
                { bln: "Juli", thn: "2025", peserta: 785, premi: 423900000 },
                { bln: "Agustus", thn: "2025", peserta: 795, premi: 429300000 },
                { bln: "September", thn: "2025", peserta: 800, premi: 432000000 },
                { bln: "Oktober", thn: "2025", peserta: 805, premi: 434700000 },
                { bln: "November", thn: "2025", peserta: 810, premi: 437400000 },
                { bln: "Desember", thn: "2025", peserta: 815, premi: 440100000 },
              ]},
              { progKey: "Proteksi Beasiswa JKm", title: "REKAPITULASI POLIS ASURANSI TASPEN PROTEKSI BEASISWA (PROGRAM JKM — TARIF 3,0%)", color: "green", rate: 0.03, data: [
                { bln: "Januari", thn: "2026", peserta: 780, premi: 241800000 },
                { bln: "Februari", thn: "2026", peserta: 790, premi: 244900000 },
                { bln: "Maret", thn: "2026", peserta: 795, premi: 246450000 },
                { bln: "April", thn: "2026", peserta: 805, premi: 249550000 },
                { bln: "Mei", thn: "2026", peserta: 815, premi: 252650000 },
                { bln: "Juni", thn: "2026", peserta: 825, premi: 255750000 },
                { bln: "Juli", thn: "2026", peserta: 840, premi: 260400000 },
                { bln: "Januari", thn: "2025", peserta: 690, premi: 213900000 },
                { bln: "Februari", thn: "2025", peserta: 700, premi: 217000000 },
                { bln: "Maret", thn: "2025", peserta: 710, premi: 220100000 },
                { bln: "April", thn: "2025", peserta: 720, premi: 223200000 },
                { bln: "Mei", thn: "2025", peserta: 735, premi: 227850000 },
                { bln: "Juni", thn: "2025", peserta: 745, premi: 230950000 },
                { bln: "Juli", thn: "2025", peserta: 755, premi: 234050000 },
                { bln: "Agustus", thn: "2025", peserta: 760, premi: 235600000 },
                { bln: "September", thn: "2025", peserta: 765, premi: 237150000 },
                { bln: "Oktober", thn: "2025", peserta: 770, premi: 238700000 },
                { bln: "November", thn: "2025", peserta: 772, premi: 239320000 },
                { bln: "Desember", thn: "2025", peserta: 775, premi: 240250000 },
              ]},
            ].filter(sec => filterRekapProgram === "Semua Program" || sec.progKey === filterRekapProgram)
             .map((sec, si) => {
              const rows = sec.data.filter(r => {
                if (filterRekapTahun !== "Semua" && r.thn !== filterRekapTahun) return false;
                if (filterRekapBulan !== "Semua" && r.bln !== filterRekapBulan) return false;
                return true;
              });
              const totPeserta = rows.reduce((a, r) => a + r.peserta, 0);
              const totPremi = rows.reduce((a, r) => a + r.premi, 0);
              const totFee = totPremi * sec.rate;
              return (
                <div key={si} style={{ border: `1px solid #CBD5E1`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
                  <div style={{ padding: "11px 14px", background: "#1E293B", borderBottom: `1px solid #334155`, fontSize: 13, fontWeight: 700, color: COLORS.white }}>
                    {sec.title}
                  </div>
                  {rows.length === 0 ? <NoData text="Tidak ada data rekapitulasi polis pada filter ini." /> : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                      <thead>
                        <tr style={{ background: "#334155", color: COLORS.white }}>
                          {["No", "Bulan Polis", "Jumlah Peserta", "Nominal Premi (Rp)", "Total Fee Base / Imbal Jasa (Rp)"].map((c, k) => (
                            <th key={k} style={{ padding: "9px 12px", textAlign: k >= 2 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #475569`, borderRight: k < 4 ? "1px solid #475569" : "none" }}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, ri) => (
                          <tr key={ri} style={{ borderBottom: `1px solid #E2E8F0`, background: ri % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = ri % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                            <td style={{ padding: "9px 12px", color: "#64748B", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{ri + 1}</td>
                            <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.bln} {r.thn}</td>
                            <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{r.peserta.toLocaleString("id-ID")}</td>
                            <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(r.premi)}</td>
                            <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark }}>{fmt(r.premi * sec.rate)}</td>
                          </tr>
                        ))}
                        <tr style={{ background: "#0F172A", color: COLORS.white, fontWeight: 800 }}>
                          <td colSpan={2} style={{ padding: "10px 12px", color: COLORS.white }}>Total {sec.title.split("(")[1]?.replace(")", "")}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: "#93C5FD" }}>{totPeserta.toLocaleString("id-ID")}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.white }}>{fmt(totPremi)}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#86EFAC", fontSize: 13 }}>{fmt(totFee)}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
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
            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    {["Cabang", "No. KTPA", "No. Polis", "Tgl Ajuan", "No. SP", "Tgl Lahir", "Nama Pemegang Polis", "Program", "NIK", "Premi", "Status"].map((c, i) => (
                      <th key={i} style={{ padding: "10px 11px", textAlign: i === 9 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 10 ? "1px solid #334155" : "none", whiteSpace: "nowrap", fontSize: 11.5 }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{rows.map((p, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: !p.nikValid ? COLORS.orangeLight : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                    onMouseEnter={e => { if (p.nikValid) e.currentTarget.style.background = "#F1F5F9"; }} onMouseLeave={e => { if (p.nikValid) e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"; }}>
                    <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>{p.cabang}</td>
                    <td style={{ padding: "9px 11px", fontFamily: "monospace", fontSize: 11.5, borderRight: "1px solid #E2E8F0" }}>{p.ktpa}</td>
                    <td style={{ padding: "9px 11px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{p.noPolis}</td>
                    <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>{p.tglAju}</td>
                    <td style={{ padding: "9px 11px", fontFamily: "monospace", fontSize: 11.5, color: p.noSP === "—" ? "#94A3B8" : "#334155", borderRight: "1px solid #E2E8F0" }}>{p.noSP}</td>
                    <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}>{p.tglLahir}</td>
                    <td style={{ padding: "9px 11px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{p.nama}</td>
                    <td style={{ padding: "9px 11px", borderRight: "1px solid #E2E8F0" }}><Badge color={progColor(p.program)}>{progShort(p.program)}</Badge></td>
                    <td style={{ padding: "9px 11px", fontFamily: "monospace", fontSize: 11.5, borderRight: "1px solid #E2E8F0" }}>
                      {p.nikValid ? p.nik : <span style={{ color: COLORS.red, fontWeight: 700 }}>{p.nik || "(kosong)"} <AlertTriangle size={11} style={{ verticalAlign: "middle" }} /></span>}
                    </td>
                    <td style={{ padding: "9px 11px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(p.premi)}</td>
                    <td style={{ padding: "9px 11px" }}><Badge color={p.status === "Sudah Dibayar" ? "green" : p.status === "Dalam Proses" ? "orange" : "gray"}>{p.status}</Badge></td>
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



      {/* TAB: Berita Acara */}
      {tab === "ba" && (
        <div>
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 24, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle>Unggah Berita Acara dari Divisi Kepesertaan</SectionTitle>
            <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#F57F17", display: "flex", gap: 8 }}>
              <AlertTriangle size={14} />
              <span>Pembayaran premi hanya dapat diproses apabila Berita Acara telah diterima dan direkonsiliasi bersama Divisi Layanan (BR-TL-02).</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Awal</label><input type="date" defaultValue="2026-06-01" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, boxSizing: "border-box" }} /></div>
              <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Akhir</label><input type="date" defaultValue="2026-06-30" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, boxSizing: "border-box" }} /></div>
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
              <div style={{ borderRadius: 8, border: `1px solid #CBD5E1`, overflow: "hidden", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#1E293B", color: COLORS.white }}>
                      {["Berlaku", "Program", "Lama", "Baru", "Diubah Oleh"].map((c, i) => (
                        <th key={i} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 4 ? "1px solid #334155" : "none" }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{riwayatTarif.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{r.tgl}</td>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color={progColor(r.prog)}>{progShort(r.prog)}</Badge></td>
                      <td style={{ padding: "9px 12px", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{r.lama}</td>
                      <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{r.baru}</td>
                      <td style={{ padding: "9px 12px", fontSize: 11.5, color: "#475569" }}>{r.oleh}</td>
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
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {["No. Tagihan", "Program", "No. SP Premi", "Periode", "Tgl. Terbit", "Jatuh Tempo", "Tgl. Dibayar", "Status", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < 8 ? "1px solid #334155" : "none", whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{filtered.map((t, i) => {
                return (
                  <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{t.no}</td>
                    <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={progColor(t.program)}>{progShort(t.program)}</Badge></td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, borderRight: "1px solid #E2E8F0" }}>{t.noSP}</td>
                    <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.periode}</td>
                    <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.tglTerbit}</td>
                    <td style={{ padding: "10px 14px", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{t.jatuhTempo}</td>
                    <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>{t.tglBayar || <span style={{ color: "#94A3B8" }}>—</span>}</td>
                    <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}><Badge color={statusColor(t.status)}>{t.status}</Badge></td>
                    <td style={{ padding: "10px 14px" }}>
                      <Btn size="sm" variant="outline" onClick={() => setDetailTagihan(t)}>Detail</Btn>
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

// ===== LIST SP (SURAT PERINTAH) PEMBAYARAN MANFAAT =====
const ListSP = () => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dariTanggal, setDariTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");
  const [mitraBayar, setMitraBayar] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [manfaat, setManfaat] = useState("-- Silahkan Pilih Manfaat --");
  const [cabang, setCabang] = useState("-- Silahkan Pilih Cabang --");
  const [status, setStatus] = useState("Semua");
  const [unor, setUnor] = useState("-- Silahkan Pilih Unit Organisasi --");
  const [statusPersonil, setStatusPersonil] = useState("-- Silahkan Pilih Status Personil --");
  const [dariTanggalDPS, setDariTanggalDPS] = useState("");
  const [sampaiTanggalDPS, setSampaiTanggalDPS] = useState("");
  const [produk, setProduk] = useState("-- Silahkan Pilih Produk --");
  const [preview, setPreview] = useState(null);

  const fmt = n => typeof n === "number" ? `Rp ${n.toLocaleString("id-ID")}` : n;

  const manfaatOptions = [
    "-- Silahkan Pilih Manfaat --",
    "999 - UKP",
    "99999 - Reimboursment Perawatan",
    "IDP - Iuran Dana Pensiun PP 67 (Pra PP No. 102)",
    "JKK BEASISWA - Beasiswa (JKK)",
    "JKK BIAYA ANGKUT - Biaya Angkut",
    "JKK PERAWATAN - Perawatan",
    "JKK SCDB - Santunan Cacat Dinas Biasa",
    "JKK SCDK - Santunan Cacat Dinas Khusus",
    "JKK SRKK GUGUR - Santunan Risiko Kematian Khusus Gugur",
    "JKK SRKK TEWAS - Santunan Risiko Kematian Khusus Tewas",
    "JKM BEASISWA - Bantuan Beasiswa (JKM)",
    "JKM SRK BP - Santunan Resiko Kematian - Biaya Pemakaman",
    "JKM SRK SKS BINTARA/TAMTAMA - Santunan Resiko Kematian - Santunan Kematian Sekaligus untuk bintara dan tamtama",
    "JKM SRK SKS PA - Santunan Resiko Kematian - Santunan Kematian Sekaligus untuk perwira",
    "JKM SRK UDW AKTIF - Santunan Resiko Kematian - Uang Duka wafat Aktif",
    "NTIP - NTIP",
    "PEMBATALAN_BUM - PEMBATALAN BUM",
    "PINPOL - PELUNASAN POLIS",
    "PINPOL - PINJAMAN POLIS",
    "PP - Pensiun Pertama",
    "PPA - Pensiun Pertama Anak",
    "PPI - Pensiun Pertama Istri",
    "PPOR - Pensiun Pertama Orang Tua",
    "RKNT - RISIKO KEMATIAN & NILAI TUNAI ASURANSI",
    "SA - Santunan Asuransi PP 67 (pra PP 102)",
    "SBP - Santunan Biaya Pemakaman PP 67 (pra PP 102)",
    "SNTA - Santunan Nilai Tunai Asuransi PP 67 (pra PP 102)",
    "SRK - Santunan Risiko Kematian PP 67 (pra PP 102)",
    "SRK/SNTA - Santunan Risiko Kematian PP 67 (pra PP 102)",
    "SRKK - Santunan Risiko Kematian Khusus PP 67 (pra PP 102)",
    "THT BPPP - Biaya Pemakaman Peserta Pensiunan",
    "THT NTTA - Nilai Tunai Tabungan Asuransi",
    "THT SBPA - Santunan Biaya Pemakaman Anak",
    "THT SBPI/S - Santunan Biaya pemakaman Istri/Suami",
    "THT TA - Tabungan Asuransi",
    "UDW PENS - Uang Duka wafat Pensiun",
    "UKP - UKP (Uang Kekurangan Pensiun)",
    "UKP-PK - UKP (Uang Kekurangan Pensiun - Pembayaran Kembali)"
  ];

  const spMasterData = [
    {
      kpa: "KPA-001",
      nrp: "198701234",
      nama: "Purn. Kol. Ahmad Rifai",
      produk: "JKK",
      noSP: "SP/JKK/2026/07/001",
      kodeBayar: "KB-99999-01",
      tglSP: "2026-07-05",
      unor: "Kodam Jaya",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KCP Matraman",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Ahmad Rifai",
      nomorRekening: "026101000123",
      jumlahHak: 45000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 45000000,
      noDPS: "DPS-2026-0812",
      tglBayar: "2026-07-10",
      status: "Lunas",
      manfaat: "99999 - Reimboursment Perawatan",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-002",
      nrp: "199205678",
      nama: "Purn. Lettu Budi Kartono",
      produk: "Taspen Life",
      noSP: "SP/TL/2026/07/001",
      kodeBayar: "KB-TL-02",
      tglSP: "2026-07-16",
      unor: "Mabes TNI",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Asuransi Jiwa Taspen",
      cabangMitra: "Kantor Pusat TL",
      saranaBayar: "Virtual Account",
      namaRekening: "PT Asuransi Jiwa Taspen",
      nomorRekening: "1234567890",
      jumlahHak: 830000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 830000,
      noDPS: "DPS-2026-0815",
      tglBayar: "2026-07-20",
      status: "Disetujui",
      manfaat: "PINPOL - PELUNASAN POLIS",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-003",
      nrp: "199012345",
      nama: "Purn. AKP Citra Dewi",
      produk: "THT",
      noSP: "SP/THT/2026/07/004",
      kodeBayar: "KB-SBP-03",
      tglSP: "2026-07-12",
      unor: "Polda Metro Jaya",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Bank Mandiri (Persero)",
      cabangMitra: "KC Thamrin",
      saranaBayar: "CMS Mandiri",
      namaRekening: "Citra Dewi",
      nomorRekening: "137001234567",
      jumlahHak: 15000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 15000000,
      noDPS: "DPS-2026-0818",
      tglBayar: "2026-07-15",
      status: "Lunas",
      manfaat: "SBP - Santunan Biaya Pemakaman PP 67 (pra PP 102)",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-004",
      nrp: "197506789",
      nama: "Purn. Pengatur Agus Salim",
      produk: "UKP",
      noSP: "SP/UKP/2026/07/009",
      kodeBayar: "KB-UKP-04",
      tglSP: "2026-07-18",
      unor: "Setjen Kemhan",
      cabangAsabri: "KC Bandung",
      mitraBayar: "PT Bank Tabungan Negara (BTN)",
      cabangMitra: "KC Bandung",
      saranaBayar: "CMS BTN",
      namaRekening: "Agus Salim",
      nomorRekening: "001230156789",
      jumlahHak: 6200000,
      potonganPajak: 310000,
      potongan: 0,
      jumlahBayar: 5890000,
      noDPS: "DPS-2026-0820",
      tglBayar: "2026-07-22",
      status: "Lunas",
      manfaat: "999 - UKP",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-005",
      nrp: "198604321",
      nama: "Purn. Bripka Anwar Ibrahim",
      produk: "JKK",
      noSP: "SP/JKK/2026/07/012",
      kodeBayar: "KB-SCDK-05",
      tglSP: "2026-07-20",
      unor: "Polda Jabar",
      cabangAsabri: "KC Bandung",
      mitraBayar: "PT Bank Negara Indonesia (BNI)",
      cabangMitra: "KC Juanda",
      saranaBayar: "CMS BNI",
      namaRekening: "Anwar Ibrahim",
      nomorRekening: "0112233445",
      jumlahHak: 85000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 85000000,
      noDPS: "—",
      tglBayar: "—",
      status: "Disetujui",
      manfaat: "JKK SCDK - Santunan Cacat Dinas Khusus",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-006",
      nrp: "199401234",
      nama: "Danu Prasetyo",
      produk: "Dapen",
      noSP: "SP/IDP/2026/07/015",
      kodeBayar: "KB-IDP-06",
      tglSP: "2026-07-22",
      unor: "Ditjen Strahan",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Pos Indonesia",
      cabangMitra: "KPU Jakarta Pusat",
      saranaBayar: "Giropos",
      namaRekening: "Danu Prasetyo",
      nomorRekening: "900123456",
      jumlahHak: 4800000,
      potonganPajak: 120000,
      potongan: 0,
      jumlahBayar: 4680000,
      noDPS: "—",
      tglBayar: "—",
      status: "Draft",
      manfaat: "IDP - Iuran Dana Pensiun PP 67 (Pra PP No. 102)",
      statusPersonil: "Aktif"
    },
    {
      kpa: "KPA-007",
      nrp: "197604567",
      nama: "Purn. Mayor Inf. Surya Darma",
      produk: "JKm",
      noSP: "SP/JKM/2026/07/018",
      kodeBayar: "KB-JKM-07",
      tglSP: "2026-07-24",
      unor: "Lanud Halim",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KC Jakarta Timur",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Surya Darma",
      nomorRekening: "026101987654",
      jumlahHak: 42000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 42000000,
      noDPS: "DPS-2026-0830",
      tglBayar: "2026-07-25",
      status: "Lunas",
      manfaat: "JKM SRK BP - Santunan Resiko Kematian - Biaya Pemakaman",
      statusPersonil: "Wafat / Waris"
    }
  ];

  const filtered = spMasterData.filter(d => {
    if (mitraBayar !== "Semua" && !d.mitraBayar.toLowerCase().includes(mitraBayar.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!d.nama.toLowerCase().includes(q) && !d.nrp.includes(q) && !d.kpa.toLowerCase().includes(q)) return false;
    }
    if (manfaat !== "-- Silahkan Pilih Manfaat --" && d.manfaat !== manfaat) return false;
    if (cabang !== "-- Silahkan Pilih Cabang --" && d.cabangAsabri !== cabang) return false;
    if (status !== "Semua" && d.status !== status) return false;
    if (unor !== "-- Silahkan Pilih Unit Organisasi --" && d.unor !== unor) return false;
    if (statusPersonil !== "-- Silahkan Pilih Status Personil --" && d.statusPersonil !== statusPersonil) return false;
    if (produk !== "-- Silahkan Pilih Produk --" && d.produk !== produk) return false;
    if (dariTanggal && d.tglSP < dariTanggal) return false;
    if (sampaiTanggal && d.tglSP > sampaiTanggal) return false;
    return true;
  });

  const columnsList = [
    "KPA", "NRP/NIP", "NAMA PESERTA", "Produk", "No Surat Perintah", "Kode Bayar", "Tanggal Surat Perintah",
    "Unor", "Kantor Cabang Asabri", "Mitra Bayar", "Cabang Mitra Bayar", "Sarana Bayar", "Nama Rekening",
    "Nomor Rekening", "Jumlah Hak", "Potongan Pajak", "Potongan", "Jumlah Bayar", "No DPS", "Tanggal Bayar", "Status"
  ];

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Filter Panel collapsible */}
      <div style={{ background: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.gray300}`, overflow: "hidden", marginBottom: 20 }}>
        <div onClick={() => setFilterOpen(!filterOpen)} style={{ background: "#0D47A1", color: COLORS.white, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{filterOpen ? "▼" : "►"} Filter</span>
          <span style={{ fontSize: 11 }}>{filterOpen ? "Sembunyikan Panel Filter" : "Buka Panel Filter"}</span>
        </div>

        {filterOpen && (
          <div style={{ padding: 18, background: "#FAFBFD" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Dari Tanggal</label>
                <input type="date" value={dariTanggal} onChange={e => setDariTanggal(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Sampai Tanggal</label>
                <input type="date" value={sampaiTanggal} onChange={e => setSampaiTanggal(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Mitra Bayar</label>
                <input type="text" value={mitraBayar === "Semua" ? "" : mitraBayar} onChange={e => setMitraBayar(e.target.value || "Semua")} placeholder="Cari Mitra Bayar..." style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Nama/KTPA/NRP</label>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Masukkan Nama, KTPA, atau NRP..." style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <Select label="Manfaat" value={manfaat} onChange={setManfaat} options={manfaatOptions} minW="100%" />
              </div>
              <div>
                <Select label="Kantor Cabang Asabri" value={cabang} onChange={setCabang} options={["-- Silahkan Pilih Cabang --", "KC Jakarta", "KC Bandung", "KC Surabaya", "KC Medan", "KC Semarang", "KC Makassar"]} minW="100%" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <Select label="Status" value={status} onChange={setStatus} options={["Semua", "Draft", "Disetujui", "Proses Bayar", "Lunas"]} minW="100%" />
              </div>
              <div>
                <Select label="Unor" value={unor} onChange={setUnor} options={["-- Silahkan Pilih Unit Organisasi --", "Mabes TNI", "Kodam Jaya", "Polda Metro Jaya", "Setjen Kemhan", "Polda Jabar", "Ditjen Strahan", "Lanud Halim"]} minW="100%" />
              </div>
              <div>
                <Select label="Status Personil" value={statusPersonil} onChange={setStatusPersonil} options={["-- Silahkan Pilih Status Personil --", "Aktif", "Pensiun", "Wafat / Waris", "Gugur / Tewas"]} minW="100%" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Dari Tanggal DPS</label>
                <input type="date" value={dariTanggalDPS} onChange={e => setDariTanggalDPS(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Sampai Tanggal DPS</label>
                <input type="date" value={sampaiTanggalDPS} onChange={e => setSampaiTanggalDPS(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <Select label="Produk" value={produk} onChange={setProduk} options={["-- Silahkan Pilih Produk --", "THT", "JKK", "JKm", "Dapen", "Taspen Life", "UKP"]} minW="100%" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={{ padding: "8px 24px", background: "#00A97F", color: COLORS.white, border: "none", borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                🔍 Cari
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: COLORS.gray800, fontWeight: 600 }}>
          <span>Total Peserta : <strong>{filtered.length}</strong></span>
          <span style={{ margin: "0 12px", color: COLORS.gray300 }}>|</span>
          <span>Total SP : <strong>{filtered.length}</strong></span>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Daftar Surat Perintah (List SP)", subtitle: `Filter Manfaat: ${manfaat !== "-- Silahkan Pilih Manfaat --" ? manfaat : "Semua Manfaat"} • Total SP: ${filtered.length}`, type: "table", fileName: `List_SP_Manfaat_${new Date().toISOString().slice(0,10)}.xlsx`, content: { columns: columnsList, rows: filtered.map(d => [d.kpa, d.nrp, d.nama, d.produk, d.noSP, d.kodeBayar, d.tglSP, d.unor, d.cabangAsabri, d.mitraBayar, d.cabangMitra, d.saranaBayar, d.namaRekening, d.nomorRekening, fmt(d.jumlahHak), fmt(d.potonganPajak), fmt(d.potongan), fmt(d.jumlahBayar), d.noDPS, d.tglBayar, d.status]), totalRows: filtered.length } })}>
          📥 Export Akun
        </Btn>
      </div>

      {/* Table */}
      {filtered.length === 0 ? <NoData text="Data Kosong — Tidak ada SP yang sesuai kriteria filter." /> : (
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, background: COLORS.white, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, whiteSpace: "nowrap" }}>
            <thead>
              <tr style={{ background: "#1E293B", color: COLORS.white }}>
                {columnsList.map((c, i) => (
                  <th key={i} style={{ padding: "10px 12px", textAlign: i >= 14 && i <= 17 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < columnsList.length - 1 ? "1px solid #334155" : "none" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{d.kpa}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{d.nrp}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.nama}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color={d.produk === "JKK" ? "orange" : d.produk === "Taspen Life" ? "blue" : d.produk === "THT" ? "green" : "purple"}>{d.produk}</Badge></td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{d.noSP}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.kodeBayar}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.tglSP}</td>
                  <td style={{ padding: "9px 12px", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.unor}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.cabangAsabri}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.mitraBayar}</td>
                  <td style={{ padding: "9px 12px", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.cabangMitra}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.saranaBayar}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.namaRekening}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{d.nomorRekening}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(d.jumlahHak)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.red, borderRight: "1px solid #E2E8F0" }}>{fmt(d.potonganPajak)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(d.potongan)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.green, borderRight: "1px solid #E2E8F0" }}>{fmt(d.jumlahBayar)}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{d.noDPS}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.tglBayar}</td>
                  <td style={{ padding: "9px 12px" }}><Badge color={d.status === "Lunas" ? "green" : d.status === "Disetujui" ? "blue" : "gray"}>{d.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  { section: "REKONSILIASI PERBANKAN", items: [
    { id: "standarisasi_cms", icon: "bank", label: "Standarisasi Format CMS" },
  ]},
  { section: "PENERIMAAN IURAN", items: [
    { icon: "dollar", label: "Administrasi Iuran Peserta", children: [
      { id: "kalkulator", label: "Perhitungan Iuran Peserta" },
      { id: "rekonsiliasi", label: "Rekonsiliasi Penerimaan Dana" },
      { id: "tagihan", label: "Penerbitan Tagihan Kemenkeu", disabled: true },
    ]},
  ]},
  { section: "PEMBAYARAN MANFAAT", items: [
    { icon: "file", label: "Perintah & Realisasi Pembayaran", children: [
      { id: "listsp", label: "List SP (Surat Perintah)" },
      { id: "bayarpensiun", label: "DAPEM" },
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
      { id: "ukp", label: "Rekap Data UKP Pensiun" },
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
  standarisasi_cms: { title: "Standarisasi Format CMS & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  kalkulator: { title: "Perhitungan Iuran Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "Rekonsiliasi Penerimaan Dana", component: RekonsIuran },
  tagihan: { title: "Penerbitan Tagihan Iuran ke Kemenkeu", component: GeneratorTagihan },
  listsp: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: ListSP },
  bayarpensiun: { title: "DAPEM — Daftar Rekapitulasi Pembayaran Pensiun", component: PembayaranPensiun },
  dana: { title: "Ketersediaan Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  rekonrk: { title: "Standarisasi Format CMS & Rekonsiliasi Rekening Koran", component: RekonRekeningKoran },
  klaim: { title: "Daftar Surat Perintah (List SP) Pembayaran Manfaat", component: ListSP },
  kredit: { title: "Penarikan Kelebihan Bayar UDW Punah", component: KreditPiutang },
  imbaljasa: { title: "Tagihan Imbal Jasa Mitra Bayar", component: TagihanImbalJasa },
  tlpolis: { title: "Portofolio Polis & Premi Taspen Life", component: TaspenPolis },
  tlimbaljasa: { title: "Tagihan Imbal Jasa Taspen Life", component: TaspenImbalJasa },
  pajak: { title: "Administrasi PPh 21 & Bukti Potong", component: Perpajakan },
  ukp: { title: "Tabel 24 — Rekap UKP (Uang Kena Pajak) Peserta Pensiun Bulanan", component: RekapUKP },
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
                        border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", transition: "all 0.18s ease",
                        background: isActive ? "#E3F2FD" : "transparent",
                        color: isActive ? COLORS.blue : COLORS.gray700,
                        fontWeight: isActive ? 700 : 400,
                        borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F1F5F9"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{ display: "flex", opacity: isActive ? 1 : 0.6, transition: "transform 0.15s ease" }}>{renderIcon(item.icon, 16, isActive ? COLORS.blue : COLORS.gray500)}</span>
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
                        background: "transparent", transition: "all 0.18s ease",
                        color: hasActiveChild ? COLORS.blue : COLORS.gray700,
                        fontWeight: hasActiveChild ? 700 : 500,
                        borderLeft: "3px solid transparent",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
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
                                fontSize: 12.5, textAlign: "left", transition: "all 0.18s ease",
                                background: isActive ? "#E3F2FD" : "transparent",
                                color: isDisabled ? COLORS.gray400 : isActive ? COLORS.blue : COLORS.gray600,
                                fontWeight: isActive ? 700 : 400,
                                opacity: isDisabled ? 0.5 : 1,
                                borderLeft: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                              }}
                              onMouseEnter={e => { if (!isActive && !isDisabled) e.currentTarget.style.background = "#F8FAFC"; }}
                              onMouseLeave={e => { if (!isActive && !isDisabled) e.currentTarget.style.background = "transparent"; }}
                              >
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
