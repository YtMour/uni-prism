<template>
	<view class="app-shell">
		<scroll-view scroll-y class="screen-scroll" :scroll-top="scrollTop">
			<view v-if="screen === 'lists'" class="screen">
				<view class="brand-row">
					<view class="brand-mark">
						<icon-mark name="camp" />
					</view>
					<view class="brand-copy">
						<text class="serif hero-title">CampPack</text>
						<text class="muted">{{ tr('offlineSubtitle') }}</text>
					</view>
					<button class="icon-button" aria-label="Menu">☰</button>
				</view>

				<view class="stats-grid">
					<view class="stat-card">
						<icon-mark name="list" class="stat-icon" />
						<text class="stat-value">{{ checklists.length }}</text>
						<text class="stat-label">{{ tr('lists') }}</text>
					</view>
					<view class="stat-card">
						<view class="ring" :style="{ background: `conic-gradient(#2A3A2C 0 ${packPercent}%, #DDD8CE ${packPercent}% 100%)` }"><text>{{ packPercent }}%</text></view>
						<text class="stat-label">{{ tr('packed') }}</text>
					</view>
					<view class="stat-card">
						<icon-mark name="weight" class="stat-icon" />
						<text class="stat-value">{{ totalWeightKg }}</text>
						<text class="stat-label">kg</text>
					</view>
				</view>

				<view class="section-title-row">
					<text class="section-title">{{ tr('yourChecklists') }}</text>
					<button class="text-action">{{ tr('edit') }}</button>
				</view>

				<checklist-card v-for="list in checklistCards" :key="list.id" :list="list" @open="openChecklist('pack', list)" />

				<button class="primary-button" data-testid="new-checklist" @click="createChecklist()">
					<text class="button-icon">＋</text>
					<text>{{ tr('newChecklist') }}</text>
				</button>
			</view>

			<view v-if="screen === 'templates'" class="screen">
				<view class="topbar">
					<view class="brand-mark small"><icon-mark name="camp" /></view>
					<text class="serif page-title">{{ tr('templates') }}</text>
					<button class="icon-button">⌕</button>
				</view>
				<view class="search-box"><text>⌕</text><text class="muted">{{ tr('searchTemplates') }}</text></view>
				<view class="chips">
					<button v-for="chip in localizedTemplateFilters" :key="chip.key" :data-testid="'filter-' + chip.key.toLowerCase()" :class="['chip', chip.key === activeTemplateFilter ? 'active' : '']" @click="activeTemplateFilter = chip.key">{{ chip.label }}</button>
				</view>
				<template-card v-for="template in filteredTemplates" :key="template.id" :template="template" :labels="templateCardLabels" :tag-labels="tagLabels" @import="importTemplate(template)" />
			</view>

			<view v-if="screen === 'detail'" class="screen detail-screen">
				<view class="detail-topbar">
					<button class="icon-button" @click="setScreen('lists')">←</button>
					<text class="serif page-title">{{ activeChecklistName }}</text>
					<button class="icon-button" data-testid="delete-checklist" @click="openConfirm('deleteChecklist')">⌫</button>
				</view>
				<view class="detail-actions">
					<button data-testid="rename-checklist" @click="renameActiveChecklist()">{{ tr('rename') }}</button>
					<button data-testid="copy-checklist" @click="duplicateActiveChecklist()">{{ tr('copy') }}</button>
				</view>
				<view class="segmented">
					<button v-for="phase in modes" :key="phase" :data-testid="'mode-' + phase" :class="['segment', mode === phase ? 'active' : '', mode === phase && phase === 'leave' ? 'leave-active' : '']" @click="mode = phase">{{ phaseLabel(phase) }}</button>
				</view>

				<view v-if="mode !== 'leave'" class="summary-card">
					<view class="summary-part">
						<view class="round-icon"><icon-mark name="pack" /></view>
						<view class="summary-copy">
							<text class="summary-number">{{ visibleDone }} / {{ visibleTotal }}</text>
							<text class="muted">{{ mode === 'pack' ? tr('packedStatus') : tr('setupStatus') }}</text>
						</view>
					</view>
					<view class="summary-part right">
						<icon-mark name="weight" class="stat-icon" />
						<view>
							<text class="muted">{{ tr('baseWeight') }}</text>
							<text class="summary-weight">{{ activeWeightKg }} kg</text>
						</view>
					</view>
				</view>

				<view v-if="mode === 'leave'" class="leave-summary">
					<view class="leave-top">
						<view class="round-icon"><icon-mark name="return" /></view>
						<view class="leave-progress">
							<text class="summary-number danger-text">{{ visibleDone }} <text class="summary-total">/ {{ visibleTotal }} {{ tr('returnedStatus') }}</text></text>
							<view class="mini-track wide"><view class="mini-fill danger-bg" :style="{ width: visiblePercent + '%' }"></view></view>
						</view>
						<text class="danger-text strong">{{ tr('missing') }} {{ visibleTotal - visibleDone }}</text>
					</view>
					<view class="leave-note">
						<text class="note-dot">i</text>
						<text class="muted">{{ tr('returnPackedItems') }}</text>
						<button class="outline-danger" @click="resetLeave()">↻ {{ tr('resetLeave') }}</button>
					</view>
				</view>

				<view class="category-card expanded">
					<view class="category-head">
						<view class="round-icon"><icon-mark name="shelter" /></view>
						<view class="category-copy">
							<text class="category-title">{{ categoryLabel('Shelter') }}</text>
							<view class="mini-track wide"><view :class="['mini-fill', mode === 'leave' ? 'danger-bg' : '']" :style="{ width: visiblePercent + '%' }"></view></view>
						</view>
						<text class="category-count">{{ visibleDone }} / {{ visibleTotal }}</text>
						<text>⌃</text>
					</view>
					<view v-for="item in visibleGear" :key="item.id" class="gear-row" @click="toggleGear(item)">
						<view :class="['check-circle', item.done ? 'checked' : '', mode === 'leave' && !item.done ? 'danger-outline' : '']">{{ item.done ? '✓' : '' }}</view>
						<text class="gear-name">{{ item.name }}</text>
						<view class="gear-meta">
							<text>{{ item.qty }}</text>
							<text class="muted">{{ item.weight }}</text>
						</view>
						<button class="edit-gear-button" :data-testid="'edit-' + item.id" @click.stop="editGear(item)">⋯</button>
					</view>
					<view v-if="mode === 'leave'" class="category-total">
						<view class="category-total-label"><icon-mark name="weight" class="meta-icon" /><text>{{ tr('shelterTotal') }}</text></view>
						<text>{{ visibleDone }} / {{ visibleTotal }}</text>
						<text>{{ activeWeightKg }} kg</text>
					</view>
				</view>

					<view v-for="category in collapsedCategories" :key="category.name" class="category-card collapsed">
					<view class="category-head">
						<view class="round-icon"><icon-mark :name="category.icon" /></view>
						<view class="category-copy">
							<text class="category-title">{{ category.label }}</text>
							<view class="mini-track wide"><view class="mini-fill" :style="{ width: category.progress + '%' }"></view></view>
						</view>
						<text class="category-count">{{ category.count }}</text>
						<text>⌄</text>
					</view>
				</view>

				<view v-if="mode === 'leave'" class="warning-card">
					<icon-mark name="alert" class="warning-icon" />
					<text>{{ formatTr('itemsNotReturnedWarning', { count: visibleTotal - visibleDone }) }}</text>
					<text>›</text>
				</view>
				<button v-if="mode === 'leave'" class="danger-button" @click="setScreen('lists')">↩ {{ tr('finishLeaveCheck') }}</button>
				<button v-else class="fab" data-testid="add-gear" @click="openEditor(null, true)">＋</button>
			</view>

			<view v-if="screen === 'editor'" class="screen">
				<view class="detail-topbar">
					<button class="icon-button" @click="setScreen('detail')">←</button>
					<text class="serif page-title">{{ tr('editGear') }}</text>
					<view class="icon-button placeholder"></view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ tr('itemName') }}</text>
					<view class="input-row"><icon-mark name="pack" class="input-icon" /><input data-testid="item-name" class="text-input" v-model="editingItem.name" /></view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ tr('category') }}</text>
					<view class="category-options">
						<button v-for="category in categoryOptions" :key="category.name" :data-testid="'category-' + category.name.toLowerCase()" :class="['category-option', editingItem.category === category.name ? 'active' : '']" @click="setEditingCategory(category)">{{ category.label }}</button>
					</view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ tr('quantity') }}</text>
					<view class="stepper"><button data-testid="qty-minus" @click="adjustQuantity(-1)">−</button><text>{{ editingItem.qty }}</text><button data-testid="qty-plus" @click="adjustQuantity(1)">＋</button></view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ tr('weight') }}</text>
					<view class="input-row weight-row"><icon-mark name="weight" class="input-icon" /><input data-testid="item-weight" class="weight-input" type="digit" v-model="editingWeightInput" /><view class="unit-toggle"><text data-testid="unit-kg" :class="{ active: weightUnit === 'kg' }" @click="setUnit('kg')">kg</text><text data-testid="unit-lb" :class="{ active: weightUnit === 'lb' }" @click="setUnit('lb')">lb</text></view></view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ tr('criticalItem') }}</text>
					<view class="input-row" data-testid="critical-toggle" @click="toggleCritical"><text>{{ tr('markAsCriticalItem') }}</text><view :class="['switch', editingItem.critical ? 'on' : '']"><view></view></view></view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ tr('notes') }}</text>
					<textarea class="notes" data-testid="item-notes" v-model="editingItem.notes" />
				</view>
				<button class="delete-button" @click="deleteEditingItem">⌫ {{ tr('deleteItem') }}</button>
				<button class="primary-button save-button" @click="saveEditingItem()">▣ {{ tr('saveItem') }}</button>
			</view>

			<view v-if="screen === 'settings'" class="screen">
				<view class="settings-title-row">
					<view class="brand-mark small"><icon-mark name="camp" /></view>
					<text class="serif page-title">{{ tr('settings') }}</text>
				</view>
				<settings-section v-for="section in visibleSettingsSections" :key="section.title" :section="section" :language-options="languageOptions" :language="language" @unit="setUnit($event)" @language="setLanguage($event)" @export="openExport()" @import="openImport()" @reset="openConfirm('resetData')" @privacy="setScreen('privacy')" />
			</view>

			<view v-if="screen === 'data'" class="screen">
				<view class="detail-topbar">
					<button class="icon-button" @click="setScreen('settings')">←</button>
					<text class="serif page-title">{{ dataMode === 'export' ? tr('exportData') : tr('importData') }}</text>
					<view class="icon-button placeholder"></view>
				</view>
				<view class="form-group">
					<text class="field-label">{{ dataMode === 'export' ? tr('backupJson') : tr('pasteJson') }}</text>
					<textarea class="notes data-area" data-testid="data-payload" :value="dataPayload" @input="updateDataPayload" />
				</view>
				<button v-if="dataMode === 'import'" class="primary-button" data-testid="apply-import" @click="applyImport()">{{ tr('importData') }}</button>
				<button v-else class="primary-button" data-testid="copy-export" @click="setScreen('settings')">{{ tr('done') }}</button>
			</view>

			<view v-if="screen === 'privacy'" class="screen">
				<view class="detail-topbar">
					<button class="icon-button" @click="setScreen('settings')">←</button>
					<text class="serif page-title">{{ tr('privacy') }}</text>
					<view class="icon-button placeholder"></view>
				</view>
				<view class="privacy-card">
					<text class="section-title">{{ tr('privacyTitle') }}</text>
					<view v-for="section in policyContent.privacy" :key="'privacy-' + section.title" class="policy-section">
						<text class="policy-title">{{ section.title }}</text>
						<text class="privacy-copy">{{ section.body }}</text>
					</view>
					<text class="section-title policy-group-title">{{ tr('disclaimerTitle') }}</text>
					<view v-for="section in policyContent.disclaimer" :key="'disclaimer-' + section.title" class="policy-section">
						<text class="policy-title">{{ section.title }}</text>
						<text class="privacy-copy">{{ section.body }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<app-tabbar v-if="showTabs" :tabs="localizedTabs" :active="screen" @change="setScreen($event)" />
		<view v-if="confirmAction" class="confirm-overlay">
			<view class="confirm-dialog">
				<text class="section-title">{{ confirmTitle }}</text>
				<text class="privacy-copy">{{ confirmMessage }}</text>
				<view class="confirm-actions">
					<button data-testid="confirm-cancel" @click="confirmAction = ''">{{ tr('cancel') }}</button>
					<button data-testid="confirm-yes" class="danger-confirm" @click="runConfirm()">{{ tr('confirm') }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import IconMark from '../../components/shared/IconMark.vue'
import AppTabbar from '../../components/shared/AppTabbar.vue'
import TemplateCard from '../../components/templates/TemplateCard.vue'
import ChecklistCard from '../../components/lists/ChecklistCard.vue'
import SettingsSection from '../../components/settings/SettingsSection.vue'
import { settingsSections, tabs } from '../../data/demoData.js'
import { templateCatalog } from '../../data/templates.js'
import { createCampRepository } from '../../services/campRepository.js'
import { formatMessage, getPolicySections, languageOptions, t } from '../../i18n/messages.js'

const repository = createCampRepository()

export default {
	components: {
		IconMark,
		AppTabbar,
		TemplateCard,
		ChecklistCard,
		SettingsSection
	},
	data() {
		return {
			screen: 'lists',
			mode: 'pack',
			scrollTop: 0,
			activeTemplateFilter: 'All',
			templateFilters: ['All', 'Solo', 'Family', 'Ultralight'],
			weightUnit: 'kg',
			activeChecklistName: 'Weekend Lake',
			activeChecklistId: '',
			modes: ['pack', 'setup', 'leave'],
			editingItem: { id: '', name: 'Sleeping Bag', category: 'Shelter', qty: 1, weightGrams: 1600, critical: true, notes: '' },
			editingWeightInput: '1.6',
			dataMode: 'export',
			dataPayload: '',
			confirmAction: '',
			language: 'en',
			languageOptions,
			checklists: [],
			templates: templateCatalog.map((template) => ({
				...template,
				items: template.items.length,
				weight: formatKg(template.items.reduce((sum, item) => sum + item.weightGrams * item.qty, 0))
			})),
			settingsSections
		}
	},
	async mounted() {
		const state = await repository.load()
		this.applyState(state)
	},
	computed: {
		showTabs() {
			return ['lists', 'templates', 'settings'].includes(this.screen)
		},
		categoryOptions() {
			return [
				{ name: 'Gear', icon: 'pack', label: this.categoryLabel('Gear') },
				{ name: 'Shelter', icon: 'shelter', label: this.categoryLabel('Shelter') },
				{ name: 'Cooking', icon: 'cooking', label: this.categoryLabel('Cooking') },
				{ name: 'Safety', icon: 'alert', label: this.categoryLabel('Safety') },
				{ name: 'Hydration', icon: 'water', label: this.categoryLabel('Hydration') },
				{ name: 'Clothing', icon: 'shirt', label: this.categoryLabel('Clothing') }
			]
		},
		localizedTabs() {
			const tabKeys = {
				lists: 'tabLists',
				templates: 'tabTemplates',
				settings: 'tabSettings'
			}
			return tabs.map((tab) => ({ ...tab, label: this.tr(tabKeys[tab.key] || tab.label) }))
		},
		localizedTemplateFilters() {
			const labels = {
				All: 'filterAll',
				Solo: 'filterSolo',
				Family: 'filterFamily',
				Ultralight: 'filterUltralight'
			}
			return this.templateFilters.map((key) => ({ key, label: this.tr(labels[key] || key) }))
		},
		templateCardLabels() {
			return {
				items: this.tr('items'),
				import: this.tr('import'),
				kg: 'kg'
			}
		},
		tagLabels() {
			return {
				Solo: this.tr('tagSolo'),
				Family: this.tr('tagFamily'),
				Ultralight: this.tr('tagUltralight'),
				Bushcraft: this.tr('tagBushcraft'),
				Comfort: this.tr('tagComfort')
			}
		},
		policyContent() {
			return getPolicySections(this.language)
		},
		filteredTemplates() {
			if (this.activeTemplateFilter === 'All') {
				return this.templates
			}
			return this.templates.filter((template) => template.tags.includes(this.activeTemplateFilter))
		},
		checklistCards() {
			return this.checklists.map((list) => ({
				...list,
				phases: repository.summarize(list).map((phase) => ({
					...phase,
					name: this.phaseLabel(phase.key || phase.name.toLowerCase()),
					isLeave: (phase.key || phase.name.toLowerCase()) === 'leave'
				}))
			}))
		},
		activeChecklist() {
			return this.checklists.find((list) => list.id === this.activeChecklistId) || this.checklists[0]
		},
		visibleGear() {
			if (!this.activeChecklist) {
				return []
			}
			const checked = new Set(this.activeChecklist.phases[this.mode].checkedItemIds)
			return this.activeChecklist.items.map((item) => ({
				...item,
				done: checked.has(item.id),
				weight: this.formatWeight(item.weightGrams)
			}))
		},
		visibleDone() {
			return this.visibleGear.filter((item) => item.done).length
		},
		visibleTotal() {
			return this.visibleGear.length
		},
		visiblePercent() {
			if (!this.visibleTotal) {
				return 0
			}
			return Math.round((this.visibleDone / this.visibleTotal) * 100)
		},
		packPercent() {
			const totals = this.checklists.reduce((acc, list) => {
				acc.done += list.phases.pack.checkedItemIds.length
				acc.total += list.items.length
				return acc
			}, { done: 0, total: 0 })
			return totals.total ? Math.round((totals.done / totals.total) * 100) : 0
		},
		totalWeightKg() {
			const grams = this.checklists.reduce((sum, list) => sum + this.listWeight(list), 0)
			return formatKg(grams)
		},
		activeWeightKg() {
			return formatKg(this.activeChecklist ? this.listWeight(this.activeChecklist) : 0)
		},
		editingWeightValue() {
			if (this.weightUnit === 'lb') {
				return (this.editingItem.weightGrams / 453.59237).toFixed(1)
			}
			return formatKg(this.editingItem.weightGrams)
		},
		collapsedCategories() {
			if (!this.activeChecklist) {
				return []
			}
			const byCategory = this.activeChecklist.items.reduce((groups, item) => {
				if (item.category === 'Shelter') {
					return groups
				}
				groups[item.category] = groups[item.category] || { name: item.category, icon: item.icon, items: [] }
				groups[item.category].items.push(item)
				return groups
			}, {})
			const checked = new Set(this.activeChecklist.phases[this.mode].checkedItemIds)
			return Object.values(byCategory).map((category) => {
				const done = category.items.filter((item) => checked.has(item.id)).length
					return {
						name: category.name,
						label: this.categoryLabel(category.name),
						icon: category.icon,
						count: `${done} / ${category.items.length}`,
						progress: category.items.length ? Math.round((done / category.items.length) * 100) : 0
				}
			})
		},
		visibleSettingsSections() {
			const sectionKeys = {
				Preferences: 'preferences',
				Data: 'data',
				About: 'about'
			}
			const itemConfig = {
				Units: { labelKey: 'units', action: 'unit' },
				Language: { labelKey: 'language', action: 'language' },
				'Haptic feedback': { labelKey: 'hapticFeedback', action: 'haptics' },
				'Export data': { labelKey: 'exportData', action: 'export' },
				'Import data': { labelKey: 'importData', action: 'import' },
				'Reset demo content': { labelKey: 'resetDemoContent', action: 'reset' },
				Privacy: { labelKey: 'privacy', action: 'privacy' },
				Version: { labelKey: 'version', action: 'version' }
			}
			return this.settingsSections.map((section) => ({
				...section,
				title: this.tr(sectionKeys[section.title] || section.title),
				items: section.items.map((item) => {
					const config = itemConfig[item.label] || {}
					const next = {
						...item,
						action: config.action,
						label: this.tr(config.labelKey || item.label)
					}
					if (config.action === 'unit') {
						next.valueKey = this.weightUnit === 'kg' ? 'metric' : 'imperial'
						next.value = this.tr(next.valueKey)
					}
					if (config.action === 'language') {
						next.value = this.languageLabel
					}
					return next
				})
			}))
		},
		confirmTitle() {
			return this.confirmAction === 'resetData' ? this.tr('resetDemoContentTitle') : this.tr('deleteChecklistTitle')
		},
		confirmMessage() {
			return this.confirmAction === 'resetData'
				? this.tr('resetDemoContentMessage')
				: this.tr('deleteChecklistMessage')
		},
		languageLabel() {
			return languageOptions.find((item) => item.key === this.language)?.label || 'English'
		}
	},
	methods: {
		applyState(state) {
			this.checklists = state.checklists
			this.weightUnit = state.settings.unit
			this.language = state.settings.language
			if (!this.activeChecklistId && this.checklists.length) {
				this.activeChecklistId = this.checklists[0].id
				this.activeChecklistName = this.checklists[0].name
			}
			if (this.activeChecklistId && !this.checklists.some((list) => list.id === this.activeChecklistId)) {
				const next = this.checklists[0]
				this.activeChecklistId = next?.id || ''
				this.activeChecklistName = next?.name || 'CampPack'
			}
		},
		setScreen(screen) {
			this.scrollTop = this.scrollTop === 0 ? 1 : 0
			this.$nextTick(() => {
				this.scrollTop = 0
			})
			this.screen = screen
		},
		percent(done, total) {
			return Math.round((done / total) * 100)
		},
		phaseLabel(phase) {
			return this.tr(phase)
		},
		openChecklist(mode, list) {
			this.mode = mode
			if (list) {
				this.activeChecklistId = list.id
				this.activeChecklistName = list.name
			}
			this.setScreen('detail')
		},
		async importTemplate(template) {
			const imported = await repository.importTemplate(template.id)
			const state = await repository.load()
			this.applyState(state)
			this.activeChecklistId = imported.id
			this.activeChecklistName = imported.name
			this.setScreen('lists')
		},
		async createChecklist() {
			const checklist = await repository.createChecklist({ name: `New Checklist ${this.checklists.length + 1}` })
			const state = await repository.load()
			this.applyState(state)
			this.activeChecklistId = checklist.id
			this.activeChecklistName = checklist.name
			this.setScreen('detail')
		},
		async renameActiveChecklist() {
			const nextName = `${this.activeChecklistName} Edited`
			const state = await repository.renameChecklist(this.activeChecklistId, nextName)
			this.applyState(state)
			this.activeChecklistName = nextName
		},
		async duplicateActiveChecklist() {
			const checklist = await repository.duplicateChecklist(this.activeChecklistId)
			const state = await repository.load()
			this.applyState(state)
			this.activeChecklistId = checklist.id
			this.activeChecklistName = checklist.name
			this.setScreen('lists')
		},
		async deleteActiveChecklist() {
			if (!this.activeChecklistId) {
				return
			}
			const state = await repository.deleteChecklist(this.activeChecklistId)
			this.applyState(state)
			this.setScreen('lists')
		},
		openConfirm(action) {
			this.confirmAction = action
		},
		async runConfirm() {
			const action = this.confirmAction
			this.confirmAction = ''
			if (action === 'resetData') {
				await this.resetDemoData()
			} else if (action === 'deleteChecklist') {
				await this.deleteActiveChecklist()
			}
		},
		async toggleGear(item) {
			const state = await repository.toggleItem(this.activeChecklistId, this.mode, item.id)
			this.applyState(state)
		},
		async resetLeave() {
			const state = await repository.resetLeave(this.activeChecklistId)
			this.applyState(state)
		},
		openEditor(item, createNew = false) {
			const firstItem = createNew ? null : this.activeChecklist?.items[0]
			this.editingItem = item ? { ...item } : firstItem ? { ...firstItem } : { id: '', name: this.tr('newGear'), category: 'Gear', icon: 'pack', qty: 1, weightGrams: 500, critical: false, notes: '' }
			this.editingWeightInput = this.weightUnit === 'lb'
				? (this.editingItem.weightGrams / 453.59237).toFixed(1)
				: formatKg(this.editingItem.weightGrams)
			this.setScreen('editor')
		},
		editGear(item) {
			this.editingItem = { ...item }
			this.editingWeightInput = this.weightUnit === 'lb'
				? (item.weightGrams / 453.59237).toFixed(1)
				: formatKg(item.weightGrams)
			this.setScreen('editor')
		},
		adjustQuantity(delta) {
			const nextQuantity = Math.max(1, Number(this.editingItem.qty || 1) + delta)
			this.editingItem.qty = nextQuantity
		},
		async setUnit(unit) {
			this.weightUnit = unit
			await repository.updateSettings({ unit })
			if (this.screen === 'editor') {
				this.editingWeightInput = unit === 'lb'
					? (this.editingItem.weightGrams / 453.59237).toFixed(1)
					: formatKg(this.editingItem.weightGrams)
			}
		},
		toggleCritical() {
			this.editingItem.critical = !this.editingItem.critical
		},
		setEditingCategory(category) {
			this.editingItem.category = category.name
			this.editingItem.icon = category.icon
		},
		async saveEditingItem() {
			const patch = {
				name: this.editingItem.name.trim() || this.tr('newGearItem'),
				category: this.editingItem.category || 'Gear',
				icon: this.editingItem.icon || 'pack',
				qty: this.editingItem.qty,
				weightGrams: this.parseWeightInput(),
				notes: this.editingItem.notes || '',
				critical: this.editingItem.critical
			}
			if (this.editingItem.id) {
				const state = await repository.updateItem(this.activeChecklistId, this.editingItem.id, {
					...patch
				})
				this.applyState(state)
			} else {
				const state = await repository.addItem(this.activeChecklistId, patch)
				this.applyState(state)
			}
			this.setScreen('detail')
		},
		async deleteEditingItem() {
			if (this.editingItem.id) {
				const state = await repository.deleteItem(this.activeChecklistId, this.editingItem.id)
				this.applyState(state)
			}
			this.setScreen('detail')
		},
		listWeight(list) {
			return list.items.reduce((sum, item) => sum + item.weightGrams * item.qty, 0)
		},
		formatWeight(grams) {
			if (this.weightUnit === 'lb') {
				return `${(grams / 453.59237).toFixed(1)} lb`
			}
			return `${formatKg(grams)} kg`
		},
		parseWeightInput() {
			const value = Number(String(this.editingWeightInput).replace(/[^\d.]/g, ''))
			if (!Number.isFinite(value) || value <= 0) {
				return this.editingItem.weightGrams || 0
			}
			return this.weightUnit === 'lb'
				? Math.round(value * 453.59237)
				: Math.round(value * 1000)
		},
		async resetDemoData() {
			const state = await repository.resetData()
			this.activeChecklistId = ''
			this.activeChecklistName = 'CampPack'
			this.applyState(state)
			this.setScreen('lists')
		},
		async setLanguage(language) {
			this.language = language
			await repository.updateSettings({ language })
		},
		tr(key) {
			return t(this.language, key)
		},
		formatTr(key, values) {
			return formatMessage(this.language, key, values)
		},
		categoryLabel(category) {
			const keys = {
				Gear: 'categoryGear',
				Shelter: 'categoryShelter',
				Cooking: 'categoryCooking',
				Safety: 'categorySafety',
				Hydration: 'categoryHydration',
				Clothing: 'categoryClothing',
				'Fire Tools': 'categoryFireTools'
			}
			return this.tr(keys[category] || category)
		},
		async openExport() {
			this.dataMode = 'export'
			this.dataPayload = await repository.exportData()
			this.setScreen('data')
		},
		openImport() {
			this.dataMode = 'import'
			this.dataPayload = ''
			this.setScreen('data')
		},
		async applyImport() {
			const domPayload = typeof document !== 'undefined'
				? document.querySelector('[data-testid="data-payload"] textarea')?.value
				: ''
			const state = await repository.importData(this.dataPayload || domPayload)
			this.activeChecklistId = ''
			this.applyState(state)
			this.setScreen('lists')
		},
		updateDataPayload(event) {
			this.dataPayload = event.detail?.value ?? event.target?.value ?? ''
		}
	}
}

function formatKg(grams) {
	return (grams / 1000).toFixed(1)
}
</script>

<style>
.app-shell {
	min-height: 100vh;
	background: #FBF9F5;
}

.app-shell button {
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border: 0;
	line-height: 1;
	margin: 0;
	padding: 0;
	overflow: hidden;
}

.app-shell button::after {
	border: 0;
}

.screen-scroll {
	height: 100vh;
}

.screen {
	width: 100%;
	max-width: 520px;
	min-height: 100vh;
	margin: 0 auto;
	padding: 54px 24px 176px;
}

.serif {
	font-family: Georgia, "Times New Roman", serif;
	color: #2A3A2C;
	font-weight: 700;
}

.hero-title {
	display: block;
	font-size: 42px;
	line-height: 1.05;
}

.page-title {
	font-size: 30px;
	line-height: 1.1;
}

.muted {
	color: #666;
	font-size: 16px;
}

.brand-row,
.topbar,
.detail-topbar,
.settings-title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 28px;
}

.detail-topbar {
	min-height: 54px;
}

.detail-topbar .page-title {
	flex: 1;
	text-align: center;
	white-space: nowrap;
}

.detail-topbar .icon-button {
	flex: 0 0 48px;
}

.brand-copy {
	flex: 1;
}

.brand-mark {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 82px;
	height: 64px;
	color: #2A3A2C;
	overflow: visible;
}

.brand-mark.small {
	width: 58px;
	height: 46px;
}

.icon-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	color: #111;
	font-size: 32px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 14px;
	margin-bottom: 34px;
}

