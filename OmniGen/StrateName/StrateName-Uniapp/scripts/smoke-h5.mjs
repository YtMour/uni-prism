import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve('dist/build/h5')
const indexPath = resolve(dist, 'index.html')
const requiredStatic = [
  'static/app-icon.png',
  'static/brand/brand-glyph.png',
  'static/brand/empty-letterhead.png',
  'static/brand/corporate-seal.png',
  'static/templates/letterhead-bg.png',
  'static/templates/lobby-wall-bg.png',
  'static/templates/business-card-bg.png',
  'static/templates/proposal-cover-bg.png'
]

if (!existsSync(indexPath)) {
  throw new Error('dist/build/h5/index.html is missing. Run npm run build:h5 first.')
}

const indexHtml = readFileSync(indexPath, 'utf8')
if (!indexHtml.includes('assets/index-')) {
  throw new Error('Built index does not reference compiled assets.')
}

for (const file of requiredStatic) {
  const path = resolve(dist, file)
  if (!existsSync(path)) throw new Error(`Required static asset is missing: ${file}`)
  if (statSync(path).size <= 1024) throw new Error(`Required static asset is unexpectedly small: ${file}`)
}

console.log(`H5 static smoke ok: ${requiredStatic.length} runtime assets present.`)
