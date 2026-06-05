<template>
	<view class="screen">
		<view class="input-grid">
			<view class="input-card">
				<text class="field-label">{{ copy('field.sex') }}</text>
				<view class="segmented compact">
					<text :class="['segmented-item', sex === 'female' ? 'active' : '']" @tap="$emit('update:sex', 'female')">{{ copy('sex.female') }}</text>
					<text :class="['segmented-item', sex === 'male' ? 'active' : '']" @tap="$emit('update:sex', 'male')">{{ copy('sex.male') }}</text>
				</view>
			</view>
			<view class="input-card">
				<text class="field-label">{{ copy('field.age') }}</text>
				<view class="input-row">
					<input class="field-input" type="number" v-model="ageModel" />
					<text class="unit-label">{{ copy('unit.years') }}</text>
				</view>
				<text v-if="calorieErrors.age" class="error-text">{{ calorieErrors.age }}</text>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('field.activity') }}</text>
			<view class="chip-row">
				<text v-for="item in activityOptions" :key="item.key" :class="['chip', activity === item.key ? 'active' : '']" @tap="$emit('update:activity', item.key)">{{ copy(`activity.${item.key}`) }}</text>
			</view>
		</view>

		<view class="plain-card">
			<text class="field-label">{{ copy('field.goal') }}</text>
			<view class="segmented compact">
				<text :class="['segmented-item', goal === 'maintain' ? 'active' : '']" @tap="$emit('update:goal', 'maintain')">{{ copy('goal.maintain') }}</text>
				<text :class="['segmented-item', goal === 'lose' ? 'active' : '']" @tap="$emit('update:goal', 'lose')">{{ copy('goal.lose') }}</text>
				<text :class="['segmented-item', goal === 'gain' ? 'active' : '']" @tap="$emit('update:goal', 'gain')">{{ copy('goal.gain') }}</text>
			</view>
		</view>

		<button class="primary-button" hover-class="button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('calculate-calories')">{{ copy('action.calculateCalories') }}</button>

		<view class="result-panel">
			<view class="metric-row"><text>BMR</text><text class="metric-value">{{ bmr }}</text></view>
			<view class="metric-row"><text>TDEE</text><text class="metric-value">{{ tdee }}</text></view>
			<view class="metric-row"><text>{{ copy('metric.dailyTarget') }}</text><text class="metric-value">{{ calorieTarget }} kcal</text></view>
		</view>

		<AdPlaceholder :label="copy('ad.resultPage')" :test-mode="adTestEnabled" :app-language="appLanguage" @impression="$emit('ad-impression')" @dismiss="$emit('ad-dismiss')" />
	</view>
</template>

<script lang="ts">
	import AdPlaceholder from './AdPlaceholder.vue'
	import { t } from '../services/i18n'
	import type { ActivityKey, ActivityOption, AppLanguage, Goal, Sex } from '../types/fitcal'

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
			calorieTarget: { type: String, required: true },
			adTestEnabled: { type: Boolean, required: true },
			appLanguage: { type: String as () => AppLanguage, required: true }
		},
		emits: ['update:sex', 'update:age', 'update:activity', 'update:goal', 'calculate-calories', 'ad-impression', 'ad-dismiss'],
		computed: {
			ageModel: {
				get(): string {
					return this.age
				},
				set(value: string) {
					this.$emit('update:age', value)
				}
			}
		},
		methods: {
			copy(key: string) {
				return t(this.appLanguage, key)
			}
		}
	}
</script>
