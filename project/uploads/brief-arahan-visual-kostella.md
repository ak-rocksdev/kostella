# Brief Arahan Visual — Kostella

**Tujuan dokumen:** arahan visual yang cukup detail untuk langsung dieksekusi di Claude Design, menghasilkan 4 layar pitch.
**Konteks:** ini materi untuk memenangkan proyek, bukan spesifikasi produksi.

---

## 1. Positioning

> Kostella memiliki dan mengelola sendiri setiap kamarnya. Karena itu Kostella bisa menunjukkan kamar mana yang benar-benar kosong hari ini, dan berapa persisnya yang harus dibayar.

Dua klaim itu tidak bisa dibuat oleh Mamikos (agregator, data pihak ketiga) maupun sepenuhnya oleh Cove (mengelola aset orang lain). Seluruh desain harus melayani dua klaim ini.

**Audiens dan bebannya:**

| Audiens | Yang ditakutkan | Yang harus dilihat |
|---|---|---|
| Mahasiswa/karyawan | Salah pilih, kejauhan, kena biaya tersembunyi | Jarak nyata, total biaya, foto jujur |
| Orang tua (ikut memutuskan, sering membayar) | Penipuan, keamanan anak | Legitimasi, alamat jelas, aturan tegas |
| Pemilik kos (calon franchise) | Sistemnya asal-asalan | Dashboard yang terlihat serius |

---

## 2. Konsep besar: **Nomor**

Kostella tidak menamai propertinya. Kostella **menomorinya** — 362, 361, 360, 351, 2A3, 2A5, 2C, 100. Itu nomor rumah di Jl. Dr. Susilo. Kamarnya pun bernomor: 101, 105, 107, 205, 208, 211, 212, 304.

Cove menamai propertinya (Cove Estira, Cove Ashwood). Rukita menamai propertinya. **Kostella punya sistem penomoran nyata yang sudah berumur 18 tahun** — dan itu identitas yang tidak bisa dipakai kompetitor mana pun.

Jadi nomor menjadi elemen visual utama: besar, tegas, seperti plat nomor bangunan dan plakat pintu kamar. Bukan ornamen — nomor adalah cara Kostella benar-benar mengorganisir bisnisnya.

**Elemen signature: kisi lantai (floor grid).**
Halaman properti tidak dibuka dengan carousel foto. Dibuka dengan kisi tipografis seluruh kamar per lantai, lengkap dengan statusnya.

```
LANTAI 3   [304]
LANTAI 2   [205] [208] [211] [212]
LANTAI 1   [101] [105] [107]

■ tersedia   ▨ dibooking   □ terisi
```

Ini risiko desain yang disengaja. Semua kompetitor membuka dengan foto. Kostella membuka dengan inventaris. Alasannya: transparansi ketersediaan adalah pembeda, dan bagi owner ini adalah bukti visual bahwa sistemnya nyata — bukan brosur.

---

## 3. Sistem visual

### Palet

Sengaja menghindari tiga arah yang sudah dipakai pasar: biru (Mamikos), oranye-merah (Rukita), dan pastel ceria (Cove). Juga menghindari kombinasi krem + serif kontras tinggi + aksen terakota, yang saat ini adalah tampilan default hasil AI dan akan langsung terbaca sebagai template.

| Token | Hex | Pemakaian |
|---|---|---|
| `--stone` | `#EDECE7` | Latar halaman. Abu batu dingin, bukan krem |
| `--paper` | `#FFFFFF` | Kartu, panel, permukaan terangkat |
| `--ink` | `#16171A` | Teks utama, nomor besar |
| `--ink-soft` | `#5E5F62` | Teks sekunder, label |
| `--plum` | `#57182F` | Warna merek. Tombol utama, penanda aktif, garis aksen |
| `--plum-soft` | `#F3E7EA` | Latar badge, highlight lembut |
| `--line` | `#D9D7D0` | Garis pemisah, border kartu |

Warna status — hanya untuk ketersediaan, tidak pernah untuk dekorasi:

