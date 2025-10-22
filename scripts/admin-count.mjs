import fs from 'node:fs/promises';

const BASE = 'http://127.0.0.1:8080';
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

function uniqueEmail() {
  return `admin-check-${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

async function ensureCreds() {
  try {
    const raw = await fs.readFile(CREDS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const email = uniqueEmail();
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
    await fs.writeFile(CREDS_PATH, JSON.stringify({ email, password }, null, 2));
    return { email, password };
  }
}

async function signin(email, password) {
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
  if (!data?.token) throw new Error('No token in signin response');
  return data.token;
}

async function userCount(token) {
  const res = await fetch(`${BASE}/api/admin/users/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Count failed: ${res.status} ${t}`);
  }
  const text = await res.text();
  // Endpoint returns a number as JSON or plain text; normalize to number
  const n = Number(text.replace(/[^0-9]/g, ''));
  if (!Number.isFinite(n)) throw new Error(`Unexpected count response: ${text}`);
  return n;
}

(async () => {
  await waitHealth();
  const { email, password } = await ensureCreds();
  const token = await signin(email, password);
  const count = await userCount(token);
  console.log(`[ADMIN] User count = ${count}`);
})();
