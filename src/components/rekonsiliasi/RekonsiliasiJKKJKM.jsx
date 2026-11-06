import React, { useState } from "react";
import {
  Download,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Lock,
  ChevronDown,
  ChevronRight,
  FileText,
  X,
  FileCheck,
  Shield,
  ShieldCheck,
  Building2,
  Landmark,
  FileSpreadsheet
} from "lucide-react";

// =============================================================================
// REKONSILIASI PENERIMAAN DANA (JKK 0,62% & JKM 0,81%)
// Komponen yang mereplikasi 1:1 desain dan alur interaktif dari:
// Rekonsiliasi Penerimaan Dana — JKM-html (Plus Jakarta Sans, Modern Stepper, Drawer)
// =============================================================================

export const RekonsiliasiJKKJKM = ({
  initialProgram = "JKM", // "JKM" | "JKK"
  onSelectTHT,
  onSelectPensiun,
  onSelectExcelFormat,
  onOpenSuratPreview,
  onOpenBARPreview
}) => {
  // State Program aktif (JKM atau JKK)
  const [prog, setProg] = useState(initialProgram === "JKK" ? "JKK" : "JKM");
  const isJKM = prog === "JKM";
  const tarifStr = isJKM ? "0,81%" : "0,62%";

  // Dropdown Program switcher di header
  const [showProgDropdown, setShowProgDropdown] = useState(false);

  // Tab utama: 'A' (Penerimaan Dana) atau 'B' (Rekon Triwulan)
  const [tab, setTab] = useState("A");

  // Filter di Tab A: 'all' | 'wait' | 'cair'
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Accordion status per triwulan di Tab A
  const [openGroups, setOpenGroups] = useState({ 4: true, 3: true, 2: false, 1: false });

  // State penyimpanan per program
  const [savedJKM, setSavedJKM] = useState({});
  const [savedJKK, setSavedJKK] = useState({});
  const [issuedJKM, setIssuedJKM] = useState(false);
  const [issuedJKK, setIssuedJKK] = useState(false);

  // State Triwulan aktif di Tab B: 1 | 2 | 3 | 4
  const [selectedQuarter, setSelectedQuarter] = useState(3);
  // Wizard Step di Tab B: 1 | 2 | 3
  const [step, setStep] = useState(1);

  // Toast notification
  const [toast, setToast] = useState("");

  // Slide-over Drawer
  const [drawerRowId, setDrawerRowId] = useState(null);
  const [form, setForm] = useState({ sp2d: "", tgl: "", fT: "", fP: "" });

  // =========================================================================
  // HELPER FORMATTING & WARNA
  // =========================================================================
  const fmt = (n) =>
    Math.abs(Math.round(n || 0))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const sgn = (n) => (n < 0 ? "− " : n > 0 ? "+ " : "");
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const num = (s) => {
    const v = parseInt(String(s || "").replace(/\D/g, ""), 10);
    return isNaN(v) ? 0 : v;
  };

  const BL = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const dtx = (s) => {
    if (!s) return "";
    const p = s.split("-");
    if (p.length < 3) return s;
    return `${p[2]} ${BL[parseInt(p[1], 10) - 1]} ${p[0]}`;
  };

  const C = {
    kurang: "#9A4A00",
    lebih: "#0B4FB3",
    ok: "#136B3E",
    wait: "#46536A",
    none: "#5A6478",
    ready: "#FFFFFF"
  };

  const BG = {
    kurang: "#FFF1E0",
    lebih: "#E6F0FF",
    ok: "#E7F6EE",
    wait: "#EEF1F6",
    none: "#F3F4F6",
    ready: "#E07B00"
  };

  const getBadgeStyle = (k, lg = false) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: lg ? "8px 14px" : "4px 10px",
    borderRadius: 999,
    fontSize: lg ? 13 : 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
    background: BG[k] || "#EEF1F6",
    color: C[k] || "#46536A"
  });

  const dk = (d) => (d < 0 ? "kurang" : d > 0 ? "lebih" : "ok");
  const dtext = (d) => (d === 0 ? "Rp 0" : `${sgn(d)}Rp ${fmt(d)}`);
  const dshort = (d) => (d == null ? "—" : d === 0 ? "0" : sgn(d) + fmt(d));

  // =========================================================================
  // DATASET RESMI JKM (0,81%)
  // Diambil langsung dari acuan desain visual mockup
  // =========================================================================
  const ROWS_JKM_DEFAULT = [
    { id: "jan", q: 1, kind: "reg", per: "Januari 2026", st: "S-102/KU.06.05/KMR.N/I/2026", nd: "ND-12/PA.05.01/G/I/2026", tT: 13250000000, tP: 12810000000, sp2d: "SP2D-260109-000412", tgl: "09 Jan 2026", dT: 13250000000, dP: 12810000000 },
    { id: "feb", q: 1, kind: "reg", per: "Februari 2026", st: "S-388/KU.06.05/KMR.N/II/2026", nd: "ND-31/PA.05.01/G/II/2026", tT: 13270000000, tP: 12830000000, sp2d: "SP2D-260210-000987", tgl: "10 Feb 2026", dT: 13270000000, dP: 12830000000 },
    { id: "mar", q: 1, kind: "reg", per: "Maret 2026", st: "S-611/KU.06.05/KMR.N/III/2026", nd: "ND-44/PA.05.01/G/III/2026", tT: 13300000000, tP: 12850000000, sp2d: "SP2D-260309-001455", tgl: "09 Mar 2026", dT: 13300000000, dP: 12850000000 },
    { id: "apr", q: 2, kind: "reg", per: "April 2026", st: "S-860/KU.06.05/KMR.N/IV/2026", nd: "ND-54/PA.05.01/G/IV/2026", tT: 13400000000, tP: 12850000000, sp2d: "SP2D-260409-001902", tgl: "09 Apr 2026", dT: 13191728595, dP: 12856804992 },
    { id: "mei", q: 2, kind: "reg", per: "Mei 2026", st: "S-1123/KU.06.05/KMR.N/V/2026", nd: "ND-79/PA.05.01/G/V/2026", tT: 13480000000, tP: 12900000000, sp2d: "SP2D-260508-002377", tgl: "08 Mei 2026", dT: 13276670536, dP: 13140542239 },
    { id: "jun", q: 2, kind: "reg", per: "Juni 2026", st: "S-1339/KU.06.05/KMR.N/VI/2026", nd: "ND-102/PA.04.01/N/VI/2026", tT: 13600000000, tP: 12955012500, sp2d: "SP2D-260609-002810", tgl: "09 Jun 2026", dT: 13261288469, dP: 13181475419 },
    { id: "kr2", q: 2, kind: "kr", per: "Kekurangan TW II", st: "S-1530/KU.06.05/KMR.N/VII/2026", nd: "BAR-TW2/JKM/2026", tT: 750312400, tP: 0, sp2d: "SP2D-260721-003344", tgl: "21 Jul 2026", dT: 750312400, dP: 0 },
    { id: "jul", q: 3, kind: "reg", per: "Juli 2026", st: "S-1502/KU.06.05/KMR.N/VII/2026", nd: "ND-118/PA.05.01/G/VII/2026", tT: 13600000000, tP: 12960000000, sp2d: "SP2D-260728-004129", tgl: "28 Jul 2026", dT: 13600000000, dP: 12960000000 },
    { id: "agt", q: 3, kind: "reg", per: "Agustus 2026", st: "S-1733/KU.06.05/KMR.N/VIII/2026", nd: "ND-140/PA.05.01/G/VIII/2026", tT: 13620000000, tP: 12980000000, sp2d: "SP2D-260810-004602", tgl: "10 Agt 2026", dT: 13480000000, dP: 12980000000 },
    { id: "sep", q: 3, kind: "reg", per: "September 2026", st: "S-1958/KU.06.05/KMR.N/IX/2026", nd: "ND-163/PA.05.01/G/IX/2026", tT: 13650000000, tP: 13000000000, sp2d: "SP2D-260909-005077", tgl: "09 Sep 2026", dT: 13607600000, dP: 13035500000 },
    { id: "okt", q: 4, kind: "reg", per: "Oktober 2026", st: "S-2190/KU.06.05/KMR.N/X/2026", nd: "ND-181/PA.05.01/G/X/2026", tT: 13680000000, tP: 13020000000, sp2d: "SP2D-261009-005590", tgl: "09 Okt 2026", dT: 13680000000, dP: 13020000000 },
    { id: "nov", q: 4, kind: "reg", per: "November 2026", st: "S-2415/KU.06.05/KMR.N/XI/2026", nd: "ND-204/PA.05.01/G/XI/2026", tT: 13700000000, tP: 13050000000, sp2d: null, tgl: null, dT: null, dP: null }
  ];

  // =========================================================================
  // DATASET RESMI JKK (0,62%)
  // Proporsional tarif 0,62% terhadap Gaji Pokok APBN
  // =========================================================================
  const ROWS_JKK_DEFAULT = [
    { id: "jan", q: 1, kind: "reg", per: "Januari 2026", st: "S-101/KU.06.05/KMR.N/I/2026", nd: "ND-11/PA.05.01/G/I/2026", tT: 10140000000, tP: 9800000000, sp2d: "SP2D-260109-000388", tgl: "09 Jan 2026", dT: 10140000000, dP: 9800000000 },
    { id: "feb", q: 1, kind: "reg", per: "Februari 2026", st: "S-387/KU.06.05/KMR.N/II/2026", nd: "ND-30/PA.05.01/G/II/2026", tT: 10155000000, tP: 9815000000, sp2d: "SP2D-260210-000955", tgl: "10 Feb 2026", dT: 10155000000, dP: 9815000000 },
    { id: "mar", q: 1, kind: "reg", per: "Maret 2026", st: "S-610/KU.06.05/KMR.N/III/2026", nd: "ND-43/PA.05.01/G/III/2026", tT: 10178000000, tP: 9830000000, sp2d: "SP2D-260309-001420", tgl: "09 Mar 2026", dT: 10178000000, dP: 9830000000 },
    { id: "apr", q: 2, kind: "reg", per: "April 2026", st: "S-859/KU.06.05/KMR.N/IV/2026", nd: "ND-53/PA.05.01/G/IV/2026", tT: 10255000000, tP: 9830000000, sp2d: "SP2D-260409-001880", tgl: "09 Apr 2026", dT: 10095000000, dP: 9835000000 },
    { id: "mei", q: 2, kind: "reg", per: "Mei 2026", st: "S-1122/KU.06.05/KMR.N/V/2026", nd: "ND-78/PA.05.01/G/V/2026", tT: 10315000000, tP: 9870000000, sp2d: "SP2D-260508-002340", tgl: "08 Mei 2026", dT: 10160000000, dP: 10054000000 },
    { id: "jun", q: 2, kind: "reg", per: "Juni 2026", st: "S-1338/KU.06.05/KMR.N/VI/2026", nd: "ND-101/PA.04.01/N/VI/2026", tT: 10408000000, tP: 9912000000, sp2d: "SP2D-260609-002780", tgl: "09 Jun 2026", dT: 10149000000, dP: 10085000000 },
    { id: "kr2", q: 2, kind: "kr", per: "Kekurangan TW II", st: "S-1529/KU.06.05/KMR.N/VII/2026", nd: "BAR-TW2/JKK/2026", tT: 574000000, tP: 0, sp2d: "SP2D-260721-003310", tgl: "21 Jul 2026", dT: 574000000, dP: 0 },
    { id: "jul", q: 3, kind: "reg", per: "Juli 2026", st: "S-1501/KU.06.05/KMR.N/VII/2026", nd: "ND-117/PA.05.01/G/VII/2026", tT: 10408000000, tP: 9916000000, sp2d: "SP2D-260728-004128", tgl: "28 Jul 2026", dT: 10408000000, dP: 9916000000 },
    { id: "agt", q: 3, kind: "reg", per: "Agustus 2026", st: "S-1732/KU.06.05/KMR.N/VIII/2026", nd: "ND-139/PA.05.01/G/VIII/2026", tT: 10423000000, tP: 9931000000, sp2d: "SP2D-260810-004580", tgl: "10 Agt 2026", dT: 10316000000, dP: 9931000000 },
    { id: "sep", q: 3, kind: "reg", per: "September 2026", st: "S-1957/KU.06.05/KMR.N/IX/2026", nd: "ND-162/PA.05.01/G/IX/2026", tT: 10446000000, tP: 9946000000, sp2d: "SP2D-260909-005050", tgl: "09 Sep 2026", dT: 10413400000, dP: 9973200000 },
    { id: "okt", q: 4, kind: "reg", per: "Oktober 2026", st: "S-2189/KU.06.05/KMR.N/X/2026", nd: "ND-180/PA.05.01/G/X/2026", tT: 10469000000, tP: 9961000000, sp2d: "SP2D-261009-005570", tgl: "09 Okt 2026", dT: 10469000000, dP: 9961000000 },
    { id: "nov", q: 4, kind: "reg", per: "November 2026", st: "S-2414/KU.06.05/KMR.N/XI/2026", nd: "ND-203/PA.05.01/G/XI/2026", tT: 10485000000, tP: 9984000000, sp2d: null, tgl: null, dT: null, dP: null }
  ];

  // Aktifkan data sesuai program
  const rawRows = isJKM ? [...ROWS_JKM_DEFAULT] : [...ROWS_JKK_DEFAULT];
  const savedState = isJKM ? savedJKM : savedJKK;
  const isIssued = isJKM ? issuedJKM : issuedJKK;

  if (isIssued) {
    rawRows.push({
      id: "kr3",
      q: 3,
      kind: "kr",
      per: "Kekurangan TW III",
      st: isJKM ? "S-2468/KU.06.05/KMR.N/XI/2026" : "S-2467/KU.06.05/KMR.N/XI/2026",
      nd: `BAR-TW3/${prog}/2026`,
      tT: isJKM ? 182400000 : 139600000,
      tP: 0,
      sp2d: null,
      tgl: null,
      dT: null,
      dP: null
    });
  }

  // Terapkan update data yang disimpan dari Drawer
  const ROWS = rawRows.map((r) => {
    const s = savedState[r.id];
    return s ? { ...r, ...s } : r;
  });

  // Metadata Triwulan
  const QM = {
    1: {
      label: "Triwulan I",
      period: "Jan – Mar",
      periodLong: "Januari – Maret 2026",
      bar: `BAR-TW1/${prog}/2026`,
      history: ["TNI dan POLRI sesuai — tidak ada tindak lanjut."]
    },
    2: {
      label: "Triwulan II",
      period: "Apr – Jun",
      periodLong: "April – Juni 2026",
      bar: `BAR-TW2/${prog}/2026`,
      history: [
        `TNI kurang bayar Rp ${isJKM ? "750.312.400" : "574.000.000"} → Surat ${isJKM ? "S-1530" : "S-1529"}/KU.06.05/KMR.N/VII/2026 terbit 15 Jul 2026, dana cair 21 Jul 2026.`,
        `POLRI lebih bayar Rp ${isJKM ? "473.810.150" : "362.400.000"} → dikompensasi sebagai pengurang tagihan POLRI Juli & Agustus 2026.`
      ]
    },
    3: {
      label: "Triwulan III",
      period: "Jul – Sep",
      periodLong: "Juli – September 2026",
      bar: `BAR-TW3/${prog}/2026`,
      history: [
        `TNI kurang bayar Rp ${isJKM ? "182.400.000" : "139.600.000"} → Surat ${isJKM ? "S-2468" : "S-2467"}/KU.06.05/KMR.N/XI/2026 terbit 06 Nov 2026, menunggu dana cair.`,
        `POLRI lebih bayar Rp ${isJKM ? "35.500.000" : "27.200.000"} → dikompensasi sebagai pengurang tagihan POLRI Desember 2026.`
      ]
    },
    4: {
      label: "Triwulan IV",
      period: "Okt – Des",
      periodLong: "Oktober – Desember 2026",
      bar: ""
    }
  };

  // Status Triwulan
  const qInfo = (qi) => {
    const regs = ROWS.filter((r) => r.q === qi && r.kind === "reg");
    const done = regs.filter((r) => r.dT != null).length;
    const status =
      qi === 4
        ? "berjalan"
        : qi === 3 && !isIssued
        ? done === 3
          ? "siap"
          : "berjalan"
        : "selesai";
    return { regs, done, status };
  };

  const QI = { 1: qInfo(1), 2: qInfo(2), 3: qInfo(3), 4: qInfo(4) };
  const readyCount = [1, 2, 3, 4].filter((q) => QI[q].status === "siap").length;

  // View row helper
  const rowView = (r) => {
    const tag = r.tT + r.tP;
    const cair = r.dT != null;
    const dana = cair ? r.dT + r.dP : null;
    const diff = cair ? dana - tag : null;
    const locked =
      (QI[r.q].status === "selesai" && r.kind === "reg") ||
      (r.kind === "kr" && cair && r.q === 2);
    const sk = !cair ? "wait" : diff === 0 ? "ok" : dk(diff);
    const sl = !cair ? "Menunggu dana" : diff === 0 ? "Cair · cocok" : "Cair · selisih";

    return {
      id: r.id,
      per: r.per,
      st: r.st,
      nd: r.nd,
      cair,
      raw: r,
      kindLabel: r.kind === "kr" ? "Kekurangan · TNI" : "Reguler",
      kindStyle:
        r.kind === "kr"
          ? {
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              background: "#FFF1E0",
              color: "#9A4A00"
            }
          : {
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 6,
              background: "#EEF1F6",
              color: "#46536A"
            },
      tagText: fmt(tag),
      tagSplit: r.tP ? `TNI ${fmt(r.tT)} · POLRI ${fmt(r.tP)}` : `TNI ${fmt(r.tT)}`,
      sp2d: cair ? r.sp2d : "—",
      tgl: cair ? `Cair ${r.tgl}` : "Belum cair",
      danaText: cair ? fmt(dana) : "—",
      diffText: !cair ? "" : diff === 0 ? "sesuai tagihan" : `selisih ${sgn(diff)}${fmt(diff)}`,
      diffColor: !cair ? "#5A6478" : C[diff === 0 ? "ok" : dk(diff)],
      statusLabel: sl,
      statusBadge: getBadgeStyle(sk),
      canRecord: !cair,
      canEdit: cair && !locked,
      locked: cair && locked,
      rowStyle: {
        display: "grid",
        gridTemplateColumns: "170px minmax(230px, 1.4fr) 160px minmax(190px, 1fr) 180px 130px 170px",
        alignItems: "center",
        borderBottom: "1px solid #EEF1F6",
        fontVariantNumeric: "tabular-nums",
        background: !cair ? "#FFFDF8" : "#FFFFFF"
      },
      openDrawer: () => {
        setDrawerRowId(r.id);
        setForm({
          sp2d: r.sp2d || "",
          tgl: r.isoTgl || (cair ? "" : "2026-11-09"),
          fT: fmt(cair ? r.dT : r.tT),
          fP: fmt(cair ? r.dP : r.tP)
        });
      }
    };
  };

  const allRows = ROWS.map(rowView);
  const waitRows = allRows.filter((r) => !r.cair);
  const cairRows = allRows.filter((r) => r.cair);

  const groups = [4, 3, 2, 1].map((qi) => {
    const info = QI[qi];
    const m = QM[qi];
    let rows = allRows
      .filter((r) => r.raw.q === qi)
      .filter((r) => (filter === "all" ? true : filter === "wait" ? !r.cair : r.cair));

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.st.toLowerCase().includes(q) ||
          r.nd.toLowerCase().includes(q) ||
          r.sp2d.toLowerCase().includes(q) ||
          r.per.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => (b.raw.kind === "kr") - (a.raw.kind === "kr"));

    const badgeTuple =
      info.status === "siap"
        ? ["Siap direkon", "ready"]
        : info.status === "selesai"
        ? ["Selesai · BAR terkunci", "ok"]
        : ["Berjalan", "wait"];

    const note =
      info.status === "berjalan"
        ? `${info.done} dari 3 bulan cair${qi === 4 ? " · Desember belum ditagih" : ""}`
        : info.status === "siap"
        ? "Semua bulan sudah cair — buka tab Rekon Triwulan"
        : m.bar;

    const isOpen = Boolean(openGroups[qi]);

    return {
      qi,
      label: m.label,
      period: m.period,
      badge: badgeTuple[0],
      badgeStyle: getBadgeStyle(badgeTuple[1]),
      note,
      open: isOpen,
      caret: isOpen ? "▾" : "▸",
      rows,
      empty: rows.length === 0,
      toggle: () => setOpenGroups((prev) => ({ ...prev, [qi]: !isOpen }))
    };
  });

  // Data Rekon Tab B
  const curQMeta = QM[selectedQuarter];
  const curQInfo = QI[selectedQuarter];
  const curQCairRegs = curQInfo.regs.filter((r) => r.dT != null);

  const calcMatra = (name, tk, dkey) => {
    const t = sum(curQCairRegs.map((r) => r[tk]));
    const d = sum(curQCairRegs.map((r) => r[dkey]));
    const df = d - t;
    const k = dk(df);
    return {
      name,
      diff: df,
      tagText: fmt(t),
      danaText: fmt(d),
      diffText: dtext(df),
      diffColor: C[k],
      badgeStyle: getBadgeStyle(k),
      label: k === "ok" ? "Sesuai" : k === "kurang" ? "Kurang bayar" : "Lebih bayar",
      cardStyle: {
        borderRadius: 12,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        border: `1px solid ${k === "ok" ? "#BFE3CD" : k === "kurang" ? "#F5D3A6" : "#BCD3FA"}`,
        background: k === "ok" ? "#F4FBF7" : k === "kurang" ? "#FFFAF3" : "#F5F9FF"
      }
    };
  };

  const matraResults = [calcMatra("TNI", "tT", "dT"), calcMatra("POLRI", "tP", "dP")];

  const actions = matraResults
    .filter((x) => x.diff !== 0)
    .map((x) => {
      if (x.diff < 0) {
        return {
          tag: `${x.name} · KURANG BAYAR`,
          color: C.kurang,
          title: `Terbitkan Surat Tagihan Kekurangan Bayar — Rp ${fmt(x.diff)}`,
          desc: "Ke Kemenkeu RI (KPPN Khusus Jakarta II). Nomor surat dibuat otomatis; draf 3 halaman format resmi baku Kemenkeu RI sudah disiapkan sistem.",
          hasPreview: true,
          boxStyle: {
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            padding: "16px 18px",
            borderRadius: 12,
            border: "1px solid #F5D3A6",
            background: "#FFFAF3"
          },
          actionType: "surat",
          nominal: Math.abs(x.diff)
        };
      }
      return {
        tag: `${x.name} · LEBIH BAYAR`,
        color: C.lebih,
        title: `Kompensasi Rp ${fmt(x.diff)} ke tagihan ${x.name} berikutnya`,
        desc: `Dicatat sebagai pengurang tagihan ${x.name} Desember 2026. Tidak perlu surat.`,
        hasPreview: false,
        boxStyle: {
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid #BCD3FA",
          background: "#F5F9FF"
        },
        actionType: "kompensasi"
      };
    });

  const quarterBadgeTuple =
    curQInfo.status === "siap"
      ? ["Siap direkon", "ready"]
      : curQInfo.status === "selesai"
      ? ["Selesai · BAR terkunci", "ok"]
      : ["Berjalan", "wait"];

  const stepsList = [
    ["Review penerimaan", "3 bulan, read-only"],
    ["Hasil per matra", "Dihitung sistem"],
    ["Tindak lanjut", "Terbitkan & kunci"]
  ].map((s, i) => {
    const n = i + 1;
    const isCur = step === n;
    const isDone = step > n;
    return {
      n: isDone ? "✓" : String(n),
      title: s[0],
      sub: s[1],
      bg: isCur ? "#E8EEF9" : "#F5F7FB",
      color: isCur ? "#0B3B8C" : "#0F1B33",
      circleStyle: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 13,
        flexShrink: 0,
        background: isCur ? "#0B3B8C" : isDone ? "#1F9D5C" : "#FFFFFF",
        color: isCur || isDone ? "#FFFFFF" : "#5A6478",
        border: isCur || isDone ? "none" : "1px solid #D5DBE6"
      }
    };
  });

  // Drawer Validation & Calculations
  let activeDrawerRow = null;
  let drawerValidation = { title: "", desc: "", style: {} };
  let cannotSaveDrawer = true;

  if (drawerRowId) {
    activeDrawerRow = ROWS.find((x) => x.id === drawerRowId);
    if (activeDrawerRow) {
      const dT = num(form.fT);
      const dP = activeDrawerRow.tP > 0 ? num(form.fP) : 0;
      const dT0 = dT - activeDrawerRow.tT;
      const dP0 = dP - activeDrawerRow.tP;
      const tot = dT0 + dP0;
      const parts = [];
      if (dT0 !== 0) parts.push(`TNI ${sgn(dT0)}Rp ${fmt(dT0)}`);
      if (dP0 !== 0) parts.push(`POLRI ${sgn(dP0)}Rp ${fmt(dP0)}`);
      const k = tot === 0 && parts.length === 0 ? "ok" : dT0 < 0 || dP0 < 0 ? "kurang" : "lebih";

      drawerValidation = {
        title: parts.length ? "Ada selisih dengan tagihan" : "Sesuai tagihan",
        desc: parts.length
          ? `${parts.join(" · ")}. Tetap bisa disimpan; selisih akan dievaluasi saat rekon triwulan.`
          : "Dana yang diterima sama persis dengan nilai surat tagihan.",
        style: {
          borderRadius: 12,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          background: BG[k],
          color: C[k]
        }
      };
      cannotSaveDrawer = !(String(form.sp2d || "").trim() && form.tgl);
    }
  }

  // Handle Save Drawer
  const handleSaveDrawer = () => {
    if (!activeDrawerRow) return;
    const updateObj = {
      sp2d: form.sp2d,
      tgl: dtx(form.tgl),
      isoTgl: form.tgl,
      dT: num(form.fT),
      dP: activeDrawerRow.tP > 0 ? num(form.fP) : 0
    };

    if (isJKM) {
      setSavedJKM((prev) => ({ ...prev, [activeDrawerRow.id]: updateObj }));
    } else {
      setSavedJKK((prev) => ({ ...prev, [activeDrawerRow.id]: updateObj }));
    }

    setDrawerRowId(null);
    setToast(`Penerimaan ${activeDrawerRow.per} berhasil disimpan (SP2D: ${form.sp2d}).`);
  };

  // Handle Issue / Terbitkan Triwulan
  const handleIssueQuarter = () => {
    if (isJKM) {
      setIssuedJKM(true);
    } else {
      setIssuedJKK(true);
    }
    setStep(1);
    setOpenGroups((prev) => ({ ...prev, 3: true }));
    setToast(
      `Triwulan III berhasil dikunci! Surat Tagihan Kekurangan ${isJKM ? "S-2468" : "S-2467"}/KU.06.05/KMR.N/XI/2026 otomatis terbit dan masuk ke tab Penerimaan Dana sebagai Menunggu Dana.`
    );
  };

  // Switch program helper
  const handleSwitchProgram = (newProg) => {
    setProg(newProg);
    setShowProgDropdown(false);
    setToast(`Beralih ke tampilan Rekonsiliasi Iuran ${newProg} (${newProg === "JKK" ? "0,62%" : "0,81%"}).`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FB",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: "#0F1B33",
        fontSize: 14,
        margin: "-16px -16px 0 -16px",
        padding: "24px 32px 64px",
        position: "relative"
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ===================================================================
            HEADER: BREADCRUMB, TITLE & TOP ACTIONS
           =================================================================== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 13, color: "#5A6478" }}>Beranda › Keuangan › Administrasi Iuran Peserta</div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.3px", color: "#0F1B33" }}>
              Rekonsiliasi Penerimaan Dana
            </h1>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative" }}>
            {/* Program Dropdown Switcher */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowProgDropdown(!showProgDropdown)}
                style={{
                  height: 44,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "1px solid #D5DBE6",
                  background: "#FFFFFF",
                  color: "#0F1B33",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                {isJKM ? <ShieldCheck size={16} color="#0D9488" /> : <Shield size={16} color="#059669" />}
                <span>Iuran {prog} · {tarifStr}</span>
                <ChevronDown size={14} color="#5A6478" />
              </button>

              {showProgDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 6,
                    background: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E3E7EF",
                    boxShadow: "0 10px 25px rgba(15,27,51,0.15)",
                    zIndex: 100,
                    minWidth: 260,
                    overflow: "hidden",
                    padding: "6px"
                  }}
                >
                  <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#8A94A6", textTransform: "uppercase" }}>
                    Pilih Program Iuran:
                  </div>

                  <button
                    onClick={() => handleSwitchProgram("JKM")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "none",
                      background: isJKM ? "#F0FDFA" : "transparent",
                      color: isJKM ? "#0F766E" : "#0F1B33",
                      fontWeight: isJKM ? 800 : 600,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      textAlign: "left"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ShieldCheck size={15} color="#0D9488" />
                      4. Iuran JKM · 0,81%
                    </span>
                    {isJKM && <span style={{ fontSize: 11, fontWeight: 700, background: "#CCFBF1", padding: "2px 6px", borderRadius: 4 }}>Aktif</span>}
                  </button>

                  <button
                    onClick={() => handleSwitchProgram("JKK")}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "none",
                      background: !isJKM ? "#ECFDF5" : "transparent",
                      color: !isJKM ? "#065F46" : "#0F1B33",
                      fontWeight: !isJKM ? 800 : 600,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      textAlign: "left"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Shield size={15} color="#059669" />
                      3. Iuran JKK · 0,62%
                    </span>
                    {!isJKM && <span style={{ fontSize: 11, fontWeight: 700, background: "#D1FAE5", padding: "2px 6px", borderRadius: 4 }}>Aktif</span>}
                  </button>

                  <div style={{ height: 1, background: "#E3E7EF", margin: "6px 0" }} />

                  {onSelectTHT && (
                    <button
                      onClick={() => {
                        setShowProgDropdown(false);
                        onSelectTHT();
                      }}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "none",
                        background: "transparent",
                        color: "#0F1B33",
                        fontWeight: 600,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left"
                      }}
                    >
                      <Building2 size={15} color="#2563EB" />
                      1. Iuran THT · 3,25% (PFK)
                    </button>
                  )}

                  {onSelectPensiun && (
                    <button
                      onClick={() => {
                        setShowProgDropdown(false);
                        onSelectPensiun();
                      }}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "none",
                        background: "transparent",
                        color: "#0F1B33",
                        fontWeight: 600,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left"
                      }}
                    >
                      <Landmark size={15} color="#4F46E5" />
                      2. Iuran Pensiun · 4,75% (PFK)
                    </button>
                  )}

                  {onSelectExcelFormat && (
                    <button
                      onClick={() => {
                        setShowProgDropdown(false);
                        onSelectExcelFormat();
                      }}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "none",
                        background: "transparent",
                        color: "#059669",
                        fontWeight: 600,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left"
                      }}
                    >
                      <FileSpreadsheet size={15} color="#059669" />
                      Format Resmi ASABRI (Excel)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tahun Anggaran */}
            <button
              type="button"
              style={{
                height: 44,
                padding: "0 16px",
                borderRadius: 10,
                border: "1px solid #D5DBE6",
                background: "#FFFFFF",
                color: "#0F1B33",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              TA 2026 ▾
            </button>

            {/* Ekspor Format ASABRI */}
            <button
              type="button"
              onClick={onSelectExcelFormat}
              style={{
                height: 44,
                padding: "0 16px",
                borderRadius: 10,
                border: "1px solid #D5DBE6",
                background: "#FFFFFF",
                color: "#0F1B33",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <Download size={16} />
              Ekspor Format ASABRI
            </button>
          </div>
        </div>

        {/* ===================================================================
            TABS: PENERIMAAN DANA & REKON TRIWULAN
           =================================================================== */}
        <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: "1px solid #DCE2EC", flexWrap: "wrap" }}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "A"}
            onClick={() => setTab("A")}
            style={{
              height: 48,
              padding: "0 18px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: -1,
              color: tab === "A" ? "#0B3B8C" : "#5A6478",
              borderBottom: tab === "A" ? "3px solid #0B3B8C" : "3px solid transparent"
            }}
          >
            <span>Penerimaan Dana</span>
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background: "#EEF1F6",
                color: "#46536A"
              }}
            >
              {waitRows.length} menunggu
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "B"}
            onClick={() => {
              setTab("B");
              setSelectedQuarter(readyCount ? 3 : selectedQuarter);
              setStep(1);
            }}
            style={{
              height: 48,
              padding: "0 18px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: -1,
              color: tab === "B" ? "#0B3B8C" : "#5A6478",
              borderBottom: tab === "B" ? "3px solid #0B3B8C" : "3px solid transparent"
            }}
          >
            <span>Rekon Triwulan</span>
            {readyCount > 0 && (
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "#E07B00",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                {readyCount} siap direkon
              </span>
            )}
          </button>
        </div>

        {/* ===================================================================
            TOAST NOTIFIKASI
           =================================================================== */}
        {toast && (
          <div
            role="status"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#EEF8F2",
              border: "1px solid #BFE3CD",
              color: "#0E3F25",
              padding: "12px 16px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              animation: "fadeIn 0.2s ease"
            }}
          >
            <CheckCircle2 size={18} color="#136B3E" />
            <span style={{ flex: 1 }}>{toast}</span>
            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Tutup notifikasi"
              style={{
                width: 36,
                height: 32,
                border: "none",
                background: "transparent",
                color: "#0E3F25",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ===================================================================
            TAB A: PENERIMAAN DANA BULANAN
           =================================================================== */}
        {tab === "A" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* 3 Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E3E7EF", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 13, fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "#5A6478" }}>Menunggu dana cair</span>
                <span style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#0F1B33" }}>{waitRows.length} tagihan</span>
                <span style={{ fontSize: 12, color: "#5A6478", fontVariantNumeric: "tabular-nums" }}>
                  Rp {fmt(sum(waitRows.map((r) => r.raw.tT + r.raw.tP)))}
                </span>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #E3E7EF", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#5A6478" }}>Dana masuk TA 2026</span>
                <span style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#0F1B33" }}>
                  Rp {fmt(sum(cairRows.map((r) => r.raw.dT + r.raw.dP)))}
                </span>
                <span style={{ fontSize: 12, color: "#5A6478" }}>{cairRows.length} SP2D tercatat</span>
              </div>

              <div style={{ background: "#FFF6EA", border: "1px solid #F5D3A6", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#9A4A00" }}>Rekon triwulan</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#4A2A00" }}>
                  {readyCount > 0 ? "Triwulan III siap direkon" : "Tidak ada yang perlu direkon"}
                </span>
                {readyCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("B");
                      setSelectedQuarter(3);
                      setStep(1);
                    }}
                    style={{
                      height: 36,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "#E07B00",
                      color: "#FFFFFF",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <span>Mulai rekon</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Pencarian Bar */}
            <div style={{ display: "flex", justifycontent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { key: "all", label: "Semua" },
                  { key: "wait", label: `Menunggu dana (${waitRows.length})` },
                  { key: "cair", label: "Sudah cair" }
                ].map((f) => {
                  const on = filter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilter(f.key)}
                      style={{
                        height: 40,
                        padding: "0 14px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        border: on ? "1px solid #0B3B8C" : "1px solid #D5DBE6",
                        background: on ? "#0B3B8C" : "#FFFFFF",
                        color: on ? "#FFFFFF" : "#2B3548",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: "1px solid #D5DBE6",
                  background: "#FFFFFF",
                  minWidth: 280,
                  color: "#5A6478",
                  marginLeft: "auto"
                }}
              >
                <Search size={16} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari no. surat tagihan / SP2D"
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 14,
                    background: "transparent",
                    color: "#0F1B33"
                  }}
                />
              </label>
            </div>

            {/* Tabel Penerimaan Accordion per Triwulan */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E3E7EF", borderRadius: 14, overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ minWidth: 1120 }}>
                {/* Column Headers */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "170px minmax(230px, 1.4fr) 160px minmax(190px, 1fr) 180px 130px 170px",
                    background: "#F5F7FB",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#2B3548",
                    borderBottom: "1px solid #E3E7EF"
                  }}
                >
                  <div style={{ padding: "12px 16px" }}>Periode</div>
                  <div style={{ padding: "12px 16px" }}>Surat tagihan</div>
                  <div style={{ padding: "12px 16px", textAlign: "right" }}>Nilai tagihan (Rp)</div>
                  <div style={{ padding: "12px 16px" }}>SP2D / tgl cair</div>
                  <div style={{ padding: "12px 16px", textAlign: "right" }}>Dana masuk (Rp)</div>
                  <div style={{ padding: "12px 16px" }}>Status</div>
                  <div style={{ padding: "12px 16px" }} />
                </div>

                {/* Groups */}
                {groups.map((g) => (
                  <React.Fragment key={g.qi}>
                    {/* Header Group Accordion */}
                    <button
                      type="button"
                      onClick={g.toggle}
                      aria-expanded={g.open}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        border: "none",
                        borderBottom: "1px solid #E3E7EF",
                        background: "#FBFCFE",
                        cursor: "pointer",
                        textAlign: "left",
                        flexWrap: "wrap"
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#5A6478", width: 12, fontWeight: 700 }}>{g.caret}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0F1B33" }}>{g.label}</span>
                      <span style={{ fontSize: 13, color: "#5A6478" }}>{g.period}</span>
                      <span style={g.badgeStyle}>{g.badge}</span>
                      <span style={{ fontSize: 12, color: "#5A6478" }}>{g.note}</span>
                    </button>

                    {/* Rows */}
                    {g.open && (
                      <>
                        {g.rows.map((r) => (
                          <div key={r.id} style={r.rowStyle}>
                            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                              <span style={{ fontWeight: 700, color: "#0F1B33" }}>{r.per}</span>
                              <span style={r.kindStyle}>{r.kindLabel}</span>
                            </div>

                            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (onOpenSuratPreview) {
                                    onOpenSuratPreview({
                                      noSurat: r.st,
                                      tanggal: r.tgl,
                                      items: [{ jenis: `Iuran ${prog} (${tarifStr})`, nominal: `Rp ${r.tagText}` }],
                                      totalNominal: `Rp ${r.tagText}`
                                    });
                                  }
                                }}
                                style={{ fontSize: 13, fontWeight: 600, color: "#0B3B8C", textDecoration: "none", overflowWrap: "anywhere" }}
                              >
                                {r.st}
                              </a>
                              <span style={{ fontSize: 12, color: "#5A6478", overflowWrap: "anywhere" }}>Dasar: {r.nd}</span>
                            </div>

                            <div style={{ padding: "14px 16px", textAlign: "right", display: "flex", flexDirection: "column", gap: 3 }}>
                              <span style={{ fontWeight: 700, color: "#0F1B33" }}>{r.tagText}</span>
                              <span style={{ fontSize: 12, color: "#5A6478" }}>{r.tagSplit}</span>
                            </div>

                            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, overflowWrap: "anywhere", color: "#0F1B33" }}>{r.sp2d}</span>
                              <span style={{ fontSize: 12, color: "#5A6478" }}>{r.tgl}</span>
                            </div>

                            <div style={{ padding: "14px 16px", textAlign: "right", display: "flex", flexDirection: "column", gap: 3 }}>
                              <span style={{ fontWeight: 700, color: "#0F1B33" }}>{r.danaText}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: r.diffColor }}>{r.diffText}</span>
                            </div>

                            <div style={{ padding: "14px 16px" }}>
                              <span style={r.statusBadge}>{r.statusLabel}</span>
                            </div>

                            <div style={{ padding: "10px 16px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                              {r.canRecord && (
                                <button
                                  type="button"
                                  onClick={r.openDrawer}
                                  style={{
                                    height: 40,
                                    padding: "0 14px",
                                    borderRadius: 10,
                                    border: "none",
                                    background: "#0B3B8C",
                                    color: "#FFFFFF",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 2px 4px rgba(11,59,140,0.2)"
                                  }}
                                >
                                  Catat Penerimaan
                                </button>
                              )}

                              {r.canEdit && (
                                <button
                                  type="button"
                                  onClick={r.openDrawer}
                                  style={{
                                    height: 40,
                                    padding: "0 14px",
                                    borderRadius: 10,
                                    border: "1px solid #D5DBE6",
                                    background: "#FFFFFF",
                                    color: "#0B3B8C",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: "pointer"
                                  }}
                                >
                                  Ubah
                                </button>
                              )}

                              {r.locked && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A6478" }}>
                                  <Lock size={14} />
                                  Terkunci (BAR)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}

                        {g.empty && (
                          <div style={{ padding: 16, fontSize: 13, color: "#5A6478", borderBottom: "1px solid #EEF1F6" }}>
                            Tidak ada tagihan dengan filter ini.
                          </div>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: "#5A6478", lineHeight: 1.5 }}>
              Tagihan otomatis masuk ke daftar ini saat surat tagihan diterbitkan di menu Penagihan Iuran ke Kemenkeu. Surat tagihan kekurangan hasil rekon triwulan juga masuk ke sini.
            </p>
          </div>
        )}

        {/* ===================================================================
            TAB B: REKON TRIWULAN (EVALUASI 3 BULAN SEKALI)
           =================================================================== */}
        {tab === "B" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* 4 Quarter Selector Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {[1, 2, 3, 4].map((qi) => {
                const info = QI[qi];
                const m = QM[qi];
                const on = selectedQuarter === qi;
                const b =
                  info.status === "siap"
                    ? ["Siap direkon", "ready"]
                    : info.status === "selesai"
                    ? ["Selesai", "ok"]
                    : ["Berjalan", "wait"];
                const note =
                  info.status === "siap"
                    ? "Semua dana cair · perlu direkon"
                    : info.status === "selesai"
                    ? m.bar
                    : `${info.done} dari 3 bulan cair`;

                return (
                  <button
                    key={qi}
                    type="button"
                    onClick={() => {
                      setSelectedQuarter(qi);
                      setStep(1);
                    }}
                    aria-pressed={on}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: 16,
                      borderRadius: 14,
                      cursor: "pointer",
                      textAlign: "left",
                      background: "#FFFFFF",
                      border: on ? "2px solid #0B3B8C" : "2px solid #E3E7EF",
                      boxShadow: on ? "0 6px 18px rgba(11,59,140,0.12)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#0F1B33" }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: "#5A6478" }}>{m.period}</span>
                    </span>
                    <span style={getBadgeStyle(b[1])}>{b[0]}</span>
                    <span style={{ fontSize: 12, color: "#5A6478" }}>{note}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Panel Quarter Terpilih */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E3E7EF", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F1B33" }}>
                  Rekon {curQMeta.label} <span style={{ fontWeight: 500, color: "#5A6478" }}>· {curQMeta.periodLong}</span>
                </h2>
                <span style={getBadgeStyle(quarterBadgeTuple[1], true)}>{quarterBadgeTuple[0]}</span>
              </div>

              {/* KONDISI 1: SIAP DIREKON (WIZARD 3 LANGKAH) */}
              {curQInfo.status === "siap" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {/* Stepper Wizard Bar */}
                  <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {stepsList.map((s, idx) => (
                      <li
                        key={idx}
                        style={{
                          flex: "1 1 200px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 14px",
                          borderRadius: 12,
                          background: s.bg,
                          transition: "all 0.15s ease"
                        }}
                      >
                        <span style={s.circleStyle}>{s.n}</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.title}</span>
                          <span style={{ fontSize: 12, color: "#5A6478" }}>{s.sub}</span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  {/* STEP 1: REVIEW PENERIMAAN 3 BULAN */}
                  {step === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <p style={{ margin: 0, color: "#2B3548", lineHeight: 1.6 }}>
                        Periksa penerimaan 3 bulan di bawah. Data diambil dari tab Penerimaan Dana. Kalau ada yang salah, perbaiki di sana sebelum lanjut.
                      </p>

                      <div style={{ border: "1px solid #E3E7EF", borderRadius: 12, overflowX: "auto" }}>
                        <div style={{ minWidth: 900, fontVariantNumeric: "tabular-nums" }}>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "160px minmax(200px, 1.3fr) repeat(3, minmax(150px, 1fr))",
                              background: "#F5F7FB",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#2B3548"
                            }}
                          >
                            <div style={{ padding: "12px 16px" }}>Bulan / matra</div>
                            <div style={{ padding: "12px 16px" }}>SP2D</div>
                            <div style={{ padding: "12px 16px", textAlign: "right" }}>Tagihan (Rp)</div>
                            <div style={{ padding: "12px 16px", textAlign: "right" }}>Dana masuk (Rp)</div>
                            <div style={{ padding: "12px 16px", textAlign: "right" }}>Selisih (Rp)</div>
                          </div>

                          {curQCairRegs.map((m) => {
                            const df = m.dT + m.dP - (m.tT + m.tP);
                            const dfT = m.dT - m.tT;
                            const dfP = m.dP - m.tP;

                            return (
                              <React.Fragment key={m.id}>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "160px minmax(200px, 1.3fr) repeat(3, minmax(150px, 1fr))",
                                    borderTop: "1px solid #E3E7EF",
                                    fontWeight: 700,
                                    background: "#FFFFFF"
                                  }}
                                >
                                  <div style={{ padding: "12px 16px", color: "#0F1B33" }}>{m.per}</div>
                                  <div style={{ padding: "12px 16px", fontWeight: 500, fontSize: 13, color: "#5A6478" }}>
                                    {m.sp2d} · {m.tgl}
                                  </div>
                                  <div style={{ padding: "12px 16px", textAlign: "right", color: "#0F1B33" }}>{fmt(m.tT + m.tP)}</div>
                                  <div style={{ padding: "12px 16px", textAlign: "right", color: "#0F1B33" }}>{fmt(m.dT + m.dP)}</div>
                                  <div style={{ padding: "12px 16px", textAlign: "right", color: C[dk(df)] }}>{dshort(df)}</div>
                                </div>

                                {/* Sub-row TNI */}
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "160px minmax(200px, 1.3fr) repeat(3, minmax(150px, 1fr))",
                                    background: "#FAFBFD",
                                    borderTop: "1px solid #EEF1F6",
                                    fontSize: 13,
                                    color: "#2B3548"
                                  }}
                                >
                                  <div style={{ padding: "8px 16px 8px 28px", color: "#5A6478" }}>↳ TNI</div>
                                  <div style={{ padding: "8px 16px" }} />
                                  <div style={{ padding: "8px 16px", textAlign: "right" }}>{fmt(m.tT)}</div>
                                  <div style={{ padding: "8px 16px", textAlign: "right" }}>{fmt(m.dT)}</div>
                                  <div style={{ padding: "8px 16px", textAlign: "right", fontWeight: 600, color: C[dk(dfT)] }}>
                                    {dshort(dfT)}
                                  </div>
                                </div>

                                {/* Sub-row POLRI */}
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "160px minmax(200px, 1.3fr) repeat(3, minmax(150px, 1fr))",
                                    background: "#FAFBFD",
                                    borderTop: "1px solid #EEF1F6",
                                    fontSize: 13,
                                    color: "#2B3548"
                                  }}
                                >
                                  <div style={{ padding: "8px 16px 8px 28px", color: "#5A6478" }}>↳ POLRI</div>
                                  <div style={{ padding: "8px 16px" }} />
                                  <div style={{ padding: "8px 16px", textAlign: "right" }}>{fmt(m.tP)}</div>
                                  <div style={{ padding: "8px 16px", textAlign: "right" }}>{fmt(m.dP)}</div>
                                  <div style={{ padding: "8px 16px", textAlign: "right", fontWeight: 600, color: C[dk(dfP)] }}>
                                    {dshort(dfP)}
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          style={{
                            height: 44,
                            padding: "0 20px",
                            borderRadius: 10,
                            border: "none",
                            background: "#0B3B8C",
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: "0 2px 6px rgba(11,59,140,0.2)"
                          }}
                        >
                          <span>Lanjut: lihat hasil</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: HASIL PER MATRA */}
                  {step === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                        {matraResults.map((x) => (
                          <div key={x.name} style={x.cardStyle}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16, fontWeight: 800, color: "#0F1B33" }}>{x.name}</span>
                              <span style={x.badgeStyle}>{x.label}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#2B3548" }}>
                              <span>Tagihan 3 bulan</span>
                              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>Rp {x.tagText}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#2B3548" }}>
                              <span>Dana masuk 3 bulan</span>
                              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>Rp {x.danaText}</span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                paddingTop: 10,
                                borderTop: "1px solid rgba(0,0,0,0.08)"
                              }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F1B33" }}>Selisih</span>
                              <span style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: x.diffColor }}>
                                {x.diffText}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p style={{ margin: 0, fontSize: 13, color: "#5A6478", lineHeight: 1.5 }}>
                        Dihitung per matra karena iuran TNI dan POLRI dibayar dari DIPA yang berbeda, jadi selisihnya tidak saling mengurangi.
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          style={{
                            height: 44,
                            padding: "0 18px",
                            borderRadius: 10,
                            border: "1px solid #D5DBE6",
                            background: "#FFFFFF",
                            color: "#0F1B33",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8
                          }}
                        >
                          <ArrowLeft size={16} />
                          <span>Kembali</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          style={{
                            height: 44,
                            padding: "0 20px",
                            borderRadius: 10,
                            border: "none",
                            background: "#0B3B8C",
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: "0 2px 6px rgba(11,59,140,0.2)"
                          }}
                        >
                          <span>Lanjut: tindak lanjut</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: TINDAK LANJUT */}
                  {step === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {actions.map((a, idx) => (
                        <div key={idx} style={a.boxStyle}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 360px", minWidth: 0 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: a.color }}>{a.tag}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#0F1B33" }}>{a.title}</span>
                            <span style={{ fontSize: 13, color: "#2B3548", lineHeight: 1.5 }}>{a.desc}</span>
                          </div>

                          {a.hasPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                if (onOpenSuratPreview) {
                                  onOpenSuratPreview({
                                    noSurat: isJKM ? "S-2468/KU.06.05/KMR.N/XI/2026" : "S-2467/KU.06.05/KMR.N/XI/2026",
                                    tanggal: "06 November 2026",
                                    items: [
                                      {
                                        jenis: `Kekurangan Iuran ${prog} (${tarifStr}) Triwulan III`,
                                        nominal: `Rp ${fmt(a.nominal)}`
                                      }
                                    ],
                                    totalNominal: `Rp ${fmt(a.nominal)}`
                                  });
                                }
                              }}
                              style={{
                                height: 40,
                                padding: "0 14px",
                                borderRadius: 10,
                                border: "1px solid #D5DBE6",
                                background: "#FFFFFF",
                                color: "#0B3B8C",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6
                              }}
                            >
                              <FileText size={14} />
                              <span>Pratinjau surat (3 hal)</span>
                            </button>
                          )}
                        </div>
                      ))}

                      <div
                        style={{
                          background: "#F5F7FB",
                          borderRadius: 12,
                          padding: "16px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          fontSize: 13,
                          color: "#2B3548",
                          lineHeight: 1.5
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "#0F1B33", fontSize: 14 }}>Setelah Anda klik Terbitkan:</span>
                        <span>• Surat tagihan kekurangan terbit dan otomatis masuk ke tab Penerimaan Dana dengan status Menunggu Dana.</span>
                        <span>• Kompensasi lebih bayar dicatat sebagai pengurang tagihan berikutnya.</span>
                        <span>• BAR triwulan dibuat dan data penerimaan triwulan ini dikunci.</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          style={{
                            height: 44,
                            padding: "0 18px",
                            borderRadius: 10,
                            border: "1px solid #D5DBE6",
                            background: "#FFFFFF",
                            color: "#0F1B33",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8
                          }}
                        >
                          <ArrowLeft size={16} />
                          <span>Kembali</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleIssueQuarter}
                          style={{
                            height: 44,
                            padding: "0 20px",
                            borderRadius: 10,
                            border: "none",
                            background: "#E07B00",
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(224,123,0,0.3)"
                          }}
                        >
                          Terbitkan &amp; kunci {curQMeta.label}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* KONDISI 2: SELESAI DIREKON (BAR SAH & TERKUNCI) */}
              {curQInfo.status === "selesai" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                    {matraResults.map((x) => (
                      <div key={x.name} style={x.cardStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#0F1B33" }}>{x.name}</span>
                          <span style={x.badgeStyle}>{x.label}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: 13, color: "#2B3548" }}>Selisih</span>
                          <span style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: x.diffColor }}>
                            {x.diffText}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ border: "1px solid #E3E7EF", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0F1B33" }}>Tindak lanjut</span>
                    {(curQMeta.history || []).map((h, i) => (
                      <span key={i} style={{ fontSize: 13, color: "#2B3548", lineHeight: 1.5 }}>
                        • {h}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenBARPreview) {
                          onOpenBARPreview({
                            noBAR: curQMeta.bar,
                            hariTanggal: "Selasa, 14 Juli 2026",
                            programJudul: `REKONSILIASI IURAN ${prog} (${tarifStr})`,
                            periode: curQMeta.periodLong
                          });
                        }
                      }}
                      style={{
                        height: 44,
                        padding: "0 16px",
                        borderRadius: 10,
                        border: "1px solid #D5DBE6",
                        background: "#FFFFFF",
                        color: "#0F1B33",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      <FileCheck size={16} color="#059669" />
                      <span>Unduh {curQMeta.bar}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTab("A")}
                      style={{
                        height: 44,
                        padding: "0 16px",
                        borderRadius: 10,
                        border: "1px solid #D5DBE6",
                        background: "#FFFFFF",
                        color: "#0B3B8C",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8
                      }}
                    >
                      <span>Lihat di Penerimaan Dana</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* KONDISI 3: BERJALAN (BELUM BISA DIREKON) */}
              {curQInfo.status === "berjalan" && (
                <div
                  style={{
                    background: "#F5F7FB",
                    borderRadius: 12,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    alignItems: "flex-start"
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#0F1B33" }}>Belum bisa direkon</span>
                  <span style={{ color: "#2B3548", lineHeight: 1.5 }}>
                    Rekon terbuka otomatis setelah dana ketiga bulan cair. Saat ini {curQInfo.done} dari 3 bulan sudah cair.
                  </span>

                  <div style={{ width: "100%", maxWidth: 420, height: 8, borderRadius: 999, background: "#E3E7EF", overflow: "hidden" }}>
                    <div style={{ height: 8, background: "#0B3B8C", width: `${Math.round((curQInfo.done / 3) * 100)}%` }} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setTab("A")}
                    style={{
                      height: 44,
                      padding: "0 16px",
                      borderRadius: 10,
                      border: "none",
                      background: "#0B3B8C",
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      marginTop: 4
                    }}
                  >
                    Catat penerimaan di tab Penerimaan Dana
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          SLIDE-OVER DRAWER: CATAT PENERIMAAN DANA
         =================================================================== */}
      {drawerRowId && activeDrawerRow && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerRowId(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 27, 51, 0.45)",
              zIndex: 40,
              animation: "fadeIn 0.2s ease"
            }}
          />

          {/* Drawer Box */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Catat penerimaan dana"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 480,
              maxWidth: "100%",
              background: "#FFFFFF",
              zIndex: 50,
              overflowY: "auto",
              boxShadow: "-12px 0 32px rgba(15, 27, 51, 0.18)",
              display: "flex",
              flexDirection: "column",
              animation: "slideInRight 0.25s ease"
            }}
          >
            {/* Header Drawer */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E3E7EF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#0F1B33" }}>Catat Penerimaan Dana</span>
                <span style={{ fontSize: 13, color: "#5A6478" }}>{activeDrawerRow.per}</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerRowId(null)}
                aria-label="Tutup"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: "1px solid #D5DBE6",
                  background: "#FFFFFF",
                  fontSize: 18,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5A6478"
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
              {/* Tagihan Otomatis Card */}
              <div style={{ background: "#F5F7FB", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", fontWeight: 700, letterSpacing: 0.6, color: "#5A6478" }}>
                  TAGIHAN (OTOMATIS)
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#5A6478" }}>No. surat</span>
                  <span style={{ fontWeight: 600, textAlign: "right", color: "#0F1B33", overflowWrap: "anywhere" }}>
                    {activeDrawerRow.st}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#5A6478" }}>Dasar</span>
                  <span style={{ fontWeight: 600, textAlign: "right", color: "#0F1B33" }}>{activeDrawerRow.nd}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#5A6478" }}>Nilai tagihan</span>
                  <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#0F1B33" }}>
                    Rp {fmt(activeDrawerRow.tT + activeDrawerRow.tP)}
                  </span>
                </div>
              </div>

              {/* No. SP2D Input */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#0F1B33" }}>
                <span>No. SP2D</span>
                <input
                  type="text"
                  value={form.sp2d}
                  onChange={(e) => setForm((prev) => ({ ...prev, sp2d: e.target.value }))}
                  placeholder="mis. SP2D-261109-004511"
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid #C9D1DE",
                    padding: "0 12px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#0F1B33"
                  }}
                />
              </label>

              {/* Tanggal Dana Cair Input */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#0F1B33" }}>
                <span>Tanggal dana cair</span>
                <input
                  type="date"
                  value={form.tgl}
                  onChange={(e) => setForm((prev) => ({ ...prev, tgl: e.target.value }))}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid #C9D1DE",
                    padding: "0 12px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#0F1B33"
                  }}
                />
              </label>

              {/* Dana Diterima TNI */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#0F1B33" }}>
                <span>Dana diterima TNI (Rp)</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.fT}
                  onChange={(e) => setForm((prev) => ({ ...prev, fT: e.target.value }))}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid #C9D1DE",
                    padding: "0 12px",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    color: "#0F1B33"
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#5A6478" }}>
                  Tagihan TNI: Rp {fmt(activeDrawerRow.tT)}
                </span>
              </label>

              {/* Dana Diterima POLRI */}
              {activeDrawerRow.tP > 0 && (
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#0F1B33" }}>
                  <span>Dana diterima POLRI (Rp)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.fP}
                    onChange={(e) => setForm((prev) => ({ ...prev, fP: e.target.value }))}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      border: "1px solid #C9D1DE",
                      padding: "0 12px",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                      color: "#0F1B33"
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#5A6478" }}>
                    Tagihan POLRI: Rp {fmt(activeDrawerRow.tP)}
                  </span>
                </label>
              )}

              {/* Validation Preview Box */}
              <div style={drawerValidation.style}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{drawerValidation.title}</span>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{drawerValidation.desc}</span>
              </div>

              {/* Attachment Mock */}
              <div
                style={{
                  border: "1.5px dashed #C9D1DE",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F1B33" }}>Lampirkan bukti SP2D (opsional)</span>
                <span style={{ fontSize: 12, color: "#5A6478" }}>PDF/JPG, maks. 5 MB</span>
                <button
                  type="button"
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: "1px solid #D5DBE6",
                    background: "#FFFFFF",
                    color: "#0B3B8C",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Pilih file
                </button>
              </div>
            </div>

            {/* Footer Drawer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #E3E7EF", display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setDrawerRowId(null)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 10,
                  border: "1px solid #D5DBE6",
                  background: "#FFFFFF",
                  color: "#0F1B33",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveDrawer}
                disabled={cannotSaveDrawer}
                style={{
                  flex: 2,
                  height: 44,
                  borderRadius: 10,
                  border: "none",
                  background: cannotSaveDrawer ? "#94A3B8" : "#0B3B8C",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: cannotSaveDrawer ? "not-allowed" : "pointer",
                  boxShadow: cannotSaveDrawer ? "none" : "0 2px 6px rgba(11,59,140,0.25)"
                }}
              >
                Simpan Penerimaan
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