| Token | Hex | Arti |
|---|---|---|
| `--available` | `#2E6B4C` | Tersedia |
| `--held` | `#B4531E` | Dibooking / sisa 1 |
| `--occupied` | `#9A9892` | Terisi |

Aturan: **maksimal dua warna dalam satu layar** di luar netral. Plum untuk aksi, satu warna status sesuai konteks.

### Tipografi

| Peran | Typeface | Alasan |
|---|---|---|
| Display / nomor | **Archivo** (Expanded 600–700 untuk angka) | Wajah signage. Angkanya tegas dan lebar — cocok untuk plat nomor dan plakat kamar |
| Body / UI | **Plus Jakarta Sans** (400, 500, 600) | Dibuat untuk Jakarta. Cerita yang bagus di ruang pitch, dan memang jernih di ukuran kecil |
| Data / kode kamar / harga tabel | **IBM Plex Mono** (400, 500) | Angka tabular sejajar. Membuat tabel biaya terbaca seperti kwitansi, bukan pemasaran |

Ketiganya gratis di Google Fonts — penting, karena akan dibangun sungguhan.

**Skala tipe:**

| Peran | Ukuran / line-height | Catatan |
|---|---|---|
| Nomor properti (hero) | 96–140px / 0.85 | Archivo Expanded 700, tracking rapat |
| H1 | 44px / 1.1 | Plus Jakarta Sans 600 |
| H2 | 30px / 1.2 | 600 |
| H3 | 21px / 1.3 | 600 |
| Body | 16px / 1.65 | 400 |
| Body kecil | 14px / 1.6 | 400 |
| Label / eyebrow | 12px / 1.4, tracking +0.08em | 600, huruf kapital hanya di sini |
| Harga besar | 32px | Plex Mono 500 |
| Kode kamar | 15px | Plex Mono 500 |

Sentence case di mana-mana kecuali eyebrow.

### Spasi, sudut, elevasi

- Skala spasi: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- Padding section desktop: 96px atas-bawah. Mobile: 56px
- Lebar konten maksimal: 1200px. Kolom teks maksimal: 640px
- Radius: `4px` untuk badge dan input, `12px` untuk kartu, `0` untuk kisi lantai (kotak kamar harus terasa seperti denah, bukan tombol)
- Bayangan: hampir tidak ada. Pemisahan dilakukan dengan garis `--line` 1px dan perbedaan permukaan. Maksimal satu elevasi: `0 1px 2px rgba(22,23,26,0.06)`
- Ikon: garis tipis 1.5px, ukuran 20px. Jangan pernah pakai ikon berwarna-warni atau PNG hasil remove-bg

### Motion

Sedikit dan terarah. Tiga saja:
1. Kisi lantai: kotak kamar muncul berurutan per lantai saat masuk viewport, jeda 40ms
2. Hover kartu properti: foto zoom 1.03, 400ms ease-out
3. Rincian biaya: buka-tutup dengan height transition 250ms

Tidak ada parallax, tidak ada teks yang muncul huruf per huruf, tidak ada latar bergerak.

---

## 4. Aturan foto

Ini penentu apakah kamar Rp1,65 juta terlihat seperti Rp2,5 juta. Untuk pitch, siapkan **dua versi layar detail**: satu memakai foto asli Kostella yang ada sekarang, satu memakai foto yang sudah diperlakukan. Selisihnya yang menjual anggaran fotografi.

- Rasio: 3:2 untuk hero, 4:5 untuk kartu grid, 1:1 untuk thumbnail
- Sudut wajib per kamar: (1) dari pintu, menampilkan kasur dan jendela; (2) meja belajar; (3) kamar mandi; (4) lemari terbuka; (5) pemandangan dari jendela
- Satu sumber cahaya konsisten. Siang hari, tirai terbuka, lampu ruangan mati
- Tidak ada wide-angle ekstrem. Kamar 3x4 harus terlihat seperti 3x4 — melebih-lebihkan ukuran adalah alasan orang kecewa saat survei
- Perlakuan seragam: kontras rendah, sedikit warm, bayangan diangkat
- Foto orang: hanya di area bersama, tidak pernah di kamar

---

## 5. Layar 1 — Beranda

