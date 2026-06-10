import { getFullFrameCaptionLayout } from './compositionModel.js'

export const EXPORT_CANVAS_ID = 'signet-export-canvas'

export function measureComposition(model, image) {
	const ratio = Number(image.width || image.naturalWidth) / Number(image.height || image.naturalHeight)
	const width = model.export.width

	if (model.mode === 'inPhoto') {
		return {
			width,
			height: Math.round(width / ratio)
		}
	}

	if (model.mode === 'bottomBand') {
		const photoHeight = Math.round(width / ratio)
		return {
			width,
			height: photoHeight + Math.round(width * (model.frame.bandHeight / 100))
		}
	}

	const pad = Math.round(width * (0.08 + model.frame.borderValue / 1000))
	const photoWidth = width - pad * 2
	const photoHeight = Math.round(photoWidth / ratio)
	const captionHeight = Math.round(width * 0.16)
	return {
		width,
		height: pad + photoHeight + captionHeight + Math.round(pad * 0.65)
	}
}

function drawImageCover(ctx, src, image, x, y, width, height) {
	const sourceWidth = Number(image.width || image.naturalWidth)
	const sourceHeight = Number(image.height || image.naturalHeight)
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

	ctx.drawImage(src, sx, sy, sw, sh, x, y, width, height)
}

function estimateFittedSize(text, fontSize, maxWidth) {
	const value = String(text || '')
	if (!value) return fontSize
	const estimatedWidth = value.length * fontSize * 0.54
	if (estimatedWidth <= maxWidth) return fontSize
	return Math.max(16, Math.floor(fontSize * (maxWidth / estimatedWidth)))
}

function drawFittedText(ctx, text, x, y, maxWidth, fontSize, options = {}) {
	if (!text) return
	ctx.setFillStyle(options.color || '#1A2A3A')
	ctx.setFontSize(estimateFittedSize(text, fontSize, maxWidth))
	ctx.setTextAlign(options.align || 'center')
	ctx.setTextBaseline('middle')
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
	ctx.setGlobalAlpha(model.watermark.opacity / 100)
	ctx.setFillStyle('#F9F7F2')
	ctx.setTextAlign(align)
	ctx.setTextBaseline('middle')
	const maxTextWidth = width * 0.76
	if (model.text.showWatermarkName) {
		ctx.setFontSize(estimateFittedSize(model.text.watermark, size, maxTextWidth))
		ctx.fillText(model.text.watermark, x, y, maxTextWidth)
	}
	if (model.text.showMetadataLine) {
		const metaSize = Math.max(18, Math.round(size * 0.45))
		ctx.setFontSize(estimateFittedSize(model.text.caption, metaSize, maxTextWidth))
		ctx.fillText(model.text.caption, x, y + size * 0.85, maxTextWidth)
	}
	ctx.restore()
}

function drawComposition(ctx, model, image) {
	const src = model.source.src
	const ratio = Number(image.width || image.naturalWidth) / Number(image.height || image.naturalHeight)
	const width = model.export.width
	const matColor = model.frame.matColor || '#F9F7F2'

	if (model.mode === 'inPhoto') {
		const height = Math.round(width / ratio)
		drawImageCover(ctx, src, image, 0, 0, width, height)
		drawWatermark(ctx, model, width, height)
		return
	}

	if (model.mode === 'bottomBand') {
		const photoHeight = Math.round(width / ratio)
		const bandHeight = Math.round(width * (model.frame.bandHeight / 100))
		drawImageCover(ctx, src, image, 0, 0, width, photoHeight)
		ctx.setFillStyle(matColor)
		ctx.fillRect(0, photoHeight, width, bandHeight)
		const align = String(model.frame.alignment || 'Center').toLowerCase()
		const textX = align === 'left' ? width * 0.12 : align === 'right' ? width * 0.88 : width / 2
		ctx.setTextAlign(align)
		ctx.setTextBaseline('middle')
		ctx.setFillStyle(model.text.color || '#1A2A3A')
		if (model.text.showMetadataLine) {
			const metaWidth = width * 0.76
			ctx.setFontSize(estimateFittedSize(model.text.caption, model.text.captionSize * 2, metaWidth))
			ctx.fillText(model.text.caption, textX, photoHeight + bandHeight * 0.38, metaWidth)
		}
		if (model.text.showWatermarkName) {
			const nameWidth = width * 0.7
			const nameSize = Math.round(model.text.captionSize * 1.7)
			ctx.setFontSize(estimateFittedSize(model.text.watermark, nameSize, nameWidth))
			ctx.fillText(model.text.watermark, textX, photoHeight + bandHeight * 0.72, nameWidth)
		}
		return
	}

	const pad = Math.round(width * (0.08 + model.frame.borderValue / 1000))
	const photoWidth = width - pad * 2
	const photoHeight = Math.round(photoWidth / ratio)
	const captionHeight = Math.round(width * 0.16)
	const caption = getFullFrameCaptionLayout(model, width, pad + photoHeight, captionHeight)

	ctx.setFillStyle(matColor)
	ctx.fillRect(0, 0, width, pad + photoHeight + captionHeight + Math.round(pad * 0.65))
	ctx.setStrokeStyle('rgba(26,42,58,.16)')
	ctx.setLineWidth(2)
	ctx.strokeRect(pad - 10, pad - 10, photoWidth + 20, photoHeight + 20)
	drawImageCover(ctx, src, image, pad, pad, photoWidth, photoHeight)

	if (model.text.showMetadataLine) {
		drawFittedText(ctx, model.text.caption, width / 2, caption.metaY, photoWidth, caption.metaSize, { color: model.text.color })
	}
	if (model.text.showWatermarkName) {
		drawFittedText(ctx, model.text.watermark, width / 2, caption.nameY, photoWidth, caption.nameSize, { color: model.text.color })
	}
}

export function renderCompositionToTempFile({ model, image, page, canvasId = EXPORT_CANVAS_ID }) {
	const size = measureComposition(model, image)
	const ctx = uni.createCanvasContext(canvasId, page)
	drawComposition(ctx, model, image)

	return new Promise((resolve, reject) => {
		ctx.draw(false, () => {
			uni.canvasToTempFilePath({
				canvasId,
				width: size.width,
				height: size.height,
				destWidth: size.width,
				destHeight: size.height,
				fileType: model.export.format === 'image/png' ? 'png' : 'jpg',
				quality: model.export.jpegQuality / 100,
				success: resolve,
				fail: reject
			}, page)
		})
	})
}
