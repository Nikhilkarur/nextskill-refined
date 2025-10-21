// Basic backend performance timings for key endpoints
const BASE = 'http://localhost:8080';

function uniqueEmail() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

async function timeIt(label, fn) {
  const t0 = performance.now();
  const res = await fn();
  const t1 = performance.now();
  const ms = Math.round(t1 - t0);
  console.log(`${label}: ${ms} ms`);
  return { ms, res };
}

async function jsonPost(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

try {
  const email = uniqueEmail();

  const { res: signup } = await timeIt('POST /api/auth/signup', () => jsonPost(`${BASE}/api/auth/signup`, { email, password: 'P@ssw0rd!' }));
  if (!signup?.token) throw new Error('no token');

  await timeIt('GET /api/roadmaps/mine', () => fetch(`${BASE}/api/roadmaps/mine`, { headers: { Authorization: `Bearer ${signup.token}` } }));

  const minimal = { role: 'software-engineer', experience: 'junior', priority: 'skills', time: 'part-time' };
  await timeIt('POST /api/roadmaps/generate', () => jsonPost(`${BASE}/api/roadmaps/generate`, minimal, { Authorization: `Bearer ${signup.token}` }));

  console.log('PERF_CHECK_OK');
} catch (e) {
  console.error('PERF_CHECK_FAIL:', e.message);
  process.exit(1);
}
