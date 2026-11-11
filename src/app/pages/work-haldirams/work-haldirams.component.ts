import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-haldirams',
  standalone: true,
  templateUrl: './work-haldirams.component.html',
  styleUrl: './work-haldirams.component.scss',
})
export class WorkHaldiramsComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-haldirams',
      title: "Haldiram's Case Study | Phian Work",
      description: "An integrated PR, branding, positioning and digital marketing mandate for Haldiram's.",
      noindex: false,
      ld: null,
    });
  }
}
