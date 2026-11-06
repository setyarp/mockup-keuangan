import { useState, useMemo, Fragment } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Lock,
  Layers,
  Building2,
  Users,
  Shield,
  ArrowRight,
  X,
  ExternalLink,
  Info,
  Calendar,
  Calculator,
  Sparkles,
  Copy,
  Check,
  RotateCcw
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { PreviewModal } from "../components/common/PreviewModal";

// Format currency IDR
const fmtRupiah = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return `Rp ${Number(val).toLocaleString("id-ID")}`;
};

// Format integer number
const fmtNum = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "0";
  return Number(val).toLocaleString("id-ID");
};

// Daftar Bulan
const BULAN_LIST = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// =========================================================================
// DATA SUB-ROWS DEFINITIONS (PRAJURIT, PNS, PPPK / PPK)
// =========================================================================

// --- TNI AD ---
const SUB_TNI_AD_PRAJURIT = {
  id: "TNI_AD_PRAJURIT",
  kategori: "Prajurit TNI AD",
  jenisPersonil: "Prajurit",
  badge: "Militer",
  peserta: 305210,
  tht: 37232975000,
  pensiun: 54417425000,
  jkk: 2749512000,
  jkm: 2291260000,
  total: 96691172000,
  golonganBreakdown: [
    { gol: "TAMTAMA (Golongan I)", peserta: 142100, gp: 426300000000, tht: 13854750000, pensiun: 20249250000, jkk: 1023120000, jkm: 852600000, total: 35979720000 },
    { gol: "BINTARA (Golongan II)", peserta: 121500, gp: 486000000000, tht: 15795000000, pensiun: 23085000000, jkk: 1166400000, jkm: 972000000, total: 41018400000 },
    { gol: "PAMA (Golongan III)", peserta: 29800, gp: 149000000000, tht: 4842500000, pensiun: 7077500000, jkk: 357600000, jkm: 298000000, total: 12575600000 },
    { gol: "PAMEN (Golongan IV)", peserta: 10980, gp: 76860000000, tht: 2497950000, pensiun: 3650850000, jkk: 184464000, jkm: 153720000, total: 6486984000 },
    { gol: "PATI (Perwira Tinggi)", peserta: 830, gp: 7470000000, tht: 242775000, pensiun: 354825000, jkk: 17928000, jkm: 14940000, total: 630468000 }
  ]
};

const SUB_TNI_AD_PNS = {
  id: "TNI_AD_PNS",
  kategori: "PNS TNI AD",
  jenisPersonil: "PNS",
  badge: "ASN",
  peserta: 21436,
  tht: 2771047500,
  pensiun: 4049992500,
  jkk: 204631200,
  jkm: 170526000,
  total: 7196197200,
  golonganBreakdown: [
    { gol: "Golongan I", peserta: 1120, gp: 3820000000, tht: 124150000, pensiun: 181450000, jkk: 9168000, jkm: 7640000, total: 322408000 },
    { gol: "Golongan II", peserta: 8450, gp: 32540000000, tht: 1057550000, pensiun: 1545650000, jkk: 78096000, jkm: 65080000, total: 2746376000 },
    { gol: "Golongan III", peserta: 9680, gp: 36880000000, tht: 1198600000, pensiun: 1751800000, jkk: 88512000, jkm: 73760000, total: 3112672000 },
    { gol: "Golongan IV", peserta: 2186, gp: 12023000000, tht: 390747500, pensiun: 571092500, jkk: 28855200, jkm: 24046000, total: 1014741200 }
  ]
};

const SUB_TNI_AD_PPPK = {
  id: "TNI_AD_PPPK",
  kategori: "PPPK TNI AD",
  jenisPersonil: "PPPK",
  badge: "PPK / Non-pensiun",
  peserta: 8635,
  tht: null,
  pensiun: null,
  jkk: 99420000,
  jkm: 82850000,
  total: 182270000,
  golonganBreakdown: [
    { gol: "Golongan IX", peserta: 3200, gp: 14800000000, tht: null, pensiun: null, jkk: 35520000, jkm: 29600000, total: 65120000 },
    { gol: "Golongan X", peserta: 3150, gp: 15200000000, tht: null, pensiun: null, jkk: 36480000, jkm: 30400000, total: 66880000 },
    { gol: "Golongan XI", peserta: 1520, gp: 7600000000, tht: null, pensiun: null, jkk: 18240000, jkm: 15200000, total: 33440000 },
    { gol: "Golongan XII", peserta: 765, gp: 3825000000, tht: null, pensiun: null, jkk: 9180000, jkm: 7650000, total: 16830000 }
  ]
};

// --- TNI AL ---
const SUB_TNI_AL_PRAJURIT = {
  id: "TNI_AL_PRAJURIT",
  kategori: "Prajurit TNI AL",
  jenisPersonil: "Prajurit",
  badge: "Militer",
  peserta: 132408,
  tht: 16385590000,
  pensiun: 23948170000,
  jkk: 1210012800,
  jkm: 1008344000,
  total: 42552116800,
  golonganBreakdown: [
    { gol: "TAMTAMA (Golongan I)", peserta: 58200, gp: 174600000000, tht: 5674500000, pensiun: 8293500000, jkk: 419040000, jkm: 349200000, total: 14736240000 },
    { gol: "BINTARA (Golongan II)", peserta: 54100, gp: 216400000000, tht: 7033000000, pensiun: 10279000000, jkk: 519360000, jkm: 432800000, total: 18264160000 },
    { gol: "PAMA (Golongan III)", peserta: 14200, gp: 71000000000, tht: 2307500000, pensiun: 3372500000, jkk: 170400000, jkm: 142000000, total: 5992400000 },
    { gol: "PAMEN (Golongan IV)", peserta: 5500, gp: 38500000000, tht: 1251250000, pensiun: 1828750000, jkk: 92400000, jkm: 77000000, total: 3249400000 },
    { gol: "PATI (Perwira Tinggi)", peserta: 408, gp: 3672000000, tht: 119340000, pensiun: 174420000, jkk: 8812800, jkm: 7344000, total: 309916800 }
  ]
};

const SUB_TNI_AL_PNS = {
  id: "TNI_AL_PNS",
  kategori: "PNS TNI AL",
  jenisPersonil: "PNS",
  badge: "ASN",
  peserta: 5922,
  tht: 776587500,
  pensiun: 1135012500,
  jkk: 57348000,
  jkm: 47790000,
  total: 2016738000,
  golonganBreakdown: [
    { gol: "Golongan I", peserta: 310, gp: 1050000000, tht: 34125000, pensiun: 49875000, jkk: 2520000, jkm: 2100000, total: 88620000 },
    { gol: "Golongan II", peserta: 2350, gp: 9100000000, tht: 295750000, pensiun: 432250000, jkk: 21840000, jkm: 18200000, total: 768040000 },
    { gol: "Golongan III", peserta: 2680, gp: 10600000000, tht: 344500000, pensiun: 503500000, jkk: 25440000, jkm: 21200000, total: 894640000 },
    { gol: "Golongan IV", peserta: 582, gp: 3145000000, tht: 102212500, pensiun: 149387500, jkk: 7548000, jkm: 6290000, total: 265438000 }
  ]
};

const SUB_TNI_AL_PPPK = {
  id: "TNI_AL_PPPK",
  kategori: "PPPK TNI AL",
  jenisPersonil: "PPPK",
  badge: "PPK / Non-pensiun",
  peserta: 1512,
  tht: null,
  pensiun: null,
  jkk: 18599972,
  jkm: 15499977,
  total: 34099949,
  golonganBreakdown: [
    { gol: "Golongan IX", peserta: 550, gp: 2600000000, tht: null, pensiun: null, jkk: 6240000, jkm: 5200000, total: 11440000 },
    { gol: "Golongan X", peserta: 560, gp: 2800000000, tht: null, pensiun: null, jkk: 6720000, jkm: 5600000, total: 12320000 },
    { gol: "Golongan XI", peserta: 280, gp: 1400000000, tht: null, pensiun: null, jkk: 3360000, jkm: 2800000, total: 6160000 },
    { gol: "Golongan XII", peserta: 122, gp: 949988333, tht: null, pensiun: null, jkk: 2279972, jkm: 1899977, total: 4179949 }
  ]
};

// --- TNI AU ---
const SUB_TNI_AU_PRAJURIT = {
  id: "TNI_AU_PRAJURIT",
  kategori: "Prajurit TNI AU",
  jenisPersonil: "Prajurit",
  badge: "Militer",
  peserta: 109300,
  tht: 13702000000,
  pensiun: 20026000000,
  jkk: 1011840000,
  jkm: 843200000,
  total: 35583040000,
  golonganBreakdown: [
    { gol: "TAMTAMA (Golongan I)", peserta: 45000, gp: 135000000000, tht: 4387500000, pensiun: 6412500000, jkk: 324000000, jkm: 270000000, total: 11394000000 },
    { gol: "BINTARA (Golongan II)", peserta: 46200, gp: 184800000000, tht: 6006000000, pensiun: 8778000000, jkk: 443520000, jkm: 369600000, total: 15597120000 },
    { gol: "PAMA (Golongan III)", peserta: 12800, gp: 64000000000, tht: 2080000000, pensiun: 3040000000, jkk: 153600000, jkm: 128000000, total: 5401600000 },
    { gol: "PAMEN (Golongan IV)", peserta: 4950, gp: 34650000000, tht: 1126125000, pensiun: 1645875000, jkk: 83160000, jkm: 69300000, total: 2924460000 },
    { gol: "PATI (Perwira Tinggi)", peserta: 350, gp: 3150000000, tht: 102375000, pensiun: 149625000, jkk: 7560000, jkm: 6300000, total: 265860000 }
  ]
};

const SUB_TNI_AU_PNS = {
  id: "TNI_AU_PNS",
  kategori: "PNS TNI AU",
  jenisPersonil: "PNS",
  badge: "ASN",
  peserta: 3575,
  tht: 467675000,
  pensiun: 683525000,
  jkk: 34536000,
  jkm: 28780000,
  total: 1214516000,
  golonganBreakdown: [
    { gol: "Golongan I", peserta: 180, gp: 600000000, tht: 19500000, pensiun: 28500000, jkk: 1440000, jkm: 1200000, total: 50640000 },
    { gol: "Golongan II", peserta: 1420, gp: 5400000000, tht: 175500000, pensiun: 256500000, jkk: 12960000, jkm: 10800000, total: 455760000 },
    { gol: "Golongan III", peserta: 1590, gp: 6300000000, tht: 204750000, pensiun: 299250000, jkk: 15120000, jkm: 12600000, total: 531720000 },
    { gol: "Golongan IV", peserta: 385, gp: 2090000000, tht: 67925000, pensiun: 99275000, jkk: 5016000, jkm: 4180000, total: 176396000 }
  ]
};

const SUB_TNI_AU_PPPK = {
  id: "TNI_AU_PPPK",
  kategori: "PPPK TNI AU",
  jenisPersonil: "PPPK",
  badge: "PPK / Non-pensiun",
  peserta: 1618,
  tht: null,
  pensiun: null,
  jkk: 20759219,
  jkm: 17299350,
  total: 38058569,
  golonganBreakdown: [
    { gol: "Golongan IX", peserta: 610, gp: 2900000000, tht: null, pensiun: null, jkk: 6960000, jkm: 5800000, total: 12760000 },
    { gol: "Golongan X", peserta: 580, gp: 2900000000, tht: null, pensiun: null, jkk: 6960000, jkm: 5800000, total: 12760000 },
    { gol: "Golongan XI", peserta: 310, gp: 1600000000, tht: null, pensiun: null, jkk: 3840000, jkm: 3200000, total: 7040000 },
    { gol: "Golongan XII", peserta: 118, gp: 1249674583, tht: null, pensiun: null, jkk: 2999219, jkm: 2499350, total: 5498569 }
  ]
};

