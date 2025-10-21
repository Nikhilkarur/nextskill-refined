// Tiny global state manager for MPA pages; persists a few keys.
(() => {
  const KEY = 'ns_state_v1';
  const defaults = {
    auth: { token: null },
    questionnaireId: null,
    lastRoadmap: null, // { id?: number, contentJson?: string }
    uiPrefs: { roadmapView: 'galaxy' }
  };

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { ...defaults }; }
    catch { return { ...defaults }; }
  }
  function write(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function get(path) {
    const s = read();
    return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), s);
  }
  function set(path, value) {
    const s = read();
    const parts = path.split('.');
    let cur = s;
    while (parts.length > 1) { const k = parts.shift(); cur[k] = cur[k] ?? {}; cur = cur[k]; }
    cur[parts[0]] = value;
    write(s);
    return s;
  }
  function merge(path, obj) {
    const s = read();
    const parts = path.split('.');
    let cur = s;
    while (parts.length > 1) { const k = parts.shift(); cur[k] = cur[k] ?? {}; cur = cur[k]; }
    const base = cur[parts[0]];
    cur[parts[0]] = base ? { ...base, ...obj } : { ...obj };
    write(s);
    return s;
  }

  globalThis.NSState = { read, get, set, merge };
})();
