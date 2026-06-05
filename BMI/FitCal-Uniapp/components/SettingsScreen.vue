<template>
	<view class="screen">
		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/ruler.svg" mode="aspectFit"></image><text>{{ copy('settings.units') }}</text></view>
				<text class="setting-value">{{ unitsLabel }}</text>
			</view>
			<view class="segmented compact">
				<text :class="['segmented-item', units === 'metric' ? 'active' : '']" @tap="$emit('set-units', 'metric')">{{ copy('unit.metric') }}</text>
				<text :class="['segmented-item', units === 'imperial' ? 'active' : '']" @tap="$emit('set-units', 'imperial')">{{ copy('unit.imperial') }}</text>
			</view>
		</view>

		<view class="plain-card">
			<picker mode="selector" :range="languagePickerLabels" :value="languagePickerIndex" @change="handleLanguagePickerChange">
				<view class="picker-row">
					<view class="setting-title"><image class="line-icon" src="/static/icons/globe.svg" mode="aspectFit"></image><text>{{ copy('settings.language') }}</text></view>
					<view class="picker-value">
						<text>{{ languageLabel }}</text>
						<text class="picker-arrow">⌄</text>
					</view>
				</view>
			</picker>
			<text class="note">{{ copy('settings.languageNote') }}</text>
		</view>

		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/bars.svg" mode="aspectFit"></image><text>{{ copy('settings.recordFilter') }}</text></view>
				<text class="setting-value">{{ visibleRecordCount }}/{{ totalRecordCount }}</text>
			</view>
			<view class="segmented compact">
				<text :class="['segmented-item', recordFilter === 'all' ? 'active' : '']" @tap="$emit('update:recordFilter', 'all')">{{ copy('filter.all') }}</text>
				<text :class="['segmented-item', recordFilter === 'last5' ? 'active' : '']" @tap="$emit('update:recordFilter', 'last5')">{{ copy('filter.last5') }}</text>
				<text :class="['segmented-item', recordFilter === 'highBmi' ? 'active' : '']" @tap="$emit('update:recordFilter', 'highBmi')">{{ copy('filter.highBmi') }}</text>
			</view>
		</view>

		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/bars.svg" mode="aspectFit"></image><text>{{ copy('settings.trendMode') }}</text></view>
				<text class="setting-value">{{ trendMode === 'weight' ? copy('field.weight') : 'BMI' }}</text>
			</view>
			<view class="segmented compact">
				<text :class="['segmented-item', trendMode === 'weight' ? 'active' : '']" @tap="$emit('update:trendMode', 'weight')">{{ copy('trend.weight') }}</text>
				<text :class="['segmented-item', trendMode === 'bmi' ? 'active' : '']" @tap="$emit('update:trendMode', 'bmi')">{{ copy('trend.bmi') }}</text>
			</view>
		</view>

		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/settings.svg" mode="aspectFit"></image><text>{{ copy('settings.maxRecords') }}</text></view>
				<text class="setting-value">{{ maxSavedRecords }}</text>
			</view>
			<view class="chip-row setting-chip-row">
				<text v-for="limit in recordLimitOptions" :key="limit" :class="['chip', maxSavedRecords === limit ? 'active' : '']" @tap="$emit('set-max-saved-records', limit)">{{ limit }}</text>
			</view>
		</view>

		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/bars.svg" mode="aspectFit"></image><text>{{ copy('settings.chartSamples') }}</text></view>
				<text class="setting-value">{{ chartSampleLimit }}</text>
			</view>
			<view class="chip-row setting-chip-row">
				<text v-for="limit in availableChartSampleOptions" :key="limit" :class="['chip', chartSampleLimit === limit ? 'active' : '']" @tap="$emit('set-chart-sample-limit', limit)">{{ limit }}</text>
			</view>
			<text class="note">{{ copy('settings.sampleNote') }}</text>
		</view>

		<view class="plain-card">
			<view class="link-row" @tap="$emit('open-policy', 'privacy')">
				<view class="setting-title"><image class="line-icon" src="/static/icons/shield.svg" mode="aspectFit"></image><text>{{ copy('settings.privacy') }}</text></view>
				<text class="setting-value">{{ copy('action.view') }}</text>
			</view>
			<view class="link-row" @tap="$emit('open-policy', 'disclaimer')">
				<view class="setting-title"><image class="line-icon" src="/static/icons/shield.svg" mode="aspectFit"></image><text>{{ copy('settings.disclaimer') }}</text></view>
				<text class="setting-value">{{ copy('action.view') }}</text>
			</view>
		</view>

		<view class="plain-card data-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/bars.svg" mode="aspectFit"></image><text>{{ copy('settings.localData') }}</text></view>
				<text class="setting-value">CSV</text>
			</view>
			<view class="data-action-row">
				<button class="secondary-button inline data-button" hover-class="secondary-button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('export-records')">{{ copy('settings.exportRecords') }}</button>
				<button class="secondary-button inline data-button" hover-class="secondary-button-press" hover-start-time="0" hover-stay-time="120" @tap="importRecords">{{ copy('settings.importRecords') }}</button>
			</view>
			<textarea class="csv-input" v-model="importCsvText" maxlength="2000" :placeholder="copy('settings.importRecordsPlaceholder')" />
			<text class="note">{{ copy('settings.localStorageNote') }}</text>
		</view>

		<button class="danger-button" hover-class="danger-button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('clear-local-data')"><image class="line-icon" src="/static/icons/trash.svg" mode="aspectFit"></image> {{ copy('settings.clearData') }}</button>

		<view class="plain-card">
			<view class="metric-row"><text>{{ copy('settings.version') }}</text><text class="metric-value">1.0.0</text></view>
			<text class="note">{{ copy('settings.localStorageNote') }}</text>
		</view>
	</view>