.stat-card {
	min-height: 156px;
	padding: 18px 10px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: rgba(255, 255, 255, 0.42);
}

.stat-value {
	color: #2A3A2C;
	font-size: 42px;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
}

.stat-label {
	color: #333;
	font-size: 18px;
}

.ring {
	width: 88px;
	height: 88px;
	border-radius: 50%;
	background: conic-gradient(#2A3A2C 0 78%, #DDD8CE 78% 100%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.ring text {
	width: 62px;
	height: 62px;
	border-radius: 50%;
	background: #FBF9F5;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 25px;
	font-weight: 800;
}

.section-title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

.section-title,
.category-title,
.field-label {
	color: #111;
	font-size: 22px;
	font-weight: 800;
}

.text-action {
	color: #2A3A2C;
	font-size: 18px;
}

.list-card,
.template-card,
.summary-card,
.leave-summary,
.category-card,
.settings-card {
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.5);
}

.list-card {
	padding: 18px;
	margin-bottom: 12px;
}

.list-main {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 18px;
}

.round-icon {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 58px;
	height: 58px;
	border-radius: 50%;
	background: #F0F1EE;
	overflow: visible;
}

.round-icon.tiny {
	width: 38px;
	height: 38px;
	font-size: 20px;
}

.list-copy,
.template-copy,
.category-copy {
	flex: 1;
	min-width: 0;
}

