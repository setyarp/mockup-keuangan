import {
  X,
  Printer,
  Download,
  Send,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Btn } from "../common/Btn";
import { Badge } from "../common/Badge";

export const ModalNotaDinas = ({ listPesertaAnomali = [], onClose, onSendElectrically }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        padding: 16,
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          width: "100%",
          maxWidth: 820,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid #CBD5E1",
          overflow: "hidden",
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} color={COLORS.blue} />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
              Nota Dinas Pengantar Permintaan Pemutakhiran NIK ke Divisi Kepesertaan
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              color: "#94A3B8",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Paper Document Container */}
        <div
          style={{
            padding: "24px 32px",
            overflowY: "auto",
            background: "#FFFFFF",
            fontFamily: "'Times New Roman', Times, serif",
            color: "#0F172A",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {/* KOP NOTA DINAS */}
          <div style={{ textAlign: "center", borderBottom: "3px double #0F172A", paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: "bold", letterSpacing: 1 }}>PT ASABRI (PERSERO)</div>
            <div style={{ fontSize: 15, fontWeight: "bold", textTransform: "uppercase" }}>DIVISI KEUANGAN — BIDANG PERPAJAKAN</div>
            <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "#475569" }}>
              Jl. Mayjen Sutoyo No. 11, Cilitan, Kramat Jati, Jakarta Timur 13640 • Telp: (021) 8094140
            </div>
          </div>

          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 14, textDecoration: "underline", marginBottom: 16 }}>
            NOTA DINAS
          </div>

          {/* Metadata Surat */}
          <table style={{ width: "100%", marginBottom: 16, borderCollapse: "collapse", fontSize: 12.5, fontFamily: "sans-serif" }}>
            <tbody>
              <tr>
                <td style={{ width: 100, padding: "3px 0", fontWeight: "bold" }}>Nomor</td>
                <td style={{ width: 15 }}>:</td>
                <td>ND-142/ASABRI/PAJAK-KEU/VII/2026</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", fontWeight: "bold" }}>Kepada Yth.</td>
                <td>:</td>
                <td><strong>Kepala Divisi Kepesertaan dan Pelayanan PT ASABRI (Persero)</strong></td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", fontWeight: "bold" }}>Dari</td>
                <td>:</td>
                <td>Kepala Divisi Keuangan (Bidang Perpajakan)</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", fontWeight: "bold" }}>Tanggal</td>
                <td>:</td>
                <td>08 Juli 2026</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", fontWeight: "bold" }}>Sifat</td>
                <td>:</td>
                <td><span style={{ color: "#B91C1C", fontWeight: "bold" }}>PENTING / SEGERA</span></td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", fontWeight: "bold", verticalAlign: "top" }}>Perihal</td>
                <td style={{ verticalAlign: "top" }}>:</td>
                <td>
                  <strong>
                    Permintaan Pemutakhiran dan Pemadanan Data NIK Peserta Pensiun Anomali untuk Kepatuhan Integrasi Coretax DJP &amp; Penerbitan Bukti Potong 1721-A2 TA 2026
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ borderTop: "1px solid #CBD5E1", paddingTop: 12, fontFamily: "sans-serif", fontSize: 12 }}>
            <p style={{ margin: "0 0 10px" }}>
              1. Rujukan:
            </p>
            <ul style={{ margin: "0 0 12px 20px", padding: 0 }}>
              <li>Peraturan Menteri Keuangan Nomor 168 Tahun 2023 tentang Petunjuk Pemotongan Pajak atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, atau Kegiatan.</li>
              <li>Peraturan Direktur Jenderal Pajak tentang Standarisasi Integrasi NIK sebagai NPWP pada Sistem Inti Administrasi Perpajakan (Coretax DJP).</li>
              <li>SOP Pengelolaan Pajak dan Rekonsiliasi DAPEM PT ASABRI (Persero).</li>
            </ul>

            <p style={{ margin: "0 0 10px" }}>
              2. Sehubungan dengan proses validasi sistem perpajakan terpadu terhadap master data DAPEM Pensiun, dilaporkan bahwa pembayaran manfaat pensiun tetap diproses secara penuh menggunakan tarif normal (tanpa sanksi denda 20%). Namun demikian, ditemukan sejumlah <strong>{listPesertaAnomali.length} peserta</strong> yang NIK-nya berstatus <strong>anomali / tidak valid</strong> di server Ditjen Dukcapil Kemendagri sehingga berpotensi tertolak pada saat sinkronisasi manifes Bukti Potong 1721-A2 di Coretax DJP.
            </p>

            <p style={{ margin: "0 0 10px" }}>
              3. Bersama ini kami teruskan daftar peserta pensiun dimaksud untuk ditindaklanjuti dan dimutakhirkan oleh <strong>Divisi Kepesertaan</strong> bersama Satker Kedinasan terkait:
            </p>

            {/* Tabel Lampiran Peserta */}
            <div style={{ margin: "12px 0", overflowX: "auto", border: "1px solid #0F172A", borderRadius: 4 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "sans-serif" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #0F172A" }}>
                    <th style={{ padding: "6px 6px", textAlign: "center", width: 30, borderRight: "1px solid #CBD5E1" }}>No</th>
                    <th style={{ padding: "6px 8px", textAlign: "left", borderRight: "1px solid #CBD5E1" }}>Nama &amp; Satker</th>
                    <th style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #CBD5E1" }}>NOPENS / NRP</th>
                    <th style={{ padding: "6px 8px", textAlign: "center", borderRight: "1px solid #CBD5E1" }}>NIK Saat Ini</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", borderRight: "1px solid #CBD5E1" }}>Diagnosa Masalah NIK</th>
                    <th style={{ padding: "6px 8px", textAlign: "center" }}>Prioritas</th>
                  </tr>
                </thead>
                <tbody>
                  {listPesertaAnomali.map((p, idx) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "5px 6px", textAlign: "center", borderRight: "1px solid #CBD5E1" }}>{idx + 1}</td>
                      <td style={{ padding: "5px 8px", borderRight: "1px solid #CBD5E1" }}>
                        <strong style={{ color: "#0F172A" }}>{p.nama}</strong>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{p.satker} ({p.unor})</div>
                      </td>
                      <td style={{ padding: "5px 8px", textAlign: "center", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                        {p.nopens}<br />{p.nrp}
                      </td>
                      <td style={{ padding: "5px 8px", textAlign: "center", fontFamily: "monospace", color: "#B91C1C", fontWeight: "bold", borderRight: "1px solid #CBD5E1" }}>
                        {p.nik}
                      </td>
                      <td style={{ padding: "5px 10px", color: "#334155", borderRight: "1px solid #CBD5E1", fontSize: 10.5 }}>
                        {p.diagnosaNIK || p.kategoriAnomali}
                      </td>
                      <td style={{ padding: "5px 8px", textAlign: "center" }}>
                        <Badge color={p.prioritas === "Sangat Tinggi" ? "red" : p.prioritas === "Tinggi" ? "orange" : "blue"}>
                          {p.prioritas}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ margin: "0 0 10px" }}>
              4. Mohon bantuan Divisi Kepesertaan untuk dapat mengklarifikasi salinan identitas kependudukan (e-KTP/Kartu Keluarga) kepada peserta atau Satker terkait, serta mengunggah Berita Acara pemutakhiran data paling lambat sebelum tanggal cut-off pelaporan masa berikutnya.
            </p>

            <p style={{ margin: "0 0 16px" }}>
              5. Demikian Nota Dinas ini disampaikan, atas perhatian dan kerja samanya diucapkan terima kasih.
            </p>

            {/* Tanda Tangan */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <div style={{ textAlign: "center", width: 260 }}>
                <div style={{ fontWeight: "bold" }}>Kepala Divisi Keuangan</div>
                <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ border: "1px dashed #94A3B8", borderRadius: 6, padding: "4px 8px", fontSize: 9.5, color: "#059669", fontWeight: "bold" }}>
                    [ Ditandatangani Elektronik (DS) ]<br />
                    PT ASABRI (PERSERO) • KEUANGAN
                  </div>
                </div>
                <div style={{ fontWeight: "bold", textDecoration: "underline" }}>Drs. H. Mulyadi, M.Ak., CA.</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>NRP / NIP. 197408151998031001</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC",
          }}
        >
          <div style={{ fontSize: 11, color: "#64748B" }}>
            Tembusan: Direktur SDM &amp; Keuangan, Kepala Divisi TI
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" size="sm" onClick={() => window.print()}>
              <Printer size={13} /> Cetak / PDF
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              onClick={() => {
                if (onSendElectrically) onSendElectrically();
                onClose();
              }}
            >
              <Send size={13} /> Kirim Notifikasi ke Portal Kepesertaan
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};
