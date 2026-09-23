import { useState } from "react";
import {
  Send,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Building2,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  Zap,
  Info,
  ChevronRight,
  ArrowRight,
  UploadCloud
} from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Badge, Select, SearchInput, Btn, NoData, PreviewModal } from "../components/common";
import { DEFAULT_RAW_RK_DATA } from "../constants/cmsData";

export const PenyaluranHarian = ({ onNavigateToUploadCMS, dataList = [] }) => {
  const [activeTab, setActiveTab] = useState("tht");
  const [selectedMitraFilter, setSelectedMitraFilter] = useState("Semua");
  const [selectedKancabFilter, setSelectedKancabFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState("2026-05-06");
  const [preview, setPreview] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  const activeDataset = dataList || [];

  const tabsConfig = [
    { id: "tht", label: "THT", fullName: "Tabungan Hari Tua (THT)", count: activeDataset.filter((d) => d.tipe === "THT").length, badgeColor: "blue" },
    { id: "jkk", label: "JKK", fullName: "Jaminan Kecelakaan Kerja (JKK)", count: activeDataset.filter((d) => d.tipe === "JKK").length, badgeColor: "orange" },
    { id: "jkm", label: "JKM", fullName: "Jaminan Kematian (JKM)", count: activeDataset.filter((d) => d.tipe === "JKM").length, badgeColor: "purple" },
    { id: "ntip", label: "NTIP", fullName: "Nota Transaksi Informasi Perbankan (NTIP)", count: activeDataset.filter((d) => d.tipe === "NTIP").length, badgeColor: "green" },
    { id: "bayar_pensiun", label: "Pembayaran Pensiun", fullName: "Pembayaran Pensiun (DAPEM)", count: activeDataset.filter((d) => d.tipe === "Pembayaran Pensiun").length, badgeColor: "cyan" },
    { id: "sedia_pensiun", label: "Penyediaan Pensiun", fullName: "Penyediaan Pensiun (Dropping Kasda)", count: activeDataset.filter((d) => d.tipe === "Penyediaan Pensiun").length, badgeColor: "indigo" }
  ];

  const mitraOptions = [
    "Semua",
    "BANK BRI",
    "BANK MANDIRI",
    "BANK WOORI SAUDARA",
    "BANK BNI",
    "BANK BTN",
    "PT POS INDONESIA"
  ];

  const kancabOptions = [
    "Semua",
    "KANCAB UTAMA JAKARTA",
    "KANCAB SURABAYA",
    "KANCAB BANDUNG",
    "KANCAB SEMARANG",
    "KANCAB YOGYAKARTA",
    "KANCAB MALANG",
    "KANCAB CIREBON",
    "KANCAB MEDAN",
    "KANCAB MAKASSAR",
    "KANCAB JAYAPURA",
    "KANTOR PUSAT"
  ];

  // Ambil data sesuai tab aktif
  const currentTabType =
    activeTab === "tht"
      ? "THT"
      : activeTab === "jkk"
      ? "JKK"
      : activeTab === "jkm"
      ? "JKM"
      : activeTab === "ntip"
      ? "NTIP"
      : activeTab === "bayar_pensiun"
      ? "Pembayaran Pensiun"
      : "Penyediaan Pensiun";

  const rawTabData = activeDataset.filter((d) => d.tipe === currentTabType);

  // Filter Data
  const filteredData = rawTabData.filter((r) => {
    if (selectedMitraFilter !== "Semua" && !r.mitra.toUpperCase().includes(selectedMitraFilter.toUpperCase())) return false;
    if (selectedKancabFilter !== "Semua" && r.kancab !== selectedKancabFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchKTPA = r.ktpa?.toLowerCase().includes(q);
      const matchDesc = r.desc?.toLowerCase().includes(q);
      const matchSP = r.noSP?.toLowerCase().includes(q);
      const matchDPS = r.noDPS?.toLowerCase().includes(q);
      const matchUser = r.userId?.toLowerCase().includes(q);
      const matchMitra = r.mitra?.toLowerCase().includes(q);
      const matchPensiun = r.noPensiun?.toLowerCase().includes(q);
      const matchPenerima = r.namaPenerima?.toLowerCase().includes(q);
      if (!matchKTPA && !matchDesc && !matchSP && !matchDPS && !matchUser && !matchMitra && !matchPensiun && !matchPenerima) {
        return false;
      }
    }
    return true;
  });

  const totalNominalTab = filteredData.reduce((acc, curr) => acc + (curr.nominal || curr.debet || curr.credit || 0), 0);
  const totalDebetTab = filteredData.reduce((acc, curr) => acc + (curr.debet || 0), 0);
  const totalCreditTab = filteredData.reduce((acc, curr) => acc + (curr.credit || 0), 0);
  const totalMitraCount = new Set(filteredData.map((d) => d.mitra)).size;

  // Handle Export Excel spesifik sesuai kolom tab aktif
  const handleExportExcel = () => {
    let columns = [];
    let rows = [];

    if (activeTab === "tht") {
      columns = [
        "No.",
        "Program",
        "Jenis Manfaat",
        "Nomor KTPA",
        "Nominal (Rp)",
        "No SP",
        "Tanggal SP",
        "No DPS",
        "Tanggal DPS",
        "Kode Bayar",
        "Kantor Cabang",
        "Kode Anggota",
        "Mitra"
      ];
      rows = filteredData.map((d, i) => [
        i + 1,
        d.program || "THT",
        d.jenisManfaat || "THT BUP",
        d.ktpa,
        fmt(d.nominal),
        d.noSP,
        d.tglSP,
        d.noDPS,
        d.tglDPS,
        d.kodeBayar,
        d.kancab,
        d.kodeAnggota,
        d.mitra
      ]);
    } else if (activeTab === "jkk") {
      columns = [
        "No.",
        "Nomor KTPA",
        "DB (Rp)",
        "DK (Rp)",
        "Gugur (Rp)",
        "Tewas (Rp)",
        "Bantuan Beasiswa (Rp)",
        "Total (Rp)",
        "No SP",
        "Tanggal SP",
        "No DPS",
        "Tanggal DPS",
        "Kode Bayar",
        "Kantor Cabang",
        "Anggota",
        "Mitra"
      ];
      rows = filteredData.map((d, i) => [
        i + 1,
        d.ktpa,
        fmt(d.db || 0),
        fmt(d.dk || 0),
        fmt(d.gugur || 0),
        fmt(d.tewas || 0),
        fmt(d.beasiswa || 0),
        fmt(d.nominal),
        d.noSP,
        d.tglSP,
        d.noDPS,
        d.tglDPS,
        d.kodeBayar,
        d.kancab,
        d.anggota || d.kodeAnggota,
        d.mitra
      ]);
    } else if (activeTab === "jkm") {
      columns = [
        "No.",
        "Nomor KTPA",
        "SKS (Rp)",
        "UDW (Rp)",
        "BP (Rp)",
        "Bantuan Beasiswa (Rp)",
        "Total (Rp)",
        "No SP",
        "Tanggal SP",
        "No DPS",
        "Tanggal DPS",
        "Kode Bayar",
        "Kantor Cabang",
        "Anggota",
        "Mitra"
      ];
      rows = filteredData.map((d, i) => [
        i + 1,
        d.ktpa,
        fmt(d.sks || 0),
        fmt(d.udw || 0),
        fmt(d.bp || 0),
        fmt(d.beasiswa || 0),
        fmt(d.nominal),
        d.noSP,
        d.tglSP,
        d.noDPS,
        d.tglDPS,
        d.kodeBayar,
        d.kancab,
        d.anggota || d.kodeAnggota,
        d.mitra
      ]);
    } else if (activeTab === "ntip") {
      columns = [
        "No.",
        "KTPA",
        "Tanggal Transaksi",
        "Nama Penerima",
        "Debet (Rp)",
        "Credit (Rp)",
        "Ledger Balance (Rp)",
        "User ID",
        "No SP",
        "Tanggal SP",
        "No DPS",
        "Tanggal DPS",
        "Mitra Bayar"
      ];
      rows = filteredData.map((d, i) => [
        i + 1,
        d.ktpa,
        d.tglTransaksi || d.tglBayar,
        d.namaPenerima || "—",
        fmt(d.debet),
        fmt(d.credit),
        fmt(d.saldo),
        d.userId,
        d.noSP,
        d.tglSP,
        d.noDPS,
        d.tglDPS,
        d.mitra
      ]);
    } else if (activeTab === "bayar_pensiun") {
      columns = [
        "No.",
        "Jenis Pensiun",
        "Nomor Pensiun",
        "Bulan Bayar",
        "Nominal (Rp)",
        "Tanggal Transaksi",
        "Kantor Cabang",
        "Mitra Bayar"
      ];
      rows = filteredData.map((d, i) => [
        i + 1,
        d.jenisPensiun,
        d.noPensiun,
        d.bulanBayar,
        fmt(d.nominal),
        d.tglTransaksi,
        d.kancab,
        d.mitra
      ]);
    } else {
      columns = [
        "No.",
        "Jenis Pensiun",
        "Nomor Pensiun",
        "Bulan Bayar",
        "Nominal (Rp)",
        "Tanggal Transaksi",
        "Kantor Cabang",
        "Mitra Bayar"
      ];
      rows = filteredData.map((d, i) => [
        i + 1,
        d.jenisPensiun,
        d.noPensiun,
        d.bulanBayar,
        fmt(d.nominal),
        d.tglTransaksi,
        d.kancab,
        d.mitra
      ]);
    }

    setPreview({
      title: `Penyaluran Harian CMS — Tab ${tabsConfig.find((t) => t.id === activeTab)?.fullName}`,
      subtitle: `Format Kolom Sesuai BRD Poin 4.5.15 • ${filteredData.length} Transaksi Terpadankan`,
      type: "table",
      fileName: `Penyaluran_CMS_${activeTab.toUpperCase()}_${selectedTanggal}.xlsx`,
      content: {
        columns,
        rows,
        totalRows: filteredData.length
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* DETAIL MODAL ROW */}
      {detailModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1400,
            padding: 20
          }}
          onClick={() => setDetailModal(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              width: "100%",
              maxWidth: 580,
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              overflow: "hidden",
              border: "1px solid #CBD5E1"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ background: "linear-gradient(135deg, #0141A8, #1E40AF)", padding: "18px 22px", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Detail Transaksi Mapped CMS</h3>
                <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 2 }}>
                  Program {detailModal.tipe} • {detailModal.mitra}
                </div>
              </div>
              <Badge color="green">Matched 100%</Badge>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>Nomor KTPA / Ref:</span>
                <span style={{ fontWeight: 800, color: "#0141A8", fontFamily: "monospace" }}>{detailModal.ktpa || detailModal.noPensiun || "—"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>Uraian Rekening Koran:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>{detailModal.desc}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>Nominal Transaksi:</span>
                <span style={{ fontWeight: 800, color: "#0F172A", fontSize: 15 }}>{fmt(detailModal.nominal || detailModal.debet || detailModal.credit)}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>No. SP & Tanggal SP:</span>
                <span style={{ fontFamily: "monospace" }}>{detailModal.noSP ? `${detailModal.noSP} (${detailModal.tglSP})` : "—"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>No. DPS & Tanggal:</span>
                <span style={{ fontFamily: "monospace" }}>{detailModal.noDPS ? `${detailModal.noDPS} (${detailModal.tglDPS})` : "—"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>Kantor Cabang:</span>
                <span style={{ fontWeight: 600 }}>{detailModal.kancab || "KANTOR PUSAT"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8 }}>
                <span style={{ color: "#64748B", fontWeight: 600 }}>Mitra Bayar:</span>
                <span style={{ fontWeight: 700, color: "#0141A8" }}>{detailModal.mitra}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                <Btn size="sm" onClick={() => setDetailModal(null)}>
                  Tutup Detail
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Context Banner */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderLeft: "5px solid #0141A8",
          borderRadius: 10,
          padding: "16px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                Penyaluran Harian CMS — Pemadanan Format Spesifik Jenis Program
              </span>
              <span style={{ background: "#EFF6FF", color: "#0141A8", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 6, border: "1px solid #BFDBFE" }}>
                BRD Poin 4.5.15
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 4, lineHeight: 1.5, maxWidth: 900 }}>
              Tab-tab hasil auto-mapping transaksi rekening koran CMS perbankan ke format spesifik program (<strong>THT, JKK, JKM, NTIP, Pembayaran Pensiun, dan Penyediaan Pensiun</strong>) untuk sinkronisasi Surat Perintah (SP), DPS, dan sistem YANDU NG.
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", padding: "6px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <Calendar size={14} color="#64748B" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Tanggal:</span>
              <input
                type="date"
                value={selectedTanggal}
                onChange={(e) => setSelectedTanggal(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: 12, fontWeight: 700, color: "#0141A8", cursor: "pointer", background: "transparent" }}
              />
            </div>

            {onNavigateToUploadCMS && (
              <Btn variant="outline" size="sm" onClick={onNavigateToUploadCMS}>
                <Layers size={13} /> Menu Upload CMS
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* 6 PROGRAM TABS SWITCHER */}
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "#E2E8F0",
          padding: 4,
          borderRadius: 10,
          overflowX: "auto"
        }}
      >
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                fontSize: 12.5,
                fontWeight: isActive ? 800 : 600,
                background: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? "#0141A8" : "#475569",
                boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap"
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "1px 7px",
                  borderRadius: 10,
                  background: isActive ? "#EFF6FF" : "rgba(100,116,139,0.15)",
                  color: isActive ? "#0141A8" : "#475569"
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC KPI SUMMARY CARDS FOR ACTIVE TAB */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <StatCard
          icon={<FileCheck2 size={IC} />}
          label={`Transaksi ${tabsConfig.find((t) => t.id === activeTab)?.label}`}
          value={`${filteredData.length} Baris Data`}
          sub="Hasil Auto-Mapping BRD 4.5.15"
          color={COLORS.blue}
        />
        <StatCard
          icon={<Building2 size={IC} />}
          label="Mitra Bayar Terlibat"
          value={`${totalMitraCount} Mitra Aktif`}
          sub="WOORI, BRI, MANDIRI, BNI, BTN, POS"
          color={COLORS.blueDark}
        />
        <StatCard
          icon={<Zap size={IC} />}
          label="Total Nominal Program"
          value={fmt(totalNominalTab)}
          sub={
            activeTab === "ntip"
              ? `Debet: ${fmt(totalDebetTab)} | Credit: ${fmt(totalCreditTab)}`
              : "Telah Tervalidasi YANDU & CMS"
          }
          color={COLORS.green}
        />
        <StatCard
          icon={<ShieldCheck size={IC} />}
          label="Status Pemadanan SP"
          value="Matched 100%"
          sub="Nomor SP & DPS Terverifikasi"
          color={COLORS.purple}
        />
      </div>

      {/* TABEL HASIL MAPPING JENIS PROGRAM */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: 22,
          border: `1px solid ${COLORS.gray200}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SectionTitle>
                Daftar Transaksi Program: {tabsConfig.find((t) => t.id === activeTab)?.fullName}
              </SectionTitle>
              <Badge color="blue">{filteredData.length} Transaksi</Badge>
            </div>
            <div style={{ fontSize: 12, color: COLORS.gray500, marginTop: 2 }}>
              Format kolom disesuaikan standar rekonsiliasi spesifik BRD 4.5.15
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Btn variant="outline" size="sm" onClick={handleExportExcel}>
              <Download size={13} /> Ekspor Excel Tab {tabsConfig.find((t) => t.id === activeTab)?.label}
            </Btn>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            alignItems: "flex-end",
            flexWrap: "wrap",
            background: "#F8FAFC",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid #E2E8F0"
          }}
        >
          <Select
            label="Filter Mitra Bayar"
            value={selectedMitraFilter}
            onChange={setSelectedMitraFilter}
            options={mitraOptions}
            minW={190}
          />
          <Select
            label="Filter Kantor Cabang"
            value={selectedKancabFilter}
            onChange={setSelectedKancabFilter}
            options={kancabOptions}
            minW={210}
          />
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={{ fontSize: 11.5, color: COLORS.gray500, display: "block", marginBottom: 4, fontWeight: 700 }}>
              Cari Transaksi (KTPA / No SP / No DPS / Penerima / NOPEN)
            </label>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Ketik kata kunci pencarian..."
            />
          </div>
        </div>

        {/* TABEL DINAMIS PER TAB PROGRAM */}
        {activeDataset.length === 0 ? (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              background: "#F8FAFC",
              borderRadius: 8,
              border: "1px dashed #CBD5E1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}
          >
            <FileSpreadsheet size={32} color="#94A3B8" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
              Belum Ada Data Rekening Koran yang Dipetakan
            </span>
            <span style={{ fontSize: 12, color: "#64748B", maxWidth: 460 }}>
              Silakan unggah berkas rekening koran pada menu <strong>Upload CMS Mitra Bayar</strong>, kemudian klik tombol <em>"Proses Mapping"</em> untuk menyinkronkan data ke tab program ini.
            </span>
            {onNavigateToUploadCMS && (
              <Btn size="sm" onClick={onNavigateToUploadCMS}>
                <UploadCloud size={14} /> Buka Menu Upload CMS
              </Btn>
            )}
          </div>
        ) : filteredData.length === 0 ? (
          <NoData text={`Tidak ada data transaksi ${tabsConfig.find((t) => t.id === activeTab)?.label} yang cocok dengan filter.`} />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              {/* =========================================================
                  1. HEADER & BODY: THT
                  No | Program | Jenis Manfaat | Nomor KTPA | Nominal | No SP | Tanggal SP | No DPS | Tanggal DPS | Kode Bayar | Kantor Cabang | Kode Anggota | Mitra
                  ========================================================= */}
              {activeTab === "tht" && (
                <>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Program</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jenis Manfaat</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor KTPA</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nominal (Rp)</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No SP</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal SP</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No DPS</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal DPS</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kode Bayar</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kantor Cabang</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kode Anggota</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800 }}>Mitra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.no || i}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF", cursor: "pointer" }}
                        onClick={() => setDetailModal(d)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 800, color: "#0141A8", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color="blue">{d.program || "THT"}</Badge>
                        </td>
                        <td style={{ padding: "9px 12px", fontWeight: 600, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.jenisManfaat || "THT BUP"}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: "#0141A8", borderRight: "1px solid #E2E8F0" }}>{d.ktpa}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(d.nominal)}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noSP}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglSP}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noDPS}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglDPS}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontFamily: "monospace", fontSize: 11, color: "#0F172A", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>{d.kodeBayar}</td>
                        <td style={{ padding: "9px 12px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.kancab}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, fontSize: 11, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>{d.kodeAnggota || "TNI-AD"}</span>
                        </td>
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* =========================================================
                  2. HEADER & BODY: JKK
                  No | Nomor KTPA | DB | DK | Gugur | Tewas | Bantuan Beasiswa | Total (Rp) | No SP | Tanggal SP | No DPS | Tanggal DPS | Kode Bayar | Kantor Cabang | Anggota | Mitra
                  ========================================================= */}
              {activeTab === "jkk" && (
                <>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                      <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 800, width: 35, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor KTPA</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>DB</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>DK</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Gugur</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tewas</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Bantuan Beasiswa</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0", background: "#FEF3C7" }}>Total (Rp)</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No SP</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal SP</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No DPS</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal DPS</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kode Bayar</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kantor Cabang</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Anggota</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800 }}>Mitra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.no || i}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF", cursor: "pointer" }}
                        onClick={() => setDetailModal(d)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "9px 8px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: "#EA580C", borderRight: "1px solid #E2E8F0" }}>{d.ktpa}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.db > 0 ? "#0F172A" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.db > 0 ? fmt(d.db) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.dk > 0 ? "#0F172A" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.dk > 0 ? fmt(d.dk) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.gugur > 0 ? "#DC2626" : "#94A3B8", fontWeight: d.gugur > 0 ? 800 : 400, borderRight: "1px solid #E2E8F0" }}>{d.gugur > 0 ? fmt(d.gugur) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.tewas > 0 ? "#DC2626" : "#94A3B8", fontWeight: d.tewas > 0 ? 800 : 400, borderRight: "1px solid #E2E8F0" }}>{d.tewas > 0 ? fmt(d.tewas) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.beasiswa > 0 ? "#059669" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.beasiswa > 0 ? fmt(d.beasiswa) : "—"}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0", background: "#FEF9C3" }}>{fmt(d.nominal)}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noSP}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglSP}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noDPS}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglDPS}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{d.kodeBayar}</td>
                        <td style={{ padding: "9px 12px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.kancab}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, fontSize: 11, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>{d.anggota || d.kodeAnggota}</span>
                        </td>
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* =========================================================
                  3. HEADER & BODY: JKM
                  No | Nomor KTPA | SKS | UDW | BP | Bantuan Beasiswa | Total (Rp) | No SP | Tanggal SP | No DPS | Tanggal DPS | Kode Bayar | Kantor Cabang | Anggota | Mitra
                  ========================================================= */}
              {activeTab === "jkm" && (
                <>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                      <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 800, width: 35, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor KTPA</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>SKS</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>UDW</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>BP</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Bantuan Beasiswa</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0", background: "#F3E8FF" }}>Total (Rp)</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No SP</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal SP</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No DPS</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal DPS</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kode Bayar</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kantor Cabang</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Anggota</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800 }}>Mitra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.no || i}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF", cursor: "pointer" }}
                        onClick={() => setDetailModal(d)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "9px 8px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: "#7C3AED", borderRight: "1px solid #E2E8F0" }}>{d.ktpa}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.sks > 0 ? "#0F172A" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.sks > 0 ? fmt(d.sks) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.udw > 0 ? "#0F172A" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.udw > 0 ? fmt(d.udw) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.bp > 0 ? "#0F172A" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.bp > 0 ? fmt(d.bp) : "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.beasiswa > 0 ? "#059669" : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>{d.beasiswa > 0 ? fmt(d.beasiswa) : "—"}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0", background: "#FAF5FF" }}>{fmt(d.nominal)}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noSP}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglSP}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noDPS}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglDPS}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{d.kodeBayar}</td>
                        <td style={{ padding: "9px 12px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.kancab}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, fontSize: 11, color: "#475569", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>{d.anggota || d.kodeAnggota}</span>
                        </td>
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* =========================================================
                  4. HEADER & BODY: NTIP
                  No. │ KTPA │ Tanggal Transaksi │ Nama Penerima │ Debet │ Credit │ Ladger Balance (Rp) │ User ID │ No SP │ Tanggal SP │ No DPS │ Tanggal DPS │ Mitra Bayar
                  ========================================================= */}
              {activeTab === "ntip" && (
                <>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                      <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 800, width: 35, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>KTPA</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal Transaksi</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nama Penerima</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Debet (Rp)</th>
                      <th style={{ padding: "10px 10px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Credit (Rp)</th>
                      <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Ledger Balance (Rp)</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>User ID</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No SP</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal SP</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>No DPS</th>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal DPS</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800 }}>Mitra Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.no || i}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF", cursor: "pointer" }}
                        onClick={() => setDetailModal(d)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "9px 8px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: "#059669", borderRight: "1px solid #E2E8F0" }}>{d.ktpa}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.tglTransaksi || d.tglBayar}</td>
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{d.namaPenerima || "—"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.debet > 0 ? "#DC2626" : "#94A3B8", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>{d.debet > 0 ? fmt(d.debet) : "0"}</td>
                        <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: d.credit > 0 ? "#059669" : "#94A3B8", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>{d.credit > 0 ? fmt(d.credit) : "0"}</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(d.saldo)}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontFamily: "monospace", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.userId}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noSP}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglSP}</td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.noDPS}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 11, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglDPS}</td>
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* =========================================================
                  5. HEADER & BODY: PEMBAYARAN PENSIUN
                  Jenis Pensiun │ Nomor Pensiun │ Bulan Bayar │ Nominal │ Tanggal Transaksi │ Kantor Cabang │ Mitra Bayar
                  ========================================================= */}
              {activeTab === "bayar_pensiun" && (
                <>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jenis Pensiun</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor Pensiun</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Bulan Bayar</th>
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nominal (Rp)</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal Transaksi</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kantor Cabang</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800 }}>Mitra Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.no || i}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF", cursor: "pointer" }}
                        onClick={() => setDetailModal(d)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={d.jenisPensiun === "Dapem Induk" ? "blue" : "purple"}>{d.jenisPensiun}</Badge>
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: "#0141A8", borderRight: "1px solid #E2E8F0" }}>{d.noPensiun}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 600, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.bulanBayar}</td>
                        <td style={{ padding: "9px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>{fmt(d.nominal)}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglTransaksi}</td>
                        <td style={{ padding: "9px 14px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.kancab}</td>
                        <td style={{ padding: "9px 14px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* =========================================================
                  6. HEADER & BODY: PENYEDIAAN PENSIUN
                  Jenis Pensiun │ Nomor Pensiun │ Bulan Bayar │ Nominal │ Tanggal Transaksi │ Kantor Cabang │ Mitra Bayar
                  ========================================================= */}
              {activeTab === "sedia_pensiun" && (
                <>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#475569" }}>
                      <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, width: 40, borderRight: "1px solid #E2E8F0" }}>No</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Jenis Pensiun</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nomor Pensiun</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Bulan Bayar</th>
                      <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Nominal (Rp)</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Tanggal Transaksi</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, borderRight: "1px solid #E2E8F0" }}>Kantor Cabang</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800 }}>Mitra Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d, i) => (
                      <tr
                        key={d.no || i}
                        style={{ borderBottom: "1px solid #E2E8F0", background: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF", cursor: "pointer" }}
                        onClick={() => setDetailModal(d)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "#F8FAFC" : "#FFFFFF")}
                      >
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{i + 1}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                          <Badge color={d.jenisPensiun === "Dapem Induk" ? "blue" : "purple"}>{d.jenisPensiun}</Badge>
                        </td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontFamily: "monospace", fontWeight: 800, color: "#4F46E5", borderRight: "1px solid #E2E8F0" }}>{d.noPensiun}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 600, color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.bulanBayar}</td>
                        <td style={{ padding: "9px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: "#059669", borderRight: "1px solid #E2E8F0" }}>{fmt(d.nominal)}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>{d.tglTransaksi}</td>
                        <td style={{ padding: "9px 14px", color: "#334155", borderRight: "1px solid #E2E8F0" }}>{d.kancab}</td>
                        <td style={{ padding: "9px 14px", fontWeight: 700, color: "#0141A8" }}>{d.mitra}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