.card-title {
	display: block;
	margin-bottom: 5px;
	font-size: 24px;
}

.dots {
	color: #777;
	font-size: 28px;
}

.phase-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.phase-cell {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	border-right: 1px solid #DDD8CE;
}

.phase-cell:last-child {
	border-right: 0;
}

.phase-name {
	font-size: 18px;
	font-weight: 700;
}

.phase-count {
	color: #444;
	font-size: 18px;
}

.mini-track {
	width: 92px;
	height: 6px;
	border-radius: 999px;
	background: #DDD8CE;
	overflow: hidden;
}

.mini-track.wide {
	width: 100%;
}

.mini-fill {
	height: 100%;
	border-radius: inherit;
	background: #2A3A2C;
}

.danger-text {
	color: #B65D3A !important;
}

.danger-bg {
	background: #B65D3A !important;
}

.primary-button,
.danger-button {
	width: 100%;
	min-height: 58px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	color: #fff;
	font-size: 22px;
	font-weight: 800;
	background: #234127;
}

.button-icon {
	font-size: 32px;
}

.search-box,
.input-row {
	min-height: 58px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 0 18px;
	background: rgba(255,255,255,0.45);
	font-size: 22px;
}

.text-input,
.weight-input {
	flex: 1;
	min-width: 0;
	height: 56px;
	color: #111;
	font-size: 22px;
}

