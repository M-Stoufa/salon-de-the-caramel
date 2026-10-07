/* Caramel — site behaviour v2 */
(() => {
  document.documentElement.classList.add('js');
  const FORM_ENDPOINT = ''; /* set a real https endpoint to POST forms; empty = mailto fallback */
  const MAIL = 'Contact.salondethecaramel@gmail.com';
  const PHONE_TXT = '+216 93 342 832';

  /* ---- nav ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const list = nav.querySelector('ul');
    const burger = nav.querySelector('.burger');
    const transparent = nav.hasAttribute('data-home');
    const onScroll = () => nav.classList.toggle('scrolled', !transparent || window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (burger) {
      const setIcon = (open) => {
        burger.textContent = open ? '×' : '☰';
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      };
      burger.addEventListener('click', () => {
        const open = list.classList.toggle('open');
        nav.classList.toggle('open', open);
        setIcon(open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      list.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => {
          list.classList.remove('open');
          nav.classList.remove('open');
          setIcon(false);
          document.body.style.overflow = '';
        })
      );
    }
  }

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));

  /* ---- menu: search + chips + count + spy ---- */
  const menuRoot = document.querySelector('[data-menu]');
  if (menuRoot) {
    const input = menuRoot.querySelector('#q');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = [...menuRoot.querySelectorAll('.mi')];
    const sections = [...menuRoot.querySelectorAll('.mc')];
    const chips = [...menuRoot.querySelectorAll('.cats a')];
    const count = menuRoot.querySelector('#count');
    const empty = menuRoot.querySelector('#empty');
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const apply = () => {
      const q = norm(input.value.trim());
      let shown = 0;
      items.forEach((it) => {
        const hit = !q || norm(it.textContent).includes(q);
        it.classList.toggle('hide', !hit);
        if (hit) shown++;
      });
      sections.forEach((sec) => {
        const vis = sec.querySelectorAll('.mi:not(.hide)').length;
        sec.style.display = vis ? '' : 'none';
      });
      count.textContent = q ? `${shown} résultat${shown > 1 ? 's' : ''} pour « ${input.value.trim()} »` : `${items.length} spécialités · 8 rubriques`;
      empty.classList.toggle('show', shown === 0);
      if (!reduceMotion) {
        let i = 0;
        items.forEach((it) => {
          if (!it.classList.contains('hide')) it.style.setProperty('--i', Math.min(i++, 24));
        });
        menuRoot.classList.remove('anim');
        void menuRoot.offsetWidth;
        requestAnimationFrame(() => menuRoot.classList.add('anim'));
        clearTimeout(menuRoot._at);
        menuRoot._at = setTimeout(() => menuRoot.classList.remove('anim'), 1100);
      }
      if (!q) spy();
    };
    input.addEventListener('input', apply);
    /* rich descriptions: split comma lists into organized bullets, tap toggles */
    menuRoot.classList.add('rich');
    menuRoot.querySelectorAll('.mi').forEach((it) => {
      const p = it.querySelector('p');
      if (!p || !p.textContent.trim()) return;
      const parts = p.textContent.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      if (!parts.length) return;
      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      p.innerHTML = '<ul class="org">' + parts.map((s) => `<li>${esc(s)}</li>`).join('') + '</ul>';
      it.classList.add('has-desc');
      it.setAttribute('tabindex', '0');
      const toggle = (e) => {
        if (window.matchMedia('(hover: hover)').matches && e.type === 'click') return; // desktop: hover does it
        const was = it.classList.contains('open');
        menuRoot.querySelectorAll('.mi.open').forEach((o) => o.classList.remove('open'));
        if (!was) it.classList.add('open');
      };
      it.addEventListener('click', toggle);
      it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
    });
    const spy = () => {
      let cur = null;
      sections.forEach((s) => {
        if (s.style.display !== 'none' && s.getBoundingClientRect().top < window.innerHeight * 0.35) cur = s.id;
      });
      chips.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
      /* keep the active chip visible: rail follows the reading position */
      const rail = menuRoot.querySelector('.cats');
      const on = chips.find((a) => a.classList.contains('on'));
      if (on && rail && rail._spyFor !== cur) {
        rail._spyFor = cur;
        if (!rail._dragAt || Date.now() - rail._dragAt > 2500) {
          rail.scrollTo({ left: on.offsetLeft - rail.clientWidth / 2 + on.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    };
    window.addEventListener('scroll', () => { if (!input.value) spy(); }, { passive: true });
    apply();
  }

  /* ---- chips rail: finger-drag scrolling that always works ---- */
  (() => {
    const rail = document.querySelector('.cats');
    if (!rail || !window.PointerEvent) return;
    rail.style.touchAction = 'pan-y'; /* page keeps vertical; JS owns horizontal */
    let down = false, sx = 0, sl = 0, moved = false, vx = 0, lastX = 0, raf = 0;
    rail.addEventListener('pointerdown', (e) => {
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
      lastX = e.clientX; vx = 0; cancelAnimationFrame(raf);
      rail._dragAt = Date.now(); /* tells the spy: hands off, user is driving */
    });
    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 8) {
        moved = true;
        rail.scrollLeft = sl - dx;
        vx = e.clientX - lastX; lastX = e.clientX;
      }
    });
    const up = () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      let v = vx;
      const step = () => {
        v *= 0.94;
        if (Math.abs(v) < 0.5) return;
        rail.scrollLeft -= v;
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointercancel', () => { down = false; moved = false; });
    rail.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  })();

  /* ---- gallery: render + lightbox ---- */
  const wall = document.getElementById('wall');
  if (wall && window.SCENES) {
    const flat = window.SCENES.flat();
    wall.innerHTML = flat
      .map(
        (p, i) =>
          `<figure class="rv" data-i="${i}" tabindex="0" role="button" aria-label="Agrandir : ${p.k}">` +
          `<img src="images/t/${p.f}.webp" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" alt="${p.k} — Salon de Thé Caramel">` +
          `<figcaption>${p.k}</figcaption></figure>`
      )
      .join('');
    wall.querySelectorAll('.rv').forEach((el) => io.observe(el));
    const lb = document.getElementById('lb');
    const img = document.getElementById('lb-img');
    const cap = document.getElementById('lb-cap');
    let cur = 0;
    const show = (i) => {
      cur = (i + flat.length) % flat.length;
      img.style.opacity = 0;
      const pre = new Image();
      pre.onload = () => { img.src = pre.src; img.alt = flat[cur].k; img.style.opacity = 1; };
      pre.src = `images/${flat[cur].f}.webp`;
      cap.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(flat.length).padStart(2, '0')} — ${flat[cur].k}`;
    };
    const open = (i) => { show(i); lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('on'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    wall.addEventListener('click', (e) => { const f = e.target.closest('figure'); if (f) open(+f.dataset.i); });
    wall.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { const f = e.target.closest('figure'); if (f) { e.preventDefault(); open(+f.dataset.i); } } });
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.p').addEventListener('click', () => show(cur - 1));
    lb.querySelector('.n').addEventListener('click', () => show(cur + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    window.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => {
      const d = e.changedTouches[0].clientX - sx;
      if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1));
    });
  }

  /* ---- marquee: infinite loop, always whole photos ---- */
  document.querySelectorAll('.marquee').forEach((box) => {
    const track = box.querySelector('.track');
    const prev = box.querySelector('.mq-prev');
    const next = box.querySelector('.mq-next');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.innerHTML += track.innerHTML + track.innerHTML; // 3 identical sets
    track.querySelectorAll('img').forEach((im, i) => { if (i >= 4) im.setAttribute('fetchpriority', 'low'); });
    const setW = () => track.scrollWidth / 3;
    const base = () => track.offsetLeft;
    track.scrollLeft = setW();
    const norm = () => {
      const s = setW();
      if (track.scrollLeft >= s * 2) track.scrollLeft -= s;
      else if (track.scrollLeft <= 0) track.scrollLeft += s;
    };
    const goImg = (d) => {
      norm();
      const step = () => {
        const list = [...track.querySelectorAll('img')];
        const x = track.scrollLeft, b = base();
        return d > 0
          ? list.find((im) => im.offsetLeft - b > x + 10)
          : [...list].reverse().find((im) => im.offsetLeft - b < x - 10);
      };
      let t = step();
      if (!t) {
        track.scrollTo({ left: d > 0 ? setW() : setW() * 2 - track.clientWidth, behavior: 'auto' });
        norm();
        t = step();
        if (!t) return;
      }
      track.scrollTo({ left: t.offsetLeft - base(), behavior: reduce ? 'auto' : 'smooth' });
    };
    let paused = reduce;
    const auto = () => {
      if (paused || document.hidden) return;
      goImg(1); // endless forward; norm() keeps it seamless
    };
    let timer = setInterval(auto, 4000);
    prev.addEventListener('click', () => goImg(-1));
    next.addEventListener('click', () => goImg(1));
    ['pointerenter', 'focusin', 'touchstart'].forEach((ev) => box.addEventListener(ev, () => (paused = true), { passive: true }));
    ['pointerleave', 'focusout', 'touchend'].forEach((ev) => box.addEventListener(ev, () => (paused = reduce)));
  });

  /* ---- number steppers (− / +) ---- */
  document.querySelectorAll('.stepper').forEach((st) => {
    const input = st.querySelector('input[type="number"]');
    st.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => {
        const min = +input.min || 1, max = +input.max || 99;
        input.value = Math.min(max, Math.max(min, (+input.value || min) + (+b.dataset.s || 0)));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      })
    );
  });

  /* ---- time picker (hour + minute steppers, free choice) ---- */
  document.querySelectorAll('.timepick').forEach((tp) => {
    const hh = tp.querySelector('#hh'), mm = tp.querySelector('#mm');
    const out = tp.querySelector('#heureHidden');
    const pad = (n) => String(n).padStart(2, '0');
    const sync = () => {
      let h = Math.min(23, Math.max(6, +hh.value || 18));
      let m = Math.min(59, Math.max(0, +mm.value || 0));
      m = Math.round(m / 5) * 5 % 60;
      hh.value = h; mm.value = m;
      out.value = pad(h) + ':' + pad(m);
    };
    tp.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => {
        if (b.dataset.u === 'h') {
          let h = (+hh.value || 18) + (+b.dataset.s || 0);
          hh.value = h > 23 ? 6 : h < 6 ? 23 : h;
        } else {
          let m = (+mm.value || 0) + (+b.dataset.s || 0);
          mm.value = m > 55 ? 0 : m < 0 ? 55 : m;
        }
        sync();
      })
    );
    hh.addEventListener('change', sync);
    mm.addEventListener('change', sync);
    sync();
  });

  /* ---- date inputs can't be in the past ---- */
  (() => {
    const t = new Date();
    t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    const today = t.toISOString().slice(0, 10);
    document.querySelectorAll('input[type="date"]').forEach((i) => (i.min = today));
  })();

  /* ---- animated counters ---- */
  (() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          cio.unobserve(el);
          const m = el.textContent.trim().match(/^(\d+)(.*)$/s);
          if (!m) return;
          const target = +m[1], suffix = m[2], t0 = performance.now(), dur = 1400;
          const tick = (t) => {
            const k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(target * ease) + suffix;
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      { threshold: 0.6 }
    );
    document.querySelectorAll('.stat b').forEach((el) => cio.observe(el));
  })();

  /* ---- hero parallax fade ---- */
  (() => {
    const hero = document.querySelector('.hero .wrap');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, window.innerHeight);
          hero.style.transform = `translateY(${y * 0.22}px)`;
          hero.style.opacity = String(1 - y / (window.innerHeight * 0.85));
          ticking = false;
        });
      },
      { passive: true }
    );
  })();

  /* ---- hero video: desktop only, saves mobile data ---- */
  (() => {
    const vid = document.querySelector('.hero video');
    if (!vid || !window.matchMedia('(min-width: 761px)').matches) return;
    const s = document.createElement('source');
    s.src = 'hero.mp4';
    s.type = 'video/mp4';
    vid.appendChild(s);
    vid.load();
    try { const pr = vid.play(); if (pr) pr.catch(() => {}); } catch (e) {}
  })();

  /* ---- forms ---- */
  document.querySelectorAll('form[data-sub]').forEach((fm) => {
    fm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = fm.querySelector('button[type="submit"]');
      const ok = fm.querySelector('.ok');
      const data = Object.fromEntries(new FormData(fm));
      btn.disabled = true;
      try {
        if (FORM_ENDPOINT) {
          await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          ok.textContent = fm.dataset.ok || 'Merci ! Message envoyé.';
        } else {
          location.href = `mailto:${MAIL}?subject=${encodeURIComponent(fm.dataset.sub)}&body=${encodeURIComponent(
            Object.entries(data).map(([k, v]) => `${k} : ${v}`).join('\n')
          )}`;
          ok.textContent = `Votre application e-mail va s’ouvrir pour envoyer la demande. Ou appelez-nous : ${PHONE_TXT}.`;
        }
        ok.classList.add('on');
        fm.reset();
      } catch {
        ok.textContent = `Envoi impossible en ligne. Appelez-nous : ${PHONE_TXT}.`;
        ok.classList.add('on');
      } finally {
        btn.disabled = false;
      }
    });
  });

  /* ---- sticky mobile action bar (thumb-zone CTA) ---- */
  (() => {
    if (!window.matchMedia('(max-width: 760px)').matches) return;
    const onResrv = /resrv\.html$/.test(location.pathname);
    const bar = document.createElement('div');
    bar.className = 'actionbar';
    bar.setAttribute('aria-label', 'Actions rapides');
    bar.innerHTML =
      '<a class="ab-call" href="tel:+21693342832"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>Appeler</a>' +
      `<a class="ab-book" href="${onResrv ? '#reservation' : 'resrv.html'}">Réserver</a>`;
    document.body.appendChild(bar);
    const toggle = () => bar.classList.toggle('on', window.scrollY > window.innerHeight * 0.55);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    /* step aside when a form is on screen: the page already converts there */
    const forms = [...document.querySelectorAll('form[data-sub]')];
    const checkForms = () => {
      const vh = window.innerHeight;
      const hit = forms.some((fm) => {
        const r = fm.getBoundingClientRect();
        return r.top < vh * 0.9 && r.bottom > vh * 0.1;
      });
      bar.classList.toggle('off-form', hit);
    };
    window.addEventListener('scroll', checkForms, { passive: true });
    checkForms();
  })();

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
})();
