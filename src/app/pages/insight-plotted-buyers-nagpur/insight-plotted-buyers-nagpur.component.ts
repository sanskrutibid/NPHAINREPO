import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-insight-plotted-buyers-nagpur',
  standalone: true,
  templateUrl: './insight-plotted-buyers-nagpur.component.html',
  styleUrl: './insight-plotted-buyers-nagpur.component.scss',
})
export class InsightPlottedBuyersNagpurComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/insight-plotted-buyers-nagpur',
      title: "What plotted-development buyers in Nagpur look for before a site visit | Phian Insights",
      description: "Most plotted buyers decide whether to visit long before they call. Here is what they check, and what developers can do about it.",
      noindex: false,
      ld: null,
    });
  }
}