**Tugas:** dalam 5 detik, orang harus paham bahwa ini pemilik, bukan platform iklan.

**Section 1 — Hero**
- Latar `--stone`. Tanpa foto besar melebar.
- Kiri: eyebrow `MILIK & DIKELOLA SENDIRI SEJAK 2008`. H1: "Kos yang kamarnya kami kelola sendiri." Sub: "31 gedung di Jakarta, Bandung, dan Bali. Kamar yang tampil di sini benar-benar kosong hari ini."
- Kanan: kartu ketersediaan hidup — daftar 4 kamar teratas yang kosong, format `362 · kamar 205 · Superior · Rp1.950.000 · kosong 1 Agustus`. Pakai Plex Mono.
- Pencarian bukan kolom teks kosong. Pertanyaan: "Kamu kuliah atau kerja di mana?" dengan chip: Trisakti/Untar · Kelapa Gading · Setiabudi · Kebayoran · Bandung · Nusa Dua.
- Angka klaim harus benar. Jangan tulis "+200 kost". Kalau angka finalnya belum pasti, tulis jumlah kamar, bukan jumlah gedung.

**Section 2 — Bar bukti**
Satu baris tipis, empat data: tahun berdiri 2008 · jumlah gedung · jumlah kamar · rata-rata lama tinggal penghuni. Tanpa ikon. Hanya angka Archivo dan label kecil.

**Section 3 — Properti per kawasan**
Bukan grid seragam. Kelompokkan per kawasan dengan judul kawasan besar, lalu kartu propertinya di bawah. Kartu berisi: foto 4:5, **nomor properti besar** menimpa sudut bawah kiri foto, nama jalan, jarak ke 2 titik terdekat, harga mulai, dan badge status (`5 kamar kosong` / `sisa 1` / `penuh`).

**Section 4 — Transparansi biaya**
Judul: "Yang kamu bayar, tanpa kejutan." Tampilkan satu contoh nyata sebagai kwitansi Plex Mono:
```
Sewa bulanan            Rp 1.650.000
Deposit (dikembalikan)  Rp 1.500.000
Listrik                 dihitung terpisah
Parkir motor            gratis
─────────────────────────────────────
Bayar di awal           Rp 3.150.000
```
Ini section yang tidak dimiliki kompetitor. Beri ruang besar.

**Section 5 — Cara sewa**
Empat langkah: cari → jadwalkan survei → ajukan sewa → bayar dan masuk. Nomor 01–04 boleh dipakai di sini, karena ini memang urutan.

**Section 6 — Punya kos? (pintu franchise)**
Blok gelap `--ink`, teks `--stone`. Singkat. "Kami mengelola 31 gedung. Kami juga bisa mengelola milik Anda." CTA sekunder. Jangan besar-besar — di pitch ini fungsinya menunjukkan bahwa Anda memikirkan jalur pendapatan kedua.

**Section 7 — Footer**
Alamat lengkap tiap gedung, nomor WhatsApp resmi dengan penanda terverifikasi, jam operasional. Footer adalah instrumen kepercayaan, bukan tempat buang tautan.

---

## 6. Layar 2 — Hasil pencarian

**Tugas:** membuat inventaris yang tidak besar terasa cukup dan terkurasi.

- Layout dua kolom: daftar di kiri (60%), peta lengket di kanan (40%). Peta di level kawasan, bukan nasional — jangan pernah tampilkan peta Indonesia dengan 5 pin.
- Filter sebagai chip horizontal, bukan sidebar: `Putri` `Campur` `Kamar mandi dalam` `AC` `Bisa pasutri` `< Rp2 juta`. Maksimal 6 chip terlihat.
- Urutan default: jarak ke titik yang dipilih pengguna.
- Kartu daftar horizontal: foto kiri 4:3, kanan berisi nomor properti (Archivo, 32px), alamat, tiga fasilitas teratas, jarak berjalan kaki, harga, dan **baris ketersediaan**: `3 dari 8 kamar kosong`.
- State kosong harus dirancang, bukan diabaikan: "Belum ada kamar kosong di Setiabudi. Yang terdekat ada di Kebayoran, 15 menit." Berikan jalan keluar, bukan jalan buntu.

