// Minimal HTTP helper aligned with backend. No external deps.
(() => {
  // Allow overriding API base via global config for deployments (Netlify/Vercel)
  const API_BASE = (globalThis.NS_CONFIG && globalThis.NS_CONFIG.API_BASE)
    ? globalThis.NS_CONFIG.API_BASE
    : 'http://127.0.0.1:8080';

  function token() { return localStorage.getItem('ns_token'); }

  async function request(path, opts = {}) {
    const url = path.startsWith('http') ? path : API_BASE + path;
    const headers = new Headers(opts.headers || {});
    if (!headers.has('Content-Type') && !(opts.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    const tok = token();
    if (tok) headers.set('Authorization', `Bearer ${tok}`);
    const res = await fetch(url, { ...opts, headers });
    const ct = res.headers.get('content-type') || '';
    const payload = ct.includes('application/json') ? (await res.json().catch(()=>null)) : (await res.text());
    if (!res.ok) {
      // Global 401 handler: clear token and redirect to auth with return hint
      if (res.status === 401) {
        try {
          localStorage.removeItem('ns_token');
          const here = (location && location.pathname) ? location.pathname.split('/').pop() : 'index.html';
          // Avoid redirect loops from auth page
          if (!/auth\.html$/i.test(here)) {
            location.assign(`auth.html?from=${encodeURIComponent(here)}`);
          }
        } catch {}
      }
      const msg = payload && typeof payload === 'object' && payload.message ? payload.message : res.status + ' ' + res.statusText;
      throw new Error(msg);
    }
    return payload;
  }

  globalThis.NSHttp = { request, API_BASE };
})();
