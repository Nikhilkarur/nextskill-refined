// Resume upload smoke test: signup -> upload .txt resume -> expect text extracted and saved
// BASE can be overridden via environment variable: BASE=https://your-service.onrender.com
const BASE = process.env.BASE || 'http://localhost:8080';

function uniqueEmail() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

async function jsonPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function uploadResume(filePath, token) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const file = await fs.promises.readFile(filePath);
  const filename = path.basename(filePath);
  const blob = new Blob([file], { type: 'text/plain' });
  const form = new FormData();
  form.append('file', blob, filename);

  const res = await fetch(`${BASE}/api/resumes/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return text;
}

try {
  const email = uniqueEmail();
  console.log('Signing up:', email);
  const signup = await jsonPost(`${BASE}/api/auth/signup`, { email, password: 'P@ssw0rd!' });
  if (!signup?.token) throw new Error('No token in signup response');

  const { fileURLToPath } = await import('node:url');
  const resumeUrl = new URL('./sample-resume.txt', import.meta.url);
  const resumePath = fileURLToPath(resumeUrl);
  console.log('Uploading resume:', resumePath);
  const result = await uploadResume(resumePath, signup.token);
  console.log('UPLOAD_OK:', result);
  console.log('RESUME_SMOKE_OK');
} catch (err) {
  console.error('RESUME_SMOKE_FAIL:', err.message);
  process.exit(1);
}
