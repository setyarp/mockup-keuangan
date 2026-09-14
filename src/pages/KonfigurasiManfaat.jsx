import { useState } from "react";
import {
  TrendingUp,
  Scale,
  CheckCircle2,
  Save,
  Calculator,
  History,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Badge, Btn } from "../components/common";

export const KonfigurasiManfaat = () => {
  const [toastMessage, setToastMessage] = useState(null);

  // --- STATE PARAMETER SUKU BUNGA UTAMA ---
  const [biRate, setBiRate] = useState(6.25);
  const [graceDays, setGraceDays] = useState(14);
  const [basisTahun, setBasisTahun] = useState(365);
  const [noSK, setNoSK] = useState("KEP/DIR-KEU/014/ASABRI/2026");
  const [tglBerlaku, setTglBerlaku] = useState("01 Januari 2026");
  const [pejabatPenetap, setPejabatPenetap] = useState("Direktur Keuangan PT ASABRI (Persero)");

  // --- STATE SIMULASI KALKULATOR ---
  const [simulasiTagihan, setSimulasiTagihan] = useState(2500000000);
  const [simulasiHari, setSimulasiHari] = useState(15);

  // --- RIWAYAT PENETAPAN SUKU BUNGA ACUAN ---
  const [historyRateList, setHistoryRateList] = useState([
    {
      id: "RATE-2026-01",
      noSK: "KEP/DIR-KEU/014/ASABRI/2026",
      tglSK: "02 Januari 2026",
      periode: "01 Januari 2026 s.d. Sekarang",
      rate: 6.25,
      gracePeriod: 14,
      basis: 365,
      status: "Aktif",
      keterangan: "Penyesuaian BI-Rate hasil Rapat Dewan Gubernur (RDG) Bank Indonesia Q1 2026."
    },
    {
      id: "RATE-2025-02",
      noSK: "KEP/DIR-KEU/089/ASABRI/2025",
      tglSK: "01 Juli 2025",
      periode: "01 Juli 2025 s.d. 31 Desember 2025",
      rate: 6.00,
      gracePeriod: 14,
      basis: 365,
      status: "Arsip (Non-Aktif)",
      keterangan: "Penetapan Suku Bunga Semester II TA 2025."
    },
    {
      id: "RATE-2025-01",
      noSK: "KEP/DIR-KEU/002/ASABRI/2025",
      tglSK: "02 Januari 2025",
      periode: "01 Januari 2025 s.d. 30 Juni 2025",
      rate: 5.75,
      gracePeriod: 14,
      basis: 365,
      status: "Arsip (Non-Aktif)",
      keterangan: "Penetapan Suku Bunga Acuan Awal Tahun 2025."
    }
  ]);

  const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  // Perhitungan Denda Simulasi
  const rateHarian = biRate / 100 / basisTahun;
  const dendaVal = Math.round(simulasiTagihan * rateHarian * simulasiHari);
  const totalBayarDenda = simulasiTagihan + dendaVal;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveRate = (e) => {
    e.preventDefault();
    triggerToast(`Parameter Suku Bunga ${biRate}% p.a. berhasil diperbarui dan disimpan!`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1E293B",
            color: COLORS.white,
            padding: "12px 18px",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 1500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            borderLeft: `4px solid ${COLORS.green}`
          }}
        >
          <CheckCircle2 size={18} color={COLORS.green} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 12,
          padding: "20px 24px",
          border: `1px solid ${COLORS.gray200}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.blue
              }}
            >
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORS.gray900 }}>
                Parameter Suku Bunga
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: 12.5, color: COLORS.gray500 }}>
                Konfigurasi suku bunga acuan BI-Rate, masa tenggang jatuh tempo, dan formula perhitungan denda keterlambatan pembayaran imbal jasa & piutang.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 20,
              background: "#ECFDF5",
              color: "#065F46",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <ShieldCheck size={14} />
            Suku Bunga Aktif: {biRate}% p.a.
          </span>
        </div>
      </div>

      {/* GRID 2 KOLOM: FORM PENGATURAN + KALKULATOR SIMULASI */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
        {/* KOLOM 1: FORM PENGATURAN PARAMETER SUKU BUNGA */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: 12,
            padding: 24,
            border: `1px solid ${COLORS.gray200}`
          }}
        >
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 800,
              color: COLORS.gray900,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: `1px solid ${COLORS.gray100}`,
              paddingBottom: 12
            }}
          >
            <TrendingUp size={18} color={COLORS.blue} />
            <span>Pengaturan Suku Bunga Acuan & Denda</span>
          </div>

          <form onSubmit={handleSaveRate}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                    Suku Bunga Acuan BI-Rate (% p.a.) <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={biRate}
                    onChange={(e) => setBiRate(parseFloat(e.target.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 14,
                      fontWeight: 700,
                      color: COLORS.blueDark,
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                    Acuan suku bunga Bank Indonesia tahun berjalan
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                    Masa Tenggang / Jatuh Tempo (Hari) <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={graceDays}
                    onChange={(e) => setGraceDays(parseInt(e.target.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 14,
                      fontWeight: 700,
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                    Hari kerja sejak surat tagihan terbit
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                    Basis Hari Kalender per Tahun <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <select
                    value={basisTahun}
                    onChange={(e) => setBasisTahun(parseInt(e.target.value) || 365)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 13,
                      fontWeight: 600,
                      background: COLORS.white,
                      boxSizing: "border-box"
                    }}
                  >
                    <option value={365}>365 Hari (Standar Kalender Masehi)</option>
                    <option value={360}>360 Hari (Standar Perbankan / Pasar Uang)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                    Tanggal Berlaku Efektif <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tglBerlaku}
                    onChange={(e) => setTglBerlaku(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 13,
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                  Dasar Hukum / Nomor SK Penetapan Direksi <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={noSK}
                  onChange={(e) => setNoSK(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    fontFamily: "monospace",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                  Pejabat Penandatangan Penetapan
                </label>
                <input
                  type="text"
                  value={pejabatPenetap}
                  onChange={(e) => setPejabatPenetap(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* BOX FORMULA RESMI */}
              <div
                style={{
                  background: "#F8FAFC",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.gray200}`,
                  fontSize: 12
                }}
              >
                <div style={{ fontWeight: 700, color: COLORS.gray800, marginBottom: 4 }}>
                  Rumus Baku Perhitungan Denda Keterlambatan:
                </div>
                <div style={{ fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 700, fontSize: 12.5 }}>
                  Denda = (Nominal Tagihan × {biRate}% × Hari Keterlambatan) ÷ {basisTahun}
                </div>
                <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                  Suku bunga harian ekuivalen: {(rateHarian * 100).toFixed(6)}% per hari kalender.
                </div>
              </div>

              <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end" }}>
                <Btn variant="primary" type="submit" style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                  <Save size={15} />
                  Simpan Parameter Suku Bunga
                </Btn>
              </div>
            </div>
          </form>
        </div>

        {/* KOLOM 2: SIMULASI KALKULATOR PERHITUNGAN SUKU BUNGA & DENDA */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: 12,
            padding: 24,
            border: `1px solid ${COLORS.gray200}`,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 800,
              color: COLORS.gray900,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: `1px solid ${COLORS.gray100}`,
              paddingBottom: 12
            }}
          >
            <Calculator size={18} color="#059669" />
            <span>Simulasi Perhitungan Suku Bunga & Denda</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                Nominal Pokok Tagihan / Piutang (Rp)
              </label>
              <input
                type="number"
                step="10000000"
                value={simulasiTagihan}
                onChange={(e) => setSimulasiTagihan(parseFloat(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: "monospace",
                  boxSizing: "border-box"
                }}
              />
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 4 }}>
                Terbilang: {fmt(simulasiTagihan)}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, display: "block", marginBottom: 5 }}>
                Jumlah Hari Keterlambatan Pembayaran
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="number"
                  min="0"
                  value={simulasiHari}
                  onChange={(e) => setSimulasiHari(parseInt(e.target.value) || 0)}
                  style={{
                    width: 120,
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 14,
                    fontWeight: 800,
                    boxSizing: "border-box"
                  }}
                />
                <span style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Hari Kalender</span>
              </div>
            </div>

            {/* HASIL BREAKDOWN SIMULASI */}
            <div
              style={{
                background: "#F8FAFC",
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${COLORS.gray200}`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 12.5,
                marginTop: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Suku Bunga Acuan BI-Rate:</span>
                <span style={{ fontWeight: 700 }}>{biRate}% p.a.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Tarif Bunga per Hari:</span>
                <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{(rateHarian * 100).toFixed(6)}% / hari</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Pokok Tagihan:</span>
                <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{fmt(simulasiTagihan)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#B45309" }}>
                <span style={{ fontWeight: 700 }}>Denda Keterlambatan ({simulasiHari} hari):</span>
                <span style={{ fontWeight: 800, fontFamily: "monospace", fontSize: 13 }}>+{fmt(dendaVal)}</span>
              </div>

              <div
                style={{
                  borderTop: `2px solid ${COLORS.gray300}`,
                  paddingTop: 10,
                  marginTop: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  color: COLORS.blueDark
                }}
              >
                <span style={{ fontSize: 13 }}>Total Wajib Dibayar:</span>
                <span style={{ fontFamily: "monospace", fontSize: 15 }}>{fmt(totalBayarDenda)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIWAYAT PENETAPAN SUKU BUNGA ACUAN (AUDIT TRAIL) */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 12,
          padding: "20px 24px",
          border: `1px solid ${COLORS.gray200}`
        }}
      >
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 800,
            color: COLORS.gray900,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <History size={18} color={COLORS.gray600} />
          <span>Riwayat Penetapan Parameter Suku Bunga (Audit Trail)</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Nomor SK Direksi</th>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Periode Efektif</th>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>BI-Rate (% p.a.)</th>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Masa Tenggang</th>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Basis Hari</th>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status</th>
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Keterangan / Dasar RDG</th>
              </tr>
            </thead>
            <tbody>
              {historyRateList.map((item) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900 }}>
                    {item.noSK}
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2, fontFamily: "sans-serif" }}>
                      Tgl Penetapan: {item.tglSK}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: COLORS.gray800 }}>
                    {item.periode}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: item.status === "Aktif" ? COLORS.blueDark : COLORS.gray700 }}>
                    {item.rate.toFixed(2)}%
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600 }}>
                    {item.gracePeriod} Hari
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 600 }}>
                    {item.basis} Hari
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: item.status === "Aktif" ? "#ECFDF5" : "#F1F5F9",
                        color: item.status === "Aktif" ? "#065F46" : COLORS.gray600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      {item.status === "Aktif" && <CheckCircle2 size={12} color="#059669" />}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11.5, color: COLORS.gray600 }}>
                    {item.keterangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
