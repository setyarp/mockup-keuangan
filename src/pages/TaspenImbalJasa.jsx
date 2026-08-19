import { useState } from "react";
import { CheckCircle2, Percent, Banknote, Clock, AlertTriangle } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const TaspenImbalJasa = () => {
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
