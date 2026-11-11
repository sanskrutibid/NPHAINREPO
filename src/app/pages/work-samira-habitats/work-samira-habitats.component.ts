import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-samira-habitats',
  standalone: true,
  templateUrl: './work-samira-habitats.component.html',
  styleUrl: './work-samira-habitats.component.scss',
})
export class WorkSamiraHabitatsComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-samira-habitats',
      title: "Samira Habitats Case Study | Phian Work",
      description: "Social media, a pitch deck and AI video for a plotted development on the Konkan coast.",
      noindex: false,
      ld: null,
    });
  }
}
