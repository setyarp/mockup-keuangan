import { DollarSign, BarChart3, FileText, Landmark, Shield, Users, Building, ArrowUpRight } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, ProgressBar, Badge, Btn } from "../components/common";

export const DashboardKeuangan = () => {
  const makDipaData = [
    {
      kode: "513113",
      uraian: "Belanja Pensiun PNS Kemenhan",
      kelompok: "PNS Kemenhan",
      pagu: 944.0,
      realisasi: 634.3,
      warna: "#4A148C",
      icon: <Building size={18} />
    },
    {
      kode: "513114",
      uraian: "Belanja Pensiun PNS Polri",
      kelompok: "PNS Polri",
      pagu: 228.0,
      realisasi: 151.9,
      warna: "#00695C",
      icon: <Users size={18} />
    },
    {
      kode: "513122",
      uraian: "Belanja Pensiun TNI (AD, AL, AU)",
      kelompok: "TNI",
      pagu: 3152.0,
      realisasi: 2119.8,
      warna: "#1B5E20",
      icon: <Shield size={18} />
    },
    {
      kode: "513123",
      uraian: "Belanja Pensiun POLRI",
      kelompok: "POLRI",
      pagu: 1980.0,
      realisasi: 1331.7,
      warna: "#0D47A1",
      icon: <Landmark size={18} />
    },
  ];

  const totalPagu = makDipaData.reduce((a, m) => a + m.pagu, 0);
  const totalRealisasi = makDipaData.reduce((a, m) => a + m.realisasi, 0);
  const totalSisa = totalPagu - totalRealisasi;
  const totalSerapanPct = ((totalRealisasi / totalPagu) * 100).toFixed(1);

  return (
    <div>
      {/* Top Stat Summary Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard
          icon={<DollarSign size={IC} />}
          label="Total Tagihan Bulan Ini"
          value="Rp 92,85 M"
          sub="THT + Pensiun + JKK + JKm (Juli 2026)"
          color={COLORS.blue}
        />
        <StatCard
          icon={<BarChart3 size={IC} />}
          label="Realisasi Penerimaan Iuran"
          value="Rp 88,05 M"
          sub="94.8% dari target tagihan"
          color={COLORS.green}
        />
        <StatCard
          icon={<Landmark size={IC} />}
          label="Total Sisa Pagu DIPA"
          value={`Rp ${totalSisa.toFixed(1)} M`}
          sub={`Serapan TA 2026: ${totalSerapanPct}% (4 Kelompok MAK)`}
          color="#6A1B9A"
        />
        <StatCard
          icon={<FileText size={IC} />}
          label="Klaim Pending Pembayaran"
          value="156 Berkas"
          sub="Rp 23,1 M dalam verifikasi"
          color={COLORS.red}
        />
      </div>

      {/* Sisa Pagu DIPA per MAK Section (Full Width / Card Grid) */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: 22,
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, display: "flex", alignItems: "center", gap: 8 }}>
              <Landmark size={20} color={COLORS.blueDark} />
              <span>Pengendalian & Sisa Pagu DIPA TA 2026 per MAK</span>
            </div>
            <div style={{ fontSize: 12.5, color: COLORS.gray500, marginTop: 2 }}>
              Monitoring realisasi belanja pensiun dan ketahanan pagu anggaran berdasarkan 4 kelompok Mata Anggaran Keluaran (MAK).
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: COLORS.gray500 }}>Total Pagu DIPA: <strong>Rp {totalPagu.toFixed(1)} M</strong></div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.blueDark }}>Terserap: Rp {totalRealisasi.toFixed(1)} M ({totalSerapanPct}%)</div>
            </div>
            <Badge color="green">✅ Runway Anggaran Aman</Badge>
          </div>
        </div>

        {/* 4 MAK Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {makDipaData.map((d, i) => {
            const sisa = d.pagu - d.realisasi;
            const pct = ((d.realisasi / d.pagu) * 100).toFixed(1);

            return (
              <div
                key={i}
                style={{
                  background: COLORS.gray50,
                  borderRadius: 8,
                  padding: "16px 18px",
                  border: `1px solid ${COLORS.gray200}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "#EFF6FF",
                        color: COLORS.blueDark,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        fontSize: 12
                      }}
                    >
                      MAK {d.kode}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: Number(pct) > 85 ? COLORS.orange : COLORS.blueDark }}>
                      {pct}% Terpakai
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.gray900, marginBottom: 12, lineHeight: 1.3 }}>
                    {d.uraian}
                  </div>
                </div>

                <div>
                  <ProgressBar value={d.realisasi} max={d.pagu} color={Number(pct) > 85 ? COLORS.orange : d.warna} />

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 8, color: COLORS.gray600 }}>
                    <div>
                      <span style={{ color: COLORS.gray500 }}>Realisasi: </span>
                      <strong>Rp {d.realisasi.toFixed(1)} M</strong>
                    </div>
                    <div>
                      <span style={{ color: COLORS.gray500 }}>Sisa: </span>
                      <strong style={{ color: COLORS.green }}>Rp {sisa.toFixed(1)} M</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4, textAlign: "right" }}>
                    Pagu Awal: Rp {d.pagu.toFixed(1)} M
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Penagihan Iuran ke Kemenkeu Section */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: 20,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}
      >
        <SectionTitle>Penagihan Iuran ke Kemenkeu — Periode Juli 2026</SectionTitle>
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                {["No. Surat", "Jenis Tagihan", "Batch", "Acuan Tagihan", "Nominal", "Cut-off", "Status Dokumen"].map((c, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "11px 14px",
                      textAlign: "left",
                      fontWeight: 800,
                      color: "#64748B",
                      borderBottom: `1px solid #E2E8F0`,
                      borderRight: i < 6 ? "1px solid #E2E8F0" : "none",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  no: "001/ASABRI/TGH-THT-PEN-B1/VII/2026",
                  jenis: "THT & Pensiun",
                  batch: "Batch 1",
                  acuan: "SKP-PFK (Gaji Induk)",
                  nominal: "Rp 70.408.000.000",
                  cutoff: "15 Jul 2026",
                  status: "Dokumen di-TTD",
                  color: "green"
                },
                {
                  no: "002/ASABRI/TGH-THT-PEN-B2/VII/2026",
                  jenis: "THT & Pensiun",
                  batch: "Batch 2",
                  acuan: "SKP-PFK (Gaji Susulan)",
                  nominal: "Rp 17.602.000.000",
                  cutoff: "25 Jul 2026",
                  status: "Siap Download",
                  color: "blue"
                },
                {
                  no: "003/ASABRI/TGH-JKK/VII/2026",
                  jenis: "JKK",
                  batch: "Bulanan",
                  acuan: "Data Klaim & Gaji Pokok",
                  nominal: "Rp 2.630.000.000",
                  cutoff: "25 Jul 2026",
                  status: "Siap Download",
                  color: "blue"
                },
                {
                  no: "004/ASABRI/TGH-JKM/VII/2026",
                  jenis: "JKm",
                  batch: "Bulanan",
                  acuan: "Data Klaim & Gaji Pokok",
                  nominal: "Rp 2.210.000.000",
                  cutoff: "25 Jul 2026",
                  status: "Draft Otomatis",
                  color: "yellow"
                },
              ].map((t, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid #E2E8F0`,
                    background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                >
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>
                    {t.no}
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                    {t.jenis}
                  </td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>
                    <Badge color="purple">{t.batch}</Badge>
                  </td>
                  <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0" }}>
                    <Badge color={t.acuan.includes("SKP") ? "blue" : "orange"}>{t.acuan}</Badge>
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                    {t.nominal}
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                    {t.cutoff}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <Badge color={t.color}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: COLORS.gray500, display: "flex", justifyContent: "space-between" }}>
          <span>Tagihan THT & Pensiun terbit 2x sebulan (Batch 1 & 2) • JKK & JKm terbit 1x sebulan</span>
          <span style={{ color: COLORS.gray400 }}>Proses pengiriman dokumen fisik ke Kemenkeu dilakukan via Pos Kedinasan</span>
        </div>
      </div>
    </div>
  );
};
