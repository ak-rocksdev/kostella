# Deploy

Situs pitch Kostella berjalan sebagai **berkas statis** — tidak ada proses Node
di server. `next build` menghasilkan `out/`, nginx menyajikannya langsung.

Target: `kostella.hyperscore.cloud` di `103.157.97.233`.

## Struktur di server

```
/srv/www/kostella/
├── current -> releases/20260801_152210/   docroot nginx — ditukar atomik
├── releases/
│   ├── 20260801_143007/                   satu build = satu folder
│   └── …                                  5 terakhir disimpan
├── repo/                                  klon git + node_modules; tempat build
├── deploy/                                skrip yang dijalankan
└── logs/                                  log deploy, 10 terakhir
```

Mengikuti pola yang sudah dipakai `hst-admin`, `hst-client`, dan `hypercoach`
di server yang sama, dikurangi bagian yang tidak berlaku untuk situs statis:
tidak ada `shared/` (tidak ada `.env` atau `storage` saat runtime) dan tidak ada
`backups/` (tidak ada database).

**`repo/` sengaja terpisah dari `releases/`.** Build butuh `node_modules`
(~400 MB) dan cache Next; menyalinnya ke tiap rilis boros. Jadi build sekali di
`repo/`, lalu hanya `out/` (2,7 MB) yang disalin menjadi rilis.

**`deploy/` sengaja di luar `repo/`.** Kalau skrip deploy ikut ditulis ulang
`git reset` saat bash masih membacanya, perilakunya tak terdefinisi — bash
membaca skrip secara bertahap. Konsekuensinya salinan di `deploy/` bisa
tertinggal dari repo; `deploy.sh` melaporkannya di akhir kalau berbeda.

## Deploy

```
ssh hyperscore-vps /srv/www/kostella/deploy/deploy.sh
ssh hyperscore-vps /srv/www/kostella/deploy/deploy.sh nama-branch
```

Tanpa sudo. Urutannya: tarik → pasang dependensi → build → siapkan rilis →
tukar `current` → verifikasi tiga halaman → buang rilis lama.

Situs tidak pernah mati selama proses ini. Build berlangsung di `repo/`, jauh
dari yang disajikan nginx, dan `current` baru berpindah setelah build selesai.
Pertukarannya `mv -T` atas symlink sementara — satu operasi rename, atomik di
Linux. `ln -sfn` saja **tidak** cukup: ia menghapus lalu membuat ulang, dan di
celah itu docroot tidak ada.

Gagal sebelum pertukaran → rilis dibuang, `current` tidak tersentuh.
Gagal verifikasi sesudah pertukaran → dikembalikan sendiri ke rilis sebelumnya.

## Rollback

```
ssh hyperscore-vps /srv/www/kostella/deploy/rollback.sh --list
ssh hyperscore-vps /srv/www/kostella/deploy/rollback.sh
ssh hyperscore-vps /srv/www/kostella/deploy/rollback.sh 20260801_143007
```

Tanpa build. Rilis lama masih utuh di disk, jadi memulihkan situs hanya
mengganti tujuan satu symlink.

## Nginx (butuh sudo, sekali saja)

```
ssh -t hyperscore-vps 'sudo bash /srv/www/kostella/deploy/install-nginx.sh'
```

Memvalidasi seluruh config dengan `nginx -t` **sebelum** reload, dan mencabut
kembali symlink-nya kalau validasi gagal — server ini menjalankan 25 vhost
produksi lain yang tidak boleh ikut jatuh.

Skrip menolak jalan kalau menemukan jejak Certbot di vhost terpasang, karena
menimpanya akan mematikan HTTPS. Kalau memang perlu, `FORCE=1` lalu jalankan
ulang `certbot --nginx -d kostella.hyperscore.cloud`.

## SSL

Sudah terpasang, memperbarui otomatis lewat `certbot.timer`. Kalau perlu ulang:

```
ssh -t hyperscore-vps 'sudo certbot --nginx -d kostella.hyperscore.cloud'
```

## Setelah mengubah berkas di folder ini

Skrip yang dijalankan ada di `/srv/www/kostella/deploy/`, bukan di dalam repo:

```
ssh hyperscore-vps 'cp /srv/www/kostella/repo/deploy/*.sh /srv/www/kostella/deploy/'
```

Perubahan pada `kostella.hyperscore.cloud.conf` baru berlaku setelah
`install-nginx.sh` dijalankan ulang.
