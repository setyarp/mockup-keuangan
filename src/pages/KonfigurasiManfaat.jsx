import { useState } from "react";
import {
  Building2,
  PackagePlus,
  TrendingUp,
  Receipt,
  Scale,
  Plus,
  Search,
  CheckCircle2,
  Edit2,
  Save,
  Calculator
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { Badge, Btn, Table, Select } from "../components/common";

export const KonfigurasiManfaat = () => {
  const [activeTab, setActiveTab] = useState("mitra"); // "mitra", "program", "pajak", "sukubunga"
  const [toastMessage, setToastMessage] = useState(null);

  // --- STATE: MASTER MITRA ---
  const [mitraList, setMitraList] = useState([
    {
      id: "MTR-01",
      nama: "PT Bank Rakyat Indonesia (Persero) Tbk",
      singkatan: "Bank BRI",
      kategori: "Bank Persepsi / Himbara",
      noRekening: "0210.01.000998.30.1",
      npwp: "01.000.013.1-093.000",
      status: "Aktif"
    },
    {
      id: "MTR-02",
      nama: "PT Bank Mandiri (Persero) Tbk",
      singkatan: "Bank Mandiri",
      kategori: "Bank Persepsi / Himbara",
      noRekening: "124.00.0988776.2",
      npwp: "01.000.014.9-093.000",
      status: "Aktif"
    },
    {
      id: "MTR-03",
      nama: "PT Bank Negara Indonesia (Persero) Tbk",
      singkatan: "Bank BNI",
      kategori: "Bank Persepsi / Himbara",
      noRekening: "0198.88.776655.1",
      npwp: "01.000.015.6-093.000",
      status: "Aktif"
    },
    {
      id: "MTR-04",
      nama: "PT Bank Tabungan Negara (Persero) Tbk",
      singkatan: "Bank BTN",
      kategori: "Bank Persepsi / Himbara",
      noRekening: "0012.01.500223.4",
      npwp: "01.000.016.4-093.000",
      status: "Aktif"
    },
    {
      id: "MTR-05",
      nama: "PT Pos Indonesia (Persero)",
      singkatan: "PT Pos Indonesia",
      kategori: "Lembaga Pos & Giro (3T)",
      noRekening: "098.22.441199.0",
      npwp: "01.000.017.2-093.000",
      status: "Aktif"
    },
    {
      id: "MTR-06",
      nama: "PT Bank Syariah Indonesia Tbk",
      singkatan: "Bank BSI",
      kategori: "Bank Syariah",
      noRekening: "7100.99.882233.1",
      npwp: "01.000.018.0-093.000",
      status: "Aktif"
    },
    {
      id: "MTR-07",
      nama: "PT Asuransi Jiwa Taspen (Taspen Life)",
      singkatan: "Taspen Life",
      kategori: "Perusahaan Asuransi Jiwa Mitra",
      noRekening: "124.00.8877112.9",
      npwp: "01.065.123.8-062.000",
      status: "Aktif"
    },
    {
      id: "MTR-08",
      nama: "PT Bank Mandiri Taspen (Bank Mantap)",
      singkatan: "Bank Mantap",
      kategori: "Bank Pensiun & Pembiayaan",
      noRekening: "554.01.223344.0",
      npwp: "01.099.887.6-041.000",
      status: "Aktif"
    }
  ]);

  const [searchMitra, setSearchMitra] = useState("");
  const [filterKategoriMitra, setFilterKategoriMitra] = useState("Semua Kategori");
  const [showModalMitra, setShowModalMitra] = useState(false);
  const [formMitra, setFormMitra] = useState({
    id: "",
    nama: "",
    singkatan: "",
    kategori: "Bank Persepsi / Himbara",
    noRekening: "",
    npwp: "",
    status: "Aktif"
  });

  // --- STATE: MASTER PROGRAM PENGEMBANGAN MANFAAT ---
  const [programList, setProgramList] = useState([
    {
      id: "PM-01",
      kode: "TDS",
      nama: "Taspen Dwiguna Sejahtera (TDS)",
      kategori: "Asuransi Sukarela Tambahan",
      mitraPengelola: "Taspen Life",
      skemaTarif: "Persentase Premi",
      tarifDasar: 2.5,
      satuan: "% Premi",
      noPKS: "PKS/ASABRI-TL/2024/001",
      status: "Aktif"
    },
    {
      id: "PM-02",
      kode: "TPB-JKK",
      nama: "Taspen Proteksi Beasiswa (TPB) - JKK",
      kategori: "Asuransi Sukarela Tambahan",
      mitraPengelola: "Taspen Life",
      skemaTarif: "Persentase Premi",
      tarifDasar: 3.0,
      satuan: "% Premi",
      noPKS: "PKS/ASABRI-TL/2024/002",
      status: "Aktif"
    },
    {
      id: "PM-03",
      kode: "TPB-JKM",
      nama: "Taspen Proteksi Beasiswa (TPB) - JKm",
      kategori: "Asuransi Sukarela Tambahan",
      mitraPengelola: "Taspen Life",
      skemaTarif: "Persentase Premi",
      tarifDasar: 3.0,
      satuan: "% Premi",
      noPKS: "PKS/ASABRI-TL/2024/003",
      status: "Aktif"
    },
    {
      id: "PM-04",
      kode: "FLAG-KREDIT",
      nama: "Flagging Kredit Pinjaman Pensiun",
      kategori: "Fasilitas Perbankan & Kredit",
      mitraPengelola: "Bank Mandiri, BRI, BNI, BTN, BSI, Mantap",
      skemaTarif: "Persentase Plafon",
      tarifDasar: 1.0,
      satuan: "% Tagihan",
      noPKS: "PKS/ASABRI-HIMBARA/2025/089",
      status: "Aktif"
    },
    {
      id: "PM-05",
      kode: "AUTH-DIGITAL",
      nama: "Pemanfaatan Data Autentikasi Digital",
      kategori: "Layanan & Teknologi",
      mitraPengelola: "Seluruh Mitra Bayar",
      skemaTarif: "Fixed Fee",
      tarifDasar: 2500,
      satuan: "Rp/Peserta",
      noPKS: "PKS/ASABRI-MITRA/2025/112",
      status: "Aktif"
    },
    {
      id: "PM-06",
      kode: "PUM-KPR",
      nama: "Pinjaman Uang Muka KPR (PUM)",
      kategori: "Manfaat Tambahan Pinjaman",
      mitraPengelola: "Bank Mantap & Bank BTN",
      skemaTarif: "Persentase Margin",
      tarifDasar: 0.5,
      satuan: "% Pokok",
      noPKS: "PKS/ASABRI-MANTAP/2023/045",
      status: "Aktif"
    }
  ]);

  const [searchProgram, setSearchProgram] = useState("");
  const [filterKategoriProgram, setFilterKategoriProgram] = useState("Semua Kategori");
  const [showModalProgram, setShowModalProgram] = useState(false);
  const [formProgram, setFormProgram] = useState({
    id: "",
    kode: "",
    nama: "",
    kategori: "Asuransi Sukarela Tambahan",
    mitraPengelola: "",
    skemaTarif: "Persentase Premi",
    tarifDasar: 2.5,
    satuan: "% Premi",
    noPKS: "",
    status: "Aktif"
  });

  // --- STATE: PARAMETER PERPAJAKAN (RINGKAS) ---
  const [pph23Rate, setPph23Rate] = useState(2.0);
  const [ppnRate, setPpnRate] = useState(12.0);
  const [dppRatio, setDppRatio] = useState("11/12");
  const [simulasiBruto, setSimulasiBruto] = useState(100000000);

  // --- STATE: PARAMETER SUKU BUNGA & DENDA (RINGKAS) ---
  const [biRate, setBiRate] = useState(6.00);
  const [graceDays, setGraceDays] = useState(14);
  const [basisTahun, setBasisTahun] = useState(365);
  const [simulasiTagihan, setSimulasiTagihan] = useState(500000000);
  const [simulasiHari, setSimulasiHari] = useState(10);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fmt = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

  // Kalkulasi Pajak
  const dppVal = (11 / 12) * (Number(simulasiBruto) || 0);
  const ppnVal = (ppnRate / 100) * dppVal;
  const pphVal = (pph23Rate / 100) * (Number(simulasiBruto) || 0);
  const totalTagihanPajak = (Number(simulasiBruto) || 0) + ppnVal;
  const nettoDiterimaPajak = totalTagihanPajak - pphVal;

  // Kalkulasi Denda
  const dendaVal = Math.round(((Number(simulasiTagihan) || 0) * (biRate / 100) * (Number(simulasiHari) || 0)) / basisTahun);
  const totalBayarDenda = (Number(simulasiTagihan) || 0) + dendaVal;

  // Save Mitra
  const handleSaveMitra = (e) => {
    e.preventDefault();
    if (!formMitra.nama || !formMitra.singkatan) return;
    const newId = formMitra.id || `MTR-0${mitraList.length + 1}`;
    if (formMitra.id) {
      setMitraList(mitraList.map((m) => (m.id === formMitra.id ? { ...formMitra } : m)));
      triggerToast(`Data mitra "${formMitra.singkatan}" berhasil diperbarui.`);
    } else {
      setMitraList([...mitraList, { ...formMitra, id: newId }]);
      triggerToast(`Mitra baru "${formMitra.singkatan}" berhasil ditambahkan.`);
    }
    setShowModalMitra(false);
  };

  // Save Program
  const handleSaveProgram = (e) => {
    e.preventDefault();
    if (!formProgram.nama || !formProgram.kode) return;
    const newId = formProgram.id || `PM-0${programList.length + 1}`;
    if (formProgram.id) {
      setProgramList(programList.map((p) => (p.id === formProgram.id ? { ...formProgram } : p)));
      triggerToast(`Program "${formProgram.kode}" berhasil diperbarui.`);
    } else {
      setProgramList([...programList, { ...formProgram, id: newId }]);
      triggerToast(`Program "${formProgram.nama}" berhasil ditambahkan.`);
    }
    setShowModalProgram(false);
  };

  const filteredMitra = mitraList.filter((m) => {
    if (filterKategoriMitra !== "Semua Kategori" && m.kategori !== filterKategoriMitra) return false;
    if (searchMitra && !m.nama.toLowerCase().includes(searchMitra.toLowerCase()) && !m.singkatan.toLowerCase().includes(searchMitra.toLowerCase())) return false;
    return true;
  });

  const filteredProgram = programList.filter((p) => {
    if (filterKategoriProgram !== "Semua Kategori" && p.kategori !== filterKategoriProgram) return false;
    if (searchProgram && !p.nama.toLowerCase().includes(searchProgram.toLowerCase()) && !p.kode.toLowerCase().includes(searchProgram.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1E293B",
            color: COLORS.white,
            padding: "12px 18px",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 1500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            borderLeft: `4px solid ${COLORS.green}`
          }}
        >
          <CheckCircle2 size={18} color={COLORS.green} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODAL MITRA */}
      {showModalMitra && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20
          }}
          onClick={() => setShowModalMitra(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 10,
              width: 520,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.gray900 }}>
                {formMitra.id ? "Edit Data Mitra" : "Tambah Mitra Baru"}
              </h3>
              <button onClick={() => setShowModalMitra(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
            </div>

            <form onSubmit={handleSaveMitra} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Nama Lengkap Badan / Mitra *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Bank Rakyat Indonesia (Persero) Tbk"
                    value={formMitra.nama}
                    onChange={(e) => setFormMitra({ ...formMitra, nama: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Singkatan / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bank BRI"
                      value={formMitra.singkatan}
                      onChange={(e) => setFormMitra({ ...formMitra, singkatan: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Kategori
                    </label>
                    <select
                      value={formMitra.kategori}
                      onChange={(e) => setFormMitra({ ...formMitra, kategori: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, background: COLORS.white }}
                    >
                      <option value="Bank Persepsi / Himbara">Bank Persepsi / Himbara</option>
                      <option value="Bank Syariah">Bank Syariah</option>
                      <option value="Perusahaan Asuransi Jiwa Mitra">Perusahaan Asuransi Jiwa Mitra</option>
                      <option value="Bank Pensiun & Pembiayaan">Bank Pensiun & Pembiayaan</option>
                      <option value="Lembaga Pos & Giro (3T)">Lembaga Pos & Giro (3T)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      No. Rekening Giro CMS
                    </label>
                    <input
                      type="text"
                      placeholder="0210.01.000998.30.1"
                      value={formMitra.noRekening}
                      onChange={(e) => setFormMitra({ ...formMitra, noRekening: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      NPWP Badan
                    </label>
                    <input
                      type="text"
                      placeholder="01.000.000.0-000.000"
                      value={formMitra.npwp}
                      onChange={(e) => setFormMitra({ ...formMitra, npwp: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Status
                  </label>
                  <select
                    value={formMitra.status}
                    onChange={(e) => setFormMitra({ ...formMitra, status: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, background: COLORS.white }}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Btn variant="outline" type="button" onClick={() => setShowModalMitra(false)}>
                  Batal
                </Btn>
                <Btn variant="primary" type="submit">
                  Simpan Mitra
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROGRAM */}
      {showModalProgram && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20
          }}
          onClick={() => setShowModalProgram(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 10,
              width: 540,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.gray900 }}>
                {formProgram.id ? "Edit Program Pengembangan Manfaat" : "Tambah Program Manfaat Baru"}
              </h3>
              <button onClick={() => setShowModalProgram(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: COLORS.gray400 }}>✕</button>
            </div>

            <form onSubmit={handleSaveProgram} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Nama Program *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Asuransi Jiwa Tambahan"
                      value={formProgram.nama}
                      onChange={(e) => setFormProgram({ ...formProgram, nama: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Kode Program *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: TDS"
                      value={formProgram.kode}
                      onChange={(e) => setFormProgram({ ...formProgram, kode: e.target.value.toUpperCase() })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontFamily: "monospace" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Kategori
                    </label>
                    <select
                      value={formProgram.kategori}
                      onChange={(e) => setFormProgram({ ...formProgram, kategori: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, background: COLORS.white }}
                    >
                      <option value="Asuransi Sukarela Tambahan">Asuransi Sukarela Tambahan</option>
                      <option value="Fasilitas Perbankan & Kredit">Fasilitas Perbankan & Kredit</option>
                      <option value="Layanan & Teknologi">Layanan & Teknologi</option>
                      <option value="Manfaat Tambahan Pinjaman">Manfaat Tambahan Pinjaman</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Mitra Pengelola
                    </label>
                    <input
                      type="text"
                      placeholder="Taspen Life / Bank Himbara"
                      value={formProgram.mitraPengelola}
                      onChange={(e) => setFormProgram({ ...formProgram, mitraPengelola: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Tarif Dasar
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={formProgram.tarifDasar}
                      onChange={(e) => setFormProgram({ ...formProgram, tarifDasar: parseFloat(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                      Satuan
                    </label>
                    <input
                      type="text"
                      placeholder="% Premi / Rp/Peserta"
                      value={formProgram.satuan}
                      onChange={(e) => setFormProgram({ ...formProgram, satuan: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    No. Dokumen PKS
                  </label>
                  <input
                    type="text"
                    placeholder="PKS/ASABRI-TL/2026/001"
                    value={formProgram.noPKS}
                    onChange={(e) => setFormProgram({ ...formProgram, noPKS: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Btn variant="outline" type="button" onClick={() => setShowModalProgram(false)}>
                  Batal
                </Btn>
                <Btn variant="primary" type="submit">
                  Simpan Program
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION TABS */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: 8,
          padding: 6,
          border: `1px solid ${COLORS.gray200}`,
          marginBottom: 18,
          display: "flex",
          gap: 6
        }}
      >
        {[
          { id: "mitra", label: "Master Mitra", icon: Building2, count: mitraList.length },
          { id: "program", label: "Master Program Manfaat", icon: PackagePlus, count: programList.length },
          { id: "pajak", label: "Parameter Perpajakan", icon: Receipt },
          { id: "sukubunga", label: "Parameter Suku Bunga & Denda", icon: TrendingUp }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: isActive ? COLORS.blueDark : "transparent",
                color: isActive ? COLORS.white : COLORS.gray700
              }}
            >
              <Icon size={15} color={isActive ? COLORS.white : COLORS.gray600} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "1px 6px",
                    borderRadius: 10,
                    background: isActive ? "rgba(255,255,255,0.25)" : COLORS.gray100,
                    color: isActive ? COLORS.white : COLORS.gray700
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MASTER MITRA */}
      {/* ======================================================== */}
      {activeTab === "mitra" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 8,
              padding: 14,
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <div style={{ position: "relative", width: 280 }}>
                <Search size={15} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Cari nama mitra..."
                  value={searchMitra}
                  onChange={(e) => setSearchMitra(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px 7px 32px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5 }}
                />
              </div>
              <Select
                value={filterKategoriMitra}
                onChange={setFilterKategoriMitra}
                options={[
                  "Semua Kategori",
                  "Bank Persepsi / Himbara",
                  "Bank Syariah",
                  "Perusahaan Asuransi Jiwa Mitra",
                  "Bank Pensiun & Pembiayaan",
                  "Lembaga Pos & Giro (3T)"
                ]}
                minW={200}
              />
            </div>

            <Btn
              variant="primary"
              onClick={() => {
                setFormMitra({
                  id: "",
                  nama: "",
                  singkatan: "",
                  kategori: "Bank Persepsi / Himbara",
                  noRekening: "",
                  npwp: "",
                  status: "Aktif"
                });
                setShowModalMitra(true);
              }}
            >
              <Plus size={15} /> Tambah Mitra
            </Btn>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 8, padding: 16, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={["Kode", "Nama Mitra & Kategori", "No. Rekening Giro CMS", "NPWP Badan", "Status", "Aksi"]}
                data={filteredMitra.map((m) => [
                  <span style={{ fontWeight: 700, fontFamily: "monospace", color: COLORS.blueDark }}>{m.id}</span>,
                  <div>
                    <div style={{ fontWeight: 700, color: COLORS.gray900 }}>{m.singkatan}</div>
                    <div style={{ fontSize: 11.5, color: COLORS.gray500 }}>{m.nama}</div>
                  </div>,
                  <span style={{ fontFamily: "monospace", fontSize: 12.5 }}>{m.noRekening || "—"}</span>,
                  <span style={{ fontFamily: "monospace", fontSize: 12 }}>{m.npwp || "—"}</span>,
                  <Badge color={m.status === "Aktif" ? "green" : "gray"}>{m.status}</Badge>,
                  <button
                    onClick={() => {
                      setFormMitra(m);
                      setShowModalMitra(true);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: `1px solid ${COLORS.gray300}`,
                      background: COLORS.white,
                      color: COLORS.gray700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5
                    }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                ])}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MASTER PROGRAM MANFAAT */}
      {/* ======================================================== */}
      {activeTab === "program" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 8,
              padding: 14,
              border: `1px solid ${COLORS.gray200}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <div style={{ position: "relative", width: 280 }}>
                <Search size={15} color={COLORS.gray400} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Cari program..."
                  value={searchProgram}
                  onChange={(e) => setSearchProgram(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px 7px 32px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5 }}
                />
              </div>
              <Select
                value={filterKategoriProgram}
                onChange={setFilterKategoriProgram}
                options={[
                  "Semua Kategori",
                  "Asuransi Sukarela Tambahan",
                  "Fasilitas Perbankan & Kredit",
                  "Layanan & Teknologi",
                  "Manfaat Tambahan Pinjaman"
                ]}
                minW={200}
              />
            </div>

            <Btn
              variant="primary"
              onClick={() => {
                setFormProgram({
                  id: "",
                  kode: "",
                  nama: "",
                  kategori: "Asuransi Sukarela Tambahan",
                  mitraPengelola: "",
                  skemaTarif: "Persentase Premi",
                  tarifDasar: 2.5,
                  satuan: "% Premi",
                  noPKS: "",
                  status: "Aktif"
                });
                setShowModalProgram(true);
              }}
            >
              <Plus size={15} /> Tambah Program
            </Btn>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 8, padding: 16, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ overflowX: "auto" }}>
              <Table
                columns={["Kode", "Nama Program", "Kategori", "Mitra Pengelola", "Tarif Imbal Jasa", "No. PKS", "Status", "Aksi"]}
                data={filteredProgram.map((p) => [
                  <span style={{ fontWeight: 700, fontFamily: "monospace", color: COLORS.blueDark }}>{p.kode}</span>,
                  <span style={{ fontWeight: 600, color: COLORS.gray900 }}>{p.nama}</span>,
                  <span style={{ fontSize: 12, color: COLORS.gray600 }}>{p.kategori}</span>,
                  <span style={{ fontSize: 12, color: COLORS.gray800 }}>{p.mitraPengelola}</span>,
                  <span style={{ fontWeight: 700, color: COLORS.green }}>
                    {typeof p.tarifDasar === "number" && p.satuan.includes("%") ? `${p.tarifDasar}%` : fmt(p.tarifDasar)} ({p.satuan})
                  </span>,
                  <span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{p.noPKS}</span>,
                  <Badge color={p.status === "Aktif" ? "green" : "gray"}>{p.status}</Badge>,
                  <button
                    onClick={() => {
                      setFormProgram(p);
                      setShowModalProgram(true);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: `1px solid ${COLORS.gray300}`,
                      background: COLORS.white,
                      color: COLORS.gray700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5
                    }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                ])}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PARAMETER PERPAJAKAN (RINGKAS & BERSIH) */}
      {/* ======================================================== */}
      {activeTab === "pajak" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
          {/* Card Parameter */}
          <div style={{ background: COLORS.white, borderRadius: 8, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Receipt size={18} color={COLORS.blueDark} />
              <span>Pengaturan Tarif Pajak</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tarif PPh 23 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pph23Rate}
                    onChange={(e) => setPph23Rate(parseFloat(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Tarif PPN (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={ppnRate}
                    onChange={(e) => setPpnRate(parseFloat(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                  Formula DPP PPN Nilai Lain
                </label>
                <select
                  value={dppRatio}
                  onChange={(e) => setDppRatio(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, background: COLORS.white }}
                >
                  <option value="11/12">11/12 × Imbal Jasa (Standar PMK)</option>
                  <option value="100/112">100/112 × Imbal Jasa</option>
                  <option value="1/1">100% Penuh</option>
                </select>
              </div>

              <div style={{ marginTop: 6 }}>
                <Btn variant="primary" onClick={() => triggerToast("Parameter perpajakan berhasil disimpan.")}>
                  Simpan Parameter Pajak
                </Btn>
              </div>
            </div>
          </div>

          {/* Card Simulasi */}
          <div style={{ background: COLORS.white, borderRadius: 8, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Calculator size={18} color={COLORS.green} />
              <span>Simulasi Perhitungan</span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4 }}>
                Nominal Imbal Jasa (Rp)
              </label>
              <input
                type="number"
                step="10000000"
                value={simulasiBruto}
                onChange={(e) => setSimulasiBruto(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}
              />
            </div>

            <div style={{ background: COLORS.gray50, padding: 12, borderRadius: 6, display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>DPP ({dppRatio}):</span>
                <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{fmt(dppVal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#166534" }}>
                <span>PPN ({ppnRate}%):</span>
                <span style={{ fontWeight: 600, fontFamily: "monospace" }}>+{fmt(ppnVal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}>
                <span>PPh 23 ({pph23Rate}%):</span>
                <span style={{ fontWeight: 600, fontFamily: "monospace" }}>-{fmt(pphVal)}</span>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700, color: COLORS.blueDark }}>
                <span>Netto Kas Diterima:</span>
                <span style={{ fontFamily: "monospace", fontSize: 13.5 }}>{fmt(nettoDiterimaPajak)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PARAMETER SUKU BUNGA & DENDA (RINGKAS & BERSIH) */}
      {/* ======================================================== */}
      {activeTab === "sukubunga" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
          {/* Card Parameter */}
          <div style={{ background: COLORS.white, borderRadius: 8, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} color={COLORS.blueDark} />
              <span>Pengaturan Suku Bunga & Denda</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Suku Bunga BI-Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={biRate}
                    onChange={(e) => setBiRate(parseFloat(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                    Jatuh Tempo (Hari Kerja)
                  </label>
                  <input
                    type="number"
                    value={graceDays}
                    onChange={(e) => setGraceDays(parseInt(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray700, display: "block", marginBottom: 4 }}>
                  Basis Hari Kalender / Tahun
                </label>
                <input
                  type="number"
                  value={basisTahun}
                  onChange={(e) => setBasisTahun(parseInt(e.target.value) || 365)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13 }}
                />
              </div>

              <div style={{ fontSize: 11.5, color: COLORS.gray500, fontFamily: "monospace" }}>
                Formula: (Tagihan × BI-Rate × Hari Terlambat) ÷ {basisTahun}
              </div>

              <div style={{ marginTop: 4 }}>
                <Btn variant="primary" onClick={() => triggerToast("Parameter suku bunga & denda berhasil disimpan.")}>
                  Simpan Parameter Suku Bunga
                </Btn>
              </div>
            </div>
          </div>

          {/* Card Simulasi */}
          <div style={{ background: COLORS.white, borderRadius: 8, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray900, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Scale size={18} color={COLORS.orange} />
              <span>Simulasi Denda Keterlambatan Imbal Jasa</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4 }}>
                  Nominal Tagihan (Rp)
                </label>
                <input
                  type="number"
                  step="10000000"
                  value={simulasiTagihan}
                  onChange={(e) => setSimulasiTagihan(parseFloat(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.gray600, display: "block", marginBottom: 4 }}>
                  Hari Terlambat
                </label>
                <input
                  type="number"
                  value={simulasiHari}
                  onChange={(e) => setSimulasiHari(parseInt(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 13, fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ background: COLORS.gray50, padding: 12, borderRadius: 6, display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.gray600 }}>Suku Bunga Acuan:</span>
                <span style={{ fontWeight: 600 }}>{biRate}% p.a.</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#B45309" }}>
                <span style={{ fontWeight: 600 }}>Denda ({simulasiHari} hari):</span>
                <span style={{ fontWeight: 700, fontFamily: "monospace" }}>+{fmt(dendaVal)}</span>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.gray200}`, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700, color: COLORS.gray900 }}>
                <span>Total Pembayaran:</span>
                <span style={{ fontFamily: "monospace", fontSize: 13.5, color: COLORS.blueDark }}>{fmt(totalBayarDenda)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
