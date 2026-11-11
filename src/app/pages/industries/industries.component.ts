import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-industries',
  standalone: true,
  templateUrl: './industries.component.html',
  styleUrl: './industries.component.scss',
})
export class IndustriesComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/industries',
      title: "Industries We Serve | Real Estate, Healthcare, Hospitality and More | Phian",
      description: "Sector-specific brand management for real estate, healthcare, hospitality and F&B, education, B2B and industrial, and fashion and D2C brands.",
      noindex: false,
      ld: null,
    });
  }
}
