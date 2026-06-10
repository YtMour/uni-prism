function drawImageCover(ctx, image, x, y, width, height) {
  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = width / height
  let sx = 0
  let sy = 0
  let sw = image.naturalWidth
  let sh = image.naturalHeight

  if (sourceRatio > targetRatio) {
    sw = image.naturalHeight * targetRatio
    sx = (image.naturalWidth - sw) / 2
  } else {
    sh = image.naturalWidth / targetRatio
    sy = (image.naturalHeight - sh) / 2
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height)
}

function drawCenteredText(ctx, text, x, y, maxWidth, font, color = '#1A2A3A') {
  if (!text) return
  ctx.save()
  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y, maxWidth)
  ctx.restore()
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
  ctx.shadowColor = 'rgba(0,0,0,.62)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 2
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${size}px Georgia, serif`
  if (model.text.showWatermarkName) ctx.fillText(model.text.watermark, x, y)
  if (model.text.showMetadataLine) {
    ctx.font = `${Math.max(18, Math.round(size * .45))}px Georgia, serif`
    ctx.fillText(model.text.caption, x, y + size * .85)
  }
  ctx.restore()
}

function prepareCanvas(createCanvas) {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  return { canvas, ctx }
}

function renderInPhoto(ctx, canvas, model, image, ratio) {
  const width = model.export.width
  canvas.width = width
  canvas.height = Math.round(width / ratio)
  drawImageCover(ctx, image, 0, 0, canvas.width, canvas.height)
  drawWatermark(ctx, model, canvas.width, canvas.height)
}

function renderBottomBand(ctx, canvas, model, image, ratio) {
  const width = model.export.width
  const matColor = model.frame.matColor || '#F9F7F2'
  const photoHeight = Math.round(width / ratio)
  const bandHeight = Math.round(width * (model.frame.bandHeight / 100))
  canvas.width = width
  canvas.height = photoHeight + bandHeight

  drawImageCover(ctx, image, 0, 0, width, photoHeight)
  ctx.fillStyle = matColor
  ctx.fillRect(0, photoHeight, width, bandHeight)

  const align = String(model.frame.alignment || 'Center').toLowerCase()
  const textX = align === 'left' ? width * .12 : align === 'right' ? width * .88 : width / 2
  ctx.textAlign = align
  ctx.fillStyle = '#1A2A3A'
  ctx.textBaseline = 'middle'
  ctx.font = `${model.text.captionSize * 2}px Georgia, serif`
  if (model.text.showMetadataLine) ctx.fillText(model.text.caption, textX, photoHeight + bandHeight * .38, width * .76)
  ctx.font = `italic ${Math.round(model.text.captionSize * 1.7)}px Georgia, serif`
  if (model.text.showWatermarkName) ctx.fillText(model.text.watermark, textX, photoHeight + bandHeight * .72, width * .7)
}

function renderFullFrame(ctx, canvas, model, image, ratio) {
  const width = model.export.width
  const matColor = model.frame.matColor || '#F9F7F2'
  const pad = Math.round(width * (0.08 + model.frame.borderValue / 1000))
  const photoWidth = width - pad * 2
  const photoHeight = Math.round(photoWidth / ratio)
  const captionHeight = Math.round(width * .16)

  canvas.width = width
  canvas.height = pad + photoHeight + captionHeight + Math.round(pad * .65)
  ctx.fillStyle = matColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'rgba(26,42,58,.16)'
  ctx.lineWidth = 2
  ctx.strokeRect(pad - 10, pad - 10, photoWidth + 20, photoHeight + 20)

  drawImageCover(ctx, image, pad, pad, photoWidth, photoHeight)

  const metaY = pad + photoHeight + captionHeight * .34
  const signY = pad + photoHeight + captionHeight * .68
  if (model.text.showMetadataLine) {
    drawCenteredText(ctx, model.text.caption, width / 2, metaY, photoWidth, `${model.text.captionSize * 1.8}px Georgia, serif`)
  }
  if (model.text.showWatermarkName) {
    drawCenteredText(ctx, model.text.watermark, width / 2, signY, photoWidth, `italic ${model.text.captionSize * 1.6}px Georgia, serif`)
  }
}

export async function renderCompositionToBlob(model, image, createCanvas) {
  const { canvas, ctx } = prepareCanvas(createCanvas)
  const ratio = image.naturalWidth / image.naturalHeight

  if (model.mode === 'inPhoto') {
    renderInPhoto(ctx, canvas, model, image, ratio)
  } else if (model.mode === 'bottomBand') {
    renderBottomBand(ctx, canvas, model, image, ratio)
  } else {
    renderFullFrame(ctx, canvas, model, image, ratio)
  }

  return await new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export returned empty data'))
    }, model.export.format, model.export.format === 'image/jpeg' ? model.export.jpegQuality / 100 : undefined)
  })
}

export function measureComposition(model, image) {
  const ratio = image.naturalWidth / image.naturalHeight
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
  const captionHeight = Math.round(width * .16)
  return {
    width,
    height: pad + photoHeight + captionHeight + Math.round(pad * .65)
  }
}
