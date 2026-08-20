# 📐 Spesifikasi Rumus & Logika Bisnis (Backend Reference)
## Sistem Manajemen & Divisi Keuangan YANDU NEXTGEN ASABRI

Dokumen ini berisi kumpulan rumus, formula matematis, dan aturan bisnis (*business logic*) resmi yang digunakan pada modul-modul keuangan. Dokumen ini ditujukan sebagai **panduan spesifikasi bagi tim Backend / Database Developer / Data Engineer** saat mengimplementasikan API, kalkulasi otomatis, dan stored procedures.

---

## 1. 🏛️ Pengendalian Anggaran & DIPA (`DashboardDIPA`)

### A. Formula Realisasi Dana Pensiun (Netto)
Pagu DIPA yang terserap riil setiap bulan dihitung berdasarkan nilai Rekapitulasi Pembayaran Pensiun setelah dikurangi kompensasi Lebih Bayar Pajak dan pengembalian Saldo Uang Pensiun:

$$\mathbf{Dana\ Realisasi\ Netto} = \mathbf{Rekap\ III} - \mathbf{LB} - \mathbf{SUP}$$

#### Parameter:
1. **$\text{Rekap III}$ (Rekapitulasi III DAPEM):**
   * Total kebutuhan kotor (*gross amount*) tagihan pembayaran pensiun yang diterbitkan pada modul DAPEM untuk 4 kelompok MAK (`513113`, `513114`, `513122`, `513123`).
2. **$\text{LB}$ (Lebih Bayar Pajak):**
   * Kompensasi atau pengembalian kelebihan setor pajak penghasilan (PPh 21) dari tahun anggaran sebelumnya.
   * *Karakteristik:* Umumnya terjadi dan diperhitungkan pada **bulan Januari** (awal tahun anggaran).
3. **$\text{SUP}$ (Saldo Uang Pensiun):**
   * Penarikan kembali (*reversal / retur dana*) uang pensiun dari rekening peserta yang **tidak melakukan otentikasi biometrik/kehadiran selama 45 hari kalender** sejak dana disalurkan ke rekening bank/mitra bayar.
   * Dana ditarik kembali ke kas pengelola/kas negara sehingga mengurangi realisasi DIPA riil.

---

### B. Formula Threshold Alert Ketahanan Pagu (Runway Alert)
Sistem memonitor kecukupan pagu secara otomatis dengan memproyeksikan kebutuhan sisa tahun anggaran berdasarkan laju realisasi bulan terakhir:

$$\mathbf{Threshold\ Kebutuhan\ Sisa\ Tahun} = \mathbf{Realisasi\ Bulan\ Terakhir\ (R_n)} \times \mathbf{(12 - n)}$$

$$\mathbf{Runway\ (Ketahanan\ Bulan)} = \frac{\mathbf{Sisa\ Pagu\ DIPA}}{\mathbf{Realisasi\ Bulan\ Terakhir\ (R_n)}}$$

#### Logika Evaluasi Sistem:
* **$n$**: Indeks bulan berjalan saat ini ($1 \le n \le 12$, misal Juli = $7$).
* **Sisa Bulan**: $12 - n$ (misal $12 - 7 = 5$ bulan, yaitu Agustus s.d. Desember).
* **Kondisi Alert Kritis:**
  $$\text{Sisa Pagu DIPA} < \text{Threshold Kebutuhan Sisa Tahun}$$
* **Estimasi Defisit Anggaran:**
  $$\text{Defisit} = \max(0, \text{Threshold Kebutuhan} - \text{Sisa Pagu DIPA})$$

---

## 2. 👥 Pembayaran Pensiun & DAPEM (`PembayaranPensiun`)

### A. Struktur Perhitungan Matriks Rekapitulasi III
Perhitungan DAPEM per kelompok MAK dan jenis pensiun (Sendiri, Warakawuri/Janda/Duda, Yatim Piatu, Orang Tua):

$$\mathbf{Total\ Bruto} = Gaji\ Pokok + T.Keluarga + T.Beras + T.Cacat + T.Lain$$

$$\mathbf{Total\ Potongan} = PPh\ 21 + ASKES\ (BPJS) + TGR + Non\ TGR + Pot.Lain$$

$$\mathbf{Jumlah\ Netto} = \mathbf{Total\ Bruto} - \mathbf{Total\ Potongan}$$

#### 4 Kelompok MAK Utama:
* `513113` — Belanja Pensiun PNS Kemenhan
* `513114` — Belanja Pensiun PNS Polri
* `513122` — Belanja Pensiun TNI (AD, AL, AU)
* `513123` — Belanja Pensiun POLRI

---

## 3. 🏥 Rekonsiliasi BPJS Kesehatan / ASKES (`RekonBPJS`)

### A. Pemadanan Tagihan vs Rekapitulasi III
$$\mathbf{Target\ Iuran\ BPJS} = \sum \text{Kolom Potongan ASKES pada Rekapitulasi III DAPEM}$$

$$\mathbf{Selisih\ Kompensasi\ (+/-)} = \mathbf{Realisasi\ Setoran\ Kas\ Negara\ (NTPN)} - \mathbf{Target\ Iuran\ BPJS}$$

* **Match (Selaras):** $\text{Selisih} = 0$
* **Lebih Setor:** $\text{Selisih} > 0$
* **Kurang Setor:** $\text{Selisih} < 0$

---

## 4. 💼 Kemitraan Asuransi Taspen Life (`TaspenPolis` & `TaspenImbalJasa`)

### A. Tarif Imbal Jasa (Management Fee / Fee Base)
Dihitung dari total premi bruto per program asuransi:

