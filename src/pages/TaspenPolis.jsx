import { useState } from "react";
import { AlertTriangle, Shield, Banknote, Clock, CircleDot, Upload, CheckCircle2 } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, ProgressBar, Table, NoData, PreviewModal } from "../components/common";

export const TaspenPolis = () => {
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
  const belumBayar = polis.filter(p => p.status === "Belum Dibayar");
  const totalBelum = belumBayar.reduce((a, p) => a + p.premi, 0);

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
