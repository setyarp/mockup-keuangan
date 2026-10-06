// Data master dan spesifikasi teknis 22 Laporan Resmi Divisi Keuangan sesuai BRD Poin 4.5

export const BRD_REPORTS_DATA = [
  // =========================================================================
  // 1. BRD 4.5.1 - Rekapitulasi Pembayaran Klaim Asuransi Sosial Per Mitra Bayar
  // =========================================================================
  {
    id: "BRD-4.5.1",
    section: "4.5.1",
    title: "Rekapitulasi Pembayaran Klaim Asuransi Sosial Per Mitra Bayar",
    category: "Pembayaran Manfaat & Klaim",
    jenis: "Operasional, Regulatori",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan (Bidang Yarpen/Yarpro)",
    prioritas: "KRITIS",
    desc: "Laporan utama yang merekap pembayaran untuk setiap klaim manfaat program (THT, JKK, JKm, Pensiun, dan NTIP) yang dibayarkan melalui setiap Mitra Bayar dalam periode tertentu.",
    outputFormats: ["Excel (XLSX)", "PDF", "CSV"],
    columns: [
      "No.",
      "Nama Mitra Bayar",
      "Jenis Pembayaran",
      "Periode Pembayaran",
      "Jumlah Penerima",
      "Total Nilai SP",
      "Total Potongan BPJS",
      "Total Potongan Non-TGR",
      "Total Potongan Lainnya",
      "Total Netto Dibayarkan",
      "Nomor SP2D",
      "Tanggal Cair",
      "NTPN"
    ],
    rows: [
      ["1", "Bank Mandiri", "THT (BUP) & Pensiun Pertama", "Juli 2026", "1.240", "Rp 87.500.000.000", "Rp 1.750.000.000", "Rp 450.000.000", "Rp 120.000.000", "Rp 85.180.000.000", "SP2D-2026-0711", "02 Jul 2026", "019827364501"],
      ["2", "Bank BRI", "THT, JKK Perawatan & UDW", "Juli 2026", "980", "Rp 68.200.000.000", "Rp 1.364.000.000", "Rp 320.000.000", "Rp 85.000.000", "Rp 66.431.000.000", "SP2D-2026-0712", "02 Jul 2026", "019827364502"],
      ["3", "Bank BNI", "JKM (Santunan & Beasiswa)", "Juli 2026", "640", "Rp 44.800.000.000", "Rp 896.000.000", "Rp 180.000.000", "Rp 42.000.000", "Rp 43.682.000.000", "SP2D-2026-0713", "03 Jul 2026", "019827364503"],
      ["4", "Bank BTN", "THT & DAPEM Susulan", "Juli 2026", "510", "Rp 35.700.000.000", "Rp 714.000.000", "Rp 150.000.000", "Rp 30.000.000", "Rp 34.806.000.000", "SP2D-2026-0714", "03 Jul 2026", "019827364504"],
      ["5", "Bank BSI", "NTIP & THT Syariah", "Juli 2026", "380", "Rp 24.600.000.000", "Rp 492.000.000", "Rp 98.000.000", "Rp 22.000.000", "Rp 23.988.000.000", "SP2D-2026-0715", "04 Jul 2026", "019827364505"],
      ["6", "PT Pos Indonesia", "Non-DAPEM Wilayah 3T", "Juli 2026", "320", "Rp 18.400.000.000", "Rp 368.000.000", "Rp 90.000.000", "Rp 15.000.000", "Rp 17.927.000.000", "SP2D-2026-0716", "04 Jul 2026", "019827364506"]
    ],
    summaryCards: [
      { label: "Total Penerima Manfaat", value: "4.070 Orang", color: "blue" },
      { label: "Total Nilai SP Bruto", value: "Rp 279,20 M", color: "indigo" },
      { label: "Total Potongan (BPJS + Non-TGR)", value: "Rp 7,19 M", color: "amber" },
      { label: "Total Netto Cair", value: "Rp 272,01 M", color: "green" }
    ]
  },

  // =========================================================================
  // 2. BRD 4.5.3 - Rekapitulasi Klaim JKK Perawatan secara real-time
  // =========================================================================
  {
    id: "BRD-4.5.3",
    section: "4.5.3",
    title: "Rekapitulasi Klaim JKK Perawatan secara Real-Time",
    category: "Pembayaran Manfaat & Klaim",
    jenis: "Operasional",
    frekuensi: "Bulanan, On-Demand",
    pengguna: "Div. Keuangan (Bidang Yarpro)",
    prioritas: "TINGGI",
    desc: "Rekapitulasi volume klaim masuk, klaim selesai, klaim pending, total tagihan RS provider, reimbursement peserta, dan total Surat Perintah (SP) yang diterbitkan per RS Provider secara real-time.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "RS Provider",
      "Periode",
      "Jumlah Klaim Masuk",
      "Jumlah Klaim Selesai",
      "Jumlah Klaim Pending",
      "Total Tagihan RS Provider",
      "Total Reimburse Peserta",
      "Total Nilai SP yang Diterbitkan"
    ],
    rows: [
      ["1", "RSPAD Gatot Soebroto Jakarta", "Juli 2026", "48 Berkas", "45 Berkas", "3 Berkas", "Rp 485.200.000", "Rp 12.500.000", "Rp 497.700.000"],
      ["2", "RSAL Dr. Ramelan Surabaya", "Juli 2026", "32 Berkas", "30 Berkas", "2 Berkas", "Rp 312.400.000", "Rp 8.200.000", "Rp 320.600.000"],
      ["3", "RS Bhayangkara Tk I Pusdokkes Jakarta", "Juli 2026", "28 Berkas", "27 Berkas", "1 Berkas", "Rp 274.800.000", "Rp 5.400.000", "Rp 280.200.000"],
      ["4", "RSAU Dr. M. Salamun Bandung", "Juli 2026", "18 Berkas", "18 Berkas", "0 Berkas", "Rp 165.000.000", "Rp 4.100.000", "Rp 169.100.000"],
      ["5", "RS Tk. II Putri Hijau Kesdam I/BB Medan", "Juli 2026", "14 Berkas", "12 Berkas", "2 Berkas", "Rp 128.900.000", "Rp 3.200.000", "Rp 132.100.000"],
      ["6", "RS Tk. II Pelamonia Makassar", "Juli 2026", "12 Berkas", "11 Berkas", "1 Berkas", "Rp 98.400.000", "Rp 2.800.000", "Rp 101.200.000"]
    ],
    summaryCards: [
      { label: "Total Klaim Masuk", value: "152 Berkas", color: "blue" },
      { label: "Klaim Selesai Verifikasi", value: "143 Berkas (94,1%)", color: "green" },
      { label: "Total Tagihan RS", value: "Rp 1,46 M", color: "indigo" },
      { label: "Total SP Diterbitkan", value: "Rp 1,50 M", color: "purple" }
    ]
  },

  // =========================================================================
  // 3. BRD 4.5.5 - Laporan Utang Non-TGR dan Bukti SSBP/SSPB
  // =========================================================================
  {
    id: "BRD-4.5.5",
    section: "4.5.5",
    title: "Laporan Utang Non-TGR dan Bukti SSBP/SSPB",
    category: "Pembayaran Manfaat & Klaim",
    jenis: "Operasional, Regulatori",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Laporan yang mencatat seluruh potongan Non-TGR (bukan Tuntutan Ganti Rugi) yang dipotong dari klaim peserta beserta bukti setorannya ke Kas Negara melalui Surat Setoran Bukan Pajak / Penerimaan.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "NRP/Nopens",
      "Nama Peserta",
      "Jenis Klaim",
      "No. SP",
      "Tanggal SP",
      "Total Nilai SP",
      "Potongan Non-TGR",
      "NTPN SSBP",
      "Tanggal Setor"
    ],
    rows: [
      ["1", "197801234", "Kol. Purn. Heru Prasetyo", "THT (BUP)", "SP/2026/07/041", "02 Jul 2026", "Rp 145.000.000", "Rp 4.500.000", "019827364501", "03 Jul 2026"],
      ["2", "198205432", "Mayor Purn. Bambang Sutrisno", "THT (BUP)", "SP/2026/07/042", "03 Jul 2026", "Rp 112.000.000", "Rp 3.200.000", "019827364502", "04 Jul 2026"],
      ["3", "199009871", "Kapten Purn. Slamet Riyadi", "Santunan JKm", "SP/2026/07/043", "05 Jul 2026", "Rp 42.000.000", "Rp 1.800.000", "019827364503", "06 Jul 2026"],
      ["4", "198511223", "Peltu Purn. Agus Budiman", "THT (BUP)", "SP/2026/07/044", "07 Jul 2026", "Rp 68.500.000", "Rp 2.100.000", "019827364504", "08 Jul 2026"],
      ["5", "199403456", "Serma Purn. Joko Widodo", "THT & UDW", "SP/2026/07/045", "10 Jul 2026", "Rp 54.000.000", "Rp 1.500.000", "019827364505", "11 Jul 2026"],
      ["6", "197508990", "Letkol Purn. Dedi Sukardi", "THT (BUP)", "SP/2026/07/046", "12 Jul 2026", "Rp 128.000.000", "Rp 3.800.000", "019827364506", "14 Jul 2026"]
    ],
    summaryCards: [
      { label: "Total Transaksi Non-TGR", value: "6 Berkas", color: "blue" },
      { label: "Total Potongan Disetor", value: "Rp 16.900.000", color: "amber" },
      { label: "Status Setoran NTPN", value: "100% Terverifikasi", color: "green" }
    ]
  },

  // =========================================================================
  // 4. BRD 4.5.6 - Rekap Potongan Utang Per UO/Kode Satker
  // =========================================================================
  {
    id: "BRD-4.5.6",
    section: "4.5.6",
    title: "Rekap Potongan Utang Per UO / Kode Satker",
    category: "Pembayaran Manfaat & Klaim",
    jenis: "Operasional",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Rekapitulasi potongan kewajiban utang peserta (BPJS Kesehatan, PUM KPR, Non-TGR, dan potongan lainnya) yang dikelompokkan per unit organisasi (UO) dan satuan kerja induk.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Kode UO/Satker",
      "Nama Satker",
      "Jumlah Peserta dengan Potongan",
      "Total Potongan BPJS",
      "Total Potongan PUM KPR",
      "Total Potongan Non-TGR",
      "Total Potongan Lainnya",
      "Total Semua Potongan"
    ],
    rows: [
      ["1", "UO-01", "Mabes TNI Angkatan Darat", "420 Peserta", "Rp 124.500.000", "Rp 480.200.000", "Rp 65.400.000", "Rp 18.200.000", "Rp 688.300.000"],
      ["2", "UO-02", "Mabes TNI Angkatan Laut", "180 Peserta", "Rp 54.200.000", "Rp 210.500.000", "Rp 28.100.000", "Rp 8.400.000", "Rp 301.200.000"],
      ["3", "UO-03", "Mabes TNI Angkatan Udara", "150 Peserta", "Rp 45.000.000", "Rp 175.000.000", "Rp 22.500.000", "Rp 6.800.000", "Rp 249.300.000"],
      ["4", "UO-04", "Kepolisian Negara Republik Indonesia", "580 Peserta", "Rp 172.000.000", "Rp 640.000.000", "Rp 89.000.000", "Rp 25.000.000", "Rp 926.000.000"],
      ["5", "UO-05", "Kementerian Pertahanan RI", "210 Peserta", "Rp 62.500.000", "Rp 235.400.000", "Rp 31.200.000", "Rp 9.100.000", "Rp 338.200.000"],
      ["6", "UO-06", "Mabes TNI (Tri Matra)", "95 Peserta", "Rp 28.400.000", "Rp 112.000.000", "Rp 14.500.000", "Rp 4.200.000", "Rp 159.100.000"]
    ],
    summaryCards: [
      { label: "Total Peserta Terpotong", value: "1.635 Peserta", color: "blue" },
      { label: "Potongan PUM KPR", value: "Rp 1,85 M", color: "indigo" },
      { label: "Potongan BPJS", value: "Rp 486,60 Jt", color: "purple" },
      { label: "Grand Total Potongan", value: "Rp 2,66 M", color: "green" }
    ]
  },

  // =========================================================================
  // 5. BRD 4.5.7 - Laporan Kompensasi Lebih/Kurang BPJS Kesehatan
  // =========================================================================
  {
    id: "BRD-4.5.7",
    section: "4.5.7",
    title: "Laporan Kompensasi Lebih / Kurang BPJS Kesehatan",
    category: "BPJS Kesehatan",
    jenis: "Rekonsiliasi, Regulatori",
    frekuensi: "Triwulanan",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Dokumen Rekonsiliasi Iuran BPJS Kesehatan (ASKES) diselaraskan langsung dengan 4 MAK DAPEM Resmi (Rekapitulasi III) untuk didistribusikan ke BPJS Kesehatan dan DJPb Kemenkeu.",
    outputFormats: ["Excel (XLSX)", "PDF (Dokumen Rekon DJPb)"],
    hasSubViews: true,
    subViewOptions: [
      { id: "rekap", label: "Rekap Per MAK DAPEM (Rekapitulasi III)" },
      { id: "detail", label: "Detail Nominatif Peserta" },
      { id: "setoran", label: "Riwayat Setoran NTPN Kas Negara" }
    ],
    columns: [
      "NO",
      "KODE MAK",
      "KELOMPOK PENSIUN DAPEM",
      "TOTAL JIWA",
      "TARGET REKAP III (ASKES)",
      "REALISASI SETORAN",
      "KOMPENSASI (+/-)",
      "STATUS"
    ],
    rows: [
      ["1", "513113", "Pensiunan PNS Kemenhan (513113)", "2.160 Jiwa", "Rp 52.880.600", "Rp 52.880.600", "Rp 0", "Match (Selaras)"],
      ["2", "513114", "Pensiunan PNS POLRI (513114)", "522 Jiwa", "Rp 12.399.100", "Rp 12.399.100", "Rp 0", "Match (Selaras)"],
      ["3", "513122", "Pensiunan TNI (513122)", "8.806 Jiwa", "Rp 192.179.800", "Rp 192.179.800", "Rp 0", "Match (Selaras)"],
      ["4", "513123", "Pensiunan POLRI (513123)", "5.948 Jiwa", "Rp 98.358.279", "Rp 98.358.279", "Rp 0", "Match (Selaras)"]
    ],
    variantData: {
      detail: {
        columns: [
          "NRP/NIP",
          "Nama Peserta",
          "Kode MAK",
          "Kelompok DAPEM",
          "Unor / Satker",
          "Target Rekap III",
          "Realisasi Potong",
          "Kompensasi (+/-)",
          "Keterangan"
        ],
        rows: [
          ["198701234", "Purn. Kol. Inf. Ahmad Fauzi", "513122", "PENS TNI", "Kodam Jaya", "Rp 38.500", "Rp 38.500", "Rp 0", "Sesuai Plafon Maksimum"],
          ["197803456", "Purn. Letkol Laut Bambang Suharto", "513122", "PENS TNI", "Koarmada I", "Rp 36.200", "Rp 36.200", "Rp 0", "Sesuai Plafon Maksimum"],
          ["198512345", "Purn. AKP Dedi Kurniawan", "513123", "PENS POLRI", "Polda Jabar", "Rp 28.500", "Rp 28.500", "Rp 0", "Potongan 2% Gaji Pensiun"],
          ["198802345", "Purn. Bripka Anwar Ibrahim", "513123", "PENS POLRI", "Polda Jateng", "Rp 24.200", "Rp 24.200", "Rp 0", "Potongan 2% Gaji Pensiun"],
          ["198604321", "Purn. Penata Tk.I Siti Nurhaliza", "513113", "PENS PNS KEMHAN", "Ditjen Renhan", "Rp 26.500", "Rp 26.500", "Rp 0", "Potongan 2% Gaji Pensiun"],
          ["198211111", "Purn. Pembina Dr. Ratna Dewi", "513113", "PENS PNS KEMHAN", "Itjen Kemhan", "Rp 32.000", "Rp 32.000", "Rp 0", "Potongan 2% Gaji Pensiun"],
          ["199205678", "Purn. Penata Budi Utomo", "513114", "PENS PNS POLRI", "Mabes Polri", "Rp 25.800", "Rp 25.800", "Rp 0", "Potongan 2% Gaji Pensiun"],
          ["199012345", "Purn. Pengatur Tk.I Hendra W.", "513114", "PENS PNS POLRI", "Polda Metro Jaya", "Rp 21.400", "Rp 21.400", "Rp 0", "Potongan 2% Gaji Pensiun"]
        ]
      },
      setoran: {
        columns: [
          "No.",
          "Bulan",
          "Kelompok Peserta",
          "Jumlah Peserta",
          "Total Iuran (Rekap III)",
          "Iuran yang Dipotong dari Dapem",
          "Iuran yang Disetor (NTPN)",
          "Tanggal Setor",
          "Selisih"
        ],
        rows: [
          ["1", "Juni 2026", "PENS PNS KEMHAN (513113)", "2.160 Jiwa", "Rp 52.880.600", "Rp 52.880.600", "Rp 52.880.600 (NTPN: 761928005288CDEF)", "10 Jun 2026", "Rp 0"],
          ["2", "Juni 2026", "PENS PNS POLRI (513114)", "522 Jiwa", "Rp 12.399.100", "Rp 12.399.100", "Rp 12.399.100 (NTPN: 651837001239DEFG)", "10 Jun 2026", "Rp 0"],
          ["3", "Juni 2026", "PENS TNI (513122)", "8.806 Jiwa", "Rp 192.179.800", "Rp 192.179.800", "Rp 192.179.800 (NTPN: 981245019217ABCD)", "10 Jun 2026", "Rp 0"],
          ["4", "Juni 2026", "PENS POLRI (513123)", "5.948 Jiwa", "Rp 98.358.279", "Rp 98.358.279", "Rp 98.358.279 (NTPN: 871239009835BCDE)", "10 Jun 2026", "Rp 0"]
        ]
      }
    },
    summaryCards: [
      { label: "Target Rekap III Triwulan", value: "Rp 355,82 Jt", color: "blue" },
      { label: "Realisasi Setoran Kas Negara", value: "Rp 355,82 Jt", color: "green" },
      { label: "Kompensasi Lebih/Kurang", value: "Rp 0 (Match)", color: "purple" }
    ]
  },

  // =========================================================================
  // 6. BRD 4.5.9 - Rekap Setoran Iuran BPJS Kesehatan Triwulanan
  // =========================================================================
  {
    id: "BRD-4.5.9",
    section: "4.5.9",
    title: "Rekap Setoran Iuran BPJS Kesehatan Triwulanan",
    category: "BPJS Kesehatan",
    jenis: "Regulatori, Rekonsiliasi",
    frekuensi: "Triwulanan",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Rincian bulanan setoran BPJS Kesehatan per kelompok peserta mencakup jumlah peserta, total iuran Rekap III, iuran dipotong DAPEM, dan realisasi disetor ke kas negara beserta NTPN.",
    outputFormats: ["Excel (XLSX)", "PDF (Rekonsiliasi BPJS & DJPb)"],
    columns: [
      "No.",
      "Bulan",
      "Kelompok Peserta",
      "Jumlah Peserta",
      "Total Iuran (Rekap III)",
      "Iuran yang Dipotong dari Dapem",
      "Iuran yang Disetor (NTPN)",
      "Tanggal Setor",
      "Selisih"
    ],
    rows: [
      ["1", "Juni 2026", "PENS PNS KEMHAN (513113)", "2.160 Jiwa", "Rp 52.880.600", "Rp 52.880.600", "Rp 52.880.600 (NTPN: 761928005288CDEF)", "10 Jun 2026", "Rp 0"],
      ["2", "Juni 2026", "PENS PNS POLRI (513114)", "522 Jiwa", "Rp 12.399.100", "Rp 12.399.100", "Rp 12.399.100 (NTPN: 651837001239DEFG)", "10 Jun 2026", "Rp 0"],
      ["3", "Juni 2026", "PENS TNI (513122)", "8.806 Jiwa", "Rp 192.179.800", "Rp 192.179.800", "Rp 192.179.800 (NTPN: 981245019217ABCD)", "10 Jun 2026", "Rp 0"],
      ["4", "Juni 2026", "PENS POLRI (513123)", "5.948 Jiwa", "Rp 98.358.279", "Rp 98.358.279", "Rp 98.358.279 (NTPN: 871239009835BCDE)", "10 Jun 2026", "Rp 0"]
    ],
    summaryCards: [
      { label: "Total Iuran Triwulan", value: "Rp 355,82 Jt", color: "blue" },
      { label: "Total Disetor ke Kasda", value: "Rp 355,82 Jt", color: "green" },
      { label: "Tingkat Akurasi Rekon", value: "100.0% (Nihil Selisih)", color: "purple" }
    ]
  },

  // =========================================================================
  // 7. BRD 4.5.10 - Tabel 14 — Laporan Realisasi Pencairan SP2D
  // =========================================================================
  {
    id: "BRD-4.5.10",
    section: "4.5.10",
    title: "Tabel 14 — Laporan Realisasi Pencairan SP2D",
    category: "Perbendaharaan & Kas Negara",
    jenis: "Regulatori, Rekonsiliasi",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan",
    prioritas: "KRITIS",
    desc: "Laporan yang memuat seluruh SP2D yang telah dicairkan dalam periode tertentu beserta detail transaksinya, digunakan untuk rekonsiliasi dengan DJPb Kemenkeu.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Nomor SP2D",
      "Tanggal SP2D",
      "MAK",
      "Uraian",
      "Nilai SP2D",
      "Mitra Bayar Penyalur",
      "Nomor Rekening Tujuan",
      "NTPN",
      "Tanggal Cair",
      "Status Rekonsiliasi dengan DJPb"
    ],
    rows: [
      ["1", "SP2D-2026/07/881", "01 Jul 2026", "513122", "Belanja Pensiun TNI Gaji Induk", "Rp 1.235.400.000.000", "Bank BRI / Mandiri / BNI", "124.00.0988776.2", "202607019912001", "01 Jul 2026", "Match (Selaras 100%)"],
      ["2", "SP2D-2026/07/882", "01 Jul 2026", "513123", "Belanja Pensiun POLRI Gaji Induk", "Rp 751.800.000.000", "Bank BRI / Mandiri / BSI", "0210.01.000998.30.1", "202607019912002", "01 Jul 2026", "Match (Selaras 100%)"],
      ["3", "SP2D-2026/07/883", "01 Jul 2026", "513113", "Belanja Pensiun PNS Kemhan", "Rp 90.600.000.000", "Bank BRI / Pos Indonesia", "0198.88.776655.1", "202607019912003", "01 Jul 2026", "Match (Selaras 100%)"],
      ["4", "SP2D-2026/07/884", "01 Jul 2026", "513114", "Belanja Pensiun PNS Polri", "Rp 21.700.000.000", "Bank BRI / Bank Mandiri", "0012.01.500223.4", "202607019912004", "01 Jul 2026", "Match (Selaras 100%)"],
      ["5", "SP2D-2026/07/885", "10 Jul 2026", "513122", "Belanja Pensiun TNI Susulan", "Rp 42.500.000.000", "Bank BNI / Mandiri", "124.00.0988776.2", "202607109912005", "10 Jul 2026", "Match (Selaras 100%)"],
      ["6", "SP2D-2026/07/886", "10 Jul 2026", "513123", "Belanja Pensiun POLRI Susulan", "Rp 25.800.000.000", "Bank BRI / BSI", "0210.01.000998.30.1", "202607109912006", "10 Jul 2026", "Match (Selaras 100%)"]
    ],
    summaryCards: [
      { label: "Total SP2D Terbit", value: "6 Dokumen", color: "blue" },
      { label: "Total Nilai SP2D Cair", value: "Rp 2.167,80 M", color: "indigo" },
      { label: "Status Rekonsiliasi DJPb", value: "100% Cocok (Matched)", color: "green" }
    ]
  },

  // =========================================================================
  // 8. BRD 4.5.11 - Laporan Bukti NTPN Setoran ke Kas Negara
  // =========================================================================
  {
    id: "BRD-4.5.11",
    section: "4.5.11",
    title: "Laporan Bukti NTPN Setoran ke Kas Negara",
    category: "Perbendaharaan & Kas Negara",
    jenis: "Regulatori",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Daftar Nomor Transaksi Penerimaan Negara (NTPN) atas pengembalian sisa dana pensiun, retur SUP, kompensasi lebih bayar, dan setoran potongan PPh/ASKES.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "NTPN",
      "Tanggal Setor",
      "Jenis Setoran",
      "Kode MAK",
      "Nilai Setoran",
      "Bank Penyetor",
      "Keterangan"
    ],
    rows: [
      ["1", "NTPN-20260702-8871", "02 Jul 2026", "Setoran PPh 21 Masa Juni", "411121", "Rp 7.850.000.000", "Bank BRI", "PPh 21 TER Peserta Pensiun Masa Juni"],
      ["2", "NTPN-20260703-9923", "03 Jul 2026", "Setoran Potongan BPJS Kesehatan", "811111", "Rp 28.790.000.000", "Bank Mandiri", "Iuran JKN 2% & 3% Gaji Pensiun Induk"],
      ["3", "NTPN-20260705-1104", "05 Jul 2026", "Pengembalian Sisa SUP 45 Hari", "513122", "Rp 3.450.000.000", "Bank BNI", "Retur Otentikasi Pasif TNI AD"],
      ["4", "NTPN-20260706-2215", "06 Jul 2026", "Setoran Potongan Non-TGR", "425111", "Rp 2.450.000.000", "Bank Mandiri", "SSBP Potongan Klaim THT Peserta"],
      ["5", "NTPN-20260708-3326", "08 Jul 2026", "Pengembalian Lebih Bayar Pensiun", "513123", "Rp 850.000.000", "Bank BRI", "Koreksi Pelaporan Meninggal Dunia"],
      ["6", "NTPN-20260710-4437", "10 Jul 2026", "Setoran Denda Keterlambatan Imbal Jasa", "425119", "Rp 45.200.000", "Bank BTN", "Denda Keterlambatan Flagging Kredit"]
    ],
    summaryCards: [
      { label: "Total Transaksi NTPN", value: "6 Setoran", color: "blue" },
      { label: "Total Nilai Setoran Kasda", value: "Rp 43,43 M", color: "green" },
      { label: "Status Settlement", value: "100% Settled di MPN G3", color: "purple" }
    ]
  },

  // =========================================================================
  // 9. BRD 4.5.12 - Rekap Biaya Operasional Pembayaran Dapem Induk dan Susulan
  // =========================================================================
  {
    id: "BRD-4.5.12",
    section: "4.5.12",
    title: "Rekap Biaya Operasional Pembayaran Dapem Induk dan Susulan",
    category: "Pembayaran Pensiun & DAPEM",
    jenis: "Operasional",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan",
    prioritas: "SEDANG",
    desc: "Perhitungan alokasi fee biaya operasional penyelenggaraan (BOP) pembayaran pensiun bulanan kepada mitra perbankan/pos per jenis DAPEM.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Mitra Bayar",
      "Jenis Dapem",
      "Periode",
      "Jumlah Penerima",
      "Total Nilai Dapem",
      "Biaya Operasional (BOP)",
      "Persentase BOP",
      "Dasar Perhitungan BOP"
    ],
    rows: [
      ["1", "Bank BRI", "DAPEM Induk", "Juli 2026", "195.400", "Rp 645.800.000.000", "Rp 3.229.000.000", "0,50%", "Pagu Belanja Pensiun Induk"],
      ["2", "Bank Mandiri", "DAPEM Induk", "Juli 2026", "110.200", "Rp 364.500.000.000", "Rp 1.822.500.000", "0,50%", "Pagu Belanja Pensiun Induk"],
      ["3", "Bank BNI", "DAPEM Induk", "Juli 2026", "68.500", "Rp 226.400.000.000", "Rp 1.132.000.000", "0,50%", "Pagu Belanja Pensiun Induk"],
      ["4", "Bank BSI", "DAPEM Induk", "Juli 2026", "29.670", "Rp 98.200.000.000", "Rp 491.000.000", "0,50%", "Pagu Belanja Pensiun Induk"],
      ["5", "PT Pos Indonesia", "DAPEM Induk & 3T", "Juli 2026", "31.900", "Rp 105.700.000.000", "Rp 528.500.000", "0,50%", "Pagu Belanja Pensiun Induk"],
      ["6", "Bank BRI", "DAPEM Susulan", "Juli 2026", "8.500", "Rp 28.050.000.000", "Rp 140.250.000", "0,50%", "DAPEM Susulan Pasca-Oten"],
      ["7", "Bank Mandiri", "DAPEM Susulan", "Juli 2026", "5.700", "Rp 18.750.000.000", "Rp 93.750.000", "0,50%", "DAPEM Susulan Pasca-Oten"]
    ],
    summaryCards: [
      { label: "Total Penerima DAPEM", value: "449.870 Orang", color: "blue" },
      { label: "Total Nilai DAPEM", value: "Rp 1.487,40 M", color: "indigo" },
      { label: "Total Alokasi BOP (0,5%)", value: "Rp 7,43 M", color: "amber" }
    ]
  },

  // =========================================================================
  // 10. BRD 4.5.13 - Laporan Monitoring Penagihan UDW Punah
  // =========================================================================
  {
    id: "BRD-4.5.13",
    section: "4.5.13",
    title: "Laporan Monitoring Penagihan UDW Punah",
    category: "Pembayaran Manfaat & Klaim",
    jenis: "Operasional",
    frekuensi: "Bulanan, On-Demand",
    pengguna: "Div. Keuangan, Div. Pelayanan, Div. Kepesertaan",
    prioritas: "TINGGI",
    desc: "Laporan monitoring status penagihan kembali Uang Duka Wafat (UDW) yang telah dibayarkan kepada peserta yang teridentifikasi sebagai UDW Punah (tanpa ahli waris yang sah).",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "NRP/Nopens",
      "Nama",
      "Tanggal Bayar UDW",
      "Nilai UDW yang Terlanjur Dibayar",
      "Tanggal Surat Tagihan",
      "Status Pengembalian",
      "Tanggal Dikembalikan",
      "Nilai yang Dikembalikan",
      "Sisa yang Belum Dikembalikan",
      "Catatan"
    ],
    rows: [
      ["1", "19540812001", "Alm. Kol. Purn. H. Mulyono", "10 Mei 2026", "Rp 18.500.000", "01 Jun 2026", "Lunas Dikembalikan", "15 Jun 2026", "Rp 18.500.000", "Rp 0", "Setor SSBP Kasda NTPN-8812"],
      ["2", "19600315002", "Alm. Ny. Siti Aminah (Punah)", "12 Mei 2026", "Rp 15.000.000", "01 Jun 2026", "Cicilan Berjalan", "20 Jun 2026", "Rp 7.500.000", "Rp 7.500.000", "Cicilan ke-1 via Bank BRI"],
      ["3", "19581120003", "Alm. Letda Purn. Supardi", "18 Mei 2026", "Rp 16.200.000", "05 Jun 2026", "Surat Peringatan II", "-", "Rp 0", "Rp 16.200.000", "Konfirmasi Ahli Waris Tertunda"],
      ["4", "19620409004", "Alm. Peltu Purn. Joko Santoso", "20 Mei 2026", "Rp 14.800.000", "10 Jun 2026", "Lunas Dikembalikan", "28 Jun 2026", "Rp 14.800.000", "Rp 0", "Setor SSBP Kasda NTPN-9934"],
      ["5", "19650918005", "Alm. Serma Purn. Basuki R.", "25 Mei 2026", "Rp 13.500.000", "15 Jun 2026", "Surat Peringatan I", "-", "Rp 0", "Rp 13.500.000", "Koordinasi Kancab Surabaya"]
    ],
    summaryCards: [
      { label: "Total Kasus UDW Punah", value: "5 Kasus", color: "blue" },
      { label: "Total Nilai Terlanjur Bayar", value: "Rp 78.000.000", color: "amber" },
      { label: "Nilai Berhasil Dipulihkan", value: "Rp 40.800.000 (52,3%)", color: "green" },
      { label: "Sisa Tagihan Tertunggak", value: "Rp 37.200.000", color: "rose" }
    ]
  },

  // =========================================================================
  // 11. BRD 4.5.14 - Rekap Tagihan Imbal Jasa Seluruh Mitra Bayar (4 Sub-Format)
  // =========================================================================
  {
    id: "BRD-4.5.14",
    section: "4.5.14",
    title: "Rekap Tagihan Imbal Jasa Seluruh Mitra Bayar",
    category: "Mitra Bayar & CMS",
    jenis: "Operasional",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Perhitungan komprehensif tagihan imbal jasa seluruh mitra mencakup Taspen Proteksi Beasiswa (TPB 3%), Taspen Dwiguna Sejahtera (TDS 2,5%), serta denda keterlambatan flagging kredit dan autentikasi digital berbasis BI Rate.",
    outputFormats: ["Excel (XLSX)", "PDF (Nota Tagihan)"],
    hasSubViews: true,
    subViewOptions: [
      { id: "tpb", label: "1. Taspen Proteksi Beasiswa (TPB 3%)" },
      { id: "tds", label: "2. Taspen Dwiguna Sejahtera (TDS 2.5%)" },
      { id: "flagging", label: "3. Denda Flagging Kredit Mitra" },
      { id: "autentikasi", label: "4. Denda Autentikasi Digital" }
    ],
    // Default columns: TPB
    columns: [
      "No.",
      "Bulan",
      "Peserta",
      "KPA",
      "Nominal",
      "Nomor Polis",
      "Tanggal Polis",
      "Tanggal Bayar Polis",
      "Imbal Jasa (Nominal x 3%)",
      "DPP 11/12 (DPP x Imbal Jasa)",
      "PPN (DPP X 12%)",
      "PPH 23 (Imbal Jasa X 2%)",
      "Jumlah Tagihan (Imbal Jasa + DPP)",
      "Imbal Jasa yang Diterima (Imbal Jasa + DPP – PPN)",
      "Tanggal Terima Imbal Jasa"
    ],
    rows: [
      ["1", "Juli 2026", "Purn. Letda Budi Kartono", "KPA-098812", "Rp 183.500.000", "TL-TPB-2026-00892", "01 Feb 2026", "02 Jul 2026", "Rp 5.505.000", "Rp 5.046.250", "Rp 605.550", "Rp 110.100", "Rp 10.551.250", "Rp 9.945.700", "05 Jul 2026"],
      ["2", "Juli 2026", "Purn. AKP Siti Nurhaliza", "KPA-098813", "Rp 154.200.000", "TL-TPB-2026-01205", "01 Mar 2026", "02 Jul 2026", "Rp 4.626.000", "Rp 4.240.500", "Rp 508.860", "Rp 92.520", "Rp 8.866.500", "Rp 8.357.640", "05 Jul 2026"],
      ["3", "Juli 2026", "Purn. Mayor Arifin", "KPA-098814", "Rp 210.000.000", "TL-TPB-2026-01450", "01 Apr 2026", "03 Jul 2026", "Rp 6.300.000", "Rp 5.775.000", "Rp 693.000", "Rp 126.000", "Rp 12.075.000", "Rp 11.382.000", "06 Jul 2026"]
    ],
    variantData: {
      tds: {
        columns: [
          "No.",
          "Bulan",
          "Peserta",
          "KPA",
          "Nominal",
          "Nomor Polis",
          "Tanggal Polis",
          "Tanggal Bayar Polis",
          "Imbal Jasa (Nominal X 2,5%)",
          "DPP 11/12 (DPP X Imbal Jasa)",
          "PPN (DPP X 12%)",
          "PPH 23 (Imbal Jasa X 2%)",
          "Jumlah Tagihan (Imbal Jasa + DPP)",
          "Imbal Jasa yang Diterima (Imbal Jasa + DPP – PPN)",
          "Tanggal Terima Imbal Jasa"
        ],
        rows: [
          ["1", "Juli 2026", "Purn. Kol. Ahmad Rifai", "KPA-091100", "Rp 6.000.000.000", "TL-TDS-2026-00124", "01 Jan 2026", "02 Jul 2026", "Rp 150.000.000", "Rp 137.500.000", "Rp 16.500.000", "Rp 3.000.000", "Rp 287.500.000", "Rp 271.000.000", "05 Jul 2026"],
          ["2", "Juli 2026", "Purn. Kombes Hendro", "KPA-091101", "Rp 4.500.000.000", "TL-TDS-2026-00125", "01 Jan 2026", "02 Jul 2026", "Rp 112.500.000", "Rp 103.125.000", "Rp 12.375.000", "Rp 2.250.000", "Rp 215.625.000", "Rp 203.250.000", "05 Jul 2026"]
        ]
      },
      flagging: {
        columns: [
          "No.",
          "Nama Mitra",
          "BA",
          "Tanggal BA",
          "Periode",
          "Nomor Nota Dinas",
          "Tanggal Nota Dinas",
          "Tanggal Terima dari Div. Peserta",
          "Tanggal Terima dari Bid. Pajak",
          "No. Surat",
          "Tanggal Surat Tagihan",
          "Tanggal Kirim Email/Surat",
          "Nominal Bruto",
          "Imbal Jasa Flagging (Nominal/1,11)",
          "DPP PPN (11/12 X Imbal Jasa)",
          "PPN 12% (12% X DPP)",
          "Tax/PPh Ps 23 (2% X Imbal Jasa)",
          "NAT",
          "Tanggal Surat Diterima Mitra",
          "Jatuh Tempo (14 Hari Kerja)",
          "Tanggal Penerimaan",
          "Durasi Keterlambatan (Hari)",
          "BI RATE",
          "Denda",
          "Nilai Pembulatan Denda"
        ],
        rows: [
          ["1", "Bank BRI", "BA/01/VII/2026", "01 Jul 2026", "Juli 2026", "ND-112/KPS/2026", "02 Jul 2026", "03 Jul 2026", "04 Jul 2026", "S-441/ASABRI/2026", "05 Jul 2026", "05 Jul 2026", "Rp 145.200.000", "Rp 130.810.811", "Rp 119.909.910", "Rp 14.389.189", "Rp 2.616.216", "Rp 142.583.784", "07 Jul 2026", "27 Jul 2026", "02 Agu 2026", "6 Hari", "6,25%", "Rp 146.476", "Rp 146.000"],
          ["2", "Bank Mandiri", "BA/02/VII/2026", "01 Jul 2026", "Juli 2026", "ND-113/KPS/2026", "02 Jul 2026", "03 Jul 2026", "04 Jul 2026", "S-442/ASABRI/2026", "05 Jul 2026", "05 Jul 2026", "Rp 210.000.000", "Rp 189.189.189", "Rp 173.423.423", "Rp 20.810.811", "Rp 3.783.784", "Rp 206.216.216", "07 Jul 2026", "27 Jul 2026", "27 Jul 2026", "0 Hari", "6,25%", "Rp 0", "Rp 0 (Tepat Waktu)"]
        ]
      },
      autentikasi: {
        columns: [
          "No.",
          "Nama Mitra",
          "Imbal Jasa",
          "Jumlah Penerima Dapem Induk, Susulan & PP",
          "Nominal Imbal Jasa",
          "DPP PPN (11/12 X Nominal Imbal Jasa)",
          "PPN 12% (12% X DPP)",
          "Tax/PPh Ps 23 (2% X Nominal Imbal Jasa)",
          "NAT",
          "No. Surat",
          "Tanggal Surat Tagihan",
          "Tanggal Kirim Email/Surat",
          "Tanggal Surat Diterima Mitra",
          "Jatuh Tempo (14 Hari Kerja)",
          "Tanggal Penerimaan",
          "Durasi Keterlambatan (Hari)",
          "BI RATE",
          "Denda",
          "Nilai Pembulatan Denda"
        ],
        rows: [
          ["1", "Bank BSI", "Autentikasi Digital", "29.670 Penerima", "Rp 48.500.000", "Rp 44.458.333", "Rp 5.335.000", "Rp 970.000", "Rp 52.865.000", "S-501/ASABRI/2026", "05 Jul 2026", "05 Jul 2026", "07 Jul 2026", "27 Jul 2026", "30 Jul 2026", "3 Hari", "6,25%", "Rp 27.164", "Rp 27.000"],
          ["2", "Bank BTN", "Autentikasi Digital", "18.200 Penerima", "Rp 32.000.000", "Rp 29.333.333", "Rp 3.520.000", "Rp 640.000", "Rp 34.880.000", "S-502/ASABRI/2026", "05 Jul 2026", "05 Jul 2026", "07 Jul 2026", "27 Jul 2026", "25 Jul 2026", "0 Hari", "6,25%", "Rp 0", "Rp 0 (Tepat Waktu)"]
        ]
      }
    },
    summaryCards: [
      { label: "Total Imbal Jasa TPB & TDS", value: "Rp 278,93 Jt", color: "blue" },
      { label: "DPP PPN (11/12)", value: "Rp 255,69 Jt", color: "indigo" },
      { label: "Potongan PPh 23 (2%)", value: "Rp 5,58 Jt", color: "purple" },
      { label: "Total Tagihan Netto Diterima", value: "Rp 300,68 Jt", color: "green" }
    ]
  },

  // =========================================================================
  // 12. BRD 4.5.15 - Rekening Koran CMS Mitra Bayar (Format Standar ASABRI)
  // =========================================================================
  {
    id: "BRD-4.5.15",
    section: "4.5.15",
    title: "Rekening Koran CMS Mitra Bayar (Format Standar ASABRI)",
    category: "Mitra Bayar & CMS",
    jenis: "Rekonsiliasi",
    frekuensi: "Bulanan (Rekap), Real-Time (Saldo)",
    pengguna: "Div. Keuangan",
    prioritas: "TINGGI",
    desc: "Tarikan rekening koran dari sistem CMS setiap Mitra Bayar yang telah di-mapping ke format standar ASABRI, mencakup THT, JKM, JKK, NTIP, dan Pembayaran Pensiun tanpa perlu konversi manual.",
    outputFormats: ["Excel (XLSX Standar ASABRI)", "CSV"],
    hasSubViews: true,
    subViewOptions: [
      { id: "tht", label: "Format THT (CMS + Mapping YANDU)" },
      { id: "jkm", label: "Format JKM (SKS, UDW, BP, Beasiswa)" },
      { id: "jkk", label: "Format JKK (DB, DK, Gugur, Tewas, Beasiswa)" },
      { id: "ntip", label: "Format NTIP & Pensiun" }
    ],
    // Default columns: THT
    columns: [
      "No.",
      "Tanggal Bayar",
      "Trans Description",
      "Debet",
      "Credit",
      "Ladger Balance (Rp)",
      "User ID",
      "Mitra Bayar",
      "Program",
      "Jenis Manfaat",
      "Nomor KPA",
      "Nominal",
      "No SP",
      "Tanggal SP",
      "No DPS",
      "Tanggal DPS",
      "Kode Bayar",
      "Kantor Cabang",
      "Kode Anggota",
      "Mitra"
    ],
    rows: [
      ["1", "06 Jul 2026", "Penyaluran Klaim THT BUP 142 Peserta", "Rp 17.750.000.000", "Rp 0", "Rp 802.250.000.000", "CMS_MANDIRI_01", "Bank Mandiri", "THT", "THT (BUP)", "KPA-011928", "Rp 17.750.000.000", "SP/2026/07/012", "05 Jul 2026", "DPS-091/2026", "05 Jul 2026", "BAYAR-THT-001", "Kancab Jakarta", "TNI AD", "Bank Mandiri"],
      ["2", "06 Jul 2026", "Penyaluran Klaim THT BUP 88 Peserta", "Rp 9.680.000.000", "Rp 0", "Rp 646.304.000.000", "CMS_BRI_02", "Bank BRI", "THT", "THT (BUP)", "KPA-011929", "Rp 9.680.000.000", "SP/2026/07/088", "05 Jul 2026", "DPS-092/2026", "05 Jul 2026", "BAYAR-THT-002", "Kancab Surabaya", "POLRI", "Bank BRI"]
    ],
    variantData: {
      jkm: {
        columns: [
          "No.",
          "Tanggal Bayar",
          "Trans Description",
          "Debet",
          "Credit",
          "Ladger Balance (Rp)",
          "User ID",
          "Mitra Bayar",
          "Nomor KPA",
          "SKS",
          "UDW",
          "BP",
          "Bantuan Beasiswa",
          "No SP",
          "Tanggal SP",
          "No DPS",
          "Tanggal DPS",
          "Kode Bayar",
          "Kantor Cabang",
          "Anggota",
          "Mitra"
        ],
        rows: [
          ["1", "06 Jul 2026", "Penyaluran Santunan JKM 12 Ahli Waris", "Rp 504.000.000", "Rp 0", "Rp 418.550.000.000", "CMS_BNI_01", "Bank BNI", "KPA-088121", "Rp 42.000.000", "Rp 15.000.000", "Rp 12.000.000", "Rp 30.000.000", "SP/2026/07/044", "05 Jul 2026", "DPS-101/2026", "05 Jul 2026", "BAYAR-JKM-001", "Kancab Bandung", "TNI AU", "Bank BNI"]
        ]
      },
      jkk: {
        columns: [
          "No.",
          "Tanggal Bayar",
          "Trans Description",
          "Debet",
          "Credit",
          "Ladger Balance (Rp)",
          "User ID",
          "Mitra Bayar",
          "Nomor KPA",
          "DB",
          "DK",
          "Gugur",
          "Tewas",
          "Bantuan Beasiswa",
          "No SP",
          "Tanggal SP",
          "No DPS",
          "Tanggal DPS",
          "kode Bayar",
          "Kantor Cabang",
          "Anggota",
          "Mitra"
        ],
        rows: [
          ["1", "06 Jul 2026", "Santunan Gugur Tugas Operasi", "Rp 450.000.000", "Rp 0", "Rp 801.800.000.000", "CMS_MANDIRI_01", "Bank Mandiri", "KPA-077123", "Rp 0", "Rp 0", "Rp 400.000.000", "Rp 0", "Rp 50.000.000", "SP/2026/07/099", "05 Jul 2026", "DPS-105/2026", "05 Jul 2026", "BAYAR-JKK-001", "Kancab Jayapura", "TNI AD", "Bank Mandiri"]
        ]
      },
      ntip: {
        columns: [
          "No.",
          "KPA",
          "Tanggal Transaksi",
          "Nama Penerima",
          "Debet",
          "Credit",
          "Ladger Balance (Rp)",
          "User ID",
          "No SP",
          "Tanggal SP",
          "No DPS",
          "Tanggal DPS",
          "Mitra Bayar"
        ],
        rows: [
          ["1", "KPA-066124", "06 Jul 2026", "Purn. Letkol Tri W.", "Rp 32.500.000", "Rp 0", "Rp 135.000.000.000", "CMS_BSI_01", "SP/2026/07/110", "05 Jul 2026", "DPS-112/2026", "05 Jul 2026", "Bank BSI"],
          ["2", "KPA-066125", "06 Jul 2026", "Purn. Peltu Agus H.", "Rp 24.800.000", "Rp 0", "Rp 134.975.200.000", "CMS_BSI_01", "SP/2026/07/111", "05 Jul 2026", "DPS-113/2026", "05 Jul 2026", "Bank BSI"]
        ]
      }
    },
    summaryCards: [
      { label: "Total Saldo Ledger CMS", value: "Rp 2.002,10 M", color: "blue" },
      { label: "Total Penyaluran Debet", value: "Rp 28,38 M", color: "indigo" },
      { label: "Tingkat Auto-Matching YANDU", value: "100.0% (Matched)", color: "green" }
    ]
  },

  // =========================================================================
  // 13. BRD 4.5.17 - Rekap Iuran/Premi THT/Pensiun Per Satker (Tabel 1 BRS Tahap II)
  // =========================================================================
  {
    id: "BRD-4.5.17",
    section: "4.5.17",
    title: "Rekap Iuran/Premi THT/Pensiun Per Satker (Tabel 1 BRS Tahap II)",
    category: "Iuran & Penagihan Kemenkeu",
    jenis: "Operasional, Rekonsiliasi",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan (Bidang Perbendaharaan)",
    prioritas: "KRITIS",
    desc: "Rekapitulasi perhitungan iuran THT (3,25%), Pensiun (4,75%), JKK (0,62%), dan JKm (0,81%) per Satker (TNI AD, AL, AU, Mabes TNI, Kemhan, Polri) yang dibandingkan dengan SKP-PFK Kemenkeu untuk rekonsiliasi.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Satker",
      "Periode",
      "Total Gaji Pokok",
      "Total Tunjangan Istri",
      "Total Tunjangan Anak",
      "Total Iuran/Premi THT (3,25%)",
      "Total THT Divisi Kepesertaan",
      "Selisih Total THT",
      "Total Iuran/Premi Pensiun (4,75%)",
      "Total Iuran/Premi Pensiun Divisi Kepesertaan",
      "Selisih Total Pensiun",
      "Total Iuran/Premi JKK (0,62%)",
      "Total Iuran/Premi JKK Divisi Kepesertaan",
      "Selisih Total JKK",
      "Total Iuran/Premi JKm (0,81%)",
      "Total Iuran JKm Divisi Kepesertaan",
      "Selisih Total JKm"
    ],
    rows: [
      ["1", "TNI AD", "Juli 2026", "Rp 66.000.000.000", "Rp 6.600.000.000", "Rp 2.640.000.000", "Rp 2.445.300.000", "Rp 2.445.300.000", "Rp 0", "Rp 3.573.900.000", "Rp 3.573.900.000", "Rp 0", "Rp 466.488.000", "Rp 466.488.000", "Rp 0", "Rp 609.444.000", "Rp 609.444.000", "Rp 0"],
      ["2", "TNI AL", "Juli 2026", "Rp 28.500.000.000", "Rp 2.850.000.000", "Rp 1.140.000.000", "Rp 1.055.925.000", "Rp 1.055.925.000", "Rp 0", "Rp 1.543.275.000", "Rp 1.543.275.000", "Rp 0", "Rp 201.438.000", "Rp 201.438.000", "Rp 0", "Rp 263.169.000", "Rp 263.169.000", "Rp 0"],
      ["3", "TNI AU", "Juli 2026", "Rp 24.000.000.000", "Rp 2.400.000.000", "Rp 960.000.000", "Rp 889.200.000", "Rp 889.200.000", "Rp 0", "Rp 1.299.600.000", "Rp 1.299.600.000", "Rp 0", "Rp 169.632.000", "Rp 169.632.000", "Rp 0", "Rp 221.616.000", "Rp 221.616.000", "Rp 0"],
      ["4", "Mabes TNI", "Juli 2026", "Rp 12.000.000.000", "Rp 1.200.000.000", "Rp 480.000.000", "Rp 444.600.000", "Rp 444.600.000", "Rp 0", "Rp 649.800.000", "Rp 649.800.000", "Rp 0", "Rp 84.816.000", "Rp 84.816.000", "Rp 0", "Rp 110.808.000", "Rp 110.808.000", "Rp 0"],
      ["5", "POLRI", "Juli 2026", "Rp 85.000.000.000", "Rp 8.500.000.000", "Rp 3.400.000.000", "Rp 3.149.250.000", "Rp 3.149.250.000", "Rp 0", "Rp 4.602.750.000", "Rp 4.602.750.000", "Rp 0", "Rp 600.780.000", "Rp 600.780.000", "Rp 0", "Rp 784.890.000", "Rp 784.890.000", "Rp 0"],
      ["6", "PNS Kemhan & Polri", "Juli 2026", "Rp 34.500.000.000", "Rp 3.450.000.000", "Rp 1.380.000.000", "Rp 1.278.225.000", "Rp 1.278.225.000", "Rp 0", "Rp 1.868.175.000", "Rp 1.868.175.000", "Rp 0", "Rp 243.822.000", "Rp 243.822.000", "Rp 0", "Rp 318.537.000", "Rp 318.537.000", "Rp 0"]
    ],
    summaryCards: [
      { label: "Total Iuran THT (3,25%)", value: "Rp 9,26 M", color: "blue" },
      { label: "Total Iuran Pensiun (4,75%)", value: "Rp 13,54 M", color: "indigo" },
      { label: "Total SKP-PFK Kemenkeu", value: "Rp 25,66 M", color: "purple" },
      { label: "Selisih Perhitungan", value: "Rp 0 (100% Cocok)", color: "green" }
    ]
  },

  // =========================================================================
  // 14. BRD 4.5.18 - Tagihan Iuran/Premi THT/Pensiun/JKK/JKm Per Satker (Tabel 2 BRS Tahap II)
  // =========================================================================
  {
    id: "BRD-4.5.18",
    section: "4.5.18",
    title: "Tagihan Iuran/Premi THT/Pensiun/JKK/JKm Per Satker (Tabel 2 BRS Tahap II)",
    category: "Iuran & Penagihan Kemenkeu",
    jenis: "Operasional (Tagihan Resmi)",
    frekuensi: "Bulanan (Otomatis)",
    pengguna: "Div. Keuangan (Bidang Perbendaharaan)",
    prioritas: "KRITIS",
    desc: "Daftar penerbitan surat tagihan resmi iuran per batch (THT, Pensiun, JKK, JKm) kepada Satker TNI dan POLRI yang disampaikan ke Ditjen Anggaran Kemenkeu.",
    outputFormats: ["PDF (Tagihan Resmi per Satker)", "Excel (Rekap Seluruh Satker)"],
    columns: [
      "Bulan",
      "Jenis Iuran/Premi",
      "No. SKP (THT/Pensiun)",
      "Tanggal SKP",
      "No. Nota Dinas (JKK/JKm)",
      "Tgl. Nota Dinas",
      "Surat Tagihan",
      "Tanggal Surat Tagihan",
      "Tanggal Surat Tagihan Diterima",
      "Tanggal Pencairan Dana",
      "TNI",
      "POLRI",
      "Total"
    ],
    rows: [
      ["Juli 2026", "THT (3,25%) Gaji Induk", "S-184/PB.2/2026", "15 Jul 2026", "-", "-", "1190/KU.06.06/KMR.N/VII/2026", "16 Jul 2026", "17 Jul 2026", "20 Jul 2026", "Rp 4.835.025.000", "Rp 3.149.250.000", "Rp 7.984.275.000"],
      ["Juli 2026", "Pensiun (4,75%) Gaji Induk", "S-184/PB.2/2026", "15 Jul 2026", "-", "-", "1191/KU.06.06/KMR.N/VII/2026", "16 Jul 2026", "17 Jul 2026", "20 Jul 2026", "Rp 7.066.575.000", "Rp 4.602.750.000", "Rp 11.669.325.000"],
      ["Juli 2026", "JKK (0,62%) Bulanan", "-", "-", "ND-342/KPS/VII/2026", "15 Jul 2026", "1192/ASABRI/TGH-JKK/VII/2026", "16 Jul 2026", "17 Jul 2026", "22 Jul 2026", "Rp 922.374.000", "Rp 600.780.000", "Rp 1.523.154.000"],
      ["Juli 2026", "JKm (0,81%) Bulanan", "-", "-", "ND-343/KPS/VII/2026", "15 Jul 2026", "1193/ASABRI/TGH-JKM/VII/2026", "16 Jul 2026", "17 Jul 2026", "22 Jul 2026", "Rp 1.205.037.000", "Rp 784.890.000", "Rp 1.989.927.000"]
    ],
    summaryCards: [
      { label: "Total Tagihan TNI", value: "Rp 14,03 M", color: "blue" },
      { label: "Total Tagihan POLRI", value: "Rp 9,14 M", color: "indigo" },
      { label: "Grand Total Tagihan Kemenkeu", value: "Rp 23,17 M", color: "green" }
    ]
  },

  // =========================================================================
  // 15. BRD 4.5.19 - Rekap Penghasilan Peserta Pensiun Bulanan
  // =========================================================================
  {
    id: "BRD-4.5.19",
    section: "4.5.19",
    title: "Rekap Penghasilan Peserta Pensiun Bulanan",
    category: "Pembayaran Pensiun & DAPEM",
    jenis: "Operasional",
    frekuensi: "Bulanan (Otomatis Pasca-Dapem)",
    pengguna: "Div. Keuangan (Bidang Pajak)",
    prioritas: "KRITIS",
    desc: "Rekap data penghasilan seluruh peserta pensiun pada bulan berjalan yang menjadi basis perhitungan PPh 21 TER serta mencatat penghasilan kumulatif tahun berjalan per peserta.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Kode Jenis Dapem",
      "Kode MAK",
      "NIK",
      "NRP/Nopens",
      "Nama Peserta",
      "Kode Jiwa",
      "PTKP",
      "Jabatan",
      "GP Pensiun",
      "Tunjangan Istri",
      "Tunjangan Anak",
      "Tunjangan Lainnya",
      "Tunjuk Silang",
      "Total Penghasilan Bruto Bulan Ini",
      "Penghasilan Kumulatif Jan s.d. Bulan Ini",
      "Status NIK",
      "Status NPWP"
    ],
    rows: [
      ["1", "DAPEM Induk", "513122", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "1.1.0.0", "K/1", "Pati TNI AD", "Rp 5.240.000", "Rp 524.000", "Rp 0", "Rp 0", "0", "Rp 5.764.000", "Rp 40.348.000", "Valid Dukcapil", "Valid DJP"],
      ["2", "DAPEM Induk", "513123", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "1.1.2.0", "K/2", "Pamen Polri", "Rp 4.850.000", "Rp 485.000", "Rp 194.000", "Rp 0", "0", "Rp 5.529.000", "Rp 38.703.000", "Valid Dukcapil", "Valid DJP"],
      ["3", "DAPEM Induk", "513113", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti Aminah", "0.1.0.0", "TK/0", "PNS Kemhan", "Rp 3.450.000", "Rp 0", "Rp 0", "Rp 0", "0", "Rp 3.450.000", "Rp 24.150.000", "Valid Dukcapil", "Valid DJP"],
      ["4", "DAPEM Susulan", "513122", "3578019988770004", "197204123", "Purn. Mayor Laut Sugeng", "1.1.1.0", "K/1", "Pamen TNI AL", "Rp 3.820.000", "Rp 382.000", "Rp 76.400", "Rp 0", "0", "Rp 4.278.400", "Rp 29.948.800", "Valid Dukcapil", "Valid DJP"]
    ],
    summaryCards: [
      { label: "Total Populasi Peserta", value: "435.670 Peserta", color: "blue" },
      { label: "Total Bruto Bulan Ini", value: "Rp 1.487,40 M", color: "indigo" },
      { label: "Status Validitas NIK", value: "99.8% Dukcapil Valid", color: "green" }
    ]
  },

  // =========================================================================
  // 16. BRD 4.5.20 - Rekap Penghasilan Tahunan Peserta Pensiun
  // =========================================================================
  {
    id: "BRD-4.5.20",
    section: "4.5.20",
    title: "Rekap Penghasilan Tahunan Peserta Pensiun",
    category: "Pembayaran Pensiun & DAPEM",
    jenis: "Operasional, Regulatori",
    frekuensi: "Tahunan",
    pengguna: "Div. Keuangan (Bidang Pajak)",
    prioritas: "KRITIS",
    desc: "Rekap total penghasilan tahunan seluruh peserta pensiun yang digunakan sebagai dasar perhitungan PPh Pasal 17 tahunan dan pengisian SPT Tahunan (Form 1721-A2).",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Kode Jenis Dapem",
      "Kode MAK",
      "NIK",
      "NRP/Nopens",
      "Nama Peserta",
      "Kode Jiwa",
      "PTKP",
      "Jabatan",
      "Total Penghasilan Bruto Setahun",
      "Total Bulan Diterima",
      "Biaya Pensiun",
      "Penghasilan Kena Pajak",
      "PPh Terutang Setahun",
      "PPh Dipotong Jan-Nov (TER)",
      "PPh Desember",
      "Status NPWP",
      "Tarif yang Berlaku"
    ],
    rows: [
      ["1", "DAPEM Induk", "513122", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "1.1.0.0", "K/1 (Rp 63 Jt)", "Pati TNI AD", "Rp 69.168.000", "12 Bulan", "Rp 2.400.000", "Rp 3.768.000", "Rp 188.400", "Rp 317.020", "-Rp 128.620 (LB)", "Valid", "Normal (5%)"],
      ["2", "DAPEM Induk", "513123", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "1.1.2.0", "K/2 (Rp 67,5 Jt)", "Pamen Polri", "Rp 66.348.000", "12 Bulan", "Rp 2.400.000", "Rp 0 (Nihil)", "Rp 0", "Rp 152.020", "-Rp 152.020 (LB)", "Valid", "Normal (0%)"],
      ["3", "DAPEM Induk", "513113", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti Aminah", "0.1.0.0", "TK/0 (Rp 54 Jt)", "PNS Kemhan", "Rp 41.400.000", "12 Bulan", "Rp 2.070.000", "Rp 0 (Nihil)", "Rp 0", "Rp 0", "Rp 0 (Nihil)", "Valid", "Normal (0%)"]
    ],
    summaryCards: [
      { label: "Total Bruto Setahun", value: "Rp 17.848,80 M", color: "blue" },
      { label: "Total Biaya Pensiun (Maks)", value: "Rp 1.045,60 M", color: "indigo" },
      { label: "Total PPh P17 Terutang", value: "Rp 62,04 M", color: "purple" },
      { label: "Total Lebih Bayar Restitusi", value: "Rp 4,12 M", color: "rose" }
    ]
  },

  // =========================================================================
  // 17. BRD 4.5.21 - Rekap Perhitungan PPh 21 TER Masa Jan-Nov
  // =========================================================================
  {
    id: "BRD-4.5.21",
    section: "4.5.21",
    title: "Rekap Perhitungan PPh 21 TER Masa Jan-Nov",
    category: "Perpajakan & PPh 21",
    jenis: "Operasional, Regulatori",
    frekuensi: "Bulanan (Jan-Nov)",
    pengguna: "Div. Keuangan (Bidang Pajak)",
    prioritas: "KRITIS",
    desc: "Rekap perhitungan PPh 21 menggunakan tarif TER untuk Masa Januari sampai November dan perhitungan tarif Pasal 17 untuk peserta pensiun yang berhenti menerima penghasilan sebelum bulan Desember.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "Kode Jenis Dapem",
      "Kode MAK",
      "NIK",
      "NRP/Nopens",
      "Nama",
      "Masa Pajak",
      "Kode Jiwa",
      "PTKP",
      "Jabatan",
      "Penghasilan Bruto Bulan Ini",
      "PPh Kumulatif Jan s.d. Bulan Ini",
      "Tarif TER yang Berlaku",
      "PPh 21 TER (Bruto × Tarif)",
      "Tarif Pasal 17 (Peserta Berhenti)",
      "PPh yang Benar-benar Dipotong"
    ],
    rows: [
      ["1", "DAPEM Induk", "513122", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "Juli 2026", "1.1.0.0", "K/1 (TER A)", "Pati TNI AD", "Rp 5.764.000", "Rp 201.740", "0,50%", "Rp 28.820", "-", "Rp 28.820"],
      ["2", "DAPEM Induk", "513123", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "Juli 2026", "1.1.2.0", "K/2 (TER B)", "Pamen Polri", "Rp 5.529.000", "Rp 96.740", "0,25%", "Rp 13.820", "-", "Rp 13.820"],
      ["3", "DAPEM Induk", "513113", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti Aminah", "Juli 2026", "0.1.0.0", "TK/0 (TER A)", "PNS Kemhan", "Rp 3.450.000", "Rp 0", "0,00%", "Rp 0", "-", "Rp 0 (Nihil)"],
      ["4", "DAPEM Terakhir", "513122", "3271046708660002", "1966081406", "Letkol Inf Dedi S. (Berhenti)", "Mei 2026", "1.0.0.0", "K/0", "Pamen TNI AD", "Rp 9.000.000", "Rp 0", "-", "Rp 0", "P17 Nihil", "Rp 0 (Lunas Diselesaikan)"]
    ],
    summaryCards: [
      { label: "Masa Pajak Aktif", value: "Juli 2026 (Masa 07)", color: "blue" },
      { label: "Total Bruto Terpotong", value: "Rp 1.487,40 M", color: "indigo" },
      { label: "Total PPh 21 TER Bulan Ini", value: "Rp 7,85 M", color: "green" }
    ]
  },

  // =========================================================================
  // 18. BRD 4.5.22 - Rekap PPh Pasal 17 untuk Dapem Bulan Desember
  // =========================================================================
  {
    id: "BRD-4.5.22",
    section: "4.5.22",
    title: "Rekap PPh Pasal 17 untuk DAPEM Bulan Desember",
    category: "Perpajakan & PPh 21",
    jenis: "Operasional",
    frekuensi: "Tahunan (Desember)",
    pengguna: "Div. Keuangan (Bidang Pajak)",
    prioritas: "KRITIS",
    desc: "Perhitungan PPh 21 masa pajak Desember untuk menghitung selisih antara PPh Pasal 17 setahun penuh dengan akumulasi TER Jan-Nov guna menentukan nilai potong/kembali.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "NIK",
      "NRP/Nopens",
      "Nama",
      "Total Penghasilan Setahun",
      "Biaya Pensiun",
      "PTKP",
      "PKP",
      "PPh Terutang Setahun (Pasal 17)",
      "PPh Dipotong Jan-Nov (TER)",
      "PPh yang Harus Dipotong Desember",
      "Keterangan (Lebih/Kurang/Nihil)"
    ],
    rows: [
      ["1", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "Rp 69.168.000", "Rp 2.400.000", "Rp 63.000.000", "Rp 3.768.000", "Rp 188.400", "Rp 317.020", "-Rp 128.620", "Lebih Bayar (Dikembalikan ke Rekening)"],
      ["2", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "Rp 66.348.000", "Rp 2.400.000", "Rp 67.500.000", "Rp 0", "Rp 0", "Rp 152.020", "-Rp 152.020", "Lebih Bayar (Dikembalikan ke Rekening)"],
      ["3", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti Aminah", "Rp 41.400.000", "Rp 2.070.000", "Rp 54.000.000", "Rp 0", "Rp 0", "Rp 0", "Rp 0", "Nihil (Sesuai Batas PTKP)"]
    ],
    summaryCards: [
      { label: "Total PPh Terutang P17", value: "Rp 62,04 M", color: "blue" },
      { label: "Akumulasi TER Jan-Nov", value: "Rp 66,16 M", color: "indigo" },
      { label: "Total Lebih Bayar Restitusi", value: "Rp 4,12 M (Dikembalikan)", color: "green" }
    ]
  },

  // =========================================================================
  // 19. BRD 4.5.23 - Rekap PPh Pasal 17 Tahunan (SPT Tahunan)
  // =========================================================================
  {
    id: "BRD-4.5.23",
    section: "4.5.23",
    title: "Rekap PPh Pasal 17 Tahunan (SPT Tahunan)",
    category: "Perpajakan & PPh 21",
    jenis: "Regulatori",
    frekuensi: "Tahunan",
    pengguna: "Div. Keuangan (Bidang Pajak)",
    prioritas: "KRITIS",
    desc: "Rekap PPh Pasal 17 tahunan yang menjadi dasar pengisian formulir SPT Tahunan PPh 21 PT ASABRI ke DJP Online / Coretax.",
    outputFormats: ["Excel (XLSX)", "Format DJP e-Filing", "PDF"],
    columns: [
      "Tahun Pajak",
      "NPWP Pemotong",
      "Jumlah Wajib Pajak",
      "Total Bruto Penghasilan",
      "Total Biaya Pensiun",
      "Total PKP",
      "PPh Pasal 17 Terutang",
      "Status Pelaporan DJP"
    ],
    rows: [
      ["TA 2026 (Proyeksi)", "01.001.624.4-092.000", "435.670 Peserta", "Rp 16.890.500.000.000", "Rp 1.045.600.000.000", "Rp 1.240.800.000.000", "Rp 62.040.000.000", "Siap Generate e-SPT DJP Online"]
    ],
    summaryCards: [
      { label: "Wajib Pajak Terdaftar", value: "435.670 Peserta", color: "blue" },
      { label: "Total Penghasilan Bruto", value: "Rp 16.890,50 M", color: "indigo" },
      { label: "PPh 21 Badan Terutang", value: "Rp 62,04 M", color: "green" }
    ]
  },

  // =========================================================================
  // 20. BRD 4.5.24 - Rekap UKP Peserta Pensiun Bulanan
  // =========================================================================
  {
    id: "BRD-4.5.24",
    section: "4.5.24",
    title: "Rekap UKP (Uang Kena Pajak) Peserta Pensiun Bulanan",
    category: "Perpajakan & PPh 21",
    jenis: "Operasional, Rekonsiliasi",
    frekuensi: "Bulanan",
    pengguna: "Div. Keuangan (Bidang Pajak)",
    prioritas: "SEDANG",
    desc: "Rekapitulasi data penerimaan UKP (Uang Kekurangan Pensiun) peserta pensiun mencakup identitas, kode MAK, jenis UKP, bulan penghasilan diterima/dikembalikan, dan nilai UKP neto.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "NIK",
      "Kode MAK",
      "NRP/Nopens",
      "Nama",
      "Kode Jiwa",
      "PTKP",
      "Jabatan",
      "Jenis UKP",
      "Bulan Penghasilan Diterima",
      "Bulan Penghasilan Dikembalikan",
      "Total UKP Neto Bulan Ini",
      "UKP Kumulatif Tahun Ini"
    ],
    rows: [
      ["1", "3171012345670001", "513122", "195801234", "Purn. Mayjen TNI Hendra", "1.1.0.0", "K/1", "Pati TNI AD", "Kenaikan Pangkat Purnawirawan", "3 Bulan", "0 Bulan", "Rp 1.850.000", "Rp 1.850.000"],
      ["2", "3275098765430002", "513123", "196205432", "Purn. Kombes Pol Bambang", "1.1.2.0", "K/2", "Pamen Polri", "Rapel Penyesuaian Gaji Pokok", "2 Bulan", "0 Bulan", "Rp 1.240.000", "Rp 1.240.000"],
      ["3", "3374045678900003", "513113", "196009871", "Purn. Pembina IV/a Siti Aminah", "0.1.0.0", "TK/0", "PNS Kemhan", "Susulan Tunjangan Anak Kuliah", "4 Bulan", "1 Bulan", "Rp 850.000", "Rp 850.000"]
    ],
    summaryCards: [
      { label: "Total Kasus UKP Bulan Ini", value: "8.520 Peserta", color: "blue" },
      { label: "Total UKP Neto Dibayar", value: "Rp 12,45 M", color: "indigo" },
      { label: "Kompensasi PPh 21 TER", value: "Rp 62,25 Jt", color: "green" }
    ]
  },

  // =========================================================================
  // 21. BRD 4.5.25 - Perbandingan Nilai PPh 21 Metode TER vs Pasal 17
  // =========================================================================
  {
    id: "BRD-4.5.25",
    section: "4.5.25",
    title: "Perbandingan Nilai PPh 21 Metode TER vs Pasal 17",
    category: "Perpajakan & PPh 21",
    jenis: "Analisis, Audit",
    frekuensi: "Bulanan, On-Demand",
    pengguna: "Div. Keuangan (Bidang Pajak), SPI",
    prioritas: "TINGGI",
    desc: "Laporan perbandingan yang menampilkan nilai PPh 21 yang dihitung menggunakan metode TER (yang diterapkan) versus metode PPh Pasal 17 untuk setiap peserta, digunakan sebagai alat audit dan verifikasi keakuratan perhitungan.",
    outputFormats: ["Excel (XLSX)", "PDF"],
    columns: [
      "No.",
      "NIK",
      "NRP/Nopens",
      "Nama",
      "Masa Pajak",
      "Penghasilan Bruto",
      "PPh 21 Metode TER",
      "PPh 21 Metode Pasal 17",
      "Selisih (TER-P17)",
      "Persentase Selisih",
      "Keterangan"
    ],
    rows: [
      ["1", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "Juli 2026", "Rp 5.764.000", "Rp 28.820", "Rp 15.700", "+Rp 13.120", "+83,5%", "Wajar (Skema TER Sesuai PMK 168/2023)"],
      ["2", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "Juli 2026", "Rp 5.529.000", "Rp 13.820", "Rp 0", "+Rp 13.820", "+100,0%", "Wajar (TER B Sesuai Batas PTKP)"],
      ["3", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti Aminah", "Juli 2026", "Rp 3.450.000", "Rp 0", "Rp 0", "Rp 0", "0,0%", "Identik (Nihil Terkena Pajak)"]
    ],
    summaryCards: [
      { label: "Total Bruto Sample", value: "Rp 14,74 Jt", color: "blue" },
      { label: "PPh Metode TER", value: "Rp 42.640", color: "indigo" },
      { label: "PPh Metode P17", value: "Rp 15.700", color: "purple" },
      { label: "Status Audit SPI", value: "100% Sesuai Regulasi PMK", color: "green" }
    ]
  },

  // =========================================================================
  // 22. BRD 4.5.26 - Bukti Potong PPh 21 (Bentuk A2)
  // =========================================================================
  {
    id: "BRD-4.5.26",
    section: "4.5.26",
    title: "Bukti Potong PPh 21 (Bentuk A2)",
    category: "Perpajakan & PPh 21",
    jenis: "Regulatori, Layanan Peserta",
    frekuensi: "Bulanan, Tahunan (A2)",
    pengguna: "Peserta (via portal/AMA), Div. Keuangan (Distribusi)",
    prioritas: "KRITIS",
    desc: "Bukti Potong PPh 21 dalam format resmi DJP (Form 1721-A2/A3) yang dapat diunduh mandiri oleh peserta pensiun melalui portal peserta atau aplikasi mobile AMA.",
    outputFormats: ["PDF (Form Resmi 1721-A2 DJP)", "Excel (Distribusi Log)"],
    columns: [
      "No. Bukti Potong",
      "NIK",
      "NRP/Nopens",
      "Nama Penerima",
      "Tahun Pajak",
      "Bruto Setahun",
      "PPh Dipotong",
      "Status NIK Dukcapil",
      "Status Unduh Peserta (Aplikasi AMA)"
    ],
    rows: [
      ["1.1-07.26-0000124", "3171012345670001", "195801234", "Purn. Mayjen TNI Hendra", "2026", "Rp 69.168.000", "Rp 188.400", "Terpadan 100%", "Tersedia di Aplikasi AMA"],
      ["1.1-07.26-0000125", "3275098765430002", "196205432", "Purn. Kombes Pol Bambang", "2026", "Rp 66.348.000", "Rp 0", "Terpadan 100%", "Tersedia di Aplikasi AMA"],
      ["1.1-07.26-0000126", "3374045678900003", "196009871", "Purn. Pembina IV/a Siti Aminah", "2026", "Rp 41.400.000", "Rp 0", "Terpadan 100%", "Tersedia di Aplikasi AMA"]
    ],
    summaryCards: [
      { label: "Bukti Potong Terbit", value: "435.670 Form", color: "blue" },
      { label: "Format Standar", value: "Form 1721-A2 DJP / Coretax", color: "indigo" },
      { label: "Status Integrasi AMA", value: "100% Siap Download", color: "green" }
    ]
  }
];

export const CATEGORIES_LIST = [
  "Semua Kategori (22)",
  "Iuran & Penagihan Kemenkeu",
  "Pembayaran Manfaat & Klaim",
  "Pembayaran Pensiun & DAPEM",
  "Perpajakan & PPh 21",
  "Perbendaharaan & Kas Negara",
  "BPJS Kesehatan",
  "Mitra Bayar & CMS"
];
