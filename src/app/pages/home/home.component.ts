import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { CLIENT_GROUPS } from '../../core/clients.data';
import { BrandLogoComponent } from '../../shared/brand-logo/brand-logo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BrandLogoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  groups = CLIENT_GROUPS;
  muted = true;
  @ViewChild('reel') reelD?: ElementRef<HTMLVideoElement>;
  @ViewChild('frame') frameD?: ElementRef<HTMLElement>;
  @ViewChild('reelM') reelM?: ElementRef<HTMLVideoElement>;
  @ViewChild('frameM') frameM?: ElementRef<HTMLElement>;
  private io?: IntersectionObserver;
  private mq?: MediaQueryList;
  private onMq = () => this.setup();
  // Portrait phones get the 9:16 video (full width, no black sides); tablets, landscape phones, laptops and desktops get the 16:9 showreel
  private static readonly PHONE = '(max-width: 600px) and (orientation: portrait)';

  private get isPhone(): boolean { return !!this.mq?.matches; }
  private get reel(): HTMLVideoElement | undefined { return (this.isPhone ? this.reelM : this.reelD)?.nativeElement; }
  private get frame(): HTMLElement | undefined { return (this.isPhone ? this.frameM : this.frameD)?.nativeElement; }

  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/',
      title: "Phian | 360-Degree Brand Management Company in Nagpur and Kolkata",
      description: "Phian builds, runs and grows brands with one senior team: strategy, creative, media, technology and reputation, for businesses across Central and East India.",
      noindex: false,
      ld: null,
    });
  }

  // Showreel: only the video for this device is loaded (phone = 9:16, desktop = 16:9). Plays silently, pauses when scrolled away.
  ngAfterViewInit(): void {
    this.mq = window.matchMedia(HomeComponent.PHONE);
    if (this.mq.addEventListener) this.mq.addEventListener('change', this.onMq); else (this.mq as any).addListener?.(this.onMq);
    this.setup();
  }

  private setup(): void {
    const on = this.reel;
    const off = (this.isPhone ? this.reelD : this.reelM)?.nativeElement;
    this.io?.disconnect();
    if (off) { off.pause(); }
    if (!on) return;
    if (!on.getAttribute('src')) { on.src = on.dataset['src'] || ''; on.preload = 'auto'; on.load(); }
    on.muted = this.muted;
    on.defaultMuted = true;
    on.setAttribute('playsinline', '');
    on.setAttribute('webkit-playsinline', '');
    const play = () => { on.play().catch(() => { /* autoplay blocked: the poster stays visible */ }); };
    play();
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? play() : on.pause())), { threshold: 0.25 });
      this.io.observe(on);
    }
  }

  toggleSound(): void {
    const v = this.reel;
    if (!v) return;
    this.muted = !this.muted;
    v.muted = this.muted;
    if (!this.muted) v.volume = 1;
    v.play().catch(() => {});
  }

  // Full-screen button: whole video, never cropped (iPhone Safari needs its own native player call)
  fullscreen(): void {
    const v = this.reel as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | undefined;
    const f = this.frame as (HTMLElement & { webkitRequestFullscreen?: () => void }) | undefined;
    if (!v) return;
    const doc = document as Document & { webkitFullscreenElement?: Element };
    if (doc.fullscreenElement || doc.webkitFullscreenElement) { (document.exitFullscreen || (document as any).webkitExitFullscreen)?.call(document); return; }
    if (f?.requestFullscreen) { f.requestFullscreen().catch(() => v.webkitEnterFullscreen?.()); }
    else if (f?.webkitRequestFullscreen) { f.webkitRequestFullscreen(); }
    else { v.webkitEnterFullscreen?.(); }
    v.play().catch(() => {});
  }

  ngOnDestroy(): void { this.io?.disconnect(); this.mq?.removeEventListener?.('change', this.onMq); }
}
