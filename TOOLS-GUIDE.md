# Tools guide — Caramel coffee-shop site (free only)

Installed 2026-09-28. Windows + WSL (Ubuntu 26.04).

## 1. Design websites
| Tool | Where | Use for Caramel |
|---|---|---|
| VS Code 1.139 (+ Prettier, Live Server, Tailwind IntelliSense, Gutter Preview) | Windows | Edit HTML/CSS/JS; right-click `index.html` → Open with Live Server |
| Chrome Beta + DevTools + Lighthouse | Windows | F12 responsive mode; Lighthouse (Performance/SEO) on `index.html`, `gallery.html` |
| Figma Desktop 126 (free tier) | Windows | Mock menu/gallery layouts before coding; free coffee-shop templates in Figma Community |
| Photopea (web, free) | browser | Quick Photoshop-like edits without install |
| Node 24 + Prettier 3.9 (WSL) | WSL | `prettier --check assets/*.js` formatting |

Preview without install: `python3 -m http.server 8000` in site folder → http://localhost:8000

## 2. Manage images
| Tool | Where | Use |
|---|---|---|
| XnConvert 1.116 | Windows | Batch resize/convert/compress (e.g. folder → WebP q70, max 1600px) |
| GIMP 3.2 | Windows | Retouch/crop single photos, export WebP |
| Squoosh.app / TinyPNG (web) | browser | Compare WebP q60 vs q70 visually before committing |
| `tools/make_thumbs.py` (Pillow 12, WebP+AVIF) | WSL | `python3 tools/make_thumbs.py` (missing only) · `--regen` (rebuild all, 800px/q68) · `--avif` (also write AVIF) |
| `tools/audit_images.py` | WSL | `python3 tools/audit_images.py` — flags >300KB files, missing thumbs/alt/sizes |
| sharp-cli 6.1 | WSL (`~/.npm-global/bin/sharp`) | One-off converts, e.g. `sharp -i in.jpg -o out.webp --webpQuality 68 resize 1600` |

Rules for this site: full photo = WebP, max 1600px long side, ≤300KB.
Thumb = `images/t/<same>.webp`, 800px, q68. Never thumb `favicon/hero-poster/parallax-*`.
Every `<img>` needs `alt`, `width`+`height`, `loading="lazy"` (except hero).

Add a photo: 1) drop `.webp` in `images/` 2) `python3 tools/make_thumbs.py`
3) add `{"f":"name","k":"Category","c":…,"s":…,"mt":…,"w":…,"h":…}` to a scene
in `assets/gallery-data.js` (neighbours in a scene need different `c/mt`).

## 3. Learn image-heavy coffee-shop design
Patterns used here: fullscreen hero video + poster fallback, asymmetric 12-col
gallery with staggered offsets (`c/s/mt`), menu chips, parallax band, lazy reveal (`.rv`).
Budget: each page <1.5MB images, Lighthouse Performance >90.
Free learning: MDN “Responsive images” (`srcset/sizes`, `loading`, `decoding`),
web.dev “Serve images in modern formats” + “Properly size images”,
Figma Community coffee-shop kits, Awwwards coffee sites for layout ideas,
Unsplash/Pexels for placeholders (check license before commercial use).

## 4. Research playbook (deep search 2026-10 — applied to this site)
Sources: WebFX, MyCaliDesigns, getsauce, QSR Magazine, TheFoodyGram, gofoodservice,
pzmeer, MDN, web.dev, Chrome DevTools docs, Cloudinary, corewebvitals.io, GourmetPix, Studio Cotton.

**Web editing / layout:** mobile-first (62%+ visits on phones); 44px tap targets;
16px min body; one-thumb test; single-column mobile; whitespace frames CTAs;
menu in HTML text (never PDF — SEO + screen readers); CTAs (Call, Reserve, Menu)
biggest elements, above the fold; hours + phone + address on every page;
no autoplay-with-sound, no heavy scripts.

**Managing space:** one idea per screen; cut section padding until each block
reads whole (~1 viewport); headlines shrink with content (clamp); repeated info
lives once (footer/contact exempt — conversion essentials); every photo earns
its slot (hero / appetite / place / people / proof), else cut it.

**Managing images:** WebP everywhere (25–35% smaller than JPEG), AVIF next;
max 1600px long side, ≤300KB each; 800px thumbs for grids; `width`+`height`
always (CLS ≤ 0.1); `loading="lazy"` everywhere except LCP; LCP image eager +
`fetchpriority="high"` + preloaded; offscreen carousel clones get
`fetchpriority="low"`; never lazy-load the hero; strip EXIF; one photo → one
placement (dedupe script enforces).

**Client preferences (what café visitors want):** menu first (88% of Gen Z check
it online), then hours, location/map, phone/tap-to-call, real photos of food +
room, reviews, prices kept current; 53% leave if load >3s (target LCP ≤2.5s);
local SEO: exact city keywords (“salon de thé Le Kef”), Google Business
Profile, JSON-LD CafeOrCoffeeShop schema (added to `index.html`), alt text
with dish + place names; ask regulars for Google reviews and reshare them.

**Validators now in repo:** `htmlhint` (HTML), `stylelint` + `.stylelintrc.json`
(CSS, zeroplet duplicates), `broken-link-checker` (318 links, 0 broken),
`tools/audit_images.py` (0 issues), headless-Brave screenshot + probe checks
(marquee motion, menu search, mobile 390px).
Caveat: Playwright can't drive Windows Brave from WSL (pipe boundary) —
headless CLI + probe pages cover the same checks.

## Audit status (2026-09-28)
Thumbs rebuilt 900px/q74 → 800px/q68: `images/t/` 3.8MB → 3.1MB.
Open: `an.webp` 357KB, `esp.webp` 313KB full-size originals — recompress
in XnConvert/Squoosh or re-export from GIMP, then re-run audit.
