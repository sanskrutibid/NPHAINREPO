import { Component, Input } from '@angular/core';
import { Client } from '../../core/clients.data';

const PALETTE = ['#e63946', '#f77f00', '#1d6fd8', '#2a9d8f', '#7b2cbf', '#d62828', '#0f9d58', '#e85d9a', '#f4a100', '#0096c7'];
function hsl(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [0, s, l];
}
const vivid = (hex?: string) => { if (!hex) return false; const [, s, l] = hsl(hex); return s >= 0.35 && l >= 0.22 && l <= 0.7; };
/**
 * Draws one client logo with plain HTML + SVG (no image file), so it is always sharp.
 * Used on Home (Our clients) and on Projects & Clients.   <app-brand-logo [c]="client" />
 * Fonts used here are loaded in src/index.html (Google Fonts).
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
@if (c.img) {
  <img class="lg" [src]="'/assets/images/clients/' + c.img" [alt]="c.name + ' logo'" loading="lazy" decoding="async">
} @else {
<span class="bl {{ c.layout || 'row' }}" role="img" [attr.aria-label]="c.name + ' logo'"
  [style.color]="'var(--lc,#26262e)'" [style.--cc]="hc" [style.--ca]="ha" [style.--s]="c.s || 1">
  @if (c.icon) {
    <svg class="ic" viewBox="0 0 48 48" aria-hidden="true">
      @switch (c.icon) {
        @case ('ring') { <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="12" fill="none" stroke="var(--ac)" stroke-width="3"/><circle cx="24" cy="24" r="4" fill="var(--ac)"/> }
        @case ('star') { <path d="M24 3l6.2 13.2 14.3 1.8-10.5 9.9 2.7 14.3L24 35.2 11.3 42.2 14 27.9 3.5 18l14.3-1.8z" fill="var(--ac)"/> }
        @case ('plus') { <circle cx="24" cy="24" r="21" fill="currentColor"/><path d="M20 10h8v10h10v8H28v10h-8V28H10v-8h10z" fill="#fff"/> }
        @case ('crest') { <path d="M8 6h32v20c0 9-8 15-16 18C16 41 8 35 8 26z" fill="currentColor"/><path d="M24 12l3 7 7 .8-5.2 4.7 1.6 7L24 28l-6.4 3.5 1.6-7L14 19.8l7-.8z" fill="#fff"/> }
        @case ('bone') { <path d="M30 6l12 12M6 42l12-12M14 34L34 14" stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="35" cy="9" r="5" fill="var(--ac)"/><circle cx="13" cy="39" r="5" fill="var(--ac)"/> }
        @case ('infinity') { <path d="M24 24c-4-8-9-10-13-10-5 0-8 4-8 10s3 10 8 10c4 0 9-2 13-10s9-10 13-10c5 0 8 4 8 10s-3 10-8 10c-4 0-9-2-13-10z" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"/> }
        @case ('dot') { <circle cx="24" cy="24" r="14" fill="var(--ac)"/> }
        @case ('drop') { <path d="M24 3C16 14 9 22 9 31a15 15 0 0030 0C39 22 32 14 24 3z" fill="var(--ac)"/><path d="M17 31a7 7 0 007 7" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/> }
        @case ('k') { <rect x="3" y="3" width="42" height="42" rx="6" fill="currentColor"/><path d="M16 12v24M32 12L19 24l13 12" stroke="#fff" stroke-width="5" fill="none" stroke-linejoin="round"/><circle cx="35" cy="13" r="3.5" fill="var(--ac)"/> }
        @case ('fan') { <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M24 42V14"/><path d="M24 42L8 20"/><path d="M24 42L40 20"/><path d="M24 42L14 12"/><path d="M24 42L34 12"/></g><g fill="var(--ac)"><circle cx="24" cy="10" r="4"/><circle cx="8" cy="18" r="3.5"/><circle cx="40" cy="18" r="3.5"/><circle cx="13" cy="10" r="3"/><circle cx="35" cy="10" r="3"/></g> }
        @case ('hex') { <path d="M24 3l18 10.500v21L24 45 6 34.500v-21z" fill="currentColor"/><path d="M30 18a9 9 0 100 12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/> }
        @case ('leafsq') { <rect x="4" y="4" width="40" height="40" rx="9" fill="none" stroke="currentColor" stroke-width="3.500"/><path d="M14 34c0-12 8-20 20-20 0 12-8 20-20 20z" fill="var(--ac)"/> }
        @case ('book') { <path d="M24 12c-4-4-11-5-18-4v28c7-1 14 0 18 4 4-4 11-5 18-4V8c-7-1-14 0-18 4z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M24 12v28" stroke="var(--ac)" stroke-width="3"/> }
        @case ('flower') { <g fill="var(--ac)"><circle cx="24" cy="10" r="7"/><circle cx="38" cy="22" r="7"/><circle cx="32" cy="38" r="7"/><circle cx="16" cy="38" r="7"/><circle cx="10" cy="22" r="7"/></g><circle cx="24" cy="25" r="7" fill="currentColor"/> }
        @case ('pulse') { <path d="M24 42S4 30 4 17a10 10 0 0120-4 10 10 0 0120 4c0 13-20 25-20 25z" fill="var(--ac)"/><path d="M8 24h9l4-8 6 14 4-6h9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/> }
        @case ('s') { <path d="M36 12c-3-4-8-5-12-5-7 0-11 3-11 8 0 11 22 5 22 17 0 5-5 8-11 8-5 0-10-2-13-6" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M44 6v36" stroke="var(--ac)" stroke-width="3"/> }
        @case ('eye') { <path d="M3 24C9 13 16 8 24 8s15 5 21 16c-6 11-13 16-21 16S9 35 3 24z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="8" fill="var(--ac)"/><circle cx="24" cy="24" r="3.500" fill="#fff"/> }
        @case ('square') { <rect x="6" y="6" width="36" height="36" fill="none" stroke="currentColor" stroke-width="4"/><rect x="16" y="16" width="16" height="16" fill="var(--ac)"/> }
        @case ('sblock') { <rect x="3" y="3" width="42" height="42" rx="8" fill="currentColor"/><path d="M33 17c-2-3-5-4-9-4-5 0-8 2-8 5 0 8 17 3 17 12 0 3-3 5-8 5-4 0-7-2-9-4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/> }
        @case ('vee') { <path d="M5 8h13l6 14 6-14h13L24 42z" fill="currentColor"/><path d="M18 8l6 14 6-14" fill="#fff"/> }
      }
    </svg>
  }
  <span class="tx">
    <b class="l1 f-{{ c.f }}" [style.font-weight]="c.w || 700" [style.letter-spacing.em]="c.ls || 0"
       [style.text-transform]="c.up ? 'uppercase' : 'none'" [style.font-style]="c.it ? 'italic' : 'normal'">{{ c.l1 }}</b>
    @if (c.l2) { <i class="l2">{{ c.l2 }}</i> }
  </span>
</span>
}`,
  styles: [`
    :host{display:inline-flex;max-width:100%;justify-content:center}
    .lg{display:block;width:auto;height:auto;max-width:100%;max-height:var(--lgh,64px);object-fit:contain;transition:transform .45s cubic-bezier(.2,.7,.2,1)}
    .bl{display:inline-flex;align-items:center;gap:.4em;font-size:calc(var(--bl,1.5rem) * var(--s,1));line-height:1.05;max-width:100%;transition:transform .45s cubic-bezier(.2,.7,.2,1);text-align:left}
    .bl .ic{width:1.5em;height:1.5em;flex:none;overflow:visible}
    .tx{display:flex;flex-direction:column;min-width:0}
    .l1{display:block;font-size:1em;white-space:normal;text-wrap:balance;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
    .l2{display:block;font-style:normal;font-family:'Montserrat',sans-serif;font-weight:600;font-size:.34em;letter-spacing:.16em;text-transform:uppercase;margin-top:.45em;opacity:.8;white-space:nowrap}
    .stack{flex-direction:column;gap:.2em;text-align:center}.stack .tx{align-items:center}
    .plain .tx{align-items:center}
    .box{border:.09em solid currentColor;padding:.35em .6em;border-radius:.12em}.box .tx{align-items:center;text-align:center}
    .pill{border:.09em solid currentColor;padding:.28em .9em;border-radius:99em}.pill .tx{align-items:center;text-align:center}
    .chip{flex-direction:column;gap:.18em}.chip .tx{align-items:flex-start}
    .chip .l2{background:#1a1a20;margin-top:.3em;padding:.35em .7em;width:100%;text-align:center;opacity:1;border-radius:.2em}
    .chip .l2{color:#fff;-webkit-text-fill-color:#fff}
    .bl{--ac:#26262e;transition:color .35s ease,transform .45s cubic-bezier(.2,.7,.2,1)}
    :host-context(.cl:hover) .bl,:host-context(.logo-tile:hover) .bl,:host-context(.cl:focus-within) .bl{--lc:var(--cc);--ac:var(--ca)}
    :host-context(.cl:hover) .chip .l2,:host-context(.logo-tile:hover) .chip .l2{background:var(--cc)}
    .stack .l2,.plain .l2{margin-top:.35em}
    .f-cinzel{font-family:'Cinzel',serif}.f-playfair{font-family:'Playfair Display',serif}.f-oswald{font-family:'Oswald',sans-serif}
    .f-poppins{font-family:'Poppins',sans-serif}.f-cormorant{font-family:'Cormorant Garamond',serif}.f-anton{font-family:'Anton',sans-serif}
    .f-syne{font-family:'Syne',sans-serif}.f-space{font-family:'Space Grotesk',sans-serif}.f-yellowtail{font-family:'Yellowtail',cursive}
    .f-abril{font-family:'Abril Fatface',serif}.f-montserrat{font-family:'Montserrat',sans-serif}.f-archivo{font-family:'Archivo Black','Archivo',sans-serif}
    .f-righteous{font-family:'Righteous',sans-serif}.f-rozha{font-family:'Rozha One','Noto Serif Devanagari',serif}.f-pacifico{font-family:'Pacifico',cursive}
  `],
})
export class BrandLogoComponent {
  @Input({ required: true }) c!: Client;
  private idx(): number { let h = 0; for (const ch of this.c.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h % PALETTE.length; }
  /** colour shown on hover: the brand colour if it is colourful, otherwise a bright colour picked for this logo */
  get hc(): string { return vivid(this.c.c) ? this.c.c : (vivid(this.c.a) ? this.c.a! : PALETTE[this.idx()]); }
  get ha(): string { return vivid(this.c.a) && this.c.a !== this.hc ? this.c.a! : PALETTE[(this.idx() + 3) % PALETTE.length]; }
}
