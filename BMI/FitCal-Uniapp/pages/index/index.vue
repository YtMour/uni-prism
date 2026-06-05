<template>
	<view class="app-shell">
		<view class="app-header">
			<text class="brand">FitCal</text>
			<view class="page-heading">
				<view class="page-title-row">
					<text class="screen-title">{{ activePageTitle }}</text>
					<text class="context-pill">{{ currentContext }}</text>
				</view>
				<text class="screen-subtitle">{{ activePageSubtitle }}</text>
			</view>
		</view>
		<view v-if="announcementVisible" class="ops-banner">
			<view class="announcement-viewport">
				<text :class="['announcement-text', announcementShouldScroll ? 'scrolling' : '']">{{ announcementText }}</text>
			</view>
		</view>

		<scroll-view class="screen-scroll" scroll-y>
			<BmiScreen
				v-if="activeTab === 'bmi'"
				:units="units"
				:height="height"
				:weight="weight"
				:height-unit="heightUnit"
				:weight-unit="weightUnit"
				:app-language="appLanguage"
				:bmi-errors="bmiErrors"
				:display-bmi-value="displayBmiValue"
				:bmi-category="bmiCategory"
				:bmi-has-error="bmiHasError"
				:bmi-marker-left="bmiMarkerLeft"
				:display-healthy-range="displayHealthyRange"
				@set-units="setUnits"
				@update:height="height = $event"
				@update:weight="weight = $event"
				@calculate-bmi="calculateAndRecordBmi"
			/>

			<CaloriesScreen
				v-if="activeTab === 'calories'"
				:sex="sex"
				:age="age"
				:activity="activity"
				:goal="goal"
				:activity-options="activityOptions"
				:calorie-errors="calorieErrors"
				:bmr="bmr"
				:tdee="tdee"
				:calorie-target="calorieTarget"
				:ad-test-enabled="adPlaceholderVisible"
				:app-language="appLanguage"
				@update:sex="sex = $event"
				@update:age="age = $event"
				@update:activity="activity = $event"
				@update:goal="goal = $event"
				@calculate-calories="calculateCalories"
				@ad-impression="recordAdImpression"
				@ad-dismiss="recordAdDismissal"
			/>

			<GuidanceScreen
				v-if="activeTab === 'guidance'"
				:goal-title="goalTitle"
				:calorie-target="calorieTarget"
				:target-progress="targetProgress"
				:record-progress-summary="recordProgressSummary"
				:reminder-setting="reminderSetting"
				:reminder-label="reminderLabel"
				:ad-test-enabled="adPlaceholderVisible"
				:app-language="appLanguage"
				:meals="meals"
				:guide-unlocked="guideUnlocked"
				:seven-day-guide="sevenDayGuide"
				@ad-impression="recordAdImpression"
				@ad-dismiss="recordAdDismissal"
				@toggle-guide="toggleGuide"
				@set-reminder="setReminderSetting"
			/>

			<RecordsScreen
				v-if="activeTab === 'records'"
				:current-weight="currentWeight"
				:weight-unit="weightUnit"
				:display-bmi-value="currentRecordBmi"
				:app-language="appLanguage"
				:target-progress="targetProgress"
				:target-weight="targetWeight"
				:target-weight-error="targetWeightError"
				:record-progress-summary="recordProgressSummary"
				:total-record-count="records.length"
				:trend-mode="trendMode"
				:trend-points="trendPoints"
				:trend-summary="trendSummary"
				:records="visibleRecords"
				@update:targetWeight="targetWeight = $event"
				@save-target-weight="saveTargetWeightSetting"
				@add-record="addRecord"
				@delete-record="deleteRecord"
				@update-record="updateRecord"
			/>

			<SettingsScreen
				v-if="activeTab === 'settings'"
				:units="units"
				:units-label="unitsLabel"
				:app-language="appLanguage"
				:language-label="languageLabel"
				:record-filter="recordFilter"
				:trend-mode="trendMode"
				:max-saved-records="recordSettings.maxSavedRecords"
				:chart-sample-limit="recordSettings.chartSampleLimit"
				:total-record-count="records.length"
				:visible-record-count="visibleRecords.length"
				@set-units="setUnits"
				@set-language="setAppLanguage"
				@update:recordFilter="recordFilter = $event"
				@update:trendMode="trendMode = $event"
				@set-max-saved-records="setMaxSavedRecords"
				@set-chart-sample-limit="setChartSampleLimit"
				@open-policy="openPolicy"
				@export-records="exportRecords"
				@import-records="importRecords"
				@clear-local-data="clearLocalData"
			/>
		</scroll-view>

		<view class="bottom-nav">
			<view v-for="item in tabs" :key="item.key" :class="['nav-item', activeTab === item.key ? 'active' : '']" @tap="setActiveTab(item.key)">
				<image class="nav-icon" :src="activeTab === item.key ? item.activeIcon : item.icon" mode="aspectFit"></image>
				<text class="nav-label">{{ copy(item.labelKey) }}</text>
			</view>
		</view>
		<view v-if="feedbackVisible" class="feedback-toast">
			<text>{{ feedbackMessage }}</text>
		</view>
	</view>
