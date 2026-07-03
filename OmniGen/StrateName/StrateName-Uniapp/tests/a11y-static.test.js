import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const componentFiles = [
  'src/components/AppShell.vue',
  'src/components/DetailSheet.vue',
  'src/components/ProposalScreen.vue',
  'src/components/SettingsScreen.vue',
  'src/components/ShortlistScreen.vue'
]

function symbolButtonsWithoutLabels(source) {
  const matches = []
  const buttonPattern = /<button\b[\s\S]*?<\/button>/g
  for (const match of source.matchAll(buttonPattern)) {
    const button = match[0]
    const hasLabel = /\baria-label=/.test(button)
    const text = button
      .replace(/<[^>]+>/g, '')
      .replace(/\{\{[\s\S]*?\}\}/g, '')
      .replace(/\s+/g, '')
      .trim()
    if (!hasLabel && /^[^\p{L}\p{N}]{1,3}$/u.test(text)) {
      matches.push(text)
    }
  }
  return matches
}

test('symbol-only component buttons have explicit accessible labels', () => {
  const failures = []
  for (const file of componentFiles) {
    const source = readFileSync(resolve(file), 'utf8')
    const missing = symbolButtonsWithoutLabels(source)
    if (missing.length) failures.push(`${file}: ${missing.join(', ')}`)
  }

  assert.deepEqual(failures, [])
})
