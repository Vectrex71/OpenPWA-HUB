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
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

console.log(`🚀 Processing submission for "${appName}" (${appId}) from Issue #${issueNumber}...`);

function runCommand(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...options });
  } catch (err) {
    const stdout = err.stdout?.toString() || '';
    const stderr = err.stderr?.toString() || '';
    console.error(`❌ Command failed: ${cmd}\n${stderr}\n${stdout}`);
    throw err;
  }
}

try {
  // Configure git identity
  runCommand('git config --global user.name "github-actions[bot]"');
  runCommand('git config --global user.email "github-actions[bot]@users.noreply.github.com"');

  // Authenticate origin remote with GITHUB_TOKEN
  if (token && repo) {
    runCommand(`git remote set-url origin https://x-access-token:${token}@github.com/${repo}.git`);
  }

  // Try creating a Pull Request branch
  let prCreated = false;
  let prUrl = '';

  try {
    runCommand(`git checkout -b "${branch}"`);
    runCommand(`git add apps/${appId}.json`);
    runCommand(`git commit -m "feat(pwa): add ${appName} from #${issueNumber}"`);
    runCommand(`git push -u origin "${branch}" --force`);

    // Write PR body
    const prBody = [
      `Automated submission from Issue #${issueNumber}.`,
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

    prUrl = runCommand(
      `gh pr create --title "🚀 [PWA Submission]: Add ${appName}" --body-file pr_body.txt --head "${branch}" --base main`
    ).trim();

    prCreated = true;
    console.log(`✅ Pull Request created: ${prUrl}`);

    // Comment on issue
    const commentBody = [
      '🎉 **Automated Pull Request Created!**',
      '',
      `A Pull Request has been automatically created for **${appName}**:`,
      `👉 ${prUrl}`,
      '',
      "Maintainer: Simply click the green **'Merge pull request'** button to publish this PWA to OpenPWA Hub!",
    ].join('\n');

    fs.writeFileSync('issue_comment.txt', commentBody, 'utf8');
    runCommand(`gh issue comment "${issueNumber}" --body-file issue_comment.txt`);
  } catch (prErr) {
    console.warn('⚠️ Pull Request creation failed. Falling back to direct commit to main...', prErr.message);

    // Fallback: commit directly to main
    try {
      runCommand('git checkout main');
      runCommand(`git add apps/${appId}.json`);
      runCommand(`git commit -m "feat(pwa): add ${appName} from #${issueNumber} [skip ci]" || true`);
      runCommand('git push origin main');
      console.log(`✅ Fallback: App ${appName} committed directly to main!`);

      // Comment on issue
      runCommand(`gh issue comment "${issueNumber}" --body "✅ **PWA successfully added!** The configuration for **${appName}** has been merged into \`main\` and will be deployed live shortly."`);
      runCommand(`gh issue close "${issueNumber}"`);
    } catch (fallbackErr) {
      console.error('❌ Direct push to main also failed. Please check repository Actions permissions (Settings > Actions > General > Workflow permissions: Read and write permissions).');
      throw fallbackErr;
    }
  }

  // Cleanup temporary files
  if (fs.existsSync('pr_body.txt')) fs.unlinkSync('pr_body.txt');
  if (fs.existsSync('issue_comment.txt')) fs.unlinkSync('issue_comment.txt');
} catch (err) {
  console.error('Workflow error:', err.message);
  process.exit(1);
}