</template>

<script lang="ts">
	import { CHART_SAMPLE_OPTIONS, LANGUAGE_OPTIONS, RECORD_LIMIT_OPTIONS } from '../data/appData'
	import { t } from '../services/i18n'
	import type { PolicyType } from '../services/policy'
	import type { AppLanguage, RecordFilter, TrendMode, Units } from '../types/fitcal'

	export default {
		props: {
			units: { type: String as () => Units, required: true },
			unitsLabel: { type: String, required: true },
			appLanguage: { type: String as () => AppLanguage, required: true },
			languageLabel: { type: String, required: true },
			recordFilter: { type: String as () => RecordFilter, required: true },
			trendMode: { type: String as () => TrendMode, required: true },
			maxSavedRecords: { type: Number, required: true },
			chartSampleLimit: { type: Number, required: true },
			totalRecordCount: { type: Number, required: true },
			visibleRecordCount: { type: Number, required: true }
		},
		computed: {
			languageOptions() {
				return LANGUAGE_OPTIONS
			},
			languagePickerLabels() {
				return LANGUAGE_OPTIONS.map((option) => option.label)
			},
			languagePickerIndex() {
				const index = LANGUAGE_OPTIONS.findIndex((option) => option.key === this.appLanguage)
				return index >= 0 ? index : 0
			},
			recordLimitOptions() {
				return RECORD_LIMIT_OPTIONS
			},
			availableChartSampleOptions() {
				return CHART_SAMPLE_OPTIONS.filter((limit) => limit <= this.maxSavedRecords)
			}
		},
		data() {
			return {
				importCsvText: ''
			}
		},
		emits: {
			'set-units': (_units: Units) => true,
			'set-language': (_language: AppLanguage) => true,
			'update:recordFilter': (_filter: RecordFilter) => true,
			'update:trendMode': (_mode: TrendMode) => true,
			'set-max-saved-records': (_limit: number) => true,
			'set-chart-sample-limit': (_limit: number) => true,
			'open-policy': (_type: PolicyType) => true,
			'export-records': () => true,
			'import-records': (_csv: string) => true,
			'clear-local-data': () => true
		},
		methods: {
			handleLanguagePickerChange(event: { detail?: { value?: string | number } }) {
				const index = Number(event.detail?.value)
				const option = LANGUAGE_OPTIONS[index]
				if (!option) return
				this.$emit('set-language', option.key)
			},
			copy(key: string) {
				return t(this.appLanguage, key)
			},
			importRecords() {
				this.$emit('import-records', this.importCsvText)
			}
		}
	}
</script>
