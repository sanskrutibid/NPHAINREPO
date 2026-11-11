import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-hospitality-fnb',
  standalone: true,
  templateUrl: './hospitality-fnb.component.html',
  styleUrl: './hospitality-fnb.component.scss',
})
export class HospitalityFnbComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/hospitality-fnb',
      title: "Hospitality and F&B Marketing and Branding | Phian",
      description: "Brand, content and bookings for hotels, cafes and restaurants, built on the one thing hospitality sells best: an experience people want to talk about.",
      noindex: false,
      ld: null,
    });
  }
}
