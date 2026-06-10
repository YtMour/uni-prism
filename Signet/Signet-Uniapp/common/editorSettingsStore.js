export const EDITOR_SETTINGS_KEY = 'signet.editorSettings'

export const DEFAULT_EDITOR_SETTINGS = {
	presetId: 'classic',
	mode: 'fullFrame',
	selectedSwatch: '#F9F7F2',
	borderValue: 32,
	opacity: 78,
	markSize: 48,
	offset: 50,
	bandHeight: 20,
	captionSize: 34,
	alignment: 'Center',
	selectedAnchor: 'bottom-center',
	watermarkText: 'Signet',
	showWatermarkName: true,
	showMetadataLine: true,
	metadataFields: [
		{ key: 'camera', label: 'Camera', value: 'Manual' },
		{ key: 'lens', label: 'Lens', value: '35mm' },
		{ key: 'shutter', label: 'Shutter', value: '1/250s' },
		{ key: 'aperture', label: 'Aperture', value: 'f/2.8' },
		{ key: 'iso', label: 'ISO', value: '200' },
		{ key: 'focal', label: 'Focal', value: '35mm' }
	]
}

function cloneDefault() {
	return JSON.parse(JSON.stringify(DEFAULT_EDITOR_SETTINGS))
}

export function normalizeEditorSettings(raw = {}) {
	const defaults = cloneDefault()
	const metadataMap = new Map((Array.isArray(raw.metadataFields) ? raw.metadataFields : []).map(field => [field.key, field]))
	return {
		...defaults,
		...raw,
		metadataFields: defaults.metadataFields.map(field => ({
			...field,
			value: String((metadataMap.get(field.key) || field).value || '')
		}))
	}
}

export function readEditorSettings() {
	if (typeof localStorage !== 'undefined') {
		try {
			const stored = localStorage.getItem(EDITOR_SETTINGS_KEY)
			if (stored) return normalizeEditorSettings(JSON.parse(stored))
		} catch (error) {
			// Fall through to uni storage/defaults.
		}
	}
	if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
		try {
			return normalizeEditorSettings(uni.getStorageSync(EDITOR_SETTINGS_KEY) || {})
		} catch (error) {
			return cloneDefault()
		}
	}
	return cloneDefault()
}

export function writeEditorSettings(settings) {
	const normalized = normalizeEditorSettings(settings)
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(EDITOR_SETTINGS_KEY, JSON.stringify(normalized))
	}
	if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
		uni.setStorageSync(EDITOR_SETTINGS_KEY, normalized)
	}
	return normalized
}

export function resetEditorSettings() {
	return writeEditorSettings(cloneDefault())
}
