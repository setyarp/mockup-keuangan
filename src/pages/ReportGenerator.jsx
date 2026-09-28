import { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Info,
  Printer,
  X,
  ChevronDown
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Table, Tooltip } from "../components/common";
import { BRD_REPORTS_DATA } from "../data/brdReportsData";

export const ReportGenerator = () => {
  const [selectedReportId, setSelectedReportId] = useState(BRD_REPORTS_DATA[0].id);
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  
  // Sub-view tab state (for reports with multiple sub-tables like Imbal Jasa, CMS, BPJS)
  const [activeSubView, setActiveSubView] = useState("");
  
  // Modal state for Export & Preview
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;

  // Current active report
  const activeReport = useMemo(() => {
    return BRD_REPORTS_DATA.find((r) => r.id === selectedReportId) || BRD_REPORTS_DATA[0];
  }, [selectedReportId]);

  // Determine subview
  const currentSubView = useMemo(() => {
    if (activeReport.hasSubViews && activeReport.subViewOptions?.length > 0) {
      if (activeSubView && (activeSubView === activeReport.subViewOptions[0].id || activeReport.variantData?.[activeSubView])) {
        return activeSubView;
      }
      return activeReport.subViewOptions[0].id;
    }
    return "";
  }, [activeReport, activeSubView]);

  // Determine current active columns & rows (supporting subviews)
  const { currentColumns, currentRows } = useMemo(() => {
    if (activeReport.hasSubViews && currentSubView && activeReport.variantData?.[currentSubView]) {
      return {
        currentColumns: activeReport.variantData[currentSubView].columns,
        currentRows: activeReport.variantData[currentSubView].rows
      };
    }
    return {
      currentColumns: activeReport.columns,
      currentRows: activeReport.rows
    };
  }, [activeReport, currentSubView]);

  const handleDownload = (format) => {
    const cleanTitle = activeReport.title.replace(/[^a-zA-Z0-9]/g, "_");
    const subTag = currentSubView ? `_${currentSubView}` : "";
    const fileName = `${cleanTitle}${subTag}_${tglAwal}_${tglAkhir}.${format.toLowerCase()}`;
    
    // Simulate real file download in browser
    const csvContent = "data:text/csv;charset=utf-8," + 
      [currentColumns.join(","), ...currentRows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Laporan "${activeReport.title}" berhasil di-unduh (${fileName})`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const tooltipInfo = (
    <div style={{ maxWidth: 280, fontSize: 11.5, lineHeight: 1.45 }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: "#93C5FD" }}>
        {activeReport.title}
      </div>
      <div style={{ marginBottom: 4 }}>{activeReport.desc}</div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 4, marginTop: 4, fontSize: 10.5, opacity: 0.85 }}>
        <div>• Frekuensi: {activeReport.frekuensi}</div>
        <div>• Pengguna: {activeReport.pengguna}</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0F172A",
            color: COLORS.white,
            padding: "12px 18px",
            borderRadius: 8,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 2500,
            fontSize: 12.5,
            fontWeight: 600,
            borderLeft: `4px solid ${COLORS.green}`
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Filter Section: Pilih Laporan, Tanggal Awal, Tanggal Akhir, Button Eksport */}
      {/* ========================================================================= */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: "16px 20px",
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 3px rgba(15,23,42,0.04)"
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          {/* 1. Pilih Laporan */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 700 }}>
                Pilih Laporan
              </label>
              <Tooltip content={tooltipInfo} position="bottom">
                <span style={{ cursor: "pointer", display: "inline-flex", color: COLORS.blue }}>
                  <Info size={14} />
                </span>
              </Tooltip>
            </div>
            <select
              value={activeReport.id}
              onChange={(e) => {
                setSelectedReportId(e.target.value);
                setActiveSubView("");
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12.5,
                fontWeight: 600,
                color: COLORS.gray900,
                background: COLORS.white,
                outline: "none"
              }}
            >
              {BRD_REPORTS_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Tanggal Awal */}
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 6, fontWeight: 600 }}>
              Tanggal Awal
            </label>
            <input
              type="date"
              value={tglAwal}
              onChange={(e) => setTglAwal(e.target.value)}
              style={{
                padding: "7px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white
              }}
            />
          </div>

          {/* 3. Tanggal Akhir */}
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 6, fontWeight: 600 }}>
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={tglAkhir}
              onChange={(e) => setTglAkhir(e.target.value)}
              style={{
                padding: "7px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white
              }}
            />
          </div>

          {/* Button Eksport */}
          <div>
            <button
              onClick={() => setExportModalOpen(true)}
              style={{
                padding: "8px 18px",
                borderRadius: 6,
                border: "none",
                background: "#1E40AF",
                color: COLORS.white,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 1px 3px rgba(30,64,175,0.3)",
                height: 35
              }}
            >
              <Download size={15} />
              <span>Eksport</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Table Section (No top cards, strictly table)                              */}
      {/* ========================================================================= */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: 20,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}
      >
        {/* Table Title Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.gray900 }}>
              {activeReport.title}
            </h3>
            <Tooltip content={tooltipInfo} position="right">
              <span style={{ cursor: "pointer", color: COLORS.gray400, display: "inline-flex" }}>
                <Info size={15} />
              </span>
            </Tooltip>
          </div>

          <div style={{ fontSize: 12, color: COLORS.gray500 }}>
            Periode: <strong>{filterPeriode}</strong>
          </div>
        </div>

        {/* Sub-view switcher for multi-variant reports (Imbal Jasa, CMS, BPJS) */}
        {activeReport.hasSubViews && activeReport.subViewOptions && (
          <div
            style={{
              display: "flex",
              gap: 6,
              borderBottom: `1px solid ${COLORS.gray200}`,
              paddingBottom: 8,
              overflowX: "auto"
            }}
          >
            {activeReport.subViewOptions.map((sub) => {
              const isSubActive = currentSubView === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubView(sub.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 5,
                    border: isSubActive ? `1px solid ${COLORS.blue}` : `1px solid ${COLORS.gray200}`,
                    background: isSubActive ? "#EFF6FF" : COLORS.white,
                    color: isSubActive ? "#1D4ED8" : COLORS.gray600,
                    fontSize: 11.5,
                    fontWeight: isSubActive ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={currentColumns}
            data={currentRows.map((row) =>
              row.map((cell) => {
                const strCell = String(cell);
                if (strCell.startsWith("Rp") || strCell.startsWith("+Rp") || strCell.startsWith("-Rp")) {
                  return (
                    <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {cell}
                    </span>
                  );
                }
                return cell;
              })
            )}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Export & Document Preview Modal                                           */}
      {/* ========================================================================= */}
      {exportModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 24
          }}
          onClick={() => setExportModalOpen(false)}
        >
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              width: "100%",
              maxWidth: 960,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: COLORS.gray50,
                borderRadius: "12px 12px 0 0"
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                  Pratinjau & Ekspor Laporan
                </h4>
                <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                  {activeReport.title} • Periode {filterPeriode}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => handleDownload("XLSX")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: "#166534",
                    color: COLORS.white,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <FileSpreadsheet size={14} /> Excel (XLSX)
                </button>

                <button
                  onClick={() => handleDownload("PDF")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: "#BE123C",
                    color: COLORS.white,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <FileText size={14} /> PDF
                </button>

                <button
                  onClick={() => window.print()}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    background: COLORS.white,
                    color: COLORS.gray800,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <Printer size={14} /> Cetak
                </button>

                <button
                  onClick={() => setExportModalOpen(false)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: COLORS.gray200,
                    color: COLORS.gray700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body Preview Document */}
            <div style={{ padding: 32, background: COLORS.white }}>
              {/* Formal Header */}
              <div style={{ textAlign: "center", borderBottom: "2px solid #0F172A", paddingBottom: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#1E3A8A" }}>
                  PT ASABRI (PERSERO)
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", textTransform: "uppercase", marginTop: 2 }}>
                  DIVISI KEUANGAN
                </div>
                <div style={{ fontSize: 10, color: COLORS.gray500, marginTop: 4 }}>
                  Jl. Mayjen Sutoyo No. 11, Cilitan, Jakarta Timur 13640
                </div>
              </div>

              {/* Title & Period */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", color: COLORS.gray900 }}>
                  {activeReport.title}
                </div>
                <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 3 }}>
                  Periode: {filterPeriode}
                </div>
              </div>

              {/* Table Data */}
              <div style={{ overflowX: "auto", marginBottom: 24 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9" }}>
                      {currentColumns.map((col, idx) => (
                        <th
                          key={idx}
                          style={{
                            border: "1px solid #CBD5E1",
                            padding: "7px 10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#334155"
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            style={{
                              border: "1px solid #E2E8F0",
                              padding: "7px 10px",
                              color: "#1E293B",
                              fontFamily: String(cell).startsWith("Rp") ? "monospace" : "inherit"
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, padding: "0 20px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: COLORS.gray600 }}>Mengetahui,</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray900, marginTop: 4 }}>
                    Kepala Bidang
                  </div>
                  <div style={{ height: 45 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1px solid #334155", display: "inline-block" }}>
                    Dra. Sri Wahyuni, M.Ak.
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: COLORS.gray600 }}>Jakarta, 06 Juli 2026</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.gray900, marginTop: 4 }}>
                    Kepala Divisi Keuangan
                  </div>
                  <div style={{ height: 45 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1px solid #334155", display: "inline-block" }}>
                    Kolonel Cku Hendra Setiawan, S.E., M.M.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
