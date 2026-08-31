import { useState } from "react";
import { Users, Banknote, Receipt, Wallet, Download, ChevronDown, Filter, Shield } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, Btn, NoData, PreviewModal } from "../components/common";

export const PembayaranPensiun = () => {
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [filterJenisPensiun, setFilterJenisPensiun] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-06-01");
  const [tglAkhir, setTglAkhir] = useState("2026-06-30");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;
  const [filterPenyaluran, setFilterPenyaluran] = useState("Gabungan POS dan Bank");
  const [selectedDropdownDapem, setSelectedDropdownDapem] = useState("semua");
  const [expandedDapem, setExpandedDapem] = useState({
    "513113": false,
    "513114": false,
    "513122": false,
    "513123": false,
    "total": false,
  });
  const [preview, setPreview] = useState(null);

  const fmt = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
  const fmtJiwa = (n) => (n || 0).toLocaleString("id-ID");

  // Data Rekapitulasi III Lengkap (sesuai Sheet Ouput yang diharapkan & data aktual)
  const dapemData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113)",
      singkatan: "PNS Kemenhan",
      kategori: "PNS KEMHAN",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 1110, istriSuami: 310, anak: 170, cacat: 0, total: 1590 },
          bruto: { pensiunPokok: 6980570000, tunjKeluarga: 265330000, tunjBeras: 215270000, cacatLain: 0, lainLain: 342880000, total: 7804050000 },
          potongan: { pph21: 346622000, askes: 44753000, tgr: 0, nonTgr: 22911000, lainLain: 0, total: 414286000 },
          netto: 7389764000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 395, istriSuami: 51, anak: 34, cacat: 0, total: 480 },
          bruto: { pensiunPokok: 2074000610, tunjKeluarga: 53066477, tunjBeras: 63999140, cacatLain: 0, lainLain: 101939853, total: 2293006080 },
          potongan: { pph21: 97054000, askes: 12531000, tgr: 0, nonTgr: 6415000, lainLain: 0, total: 116000000 },
          netto: 2177006080
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 72, istriSuami: 0, anak: 10, cacat: 0, total: 82 },
          bruto: { pensiunPokok: 338280000, tunjKeluarga: 11608000, tunjBeras: 10472000, cacatLain: 0, lainLain: 16683000, total: 377043000 },
          potongan: { pph21: 16637239, askes: 2148967, tgr: 0, nonTgr: 1098074, lainLain: 0, total: 19884280 },
          netto: 357158720
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 8, istriSuami: 0, anak: 0, cacat: 0, total: 8 },
          bruto: { pensiunPokok: 39000000, tunjKeluarga: 1660000, tunjBeras: 1170000, cacatLain: 0, lainLain: 1855000, total: 43685000 },
          potongan: { pph21: 1850000, askes: 239000, tgr: 0, nonTgr: 124000, lainLain: 0, total: 2213000 },
          netto: 41472000
        }
      ],
      totalJiwa: { penerima: 1585, istriSuami: 361, anak: 214, cacat: 0, total: 2160 },
      totalBruto: { pensiunPokok: 9431850610, tunjKeluarga: 331664477, tunjBeras: 290911140, cacatLain: 0, lainLain: 463357853, total: 10517784080 },
      totalPotongan: { pph21: 462163239, askes: 59671967, tgr: 0, nonTgr: 30548074, lainLain: 0, total: 552383280 },
      totalNetto: 9965400800
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114)",
      singkatan: "PNS POLRI",
      kategori: "PNS POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 261, istriSuami: 75, anak: 48, cacat: 0, total: 384 },
          bruto: { pensiunPokok: 1655734000, tunjKeluarga: 63110000, tunjBeras: 49946000, cacatLain: 0, lainLain: 80019000, total: 1848809000 },
          potongan: { pph21: 79334000, askes: 11426000, tgr: 0, nonTgr: 6543000, lainLain: 0, total: 97303000 },
          netto: 1751506000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 94, istriSuami: 12, anak: 11, cacat: 0, total: 117 },
          bruto: { pensiunPokok: 492244820, tunjKeluarga: 12622008, tunjBeras: 14849440, cacatLain: 0, lainLain: 23789109, total: 543505377 },
          potongan: { pph21: 23585000, askes: 3396000, tgr: 0, nonTgr: 1945000, lainLain: 0, total: 28926000 },
          netto: 514579377
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 16, istriSuami: 0, anak: 3, cacat: 0, total: 19 },
          bruto: { pensiunPokok: 80500000, tunjKeluarga: 2756000, tunjBeras: 2420000, cacatLain: 0, lainLain: 3876000, total: 89552000 },
          potongan: { pph21: 3859141, askes: 555836, tgr: 0, nonTgr: 318800, lainLain: 0, total: 4733777 },
          netto: 84818223
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 2, istriSuami: 0, anak: 0, cacat: 0, total: 2 },
          bruto: { pensiunPokok: 9000000, tunjKeluarga: 400000, tunjBeras: 280000, cacatLain: 0, lainLain: 450000, total: 10130000 },
          potongan: { pph21: 430000, askes: 63000, tgr: 0, nonTgr: 36000, lainLain: 0, total: 529000 },
          netto: 9601000
        }
      ],
      totalJiwa: { penerima: 373, istriSuami: 87, anak: 62, cacat: 0, total: 522 },
      totalBruto: { pensiunPokok: 2237478820, tunjKeluarga: 78888008, tunjBeras: 67495440, cacatLain: 0, lainLain: 108134109, total: 2491996377 },
      totalPotongan: { pph21: 107208141, askes: 15440836, tgr: 0, nonTgr: 8842800, lainLain: 0, total: 131491777 },
      totalNetto: 2360504600
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122)",
      singkatan: "TNI",
      kategori: "TNI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 3595, istriSuami: 820, anak: 2130, cacat: 0, total: 6545 },
          bruto: { pensiunPokok: 22709277000, tunjKeluarga: 1072148000, tunjBeras: 840410000, cacatLain: 0, lainLain: 1353663000, total: 25995498000 },
          potongan: { pph21: 1347618000, askes: 135030000, tgr: 0, nonTgr: 207408000, lainLain: 0, total: 1690056000 },
          netto: 24305442000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 1335, istriSuami: 145, anak: 484, cacat: 0, total: 1964 },
          bruto: { pensiunPokok: 6751406440, tunjKeluarga: 214429078, tunjBeras: 249851440, cacatLain: 0, lainLain: 402440341, total: 7618127299 },
          potongan: { pph21: 400643000, askes: 40144000, tgr: 0, nonTgr: 61662000, lainLain: 0, total: 502449000 },
          netto: 7115678299
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 185, istriSuami: 0, anak: 90, cacat: 0, total: 275 },
          bruto: { pensiunPokok: 1107529000, tunjKeluarga: 47608000, tunjBeras: 40885000, cacatLain: 0, lainLain: 65854000, total: 1261876000 },
          potongan: { pph21: 65559493, askes: 6568689, tgr: 0, nonTgr: 10089317, lainLain: 0, total: 82217499 },
          netto: 1179658501
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 22, istriSuami: 0, anak: 0, cacat: 0, total: 22 },
          bruto: { pensiunPokok: 120000000, tunjKeluarga: 6000000, tunjBeras: 4544000, cacatLain: 0, lainLain: 7318000, total: 137862000 },
          potongan: { pph21: 7285000, askes: 731000, tgr: 0, nonTgr: 1122000, lainLain: 0, total: 9138000 },
          netto: 128724000
        }
      ],
      totalJiwa: { penerima: 5137, istriSuami: 965, anak: 2704, cacat: 0, total: 8806 },
      totalBruto: { pensiunPokok: 30688212440, tunjKeluarga: 1340185078, tunjBeras: 1135690440, cacatLain: 0, lainLain: 1829275341, total: 34993363299 },
      totalPotongan: { pph21: 1821105493, askes: 182473689, tgr: 0, nonTgr: 280281317, lainLain: 0, total: 2283860499 },
      totalNetto: 32709502800
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123)",
      singkatan: "POLRI",
      kategori: "POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 2308, istriSuami: 580, anak: 1550, cacat: 0, total: 4438 },
          bruto: { pensiunPokok: 14635950000, tunjKeluarga: 493151000, tunjBeras: 402313000, cacatLain: 0, lainLain: 773566000, total: 16304980000 },
          potongan: { pph21: 769569000, askes: 72691000, tgr: 0, nonTgr: 104366000, lainLain: 0, total: 946626000 },
          netto: 15358354000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 860, istriSuami: 104, anak: 352, cacat: 0, total: 1316 },
          bruto: { pensiunPokok: 4351228090, tunjKeluarga: 98630956, tunjBeras: 119606650, cacatLain: 0, lainLain: 229979098, total: 4799444794 },
          potongan: { pph21: 228791000, askes: 21610000, tgr: 0, nonTgr: 31027000, lainLain: 0, total: 281428000 },
          netto: 4518016794
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 114, istriSuami: 0, anak: 65, cacat: 0, total: 179 },
          bruto: { pensiunPokok: 716133000, tunjKeluarga: 22157000, tunjBeras: 19571000, cacatLain: 0, lainLain: 37845000, total: 795706000 },
          potongan: { pph21: 37649488, askes: 3556287, tgr: 0, nonTgr: 5105219, lainLain: 0, total: 46310994 },
          netto: 749395006
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 15, istriSuami: 0, anak: 0, cacat: 0, total: 15 },
          bruto: { pensiunPokok: 75000000, tunjKeluarga: 2500000, tunjBeras: 2176000, cacatLain: 0, lainLain: 3970000, total: 83646000 },
          potongan: { pph21: 3950000, askes: 374000, tgr: 0, nonTgr: 538000, lainLain: 0, total: 4862000 },
          netto: 78784000
        }
      ],
      totalJiwa: { penerima: 3297, istriSuami: 684, anak: 1967, cacat: 0, total: 5948 },
      totalBruto: { pensiunPokok: 19778311090, tunjKeluarga: 616438956, tunjBeras: 543666650, cacatLain: 0, lainLain: 1045360098, total: 21983776794 },
      totalPotongan: { pph21: 1039959488, askes: 98231287, tgr: 0, nonTgr: 141036219, lainLain: 0, total: 1279226994 },
      totalNetto: 20704549800
    }
  ];

  // Filter DAPEM
  const filteredDapemList = dapemData.filter(d => {
    if (filterKelompok !== "Semua" && d.namaKelompok !== filterKelompok) return false;
    if (selectedDropdownDapem !== "semua" && d.kodeMAK !== selectedDropdownDapem) return false;
    return true;
  });

  // Grand Totals
  const grandTotalJiwa = {
    penerima: dapemData.reduce((a, d) => a + d.totalJiwa.penerima, 0),
    istriSuami: dapemData.reduce((a, d) => a + d.totalJiwa.istriSuami, 0),
    anak: dapemData.reduce((a, d) => a + d.totalJiwa.anak, 0),
    cacat: dapemData.reduce((a, d) => a + d.totalJiwa.cacat, 0),
    total: dapemData.reduce((a, d) => a + d.totalJiwa.total, 0),
  };

  const grandTotalBruto = {
    pensiunPokok: dapemData.reduce((a, d) => a + d.totalBruto.pensiunPokok, 0),
    tunjKeluarga: dapemData.reduce((a, d) => a + d.totalBruto.tunjKeluarga, 0),
    tunjBeras: dapemData.reduce((a, d) => a + d.totalBruto.tunjBeras, 0),
    cacatLain: dapemData.reduce((a, d) => a + d.totalBruto.cacatLain, 0),
    lainLain: dapemData.reduce((a, d) => a + d.totalBruto.lainLain, 0),
    total: dapemData.reduce((a, d) => a + d.totalBruto.total, 0),
  };

  const grandTotalPotongan = {
    pph21: dapemData.reduce((a, d) => a + d.totalPotongan.pph21, 0),
    askes: dapemData.reduce((a, d) => a + d.totalPotongan.askes, 0),
    tgr: dapemData.reduce((a, d) => a + d.totalPotongan.tgr, 0),
    nonTgr: dapemData.reduce((a, d) => a + d.totalPotongan.nonTgr, 0),
    lainLain: dapemData.reduce((a, d) => a + d.totalPotongan.lainLain, 0),
    total: dapemData.reduce((a, d) => a + d.totalPotongan.total, 0),
  };

  const grandTotalNetto = dapemData.reduce((a, d) => a + d.totalNetto, 0);

  // Grand total per jenis pensiun
  const jenisKeys = ["a", "b", "c", "d"];
  const grandTotalJenisList = jenisKeys.map(k => {
    const matching = dapemData.map(d => d.jenisList.find(j => j.id === k)).filter(Boolean);
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
        {/* Kolom Jenis Pensiun */}
        <td style={{ padding: "9px 12px", fontWeight: textWeight, color: labelColor, verticalAlign: "top", borderRight: `1px solid #E2E8F0` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isSubtotal ? <strong style={{ color: "#0F172A" }}>{customLabel || "TOTAL / SUBTOTAL"}</strong> : <span>{jenis.nama}</span>}
          </div>
        </td>

        {/* Kolom Jumlah Jiwa (A, B, C, D, TOTAL) */}
        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Penerima:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.penerima)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. Istri/Suami:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.istriSuami)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>C. Anak:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.anak)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>D. Cacat:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.cacat)}</strong></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#0F172A" }}>
              <span>Total Jiwa:</span> <span style={{ fontFamily: "monospace" }}>{fmtJiwa(jenis.jiwa.total)}</span>
            </div>
          </div>
        </td>

        {/* Kolom Jumlah Bruto (A, B, C, D, E, TOTAL) */}
        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Pokok:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.pensiunPokok)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. T.Keluarga:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjKeluarga)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>C. T.Beras:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjBeras)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>D. Cacat:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.cacatLain)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>E. Lain-lain:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.lainLain)}</span></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#15803D" }}>
              <span>Total Bruto:</span> <span style={{ fontFamily: "monospace" }}>{fmt(jenis.bruto.total)}</span>
            </div>
          </div>
        </td>

        {/* Kolom Potongan PPH 21 */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.pph21)}
        </td>

        {/* Kolom Potongan ASKES */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.askes)}
        </td>

        {/* Kolom Potongan TGR */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: jenis.potongan.tgr > 0 ? "#DC2626" : "#94A3B8" }}>
          {fmt(jenis.potongan.tgr)}
        </td>

        {/* Kolom Potongan Non TGR */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#1E293B" }}>
          {fmt(jenis.potongan.nonTgr)}
        </td>

        {/* Kolom Potongan Lain-lain */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: jenis.potongan.lainLain > 0 ? "#D97706" : "#94A3B8" }}>
          {fmt(jenis.potongan.lainLain)}
        </td>

        {/* Kolom Jumlah Potongan */}
        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontSize: 12, fontWeight: 700, verticalAlign: "middle", borderRight: `1px solid #E2E8F0`, color: "#DC2626", background: isSubtotal ? "#FEE2E2" : "#FEF2F2" }}>
          {fmt(jenis.potongan.total)}
        </td>

        {/* Kolom Jumlah Netto */}
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

      {/* Stat Cards Ringkasan */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard
          icon={<Users size={IC} />}
          label="Total Jiwa & Penerima"
          value={`${fmtJiwa(grandTotalJiwa.total)} Jiwa`}
          sub={`${fmtJiwa(grandTotalJiwa.penerima)} Penerima • ${fmtJiwa(grandTotalJiwa.istriSuami)} Pasangan • ${fmtJiwa(grandTotalJiwa.anak)} Anak`}
          color={COLORS.blue}
        />
        <StatCard
          icon={<Banknote size={IC} />}
          label="Total Jumlah Bruto"
          value={fmt(grandTotalBruto.total)}
          sub={`Pokok ${fmt(grandTotalBruto.pensiunPokok)} + Tunjangan`}
          color={COLORS.green}
        />
        <StatCard
          icon={<Receipt size={IC} />}
          label="Total Potongan"
          value={fmt(grandTotalPotongan.total)}
          sub={`PPh21 ${fmt(grandTotalPotongan.pph21)} • Askes ${fmt(grandTotalPotongan.askes)}`}
          color={COLORS.red}
        />
        <StatCard
          icon={<Wallet size={IC} />}
          label="Total Netto Disalurkan"
          value={fmt(grandTotalNetto)}
          sub="Realisasi Bersih Pembayaran Pensiun"
          color={COLORS.blueDark}
        />
      </div>

      {/* CARD TUNGGAL: DAFTAR DAPEM + FILTER TERINTEGRASI */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid #CBD5E1`, marginBottom: 24, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
        
        {/* CORPORATE UNIFIED CONTROL TOOLBAR */}
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
          {/* Baris 1: Segmented Control Kelompok DAPEM (Kiri) & Action Buttons (Kanan) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #E2E8F0", paddingBottom: 11 }}>
            {/* Segmented Controller Tab */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>
                Kelompok DAPEM:
              </span>
              <div style={{ display: "inline-flex", background: "#E2E8F0", padding: 3, borderRadius: 7, gap: 3 }}>
                {[
                  { id: "semua", label: "Semua (4 DAPEM)" },
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

            {/* Action Buttons */}
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
                  transition: "all 0.18s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFFFFF"}
                title="Tutup seluruh rincian sub-detail DAPEM"
              >
                <ChevronDown size={14} color="#475569" style={{ transform: "rotate(180deg)" }} />
                <span>Tutup Semua Detail</span>
              </button>

              <Btn
                variant="primary"
                size="sm"
                onClick={() => {
                  setPreview({
                    title: "Daftar Rekapitulasi III DAPEM & Non DAPEM",
                    subtitle: `${filterPeriode} • ${filterPenyaluran} — Rekapitulasi Pembayaran Pensiun Resmi`,
                    type: "table",
                    fileName: `Daftar_Rekapitulasi_III_DAPEM_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                    content: {
                      columns: ["No", "Kelompok Pensiun (MAK)", "Jenis Pensiun", "Total Jiwa", "Pensiun Pokok", "Total Bruto", "PPh 21", "ASKES", "Non TGR", "Total Potongan", "Jumlah Netto"],
                      rows: dapemData.flatMap(d => [
                        ...d.jenisList.map(j => [d.no, d.namaKelompok, j.nama, j.jiwa.total.toLocaleString(), fmt(j.bruto.pensiunPokok), fmt(j.bruto.total), fmt(j.potongan.pph21), fmt(j.potongan.askes), fmt(j.potongan.nonTgr), fmt(j.potongan.total), fmt(j.netto)]),
                        ["", `SUBTOTAL ${d.singkatan}`, "TOTAL", d.totalJiwa.total.toLocaleString(), fmt(d.totalBruto.pensiunPokok), fmt(d.totalBruto.total), fmt(d.totalPotongan.pph21), fmt(d.totalPotongan.askes), fmt(d.totalPotongan.nonTgr), fmt(d.totalPotongan.total), fmt(d.totalNetto)],
                      ]),
                      totalRows: dapemData.length * 5,
                    }
                  });
                }}
              >
                <Download size={14} /> Ekspor Data
              </Btn>
            </div>
          </div>

          {/* Baris 2: Parameter Filter Dropdown Rinci */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
              <Filter size={13} color="#64748B" />
              <span style={{ fontWeight: 600 }}>Filter Rincian:</span>
            </div>

            {/* Filter Jenis Pensiun */}
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

            {/* Filter Tanggal / Periode SP */}
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

            {/* Filter Metode Penyaluran */}
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

            {/* Reset Filter Button */}
            {(selectedDropdownDapem !== "semua" || filterJenisPensiun !== "Semua") && (
              <button
                onClick={() => {
                  setSelectedDropdownDapem("semua");
                  setFilterJenisPensiun("Semua");
                }}
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  color: "#B91C1C",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginLeft: "auto"
                }}
              >
                ✕ Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* TABEL LIST REKAPITULASI III (NETRAL SERAGAM & KONTRAS TINGGI) */}
        {filteredDapemList.length === 0 ? (
          <NoData />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredDapemList.map((dapem) => {
              const isOpen = !!expandedDapem[dapem.kodeMAK];

              return (
                <div key={dapem.kodeMAK} style={{ borderRadius: 8, border: `1px solid #CBD5E1`, overflow: "hidden", background: COLORS.white, boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}>
                  {/* DAPEM Card Header Netral & Seragam (Clickable Accordion) */}
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
                      <div style={{ width: 26, height: 26, borderRadius: 4, background: "#334155", color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {dapem.no}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                          {dapem.namaKelompok}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
                          MAK: <strong style={{ color: "#334155" }}>{dapem.kodeMAK}</strong> • {fmtJiwa(dapem.totalJiwa.total)} Jiwa ({fmtJiwa(dapem.totalJiwa.penerima)} Penerima)
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
                      <div style={{ textAlign: "right", background: "#FFFFFF", border: `1.5px solid #0F172A`, padding: "4px 12px", borderRadius: 6 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>Jumlah Netto</div>
                        <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "monospace", color: "#0F172A" }}>{fmt(dapem.totalNetto)}</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#475569", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Body: Detail Matrix Table per DAPEM */}
                  {isOpen && (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 220, borderRight: `1px solid #E2E8F0` }}>JENIS PENSIUN</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 170, borderRight: `1px solid #E2E8F0` }}>JUMLAH JIWA</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 210, borderRight: `1px solid #E2E8F0` }}>JUMLAH BRUTO</th>
                            <th colSpan={6} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, color: "#64748B", borderBottom: `1px solid #E2E8F0`, borderRight: `1px solid #E2E8F0` }}>POTONGAN</th>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#1D4ED8", width: 160 }}>JUMLAH NETTO</th>
                          </tr>
                          <tr style={{ background: "#F1F5F9", color: "#475569", fontSize: 11 }}>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>PPh 21</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>ASKES</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>TGR</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>NON TGR</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>Lain-Lain</th>
                            <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, color: "#BE123C", borderRight: `1px solid #CBD5E1` }}>Jumlah</th>
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
                            `TOTAL SUBTOTAL (${dapem.singkatan})`
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            {/* GRAND TOTAL SUMMARY CARD (SESUAI SHEET EXCEL) */}
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
                  <Shield size={20} color="#F59E0B" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.white, letterSpacing: 0.3 }}>
                      JUMLAH GRAND TOTAL (SELURUH KELOMPOK PENSIUN DAPEM)
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                      4 Kelompok Pensiun • {fmtJiwa(grandTotalJiwa.total)} Total Jiwa • {fmtJiwa(grandTotalJiwa.penerima)} Penerima Manfaat
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
                  <div style={{ textAlign: "right", background: "#F59E0B", color: "#0F172A", padding: "5px 14px", borderRadius: 6 }}>
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
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 220, borderRight: `1px solid #E2E8F0` }}>REKAP PER JENIS PENSIUN</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 170, borderRight: `1px solid #E2E8F0` }}>JUMLAH JIWA</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 210, borderRight: `1px solid #E2E8F0` }}>JUMLAH BRUTO</th>
                        <th colSpan={6} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, color: "#64748B", borderBottom: `1px solid #E2E8F0`, borderRight: `1px solid #E2E8F0` }}>TOTAL POTONGAN GABUNGAN</th>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#1D4ED8", width: 160 }}>JUMLAH NETTO</th>
                      </tr>
                      <tr style={{ background: "#F1F5F9", color: "#475569", fontSize: 11 }}>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>PPh 21</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>ASKES</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>TGR</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>NON TGR</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600, color: "#475569", borderRight: `1px solid #CBD5E1` }}>Lain-Lain</th>
                        <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, color: "#BE123C", borderRight: `1px solid #CBD5E1` }}>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grandTotalJenisList.map((jenis, jIdx) => renderJenisRows(jenis, jIdx))}
                      {renderJenisRows(
                        {
                          id: "grandtotal",
                          nama: "GRAND TOTAL SELURUHNYA",
                          jiwa: grandTotalJiwa,
                          bruto: grandTotalBruto,
                          potongan: grandTotalPotongan,
                          netto: grandTotalNetto
                        },
                        999,
                        true,
                        "GRAND TOTAL REKAPITULASI III"
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
