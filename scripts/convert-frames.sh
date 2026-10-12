#!/usr/bin/env bash
# Converte le sequenze TIFF (con alpha) dello scrollytelling in WebP.
#
#   frames/esp/*.tif      -> public/frames/esp/esp_0001.webp …     (1600px)
#                         -> public/frames/esp-sm/esp_0001.webp …  (800px)
#   frames/macbook/*.tif  -> public/frames/mac/mac_0001.webp …     (1600px)
#                         -> public/frames/mac-sm/mac_0001.webp …  (800px)
#
# Uso:  bash scripts/convert-frames.sh
#
# Pipeline: TIFF -> PNG RGBA ridimensionato -> WebP con alpha.
# - TIFF -> PNG: ffmpeg. Fallback: `sips` (macOS) se ffmpeg manca.
#   (cwebp non legge questi TIFF: "Cannot retrieve TIFF ExtraSamples info".)
# - PNG -> WebP: cwebp (brew install webp). Fallback: ffmpeg, solo se
#   compilato con libwebp (`ffmpeg -encoders | grep libwebp`).
#
# I frame sono presi in ordine alfabetico e rinumerati da 0001.
# FRAME_STEP=2 tiene un frame ogni due (utile se la sequenza è troppo lunga).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/frames"
OUT="$ROOT/public/frames"
QUALITY="${QUALITY:-80}"
ALPHA_QUALITY="${ALPHA_QUALITY:-85}"
FRAME_STEP="${FRAME_STEP:-1}"
WARN_KB=80
JOBS="$(sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || echo 4)"

# sorgente:prefisso:cartella-desktop:cartella-mobile
SEQUENCES=(
  "esp:esp:esp:esp-sm"
  "macbook:mac:mac:mac-sm"
)

has() { command -v "$1" >/dev/null 2>&1; }

if has ffmpeg; then
  TO_PNG=ffmpeg
elif has sips; then
  TO_PNG=sips
else
  echo "Serve ffmpeg (brew install ffmpeg) oppure sips (macOS)." >&2
  exit 1
fi

if has cwebp; then
  TO_WEBP=cwebp
elif has ffmpeg && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libwebp; then
  TO_WEBP=ffmpeg
else
  echo "Serve cwebp (brew install webp) oppure ffmpeg con libwebp." >&2
  exit 1
fi

echo "TIFF->PNG: $TO_PNG · PNG->WebP: $TO_WEBP · q=$QUALITY · step=$FRAME_STEP · job=$JOBS"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Converte un singolo frame: <tif> <out.webp> <larghezza>
convert_one() {
  local src="$1" dst="$2" width="$3"
  local png="$TMP/$(basename "$dst" .webp)-$width.png"

  if [[ "$TO_PNG" == ffmpeg ]]; then
    ffmpeg -v error -y -i "$src" -vf "scale=$width:-2:flags=lanczos" -pix_fmt rgba "$png"
  else
    sips -s format png --resampleWidth "$width" "$src" --out "$png" >/dev/null
  fi

  if [[ "$TO_WEBP" == cwebp ]]; then
    cwebp -quiet -q "$QUALITY" -alpha_q "$ALPHA_QUALITY" -m 6 "$png" -o "$dst"
  else
    ffmpeg -v error -y -i "$png" -c:v libwebp -quality "$QUALITY" -pix_fmt yuva420p "$dst"
  fi

  rm -f "$png"
}
export -f convert_one
export TO_PNG TO_WEBP QUALITY ALPHA_QUALITY TMP

for sequence in "${SEQUENCES[@]}"; do
  IFS=: read -r src_dir prefix desktop_dir mobile_dir <<<"$sequence"

  if [[ ! -d "$SRC/$src_dir" ]]; then
    echo "Manca $SRC/$src_dir, salto." >&2
    continue
  fi

  rm -rf "${OUT:?}/$desktop_dir" "${OUT:?}/$mobile_dir"
  mkdir -p "$OUT/$desktop_dir" "$OUT/$mobile_dir"

  jobs_file="$TMP/$prefix.jobs"
  : >"$jobs_file"
  index=0
  kept=0
  while IFS= read -r file; do
    if ((index % FRAME_STEP == 0)); then
      kept=$((kept + 1))
      name="$(printf '%s_%04d.webp' "$prefix" "$kept")"
      printf '%s\0%s\0%s\0' "$file" "$OUT/$desktop_dir/$name" 1600 >>"$jobs_file"
      printf '%s\0%s\0%s\0' "$file" "$OUT/$mobile_dir/$name" 800 >>"$jobs_file"
    fi
    index=$((index + 1))
  done < <(find "$SRC/$src_dir" -maxdepth 1 -iname '*.tif*' | sort)

  echo "$src_dir: $index TIFF -> $kept frame"
  xargs -0 -n 3 -P "$JOBS" bash -c 'convert_one "$0" "$1" "$2"' <"$jobs_file"

  # Frame desktop troppo pesanti
  find "$OUT/$desktop_dir" -name '*.webp' -size +"${WARN_KB}"k -exec ls -l {} \; |
    awk -v kb="$WARN_KB" '{ printf "  ATTENZIONE %s: %d KB (> %d KB)\n", $NF, $5 / 1024, kb }'
done

echo
echo "Peso totale:"
for dir in "$OUT"/*/; do
  printf '  %-8s %4s file  %s\n' "$(basename "$dir")" "$(find "$dir" -name '*.webp' | wc -l | tr -d ' ')" "$(du -sh "$dir" | cut -f1)"
done
printf '  %-8s %s\n' "totale" "$(du -sh "$OUT" | cut -f1)"
