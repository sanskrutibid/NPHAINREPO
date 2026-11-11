import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-education',
  standalone: true,
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/education',
      title: "Education Marketing and Branding | Phian",
      description: "Brand, content and admissions campaigns for schools, preschools and academies, speaking to parents' real questions with clarity and warmth.",
      noindex: false,
      ld: null,
    });
  }
}
