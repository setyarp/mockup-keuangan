// Data Rincian Alokasi Dana THT dan Pensiun Per-Unor / Satuan Kerja (Satker)
// THT (3,25%) dan Pensiun (4,75%) diterbitkan dalam 1 Dokumen Surat Tagihan Terpadu

export const SATKER_THT_PENSIUN_ALL = [
  // ==================== MATRA TNI & KEMHAN ====================
  {
    kode: "101001",
    unor: "Mabes TNI",
    satker: "UNOR Mabes TNI (Cilangkap)",
    matra: "Mabes TNI",
    peserta: 12450,
    gajiPokok: 75384615385,
    danaTHT: 2450000000,
    danaPensiun: 3580000000,
    total: 6030000000,
    status: "Match 100%"
  },
  {
    kode: "102010",
    unor: "TNI AD",
    satker: "UNOR TNI AD (Mabesad & Kotama)",
    matra: "TNI AD",
    peserta: 154200,
    gajiPokok: 474461538462,
    danaTHT: 15420000000,
    danaPensiun: 22540000000,
    total: 37960000000,
    status: "Match 100%"
  },
  {
    kode: "103010",
    unor: "TNI AL",
    satker: "UNOR TNI AL (Mabesal, Koarmada & Kolinlamil)",
    matra: "TNI AL",
    peserta: 48500,
    gajiPokok: 161230769231,
    danaTHT: 5240000000,
    danaPensiun: 7660000000,
    total: 12900000000,
    status: "Match 100%"
  },
  {
    kode: "104010",
    unor: "TNI AU",
    satker: "UNOR TNI AU (Mabesau & Koopsudnas)",
    matra: "TNI AU",
    peserta: 36200,
    gajiPokok: 122461538462,
    danaTHT: 3980000000,
    danaPensiun: 5820000000,
    total: 9800000000,
    status: "Match 100%"
  },
  {
    kode: "100010",
    unor: "Kemhan RI",
    satker: "UNOR Kementerian Pertahanan (Kemhan RI & Balitbang)",
    matra: "Kemhan",
    peserta: 14800,
    gajiPokok: 44615384615,
    danaTHT: 1450000000,
    danaPensiun: 2110000000,
    total: 3560000000,
    status: "Match 100%"
  },

  // ==================== MATRA POLRI ====================
  {
    kode: "201001",
    unor: "Mabes POLRI",
    satker: "UNOR Mabes POLRI (Trunojoyo)",
    matra: "POLRI",
    peserta: 28500,
    gajiPokok: 117538461538,
    danaTHT: 3820000000,
    danaPensiun: 5590000000,
    total: 9410000000,
    status: "Match 100%"
  },
  {
    kode: "202010",
    unor: "Polda Metro Jaya",
    satker: "UNOR Polda Metro Jaya",
    matra: "POLRI",
    peserta: 32400,
    gajiPokok: 112307692308,
    danaTHT: 3650000000,
    danaPensiun: 5340000000,
    total: 8990000000,
    status: "Match 100%"
  },
  {
    kode: "202020",
    unor: "Polda Jawa Barat",
    satker: "UNOR Polda Jawa Barat",
    matra: "POLRI",
    peserta: 31100,
    gajiPokok: 105230769231,
    danaTHT: 3420000000,
    danaPensiun: 5000000000,
    total: 8420000000,
    status: "Match 100%"
  },
  {
    kode: "202030",
    unor: "Polda Jawa Timur",
    satker: "UNOR Polda Jawa Timur",
    matra: "POLRI",
    peserta: 29800,
    gajiPokok: 102615384615,
    danaTHT: 3335000000,
    danaPensiun: 4875000000,
    total: 8210000000,
    status: "Match 100%"
  }
];

// Satker khusus Tagihan TNI & Kemhan
export const SATKER_THT_PENSIUN_TNI = SATKER_THT_PENSIUN_ALL.filter(
  (s) => s.matra !== "POLRI"
);

// Satker khusus Tagihan POLRI
export const SATKER_THT_PENSIUN_POLRI = SATKER_THT_PENSIUN_ALL.filter(
  (s) => s.matra === "POLRI"
);

// Satker Spesifik Per-Dana:
// 1. THT TNI (Tarif 3,25%)
export const SATKER_THT_TNI = SATKER_THT_PENSIUN_TNI.map((s) => ({
  ...s,
  nominal: s.danaTHT,
  tarif: "3,25%",
  jenisDana: "THT TNI"
}));

// 2. THT POLRI (Tarif 3,25%)
export const SATKER_THT_POLRI = SATKER_THT_PENSIUN_POLRI.map((s) => ({
  ...s,
  nominal: s.danaTHT,
  tarif: "3,25%",
  jenisDana: "THT POLRI"
}));

// 3. Pensiun TNI (Tarif 4,75%)
export const SATKER_PENSIUN_TNI = SATKER_THT_PENSIUN_TNI.map((s) => ({
  ...s,
  nominal: s.danaPensiun,
  tarif: "4,75%",
  jenisDana: "Pensiun TNI"
}));

// 4. Pensiun POLRI (Tarif 4,75%)
export const SATKER_PENSIUN_POLRI = SATKER_THT_PENSIUN_POLRI.map((s) => ({
  ...s,
  nominal: s.danaPensiun,
  tarif: "4,75%",
  jenisDana: "Pensiun POLRI"
}));

// Helper konversi bulan ke Romawi
export const ROMAWI_BULAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export const getBulanRomawi = (date = new Date()) => {
  const m = typeof date === "number" ? date : date.getMonth();
  return ROMAWI_BULAN[m] || "IX";
};

// Helper generator Nomor Surat Resmi PFK sesuai ketentuan:
// NoUrut(incremental)/KU.06.06(kode untuk Dana PFK)/KMR.N(unit divisi pembuat)/Bulan(Romawi)/Tahun
export const formatNomorSuratPFK = (noUrut = 1190, bulanRomawi = "IX", tahun = 2026) => {
  return `${noUrut}/KU.06.06/KMR.N/${bulanRomawi}/${tahun}`;
};

// Helper hitung alokasi satker secara proporsional jika ada nilai nominal kustom
export const generateProportionalSatkerList = (totalNominal, baseList = SATKER_THT_PENSIUN_TNI) => {
  const currentTotal = baseList.reduce((sum, s) => sum + (s.total || s.nominal || 0), 0);
  const ratio = totalNominal / (currentTotal || 1);

  return baseList.map((s) => {
    const danaTHT = s.danaTHT ? Math.round(s.danaTHT * ratio) : undefined;
    const danaPensiun = s.danaPensiun ? Math.round(s.danaPensiun * ratio) : undefined;
    const nominal = s.nominal ? Math.round(s.nominal * ratio) : (danaTHT && danaPensiun ? danaTHT + danaPensiun : (danaTHT || danaPensiun));
    return {
      ...s,
      danaTHT,
      danaPensiun,
      nominal,
      total: (danaTHT || 0) + (danaPensiun || 0) || nominal
    };
  });
};

