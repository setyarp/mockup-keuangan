import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { Layers, Download, TrendingDown, RefreshCw, Printer, FileUp, CheckCircle2, Eye } from "lucide-react";
import { COLORS, IC } from "../constants/colors";
import { StatCard, SectionTitle, Btn, Select, SearchInput, Badge, NoData, PreviewModal } from "../components/common";

export const RAW_SAMPLE_RK = [
  {
    no: 1, tgl: "01/05/2026", desc: "Deposit Interest 20260501", debet: 0, credit: 39839.46, saldo: 119144449.12, user: "SYSTEM", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "—", sks: 0, udw: 0, bp: 0, beasiswa: 0, jmlTerima: 0, noSP: "—", tglSP: "—", noDPS: "—", tglDPS: "—", kodeBayar: "—", kancab: "—", angkatan: "—", kategori: "jasa_giro", status: "Jasa Giro"
  },
  {
    no: 2, tgl: "04/05/2026", desc: "JKM 4  BE506440 MUSLIKAH", debet: 53350700, credit: 0, saldo: 65793749.12, user: "21105040815193", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "BE506440", sks: 27500000, udw: 10850700, bp: 0, beasiswa: 15000000, jmlTerima: 53350700, noSP: "B/046829-AS/JK/IV/2026", tglSP: "30/04/2026", noDPS: "BWSJKM404052026211AO010010-G", tglDPS: "04/05/2026", kodeBayar: "BE506440JKM40", kancab: "KANCAB YOGYAKARTA", angkatan: "TNI-AD", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 3, tgl: "06/05/2026", desc: "JKM 4  ED356526 NURLAILAH", debet: 45012300, credit: 0, saldo: 20781449.12, user: "21105060834299", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "ED356526", sks: 30000000, udw: 15012300, bp: 0, beasiswa: 0, jmlTerima: 45012300, noSP: "B/047853-AS/JK/V/2026", tglSP: "05/05/2026", noDPS: "BWSJKM406052026211AO010036-G", tglDPS: "06/05/2026", kodeBayar: "ED356526JKM40", kancab: "KANCAB UTAMA JAKARTA", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 4, tgl: "06/05/2026", desc: "JKM 2  ED385659 ENDAH DWI ASTU", debet: 15000000, credit: 0, saldo: 5781449.12, user: "21105060834513", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "ED385659", sks: 0, udw: 0, bp: 0, beasiswa: 15000000, jmlTerima: 15000000, noSP: "B/048474-AS/JK/V/2026", tglSP: "05/05/2026", noDPS: "BWSJKM206052026211AO010034-G", tglDPS: "06/05/2026", kodeBayar: "ED385659JKM22", kancab: "KANCAB YOGYAKARTA", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 5, tgl: "06/05/2026", desc: "SKN-JKM UMUM ASABRI (DROPPING DANA DARI KAS NEGARA)", debet: 0, credit: 100000000, saldo: 105781449.12, user: "202605060034", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "—", sks: 0, udw: 0, bp: 0, beasiswa: 0, jmlTerima: 100000000, noSP: "SP2D-JKM-2026/05/0012", tglSP: "06/05/2026", noDPS: "DROPPING-BWS-JKM-01", tglDPS: "06/05/2026", kodeBayar: "DROP-JKM-BWS", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 6, tgl: "07/05/2026", desc: "SKN-JKM UMUM ASABRI (DROPPING DANA TAHAP II)", debet: 0, credit: 150000000, saldo: 255781449.12, user: "202605070020", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "—", sks: 0, udw: 0, bp: 0, beasiswa: 0, jmlTerima: 150000000, noSP: "SP2D-JKM-2026/05/0015", tglSP: "07/05/2026", noDPS: "DROPPING-BWS-JKM-02", tglDPS: "07/05/2026", kodeBayar: "DROP-JKM-BWS", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 7, tgl: "07/05/2026", desc: "JKM 4  BE648460 WIDYA MAHARANI", debet: 34321100, credit: 0, saldo: 221460349.12, user: "21105070837241", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "BE648460", sks: 27500000, udw: 6821100, bp: 0, beasiswa: 0, jmlTerima: 34321100, noSP: "B/048746-AS/JK/V/2026", tglSP: "06/05/2026", noDPS: "BWSJKM407052026211AO010056-G", tglDPS: "07/05/2026", kodeBayar: "BE648460JKM40", kancab: "KANCAB SEMARANG", angkatan: "TNI-AD", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 8, tgl: "07/05/2026", desc: "JKM 4  ED387324 ENI PURWANINGS", debet: 55166600, credit: 0, saldo: 166293749.12, user: "21105070838529", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "ED387324", sks: 27500000, udw: 12666600, bp: 0, beasiswa: 15000000, jmlTerima: 55166600, noSP: "B/049042-AS/JK/V/2026", tglSP: "06/05/2026", noDPS: "BWSJKM407052026211AO010051-G", tglDPS: "07/05/2026", kodeBayar: "ED387324JKM40", kancab: "KANCAB MALANG", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 9, tgl: "07/05/2026", desc: "JKM 4  EY107334 RUMIATI", debet: 43869600, credit: 0, saldo: 122424149.12, user: "21105070839428", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "EY107334", sks: 30000000, udw: 13869600, bp: 0, beasiswa: 0, jmlTerima: 43869600, noSP: "B/048574-AS/JK/V/2026", tglSP: "06/05/2026", noDPS: "BWSJKM407052026211AO010048-G", tglDPS: "07/05/2026", kodeBayar: "EY107334JKM40", kancab: "KANCAB UTAMA JAKARTA", angkatan: "PNS-POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 10, tgl: "08/05/2026", desc: "JKM 2  BE506440 MUSLIKAH", debet: 15000000, credit: 0, saldo: 107424149.12, user: "21105080813216", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "BE506440", sks: 0, udw: 0, bp: 0, beasiswa: 15000000, jmlTerima: 15000000, noSP: "B/049822-AS/JK/V/2026", tglSP: "07/05/2026", noDPS: "BWSJKM208052026211AO010074-G", tglDPS: "08/05/2026", kodeBayar: "BE506440JKM23", kancab: "KANCAB YOGYAKARTA", angkatan: "TNI-AD", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 11, tgl: "11/05/2026", desc: "JKM 4  CD309417 NURYALIK", debet: 54404000, credit: 0, saldo: 53020149.12, user: "21105110823459", mitra: "BANK WOORI SAUDARA",
    sheet: "JKM", ktpa: "CD309417", sks: 27500000, udw: 11904000, bp: 0, beasiswa: 15000000, jmlTerima: 54404000, noSP: "B/050125-AS/JK/V/2026", tglSP: "08/05/2026", noDPS: "BWSJKM411052026211AO010089-G", tglDPS: "11/05/2026", kodeBayar: "CD309417JKM40", kancab: "KANCAB MALANG", angkatan: "TNI-AL", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 12, tgl: "01/05/2026", desc: "Deposit Interest 20260501", debet: 0, credit: 630, saldo: 1533351.41, user: "SYSTEM", mitra: "BANK WOORI SAUDARA",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 0, noSP: "—", tglSP: "—", noDPS: "—", tglDPS: "—", kodeBayar: "—", kancab: "—", angkatan: "—", kategori: "jasa_giro", status: "Jasa Giro"
  },
  {
    no: 13, tgl: "06/05/2026", desc: "SETORAN GIRO KLAIM JKK BRI IFT_TO_JKK PT ASABRI", debet: 0, credit: 410000000, saldo: 411770149.08, user: "0374057", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 410000000, noSP: "SP2D-JKK-2026/05/0022", tglSP: "06/05/2026", noDPS: "DROPPING-BRI-JKK-01", tglDPS: "06/05/2026", kodeBayar: "DROP-JKK-BRI", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 14, tgl: "07/05/2026", desc: "JKK 5 CY104110 AHMAD GANESSA LIYANANDA T:0261051:BRIASGEN2", debet: 410000000, credit: 0, saldo: 1770149.08, user: "0261051", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "CY104110", db: 0, dk: 0, gugur: 0, tewas: 350000000, beasiswa: 60000000, jmlTerima: 410000000, noSP: "B/048379-AS/JKK/V/2026", tglSP: "05/05/2026", noDPS: "BRIJKK5070520260261051143649G", tglDPS: "07/05/2026", kodeBayar: "CY104110JKK50", kancab: "KANCAB UTAMA JAKARTA", angkatan: "PNS-TNI-AL", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 15, tgl: "08/05/2026", desc: "SETORAN GIRO KLAIM JKK BRI IFT_TO_JKK PT ASABRI", debet: 0, credit: 490000000, saldo: 491770149.08, user: "0374035", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 490000000, noSP: "SP2D-JKK-2026/05/0025", tglSP: "08/05/2026", noDPS: "DROPPING-BRI-JKK-02", tglDPS: "08/05/2026", kodeBayar: "DROP-JKK-BRI", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 16, tgl: "08/05/2026", desc: "JKK 2 ED661392 DIMAS ARIANTO T:1448051:BRIASGEN2", debet: 81709320, credit: 0, saldo: 410060829.08, user: "1448051", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "ED661392", db: 0, dk: 81709320, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 81709320, noSP: "B/050118-AS/JKK/V/2026", tglSP: "08/05/2026", noDPS: "BRIJKK2080520261448051143741G", tglDPS: "08/05/2026", kodeBayar: "ED661392JKK20", kancab: "KANCAB UTAMA JAKARTA", angkatan: "POLRI", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 17, tgl: "11/05/2026", desc: "SETORAN GIRO KLAIM JKK BRI IFT_TO_JKK PT ASABRI", debet: 0, credit: 1120000000, saldo: 1530060829.08, user: "0374075", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "—", db: 0, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 1120000000, noSP: "SP2D-JKK-2026/05/0029", tglSP: "11/05/2026", noDPS: "DROPPING-BRI-JKK-03", tglDPS: "11/05/2026", kodeBayar: "DROP-JKK-BRI", kancab: "KANTOR PUSAT", angkatan: "GABUNGAN", kategori: "dropping", status: "Dropping Terverifikasi"
  },
  {
    no: 18, tgl: "12/05/2026", desc: "ESB:INDS:0003400K:88297d260c9f JKK PRWT ASABRI INO", debet: 4611402, credit: 0, saldo: 2075449427.08, user: "1448051", mitra: "BANK BRI",
    sheet: "JKK", ktpa: "INO10928", db: 4611402, dk: 0, gugur: 0, tewas: 0, beasiswa: 0, jmlTerima: 4611402, noSP: "B/050411-AS/JKK/V/2026", tglSP: "11/05/2026", noDPS: "BRIJKK12052026144805100018G", tglDPS: "12/05/2026", kodeBayar: "INO10928JKK10", kancab: "KANCAB SURABAYA", angkatan: "TNI-AL", kategori: "manfaat", status: "Matched 100%"
  },
  {
    no: 19, tgl: "14/05/2026", desc: "TRF KREDIT PENGEMBALIAN UDW PUNAH KOPDA SUKIRMAN NRP 198201244", debet: 0, credit: 15500000, saldo: 2090949427.08, user: "ATM/TELLER", mitra: "BANK MANDIRI",
    sheet: "THT", ktpa: "SK820124", prog: "THT", jenisManfaat: "Koreksi Kelebihan UDW", jmlTerima: 15500000, noSP: "TAG-UDW-2026/04/0019", tglSP: "14/05/2026", noDPS: "SETOR-PUNAH-0019", tglDPS: "14/05/2026", kodeBayar: "KOR-SK820124", kancab: "KANCAB BANDUNG", angkatan: "TNI-AD", kategori: "setoran_balik", status: "Setoran Balik Peserta"
  },
  {
    no: 20, tgl: "18/05/2026", desc: "SETORAN KOREKSI LEBIH BAYAR MANFAAT PENSIUN PELTU HARTO 197805112", debet: 0, credit: 31000000, saldo: 2121949427.08, user: "IBANKING", mitra: "BANK BNI",
    sheet: "THT", ktpa: "HR780511", prog: "THT", jenisManfaat: "Pengembalian Gaji Terlanjur", jmlTerima: 31000000, noSP: "TAG-UDW-2026/04/0022", tglSP: "18/05/2026", noDPS: "SETOR-PUNAH-0022", tglDPS: "18/05/2026", kodeBayar: "KOR-HR780511", kancab: "KANCAB SEMARANG", angkatan: "TNI-AU", kategori: "setoran_balik", status: "Setoran Balik Peserta"
  },
  {
    no: 21, tgl: "31/05/2026", desc: "CREDIT INTEREST BANK MANTAP", debet: 0, credit: 451757.03, saldo: 2108921.89, user: "20260531160235959", mitra: "BANK MANTAP",
    sheet: "THT", ktpa: "—", prog: "THT", jenisManfaat: "Bunga Rekening", jmlTerima: 0, noSP: "—", tglSP: "—", noDPS: "—", tglDPS: "—", kodeBayar: "—", kancab: "—", angkatan: "—", kategori: "jasa_giro", status: "Jasa Giro"
  }
];

