import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/privacy',
      title: "Privacy Policy | Phian",
      description: "How Phian collects, uses and protects your information.",
      noindex: false,
      ld: null,
    });
  }
}
