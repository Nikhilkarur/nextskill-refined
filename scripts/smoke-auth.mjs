// Simple auth smoke test: signup -> token -> call protected endpoint
const BASE = 'http://localhost:8080';

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

async function authHeaderFetch(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

try {
  const email = uniqueEmail();
  console.log('Signing up:', email);
  const signup = await jsonPost(`${BASE}/api/auth/signup`, { email, password: 'P@ssw0rd!' });
  if (!signup?.token) throw new Error('No token in signup response');
  console.log('JWT length:', signup.token.length);

  const mine = await authHeaderFetch(`${BASE}/api/roadmaps/mine`, signup.token);
  console.log('Protected endpoint OK; roadmaps count =', Array.isArray(mine) ? mine.length : 'n/a');
  console.log('AUTH_SMOKE_OK');
} catch (err) {
  console.error('AUTH_SMOKE_FAIL:', err.message);
  process.exit(1);
}
