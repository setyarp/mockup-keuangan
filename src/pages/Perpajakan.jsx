import { useState } from "react";
import {
  Calculator,
  Receipt,
  Calendar,
  FileSpreadsheet,
  Scale,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Mail,
  Eye,
  Link2,
  FileUp,
  RefreshCw,
  PenLine,
  Building2,
  Users,
  ShieldCheck,
  Info,
  X,
  ChevronRight,
  FileText,
  Edit3,
  Clock,
  Send
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, Badge, NoData, PreviewModal } from "../components/common";
import { INITIAL_PESERTA_PAJAK } from "../data/perpajakanData";
import {
  ModalUpdateNIK,
  ModalNotaDinas,
  ModalRiwayatTiket,
  ModalDetailMonitoringNIK,
  TabValidasiNIK
} from "../components/perpajakan";

export const Perpajakan = ({ defaultTab = "ter_jan_nov" }) => {
  const [tab, setTab] = useState(defaultTab === "tindak_lanjut_nik" ? "validasi_nik" : defaultTab);
  const [pesertaList, setPesertaList] = useState(INITIAL_PESERTA_PAJAK);
  const [modalUpdateNIK, setModalUpdateNIK] = useState(null);
  const [modalNotaDinas, setModalNotaDinas] = useState(null);
  const [modalRiwayatTiket, setModalRiwayatTiket] = useState(null);
  const [modalDetailMonitoring, setModalDetailMonitoring] = useState(null);
  const [isSyncingDukcapil, setIsSyncingDukcapil] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);


  // Filter PPh 21 Periode / Bulanan (TER & P17)
  const [filterBulanDari, setFilterBulanDari] = useState("Januari");
  const [filterBulanSampai, setFilterBulanSampai] = useState("Juli");
  const [filterTahunTER, setFilterTahunTER] = useState("2026");
  const [filterBulanKomparasi, setFilterBulanKomparasi] = useState("Juli");
  const [modalRincian12Bulan, setModalRincian12Bulan] = useState(null);
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [filterMAK, setFilterMAK] = useState("Semua");
  const [filterStatusPeserta, setFilterStatusPeserta] = useState("Semua");
  const [filterTunjukSilang, setFilterTunjukSilang] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadStep, setUploadStep] = useState(0); // 0=belum upload, 1=terunggah & cocok, 2=terdistribusi
  const [preview, setPreview] = useState(null);
  const [detailKalkulasi, setDetailKalkulasi] = useState(null);

  const fmt = (n) =>
    n < 0
      ? `-Rp ${Math.abs(Math.round(n)).toLocaleString("id-ID")}`
      : `Rp ${Math.round(n || 0).toLocaleString("id-ID")}`;

  const TAHUN_OPTIONS = ["2026", "2025", "2024"];
  const BULAN_OPTIONS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const startMonthIdx = BULAN_OPTIONS.indexOf(filterBulanDari) + 1;
  const endMonthIdx = BULAN_OPTIONS.indexOf(filterBulanSampai) + 1;
  const sMonth = Math.min(startMonthIdx, endMonthIdx);
  const eMonth = Math.max(startMonthIdx, endMonthIdx);
  const isSingleMonth = sMonth === eMonth;
  const labelPeriode = isSingleMonth ? `Masa ${filterBulanDari}` : `Periode ${filterBulanDari} – ${filterBulanSampai}`;
  const labelPeriodeLengkap = isSingleMonth ? `Masa ${filterBulanDari} ${filterTahunTER}` : `Periode ${filterBulanDari} s.d. ${filterBulanSampai} ${filterTahunTER}`;
  const labelPeriodeShort = isSingleMonth ? `${filterBulanDari} ${filterTahunTER}` : `${filterBulanDari} – ${filterBulanSampai} ${filterTahunTER}`;

  const OPSI_BULAN_KOMPARASI = [
    "Akumulasi Setahun (Full Year)",
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

  // Live Master Data Peserta Pensiun untuk Simulasi Perpajakan & Validasi NIK
  const masterPesertaPajak = pesertaList;

  const handleSaveUpdateNIK = ({ id, nik, nama, noBA, catatan }) => {
    setPesertaList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedLogs = [
            ...(p.riwayatLog || []),
            {
              tgl: "08 Jul 2026",
              aksi: "Pemutakhiran NIK Berhasil",
              catatan: `NIK diperbarui menjadi ${nik} (${nama}) berdasarkan ${noBA}. ${catatan}`,
              petugas: "Petugas Perpajakan & SIAK",
            },
          ];
          return {
            ...p,
            nik,
            nama,
            nikValid: true,
            statusNIK: "Valid Dukcapil",
            statusNPWP: "NIK Terpadan Valid (PMK 168)",
            kategoriAnomali: "Normal (Valid)",
            statusTindakLanjut: "Selesai (Terpadan)",
            diagnosaNIK: "Format 16-digit standar Dukcapil valid & terpadan dengan DJP Online.",
            riwayatLog: updatedLogs,
          };
        }
        return p;
      })
    );
    setModalUpdateNIK(null);
    setToastNotification({
      type: "success",
      message: `Pemutakhiran NIK berhasil! Data peserta telah terverifikasi valid di Dukcapil & Coretax DJP.`,
    });
    setTimeout(() => setToastNotification(null), 4000);
  };

  const handleSyncDukcapil = () => {
    setIsSyncingDukcapil(true);
    setTimeout(() => {
      setIsSyncingDukcapil(false);
      setToastNotification({
        type: "info",
        message: "Sinkronisasi selesai: Validasi NIK terhubung dengan SIAK Kemendagri & DJP Coretax.",
      });
      setTimeout(() => setToastNotification(null), 4000);
    }, 1000);
  };

  // Helper kalkulasi PPh Pasal 17 Tahunan (Progresif UU HPP - PMK 168/2023)
  // Sanksi tarif 20% lebih tinggi dihapuskan, tarif menggunakan 100% normal
  const calcPPhPasal17 = (pkp) => {
    if (pkp <= 0) return 0;
    let sisa = pkp;
    let tax = 0;
    // Lapisan 1: 0 - 60jt (5%)
    const lap1 = Math.min(sisa, 60000000);
    tax += lap1 * 0.05;
    sisa -= lap1;
    if (sisa <= 0) return tax;
    // Lapisan 2: 60jt - 250jt (15%)
    const lap2 = Math.min(sisa, 190000000);
    tax += lap2 * 0.15;
    sisa -= lap2;
    if (sisa <= 0) return tax;
    // Lapisan 3: 250jt - 500jt (25%)
    const lap3 = Math.min(sisa, 250000000);
    tax += lap3 * 0.25;
    sisa -= lap3;
    if (sisa <= 0) return tax;
    // Lapisan 4: > 500jt (30%)
    tax += sisa * 0.30;
    return tax;
  };

  // Helper kalkulasi komparasi per bulan spesifik (Bulan 1 s.d. 12)
  const getKomparasiPerBulan = (p, monthIdx) => {
    const bulanNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const namaBulan = bulanNames[monthIdx - 1];
    const bulanDiterima = p.isBerhenti ? p.bulanBerhentiIdx : 12;
    const brutoSetahun = p.brutoBulanan * bulanDiterima;
    const biayaPensiunSetahun = Math.min(brutoSetahun * 0.05, 200000 * bulanDiterima);
    const nettoSetahun = brutoSetahun - biayaPensiunSetahun;
    const pkpSetahun = Math.max(0, nettoSetahun - p.ptkp);
    const pphSetahunP17 = calcPPhPasal17(pkpSetahun);
    const pphP17Bulanan = bulanDiterima > 0 ? pphSetahunP17 / bulanDiterima : 0;

    // Khusus NOPENS Pasangan Tunjuk Silang: Bebas PPh 21 / Pajak Kosong (Rp 0)
    if (p.isBebasPajakTunjukSilang) {
      return {
        bulanIdx: monthIdx,
        namaBulan,
        bruto: p.brutoBulanan,
        pphBaru: 0,
        pphLama: 0,
        selisih: 0,
        selisihPersen: "0.0",
        status: "Bebas PPh 21 (Tunjuk Silang)",
        badgeColor: "amber",
        keterangan: `Pajak Nihil/Kosong (Tunjuk Silang disatukan di NOPENS Utama ${p.nopensPasangan})`,
      };
    }

    // Pasca berhenti
    if (p.isBerhenti && monthIdx > p.bulanBerhentiIdx) {
      return {
        bulanIdx: monthIdx,
        namaBulan,
        bruto: 0,
        pphBaru: 0,
        pphLama: 0,
        selisih: 0,
        selisihPersen: "0.0",
        status: "Non-Aktif (Pasca Berhenti)",
        badgeColor: "gray",
        keterangan: `Dapem ditutup sejak ${p.bulanBerhentiNama} (${p.alasanBerhenti})`,
      };
    }

    // Dapem Terakhir (Berhenti di bulan ini)
    if (p.isBerhenti && monthIdx === p.bulanBerhentiIdx) {
      const kumulatifBruto = p.brutoBulanan * monthIdx;
      const biayaPensiunKumulatif = Math.min(kumulatifBruto * 0.05, 200000 * monthIdx);
      const nettoKumulatif = kumulatifBruto - biayaPensiunKumulatif;
      const pkpKumulatif = Math.max(0, nettoKumulatif - p.ptkp);
      const pphP17Terutang = calcPPhPasal17(pkpKumulatif);
      const kreditTERSebelumnya = (monthIdx - 1) * (p.brutoBulanan * p.tarifTER);
      const pphDipotongBulanIni = pphP17Terutang - kreditTERSebelumnya;
      const selisih = pphDipotongBulanIni - pphP17Bulanan;
      const selisihPersen = pphP17Bulanan > 0 ? ((selisih / pphP17Bulanan) * 100).toFixed(1) : "0.0";

      return {
        bulanIdx: monthIdx,
        namaBulan,
        bruto: p.brutoBulanan,
        pphBaru: pphDipotongBulanIni,
        pphLama: pphP17Bulanan,
        selisih,
        selisihPersen,
        status: pphDipotongBulanIni < 0 ? "Lebih Bayar Dikembalikan" : "Dapem Terakhir (Pasal 17)",
        badgeColor: pphDipotongBulanIni < 0 ? "green" : "purple",
        keterangan: `Penyesuaian Dapem Terakhir (${p.alasanBerhenti})`,
      };
    }

    // Bulan Desember (Rekonsiliasi Tahunan)
    if (monthIdx === 12) {
      const pphTERSebelumnya = 11 * (p.brutoBulanan * p.tarifTER);
      const pphDesember = pphSetahunP17 - pphTERSebelumnya;
      const selisih = pphDesember - pphP17Bulanan;
      const selisihPersen = pphP17Bulanan > 0 ? ((selisih / pphP17Bulanan) * 100).toFixed(1) : "0.0";

      return {
        bulanIdx: monthIdx,
        namaBulan,
        bruto: p.brutoBulanan,
        pphBaru: pphDesember,
        pphLama: pphP17Bulanan,
        selisih,
        selisihPersen,
        status: pphDesember < 0 ? "Lebih Bayar (Rekonsiliasi)" : selisih === 0 ? "Setara" : selisih > 0 ? "TER Kurang Bayar" : "TER Lebih Bayar",
        badgeColor: pphDesember < 0 ? "green" : selisih === 0 ? "gray" : selisih > 0 ? "red" : "blue",
        keterangan: "Rekonsiliasi Akhir Tahun (Pasal 17 Tahunan)",
      };
    }

    // Bulan Reguler (Januari - November)
    const pphTER = p.brutoBulanan * p.tarifTER;
    const selisih = pphTER - pphP17Bulanan;
    const selisihPersen = pphP17Bulanan > 0 ? ((selisih / pphP17Bulanan) * 100).toFixed(1) : "0.0";

    return {
      bulanIdx: monthIdx,
      namaBulan,
      bruto: p.brutoBulanan,
      pphBaru: pphTER,
      pphLama: pphP17Bulanan,
      selisih,
      selisihPersen,
      status: selisih === 0 ? "Setara" : selisih > 0 ? "TER Lebih Tinggi" : "TER Lebih Rendah",
      badgeColor: selisih === 0 ? "gray" : selisih > 0 ? "red" : "green",
      keterangan: `Tarif Efektif Rata-Rata (${p.kategoriTER} - ${(p.tarifTER * 100).toFixed(2)}%)`,
    };
  };

  // Helper generator matriks 12 bulan lengkap untuk 1 peserta
  const generate12BulanPeserta = (p) => {
    const list = [];
    for (let m = 1; m <= 12; m++) {
      list.push(getKomparasiPerBulan(p, m));
    }
    const totalBruto = list.reduce((a, b) => a + b.bruto, 0);
    const totalPPhBaru = list.reduce((a, b) => a + b.pphBaru, 0);
    const totalPPhLama = list.reduce((a, b) => a + b.pphLama, 0);
    const totalSelisih = totalPPhBaru - totalPPhLama;

    return {
      peserta: p,
      months: list,
      totalBruto,
      totalPPhBaru,
      totalPPhLama,
      totalSelisih,
    };
  };

  // 1. EVALUASI DINAMIS REKAP PPH 21 BULANAN / PERIODE (TAB 1)
  // Berdasarkan filter periode terpilih: dari sMonth s.d. eMonth
  const dataBulanan = masterPesertaPajak.map((p) => {
    let monthlyBreakdown = [];
    let brutoPeriode = 0;
    let pphDipotongPeriode = 0;
    let pphTERPeriode = 0;
    let pphP17Periode = 0;
    let bulanAktifDalamPeriode = 0;
    let hasDapemTerakhir = false;
    let hasLebihBayar = false;
    let allPascaBerhenti = true;

    for (let m = sMonth; m <= eMonth; m++) {
      const resM = getKomparasiPerBulan(p, m);
      monthlyBreakdown.push(resM);
      brutoPeriode += resM.bruto;
      pphDipotongPeriode += resM.pphBaru;

      const isDapemTerakhirM = p.isBerhenti && m === p.bulanBerhentiIdx;
      const isPascaBerhentiM = p.isBerhenti && m > p.bulanBerhentiIdx;

      if (!isPascaBerhentiM) {
        allPascaBerhenti = false;
        bulanAktifDalamPeriode += 1;
      }
      if (isDapemTerakhirM) {
        hasDapemTerakhir = true;
        pphP17Periode += resM.pphBaru;
      } else if (!isPascaBerhentiM) {
        pphTERPeriode += resM.pphBaru;
      }
      if (resM.pphBaru < 0) {
        hasLebihBayar = true;
      }
    }

    // Akumulasi dari Januari (Bulan 1) s.d. akhir periode terpilih (eMonth)
    let kumulatifBrutoJanSampaiAkhir = 0;
    let pphKumulatifJanSampaiAkhir = 0;
    for (let m = 1; m <= eMonth; m++) {
      const resM = getKomparasiPerBulan(p, m);
      kumulatifBrutoJanSampaiAkhir += resM.bruto;
      pphKumulatifJanSampaiAkhir += resM.pphBaru;
    }

    const isDapemTerakhir = isSingleMonth
      ? (p.isBerhenti && sMonth === p.bulanBerhentiIdx)
      : hasDapemTerakhir;

    const isPascaBerhenti = isSingleMonth
      ? (p.isBerhenti && sMonth > p.bulanBerhentiIdx)
      : allPascaBerhenti;

    const isLebihBayar = pphDipotongPeriode < 0;

    let statusBulanIni = "";
    let statusKepesertaanFilter = "";
    let metodePerhitungan = "";
    let tarifBulanIniStr = "";

    if (p.isBebasPajakTunjukSilang) {
      statusBulanIni = "Bebas PPh (TS)";
      statusKepesertaanFilter = "Tunjuk Silang (Bebas PPh 21)";
      metodePerhitungan = "Bebas PPh 21 (Tunjuk Silang)";
      tarifBulanIniStr = "0.00% (Bebas TS)";
    } else if (isSingleMonth) {
      statusBulanIni = isPascaBerhenti
        ? "Non-Aktif"
        : isLebihBayar
        ? "Pasal 17 (Lebih Bayar)"
        : isDapemTerakhir
        ? "Pasal 17 (Dapem Terakhir)"
        : p.tarifTER === 0
        ? "TER 0% (Bawah PTKP)"
        : "Aktif (TER)";

      statusKepesertaanFilter = isPascaBerhenti
        ? "Non-Aktif (Pasca Berhenti)"
        : isLebihBayar
        ? "Lebih Bayar (LB Dikembalikan)"
        : isDapemTerakhir
        ? "Pasal 17 (Dapem Terakhir)"
        : p.tarifTER === 0
        ? "TER 0% (Bawah PTKP)"
        : "TER Reguler (Aktif)";

      metodePerhitungan = isPascaBerhenti
        ? "Non-Aktif (Pasca Berhenti)"
        : isLebihBayar
        ? "Pasal 17 (Lebih Bayar)"
        : isDapemTerakhir
        ? "PPh Pasal 17 (Dapem Terakhir)"
        : p.tarifTER === 0
        ? "TER 0% (Bawah PTKP)"
        : "TER Bulanan";

      tarifBulanIniStr = isPascaBerhenti
        ? "—"
        : isDapemTerakhir
        ? "Pasal 17 Progresif"
        : p.tarifTER === 0
        ? "0.00% (Nihil)"
        : `${(p.tarifTER * 100).toFixed(2)}% (${p.kategoriTER})`;
    } else {
      statusBulanIni = isPascaBerhenti
        ? "Non-Aktif"
        : isLebihBayar
        ? "TER + P17 (Lebih Bayar)"
        : isDapemTerakhir
        ? "TER + P17 (Dapem Terakhir)"
        : p.tarifTER === 0
        ? "TER 0% (Bawah PTKP)"
        : `Aktif (${bulanAktifDalamPeriode} Bln)`;

      statusKepesertaanFilter = isPascaBerhenti
        ? "Non-Aktif (Pasca Berhenti)"
        : isLebihBayar
        ? "Lebih Bayar (LB Dikembalikan)"
        : isDapemTerakhir
        ? "TER & P17 (Dapem Terakhir)"
        : p.tarifTER === 0
        ? "TER 0% (Bawah PTKP)"
        : `TER Reguler (${bulanAktifDalamPeriode} Bln)`;

      metodePerhitungan = isPascaBerhenti
        ? "Non-Aktif (Pasca Berhenti)"
        : isLebihBayar
        ? "TER & P17 (Lebih Bayar)"
        : isDapemTerakhir
        ? "TER & P17 (Dapem Terakhir)"
        : p.tarifTER === 0
        ? "TER 0% (Bawah PTKP)"
        : `TER Bulanan (${bulanAktifDalamPeriode} Bln)`;

      tarifBulanIniStr = isPascaBerhenti
        ? "—"
        : isDapemTerakhir
        ? `${(p.tarifTER * 100).toFixed(2)}% + P17`
        : p.tarifTER === 0
        ? "0.00% (Nihil)"
        : `${(p.tarifTER * 100).toFixed(2)}% (${p.kategoriTER})`;
    }

    const bulanBerhentiEfektif = p.isBerhenti ? p.bulanBerhentiIdx : eMonth;
    const kumulatifBrutoDihitung = p.brutoBulanan * bulanBerhentiEfektif;
    const biayaPensiunKumulatif = Math.min(kumulatifBrutoDihitung * 0.05, 200000 * bulanBerhentiEfektif);
    const nettoKumulatif = kumulatifBrutoDihitung - biayaPensiunKumulatif;
    const pkpKumulatif = Math.max(0, nettoKumulatif - p.ptkp);
    const pphP17Terutang = calcPPhPasal17(pkpKumulatif);
    const pphTERSebelumnya = (bulanBerhentiEfektif - 1) * (p.brutoBulanan * p.tarifTER);

    return {
      ...p,
      statusBulanIni,
      statusKepesertaanFilter,
      brutoPeriode,
      brutoBulanIni: brutoPeriode, // alias
      bulanAktifDalamPeriode,
      kumulatifBruto: kumulatifBrutoJanSampaiAkhir,
      pphKumulatifJanBulanIni: pphKumulatifJanSampaiAkhir,
      pphDipotongPeriode,
      pphDipotongBulanIni: pphDipotongPeriode, // alias
      pphTERBulanIni: isSingleMonth ? ((!p.isBerhenti || sMonth < p.bulanBerhentiIdx) ? pphDipotongPeriode : 0) : pphTERPeriode,
      pphP17BulanIni: isSingleMonth ? (isDapemTerakhir ? pphDipotongPeriode : 0) : pphP17Periode,
      isLebihBayar,
      metodePerhitungan,
      tarifBulanIniStr,
      isDapemTerakhir,
      isPascaBerhenti,
      monthlyBreakdown,
      biayaPensiunKumulatif,
      nettoKumulatif,
      pkpKumulatif,
      pphP17Terutang,
      pphTERSebelumnya,
    };
  });

  // Filter Data Bulanan (Tab 1) — Pencarian NRP / NIK / NOPENS / Nama & Evaluasi Masa Aktif
  const filteredDataBulanan = dataBulanan.filter((d) => {
    // Sesuai aturan: Jika peserta berhenti/meninggal sebelum awal periode (sMonth > d.bulanBerhentiIdx),
    // maka peserta tersebut TIDAK IKUT / TIDAK MUNCUL pada periode tersebut.
    // Contoh: Pak Wirawan wafat Maret (idx 3). Saat filter April (sMonth 4 > 3), beliau tidak muncul.
    // Namun saat filter Januari - April (sMonth 1 <= 3), nama beliau muncul dengan akumulasi Jan-Mar.
    if (d.isBerhenti && sMonth > d.bulanBerhentiIdx) {
      return false;
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.nama.toLowerCase().includes(q) ||
      d.nik.toLowerCase().includes(q) ||
      d.nrp.toLowerCase().includes(q) ||
      d.nopens.toLowerCase().includes(q)
    );
  });

  // 2. DATA TAHUNAN & PENYESUAIAN AKHIR (TAB 2, 3, 4, 5)
  const dataTahunan = masterPesertaPajak.map((p) => {
    const bulanDiterima = p.isBerhenti ? p.bulanBerhentiIdx : 12;
    const brutoSetahun = p.brutoBulanan * bulanDiterima;
    const biayaPensiunSetahun = Math.min(brutoSetahun * 0.05, 200000 * bulanDiterima);
    const nettoSetahun = brutoSetahun - biayaPensiunSetahun;
    const pkp = Math.max(0, nettoSetahun - p.ptkp);
    const pphTerutangSetahunP17 = calcPPhPasal17(pkp); // Tanpa denda 20%

    // Pemotongan PPh 21 TER
    const pphTERBulanan = p.brutoBulanan * p.tarifTER; // Tanpa denda 20%
    const bulanTER = p.isBerhenti ? Math.max(0, bulanDiterima - 1) : 11;
    const pphDipotongJanNov = pphTERBulanan * bulanTER;

    // Pemotongan Penyesuaian Akhir (Masa Desember atau Dapem Terakhir)
    const pphPenyesuaianAkhir = pphTerutangSetahunP17 - pphDipotongJanNov;
    const isLebihBayarTahunan = pphPenyesuaianAkhir < 0;

    // PPh Bulanan Metode Lama (Pasal 17 Rata-Rata)
    const pphP17Bulanan = pphTerutangSetahunP17 / bulanDiterima;

    if (p.isBebasPajakTunjukSilang) {
      return {
        ...p,
        bulanDiterima,
        brutoSetahun,
        biayaPensiunSetahun,
        nettoSetahun,
        pkp: 0,
        pphTerutangSetahunP17: 0,
        pphTERBulanan: 0,
        bulanTER: 0,
        pphDipotongJanNov: 0,
        pphPenyesuaianAkhir: 0,
        isLebihBayarTahunan: false,
        pphP17Bulanan: 0,
        selisihBulanan: 0,
        selisihPersen: "0.0",
        masaPerolehanStr: "01 - 12",
        keteranganPelunasan: `Tunjuk Silang (Bebas PPh 21 — Digabung NOPENS ${p.nopensPasangan})`
      };
    }

    return {
      ...p,
      bulanDiterima,
      brutoSetahun,
      biayaPensiunSetahun,
      nettoSetahun,
      pkp,
      pphTerutangSetahunP17,
      pphTERBulanan,
      bulanTER,
      pphDipotongJanNov,
      pphPenyesuaianAkhir,
      isLebihBayarTahunan,
      pphP17Bulanan,
      selisihBulanan: pphTERBulanan - pphP17Bulanan,
      selisihPersen: pphP17Bulanan > 0 ? (((pphTERBulanan - pphP17Bulanan) / pphP17Bulanan) * 100).toFixed(1) : "0",
      masaPerolehanStr: p.isBerhenti ? `01 - 0${bulanDiterima}` : "01 - 12",
      keteranganPelunasan: p.isBerhenti
        ? (isLebihBayarTahunan ? `Lebih Bayar Dikembalikan (Masa ${p.bulanBerhentiNama})` : `Lunas Masa ${p.bulanBerhentiNama} (Dapem Terakhir)`)
        : (isLebihBayarTahunan ? "Lebih Bayar Dikembalikan (Masa Des)" : "Lunas Masa Desember")
    };
  });

  // Filter Data Tahunan
  const filteredDataTahunan = dataTahunan.filter((d) => {
    const matchSatker = filterSatker === "Semua" || d.satker === filterSatker;
    const matchMAK = filterMAK === "Semua" || d.mak === filterMAK;
    const matchTS = filterTunjukSilang === "Semua" || (filterTunjukSilang === "Ya" ? d.tunjukSilang : !d.tunjukSilang);
    const matchSearch = searchQuery === "" ||
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nik.includes(searchQuery) ||
      d.nrp.includes(searchQuery) ||
      d.nopens.includes(searchQuery);
    return matchSatker && matchMAK && matchTS && matchSearch;
  });

  // 3. DATA KOMPARASI AUDIT BERDASARKAN FILTER BULAN / TAHUNAN (TAB 4)
  const isKomparasiTahunan = filterBulanKomparasi === "Akumulasi Setahun (Full Year)";
  const bulanKomparasiIdx = isKomparasiTahunan ? 12 : OPSI_BULAN_KOMPARASI.indexOf(filterBulanKomparasi); // 1..12

  const dataKomparasiAudit = masterPesertaPajak.map((p) => {
    if (isKomparasiTahunan) {
      if (p.isBebasPajakTunjukSilang) {
        return {
          ...p,
          masaPajakLabel: "Jan–Des 2026 (Setahun Penuh)",
          brutoEvaluasi: p.brutoBulanan * 12,
          pphBaruEvaluasi: 0,
          pphLamaEvaluasi: 0,
          selisihEvaluasi: 0,
          selisihPersenStr: "0.0%",
          statusEvaluasi: "Bebas PPh 21 (Tunjuk Silang)",
          badgeColor: "amber",
          keteranganEvaluasi: `Pajak Kosong / Digabung pada NOPENS Utama ${p.nopensPasangan}`,
        };
      }

      const bulanDiterima = p.isBerhenti ? p.bulanBerhentiIdx : 12;
      const brutoSetahun = p.brutoBulanan * bulanDiterima;
      const biayaPensiunSetahun = Math.min(brutoSetahun * 0.05, 200000 * bulanDiterima);
      const nettoSetahun = brutoSetahun - biayaPensiunSetahun;
      const pkp = Math.max(0, nettoSetahun - p.ptkp);
      const pphTerutangSetahun = calcPPhPasal17(pkp);

      return {
        ...p,
        masaPajakLabel: p.isBerhenti ? `${p.masaPerolehanStr} (${p.bulanBerhentiNama} Berhenti)` : "Jan–Des 2026 (Setahun Penuh)",
        brutoEvaluasi: brutoSetahun,
        pphBaruEvaluasi: pphTerutangSetahun,
        pphLamaEvaluasi: pphTerutangSetahun,
        selisihEvaluasi: 0,
        selisihPersenStr: "0.0%",
        statusEvaluasi: "Setara 100% (Rekonsiliasi Imbang)",
        badgeColor: "gray",
        keteranganEvaluasi: "Rekonsiliasi Tahunan Final (Nihil Selisih)",
      };
    } else {
      const res = getKomparasiPerBulan(p, bulanKomparasiIdx);
      return {
        ...p,
        masaPajakLabel: `${filterBulanKomparasi} 2026`,
        brutoEvaluasi: res.bruto,
        pphBaruEvaluasi: res.pphBaru,
        pphLamaEvaluasi: res.pphLama,
        selisihEvaluasi: res.selisih,
        selisihPersenStr: `${res.selisihPersen}%`,
        statusEvaluasi: res.status,
        badgeColor: res.badgeColor,
        keteranganEvaluasi: res.keterangan,
        isDapemTerakhirBulanIni: p.isBerhenti && bulanKomparasiIdx === p.bulanBerhentiIdx,
      };
    }
  });

  const filteredDataKomparasi = dataKomparasiAudit.filter((d) => {
    const matchSatker = filterSatker === "Semua" || d.satker === filterSatker;
    const matchMAK = filterMAK === "Semua" || d.mak === filterMAK;
    const matchTS = filterTunjukSilang === "Semua" || (filterTunjukSilang === "Ya" ? d.tunjukSilang : !d.tunjukSilang);
    const matchSearch = searchQuery === "" ||
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nik.includes(searchQuery) ||
      d.nrp.includes(searchQuery) ||
      d.nopens.includes(searchQuery);
    return matchSatker && matchMAK && matchTS && matchSearch;
  });

  const totalBrutoKomparasi = filteredDataKomparasi.reduce((a, b) => a + b.brutoEvaluasi, 0);
  const totalPPhBaruKomparasi = filteredDataKomparasi.reduce((a, b) => a + b.pphBaruEvaluasi, 0);
  const totalPPhLamaKomparasi = filteredDataKomparasi.reduce((a, b) => a + b.pphLamaEvaluasi, 0);
  const totalSelisihKomparasi = totalPPhBaruKomparasi - totalPPhLamaKomparasi;

  // Summary Metrics Bulanan (Dasar Penyetoran & Tagihan ke Kemenkeu)
  const totalPesertaBulanIni = filteredDataBulanan.length;
  const totalBrutoBulanIni = filteredDataBulanan.reduce((a, b) => a + b.brutoPeriode, 0);
  const totalKumulatifBrutoBulanIni = filteredDataBulanan.reduce((a, b) => a + b.kumulatifBruto, 0);
  const totalPPhKumulatifBulanIni = filteredDataBulanan.reduce((a, b) => a + b.pphKumulatifJanBulanIni, 0);
  const totalPPhDipotongBulanIni = filteredDataBulanan.reduce((a, b) => a + b.pphDipotongPeriode, 0);
  const totalLebihBayarBulanIni = filteredDataBulanan
    .filter((d) => d.pphDipotongPeriode < 0)
    .reduce((a, b) => a + Math.abs(b.pphDipotongPeriode), 0);
  const jumlahPesertaLebihBayar = filteredDataBulanan.filter((d) => d.pphDipotongPeriode < 0).length;
  const totalPesertaTER = filteredDataBulanan.filter((d) => !d.isPascaBerhenti && !d.isDapemTerakhir).length;
  const totalPesertaNihil = filteredDataBulanan.filter((d) => d.statusKepesertaanFilter === "TER 0% (Bawah PTKP)").length;
  const totalPesertaP17Berhenti = filteredDataBulanan.filter((d) => d.isDapemTerakhir).length;
  const totalPesertaNonAktif = filteredDataBulanan.filter((d) => d.isPascaBerhenti).length;

  const totalAnomaliNIK = masterPesertaPajak.filter((d) => !d.nikValid).length;

  const tabsConfig = [
    {
      id: "ter_jan_nov",
      label: "Rekap PPh 21 Bulanan (TER & P17)",
      icon: <Calculator size={15} />,
      badge: labelPeriodeShort
    },
    {
      id: "validasi_nik",
      label: "Validasi NIK & Tindak Lanjut",
      icon: <ShieldCheck size={15} />,
      badge: totalAnomaliNIK > 0 ? `${totalAnomaliNIK} Antrean` : "100% Valid",
    },
    {
      id: "pasal17_des",
      label: "PPh Pasal 17 Penyesuaian (Des & Berhenti)",
      icon: <Calendar size={15} />,
    },
    {
      id: "spt_tahunan",
      label: "SPT Tahunan PPh 21",
      icon: <FileSpreadsheet size={15} />,
    },
    {
      id: "komparasi_audit",
      label: "Audit TER vs Pasal 17",
      icon: <Scale size={15} />,
    },
    {
      id: "bukpot_coretax",
      label: "Bukti Potong 1721-A2 & Coretax",
      icon: <Receipt size={15} />,
    },
  ];

  const handleExportTab = (tabName) => {
    const targetTab = typeof tabName === "string" ? tabName : tab;
    if (targetTab === "ter_jan_nov") {
      setPreview({
        title: isSingleMonth
          ? `Laporan Rekap PPh 21 Bulanan — Masa ${filterBulanDari} ${filterTahunTER}`
          : `Laporan Rekap PPh 21 Periode — ${filterBulanDari} s.d. ${filterBulanSampai} ${filterTahunTER}`,
        subtitle: `Rekapitulasi Perhitungan PPh 21 ${labelPeriodeLengkap} Menggunakan Tarif TER dan Tarif Pasal 17 — Sesuai PMK 168/2023`,
        type: "table",
        fileName: isSingleMonth
          ? `Rekap_PPh21_Masa_${filterBulanDari}_${filterTahunTER}.xlsx`
          : `Rekap_PPh21_Periode_${filterBulanDari}_sd_${filterBulanSampai}_${filterTahunTER}.xlsx`,
        content: {
          columns: [
            "No",
            "MAK",
            "NIK",
            "NRP",
            "NOPENS",
            "Peserta Pensiun",
            "Status PTKP",
            `Bruto (${labelPeriode})`,
            `PPh Dipotong (${labelPeriode})`,
            `PPh Kumulatif (Jan - ${filterBulanSampai})`,
            "Metode Perhitungan",
            "Tarif Berlaku",
            "Tunjuk Silang",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "center",
            "left",
            "center",
            "right",
            "right",
            "right",
            "center",
            "center",
            "center",
          ],
          rows: filteredDataBulanan.map((d, i) => [
            i + 1,
            d.mak,
            d.nik,
            d.nrp,
            d.nopens,
            d.nama,
            `${d.kodeJiwa} (${fmt(d.ptkp)})`,
            fmt(d.brutoPeriode),
            d.pphDipotongPeriode < 0
              ? `- ${fmt(Math.abs(d.pphDipotongPeriode))}`
              : fmt(d.pphDipotongPeriode),
            fmt(d.pphKumulatifJanBulanIni),
            d.metodePerhitungan,
            d.tarifBulanIniStr,
            d.tunjukSilang ? (d.isBebasPajakTunjukSilang ? "TS: Bebas Pajak" : "TS: NOPENS Utama") : "—",
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL ${labelPeriode.toUpperCase()} ${filterTahunTER} (${filteredDataBulanan.length} PESERTA)`,
              align: "left",
            },
            { text: fmt(totalBrutoBulanIni), align: "right" },
            {
              text: fmt(totalPPhDipotongBulanIni),
              align: "right",
              color: totalPPhDipotongBulanIni >= 0 ? "#1D4ED8" : "#059669",
            },
            { text: fmt(totalPPhKumulatifBulanIni), align: "right" },
            { colSpan: 3, text: "—", align: "center" },
          ],
          totalRows: filteredDataBulanan.length,
        },
      });
    } else if (targetTab === "pasal17_des") {
      setPreview({
        title: "Laporan Rekap PPh Pasal 17 Penyesuaian Akhir Tahun & Masa Terakhir 2026",
        subtitle: "Perhitungan Penyesuaian Akhir Tahun Masa Desember dan Dapem Terakhir Peserta Berhenti",
        type: "table",
        fileName: "Rekap_PPh_Pasal17_Penyesuaian_2026.xlsx",
        content: {
          columns: [
            "No",
            "MAK",
            "NIK",
            "NRP",
            "NOPENS",
            "Peserta Pensiun",
            "Masa Perolehan",
            "Bruto Kumulatif",
            "Biaya Pensiun",
            "PTKP",
            "PKP",
            "PPh Terutang (P17)",
            "PPh TER Sebelumnya",
            "PPh Dipotong Terakhir",
            "Status Pelunasan",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "center",
            "left",
            "center",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.mak,
            d.nik,
            d.nrp,
            d.nopens,
            d.nama,
            `${d.bulanDiterima} Bulan (${d.masaPerolehanStr})`,
            fmt(d.brutoSetahun),
            fmt(d.biayaPensiunSetahun),
            fmt(d.ptkp),
            fmt(d.pkp),
            fmt(d.pphTerutangSetahunP17),
            fmt(d.pphDipotongJanNov),
            d.pphPenyesuaianAkhir < 0
              ? `- ${fmt(Math.abs(d.pphPenyesuaianAkhir))} (LB Dikembalikan)`
              : fmt(d.pphPenyesuaianAkhir),
            d.keteranganPelunasan,
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL AKUMULASI SELURUH PESERTA (${filteredDataTahunan.length} WP)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoSetahun, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.biayaPensiunSetahun, 0)),
              align: "right",
            },
            { text: "—", align: "center" },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pkp, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphDipotongJanNov, 0)),
              align: "right",
              color: "#059669",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphPenyesuaianAkhir, 0)),
              align: "right",
              color: "#7C3AED",
            },
            { text: "100% Selaras", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    } else if (targetTab === "spt_tahunan") {
      setPreview({
        title: "Laporan Rekapitulasi SPT Tahunan PPh 21 Badan PT ASABRI ke DJP Online",
        subtitle: "Dasar Pengisian Formulir SPT Tahunan PPh 21 Badan (100% Tarif Normal Sesuai PMK 168/2023)",
        type: "table",
        fileName: "Rekap_SPT_Tahunan_PPh21_2026.xlsx",
        content: {
          columns: [
            "No",
            "MAK",
            "NIK",
            "NRP",
            "NOPENS",
            "Peserta Pensiun",
            "Kode Jiwa",
            "Masa",
            "Bruto Setahun",
            "Biaya Pensiun",
            "PKP Setahun",
            "PPh Terutang Setahun",
            "Kredit PPh TER",
            "PPh Pelunasan",
            "Status Pemadanan NPWP",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "center",
            "left",
            "center",
            "center",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.mak,
            d.nik,
            d.nrp,
            d.nopens,
            d.nama,
            d.kodeJiwa,
            d.masaPerolehanStr,
            fmt(d.brutoSetahun),
            fmt(d.biayaPensiunSetahun),
            fmt(d.pkp),
            fmt(d.pphTerutangSetahunP17),
            fmt(d.pphDipotongJanNov),
            fmt(d.pphPenyesuaianAkhir),
            d.statusNPWP.includes("Sementara") ? "NIK Sementara (Validasi)" : "NIK Terpadan Valid",
          ]),
          totalRow: [
            {
              colSpan: 8,
              text: `TOTAL AKUMULASI TAHUNAN (${filteredDataTahunan.length} WP)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoSetahun, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.biayaPensiunSetahun, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pkp, 0)),
              align: "right",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0)),
              align: "right",
              color: "#1E40AF",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphDipotongJanNov, 0)),
              align: "right",
              color: "#059669",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphPenyesuaianAkhir, 0)),
              align: "right",
              color: "#7C3AED",
            },
            { text: "100% Terpadan Valid", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    } else if (targetTab === "komparasi_audit") {
      setPreview({
        title: `Laporan Audit Komparatif: PPh 21 Metode TER vs PPh Pasal 17 — ${filterBulanKomparasi}`,
        subtitle: `Alat Uji Petik Verifikasi dan Audit Kepatuhan Perpajakan PT ASABRI (${filteredDataKomparasi.length} Peserta Terpilih)`,
        type: "table",
        fileName: `Audit_Komparasi_TER_vs_Pasal17_${filterBulanKomparasi.replace(/\s+/g, "_")}_2026.xlsx`,
        content: {
          columns: [
            "No",
            "NIK",
            "NRP",
            "NOPENS",
            "Peserta Pensiun",
            "Satker",
            "Masa Pajak",
            "Penghasilan Bruto",
            "PPh 21 Metode Baru (TER / Penyesuaian)",
            "PPh 21 Metode Lama (Pasal 17 Rata2)",
            "Selisih (Baru - Lama)",
            "% Selisih",
            "Status Evaluasi Audit",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "left",
            "left",
            "center",
            "right",
            "right",
            "right",
            "right",
            "center",
            "center",
          ],
          rows: filteredDataKomparasi.map((d, i) => [
            i + 1,
            d.nik,
            d.nrp,
            d.nopens,
            d.nama,
            d.satker,
            d.masaPajakLabel,
            fmt(d.brutoEvaluasi),
            fmt(d.pphBaruEvaluasi),
            fmt(d.pphLamaEvaluasi),
            (d.selisihEvaluasi > 0 ? "+" : "") + fmt(d.selisihEvaluasi),
            d.selisihPersenStr,
            d.statusEvaluasi,
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL EVALUASI AUDIT (${filteredDataKomparasi.length} PESERTA)`,
              align: "left",
            },
            {
              text: fmt(totalBrutoKomparasi),
              align: "right",
            },
            {
              text: fmt(totalPPhBaruKomparasi),
              align: "right",
              color: "#1D4ED8",
            },
            {
              text: fmt(totalPPhLamaKomparasi),
              align: "right",
              color: "#475569",
            },
            {
              text: (totalSelisihKomparasi > 0 ? "+" : "") + fmt(totalSelisihKomparasi),
              align: "right",
              color: totalSelisihKomparasi === 0 ? "#059669" : totalSelisihKomparasi > 0 ? "#DC2626" : "#059669",
            },
            { text: "—", align: "center" },
            { text: isKomparasiTahunan ? "100% Imbang (Audit Sesuai)" : "Tervalidasi", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataKomparasi.length,
        },
      });
    } else if (targetTab === "validasi_nik" || targetTab === "tindak_lanjut_nik") {
      setPreview({
        title: "Daftar Monitoring NIK Sementara & Tindak Lanjut Pemadanan Dukcapil — Divisi Kepesertaan",
        subtitle: "Laporan Rekonsiliasi NIK Anomali & Monitoring Progres Sinkronisasi SIAK Kemendagri / Coretax DJP TA 2026",
        type: "table",
        fileName: "Monitoring_NIK_Sementara_Tindak_Lanjut_Kepesertaan_2026.xlsx",
        content: {
          columns: [
            "No",
            "NIK Tercatat (Anomali)",
            "NIK Sementara (Sistem)",
            "NRP",
            "NOPENS",
            "Nama Peserta Pensiun",
            "Satker",
            "Diagnosa Masalah Dukcapil",
            "Status Tindak Lanjut Kepesertaan",
            "PIC Kepesertaan",
            "No. Nota Dinas Keuangan",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "center",
            "left",
            "left",
            "left",
            "center",
            "left",
            "center",
          ],
          rows: masterPesertaPajak
            .filter((p) => !p.nikValid)
            .map((d, i) => [
              i + 1,
              d.nikAsli || d.nik,
              d.nikSementara || d.nik,
              d.nrp,
              d.nopens,
              d.nama,
              `${d.satker} (${d.unor})`,
              d.diagnosaNIK || d.kategoriAnomali,
              d.statusTindakLanjut,
              d.picKepesertaan || "Divisi Kepesertaan",
              d.noSuratPengantar,
            ]),
          totalRow: [
            {
              colSpan: 8,
              text: `TOTAL PESERTA NIK SEMENTARA DALAM TINDAK LANJUT (${masterPesertaPajak.filter((p) => !p.nikValid).length} PESERTA)`,
              align: "left",
            },
            {
              text: "Diproses Div. Kepesertaan",
              align: "center",
              color: "#1D4ED8",
            },
            {
              text: "Monitoring Div. Keuangan",
              align: "center",
              color: "#059669",
            },
            { text: "—", align: "center" },
          ],
          totalRows: masterPesertaPajak.filter((p) => !p.nikValid).length,
        },
      });

    } else {
      setPreview({
        title: "Penerbitan Digital Bukti Potong 1721-A2 & Integrasi Coretax DJP",
        subtitle: "Monitoring Distribusi Digital Bukti Potong ke Peserta Pensiun (Tanpa Sanksi 20%)",
        type: "table",
        fileName: "Log_Distribusi_Bukti_Potong_1721A2.xlsx",
        content: {
          columns: [
            "No",
            "NIK Dukcapil",
            "NRP",
            "NOPENS",
            "Nama Peserta",
            "NPWP / Status Coretax",
            "Masa Perolehan",
            "PPh 21 Terutang (A2)",
            "Kanal Akses",
          ],
          alignments: [
            "center",
            "center",
            "center",
            "center",
            "left",
            "center",
            "center",
            "right",
            "center",
          ],
          rows: filteredDataTahunan.map((d, i) => [
            i + 1,
            d.nik,
            d.nrp,
            d.nopens,
            d.nama,
            d.npwp,
            d.masaPerolehanStr,
            fmt(d.pphTerutangSetahunP17),
            "Portal Peserta / AMA",
          ]),
          totalRow: [
            {
              colSpan: 7,
              text: `TOTAL DOKUMEN 1721-A2 (${filteredDataTahunan.length} DOKUMEN)`,
              align: "left",
            },
            {
              text: fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0)),
              align: "right",
              color: "#1E293B",
            },
            { text: "100% Siap Akses", align: "center", color: "#059669" },
          ],
          totalRows: filteredDataTahunan.length,
        },
      });
    }
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* MODAL PEMUTAKHIRAN NIK (HASIL KLARIFIKASI KEPESERTAAN) */}
      {modalUpdateNIK && (
        <ModalUpdateNIK
          data={modalUpdateNIK}
          onClose={() => setModalUpdateNIK(null)}
          onSave={handleSaveUpdateNIK}
        />
      )}

      {/* MODAL NOTA DINAS PENGANTAR KE DIVISI KEPESERTAAN */}
      {modalNotaDinas && (
        <ModalNotaDinas
          listPesertaAnomali={modalNotaDinas}
          onClose={() => setModalNotaDinas(null)}
          onSendElectrically={() => {
            setToastNotification({
              type: "success",
              message: "Nota Dinas berhasil diteruskan secara elektronik ke Divisi Kepesertaan!",
            });
            setTimeout(() => setToastNotification(null), 4000);
          }}
        />
      )}

      {/* MODAL RIWAYAT LOG TIKET TINDAK LANJUT */}
      {modalRiwayatTiket && (
        <ModalRiwayatTiket
          data={modalRiwayatTiket}
          onClose={() => setModalRiwayatTiket(null)}
          onOpenUpdateModal={(p) => setModalUpdateNIK(p)}
        />
      )}

      {/* MODAL DETAIL MONITORING NIK SEMENTARA & TINDAK LANJUT KEPESERTAAN */}
      {modalDetailMonitoring && (
        <ModalDetailMonitoringNIK
          data={modalDetailMonitoring}
          onClose={() => setModalDetailMonitoring(null)}
          onOpenRiwayatTiket={(p) => {
            setModalDetailMonitoring(null);
            setModalRiwayatTiket(p);
          }}
        />
      )}


      {/* TOAST NOTIFICATION */}
      {toastNotification && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 2000,
            background: toastNotification.type === "success" ? "#065F46" : "#1E40AF",
            color: "#FFFFFF",
            padding: "12px 18px",
            borderRadius: 8,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} color="#A7F3D0" />
          <span>{toastNotification.message}</span>
        </div>
      )}

      {/* MODAL AUDIT TRAIL / RINCIAN KALKULASI PESERTA */}
      {detailKalkulasi && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 16,
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setDetailKalkulasi(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              width: "100%",
              maxWidth: 720,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              border: "1px solid #CBD5E1",
              overflow: "hidden",
            }}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                    Rincian Perhitungan Pajak PPh 21
                  </span>
                  <Badge color={detailKalkulasi.isDapemTerakhir ? "purple" : detailKalkulasi.isPascaBerhenti ? "gray" : "blue"}>
                    {detailKalkulasi.isDapemTerakhir ? "Pasal 17 (Dapem Terakhir)" : detailKalkulasi.isPascaBerhenti ? "Non-Aktif" : isSingleMonth ? "TER Bulanan" : `TER Periode (${detailKalkulasi.bulanAktifDalamPeriode} Bln)`}
                  </Badge>
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                  Masa Pajak: <strong>{labelPeriodeLengkap}</strong> • Dasar Regulasi: <strong>BRD PJK 01 &amp; PMK No. 168 Tahun 2023</strong>
                </div>
              </div>
              <button
                onClick={() => setDetailKalkulasi(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Isi Modal */}
            <div style={{ padding: 20, overflowY: "auto", flex: 1, fontSize: 12.5 }}>
              {/* Profil Peserta Card */}
              <div
                style={{
                  background: "#F1F5F9",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Nama Peserta Pensiun</div>
                  <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 13 }}>{detailKalkulasi.nama}</div>
                  <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600, marginTop: 2 }}>
                    Satker: {detailKalkulasi.satker} ({detailKalkulasi.unor})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>NRP / NIP</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace", color: "#1E293B" }}>{detailKalkulasi.nrp}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>MAK: {detailKalkulasi.mak}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>NOPENS (No. Pensiun)</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace", color: COLORS.blueDark }}>{detailKalkulasi.nopens}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>Dapem: {detailKalkulasi.dapem}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>NIK Dukcapil (16-Digit)</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace", color: "#1E293B" }}>{detailKalkulasi.nik}</div>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>{detailKalkulasi.statusNIK}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Status NPWP &amp; PTKP</div>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{detailKalkulasi.kodeJiwa} ({fmt(detailKalkulasi.ptkp)})</div>
                  <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600 }}>{detailKalkulasi.statusNPWP}</div>
                </div>
              </div>

              {/* Tunjuk Silang Indicator */}
              {detailKalkulasi.tunjukSilang && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: detailKalkulasi.isBebasPajakTunjukSilang ? "#FFFBEB" : "#EFF6FF",
                    border: `1px solid ${detailKalkulasi.isBebasPajakTunjukSilang ? "#FDE68A" : "#BFDBFE"}`,
                    borderRadius: 6,
                    marginBottom: 14,
                    fontSize: 12,
                    color: detailKalkulasi.isBebasPajakTunjukSilang ? "#92400E" : "#1E40AF",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge color={detailKalkulasi.isBebasPajakTunjukSilang ? "amber" : "blue"}>
                      <Link2 size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />
                      {detailKalkulasi.isBebasPajakTunjukSilang ? "Tunjuk Silang (Bebas PPh 21)" : "Tunjuk Silang (NOPENS Utama)"}
                    </Badge>
                    <span>
                      {detailKalkulasi.isBebasPajakTunjukSilang
                        ? `Pajak PPh 21 KOSONG (Rp 0) — Seluruh pemotongan PPh 21 telah disatukan pada NOPENS Utama (${detailKalkulasi.nopensPasangan})`
                        : `NOPENS Utama — Seluruh pemotongan PPh 21 dipusatkan di NOPENS ini. NOPENS Pasangan (${detailKalkulasi.nopensPasangan}) dibebaskan dari pajak.`}
                    </span>
                  </div>
                  <span
                    title={detailKalkulasi.sumberPensiunGanda}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: detailKalkulasi.isBebasPajakTunjukSilang ? "#B45309" : "#2563EB",
                      cursor: "help",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    <Info size={12} /> Info Pensiun Ganda
                  </span>
                </div>
              )}

              {/* Status Peserta Berhenti Compact Indicator with Tooltip */}
              {detailKalkulasi.isDapemTerakhir && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    marginBottom: 14,
                    fontSize: 12,
                    color: "#334155",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge color="purple">Dapem Terakhir</Badge>
                    <span style={{ fontWeight: 600 }}>
                      Masa {detailKalkulasi.bulanBerhentiNama} 2026 ({detailKalkulasi.alasanBerhenti})
                    </span>
                  </div>
                  <span
                    title="Ketentuan Khusus Peserta Berhenti (BRD PJK 01.1 & Line 566): Pemotongan PPh 21 pada Dapem Terakhir menggunakan Tarif PPh Pasal 17 setahun dikurangi kredit PPh TER bulan-bulan sebelumnya."
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#64748B",
                      cursor: "help",
                      fontWeight: 600,
                    }}
                  >
                    <Info size={12} color="#7C3AED" /> Info Ketentuan P17
                  </span>
                </div>
              )}

              {detailKalkulasi.isPascaBerhenti && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    marginBottom: 14,
                    fontSize: 12,
                    color: "#334155",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge color="gray">Dapem Ditutup</Badge>
                    <span>
                      Berhenti menerima pensiun sejak <strong>{detailKalkulasi.bulanBerhentiNama} 2026</strong> ({detailKalkulasi.alasanBerhenti})
                    </span>
                  </div>
                  <span
                    title="Status Pasca Berhenti: Hak pensiun telah berakhir. Pada masa pajak berjalan penghasilan bruto dan potongan pajak bernilai Rp 0."
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#64748B",
                      cursor: "help",
                      fontWeight: 600,
                    }}
                  >
                    <Info size={12} color="#94A3B8" /> Info Non-Aktif
                  </span>
                </div>
              )}

              {/* Rincian Potongan Tiap Bulan Jika Periode > 1 Bulan */}
              {!isSingleMonth && detailKalkulasi.monthlyBreakdown && detailKalkulasi.monthlyBreakdown.length > 1 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                    Rincian Pemotongan Pajak Tiap Bulan dalam {labelPeriode}:
                  </div>
                  <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                          <th style={{ padding: "6px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>Masa</th>
                          <th style={{ padding: "6px 10px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Bulan</th>
                          <th style={{ padding: "6px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto</th>
                          <th style={{ padding: "6px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong</th>
                          <th style={{ padding: "6px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Status</th>
                          <th style={{ padding: "6px 10px", textAlign: "left" }}>Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailKalkulasi.monthlyBreakdown.map((mb, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: "1px solid #F1F5F9",
                              background: mb.pphBaru < 0
                                ? "#F0FDF4"
                                : mb.status.includes("Dapem Terakhir")
                                ? "#FAF5FF"
                                : mb.status.includes("Non-Aktif")
                                ? "#F8FAFC"
                                : idx % 2 === 1
                                ? "#F8FAFC"
                                : "#FFFFFF",
                            }}
                          >
                            <td style={{ padding: "5px 8px", textAlign: "center", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                              {String(mb.bulanIdx).padStart(2, "0")}
                            </td>
                            <td style={{ padding: "5px 10px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                              {mb.namaBulan}
                            </td>
                            <td style={{ padding: "5px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                              {fmt(mb.bruto)}
                            </td>
                            <td
                              style={{
                                padding: "5px 10px",
                                textAlign: "right",
                                fontFamily: "monospace",
                                fontWeight: 700,
                                color: mb.pphBaru < 0 ? "#059669" : mb.pphBaru > 0 ? "#1D4ED8" : "#64748B",
                                borderRight: "1px solid #E2E8F0",
                              }}
                            >
                              {mb.pphBaru < 0 ? `- ${fmt(Math.abs(mb.pphBaru))}` : fmt(mb.pphBaru)}
                            </td>
                            <td style={{ padding: "5px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                              <Badge color={mb.badgeColor}>{mb.status}</Badge>
                            </td>
                            <td style={{ padding: "5px 10px", color: "#475569", fontSize: 11 }}>
                              {mb.keterangan}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                          <td colSpan={2} style={{ padding: "6px 10px", borderRight: "1px solid #CBD5E1" }}>
                            TOTAL PERIODE ({detailKalkulasi.bulanAktifDalamPeriode} Bulan Aktif)
                          </td>
                          <td style={{ padding: "6px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                            {fmt(detailKalkulasi.brutoPeriode)}
                          </td>
                          <td
                            style={{
                              padding: "6px 10px",
                              textAlign: "right",
                              fontFamily: "monospace",
                              color: detailKalkulasi.pphDipotongPeriode < 0 ? "#059669" : "#1D4ED8",
                              borderRight: "1px solid #CBD5E1",
                            }}
                          >
                            {fmt(detailKalkulasi.pphDipotongPeriode)}
                          </td>
                          <td colSpan={2} style={{ padding: "6px 10px", color: "#64748B", fontSize: 11 }}>
                            Akumulasi Potongan Periode
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tabel Tahapan Perhitungan Matematis */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B", fontSize: 11.5, textTransform: "uppercase" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", width: 40 }}>No</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Komponen Penghasilan &amp; Kalkulasi</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Dasar Rumus / Aturan</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", width: 160 }}>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>1</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Penghasilan Bruto ({labelPeriode})</td>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>
                        {isSingleMonth
                          ? "Gaji Pokok + Seluruh Tunjangan"
                          : `Total Bruto ${detailKalkulasi.bulanAktifDalamPeriode} Bulan Aktif`}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                        {fmt(detailKalkulasi.brutoPeriode)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>2</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>
                        Akumulasi Penghasilan Bruto (Jan s.d. {filterBulanSampai})
                      </td>
                      <td style={{ padding: "8px 12px", color: "#64748B" }}>
                        {detailKalkulasi.isDapemTerakhir || detailKalkulasi.isPascaBerhenti
                          ? `${detailKalkulasi.bulanBerhentiIdx} Bulan Penerimaan Pensiun`
                          : `${eMonth} Bulan Penerimaan Pensiun`}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B" }}>
                        {fmt(detailKalkulasi.kumulatifBruto)}
                      </td>
                    </tr>

                    {/* Khusus NOPENS Pasangan Tunjuk Silang */}
                    {detailKalkulasi.isBebasPajakTunjukSilang ? (
                      <>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>3</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Ketentuan Tunjuk Silang (Pensiun Ganda)</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Pemotongan PPh 21 Dipusatkan di NOPENS Utama ({detailKalkulasi.nopensPasangan})</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#D97706", fontWeight: 700 }}>
                            Bebas PPh 21
                          </td>
                        </tr>
                        <tr style={{ background: "#FFFBEB", fontWeight: 800 }}>
                          <td style={{ padding: "10px 12px", color: "#92400E" }}>4</td>
                          <td colSpan={2} style={{ padding: "10px 12px", color: "#92400E", fontSize: 13 }}>
                            PPh 21 yang Dipotong pada {labelPeriode} (NOPENS Pasangan)
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 14, color: "#92400E" }}>
                            Rp 0 (Pajak Kosong)
                          </td>
                        </tr>
                      </>
                    ) : (detailKalkulasi.isDapemTerakhir || detailKalkulasi.isPascaBerhenti) ? (
                      <>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>3</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Pengurang: Biaya Pensiun Prorata</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>5% × Bruto (Maks Rp 200.000 × {detailKalkulasi.bulanBerhentiIdx} Bulan)</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#DC2626" }}>
                            - {fmt(detailKalkulasi.biayaPensiunKumulatif)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>4</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Penghasilan Netto Kumulatif</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Bruto Kumulatif - Biaya Pensiun</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                            {fmt(detailKalkulasi.nettoKumulatif)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>5</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>PTKP Sesuai Kode Jiwa ({detailKalkulasi.kodeJiwa})</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Dasar PTKP Setahun Penuh</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#64748B" }}>
                            {fmt(detailKalkulasi.ptkp)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>6</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0F172A" }}>Penghasilan Kena Pajak (PKP)</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Netto Kumulatif - PTKP</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                            {fmt(detailKalkulasi.pkpKumulatif)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>7</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700, color: "#5B21B6" }}>PPh Terutang PPh Pasal 17 (Tahunan)</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>Tarif Progresif UU HPP (5%, 15%, 25%, 30%)</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#5B21B6" }}>
                            {fmt(detailKalkulasi.pphP17Terutang)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>8</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#059669" }}>
                            Kredit PPh 21 TER yang Telah Dipotong Sebelumnya
                          </td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>
                            {detailKalkulasi.bulanBerhentiIdx - 1} Bulan × {fmt(detailKalkulasi.brutoBulanan * detailKalkulasi.tarifTER)}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#059669" }}>
                            - {fmt(detailKalkulasi.pphTERSebelumnya)}
                          </td>
                        </tr>
                        <tr style={{ background: detailKalkulasi.pphDipotongPeriode < 0 ? "#ECFDF5" : "#EDE9FE", fontWeight: 800 }}>
                          <td style={{ padding: "10px 12px", color: detailKalkulasi.pphDipotongPeriode < 0 ? "#065F46" : "#5B21B6" }}>9</td>
                          <td colSpan={2} style={{ padding: "10px 12px", color: detailKalkulasi.pphDipotongPeriode < 0 ? "#065F46" : "#4C1D95", fontSize: 13 }}>
                            {detailKalkulasi.pphDipotongPeriode < 0
                              ? `Posisi PPh 21 ${labelPeriode}`
                              : `PPh 21 yang Dipotong ${labelPeriode}`}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 14, color: detailKalkulasi.pphDipotongPeriode < 0 ? "#059669" : "#4338CA" }}>
                            {detailKalkulasi.isDapemTerakhir ? (
                              detailKalkulasi.pphDipotongPeriode < 0 ? (
                                <div>
                                  <span>- {fmt(Math.abs(detailKalkulasi.pphDipotongPeriode))}</span>
                                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#065F46", marginTop: 2 }}>
                                    Lebih Bayar (Wajib Dikembalikan ke Peserta)
                                  </div>
                                </div>
                              ) : (
                                fmt(detailKalkulasi.pphDipotongPeriode)
                              )
                            ) : (
                              "Rp 0 (Non-Aktif)"
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>3</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: "#0F172A" }}>Kategori &amp; Tarif TER Bulanan</td>
                          <td style={{ padding: "8px 12px", color: "#64748B" }}>{detailKalkulasi.kategoriTER} (Status {detailKalkulasi.kodeJiwa})</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#059669" }}>
                            {(detailKalkulasi.tarifTER * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr style={{ background: "#EFF6FF", fontWeight: 800 }}>
                          <td style={{ padding: "10px 12px", color: "#1E40AF" }}>4</td>
                          <td colSpan={2} style={{ padding: "10px 12px", color: "#1E3A8A", fontSize: 13 }}>
                            PPh 21 yang Dipotong pada {labelPeriode}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontSize: 14, color: "#1D4ED8" }}>
                            {fmt(detailKalkulasi.pphDipotongPeriode)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Informasi Khusus Lebih Bayar Peserta Berhenti (Compact with Tooltip) */}
              {detailKalkulasi.pphDipotongPeriode < 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "#059669" }}>
                      Kompensasi Lebih Bayar: {fmt(Math.abs(detailKalkulasi.pphDipotongPeriode))}
                    </span>
                  </div>
                  <span
                    title={`PMK No. 168/2023 Ps. 17(3) & BRD PJK 01.1: Akumulasi PPh TER (${fmt(detailKalkulasi.pphTERSebelumnya)}) melebihi PPh P17 setahun (${fmt(detailKalkulasi.pphP17Terutang)}). Kelebihan wajib dikembalikan ASABRI pada slip Dapem berjalan dan mengurangi setoran kas negara.`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#059669",
                      background: "#F0FDF4",
                      border: "1px solid #A7F3D0",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "help",
                      fontWeight: 600,
                    }}
                  >
                    <Info size={12} color="#059669" /> Ketentuan LB
                  </span>
                </div>
              )}

              {/* Status Pemadanan Regulasi Footer Compact Badge with Tooltip */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <span
                  title="PMK No. 168/2023 & UU HPP: Seluruh perhitungan menggunakan Tarif Normal 100% (sanksi kenaikan 20% non-NPWP resmi dihapus). Terhubung pemadanan NIK 16-digit Dukcapil dan Coretax DJP."
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11.5,
                    color: "#475569",
                    cursor: "help",
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  Kepatuhan PMK No. 168/2023 (Tarif Normal 100% Bebas Denda 20%)
                  <Info size={11} color="#94A3B8" />
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>Data tervalidasi Coretax DJP</span>
              </div>
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                background: "#F8FAFC",
              }}
            >
              <Btn variant="ghost" size="sm" onClick={() => setDetailKalkulasi(null)}>
                Tutup
              </Btn>
              <Btn
                size="sm"
                onClick={() => {
                  setPreview({
                    title: `Lembar Audit PPh 21 — ${detailKalkulasi.nama}`,
                    subtitle: `${labelPeriodeLengkap} • Metode: ${detailKalkulasi.metodePerhitungan}`,
                    type: "table",
                    fileName: `Audit_Pajak_${detailKalkulasi.nrp}_${filterBulanDari}_sd_${filterBulanSampai}_${filterTahunTER}.pdf`,
                    content: {
                      columns: ["Komponen Kalkulasi", "Nilai / Keterangan"],
                      rows: [
                        ["Nama Peserta", detailKalkulasi.nama],
                        ["NRP / NIP", detailKalkulasi.nrp],
                        ["NOPENS (No. Pensiun)", detailKalkulasi.nopens],
                        ["Satker / Unor", `${detailKalkulasi.satker} • ${detailKalkulasi.unor}`],
                        ["NIK Dukcapil", detailKalkulasi.nik],
                        ["Kode Jiwa / PTKP", `${detailKalkulasi.kodeJiwa} (${fmt(detailKalkulasi.ptkp)})`],
                        ["Status NPWP (PMK 168)", detailKalkulasi.statusNPWP],
                        [`Penghasilan Bruto (${labelPeriode})`, fmt(detailKalkulasi.brutoPeriode)],
                        [`Penghasilan Bruto Kumulatif (s.d. ${filterBulanSampai})`, fmt(detailKalkulasi.kumulatifBruto)],
                        ["Metode Perhitungan", detailKalkulasi.metodePerhitungan],
                        ["Tarif yang Berlaku", detailKalkulasi.tarifBulanIniStr],
                        ["PPh Terutang P17 (Khusus Berhenti)", detailKalkulasi.isDapemTerakhir ? fmt(detailKalkulasi.pphP17BulanIni) : "—"],
                        ["Kredit PPh TER Sebelumnya", detailKalkulasi.isDapemTerakhir ? fmt(detailKalkulasi.pphTERSebelumnya) : "—"],
                        [`PPh 21 Dipotong (${labelPeriode})`, fmt(detailKalkulasi.pphDipotongPeriode)],
                      ],
                      totalRows: 13,
                    },
                  });
                }}
              >
                <Download size={13} /> Ekspor Lembar Audit
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ENTERPRISE TAB BAR WITH INTEGRATED CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid #CBD5E1`,
          marginBottom: 16,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: -2, flexWrap: "wrap" }}>
          {tabsConfig.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 16px",
                  border: "none",
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#0F172A" : "#475569",
                  borderBottom: isActive ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                  borderTop: isActive ? `1px solid #CBD5E1` : "1px solid transparent",
                  borderLeft: isActive ? `1px solid #CBD5E1` : "1px solid transparent",
                  borderRight: isActive ? `1px solid #CBD5E1` : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#F1F5F9";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ color: isActive ? COLORS.blue : "#64748B", display: "flex" }}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: isActive ? "#EFF6FF" : "#F1F5F9",
                      color: isActive ? COLORS.blue : "#64748B",
                      padding: "1px 6px",
                      borderRadius: 10,
                      border: `1px solid ${isActive ? "#BFDBFE" : "#E2E8F0"}`,
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER CONTROLS TOOLBAR (FOR TABS 2 TO 5) */}
      {tab !== "ter_jan_nov" && tab !== "validasi_nik" && tab !== "tindak_lanjut_nik" && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 8,
            padding: "12px 16px",
            border: "1px solid #E2E8F0",
            marginBottom: 16,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          {tab === "komparasi_audit" && (
            <Select
              label="Masa Pajak (Bulan)"
              value={filterBulanKomparasi}
              onChange={setFilterBulanKomparasi}
              options={OPSI_BULAN_KOMPARASI}
              minW={210}
            />
          )}
          <Select
            label="Satker / Unor"
            value={filterSatker}
            onChange={setFilterSatker}
            options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI", "ASN Kemenhan", "ASN Polri"]}
            minW={130}
          />
          <Select
            label="Tunjuk Silang"
            value={filterTunjukSilang}
            onChange={setFilterTunjukSilang}
            options={["Semua", "Ya", "Tidak"]}
            minW={120}
          />

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11.5, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>
              Pencarian Peserta (Nama / NIK / NRP / NOPENS)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Cari nama, NIK, NRP, atau NOPENS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6.5px 10px 6.5px 30px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: REKAP PERHITUNGAN PPH 21 BULANAN / PERIODE (BRD 4.5.21 & PJK 01) */}
      {/* ========================================================================= */}
      {tab === "ter_jan_nov" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 1. TOP METRIC CARDS (Di Atas Filter) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 10,
            }}
          >
            {/* Card 1: Total Peserta */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Total Peserta</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{totalPesertaBulanIni} Peserta</div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>
                {labelPeriodeLengkap}
              </div>
            </div>

            {/* Card 2: Total Bruto */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Total Bruto ({labelPeriode})</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>
                {fmt(totalBrutoBulanIni)}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>{labelPeriodeLengkap}</div>
            </div>

            {/* Card 3: PPh 21 Dipotong */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>PPh 21 Dipotong ({labelPeriode})</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: totalPPhDipotongBulanIni >= 0 ? "#1D4ED8" : "#059669", fontFamily: "monospace", marginTop: 2 }}>
                {fmt(totalPPhDipotongBulanIni)}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Total potongan {labelPeriodeLengkap}</div>
            </div>

            {/* Card 4: PPh Kumulatif */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>PPh Kumulatif (s.d. {filterBulanSampai})</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>
                {fmt(totalPPhKumulatifBulanIni)}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Jan s.d. {filterBulanSampai} {filterTahunTER}</div>
            </div>

            {/* Card 5: Posisi Lebih Bayar */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{ fontSize: 11, color: "#64748B", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}
                  title="PMK 168/2023 Ps. 17(3): Nilai Lebih Bayar wajib dikembalikan langsung kepada peserta pada slip Dapem bulan berjalan dan mengurangi setoran kas negara."
                >
                  Posisi Lebih Bayar (LB)
                  <Info size={11} color="#94A3B8" style={{ cursor: "help" }} />
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: totalLebihBayarBulanIni > 0 ? "#059669" : "#64748B", fontFamily: "monospace", marginTop: 2 }}>
                {totalLebihBayarBulanIni > 0 ? `- ${fmt(totalLebihBayarBulanIni)}` : "Nihil (Rp 0)"}
              </div>
              <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>
                {totalLebihBayarBulanIni > 0
                  ? `${jumlahPesertaLebihBayar} WP (Lebih Bayar)`
                  : `TER: ${totalPesertaTER} • P17: ${totalPesertaP17Berhenti}`}
              </div>
            </div>
          </div>

          {/* 2. FILTER TOOLBAR: 2 Field Periode, 1 Field Tahun, 1 Search Bar (Label di Atas) */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 8,
              padding: "14px 16px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "flex-end",
              marginBottom: 16,
            }}
          >
            {/* Field 1: Dari Bulan */}
            <div style={{ flex: "0 0 160px", minWidth: 140 }}>
              <Select
                label="Dari Bulan"
                value={filterBulanDari}
                onChange={(val) => {
                  setFilterBulanDari(val);
                  const sIdx = BULAN_OPTIONS.indexOf(val);
                  const eIdx = BULAN_OPTIONS.indexOf(filterBulanSampai);
                  if (sIdx > eIdx) {
                    setFilterBulanSampai(val);
                  }
                }}
                options={BULAN_OPTIONS}
                minW="100%"
              />
            </div>

            {/* Field 2: Sampai Bulan */}
            <div style={{ flex: "0 0 160px", minWidth: 140 }}>
              <Select
                label="Sampai Bulan"
                value={filterBulanSampai}
                onChange={(val) => {
                  setFilterBulanSampai(val);
                  const sIdx = BULAN_OPTIONS.indexOf(filterBulanDari);
                  const eIdx = BULAN_OPTIONS.indexOf(val);
                  if (eIdx < sIdx) {
                    setFilterBulanDari(val);
                  }
                }}
                options={BULAN_OPTIONS}
                minW="100%"
              />
            </div>

            {/* Field 3: Tahun */}
            <div style={{ flex: "0 0 120px", minWidth: 100 }}>
              <Select
                label="Tahun"
                value={filterTahunTER}
                onChange={(val) => setFilterTahunTER(val)}
                options={TAHUN_OPTIONS}
                minW="100%"
              />
            </div>

            {/* Field 4: Search Bar */}
            <div style={{ flex: "1 1 260px", minWidth: 220 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  color: COLORS.gray500,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Pencarian Peserta
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Cari nama, NIK, NRP, NOPENS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 32px 8px 34px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray200}`,
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.gray900,
                    background: COLORS.gray50,
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.15s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.blue;
                    e.target.style.background = "#FFFFFF";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.gray200;
                    e.target.style.background = COLORS.gray50;
                  }}
                />
                <Search
                  size={14}
                  color={COLORS.gray400}
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: COLORS.gray400,
                      cursor: "pointer",
                      padding: 3,
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Hapus pencarian"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. TABLE SECTION */}
          <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
            {/* Section Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  Rekapitulasi PPh 21 — {labelPeriodeLengkap}
                </h3>
                <span
                  title="PMK No. 168/2023 & BRD PJK 01: Menerapkan tarif TER untuk peserta reguler aktif dan tarif PPh Pasal 17 pada Dapem terakhir peserta berhenti. Sanksi kenaikan 20% non-NPWP telah resmi dihapuskan (tarif standar 100% normal)."
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    padding: "2.5px 8px",
                    borderRadius: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "help",
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={13} color="#059669" />
                  PMK 168/2023 Compliant
                  <Info size={11} color="#94A3B8" />
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Btn variant="primary" size="sm" onClick={() => handleExportTab("ter_jan_nov")}>
                  <Download size={13} />
                  <span>Ekspor Rekap Pajak (Excel)</span>
                </Btn>
              </div>
            </div>

            {filteredDataBulanan.length === 0 ? (
              <NoData message="Tidak ada data peserta pensiun yang cocok dengan pencarian." />
            ) : (
              <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NOPENS</th>
                      <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                      <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Status PTKP</th>
                      <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto ({labelPeriode})</th>
                      <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Kumulatif (Jan–{filterBulanSampai})</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Metode Perhitungan</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Tarif Berlaku</th>
                      <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 TER</th>
                      <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh P17 (Berhenti)</th>
                      <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong ({labelPeriode})</th>
                      <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Tunjuk Silang</th>
                      <th style={{ padding: "9px 10px", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataBulanan.map((d, i) => (
                      <tr
                        key={d.id}
                        style={{
                          borderBottom: "1px solid #E2E8F0",
                          background: d.isLebihBayar
                            ? "#F0FDF4"
                            : d.isDapemTerakhir
                            ? "#FAF5FF"
                            : d.isPascaBerhenti
                            ? "#F8FAFC"
                            : i % 2 === 1
                            ? "#F8FAFC"
                            : "#FFFFFF",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = d.isLebihBayar ? "#DCFCE7" : "#F1F5F9")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = d.isLebihBayar
                            ? "#F0FDF4"
                            : d.isDapemTerakhir
                            ? "#FAF5FF"
                            : d.isPascaBerhenti
                            ? "#F8FAFC"
                            : i % 2 === 1
                            ? "#F8FAFC"
                            : "#FFFFFF")
                        }
                      >
                        <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                          {i + 1}
                        </td>
                        <td style={{ padding: "8px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                          {d.mak}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          <div style={{ fontWeight: !d.nikValid ? 700 : 400, color: !d.nikValid ? "#DC2626" : "#334155" }}>
                            {d.nik}
                          </div>
                          {!d.nikValid && (
                            <div style={{ marginTop: 2 }}>
                              <button
                                onClick={() => {
                                  setTab("validasi_nik");
                                  setSearchQuery(d.nik);
                                }}
                                title={`NIK Tidak Valid: ${d.diagnosaNIK || d.statusNIK}. Masuk List Tindak Lanjut Divisi Kepesertaan`}
                                style={{
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  background: "#FEF2F2",
                                  color: "#B91C1C",
                                  padding: "1px 6px",
                                  borderRadius: 4,
                                  border: "1px solid #FECACA",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 3,
                                }}
                              >
                                <AlertTriangle size={9} /> TL Kepesertaan
                              </button>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nrp}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nopens}
                        </td>
                        <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                          <div>{d.nama}</div>
                          <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 500 }}>{d.satker} ({d.unor})</div>
                        </td>
                        <td style={{ padding: "8px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ fontWeight: 700, color: "#0F172A" }}>{d.kodeJiwa}</span>
                          <div style={{ fontSize: 10, color: "#64748B" }}>{fmt(d.ptkp)}</div>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: d.brutoPeriode === 0 ? "#94A3B8" : "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                          {fmt(d.brutoPeriode)}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0" }}>
                          {fmt(d.pphKumulatifJanBulanIni)}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={d.isLebihBayar ? "green" : d.isDapemTerakhir ? "purple" : d.isPascaBerhenti ? "gray" : "blue"}>
                            {d.metodePerhitungan}
                          </Badge>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: d.isDapemTerakhir ? "#7C3AED" : "#059669", borderRight: "1px solid #E2E8F0" }}>
                          {d.tarifBulanIniStr}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                          {d.isPascaBerhenti ? "—" : fmt(d.pphTERBulanIni)}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: d.isDapemTerakhir ? "#7C3AED" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                          {d.isDapemTerakhir ? fmt(d.pphP17BulanIni) : "—"}
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>
                          {d.isBebasPajakTunjukSilang ? (
                            <div>
                              <span style={{ color: "#64748B", fontWeight: 700 }}>Rp 0</span>
                              <div style={{ marginTop: 2 }}>
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    background: "#FEF3C7",
                                    color: "#92400E",
                                    padding: "1px 5px",
                                    borderRadius: 4,
                                    border: "1px solid #FDE68A",
                                    display: "inline-block",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  ● Bebas Pajak (TS)
                                </span>
                              </div>
                            </div>
                          ) : d.pphDipotongPeriode < 0 ? (
                            <span style={{ color: "#059669", fontWeight: 800, fontSize: 13 }}>
                              - {fmt(Math.abs(d.pphDipotongPeriode))}
                            </span>
                          ) : (
                            <span style={{ color: d.pphDipotongPeriode > 0 ? (d.isDapemTerakhir ? "#6D28D9" : "#1D4ED8") : "#64748B" }}>
                              {fmt(d.pphDipotongPeriode)}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "8px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          {d.tunjukSilang ? (
                            <span
                              title={d.sumberPensiunGanda}
                              style={{
                                background: d.isBebasPajakTunjukSilang ? "#FEF3C7" : "#EFF6FF",
                                color: d.isBebasPajakTunjukSilang ? "#B45309" : "#1D4ED8",
                                border: `1px solid ${d.isBebasPajakTunjukSilang ? "#FDE68A" : "#BFDBFE"}`,
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <Link2 size={10} /> {d.isBebasPajakTunjukSilang ? "TS: Bebas Pajak" : "TS: NOPENS Utama"}
                            </span>
                          ) : (
                            <span style={{ color: "#94A3B8" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                            <button
                              onClick={() => setDetailKalkulasi(d)}
                              style={{
                                background: "#EFF6FF",
                                border: `1px solid #BFDBFE`,
                                color: COLORS.blue,
                                padding: "3px 8px",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Eye size={12} /> Rincian
                            </button>
                            {!d.nikValid && (
                              <button
                                onClick={() => setModalUpdateNIK(d)}
                                title="Pemutakhiran NIK Hasil Tindak Lanjut"
                                style={{
                                  background: "#FEF2F2",
                                  border: `1px solid #FECACA`,
                                  color: "#B91C1C",
                                  padding: "3px 6px",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 3,
                                }}
                              >
                                <Edit3 size={11} /> Update
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                      <td colSpan={7} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                        TOTAL {labelPeriode.toUpperCase()} {filterTahunTER} ({filteredDataBulanan.length} PESERTA)
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                        {fmt(totalBrutoBulanIni)}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                        {fmt(totalPPhKumulatifBulanIni)}
                      </td>
                      <td colSpan={2} style={{ borderRight: "1px solid #CBD5E1" }} />
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", borderRight: "1px solid #CBD5E1" }}>
                        {fmt(filteredDataBulanan.reduce((a, b) => a + b.pphTERBulanIni, 0))}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", borderRight: "1px solid #CBD5E1" }}>
                        {fmt(filteredDataBulanan.reduce((a, b) => a + b.pphP17BulanIni, 0))}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                        <div style={{ color: totalPPhDipotongBulanIni >= 0 ? "#1D4ED8" : "#059669", fontWeight: 900, fontSize: 13 }}>
                          {fmt(totalPPhDipotongBulanIni)}
                        </div>
                        {totalLebihBayarBulanIni > 0 && (
                          <div style={{ fontSize: 9.5, color: "#059669", fontWeight: 700, marginTop: 1 }}>
                            (Kompensasi LB: -{fmt(totalLebihBayarBulanIni)})
                          </div>
                        )}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REKAP PPH PASAL 17 PENYESUAIAN AKHIR (BRD 4.5.22) */}
      {/* ========================================================================= */}
      {tab === "pasal17_des" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Rekap PPh Pasal 17 Penyesuaian (Dapem Desember &amp; Terakhir)
              </h3>
              <span
                title="Cakupan BRD PJK 01.1:&#10;1. Peserta Reguler: Penyesuaian akhir tahun pada Dapem Masa Desember (akumulasi 12 bln).&#10;2. Peserta Berhenti Sebelum Desember: Penyesuaian dihitung pada Dapem terakhir saat berhenti."
                style={{
                  fontSize: 11,
                  color: "#475569",
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  padding: "2.5px 8px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "help",
                  fontWeight: 600,
                }}
              >
                <Info size={11} color="#64748B" /> Ketentuan Cakupan P17
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11.5, color: "#64748B" }}>
                Dasar Regulasi: <strong>PMK No. 168/2023 Ps. 16 &amp; 17</strong>
              </span>
              <Btn variant="primary" size="sm" onClick={() => handleExportTab("pasal17_des")}>
                <Download size={13} />
                <span>Ekspor Rekap P17 (Excel)</span>
              </Btn>
            </div>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NOPENS</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa Perolehan</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Kumulatif</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Biaya Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PTKP</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PKP</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Terutang (P17)</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh TER Sebelumnya</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Dipotong Terakhir</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status Pelunasan</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataTahunan.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: d.isBerhenti ? "#FAF5FF" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = d.isBerhenti ? "#FAF5FF" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                    }
                  >
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>{d.mak}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>{d.nik}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>{d.nrp}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>{d.nopens}</td>
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                      <div>{d.nama}</div>
                      <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 500 }}>{d.satker} ({d.unor})</div>
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                      <Badge color={d.isBerhenti ? "purple" : "blue"}>
                        {d.bulanDiterima} Bulan ({d.masaPerolehanStr})
                      </Badge>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.brutoSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.biayaPensiunSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.ptkp)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pkp)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphTerutangSetahunP17)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphDipotongJanNov)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>
                      {d.pphPenyesuaianAkhir < 0 ? (
                        <span style={{ color: "#059669", fontWeight: 800, fontSize: 12.5 }}>
                          - {fmt(Math.abs(d.pphPenyesuaianAkhir))}
                        </span>
                      ) : (
                        <span style={{ color: "#7C3AED" }}>{fmt(d.pphPenyesuaianAkhir)}</span>
                      )}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <Badge color={d.pphPenyesuaianAkhir < 0 ? "orange" : "green"}>{d.keteranganPelunasan}</Badge>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                  <td colSpan={7} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                    TOTAL AKUMULASI SELURUH PESERTA ({filteredDataTahunan.length} WP)
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.brutoSetahun, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.biayaPensiunSetahun, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>—</td>
                  <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pkp, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pphTerutangSetahunP17, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pphDipotongJanNov, 0))}
                  </td>
                  <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", fontWeight: 900, borderRight: "1px solid #CBD5E1" }}>
                    {fmt(filteredDataTahunan.reduce((a, b) => a + b.pphPenyesuaianAkhir, 0))}
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "center" }}>
                    <Badge color="green">100% Selaras</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REKAP PPH PASAL 17 TAHUNAN / SPT TAHUNAN (BRD 4.5.23) */}
      {/* ========================================================================= */}
      {tab === "spt_tahunan" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle
            action={
              <Btn variant="primary" size="sm" onClick={() => handleExportTab("spt_tahunan")}>
                <Download size={13} />
                <span>Ekspor SPT Tahunan (Excel)</span>
              </Btn>
            }
          >
            Rekapitulasi PPh Pasal 17 Tahunan (Dasar Pengisian SPT Tahunan PPh 21 PT ASABRI ke DJP)
          </SectionTitle>

          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>MAK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NOPENS</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kode Jiwa</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Bruto Setahun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Biaya Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PKP Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Terutang Setahun</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Kredit PPh TER</th>
                  <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh Pelunasan</th>
                  <th style={{ padding: "9px 10px", textAlign: "center" }}>Status Pemadanan NPWP</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataTahunan.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                  >
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                      {d.mak}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      {d.nik}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      {d.nrp}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      {d.nopens}
                    </td>
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                      <div>{d.nama}</div>
                      <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 500 }}>{d.satker} ({d.unor})</div>
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>
                      {d.kodeJiwa}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                      <Badge color={d.isBerhenti ? "purple" : "gray"}>{d.masaPerolehanStr}</Badge>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.brutoSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.biayaPensiunSetahun)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pkp)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#1E40AF", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphTerutangSetahunP17)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphDipotongJanNov)}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>
                      {fmt(d.pphPenyesuaianAkhir)}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "center" }}>
                      <Badge color={d.statusNPWP.includes("Sementara") ? "yellow" : "green"}>
                        {d.statusNPWP.includes("Sementara") ? "NIK Sementara (Validasi)" : "NIK Terpadan Valid"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PERBANDINGAN & AUDIT TER VS PASAL 17 (BRD 4.5.25) */}
      {/* ========================================================================= */}
      {tab === "komparasi_audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header & Controls */}
          <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <SectionTitle action={<Badge color="blue">Audit Trail &amp; Verifikasi Komparatif</Badge>}>
                  Perbandingan Nilai PPh 21 Metode Baru (TER) vs Metode Lama (PPh Pasal 17)
                </SectionTitle>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, lineHeight: 1.5 }}>
                  Sarana verifikasi, uji petik, dan audit komparasi atas fluktuasi potongan bulanan (Masa Januari s.d. November) serta pembuktian rekonsiliasi tahunan (Masa Desember / Dapem Terakhir) sesuai <strong>PMK 168/2023</strong> dan <strong>PP 58/2023</strong>.
                </div>
              </div>

              <Btn variant="primary" size="sm" onClick={() => handleExportTab("komparasi_audit")}>
                <Download size={13} /> Ekspor Tabel Komparasi (Excel)
              </Btn>
            </div>

            {/* Stat Cards Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
              <StatCard
                icon={<Users size={IC} />}
                label="Total Peserta Sampel"
                value={`${filteredDataKomparasi.length} WP`}
                sub={`Mode: ${filterBulanKomparasi}`}
                color={COLORS.blue}
              />
              <StatCard
                icon={<Building2 size={IC} />}
                label={`Bruto ${isKomparasiTahunan ? "Setahun" : "Masa Ini"}`}
                value={fmt(totalBrutoKomparasi)}
                sub="Total dasar pemotongan pajak"
                color={COLORS.gray800}
              />
              <StatCard
                icon={<Calculator size={IC} />}
                label={`PPh 21 Baru (${isKomparasiTahunan ? "Tahunan" : "TER/P17"})`}
                value={fmt(totalPPhBaruKomparasi)}
                sub="Metode Baru (PP 58 & PMK 168)"
                color={COLORS.blueDark}
              />
              <StatCard
                icon={<Scale size={IC} />}
                label={`PPh 21 Lama (${isKomparasiTahunan ? "Tahunan" : "P17 Rata2"})`}
                value={fmt(totalPPhLamaKomparasi)}
                sub="Simulasi Metode Lama (Pasal 17)"
                color={COLORS.gray600}
              />
              <StatCard
                icon={<AlertTriangle size={IC} />}
                label="Selisih Bersih (Delta)"
                value={(totalSelisihKomparasi > 0 ? "+" : "") + fmt(totalSelisihKomparasi)}
                sub={totalSelisihKomparasi === 0 ? "100% Imbang (Nihil Selisih)" : totalSelisihKomparasi > 0 ? "TER Lebih Tinggi di masa ini" : "TER Lebih Rendah di masa ini"}
                color={totalSelisihKomparasi === 0 ? COLORS.green : totalSelisihKomparasi > 0 ? COLORS.red : COLORS.orange}
              />
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                    <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NOPENS</th>
                    <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Peserta Pensiun</th>
                    <th style={{ padding: "9px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>PTKP</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa Pajak</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Penghasilan Bruto</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Metode Baru</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Metode Lama</th>
                    <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>Selisih (Baru - Lama)</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>% Selisih</th>
                    <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Status Evaluasi</th>
                    <th style={{ padding: "9px 10px", textAlign: "center" }}>Aksi Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataKomparasi.map((d, i) => {
                    const isZero = d.selisihEvaluasi === 0;
                    const isHigher = d.selisihEvaluasi > 0;
                    return (
                      <tr
                        key={d.id}
                        style={{
                          borderBottom: "1px solid #E2E8F0",
                          background: d.isDapemTerakhirBulanIni
                            ? "#FAF5FF"
                            : isZero
                            ? (i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                            : isHigher
                            ? "#FFFBFB"
                            : "#F0FDF4",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = d.isDapemTerakhirBulanIni
                            ? "#FAF5FF"
                            : isZero
                            ? (i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")
                            : isHigher
                            ? "#FFFBFB"
                            : "#F0FDF4")
                        }
                      >
                        <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nik}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nrp}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nopens}
                        </td>
                        <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                          <div style={{ fontSize: 10.5, color: "#64748B" }}>{d.satker} ({d.unor})</div>
                        </td>
                        <td style={{ padding: "8px 8px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ fontWeight: 800, color: "#0F172A" }}>{d.kodeJiwa}</span>
                          <div style={{ fontSize: 9.5, color: "#64748B" }}>{d.kategoriTER}</div>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600, color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.masaPajakLabel}
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: d.brutoEvaluasi === 0 ? "#94A3B8" : "#0F172A", borderRight: "1px solid #E2E8F0", fontWeight: 600 }}>
                          {fmt(d.brutoEvaluasi)}
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: d.pphBaruEvaluasi < 0 ? "#059669" : "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                          {d.pphBaruEvaluasi < 0 ? `- ${fmt(Math.abs(d.pphBaruEvaluasi))} (LB)` : fmt(d.pphBaruEvaluasi)}
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                          {fmt(d.pphLamaEvaluasi)}
                        </td>
                        <td
                          style={{
                            padding: "8px 12px",
                            textAlign: "right",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: isZero ? "#64748B" : isHigher ? "#DC2626" : "#059669",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {isZero ? "Rp 0" : (isHigher ? "+" : "") + fmt(d.selisihEvaluasi)}
                        </td>
                        <td
                          style={{
                            padding: "8px 10px",
                            textAlign: "center",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: isZero ? "#64748B" : isHigher ? "#DC2626" : "#059669",
                            borderRight: "1px solid #E2E8F0",
                          }}
                        >
                          {d.selisihPersenStr}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={d.badgeColor}>
                            {d.statusEvaluasi}
                          </Badge>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <button
                            onClick={() => setModalRincian12Bulan(d)}
                            style={{
                              background: "#EFF6FF",
                              border: "1px solid #BFDBFE",
                              color: "#1D4ED8",
                              padding: "4px 8px",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: 11,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Calendar size={12} /> Rincian 12 Bulan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total Row */}
                  <tr style={{ background: "#F1F5F9", fontWeight: 800 }}>
                    <td colSpan={7} style={{ padding: "9px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                      TOTAL EVALUASI AUDIT ({filteredDataKomparasi.length} PESERTA) — {filterBulanKomparasi}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #CBD5E1" }}>
                      {fmt(totalBrutoKomparasi)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", borderRight: "1px solid #CBD5E1", fontSize: 13 }}>
                      {fmt(totalPPhBaruKomparasi)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #CBD5E1", fontSize: 13 }}>
                      {fmt(totalPPhLamaKomparasi)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: totalSelisihKomparasi === 0 ? "#059669" : totalSelisihKomparasi > 0 ? "#DC2626" : "#059669", borderRight: "1px solid #CBD5E1", fontSize: 13 }}>
                      {totalSelisihKomparasi === 0 ? "Rp 0" : (totalSelisihKomparasi > 0 ? "+" : "") + fmt(totalSelisihKomparasi)}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #CBD5E1" }}>—</td>
                    <td colSpan={2} style={{ padding: "9px 10px", textAlign: "center" }}>
                      <Badge color={totalSelisihKomparasi === 0 ? "green" : "blue"}>
                        {totalSelisihKomparasi === 0 ? "✓ 100% Selaras Imbang" : "Audit Terverifikasi"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODAL RINCIAN 12 BULAN KOMPARASI PER PESERTA */}
          {/* ========================================================================= */}
          {modalRincian12Bulan && (() => {
            const data12Bulan = generate12BulanPeserta(modalRincian12Bulan);
            const p = modalRincian12Bulan;
            return (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(15, 23, 42, 0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
                onClick={() => setModalRincian12Bulan(null)}
              >
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    width: "100%",
                    maxWidth: 1020,
                    maxHeight: "92vh",
                    overflowY: "auto",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #CBD5E1",
                    padding: 24,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header Modal */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, borderBottom: "1px solid #E2E8F0", paddingBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Scale size={20} color="#1D4ED8" />
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0F172A" }}>
                          Matriks Komparasi 12 Bulan: Metode Baru (TER) vs Metode Lama (Pasal 17)
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: 12.5, color: "#64748B" }}>
                        Rincian perbandingan bulan ke bulan untuk pembuktian kesetaraan rekonsiliasi tahunan sesuai <strong>PMK 168/2023</strong> &amp; <strong>PP 58/2023</strong>.
                      </p>
                    </div>
                    <button
                      onClick={() => setModalRincian12Bulan(null)}
                      style={{
                        background: "#F1F5F9",
                        border: "none",
                        borderRadius: 6,
                        padding: 6,
                        cursor: "pointer",
                        color: "#64748B",
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Info Peserta Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 18, background: "#F8FAFC", padding: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}>
                    <div>
                      <div style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>Nama &amp; Satker</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{p.nama}</div>
                      <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600 }}>Satker: {p.satker} ({p.unor})</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>NRP &amp; NOPENS</div>
                      <div style={{ fontSize: 11.5, fontFamily: "monospace", color: "#1E293B", fontWeight: 700 }}>NRP: {p.nrp}</div>
                      <div style={{ fontSize: 11.5, fontFamily: "monospace", color: COLORS.blueDark, fontWeight: 700 }}>NOPENS: {p.nopens}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>NIK / NPWP</div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", color: "#0F172A" }}>{p.nik}</div>
                      <div style={{ fontSize: 11, color: "#059669" }}>{p.statusNPWP}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "#64748B" }}>Kode Jiwa &amp; PTKP</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{p.kodeJiwa} ({p.kategoriTER})</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>PTKP: {fmt(p.ptkp)}/thn</div>
                    </div>
                  </div>

                  {/* Tabel Matriks 12 Bulan */}
                  <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", marginBottom: 16 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                          <th style={{ padding: "8px 10px", textAlign: "center", width: 40, borderRight: "1px solid #CBD5E1" }}>Masa</th>
                          <th style={{ padding: "8px 12px", textAlign: "left", width: 110, borderRight: "1px solid #CBD5E1" }}>Bulan</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #CBD5E1" }}>Bruto Bulanan</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #CBD5E1" }}>PPh 21 Baru (TER / P17)</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #CBD5E1" }}>PPh 21 Lama (P17 Rata2)</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #CBD5E1" }}>Selisih Bulanan</th>
                          <th style={{ padding: "8px 12px", textAlign: "left" }}>Keterangan &amp; Mekanisme</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data12Bulan.months.map((m, idx) => {
                          const isZero = m.selisih === 0;
                          const isPositive = m.selisih > 0;
                          const isDesember = m.bulanIdx === 12;
                          const isBerhenti = p.isBerhenti && m.bulanIdx === p.bulanBerhentiIdx;
                          return (
                            <tr
                              key={idx}
                              style={{
                                borderBottom: "1px solid #E2E8F0",
                                background: isBerhenti
                                  ? "#FAF5FF"
                                  : isDesember
                                  ? "#EFF6FF"
                                  : m.status.includes("Non-Aktif")
                                  ? "#F8FAFC"
                                  : idx % 2 === 1
                                  ? "#F8FAFC"
                                  : "#FFFFFF",
                              }}
                            >
                              <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0", fontWeight: 700 }}>
                                {String(m.bulanIdx).padStart(2, "0")}
                              </td>
                              <td style={{ padding: "8px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                                {m.namaBulan}
                              </td>
                              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: m.bruto === 0 ? "#94A3B8" : "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                                {fmt(m.bruto)}
                              </td>
                              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: m.pphBaru < 0 ? "#059669" : "#1D4ED8", borderRight: "1px solid #E2E8F0" }}>
                                {m.pphBaru < 0 ? `- ${fmt(Math.abs(m.pphBaru))} (LB)` : fmt(m.pphBaru)}
                              </td>
                              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                                {fmt(m.pphLama)}
                              </td>
                              <td
                                style={{
                                  padding: "8px 12px",
                                  textAlign: "right",
                                  fontFamily: "monospace",
                                  fontWeight: 700,
                                  color: isZero ? "#64748B" : isPositive ? "#DC2626" : "#059669",
                                  borderRight: "1px solid #E2E8F0",
                                }}
                              >
                                {isZero ? "Rp 0" : (isPositive ? "+" : "") + fmt(m.selisih)}
                              </td>
                              <td style={{ padding: "8px 12px" }}>
                                <Badge color={m.badgeColor}>{m.status}</Badge>
                                <span style={{ fontSize: 11, color: "#64748B", marginLeft: 6 }}>{m.keterangan}</span>
                              </td>
                            </tr>
                          );
                        })}

                        {/* BARIS TOTAL AKUMULASI SETAHUN */}
                        <tr style={{ background: "#F1F5F9", fontWeight: 800, borderTop: "2px solid #CBD5E1" }}>
                          <td colSpan={2} style={{ padding: "10px 12px", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                            TOTAL SETAHUN (AKUMULASI)
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #CBD5E1" }}>
                            {fmt(data12Bulan.totalBruto)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#1D4ED8", fontSize: 13, borderRight: "1px solid #CBD5E1" }}>
                            {fmt(data12Bulan.totalPPhBaru)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#475569", fontSize: 13, borderRight: "1px solid #CBD5E1" }}>
                            {fmt(data12Bulan.totalPPhLama)}
                          </td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#059669", fontSize: 13, borderRight: "1px solid #CBD5E1" }}>
                            {fmt(data12Bulan.totalSelisih)}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <Badge color="green">✓ 100% REKONSILIASI IMBANG (SELISIH NIHIL)</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Callout Box Edukasi */}
                  <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.5 }}>
                      <strong>Hasil Audit &amp; Verifikasi Rekonsiliasi:</strong>
                      <br />
                      Meskipun pada Masa Januari s.d. November potongan PPh 21 menggunakan tarif TER menghasilkan deviasi bulanan dibanding metode lama Pasal 17, <strong>akumulasi setahun penuh terbukti 100% identik dan imbang (selisih Rp 0)</strong>. Pada bulan terakhir ({p.isBerhenti ? `Masa ${p.bulanBerhentiNama} sebagai Dapem Terakhir` : "Masa Desember sebagai Rekonsiliasi Akhir"}), sistem otomatis menyesuaikan potongan agar akumulasi setoran persis sama dengan PPh Pasal 17 setahun penuh sesuai amanat PMK 168/2023.
                    </div>
                  </div>

                  {/* Footer Modal */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <Btn
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPreview({
                          title: `Rincian Komparasi 12 Bulan — ${p.nama}`,
                          subtitle: `NRP: ${p.nrp} • NIK: ${p.nik} • Status PTKP: ${p.kodeJiwa}`,
                          type: "table",
                          fileName: `Rincian_Komparasi_12Bulan_${p.nrp}.xlsx`,
                          content: {
                            columns: ["Masa", "Bulan", "Bruto Bulanan", "PPh 21 Baru", "PPh 21 Lama", "Selisih", "Keterangan"],
                            alignments: ["center", "left", "right", "right", "right", "right", "left"],
                            rows: data12Bulan.months.map(m => [
                              String(m.bulanIdx).padStart(2, "0"),
                              m.namaBulan,
                              fmt(m.bruto),
                              fmt(m.pphBaru),
                              fmt(m.pphLama),
                              fmt(m.selisih),
                              m.keterangan,
                            ]),
                            totalRow: [
                              { colSpan: 2, text: "TOTAL SETAHUN", align: "left" },
                              { text: fmt(data12Bulan.totalBruto), align: "right" },
                              { text: fmt(data12Bulan.totalPPhBaru), align: "right" },
                              { text: fmt(data12Bulan.totalPPhLama), align: "right" },
                              { text: fmt(data12Bulan.totalSelisih), align: "right" },
                              { text: "100% Rekonsiliasi Imbang", align: "center" },
                            ],
                            totalRows: 12,
                          }
                        })
                      }
                    >
                      <Download size={13} /> Ekspor Rincian (Excel)
                    </Btn>
                    <Btn variant="primary" size="sm" onClick={() => setModalRincian12Bulan(null)}>
                      Tutup
                    </Btn>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BUKTI POTONG 1721-A2 & INTEGRASI CORETAX (PJK 02 & PJK 03) */}
      {/* ========================================================================= */}
      {tab === "bukpot_coretax" && (
        <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
          <SectionTitle
            action={
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {uploadStep > 0 && (
                  <Btn variant="ghost" size="sm" onClick={() => setUploadStep(0)}>
                    <RefreshCw size={13} /> Ulangi Alur
                  </Btn>
                )}
                <Btn variant="primary" size="sm" onClick={() => handleExportTab("bukpot_coretax")}>
                  <Download size={13} /> Ekspor Rekap 1721-A2 (Excel)
                </Btn>
              </div>
            }
          >
            Penerbitan Digital Bukti Potong 1721-A2 &amp; Integrasi Coretax DJP
          </SectionTitle>

          {/* Stepper Wizard */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { n: 1, t: "Impor Data / Manifes Coretax" },
              { n: 2, t: "Validasi NIK 16-Digit Dukcapil (PMK 168/2023)" },
              { n: 3, t: "Akses Mandiri Peserta (Portal / AMA)" },
            ].map((st, i) => {
              const done = uploadStep >= st.n;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: done ? "#EFF6FF" : "#F1F5F9",
                    color: done ? COLORS.blue : "#64748B",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: done ? COLORS.blue : "#CBD5E1",
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                    }}
                  >
                    {done ? <CheckCircle2 size={13} /> : st.n}
                  </span>
                  {st.t}
                </div>
              );
            })}
          </div>

          {uploadStep === 0 && (
            <div style={{ border: "2px dashed #CBD5E1", borderRadius: 8, padding: "32px 20px", textAlign: "center", background: "#F8FAFC" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFF6FF", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <FileUp size={22} color={COLORS.blue} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A" }}>
                Impor Data Manifes Bukti Potong 1721-A2
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, maxWidth: 540, margin: "4px auto 0" }}>
                Sesuai BRD PJK 03 (Line 589): Bukti Potong PPh 21 bentuk 1721-A2 otomatis diterbitkan untuk <strong>Masa Desember</strong> atau <strong>Masa Terakhir</strong> penerima pensiun yang berhenti sebelum Desember (100% tarif normal tanpa sanksi 20%).
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                <Btn onClick={() => setUploadStep(1)}>
                  <Upload size={14} /> Unggah File Manifes (.XML / .ZIP)
                </Btn>
              </div>
            </div>
          )}

          {uploadStep >= 1 && (
            <>
              {/* Ringkasan Validasi Pemadanan NIK/NPWP - Clean & Neutral */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Total Bukpot Diterbitkan</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{filteredDataTahunan.length} Dokumen</div>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Masa Desember &amp; Terakhir</div>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Pemadanan NIK = NPWP (Valid)</span>
                    <span style={{ fontSize: 9.5, background: "#DCFCE7", color: "#166534", padding: "1px 6px", borderRadius: 4, fontWeight: 700, border: "1px solid #BBF7D0" }}>
                      Siap Coretax
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#059669", marginTop: 2 }}>
                    {filteredDataTahunan.filter((d) => d.nikValid).length} Dokumen
                  </div>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>100% Bebas Denda 20% PMK 168</div>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 16px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Tindak Lanjut Kepesertaan</span>
                    <span
                      onClick={() => setTab("validasi_nik")}
                      style={{ cursor: "pointer", fontSize: 9.5, background: "#FEF2F2", color: "#B91C1C", padding: "1px 6px", borderRadius: 4, fontWeight: 700, border: "1px solid #FECACA" }}
                    >
                      Lihat Antrean →
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: filteredDataTahunan.filter((d) => !d.nikValid).length > 0 ? "#DC2626" : "#0F172A", marginTop: 2 }}>
                    {filteredDataTahunan.filter((d) => !d.nikValid).length} Dokumen
                  </div>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Pending Validasi Dukcapil</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  {uploadStep < 2
                    ? "Status: Berkas manifes Coretax terverifikasi dan siap diaktifkan untuk akses mandiri via Portal Peserta & Aplikasi AMA."
                    : "Status: Bukti Potong 1721-A2 telah aktif dan dapat diunduh secara mandiri oleh peserta."}
                </div>
                {uploadStep < 2 ? (
                  <Btn onClick={() => setUploadStep(2)}>
                    <Mail size={14} /> Aktifkan Distribusi ke Portal Peserta
                  </Btn>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={15} /> Layanan Unduh Mandiri Aktif
                  </span>
                )}
              </div>

              {/* Tabel Bukpot per Peserta */}
              <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                      <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK Dukcapil</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NRP</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NOPENS</th>
                      <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Nama Peserta</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NPWP / Status Coretax</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Masa Perolehan</th>
                      <th style={{ padding: "9px 12px", textAlign: "right", borderRight: "1px solid #E2E8F0" }}>PPh 21 Terutang (A2)</th>
                      <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Kanal Akses</th>
                      <th style={{ padding: "9px 10px", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataTahunan.map((d, i) => (
                      <tr
                        key={d.id}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#334155", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          <div style={{ fontWeight: !d.nikValid ? 700 : 400, color: !d.nikValid ? "#DC2626" : "#334155" }}>
                            {d.nik}
                          </div>
                          {!d.nikValid && (
                            <span
                              onClick={() => setTab("validasi_nik")}
                              style={{
                                cursor: "pointer",
                                fontSize: 9,
                                fontWeight: 700,
                                background: "#FEF2F2",
                                color: "#B91C1C",
                                padding: "1px 5px",
                                borderRadius: 4,
                                border: "1px solid #FECACA",
                                display: "inline-block",
                                marginTop: 2,
                              }}
                            >
                              ⚠️ Anomali
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nrp}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                          {d.nopens}
                        </td>
                        <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontWeight: 700, color: "#0F172A" }}>
                          <div>{d.nama}</div>
                          <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 500 }}>{d.satker} ({d.unor})</div>
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                          {d.npwp}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={d.isBerhenti ? "purple" : "gray"}>{d.masaPerolehanStr}</Badge>
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                          {fmt(d.pphTerutangSetahunP17)}
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 11, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                          Portal Peserta / AMA
                        </td>
                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                          <Btn
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPreview({
                                title: `Formulir 1721-A2 — Bukti Potong PPh 21 Tahun Pajak 2026`,
                                subtitle: `${d.nama} (${d.satker}) • Masa: ${d.masaPerolehanStr} • Pemotong: PT ASABRI (Persero)`,
                                type: "table",
                                fileName: `Bukti_Potong_1721_A2_${d.nrp}.pdf`,
                                content: {
                                  columns: ["Komponen Penghasilan & Pajak", "Rincian Resmi"],
                                  rows: [
                                    ["Nama Peserta Penerima Pensiun", d.nama],
                                    ["Nomor Induk Kependudukan (NIK)", d.nik],
                                    ["Nomor Pokok Wajib Pajak (NPWP)", d.npwp],
                                    ["Masa Perolehan Penghasilan", `${d.masaPerolehanStr} (${d.bulanDiterima} Bulan)`],
                                    ["Status Kode Jiwa / PTKP", `${d.kodeJiwa} (${fmt(d.ptkp)})`],
                                    ["Dasar Regulasi Pemotongan", "PMK 168/2023 & UU HPP (Tarif Standar Normal)"],
                                    ["A. Penghasilan Bruto Kumulatif", fmt(d.brutoSetahun)],
                                    ["B. Pengurang: Biaya Pensiun Prorata (5%)", fmt(d.biayaPensiunSetahun)],
                                    ["C. Penghasilan Netto Kumulatif (A - B)", fmt(d.nettoSetahun)],
                                    ["D. Penghasilan Kena Pajak / PKP (C - PTKP)", fmt(d.pkp)],
                                    ["E. PPh 21 Terutang (Pasal 17 Normal)", fmt(d.pphTerutangSetahunP17)],
                                    ["F. PPh 21 Telah Dipotong Sebelumnya (TER)", fmt(d.pphDipotongJanNov)],
                                    ["G. PPh 21 Dipotong Masa Terakhir (E - F)", fmt(d.pphPenyesuaianAkhir)],
                                    ["Status Sanksi Non-NPWP 20%", "TIDAK DIKENAKAN (Resmi Dihapuskan PMK 168)"],
                                  ],
                                  totalRows: 14,
                                },
                              })
                            }
                          >
                            <Eye size={12} /> Rincian
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: VALIDASI NIK & TINDAK LANJUT DIVISI KEPESERTAAN */}
      {/* ========================================================================= */}
      {(tab === "validasi_nik" || tab === "tindak_lanjut_nik") && (
        <TabValidasiNIK
          pesertaList={pesertaList}
          onOpenDetailMonitoring={(p) => setModalDetailMonitoring(p)}
          onOpenNotaDinasModal={(list) => setModalNotaDinas(list)}
          onOpenRiwayatTiketModal={(p) => setModalRiwayatTiket(p)}
          onSyncDukcapil={handleSyncDukcapil}
          isSyncing={isSyncingDukcapil}
          onExportPreview={() => handleExportTab("validasi_nik")}
        />
      )}

    </div>
  );
};
