import { useState } from "react";
import { Calculator, Receipt, AlertTriangle, ChevronDown, ChevronRight, RefreshCw, FileUp, Upload, CheckCircle2, Mail, Eye, PenLine } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, Badge, NoData, PreviewModal } from "../components/common";

export const Perpajakan = () => {
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
