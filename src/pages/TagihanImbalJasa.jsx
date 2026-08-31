import { useState } from "react";
import { CheckCircle2, Banknote, Clock, AlertTriangle, BarChart3, Bell } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const TagihanImbalJasa = () => {
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
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  {["No. Tagihan", "Mitra Bayar", "Program", "Jenis Imbal Jasa", "Periode", "Tgl. Terbit", "Jatuh Tempo", "Tgl. Dibayar", "Status", "Aksi"].map((c, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 800, color: "#64748B", borderBottom: `1px solid #E2E8F0`, borderRight: i < 9 ? "1px solid #E2E8F0" : "none", whiteSpace: "nowrap" }}>{c}</th>
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