---

## 7. Layar 3 — Detail properti (halaman uang)

Halaman ini yang paling menentukan. Kerjakan paling dalam.

**Section 1 — Kepala**
Nomor properti raksasa (`362`, Archivo Expanded 140px) di kiri, alamat lengkap dan badge tipe (`Khusus putri`) di kanannya. Di bawahnya baris ringkas: jarak ke Trisakti 1 km · Terminal Grogol 0,2 km · Central Park 0,2 km.

**Section 2 — Kisi lantai (signature)**
Denah tipografis seluruh kamar, dikelompokkan per lantai. Tiap kotak kamar: nomor (Plex Mono), tipe, harga, dan status lewat warna border serta pola isi. Klik kotak → panel kanan berubah menampilkan foto dan harga kamar itu.

Penting: **jangan bergantung pada warna saja.** Tersedia = border tebal + isi putih. Dibooking = arsir diagonal. Terisi = isi abu, teks pudar. Ini juga menyelesaikan aksesibilitas.

**Section 3 — Panel kamar terpilih (lengket saat scroll)**
Galeri foto kamar tersebut · tipe · luas · fasilitas · tanggal tersedia · rincian biaya yang terbuka penuh · dua CTA: **Jadwalkan survei** (utama) dan **Ajukan sewa** (sekunder). Survei didahulukan karena itulah yang benar-benar dilakukan orang, dan menyembunyikannya membuat halaman terasa memaksa.

**Section 4 — Rincian biaya lengkap**
Format kwitansi Plex Mono. Termasuk deposit, aturan pembayaran tanggal 1–16, denda keterlambatan, harga orang kedua Rp400.000, tarif menginap Rp100.000/malam. Aturan yang sekarang tersembunyi di bawah justru harus dinaikkan — kejujuran yang ditampilkan dengan percaya diri terbaca sebagai profesionalisme.

**Section 5 — Sekitar**
Peta radius jalan kaki dengan titik nyata: kampus, terminal, minimarket, rumah makan, bank, rumah sakit. Bukan tabel teks seperti sekarang.

**Section 6 — Aturan rumah**
Jam tamu, kebijakan pasangan, kebersihan, parkir. Section ini untuk orang tua. Tulis tegas dan tenang.

---

## 8. Layar 4 — Dashboard pengelola (senjata pitch)

Satu layar. Tidak perlu berfungsi. Tugasnya membuat owner berkata "ini yang saya butuhkan."

- Header: pemilih properti (`362 ▾`), tanggal hari ini
- Empat kartu metrik: okupansi 8/11 · pendapatan bulan berjalan · tagihan belum dibayar · survei terjadwal
- **Kisi lantai yang sama** seperti halaman publik, tapi dengan aksi: tandai terisi, atur harga, blokir untuk perbaikan. Memakai ulang komponen yang sama di sisi publik dan operator adalah argumen kuat: satu sistem, dua tampilan
- Tabel tagihan: kamar · penghuni · jatuh tempo · status · denda. Plex Mono, angka rata kanan
- Panel survei hari ini: jam, nama, nomor WhatsApp, tombol konfirmasi

Warna status di sini identik dengan sisi publik. Itu poin yang harus Anda ucapkan di ruangan.

---

## 9. Prompt siap tempel untuk Claude Design

**Langkah 1 — buat design system dulu.** Jangan mulai dari layar. Unggah dokumen ini di onboarding design system, lalu:

```
Buat design system bernama "Kostella" dari dokumen terlampir.

Token warna: stone #EDECE7, paper #FFFFFF, ink #16171A, ink-soft #5E5F62,
plum #57182F, plum-soft #F3E7EA, line #D9D7D0, available #2E6B4C,
held #B4531E, occupied #9A9892.

Typeface: Archivo untuk display dan angka (gunakan lebar expanded dan
weight 700 untuk nomor properti), Plus Jakarta Sans untuk body dan UI,
IBM Plex Mono untuk harga, kode kamar, dan tabel.

Skala spasi 4/8/12/16/24/32/48/64/96/128. Radius 4px untuk badge dan input,
12px untuk kartu, 0 untuk kotak kamar pada kisi lantai. Bayangan maksimal
0 1px 2px rgba(22,23,26,0.06). Pemisahan visual memakai garis 1px, bukan bayangan.

Aturan: maksimal dua warna non-netral per layar. Sentence case kecuali eyebrow.
Tanpa gradien, tanpa glassmorphism, tanpa emoji, tanpa ikon berwarna.
```

