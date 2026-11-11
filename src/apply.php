<?php
// Careers "Apply" without Node: upload this file next to index.html on PHP hosting (Hostinger etc.).
// The website tries /api/apply (Node server) first and uses /apply.php when that is not available.
// Mail goes to HR_EMAIL with the resume attached; replying answers the candidate.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$HR_EMAIL  = 'hr@phianinfotec.com';
$FROM_MAIL = 'hr@phianinfotec.com';   // must be a mailbox on your own domain, otherwise mail lands in spam

function out($code, $arr) { http_response_code($code); echo json_encode($arr); exit; }
function clean($s, $max) { return mb_substr(trim(preg_replace('/[\r\n]+/', ' ', (string)$s)), 0, $max); }

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['health'])) out(200, ['ok' => true, 'mail' => function_exists('mail') ? 'mail() available' : 'mail() disabled']);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['error' => 'POST only']);
if (!empty($_POST['website'])) out(200, ['ok' => true]);               // honeypot

// 6 applications per hour per visitor
$rl = sys_get_temp_dir() . '/phian_apply_' . md5($_SERVER['REMOTE_ADDR'] ?? 'x');
$hits = is_file($rl) ? array_filter(array_map('intval', explode(',', (string)@file_get_contents($rl))), fn($t) => $t > time() - 3600) : [];
if (count($hits) >= 6) out(429, ['error' => 'Too many applications. Please try later.']);

$name = clean($_POST['name'] ?? '', 120); $phone = clean($_POST['phone'] ?? '', 40); $email = clean($_POST['email'] ?? '', 160);
$position = clean($_POST['position'] ?? '', 120) ?: 'General application';
$note = mb_substr((string)($_POST['message'] ?? ''), 0, 3000);
if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) out(400, ['error' => 'Please fill name, phone and a valid email.']);

$f = $_FILES['resume'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) out(400, ['error' => 'Please attach a PDF, DOC or DOCX resume.']);
if ($f['size'] > 5 * 1024 * 1024) out(400, ['error' => 'Resume is larger than 5 MB.']);
if (!preg_match('/\.(pdf|docx?)$/i', $f['name'])) out(400, ['error' => 'Please attach a PDF, DOC or DOCX resume.']);
$fname = preg_replace('/[^\w.\- ]+/u', '_', $f['name']);
$data = chunk_split(base64_encode(file_get_contents($f['tmp_name'])));

$b = 'phian_' . md5(uniqid('', true));
$body  = "New job application from the website\r\n\r\nPosition: $position\r\nName: $name\r\nPhone: $phone\r\nEmail: $email\r\n\r\nNote:\r\n" . ($note !== '' ? $note : '-') . "\r\n\r\nResume attached: $fname\r\n";
$msg   = "--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$body\r\n";
$msg  .= "--$b\r\nContent-Type: application/octet-stream; name=\"$fname\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"$fname\"\r\n\r\n$data\r\n--$b--";
$headers = "From: Phian Careers <$FROM_MAIL>\r\nReply-To: " . str_replace(['"', '<', '>'], '', $name) . " <$email>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$b\"";
$subject = '=?UTF-8?B?' . base64_encode("Application: $position - $name") . '?=';

$sent = @mail($HR_EMAIL, $subject, $msg, $headers, '-f' . $FROM_MAIL) || @mail($HR_EMAIL, $subject, $msg, $headers);
if (!$sent) out(500, ['error' => 'Could not send. Please email ' . $HR_EMAIL . '.']);

$hits[] = time(); @file_put_contents($rl, implode(',', $hits));
@mail($email, 'We received your application: ' . $position, "Hi $name,\r\n\r\nThank you for applying for $position at Phian Infotec. Our HR team has received your resume and will get back to you soon.\r\n\r\nPhian Infotec HR\r\n$HR_EMAIL\r\n", "From: Phian Infotec HR <$FROM_MAIL>\r\nReply-To: $HR_EMAIL\r\nContent-Type: text/plain; charset=UTF-8");
out(200, ['ok' => true]);
