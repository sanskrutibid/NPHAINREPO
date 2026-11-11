import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-brand-strategy',
  standalone: true,
  templateUrl: './brand-strategy.component.html',
  styleUrl: './brand-strategy.component.scss',
})
export class BrandStrategyComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/brand-strategy',
      title: "Brand Strategy and Identity Agency in Nagpur and Kolkata | Phian",
      description: "Brand strategy and identity is where most Phian engagements start. We find what makes your business worth choosing, then build the name, look and voice that say it everywhere.",
      image: '/assets/images/brand-studio.jpg',
      imageAlt: "Inside a modern Indian brand studio",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Give people a clear reason to choose you.",
        "description": "Brand strategy and identity is where most Phian engagements start. We find what makes your business worth choosing, then build the name, look and voice that say it everywhere.",
        "image": "https://www.phianinfotec.com/assets/images/brand-studio.jpg",
        "provider": {
          "@type": "Organization",
          "name": "Phian"
        }
      },
    });
  }
}