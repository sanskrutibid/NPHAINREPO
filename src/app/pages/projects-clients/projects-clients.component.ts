import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { CLIENT_GROUPS } from '../../core/clients.data';
import { BrandLogoComponent } from '../../shared/brand-logo/brand-logo.component';


@Component({
  selector: 'app-projects-clients',
  standalone: true,
  imports: [BrandLogoComponent],
  templateUrl: './projects-clients.component.html',
  styleUrl: './projects-clients.component.scss',
})
export class ProjectsClientsComponent {
  groups = CLIENT_GROUPS;

  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/projects-clients',
      title: "Projects and Clients | Phian Infotec",
      description: "Projects delivered and the clients Phian Infotec works with across real estate, healthcare, hospitality, education, B2B and more, from Nagpur and Kolkata.",
      noindex: false,
      ld: null,
    });
  }

  /** smooth-scroll to a client group under the fixed header */
  jump(e: Event, id: string): void {
    e.preventDefault();
    const el = document.getElementById('cl-' + id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
