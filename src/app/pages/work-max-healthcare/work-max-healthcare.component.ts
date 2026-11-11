import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-max-healthcare',
  standalone: true,
  templateUrl: './work-max-healthcare.component.html',
  styleUrl: './work-max-healthcare.component.scss',
})
export class WorkMaxHealthcareComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-max-healthcare',
      title: "Max Healthcare Case Study | Phian Work",
      description: "An integrated PR, branding, positioning and digital marketing mandate for Max Healthcare.",
      noindex: false,
      ld: null,
    });
  }
}
