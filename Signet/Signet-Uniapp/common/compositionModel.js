export const DEFAULT_EXPORT_SETTINGS = {
	width: 1600,
	format: 'image/jpeg',
	jpegQuality: 86
}

export function resolveJpegQuality(state = {}, exportWidth = DEFAULT_EXPORT_SETTINGS.width) {
	const requested = Number(state.jpegQuality) || DEFAULT_EXPORT_SETTINGS.jpegQuality
	const sourceSize = Number(state.selectedPhoto && state.selectedPhoto.size || 0)
	const sourceWidth = Number(state.selectedPhoto && state.selectedPhoto.width || 0)
	const widthRatio = sourceWidth && exportWidth ? exportWidth / sourceWidth : 1

	if (sourceSize && sourceSize <= 180 * 1024) return Math.min(requested, 80)
	if (sourceSize && sourceSize <= 360 * 1024) return Math.min(requested, 82)
	if (widthRatio < 0.72) return Math.min(requested, 84)
	return requested
}

export function getFullFrameCaptionLayout(model, width, photoBottom, captionHeight) {
	const base = Number(model.text && model.text.captionSize || 34)
	return {
		metaY: photoBottom + captionHeight * 0.28,
		nameY: photoBottom + captionHeight * 0.74,
		metaSize: Math.max(24, Math.round(Math.min(base * 1.24, width * 0.041))),
		nameSize: Math.max(26, Math.round(Math.min(base * 1.32, width * 0.046)))
	}
}

export function getReadableTextColor(background = '#F9F7F2') {
	const hex = String(background || '').replace('#', '')
	if (!/^[0-9a-f]{6}$/i.test(hex)) return '#1A2A3A'
	const r = parseInt(hex.slice(0, 2), 16)
	const g = parseInt(hex.slice(2, 4), 16)
	const b = parseInt(hex.slice(4, 6), 16)
	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
	return luminance < 0.42 ? '#F9F7F2' : '#1A2A3A'
}

export function buildCompositionModel(state) {
	const metadata = state.metadataFields
		.map(field => ({ key: field.key, label: field.label, value: String(field.value || '').trim() }))
		.filter(field => field.value)

	const configuredWidth = Number(state.exportWidth) || DEFAULT_EXPORT_SETTINGS.width
	const sourceWidth = Number(state.selectedPhoto.width || 0)
	const exportWidth = sourceWidth ? Math.min(configuredWidth, sourceWidth) : configuredWidth

	return {
		source: {
			src: state.selectedPhoto.src,
			name: state.selectedPhoto.name,
			type: state.selectedPhoto.type,
			size: state.selectedPhoto.size,
			width: state.selectedPhoto.width,
			height: state.selectedPhoto.height,
			aspectLabel: state.selectedPhoto.aspectLabel
		},
		mode: state.mode,
		frame: {
			matColor: state.selectedSwatch,
			borderValue: Number(state.borderValue),
			bandHeight: Number(state.bandHeight),
			alignment: state.alignment
		},
		text: {
			watermark: state.watermarkText,
			metadata,
			caption: metadata.map(field => field.value).join('  '),
			captionSize: Number(state.captionSize),
			showWatermarkName: Boolean(state.showWatermarkName),
			showMetadataLine: Boolean(state.showMetadataLine),
			color: getReadableTextColor(state.selectedSwatch)
		},
		watermark: {
			anchor: state.selectedAnchor,
			opacity: Number(state.opacity),
			size: Number(state.markSize),
			offset: Number(state.offset)
		},
		export: {
			width: exportWidth,
			configuredWidth,
			format: state.exportFormat || DEFAULT_EXPORT_SETTINGS.format,
			jpegQuality: resolveJpegQuality(state, exportWidth)
		}
	}
}

export function exportExtension(format) {
	return format === 'image/jpeg' ? 'jpg' : 'png'
}
