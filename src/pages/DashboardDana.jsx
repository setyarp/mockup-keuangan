import { useState } from "react";
import { Building2, TrendingUp, CheckCircle2, AlertTriangle, CircleAlert, CircleDot } from "lucide-react";
import { COLORS, LINE_COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Badge, Select, SearchInput, Btn, NoData, PreviewModal } from "../components/common";

export const DashboardDana = () => {
  const [activeTab, setActiveTab] = useState("monitoring");
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
