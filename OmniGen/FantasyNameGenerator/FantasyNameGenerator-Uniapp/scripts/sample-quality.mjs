import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sampleGenerationQuality } from '../common/sampler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outputDir = path.join(root, 'reports')
const outputFile = path.join(outputDir, 'generation-quality.json')

const report = sampleGenerationQuality({ perRealm: 300, seedStart: 1000 })

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

console.log(`Generated ${report.total} samples.`)
console.log(`Duplicate rate: ${(report.duplicateRate * 100).toFixed(2)}%`)
console.log(`Report: ${path.relative(root, outputFile)}`)
