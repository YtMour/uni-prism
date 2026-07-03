import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import {
  formatDependencyRiskMarkdown,
  summarizeDependencyAudit
} from './release-gates.mjs'

const reportPath = resolve('reports/dependency-audit.json')
const riskJsonPath = resolve('reports/dependency-risk.json')
const riskMarkdownPath = resolve('reports/dependency-risk.md')
const result = spawnSync('npm', ['audit', '--json'], {
  encoding: 'utf8',
  shell: true
})

const output = result.stdout || '{}'
mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, output)

let summary = {}
let parsed = {}
try {
  parsed = JSON.parse(output)
  summary = parsed.metadata?.vulnerabilities || {}
} catch (error) {
  throw new Error(`Unable to parse npm audit JSON: ${error.message}`)
}

const riskSummary = summarizeDependencyAudit(parsed)
writeFileSync(riskJsonPath, `${JSON.stringify(riskSummary, null, 2)}\n`)
writeFileSync(riskMarkdownPath, formatDependencyRiskMarkdown(riskSummary))

console.log(`Dependency audit report written: ${reportPath}`)
console.log(`Dependency risk report written: ${riskMarkdownPath}`)
console.log(JSON.stringify(summary))
