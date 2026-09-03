import { Download, FileText } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Btn } from "./Btn";

export const PreviewModal = ({ preview, onClose }) => {
  if (!preview) return null;
  const { title, subtitle, type, content, fileName } = preview;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: preview?.width || (type === "table" && (content?.columns?.length || 0) > 6 ? (content?.columns?.length > 10 ? 1100 : 880) : 680), maxWidth: "96vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
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
                  <div style={{ fontSize: 14, fontWeight: 700, textDecoration: "underline" }}>SURAT TAGIHAN</div>
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>{content?.noSurat || "No. 001/ASABRI/TGH/VII/2026"}</div>
                  {content?.batchInfo && (
                    <div style={{ display: "inline-block", marginTop: 6, padding: "2px 10px", background: "#EFF6FF", color: COLORS.blueDark, borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      📌 {content.batchInfo}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: COLORS.gray800 }}>
                  <p>Kepada Yth,<br/><strong>{content?.tujuan || "Direktur Jenderal Perbendaharaan — Kementerian Keuangan RI"}</strong></p>
                  <p style={{ marginTop: 12 }}>Berdasarkan data kepesertaan per tanggal cut-off <strong>{content?.cutoff || "25 Juni 2026"}</strong>, bersama ini kami sampaikan tagihan iuran untuk periode <strong>{content?.periode || "Juli 2026"}</strong> dengan rincian sebagai berikut:</p>
                  <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 12 }}>
                    <thead><tr style={{ background: COLORS.gray50 }}><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "left" }}>Jenis Iuran</th><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Peserta</th><th style={{ border: `1px solid ${COLORS.gray300}`, padding: 6, textAlign: "right" }}>Nominal</th></tr></thead>
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
                  <p>Demikian surat tagihan ini kami sampaikan. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
                  <div style={{ marginTop: 24, textAlign: "right" }}>
                    <div>Jakarta, {content?.tanggal || "26 Juni 2026"}</div>
                    <div style={{ marginTop: 8, fontWeight: 700 }}>Kepala Divisi Keuangan</div>
                    <div style={{ marginTop: 40, fontWeight: 700, textDecoration: "underline" }}>Wirata Atmaja, S.E., M.M.</div>
                    <div style={{ fontSize: 11, color: COLORS.gray500 }}>NRP/NIP: 197804152002121001</div>
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
