import { useState } from "react";
import { Users, Banknote, Receipt, Wallet, Download, ChevronDown, Filter, Shield, HeartHandshake, Award } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, Btn, NoData, PreviewModal } from "../components/common";

export const NonDapemRekap = () => {
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [filterJenisNonDapem, setFilterJenisNonDapem] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;
  const [filterPenyaluran, setFilterPenyaluran] = useState("Gabungan POS dan Bank");
  const [selectedDropdownMAK, setSelectedDropdownMAK] = useState("semua");
  const [expandedMAK, setExpandedMAK] = useState({
    "513113": true,
    "513114": false,
    "513122": false,
    "513123": false,
    "total": false,
  });
  const [preview, setPreview] = useState(null);

  const fmt = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
  const fmtJiwa = (n) => (n || 0).toLocaleString("id-ID");

  // Data Rekapitulasi III NON-DAPEM (PP, UKP, UDW Berdasarkan 4 Kelompok MAK)
  const nonDapemData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113) — NON-DAPEM",
      singkatan: "PNS Kemhan",
      kategori: "PNS KEMHAN",
      jenisList: [
        {
          id: "a",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 45, istriSuami: 12, anak: 8, cacat: 0, total: 65 },
          bruto: { pokok: 198000000, tunjKeluarga: 12400000, tunjBeras: 8900000, cacatLain: 0, lainLain: 15200000, total: 234500000 },
          potongan: { pph21: 11200000, askes: 1450000, nonTgr: 780000, total: 13430000 },
          netto: 221070000
        },
        {
          id: "b",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 82, istriSuami: 18, anak: 14, cacat: 0, total: 114 },
          bruto: { pokok: 142000000, tunjKeluarga: 6800000, tunjBeras: 5400000, cacatLain: 0, lainLain: 8200000, total: 162400000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 162400000
        },
        {
          id: "c",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 18, istriSuami: 0, anak: 0, cacat: 0, total: 18 },
          bruto: { pokok: 144000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 144000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 144000000
        }
      ],
      totalJiwa: { penerima: 145, istriSuami: 30, anak: 22, cacat: 0, total: 197 },
      totalBruto: { pokok: 484000000, tunjKeluarga: 19200000, tunjBeras: 14300000, cacatLain: 0, lainLain: 23400000, total: 540900000 },
      totalPotongan: { pph21: 11200000, askes: 1450000, nonTgr: 780000, total: 13430000 },
      totalNetto: 527470000
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114) — NON-DAPEM",
      singkatan: "PNS Polri",
      kategori: "PNS POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 16, istriSuami: 4, anak: 3, cacat: 0, total: 23 },
          bruto: { pokok: 72000000, tunjKeluarga: 4100000, tunjBeras: 3100000, cacatLain: 0, lainLain: 5200000, total: 84400000 },
          potongan: { pph21: 3950000, askes: 520000, nonTgr: 280000, total: 4750000 },
          netto: 79650000
        },
        {
          id: "b",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 31, istriSuami: 6, anak: 4, cacat: 0, total: 41 },
          bruto: { pokok: 52000000, tunjKeluarga: 2400000, tunjBeras: 1800000, cacatLain: 0, lainLain: 3100000, total: 59300000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 59300000
        },
        {
          id: "c",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 6, istriSuami: 0, anak: 0, cacat: 0, total: 6 },
          bruto: { pokok: 48000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 48000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 48000000
        }
      ],
      totalJiwa: { penerima: 53, istriSuami: 10, anak: 7, cacat: 0, total: 70 },
      totalBruto: { pokok: 172000000, tunjKeluarga: 6500000, tunjBeras: 4900000, cacatLain: 0, lainLain: 8300000, total: 191700000 },
      totalPotongan: { pph21: 3950000, askes: 520000, nonTgr: 280000, total: 4750000 },
      totalNetto: 186950000
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122) — NON-DAPEM",
      singkatan: "TNI",
      kategori: "TNI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 310, istriSuami: 78, anak: 190, cacat: 0, total: 578 },
          bruto: { pokok: 980000000, tunjKeluarga: 54000000, tunjBeras: 42000000, cacatLain: 0, lainLain: 68000000, total: 1144000000 },
          potongan: { pph21: 56400000, askes: 5800000, nonTgr: 3800000, total: 66000000 },
          netto: 1078000000
        },
        {
          id: "b",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 490, istriSuami: 105, anak: 85, cacat: 0, total: 680 },
          bruto: { pokok: 590000000, tunjKeluarga: 28000000, tunjBeras: 22000000, cacatLain: 0, lainLain: 36000000, total: 676000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 676000000
        },
        {
          id: "c",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 94, istriSuami: 0, anak: 0, cacat: 0, total: 94 },
          bruto: { pokok: 590000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 590000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 590000000
        }
      ],
      totalJiwa: { penerima: 894, istriSuami: 183, anak: 275, cacat: 0, total: 1352 },
      totalBruto: { pokok: 2160000000, tunjKeluarga: 82000000, tunjBeras: 64000000, cacatLain: 0, lainLain: 104000000, total: 2410000000 },
      totalPotongan: { pph21: 56400000, askes: 5800000, nonTgr: 3800000, total: 66000000 },
      totalNetto: 2344000000
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123) — NON-DAPEM",
      singkatan: "POLRI",
      kategori: "POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 145, istriSuami: 36, anak: 95, cacat: 0, total: 276 },
          bruto: { pokok: 450000000, tunjKeluarga: 24500000, tunjBeras: 19200000, cacatLain: 0, lainLain: 31100000, total: 524800000 },
          potongan: { pph21: 25800000, askes: 2650000, nonTgr: 1750000, total: 30200000 },
          netto: 494600000
        },
        {
          id: "b",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 210, istriSuami: 45, anak: 38, cacat: 0, total: 293 },
          bruto: { pokok: 250000000, tunjKeluarga: 12000000, tunjBeras: 9400000, cacatLain: 0, lainLain: 15600000, total: 287000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 287000000
        },
        {
          id: "c",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 42, istriSuami: 0, anak: 0, cacat: 0, total: 42 },
          bruto: { pokok: 268000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 268000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 268000000
        }
      ],
      totalJiwa: { penerima: 397, istriSuami: 81, anak: 133, cacat: 0, total: 611 },
      totalBruto: { pokok: 968000000, tunjKeluarga: 36500000, tunjBeras: 28600000, cacatLain: 0, lainLain: 46700000, total: 1079800000 },
      totalPotongan: { pph21: 25800000, askes: 2650000, nonTgr: 1750000, total: 30200000 },
      totalNetto: 1049600000
    }
  ];

  const filteredNonDapemList = nonDapemData.filter(d => {
    if (filterKelompok !== "Semua" && d.namaKelompok !== filterKelompok) return false;
    if (selectedDropdownMAK !== "semua" && d.kodeMAK !== selectedDropdownMAK) return false;
    return true;
  });

  const grandTotalJiwa = {
    penerima: nonDapemData.reduce((a, d) => a + d.totalJiwa.penerima, 0),
    istriSuami: nonDapemData.reduce((a, d) => a + d.totalJiwa.istriSuami, 0),
    anak: nonDapemData.reduce((a, d) => a + d.totalJiwa.anak, 0),
    cacat: nonDapemData.reduce((a, d) => a + d.totalJiwa.cacat, 0),
    total: nonDapemData.reduce((a, d) => a + d.totalJiwa.total, 0),
  };

  const grandTotalBruto = {
    pokok: nonDapemData.reduce((a, d) => a + d.totalBruto.pokok, 0),
    tunjKeluarga: nonDapemData.reduce((a, d) => a + d.totalBruto.tunjKeluarga, 0),
    tunjBeras: nonDapemData.reduce((a, d) => a + d.totalBruto.tunjBeras, 0),
    cacatLain: nonDapemData.reduce((a, d) => a + d.totalBruto.cacatLain, 0),
    lainLain: nonDapemData.reduce((a, d) => a + d.totalBruto.lainLain, 0),
    total: nonDapemData.reduce((a, d) => a + d.totalBruto.total, 0),
  };

  const grandTotalPotongan = {
    pph21: nonDapemData.reduce((a, d) => a + d.totalPotongan.pph21, 0),
    askes: nonDapemData.reduce((a, d) => a + d.totalPotongan.askes, 0),
    nonTgr: nonDapemData.reduce((a, d) => a + d.totalPotongan.nonTgr, 0),
    total: nonDapemData.reduce((a, d) => a + d.totalPotongan.total, 0),
  };

  const grandTotalNetto = nonDapemData.reduce((a, d) => a + d.totalNetto, 0);

  const jenisKeys = ["a", "b", "c"];
  const grandTotalJenisList = jenisKeys.map(k => {
    const matching = nonDapemData.map(d => d.jenisList.find(j => j.id === k)).filter(Boolean);
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
        pokok: matching.reduce((a, m) => a + m.bruto.pokok, 0),
        tunjKeluarga: matching.reduce((a, m) => a + m.bruto.tunjKeluarga, 0),
        tunjBeras: matching.reduce((a, m) => a + m.bruto.tunjBeras, 0),
        cacatLain: 0,
        lainLain: matching.reduce((a, m) => a + m.bruto.lainLain, 0),
        total: matching.reduce((a, m) => a + m.bruto.total, 0),
      },
      potongan: {
        pph21: matching.reduce((a, m) => a + m.potongan.pph21, 0),
        askes: matching.reduce((a, m) => a + m.potongan.askes, 0),
        nonTgr: matching.reduce((a, m) => a + m.potongan.nonTgr, 0),
        total: matching.reduce((a, m) => a + m.potongan.total, 0),
      },
      netto: matching.reduce((a, m) => a + m.netto, 0),
    };
  });

  const toggleExpand = (kode) => {
    setExpandedMAK(prev => ({ ...prev, [kode]: !prev[kode] }));
  };

  const renderJenisRows = (jenis, index, isSubtotal = false, customLabel = null) => {
    const isFilteredOut = filterJenisNonDapem !== "Semua" && jenis.nama !== filterJenisNonDapem && !isSubtotal;
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
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Penerima/Klaim:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.penerima)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. Tanggungan:</span> <strong style={{ fontFamily: "monospace", color: "#0F172A" }}>{fmtJiwa(jenis.jiwa.istriSuami + jenis.jiwa.anak)}</strong></div>
            <div style={{ borderTop: `1px dashed #CBD5E1`, paddingTop: 2, marginTop: 2, display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 800, color: "#0F172A" }}>
              <span>Total Jiwa/Berkas:</span> <span style={{ fontFamily: "monospace" }}>{fmtJiwa(jenis.jiwa.total)}</span>
            </div>
          </div>
        </td>

        <td style={{ padding: "7px 10px", fontSize: 11.5, verticalAlign: "top", borderRight: `1px solid #E2E8F0`, whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>A. Pokok/Santunan:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.pokok)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "#64748B" }}>B. T.Keluarga/Beras:</span> <span style={{ fontFamily: "monospace", color: "#1E293B" }}>{fmt(jenis.bruto.tunjKeluarga + jenis.bruto.tunjBeras)}</span></div>
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
        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 12.5, fontWeight: 800, verticalAlign: "middle", color: "#0F172A", background: isSubtotal ? "#FAF5FF" : "#FDF4FF" }}>
          {fmt(jenis.netto)}
        </td>
      </tr>
    );
  };

  const closeAllDetails = () => {
    setExpandedMAK({
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

      {/* Stat Cards Ringkasan Non-Dapem */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard
          icon={<Users size={IC} />}
          label="Total Jiwa & Klaim Non-Dapem"
          value={`${fmtJiwa(grandTotalJiwa.total)} Jiwa/Berkas`}
          sub={`${fmtJiwa(grandTotalJiwa.penerima)} Penerima Manfaat Sisipan`}
          color="#7E22CE"
        />
        <StatCard
          icon={<Banknote size={IC} />}
          label="Total Bruto Non-Dapem"
          value={fmt(grandTotalBruto.total)}
          sub={`Santunan Pokok ${fmt(grandTotalBruto.pokok)} + Penyesuaian`}
          color={COLORS.green}
        />
        <StatCard
          icon={<Receipt size={IC} />}
          label="Total Potongan Resmi"
          value={fmt(grandTotalPotongan.total)}
          sub={`PPh21 ${fmt(grandTotalPotongan.pph21)} • Askes ${fmt(grandTotalPotongan.askes)}`}
          color={COLORS.red}
        />
        <StatCard
          icon={<Wallet size={IC} />}
          label="Total Netto Disalurkan"
          value={fmt(grandTotalNetto)}
          sub="Realisasi Sisipan PP, UKP, dan UDW"
          color={COLORS.blueDark}
        />
      </div>

      {/* CARD UTAMA REKAPITULASI NON-DAPEM */}
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
          {/* Baris 1: Segmented Control Kelompok MAK Non-Dapem & Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #E2E8F0", paddingBottom: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>
                Kelompok MAK Non-Dapem:
              </span>
              <div style={{ display: "inline-flex", background: "#E2E8F0", padding: 3, borderRadius: 7, gap: 3 }}>
                {[
                  { id: "semua", label: "Semua (4 MAK)" },
                  { id: "513113", label: "PNS KEMHAN (513113)" },
                  { id: "513114", label: "PNS POLRI (513114)" },
                  { id: "513122", label: "TNI (513122)" },
                  { id: "513123", label: "POLRI (513123)" },
                ].map((item) => {
                  const isSelected = selectedDropdownMAK === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDropdownMAK(item.id);
                        if (item.id !== "semua") {
                          setExpandedMAK(prev => ({ ...prev, [item.id]: true }));
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
                    title: "Daftar Rekapitulasi Pembayaran NON-DAPEM",
                    subtitle: `${filterPeriode} • ${filterPenyaluran} — Rekapitulasi Klaim PP, UKP, dan UDW Resmi`,
                    type: "table",
                    fileName: `Rekapitulasi_NonDapem_${filterPeriode.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                    content: {
                      columns: ["No", "Kelompok MAK", "Jenis Non-Dapem", "Total Jiwa", "Bruto Pokok", "Total Bruto", "PPh 21", "ASKES", "Total Potongan", "Jumlah Netto"],
                      rows: nonDapemData.flatMap(d => [
                        ...d.jenisList.map(j => [d.no, d.namaKelompok, j.nama, j.jiwa.total.toLocaleString(), fmt(j.bruto.pokok), fmt(j.bruto.total), fmt(j.potongan.pph21), fmt(j.potongan.askes), fmt(j.potongan.total), fmt(j.netto)]),
                        ["", `SUBTOTAL ${d.singkatan} (NON-DAPEM)`, "TOTAL", d.totalJiwa.total.toLocaleString(), fmt(d.totalBruto.pokok), fmt(d.totalBruto.total), fmt(d.totalPotongan.pph21), fmt(d.totalPotongan.askes), fmt(d.totalPotongan.total), fmt(d.totalNetto)],
                      ]),
                      totalRows: nonDapemData.length * 4,
                    }
                  });
                }}
              >
                <Download size={14} /> Ekspor Non-Dapem
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
              <span style={{ fontSize: 12, color: "#64748B" }}>Jenis Non-Dapem:</span>
              <select
                value={filterJenisNonDapem}
                onChange={e => setFilterJenisNonDapem(e.target.value)}
                style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid #CBD5E1", fontSize: 12, color: "#0F172A", background: "#FFFFFF", fontWeight: 600 }}
              >
                <option value="Semua">Semua Jenis Non-Dapem</option>
                <option value="a. Pembayaran Pertama (PP) — Pensiun Terusan">a. Pembayaran Pertama (PP)</option>
                <option value="b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak">b. Uang Kekurangan Pensiun (UKP)</option>
                <option value="c. Uang Duka Wafat (UDW) — Santunan Kematian">c. Uang Duka Wafat (UDW)</option>
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
                <option value="PT POS Indonesia">PT POS Indonesia (Wesel & Giro)</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABEL ACCORDION MAK NON-DAPEM */}
        {filteredNonDapemList.length === 0 ? (
          <NoData />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredNonDapemList.map((dapem) => {
              const isOpen = !!expandedMAK[dapem.kodeMAK];

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
                      <div style={{ width: 26, height: 26, borderRadius: 4, background: "#7E22CE", color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {dapem.no}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                          {dapem.namaKelompok}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>
                          MAK: <strong style={{ color: "#334155" }}>{dapem.kodeMAK}</strong> • {fmtJiwa(dapem.totalJiwa.total)} Jiwa/Berkas ({fmtJiwa(dapem.totalJiwa.penerima)} Penerima Manfaat)
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
                      <div style={{ textAlign: "right", background: "#FFFFFF", border: `1.5px solid #7E22CE`, padding: "4px 12px", borderRadius: 6 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", color: "#7E22CE", fontWeight: 700 }}>Jumlah Netto</div>
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
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, width: 280, borderRight: `1px solid #E2E8F0` }}>JENIS PEMBAYARAN NON-DAPEM</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, width: 170, borderRight: `1px solid #E2E8F0` }}>JUMLAH JIWA / BERKAS</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, width: 210, borderRight: `1px solid #E2E8F0` }}>JUMLAH BRUTO</th>
                            <th colSpan={3} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, borderBottom: `1px solid #E2E8F0`, borderRight: `1px solid #E2E8F0` }}>POTONGAN</th>
                            <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, width: 110, borderRight: `1px solid #E2E8F0`, color: "#DC2626" }}>TOTAL POTONGAN</th>
                            <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#7E22CE", width: 160 }}>JUMLAH NETTO</th>
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
                            `SUBTOTAL (${dapem.singkatan} NON-DAPEM)`
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            {/* GRAND TOTAL SUMMARY CARD NON-DAPEM */}
            <div style={{ borderRadius: 8, border: `1.5px solid #0F172A`, overflow: "hidden", background: COLORS.white, marginTop: 6 }}>
              <div
                onClick={() => toggleExpand("total")}
                style={{
                  padding: "13px 18px",
                  background: "#0F172A",
                  color: COLORS.white,
                  borderBottom: expandedMAK["total"] ? `1px solid #334155` : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Award size={20} color="#C084FC" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.white, letterSpacing: 0.3 }}>
                      GRAND TOTAL SELURUH PEMBAYARAN NON-DAPEM (PP, UKP, UDW)
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                      4 Kelompok MAK • {fmtJiwa(grandTotalJiwa.total)} Total Jiwa/Berkas • {fmtJiwa(grandTotalJiwa.penerima)} Penerima Manfaat
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
                  <div style={{ textAlign: "right", background: "#7E22CE", color: COLORS.white, padding: "5px 14px", borderRadius: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Grand Total Netto</div>
                    <div style={{ fontWeight: 900, fontSize: 16, fontFamily: "monospace" }}>{fmt(grandTotalNetto)}</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#94A3B8", transform: expandedMAK["total"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </div>
                </div>
              </div>

              {expandedMAK["total"] && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 280, borderRight: `1px solid #E2E8F0` }}>REKAP NON-DAPEM PER JENIS</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 170, borderRight: `1px solid #E2E8F0` }}>JUMLAH JIWA / BERKAS</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "left", fontWeight: 800, color: "#64748B", width: 210, borderRight: `1px solid #E2E8F0` }}>JUMLAH BRUTO</th>
                        <th colSpan={3} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, color: "#64748B", borderBottom: `1px solid #E2E8F0`, borderRight: `1px solid #E2E8F0` }}>POTONGAN</th>
                        <th rowSpan={2} style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, width: 110, borderRight: `1px solid #E2E8F0`, color: "#DC2626" }}>TOTAL POTONGAN</th>
                        <th rowSpan={2} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#7E22CE", width: 160 }}>JUMLAH NETTO</th>
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
                          nama: "GRAND TOTAL NON-DAPEM SELURUHNYA",
                          jiwa: grandTotalJiwa,
                          bruto: grandTotalBruto,
                          potongan: grandTotalPotongan,
                          netto: grandTotalNetto
                        },
                        999,
                        true,
                        "GRAND TOTAL REKAPITULASI NON-DAPEM"
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
