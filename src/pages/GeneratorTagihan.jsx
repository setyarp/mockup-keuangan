import { useState } from "react";
import { Banknote, BarChart3, Shield, Lock, PenTool, CheckCircle2, Mail } from "lucide-react";
import { COLORS } from "../constants/colors";
import { Badge, StatCard, Select, Btn, NoData, PreviewModal } from "../components/common";

export const GeneratorTagihan = () => {
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
