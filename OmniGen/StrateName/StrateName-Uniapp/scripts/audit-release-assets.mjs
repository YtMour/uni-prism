import { existsSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist/build/h5')
const reportPath = resolve(root, 'reports/release-assets-audit.json')

const requiredSourceAssets = [
  'static/app-icon.png',
  'static/logo.png',
  'static/favicon.svg',
  'static/icons/icon-192.png',
  'static/icons/icon-512.png',
  'static/manifest.webmanifest'
]

const requiredDistAssets = requiredSourceAssets.map((item) => item)

const findings = []

function minSizeFor(file) {
  if (file.endsWith('.svg')) return 128
  if (file.endsWith('.webmanifest')) return 256
  return 256
}

function checkAsset(path, label, file) {
  if (!existsSync(path)) {
    findings.push(`Missing ${label}: ${file}`)
  } else if (statSync(path).size <= minSizeFor(file)) {
    findings.push(`${label} is unexpectedly small: ${file}`)
  }
}

for (const file of requiredSourceAssets) {
  const path = resolve(root, file)
  checkAsset(path, 'source release asset', file)
}

for (const file of requiredDistAssets) {
  const path = resolve(dist, file)
  checkAsset(path, 'built release asset', file)
}

const indexPath = resolve(dist, 'index.html')
let linkedManifestPath = resolve(dist, 'static/manifest.webmanifest')
if (!existsSync(indexPath)) {
  findings.push('dist/build/h5/index.html is missing. Run npm run build:h5 first.')
} else {
  const html = readFileSync(indexPath, 'utf8')
  const requiredHtml = [
    ['title', /<title>StrateName<\/title>/i],
    ['description', /name="description"\s+content="Boardroom-ready business name generator/i],
    ['theme-color', /name="theme-color"\s+content="#1B3B2B"/i],
    ['manifest link', /rel="manifest"\s+href="\/(?:static\/manifest\.webmanifest|assets\/manifest-[^"]+\.webmanifest)"/i],
    ['favicon link', /rel="icon"\s+href="\/(?:static\/favicon\.svg|assets\/favicon-[^"]+\.svg)"/i],
    ['apple touch icon', /rel="apple-touch-icon"\s+href="\/(?:static\/icons\/icon-192\.png|assets\/icon-192-[^"]+\.png)"/i]
  ]
  for (const [label, pattern] of requiredHtml) {
    if (!pattern.test(html)) findings.push(`Built index missing ${label}.`)
  }

  const linkedAssets = [...html.matchAll(/href="([^"]+\.(?:webmanifest|svg|png))"/gi)].map((match) => match[1])
  for (const href of linkedAssets) {
    const linkedPath = resolve(dist, href.replace(/^\//, ''))
    if (!existsSync(linkedPath)) findings.push(`Built index links missing asset: ${href}`)
    if (href.endsWith('.webmanifest')) linkedManifestPath = linkedPath
  }
}

if (existsSync(linkedManifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(linkedManifestPath, 'utf8'))
    if (manifest.name !== 'StrateName') findings.push('Web manifest name must be StrateName.')
    if (manifest.short_name !== 'StrateName') findings.push('Web manifest short_name must be StrateName.')
    if (manifest.display !== 'standalone') findings.push('Web manifest display must be standalone.')
    const iconSrcs = new Set((manifest.icons || []).map((icon) => icon.src))
    for (const icon of ['/static/icons/icon-192.png', '/static/icons/icon-512.png']) {
      if (!iconSrcs.has(icon)) findings.push(`Web manifest missing icon ${icon}.`)
    }
  } catch (error) {
    findings.push(`Web manifest is not valid JSON: ${error.message}`)
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  findings
}

mkdirSync(dirname(reportPath), { recursive: true })
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

if (findings.length) {
  throw new Error(`Release asset audit failed:\n${findings.join('\n')}`)
}

console.log('Release asset audit ok: PWA metadata and icons are present.')
