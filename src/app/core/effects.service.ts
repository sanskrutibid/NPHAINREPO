import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

export interface FxRefs {
  dot: HTMLElement;
  ring: HTMLElement;
  cur: HTMLElement;
  bar: HTMLElement;
  curtain: HTMLElement;
}

/**
 * Animations and effects (Schbang-style):
 * preloader, smooth scroll, custom cursor, scroll progress, reveal on scroll, page-transition curtain,
 * generic marquees  [data-mq], count-up numbers, scroll-fill text (.fill), hover image preview (.srow),
 * case-study slider (#cs), scrambling statement, rotating logo word,
 * pinned horizontal showcase (#hs), drag-to-scroll (.drag), card spotlight, parallax, ring hover,
 * work filter, enquiry form, magnetic buttons, image wipe-reveal, heading word-mask reveal, card tilt.
 * initGlobal() runs once; initPage() runs after every page change.
 */
@Injectable({ providedIn: 'root' })
export class EffectsService {
  private S = { t: 0, c: 0, m: 0 };
  private refs!: FxRefs;
  private ac?: AbortController;
  private io?: IntersectionObserver;
  private obs: IntersectionObserver[] = [];
  private ticks: Array<() => void> = [];
  private cleanups: Array<() => void> = [];
  private ready: Promise<void> = Promise.resolve();
  private mq: Animation[] = [];
  private rate = 1;

  constructor(private zone: NgZone, private router: Router) {}

  // "Reduce motion" is honoured on desktop only. Phones/tablets (touch) always play the site's animations,
  // because many iPhones have Reduce Motion switched on without the owner knowing, which froze the strips and sliders.
  private rm = () => matchMedia('(prefers-reduced-motion:reduce)').matches && !matchMedia('(pointer:coarse)').matches;

  /* ---------- once: preloader, smooth scroll, cursor, progress bar, nav hide, page-transition links ---------- */
  initGlobal(refs: FxRefs): void {
    this.refs = refs;
    const S = this.S;
    this.zone.runOutsideAngular(() => {
      this.runPreloader();
      // logo: a discipline word keeps changing next to the Phian wordmark
      const lr = document.querySelector<HTMLElement>('.logo-rot .lr');
      if (lr && !this.rm()) {
        const WORDS = ['Brand', 'Media', 'Content', 'Web', 'Search', 'PR', 'Strategy'];
        let wi = 0;
        window.setInterval(() => {
          if (document.hidden || getComputedStyle(lr).display === 'none') return;
          wi = (wi + 1) % WORDS.length;
          // never let two words stack: drop every stale word first, keep only the one currently showing
          const all = Array.from(lr.querySelectorAll<HTMLElement>('b'));
          const old = all.pop();
          all.forEach(b => { b.getAnimations().forEach(a => a.cancel()); b.remove(); });
          const nb = document.createElement('b');
          nb.textContent = WORDS[wi];
          lr.append(nb);
          const o = { duration: 520, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'both' as FillMode };
          nb.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], o);
          if (old) {
            const gone = () => old.remove();
            old.animate([{ transform: 'none' }, { transform: 'translateY(-110%)' }], o).finished.then(gone).catch(gone);
            window.setTimeout(gone, 700);
          }
        }, 2200);
      }
      const fine = matchMedia('(pointer:fine)').matches && !this.rm();
      let last = 0;
      const mx = { x: -100, y: -100, rx: -100, ry: -100 };
      const max = () => document.documentElement.scrollHeight - innerHeight;
      const label = refs.ring.querySelector('span');

      const wheel = (e: WheelEvent) => {
        if (e.ctrlKey || document.body.classList.contains('lock') || document.body.classList.contains('loading')) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // let horizontal gestures scroll carousels natively
        e.preventDefault();
        S.t = Math.max(0, Math.min(S.t + e.deltaY, max()));
      };

      const scroll = () => {
        const y = scrollY;
        if (Math.abs(y - S.m) > 3) { S.t = S.c = S.m = y; }
        refs.bar.style.transform = `scaleX(${max() > 0 ? y / max() : 0})`;
        document.body.classList.remove('nav-hide'); // the header (with its main tabs) always stays visible
        document.body.classList.toggle('scrolled', y > 40);
        last = y;
        document.querySelectorAll<HTMLElement>('.band img,.secimg img').forEach(im => {
          const r = im.parentElement!.getBoundingClientRect();
          const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          im.style.transform = `translateY(${(p * -24).toFixed(1)}px) scale(1.07)`;
        });
        this.ticks.forEach(f => f());
      };

      const tick = () => {
        if (fine) {
          S.c += (S.t - S.c) * 0.1;
          if (Math.abs(S.t - S.c) > 0.2) { scrollTo(0, S.c); S.m = scrollY; }
        }
        // marquees speed up while you scroll fast, then settle back
        const vel = Math.abs(S.t - S.c);
        this.rate += (Math.min(6, 1 + vel * 0.04) - this.rate) * 0.08;
        if (this.mq.length) this.mq.forEach(a => { a.playbackRate = this.rate; });
        mx.rx += (mx.x - mx.rx) * 0.28;
        mx.ry += (mx.y - mx.ry) * 0.28;
        refs.ring.style.transform = `translate3d(${mx.rx.toFixed(1)}px,${mx.ry.toFixed(1)}px,0)`;
        refs.dot.style.transform = `translate3d(${mx.x}px,${mx.y}px,0)`;
        requestAnimationFrame(tick);
      };

      const move = (e: MouseEvent) => {
        // first movement: start the ring exactly under the pointer (no flying in from the corner), then show it
        if (!document.body.classList.contains('cur-on')) { mx.rx = mx.x = e.clientX; mx.ry = mx.y = e.clientY; document.body.classList.add('cur-on'); }
        mx.x = e.clientX; mx.y = e.clientY;
        const sp = (e.target as HTMLElement).closest?.('.spot') as HTMLElement | null;
        if (sp) {
          const r = sp.getBoundingClientRect();
          sp.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          sp.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }
      };

      const over = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        const card = t.closest('.case,.post,.pillar,.srow,.sector,.ov,.hs-card,.sl-hit');
        const drag = t.closest('.drag');
        refs.cur.classList.toggle('big', !!t.closest('a,button,.node'));
        refs.cur.classList.toggle('view', !!card && !drag);
        refs.cur.classList.toggle('drag', !!drag && !card);
        if (label) label.textContent = drag && !card ? 'Drag' : 'View';
      };

