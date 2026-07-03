import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateNames, namingOptions } from '../src/core/generator.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const reportPath = resolve(__dirname, '../reports/manual-review-sample.json')
const markdownPath = resolve(__dirname, '../reports/manual-review-sample.md')
const signoffTemplatePath = resolve(__dirname, '../reports/manual-review-signoff.template.json')
const industries = namingOptions.industries.map((industry) => industry.id)
const styles = namingOptions.styles.map((style) => style.id)
const tones = namingOptions.tones.map((tone) => tone.id)
const lengths = namingOptions.lengths.map((length) => length.id)

const candidates = []
let seedIndex = 0
const targetPerIndustry = 25

for (const industry of industries) {
  const industryCandidates = []
  for (const style of styles) {
    for (const tone of tones) {
      for (const length of lengths) {
        const batch = generateNames({
          industry,
          style,
          tone,
          length,
          entitySuffix: 'auto',
          legalSuffix: 'none',
          count: 4,
          seed: `manual-review-${seedIndex}-${industry}-${style}-${tone}-${length}`,
          useSeed: true
        })
        seedIndex += 1
        for (const candidate of batch) {
          if (industryCandidates.length >= targetPerIndustry) break
          industryCandidates.push({
            index: 0,
            displayName: candidate.displayName,
            score: candidate.score,
            industry: candidate.industryLabel,
            style: candidate.styleLabel,
            tone: candidate.toneLabel,
            riskLevel: candidate.riskLevel,
            rationale: candidate.rationale
          })
        }
        if (industryCandidates.length >= targetPerIndustry) break
      }
      if (industryCandidates.length >= targetPerIndustry) break
    }
    if (industryCandidates.length >= targetPerIndustry) break
  }
  candidates.push(...industryCandidates)
}

candidates.forEach((candidate, index) => {
  candidate.index = index + 1
})

const report = {
  generatedAt: new Date().toISOString(),
  purpose: 'Human review queue for brand confusion, offensive wording and legal/commercial risk. This script prepares the sample; it does not mark human review complete.',
  sampleSize: candidates.length,
  targetPerIndustry,
  byIndustry: Object.fromEntries(
    industries.map((industry) => [
      namingOptions.industries.find((item) => item.id === industry)?.label || industry,
      candidates.filter((candidate) => candidate.industry === (namingOptions.industries.find((item) => item.id === industry)?.label || industry)).length
    ])
  ),
  candidates
}

const signoffTemplate = {
  status: 'not-started',
  reviewer: '',
  reviewedAt: '',
  reviewedSampleGeneratedAt: report.generatedAt,
  sampleSize: candidates.length,
  reviewedCount: 0,
  rejectedCount: 0,
  notes: [
    'Copy this file to reports/manual-review-signoff.json after human review.',
    'Set status to approved only when reviewedCount equals sampleSize and rejectedCount is 0.'
  ]
}

const markdown = [
  '# StrateName Manual Review Sample',
  '',
  'Purpose: review these 100 deterministic candidates for real-brand confusion, offensive wording and high-risk commercial/legal terms.',
  '',
  'Status: Not human-reviewed by script.',
  '',
  'Signoff workflow: copy `reports/manual-review-signoff.template.json` to `reports/manual-review-signoff.json`, then fill reviewer, reviewedAt, reviewedCount, rejectedCount and status after human review.',
  '',
  '| # | Candidate | Score | Industry | Style | Risk | Review note |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...candidates.map((candidate) => {
    return `| ${candidate.index} | ${candidate.displayName} | ${candidate.score} | ${candidate.industry} | ${candidate.style} | ${candidate.riskLevel} |  |`
  }),
  ''
].join('\n')

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
writeFileSync(markdownPath, markdown)
writeFileSync(signoffTemplatePath, `${JSON.stringify(signoffTemplate, null, 2)}\n`)

if (candidates.length !== 100) {
  throw new Error(`Manual review sample expected 100 candidates, got ${candidates.length}.`)
}
for (const [industry, count] of Object.entries(report.byIndustry)) {
  if (count !== targetPerIndustry) {
    throw new Error(`Manual review sample expected ${targetPerIndustry} candidates for ${industry}, got ${count}.`)
  }
}

console.log('Manual review sample prepared: 100 candidates, 25 per MVP industry.')
