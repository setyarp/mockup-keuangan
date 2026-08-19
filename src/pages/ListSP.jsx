import { useState } from "react";
import { COLORS } from "../constants/colors";
import { Select, Badge, Btn, NoData, PreviewModal } from "../components/common";

export const ListSP = () => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dariTanggal, setDariTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");
  const [mitraBayar, setMitraBayar] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [manfaat, setManfaat] = useState("-- Silahkan Pilih Manfaat --");
  const [cabang, setCabang] = useState("-- Silahkan Pilih Cabang --");
  const [status, setStatus] = useState("Semua");
  const [unor, setUnor] = useState("-- Silahkan Pilih Unit Organisasi --");
  const [statusPersonil, setStatusPersonil] = useState("-- Silahkan Pilih Status Personil --");
  const [dariTanggalDPS, setDariTanggalDPS] = useState("");
  const [sampaiTanggalDPS, setSampaiTanggalDPS] = useState("");
  const [produk, setProduk] = useState("-- Silahkan Pilih Produk --");
  const [preview, setPreview] = useState(null);

  const fmt = n => typeof n === "number" ? `Rp ${n.toLocaleString("id-ID")}` : n;

  const manfaatOptions = [
    "-- Silahkan Pilih Manfaat --",
    "999 - UKP",
    "99999 - Reimboursment Perawatan",
    "IDP - Iuran Dana Pensiun PP 67 (Pra PP No. 102)",
    "JKK BEASISWA - Beasiswa (JKK)",
    "JKK BIAYA ANGKUT - Biaya Angkut",
    "JKK PERAWATAN - Perawatan",
    "JKK SCDB - Santunan Cacat Dinas Biasa",
    "JKK SCDK - Santunan Cacat Dinas Khusus",
    "JKK SRKK GUGUR - Santunan Risiko Kematian Khusus Gugur",
    "JKK SRKK TEWAS - Santunan Risiko Kematian Khusus Tewas",
    "JKM BEASISWA - Bantuan Beasiswa (JKM)",
    "JKM SRK BP - Santunan Resiko Kematian - Biaya Pemakaman",
    "JKM SRK SKS BINTARA/TAMTAMA - Santunan Resiko Kematian - Santunan Kematian Sekaligus untuk bintara dan tamtama",
    "JKM SRK SKS PA - Santunan Resiko Kematian - Santunan Kematian Sekaligus untuk perwira",
    "JKM SRK UDW AKTIF - Santunan Resiko Kematian - Uang Duka wafat Aktif",
    "NTIP - NTIP",
    "PEMBATALAN_BUM - PEMBATALAN BUM",
    "PINPOL - PELUNASAN POLIS",
    "PINPOL - PINJAMAN POLIS",
    "PP - Pensiun Pertama",
    "PPA - Pensiun Pertama Anak",
    "PPI - Pensiun Pertama Istri",
    "PPOR - Pensiun Pertama Orang Tua",
    "RKNT - RISIKO KEMATIAN & NILAI TUNAI ASURANSI",
    "SA - Santunan Asuransi PP 67 (pra PP 102)",
    "SBP - Santunan Biaya Pemakaman PP 67 (pra PP 102)",
    "SNTA - Santunan Nilai Tunai Asuransi PP 67 (pra PP 102)",
    "SRK - Santunan Risiko Kematian PP 67 (pra PP 102)",
    "SRK/SNTA - Santunan Risiko Kematian PP 67 (pra PP 102)",
    "SRKK - Santunan Risiko Kematian Khusus PP 67 (pra PP 102)",
    "THT BPPP - Biaya Pemakaman Peserta Pensiunan",
    "THT NTTA - Nilai Tunai Tabungan Asuransi",
    "THT SBPA - Santunan Biaya Pemakaman Anak",
    "THT SBPI/S - Santunan Biaya pemakaman Istri/Suami",
    "THT TA - Tabungan Asuransi",
    "UDW PENS - Uang Duka wafat Pensiun",
    "UKP - UKP (Uang Kekurangan Pensiun)",
    "UKP-PK - UKP (Uang Kekurangan Pensiun - Pembayaran Kembali)"
  ];

  const spMasterData = [
    {
      kpa: "KPA-001",
      nrp: "198701234",
      nama: "Purn. Kol. Ahmad Rifai",
      produk: "JKK",
      noSP: "SP/JKK/2026/07/001",
      kodeBayar: "KB-99999-01",
      tglSP: "2026-07-05",
      unor: "Kodam Jaya",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KCP Matraman",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Ahmad Rifai",
      nomorRekening: "026101000123",
      jumlahHak: 45000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 45000000,
      noDPS: "DPS-2026-0812",
      tglBayar: "2026-07-10",
      status: "Lunas",
      manfaat: "99999 - Reimboursment Perawatan",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-002",
      nrp: "199205678",
      nama: "Purn. Lettu Budi Kartono",
      produk: "Taspen Life",
      noSP: "SP/TL/2026/07/001",
      kodeBayar: "KB-TL-02",
      tglSP: "2026-07-16",
      unor: "Mabes TNI",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Asuransi Jiwa Taspen",
      cabangMitra: "Kantor Pusat TL",
      saranaBayar: "Virtual Account",
      namaRekening: "PT Asuransi Jiwa Taspen",
      nomorRekening: "1234567890",
      jumlahHak: 830000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 830000,
      noDPS: "DPS-2026-0815",
      tglBayar: "2026-07-20",
      status: "Disetujui",
      manfaat: "PINPOL - PELUNASAN POLIS",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-003",
      nrp: "199012345",
      nama: "Purn. AKP Citra Dewi",
      produk: "THT",
      noSP: "SP/THT/2026/07/004",
      kodeBayar: "KB-SBP-03",
      tglSP: "2026-07-12",
      unor: "Polda Metro Jaya",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Bank Mandiri (Persero)",
      cabangMitra: "KC Thamrin",
      saranaBayar: "CMS Mandiri",
      namaRekening: "Citra Dewi",
      nomorRekening: "137001234567",
      jumlahHak: 15000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 15000000,
      noDPS: "DPS-2026-0818",
      tglBayar: "2026-07-15",
      status: "Lunas",
      manfaat: "SBP - Santunan Biaya Pemakaman PP 67 (pra PP 102)",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-004",
      nrp: "197506789",
      nama: "Purn. Pengatur Agus Salim",
      produk: "UKP",
      noSP: "SP/UKP/2026/07/009",
      kodeBayar: "KB-UKP-04",
      tglSP: "2026-07-18",
      unor: "Setjen Kemhan",
      cabangAsabri: "KC Bandung",
      mitraBayar: "PT Bank Tabungan Negara (BTN)",
      cabangMitra: "KC Bandung",
      saranaBayar: "CMS BTN",
      namaRekening: "Agus Salim",
      nomorRekening: "001230156789",
      jumlahHak: 6200000,
      potonganPajak: 310000,
      potongan: 0,
      jumlahBayar: 5890000,
      noDPS: "DPS-2026-0820",
      tglBayar: "2026-07-22",
      status: "Lunas",
      manfaat: "999 - UKP",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-005",
      nrp: "198604321",
      nama: "Purn. Bripka Anwar Ibrahim",
      produk: "JKK",
      noSP: "SP/JKK/2026/07/012",
      kodeBayar: "KB-SCDK-05",
      tglSP: "2026-07-20",
      unor: "Polda Jabar",
      cabangAsabri: "KC Bandung",
      mitraBayar: "PT Bank Negara Indonesia (BNI)",
      cabangMitra: "KC Juanda",
      saranaBayar: "CMS BNI",
      namaRekening: "Anwar Ibrahim",
      nomorRekening: "0112233445",
      jumlahHak: 85000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 85000000,
      noDPS: "—",
      tglBayar: "—",
      status: "Disetujui",
      manfaat: "JKK SCDK - Santunan Cacat Dinas Khusus",
      statusPersonil: "Pensiun"
    },
    {
      kpa: "KPA-006",
      nrp: "199401234",
      nama: "Danu Prasetyo",
      produk: "Dapen",
      noSP: "SP/IDP/2026/07/015",
      kodeBayar: "KB-IDP-06",
      tglSP: "2026-07-22",
      unor: "Ditjen Strahan",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Pos Indonesia",
      cabangMitra: "KPU Jakarta Pusat",
      saranaBayar: "Giropos",
      namaRekening: "Danu Prasetyo",
      nomorRekening: "900123456",
      jumlahHak: 4800000,
      potonganPajak: 120000,
      potongan: 0,
      jumlahBayar: 4680000,
      noDPS: "—",
      tglBayar: "—",
      status: "Draft",
      manfaat: "IDP - Iuran Dana Pensiun PP 67 (Pra PP No. 102)",
      statusPersonil: "Aktif"
    },
    {
      kpa: "KPA-007",
      nrp: "197604567",
      nama: "Purn. Mayor Inf. Surya Darma",
      produk: "JKm",
      noSP: "SP/JKM/2026/07/018",
      kodeBayar: "KB-JKM-07",
      tglSP: "2026-07-24",
      unor: "Lanud Halim",
      cabangAsabri: "KC Jakarta",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KC Jakarta Timur",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Surya Darma",
      nomorRekening: "026101987654",
      jumlahHak: 42000000,
      potonganPajak: 0,
      potongan: 0,
      jumlahBayar: 42000000,
      noDPS: "DPS-2026-0830",
      tglBayar: "2026-07-25",
      status: "Lunas",
      manfaat: "JKM SRK BP - Santunan Resiko Kematian - Biaya Pemakaman",
      statusPersonil: "Wafat / Waris"
    }
  ];

  const filtered = spMasterData.filter(d => {
    if (mitraBayar !== "Semua" && !d.mitraBayar.toLowerCase().includes(mitraBayar.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!d.nama.toLowerCase().includes(q) && !d.nrp.includes(q) && !d.kpa.toLowerCase().includes(q)) return false;
    }
    if (manfaat !== "-- Silahkan Pilih Manfaat --" && d.manfaat !== manfaat) return false;
    if (cabang !== "-- Silahkan Pilih Cabang --" && d.cabangAsabri !== cabang) return false;
    if (status !== "Semua" && d.status !== status) return false;
    if (unor !== "-- Silahkan Pilih Unit Organisasi --" && d.unor !== unor) return false;
    if (statusPersonil !== "-- Silahkan Pilih Status Personil --" && d.statusPersonil !== statusPersonil) return false;
    if (produk !== "-- Silahkan Pilih Produk --" && d.produk !== produk) return false;
    if (dariTanggal && d.tglSP < dariTanggal) return false;
    if (sampaiTanggal && d.tglSP > sampaiTanggal) return false;
    return true;
  });

  const columnsList = [
    "KPA", "NRP/NIP", "NAMA PESERTA", "Produk", "No Surat Perintah", "Kode Bayar", "Tanggal Surat Perintah",
    "Unor", "Kantor Cabang Asabri", "Mitra Bayar", "Cabang Mitra Bayar", "Sarana Bayar", "Nama Rekening",
    "Nomor Rekening", "Jumlah Hak", "Potongan Pajak", "Potongan", "Jumlah Bayar", "No DPS", "Tanggal Bayar", "Status"
  ];

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Filter Panel collapsible */}
      <div style={{ background: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.gray300}`, overflow: "hidden", marginBottom: 20 }}>
        <div onClick={() => setFilterOpen(!filterOpen)} style={{ background: "#0D47A1", color: COLORS.white, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{filterOpen ? "▼" : "►"} Filter</span>
          <span style={{ fontSize: 11 }}>{filterOpen ? "Sembunyikan Panel Filter" : "Buka Panel Filter"}</span>
        </div>

        {filterOpen && (
          <div style={{ padding: 18, background: "#FAFBFD" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Dari Tanggal</label>
                <input type="date" value={dariTanggal} onChange={e => setDariTanggal(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Sampai Tanggal</label>
                <input type="date" value={sampaiTanggal} onChange={e => setSampaiTanggal(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Mitra Bayar</label>
                <input type="text" value={mitraBayar === "Semua" ? "" : mitraBayar} onChange={e => setMitraBayar(e.target.value || "Semua")} placeholder="Cari Mitra Bayar..." style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Nama/KTPA/NRP</label>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Masukkan Nama, KTPA, atau NRP..." style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <Select label="Manfaat" value={manfaat} onChange={setManfaat} options={manfaatOptions} minW="100%" />
              </div>
              <div>
                <Select label="Kantor Cabang Asabri" value={cabang} onChange={setCabang} options={["-- Silahkan Pilih Cabang --", "KC Jakarta", "KC Bandung", "KC Surabaya", "KC Medan", "KC Semarang", "KC Makassar"]} minW="100%" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <Select label="Status" value={status} onChange={setStatus} options={["Semua", "Draft", "Disetujui", "Proses Bayar", "Lunas"]} minW="100%" />
              </div>
              <div>
                <Select label="Unor" value={unor} onChange={setUnor} options={["-- Silahkan Pilih Unit Organisasi --", "Mabes TNI", "Kodam Jaya", "Polda Metro Jaya", "Setjen Kemhan", "Polda Jabar", "Ditjen Strahan", "Lanud Halim"]} minW="100%" />
              </div>
              <div>
                <Select label="Status Personil" value={statusPersonil} onChange={setStatusPersonil} options={["-- Silahkan Pilih Status Personil --", "Aktif", "Pensiun", "Wafat / Waris", "Gugur / Tewas"]} minW="100%" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Dari Tanggal DPS</label>
                <input type="date" value={dariTanggalDPS} onChange={e => setDariTanggalDPS(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray700, fontWeight: 600, display: "block", marginBottom: 4 }}>Sampai Tanggal DPS</label>
                <input type="date" value={sampaiTanggalDPS} onChange={e => setSampaiTanggalDPS(e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 4, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <Select label="Produk" value={produk} onChange={setProduk} options={["-- Silahkan Pilih Produk --", "THT", "JKK", "JKm", "Dapen", "Taspen Life", "UKP"]} minW="100%" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={{ padding: "8px 24px", background: "#00A97F", color: COLORS.white, border: "none", borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                🔍 Cari
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: COLORS.gray800, fontWeight: 600 }}>
          <span>Total Peserta : <strong>{filtered.length}</strong></span>
          <span style={{ margin: "0 12px", color: COLORS.gray300 }}>|</span>
          <span>Total SP : <strong>{filtered.length}</strong></span>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setPreview({ title: "Preview Ekspor Daftar Surat Perintah (List SP)", subtitle: `Filter Manfaat: ${manfaat !== "-- Silahkan Pilih Manfaat --" ? manfaat : "Semua Manfaat"} • Total SP: ${filtered.length}`, type: "table", fileName: `List_SP_Manfaat_${new Date().toISOString().slice(0,10)}.xlsx`, content: { columns: columnsList, rows: filtered.map(d => [d.kpa, d.nrp, d.nama, d.produk, d.noSP, d.kodeBayar, d.tglSP, d.unor, d.cabangAsabri, d.mitraBayar, d.cabangMitra, d.saranaBayar, d.namaRekening, d.nomorRekening, fmt(d.jumlahHak), fmt(d.potonganPajak), fmt(d.potongan), fmt(d.jumlahBayar), d.noDPS, d.tglBayar, d.status]), totalRows: filtered.length } })}>
          📥 Export Akun
        </Btn>
      </div>

      {/* Table */}
      {filtered.length === 0 ? <NoData text="Data Kosong — Tidak ada SP yang sesuai kriteria filter." /> : (
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid #CBD5E1`, background: COLORS.white, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, whiteSpace: "nowrap" }}>
            <thead>
              <tr style={{ background: "#1E293B", color: COLORS.white }}>
                {columnsList.map((c, i) => (
                  <th key={i} style={{ padding: "10px 12px", textAlign: i >= 14 && i <= 17 ? "right" : "left", fontWeight: 700, color: COLORS.white, borderBottom: `1px solid #334155`, borderRight: i < columnsList.length - 1 ? "1px solid #334155" : "none" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #E2E8F0`, background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{d.kpa}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", color: COLORS.blue, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{d.nrp}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.nama}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}><Badge color={d.produk === "JKK" ? "orange" : d.produk === "Taspen Life" ? "blue" : d.produk === "THT" ? "green" : "purple"}>{d.produk}</Badge></td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{d.noSP}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.kodeBayar}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.tglSP}</td>
                  <td style={{ padding: "9px 12px", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.unor}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.cabangAsabri}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.mitraBayar}</td>
                  <td style={{ padding: "9px 12px", color: "#475569", borderRight: "1px solid #E2E8F0" }}>{d.cabangMitra}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.saranaBayar}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.namaRekening}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{d.nomorRekening}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(d.jumlahHak)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: COLORS.red, borderRight: "1px solid #E2E8F0" }}>{fmt(d.potonganPajak)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{fmt(d.potongan)}</td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: COLORS.green, borderRight: "1px solid #E2E8F0" }}>{fmt(d.jumlahBayar)}</td>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{d.noDPS}</td>
                  <td style={{ padding: "9px 12px", borderRight: "1px solid #E2E8F0" }}>{d.tglBayar}</td>
                  <td style={{ padding: "9px 12px" }}><Badge color={d.status === "Lunas" ? "green" : d.status === "Disetujui" ? "blue" : "gray"}>{d.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
