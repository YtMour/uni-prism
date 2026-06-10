import { exportExtension, getFullFrameCaptionLayout } from './compositionModel.js'
import { measureComposition } from './uniCanvasRenderer.js'

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error('Image failed to load'))
		image.src = src
	})
}

function drawImageCover(ctx, image, x, y, width, height) {
	const sourceWidth = Number(image.naturalWidth || image.width)
	const sourceHeight = Number(image.naturalHeight || image.height)
	const sourceRatio = sourceWidth / sourceHeight
	const targetRatio = width / height
	let sx = 0
	let sy = 0
	let sw = sourceWidth
	let sh = sourceHeight

	if (sourceRatio > targetRatio) {
		sw = sourceHeight * targetRatio
		sx = (sourceWidth - sw) / 2
	} else {
		sh = sourceWidth / targetRatio
		sy = (sourceHeight - sh) / 2
	}

	ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height)
}

function applyFittedFont(ctx, text, fontSize, maxWidth, family = 'Georgia, "Times New Roman", serif') {
	let fitted = fontSize
	ctx.font = `${fitted}px ${family}`
	while (fitted > 16 && ctx.measureText(text).width > maxWidth) {
		fitted -= 2
		ctx.font = `${fitted}px ${family}`
	}
	return fitted
}

function drawFittedText(ctx, text, x, y, maxWidth, fontSize, options = {}) {
	if (!text) return
	ctx.fillStyle = options.color || '#1A2A3A'
	ctx.textAlign = options.align || 'center'
	ctx.textBaseline = 'middle'
	applyFittedFont(ctx, text, fontSize, maxWidth)
	ctx.fillText(text, x, y, maxWidth)
}

function drawWatermark(ctx, model, width, height) {
	const offset = Math.round(18 + model.watermark.offset * 0.8)
	const size = Math.round(28 + model.watermark.size * 0.7)
	const anchor = model.watermark.anchor
	let x = width / 2
	let y = height - offset
	let align = 'center'

	if (anchor.includes('left')) {
		x = offset
		align = 'left'
	}
	if (anchor.includes('right')) {
		x = width - offset
		align = 'right'
	}
	if (anchor.startsWith('top')) y = offset
	if (anchor.startsWith('middle')) y = height / 2

	ctx.save()
	ctx.globalAlpha = model.watermark.opacity / 100
	ctx.fillStyle = '#F9F7F2'
	ctx.textAlign = align
	ctx.textBaseline = 'middle'
	const maxTextWidth = width * 0.76
	if (model.text.showWatermarkName) {
		applyFittedFont(ctx, model.text.watermark, size, maxTextWidth)
		ctx.fillText(model.text.watermark, x, y, maxTextWidth)
	}
	if (model.text.showMetadataLine) {
		applyFittedFont(ctx, model.text.caption, Math.max(18, Math.round(size * 0.45)), maxTextWidth)
		ctx.fillText(model.text.caption, x, y + size * 0.85, maxTextWidth)
	}
	ctx.restore()
}

function drawComposition(ctx, model, image, size) {
	const ratio = Number(image.naturalWidth || image.width) / Number(image.naturalHeight || image.height)
	const width = size.width
	const matColor = model.frame.matColor || '#F9F7F2'

	if (model.mode === 'inPhoto') {
		const height = Math.round(width / ratio)
		drawImageCover(ctx, image, 0, 0, width, height)
		drawWatermark(ctx, model, width, height)
		return
	}

	if (model.mode === 'bottomBand') {
		const photoHeight = Math.round(width / ratio)
		const bandHeight = Math.round(width * (model.frame.bandHeight / 100))
		drawImageCover(ctx, image, 0, 0, width, photoHeight)
		ctx.fillStyle = matColor
		ctx.fillRect(0, photoHeight, width, bandHeight)
		const align = String(model.frame.alignment || 'Center').toLowerCase()
		const textX = align === 'left' ? width * 0.12 : align === 'right' ? width * 0.88 : width / 2
		ctx.textAlign = align
		ctx.textBaseline = 'middle'
		ctx.fillStyle = model.text.color || '#1A2A3A'
		if (model.text.showMetadataLine) {
			applyFittedFont(ctx, model.text.caption, model.text.captionSize * 2, width * 0.76)
			ctx.fillText(model.text.caption, textX, photoHeight + bandHeight * 0.38, width * 0.76)
		}
		if (model.text.showWatermarkName) {
			applyFittedFont(ctx, model.text.watermark, Math.round(model.text.captionSize * 1.7), width * 0.7)
			ctx.fillText(model.text.watermark, textX, photoHeight + bandHeight * 0.72, width * 0.7)
		}
		return
	}

	const pad = Math.round(width * (0.08 + model.frame.borderValue / 1000))
	const photoWidth = width - pad * 2
	const photoHeight = Math.round(photoWidth / ratio)
	const captionHeight = Math.round(width * 0.16)
	const caption = getFullFrameCaptionLayout(model, width, pad + photoHeight, captionHeight)

	ctx.fillStyle = matColor
	ctx.fillRect(0, 0, size.width, size.height)
	ctx.strokeStyle = 'rgba(26,42,58,.16)'
	ctx.lineWidth = 2
	ctx.strokeRect(pad - 10, pad - 10, photoWidth + 20, photoHeight + 20)
	drawImageCover(ctx, image, pad, pad, photoWidth, photoHeight)

	if (model.text.showMetadataLine) {
		drawFittedText(ctx, model.text.caption, width / 2, caption.metaY, photoWidth, caption.metaSize, { color: model.text.color })
	}
	if (model.text.showWatermarkName) {
		drawFittedText(ctx, model.text.watermark, width / 2, caption.nameY, photoWidth, caption.nameSize, { color: model.text.color })
	}
}

export async function renderCompositionToDataUrl(model) {
	if (typeof document === 'undefined') {
		throw new Error('H5 canvas renderer requires document')
	}

	const image = await loadImage(model.source.src)
	const size = measureComposition(model, image)
	const canvas = document.createElement('canvas')
	canvas.width = size.width
	canvas.height = size.height
	const ctx = canvas.getContext('2d')
	drawComposition(ctx, model, image, size)

	const mime = model.export.format || 'image/jpeg'
	const sourceSize = Number(model.source && model.source.size || 0)
	let quality = mime === 'image/jpeg' ? model.export.jpegQuality / 100 : undefined
	let dataUrl = canvas.toDataURL(mime, quality)

	if (mime === 'image/jpeg' && sourceSize) {
		const maxSize = Math.max(96 * 1024, Math.round(sourceSize * 1.08))
		const candidates = [quality - 0.06, quality - 0.12, 0.74, 0.7]
			.filter(value => value >= 0.7 && value < quality)
		for (const candidate of candidates) {
			if (Math.round(dataUrl.length * 0.75) <= maxSize) break
			quality = candidate
			dataUrl = canvas.toDataURL(mime, quality)
		}
	}

	return {
		dataUrl,
		width: size.width,
		height: size.height,
		size: Math.round(dataUrl.length * 0.75),
		jpegQuality: quality ? Math.round(quality * 100) : undefined,
		fileName: `signet-${model.mode}-${size.width}px-${Date.now()}.${exportExtension(mime)}`
	}
}
