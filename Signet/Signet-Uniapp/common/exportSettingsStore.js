import { DEFAULT_EXPORT_SETTINGS } from './compositionModel.js'

export const EXPORT_WIDTHS = [1080, 1600]
export const EXPORT_FORMATS = ['image/jpeg', 'image/png']
export const EXPORT_SETTINGS_KEY = 'signet.exportSettings'

export function normalizeExportSettings(raw = {}) {
	const width = EXPORT_WIDTHS.includes(Number(raw.width)) ? Number(raw.width) : DEFAULT_EXPORT_SETTINGS.width
	const format = EXPORT_FORMATS.includes(raw.format) ? raw.format : DEFAULT_EXPORT_SETTINGS.format
	const jpegQuality = Math.max(70, Math.min(92, Number(raw.jpegQuality) || DEFAULT_EXPORT_SETTINGS.jpegQuality))
	return { width, format, jpegQuality }
}

export function readExportSettings() {
	if (typeof localStorage !== 'undefined') {
		try {
			const stored = localStorage.getItem(EXPORT_SETTINGS_KEY)
			if (stored) return normalizeExportSettings(JSON.parse(stored))
		} catch (error) {
			// Fall through to uni storage/defaults.
		}
	}
	if (typeof uni === 'undefined' || typeof uni.getStorageSync !== 'function') {
		return normalizeExportSettings()
	}
	try {
		return normalizeExportSettings(uni.getStorageSync(EXPORT_SETTINGS_KEY) || {})
	} catch (error) {
		return normalizeExportSettings()
	}
}

export function writeExportSettings(settings) {
	const normalized = normalizeExportSettings(settings)
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(EXPORT_SETTINGS_KEY, JSON.stringify(normalized))
	}
	if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
		uni.setStorageSync(EXPORT_SETTINGS_KEY, normalized)
	}
	return normalized
}

export function resetExportSettings() {
	return writeExportSettings(normalizeExportSettings())
}

export function formatExportSettings(settings) {
	const normalized = normalizeExportSettings(settings)
	const format = normalized.format === 'image/png' ? 'PNG' : `JPEG Q${normalized.jpegQuality}`
	return `${normalized.width}px / ${format}`
}
