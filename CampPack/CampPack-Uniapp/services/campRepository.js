import { templateCatalog } from '../data/templates.js'

const STORAGE_KEY = 'camppack.mvp.v1'
const DEFAULT_STATE = {
	schemaVersion: 1,
	settings: {
		unit: 'kg',
		language: 'en',
		haptics: true
	},
	checklists: []
}

export function createMemoryStorage(initial = {}) {
	const store = { ...initial }
	return {
		getItem(key) {
			return store[key] ?? null
		},
		setItem(key, value) {
			store[key] = String(value)
		},
		removeItem(key) {
			delete store[key]
		}
	}
}

export function createUniStorage() {
	return {
		getItem(key) {
			try {
				const browserValue = globalThis.localStorage?.getItem(key)
				if (browserValue) {
					return browserValue
				}
				if (typeof uni !== 'undefined' && uni.getStorageSync) {
					const value = uni.getStorageSync(key)
					if (value) {
						return value
					}
				}
				return null
			} catch (error) {
				return globalThis.localStorage?.getItem(key) || null
			}
		},
		setItem(key, value) {
			try {
				if (typeof uni !== 'undefined' && uni.setStorageSync) {
					uni.setStorageSync(key, value)
				}
			} finally {
				globalThis.localStorage?.setItem(key, value)
			}
		},
		removeItem(key) {
			try {
				if (typeof uni !== 'undefined' && uni.removeStorageSync) {
					uni.removeStorageSync(key)
				}
			} finally {
				globalThis.localStorage?.removeItem(key)
			}
		}
	}
}

export function createCampRepository({ storage = createUniStorage(), key = STORAGE_KEY } = {}) {
	let state

	function clone(value) {
		return JSON.parse(JSON.stringify(value))
	}

	function normalize(rawState) {
		const rawSettings = rawState?.settings || {}
		return {
			...clone(DEFAULT_STATE),
			...(rawState || {}),
			settings: {
				...DEFAULT_STATE.settings,
				...rawSettings,
				language: normalizeLanguage(rawSettings.language)
			},
			checklists: Array.isArray(rawState?.checklists) ? rawState.checklists : []
		}
	}

	function read() {
		if (state) {
			return state
		}
		const raw = storage.getItem(key)
		if (!raw) {
			state = normalize()
			return state
		}
		try {
			state = normalize(JSON.parse(raw))
		} catch (error) {
			state = normalize()
		}
		return state
	}

	function write(nextState) {
		state = normalize(nextState)
		storage.setItem(key, JSON.stringify(state))
		return clone(state)
	}

	function getChecklist(checklistId) {
		const found = read().checklists.find((list) => list.id === checklistId)
		if (!found) {
			throw new Error(`Checklist not found: ${checklistId}`)
		}
		return found
	}

	function summarize(list) {
		const total = list.items.length
		return ['pack', 'setup', 'leave'].map((phase) => ({
			key: phase,
			name: phase.charAt(0).toUpperCase() + phase.slice(1),
			done: list.phases[phase].checkedItemIds.length,
			total
		}))
	}

	function seedState(current = read()) {
		const seeded = templateCatalog.slice(0, 3).map((template, index) => createChecklistFromTemplate(template, { importedAt: seedDate(index) }))
		return write({ ...clone(DEFAULT_STATE), settings: { ...DEFAULT_STATE.settings, ...(current.settings || {}) }, checklists: seeded })
	}

	return {
		async load() {
			const current = read()
			if (current.checklists.length === 0) {
				return seedState(current)
			}
			return clone(current)
		},
		async save(nextState) {
			return write(nextState)
		},
		async importTemplate(templateId) {
			const template = templateCatalog.find((item) => item.id === templateId)
			if (!template) {
				throw new Error(`Template not found: ${templateId}`)
			}
			const current = await this.load()
			const checklist = createChecklistFromTemplate(template, { importedAt: 'Imported template' })
			write({ ...current, checklists: [checklist, ...current.checklists] })
			return clone(checklist)
		},
		async createChecklist({ name = 'New Checklist' } = {}) {
			const current = await this.load()
			const checklist = createBlankChecklist(name)
			write({ ...current, checklists: [checklist, ...current.checklists] })
			return clone(checklist)
		},
		async deleteChecklist(checklistId) {
			const current = await this.load()
			return write({
				...current,
				checklists: current.checklists.filter((list) => list.id !== checklistId)
			})
		},
		async renameChecklist(checklistId, name) {
			const current = await this.load()
			const cleanName = String(name || '').trim() || 'Untitled Checklist'
			const checklists = current.checklists.map((list) => list.id === checklistId ? { ...list, name: cleanName } : list)
			return write({ ...current, checklists })
		},
		async duplicateChecklist(checklistId) {
			const current = await this.load()
			const source = current.checklists.find((list) => list.id === checklistId)
			if (!source) {
				throw new Error(`Checklist not found: ${checklistId}`)
			}
			const checklist = duplicateChecklist(source)
			write({ ...current, checklists: [checklist, ...current.checklists] })
			return clone(checklist)
		},
		async toggleItem(checklistId, phase, itemId) {
			const current = await this.load()
			getChecklist(checklistId)
			const checklists = current.checklists.map((list) => {
				if (list.id !== checklistId) {
					return list
				}
				const checked = new Set(list.phases[phase].checkedItemIds)
				if (checked.has(itemId)) {
					checked.delete(itemId)
				} else {
					checked.add(itemId)
				}
				return {
					...list,
					phases: {
						...list.phases,
						[phase]: {
							checkedItemIds: [...checked]
						}
					}
				}
			})
			return write({ ...current, checklists })
		},
		async resetLeave(checklistId) {
			const current = await this.load()
			const checklists = current.checklists.map((list) => list.id === checklistId
				? { ...list, phases: { ...list.phases, leave: { checkedItemIds: [] } } }
				: list)
			return write({ ...current, checklists })
		},
		async updateItem(checklistId, itemId, patch) {
			const current = await this.load()
			const checklists = current.checklists.map((list) => list.id === checklistId
				? { ...list, items: list.items.map((item) => item.id === itemId ? { ...item, ...patch } : item) }
				: list)
			return write({ ...current, checklists })
		},
		async addItem(checklistId, item) {
			const current = await this.load()
			const checklists = current.checklists.map((list) => {
				if (list.id !== checklistId) {
					return list
				}
				return {
					...list,
					items: [
						...list.items,
						normalizeItem(item, `${list.id}-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`)
					]
				}
			})
			return write({ ...current, checklists })
		},
		async deleteItem(checklistId, itemId) {
			const current = await this.load()
			const checklists = current.checklists.map((list) => {
				if (list.id !== checklistId) {
					return list
				}
				return {
					...list,
					items: list.items.filter((item) => item.id !== itemId),
					phases: Object.fromEntries(Object.entries(list.phases).map(([phase, value]) => [
						phase,
						{ checkedItemIds: value.checkedItemIds.filter((id) => id !== itemId) }
					]))
				}
			})
			return write({ ...current, checklists })
		},
		async updateSettings(patch) {
			const current = await this.load()
			return write({
				...current,
				settings: {
					...current.settings,
					...patch
				}
			})
		},
		async exportData() {
			const current = await this.load()
			return JSON.stringify(current, null, 2)
		},
		async importData(payload) {
			try {
				const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
				if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.checklists)) {
					throw new Error('Invalid shape')
				}
				return write(normalize(parsed))
			} catch (error) {
				throw new Error('Invalid CampPack data')
			}
		},
		async resetData() {
			state = normalize()
			storage.removeItem(key)
			return seedState(state)
		},
		summarize,
		clear() {
			state = normalize()
			storage.removeItem(key)
		}
	}
}

