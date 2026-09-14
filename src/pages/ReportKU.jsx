import { useState, useMemo } from "react";
import {
  Calendar,
  Search,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// =============================================================================
// SUB-KOMPONEN: Rekapitulasi3ExpectedGroupBlock
// Menangani perenderan tabel matriks 24 baris per kelompok pensiun dengan
// rowSpan & colSpan 6 baris per jenis pensiun secara presisi (Excel-Exact)
// =============================================================================
export const Rekapitulasi3ExpectedGroupBlock = ({
  group,
  isGrandTotal = false,
  fmt,
  fmtJiwa
}) => {
  // Border hitam 1px solid sesuai standar baku kedinasan ASABRI
  const cellStyle = {
    border: "1px solid #000000",
    padding: "3px 5px",
    fontSize: "10px",
    fontFamily: "Arial, sans-serif",
    verticalAlign: "middle",
    backgroundColor: isGrandTotal ? "#e0f2fe" : "#ffffff",
    color: "#000000"
  };

  const cellSubtotalStyle = {
    ...cellStyle,
    backgroundColor: isGrandTotal ? "#bae6fd" : "#f8fafc",
    fontWeight: "bold"
  };

  return (
    <>
      {group.jenisList.map((jenis, jIdx) => {
        const isFirstJenis = jIdx === 0;

        return (
          <tbody key={jenis.id || jIdx}>
            {/* -------------------------------------------------------------
                BARIS 1: A. Penerima | A. Pensiun Pokok | Potongan & Netto (rowSpan 6)
               ------------------------------------------------------------- */}
            <tr>
              {/* Kolom 1 (NO) & Kolom 2 (KELOMPOK PENSIUN) hanya di-render pada jenis pensiun pertama dengan rowSpan={24} */}
              {isFirstJenis && (
                <td
                  rowSpan={24}
                  style={{
                    ...cellStyle,
                    textAlign: "center",
                    fontWeight: "bold",
                    verticalAlign: "middle"
                  }}
                >
                  {group.no}
                </td>
              )}
              {isFirstJenis && (
                <td
                  rowSpan={24}
                  style={{
                    ...cellStyle,
                    fontWeight: "bold",
                    verticalAlign: "middle",
                    padding: "4px 8px"
                  }}
                >
                  {group.namaKelompok}
                </td>
              )}

              {/* Kolom 3: JENIS PENSIUN (rowSpan 6) */}
              <td
                rowSpan={6}
                style={{
                  ...cellStyle,
                  fontWeight: isGrandTotal ? "bold" : "normal",
                  verticalAlign: "middle",
                  padding: "4px 6px"
                }}
              >
                {jenis.nama}
              </td>

              {/* Kolom 4: JUMLAH JIWA — Baris 1: A. Penerima */}
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmtJiwa(jenis.jiwa.penerima)}
              </td>

              {/* Kolom 5: JUMLAH BRUTO — Baris 1: A. Pensiun Pokok */}
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.bruto.pensiunPokok)}
              </td>

              {/* Kolom 6 s.d 11: POTONGAN (PPh21, Askes, TGR, Non-TGR, Lain-lain, Total) — rowSpan 6 */}
              <td rowSpan={6} style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.potongan.pph21)}
              </td>
              <td rowSpan={6} style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.potongan.askes)}
              </td>
              <td rowSpan={6} style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.potongan.tgr)}
              </td>
              <td rowSpan={6} style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.potongan.nonTgr)}
              </td>
              <td rowSpan={6} style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.potongan.lainLain)}
              </td>
              <td
                rowSpan={6}
                style={{
                  ...cellStyle,
                  textAlign: "right",
                  fontWeight: "bold"
                }}
              >
                {fmt(jenis.potongan.total)}
              </td>

              {/* Kolom 12: JUMLAH NETTO — rowSpan 6 */}
              <td
                rowSpan={6}
                style={{
                  ...cellStyle,
                  textAlign: "right",
                  fontWeight: "bold",
                  color: isGrandTotal ? "#0369a1" : "#000000"
                }}
              >
                {fmt(jenis.netto)}
              </td>
            </tr>

            {/* -------------------------------------------------------------
                BARIS 2: B. Istri / Suami | B. Tunjangan Keluarga
               ------------------------------------------------------------- */}
            <tr>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmtJiwa(jenis.jiwa.istriSuami)}
              </td>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.bruto.tunjKeluarga)}
              </td>
            </tr>

            {/* -------------------------------------------------------------
                BARIS 3: C. Anak | C. Tunjangan Beras
               ------------------------------------------------------------- */}
            <tr>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmtJiwa(jenis.jiwa.anak)}
              </td>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.bruto.tunjBeras)}
              </td>
            </tr>

            {/* -------------------------------------------------------------
                BARIS 4: D. (Cacat) | D. Cacat Lain-lain
               ------------------------------------------------------------- */}
            <tr>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmtJiwa(jenis.jiwa.cacat)}
              </td>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.bruto.cacatLain)}
              </td>
            </tr>

            {/* -------------------------------------------------------------
                BARIS 5: E. Lain-lain Jiwa | E. Lain-lain Bruto
               ------------------------------------------------------------- */}
            <tr>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmtJiwa(jenis.jiwa.lainLain || 0)}
              </td>
              <td style={{ ...cellStyle, textAlign: "right" }}>
                {fmt(jenis.bruto.lainLain)}
              </td>
            </tr>

            {/* -------------------------------------------------------------
                BARIS 6: Subtotal Jiwa | Subtotal Bruto
               ------------------------------------------------------------- */}
            <tr>
              <td style={{ ...cellSubtotalStyle, textAlign: "right" }}>
                {fmtJiwa(jenis.jiwa.total)}
              </td>
              <td style={{ ...cellSubtotalStyle, textAlign: "right" }}>
                {fmt(jenis.bruto.total)}
              </td>
            </tr>
          </tbody>
        );
      })}
    </>
  );
};

