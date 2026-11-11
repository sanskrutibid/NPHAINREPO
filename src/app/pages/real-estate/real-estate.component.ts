import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-real-estate',
  standalone: true,
  templateUrl: './real-estate.component.html',
  styleUrl: './real-estate.component.scss',
})
export class RealEstateComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/real-estate',
      title: "Real Estate Marketing and Branding | Phian",
      description: "Brand, content, media and CRM for developers across Central India, run by one team from the day you plan a launch to the day the last unit is booked.",
      noindex: false,
      ld: null,
    });
  }
}
