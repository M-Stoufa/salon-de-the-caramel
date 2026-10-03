# Caramel — site notes
Pages: index.html · prop.html (À propos) · gallery.html · m.html (Menu) · resrv.html
Forms: set the real endpoint in assets/site.js (FORM_ENDPOINT). Empty = opens an email to the salon.
Menu: edit the items/prices directly in m.html (one .mi block per item).

## Add a photo to the gallery
1. Put the .webp in images/ (max ~1600px on the long side).
2. Run: python3 tools/make_thumbs.py
3. Add {"f":"newname","k":"Desserts","c":2,"s":4,"mt":0,"w":<width>,"h":<height>} to a scene in assets/gallery-data.js
   (or add a new scene line). Neighbours in a scene should have different c/mt values so it stays asymmetric.
