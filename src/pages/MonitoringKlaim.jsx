import { useState } from "react";
import { ClipboardList, Search, CheckCircle2, XCircle } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Select, SearchInput, Table, Badge, NoData } from "../components/common";

export const MonitoringKlaim = () => {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [searchKlaim, setSearchKlaim] = useState("");

  const allKlaim = [
    { spp: "SPP/2026/07/101", rekap: "RK-001", peserta: "Serma Agus P.", satker: "TNI", unor: "Kodam Jaya", jenisKlaim: "Rawat Inap", nominal: "Rp 45.000.000", status: "Dibayar", riwayat: "4 tahap", pic: "Staf Yarpen A", mitra: "Bank Mandiri" },
    { spp: "SPP/2026/07/102", rekap: "RK-001", peserta: "Pratu Dedi S.", satker: "TNI", unor: "Kodam IM", jenisKlaim: "Rawat Jalan", nominal: "Rp 8.500.000", status: "Disetujui", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "BRI" },
    { spp: "SPP/2026/07/103", rekap: "RK-002", peserta: "Bripka Rina M.", satker: "POLRI", unor: "Polda Metro Jaya", jenisKlaim: "Operasi", nominal: "Rp 120.000.000", status: "Verifikasi", riwayat: "2 tahap", pic: "Staf Yarpen B", mitra: "BNI" },
    { spp: "SPP/2026/07/104", rekap: "RK-002", peserta: "Koptu Hasan F.", satker: "TNI", unor: "Lantamal III", jenisKlaim: "Rawat Inap", nominal: "Rp 32.000.000", status: "Pengajuan", riwayat: "1 tahap", pic: "—", mitra: "Bank Mandiri" },
    { spp: "SPP/2026/07/105", rekap: "RK-003", peserta: "Kapten Lina W.", satker: "TNI", unor: "Mabes TNI", jenisKlaim: "Rawat Jalan", nominal: "Rp 5.200.000", status: "Ditolak", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "BRI" },
    { spp: "SPP/2026/07/106", rekap: "RK-003", peserta: "Pelda Susanto", satker: "ASN Kemenhan", unor: "Ditjen Strahan", jenisKlaim: "Operasi", nominal: "Rp 87.000.000", status: "Dibayar", riwayat: "4 tahap", pic: "Staf Yarpen A", mitra: "BNI" },
    { spp: "SPP/2026/07/107", rekap: "RK-004", peserta: "Briptu Mega S.", satker: "POLRI", unor: "Polda Jabar", jenisKlaim: "Rawat Inap", nominal: "Rp 28.000.000", status: "Verifikasi", riwayat: "2 tahap", pic: "Staf Yarpen B", mitra: "BTN" },
    { spp: "SPP/2026/07/108", rekap: "RK-004", peserta: "Sertu Ahmad R.", satker: "PPPK", unor: "Setjen Kemhan", jenisKlaim: "Rawat Jalan", nominal: "Rp 12.800.000", status: "Disetujui", riwayat: "3 tahap", pic: "Ka. Yarpen", mitra: "Bank Mandiri" },
  ];

  const statusBadge = s => s === "Dibayar" ? "green" : s === "Disetujui" ? "blue" : s === "Verifikasi" ? "orange" : s === "Ditolak" ? "red" : "gray";

  const filtered = allKlaim.filter(k => {
    if (filterStatus !== "Semua" && k.status !== filterStatus) return false;
    if (filterMitra !== "Semua" && k.mitra !== filterMitra) return false;
    if (filterJenis !== "Semua" && k.jenisKlaim !== filterJenis) return false;
    if (searchKlaim && !k.peserta.toLowerCase().includes(searchKlaim.toLowerCase()) && !k.spp.toLowerCase().includes(searchKlaim.toLowerCase())) return false;
    return true;
  });

  const counts = { total: allKlaim.length, verif: allKlaim.filter(k => k.status === "Verifikasi").length, setuju: allKlaim.filter(k => k.status === "Disetujui" || k.status === "Dibayar").length, tolak: allKlaim.filter(k => k.status === "Ditolak").length };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<ClipboardList size={IC} />} label="Total Klaim Bulan Ini" value={counts.total.toString()} color={COLORS.blue} />
        <StatCard icon={<Search size={IC} />} label="Dalam Verifikasi" value={counts.verif.toString()} color={COLORS.orange} />
        <StatCard icon={<CheckCircle2 size={IC} />} label="Disetujui/Dibayar" value={counts.setuju.toString()} color={COLORS.green} />
        <StatCard icon={<XCircle size={IC} />} label="Ditolak" value={counts.tolak.toString()} color={COLORS.red} />
      </div>
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}`, marginBottom: 20 }}>
        <SectionTitle>Tracking Klaim JKK Perawatan</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
          <Select label="Status" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Pengajuan", "Verifikasi", "Disetujui", "Ditolak", "Dibayar"]} minW={130} />
          <Select label="Mitra Bayar" value={filterMitra} onChange={setFilterMitra} options={["Semua", "Bank Mandiri", "BRI", "BNI", "BTN"]} minW={140} />
          <Select label="Jenis Klaim" value={filterJenis} onChange={setFilterJenis} options={["Semua", "Rawat Inap", "Rawat Jalan", "Operasi"]} minW={130} />
          <div><label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari</label><SearchInput value={searchKlaim} onChange={setSearchKlaim} placeholder="SPP / Nama peserta..." /></div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 8 }}>Menampilkan {filtered.length} dari {allKlaim.length} klaim</div>
        {filtered.length === 0 ? <NoData /> : (
          <Table columns={["No. SPP", "No. Rekap", "Peserta", "Satker", "Unor", "Jenis Klaim", "Nominal", "Mitra Bayar", "Status"]}
            data={filtered.map(k => [k.spp, k.rekap, k.peserta, <Badge color={k.satker === "TNI" ? "green" : k.satker === "POLRI" ? "blue" : k.satker === "PPPK" ? "yellow" : "orange"}>{k.satker || "—"}</Badge>, <span style={{ fontSize: 12, color: COLORS.gray600 }}>{k.unor || "—"}</span>, k.jenisKlaim, k.nominal, k.mitra, <Badge color={statusBadge(k.status)}>{k.status}</Badge>])} />
        )}
      </div>
    </div>
  );
};
