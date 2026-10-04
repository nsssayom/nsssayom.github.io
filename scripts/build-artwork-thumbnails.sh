#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Pre-filter fine linework before the browser reduces it to a card on a 1x display.
# Linear-light Mitchell resampling retains thin highlights without sharpening halos.
# Originals remain untouched for the image viewer and high-density displays.
mkdir -p assets/images/thumbnails
for source in \
  assets/images/portfolio/buggy-drone.webp \
  assets/images/portfolio/meldcx-platform.webp \
  assets/images/portfolio/robotic-perception-wfm.webp \
  assets/images/portfolio/robotic-perception-wfm-light.webp \
  assets/images/portfolio/agent-msg.webp \
  assets/images/portfolio/disaster-tracking.webp \
  assets/images/portfolio/theia-omr.webp \
  assets/images/research/property-guided-surrogation.webp; do
  name="$(basename "$source" .webp)"
  for width in 400 600 800; do
    magick "$source" -colorspace RGB -filter Mitchell -resize "${width}x" \
      -colorspace sRGB -quality 92 "assets/images/thumbnails/${name}-${width}.webp"
  done
done
