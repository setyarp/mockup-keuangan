import { useState, useMemo } from "react";
import {
  Filter,
  Search,
  RotateCcw,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Shield,
  User,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  SlidersHorizontal,
  X,
  Eye,
  Download,
  Receipt,
  Info,
  CheckSquare,
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import {
  StatCard,
  Select,
  Badge,
  Btn,
  NoData,
  PreviewModal,
} from "../components/common";

export const ListSP = () => {
  // State: Apakah data sudah dieksekusi / ditampilkan
  const [hasSearched, setHasSearched] = useState(false);

  // State Toggle Section Filter Khusus
  const [filterKhususOpen, setFilterKhususOpen] = useState(false);

  // State Filter Utama
  const [searchQuery, setSearchQuery] = useState("");
  const [produk, setProduk] = useState("-- Silahkan Pilih Produk --");
  const [dariTanggal, setDariTanggal] = useState("");
  const [sampaiTanggal, setSampaiTanggal] = useState("");

  // State Filter Khusus & Lanjutan
  const [status, setStatus] = useState("Semua");
  const [unor, setUnor] = useState("-- Silahkan Pilih Unit Organisasi --");
  const [cabang, setCabang] = useState("-- Silahkan Pilih Cabang --");
  const [statusPersonil, setStatusPersonil] = useState("-- Silahkan Pilih Status Personil --");
  const [mitraBayar, setMitraBayar] = useState("Semua");
  const [manfaat, setManfaat] = useState("-- Silahkan Pilih Manfaat --");
  const [dariTanggalDPS, setDariTanggalDPS] = useState("");
  const [sampaiTanggalDPS, setSampaiTanggalDPS] = useState("");

  // Modals
  const [preview, setPreview] = useState(null);
  const [selectedSPDetail, setSelectedSPDetail] = useState(null);

  const fmt = (n) =>
    typeof n === "number" ? `Rp ${n.toLocaleString("id-ID")}` : n;

  // Options Dropdown
  const unorOptions = [
    "-- Silahkan Pilih Unit Organisasi --",
    "TNI AD",
    "TNI AL",
    "TNI AU",
    "POLRI",
    "MABES TNI",
    "KEMHAN",
  ];

  const cabangOptions = [
    "-- Silahkan Pilih Cabang --",
    "Kantor Pusat",
    "Kancab Utama Jakarta",
    "Kancab Medan",
    "Kancab Balikpapan",
    "Kancab Bengkulu",
    "Kancab Manado",
    "Kancab Palu",
    "Kancab Kendari",
    "Kancab Padang",
    "Kancab Banda Aceh",
  ];

  const statusPersonilOptions = [
    "-- Silahkan Pilih Status Personil --",
    "Prajurit",
    "PNS",
    "PPPK",
  ];

  const produkOptions = [
    "-- Silahkan Pilih Produk --",
    "Jaminan Kecelakaan Kerja",
    "Jaminan Kematian",
    "Tabungan Hari Tua",
    "Jaminan Pensiun",
    "Nilai Tunai Iuran Pensiun",
  ];

  const statusDropdownOptions = [
    "Semua",
    "Sudah Bayar",
    "Belum Bayar",
    "Batal",
  ];

  const mitraOptions = [
    "Semua",
    "PT Bank Mandiri (Persero)",
    "PT Bank Rakyat Indonesia (BRI)",
    "PT Bank Negara Indonesia (BNI)",
    "PT Bank Tabungan Negara (BTN)",
    "PT Bank Syariah Indonesia (BSI)",
    "PT Pos Indonesia",
  ];

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
    "UKP-PK - UKP (Uang Kekurangan Pensiun - Pembayaran Kembali)",
  ];

  // Master Data SP with Complete Deductions Breakdown
  const rawMasterData = [
    {
      kpa: "KPA-001",
      nrp: "198701234",
      nama: "Purn. Kol. Ahmad Rifai",
      statusPersonil: "Prajurit",
      unor: "TNI AD",
      cabangAsabri: "Kancab Utama Jakarta",
      produk: "Jaminan Kecelakaan Kerja",
      noSP: "SP/JKK/2026/07/001",
      kodeBayar: "KB-99999-01",
      tglSP: "2026-07-05",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KCP Matraman",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Ahmad Rifai",
      nomorRekening: "026101000123",
      jumlahHak: 45000000,
      potonganBUM: 1200000,
      potonganPUM: 800000,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "DPS-2026-0812",
      tglBayar: "2026-07-10",
      status: "Sudah Bayar",
      manfaat: "99999 - Reimboursment Perawatan",
    },
    {
      kpa: "KPA-002",
      nrp: "199205678",
      nama: "Purn. Lettu Budi Kartono",
      statusPersonil: "Prajurit",
      unor: "MABES TNI",
      cabangAsabri: "Kantor Pusat",
      produk: "Nilai Tunai Iuran Pensiun",
      noSP: "SP/NTIP/2026/07/001",
      kodeBayar: "KB-NTIP-02",
      tglSP: "2026-07-16",
      mitraBayar: "PT Bank Mandiri (Persero)",
      cabangMitra: "KC Thamrin",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Budi Kartono",
      nomorRekening: "137009876543",
      jumlahHak: 8300000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 250000,
      potonganPajak: 0,
      potonganTDS: 150000,
      potonganTelahBayar: 0,
      noDPS: "—",
      tglBayar: "—",
      status: "Belum Bayar",
      manfaat: "NTIP - NTIP",
    },
    {
      kpa: "KPA-003",
      nrp: "199012345",
      nama: "Purn. AKP Citra Dewi",
      statusPersonil: "Prajurit",
      unor: "POLRI",
      cabangAsabri: "Kancab Balikpapan",
      produk: "Tabungan Hari Tua",
      noSP: "SP/THT/2026/07/004",
      kodeBayar: "KB-SBP-03",
      tglSP: "2026-07-12",
      mitraBayar: "PT Bank Mandiri (Persero)",
      cabangMitra: "KC Sudirman",
      saranaBayar: "CMS Mandiri",
      namaRekening: "Citra Dewi",
      nomorRekening: "137001234567",
      jumlahHak: 15000000,
      potonganBUM: 500000,
      potonganPUM: 300000,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "DPS-2026-0818",
      tglBayar: "2026-07-15",
      status: "Sudah Bayar",
      manfaat: "SBP - Santunan Biaya Pemakaman PP 67 (pra PP 102)",
    },
    {
      kpa: "KPA-004",
      nrp: "197506789",
      nama: "Purn. Pengatur Agus Salim",
      statusPersonil: "PNS",
      unor: "KEMHAN",
      cabangAsabri: "Kancab Medan",
      produk: "Jaminan Pensiun",
      noSP: "SP/JP/2026/07/009",
      kodeBayar: "KB-UKP-04",
      tglSP: "2026-07-18",
      mitraBayar: "PT Bank Tabungan Negara (BTN)",
      cabangMitra: "KC Medan",
      saranaBayar: "CMS BTN",
      namaRekening: "Agus Salim",
      nomorRekening: "001230156789",
      jumlahHak: 6200000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 0,
      potonganPajak: 310000,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "DPS-2026-0820",
      tglBayar: "2026-07-22",
      status: "Sudah Bayar",
      manfaat: "999 - UKP",
    },
    {
      kpa: "KPA-005",
      nrp: "198604321",
      nama: "Purn. Bripka Anwar Ibrahim",
      statusPersonil: "Prajurit",
      unor: "POLRI",
      cabangAsabri: "Kancab Bengkulu",
      produk: "Jaminan Kecelakaan Kerja",
      noSP: "SP/JKK/2026/07/012",
      kodeBayar: "KB-SCDK-05",
      tglSP: "2026-07-20",
      mitraBayar: "PT Bank Negara Indonesia (BNI)",
      cabangMitra: "KC Bengkulu",
      saranaBayar: "CMS BNI",
      namaRekening: "Anwar Ibrahim",
      nomorRekening: "0112233445",
      jumlahHak: 85000000,
      potonganBUM: 2500000,
      potonganPUM: 1500000,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 1000000,
      noDPS: "—",
      tglBayar: "—",
      status: "Belum Bayar",
      manfaat: "JKK SCDK - Santunan Cacat Dinas Khusus",
    },
    {
      kpa: "KPA-006",
      nrp: "199401234",
      nama: "Danu Prasetyo, S.AP.",
      statusPersonil: "PPPK",
      unor: "KEMHAN",
      cabangAsabri: "Kancab Manado",
      produk: "Jaminan Pensiun",
      noSP: "SP/IDP/2026/07/015",
      kodeBayar: "KB-IDP-06",
      tglSP: "2026-07-22",
      mitraBayar: "PT Pos Indonesia",
      cabangMitra: "KPU Manado",
      saranaBayar: "Giropos",
      namaRekening: "Danu Prasetyo",
      nomorRekening: "900123456",
      jumlahHak: 4800000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 0,
      potonganPajak: 120000,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "—",
      tglBayar: "—",
      status: "Belum Bayar",
      manfaat: "IDP - Iuran Dana Pensiun PP 67 (Pra PP No. 102)",
    },
    {
      kpa: "KPA-007",
      nrp: "197604567",
      nama: "Purn. Mayor Laut Surya Darma",
      statusPersonil: "Prajurit",
      unor: "TNI AL",
      cabangAsabri: "Kancab Palu",
      produk: "Jaminan Kematian",
      noSP: "SP/JKM/2026/07/018",
      kodeBayar: "KB-JKM-07",
      tglSP: "2026-07-24",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KC Palu",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Surya Darma",
      nomorRekening: "026101987654",
      jumlahHak: 42000000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "DPS-2026-0830",
      tglBayar: "2026-07-25",
      status: "Sudah Bayar",
      manfaat: "JKM SRK BP - Santunan Resiko Kematian - Biaya Pemakaman",
    },
    {
      kpa: "KPA-008",
      nrp: "1983082901",
      nama: "Purn. Letkol Sus Hendro Sasongko",
      statusPersonil: "Prajurit",
      unor: "TNI AU",
      cabangAsabri: "Kancab Kendari",
      produk: "Tabungan Hari Tua",
      noSP: "SP/THT/2026/07/021",
      kodeBayar: "KB-THT-08",
      tglSP: "2026-07-26",
      mitraBayar: "PT Bank Mandiri (Persero)",
      cabangMitra: "KC Kendari",
      saranaBayar: "CMS Mandiri",
      namaRekening: "Hendro Sasongko",
      nomorRekening: "142008877665",
      jumlahHak: 28750000,
      potonganBUM: 1000000,
      potonganPUM: 500000,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "DPS-2026-0835",
      tglBayar: "2026-07-28",
      status: "Sudah Bayar",
      manfaat: "THT TA - Tabungan Asuransi",
    },
    {
      kpa: "KPA-009",
      nrp: "1991041503",
      nama: "Sri Mulyani, S.E.",
      statusPersonil: "PNS",
      unor: "MABES TNI",
      cabangAsabri: "Kancab Padang",
      produk: "Nilai Tunai Iuran Pensiun",
      noSP: "SP/NTIP/2026/07/025",
      kodeBayar: "KB-NTIP-09",
      tglSP: "2026-07-28",
      mitraBayar: "PT Bank Negara Indonesia (BNI)",
      cabangMitra: "KC Padang",
      saranaBayar: "CMS BNI",
      namaRekening: "Sri Mulyani",
      nomorRekening: "0345678912",
      jumlahHak: 54300000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 300000,
      potonganTelahBayar: 0,
      noDPS: "—",
      tglBayar: "—",
      status: "Belum Bayar",
      manfaat: "NTIP - NTIP",
    },
    {
      kpa: "KPA-010",
      nrp: "1988091204",
      nama: "Taufik Hidayat, S.Sos.",
      statusPersonil: "PPPK",
      unor: "TNI AD",
      cabangAsabri: "Kancab Banda Aceh",
      produk: "Jaminan Kecelakaan Kerja",
      noSP: "SP/JKK/2026/07/029",
      kodeBayar: "KB-JKK-10",
      tglSP: "2026-07-29",
      mitraBayar: "PT Bank Syariah Indonesia (BSI)",
      cabangMitra: "KC Banda Aceh",
      saranaBayar: "CMS BSI",
      namaRekening: "Taufik Hidayat",
      nomorRekening: "7123456789",
      jumlahHak: 19800000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "—",
      tglBayar: "—",
      status: "Batal",
      manfaat: "JKK PERAWATAN - Perawatan",
    },
    {
      kpa: "KPA-011",
      nrp: "1985021908",
      nama: "Mayor Adm. Wahyu Pratama",
      statusPersonil: "Prajurit",
      unor: "TNI AU",
      cabangAsabri: "Kancab Utama Jakarta",
      produk: "Jaminan Kematian",
      noSP: "SP/JKM/2026/07/032",
      kodeBayar: "KB-JKM-11",
      tglSP: "2026-07-30",
      mitraBayar: "PT Bank Rakyat Indonesia (BRI)",
      cabangMitra: "KC Rawamangun",
      saranaBayar: "Overbooking CMS",
      namaRekening: "Wahyu Pratama",
      nomorRekening: "026101445566",
      jumlahHak: 50000000,
      potonganBUM: 1500000,
      potonganPUM: 1000000,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "DPS-2026-0850",
      tglBayar: "2026-07-31",
      status: "Sudah Bayar",
      manfaat: "JKM SRK SKS PA - Santunan Resiko Kematian - Santunan Kematian Sekaligus untuk perwira",
    },
    {
      kpa: "KPA-012",
      nrp: "1993071106",
      nama: "Aipda Rian Saputra",
      statusPersonil: "Prajurit",
      unor: "POLRI",
      cabangAsabri: "Kancab Medan",
      produk: "Tabungan Hari Tua",
      noSP: "SP/THT/2026/07/035",
      kodeBayar: "KB-THT-12",
      tglSP: "2026-07-31",
      mitraBayar: "PT Bank Mandiri (Persero)",
      cabangMitra: "KC Medan Balai Kota",
      saranaBayar: "CMS Mandiri",
      namaRekening: "Rian Saputra",
      nomorRekening: "106001928374",
      jumlahHak: 22400000,
      potonganBUM: 0,
      potonganPUM: 0,
      potonganAlihStatus: 0,
      potonganPajak: 0,
      potonganTDS: 0,
      potonganTelahBayar: 0,
      noDPS: "—",
      tglBayar: "—",
      status: "Batal",
      manfaat: "THT NTTA - Nilai Tunai Tabungan Asuransi",
    },
  ];

  // Processed master data with calculated totalPotongan & jumlahDiterima
  const spMasterData = useMemo(() => {
    return rawMasterData.map((d) => {
      const totalPotongan =
        (d.potonganBUM || 0) +
        (d.potonganPUM || 0) +
        (d.potonganAlihStatus || 0) +
        (d.potonganPajak || 0) +
        (d.potonganTDS || 0) +
        (d.potonganTelahBayar || 0);
      const jumlahDiterima = d.jumlahHak - totalPotongan;
      return {
        ...d,
        totalPotongan,
        jumlahDiterima,
      };
    });
  }, [rawMasterData]);

  // Filtering Logic
  const filtered = useMemo(() => {
    return spMasterData.filter((d) => {
      if (status !== "Semua" && d.status !== status) return false;
      if (produk !== "-- Silahkan Pilih Produk --" && d.produk !== produk)
        return false;
      if (cabang !== "-- Silahkan Pilih Cabang --" && d.cabangAsabri !== cabang)
        return false;
      if (unor !== "-- Silahkan Pilih Unit Organisasi --" && d.unor !== unor)
        return false;
      if (
        statusPersonil !== "-- Silahkan Pilih Status Personil --" &&
        d.statusPersonil !== statusPersonil
      )
        return false;
      if (manfaat !== "-- Silahkan Pilih Manfaat --" && d.manfaat !== manfaat)
        return false;
      if (
        mitraBayar !== "Semua" &&
        !d.mitraBayar.toLowerCase().includes(mitraBayar.toLowerCase())
      )
        return false;

      if (dariTanggal && d.tglSP < dariTanggal) return false;
      if (sampaiTanggal && d.tglSP > sampaiTanggal) return false;
      if (dariTanggalDPS && (d.noDPS === "—" || d.tglBayar < dariTanggalDPS))
        return false;
      if (sampaiTanggalDPS && (d.noDPS === "—" || d.tglBayar > sampaiTanggalDPS))
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNama = d.nama.toLowerCase().includes(q);
        const matchNrp = d.nrp.toLowerCase().includes(q);
        const matchKpa = d.kpa.toLowerCase().includes(q);
        const matchNoSP = d.noSP.toLowerCase().includes(q);
        const matchKodeBayar = d.kodeBayar.toLowerCase().includes(q);
        const matchRekening = d.nomorRekening.toLowerCase().includes(q);
        if (
          !matchNama &&
          !matchNrp &&
          !matchKpa &&
          !matchNoSP &&
          !matchKodeBayar &&
          !matchRekening
        )
          return false;
      }

      return true;
    });
  }, [
    spMasterData,
    status,
    produk,
    cabang,
    unor,
    statusPersonil,
    manfaat,
    mitraBayar,
    dariTanggal,
    sampaiTanggal,
    dariTanggalDPS,
    sampaiTanggalDPS,
    searchQuery,
  ]);

  // Check Active Filters
  const activeFilterList = useMemo(() => {
    const list = [];
    if (searchQuery.trim())
      list.push({ key: "search", label: `Cari: "${searchQuery}"`, clear: () => setSearchQuery("") });
    if (produk !== "-- Silahkan Pilih Produk --")
      list.push({ key: "produk", label: `Produk: ${produk}`, clear: () => setProduk("-- Silahkan Pilih Produk --") });
    if (dariTanggal || sampaiTanggal)
      list.push({ key: "tglSP", label: `Tgl SP: ${dariTanggal || "..."} s/d ${sampaiTanggal || "..."}`, clear: () => { setDariTanggal(""); setSampaiTanggal(""); } });
    if (status !== "Semua")
      list.push({ key: "status", label: `Status: ${status}`, clear: () => setStatus("Semua") });
    if (unor !== "-- Silahkan Pilih Unit Organisasi --")
      list.push({ key: "unor", label: `Unor: ${unor}`, clear: () => setUnor("-- Silahkan Pilih Unit Organisasi --") });
    if (cabang !== "-- Silahkan Pilih Cabang --")
      list.push({ key: "cabang", label: `Cabang: ${cabang}`, clear: () => setCabang("-- Silahkan Pilih Cabang --") });
    if (statusPersonil !== "-- Silahkan Pilih Status Personil --")
      list.push({ key: "statusPersonil", label: `Personil: ${statusPersonil}`, clear: () => setStatusPersonil("-- Silahkan Pilih Status Personil --") });
    if (mitraBayar !== "Semua")
      list.push({ key: "mitra", label: `Mitra: ${mitraBayar.split(" ")[0]}`, clear: () => setMitraBayar("Semua") });
    if (manfaat !== "-- Silahkan Pilih Manfaat --")
      list.push({ key: "manfaat", label: `Manfaat: ${manfaat.split(" - ")[0]}`, clear: () => setManfaat("-- Silahkan Pilih Manfaat --") });
    if (dariTanggalDPS || sampaiTanggalDPS)
      list.push({ key: "tglDPS", label: `Tgl DPS: ${dariTanggalDPS || "..."} s/d ${sampaiTanggalDPS || "..."}`, clear: () => { setDariTanggalDPS(""); setSampaiTanggalDPS(""); } });
    return list;
  }, [
    searchQuery,
    produk,
    dariTanggal,
    sampaiTanggal,
    status,
    unor,
    cabang,
    statusPersonil,
    mitraBayar,
    manfaat,
    dariTanggalDPS,
    sampaiTanggalDPS,
  ]);

  const handleApplyFilter = () => {
    setHasSearched(true);
  };

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setProduk("-- Silahkan Pilih Produk --");
    setDariTanggal("");
    setSampaiTanggal("");
    setStatus("Semua");
    setUnor("-- Silahkan Pilih Unit Organisasi --");
    setCabang("-- Silahkan Pilih Cabang --");
    setStatusPersonil("-- Silahkan Pilih Status Personil --");
    setMitraBayar("Semua");
    setManfaat("-- Silahkan Pilih Manfaat --");
    setDariTanggalDPS("");
    setSampaiTanggalDPS("");
    setHasSearched(false);
  };

  const columnsList = [
    "No.",
    "No. Surat Perintah",
    "NRP/NIP",
    "Nama Peserta",
    "Status Personil",
    "Unor",
    "Kantor Cabang",
    "Produk Manfaat",
    "Jumlah Hak",
    "Total Potongan",
    "Jumlah Diterima",
    "Mitra Bayar",
    "Status",
    "Aksi",
  ];

  const getProdukBadgeColor = (prod) => {
    switch (prod) {
      case "Jaminan Kecelakaan Kerja": return "orange";
      case "Jaminan Kematian": return "red";
      case "Tabungan Hari Tua": return "green";
      case "Jaminan Pensiun": return "blue";
      case "Nilai Tunai Iuran Pensiun": return "purple";
      default: return "gray";
    }
  };

  const getStatusPersonilBadgeColor = (sp) => {
    switch (sp) {
      case "Prajurit": return "green";
      case "PNS": return "blue";
      case "PPPK": return "yellow";
      default: return "gray";
    }
  };

  const getStatusBadgeColor = (s) => {
    switch (s) {
      case "Sudah Bayar": return "green";
      case "Belum Bayar": return "orange";
      case "Batal": return "red";
      default: return "gray";
    }
  };

  const getUnorBadgeStyle = (u) => {
    switch (u) {
      case "TNI AD": return { bg: "#E8F5E9", text: "#2E7D32", border: "#C8E6C9" };
      case "TNI AL": return { bg: "#E1F5FE", text: "#0277BD", border: "#B3E5FC" };
      case "TNI AU": return { bg: "#E0F7FA", text: "#00838F", border: "#B2EBF2" };
      case "POLRI": return { bg: "#EDE7F6", text: "#512DA8", border: "#D1C4E9" };
      case "MABES TNI": return { bg: "#FFF3E0", text: "#E65100", border: "#FFE0B2" };
      case "KEMHAN": return { bg: "#F3E5F5", text: "#7B1FA2", border: "#E1BEE7" };
      default: return { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" };
    }
  };

  // Count active filters in the specialized section to show badge
  const specializedFilterCount = [
    status !== "Semua",
    unor !== "-- Silahkan Pilih Unit Organisasi --",
    cabang !== "-- Silahkan Pilih Cabang --",
    statusPersonil !== "-- Silahkan Pilih Status Personil --",
    mitraBayar !== "Semua",
    manfaat !== "-- Silahkan Pilih Manfaat --",
    Boolean(dariTanggalDPS || sampaiTanggalDPS),
  ].filter(Boolean).length;

  return (
    <div>
      {/* PREVIEW EXPORT MODAL */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* DEDICATED DETAIL MODAL: HAK & POTONGAN */}
      {selectedSPDetail && (
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
          onClick={() => setSelectedSPDetail(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 780,
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
                    Rincian Pembayaran Surat Perintah (SP)
                  </span>
                  <Badge color={getStatusBadgeColor(selectedSPDetail.status)}>
                    {selectedSPDetail.status}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                  No. SP: <strong style={{ color: "#E2E8F0" }}>{selectedSPDetail.noSP}</strong> • Tgl SP: {selectedSPDetail.tglSP}
                </div>
              </div>
              <button
                onClick={() => setSelectedSPDetail(null)}
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
              {/* TOP FINANCIAL 3-METRIC SUMMARY CARDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1.2fr",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {/* 1. Jumlah Hak */}
                <div
                  style={{
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 11.5, color: "#0369A1", fontWeight: 700, textTransform: "uppercase" }}>
                    Jumlah Hak (Bruto)
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
                    {fmt(selectedSPDetail.jumlahHak)}
                  </div>
                  <div style={{ fontSize: 11, color: "#0284C7", marginTop: 2 }}>
                    Hak penuh peserta
                  </div>
                </div>

                {/* 2. Total Potongan */}
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 11.5, color: "#B91C1C", fontWeight: 700, textTransform: "uppercase" }}>
                    Total Potongan
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#991B1B",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    - {fmt(selectedSPDetail.totalPotongan)}
                  </div>
                  <div style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                    Akumulasi 6 komponen
                  </div>
                </div>

                {/* 3. Jumlah Diterima */}
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1.5px solid #86EFAC",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 11.5, color: "#15803D", fontWeight: 700, textTransform: "uppercase" }}>
                    Jumlah Diterima (Netto)
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#14532D",
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {fmt(selectedSPDetail.jumlahDiterima)}
                  </div>
                  <div style={{ fontSize: 11, color: "#16A34A", marginTop: 2 }}>
                    Ditransfer ke rekening penerima
                  </div>
                </div>
              </div>

              {/* TWO COLUMN DETAILS: RINCIAN POTONGAN vs KEPESERTAAN & REKENING */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 1fr",
                  gap: 18,
                }}
              >
                {/* COLUMN 1: RINCIAN POTONGAN */}
                <div
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    overflow: "hidden",
                    background: COLORS.white,
                  }}
                >
                  <div
                    style={{
                      background: "#F8FAFC",
                      padding: "10px 14px",
                      borderBottom: "1px solid #E2E8F0",
                      fontWeight: 700,
                      fontSize: 12.5,
                      color: COLORS.gray800,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Receipt size={14} color={COLORS.blue} /> Rincian Potongan SP
                  </div>
                  <div style={{ padding: "8px 14px", fontSize: 12.5 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 0", color: COLORS.gray700 }}>1. Potongan BUM KPR</td>
                          <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: selectedSPDetail.potonganBUM > 0 ? COLORS.red : COLORS.gray500 }}>
                            {fmt(selectedSPDetail.potonganBUM || 0)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 0", color: COLORS.gray700 }}>2. Potongan PUM KPR</td>
                          <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: selectedSPDetail.potonganPUM > 0 ? COLORS.red : COLORS.gray500 }}>
                            {fmt(selectedSPDetail.potonganPUM || 0)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 0", color: COLORS.gray700 }}>3. Potongan Alih Status</td>
                          <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: selectedSPDetail.potonganAlihStatus > 0 ? COLORS.red : COLORS.gray500 }}>
                            {fmt(selectedSPDetail.potonganAlihStatus || 0)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 0", color: COLORS.gray700 }}>4. Potongan Pajak (PPh 21)</td>
                          <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: selectedSPDetail.potonganPajak > 0 ? COLORS.red : COLORS.gray500 }}>
                            {fmt(selectedSPDetail.potonganPajak || 0)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 0", color: COLORS.gray700 }}>5. Potongan TDS</td>
                          <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: selectedSPDetail.potonganTDS > 0 ? COLORS.red : COLORS.gray500 }}>
                            {fmt(selectedSPDetail.potonganTDS || 0)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 0", color: COLORS.gray700 }}>6. Potongan Telah Bayar</td>
                          <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: selectedSPDetail.potonganTelahBayar > 0 ? COLORS.red : COLORS.gray500 }}>
                            {fmt(selectedSPDetail.potonganTelahBayar || 0)}
                          </td>
                        </tr>
                        <tr style={{ background: "#FEF2F2", fontWeight: 800 }}>
                          <td style={{ padding: "10px 4px", color: "#991B1B" }}>Total Potongan</td>
                          <td style={{ padding: "10px 4px", textAlign: "right", fontFamily: "monospace", color: "#991B1B", fontSize: 13 }}>
                            {fmt(selectedSPDetail.totalPotongan)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* COLUMN 2: KEPESERTAAN & REKENING PENERIMA */}
                <div
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    overflow: "hidden",
                    background: COLORS.white,
                  }}
                >
                  <div
                    style={{
                      background: "#F8FAFC",
                      padding: "10px 14px",
                      borderBottom: "1px solid #E2E8F0",
                      fontWeight: 700,
                      fontSize: 12.5,
                      color: COLORS.gray800,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <User size={14} color={COLORS.blue} /> Data Peserta & Rekening
                  </div>
                  <div style={{ padding: "12px 14px", fontSize: 12 }}>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ color: COLORS.gray500, fontSize: 11 }}>Nama Peserta</div>
                      <div style={{ fontWeight: 700, color: COLORS.gray900 }}>{selectedSPDetail.nama}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ color: COLORS.gray500, fontSize: 11 }}>NRP / NIP</div>
                        <div style={{ fontFamily: "monospace", fontWeight: 600, color: COLORS.blue }}>{selectedSPDetail.nrp}</div>
                      </div>
                      <div>
                        <div style={{ color: COLORS.gray500, fontSize: 11 }}>Status Personil</div>
                        <div style={{ fontWeight: 600 }}>{selectedSPDetail.statusPersonil}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ color: COLORS.gray500, fontSize: 11 }}>Unit Organisasi</div>
                        <div style={{ fontWeight: 600 }}>{selectedSPDetail.unor}</div>
                      </div>
                      <div>
                        <div style={{ color: COLORS.gray500, fontSize: 11 }}>Kantor Cabang</div>
                        <div style={{ fontWeight: 600 }}>{selectedSPDetail.cabangAsabri}</div>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 8, marginTop: 8 }}>
                      <div style={{ color: COLORS.gray500, fontSize: 11 }}>Mitra Bayar & Rekening</div>
                      <div style={{ fontWeight: 700, color: COLORS.gray900 }}>{selectedSPDetail.mitraBayar}</div>
                      <div style={{ fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 700, fontSize: 12.5, marginTop: 2 }}>
                        {selectedSPDetail.nomorRekening} <span style={{ color: COLORS.gray600, fontWeight: 400 }}>(a.n {selectedSPDetail.namaRekening})</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                      <div>
                        <div style={{ color: COLORS.gray500, fontSize: 11 }}>Sarana Bayar</div>
                        <div style={{ fontWeight: 600 }}>{selectedSPDetail.saranaBayar}</div>
                      </div>
                      <div>
                        <div style={{ color: COLORS.gray500, fontSize: 11 }}>No. DPS</div>
                        <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedSPDetail.noDPS}</div>
                      </div>
                    </div>
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
                Kode Bayar: <strong style={{ color: COLORS.gray800 }}>{selectedSPDetail.kodeBayar}</strong>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" onClick={() => setSelectedSPDetail(null)}>
                  Tutup
                </Btn>
                <Btn
                  onClick={() => {
                    alert(`Mengunduh dokumen Rincian Hak & Potongan SP: ${selectedSPDetail.noSP}`);
                  }}
                >
                  <Download size={14} /> Cetak Bukti SP (PDF)
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORPORATE SMART FILTER CARD */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 12,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {/* HEADER BAR: Title and Action Buttons */}
        <div
          style={{
            padding: "16px 20px",
            background: "#FAFBFD",
            borderBottom: `1px solid ${COLORS.gray200}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Left: Section Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#E3F2FD",
                color: COLORS.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Filter size={18} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900 }}>
              Filter
            </div>
          </div>

          {/* Right: Actions (Toggle Section Filter Khusus & Reset) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setFilterKhususOpen(!filterKhususOpen)}
              style={{
                border: `1px solid ${filterKhususOpen ? COLORS.blue : COLORS.gray300}`,
                background: filterKhususOpen ? "#EFF6FF" : COLORS.white,
                color: filterKhususOpen ? COLORS.blue : COLORS.gray700,
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <SlidersHorizontal size={13} />
              <span>{filterKhususOpen ? "Tutup Filter Khusus" : "Filter Khusus"}</span>
              {specializedFilterCount > 0 && !filterKhususOpen && (
                <span
                  style={{
                    background: COLORS.blue,
                    color: COLORS.white,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 10,
                  }}
                >
                  {specializedFilterCount}
                </span>
              )}
              {filterKhususOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {activeFilterList.length > 0 && (
              <button
                onClick={handleResetAllFilters}
                style={{
                  border: "none",
                  background: "transparent",
                  color: COLORS.red,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 10px",
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <RotateCcw size={12} /> Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY FILTER CONTROLS: HANYA Cari Data, Produk, dan Rentang Tanggal SP */}
        <div style={{ padding: "18px 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1.4fr 1.6fr",
              gap: 16,
              alignItems: "flex-end",
            }}
          >
            {/* 1. Search Input */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.gray700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 6,
                }}
              >
                <Search size={13} color={COLORS.blue} /> Cari Data SP / Peserta
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik No. SP, Nama, NRP, KTPA, Rekening..."
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 34px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12.5,
                    color: COLORS.gray800,
                    outline: "none",
                    boxSizing: "border-box",
                    background: COLORS.white,
                    transition: "border 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
                  onBlur={(e) => (e.target.style.borderColor = COLORS.gray300)}
                />
                <Search
                  size={15}
                  color={COLORS.gray400}
                  style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: COLORS.gray400,
                      cursor: "pointer",
                      padding: 2,
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Program Produk */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.gray700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 6,
                }}
              >
                <Layers size={13} color={COLORS.blue} /> Program Produk
              </label>
              <Select
                value={produk}
                onChange={setProduk}
                options={produkOptions}
                minW="100%"
              />
            </div>

            {/* 3. Rentang Tanggal SP */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.gray700,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 6,
                }}
              >
                <Calendar size={13} color={COLORS.blue} /> Rentang Tanggal SP
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="date"
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7.5px 9px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12,
                    background: COLORS.white,
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontSize: 11, color: COLORS.gray400 }}>s/d</span>
                <input
                  type="date"
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7.5px 9px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12,
                    background: COLORS.white,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION FILTER KHUSUS (Status Pembayaran, Unor, Kantor Cabang, Status Personil, dsb.) */}
          {filterKhususOpen && (
            <div
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: "1px dashed #CBD5E1",
                background: "#F8FAFC",
                margin: "18px -20px -18px -20px",
                padding: "18px 20px",
              }}
            >
              {/* Row 1 Filter Khusus: Status Pembayaran, Unor, Cabang, Status Personil */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.4fr 1.4fr 1.2fr",
                  gap: 14,
                  alignItems: "flex-end",
                }}
              >
                {/* 1. Status Pembayaran */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <CheckSquare size={13} color={COLORS.blue} /> Status Pembayaran
                  </label>
                  <Select
                    value={status}
                    onChange={setStatus}
                    options={statusDropdownOptions}
                    minW="100%"
                  />
                </div>

                {/* 2. Unit Organisasi (Unor) */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <Shield size={13} color={COLORS.blue} /> Unit Organisasi (Unor)
                  </label>
                  <Select
                    value={unor}
                    onChange={setUnor}
                    options={unorOptions}
                    minW="100%"
                  />
                </div>

                {/* 3. Kantor Cabang ASABRI */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <Building2 size={13} color={COLORS.blue} /> Kantor Cabang ASABRI
                  </label>
                  <Select
                    value={cabang}
                    onChange={setCabang}
                    options={cabangOptions}
                    minW="100%"
                  />
                </div>

                {/* 4. Status Personil */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <User size={13} color={COLORS.blue} /> Status Personil
                  </label>
                  <Select
                    value={statusPersonil}
                    onChange={setStatusPersonil}
                    options={statusPersonilOptions}
                    minW="100%"
                  />
                </div>
              </div>

              {/* Row 2 Filter Khusus: Mitra Bayar, Tanggal DPS, Rincian Manfaat */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1.5fr 2fr",
                  gap: 14,
                  alignItems: "flex-end",
                  marginTop: 14,
                }}
              >
                {/* Mitra Bayar */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <CreditCard size={13} color={COLORS.blue} /> Mitra Perbankan / Bayar
                  </label>
                  <Select
                    value={mitraBayar}
                    onChange={setMitraBayar}
                    options={mitraOptions}
                    minW="100%"
                  />
                </div>

                {/* Rentang Tanggal DPS */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <Calendar size={13} color={COLORS.blue} /> Rentang Tanggal DPS
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="date"
                      value={dariTanggalDPS}
                      onChange={(e) => setDariTanggalDPS(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "7.5px 9px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 12,
                        background: COLORS.white,
                        boxSizing: "border-box",
                      }}
                    />
                    <span style={{ fontSize: 11, color: COLORS.gray400 }}>s/d</span>
                    <input
                      type="date"
                      value={sampaiTanggalDPS}
                      onChange={(e) => setSampaiTanggalDPS(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "7.5px 9px",
                        borderRadius: 6,
                        border: `1px solid ${COLORS.gray300}`,
                        fontSize: 12,
                        background: COLORS.white,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Rincian Manfaat */}
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: COLORS.gray700,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 6,
                    }}
                  >
                    <FileText size={13} color={COLORS.blue} /> Rincian Jenis Manfaat (Kode Manfaat)
                  </label>
                  <Select
                    value={manfaat}
                    onChange={setManfaat}
                    options={manfaatOptions}
                    minW="100%"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE FILTER CHIPS */}
          {activeFilterList.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 16,
                paddingTop: 12,
                borderTop: `1px solid ${COLORS.gray200}`,
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: COLORS.gray500,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Filter Aktif ({activeFilterList.length}):
              </span>
              {activeFilterList.map((af) => (
                <span
                  key={af.key}
                  style={{
                    background: "#EFF6FF",
                    color: COLORS.blueDark,
                    border: `1px solid #BFDBFE`,
                    borderRadius: 16,
                    padding: "3px 10px",
                    fontSize: 11.5,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {af.label}
                  <button
                    onClick={af.clear}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: COLORS.blue,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={handleResetAllFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.red,
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: "2px 6px",
                }}
              >
                Hapus Semua
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION & SUMMARY BAR */}
        <div
          style={{
            padding: "14px 20px",
            background: "#FAFBFD",
            borderTop: `1px solid ${COLORS.gray200}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12.5, color: COLORS.gray600, display: "flex", alignItems: "center", gap: 6 }}>
            {hasSearched && (
              <>
                <Info size={15} color={COLORS.blue} />
                <span>
                  Menampilkan <strong style={{ color: COLORS.gray900 }}>{filtered.length}</strong> dari{" "}
                  <strong style={{ color: COLORS.gray900 }}>{spMasterData.length}</strong> berkas SP • Total Hak:{" "}
                  <strong style={{ color: COLORS.blueDark, fontWeight: 700 }}>
                    {fmt(filtered.reduce((sum, d) => sum + d.jumlahHak, 0))}
                  </strong>{" "}
                  • Total Cair:{" "}
                  <strong style={{ color: COLORS.green, fontWeight: 700 }}>
                    {fmt(filtered.reduce((sum, d) => sum + d.jumlahDiterima, 0))}
                  </strong>
                </span>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Btn
              onClick={handleApplyFilter}
              style={{
                background: "#00A97F",
                fontSize: 13,
                padding: "8px 20px",
                boxShadow: "0 2px 6px rgba(0, 169, 127, 0.25)",
              }}
            >
              <Search size={14} /> Tampilkan Data SP
            </Btn>

            {hasSearched && (
              <Btn
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreview({
                    title: "Laporan Daftar Surat Perintah (List SP) Pembayaran Manfaat",
                    subtitle: `Kriteria Status: ${status} • Total ${filtered.length} Dokumen SP`,
                    type: "table",
                    fileName: `List_SP_Manfaat_${new Date().toISOString().slice(0, 10)}.xlsx`,
                    content: {
                      columns: [
                        "No.",
                        "No. Surat Perintah",
                        "NRP/NIP",
                        "Nama Peserta",
                        "Status Personil",
                        "Unor",
                        "Kantor Cabang",
                        "Produk",
                        "Jumlah Hak",
                        "Total Potongan",
                        "Jumlah Diterima",
                        "Mitra Bayar",
                        "Status",
                      ],
                      rows: filtered.map((d, idx) => [
                        idx + 1,
                        d.noSP,
                        d.nrp,
                        d.nama,
                        d.statusPersonil,
                        d.unor,
                        d.cabangAsabri,
                        d.produk,
                        fmt(d.jumlahHak),
                        fmt(d.totalPotongan),
                        fmt(d.jumlahDiterima),
                        d.mitraBayar,
                        d.status,
                      ]),
                      totalRows: filtered.length,
                    },
                  })
                }
                style={{ fontSize: 12.5 }}
              >
                <FileSpreadsheet size={14} /> Export Akun (.xlsx)
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT AREA: INITIAL STATE vs TABLE & STAT CARDS */}
      {!hasSearched ? (
        <div
          style={{
            background: COLORS.white,
            borderRadius: 12,
            border: `1px dashed #CBD5E1`,
            padding: "48px 24px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#F0FDF4",
              color: "#00A97F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Search size={28} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.gray800, marginBottom: 6 }}>
            Silakan Tentukan Parameter Filter
          </div>
          <div
            style={{
              fontSize: 13,
              color: COLORS.gray500,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Pilih parameter pencarian seperti <strong>Cari Data</strong>, <strong>Program Produk</strong>, atau{" "}
            <strong>Rentang Tanggal SP</strong> untuk memuat data.
          </div>
        </div>
      ) : (
        <>
          {/* EXECUTIVE OVERVIEW STAT CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <StatCard
              icon={<FileText size={IC} />}
              label="Total SP Sesuai Filter"
              value={filtered.length.toString()}
              sub={`Total Hak: Rp ${(
                filtered.reduce((sum, d) => sum + d.jumlahHak, 0) / 1000000
              ).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Juta`}
              color={COLORS.blue}
            />
            <StatCard
              icon={<CheckCircle2 size={IC} />}
              label="Sudah Dibayar (Cair)"
              value={filtered.filter((d) => d.status === "Sudah Bayar").length.toString()}
              sub={`Netto Cair: Rp ${(
                filtered
                  .filter((d) => d.status === "Sudah Bayar")
                  .reduce((sum, d) => sum + d.jumlahDiterima, 0) / 1000000
              ).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Juta`}
              color={COLORS.green}
            />
            <StatCard
              icon={<Clock size={IC} />}
              label="Belum Dibayar (Pending)"
              value={filtered.filter((d) => d.status === "Belum Bayar").length.toString()}
              sub={`Estimasi: Rp ${(
                filtered
                  .filter((d) => d.status === "Belum Bayar")
                  .reduce((sum, d) => sum + d.jumlahDiterima, 0) / 1000000
              ).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Juta`}
              color={COLORS.orange}
            />
            <StatCard
              icon={<XCircle size={IC} />}
              label="Dibatalkan (Batal)"
              value={filtered.filter((d) => d.status === "Batal").length.toString()}
              sub="Koreksi / Dibatalkan"
              color={COLORS.red}
            />
          </div>

          {/* DATA TABLE */}
          {filtered.length === 0 ? (
            <NoData text="Data Kosong — Tidak ada SP yang sesuai dengan kriteria filter yang dipilih." />
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 10,
                border: `1px solid #CBD5E1`,
                background: COLORS.white,
                boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                <thead>
                  <tr style={{ background: "#1E293B", color: COLORS.white }}>
                    {columnsList.map((c, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "11px 12px",
                          textAlign: i >= 8 && i <= 10 ? "right" : i === 0 || i === 13 ? "center" : "left",
                          fontWeight: 700,
                          color: COLORS.white,
                          borderBottom: `1px solid #334155`,
                          borderRight: i < columnsList.length - 1 ? "1px solid #334155" : "none",
                        }}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const unorStyle = getUnorBadgeStyle(d.unor);
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid #E2E8F0`,
                          background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                        }
                      >
                        {/* No. */}
                        <td
                          style={{
                            padding: "10px 10px",
                            textAlign: "center",
                            color: COLORS.gray500,
                            fontFamily: "monospace",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {i + 1}
                        </td>

                        {/* No Surat Perintah */}
                        <td
                          style={{
                            padding: "10px 12px",
                            fontFamily: "monospace",
                            color: COLORS.blueDark,
                            fontWeight: 700,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          <div>{d.noSP}</div>
                          <div style={{ fontSize: 10.5, color: COLORS.gray400, fontWeight: 400 }}>
                            {d.tglSP}
                          </div>
                        </td>

                        {/* NRP/NIP */}
                        <td
                          style={{
                            padding: "10px 12px",
                            fontFamily: "monospace",
                            color: COLORS.blue,
                            fontWeight: 600,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {d.nrp}
                        </td>

                        {/* Nama Peserta */}
                        <td
                          style={{
                            padding: "10px 12px",
                            fontWeight: 700,
                            color: "#0F172A",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {d.nama}
                        </td>

                        {/* Status Personil */}
                        <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={getStatusPersonilBadgeColor(d.statusPersonil)}>
                            {d.statusPersonil}
                          </Badge>
                        </td>

                        {/* Unor */}
                        <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>
                          <span
                            style={{
                              background: unorStyle.bg,
                              color: unorStyle.text,
                              border: `1px solid ${unorStyle.border}`,
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {d.unor}
                          </span>
                        </td>

                        {/* Kantor Cabang */}
                        <td
                          style={{
                            padding: "10px 12px",
                            borderRight: "1px solid #E2E8F0",
                            fontWeight: 500,
                            color: COLORS.gray700,
                          }}
                        >
                          {d.cabangAsabri}
                        </td>

                        {/* Produk Manfaat */}
                        <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={getProdukBadgeColor(d.produk)}>{d.produk}</Badge>
                        </td>

                        {/* Jumlah Hak */}
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 600,
                            color: COLORS.gray900,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(d.jumlahHak)}
                        </td>

                        {/* Total Potongan */}
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 600,
                            color: d.totalPotongan > 0 ? COLORS.red : COLORS.gray500,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {d.totalPotongan > 0 ? `- ${fmt(d.totalPotongan)}` : "Rp 0"}
                        </td>

                        {/* Jumlah Diterima */}
                        <td
                          style={{
                            padding: "10px 12px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: COLORS.green,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {fmt(d.jumlahDiterima)}
                        </td>

                        {/* Mitra Bayar */}
                        <td
                          style={{
                            padding: "10px 12px",
                            color: COLORS.gray700,
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {d.mitraBayar.split(" (")[0]}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={getStatusBadgeColor(d.status)}>{d.status}</Badge>
                        </td>

                        {/* Aksi */}
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <Btn
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSPDetail(d)}
                            style={{
                              padding: "4px 10px",
                              fontSize: 11.5,
                              gap: 4,
                            }}
                          >
                            <Eye size={12} /> Detail
                          </Btn>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
