import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/insights',
      title: "Insights | Brand and Marketing Notes from Central and East India | Phian",
      description: "Practical notes from Phian on brands, buyers, search and media across real estate, healthcare, hospitality and more.",
      noindex: false,
      ld: null,
    });
  }
}
