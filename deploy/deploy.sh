#!/usr/bin/env bash
#
# Deploy Kostella. Tanpa sudo, tanpa downtime.
#
#   /srv/www/kostella/deploy/deploy.sh [branch]
#
# Build berlangsung di repo/, jauh dari yang sedang disajikan nginx. Baru
# setelah build sukses dan hasilnya terverifikasi, `current` ditukar ke rilis
# baru — dan pertukarannya atomik, sehingga tidak ada satu pun request yang
# melihat keadaan setengah jadi.
#
# Versi sebelumnya membangun langsung di atas folder yang disajikan. `next
# build` menghapus dan membuat ulang out/, jadi situs mengembalikan 404 selama
# build berjalan. Itu yang diperbaiki di sini.
#
# Kalau apa pun gagal sebelum pertukaran, rilis baru dibuang dan `current`
# tidak tersentuh. Kalau verifikasi gagal SETELAH pertukaran, skrip
# mengembalikannya sendiri ke rilis sebelumnya.
set -euo pipefail

BASE="/srv/www/kostella"
REPO="$BASE/repo"
RELEASES="$BASE/releases"
CURRENT="$BASE/current"
LOGS="$BASE/logs"
SITE="kostella.hyperscore.cloud"

BRANCH="${1:-main}"
KEEP_RELEASES=5
KEEP_LOGS=10

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
NEW_RELEASE="$RELEASES/$TIMESTAMP"
LOG="$LOGS/deploy-${TIMESTAMP}.log"

mkdir -p "$RELEASES" "$LOGS"
exec > >(tee -a "$LOG") 2>&1

step() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }
info() { printf "    %s\n" "$1"; }
fail() { printf "\n\033[31mGAGAL: %s\033[0m\n" "$1" >&2; exit 1; }

SWAPPED=0
PREVIOUS=""

# Rapikan sendiri kalau berhenti di tengah jalan. Sebelum pertukaran, cukup
# buang rilis setengah jadi. Sesudahnya, kembalikan `current` — meninggalkan
# situs menunjuk rilis yang gagal verifikasi lebih buruk daripada tidak deploy.
cleanup() {
  local code=$?
  [ "$code" -eq 0 ] && return 0

  if [ "$SWAPPED" -eq 1 ] && [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    ln -sfn "$PREVIOUS" "${CURRENT}.tmp" && mv -Tf "${CURRENT}.tmp" "$CURRENT"
    info "Dikembalikan ke $(basename "$PREVIOUS")"
  fi
  if [ -d "$NEW_RELEASE" ]; then
    rm -rf "$NEW_RELEASE"
    info "Rilis gagal dibuang: $TIMESTAMP"
  fi
  printf "\033[31mDeploy dibatalkan. Situs tetap pada rilis sebelumnya.\033[0m\n" >&2
}
trap cleanup EXIT

[ -d "$REPO/.git" ] || fail "klon git tidak ada di $REPO"

printf "\033[1mDeploy Kostella\033[0m  branch=%s  rilis=%s\n" "$BRANCH" "$TIMESTAMP"

step "1/7  Tarik perubahan"
cd "$REPO"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"
git reset --hard --quiet "origin/$BRANCH"
COMMIT="$(git rev-parse --short HEAD)"
info "$COMMIT  $(git log -1 --format=%s)"

step "2/7  Pasang dependensi"
npm ci --no-audit --no-fund --silent
info "selesai"

step "3/7  Build"
npm run build > /dev/null
[ -f "$REPO/out/index.html" ] || fail "build tidak menghasilkan out/index.html"
info "$(du -sh "$REPO/out" | cut -f1) di out/"

step "4/7  Siapkan rilis"
# Salin, bukan pindah: repo/out/ dibiarkan utuh supaya build berikutnya bisa
# memakai cache Next, dan rilis jadi salinan mandiri yang tidak akan berubah
# saat build berikutnya menghapus out/.
cp -a "$REPO/out" "$NEW_RELEASE"
cat > "$NEW_RELEASE/DEPLOY_INFO.txt" <<INFO
rilis   : $TIMESTAMP
commit  : $COMMIT
branch  : $BRANCH
pesan   : $(git log -1 --format=%s)
waktu   : $(date --iso-8601=seconds)
oleh    : $(whoami)@$(hostname)
INFO
info "$NEW_RELEASE"

step "5/7  Tukar current (atomik)"
# `ln -sfn` sendirian TIDAK atomik: ia menghapus symlink lalu membuatnya lagi,
# dan di celah itu docroot nginx tidak ada. Membuat symlink sementara lalu
# menimpanya dengan `mv -T` adalah satu operasi rename — itu yang atomik di
# Linux, sehingga tidak ada request yang bisa jatuh di antaranya.
[ -L "$CURRENT" ] && PREVIOUS="$(readlink -f "$CURRENT")"
ln -sfn "$NEW_RELEASE" "${CURRENT}.tmp"
mv -Tf "${CURRENT}.tmp" "$CURRENT"
SWAPPED=1
info "current -> $TIMESTAMP"

step "6/7  Verifikasi lewat nginx"
for path in / /pencarian/ /detail/; do
  # Lewat HTTPS dengan --resolve, bukan port 80 dengan header Host: Certbot
  # memasang redirect 80->443, jadi menguji port 80 selalu mengembalikan 301
  # dan verifikasi ini akan me-rollback setiap deploy yang justru berhasil.
  # --resolve memaksa ke 127.0.0.1 sehingga uji ini tidak bergantung DNS luar,
  # sekaligus benar-benar melewati TLS seperti pengunjung.
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 --resolve "$SITE:443:127.0.0.1" "https://$SITE${path}" || echo 000)"
  printf "    %-14s %s\n" "$path" "$code"
  [ "$code" = "200" ] || fail "$path mengembalikan $code"
