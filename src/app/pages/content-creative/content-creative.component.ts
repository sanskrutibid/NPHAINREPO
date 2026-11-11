import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-content-creative',
  standalone: true,
  templateUrl: './content-creative.component.html',
  styleUrl: './content-creative.component.scss',
})
export class ContentCreativeComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/content-creative',
      title: "Content and Creative Agency in Nagpur and Kolkata | Phian",
      description: "We plan, write, shoot and publish the content that keeps your brand visible every week, from Reels and campaign films to brochures and menus, all in one consistent voice.",
      image: '/assets/images/content.jpg',
      imageAlt: "Indian content producer at work",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Content people stop scrolling for.",
        "description": "We plan, write, shoot and publish the content that keeps your brand visible every week, from Reels and campaign films to brochures and menus, all in one consistent voice.",
        "image": "https://www.phianinfotec.com/assets/images/content.jpg",
        "provider": {
          "@type": "Organization",
          "name": "Phian"
        }
      },
    });
  }
}