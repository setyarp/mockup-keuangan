import { DollarSign, BarChart3, FileText } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, ProgressBar, Badge, Btn } from "../components/common";

export const DashboardKeuangan = () => (
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