done

step "7/7  Bersihkan rilis dan log lama"
# `ls -1t` mengurutkan dari terbaru; sisanya setelah KEEP_RELEASES dibuang.
# Rilis yang sedang ditunjuk `current` dilindungi, apa pun urutannya.
KEEP_PATH="$(readlink -f "$CURRENT")"
while read -r old; do
  [ -z "$old" ] && continue
  [ "$(readlink -f "$RELEASES/$old")" = "$KEEP_PATH" ] && continue
  rm -rf "${RELEASES:?}/$old"
  info "dibuang: $old"
done < <(ls -1t "$RELEASES" 2>/dev/null | tail -n "+$((KEEP_RELEASES + 1))")

ls -1t "$LOGS"/deploy-*.log 2>/dev/null | tail -n "+$((KEEP_LOGS + 1))" | xargs -r rm -f
info "$(ls -1 "$RELEASES" | wc -l) rilis disimpan"

# Skrip ini dieksekusi dari luar pohon yang di-pull, supaya `git reset` di
# langkah 1 tidak menulis ulang berkas yang sedang dibaca bash. Konsekuensinya
# ia bisa tertinggal dari repo — jadi cukup dilaporkan, bukan diperbarui
# diam-diam di tengah eksekusinya sendiri.
if ! diff -q "$REPO/deploy/deploy.sh" "$BASE/deploy/deploy.sh" > /dev/null 2>&1; then
  printf "\n\033[33mCatatan:\033[0m skrip deploy di repo berbeda dengan yang barusan dijalankan.\n"
  printf "  Segarkan dengan: cp %s/deploy/*.sh %s/deploy/\n" "$REPO" "$BASE"
fi

printf "\n\033[32mSelesai.\033[0m %s -> rilis %s (%s)\n" "$SITE" "$TIMESTAMP" "$COMMIT"
printf "Rollback: %s/deploy/rollback.sh\n\n" "$BASE"
