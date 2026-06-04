<template>
	<view class="screen">
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
</template>

<script lang="ts">
	import type { MealFocus } from '../types/fitcal'

	export default {
		props: {
			goalTitle: { type: String, required: true },
			calorieTarget: { type: String, required: true },
			meals: { type: Array as () => MealFocus[], required: true }
		}
	}
</script>
