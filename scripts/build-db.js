/**
 * OpenPWA Hub - Build Database Script
 * Reads all individual app JSON files from /apps/*.json,
 * validates their schema, and compiles them into /public/database.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');
const publicDir = path.join(rootDir, 'public');
const srcDataDir = path.join(rootDir, 'src', 'data');
const targetDbFile = path.join(publicDir, 'database.json');
const fallbackDbFile = path.join(srcDataDir, 'fallbackDatabase.json');

console.log('📦 OpenPWA Hub: Baue statische PWA-Datenbank...');

// Ensure directories exist
if (!fs.existsSync(appsDir)) {
  fs.mkdirSync(appsDir, { recursive: true });
  console.log(`📁 Verzeichnis erstellt: ${appsDir}`);
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}

const files = fs.readdirSync(appsDir).filter((file) => file.endsWith('.json'));

if (files.length === 0) {
  console.warn('⚠️ Keine .json-Dateien im Ordner /apps gefunden. Leere Datenbank wird erzeugt.');
}

const apps = [];
const errors = [];
const categoriesSet = new Set();

for (const file of files) {
  const filePath = path.join(appsDir, file);
  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawContent);

    // Schema Validation
    const missing = [];
    if (!data.name || typeof data.name !== 'string') missing.push('name (string)');
    if (!data.url || typeof data.url !== 'string') missing.push('url (string)');
    if (!data.description || typeof data.description !== 'string') missing.push('description (string)');
    if (!data.category || typeof data.category !== 'string') missing.push('category (string)');
    if (!Array.isArray(data.tags)) missing.push('tags (Array)');
    if (!data.iconUrl || typeof data.iconUrl !== 'string') missing.push('iconUrl (string)');
    if (!Array.isArray(data.screenshots)) missing.push('screenshots (Array)');

    if (missing.length > 0) {
      errors.push(`❌ ${file}: Fehlende oder ungültige Pflichtfelder: ${missing.join(', ')}`);
      continue;
    }

    // Normalized App Entry
    const id = data.id || file.replace(/\.json$/, '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const normalizedApp = {
      id,
      name: data.name.trim(),
      url: data.url.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      tags: data.tags.map((t) => String(t).trim()).filter(Boolean),
      iconUrl: data.iconUrl.trim(),
      screenshots: data.screenshots.map((s) => String(s).trim()).filter(Boolean),
      youtubeVideoId: data.youtubeVideoId ? String(data.youtubeVideoId).trim() : undefined,
      featured: Boolean(data.featured),
      githubUrl: data.githubUrl ? String(data.githubUrl).trim() : undefined,
      author: data.author ? String(data.author).trim() : undefined,
      license: data.license ? String(data.license).trim() : undefined,
      addedAt: data.addedAt || new Date().toISOString().split('T')[0],
    };

    categoriesSet.add(normalizedApp.category);
    apps.push(normalizedApp);
  } catch (err) {
    errors.push(`❌ ${file}: Syntaxfehler beim Parsen von JSON: ${err.message}`);
  }
}

if (errors.length > 0) {
  console.error('\nValidierungsfehler in /apps:');
  for (const err of errors) {
    console.error(`  ${err}`);
  }
  // If there are errors, exit with 1 to fail CI/CD build before broken data is deployed
  process.exit(1);
}

// Sort apps: featured first, then alphabetically by name
apps.sort((a, b) => {
  if (a.featured === b.featured) {
    return a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
  }
  return a.featured ? -1 : 1;
});

const databasePayload = {
  meta: {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalApps: apps.length,
    featuredCount: apps.filter((a) => a.featured).length,
    categories: Array.from(categoriesSet).sort(),
  },
  apps,
};

const jsonString = JSON.stringify(databasePayload, null, 2);

fs.writeFileSync(targetDbFile, jsonString, 'utf-8');
console.log(`✅ Erfolgreich generiert: ${targetDbFile} (${apps.length} PWAs)`);

// Also save fallback in src/data for resilient bundle imports
fs.writeFileSync(fallbackDbFile, jsonString, 'utf-8');
console.log(`✅ Fallback-Kopie synchronisiert: ${fallbackDbFile}`);

console.log(`📊 Statistiken:`);
console.log(`   - Gesamte Apps: ${apps.length}`);
console.log(`   - Als 'Featured' markiert: ${databasePayload.meta.featuredCount}`);
console.log(`   - Kategorien (${databasePayload.meta.categories.length}): ${databasePayload.meta.categories.join(', ')}`);
console.log('🚀 PWA-Katalog ist bereit für GitHub Pages.');
