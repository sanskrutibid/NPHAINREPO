import { Routes, UrlMatcher, UrlSegment } from '@angular/router';

// Old / guessed addresses (index.html, about-us, contact-us, services, /about.html, trailing junk ...) are sent to the right page
// instead of showing the 404 page. Add more pairs here if you find other old links.
const ALIASES: Record<string, string> = {
  '': '', 'home': '', 'index': '', 'index.html': '', 'default': '',
  'about-us': 'about', 'aboutus': 'about', 'about-phian': 'about', 'company': 'about', 'team': 'about', 'our-team': 'about',
  'contact-us': 'contact', 'contactus': 'contact', 'enquiry': 'contact', 'enquire': 'contact',
  'career': 'careers', 'jobs': 'careers', 'join-us': 'careers', 'hiring': 'careers',
  'services': 'what-we-do', 'service': 'what-we-do', 'our-services': 'what-we-do', 'what-we-do': 'what-we-do',
  'our-work': 'work', 'portfolio': 'work', 'case-studies': 'work',
  'projects': 'projects-clients', 'clients': 'projects-clients', 'our-clients': 'projects-clients', 'projects-and-clients': 'projects-clients',
  'blog': 'insights', 'blogs': 'insights', 'insight': 'insights', 'news': 'insights',
  'industry': 'industries', 'sectors': 'industries',
  'privacy-policy': 'privacy', 'privacy-policy.html': 'privacy',
  'process': 'method', 'process-of-branding': 'method',
  'branding': 'brand-strategy', 'digital-marketing': 'media-performance', 'seo': 'search-intelligence',
  'web-development': 'web-tech-crm', 'website-development': 'web-tech-crm', 'pr': 'pr-reputation',
};
const KNOWN = new Set(['about', 'b2b-industrial', 'brand-strategy', 'careers', 'contact', 'content-creative', 'education', 'fashion-d2c', 'healthcare', 'hospitality-fnb', 'industries', 'insights', 'kolkata', 'mumbai', 'media-performance', 'method', 'nagpur', 'projects-clients', 'pr-reputation', 'privacy', 'real-estate', 'search-intelligence', 'web-tech-crm', 'what-we-do', 'work']);
const legacyTarget = (segs: UrlSegment[]): string | null => {
  if (!segs.length) return null;
  const last = segs[segs.length - 1].path.toLowerCase();
  const clean = last.replace(/\.(html?|php|aspx?)$/, '');
  if (segs.length === 1 && (ALIASES[last] !== undefined || ALIASES[clean] !== undefined)) return ALIASES[last] ?? ALIASES[clean];
  if (segs.length === 1 && KNOWN.has(clean)) return clean;                       // /about.html -> /about
  if (segs.length > 1 && ['index.html', 'index.php', 'index'].includes(last)) return segs.slice(0, -1).map(x => x.path).join('/'); // /nagpur/index.html -> /nagpur
  return null;
};
const legacyMatcher: UrlMatcher = segs => (legacyTarget(segs) !== null ? { consumed: segs } : null);


