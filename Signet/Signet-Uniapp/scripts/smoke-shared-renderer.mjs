import { buildCompositionModel, exportExtension, getFullFrameCaptionLayout } from '../common/compositionModel.js'
import { measureComposition } from '../common/uniCanvasRenderer.js'

const baseSource = {
	src: '/static/demo-landscape.png',
	name: 'demo-landscape.jpg',
	type: 'JPG',
	size: 2431554,
	width: 4000,
	height: 3000,
	aspectLabel: 'Landscape'
}

function createModel(overrides = {}) {
	return {
		source: { ...baseSource, ...(overrides.source || {}) },
		mode: overrides.mode || 'fullFrame',
		frame: {
			matColor: '#F9F7F2',
			borderValue: 32,
			bandHeight: 20,
			alignment: 'Center',
			...(overrides.frame || {})
		},
		text: {
			watermark: 'Signet',
			metadata: [],
			caption: 'Manual  35mm  1/250s  f/2.8  200  35mm',
			captionSize: 34,
			showWatermarkName: true,
			showMetadataLine: true,
			...(overrides.text || {})
		},
		watermark: {
			anchor: 'bottom-center',
			opacity: 78,
			size: 48,
			offset: 50,
			...(overrides.watermark || {})
		},
		export: {
			width: 1600,
			format: 'image/jpeg',
			jpegQuality: 92,
			...(overrides.export || {})
		}
	}
}

const stateModel = buildCompositionModel({
	selectedPhoto: baseSource,
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
		throw new Error(`shared composition model missing ${label}`)
	}
}

if (stateModel.text.caption !== 'Manual  35mm') {
	throw new Error(`shared composition caption mismatch: ${stateModel.text.caption}`)
}

const pngName = `signet-${stateModel.mode}-${stateModel.export.width}px-test.${exportExtension(stateModel.export.format)}`
if (pngName !== 'signet-bottomBand-2400px-test.png') {
	throw new Error(`shared export naming mismatch: ${pngName}`)
}

const smallSourceModel = buildCompositionModel({
	selectedPhoto: { ...baseSource, width: 960, height: 640 },
	mode: 'fullFrame',
	selectedSwatch: '#F9F7F2',
	borderValue: 32,
	bandHeight: 20,
	alignment: 'Center',
	watermarkText: 'Signet',
	metadataFields: [],
	captionSize: 34,
	showWatermarkName: true,
	showMetadataLine: true,
	selectedAnchor: 'bottom-center',
	opacity: 78,
	markSize: 48,
	offset: 50,
	exportWidth: 1600,
	exportFormat: 'image/jpeg',
	jpegQuality: 92
})

if (smallSourceModel.export.width !== 960) {
	throw new Error(`small source should not upscale to ${smallSourceModel.export.width}`)
}

const compactSourceModel = buildCompositionModel({
	selectedPhoto: { ...baseSource, size: 121 * 1024, width: 960, height: 640 },
	mode: 'fullFrame',
	selectedSwatch: '#F9F7F2',
	borderValue: 32,
	bandHeight: 20,
	alignment: 'Center',
	watermarkText: 'Signet',
	metadataFields: [],
	captionSize: 34,
	showWatermarkName: true,
	showMetadataLine: true,
	selectedAnchor: 'bottom-center',
	opacity: 78,
	markSize: 48,
	offset: 50,
	exportWidth: 1600,
	exportFormat: 'image/jpeg',
	jpegQuality: 92
})

if (compactSourceModel.export.jpegQuality !== 80) {
	throw new Error(`compact source should export at Q80, got Q${compactSourceModel.export.jpegQuality}`)
}

const captionLayout = getFullFrameCaptionLayout(compactSourceModel, 1080, 986, 173)
if (captionLayout.metaSize > 45 || captionLayout.nameSize > 50) {
	throw new Error(`fullFrame caption typography too large: ${JSON.stringify(captionLayout)}`)
}
if (captionLayout.nameY - captionLayout.metaY < 70) {
	throw new Error(`fullFrame caption lines too tight: ${JSON.stringify(captionLayout)}`)
}

const cases = [
	['landscape fullFrame', createModel({ mode: 'fullFrame' }), { width: 4000, height: 3000 }, { width: 1600, height: 1483 }],
	['landscape inPhoto', createModel({ mode: 'inPhoto' }), { width: 4000, height: 3000 }, { width: 1600, height: 1200 }],
	['landscape bottomBand', createModel({ mode: 'bottomBand' }), { width: 4000, height: 3000 }, { width: 1600, height: 1520 }],
	['portrait fullFrame', createModel({ mode: 'fullFrame' }), { width: 2400, height: 3600 }, { width: 1600, height: 2414 }],
	['square inPhoto', createModel({ mode: 'inPhoto' }), { width: 3000, height: 3000 }, { width: 1600, height: 1600 }],
	['wide bottomBand', createModel({ mode: 'bottomBand' }), { width: 5000, height: 2500 }, { width: 1600, height: 1120 }]
]

for (const [label, model, image, expected] of cases) {
	const measured = measureComposition(model, image)
	if (measured.width !== expected.width || measured.height !== expected.height) {
		throw new Error(`${label} measured ${measured.width}x${measured.height}, expected ${expected.width}x${expected.height}`)
	}
	console.log(`${label}: ${measured.width}x${measured.height}`)
}

console.log('shared renderer smoke passed')
