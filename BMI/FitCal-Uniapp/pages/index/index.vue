<template>
	<view class="app-shell">
		<view class="topbar">
			<text class="brand">FitCal</text>
			<text class="context-pill">{{ currentContext }}</text>
		</view>

		<scroll-view class="screen-scroll" scroll-y>
			<view v-if="activeTab === 'bmi'" class="screen">
				<text class="screen-title">BMI Calculator</text>
				<text class="screen-subtitle">Check your body mass index in seconds.</text>

				<view class="segmented">
					<text :class="['segmented-item', units === 'metric' ? 'active' : '']" @tap="setUnits('metric')">Metric</text>
					<text :class="['segmented-item', units === 'imperial' ? 'active' : '']" @tap="setUnits('imperial')">Imperial</text>
				</view>

				<view class="input-grid">
					<view class="input-card">
						<view class="field-label-row">
							<image class="line-icon" src="/static/icons/ruler.svg" mode="aspectFit"></image>
							<text class="field-label">Height</text>
						</view>
						<view class="input-row">
							<input class="field-input" type="digit" v-model="height" />
							<text class="unit-label">{{ heightUnit }}</text>
						</view>
					</view>
					<view class="input-card">
						<view class="field-label-row">
							<image class="line-icon" src="/static/icons/scale.svg" mode="aspectFit"></image>
							<text class="field-label">Weight</text>
						</view>
						<view class="input-row">
							<input class="field-input" type="digit" v-model="weight" />
							<text class="unit-label">{{ weightUnit }}</text>
						</view>
					</view>
				</view>

				<button class="primary-button" @tap="calculateBmi">Calculate BMI</button>

				<view class="result-panel">
					<text class="section-label">Your result</text>
					<text class="result-number">{{ bmiValue }}</text>
					<text class="status-badge">{{ bmiCategory }}</text>
					<view class="range-meter"><view class="range-marker" :style="{ left: bmiMarkerLeft }"></view></view>
					<view class="range-labels">
						<text>Under</text>
						<text class="healthy">Normal</text>
						<text>Over</text>
						<text>Obesity</text>
					</view>
				</view>

				<view class="plain-card">
					<view class="metric-row">
						<text>Healthy range</text>
						<text class="metric-value">{{ healthyRange }}</text>
					</view>
					<text class="note">Results are estimates for general wellness reference only.</text>
				</view>
			</view>

			<view v-if="activeTab === 'calories'" class="screen">
				<text class="screen-title">Calories</text>
				<text class="screen-subtitle">Estimate BMR, TDEE, and daily target.</text>

				<view class="input-grid">
					<view class="input-card">
						<text class="field-label">Sex</text>
						<view class="segmented compact">
							<text :class="['segmented-item', sex === 'female' ? 'active' : '']" @tap="sex = 'female'">Female</text>
							<text :class="['segmented-item', sex === 'male' ? 'active' : '']" @tap="sex = 'male'">Male</text>
						</view>
					</view>
					<view class="input-card">
						<text class="field-label">Age</text>
						<view class="input-row">
							<input class="field-input" type="number" v-model="age" />
							<text class="unit-label">yrs</text>
						</view>
					</view>
				</view>

				<view class="plain-card">
					<text class="field-label">Activity level</text>
					<view class="chip-row">
						<text v-for="item in activityOptions" :key="item.key" :class="['chip', activity === item.key ? 'active' : '']" @tap="activity = item.key">{{ item.label }}</text>
					</view>
				</view>

				<view class="plain-card">
					<text class="field-label">Goal</text>
					<view class="segmented compact">
						<text :class="['segmented-item', goal === 'maintain' ? 'active' : '']" @tap="goal = 'maintain'">Maintain</text>
						<text :class="['segmented-item', goal === 'lose' ? 'active' : '']" @tap="goal = 'lose'">Lose</text>
						<text :class="['segmented-item', goal === 'gain' ? 'active' : '']" @tap="goal = 'gain'">Gain</text>
					</view>
				</view>

				<button class="primary-button" @tap="calculateCalories">Calculate Calories</button>

				<view class="result-panel">
					<view class="metric-row"><text>BMR</text><text class="metric-value">{{ bmr }}</text></view>
					<view class="metric-row"><text>TDEE</text><text class="metric-value">{{ tdee }}</text></view>
					<view class="metric-row"><text>Daily target</text><text class="metric-value">{{ calorieTarget }} kcal</text></view>
				</view>

				<view class="ad-slot">AD SLOT - RESULT PAGE</view>
			</view>

			<view v-if="activeTab === 'guidance'" class="screen">
				<text class="screen-title">Guidance</text>
				<text class="screen-subtitle">Simple guidance based on your goal.</text>

				<view class="result-panel">
					<text class="section-label">{{ goalTitle }}</text>
					<text class="result-number compact-number">{{ calorieTarget }} kcal</text>
					<text class="note no-margin">Daily target</text>
				</view>

				<view class="macro-card">
					<view class="donut"></view>
					<view class="macro-list">
						<view class="metric-row"><text>Protein</text><text class="metric-value">30%</text></view>
						<view class="metric-row"><text>Carbs</text><text class="metric-value">40%</text></view>
						<view class="metric-row"><text>Fat</text><text class="metric-value">30%</text></view>
					</view>
				</view>

				<view class="ad-slot">AD SLOT - GUIDANCE</view>

				<view class="plain-card">
					<text class="field-label">Meal focus</text>
					<view class="meal-row" v-for="meal in meals" :key="meal.key">
						<text class="meal-icon">{{ meal.key }}</text>
						<view>
							<text class="meal-title">{{ meal.title }}</text>
							<text class="meal-copy">{{ meal.copy }}</text>
						</view>
					</view>
				</view>

				<button class="primary-button">Unlock 7-Day Guide</button>
				<text class="note">General wellness guidance only.</text>
			</view>

			<view v-if="activeTab === 'records'" class="screen">
				<text class="screen-title">Records</text>
				<text class="screen-subtitle">Track weight and BMI trends locally.</text>

				<view class="input-grid">
					<view class="result-panel mini-panel">
						<text class="section-label">Current</text>
						<text class="mini-number">{{ currentWeight }} {{ weightUnit }}</text>
					</view>
					<view class="result-panel mini-panel">
						<text class="section-label">BMI</text>
						<text class="mini-number">{{ bmiValue }}</text>
					</view>
				</view>

				<view class="segmented compact">
					<text :class="['segmented-item', trendMode === 'weight' ? 'active' : '']" @tap="trendMode = 'weight'">Weight Trend</text>
					<text :class="['segmented-item', trendMode === 'bmi' ? 'active' : '']" @tap="trendMode = 'bmi'">BMI Trend</text>
				</view>

				<view class="trend-card">
					<view class="chart-grid"></view>
					<view class="trend-line"></view>
					<text class="trend-dot dot-one"></text>
					<text class="trend-dot dot-two"></text>
					<text class="trend-dot dot-three"></text>
					<text class="trend-dot dot-four"></text>
				</view>

				<button class="primary-button" @tap="addRecord">Add Record</button>

				<view class="plain-card">
					<text class="field-label">Recent records</text>
					<view class="record-row" v-for="record in records" :key="record.id">
						<text class="record-weight">{{ record.weight }} {{ weightUnit }}</text>
						<text class="record-meta">{{ record.date }} · BMI {{ record.bmi }}</text>
					</view>
				</view>
				<text class="note">Local data only</text>
			</view>

			<view v-if="activeTab === 'settings'" class="screen">
				<text class="screen-title">Settings</text>
				<text class="screen-subtitle">Manage units, privacy, and local data.</text>

				<view class="plain-card">
					<view class="setting-row">
						<view class="setting-title"><image class="line-icon" src="/static/icons/ruler.svg" mode="aspectFit"></image><text>Units</text></view>
						<text class="setting-value">{{ unitsLabel }}</text>
					</view>
					<view class="segmented compact">
						<text :class="['segmented-item', units === 'metric' ? 'active' : '']" @tap="setUnits('metric')">Metric</text>
						<text :class="['segmented-item', units === 'imperial' ? 'active' : '']" @tap="setUnits('imperial')">Imperial</text>
					</view>
				</view>

				<view class="plain-card">
					<view class="setting-row">
						<view class="setting-title"><image class="line-icon" src="/static/icons/globe.svg" mode="aspectFit"></image><text>Language</text></view>
						<text class="setting-value">English</text>
					</view>
					<text class="note">More languages can be added after launch.</text>
				</view>

				<view class="plain-card">
					<view class="link-row" @tap="openPolicy('Privacy Policy')">
						<view class="setting-title"><image class="line-icon" src="/static/icons/shield.svg" mode="aspectFit"></image><text>Privacy Policy</text></view>
						<text class="setting-value">View</text>
					</view>
					<view class="link-row" @tap="openPolicy('Disclaimer')">
						<view class="setting-title"><image class="line-icon" src="/static/icons/shield.svg" mode="aspectFit"></image><text>Disclaimer</text></view>
						<text class="setting-value">View</text>
					</view>
				</view>

				<button class="danger-button" @tap="clearLocalData"><image class="line-icon" src="/static/icons/trash.svg" mode="aspectFit"></image> Clear local data</button>

				<view class="plain-card">
					<view class="metric-row"><text>App version</text><text class="metric-value">1.0.0</text></view>
					<text class="note">FitCal stores records on this device only.</text>
				</view>
			</view>
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
	import type { ActivityKey, BmiCategory, Goal, Sex, TabKey, TrendMode, Units, WeightRecord } from '../../types/fitcal'
	import { ACTIVITY_OPTIONS, MEALS, TABS } from '../../data/appData'
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
	import { clearRecords, loadRecords, loadUnits, saveRecords, saveUnits } from '../../services/storage'
	import { policyContent } from '../../services/policy'

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
		tabs: typeof TABS
		activityOptions: typeof ACTIVITY_OPTIONS
		meals: typeof MEALS
	}

	export default {
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
			healthyRange() {
				return healthyRange(this.height, this.units)
			},
			bmiMarkerLeft() {
				return bmiMarkerLeft(this.bmiValue)
			},
			goalTitle() {
				return goalTitle(this.goal)
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
				this.records = loadRecords()
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
			calculateBmi() {
				const result = calculateBmiResult(this.height, this.weight, this.units)
				if (!result) return
				this.bmiValue = result.value
				this.bmiCategory = result.category
			},
			calculateCalories() {
				const result = calculateCaloriesResult({
					age: this.age,
					height: this.height,
					weight: this.weight,
					units: this.units,
					sex: this.sex,
					activity: this.activity,
					goal: this.goal
				})
				if (!result) return
				this.bmr = result.bmr
				this.tdee = result.tdee
				this.calorieTarget = result.calorieTarget
			},
			addRecord() {
				this.calculateBmi()
				const record = {
					id: Date.now(),
					weight: Number(this.weight).toFixed(1),
					bmi: this.bmiValue,
					date: 'Today'
				}
				this.records = [record, ...this.records].slice(0, 5)
				saveRecords(this.records)
			},
			clearLocalData() {
				clearRecords()
				this.records = []
			},
			openPolicy(title: string) {
				uni.showModal({
					title,
					content: policyContent(title),
					showCancel: false,
					confirmColor: '#0F9F8F'
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

	.screen {
		padding-bottom: 28rpx;
	}

	.screen-title {
		display: block;
		margin-bottom: 14rpx;
		color: #172326;
		font-size: 60rpx;
		font-weight: 800;
		line-height: 1.08;
	}

	.screen-subtitle {
		display: block;
		margin-bottom: 34rpx;
		color: #65787B;
		font-size: 30rpx;
		line-height: 1.35;
	}

	.segmented {
		display: flex;
		height: 80rpx;
		margin-bottom: 24rpx;
		padding: 8rpx;
		gap: 8rpx;
		border-radius: 16rpx;
		background: #EAF2F2;
		box-sizing: border-box;
	}

	.segmented.compact {
		height: 84rpx;
		margin-bottom: 0;
	}

	.segmented-item {
		flex: 1;
		height: 64rpx;
		border-radius: 14rpx;
		color: #65787B;
		font-size: 26rpx;
		font-weight: 800;
		line-height: 64rpx;
		text-align: center;
	}

	.segmented-item.active {
		background: #FFFFFF;
		color: #0F9F8F;
		box-shadow: 0 2rpx 8rpx rgba(23, 35, 38, 0.08);
	}

	.input-grid {
		display: flex;
		gap: 24rpx;
		margin-bottom: 28rpx;
	}

	.input-grid > view {
		flex: 1;
		min-width: 0;
	}

	.input-card,
	.plain-card {
		padding: 30rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		margin-bottom: 28rpx;
	}

	.input-card {
		min-height: 212rpx;
		margin-bottom: 0;
	}

	.field-label-row,
	.setting-title {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.field-label,
	.section-label {
		display: block;
		margin-bottom: 20rpx;
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 1.2;
	}

	.input-row {
		display: flex;
		align-items: center;
		height: 96rpx;
		padding: 0 24rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
	}

	.field-input {
		flex: 1;
		min-width: 0;
		height: 88rpx;
		color: #172326;
		font-size: 40rpx;
		font-weight: 800;
	}

	.unit-label {
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
	}

	.primary-button {
		width: 100%;
		height: 104rpx;
		margin: 0 0 28rpx;
		border: 0;
		border-radius: 16rpx;
		background: #F06F5D;
		color: #FFFFFF;
		font-size: 34rpx;
		font-weight: 800;
		line-height: 104rpx;
	}

	.primary-button::after,
	.danger-button::after {
		border: 0;
	}

	.result-panel {
		padding: 34rpx;
		margin-bottom: 28rpx;
		border: 2rpx solid #BFE9E3;
		border-radius: 16rpx;
		background: #EAF9F6;
		box-sizing: border-box;
	}

	.result-number {
		display: block;
		color: #172326;
		font-size: 100rpx;
		font-weight: 850;
		line-height: 1;
	}

	.compact-number {
		font-size: 72rpx;
	}

	.status-badge {
		display: inline-block;
		margin-top: 18rpx;
		padding: 14rpx 20rpx;
		border-radius: 999rpx;
		background: #E9F8EB;
		color: #267D32;
		font-size: 26rpx;
		font-weight: 850;
	}

	.range-meter {
		position: relative;
		height: 22rpx;
		margin-top: 40rpx;
		border-radius: 999rpx;
		background: linear-gradient(90deg, #42A5D5 0 24%, #58A85F 24% 50%, #F4B84F 50% 74%, #F06F5D 74% 100%);
	}

	.range-marker {
		position: absolute;
		top: 24rpx;
		width: 0;
		height: 0;
		margin-left: -14rpx;
		border-left: 14rpx solid transparent;
		border-right: 14rpx solid transparent;
		border-bottom: 20rpx solid #0F9F8F;
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		margin-top: 38rpx;
		color: #65787B;
		font-size: 22rpx;
		font-weight: 800;
	}

	.range-labels .healthy {
		color: #2B8A3E;
	}

	.metric-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
		padding: 18rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
		color: #172326;
		font-size: 30rpx;
	}

	.metric-row:last-child {
		border-bottom: 0;
	}

	.metric-value {
		color: #172326;
		font-size: 36rpx;
		font-weight: 800;
		text-align: right;
	}

	.note {
		display: block;
		margin-top: 16rpx;
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.45;
	}

	.no-margin {
		margin-top: 0;
	}

	.chip-row {
		display: flex;
		gap: 16rpx;
		flex-wrap: wrap;
	}

	.chip {
		padding: 16rpx 22rpx;
		border-radius: 999rpx;
		background: #EDF4F4;
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
	}

	.chip.active {
		background: #E6F7F4;
		color: #0F9F8F;
	}

	.ad-slot {
		height: 100rpx;
		margin-bottom: 28rpx;
		border: 2rpx dashed #A9C4C3;
		border-radius: 16rpx;
		background: #FBFDFD;
		color: #7C9598;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 100rpx;
		text-align: center;
	}

	.macro-card {
		display: flex;
		align-items: center;
		gap: 30rpx;
		padding: 30rpx;
		margin-bottom: 28rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
	}

	.donut {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		background: conic-gradient(#0F9F8F 0 30%, #F4B84F 30% 70%, #58A85F 70% 100%);
	}

	.macro-list {
		flex: 1;
	}

	.meal-row {
		display: flex;
		gap: 24rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.meal-row:last-child {
		border-bottom: 0;
	}

	.meal-icon {
		width: 68rpx;
		height: 68rpx;
		border-radius: 16rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 900;
		line-height: 68rpx;
		text-align: center;
	}

	.meal-title {
		display: block;
		margin-bottom: 6rpx;
		color: #172326;
		font-size: 32rpx;
		font-weight: 800;
	}

	.meal-copy {
		display: block;
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.35;
	}

	.mini-panel {
		min-height: 154rpx;
		padding: 30rpx;
		margin-bottom: 0;
	}

	.mini-number {
		display: block;
		color: #172326;
		font-size: 54rpx;
		font-weight: 850;
		line-height: 1;
		white-space: nowrap;
	}

	.trend-card {
		position: relative;
		height: 388rpx;
		margin: 28rpx 0;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		overflow: hidden;
	}

	.chart-grid {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(to bottom, transparent, transparent 84rpx, #EAF1F1 86rpx);
	}

	.trend-line {
		position: absolute;
		left: 48rpx;
		right: 48rpx;
		bottom: 106rpx;
		height: 72rpx;
		border-bottom: 8rpx solid #0F9F8F;
		border-radius: 999rpx;
		transform: skewY(-8deg);
	}

	.trend-dot {
		position: absolute;
		width: 18rpx;
		height: 18rpx;
		border-radius: 50%;
		background: #F06F5D;
		box-shadow: 0 0 0 10rpx #FDE1DC;
	}

	.dot-one { left: 86rpx; top: 226rpx; }
	.dot-two { left: 236rpx; top: 184rpx; }
	.dot-three { left: 386rpx; top: 150rpx; }
	.dot-four { left: 542rpx; top: 106rpx; }

	.record-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.record-row:last-child {
		border-bottom: 0;
	}

	.record-weight {
		color: #172326;
		font-size: 30rpx;
		font-weight: 800;
	}

	.record-meta {
		color: #65787B;
		font-size: 24rpx;
		text-align: right;
	}

	.setting-row,
	.link-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
		color: #172326;
		font-size: 32rpx;
		font-weight: 800;
	}

	.link-row {
		padding: 18rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.link-row:last-child {
		border-bottom: 0;
	}

	.setting-value {
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 800;
	}

	.danger-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14rpx;
		width: 100%;
		height: 96rpx;
		margin: 0 0 28rpx;
		border: 2rpx solid #F4B9AE;
		border-radius: 16rpx;
		background: #FFF6F4;
		color: #C64F3F;
		font-size: 30rpx;
		font-weight: 800;
		line-height: 96rpx;
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
