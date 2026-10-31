/**
 * OpenPWA Hub - Process Submission Script
 * Parses a submitted GitHub Issue body, extracts the PWA JSON block,
 * validates the schema, and saves it into apps/<id>.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath || !fs.existsSync(eventPath)) {
  console.error('❌ GITHUB_EVENT_PATH not found or file does not exist.');
  process.exit(1);
}

const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const issue = eventData.issue;

if (!issue || !issue.body) {
  console.error('❌ No issue body found in event payload.');
  process.exit(1);
}

console.log(`📋 Processing Issue #${issue.number}: "${issue.title}"...`);

// Extract ```json ... ``` block from issue description
const jsonRegex = /```json\s*([\s\S]*?)\s*```/i;
const match = issue.body.match(jsonRegex);

if (!match || !match[1]) {
  console.error('❌ No ```json ``` code block found in the issue description.');
  process.exit(1);
}

let appData;
try {
  appData = JSON.parse(match[1].trim());
} catch (err) {
  console.error('❌ Failed to parse JSON code block:', err.message);
  process.exit(1);
}

// Basic Schema Validation
if (!appData.name || !appData.url || !appData.description) {
  console.error('❌ Missing required fields (name, url, or description).');
  process.exit(1);
}

const sanitizeId = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '');

const id = sanitizeId(appData.id || appData.name);
if (!id) {
  console.error('❌ Invalid or empty ID generated.');
  process.exit(1);
}

appData.id = id;

// Ensure apps directory exists
if (!fs.existsSync(appsDir)) {
  fs.mkdirSync(appsDir, { recursive: true });
}

const targetPath = path.join(appsDir, `${id}.json`);
fs.writeFileSync(targetPath, JSON.stringify(appData, null, 2) + '\n', 'utf8');

console.log(`✅ App JSON successfully written to: apps/${id}.json`);

// Set GitHub Action output variables if running in GitHub Actions
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `app_id=${id}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `app_name=${encodeURIComponent(appData.name)}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `issue_number=${issue.number}\n`);
}
