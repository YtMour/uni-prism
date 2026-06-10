import { measureComposition } from '../src/canvasRenderer.js'
import { buildCompositionModel, exportExtension } from '../src/compositionModel.js'

const baseModel = {
  source: {
    src: '/demo-landscape.png',
    name: 'demo-landscape.jpg',
    type: 'JPG',
    size: 2431554,
    width: 4000,
    height: 3000,
    aspectLabel: 'Landscape'
  },
  mode: 'fullFrame',
  frame: {
    matColor: '#F9F7F2',
    borderValue: 32,
    bandHeight: 20,
    alignment: 'Center'
  },
  text: {
    watermark: 'Signet',
    metadata: [],
    caption: 'Manual  35mm  1/250s  f/2.8  200  35mm',
    captionSize: 34,
    showWatermarkName: true,
    showMetadataLine: true
  },
  watermark: {
    anchor: 'bottom-center',
    opacity: 78,
    size: 48,
    offset: 50
  },
  export: {
    width: 1600,
    format: 'image/jpeg',
    jpegQuality: 92
  }
}

const image = {
  naturalWidth: 4000,
  naturalHeight: 3000
}

const stateModel = buildCompositionModel({
  selectedPhoto: baseModel.source,
  mode: 'bottomBand',
  selectedSwatch: '#F9F7F2',
  borderValue: 32,
  bandHeight: 20,
  alignment: 'Right',
  watermarkText: 'Signet',
  metadataFields: [
    { key: 'camera', label: 'Camera', value: 'Manual' },
    { key: 'lens', label: 'Lens', value: '35mm' }
  ],
  captionSize: 34,
  showWatermarkName: true,
  showMetadataLine: true,
  selectedAnchor: 'bottom-center',
  opacity: 78,
  markSize: 48,
  offset: 50,
  exportWidth: 2400,
  exportFormat: 'image/png',
  jpegQuality: 92
})

const requiredPaths = [
  ['source.width', stateModel.source.width],
  ['mode', stateModel.mode],
  ['frame.alignment', stateModel.frame.alignment],
  ['text.caption', stateModel.text.caption],
  ['watermark.anchor', stateModel.watermark.anchor],
  ['export.width', stateModel.export.width],
  ['export.format', stateModel.export.format]
]

for (const [label, value] of requiredPaths) {
  if (value === undefined || value === null || value === '') {
    throw new Error(`composition model missing ${label}`)
  }
}

if (stateModel.text.caption !== 'Manual  35mm') {
  throw new Error(`composition caption mismatch: ${stateModel.text.caption}`)
}

const pngName = `signet-${stateModel.mode}-${stateModel.export.width}px-test.${exportExtension(stateModel.export.format)}`
if (pngName !== 'signet-bottomBand-2400px-test.png') {
  throw new Error(`export naming mismatch: ${pngName}`)
}

const cases = [
  ['fullFrame', { width: 1600, height: 1483 }],
  ['inPhoto', { width: 1600, height: 1200 }],
  ['bottomBand', { width: 1600, height: 1520 }]
]

for (const [mode, expected] of cases) {
  const measured = measureComposition({ ...baseModel, mode }, image)
  if (measured.width !== expected.width || measured.height !== expected.height) {
    throw new Error(`${mode} measured ${measured.width}x${measured.height}, expected ${expected.width}x${expected.height}`)
  }
  console.log(`${mode}: ${measured.width}x${measured.height}`)
}

console.log('renderer smoke passed')
