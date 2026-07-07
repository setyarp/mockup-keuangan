import { useState } from "react";

const COLORS = {
  navy: "#0A1628",
  blue: "#1565C0",
  blueLight: "#1E88E5",
  blueDark: "#0D3B7A",
  accent: "#F9A825",
  green: "#2E7D32",
  greenLight: "#E8F5E9",
  red: "#C62828",
  redLight: "#FFEBEE",
  orange: "#EF6C00",
  orangeLight: "#FFF3E0",
  yellowLight: "#FFFDE7",
  gray50: "#FAFAFA",
  gray100: "#F5F5F5",
  gray200: "#EEEEEE",
  gray300: "#E0E0E0",
  gray400: "#BDBDBD",
  gray500: "#9E9E9E",
  gray700: "#616161",
  gray800: "#424242",
  gray900: "#212121",
  white: "#FFFFFF",
};

const Badge = ({ children, color = "blue" }) => {
  const map = {
    blue: { bg: "#E3F2FD", text: COLORS.blue },
    green: { bg: COLORS.greenLight, text: COLORS.green },
    red: { bg: COLORS.redLight, text: COLORS.red },
    orange: { bg: COLORS.orangeLight, text: COLORS.orange },
    yellow: { bg: COLORS.yellowLight, text: "#F57F17" },
    gray: { bg: COLORS.gray200, text: COLORS.gray700 },
  };
  const c = map[color] || map.blue;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
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

const Table = ({ columns, data, onRowClick }) => (
  <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: COLORS.gray100 }}>
          {columns.map((c, i) => (
            <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? "pointer" : "default", borderBottom: `1px solid ${COLORS.gray200}` }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "10px 14px", color: COLORS.gray800 }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Btn = ({ children, variant = "primary", onClick, size = "md" }) => {
  const styles = {
    primary: { background: COLORS.blue, color: COLORS.white, border: "none" },
    outline: { background: "transparent", color: COLORS.blue, border: `1px solid ${COLORS.blue}` },
    danger: { background: COLORS.red, color: COLORS.white, border: "none" },
    ghost: { background: "transparent", color: COLORS.gray700, border: `1px solid ${COLORS.gray300}` },
  };
  const s = styles[variant];
  const pd = size === "sm" ? "6px 12px" : "8px 18px";
  return (
    <button onClick={onClick} style={{ ...s, padding: pd, borderRadius: 6, fontSize: size === "sm" ? 12 : 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {children}
    </button>
  );
};

const FilterBar = ({ filters }) => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
    {filters.map((f, i) => (
      <select key={i} style={{ padding: "7px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, color: COLORS.gray700, background: COLORS.white, minWidth: 140 }}>
        <option>{f}</option>
      </select>
    ))}
    <Btn variant="ghost" size="sm">🔍 Cari</Btn>
  </div>
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

// ============ PAGES ============

const DashboardKeuangan = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <StatCard icon="💰" label="Total Tagihan Bulan Ini" value="Rp 847,2 M" sub="THT + Dapen + JKK + JKm" color={COLORS.blue} link="Lihat Rincian" />
      <StatCard icon="📊" label="Realisasi Penerimaan" value="Rp 812,5 M" sub="95.9% dari tagihan" color={COLORS.green} link="Rekonsiliasi" />
      <StatCard icon="⚠️" label="Satker Menunggak" value="12 Satker" sub="3 lebih dari 1 periode" color={COLORS.orange} link="Detail Tunggakan" />
      <StatCard icon="📄" label="Klaim Pending" value="156 Berkas" sub="Rp 23,1 M pending pembayaran" color={COLORS.red} link="Proses Klaim" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Sisa Pagu DIPA</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Dapem Induk", pagu: 4200, realisasi: 3150 },
            { label: "Dapem Susulan", pagu: 890, realisasi: 445 },
            { label: "Non-Dapem (Harian)", pagu: 320, realisasi: 288 },
          ].map((d, i) => (
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
          {[
            { label: "Tersinkron", value: "1.248", badge: "green" },
            { label: "Tertunda", value: "23", badge: "yellow" },
            { label: "Gagal Sinkron", value: "5", badge: "red" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: COLORS.gray700, fontWeight: 500 }}>{s.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray900 }}>{s.value}</span>
                <Badge color={s.badge}>transaksi</Badge>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: COLORS.gray500 }}>Terakhir update: 06 Jul 2026, 14:32 WIB</div>
      </div>
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
      <SectionTitle action={<Btn variant="outline" size="sm">Lihat Semua</Btn>}>Tagihan Terbaru</SectionTitle>
      <Table
        columns={["No. Surat", "Satker", "Jenis", "Nominal", "Status", "Jatuh Tempo"]}
        data={[
          ["TGH/2026/07/001", "Kodam Jaya", "THT + Dapen", "Rp 12.450.000.000", <Badge color="green">Lunas</Badge>, "15 Jul 2026"],
          ["TGH/2026/07/002", "Lantamal III", "THT + Dapen", "Rp 8.230.000.000", <Badge color="yellow">Menunggu</Badge>, "15 Jul 2026"],
          ["TGH/2026/07/003", "Polda Metro Jaya", "JKK + JKm", "Rp 5.670.000.000", <Badge color="blue">Terkirim</Badge>, "20 Jul 2026"],
          ["TGH/2026/06/015", "Kodam Iskandar Muda", "THT + Dapen", "Rp 3.120.000.000", <Badge color="red">Menunggak</Badge>, "15 Jun 2026"],
        ]}
      />
    </div>
  </div>
);

const KalkulatorIuran = () => {
  const [tab, setTab] = useState("rekap");
  const [selectedSatker, setSelectedSatker] = useState(null);
  const tabs = [
    { id: "rekap", label: "Rekap per Satker & Golongan" },
    { id: "peserta", label: "List per Nama Peserta" },
    { id: "tidak_lengkap", label: "Data Tidak Lengkap (23)" },
  ];
  const satkerData = [
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
  const pesertaList = [
    { nrp: "198701234", nama: "Serka Ahmad Fauzi", satker: "TNI", gol: "Gol. II", gp: 3200000, ti: 320000, ta: 192000, tht: 120640, dapen: 176320, jkk: 8880, jkm: 7424 },
    { nrp: "199205678", nama: "Briptu Rina Marlina", satker: "POLRI", gol: "Gol. II", gp: 3050000, ti: 305000, ta: 183000, tht: 114985, dapen: 168055, jkk: 8464, jkm: 7076 },
    { nrp: "197803456", nama: "Letkol Bambang Suharto", satker: "TNI", gol: "Gol. IV", gp: 5800000, ti: 580000, ta: 348000, tht: 218660, dapen: 319580, jkk: 16096, jkm: 13456 },
    { nrp: "198512345", nama: "AKP Dedi Kurniawan", satker: "POLRI", gol: "Gol. III", gp: 4500000, ti: 450000, ta: 270000, tht: 169650, dapen: 247950, jkk: 12480, jkm: 10440 },
    { nrp: "199008765", nama: "Peltu Hendra Wijaya", satker: "TNI", gol: "Gol. II", gp: 3400000, ti: 340000, ta: 204000, tht: 128180, dapen: 187340, jkk: 9432, jkm: 7888 },
    { nrp: "198604321", nama: "Penata Tk.I Siti Nurhaliza", satker: "ASN Kemenhan", gol: "Gol. III", gp: 4200000, ti: 420000, ta: 252000, tht: 158340, dapen: 231420, jkk: 11664, jkm: 9744 },
    { nrp: "199312345", nama: "Praka Rizki Pratama", satker: "TNI", gol: "Gol. I", gp: 2800000, ti: 280000, ta: 168000, tht: 105560, dapen: 154280, jkk: 7776, jkm: 6496 },
    { nrp: "198907654", nama: "Bripda Mega Putri", satker: "POLRI", gol: "Gol. I", gp: 2900000, ti: 290000, ta: 174000, tht: 109330, dapen: 159790, jkk: 8056, jkm: 6728 },
    { nrp: "197506789", nama: "Pengatur Muda Agus Salim", satker: "ASN Kemenhan", gol: "Gol. II", gp: 3100000, ti: 310000, ta: 186000, tht: 116870, dapen: 170810, jkk: 8604, jkm: 7192 },
    { nrp: "198211111", nama: "Pembina Utama Dr. Ratna", satker: "ASN Kemenhan", gol: "Gol. IV", gp: 5500000, ti: 550000, ta: 330000, tht: 207350, dapen: 303050, jkk: 15264, jkm: 12760 },
  ];
  const fmt = (n) => `Rp ${n.toLocaleString("id-ID")}`;
  return (
    <div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Parameter Kalkulasi Iuran</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Periode</label>
            <select style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}><option>Juli 2026</option></select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Satker</label>
            <select style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}><option>Semua Satker</option><option>TNI</option><option>POLRI</option><option>ASN Kemenhan</option></select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Jenis Iuran</label>
            <select style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}><option>Semua (THT + Dapen + JKK + JKm)</option><option>THT</option><option>Dapen</option><option>JKK</option><option>JKm</option></select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Cut-off</label>
            <select style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}><option>30 Jun 2026</option></select>
          </div>
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <Btn>▶ Jalankan Kalkulasi</Btn>
          <Btn variant="outline">📋 Kalkulasi Ulang (Data Terbaru)</Btn>
        </div>
      </div>

      <div style={{ background: "#E8F5E9", borderRadius: 8, padding: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
        <span>✅</span>
        <span><strong>Kalkulasi selesai.</strong> 14.328 peserta dihitung (TNI: 5.480, POLRI: 4.230, ASN Kemenhan: 4.618). 23 peserta masuk daftar "Data Tidak Lengkap".</span>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard icon="📊" label="Total Iuran THT" value="Rp 35,76 M" sub="3,25% × (GP+T.Istri+T.Anak)" color={COLORS.blue} />
        <StatCard icon="📊" label="Total Iuran Dapen" value="Rp 52,25 M" sub="4,75% × (GP+T.Istri+T.Anak)" color={COLORS.green} />
        <StatCard icon="🛡️" label="Total Iuran JKK" value="Rp 2,63 M" sub="0,24% × (GP+T.Istri+T.Anak)" color={COLORS.orange} />
        <StatCard icon="🔒" label="Total Iuran JKm" value="Rp 2,21 M" sub="0,20% × (GP+T.Istri+T.Anak)" color="#7B1FA2" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelectedSatker(null); }} style={{
            padding: "8px 18px", borderRadius: 6, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: tab === t.id ? COLORS.blue : COLORS.gray200,
            color: tab === t.id ? COLORS.white : COLORS.gray700,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rekap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm">📥 Ekspor Excel</Btn><Btn variant="outline" size="sm">📥 Ekspor PDF</Btn></div>}>Rekap Iuran per Satker & Golongan</SectionTitle>
          {satkerData.map((s, si) => (
            <div key={si} style={{ marginBottom: si < satkerData.length - 1 ? 20 : 0 }}>
              <div onClick={() => setSelectedSatker(selectedSatker === s.kode ? null : s.kode)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: COLORS.blueDark, borderRadius: selectedSatker === s.kode ? "8px 8px 0 0" : 8, color: COLORS.white }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{s.kode === "TNI" ? "🎖️" : s.kode === "POLRI" ? "🛡️" : "🏛️"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{s.nama}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{s.peserta.toLocaleString()} peserta aktif</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 13 }}>
                  <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>THT</div><div style={{ fontWeight: 700 }}>Rp {s.tht} M</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>Dapen</div><div style={{ fontWeight: 700 }}>Rp {s.dapen} M</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>JKK</div><div style={{ fontWeight: 700 }}>Rp {s.jkk} M</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ opacity: 0.7, fontSize: 10 }}>JKm</div><div style={{ fontWeight: 700 }}>Rp {s.jkm} M</div></div>
                  <span style={{ fontSize: 16 }}>{selectedSatker === s.kode ? "▼" : "▶"}</span>
                </div>
              </div>
              {selectedSatker === s.kode && (
                <div style={{ border: `1px solid ${COLORS.gray200}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                  <Table
                    columns={["Golongan", "Jml Peserta", "Total GP+Tunj", "Iuran THT (3,25%)", "Iuran Dapen (4,75%)", "Iuran JKK (0,24%)", "Iuran JKm (0,20%)", "Total"]}
                    data={s.gol.map(g => [
                      <span style={{ fontWeight: 600 }}>{g.gol}</span>,
                      g.peserta.toLocaleString(),
                      `Rp ${g.gp} M`,
                      `Rp ${g.tht} M`,
                      `Rp ${g.dapen} M`,
                      `Rp ${g.jkk} M`,
                      `Rp ${g.jkm} M`,
                      <span style={{ fontWeight: 700 }}>Rp {(g.tht + g.dapen + g.jkk + g.jkm).toFixed(2)} M</span>,
                    ])}
                  />
                  <div style={{ padding: "10px 14px", background: COLORS.gray50, display: "flex", justifyContent: "flex-end", gap: 20, fontSize: 13, fontWeight: 700 }}>
                    <span>Subtotal {s.nama}:</span>
                    <span style={{ color: COLORS.blue }}>Rp {(s.tht + s.dapen + s.jkk + s.jkm).toFixed(2)} M</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px 16px", background: "#E3F2FD", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.blueDark }}>Grand Total Seluruh Satker</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: COLORS.blueDark }}>Rp {(satkerData.reduce((a,s)=>a+s.tht+s.dapen+s.jkk+s.jkm,0)).toFixed(2)} M</span>
          </div>
        </div>
      )}

      {tab === "peserta" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle action={<div style={{ display: "flex", gap: 8 }}><Btn variant="outline" size="sm">📥 Ekspor Excel</Btn><Btn variant="outline" size="sm">📥 Ekspor PDF</Btn></div>}>Daftar Iuran per Nama Peserta</SectionTitle>
          <FilterBar filters={["Satker: Semua", "Golongan: Semua", "Cari NRP/Nama..."]} />
          <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Menampilkan 10 dari 14.328 peserta — halaman 1 dari 1.433</div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: COLORS.gray100 }}>
                  {["No", "NRP/NIP", "Nama Peserta", "Satker", "Gol.", "Gaji Pokok", "T. Istri", "T. Anak", "Dasar (GP+TI+TA)", "THT (3,25%)", "Dapen (4,75%)", "JKK (0,24%)", "JKm (0,20%)", "Total Iuran"].map((c, i) => (
                    <th key={i} style={{ padding: "8px 10px", textAlign: i >= 5 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pesertaList.map((p, i) => {
                  const dasar = p.gp + p.ti + p.ta;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}` }}
                      onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "8px 10px", color: COLORS.gray500 }}>{i + 1}</td>
                      <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11 }}>{p.nrp}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: COLORS.gray800 }}>{p.nama}</td>
                      <td style={{ padding: "8px 10px" }}><Badge color={p.satker === "TNI" ? "green" : p.satker === "POLRI" ? "blue" : "orange"}>{p.satker}</Badge></td>
                      <td style={{ padding: "8px 10px", fontSize: 11 }}>{p.gol}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.gp)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.ti)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.ta)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(dasar)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.tht)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.dapen)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.jkk)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.jkm)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark }}>{fmt(p.tht + p.dapen + p.jkk + p.jkm)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontSize: 12, color: COLORS.gray500 }}>Total 14.328 peserta</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["«", "1", "2", "3", "...", "1433", "»"].map((p, i) => (
                <button key={i} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, background: p === "1" ? COLORS.blue : COLORS.white, color: p === "1" ? COLORS.white : COLORS.gray700, fontSize: 12, cursor: "pointer" }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "tidak_lengkap" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <div style={{ background: COLORS.orangeLight, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, display: "flex", gap: 8 }}>
            <span>⚠️</span>
            <span>Peserta berikut dikecualikan dari total tagihan karena data gaji tidak lengkap. Lengkapi data untuk memasukkan ke kalkulasi.</span>
          </div>
          <Table
            columns={["NRP/NIP", "Nama", "Satker", "Golongan", "Komponen Kosong", "Status", "Aksi"]}
            data={[
              ["198701234", "Serka Ahmad Fauzi", <Badge color="green">TNI</Badge>, "Gol. II", <Badge color="red">Tunj. Anak</Badge>, <Badge color="orange">Belum Lengkap</Badge>, <Btn size="sm" variant="outline">Lengkapi</Btn>],
              ["198805678", "Briptu Budi Santoso", <Badge color="blue">POLRI</Badge>, "Gol. I", <Badge color="red">Gaji Pokok</Badge>, <Badge color="orange">Belum Lengkap</Badge>, <Btn size="sm" variant="outline">Lengkapi</Btn>],
              ["199012345", "Penata Citra Dewi", <Badge color="orange">ASN Kemenhan</Badge>, "Gol. III", <Badge color="red">Tunj. Istri</Badge>, <Badge color="orange">Belum Lengkap</Badge>, <Btn size="sm" variant="outline">Lengkapi</Btn>],
            ]}
          />
        </div>
      )}
    </div>
  );
};