.weight-input {
	max-width: 112px;
}

.search-box {
	margin-bottom: 22px;
	font-size: 30px;
}

.chips {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 8px;
	margin-bottom: 22px;
}

.tag-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	margin-bottom: 22px;
}

.template-card .tag-row {
	margin-bottom: 0;
}

.chip {
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	width: 100%;
	min-width: 0;
	height: 46px;
	padding: 0 8px;
	border: 1px solid #DDD8CE;
	border-radius: 999px;
	color: #111;
	font-size: 16px;
	line-height: 1;
	background: rgba(255,255,255,0.55);
}

.chip.active {
	color: #fff;
	background: #2A3A2C;
}

.template-card {
	display: grid;
	grid-template-columns: 92px minmax(0, 1fr) auto;
	align-items: center;
	gap: 16px;
	padding: 18px;
	margin-bottom: 14px;
}

.template-copy {
	min-width: 0;
}

.template-art {
	width: 92px;
	height: 92px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #F0F1EE;
	overflow: visible;
}

.template-meta {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 7px;
	color: #555;
	font-size: 15px;
	margin-bottom: 10px;
}

.divider {
	color: #C8C1B5;
}

.tag {
	padding: 6px 12px;
	border-radius: 7px;
	background: #F0F1EE;
	color: #2A3A2C;
	font-size: 14px;
}