</template>

<script lang="ts">
	import BmiScreen from '../../components/BmiScreen.vue'
	import CaloriesScreen from '../../components/CaloriesScreen.vue'
	import GuidanceScreen from '../../components/GuidanceScreen.vue'
	import RecordsScreen from '../../components/RecordsScreen.vue'
	import SettingsScreen from '../../components/SettingsScreen.vue'
	import type { ActivityKey, AdTestState, AppLanguage, BmiCategory, Goal, OpsConfig, RecordFilter, RecordProgressSummary, RecordSettings, ReminderSetting, SevenDayGuideItem, Sex, TabKey, TargetProgress, TrendMode, TrendPoint, TrendSummary, Units, WeightRecord } from '../../types/fitcal'
	import { ACTIVITY_OPTIONS, DEFAULT_RECORD_SETTINGS, LANGUAGE_OPTIONS, MEALS, REMINDER_OPTIONS, TABS } from '../../data/appData'
	import {
		bmiMarkerLeft,
		calculateBmi as calculateBmiResult,
		calculateCalories as calculateCaloriesResult,
		convertMeasurements,
		goalTitle,
		healthyRange,
		heightUnit,
		unitsLabel,
		weightUnit
	} from '../../services/calculators'
	import { clearRecords, loadAdTestState, loadAnalyticsVisitorId, loadAppLanguage, loadGuideUnlocked, loadRecordSettings, loadRecords, loadReminderSetting, loadTargetWeight, loadUnits, recordsFromCsv, recordsToCsv, saveAdTestState, saveAppLanguage, saveGuideUnlocked, saveRecordSettings, saveRecords, saveReminderSetting, saveTargetWeight, saveUnits } from '../../services/storage'
	import type { PolicyType } from '../../services/policy'
	import { t } from '../../services/i18n'

	const ADMIN_API_PORT = '48791'
	const APP_ADMIN_API_BASE = 'http://192.168.1.128:48791'
	const ANALYTICS_SOURCE = 'fitcal-uniapp-h5'

	function getAdminApiBase(): string {
		const envBase = import.meta.env.VITE_FITCAL_API_BASE
		if (typeof envBase === 'string' && envBase) return envBase.replace(/\/$/, '')
		if (typeof location !== 'undefined' && location.hostname) {
			const host = location.hostname === 'localhost' ? '127.0.0.1' : location.hostname
			return `${location.protocol}//${host}:${ADMIN_API_PORT}`
		}
		return APP_ADMIN_API_BASE
	}

	interface FitCalState {
		activeTab: TabKey
		units: Units
		height: string
		weight: string
		sex: Sex
		age: string
		activity: ActivityKey
		goal: Goal
		trendMode: TrendMode
		recordFilter: RecordFilter
		bmiValue: string
		bmiCategory: BmiCategory
		bmr: string
		tdee: string
		calorieTarget: string
		records: WeightRecord[]
		recordSettings: RecordSettings
		targetWeight: string
		targetWeightError: string
		reminderSetting: ReminderSetting
		appLanguage: AppLanguage
		guideUnlocked: boolean
		adTestState: AdTestState
		opsConfig: OpsConfig
		analyticsVisitorId: string
		analyticsSessionId: string
		opsConfigTimer: number | null
		feedbackMessage: string
		feedbackVisible: boolean
		feedbackTimer: number | null
		bmiErrors: Record<'height' | 'weight', string>
		calorieErrors: Record<'age', string>
		tabs: typeof TABS
		activityOptions: typeof ACTIVITY_OPTIONS
		meals: typeof MEALS
	}

	export default {
		components: {
			BmiScreen,
			CaloriesScreen,
			GuidanceScreen,
			RecordsScreen,
			SettingsScreen
		},
		data() {
			return {
				activeTab: 'bmi',
				units: 'metric',
				height: '175',
				weight: '69',
				sex: 'female',
				age: '29',
				activity: 'moderate',
				goal: 'lose',
				trendMode: 'weight',
				recordFilter: 'all',
				bmiValue: '22.5',
				bmiCategory: 'Normal weight',
				bmr: '1,420',
				tdee: '2,200',
				calorieTarget: '2,050',
				records: loadRecords(),
				recordSettings: { ...DEFAULT_RECORD_SETTINGS },
				targetWeight: '',
				targetWeightError: '',
				reminderSetting: 'off',
				appLanguage: 'en',
				guideUnlocked: false,
				adTestState: { enabled: true, impressions: 0, dismissals: 0 },
				opsConfig: { adPlaceholderEnabled: true, h5Version: '', releaseNote: '', testAnnouncement: '', showTestAnnouncement: false, updatedAt: '' },
				analyticsVisitorId: '',
				analyticsSessionId: `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
				opsConfigTimer: null,
				feedbackMessage: '',
				feedbackVisible: false,
				feedbackTimer: null,
				bmiErrors: { height: '', weight: '' },
				calorieErrors: { age: '' },
				tabs: TABS,
				activityOptions: ACTIVITY_OPTIONS,
				meals: MEALS
			} as FitCalState
		},
		computed: {
			currentContext() {
				const labels = {
					bmi: this.unitsLabel,
					calories: this.copy('context.goal'),
					guidance: this.copy('context.plan'),
					records: this.copy('context.local'),
					settings: this.copy('tab.settings')
				}
				return labels[this.activeTab]
			},
			unitsLabel() {
				return this.copy(this.units === 'metric' ? 'unit.metric' : 'unit.imperial')
			},
			heightUnit() {
				return heightUnit(this.units)
			},
			weightUnit() {
				return weightUnit(this.units)
			},
			currentWeight() {
				return this.records.length ? this.records[0].weight : this.weight
			},
			currentRecordBmi() {
				return this.records.length ? this.records[0].bmi : this.displayBmiValue
			},
			reminderLabel() {
				return this.copy(`reminder.${this.reminderSetting}`)
			},
			languageLabel() {
				return LANGUAGE_OPTIONS.find((option) => option.key === this.appLanguage)?.label || 'English'
			},
			visibleRecords(): WeightRecord[] {
				if (this.recordFilter === 'last5') return this.records.slice(0, 5)
				if (this.recordFilter === 'highBmi') {
					return this.records.filter((record) => {
						const bmi = Number(record.bmi)
						return Number.isFinite(bmi) && bmi >= 25
					})
				}
				return this.records
			},
			targetProgress(): TargetProgress {
				const target = Number(this.targetWeight)
				const current = Number(this.currentWeight)
				if (!Number.isFinite(target) || target <= 0 || !Number.isFinite(current) || current <= 0) {
					return {
						hasTarget: false,
						targetText: '--',
						differenceText: '--',
						statusText: this.copy('progress.setTarget')
					}
				}

				const difference = current - target
				const absoluteDifference = Math.abs(difference)
				const targetText = `${target.toFixed(1)} ${this.weightUnit}`
				if (absoluteDifference < 0.1) {
					return {
						hasTarget: true,
						targetText,
						differenceText: `0.0 ${this.weightUnit}`,
						statusText: this.copy('progress.onTarget')
					}
				}

				return {
					hasTarget: true,
					targetText,
					differenceText: `${absoluteDifference.toFixed(1)} ${this.weightUnit}`,
					statusText: difference > 0 ? this.copy('progress.toLose') : this.copy('progress.toGain')
				}
			},
			recordProgressSummary(): RecordProgressSummary {
				const summaryRecords = this.visibleRecords
				const recordCount = summaryRecords.length
				if (recordCount < 2) {
					return {
						recordCountText: this.recordCountText(recordCount),
						changeText: `0.0 ${this.weightUnit}`,
						directionText: this.copy('summary.addMore'),
						periodText: this.copy('summary.needTwo')
					}
				}

				const latest = Number(summaryRecords[0].weight)
				const oldest = Number(summaryRecords[recordCount - 1].weight)
				if (!Number.isFinite(latest) || !Number.isFinite(oldest)) {
					return {
						recordCountText: this.recordCountText(recordCount),
						changeText: `-- ${this.weightUnit}`,
						directionText: this.copy('summary.noSummary'),
						periodText: this.copy('summary.invalid')
					}
				}

				const change = latest - oldest
				const absoluteChange = Math.abs(change)
				return {
					recordCountText: this.recordCountText(recordCount),
					changeText: `${absoluteChange.toFixed(1)} ${this.weightUnit}`,
					directionText: absoluteChange < 0.1 ? this.copy('summary.noChange') : change > 0 ? this.copy('summary.up') : this.copy('summary.down'),
					periodText: this.copy('date.range', {
						start: this.compactRecordDate(summaryRecords[recordCount - 1].date),
						end: this.compactRecordDate(summaryRecords[0].date)
					})
				}
			},
			healthyRange() {
				return healthyRange(this.height, this.units)
			},
			displayHealthyRange() {
				return this.bmiHasError ? '--' : this.healthyRange
			},
			bmiMarkerLeft() {
				return bmiMarkerLeft(this.bmiValue)
			},
			bmiHasError() {
				return Boolean(this.bmiErrors.height || this.bmiErrors.weight)
			},
			displayBmiValue() {
				return this.bmiHasError ? '--' : this.bmiValue
			},
			adPlaceholderVisible() {
				return this.adTestState.enabled && this.opsConfig.adPlaceholderEnabled
			},
			announcementText() {
				return this.opsConfig.testAnnouncement
			},
			announcementVisible() {
				return this.opsConfig.showTestAnnouncement && Boolean(this.opsConfig.testAnnouncement)
			},
			announcementShouldScroll() {
				return this.announcementText.length > 28
			},
			goalTitle() {
				return this.copy(`goalTitle.${this.goal}`)
			},
			activePageTitle() {
				const titles = {
					bmi: this.copy('title.bmi'),
					calories: this.copy('title.calories'),
					guidance: this.copy('title.guidance'),
					records: this.copy('title.records'),
					settings: this.copy('title.settings')
				}
				return titles[this.activeTab]
			},
			activePageSubtitle() {
				const subtitles = {
					bmi: this.copy('subtitle.bmi'),
					calories: this.copy('subtitle.calories'),
					guidance: this.copy('subtitle.guidance'),
					records: this.copy('subtitle.records'),
					settings: this.copy('subtitle.settings')
				}
				return subtitles[this.activeTab]
			},
			sevenDayGuide(): SevenDayGuideItem[] {
				return this.buildSevenDayGuide()
			},
			sampledTrendRecords() {
				return this.records.slice(0, this.recordSettings.chartSampleLimit).reverse()
			},
			trendValues() {
				return this.sampledTrendRecords
					.map((record) => Number(this.trendMode === 'weight' ? record.weight : record.bmi))
					.filter((value) => Number.isFinite(value) && value > 0)
			},
			trendPoints(): TrendPoint[] {
				const values = this.trendValues
				if (!values.length) return []

				const min = Math.min(...values)
				const max = Math.max(...values)
				const span = max - min || 1
				return values.map((value, index) => {
					const x = values.length === 1 ? 180 : 28 + (index / (values.length - 1)) * 304
					const y = max === min ? 110 : 32 + (1 - (value - min) / span) * 156
					return {
						id: this.sampledTrendRecords[index].id,
						x: Number(x.toFixed(1)),
						y: Number(y.toFixed(1))
					}
				})
			},
			trendSummary(): TrendSummary {
				const values = this.trendValues
				const unit = this.trendMode === 'weight' ? this.weightUnit : 'BMI'
				const title = this.trendMode === 'weight' ? this.copy('trend.weight') : this.copy('trend.bmi')
				if (!values.length) {
					return {
						title,
						unit,
						latestValue: '--',
						rangeText: '--',
						startLabel: '--',
						endLabel: '--',
						yLabels: ['--', '--', '--']
					}
				}

				const latest = values[values.length - 1]
				const min = Math.min(...values)
				const max = Math.max(...values)
				const middle = (min + max) / 2
				const format = (value: number) => this.trendMode === 'weight' ? value.toFixed(1) : value.toFixed(1)
				return {
					title,
					unit,
					latestValue: `${format(latest)} ${unit}`,
					rangeText: `${format(min)}-${format(max)} ${unit}`,
					startLabel: this.compactRecordDate(this.sampledTrendRecords[0]?.date),
					endLabel: this.compactRecordDate(this.sampledTrendRecords[this.sampledTrendRecords.length - 1]?.date),
					yLabels: [format(max), format(middle), format(min)]
				}
			}
		},
		onLoad() {
			this.restoreLocalData()
			this.calculateBmi()
			this.calculateCalories(false)
			this.loadOpsConfig()
			this.startOpsConfigPolling()
			this.reportActivityEvent('app_open')
			this.reportActivityEvent('tab_view')
		},
		onUnload() {
			this.stopOpsConfigPolling()
			this.clearFeedbackTimer()
		},
		methods: {
			copy(key: string, params?: Record<string, string | number>) {
				return t(this.appLanguage, key, params)
			},
			recordCountText(count: number) {
				if (this.appLanguage === 'zh-Hans' || this.appLanguage === 'zh-Hant') return `${count} 条记录`
				return `${count} ${count === 1 ? 'record' : 'records'}`
			},
			restoreLocalData() {
				this.analyticsVisitorId = loadAnalyticsVisitorId()
				const restoredUnits = loadUnits()
				if (restoredUnits !== this.units) {
					const converted = convertMeasurements(restoredUnits, this.units, {
						height: this.height,
						weight: this.weight
					})
					this.height = converted.height
					this.weight = converted.weight
				}
				this.units = restoredUnits
				this.recordSettings = loadRecordSettings()
				this.targetWeight = loadTargetWeight()
				this.reminderSetting = loadReminderSetting()
				this.appLanguage = loadAppLanguage()
				this.guideUnlocked = loadGuideUnlocked()
				this.adTestState = loadAdTestState()
				this.records = this.trimRecords(loadRecords(), this.recordSettings.maxSavedRecords)
				saveRecords(this.records)
			},
			setActiveTab(nextTab: TabKey) {
				if (this.activeTab === nextTab) return
				this.activeTab = nextTab
				this.reportActivityEvent('tab_view')
			},
			setUnits(nextUnits: Units) {
				if (this.units === nextUnits) return
				const converted = convertMeasurements(nextUnits, this.units, {
					height: this.height,
					weight: this.weight
				})
				this.height = converted.height
				this.weight = converted.weight
				if (this.targetWeight) {
					this.targetWeight = convertMeasurements(nextUnits, this.units, {
						height: '',
						weight: this.targetWeight
					}).weight
					saveTargetWeight(this.targetWeight)
				}
				this.units = nextUnits
				saveUnits(nextUnits)
				this.calculateBmi()
				this.calculateCalories(false)
				this.showToast(this.copy('toast.units', { value: this.unitsLabel }))
			},
			calculateBmi(): boolean {
				if (!this.validateBmiInputs()) return false
				const result = calculateBmiResult(this.height, this.weight, this.units)
				if (!result) return false
				this.bmiValue = result.value
				this.bmiCategory = result.category
				return true
			},
			calculateAndRecordBmi(): boolean {
				if (!this.calculateBmi()) return false
				this.reportActivityEvent('bmi_calculate')
				this.saveCurrentBmiRecord()
				return true
			},
			calculateCalories(track = true): boolean {
				if (!this.validateBmiInputs() || !this.validateCalorieInputs()) return false
				const result = calculateCaloriesResult({
					age: this.age,
					height: this.height,
					weight: this.weight,
					units: this.units,
					sex: this.sex,
					activity: this.activity,
					goal: this.goal
				})
				if (!result) return false
				this.bmr = result.bmr
				this.tdee = result.tdee
				this.calorieTarget = result.calorieTarget
				if (track) this.reportActivityEvent('calorie_calculate')
				return true
			},
			addRecord() {
				this.calculateAndRecordBmi()
			},
			saveCurrentBmiRecord() {
				const record = {
					id: Date.now(),
					weight: Number(this.weight).toFixed(1),
					bmi: this.bmiValue,
					date: this.formatRecordDate()
				}
				this.records = this.trimRecords([record, ...this.records], this.recordSettings.maxSavedRecords)
				saveRecords(this.records)
				this.reportActivityEvent('record_write')
				this.showToast(this.copy('toast.recordSaved'))
			},
			trimRecords(records: WeightRecord[], limit: number) {
				return records.slice(0, limit)
			},
			setMaxSavedRecords(limit: number) {
				const nextChartLimit = Math.min(this.recordSettings.chartSampleLimit, limit)
				this.recordSettings = {
					maxSavedRecords: limit,
					chartSampleLimit: nextChartLimit
				}
				this.records = this.trimRecords(this.records, limit)
				saveRecordSettings(this.recordSettings)
				saveRecords(this.records)
				this.showToast(this.copy('toast.recordLimit', { value: limit }))
			},
			setChartSampleLimit(limit: number) {
				this.recordSettings = {
					...this.recordSettings,
					chartSampleLimit: Math.min(limit, this.recordSettings.maxSavedRecords)
				}
				saveRecordSettings(this.recordSettings)
				this.showToast(this.copy('toast.chartSamples', { value: this.recordSettings.chartSampleLimit }))
			},
			saveTargetWeightSetting(): boolean {
				const value = this.targetWeight.trim()
				if (!value) {
					this.targetWeightError = ''
					saveTargetWeight('')
					this.showToast(this.copy('toast.targetRemoved'))
					return true
				}

				const target = Number(value)
				const weightMin = this.units === 'metric' ? 20 : 44
				const weightMax = this.units === 'metric' ? 300 : 660
				if (!Number.isFinite(target) || target < weightMin || target > weightMax) {
					this.targetWeightError = this.copy('error.range', { min: weightMin, max: weightMax, unit: this.weightUnit })
					return false
				}

				this.targetWeight = target.toFixed(1)
				this.targetWeightError = ''
				saveTargetWeight(this.targetWeight)
				this.showToast(this.copy('toast.targetSaved'))
				return true
			},
			formatRecordDate() {
				const now = new Date()
				const year = now.getFullYear()
				const month = String(now.getMonth() + 1).padStart(2, '0')
				const day = String(now.getDate()).padStart(2, '0')
				const hour = String(now.getHours()).padStart(2, '0')
				const minute = String(now.getMinutes()).padStart(2, '0')
				return `${year}-${month}-${day} ${hour}:${minute}`
			},
			compactRecordDate(dateLabel?: string) {
				if (!dateLabel) return '--'
				if (/^\d{4}-\d{2}-\d{2}/.test(dateLabel)) return dateLabel.slice(5, 10)
				return dateLabel.replace(/^([A-Z][a-z]{2}) (\d{2}).*$/, '$1 $2')
			},
			deleteRecord(recordId: number) {
				this.records = this.records.filter((record) => record.id !== recordId)
				saveRecords(this.records)
				this.reportActivityEvent('record_delete')
				this.showToast(this.copy('toast.recordDeleted'))
			},
			updateRecord(updatedRecord: WeightRecord) {
				const weight = Number(updatedRecord.weight)
				const bmi = Number(updatedRecord.bmi)
				if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(bmi) || bmi <= 0) return
				this.records = this.records.map((record) => {
					if (record.id !== updatedRecord.id) return record
					return {
						...record,
						weight: weight.toFixed(1),
						bmi: bmi.toFixed(1)
					}
				})
				saveRecords(this.records)
				this.reportActivityEvent('record_update')
				this.showToast(this.copy('toast.recordUpdated'))
			},
			setReminderSetting(reminderSetting: ReminderSetting) {
				if (this.reminderSetting === reminderSetting) return
				this.reminderSetting = reminderSetting
				saveReminderSetting(reminderSetting)
				this.showToast(this.copy('toast.reminder', { value: this.reminderLabel }))
			},
			setAppLanguage(appLanguage: AppLanguage) {
				if (this.appLanguage === appLanguage) return
				this.appLanguage = appLanguage
				saveAppLanguage(appLanguage)
				this.showToast(this.copy('toast.language', { value: this.languageLabel }))
			},
			toggleGuide() {
				this.guideUnlocked = !this.guideUnlocked
				saveGuideUnlocked(this.guideUnlocked)
				this.showToast(this.guideUnlocked ? this.copy('toast.guideOpen') : this.copy('toast.guideHidden'))
			},
			setAdTestEnabled(enabled: boolean) {
				this.adTestState = {
					...this.adTestState,
					enabled
				}
				saveAdTestState(this.adTestState)
			},
			recordAdImpression() {
				if (!this.adTestState.enabled) return
				this.adTestState = {
					...this.adTestState,
					impressions: this.adTestState.impressions + 1
				}
				saveAdTestState(this.adTestState)
				this.reportAdEvent('impression')
			},
			recordAdDismissal() {
				if (!this.adTestState.enabled) return
				this.adTestState = {
					...this.adTestState,
					dismissals: this.adTestState.dismissals + 1
				}
				saveAdTestState(this.adTestState)
				this.reportAdEvent('dismissal')
			},
			reportAdEvent(type: 'impression' | 'dismissal') {
				const payload = {
					type,
					source: ANALYTICS_SOURCE,
					visitorId: this.analyticsVisitorId,
					sessionId: this.analyticsSessionId
				}
				uni.request({
					url: `${getAdminApiBase()}/api/admin/ad-event`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: payload
				})
			},
			reportActivityEvent(type: 'app_open' | 'tab_view' | 'bmi_calculate' | 'calorie_calculate' | 'record_write' | 'record_update' | 'record_delete' | 'records_clear') {
				if (!this.analyticsVisitorId) return
				uni.request({
					url: `${getAdminApiBase()}/api/admin/activity-event`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						type,
						source: ANALYTICS_SOURCE,
						visitorId: this.analyticsVisitorId,
						sessionId: this.analyticsSessionId
					}
				})
			},
			loadOpsConfig() {
				uni.request({
					url: `${getAdminApiBase()}/api/app/config`,
					method: 'GET',
					success: (response) => {
						const data = (response as { data?: Partial<OpsConfig> }).data
						if (typeof data?.adPlaceholderEnabled !== 'boolean') return
						this.opsConfig = {
							adPlaceholderEnabled: data.adPlaceholderEnabled,
							h5Version: typeof data.h5Version === 'string' ? data.h5Version : '',
							releaseNote: typeof data.releaseNote === 'string' ? data.releaseNote : '',
							testAnnouncement: typeof data.testAnnouncement === 'string' ? data.testAnnouncement : '',
							showTestAnnouncement: data.showTestAnnouncement === true,
							updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : ''
						}
					}
				})
			},
			startOpsConfigPolling() {
				this.stopOpsConfigPolling()
				this.opsConfigTimer = setInterval(() => {
					this.loadOpsConfig()
				}, 10000) as unknown as number
			},
			stopOpsConfigPolling() {
				if (this.opsConfigTimer === null) return
				clearInterval(this.opsConfigTimer as unknown as ReturnType<typeof setInterval>)
				this.opsConfigTimer = null
			},
			validateBmiInputs(): boolean {
				const height = Number(this.height)
				const weight = Number(this.weight)
				const heightMin = this.units === 'metric' ? 80 : 32
				const heightMax = this.units === 'metric' ? 250 : 98
				const weightMin = this.units === 'metric' ? 20 : 44
				const weightMax = this.units === 'metric' ? 300 : 660

				this.bmiErrors = {
					height: Number.isFinite(height) && height >= heightMin && height <= heightMax
						? ''
						: this.copy('error.range', { min: heightMin, max: heightMax, unit: this.heightUnit }),
					weight: Number.isFinite(weight) && weight >= weightMin && weight <= weightMax
						? ''
						: this.copy('error.range', { min: weightMin, max: weightMax, unit: this.weightUnit })
				}

				return !this.bmiErrors.height && !this.bmiErrors.weight
			},
			validateCalorieInputs(): boolean {
				const age = Number(this.age)
				this.calorieErrors = {
					age: Number.isFinite(age) && age >= 13 && age <= 100 ? '' : this.copy('error.range', { min: 13, max: 100, unit: this.copy('unit.years') })
				}
				return !this.calorieErrors.age
			},
			clearLocalData() {
				clearRecords()
				this.records = []
				this.reportActivityEvent('records_clear')
				this.showToast(this.copy('toast.recordsCleared'))
			},
			exportRecords() {
				if (!this.records.length) {
					this.showToast(this.copy('toast.noRecordsToExport'))
					return
				}
				const csv = recordsToCsv(this.records, this.weightUnit)
				uni.setClipboardData({
					data: csv,
					success: () => {
						this.showToast(this.copy('toast.recordsExported'))
					},
					fail: () => {
						this.showToast(this.copy('toast.recordsExportFailed'))
					}
				})
			},
			importRecords(csv: string) {
				const importedRecords = recordsFromCsv(csv)
				if (!importedRecords.length) {
					this.showToast(this.copy('toast.recordsImportFailed'))
					return
				}
				this.records = this.trimRecords(importedRecords, this.recordSettings.maxSavedRecords)
				saveRecords(this.records)
				this.reportActivityEvent('record_write')
				this.showToast(this.copy('toast.recordsImported', { value: this.records.length }))
			},
			openPolicy(type: PolicyType) {
				uni.navigateTo({
					url: `/pages/policy/policy?type=${type}`
				})
			},
			buildSevenDayGuide(): SevenDayGuideItem[] {
				const activityLabel = this.copy(`activity.${this.activity}`)
				const calorieText = this.calorieTarget && this.calorieTarget !== '--' ? `${this.calorieTarget} kcal` : this.copy('guide.calorieFallback')
				const targetText = this.targetProgress.hasTarget ? this.targetProgress.targetText : this.copy('guide.targetFallback')
				const movementText = this.recordProgressSummary.recordCountText
				const goalCopy = this.goal === 'gain'
					? {
						anchor: this.copy('guide.gainAnchor'),
						plate: this.copy('guide.gainPlate'),
						adjust: this.copy('guide.gainAdjust')
					}
					: this.goal === 'maintain'
						? {
							anchor: this.copy('guide.maintainAnchor'),
							plate: this.copy('guide.maintainPlate'),
							adjust: this.copy('guide.maintainAdjust')
						}
						: {
							anchor: this.copy('guide.loseAnchor'),
							plate: this.copy('guide.losePlate'),
							adjust: this.copy('guide.loseAdjust')
						}
				const trendAction = this.records.length >= 2
					? this.copy('guide.trendWithRecords', { movement: movementText, direction: this.recordProgressSummary.directionText.toLowerCase() })
					: this.copy('guide.trendNoRecords')

				return [
					{
						day: this.copy('guide.day', { value: 1 }),
						title: this.copy('guide.day1Title', { goal: this.goalTitle }),
						focus: goalCopy.anchor,
						action: this.copy('guide.day1Action', { calorie: calorieText })
					},
					{
						day: this.copy('guide.day', { value: 2 }),
						title: this.copy('guide.day2Title'),
						focus: this.copy('guide.day2Focus', { goal: this.goalTitle.toLowerCase() }),
						action: goalCopy.plate
					},
					{
						day: this.copy('guide.day', { value: 3 }),
						title: this.copy('guide.day3Title', { activity: activityLabel }),
						focus: this.copy('guide.day3Focus', { activity: activityLabel.toLowerCase() }),
						action: this.activity === 'active'
							? this.copy('guide.day3Active')
							: this.activity === 'light'
								? this.copy('guide.day3Light')
								: this.copy('guide.day3Moderate')
					},
					{
						day: this.copy('guide.day', { value: 4 }),
						title: this.copy('guide.day4Title'),
						focus: this.targetProgress.hasTarget ? this.copy('guide.day4FocusSet', { target: targetText }) : this.copy('guide.day4FocusMissing'),
						action: this.targetProgress.hasTarget
							? this.copy('guide.day4ActionSet', { difference: this.targetProgress.differenceText, status: this.targetProgress.statusText.toLowerCase() })
							: this.copy('guide.day4ActionMissing')
					},
					{
						day: this.copy('guide.day', { value: 5 }),
						title: this.copy('guide.day5Title'),
						focus: this.copy('guide.day5Focus', { movement: movementText }),
						action: trendAction
					},
					{
						day: this.copy('guide.day', { value: 6 }),
						title: this.copy('guide.day6Title'),
						focus: this.copy('guide.day6Focus', { reminder: this.reminderLabel.toLowerCase() }),
						action: this.reminderSetting === 'off'
							? this.copy('guide.day6ActionOff')
							: this.copy('guide.day6ActionOn', { reminder: this.reminderLabel.toLowerCase() })
					},
					{
						day: this.copy('guide.day', { value: 7 }),
						title: this.copy('guide.day7Title'),
						focus: this.copy('guide.day7Focus', { bmi: this.displayBmiValue, calorie: calorieText }),
						action: goalCopy.adjust
					}
				]
			},
			showToast(title: string) {
				this.clearFeedbackTimer()
				this.feedbackMessage = title
				this.feedbackVisible = true
				this.feedbackTimer = setTimeout(() => {
					this.feedbackVisible = false
					this.feedbackTimer = null
				}, 1500) as unknown as number
			},
			clearFeedbackTimer() {
				if (this.feedbackTimer === null) return
				clearTimeout(this.feedbackTimer as unknown as ReturnType<typeof setTimeout>)
				this.feedbackTimer = null
			}
		}
	}
</script>

<style>
	:page {
		background-color: #F4F8F8;
	}

	.app-shell {
		min-height: 100vh;
		padding: calc(40rpx + env(safe-area-inset-top)) 32rpx 0;
		box-sizing: border-box;
		background: #F4F8F8;
		color: #172326;
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
	}

	.app-header {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
		margin-bottom: 4rpx;
	}

	.brand {
		display: block;
		color: #172326;
		font-size: 42rpx;
		font-weight: 800;
		line-height: 1;
	}

	.page-heading {
		display: flex;
		flex-direction: column;
		gap: 2rpx;
	}

	.page-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14rpx;
	}

	.screen-title {
		flex: 1;
		min-width: 0;
		display: block;
		margin: 0;
		color: #172326;
		font-size: 44rpx;
		font-weight: 850;
		line-height: 1.02;
	}

	.screen-subtitle {
		display: block;
		margin: 0;
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.18;
	}

	.context-pill {
		flex-shrink: 0;
		min-width: 80rpx;
		height: 42rpx;
		padding: 0 18rpx;
		border-radius: 999rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 42rpx;
		text-align: center;
	}

	.screen-scroll {
		height: calc(100vh - 212rpx - env(safe-area-inset-top));
		padding-bottom: 190rpx;
	}

	.ops-banner {
		height: 40rpx;
		margin: 0 0 10rpx;
		padding: 0 16rpx;
		border: 2rpx solid #CFE8E5;
		border-radius: 16rpx;
		background: #E6F7F4;
		color: #0F6F66;
		font-size: 21rpx;
		font-weight: 800;
		line-height: 40rpx;
		overflow: hidden;
	}

	.announcement-viewport {
		width: 100%;
		height: 40rpx;
		overflow: hidden;
		white-space: nowrap;
	}

	.announcement-text {
		display: inline-block;
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		vertical-align: top;
	}

	.announcement-text.scrolling {
		max-width: none;
		min-width: 100%;
		padding-left: 90%;
		overflow: visible;
		text-overflow: clip;
		will-change: transform;
		animation: announcement-marquee 22s linear infinite;
	}

	@keyframes announcement-marquee {
		0% {
			transform: translateX(0);
		}
		8% {
			transform: translateX(0);
		}
		92% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	.screen-scroll ::-webkit-scrollbar,
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background: transparent;
	}

	.bottom-nav {
		position: fixed;
		left: 40rpx;
		right: 40rpx;
		bottom: calc(24rpx + env(safe-area-inset-bottom));
		z-index: 20;
		display: flex;
		align-items: center;
		height: 136rpx;
		padding: 16rpx;
		border-radius: 36rpx;
		background: #EDF4F4;
		box-sizing: border-box;
		box-shadow: 0 14rpx 34rpx rgba(23, 35, 38, 0.08);
	}

	.feedback-toast {
		position: fixed;
		left: 50%;
		bottom: calc(184rpx + env(safe-area-inset-bottom));
		z-index: 40;
		max-width: calc(100vw - 96rpx);
		padding: 20rpx 28rpx;
		border: 2rpx solid rgba(15, 159, 143, 0.2);
		border-radius: 999rpx;
		background: rgba(23, 35, 38, 0.92);
		color: #FFFFFF;
		font-size: 24rpx;
		font-weight: 850;
		line-height: 1.25;
		text-align: center;
		box-shadow: 0 18rpx 42rpx rgba(23, 35, 38, 0.2);
		transform: translateX(-50%);
		animation: feedback-pop 220ms ease-out both;
		pointer-events: none;
	}

	.feedback-toast text {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@keyframes feedback-pop {
		from {
			opacity: 0;
			transform: translate(-50%, 16rpx) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0) scale(1);
		}
	}

	.nav-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 104rpx;
		border-radius: 24rpx;
		color: #65787B;
	}

	.nav-item.active {
		background: #FFFFFF;
		color: #0F9F8F;
		box-shadow: 0 2rpx 8rpx rgba(23, 35, 38, 0.05);
	}

	.nav-icon {
		display: block;
		width: 40rpx;
		height: 40rpx;
		margin-bottom: 6rpx;
	}

	.nav-label {
		font-size: 20rpx;
		font-weight: 800;
		line-height: 1.1;
	}

	.line-icon {
		display: block;
		width: 34rpx;
		height: 34rpx;
	}
</style>