// --- MABES TNI ---
const SUB_MABES_TNI_PRAJURIT = {
  id: "MABES_TNI_PRAJURIT",
  kategori: "Prajurit Mabes TNI",
  jenisPersonil: "Prajurit",
  badge: "Militer",
  peserta: 15420,
  tht: 2247050000,
  pensiun: 3284150000,
  jkk: 165936000,
  jkm: 138280000,
  total: 5835416000,
  golonganBreakdown: [
    { gol: "TAMTAMA (Golongan I)", peserta: 3100, gp: 9300000000, tht: 302250000, pensiun: 441750000, jkk: 22320000, jkm: 18600000, total: 784920000 },
    { gol: "BINTARA (Golongan II)", peserta: 6200, gp: 24800000000, tht: 806000000, pensiun: 1178000000, jkk: 59520000, jkm: 49600000, total: 2093120000 },
    { gol: "PAMA (Golongan III)", peserta: 3900, gp: 19500000000, tht: 633750000, pensiun: 926250000, jkk: 46800000, jkm: 39000000, total: 1645800000 },
    { gol: "PAMEN & PATI", peserta: 2220, gp: 15540000000, tht: 505050000, pensiun: 738150000, jkk: 37296000, jkm: 31080000, total: 1311576000 }
  ]
};

const SUB_MABES_TNI_PNS = {
  id: "MABES_TNI_PNS",
  kategori: "PNS Mabes TNI",
  jenisPersonil: "PNS",
  badge: "ASN",
  peserta: 2960,
  tht: 361493644,
  pensiun: 528336864,
  jkk: 26694915,
  jkm: 22245763,
  total: 938771186,
  golonganBreakdown: [
    { gol: "Golongan I", peserta: 110, gp: 400000000, tht: 13000000, pensiun: 19000000, jkk: 960000, jkm: 800000, total: 33760000 },
    { gol: "Golongan II", peserta: 1180, gp: 4500000000, tht: 146250000, pensiun: 213750000, jkk: 10800000, jkm: 9000000, total: 379800000 },
    { gol: "Golongan III", peserta: 1320, gp: 5100000000, tht: 165750000, pensiun: 242250000, jkk: 12240000, jkm: 10200000, total: 430440000 },
    { gol: "Golongan IV", peserta: 350, gp: 1122881354, tht: 36493644, pensiun: 53336864, jkk: 2694915, jkm: 2245763, total: 94771186 }
  ]
};

const SUB_MABES_TNI_PPPK = {
  id: "MABES_TNI_PPPK",
  kategori: "PPPK Mabes TNI",
  jenisPersonil: "PPPK",
  badge: "PPK / Non-pensiun",
  peserta: 640,
  tht: null,
  pensiun: null,
  jkk: 8072727,
  jkm: 6727273,
  total: 14800000,
  golonganBreakdown: [
    { gol: "Golongan IX", peserta: 250, gp: 1200000000, tht: null, pensiun: null, jkk: 2880000, jkm: 2400000, total: 5280000 },
    { gol: "Golongan X", peserta: 240, gp: 1200000000, tht: null, pensiun: null, jkk: 2880000, jkm: 2400000, total: 5280000 },
    { gol: "Golongan XI", peserta: 110, gp: 600000000, tht: null, pensiun: null, jkk: 1440000, jkm: 1200000, total: 2640000 },
    { gol: "Golongan XII", peserta: 40, gp: 363636250, tht: null, pensiun: null, jkk: 872727, jkm: 727273, total: 1600000 }
  ]
};

// --- KEMHAN ---
const SUB_KEMHAN_PNS = {
  id: "KEMHAN_PNS",
  kategori: "PNS Kemhan",
  jenisPersonil: "PNS",
  badge: "ASN",
  peserta: 14233,
  tht: 1876286250,
  pensiun: 2742263750,
  jkk: 138543600,
  jkm: 115453000,
  total: 4872546600,
  golonganBreakdown: [
    { gol: "Golongan I", peserta: 780, gp: 2700000000, tht: 87750000, pensiun: 128250000, jkk: 6480000, jkm: 5400000, total: 227880000 },
    { gol: "Golongan II", peserta: 5200, gp: 20100000000, tht: 653250000, pensiun: 954750000, jkk: 48240000, jkm: 40200000, total: 1696440000 },
    { gol: "Golongan III", peserta: 6850, gp: 27200000000, tht: 884000000, pensiun: 1292000000, jkk: 65280000, jkm: 54400000, total: 2295680000 },
    { gol: "Golongan IV", peserta: 1403, gp: 7716500000, tht: 250786250, pensiun: 366533750, jkk: 18519600, jkm: 15433000, total: 651272600 }
  ]
};

const SUB_KEMHAN_PPPK = {
  id: "KEMHAN_PPPK",
  kategori: "PPPK Kemhan",
  jenisPersonil: "PPPK",
  badge: "PPK / Non-pensiun",
  peserta: 7732,
  tht: null,
  pensiun: null,
  jkk: 21752795,
  jkm: 18127329,
  total: 39880124,
  golonganBreakdown: [
    { gol: "Golongan IX", peserta: 2950, gp: 3200000000, tht: null, pensiun: null, jkk: 7680000, jkm: 6400000, total: 14080000 },
    { gol: "Golongan X", peserta: 2850, gp: 3200000000, tht: null, pensiun: null, jkk: 7680000, jkm: 6400000, total: 14080000 },
    { gol: "Golongan XI", peserta: 1420, gp: 1800000000, tht: null, pensiun: null, jkk: 4320000, jkm: 3600000, total: 7920000 },
    { gol: "Golongan XII", peserta: 512, gp: 863664583, tht: null, pensiun: null, jkk: 2072795, jkm: 1727329, total: 3800124 }
  ]
};

// --- POLRI (KEPOLISIAN REPUBLIK INDONESIA) ---
const SUB_POLRI_ANGGOTA = {
  id: "POLRI_ANGGOTA_ROW",
  kategori: "Prajurit / Anggota Polri",
  jenisPersonil: "Prajurit",
  badge: "Prajurit Polri",
  peserta: 458120,
  tht: 63044800000,
  pensiun: 92142400000,
  jkk: 4655616000,
  jkm: 3879680000,
  total: 163722496000,
  golonganBreakdown: [
    { gol: "TAMTAMA POLRI (Bharada s.d. Abripol)", peserta: 42000, gp: 126000000000, tht: 4095000000, pensiun: 5985000000, jkk: 302400000, jkm: 252000000, total: 10634400000 },
    { gol: "BINTARA POLRI (Bripda s.d. Aiptu)", peserta: 325000, gp: 1300000000000, tht: 42250000000, pensiun: 61750000000, jkk: 3120000000, jkm: 2600000000, total: 109720000000 },
    { gol: "PAMA POLRI (Ipda s.d. AKP)", peserta: 62000, gp: 310000000000, tht: 10075000000, pensiun: 14725000000, jkk: 744000000, jkm: 620000000, total: 26164000000 },
    { gol: "PAMEN POLRI (Kompol s.d. Kombes)", peserta: 28500, gp: 196650000000, tht: 6391125000, pensiun: 9340875000, jkk: 471960000, jkm: 393300000, total: 16597260000 },
    { gol: "PATI POLRI (Brigjen s.d. Jenderal)", peserta: 620, gp: 7190000000, tht: 233675000, pensiun: 341525000, jkk: 17256000, jkm: 14380000, total: 606836000 }
  ]
};

const SUB_POLRI_PNS = {
  id: "PNS_POLRI",
  kategori: "ASN Polri (PNS)",
  jenisPersonil: "PNS",
  badge: "ASN Polri",
  peserta: 23416,
  tht: 3087630000,
  pensiun: 4512690000,
  jkk: 228000000,
  jkm: 190000000,
  total: 8018320000,
  golonganBreakdown: [
    { gol: "Golongan I (Juru)", peserta: 1200, gp: 4200000000, tht: 136500000, pensiun: 199500000, jkk: 10080000, jkm: 8400000, total: 354480000 },
    { gol: "Golongan II (Pengatur)", peserta: 9800, gp: 39200000000, tht: 1274000000, pensiun: 1862000000, jkk: 94080000, jkm: 78400000, total: 3308480000 },
    { gol: "Golongan III (Penata)", peserta: 10100, gp: 42420000000, tht: 1378650000, pensiun: 2014950000, jkk: 101808000, jkm: 84840000, total: 3580248000 },
    { gol: "Golongan IV (Pembina)", peserta: 2316, gp: 9182461538, tht: 298480000, pensiun: 436240000, jkk: 22032000, jkm: 18360000, total: 775112000 }
  ]
};

const SUB_POLRI_PPPK = {
  id: "PPPK_POLRI",
  kategori: "PPK Polri (PPPK)",
  jenisPersonil: "PPPK",
  badge: "PPK Polri",
  peserta: 6800,
  tht: null,
  pensiun: null,
  jkk: 70800000,
  jkm: 59000000,
  total: 129800000,
  golonganBreakdown: [
    { gol: "Golongan IX (Ahli Pertama)", peserta: 2600, gp: 10400000000, tht: null, pensiun: null, jkk: 24960000, jkm: 20800000, total: 45760000 },
    { gol: "Golongan X (Ahli Pertama)", peserta: 2500, gp: 11000000000, tht: null, pensiun: null, jkk: 26400000, jkm: 22000000, total: 48400000 },
    { gol: "Golongan XI (Ahli Muda)", peserta: 1200, gp: 5600000000, tht: null, pensiun: null, jkk: 13440000, jkm: 11200000, total: 24640000 },
    { gol: "Golongan XII (Ahli Madya)", peserta: 500, gp: 2500000000, tht: null, pensiun: null, jkk: 6000000, jkm: 5000000, total: 11000000 }
  ]
};

// =========================================================================
// HELPER COMPUTE FUNCTIONS
// =========================================================================

const computeInstansiTotals = (baseMeta, subRows) => {
  let peserta = 0, tht = 0, pensiun = 0, jkk = 0, jkm = 0, total = 0;
  subRows.forEach(sr => {
    peserta += sr.peserta || 0;
    tht += sr.tht || 0;
    pensiun += sr.pensiun || 0;
    jkk += sr.jkk || 0;
    jkm += sr.jkm || 0;
    total += sr.total || 0;
  });
  return {
    ...baseMeta,
    unorCount: `${subRows.length} kategori`,
    peserta,
    tht,
    pensiun,
    jkk,
    jkm,
    total,
    subRows
  };
};

const computeEntityTotals = (entityMeta, instansiList) => {
  let peserta = 0, totalIuran = 0, tht = 0, pensiun = 0, jkk = 0, jkm = 0;
  instansiList.forEach(inst => {
    inst.subRows.forEach(sr => {
      peserta += sr.peserta || 0;
      tht += sr.tht || 0;
      pensiun += sr.pensiun || 0;
      jkk += sr.jkk || 0;
      jkm += sr.jkm || 0;
      totalIuran += sr.total || 0;
    });
  });
  const iuranPeserta = tht + pensiun;
  const iuranNegara = jkk + jkm;
  const pesertaRatio = totalIuran > 0 ? (iuranPeserta / totalIuran) * 100 : 84.0;
  const negaraRatio = totalIuran > 0 ? (iuranNegara / totalIuran) * 100 : 16.0;

  return {
    ...entityMeta,
    peserta,
    totalIuran,
    iuranPeserta,
    iuranNegara,
    pesertaRatio,
    negaraRatio,
    instansiList
  };
};

// Base Instansi definitions
const BASE_TNI_AD = { id: "TNI_AD", name: "TNI AD" };
const BASE_TNI_AL = { id: "TNI_AL", name: "TNI AL" };
const BASE_TNI_AU = { id: "TNI_AU", name: "TNI AU" };
const BASE_MABES_TNI = { id: "MABES_TNI", name: "Mabes TNI" };
const BASE_KEMHAN = { id: "KEMHAN", name: "Kemhan" };
const BASE_POLRI = { id: "POLRI", name: "Kepolisian Republik Indonesia (POLRI)" };

