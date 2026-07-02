import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const reportPath = resolve('reports/dependency-audit.json')
const npmCommand = process.env.npm_execpath || (process.platform === 'win32' ? 'npm.cmd' : 'npm')
const auditCommand = npmCommand.endsWith('.js') ? process.execPath : npmCommand
const auditArgs = npmCommand.endsWith('.js')
  ? [npmCommand, 'audit', '--json']
  : ['audit', '--json']
const allowVulnerabilities = {
  maxModerate: 4,
  maxHigh: 15,
  maxCritical: 0,
  acceptedSources: ['@dcloudio', 'vite', '@intlify', 'esbuild']
}

function runAuditJson() {
  try {
    return execFileSync(auditCommand, auditArgs, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    })
  } catch (error) {
    if (error.stdout) return error.stdout.toString()
    throw error
  }
}

function collectVulnerabilities(audit) {
  return Object.values(audit.vulnerabilities || {}).map((item) => ({
    name: item.name,
    severity: item.severity,
    isDirect: item.isDirect,
    via: (item.via || []).map((entry) => (typeof entry === 'string' ? entry : entry.name)).filter(Boolean),
    effects: item.effects || [],
    range: item.range,
    fixAvailable: item.fixAvailable
  }))
}

function isAccepted(vulnerability) {
  const text = [
    vulnerability.name,
    ...vulnerability.via,
    ...vulnerability.effects,
    JSON.stringify(vulnerability.fixAvailable || '')
  ].join(' ')
  return allowVulnerabilities.acceptedSources.some((source) => text.includes(source))
}

const audit = JSON.parse(runAuditJson())
const vulnerabilities = collectVulnerabilities(audit)
const counts = audit.metadata?.vulnerabilities || {}
const unaccepted = vulnerabilities.filter((item) => !isAccepted(item))
const status = {
  moderate: (counts.moderate || 0) <= allowVulnerabilities.maxModerate ? 'pass' : 'fail',
  high: (counts.high || 0) <= allowVulnerabilities.maxHigh ? 'pass' : 'fail',
  critical: (counts.critical || 0) <= allowVulnerabilities.maxCritical ? 'pass' : 'fail',
  acceptedSources: unaccepted.length === 0 ? 'pass' : 'fail'
}

const report = {
  generatedAt: new Date().toISOString(),
  command: 'npm audit --json',
  allowVulnerabilities,
  counts,
  status,
  vulnerabilities,
  unaccepted,
  recommendation:
    'Do not run npm audit fix --force blindly. Evaluate the uni/vite toolchain upgrade path and rerun npm run check after any dependency change.'
}

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

const failed = Object.values(status).some((value) => value !== 'pass')
if (failed) {
  console.error(JSON.stringify(status, null, 2))
  console.error(`Dependency audit report written to ${reportPath}`)
  process.exit(1)
}

console.log(`Dependency audit baseline passed. Report written to ${reportPath}`)
