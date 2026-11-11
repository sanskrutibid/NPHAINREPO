import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-work-nsh-hospital',
  standalone: true,
  templateUrl: './work-nsh-hospital.component.html',
  styleUrl: './work-nsh-hospital.component.scss',
})
export class WorkNshHospitalComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/work-nsh-hospital',
      title: "NSH Hospital Case Study | Phian Work",
      description: "An integrated PR, branding, positioning and digital marketing mandate for NSH Critical Care Hospital and Diagnostic Centre.",
      noindex: false,
      ld: null,
    });
  }
}
