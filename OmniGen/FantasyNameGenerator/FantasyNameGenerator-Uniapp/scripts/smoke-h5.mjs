import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const requiredContracts = [
  ['pages/index/index.vue', '@download-svg="downloadExportSvg"'],
  ['pages/index/index.vue', '@download-png="downloadExportPng"'],
  ['pages/index/index.vue', 'downloadExportSvg()'],
  ['pages/index/index.vue', 'downloadExportPng()'],
  ['components/mythos/ActionBar.vue', 'data-testid="open-filters"'],
  ['components/mythos/ActionBar.vue', 'data-testid="open-export"'],
  ['components/mythos/AppTopbar.vue', 'data-testid="open-pocket"'],
  ['components/mythos/AppTopbar.vue', 'data-testid="open-settings"'],
  ['components/mythos/ExportSheet.vue', 'Download PNG'],
  ['components/mythos/ExportSheet.vue', 'Download SVG'],
  ['components/mythos/RealmControl.vue', 'data-testid="`realm-${realm.id}`"'],
  ['pages/settings/settings.vue', 'Privacy Policy'],
  ['pages/settings/settings.vue', 'Disclaimer']
]

const failures = requiredContracts.filter(([file, pattern]) => {
  const source = fs.readFileSync(path.join(root, file), 'utf8')
  return !source.includes(pattern)
})

if (failures.length > 0) {
  console.error('H5 smoke contract failed:')
  for (const [file, pattern] of failures) {
    console.error(`- ${file}: missing ${pattern}`)
  }
  process.exit(1)
}

console.log('H5 smoke contract passed.')
