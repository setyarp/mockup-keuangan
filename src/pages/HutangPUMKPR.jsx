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
  Shield,
  Tag,
  ArrowDownRight,
  Sparkles,
  PlusCircle,
  Receipt,
  Printer,
  Check,
  AlertTriangle,
  Wallet,
  Info,
  X,
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { StatCard, Badge, Btn, PreviewModal } from "../components/common";

export const HutangPUMKPR = () => {
  // Filter States: Nama, KPA, Status (Lunas / Belum Lunas), Program Asal, Tahun, Periode
  const [filterNama, setFilterNama] = useState("Semua");
  const [filterKPA, setFilterKPA] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua"); // "Semua" | "Lunas" | "Belum Lunas"
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterTahun, setFilterTahun] = useState("Semua");
  const [filterDariPeriode, setFilterDariPeriode] = useState("Semua");
  const [filterSampaiPeriode, setFilterSampaiPeriode] = useState("Semua");

  // Search query cepat, modal detail sumber pelunasan, modal input setoran pribadi, modal SKL
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedSKL, setSelectedSKL] = useState(null);
  const [setoranModalData, setSetoranModalData] = useState(null);
  const [preview, setPreview] = useState(null);

  // Form State untuk Input Setoran Pribadi
  const [inputNominalSetor, setInputNominalSetor] = useState("");
  const [inputTglSetor, setInputTglSetor] = useState(new Date().toISOString().split("T")[0]);
  const [inputNoBukti, setInputNoBukti] = useState("");
  const [inputBankPenampung, setInputBankPenampung] = useState("PT Bank Tabungan Negara (Persero) Tbk");
  const [inputMetode, setInputMetode] = useState("Transfer Bank / Virtual Account");
  const [inputCatatan, setInputCatatan] = useState("");

  const fmt = (n) =>
    typeof n === "number" ? `Rp ${n.toLocaleString("id-ID")}` : n;

  // Master Data Hutang PUM KPR Peserta ASABRI
  const [pumList, setPumList] = useState([
    {
      no: 1,
      nama: "Mayor Inf. Hendra Kusuma",
      nik: "3175081204850001",
      ktpa: "KPA-8829102",
      nrp: "1104018291",
      satker: "UNOR TNI AD (Kodam Jaya / Yonif 201)",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-002938-50-4",
      nominalPenyaluran: 40000000,
      tglPenyaluran: "15/03/2022",
      tahunPenyaluran: "2022",
      bulanPenyaluran: "Maret",
      // Sumber Pelunasan 1: Klaim THT
      nominalPelunasanKlaim: 25000000,
      tglSPKlaim: "15/06/2026",
      noSPKlaim: "SP-THT/2026/06-0142",
      programPelunasan: "THT",
      jenisKlaim: "Klaim Manfaat Habis Kontrak THT",
      // Sumber Pelunasan 2: Setoran Pribadi
      nominalSetoranPribadi: 15000000,
      tglSetoranPribadi: "18/06/2026",
      noBuktiSetoran: "SETOR-BTN/202606-9981",
      bankPenampungPribadi: "Bank BTN Cab. Cawang",
      metodeSetoran: "Transfer Virtual Account",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Perumahan Griya Asri Cibubur, Bogor",
      angsuranPerBulan: 500000,
      status: "Lunas",
      tipePelunasan: "Kombinasi (Klaim THT Rp 25 Jt + Setoran Mandiri Rp 15 Jt)",
    },
    {
      no: 2,
      nama: "Lettu Laut Dian Pratama",
      nik: "3273110906880002",
      ktpa: "KPA-9930192",
      nrp: "1109028371",
      satker: "UNOR TNI AL (Kormar / Brigif 1)",
      bankPeserta: "PT Bank Rakyat Indonesia (Persero) Tbk",
      noRekPeserta: "0261-01-009823-53-1",
      nominalPenyaluran: 35000000,
      tglPenyaluran: "10/05/2023",
      tahunPenyaluran: "2023",
      bulanPenyaluran: "Mei",
      // Sumber Pelunasan 1: Klaim JKK 100%
      nominalPelunasanKlaim: 35000000,
      tglSPKlaim: "20/05/2026",
      noSPKlaim: "SP-JKK/2026/05-0089",
      programPelunasan: "JKK",
      jenisKlaim: "Klaim Santunan Cacat Sebagian JKK",
      nominalSetoranPribadi: 0,
      tglSetoranPribadi: "-",
      noBuktiSetoran: "-",
      bankPenampungPribadi: "-",
      metodeSetoran: "-",
      tahunPelunasan: "2026",
      bulanPelunasan: "Mei",
      lokasiPerumahan: "Pondok Marinir Indah, Sidoarjo",
      angsuranPerBulan: 700000,
      status: "Lunas",
      tipePelunasan: "Klaim Penuh (Potongan SP JKK 100%)",
    },
    {
      no: 3,
      nama: "Aipda Bambang Triyono",
      nik: "3578012403910003",
      ktpa: "KPA-7721839",
      nrp: "85030291",
      satker: "UNOR POLRI (Polda Metro Jaya / Ditlantas)",
      bankPeserta: "PT Bank Mandiri (Persero) Tbk",
      noRekPeserta: "137-00-192837-1",
      nominalPenyaluran: 50000000,
      tglPenyaluran: "20/08/2021",
      tahunPenyaluran: "2021",
      bulanPenyaluran: "Agustus",
      // Klaim THT Rp 30 Jt, Pokok Rp 50 Jt -> Belum Lunas
      nominalPelunasanKlaim: 30000000,
      tglSPKlaim: "02/07/2026",
      noSPKlaim: "SP-THT/2026/07-0033",
      programPelunasan: "THT",
      jenisKlaim: "Klaim Nilai Tunai Asuransi THT",
      nominalSetoranPribadi: 0,
      tglSetoranPribadi: "-",
      noBuktiSetoran: "-",
      bankPenampungPribadi: "-",
      metodeSetoran: "-",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juli",
      lokasiPerumahan: "Cluster Bhayangkara Residence, Bekasi",
      angsuranPerBulan: 650000,
      status: "Belum Lunas",
      tipePelunasan: "Sebagian (Potongan SP THT Rp 30 Jt, Sisa Rp 20 Jt Belum Disetor)",
    },
    {
      no: 4,
      nama: "Peltu Agus Susanto",
      nik: "3374021708820004",
      ktpa: "KPA-6648291",
      nrp: "2102039182",
      satker: "UNOR TNI AU (Lanud Halim Perdanakusuma)",
      bankPeserta: "PT Bank Negara Indonesia (Persero) Tbk",
      noRekPeserta: "034-5678-912",
      nominalPenyaluran: 30000000,
      tglPenyaluran: "12/01/2024",
      tahunPenyaluran: "2024",
      bulanPenyaluran: "Januari",
      // Lunas Kombinasi: JKM Rp 12 Jt + Setoran Pribadi Rp 18 Jt
      nominalPelunasanKlaim: 12000000,
      tglSPKlaim: "12/06/2026",
      noSPKlaim: "SP-JKM/2026/06-0012",
      programPelunasan: "JKM",
      jenisKlaim: "Klaim Santunan Beasiswa / UDW JKM",
      nominalSetoranPribadi: 18000000,
      tglSetoranPribadi: "15/06/2026",
      noBuktiSetoran: "SETOR-BNI/202606-7712",
      bankPenampungPribadi: "Bank BNI Cab. Kramat Jati",
      metodeSetoran: "Setoran Tunai Kasir Cabang",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Bumi Dirgantara Indah, Bogor",
      angsuranPerBulan: 450000,
      status: "Lunas",
      tipePelunasan: "Kombinasi (Klaim JKM Rp 12 Jt + Setoran Kasir Rp 18 Jt)",
    },
    {
      no: 5,
      nama: "Serka Yudi Hermawan",
      nik: "3174092211890005",
      ktpa: "KPA-5539201",
      nrp: "3109048291",
      satker: "UNOR TNI AD (Pusbekkangad)",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-004455-50-9",
      nominalPenyaluran: 30000000,
      tglPenyaluran: "05/11/2022",
      tahunPenyaluran: "2022",
      bulanPenyaluran: "November",
      // Klaim THT Rp 18 Jt, Pokok Rp 30 Jt -> Belum Lunas
      nominalPelunasanKlaim: 18000000,
      tglSPKlaim: "05/06/2026",
      noSPKlaim: "SP-THT/2026/06-0201",
      programPelunasan: "THT",
      jenisKlaim: "Klaim Manfaat Dwiguna THT",
      nominalSetoranPribadi: 0,
      tglSetoranPribadi: "-",
      noBuktiSetoran: "-",
      bankPenampungPribadi: "-",
      metodeSetoran: "-",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Griya Kartika Cileungsi, Bogor",
      angsuranPerBulan: 500000,
      status: "Belum Lunas",
      tipePelunasan: "Sebagian (Potongan SP THT Rp 18 Jt, Sisa Rp 12 Jt Belum Disetor)",
    },
    {
      no: 6,
      nama: "Kapten Kav. Eko Prasetyo",
      nik: "3276051402860006",
      ktpa: "KPA-4428190",
      nrp: "1106029182",
      satker: "UNOR TNI AD (Kodam III / Siliwangi)",
      bankPeserta: "PT Bank Syariah Indonesia Tbk",
      noRekPeserta: "712-345-6789",
      nominalPenyaluran: 45000000,
      tglPenyaluran: "18/06/2023",
      tahunPenyaluran: "2023",
      bulanPenyaluran: "Juni",
      // Lunas Kombinasi: JKK Rp 20 Jt + Setoran Pribadi Rp 25 Jt
      nominalPelunasanKlaim: 20000000,
      tglSPKlaim: "18/05/2026",
      noSPKlaim: "SP-JKK/2026/05-0105",
      programPelunasan: "JKK",
      jenisKlaim: "Klaim Penggantian Biaya Perawatan JKK",
      nominalSetoranPribadi: 25000000,
      tglSetoranPribadi: "22/05/2026",
      noBuktiSetoran: "SETOR-BSI/202605-4431",
      bankPenampungPribadi: "Bank BSI Cab. Bandung Asia Afrika",
      metodeSetoran: "Transfer M-Banking",
      tahunPelunasan: "2026",
      bulanPelunasan: "Mei",
      lokasiPerumahan: "Grand Siliwangi Hills, Bandung Barat",
      angsuranPerBulan: 600000,
      status: "Lunas",
      tipePelunasan: "Kombinasi (Klaim JKK Rp 20 Jt + Setoran M-Banking Rp 25 Jt)",
    },
    {
      no: 7,
      nama: "PNS Supriyadi, S.Kom.",
      nik: "3171011507870007",
      ktpa: "KPA-3319082",
      nrp: "198707152011011001",
      satker: "UNOR Kemhan RI (Setjen Kemhan)",
      bankPeserta: "PT Bank Mandiri (Persero) Tbk",
      noRekPeserta: "106-00-192837-4",
      nominalPenyaluran: 35000000,
      tglPenyaluran: "08/04/2024",
      tahunPenyaluran: "2024",
      bulanPenyaluran: "April",
      // Klaim THT Rp 8 Jt, Pokok Rp 35 Jt -> Belum Lunas
      nominalPelunasanKlaim: 8000000,
      tglSPKlaim: "08/06/2026",
      noSPKlaim: "SP-THT/2026/06-0311",
      programPelunasan: "THT",
      jenisKlaim: "Klaim Asuransi Dwiguna THT",
      nominalSetoranPribadi: 0,
      tglSetoranPribadi: "-",
      noBuktiSetoran: "-",
      bankPenampungPribadi: "-",
      metodeSetoran: "-",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Pesona Kemhan Depok",
      angsuranPerBulan: 500000,
      status: "Belum Lunas",
      tipePelunasan: "Sebagian (Potongan SP THT Rp 8 Jt, Sisa Rp 27 Jt Belum Disetor)",
    },
    {
      no: 8,
      nama: "Bripka Ahmad Firdaus",
      nik: "3671040810900008",
      ktpa: "KPA-2208193",
      nrp: "90100452",
      satker: "UNOR POLRI (Korbrimob Polri)",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-006677-50-1",
      nominalPenyaluran: 40000000,
      tglPenyaluran: "14/09/2022",
      tahunPenyaluran: "2022",
      bulanPenyaluran: "September",
      // Lunas 100% via JKM
      nominalPelunasanKlaim: 40000000,
      tglSPKlaim: "14/04/2026",
      noSPKlaim: "SP-JKM/2026/04-0005",
      programPelunasan: "JKM",
      jenisKlaim: "Klaim Santunan Kematian JKM",
      nominalSetoranPribadi: 0,
      tglSetoranPribadi: "-",
      noBuktiSetoran: "-",
      bankPenampungPribadi: "-",
      metodeSetoran: "-",
      tahunPelunasan: "2026",
      bulanPelunasan: "April",
      lokasiPerumahan: "Brimob Residence Kelapa Dua, Depok",
      angsuranPerBulan: 650000,
      status: "Lunas",
      tipePelunasan: "Klaim Penuh (Potongan SP JKM 100%)",
    },
    {
      no: 9,
      nama: "Mayor Laut (P) Faisal Basri",
      nik: "3275031901840009",
      ktpa: "KPA-1197284",
      nrp: "1103019283",
      satker: "UNOR TNI AL (Dismatal Mabesal)",
      bankPeserta: "PT Bank Rakyat Indonesia (Persero) Tbk",
      noRekPeserta: "0261-01-003344-53-8",
      nominalPenyaluran: 45000000,
      tglPenyaluran: "22/10/2021",
      tahunPenyaluran: "2021",
      bulanPenyaluran: "Oktober",
      // Lunas Kombinasi: THT Rp 32 Jt + Setoran Pribadi Rp 13 Jt
      nominalPelunasanKlaim: 32000000,
      tglSPKlaim: "22/06/2026",
      noSPKlaim: "SP-THT/2026/06-0442",
      programPelunasan: "THT",
      jenisKlaim: "Klaim Manfaat Habis Kontrak THT",
      nominalSetoranPribadi: 13000000,
      tglSetoranPribadi: "25/06/2026",
      noBuktiSetoran: "SETOR-BRI/202606-3312",
      bankPenampungPribadi: "Bank BRI Cab. Gatot Subroto",
      metodeSetoran: "Transfer Virtual Account",
      tahunPelunasan: "2026",
      bulanPelunasan: "Juni",
      lokasiPerumahan: "Jala Graha Marina, Bekasi",
      angsuranPerBulan: 600000,
      status: "Lunas",
      tipePelunasan: "Kombinasi (Klaim THT Rp 32 Jt + Setoran VA Rp 13 Jt)",
    },
    {
      no: 10,
      nama: "Serma Dwi Cahyono",
      nik: "3372061205880010",
      ktpa: "KPA-9988172",
      nrp: "3108039182",
      satker: "UNOR TNI AD (Ditziad)",
      bankPeserta: "PT Bank Tabungan Negara (Persero) Tbk",
      noRekPeserta: "0012-01-008899-50-3",
      nominalPenyaluran: 30000000,
      tglPenyaluran: "30/07/2023",
      tahunPenyaluran: "2023",
      bulanPenyaluran: "Juli",
      // Angsuran berjalan Rp 12 Jt, Pokok Rp 30 Jt -> Belum Lunas
      nominalPelunasanKlaim: 0,
      tglSPKlaim: "-",
      noSPKlaim: "-",
      programPelunasan: "Belum Ada Klaim",
      jenisKlaim: "Angsuran Gaji Reguler",
      nominalSetoranPribadi: 12000000,
      tglSetoranPribadi: "30/05/2026",
      noBuktiSetoran: "AGS-BTN/202605-0012",
      bankPenampungPribadi: "Bank BTN Cab. Cawang",
      metodeSetoran: "Potong Gaji Rutin",
      tahunPelunasan: "2026",
      bulanPelunasan: "Mei",
      lokasiPerumahan: "Perum Zeni Mandiri, Cibinong",
      angsuranPerBulan: 500000,
      status: "Belum Lunas",
      tipePelunasan: "Angsuran Rutin Berjalan (Belum Ada Pengajuan Klaim)",
    },
  ]);

  // Helper Badge Program Asal Pelunasan (THT, JKK, JKM)
  const getProgramBadge = (prog) => {
    switch (prog) {
      case "THT":
        return {
          bg: "#EFF6FF",
          text: "#1D4ED8",
          border: "#BFDBFE",
          label: "THT (Tabungan Hari Tua)",
          short: "THT",
        };
      case "JKK":
        return {
          bg: "#FFF7ED",
          text: "#C2410C",
          border: "#FED7AA",
          label: "JKK (Kecelakaan Kerja)",
          short: "JKK",
        };
      case "JKM":
        return {
          bg: "#FAF5FF",
          text: "#7E22CE",
          border: "#E9D5FF",
          label: "JKM (Kematian)",
          short: "JKM",
        };
      default:
        return {
          bg: "#F1F5F9",
          text: "#475569",
          border: "#CBD5E1",
          label: prog || "Non-Klaim",
          short: prog || "Non-Klaim",
        };
    }
  };

  // Handler Buka Modal Input Setoran Pribadi
  const handleOpenSetoranModal = (item) => {
    const totalCurrentPelunasan = item.nominalPelunasanKlaim + item.nominalSetoranPribadi;
    const sisaKekurangan = Math.max(0, item.nominalPenyaluran - totalCurrentPelunasan);

    setSetoranModalData(item);
    setInputNominalSetor(sisaKekurangan.toString());
    setInputTglSetor(new Date().toISOString().split("T")[0]);
    setInputNoBukti(`SETOR-${item.bankPeserta.includes("BTN") ? "BTN" : "MNDR"}/${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`);
    setInputBankPenampung(item.bankPeserta);
    setInputMetode("Transfer Bank / Virtual Account");
    setInputCatatan(`Pelunasan sisa kekurangan pinjaman PUM KPR atas nama ${item.nama}`);
  };

  // Handler Simpan Setoran Pribadi
  const handleSaveSetoran = () => {
    if (!setoranModalData) return;

    const nominalNum = Number(inputNominalSetor) || 0;
    if (nominalNum <= 0) {
      alert("Mohon masukkan nominal setoran yang valid!");
      return;
    }

    setPumList((prev) =>
      prev.map((d) => {
        if (d.no === setoranModalData.no) {
          const newSetoranPribadi = d.nominalSetoranPribadi + nominalNum;
          const newTotalPelunasan = d.nominalPelunasanKlaim + newSetoranPribadi;
          const isLunas = newTotalPelunasan >= d.nominalPenyaluran;

          return {
            ...d,
            nominalSetoranPribadi: newSetoranPribadi,
            tglSetoranPribadi: inputTglSetor,
            noBuktiSetoran: inputNoBukti || `SETOR-${Date.now()}`,
            bankPenampungPribadi: inputBankPenampung,
            metodeSetoran: inputMetode,
            status: isLunas ? "Lunas" : "Belum Lunas",
            tipePelunasan: isLunas
              ? `Lunas Kombinasi (Klaim + Setoran Mandiri ${fmt(newSetoranPribadi)})`
              : `Sebagian (Total Masuk ${fmt(newTotalPelunasan)}, Sisa ${fmt(d.nominalPenyaluran - newTotalPelunasan)})`,
          };
        }
        return d;
      })
    );

    alert(`Setoran pribadi sebesar ${fmt(nominalNum)} berhasil dicatat untuk ${setoranModalData.nama}!`);
    setSetoranModalData(null);
  };

  // Options Dropdown
  const namaOptions = useMemo(() => {
    const list = Array.from(new Set(pumList.map((d) => d.nama)));
    return ["Semua", ...list];
  }, [pumList]);

  const kpaOptions = useMemo(() => {
    const list = Array.from(new Set(pumList.map((d) => d.ktpa)));
    return ["Semua", ...list];
  }, [pumList]);

  const statusOptions = ["Semua", "Lunas", "Belum Lunas"];

  const programOptions = ["Semua", "THT", "JKK", "JKM"];

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
    return pumList.filter((d) => {
      if (filterNama !== "Semua" && d.nama !== filterNama) return false;
      if (filterKPA !== "Semua" && d.ktpa !== filterKPA) return false;
      if (filterStatus !== "Semua" && d.status !== filterStatus) return false;
      if (filterProgram !== "Semua" && d.programPelunasan !== filterProgram) return false;
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
        const matchSP = d.noSPKlaim?.toLowerCase().includes(q);
        const matchStatus = d.status.toLowerCase().includes(q);
        if (
          !matchNama &&
          !matchKtpa &&
          !matchNik &&
          !matchNrp &&
          !matchSatker &&
          !matchBank &&
          !matchRek &&
          !matchSP &&
          !matchStatus
        )
          return false;
      }
      return true;
    });
  }, [
    pumList,
    filterNama,
    filterKPA,
    filterStatus,
    filterProgram,
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
  const totalPelunasanKlaim = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.nominalPelunasanKlaim, 0),
    [filteredData]
  );
  const totalSetoranPribadi = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.nominalSetoranPribadi, 0),
    [filteredData]
  );
  const totalSemuaPelunasan = useMemo(
    () => totalPelunasanKlaim + totalSetoranPribadi,
    [totalPelunasanKlaim, totalSetoranPribadi]
  );
  const totalPiutangPUM = useMemo(
    () => totalPenyaluran - totalSemuaPelunasan,
    [totalPenyaluran, totalSemuaPelunasan]
  );

  const countLunas = filteredData.filter((d) => d.status === "Lunas").length;
  const countBelumLunas = filteredData.filter((d) => d.status === "Belum Lunas").length;

  const resetAllFilters = () => {
    setFilterNama("Semua");
    setFilterKPA("Semua");
    setFilterStatus("Semua");
    setFilterProgram("Semua");
    setFilterTahun("Semua");
    setFilterDariPeriode("Semua");
    setFilterSampaiPeriode("Semua");
    setSearchQuery("");
  };

  return (
    <div>
      {/* PREVIEW EXPORT MODAL */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* MODAL INPUT SETORAN PRIBADI / MANDIRI */}
      {setoranModalData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            padding: 16,
          }}
          onClick={() => setSetoranModalData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 580,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.35)",
              overflow: "hidden",
              border: "1px solid #CBD5E1",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
                color: COLORS.white,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Wallet size={22} color="#93C5FD" />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>
                    Form Input Pembayaran Pribadi / Setoran Mandiri
                  </div>
                  <div style={{ fontSize: 12, color: "#BFDBFE", marginTop: 2 }}>
                    Debitur: <strong>{setoranModalData.nama}</strong> ({setoranModalData.nrp})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSetoranModalData(null)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: COLORS.white,
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: COLORS.gray500 }}>Pokok Penyaluran</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.blueDark, fontFamily: "monospace", marginTop: 2 }}>
                    {fmt(setoranModalData.nominalPenyaluran)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.gray500 }}>Potongan Klaim ({setoranModalData.programPelunasan})</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#15803D", fontFamily: "monospace", marginTop: 2 }}>
                    {fmt(setoranModalData.nominalPelunasanKlaim)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#B45309", fontWeight: 700 }}>Sisa Kurang Bayar</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#B91C1C", fontFamily: "monospace", marginTop: 2 }}>
                    {fmt(Math.max(0, setoranModalData.nominalPenyaluran - (setoranModalData.nominalPelunasanKlaim + setoranModalData.nominalSetoranPribadi)))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                  Nominal Setoran Mandiri (Rp) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="number"
                  value={inputNominalSetor}
                  onChange={(e) => setInputNominalSetor(e.target.value)}
                  placeholder="Masukkan nominal setoran..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: "1px solid #94A3B8",
                    fontSize: 14,
                    fontWeight: 700,
                    color: COLORS.gray900,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                    Tanggal Setor / Transfer <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={inputTglSetor}
                    onChange={(e) => setInputTglSetor(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #CBD5E1",
                      fontSize: 12.5,
                      color: COLORS.gray800,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                    Metode Pembayaran
                  </label>
                  <select
                    value={inputMetode}
                    onChange={(e) => setInputMetode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #CBD5E1",
                      fontSize: 12.5,
                      color: COLORS.gray800,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Transfer Bank / Virtual Account">Transfer Bank / Virtual Account</option>
                    <option value="Setoran Tunai Kasir Cabang">Setoran Tunai Kasir Cabang</option>
                    <option value="Transfer M-Banking">Transfer M-Banking</option>
                    <option value="Potong Gaji Rutin Satker">Potong Gaji Rutin Satker</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                    No. Bukti Setor / Resi Bank <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={inputNoBukti}
                    onChange={(e) => setInputNoBukti(e.target.value)}
                    placeholder="Contoh: SETOR-BTN/202606-9981"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #CBD5E1",
                      fontSize: 12,
                      fontFamily: "monospace",
                      color: COLORS.gray800,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                    Bank Penampung ASABRI
                  </label>
                  <input
                    type="text"
                    value={inputBankPenampung}
                    onChange={(e) => setInputBankPenampung(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #CBD5E1",
                      fontSize: 12,
                      color: COLORS.gray800,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.gray800, marginBottom: 5 }}>
                  Catatan / Keterangan
                </label>
                <input
                  type="text"
                  value={inputCatatan}
                  onChange={(e) => setInputCatatan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #CBD5E1",
                    fontSize: 12,
                    color: COLORS.gray800,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
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
              <Btn variant="ghost" onClick={() => setSetoranModalData(null)}>
                Batal
              </Btn>
              <Btn onClick={handleSaveSetoran}>
                <Check size={14} /> Simpan & Perbarui Status
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SURAT KETERANGAN LUNAS (SKL) */}
      {selectedSKL && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            padding: 16,
          }}
          onClick={() => setSelectedSKL(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: "100%",
              maxWidth: 680,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                background: "#0F172A",
                color: COLORS.white,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color="#38BDF8" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>Surat Keterangan Lunas Pinjaman Uang Muka KPR</span>
              </div>
              <button onClick={() => setSelectedSKL(null)} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: 16 }}>
                ✕
              </button>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1, fontSize: 12, lineHeight: 1.6, color: COLORS.gray900 }}>
              <div style={{ textAlign: "center", borderBottom: "2px solid #0F172A", paddingBottom: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1 }}>PT ASABRI (PERSERO)</div>
                <div style={{ fontSize: 11, color: COLORS.gray600 }}>DIVISI KEUANGAN & PERPAJAKAN • DEPARTEMEN PENGELOLAAN DANA & PIUTANG</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginTop: 8, textDecoration: "underline" }}>
                  SURAT KETERANGAN LUNAS PINJAMAN UANG MUKA KPR
                </div>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: COLORS.gray600 }}>
                  Nomor: SKL-PUM/2026/09/{selectedSKL.no.toString().padStart(4, "0")}
                </div>
              </div>

              <p>Menerangkan bahwa peserta ASABRI di bawah ini:</p>
              <table style={{ width: "100%", marginBottom: 14, fontSize: 12 }}>
                <tbody>
                  <tr>
                    <td style={{ width: 140, fontWeight: 600, padding: "3px 0" }}>Nama Peserta</td>
                    <td style={{ width: 10 }}>:</td>
                    <td><strong>{selectedSKL.nama}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: "3px 0" }}>NRP / NIP</td>
                    <td>:</td>
                    <td style={{ fontFamily: "monospace" }}>{selectedSKL.nrp}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: "3px 0" }}>Nomor KPA</td>
                    <td>:</td>
                    <td style={{ fontFamily: "monospace" }}>{selectedSKL.ktpa}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: "3px 0" }}>Satuan Kerja (Unor)</td>
                    <td>:</td>
                    <td>{selectedSKL.satker}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: "3px 0" }}>Bank Fasilitas PUM</td>
                    <td>:</td>
                    <td>{selectedSKL.bankPeserta}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: "3px 0" }}>Lokasi Agunan Rumah</td>
                    <td>:</td>
                    <td>{selectedSKL.lokasiPerumahan}</td>
                  </tr>
                </tbody>
              </table>

              <p>Telah dinyatakan <strong>LUNAS 100%</strong> atas fasilitas Pinjaman Uang Muka KPR (PUM KPR) sebesar <strong>{fmt(selectedSKL.nominalPenyaluran)}</strong> dengan rincian sumber dana pelunasan:</p>

              <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>1. Potongan Klaim Manfaat ({selectedSKL.programPelunasan} - No. {selectedSKL.noSPKlaim}):</span>
                  <strong>{fmt(selectedSKL.nominalPelunasanKlaim)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>2. Pembayaran Mandiri / Pribadi (No. {selectedSKL.noBuktiSetoran}):</span>
                  <strong>{fmt(selectedSKL.nominalSetoranPribadi)}</strong>
                </div>
                <div style={{ borderTop: "1px solid #94A3B8", paddingTop: 4, display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#15803D" }}>
                  <span>TOTAL REALISASI PELUNASAN:</span>
                  <span>{fmt(selectedSKL.nominalPelunasanKlaim + selectedSKL.nominalSetoranPribadi)} (LUNAS 100%)</span>
                </div>
              </div>

              <p style={{ fontSize: 11.5, color: COLORS.gray600 }}>
                Surat Keterangan Lunas ini diterbitkan untuk dipergunakan sebagai kelengkapan administrasi pengurusan pengambilan sertifikat / pelepasan agunan (Roya) pada Bank Penyalur.
              </p>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "center", width: 220 }}>
                  <div>Jakarta, 23 September 2026</div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>Kepala Divisi Keuangan</div>
                  <div style={{ height: 48 }} />
                  <div style={{ fontWeight: 800, textDecoration: "underline" }}>Bambang Sutrisno, S.E., M.M.</div>
                  <div style={{ fontSize: 10.5, color: COLORS.gray500 }}>NIP: 197804122002121001</div>
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 20px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Btn variant="ghost" onClick={() => setSelectedSKL(null)}>Tutup</Btn>
              <Btn onClick={() => window.print()}><Printer size={14} /> Cetak SKL Resmi</Btn>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL SUMBER DANA PELUNASAN */}
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
              maxWidth: 760,
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
                    Rincian & Sumber Dana Pelunasan PUM KPR
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: selectedDetail.status === "Lunas" ? "#10B981" : "#EF4444",
                      color: COLORS.white,
                    }}
                  >
                    {selectedDetail.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                  Debitur: <strong style={{ color: "#E2E8F0" }}>{selectedDetail.nama}</strong> ({selectedDetail.nrp}) • KPA: {selectedDetail.ktpa}
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

            {/* Modal Body: Dibuat dalam bentuk LIST yang bersih dan rapi */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* 1. STATUS & RINGKASAN SALDO PINJAMAN */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: selectedDetail.status === "Lunas" ? "#F0FDF4" : "#FEF2F2",
                  borderLeft: `4px solid ${selectedDetail.status === "Lunas" ? "#10B981" : "#EF4444"}`,
                  borderRadius: "0 8px 8px 0",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {selectedDetail.status === "Lunas" ? (
                    <CheckCircle2 size={22} color="#059669" />
                  ) : (
                    <AlertTriangle size={22} color="#DC2626" />
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: selectedDetail.status === "Lunas" ? "#065F46" : "#991B1B" }}>
                      Status Pinjaman: {selectedDetail.status}
                    </div>
                    <div style={{ fontSize: 11.5, color: selectedDetail.status === "Lunas" ? "#047857" : "#B91C1C" }}>
                      {selectedDetail.tipePelunasan}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: COLORS.gray500, marginRight: 8 }}>Sisa Piutang:</span>
                  <strong style={{ fontSize: 16, fontFamily: "monospace", color: selectedDetail.status === "Lunas" ? "#059669" : "#DC2626" }}>
                    {fmt(Math.max(0, selectedDetail.nominalPenyaluran - (selectedDetail.nominalPelunasanKlaim + selectedDetail.nominalSetoranPribadi)))}
                  </strong>
                </div>
              </div>

              {/* 2. LIST DATA DEBITUR & FASILITAS KPR (LIST FORMAT) */}
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.gray800, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <User size={14} color={COLORS.blue} />
                  <span>Informasi Debitur & Penyaluran</span>
                </div>
                <div style={{ border: `1px solid ${COLORS.gray200}`, borderRadius: 8, overflow: "hidden", fontSize: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "8px 14px", borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                    <span style={{ color: COLORS.gray500 }}>Nama Lengkap & NIK</span>
                    <span style={{ fontWeight: 700, color: COLORS.gray900 }}>{selectedDetail.nama} <span style={{ color: COLORS.gray500, fontWeight: 400 }}>(NIK: {selectedDetail.nik})</span></span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "8px 14px", borderBottom: `1px solid ${COLORS.gray100}`, background: "#F8FAFC" }}>
                    <span style={{ color: COLORS.gray500 }}>KPA / NRP</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark }}>{selectedDetail.ktpa} • {selectedDetail.nrp}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "8px 14px", borderBottom: `1px solid ${COLORS.gray100}`, background: COLORS.white }}>
                    <span style={{ color: COLORS.gray500 }}>Satker (UNOR)</span>
                    <span style={{ fontWeight: 600, color: COLORS.gray800 }}>{selectedDetail.satker}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "8px 14px", borderBottom: `1px solid ${COLORS.gray100}`, background: "#F8FAFC" }}>
                    <span style={{ color: COLORS.gray500 }}>Bank & No. Rekening</span>
                    <span>{selectedDetail.bankPeserta} • Rek: <strong style={{ fontFamily: "monospace", color: COLORS.blue }}>{selectedDetail.noRekPeserta}</strong></span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "8px 14px", background: COLORS.white }}>
                    <span style={{ color: COLORS.gray500 }}>Lokasi Agunan Perumahan</span>
                    <span style={{ color: COLORS.gray800 }}>{selectedDetail.lokasiPerumahan}</span>
                  </div>
                </div>
              </div>

              {/* 3. LIST RINCIAN SUMBER DANA PELUNASAN (LIST ITEM-BY-ITEM) */}
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.gray800, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <Shield size={14} color={COLORS.blue} />
                  <span>Rincian Aliran Sumber Dana Pelunasan</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* List Item 1: Pokok Penyaluran Awal */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#F8FAFC",
                      border: `1px solid ${COLORS.gray300}`,
                      borderRadius: 8,
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "#E0F2FE",
                          color: "#0369A1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 12,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        1
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900 }}>
                            Pokok Penyaluran PUM KPR (Kewajiban Awal)
                          </span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#E0F2FE", color: "#0369A1" }}>
                            Penyaluran Bank
                          </span>
                        </div>
                        <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 3 }}>
                          Disalurkan pada tgl <strong>{selectedDetail.tglPenyaluran}</strong> melalui {selectedDetail.bankPeserta}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>Nilai Pinjaman</div>
                      <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: "#0F172A" }}>
                        {fmt(selectedDetail.nominalPenyaluran)}
                      </div>
                    </div>
                  </div>

                  {/* List Item 2: Sumber Klaim SP Manfaat */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#F0FDF4",
                      border: `1px solid #BBF7D0`,
                      borderRadius: 8,
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "#DCFCE7",
                          color: "#15803D",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 12,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        2
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
                            Potongan Klaim SP Manfaat ASABRI
                          </span>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 800,
                              background: getProgramBadge(selectedDetail.programPelunasan).bg,
                              color: getProgramBadge(selectedDetail.programPelunasan).text,
                              border: `1px solid ${getProgramBadge(selectedDetail.programPelunasan).border}`,
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            Program {getProgramBadge(selectedDetail.programPelunasan).label}
                          </span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#15803D", marginTop: 3 }}>
                          No. SP: <strong>{selectedDetail.noSPKlaim}</strong> • Tgl SP: <strong>{selectedDetail.tglSPKlaim}</strong>
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 1 }}>
                          Jenis Klaim: {selectedDetail.jenisKlaim}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: "#166534" }}>Masuk dari Klaim</div>
                      <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "monospace", color: "#15803D" }}>
                        + {fmt(selectedDetail.nominalPelunasanKlaim)}
                      </div>
                    </div>
                  </div>

                  {/* List Item 3: Sumber Pembayaran Pribadi / Setoran Mandiri */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: selectedDetail.nominalSetoranPribadi > 0 ? "#FAF5FF" : "#F8FAFC",
                      border: `1px solid ${selectedDetail.nominalSetoranPribadi > 0 ? "#E9D5FF" : COLORS.gray300}`,
                      borderRadius: 8,
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: selectedDetail.nominalSetoranPribadi > 0 ? "#F3E8FF" : "#E2E8F0",
                          color: selectedDetail.nominalSetoranPribadi > 0 ? "#7E22CE" : COLORS.gray500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 12,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        3
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: selectedDetail.nominalSetoranPribadi > 0 ? "#6B21A8" : COLORS.gray700,
                            }}
                          >
                            Pembayaran Pribadi / Setoran Mandiri Debitur
                          </span>
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: selectedDetail.nominalSetoranPribadi > 0 ? "#EDE9FE" : "#F1F5F9",
                              color: selectedDetail.nominalSetoranPribadi > 0 ? "#6D28D9" : COLORS.gray500,
                            }}
                          >
                            {selectedDetail.nominalSetoranPribadi > 0 ? "Tervalidasi" : "Tidak Ada / Belum Setor"}
                          </span>
                        </div>
                        {selectedDetail.nominalSetoranPribadi > 0 ? (
                          <>
                            <div style={{ fontSize: 11.5, color: "#6B21A8", marginTop: 3 }}>
                              No. Bukti: <strong>{selectedDetail.noBuktiSetoran}</strong> • Tgl Setor: <strong>{selectedDetail.tglSetoranPribadi}</strong>
                            </div>
                            <div style={{ fontSize: 11, color: COLORS.gray600, marginTop: 1 }}>
                              Tujuan: {selectedDetail.bankPenampungPribadi} ({selectedDetail.metodeSetoran})
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 3 }}>
                            Tidak ada pembayaran melalui setoran pribadi (pelunasan penuh dari klaim SP atau belum menyetor sisa).
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: selectedDetail.nominalSetoranPribadi > 0 ? "#6B21A8" : COLORS.gray500 }}>
                        Masuk dari Setoran Pribadi
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          fontFamily: "monospace",
                          color: selectedDetail.nominalSetoranPribadi > 0 ? "#7C3AED" : COLORS.gray400,
                        }}
                      >
                        {selectedDetail.nominalSetoranPribadi > 0 ? `+ ${fmt(selectedDetail.nominalSetoranPribadi)}` : "Rp 0"}
                      </div>
                    </div>
                  </div>

                  {/* List Item 4: Rekapitulasi Realisasi & Saldo Akhir */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      background: "#0F172A",
                      color: COLORS.white,
                      borderRadius: 8,
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Total Realisasi Dana Pelunasan Masuk
                      </div>
                      <div style={{ fontSize: 12, color: "#E2E8F0", marginTop: 2 }}>
                        Potongan Klaim ({fmt(selectedDetail.nominalPelunasanKlaim)}) + Setoran Pribadi ({fmt(selectedDetail.nominalSetoranPribadi)})
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>Total Masuk</div>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: "#4ADE80" }}>
                        {fmt(selectedDetail.nominalPelunasanKlaim + selectedDetail.nominalSetoranPribadi)}
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
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <Btn variant="ghost" onClick={() => setSelectedDetail(null)}>
                Tutup
              </Btn>
              <div style={{ display: "flex", gap: 8 }}>
                {selectedDetail.status === "Belum Lunas" && (
                  <Btn
                    variant="primary"
                    onClick={() => {
                      const d = selectedDetail;
                      setSelectedDetail(null);
                      handleOpenSetoranModal(d);
                    }}
                  >
                    <Wallet size={14} /> Catat Pembayaran Pribadi
                  </Btn>
                )}
                {selectedDetail.status === "Lunas" && (
                  <Btn
                    variant="primary"
                    onClick={() => {
                      const d = selectedDetail;
                      setSelectedDetail(null);
                      setSelectedSKL(d);
                    }}
                  >
                    <FileText size={14} /> Cetak Surat Keterangan Lunas (SKL)
                  </Btn>
                )}
                <Btn
                  variant="outline"
                  onClick={() => {
                    alert(`Mengunduh Berkas Rekapitulasi Piutang PUM KPR: ${selectedDetail.nama}`);
                  }}
                >
                  <Download size={14} /> Unduh Kartu Piutang
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
          marginBottom: 16,
        }}
      >
        <StatCard
          icon={<Home size={20} />}
          label="Total Pokok Penyaluran"
          value={fmt(totalPenyaluran)}
          color={COLORS.blue}
          subtext={`${filteredData.length} debitur personil`}
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Realisasi Pelunasan"
          value={fmt(totalSemuaPelunasan)}
          color={COLORS.green}
          subtext={`Klaim: ${fmt(totalPelunasanKlaim)} • Pribadi: ${fmt(totalSetoranPribadi)}`}
        />
        <StatCard
          icon={<FileText size={20} />}
          label="Total Sisa Piutang"
          value={fmt(totalPiutangPUM)}
          color={COLORS.orange}
          subtext={`Saldo berjalan pinjaman PUM`}
        />
        <StatCard
          icon={<Percent size={20} />}
          label="Status Debitur"
          value={`${countLunas} Lunas • ${countBelumLunas} Belum`}
          color={COLORS.purple}
          subtext={`Recovery Rate: ${totalPenyaluran > 0 ? ((totalSemuaPelunasan / totalPenyaluran) * 100).toFixed(1) : 0}%`}
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
              Filter Monitoring Pinjaman Uang Muka KPR (PUM KPR)
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
                  title: "Daftar Penyaluran dan Status Pelunasan Piutang PUM KPR",
                  data: filteredData.map((d, idx) => ({
                    No: idx + 1,
                    Nama: d.nama,
                    NIK: d.nik,
                    KPA: d.ktpa,
                    NRP: d.nrp,
                    Satker: d.satker,
                    Bank: d.bankPeserta,
                    Rekening: d.noRekPeserta,
                    PokokPenyaluran: d.nominalPenyaluran,
                    TglPenyaluran: d.tglPenyaluran,
                    Status: d.status,
                    SumberPelunasan: d.tipePelunasan,
                    TotalPelunasan: d.nominalPelunasanKlaim + d.nominalSetoranPribadi,
                    SisaPiutang: Math.max(0, d.nominalPenyaluran - (d.nominalPelunasanKlaim + d.nominalSetoranPribadi)),
                  })),
                })
              }
            >
              <FileSpreadsheet size={13} /> Ekspor Data
            </Btn>
          </div>
        </div>

        {/* 6 DROPDOWNS: Nama, KPA, Status, Program Klaim, Tahun, Bulan */}
        <div
          style={{
            padding: "16px 18px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            background: COLORS.white,
          }}
        >
          {/* 1. Nama */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: COLORS.gray700, marginBottom: 5, textTransform: "uppercase" }}>
              Nama Debitur
            </label>
            <select
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, color: COLORS.gray800, background: COLORS.white, outline: "none", cursor: "pointer" }}
            >
              {namaOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 2. KPA */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: COLORS.gray700, marginBottom: 5, textTransform: "uppercase" }}>
              KPA
            </label>
            <select
              value={filterKPA}
              onChange={(e) => setFilterKPA(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, color: COLORS.gray800, background: COLORS.white, outline: "none", cursor: "pointer" }}
            >
              {kpaOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 3. Status: Lunas / Belum Lunas */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#1E3A8A", marginBottom: 5, textTransform: "uppercase" }}>
              Status Pinjaman
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${filterStatus !== "Semua" ? "#2563EB" : COLORS.gray300}`, fontSize: 12, fontWeight: filterStatus !== "Semua" ? 700 : 500, color: filterStatus !== "Semua" ? "#1E40AF" : COLORS.gray800, background: filterStatus !== "Semua" ? "#EFF6FF" : COLORS.white, outline: "none", cursor: "pointer" }}
            >
              {statusOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 4. Program Klaim */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: COLORS.gray700, marginBottom: 5, textTransform: "uppercase" }}>
              Program Klaim
            </label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, color: COLORS.gray800, background: COLORS.white, outline: "none", cursor: "pointer" }}
            >
              <option value="Semua">Semua Program (THT, JKK, JKM)</option>
              <option value="THT">THT (Tabungan Hari Tua)</option>
              <option value="JKK">JKK (Jaminan Kecelakaan Kerja)</option>
              <option value="JKM">JKM (Jaminan Kematian)</option>
            </select>
          </div>

          {/* 5. Tahun */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: COLORS.gray700, marginBottom: 5, textTransform: "uppercase" }}>
              Tahun Penyaluran
            </label>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, color: COLORS.gray800, background: COLORS.white, outline: "none", cursor: "pointer" }}
            >
              {tahunOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 6. Bulan Penyaluran */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: COLORS.gray700, marginBottom: 5, textTransform: "uppercase" }}>
              Bulan Penyaluran
            </label>
            <select
              value={filterDariPeriode}
              onChange={(e) => setFilterDariPeriode(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12, color: COLORS.gray800, background: COLORS.white, outline: "none", cursor: "pointer" }}
            >
              {periodeOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div
          style={{
            padding: "8px 18px 14px",
            borderTop: "1px dashed #E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Nama, Satker, No. Rekening, KPA..."
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
            Menampilkan <strong>{filteredData.length}</strong> debitur PUM {filterStatus !== "Semua" && `• Status: ${filterStatus}`}
          </div>
        </div>
      </div>

      {/* TABEL DATA UTAMA (Ringkas & Jelas: Ada Pokok Penyaluran, Status Lunas / Belum Lunas, dan Tombol Detail) */}
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
            minWidth: 1100,
          }}
        >
          <thead>
            <tr style={{ background: "#F1F5F9", color: "#0F172A", fontWeight: 800 }}>
              <th style={{ padding: "12px 8px", border: "1px solid #CBD5E1", textAlign: "center", width: 40 }}>
                NO
              </th>
              <th style={{ padding: "12px 12px", border: "1px solid #CBD5E1", minWidth: 180 }}>
                NAMA DEBITUR
              </th>
              <th style={{ padding: "12px 10px", border: "1px solid #CBD5E1", minWidth: 120, textAlign: "center" }}>
                KPA / NRP
              </th>
              <th style={{ padding: "12px 12px", border: "1px solid #CBD5E1", minWidth: 180 }}>
                SATKER (UNOR)
              </th>
              <th style={{ padding: "12px 12px", border: "1px solid #CBD5E1", minWidth: 170 }}>
                BANK & NO. REKENING
              </th>
              <th style={{ padding: "12px 12px", border: "1px solid #CBD5E1", minWidth: 160, textAlign: "right" }}>
                POKOK PENYALURAN
              </th>
              <th style={{ padding: "12px 12px", border: "1px solid #CBD5E1", minWidth: 130, textAlign: "center" }}>
                STATUS
              </th>
              <th style={{ padding: "12px 12px", border: "1px solid #CBD5E1", minWidth: 160, textAlign: "center" }}>
                RINCIAN SUMBER DANA
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 40, textAlign: "center", color: COLORS.gray500, border: "1px solid #CBD5E1" }}>
                  Tidak ada data debitur PUM yang memenuhi filter pencarian.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => {
                const totalPelunasanItem = row.nominalPelunasanKlaim + row.nominalSetoranPribadi;
                const sisaPiutang = Math.max(0, row.nominalPenyaluran - totalPelunasanItem);
                const isLunas = row.status === "Lunas";

                return (
                  <tr
                    key={row.no}
                    style={{
                      background: idx % 2 === 0 ? COLORS.white : "#F8FAFC",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = idx % 2 === 0 ? COLORS.white : "#F8FAFC")
                    }
                  >
                    {/* 1. NO */}
                    <td style={{ padding: "10px 8px", border: "1px solid #CBD5E1", textAlign: "center", fontWeight: 600 }}>
                      {idx + 1}
                    </td>

                    {/* 2. NAMA DEBITUR */}
                    <td style={{ padding: "10px 12px", border: "1px solid #CBD5E1" }}>
                      <div
                        onClick={() => setSelectedDetail(row)}
                        style={{ fontWeight: 700, color: COLORS.blueDark, cursor: "pointer", textDecoration: "underline" }}
                      >
                        {row.nama}
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>
                        NIK: {row.nik}
                      </div>
                    </td>

                    {/* 3. KPA / NRP */}
                    <td style={{ padding: "10px 10px", border: "1px solid #CBD5E1", textAlign: "center" }}>
                      <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>
                        {row.ktpa}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.gray500 }}>
                        {row.nrp}
                      </div>
                    </td>

                    {/* 4. SATKER */}
                    <td style={{ padding: "10px 12px", border: "1px solid #CBD5E1", fontSize: 11.5 }}>
                      <div style={{ fontWeight: 600, color: COLORS.gray800 }}>{row.satker}</div>
                    </td>

                    {/* 5. BANK & NO REK */}
                    <td style={{ padding: "10px 12px", border: "1px solid #CBD5E1", fontSize: 11.5 }}>
                      <div>{row.bankPeserta.replace("PT ", "").replace(" (Persero) Tbk", "")}</div>
                      <div style={{ fontFamily: "monospace", color: COLORS.gray500, fontSize: 11 }}>
                        {row.noRekPeserta}
                      </div>
                    </td>

                    {/* 6. POKOK PENYALURAN */}
                    <td style={{ padding: "10px 12px", border: "1px solid #CBD5E1", textAlign: "right", fontFamily: "monospace" }}>
                      <div style={{ fontWeight: 800, color: "#0C4A6E", fontSize: 13 }}>
                        {fmt(row.nominalPenyaluran)}
                      </div>
                      <div style={{ fontSize: 10.5, color: COLORS.gray500 }}>
                        Tgl: {row.tglPenyaluran}
                      </div>
                    </td>

                    {/* 7. STATUS: "Lunas" / "Belum Lunas" */}
                    <td style={{ padding: "10px 12px", border: "1px solid #CBD5E1", textAlign: "center" }}>
                      {isLunas ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: "#ECFDF5",
                            color: "#065F46",
                            border: "1px solid #A7F3D0",
                            fontWeight: 800,
                            fontSize: 11.5,
                          }}
                        >
                          <CheckCircle2 size={13} color="#059669" />
                          Lunas
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: "#FEF2F2",
                            color: "#991B1B",
                            border: "1px solid #FECACA",
                            fontWeight: 800,
                            fontSize: 11.5,
                          }}
                        >
                          <AlertTriangle size={13} color="#DC2626" />
                          Belum Lunas
                        </span>
                      )}
                    </td>

                    {/* 8. AKSI & DETAIL SUMBER PELUNASAN */}
                    <td style={{ padding: "10px 12px", border: "1px solid #CBD5E1", textAlign: "center" }}>
                      <button
                        onClick={() => setSelectedDetail(row)}
                        style={{
                          background: "#EFF6FF",
                          color: "#1D4ED8",
                          border: "1px solid #BFDBFE",
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Info size={14} color="#2563EB" /> Detail Sumber Dana
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* BARIS TOTAL */}
          <tfoot>
            <tr
              style={{
                background: "#0F172A",
                color: COLORS.white,
                fontWeight: 800,
                fontSize: 12.5,
              }}
            >
              <td
                colSpan={5}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #334155",
                  textAlign: "center",
                  letterSpacing: 1.5,
                }}
              >
                TOTAL ({filteredData.length} DEBITUR)
              </td>

              {/* TOTAL POKOK PENYALURAN */}
              <td
                style={{
                  padding: "12px 12px",
                  border: "1px solid #334155",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#38BDF8",
                  fontSize: 13,
                }}
              >
                {fmt(totalPenyaluran)}
              </td>

              <td
                style={{
                  padding: "12px 12px",
                  border: "1px solid #334155",
                  textAlign: "center",
                  color: "#4ADE80",
                }}
              >
                {countLunas} Lunas
              </td>

              <td
                style={{
                  padding: "12px 12px",
                  border: "1px solid #334155",
                  textAlign: "center",
                  color: "#FCA5A5",
                }}
              >
                {countBelumLunas} Belum Lunas
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 11.5, color: COLORS.gray500, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>* Tabel menampilkan ringkasan pokok penyaluran dan status pelunasan pinjaman (Lunas / Belum Lunas).</span>
        <span>Klik tombol <strong>"Detail Sumber Dana"</strong> untuk melihat rincian potongan klaim SP (THT/JKK/JKM) atau pembayaran mandiri debitur.</span>
      </div>
    </div>
  );
};
