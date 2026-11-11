import { Component } from '@angular/core';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  constructor(seo: SeoService) {
    // SEO for this page: change title / description here
    seo.set({
      path: '/contact',
      title: "Contact Phian | Book a Brand Review in Nagpur or Kolkata",
      description: "Contact Phian to book a brand review. Call, WhatsApp or email our Nagpur and Kolkata team.",
      noindex: false,
      ld: null,
    });
  }
}
