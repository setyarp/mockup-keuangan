import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Layers,
  FileSearch,
  Printer,
  Building2,
  ShieldCheck,
  CreditCard,
  Landmark,
  Receipt,
  Users
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Badge, Select, Btn, SectionTitle, Table, PreviewModal } from "../components/common";

export const ReportGenerator = () => {
  const [selectedKategori, setSelectedKategori] = useState("Semua Kategori");
  const [selectedReportId, setSelectedReportId] = useState("BRD-4.5.01");
  const [tglAwal, setTglAwal] = useState("2026-07-01");
  const [tglAkhir, setTglAkhir] = useState("2026-07-31");
  const [filterSatker, setFilterSatker] = useState("Semua Instansi");
  const [preview, setPreview] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const filterPeriode = `${tglAwal} s.d. ${tglAkhir}`;

  // Daftar Lengkap 26 Laporan Resmi Divisi Keuangan Berdasarkan BRD Poin 4.5
  const allReportsData = [
    // --- KATEGORI 1: Iuran & Penagihan Kemenkeu ---
    {
      id: "BRD-4.5.17",
      category: "Iuran & Penagihan Kemenkeu",
      title: "Rekap Iuran/Premi THT, Pensiun, JKK, dan JKm Per Satker",
      desc: "Rekapitulasi perhitungan iuran THT (3,25%), Pensiun (4,75%), JKK (0,24%), dan JKm (0,20%) per Satker (TNI AD, AL, AU, Kemhan, Polri) yang dipadankan dengan SKP-PFK Kemenkeu.",
      columns: ["Satker", "Gaji Pokok", "Tunjangan Keluarga", "Iuran THT (3,25%)", "Iuran Pensiun (4,75%)", "Iuran JKK (0,24%)", "Iuran JKm (0,20%)", "Total Iuran", "Realisasi SKP-PFK", "Selisih"],
      rows: [
        ["TNI AD", "Rp 66,00 M", "Rp 6,60 M", "Rp 2,36 M", "Rp 3,45 M", "Rp 0,16 M", "Rp 0,13 M", "Rp 6,10 M", "Rp 6,10 M", "Rp 0"],
        ["TNI AL", "Rp 28,50 M", "Rp 2,85 M", "Rp 1,02 M", "Rp 1,49 M", "Rp 0,07 M", "Rp 0,06 M", "Rp 2,64 M", "Rp 2,64 M", "Rp 0"],
        ["TNI AU", "Rp 24,00 M", "Rp 2,40 M", "Rp 0,86 M", "Rp 1,25 M", "Rp 0,06 M", "Rp 0,05 M", "Rp 2,22 M", "Rp 2,22 M", "Rp 0"],
        ["Mabes TNI", "Rp 12,00 M", "Rp 1,20 M", "Rp 0,43 M", "Rp 0,63 M", "Rp 0,03 M", "Rp 0,02 M", "Rp 1,11 M", "Rp 1,11 M", "Rp 0"],
        ["POLRI", "Rp 85,00 M", "Rp 8,50 M", "Rp 3,04 M", "Rp 4,44 M", "Rp 0,20 M", "Rp 0,17 M", "Rp 7,85 M", "Rp 7,85 M", "Rp 0"],
        ["PNS Kemhan & Polri", "Rp 34,50 M", "Rp 3,45 M", "Rp 1,23 M", "Rp 1,80 M", "Rp 0,08 M", "Rp 0,07 M", "Rp 3,18 M", "Rp 3,18 M", "Rp 0"]
      ],
      totalRows: 6
    },
    {
      id: "BRD-4.5.18",
      category: "Iuran & Penagihan Kemenkeu",
      title: "Surat Tagihan Iuran/Premi Per Satker (Dokumen Resmi Kemenkeu)",
      desc: "Daftar penerbitan surat tagihan resmi iuran per batch (Batch 1 THT/Pensiun Gaji Induk, Batch 2 Gaji Susulan, dan Bulanan JKK/JKm) ke Ditjen Anggaran Kemenkeu.",
      columns: ["No. Surat Tagihan", "Periode", "Batch Tagihan", "Dasar SKP / Nota Dinas", "Tgl Terbit", "Nominal Tagihan TNI", "Nominal Tagihan POLRI", "Total Tagihan", "Status Dokumen"],
      rows: [
        ["001/ASABRI/TGH-THT-PEN-B1/VII/2026", "Juli 2026", "Batch 1 (Gaji Induk)", "SKP-PFK/001/VII/2026", "02 Jul 2026", "Rp 42.840.000.000", "Rp 27.568.000.000", "Rp 70.408.000.000", "Sudah di-TTD"],
        ["002/ASABRI/TGH-THT-PEN-B2/VII/2026", "Juli 2026", "Batch 2 (Gaji Susulan)", "SKP-PFK/002/VII/2026", "16 Jul 2026", "Rp 10.710.000.000", "Rp 6.892.000.000", "Rp 17.602.000.000", "Siap Download"],
        ["003/ASABRI/TGH-JKK/VII/2026", "Juli 2026", "Bulanan (0,24% GP)", "ND-JKK/ASABRI/VII/2026", "05 Jul 2026", "Rp 1.580.000.000", "Rp 1.050.000.000", "Rp 2.630.000.000", "Siap Download"],
        ["004/ASABRI/TGH-JKM/VII/2026", "Juli 2026", "Bulanan (0,20% GP)", "ND-JKM/ASABRI/VII/2026", "05 Jul 2026", "Rp 1.320.000.000", "Rp 890.000.000", "Rp 2.210.000.000", "Draft Otomatis"]
      ],
      totalRows: 4
    },

    // --- KATEGORI 2: Pembayaran Manfaat & Klaim Asuransi ---
    {
      id: "BRD-4.5.01",
      category: "Pembayaran Manfaat & Klaim Asuransi",
      title: "Rekapitulasi Pembayaran Klaim Asuransi Sosial Per Mitra Bayar",
      desc: "Laporan utama pembayaran klaim manfaat program (THT, JKK, JKm, Pensiun Pertama, NTIP) per mitra perbankan/pos mencakup potongan BPJS, Non-TGR, dan netto cair.",
      columns: ["Nama Mitra Bayar", "Jenis Manfaat", "Periode", "Jumlah Penerima", "Total Nilai SP", "Pot. BPJS", "Pot. Non-TGR", "Total Netto Dibayarkan", "No. SP2D", "Tanggal Cair"],
      rows: [
        ["Bank BRI", "THT (BUP) & Santunan JKm", "Juli 2026", "1.240", "Rp 87,50 M", "Rp 1,75 M", "Rp 0,45 M", "Rp 85,30 M", "SP2D-2026-0711", "02 Jul 2026"],
        ["Bank Mandiri", "THT, JKK Perawatan & UDW", "Juli 2026", "980", "Rp 68,20 M", "Rp 1,36 M", "Rp 0,32 M", "Rp 66,52 M", "SP2D-2026-0712", "02 Jul 2026"],
        ["Bank BNI", "THT & Pensiun Pertama", "Juli 2026", "640", "Rp 44,80 M", "Rp 0,90 M", "Rp 0,18 M", "Rp 43,72 M", "SP2D-2026-0713", "03 Jul 2026"],
        ["Bank BTN", "THT (Pensiun Pertama TNI)", "Juli 2026", "510", "Rp 35,70 M", "Rp 0,71 M", "Rp 0,15 M", "Rp 34,84 M", "SP2D-2026-0714", "03 Jul 2026"],
        ["PT Pos Indonesia", "THT & Santunan Wilayah 3T", "Juli 2026", "320", "Rp 18,40 M", "Rp 0,37 M", "Rp 0,09 M", "Rp 17,94 M", "SP2D-2026-0715", "04 Jul 2026"]
      ],
      totalRows: 15
    },
    {
      id: "BRD-4.5.02",
      category: "Pembayaran Manfaat & Klaim Asuransi",
      title: "Monitoring Klaim JKK Perawatan di RS Provider",
      desc: "Laporan monitoring klaim Jaminan Kecelakaan Kerja (JKK) yang sedang dalam proses perawatan di RS Provider, mencakup status tindakan dan nilai tagihan.",
      columns: ["No. Klaim", "Tgl Klaim", "NRP/Nopens", "Nama Peserta", "RS Provider", "Jenis Perawatan", "Tagihan RS", "Reimburse Peserta", "Status Klaim", "Status Bayar ke RS"],
      rows: [
        ["KLM-JKK-2026-081", "02 Jul 2026", "198701234", "Purn. Letkol Tri W.", "RSPAD Gatot Soebroto", "Rawat Inap Bedah", "Rp 48.500.000", "Rp 0", "Disetujui Dokter", "Lunas (Transfer CMS)"],
        ["KLM-JKK-2026-082", "04 Jul 2026", "199105432", "Sertu Budi Santoso", "RS Bhayangkara Medan", "Rawat Jalan Lanjutan", "Rp 12.800.000", "Rp 0", "Disetujui Dokter", "Lunas (Transfer CMS)"],
        ["KLM-JKK-2026-083", "07 Jul 2026", "198409871", "Kopda Agus Hendra", "RSAL Dr. Ramelan Sby", "Rehabilitasi Medik", "Rp 2.600.000", "Rp 0", "Verifikasi Berkas", "Antrean SPP"],
        ["KLM-JKK-2026-084", "10 Jul 2026", "199411223", "Praka Rizki Ramadhan", "RS AU Dr. Esnawan", "Evakuasi Medis Udara", "Rp 8.500.000", "Rp 1.500.000", "Disetujui Dokter", "Proses Kasda"]
      ],
      totalRows: 34
    },
    {
      id: "BRD-4.5.03",
      category: "Pembayaran Manfaat & Klaim Asuransi",
      title: "Rekapitulasi Klaim JKK Perawatan Real-Time per RS Provider",
      desc: "Rekapitulasi volume klaim masuk, klaim selesai, total tagihan RS provider, dan total Surat Perintah (SP) yang diterbitkan per rumah sakit rekanan.",
      columns: ["RS Provider", "Periode", "Klaim Masuk", "Klaim Selesai", "Klaim Pending", "Total Tagihan RS", "Total Reimburse", "Total Nilai SP Terbit"],
      rows: [
        ["RSPAD Gatot Soebroto Jakarta", "Juli 2026", "48 Berkas", "45 Berkas", "3 Berkas", "Rp 485.200.000", "Rp 12.500.000", "Rp 497.700.000"],
        ["RSAL Dr. Ramelan Surabaya", "Juli 2026", "32 Berkas", "30 Berkas", "2 Berkas", "Rp 312.400.000", "Rp 8.200.000", "Rp 320.600.000"],
        ["RS Bhayangkara Tk I Pusdokkes", "Juli 2026", "28 Berkas", "27 Berkas", "1 Berkas", "Rp 274.800.000", "Rp 5.400.000", "Rp 280.200.000"],
        ["RSAU Dr. M. Salamun Bandung", "Juli 2026", "18 Berkas", "18 Berkas", "0 Berkas", "Rp 165.000.000", "Rp 4.100.000", "Rp 169.100.000"]
      ],
      totalRows: 12
    },
    {
      id: "BRD-4.5.05",
      category: "Pembayaran Manfaat & Klaim Asuransi",
      title: "Laporan Utang Non-TGR dan Bukti Setor SSBP/SSPB",
      desc: "Laporan pencatatan seluruh potongan Non-TGR (bukan tuntutan ganti rugi) dari klaim peserta beserta bukti setor NTPN ke Kas Negara.",
      columns: ["No. SP", "Tgl SP", "NRP/Nopens", "Nama Peserta", "Jenis Klaim", "Total Nilai SP", "Potongan Non-TGR", "NTPN SSBP", "Tanggal Setor"],
      rows: [
        ["SP/2026/07/041", "02 Jul 2026", "197801234", "Kol. Purn. Heru P.", "THT (BUP)", "Rp 145.000.000", "Rp 4.500.000", "019827364501", "03 Jul 2026"],
        ["SP/2026/07/042", "03 Jul 2026", "198205432", "Mayor Purn. Bambang", "THT (BUP)", "Rp 112.000.000", "Rp 3.200.000", "019827364502", "04 Jul 2026"],
        ["SP/2026/07/043", "05 Jul 2026", "199009871", "Kapten Purn. Slamet", "Santunan JKm", "Rp 42.000.000", "Rp 1.800.000", "019827364503", "06 Jul 2026"]
      ],
      totalRows: 18
    },
    {
      id: "BRD-4.5.06",
      category: "Pembayaran Manfaat & Klaim Asuransi",
      title: "Rekap Potongan Utang Klaim Per UO / Satker",
      desc: "Rekapitulasi potongan kewajiban utang peserta (BPJS Kesehatan, PUM KPR, Non-TGR, dan potongan lainnya) yang dikelompokkan per satuan kerja induk.",
      columns: ["Kode UO/Satker", "Nama Satuan Kerja", "Peserta Terpotong", "Pot. BPJS", "Pot. PUM KPR", "Pot. Non-TGR", "Pot. Lainnya", "Total Semua Potongan"],
      rows: [
        ["UO-01", "Mabes TNI Angkatan Darat", "420 Peserta", "Rp 124,50 Jt", "Rp 480,20 Jt", "Rp 65,40 Jt", "Rp 18,20 Jt", "Rp 688,30 Jt"],
        ["UO-02", "Mabes TNI Angkatan Laut", "180 Peserta", "Rp 54,20 Jt", "Rp 210,50 Jt", "Rp 28,10 Jt", "Rp 8,40 Jt", "Rp 301,20 Jt"],
        ["UO-03", "Mabes TNI Angkatan Udara", "150 Peserta", "Rp 45,00 Jt", "Rp 175,00 Jt", "Rp 22,50 Jt", "Rp 6,80 Jt", "Rp 249,30 Jt"],
        ["UO-04", "Kepolisian Negara Republik Indonesia", "580 Peserta", "Rp 172,00 Jt", "Rp 640,00 Jt", "Rp 89,00 Jt", "Rp 25,00 Jt", "Rp 926,00 Jt"],
        ["UO-05", "Kementerian Pertahanan RI", "210 Peserta", "Rp 62,50 Jt", "Rp 235,40 Jt", "Rp 31,20 Jt", "Rp 9,10 Jt", "Rp 338,20 Jt"]
      ],
      totalRows: 5
    },
    {
      id: "BRD-4.5.13",
      category: "Pembayaran Manfaat & Klaim Asuransi",
      title: "Laporan Monitoring Penagihan Kembali UDW Punah",
      desc: "Monitoring status pengembalian Uang Duka Wafat (UDW) yang terlanjur dibayarkan pada penerima manfaat yang terkonfirmasi punah / tanpa ahli waris sah.",
      columns: ["NRP/Nopens", "Nama Penerima", "Tgl Bayar UDW", "Nilai UDW Terlanjur", "Tgl Surat Tagihan", "Status Pengembalian", "Tgl Dikembalikan", "Nilai Kembali", "Sisa Belum Kembali"],
      rows: [
        ["19540812001", "Alm. Kol. Purn. H. Mulyono", "10 Mei 2026", "Rp 18.500.000", "01 Jun 2026", "Lunas Dikembalikan", "15 Jun 2026", "Rp 18.500.000", "Rp 0"],
        ["19600315002", "Alm. Ny. Siti Aminah (Punah)", "12 Mei 2026", "Rp 15.000.000", "01 Jun 2026", "Cicilan Berjalan", "20 Jun 2026", "Rp 7.500.000", "Rp 7.500.000"],
        ["19581120003", "Alm. Letda Purn. Supardi", "18 Mei 2026", "Rp 16.200.000", "05 Jun 2026", "Surat Peringatan II", "-", "Rp 0", "Rp 16.200.000"]
      ],
      totalRows: 14
    },

    // --- KATEGORI 3: Pembayaran Pensiun & DAPEM ---
    {
      id: "BRD-4.5.12",
      category: "Pembayaran Pensiun & DAPEM",
      title: "Rekap Biaya Operasional Penyelenggaraan (BOP) DAPEM Induk & Susulan",
      desc: "Perhitungan alokasi fee biaya operasional penyelenggaraan pembayaran pensiun bulanan kepada mitra perbankan/pos per jenis DAPEM.",
      columns: ["Mitra Bayar", "Jenis DAPEM", "Periode", "Jumlah Penerima", "Total Nilai DAPEM", "Alokasi BOP", "% Fee BOP", "Dasar Perhitungan"],
      rows: [
        ["Bank BRI", "DAPEM Induk", "Juli 2026", "195.400", "Rp 645,80 M", "Rp 3.229.000.000", "0,50%", "Pagu Belanja Pensiun Induk"],
        ["Bank Mandiri", "DAPEM Induk", "Juli 2026", "110.200", "Rp 364,50 M", "Rp 1.822.500.000", "0,50%", "Pagu Belanja Pensiun Induk"],
        ["PT Pos Indonesia", "DAPEM Induk & 3T", "Juli 2026", "31.900", "Rp 105,70 M", "Rp 528.500.000", "0,50%", "Pagu Belanja Pensiun Induk"],
        ["Bank BNI", "DAPEM Susulan", "Juli 2026", "14.200", "Rp 46,80 M", "Rp 234.000.000", "0,50%", "DAPEM Susulan Pasca-Oten"]
      ],
      totalRows: 12
    },
    {
      id: "BRD-4.5.19",
      category: "Pembayaran Pensiun & DAPEM",
      title: "Rekap Penghasilan Peserta Pensiun Bulanan (Basis PPh 21 TER)",
      desc: "Rekapitulasi data penghasilan bruto bulanan, kode jiwa, tunjangan, dan akumulasi penghasilan pensiunan sebagai basis pengenaan tarif TER.",
      columns: ["Kode MAK", "NIK", "NRP/NOPEN", "Nama Peserta", "Kode Jiwa", "PTKP", "GP Pensiun", "Tunjangan Keluarga", "Penghasilan Bruto", "Kumulatif Jan-Bulan Ini", "Status NIK"],
      rows: [
        ["513122", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "1.1.0.0", "K/1", "Rp 5.240.000", "Rp 524.000", "Rp 5.764.000", "Rp 40.348.000", "Valid Dukcapil"],
        ["513123", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "1.1.2.0", "K/2", "Rp 4.850.000", "Rp 679.000", "Rp 5.529.000", "Rp 38.703.000", "Valid Dukcapil"],
        ["513113", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti A.", "0.1.0.0", "TK/0", "Rp 3.450.000", "Rp 0", "Rp 3.450.000", "Rp 24.150.000", "Valid Dukcapil"]
      ],
      totalRows: 435670
    },
    {
      id: "BRD-4.5.20",
      category: "Pembayaran Pensiun & DAPEM",
      title: "Rekap Penghasilan Tahunan Peserta Pensiun",
      desc: "Rekapitulasi total penghasilan bruto setahun penuh untuk perhitungan PPh Pasal 17 tahunan, biaya pensiun maksimal Rp 2,4 jt, dan pengisian SPT.",
      columns: ["Kode MAK", "NIK", "NRP/NOPEN", "Nama Peserta", "Kode Jiwa", "PTKP", "Penghasilan Bruto Setahun", "Bulan Terima", "Biaya Pensiun", "Penghasilan Kena Pajak", "PPh Terutang Setahun"],
      rows: [
        ["513122", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "1.1.0.0", "K/1 (Rp 63 Jt)", "Rp 69.168.000", "12 Bulan", "Rp 2.400.000", "Rp 3.768.000", "Rp 188.400"],
        ["513123", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "1.1.2.0", "K/2 (Rp 67,5 Jt)", "Rp 66.348.000", "12 Bulan", "Rp 2.400.000", "Rp 0 (Nihil)", "Rp 0"],
        ["513113", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti A.", "0.1.0.0", "TK/0 (Rp 54 Jt)", "Rp 41.400.000", "12 Bulan", "Rp 2.070.000", "Rp 0 (Nihil)", "Rp 0"]
      ],
      totalRows: 435670
    },

    // --- KATEGORI 4: Perpajakan & Bukti Potong PPh 21 ---
    {
      id: "BRD-4.5.21",
      category: "Perpajakan & Bukti Potong PPh 21",
      title: "Rekap Perhitungan PPh 21 Bulanan (TER Masa Jan-Nov & P17 Peserta Berhenti)",
      desc: "Rincian pemotongan PPh 21 bulanan berdasarkan Tarif Efektif Rata-Rata (Kategori A, B, C) untuk Masa Januari s.d. November dan PPh Pasal 17 bagi peserta yang berhenti menerima pensiun sebelum Desember.",
      columns: ["NIK", "NRP/NOPEN", "Nama Peserta", "Masa Pajak", "Status PTKP", "Penghasilan Bruto", "Metode Perhitungan", "Tarif Berlaku", "PPh 21 TER / P17", "PPh Dipotong"],
      rows: [
        ["3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "Juli 2026", "K/1", "Rp 5.764.000", "TER Bulanan", "0,50%", "Rp 28.820", "Rp 28.820"],
        ["3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "Juli 2026", "K/2", "Rp 5.529.000", "TER Bulanan", "0,25%", "Rp 13.820", "Rp 13.820"],
        ["3271046708660002", "1966081406", "Letkol Inf Dedi S. (Berhenti Mei)", "Mei 2026", "K/0", "Rp 9.000.000", "Pasal 17 (Dapem Terakhir)", "P17 Nihil", "Rp 0", "Rp 0 (Lunas)"],
        ["3374045678900003", "196009871", "Purn. Pembina IV/a Siti A.", "Juli 2026", "TK/0", "Rp 3.450.000", "TER Bulanan", "0,00%", "Rp 0", "Rp 0"]
      ],
      totalRows: 435670
    },
    {
      id: "BRD-4.5.22",
      category: "Perpajakan & Bukti Potong PPh 21",
      title: "Rekap PPh Pasal 17 untuk DAPEM Bulan Desember",
      desc: "Perhitungan PPh 21 masa pajak Desember untuk menghitung selisih antara PPh Pasal 17 setahun penuh dengan akumulasi TER Jan-Nov (Kurang/Lebih Bayar).",
      columns: ["NIK", "NRP/NOPEN", "Nama Peserta", "Penghasilan Setahun", "PKP Setahun", "PPh Pasal 17 Setahun", "PPh Dipotong Jan-Nov", "PPh Potong Desember", "Status Pajak"],
      rows: [
        ["3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "Rp 69.168.000", "Rp 3.768.000", "Rp 188.400", "Rp 317.020", "-Rp 128.620", "Lebih Bayar (Dikembalikan)"],
        ["3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "Rp 66.348.000", "Rp 0", "Rp 0", "Rp 152.020", "-Rp 152.020", "Lebih Bayar (Dikembalikan)"],
        ["3374045678900003", "196009871", "Purn. Pembina IV/a Siti A.", "Rp 41.400.000", "Rp 0", "Rp 0", "Rp 0", "Rp 0", "Nihil"]
      ],
      totalRows: 435670
    },
    {
      id: "BRD-4.5.23",
      category: "Perpajakan & Bukti Potong PPh 21",
      title: "Rekapitulasi SPT Tahunan PPh 21 Badan PT ASABRI",
      desc: "Rekapitulasi PPh Pasal 17 tahunan yang menjadi basis pengisian formulir SPT Tahunan PPh 21 Badan ke portal DJP Online / Coretax.",
      columns: ["Tahun Pajak", "NPWP Pemotong", "Jumlah Wajib Pajak", "Total Bruto Penghasilan", "Total Biaya Pensiun", "Total PKP", "PPh Pasal 17 Terutang", "Status Pelaporan DJP"],
      rows: [
        ["TA 2026 (Proyeksi)", "01.001.624.4-092.000", "435.670 Peserta", "Rp 16.890,50 M", "Rp 1.045,60 M", "Rp 1.240,80 M", "Rp 62,04 M", "Siap Generate e-SPT"]
      ],
      totalRows: 1
    },
    {
      id: "BRD-4.5.24",
      category: "Perpajakan & Bukti Potong PPh 21",
      title: "Rekap Data Uang Kekurangan Pensiun (UKP) Bulanan",
      desc: "Rekapitulasi data penerimaan UKP peserta pensiun mencakup identitas, kode MAK, jenis UKP, bulan penghasilan diterima/dikembalikan, dan UKP neto.",
      columns: ["NIK", "Kode MAK", "NRP/NOPEN", "Nama Peserta", "Kode Jiwa", "PTKP", "Jenis UKP", "Bulan Diterima", "Bulan Dikembalikan", "UKP Neto Bulan Ini", "UKP Kumulatif Tahun Ini"],
      rows: [
        ["3171012345670001", "513122", "195801234", "Purn. Mayjen TNI Hendra", "1.1.0.0", "K/1", "Kenaikan Pangkat Purnawirawan", "3 Bulan", "0 Bulan", "Rp 1.850.000", "Rp 1.850.000"],
        ["3275098765430002", "513123", "196205432", "Purn. Kombes Pol Bambang", "1.1.2.0", "K/2", "Rapel Gaji Pokok", "2 Bulan", "0 Bulan", "Rp 1.240.000", "Rp 1.240.000"],
        ["3374045678900003", "513113", "196009871", "Purn. Pembina IV/a Siti A.", "0.1.0.0", "TK/0", "Susulan Tunjangan Anak", "4 Bulan", "1 Bulan", "Rp 850.000", "Rp 850.000"]
      ],
      totalRows: 8520
    },
    {
      id: "BRD-4.5.25",
      category: "Perpajakan & Bukti Potong PPh 21",
      title: "Perbandingan Nilai PPh 21 Metode TER vs Metode Pasal 17 (Audit SPI)",
      desc: "Laporan perbandingan dan audit yang menampilkan nilai PPh 21 menggunakan metode TER versus metode Pasal 17 untuk verifikasi keakuratan perhitungan.",
      columns: ["NIK", "NRP/NOPEN", "Nama Peserta", "Masa Pajak", "Penghasilan Bruto", "PPh Metode TER", "PPh Metode Pasal 17", "Selisih (TER - P17)", "% Selisih", "Keterangan Audit"],
      rows: [
        ["3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "Juli 2026", "Rp 5.764.000", "Rp 28.820", "Rp 15.700", "+Rp 13.120", "+83,5%", "Wajar (Skema TER Sesuai PMK 168)"],
        ["3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "Juli 2026", "Rp 5.529.000", "Rp 13.820", "Rp 0", "+Rp 13.820", "+100,0%", "Wajar (TER B Sesuai Batas PTKP)"],
        ["3374045678900003", "196009871", "Purn. Pembina IV/a Siti A.", "Juli 2026", "Rp 3.450.000", "Rp 0", "Rp 0", "Rp 0", "0,0%", "Identik (Nihil)"]
      ],
      totalRows: 435670
    },
    {
      id: "BRD-4.5.26",
      category: "Perpajakan & Bukti Potong PPh 21",
      title: "Daftar Distribusi Digital Bukti Potong PPh 21 (Form 1721-A2 Coretax)",
      desc: "Penerbitan bukti potong digital resmi bulanan dan tahunan yang dapat diunduh langsung oleh peserta pensiun via aplikasi mobile / portal peserta.",
      columns: ["No. Bukti Potong", "NIK", "NRP/NOPEN", "Nama Penerima", "Tahun Pajak", "Bruto Setahun", "PPh Dipotong", "Status NIK Dukcapil", "Status Unduh Peserta"],
      rows: [
        ["1.1-07.26-0000124", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "2026", "Rp 69.168.000", "Rp 188.400", "Terpadan 100%", "Tersedia di Aplikasi AMA"],
        ["1.1-07.26-0000125", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "2026", "Rp 66.348.000", "Rp 0", "Terpadan 100%", "Tersedia di Aplikasi AMA"],
        ["1.1-07.26-0000126", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti A.", "2026", "Rp 41.400.000", "Rp 0", "Terpadan 100%", "Tersedia di Aplikasi AMA"]
      ],
      totalRows: 435670
    },

    // --- KATEGORI 5: Anggaran, DIPA & Perbendaharaan ---
    {
      id: "BRD-4.5.09",
      category: "Anggaran, DIPA & Perbendaharaan",
      title: "Monitoring Sisa Pagu DIPA Belanja Pensiun Tahun Berjalan",
      desc: "Monitoring anggaran DIPA per 4 kelompok MAK secara real-time mencakup pagu awal, realisasi netto setelah kompensasi LB dan SUP, serta threshold sisa runway.",
      columns: ["Kode MAK", "Kelompok Belanja Pensiun", "Pagu DIPA", "Realisasi Netto", "Sisa Pagu", "% Serapan", "Status Ketahanan Runway"],
      rows: [
        ["513113", "Belanja Pensiun PNS Kemenhan", "Rp 944,00 M", "Rp 634,30 M", "Rp 309,70 M", "67,19%", "Aman (4,9 Bulan)"],
        ["513114", "Belanja Pensiun PNS Polri", "Rp 228,00 M", "Rp 151,90 M", "Rp 76,10 M", "66,62%", "Aman (5,0 Bulan)"],
        ["513122", "Belanja Pensiun TNI (AD/AL/AU)", "Rp 12.850,00 M", "Rp 8.648,10 M", "Rp 4.201,90 M", "67,30%", "Aman (4,9 Bulan)"],
        ["513123", "Belanja Pensiun POLRI", "Rp 7.820,00 M", "Rp 5.262,90 M", "Rp 2.557,10 M", "67,30%", "Aman (4,9 Bulan)"]
      ],
      totalRows: 4
    },
    {
      id: "BRD-4.5.10",
      category: "Anggaran, DIPA & Perbendaharaan",
      title: "Laporan Realisasi Pencairan SP2D (Rekonsiliasi DJPb)",
      desc: "Laporan pemadanan seluruh Surat Perintah Pencairan Dana (SP2D) dari Kemenkeu beserta nomor rekening tujuan dan status rekonsiliasi DJPb.",
      columns: ["No. SP2D", "Tgl SP2D", "Kode MAK", "Uraian Belanja", "Nilai SP2D", "Mitra Penyalur", "NTPN Kas Negara", "Status Rekon DJPb"],
      rows: [
        ["SP2D-2026/07/881", "01 Jul 2026", "513122", "Belanja Pensiun TNI", "Rp 1.235,40 M", "Bank BRI / Mandiri / BNI", "202607019912001", "Match (Selaras 100%)"],
        ["SP2D-2026/07/882", "01 Jul 2026", "513123", "Belanja Pensiun POLRI", "Rp 751,80 M", "Bank BRI / Mandiri / BSI", "202607019912002", "Match (Selaras 100%)"],
        ["SP2D-2026/07/883", "01 Jul 2026", "513113", "Belanja Pensiun PNS Kemhan", "Rp 90,60 M", "Bank BRI / Pos", "202607019912003", "Match (Selaras 100%)"],
        ["SP2D-2026/07/884", "01 Jul 2026", "513114", "Belanja Pensiun PNS Polri", "Rp 21,70 M", "Bank BRI / Mandiri", "202607019912004", "Match (Selaras 100%)"]
      ],
      totalRows: 48
    },
    {
      id: "BRD-4.5.11",
      category: "Anggaran, DIPA & Perbendaharaan",
      title: "Laporan Bukti NTPN Setoran ke Kas Negara",
      desc: "Daftar Nomor Transaksi Penerimaan Negara (NTPN) atas pengembalian sisa dana pensiun, retur SUP, kompensasi lebih bayar, dan setoran PPh/ASKES.",
      columns: ["NTPN", "Tgl Setor", "Jenis Setoran", "Kode MAK", "Nilai Setoran", "Bank Penyetor", "Keterangan"],
      rows: [
        ["NTPN-20260702-8871", "02 Jul 2026", "Setoran PPh 21 Masa Juni", "411121", "Rp 7.850.000.000", "Bank BRI", "PPh 21 TER Peserta Pensiun"],
        ["NTPN-20260703-9923", "03 Jul 2026", "Setoran Potongan BPJS Kesehatan", "811111", "Rp 28.790.000.000", "Bank Mandiri", "Iuran JKN 2% & 3% Pensiun"],
        ["NTPN-20260705-1104", "05 Jul 2026", "Pengembalian SUP 45 Hari", "513122", "Rp 3.450.000.000", "Bank BNI", "Retur Otentikasi Pasif"]
      ],
      totalRows: 120
    },

    // --- KATEGORI 6: BPJS Kesehatan ---
    {
      id: "BRD-4.5.07",
      category: "BPJS Kesehatan",
      title: "Laporan Kompensasi Lebih / Kurang BPJS Kesehatan Triwulanan",
      desc: "Laporan rekonsiliasi triwulanan antara target potongan iuran BPJS Kesehatan (Rekapitulasi III) dengan realisasi setoran kas negara untuk kompensasi.",
      columns: ["Kelompok Peserta", "Target Rekap III DAPEM", "Realisasi Setor NTPN", "Kompensasi (+/-)", "Status Rekonsiliasi", "Keterangan"],
      rows: [
        ["Prajurit TNI (AD, AL, AU)", "Rp 48.750.000.000", "Rp 48.750.000.000", "Rp 0", "Match (Selaras)", "Nihil Selisih"],
        ["Anggota POLRI", "Rp 32.400.000.000", "Rp 32.400.000.000", "Rp 0", "Match (Selaras)", "Nihil Selisih"],
        ["PNS & PPPK Kemhan/Polri", "Rp 5.220.000.000", "Rp 5.220.000.000", "Rp 0", "Match (Selaras)", "Nihil Selisih"]
      ],
      totalRows: 3
    },
    {
      id: "BRD-4.5.08",
      category: "BPJS Kesehatan",
      title: "Rekap Setoran Iuran BPJS Kesehatan Triwulanan per Bulan",
      desc: "Rincian bulanan setoran BPJS Kesehatan per kelompok peserta, mencakup jumlah peserta terpotong, nilai NTPN, dan tanggal settlement kas negara.",
      columns: ["Bulan", "Kelompok Peserta", "Jumlah Peserta", "Iuran Rekap III", "Iuran Disetor (NTPN)", "Tgl Setor", "Selisih"],
      rows: [
        ["Juli 2026", "TNI", "245.800", "Rp 16.250.000.000", "Rp 16.250.000.000", "03 Jul 2026", "Rp 0"],
        ["Juli 2026", "POLRI", "162.300", "Rp 10.800.000.000", "Rp 10.800.000.000", "03 Jul 2026", "Rp 0"],
        ["Juli 2026", "PNS Kemhan/Polri", "27.570", "Rp 1.740.000.000", "Rp 1.740.000.000", "03 Jul 2026", "Rp 0"],
        ["Juni 2026", "TNI", "245.200", "Rp 16.210.000.000", "Rp 16.210.000.000", "03 Jun 2026", "Rp 0"],
        ["Juni 2026", "POLRI", "161.900", "Rp 10.770.000.000", "Rp 10.770.000.000", "03 Jun 2026", "Rp 0"],
        ["Juni 2026", "PNS Kemhan/Polri", "27.510", "Rp 1.735.000.000", "Rp 1.735.000.000", "03 Jun 2026", "Rp 0"]
      ],
      totalRows: 12
    },

    // --- KATEGORI 7: Mitra Bayar, Taspen Life & Rekon CMS ---
    {
      id: "BRD-4.5.04",
      category: "Mitra Bayar, Taspen Life & Rekon CMS",
      title: "Monitoring Polis & Premi Taspen Life (TDS, TPB JKK, TPB JKm)",
      desc: "Monitoring status kepesertaan polis aktif, nominal premi bruto, dan penerimaan imbal jasa (fee base 2,5% - 3,0%) dari Taspen Life.",
      columns: ["No. Polis", "NRP/NOPEN", "Nama Peserta", "Program Taspen Life", "Premi Bulanan", "Tgl Mulai Polis", "Status Polis", "Imbal Jasa Diterima (Fee Base)"],
      rows: [
        ["TL-TDS-2026-00124", "198701234", "Purn. Kol. Ahmad Rifai", "Taspen Dwiguna Sejahtera", "Rp 6.000.000", "01 Jan 2026", "Polis Aktif", "Rp 150.000 (2,5%)"],
        ["TL-TPB-2026-00892", "199205678", "Purn. Letda Budi Kartono", "Proteksi Beasiswa JKK", "Rp 183.500", "01 Feb 2026", "Polis Aktif", "Rp 5.505 (3,0%)"],
        ["TL-TPB-2026-01205", "198604321", "Purn. AKP Siti Nurhaliza", "Proteksi Beasiswa JKm", "Rp 154.200", "01 Mar 2026", "Polis Aktif", "Rp 4.626 (3,0%)"]
      ],
      totalRows: 18540
    },
    {
      id: "BRD-4.5.14",
      category: "Mitra Bayar, Taspen Life & Rekon CMS",
      title: "Rekap Tagihan Imbal Jasa Mitra Bayar (TPB, TDS, Flagging & Autentikasi)",
      desc: "Perhitungan komprehensif imbal jasa mitra, faktur pajak PPN Nilai Lain (11/12 x 12%), PPh 23 (2%), dan denda keterlambatan BI Rate.",
      columns: ["Nama Mitra Bayar", "Jenis Layanan Imbal Jasa", "Nominal Bruto", "DPP PPN (11/12)", "PPN 12%", "PPh 23 (2%)", "Imbal Jasa Netto", "Status Tagihan"],
      rows: [
        ["Bank BRI", "Taspen Proteksi Beasiswa (TPB 3%)", "Rp 78.900.000", "Rp 72.325.000", "Rp 8.679.000", "Rp 1.578.000", "Rp 85.901.000", "Lunas Diterima"],
        ["Bank Mandiri", "Taspen Dwiguna Sejahtera (TDS 2,5%)", "Rp 513.000.000", "Rp 470.250.000", "Rp 56.430.000", "Rp 10.260.000", "Rp 559.170.000", "Lunas Diterima"],
        ["Bank BTN", "Flagging Kredit Pinjaman", "Rp 145.200.000", "Rp 133.100.000", "Rp 15.972.000", "Rp 2.904.000", "Rp 158.268.000", "Lunas Diterima"],
        ["Bank BSI", "Pemanfaatan Autentikasi Digital", "Rp 48.500.000", "Rp 44.458.000", "Rp 5.335.000", "Rp 970.000", "Rp 52.865.000", "Proses Rekonsiliasi"]
      ],
      totalRows: 16
    },
    {
      id: "BRD-4.5.15",
      category: "Mitra Bayar, Taspen Life & Rekon CMS",
      title: "Rekening Koran CMS Mitra Bayar (Format Standar ASABRI)",
      desc: "Pemadanan mutasi rekening koran perbankan mitra (THT, JKK, JKm, Pensiun) terhadap Surat Perintah (SP), DPS, dan kode bayar YANDU NG.",
      columns: ["Tgl Bayar", "Nama Mitra Bayar", "No. Rekening Giro", "Program Manfaat", "Trans Description", "Debet", "Credit", "Ledger Balance", "No. SP YANDU", "Status Matching"],
      rows: [
        ["06 Jul 2026", "Bank Mandiri", "124.00.0988776.2", "THT (BUP)", "Penyaluran Klaim BUP 142 Peserta", "Rp 17.750.000.000", "Rp 0", "Rp 802.250.000.000", "SP/2026/07/012", "Matched (100%)"],
        ["06 Jul 2026", "Bank BRI", "0210.01.000998.30.1", "THT & JKm", "Penyaluran Santunan JKm 88 Peserta", "Rp 3.696.000.000", "Rp 0", "Rp 646.304.000.000", "SP/2026/07/088", "Matched (100%)"],
        ["06 Jul 2026", "Bank BNI", "0198.88.776655.1", "JKK Perawatan", "Pembayaran Tagihan RS Provider", "Rp 1.450.000.000", "Rp 0", "Rp 418.550.000.000", "SP/2026/07/044", "Matched (100%)"]
      ],
      totalRows: 2480
    },
    {
      id: "BRD-4.5.16",
      category: "Mitra Bayar, Taspen Life & Rekon CMS",
      title: "Dashboard Real-Time Ketersediaan Dana di Rekening Mitra Bayar",
      desc: "Laporan monitoring ketersediaan saldo rekening giro mitra bayar vs kebutuhan Surat Perintah (SP) yang telah terbit untuk evaluasi kecukupan likuiditas.",
      columns: ["Nama Mitra Bayar", "No. Rekening Giro CMS", "Program Manfaat", "Saldo Tersedia", "Kebutuhan SP Terbit", "Selisih Likuiditas", "Status Likuiditas"],
      rows: [
        ["Bank Mandiri", "124.00.0988776.2", "THT, JKK, JKm", "Rp 820 M", "Rp 120 M", "+Rp 700 M", "■ AMAN"],
        ["Bank BRI", "0210.01.000998.30.1", "THT, JKK, JKm", "Rp 650 M", "Rp 95 M", "+Rp 555 M", "■ AMAN"],
        ["Bank BNI", "0198.88.776655.1", "THT, JKK Perawatan, JKm", "Rp 420 M", "Rp 80 M", "+Rp 340 M", "■ AMAN"],
        ["Bank BTN", "0012.01.500223.4", "THT, JKK", "Rp 180 M", "Rp 155 M", "+Rp 25 M", "▲ PERHATIAN"],
        ["PT Pos Indonesia", "098.22.441199.0", "THT, JKm (Wilayah 3T)", "Rp 45 M", "Rp 62 M", "-Rp 17 M", "● KRITIS"],
        ["Bank BSI", "7100.99.882233.1", "THT, JKK, JKm (Syariah)", "Rp 135 M", "Rp 40 M", "+Rp 95 M", "■ AMAN"]
      ],
      totalRows: 6
    }
  ];

  const kategoriList = [
    "Semua Kategori",
    "Iuran & Penagihan Kemenkeu",
    "Pembayaran Manfaat & Klaim Asuransi",
    "Pembayaran Pensiun & DAPEM",
    "Perpajakan & Bukti Potong PPh 21",
    "Anggaran, DIPA & Perbendaharaan",
    "BPJS Kesehatan",
    "Mitra Bayar, Taspen Life & Rekon CMS"
  ];

  // Filter available reports based on selected category
  const availableReports = selectedKategori === "Semua Kategori"
    ? allReportsData
    : allReportsData.filter(r => r.category === selectedKategori);

  // Active selected report
  const activeReport = allReportsData.find(r => r.id === selectedReportId) || availableReports[0] || allReportsData[0];

  const handleExport = (format) => {
    const fileName = `${activeReport.title.replace(/[^a-zA-Z0-9]/g, "_")}_${filterPeriode.replace(" ", "_")}.${format.toLowerCase()}`;
    setToastMessage(`Laporan "${activeReport.title}" berhasil di-export ke format ${format.toUpperCase()} (${fileName})`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1E293B",
            color: COLORS.white,
            padding: "14px 20px",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 13,
            borderLeft: `4px solid ${COLORS.green}`
          }}
        >
          <CheckCircle2 size={20} color={COLORS.green} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Panel 1: Filter & Dropdown Selector */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: "18px 20px",
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.blueDark, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={16} />
          <span>Parameter Laporan Resmi Divisi Keuangan (Sesuai BRD 4.5)</span>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          {/* Dropdown Kategori */}
          <Select
            label="1. Kategori Laporan"
            value={selectedKategori}
            onChange={(v) => {
              setSelectedKategori(v);
              const firstInCat = v === "Semua Kategori"
                ? allReportsData[0]
                : allReportsData.find(r => r.category === v);
              if (firstInCat) setSelectedReportId(firstInCat.id);
            }}
            options={kategoriList}
            minW={240}
          />

          {/* Dropdown Nama Laporan */}
          <div style={{ flex: 1, minWidth: 340 }}>
            <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4, fontWeight: 600 }}>
              2. Pilih Jenis Laporan ({availableReports.length} Laporan Tersedia)
            </label>
            <select
              value={activeReport.id}
              onChange={(e) => setSelectedReportId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 13,
                color: COLORS.gray900,
                background: COLORS.white,
                fontWeight: 600,
                outline: "none"
              }}
            >
              {availableReports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4, fontWeight: 600 }}>
              Tanggal Awal
            </label>
            <input
              type="date"
              value={tglAwal}
              onChange={(e) => setTglAwal(e.target.value)}
              style={{
                padding: "7px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12.5,
                color: COLORS.gray800,
                background: COLORS.white
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4, fontWeight: 600 }}>
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={tglAkhir}
              onChange={(e) => setTglAkhir(e.target.value)}
              style={{
                padding: "7px 10px",
                borderRadius: 6,
                border: `1px solid ${COLORS.gray300}`,
                fontSize: 12.5,
                color: COLORS.gray800,
                background: COLORS.white
              }}
            />
          </div>

          {/* Filter Satker */}
          <Select
            label="Satker / Instansi"
            value={filterSatker}
            onChange={setFilterSatker}
            options={["Semua Instansi", "TNI AD", "TNI AL", "TNI AU", "Mabes TNI", "POLRI", "Kemenhan (PNS/PPPK)"]}
            minW={160}
          />
        </div>
      </div>

      {/* Panel 2: Preview Tabel & Export Buttons */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: 20,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}
      >
        {/* Header Preview & Action Export */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: `1px solid ${COLORS.gray200}`,
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.gray900 }}>
                {activeReport.title}
              </h3>
            </div>
            <div style={{ fontSize: 12, color: COLORS.gray500 }}>
              Kategori: <strong>{activeReport.category}</strong> • Periode: <strong>{filterPeriode}</strong> • Filter: <strong>{filterSatker}</strong>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => handleExport("PDF")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "#BE123C",
                color: COLORS.white,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 6px rgba(183,28,28,0.3)"
              }}
            >
              <FileText size={15} /> Export PDF
            </button>

            <button
              onClick={() => handleExport("XLSX")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "#1B5E20",
                color: COLORS.white,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 6px rgba(27,94,32,0.3)"
              }}
            >
              <FileSpreadsheet size={15} /> Export Excel
            </button>
          </div>
        </div>

        {/* Short Description */}
        <div style={{ fontSize: 12.5, color: COLORS.gray700, marginBottom: 16, background: COLORS.gray50, padding: "10px 14px", borderRadius: 6, border: `1px solid ${COLORS.gray200}` }}>
          ℹ️ <strong>Deskripsi Laporan:</strong> {activeReport.desc}
        </div>

        {/* Live Table Preview */}
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={activeReport.columns}
            data={activeReport.rows.map((row) =>
              row.map((cell, idx) => {
                if (idx === 0) return <span style={{ fontWeight: 600 }}>{cell}</span>;
                if (typeof cell === "string" && (cell.startsWith("Rp") || cell.startsWith("+Rp") || cell.startsWith("-Rp"))) {
                  return <span style={{ fontFamily: "monospace", fontWeight: idx === row.length - 1 ? 700 : 500 }}>{cell}</span>;
                }
                return cell;
              })
            )}
          />
        </div>

        {/* Footer Info */}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: COLORS.gray500 }}>
          <span>Menampilkan sampel data pratinjau ({activeReport.rows.length} dari {activeReport.totalRows} baris transaksi).</span>
          <span>Format dokumen terverifikasi selaras standar BRD Poin 4.5 dan siap di-generate ke laporan resmi.</span>
        </div>
      </div>
    </div>
  );
};
