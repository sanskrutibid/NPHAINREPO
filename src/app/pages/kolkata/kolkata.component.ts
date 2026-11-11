import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-kolkata',
  standalone: true,
  templateUrl: './kolkata.component.html',
  styleUrl: './kolkata.component.scss',
})
export class KolkataComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/kolkata',
      title: "Brand Management and Digital Marketing Agency in Kolkata | Phian",
      description: "Phian's Kolkata office: 360-degree brand management, content, media, web and search for businesses across West Bengal and East India.",
      noindex: false,
      ld: null,
    });
  }
}
