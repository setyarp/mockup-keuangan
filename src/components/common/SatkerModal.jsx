import { useState, useMemo } from "react";
import { Building2, Search, Download, Printer, CheckCircle2, X } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Badge } from "./Badge";
import { Btn } from "./Btn";

export const SatkerModal = ({ data, onClose }) => {
  if (!data) return null;

  const {
    noSurat = "001/ASABRI/TGH-THT-PEN/VII/2026",
    noSKP = "S-184/PB.2/2026",
    periode = "Juli 2026",
    program = "THT & Pensiun (1 Tagihan)",
    satkerList = []
  } = data;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMatra, setFilterMatra] = useState("Semua");

  const fmtB = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const fmtNum = (n) => Number(n || 0).toLocaleString("id-ID");

  // Matra options
  const matraOptions = useMemo(() => {
    const set = new Set(satkerList.map((s) => s.matra));
    return ["Semua", ...Array.from(set)];
  }, [satkerList]);

  // Filtered Satker List
  const filteredList = useMemo(() => {
    return satkerList.filter((s) => {
      const matchMatra = filterMatra === "Semua" || s.matra === filterMatra;
      const matchSearch =
        !searchTerm ||
        s.satker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.kode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchMatra && matchSearch;
    });
  }, [satkerList, filterMatra, searchTerm]);

  // Total summary of filtered
  const totals = useMemo(() => {
    return filteredList.reduce(
      (acc, s) => {
        acc.peserta += Number(s.peserta || 0);
        acc.gajiPokok += Number(s.gajiPokok || 0);
        acc.danaTHT += Number(s.danaTHT || 0);
        acc.danaPensiun += Number(s.danaPensiun || 0);
        acc.total += Number(s.total || 0);
        return acc;
      },
      { peserta: 0, gajiPokok: 0, danaTHT: 0, danaPensiun: 0, total: 0 }
    );
  }, [filteredList]);

  const handleExport = () => {
    alert(`Mengunduh berkas Excel Rincian Satker (${noSurat}) format XLSX...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
        backdropFilter: "blur(3px)"
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: 14,
          width: 1080,
          maxWidth: "96vw",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          border: `1px solid ${COLORS.gray200}`,
          overflow: "hidden"
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${COLORS.gray200}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #BFDBFE"
              }}
            >
              <Building2 size={22} color={COLORS.blue} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                Rincian Alokasi Dana THT & Pensiun Per-Satuan Kerja (Satker)
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                <span>No. Tagihan: <strong style={{ fontFamily: "monospace", color: COLORS.blueDark }}>{noSurat}</strong></span>
                <span>•</span>
                <span>Dasar SKP: <strong style={{ color: COLORS.gray700 }}>{noSKP}</strong></span>
                <span>•</span>
                <span>Periode: <strong>{periode}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: 6,
              cursor: "pointer",
              color: COLORS.gray400,
              borderRadius: 6
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* Banner Penjelasan Bisnis */}
          <div
            style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
              border: "1px solid #BFDBFE",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>📌</span>
              <div style={{ fontSize: 12.5, color: "#1E3A8A", lineHeight: 1.5 }}>
                <strong>Surat Tagihan Terpadu (1 Tagihan Bersama):</strong> Iuran <strong>THT (3,25%)</strong> dan <strong>Pensiun (4,75%)</strong> ditagihkan secara simultan dalam 1 Surat Tagihan resmi ke Kemenkeu RI, dengan rincian alokasi per Satuan Kerja (Satker) kedinasan di bawah ini.
              </div>
            </div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                background: "#DBEAFE",
                color: "#1E40AF",
                padding: "4px 10px",
                borderRadius: 20,
                whiteSpace: "nowrap"
              }}
            >
              Total Potongan: 8,00% Gaji Pokok
            </span>
          </div>

          {/* KPI Mini Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
              marginBottom: 20
            }}
          >
            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.gray200}`,
                borderRadius: 10,
                padding: "12px 16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: "uppercase" }}>
                Total 1 Tagihan Terpadu
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.blueDark, fontFamily: "monospace", marginTop: 4 }}>
                {fmtB(totals.total)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                Gabungan THT & Pensiun
              </div>
            </div>

            <div
              style={{
                background: COLORS.white,
                border: `1px solid #BFDBFE`,
                borderRadius: 10,
                padding: "12px 16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF", textTransform: "uppercase" }}>
                Alokasi Dana THT (3,25%)
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1D4ED8", fontFamily: "monospace", marginTop: 4 }}>
                {fmtB(totals.danaTHT)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                Porsi Tabungan Hari Tua
              </div>
            </div>

            <div
              style={{
                background: COLORS.white,
                border: `1px solid #BBF7D0`,
                borderRadius: 10,
                padding: "12px 16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>
                Alokasi Dana Pensiun (4,75%)
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#15803D", fontFamily: "monospace", marginTop: 4 }}>
                {fmtB(totals.danaPensiun)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                Porsi Dana Pensiun (DAPEN)
              </div>
            </div>

            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.gray200}`,
                borderRadius: 10,
                padding: "12px 16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray500, textTransform: "uppercase" }}>
                Satker & Personel Tercover
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.gray900, fontFamily: "monospace", marginTop: 4 }}>
                {fmtNum(filteredList.length)} <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray500 }}>Satker</span>
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                Total {fmtNum(totals.peserta)} Personel
              </div>
            </div>
          </div>

          {/* Toolbar: Search & Filter Matra */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              gap: 12,
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 260 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#F8FAFC",
                  border: `1px solid ${COLORS.gray300}`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  gap: 8,
                  flex: 1
                }}
              >
                <Search size={15} color={COLORS.gray400} />
                <input
                  type="text"
                  placeholder="Cari Satker atau Kode Satker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: 12,
                    width: "100%",
                    color: COLORS.gray800
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{ border: "none", background: "none", cursor: "pointer", color: COLORS.gray400, fontSize: 12 }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={filterMatra}
                onChange={(e) => setFilterMatra(e.target.value)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.gray700,
                  background: COLORS.white,
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                {matraOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    Matra: {opt}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn size="sm" variant="outline" icon={Printer} onClick={handlePrint}>
                Cetak Rincian
              </Btn>
              <Btn size="sm" variant="outline" icon={Download} onClick={handleExport}>
                Ekspor Excel
              </Btn>
            </div>
          </div>

          {/* Data Table */}
          <div
            style={{
              border: `1px solid ${COLORS.gray200}`,
              borderRadius: 8,
              overflow: "hidden",
              background: COLORS.white
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: COLORS.gray600, textAlign: "left" }}>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, width: 40 }}>No</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Kode & Satker Kedinasan</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Personel</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Dana THT (3,25%)</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Dana Pensiun (4,75%)</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Total Satker (Rp)</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                        Tidak ditemukan data Satker pada filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((s, idx) => (
                      <tr key={s.kode || idx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "9px 12px", color: COLORS.gray500, fontFamily: "monospace" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          <div style={{ fontWeight: 700, color: COLORS.gray900 }}>{s.satker}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500, fontFamily: "monospace" }}>
                            Kode Satker: {s.kode}
                          </div>
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              background: "#F1F5F9",
                              color: COLORS.gray700,
                              padding: "2px 8px",
                              borderRadius: 4
                            }}
                          >
                            {s.matra}
                          </span>
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.gray800 }}>
                          {fmtNum(s.peserta)}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1D4ED8" }}>
                          {fmtB(s.danaTHT)}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#15803D" }}>
                          {fmtB(s.danaPensiun)}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, background: "#F8FAFC" }}>
                          {fmtB(s.total)}
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "center" }}>
                          <Badge variant="success">
                            <CheckCircle2 size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />
                            Match
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F1F5F9", fontWeight: 800, borderTop: `2px solid ${COLORS.gray300}` }}>
                    <td colSpan={3} style={{ padding: "10px 12px", textAlign: "right", color: COLORS.gray800 }}>
                      TOTAL KESELURUHAN:
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.gray900 }}>
                      {fmtNum(totals.peserta)}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8" }}>
                      {fmtB(totals.danaTHT)}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#15803D" }}>
                      {fmtB(totals.danaPensiun)}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.blueDark, background: "#E2E8F0" }}>
                      {fmtB(totals.total)}
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      <Badge variant="success">100% Valid</Badge>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: `1px solid ${COLORS.gray200}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC"
          }}
        >
          <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
            Menampilkan <strong>{filteredList.length}</strong> dari <strong>{satkerList.length}</strong> Satuan Kerja
          </div>
          <Btn variant="primary" onClick={onClose}>
            Tutup Rincian
          </Btn>
        </div>
      </div>
    </div>
  );
};
