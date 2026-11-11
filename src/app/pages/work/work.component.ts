import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work',
  standalone: true,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work',
      title: "Our Work | Brand Management Case Studies | Phian",
      description: "Case studies from Phian across real estate, healthcare, hospitality, B2B and more, showing the brief, the approach and the result.",
      noindex: false,
      ld: null,
    });
  }
}
