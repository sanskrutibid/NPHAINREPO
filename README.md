# Phian website (Angular)

Angular 18 version of the Phian website (all copy, styling, animations and SEO carried over from the Next.js project).

## Run
```
npm install
npm start          # http://localhost:4200   (same as: ng serve)
npm run build      # production build -> dist/phian-website/browser
```
Needs Node.js 18.19+ (20 or 22 recommended). `npm start` / `npm run build` first run `scripts/fetch-assets.mjs`
(needs internet once) to download the logo, client logos and team photos into `src/assets/images`.
If you are offline, copy your old `public/images/*` folders (`clients`, `team`, `phian-logo.png`) into `src/assets/images/`.

## Folder map (where to change what)
```
angular.json / package.json / tsconfig*.json     Angular workspace config
src/
  index.html            fonts, site-wide Organization schema
  styles.css            global design (colours, fonts, all component styling)
  robots.txt, sitemap.xml
  assets/images/        all photos, logos, team and client images
  app/
    app.component.*     shell: header + page area + footer + animation layers
    app.routes.ts       URL -> page component
    layout/header/      top bar + full-screen menu (menu links are in header.component.ts)
    layout/footer/      footer on every page
    core/               seo.service.ts, effects.service.ts (animations), site.config.ts (domain)
    pages/<page>/       ONE FOLDER PER PAGE:
        <page>.component.html   the page content (text, images, links)  <-- edit this
        <page>.component.ts     page title, meta description, schema (SEO)
        <page>.component.scss   styles for this page only
```
Pages: home, what-we-do, industries, work (+7 case studies), about, insights (+3 articles), contact, careers, method,
nagpur, kolkata, privacy, 6 pillar pages, 6 sector pages, not-found.

## Common edits
- Change a page's text/image: edit `src/app/pages/<page>/<page>.component.html`.
- Change a page's title/description: edit the `seo.set({...})` block in its `.component.ts`.
- Add a page: copy any page folder, rename the files and class, add a line in `src/app/app.routes.ts` and `src/sitemap.xml`.
- Change domain: `src/app/core/site.config.ts`, `src/sitemap.xml`, `src/robots.txt`, `src/index.html`.
- Inside HTML templates, write `&#123;` `&#125;` for `{` `}` and `&#64;` for `@` (Angular reserves them).

## Note on SEO
This is a normal Angular single-page app (content is rendered in the browser). For best Google indexing, add
server-side rendering / prerendering later with `ng add @angular/ssr`.

Items still to be verified with real facts (shown as highlighted `[placeholders]` on pages) are unchanged from the original README.

## V2 redesign (Schbang-style look and motion)
Content, routes and SEO are unchanged. What was added:
- `src/styles.css` (bottom section "V2 DESIGN LAYER"): bold type, buttons, hero, tickers, hover-list services, image sector cards, pinned horizontal work showcase, voices carousel, mega footer, new inner-page hero.
- `src/app/core/effects.service.ts`: preloader (once per session), count-up numbers, scroll-fill text (`.fill`), cursor image preview (`.srow[data-img]`), pinned horizontal scroller (`#hs`), drag carousels (`.drag`), generic marquees (`data-mq="left|right" data-speed="40s"`), card spotlight.
- `app.component.html` (preloader), `header` (announcement ticker), `footer` (big CTA + giant wordmark), `pages/home` (restructured home).
- Case cards now use real images (`src/assets/images/*`). Removed the stray duplicate folder `pages/Projects -clients`, and renamed `samira height .jpg` to `samira-height.jpg` (the page already linked to that name).

## V3 update (clean layout, images everywhere, no tilted strips)
- Removed the tilted yellow ticker strips on Home, Work, About and Projects & Clients (the thin announcement line above the header is unchanged).
- Headline spacing fixed (no squeezed or overlapping letters) in the "V3 LAYER" at the bottom of `src/styles.css`.
- Header and footer now use the same container width as the page, so logo, menu and footer columns line up with the content.
- Footer: giant "phian" outline wordmark removed; contact details moved into their own aligned row.
- Every card, step, stage, principle and info column has an image. Topic artwork is in `src/assets/images/art/` (`<topic>-ink|gold|vio.svg`); real photos are reused for sectors, work and office blocks.
- New motion in `effects.service.ts`: image wipe-reveal, heading word-mask reveal, 3D card tilt (on top of the existing preloader, smooth scroll, cursor, page curtain, pinned horizontal work, marquees, magnetic buttons).

