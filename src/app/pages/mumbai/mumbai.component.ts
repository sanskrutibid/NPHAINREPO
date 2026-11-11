import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-mumbai',
  standalone: true,
  templateUrl: './mumbai.component.html',
  styleUrl: './mumbai.component.scss',
})
export class MumbaiComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/mumbai',
      title: "Brand Management and Digital Marketing Agency in Mumbai | Phian",
      description: "Phian's Mumbai office: 360-degree brand management, content, media, web and search for businesses across Mumbai and Western India.",
      noindex: false,
      ld: null,
    });
  }
}
