import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-web-tech-crm',
  standalone: true,
  templateUrl: './web-tech-crm.component.html',
  styleUrl: './web-tech-crm.component.scss',
})
export class WebTechCrmComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description / image here
    seo.set({
      path: '/web-tech-crm',
      title: "Web, Tech and CRM Agency in Nagpur and Kolkata | Phian",
      description: "We design and build websites, landing pages, CRM systems and custom tools that capture every enquiry, route it to the right person and help your team close it.",
      image: '/assets/images/web-devs.jpg',
      imageAlt: "Two Indian web developers collaborating",
      noindex: false,
      ld: {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Websites and systems that do real work.",
        "description": "We design and build websites, landing pages, CRM systems and custom tools that capture every enquiry, route it to the right person and help your team close it.",
        "image": "https://www.phianinfotec.com/assets/images/web-devs.jpg",
        "provider": {
          "@type": "Organization",
          "name": "Phian"
        }
      },
    });
  }
}