## V4
Compact thumbnails in all cards/columns (no tall images), shorter photo bands, ink page-transition curtain with the Phian mark, hero mouse parallax, magnetic header buttons, footer link underline wipe. Styles: bottom of `src/styles.css`.

## V5
- Header: all pages are in one horizontal row (dropdowns for What we do, Industries, About); the Menu button only appears on small screens.
- Removed the "[Headline result]" placeholder from every card (cards now show the client name with a small descriptor).
- Preloader no longer shows a counter. Hero numbers no longer count up on load.
- Clients: Mehfil-e-Khas and Ashper Group of Hotels removed from the client list; logo grid aligned.
- Insights: image on every card, 3 extra blog posts in `src/app/core/blog.data.ts` (drafts: please review the text).
- About: director card with Dev Ghosh's photo.
- Home: scrambled-letter "PHIAN INFOTEC" banner (`canvas.ascii`, code in `effects.service.ts` method `ascii`); columns drift up and down while scrolling.

## V6
- Client logos are full colour all the time (no grey filter, no change on hover).
- Every section that had no picture now ends with a photo banner; insight articles and blog posts have pictures inside the text too.
- Buttons roll their text on hover; image reveal is now a soft fade-and-rise.
- About page: director card + photo gallery. To add more photos of Dev Ghosh (for example from his LinkedIn profile, saved by you), copy them to `src/assets/images/team/` as `dev-2.jpg` and `dev-3.jpg`. Until the files exist those two tiles hide themselves.

## V7
- About page: removed the wide two-photo band and the "Dev Ghosh, Founder & CEO" gallery (director card in the founder section stays).
- All pages: page-enter animation for hero text, current page lifts away on navigation, hero content fades while scrolling, text-decode effect on nav links and text links.

## V8
- Removed the Ashper Group of Hotels project (card, page, route, sitemap).
- Smaller custom cursor.
- New effects: section headings glide sideways on scroll, footer headline sweeps from dark to white on hover.

## V9
- Fixed a broken photo link on Search and Intelligence (the blank band) and on Media and Performance.
- Cursor is smaller; footer photos are one straight row; card columns drift only slightly; cards have equal height with full-fit images; removed the picture from the "Your sector not listed?" box.

## V10 (home)
- Rotating "Scroll to explore" badge in the hero; photo band grows from a rounded card to full width on scroll; all marquees speed up when you scroll fast.

## V11
- Cards that had no photo (Real Estate, Web/Tech and other related-work lists) now have one; removed the "Scroll to explore" badge and the "35+ global awards" figure from Home; Method columns are aligned (no more up/down drift there) and the Home method steps animate in one by one.

## V13 changes (home page)
- Removed the "What we do" puzzle section.
- Hero is now a full-screen slider (`#sl` in `pages/home/home.component.html`): slide 1 = brand intro + H1, slides 2-7 = case studies.
  Each slide is one `<article class="sl-s" data-th="ink|gold|violet|paper">` block. Add/remove blocks to change slides.
  Transition (stepped wipe, content parallax, dim, word-mask headline) lives in `core/effects.service.ts` -> "HOME HERO SLIDER"; styles at the end of `styles.css`.
- "What defines us" restyled (white layout, drawn arrow, circle band, scrambling headline).
- Header: a discipline word keeps rotating next to the logo (desktop >= 1360px). Edit the words in `effects.service.ts` (`WORDS`).

## v32 changes (client logos)
- All 38 client logos are now drawn in code (no image files), same style for every client, one charcoal colour. Edit a client in `core/clients.data.ts`.

## v31 changes (client logos)
- 23 client logos are the real logos, cleaned (transparent background, 6x upscaled, sharp dark edges). 15 whose source image was unreadable are drawn in code instead. In `clients.data.ts` a client with `img` uses the file in `assets/images/clients`, otherwise the code-drawn mark. To replace one with an original SVG/PNG from the client, drop it in that folder and set `img`.

