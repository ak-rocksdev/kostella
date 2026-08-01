#!/usr/bin/env bash
#
# Pasang vhost Kostella. Jalankan dengan sudo:
#   sudo bash /srv/www/kostella/deploy/install-nginx.sh
#
# Aman untuk 24 vhost lain di server ini:
#   - file terpisah, tidak menyentuh config mana pun yang sudah ada
#   - `nginx -t` divalidasi SEBELUM reload
#   - kalau validasi gagal, symlink dicabut kembali dan nginx TIDAK di-reload,
#     sehingga config yang sedang berjalan tetap utuh
#   - `reload`, bukan `restart` — request yang sedang jalan tidak terputus
#
set -euo pipefail

SITE="kostella.hyperscore.cloud"
SRC="/srv/www/kostella/deploy/${SITE}.conf"
AVAIL="/etc/nginx/sites-available/${SITE}.conf"
ENABLED="/etc/nginx/sites-enabled/${SITE}.conf"
ROOT="/srv/www/kostella/current"

step() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }
fail() { printf "\n\033[31mGAGAL: %s\033[0m\n" "$1" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || fail "harus dijalankan dengan sudo"
[ -f "$SRC" ]        || fail "vhost tidak ditemukan: $SRC"
[ -f "$ROOT/index.html" ] || fail "hasil build tidak ada: $ROOT/index.html (jalankan deploy.sh dulu)"

step "1/5  Salin vhost ke sites-available"
if [ -f "$AVAIL" ]; then
  cp -a "$AVAIL" "${AVAIL}.bak.$(date +%Y%m%d_%H%M%S)"
  echo "     vhost lama dicadangkan"
fi
install -m 0644 -o root -g root "$SRC" "$AVAIL"
echo "     $AVAIL"

step "2/5  Aktifkan (symlink ke sites-enabled)"
NEW_LINK=0
[ -L "$ENABLED" ] || NEW_LINK=1
ln -sfn "$AVAIL" "$ENABLED"
echo "     $ENABLED"

# Kalau validasi gagal, kembalikan keadaan seperti semula sebelum keluar.
rollback() {
  if [ "$NEW_LINK" -eq 1 ]; then
    rm -f "$ENABLED"
    echo "     symlink dicabut kembali — config nginx yang berjalan tidak tersentuh"
  fi
}

step "3/5  Validasi seluruh config nginx"
if ! nginx -t; then
  rollback
  fail "nginx -t menolak config. Tidak ada yang di-reload; semua situs lain aman."
fi

step "4/5  Reload nginx"
systemctl reload nginx
echo "     ter-reload"

step "5/5  Uji tanpa DNS (lewat header Host)"
# Langkah diagnostik saja: pemasangan sudah selesai di langkah 4. Dibungkus
# supaya `set -e` tidak pernah menghentikan skrip di sini — sebuah uji yang
# gagal tidak boleh terlihat seperti pemasangan yang gagal.
for path in / /pencarian/ /detail/ /tidak-ada/; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: ${SITE}" "http://127.0.0.1${path}" 2>/dev/null) || code="(uji gagal)"
  printf "     %-16s %s\n" "$path" "${code:-(kosong)}"
done || true

printf "\n\033[32mSelesai.\033[0m Harapan: / /pencarian/ /detail/ = 200, /tidak-ada/ = 404\n"
printf "Rollback kapan pun: sudo rm %s && sudo systemctl reload nginx\n\n" "$ENABLED"
