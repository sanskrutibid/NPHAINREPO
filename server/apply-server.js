// Careers "Apply" mail server: receives the form + resume from the website and emails it to HR.
// Run:  cd server && npm install && cp .env.example .env  (fill SMTP details)  &&  npm start
// Check it works any time:  http://YOUR-SITE/api/health   (shows "mail: ready" when the mailbox login is correct)
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// tiny .env loader (no extra package needed)
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch { /* no .env file: use real environment variables */ }

const PORT = Number(process.env.PORT || 3000);
const MAIL_TO = process.env.MAIL_TO || 'hr@phianinfotec.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465;
const FROM_USER = process.env.SMTP_USER || MAIL_TO;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 30000,
});

let mailReady = false, mailError = 'not checked yet';
const verify = () => transporter.verify().then(
  () => { mailReady = true; mailError = ''; console.log('Mail login OK. Applications go to ' + MAIL_TO); },
  e => { mailReady = false; mailError = (e && e.message) || 'unknown'; console.error('MAIL LOGIN FAILED: ' + mailError + '  (check SMTP_HOST / SMTP_USER / SMTP_PASS in server/.env)'); }
);
verify(); setInterval(verify, 10 * 60 * 1000).unref();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clean = s => String(s || '').replace(/[\r\n]+/g, ' ').trim();   // no line breaks in header fields (stops mail-header injection)
const hits = new Map(); // simple limit: 6 applications per hour per IP

const app = express();
app.set('trust proxy', 1);

app.get('/api/health', (_req, res) => res.type('text').send(mailReady ? 'ok\nmail: ready\nto: ' + MAIL_TO : 'server: ok\nmail: NOT READY - ' + mailError));

app.post('/api/apply', upload.single('resume'), async (req, res) => {
  try {
    const now = Date.now();
    const list = (hits.get(req.ip) || []).filter(t => now - t < 3600e3);
    if (list.length >= 6) return res.status(429).json({ error: 'Too many applications. Please try later.' });

    const b = req.body || {};
    if (b.website) return res.json({ ok: true }); // honeypot: bots fill this
    const name = clean(b.name).slice(0, 120), phone = clean(b.phone).slice(0, 40), email = clean(b.email).slice(0, 160);
    const position = clean(b.position).slice(0, 120) || 'General application';
    if (!name || !phone || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please fill name, phone and a valid email.' });
    const f = req.file;
    if (!f || !/\.(pdf|docx?)$/i.test(f.originalname)) return res.status(400).json({ error: 'Please attach a PDF, DOC or DOCX resume.' });
    list.push(now); hits.set(req.ip, list);

    const note = String(b.message || '').slice(0, 3000);
    const fname = f.originalname.replace(/[^\w.\- ]+/g, '_');
    const info = await transporter.sendMail({
      from: `"Phian Careers" <${FROM_USER}>`,
      to: MAIL_TO,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `Application: ${position} - ${name}`,
      text: `New job application from the website\n\nPosition: ${position}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nNote:\n${note || '-'}\n\nResume attached: ${fname}\n`,
      html: `<h3>New application: ${esc(position)}</h3><p><b>Name:</b> ${esc(name)}<br><b>Phone:</b> ${esc(phone)}<br><b>Email:</b> <a href="mailto:${esc(email)}">${esc(email)}</a></p><p><b>Note:</b><br>${esc(note || '-').replace(/\n/g, '<br>')}</p><p style="color:#666">Resume attached: ${esc(fname)}. Press Reply to answer the candidate directly.</p>`,
      attachments: [{ filename: fname, content: f.buffer }],
    });
    console.log('Application mailed to ' + MAIL_TO + ' (' + position + ' / ' + name + ') id ' + info.messageId);

    // polite receipt for the candidate (failure here never blocks the application)
    transporter.sendMail({
      from: `"Phian Infotec HR" <${FROM_USER}>`, to: email, replyTo: MAIL_TO,
      subject: `We received your application: ${position}`,
      text: `Hi ${name},\n\nThank you for applying for ${position} at Phian Infotec. Our HR team has received your resume and will get back to you soon.\n\nPhian Infotec HR\n${MAIL_TO}\n`,
    }).catch(e => console.warn('receipt not sent: ' + (e && e.message)));

    res.json({ ok: true });
  } catch (e) {
    console.error('apply failed:', e && e.message);
    res.status(500).json({ error: 'Could not send. Please email hr@phianinfotec.com.' });
  }
});

app.use((err, _req, res, _next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Resume is larger than 5 MB.' });
  res.status(500).json({ error: 'Server error.' });
});

app.listen(PORT, () => console.log('Apply server running on port ' + PORT));
