import { spawn } from 'node:child_process';

async function waitForHealth(url: string, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const text = await res.text();
      if (res.ok && /UP/.test(text)) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 1500));
  }
  return false;
}

export default async function globalSetup() {
  const healthUrl = 'http://127.0.0.1:8080/actuator/health';
  const healthy = await waitForHealth(healthUrl, 5000);
  if (healthy) return;

  // Start backend via Maven Spring Boot plugin (background)
  const cwd = process.cwd().replace(/\\/g, '/');
  const backendDir = `${cwd}/backend`;
  // Use cmd.exe to ensure Windows compatibility
  spawn('cmd.exe', ['/c', 'mvnw.cmd', '-q', '-DskipTests', 'spring-boot:start'], {
    cwd: backendDir,
    stdio: 'ignore',
    detached: true,
  }).unref();

  const ok = await waitForHealth(healthUrl, 90000);
  if (!ok) throw new Error('Backend failed to start for tests');
}
