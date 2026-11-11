import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-b2b-industrial',
  standalone: true,
  templateUrl: './b2b-industrial.component.html',
  styleUrl: './b2b-industrial.component.scss',
})
export class B2bIndustrialComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/b2b-industrial',
      title: "B2B and Industrial Marketing and Branding | Phian",
      description: "Brand and demand generation for logistics, manufacturing and agri-input businesses, built for long sales cycles and the few decision makers who matter.",
      noindex: false,
      ld: null,
    });
  }
}
