import { useState } from "react";
import {
  Banknote,
  BarChart3,
  Shield,
  Lock,
  PenTool,
  CheckCircle2,
  Mail,
  RefreshCw,
  Clock,
  Sparkles,
  Calendar,
  Layers
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Badge, StatCard, Select, Btn, NoData, PreviewModal } from "../components/common";

export const GeneratorTagihan = () => {
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterBatch, setFilterBatch] = useState("Semua Batch");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);

  const steps = [
    "Cut-off Data Otomatis",
    "Draft Terbentuk",
    "Download & Cetak",
    "Dokumen di-TTD"
  ];

  const stepIcon = (idx, currentStep) => {
    if (idx < currentStep) return { bg: COLORS.green, icon: "✓", color: COLORS.white };
    if (idx === currentStep) return { bg: COLORS.blue, icon: (idx + 1).toString(), color: COLORS.white };
    return { bg: COLORS.gray300, icon: (idx + 1).toString(), color: COLORS.gray500 };
  };

  const initialTagihan = [
    {
      id: "TGH-001",
      noSurat: "001/ASABRI/TGH-THT-PEN-B1/VII/2026",
      jenis: "THT & Pensiun",
      batch: "Batch 1",
      batchBadge: "Batch 1",
      batchBadgeColor: "blue",
      acuan: "SKP-PFK (Gaji Induk)",
      periode: "Juli 2026",
      cutoff: "15 Juli 2026",
      nominal: "Rp 70.408.000.000",
      nominalNum: 70408000000,
      peserta: "14.328",
      currentStep: 3,
      tglDraft: "15 Jul 2026 08:00",
      tglDownload: "16 Jul 2026 10:15",
      tglTTD: "17 Jul 2026",
      fileTTD: "Surat_Tagihan_THT_Pensiun_B1_Juli2026_signed.pdf",
      icon: "banknote",
      items: [
        { jenis: "Iuran THT (3,25% - Batch 1 Gaji Induk)", peserta: "14.328", nominal: "Rp 28.608.000.000" },
        { jenis: "Iuran Pensiun (4,75% - Batch 1 Gaji Induk)", peserta: "14.328", nominal: "Rp 41.800.000.000" }
      ],
      keterangan: "Tagihan Termin 1 / Gaji Induk bulan berjalan (Dihitung 80% dari estimasi basis gaji SKP-PFK)."
    },
    {
      id: "TGH-002",
      noSurat: "002/ASABRI/TGH-THT-PEN-B2/VII/2026",
      jenis: "THT & Pensiun",
      batch: "Batch 2",
      batchBadge: "Batch 2",
      batchBadgeColor: "purple",
      acuan: "SKP-PFK (Gaji Susulan/Kekurangan)",
      periode: "Juli 2026",
      cutoff: "25 Juli 2026",
      nominal: "Rp 17.602.000.000",
      nominalNum: 17602000000,
      peserta: "14.328",
      currentStep: 2,
      tglDraft: "25 Jul 2026 08:00",
      tglDownload: "26 Jul 2026 09:30",
      tglTTD: null,
      fileTTD: null,
      icon: "barchart",
      items: [
        { jenis: "Iuran THT (3,25% - Batch 2 Susulan/Kekurangan)", peserta: "14.328", nominal: "Rp 7.152.000.000" },
        { jenis: "Iuran Pensiun (4,75% - Batch 2 Susulan/Kekurangan)", peserta: "14.328", nominal: "Rp 10.450.000.000" }
      ],
      keterangan: "Tagihan Termin 2 / Gaji Susulan, Rapel & Kekurangan Rekonsiliasi bulanan."
    },
    {
      id: "TGH-003",
      noSurat: "003/ASABRI/TGH-JKK/VII/2026",
      jenis: "JKK",
      batch: "Bulanan",
      batchBadge: "Bulanan",
      batchBadgeColor: "orange",
      acuan: "Data Klaim & Gaji Pokok",
      periode: "Juli 2026",
      cutoff: "25 Juli 2026",
      nominal: "Rp 2.630.000.000",
      nominalNum: 2630000000,
      peserta: "14.328",
      currentStep: 2,
      tglDraft: "25 Jul 2026 08:00",
      tglDownload: "26 Jul 2026 09:45",
      tglTTD: null,
      fileTTD: null,
      icon: "shield",
      items: [
        { jenis: "Iuran JKK (0,24% Basis Gaji Pokok)", peserta: "14.328", nominal: "Rp 2.630.000.000" }
      ],
      keterangan: "Tagihan Iuran JKK Bulanan Tunggal terbit pada cut-off tanggal 25."
    },
    {
      id: "TGH-004",
      noSurat: "004/ASABRI/TGH-JKM/VII/2026",
      jenis: "JKm",
      batch: "Bulanan",
      batchBadge: "Bulanan",
      batchBadgeColor: "purple",
      acuan: "Data Klaim & Gaji Pokok",
      periode: "Juli 2026",
      cutoff: "25 Juli 2026",
      nominal: "Rp 2.210.000.000",
      nominalNum: 2210000000,
      peserta: "14.328",
      currentStep: 1,
      tglDraft: "25 Jul 2026 08:00",
      tglDownload: null,
      tglTTD: null,
      fileTTD: null,
      icon: "lock",
      items: [
        { jenis: "Iuran JKm (0,20% Basis Gaji Pokok)", peserta: "14.328", nominal: "Rp 2.210.000.000" }
      ],
      keterangan: "Tagihan Iuran JKm Bulanan Tunggal terbit pada cut-off tanggal 25."
    },
    {
      id: "TGH-005",
      noSurat: "005/ASABRI/TGH-THT-PEN-B1/VI/2026",
      jenis: "THT & Pensiun",
      batch: "Batch 1",
      batchBadge: "Batch 1",
      batchBadgeColor: "blue",
      acuan: "SKP-PFK (Gaji Induk)",
      periode: "Juni 2026",
      cutoff: "15 Juni 2026",
      nominal: "Rp 69.776.000.000",
      nominalNum: 69776000000,
      peserta: "14.290",
      currentStep: 3,
      tglDraft: "15 Jun 2026 08:00",
      tglDownload: "16 Jun 2026 09:00",
      tglTTD: "17 Jun 2026",
      fileTTD: "Surat_Tagihan_THT_Pensiun_B1_Juni2026_signed.pdf",
      icon: "banknote",
      items: [
        { jenis: "Iuran THT (3,25% - Batch 1 Gaji Induk)", peserta: "14.290", nominal: "Rp 28.336.000.000" },
        { jenis: "Iuran Pensiun (4,75% - Batch 1 Gaji Induk)", peserta: "14.290", nominal: "Rp 41.440.000.000" }
      ],
      keterangan: "Tagihan Termin 1 / Gaji Induk periode Juni 2026 (Selesai diproses)."
    },
    {
      id: "TGH-006",
      noSurat: "006/ASABRI/TGH-THT-PEN-B2/VI/2026",
      jenis: "THT & Pensiun",
      batch: "Batch 2",
      batchBadge: "Batch 2",
      batchBadgeColor: "purple",
      acuan: "SKP-PFK (Gaji Susulan)",
      periode: "Juni 2026",
      cutoff: "25 Juni 2026",
      nominal: "Rp 17.444.000.000",
      nominalNum: 17444000000,
      peserta: "14.290",
      currentStep: 3,
      tglDraft: "25 Jun 2026 08:00",
      tglDownload: "26 Jun 2026 10:00",
      tglTTD: "27 Jun 2026",
      fileTTD: "Surat_Tagihan_THT_Pensiun_B2_Juni2026_signed.pdf",
      icon: "barchart",
      items: [
        { jenis: "Iuran THT (3,25% - Batch 2 Susulan)", peserta: "14.290", nominal: "Rp 7.084.000.000" },
        { jenis: "Iuran Pensiun (4,75% - Batch 2 Susulan)", peserta: "14.290", nominal: "Rp 10.360.000.000" }
      ],
      keterangan: "Tagihan Termin 2 / Gaji Susulan periode Juni 2026 (Selesai diproses)."
    },
    {
      id: "TGH-007",
      noSurat: "007/ASABRI/TGH-JKK/VI/2026",
      jenis: "JKK",
      batch: "Bulanan",
      batchBadge: "Bulanan",
      batchBadgeColor: "orange",
      acuan: "Data Klaim & Gaji Pokok",
      periode: "Juni 2026",
      cutoff: "25 Juni 2026",
      nominal: "Rp 2.610.000.000",
      nominalNum: 2610000000,
      peserta: "14.290",
      currentStep: 3,
      tglDraft: "25 Jun 2026 08:00",
      tglDownload: "26 Jun 2026 11:00",
      tglTTD: "27 Jun 2026",
      fileTTD: "Surat_Tagihan_JKK_Juni2026_signed.pdf",
      icon: "shield",
      items: [
        { jenis: "Iuran JKK (0,24% Basis Gaji Pokok)", peserta: "14.290", nominal: "Rp 2.610.000.000" }
      ],
      keterangan: "Tagihan Bulanan JKK periode Juni 2026 (Selesai diproses)."
    },
    {
      id: "TGH-008",
      noSurat: "008/ASABRI/TGH-JKM/VI/2026",
      jenis: "JKm",
      batch: "Bulanan",
      batchBadge: "Bulanan",
      batchBadgeColor: "purple",
      acuan: "Data Klaim & Gaji Pokok",
      periode: "Juni 2026",
      cutoff: "25 Juni 2026",
      nominal: "Rp 2.190.000.000",
      nominalNum: 2190000000,
      peserta: "14.290",
      currentStep: 3,
      tglDraft: "25 Jun 2026 08:00",
      tglDownload: "26 Jun 2026 11:00",
      tglTTD: "27 Jun 2026",
      fileTTD: "Surat_Tagihan_JKM_Juni2026_signed.pdf",
      icon: "lock",
      items: [
        { jenis: "Iuran JKm (0,20% Basis Gaji Pokok)", peserta: "14.290", nominal: "Rp 2.190.000.000" }
      ],
      keterangan: "Tagihan Bulanan JKm periode Juni 2026 (Selesai diproses)."
    }
  ];

  const [tagihanList, setTagihanList] = useState(initialTagihan);

  const statusLabel = (step) => {
    if (step >= 3) return { label: "Dokumen di-TTD", color: "green" };
    if (step >= 2) return { label: "Siap Download", color: "blue" };
    if (step >= 1) return { label: "Draft Otomatis", color: "yellow" };
    return { label: "Menunggu Cut-off", color: "gray" };
  };

  const handleSyncOtomatis = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice("Sinkronisasi otomatis berhasil! 4 Surat Tagihan periode Juli 2026 (THT/Pensiun Batch 1 & 2, JKK & JKm) telah diperbarui berdasarkan data cut-off terverifikasi.");
      setTimeout(() => setSyncNotice(null), 6000);
    }, 1200);
  };

  const handleUploadTTD = (id) => {
    setUploadingId(id);
    setTimeout(() => {
      setTagihanList(prev =>
        prev.map(t =>
          t.id === id
            ? {
                ...t,
                currentStep: 3,
                tglTTD: new Date().toISOString().split("T")[0],
                fileTTD: `Surat_Tagihan_${t.jenis.replace(/[^a-zA-Z0-9]/g, "_")}_signed.pdf`
              }
            : t
        )
      );
      setUploadingId(null);
    }, 1500);
  };

  const filtered = tagihanList.filter(t => {
    if (filterJenis !== "Semua" && t.jenis !== filterJenis) return false;
    if (filterBatch === "Batch 1" && !t.batch.includes("Batch 1")) return false;
    if (filterBatch === "Batch 2" && !t.batch.includes("Batch 2")) return false;
    if (filterBatch === "Bulanan" && !t.batch.includes("Bulanan")) return false;

    if (filterStatus === "Sudah TTD" && t.currentStep < 3) return false;
    if (filterStatus === "Menunggu TTD" && (t.currentStep < 2 || t.currentStep >= 3)) return false;
    if (filterStatus === "Draft Otomatis" && t.currentStep !== 1) return false;
    return true;
  });

  const countTTD = tagihanList.filter(t => t.currentStep >= 3).length;
  const countBelumTTD = tagihanList.filter(t => t.currentStep >= 2 && t.currentStep < 3).length;
  const countDraft = tagihanList.filter(t => t.currentStep < 2).length;

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Header Banner: Automated Cut-off Scheduling */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 12,
          padding: "20px 24px",
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: "linear-gradient(135deg, #0D47A1, #1976D2)",
                color: COLORS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(13,71,161,0.25)"
              }}
            >
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.gray900 }}>
                  Penerbitan Surat Tagihan Iuran Otomatis (Auto-Billing Cycle)
                </span>
                <Badge color="green">✅ Mesin Otomasi Aktif</Badge>
              </div>
              <div style={{ fontSize: 12.5, color: COLORS.gray600, lineHeight: 1.5 }}>
                Surat Tagihan dibentuk otomatis oleh sistem per jadwal *cut-off*: <strong>THT & Pensiun terbit 2x sebulan</strong> (Batch 1 tgl 15 & Batch 2 tgl 25), sedangkan <strong>JKK & JKm terbit 1x sebulan</strong> (tgl 25).
              </div>
            </div>
          </div>

          <Btn
            onClick={handleSyncOtomatis}
            disabled={isSyncing}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px" }}
          >
            <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Menyinkronkan..." : "Sinkronisasi & Generate Otomatis"}
          </Btn>
        </div>

        {syncNotice && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#E8F5E9",
              borderRadius: 8,
              border: `1px solid ${COLORS.green}`,
              color: "#1B5E20",
              fontSize: 12.5,
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <CheckCircle2 size={18} color="#2E7D32" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* 2 Schedule Indicator Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
          {/* Schedule 1 */}
          <div
            style={{
              background: "#F0F7FF",
              borderRadius: 10,
              padding: "14px 18px",
              border: `1px solid #BBDEFB`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0D47A1", color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.blueDark }}>
                  Siklus 1: Cut-off Tanggal 15
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 2 }}>
                  Mencakup: <strong>THT & Pensiun (Batch 1 — Gaji Induk)</strong>
                </div>
              </div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#E3F2FD", color: COLORS.blueDark }}>
              Terbentuk Otomatis
            </span>
          </div>

          {/* Schedule 2 */}
          <div
            style={{
              background: "#FDF8F0",
              borderRadius: 10,
              padding: "14px 18px",
              border: `1px solid #FFE0B2`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#E65100", color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#BF360C" }}>
                  Siklus 2: Cut-off Tanggal 25
                </div>
                <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 2 }}>
                  Mencakup: <strong>THT/Pensiun (Batch 2) + JKK + JKm</strong>
                </div>
              </div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#FFF3E0", color: "#E65100" }}>
              Terbentuk Otomatis
            </span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="📄" label="Total Surat Tagihan" value={tagihanList.length.toString()} sub="Periode Juli & Juni 2026" color={COLORS.blue} />
        <StatCard icon="success" label="Sudah di-TTD" value={countTTD.toString()} sub="Siap kirim ke Kemenkeu" color={COLORS.green} />
        <StatCard icon="✍️" label="Menunggu TTD" value={countBelumTTD.toString()} sub="Sudah didownload/dicetak" color={COLORS.orange} />
        <StatCard icon="📝" label="Draft Otomatis" value={countDraft.toString()} sub="Siap diproses/unduh" color={COLORS.red} />
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 10,
          padding: "14px 20px",
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          flexWrap: "wrap"
        }}
      >
        <Select
          label="Jenis Tagihan"
          value={filterJenis}
          onChange={setFilterJenis}
          options={["Semua", "THT & Pensiun", "JKK", "JKm"]}
          minW={160}
        />
        <Select
          label="Filter Batch / Frekuensi"
          value={filterBatch}
          onChange={setFilterBatch}
          options={["Semua Batch", "Batch 1", "Batch 2", "Bulanan"]}
          minW={160}
        />
        <Select
          label="Status Dokumen"
          value={filterStatus}
          onChange={setFilterStatus}
          options={["Semua", "Sudah TTD", "Menunggu TTD", "Draft Otomatis"]}
          minW={160}
        />
        <div style={{ marginLeft: "auto", fontSize: 12, color: COLORS.gray500, alignSelf: "center" }}>
          Menampilkan <strong>{filtered.length}</strong> surat tagihan
        </div>
      </div>

      {/* Tagihan Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 ? (
          <NoData text="Tidak ada surat tagihan yang sesuai dengan filter yang dipilih." />
        ) : (
          filtered.map(t => {
            const st = statusLabel(t.currentStep);
            const isExpanded = expandedId === t.id;
            const isUploading = uploadingId === t.id;

            return (
              <div
                key={t.id}
                style={{
                  background: COLORS.white,
                  borderRadius: 10,
                  border: `1px solid ${isExpanded ? COLORS.blue : COLORS.gray200}`,
                  overflow: "hidden",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Card Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  style={{
                    cursor: "pointer",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: isExpanded ? "#F8FAFC" : COLORS.white
                  }}
                  onMouseEnter={e => {
                    if (!isExpanded) e.currentTarget.style.background = COLORS.gray50;
                  }}
                  onMouseLeave={e => {
                    if (!isExpanded) e.currentTarget.style.background = COLORS.white;
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background:
                          t.jenis.includes("THT") ? "#E3F2FD" : t.jenis === "JKK" ? "#FFF3E0" : "#F3E5F5",
                        color:
                          t.jenis.includes("THT") ? COLORS.blueDark : t.jenis === "JKK" ? COLORS.orange : "#7B1FA2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {{"banknote": <Banknote size={22} />, "barchart": <BarChart3 size={22} />, "shield": <Shield size={22} />, "lock": <Lock size={22} />}[t.icon] || <Banknote size={22} />}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.gray900 }}>
                          Tagihan {t.jenis}
                        </span>
                        <Badge color={t.batchBadgeColor}>{t.batchBadge}</Badge>
                        <Badge color={st.color}>{st.label}</Badge>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.gray600 }}>
                        <strong style={{ color: COLORS.gray800 }}>{t.noSurat}</strong> • Periode {t.periode} • {t.peserta} peserta aktif • Acuan: {t.acuan}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.blueDark, fontFamily: "monospace" }}>
                        {t.nominal}
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.gray500 }}>
                        📅 Cut-off: <strong>{t.cutoff}</strong>
                      </div>
                    </div>

                    {t.currentStep >= 1 && (
                      <Btn
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          setPreview({
                            title: `Preview Surat Tagihan ${t.jenis} (${t.batch})`,
                            subtitle: `${t.noSurat} • Periode ${t.periode}`,
                            type: "surat",
                            fileName: `Surat_Tagihan_${t.jenis.replace(/[^a-zA-Z0-9]/g, "_")}_${t.periode.replace(" ", "_")}.pdf`,
                            content: {
                              noSurat: t.noSurat,
                              periode: t.periode,
                              cutoff: t.cutoff,
                              batchInfo: `${t.batch} — ${t.acuan}`,
                              items: t.items,
                              totalNominal: t.nominal
                            }
                          });
                        }}
                      >
                        Preview / Download
                      </Btn>
                    )}

                    <span style={{ fontSize: 14, color: COLORS.gray400 }}>{isExpanded ? "▼" : "▶"}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${COLORS.gray200}`, padding: "22px 24px", background: COLORS.white }}>
                    {/* Workflow Progress Steps */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 22 }}>
                      {steps.map((step, idx) => {
                        const s = stepIcon(idx, t.currentStep);
                        return (
                          <div key={idx} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: "50%",
                                  background: s.bg,
                                  color: s.color,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  marginBottom: 6
                                }}
                              >
                                {s.icon}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  textAlign: "center",
                                  color: idx <= t.currentStep ? COLORS.gray800 : COLORS.gray400,
                                  fontWeight: idx === t.currentStep ? 700 : 400,
                                  lineHeight: 1.3
                                }}
                              >
                                {step}
                              </div>
                            </div>
                            {idx < steps.length - 1 && (
                              <div
                                style={{
                                  height: 3,
                                  flex: 1,
                                  background: idx < t.currentStep ? COLORS.green : COLORS.gray300,
                                  marginTop: -16,
                                  borderRadius: 2
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Timeline Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
                      <div style={{ padding: "12px 14px", background: COLORS.greenLight, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: COLORS.gray500 }}>📅 Cut-off Data</div>
                        <div style={{ fontWeight: 700, color: COLORS.gray800, marginTop: 2 }}>{t.cutoff}</div>
                      </div>
                      <div style={{ padding: "12px 14px", background: t.tglDraft ? COLORS.greenLight : COLORS.gray50, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: COLORS.gray500 }}>⚡ Auto-Draft Terbentuk</div>
                        <div style={{ fontWeight: 700, color: COLORS.gray800, marginTop: 2 }}>{t.tglDraft || "Belum"}</div>
                      </div>
                      <div style={{ padding: "12px 14px", background: t.tglDownload ? COLORS.greenLight : COLORS.gray50, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: COLORS.gray500 }}>Download & Cetak</div>
                        <div style={{ fontWeight: 700, color: COLORS.gray800, marginTop: 2 }}>{t.tglDownload || <span style={{ color: COLORS.gray400 }}>Belum</span>}</div>
                      </div>
                      <div style={{ padding: "12px 14px", background: t.tglTTD ? COLORS.greenLight : COLORS.yellowLight, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: COLORS.gray500 }}>✍️ Tanda Tangan Kadiv</div>
                        <div style={{ fontWeight: 700, color: t.tglTTD ? COLORS.green : "#F57F17", marginTop: 2 }}>
                          {t.tglTTD || "Menunggu TTD"}
                        </div>
                      </div>
                    </div>

                    {/* Rincian Komponen Tagihan Box */}
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "14px 18px", border: `1px solid #E2E8F0`, marginBottom: 18 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.gray900, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Layers size={14} />
                        <span>Rincian Komposisi Nilai Tagihan:</span>
                      </div>
                      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#EDF2F7", color: COLORS.gray700 }}>
                            <th style={{ padding: "6px 10px", textAlign: "left", borderRadius: "4px 0 0 4px" }}>Item Iuran</th>
                            <th style={{ padding: "6px 10px", textAlign: "right" }}>Jumlah Peserta</th>
                            <th style={{ padding: "6px 10px", textAlign: "right", borderRadius: "0 4px 4px 0" }}>Nominal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {t.items.map((it, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0" }}>
                              <td style={{ padding: "8px 10px", color: COLORS.gray800, fontWeight: 500 }}>{it.jenis}</td>
                              <td style={{ padding: "8px 10px", textAlign: "right", color: COLORS.gray600 }}>{it.peserta}</td>
                              <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: COLORS.blueDark, fontFamily: "monospace" }}>{it.nominal}</td>
                            </tr>
                          ))}
                          <tr style={{ fontWeight: 700, background: "#EBF8FF" }}>
                            <td style={{ padding: "8px 10px", color: COLORS.blueDark }}>Total Surat Tagihan</td>
                            <td style={{ padding: "8px 10px", textAlign: "right", color: COLORS.gray600 }}>{t.peserta}</td>
                            <td style={{ padding: "8px 10px", textAlign: "right", color: COLORS.blueDark, fontFamily: "monospace", fontSize: 13 }}>{t.nominal}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ fontSize: 11.5, color: COLORS.gray600, marginTop: 8, fontStyle: "italic" }}>
                        💡 {t.keterangan}
                      </div>
                    </div>

                    {/* Upload TTD Box */}
                    {!t.fileTTD ? (
                      <div style={{ border: `2px dashed ${COLORS.gray300}`, borderRadius: 10, padding: "20px", textAlign: "center", background: COLORS.gray50, marginBottom: 16 }}>
                        <div style={{ marginBottom: 6, opacity: 0.4 }}><PenTool size={32} /></div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.gray800, marginBottom: 4 }}>Upload Dokumen Tagihan yang Sudah di-TTD</div>
                        <div style={{ fontSize: 11.5, color: COLORS.gray500, marginBottom: 12 }}>Upload hasil scan surat tagihan yang telah ditandatangani oleh Kadiv Keuangan</div>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap" }}>
                          <div>
                            <label style={{ fontSize: 11, color: COLORS.gray500, display: "block", marginBottom: 3 }}>Tanggal TTD</label>
                            <input type="date" defaultValue="2026-07-26" style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5 }} />
                          </div>
                          <Btn onClick={() => handleUploadTTD(t.id)}>
                            {isUploading ? "Mengupload..." : "Pilih File & Simpan TTD"}
                          </Btn>
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 8 }}>Format: PDF — Maks. 20 MB</div>
                      </div>
                    ) : (
                      <div style={{ border: `1px solid ${COLORS.green}`, borderRadius: 10, padding: "14px 18px", background: COLORS.greenLight, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <CheckCircle2 size={24} color={COLORS.green} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.green }}>Dokumen Resmi Sudah Ditandatangani</div>
                            <div style={{ fontSize: 11.5, color: COLORS.gray700 }}>
                              Tanggal TTD: <strong>{t.tglTTD}</strong> • File: <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.blue }}>{t.fileTTD}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPreview({
                                title: `Dokumen TTD: ${t.noSurat}`,
                                subtitle: `File: ${t.fileTTD}`,
                                type: "surat",
                                fileName: t.fileTTD,
                                content: {
                                  noSurat: t.noSurat,
                                  periode: t.periode,
                                  cutoff: t.cutoff,
                                  batchInfo: `${t.batch} — Telah Ditandatangani`,
                                  items: t.items,
                                  totalNominal: t.nominal
                                }
                              })
                            }
                          >
                            Lihat Dokumen
                          </Btn>
                        </div>
                      </div>
                    )}

                    {/* Postal Notification Note */}
                    <div style={{ background: COLORS.yellowLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#F57F17", display: "flex", gap: 8, marginBottom: 14 }}>
                      <Mail size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>SOP Dinas: Surat tagihan fisik yang sudah ditandatangani asli dikirimkan ke Direktorat Jenderal Perbendaharaan Kemenkeu melalui ekspedisi pos kedinasan.</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <Btn
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPreview({
                            title: `Surat Tagihan ${t.jenis} (${t.batch})`,
                            subtitle: `${t.noSurat} • Periode ${t.periode}`,
                            type: "surat",
                            fileName: `Surat_Tagihan_${t.jenis.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
                            content: {
                              noSurat: t.noSurat,
                              periode: t.periode,
                              cutoff: t.cutoff,
                              batchInfo: `${t.batch} — ${t.acuan}`,
                              items: t.items,
                              totalNominal: t.nominal
                            }
                          })
                        }
                      >
                        Download PDF Surat Tagihan
                      </Btn>
                      <Btn
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPreview({
                            title: `Rekapitulasi Iuran ${t.jenis} (${t.batch})`,
                            subtitle: `Periode ${t.periode} • ${t.peserta} peserta`,
                            type: "table",
                            fileName: `Rekap_Iuran_${t.jenis.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
                            content: {
                              columns: ["Instansi / Satker", "Jumlah Peserta", "Basis GP & Tunj", "Nominal Tagihan"],
                              rows: [
                                ["Tentara Nasional Indonesia (TNI)", "5.850", "Rp 468,00 M", "Rp 37,44 M"],
                                ["Kepolisian Negara RI (POLRI)", "4.730", "Rp 378,40 M", "Rp 30,27 M"],
                                ["Kementerian Pertahanan (KEMHAN)", "6.768", "Rp 473,80 M", "Rp 37,90 M"]
                              ],
                              totalRows: 12
                            }
                          })
                        }
                      >
                        Lihat Rekap Data Satker (Excel)
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
