import { Component, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

type Link = [string, string];

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  // ---- Edit menu links here ----
  NAV: Link[] = [['Home', '/'], ['What we do', '/what-we-do'], ['Industries', '/industries'], ['Work', '/work'], ['Projects & Clients', '/projects-clients'], ['About', '/about'], ['Insights', '/insights'], ['Contact', '/contact']];
  PIL: Link[] = [['Brand Strategy and Identity', '/brand-strategy'], ['Content and Creative', '/content-creative'], ['Media and Performance', '/media-performance'], ['Web, Tech and CRM', '/web-tech-crm'], ['Search and Intelligence', '/search-intelligence'], ['PR and Reputation', '/pr-reputation']];
  SEC: Link[] = [['Real Estate', '/real-estate'], ['Healthcare', '/healthcare'], ['Hospitality and F&B', '/hospitality-fnb'], ['Education', '/education'], ['B2B and Industrial', '/b2b-industrial'], ['Fashion and D2C', '/fashion-d2c']];
  OFF: Link[] = [['Process of Branding', '/method'], ['Careers', '/careers'], ['Nagpur office', '/nagpur'], ['Kolkata office', '/kolkata'], ['Mumbai office', '/mumbai']];

  open = false;
  exp = '';   // phone menu: which item is expanded
  logoBad = false;
  path = '/';
  private sub: Subscription;
  private lastItem: HTMLElement | null = null;

  constructor(private router: Router) {
    this.path = router.url.split('#')[0].split('?')[0];
    this.sub = router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.path = this.router.url.split('#')[0].split('?')[0];
      this.setOpen(false);
      this.closeDropdowns();
    });
  }

  /** closes any open drop-down (after a click or page change); it opens again only when the mouse re-enters it */
  closeDropdowns(): void {
    const nav = document.querySelector<HTMLElement>('.tn');
    const act = document.activeElement as HTMLElement | null;
    const item = act?.closest?.('.tn-i') as HTMLElement | null;
    if (item) this.lastItem = item;
    act?.blur?.();
    nav?.classList.add('dd-closed');
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if ((e.target as HTMLElement | null)?.closest?.('.tn a')) this.closeDropdowns();
  }

  @HostListener('document:mouseover', ['$event'])
  onOver(e: MouseEvent): void {
    // re-arm drop-downs once the pointer is outside the menu, or moves onto a different menu item
    const nav = document.querySelector<HTMLElement>('.tn');
    if (!nav?.classList.contains('dd-closed')) return;
    const t = e.target as HTMLElement;
    const item = t.closest?.('.tn-i') as HTMLElement | null;
    if (!item || item !== this.lastItem) nav.classList.remove('dd-closed');
  }

  /** two-digit menu number: 01 02 03 04 ... (always the same width, never wraps) */
  num(i: number): string { return String(i + 1).padStart(2, '0'); }

  /** links that open under a menu item on phones */
  subFor(href: string): Link[] | null {
    if (href === '/what-we-do') return this.PIL;
    if (href === '/industries') return this.SEC;
    if (href === '/about') return this.OFF;
    return null;
  }

  /** phone: first tap opens the list under the item, tap again closes it. The page opens only from "Open ..." or a link inside. */
  onMain(e: Event, href: string): void {
    if (!window.matchMedia('(max-width: 900px)').matches || !this.subFor(href)) return;
    e.preventDefault();
    e.stopPropagation();
    this.exp = this.exp === href ? '' : href;
  }

  inGroup(l: Link[]): boolean { return l.some(x => x[1] === this.path); }

  /** true for /work and every case study (/work-nsh-hospital ...) so the "Work" tab stays highlighted inside them */
  inWork(): boolean { return this.path === '/work' || this.path.startsWith('/work-'); }
  /** true for /insights, /blog/... and every /insight-... article */
  inInsights(): boolean { return this.path === '/insights' || this.path.startsWith('/insight-') || this.path.startsWith('/blog/'); }

  toggle(): void { this.setOpen(!this.open); }

  private setOpen(v: boolean): void {
    this.open = v;
    if (!v) this.exp = '';
    document.body.classList.toggle('lock', v);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.open) this.setOpen(false); }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}