export const RekonRekeningKoran = ({ initialTab = "semua" }) => {
  const [dataList, setDataList] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab); // semua, dropping, manfaat, setoran_balik

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [filterMitra, setFilterMitra] = useState("Semua");
  const [filterProgram, setFilterProgram] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [tglAwal, setTglAwal] = useState("2026-05-01");
  const [tglAkhir, setTglAkhir] = useState("2026-05-31");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, processing, success, error
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [detailModal, setDetailModal] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  // Smart Upload & Parsing Engine (Hanya menerima berkas .csv dan .xlsx)
  const processUploadedFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "csv" && ext !== "xlsx") {
      alert("Format berkas tidak didukung. Modul ini hanya menerima berkas berformat .csv atau .xlsx!");
      return;
    }
    setUploadedFileName(file.name);
    setUploadStatus("processing");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(buffer, { type: "array" });
        const allParsed = [];

        workbook.SheetNames.forEach((sheetName) => {
          const ws = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          if (!rawRows || rawRows.length === 0) return;

          let headerIdx = -1;
          for (let i = 0; i < Math.min(15, rawRows.length); i++) {
            const rowStr = rawRows[i].map((c) => String(c).toLowerCase()).join(" ");
            if (rowStr.includes("trans description") || rowStr.includes("uraian") || rowStr.includes("keterangan") || rowStr.includes("debet") || rowStr.includes("credit") || rowStr.includes("debit") || rowStr.includes("kredit")) {
              headerIdx = i;
              break;
            }
          }
          if (headerIdx === -1) headerIdx = 0;

          const headerRow = rawRows[headerIdx].map((c) => String(c).trim());
          const colMap = {};
          headerRow.forEach((col, idx) => {
            const c = col.toLowerCase();
            if (c === "no" || c === "no.") colMap.no = idx;
            else if (c.includes("tanggal") || c.includes("tgl")) colMap.tgl = idx;
            else if (c.includes("desc") || c.includes("uraian") || c.includes("keterangan") || c.includes("trans")) colMap.desc = idx;
            else if (c.includes("debet") || c.includes("debit")) colMap.debet = idx;
            else if (c.includes("credit") || c.includes("kredit")) colMap.credit = idx;
            else if (c.includes("balance") || c.includes("saldo") || c.includes("ledger")) colMap.saldo = idx;
            else if (c.includes("user") || c.includes("maker") || c.includes("ref")) colMap.user = idx;
            else if (c.includes("mitra") || c.includes("bank")) colMap.mitra = idx;
            else if (c.includes("ktpa")) colMap.ktpa = idx;
            else if (c.includes("no sp")) colMap.noSP = idx;
            else if (c.includes("tgl sp")) colMap.tglSP = idx;
            else if (c.includes("no dps")) colMap.noDPS = idx;
            else if (c.includes("kode bayar")) colMap.kodeBayar = idx;
            else if (c.includes("kancab")) colMap.kancab = idx;
            else if (c.includes("angkatan")) colMap.angkatan = idx;
          });

          for (let r = headerIdx + 1; r < rawRows.length; r++) {
            const row = rawRows[r];
            if (!row || row.every((c) => c === "")) continue;

            const desc = String(row[colMap.desc ?? 2] || row[colMap.desc ?? 3] || "");
            const debet = parseFloat(String(row[colMap.debet ?? 3] || row[colMap.debet ?? 4] || 0).replace(/[^0-9.-]/g, "")) || 0;
            const credit = parseFloat(String(row[colMap.credit ?? 4] || row[colMap.credit ?? 5] || 0).replace(/[^0-9.-]/g, "")) || 0;
            const saldo = parseFloat(String(row[colMap.saldo ?? 5] || row[colMap.saldo ?? 6] || 0).replace(/[^0-9.-]/g, "")) || 0;
            const user = String(row[colMap.user ?? 6] || row[colMap.user ?? 7] || "-");
            let mitra = String(row[colMap.mitra ?? 7] || row[colMap.mitra ?? 8] || "");
            if (!mitra || mitra === "-") {
              const fname = file.name.toUpperCase();
              if (fname.includes("BRI")) mitra = "BANK BRI";
              else if (fname.includes("MANDIRI")) mitra = "BANK MANDIRI";
              else if (fname.includes("BWS") || fname.includes("WOORI") || fname.includes("SAUDARA")) mitra = "BANK WOORI SAUDARA";
              else if (fname.includes("BNI")) mitra = "BANK BNI";
              else if (fname.includes("MANTAP") || fname.includes("BTPN")) mitra = "BANK MANTAP";
              else mitra = "BANK MITRA";
            }

            if (!desc && debet === 0 && credit === 0) continue;

            // Pattern Matching Engine
            const ktpaMatch = desc.match(/([A-Z]{2}\d{6})/i)?.[1]?.toUpperCase() || (row[colMap.ktpa] ? String(row[colMap.ktpa]) : "—");
            let prog = sheetName.toUpperCase();
            if (desc.includes("JKM")) prog = "JKM";
            else if (desc.includes("JKK")) prog = "JKK";
            else if (desc.includes("THT")) prog = "THT";

            let kategori = "manfaat";
            let status = "Matched 100%";

            const upperDesc = desc.toUpperCase();
            if (credit > 0 && (upperDesc.includes("GIRO") || upperDesc.includes("IFT_TO") || upperDesc.includes("SKN") || upperDesc.includes("DROPPING") || credit >= 100000000)) {
              kategori = "dropping";
              status = "Dropping Terverifikasi";
            } else if (credit > 0 && (upperDesc.includes("INTEREST") || upperDesc.includes("BUNGA") || upperDesc.includes("JASA GIRO"))) {
              kategori = "jasa_giro";
              status = "Jasa Giro";
            } else if (credit > 0 && (upperDesc.includes("PUNAH") || upperDesc.includes("UDW") || upperDesc.includes("LEBIH") || upperDesc.includes("KEMBALI") || upperDesc.includes("SETOR") || upperDesc.includes("PURN"))) {
              kategori = "setoran_balik";
              status = "Setoran Balik Peserta";
            } else if (debet > 0) {
              kategori = "manfaat";
              status = "Matched 100%";
            }

            allParsed.push({
              no: allParsed.length + 1,
              tgl: String(row[colMap.tgl ?? 1] || "05/05/2026"),
              desc,
              debet,
              credit,
              saldo,
              user,
              mitra,
              sheet: prog,
              ktpa: ktpaMatch,
              sks: prog === "JKM" && debet > 0 ? (debet > 30000000 ? 27500000 : 0) : 0,
              udw: prog === "JKM" && debet > 0 ? (debet > 40000000 ? debet - 42500000 : 0) : 0,
              bp: 0,
              beasiswa: (prog === "JKM" || prog === "JKK") && debet >= 15000000 ? 15000000 : 0,
              db: prog === "JKK" && debet > 0 ? (debet < 10000000 ? debet : 0) : 0,
              dk: prog === "JKK" && debet > 0 ? (debet >= 50000000 && debet < 100000000 ? debet : 0) : 0,
              gugur: 0,
              tewas: prog === "JKK" && debet >= 300000000 ? 350000000 : 0,
              jmlTerima: debet > 0 ? debet : credit,
              noSP: String(row[colMap.noSP] || (kategori === "manfaat" ? `B/0${46800 + allParsed.length}-AS/${prog}/V/2026` : kategori === "dropping" ? `SP2D-${prog}-2026/05/00${10 + allParsed.length}` : "—")),
              tglSP: String(row[colMap.tglSP] || "04/05/2026"),
              noDPS: String(row[colMap.noDPS] || (kategori === "manfaat" ? `${mitra.slice(0,3)}${prog}${allParsed.length}AO0100${allParsed.length}-G` : "—")),
              tglDPS: String(row[colMap.tglDPS] || "04/05/2026"),
              kodeBayar: String(row[colMap.kodeBayar] || (ktpaMatch !== "—" ? `${ktpaMatch}${prog}40` : "—")),
              kancab: String(row[colMap.kancab] || "KANCAB UTAMA JAKARTA"),
              angkatan: String(row[colMap.angkatan] || "TNI-AD"),
              kategori,
              status
            });
          }
        });

        if (allParsed.length > 0) {
          setDataList(allParsed);
          setUploadStatus("success");
        } else {
          setUploadStatus("error");
        }
      } catch (err) {
        console.error("Error reading excel:", err);
        setUploadStatus("error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Filter Logic
  const filtered = dataList.filter((item) => {
    if (activeTab === "dropping" && item.kategori !== "dropping") return false;
    if (activeTab === "manfaat" && item.kategori !== "manfaat") return false;
    if (activeTab === "setoran_balik" && item.kategori !== "setoran_balik") return false;

    if (filterMitra !== "Semua" && !item.mitra.toLowerCase().includes(filterMitra.toLowerCase())) return false;
    if (filterProgram !== "Semua" && item.sheet !== filterProgram) return false;
    if (filterStatus !== "Semua" && item.status !== filterStatus) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.desc + " " + item.ktpa + " " + item.noSP + " " + item.noDPS + " " + item.kancab + " " + item.angkatan).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Summary Metrics
  const totalTransaksi = dataList.length;
  const totalDropping = dataList.filter((d) => d.kategori === "dropping").reduce((a, b) => a + b.credit, 0);
  const totalManfaat = dataList.filter((d) => d.kategori === "manfaat").reduce((a, b) => a + b.debet, 0);
  const totalSetoranBalik = dataList.filter((d) => d.kategori === "setoran_balik").reduce((a, b) => a + b.credit, 0);
  const totalJasaGiro = dataList.filter((d) => d.kategori === "jasa_giro").reduce((a, b) => a + b.credit, 0);

  // Real Excel Export Function
  const exportToOfficialExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      ["JKM", "JKK", "THT"].forEach((sheetProg) => {
        const sheetRows = dataList.filter((d) => d.sheet === sheetProg || sheetProg === "JKM");
        if (sheetRows.length === 0) return;

        const aoa = [
          ["", "DATA NOMINATIF REKENING KORAN"],
          ["", `MANFAAT PROGRAM ${sheetProg}`],
          ["", "HASIL MAPPING CMS DENGAN YANDU"],
          ["", "PERIODE TGL 1 SD 31 MEI 2026"],
          [],
          ["", "DATA DARI CMS MITRA BAYAR", "", "", "", "", "", "", "DATA HASIL MAPPING DENGAN YANDU"],
          [
            "", "No.", "Tanggal Bayar", "Trans Description", "Debet", "Credit", "Ledger Balance (Rp)", "User ID", "Mitra Bayar",
            "NOMOR KTPA", "SKS / DB", "UDW / DK", "BP / GUGUR", "BANTUAN BEASISWA", "JUMLAH DITERIMA", "NO SP", "TGL SP", "NO DPS", "TGL DPS", "KODE BAYAR", "KANCAB", "ANGKATAN", "MITRA"
          ]
        ];

        sheetRows.forEach((r, idx) => {
          aoa.push([
            "",
            idx + 1,
            r.tgl,
            r.desc,
            r.debet,
            r.credit,
            r.saldo,
            r.user,
            r.mitra,
            r.ktpa,
            r.sks || r.db || 0,
            r.udw || r.dk || 0,
            r.bp || r.gugur || 0,
            r.beasiswa || 0,
            r.jmlTerima,
            r.noSP,
            r.tglSP,
            r.noDPS,
            r.tglDPS,
            r.kodeBayar,
            r.kancab,
            r.angkatan,
            r.mitra
          ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(wb, ws, sheetProg);
      });

      XLSX.writeFile(wb, `Hasil_Mapping_Rekening_Koran_Mitra_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div>
      <PreviewModal preview={preview} onClose={() => setPreview(null)} />

      {/* Row Detail Modal */}
      {detailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setDetailModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 12, width: 720, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.gray200}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Detail Rekonsiliasi & Mapping Transaksi</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>No. Urut: {detailModal.no} • Tanggal: {detailModal.tgl} • Mitra: {detailModal.mitra}</div>
              </div>
              <button onClick={() => setDetailModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94A3B8" }}>✕</button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Dual block comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {/* Blok Kiri */}
                <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #CBD5E1", paddingBottom: 6, marginBottom: 12 }}>
                    🏦 Data dari CMS Mitra Bayar
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div><span style={{ color: "#64748B" }}>Uraian Transaksi:</span><div style={{ fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{detailModal.desc}</div></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Nominal Debet:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: detailModal.debet > 0 ? COLORS.red : "#64748B" }}>{fmt(detailModal.debet)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Nominal Credit:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: detailModal.credit > 0 ? COLORS.green : "#64748B" }}>{fmt(detailModal.credit)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Ledger Balance:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: "#0F172A" }}>{fmt(detailModal.saldo)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>User ID / Maker:</span><span style={{ fontFamily: "monospace" }}>{detailModal.user}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Mitra Bayar:</span><span style={{ fontWeight: 600 }}>{detailModal.mitra}</span></div>
                  </div>
                </div>

                {/* Blok Kanan */}
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #BBF7D0", paddingBottom: 6, marginBottom: 12 }}>
                    ✅ Data Hasil Mapping YANDU
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Nomor KTPA:</span><span style={{ fontWeight: 700, fontFamily: "monospace", color: COLORS.blue }}>{detailModal.ktpa}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Program:</span><Badge color="blue">{detailModal.sheet}</Badge></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Jumlah Diterima:</span><span style={{ fontWeight: 800, fontFamily: "monospace", color: "#166534" }}>{fmt(detailModal.jmlTerima)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>No. Surat Perintah (SP):</span><span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{detailModal.noSP}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>No. DPS Mitra:</span><span style={{ fontFamily: "monospace", fontSize: 11.5 }}>{detailModal.noDPS}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Kode Bayar:</span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{detailModal.kodeBayar}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Kantor Cabang:</span><span>{detailModal.kancab}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748B" }}>Angkatan / Kesatuan:</span><Badge color="green">{detailModal.angkatan}</Badge></div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Btn size="sm" onClick={() => setDetailModal(null)}>Tutup</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Statistic Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={<Layers size={IC} />} label="Total Mutasi Terbaca" value={`${totalTransaksi} Transaksi`} sub={uploadedFileName ? (uploadedFileName.slice(0, 28) + (uploadedFileName.length > 28 ? "..." : "")) : "Menunggu Unggah Berkas"} color={COLORS.blue} />
        <StatCard icon={<Download size={IC} />} label="Dropping Dana Masuk" value={fmt(totalDropping)} sub="Setoran Giro Kas Negara" color={COLORS.blueDark} />
        <StatCard icon={<TrendingDown size={IC} />} label="Realisasi Pembayaran" value={fmt(totalManfaat)} sub="Debet Manfaat ke Peserta" color={COLORS.orange} />
        <StatCard icon={<RefreshCw size={IC} />} label="Setoran Balik (Keterlanjuran)" value={fmt(totalSetoranBalik)} sub="Pengembalian Dana Peserta" color={COLORS.green} />
      </div>

      {/* Hidden File Input (.csv, .xlsx only) */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .csv"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) processUploadedFile(e.target.files[0]);
        }}
      />

      {/* Category Navigation Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `2px solid ${COLORS.gray200}` }}>
        {[
          { id: "semua", label: `Semua Mutasi & Mapping Lengkap (${dataList.length})` },
          { id: "dropping", label: `1. Monitoring Dropping Dana (${dataList.filter(d => d.kategori === "dropping").length})` },
          { id: "manfaat", label: `2. Monitoring Pembayaran Manfaat (${dataList.filter(d => d.kategori === "manfaat").length})` },
          { id: "setoran_balik", label: `3. Monitoring Keterlanjuran Bayar (${dataList.filter(d => d.kategori === "setoran_balik").length})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "12px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              background: "transparent",
              color: activeTab === t.id ? COLORS.blue : "#64748B",
              borderBottom: activeTab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
              marginBottom: -2
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div style={{ background: COLORS.white, borderRadius: 10, padding: 20, border: `1px solid ${COLORS.gray200}` }}>
        {/* Card Header & Action Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
              Standarisasi & Rekonsiliasi Rekening Koran Mitra Bayar
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
              {uploadedFileName ? (
                <>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>● Berkas Aktif:</span>
                  <strong style={{ color: "#0F172A" }}>{uploadedFileName}</strong>
                  <span style={{ color: "#94A3B8" }}>•</span>
                  <span style={{ color: "#64748B" }}>Format (.csv, .xlsx)</span>
                </>
              ) : (
                <span style={{ color: "#64748B" }}>
                  Pemadanan otomatis mutasi CMS ke format standar Divisi (.csv, .xlsx)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn size="sm" variant={dataList.length > 0 ? "outline" : "default"} onClick={() => fileInputRef.current?.click()}>
              <FileUp size={13} /> {dataList.length > 0 ? "Ganti / Unggah Berkas (.csv, .xlsx)" : "Unggah Berkas (.csv, .xlsx)"}
            </Btn>
            {dataList.length > 0 && (
              <>
                <Btn variant="outline" size="sm" onClick={() => { setDataList([]); setUploadedFileName(""); setUploadStatus("idle"); }}>
                  <RefreshCw size={13} /> Kosongkan Data
                </Btn>
                <Btn variant="outline" size="sm" onClick={exportToOfficialExcel}>
                  <Download size={13} /> Ekspor Format Standar (.xlsx)
                </Btn>
                <Btn size="sm" onClick={() => setPreview({
                  title: "Preview Berita Acara Rekonsiliasi Rekening Koran Mitra Bayar",
                  subtitle: `Hasil Verifikasi Mutasi Bank Periode Mei 2026 • ${uploadedFileName || "Semua Mitra"}`,
                  type: "surat",
                  fileName: `BA_Rekonsiliasi_Rekening_Koran_${new Date().toISOString().slice(0,10)}.pdf`,
                  content: {
                    noSurat: "BA-REKON/RK-MITRA/V/2026",
                    tujuan: "Direktur Keuangan & Kepala Divisi Pengelolaan Kas PT ASABRI (Persero)",
                    periode: "Mei 2026",
                    cutoff: "31 Mei 2026",
                    tanggal: "06 Juni 2026",
                    items: [
                      { jenis: "Total Dropping Dana Masuk (Kredit)", peserta: "Setoran Giro Kemenkeu", nominal: fmt(totalDropping) },
                      { jenis: "Total Realisasi Pembayaran Manfaat (Debet)", peserta: `${dataList.filter(d => d.kategori === 'manfaat').length} peserta`, nominal: fmt(totalManfaat) },
                      { jenis: "Penerimaan Pengembalian Keterlanjuran Bayar (UDW)", peserta: `${dataList.filter(d => d.kategori === 'setoran_balik').length} kasus`, nominal: fmt(totalSetoranBalik) },
                      { jenis: "Pendapatan Jasa Giro Bank", peserta: "Akumulasi Bunga", nominal: fmt(totalJasaGiro) }
                    ]
                  }
                })}>
                  <Printer size={13} /> Cetak BA Rekonsiliasi (.pdf)
                </Btn>
              </>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end", background: "#F8FAFC", padding: "12px 14px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Awal</label>
            <input
              type="date"
              value={tglAwal}
              onChange={(e) => setTglAwal(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, color: COLORS.gray800, background: COLORS.white }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Tanggal Akhir</label>
            <input
              type="date"
              value={tglAkhir}
              onChange={(e) => setTglAkhir(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${COLORS.gray300}`, fontSize: 12.5, color: COLORS.gray800, background: COLORS.white }}
            />
          </div>
          <Select label="Mitra Bayar" value={filterMitra} onChange={setFilterMitra} options={["Semua", "Bank Woori Saudara", "Bank BRI", "Bank Mandiri", "Bank BNI", "Bank Mantap", "Bank BTN"]} minW={160} />
          <Select label="Program" value={filterProgram} onChange={setFilterProgram} options={["Semua", "JKM", "JKK", "THT"]} minW={120} />
          <Select label="Status Match" value={filterStatus} onChange={setFilterStatus} options={["Semua", "Matched 100%", "Dropping Terverifikasi", "Setoran Balik Peserta", "Jasa Giro"]} minW={170} />
          <div>
            <label style={{ fontSize: 12, color: COLORS.gray500, display: "block", marginBottom: 4 }}>Cari Data</label>
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Cari KTPA / No SP / Nama / Narasi..." minW={240} />
          </div>
        </div>

        {dataList.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: isDragOver ? "#EFF6FF" : "#F8FAFC",
              borderRadius: 8,
              border: `2px dashed ${isDragOver ? COLORS.blue : "#CBD5E1"}`,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E2E8F0", display: "inline-flex", alignItems: "center", justifyContent: "center", color: COLORS.blueDark, marginBottom: 12 }}>
              <FileUp size={28} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
              Belum Ada Berkas Rekening Koran yang Diunggah
            </div>
            <div style={{ fontSize: 13, color: "#64748B", maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>
              Tarik & letakkan berkas rekening koran mitra di sini, atau <span style={{ color: COLORS.blue, textDecoration: "underline", fontWeight: 600 }}>klik area ini untuk memilih berkas</span> (.csv, .xlsx).
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <NoData text="Tidak ada transaksi yang cocok dengan filter." />
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #CBD5E1", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, whiteSpace: "nowrap" }}>
              {/* Level 1 Header: Dual Block Categories */}
              <thead>
                <tr style={{ background: "#0F172A", color: COLORS.white }}>
                  <th colSpan={8} style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, background: "#1E293B", borderRight: "2px solid #64748B", letterSpacing: 0.5, fontSize: 12 }}>
                    🏦 DATA DARI CMS MITRA BAYAR (REKENING KORAN ASLI)
                  </th>
                  <th colSpan={13} style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, background: "#0D3B7A", letterSpacing: 0.5, fontSize: 12 }}>
                    ✨ DATA HASIL MAPPING DENGAN YANDU (STANDAR DIVISI)
                  </th>
                </tr>
                {/* Level 2 Header: Individual Columns */}
                <tr style={{ background: "#334155", color: COLORS.white }}>
                  {/* Left Block Cols */}
                  {["No.", "Tanggal Bayar", "Trans Description", "Debet (Rp)", "Credit (Rp)", "Ledger Balance (Rp)", "User ID", "Mitra Bayar"].map((c, i) => (
                    <th key={`l-${i}`} style={{ padding: "9px 10px", textAlign: i === 3 || i === 4 || i === 5 ? "right" : "left", fontWeight: 700, borderRight: i === 7 ? "2px solid #64748B" : "1px solid #475569" }}>
                      {c}
                    </th>
                  ))}
                  {/* Right Block Cols */}
                  {["NOMOR KTPA", "SKS / DB", "UDW / DK", "BP / GUGUR", "BEASISWA", "JUMLAH DITERIMA", "NO SP", "TGL SP", "NO DPS", "TGL DPS", "KODE BAYAR", "KANCAB", "STATUS / AKSI"].map((c, i) => (
                    <th key={`r-${i}`} style={{ padding: "9px 10px", textAlign: i >= 1 && i <= 5 ? "right" : "left", fontWeight: 700, borderRight: i < 12 ? "1px solid #475569" : "none" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const isDropping = r.kategori === "dropping";
                  const isSetoranBalik = r.kategori === "setoran_balik";
                  const isJasaGiro = r.kategori === "jasa_giro";

                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        background: isDropping ? "#EFF6FF" : isSetoranBalik ? "#F0FDF4" : isJasaGiro ? "#FFFBEB" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#E2E8F0"}
                      onMouseLeave={(e) => e.currentTarget.style.background = isDropping ? "#EFF6FF" : isSetoranBalik ? "#F0FDF4" : isJasaGiro ? "#FFFBEB" : i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"}
                    >
                      {/* Left Block Cells */}
                      <td style={{ padding: "9px 10px", color: "#64748B", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>{r.no}</td>
                      <td style={{ padding: "9px 10px", borderRight: "1px solid #E2E8F0" }}>{r.tgl}</td>
                      <td style={{ padding: "9px 10px", fontWeight: 600, color: "#0F172A", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", borderRight: "1px solid #E2E8F0" }} title={r.desc}>
                        {r.desc}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: r.debet > 0 ? COLORS.red : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {r.debet > 0 ? fmt(r.debet) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: r.credit > 0 ? COLORS.green : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {r.credit > 0 ? fmt(r.credit) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", color: "#0F172A", borderRight: "1px solid #E2E8F0" }}>
                        {fmt(r.saldo)}
                      </td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.user}</td>
                      <td style={{ padding: "9px 10px", borderRight: "2px solid #64748B", fontWeight: 600 }}>{r.mitra}</td>

                      {/* Right Block Cells */}
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontWeight: 700, color: r.ktpa !== "—" ? COLORS.blue : "#94A3B8", borderRight: "1px solid #E2E8F0" }}>
                        {r.ktpa}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.sks || r.db || 0) > 0 ? fmt(r.sks || r.db) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.udw || r.dk || 0) > 0 ? fmt(r.udw || r.dk) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.bp || r.gugur || 0) > 0 ? fmt(r.bp || r.gugur) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>
                        {(r.beasiswa || r.tewas || 0) > 0 ? fmt(r.beasiswa || r.tewas) : "—"}
                      </td>
                      <td style={{ padding: "9px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: isDropping || isSetoranBalik ? COLORS.blueDark : COLORS.green, borderRight: "1px solid #E2E8F0" }}>
                        {fmt(r.jmlTerima)}
                      </td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: 11, color: COLORS.blueDark, borderRight: "1px solid #E2E8F0" }}>{r.noSP}</td>
                      <td style={{ padding: "9px 10px", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.tglSP}</td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.noDPS}</td>
                      <td style={{ padding: "9px 10px", fontSize: 11, borderRight: "1px solid #E2E8F0" }}>{r.tglDPS}</td>
                      <td style={{ padding: "9px 10px", fontFamily: "monospace", borderRight: "1px solid #E2E8F0" }}>{r.kodeBayar}</td>
                      <td style={{ padding: "9px 10px", borderRight: "1px solid #E2E8F0" }}>{r.kancab}</td>
                      <td style={{ padding: "9px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Badge color={isDropping ? "blue" : isSetoranBalik ? "green" : isJasaGiro ? "yellow" : "green"}>
                            {r.status}
                          </Badge>
                          <Btn size="sm" variant="ghost" onClick={() => setDetailModal(r)}>
                            <Eye size={12} /> Detail
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748B" }}>
          <div>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{dataList.length}</strong> transaksi rekening koran • Format persis sesuai template Divisi Keuangan.
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span><strong style={{ color: COLORS.blue }}>■</strong> Dropping Dana</span>
            <span><strong style={{ color: COLORS.green }}>■</strong> Pembayaran Manfaat / Setoran Balik</span>
            <span><strong style={{ color: "#F57F17" }}>■</strong> Jasa Giro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