## v30 changes (client logos)
- All client logos are now drawn in code (`src/app/shared/brand-logo`, data in `core/clients.data.ts`): no image files, always sharp, full colour. To add or edit a client, change one line in `clients.data.ts`.

## v20 changes (home page)
- "Everything your brand needs" is now a big service list: soft-yellow highlight row, other rows dim, tilted photo follows the cursor.

## v19 changes (home page)
- Clients: every client from the Projects and Clients list, shown in black & white on a uniform grid (src/app/core/clients.data.ts is the single list). Missing logos are downloaded by `npm start` (scripts/fetch-assets.mjs) or loaded from phianinfotec.com; no logo -> the client name.
- Solution columns: smoother grid-based open transition with hover intent.

## v18 changes (home page)
- Removed the top hero section (intro slide, stats, buttons, slider logic). The page now opens on the solutions section; a hidden h1 stays for SEO.

## v17 changes (home page)
- Removed from home: tagline marquee, "We Ideate" section, "Moments from our work" gallery, studio photo band.
- Hero is now the brand intro only; the 6 case-study slides moved to their own slider directly above the sector cards / "Work that moved the numbers".
- Solutions: expanding columns in the site theme colours (marigold, ink, violet), aligned to the page grid.
- Clients: borderless logo grid (rows drift on scroll) + outlined client-name marquee.

## Careers: Apply form (sends resume to HR email)
The Apply button on /careers opens a form (name, phone, email, note, resume). The website posts it to `/api/apply`,
and `server/apply-server.js` emails it to hr@phianinfotec.com with the resume attached (reply goes to the applicant).
```
cd server
npm install
cp .env.example .env     # fill SMTP_USER / SMTP_PASS (the mailbox that sends the mail)
npm start                # runs on port 3000
```
- Local testing: run the server above, then `npm start` in the main folder (proxy.conf.json forwards /api to port 3000).
- On the VPS: keep the server running (pm2 start server/apply-server.js --name phian-apply) and in nginx add
  `location /api/ { proxy_pass http://127.0.0.1:3000; client_max_body_size 6m; }`
- If the server is not running, the form shows a button that opens an email to HR instead.

## v51 changes
- Home showreel: the whole video is always visible (never cropped) on laptop and phone; "Full screen" button added.
- About: Sanskruti Bidwai (Web Developer) added (`src/assets/images/team/sanskruti.jpg`).
- Footer: compact aligned grid (desktop, tablet, phone).
- 404 page: phone-friendly; old links (`/index.html`, `/about-us`, `/contact-us`, `/about.html` ...) redirect to the right page (list in `src/app/app.routes.ts`).
  Hosting must send every address to index.html: `src/.htaccess` (Apache/Hostinger) or `nginx.conf.example` (VPS) are included.
- Cursor: appears on first move, hides when leaving the window, normal cursor inside forms.
- Careers mail to HR: tries 1) Node server `/api/apply`, 2) `apply.php`, 3) FormSubmit, and only says "sent" when delivery is confirmed.
  Otherwise it shows an "Email HR directly" button. Check the Node server at `/api/health`. Candidates also get a receipt email.
  Node server: `cd server && npm install && cp .env.example .env` (put the hr@phianinfotec.com password) `&& npm start`.
  PHP hosting (no Node): `apply.php` is copied into the build next to index.html; nothing else to set up (set `$HR_EMAIL` in it if needed). Not tested here.

## v52 changes
- Showreel is full screen: edge to edge, as tall as the screen under the header, whole video visible (dark sides on wide screens). Phone: full width. Full screen button kept.
- Footer: top links and contact row sit on the same 5 column lines.
- v57: Home has TWO showreel videos. Laptop/desktop plays assets/video/phian-showreel.mp4 (16:9). Phones (iPhone + Android) play assets/video/phian-showreel-mobile.mp4 (9:16, 720x1280, H.264, faststart). Only the video for the device is loaded.
- v57: Client logo 'Ranglis Academy' replaced by 'The Rankers Academy' (src/app/core/clients.data.ts).
- v57: Client logo 'Rangis Academy' removed.
- v58: Home banner ("Phian Infotec") transition now uses Devanagari letters instead of Latin/symbol (ASCII) characters. Font: Noto Sans Devanagari (index.html).
- v59: Devanagari banner: bolder letters, larger and brighter gold hover glow.
