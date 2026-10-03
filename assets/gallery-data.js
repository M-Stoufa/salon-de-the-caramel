/* Gallery photos. One line = one "scene" (a group shown together).
   f = file name in images/ (no extension) · k = caption/category · w,h = pixel size
   c = start column (1-12) · s = column span · mt = top offset (vw units, staggers the layout) */
window.SCENES=[
  [{"f":"3","k":"Atmosphère","c":6,"s":6,"mt":10,"w":1400,"h":1050}],
 [{"f":"du","k":"Thé & détails","c":2,"s":3,"mt":14,"w":880,"h":1280},{"f":"2000","k":"Thé & détails","c":7,"s":4,"mt":0,"w":846,"h":1280}],
  [{"f":"cup2","k":"Boissons","c":8,"s":4,"mt":0,"w":849,"h":1280}],
  [{"f":"cake1","k":"Desserts","c":2,"s":4,"mt":12,"w":911,"h":1280},{"f":"caf1","k":"Boissons","c":9,"s":3,"mt":0,"w":786,"h":1600}],
  [{"f":"31","k":"Boissons","c":8,"s":4,"mt":8,"w":1055,"h":1600}],
 [{"f":"moj","k":"Boissons","c":1,"s":3,"mt":10,"w":1267,"h":2048},{"f":"d","k":"Desserts","c":5,"s":4,"mt":0,"w":686,"h":1093},{"f":"glace1","k":"Boissons","c":10,"s":3,"mt":14,"w":706,"h":1280}],
 [{"f":"dej","k":"Desserts","c":3,"s":5,"mt":0,"w":755,"h":1156},{"f":"6000","k":"Desserts","c":9,"s":3,"mt":10,"w":840,"h":1097}],
  [{"f":"4000","k":"Desserts","c":6,"s":4,"mt":8,"w":1025,"h":1280},{"f":"s","k":"Desserts","c":10,"s":3,"mt":0,"w":1130,"h":1535}],
  [{"f":"j","k":"Boissons","c":2,"s":3,"mt":12,"w":1236,"h":2048}],
 [{"f":"or","k":"Boissons","c":1,"s":3,"mt":0,"w":1115,"h":1600},{"f":"fraise","k":"Boissons","c":5,"s":3,"mt":10,"w":1184,"h":2048},{"f":"sa","k":"Desserts","c":9,"s":4,"mt":2,"w":741,"h":1091}],
 [{"f":"5000","k":"Boissons","c":3,"s":3,"mt":0,"w":716,"h":1280},{"f":"food","k":"Boissons","c":7,"s":3,"mt":8,"w":763,"h":1280},{"f":"8000","k":"Boissons","c":10,"s":3,"mt":3,"w":611,"h":800}],
  [{"f":"7000","k":"Atmosphère","c":2,"s":5,"mt":0,"w":960,"h":1280}],
  [{"f":"2","k":"Boissons","c":2,"s":3,"mt":0,"w":1175,"h":2048},{"f":"ba","k":"Desserts","c":6,"s":4,"mt":10,"w":733,"h":1280},{"f":"n2-sucre-171854","k":"Douceurs","c":11,"s":2,"mt":3,"w":1080,"h":1080}],
  [{"f":"caramel-cake-slice-amande","k":"Desserts","c":2,"s":4,"mt":0,"w":1199,"h":1600},{"f":"caramel-cake-slice-ananas-banane","k":"Desserts","c":7,"s":4,"mt":8,"w":1199,"h":1600}],
  [{"f":"caramel-cake-slice-choco","k":"Desserts","c":1,"s":4,"mt":0,"w":1200,"h":1600},{"f":"caramel-cake-slice-choco-blanc-et-noir","k":"Desserts","c":6,"s":3,"mt":10,"w":1199,"h":1600},{"f":"caramel-cake-slice-choco-noir","k":"Desserts","c":10,"s":3,"mt":2,"w":1199,"h":1600}],
  [{"f":"caramel-cake-slice-choco-noir-2","k":"Desserts","c":2,"s":3,"mt":0,"w":1201,"h":1600},{"f":"caramel-cake-slice-fraise-cranberry","k":"Desserts","c":6,"s":4,"mt":6,"w":1199,"h":1600},{"f":"caramel-cake-slice-pistache-vert-2","k":"Desserts","c":11,"s":2,"mt":0,"w":1201,"h":1600},{"f":"caramel-cake-slice-pistache-vert-3","k":"Desserts","c":4,"s":3,"mt":8,"w":1201,"h":1600}],
  [{"f":"n2-coffee-262496","k":"Boissons","c":2,"s":3,"mt":0,"w":963,"h":1600},{"f":"n2-jus-306471","k":"Boissons","c":6,"s":4,"mt":8,"w":1024,"h":1536},{"f":"n2-sale-260011","k":"Salé","c":11,"s":2,"mt":0,"w":1024,"h":1430}],
  [{"f":"n2-coffee-411185","k":"Boissons","c":1,"s":4,"mt":0,"w":897,"h":1600},{"f":"n2-jus-430116","k":"Boissons","c":6,"s":3,"mt":10,"w":976,"h":1600},{"f":"n2-sucre-365035","k":"Douceurs","c":10,"s":3,"mt":2,"w":1200,"h":1600}],
  [{"f":"caramel-barcha-cakes-lotus","k":"Desserts","c":2,"s":4,"mt":0,"w":1310,"h":1600},{"f":"caramel-crepe","k":"Desserts","c":7,"s":4,"mt":8,"w":1280,"h":1600},{"f":"caramel-caramel-special-creme-cake","k":"Desserts","c":4,"s":4,"mt":4,"w":1310,"h":1600},{"f":"caramel-cup-chocolate-cake","k":"Desserts","c":9,"s":3,"mt":10,"w":757,"h":1280},{"f":"n2-sucre-325186","k":"Douceurs","c":1,"s":3,"mt":6,"w":1024,"h":1536}],
  [{"f":"n3-3918-n","k":"Équipe","c":2,"s":3,"mt":0,"w":1039,"h":1600},{"f":"n3-4372-n","k":"Équipe","c":6,"s":4,"mt":6,"w":1242,"h":1600},{"f":"n3-4933-n","k":"Douceurs","c":11,"s":2,"mt":0,"w":1064,"h":1600}],
  [{"f":"n3-6056-n","k":"Salé","c":1,"s":4,"mt":0,"w":935,"h":1281},{"f":"n3-6641-n","k":"Équipe","c":6,"s":3,"mt":10,"w":1178,"h":1600},{"f":"n3-7211-n","k":"Douceurs","c":10,"s":3,"mt":2,"w":840,"h":1490},{"f":"n3-9791-n","k":"Douceurs","c":4,"s":3,"mt":8,"w":945,"h":1600}]
];
