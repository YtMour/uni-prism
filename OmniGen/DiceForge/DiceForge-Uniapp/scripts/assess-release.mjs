import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const diceForgeRoot = fileURLToPath(new URL('../..', import.meta.url));
const reportDir = join(diceForgeRoot, 'reports');
const h5Root = join(projectRoot, 'dist', 'build', 'h5');
const h5Index = join(h5Root, 'index.html');

function run(command) {
  const result = spawnSync(command, {
    cwd: projectRoot,
    encoding: 'utf8',
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return {
    command,
    ok: result.status === 0,
    status: result.status,
    output: `${result.stdout || ''}${result.stderr || ''}`.trim()
  };
}

const checks = [];

[
  'npm test',
  'npm run build:browser',
  'npm run build:h5',
  'npm run smoke:h5',
  'npm run audit:release'
].forEach((command) => {
  checks.push(run(command));
});

const audit = run('npm audit --json');
let auditSummary = { total: null, critical: null, high: null, moderate: null };
try {
  const report = JSON.parse(audit.output);
  auditSummary = report.metadata?.vulnerabilities || auditSummary;
} catch (error) {
  checks.push({
    command: 'parse npm audit --json',
    ok: false,
    status: 1,
    output: error.message
  });
}

const h5Built = existsSync(h5Index);
const h5Html = h5Built ? readFileSync(h5Index, 'utf8') : '';
const allChecksPass = checks.every((check) => check.ok);
const hasKnownAuditRisk = (auditSummary.high || 0) > 0 || (auditSummary.moderate || 0) > 0;

const publicReleaseBlockers = [];
if (!allChecksPass) publicReleaseBlockers.push('release gate command failed');
if (hasKnownAuditRisk) publicReleaseBlockers.push('npm audit still has known moderate/high vulnerabilities');
publicReleaseBlockers.push('manual WebView/native smoke is still required before public release');

const assessment = {
  app: 'DiceForge',
  generatedAt: new Date().toISOString(),
  status: allChecksPass ? 'h5-mvp-candidate' : 'not-ready',
  h5MvpCandidate: allChecksPass && h5Built && h5Html.includes('assets/'),
  publicReleaseReady: publicReleaseBlockers.length === 0,
  auditSummary,
  checks: checks.map((check) => ({
    command: check.command,
    ok: check.ok,
    status: check.status
  })),
  publicReleaseBlockers
};

mkdirSync(reportDir, { recursive: true });
writeFileSync(
  join(reportDir, 'mvp-release-assessment.json'),
  `${JSON.stringify(assessment, null, 2)}\n`
);

console.log(JSON.stringify(assessment, null, 2));

if (!assessment.h5MvpCandidate) {
  process.exitCode = 1;
}
