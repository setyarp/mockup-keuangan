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
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua"); // "Semua", "Dikembalikan", "Ditagih", "Terlambat"
  const [searchUDW, setSearchUDW] = useState("");
  const [preview, setPreview] = useState(null);

  // Data Kasus Monitoring Penagihan Keterlanjuran Bayar (UDW Punah)
  const allKasus = [
    {
      no: 1,
      ref: "UDW/2026/01/001",
      nama: "Kolonel Inf. Agus Setiawan",
      nrp: "11020014250",
      satker: "TNI AD",
      unor: "Kodam Jaya",
      jumlah: 15420000,
      tglPengajuan: "18 Jan 2026",
      jatuhTempo: "01 Feb 2026",
      tglBayar: null,
      status: "Ditagih",
      hariTerlambat: 0
    },
    {
      no: 2,
      ref: "UDW/2026/01/042",
      nama: "Ny. Ratna Sari (Warakawuri Punah)",
      nrp: "PNS-00125492",
      satker: "POLRI",
      unor: "Polda Metro Jaya",
      jumlah: 12800000,
      tglPengajuan: "14 Jan 2026",
      jatuhTempo: "28 Jan 2026",
      tglBayar: "26 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0
    },
    {
      no: 3,
      ref: "UDW/2026/01/089",
      nama: "Sertu Bima Prakoso",
      nrp: "21120485901",
      satker: "TNI AU",
      unor: "Lanud Halim",
      jumlah: 18500000,
      tglPengajuan: "12 Jan 2026",
      jatuhTempo: "26 Jan 2026",
      tglBayar: null,
      status: "Terlambat",
      hariTerlambat: 15
    },
    {
      no: 4,
      ref: "UDW/2026/01/112",
      nama: "Laksamana Muda Yudi K.",
      nrp: "74080124110",
      satker: "TNI AL",
      unor: "Mabes AL",
      jumlah: 22340000,
      tglPengajuan: "10 Jan 2026",
      jatuhTempo: "24 Jan 2026",
      tglBayar: null,
      status: "Terlambat",
      hariTerlambat: 28
    },
    {
      no: 5,
      ref: "UDW/2026/01/156",
      nama: "Mayor (P) Hendra Gunawan",
      nrp: "5109820012",
      satker: "TNI AL",
      unor: "Koarmada I",
      jumlah: 14200000,
      tglPengajuan: "07 Jan 2026",
      jatuhTempo: "21 Jan 2026",
      tglBayar: "19 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0
    },
    {
      no: 6,
      ref: "UDW/2026/01/201",
      nama: "Brigjen Pol. Sutrisno",
      nrp: "6201089201",
      satker: "POLRI",
      unor: "Mabes Polri",
      jumlah: 25000000,
      tglPengajuan: "05 Jan 2026",
      jatuhTempo: "19 Jan 2026",
      tglBayar: "18 Jan 2026",
      status: "Dikembalikan",
      hariTerlambat: 0
    },
    {
      no: 7,
      ref: "UDW/2026/01/245",
      nama: "Letda Ckm dr. Arif Budiman",
      nrp: "31190088712",
      satker: "TNI AD",
      unor: "Kesdam IV Diponegoro",
      jumlah: 16800000,
      tglPengajuan: "22 Jan 2026",
      jatuhTempo: "05 Feb 2026",
      tglBayar: null,
      status: "Ditagih",
      hariTerlambat: 0
    },
    {
      no: 8,
      ref: "UDW/2026/01/246",
      nama: "Mang Asep",
      nrp: "31190088313",
      satker: "TNI AL",
      unor: "Kesdam III Jayakarta",
      jumlah: 17800000,
      tglPengajuan: "22 Feb 2026",
      jatuhTempo: "08 Mar 2026",
      tglBayar: null,
      status: "Ditagih",
      hariTerlambat: 0
    }
  ];

  const fmt = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

  // Rumus Denda UDW Punah: Nominal * (1 / 1000) * Hari Keterlambatan
  const hitungDenda = (nominal, hari) => {
    if (nominal <= 0 || hari <= 0) return 0;
    return Math.round(nominal * (1 / 1000) * hari);
  };

  const statusColor = (s) =>
    s === "Dikembalikan" ? "green" : s === "Ditagih" ? "blue" : "red";

  const filtered = allKasus.filter((k) => {
    if (filterSatker !== "Semua" && !k.satker.includes(filterSatker)) return false;
    if (filterStatus !== "Semua" && k.status !== filterStatus) return false;
    if (
      searchUDW &&
      !k.nama.toLowerCase().includes(searchUDW.toLowerCase()) &&
      !k.ref.toLowerCase().includes(searchUDW.toLowerCase()) &&
      !k.nrp.includes(searchUDW)
    )
      return false;
    return true;
  });

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

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard
          icon={<Users size={IC} />}
          label="Total Kasus Terdeteksi"
          value={`${allKasus.length} Kasus`}
          sub="Monitoring keterlanjuran bayar UDW"
          color={COLORS.blue}
        />
        <StatCard
          icon={<Wallet size={IC} />}
          label="Total Terlanjur Bayar"
          value={fmt(totalJumlahAll)}
          sub="Akumulasi UDW punah terbit"
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

      {/* Filters */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 8,
          padding: "14px 18px",
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 18,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          flexWrap: "wrap"
        }}
      >
        <Select
          label="Instansi / Satker"
          value={filterSatker}
          onChange={setFilterSatker}
          options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI"]}
          minW={160}
        />
        <Select
          label="Status Pengembalian"
          value={filterStatus}
          onChange={setFilterStatus}
          options={["Semua", "Dikembalikan", "Ditagih", "Terlambat"]}
          minW={160}
        />
        <div style={{ flex: 1, minWidth: 240 }}>
          <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4, fontWeight: 600 }}>
            Pencarian
          </label>
          <SearchInput
            value={searchUDW}
            onChange={setSearchUDW}
            placeholder="Cari nomor ref, nama peserta, atau NRP..."
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
                    title: "Laporan Monitoring Penagihan Keterlanjuran Bayar UDW Punah",
                    subtitle: "Format Dokumen Resmi Ditjen Anggaran & Perbendaharaan",
                    type: "table",
                    fileName: "Monitoring_Penagihan_Keterlanjuran_Bayar.pdf",
                    content: {
                      columns: [
                        "No. Ref",
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
                    title: "Laporan Monitoring Penagihan Keterlanjuran Bayar UDW Punah",
                    subtitle: "Format Spreadsheet Excel",
                    type: "table",
                    fileName: "Monitoring_Penagihan_Keterlanjuran_Bayar.xlsx",
                    content: {
                      columns: [
                        "No. Ref",
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
          Tabel Monitoring Penagihan Keterlanjuran Bayar (UDW Punah)
        </SectionTitle>

        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 12 }}>
          Seluruh data monitoring penagihan, jadwal tanggal pengajuan, batas jatuh tempo, tanggal bayar, status, serta perhitungan denda 1‰ (satu permil) terangkum dalam tabel di bawah ini.
        </div>

        {filtered.length === 0 ? (
          <NoData />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "#1E293B", color: COLORS.white }}>
                  {[
                    "No",
                    "No. Ref Kasus",
                    "Nama Peserta",
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
                        padding: "11px 14px",
                        textAlign: [5, 11, 12].includes(i) ? "right" : [0, 6, 7, 8, 9, 10].includes(i) ? "center" : "left",
                        fontWeight: 700,
                        fontSize: 12,
                        color: COLORS.white,
                        borderBottom: `1px solid #334155`,
                        borderRight: i < 12 ? "1px solid #334155" : "none",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.2px"
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
                      style={{
                        borderBottom: `1px solid #E2E8F0`,
                        background: k.status === "Terlambat" ? "#FFFBEB" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          k.status === "Terlambat" ? "#FFFBEB" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                      }
                    >
                      {/* No */}
                      <td style={{ padding: "10px 14px", color: "#64748B", textAlign: "center", fontSize: 12, borderRight: "1px solid #E2E8F0" }}>
                        {k.no}
                      </td>

                      {/* No. Ref Kasus */}
                      <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        <span style={{ fontWeight: 700, color: COLORS.blueDark, fontFamily: "monospace", fontSize: 12 }}>
                          {k.ref}
                        </span>
                      </td>

                      {/* Nama Peserta */}
                      <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A", minWidth: 160, fontSize: 12.5 }}>
                        {k.nama}
                      </td>

                      {/* NRP / NIP */}
                      <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0", fontFamily: "monospace", color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}>
                        {k.nrp}
                      </td>

                      {/* Satker & Unor */}
                      <td style={{ padding: "10px 14px", borderRight: "1px solid #E2E8F0", minWidth: 140 }}>
                        <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 12.5 }}>{k.satker}</div>
                        <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>{k.unor}</div>
                      </td>

                      {/* Terlanjur Bayar */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", fontSize: 12.5, borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {fmt(k.jumlah)}
                      </td>

                      {/* Tgl Pengajuan */}
                      <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.tglPengajuan}
                      </td>

                      {/* Jatuh Tempo */}
                      <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, color: "#475569", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.jatuhTempo}
                      </td>

                      {/* Tgl Bayar */}
                      <td style={{ padding: "10px 14px", textAlign: "center", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.tglBayar ? (
                          <span style={{ fontWeight: 700, color: "#166534", background: "#DCFCE7", padding: "2px 8px", borderRadius: 4, fontSize: 11.5 }}>
                            {k.tglBayar}
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "10px 14px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                        <Badge color={statusColor(k.status)}>{k.status}</Badge>
                      </td>

                      {/* Durasi Terlambat */}
                      <td style={{ padding: "10px 14px", textAlign: "center", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {k.hariTerlambat > 0 ? (
                          <span style={{ color: "#DC2626", fontWeight: 700, background: "#FEE2E2", padding: "2px 8px", borderRadius: 4, fontSize: 11.5 }}>
                            {k.hariTerlambat} Hari
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
                        )}
                      </td>

                      {/* Denda (1‰/Hari) */}
                      <td style={{ padding: "10px 14px", textAlign: "right", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                        {denda > 0 ? (
                          <span style={{ fontWeight: 800, color: "#DC2626", fontFamily: "monospace", fontSize: 12.5 }}>
                            +{fmt(denda)}
                          </span>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: 12 }}>Rp 0</span>
                        )}
                      </td>

                      {/* Total Wajib Disetor */}
                      <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, fontSize: 12.5, whiteSpace: "nowrap" }}>
                        {k.status === "Dikembalikan" ? (
                          <span style={{ color: "#166534" }}>Rp 0 (Lunas)</span>
                        ) : k.status === "Terlambat" ? (
                          <span style={{ color: "#DC2626" }}>{fmt(totalWajib)}</span>
                        ) : (
                          <span style={{ color: COLORS.blueDark }}>{fmt(totalWajib)}</span>
                        )}
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