const RekonsIuran = () => (
  <div>
    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle>Rekonsiliasi Iuran vs SKP-PFK Kemenkeu</SectionTitle>
      <FilterBar filters={["Periode: Juli 2026", "Jenis: THT", "Satker: Semua"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#E3F2FD", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total Hitung Sistem</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.blue }}>Rp 425.832.450.000</div>
        </div>
        <div style={{ background: "#E8F5E9", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Total SKP-PFK Kemenkeu</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.green }}>Rp 425.890.120.000</div>
        </div>
        <div style={{ background: COLORS.redLight, borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: COLORS.gray700, marginBottom: 4 }}>Selisih</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.red }}>Rp 57.670.000</div>
          <div style={{ fontSize: 11, color: COLORS.red }}>SKP-PFK &gt; Hitung Sistem</div>
        </div>
      </div>
      <Table
        columns={["Satker", "Hitung Sistem", "SKP-PFK", "Selisih", "Status", "Drill-down"]}
        data={[
          ["Kodam Jaya", "Rp 6.084.500.000", "Rp 6.084.500.000", "Rp 0", <Badge color="green">Match</Badge>, "—"],
          [<span style={{ color: COLORS.red, fontWeight: 600 }}>Kodam Iskandar Muda</span>, "Rp 4.912.300.000", "Rp 4.969.970.000", <span style={{ color: COLORS.red, fontWeight: 700 }}>Rp 57.670.000</span>, <Badge color="red">Selisih</Badge>, <Btn size="sm" variant="outline">🔍 Detail</Btn>],
          ["Lantamal III", "Rp 2.914.200.000", "Rp 2.914.200.000", "Rp 0", <Badge color="green">Match</Badge>, "—"],
          ["Polda Metro Jaya", "Rp 8.970.400.000", "Rp 8.970.400.000", "Rp 0", <Badge color="green">Match</Badge>, "—"],
        ]}
      />
      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <Btn variant="outline" size="sm">📥 Unduh Tabel 1 BRS II (Excel)</Btn>
        <Btn variant="outline" size="sm">📥 Unduh PDF</Btn>
      </div>
    </div>
  </div>
);

