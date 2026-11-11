import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-healthcare',
  standalone: true,
  templateUrl: './healthcare.component.html',
  styleUrl: './healthcare.component.scss',
})
export class HealthcareComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/healthcare',
      title: "Healthcare Marketing and Branding | Phian",
      description: "Marketing for hospitals, specialist clinics and doctors that builds trust first: clear information, a strong local search presence and content that respect",
      noindex: false,
      ld: null,
    });
  }
}
