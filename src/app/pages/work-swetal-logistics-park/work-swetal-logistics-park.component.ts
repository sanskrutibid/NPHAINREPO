import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-swetal-logistics-park',
  standalone: true,
  templateUrl: './work-swetal-logistics-park.component.html',
  styleUrl: './work-swetal-logistics-park.component.scss',
})
export class WorkSwetalLogisticsParkComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-swetal-logistics-park',
      title: "Swetal Logistics Park Case Study | Phian Work",
      description: "National demand generation and a brochure rebuild for a logistics park.",
      noindex: false,
      ld: null,
    });
  }
}
