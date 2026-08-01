# Deploy

Situs pitch Kostella berjalan sebagai **berkas statis** — tidak ada proses Node
di server. `next build` menghasilkan `out/`, nginx menyajikannya langsung.

Target: `kostella.hyperscore.cloud` di `103.157.97.233`, di bawah
`/srv/www/kostella`. `current` adalah symlink ke `out/`.

## Deploy ulang (tanpa sudo)

```
ssh hyperscore-vps /srv/www/kostella/deploy/deploy.sh
```

`git pull` + `npm ci` + `npm run build`. nginx tidak disentuh, tidak ada proses
yang perlu di-restart, dan folder yang disajikan tetap sama sepanjang waktu.

## Pemasangan nginx (butuh sudo, sekali saja)

```
ssh -t hyperscore-vps 'sudo bash /srv/www/kostella/deploy/install-nginx.sh'
```

Skripnya memvalidasi seluruh config dengan `nginx -t` **sebelum** reload, dan
mencabut kembali symlink-nya kalau validasi gagal — server ini menjalankan 24
vhost produksi lain yang tidak boleh ikut jatuh.

## SSL

```
ssh -t hyperscore-vps 'sudo certbot --nginx -d kostella.hyperscore.cloud'
```

Perlu DNS sudah mengarah ke server lebih dulu. Certbot menambahkan blok TLS dan
redirect 80->443 ke vhost, lalu memperbarui otomatis lewat `certbot.timer`.

## Catatan

- Perubahan pada `kostella.hyperscore.cloud.conf` baru berlaku setelah
  `install-nginx.sh` dijalankan ulang.
- `install-nginx.sh` menyalin ulang vhost dari sini, jadi suntingan langsung di
  `/etc/nginx/` akan tertimpa. Sunting berkas di folder ini.
