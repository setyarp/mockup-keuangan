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
  Send,
  FileUp,
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
  send: Send,
  upload: FileUp,
};

export const MENU = [
  {
    section: "DASHBOARD",
    items: [
      { id: "dipa", icon: "chart", label: "Dana DIPA" },
      { id: "dana", icon: "wallet", label: "Dana Pembayaran Manfaat" },
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
          { id: "tagihan", label: "Penagihan Iuran Ke Kemenkeu" },
          { id: "rekonsiliasi", label: "Rekonsiliasi Penerimaan Dana" },
        ],
      },
    ],
  },
  {
    section: "PEMBAYARAN MANFAAT",
    items: [
      {
        icon: "file",
        label: "Perintah Pembayaran",
        children: [
          { id: "listsp", label: "List SP (Surat Perintah)" },
          { id: "jkk_perawatan", label: "JKK Perawatan" },
          { id: "hutang_pum", label: "Hutang PUM KPR" },
        ],
      },
      {
        icon: "send",
        label: "Penyaluran & CMS Mitra",
        children: [
          { id: "upload_cms", label: "Upload CMS Mitra Bayar" },
          { id: "penyaluran_harian", label: "Penyaluran Harian CMS" },
        ],
      },
      {
        icon: "clip",
        label: "Administrasi DAPEM",
        children: [
          { id: "bayarpensiun", label: "DAPEM Induk" },
          { id: "dapem_susulan", label: "DAPEM Susulan" },
          { id: "non_dapem", label: "Non-Dapem (PP, UKP, UDW)" },
          { id: "report_ku", label: "Report KU" },
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
          { id: "imbaljasa_flagging", label: "Imbal Jasa — Flagging Kredit" },
          { id: "imbaljasa_auth", label: "Imbal Jasa — Auth Digital" },
          { id: "tlimbaljasa", label: "Imbal Jasa Taspen Life" },
          { id: "konfigurasi_manfaat", label: "Parameter Suku Bunga" },
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
    section: "PERPAJAKAN",
    items: [
      {
        icon: "receipt",
        label: "Administrasi Perpajakan",
        children: [
          { id: "pajak", label: "PPh 21 & Bukti Potong" },
          { id: "validasi_nik", label: "Validasi NIK & Tindak Lanjut" },
          { id: "ukp", label: "Rekap Data UKP Pensiun" },
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
