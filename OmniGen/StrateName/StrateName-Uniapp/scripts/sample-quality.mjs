import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateNames, isReadableName, namingOptions } from '../src/core/generator.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const reportPath = resolve(__dirname, '../reports/generation-quality.json')
const industries = namingOptions.industries.map((industry) => industry.id)
const styles = namingOptions.styles.map((style) => style.id)
const tones = namingOptions.tones.map((tone) => tone.id)
const lengths = namingOptions.lengths.map((length) => length.id)
const sampleRounds = 10

const all = []
for (let round = 0; round < sampleRounds; round += 1) {
  for (const industry of industries) {
    for (const style of styles) {
      for (const tone of tones) {
        for (const length of lengths) {
          all.push(...generateNames({
            industry,
            style,
            tone,
            length,
            entitySuffix: 'auto',
            legalSuffix: 'none',
            count: 8,
            seed: `sample-${round}-${industry}-${style}-${tone}-${length}`,
            useSeed: true
          }))
        }
      }
    }
  }
}

const unique = new Set(all.map((candidate) => candidate.displayName.toLowerCase()))
const bannedHits = all.filter((candidate) => !isReadableName(candidate.displayName))
const averageScore = all.reduce((sum, candidate) => sum + candidate.score, 0) / all.length
const readableCount = all.length - bannedHits.length
const byIndustry = Object.fromEntries(
  industries.map((industry) => [
    industry,
    {
      sampleSize: all.filter((candidate) => candidate.industry === industry).length,
      uniqueCount: new Set(
        all
          .filter((candidate) => candidate.industry === industry)
          .map((candidate) => candidate.displayName.toLowerCase())
      ).size
    }
  ])
)

const report = {
  generatedAt: new Date().toISOString(),
  sampleRounds,
  sampleSize: all.length,
  uniqueCount: unique.size,
  duplicateInstanceRate: Number(((all.length - unique.size) / all.length).toFixed(4)),
  bannedHits: bannedHits.length,
  readabilityPassRate: Number((readableCount / all.length).toFixed(4)),
  averageScore: Number(averageScore.toFixed(2)),
  minScore: Math.min(...all.map((candidate) => candidate.score)),
  byIndustry
}

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

if (report.bannedHits > 0) {
  throw new Error(`Quality sample found ${report.bannedHits} unreadable or banned candidates.`)
}
if (report.sampleSize < 10000) {
  throw new Error(`Quality sample size ${report.sampleSize} is below MVP target 10000.`)
}
if (report.readabilityPassRate < 0.92) {
  throw new Error(`Readability pass rate ${report.readabilityPassRate} is below MVP target 0.92.`)
}
for (const [industry, summary] of Object.entries(report.byIndustry)) {
  if (summary.uniqueCount < 500) {
    throw new Error(`${industry} unique candidate count ${summary.uniqueCount} is below MVP target 500.`)
  }
}
if (report.averageScore < 78) {
  throw new Error(`Average score ${report.averageScore} is below MVP target 78.`)
}
if (report.duplicateInstanceRate >= 0.08) {
  throw new Error(`Duplicate instance rate ${report.duplicateInstanceRate} is above MVP target.`)
}

console.log(`Quality sample ok: ${report.sampleSize} candidates, avg ${report.averageScore}, duplicate rate ${report.duplicateInstanceRate}`)
