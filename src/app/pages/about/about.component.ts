import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/about',
      title: "About Phian | 360-Degree Brand Management Company, Nagpur and Kolkata",
      description: "Meet the team behind Phian, founder Debojyoti Ghosh, and what we believe about building, running and growing brands.",
      noindex: false,
      ld: null,
    });
  }
}
