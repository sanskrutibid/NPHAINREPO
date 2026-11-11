import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-method',
  standalone: true,
  templateUrl: './method.component.html',
  styleUrl: './method.component.scss',
})
export class MethodComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/method',
      title: "Process of Branding | How We Build and Grow Brands | Phian",
      description: "Phian's five-step method for brand management, built on Kotler's principles and Marketing 6.0: understand, position, build, grow, report.",
      noindex: false,
      ld: null,
    });
  }
}
