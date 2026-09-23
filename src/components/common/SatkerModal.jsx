import { useState, useMemo } from "react";
import { Building2, Search, Download, Printer, CheckCircle2, X } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Badge } from "./Badge";
import { Btn } from "./Btn";

export const SatkerModal = ({ data, onClose }) => {
  if (!data) return null;

  const {
    noSurat = "1190/KU.06.06/KMR.N/IX/2026",
    noSKP = "S-184/PB.2/2026",
    periode = "September 2026",
    program = "THT TNI",
    danaType,
    satkerList = []
  } = data;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMatra, setFilterMatra] = useState("Semua");

  const fmtB = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const fmtNum = (n) => Number(n || 0).toLocaleString("id-ID");

  const isTHTOnly = danaType === "THT_TNI" || danaType === "THT_POLRI" || (program?.includes("THT") && !program?.includes("Pensiun"));
  const isPensiunOnly = danaType === "PENSIUN_TNI" || danaType === "PENSIUN_POLRI" || (program?.includes("Pensiun") && !program?.includes("THT"));
  const isSpecificDana = isTHTOnly || isPensiunOnly;
  const activeTarif = isTHTOnly ? "3,25%" : isPensiunOnly ? "4,75%" : "8,00%";

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
        (s.satker && s.satker.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.unor && s.unor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.kode && s.kode.toLowerCase().includes(searchTerm.toLowerCase()));
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
        acc.total += Number(s.total || (isTHTOnly ? s.danaTHT : isPensiunOnly ? s.danaPensiun : 0) || 0);
        return acc;
      },
      { peserta: 0, gajiPokok: 0, danaTHT: 0, danaPensiun: 0, total: 0 }
    );
  }, [filteredList, isTHTOnly, isPensiunOnly]);

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
                {isSpecificDana
                  ? `Rincian Alokasi ${program || (isTHTOnly ? "Dana THT (3,25%)" : "Dana Pensiun (4,75%)")} Per-Unor / Satker`
                  : "Rincian Alokasi Dana THT & Pensiun Per-Unor / Satker"}
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
              background: isSpecificDana
                ? isTHTOnly
                  ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
                  : "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
                : "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
              border: `1px solid ${isSpecificDana ? (isTHTOnly ? "#BFDBFE" : "#A7F3D0") : "#BFDBFE"}`,
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
              <div style={{ fontSize: 12.5, color: isTHTOnly ? "#1E3A8A" : "#065F46", lineHeight: 1.5 }}>
                {isSpecificDana ? (
                  <span>
                    <strong>Surat Tagihan Terpisah Per-Dana ({program}):</strong> Iuran <strong>{isTHTOnly ? "THT (3,25%)" : "Pensiun (4,75%)"}</strong> ditagihkan tersendiri melalui nomor surat resmi ke Ditjen Perbendaharaan Kemenkeu RI, dengan rincian alokasi per Satker kedinasan di bawah ini.
                  </span>
                ) : (
                  <span>
                    <strong>Surat Tagihan Terpadu (1 Tagihan Bersama):</strong> Iuran <strong>THT (3,25%)</strong> dan <strong>Pensiun (4,75%)</strong> ditagihkan secara simultan dalam 1 Surat Tagihan resmi ke Kemenkeu RI, dengan rincian alokasi per Satuan Kerja (Satker) kedinasan di bawah ini.
                  </span>
                )}
              </div>
            </div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                background: isTHTOnly ? "#DBEAFE" : "#D1FAE5",
                color: isTHTOnly ? "#1E40AF" : "#065F46",
                padding: "4px 10px",
                borderRadius: 20,
                whiteSpace: "nowrap"
              }}
            >
              Tarif Potongan: {activeTarif} Gaji Pokok
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
                Total Nominal Surat Tagihan
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: isTHTOnly ? "#1D4ED8" : isPensiunOnly ? "#15803D" : COLORS.blueDark, fontFamily: "monospace", marginTop: 4 }}>
                {fmtB(isTHTOnly ? (totals.danaTHT || totals.total) : isPensiunOnly ? (totals.danaPensiun || totals.total) : totals.total)}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                {isSpecificDana ? `Tarif ${activeTarif} Gaji Pokok` : "Gabungan THT & Pensiun"}
              </div>
            </div>

            {(!isSpecificDana || isTHTOnly) && (
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
                  {fmtB(totals.danaTHT || totals.total)}
                </div>
                <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                  Porsi Tabungan Hari Tua
                </div>
              </div>
            )}

            {(!isSpecificDana || isPensiunOnly) && (
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
                  {fmtB(totals.danaPensiun || totals.total)}
                </div>
                <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                  Porsi Dana Pensiun (DAPEN)
                </div>
              </div>
            )}

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
                Unor / Satker & Personel Tercover
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.gray900, fontFamily: "monospace", marginTop: 4 }}>
                {fmtNum(filteredList.length)} <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray500 }}>Unor</span>
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
                  placeholder="Cari Unor, Satker atau Kode..."
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
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Kode & Unor / Satuan Kerja</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}` }}>Matra</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Personel</th>
                    {(!isSpecificDana || isTHTOnly) && (
                      <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Dana THT (3,25%)</th>
                    )}
                    {(!isSpecificDana || isPensiunOnly) && (
                      <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Dana Pensiun (4,75%)</th>
                    )}
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Total Satker (Rp)</th>
                    <th style={{ padding: "9px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={isSpecificDana ? 7 : 8} style={{ padding: 24, textAlign: "center", color: COLORS.gray500 }}>
                        Tidak ditemukan data Satker pada filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((s, idx) => {
                      const satkerNominal = isTHTOnly ? (s.danaTHT || s.total) : isPensiunOnly ? (s.danaPensiun || s.total) : s.total;
                      return (
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
                          {(!isSpecificDana || isTHTOnly) && (
                            <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1D4ED8" }}>
                              {fmtB(s.danaTHT || (isTHTOnly ? s.total : 0))}
                            </td>
                          )}
                          {(!isSpecificDana || isPensiunOnly) && (
                            <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#15803D" }}>
                              {fmtB(s.danaPensiun || (isPensiunOnly ? s.total : 0))}
                            </td>
                          )}
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, background: "#F8FAFC" }}>
                            {fmtB(satkerNominal)}
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "center" }}>
                            <Badge variant="success">
                              <CheckCircle2 size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />
                              Match
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
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
                    {(!isSpecificDana || isTHTOnly) && (
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8" }}>
                        {fmtB(totals.danaTHT || totals.total)}
                      </td>
                    )}
                    {(!isSpecificDana || isPensiunOnly) && (
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#15803D" }}>
                        {fmtB(totals.danaPensiun || totals.total)}
                      </td>
                    )}
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
            Menampilkan <strong>{filteredList.length}</strong> dari <strong>{satkerList.length}</strong> Unit Organisasi (Unor)
          </div>
          <Btn variant="primary" onClick={onClose}>
            Tutup Rincian
          </Btn>
        </div>
      </div>
    </div>
  );
};
