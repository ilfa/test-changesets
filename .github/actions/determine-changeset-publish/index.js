const { execSync } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

try {
  // Collect changesets statss
  execSync('npx changeset status --output status.json', { stdio: 'inherit' });

  // Read status
  const status = JSON.parse(fs.readFileSync('status.json', 'utf-8'));

  console.log(status)
  // If changesets array empty — we need to run publish
  const shouldPublish = status.changesets && status.changesets.length === 0;

  core.setOutput('publish', shouldPublish ? 'true' : 'false');
  console.log(`[determine-changeset-publish] publish=${shouldPublish ? 'true' : 'false'}`);
} catch (err) {
  core.setFailed(err.message);
}
