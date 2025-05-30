const { execSync } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

try {
  // Collect changesets statss
  const random = Math.random().toString(36).slice(2, 10);
  const statusPath = `changeset-status-${random}.json`
  execSync(`npx changeset status --output "${statusPath}"`, { stdio: 'inherit' });

  // Read status
  const status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
  fs.unlinkSync(statusPath);

  console.log(status)
  let action = 'none';
  if (status.changesets && status.changesets.length > 0) {
    action = 'pr';        // PR will be created
  } else {
    action = 'publish';   // Publish

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const currentVersion = pkg.version;

    try {
      execSync(`git fetch --tags`); // fetch tags
      execSync(`git rev-parse --verify --quiet v${currentVersion}`);
      // if tag exists we don't need to call publish
      action = 'none';
    } catch (e) {}
  }

  core.setOutput('action', action); // action = 'pr' | 'publish' | 'none'
  console.log(`[determine-changeset-publish] action=${action}`);
} catch (err) {
  core.setFailed(err.message);
}