.small-primary {
	min-width: 82px;
	flex: 0 0 82px;
	height: 48px;
	border-radius: 8px;
	background: #234127;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 800;
}

.segmented {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	overflow: hidden;
	border-radius: 8px;
	background: #F0F1EE;
	margin-bottom: 28px;
}

.segment {
	height: 58px;
	border-right: 1px solid #DDD8CE;
	color: #111;
	font-size: 19px;
	font-weight: 700;
	line-height: 1;
}

.detail-actions {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	margin: -12px 0 22px;
}

.detail-actions button,
.mini-action {
	min-height: 42px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	color: #2A3A2C;
	background: rgba(255,255,255,0.55);
	font-size: 16px;
	font-weight: 800;
}

.mini-action {
	margin-left: auto;
	padding: 0 12px;
}

.category-options {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 10px;
}

.category-option {
	min-height: 44px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	color: #2A3A2C;
	background: rgba(255,255,255,0.55);
	font-size: 15px;
	font-weight: 800;
}

.category-option.active {
	color: #fff;
	background: #2A3A2C;
}

.segment:last-child {
	border-right: 0;
}

.segment.active {
	color: #fff;
	background: #2A3A2C;
}

.segment.leave-active,
.danger-button {
	background: #C14F2E;
}

.summary-card {
	display: grid;
	grid-template-columns: 1fr 1.08fr;
	margin-bottom: 24px;
}

