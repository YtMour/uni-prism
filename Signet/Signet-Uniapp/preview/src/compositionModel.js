export const DEFAULT_EXPORT_SETTINGS = {
  width: 1600,
  format: 'image/jpeg',
  jpegQuality: 92
}

export function buildCompositionModel(state) {
  const metadata = state.metadataFields
    .map(field => ({ key: field.key, label: field.label, value: String(field.value || '').trim() }))
    .filter(field => field.value)

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
      showMetadataLine: Boolean(state.showMetadataLine)
    },
    watermark: {
      anchor: state.selectedAnchor,
      opacity: Number(state.opacity),
      size: Number(state.markSize),
      offset: Number(state.offset)
    },
    export: {
      width: Number(state.exportWidth) || DEFAULT_EXPORT_SETTINGS.width,
      format: state.exportFormat || DEFAULT_EXPORT_SETTINGS.format,
      jpegQuality: Number(state.jpegQuality) || DEFAULT_EXPORT_SETTINGS.jpegQuality
    }
  }
}

export function exportExtension(format) {
  return format === 'image/jpeg' ? 'jpg' : 'png'
}
