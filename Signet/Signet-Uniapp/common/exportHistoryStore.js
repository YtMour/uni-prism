export const EXPORT_HISTORY_KEY = 'signet.exportHistory'
export const EXPORT_HISTORY_LIMIT = 12

function normalizeHistoryItem(item = {}) {
	return {
		id: String(item.id || `${Date.now()}`),
		fileName: String(item.fileName || 'signet-export.jpg'),
		mode: String(item.mode || 'fullFrame'),
		width: Number(item.width || 0),
		height: Number(item.height || 0),
		size: Number(item.size || 0),
		format: String(item.format || 'image/jpeg'),
		target: String(item.target || 'local'),
		timestamp: Number(item.timestamp || Date.now())
	}
}

function normalizeHistory(raw) {
	const items = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.data) ? raw.data : [])
	return items
		.map(normalizeHistoryItem)
		.filter(item => item.fileName && item.timestamp)
		.sort((a, b) => b.timestamp - a.timestamp)
		.slice(0, EXPORT_HISTORY_LIMIT)
}

function readRawHistory() {
	if (typeof localStorage !== 'undefined') {
		try {
			const stored = localStorage.getItem(EXPORT_HISTORY_KEY)
			if (stored) return JSON.parse(stored)
		} catch (error) {
			// Fall through to uni storage/defaults.
		}
	}
	if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
		try {
			return uni.getStorageSync(EXPORT_HISTORY_KEY) || []
		} catch (error) {
			return []
		}
	}
	return []
}

function writeRawHistory(items) {
	const normalized = normalizeHistory(items)
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(normalized))
	}
	if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
		uni.setStorageSync(EXPORT_HISTORY_KEY, normalized)
	}
	return normalized
}

export function readExportHistory() {
	return normalizeHistory(readRawHistory())
}

export function recordExportHistory(item) {
	const current = readExportHistory()
	const next = normalizeHistory([
		{
			...item,
			id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
			timestamp: Date.now()
		},
		...current
	])
	return writeRawHistory(next)
}

export function clearExportHistory() {
	return writeRawHistory([])
}

export function formatHistoryMode(mode) {
	const map = {
		fullFrame: 'Full Frame',
		bottomBand: 'Bottom Band',
		inPhoto: 'In-Photo'
	}
	return map[mode] || 'Frame'
}
