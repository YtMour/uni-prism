import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const reportPath = resolve(root, 'reports/copy-audit.json')
const roots = ['src', 'pages', '../docs'].map((entry) => resolve(root, entry))
const extensions = new Set(['.js', '.vue', '.json', '.md'])

const riskyPatterns = [
  { id: 'domain-available', pattern: /\bdomain\s+(is\s+)?available\b/i },
  { id: 'trademark-clear', pattern: /\b(trademark|brand)\s+(is\s+)?(clear|cleared|safe)\b/i },
  { id: 'safe-to-use', pattern: /\bsafe\s+to\s+use\b/i },
  { id: 'registerable', pattern: /\bregisterable\b/i },
  { id: 'guaranteed-name', pattern: /\bguaranteed\s+(name|available|clear|registration)\b/i },
  { id: 'legal-approval', pattern: /\b(legally\s+approved|approved\s+for\s+registration)\b/i },
  { id: 'claim-availability', pattern: /\b(checks?|confirms?|verifies?)\s+(company\s+)?(registry|trademark|domain|legal)\s+availability\b/i }
]

const allowedContext = [
  /\bdoes\s+not\s+(check|verify|confirm)\b/i,
  /\bstill\s+require(s)?\s+(registry|trademark|domain|legal)\s+review\b/i,
  /\bverify\s+(registry|company registration|trademark|domain|legal)\b/i,
  /\bverification\s+(before|required|review)\b/i,
  /^-\s+[“"]?(available|registerable|safe to use|trademark clear|legally approved|guaranteed)[”"]?\s*$/i,
  /禁止.*承诺/,
  /承诺性文案/,
  /forbidden|prohibited|riskyPatterns/i
]

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walk(path)
    return extensions.has(extname(entry.name)) ? [path] : []
  })
}

const findings = []

for (const directory of roots) {
  for (const file of walk(directory)) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    lines.forEach((line, index) => {
      if (allowedContext.some((pattern) => pattern.test(line))) return
      for (const riskyPattern of riskyPatterns) {
        if (riskyPattern.pattern.test(line)) {
          findings.push({
            file: relative(root, file).replaceAll('\\', '/'),
            line: index + 1,
            rule: riskyPattern.id,
            text: line.trim()
          })
        }
      }
    })
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  scannedRoots: roots.map((entry) => relative(root, entry).replaceAll('\\', '/')),
  findings
}

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

if (findings.length) {
  const detail = findings.map((item) => `${item.file}:${item.line} [${item.rule}] ${item.text}`).join('\n')
  throw new Error(`Copy audit found risky legal or availability claims:\n${detail}`)
}

console.log(`Copy audit ok: ${roots.length} roots scanned, 0 risky claims.`)
