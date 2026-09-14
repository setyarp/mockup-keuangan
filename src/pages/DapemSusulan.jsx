import { useState } from "react";
import { Users, Banknote, Receipt, Wallet, Download, ChevronDown, Filter, Shield, Clock } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, Btn, NoData, PreviewModal } from "../components/common";

export const DapemSusulan = () => {
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [filterJenisPensiun, setFilterJenisPensiun] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-07-15");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;
  const [filterPenyaluran, setFilterPenyaluran] = useState("Gabungan POS dan Bank");
  const [selectedDropdownDapem, setSelectedDropdownDapem] = useState("semua");
  const [expandedDapem, setExpandedDapem] = useState({
    "513113": true,
    "513114": false,
    "513122": false,
    "513123": false,
    "total": false,
  });
  const [preview, setPreview] = useState(null);

  const fmt = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
  const fmtJiwa = (n) => (n || 0).toLocaleString("id-ID");

  // Data Rekapitulasi III DAPEM SUSULAN (Termin 2 / Batch Susulan SK Baru & Koreksi)
  const dapemSusulanData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113) — SUSULAN",
      singkatan: "PNS Kemhan",
      kategori: "PNS KEMHAN",
      batch: "Batch Susulan Juli 2026",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 142, istriSuami: 40, anak: 28, cacat: 0, total: 210 },
          bruto: { pensiunPokok: 612000000, tunjKeluarga: 24800000, tunjBeras: 18900000, cacatLain: 0, lainLain: 30100000, total: 685800000 },
          potongan: { pph21: 30400000, askes: 3920000, tgr: 0, nonTgr: 2010000, lainLain: 0, total: 36330000 },
          netto: 649470000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 31, istriSuami: 4, anak: 3, cacat: 0, total: 38 },
          bruto: { pensiunPokok: 124500000, tunjKeluarga: 3180000, tunjBeras: 3840000, cacatLain: 0, lainLain: 6120000, total: 137640000 },
          potongan: { pph21: 5820000, askes: 752000, tgr: 0, nonTgr: 385000, lainLain: 0, total: 6957000 },
          netto: 130683000
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 6, istriSuami: 0, anak: 1, cacat: 0, total: 7 },
          bruto: { pensiunPokok: 21800000, tunjKeluarga: 750000, tunjBeras: 670000, cacatLain: 0, lainLain: 1070000, total: 24290000 },
          potongan: { pph21: 1070000, askes: 138000, tgr: 0, nonTgr: 71000, lainLain: 0, total: 1279000 },
          netto: 23011000
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 1, istriSuami: 0, anak: 0, cacat: 0, total: 1 },
          bruto: { pensiunPokok: 3900000, tunjKeluarga: 166000, tunjBeras: 117000, cacatLain: 0, lainLain: 185000, total: 4368000 },
          potongan: { pph21: 185000, askes: 24000, tgr: 0, nonTgr: 12000, lainLain: 0, total: 221000 },
          netto: 4147000
        }
      ],
      totalJiwa: { penerima: 180, istriSuami: 44, anak: 32, cacat: 0, total: 256 },
      totalBruto: { pensiunPokok: 762200000, tunjKeluarga: 28896000, tunjBeras: 23527000, cacatLain: 0, lainLain: 37475000, total: 852098000 },
      totalPotongan: { pph21: 37475000, askes: 4834000, tgr: 0, nonTgr: 2478000, lainLain: 0, total: 44787000 },
      totalNetto: 807311000
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114) — SUSULAN",
      singkatan: "PNS Polri",
      kategori: "PNS POLRI",
      batch: "Batch Susulan Juli 2026",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 48, istriSuami: 14, anak: 9, cacat: 0, total: 71 },
          bruto: { pensiunPokok: 198000000, tunjKeluarga: 7550000, tunjBeras: 5980000, cacatLain: 0, lainLain: 9580000, total: 221110000 },
          potongan: { pph21: 9490000, askes: 1368000, tgr: 0, nonTgr: 783000, lainLain: 0, total: 11641000 },
          netto: 209469000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 12, istriSuami: 2, anak: 1, cacat: 0, total: 15 },
          bruto: { pensiunPokok: 48200000, tunjKeluarga: 1235000, tunjBeras: 1450000, cacatLain: 0, lainLain: 2320000, total: 53205000 },
          potongan: { pph21: 2300000, askes: 332000, tgr: 0, nonTgr: 190000, lainLain: 0, total: 2822000 },
          netto: 50383000
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 2, istriSuami: 0, anak: 0, cacat: 0, total: 2 },
          bruto: { pensiunPokok: 8100000, tunjKeluarga: 275000, tunjBeras: 242000, cacatLain: 0, lainLain: 388000, total: 9005000 },
          potongan: { pph21: 388000, askes: 56000, tgr: 0, nonTgr: 32000, lainLain: 0, total: 476000 },
          netto: 8529000
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 0, istriSuami: 0, anak: 0, cacat: 0, total: 0 },
          bruto: { pensiunPokok: 0, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 0 },
          potongan: { pph21: 0, askes: 0, tgr: 0, nonTgr: 0, lainLain: 0, total: 0 },
          netto: 0
        }
      ],
      totalJiwa: { penerima: 62, istriSuami: 16, anak: 10, cacat: 0, total: 88 },
      totalBruto: { pensiunPokok: 254300000, tunjKeluarga: 9060000, tunjBeras: 7672000, cacatLain: 0, lainLain: 12288000, total: 283320000 },
      totalPotongan: { pph21: 12178000, askes: 1756000, tgr: 0, nonTgr: 1005000, lainLain: 0, total: 14939000 },
      totalNetto: 268381000
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122) — SUSULAN",
      singkatan: "TNI",
      kategori: "TNI",
      batch: "Batch Susulan Juli 2026",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 620, istriSuami: 145, anak: 380, cacat: 0, total: 1145 },
          bruto: { pensiunPokok: 2180000000, tunjKeluarga: 102800000, tunjBeras: 80600000, cacatLain: 0, lainLain: 129800000, total: 2493200000 },
          potongan: { pph21: 129200000, askes: 12950000, tgr: 0, nonTgr: 19890000, lainLain: 0, total: 162040000 },
          netto: 2331160000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 145, istriSuami: 16, anak: 52, cacat: 0, total: 213 },
          bruto: { pensiunPokok: 520000000, tunjKeluarga: 16500000, tunjBeras: 19230000, cacatLain: 0, lainLain: 31000000, total: 586730000 },
          potongan: { pph21: 30850000, askes: 3091000, tgr: 0, nonTgr: 4749000, lainLain: 0, total: 38690000 },
          netto: 548040000
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 22, istriSuami: 0, anak: 11, cacat: 0, total: 33 },
          bruto: { pensiunPokok: 85200000, tunjKeluarga: 3660000, tunjBeras: 3140000, cacatLain: 0, lainLain: 5060000, total: 97060000 },
          potongan: { pph21: 5040000, askes: 505000, tgr: 0, nonTgr: 775000, lainLain: 0, total: 6320000 },
          netto: 90740000
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 3, istriSuami: 0, anak: 0, cacat: 0, total: 3 },
          bruto: { pensiunPokok: 12000000, tunjKeluarga: 600000, tunjBeras: 454000, cacatLain: 0, lainLain: 732000, total: 13786000 },
          potongan: { pph21: 728000, askes: 73000, tgr: 0, nonTgr: 112000, lainLain: 0, total: 913000 },
          netto: 12873000
        }
      ],
      totalJiwa: { penerima: 790, istriSuami: 161, anak: 443, cacat: 0, total: 1394 },
      totalBruto: { pensiunPokok: 2797200000, tunjKeluarga: 123560000, tunjBeras: 103424000, cacatLain: 0, lainLain: 166592000, total: 3190776000 },
      totalPotongan: { pph21: 165818000, askes: 16619000, tgr: 0, nonTgr: 25526000, lainLain: 0, total: 207963000 },
      totalNetto: 2982813000
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123) — SUSULAN",
      singkatan: "POLRI",
      kategori: "POLRI",
      batch: "Batch Susulan Juli 2026",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 310, istriSuami: 78, anak: 210, cacat: 0, total: 598 },
          bruto: { pensiunPokok: 1120000000, tunjKeluarga: 37700000, tunjBeras: 30800000, cacatLain: 0, lainLain: 59200000, total: 1247700000 },
          potongan: { pph21: 58890000, askes: 5560000, tgr: 0, nonTgr: 7990000, lainLain: 0, total: 72440000 },
          netto: 1175260000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 68, istriSuami: 8, anak: 28, cacat: 0, total: 104 },
          bruto: { pensiunPokok: 242000000, tunjKeluarga: 5480000, tunjBeras: 6650000, cacatLain: 0, lainLain: 12790000, total: 266920000 },
          potongan: { pph21: 12730000, askes: 1202000, tgr: 0, nonTgr: 1726000, lainLain: 0, total: 15658000 },
          netto: 251262000
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 9, istriSuami: 0, anak: 5, cacat: 0, total: 14 },
          bruto: { pensiunPokok: 39800000, tunjKeluarga: 1230000, tunjBeras: 1090000, cacatLain: 0, lainLain: 2100000, total: 44220000 },
          potongan: { pph21: 2090000, askes: 198000, tgr: 0, nonTgr: 284000, lainLain: 0, total: 2572000 },
          netto: 41648000
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 1, istriSuami: 0, anak: 0, cacat: 0, total: 1 },
          bruto: { pensiunPokok: 5000000, tunjKeluarga: 167000, tunjBeras: 145000, cacatLain: 0, lainLain: 265000, total: 5577000 },
          potongan: { pph21: 263000, askes: 25000, tgr: 0, nonTgr: 36000, lainLain: 0, total: 324000 },
          netto: 5253000
        }
      ],
      totalJiwa: { penerima: 388, istriSuami: 86, anak: 243, cacat: 0, total: 717 },
      totalBruto: { pensiunPokok: 1406800000, tunjKeluarga: 44577000, tunjBeras: 38685000, cacatLain: 0, lainLain: 74355000, total: 1564417000 },
      totalPotongan: { pph21: 73973000, askes: 6985000, tgr: 0, nonTgr: 10036000, lainLain: 0, total: 90994000 },
      totalNetto: 1473423000
    }
  ];

  const filteredDapemList = dapemSusulanData.filter(d => {
    if (filterKelompok !== "Semua" && d.namaKelompok !== filterKelompok) return false;
    if (selectedDropdownDapem !== "semua" && d.kodeMAK !== selectedDropdownDapem) return false;
    return true;
  });

  const grandTotalJiwa = {
    penerima: dapemSusulanData.reduce((a, d) => a + d.totalJiwa.penerima, 0),
    istriSuami: dapemSusulanData.reduce((a, d) => a + d.totalJiwa.istriSuami, 0),
    anak: dapemSusulanData.reduce((a, d) => a + d.totalJiwa.anak, 0),
    cacat: dapemSusulanData.reduce((a, d) => a + d.totalJiwa.cacat, 0),
    total: dapemSusulanData.reduce((a, d) => a + d.totalJiwa.total, 0),
  };

  const grandTotalBruto = {
    pensiunPokok: dapemSusulanData.reduce((a, d) => a + d.totalBruto.pensiunPokok, 0),
    tunjKeluarga: dapemSusulanData.reduce((a, d) => a + d.totalBruto.tunjKeluarga, 0),
    tunjBeras: dapemSusulanData.reduce((a, d) => a + d.totalBruto.tunjBeras, 0),
    cacatLain: dapemSusulanData.reduce((a, d) => a + d.totalBruto.cacatLain, 0),
    lainLain: dapemSusulanData.reduce((a, d) => a + d.totalBruto.lainLain, 0),
    total: dapemSusulanData.reduce((a, d) => a + d.totalBruto.total, 0),
  };

  const grandTotalPotongan = {
    pph21: dapemSusulanData.reduce((a, d) => a + d.totalPotongan.pph21, 0),
    askes: dapemSusulanData.reduce((a, d) => a + d.totalPotongan.askes, 0),
    tgr: dapemSusulanData.reduce((a, d) => a + d.totalPotongan.tgr, 0),
    nonTgr: dapemSusulanData.reduce((a, d) => a + d.totalPotongan.nonTgr, 0),
    lainLain: dapemSusulanData.reduce((a, d) => a + d.totalPotongan.lainLain, 0),
    total: dapemSusulanData.reduce((a, d) => a + d.totalPotongan.total, 0),
  };

  const grandTotalNetto = dapemSusulanData.reduce((a, d) => a + d.totalNetto, 0);

  const jenisKeys = ["a", "b", "c", "d"];
  const grandTotalJenisList = jenisKeys.map(k => {
    const matching = dapemSusulanData.map(d => d.jenisList.find(j => j.id === k)).filter(Boolean);
    const nama = matching[0]?.nama || "";
    return {
      id: k,
      nama,
      jiwa: {
        penerima: matching.reduce((a, m) => a + m.jiwa.penerima, 0),
        istriSuami: matching.reduce((a, m) => a + m.jiwa.istriSuami, 0),
        anak: matching.reduce((a, m) => a + m.jiwa.anak, 0),
        cacat: matching.reduce((a, m) => a + m.jiwa.cacat, 0),
        total: matching.reduce((a, m) => a + m.jiwa.total, 0),
      },
      bruto: {
        pensiunPokok: matching.reduce((a, m) => a + m.bruto.pensiunPokok, 0),
        tunjKeluarga: matching.reduce((a, m) => a + m.bruto.tunjKeluarga, 0),
        tunjBeras: matching.reduce((a, m) => a + m.bruto.tunjBeras, 0),
        cacatLain: matching.reduce((a, m) => a + m.bruto.cacatLain, 0),
        lainLain: matching.reduce((a, m) => a + m.bruto.lainLain, 0),
        total: matching.reduce((a, m) => a + m.bruto.total, 0),
      },
      potongan: {
        pph21: matching.reduce((a, m) => a + m.potongan.pph21, 0),
        askes: matching.reduce((a, m) => a + m.potongan.askes, 0),
        tgr: matching.reduce((a, m) => a + m.potongan.tgr, 0),
        nonTgr: matching.reduce((a, m) => a + m.potongan.nonTgr, 0),
        lainLain: matching.reduce((a, m) => a + m.potongan.lainLain, 0),
        total: matching.reduce((a, m) => a + m.potongan.total, 0),
      },
      netto: matching.reduce((a, m) => a + m.netto, 0),
    };
  });

  const toggleExpand = (kode) => {
    setExpandedDapem(prev => ({ ...prev, [kode]: !prev[kode] }));
  };

  const renderJenisRows = (jenis, index, isSubtotal = false, customLabel = null) => {
    const isFilteredOut = filterJenisPensiun !== "Semua" && jenis.nama !== filterJenisPensiun && !isSubtotal;
    if (isFilteredOut) return null;

    const rowBg = isSubtotal ? "#E2E8F0" : index % 2 === 0 ? COLORS.white : "#F8FAFC";
    const textWeight = isSubtotal ? 800 : 500;
    const labelColor = isSubtotal ? "#0F172A" : "#1E293B";

    return (
      <tr key={jenis.id || "subtotal"} style={{ borderBottom: `1px solid ${isSubtotal ? "#94A3B8" : "#E2E8F0"}`, background: rowBg }}>
        <td style={{ padding: "9px 12px", fontWeight: textWeight, color: labelColor, verticalAlign: "top", borderRight: `1px solid #E2E8F0` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isSubtotal ? <strong style={{ color: "#0F172A" }}>{customLabel || "TOTAL / SUBTOTAL"}</strong> : <span>{jenis.nama}</span>}
          </div>
        </td>

        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Penerima:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.penerima)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. Istri/Suami:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.istriSuami)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>C. Anak:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.anak)}</strong></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#0F172A" }}>
              <span>Total Jiwa:</span> <span style={{ fontFamily: "monospace" }}>{fmtJiwa(jenis.jiwa.total)}</span>
            </div>
          </div>
        </td>

        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Pokok:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.pensiunPokok)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. T.Keluarga:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjKeluarga)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>C. T.Beras:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjBeras)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>D. Lain-lain:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.lainLain)}</span></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#15803D" }}>
              <span>Total Bruto:</span> <span style={{ fontFamily: "monospace" }}>{fmt(jenis.bruto.total)}</span>
            </div>
          </div>
        </td>

        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.pph21)}
        </td>
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.askes)}
        </td>
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.nonTgr)}
        </td>
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, fontWeight: 700, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#DC2626", background: isSubtotal ? "#FEE2E2" : "#FEF2F2" }}>
          {fmt(jenis.potongan.total)}
        </td>
        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 12.5, fontWeight: 800, verticalAlign: "middle", color: "#0F172A", background: isSubtotal ? "#E0F2FE" : "#F0F9FF" }}>
          {fmt(jenis.netto)}
        </td>
      </tr>
    );
  };

  const closeAllDetails = () => {
    setExpandedDapem({
      "513113": false,
      "513114": false,
      "513122": false,
      "513123": false,
      "total": false,
    });
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Stat Cards Ringkasan Susulan */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard
          icon={<Users size={IC} />}
          label="Total Jiwa Susulan"
          value={`${fmtJiwa(grandTotalJiwa.total)} Jiwa`}
          sub={`${fmtJiwa(grandTotalJiwa.penerima)} Penerima SK Baru / Koreksi`}
          color={COLORS.blue}
        />
        <StatCard
          icon={<Banknote size={IC} />}
          label="Total Bruto Susulan"
          value={fmt(grandTotalBruto.total)}
          sub={`Pokok ${fmt(grandTotalBruto.pensiunPokok)} + Tunjangan`}
          color={COLORS.green}
        />
        <StatCard
          icon={<Receipt size={IC} />}
          label="Total Potongan Susulan"
          value={fmt(grandTotalPotongan.total)}
          sub={`PPh21 ${fmt(grandTotalPotongan.pph21)} • Askes ${fmt(grandTotalPotongan.askes)}`}
          color={COLORS.red}
        />
        <StatCard
          icon={<Wallet size={IC} />}
          label="Netto Susulan Disalurkan"
          value={fmt(grandTotalNetto)}
          sub="Realisasi Termin 2 / Susulan Mitra Bayar"
          color={COLORS.blueDark}
        />
      </div>

      {/* CARD UTAMA REKAPITULASI III DAPEM SUSULAN */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid #CBD5E1`, marginBottom: 24, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
        
        {/* UNIFIED CONTROL TOOLBAR */}
        <div style={{
          background: "#F8FAFC",
          borderRadius: 8,
          border: "1px solid #CBD5E1",
          padding: "12px 16px",
          marginBottom: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          {/* Baris 1: Segmented Control Kelompok DAPEM Susulan & Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #E2E8F0", paddingBottom: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>
                Kelompok MAK Susulan:
              </span>
              <div style={{ display: "inline-flex", background: "#E2E8F0", padding: 3, borderRadius: 7, gap: 3 }}>
                {[
                  { id: "semua", label: "Semua (4 MAK)" },
                  { id: "513113", label: "PNS KEMHAN (513113)" },
                  { id: "513114", label: "PNS POLRI (513114)" },
                  { id: "513122", label: "TNI (513122)" },
                  { id: "513123", label: "POLRI (513123)" },
                ].map((item) => {
                  const isSelected = selectedDropdownDapem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDropdownDapem(item.id);
                        if (item.id !== "semua") {
                          setExpandedDapem(prev => ({ ...prev, [item.id]: true }));
                        }
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : 500,
                        border: "none",
                        background: isSelected ? "#FFFFFF" : "transparent",
                        color: isSelected ? "#0F172A" : "#475569",
                        boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <button
                onClick={closeAllDetails}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid #CBD5E1`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <ChevronDown size={14} color="#475569" style={{ transform: "rotate(180deg)" }} />
                <span>Tutup Semua</span>
              </button>

              <Btn
                variant="primary"
                size="sm"
                onClick={() => {
                  setPreview({
                    title: "Daftar Rekapitulasi III DAPEM SUSULAN",
                    subtitle: `${filterPeriode} • ${filterPenyaluran} — Rekapitulasi Pembayaran Pensiun Susulan (Termin 2)`,
                    type: "table",
                    fileName: `Rekapitulasi_DAPEM_Susulan_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                    content: {
                      columns: ["No", "Kelompok Pensiun (MAK)", "Jenis Pensiun", "Total Jiwa", "Pensiun Pokok", "Total Bruto", "PPh 21", "ASKES", "Total Potongan", "Jumlah Netto"],
                      rows: dapemSusulanData.flatMap(d => [
                        ...d.jenisList.map(j => [d.no, d.namaKelompok, j.nama, j.jiwa.total.toLocaleString(), fmt(j.bruto.pensiunPokok), fmt(j.bruto.total), fmt(j.potongan.pph21), fmt(j.potongan.askes), fmt(j.potongan.total), fmt(j.netto)]),
                        ["", `SUBTOTAL ${d.singkatan} (SUSULAN)`, "TOTAL", d.totalJiwa.total.toLocaleString(), fmt(d.totalBruto.pensiunPokok), fmt(d.totalBruto.total), fmt(d.totalPotongan.pph21), fmt(d.totalPotongan.askes), fmt(d.totalPotongan.total), fmt(d.totalNetto)],
                      ]),
                      totalRows: dapemSusulanData.length * 5,
                    }
                  });
                }}
              >
                <Download size={14} /> Ekspor Susulan
              </Btn>
            </div>
          </div>

          {/* Baris 2: Parameter Filter Rinci */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
              <Filter size={13} color="#64748B" />
              <span style={{ fontWeight: 600 }}>Filter Rincian:</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Jenis:</span>
              <select
                value={filterJenisPensiun}
                onChange={e => setFilterJenisPensiun(e.target.value)}
                style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              >
                <option value="Semua">Semua Jenis Pensiun</option>
                <option value="a. Pensiun Sendiri">a. Pensiun Sendiri</option>
                <option value="b. Pensiun Warakawuri/Janda/Duda">b. Pensiun Warakawuri/Janda/Duda</option>
                <option value="c. Tunjangan Yatim Piatu">c. Tunjangan Yatim Piatu</option>
                <option value="d. Tunjangan Orang Tua">d. Tunjangan Orang Tua</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Tgl Awal:</span>
              <input
                type="date"
                value={tglAwal}
                onChange={e => setTglAwal(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Tgl Akhir:</span>
              <input
                type="date"
                value={tglAkhir}
                onChange={e => setTglAkhir(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Penyaluran:</span>
              <select
                value={filterPenyaluran}
                onChange={e => setFilterPenyaluran(e.target.value)}
                style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              >
                <option value="Gabungan POS dan Bank">Gabungan POS dan Bank</option>
                <option value="Bank Mandiri / BSI">Bank Mandiri / BSI</option>
                <option value="BRI / BNI">BRI / BNI</option>
                <option value="PT POS Indonesia">PT POS Indonesia</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABEL ACCORDION MAK DAPEM SUSULAN */}
        {filteredDapemList.length === 0 ? (
          <NoData />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredDapemList.map((dapem) => {
              const isOpen = !!expandedDapem[dapem.kodeMAK];

              return (
                <div key={dapem.kodeMAK} style={{ borderRadius: 8, border: `1px solid #CBD5E1`, overflow: "hidden", background: COLORS.white, boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}>
                  <div
                    onClick={() => toggleExpand(dapem.kodeMAK)}
                    style={{
                      padding: "12px 18px",
                      background: "#F8FAFC",
                      color: "#0F172A",
                      borderBottom: isOpen ? `1px solid #CBD5E1` : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      userSelect: "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 4, background: "#0284C7", color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {dapem.no}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                          {dapem.namaKelompok}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
                          MAK: <strong style={{ color: "#334155" }}>{dapem.kodeMAK}</strong> • {fmtJiwa(dapem.totalJiwa.total)} Jiwa Susulan ({fmtJiwa(dapem.totalJiwa.penerima)} Penerima)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#64748B", fontWeight: 600 }}>Total Bruto</div>
                        <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace", color: "#0F172A" }}>{fmt(dapem.totalBruto.total)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#64748B", fontWeight: 600 }}>Total Potongan</div>
                        <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace", color: "#DC2626" }}>{fmt(dapem.totalPotongan.total)}</div>
                      </div>
                      <div style={{ textAlign: "right", background: "#FFFFFF", border: `1.5px solid #0284C7`, padding: "4px 12px", borderRadius: 6 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", color: "#0284C7", fontWeight: 700 }}>Jumlah Netto</div>
                        <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "monospace", color: "#0F172A" }}>{fmt(dapem.totalNetto)}</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#475569", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, width: 220, borderRight: `1px solid #E2E8F0` }}>JENIS PENSIUN SUSULAN</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, width: 170, borderRight: `1px solid #E2E8F0` }}>JUMLAH JIWA</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, width: 210, borderRight: `1px solid #E2E8F0` }}>JUMLAH BRUTO</th>
                            <th colSpan={3} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, borderBottom: `1px solid #E2E8F0`, borderRight: `1px solid #E2E8F0` }}>POTONGAN</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, width: 110, borderRight: `1px solid #E2E8F0`, color: "#DC2626" }}>TOTAL POTONGAN</th>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#0284C7", width: 160 }}>JUMLAH NETTO</th>
                          </tr>
                          <tr style={{ background: "#F1F5F9", color: "#475569", fontSize: 11 }}>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, borderRight: `1px solid #CBD5E1` }}>PPh 21</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, borderRight: `1px solid #CBD5E1` }}>ASKES</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, borderRight: `1px solid #CBD5E1` }}>Non TGR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dapem.jenisList.map((jenis, jIdx) => renderJenisRows(jenis, jIdx))}
                          {renderJenisRows(
                            {
                              id: "subtotal",
                              nama: `TOTAL / SUBTOTAL ${dapem.namaKelompok}`,
                              jiwa: dapem.totalJiwa,
                              bruto: dapem.totalBruto,
                              potongan: dapem.totalPotongan,
                              netto: dapem.totalNetto
                            },
                            999,
                            true,
                            `SUBTOTAL (${dapem.singkatan} SUSULAN)`
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            {/* GRAND TOTAL SUMMARY CARD SUSULAN */}
            <div style={{ borderRadius: 8, border: `1.5px solid #0F172A`, overflow: "hidden", background: COLORS.white, marginTop: 6 }}>
              <div
                onClick={() => toggleExpand("total")}
                style={{
                  padding: "13px 18px",
                  background: "#0F172A",
                  color: COLORS.white,
                  borderBottom: expandedDapem["total"] ? `1px solid #334155` : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Shield size={20} color="#38BDF8" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.white, letterSpacing: 0.3 }}>
                      GRAND TOTAL SELURUH DAPEM SUSULAN (TERMIN 2)
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                      4 Kelompok MAK • {fmtJiwa(grandTotalJiwa.total)} Total Jiwa Susulan • {fmtJiwa(grandTotalJiwa.penerima)} Penerima Manfaat
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#94A3B8" }}>Total Bruto</div>
                    <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "monospace", color: COLORS.white }}>{fmt(grandTotalBruto.total)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "#94A3B8" }}>Total Potongan</div>
                    <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "monospace", color: "#FCA5A5" }}>{fmt(grandTotalPotongan.total)}</div>
                  </div>
                  <div style={{ textAlign: "right", background: "#0284C7", color: COLORS.white, padding: "5px 14px", borderRadius: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Grand Total Netto</div>
                    <div style={{ fontWeight: 900, fontSize: 16, fontFamily: "monospace" }}>{fmt(grandTotalNetto)}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#94A3B8", transform: expandedDapem["total"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </div>
                </div>
              </div>

              {expandedDapem["total"] && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 220, borderRight: `1px solid #E2E8F0` }}>REKAP SUSULAN PER JENIS</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 170, borderRight: `1px solid #E2E8F0` }}>JUMLAH JIWA</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 210, borderRight: `1px solid #E2E8F0` }}>JUMLAH BRUTO</th>
                        <th colSpan={3} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, color: "#64748B", borderBottom: `1px solid #E2E8F0`, borderRight: `1px solid #E2E8F0` }}>POTONGAN</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, width: 110, borderRight: `1px solid #E2E8F0`, color: "#DC2626" }}>TOTAL POTONGAN</th>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#0284C7", width: 160 }}>JUMLAH NETTO</th>
                      </tr>
                      <tr style={{ background: "#F1F5F9", color: "#475569", fontSize: 11 }}>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, borderRight: `1px solid #CBD5E1` }}>PPh 21</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, borderRight: `1px solid #CBD5E1` }}>ASKES</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, borderRight: `1px solid #CBD5E1` }}>Non TGR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grandTotalJenisList.map((jenis, jIdx) => renderJenisRows(jenis, jIdx))}
                      {renderJenisRows(
                        {
                          id: "grandtotal",
                          nama: "GRAND TOTAL SUSULAN SELURUHNYA",
                          jiwa: grandTotalJiwa,
                          bruto: grandTotalBruto,
                          potongan: grandTotalPotongan,
                          netto: grandTotalNetto
                        },
                        999,
                        true,
                        "GRAND TOTAL REKAPITULASI SUSULAN"
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
