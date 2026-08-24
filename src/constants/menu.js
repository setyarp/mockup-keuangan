import {
  BarChart3,
  Calculator,
  RefreshCw,
  FileText,
  Building2,
  ClipboardList,
  CreditCard,
  Receipt,
  TrendingDown,
  Cross,
  PenLine,
  DollarSign,
  Shield,
  Wallet,
} from "lucide-react";

export const ICON_MAP = {
  chart: BarChart3,
  calc: Calculator,
  sync: RefreshCw,
  file: FileText,
  bank: Building2,
  clip: ClipboardList,
  card: CreditCard,
  receipt: Receipt,
  trend: TrendingDown,
  cross: Cross,
  pen: PenLine,
  dollar: DollarSign,
  shield: Shield,
  wallet: Wallet,
};

export const MENU = [
  {
    section: "IKHTISAR",
    items: [
      { id: "dashboard", icon: "chart", label: "Ikhtisar Keuangan" },
    ],
  },
  {
    section: "REKONSILIASI PERBANKAN",
    items: [
      { id: "standarisasi_cms", icon: "bank", label: "Standarisasi Format CMS" },
    ],
  },
  {
    section: "PENERIMAAN IURAN",
    items: [
      {
        icon: "dollar",
        label: "Administrasi Iuran Peserta",
        children: [
          { id: "kalkulator", label: "Perhitungan Iuran Peserta" },
          { id: "rekonsiliasi", label: "Rekonsiliasi Penerimaan Dana" },
          { id: "tagihan", label: "Penerbitan Tagihan Kemenkeu", disabled: true },
        ],
      },
    ],
  },
  {
    section: "PEMBAYARAN MANFAAT",
    items: [
      {
        icon: "file",
        label: "Perintah & Realisasi Pembayaran",
        children: [
          { id: "listsp", label: "List SP (Surat Perintah)" },
          { id: "bayarpensiun", label: "DAPEM" },
        ],
      },
      {
        icon: "trend",
        label: "Pengendalian Anggaran",
        children: [
          { id: "dipa", label: "Realisasi & Sisa Pagu DIPA" },
          { id: "dana", label: "Ketersediaan Dana Mitra Bayar" },
        ],
      },
    ],
  },
  {
    section: "PENAGIHAN & PIUTANG",
    items: [
      { id: "kredit", icon: "shield", label: "Penagihan Keterlanjuran Bayar" },
      {
        icon: "card",
        label: "Penagihan Pengembangan Manfaat",
        children: [
          { id: "imbaljasa", label: "Imbal Jasa Mitra Bayar" },
          { id: "tlimbaljasa", label: "Imbal Jasa Taspen Life" },
          { id: "konfigurasi_manfaat", label: "Master Mitra & Parameter Manfaat" },
        ],
      },
    ],
  },
  {
    section: "KEMITRAAN ASURANSI",
    items: [
      {
        icon: "wallet",
        label: "Administrasi Taspen Life",
        children: [
          { id: "tlpolis", label: "Portofolio Polis & Premi" },
        ],
      },
    ],
  },
  {
    section: "PERPAJAKAN & REKONSILIASI",
    items: [
      {
        icon: "receipt",
        label: "Administrasi Perpajakan",
        children: [
          { id: "pajak", label: "PPh 21 & Bukti Potong" },
          { id: "ukp", label: "Rekap Data UKP Pensiun" },
        ],
      },
      {
        icon: "cross",
        label: "Rekonsiliasi Jaminan Kesehatan",
        children: [
          { id: "bpjs", label: "Iuran BPJS Kesehatan" },
        ],
      },
    ],
  },
  {
    section: "PELAPORAN",
    items: [
      { id: "laporan", icon: "pen", label: "Laporan & Ekspor Data" },
    ],
  },
];