// =============================================================================
// KOMPONEN UTAMA: ReportKU
// =============================================================================
export const ReportKU = () => {
  // State Filter Parameter
  const [cetakKU, setCetakKU] = useState("DAFTAR REKAPITULASI III NON DAPEM");
  const [periodeAwal, setPeriodeAwal] = useState("2026-07-01");
  const [periodeAkhir, setPeriodeAkhir] = useState("2026-07-31");
  const [mitraBayar, setMitraBayar] = useState("Semua Mitra");
  const [cabang, setCabang] = useState("2000 - KANCAB UTAMA JAKARTA");
  const [jumlah, setJumlah] = useState("Semua Jumlah");
  const [jenisBayar, setJenisBayar] = useState("Semua Jenis Bayar");

  // State Accordion & Modal Preview
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Helper Formatter Angka
  const fmt = (num) => (num || 0).toLocaleString("id-ID");
  const fmtJiwa = (num) => (num || 0).toLocaleString("id-ID");

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  // Trigger Toast Notifikasi
  const triggerToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // ===========================================================================
  // DATASET REALISTIS: 4 KELOMPOK PENSIUN RESMI ASABRI / KEMENKEU
  // ===========================================================================
  const rawGroupsData = [
    // 1. PENS PNS KEMHAN (513113)
    {
      no: "1",
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN ( 513113 )",
      jenisList: [
        {
          id: "kemhan_sendiri",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 1110, istriSuami: 310, anak: 170, cacat: 0, lainLain: 0, total: 1590 },
          bruto: { pensiunPokok: 6980570000, tunjKeluarga: 265330000, tunjBeras: 215270000, cacatLain: 0, lainLain: 342880000, total: 7804050000 },
          potongan: { pph21: 346622000, askes: 44753000, tgr: 0, nonTgr: 22911000, lainLain: 0, total: 414286000 },
          netto: 7389764000
        },
        {
          id: "kemhan_warakawuri",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 395, istriSuami: 51, anak: 34, cacat: 0, lainLain: 0, total: 480 },
          bruto: { pensiunPokok: 2074000610, tunjKeluarga: 53066477, tunjBeras: 63999140, cacatLain: 0, lainLain: 101939853, total: 2293006080 },
          potongan: { pph21: 101850000, askes: 13340000, tgr: 0, nonTgr: 7120000, lainLain: 0, total: 122310000 },
          netto: 2170696080
        },
        {
          id: "kemhan_yatim",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 65, istriSuami: 0, anak: 65, cacat: 0, lainLain: 0, total: 65 },
          bruto: { pensiunPokok: 260000000, tunjKeluarga: 0, tunjBeras: 12500000, cacatLain: 0, lainLain: 5000000, total: 277500000 },
          potongan: { pph21: 0, askes: 1500000, tgr: 0, nonTgr: 0, lainLain: 0, total: 1500000 },
          netto: 276000000
        },
        {
          id: "kemhan_ortu",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 12, istriSuami: 0, anak: 0, cacat: 0, lainLain: 0, total: 12 },
          bruto: { pensiunPokok: 48000000, tunjKeluarga: 0, tunjBeras: 2400000, cacatLain: 0, lainLain: 0, total: 50400000 },
          potongan: { pph21: 0, askes: 300000, tgr: 0, nonTgr: 0, lainLain: 0, total: 300000 },
          netto: 50100000
        }
      ]
    },

    // 2. PENS PNS POLRI (513114)
    {
      no: "2",
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI ( 513114 )",
      jenisList: [
        {
          id: "pnspolri_sendiri",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 540, istriSuami: 180, anak: 95, cacat: 0, lainLain: 0, total: 815 },
          bruto: { pensiunPokok: 3410000000, tunjKeluarga: 130000000, tunjBeras: 110000000, cacatLain: 0, lainLain: 170000000, total: 3820000000 },
          potongan: { pph21: 170000000, askes: 22000000, tgr: 0, nonTgr: 11500000, lainLain: 0, total: 203500000 },
          netto: 3616500000
        },
        {
          id: "pnspolri_warakawuri",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 190, istriSuami: 25, anak: 18, cacat: 0, lainLain: 0, total: 233 },
          bruto: { pensiunPokok: 980000000, tunjKeluarga: 26000000, tunjBeras: 31000000, cacatLain: 0, lainLain: 49000000, total: 1086000000 },
          potongan: { pph21: 48000000, askes: 6500000, tgr: 0, nonTgr: 3500000, lainLain: 0, total: 58000000 },
          netto: 1028000000
        },
        {
          id: "pnspolri_yatim",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 30, istriSuami: 0, anak: 30, cacat: 0, lainLain: 0, total: 30 },
          bruto: { pensiunPokok: 120000000, tunjKeluarga: 0, tunjBeras: 6000000, cacatLain: 0, lainLain: 2500000, total: 128500000 },
          potongan: { pph21: 0, askes: 750000, tgr: 0, nonTgr: 0, lainLain: 0, total: 750000 },
          netto: 127750000
        },
        {
          id: "pnspolri_ortu",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 6, istriSuami: 0, anak: 0, cacat: 0, lainLain: 0, total: 6 },
          bruto: { pensiunPokok: 24000000, tunjKeluarga: 0, tunjBeras: 1200000, cacatLain: 0, lainLain: 0, total: 25200000 },
          potongan: { pph21: 0, askes: 150000, tgr: 0, nonTgr: 0, lainLain: 0, total: 150000 },
          netto: 25050000
        }
      ]
    },

    // 3. PENS TNI (513122)
    {
      no: "3",
      kodeMAK: "513122",
      namaKelompok: "PENS TNI ( 513122 )",
      jenisList: [
        {
          id: "tni_sendiri",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 3820, istriSuami: 1450, anak: 890, cacat: 0, lainLain: 0, total: 6160 },
          bruto: { pensiunPokok: 24150000000, tunjKeluarga: 920000000, tunjBeras: 780000000, cacatLain: 0, lainLain: 1200000000, total: 27050000000 },
          potongan: { pph21: 1205000000, askes: 155000000, tgr: 0, nonTgr: 82000000, lainLain: 0, total: 1442000000 },
          netto: 25608000000
        },
        {
          id: "tni_warakawuri",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 1350, istriSuami: 210, anak: 140, cacat: 0, lainLain: 0, total: 1700 },
          bruto: { pensiunPokok: 7150000000, tunjKeluarga: 190000000, tunjBeras: 228000000, cacatLain: 0, lainLain: 360000000, total: 7928000000 },
          potongan: { pph21: 352000000, askes: 46000000, tgr: 0, nonTgr: 24500000, lainLain: 0, total: 422500000 },
          netto: 7505500000
        },
        {
          id: "tni_yatim",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 220, istriSuami: 0, anak: 220, cacat: 0, lainLain: 0, total: 220 },
          bruto: { pensiunPokok: 880000000, tunjKeluarga: 0, tunjBeras: 44000000, cacatLain: 0, lainLain: 18000000, total: 942000000 },
          potongan: { pph21: 0, askes: 5500000, tgr: 0, nonTgr: 0, lainLain: 0, total: 5500000 },
          netto: 936500000
        },
        {
          id: "tni_ortu",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 45, istriSuami: 0, anak: 0, cacat: 0, lainLain: 0, total: 45 },
          bruto: { pensiunPokok: 180000000, tunjKeluarga: 0, tunjBeras: 9000000, cacatLain: 0, lainLain: 0, total: 189000000 },
          potongan: { pph21: 0, askes: 1100000, tgr: 0, nonTgr: 0, lainLain: 0, total: 1100000 },
          netto: 187900000
        }
      ]
    },

    // 4. PENS POLRI (513123)
    {
      no: "4",
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI ( 513123 )",
      jenisList: [
        {
          id: "polri_sendiri",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 2150, istriSuami: 820, anak: 510, cacat: 0, lainLain: 0, total: 3480 },
          bruto: { pensiunPokok: 13580000000, tunjKeluarga: 517000000, tunjBeras: 438000000, cacatLain: 0, lainLain: 675000000, total: 15210000000 },
          potongan: { pph21: 677000000, askes: 87000000, tgr: 0, nonTgr: 46000000, lainLain: 0, total: 810000000 },
          netto: 14400000000
        },
        {
          id: "polri_warakawuri",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 760, istriSuami: 118, anak: 78, cacat: 0, lainLain: 0, total: 956 },
          bruto: { pensiunPokok: 4020000000, tunjKeluarga: 107000000, tunjBeras: 128000000, cacatLain: 0, lainLain: 202000000, total: 4457000000 },
          potongan: { pph21: 198000000, askes: 26000000, tgr: 0, nonTgr: 13800000, lainLain: 0, total: 237800000 },
          netto: 4219200000
        },
        {
          id: "polri_yatim",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 125, istriSuami: 0, anak: 125, cacat: 0, lainLain: 0, total: 125 },
          bruto: { pensiunPokok: 500000000, tunjKeluarga: 0, tunjBeras: 25000000, cacatLain: 0, lainLain: 10000000, total: 535000000 },
          potongan: { pph21: 0, askes: 3100000, tgr: 0, nonTgr: 0, lainLain: 0, total: 3100000 },
          netto: 531900000
        },
        {
          id: "polri_ortu",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 25, istriSuami: 0, anak: 0, cacat: 0, lainLain: 0, total: 25 },
          bruto: { pensiunPokok: 100000000, tunjKeluarga: 0, tunjBeras: 5000000, cacatLain: 0, lainLain: 0, total: 105000000 },
          potongan: { pph21: 0, askes: 625000, tgr: 0, nonTgr: 0, lainLain: 0, total: 625000 },
          netto: 104375000
        }
      ]
    }
  ];

  // ===========================================================================
  // KALKULASI GRAND TOTAL REKAPITULASI III (KELOMPOK KE-5)
  // Menjumlahkan seluruh sel secara matematis presisi
  // ===========================================================================
  const grandTotalGroup = useMemo(() => {
    const jenisNames = [
      "a. Pensiun Sendiri",
      "b. Pensiun Warakawuri/Janda/Duda",
      "c. Tunjangan Yatim Piatu",
      "d. Tunjangan Orang Tua"
    ];

    const aggregatedJenisList = jenisNames.map((jName, idx) => {
      const itemsForThisJenis = rawGroupsData.map((g) => g.jenisList[idx]);

      const jiwa = {
        penerima: itemsForThisJenis.reduce((acc, cur) => acc + cur.jiwa.penerima, 0),
        istriSuami: itemsForThisJenis.reduce((acc, cur) => acc + cur.jiwa.istriSuami, 0),
        anak: itemsForThisJenis.reduce((acc, cur) => acc + cur.jiwa.anak, 0),
        cacat: itemsForThisJenis.reduce((acc, cur) => acc + cur.jiwa.cacat, 0),
        lainLain: itemsForThisJenis.reduce((acc, cur) => acc + (cur.jiwa.lainLain || 0), 0),
        total: itemsForThisJenis.reduce((acc, cur) => acc + cur.jiwa.total, 0)
      };

      const bruto = {
        pensiunPokok: itemsForThisJenis.reduce((acc, cur) => acc + cur.bruto.pensiunPokok, 0),
        tunjKeluarga: itemsForThisJenis.reduce((acc, cur) => acc + cur.bruto.tunjKeluarga, 0),
        tunjBeras: itemsForThisJenis.reduce((acc, cur) => acc + cur.bruto.tunjBeras, 0),
        cacatLain: itemsForThisJenis.reduce((acc, cur) => acc + cur.bruto.cacatLain, 0),
        lainLain: itemsForThisJenis.reduce((acc, cur) => acc + cur.bruto.lainLain, 0),
        total: itemsForThisJenis.reduce((acc, cur) => acc + cur.bruto.total, 0)
      };

      const potongan = {
        pph21: itemsForThisJenis.reduce((acc, cur) => acc + cur.potongan.pph21, 0),
        askes: itemsForThisJenis.reduce((acc, cur) => acc + cur.potongan.askes, 0),
        tgr: itemsForThisJenis.reduce((acc, cur) => acc + cur.potongan.tgr, 0),
        nonTgr: itemsForThisJenis.reduce((acc, cur) => acc + cur.potongan.nonTgr, 0),
        lainLain: itemsForThisJenis.reduce((acc, cur) => acc + cur.potongan.lainLain, 0),
        total: itemsForThisJenis.reduce((acc, cur) => acc + cur.potongan.total, 0)
      };

      const netto = itemsForThisJenis.reduce((acc, cur) => acc + cur.netto, 0);

      return {
        id: `grand_total_${idx}`,
        nama: jName,
        jiwa,
        bruto,
        potongan,
        netto
      };
    });

    return {
      no: "TOTAL",
      kodeMAK: "GRAND TOTAL",
      namaKelompok: "GRAND TOTAL REKAPITULASI III",
      jenisList: aggregatedJenisList
    };
  }, [rawGroupsData]);

  // Style cell header baku
  const thBakuStyle = {
    border: "1px solid #000000",
    padding: "5px 4px",
    fontSize: "10px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#000000"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* =======================================================================
          TOAST NOTIFICATION
         ======================================================================= */}
      {toastNotification && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            zIndex: 9999,
            animation: "fadeIn 0.2s ease"
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* =======================================================================
          1. HEADER HALAMAN & TANGGAL
          Breadcrumb: Beranda › Aktuaria / Keuangan › Report KU
          Judul: Report KU (Font 20px, Bold #0f172a)
          Badge Tanggal di kanan: Background #0f172a, teks putih tebal
         ======================================================================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              fontWeight: 500,
              marginBottom: 4
            }}
          >
            Beranda › Administrasi DAPEM ›{" "}
            <b style={{ color: "#0f172a", fontWeight: 700 }}>Report KU</b>
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: -0.4,
              color: "#0f172a",
              margin: 0
            }}
          >
            Report KU
          </h1>
        </div>

        {/* Badge Tanggal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: 8,
            padding: "8px 16px",
            boxShadow: "0 2px 4px rgba(15,23,42,0.15)"
          }}
        >
          <Calendar size={15} color="#94a3b8" />
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>
            Kamis, 06 Agustus 2026
          </span>
        </div>
      </div>

      {/* =======================================================================
          2. CONTAINER FILTER (CARD ACCORDION)
          Header bergradien biru-teal linear-gradient(135deg, #0e5a8a 0%, #154e68 100%)
          Toggle panah ▲ / ▼
         ======================================================================= */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      >
        {/* Accordion Header */}
        <div
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          style={{
            background: "linear-gradient(135deg, #0e5a8a 0%, #154e68 100%)",
            color: "#ffffff",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={18} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2 }}>
              Parameter Filter Report KU
            </span>
          </div>
          <div style={{ fontSize: 14, color: "#ffffff", fontWeight: "bold" }}>
            {isAccordionOpen ? "▲" : "▼"}
          </div>
        </div>

        {/* Form Grid 3 Kolom */}
        {isAccordionOpen && (
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 16
              }}
            >
              {/* Field 1: Cetak KU */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Cetak KU <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={cetakKU}
                  onChange={(e) => setCetakKU(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="DAFTAR REKAPITULASI III NON DAPEM">
                    DAFTAR REKAPITULASI III NON DAPEM
                  </option>
                  <option value="DAFTAR REKAPITULASI III DAPEM">
                    DAFTAR REKAPITULASI III DAPEM
                  </option>
                  <option value="KU 000 - REK III">KU 000 - REK III</option>
                  <option value="KU 00 - REK II">KU 00 - REK II</option>
                  <option value="KU 00 - REK II PER MITRA">KU 00 - REK II PER MITRA</option>
                  <option value="KU 01 - PER MITRA">KU 01 - PER MITRA</option>
                  <option value="KU 02 - PER MAK">KU 02 - PER MAK</option>
                  <option value="KU 03 - NOM NON TGR">KU 03 - NOM NON TGR</option>
                  <option value="KU 04 - REK NON TGR">KU 04 - REK NON TGR</option>
                  <option value="KU 05 - NOM NON DAPEM">KU 05 - NOM NON DAPEM</option>
                  <option value="KU 06 - PAGU DIPA">KU 06 - PAGU DIPA</option>
                  <option value="KU 07">KU 07</option>
                  <option value="KU 09 - Rp">KU 09 - Rp</option>
                  <option value="KU 09">KU 09</option>
                  <option value="KU 10">KU 10</option>
                  <option value="KU 12 - SPB">KU 12 - SPB</option>
                  <option value="KU 14 - PER CABANG">KU 14 - PER CABANG</option>
                  <option value="Rekap Asuransi SP">Rekap Asuransi SP</option>
                  <option value="Rekap Asuransi Entry">Rekap Asuransi Entry</option>
                </select>
              </div>

              {/* Field 2: Periode Awal */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Periode Awal <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="date"
                  value={periodeAwal}
                  onChange={(e) => setPeriodeAwal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7.5px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Field 3: Mitra Bayar */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Mitra Bayar
                </label>
                <select
                  value={mitraBayar}
                  onChange={(e) => setMitraBayar(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="Semua Mitra">Semua Mitra</option>
                  <option value="PT POS INDONESIA">PT POS INDONESIA</option>
                  <option value="BANK MANDIRI">BANK MANDIRI</option>
                  <option value="BANK BRI">BANK BRI</option>
                  <option value="BANK BNI">BANK BNI</option>
                  <option value="BANK BSI">BANK BSI</option>
                </select>
              </div>

              {/* Field 4: Cabang */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Cabang <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={cabang}
                  onChange={(e) => setCabang(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="1000 - KANTOR PUSAT">1000 - KANTOR PUSAT</option>
                  <option value="1100 - KANCAB MEDAN">1100 - KANCAB MEDAN</option>
                  <option value="1200 - KANCAB PALEMBANG">1200 - KANCAB PALEMBANG</option>
                  <option value="1300 - KANCAB BANDUNG">1300 - KANCAB BANDUNG</option>
                  <option value="1400 - KANCAB SEMARANG">1400 - KANCAB SEMARANG</option>
                  <option value="1500 - KANCAB SURABAYA">1500 - KANCAB SURABAYA</option>
                  <option value="1600 - KANCAB BALIKPAPAN">1600 - KANCAB BALIKPAPAN</option>
                  <option value="1700 - KANCAB MAKASSAR">1700 - KANCAB MAKASSAR</option>
                  <option value="1800 - KANCAB JAYAPURA">1800 - KANCAB JAYAPURA</option>
                  <option value="1900 - KANCAB DENPASAR">1900 - KANCAB DENPASAR</option>
                  <option value="2000 - KANCAB UTAMA JAKARTA">2000 - KANCAB UTAMA JAKARTA</option>
                  <option value="2100 - KANCAB AMBON">2100 - KANCAB AMBON</option>
                  <option value="2200 - KANCAB BANDA ACEH">2200 - KANCAB BANDA ACEH</option>
                  <option value="2300 - KANCAB PONTIANAK">2300 - KANCAB PONTIANAK</option>
                </select>
              </div>

              {/* Field 5: Periode Akhir */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Periode Akhir <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="date"
                  value={periodeAkhir}
                  onChange={(e) => setPeriodeAkhir(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7.5px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Field 6: Jumlah */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Jumlah
                </label>
                <select
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="Semua Jumlah">Semua Jumlah</option>
                  <option value="> 0 (Ada Realisasi)">&gt; 0 (Ada Realisasi)</option>
                  <option value="0 (Nihil)">0 (Nihil)</option>
                </select>
              </div>

              {/* Field 7: Jenis Bayar */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: 6
                  }}
                >
                  Jenis Bayar
                </label>
                <select
                  value={jenisBayar}
                  onChange={(e) => setJenisBayar(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 12.5,
                    color: "#0f172a",
                    background: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="Semua Jenis Bayar">Semua Jenis Bayar</option>
                  <option value="Dapem - Induk">Dapem - Induk</option>
                  <option value="Dapem - Rapel">Dapem - Rapel</option>
                  <option value="Dapem - Gaji ke-13">Dapem - Gaji ke-13</option>
                  <option value="Dapem - Susulan">Dapem - Susulan</option>
                  <option value="Dapem - THR">Dapem - THR</option>
                </select>
              </div>
            </div>

            {/* Action Bar (Kanan Bawah) */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12
              }}
            >
              <button
                onClick={() => setShowPreviewModal(true)}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  padding: "9px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 2px 6px rgba(16,185,129,0.3)",
                  transition: "all 0.15s ease"
                }}
              >
                <span>🔍</span> Cetak
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =======================================================================
          3. MODAL PREVIEW CETAK RESMI (WIDESCREEN 1380px — EXCEL-EXACT)
         ======================================================================= */}
      {showPreviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              width: "100%",
              maxWidth: 1380,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
              overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                  }}
                >
                  PREVIEW CETAK REPORT KU — SHEET 'OUTPUT YANG DIHARAPKAN'
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginTop: 2
                  }}
                >
                  {cetakKU} — {cabang}
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content: Kop Kedinasan + Tabel Matriks */}
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                flex: 1,
                background: "#ffffff"
              }}
            >
              {/* Kop Laporan Cetak (Center Aligned) */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 16,
                  fontFamily: "Arial, sans-serif"
                }}
              >
                <div style={{ fontSize: 14, fontWeight: "bold", textTransform: "uppercase", color: "#000000" }}>
                  {cetakKU}
                </div>
                <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginTop: 2, color: "#000000" }}>
                  {mitraBayar === "Semua Mitra" ? "GABUNGAN POS DAN BANK" : mitraBayar.toUpperCase()} — {cabang.toUpperCase()}
                </div>
                <div style={{ fontSize: 11, fontWeight: "bold", marginTop: 2, color: "#000000" }}>
                  TANGGAL SP {formatDateDisplay(periodeAwal)} S.D. {formatDateDisplay(periodeAkhir)}
                </div>
              </div>

              {/* Tabel Matriks Baku Kedinasan (Border 1px solid black) */}
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #000000",
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif"
                  }}
                >
                  {/* =========================================================
                      7 BARIS MULTI-TIER HEADER (THEAD) PRESISI
                     ========================================================= */}
                  <thead>
                    {/* BARIS 1 */}
                    <tr style={{ background: "#f1f5f9" }}>
                      <th rowSpan={7} style={thBakuStyle}>
                        NO.
                      </th>
                      <th rowSpan={7} style={thBakuStyle}>
                        KELOMPOK PENSIUN
                      </th>
                      <th rowSpan={7} style={thBakuStyle}>
                        JENIS PENSIUN
                      </th>
                      <th colSpan={1} style={thBakuStyle}>
                        JUMLAH JIWA
                      </th>
                      <th colSpan={1} style={thBakuStyle}>
                        JUMLAH BRUTO
                      </th>
                      <th colSpan={6} style={thBakuStyle}>
                        POTONGAN
                      </th>
                      <th rowSpan={7} style={thBakuStyle}>
                        JUMLAH NETTO
                      </th>
                    </tr>

                    {/* BARIS 2 */}
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={thBakuStyle}>A. PENERIMA</th>
                      <th style={thBakuStyle}>A. PENSIUN POKOK</th>
                      <th rowSpan={6} style={thBakuStyle}>
                        PPH21
                      </th>
                      <th rowSpan={6} style={thBakuStyle}>
                        ASKES
                      </th>
                      <th colSpan={2} rowSpan={5} style={thBakuStyle}>
                        HUTANG NEGARA
                      </th>
                      <th rowSpan={6} style={thBakuStyle}>
                        LAIN-LAIN
                      </th>
                      <th rowSpan={6} style={thBakuStyle}>
                        JUMLAH
                      </th>
                    </tr>

                    {/* BARIS 3 */}
                    <tr style={{ background: "#ffffff" }}>
                      <th style={thBakuStyle}>B. ISTRI/ SUAMI</th>
                      <th style={thBakuStyle}>B. TUNJANGAN KELUARGA</th>
                    </tr>

                    {/* BARIS 4 */}
                    <tr style={{ background: "#ffffff" }}>
                      <th style={thBakuStyle}>C. ANAK</th>
                      <th style={thBakuStyle}>C. TUNJANGAN BERAS</th>
                    </tr>

                    {/* BARIS 5 */}
                    <tr style={{ background: "#ffffff" }}>
                      <th style={thBakuStyle}>D. (CACAT)</th>
                      <th style={thBakuStyle}>D. CACAT LAIN-LAIN</th>
                    </tr>

                    {/* BARIS 6 */}
                    <tr style={{ background: "#ffffff" }}>
                      <th style={thBakuStyle}>&nbsp;</th>
                      <th style={thBakuStyle}>E. LAIN-LAIN</th>
                    </tr>

                    {/* BARIS 7 (Sub-Total Header) */}
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={thBakuStyle}>TOTAL</th>
                      <th style={thBakuStyle}>TOTAL</th>
                      <th style={thBakuStyle}>TGR</th>
                      <th style={thBakuStyle}>NON TGR</th>
                    </tr>
                  </thead>

                  {/* =========================================================
                      BODY TABEL (4 KELOMPOK PENSIUN + 1 GRAND TOTAL)
                     ========================================================= */}
                  {rawGroupsData.map((group) => (
                    <Rekapitulasi3ExpectedGroupBlock
                      key={group.no}
                      group={group}
                      isGrandTotal={false}
                      fmt={fmt}
                      fmtJiwa={fmtJiwa}
                    />
                  ))}

                  {/* Kelompok ke-5: GRAND TOTAL REKAPITULASI III */}
                  <Rekapitulasi3ExpectedGroupBlock
                    group={grandTotalGroup}
                    isGrandTotal={true}
                    fmt={fmt}
                    fmtJiwa={fmtJiwa}
                  />
                </table>
              </div>
            </div>

            {/* Modal Footer & Action Buttons */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12
              }}
            >
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer"
                }}
              >
                Tutup
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    `Laporan ${cetakKU} (${cabang}) berhasil diunduh dalam format PDF.`
                  )
                }
                style={{
                  background: "#e11d48",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span>📄</span> Unduh PDF (.pdf)
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    `Laporan ${cetakKU} (${cabang}) berhasil diekspor dalam format Excel (.xlsx).`
                  )
                }
                style={{
                  background: "#059669",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <span>📊</span> Unduh Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
