import { useState, useMemo } from "react";
import {
  Filter,
  Search,
  RotateCcw,
  Download,
  Building2,
  Shield,
  User,
  CreditCard,
  Calendar,
  Layers,
  FileSpreadsheet,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Activity,
  HeartPulse,
  Receipt,
  X,
  Stethoscope,
  DollarSign,
  Tag,
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { StatCard, Badge, Btn, PreviewModal } from "../components/common";

export const JKKPerawatan = () => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [filterJenisKlaim, setFilterJenisKlaim] = useState("Semua");
  const [filterMitraBayar, setFilterMitraBayar] = useState("Semua");
  const [filterNamaBank, setFilterNamaBank] = useState("Semua");

  // Modal Detail & Preview Export
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [preview, setPreview] = useState(null);

  const fmt = (n) =>
    typeof n === "number" ? `Rp ${n.toLocaleString("id-ID")}` : n;

  // Master Data Monitoring JKK Perawatan persis 14 kolom sesuai gambar referensi:
  // 1. NO, 2. Nama Peserta, 3. KPA, 4. NO SPP, 5. NO REKAP, 6. No Restitusi,
  // 7. JENIS KLAIM, 8. BULAN, 9. MITRA BAYAR, 10. Nama Rekening, 11. Nomor Rekening,
  // 12. Nama Bank, 13. Nominal, 14. Tanggal Bayar
  const rawMonitoringJKK = [
    {
      no: 1,
      namaPeserta: "Serma Agus Prasetyo",
      ktpa: "KPA-8829102",
      noSPP: "SPP/JKK/2026/07/101",
      noRekap: "RK-001/JKK/2026",
      noRestitusi: "REST-0091/2026",
      jenisKlaim: "Rawat Inap & Operasi",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Mandiri (Persero) Tbk",
      namaRekening: "Agus Prasetyo",
      nomorRekening: "137-00-192837-1",
      namaBank: "Bank Mandiri",
      nominal: 45000000,
      tanggalBayar: "10/07/2026",
      // Detail pelengkap
      satker: "KODAM JAYA / YONIF 201",
      unor: "TNI AD",
      rsProvider: "RSPAD Gatot Soebroto",
      diagnosa: "Fraktur Femur Sinistra (Cedera Latihan Dinas)",
      status: "Sudah Bayar",
      dokter: "dr. Kolonel Ckm Hendro, Sp.OT",
    },
    {
      no: 2,
      namaPeserta: "Pratu Dedi Saputra",
      ktpa: "KPA-9930192",
      noSPP: "SPP/JKK/2026/07/102",
      noRekap: "RK-001/JKK/2026",
      noRestitusi: "REST-0092/2026",
      jenisKlaim: "Rawat Jalan",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      namaRekening: "Dedi Saputra",
      nomorRekening: "0261-01-009823-53-1",
      namaBank: "Bank BRI",
      nominal: 8500000,
      tanggalBayar: "12/07/2026",
      satker: "KODAM ISKANDAR MUDA",
      unor: "TNI AD",
      rsProvider: "RS Tk. II Kesdam IM",
      diagnosa: "Dislokasi Acromioclavicular Dextra",
      status: "Sudah Bayar",
      dokter: "dr. Mayor Ckm Syamsul, Sp.B",
    },
    {
      no: 3,
      namaPeserta: "Bripka Rina Marlina",
      ktpa: "KPA-7721839",
      noSPP: "SPP/JKK/2026/07/103",
      noRekap: "RK-002/JKK/2026",
      noRestitusi: "REST-0093/2026",
      jenisKlaim: "Operasi Bedah",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Negara Indonesia (BNI)",
      namaRekening: "Rina Marlina",
      nomorRekening: "011-2233-4455",
      namaBank: "Bank BNI",
      nominal: 120000000,
      tanggalBayar: "15/07/2026",
      satker: "POLDA METRO JAYA",
      unor: "POLRI",
      rsProvider: "RS Bhayangkara Tk. I Said Sukanto",
      diagnosa: "Rekonstruksi Maksilofasial & Bedah Syaraf",
      status: "Sudah Bayar",
      dokter: "Kombes Pol dr. Bambang S., Sp.BS",
    },
    {
      no: 4,
      namaPeserta: "Koptu Hasan Fadilah",
      ktpa: "KPA-6648291",
      noSPP: "SPP/JKK/2026/07/104",
      noRekap: "RK-002/JKK/2026",
      noRestitusi: "REST-0094/2026",
      jenisKlaim: "Rawat Inap",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Mandiri (Persero) Tbk",
      namaRekening: "Hasan Fadilah",
      nomorRekening: "137-00-456789-0",
      namaBank: "Bank Mandiri",
      nominal: 32000000,
      tanggalBayar: "18/07/2026",
      satker: "LANTAMAL III JAKARTA",
      unor: "TNI AL",
      rsProvider: "RSAL dr. Mintohardjo",
      diagnosa: "Trauma Thorax & Kontusio Paru",
      status: "Sudah Bayar",
      dokter: "dr. Letkol Laut (K) Aris P., Sp.P",
    },
    {
      no: 5,
      namaPeserta: "Kapten Lina Wahyuni",
      ktpa: "KPA-5539201",
      noSPP: "SPP/JKK/2026/07/105",
      noRekap: "RK-003/JKK/2026",
      noRestitusi: "REST-0095/2026",
      jenisKlaim: "Rawat Jalan",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      namaRekening: "Lina Wahyuni",
      nomorRekening: "0261-01-004455-50-9",
      namaBank: "Bank BRI",
      nominal: 5200000,
      tanggalBayar: "20/07/2026",
      satker: "MABES TNI",
      unor: "MABES TNI",
      rsProvider: "RSPAD Gatot Soebroto",
      diagnosa: "Fisioterapi Pasca Trauma Servikal",
      status: "Sudah Bayar",
      dokter: "dr. Mayor Ckm (K) Endang, Sp.KFR",
    },
    {
      no: 6,
      namaPeserta: "Pelda Susanto",
      ktpa: "KPA-4428190",
      noSPP: "SPP/JKK/2026/07/106",
      noRekap: "RK-003/JKK/2026",
      noRestitusi: "REST-0096/2026",
      jenisKlaim: "Operasi Bedah",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Negara Indonesia (BNI)",
      namaRekening: "Susanto",
      nomorRekening: "034-5678-912",
      namaBank: "Bank BNI",
      nominal: 87000000,
      tanggalBayar: "22/07/2026",
      satker: "DITJEN STRAHAN KEMHAN",
      unor: "KEMHAN",
      rsProvider: "RSUP Fatmawati",
      diagnosa: "Artroskopi Rekonstruksi ACL & Meniscus",
      status: "Sudah Bayar",
      dokter: "dr. Arya Wicaksono, Sp.OT(K)",
    },
    {
      no: 7,
      namaPeserta: "Briptu Mega Silvia",
      ktpa: "KPA-3319082",
      noSPP: "SPP/JKK/2026/07/107",
      noRekap: "RK-004/JKK/2026",
      noRestitusi: "REST-0097/2026",
      jenisKlaim: "Rawat Inap",
      bulan: "Juni 2026",
      mitraBayar: "PT Bank Tabungan Negara (BTN)",
      namaRekening: "Mega Silvia",
      nomorRekening: "0012-01-002938-50-4",
      namaBank: "Bank BTN",
      nominal: 28000000,
      tanggalBayar: "25/06/2026",
      satker: "POLDA JABAR / DITLANTAS",
      unor: "POLRI",
      rsProvider: "RS Bhayangkara Sartika Asih",
      diagnosa: "Cedera Kepala Ringan & Multiple Vulnus",
      status: "Sudah Bayar",
      dokter: "dr. Kompol Firman, Sp.A",
    },
    {
      no: 8,
      namaPeserta: "Sertu Ahmad Ridwan",
      ktpa: "KPA-2208193",
      noSPP: "SPP/JKK/2026/07/108",
      noRekap: "RK-004/JKK/2026",
      noRestitusi: "REST-0098/2026",
      jenisKlaim: "Rawat Jalan",
      bulan: "Juni 2026",
      mitraBayar: "PT Bank Mandiri (Persero) Tbk",
      namaRekening: "Ahmad Ridwan",
      nomorRekening: "106-00-192837-4",
      namaBank: "Bank Mandiri",
      nominal: 12800000,
      tanggalBayar: "28/06/2026",
      satker: "SETJEN KEMHAN",
      unor: "KEMHAN",
      rsProvider: "RSAU dr. Esnawan Antariksa",
      diagnosa: "Perawatan Rawat Jalan & Obat Khusus JKK",
      status: "Sudah Bayar",
      dokter: "dr. Mayor Kes Tri Utomo, Sp.BS",
    },
    {
      no: 9,
      namaPeserta: "Mayor Laut (P) Hendra Kusuma",
      ktpa: "KPA-1197284",
      noSPP: "SPP/JKK/2026/07/109",
      noRekap: "RK-005/JKK/2026",
      noRestitusi: "REST-0099/2026",
      jenisKlaim: "Rawat Inap & ICU",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Syariah Indonesia Tbk",
      namaRekening: "Hendra Kusuma",
      nomorRekening: "712-345-6789",
      namaBank: "Bank BSI",
      nominal: 67500000,
      tanggalBayar: "30/07/2026",
      satker: "DISMATAL MABESAL",
      unor: "TNI AL",
      rsProvider: "RSAL dr. Mintohardjo",
      diagnosa: "Decompression Sickness Tipe II",
      status: "Sudah Bayar",
      dokter: "dr. Kolonel Laut (K) Sutanto, Sp.KL",
    },
    {
      no: 10,
      namaPeserta: "Aipda Bambang Triyono",
      ktpa: "KPA-9988172",
      noSPP: "SPP/JKK/2026/07/110",
      noRekap: "RK-005/JKK/2026",
      noRestitusi: "REST-0100/2026",
      jenisKlaim: "Reimbursment Perawatan",
      bulan: "Juli 2026",
      mitraBayar: "PT Bank Tabungan Negara (BTN)",
      namaRekening: "Bambang Triyono",
      nomorRekening: "0012-01-008899-50-3",
      namaBank: "Bank BTN",
      nominal: 42000000,
      tanggalBayar: "31/07/2026",
      satker: "KORBRIMOB POLRI",
      unor: "POLRI",
      rsProvider: "RS Dr. Oen Solo Baru",
      diagnosa: "Luka Bakar Akut Derajat II-III",
      status: "Sudah Bayar",
      dokter: "dr. Gunawan Santosa, Sp.B",
    },
  ];

  // Options Dropdown
  const bulanOptions = useMemo(() => {
    const list = Array.from(new Set(rawMonitoringJKK.map((d) => d.bulan)));
    return ["Semua", ...list];
  }, []);

  const jenisKlaimOptions = useMemo(() => {
    const list = Array.from(new Set(rawMonitoringJKK.map((d) => d.jenisKlaim)));
    return ["Semua", ...list];
  }, []);

  const mitraBayarOptions = useMemo(() => {
    const list = Array.from(new Set(rawMonitoringJKK.map((d) => d.mitraBayar)));
    return ["Semua", ...list];
  }, []);

  const namaBankOptions = useMemo(() => {
    const list = Array.from(new Set(rawMonitoringJKK.map((d) => d.namaBank)));
    return ["Semua", ...list];
  }, []);

  // Filter Logic
  const filteredData = useMemo(() => {
    return rawMonitoringJKK.filter((d) => {
      if (filterBulan !== "Semua" && d.bulan !== filterBulan) return false;
      if (filterJenisKlaim !== "Semua" && d.jenisKlaim !== filterJenisKlaim) return false;
      if (filterMitraBayar !== "Semua" && d.mitraBayar !== filterMitraBayar) return false;
      if (filterNamaBank !== "Semua" && d.namaBank !== filterNamaBank) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNama = d.namaPeserta.toLowerCase().includes(q);
        const matchKtpa = d.ktpa.toLowerCase().includes(q);
        const matchSPP = d.noSPP.toLowerCase().includes(q);
        const matchRekap = d.noRekap.toLowerCase().includes(q);
        const matchRestitusi = d.noRestitusi.toLowerCase().includes(q);
        const matchRek = d.nomorRekening.toLowerCase().includes(q);
        const matchNamaRek = d.namaRekening.toLowerCase().includes(q);
        if (
          !matchNama &&
          !matchKtpa &&
          !matchSPP &&
          !matchRekap &&
          !matchRestitusi &&
          !matchRek &&
          !matchNamaRek
        )
          return false;
      }
      return true;
    });
  }, [
    filterBulan,
    filterJenisKlaim,
    filterMitraBayar,
    filterNamaBank,
    searchQuery,
  ]);

  // Total calculation
  const totalNominal = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.nominal, 0),
    [filteredData]
  );

  const resetAllFilters = () => {
    setFilterBulan("Semua");
    setFilterJenisKlaim("Semua");
    setFilterMitraBayar("Semua");
    setFilterNamaBank("Semua");
    setSearchQuery("");
  };

  return (
    <div>
      {/* PREVIEW EXPORT MODAL */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* DETAIL MODAL RESTITUSI / KLAIM JKK */}
      {selectedDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 16,
          }}
          onClick={() => setSelectedDetail(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 750,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)",
              overflow: "hidden",
              border: "1px solid #CBD5E1",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                background: "#0F2960",
                color: COLORS.white,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.2 }}>
                    Detail Berkas Monitoring JKK Perawatan
                  </span>
                  <Badge color="green">
                    {selectedDetail.status}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: "#93C5FD", marginTop: 4 }}>
                  No. SPP: <strong style={{ color: COLORS.white }}>{selectedDetail.noSPP}</strong> • No. Restitusi: {selectedDetail.noRestitusi}
                </div>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: COLORS.white,
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              {/* Financial Highlight */}
              <div
                style={{
                  background: "#EFF6FF",
                  border: "1.5px solid #BFDBFE",
                  borderRadius: 10,
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "#1E40AF", fontWeight: 700, textTransform: "uppercase" }}>
                    Nominal Pencairan Klaim
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#1E3A8A",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {fmt(selectedDetail.nominal)}
                  </div>
                  <div style={{ fontSize: 12, color: "#3B82F6", marginTop: 2 }}>
                    Tanggal Bayar: <strong>{selectedDetail.tanggalBayar}</strong> • Periode: {selectedDetail.bulan}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>Jenis Klaim</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900 }}>
                    {selectedDetail.jenisKlaim}
                  </div>
                  <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 4 }}>No. Rekapitulasi</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 600, color: COLORS.blueDark }}>
                    {selectedDetail.noRekap}
                  </div>
                </div>
              </div>

              {/* 2 Column Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  fontSize: 12.5,
                }}
              >
                {/* Column 1: Identitas Peserta & Medis */}
                <div
                  style={{
                    background: "#F8FAFC",
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ fontWeight: 700, color: COLORS.gray900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <User size={14} color={COLORS.blue} /> Data Peserta & Klaim
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Nama Peserta:</span>
                    <strong>{selectedDetail.namaPeserta}</strong>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>KPA:</span>
                    <span style={{ fontFamily: "monospace", color: COLORS.blue, fontWeight: 700 }}>
                      {selectedDetail.ktpa}
                    </span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Unor / Satker:</span>
                    <span>{selectedDetail.unor} — {selectedDetail.satker}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>RS Provider:</span>
                    <strong>{selectedDetail.rsProvider}</strong>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Diagnosa:</span>
                    <span style={{ color: "#B45309", fontWeight: 600 }}>{selectedDetail.diagnosa}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Dokter:</span>
                    <span>{selectedDetail.dokter}</span>
                  </div>
                </div>

                {/* Column 2: Data Perbankan & Rekening */}
                <div
                  style={{
                    background: "#F8FAFC",
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ fontWeight: 700, color: COLORS.gray900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <CreditCard size={14} color={COLORS.blue} /> Rekening Penerima & Bank
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Mitra Bayar:</span>
                    <strong>{selectedDetail.mitraBayar}</strong>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Nama Bank:</span>
                    <span>{selectedDetail.namaBank}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Nama Rekening:</span>
                    <strong>{selectedDetail.namaRekening}</strong>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Nomor Rekening:</span>
                    <span style={{ fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 700 }}>
                      {selectedDetail.nomorRekening}
                    </span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>No. Restitusi:</span>
                    <span style={{ fontFamily: "monospace" }}>{selectedDetail.noRestitusi}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 110 }}>Tgl Pencairan:</span>
                    <span style={{ fontWeight: 600, color: COLORS.green }}>{selectedDetail.tanggalBayar}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "14px 24px",
                background: "#F8FAFC",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, color: COLORS.gray500 }}>
                Program JKK (Jaminan Kecelakaan Kerja) ASABRI
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setSelectedDetail(null)}>
                  Tutup
                </Btn>
                <Btn
                  onClick={() => {
                    alert(`Mengunduh Berkas SPP & Bukti Pencairan Klaim: ${selectedDetail.noSPP}`);
                  }}
                >
                  <Download size={14} /> Cetak Bukti SPP (PDF)
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon={<HeartPulse size={20} />}
          label="Total Nominal JKK Perawatan"
          value={fmt(totalNominal)}
          color={COLORS.blue}
          subtext={`${filteredData.length} berkas pembayaran restitusi`}
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Berkas Telah Dibayar"
          value={filteredData.filter((d) => d.status === "Sudah Bayar").length.toString()}
          color={COLORS.green}
          subtext="100% SPP telah direalisasikan"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Rata-rata Klaim / Berkas"
          value={fmt(filteredData.length > 0 ? Math.round(totalNominal / filteredData.length) : 0)}
          color={COLORS.purple}
          subtext="Rerata nilai pertanggungan medis"
        />
        <StatCard
          icon={<Receipt size={20} />}
          label="Total Berkas Restitusi"
          value={`${filteredData.length} Klaim`}
          color={COLORS.orange}
          subtext="Monitoring berkas tersalurkan"
        />
      </div>

      {/* FILTER PANEL */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 18px",
            background: "#F8FAFC",
            borderBottom: `1px solid ${COLORS.gray200}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} color={COLORS.blue} />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900 }}>
              Filter Monitoring JKK Perawatan
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={resetAllFilters}
              style={{
                border: "1px solid #CBD5E1",
                background: COLORS.white,
                color: COLORS.gray700,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 6,
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
            <Btn
              size="sm"
              variant="outline"
              onClick={() =>
                setPreview({
                  title: "Monitoring JKK Perawatan — Daftar Surat Perintah Pembayaran Klaim",
                  data: filteredData.map((d, idx) => ({
                    NO: idx + 1,
                    "Nama Peserta": d.namaPeserta,
                    KPA: d.ktpa,
                    "NO SPP": d.noSPP,
                    "NO REKAP": d.noRekap,
                    "No Restitusi": d.noRestitusi,
                    "JENIS KLAIM": d.jenisKlaim,
                    BULAN: d.bulan,
                    "MITRA BAYAR": d.mitraBayar,
                    "Nama Rekening": d.namaRekening,
                    "Nomor Rekening": d.nomorRekening,
                    "Nama Bank": d.namaBank,
                    Nominal: d.nominal,
                    "Tanggal Bayar": d.tanggalBayar,
                  })),
                })
              }
            >
              <FileSpreadsheet size={13} /> Ekspor Data (.xlsx)
            </Btn>
          </div>
        </div>

        {/* Filter Controls */}
        <div
          style={{
            padding: "16px 18px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            background: COLORS.white,
          }}
        >
          {/* 1. Quick Search */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
              Pencarian (Nama, SPP, KPA, Rekap)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik kata kunci..."
                style={{
                  width: "100%",
                  padding: "7.5px 10px 7.5px 30px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <Search
                size={14}
                color={COLORS.gray400}
                style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          {/* 2. Bulan */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
              Bulan
            </label>
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {bulanOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Jenis Klaim */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
              Jenis Klaim
            </label>
            <select
              value={filterJenisKlaim}
              onChange={(e) => setFilterJenisKlaim(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {jenisKlaimOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Mitra Bayar */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
              Mitra Bayar
            </label>
            <select
              value={filterMitraBayar}
              onChange={(e) => setFilterMitraBayar(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {mitraBayarOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Nama Bank */}
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 5 }}>
              Nama Bank
            </label>
            <select
              value={filterNamaBank}
              onChange={(e) => setFilterNamaBank(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {namaBankOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABEL DATA MONITORING JKK PERAWATAN SESUAI PERSIS DENGAN GAMBAR 14 KOLOM */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          border: `1px solid ${COLORS.gray300}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            textAlign: "left",
            minWidth: 1400,
          }}
        >
          <thead>
            {/* HEADER PERSIS DENGAN GAMBAR: LATAR BELAKANG BIRU TUA & TEKS PUTIH */}
            <tr style={{ background: "#0F3F7A", color: COLORS.white, fontWeight: 800 }}>
              {/* 1. NO */}
              <th style={{ padding: "11px 8px", border: "1px solid #1E5296", textAlign: "center", width: 45 }}>
                NO
              </th>
              {/* 2. Nama Peserta */}
              <th style={{ padding: "11px 12px", border: "1px solid #1E5296", minWidth: 155 }}>
                Nama Peserta
              </th>
              {/* 3. KPA */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 110, textAlign: "center" }}>
                KPA
              </th>
              {/* 4. NO SPP */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 140, textAlign: "center" }}>
                NO SPP
              </th>
              {/* 5. NO REKAP */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 130, textAlign: "center" }}>
                NO REKAP
              </th>
              {/* 6. No Restitusi */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 120, textAlign: "center" }}>
                No Restitusi
              </th>
              {/* 7. JENIS KLAIM */}
              <th style={{ padding: "11px 12px", border: "1px solid #1E5296", minWidth: 140 }}>
                JENIS KLAIM
              </th>
              {/* 8. BULAN */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 95, textAlign: "center" }}>
                BULAN
              </th>
              {/* 9. MITRA BAYAR */}
              <th style={{ padding: "11px 12px", border: "1px solid #1E5296", minWidth: 140 }}>
                MITRA BAYAR
              </th>
              {/* 10. Nama Rekening */}
              <th style={{ padding: "11px 12px", border: "1px solid #1E5296", minWidth: 140 }}>
                Nama Rekening
              </th>
              {/* 11. Nomor Rekening */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 135, textAlign: "center" }}>
                Nomor Rekening
              </th>
              {/* 12. Nama Bank */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 110 }}>
                Nama Bank
              </th>
              {/* 13. Nominal */}
              <th style={{ padding: "11px 12px", border: "1px solid #1E5296", minWidth: 125, textAlign: "right" }}>
                Nominal
              </th>
              {/* 14. Tanggal Bayar */}
              <th style={{ padding: "11px 10px", border: "1px solid #1E5296", minWidth: 105, textAlign: "center" }}>
                Tanggal Bayar
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ padding: 40, textAlign: "center", color: COLORS.gray500, border: "1px solid #CBD5E1" }}>
                  Tidak ada data Monitoring JKK Perawatan yang memenuhi filter pencarian.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr
                  key={row.no}
                  style={{
                    background: idx % 2 === 0 ? COLORS.white : "#F8FAFC",
                    transition: "background 0.12s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = idx % 2 === 0 ? COLORS.white : "#F8FAFC")
                  }
                  onClick={() => setSelectedDetail(row)}
                >
                  {/* 1. NO */}
                  <td style={{ padding: "8px 6px", border: "1px solid #CBD5E1", textAlign: "center", fontWeight: 600 }}>
                    {idx + 1}
                  </td>

                  {/* 2. Nama Peserta */}
                  <td style={{ padding: "8px 12px", border: "1px solid #CBD5E1", fontWeight: 700, color: COLORS.gray900 }}>
                    {row.namaPeserta}
                  </td>

                  {/* 3. KPA */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontWeight: 600, color: COLORS.blue }}>
                    {row.ktpa}
                  </td>

                  {/* 4. NO SPP */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontSize: 11.5, color: COLORS.blueDark }}>
                    {row.noSPP}
                  </td>

                  {/* 5. NO REKAP */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontSize: 11.5 }}>
                    {row.noRekap}
                  </td>

                  {/* 6. No Restitusi */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontSize: 11.5, color: "#92400E" }}>
                    {row.noRestitusi}
                  </td>

                  {/* 7. JENIS KLAIM */}
                  <td style={{ padding: "8px 12px", border: "1px solid #CBD5E1", fontSize: 11.5 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "#EFF6FF",
                        color: "#1E40AF",
                        fontWeight: 600,
                      }}
                    >
                      {row.jenisKlaim}
                    </span>
                  </td>

                  {/* 8. BULAN */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontSize: 11.5 }}>
                    {row.bulan}
                  </td>

                  {/* 9. MITRA BAYAR */}
                  <td style={{ padding: "8px 12px", border: "1px solid #CBD5E1", fontSize: 11.5 }}>
                    {row.mitraBayar.replace("PT ", "").replace(" (Persero) Tbk", "")}
                  </td>

                  {/* 10. Nama Rekening */}
                  <td style={{ padding: "8px 12px", border: "1px solid #CBD5E1", fontWeight: 600, color: COLORS.gray800 }}>
                    {row.namaRekening}
                  </td>

                  {/* 11. Nomor Rekening */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontSize: 11.5, fontWeight: 700, color: "#0F172A" }}>
                    {row.nomorRekening}
                  </td>

                  {/* 12. Nama Bank */}
                  <td style={{ padding: "8px 10px", border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 600 }}>
                    {row.namaBank}
                  </td>

                  {/* 13. Nominal */}
                  <td style={{ padding: "8px 12px", border: "1px solid #CBD5E1", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.green }}>
                    {fmt(row.nominal)}
                  </td>

                  {/* 14. Tanggal Bayar */}
                  <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontSize: 11.5, fontWeight: 600, color: COLORS.gray700 }}>
                    {row.tanggalBayar}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* BARIS FOOTER TOTAL */}
          <tfoot>
            <tr
              style={{
                background: "#0F2960",
                color: COLORS.white,
                fontWeight: 800,
                fontSize: 12.5,
              }}
            >
              {/* Kolom 1 s.d. 12 digabung menjadi 'TOTAL' */}
              <td
                colSpan={12}
                style={{
                  padding: "12px 18px",
                  border: "1px solid #1E3A8A",
                  textAlign: "center",
                  letterSpacing: 1.5,
                  fontSize: 13,
                }}
              >
                TOTAL
              </td>

              {/* Kolom 13: Total Nominal */}
              <td
                style={{
                  padding: "12px 12px",
                  border: "1px solid #1E3A8A",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#4ADE80",
                  fontSize: 13.5,
                }}
              >
                {fmt(totalNominal)}
              </td>

              {/* Kolom 14: Tanggal Bayar (Kosong) */}
              <td style={{ border: "1px solid #1E3A8A" }} />
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 11.5, color: COLORS.gray500, display: "flex", justifyContent: "space-between" }}>
        <span>* Format monitoring pembayaran JKK Perawatan mengacu pada format resmi rekapitulasi restitusi SPP ASABRI.</span>
        <span>Klik baris mana saja untuk melihat rincian berkas, diagnosa, dan bukti pencairan.</span>
      </div>
    </div>
  );
};
