import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-pr-reputation',
  standalone: true,
  templateUrl: './pr-reputation.component.html',
  styleUrl: './pr-reputation.component.scss',
})
export class PrReputationComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/pr-reputation',
      title: "PR and Reputation Agency in Nagpur and Kolkata | Phian",
      description: "We build the reputation your brand needs to be believed: media coverage, founder profiles, launch events and a steady record of reviews and proof.",
      image: '/assets/images/founder.jpg',
      imageAlt: "Press and media coverage at a launch event",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Trust, earned before the first meeting.",
        "description": "We build the reputation your brand needs to be believed: media coverage, founder profiles, launch events and a steady record of reviews and proof.",
        "image": "https://www.phianinfotec.com/assets/images/founder.jpg",
        "provider": {
          "@type": "Organization",
          "name": "Phian"
        }
      },
    });
  }
}