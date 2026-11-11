import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-mukunda-group',
  standalone: true,
  templateUrl: './work-mukunda-group.component.html',
  styleUrl: './work-mukunda-group.component.scss',
})
export class WorkMukundaGroupComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-mukunda-group',
      title: "Mukunda Group Case Study | Phian Work",
      description: "Group logo redesign, brand palette and plotted project portfolio for a group spanning transport, logistics, steel and real estate.",
      noindex: false,
      ld: null,
    });
  }
}
