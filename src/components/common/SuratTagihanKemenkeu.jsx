import { useState } from "react";
import { Printer, Download, Copy, Check, FileText, Layers, Eye, ShieldCheck } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { Btn } from "./Btn";

// Helper terbilang bahasa Indonesia resmi
export function terbilang(angka) {
  if (isNaN(angka) || angka === null || angka === undefined) return "";
  angka = Math.floor(Math.abs(Number(angka)));
  if (angka === 0) return "nol rupiah";

  const huruf = [
    "", "satu", "dua", "tiga", "empat", "lima",
    "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
  ];

  function convert(n) {
    if (n < 12) {
      return huruf[n];
    } else if (n < 20) {
      return convert(n - 10) + " belas";
    } else if (n < 100) {
      return convert(Math.floor(n / 10)) + " puluh " + convert(n % 10);
    } else if (n < 200) {
      return "seratus " + convert(n - 100);
    } else if (n < 1000) {
      return convert(Math.floor(n / 100)) + " ratus " + convert(n % 100);
    } else if (n < 2000) {
      return "seribu " + convert(n - 1000);
    } else if (n < 1000000) {
      return convert(Math.floor(n / 1000)) + " ribu " + convert(n % 1000);
    } else if (n < 1000000000) {
      return convert(Math.floor(n / 1000000)) + " juta " + convert(n % 1000000);
    } else if (n < 1000000000000) {
      return convert(Math.floor(n / 1000000000)) + " miliar " + convert(n % 1000000000);
    } else if (n < 1000000000000000) {
      return convert(Math.floor(n / 1000000000000)) + " triliun " + convert(n % 1000000000000);
    }
    return "";
  }

  return (convert(angka).trim().replace(/\s+/g, " ") + " rupiah").toLowerCase();
}

// Logo Resmi ASABRI SVG Vector
export const AsabriLogoHeader = ({ height = 48 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <svg width={height * 1.15} height={height} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 6 L100 24 L100 58 C100 82 60 96 60 96 C60 96 20 82 20 58 L20 24 Z" fill="#0B3C68" stroke="#1D4ED8" strokeWidth="2.5" />
      <path d="M60 14 L92 28 L92 56 C92 76 60 88 60 88 C60 88 28 76 28 56 L28 28 Z" fill="#0E4E8A" />
      <path d="M60 22 L65 38 L82 38 L68 49 L74 65 L60 55 L46 65 L52 49 L38 38 L55 38 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      <circle cx="60" cy="46" r="6" fill="#FFFFFF" />
      <path d="M36 50 C36 68 60 78 60 78" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <path d="M84 50 C84 68 60 78 60 78" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2, color: "#0B3C68", fontFamily: "'Arial Black', sans-serif", lineHeight: 1 }}>
        ASABRI
      </span>
      <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 1, color: "#3B82F6", marginTop: 2 }}>
        PT ASABRI (PERSERO)
      </span>
    </div>
  </div>
);

