#!/usr/bin/env bash
# Deploy ulang Kostella. Tanpa sudo, tanpa downtime yang berarti — nginx
# menyajikan folder yang sama sepanjang waktu; hanya isinya yang diganti.
set -euo pipefail
cd /srv/www/kostella
git pull --ff-only
npm ci --no-audit --no-fund
npm run build
echo "Selesai: $(git rev-parse --short HEAD) — $(git log -1 --format=%s)"
