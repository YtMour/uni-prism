import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const knownVulnerablePackages = [
  '@dcloudio/uni-app',
  '@dcloudio/uni-cli-shared',
  '@dcloudio/uni-cloud',
  '@dcloudio/uni-components',
  '@dcloudio/uni-h5',
  '@dcloudio/uni-h5-vite',
  '@dcloudio/uni-push',
  '@dcloudio/uni-stat',
  '@dcloudio/vite-plugin-uni',
  '@intlify/core-base',
  '@intlify/message-compiler',
  '@intlify/message-resolver',
  '@intlify/runtime',
  '@intlify/vue-devtools',
  '@vitejs/plugin-legacy',
  '@vitejs/plugin-vue',
  '@vitejs/plugin-vue-jsx',
  'esbuild',
  'vite'
].sort();

const auditResult = spawnSync('npm audit --json', {
  encoding: 'utf8',
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe']
});
assert.ifError(auditResult.error);
const auditJson = auditResult.stdout || auditResult.stderr || '';

assert.ok(auditJson.trim(), 'npm audit --json should produce a report.');
const report = JSON.parse(auditJson);
const vulnerabilities = report.vulnerabilities || {};
const actualPackages = Object.keys(vulnerabilities).sort();

assert.deepEqual(
  actualPackages,
  knownVulnerablePackages,
  'Audit package set changed. Review new/removed advisories before releasing.'
);

const counts = report.metadata?.vulnerabilities || {};
assert.equal(counts.critical || 0, 0, 'Critical vulnerabilities are not allowed.');
assert.equal(counts.high || 0, 15, 'High vulnerability count changed; review release risk.');
assert.equal(counts.moderate || 0, 4, 'Moderate vulnerability count changed; review release risk.');
assert.equal(counts.total || 0, 19, 'Total vulnerability count changed; review release risk.');

const manifests = [
  readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'),
  readFileSync(new URL('../src/manifest.json', import.meta.url), 'utf8')
];
const blockedPermissions = [
  'android.permission.CAMERA',
  'android.permission.GET_ACCOUNTS',
  'android.permission.READ_PHONE_STATE',
  'android.permission.READ_LOGS',
  'android.permission.WRITE_SETTINGS',
  'android.hardware.camera'
];
manifests.forEach((manifest, index) => {
  blockedPermissions.forEach((permission) => {
    assert.ok(!manifest.includes(permission), `Manifest ${index + 1} should not request ${permission}.`);
  });
});

console.log('Release audit passed with known dependency risk baseline: 19 total, 15 high, 4 moderate.');