.summary-part {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 20px;
	min-width: 0;
}

.summary-part.right {
	border-left: 1px solid #DDD8CE;
}

.summary-number,
.summary-weight {
	display: block;
	color: #2A3A2C;
	font-size: 34px;
	font-weight: 900;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
}

.summary-weight {
	font-size: 31px;
}

.summary-total {
	color: #222;
	font-size: 22px;
	font-weight: 500;
}

.summary-copy {
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
}

.leave-summary {
	margin-bottom: 24px;
}

.leave-top,
.leave-note {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 18px;
}

.leave-note {
	border-top: 1px solid #DDD8CE;
}

.leave-progress {
	flex: 1;
}

.strong {
	font-weight: 800;
	font-size: 18px;
}

.note-dot {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: #F0F1EE;
	color: #777;
	display: flex;
	align-items: center;
	justify-content: center;
}

.outline-danger {
	margin-left: auto;
	padding: 12px 14px;
	border: 1px solid #B65D3A;
	border-radius: 8px;
	color: #B65D3A;
	font-size: 16px;
}

.category-card {
	margin-bottom: 14px;
	overflow: hidden;
}

.category-head {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 18px;
}

.category-title {
	display: block;
	margin-bottom: 12px;
}

.category-count {
	font-size: 20px;
}