// =========================================================================
// MASTER DATA FOR "ENTITAS PEMBINA" GROUPING
// =========================================================================

const MASTER_ENTITIES_DATA = {
  // --- KELOMPOK TNI & KEMHAN ---
  TNI_KEMHAN: computeEntityTotals(
    {
      id: "TNI_KEMHAN",
      kluster: "TNI_KEMHAN",
      title: "Prajurit TNI & ASN Kemhan",
      badgeInstansi: "5 instansi (AD, AL, AU, Mabes, Kemhan)"
    },
    [
      computeInstansiTotals(BASE_TNI_AD, [SUB_TNI_AD_PRAJURIT, SUB_TNI_AD_PNS, SUB_TNI_AD_PPPK]),
      computeInstansiTotals(BASE_TNI_AL, [SUB_TNI_AL_PRAJURIT, SUB_TNI_AL_PNS, SUB_TNI_AL_PPPK]),
      computeInstansiTotals(BASE_TNI_AU, [SUB_TNI_AU_PRAJURIT, SUB_TNI_AU_PNS, SUB_TNI_AU_PPPK]),
      computeInstansiTotals(BASE_MABES_TNI, [SUB_MABES_TNI_PRAJURIT, SUB_MABES_TNI_PNS, SUB_MABES_TNI_PPPK]),
      computeInstansiTotals(BASE_KEMHAN, [SUB_KEMHAN_PNS, SUB_KEMHAN_PPPK])
    ]
  ),

  PRAJURIT_TNI: computeEntityTotals(
    {
      id: "PRAJURIT_TNI",
      kluster: "TNI_KEMHAN",
      title: "Prajurit TNI",
      badgeInstansi: "4 matra/kotama (AD, AL, AU, Mabes)"
    },
    [
      computeInstansiTotals(BASE_TNI_AD, [SUB_TNI_AD_PRAJURIT]),
      computeInstansiTotals(BASE_TNI_AL, [SUB_TNI_AL_PRAJURIT]),
      computeInstansiTotals(BASE_TNI_AU, [SUB_TNI_AU_PRAJURIT]),
      computeInstansiTotals(BASE_MABES_TNI, [SUB_MABES_TNI_PRAJURIT])
    ]
  ),

  ASN_KEMHAN: computeEntityTotals(
    {
      id: "ASN_KEMHAN",
      kluster: "TNI_KEMHAN",
      title: "ASN Kemhan",
      badgeInstansi: "5 instansi (PNS & PPPK)"
    },
    [
      computeInstansiTotals(BASE_TNI_AD, [SUB_TNI_AD_PNS, SUB_TNI_AD_PPPK]),
      computeInstansiTotals(BASE_TNI_AL, [SUB_TNI_AL_PNS, SUB_TNI_AL_PPPK]),
      computeInstansiTotals(BASE_TNI_AU, [SUB_TNI_AU_PNS, SUB_TNI_AU_PPPK]),
      computeInstansiTotals(BASE_MABES_TNI, [SUB_MABES_TNI_PNS, SUB_MABES_TNI_PPPK]),
      computeInstansiTotals(BASE_KEMHAN, [SUB_KEMHAN_PNS, SUB_KEMHAN_PPPK])
    ]
  ),

  // --- KELOMPOK KEPOLISIAN RI (POLRI) ---
  POLRI: computeEntityTotals(
    {
      id: "POLRI",
      kluster: "POLRI",
      title: "POLRI & ASN Polri (Semua)",
      badgeInstansi: "Prajurit, ASN & PPK Polri"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_ANGGOTA, SUB_POLRI_PNS, SUB_POLRI_PPPK])
    ]
  ),

  POLRI_PRAJURIT: computeEntityTotals(
    {
      id: "POLRI_PRAJURIT",
      kluster: "POLRI",
      title: "Prajurit / Anggota Polri",
      badgeInstansi: "Khusus Prajurit/Anggota Polri"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_ANGGOTA])
    ]
  ),

  POLRI_ASN: computeEntityTotals(
    {
      id: "POLRI_ASN",
      kluster: "POLRI",
      title: "ASN Polri (PNS)",
      badgeInstansi: "Khusus Pegawai Negeri Sipil"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_PNS])
    ]
  ),

  POLRI_PPK: computeEntityTotals(
    {
      id: "POLRI_PPK",
      kluster: "POLRI",
      title: "PPK Polri (PPPK)",
      badgeInstansi: "Khusus Perjanjian Kerja"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_PPPK])
    ]
  ),

  POLRI_ASN_PPK: computeEntityTotals(
    {
      id: "POLRI_ASN_PPK",
      kluster: "POLRI",
      title: "ASN & PPK Polri",
      badgeInstansi: "Gabungan ASN & PPK Polri"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_PNS, SUB_POLRI_PPPK])
    ]
  )
};

// =========================================================================
// MASTER DATA FOR "INSTANSI" GROUPING
// =========================================================================

const MASTER_INSTANSI_DATA = {
  INST_ALL: computeEntityTotals(
    {
      id: "INST_ALL",
      title: "Semua Instansi",
      badgeInstansi: "6 instansi gabungan"
    },
    [
      computeInstansiTotals(BASE_TNI_AD, [SUB_TNI_AD_PRAJURIT, SUB_TNI_AD_PNS, SUB_TNI_AD_PPPK]),
      computeInstansiTotals(BASE_TNI_AL, [SUB_TNI_AL_PRAJURIT, SUB_TNI_AL_PNS, SUB_TNI_AL_PPPK]),
      computeInstansiTotals(BASE_TNI_AU, [SUB_TNI_AU_PRAJURIT, SUB_TNI_AU_PNS, SUB_TNI_AU_PPPK]),
      computeInstansiTotals(BASE_MABES_TNI, [SUB_MABES_TNI_PRAJURIT, SUB_MABES_TNI_PNS, SUB_MABES_TNI_PPPK]),
      computeInstansiTotals(BASE_KEMHAN, [SUB_KEMHAN_PNS, SUB_KEMHAN_PPPK]),
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_ANGGOTA, SUB_POLRI_PNS, SUB_POLRI_PPPK])
    ]
  ),

  INST_TNI_AD: computeEntityTotals(
    {
      id: "INST_TNI_AD",
      title: "TNI AD",
      badgeInstansi: "Prajurit, PNS, PPPK"
    },
    [
      computeInstansiTotals(BASE_TNI_AD, [SUB_TNI_AD_PRAJURIT, SUB_TNI_AD_PNS, SUB_TNI_AD_PPPK])
    ]
  ),

  INST_TNI_AL: computeEntityTotals(
    {
      id: "INST_TNI_AL",
      title: "TNI AL",
      badgeInstansi: "Prajurit, PNS, PPPK"
    },
    [
      computeInstansiTotals(BASE_TNI_AL, [SUB_TNI_AL_PRAJURIT, SUB_TNI_AL_PNS, SUB_TNI_AL_PPPK])
    ]
  ),

  INST_TNI_AU: computeEntityTotals(
    {
      id: "INST_TNI_AU",
      title: "TNI AU",
      badgeInstansi: "Prajurit, PNS, PPPK"
    },
    [
      computeInstansiTotals(BASE_TNI_AU, [SUB_TNI_AU_PRAJURIT, SUB_TNI_AU_PNS, SUB_TNI_AU_PPPK])
    ]
  ),

  INST_MABES_TNI: computeEntityTotals(
    {
      id: "INST_MABES_TNI",
      title: "Mabes TNI",
      badgeInstansi: "Prajurit, PNS, PPPK"
    },
    [
      computeInstansiTotals(BASE_MABES_TNI, [SUB_MABES_TNI_PRAJURIT, SUB_MABES_TNI_PNS, SUB_MABES_TNI_PPPK])
    ]
  ),

  INST_KEMHAN: computeEntityTotals(
    {
      id: "INST_KEMHAN",
      title: "Kemhan",
      badgeInstansi: "PNS & PPPK"
    },
    [
      computeInstansiTotals(BASE_KEMHAN, [SUB_KEMHAN_PNS, SUB_KEMHAN_PPPK])
    ]
  ),

  INST_POLRI: computeEntityTotals(
    {
      id: "INST_POLRI",
      title: "POLRI (Semua)",
      badgeInstansi: "Prajurit, ASN & PPK"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_ANGGOTA, SUB_POLRI_PNS, SUB_POLRI_PPPK])
    ]
  ),

  INST_POLRI_PRAJURIT: computeEntityTotals(
    {
      id: "INST_POLRI_PRAJURIT",
      title: "Polri — Prajurit",
      badgeInstansi: "Khusus Anggota Polri"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_ANGGOTA])
    ]
  ),

  INST_POLRI_ASN: computeEntityTotals(
    {
      id: "INST_POLRI_ASN",
      title: "Polri — ASN",
      badgeInstansi: "Khusus PNS Polri"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_PNS])
    ]
  ),

  INST_POLRI_PPK: computeEntityTotals(
    {
      id: "INST_POLRI_PPK",
      title: "Polri — PPK",
      badgeInstansi: "Khusus PPPK Polri"
    },
    [
      computeInstansiTotals(BASE_POLRI, [SUB_POLRI_PPPK])
    ]
  )
};

// =========================================================================
// PRESET SALARY DATA FOR INTERACTIVE CALCULATOR (SIMULASI)
// =========================================================================

const POLRI_PRESETS = {
  PRAJURIT: [
    { label: "Bharada (Bhayangkara Dua)", gp: 1775000, gol: "TAMTAMA" },
    { label: "Bharatu (Bhayangkara Satu)", gp: 1830500, gol: "TAMTAMA" },
    { label: "Bharaka (Bhayangkara Kepala)", gp: 1887800, gol: "TAMTAMA" },
    { label: "Abripda (Ajun Brigadir Polisi Dua)", gp: 1946800, gol: "TAMTAMA" },
    { label: "Abriptu (Ajun Brigadir Polisi Satu)", gp: 2007700, gol: "TAMTAMA" },
    { label: "Abripol (Ajun Brigadir Polisi)", gp: 2070500, gol: "TAMTAMA" },
    { label: "Bripda (Brigadir Polisi Dua)", gp: 2272100, gol: "BINTARA" },
    { label: "Briptu (Brigadir Polisi Satu)", gp: 2343100, gol: "BINTARA" },
    { label: "Brigpol (Brigadir Polisi)", gp: 2416400, gol: "BINTARA" },
    { label: "Bripka (Brigadir Polisi Kepala)", gp: 2492000, gol: "BINTARA" },
    { label: "Aipda (Ajun Inspektur Polisi Dua)", gp: 2570000, gol: "BINTARA" },
    { label: "Aiptu (Ajun Inspektur Polisi Satu)", gp: 2650300, gol: "BINTARA" },
    { label: "Ipda (Inspektur Polisi Dua)", gp: 2954200, gol: "PAMA" },
    { label: "Iptu (Inspektur Polisi Satu)", gp: 3046600, gol: "PAMA" },
    { label: "AKP (Ajun Komisaris Polisi)", gp: 3141900, gol: "PAMA" },
    { label: "Kompol (Komisaris Polisi)", gp: 3240200, gol: "PAMEN" },
    { label: "AKBP (Ajun Komisaris Besar Polisi)", gp: 3341500, gol: "PAMEN" },
    { label: "Kombes Pol (Komisaris Besar Polisi)", gp: 3446000, gol: "PAMEN" },
    { label: "Brigjen Pol (Brigadir Jenderal Polisi)", gp: 3553800, gol: "PATI" },
    { label: "Irjen Pol (Inspektur Jenderal Polisi)", gp: 3665000, gol: "PATI" },
    { label: "Komjen Pol (Komisaris Jenderal Polisi)", gp: 5485800, gol: "PATI" },
    { label: "Jenderal Polisi", gp: 6405500, gol: "PATI" },
  ],
  PNS: [
    { label: "Golongan I/a (Juru Muda)", gp: 1685700, gol: "GOL I" },
    { label: "Golongan I/d (Juru Tingkat I)", gp: 2901400, gol: "GOL I" },
    { label: "Golongan II/a (Pengatur Muda)", gp: 2184000, gol: "GOL II" },
    { label: "Golongan II/d (Pengatur Tingkat I)", gp: 4125600, gol: "GOL II" },
    { label: "Golongan III/a (Penata Muda)", gp: 2785700, gol: "GOL III" },
    { label: "Golongan III/d (Penata Tingkat I)", gp: 5180700, gol: "GOL III" },
    { label: "Golongan IV/a (Pembina)", gp: 3287800, gol: "GOL IV" },
    { label: "Golongan IV/e (Pembina Utama)", gp: 6373200, gol: "GOL IV" },
  ],
  PPPK: [
    { label: "Golongan IX (Ahli Pertama)", gp: 3203600, gol: "PPK IX" },
    { label: "Golongan X (Ahli Pertama)", gp: 3339100, gol: "PPK X" },
    { label: "Golongan XI (Ahli Muda)", gp: 3480300, gol: "PPK XI" },
    { label: "Golongan XII (Ahli Madya)", gp: 3627500, gol: "PPK XII" },
  ]
};

