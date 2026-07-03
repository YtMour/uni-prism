import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  evaluateManualReviewGate,
  summarizeDependencyAudit
} from './release-gates.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const reportPath = resolve(root, 'reports/mvp-assessment.json')
const markdownPath = resolve(root, 'reports/mvp-assessment.md')

function readJson(relativePath) {
  const path = resolve(root, relativePath)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

const quality = readJson('reports/generation-quality.json')
const copy = readJson('reports/copy-audit.json')
const a11y = readJson('reports/a11y-audit.json')
const visual = readJson('reports/visual-audit.json')
const releaseAssets = readJson('reports/release-assets-audit.json')
const interaction = readJson('reports/interaction-smoke.json')
const deps = readJson('reports/dependency-audit.json')
const manualSample = readJson('reports/manual-review-sample.json')
const manualSignoff = readJson('reports/manual-review-signoff.json')
const dependencyRisk = deps ? summarizeDependencyAudit(deps) : null

const gates = [
  {
    id: 'quality',
    status: quality?.sampleSize >= 10000 && quality?.duplicateInstanceRate < 0.08 && quality?.bannedHits === 0 ? 'pass' : 'fail',
    detail: quality ? `${quality.sampleSize} candidates, duplicate ${quality.duplicateInstanceRate}, banned ${quality.bannedHits}` : 'missing report'
  },
  {
    id: 'copy',
    status: copy?.findings?.length === 0 ? 'pass' : 'fail',
    detail: copy ? `${copy.findings.length} risky claims` : 'missing report'
  },
  {
    id: 'a11y',
    status: a11y?.findings?.length === 0 ? 'pass' : 'fail',
    detail: a11y ? `${a11y.findings.length} findings` : 'missing report'
  },
  {
    id: 'visual',
    status: visual?.findings?.length === 0 ? 'pass' : 'fail',
    detail: visual ? `${visual.findings.length} findings` : 'missing report'
  },
  {
    id: 'release-assets',
    status: releaseAssets?.findings?.length === 0 ? 'pass' : 'fail',
    detail: releaseAssets ? `${releaseAssets.findings.length} findings` : 'missing report'
  },
  {
    id: 'interaction-smoke',
    status: interaction?.checkpoints?.length >= 6 && interaction?.consoleIssues?.length === 0 ? 'pass' : 'fail',
    detail: interaction ? `${interaction.checkpoints.length} checkpoints, ${interaction.consoleIssues.length} console issues` : 'missing report'
  },
  {
    id: 'manual-review-sample',
    status: manualSample?.sampleSize === 100 ? 'prepared' : 'fail',
    detail: manualSample ? `${manualSample.sampleSize} candidates prepared, human review not complete` : 'missing report'
  },
  evaluateManualReviewGate(manualSample, manualSignoff),
  {
    id: 'dependency-audit',
    status: dependencyRisk?.status || 'fail',
    detail: dependencyRisk
      ? `${dependencyRisk.counts.moderate} moderate, ${dependencyRisk.counts.high} high, ${dependencyRisk.counts.critical} critical; direct ${dependencyRisk.directPackages.join(', ') || 'none'}; major fix ${dependencyRisk.semverMajorRequired ? 'required' : 'not required'}`
      : 'missing report'
  },
  {
    id: 'legal-review',
    status: 'blocked',
    detail: 'Requires human legal/trademark/privacy review before public release.'
  }
]

const blockers = gates.filter((gate) => ['fail', 'blocked'].includes(gate.status))
const risks = gates.filter((gate) => gate.status === 'risk')
const assessment = blockers.length
  ? 'not-public-release-ready'
  : risks.length
    ? 'engineering-candidate-with-risk'
    : 'release-candidate'

const report = {
  generatedAt: new Date().toISOString(),
  assessment,
  gates,
  blockers: blockers.map((gate) => gate.id),
  risks: risks.map((gate) => gate.id)
}

const markdown = [
  '# StrateName MVP Assessment',
  '',
  `Assessment: ${assessment}`,
  '',
  '| Gate | Status | Detail |',
  '| --- | --- | --- |',
  ...gates.map((gate) => `| ${gate.id} | ${gate.status} | ${gate.detail} |`),
  '',
  `Blockers: ${report.blockers.length ? report.blockers.join(', ') : 'None'}`,
  '',
  `Risks: ${report.risks.length ? report.risks.join(', ') : 'None'}`,
  ''
].join('\n')

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
writeFileSync(markdownPath, markdown)

if (gates.some((gate) => gate.status === 'fail')) {
  throw new Error(`MVP assessment has failing automated gates: ${gates.filter((gate) => gate.status === 'fail').map((gate) => gate.id).join(', ')}`)
}

console.log(`MVP assessment written: ${assessment}.`)
