import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-insight-patients-choose-specialist',
  standalone: true,
  templateUrl: './insight-patients-choose-specialist.component.html',
  styleUrl: './insight-patients-choose-specialist.component.scss',
})
export class InsightPatientsChooseSpecialistComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/insight-patients-choose-specialist',
      title: "How patients choose a specialist now that AI answers come first | Phian Insights",
      description: "Patients now ask AI assistants and Google for recommendations before they ask a friend. Clinics need to be visible, and believable, in both.",
      noindex: false,
      ld: null,
    });
  }
}
