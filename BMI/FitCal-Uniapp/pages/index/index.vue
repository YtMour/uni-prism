<template>
	<view class="app-shell">
		<view class="topbar">
			<text class="brand">FitCal</text>
			<text class="context-pill">{{ currentContext }}</text>
		</view>

		<scroll-view class="screen-scroll" scroll-y>
			<BmiScreen
				v-if="activeTab === 'bmi'"
				:units="units"
				:height="height"
				:weight="weight"
				:height-unit="heightUnit"
				:weight-unit="weightUnit"
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
				@update:sex="sex = $event"
				@update:age="age = $event"
				@update:activity="activity = $event"
				@update:goal="goal = $event"
				@calculate-calories="calculateCalories"
			/>

			<GuidanceScreen
				v-if="activeTab === 'guidance'"
				:goal-title="goalTitle"
				:calorie-target="calorieTarget"
				:meals="meals"
			/>

			<RecordsScreen
				v-if="activeTab === 'records'"
				:current-weight="currentWeight"
				:weight-unit="weightUnit"
				:display-bmi-value="currentRecordBmi"
				:trend-mode="trendMode"
				:trend-points="trendPoints"
				:trend-summary="trendSummary"
				:records="records"
				@update:trendMode="trendMode = $event"
				@add-record="addRecord"
				@delete-record="deleteRecord"
			/>

			<SettingsScreen
				v-if="activeTab === 'settings'"
				:units="units"
				:units-label="unitsLabel"
				:max-saved-records="recordSettings.maxSavedRecords"
				:chart-sample-limit="recordSettings.chartSampleLimit"
				@set-units="setUnits"
				@set-max-saved-records="setMaxSavedRecords"
				@set-chart-sample-limit="setChartSampleLimit"
				@open-policy="openPolicy"
				@clear-local-data="clearLocalData"
			/>
		</scroll-view>

		<view class="bottom-nav">
			<view v-for="item in tabs" :key="item.key" :class="['nav-item', activeTab === item.key ? 'active' : '']" @tap="activeTab = item.key">
				<image class="nav-icon" :src="activeTab === item.key ? item.activeIcon : item.icon" mode="aspectFit"></image>
				<text class="nav-label">{{ item.label }}</text>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import BmiScreen from '../../components/BmiScreen.vue'
	import CaloriesScreen from '../../components/CaloriesScreen.vue'
	import GuidanceScreen from '../../components/GuidanceScreen.vue'
	import RecordsScreen from '../../components/RecordsScreen.vue'
	import SettingsScreen from '../../components/SettingsScreen.vue'
	import type { ActivityKey, BmiCategory, Goal, RecordSettings, Sex, TabKey, TrendMode, TrendPoint, TrendSummary, Units, WeightRecord } from '../../types/fitcal'
	import { ACTIVITY_OPTIONS, DEFAULT_RECORD_SETTINGS, MEALS, TABS } from '../../data/appData'
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
	import { clearRecords, loadRecordSettings, loadRecords, loadUnits, saveRecordSettings, saveRecords, saveUnits } from '../../services/storage'
	import type { PolicyType } from '../../services/policy'

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
		bmiValue: string
		bmiCategory: BmiCategory
		bmr: string
		tdee: string
		calorieTarget: string
		records: WeightRecord[]
		recordSettings: RecordSettings
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
				bmiValue: '22.5',
				bmiCategory: 'Normal weight',
				bmr: '1,420',
				tdee: '2,200',
				calorieTarget: '2,050',
				records: loadRecords(),
				recordSettings: { ...DEFAULT_RECORD_SETTINGS },
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
					calories: 'Goal',
					guidance: 'Plan',
					records: 'Local',
					settings: 'Settings'
				}
				return labels[this.activeTab]
			},
			unitsLabel() {
				return unitsLabel(this.units)
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
			goalTitle() {
				return goalTitle(this.goal)
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
				const title = this.trendMode === 'weight' ? 'Weight trend' : 'BMI trend'
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
			this.calculateCalories()
		},
		methods: {
			restoreLocalData() {
				this.units = loadUnits()
				this.recordSettings = loadRecordSettings()
				this.records = this.trimRecords(loadRecords(), this.recordSettings.maxSavedRecords)
				saveRecords(this.records)
			},
			setUnits(nextUnits: Units) {
				if (this.units === nextUnits) return
				const converted = convertMeasurements(nextUnits, this.units, {
					height: this.height,
					weight: this.weight
				})
				this.height = converted.height
				this.weight = converted.weight
				this.units = nextUnits
				saveUnits(nextUnits)
				this.calculateBmi()
				this.calculateCalories()
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
				this.saveCurrentBmiRecord()
				return true
			},
			calculateCalories(): boolean {
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
			},
			setChartSampleLimit(limit: number) {
				this.recordSettings = {
					...this.recordSettings,
					chartSampleLimit: Math.min(limit, this.recordSettings.maxSavedRecords)
				}
				saveRecordSettings(this.recordSettings)
			},
			formatRecordDate() {
				const now = new Date()
				const month = now.toLocaleString('en-US', { month: 'short' })
				const day = String(now.getDate()).padStart(2, '0')
				const hour = String(now.getHours()).padStart(2, '0')
				const minute = String(now.getMinutes()).padStart(2, '0')
				return `${month} ${day} ${hour}:${minute}`
			},
			compactRecordDate(dateLabel?: string) {
				if (!dateLabel) return '--'
				return dateLabel.replace(/^([A-Z][a-z]{2}) (\d{2}).*$/, '$1 $2')
			},
			deleteRecord(recordId: number) {
				this.records = this.records.filter((record) => record.id !== recordId)
				saveRecords(this.records)
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
						: `Enter ${heightMin}-${heightMax} ${this.heightUnit}.`,
					weight: Number.isFinite(weight) && weight >= weightMin && weight <= weightMax
						? ''
						: `Enter ${weightMin}-${weightMax} ${this.weightUnit}.`
				}

				return !this.bmiErrors.height && !this.bmiErrors.weight
			},
			validateCalorieInputs(): boolean {
				const age = Number(this.age)
				this.calorieErrors = {
					age: Number.isFinite(age) && age >= 13 && age <= 100 ? '' : 'Enter 13-100 yrs.'
				}
				return !this.calorieErrors.age
			},
			clearLocalData() {
				clearRecords()
				this.records = []
			},
			openPolicy(type: PolicyType) {
				uni.navigateTo({
					url: `/pages/policy/policy?type=${type}`
				})
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
		padding: 44rpx 40rpx 0;
		box-sizing: border-box;
		background: #F4F8F8;
		color: #172326;
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 44rpx;
	}

	.brand {
		color: #172326;
		font-size: 48rpx;
		font-weight: 800;
		line-height: 1;
	}

	.context-pill {
		min-width: 96rpx;
		height: 56rpx;
		padding: 0 24rpx;
		border-radius: 999rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 56rpx;
		text-align: center;
	}

	.screen-scroll {
		height: calc(100vh - 132rpx);
		padding-bottom: 190rpx;
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
