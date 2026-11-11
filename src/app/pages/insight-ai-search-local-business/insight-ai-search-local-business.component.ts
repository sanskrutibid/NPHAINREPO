import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-insight-ai-search-local-business',
  standalone: true,
  templateUrl: './insight-ai-search-local-business.component.html',
  styleUrl: './insight-ai-search-local-business.component.scss',
})
export class InsightAiSearchLocalBusinessComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/insight-ai-search-local-business',
      title: "How to get your business named by ChatGPT and Google AI Overviews | Phian Insights",
      description: "Search is changing from ten blue links to one written answer. Here is how local and regional businesses can make sure they are part of it.",
      noindex: false,
      ld: null,
    });
  }
}