export const KalkulatorIuran = () => {
  // Main view mode: "rekap" (Rekapitulasi Iuran & Monitoring) | "simulasi" (Kalkulator Simulasi Interaktif)
  const [activeTab, setActiveTab] = useState("rekap");

  // Navigation / Date states
  const [currentMonthIdx, setCurrentMonthIdx] = useState(9); // 9 = Oktober
  const [currentYear, setCurrentYear] = useState(2026);
  const [statusPeriode, setStatusPeriode] = useState("Rekonsiliasi");

  // Grouping state: "entitas" (Entitas pembina) | "instansi" (Instansi)
  const [kelompokkanPer, setKelompokkanPer] = useState("entitas");

  // Kluster filter for "entitas": "all" | "tni" | "polri"
  const [klusterFilter, setKlusterFilter] = useState("all");

  // Selected Entity Card
  const [selectedEntityId, setSelectedEntityId] = useState("POLRI");
  const [selectedInstansiId, setSelectedInstansiId] = useState("INST_POLRI");

  // Filter Pill: "Semua" | "Prajurit / Anggota" | "PNS (ASN)" | "PPK (PPPK)"
  const [filterPill, setFilterPill] = useState("Semua");

  // Search Input
  const [searchQuery, setSearchQuery] = useState("");

  // Accordion Expand/Collapse state
  const [expandedRows, setExpandedRows] = useState({
    TNI_AD: true,
    TNI_AL: true,
    TNI_AU: true,
    MABES_TNI: true,
    KEMHAN: true,
    POLRI: true
  });

  // Modal Detail Rincian Golongan
  const [modalGolonganData, setModalGolonganData] = useState(null);

  // Modal Finalisasi Periode
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  // Modal Preview Export
  const [preview, setPreview] = useState(null);

  // =========================================================================
  // STATE UNTUK SIMULASI KALKULATOR INTERAKTIF
  // =========================================================================
  const [simInstitusi, setSimInstitusi] = useState("POLRI"); // "POLRI" | "TNI"
  const [simKategori, setSimKategori] = useState("Prajurit"); // "Prajurit" | "PNS" | "PPPK"
  const [simPresetIdx, setSimPresetIdx] = useState(6); // Default: Bripda
  const [simGajiPokok, setSimGajiPokok] = useState(2272100);
  const [simStatusKawin, setSimStatusKawin] = useState(true); // Tunj. Istri/Suami 10%
  const [simJmlAnak, setSimJmlAnak] = useState(1); // Tunj. Anak 2% per anak (max 2)
  const [simJmlPersonil, setSimJmlPersonil] = useState(1); // 1 = perorangan, > 1 = simulasi satker
  const [simNamaSatker, setSimNamaSatker] = useState("Polres Metro Jakarta Selatan");
  const [simCopied, setSimCopied] = useState(false);

  // Current Period Label
  const periodeLabel = `${BULAN_LIST[currentMonthIdx]} ${currentYear}`;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonthIdx === 0) {
      setCurrentMonthIdx(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIdx(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIdx === 11) {
      setCurrentMonthIdx(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIdx(prev => prev + 1);
    }
  };

  // Toggle single row
  const toggleRow = (rowId) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Active Entity Data based on grouping
  const activeEntity = useMemo(() => {
    if (kelompokkanPer === "instansi") {
      return MASTER_INSTANSI_DATA[selectedInstansiId] || MASTER_INSTANSI_DATA.INST_ALL;
    }
    return MASTER_ENTITIES_DATA[selectedEntityId] || MASTER_ENTITIES_DATA.POLRI;
  }, [kelompokkanPer, selectedEntityId, selectedInstansiId]);

  // Check if all rows are currently expanded
  const areAllExpanded = useMemo(() => {
    if (!activeEntity || !activeEntity.instansiList) return true;
    return activeEntity.instansiList.every(inst => expandedRows[inst.id]);
  }, [activeEntity, expandedRows]);

  // Toggle all rows
  const handleToggleAll = () => {
    if (!activeEntity || !activeEntity.instansiList) return;
    const nextState = !areAllExpanded;
    const updated = { ...expandedRows };
    activeEntity.instansiList.forEach(inst => {
      updated[inst.id] = nextState;
    });
    setExpandedRows(updated);
  };

  // Filtered rows based on Pill filter & Search Query
  const filteredInstansiList = useMemo(() => {
    return activeEntity.instansiList.map(inst => {
      let filteredSubRows = inst.subRows;

      if (filterPill === "Prajurit / Anggota" || filterPill === "Prajurit") {
        filteredSubRows = filteredSubRows.filter(sr =>
          sr.jenisPersonil === "Prajurit" ||
          sr.kategori?.toLowerCase().includes("prajurit") ||
          sr.kategori?.toLowerCase().includes("anggota") ||
          sr.badge?.toLowerCase().includes("polri") ||
          sr.badge?.toLowerCase().includes("militer")
        );
      } else if (filterPill === "PNS (ASN)" || filterPill === "PNS") {
        filteredSubRows = filteredSubRows.filter(sr =>
          sr.jenisPersonil === "PNS" ||
          sr.kategori?.toLowerCase().includes("pns") ||
          sr.badge?.toLowerCase().includes("asn")
        );
      } else if (filterPill === "PPK (PPPK)" || filterPill === "PPPK") {
        filteredSubRows = filteredSubRows.filter(sr =>
          sr.jenisPersonil === "PPPK" ||
          sr.kategori?.toLowerCase().includes("ppk") ||
          sr.kategori?.toLowerCase().includes("pppk") ||
          sr.badge?.toLowerCase().includes("non-pensiun")
        );
      }

      // Filter by search query if present
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const instMatch = inst.name.toLowerCase().includes(q);
        const subMatch = filteredSubRows.some(sr =>
          sr.kategori.toLowerCase().includes(q) ||
          (sr.badge && sr.badge.toLowerCase().includes(q))
        );
        if (!instMatch && !subMatch) {
          return null;
        }
        if (!instMatch && subMatch) {
          filteredSubRows = filteredSubRows.filter(sr =>
            sr.kategori.toLowerCase().includes(q) ||
            (sr.badge && sr.badge.toLowerCase().includes(q))
          );
        }
      }

      if (filteredSubRows.length === 0 && filterPill !== "Semua") {
        return null;
      }

      // Calculate dynamic parent totals based on filtered subRows
      const pPeserta = filteredSubRows.reduce((a, b) => a + (b.peserta || 0), 0);
      const pTht = filteredSubRows.reduce((a, b) => a + (b.tht || 0), 0);
      const pPensiun = filteredSubRows.reduce((a, b) => a + (b.pensiun || 0), 0);
      const pJkk = filteredSubRows.reduce((a, b) => a + (b.jkk || 0), 0);
      const pJkm = filteredSubRows.reduce((a, b) => a + (b.jkm || 0), 0);
      const pTotal = filteredSubRows.reduce((a, b) => a + (b.total || 0), 0);

      return {
        ...inst,
        unorCount: `${filteredSubRows.length} kategori`,
        peserta: pPeserta,
        tht: pTht,
        pensiun: pPensiun,
        jkk: pJkk,
        jkm: pJkm,
        total: pTotal,
        subRows: filteredSubRows
      };
    }).filter(Boolean);
  }, [activeEntity, filterPill, searchQuery]);

  // Dynamic subtotal across filtered visible rows
  const currentSubtotal = useMemo(() => {
    let peserta = 0;
    let tht = 0;
    let pensiun = 0;
    let jkk = 0;
    let jkm = 0;
    let total = 0;

    filteredInstansiList.forEach(inst => {
      inst.subRows.forEach(sr => {
        peserta += sr.peserta || 0;
        tht += sr.tht || 0;
        pensiun += sr.pensiun || 0;
        jkk += sr.jkk || 0;
        jkm += sr.jkm || 0;
        total += sr.total || 0;
      });
    });

    return { peserta, tht, pensiun, jkk, jkm, total };
  }, [filteredInstansiList]);

  // Total unors count
  const totalUnorCount = useMemo(() => {
    return filteredInstansiList.reduce((acc, inst) => acc + inst.subRows.length, 0);
  }, [filteredInstansiList]);

  // Export Table Data Generator
  const handleExport = (format = "excel") => {
    const isExcel = format === "excel";
    const columns = [
      "Instansi / Kategori",
      "Status Personil",
      "Peserta",
      "THT 3,25%",
      "Pensiun 4,75%",
      "JKK 0,62%",
      "JKM 0,81%",
      "Total Iuran"
    ];
    const alignments = ["left", "left", "right", "right", "right", "right", "right", "right"];

    const rows = [];
    filteredInstansiList.forEach(inst => {
      // Parent Row
      rows.push([
        `${inst.name} (${inst.unorCount})`,
        "Induk Satker",
        fmtNum(inst.peserta),
        fmtRupiah(inst.tht),
        fmtRupiah(inst.pensiun),
        fmtRupiah(inst.jkk),
        fmtRupiah(inst.jkm),
        fmtRupiah(inst.total)
      ]);

      // Sub Rows
      inst.subRows.forEach(sr => {
        rows.push([
          `   ${sr.kategori}`,
          sr.badge ? sr.badge : "Reguler",
          fmtNum(sr.peserta),
          sr.tht ? fmtRupiah(sr.tht) : "—",
          sr.pensiun ? fmtRupiah(sr.pensiun) : "—",
          fmtRupiah(sr.jkk),
          fmtRupiah(sr.jkm),
          fmtRupiah(sr.total)
        ]);
      });
    });

    const totalRow = [
      { text: `Subtotal ${activeEntity.title}`, colSpan: 2, align: "left" },
      "",
      fmtNum(currentSubtotal.peserta),
      fmtRupiah(currentSubtotal.tht),
      fmtRupiah(currentSubtotal.pensiun),
      fmtRupiah(currentSubtotal.jkk),
      fmtRupiah(currentSubtotal.jkm),
      fmtRupiah(currentSubtotal.total)
    ];

    setPreview({
      title: `Rekapitulasi Perhitungan Iuran — ${activeEntity.title}`,
      subtitle: `Periode: ${periodeLabel} • Status: ${statusPeriode} • Filter: ${filterPill}`,
      type: "table",
      fileName: `Kalkulator_Iuran_${activeEntity.id}_${periodeLabel.replace(/\s+/g, "_")}.${isExcel ? "xlsx" : "pdf"}`,
      content: {
        columns,
        alignments,
        rows,
        totalRow,
        totalRows: rows.length
      }
    });
  };

  // Open detail breakdown modal for a subRow
  const handleOpenRowDetail = (instName, subRow) => {
    setModalGolonganData({
      instansiName: instName,
      kategori: subRow.kategori,
      badge: subRow.badge,
      peserta: subRow.peserta,
      tht: subRow.tht,
      pensiun: subRow.pensiun,
      jkk: subRow.jkk,
      jkm: subRow.jkm,
      total: subRow.total,
      breakdown: subRow.golonganBreakdown || []
    });
  };

  // Badge pill styling helper
  const renderSubRowBadge = (badge, kategori) => {
    if (!badge && !kategori) return null;
    let bg = "#F1F5F9";
    let color = COLORS.gray700;
    let border = "#E2E8F0";

    const bLower = (badge || "").toLowerCase();
    const kLower = (kategori || "").toLowerCase();

    if (bLower.includes("polri") || kLower.includes("polri")) {
      bg = "#EEF2FF";
      color = "#4338CA";
      border = "#C7D2FE";
    } else if (kLower.includes("prajurit") || bLower.includes("militer")) {
      bg = "#ECFDF5";
      color = "#047857";
      border = "#A7F3D0";
    } else if (kLower.includes("pns") || bLower.includes("asn")) {
      bg = "#EFF6FF";
      color = "#1D4ED8";
      border = "#BFDBFE";
    } else if (kLower.includes("ppk") || kLower.includes("pppk") || bLower.includes("non-pensiun")) {
      bg = "#FEF3C7";
      color = "#B45309";
      border = "#FDE68A";
    }

    return (
      <span
        style={{
          fontSize: 11,
          color,
          background: bg,
          border: `1px solid ${border}`,
          padding: "1px 8px",
          borderRadius: 9999,
          fontWeight: 600,
          letterSpacing: 0.2
        }}
      >
        {badge || kategori}
      </span>
    );
  };

  // Active cards list to display
  const currentCards = useMemo(() => {
    if (kelompokkanPer === "instansi") {
      return Object.values(MASTER_INSTANSI_DATA);
    }
    const all = Object.values(MASTER_ENTITIES_DATA);
    if (klusterFilter === "tni") return all.filter(c => c.kluster === "TNI_KEMHAN");
    if (klusterFilter === "polri") return all.filter(c => c.kluster === "POLRI");
    return all;
  }, [kelompokkanPer, klusterFilter]);

  const activeCardId = kelompokkanPer === "instansi" ? selectedInstansiId : selectedEntityId;

  // =========================================================================
  // SIMULATION CALCULATION LOGIC
  // =========================================================================
  const simCurrentPresets = useMemo(() => {
    if (simKategori === "Prajurit") return POLRI_PRESETS.PRAJURIT;
    if (simKategori === "PNS") return POLRI_PRESETS.PNS;
    return POLRI_PRESETS.PPPK;
  }, [simKategori]);

  const handlePresetChange = (idx) => {
    setSimPresetIdx(idx);
    const item = simCurrentPresets[idx];
    if (item) {
      setSimGajiPokok(item.gp);
    }
  };

  const simResult = useMemo(() => {
    const gp = Number(simGajiPokok) || 0;
    const tunjIstri = simStatusKawin ? gp * 0.10 : 0;
    const tunjAnak = gp * 0.02 * Math.min(2, Math.max(0, simJmlAnak));
    const penghasilanTetap = gp + tunjIstri + tunjAnak; // Dasar Pengenaan THT & Pensiun
    const dasarJKK_JKM = gp; // Dasar Pengenaan JKK & JKM adalah Gaji Pokok

    const isPPPK = simKategori === "PPPK";

    // Rate perhitungan sesuai PP 102/2015 jo PP 54/2020:
    // THT: 3,25% dari (GP + Tunj. Keluarga)
    // Pensiun: 4,75% dari (GP + Tunj. Keluarga)
    // JKK: 0,62% dari GP (APBN)
    // JKM: 0,81% dari GP (APBN)
    // PPPK: THT = 0, Pensiun = 0 (hanya JKK & JKM)
    const thtPerPerson = isPPPK ? 0 : Math.round(penghasilanTetap * 0.0325);
    const pensiunPerPerson = isPPPK ? 0 : Math.round(penghasilanTetap * 0.0475);
    const jkkPerPerson = Math.round(dasarJKK_JKM * 0.0062);
    const jkmPerPerson = Math.round(dasarJKK_JKM * 0.0081);

    const iuranPesertaPerPerson = thtPerPerson + pensiunPerPerson;
    const iuranNegaraPerPerson = jkkPerPerson + jkmPerPerson;
    const totalIuranPerPerson = iuranPesertaPerPerson + iuranNegaraPerPerson;

    const n = Math.max(1, Number(simJmlPersonil) || 1);

    return {
      gp,
      tunjIstri,
      tunjAnak,
      penghasilanTetap,
      dasarJKK_JKM,
      thtPerPerson,
      pensiunPerPerson,
      jkkPerPerson,
      jkmPerPerson,
      iuranPesertaPerPerson,
      iuranNegaraPerPerson,
      totalIuranPerPerson,
      n,
      thtTotal: thtPerPerson * n,
      pensiunTotal: pensiunPerPerson * n,
      jkkTotal: jkkPerPerson * n,
      jkmTotal: jkmPerPerson * n,
      iuranPesertaTotal: iuranPesertaPerPerson * n,
      iuranNegaraTotal: iuranNegaraPerPerson * n,
      totalKeseluruhan: totalIuranPerPerson * n,
      tahunan: totalIuranPerPerson * n * 12
    };
  }, [simGajiPokok, simStatusKawin, simJmlAnak, simKategori, simJmlPersonil]);

  const handleCopySimulasi = () => {
    const text = `=== SIMULASI IURAN ASABRI ===
Institusi: ${simInstitusi}
Kategori: ${simKategori} ${simInstitusi === "POLRI" ? "Polri" : ""}
Pangkat / Golongan: ${simCurrentPresets[simPresetIdx]?.label || "Kustom"}
Jumlah Personil: ${simResult.n} Orang
Gaji Pokok: ${fmtRupiah(simResult.gp)}
Tunjangan Keluarga: ${fmtRupiah(simResult.tunjIstri + simResult.tunjAnak)}

[POTONGAN PESERTA (8,00%)]
- THT (3,25%): ${fmtRupiah(simResult.thtTotal)}
- Pensiun (4,75%): ${fmtRupiah(simResult.pensiunTotal)}
Total Potongan Peserta: ${fmtRupiah(simResult.iuranPesertaTotal)}

[IURAN DITANGGUNG NEGARA/APBN (1,43%)]
- JKK (0,62%): ${fmtRupiah(simResult.jkkTotal)}
- JKM (0,81%): ${fmtRupiah(simResult.jkmTotal)}
Total Iuran Negara: ${fmtRupiah(simResult.iuranNegaraTotal)}

TOTAL IURAN BULANAN: ${fmtRupiah(simResult.totalKeseluruhan)}
PROYEKSI 1 TAHUN: ${fmtRupiah(simResult.tahunan)}`;

    navigator.clipboard.writeText(text);
    setSimCopied(true);
    setTimeout(() => setSimCopied(false), 2500);
  };

  const handleExportSimulasi = () => {
    const columns = ["Komponen Iuran", "Dasar Perhitungan", "Tarif Regulasi", "Nominal Per Personil", `Total (${simResult.n} Personil)`];
    const rows = [
      ["THT (Tabungan Hari Tua)", "Gaji Pokok + Tunj. Keluarga", simKategori === "PPPK" ? "0% (Non-pensiun)" : "3,25%", fmtRupiah(simResult.thtPerPerson), fmtRupiah(simResult.thtTotal)],
      ["Jaminan Pensiun", "Gaji Pokok + Tunj. Keluarga", simKategori === "PPPK" ? "0% (Non-pensiun)" : "4,75%", fmtRupiah(simResult.pensiunPerPerson), fmtRupiah(simResult.pensiunTotal)],
      ["JKK (Kecelakaan Kerja)", "Gaji Pokok", "0,62% (APBN)", fmtRupiah(simResult.jkkPerPerson), fmtRupiah(simResult.jkkTotal)],
      ["JKM (Kematian)", "Gaji Pokok", "0,81% (APBN)", fmtRupiah(simResult.jkmPerPerson), fmtRupiah(simResult.jkmTotal)]
    ];
    const totalRow = [
      { text: "TOTAL IURAN BULANAN", colSpan: 3, align: "left" },
      "",
      "",
      fmtRupiah(simResult.totalIuranPerPerson),
      fmtRupiah(simResult.totalKeseluruhan)
    ];

    setPreview({
      title: `Hasil Simulasi Kalkulator Iuran — ${simInstitusi} (${simKategori})`,
      subtitle: `Pangkat/Golongan: ${simCurrentPresets[simPresetIdx]?.label || "Kustom"} • Satker: ${simNamaSatker}`,
      type: "table",
      fileName: `Simulasi_Iuran_${simInstitusi}_${simKategori}.xlsx`,
      content: {
        columns,
        alignments: ["left", "left", "center", "right", "right"],
        rows,
        totalRow,
        totalRows: rows.length
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "inherit" }}>
      {/* Preview Modal for Excel/PDF */}
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* =========================================================================
          TOP BREADCRUMB & HEADER AREA
         ========================================================================= */}
      <div>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.gray500, marginBottom: 8 }}>
          <span style={{ cursor: "pointer", color: COLORS.gray600, fontWeight: 500 }}>Perhitungan Iuran</span>
          <span style={{ color: COLORS.gray400 }}>/</span>
          <span style={{ color: COLORS.gray800, fontWeight: 600 }}>
            {activeTab === "rekap" ? `Rekapitulasi ${periodeLabel}` : "Kalkulator & Simulasi Iuran"}
          </span>
        </div>

        {/* Title, Month Selector & Action Buttons Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16
          }}
        >
          {/* Left: Nav Chevrons, Month Heading, Status Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Prev Month */}
            <button
              onClick={handlePrevMonth}
              title="Bulan sebelumnya"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${COLORS.gray200}`,
                background: COLORS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: COLORS.gray700,
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "all 0.15s ease"
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Month Title */}
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: COLORS.gray900,
                letterSpacing: -0.5
              }}
            >
              {periodeLabel}
            </h1>

            {/* Next Month */}
            <button
              onClick={handleNextMonth}
              title="Bulan berikutnya"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${COLORS.gray200}`,
                background: COLORS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: COLORS.gray700,
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "all 0.15s ease"
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Rekonsiliasi / Final Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                background: statusPeriode === "Telah Difinalisasi" ? "#ECFDF5" : "#FEF3C7",
                color: statusPeriode === "Telah Difinalisasi" ? "#047857" : "#B45309",
                border: `1px solid ${statusPeriode === "Telah Difinalisasi" ? "#A7F3D0" : "#FDE68A"}`
              }}
            >
              {statusPeriode === "Telah Difinalisasi" ? <CheckCircle2 size={13} /> : null}
              {statusPeriode}
            </div>
          </div>

          {/* Right: Tab Mode Switcher & Export Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* View Mode Toggle: Rekapitulasi vs Simulasi */}
            <div
              style={{
                background: "#E2E8F0",
                padding: 3,
                borderRadius: 8,
                display: "inline-flex",
                gap: 2
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("rekap")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: activeTab === "rekap" ? 700 : 500,
                  background: activeTab === "rekap" ? COLORS.white : "transparent",
                  color: activeTab === "rekap" ? COLORS.gray900 : COLORS.gray600,
                  boxShadow: activeTab === "rekap" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <Layers size={14} color={activeTab === "rekap" ? "#2563EB" : COLORS.gray500} />
                Rekapitulasi Iuran
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("simulasi")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: activeTab === "simulasi" ? 700 : 500,
                  background: activeTab === "simulasi" ? COLORS.white : "transparent",
                  color: activeTab === "simulasi" ? COLORS.gray900 : COLORS.gray600,
                  boxShadow: activeTab === "simulasi" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <Calculator size={14} color={activeTab === "simulasi" ? "#059669" : COLORS.gray500} />
                Simulasi Hitung (Polri &amp; TNI)
              </button>
            </div>

            {/* Ekspor Excel */}
            <button
              onClick={() => (activeTab === "rekap" ? handleExport("excel") : handleExportSimulasi())}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: COLORS.white,
                border: `1px solid ${COLORS.gray300}`,
                borderRadius: 8,
                color: COLORS.gray700,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "all 0.15s ease"
              }}
            >
              <FileSpreadsheet size={15} color="#059669" />
              Ekspor Excel
            </button>

            {/* Finalisasi periode (hanya di rekap) */}
            {activeTab === "rekap" && (
              <button
                onClick={() => setShowFinalizeModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  background: statusPeriode === "Telah Difinalisasi" ? "#047857" : "#1E293B",
                  border: "none",
                  borderRadius: 8,
                  color: COLORS.white,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(15, 23, 42, 0.15)",
                  transition: "all 0.15s ease"
                }}
              >
                <Lock size={14} />
                {statusPeriode === "Telah Difinalisasi" ? "Periode Terkunci" : "Finalisasi"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW TAB 1: REKAPITULASI IURAN (TABEL LENGKAP DENGAN RINCIAN POLRI)
         ========================================================================= */}
      {activeTab === "rekap" && (
        <>
          {/* GROUPING TOGGLE ROW ("Kelompokkan per") */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              padding: "12px 16px",
              background: COLORS.white,
              borderRadius: 10,
              border: `1px solid ${COLORS.gray200}`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>
                Kelompokkan per:
              </span>

              <div
                style={{
                  background: "#F1F5F9",
                  padding: 3,
                  borderRadius: 8,
                  display: "inline-flex",
                  gap: 2,
                  border: "1px solid #E2E8F0"
                }}
              >
                <button
                  type="button"
                  onClick={() => setKelompokkanPer("entitas")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 13,
                    fontWeight: kelompokkanPer === "entitas" ? 700 : 500,
                    background: kelompokkanPer === "entitas" ? COLORS.white : "transparent",
                    color: kelompokkanPer === "entitas" ? COLORS.gray900 : COLORS.gray500,
                    boxShadow: kelompokkanPer === "entitas" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  Entitas pembina
                </button>

                <button
                  type="button"
                  onClick={() => setKelompokkanPer("instansi")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 13,
                    fontWeight: kelompokkanPer === "instansi" ? 700 : 500,
                    background: kelompokkanPer === "instansi" ? COLORS.white : "transparent",
                    color: kelompokkanPer === "instansi" ? COLORS.gray900 : COLORS.gray500,
                    boxShadow: kelompokkanPer === "instansi" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  Instansi Matra / Satker
                </button>
              </div>

              {/* Sub-filter Kluster jika Entitas dipilih */}
              {kelompokkanPer === "entitas" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                  <span style={{ fontSize: 12, color: COLORS.gray500 }}>Filter Kluster:</span>
                  {[
                    { id: "all", label: "Semua (8)" },
                    { id: "polri", label: "Kepolisian RI / POLRI (5)" },
                    { id: "tni", label: "TNI & Kemhan (3)" },
                  ].map(btn => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setKlusterFilter(btn.id)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        border: klusterFilter === btn.id ? "1px solid #3B82F6" : `1px solid ${COLORS.gray200}`,
                        background: klusterFilter === btn.id ? "#EFF6FF" : COLORS.white,
                        color: klusterFilter === btn.id ? "#1D4ED8" : COLORS.gray600,
                        fontSize: 12,
                        fontWeight: klusterFilter === btn.id ? 700 : 500,
                        cursor: "pointer"
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span style={{ fontSize: 12, color: COLORS.gray500 }}>
              {kelompokkanPer === "entitas"
                ? "Menampilkan entitas pembina Prajurit TNI, ASN Kemhan, serta Kluster POLRI (Prajurit, ASN, dan PPK)"
                : "Rincian langsung per induk instansi (TNI AD, AL, AU, Mabes TNI, Kemhan, dan POLRI)"}
            </span>
          </div>

          {/* HORIZONTAL ROW OF ENTITY / INSTANSI CARDS */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  kelompokkanPer === "instansi"
                    ? "repeat(auto-fit, minmax(170px, 1fr))"
                    : "repeat(auto-fit, minmax(225px, 1fr))",
                gap: 12
              }}
            >
              {currentCards.map((ent) => {
                const isSelected = activeCardId === ent.id;
                const isPolri = ent.id.includes("POLRI");

                return (
                  <div
                    key={ent.id}
                    onClick={() => {
                      if (kelompokkanPer === "instansi") {
                        setSelectedInstansiId(ent.id);
                      } else {
                        setSelectedEntityId(ent.id);
                      }
                    }}
                    style={{
                      borderRadius: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: isSelected ? (isPolri ? "#1E1B4B" : "#1E293B") : COLORS.white,
                      color: isSelected ? COLORS.white : COLORS.gray900,
                      border: isSelected
                        ? isPolri
                          ? "1px solid #4338CA"
                          : "1px solid #1E293B"
                        : `1px solid ${isPolri ? "#E0E7FF" : COLORS.gray200}`,
                      boxShadow: isSelected
                        ? "0 4px 14px rgba(15, 23, 42, 0.15)"
                        : "0 1px 3px rgba(0,0,0,0.02)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Top Row: Entity Name & Instansi Count Badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                        gap: 6
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 800,
                          color: isSelected ? COLORS.white : isPolri ? "#3730A3" : COLORS.gray900,
                          lineHeight: 1.3
                        }}
                      >
                        {ent.title}
                      </span>

                      <span
                        style={{
                          fontSize: 10.5,
                          color: isSelected ? "#C7D2FE" : isPolri ? "#4338CA" : COLORS.gray500,
                          fontWeight: 600,
                          background: isSelected ? "rgba(255,255,255,0.12)" : isPolri ? "#EEF2FF" : "#F1F5F9",
                          padding: "2px 6px",
                          borderRadius: 4,
                          whiteSpace: "nowrap"
                        }}
                      >
                        {ent.badgeInstansi}
                      </span>
                    </div>

                    {/* Main Total Amount */}
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        letterSpacing: -0.3,
                        marginBottom: 4,
                        color: isSelected ? (isPolri ? "#A5B4FC" : COLORS.white) : "#0F172A"
                      }}
                    >
                      {fmtRupiah(ent.totalIuran)}
                    </div>

                    {/* Peserta Count Subtext */}
                    <div
                      style={{
                        fontSize: 11.5,
                        color: isSelected ? "#94A3B8" : COLORS.gray500,
                        fontWeight: 500,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>{fmtNum(ent.peserta)} peserta</span>
                      {isPolri && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: isSelected ? "#FCD34D" : "#4338CA"
                          }}
                        >
                          POLRI
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUMMARY BREAKDOWN CARD (3 SECTIONS WITH PROGRESS BAR) */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: "20px 24px",
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr",
              gap: 28,
              alignItems: "center"
            }}
          >
            {/* Left Column: Total Iuran with Split Bar */}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: COLORS.gray500, marginBottom: 4 }}>
                Total iuran {activeEntity.title}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#2563EB", letterSpacing: -0.5 }}>
                {fmtRupiah(activeEntity.totalIuran)}
              </div>
              {/* Split 2-color Progress Bar */}
              <div
                style={{
                  height: 6,
                  background: "#E2E8F0",
                  borderRadius: 9999,
                  overflow: "hidden",
                  display: "flex",
                  marginTop: 10,
                  width: "90%"
                }}
              >
                <div
                  style={{
                    width: `${activeEntity.pesertaRatio}%`,
                    background: "#2563EB",
                    height: "100%",
                    borderRadius: "9999px 0 0 9999px"
                  }}
                  title={`Iuran peserta (THT + Pensiun): ${activeEntity.pesertaRatio.toFixed(1)}%`}
                />
                <div
                  style={{
                    width: `${activeEntity.negaraRatio}%`,
                    background: "#F97316",
                    height: "100%",
                    borderRadius: "0 9999px 9999px 0"
                  }}
                  title={`Iuran negara (JKK + JKM): ${activeEntity.negaraRatio.toFixed(1)}%`}
                />
              </div>
            </div>

            {/* Middle Column: Iuran Peserta (THT + Pensiun) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#2563EB",
                    display: "inline-block"
                  }}
                />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.gray700 }}>
                  Iuran peserta · THT + Pensiun
                </span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gray900, letterSpacing: -0.4 }}>
                {fmtRupiah(activeEntity.iuranPeserta)}
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                {activeEntity.pesertaRatio.toFixed(1)}% dari total iuran
              </div>
            </div>

            {/* Right Column: Iuran Negara (JKK + JKM) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#F97316",
                    display: "inline-block"
                  }}
                />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.gray700 }}>
                  Iuran negara · JKK + JKM
                </span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.gray900, letterSpacing: -0.4 }}>
                {fmtRupiah(activeEntity.iuranNegara)}
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
                {activeEntity.negaraRatio.toFixed(1)}% dari total iuran
              </div>
            </div>
          </div>

          {/* FILTER PILLS & SEARCH / TOGGLE TOOLBAR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            {/* Left Filter Pills: Semua / Prajurit / PNS / PPPK */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "Semua", label: "Semua Kategori" },
                { id: "Prajurit / Anggota", label: "Prajurit / Anggota Polri & TNI" },
                { id: "PNS (ASN)", label: "PNS (ASN Polri & Kemhan)" },
                { id: "PPK (PPPK)", label: "PPK / PPPK (Non-pensiun)" }
              ].map((pill) => {
                const isActive = filterPill === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setFilterPill(pill.id)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 9999,
                      fontSize: 12.5,
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      background: isActive ? "#0F172A" : COLORS.white,
                      color: isActive ? COLORS.white : COLORS.gray700,
                      border: isActive ? "1px solid #0F172A" : `1px solid ${COLORS.gray300}`,
                      boxShadow: isActive ? "0 2px 4px rgba(15, 23, 42, 0.12)" : "none"
                    }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Search Box & Tutup/Buka Semua Button */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Search Input */}
              <div style={{ position: "relative", width: 270 }}>
                <Search
                  size={15}
                  color={COLORS.gray400}
                  style={{ position: "absolute", left: 10, top: 10 }}
                />
                <input
                  type="text"
                  placeholder="Cari instansi, prajurit, polri, ASN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 12px 7px 32px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray200}`,
                    fontSize: 12.5,
                    background: COLORS.white,
                    outline: "none",
                    color: COLORS.gray800,
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Tutup / Buka Semua Button */}
              <button
                type="button"
                onClick={handleToggleAll}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.gray300}`,
                  background: COLORS.white,
                  color: COLORS.gray700,
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                {areAllExpanded ? "Tutup semua" : "Buka semua"}
              </button>
            </div>
          </div>

          {/* GROUPED MULTI-HEADER TABLE */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              border: `1px solid ${COLORS.gray200}`,
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                {/* Table Head with Multi-level Headers */}
                <thead>
                  <tr style={{ background: COLORS.white }}>
                    <th
                      rowSpan={2}
                      style={{
                        padding: "16px 18px",
                        textAlign: "left",
                        color: COLORS.gray600,
                        fontWeight: 600,
                        fontSize: 12.5,
                        borderBottom: `1px solid ${COLORS.gray200}`,
                        width: "25%"
                      }}
                    >
                      Instansi / Kategori Personil
                    </th>
                    <th
                      rowSpan={2}
                      style={{
                        padding: "16px 14px",
                        textAlign: "right",
                        color: COLORS.gray600,
                        fontWeight: 600,
                        fontSize: 12.5,
                        borderBottom: `1px solid ${COLORS.gray200}`,
                        width: "9%"
                      }}
                    >
                      Peserta
                    </th>

                    {/* Header Group: Iuran Peserta */}
                    <th
                      colSpan={2}
                      style={{
                        padding: "12px 14px 6px",
                        textAlign: "center",
                        borderBottom: `2px solid #2563EB`,
                        color: "#2563EB",
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: 0.5
                      }}
                    >
                      IURAN PESERTA (POTONGAN GAJI)
                    </th>

                    {/* Header Group: Iuran Negara */}
                    <th
                      colSpan={2}
                      style={{
                        padding: "12px 14px 6px",
                        textAlign: "center",
                        borderBottom: `2px solid #EA580C`,
                        color: "#EA580C",
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: 0.5
                      }}
                    >
                      IURAN NEGARA (BEBAN APBN)
                    </th>

                    <th
                      rowSpan={2}
                      style={{
                        padding: "16px 18px",
                        textAlign: "right",
                        color: COLORS.gray600,
                        fontWeight: 600,
                        fontSize: 12.5,
                        borderBottom: `1px solid ${COLORS.gray200}`,
                        width: "15%"
                      }}
                    >
                      Total Iuran
                    </th>
                  </tr>

                  {/* Row 2: Sub-columns */}
                  <tr style={{ background: COLORS.white, color: COLORS.gray600, fontSize: 12, fontWeight: 600 }}>
                    <th style={{ padding: "8px 14px 14px", textAlign: "right", borderBottom: `1px solid ${COLORS.gray200}`, width: "13%" }}>
                      THT 3,25%
                    </th>
                    <th style={{ padding: "8px 14px 14px", textAlign: "right", borderBottom: `1px solid ${COLORS.gray200}`, width: "13%" }}>
                      Pensiun 4,75%
                    </th>
                    <th style={{ padding: "8px 14px 14px", textAlign: "right", borderBottom: `1px solid ${COLORS.gray200}`, width: "12%" }}>
                      JKK 0,62%
                    </th>
                    <th style={{ padding: "8px 14px 14px", textAlign: "right", borderBottom: `1px solid ${COLORS.gray200}`, width: "12%" }}>
                      JKM 0,81%
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredInstansiList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: COLORS.gray500 }}>
                        Tidak ada instansi atau kategori yang cocok dengan filter saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredInstansiList.map((inst) => {
                      const isExpanded = !!expandedRows[inst.id];
                      const isPolri = inst.id.includes("POLRI");

                      return (
                        <Fragment key={inst.id}>
                          {/* PARENT ROW: Instansi Accordion */}
                          <tr
                            style={{
                              borderBottom: `1px solid ${COLORS.gray100}`,
                              background: isPolri ? "#F8FAFF" : "#FFFFFF",
                              transition: "background 0.15s ease",
                              cursor: "pointer"
                            }}
                            onClick={() => toggleRow(inst.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = isPolri ? "#EEF2FF" : "#F8FAFC";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isPolri ? "#F8FAFF" : "#FFFFFF";
                            }}
                          >
                            {/* Instansi Name + Chevron + Badge */}
                            <td style={{ padding: "14px 18px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRow(inst.id);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    color: COLORS.gray700
                                  }}
                                >
                                  {isExpanded ? (
                                    <ChevronDown size={17} color={isPolri ? "#4338CA" : COLORS.gray700} />
                                  ) : (
                                    <ChevronRight size={17} color={isPolri ? "#4338CA" : COLORS.gray700} />
                                  )}
                                </button>
                                <span
                                  style={{
                                    fontWeight: 800,
                                    color: isPolri ? "#1E1B4B" : COLORS.gray900,
                                    fontSize: 13.5
                                  }}
                                >
                                  {inst.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: isPolri ? "#4338CA" : COLORS.gray500,
                                    background: isPolri ? "#EEF2FF" : "#F1F5F9",
                                    padding: "2px 7px",
                                    borderRadius: 4,
                                    fontWeight: 600
                                  }}
                                >
                                  {inst.unorCount}
                                </span>
                              </div>
                            </td>

                            {/* Peserta */}
                            <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 800, color: COLORS.gray900 }}>
                              {fmtNum(inst.peserta)}
                            </td>

                            {/* THT 3,25% */}
                            <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900 }}>
                              {fmtRupiah(inst.tht)}
                            </td>

                            {/* Pensiun 4,75% */}
                            <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900 }}>
                              {fmtRupiah(inst.pensiun)}
                            </td>

                            {/* JKK 0,62% */}
                            <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900 }}>
                              {fmtRupiah(inst.jkk)}
                            </td>

                            {/* JKM 0,81% */}
                            <td style={{ padding: "14px 14px", textAlign: "right", fontWeight: 700, color: COLORS.gray900 }}>
                              {fmtRupiah(inst.jkm)}
                            </td>

                            {/* Total */}
                            <td
                              style={{
                                padding: "14px 18px",
                                textAlign: "right",
                                fontWeight: 800,
                                color: isPolri ? "#3730A3" : "#2563EB",
                                fontSize: 13.5
                              }}
                            >
                              {fmtRupiah(inst.total)}
                            </td>
                          </tr>

                          {/* SUB-ROWS: Prajurit, PNS, & PPPK / PPK */}
                          {isExpanded &&
                            inst.subRows.map((sr) => (
                              <tr
                                key={sr.id}
                                style={{
                                  borderBottom: `1px solid ${COLORS.gray100}`,
                                  background: COLORS.white,
                                  transition: "background 0.15s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#F8FAFC";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = COLORS.white;
                                }}
                              >
                                {/* Kategori Name (Prajurit / PNS / PPK) */}
                                <td style={{ padding: "12px 18px 12px 42px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span
                                      onClick={() => handleOpenRowDetail(inst.name, sr)}
                                      title="Klik untuk rincian per golongan / pangkat"
                                      style={{
                                        color: isPolri ? "#3730A3" : "#2563EB",
                                        fontWeight: 600,
                                        fontSize: 13,
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        textUnderlineOffset: 3
                                      }}
                                    >
                                      {sr.kategori}
                                    </span>
                                    {renderSubRowBadge(sr.badge, sr.kategori)}
                                  </div>
                                </td>

                                {/* Peserta */}
                                <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray700, fontWeight: 500 }}>
                                  {fmtNum(sr.peserta)}
                                </td>

                                {/* THT 3,25% */}
                                <td style={{ padding: "12px 14px", textAlign: "right", color: sr.tht ? COLORS.gray800 : COLORS.gray400 }}>
                                  {sr.tht ? fmtRupiah(sr.tht) : "—"}
                                </td>

                                {/* Pensiun 4,75% */}
                                <td style={{ padding: "12px 14px", textAlign: "right", color: sr.pensiun ? COLORS.gray800 : COLORS.gray400 }}>
                                  {sr.pensiun ? fmtRupiah(sr.pensiun) : "—"}
                                </td>

                                {/* JKK 0,62% */}
                                <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray800 }}>
                                  {fmtRupiah(sr.jkk)}
                                </td>

                                {/* JKM 0,81% */}
                                <td style={{ padding: "12px 14px", textAlign: "right", color: COLORS.gray800 }}>
                                  {fmtRupiah(sr.jkm)}
                                </td>

                                {/* Total Sub-row */}
                                <td style={{ padding: "12px 18px", textAlign: "right", fontWeight: 700, color: COLORS.gray900 }}>
                                  {fmtRupiah(sr.total)}
                                </td>
                              </tr>
                            ))}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>

                {/* Subtotal Row */}
                <tfoot>
                  <tr
                    style={{
                      background: "#F0F7FF",
                      borderTop: "2px solid #BFDBFE",
                      borderBottom: "2px solid #BFDBFE",
                      fontWeight: 800
                    }}
                  >
                    <td style={{ padding: "14px 18px", color: COLORS.gray900, fontSize: 13.5 }}>
                      Subtotal {activeEntity.title}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: COLORS.gray900, fontSize: 13.5 }}>
                      {fmtNum(currentSubtotal.peserta)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: COLORS.gray900, fontSize: 13.5 }}>
                      {fmtRupiah(currentSubtotal.tht)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: COLORS.gray900, fontSize: 13.5 }}>
                      {fmtRupiah(currentSubtotal.pensiun)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: COLORS.gray900, fontSize: 13.5 }}>
                      {fmtRupiah(currentSubtotal.jkk)}
                    </td>
                    <td style={{ padding: "14px 14px", textAlign: "right", color: COLORS.gray900, fontSize: 13.5 }}>
                      {fmtRupiah(currentSubtotal.jkm)}
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right", color: "#2563EB", fontSize: 14.5 }}>
                      {fmtRupiah(currentSubtotal.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bottom Status Bar */}
            <div
              style={{
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12.5,
                color: COLORS.gray500,
                background: COLORS.white,
                borderTop: `1px solid ${COLORS.gray100}`
              }}
            >
              <span>Menampilkan {totalUnorCount} kategori personil aktif</span>
              <span style={{ fontStyle: "normal", color: COLORS.gray500 }}>
                💡 Klik nama kategori personil (Prajurit / ASN / PPK) untuk melihat rincian breakdown per pangkat/golongan
              </span>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW TAB 2: KALKULATOR & SIMULASI IURAN INTERAKTIF (POLRI & TNI)
         ========================================================================= */}
      {activeTab === "simulasi" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
          {/* LEFT: FORM INPUT PARAMETERS */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: "24px",
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >
            <div style={{ borderBottom: `1px solid ${COLORS.gray200}`, paddingBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4338CA"
                  }}
                >
                  <Calculator size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                    Parameter Simulasi Iuran
                  </h3>
                  <span style={{ fontSize: 12, color: COLORS.gray500 }}>
                    Perhitungan otomatis berdasarkan PP No. 102 Tahun 2015 jo PP No. 54 Tahun 2020
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Pilih Institusi */}
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 8 }}>
                1. Institusi Pembina
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setSimInstitusi("POLRI")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: simInstitusi === "POLRI" ? "2px solid #4338CA" : `1px solid ${COLORS.gray300}`,
                    background: simInstitusi === "POLRI" ? "#EEF2FF" : COLORS.white,
                    color: simInstitusi === "POLRI" ? "#312E81" : COLORS.gray700,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span>Kepolisian RI (POLRI)</span>
                  {simInstitusi === "POLRI" && <CheckCircle2 size={16} color="#4338CA" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSimInstitusi("TNI")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: simInstitusi === "TNI" ? "2px solid #059669" : `1px solid ${COLORS.gray300}`,
                    background: simInstitusi === "TNI" ? "#ECFDF5" : COLORS.white,
                    color: simInstitusi === "TNI" ? "#065F46" : COLORS.gray700,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span>TNI &amp; Kemhan</span>
                  {simInstitusi === "TNI" && <CheckCircle2 size={16} color="#059669" />}
                </button>
              </div>
            </div>

            {/* 2. Pilih Status / Kategori Personil */}
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: COLORS.gray700, marginBottom: 8 }}>
                2. Kategori Personil
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { id: "Prajurit", label: simInstitusi === "POLRI" ? "Prajurit / Anggota" : "Prajurit TNI", sub: "THT + Pensiun + JKK/JKM" },
                  { id: "PNS", label: "ASN (PNS)", sub: "THT + Pensiun + JKK/JKM" },
                  { id: "PPPK", label: "PPK (PPPK)", sub: "Khusus JKK/JKM (Non-pensiun)" }
                ].map(kat => (
                  <button
                    key={kat.id}
                    type="button"
                    onClick={() => {
                      setSimKategori(kat.id);
                      setSimPresetIdx(0);
                      const presets = kat.id === "Prajurit" ? POLRI_PRESETS.PRAJURIT : (kat.id === "PNS" ? POLRI_PRESETS.PNS : POLRI_PRESETS.PPPK);
                      if (presets[0]) setSimGajiPokok(presets[0].gp);
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      border: simKategori === kat.id ? "2px solid #2563EB" : `1px solid ${COLORS.gray200}`,
                      background: simKategori === kat.id ? "#EFF6FF" : COLORS.white,
                      color: simKategori === kat.id ? "#1D4ED8" : COLORS.gray700,
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>{kat.label}</div>
                    <div style={{ fontSize: 10, color: COLORS.gray500, marginTop: 2 }}>{kat.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Preset Pangkat / Golongan */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray700 }}>
                  3. Pangkat / Golongan Standar
                </label>
                <span style={{ fontSize: 11, color: COLORS.gray500 }}>Otomatis mengisi gaji pokok acuan</span>
              </div>
              <select
                value={simPresetIdx}
                onChange={(e) => handlePresetChange(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.gray300}`,
                  fontSize: 13,
                  color: COLORS.gray800,
                  outline: "none",
                  background: COLORS.white
                }}
              >
                {simCurrentPresets.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.label} — Gaji Pokok Acuan: {fmtRupiah(p.gp)}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Gaji Pokok & Tunjangan Keluarga */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray700, marginBottom: 4 }}>
                  Gaji Pokok (Rp)
                </label>
                <input
                  type="number"
                  value={simGajiPokok}
                  onChange={(e) => setSimGajiPokok(Math.max(0, Number(e.target.value)))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray700, marginBottom: 4 }}>
                  Status Pernikahan
                </label>
                <select
                  value={simStatusKawin ? "kawin" : "lajang"}
                  onChange={(e) => setSimStatusKawin(e.target.value === "kawin")}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="kawin">Kawin (+10% Istri/Suami)</option>
                  <option value="lajang">Tidak Kawin (0%)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray700, marginBottom: 4 }}>
                  Tanggungan Anak (Maks 2)
                </label>
                <select
                  value={simJmlAnak}
                  onChange={(e) => setSimJmlAnak(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value={0}>0 Anak (0%)</option>
                  <option value={1}>1 Anak (+2% GP)</option>
                  <option value={2}>2 Anak (+4% GP)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray700, marginBottom: 4 }}>
                  Skala Simulasi (Personil)
                </label>
                <input
                  type="number"
                  min="1"
                  value={simJmlPersonil}
                  onChange={(e) => setSimJmlPersonil(Math.max(1, Number(e.target.value)))}
                  placeholder="1 untuk individu"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 13,
                    fontWeight: 700,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Nama Satker / Keterangan */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray700, marginBottom: 4 }}>
                Satker / Satuan Kerja Acuan
              </label>
              <input
                type="text"
                value={simNamaSatker}
                onChange={(e) => setSimNamaSatker(e.target.value)}
                placeholder="Contoh: Polres Metro Jakarta Selatan, Ditlantas, dll."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.gray200}`,
                  fontSize: 12.5,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* RIGHT: HASIL KALKULASI & BREAKDOWN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* CARD 1: POTONGAN PESERTA (8,00%) */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: 12,
                padding: "20px 22px",
                border: `1px solid #BFDBFE`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB" }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                    IURAN PESERTA (POTONGAN GAJI)
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#EFF6FF",
                    color: "#1D4ED8",
                    padding: "2px 8px",
                    borderRadius: 9999
                  }}
                >
                  {simKategori === "PPPK" ? "0% (Non-Pensiun)" : "8,00% Penghasilan Tetap"}
                </span>
              </div>

              {simKategori === "PPPK" ? (
                <div
                  style={{
                    background: "#FEF3C7",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "#92400E",
                    lineHeight: 1.5
                  }}
                >
                  ℹ️ Berdasarkan regulasi ASABRI (PP No. 102/2015 jo PP No. 54/2020), personil <strong>PPK / PPPK</strong> tidak dipotong iuran THT (3,25%) dan Pensiun (4,75%). Jaminan kecelakaan kerja dan kematian ditanggung oleh Negara.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: COLORS.gray600 }}>THT (Tabungan Hari Tua · 3,25%):</span>
                    <strong style={{ color: COLORS.gray900 }}>{fmtRupiah(simResult.thtTotal)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: COLORS.gray600 }}>Jaminan Pensiun (4,75%):</span>
                    <strong style={{ color: COLORS.gray900 }}>{fmtRupiah(simResult.pensiunTotal)}</strong>
                  </div>
                  <div
                    style={{
                      borderTop: `1px dashed ${COLORS.gray200}`,
                      paddingTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      fontWeight: 800
                    }}
                  >
                    <span style={{ color: "#1D4ED8" }}>Subtotal Potongan Peserta:</span>
                    <span style={{ color: "#1D4ED8" }}>{fmtRupiah(simResult.iuranPesertaTotal)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 2: IURAN DITANGGUNG NEGARA (0,44%) */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: 12,
                padding: "20px 22px",
                border: `1px solid #FED7AA`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EA580C" }} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.gray900 }}>
                    IURAN DITANGGUNG NEGARA (APBN)
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#FFF7ED",
                    color: "#C2410C",
                    padding: "2px 8px",
                    borderRadius: 9999
                  }}
                >
                  1,43% Gaji Pokok
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: COLORS.gray600 }}>JKK (Jaminan Kecelakaan Kerja · 0,62%):</span>
                  <strong style={{ color: COLORS.gray900 }}>{fmtRupiah(simResult.jkkTotal)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: COLORS.gray600 }}>JKM (Jaminan Kematian · 0,81%):</span>
                  <strong style={{ color: COLORS.gray900 }}>{fmtRupiah(simResult.jkmTotal)}</strong>
                </div>
                <div
                  style={{
                    borderTop: `1px dashed ${COLORS.gray200}`,
                    paddingTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    fontWeight: 800
                  }}
                >
                  <span style={{ color: "#EA580C" }}>Subtotal Iuran Negara:</span>
                  <span style={{ color: "#EA580C" }}>{fmtRupiah(simResult.iuranNegaraTotal)}</span>
                </div>
              </div>
            </div>

            {/* CARD 3: GRAND TOTAL SUMMARY */}
            <div
              style={{
                background: "#0F172A",
                color: COLORS.white,
                borderRadius: 12,
                padding: "20px 24px",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>
                    TOTAL IURAN BULANAN ({simResult.n} PERSONIL)
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#38BDF8", letterSpacing: -0.5 }}>
                    {fmtRupiah(simResult.totalKeseluruhan)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>PROYEKSI 1 TAHUN</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FDE047" }}>
                    {fmtRupiah(simResult.tahunan)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 11.5,
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16
                }}
              >
                <span>Satker: <strong>{simNamaSatker}</strong></span>
                <span>Pangkat: <strong>{simCurrentPresets[simPresetIdx]?.label || "Kustom"}</strong></span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleCopySimulasi}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 8,
                    background: simCopied ? "#059669" : "rgba(255,255,255,0.15)",
                    border: "none",
                    color: COLORS.white,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s ease"
                  }}
                >
                  {simCopied ? <Check size={14} /> : <Copy size={14} />}
                  {simCopied ? "Tersalin!" : "Salin Rincian"}
                </button>

                <button
                  type="button"
                  onClick={handleExportSimulasi}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 8,
                    background: "#2563EB",
                    border: "none",
                    color: COLORS.white,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  <FileText size={14} />
                  Pratinjau &amp; Cetak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL RINCIAN PER GOLONGAN / PANGKAT
         ========================================================================= */}
      {modalGolonganData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
            padding: 20
          }}
          onClick={() => setModalGolonganData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 900,
              maxWidth: "96vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
              overflow: "hidden"
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.gray900 }}>
                    Rincian Per Golongan / Pangkat — {modalGolonganData.instansiName}
                  </h3>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: modalGolonganData.kategori.includes("Polri") ? "#EEF2FF" : "#EFF6FF",
                      color: modalGolonganData.kategori.includes("Polri") ? "#3730A3" : "#1D4ED8",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    {modalGolonganData.kategori}
                  </span>
                  {modalGolonganData.badge && renderSubRowBadge(modalGolonganData.badge, modalGolonganData.kategori)}
                </div>
                <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 4 }}>
                  Masa Rekonsiliasi: <strong>{periodeLabel}</strong> • Total {fmtNum(modalGolonganData.peserta)} Peserta Aktif
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalGolonganData(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: COLORS.gray400,
                  padding: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Table of Golongan / Pangkat Breakdown */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", color: COLORS.gray700 }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderRadius: "6px 0 0 6px" }}>Pangkat / Golongan</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>Peserta</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>Gaji Pokok &amp; Tunj.</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>THT (3,25%)</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>Pensiun (4,75%)</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>JKK (0,62%)</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>JKM (0,81%)</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", borderRadius: "0 6px 6px 0" }}>Total Iuran</th>
                  </tr>
                </thead>
                <tbody>
                  {modalGolonganData.breakdown.map((g, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: `1px solid ${COLORS.gray200}`,
                        background: idx % 2 === 0 ? COLORS.white : "#FAFAFA"
                      }}
                    >
                      <td style={{ padding: "12px 12px", fontWeight: 700, color: COLORS.gray900 }}>{g.gol}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 600 }}>{fmtNum(g.peserta)}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right", color: COLORS.gray600 }}>{fmtRupiah(g.gp)}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>{g.tht ? fmtRupiah(g.tht) : "—"}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>{g.pensiun ? fmtRupiah(g.pensiun) : "—"}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>{fmtRupiah(g.jkk)}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right" }}>{fmtRupiah(g.jkm)}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 800, color: COLORS.blueDark }}>
                        {fmtRupiah(g.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#EFF6FF", borderTop: "2px solid #BFDBFE", fontWeight: 800 }}>
                    <td style={{ padding: "12px 12px" }}>TOTAL</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>{fmtNum(modalGolonganData.peserta)}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>—</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>{modalGolonganData.tht ? fmtRupiah(modalGolonganData.tht) : "—"}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>{modalGolonganData.pensiun ? fmtRupiah(modalGolonganData.pensiun) : "—"}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>{fmtRupiah(modalGolonganData.jkk)}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>{fmtRupiah(modalGolonganData.jkm)}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", color: "#2563EB", fontSize: 13.5 }}>
                      {fmtRupiah(modalGolonganData.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: `1px solid ${COLORS.gray200}`,
                background: "#F8FAFC",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10
              }}
            >
              <button
                type="button"
                onClick={() => setModalGolonganData(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  background: COLORS.white,
                  color: COLORS.gray700,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL FINALISASI PERIODE
         ========================================================================= */}
      {showFinalizeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
            padding: 20
          }}
          onClick={() => setShowFinalizeModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              width: 520,
              maxWidth: "96vw",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              boxShadow: "0 20px 45px rgba(0,0,0,0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D97706",
                  flexShrink: 0
                }}
              >
                <Lock size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: COLORS.gray900 }}>
                  Konfirmasi Finalisasi Periode
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.gray600 }}>
                  Apakah Anda yakin ingin memfinalisasi data perhitungan iuran masa <strong>{periodeLabel}</strong>?
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#F8FAFC",
                borderRadius: 8,
                padding: "14px 16px",
                border: `1px solid ${COLORS.gray200}`,
                fontSize: 13,
                display: "flex",
                flexDirection: "column",
                gap: 8
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Periode Anggaran:</span>
                <strong style={{ color: COLORS.gray900 }}>{periodeLabel}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Cakupan Entitas:</span>
                <strong style={{ color: COLORS.gray900 }}>{activeEntity.title}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Total Iuran Terhitung:</span>
                <strong style={{ color: "#2563EB", fontSize: 14 }}>{fmtRupiah(activeEntity.totalIuran)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Total Peserta Terkalkulasi:</span>
                <strong style={{ color: COLORS.gray900 }}>{fmtNum(activeEntity.peserta)} Peserta</strong>
              </div>
            </div>

            <div style={{ fontSize: 12, color: COLORS.gray500, lineHeight: 1.5 }}>
              Setelah difinalisasi, status akan berubah menjadi <strong>&quot;Telah Difinalisasi&quot;</strong> dan perhitungan dapat dijadikan acuan penerbitan Surat Tagihan Iuran ke Kemenkeu RI.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setShowFinalizeModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.gray300}`,
                  background: COLORS.white,
                  color: COLORS.gray700,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusPeriode("Telah Difinalisasi");
                  setShowFinalizeModal(false);
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: 6,
                  border: "none",
                  background: "#047857",
                  color: COLORS.white,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <CheckCircle2 size={16} />
                Konfirmasi &amp; Kunci Periode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