// Stempel & Tanda Tangan Resmi Direksi ASABRI (Replikasi Presisi Sesuai Dokumen Resmi)
export const AsabriOfficialStampAndSignature = ({
  nama = "HELMI I. SATRIYONO",
  jabatan = "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO"
}) => (
  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", minWidth: 260, position: "relative" }}>
    <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 8, color: "#0F172A", alignSelf: "center" }}>
      DIREKSI,
    </div>

    {/* Area Tumpang-Tindih Stempel Ungu & Tanda Tangan Tinta Biru */}
    <div style={{ position: "relative", width: 220, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 1. Stempel Bulat Keunguan ASABRI */}
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 2,
          opacity: 0.85,
          transform: "rotate(-6deg)",
          pointerEvents: "none"
        }}
      >
        <svg width="96" height="96" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill="none" stroke="#6D28D9" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#6D28D9" strokeWidth="1.2" strokeDasharray="3 1.5" />
          <circle cx="60" cy="60" r="38" fill="none" stroke="#6D28D9" strokeWidth="1.5" />
          <path id="stamp-arc-top-c" d="M 18,60 A 42,42 0 1,1 102,60" fill="none" />
          <text fill="#6D28D9" fontSize="8" fontWeight="900" letterSpacing="2.2" fontFamily="sans-serif">
            <textPath href="#stamp-arc-top-c" startOffset="50%" textAnchor="middle">
              PT ASABRI (PERSERO)
            </textPath>
          </text>
          <g transform="translate(45, 38) scale(0.25)">
            <path d="M60 6 L100 24 L100 58 C100 82 60 96 60 96 C60 96 20 82 20 58 L20 24 Z" fill="none" stroke="#6D28D9" strokeWidth="6" />
            <polygon points="60,26 66,42 83,42 69,53 74,69 60,59 46,69 51,53 37,42 54,42" fill="#6D28D9" />
          </g>
          <rect x="22" y="66" width="76" height="15" rx="2.5" fill="#6D28D9" opacity="0.92" />
          <text x="60" y="77" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2.5" fontFamily="sans-serif">
            DIREKSI
          </text>
        </svg>
      </div>

      {/* 2. Tanda Tangan Tinta Biru Otentik */}
      <div style={{ position: "absolute", left: 30, top: 6, zIndex: 3, pointerEvents: "none" }}>
        <svg width="165" height="80" viewBox="0 0 170 85" fill="none">
          <path
            d="M18 64 C24 44, 30 18, 40 16 C48 14, 44 48, 50 54 C56 59, 70 24, 80 20 C90 17, 76 56, 86 50 C96 44, 116 26, 130 30 C138 32, 124 58, 140 46 C150 40, 162 28, 166 33"
            stroke="#1D4ED8"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 48 Q 58 40 158 44"
            stroke="#1D4ED8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 68 Q 22 62 28 72"
            stroke="#1D4ED8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="164" cy="45" r="2.5" fill="#1D4ED8" />
        </svg>
      </div>
    </div>

    {/* Nama & Jabatan Pejabat */}
    <div style={{ fontWeight: 800, fontSize: 13, textDecoration: "none", color: "#0F172A", marginTop: 4, letterSpacing: 0.5 }}>
      {nama}
    </div>
    <div style={{ fontWeight: 700, fontSize: 11.5, color: "#0F172A" }}>
      {jabatan}
    </div>
  </div>
);

// Footer Paraf Kedinasan (Opsional untuk Lembar Internal / Minuta)
export const ParafFooterBox = ({ sesper = "Cikik J.", kadivKeu = "Widya D.S.", kabidBend = "Dita M." }) => (
  <div style={{ display: "inline-block", border: "1px solid #1E293B", fontSize: 10, background: "#FFFFFF", fontFamily: "'Times New Roman', serif" }}>
    <table style={{ borderCollapse: "collapse", textAlign: "center", minWidth: 260 }}>
      <thead>
        <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #1E293B" }}>
          <th style={{ padding: "2px 8px", borderRight: "1px solid #1E293B", fontWeight: 700 }}>Sesper</th>
          <th style={{ padding: "2px 8px", borderRight: "1px solid #1E293B", fontWeight: 700 }}>Kadiv Keu</th>
          <th style={{ padding: "2px 8px", fontWeight: 700 }}>Kabid Bend</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "4px 8px", borderRight: "1px solid #1E293B", fontSize: 9.5, color: "#334155" }}>{sesper}</td>
          <td style={{ padding: "4px 8px", borderRight: "1px solid #1E293B", fontSize: 9.5, color: "#334155" }}>{kadivKeu}</td>
          <td style={{ padding: "4px 8px", fontSize: 9.5, color: "#334155" }}>{kabidBend}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Footer Kop Bawah Resmi & Ornamen Pojok Kanan Bawah
export const AsabriLetterFooter = () => (
  <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #CBD5E1", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
    <div style={{ fontSize: 9.5, color: "#475569", lineHeight: 1.45, fontFamily: "'Times New Roman', serif" }}>
      <div style={{ fontWeight: 700, color: "#0F172A" }}>PT ASABRI (Persero)</div>
      <div>Jl. Mayjen Sutoyo No.11 Jakarta 13630</div>
      <div>P : 021 8094140 &nbsp;&nbsp;|&nbsp;&nbsp; F : 021 8012313</div>
      <div style={{ color: "#0284C7" }}>asabri@asabri.co.id &nbsp;&nbsp;|&nbsp;&nbsp; www.asabri.co.id</div>
    </div>

    {/* Graphic Ribbon Bottom-Right Accent (Persis Sesuai PDF Surat Tagihan ASABRI) */}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginBottom: -4 }}>
      <div style={{ width: 0, height: 0, borderBottom: "36px solid #D97706", borderLeft: "26px solid transparent" }} />
      <div style={{ width: 0, height: 0, borderBottom: "52px solid #0284C7", borderLeft: "34px solid transparent" }} />
    </div>
  </div>
);

