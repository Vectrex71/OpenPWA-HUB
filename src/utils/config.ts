/**
 * Repository and Environment Settings
 */

const STORAGE_KEY_REPO = 'openpwa_github_repo';
const DEFAULT_REPO = 'Vectrex71/OpenPWA-HUB';

export function getGitHubRepo(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_REPO);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // localStorage might be unavailable in restricted iframes
  }
  return DEFAULT_REPO;
}

export function setGitHubRepo(repo: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_REPO, repo.trim());
  } catch {
    // ignore
  }
}

/**
 * Creates a prefilled GitHub Issue URL for a new PWA submission
 */
export function createGitHubIssueUrl(repo: string, appName: string, jsonString: string): string {
  const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const title = encodeURIComponent(`[Neue PWA]: ${appName}`);
  
  const issueBody = `### 🚀 Neue PWA Einreichung: ${appName}

Vielen Dank für deinen Vorschlag! Bitte prüfe die untenstehende JSON-Konfiguration.

\`\`\`json
${jsonString}
\`\`\`

#### Checkliste für Maintainer:
- [ ] PWA ist per HTTPS erreichbar und lädt schnell
- [ ] Enthält ein gültiges Web App Manifest (\`manifest.json\`)
- [ ] Icon und Screenshots sind hochauflösend und zugänglich
- [ ] Keine bösartigen Skripte oder aufdringliche Popups

*Automatisch generiert über das OpenPWA Hub Formular.*`;

  const encodedBody = encodeURIComponent(issueBody);
  return `https://github.com/${cleanRepo}/issues/new?title=${title}&body=${encodedBody}&labels=pwa-submission,app-review`;
}

/**
 * Resolves local public assets vs external absolute URLs.
 * Ensures relative paths like 'assets/photopea-icon.png' resolve correctly
 * regardless of whether the app is hosted at root or a subpath (e.g. GitHub Pages).
 */
export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const clean = url.replace(/^\.?\//, '');
  const base = import.meta.env.BASE_URL || './';
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

/**
 * Extracts the 11-character YouTube video ID from a URL or raw ID.
 */
export function extractYouTubeId(urlOrId: string | undefined | null): string | undefined {
  if (!urlOrId) return undefined;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}
