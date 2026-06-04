<template>
	<view class="screen">
		<text class="screen-title">Calories</text>
		<text class="screen-subtitle">Estimate BMR, TDEE, and daily target.</text>

		<view class="input-grid">
			<view class="input-card">
				<text class="field-label">Sex</text>
				<view class="segmented compact">
					<text :class="['segmented-item', sex === 'female' ? 'active' : '']" @tap="$emit('update:sex', 'female')">Female</text>
					<text :class="['segmented-item', sex === 'male' ? 'active' : '']" @tap="$emit('update:sex', 'male')">Male</text>
				</view>
			</view>
			<view class="input-card">
				<text class="field-label">Age</text>
				<view class="input-row">
					<input class="field-input" type="number" v-model="ageModel" />
					<text class="unit-label">yrs</text>
				</view>
				<text v-if="calorieErrors.age" class="error-text">{{ calorieErrors.age }}</text>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">Activity level</text>
			<view class="chip-row">
				<text v-for="item in activityOptions" :key="item.key" :class="['chip', activity === item.key ? 'active' : '']" @tap="$emit('update:activity', item.key)">{{ item.label }}</text>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">Goal</text>
			<view class="segmented compact">
				<text :class="['segmented-item', goal === 'maintain' ? 'active' : '']" @tap="$emit('update:goal', 'maintain')">Maintain</text>
				<text :class="['segmented-item', goal === 'lose' ? 'active' : '']" @tap="$emit('update:goal', 'lose')">Lose</text>
				<text :class="['segmented-item', goal === 'gain' ? 'active' : '']" @tap="$emit('update:goal', 'gain')">Gain</text>
			</view>
		</view>

		<button class="primary-button" @tap="$emit('calculate-calories')">Calculate Calories</button>

		<view class="result-panel">
			<view class="metric-row"><text>BMR</text><text class="metric-value">{{ bmr }}</text></view>
			<view class="metric-row"><text>TDEE</text><text class="metric-value">{{ tdee }}</text></view>
			<view class="metric-row"><text>Daily target</text><text class="metric-value">{{ calorieTarget }} kcal</text></view>
		</view>

		<AdPlaceholder label="AD SLOT - RESULT PAGE" />
	</view>
</template>

<script lang="ts">
	import AdPlaceholder from './AdPlaceholder.vue'
	import type { ActivityKey, ActivityOption, Goal, Sex } from '../types/fitcal'

	export default {
		components: {
			AdPlaceholder
		},
		props: {
			sex: { type: String as () => Sex, required: true },
			age: { type: String, required: true },
			activity: { type: String as () => ActivityKey, required: true },
			goal: { type: String as () => Goal, required: true },
			activityOptions: { type: Array as () => ActivityOption[], required: true },
			calorieErrors: { type: Object as () => Record<'age', string>, required: true },
			bmr: { type: String, required: true },
			tdee: { type: String, required: true },
			calorieTarget: { type: String, required: true }
		},
		emits: ['update:sex', 'update:age', 'update:activity', 'update:goal', 'calculate-calories'],
		computed: {
			ageModel: {
				get(): string {
					return this.age
				},
				set(value: string) {
					this.$emit('update:age', value)
				}
			}
		}
	}
</script>