const GeneratorTagihan = () => {
  const [filterJenis, setFilterJenis] = useState("THT");
  const jenisOptions = ["THT", "Dapen", "JKK", "JKm"];
  const tagihanData = {
    THT: {
      total: "Rp 35,76 M", rate: "3,25%",
      satkers: [
        { nama: "TNI", icon: "🎖️", total: "Rp 14,25 M", status: "Lunas", noSurat: "001/TGH-THT/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "15 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1820, tagihan: "Rp 3.550.000.000", status: "Lunas" },
            { gol: "Golongan II (Bintara)", peserta: 2140, tagihan: "Rp 5.560.000.000", status: "Lunas" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 1050, tagihan: "Rp 3.410.000.000", status: "Lunas" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 470, tagihan: "Rp 1.720.000.000", status: "Lunas" },
          ]},
        { nama: "POLRI", icon: "🛡️", total: "Rp 11,00 M", status: "Menunggu Pembayaran", noSurat: "002/TGH-THT/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "15 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1350, tagihan: "Rp 2.630.000.000", status: "Menunggu" },
            { gol: "Golongan II (Bintara)", peserta: 1680, tagihan: "Rp 4.370.000.000", status: "Menunggu" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 820, tagihan: "Rp 2.670.000.000", status: "Menunggu" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 380, tagihan: "Rp 1.330.000.000", status: "Menunggu" },
          ]},
        { nama: "ASN Kemenhan", icon: "🏛️", total: "Rp 10,51 M", status: "Terkirim", noSurat: "003/TGH-THT/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I", peserta: 920, tagihan: "Rp 1.500.000.000", status: "Terkirim" },
            { gol: "Golongan II", peserta: 1580, tagihan: "Rp 3.590.000.000", status: "Terkirim" },
            { gol: "Golongan III", peserta: 1450, tagihan: "Rp 3.770.000.000", status: "Terkirim" },
            { gol: "Golongan IV", peserta: 668, tagihan: "Rp 1.650.000.000", status: "Terkirim" },
          ]},
      ]},
    Dapen: {
      total: "Rp 52,25 M", rate: "4,75%",
      satkers: [
        { nama: "TNI", icon: "🎖️", total: "Rp 20,82 M", status: "Lunas", noSurat: "004/TGH-DAP/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "15 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1820, tagihan: "Rp 5.190.000.000", status: "Lunas" },
            { gol: "Golongan II (Bintara)", peserta: 2140, tagihan: "Rp 8.130.000.000", status: "Lunas" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 1050, tagihan: "Rp 4.990.000.000", status: "Lunas" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 470, tagihan: "Rp 2.520.000.000", status: "Lunas" },
          ]},
        { nama: "POLRI", icon: "🛡️", total: "Rp 16,07 M", status: "Lunas", noSurat: "005/TGH-DAP/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "15 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1350, tagihan: "Rp 3.850.000.000", status: "Lunas" },
            { gol: "Golongan II (Bintara)", peserta: 1680, tagihan: "Rp 6.380.000.000", status: "Lunas" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 820, tagihan: "Rp 3.900.000.000", status: "Lunas" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 380, tagihan: "Rp 1.950.000.000", status: "Lunas" },
          ]},
        { nama: "ASN Kemenhan", icon: "🏛️", total: "Rp 15,36 M", status: "Menunggu Pembayaran", noSurat: "006/TGH-DAP/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I", peserta: 920, tagihan: "Rp 2.190.000.000", status: "Menunggu" },
            { gol: "Golongan II", peserta: 1580, tagihan: "Rp 5.250.000.000", status: "Menunggu" },
            { gol: "Golongan III", peserta: 1450, tagihan: "Rp 5.510.000.000", status: "Menunggu" },
            { gol: "Golongan IV", peserta: 668, tagihan: "Rp 2.410.000.000", status: "Menunggu" },
          ]},
      ]},
    JKK: {
      total: "Rp 2,63 M", rate: "0,24%",
      satkers: [
        { nama: "TNI", icon: "🎖️", total: "Rp 1,05 M", status: "Terkirim", noSurat: "007/TGH-JKK/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1820, tagihan: "Rp 262.000.000", status: "Terkirim" },
            { gol: "Golongan II (Bintara)", peserta: 2140, tagihan: "Rp 411.000.000", status: "Terkirim" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 1050, tagihan: "Rp 252.000.000", status: "Terkirim" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 470, tagihan: "Rp 127.000.000", status: "Terkirim" },
          ]},
        { nama: "POLRI", icon: "🛡️", total: "Rp 0,81 M", status: "Draft", noSurat: "—", tglTerbit: "—", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1350, tagihan: "Rp 194.000.000", status: "Draft" },
            { gol: "Golongan II (Bintara)", peserta: 1680, tagihan: "Rp 322.000.000", status: "Draft" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 820, tagihan: "Rp 197.000.000", status: "Draft" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 380, tagihan: "Rp 98.000.000", status: "Draft" },
          ]},
        { nama: "ASN Kemenhan", icon: "🏛️", total: "Rp 0,77 M", status: "Terkirim", noSurat: "008/TGH-JKK/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I", peserta: 920, tagihan: "Rp 110.000.000", status: "Terkirim" },
            { gol: "Golongan II", peserta: 1580, tagihan: "Rp 265.000.000", status: "Terkirim" },
            { gol: "Golongan III", peserta: 1450, tagihan: "Rp 278.000.000", status: "Terkirim" },
            { gol: "Golongan IV", peserta: 668, tagihan: "Rp 121.000.000", status: "Terkirim" },
          ]},
      ]},
    JKm: {
      total: "Rp 2,21 M", rate: "0,20%",
      satkers: [
        { nama: "TNI", icon: "🎖️", total: "Rp 0,88 M", status: "Lunas", noSurat: "009/TGH-JKM/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1820, tagihan: "Rp 218.000.000", status: "Lunas" },
            { gol: "Golongan II (Bintara)", peserta: 2140, tagihan: "Rp 342.000.000", status: "Lunas" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 1050, tagihan: "Rp 210.000.000", status: "Lunas" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 470, tagihan: "Rp 106.000.000", status: "Lunas" },
          ]},
        { nama: "POLRI", icon: "🛡️", total: "Rp 0,68 M", status: "Menunggu Pembayaran", noSurat: "010/TGH-JKM/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I (Tamtama)", peserta: 1350, tagihan: "Rp 162.000.000", status: "Menunggu" },
            { gol: "Golongan II (Bintara)", peserta: 1680, tagihan: "Rp 268.000.000", status: "Menunggu" },
            { gol: "Golongan III (Perwira Pertama)", peserta: 820, tagihan: "Rp 164.000.000", status: "Menunggu" },
            { gol: "Golongan IV (Perwira Menengah/Tinggi)", peserta: 380, tagihan: "Rp 82.000.000", status: "Menunggu" },
          ]},
        { nama: "ASN Kemenhan", icon: "🏛️", total: "Rp 0,65 M", status: "Terkirim", noSurat: "011/TGH-JKM/VII/2026", tglTerbit: "01 Jul 2026", jatuhTempo: "20 Jul 2026",
          gol: [
            { gol: "Golongan I", peserta: 920, tagihan: "Rp 92.000.000", status: "Terkirim" },
            { gol: "Golongan II", peserta: 1580, tagihan: "Rp 221.000.000", status: "Terkirim" },
            { gol: "Golongan III", peserta: 1450, tagihan: "Rp 232.000.000", status: "Terkirim" },
            { gol: "Golongan IV", peserta: 668, tagihan: "Rp 101.000.000", status: "Terkirim" },
          ]},
      ]},
  };
  const current = tagihanData[filterJenis];
  const statusColor = (s) => s === "Lunas" ? "green" : s === "Menunggu Pembayaran" || s === "Menunggu" ? "yellow" : s === "Terkirim" ? "blue" : "gray";
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="📅" label="Tanggal Generate Berikutnya" value="15 Jul 2026" sub="Otomatis terjadwal" color={COLORS.blue} />
        <StatCard icon="✅" label="Tagihan Lunas" value="5 Surat" sub="Dari 12 total tagihan" color={COLORS.green} />
        <StatCard icon="⏳" label="Menunggu Pembayaran" value="4 Surat" color={COLORS.orange} />
        <StatCard icon="📄" label="Draft" value="1 Surat" sub="POLRI JKK — data belum lengkap" color={COLORS.red} />
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle action={<Btn size="sm">⚡ Generate Manual</Btn>}>Tagihan per Jenis Iuran — Juli 2026</SectionTitle>

        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
          {jenisOptions.map(j => (
            <button key={j} onClick={() => setFilterJenis(j)} style={{
              padding: "10px 24px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700,
              background: "transparent",
              color: filterJenis === j ? COLORS.blue : COLORS.gray500,
              borderBottom: filterJenis === j ? `3px solid ${COLORS.blue}` : "3px solid transparent",
              marginBottom: -2,
            }}>
              {j}
            </button>
          ))}
        </div>

        <div style={{ padding: "12px 16px", background: "#E3F2FD", borderRadius: 8, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 13, color: COLORS.gray700 }}>Iuran <strong>{filterJenis}</strong> — Tarif: <strong>{current.rate} × (GP + T.Istri + T.Anak)</strong></span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.blueDark }}>Total: {current.total}</div>
        </div>

        {current.satkers.map((s, si) => (
          <div key={si} style={{ marginBottom: 16, border: `1px solid ${COLORS.gray200}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: COLORS.gray50, borderBottom: `1px solid ${COLORS.gray200}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.gray900 }}>{s.nama}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray500 }}>No. Surat: {s.noSurat} • Terbit: {s.tglTerbit} • JT: {s.jatuhTempo}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.blueDark }}>{s.total}</div>
                </div>
                <Badge color={statusColor(s.status)}>{s.status}</Badge>
                <Btn size="sm" variant="ghost">👁</Btn>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.white }}>
                  <th style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: COLORS.gray500, fontSize: 12, borderBottom: `1px solid ${COLORS.gray200}` }}>Golongan</th>
                  <th style={{ padding: "8px 14px", textAlign: "right", fontWeight: 600, color: COLORS.gray500, fontSize: 12, borderBottom: `1px solid ${COLORS.gray200}` }}>Jml Peserta</th>
                  <th style={{ padding: "8px 14px", textAlign: "right", fontWeight: 600, color: COLORS.gray500, fontSize: 12, borderBottom: `1px solid ${COLORS.gray200}` }}>Nominal Tagihan</th>
                  <th style={{ padding: "8px 14px", textAlign: "center", fontWeight: 600, color: COLORS.gray500, fontSize: 12, borderBottom: `1px solid ${COLORS.gray200}` }}>Status Bayar</th>
                </tr>
              </thead>
              <tbody>
                {s.gol.map((g, gi) => (
                  <tr key={gi} style={{ borderBottom: gi < s.gol.length - 1 ? `1px solid ${COLORS.gray100}` : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "8px 14px", fontWeight: 500, color: COLORS.gray800 }}>{g.gol}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace" }}>{g.peserta.toLocaleString()}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{g.tagihan}</td>
                    <td style={{ padding: "8px 14px", textAlign: "center" }}><Badge color={statusColor(g.status)}>{g.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
          <Btn variant="outline" size="sm">📥 Ekspor Tagihan {filterJenis} (Excel)</Btn>
          <Btn variant="outline" size="sm">📥 Cetak Surat Tagihan (PDF)</Btn>
        </div>
      </div>

      <div style={{ background: COLORS.redLight, borderRadius: 10, padding: 16, border: `1px solid #FFCDD2` }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.red, marginBottom: 8 }}>⚠️ Log Kegagalan Generate</div>
        <div style={{ fontSize: 13, color: COLORS.gray700 }}>
          <strong>30 Jun 2026 23:00</strong> — Generate JKK gagal untuk POLRI: data kepesertaan periode Juli belum lengkap (23 peserta tanpa data gaji). Status tagihan: Draft. Notifikasi telah dikirim ke PIC Kepesertaan.
        </div>
      </div>
    </div>
  );
};

const DashboardDana = () => {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [uploadState, setUploadState] = useState("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState("Semua");
  const [selectedDate, setSelectedDate] = useState("2026-07-06");

  const uploadedFiles = [
    { name: "RK_Mandiri_20260706.csv", mitra: "Bank Mandiri", tanggal: "06 Jul 2026", status: "parsed", rows: 342, totalNominal: "Rp 18.450.000.000", uploadedBy: "Staf Keuangan A", uploadedAt: "06 Jul 2026, 09:15" },
    { name: "RK_BRI_20260706.xlsx", mitra: "BRI", tanggal: "06 Jul 2026", status: "parsed", rows: 285, totalNominal: "Rp 14.230.000.000", uploadedBy: "Staf Keuangan A", uploadedAt: "06 Jul 2026, 09:22" },
    { name: "RK_BNI_20260706.csv", mitra: "BNI", tanggal: "06 Jul 2026", status: "parsed", rows: 198, totalNominal: "Rp 9.870.000.000", uploadedBy: "Staf Keuangan B", uploadedAt: "06 Jul 2026, 10:05" },
    { name: "RK_BTN_20260706.xlsx", mitra: "BTN", tanggal: "06 Jul 2026", status: "error", rows: 0, totalNominal: "—", uploadedBy: "Staf Keuangan B", uploadedAt: "06 Jul 2026, 10:12", errorMsg: "Format kolom tidak sesuai template. Kolom 'No_Referensi' tidak ditemukan." },
  ];

  const rekapHarian = [
    { no: 1, noRef: "MND-20260706-00142", nrp: "198701234", nama: "Purn. Kol. Ahmad Rifai", jenis: "Pensiun Bulanan", mitra: "Bank Mandiri", nominal: "Rp 8.500.000", status: "Berhasil", waktu: "06:15" },
    { no: 2, noRef: "MND-20260706-00143", nrp: "199205678", nama: "Purn. Letda Budi Kartono", jenis: "Pensiun Bulanan", mitra: "Bank Mandiri", nominal: "Rp 6.200.000", status: "Berhasil", waktu: "06:15" },
    { no: 3, noRef: "MND-20260706-00187", nrp: "198604321", nama: "Purn. AKP Siti Nurhaliza", jenis: "Klaim JKK", mitra: "Bank Mandiri", nominal: "Rp 45.000.000", status: "Berhasil", waktu: "08:30" },
    { no: 4, noRef: "BRI-20260706-01205", nrp: "197803456", nama: "Purn. Serma Hendra W.", jenis: "Pensiun Bulanan", mitra: "BRI", nominal: "Rp 7.800.000", status: "Berhasil", waktu: "06:00" },
    { no: 5, noRef: "BRI-20260706-01289", nrp: "199312345", nama: "Janda Alm. Koptu Andi S.", jenis: "Pensiun Janda/Duda", mitra: "BRI", nominal: "Rp 4.200.000", status: "Berhasil", waktu: "06:00" },
    { no: 6, noRef: "BRI-20260706-01334", nrp: "198512890", nama: "Purn. Bripka Dedi Kurniawan", jenis: "Klaim JKm", mitra: "BRI", nominal: "Rp 32.000.000", status: "Berhasil", waktu: "10:00" },
    { no: 7, noRef: "BNI-20260706-00891", nrp: "199008765", nama: "Purn. Peltu Rizki Pratama", jenis: "Pensiun Bulanan", mitra: "BNI", nominal: "Rp 5.900.000", status: "Berhasil", waktu: "06:30" },
    { no: 8, noRef: "BNI-20260706-00923", nrp: "198907654", nama: "Purn. Kapten Mega Putri", jenis: "THT", mitra: "BNI", nominal: "Rp 120.000.000", status: "Berhasil", waktu: "09:45" },
    { no: 9, noRef: "MND-20260706-00245", nrp: "197506789", nama: "Purn. Pengatur Agus Salim", jenis: "Pensiun Bulanan", mitra: "Bank Mandiri", nominal: "Rp 5.400.000", status: "Gagal", waktu: "06:15", keterangan: "Rekening dormant" },
    { no: 10, noRef: "BNI-20260706-00956", nrp: "198211111", nama: "Purn. Pembina Dr. Ratna", jenis: "Klaim JKK", mitra: "BNI", nominal: "Rp 68.500.000", status: "Berhasil", waktu: "11:20" },
  ];

  const filteredRekap = selectedMitra === "Semua" ? rekapHarian : rekapHarian.filter(r => r.mitra === selectedMitra);
  const totalBerhasil = rekapHarian.filter(r => r.status === "Berhasil").length;
  const totalGagal = rekapHarian.filter(r => r.status === "Gagal").length;

  const handleUploadClick = () => {
    setUploadState("uploading");
    setTimeout(() => setUploadState("success"), 1500);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="🏦" label="Total Saldo Mitra Bayar" value="Rp 2,34 T" sub="8 Mitra Bayar aktif" color={COLORS.blue} />
        <StatCard icon="📈" label="Kebutuhan Minggu Depan" value="Rp 412 M" sub="Proyeksi klaim disetujui" color={COLORS.orange} />
        <StatCard icon="✅" label="Pembayaran Hari Ini" value="825 Transaksi" sub="Rp 42,55 M tersalurkan" color={COLORS.green} />
        <StatCard icon="🔴" label="Gagal Bayar" value="3 Transaksi" sub="Perlu tindak lanjut" color={COLORS.red} />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "monitoring", label: "📊 Monitoring Saldo", count: null },
          { id: "rekap", label: "📋 Rekap Harian Rekening Koran", count: "825" },
          { id: "upload", label: "📤 Upload Rekening Koran", count: null },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "12px 24px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
            background: "transparent", display: "flex", alignItems: "center", gap: 8,
            color: activeTab === t.id ? COLORS.blue : COLORS.gray500,
            borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            marginBottom: -2,
          }}>
            {t.label}
            {t.count && <span style={{ background: activeTab === t.id ? "#E3F2FD" : COLORS.gray200, color: activeTab === t.id ? COLORS.blue : COLORS.gray700, padding: "1px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* TAB: Monitoring Saldo */}
      {activeTab === "monitoring" && (
        <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
          <SectionTitle>Saldo & Proyeksi per Mitra Bayar</SectionTitle>
          <Table
            columns={["Mitra Bayar", "Saldo Terkini", "Kebutuhan 7 Hari", "Kebutuhan 30 Hari", "Coverage", "Status", "Update"]}
            data={[
              ["Bank Mandiri", "Rp 820.000.000.000", "Rp 120.000.000.000", "Rp 480.000.000.000", "170%", <Badge color="green">Aman</Badge>, "14:30 WIB"],
              ["BRI", "Rp 650.000.000.000", "Rp 95.000.000.000", "Rp 380.000.000.000", "171%", <Badge color="green">Aman</Badge>, "14:28 WIB"],
              ["BNI", "Rp 420.000.000.000", "Rp 80.000.000.000", "Rp 320.000.000.000", "131%", <Badge color="green">Aman</Badge>, "14:31 WIB"],
              ["BTN", "Rp 180.000.000.000", "Rp 55.000.000.000", "Rp 220.000.000.000", "82%", <Badge color="yellow">Perhatian</Badge>, "14:29 WIB"],
              [<span style={{ fontWeight: 700, color: COLORS.red }}>PT Pos Indonesia</span>, "Rp 45.000.000.000", "Rp 62.000.000.000", "Rp 248.000.000.000", <span style={{ color: COLORS.red, fontWeight: 700 }}>18%</span>, <Badge color="red">Kritis</Badge>, "14:25 WIB"],
            ]}
          />
        </div>
      )}

      {/* TAB: Upload Rekening Koran */}
      {activeTab === "upload" && (
        <div>
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 24, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle>Upload File Rekening Koran Mitra Bayar</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Mitra Bayar</label>
                <select style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}>
                  <option>Pilih Mitra Bayar...</option>
                  <option>Bank Mandiri</option><option>BRI</option><option>BNI</option><option>BTN</option><option>PT Pos Indonesia</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Rekening Koran</label>
                <input type="date" defaultValue="2026-07-06" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Format File</label>
                <select style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}>
                  <option>CSV (.csv)</option><option>Excel (.xlsx)</option><option>Excel 97-2003 (.xls)</option>
                </select>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleUploadClick(); }}
              style={{
                border: `2px dashed ${dragOver ? COLORS.blue : COLORS.gray300}`,
                borderRadius: 12,
                padding: "48px 24px",
                textAlign: "center",
                background: dragOver ? "#E3F2FD" : COLORS.gray50,
                transition: "all 0.2s",
                cursor: "pointer",
                marginBottom: 16,
              }}
              onClick={handleUploadClick}
            >
              {uploadState === "idle" && (
                <>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }}>📂</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
                    Drag & drop file rekening koran di sini
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.gray500, marginBottom: 16 }}>
                    atau klik untuk memilih file dari komputer Anda
                  </div>
                  <div style={{ display: "inline-flex", padding: "8px 20px", background: COLORS.blue, color: COLORS.white, borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    📎 Pilih File
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 12 }}>
                    Format: .csv, .xlsx, .xls — Maks. 50 MB — Kolom wajib: Tanggal, No_Referensi, NRP/NIP, Nama, Nominal, Jenis_Pembayaran
                  </div>
                </>
              )}
              {uploadState === "uploading" && (
                <>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.blue, marginBottom: 6 }}>
                    Mengupload & memproses file...
                  </div>
                  <div style={{ width: 300, margin: "12px auto", height: 6, background: COLORS.gray200, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "65%", background: COLORS.blue, borderRadius: 3, animation: "none" }} />
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray500 }}>Membaca format CMS, mapping kolom ke standar ASABRI...</div>
                </>
              )}
              {uploadState === "success" && (
                <>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green, marginBottom: 6 }}>
                    File berhasil diupload & diparsing!
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.gray700, marginBottom: 12 }}>
                    342 transaksi pembayaran terdeteksi — total Rp 18.450.000.000
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <Btn size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setActiveTab("rekap"); }}>📋 Lihat Hasil Parsing</Btn>
                    <Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setUploadState("idle"); }}>📤 Upload File Lain</Btn>
                  </div>
                </>
              )}
            </div>

            {/* Validation Info */}
            <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: 12, fontSize: 13, display: "flex", gap: 8, marginBottom: 4 }}>
              <span>💡</span>
              <span>Sistem akan otomatis mendeteksi format CMS dari masing-masing bank dan mapping ke format standar ASABRI (tanggal, nominal, keterangan, no. referensi). Jika format tidak dikenali, file akan ditolak dengan pesan error.</span>
            </div>
          </div>

          {/* Riwayat Upload Hari Ini */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle>Riwayat Upload Rekening Koran — 06 Juli 2026</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {uploadedFiles.map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 8,
                  border: `1px solid ${f.status === "error" ? "#FFCDD2" : COLORS.gray200}`,
                  background: f.status === "error" ? COLORS.redLight : COLORS.white,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 8,
                      background: f.status === "error" ? "#FFCDD2" : COLORS.greenLight,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>
                      {f.status === "error" ? "❌" : "📄"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.gray900, fontFamily: "monospace" }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.gray500 }}>
                        {f.mitra} • Upload oleh {f.uploadedBy} • {f.uploadedAt}
                      </div>
                      {f.status === "error" && (
                        <div style={{ fontSize: 12, color: COLORS.red, marginTop: 2 }}>⚠️ {f.errorMsg}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {f.status === "parsed" && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>{f.rows} transaksi</div>
                        <div style={{ fontSize: 12, color: COLORS.gray500 }}>{f.totalNominal}</div>
                      </div>
                    )}
                    <Badge color={f.status === "parsed" ? "green" : "red"}>
                      {f.status === "parsed" ? "Berhasil" : "Gagal"}
                    </Badge>
                    {f.status === "error" && <Btn size="sm" variant="outline">🔄 Upload Ulang</Btn>}
                    {f.status === "parsed" && <Btn size="sm" variant="ghost">👁 Detail</Btn>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Rekap Harian */}
      {activeTab === "rekap" && (
        <div>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Bank Mandiri", count: "342 trx", nominal: "Rp 18,45 M", color: COLORS.blue },
              { label: "BRI", count: "285 trx", nominal: "Rp 14,23 M", color: COLORS.green },
              { label: "BNI", count: "198 trx", nominal: "Rp 9,87 M", color: COLORS.orange },
              { label: "BTN", count: "—", nominal: "Upload gagal", color: COLORS.red },
            ].map((m, i) => (
              <div key={i} onClick={() => setSelectedMitra(m.label === "BTN" ? "Semua" : m.label === selectedMitra ? "Semua" : m.label)} style={{
                padding: "14px 16px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                border: `2px solid ${selectedMitra === m.label ? m.color : COLORS.gray200}`,
                background: selectedMitra === m.label ? m.color + "10" : COLORS.white,
              }}>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.count}</div>
                <div style={{ fontSize: 12, color: COLORS.gray500 }}>{m.nominal}</div>
              </div>
            ))}
          </div>

          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
            <SectionTitle action={
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="outline" size="sm">📥 Ekspor Excel</Btn>
                <Btn variant="outline" size="sm">📥 Ekspor PDF</Btn>
              </div>
            }>
              Rekap Pembayaran Mitra ke Peserta — {selectedMitra === "Semua" ? "Semua Mitra" : selectedMitra}
            </SectionTitle>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 2 }}>Tanggal</label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 2 }}>Mitra Bayar</label>
                <select value={selectedMitra} onChange={e => setSelectedMitra(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, minWidth: 140 }}>
                  <option>Semua</option><option>Bank Mandiri</option><option>BRI</option><option>BNI</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 2 }}>Jenis Pembayaran</label>
                <select style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, minWidth: 160 }}>
                  <option>Semua Jenis</option><option>Pensiun Bulanan</option><option>Pensiun Janda/Duda</option><option>Klaim JKK</option><option>Klaim JKm</option><option>THT</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 2 }}>Status</label>
                <select style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, minWidth: 120 }}>
                  <option>Semua</option><option>Berhasil</option><option>Gagal</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 2 }}>Cari</label>
                <input placeholder="NRP / Nama peserta..." style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, minWidth: 180 }} />
              </div>
            </div>

            <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>
              Menampilkan {filteredRekap.length} dari 825 transaksi — <span style={{ color: COLORS.green, fontWeight: 600 }}>{totalBerhasil} berhasil</span> • <span style={{ color: COLORS.red, fontWeight: 600 }}>{totalGagal} gagal</span>
            </div>

            <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: COLORS.gray100 }}>
                    {["No", "No. Referensi", "NRP/NIP", "Nama Peserta", "Jenis Pembayaran", "Mitra Bayar", "Nominal", "Waktu", "Status", "Ket."].map((c, i) => (
                      <th key={i} style={{ padding: "8px 10px", textAlign: i === 6 ? "right" : "left", fontWeight: 600, color: COLORS.gray700, borderBottom: `1px solid ${COLORS.gray300}`, whiteSpace: "nowrap" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRekap.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray200}`, background: r.status === "Gagal" ? COLORS.redLight : "transparent" }}
                      onMouseEnter={e => { if (r.status !== "Gagal") e.currentTarget.style.background = COLORS.gray50; }}
                      onMouseLeave={e => { if (r.status !== "Gagal") e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "8px 10px", color: COLORS.gray500 }}>{r.no}</td>
                      <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11, color: COLORS.blue, fontWeight: 500 }}>{r.noRef}</td>
                      <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 11 }}>{r.nrp}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: COLORS.gray800 }}>{r.nama}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <Badge color={r.jenis === "Pensiun Bulanan" ? "blue" : r.jenis === "Pensiun Janda/Duda" ? "gray" : r.jenis.includes("JKK") ? "orange" : r.jenis.includes("JKm") ? "red" : "green"}>
                          {r.jenis}
                        </Badge>
                      </td>
                      <td style={{ padding: "8px 10px", fontSize: 12 }}>{r.mitra}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{r.nominal}</td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: COLORS.gray500 }}>{r.waktu}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <Badge color={r.status === "Berhasil" ? "green" : "red"}>{r.status}</Badge>
                      </td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: COLORS.red }}>{r.keterangan || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.gray500 }}>Total 825 transaksi — Halaman 1 dari 83</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["«", "1", "2", "3", "...", "83", "»"].map((p, i) => (
                  <button key={i} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, background: p === "1" ? COLORS.blue : COLORS.white, color: p === "1" ? COLORS.white : COLORS.gray700, fontSize: 12, cursor: "pointer" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Ringkasan per Jenis Pembayaran */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <SectionTitle>Ringkasan per Jenis Pembayaran — 06 Juli 2026</SectionTitle>
            <Table
              columns={["Jenis Pembayaran", "Jumlah Transaksi", "Total Nominal", "Berhasil", "Gagal", "% Berhasil"]}
              data={[
                [<span style={{ fontWeight: 600 }}>Pensiun Bulanan</span>, "680", "Rp 34.200.000.000", <span style={{ color: COLORS.green }}>678</span>, <span style={{ color: COLORS.red }}>2</span>, "99,7%"],
                [<span style={{ fontWeight: 600 }}>Pensiun Janda/Duda</span>, "85", "Rp 2.850.000.000", <span style={{ color: COLORS.green }}>85</span>, <span style={{ color: COLORS.red }}>0</span>, "100%"],
                [<span style={{ fontWeight: 600 }}>Klaim JKK</span>, "32", "Rp 3.120.000.000", <span style={{ color: COLORS.green }}>31</span>, <span style={{ color: COLORS.red }}>1</span>, "96,9%"],
                [<span style={{ fontWeight: 600 }}>Klaim JKm</span>, "18", "Rp 1.580.000.000", <span style={{ color: COLORS.green }}>18</span>, <span style={{ color: COLORS.red }}>0</span>, "100%"],
                [<span style={{ fontWeight: 600 }}>THT</span>, "10", "Rp 800.000.000", <span style={{ color: COLORS.green }}>10</span>, <span style={{ color: COLORS.red }}>0</span>, "100%"],
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MonitoringKlaim = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <StatCard icon="📋" label="Total Klaim Bulan Ini" value="234" color={COLORS.blue} />
      <StatCard icon="🔍" label="Dalam Verifikasi" value="45" color={COLORS.orange} />
      <StatCard icon="✅" label="Disetujui" value="156" color={COLORS.green} />
      <StatCard icon="❌" label="Ditolak" value="8" color={COLORS.red} />
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle>Tracking Klaim JKK Perawatan</SectionTitle>
      <FilterBar filters={["Periode: Juli 2026", "Mitra Bayar: Semua", "Status: Semua"]} />
      <Table
        columns={["No. SPP", "No. Rekap", "Peserta", "Jenis Klaim", "Nominal", "Status", "Riwayat", "PIC Terakhir"]}
        data={[
          ["SPP/2026/07/101", "RK-001", "Serma Agus P.", "Rawat Inap", "Rp 45.000.000", <Badge color="green">Dibayar</Badge>, "4 tahap", "Staf Yarpen A"],
          ["SPP/2026/07/102", "RK-001", "Pratu Dedi S.", "Rawat Jalan", "Rp 8.500.000", <Badge color="blue">Disetujui</Badge>, "3 tahap", "Ka. Yarpen"],
          ["SPP/2026/07/103", "RK-002", "Bripka Rina M.", "Operasi", "Rp 120.000.000", <Badge color="orange">Verifikasi</Badge>, "2 tahap", "Staf Yarpen B"],
          ["SPP/2026/07/104", "RK-002", "Koptu Hasan F.", "Rawat Inap", "Rp 32.000.000", <Badge color="gray">Pengajuan</Badge>, "1 tahap", "—"],
        ]}
      />
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

const Perpajakan = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <StatCard icon="🧮" label="PPh 21 Terhitung" value="128.450 WP" sub="Periode Juli 2026 (TER)" color={COLORS.blue} />
      <StatCard icon="📑" label="Bukti Potong A2" value="128.320" sub="130 tertunda (data tidak valid)" color={COLORS.green} />
      <StatCard icon="⚠️" label="NIK/NPWP Bermasalah" value="347 Peserta" sub="Perlu tindak lanjut" color={COLORS.red} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Kalkulator PPh 21 — Metode Aktif</SectionTitle>
        <div style={{ padding: 16, background: "#E3F2FD", borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.gray600 }}>Masa Pajak: Januari–November</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.blue }}>Metode TER (Tarif Efektif Rata-rata)</div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 4 }}>Berdasarkan penghasilan bruto bulanan × kode jiwa</div>
        </div>
        <div style={{ padding: 16, background: COLORS.gray50, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: COLORS.gray600 }}>Masa Pajak: Desember</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gray700 }}>Metode Pasal 17</div>
          <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 4 }}>Penghasilan neto setahun − PTKP → tarif progresif</div>
        </div>
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Antrian Tindak Lanjut Data Tidak Valid</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { type: "NIK Tidak Valid", count: 142, color: "red" },
            { type: "NPWP Tidak Valid", count: 98, color: "orange" },
            { type: "NIK + NPWP Bermasalah", count: 57, color: "red" },
            { type: "Validasi Tertunda (API)", count: 50, color: "yellow" },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: COLORS.gray700 }}>{d.type}</span>
              <Badge color={d.color}>{d.count} peserta</Badge>
            </div>
          ))}
        </div>
        <Btn variant="outline" size="sm" style={{ marginTop: 12 }}>Buka Daftar Lengkap →</Btn>
      </div>
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
      <SectionTitle>Perbandingan TER vs Pasal 17 (Sample)</SectionTitle>
      <Table
        columns={["NRP", "Nama", "Penghasilan Bruto", "PPh Pasal 17", "PPh 21 TER", "Selisih"]}
        data={[
          ["198701234", "Purn. Kol. Ahmad Rifai", "Rp 8.500.000", "Rp 125.000", "Rp 127.500", <span style={{ color: COLORS.red }}>Rp 2.500</span>],
          ["198805678", "Purn. Lettu Budi K.", "Rp 6.200.000", "Rp 62.000", "Rp 62.000", <span style={{ color: COLORS.green }}>Rp 0</span>],
          ["199012345", "Purn. AKP Citra D.", "Rp 12.800.000", "Rp 450.000", "Rp 460.800", <span style={{ color: COLORS.red }}>Rp 10.800</span>],
        ]}
      />
    </div>
  </div>
);

const KreditPiutang = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <StatCard icon="💳" label="Imbal Jasa Flagging" value="Rp 12,8 M" sub="Bulan ini, 6 Bank" color={COLORS.blue} />
      <StatCard icon="🏠" label="Piutang PUM KPR" value="Rp 245 M" sub="1.230 peserta aktif" color={COLORS.orange} />
      <StatCard icon="⚠️" label="UDW Punah Terdeteksi" value="18 Kasus" sub="Rp 890 jt belum kembali" color={COLORS.red} />
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle action={<Btn size="sm" variant="outline">📥 Ekspor Tabel 3 BRS II</Btn>}>Monitoring Imbal Jasa & Denda Keterlambatan</SectionTitle>
      <Table
        columns={["Bank Mitra", "Tagihan Netto", "Tgl Dokumen", "Jatuh Tempo", "Tgl Terima Dana", "Hari Terlambat", "Denda", "Status"]}
        data={[
          ["BRI", "Rp 3.200.000.000", "01 Jun 2026", "15 Jun 2026", "14 Jun 2026", "0", "Rp 0", <Badge color="green">Tepat Waktu</Badge>],
          ["Mandiri", "Rp 4.500.000.000", "01 Jun 2026", "15 Jun 2026", "22 Jun 2026", <span style={{ color: COLORS.red, fontWeight: 700 }}>7</span>, <span style={{ color: COLORS.red }}>Rp 5.876.712</span>, <Badge color="red">Terlambat</Badge>],
          ["BNI", "Rp 2.800.000.000", "01 Jun 2026", "15 Jun 2026", "—", <span style={{ color: COLORS.red, fontWeight: 700 }}>21</span>, <span style={{ color: COLORS.red }}>Rp 11.104.110</span>, <Badge color="red">Belum Bayar</Badge>],
        ]}
      />
      <div style={{ marginTop: 12, fontSize: 12, color: COLORS.gray500 }}>Formula denda: (Tagihan Netto × BI Rate × Hari Terlambat) / 365 — BI Rate: 5,75%</div>
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
      <SectionTitle>Monitoring UDW Punah</SectionTitle>
      <Table
        columns={["Kasus ID", "Peserta", "Nominal UDW", "Tgl Deteksi", "Status Penagihan", "Sisa Waktu", "Aksi"]}
        data={[
          ["UDW-2026-001", "Alm. Serma Joko W.", "Rp 85.000.000", "15 Mei 2026", <Badge color="orange">Dalam Proses</Badge>, "24 hari", <Btn size="sm" variant="ghost">Detail</Btn>],
          ["UDW-2026-002", "Alm. Koptu Andi S.", "Rp 120.000.000", "20 Apr 2026", <Badge color="red">Belum Dikembalikan</Badge>, <span style={{ color: COLORS.red }}>Lewat JT</span>, <Btn size="sm" variant="ghost">Detail</Btn>],
          ["UDW-2026-003", "Alm. Bripda Lina M.", "Rp 65.000.000", "10 Jun 2026", <Badge color="green">Sudah Dikembalikan</Badge>, "—", <Btn size="sm" variant="ghost">Detail</Btn>],
        ]}
      />
    </div>
  </div>
);

const DashboardDIPA = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <StatCard icon="📊" label="Pagu DIPA Total" value="Rp 5.410 M" sub="TA 2026" color={COLORS.blue} />
      <StatCard icon="💸" label="Realisasi SP2D" value="Rp 3.883 M" sub="71,8% terserap" color={COLORS.green} />
      <StatCard icon="📉" label="Sisa Pagu" value="Rp 1.527 M" sub="28,2% tersisa" color={COLORS.orange} />
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle>Breakdown per Jenis Dapem</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { label: "Dapem Induk", pagu: 4200, realisasi: 3150, color: COLORS.blue },
          { label: "Dapem Susulan", pagu: 890, realisasi: 445, color: COLORS.green },
          { label: "Non-Dapem (Harian)", pagu: 320, realisasi: 288, color: COLORS.orange },
        ].map((d, i) => (
          <div key={i} style={{ padding: 16, background: COLORS.gray50, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: COLORS.gray800 }}>{d.label}</span>
              <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                <span>Pagu: <strong>Rp {d.pagu} M</strong></span>
                <span>Realisasi: <strong>Rp {d.realisasi} M</strong></span>
                <span style={{ color: d.realisasi / d.pagu > 0.85 ? COLORS.red : COLORS.green }}>Sisa: <strong>Rp {d.pagu - d.realisasi} M</strong></span>
              </div>
            </div>
            <ProgressBar value={d.realisasi} max={d.pagu} color={d.color} />
            {d.realisasi / d.pagu > 0.85 && (
              <div style={{ marginTop: 8, fontSize: 12, color: COLORS.red, display: "flex", alignItems: "center", gap: 4 }}>
                🔴 Sisa pagu di bawah threshold 15% — notifikasi telah dikirim ke Kadiv Keuangan
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Estimasi Kebutuhan (Proyeksi Aktuaria)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
            <span style={{ fontSize: 13 }}>Kebutuhan Q3 2026</span>
            <strong>Rp 1.650 M</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.gray50, borderRadius: 8 }}>
            <span style={{ fontSize: 13 }}>Sisa Pagu Saat Ini</span>
            <strong>Rp 1.527 M</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: COLORS.redLight, borderRadius: 8 }}>
            <span style={{ fontSize: 13, color: COLORS.red, fontWeight: 600 }}>Proyeksi Kekurangan</span>
            <strong style={{ color: COLORS.red }}>Rp 123 M</strong>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: COLORS.gray500 }}>Parameter aktuaria terakhir: 01 Jul 2026</div>
      </div>

      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        <SectionTitle>Konfigurasi Alert Threshold</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Threshold Peringatan (%)</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" defaultValue={10} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: 80, fontSize: 14 }} />
              <span style={{ fontSize: 13, color: COLORS.gray500 }}>% dari pagu awal</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Notifikasi Dikirim Ke</label>
            <input defaultValue="kadiv.keuangan@asabri.co.id" style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, width: "100%", fontSize: 13 }} />
          </div>
          <Btn size="sm">Simpan Konfigurasi</Btn>
        </div>
      </div>
    </div>
  </div>
);

const RekonBPJS = () => (
  <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
      <StatCard icon="🏥" label="Potongan BPJS Bulan Ini" value="Rp 48,2 M" sub="128.450 peserta" color={COLORS.blue} />
      <StatCard icon="📊" label="Setoran Triwulan II" value="Rp 144,6 M" sub="Apr–Jun 2026" color={COLORS.green} />
      <StatCard icon="⚠️" label="Selisih Teridentifikasi" value="Rp 2,3 M" sub="Lebih potong Rp 1,8M / Kurang Rp 500jt" color={COLORS.orange} />
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle>Rekap Setoran Iuran Jamkes — Triwulan II 2026</SectionTitle>
      <Table
        columns={["Bulan", "Jenis Dapem", "Jumlah Peserta", "Jumlah Setoran", "NTPN", "Tanggal Setor", "Status"]}
        data={[
          ["April 2026", "Dapem Induk", "98.200", "Rp 41.230.000.000", "1234567890ABCDEF", "10 Apr 2026", <Badge color="green">Tervalidasi</Badge>],
          ["April 2026", "Dapem Susulan", "15.300", "Rp 3.420.000.000", "ABCDEF1234567890", "12 Apr 2026", <Badge color="green">Tervalidasi</Badge>],
          ["Mei 2026", "Dapem Induk", "98.450", "Rp 41.580.000.000", "5678901234ABCDEF", "09 Mei 2026", <Badge color="green">Tervalidasi</Badge>],
          ["Juni 2026", "Non-Dapem", "14.500", "Rp 2.870.000.000", "CDEF567890123456", "11 Jun 2026", <Badge color="yellow">Pending</Badge>],
        ]}
      />
    </div>

    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
      <SectionTitle>Kalkulator Kompensasi Lebih/Kurang BPJS</SectionTitle>
      <Table
        columns={["Kelompok Pensiun", "Potongan Seharusnya", "Setoran Aktual", "Selisih", "Keterangan"]}
        data={[
          ["PNS Kemhan", "Rp 18.500.000.000", "Rp 18.720.000.000", <span style={{ color: COLORS.red }}>+Rp 220.000.000</span>, <Badge color="orange">Restitusi ke Kas Negara</Badge>],
          ["TNI", "Rp 22.300.000.000", "Rp 22.300.000.000", <span style={{ color: COLORS.green }}>Rp 0</span>, <Badge color="green">Match</Badge>],
          ["Polri", "Rp 7.800.000.000", "Rp 7.560.000.000", <span style={{ color: COLORS.orange }}>-Rp 240.000.000</span>, <Badge color="red">Kurang Setor</Badge>],
        ]}
      />
    </div>
  </div>
);

const ReportGenerator = () => (
  <div>
    <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
      <SectionTitle>Generator Laporan Standar — 32+ Format</SectionTitle>
      <FilterBar filters={["Periode: Juli 2026", "Satker: Semua", "Mitra Bayar: Semua", "Jenis Dapem: Semua"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { cat: "Penagihan Iuran", reports: ["Tabel 1 BRS II — Rekonsiliasi THT/Dapen", "Tabel 2 BRS II — Template Tagihan", "Rekap Tagihan per Satker"] },
          { cat: "Klaim & Pembayaran", reports: ["Tabel 2 BRS I — Rekap Klaim JKK", "Tabel 4 BRS I — SPP Format Resmi", "Tabel 5 BRS I — Monitoring Taspen Life"] },
          { cat: "Perpajakan", reports: ["Bukti Potong 1721-A2 (Bulanan)", "Bukti Potong 1721-A3 (Tahunan)", "Tabel 25 BRS I — TER vs Pasal 17", "Rekap UKP (Tabel 24 BRS I)"] },
          { cat: "DIPA & SP2D", reports: ["Tabel 12 BRS I — Sisa Pagu DIPA", "Tabel 14–16 BRS I — Realisasi SP2D", "Tabel 17 BRS I — BOP Dapem"] },
          { cat: "Rekonsiliasi BPJS", reports: ["Tabel 11 BRS I — Kompensasi BPJS", "Tabel 13 BRS I — Setoran Triwulan"] },
          { cat: "Utang & Piutang", reports: ["Tabel 9 BRS I — NTPN Non-TGR", "Tabel 10 BRS I — Potongan per Satker", "Tabel 5 BRS II — PUM KPR"] },
        ].map((g, i) => (
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
      <Table
        columns={["Timestamp", "User", "Modul", "Aksi", "Detail Perubahan"]}
        data={[
          ["06 Jul 2026 14:32", "Adm. Wirata Atmaja", "Penagihan", "UPDATE", "Tagihan TGH/07/003 status → Terkirim"],
          ["06 Jul 2026 13:15", "Staf Yarpen B", "Klaim JKK", "CREATE", "Klaim SPP/07/104 diajukan — Rp 32.000.000"],
          ["06 Jul 2026 11:08", "Staf Pajak A", "Perpajakan", "UPDATE", "Tarif TER diperbarui sesuai PMK terbaru"],
          ["05 Jul 2026 16:45", "System", "Integrasi", "SYNC", "1.248 transaksi tersinkron ke Axapta"],
        ]}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: COLORS.gray500 }}>🔒 Log bersifat read-only — tidak dapat diubah/dihapus oleh user biasa</div>
    </div>
  </div>
);

// ============ MAIN APP ============

const MENU = [
  { group: "OPERASIONAL UTAMA", items: [
    { id: "dashboard", icon: "📊", label: "Dashboard Keuangan" },
  ]},
  { group: "MODUL 1 — PENAGIHAN IURAN", items: [
    { id: "kalkulator", icon: "🧮", label: "Kalkulator Iuran" },
    { id: "rekonsiliasi", icon: "🔄", label: "Rekonsiliasi SKP-PFK" },
    { id: "tagihan", icon: "📄", label: "Generator Tagihan" },
  ]},
  { group: "MODUL 2 — KLAIM & MANFAAT", items: [
    { id: "dana", icon: "🏦", label: "Dana & Rekening Koran" },
    { id: "klaim", icon: "📋", label: "Monitoring Klaim JKK" },
  ]},
  { group: "MODUL 3 — KREDIT & PIUTANG", items: [
    { id: "kredit", icon: "💳", label: "Kredit & Piutang" },
  ]},
  { group: "MODUL 4 — PERPAJAKAN", items: [
    { id: "pajak", icon: "📑", label: "PPh 21 & Bukti Potong" },
  ]},
  { group: "MODUL 5 — DIPA & PENSIUN", items: [
    { id: "dipa", icon: "📉", label: "Dashboard DIPA" },
  ]},
  { group: "MODUL 6 — REKON BPJS", items: [
    { id: "bpjs", icon: "🏥", label: "Rekonsiliasi BPJS" },
  ]},
  { group: "MODUL 7 — PELAPORAN", items: [
    { id: "laporan", icon: "📝", label: "Generator Laporan" },
  ]},
];

const PAGES = {
  dashboard: { title: "Dashboard Keuangan", component: DashboardKeuangan },
  kalkulator: { title: "US-1.1 — Kalkulator Iuran Per Peserta", component: KalkulatorIuran },
  rekonsiliasi: { title: "US-1.2 — Rekonsiliasi Iuran vs SKP-PFK", component: RekonsIuran },
  tagihan: { title: "US-1.3 & 1.4 — Generator & Rekap Tagihan", component: GeneratorTagihan },
  dana: { title: "US-2.2 & 2.7 — Dashboard Dana & Rekening Koran Mitra Bayar", component: DashboardDana },
  klaim: { title: "US-2.3 — Monitoring Klaim JKK Perawatan", component: MonitoringKlaim },
  kredit: { title: "US-3.x — Kredit, Piutang & UDW Punah", component: KreditPiutang },
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
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.blueDark} 100%)`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: COLORS.white, fontSize: 20, cursor: "pointer", padding: 4 }}>☰</button>
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
            <span style={{ fontSize: 12, color: COLORS.gray400 }}>🔍</span>
            <span style={{ fontSize: 12, color: COLORS.gray400 }}>Cari Peserta / NRP / NIP...</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: COLORS.gray300 }}>
            ROLE: <strong style={{ color: COLORS.white }}>Super Administrator</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 12, fontWeight: 700 }}>WA</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width: 250, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, overflowY: "auto", flexShrink: 0, padding: "8px 0" }}>
            {MENU.map((g, gi) => (
              <div key={gi} style={{ marginBottom: 4 }}>
                <div style={{ padding: "10px 16px 4px", fontSize: 10, fontWeight: 700, color: COLORS.gray500, letterSpacing: 0.8, textTransform: "uppercase" }}>{g.group}</div>
                {g.items.map(item => (
                  <button key={item.id} onClick={() => setActivePage(item.id)} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 16px", border: "none", cursor: "pointer", fontSize: 13, textAlign: "left",
                    background: activePage === item.id ? "#E3F2FD" : "transparent",
                    color: activePage === item.id ? COLORS.blue : COLORS.gray700,
                    fontWeight: activePage === item.id ? 600 : 400,
                    borderRight: activePage === item.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                  }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 2 }}>Beranda › Keuangan › {page.title.split("—")[0].trim()}</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>{page.title}</h2>
            </div>
            <div style={{ background: COLORS.blueDark, color: COLORS.white, padding: "6px 14px", borderRadius: 6, fontSize: 12 }}>
              📅 Minggu, 06 Juli 2026
            </div>
          </div>
          <PageComp />
        </div>
      </div>
    </div>
  );
}
