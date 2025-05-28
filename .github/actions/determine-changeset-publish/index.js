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
  // If changesets array empty — we need to run publish
  const shouldPublish = status.changesets && status.changesets.length === 0;

  core.setOutput('publish', shouldPublish ? 'true' : 'false');
  console.log(`[determine-changeset-publish] publish=${shouldPublish ? 'true' : 'false'}`);
} catch (err) {
  core.setFailed(err.message);
}
