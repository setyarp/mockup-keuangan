import { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileCheck,
  Building2,
  User,
  Hash,
  UploadCloud,
  FileText
} from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Btn } from "../common/Btn";
import { Badge } from "../common/Badge";

export const ModalUpdateNIK = ({ data, onClose, onSave }) => {
  if (!data) return null;

  const [newNik, setNewNik] = useState(
    data.nik.startsWith("NIK-S") || data.nik.length !== 16 ? "" : data.nik
  );
  const [namaKTP, setNamaKTP] = useState(data.nama);
  const [noBA, setNoBA] = useState(`BA-KEP/${new Date().getFullYear()}/089`);
  const [catatan, setCatatan] = useState(
    `Telah diverifikasi kesesuaian fisik e-KTP dan data kependudukan SIAK Kemendagri dari Satker ${data.satker}.`
  );
  const [isTestedDukcapil, setIsTestedDukcapil] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const cleanNik = newNik.trim();
  const isDigitOnly = /^\d+$/.test(cleanNik);
  const isValidLength = cleanNik.length === 16;
  const isNikValidFormat = isDigitOnly && isValidLength;

  const handleTestDukcapil = () => {
    if (!isNikValidFormat) return;
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setIsTestedDukcapil(true);
    }, 600);
  };

  const handleSave = () => {
    if (!isNikValidFormat) return;
    onSave({
      id: data.id,
      nik: cleanNik,
      nama: namaKTP,
      noBA,
      catatan,
    });
  };

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
          maxWidth: 620,
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
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BFDBFE",
              }}
            >
              <FileCheck size={18} color={COLORS.blue} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                Pemutakhiran NIK Hasil Tindak Lanjut Kepesertaan
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>
                Rekonsiliasi Data Kependudukan Dukcapil untuk Administrasi Pajak Coretax
              </div>
            </div>
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

        {/* Content Body */}
        <div style={{ padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Ringkasan Data Peserta Saat Ini */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              padding: 12,
              border: "1px solid #E2E8F0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              fontSize: 12,
            }}
          >
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: 10.5, fontWeight: 600 }}>NAMA PESERTA</span>
              <strong style={{ color: "#0F172A" }}>{data.nama}</strong>
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: 10.5, fontWeight: 600 }}>NOPENS / NRP</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark }}>
                {data.nopens} • {data.nrp}
              </span>
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: 10.5, fontWeight: 600 }}>SATKER / UNOR</span>
              <span style={{ color: "#334155" }}>{data.satker} ({data.unor})</span>
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: 10.5, fontWeight: 600 }}>NIK TERCATAT (ANOMALI)</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#DC2626" }}>
                {data.nik}
              </span>
            </div>
          </div>

          {/* Diagnosa Anomali */}
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 8,
              padding: "10px 12px",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 11.5,
              color: "#991B1B",
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Diagnosa Masalah NIK:</strong> {data.diagnosaNIK || data.kategoriAnomali}
              <div style={{ marginTop: 2, fontSize: 10.5, color: "#B91C1C" }}>
                Status Tindak Lanjut: <strong>{data.statusTindakLanjut}</strong> • No. Pengantar: <strong>{data.noSuratPengantar}</strong>
              </div>
            </div>
          </div>

          {/* Form Input Pemutakhiran */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Input NIK Baru */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                  NIK Baru yang Terverifikasi Dukcapil (16 Digit) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: cleanNik.length === 16 ? "#059669" : "#64748B",
                  }}
                >
                  {cleanNik.length} / 16 Digit
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 3175041504730008"
                  value={newNik}
                  onChange={(e) => {
                    setNewNik(e.target.value);
                    setIsTestedDukcapil(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: `1px solid ${isNikValidFormat ? (isTestedDukcapil ? "#059669" : "#3B82F6") : "#CBD5E1"}`,
                    fontSize: 13,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    outline: "none",
                    background: isTestedDukcapil ? "#F0FDF4" : "#FFFFFF",
                  }}
                />
                {isTestedDukcapil && (
                  <CheckCircle2
                    size={18}
                    color="#059669"
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}
                  />
                )}
              </div>
              {!isDigitOnly && cleanNik.length > 0 && (
                <div style={{ fontSize: 10.5, color: "#DC2626", marginTop: 3 }}>
                  ⚠️ NIK hanya boleh berisi angka (0-9).
                </div>
              )}
            </div>

            {/* Input Nama KTP */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 4 }}>
                Nama Lengkap Sesuai e-KTP Dukcapil <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="text"
                value={namaKTP}
                onChange={(e) => setNamaKTP(e.target.value)}
                placeholder="Masukkan nama resmi di KTP..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  fontSize: 12.5,
                  outline: "none",
                }}
              />
            </div>

            {/* Nomor Berita Acara / Nota Dinas Balasan dari Kepesertaan */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 4 }}>
                  No. Berita Acara / Memo Balasan <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  value={noBA}
                  onChange={(e) => setNoBA(e.target.value)}
                  placeholder="Contoh: BA-KEP/2026/089"
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    fontSize: 12,
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 4 }}>
                  Tanggal Berita Acara
                </label>
                <input
                  type="text"
                  readOnly
                  value="08 Juli 2026"
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: 6,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                    background: "#F8FAFC",
                    color: "#475569",
                  }}
                />
              </div>
            </div>

            {/* Catatan Verifikasi */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 4 }}>
                Catatan Petugas Perpajakan
              </label>
              <textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  fontSize: 11.5,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Upload Lampiran Simulasi */}
            <div
              style={{
                border: "1px dashed #CBD5E1",
                borderRadius: 6,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F8FAFC",
                fontSize: 11,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569" }}>
                <FileText size={14} color="#64748B" />
                <span>Lampiran: <strong>Scan_KTP_Verifikasi_{data.nrp}.pdf</strong> (Tersedia dari Divisi Kepesertaan)</span>
              </div>
              <span style={{ color: "#059669", fontWeight: 700 }}>● Terlampir</span>
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
          <Btn
            variant="outline"
            size="sm"
            onClick={handleTestDukcapil}
            disabled={!isNikValidFormat || isTesting}
          >
            {isTesting ? "Memverifikasi SIAK..." : isTestedDukcapil ? "✓ Tervalidasi Dukcapil" : "Uji Validitas Dukcapil & DJP"}
          </Btn>

          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" size="sm" onClick={onClose}>
              Batal
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              disabled={!isNikValidFormat}
              onClick={handleSave}
            >
              <CheckCircle2 size={14} /> Simpan &amp; Tuntaskan Tindak Lanjut
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};
