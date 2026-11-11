import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  templateUrl: './what-we-do.component.html',
  styleUrl: './what-we-do.component.scss',
})
export class WhatWeDoComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/what-we-do',
      title: "What We Do | 360-Degree Brand Management Services | Phian",
      description: "Brand strategy, content, media, web and CRM, search and GEO, and PR, planned together and run by one senior team at Phian.",
      image: '/assets/images/team.jpg',
      imageAlt: "Phian team planning a brand strategy together around one table",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "What We Do | Phian",
        "url": SITE + "/what-we-do",
        "image": SITE + "/assets/images/team.jpg",
        "primaryImageOfPage": { "@type": "ImageObject", "url": SITE + "/assets/images/team.jpg", "width": 1376, "height": 768 },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Brand Strategy and Identity", "url": SITE + "/brand-strategy", "image": SITE + "/assets/images/brand-studio.jpg" },
            { "@type": "ListItem", "position": 2, "name": "Content and Creative", "url": SITE + "/content-creative", "image": SITE + "/assets/images/content.jpg" },
            { "@type": "ListItem", "position": 3, "name": "Media and Performance", "url": SITE + "/media-performance", "image": SITE + "/assets/images/performance.jpg" },
            { "@type": "ListItem", "position": 4, "name": "Web, Tech and CRM", "url": SITE + "/web-tech-crm", "image": SITE + "/assets/images/web-devs.jpg" },
            { "@type": "ListItem", "position": 5, "name": "Search and Intelligence", "url": SITE + "/search-intelligence", "image": SITE + "/assets/images/search.jpg" },
            { "@type": "ListItem", "position": 6, "name": "PR and Reputation", "url": SITE + "/pr-reputation", "image": SITE + "/assets/images/founder.jpg" }
          ]
        }
      },
    });
  }
}