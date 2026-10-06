import { useState } from "react";
import {
  Users,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const KreditPiutang = () => {
  const [filterJenis, setFilterJenis] = useState("Semua"); // "Semua", "UDW Punah", "Anak Yatim Menikah", "Janda/Duda Menikah Lagi"
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua"); // "Semua", "Dikembalikan", "Ditagih", "Terlambat"
  const [searchQuery, setSearchQuery] = useState("");
  const [preview, setPreview] = useState(null);

  // Data Kasus Monitoring Penagihan Keterlanjuran Bayar (UDW Punah, Anak Yatim Menikah, Janda/Duda Menikah Lagi)
  const allKasus = [
    {
      no: 1,
      ref: "KB-UDW/2026/01/001",
      jenis: "UDW Punah",
      nama: "Kolonel Inf. (Purn) Agus Setiawan",
      nrp: "11020014250",
      satker: "TNI AD",
      unor: "Kodam Jaya",
      jumlah: 15420000,
      tglPengajuan: "18 Jan 2026",
      jatuhTempo: "01 Feb 2026",
      tglBayar: null,
      status: "Ditagih",
      hariTerlambat: 0,
      keterangan: "Penerima pensiun wafat punah tanpa ahli waris berhak."
    },
    {
      no: 2,
      ref: "KB-JDM/2026/01/014",
      jenis: "Janda/Duda Menikah Lagi",
      nama: "Ny. Siti Rahayu (Janda Alm. Kapten Laut Joko)",
      nrp: "31040058190",
      satker: "TNI AL",
      unor: "Koarmada II",
      jumlah: 8450000,
      tglPengajuan: "10 Jan 2026",
      jatuhTempo: "24 Jan 2026",
      tglBayar: "22 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0,
      keterangan: "Janda telah menikah lagi per Nov 2025, dana Des-Jan dikembalikan."
    },
    {
      no: 3,
      ref: "KB-AYM/2026/01/028",
      jenis: "Anak Yatim Menikah",
      nama: "Rian Hidayat (Anak Alm. Letkol Pol. Wahyu)",
      nrp: "5201089201",
      satker: "POLRI",
      unor: "Polda Jabar",
      jumlah: 6200000,
      tglPengajuan: "15 Jan 2026",
      jatuhTempo: "29 Jan 2026",
      tglBayar: null,
      status: "Terlambat",
      hariTerlambat: 12,
      keterangan: "Anak yatim telah melangsungkan pernikahan pada Des 2025."
    },
    {
      no: 4,
      ref: "KB-UDW/2026/01/042",
      jenis: "UDW Punah",
      nama: "Ny. Ratna Sari (Warakawuri Punah)",
      nrp: "PNS-00125492",
      satker: "PNS Kemhan",
      unor: "Ditjen Renhan",
      jumlah: 12800000,
      tglPengajuan: "14 Jan 2026",
      jatuhTempo: "28 Jan 2026",
      tglBayar: "26 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0,
      keterangan: "Pensiunan janda punah tanpa anak di bawah 25 thn."
    },
    {
      no: 5,
      ref: "KB-AYM/2026/01/067",
      jenis: "Anak Yatim Menikah",
      nama: "Dewi Anggraini (Anak Alm. Mayor Arh. Bambang)",
      nrp: "21030044120",
      satker: "TNI AD",
      unor: "Kodam IV Diponegoro",
      jumlah: 7800000,
      tglPengajuan: "20 Jan 2026",
      jatuhTempo: "03 Feb 2026",
      tglBayar: null,
      status: "Ditagih",
      hariTerlambat: 0,
      keterangan: "Anak yatim menikah per Jan 2026, surat penagihan telah diterbitkan."
    },
    {
      no: 6,
      ref: "KB-JDM/2026/01/089",
      jenis: "Janda/Duda Menikah Lagi",
      nama: "Ny. Maria Ulfa (Warakawuri Menikah Lagi)",
      nrp: "43020099110",
      satker: "TNI AU",
      unor: "Lanud Iswahjudi",
      jumlah: 11200000,
      tglPengajuan: "12 Jan 2026",
      jatuhTempo: "26 Jan 2026",
      tglBayar: null,
      status: "Terlambat",
      hariTerlambat: 18,
      keterangan: "Warakawuri menikah lagi, belum melakukan pengembalian dana pensiun."
    },
    {
      no: 7,
      ref: "KB-UDW/2026/01/112",
      jenis: "UDW Punah",
      nama: "Laksamana Muda (Purn) Yudi K.",
      nrp: "74080124110",
      satker: "TNI AL",
      unor: "Mabes AL",
      jumlah: 22340000,
      tglPengajuan: "10 Jan 2026",
      jatuhTempo: "24 Jan 2026",
      tglBayar: null,
      status: "Terlambat",
      hariTerlambat: 28,
      keterangan: "Keterlanjuran transfer UDW dan Dapem induk ke rekening almarhum."
    },
    {
      no: 8,
      ref: "KB-JDM/2026/01/156",
      jenis: "Janda/Duda Menikah Lagi",
      nama: "Ny. Endang Susilowati (Janda Alm. Bripka Heru)",
      nrp: "61020088190",
      satker: "POLRI",
      unor: "Polda Metro Jaya",
      jumlah: 9500000,
      tglPengajuan: "07 Jan 2026",
      jatuhTempo: "21 Jan 2026",
      tglBayar: "19 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0,
      keterangan: "Keterlanjuran bayar telah disetor lunas ke Kas Negara."
    },
    {
      no: 9,
      ref: "KB-UDW/2026/01/201",
      jenis: "UDW Punah",
      nama: "Brigjen Pol. (Purn) Sutrisno",
      nrp: "6201089201",
      satker: "POLRI",
      unor: "Mabes Polri",
      jumlah: 25000000,
      tglPengajuan: "05 Jan 2026",
      jatuhTempo: "19 Jan 2026",
      tglBayar: "18 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0,
      keterangan: "Penerima punah, dana telah ditarik kembali secara tuntas."
    },
    {
      no: 10,
      ref: "KB-AYM/2026/01/245",
      jenis: "Anak Yatim Menikah",
      nama: "Dimas Prasetyo (Anak Yatim Alm. PNS Sukirno)",
      nrp: "PNS-00199412",
      satker: "PNS Kemhan",
      unor: "Balitbang Kemhan",
      jumlah: 5400000,
      tglPengajuan: "22 Jan 2026",
      jatuhTempo: "05 Feb 2026",
      tglBayar: null,
      status: "Ditagih",
      hariTerlambat: 0,
      keterangan: "Surat pemberitahuan pengembalian telah diterima pihak keluarga."
    }
  ];

  const fmt = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

  // Rumus Denda Keterlanjuran Bayar: Nominal * (1 / 1000) * Hari Keterlambatan
  const hitungDenda = (nominal, hari) => {
    if (nominal <= 0 || hari <= 0) return 0;
    return Math.round(nominal * (1 / 1000) * hari);
  };

  const statusColor = (s) =>
    s === "Dikembalikan" ? "green" : s === "Ditagih" ? "blue" : "red";

  const filtered = allKasus.filter((k) => {
    if (filterJenis !== "Semua" && k.jenis !== filterJenis) return false;
    if (filterSatker !== "Semua" && !k.satker.includes(filterSatker)) return false;
    if (filterStatus !== "Semua" && k.status !== filterStatus) return false;
    if (
      searchQuery &&
      !k.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !k.ref.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !k.nrp.includes(searchQuery) &&
      !k.jenis.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !k.unor.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Global Aggregates
  const totalJumlahAll = allKasus.reduce((a, k) => a + k.jumlah, 0);
  const totalDikembalikanAll = allKasus
    .filter((k) => k.status === "Dikembalikan")
    .reduce((a, k) => a + k.jumlah, 0);
  const totalPiutangAll = allKasus
    .filter((k) => k.status !== "Dikembalikan")
    .reduce((a, k) => a + k.jumlah, 0);
  const totalDendaAll = allKasus
    .filter((k) => k.status === "Terlambat")
    .reduce((a, k) => a + hitungDenda(k.jumlah, k.hariTerlambat), 0);

  // Aggregates per Jenis
  const jenisList = ["UDW Punah", "Anak Yatim Menikah", "Janda/Duda Menikah Lagi"];
  const countPerJenis = jenisList.reduce((acc, j) => {
    const list = allKasus.filter((k) => k.jenis === j);
    acc[j] = {
      count: list.length,
      total: list.reduce((a, b) => a + b.jumlah, 0)
    };
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Header Penjelasan Singkat */}
      <div
        style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
            Monitoring & Penagihan Keterlanjuran Bayar Pensiun
          </div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
            Pemantauan piutang pengembalian dana pensiun: UDW Punah, Anak Yatim Menikah, dan Janda/Duda Menikah Lagi dengan sanksi denda keterlambatan 1‰ (satu permil) per hari.
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard
          icon={<Users size={IC} />}
          label="Total Kasus Terdeteksi"
          value={`${allKasus.length} Kasus`}
          sub="3 Jenis Keterlanjuran Bayar"
          color={COLORS.blue}
        />
        <StatCard
          icon={<Wallet size={IC} />}
          label="Total Terlanjur Bayar"
          value={fmt(totalJumlahAll)}
          sub="Akumulasi seluruh kewajiban penagihan"
          color={COLORS.blue}
        />
        <StatCard
          icon={<CheckCircle2 size={IC} />}
          label="Sudah Dikembalikan"
          value={fmt(totalDikembalikanAll)}
          sub="Telah disetor ke Kas Negara"
          color={COLORS.green}
        />
        <StatCard
          icon={<AlertTriangle size={IC} />}
          label="Total Piutang & Denda"
          value={fmt(totalPiutangAll + totalDendaAll)}
          sub={`Termasuk Denda 1‰: ${fmt(totalDendaAll)}`}
          color={COLORS.red}
        />
      </div>

      {/* Category Filter Tabs (Clean & Neutral) */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {[
          { id: "Semua", label: "Semua Jenis", count: allKasus.length, total: totalJumlahAll },
          { id: "UDW Punah", label: "UDW Punah", count: countPerJenis["UDW Punah"].count, total: countPerJenis["UDW Punah"].total },
          { id: "Anak Yatim Menikah", label: "Anak Yatim Menikah", count: countPerJenis["Anak Yatim Menikah"].count, total: countPerJenis["Anak Yatim Menikah"].total },
          { id: "Janda/Duda Menikah Lagi", label: "Janda/Duda Menikah Lagi", count: countPerJenis["Janda/Duda Menikah Lagi"].count, total: countPerJenis["Janda/Duda Menikah Lagi"].total },
        ].map((tab) => {
          const isSelected = filterJenis === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterJenis(tab.id)}
              style={{
                background: isSelected ? "#0F172A" : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "#334155",
                border: `1px solid ${isSelected ? "#0F172A" : "#CBD5E1"}`,
                borderRadius: 6,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  background: isSelected ? "rgba(255,255,255,0.2)" : "#F1F5F9",
                  color: isSelected ? "#FFFFFF" : "#475569",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 4
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 8,
          padding: "14px 18px",
          border: `1px solid ${COLORS.gray200}`,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          flexWrap: "wrap"
        }}
      >
        <Select
          label="Jenis Keterlanjuran"
          value={filterJenis}
          onChange={setFilterJenis}
          options={["Semua", "UDW Punah", "Anak Yatim Menikah", "Janda/Duda Menikah Lagi"]}
          minW={190}
        />
        <Select
          label="Instansi / Satker"
          value={filterSatker}
          onChange={setFilterSatker}
          options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI", "PNS Kemhan"]}
          minW={150}
        />
        <Select
          label="Status Pengembalian"
          value={filterStatus}
          onChange={setFilterStatus}
          options={["Semua", "Dikembalikan", "Ditagih", "Terlambat"]}
          minW={150}
        />
        <div style={{ flex: 1, minWidth: 240 }}>
          <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4, fontWeight: 600 }}>
            Pencarian Data
          </label>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari nomor ref, nama peserta, NRP/NIP, atau satker..."
            minW={240}
          />
        </div>
      </div>

      {/* Unified Table - All in One Monitoring View */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 8,
          padding: 20,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}
      >
        <SectionTitle
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Laporan Monitoring Penagihan Keterlanjuran Bayar Pensiun",
                    subtitle: `Kategori: ${filterJenis} • Format Dokumen Resmi Ditjen Anggaran & Perbendaharaan`,
                    type: "table",
                    fileName: `Monitoring_Keterlanjuran_Bayar_${filterJenis.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
                    content: {
                      columns: [
                        "No. Ref",
                        "Jenis Keterlanjuran",
                        "Nama Peserta",
                        "NRP / NIP",
                        "Satker",
                        "Terlanjur Bayar",
                        "Tgl Pengajuan",
                        "Jatuh Tempo",
                        "Tgl Bayar",
                        "Status",
                        "Terlambat",
                        "Denda (1‰)",
                        "Total Kewajiban"
                      ],
                      rows: filtered.map((k) => {
                        const denda = hitungDenda(k.jumlah, k.hariTerlambat);
                        const totalWajib = k.status === "Dikembalikan" ? 0 : k.jumlah + denda;
                        return [
                          k.ref,
                          k.jenis,
                          k.nama,
                          k.nrp,
                          k.satker,
                          fmt(k.jumlah),
                          k.tglPengajuan,
                          k.jatuhTempo,
                          k.tglBayar || "—",
                          k.status,
                          k.hariTerlambat > 0 ? `${k.hariTerlambat} Hari` : "—",
                          denda > 0 ? fmt(denda) : "Rp 0",
                          fmt(totalWajib)
                        ];
                      }),
                      totalRows: filtered.length
                    }
                  })
                }
              >
                <FileText size={14} /> Ekspor PDF
              </Btn>
              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Laporan Monitoring Penagihan Keterlanjuran Bayar Pensiun",
                    subtitle: `Kategori: ${filterJenis} • Format Spreadsheet Excel`,
                    type: "table",
                    fileName: `Monitoring_Keterlanjuran_Bayar_${filterJenis.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                    content: {
                      columns: [
                        "No. Ref",
                        "Jenis Keterlanjuran",
                        "Nama Peserta",
                        "NRP / NIP",
                        "Satker",
                        "Terlanjur Bayar",
                        "Tgl Pengajuan",
                        "Jatuh Tempo",
                        "Tgl Bayar",
                        "Status",
                        "Terlambat",
                        "Denda (1‰)",
                        "Total Kewajiban"
                      ],
                      rows: filtered.map((k) => {
                        const denda = hitungDenda(k.jumlah, k.hariTerlambat);
                        const totalWajib = k.status === "Dikembalikan" ? 0 : k.jumlah + denda;
                        return [
                          k.ref,
                          k.jenis,
                          k.nama,
                          k.nrp,
                          k.satker,
                          fmt(k.jumlah),
                          k.tglPengajuan,
                          k.jatuhTempo,
                          k.tglBayar || "—",
                          k.status,
                          k.hariTerlambat > 0 ? `${k.hariTerlambat} Hari` : "—",
                          denda > 0 ? fmt(denda) : "Rp 0",
                          fmt(totalWajib)
                        ];
                      }),
                      totalRows: filtered.length
                    }
                  })
                }
              >
                <FileSpreadsheet size={14} /> Ekspor Excel
              </Btn>
            </div>
          }
        >
          Tabel Monitoring Penagihan Keterlanjuran Bayar
        </SectionTitle>

        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 14 }}>
          Seluruh data kasus keterlanjuran bayar (UDW Punah, Anak Yatim Menikah, dan Janda/Duda Menikah Lagi), jadwal pengajuan, jatuh tempo, status bayar, serta kalkulasi denda 1‰ (satu permil) per hari terangkum di bawah ini.
        </div>

        {filtered.length === 0 ? (
          <NoData />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 6, border: `1px solid #CBD5E1` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  {[
                    "No",
                    "No. Ref Kasus",
                    "Jenis Keterlanjuran",
                    "Nama Peserta / Penerima",
                    "NRP / NIP",
                    "Satker & Unor",
                    "Terlanjur Bayar",
                    "Tgl Pengajuan",
                    "Jatuh Tempo",
                    "Tgl Bayar",
                    "Status",
                    "Durasi Terlambat",
                    "Denda (1‰/Hari)",
                    "Total Wajib Disetor"
                  ].map((c, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "10px 12px",
                        textAlign: [6, 12, 13].includes(i) ? "right" : [0, 7, 8, 9, 10, 11].includes(i) ? "center" : "left",
                        fontWeight: 800,
                        color: "#64748B",
                        borderBottom: `1px solid #E2E8F0`,
                        borderRight: i < 13 ? "1px solid #E2E8F0" : "none",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((k, i) => {
                  const denda = hitungDenda(k.jumlah, k.hariTerlambat);
                  const totalWajib = k.status === "Dikembalikan" ? 0 : k.jumlah + denda;

                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                    >
                      <td style={{ padding: "9px 12px", color: "#64748B", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        {k.no}
                      </td>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        <span style={{ fontWeight: 700, color: COLORS.blueDark, fontFamily: "monospace" }}>{k.ref}</span>
                      </td>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 600, color: "#334155", whiteSpace: "nowrap" }}>
                        {k.jenis}
                      </td>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A", minWidth: 160 }}>
                        <div>{k.nama}</div>
                        {k.keterangan && (
                          <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 400, marginTop: 2 }}>
                            {k.keterangan}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0", fontFamily: "monospace", color: "#334155", fontSize: 11.5, whiteSpace: "nowrap" }}>
                        {k.nrp}
                      </td>
                      <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0", minWidth: 130 }}>
                        <div style={{ fontWeight: 600, color: "#334155" }}>{k.satker}</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>{k.unor}</div>
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {fmt(k.jumlah)}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.tglPengajuan}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center", fontSize: 11.5, color: "#475569", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.jatuhTempo}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.tglBayar ? (
                          <span style={{ fontWeight: 600, color: COLORS.green, fontSize: 11.5 }}>
                            {k.tglBayar}
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <Badge color={statusColor(k.status)}>{k.status}</Badge>
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.hariTerlambat > 0 ? (
                          <span style={{ color: "#DC2626", fontWeight: 700 }}>{k.hariTerlambat} Hari</span>
                        ) : (
                          <span style={{ color: "#94A3B8" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {denda > 0 ? (
                          <span style={{ fontWeight: 800, color: "#DC2626", fontFamily: "monospace" }}>
                            +{fmt(denda)}
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8" }}>Rp 0</span>
                        )}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: k.status === "Dikembalikan" ? COLORS.green : COLORS.blueDark, whiteSpace: "nowrap", background: k.status === "Terlambat" ? "#FEF2F2" : "transparent" }}>
                        {k.status === "Dikembalikan" ? "Rp 0 (Lunas)" : fmt(totalWajib)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
