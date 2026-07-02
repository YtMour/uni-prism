import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateNames } from '../src/core/generator.js'

const styles = ['micro-saas', 'abstract', 'action-driven']
const industries = ['ai', 'devtools', 'fintech', 'creator']
const lengths = ['short', 'standard', 'descriptive']
const samplesPerCombination = 40
const candidatesPerBatch = 8

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const reportPath = resolve(rootDir, 'reports/generation-quality.json')

const names = new Map()
const structures = new Map()
const scores = []
const lengthsByMode = { short: [], standard: [], descriptive: [] }
const violations = []
let duplicateInstances = 0
let totalCandidates = 0
let batchCount = 0

for (let sample = 0; sample < samplesPerCombination; sample += 1) {
  for (const style of styles) {
    for (const industry of industries) {
      for (const length of lengths) {
        const batch = generateNames({
          style,
          industry,
          length,
          count: candidatesPerBatch,
          seed: `quality-${sample}-${style}-${industry}-${length}`
        })
        batchCount += 1
        if (batch.length !== candidatesPerBatch) {
          violations.push({
            type: 'batch-size',
            style,
            industry,
            length,
            expected: candidatesPerBatch,
            actual: batch.length
          })
        }

        for (const candidate of batch) {
          totalCandidates += 1
          scores.push(candidate.score.total)
          lengthsByMode[length].push(candidate.name.length)
          structures.set(candidate.structure, (structures.get(candidate.structure) || 0) + 1)

          const key = candidate.name.toLowerCase()
          if (names.has(key)) duplicateInstances += 1
          names.set(key, (names.get(key) || 0) + 1)

          if (length === 'short' && candidate.name.length > 10) {
            violations.push({ type: 'short-length', name: candidate.name, length: candidate.name.length })
          }
          if (length === 'descriptive' && candidate.sourceParts.length < 3) {
            violations.push({ type: 'descriptive-parts', name: candidate.name, parts: candidate.sourceParts.length })
          }
          if (candidate.score.total < 60) {
            violations.push({ type: 'low-score', name: candidate.name, score: candidate.score.total })
          }
        }
      }
    }
  }
}

const duplicateRate = duplicateInstances / Math.max(1, totalCandidates)
const averageScore = scores.reduce((sum, value) => sum + value, 0) / Math.max(1, scores.length)
const averageLength = Object.fromEntries(
  Object.entries(lengthsByMode).map(([key, values]) => [
    key,
    Number((values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length)).toFixed(2))
  ])
)

const report = {
  generatedAt: new Date().toISOString(),
  sampleConfig: {
    samplesPerCombination,
    styles,
    industries,
    lengths,
    candidatesPerBatch
  },
  metrics: {
    batchCount,
    totalCandidates,
    uniqueNames: names.size,
    duplicateInstances,
    duplicateRate: Number(duplicateRate.toFixed(4)),
    averageScore: Number(averageScore.toFixed(2)),
    passRate: Number(((totalCandidates - violations.length) / Math.max(1, totalCandidates)).toFixed(4)),
    averageLength,
    structures: Object.fromEntries(structures)
  },
  thresholds: {
    duplicateRate: 0.08,
    averageScore: 70,
    passRate: 0.98,
    sampleSize: 1000
  },
  status: {
    duplicateRate: duplicateRate <= 0.08 ? 'pass' : 'fail',
    averageScore: averageScore >= 70 ? 'pass' : 'fail',
    passRate: (totalCandidates - violations.length) / Math.max(1, totalCandidates) >= 0.98 ? 'pass' : 'fail',
    sampleSize: totalCandidates >= 1000 ? 'pass' : 'fail'
  },
  violations: violations.slice(0, 50),
  topDuplicates: [...names.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }))
}

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

const failed = Object.values(report.status).some((status) => status !== 'pass')
console.log(JSON.stringify(report.metrics, null, 2))
console.log(`Quality report written to ${reportPath}`)

if (failed) {
  console.error(JSON.stringify(report.status, null, 2))
  process.exit(1)
}
