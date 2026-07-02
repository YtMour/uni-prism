import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve('dist/build/h5')
const indexPath = resolve(distDir, 'index.html')

if (!existsSync(indexPath)) {
  throw new Error('Missing dist/build/h5/index.html. Run npm run build:h5 before smoke:h5.')
}

const indexHtml = readFileSync(indexPath, 'utf8')
const assetDir = resolve(distDir, 'assets')
const assetFiles = existsSync(assetDir) ? readdirSync(assetDir) : []
const jsAsset = assetFiles.find((file) => /^index-.*\.js$/.test(file))
const cssAsset = assetFiles.find((file) => /^index-.*\.css$/.test(file))

if (!jsAsset) throw new Error('Missing compiled index JS asset')
if (!cssAsset) throw new Error('Missing compiled index CSS asset')

const bundle = readFileSync(resolve(assetDir, jsAsset), 'utf8')
const css = readFileSync(resolve(assetDir, cssAsset), 'utf8')

const requiredBundleText = [
  'Startup Name Generator',
  'Generate names',
  'data-testid',
  'generate-button',
  'candidate-card',
  'detail-sheet',
  'detail-preview',
  'result-count-control',
  'result-count-decrease',
  'result-count-increase',
  'seed-toggle',
  'readability-toggle',
  'score-toggle',
  'language-control',
  'language-select',
  'privacy-link',
  'disclaimer-link',
  'legal-screen',
  'preview-screen',
  'whiteboard-screen',
  'settings-screen',
  'Privacy policy',
  'Disclaimer',
  '简体中文',
  '繁體中文',
  'Español',
  '日本語',
  'Português (Brasil)',
  'العربية',
  '隐私政策',
  '免责声明',
  '不会出售',
  '按现状',
  'Creative suggestion only',
  'does not sell',
  'as-is',
  'SaaS compound',
  'Coined word',
  'Action phrase',
  'formula-line',
  'Show score details',
  'Filter hard-to-read names'
]

for (const text of requiredBundleText) {
  if (!bundle.includes(text)) {
    throw new Error(`H5 bundle smoke missing text: ${text}`)
  }
}

const requiredCssText = [
  '.app-frame',
  '.candidate-card',
  '.detail-sheet',
  'max-width:430px',
  '.control-hint',
  '.preview-card',
  '.stepper',
  '.language-row',
  '.language-select',
  '.legal-card',
  '.legal-section',
  '.settings-help',
  '.formula-line'
]

const compactCss = css.replace(/\s+/g, '')
for (const text of requiredCssText) {
  const normalized = text.replace(/\s+/g, '')
  if (!compactCss.includes(normalized)) {
    throw new Error(`H5 CSS smoke missing rule/text: ${text}`)
  }
}

const requiredStaticAssets = [
  'static/app-icon.png',
  'static/logo.png',
  'static/brand-glyph.png',
  'static/empty-candidates.png',
  'static/empty-whiteboard.png',
  'static/concept-preview-panel.png',
  'static/generation-spark.png'
]

for (const asset of requiredStaticAssets) {
  if (!existsSync(resolve(distDir, asset))) {
    throw new Error(`Missing H5 static asset: ${asset}`)
  }
}

if (!indexHtml.includes('type="module"')) {
  throw new Error('H5 index does not reference a module bundle')
}

console.log('H5 smoke passed')