| Kelompok Program | Sub-Program | Kode Program | Formula Tarif Imbal Jasa |
| :--- | :--- | :--- | :--- |
| **Taspen Dwiguna Sejahtera (TDS)** | Tabungan Hari Tua (Khusus Pensiunan) | `TDS` | $\text{Imbal Jasa} = 2{,}50\% \times \text{Premi Bruto}$ |
| **Taspen Proteksi Beasiswa (TPB)** | Proteksi Beasiswa JKK | `TPB_JKK` | $\text{Imbal Jasa} = 3{,}00\% \times \text{Premi Bruto}$ |
| **Taspen Proteksi Beasiswa (TPB)** | Proteksi Beasiswa JKm | `TPB_JKM` | $\text{Imbal Jasa} = 3{,}00\% \times \text{Premi Bruto}$ |

> [!NOTE]
> **Kaidah Bisnis Khusus TDS (Pensiunan):**
> Premi program TDS dipotong langsung dari saldo Tabungan Asuransi (TA) peserta pensiun dalam **kelipatan Rp 6.000.000** selama saldo TA mencukupi. Pemotongan tidak menerbitkan SP mandiri, melainkan mengikuti SP pembayaran Tabungan Asuransi (SP TA).

### B. Perpajakan Imbal Jasa (Format Resmi BRD V5 Line 271–273)
Sesuai regulasi PPN Nilai Lain (DPP $\frac{11}{12}$) dan UU Harmonisasi Peraturan Perpajakan (HPP):

$$\text{Imbal Jasa Bruto} = \text{Nominal Premi} \times \text{Tarif Fee}\ (2{,}5\%\ \text{atau}\ 3{,}0\%)$$

$$\text{DPP PPN Nilai Lain} = \frac{11}{12} \times \text{Imbal Jasa Bruto}$$

$$\text{PPN (12\%)} = +12\% \times \text{DPP PPN} \quad \left( = 11\% \times \text{Imbal Jasa Bruto} \right)$$

$$\text{PPh Pasal 23 (2\%)} = -2\% \times \text{Imbal Jasa Bruto}$$

$$\mathbf{Jumlah\ Tagihan\ Bruto} = \text{Imbal Jasa Bruto} + \text{PPN}$$

$$\mathbf{Imbal\ Jasa\ Diterima\ (Neto)} = \text{Imbal Jasa Bruto} + \text{PPN} - \text{PPh 23}$$

### C. Denda Keterlambatan Pembayaran Imbal Jasa (BRD Line 275–277)
Jika pembayaran imbal jasa dari mitra bayar / Taspen Life melewati batas jatuh tempo (**14 hari kerja** setelah surat tagihan asli diterima):

$$\mathbf{Denda} = \mathbf{Jumlah\ Tagihan} \times \mathbf{BI\ RATE} \times \frac{\mathbf{Jumlah\ Hari\ Keterlambatan}}{365\ \text{Hari}}$$

* **Acuan Suku Bunga:** BI 7-Day (Reverse) Repo Rate yang berlaku (misal $5{,}75\%$).
* **Pembulatan:** Nilai denda dibulatkan ke rupiah penuh terdekat.

### D. Validasi NIK Peserta (BR-TL-07)
* NIK tidak valid ($< 16$ digit atau kosong) ditandai dengan status **Exception (Pengecualian)**.
* **Aturan Bisnis:** Status *Exception* **tidak membatalkan atau memblokir** proses pembayaran premi periode berjalan.

---

## 5. 💰 Perhitungan & Rekonsiliasi Iuran Peserta (`KalkulatorIuran` & `RekonsIuran`)

### A. Formula Iuran per Program
Dihitung dari basis gaji pokok dan tunjangan keluarga peserta aktif:

$$\text{Basis Gaji (THT \& Pensiun)} = Gaji\ Pokok + Tunjangan\ Istri/Suami + Tunjangan\ Anak$$

| Jenis Iuran | Tarif | Basis Perhitungan |
| :--- | :--- | :--- |
| **Iuran THT** | $3{,}25\%$ | $\text{Basis Gaji (Pokok + T.Keluarga)}$ |
| **Iuran Pensiun** | $4{,}75\%$ | $\text{Basis Gaji (Pokok + T.Keluarga)}$ |
| **Iuran JKK** | $0{,}41\%$ | $Gaji\ Pokok$ |
| **Iuran JKm** | $0{,}67\%$ | $Gaji\ Pokok$ |

### B. Rekonsiliasi Penerimaan vs SKP-PFK Kemenkeu
$$\mathbf{Selisih\ Iuran} = \mathbf{Realisasi\ Penerimaan\ Kas\ (SKP-PFK)} - \mathbf{Kalkulasi\ Target\ Sistem}$$

---

## 6. 📊 Administrasi Perpajakan & UKP (`Perpajakan` & `RekapUKP`)

### A. Skema PPh 21 TER vs Pasal 17
* **TER (Tarif Efektif Rata-Rata):** Diterapkan bulanan (Masa Januari s.d. November) sesuai Kategori A, B, atau C berdasarkan status PTKP.
* **Pasal 17 UU HPP (Masa Pajak Terakhir / Desember):**
  $$\text{PPh 21 Kurang/Lebih Bayar} = \text{PPh 21 Tahunan (Pasal 17)} - \sum_{i=1}^{11} \text{PPh 21 TER Bulanan}$$

---

## 7. 🏷️ Penarikan Piutang & UDW Punah (`KreditPiutang`)
* Penarikan kelebihan bayar **Uang Duka Wafat (UDW)** dan hak pensiun bagi penerima yang tercatat punah (meninggal dunia tanpa ada ahli waris sah yang berhak menerima tunjangan lanjutan).
