// Site-wide settings. Change SITE when you deploy to a different domain.
export const SITE = 'https://www.phianinfotec.com';

// Image used in Google / WhatsApp / LinkedIn previews when a page does not set its own image.
export const DEFAULT_SHARE_IMAGE = '/assets/images/team.jpg';

// All page images are 1376 x 768 (16:9).
export const SHARE_IMAGE_WIDTH = 1376;
export const SHARE_IMAGE_HEIGHT = 768;

// Careers: applications are emailed to HR with the resume attached. The form tries these in order:
//  1) APPLY_ENDPOINT      Node mail server  (server/apply-server.js, behind /api in nginx)
//  2) APPLY_PHP_ENDPOINT  PHP mailer        (src/apply.php, copied next to index.html on PHP hosting)
//  3) FORMSUBMIT_URL      third-party backup (needs a one-time activation email click)
// If none of them confirms delivery, the form shows a button that opens the candidate's own email app to HR.
export const APPLY_ENDPOINT = '/api/apply';
export const APPLY_PHP_ENDPOINT = '/apply.php';
export const HR_EMAIL = 'hr@phianinfotec.com';
export const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/hr@phianinfotec.com';
