#!/usr/bin/env bash
#
# Kembalikan situs ke rilis sebelumnya. Tanpa sudo, tanpa build.
#
#   rollback.sh              kembali ke rilis tepat sebelum yang aktif
#   rollback.sh 20260801_143007   kembali ke rilis tertentu
#   rollback.sh --list       lihat rilis yang tersimpan
#
# Ini yang membuat rilis bernomor sepadan: perbaikan tidak perlu menunggu build
# lain selesai. Rilis lama masih utuh di disk, jadi memulihkan situs hanya
# mengganti ke mana satu symlink menunjuk — hitungan milidetik.
set -euo pipefail

BASE="/srv/www/kostella"
RELEASES="$BASE/releases"
CURRENT="$BASE/current"
SITE="kostella.hyperscore.cloud"

info() { printf "    %s\n" "$1"; }
fail() { printf "\n\033[31mGAGAL: %s\033[0m\n" "$1" >&2; exit 1; }

[ -d "$RELEASES" ] || fail "folder rilis tidak ada: $RELEASES"

ACTIVE=""
[ -L "$CURRENT" ] && ACTIVE="$(basename "$(readlink -f "$CURRENT")")"

# Terbaru dulu, supaya "sebelumnya" berarti satu langkah mundur dari yang aktif.
mapfile -t ALL < <(ls -1t "$RELEASES" 2>/dev/null)

if [ "${1:-}" = "--list" ]; then
  printf "\n\033[1mRilis tersimpan\033[0m (terbaru dulu)\n\n"
  for r in "${ALL[@]}"; do
    mark="  "
    [ "$r" = "$ACTIVE" ] && mark="\033[32m->\033[0m"
    commit="$(grep -m1 '^commit' "$RELEASES/$r/DEPLOY_INFO.txt" 2>/dev/null | cut -d: -f2- | xargs || echo '-')"
    pesan="$(grep -m1 '^pesan' "$RELEASES/$r/DEPLOY_INFO.txt" 2>/dev/null | cut -d: -f2- | xargs || echo '-')"
    printf "  %b %-18s %-9s %s\n" "$mark" "$r" "$commit" "$pesan"
  done
  printf "\n  -> = sedang aktif\n\n"
  exit 0
fi

TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  # Rilis pertama dalam daftar yang bukan yang sedang aktif.
  for r in "${ALL[@]}"; do
    [ "$r" = "$ACTIVE" ] && continue
    TARGET="$r"
    break
  done
  [ -n "$TARGET" ] || fail "tidak ada rilis lain untuk dituju (tersimpan: ${#ALL[@]})"
fi

[ -d "$RELEASES/$TARGET" ] || fail "rilis tidak ada: $TARGET  (lihat: rollback.sh --list)"
[ "$TARGET" = "$ACTIVE" ] && fail "$TARGET memang sedang aktif"
[ -f "$RELEASES/$TARGET/index.html" ] || fail "$TARGET tidak berisi index.html — rilis rusak"

printf "\n\033[1mRollback\033[0m  %s -> %s\n\n" "${ACTIVE:-(tidak ada)}" "$TARGET"

# Atomik, dengan alasan yang sama seperti di deploy.sh: `ln -sfn` sendirian
# meninggalkan celah tanpa docroot.
ln -sfn "$RELEASES/$TARGET" "${CURRENT}.tmp"
mv -Tf "${CURRENT}.tmp" "$CURRENT"
info "current -> $TARGET"

for path in / /pencarian/ /detail/; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 --resolve "$SITE:443:127.0.0.1" "https://$SITE${path}" || echo 000)"
  printf "    %-14s %s\n" "$path" "$code"
  [ "$code" = "200" ] || fail "$path mengembalikan $code — rilis tujuan pun bermasalah"
done

printf "\n\033[32mSelesai.\033[0m Situs pada rilis %s\n" "$TARGET"
[ -f "$RELEASES/$TARGET/DEPLOY_INFO.txt" ] && sed 's/^/    /' "$RELEASES/$TARGET/DEPLOY_INFO.txt"
printf "\n"