.gear-row {
	min-height: 70px;
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 0 18px;
	border-top: 1px solid #DDD8CE;
}

.check-circle {
	width: 44px;
	height: 44px;
	border: 2px solid #111;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 24px;
}

.check-circle.checked {
	border-color: #2A3A2C;
	background: #2A3A2C;
}

.check-circle.danger-outline {
	border-color: #B65D3A;
	color: #B65D3A;
}

.gear-name {
	flex: 1;
	font-size: 18px;
}

.gear-meta {
	width: 72px;
	display: flex;
	flex-direction: column;
	text-align: right;
	font-size: 17px;
}

.edit-gear-button {
	flex: 0 0 38px;
	width: 38px;
	height: 38px;
	border-radius: 50%;
	color: #666;
	font-size: 22px;
	background: #F0F1EE;
}

.category-total {
	display: grid;
	grid-template-columns: 1fr auto auto;
	gap: 20px;
	padding: 16px 22px;
	border-top: 1px solid #DDD8CE;
	color: #666;
}

.category-total-label {
	display: flex;
	align-items: center;
	gap: 8px;
}

.warning-card {
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 16px;
	align-items: center;
	padding: 16px;
	border: 1px solid rgba(182, 93, 58, 0.45);
	border-radius: 8px;
	color: #333;
	margin: 28px 0 18px;
}

