import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Banknote,
  Receipt,
  Wallet,
  Download,
  ChevronDown,
  Filter,
  Shield,
  Clock,
  HeartHandshake,
  Award,
  Search,
  FileText,
  Building2,
  CheckCircle2,
  Eye,
  Calendar,
  Layers,
  ArrowLeft
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, Btn, NoData, PreviewModal } from "../components/common";

export const PembayaranPensiun = ({ defaultTab = "induk" }) => {
  // 3 SUBTAB TERPADU ADMINISTRASI DAPEM DIVISI KEUANGAN:
  // "induk"    : DAPEM Induk (Gaji Pensiun Rutin Bulanan)
  // "susulan"  : DAPEM Susulan (Termin Susulan SK Terlambat & Rekening Pasif)
  // "nondapem" : NON-DAPEM (Pembayaran Pertama / PP, Rapel UKP, & Uang Duka Wafat / UDW)
  const [activeSubtab, setActiveSubtab] = useState(defaultTab);
  // View mode: "list" (daftar per bulan) or "detail" (rincian bulan terpilih)
  const [viewMode, setViewMode] = useState("list");
  const [filterStatusSalur, setFilterStatusSalur] = useState("Semua");
  const [searchBulan, setSearchBulan] = useState("");

  useEffect(() => {
    if (defaultTab) {
      setActiveSubtab(defaultTab);
      setViewMode("list");
    }
  }, [defaultTab]);

  // State Periode Batch Bulanan
  const [selectedBulan, setSelectedBulan] = useState("2026-07");
  const [filterKelompok, setFilterKelompok] = useState("Semua");
  const [filterJenisPensiun, setFilterJenisPensiun] = useState("Semua");
  const [filterPenyaluran, setFilterPenyaluran] = useState("Gabungan POS dan Bank");
  const [selectedDropdownDapem, setSelectedDropdownDapem] = useState("semua");

  // State Modal BNBA (By Name By Address) & Preview
  const [showBNBAModal, setShowBNBAModal] = useState(false);
  const [selectedBNBAMAK, setSelectedBNBAMAK] = useState(null);
  const [searchBNBA, setSearchBNBA] = useState("");
  const [preview, setPreview] = useState(null);

  // Expand / Collapse Accordion
  const [expandedDapem, setExpandedDapem] = useState({
    "513113": true,
    "513114": false,
    "513122": false,
    "513123": false,
    "total": false,
  });

  const toggleExpand = (kodeMAK) => {
    setExpandedDapem((prev) => ({ ...prev, [kodeMAK]: !prev[kodeMAK] }));
  };

  const closeAllDetails = () => {
    setExpandedDapem({
      "513113": false,
      "513114": false,
      "513122": false,
      "513123": false,
      "total": false,
    });
  };

  const fmt = (n) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
  const fmtJiwa = (n) => (n || 0).toLocaleString("id-ID");

  // =========================================================================
  // DATASET 1: DAPEM INDUK (Rutin Bulanan — 4 MAK Resmi)
  // =========================================================================
  const dapemIndukData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113)",
      singkatan: "PNS Kemhan",
      kategori: "PNS KEMHAN",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 1110, istriSuami: 310, anak: 170, cacat: 0, total: 1590 },
          bruto: { pensiunPokok: 6980570000, tunjKeluarga: 265330000, tunjBeras: 215270000, cacatLain: 0, lainLain: 342880000, total: 7804050000 },
          potongan: { pph21: 346622000, askes: 44753000, tgr: 0, nonTgr: 22911000, lainLain: 0, total: 414286000 },
          netto: 7389764000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 395, istriSuami: 51, anak: 34, cacat: 0, total: 480 },
          bruto: { pensiunPokok: 2074000610, tunjKeluarga: 53066477, tunjBeras: 63999140, cacatLain: 0, lainLain: 101939853, total: 2293006080 },
          potongan: { pph21: 97054000, askes: 12531000, tgr: 0, nonTgr: 6415000, lainLain: 0, total: 116000000 },
          netto: 2177006080
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 72, istriSuami: 0, anak: 10, cacat: 0, total: 82 },
          bruto: { pensiunPokok: 338280000, tunjKeluarga: 11608000, tunjBeras: 10472000, cacatLain: 0, lainLain: 16683000, total: 377043000 },
          potongan: { pph21: 16637239, askes: 2148967, tgr: 0, nonTgr: 1098074, lainLain: 0, total: 19884280 },
          netto: 357158720
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 8, istriSuami: 0, anak: 0, cacat: 0, total: 8 },
          bruto: { pensiunPokok: 39000000, tunjKeluarga: 1660000, tunjBeras: 1170000, cacatLain: 0, lainLain: 1855000, total: 43685000 },
          potongan: { pph21: 1850000, askes: 239000, tgr: 0, nonTgr: 124000, lainLain: 0, total: 2213000 },
          netto: 41472000
        }
      ],
      totalJiwa: { penerima: 1585, istriSuami: 361, anak: 214, cacat: 0, total: 2160 },
      totalBruto: { pensiunPokok: 9431850610, tunjKeluarga: 331664477, tunjBeras: 290911140, cacatLain: 0, lainLain: 463357853, total: 10517784080 },
      totalPotongan: { pph21: 462163239, askes: 59671967, tgr: 0, nonTgr: 30548074, lainLain: 0, total: 552383280 },
      totalNetto: 9965400800
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114)",
      singkatan: "PNS Polri",
      kategori: "PNS POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 261, istriSuami: 75, anak: 48, cacat: 0, total: 384 },
          bruto: { pensiunPokok: 1655734000, tunjKeluarga: 63110000, tunjBeras: 49946000, cacatLain: 0, lainLain: 80019000, total: 1848809000 },
          potongan: { pph21: 79334000, askes: 11426000, tgr: 0, nonTgr: 6543000, lainLain: 0, total: 97303000 },
          netto: 1751506000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 94, istriSuami: 12, anak: 11, cacat: 0, total: 117 },
          bruto: { pensiunPokok: 492244820, tunjKeluarga: 12622008, tunjBeras: 14849440, cacatLain: 0, lainLain: 23789109, total: 543505377 },
          potongan: { pph21: 23585000, askes: 3396000, tgr: 0, nonTgr: 1945000, lainLain: 0, total: 28926000 },
          netto: 514579377
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 16, istriSuami: 0, anak: 3, cacat: 0, total: 19 },
          bruto: { pensiunPokok: 80500000, tunjKeluarga: 2756000, tunjBeras: 2420000, cacatLain: 0, lainLain: 3876000, total: 89552000 },
          potongan: { pph21: 3859141, askes: 555836, tgr: 0, nonTgr: 318800, lainLain: 0, total: 4733777 },
          netto: 84818223
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 2, istriSuami: 0, anak: 0, cacat: 0, total: 2 },
          bruto: { pensiunPokok: 9000000, tunjKeluarga: 400000, tunjBeras: 280000, cacatLain: 0, lainLain: 450000, total: 10130000 },
          potongan: { pph21: 430000, askes: 63000, tgr: 0, nonTgr: 36000, lainLain: 0, total: 529000 },
          netto: 9601000
        }
      ],
      totalJiwa: { penerima: 373, istriSuami: 87, anak: 62, cacat: 0, total: 522 },
      totalBruto: { pensiunPokok: 2237478820, tunjKeluarga: 78888008, tunjBeras: 67495440, cacatLain: 0, lainLain: 108134109, total: 2491996377 },
      totalPotongan: { pph21: 107208141, askes: 15440836, tgr: 0, nonTgr: 8842800, lainLain: 0, total: 131491777 },
      totalNetto: 2360504600
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122)",
      singkatan: "TNI",
      kategori: "TNI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 3595, istriSuami: 820, anak: 2130, cacat: 0, total: 6545 },
          bruto: { pensiunPokok: 22709277000, tunjKeluarga: 1072148000, tunjBeras: 840410000, cacatLain: 0, lainLain: 1353663000, total: 25995498000 },
          potongan: { pph21: 1347618000, askes: 135030000, tgr: 0, nonTgr: 207408000, lainLain: 0, total: 1690056000 },
          netto: 24305442000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 1335, istriSuami: 145, anak: 484, cacat: 0, total: 1964 },
          bruto: { pensiunPokok: 6751406440, tunjKeluarga: 214429078, tunjBeras: 249851440, cacatLain: 0, lainLain: 402440341, total: 7618127299 },
          potongan: { pph21: 400643000, askes: 40144000, tgr: 0, nonTgr: 61662000, lainLain: 0, total: 502449000 },
          netto: 7115678299
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 185, istriSuami: 0, anak: 90, cacat: 0, total: 275 },
          bruto: { pensiunPokok: 1107529000, tunjKeluarga: 47608000, tunjBeras: 40885000, cacatLain: 0, lainLain: 65854000, total: 1261876000 },
          potongan: { pph21: 65559493, askes: 6568689, tgr: 0, nonTgr: 10089317, lainLain: 0, total: 82217499 },
          netto: 1179658501
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 22, istriSuami: 0, anak: 0, cacat: 0, total: 22 },
          bruto: { pensiunPokok: 120000000, tunjKeluarga: 6000000, tunjBeras: 4544000, cacatLain: 0, lainLain: 7318000, total: 137862000 },
          potongan: { pph21: 7285000, askes: 731000, tgr: 0, nonTgr: 1122000, lainLain: 0, total: 9138000 },
          netto: 128724000
        }
      ],
      totalJiwa: { penerima: 5137, istriSuami: 965, anak: 2704, cacat: 0, total: 8806 },
      totalBruto: { pensiunPokok: 30688212440, tunjKeluarga: 1340185078, tunjBeras: 1135690440, cacatLain: 0, lainLain: 1829275341, total: 34993363299 },
      totalPotongan: { pph21: 1821105493, askes: 182473689, tgr: 0, nonTgr: 280281317, lainLain: 0, total: 2283860499 },
      totalNetto: 32709502800
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123)",
      singkatan: "POLRI",
      kategori: "POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri",
          jiwa: { penerima: 2308, istriSuami: 580, anak: 1550, cacat: 0, total: 4438 },
          bruto: { pensiunPokok: 14635950000, tunjKeluarga: 493151000, tunjBeras: 402313000, cacatLain: 0, lainLain: 773566000, total: 16304980000 },
          potongan: { pph21: 769569000, askes: 72691000, tgr: 0, nonTgr: 104366000, lainLain: 0, total: 946626000 },
          netto: 15358354000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda",
          jiwa: { penerima: 860, istriSuami: 104, anak: 352, cacat: 0, total: 1316 },
          bruto: { pensiunPokok: 4351228090, tunjKeluarga: 98630956, tunjBeras: 119606650, cacatLain: 0, lainLain: 229979098, total: 4799444794 },
          potongan: { pph21: 228791000, askes: 21610000, tgr: 0, nonTgr: 31027000, lainLain: 0, total: 281428000 },
          netto: 4518016794
        },
        {
          id: "c",
          nama: "c. Tunjangan Yatim Piatu",
          jiwa: { penerima: 114, istriSuami: 0, anak: 65, cacat: 0, total: 179 },
          bruto: { pensiunPokok: 716133000, tunjKeluarga: 22157000, tunjBeras: 19571000, cacatLain: 0, lainLain: 37845000, total: 795706000 },
          potongan: { pph21: 37649488, askes: 3556287, tgr: 0, nonTgr: 5105219, lainLain: 0, total: 46310994 },
          netto: 749395006
        },
        {
          id: "d",
          nama: "d. Tunjangan Orang Tua",
          jiwa: { penerima: 15, istriSuami: 0, anak: 0, cacat: 0, total: 15 },
          bruto: { pensiunPokok: 75000000, tunjKeluarga: 2500000, tunjBeras: 2176000, cacatLain: 0, lainLain: 3970000, total: 83646000 },
          potongan: { pph21: 3950000, askes: 374000, tgr: 0, nonTgr: 538000, lainLain: 0, total: 4862000 },
          netto: 78784000
        }
      ],
      totalJiwa: { penerima: 3297, istriSuami: 684, anak: 1967, cacat: 0, total: 5948 },
      totalBruto: { pensiunPokok: 19778311090, tunjKeluarga: 616438956, tunjBeras: 543666650, cacatLain: 0, lainLain: 1045360098, total: 21983776794 },
      totalPotongan: { pph21: 1039959488, askes: 98231287, tgr: 0, nonTgr: 141036219, lainLain: 0, total: 1279226994 },
      totalNetto: 20704549800
    }
  ];

  // =========================================================================
  // DATASET 2: DAPEM SUSULAN (Termin 2 / Susulan SK Terlambat)
  // =========================================================================
  const dapemSusulanData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113) — SUSULAN",
      singkatan: "PNS Kemhan",
      kategori: "PNS KEMHAN",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri (Susulan)",
          jiwa: { penerima: 142, istriSuami: 40, anak: 28, cacat: 0, total: 210 },
          bruto: { pensiunPokok: 612000000, tunjKeluarga: 24800000, tunjBeras: 18900000, cacatLain: 0, lainLain: 30100000, total: 685800000 },
          potongan: { pph21: 30400000, askes: 3920000, tgr: 0, nonTgr: 2010000, lainLain: 0, total: 36330000 },
          netto: 649470000
        },
        {
          id: "b",
          nama: "b. Pensiun Warakawuri/Janda/Duda (Susulan)",
          jiwa: { penerima: 31, istriSuami: 4, anak: 3, cacat: 0, total: 38 },
          bruto: { pensiunPokok: 124500000, tunjKeluarga: 3180000, tunjBeras: 3840000, cacatLain: 0, lainLain: 6120000, total: 137640000 },
          potongan: { pph21: 5820000, askes: 752000, tgr: 0, nonTgr: 385000, lainLain: 0, total: 6957000 },
          netto: 130683000
        }
      ],
      totalJiwa: { penerima: 173, istriSuami: 44, anak: 31, cacat: 0, total: 248 },
      totalBruto: { pensiunPokok: 736500000, tunjKeluarga: 27980000, tunjBeras: 22740000, cacatLain: 0, lainLain: 36220000, total: 823440000 },
      totalPotongan: { pph21: 36220000, askes: 4672000, tgr: 0, nonTgr: 2395000, lainLain: 0, total: 43287000 },
      totalNetto: 780153000
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114) — SUSULAN",
      singkatan: "PNS Polri",
      kategori: "PNS POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri (Susulan)",
          jiwa: { penerima: 28, istriSuami: 8, anak: 5, cacat: 0, total: 41 },
          bruto: { pensiunPokok: 128000000, tunjKeluarga: 5200000, tunjBeras: 4100000, cacatLain: 0, lainLain: 6400000, total: 143700000 },
          potongan: { pph21: 6150000, askes: 890000, tgr: 0, nonTgr: 510000, lainLain: 0, total: 7550000 },
          netto: 136150000
        }
      ],
      totalJiwa: { penerima: 28, istriSuami: 8, anak: 5, cacat: 0, total: 41 },
      totalBruto: { pensiunPokok: 128000000, tunjKeluarga: 5200000, tunjBeras: 4100000, cacatLain: 0, lainLain: 6400000, total: 143700000 },
      totalPotongan: { pph21: 6150000, askes: 890000, tgr: 0, nonTgr: 510000, lainLain: 0, total: 7550000 },
      totalNetto: 136150000
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122) — SUSULAN",
      singkatan: "TNI",
      kategori: "TNI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri (Susulan)",
          jiwa: { penerima: 485, istriSuami: 110, anak: 290, cacat: 0, total: 885 },
          bruto: { pensiunPokok: 2180000000, tunjKeluarga: 104000000, tunjBeras: 81000000, cacatLain: 0, lainLain: 132000000, total: 2497000000 },
          potongan: { pph21: 129000000, askes: 12900000, tgr: 0, nonTgr: 19800000, lainLain: 0, total: 161700000 },
          netto: 2335300000
        }
      ],
      totalJiwa: { penerima: 485, istriSuami: 110, anak: 290, cacat: 0, total: 885 },
      totalBruto: { pensiunPokok: 2180000000, tunjKeluarga: 104000000, tunjBeras: 81000000, cacatLain: 0, lainLain: 132000000, total: 2497000000 },
      totalPotongan: { pph21: 129000000, askes: 12900000, tgr: 0, nonTgr: 19800000, lainLain: 0, total: 161700000 },
      totalNetto: 2335300000
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123) — SUSULAN",
      singkatan: "POLRI",
      kategori: "POLRI",
      jenisList: [
        {
          id: "a",
          nama: "a. Pensiun Sendiri (Susulan)",
          jiwa: { penerima: 260, istriSuami: 65, anak: 175, cacat: 0, total: 500 },
          bruto: { pensiunPokok: 1190000000, tunjKeluarga: 58000000, tunjBeras: 46000000, cacatLain: 0, lainLain: 74000000, total: 1368000000 },
          potongan: { pph21: 64500000, askes: 6100000, tgr: 0, nonTgr: 8700000, lainLain: 0, total: 79300000 },
          netto: 1288700000
        }
      ],
      totalJiwa: { penerima: 260, istriSuami: 65, anak: 175, cacat: 0, total: 500 },
      totalBruto: { pensiunPokok: 1190000000, tunjKeluarga: 58000000, tunjBeras: 46000000, cacatLain: 0, lainLain: 74000000, total: 1368000000 },
      totalPotongan: { pph21: 64500000, askes: 6100000, tgr: 0, nonTgr: 8700000, lainLain: 0, total: 79300000 },
      totalNetto: 1288700000
    }
  ];

  // =========================================================================
  // DATASET 3: NON-DAPEM (PP, UKP, & UDW)
  // =========================================================================
  const nonDapemData = [
    {
      no: 1,
      kodeMAK: "513113",
      namaKelompok: "PENS PNS KEMHAN (513113) — NON-DAPEM",
      singkatan: "PNS Kemhan",
      kategori: "PNS KEMHAN",
      jenisList: [
        {
          id: "pp",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 45, istriSuami: 12, anak: 8, cacat: 0, total: 65 },
          bruto: { pokok: 198000000, tunjKeluarga: 12400000, tunjBeras: 8900000, cacatLain: 0, lainLain: 15200000, total: 234500000 },
          potongan: { pph21: 11200000, askes: 1450000, nonTgr: 780000, total: 13430000 },
          netto: 221070000
        },
        {
          id: "ukp",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak / Rapel",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 82, istriSuami: 18, anak: 14, cacat: 0, total: 114 },
          bruto: { pokok: 142000000, tunjKeluarga: 6800000, tunjBeras: 5400000, cacatLain: 0, lainLain: 8200000, total: 162400000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 162400000
        },
        {
          id: "udw",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian (3x Gaji Pokok)",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 18, istriSuami: 0, anak: 0, cacat: 0, total: 18 },
          bruto: { pokok: 144000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 144000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 144000000
        }
      ],
      totalJiwa: { penerima: 145, istriSuami: 30, anak: 22, cacat: 0, total: 197 },
      totalBruto: { pokok: 484000000, tunjKeluarga: 19200000, tunjBeras: 14300000, cacatLain: 0, lainLain: 23400000, total: 540900000 },
      totalPotongan: { pph21: 11200000, askes: 1450000, nonTgr: 780000, total: 13430000 },
      totalNetto: 527470000
    },
    {
      no: 2,
      kodeMAK: "513114",
      namaKelompok: "PENS PNS POLRI (513114) — NON-DAPEM",
      singkatan: "PNS Polri",
      kategori: "PNS POLRI",
      jenisList: [
        {
          id: "pp",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 16, istriSuami: 4, anak: 3, cacat: 0, total: 23 },
          bruto: { pokok: 72000000, tunjKeluarga: 4100000, tunjBeras: 3100000, cacatLain: 0, lainLain: 5200000, total: 84400000 },
          potongan: { pph21: 3950000, askes: 520000, nonTgr: 280000, total: 4750000 },
          netto: 79650000
        },
        {
          id: "ukp",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak / Rapel",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 31, istriSuami: 6, anak: 4, cacat: 0, total: 41 },
          bruto: { pokok: 52000000, tunjKeluarga: 2400000, tunjBeras: 1800000, cacatLain: 0, lainLain: 3100000, total: 59300000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 59300000
        },
        {
          id: "udw",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian (3x Gaji Pokok)",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 6, istriSuami: 0, anak: 0, cacat: 0, total: 6 },
          bruto: { pokok: 48000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 48000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 48000000
        }
      ],
      totalJiwa: { penerima: 53, istriSuami: 10, anak: 7, cacat: 0, total: 70 },
      totalBruto: { pokok: 172000000, tunjKeluarga: 6500000, tunjBeras: 4900000, cacatLain: 0, lainLain: 8300000, total: 191700000 },
      totalPotongan: { pph21: 3950000, askes: 520000, nonTgr: 280000, total: 4750000 },
      totalNetto: 186950000
    },
    {
      no: 3,
      kodeMAK: "513122",
      namaKelompok: "PENS TNI (513122) — NON-DAPEM",
      singkatan: "TNI",
      kategori: "TNI",
      jenisList: [
        {
          id: "pp",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 310, istriSuami: 78, anak: 190, cacat: 0, total: 578 },
          bruto: { pokok: 980000000, tunjKeluarga: 54000000, tunjBeras: 42000000, cacatLain: 0, lainLain: 68000000, total: 1144000000 },
          potongan: { pph21: 58400000, askes: 5840000, nonTgr: 8900000, total: 73140000 },
          netto: 1070860000
        },
        {
          id: "ukp",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak / Rapel",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 420, istriSuami: 95, anak: 140, cacat: 0, total: 655 },
          bruto: { pokok: 840000000, tunjKeluarga: 41000000, tunjBeras: 31000000, cacatLain: 0, lainLain: 52000000, total: 964000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 964000000
        },
        {
          id: "udw",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian (3x Gaji Pokok)",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 85, istriSuami: 0, anak: 0, cacat: 0, total: 85 },
          bruto: { pokok: 680000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 680000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 680000000
        }
      ],
      totalJiwa: { penerima: 815, istriSuami: 173, anak: 330, cacat: 0, total: 1318 },
      totalBruto: { pokok: 2500000000, tunjKeluarga: 95000000, tunjBeras: 73000000, cacatLain: 0, lainLain: 120000000, total: 2788000000 },
      totalPotongan: { pph21: 58400000, askes: 5840000, nonTgr: 8900000, total: 73140000 },
      totalNetto: 2714860000
    },
    {
      no: 4,
      kodeMAK: "513123",
      namaKelompok: "PENS POLRI (513123) — NON-DAPEM",
      singkatan: "POLRI",
      kategori: "POLRI",
      jenisList: [
        {
          id: "pp",
          nama: "a. Pembayaran Pertama (PP) — Pensiun Terusan",
          deskripsi: "Akumulasi Pembayaran Pertama Hak Pensiun Baru",
          jiwa: { penerima: 180, istriSuami: 45, anak: 110, cacat: 0, total: 335 },
          bruto: { pokok: 620000000, tunjKeluarga: 34000000, tunjBeras: 27000000, cacatLain: 0, lainLain: 42000000, total: 723000000 },
          potongan: { pph21: 34200000, askes: 3420000, nonTgr: 5100000, total: 42720000 },
          netto: 680280000
        },
        {
          id: "ukp",
          nama: "b. Uang Kekurangan Pensiun (UKP) — Penyesuaian Hak / Rapel",
          deskripsi: "Rapel Koreksi Golongan, Pangkat & Tunjangan",
          jiwa: { penerima: 240, istriSuami: 52, anak: 80, cacat: 0, total: 372 },
          bruto: { pokok: 490000000, tunjKeluarga: 24000000, tunjBeras: 19000000, cacatLain: 0, lainLain: 31000000, total: 564000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 564000000
        },
        {
          id: "udw",
          nama: "c. Uang Duka Wafat (UDW) — Santunan Kematian (3x Gaji Pokok)",
          deskripsi: "Santunan Asuransi Kematian bagi Ahli Waris Sah",
          jiwa: { penerima: 42, istriSuami: 0, anak: 0, cacat: 0, total: 42 },
          bruto: { pokok: 336000000, tunjKeluarga: 0, tunjBeras: 0, cacatLain: 0, lainLain: 0, total: 336000000 },
          potongan: { pph21: 0, askes: 0, nonTgr: 0, total: 0 },
          netto: 336000000
        }
      ],
      totalJiwa: { penerima: 462, istriSuami: 97, anak: 190, cacat: 0, total: 749 },
      totalBruto: { pokok: 1446000000, tunjKeluarga: 58000000, tunjBeras: 46000000, cacatLain: 0, lainLain: 73000000, total: 1623000000 },
      totalPotongan: { pph21: 34200000, askes: 3420000, nonTgr: 5100000, total: 42720000 },
      totalNetto: 1580280000
    }
  ];

  // =========================================================================
  // DATASET ALOKASI KAS KE BANK MITRA BAYAR & SURAT PERINTAH (SP)
  // Menjawab fungsi utama Keuangan: Berapa uang kas yang mengalir ke mitra?
  // =========================================================================
  const mitraBayarData = {
    induk: [
      { id: "MTR-01", mitra: "PT Bank Rakyat Indonesia (Persero) Tbk", singkatan: "Bank BRI", penerima: 154200, alokasiNetto: 28420000000, noSP: "SP-202607-001/DAPEM/BRI", tglCair: "01 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-02", mitra: "PT Bank Mandiri (Persero) Tbk / Bank Mantap", singkatan: "Mandiri / Mantap", penerima: 142100, alokasiNetto: 24850000000, noSP: "SP-202607-002/DAPEM/MDR", tglCair: "01 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-03", mitra: "PT Bank Negara Indonesia (Persero) Tbk", singkatan: "Bank BNI", penerima: 68300, alokasiNetto: 11950000000, noSP: "SP-202607-003/DAPEM/BNI", tglCair: "01 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-04", mitra: "PT Pos Indonesia (Persero)", singkatan: "Pos Indonesia", penerima: 35400, alokasiNetto: 6180000000, noSP: "SP-202607-004/DAPEM/POS", tglCair: "01 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-05", mitra: "PT Bank Syariah Indonesia / Bank BTN", singkatan: "BSI & BTN", penerima: 27620, alokasiNetto: 4830000000, noSP: "SP-202607-005/DAPEM/BSI", tglCair: "01 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
    ],
    susulan: [
      { id: "MTR-SUS-01", mitra: "PT Bank Rakyat Indonesia (Persero) Tbk", singkatan: "Bank BRI", penerima: 480, alokasiNetto: 1980000000, noSP: "SP-202607-011/SUS/BRI", tglCair: "16 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-SUS-02", mitra: "PT Bank Mandiri (Persero) Tbk / Bank Mantap", singkatan: "Mandiri / Mantap", penerima: 390, alokasiNetto: 1620000000, noSP: "SP-202607-012/SUS/MDR", tglCair: "16 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-SUS-03", mitra: "PT Bank Negara Indonesia (Persero) Tbk", singkatan: "Bank BNI", penerima: 185, alokasiNetto: 780000000, noSP: "SP-202607-013/SUS/BNI", tglCair: "16 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-SUS-04", mitra: "PT Pos Indonesia (Persero)", singkatan: "Pos Indonesia", penerima: 95, alokasiNetto: 390000000, noSP: "SP-202607-014/SUS/POS", tglCair: "16 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-SUS-05", mitra: "PT Bank Syariah Indonesia / Bank BTN", singkatan: "BSI & BTN", penerima: 60, alokasiNetto: 250000000, noSP: "SP-202607-015/SUS/BSI", tglCair: "16 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
    ],
    nondapem: [
      { id: "MTR-NON-01", mitra: "PT Bank Rakyat Indonesia (Persero) Tbk", singkatan: "Bank BRI", penerima: 210, alokasiNetto: 1250000000, noSP: "SP-202607-021/NON/BRI", tglCair: "10 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-NON-02", mitra: "PT Bank Mandiri (Persero) Tbk / Bank Mantap", singkatan: "Mandiri / Mantap", penerima: 180, alokasiNetto: 1080000000, noSP: "SP-202607-022/NON/MDR", tglCair: "10 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-NON-03", mitra: "PT Bank Negara Indonesia (Persero) Tbk", singkatan: "Bank BNI", penerima: 90, alokasiNetto: 540000000, noSP: "SP-202607-023/NON/BNI", tglCair: "10 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-NON-04", mitra: "PT Pos Indonesia (Persero)", singkatan: "Pos Indonesia", penerima: 45, alokasiNetto: 270000000, noSP: "SP-202607-024/NON/POS", tglCair: "10 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
      { id: "MTR-NON-05", mitra: "PT Bank Syariah Indonesia / Bank BTN", singkatan: "BSI & BTN", penerima: 30, alokasiNetto: 180000000, noSP: "SP-202607-025/NON/BSI", tglCair: "10 Juli 2026", status: "Dana Tersedia (Disalurkan)" },
    ]
  };

  // =========================================================================
  // DATASET SAMPLE BNBA (By Name By Address / Rincian Peserta Pensiun)
  // =========================================================================
  const sampleBNBAList = [
    { nopen: "2019482101", nrp: "39201948", nama: "KOLONEL (PURN) H. ACHMAD ROFIQ, S.IP", matra: "TNI AD", golongan: "Pamen (IV/b)", pokok: 4520000, tunjKeluarga: 452000, tunjBeras: 315000, pph21: 180000, askes: 45200, netto: 5061800, bank: "Bank BRI", noRek: "0210-01-098877-50-2", status: "Siap Bayar" },
    { nopen: "2018374922", nrp: "50392811", nama: "MAYOR (PURN) SUHARTONO", matra: "TNI AL", golongan: "Pamen (IV/a)", pokok: 3980000, tunjKeluarga: 398000, tunjBeras: 315000, pph21: 145000, askes: 39800, netto: 4508200, bank: "Bank Mandiri", noRek: "124-00-0988112-3", status: "Siap Bayar" },
    { nopen: "2021839201", nrp: "61203948", nama: "KAPTEN (PURN) BAMBANG IRAWAN", matra: "TNI AU", golongan: "Pama (III/d)", pokok: 3450000, tunjKeluarga: 345000, tunjBeras: 315000, pph21: 110000, askes: 34500, netto: 3965500, bank: "Bank BNI", noRek: "0198-88-223311-9", status: "Siap Bayar" },
    { nopen: "2022948172", nrp: "72019283", nama: "KOMPOL (PURN) DRS. WAHYU HIDAYAT", matra: "POLRI", golongan: "Pamen (IV/a)", pokok: 4120000, tunjKeluarga: 412000, tunjBeras: 315000, pph21: 155000, askes: 41200, netto: 4650800, bank: "Bank BRI", noRek: "0012-01-443322-5", status: "Siap Bayar" },
    { nopen: "2020391823", nrp: "196208151988031002", nama: "DRA. SRI MULYANI, M.SI", matra: "PNS Kemhan", golongan: "Pembina (IV/a)", pokok: 3680000, tunjKeluarga: 368000, tunjBeras: 315000, pph21: 125000, askes: 36800, netto: 4201200, bank: "PT Pos Indonesia", noRek: "Pos Giro 098-22-1199", status: "Siap Bayar" },
    { nopen: "2023910293", nrp: "84029182", nama: "PELDA (PURN) AGUS SANTOSO", matra: "TNI AD", golongan: "Bintara (III/a)", pokok: 2850000, tunjKeluarga: 285000, tunjBeras: 315000, pph21: 65000, askes: 28500, netto: 3356500, bank: "Bank BSI", noRek: "7100-99-445566-1", status: "Siap Bayar" }
  ];

  const NAMA_BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const monthNum = parseInt(selectedBulan.split("-")[1], 10) || 7;
  const monthMultiplier = 1 + (monthNum - 7) * (activeSubtab === "induk" ? 0.0025 : 0.003);

  // Pemilihan Base Dataset berdasarkan Subtab Aktif
  const baseDataset =
    activeSubtab === "susulan"
      ? dapemSusulanData
      : activeSubtab === "nondapem"
      ? nonDapemData
      : dapemIndukData;

  const baseMitraList =
    activeSubtab === "susulan"
      ? mitraBayarData.susulan
      : activeSubtab === "nondapem"
      ? mitraBayarData.nondapem
      : mitraBayarData.induk;

  // Dataset Dinamis Sesuai Bulan Terpilih (Detail View)
  const currentDataset = useMemo(() => {
    if (monthMultiplier === 1.0) return baseDataset;
    return baseDataset.map((d) => ({
      ...d,
      jenisList: d.jenisList.map((j) => ({
        ...j,
        jiwa: {
          ...j.jiwa,
          penerima: Math.round(j.jiwa.penerima * monthMultiplier),
          istriSuami: Math.round(j.jiwa.istriSuami * monthMultiplier),
          anak: Math.round(j.jiwa.anak * monthMultiplier),
          total: Math.round(j.jiwa.total * monthMultiplier),
        },
        bruto: {
          ...j.bruto,
          total: Math.round(j.bruto.total * monthMultiplier),
        },
        potongan: {
          ...j.potongan,
          total: Math.round(j.potongan.total * monthMultiplier),
        },
        netto: Math.round(j.netto * monthMultiplier),
      })),
      totalJiwa: {
        ...d.totalJiwa,
        penerima: Math.round(d.totalJiwa.penerima * monthMultiplier),
        total: Math.round(d.totalJiwa.total * monthMultiplier),
      },
      totalBruto: {
        ...d.totalBruto,
        total: Math.round(d.totalBruto.total * monthMultiplier),
      },
      totalPotongan: {
        ...d.totalPotongan,
        total: Math.round(d.totalPotongan.total * monthMultiplier),
      },
      totalNetto: Math.round(d.totalNetto * monthMultiplier),
    }));
  }, [baseDataset, monthMultiplier]);

  const currentMitraList = useMemo(() => {
    const bStr = selectedBulan.replace("-", "");
    const mName = NAMA_BULAN[monthNum - 1] || "Juli";
    const cairDay = activeSubtab === "susulan" ? "16" : activeSubtab === "nondapem" ? "10" : "01";
    return baseMitraList.map((m) => ({
      ...m,
      penerima: Math.round(m.penerima * monthMultiplier),
      alokasiNetto: Math.round(m.alokasiNetto * monthMultiplier),
      noSP: m.noSP.replace(/202607/, bStr),
      tglCair: `${cairDay} ${mName} 2026`,
      status: monthNum <= 6 ? "Selesai Disalurkan" : (monthNum === 7 ? "Dana Tersedia (Disalurkan)" : "Terjadwal")
    }));
  }, [baseMitraList, monthMultiplier, selectedBulan, monthNum, activeSubtab]);

  // Filter List MAK
  const filteredMAKList = currentDataset.filter((d) => {
    if (filterKelompok !== "Semua" && d.namaKelompok !== filterKelompok) return false;
    if (selectedDropdownDapem !== "semua" && d.kodeMAK !== selectedDropdownDapem) return false;
    return true;
  });

  // Grand Totals Dinamis Bulan Terpilih (Detail View)
  const grandTotalJiwa = {
    penerima: currentDataset.reduce((a, d) => a + d.totalJiwa.penerima, 0),
    istriSuami: currentDataset.reduce((a, d) => a + d.totalJiwa.istriSuami, 0),
    anak: currentDataset.reduce((a, d) => a + d.totalJiwa.anak, 0),
    cacat: currentDataset.reduce((a, d) => a + (d.totalJiwa.cacat || 0), 0),
    total: currentDataset.reduce((a, d) => a + d.totalJiwa.total, 0),
  };

  const grandTotalBruto = currentDataset.reduce((a, d) => a + d.totalBruto.total, 0);
  const grandTotalPotongan = currentDataset.reduce((a, d) => a + d.totalPotongan.total, 0);
  const grandTotalNetto = currentDataset.reduce((a, d) => a + d.totalNetto, 0);

  // DATASET 12 BULAN (LIST VIEW)
  const monthlyListDapem = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const mNum = i + 1;
      const mStr = String(mNum).padStart(2, "0");
      const key = `2026-${mStr}`;
      const mName = NAMA_BULAN[i];
      const prevMName = mNum === 1 ? "Des 2025" : NAMA_BULAN[mNum - 2].slice(0, 3);

      const mult = 1 + (mNum - 7) * (activeSubtab === "induk" ? 0.0025 : 0.003);
      let jiwa = 0;
      let bruto = 0;
      let potongan = 0;
      let jadwal = "";
      let status = "Terjadwal";
      let statusColor = "#64748B";
      let statusBg = "#F1F5F9";

      if (activeSubtab === "induk") {
        jiwa = Math.round(427620 * (1 + (mNum - 7) * 0.0018));
        bruto = Math.round(82200000000 * mult);
        potongan = Math.round(5800000000 * mult);
        jadwal = `Cut-off: 20 ${prevMName} • Cair: 01 ${mName.slice(0, 3)} 2026`;
      } else if (activeSubtab === "susulan") {
        jiwa = Math.round(1210 * (1 + (mNum - 7) * 0.002));
        bruto = Math.round(5480000000 * mult);
        potongan = Math.round(460000000 * mult);
        jadwal = `Verifikasi: 10 ${mName.slice(0, 3)} • Cair: 16 ${mName.slice(0, 3)} 2026`;
      } else {
        jiwa = Math.round(510 * (1 + (mNum - 7) * 0.002));
        bruto = Math.round(3540000000 * mult);
        potongan = Math.round(220000000 * mult);
        jadwal = `Verifikasi: 05 ${mName.slice(0, 3)} • Cair: 10 ${mName.slice(0, 3)} 2026`;
      }

      const netto = bruto - potongan;

      if (mNum <= 6) {
        status = "Selesai Disalurkan";
        statusColor = "#059669";
        statusBg = "#ECFDF5";
      } else if (mNum === 7) {
        status = "Batch Aktif (Siap Salur)";
        statusColor = "#1D4ED8";
        statusBg = "#EFF6FF";
      } else if (mNum === 8) {
        status = activeSubtab === "induk" ? "Proses Cut-Off" : "Verifikasi Berkas";
        statusColor = "#D97706";
        statusBg = "#FFFBEB";
      }

      return {
        no: mNum,
        monthNum: mNum,
        key,
        namaBulan: mName,
        periodeLabel: `${mName} 2026`,
        jadwal,
        jiwa,
        bruto,
        potongan,
        netto,
        status,
        statusColor,
        statusBg
      };
    });
  }, [activeSubtab]);

  // Filtered List View
  const filteredMonthlyDapem = useMemo(() => {
    return monthlyListDapem.filter((m) => {
      if (searchBulan.trim() && !m.namaBulan.toLowerCase().includes(searchBulan.toLowerCase().trim())) {
        return false;
      }
      return true;
    });
  }, [monthlyListDapem, searchBulan]);

  const annualAvgJiwa = Math.round(monthlyListDapem.reduce((a, m) => a + m.jiwa, 0) / monthlyListDapem.length);
  const annualTotalBruto = monthlyListDapem.reduce((a, m) => a + m.bruto, 0);
  const annualTotalPotongan = monthlyListDapem.reduce((a, m) => a + m.potongan, 0);
  const annualTotalNetto = monthlyListDapem.reduce((a, m) => a + m.netto, 0);

  const getSubtabTitle = () => {
    if (activeSubtab === "susulan") return "DAPEM Susulan (Termin Susulan)";
    if (activeSubtab === "nondapem") return "NON-DAPEM (PP, UKP, UDW)";
    return "DAPEM Induk (Rutin Bulanan)";
  };

  const getSubtabBadge = () => {
    if (activeSubtab === "susulan") return "Termin Susulan SK Terlambat & Rekening Pasif";
    if (activeSubtab === "nondapem") return "Pembayaran Pertama (PP), Rapel UKP & Santunan UDW";
    return "Gaji Pokok & Tunjangan Pensiun Rutin";
  };

  const handleOpenMonthDetail = (m) => {
    setSelectedBulan(m.key);
    setViewMode("detail");
  };

  // Helper Preview Surat Perintah (SP) Penyaluran ke Bank Mitra
  const handleOpenSPPreview = (item) => {
    const progLabel =
      activeSubtab === "susulan"
        ? "DAPEM SUSULAN"
        : activeSubtab === "nondapem"
        ? "MANFAAT NON-DAPEM (PP, UKP, UDW)"
        : "DAPEM INDUK REGULER";

    setPreview({
      title: `Surat Perintah (SP) Penyaluran Pensiun — ${item.singkatan}`,
      subtitle: `Nomor: ${item.noSP} • Periode Bulan ${selectedBulan}`,
      type: "surat",
      fileName: `${item.noSP.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
      content: {
        noSurat: item.noSP,
        tanggal: item.tglCair,
        perihal: `Penyaluran Dana ${progLabel} Melalui Rekening Mitra Bayar ${item.singkatan}`,
        items: [
          { jenis: `Penyaluran Dana ${progLabel}`, peserta: `${fmtJiwa(item.penerima)} Jiwa Pensiunan`, nominal: fmt(item.alokasiNetto) }
        ],
        totalNominal: fmt(item.alokasiNetto),
        bankTujuan: item.mitra
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* PREVIEW MODAL */}
      {preview && <PreviewModal preview={preview} onClose={() => setPreview(null)} />}

      {/* MODAL BNBA (By Name By Address / Rincian Peserta) */}
      {showBNBAModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backdropFilter: "blur(3px)"
          }}
          onClick={() => setShowBNBAModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 12,
              width: "100%",
              maxWidth: 1060,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: "16px 22px",
                borderBottom: `1px solid ${COLORS.gray200}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.blue
                  }}
                >
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                    Rincian Peserta Pensiun By Name By Address (BNBA)
                  </div>
                  <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
                    {selectedBNBAMAK ? selectedBNBAMAK : "Seluruh Kelompok MAK Pensiun"} • Periode Bulan {selectedBulan}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowBNBAModal(false)}
                style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: COLORS.gray400 }}
              >
                ✕
              </button>
            </div>

            {/* Toolbar Filter Modal */}
            <div style={{ padding: "12px 22px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", width: 300 }}>
                <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 9 }} />
                <input
                  type="text"
                  placeholder="Cari Nopen / NRP / Nama Pensiunan..."
                  value={searchBNBA}
                  onChange={(e) => setSearchBNBA(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px 6px 30px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <Btn
                size="sm"
                variant="outline"
                onClick={() => {
                  setPreview({
                    title: "Ekspor Data BNBA Pensiunan",
                    subtitle: `Periode ${selectedBulan}`,
                    type: "table",
                    fileName: `BNBA_Pensiun_${selectedBulan}.xlsx`,
                    content: {
                      columns: ["No", "Nopen", "NRP / NIP", "Nama Lengkap", "Matra", "Pangkat / Gol", "Pensiun Pokok", "Tunj. Keluarga", "Tunj. Beras", "PPh 21", "Askes / BPJS", "Netto Ditransfer", "Mitra Bayar", "No. Rekening"],
                      rows: sampleBNBAList.map((p, idx) => [
                        idx + 1,
                        p.nopen,
                        p.nrp,
                        p.nama,
                        p.matra,
                        p.golongan,
                        fmt(p.pokok),
                        fmt(p.tunjKeluarga),
                        fmt(p.tunjBeras),
                        fmt(p.pph21),
                        fmt(p.askes),
                        fmt(p.netto),
                        p.bank,
                        p.noRek
                      ]),
                      totalRows: sampleBNBAList.length
                    }
                  });
                }}
              >
                <Download size={13} style={{ marginRight: 4 }} />
                Ekspor Excel BNBA
              </Btn>
            </div>

            {/* Table Content Modal */}
            <div style={{ padding: "16px 22px", overflowY: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}` }}>Nopen / NRP</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}` }}>Nama Pensiunan</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}` }}>Matra / Gol</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Pensiun Pokok</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Tunjangan</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Potongan</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}`, textAlign: "right" }}>Netto Kas</th>
                    <th style={{ padding: "8px 10px", borderBottom: `1px solid ${COLORS.gray300}` }}>Mitra & Rekening</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleBNBAList
                    .filter((p) => {
                      if (!searchBNBA) return true;
                      const q = searchBNBA.toLowerCase();
                      return p.nama.toLowerCase().includes(q) || p.nopen.includes(q) || p.nrp.includes(q);
                    })
                    .map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "10px 10px", fontFamily: "monospace", fontWeight: 700, color: COLORS.gray900 }}>
                          {p.nopen}
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>NRP: {p.nrp}</div>
                        </td>
                        <td style={{ padding: "10px 10px", fontWeight: 700, color: COLORS.gray900 }}>
                          {p.nama}
                          <div style={{ fontSize: 11, color: COLORS.blueDark, fontWeight: 600 }}>Status: {p.status}</div>
                        </td>
                        <td style={{ padding: "10px 10px", color: COLORS.gray700 }}>
                          {p.matra}
                          <div style={{ fontSize: 11, color: COLORS.gray500 }}>{p.golongan}</div>
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmt(p.pokok)}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "monospace", color: "#059669" }}>
                          +{fmt(p.tunjKeluarga + p.tunjBeras)}
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "monospace", color: "#DC2626" }}>
                          -{fmt(p.pph21 + p.askes)}
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, fontSize: 13 }}>
                          {fmt(p.netto)}
                        </td>
                        <td style={{ padding: "10px 10px" }}>
                          <div style={{ fontWeight: 600 }}>{p.bank}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500, fontFamily: "monospace" }}>{p.noRek}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Footer Modal */}
            <div style={{ padding: "12px 22px", borderTop: `1px solid ${COLORS.gray200}`, background: "#F8FAFC", display: "flex", justifyContent: "flex-end" }}>
              <Btn size="sm" variant="ghost" onClick={() => setShowBNBAModal(false)}>Tutup</Btn>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NAVIGASI 3 SUBTAB TERPADU: INDUK | SUSULAN | NON-DAPEM
         ========================================================================= */}
      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${COLORS.gray200}`,
          gap: 6
        }}
      >
        <button
          onClick={() => { setActiveSubtab("induk"); }}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: activeSubtab === "induk" ? 800 : 600,
            color: activeSubtab === "induk" ? COLORS.blue : COLORS.gray600,
            borderBottom: activeSubtab === "induk" ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease"
          }}
        >
          <Banknote size={16} />
          <span>DAPEM Induk (Rutin Bulanan)</span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeSubtab === "induk" ? "#DBEAFE" : "#F1F5F9",
              color: activeSubtab === "induk" ? "#1E40AF" : COLORS.gray600,
              fontWeight: 700
            }}
          >
            {fmtJiwa(dapemIndukData.reduce((a, d) => a + d.totalJiwa.penerima, 0))} Jiwa
          </span>
        </button>

        <button
          onClick={() => { setActiveSubtab("susulan"); }}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: activeSubtab === "susulan" ? 800 : 600,
            color: activeSubtab === "susulan" ? "#047857" : COLORS.gray600,
            borderBottom: activeSubtab === "susulan" ? `3px solid #047857` : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease"
          }}
        >
          <Clock size={16} />
          <span>DAPEM Susulan (Termin Susulan)</span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeSubtab === "susulan" ? "#D1FAE5" : "#F1F5F9",
              color: activeSubtab === "susulan" ? "#065F46" : COLORS.gray600,
              fontWeight: 700
            }}
          >
            {fmtJiwa(dapemSusulanData.reduce((a, d) => a + d.totalJiwa.penerima, 0))} Jiwa
          </span>
        </button>

        <button
          onClick={() => { setActiveSubtab("nondapem"); }}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: activeSubtab === "nondapem" ? 800 : 600,
            color: activeSubtab === "nondapem" ? "#7C3AED" : COLORS.gray600,
            borderBottom: activeSubtab === "nondapem" ? `3px solid #7C3AED` : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease"
          }}
        >
          <HeartHandshake size={16} />
          <span>NON-DAPEM (PP, UKP, UDW)</span>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeSubtab === "nondapem" ? "#EDE9FE" : "#F1F5F9",
              color: activeSubtab === "nondapem" ? "#6D28D9" : COLORS.gray600,
              fontWeight: 700
            }}
          >
            PP • UKP • UDW
          </span>
        </button>
      </div>

      {/* =========================================================================
          VIEW 1: LIST VIEW (DAFTAR PER BULAN)
         ========================================================================= */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Header Banner */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: "16px 20px",
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.blue
                  }}
                >
                  <Wallet size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.gray900 }}>
                    Daftar {getSubtabTitle()} Per Bulan (TA 2026)
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.gray500 }}>
                    Monitoring hak pensiun bulanan, pemotongan pajak PPh 21 / BPJS, dan penyaluran kas ke Bank Mitra Bayar. Klik &quot;Lihat Detail&quot; untuk rincian tiap bulan.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "#EFF6FF",
                  color: "#1E40AF",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid #BFDBFE"
                }}
              >
                <Calendar size={13} color="#2563EB" />
                TA 2026 • 12 Periode Bulanan
              </span>
            </div>
          </div>

          {/* Panduan Operasional Divisi Keuangan */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              padding: "10px 16px",
              border: `1px solid ${COLORS.gray200}`,
              fontSize: 12,
              color: COLORS.gray700,
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <span style={{ fontSize: 16 }}>💡</span>
            <div>
              <b>Panduan Divisi Keuangan:</b> Data dihitung ulang setiap bulan berdasarkan cut-off tanggal 20 dari Divisi Pelayanan/Kepesertaan. Divisi Keuangan fokus memastikan <b>ketersediaan likuiditas kas netto</b>, memonitor <b>potongan pajak PPh 21 &amp; iuran BPJS</b>, serta menerbitkan <b>Surat Perintah (SP) Penyaluran Dana ke Bank Mitra Bayar</b>.
            </div>
          </div>

          {/* StatCards Operasional List Per Bulan */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <StatCard
              icon={<Users size={IC} />}
              label={`Rata-rata Jiwa Penerima (${getSubtabTitle()})`}
              value={`${fmtJiwa(annualAvgJiwa)} Jiwa`}
              sub="Rata-rata penerima manfaat bulanan"
              color={COLORS.blue}
            />
            <StatCard
              icon={<Calendar size={IC} />}
              label="Total Periode Anggaran"
              value="12 Periode Bulan"
              sub="Tahun Anggaran (TA) 2026"
              color={COLORS.green}
            />
            <StatCard
              icon={<Building2 size={IC} />}
              label="Jaringan Bank Mitra Bayar"
              value="5 Bank / Pos Terdaftar"
              sub="BRI, Mandiri, BNI, Pos Indonesia, BSI"
              color={COLORS.blueDark}
            />
            <StatCard
              icon={<CheckCircle2 size={IC} />}
              label="Masa Batch Berjalan"
              value="Bulan Juli 2026"
              sub="Batch Aktif Operasional Siap Salur"
              color={COLORS.orange}
            />
          </div>

          {/* Table Container Per Bulan */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 10,
              padding: "18px 20px",
              border: `1px solid ${COLORS.gray200}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: 260 }}>
                  <Search size={14} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: 10 }} />
                  <input
                    type="text"
                    placeholder="Cari bulan (misal: Juli)..."
                    value={searchBulan}
                    onChange={(e) => setSearchBulan(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 10px 7px 30px",
                      borderRadius: 6,
                      border: `1px solid ${COLORS.gray300}`,
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Export Buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreview({
                      title: `Daftar ${getSubtabTitle()} Tahunan — TA 2026`,
                      subtitle: `Format Excel (.xlsx) • Seluruh Periode Bulan`,
                      type: "table",
                      fileName: `Daftar_${activeSubtab}_Tahunan_2026.xlsx`,
                      content: {
                        columns: ["No", "Bulan / Periode", "Jadwal Cut-Off & Penyaluran", "Penerima (Jiwa)", "Mitra Bayar"],
                        rows: monthlyListDapem.map((m) => [
                          m.no,
                          m.periodeLabel,
                          m.jadwal,
                          `${fmtJiwa(m.jiwa)} Jiwa`,
                          "5 Mitra (BRI, Mandiri, BNI, Pos, BSI)"
                        ]),
                        totalRows: monthlyListDapem.length
                      }
                    })
                  }
                >
                  <Download size={13} style={{ marginRight: 4 }} />
                  Ekspor Excel
                </Btn>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreview({
                      title: `Daftar ${getSubtabTitle()} Tahunan — TA 2026`,
                      subtitle: `Format PDF Resmi Ditjen Perbendaharaan Kemenkeu`,
                      type: "table",
                      fileName: `Daftar_${activeSubtab}_Tahunan_2026.pdf`,
                      content: {
                        columns: ["No", "Bulan / Periode", "Jadwal Cut-Off & Penyaluran", "Penerima (Jiwa)", "Mitra Bayar"],
                        rows: monthlyListDapem.map((m) => [
                          m.no,
                          m.periodeLabel,
                          m.jadwal,
                          `${fmtJiwa(m.jiwa)} Jiwa`,
                          "5 Mitra (BRI, Mandiri, BNI, Pos, BSI)"
                        ]),
                        totalRows: monthlyListDapem.length
                      }
                    })
                  }
                >
                  <Download size={13} style={{ marginRight: 4 }} />
                  Ekspor PDF
                </Btn>
              </div>
            </div>

            {/* Table Months */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                    <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, width: 40 }}>No</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Bulan / Periode</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Jadwal Cut-Off &amp; Penyaluran</th>
                    <th style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Penerima (Jiwa)</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Mitra Bayar</th>
                    <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center", width: 140 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonthlyDapem.map((m) => (
                    <tr
                      key={m.key}
                      style={{
                        borderBottom: `1px solid ${COLORS.gray100}`,
                        background: m.monthNum === 7 ? "#F0FDF4" : "transparent",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => {
                        if (m.monthNum !== 7) e.currentTarget.style.background = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (m.monthNum !== 7) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td style={{ padding: "12px 12px", color: COLORS.gray500, fontWeight: 600 }}>{m.no}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 800, color: COLORS.gray900, fontSize: 13 }}>
                          {m.namaBulan} 2026
                        </div>
                        {m.monthNum === 7 && (
                          <span style={{ fontSize: 10, color: "#166534", fontWeight: 700 }}>
                            ★ Batch Aktif (Siap Salur)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11.5 }}>
                        {m.jadwal}
                      </td>
                      <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                        {fmtJiwa(m.jiwa)} Jiwa
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: COLORS.gray700 }}>
                        5 Mitra (BRI, Mandiri, BNI, Pos, BSI)
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <Btn
                          size="xs"
                          variant="primary"
                          onClick={() => handleOpenMonthDetail(m)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          <Eye size={12} />
                          Lihat Detail
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: "12px 14px" }}>
                      TOTAL / RATA-RATA (12 BULAN TA 2026):
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontFamily: "monospace" }}>
                      {fmtJiwa(annualAvgJiwa)} (rata-rata)
                    </td>
                    <td style={{ padding: "12px 14px", color: COLORS.gray600, fontSize: 11.5 }}>
                      5 Bank / Pos Terdaftar
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "#065F46", fontSize: 11 }}>
                      12 Periode Bulan
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DETAIL VIEW (RINCIAN BULAN TERPILIH)
         ========================================================================= */}
      {viewMode === "detail" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Header Navigation: Kembali ke Daftar Bulanan */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: "14px 20px",
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Btn
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 700,
                  color: COLORS.blueDark,
                  borderColor: COLORS.gray300
                }}
              >
                <ArrowLeft size={14} />
                Kembali ke Daftar Bulanan
              </Btn>

              <div style={{ height: 26, width: 1, background: COLORS.gray300 }} />

              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                  Detail {getSubtabTitle()} — Periode Bulan {NAMA_BULAN[monthNum - 1]} 2026
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>
                  {getSubtabBadge()} • Alokasi likuiditas kas &amp; MAK Kemenkeu RI
                </div>
              </div>
            </div>

            {/* Quick Month Switcher within Detail */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray700 }}>Pilih Bulan Lain:</span>
                <select
                  value={selectedBulan}
                  onChange={(e) => setSelectedBulan(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.gray300}`,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: COLORS.blueDark,
                    background: COLORS.white,
                    cursor: "pointer"
                  }}
                >
                  {monthlyListDapem.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.periodeLabel} {m.key === "2026-07" ? "(Batch Aktif)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <span
                style={{
                  fontSize: 11.5,
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: monthNum <= 6 ? "#ECFDF5" : (monthNum === 7 ? "#EFF6FF" : "#F1F5F9"),
                  color: monthNum <= 6 ? "#065F46" : (monthNum === 7 ? "#1D4ED8" : "#475569"),
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  border: `1px solid ${monthNum <= 6 ? "#A7F3D0" : (monthNum === 7 ? "#BFDBFE" : "#CBD5E1")}`
                }}
              >
                <CheckCircle2 size={13} color={monthNum <= 6 ? "#059669" : (monthNum === 7 ? "#2563EB" : "#64748B")} />
                {monthNum <= 6 ? "Selesai Disalurkan" : (monthNum === 7 ? "Batch Terkunci (Cut-Off: 20 Juni 2026)" : "Rencana Terjadwal")}
              </span>
            </div>
          </div>

          {/* PENJELASAN OPERASIONAL DIVISI KEUANGAN */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              padding: "10px 16px",
              border: `1px solid ${COLORS.gray200}`,
              fontSize: 12,
              color: COLORS.gray700,
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <span style={{ fontSize: 16 }}>💡</span>
            <div>
              <b>Panduan Divisi Keuangan:</b> Data dihitung ulang setiap bulan berdasarkan cut-off tanggal 20 dari Divisi Pelayanan/Kepesertaan. Divisi Keuangan fokus memastikan <b>ketersediaan likuiditas kas netto</b>, memonitor <b>potongan pajak PPh 21 &amp; iuran BPJS</b>, serta menerbitkan <b>Surat Perintah (SP) Penyaluran Dana ke Bank Mitra Bayar</b>.
            </div>
          </div>

          {/* 3. STATCARDS: RINGKASAN KEBUTUHAN KAS KEUANGAN */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <StatCard
              icon={<Users size={IC} />}
              label="Total Jiwa Penerima"
              value={`${fmtJiwa(grandTotalJiwa.total)} Jiwa`}
              sub={`${fmtJiwa(grandTotalJiwa.penerima)} Penerima • ${fmtJiwa(grandTotalJiwa.istriSuami + grandTotalJiwa.anak)} Keluarga`}
              color={COLORS.blue}
            />
            <StatCard
              icon={<Banknote size={IC} />}
              label="Beban Bruto Hak Pensiun"
              value={fmt(grandTotalBruto)}
              sub="Akumulasi Hak Pensiun Bruto"
              color={COLORS.green}
            />
            <StatCard
              icon={<Receipt size={IC} />}
              label="Total Potongan Resmi"
              value={fmt(grandTotalPotongan)}
              sub="PPh 21 Pensiun, Iuran BPJS &amp; Non-TGR"
              color={COLORS.red}
            />
            <StatCard
              icon={<Wallet size={IC} />}
              label="Total Netto Kas Disalurkan"
              value={fmt(grandTotalNetto)}
              sub="Kas Keluar Bersih via Bank Mitra"
              color={COLORS.blueDark}
            />
          </div>

          {/* 4. MATRIKS ALOKASI KAS KE BANK MITRA BAYAR & SURAT PERINTAH (SP) - Di-hide sementara sesuai arahan user, langsung ke List per MAK */}
          {false && (
            <div
              style={{
                background: COLORS.white,
                borderRadius: 10,
                border: `1px solid ${COLORS.gray200}`,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  padding: "14px 18px",
                  borderBottom: `1px solid ${COLORS.gray200}`,
                  background: "#F8FAFC",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={18} color={COLORS.blue} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.gray900 }}>
                      Alokasi Kebutuhan Kas Penyaluran ke Bank Mitra Bayar ({selectedBulan})
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 1 }}>
                      Dasar penerbitan Surat Perintah (SP) pemindahbukuan dana pensiun dari giro ASABRI ke rekening mitra bayar.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Btn
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setPreview({
                        title: `Rekapitulasi Penyaluran Kas Mitra Bayar — ${selectedBulan}`,
                        subtitle: `Kebutuhan Kas Penyaluran Pensiun via Bank Mitra`,
                        type: "table",
                        fileName: `Alokasi_Mitra_DAPEM_${selectedBulan}.xlsx`,
                        content: {
                          columns: ["No", "Mitra Bayar", "Jumlah Penerima", "Alokasi Netto Kas (Rp)", "Nomor Surat Perintah (SP)", "Tanggal Salur", "Status"],
                          rows: currentMitraList.map((m, idx) => [
                            idx + 1,
                            m.mitra,
                            `${fmtJiwa(m.penerima)} Jiwa`,
                            fmt(m.alokasiNetto),
                            m.noSP,
                            m.tglCair,
                            m.status
                          ]),
                          totalRows: currentMitraList.length
                        }
                      });
                    }}
                  >
                    <Download size={12} style={{ marginRight: 4 }} />
                    Ekspor Daftar SP
                  </Btn>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: COLORS.gray700, textAlign: "left" }}>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Mitra Bayar / Perbankan</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Jumlah Penerima</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "right" }}>Alokasi Kas Netto (Rp)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Surat Perintah (SP)</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}` }}>Status Likuiditas</th>
                      <th style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.gray200}`, textAlign: "center" }}>Aksi Dokumen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMitraList.map((m) => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontWeight: 800, color: COLORS.gray900 }}>{m.mitra}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 1 }}>{m.singkatan} • Rekening Giro Khusus Pensiun</div>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                          {fmtJiwa(m.penerima)} Jiwa
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, fontSize: 13 }}>
                          {fmt(m.alokasiNetto)}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontFamily: "monospace", fontWeight: 700, color: COLORS.blue }}>{m.noSP}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 1 }}>Tgl Salur: {m.tglCair}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span
                            style={{
                              fontSize: 11,
                              padding: "3px 8px",
                              borderRadius: 4,
                              background: "#ECFDF5",
                              color: "#065F46",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            <CheckCircle2 size={12} color="#059669" />
                            {m.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                          <Btn
                            size="xs"
                            variant="outline"
                            onClick={() => handleOpenSPPreview(m)}
                          >
                            <FileText size={12} style={{ marginRight: 4 }} />
                            Lihat SP Mitra
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#F8FAFC", borderTop: `2px solid ${COLORS.gray300}`, fontWeight: 800 }}>
                      <td style={{ padding: "12px 14px" }}>TOTAL PENYALURAN KAS KE SELURUH MITRA:</td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                        {fmtJiwa(currentMitraList.reduce((a, b) => a + b.penerima, 0))} Jiwa
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace", color: COLORS.blueDark, fontSize: 13.5 }}>
                        {fmt(currentMitraList.reduce((a, b) => a + b.alokasiNetto, 0))}
                      </td>
                      <td colSpan={3} style={{ padding: "12px 14px", color: "#065F46", fontSize: 11.5 }}>
                        ✅ Likuiditas Giro Mandiri &amp; BNI Siap Dibukukan
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 5. TABEL REKAPITULASI III RESMI PEMERINTAH (BERDASARKAN 4 MAK RESMI) */}
          <div style={{ background: COLORS.white, borderRadius: 10, padding: "20px 22px", border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.gray900 }}>
                  Rekapitulasi III Pertanggungjawaban Anggaran Pensiun (4 MAK Kemenkeu)
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 2 }}>
                  Alokasi beban belanja pensiun menurut Bagan Akun Standar (BAS) Kementerian Keuangan RI.
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedBNBAMAK(null);
                    setShowBNBAModal(true);
                  }}
                >
                  <Users size={13} style={{ marginRight: 4 }} />
                  Lihat Rincian Peserta (BNBA)
                </Btn>
                <Btn
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setPreview({
                      title: `Rekapitulasi III Pembayaran Pensiun — ${selectedBulan}`,
                      subtitle: `Format Resmi Laporan Keuangan Ditjen Perbendaharaan`,
                      type: "table",
                      fileName: `Rekap_III_${activeSubtab}_${selectedBulan}.xlsx`,
                      content: {
                        columns: ["No", "Kode MAK", "Kelompok Pensiun", "Total Jiwa", "Penerima Pokok", "Jumlah Bruto (Rp)", "Total Potongan (Rp)", "Jumlah Netto (Rp)"],
                        rows: currentDataset.map((d) => [
                          d.no,
                          d.kodeMAK,
                          d.namaKelompok,
                          `${fmtJiwa(d.totalJiwa.total)} Jiwa`,
                          `${fmtJiwa(d.totalJiwa.penerima)} Jiwa`,
                          fmt(d.totalBruto.total),
                          fmt(d.totalPotongan.total),
                          fmt(d.totalNetto)
                        ]),
                        totalRows: currentDataset.length
                      }
                    });
                  }}
                >
                  <Download size={13} style={{ marginRight: 4 }} />
                  Ekspor Rekap III
                </Btn>
              </div>
            </div>

            {/* ACCORDION PER MAK */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredMAKList.map((dapem) => {
                const isOpen = !!expandedDapem[dapem.kodeMAK];

                return (
                  <div key={dapem.kodeMAK} style={{ borderRadius: 8, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                    {/* Header Card MAK */}
                    <div
                      onClick={() => toggleExpand(dapem.kodeMAK)}
                      style={{
                        padding: "12px 18px",
                        background: "#F8FAFC",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: COLORS.blueDark, color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
                          {dapem.no}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13.5, color: COLORS.gray900 }}>
                            {dapem.namaKelompok}
                          </div>
                          <div style={{ fontSize: 11.5, color: COLORS.gray500, marginTop: 1 }}>
                            MAK: <b>{dapem.kodeMAK}</b> • {fmtJiwa(dapem.totalJiwa.total)} Total Jiwa ({fmtJiwa(dapem.totalJiwa.penerima)} Penerima Manfaat)
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 10, textTransform: "uppercase", color: COLORS.gray500, fontWeight: 700 }}>Total Bruto</div>
                          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{fmt(dapem.totalBruto.total)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 10, textTransform: "uppercase", color: COLORS.gray500, fontWeight: 700 }}>Potongan</div>
                          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "monospace", color: "#DC2626" }}>{fmt(dapem.totalPotongan.total)}</div>
                        </div>
                        <div style={{ textAlign: "right", background: COLORS.white, border: `1.5px solid ${COLORS.blueDark}`, padding: "4px 12px", borderRadius: 6 }}>
                          <div style={{ fontSize: 9.5, textTransform: "uppercase", color: COLORS.gray600, fontWeight: 800 }}>Jumlah Netto</div>
                          <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "monospace", color: COLORS.blueDark }}>{fmt(dapem.totalNetto)}</div>
                        </div>
                        <div style={{ fontSize: 13, color: COLORS.gray500, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Body Table MAK */}
                    {isOpen && (
                      <div style={{ overflowX: "auto", borderTop: `1px solid ${COLORS.gray200}` }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead>
                            <tr style={{ background: "#F1F5F9", color: COLORS.gray700 }}>
                              <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700 }}>Jenis Pensiun / Hak</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700 }}>Total Jiwa</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700 }}>Penerima</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700 }}>Beban Bruto (Rp)</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, color: "#DC2626" }}>Potongan (Rp)</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 800, color: COLORS.blueDark }}>Netto Disalurkan (Rp)</th>
                              <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700 }}>Rincian BNBA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dapem.jenisList.map((jenis, jIdx) => (
                              <tr key={jIdx} style={{ borderBottom: `1px solid ${COLORS.gray100}` }}>
                                <td style={{ padding: "10px 12px", fontWeight: 700, color: COLORS.gray900 }}>
                                  {jenis.nama}
                                  {jenis.deskripsi && (
                                    <div style={{ fontSize: 10.5, color: COLORS.gray500, fontWeight: 400 }}>{jenis.deskripsi}</div>
                                  )}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtJiwa(jenis.jiwa.total)} Jiwa
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmtJiwa(jenis.jiwa.penerima)} Jiwa
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace" }}>
                                  {fmt(jenis.bruto.total)}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", color: "#DC2626" }}>
                                  {fmt(jenis.potongan.total)}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: COLORS.blueDark, fontSize: 12.5 }}>
                                  {fmt(jenis.netto)}
                                </td>
                                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                  <Btn
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedBNBAMAK(`${dapem.namaKelompok} — ${jenis.nama}`);
                                      setShowBNBAModal(true);
                                    }}
                                  >
                                    <Eye size={11} style={{ marginRight: 3 }} />
                                    Detail Peserta
                                  </Btn>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
