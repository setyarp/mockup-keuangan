import { useState, useMemo } from "react";
import {
  Filter,
  Search,
  RotateCcw,
  Download,
  Building2,
  User,
  CreditCard,
  Calendar,
  Layers,
  FileSpreadsheet,
  Eye,
  CheckCircle2,
  Clock,
  Home,
  DollarSign,
  FileText,
  Percent,
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { StatCard, Badge, Btn, PreviewModal } from "../components/common";

export const HutangPUMKPR = () => {
  // 5 Filter State persis seperti di gambar
  const [filterNama, setFilterNama] = useState("Semua");
  const [filterKTPA, setFilterKTPA] = useState("Semua");
  const [filterTahun, setFilterTahun] = useState("Semua");
  const [filterDariPeriode, setFilterDariPeriode] = useState("Semua");
  const [filterSampaiPeriode, setFilterSampaiPeriode] = useState("Semua");

  // Search query cepat & modal detail
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [preview, setPreview] = useState(null);

  const fmt = (n) =>
    typeof n === "number" ? `Rp ${n.toLocaleString("id-ID")}` : n;

  // Master Data Hutang PUM KPR Peserta ASABRI
  const rawPUMData = [
    {
      no: 1,
      nama: "Mayor Inf. Hendra Kusuma",
      nik: "3175081204850001",
      ktpa: "KTPA-8829102",
      nrp: "1104018291",
      satker: "KODAM JAYA / YONIF 201",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-002938-50-4",
      nominalPenyaluran: 40000000,
      tglPenyaluran: "15/03/2022",
      tahunPenyaluran: "2022",
      bulanPenyaluran: "Maret",
      nominalPelunasan: 25000000,
      tglPelunasan: "15/06/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Perumahan Griya Asri Cibubur, Bogor",
      angsuranPerBulan: 500000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 2,
      nama: "Lettu Laut Dian Pratama",
      nik: "3273110906880002",
      ktpa: "KTPA-9930192",
      nrp: "1109028371",
      satker: "KORMAR TNI AL / BRIGIF 1",
      bankPeserta: "PT Bank Rakyat Indonesia (Persero) Tbk",
      noRekPeserta: "0261-01-009823-53-1",
      nominalPenyaluran: 35000000,
      tglPenyaluran: "10/05/2023",
      tahunPenyaluran: "2023",
      bulanPenyaluran: "Mei",
      nominalPelunasan: 35000000,
      tglPelunasan: "20/05/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Mei",
      lokasiPerumahan: "Pondok Marinir Indah, Sidoarjo",
      angsuranPerBulan: 700000,
      statusPinjaman: "Lunas",
    },
    {
      no: 3,
      nama: "Aipda Bambang Triyono",
      nik: "3578012403910003",
      ktpa: "KTPA-7721839",
      nrp: "85030291",
      satker: "POLDA METRO JAYA / DITLANTAS",
      bankPeserta: "PT Bank Mandiri (Persero) Tbk",
      noRekPeserta: "137-00-192837-1",
      nominalPenyaluran: 50000000,
      tglPenyaluran: "20/08/2021",
      tahunPenyaluran: "2021",
      bulanPenyaluran: "Agustus",
      nominalPelunasan: 30000000,
      tglPelunasan: "02/07/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juli",
      lokasiPerumahan: "Cluster Bhayangkara Residence, Bekasi",
      angsuranPerBulan: 650000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 4,
      nama: "Peltu Agus Susanto",
      nik: "3374021708820004",
      ktpa: "KTPA-6648291",
      nrp: "2102039182",
      satker: "LANUD HALIM PERDANAKUSUMA",
      bankPeserta: "PT Bank Negara Indonesia (Persero) Tbk",
      noRekPeserta: "034-5678-912",
      nominalPenyaluran: 30000000,
      tglPenyaluran: "12/01/2024",
      tahunPenyaluran: "2024",
      bulanPenyaluran: "Januari",
      nominalPelunasan: 12000000,
      tglPelunasan: "12/06/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Bumi Dirgantara Indah, Bogor",
      angsuranPerBulan: 450000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 5,
      nama: "Serka Yudi Hermawan",
      nik: "3174092211890005",
      ktpa: "KTPA-5539201",
      nrp: "3109048291",
      satker: "PUSBEKKANGAD",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-004455-50-9",
      nominalPenyaluran: 30000000,
      tglPenyaluran: "05/11/2022",
      tahunPenyaluran: "2022",
      bulanPenyaluran: "November",
      nominalPelunasan: 18000000,
      tglPelunasan: "05/06/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Griya Kartika Cileungsi, Bogor",
      angsuranPerBulan: 500000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 6,
      nama: "Kapten Kav. Eko Prasetyo",
      nik: "3276051402860006",
      ktpa: "KTPA-4428190",
      nrp: "1106029182",
      satker: "KODAM III / SILIWANGI",
      bankPeserta: "PT Bank Syariah Indonesia Tbk",
      noRekPeserta: "712-345-6789",
      nominalPenyaluran: 45000000,
      tglPenyaluran: "18/06/2023",
      tahunPenyaluran: "2023",
      bulanPenyaluran: "Juni",
      nominalPelunasan: 20000000,
      tglPelunasan: "18/05/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Mei",
      lokasiPerumahan: "Grand Siliwangi Hills, Bandung Barat",
      angsuranPerBulan: 600000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 7,
      nama: "PNS Supriyadi, S.Kom.",
      nik: "3171011507870007",
      ktpa: "KTPA-3319082",
      nrp: "198707152011011001",
      satker: "SETJEN KEMHAN RI",
      bankPeserta: "PT Bank Mandiri (Persero) Tbk",
      noRekPeserta: "106-00-192837-4",
      nominalPenyaluran: 35000000,
      tglPenyaluran: "08/04/2024",
      tahunPenyaluran: "2024",
      bulanPenyaluran: "April",
      nominalPelunasan: 8000000,
      tglPelunasan: "08/06/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Pesona Kemhan Depok",
      angsuranPerBulan: 500000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 8,
      nama: "Bripka Ahmad Firdaus",
      nik: "3671040810900008",
      ktpa: "KTPA-2208193",
      nrp: "90100452",
      satker: "KORBRIMOB POLRI",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-006677-50-1",
      nominalPenyaluran: 40000000,
      tglPenyaluran: "14/09/2022",
      tahunPenyaluran: "2022",
      bulanPenyaluran: "September",
      nominalPelunasan: 40000000,
      tglPelunasan: "14/04/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "April",
      lokasiPerumahan: "Brimob Residence Kelapa Dua, Depok",
      angsuranPerBulan: 650000,
      statusPinjaman: "Lunas",
    },
    {
      no: 9,
      nama: "Mayor Laut (P) Faisal Basri",
      nik: "3275031901840009",
      ktpa: "KTPA-1197284",
      nrp: "1103019283",
      satker: "DISMATAL MABESAL",
      bankPeserta: "PT Bank Rakyat Indonesia (Persero) Tbk",
      noRekPeserta: "0261-01-003344-53-8",
      nominalPenyaluran: 45000000,
      tglPenyaluran: "22/10/2021",
      tahunPenyaluran: "2021",
      bulanPenyaluran: "Oktober",
      nominalPelunasan: 32000000,
      tglPelunasan: "22/06/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Jala Graha Marina, Bekasi",
      angsuranPerBulan: 600000,
      statusPinjaman: "Aktif Mengangsur",
    },
    {
      no: 10,
      nama: "Serma Dwi Cahyono",
      nik: "3372061205880010",
      ktpa: "KTPA-9988172",
      nrp: "3108039182",
      satker: "DITZIAD",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-008899-50-3",
      nominalPenyaluran: 30000000,
      tglPenyaluran: "30/07/2023",
      tahunPenyaluran: "2023",
      bulanPenyaluran: "Juli",
      nominalPelunasan: 12000000,
      tglPelunasan: "30/05/2026",
      tahunPelunasan: "2026",
      bulanPelunasan: "Mei",
      lokasiPerumahan: "Perum Zeni Mandiri, Cibinong",
      angsuranPerBulan: 500000,
      statusPinjaman: "Aktif Mengangsur",
    },
  ];

  // Options Dropdown berdasarkan gambar
  const namaOptions = useMemo(() => {
    const list = Array.from(new Set(rawPUMData.map((d) => d.nama)));
    return ["Semua", ...list];
  }, [rawPUMData]);

  const ktpaOptions = useMemo(() => {
    const list = Array.from(new Set(rawPUMData.map((d) => d.ktpa)));
    return ["Semua", ...list];
  }, [rawPUMData]);

  const tahunOptions = ["Semua", "2026", "2025", "2024", "2023", "2022", "2021"];

  const periodeOptions = [
    "Semua",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Filtering data
  const filteredData = useMemo(() => {
    return rawPUMData.filter((d) => {
      if (filterNama !== "Semua" && d.nama !== filterNama) return false;
      if (filterKTPA !== "Semua" && d.ktpa !== filterKTPA) return false;
      if (filterTahun !== "Semua" && d.tahunPenyaluran !== filterTahun && d.tahunPelunasan !== filterTahun)
        return false;
      if (filterDariPeriode !== "Semua" && d.bulanPenyaluran !== filterDariPeriode)
        return false;
      if (filterSampaiPeriode !== "Semua" && d.bulanPelunasan !== filterSampaiPeriode)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNama = d.nama.toLowerCase().includes(q);
        const matchKtpa = d.ktpa.toLowerCase().includes(q);
        const matchNik = d.nik.toLowerCase().includes(q);
        const matchNrp = d.nrp.toLowerCase().includes(q);
        const matchSatker = d.satker.toLowerCase().includes(q);
        const matchBank = d.bankPeserta.toLowerCase().includes(q);
        const matchRek = d.noRekPeserta.toLowerCase().includes(q);
        if (
          !matchNama &&
          !matchKtpa &&
          !matchNik &&
          !matchNrp &&
          !matchSatker &&
          !matchBank &&
          !matchRek
        )
          return false;
      }
      return true;
    });
  }, [
    rawPUMData,
    filterNama,
    filterKTPA,
    filterTahun,
    filterDariPeriode,
    filterSampaiPeriode,
    searchQuery,
  ]);

  // Totals calculation
  const totalPenyaluran = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.nominalPenyaluran, 0),
    [filteredData]
  );
  const totalPelunasan = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.nominalPelunasan, 0),
    [filteredData]
  );
  // Sisa Piutang PUM = Nominal Penyaluran - Nominal Pelunasan
  const totalPiutangPUM = useMemo(
    () => totalPenyaluran - totalPelunasan,
    [totalPenyaluran, totalPelunasan]
  );

  const resetAllFilters = () => {
    setFilterNama("Semua");
    setFilterKTPA("Semua");
    setFilterTahun("Semua");
    setFilterDariPeriode("Semua");
    setFilterSampaiPeriode("Semua");
    setSearchQuery("");
  };

  return (
    <div>
      {/* PREVIEW EXPORT MODAL */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* DETAIL MODAL PINJAMAN PUM KPR */}
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
              maxWidth: 720,
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
                background: "#0F172A",
                color: COLORS.white,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.2 }}>
                    Kartu Rincian Piutang PUM KPR Peserta
                  </span>
                  <Badge
                    color={
                      selectedDetail.statusPinjaman === "Lunas"
                        ? "green"
                        : "blue"
                    }
                  >
                    {selectedDetail.statusPinjaman}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                  KTPA: <strong style={{ color: "#E2E8F0" }}>{selectedDetail.ktpa}</strong> • NIK: {selectedDetail.nik}
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
              {/* 3 Metric Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#0369A1", fontWeight: 700, textTransform: "uppercase" }}>
                    Nominal Penyaluran
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#0C4A6E",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {fmt(selectedDetail.nominalPenyaluran)}
                  </div>
                  <div style={{ fontSize: 11, color: "#0284C7", marginTop: 2 }}>
                    Tgl: {selectedDetail.tglPenyaluran}
                  </div>
                </div>

                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #86EFAC",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#15803D", fontWeight: 700, textTransform: "uppercase" }}>
                    Nominal Pelunasan
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#14532D",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {fmt(selectedDetail.nominalPelunasan)}
                  </div>
                  <div style={{ fontSize: 11, color: "#16A34A", marginTop: 2 }}>
                    Tgl: {selectedDetail.tglPelunasan}
                  </div>
                </div>

                <div
                  style={{
                    background: selectedDetail.nominalPenyaluran - selectedDetail.nominalPelunasan > 0 ? "#FFFBEB" : "#F8FAFC",
                    border: `1px solid ${selectedDetail.nominalPenyaluran - selectedDetail.nominalPelunasan > 0 ? "#FDE68A" : "#CBD5E1"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: selectedDetail.nominalPenyaluran - selectedDetail.nominalPelunasan > 0 ? "#B45309" : "#475569",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Sisa Piutang PUM [13=(11-9)]
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: selectedDetail.nominalPenyaluran - selectedDetail.nominalPelunasan > 0 ? "#92400E" : "#0F172A",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {fmt(Math.max(0, selectedDetail.nominalPenyaluran - selectedDetail.nominalPelunasan))}
                  </div>
                  <div style={{ fontSize: 11, color: "#78716C", marginTop: 2 }}>
                    Angsuran: {fmt(selectedDetail.angsuranPerBulan)}/bln
                  </div>
                </div>
              </div>

              {/* Data Detail Peserta & Rumah */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  fontSize: 12.5,
                }}
              >
                <div
                  style={{
                    background: "#F8FAFC",
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ fontWeight: 700, color: COLORS.gray900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <User size={14} color={COLORS.blue} /> Identitas Peserta
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>Nama:</span>
                    <strong>{selectedDetail.nama}</strong>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>NRP / NIP:</span>
                    <span style={{ fontFamily: "monospace" }}>{selectedDetail.nrp}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>NIK:</span>
                    <span style={{ fontFamily: "monospace" }}>{selectedDetail.nik}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>Satker:</span>
                    <span>{selectedDetail.satker}</span>
                  </div>
                </div>

                <div
                  style={{
                    background: "#F8FAFC",
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div style={{ fontWeight: 700, color: COLORS.gray900, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <Building2 size={14} color={COLORS.blue} /> Fasilitas Bank & Agunan
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>Bank Penyalur:</span>
                    <strong>{selectedDetail.bankPeserta}</strong>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>No. Rekening:</span>
                    <span style={{ fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 700 }}>
                      {selectedDetail.noRekPeserta}
                    </span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>Lokasi Rumah:</span>
                    <span>{selectedDetail.lokasiPerumahan}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ color: COLORS.gray500, display: "inline-block", width: 100 }}>Status:</span>
                    <span style={{ fontWeight: 600, color: selectedDetail.statusPinjaman === "Lunas" ? COLORS.green : COLORS.blueDark }}>
                      {selectedDetail.statusPinjaman}
                    </span>
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
                Rekonsiliasi Pinjaman Uang Muka KPR ASABRI
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setSelectedDetail(null)}>
                  Tutup
                </Btn>
                <Btn
                  onClick={() => {
                    alert(`Mengunduh Berkas Rekapitulasi Piutang PUM KPR: ${selectedDetail.nama}`);
                  }}
                >
                  <Download size={14} /> Cetak Kartu Piutang PUM
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon={<Home size={20} />}
          label="Total Penyaluran PUM KPR"
          value={fmt(totalPenyaluran)}
          color={COLORS.blue}
          subtext={`${filteredData.length} debitur personil`}
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Nominal Pelunasan"
          value={fmt(totalPelunasan)}
          color={COLORS.green}
          subtext={`Realisasi pelunasan s/d Juli 2026`}
        />
        <StatCard
          icon={<FileText size={20} />}
          label="Total Piutang PUM (Sisa Saldo)"
          value={fmt(totalPiutangPUM)}
          color={COLORS.orange}
          subtext={`Saldo berjalan tagihan PUM`}
        />
        <StatCard
          icon={<Percent size={20} />}
          label="Tingkat Pelunasan (Recovery Rate)"
          value={`${totalPenyaluran > 0 ? ((totalPelunasan / totalPenyaluran) * 100).toFixed(1) : 0}%`}
          color={COLORS.purple}
          subtext="Persentase pelunasan debitur"
        />
      </div>

      {/* FILTER PANEL SESUAI PERSIS DENGAN GAMBAR (Nama, KTPA, Tahun, Dari Periode, Sampai Periode) */}
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
        {/* Filter Title Bar */}
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
              Filter Parameter Piutang PUM KPR
            </span>
            <span style={{ fontSize: 11, color: COLORS.gray500 }}>
              (Sesuai format resmi lembar monitoring PUM)
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
                  title: "Daftar Penyaluran dan Pelunasan Piutang PUM KPR",
                  data: filteredData.map((d, idx) => ({
                    No: idx + 1,
                    Nama: d.nama,
                    NIK: d.nik,
                    KTPA: d.ktpa,
                    NRP: d.nrp,
                    Satker: d.satker,
                    Bank: d.bankPeserta,
                    Rekening: d.noRekPeserta,
                    Penyaluran: d.nominalPenyaluran,
                    TglPenyaluran: d.tglPenyaluran,
                    Pelunasan: d.nominalPelunasan,
                    TglPelunasan: d.tglPelunasan,
                    PiutangPUM: Math.max(0, d.nominalPenyaluran - d.nominalPelunasan),
                  })),
                })
              }
            >
              <FileSpreadsheet size={13} /> Ekspor Data
            </Btn>
          </div>
        </div>

        {/* 5 DROPDOWNS PERSIS SEPERTI GAMBAR HEADER */}
        <div
          style={{
            padding: "16px 18px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            background: COLORS.white,
          }}
        >
          {/* 1. Nama */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11.5,
                fontWeight: 700,
                color: COLORS.gray700,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Nama
            </label>
            <select
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {namaOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 2. KTPA */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11.5,
                fontWeight: 700,
                color: COLORS.gray700,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              KTPA
            </label>
            <select
              value={filterKTPA}
              onChange={(e) => setFilterKTPA(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {ktpaOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Tahun */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11.5,
                fontWeight: 700,
                color: COLORS.gray700,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Tahun
            </label>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {tahunOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Dari Periode */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11.5,
                fontWeight: 700,
                color: COLORS.gray700,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Dari Periode
            </label>
            <select
              value={filterDariPeriode}
              onChange={(e) => setFilterDariPeriode(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {periodeOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Sampai Periode */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11.5,
                fontWeight: 700,
                color: COLORS.gray700,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              Sampai Periode
            </label>
            <select
              value={filterSampaiPeriode}
              onChange={(e) => setFilterSampaiPeriode(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12,
                color: COLORS.gray800,
                background: COLORS.white,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {periodeOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Quick Search */}
        <div
          style={{
            padding: "8px 18px 14px",
            borderTop: "1px dashed #E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pencarian cepat (Nama, Satker, Bank, Rekening)..."
              style={{
                width: "100%",
                padding: "6.5px 10px 6.5px 30px",
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
          <div style={{ fontSize: 12, color: COLORS.gray500 }}>
            Menampilkan <strong>{filteredData.length}</strong> data debitur PUM
          </div>
        </div>
      </div>

      {/* TABEL DATA PERSIS SEPERTI GAMBAR (13 KOLOM + 2 BARIS HEADER + FOOTER TOTAL) */}
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
            minWidth: 1280,
          }}
        >
          <thead>
            {/* BARIS HEADER 1: JUDUL KOLOM PERSIS GAMBAR */}
            <tr style={{ background: "#F1F5F9", color: "#0F172A", fontWeight: 800 }}>
              <th style={{ padding: "10px 8px", border: "1px solid #CBD5E1", textAlign: "center", width: 45 }}>
                NO
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 150 }}>
                NAMA
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 125, textAlign: "center" }}>
                NIK
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 110, textAlign: "center" }}>
                KTPA
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 95, textAlign: "center" }}>
                NRP
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 140 }}>
                SATKER TNI/POLRI
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 130 }}>
                BANK PESERTA
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 120, textAlign: "center" }}>
                NO REK PESERTA
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 125, textAlign: "right" }}>
                NOMINAL PENYALURAN
              </th>
              <th style={{ padding: "10px 8px", border: "1px solid #CBD5E1", minWidth: 95, textAlign: "center" }}>
                TGL. PENYALURAN
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 125, textAlign: "right" }}>
                NOMINAL PELUNASAN
              </th>
              <th style={{ padding: "10px 8px", border: "1px solid #CBD5E1", minWidth: 95, textAlign: "center" }}>
                TGL. PELUNASAN
              </th>
              <th style={{ padding: "10px 10px", border: "1px solid #CBD5E1", minWidth: 135, textAlign: "right" }}>
                PIUTANG PUM
              </th>
            </tr>

            {/* BARIS HEADER 2: PENOMORAN KOLOM PERSIS GAMBAR (1 s.d. 13 = (11-9)) */}
            <tr style={{ background: "#E2E8F0", color: "#334155", fontWeight: 700, fontSize: 11 }}>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>1</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>2</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>3</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>4</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>5</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>6</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>7</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>8</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>9</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>10</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>11</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center" }}>12</th>
              <th style={{ padding: "5px 4px", border: "1px solid #CBD5E1", textAlign: "center", color: "#B91C1C", fontWeight: 800 }}>
                13 = (11-9)
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ padding: 40, textAlign: "center", color: COLORS.gray500, border: "1px solid #CBD5E1" }}>
                  Tidak ada data debitur PUM yang memenuhi filter pencarian.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => {
                const sisaPiutang = row.nominalPenyaluran - row.nominalPelunasan;
                const isLunas = sisaPiutang <= 0;

                return (
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

                    {/* 2. NAMA */}
                    <td style={{ padding: "8px 10px", border: "1px solid #CBD5E1", fontWeight: 700, color: COLORS.gray900 }}>
                      {row.nama}
                    </td>

                    {/* 3. NIK */}
                    <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontSize: 11.5 }}>
                      {row.nik}
                    </td>

                    {/* 4. KTPA */}
                    <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontWeight: 600, color: COLORS.blue }}>
                      {row.ktpa}
                    </td>

                    {/* 5. NRP */}
                    <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace" }}>
                      {row.nrp}
                    </td>

                    {/* 6. SATKER TNI/POLRI */}
                    <td style={{ padding: "8px 10px", border: "1px solid #CBD5E1", fontSize: 11.5 }}>
                      {row.satker}
                    </td>

                    {/* 7. BANK PESERTA */}
                    <td style={{ padding: "8px 10px", border: "1px solid #CBD5E1", fontSize: 11.5 }}>
                      {row.bankPeserta.replace("PT ", "").replace(" (Persero) Tbk", "")}
                    </td>

                    {/* 8. NO REK PESERTA */}
                    <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontFamily: "monospace", fontSize: 11.5 }}>
                      {row.noRekPeserta}
                    </td>

                    {/* 9. NOMINAL PENYALURAN */}
                    <td style={{ padding: "8px 10px", border: "1px solid #CBD5E1", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0C4A6E" }}>
                      {fmt(row.nominalPenyaluran)}
                    </td>

                    {/* 10. TGL. PENYALURAN */}
                    <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontSize: 11.5 }}>
                      {row.tglPenyaluran}
                    </td>

                    {/* 11. NOMINAL PELUNASAN */}
                    <td style={{ padding: "8px 10px", border: "1px solid #CBD5E1", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#15803D" }}>
                      {fmt(row.nominalPelunasan)}
                    </td>

                    {/* 12. TGL. PELUNASAN */}
                    <td style={{ padding: "8px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontSize: 11.5 }}>
                      {row.tglPelunasan}
                    </td>

                    {/* 13. PIUTANG PUM */}
                    <td
                      style={{
                        padding: "8px 10px",
                        border: "1px solid #CBD5E1",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        color: isLunas ? COLORS.green : "#B91C1C",
                        background: isLunas ? "#F0FDF4" : "#FEF2F2",
                      }}
                    >
                      {isLunas ? "Rp 0 (Lunas)" : fmt(sisaPiutang)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* BARIS TOTAL PERSIS SEPERTI GAMBAR (TOTAL spanning kolom 1-8, lalu kolom 9, 11, 13 terisi) */}
          <tfoot>
            <tr
              style={{
                background: "#0F172A",
                color: COLORS.white,
                fontWeight: 800,
                fontSize: 12.5,
              }}
            >
              {/* KOLOM 1 S.D. 8 DIGABUNG DENGAN LABEL 'TOTAL' */}
              <td
                colSpan={8}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #334155",
                  textAlign: "center",
                  letterSpacing: 1.5,
                  fontSize: 13,
                }}
              >
                TOTAL
              </td>

              {/* KOLOM 9: TOTAL NOMINAL PENYALURAN */}
              <td
                style={{
                  padding: "12px 10px",
                  border: "1px solid #334155",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#38BDF8",
                }}
              >
                {fmt(totalPenyaluran)}
              </td>

              {/* KOLOM 10: TGL PENYALURAN (KOSONG) */}
              <td style={{ border: "1px solid #334155" }} />

              {/* KOLOM 11: TOTAL NOMINAL PELUNASAN */}
              <td
                style={{
                  padding: "12px 10px",
                  border: "1px solid #334155",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#4ADE80",
                }}
              >
                {fmt(totalPelunasan)}
              </td>

              {/* KOLOM 12: TGL PELUNASAN (KOSONG) */}
              <td style={{ border: "1px solid #334155" }} />

              {/* KOLOM 13: TOTAL PIUTANG PUM */}
              <td
                style={{
                  padding: "12px 10px",
                  border: "1px solid #334155",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#FCA5A5",
                }}
              >
                {fmt(totalPiutangPUM)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 11.5, color: COLORS.gray500, display: "flex", justifyContent: "space-between" }}>
        <span>* Format tabel dan formula perhitungan <strong>13 = (11-9)</strong> mengacu pada Keputusan Direksi ASABRI terkait Monitoring PUM KPR.</span>
        <span>Klik baris mana saja untuk melihat rincian detail debitur & jadwal angsuran.</span>
      </div>
    </div>
  );
};