.privacy-card {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 22px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.5);
}

.policy-group-title {
	margin-top: 12px;
	padding-top: 18px;
	border-top: 1px solid #DDD8CE;
}

.policy-section {
	display: flex;
	flex-direction: column;
	gap: 7px;
	padding-bottom: 14px;
	border-bottom: 1px solid rgba(221, 216, 206, 0.68);
}

.policy-section:last-child {
	padding-bottom: 0;
	border-bottom: 0;
}

.policy-title {
	color: #2A3A2C;
	font-size: 18px;
	font-weight: 900;
	line-height: 1.25;
}

.privacy-copy {
	color: #333;
	font-size: 16px;
	line-height: 1.56;
	overflow-wrap: anywhere;
}

.data-area {
	min-height: 320px;
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	font-size: 14px;
	line-height: 1.4;
}

.confirm-overlay {
	position: fixed;
	inset: 0;
	z-index: 80;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding: 24px;
	background: rgba(30, 30, 30, 0.28);
}

.confirm-dialog {
	width: 100%;
	max-width: 472px;
	padding: 22px;
	border-radius: 8px;
	border: 1px solid #DDD8CE;
	background: #FBF9F5;
	box-shadow: 0 18px 36px rgba(30, 30, 30, 0.18);
}

.confirm-actions {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	margin-top: 22px;
}

.confirm-actions button {
	min-height: 48px;
	border-radius: 8px;
	background: #F0F1EE;
	color: #2A3A2C;
	font-size: 17px;
	font-weight: 800;
}

.confirm-actions .danger-confirm {
	background: #C14F2E;
	color: #fff;
}

.warning-icon {
	color: #B65D3A;
	font-size: 30px;
}

.fab {
	position: fixed;
	right: calc(50% - 238px);
	bottom: 36px;
	width: 76px;
	height: 76px;
	border-radius: 50%;
	background: #C14F2E;
	color: #fff;
	font-size: 48px;
	box-shadow: 0 10px 24px rgba(30,30,30,.18);
}

.form-group {
	margin-bottom: 24px;
}

.field-label {
	display: block;
	margin-bottom: 10px;
	font-size: 20px;
}

.chevron {
	margin-left: auto;
}

.stepper {
	display: grid;
	grid-template-columns: 1fr 1.6fr 1fr;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	overflow: hidden;
}

.stepper button,
.stepper text {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 58px;
	font-size: 28px;
	border-right: 1px solid #DDD8CE;
}

.stepper button:last-child {
	border-right: 0;
}

.weight-row {
	justify-content: space-between;
}

.unit-toggle {
	margin-left: auto;
	display: grid;
	grid-template-columns: repeat(2, 54px);
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	overflow: hidden;
}

.unit-toggle text {
	height: 42px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
}

.unit-toggle .active {
	color: #fff;
	background: #2A3A2C;
}

.switch {
	margin-left: auto;
	width: 64px;
	height: 36px;
	border-radius: 999px;
	background: #C8C1B5;
	padding: 3px;
}

.switch view {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background: #fff;
	margin-left: 0;
}

.switch.on {
	background: #2A3A2C;
}

.switch.on view {
	margin-left: auto;
}

.notes {
	width: 100%;
	min-height: 132px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	padding: 16px;
	background: rgba(255,255,255,0.45);
	font-size: 18px;
}

.delete-button {
	width: 100%;
	height: 58px;
	border: 1px solid #B65D3A;
	border-radius: 8px;
	color: #B65D3A;
	font-size: 20px;
	margin: 8px 0 18px;
}

.tabbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 96px;
	border-top: 1px solid #DDD8CE;
	background: #FBF9F5;
	backdrop-filter: none;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	max-width: 520px;
	margin: 0 auto;
	z-index: 30;
	box-shadow: 0 -10px 26px rgba(30, 30, 30, 0.08);
	padding-bottom: env(safe-area-inset-bottom);
	overflow: hidden;
}

.tabbar::before {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: calc(100% + env(safe-area-inset-bottom));
	background: #FBF9F5;
	z-index: -1;
}

.tab {
	display: flex;
	position: relative;
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	padding: 0;
	color: #666;
	font-size: 14px;
	background: transparent;
	border: 0;
}

.tab.active {
	color: #2A3A2C;
	font-weight: 800;
}

@media (max-width: 430px) {
	.screen {
		padding-left: 18px;
		padding-right: 18px;
	}

	.hero-title {
		font-size: 36px;
	}

	.stats-grid {
		gap: 10px;
	}

	.stat-card {
		min-height: 132px;
	}

	.template-card {
		grid-template-columns: 72px minmax(0, 1fr);
		align-items: start;
		gap: 14px;
		padding: 16px;
	}

	.template-art {
		width: 72px;
		height: 72px;
	}

	.small-primary {
		min-width: 72px;
		flex-basis: 72px;
		grid-column: 2;
		justify-self: start;
		width: auto;
		padding: 0 16px;
		height: 44px;
		margin-top: 2px;
		font-size: 16px;
	}

	.fab {
		right: 22px;
	}
}
</style>


