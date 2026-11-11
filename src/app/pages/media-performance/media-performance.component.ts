import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-media-performance',
  standalone: true,
  templateUrl: './media-performance.component.html',
  styleUrl: './media-performance.component.scss',
})
export class MediaPerformanceComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/media-performance',
      title: "Media and Performance Agency in Nagpur and Kolkata | Phian",
      description: "We plan and run paid media across Meta, Google and beyond, judged on the enquiries, visits and sales it creates, not on clicks alone.",
      image: '/assets/images/performance.jpg',
      imageAlt: "Indian performance marketing manager at work",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Media spend that turns into business.",
        "description": "We plan and run paid media across Meta, Google and beyond, judged on the enquiries, visits and sales it creates, not on clicks alone.",
        "image": "https://www.phianinfotec.com/assets/images/performance.jpg",
        "provider": {
          "@type": "Organization",
          "name": "Phian"
        }
      },
    });
  }
}