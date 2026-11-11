import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-fashion-d2c',
  standalone: true,
  templateUrl: './fashion-d2c.component.html',
  styleUrl: './fashion-d2c.component.scss',
})
export class FashionD2cComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/fashion-d2c',
      title: "Fashion and D2C Marketing and Branding | Phian",
      description: "Brand, content and performance marketing for fashion labels and direct-to-consumer brands, selling across India and into international markets.",
      noindex: false,
      ld: null,
    });
  }
}
