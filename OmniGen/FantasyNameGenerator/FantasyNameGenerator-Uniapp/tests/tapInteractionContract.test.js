import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

const interactiveFiles = [
  'components/mythos/ActionBar.vue',
  'components/mythos/AppTopbar.vue',
  'components/mythos/ExportSheet.vue',
  'components/mythos/FilterSheet.vue',
  'components/mythos/PocketSheet.vue',
  'components/mythos/RealmControl.vue',
  'components/mythos/ResultStage.vue',
  'pages/settings/settings.vue'
]

describe('tap interaction contract', () => {
  it('uses uni-app tap handlers for user touch targets', () => {
    const offenders = interactiveFiles
      .map((file) => ({
        file,
        source: fs.readFileSync(path.join(root, file), 'utf8')
      }))
      .filter(({ source }) => source.includes('@click'))
      .map(({ file }) => file)

    expect(offenders).toEqual([])
  })
})
