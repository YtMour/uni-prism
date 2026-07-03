import test from 'node:test'
import assert from 'node:assert/strict'

import {
  evaluateManualReviewGate,
  summarizeDependencyAudit
} from '../scripts/release-gates.mjs'

test('unsigned manual review remains a public release blocker', () => {
  const sample = {
    sampleSize: 100,
    generatedAt: '2026-07-03T00:00:00.000Z'
  }

  const gate = evaluateManualReviewGate(sample, null)

  assert.equal(gate.id, 'human-review')
  assert.equal(gate.status, 'blocked')
  assert.match(gate.detail, /100 candidates prepared/i)
})

test('approved manual review only passes after every sample candidate is reviewed', () => {
  const sample = { sampleSize: 100 }
  const partialSignoff = {
    status: 'approved',
    reviewer: 'QA',
    reviewedAt: '2026-07-03',
    reviewedCount: 87,
    rejectedCount: 0
  }

  const gate = evaluateManualReviewGate(sample, partialSignoff)

  assert.equal(gate.status, 'blocked')
  assert.match(gate.detail, /87\/100 reviewed/i)
})

test('dependency audit summary highlights direct major-upgrade risk', () => {
  const summary = summarizeDependencyAudit({
    vulnerabilities: {
      vite: {
        name: 'vite',
        severity: 'high',
        isDirect: true,
        via: ['esbuild'],
        fixAvailable: { name: 'vite', version: '8.1.3', isSemVerMajor: true }
      },
      esbuild: {
        name: 'esbuild',
        severity: 'moderate',
        isDirect: false,
        via: [{ title: 'development server exposure', severity: 'moderate' }],
        fixAvailable: true
      }
    },
    metadata: {
      vulnerabilities: {
        moderate: 1,
        high: 1,
        critical: 0,
        total: 2
      }
    }
  })

  assert.equal(summary.status, 'risk')
  assert.equal(summary.semverMajorRequired, true)
  assert.deepEqual(summary.directPackages, ['vite'])
  assert.match(summary.recommendation, /Do not run npm audit fix --force/i)
})