export function duplicateChecklist(source) {
	const id = uniqueId(source.templateId || 'checklist-copy')
	const itemIdMap = new Map()
	const items = source.items.map((item, index) => {
		const nextId = `${id}-item-${index + 1}`
		itemIdMap.set(item.id, nextId)
		return { ...item, id: nextId }
	})
	return {
		...source,
		id,
		name: `${source.name} Copy`,
		date: 'Copied checklist',
		items,
		phases: Object.fromEntries(Object.entries(source.phases).map(([phase, value]) => [
			phase,
			{ checkedItemIds: value.checkedItemIds.map((itemId) => itemIdMap.get(itemId)).filter(Boolean) }
		]))
	}
}

function normalizeItem(item, id) {
	return {
		id,
		name: String(item?.name || '').trim() || 'New gear item',
		category: String(item?.category || '').trim() || 'Gear',
		icon: item?.icon || 'pack',
		qty: Math.max(1, Number(item?.qty || 1)),
		weightGrams: Math.max(0, Math.round(Number(item?.weightGrams || 0))),
		critical: Boolean(item?.critical),
		notes: item?.notes || ''
	}
}

export function createChecklistFromTemplate(template, { importedAt } = {}) {
	const id = uniqueId(template.id)
	const items = template.items.map((item, index) => ({
		id: `${id}-item-${index + 1}`,
		...item
	}))
		return {
		id,
		templateId: template.id,
		name: seededName(template.name, importedAt),
		date: importedAt || 'Imported template',
		icon: template.icon,
		items,
		phases: {
			pack: { checkedItemIds: [] },
			setup: { checkedItemIds: [] },
			leave: { checkedItemIds: [] }
		}
	}
}

export function createBlankChecklist(name) {
	const id = uniqueId('blank-checklist')
	return {
		id,
		templateId: null,
		name,
		date: 'Draft checklist',
		icon: 'pack',
		items: [
			{
				id: `${id}-item-1`,
				name: 'New gear item',
				category: 'Gear',
				icon: 'pack',
				qty: 1,
				weightGrams: 500,
				critical: false,
				notes: ''
			}
		],
		phases: {
			pack: { checkedItemIds: [] },
			setup: { checkedItemIds: [] },
			leave: { checkedItemIds: [] }
		}
	}
}

function seedDate(index) {
	return ['May 24 - May 25', 'Jun 6 - Jun 8', 'Jun 14 - Jun 16'][index] || 'Imported template'
}

function seededName(templateName, importedAt) {
	if (importedAt === 'May 24 - May 25') {
		return 'Weekend Lake'
	}
	return templateName
}

function normalizeLanguage(language) {
	const legacy = { English: 'en', Chinese: 'zh' }
	return legacy[language] || language || DEFAULT_STATE.settings.language
}

function uniqueId(prefix) {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