      const click = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as HTMLElement).closest('a');
        if (!a || a.target || a.hasAttribute('download')) return;
        const h = a.getAttribute('href') || '';
        if (!h.startsWith('/') || h.startsWith('//') || (h.includes('#') && h.split('#')[0] === location.pathname)) return;
        if (h.split('#')[0] === location.pathname) return;
        e.preventDefault();
        refs.curtain.classList.add('in');
        document.body.classList.add('leaving');
        setTimeout(() => this.zone.run(() => this.router.navigateByUrl(h)), this.rm() ? 0 : 520);
      };

      if (fine) {
        addEventListener('wheel', wheel, { passive: false });
        S.t = S.c = S.m = scrollY;
        requestAnimationFrame(tick);
        addEventListener('mousemove', move, { passive: true });
        addEventListener('mouseover', over);
        // hide the ring when the mouse leaves the window, show again when it returns
        document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cur-on'));
        document.documentElement.addEventListener('mouseenter', e => { mx.rx = mx.x = e.clientX; mx.ry = mx.y = e.clientY; document.body.classList.add('cur-on'); });
        // inside forms the normal text cursor is used instead of the ring
        document.addEventListener('mouseover', e => {
          const t = e.target as HTMLElement;
          document.body.classList.toggle('cur-native', !!t.closest?.('input,textarea,select,.ap-card'));
        });
        document.body.classList.add('has-cur');
      }
      // text decode on hover: letters scramble, then settle (nav links, text links, social pills)
      const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      document.addEventListener('mouseover', e => {
        const el = (e.target as HTMLElement).closest?.('.tn-i>a,.textlink,.fsocial a,.ascii-links a') as HTMLElement | null;
        if (!el || el.dataset['sc'] || this.rm()) return;
        if (Array.from(el.childNodes).some(n => n.nodeType !== 3)) return;
        const orig = el.textContent || '';
        el.dataset['sc'] = '1';
        let f = 0;
        const id = window.setInterval(() => {
          f++;
          const keep = Math.floor((f / 12) * orig.length);
          el.textContent = orig.split('').map((c, i) => (i < keep || c === ' ') ? c : CH[Math.floor(Math.random() * CH.length)]).join('');
          if (f >= 12) { clearInterval(id); el.textContent = orig; delete el.dataset['sc']; }
        }, 32);
      });

      addEventListener('scroll', scroll, { passive: true });
      document.addEventListener('click', click);
      scroll();
    });
  }

  /* ---------- preloader (shown once per browser session) ---------- */
  private runPreloader(): void {
    const pre = document.getElementById('pre');
    if (!pre) return;
    let seen = false;
    try { seen = sessionStorage.getItem('phian-pre') === '1'; } catch { /* ignore */ }
    if (seen || this.rm()) { pre.style.display = 'none'; return; }
    document.body.classList.add('loading');
    const num = pre.querySelector<HTMLElement>('.pre-n');
    this.ready = new Promise<void>(res => {
      const t0 = performance.now(), D = 1300;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / D);
        const e = 1 - Math.pow(1 - p, 3);
        if (num) num.textContent = String(Math.round(e * 100));
        if (p < 1) { requestAnimationFrame(step); return; }
        pre.classList.add('done');
        document.body.classList.remove('loading');
        try { sessionStorage.setItem('phian-pre', '1'); } catch { /* ignore */ }
        setTimeout(() => { pre.style.display = 'none'; }, 1000);
        setTimeout(res, 350);
      };
      requestAnimationFrame(step);
    });
  }


  /* ---------- scrambled-letter banner: letters of the name flicker, resolve on scroll-in and glow near the mouse ---------- */
  private ascii(cv: HTMLCanvasElement, sg: { signal: AbortSignal }): void {
    const ctx = cv.getContext('2d');
    const off = document.createElement('canvas');
    const octx = off.getContext('2d');
    if (!ctx || !octx) return;
    // Devanagari letters (vowels + consonants) instead of Latin / symbol characters
    const CHARS = Array.from('अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह');
    const CH = CHARS;
    const DEVA = '"Noto Sans Devanagari","Kohinoor Devanagari","Devanagari Sangam MN","Nirmala UI",Mangal,sans-serif';
    let W = 0, H = 0, cw = 9, chh = 12, cols = 0, rows = 0, mask = new Uint8Array(0);
    let mx = -9999, my = -9999, raf = 0, vis = false, t0 = 0, last = 0;
    // phones/tablets (touch) always play the banner animation, even if the phone has "Reduce motion" on
    const touch = matchMedia('(pointer:coarse)').matches;
    const still = this.rm() && !touch;
    const hash = (a: number, b: number, c: number): number => {
      let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
      h = (h ^ (h >>> 13)) * 1274126177;
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };
    const build = () => {
      const r = cv.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cw = W < 640 ? Math.max(4.2, Math.min(5.6, W / 78)) : 9; chh = Math.round(cw * 1.35);
      cols = Math.max(10, Math.floor(W / cw)); rows = Math.max(6, Math.floor(H / chh));
      off.width = cols; off.height = rows;
      octx.clearRect(0, 0, cols, rows);
      octx.fillStyle = '#fff'; octx.textAlign = 'center'; octx.textBaseline = 'middle';
      const small = W < 640;
      const lines = small ? ['PHIAN', 'INFOTEC'] : ['PHIAN INFOTEC'];
      let fs = Math.floor(rows / lines.length * (small ? 0.86 : 1));
      const fit = () => { octx.font = '900 ' + fs + 'px "Arial Black","Segoe UI Black",Impact,sans-serif'; };
      fit();
      // phone: draw letter by letter with a clear gap so every letter stays separate (like on the laptop)
      const gap = () => (small ? Math.max(1.5, fs * 0.16) : 0);
      const lw = (l: string) => (small ? l.split('').reduce((a, c) => a + octx.measureText(c).width + gap(), -gap()) : octx.measureText(l).width);
      while (fs > 4 && Math.max(...lines.map(lw)) > cols * 0.94) { fs--; fit(); }
      lines.forEach((l, i) => {
        const cy = rows * (i + 0.5) / lines.length + fs * 0.05;
        if (!small) { octx.fillText(l, cols / 2, cy); return; }
        octx.textAlign = 'left';
        let x = (cols - lw(l)) / 2;
        for (const c of l) { octx.fillText(c, x, cy); x += octx.measureText(c).width + gap(); }
        octx.textAlign = 'center';
      });
      const d = octx.getImageData(0, 0, cols, rows).data;
      mask = new Uint8Array(cols * rows);
      for (let i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3] > 110 ? 1 : 0;
    };
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const reveal = still ? 1 : Math.min(1, t / 2.2);
      ctx.clearRect(0, 0, W, H);
      ctx.font = '800 ' + (cw + 3) + 'px ' + DEVA;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const step = Math.floor(t * 9);
      const R = touch ? 85 : 135;
      // no mouse on a phone: a glowing spot sweeps across the letters by itself (a finger on the banner takes over)
      let gx = mx, gy = my;
      if (touch && mx < -999) { gx = W * (0.5 + 0.46 * Math.sin(t * 0.8)); gy = H * (0.5 + 0.3 * Math.sin(t * 1.3 + 1)); }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const on = mask[y * cols + x] === 1;
          const px = x * cw + cw / 2, py = y * chh + chh / 2;
          const dx = px - gx, dy = py - gy;
          const near = dx * dx + dy * dy < R * R;
          if (on) {
            const solid = hash(x, y, 7) < reveal;
            const idx = near || !solid ? Math.floor(hash(x, y, step + (near ? 5 : 0)) * CH.length) : Math.floor(hash(x, y, 3) * CH.length);
            ctx.fillStyle = near ? '#FFC21A' : solid ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.35)';
            if (near) { ctx.shadowColor = 'rgba(255,194,26,.85)'; ctx.shadowBlur = 7; }
            ctx.fillText(CH[idx], px, py);
            if (near) { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; }
          } else if (hash(x, y, Math.floor(t * 2.5)) < 0.035) {
            ctx.fillStyle = near ? 'rgba(255,194,26,.6)' : 'rgba(255,255,255,.2)';
            ctx.fillText(CH[Math.floor(hash(x, y, step) * CH.length)], px, py);
          }
        }
      }
    };
    const loop = (now: number) => {
      raf = 0;
      if (!vis) return;
      if (now - last > 40) { last = now; draw(now); }
      raf = requestAnimationFrame(loop);
    };
    build();
    // make sure the Devanagari font is ready before the first paint
    try { (document as any).fonts?.load('700 12px "Noto Sans Devanagari"', 'अआक')?.then(() => { if (still) draw(2500); }); } catch { /* ignore */ }
    if (still) { t0 = 0; draw(2500); return; }
    const io = new IntersectionObserver(es => {
      vis = es.some(e => e.isIntersecting);
      if (vis) { if (!t0) t0 = performance.now(); if (!raf) raf = requestAnimationFrame(loop); }
    }, { threshold: 0.15 });
    io.observe(cv);
    this.obs.push(io);
    this.cleanups.push(() => { if (raf) cancelAnimationFrame(raf); vis = false; });
    addEventListener('mousemove', e => {
      if (touch) return;
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    }, sg);
    cv.addEventListener('mouseleave', () => { mx = -9999; my = -9999; }, sg);
    // touch: the letters near your finger scramble and glow gold
    let tt = 0;
    const tp = (e: TouchEvent) => {
      const r = cv.getBoundingClientRect(), t = e.touches[0];
      if (!t) return;
      clearTimeout(tt);
      mx = t.clientX - r.left; my = t.clientY - r.top;
    };
    cv.addEventListener('touchstart', tp, { passive: true, signal: sg.signal });
    cv.addEventListener('touchmove', tp, { passive: true, signal: sg.signal });
    cv.addEventListener('touchend', () => { clearTimeout(tt); tt = window.setTimeout(() => { mx = -9999; my = -9999; }, 700); }, { passive: true, signal: sg.signal });
    let rt = 0, lastW = W;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => { const w = cv.getBoundingClientRect().width; if (Math.abs(w - lastW) > 1) { lastW = w; build(); } }, 150);
    }, sg);
  }

  /* ---------- per page: runs after each navigation ---------- */
  initPage(): void {
    this.zone.runOutsideAngular(() => {
      const S = this.S;
      this.ac?.abort();
      this.io?.disconnect();
      this.obs.forEach(o => o.disconnect());
      this.obs = [];
      this.ticks = [];
      this.cleanups.forEach(f => f());
      this.cleanups = [];

      scrollTo(0, 0);
      S.t = S.c = S.m = 0;
      document.body.classList.remove('leaving');
      const cl = this.refs?.curtain;
      if (cl) {
        cl.classList.remove('in');
        cl.classList.add('out');
        setTimeout(() => cl.classList.remove('out'), 700);
      }

      const page = document.getElementById('page');
      if (!page) return;
      const ac = new AbortController();
      this.ac = ac;
      const sg = { signal: ac.signal };
      const fine = matchMedia('(pointer:fine)').matches && !this.rm();

      // hero headline: word-by-word reveal (waits for the preloader)
      page.querySelectorAll<HTMLElement>('.hero h1,.phero h1').forEach(h => {
        if (h.dataset['s']) return;
        h.dataset['s'] = '1';
        let i = 0;
        const wrap = (n: Node) => {
          Array.from(n.childNodes).forEach(c => {
            if (c.nodeType === 3) {
              const f = document.createDocumentFragment();
              (c.textContent || '').split(/(\s+)/).forEach(wd => {
                if (!wd.trim()) { f.append(wd); return; }
                const o = document.createElement('span');
                o.className = 'w';
                const s = document.createElement('span');
                s.textContent = wd;
                s.style.transitionDelay = (i++ * 60) + 'ms';
                o.append(s);
                f.append(o);
              });
              (c as ChildNode).replaceWith(f);
            } else wrap(c);
          });
        };
        wrap(h);
        this.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('go'))));
      });

      // generic marquees: <div data-mq="left|right" data-speed="30s">items...</div>
      document.querySelectorAll<HTMLElement>('[data-mq]').forEach(el => {
        if (el.dataset['ok']) return;
        el.dataset['ok'] = '1';
        const inner = el.innerHTML;
        const t = document.createElement('div');
        t.className = 'mq-in' + (el.dataset['mq'] === 'right' ? ' rev' : '');
        if (el.dataset['speed']) t.style.setProperty('--sp', el.dataset['speed']!);
        t.innerHTML = Array.from({ length: 4 }, (_, i) =>
          `<div class="mq-set"${i ? ' aria-hidden="true"' : ''}>${inner}</div>`).join('');
        t.querySelectorAll<HTMLElement>('.mq-set[aria-hidden] a').forEach(a => a.tabIndex = -1);
        el.innerHTML = '';
        el.append(t);
      });

      // reveal on scroll
      const sel = 'section h2,.lead,.case:not(.hs-card),.post,.piece,.story,.results>div,.step,.card,.fgrid>div,.band,.head,.bigquote,.sector,.faq details,.team>*,.srow,.ov,.stage,.why>div,.proof>div,.logo-tile,.vm-card,.cg-h,.chip,.fcta a.big,.voice,.fitlist li,.incl>div,.approach>div,.beliefs>div,.probs>div,.office,.life .stage';
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      this.io = io;
      document.querySelectorAll(sel).forEach((el, i) => {
          if (el.closest('.mq-in,.sl')) return;
          el.classList.add('rv');
          (el as HTMLElement).style.setProperty('--d', (i % 4 * 70) + 'ms');
          io.observe(el);
        });
      // safety net (iPhone / slow devices): anything already on screen but still hidden is revealed
      const sweepRv = () => document.querySelectorAll<HTMLElement>('.rv:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight * 0.94 && r.bottom > 0) { el.classList.add('in'); io.unobserve(el); }
      });
      this.ticks.push(sweepRv);
      window.setTimeout(sweepRv, 900);
      window.setTimeout(sweepRv, 2600);

      // count-up numbers (robust on iPhone: IntersectionObserver + scroll sweep, always ends on the real number)
      const pendingCounters: Array<() => void> = [];
      page.querySelectorAll<HTMLElement>('.proof strong,.results strong,[data-count]').forEach(el => {
        const txt = (el.dataset['final'] || el.textContent || '').trim();
        const m = txt.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
        if (!m) return;
        el.dataset['final'] = txt;
        const pre = m[1], end = parseFloat(m[2]), suf = m[3];
        const dec = (m[2].split('.')[1] || '').length;
        if (this.rm()) { el.textContent = txt; return; }
        el.textContent = pre + (0).toFixed(dec) + suf;
        let done = false;
        const start = () => {
          if (done) return;
          done = true;
          const t0 = performance.now(), D = 1600;
          const fin = () => { el.textContent = txt; };
          const tm = window.setInterval(() => {
            const p = Math.min(1, (performance.now() - t0) / D);
            const e = 1 - Math.pow(1 - p, 4);
            el.textContent = pre + (end * e).toFixed(dec) + suf;
            if (p >= 1) { window.clearInterval(tm); fin(); }
          }, 32);
          window.setTimeout(() => { window.clearInterval(tm); fin(); }, D + 600); // safety: never stay on 0
        };
        pendingCounters.push(() => {
          if (done) return;
          const r = el.getBoundingClientRect();
          if (r.top < innerHeight * 0.98 && r.bottom > 0) start();
        });
        if ('IntersectionObserver' in window) {
          const cio = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { cio.disconnect(); start(); } }, { threshold: 0.01 });
          cio.observe(el);
          this.obs.push(cio);
        }
      });

      // scroll-fill text: words light up as you scroll
      page.querySelectorAll<HTMLElement>('.fill').forEach(el => {
        const text = (el.textContent || '').trim();
        el.setAttribute('aria-label', text);
        el.textContent = '';
        const spans = text.split(/\s+/).map(w => {
          const s = document.createElement('span');
          s.className = 'fw';
          s.setAttribute('aria-hidden', 'true');
          s.textContent = w + ' ';
          el.append(s);
          return s;
        });
        const upd = () => {
          const r = el.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (innerHeight * 0.9 - r.top) / (r.height + innerHeight * 0.45)));
          const n = this.rm() ? spans.length : Math.round(p * spans.length);
          spans.forEach((s, i) => s.classList.toggle('on', i < n));
        };
        this.ticks.push(upd);
        upd();
      });

      // service rows: floating image preview that follows the cursor
      const rows = page.querySelectorAll<HTMLElement>('.srow[data-img]');
      if (rows.length && fine) {
        const prev = document.createElement('div');
        prev.className = 'prev';
        const pi = document.createElement('img');
        pi.alt = '';
        prev.append(pi);
        document.body.append(prev);
        this.cleanups.push(() => prev.remove());
        let px = 0, py = 0, cx = 0, cy = 0, raf = 0, on = false;
        const loop = () => {
          if (!on) { raf = 0; return; }
          cx += (px - cx) * 0.14;
          cy += (py - cy) * 0.14;
          prev.style.transform = `translate(${cx}px,${cy}px) rotate(${((px - cx) * 0.05).toFixed(2)}deg)`;
          raf = requestAnimationFrame(loop);
        };
        rows.forEach(r => {
          r.addEventListener('mouseenter', e => {
            px = cx = e.clientX; py = cy = e.clientY;
            pi.src = r.dataset['img'] || '';
            prev.classList.add('on');
            on = true;
            if (!raf) raf = requestAnimationFrame(loop);
          }, sg);
          r.addEventListener('mousemove', e => { px = e.clientX; py = e.clientY; }, sg);
          r.addEventListener('mouseleave', () => { on = false; prev.classList.remove('on'); }, sg);
        });
      }

      // service rows: highlight each row in turn by itself (colour + image sweep); hovering a row takes over
      page.querySelectorAll<HTMLElement>('.sol .srows').forEach(box => {
        const list = Array.from(box.querySelectorAll<HTMLElement>('.srow'));
        if (list.length < 2 || this.rm()) return;
        let i = -1, vis = false, hov = false;
        const set = (n: number) => list.forEach((r, k) => r.classList.toggle('auto', k === n));
        const step = () => {
          if (!vis || hov || document.hidden) return;
          i = (i + 1) % list.length;
          set(i);
        };
        const aio = new IntersectionObserver(es => { vis = es.some(e => e.isIntersecting); if (vis && i < 0) step(); }, { threshold: 0.08 });
        aio.observe(box);
        this.obs.push(aio);
        // hover takes over only with a real mouse; on touch screens a tap must not freeze the automatic cycle
        if (matchMedia('(hover:hover)').matches) {
          box.addEventListener('mouseenter', () => { hov = true; set(-1); }, sg);
          box.addEventListener('mouseleave', () => { hov = false; i = -1; step(); }, sg);
        }
        const id = window.setInterval(step, 2600);
        this.cleanups.push(() => clearInterval(id));
      });

      // pinned horizontal showcase (desktop): vertical scroll moves the card track sideways
      const hs = page.querySelector<HTMLElement>('#hs');
      if (hs) {
        const track = hs.querySelector<HTMLElement>('.hs-track');
        const barI = hs.querySelector<HTMLElement>('.hs-prog i');
        const mq = matchMedia('(max-width:900px)');
        let dist = 0;
        const off = () => mq.matches || this.rm();
        const measure = () => {
          if (!track) return;
          if (off()) { hs.style.height = ''; track.style.transform = ''; return; }
          dist = Math.max(0, track.offsetWidth - innerWidth);
          hs.style.height = (innerHeight + dist) + 'px';
        };
        const upd = () => {
          if (!track || off()) return;
          const r = hs.getBoundingClientRect();
          const span = hs.offsetHeight - innerHeight;
          const p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
          track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
          if (barI) barI.style.transform = `scaleX(${p.toFixed(3)})`;
        };
        measure(); upd();
        setTimeout(() => { measure(); upd(); }, 400);
        this.ticks.push(upd);
        addEventListener('resize', () => { measure(); upd(); }, sg);
      }


      // ---------- HOME: staggered sector cards + clients grid reveal, with scroll-linked drift ----------
      const revealOnce = (el: Element, th = 0.18) => {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.disconnect(); } }), { threshold: th });
        io.observe(el);
        this.obs.push(io);
      };
      page.querySelectorAll<HTMLElement>('[data-stag]').forEach(box => {
        const cards = Array.from(box.children) as HTMLElement[];
        cards.forEach((c, i) => c.style.setProperty('--i', String(i)));
        revealOnce(box, 0.12);
        const upd = () => {
          if (this.rm()) return;
          const r = box.getBoundingClientRect();
          const p = Math.max(-1.2, Math.min(1.2, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
          cards.forEach((c, i) => c.style.setProperty('--py', ((i % 2 ? 1 : -1) * p * 46).toFixed(1)));
        };
        upd();
        this.ticks.push(upd);
      });
      page.querySelectorAll<HTMLElement>('[data-clients]').forEach(g => {
        revealOnce(g, 0.1);
        const cells = Array.from(g.querySelectorAll<HTMLElement>('.cl'));
        const upd = () => {
          if (this.rm() || innerWidth < 700) return;
          const cols = Math.max(1, getComputedStyle(g).gridTemplateColumns.split(' ').length);
          const r = g.getBoundingClientRect();
          const p = Math.max(-1.2, Math.min(1.2, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
          cells.forEach(c => c.style.setProperty('--cx', '0')); // logos stay perfectly aligned, no up/down drift
        };
        upd();
        this.ticks.push(upd);
      });

      // ---------- HOME HERO SLIDER (Schbang-style) ----------
      // Slides are stacked. The next slide wipes in from the side in 4 staggered bands (stepped edge),
      // its content slides in with parallax while the old slide drifts away and dims. Headline words rise from a mask.
      // Autoplay never stops (only waits while the tab is hidden or the slider is scrolled off-screen). Arrows, swipe / drag, arrow keys.
      page.querySelectorAll<HTMLElement>('.sl').forEach(sl => {
        const slides = Array.from(sl.querySelectorAll<HTMLElement>('.sl-s'));
        const n = slides.length;
        if (n < 2) { /* single slide: no controls or autoplay */ }
        const cnt = sl.querySelector<HTMLElement>('.sl-cnt b');
        const bar = sl.querySelector<HTMLElement>('.sl-bar i');
        const AUTO = 6500, DUR = 1150, BANDS = 4;
        const cl = (v: number) => Math.max(0, Math.min(1, v));
        const ez = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        let cur = 0, busy = false, el = 0, vis = true, raf = 0;

        // headline words -> masked spans (so they can rise one by one)
        slides.forEach(sd => sd.querySelectorAll<HTMLElement>('h1,h2').forEach(h => {
          h.dataset['s'] = '1';
          let i = 0;
          const wrapWords = (nd: Node) => {
            Array.from(nd.childNodes).forEach(c => {
              if (c.nodeType === 3) {
                const f = document.createDocumentFragment();
                (c.textContent || '').split(/(\s+)/).forEach(wd => {
                  if (!wd.trim()) { f.append(wd); return; }
                  const o = document.createElement('span');
                  o.className = 'w';
                  const sp = document.createElement('span');
                  sp.textContent = wd;
                  sp.style.transitionDelay = (380 + i++ * 55) + 'ms';
                  o.append(sp);
                  f.append(o);
                });
                (c as ChildNode).replaceWith(f);
              } else wrapWords(c);
            });
          };
          wrapWords(h);
        }));

        const setBar = (v: number) => { if (bar) bar.style.transform = `scaleX(${cl(v).toFixed(3)})`; };
        const poly = (x: number[], dir: number) => {
          // x[k] = how far (in %) the leading edge of band k still has to travel; bands run top -> bottom
          const q = (k: number) => (dir > 0 ? x[k] : 100 - x[k]).toFixed(2);
          const h = 100 / BANDS;
          if (dir > 0) {
            const pts = [`${q(0)}% 0%`, '100% 0%', '100% 100%'];
            for (let k = BANDS - 1; k >= 0; k--) pts.push(`${q(k)}% ${(k + 1) * h}%`, `${q(k)}% ${k * h}%`);
            return `polygon(${pts.join(',')})`;
          }
          const pts = ['0% 0%'];
          for (let k = 0; k < BANDS; k++) pts.push(`${q(k)}% ${k * h}%`, `${q(k)}% ${(k + 1) * h}%`);
          pts.push('0% 100%');
          return `polygon(${pts.join(',')})`;
        };

        const show = (to: number, dir: number) => {
          if (busy || to === cur) return;
          const a = slides[cur], b = slides[to];
          const ai = a.querySelector<HTMLElement>('.sl-in')!, bi = b.querySelector<HTMLElement>('.sl-in')!;
          busy = true; el = 0; setBar(0);
          sl.dataset['th'] = b.dataset['th'] || '';
          if (cnt) cnt.textContent = String(to + 1).padStart(2, '0');
          const fin = () => {
            a.classList.remove('on', 'run');
            a.style.cssText = ''; ai.style.cssText = '';
            b.style.cssText = ''; bi.style.cssText = '';
            b.classList.add('on', 'run');
            cur = to; busy = false; el = 0;
          };
          b.style.clipPath = poly([100, 100, 100, 100], dir);
          b.style.zIndex = '3'; a.style.zIndex = '2';
          b.classList.add('run', 'on');
          const t0 = performance.now();
          const step = (now: number) => {
            const p = cl((now - t0) / DUR);
            const xs = Array.from({ length: BANDS }, (_, k) => (1 - ez(cl((p - k * .07) / (1 - (BANDS - 1) * .07)))) * 100);
            b.style.clipPath = poly(xs, dir);
            const e = ez(p);
            bi.style.transform = `translate3d(${(dir * (1 - e) * 24).toFixed(2)}%,0,0)`;
            ai.style.transform = `translate3d(${(-dir * e * 16).toFixed(2)}%,0,0)`;
            a.style.setProperty('--dim', (e * .6).toFixed(3));
            if (p < 1) raf = requestAnimationFrame(step); else fin();
          };
          raf = requestAnimationFrame(step);
        };
        const go = (d: number) => show((cur + d + n) % n, d);

        slides[0].classList.add('run');
        let armed = false;

        sl.querySelector('.sl-next')?.addEventListener('click', () => go(1), sg);
        sl.querySelector('.sl-prev')?.addEventListener('click', () => go(-1), sg);
        sl.addEventListener('keydown', e => {
          if (e.key === 'ArrowRight') go(1);
          else if (e.key === 'ArrowLeft') go(-1);
        }, sg);

        // swipe / drag
        let sx = 0, sy = 0, down = false, moved = false;
        sl.addEventListener('pointerdown', e => {
          if ((e.target as HTMLElement).closest('.sl-ctl')) return;
          down = true; moved = false; sx = e.clientX; sy = e.clientY;
        }, sg);
        addEventListener('pointerup', e => {
          if (!down) return;
          down = false;
          const dx = e.clientX - sx, dy = e.clientY - sy;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) { moved = true; go(dx < 0 ? 1 : -1); }
        }, sg);
        sl.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, { capture: true, signal: ac.signal });

        // autoplay
        if (matchMedia('(pointer:fine)').matches) {
          sl.addEventListener('mousemove', e => {
            const r = sl.getBoundingClientRect();
            sl.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
            sl.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
          }, sg);
        }
        const vio = new IntersectionObserver(es => es.forEach(e => {
          vis = e.isIntersecting;
          if (vis && !armed) { armed = true; slides[0].classList.add('on'); } // case studies animate in when scrolled to
        }), { threshold: 0.35 });
        vio.observe(sl);
        this.obs.push(vio);
        const iv = window.setInterval(() => {
          if (n < 2 || busy || !vis || document.hidden) return;
          el += 100; setBar(el / AUTO);
          if (el >= AUTO) go(1);
        }, 100);
        this.cleanups.push(() => { clearInterval(iv); cancelAnimationFrame(raf); });
      });

      // "What defines us": the line scrambles and settles when it scrolls in and whenever you hover it; arrow draws itself
      page.querySelectorAll<HTMLElement>('[data-scramble]').forEach(t => {
        const orig = (t.textContent || '').trim();
        const CH2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let id = 0;
        const run = () => {
          if (this.rm()) return;
          clearInterval(id);
          let f = 0;
          id = window.setInterval(() => {
            f++;
            const keep = Math.floor((f / 24) * orig.length);
            t.textContent = orig.split('').map((c, i) => (i < keep || c === ' ') ? c : CH2[Math.floor(Math.random() * CH2.length)]).join('');
            if (f >= 24) { clearInterval(id); t.textContent = orig; }
          }, 30);
        };
        t.addEventListener('mouseenter', run, sg);
        const so = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { so.disconnect(); run(); } }, { threshold: 0.6 });
        so.observe(t);
        this.obs.push(so);
        this.cleanups.push(() => { clearInterval(id); t.textContent = orig; });
      });
      page.querySelectorAll<HTMLElement>('.def-l').forEach(t => {
        const ao = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { t.classList.add('in'); ao.disconnect(); } }, { threshold: 0.4 });
        ao.observe(t);
        this.obs.push(ao);
      });

      // phone auto-sliders: any [data-autoslide="ms"] list becomes a one-card-at-a-time slider that moves by itself
      // (swipe works too; auto-play pauses while touching and when the list is off screen). Dots are added underneath.
      page.querySelectorAll<HTMLElement>('[data-autoslide]').forEach(box => {
        const ms = Math.max(2000, Number(box.dataset['autoslide']) || 3800);
        const mqs = matchMedia('(max-width:900px)');
        const cards = () => Array.from(box.children).filter(c => !(c as HTMLElement).classList.contains('as-dots')) as HTMLElement[];
        const dots = document.createElement('div');
        dots.className = 'as-dots';
        dots.setAttribute('aria-hidden', 'true');
        box.after(dots);
        this.cleanups.push(() => dots.remove());
        const build = () => {
          dots.replaceChildren();
          cards().forEach((_, i) => {
            const d = document.createElement('i');
            d.addEventListener('click', () => go(i), sg);
            dots.append(d);
          });
          mark();
        };
        const step = () => {
          const c = cards();
          if (c.length < 2) return box.clientWidth;
          return c[1].offsetLeft - c[0].offsetLeft;
        };
        const idx = () => Math.max(0, Math.min(cards().length - 1, Math.round(box.scrollLeft / (step() || 1))));
        const mark = () => { const n = idx(); Array.from(dots.children).forEach((d, i) => d.classList.toggle('on', i === n)); };
        const go = (n: number) => { box.scrollTo({ left: n * step(), behavior: this.rm() ? 'auto' : 'smooth' }); };
        let vis = false, touching = false, hold = 0;
        const io = new IntersectionObserver(es => { vis = es.some(e => e.isIntersecting); }, { threshold: 0.35 });
        io.observe(box);
        this.obs.push(io);
        box.addEventListener('scroll', mark, { passive: true, signal: ac.signal });
        box.addEventListener('touchstart', () => { touching = true; }, { passive: true, signal: ac.signal });
        box.addEventListener('touchend', () => { touching = false; hold = Date.now() + 4500; }, { passive: true, signal: ac.signal });
        box.addEventListener('touchcancel', () => { touching = false; hold = Date.now() + 4500; }, { passive: true, signal: ac.signal });
        const id = window.setInterval(() => {
          if (!mqs.matches || !vis || touching || document.hidden || Date.now() < hold) return;
          const n = cards().length;
          if (n < 2) return;
          go((idx() + 1) % n);
        }, ms);
        this.cleanups.push(() => clearInterval(id));
        const refresh = () => { dots.style.display = mqs.matches ? '' : 'none'; if (!mqs.matches) box.scrollLeft = 0; };
        mqs.addEventListener('change', refresh, sg);
        build();
        refresh();
        addEventListener('resize', mark, sg);
      });

      // drag-to-scroll carousels
      page.querySelectorAll<HTMLElement>('.drag').forEach(el => {
        let down = false, moved = false, sx = 0, sl = 0;
        el.addEventListener('pointerdown', e => {
          if (e.pointerType !== 'mouse') return;
          down = true; moved = false; sx = e.clientX; sl = el.scrollLeft;
          el.classList.add('grab');
        }, sg);
        addEventListener('pointermove', e => {
          if (!down) return;
          const dx = e.clientX - sx;
          if (Math.abs(dx) > 4) moved = true;
          el.scrollLeft = sl - dx;
        }, sg);
        addEventListener('pointerup', () => { down = false; el.classList.remove('grab'); }, sg);
        el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, { capture: true, signal: ac.signal });
      });

      // card spotlight
      page.querySelectorAll<HTMLElement>('.ov,.stage,.piece,.voice,.approach>div,.office').forEach(e => e.classList.add('spot'));

      // method ring
      const nodes = page.querySelectorAll<HTMLElement>('.node');
      const rt = document.getElementById('rt'), rd = document.getElementById('rd'), rg = document.getElementById('ring');
      if (rt && rd && rg) {
        const a = rt.textContent || '', b = rd.textContent || '';
        nodes.forEach(x => {
          const on = () => {
            nodes.forEach(y => y.classList.remove('on'));
            x.classList.add('on');
            rt.textContent = x.dataset['t'] || '';
            rd.textContent = x.dataset['d'] || '';
          };
          x.addEventListener('mouseenter', on, sg);
          x.addEventListener('focus', on, sg);
        });
        rg.addEventListener('mouseleave', () => {
          nodes.forEach(y => y.classList.remove('on'));
          rt.textContent = a;
          rd.textContent = b;
        }, sg);
      }

      // work page filter
      const bs = page.querySelectorAll<HTMLButtonElement>('.filters button');
      bs.forEach(b => b.addEventListener('click', () => {
        bs.forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        const f = b.dataset['f'];
        page.querySelectorAll<HTMLElement>('#grid .case').forEach(c => {
          c.style.display = (f === 'all' || c.dataset['sector'] === f) ? '' : 'none';
          c.classList.remove('rv');
        });
      }, sg));

      // contact enquiry form -> WhatsApp / email
      const f = document.getElementById('enq') as HTMLFormElement | null;
      const m = document.getElementById('fmsg');
      if (f && m) {
        let via = 'wa';
        f.querySelectorAll<HTMLButtonElement>('button[type=submit]').forEach(b =>
          b.addEventListener('click', () => { via = b.dataset['via'] || 'wa'; }, sg));
        f.addEventListener('submit', e => {
          e.preventDefault();
          const d = new FormData(f);
          if (!d.get('name') || !d.get('biz') || !d.get('phone')) {
            m.textContent = 'Please add your name, business name and phone number so we can reply.';
            return;
          }
          const needs = d.getAll('need').join(', ') || 'Not specified';
          const t = `Hi Phian, I'm ${d.get('name')} from ${d.get('biz')}.\nPhone: ${d.get('phone')}\nEmail: ${d.get('email') || '-'}\nIndustry: ${d.get('sector') || '-'}, City: ${d.get('city') || '-'}\nNeed help with: ${needs}\n${d.get('msg') || ''}`;
          m.textContent = 'Opening ' + (via === 'wa' ? 'WhatsApp' : 'your email app') + ' with your details filled in.';
          window.open(
            via === 'wa'
              ? 'https://wa.me/917972100822?text=' + encodeURIComponent(t)
              : 'mailto:devghosh@phianinfotec.com?subject=' + encodeURIComponent('Brand review request: ' + d.get('biz')) + '&body=' + encodeURIComponent(t),
            '_blank');
        }, sg);
      }

      // image reveal: photos wipe in from the bottom as they enter the screen
      if (!this.rm()) {
        document.querySelectorAll<HTMLElement>('.cimg,.pimg,.ov-img-wrap,.portrait,.secimg,.inline-fig,.dgal figure').forEach(el => {
          if (el.closest('.mq-in,.sl')) return;
          el.classList.add('imgrv');
          io.observe(el);
        });
      }

      // section headings: words slide up from a mask when the heading scrolls into view
      if (!this.rm()) {
        const hio = new IntersectionObserver(es => es.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('go'); hio.unobserve(e.target); }
        }), { threshold: 0.01 });
        this.obs.push(hio);
        page.querySelectorAll<HTMLElement>('section:not(.hero):not(.phero):not(.sl) h2').forEach(h => {
          if (h.dataset['s'] || h.closest('.statement')) return;
          h.dataset['s'] = '1';
          h.classList.add('hw');
          let i = 0;
          const wrapWords = (n: Node) => {
            Array.from(n.childNodes).forEach(c => {
              if (c.nodeType === 3) {
                const f = document.createDocumentFragment();
                (c.textContent || '').split(/(\s+)/).forEach(wd => {
                  if (!wd.trim()) { f.append(wd); return; }
                  const o = document.createElement('span');
                  o.className = 'w';
                  const sp = document.createElement('span');
                  sp.textContent = wd;
                  sp.style.transitionDelay = (i++ * 45) + 'ms';
                  o.append(sp);
                  f.append(o);
                });
                (c as ChildNode).replaceWith(f);
              } else wrapWords(c);
            });
          };
          wrapWords(h);
          hio.observe(h);
        });
      }

      // iPhone safety net: anything that is on screen is always revealed (headings, text blocks, images, counters),
      // even if the browser's IntersectionObserver is late or skips it.
      {
        const sweep = () => {
          const vis = (el: Element) => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 0.96 && r.bottom > 0; };
          page.querySelectorAll<HTMLElement>('.hw:not(.go)').forEach(el => { if (vis(el)) el.classList.add('go'); });
          page.querySelectorAll<HTMLElement>('.rv:not(.in),.imgrv:not(.in)').forEach(el => { if (!el.closest('.mq-in,.sl') && vis(el)) el.classList.add('in'); });
          page.querySelectorAll<HTMLElement>('[data-clients]:not(.in)').forEach(el => { if (vis(el)) el.classList.add('in'); });
          pendingCounters.forEach(f => f());
        };
        const opt = { passive: true, signal: ac.signal } as AddEventListenerOptions;
        addEventListener('scroll', sweep, opt);
        addEventListener('touchmove', sweep, opt);
        addEventListener('resize', sweep, opt);
        [300, 900, 1800, 3500].forEach(t => window.setTimeout(sweep, t));
        const iv = window.setInterval(sweep, 1200);
        this.cleanups.push(() => window.clearInterval(iv));
      }

      // hero: slow mouse parallax (CSS reads --px / --py)
      const heroEl = page.querySelector<HTMLElement>('.hero');
      if (heroEl && fine) {
        heroEl.addEventListener('mousemove', e => {
          const r = heroEl.getBoundingClientRect();
          heroEl.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          heroEl.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        }, sg);
        heroEl.addEventListener('mouseleave', () => {
          heroEl.style.setProperty('--px', '0');
          heroEl.style.setProperty('--py', '0');
        }, sg);
      }

      // scrambled-letter "PHIAN INFOTEC" banner
      const asc = page.querySelector<HTMLCanvasElement>('canvas.ascii');
      if (asc) this.ascii(asc, sg);

      // columns drift up and down in opposite directions while you scroll (desktop)
      const cols = Array.from(page.querySelectorAll<HTMLElement>('.sectors>.sector'));
      if (cols.length && !this.rm()) {
        const items = cols.map(el => ({ el, f: (Array.from(el.parentElement!.children).indexOf(el) % 2 ? -1 : 1) * 0.07 }));
        const drift = () => {
          if (innerWidth < 900) { items.forEach(i => { i.el.style.translate = ''; }); return; }
          items.forEach(i => {
            const r = i.el.getBoundingClientRect();
            if (r.bottom < -200 || r.top > innerHeight + 200) return;
            const c = r.top + r.height / 2 - innerHeight / 2;
            i.el.style.translate = '0 ' + Math.max(-10, Math.min(10, c * i.f)).toFixed(1) + 'px';
          });
        };
        this.ticks.push(drift);
        drift();
      }

      // images that never got revealed (e.g. fast scrolling) are shown after a moment
      setTimeout(() => document.querySelectorAll('.imgrv:not(.in)').forEach(e => e.classList.add('in')), 4000);

      // button text roll on hover
      document.querySelectorAll<HTMLElement>('#page .btn,.fcta .btn').forEach(b => {
        if (b.dataset['br']) return;
        b.dataset['br'] = '1';
        Array.from(b.childNodes).forEach(n => {
          if (n.nodeType !== 3) return;
          const t = (n.textContent || '').trim();
          if (!t) return;
          const w = document.createElement('span');
          w.className = 'br';
          const a = document.createElement('span');
          a.textContent = t;
          const c = document.createElement('span');
          c.textContent = t;
          c.setAttribute('aria-hidden', 'true');
          w.append(a, c);
          (n as ChildNode).replaceWith(w);
        });
      });

      // hero content fades and slides away as you scroll down
      const heroWrap = page.querySelector<HTMLElement>('.hero>.wrap,.phero>.wrap');
      if (heroWrap && !this.rm()) {
        const fade = () => {
          const p = Math.max(0, Math.min(1, scrollY / (heroWrap.offsetHeight * 0.9 + 80)));
          heroWrap.style.opacity = String(1 - p * 0.85);
          heroWrap.style.translate = '0 ' + (p * 70).toFixed(1) + 'px';
        };
        this.ticks.push(fade);
        fade();
      }

      // section headings glide sideways a little while you scroll (desktop)
      if (!this.rm()) {
        const hs2 = Array.from(page.querySelectorAll<HTMLElement>('section:not(.hs):not(.statement):not(.sl):not(.def) h2'));
        if (hs2.length) {
          const glide = () => {
            if (innerWidth < 900) { hs2.forEach(h => { if (h.style.translate) h.style.translate = ''; }); return; }
            hs2.forEach(h => {
              const r = h.getBoundingClientRect();
              if (r.bottom < -100 || r.top > innerHeight + 100) return;
              const c = r.top + r.height / 2 - innerHeight / 2;
              h.style.translate = Math.max(-36, Math.min(36, c * -0.06)).toFixed(1) + 'px 0';
            });
          };
          this.ticks.push(glide);
          glide();
        }
      }

      // marquees: collect their animations so scroll speed can drive them
      this.mq = [];
      if (!this.rm()) setTimeout(() => {
        this.mq = document.getAnimations().filter(a => (a as CSSAnimation).animationName === 'mqx');
      }, 700);

      // home photo band grows from a rounded card to full width while you scroll
      const grow = page.querySelector<HTMLElement>('.band.grow');
      if (grow && !this.rm()) {
        const g = () => {
          const r = grow.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.75)));
          grow.style.setProperty('--sc', (0.8 + 0.2 * p).toFixed(3));
        };
        this.ticks.push(g);
        g();
      }

      // method steps: circles pop in one after another and the connecting line draws across
      page.querySelectorAll<HTMLElement>('.steps').forEach(ol => {
        if (this.rm()) return;
        ol.classList.add('sx');
        const items = Array.from(ol.children) as HTMLElement[];
        const sio = new IntersectionObserver(es => {
          if (!es.some(e => e.isIntersecting)) return;
          items.forEach((li, i) => setTimeout(() => li.classList.add('on'), i * 180));
          sio.disconnect();
        }, { threshold: 0.25 });
        sio.observe(ol);
        this.obs.push(sio);
      });

      // 3D tilt on image cards (desktop)
      if (fine) {
        page.querySelectorAll<HTMLElement>('.piece,.why>div,.stage,.approach>div,.beliefs>div,.probs>div,.office').forEach(card => {
          card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transition = 'transform .12s ease-out';
            card.style.transform = `perspective(900px) rotateY(${(px * 6).toFixed(2)}deg) rotateX(${(-py * 6).toFixed(2)}deg) translateY(-4px)`;
          }, sg);
          card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
            card.style.transform = '';
          }, sg);
        });
      }

      // magnetic buttons
      if (fine) {
        document.querySelectorAll<HTMLElement>('#page .btn,.fcta .btn,.nav .btn,.nav .menu-btn').forEach(b => {
          b.addEventListener('mousemove', e => {
            const r = b.getBoundingClientRect();
            b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
          }, sg);
          b.addEventListener('mouseleave', () => { b.style.transform = ''; }, sg);
        });
      }

      // ---------- INNER PAGES: staggered lists + sections that open like cards as they scroll in ----------
      page.querySelectorAll<HTMLElement>('.fitlist li,.incl>div,.approach>div,.beliefs>div,.probs>div,.life .stage,.chips .chip,.faq details').forEach(el => {
        const idx = Array.from(el.parentElement!.children).indexOf(el);
        el.style.setProperty('--d', ((idx % 6) * 90) + 'ms');
      });
      if (location.pathname !== '/' && !this.rm()) {
        const open = Array.from(page.querySelectorAll<HTMLElement>('main>section.ink:not(.phero),main>section.white,main>.band:not(.grow)'));
        const upd = () => {
          open.forEach(el => {
            const r = el.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.55)));
            if (p >= 1) { el.style.removeProperty('--sc'); el.style.removeProperty('--r'); return; }
            el.style.setProperty('--sc', (0.94 + 0.06 * p).toFixed(3));
            el.style.setProperty('--r', ((1 - p) * 44).toFixed(1) + 'px');
          });
        };
        this.ticks.push(upd);
        upd();
      }

      this.ticks.forEach(fn => fn());
    });
  }
}