export const routes: Routes = [
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog-post/blog-post.component').then(m => m.BlogPostComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'b2b-industrial', loadComponent: () => import('./pages/b2b-industrial/b2b-industrial.component').then(m => m.B2bIndustrialComponent) },
  { path: 'brand-strategy', loadComponent: () => import('./pages/brand-strategy/brand-strategy.component').then(m => m.BrandStrategyComponent) },
  { path: 'careers', loadComponent: () => import('./pages/careers/careers.component').then(m => m.CareersComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'content-creative', loadComponent: () => import('./pages/content-creative/content-creative.component').then(m => m.ContentCreativeComponent) },
  { path: 'education', loadComponent: () => import('./pages/education/education.component').then(m => m.EducationComponent) },
  { path: 'fashion-d2c', loadComponent: () => import('./pages/fashion-d2c/fashion-d2c.component').then(m => m.FashionD2cComponent) },
  { path: 'healthcare', loadComponent: () => import('./pages/healthcare/healthcare.component').then(m => m.HealthcareComponent) },
  { path: 'hospitality-fnb', loadComponent: () => import('./pages/hospitality-fnb/hospitality-fnb.component').then(m => m.HospitalityFnbComponent) },
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'industries', loadComponent: () => import('./pages/industries/industries.component').then(m => m.IndustriesComponent) },
  { path: 'insight-ai-search-local-business', loadComponent: () => import('./pages/insight-ai-search-local-business/insight-ai-search-local-business.component').then(m => m.InsightAiSearchLocalBusinessComponent) },
  { path: 'insight-patients-choose-specialist', loadComponent: () => import('./pages/insight-patients-choose-specialist/insight-patients-choose-specialist.component').then(m => m.InsightPatientsChooseSpecialistComponent) },
  { path: 'insight-plotted-buyers-nagpur', loadComponent: () => import('./pages/insight-plotted-buyers-nagpur/insight-plotted-buyers-nagpur.component').then(m => m.InsightPlottedBuyersNagpurComponent) },
  { path: 'insights', loadComponent: () => import('./pages/insights/insights.component').then(m => m.InsightsComponent) },
  { path: 'kolkata', loadComponent: () => import('./pages/kolkata/kolkata.component').then(m => m.KolkataComponent) },
  { path: 'mumbai', loadComponent: () => import('./pages/mumbai/mumbai.component').then(m => m.MumbaiComponent) },
  { path: 'media-performance', loadComponent: () => import('./pages/media-performance/media-performance.component').then(m => m.MediaPerformanceComponent) },
  { path: 'method', loadComponent: () => import('./pages/method/method.component').then(m => m.MethodComponent) },
  { path: 'nagpur', loadComponent: () => import('./pages/nagpur/nagpur.component').then(m => m.NagpurComponent) },
  { path: 'projects-clients', loadComponent: () => import('./pages/projects-clients/projects-clients.component').then(m => m.ProjectsClientsComponent) },
  { path: 'pr-reputation', loadComponent: () => import('./pages/pr-reputation/pr-reputation.component').then(m => m.PrReputationComponent) },
  { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'real-estate', loadComponent: () => import('./pages/real-estate/real-estate.component').then(m => m.RealEstateComponent) },
  { path: 'search-intelligence', loadComponent: () => import('./pages/search-intelligence/search-intelligence.component').then(m => m.SearchIntelligenceComponent) },
  { path: 'web-tech-crm', loadComponent: () => import('./pages/web-tech-crm/web-tech-crm.component').then(m => m.WebTechCrmComponent) },
  { path: 'what-we-do', loadComponent: () => import('./pages/what-we-do/what-we-do.component').then(m => m.WhatWeDoComponent) },
  { path: 'work-nsh-hospital', loadComponent: () => import('./pages/work-nsh-hospital/work-nsh-hospital.component').then(m => m.WorkNshHospitalComponent) },
  { path: 'work-max-healthcare', loadComponent: () => import('./pages/work-max-healthcare/work-max-healthcare.component').then(m => m.WorkMaxHealthcareComponent) },
  { path: 'work-baidyanath', loadComponent: () => import('./pages/work-baidyanath/work-baidyanath.component').then(m => m.WorkBaidyanathComponent) },
  { path: 'work-haldirams', loadComponent: () => import('./pages/work-haldirams/work-haldirams.component').then(m => m.WorkHaldiramsComponent) },
  { path: 'work-mukunda-group', loadComponent: () => import('./pages/work-mukunda-group/work-mukunda-group.component').then(m => m.WorkMukundaGroupComponent) },
  { path: 'work-samira-habitats', loadComponent: () => import('./pages/work-samira-habitats/work-samira-habitats.component').then(m => m.WorkSamiraHabitatsComponent) },
  { path: 'work-swetal-logistics-park', loadComponent: () => import('./pages/work-swetal-logistics-park/work-swetal-logistics-park.component').then(m => m.WorkSwetalLogisticsParkComponent) },
  { path: 'work', loadComponent: () => import('./pages/work/work.component').then(m => m.WorkComponent) },
  { matcher: legacyMatcher, redirectTo: ({ url }) => '/' + (legacyTarget(url) || '') },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];