# Usage: python3 tools/make_thumbs.py [--regen] [--avif]
#   (run from the site folder; needs: pip install pillow)
#   Creates optimized thumbnails in images/t/ for every photo in images/.
#   - WebP: max 800px wide, quality 68 (was 900px/q74 -> ~40% smaller, still sharp on gallery grid)
#   - AVIF (opt-in with --avif): same size, quality 50, saved next to the .webp for future <picture> use
#   - Skips UI assets that must never become thumbs: favicon, hero-poster, parallax background
#   - By default only builds missing thumbs; --regen rebuilds all (use after tuning quality).
import os
import sys
from PIL import Image

MAX_W, MAX_H = 800, 1200
WEBP_Q = 68
AVIF_Q = 50
SKIP = {"favicon.webp", "hero-poster.webp", "parallax-caramel.webp"}
WANT_AVIF = "--avif" in sys.argv
REGEN = "--regen" in sys.argv

os.makedirs("images/t", exist_ok=True)
made = saved = 0
for f in sorted(os.listdir("images")):
    if not f.endswith(".webp") or f in SKIP:
        continue
    dst = f"images/t/{f}"
    if os.path.exists(dst) and not REGEN:
        continue
    im = Image.open(f"images/{f}").convert("RGB")
    im.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
    im.save(dst, "WEBP", quality=WEBP_Q, method=6)
    made += 1
    saved += os.path.getsize(f"images/{f}") - os.path.getsize(dst)
    print(f"thumb {f} -> {os.path.getsize(dst)//1024}KB")
    if WANT_AVIF:
        adst = f"images/t/{os.path.splitext(f)[0]}.avif"
        im.save(adst, "AVIF", quality=AVIF_Q)
        print(f"avif  {f} -> {os.path.getsize(adst)//1024}KB")
print(f"done: {made} thumbs, saved ~{saved//1024}KB vs full-size")
