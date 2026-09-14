import { Download, FileText } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Btn } from "./Btn";

export const PreviewModal = ({ preview, onClose }) => {
  if (!preview) return null;
  const { title, subtitle, type, content, fileName } = preview;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: preview?.width || (content?.satkerList ? 880 : (type === "table" && (content?.columns?.length || 0) > 6 ? (content?.columns?.length > 10 ? 1100 : 880) : 680)), maxWidth: "96vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
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
                  <div style={{ fontSize: 14, fontWeight: 700, textDecoration: "underline" }}>SURAT TAGIHAN IURAN</div>
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>{content?.noSurat || "No. 001/ASABRI/TGH/VII/2026"}</div>
                  {content?.batchInfo && (
                    <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", background: "#EFF6FF", color: COLORS.blueDark, borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      📌 {content.batchInfo}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: COLORS.gray800 }}>
                  <p>Kepada Yth,<br/><strong>{content?.tujuan || "Direktur Jenderal Perbendaharaan — Kementerian Keuangan RI"}</strong><br/><span style={{ fontSize: 11, color: COLORS.gray600 }}>Gedung Prijadi Praptosuhardjo I, Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat</span></p>
                  
                  {content?.dasarSKP ? (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "#F0F7FF", borderLeft: "4px solid #1D4ED8", borderRadius: 4, fontSize: 11.5 }}>
                      <strong>Dasar Penagihan (SKP-PFK Kemenkeu):</strong><br />
                      Menindaklanjuti Surat Ketetapan Perhitungan (SKP-PFK) Direktorat Jenderal Perbendaharaan Kementerian Keuangan RI Nomor: <strong style={{ color: "#1D4ED8" }}>{content.dasarSKP.noSurat || content.dasarSKP}</strong> {content.dasarSKP.tglSurat ? `tertanggal ${content.dasarSKP.tglSurat}` : ""} hal Penetapan Perhitungan Fihak Ketiga (PFK) Iuran Tabungan Hari Tua (THT) dan Pensiun.
                    </div>
                  ) : (
                    <p style={{ marginTop: 12 }}>Berdasarkan data kepesertaan per tanggal cut-off <strong>{content?.cutoff || "25 Juni 2026"}</strong> (Sistem Otomasi ASABRI), bersama ini kami sampaikan tagihan iuran untuk periode <strong>{content?.periode || "Juli 2026"}</strong> dengan rincian sebagai berikut:</p>
                  )}

                  {content?.dasarSKP && (
                    <p style={{ marginTop: 10 }}>Sehubungan dengan hal tersebut di atas, bersama ini kami sampaikan tagihan iuran resmi untuk periode <strong>{content?.periode || "Juli 2026"}</strong> dengan rincian perhitungan sebagai berikut:</p>
                  )}

                  <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 12 }}>
                    <thead><tr style={{ background: COLORS.gray50 }}><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "left" }}>Jenis Iuran</th><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Peserta</th><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Nominal Tagihan</th></tr></thead>
                    <tbody>
                      {(content?.items || [
                        { jenis: "THT (3,25%)", peserta: "14.328", nominal: "Rp 35.760.000.000" },
                        { jenis: "Pensiun (4,75%)", peserta: "14.328", nominal: "Rp 52.250.000.000" },
                        { jenis: "JKK (0,24%)", peserta: "14.328", nominal: "Rp 2.630.000.000" },
                        { jenis: "JKm (0,20%)", peserta: "14.328", nominal: "Rp 2.210.000.000" },
                      ]).map((it, i) => (
                        <tr key={i}><td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6 }}>{it.jenis}</td><td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>{it.peserta}</td><td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right", fontWeight: 700 }}>{it.nominal}</td></tr>
                      ))}
                      {content?.totalNominal && (
                        <tr style={{ background: "#F1F5F9", fontWeight: 700 }}>
                          <td colSpan={2} style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Total Tagihan:</td>
                          <td style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right", color: COLORS.blueDark }}>{content.totalNominal}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {content?.satkerList && content.satkerList.length > 0 && (
                    <div style={{ margin: "18px 0" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray900, marginBottom: 6 }}>
                        Lampiran: Rincian Alokasi Dana THT dan Pensiun Per-Satuan Kerja (Satker)
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                          <thead>
                            <tr style={{ background: "#F1F5F9", color: COLORS.gray700 }}>
                              <th style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "left" }}>Satker Kedinasan</th>
                              <th style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "left" }}>Matra</th>
                              <th style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right" }}>Peserta</th>
                              <th style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right" }}>Dana THT (3,25%)</th>
                              <th style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right" }}>Dana Pensiun (4,75%)</th>
                              <th style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right" }}>Total Satker</th>
                            </tr>
                          </thead>
                          <tbody>
                            {content.satkerList.map((s, idx) => (
                              <tr key={idx}>
                                <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", fontWeight: 600 }}>{s.satker}</td>
                                <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px" }}>{s.matra}</td>
                                <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right" }}>{Number(s.peserta).toLocaleString("id-ID")}</td>
                                <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right", color: "#1E3A8A" }}>Rp {Number(s.danaTHT).toLocaleString("id-ID")}</td>
                                <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right", color: "#065F46" }}>Rp {Number(s.danaPensiun).toLocaleString("id-ID")}</td>
                                <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "5px 6px", textAlign: "right", fontWeight: 700, color: COLORS.blueDark }}>Rp {Number(s.total).toLocaleString("id-ID")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <p>Demikian surat tagihan ini kami sampaikan untuk dapat diproses penyalurannya sesuai ketentuan yang berlaku. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
                  
                  <div style={{ marginTop: 24, textAlign: "right" }}>
                    <div>Jakarta, {content?.tanggal || "26 Juli 2026"}</div>
                    <div style={{ marginTop: 6, fontWeight: 700 }}>Kepala Divisi Keuangan PT ASABRI (Persero)</div>
                    <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#94A3B8", fontStyle: "italic", fontSize: 11 }}>
                      [ Tanda Tangan Basah Manual ]
                    </div>
                    <div style={{ fontWeight: 700, textDecoration: "underline" }}>Wirata Atmaja, S.E., M.M.</div>
                    <div style={{ fontSize: 11, color: COLORS.gray500 }}>NRP/NIP: 197804152002121001</div>
                  </div>
                </div>
              </div>
            )}
            {type === "skp" && (
              <div style={{ padding: "32px 40px", background: COLORS.white, margin: 16, borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontFamily: "'Times New Roman', serif" }}>
                <div style={{ textAlign: "center", marginBottom: 20, borderBottom: `2px solid ${COLORS.gray900}`, paddingBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>DIREKTORAT JENDERAL PERBENDAHARAAN</div>
                  <div style={{ fontSize: 11, color: COLORS.gray600 }}>DIREKTORAT PENGELOLAAN KAS NEGARA</div>
                  <div style={{ fontSize: 10, color: COLORS.gray500, marginTop: 2 }}>Gedung Prijadi Praptosuhardjo I, Jl. Lapangan Banteng Timur No. 2-4, Jakarta 10710</div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 16 }}>
                  <div>
                    <div>Nomor : <strong>{content?.noSurat || "S-184/PB.2/2026"}</strong></div>
                    <div>Sifat : Segera / Resmi</div>
                    <div>Lampiran : 1 (satu) Berkas Rekapitulasi PFK</div>
                    <div>Hal : <strong>Surat Ketetapan Perhitungan - Perhitungan Fihak Ketiga (SKP-PFK)</strong></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>Jakarta, {content?.tglSurat || "14 Juli 2026"}</div>
                    <div style={{ marginTop: 4, padding: "2px 8px", background: "#FEF3C7", color: "#92400E", borderRadius: 4, fontSize: 10.5, fontWeight: 700, display: "inline-block" }}>
                      DOKUMEN SUMBER KEMENKEU
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 12, lineHeight: 1.8, color: COLORS.gray800 }}>
                  <p>Yth. <strong>Direksi PT ASABRI (Persero)</strong><br/>c.q. Kepala Divisi Keuangan<br/>Jl. Mayjen Sutoyo No. 11, Cilitan, Jakarta Timur</p>
                  
                  <p style={{ marginTop: 12, textIndent: 24 }}>
                    Sehubungan dengan hasil rekonsiliasi dan verifikasi data potongan gaji pokok dan tunjangan keluarga anggota TNI, POLRI, dan PNS/PPPK Kemhan/Polri periode <strong>{content?.periode || "Juli 2026"}</strong>, dengan ini disampaikan <strong>Surat Ketetapan Perhitungan - Perhitungan Fihak Ketiga (SKP-PFK)</strong> untuk program Iuran Tabungan Hari Tua (THT) dan Pensiun dengan rincian ketetapan sebagai berikut:
                  </p>

                  <div style={{ margin: "16px 0", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "14px 18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 8, fontSize: 12 }}>
                      <div style={{ color: "#64748B" }}>Nomor Surat Ketetapan:</div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{content?.noSurat}</div>

                      <div style={{ color: "#64748B" }}>Periode / Termin:</div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{content?.periode} ({content?.batch || "Termin 1 / Gaji Induk"})</div>

                      <div style={{ color: "#64748B" }}>Dasar Potongan:</div>
                      <div>Gaji Induk & Tunjangan Melekat Peserta Aktif ASABRI</div>

                      <div style={{ color: "#64748B" }}>Nominal Ketetapan PFK:</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1D4ED8", fontFamily: "monospace" }}>
                        {content?.nominal || "Rp 70.408.000.000"}
                      </div>

                      <div style={{ color: "#64748B" }}>Nama Berkas Lampiran:</div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#059669" }}>
                        📄 {content?.fileName || "SKP_PFK_Kemenkeu_Juli_2026.pdf"}
                      </div>
                    </div>
                  </div>

                  <p style={{ textIndent: 24 }}>
                    Berdasarkan penetapan SKP-PFK ini, dimohon kepada PT ASABRI (Persero) untuk menerbitkan <strong>Surat Tagihan Resmi</strong> kepada Direktorat Jenderal Perbendaharaan Kementerian Keuangan guna pemindahbukuan dana ke rekening penampungan iuran.
                  </p>

                  <div style={{ marginTop: 24, textAlign: "right" }}>
                    <div>a.n. Direktur Jenderal Perbendaharaan</div>
                    <div style={{ fontWeight: 700 }}>Direktur Pengelolaan Kas Negara</div>
                    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#2563EB", fontStyle: "italic", fontSize: 11 }}>
                      [ Ditandatangani & Distempel Dinas Kemenkeu ]
                    </div>
                    <div style={{ fontWeight: 700, textDecoration: "underline" }}>Dr. Noor Faisal Achmad, M.Sc.</div>
                    <div style={{ fontSize: 11, color: COLORS.gray500 }}>NIP. 197103281997031002</div>
                  </div>
                </div>
              </div>
            )}
            {type === "bar" && (
              <div style={{ padding: "32px 40px", background: COLORS.white, margin: 16, borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontFamily: "'Times New Roman', serif" }}>
                <div style={{ textAlign: "center", marginBottom: 20, borderBottom: `2px solid ${COLORS.gray900}`, paddingBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA & PT ASABRI (PERSERO)</div>
                  <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>TIM REKONSILIASI IURAN ASURANSI SOSIAL PRAJURIT TNI, ANGGOTA POLRI & ASN KEMHAN</div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, textDecoration: "underline" }}>BERITA ACARA REKONSILIASI (BAR)</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.blueDark, marginTop: 4 }}>
                    NOMOR: {content?.noBAR || "BAR-01/REKON-IURAN/2026"}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 2 }}>
                    TENTANG PENETAPAN REKONSILIASI PENERIMAAN IURAN {content?.programJudul || "THT DAN PENSIUN"}
                  </div>
                </div>

                <div style={{ fontSize: 12, lineHeight: 1.8, color: COLORS.gray800 }}>
                  <p style={{ textIndent: 24, textAlign: "justify" }}>
                    Pada hari ini, <strong>{content?.hariTanggal || "Jumat, 31 Juli 2026"}</strong>, bertempat di Jakarta, telah dilaksanakan rekonsiliasi data kepesertaan dan realisasi penerimaan iuran untuk <strong>{content?.programJudul || "Program THT dan Pensiun"}</strong> Periode <strong>{content?.periode || "Juli 2026"}</strong> antara:
                  </p>

                  <div style={{ margin: "10px 0 14px 20px" }}>
                    <div><strong>I. PT ASABRI (Persero)</strong>, bertindak sebagai Pengelola Program Asuransi Sosial Prajurit TNI, POLRI, dan ASN Kemhan, selanjutnya disebut <strong>PIHAK PERTAMA</strong>.</div>
                    <div style={{ marginTop: 4 }}><strong>II. Direktorat Pengelolaan Kas Negara, Ditjen Perbendaharaan Kementerian Keuangan RI</strong>, selaku Kuasa Bendahara Umum Negara (BUN), selanjutnya disebut <strong>PIHAK KEDUA</strong>.</div>
                  </div>

                  <p style={{ textIndent: 24, textAlign: "justify" }}>
                    Kedua belah pihak bersama-sama telah melakukan penelitian, rekonsiliasi, dan pencocokan data penerimaan dana iuran berdasarkan dokumen sumber yang sah dengan hasil sebagai berikut:
                  </p>

                  <table style={{ width: "100%", borderCollapse: "collapse", margin: "14px 0", fontSize: 11.5 }}>
                    <tbody>
                      <tr style={{ background: "#F8FAFC" }}>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", width: "35%", fontWeight: 600 }}>Nomor Surat Tagihan Resmi</td>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 700, fontFamily: "monospace" }}>{content?.noSuratTagihan}</td>
                      </tr>
                      <tr>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 600 }}>Dokumen Dasar Penetapan</td>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontFamily: "monospace", color: COLORS.blueDark }}>{content?.dokumenDasar}</td>
                      </tr>
                      <tr style={{ background: "#F8FAFC" }}>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 600 }}>Nomor SP2D Realisasi Kas</td>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontFamily: "monospace" }}>{content?.noSP2D} (Tgl: {content?.tglSP2D})</td>
                      </tr>
                      <tr>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 600 }}>Rekening Giro Penampungan</td>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px" }}>{content?.bankTujuan}</td>
                      </tr>
                      <tr style={{ background: "#F8FAFC" }}>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 600 }}>Total Nominal Masuk Kas</td>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 800, fontSize: 13, color: "#065F46", fontFamily: "monospace" }}>
                          {content?.nominal}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 600 }}>Status Hasil Rekonsiliasi</td>
                        <td style={{ border: `1px solid ${COLORS.gray300}`, padding: "6px 10px", fontWeight: 700, color: "#065F46" }}>
                          ✅ SELESAI (100% MATCH - LUNAS TUNTAS)
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style={{ textIndent: 24, textAlign: "justify" }}>
                    Demikian Berita Acara Rekonsiliasi ini dibuat dan ditandatangani dalam rangkap 2 (dua) bermeterai cukup dan memiliki kekuatan hukum yang sama bagi kedua belah pihak sebagai bukti penyelesaian monitoring dan rekonsiliasi yang sah.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 24, textAlign: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>PIHAK PERTAMA</div>
                      <div style={{ fontSize: 11, color: COLORS.gray600 }}>PT ASABRI (PERSERO)</div>
                      <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", fontStyle: "italic", fontSize: 11 }}>
                        [ Tanda Tangan & Cap Sah ]
                      </div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>Wirata Atmaja, S.E., M.M.</div>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>Kepala Divisi Keuangan</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>PIHAK KEDUA</div>
                      <div style={{ fontSize: 11, color: COLORS.gray600 }}>KEMENTERIAN KEUANGAN RI</div>
                      <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", fontStyle: "italic", fontSize: 11 }}>
                        [ Tanda Tangan & Cap Dinas ]
                      </div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>Dr. Noor Faisal Achmad, M.Sc.</div>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>Direktur Pengelolaan Kas Negara</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {type === "table" && (
              <div style={{ padding: 16 }}>
                <div style={{ background: COLORS.white, borderRadius: 8, overflowX: "auto", border: `1px solid #CBD5E1` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: (content?.columns?.length || 0) > 7 ? 960 : "100%" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                        {(content?.columns || []).map((c, i) => {
                          const align = content?.alignments?.[i] || "left";
                          return (
                            <th
                              key={i}
                              style={{
                                padding: "9px 12px",
                                textAlign: align,
                                borderBottom: `1px solid #E2E8F0`,
                                borderRight: i < (content?.columns?.length || 0) - 1 ? "1px solid #E2E8F0" : "none",
                                fontWeight: 800,
                                color: "#64748B",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {(content?.rows || []).map((row, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                          {row.map((cell, j) => {
                            const align = content?.alignments?.[j] || (typeof cell === "number" || (typeof cell === "string" && (cell.startsWith("Rp") || cell.endsWith("%"))) ? "right" : "left");
                            const isRpOrCode = typeof cell === "string" && (cell.startsWith("Rp") || /^\d{10,}$/.test(cell));
                            return (
                              <td
                                key={j}
                                style={{
                                  padding: "8px 12px",
                                  color: "#0F172A",
                                  textAlign: align,
                                  fontFamily: isRpOrCode ? "monospace" : "inherit",
                                  borderRight: j < row.length - 1 ? "1px solid #E2E8F0" : "none",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                    {content?.totalRow && (
                      <tfoot>
                        <tr style={{ background: "#F1F5F9", fontWeight: 800, borderTop: "2px solid #CBD5E1" }}>
                          {content.totalRow.map((cell, j) => {
                            const isObj = typeof cell === "object" && cell !== null && !Array.isArray(cell);
                            const text = isObj ? cell.text : cell;
                            const colSpan = isObj ? (cell.colSpan || 1) : 1;
                            const align = isObj && cell.align ? cell.align : (j === 0 ? "left" : "right");
                            return (
                              <td
                                key={j}
                                colSpan={colSpan}
                                style={{
                                  padding: "9px 12px",
                                  color: (isObj && cell.color) ? cell.color : "#0F172A",
                                  textAlign: align,
                                  borderRight: "1px solid #CBD5E1",
                                  fontFamily: (isObj && cell.mono) || (typeof text === "string" && text.startsWith("Rp")) ? "monospace" : "inherit",
                                  fontWeight: 800,
                                  whiteSpace: "nowrap",
                                  ...(isObj && cell.style ? cell.style : {}),
                                }}
                              >
                                {text}
                              </td>
                            );
                          })}
                        </tr>
                      </tfoot>
                    )}
                  </table>
                  {(content?.totalRows || 0) > (content?.rows?.length || 0) && (
                    <div style={{ fontSize: 11, color: COLORS.gray500, padding: 10, textAlign: "center", background: "#F8FAFC" }}>
                      ... dan {content.totalRows - content.rows.length} baris lainnya
                    </div>
                  )}
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
