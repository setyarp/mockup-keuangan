// Data Rincian Alokasi Dana THT dan Pensiun Per-Satuan Kerja (Satker)
// THT (3,25%) dan Pensiun (4,75%) diterbitkan dalam 1 Dokumen Surat Tagihan Terpadu

export const SATKER_THT_PENSIUN_ALL = [
  // ==================== MATRA TNI & KEMHAN ====================
  {
    kode: "101001",
    satker: "Mabes TNI (Cilangkap)",
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
    satker: "TNI AD — Mabesad & Satker Kotama",
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
    satker: "TNI AL — Mabesal, Koarmada & Kolinlamil",
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
    satker: "TNI AU — Mabesau & Koopsudnas",
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
    satker: "Kementerian Pertahanan RI & Balitbang",
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
    satker: "Mabes POLRI (Trunojoyo)",
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
    satker: "Polda Metro Jaya",
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
    satker: "Polda Jawa Barat",
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
    satker: "Polda Jawa Timur",
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

// Helper hitung alokasi satker secara proporsional jika ada nilai nominal kustom
export const generateProportionalSatkerList = (totalNominal, baseList = SATKER_THT_PENSIUN_TNI) => {
  const currentTotal = baseList.reduce((sum, s) => sum + s.total, 0);
  const ratio = totalNominal / (currentTotal || 1);

  return baseList.map((s) => {
    const danaTHT = Math.round(s.danaTHT * ratio);
    const danaPensiun = Math.round(s.danaPensiun * ratio);
    return {
      ...s,
      danaTHT,
      danaPensiun,
      total: danaTHT + danaPensiun
    };
  });
};
