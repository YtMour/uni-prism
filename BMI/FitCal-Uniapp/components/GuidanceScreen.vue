<template>
	<view class="screen">
		<view class="result-panel">
			<text class="section-label">{{ goalTitle }}</text>
			<text class="result-number compact-number">{{ calorieTarget }} kcal</text>
			<text class="note no-margin">{{ copy('metric.dailyTarget') }}</text>
		</view>

		<view class="macro-card">
			<view class="donut"></view>
			<view class="macro-list">
				<view class="metric-row"><text>{{ copy('macro.protein') }}</text><text class="metric-value">30%</text></view>
				<view class="metric-row"><text>{{ copy('macro.carbs') }}</text><text class="metric-value">40%</text></view>
				<view class="metric-row"><text>{{ copy('macro.fat') }}</text><text class="metric-value">30%</text></view>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('guidance.goalCheckpoint') }}</text>
			<view class="metric-row">
				<text>{{ copy('records.target') }}</text>
				<text class="metric-value">{{ targetProgress.targetText }}</text>
			</view>
			<view class="metric-row">
				<text>{{ targetProgress.statusText }}</text>
				<text class="metric-value">{{ targetProgress.differenceText }}</text>
			</view>
			<text class="note">{{ targetProgress.hasTarget ? copy('guidance.useCheckpoint') : copy('guidance.setTarget') }}</text>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('guidance.recentMovement') }}</text>
			<view class="metric-row">
				<text>{{ recordProgressSummary.directionText }}</text>
				<text class="metric-value">{{ recordProgressSummary.changeText }}</text>
			</view>
			<text class="note">{{ recordProgressSummary.periodText }}</text>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('guidance.checkInRhythm') }}</text>
			<view class="metric-row">
				<text>{{ copy('guidance.reminder') }}</text>
				<text class="metric-value">{{ reminderLabel }}</text>
			</view>
			<view class="segmented compact">
				<text v-for="option in reminderOptions" :key="option.key" :class="['segmented-item', reminderSetting === option.key ? 'active' : '']" @tap="$emit('set-reminder', option.key)">{{ copy(`reminder.${option.key}`) }}</text>
			</view>
			<text class="note">{{ copy('guidance.reminderNote') }}</text>
		</view>

		<AdPlaceholder :label="copy('ad.guidance')" :test-mode="adTestEnabled" :app-language="appLanguage" @impression="$emit('ad-impression')" @dismiss="$emit('ad-dismiss')" />

		<view v-if="guideUnlocked" class="plain-card guide-card">
			<text class="field-label">{{ copy('guidance.sevenDayGuide') }}</text>
			<view class="guide-row" v-for="item in sevenDayGuide" :key="item.day">
				<text class="guide-day">{{ item.day }}</text>
				<view class="guide-copy">
					<text class="guide-title">{{ item.title }}</text>
					<text class="guide-focus">{{ item.focus }}</text>
					<text class="guide-action">{{ item.action }}</text>
				</view>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('guidance.mealFocus') }}</text>
			<view class="meal-row" v-for="meal in meals" :key="meal.key">
					<text class="meal-icon">{{ meal.key }}</text>
					<view>
					<text class="meal-title">{{ copy(meal.titleKey) }}</text>
					<text class="meal-copy">{{ copy(meal.copyKey) }}</text>
					</view>
			</view>
		</view>

		<button class="primary-button" hover-class="button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('toggle-guide')">{{ guideUnlocked ? copy('guidance.hideGuide') : copy('guidance.openGuide') }}</button>
		<text class="note">{{ copy('guidance.general') }}</text>
	</view>
</template>

	<script lang="ts">
	import { REMINDER_OPTIONS } from '../data/appData'
	import AdPlaceholder from './AdPlaceholder.vue'
	import { t } from '../services/i18n'
	import type { AppLanguage, MealFocus, RecordProgressSummary, ReminderSetting, SevenDayGuideItem, TargetProgress } from '../types/fitcal'

	export default {
		components: {
			AdPlaceholder
		},
		props: {
			goalTitle: { type: String, required: true },
			calorieTarget: { type: String, required: true },
			targetProgress: { type: Object as () => TargetProgress, required: true },
			recordProgressSummary: { type: Object as () => RecordProgressSummary, required: true },
			reminderSetting: { type: String as () => ReminderSetting, required: true },
			reminderLabel: { type: String, required: true },
			adTestEnabled: { type: Boolean, required: true },
			appLanguage: { type: String as () => AppLanguage, required: true },
			meals: { type: Array as () => MealFocus[], required: true },
			guideUnlocked: { type: Boolean, required: true },
			sevenDayGuide: { type: Array as () => SevenDayGuideItem[], required: true }
		},
		computed: {
			reminderOptions() {
				return REMINDER_OPTIONS
			}
		},
		methods: {
			copy(key: string) {
				return t(this.appLanguage, key)
			}
		},
		emits: ['ad-impression', 'ad-dismiss', 'toggle-guide', 'set-reminder']
	}
</script>
