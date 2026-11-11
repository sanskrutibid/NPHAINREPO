import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-baidyanath',
  standalone: true,
  templateUrl: './work-baidyanath.component.html',
  styleUrl: './work-baidyanath.component.scss',
})
export class WorkBaidyanathComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-baidyanath',
      title: "Baidyanath Case Study | Phian Work",
      description: "An integrated PR, branding, positioning and digital marketing mandate for Baidyanath Asli Ayurved.",
      noindex: false,
      ld: null,
    });
  }
}