export const SuratTagihanKemenkeu = ({
  data = {},
  onClose,
  showActions = true
}) => {
  // Pilihan Tampilan Halaman: "all" (2 Halaman Surat Lengkap) | 1 (Halaman 1) | 2 (Halaman 2) | 3 (Halaman 3: Kuitansi)
  const [activePage, setActivePage] = useState("all");
  const [showParafInternal, setShowParafInternal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parsing parameter data penagihan
  const program = data.program || "Pensiun TNI"; // "Pensiun TNI" | "THT TNI" | "Pensiun POLRI" | "THT POLRI"
  const isTHT = program.startsWith("THT");
  const isPolri = program.includes("POLRI");
  const tarif = isTHT ? "3,25%" : "4,75%";
  const akunMAK = data.akunMAK || (isTHT ? "821134" : "821135");

  // Nama Hal & Program Sesuai Dokumen Resmi PDF
  const halProgram = data.halProgram || (isTHT
    ? (isPolri ? "THT POLRI" : "THT TNI")
    : (isPolri ? "Pensiun POLRI" : "Dapen TNI"));

  const namaProgramFull = data.namaProgramFull || (isTHT
    ? (isPolri ? "Dana THT POLRI" : "Dana THT TNI")
    : (isPolri ? "Dana Pensiun POLRI" : "Dana Pensiun TNI"));

  const noSurat = data.noSurat || (isTHT
    ? (isPolri ? "S-1157/KU.06.06/KMR.N/V/2026" : "S-1155/KU.06.06/KMR.N/V/2026")
    : (isPolri ? "S-1158/KU.06.06/KMR.N/V/2026" : "S-1156/KU.06.06/KMR.N/V/2026"));

  const tanggalSurat = data.tanggalSurat || data.tanggal || "12 Mei 2026";
  const tglCutoff = data.tglCutoff || "10 Mei 2026";
  const noKEP = data.noKEP || "KEP-16/PB/PB.3/2026";
  const tglKEP = data.tglKEP || "11 Mei 2026";
  const tahunAnggaran = data.tahunAnggaran || data.ta || "2026";

  // Nominal Tagihan Sesuai PDF (Rp3.002.772.913,00)
  const nominalIniNum = Number(data.nominalNum || data.nominalIni || (isTHT ? 2055120400 : 3002772913));
  const nominalLaluNum = Number(data.nominalLalu || (isTHT ? 284150320000 : 414729482733));
  const nominalTotalNum = nominalLaluNum + nominalIniNum;

  // Format Rupiah Resmi Kemenkeu: Rp3.002.772.913,00 (tanpa spasi setelah Rp, dengan desimal ,00)
  const fmtRupiah = (n) => `Rp${Number(n || 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const nominalIniStr = data.nominalStr || fmtRupiah(nominalIniNum);
  const nominalLaluStr = fmtRupiah(nominalLaluNum);
  const nominalTotalStr = fmtRupiah(nominalTotalNum);

  const terbilangStr = data.terbilang || `(${terbilang(nominalIniNum)})`;

  // Info Rekening Penampung Sesuai Dokumen Resmi PDF
  const namaRekening = data.namaRekening || (isTHT
    ? (isPolri ? "THT POLRI ASABRI" : "THT TNI ASABRI")
    : (isPolri ? "Dapen POLRI ASABRI" : "Dapen TNI ASABRI"));

  const noRekening = data.noRekening || (isTHT
    ? (isPolri ? "0261-01-000005-30-5" : "0261-01-000004-30-9")
    : (isPolri ? "0261-01-000629-30-3" : "0261-01-000628-30-7"));

  const namaBank = data.namaBank || "BRI Kantor Cabang Jakarta Krekot";

  // Nomor Bukti Kuitansi (Page 3)
  const noBukti = data.noBukti || (isTHT
    ? (isPolri ? "22/PFK.THT-POLRI/V/2026-Keu" : "21/PFK.THT-AS/V/2026-Keu")
    : (isPolri ? "23/PFK.PEN-POLRI/V/2026-Keu" : "24/PFK.PEN-TNI/V/2026-Keu"));

  // Pejabat Penandatangan Resmi (Sesuai PDF: HELMI I. SATRIYONO)
  const namaDirektur = data.namaPejabat || data.namaDirektur || "HELMI I. SATRIYONO";
  const jabatanDirektur = data.jabatan || data.jabatanDirektur || "DIREKTUR KEUANGAN DAN MANAJEMEN RISIKO";
  const namaPPK = data.namaPPK || "Nazif Azhari";

  const handleCopyNoSurat = () => {
    navigator.clipboard.writeText(noSurat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const el = document.getElementById("surat-kemenkeu-printable-area");
    if (!el) {
      window.print();
      return;
    }
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Surat Tagihan Iuran ${program} - ${noSurat}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; background: #fff; margin: 0; padding: 20px; color: #0F172A; }
    .page-break { page-break-after: always; break-after: page; margin-bottom: 40px; }
    table { border-collapse: collapse; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; break-after: page; }
    }
  </style>
</head>
<body>
  ${el.innerHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Surat_Tagihan_${program.replace(/[^a-zA-Z0-9]/g, "_")}_${noSurat.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top Action Bar & Page Switcher */}
      {showActions && (
        <div
          className="no-print"
          style={{
            padding: "12px 18px",
            background: "#F8FAFC",
            borderBottom: `1px solid ${COLORS.gray200}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            borderRadius: "8px 8px 0 0"
          }}
        >
          {/* Page Navigation Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700, marginRight: 6 }}>
              Tampilan Dokumen:
            </span>
            <button
              onClick={() => setActivePage("all")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${activePage === "all" ? COLORS.blue : COLORS.gray300}`,
                background: activePage === "all" ? "#EFF6FF" : COLORS.white,
                color: activePage === "all" ? COLORS.blueDark : COLORS.gray700,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <Layers size={13} /> Dokumen Lengkap (2 Hal Surat + Kuitansi)
            </button>
            <button
              onClick={() => setActivePage(1)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${activePage === 1 ? COLORS.blue : COLORS.gray300}`,
                background: activePage === 1 ? "#EFF6FF" : COLORS.white,
                color: activePage === 1 ? COLORS.blueDark : COLORS.gray700,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Hal 1 (Surat Pengantar)
            </button>
            <button
              onClick={() => setActivePage(2)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${activePage === 2 ? COLORS.blue : COLORS.gray300}`,
                background: activePage === 2 ? "#EFF6FF" : COLORS.white,
                color: activePage === 2 ? COLORS.blueDark : COLORS.gray700,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Hal 2 (Rincian & TTD Direksi)
            </button>
            <button
              onClick={() => setActivePage(3)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${activePage === 3 ? COLORS.blue : COLORS.gray300}`,
                background: activePage === 3 ? "#EFF6FF" : COLORS.white,
                color: activePage === 3 ? COLORS.blueDark : COLORS.gray700,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Hal 3 (Kuitansi / Lampiran 5.a)
            </button>
          </div>

          {/* Action Buttons & Paraf Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11.5,
                color: COLORS.gray700,
                cursor: "pointer",
                marginRight: 6,
                userSelect: "none"
              }}
              title="Centang untuk menampilkan kotak paraf kedinasan (minuta internal)"
            >
              <input
                type="checkbox"
                checked={showParafInternal}
                onChange={(e) => setShowParafInternal(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <span>Paraf Minuta</span>
            </label>

            <button
              onClick={handleCopyNoSurat}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                background: COLORS.white,
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.gray700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
              title="Salin Nomor Surat Resmi"
            >
              {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
              {copied ? "Tersalin!" : "Salin No. Surat"}
            </button>
            <Btn size="sm" variant="outline" onClick={handlePrint} style={{ gap: 5 }}>
              <Printer size={13} /> Cetak / Simpan PDF
            </Btn>
            <Btn size="sm" onClick={handleDownloadHTML} style={{ gap: 5, background: COLORS.blue }}>
              <Download size={13} /> Unduh Berkas
            </Btn>
          </div>
        </div>
      )}

      {/* Dokumen Canvas Container (A4 Proportional Pages) */}
      <div
        id="surat-kemenkeu-printable-area"
        className="printable-container"
        style={{
          padding: 24,
          background: "#64748B",
          overflowY: "auto",
          maxHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24
        }}
      >
        {/* =====================================================================
            HALAMAN 1: SURAT PERMINTAAN PEMBAYARAN DANA PFK (SURAT PENGANTAR)
            Persis Sesuai SuratTagihan_PensiunTNI.pdf Halaman 1
           ===================================================================== */}
        {(activePage === "all" || activePage === 1) && (
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              minHeight: 1120,
              background: "#FFFFFF",
              padding: "48px 56px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              boxSizing: "border-box",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 12.5,
              lineHeight: 1.45,
              color: "#0F172A",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >
            {/* Header: Logo ASABRI di Kiri Atas */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <AsabriLogoHeader height={44} />
            </div>

            {/* Metadata Surat: Kiri (Nomor, Sifat, Lampiran, Hal) & Kanan (Tanggal Surat) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: "66%" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.5 }}>
                  <tbody>
                    <tr>
                      <td style={{ width: 80, verticalAlign: "top", paddingBottom: 2 }}>Nomor</td>
                      <td style={{ width: 15, verticalAlign: "top", paddingBottom: 2 }}>:</td>
                      <td style={{ verticalAlign: "top", fontWeight: 700, paddingBottom: 2 }}>{noSurat}</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top", paddingBottom: 2 }}>Sifat</td>
                      <td style={{ verticalAlign: "top", paddingBottom: 2 }}>:</td>
                      <td style={{ verticalAlign: "top", paddingBottom: 2 }}>Biasa</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top", paddingBottom: 2 }}>Lampiran</td>
                      <td style={{ verticalAlign: "top", paddingBottom: 2 }}>:</td>
                      <td style={{ verticalAlign: "top", paddingBottom: 2 }}>2 (dua) berkas</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: "top" }}>Hal</td>
                      <td style={{ verticalAlign: "top" }}>:</td>
                      <td style={{ verticalAlign: "top", fontWeight: 700, textAlign: "justify" }}>
                        {data.perihal || `Tagihan/Permintaan Pembayaran Dana PFK ${tarif} untuk ${halProgram} s.d. Tanggal ${tglCutoff}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tanggal Surat Sejajar dengan Nomor di Pojok Kanan */}
              <div style={{ width: "30%", textAlign: "right" }}>
                <div style={{ fontSize: 12.5, color: "#0F172A" }}>{tanggalSurat}</div>
              </div>
            </div>

            {/* Alamat Tujuan Surat (Kemenkeu Satker 440780) */}
            <div style={{ marginBottom: 20, lineHeight: 1.45, fontSize: 12.5 }}>
              <div>Yth. Kuasa Pengguna Anggaran</div>
              <div style={{ fontWeight: 700 }}>Satker (440780)</div>
              <div>Pengembalian Penerimaan Perhitungan Fihak Ketiga (PFK)</div>
              <div>Subdit Pembayaran Program Jaminan Sosial, PFK dan Kebijakan TGR</div>
              <div>Direktorat Sistem Perbendaharaan</div>
              <div style={{ fontWeight: 700 }}>Kementerian Keuangan RI</div>
              <div>u.p. Pejabat Pembuat Komitmen</div>
              <div>Gedung Prijadi Praptosuhardjo IIIA Lantai 4</div>
              <div>Jalan Budi Utomo Nomor 6</div>
              <div>Jakarta - 10710</div>
            </div>

            {/* Dasar Hukum (Konsideran) */}
            <div style={{ marginBottom: 16, textAlign: "justify", fontSize: 12.5 }}>
              <div style={{ marginBottom: 4 }}>Berdasarkan:</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ minWidth: 16 }}>1.</span>
                <div>
                  Peraturan Menteri Keuangan RI Nomor 156/PMK.05/2019 tanggal 5 November 2019 tentang Dana Perhitungan Fihak Ketiga sebagaimana telah diubah dengan Peraturan Menteri Keuangan Nomor 212/PMK.05/2020 tanggal 23 Desember 2020;
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ minWidth: 16 }}>2.</span>
                <div>
                  Keputusan Direktur Jenderal Perbendaharaan Nomor {noKEP} tanggal {tglKEP} tentang Pembayaran Dana Perhitungan Fihak Ketiga Kepada PT TASPEN (Persero), PT ASABRI (Persero), Badan Penyelenggara Jaminan Sosial (BPJS) Kesehatan, dan Perum Bulog Berdasarkan Realisasi Penerimaan PFK sampai dengan Tanggal {tglCutoff}.
                </div>
              </div>
            </div>

            {/* Isi Pengajuan Tagihan */}
            <div style={{ marginBottom: 18, textAlign: "justify", fontSize: 12.5 }}>
              <div style={{ marginBottom: 6 }}>
                Dengan ini kami mengajukan tagihan/permintaan pembayaran Dana Perhitungan Fihak Ketiga (PFK) sebagai berikut:
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ minWidth: 16 }}>1.</span>
                <div style={{ display: "flex", flex: 1 }}>
                  <span style={{ width: 150 }}>Dasar Pembayaran</span>
                  <span style={{ width: 15 }}>:</span>
                  <span style={{ flex: 1 }}>Keputusan Dirjen Perbendaharaan sebagaimana disebutkan sebagai dasar pada angka 2 di atas.</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ minWidth: 16 }}>2.</span>
                <div style={{ display: "flex", flex: 1 }}>
                  <span style={{ width: 150 }}>Tahun Anggaran</span>
                  <span style={{ width: 15 }}>:</span>
                  <span style={{ flex: 1, fontWeight: 700 }}>{tahunAnggaran}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ minWidth: 16 }}>3.</span>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 4 }}>Rincian Penerima</div>
                  <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.5, marginLeft: 14 }}>
                    <tbody>
                      <tr>
                        <td style={{ width: 22, verticalAlign: "top", paddingBottom: 3 }}>a.</td>
                        <td style={{ width: 140, verticalAlign: "top", paddingBottom: 3 }}>Jumlah Uang</td>
                        <td style={{ width: 15, verticalAlign: "top", paddingBottom: 3 }}>:</td>
                        <td style={{ verticalAlign: "top", fontWeight: 700, paddingBottom: 3 }}>{nominalIniStr}</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>b.</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>Uraian Pembayaran</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>:</td>
                        <td style={{ verticalAlign: "top", textAlign: "justify", paddingBottom: 3 }}>
                          {data.uraian || `Pembayaran Dana Perhitungan Fihak Ketiga (PFK) ${tarif} Gaji untuk ${namaProgramFull} berdasarkan realisasi penerimaan PFK sampai dengan tanggal ${tglCutoff}.`}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>c.</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>Nama</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>:</td>
                        <td style={{ verticalAlign: "top", fontWeight: 700, paddingBottom: 3 }}>PT ASABRI (Persero)</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>d.</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>Alamat</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>:</td>
                        <td style={{ verticalAlign: "top", paddingBottom: 3 }}>Jalan Mayjen Sutoyo Nomor 11 Jakarta Timur</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: "top" }}>e.</td>
                        <td style={{ verticalAlign: "top" }}>NPWP</td>
                        <td style={{ verticalAlign: "top" }}>:</td>
                        <td style={{ verticalAlign: "top", fontFamily: "monospace" }}>001.000.513.0-093.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Paraf (Hanya jika dicentang) & Footer Kop Alamat */}
            <div style={{ marginTop: "auto" }}>
              {showParafInternal && (
                <div style={{ marginBottom: 12 }}>
                  <ParafFooterBox />
                </div>
              )}
              <AsabriLetterFooter />
            </div>
          </div>
        )}

        {/* =====================================================================
            HALAMAN 2: RINCIAN PERHITUNGAN AKUN & TANDA TANGAN DIREKSI
            Persis Sesuai SuratTagihan_PensiunTNI.pdf Halaman 2
           ===================================================================== */}
        {(activePage === "all" || activePage === 2) && (
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              minHeight: 1120,
              background: "#FFFFFF",
              padding: "48px 56px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              boxSizing: "border-box",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 12.5,
              lineHeight: 1.45,
              color: "#0F172A",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >
            {/* Nomor Halaman 2 di Tengah Atas */}
            <div style={{ textAlign: "center", fontSize: 12.5, marginBottom: 20, color: "#0F172A" }}>
              2
            </div>

            {/* Poin 4: Rincian Perhitungan dan Rekening Penerima */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ minWidth: 16 }}>4.</span>
                <span>Rincian Perhitungan dan Rekening Penerima:</span>
              </div>

              {/* Tabel Akun 5 Kolom Persis Sesuai PDF */}
              <div style={{ marginLeft: 26, marginBottom: 18 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000000", fontSize: 11.5, textAlign: "center" }}>
                  <thead>
                    <tr style={{ background: "#FFFFFF", borderBottom: "1px solid #000000" }}>
                      <th style={{ border: "1px solid #000000", padding: "6px 8px", width: 42 }}>No</th>
                      <th style={{ border: "1px solid #000000", padding: "6px 8px", width: 75 }}>Akun</th>
                      <th style={{ border: "1px solid #000000", padding: "6px 8px" }}>Jumlah Tagihan<br />s.d. Yang Lalu</th>
                      <th style={{ border: "1px solid #000000", padding: "6px 8px" }}>Jumlah<br />Tagihan ini</th>
                      <th style={{ border: "1px solid #000000", padding: "6px 8px" }}>Jumlah<br />s.d. Tagihan ini</th>
                    </tr>
                    <tr style={{ background: "#FFFFFF", fontSize: 10.5, borderBottom: "1px solid #000000" }}>
                      <th style={{ border: "1px solid #000000", padding: "3px" }}>(1)</th>
                      <th style={{ border: "1px solid #000000", padding: "3px" }}>(2)</th>
                      <th style={{ border: "1px solid #000000", padding: "3px" }}>(3)</th>
                      <th style={{ border: "1px solid #000000", padding: "3px" }}>(4)</th>
                      <th style={{ border: "1px solid #000000", padding: "3px" }}>(5) = (3)+(4)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #000000", padding: "9px 6px" }}>1</td>
                      <td style={{ border: "1px solid #000000", padding: "9px 6px", fontFamily: "monospace", fontSize: 12 }}>{akunMAK}</td>
                      <td style={{ border: "1px solid #000000", padding: "9px 8px", textAlign: "right" }}>{nominalLaluStr}</td>
                      <td style={{ border: "1px solid #000000", padding: "9px 8px", textAlign: "right" }}>{nominalIniStr}</td>
                      <td style={{ border: "1px solid #000000", padding: "9px 8px", textAlign: "right" }}>{nominalTotalStr}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rekening Tujuan Transfer */}
              <div style={{ marginLeft: 26, marginBottom: 18, lineHeight: 1.5 }}>
                <div style={{ marginBottom: 4 }}>Jumlah tagihan tersebut agar ditransfer ke rekening:</div>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.5 }}>
                  <tbody>
                    <tr>
                      <td style={{ width: 22 }}>a.</td>
                      <td style={{ width: 140 }}>Nama Rekening</td>
                      <td style={{ width: 15 }}>:</td>
                      <td style={{ fontWeight: 700 }}>{namaRekening}</td>
                    </tr>
                    <tr>
                      <td>b.</td>
                      <td>Nomor Rekening</td>
                      <td>:</td>
                      <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{noRekening}</td>
                    </tr>
                    <tr>
                      <td>c.</td>
                      <td>Nama Bank</td>
                      <td>:</td>
                      <td>{namaBank}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Poin 5: Lampiran */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ minWidth: 16 }}>5.</span>
                <span>Lampiran:</span>
              </div>
              <div style={{ marginLeft: 26, textAlign: "justify" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ minWidth: 16 }}>a.</span>
                  <div>Kuitansi/Bukti Pembayaran;</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ minWidth: 16 }}>b.</span>
                  <div>
                    Copy Keputusan Direktur Jenderal Perbendaharaan Nomor {noKEP} tanggal {tglKEP} tentang Pembayaran Dana Perhitungan Fihak Ketiga Kepada PT TASPEN (Persero), PT ASABRI (Persero), Badan Penyelenggara Jaminan Sosial (BPJS) Kesehatan, dan Perum Bulog Berdasarkan Realisasi Penerimaan PFK sampai dengan Tanggal {tglCutoff}.
                  </div>
                </div>
              </div>
            </div>

            {/* Penutup Surat */}
            <div style={{ marginBottom: 30, textAlign: "justify" }}>
              Demikian kami sampaikan. Atas perhatian dan kerja sama Saudara, kami mengucapkan terima kasih.
            </div>

            {/* Area Tanda Tangan Direksi ASABRI dengan Stempel Ungu & Tanda Tangan Tinta Biru */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
              <AsabriOfficialStampAndSignature nama={namaDirektur} jabatan={jabatanDirektur} />
            </div>

            {/* Tembusan di Kiri Bawah */}
            <div style={{ fontSize: 11.5, marginBottom: 20 }}>
              <div style={{ fontWeight: 700 }}>Tembusan:</div>
              <div>Direksi PT ASABRI (Persero).</div>
            </div>

            {/* Footer Paraf (Hanya jika dicentang) & Footer Kop Alamat */}
            <div style={{ marginTop: "auto" }}>
              {showParafInternal && (
                <div style={{ marginBottom: 12 }}>
                  <ParafFooterBox />
                </div>
              )}
              <AsabriLetterFooter />
            </div>
          </div>
        )}

        {/* =====================================================================
            HALAMAN 3: LAMPIRAN KUITANSI / BUKTI PEMBAYARAN RESMI KEMENKEU
            (Lampiran 5.a Sesuai Poin 5 di Surat Tagihan)
           ===================================================================== */}
        {(activePage === "all" || activePage === 3) && (
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              minHeight: 1120,
              background: "#FFFFFF",
              padding: "48px 56px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              boxSizing: "border-box",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 12.5,
              lineHeight: 1.45,
              color: "#0F172A",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >
            {/* Kop Lampiran di Pojok Kanan Atas */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ fontSize: 12 }}>
                3
              </div>
              <div style={{ width: "65%", textAlign: "left", fontSize: 9.5, lineHeight: 1.3, fontWeight: 700 }}>
                <div>LAMPIRAN</div>
                <div>SURAT DIREKSI PT ASABRI (PERSERO)</div>
                <div>NOMOR : {noSurat}</div>
                <div>HAL : {(data.perihal || `TAGIHAN/PERMINTAAN PEMBAYARAN DANA PFK ${tarif} UNTUK ${halProgram} S.D. TANGGAL ${tglCutoff}`).toUpperCase()}</div>
              </div>
            </div>

            {/* Logo ASABRI & Metadata Bukti Pembayaran */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #000000", paddingTop: 14, marginBottom: 18 }}>
              <AsabriLogoHeader height={40} />
              <div style={{ textAlign: "right", fontSize: 12 }}>
                <div>TA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {tahunAnggaran}</div>
                <div style={{ fontWeight: 700 }}>Nomor Bukti : {noBukti}</div>
              </div>
            </div>

            {/* Judul Kuitansi */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 800, textDecoration: "underline", letterSpacing: 0.5 }}>
                KUITANSI/BUKTI PEMBAYARAN
              </div>
            </div>

            {/* Isi Form Kuitansi Resmi */}
            <div style={{ marginBottom: 30, lineHeight: 1.5 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <tbody>
                  <tr>
                    <td style={{ width: 140, verticalAlign: "top", padding: "6px 0" }}>Sudah terima dari</td>
                    <td style={{ width: 20, verticalAlign: "top", padding: "6px 0" }}>:</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>
                      <div style={{ fontWeight: 700 }}>Pejabat Pembuat Komitmen</div>
                      <div>Satker (440780) Pengembalian Penerimaan Perhitungan Fihak Ketiga (PFK)</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>Jumlah Uang</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>:</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0", fontWeight: 800, fontSize: 13.5 }}>
                      {nominalIniStr}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>Terbilang</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>:</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0", fontStyle: "italic" }}>
                      {terbilangStr}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>Untuk pembayaran</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0" }}>:</td>
                    <td style={{ verticalAlign: "top", padding: "6px 0", textAlign: "justify" }}>
                      Pembayaran Dana Perhitungan Fihak Ketiga (PFK) {tarif} Gaji untuk {namaProgramFull} berdasarkan realisasi penerimaan sampai dengan Tanggal {tglCutoff}.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Kolom Tanda Tangan Ganda (PPK Kemenkeu & Direksi ASABRI) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 20, marginBottom: 24 }}>
              {/* Kiri: Persetujuan PPK Kemenkeu */}
              <div style={{ textAlign: "center" }}>
                <div>Menyetujui,</div>
                <div>a.n. Kuasa Pengguna Anggaran</div>
                <div style={{ fontWeight: 700, marginBottom: 54 }}>Pejabat Pembuat Komitmen</div>
                <div style={{ fontWeight: 700, textDecoration: "underline" }}>
                  {namaPPK}
                </div>
              </div>

              {/* Kanan: Direksi PT ASABRI */}
              <div style={{ textAlign: "center" }}>
                <div>Jakarta, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tanggalSurat}</div>
                <div style={{ fontWeight: 700, marginBottom: 54 }}>DIREKSI</div>
                <div style={{ fontWeight: 700, textDecoration: "underline" }}>
                  {namaDirektur}
                </div>
                <div style={{ fontWeight: 700, fontSize: 11.5 }}>
                  {jabatanDirektur}
                </div>
              </div>
            </div>

            {/* Footer Paraf */}
            <div style={{ marginTop: "auto" }}>
              {showParafInternal && <ParafFooterBox />}
              <AsabriLetterFooter />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
