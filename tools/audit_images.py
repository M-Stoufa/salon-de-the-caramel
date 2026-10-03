# Usage: python3 tools/audit_images.py   (run from the site folder)
# Checks every image decision that matters for an image-heavy coffee-shop site:
# heavy files, missing thumbs, gallery-data refs, and <img> hygiene (alt/size/lazy).
import os
import re
from pathlib import Path

root = Path(".")
imgs = sorted((root / "images").glob("*.webp"))
thumbs = {p.name for p in (root / "images" / "t").glob("*.webp")}
SKIP_THUMB = {"favicon.webp", "hero-poster.webp", "parallax-caramel.webp", "logo.webp", "cacao-bg.webp", "menu-bg.webp"}
issues = []

total = sum(p.stat().st_size for p in imgs)
print(f"images/: {len(imgs)} files, {total/1024/1024:.1f}MB total")
print(f"images/t/: {len(thumbs)} thumbs")

heavy = [p for p in imgs if p.stat().st_size > 300 * 1024 and p.name not in SKIP_THUMB]
for p in heavy:
    issues.append(f"HEAVY {p.name} {p.stat().st_size//1024}KB (>300KB: re-export or lower quality)")
missing = [p.name for p in imgs if p.name not in thumbs and p.name not in SKIP_THUMB]
for m in missing:
    issues.append(f"NO-THUMB images/t/{m} missing (run: python3 tools/make_thumbs.py)")

data = (root / "assets" / "gallery-data.js").read_text(encoding="utf-8", errors="replace")
refs = set(re.findall(r'"f":"([^"]+)"', data))
on_disk = {p.stem for p in imgs}
for r in sorted(refs - on_disk):
    issues.append(f"GALLERY-REF images/{r}.webp referenced but missing on disk")
unused = sorted(on_disk - refs - {"favicon", "hero-poster", "parallax-caramel"})
if unused:
    print(f"note: {len(unused)} photos on disk but not in gallery (homepage/menu use is fine): {', '.join(unused[:12])}")

for html in ["index.html", "gallery.html", "m.html", "prop.html", "resrv.html"]:
    p = root / html
    if not p.exists():
        continue
    tags = re.findall(r"<img\b[^>]*>", p.read_text(encoding="utf-8", errors="replace"), re.I)
    for t in tags:
        src = re.search(r'src="([^"]+)"', t)
        name = src.group(1) if src else "?"
        if name.startswith("data:") or "logo.webp" in name:
            continue  # lightbox placeholder swapped by JS — ignore
        if "alt=" not in t:
            issues.append(f"{html}: <img {name}> missing alt=")
        if "width=" not in t or "height=" not in t:
            issues.append(f"{html}: <img {name}> missing width/height (causes layout shift)")
        if "loading=" not in t and "hero" not in name and "favicon" not in name:
            issues.append(f"{html}: <img {name}> missing loading=lazy")

hero = root / "hero.mp4"
if hero.exists():
    mb = hero.stat().st_size / 1024 / 1024
    print(f"hero.mp4: {mb:.1f}MB")
    if mb > 5:
        issues.append(f"HEAVY hero.mp4 {mb:.1f}MB (>5MB: compress to 720p, keep poster)")

print()
if issues:
    print(f"{len(issues)} issue(s):")
    for i in issues:
        print(" -", i)
else:
    print("OK: no image issues found.")
