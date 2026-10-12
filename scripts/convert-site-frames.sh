#!/usr/bin/env bash
# Converte la sequenza PNG della home in WebP.
#
#   frames/site/site0000.png …  -> public/frames/site/site_0000.webp     (desktop)
#                               -> public/frames/site-sm/site_0000.webp  (960px)
#
# Uso:  bash scripts/convert-site-frames.sh   (oppure `npm run frames`)
#
# La numerazione resta quella dei sorgenti (site0180.png -> site_0180.webp),
# così "il frame 180" è lo stesso file ovunque.
# Desktop: 1920px o la larghezza nativa se più piccola (niente upscale).
# Encoder: cwebp (brew install webp). Fallback: ffmpeg con libwebp.
# L'alpha, se c'è, resta: cwebp la conserva da solo.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${SRC:-$ROOT/frames/site}"
OUT="$ROOT/public/frames"
DESKTOP_WIDTH="${DESKTOP_WIDTH:-1920}"
MOBILE_WIDTH="${MOBILE_WIDTH:-960}"
DESKTOP_QUALITY="${DESKTOP_QUALITY:-80}"
MOBILE_QUALITY="${MOBILE_QUALITY:-75}"
TARGET_KB=70
JOBS="$(sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || echo 4)"

has() { command -v "$1" >/dev/null 2>&1; }

if has cwebp; then
  ENCODER=cwebp
elif has ffmpeg && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libwebp; then
  ENCODER=ffmpeg
else
  echo "Serve cwebp (brew install webp) oppure ffmpeg con libwebp." >&2
  exit 1
fi

if [[ ! -d "$SRC" ]]; then
  echo "Manca $SRC (servono i PNG site0000.png …)." >&2
  exit 1
fi

first="$(find "$SRC" -maxdepth 1 -name 'site[0-9]*.png' | sort | head -1)"
if [[ -z "$first" ]]; then
  echo "Nessun site*.png in $SRC." >&2
  exit 1
fi

# Larghezza nativa: niente upscale.
if has sips; then
  native="$(sips -g pixelWidth "$first" | awk '/pixelWidth/ { print $2 }')"
else
  native="$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$first")"
fi
((DESKTOP_WIDTH > native)) && DESKTOP_WIDTH="$native"
((MOBILE_WIDTH > native)) && MOBILE_WIDTH="$native"

echo "Encoder: $ENCODER · desktop ${DESKTOP_WIDTH}px q$DESKTOP_QUALITY · mobile ${MOBILE_WIDTH}px q$MOBILE_QUALITY · job=$JOBS"

# Converte un frame: <png> <out.webp> <larghezza> <qualità>
convert_one() {
  local src="$1" dst="$2" width="$3" quality="$4"
  if [[ "$ENCODER" == cwebp ]]; then
    cwebp -quiet -q "$quality" -alpha_q 85 -m 6 -resize "$width" 0 "$src" -o "$dst"
  else
    ffmpeg -v error -y -i "$src" -vf "scale=$width:-2:flags=lanczos" \
      -c:v libwebp -quality "$quality" "$dst"
  fi
}
export -f convert_one
export ENCODER

rm -rf "${OUT:?}/site" "${OUT:?}/site-sm"
mkdir -p "$OUT/site" "$OUT/site-sm"

while IFS= read -r file; do
  number="$(basename "$file" .png)"
  number="${number#site}"
  name="site_$(printf '%04d' "$((10#$number))").webp"
  printf '%s\0%s\0%s\0%s\0' "$file" "$OUT/site/$name" "$DESKTOP_WIDTH" "$DESKTOP_QUALITY"
  printf '%s\0%s\0%s\0%s\0' "$file" "$OUT/site-sm/$name" "$MOBILE_WIDTH" "$MOBILE_QUALITY"
done < <(find "$SRC" -maxdepth 1 -name 'site[0-9]*.png' | sort) |
  xargs -0 -n 4 -P "$JOBS" bash -c 'convert_one "$0" "$1" "$2" "$3"'

count="$(find "$OUT/site" -name '*.webp' | wc -l | tr -d ' ')"
echo "$count frame convertiti."

# Dimensioni in byte dei WebP di una cartella (stat BSD, poi GNU).
report() {
  local dir="$1"
  find "$dir" -name '*.webp' -exec stat -f '%z' {} + 2>/dev/null ||
    find "$dir" -name '*.webp' -printf '%s\n'
}

echo
for dir in site site-sm; do
  report "$OUT/$dir" | awk -v name="$dir" '
    { total += $1; n++; if ($1 > max) max = $1 }
    END { printf "  %-8s %3d frame · totale %.1f MB · media %.0f KB · max %.0f KB\n",
          name, n, total / 1048576, total / n / 1024, max / 1024 }'
done

over="$(report "$OUT/site" | awk -v kb="$TARGET_KB" '$1 > kb * 1024' | wc -l | tr -d ' ')"
if ((over > 0)); then
  echo "  ATTENZIONE: $over frame desktop sopra $TARGET_KB KB (prova DESKTOP_QUALITY=72)."
fi
