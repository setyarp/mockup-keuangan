# YANDU NextGen — Divisi Keuangan
## UI Prototype | PT ASABRI (Persero)

Interactive prototype untuk 7 modul Divisi Keuangan YANDU NextGen.

---

## Prasyarat

Pastikan komputer Anda sudah terinstall **Node.js** versi 18 atau lebih baru.

Cek dengan command:
```bash
node --version
```

Jika belum punya Node.js, download di: https://nodejs.org (pilih versi LTS)

---

## Cara Menjalankan

### 1. Extract file ZIP

Extract file `yandu-ng-keuangan.zip` ke folder manapun.

### 2. Buka Terminal / Command Prompt

Masuk ke folder project:

**Windows (Command Prompt):**
```cmd
cd C:\path\ke\folder\yandu-ng-keuangan
```

**Mac / Linux:**
```bash
cd /path/ke/folder/yandu-ng-keuangan
```

### 3. Install Dependencies

```bash
npm install
```

Tunggu sampai selesai (biasanya 30-60 detik).

### 4. Jalankan Aplikasi

```bash
npm run dev
```

### 5. Buka di Browser

Setelah command di atas berjalan, akan muncul pesan seperti:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Browser akan terbuka otomatis. Jika tidak, buka manual: **http://localhost:3000**

### 6. Selesai!

Navigasi menggunakan sidebar di kiri untuk menjelajahi seluruh modul.

---

## Menghentikan Aplikasi

Tekan `Ctrl + C` di terminal untuk menghentikan server.

---

## Struktur Modul

| Sidebar Menu                | Modul & User Story                  |
|-----------------------------|--------------------------------------|
| Dashboard Keuangan          | Overview seluruh divisi              |
| Kalkulator Iuran            | US-1.1 — THT, Dapen, JKK, JKm      |
| Rekonsiliasi SKP-PFK        | US-1.2 — Rekon vs Kemenkeu          |
| Generator Tagihan           | US-1.3 & 1.4 — Tagihan otomatis     |
| Dana & Rekening Koran       | US-2.2 & 2.7 — Monitoring + Upload  |
| Monitoring Klaim JKK        | US-2.3 — Tracking klaim             |
| Kredit & Piutang            | US-3.x — Flagging, PUM KPR, UDW     |
| PPh 21 & Bukti Potong       | US-4.x — Perpajakan                 |
| Dashboard DIPA              | US-5.x — Pagu & SP2D                |
| Rekonsiliasi BPJS           | US-6.x — BPJS Kesehatan             |
| Generator Laporan           | US-7.x — 32+ format laporan         |

---

## Troubleshooting

| Masalah                          | Solusi                                          |
|----------------------------------|-------------------------------------------------|
| `node: command not found`        | Install Node.js dari https://nodejs.org         |
| `npm install` error              | Hapus `node_modules`, jalankan `npm install` ulang |
| Port 3000 sudah dipakai          | Edit `vite.config.js`, ganti port ke 3001       |
| Halaman blank / error di browser | Buka DevTools (F12), cek tab Console            |
# mockup-keuangan
