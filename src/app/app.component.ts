import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { EffectsService } from './core/effects.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('dot', { static: true }) dot!: ElementRef<HTMLElement>;
  @ViewChild('ring', { static: true }) ring!: ElementRef<HTMLElement>;
  @ViewChild('cur', { static: true }) cur!: ElementRef<HTMLElement>;
  @ViewChild('bar', { static: true }) bar!: ElementRef<HTMLElement>;
  @ViewChild('curtain', { static: true }) curtain!: ElementRef<HTMLElement>;

  constructor(private fx: EffectsService, private router: Router) {}

  ngAfterViewInit(): void {
    this.fx.initGlobal({
      dot: this.dot.nativeElement,
      ring: this.ring.nativeElement,
      cur: this.cur.nativeElement,
      bar: this.bar.nativeElement,
      curtain: this.curtain.nativeElement,
    });
    // run page effects once for the first page, then after every navigation
    // inner pages get their own page transitions; the home page keeps its own effects
    const mark = (u: string) => document.body.classList.toggle('is-home', u.split(/[?#]/)[0] === '/');
    mark(location.pathname);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => mark((e as NavigationEnd).urlAfterRedirects));
    const run = () => requestAnimationFrame(() => requestAnimationFrame(() => this.fx.initPage()));
    run();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(run);
  }
}
