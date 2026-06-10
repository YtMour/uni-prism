export const PRESET_TEMPLATES = [
	{
		id: 'classic',
		label: 'Classic',
		mode: 'fullFrame',
		description: 'Light gallery mat with metadata and signature.',
		patch: {
			selectedSwatch: '#F9F7F2',
			borderValue: 32,
			showWatermarkName: true,
			showMetadataLine: true,
			captionSize: 34
		}
	},
	{
		id: 'editorial',
		label: 'Editorial',
		mode: 'bottomBand',
		description: 'Bottom caption band with centered editorial type.',
		patch: {
			selectedSwatch: '#EFEFEF',
			bandHeight: 18,
			alignment: 'Center',
			showWatermarkName: true,
			showMetadataLine: true,
			captionSize: 30
		}
	},
	{
		id: 'signature',
		label: 'Signature',
		mode: 'inPhoto',
		description: 'Discreet in-photo mark near the lower edge.',
		patch: {
			selectedAnchor: 'bottom-right',
			opacity: 68,
			markSize: 36,
			offset: 42,
			showWatermarkName: true,
			showMetadataLine: false
		}
	},
	{
		id: 'minimal',
		label: 'Minimal',
		mode: 'fullFrame',
		description: 'Clean light mat with only a small signature.',
		patch: {
			selectedSwatch: '#FFFEFA',
			borderValue: 18,
			showWatermarkName: true,
			showMetadataLine: false,
			captionSize: 28
		}
	},
	{
		id: 'darkMat',
		label: 'Dark Mat',
		mode: 'fullFrame',
		description: 'Dark gallery mat for high contrast photos.',
		patch: {
			selectedSwatch: '#1A2A3A',
			borderValue: 36,
			showWatermarkName: true,
			showMetadataLine: true,
			captionSize: 30
		}
	},
	{
		id: 'leftNote',
		label: 'Left Note',
		mode: 'bottomBand',
		description: 'Bottom band with left aligned metadata.',
		patch: {
			selectedSwatch: '#E5EAE6',
			bandHeight: 16,
			alignment: 'Left',
			showWatermarkName: true,
			showMetadataLine: true,
			captionSize: 28
		}
	}
]

export function findPresetTemplate(id) {
	return PRESET_TEMPLATES.find(preset => preset.id === id) || PRESET_TEMPLATES[0]
}
