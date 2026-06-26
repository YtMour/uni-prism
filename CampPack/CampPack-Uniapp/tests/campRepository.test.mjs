import test from 'node:test'
import assert from 'node:assert/strict'
import {
	createCampRepository,
	createMemoryStorage
} from '../services/campRepository.js'

test('imports a template as a persisted checklist with independent phase state', async () => {
	const storage = createMemoryStorage()
	const repository = createCampRepository({ storage })

	let state = await repository.load()
	const imported = await repository.importTemplate('family-glamping')

	assert.equal(imported.name, 'Family Glamping')
	assert.equal(imported.items.length, 8)
	assert.deepEqual(imported.phases.pack.checkedItemIds, [])
	assert.deepEqual(imported.phases.setup.checkedItemIds, [])
	assert.deepEqual(imported.phases.leave.checkedItemIds, [])

	const firstItemId = imported.items[0].id
	await repository.toggleItem(imported.id, 'pack', firstItemId)
	state = await repository.toggleItem(imported.id, 'setup', firstItemId)

	const updated = state.checklists.find((list) => list.id === imported.id)
	assert.deepEqual(updated.phases.pack.checkedItemIds, [firstItemId])
	assert.deepEqual(updated.phases.setup.checkedItemIds, [firstItemId])
	assert.deepEqual(updated.phases.leave.checkedItemIds, [])

	const reloaded = await createCampRepository({ storage }).load()
	const persisted = reloaded.checklists.find((list) => list.id === imported.id)
	assert.equal(persisted.items[0].name, imported.items[0].name)
	assert.deepEqual(persisted.phases.pack.checkedItemIds, [firstItemId])
	assert.deepEqual(persisted.phases.setup.checkedItemIds, [firstItemId])
	assert.deepEqual(persisted.phases.leave.checkedItemIds, [])
})

test('resetting leave does not change pack or setup progress', async () => {
	const repository = createCampRepository({ storage: createMemoryStorage() })
	const imported = await repository.importTemplate('solo-bushcraft')
	const firstItemId = imported.items[0].id

	await repository.toggleItem(imported.id, 'pack', firstItemId)
	await repository.toggleItem(imported.id, 'setup', firstItemId)
	await repository.toggleItem(imported.id, 'leave', firstItemId)
	const state = await repository.resetLeave(imported.id)

	const updated = state.checklists.find((list) => list.id === imported.id)
	assert.deepEqual(updated.phases.pack.checkedItemIds, [firstItemId])
	assert.deepEqual(updated.phases.setup.checkedItemIds, [firstItemId])
	assert.deepEqual(updated.phases.leave.checkedItemIds, [])
})

test('creates and deletes a blank checklist without leaving stale active state', async () => {
	const repository = createCampRepository({ storage: createMemoryStorage() })
	const blank = await repository.createChecklist({ name: 'Desert Overnight' })

	assert.equal(blank.name, 'Desert Overnight')
	assert.equal(blank.items.length, 1)
	assert.equal(blank.items[0].name, 'New gear item')

	let state = await repository.toggleItem(blank.id, 'pack', blank.items[0].id)
	assert.equal(state.checklists.find((list) => list.id === blank.id).phases.pack.checkedItemIds.length, 1)

	state = await repository.deleteChecklist(blank.id)
	assert.equal(state.checklists.some((list) => list.id === blank.id), false)
})

test('updates full gear fields and persists unit preference', async () => {
	const storage = createMemoryStorage()
	const repository = createCampRepository({ storage })
	const imported = await repository.importTemplate('ultralight-backpacking')
	const item = imported.items[0]

	await repository.updateItem(imported.id, item.id, {
		name: 'DCF shelter',
		qty: 2,
		weightGrams: 710,
		notes: 'Fresh guylines installed.',
		critical: false
	})
	await repository.updateSettings({ unit: 'lb' })

	const reloaded = await createCampRepository({ storage }).load()
	const persisted = reloaded.checklists.find((list) => list.id === imported.id).items[0]
	assert.equal(persisted.name, 'DCF shelter')
	assert.equal(persisted.qty, 2)
	assert.equal(persisted.weightGrams, 710)
	assert.equal(persisted.notes, 'Fresh guylines installed.')
	assert.equal(persisted.critical, false)
	assert.equal(reloaded.settings.unit, 'lb')
})

test('renames and duplicates a checklist with independent item ids', async () => {
	const repository = createCampRepository({ storage: createMemoryStorage() })
	const imported = await repository.importTemplate('family-glamping')
	const originalItemId = imported.items[0].id

	let state = await repository.renameChecklist(imported.id, 'Basecamp Weekend')
	assert.equal(state.checklists.find((list) => list.id === imported.id).name, 'Basecamp Weekend')

	const copied = await repository.duplicateChecklist(imported.id)
	assert.equal(copied.name, 'Basecamp Weekend Copy')
	assert.equal(copied.items.length, imported.items.length)
	assert.notEqual(copied.id, imported.id)
	assert.notEqual(copied.items[0].id, originalItemId)

	state = await repository.toggleItem(copied.id, 'pack', copied.items[0].id)
	const source = state.checklists.find((list) => list.id === imported.id)
	const duplicate = state.checklists.find((list) => list.id === copied.id)
	assert.deepEqual(source.phases.pack.checkedItemIds, [])
	assert.deepEqual(duplicate.phases.pack.checkedItemIds, [copied.items[0].id])
})

test('adds gear, updates category, and resets user data to seeded defaults', async () => {
	const repository = createCampRepository({ storage: createMemoryStorage() })
	const checklist = await repository.createChecklist({ name: 'Field Test' })

	let state = await repository.addItem(checklist.id, {
		name: 'Waterproof map',
		category: 'Safety',
		icon: 'alert',
		qty: 1,
		weightGrams: 80,
		critical: true,
		notes: 'Route marked.'
	})
	let updated = state.checklists.find((list) => list.id === checklist.id)
	const item = updated.items.find((entry) => entry.name === 'Waterproof map')
	assert.equal(item.category, 'Safety')
	assert.equal(item.critical, true)

	state = await repository.updateItem(checklist.id, item.id, { category: 'Gear', icon: 'pack' })
	updated = state.checklists.find((list) => list.id === checklist.id)
	assert.equal(updated.items.find((entry) => entry.id === item.id).category, 'Gear')

	state = await repository.resetData()
	assert.equal(state.checklists.length, 3)
	assert.equal(state.checklists.some((list) => list.name === 'Field Test'), false)
	assert.equal(state.settings.unit, 'kg')
})

test('exports and imports a validated data package', async () => {
	const repository = createCampRepository({ storage: createMemoryStorage() })
	const checklist = await repository.createChecklist({ name: 'Import Export' })
	await repository.updateSettings({ language: 'zh' })

	const exported = await repository.exportData()
	const target = createCampRepository({ storage: createMemoryStorage() })
	const state = await target.importData(exported)

	assert.equal(state.settings.language, 'zh')
	assert.equal(state.checklists.some((list) => list.name === checklist.name), true)
	await assert.rejects(() => target.importData('not json'), /Invalid CampPack data/)
})