**Langkah 2 — satu layar per percakapan.** Jangan minta empat layar sekaligus; hasilnya akan dangkal semua. Contoh untuk halaman detail:

```
Buat halaman detail properti untuk Kostella 362, desktop 1440px,
memakai design system Kostella.

Data nyata yang harus dipakai:
- Kostella 362, Jl. Dr. Susilo 2 No. 362, Grogol, Jakarta Barat. Khusus putri.
- Tipe: Standard Rp1.650.000, Superior Rp1.950.000, Pojok Rp2.100.000
- Kamar lantai 1: 101, 105, 107. Lantai 2: 205, 208, 211, 212. Lantai 3: 304
- Status: 105 dan 211 kosong, 205 dibooking, sisanya terisi
- Deposit Rp1.500.000, listrik terpisah, bayar tanggal 1-16, orang kedua Rp400.000
- Jarak: Trisakti 1 km, Terminal Grogol 0,2 km, Central Park 0,2 km

Struktur section, berurutan:
1. Kepala dengan angka "362" sangat besar di kiri, alamat dan badge di kanan
2. Kisi lantai: kotak kamar dikelompokkan per lantai, status dibedakan lewat
   border dan pola isi (bukan warna saja), bisa diklik
3. Panel kanan lengket berisi foto kamar terpilih, fasilitas, dan dua CTA:
   "Jadwalkan survei" (utama) dan "Ajukan sewa" (sekunder)
4. Rincian biaya bergaya kwitansi dengan IBM Plex Mono
5. Peta sekitar dengan radius jalan kaki
6. Aturan rumah

Kisi lantai adalah elemen utama halaman ini. Beri ruang paling besar.
Jangan buka halaman dengan carousel foto.
```

Ulangi pola yang sama untuk beranda, hasil pencarian, dan dashboard. Selalu sertakan data nyata — mockup dengan lorem ipsum kehilangan separuh daya persuasinya.

**Langkah 3 — untuk pitch, ekspor sebagai PDF atau share URL.** Jangan tunjukkan HTML yang bisa diklik pada pertemuan pertama; owner akan mengklik sesuatu yang belum ada dan momentumnya hilang.

---

## 10. Yang harus dihindari

| Jangan | Alasan |
|---|---|
| Tier Luxe/Classic/Basic | Inventaris terlalu sedikit; tiap tier hanya berisi 4 properti, dan Anda melabeli sepertiga portofolio sendiri sebagai murah |
| Peta level nasional | 5 pin di layar kosong membuat Kostella terlihat lebih kecil daripada aslinya |
| Filter lengkap ala Mamikos | Filter yang mengembalikan 2 hasil menyakiti, bukan membantu |
| Krem + serif kontras tinggi + aksen terakota | Tampilan default AI saat ini; akan langsung terbaca sebagai template |
| Angka klaim yang tidak konsisten | Di pasar yang ketakutan utamanya penipuan, ini sinyal bahaya |
| Foto stok | Owner akan menyetujui sesuatu yang tidak bisa Anda kirim |
| Mockup tanpa label "konsep" | Owner akan menganggap keputusan sudah diambil |

---

## 11. Yang perlu dikonfirmasi ke owner sebelum pitch

1. Jumlah gedung dan kamar yang sebenarnya — satu angka, dipakai di semua tempat
2. Warna logo saat ini; kalau plum bertabrakan, palet disesuaikan tapi arah "nomor" tetap
3. Apakah pembayaran online disetujui secara prinsip, meski dibangun belakangan
4. Apakah halaman franchise boleh muncul di pitch, atau masih rahasia
