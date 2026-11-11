import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-search-intelligence',
  standalone: true,
  templateUrl: './search-intelligence.component.html',
  styleUrl: './search-intelligence.component.scss',
})
export class SearchIntelligenceComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/search-intelligence',
      title: "Search and Intelligence Agency in Nagpur and Kolkata | Phian",
      description: "We make sure your business is found on Google, on Maps and inside AI answers from ChatGPT, Gemini and Google AI Overviews, and we report on what that visibility is worth.",
      image: '/assets/images/search.jpg',
      imageAlt: "SEO specialist reviewing keyword rankings and organic traffic on a laptop",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Be the answer when people search.",
        "description": "We make sure your business is found on Google, on Maps and inside AI answers from ChatGPT, Gemini and Google AI Overviews, and we report on what that visibility is worth.",
        "image": "https://www.phianinfotec.com/assets/images/search.jpg",
        "provider": {
          "@type": "Organization",
          "name": "Phian"
        }
      },
    });
  }
}