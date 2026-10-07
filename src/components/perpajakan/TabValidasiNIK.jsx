import { useState } from "react";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  RefreshCw,
  Send,
  Download,
  Eye,
  Clock,
  ShieldCheck,
  Building2,
  Info,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { COLORS, IC } from "../../constants/colors";
import { StatCard } from "../common/StatCard";
import { Btn } from "../common/Btn";
import { Select } from "../common/Select";
import { Badge } from "../common/Badge";
import { NoData } from "../common/NoData";

export const TabValidasiNIK = ({
  pesertaList,
  onOpenDetailMonitoring,
  onOpenNotaDinasModal,
  onOpenRiwayatTiketModal,
  onSyncDukcapil,
  isSyncing,
  onExportPreview,
}) => {
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatusTL, setFilterStatusTL] = useState("Semua");
  const [filterSatker, setFilterSatker] = useState("Semua");
  const [subTab, setSubTab] = useState("anomali"); // "anomali", "semua", "selesai"
  const [searchQuery, setSearchQuery] = useState("");

  const totalPeserta = pesertaList.length;
  const totalValid = pesertaList.filter((p) => p.nikValid).length;
  const totalAnomali = pesertaList.filter((p) => !p.nikValid).length;
  const totalNikSementara = pesertaList.filter((p) => p.isNikSementara || (!p.nikValid && p.nikSementara)).length;
  const totalSelesaiTL = pesertaList.filter((p) => p.statusTindakLanjut?.includes("Selesai")).length;
  const totalMenunggu = pesertaList.filter((p) => !p.nikValid && p.statusTindakLanjut?.includes("Menunggu")).length;
  const totalProsesSatker = pesertaList.filter((p) => !p.nikValid && p.statusTindakLanjut?.includes("Dikonfirmasi")).length;
  const totalSiapUpdate = pesertaList.filter((p) => !p.nikValid && (p.statusTindakLanjut?.includes("Dokumen") || p.statusTindakLanjut?.includes("Verifikasi"))).length;

  const filteredList = pesertaList.filter((p) => {
    // Sub-tab filter
    if (subTab === "anomali" && p.nikValid) return false;
    if (subTab === "selesai" && !p.statusTindakLanjut?.includes("Selesai")) return false;

    const matchKategori = filterKategori === "Semua" || p.kategoriAnomali === filterKategori;
    const matchStatusTL = filterStatusTL === "Semua" || p.statusTindakLanjut === filterStatusTL;
    const matchSatker = filterSatker === "Semua" || p.satker === filterSatker;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      p.nama.toLowerCase().includes(q) ||
      (p.nik && p.nik.toLowerCase().includes(q)) ||
      (p.nikAsli && p.nikAsli.toLowerCase().includes(q)) ||
      (p.nikSementara && p.nikSementara.toLowerCase().includes(q)) ||
      p.nrp.toLowerCase().includes(q) ||
      p.nopens.toLowerCase().includes(q) ||
      (p.satker && p.satker.toLowerCase().includes(q)) ||
      (p.picKepesertaan && p.picKepesertaan.toLowerCase().includes(q));

    return matchKategori && matchStatusTL && matchSatker && matchSearch;
  });

  const listAnomaliAktif = pesertaList.filter((p) => !p.nikValid);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 1. EXECUTIVE STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard
          icon={<Users size={IC} />}
          label="Total Peserta Dikelola"
          value={`${totalPeserta} Peserta`}
          sub="Master Data DAPEM Pensiun TA 2026"
          color={COLORS.gray800}
        />
        <StatCard
          icon={<CheckCircle2 size={IC} />}
          label="NIK Terpadan Valid Dukcapil"
          value={`${totalValid} Peserta (${Math.round((totalValid / totalPeserta) * 100)}%)`}
          sub="100% Siap SPT & Bukpot Coretax DJP"
          color={COLORS.green}
        />
        <StatCard
          icon={<Sparkles size={IC} />}
          label="NIK Sementara Diterbitkan"
          value={`${totalNikSementara} Peserta`}
          sub="Tarif Normal 100% (Bebas Sanksi PMK 168)"
          color={COLORS.amber}
        />
        <StatCard
          icon={<AlertTriangle size={IC} />}
          label="Antrean TL Div. Kepesertaan"
          value={`${totalAnomali} Peserta`}
          sub={`Proses Satker: ${totalProsesSatker} • Verifikasi: ${totalSiapUpdate}`}
          color={totalAnomali > 0 ? COLORS.red : COLORS.green}
        />
      </div>

      {/* 2. REGULATION & ROLE WORKFLOW BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)",
          border: "1px solid #BFDBFE",
          borderRadius: 10,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#DBEAFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} color="#1D4ED8" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "#1E3A8A" }}>
                Alur Otomasi Deteksi NIK, Penerbitan NIK Sementara, &amp; Tindak Lanjut Divisi Kepesertaan
              </div>
              <div style={{ fontSize: 11.5, color: "#475569" }}>
                Kepatuhan Regulasi PMK No. 168/2023, PP 58/2023, &amp; Pemadanan SIAK Kemendagri / DJP Coretax
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1D4ED8",
              background: "#DBEAFE",
              padding: "4px 10px",
              borderRadius: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Building2 size={12} /> Divisi Keuangan: Monitoring View
          </span>
        </div>

        {/* 3 Step Workflow Process Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 10,
            marginTop: 4,
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 11.5,
              lineHeight: 1.45,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#1E40AF", marginBottom: 3 }}>
              <span style={{ background: "#EFF6FF", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#1D4ED8", border: "1px solid #BFDBFE" }}>
                1
              </span>
              <span>Deteksi Sistem &amp; NIK Sementara</span>
            </div>
            <div style={{ color: "#475569" }}>
              Sistem secara otomatis mendeteksi NIK yang belum valid di Dukcapil, langsung membuatkan <strong>NIK Sementara</strong> agar hak pensiun &amp; potongan PPh 21 tetap berlaku <strong>tarif normal 100%</strong> (bebas denda 20%).
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 11.5,
              lineHeight: 1.45,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#7C3AED", marginBottom: 3 }}>
              <span style={{ background: "#F5F3FF", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#7C3AED", border: "1px solid #DDD6FE" }}>
                2
              </span>
              <span>Tindak Lanjut Div. Kepesertaan</span>
            </div>
            <div style={{ color: "#475569" }}>
              Data otomatis masuk ke <strong>Daftar Tindak Lanjut</strong>. Divisi Kepesertaan bertindak sebagai PIC untuk konfirmasi ke Satker/peserta, verifikasi berkas e-KTP, dan sinkronisasi SIAK Kemendagri.
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 11.5,
              lineHeight: 1.45,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#059669", marginBottom: 3 }}>
              <span style={{ background: "#ECFDF5", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#059669", border: "1px solid #A7F3D0" }}>
                3
              </span>
              <span>Pengawasan Divisi Keuangan</span>
            </div>
            <div style={{ color: "#475569" }}>
              Divisi Keuangan memonitor daftar antrean, menerbitkan Nota Dinas permintaan pemutakhiran, dan memastikan seluruh data telah 100% valid sebelum pelaporan SPT &amp; Coretax DJP.
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUBTAB FILTER & ACTION TOOLBAR */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 8,
          padding: "14px 18px",
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Top Controls: Sub-tabs & Action Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          {/* Sub-tabs pills */}
          <div style={{ display: "flex", gap: 6, background: "#F1F5F9", padding: 3, borderRadius: 8 }}>
            <button
              onClick={() => setSubTab("anomali")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: subTab === "anomali" ? 700 : 500,
                background: subTab === "anomali" ? "#FFFFFF" : "transparent",
                color: subTab === "anomali" ? "#DC2626" : "#475569",
                boxShadow: subTab === "anomali" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
              }}
            >
              <AlertTriangle size={13} />
              <span>Antrean Tindak Lanjut Kepesertaan</span>
              <span
                style={{
                  background: subTab === "anomali" ? "#FEE2E2" : "#E2E8F0",
                  color: subTab === "anomali" ? "#B91C1C" : "#64748B",
                  fontSize: 10.5,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                {totalAnomali}
              </span>
            </button>

            <button
              onClick={() => setSubTab("selesai")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: subTab === "selesai" ? 700 : 500,
                background: subTab === "selesai" ? "#FFFFFF" : "transparent",
                color: subTab === "selesai" ? "#059669" : "#475569",
                boxShadow: subTab === "selesai" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
              }}
            >
              <CheckCircle2 size={13} />
              <span>Selesai Dimutakhirkan</span>
              <span
                style={{
                  background: subTab === "selesai" ? "#DCFCE7" : "#E2E8F0",
                  color: subTab === "selesai" ? "#15803D" : "#64748B",
                  fontSize: 10.5,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                {totalSelesaiTL}
              </span>
            </button>

            <button
              onClick={() => setSubTab("semua")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: subTab === "semua" ? 700 : 500,
                background: subTab === "semua" ? "#FFFFFF" : "transparent",
                color: subTab === "semua" ? "#0F172A" : "#475569",
                boxShadow: subTab === "semua" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
              }}
            >
              <Users size={13} />
              <span>Semua Peserta DAPEM</span>
              <span
                style={{
                  background: "#E2E8F0",
                  color: "#64748B",
                  fontSize: 10.5,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                {totalPeserta}
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn
              variant="outline"
              size="sm"
              onClick={onSyncDukcapil}
              disabled={isSyncing}
              title="Sinkronisasi Status Rekonsiliasi dari Divisi Kepesertaan & SIAK"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Sinkronisasi SIAK..." : "Sinkronisasi Status Kepesertaan"}</span>
            </Btn>

            <Btn
              variant="primary"
              size="sm"
              onClick={() => onOpenNotaDinasModal(listAnomaliAktif)}
              disabled={listAnomaliAktif.length === 0}
              title="Kirim Nota Dinas Permintaan Pemutakhiran ke Divisi Kepesertaan"
            >
              <Send size={13} />
              <span>Teruskan Nota Dinas ke Kepesertaan ({listAnomaliAktif.length})</span>
            </Btn>

            <Btn variant="outline" size="sm" onClick={onExportPreview}>
              <Download size={13} />
              <span>Ekspor Daftar TL</span>
            </Btn>
          </div>
        </div>

        {/* Filters bar */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Select
            label="Kategori Masalah NIK"
            value={filterKategori}
            onChange={setFilterKategori}
            options={[
              "Semua",
              "NIK Belum Terdaftar Dukcapil",
              "Kode Wilayah Tidak Ditemukan",
              "Format Tidak Standar (<16 Digit)",
              "Diskrepansi Identitas (Nama Beda)",
            ]}
            minW={220}
          />

          <Select
            label="Status Tindak Lanjut Kepesertaan"
            value={filterStatusTL}
            onChange={setFilterStatusTL}
            options={[
              "Semua",
              "Sedang Dikonfirmasi ke Satker Lanud Hlm",
              "Sedang Dikonfirmasi ke Satker Kodam I/BB",
              "Dokumen e-KTP Diterima - Siap Sinkronisasi Kepesertaan",
              "Verifikasi Berkas oleh Divisi Kepesertaan",
              "Selesai (Terpadan)",
            ]}
            minW={230}
          />

          <Select
            label="Satker Kedinasan"
            value={filterSatker}
            onChange={setFilterSatker}
            options={["Semua", "TNI AD", "TNI AL", "TNI AU", "POLRI", "ASN Kemenhan", "ASN Polri"]}
            minW={130}
          />

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11.5, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>
              Pencarian (Nama / NIK Asli / NIK Sementara / NRP / NOPENS / PIC)
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Cari peserta dalam daftar tindak lanjut..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6.5px 10px 6.5px 30px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  fontSize: 12,
                  outline: "none",
                }}
              />
              <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN TABLE: LIST TINDAK LANJUT DIVISI KEPESERTAAN */}
      <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 18, border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
              {subTab === "anomali"
                ? "Daftar Monitoring NIK Sementara & Antrean Tindak Lanjut Divisi Kepesertaan"
                : subTab === "selesai"
                ? "Riwayat Peserta yang Telah Selesai Dimutakhirkan oleh Divisi Kepesertaan"
                : "Daftar Lengkap Status Validasi NIK & NIK Sementara Seluruh Peserta"}
            </div>
            <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
              Menampilkan <strong>{filteredList.length}</strong> data peserta • Divisi Keuangan memonitor progres rekonsiliasi yang dilakukan Divisi Kepesertaan
            </div>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <NoData message="Tidak ada data peserta yang cocok dengan filter / seluruh peserta telah terpadan valid." />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 6, border: "1px solid #CBD5E1" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B" }}>
                  <th style={{ padding: "9px 8px", textAlign: "center", width: 36, borderRight: "1px solid #E2E8F0" }}>No</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Identitas Peserta Pensiun</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NOPENS / NRP</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK Tercatat (Anomali)</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>NIK Sementara (Sistem)</th>
                  <th style={{ padding: "9px 12px", textAlign: "left", borderRight: "1px solid #E2E8F0" }}>Diagnosa Sistem &amp; Masalah Dukcapil</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Status Tindak Lanjut Kepesertaan</th>
                  <th style={{ padding: "9px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>Nota Dinas Keuangan</th>
                  <th style={{ padding: "9px 12px", textAlign: "center" }}>Aksi Monitoring</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((d, i) => (
                  <tr
                    key={d.id}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: !d.nikValid
                        ? (d.statusTindakLanjut?.includes("Dokumen") ? "#F0FDF4" : "#FFFBFB")
                        : (i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"),
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = !d.nikValid
                        ? (d.statusTindakLanjut?.includes("Dokumen") ? "#F0FDF4" : "#FFFBFB")
                        : (i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"))
                    }
                  >
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#64748B", borderRight: "1px solid #E2E8F0" }}>
                      {i + 1}
                    </td>

                    {/* Identitas Peserta */}
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.nama}</div>
                      <div style={{ fontSize: 10.5, color: "#64748B" }}>
                        {d.satker} ({d.unor}) • <span style={{ color: "#334155" }}>{d.dapem}</span>
                      </div>
                    </td>

                    {/* NOPENS / NRP */}
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      <div style={{ fontWeight: 700, color: COLORS.blueDark }}>{d.nopens}</div>
                      <div style={{ color: "#64748B" }}>{d.nrp}</div>
                    </td>

                    {/* NIK Tercatat (Anomali) */}
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: d.nikValid ? "#059669" : "#DC2626",
                        }}
                      >
                        {d.nikAsli || d.nik}
                      </div>
                      <div style={{ marginTop: 2 }}>
                        <Badge color={d.nikValid ? "green" : "red"}>
                          {d.nikValid ? "Valid Dukcapil" : "Belum Valid"}
                        </Badge>
                      </div>
                    </td>

                    {/* NIK Sementara (Auto-Generated by System) */}
                    <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      {d.isNikSementara || (!d.nikValid && d.nikSementara) ? (
                        <div>
                          <div style={{ fontWeight: 800, color: "#D97706" }}>
                            {d.nikSementara || d.nik}
                          </div>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              background: "#FEF3C7",
                              color: "#92400E",
                              padding: "1px 5px",
                              borderRadius: 4,
                              border: "1px solid #FDE68A",
                              display: "inline-block",
                              marginTop: 2,
                            }}
                          >
                            Auto-Generated
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "#94A3B8" }}>— (Definitif)</span>
                      )}
                    </td>

                    {/* Diagnosa & Masalah Dukcapil */}
                    <td style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", fontSize: 11.5 }}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{d.kategoriAnomali}</div>
                      <div style={{ color: "#475569", marginTop: 2 }}>{d.diagnosaNIK}</div>
                    </td>

                    {/* Status Tindak Lanjut Kepesertaan */}
                    <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                      <Badge
                        color={
                          d.statusTindakLanjut?.includes("Selesai")
                            ? "green"
                            : d.statusTindakLanjut?.includes("Dokumen") || d.statusTindakLanjut?.includes("Verifikasi")
                            ? "teal"
                            : d.statusTindakLanjut?.includes("Dikonfirmasi")
                            ? "blue"
                            : "purple"
                        }
                      >
                        {d.statusTindakLanjut}
                      </Badge>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 3, fontWeight: 500 }}>
                        PIC: {d.picKepesertaan ? d.picKepesertaan.split("(")[0] : "Div. Kepesertaan"}
                      </div>
                      <div style={{ fontSize: 9.5, color: "#94A3B8" }}>
                        Masuk List: {d.tglMasukList || "01 Jan 2026"}
                      </div>
                    </td>

                    {/* Nota Dinas Pengantar Keuangan */}
                    <td style={{ padding: "8px 10px", textAlign: "center", borderRight: "1px solid #E2E8F0", fontSize: 11 }}>
                      {d.noSuratPengantar && d.noSuratPengantar !== "—" ? (
                        <div>
                          <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#1E293B" }}>
                            {d.noSuratPengantar.split("/")[0]}/{d.noSuratPengantar.split("/")[1]}
                          </span>
                          <div style={{ color: "#64748B", fontSize: 10 }}>08 Jul 2026</div>
                        </div>
                      ) : (
                        <span style={{ color: "#94A3B8" }}>—</span>
                      )}
                    </td>

                    {/* Aksi Monitoring */}
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <Btn
                          size="sm"
                          variant="primary"
                          onClick={() => onOpenDetailMonitoring(d)}
                          title="Lihat Detail Pengawasan NIK Sementara & Progres Kepesertaan"
                        >
                          <Eye size={11} /> Detail Monitoring
                        </Btn>
                        <Btn
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenRiwayatTiketModal(d)}
                          title="Lihat Log Timeline Komunikasi Kepesertaan"
                        >
                          <Clock size={11} /> Log Tiket
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
