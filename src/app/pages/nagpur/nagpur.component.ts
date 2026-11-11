import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-nagpur',
  standalone: true,
  templateUrl: './nagpur.component.html',
  styleUrl: './nagpur.component.scss',
})
export class NagpurComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/nagpur',
      title: "Brand Management and Digital Marketing Agency in Nagpur | Phian",
      description: "Phian's Nagpur office: 360-degree brand management, content, media, web and search for businesses across Vidarbha, Maharashtra and Central India.",
      noindex: false,
      ld: null,
    });
  }
}
