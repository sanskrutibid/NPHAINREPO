// Blog posts shown under Insights -> "More from the Phian blog".
// Each post opens on THIS site at /blog/<slug>. To add a post, add one object below and a link in
// src/app/pages/insights/insights.component.html. To change the text, edit `body` (plain HTML: p, h2, ul, li).
// NOTE: the bodies below are short drafts written from each post's summary. Paste the full original text
// from phianinfotec.com/blogs into `body` to replace them.
export interface BlogPost {
  slug: string;
  category: string;
  date: string;       // shown on the page
  isoDate: string;    // for SEO
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  readTime: string;
  body: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'choose-best-digital-marketing-agency-small-business',
    category: 'Marketing Strategy',
    date: '27 March 2026',
    isoDate: '2026-03-27',
    title: 'How to Choose the Best Digital Marketing Agency for Small Business Success',
    summary: 'Finding the right partner is crucial. The key factors to weigh when hiring a marketing company for small business growth.',
    image: '/assets/images/team.jpg',
    imageAlt: 'A marketing team planning a campaign together',
    readTime: '4 min read',
    body: `<p>Finding the right partner is crucial. For a small business, the agency you hire shapes how fast you grow and how well every rupee of your marketing budget is used.</p><figure class="inline-fig"><img src="/assets/images/brand-studio.jpg" alt=""></figure>
<h2>Start with your own goals</h2><p>Before you speak to any agency, decide what you want: more enquiries, more footfall, a stronger local name or a better website. An agency can only be judged against a goal you have defined.</p>
<h2>Look for relevant experience</h2><p>Ask to see work for businesses of your size and in your sector. Case studies and real client results tell you more than a long list of services.</p>
<h2>Check how they plan and report</h2><p>A good agency explains its plan in plain language and reports on results that matter to your business, such as leads and enquiries, not only likes and impressions.</p>
<h2>Ask about the team</h2><ul><li>Who will actually work on your account?</li><li>Do strategy, content, media and tech sit under one roof?</li><li>Who is your single point of contact?</li></ul>
<h2>Weigh value, not just price</h2><p>The cheapest option rarely delivers the best return. Look for transparent pricing, clear deliverables and a partner who treats your budget as their own.</p>`,
  },
  {
    slug: 'professional-ppc-management-services-roi',
    category: 'PPC',
    date: '26 March 2026',
    isoDate: '2026-03-26',
    title: 'Maximizing ROI: Why Your Business Needs Professional PPC Management Services',
    summary: 'Stop wasting ad spend and see how expert PPC management lifts performance marketing.',
    image: '/assets/images/performance.jpg',
    imageAlt: 'Marketer reviewing pay-per-click campaign dashboards',
    readTime: '4 min read',
    body: `<p>Pay-per-click advertising can bring in enquiries quickly, but it can also burn through budget just as quickly when it is not managed well. Professional PPC management is about making every click work harder.</p><figure class="inline-fig"><img src="/assets/images/web-devs.jpg" alt=""></figure>
<h2>Where ad spend gets wasted</h2><ul><li>Broad targeting that reaches people who will never buy.</li><li>Keywords and audiences that are never reviewed or cleaned up.</li><li>Landing pages that do not match the promise of the ad.</li></ul>
<h2>What expert management adds</h2><p>A specialist structures campaigns around your goal, tests ads and audiences, and keeps improving based on data. The aim is leads your team can actually close, not just cheap clicks.</p>
<h2>Measure what matters</h2><p>Good PPC reporting connects spend to enquiries and, where possible, to sales. That is how you know whether performance marketing is truly lifting your business.</p>
<h2>Where to begin</h2><p>Start with one clear goal, one well-built landing page and a campaign that can be measured end to end. Scale only what works.</p>`,
  },
  {
    slug: 'best-digital-marketing-agency-nagpur-small-businesses',
    category: 'Local Marketing',
    date: '27 March 2026',
    isoDate: '2026-03-27',
    title: 'Why We Are the Best Digital Marketing Agency in Nagpur for Small Businesses',
    summary: 'Why local expertise matters when choosing a digital marketing company in Nagpur.',
    image: '/assets/images/studio.jpg',
    imageAlt: 'Phian creative studio in Nagpur',
    readTime: '3 min read',
    body: `<p>Local expertise matters when you choose a digital marketing company. A team that works in your city understands how your customers search, decide and buy.</p><figure class="inline-fig"><img src="/assets/images/team.jpg" alt=""></figure>
<h2>Local market knowledge</h2><p>Nagpur and the wider Vidarbha region have their own buying habits, languages and seasons. Marketing that reflects them feels familiar to customers and performs better.</p>
<h2>One team, close by</h2><p>Phian is based in Nagpur and brings brand strategy, content, media, web and search together in one team. That means quicker conversations, easier meetings and a team that sees your results first-hand.</p>
<h2>Built for small businesses</h2><p>Small businesses need clear plans, honest reporting and budgets that go a long way. We start with your goal and build only what moves you towards it.</p>
<p>Want to talk it through? <a href="/contact"><u>Book a brand review</u></a> with our team.</p>`,
  },
  {
    slug: 'google-business-profile-checklist-nagpur',
    category: 'Local Search',
    date: '12 October 2026',
    isoDate: '2026-10-12',
    title: 'Is Your Google Business Profile Doing Its Job? A Simple Checklist',
    summary: 'Most local customers see your Google Business Profile before they see your website. Here is what to check.',
    image: '/assets/images/search.jpg',
    imageAlt: 'Search results for a local business',
    readTime: '4 min read',
    body: `<p>For a local business, the Google Business Profile is often the first thing a customer sees. If it is incomplete or out of date, you lose enquiries before anyone reaches your website.</p><figure class="inline-fig"><img src="/assets/images/content.jpg" alt=""></figure>
<h2>Keep your details identical everywhere</h2><p>Your name, address and phone number should match on your profile, your website and your social pages. Small differences confuse both customers and search engines.</p>
<h2>Choose the right categories and services</h2><p>Pick the main category that describes what you do, then add the services you actually offer. Describe each one in plain words.</p>
<h2>Add real photos</h2><p>Show your premises, your team and your work. Fresh, real photos build trust faster than stock images.</p>
<h2>Answer every review</h2><ul><li>Thank people who praise you, and be specific.</li><li>Reply calmly to criticism and offer to fix the problem.</li><li>Ask happy customers to leave a review.</li></ul>
<p>Want a second pair of eyes on your profile? <a href="/contact"><u>Book a brand review</u></a> with our team.</p>`,
  },
  {
    slug: 'brand-checklist-before-launching-a-real-estate-project',
    category: 'Real Estate',
    date: '19 October 2026',
    isoDate: '2026-10-19',
    title: 'Before You Launch a Real Estate Project: The Brand Checklist',
    summary: 'A short checklist of what a project needs in place before the first advertisement goes live.',
    image: '/assets/images/real-estate.jpg',
    imageAlt: 'Aerial view of a plotted residential layout',
    readTime: '5 min read',
    body: `<p>A launch works best when the basics are ready before the first ad runs. Use this checklist to see what is missing.</p><figure class="inline-fig"><img src="/assets/images/samira-height.jpg" alt=""></figure>
<h2>A name and identity people remember</h2><p>The project name should be easy to say, easy to spell and free of confusion with nearby projects. The logo and colours should work on a hoarding and on a phone screen.</p>
<h2>A clear promise</h2><p>Decide the one reason a buyer should visit your site. Every brochure, post and sales conversation should repeat it.</p>
<h2>A website or landing page that answers questions</h2><ul><li>Location and map</li><li>Layout, sizes and approvals</li><li>Photos, drone shots or videos</li><li>A simple way to book a site visit</li></ul>
<h2>A follow-up routine</h2><p>Decide who answers enquiries, how quickly, and what happens after the site visit. Leads go cold when nobody owns the next step.</p>
<p>Planning a launch? <a href="/contact"><u>Talk to our team</u></a>.</p>`,
  },
  {
    slug: 'whatsapp-follow-up-routine-for-leads',
    category: 'Lead Generation',
    date: '28 October 2026',
    isoDate: '2026-10-28',
    title: 'A Simple WhatsApp Follow-Up Routine That Stops Leads Going Cold',
    summary: 'Getting leads is only half the job. A short, steady follow-up routine is what turns them into customers.',
    image: '/assets/images/web-devs.jpg',
    imageAlt: 'A team reviewing leads on screen',
    readTime: '4 min read',
    body: `<p>Many businesses pay for leads and then reply late. A simple routine fixes most of that.</p><figure class="inline-fig"><img src="/assets/images/performance.jpg" alt=""></figure>
<h2>Reply fast, and say something useful</h2><p>Answer in the first working hour if you can. Greet the person by name and answer their question before asking your own.</p>
<h2>Keep a short sequence</h2><ul><li>Day one: reply and share the key details.</li><li>Day three: a gentle check-in with one helpful link or photo.</li><li>Day seven: a clear offer or next step.</li></ul>
<h2>Track every lead in one place</h2><p>Use a CRM or even a shared sheet so nobody is guessing who spoke to whom. Note the date of the next follow-up every time.</p>
<p>Need help setting this up? <a href="/contact"><u>Book a brand review</u></a>.</p>`,
  },
];
