import { execSync } from 'node:child_process';
import fs from 'node:fs';

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath || !fs.existsSync(eventPath)) {
  console.log('Skipping PR creation: not in GitHub Actions.');
  process.exit(0);
}

const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const issue = eventData.issue;

if (!issue) {
  console.log('No issue found in event payload.');
  process.exit(0);
}

const issueNumber = issue.number;

// Extract JSON block
const match = issue.body?.match(/```json\s*([\s\S]*?)\s*```/i);
if (!match || !match[1]) {
  console.error('No JSON block found in issue.');
  process.exit(1);
}

let appData;
try {
  appData = JSON.parse(match[1].trim());
} catch (e) {
  console.error('Failed to parse JSON:', e);
  process.exit(1);
}

const sanitizeId = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '');

const appId = sanitizeId(appData.id || appData.name);
const appName = appData.name || appId;
const branch = `submission/issue-${issueNumber}-${appId}`;

console.log(`🚀 Creating branch & PR for "${appName}" (${appId})...`);

try {
  // Check if PR already exists
  try {
    const existingPr = execSync(`gh pr list --head "${branch}" --json number --jq '.[0].number'`, {
      encoding: 'utf8',
    }).trim();
    if (existingPr) {
      console.log(`PR #${existingPr} already exists for branch ${branch}.`);
      process.exit(0);
    }
  } catch (err) {
    // ignore
  }

  // Configure git
  execSync('git config --global user.name "github-actions[bot]"');
  execSync('git config --global user.email "github-actions[bot]@users.noreply.github.com"');

  // Checkout new branch
  execSync(`git checkout -b "${branch}"`);
  execSync(`git add apps/${appId}.json`);
  execSync(`git commit -m "feat(pwa): add ${appName} from #${issueNumber}"`);
  execSync(`git push -u origin "${branch}" --force`);

  // Write PR body to temp file to avoid all shell and YAML escaping issues
  const prBody = [
    `Automated Pull Request generated from Issue #${issueNumber}.`,
    '',
    '### Submitted App Details:',
    `- **Name:** ${appName}`,
    `- **File:** \`apps/${appId}.json\``,
    '',
    `Closes #${issueNumber}.`,
    '',
    "👉 **Maintainer Action:** Click **'Merge pull request'** to publish this PWA immediately to OpenPWA Hub!",
  ].join('\n');

  fs.writeFileSync('pr_body.txt', prBody, 'utf8');

  // Create PR
  const prUrl = execSync(
    `gh pr create --title "🚀 [PWA Submission]: Add ${appName}" --body-file pr_body.txt --head "${branch}" --base main`,
    { encoding: 'utf8' }
  ).trim();

  console.log(`✅ Pull Request created: ${prUrl}`);

  // Comment on issue
  const commentBody = [
    '🎉 **Automatischer Pull Request erstellt!**',
    '',
    `Ein Pull Request wurde automatisch für **${appName}** generiert:`,
    `👉 ${prUrl}`,
    '',
    "Klicke einfach im Pull Request auf den grünen Button **'Merge pull request'**, um die PWA in den Hub aufzunehmen!",
  ].join('\n');

  fs.writeFileSync('issue_comment.txt', commentBody, 'utf8');
  execSync(`gh issue comment "${issueNumber}" --body-file issue_comment.txt`);

  // Cleanup
  if (fs.existsSync('pr_body.txt')) fs.unlinkSync('pr_body.txt');
  if (fs.existsSync('issue_comment.txt')) fs.unlinkSync('issue_comment.txt');

  console.log('✅ Issue commented successfully.');
} catch (err) {
  console.error('Error creating PR:', err.message);
  process.exit(1);
}
