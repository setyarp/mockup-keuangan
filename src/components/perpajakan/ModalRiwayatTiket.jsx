import { X, Clock, CheckCircle2, AlertTriangle, FileText, Send, Building2, User } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Btn } from "../common/Btn";
import { Badge } from "../common/Badge";

export const ModalRiwayatTiket = ({ data, onClose, onOpenUpdateModal }) => {
  if (!data) return null;

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
          maxWidth: 600,
          maxHeight: "90vh",
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
              <Clock size={18} color={COLORS.blue} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                Riwayat Tiket &amp; Log Tindak Lanjut NIK
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>
                Tracking Komunikasi Divisi Keuangan (Pajak) ↔ Divisi Kepesertaan
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

        {/* Content */}
        <div style={{ padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Card Peserta Info */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              padding: 12,
              border: "1px solid #E2E8F0",
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>{data.nama}</div>
                <div style={{ color: "#64748B", fontSize: 11 }}>
                  {data.satker} ({data.unor}) • NOPENS: <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark }}>{data.nopens}</span>
                </div>
              </div>
              <Badge color={data.nikValid ? "green" : "red"}>
                {data.nikValid ? "NIK Valid" : data.statusNIK}
              </Badge>
            </div>
            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 6, fontSize: 11.5, color: "#334155" }}>
              <strong>Status Tindak Lanjut:</strong> {data.statusTindakLanjut} • <strong>No. ND:</strong> {data.noSuratPengantar}
            </div>
          </div>

          {/* Timeline Riwayat */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>
              Timeline Aktivitas Pemadanan
            </div>
            <div style={{ position: "relative", paddingLeft: 20 }}>
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: "#E2E8F0",
                }}
              />

              {data.riwayatLog?.map((log, idx) => (
                <div key={idx} style={{ position: "relative", marginBottom: 14 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: -20,
                      top: 2,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: idx === data.riwayatLog.length - 1 ? "#3B82F6" : "#94A3B8",
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 0 0 1px #CBD5E1",
                    }}
                  />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>
                    {log.tgl} • <span style={{ color: "#1D4ED8" }}>{log.petugas}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginTop: 1 }}>
                    {log.aksi}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#475569", marginTop: 2, background: "#F8FAFC", padding: "6px 10px", borderRadius: 6, border: "1px solid #F1F5F9" }}>
                    {log.catatan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
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
          <Btn variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Btn>
          {!data.nikValid && (
            <Btn
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                if (onOpenUpdateModal) onOpenUpdateModal(data);
              }}
            >
              <CheckCircle2 size={13} /> Input NIK Hasil Klarifikasi
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
};
