const DEFAULT_MONITOR_URL = 'https://syn-labs-monitor.ai.studio/api/hit';
const SERVICE_ID = 'openpwa-hub';
const SESSION_KEY = `synlabs_wake_sent:${SERVICE_ID}`;

function getHitEndpoint(): string | null {
  const configured = import.meta.env.VITE_MONITOR_URL;
  const rawBase =
    configured !== undefined ? String(configured).trim() : DEFAULT_MONITOR_URL;

  if (!rawBase) {
    return null;
  }

  const normalized = rawBase.replace(/\/+$/, '');
  return normalized.endsWith('/api/hit') ? normalized : `${normalized}/api/hit`;
}

/**
 * Sends a passive, non-blocking wake beacon to the Syn-Labs TV Dashboard
 * once per browser session (throttled via sessionStorage).
 */
export function sendWakeBeacon(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const endpoint = getHitEndpoint();
  if (!endpoint) {
    return;
  }

  try {
    if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
      return;
    }
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Ignore storage access errors (e.g. private browsing / restricted storage)
  }

  const payload = JSON.stringify({
    id: SERVICE_ID,
    event: 'wake',
  });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      // Sending a string uses text/plain;charset=UTF-8 (no CORS preflight)
      const queued = navigator.sendBeacon(endpoint, payload);
      if (queued) {
        return;
      }
    }
  } catch {
    // Fall through to fetch keepalive fallback
  }

  try {
    if (typeof fetch === 'function') {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Never disrupt the application on telemetry failure
  }
}
