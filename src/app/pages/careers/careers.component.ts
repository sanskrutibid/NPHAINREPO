import { Component, HostListener, OnDestroy } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { APPLY_ENDPOINT, APPLY_PHP_ENDPOINT, FORMSUBMIT_URL, HR_EMAIL } from '../../core/site.config';

@Component({
  selector: 'app-careers',
  standalone: true,
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss',
})
export class CareersComponent implements OnDestroy {
  // ---- Edit open roles here: [role, team] ----
  roles: [string, string][] = [['Senior SEO Executive', 'Search'], ['Digital Marketing Intern', 'Media'], ['Business Coordinator', 'Accounts'], ['Graphic Designer', 'Content']];

  open = false;
  role = '';
  busy = false;
  ok = false;
  fallback = false;
  msg = '';
  fileName = '';
  private file: File | null = null;

  openForm(r: string): void {
    this.role = r; this.open = true; this.ok = false; this.msg = ''; this.fallback = false; this.fileName = ''; this.file = null;
    document.body.classList.add('lock');
  }

  close(): void { this.open = false; document.body.classList.remove('lock'); }

  onBackdrop(e: MouseEvent): void { if ((e.target as HTMLElement).classList.contains('ap')) this.close(); }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.open) this.close(); }

  ngOnDestroy(): void { document.body.classList.remove('lock'); }

  mailto(): string {
    return 'mailto:' + HR_EMAIL + '?subject=' + encodeURIComponent('Application: ' + this.role);
  }

  pick(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0] || null;
    this.msg = ''; this.file = null; this.fileName = '';
    if (!f) return;
    if (!/\.(pdf|docx?)$/i.test(f.name)) { this.msg = 'Please attach a PDF, DOC or DOCX file.'; (e.target as HTMLInputElement).value = ''; return; }
    if (f.size > 5 * 1024 * 1024) { this.msg = 'Resume is larger than 5 MB. Please attach a smaller file.'; (e.target as HTMLInputElement).value = ''; return; }
    this.file = f; this.fileName = f.name;
  }

  async send(ev: Event): Promise<void> {
    ev.preventDefault();
    if (this.busy) return;
    const form = ev.target as HTMLFormElement;
    const d = new FormData(form);
    if (!String(d.get('name') || '').trim() || !String(d.get('phone') || '').trim() || !/^\S+@\S+\.\S+$/.test(String(d.get('email') || '').trim())) {
      this.msg = 'Please add your name, phone number and a valid email.'; this.fallback = false; return;
    }
    if (!this.file) { this.msg = 'Please attach your resume.'; this.fallback = false; return; }
    d.set('position', this.role);
    d.set('resume', this.file);
    this.busy = true; this.msg = ''; this.fallback = false;
    try {
      // success is shown ONLY when a mail route confirms that the mail was handed to the mail system
      const tryRoute = async (url: string): Promise<'ok' | 'bad' | 'down'> => {
        try {
          const r = await fetch(url, { method: 'POST', body: d });
          const j = await r.json().catch(() => ({} as { ok?: boolean; error?: string }));
          if (r.ok && j.ok) return 'ok';
          if (r.status === 400 || r.status === 429) { this.msg = j.error || 'Please check your details and try again.'; return 'bad'; }
          return 'down';
        } catch { return 'down'; }
      };
      let res = await tryRoute(APPLY_ENDPOINT);                 // 1) Node mail server
      if (res === 'down') res = await tryRoute(APPLY_PHP_ENDPOINT); // 2) PHP mailer
      if (res === 'bad') { this.ok = false; this.fallback = false; return; }
      if (res === 'down') {                                      // 3) FormSubmit backup (JSON answer tells us if it worked)
        try {
          const f = new FormData();
          f.set('name', String(d.get('name') || '').trim());
          f.set('phone', String(d.get('phone') || '').trim());
          f.set('email', String(d.get('email') || '').trim());
          f.set('position', this.role);
          f.set('message', String(d.get('message') || ''));
          f.set('resume', this.file);
          f.set('_subject', 'Application: ' + this.role + ' - ' + String(d.get('name') || '').trim());
          f.set('_template', 'table');
          f.set('_captcha', 'false');
          const r = await fetch(FORMSUBMIT_URL, { method: 'POST', body: f, headers: { Accept: 'application/json' } });
          const j = await r.json().catch(() => ({} as { success?: string | boolean }));
          if (r.ok && (j.success === true || j.success === 'true')) res = 'ok';
        } catch { /* fall through to the email button */ }
      }
      if (res !== 'ok') throw new Error('not delivered');
      this.ok = true;
      this.msg = 'Thank you. Your application for ' + this.role + ' has been sent to our HR team. We will get back to you soon.';
    } catch {
      this.ok = false; this.fallback = true;
      this.msg = 'We could not send your application online right now. Please use the button below. It opens your email app with HR already filled in, then attach your resume.';
    } finally {
      this.busy = false;
    }
  }

  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/careers',
      title: "Careers at Phian | Join a 360-Degree Brand Management Team",
      description: "Join Phian in Nagpur or Kolkata and work across strategy, content, media, technology and search for brands across India.",
      noindex: false,
      ld: null,
    });
  }
}
