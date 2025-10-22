import fs from 'node:fs/promises';

// BASE can be overridden via environment variable: BASE=https://your-service.onrender.com
const BASE = process.env.BASE || 'http://127.0.0.1:8080';
const CREDS_PATH = new URL('../.persist-creds.json', import.meta.url);

async function waitHealth(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/actuator/health`);
      if (r.ok) {
        const j = await r.json();
        if (j.status === 'UP') return;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Backend health did not become UP in time');
}

async function signup() {
  await waitHealth();
  const email = `persist-${Date.now()}@test.local`;
  const password = 'Test1234!';
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Signup failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  console.log('SIGNUP_OK', { email, tokenLen: data.token?.length ?? 0 });
  await fs.writeFile(CREDS_PATH, JSON.stringify({ email, password }, null, 2));
}

async function signin() {
  await waitHealth();
  const { email, password } = JSON.parse(await fs.readFile(CREDS_PATH, 'utf-8'));
  const res = await fetch(`${BASE}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Signin failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  console.log('SIGNIN_OK', { email, tokenLen: data.token?.length ?? 0 });
}

const mode = process.argv[2];
if (mode === 'signup') signup().catch(e => { console.error(e); process.exit(1); });
else if (mode === 'signin') signin().catch(e => { console.error(e); process.exit(1); });
else {
  console.error('Usage: node scripts/persist-check.mjs signup|signin');
  process.exit(2);
}
