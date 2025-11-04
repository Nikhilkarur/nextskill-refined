// Populate demo data on the deployed backend (Render)
// Usage: node scripts/demo-populate.mjs

const BASE_URL = 'https://nextskill-refined3.onrender.com';
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@nextskill.app';
const DEMO_PASS = process.env.DEMO_PASS || 'DemoPass123!';

async function json(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

async function signupOrSignin() {
  // Try signup first
  let res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASS })
  });
  let data = await json(res);
  if (res.ok && data.token) {
    console.log(`✅ Signed up demo user ${DEMO_EMAIL}`);
    return data.token;
  }
  // If already exists, sign in
  res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASS })
  });
  data = await json(res);
  if (!res.ok || !data.token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  console.log(`🔐 Signed in as ${DEMO_EMAIL}`);
  return data.token;
}

async function generateRoadmap(token) {
  const payload = {
    role: 'software-engineer',
    experience: 'mid',
    priority: 'skills',
    timeCommitment: '10-hours',
    // include a small signal so it persists regardless of JSON availability
    answers: { 1: 'software-engineer', 2: 'mid', 3: 'technical-skills', 4: '10-hours' }
  };
  const res = await fetch(`${BASE_URL}/api/roadmaps/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(`Generate failed: ${txt}`);
  console.log('🛠️ Generated/ensured roadmap exists (response length):', txt.length);
}

async function getRoadmapById(token, id) {
  const res = await fetch(`${BASE_URL}/api/roadmaps/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await json(res);
  if (!res.ok) throw new Error(`Get roadmap failed: ${JSON.stringify(data)}`);
  try {
    const parsed = JSON.parse(data.contentJson || '{}');
    console.log('🧩 Roadmap title:', parsed.title || '(no title)', '• phases:', (parsed.phases||[]).length);
  } catch {}
  return data;
}

async function dashboard(token) {
  const res = await fetch(`${BASE_URL}/api/users/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await json(res);
  if (!res.ok) throw new Error(`Dashboard failed: ${JSON.stringify(data)}`);
  console.log('📊 Dashboard redirectTo:', data.redirectTo, 'totalRoadmaps:', data.totalRoadmaps);
  return data;
}

(async function run(){
  try {
    console.log('🚀 Preparing demo data on Render...');
    const token = await signupOrSignin();
    await generateRoadmap(token);
    const dash = await dashboard(token);
    if (dash?.latestRoadmap?.id) {
      await getRoadmapById(token, dash.latestRoadmap.id);
    }
    console.log('\n✅ Demo ready. In the browser:');
    console.log('- Open https://quiet-gelato-770810.netlify.app/auth.html');
    console.log(`- Sign in with ${DEMO_EMAIL} / ${DEMO_PASS}`);
    console.log('- You will be redirected to roadmap.html and can show the stored roadmap.');
  } catch (e) {
    console.error('❌ Demo setup failed:', e.message);
  }
})();
