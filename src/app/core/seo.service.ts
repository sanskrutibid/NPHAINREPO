import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { SITE, DEFAULT_SHARE_IMAGE, SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT } from './site.config';

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  ld?: object | null;
  /** Page image, e.g. '/assets/images/content.jpg'. Shown in search results and link previews. */
  image?: string;
  /** Describes the image. Falls back to the page title. */
  imageAlt?: string;
}

/** Sets title, meta description, canonical, Open Graph, Twitter card, page image and JSON-LD for the current page. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private titleSvc: Title, private meta: Meta, @Inject(DOCUMENT) private doc: Document) {}

  set(p: PageSeo): void {
    const imgPath = p.image || DEFAULT_SHARE_IMAGE;
    const imgUrl = /^https?:\/\//.test(imgPath) ? imgPath : SITE + imgPath;
    const imgAlt = p.imageAlt || p.title;
    const pageUrl = SITE + (p.path === '/' ? '/' : p.path);

    this.titleSvc.setTitle(p.title);
    this.meta.updateTag({ name: 'description', content: p.description });

    this.meta.updateTag({ property: 'og:title', content: p.title });
    this.meta.updateTag({ property: 'og:description', content: p.description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:image', content: imgUrl });
    this.meta.updateTag({ property: 'og:image:secure_url', content: imgUrl });
    this.meta.updateTag({ property: 'og:image:width', content: String(SHARE_IMAGE_WIDTH) });
    this.meta.updateTag({ property: 'og:image:height', content: String(SHARE_IMAGE_HEIGHT) });
    this.meta.updateTag({ property: 'og:image:alt', content: imgAlt });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: p.title });
    this.meta.updateTag({ name: 'twitter:description', content: p.description });
    this.meta.updateTag({ name: 'twitter:image', content: imgUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imgAlt });

    if (p.noindex) this.meta.updateTag({ name: 'robots', content: 'noindex' });
    else this.meta.removeTag("name='robots'");

    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', SITE + p.path);

    this.doc.querySelectorAll('script[data-page-ld]').forEach(n => n.remove());
    if (p.ld) {
      // Add the page image to the structured data when the page did not set one itself.
      const ld: any = { ...(p.ld as any) };
      if (!ld.image) ld.image = imgUrl;
      const s = this.doc.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-ld', '1');
      s.text = JSON.stringify(ld);
      this.doc.head.appendChild(s);
    }
  }
}