<template>
	<view class="screen">
		<view class="segmented">
			<text :class="['segmented-item', units === 'metric' ? 'active' : '']" @tap="$emit('set-units', 'metric')">{{ copy('unit.metric') }}</text>
			<text :class="['segmented-item', units === 'imperial' ? 'active' : '']" @tap="$emit('set-units', 'imperial')">{{ copy('unit.imperial') }}</text>
		</view>

		<view class="input-grid">
			<view class="input-card">
				<view class="field-label-row">
					<image class="line-icon" src="/static/icons/ruler.svg" mode="aspectFit"></image>
					<text class="field-label">{{ copy('field.height') }}</text>
				</view>
				<view class="input-row">
					<input class="field-input" type="digit" v-model="heightModel" />
					<text class="unit-label">{{ heightUnit }}</text>
				</view>
				<text v-if="bmiErrors.height" class="error-text">{{ bmiErrors.height }}</text>
			</view>
			<view class="input-card">
				<view class="field-label-row">
					<image class="line-icon" src="/static/icons/scale.svg" mode="aspectFit"></image>
					<text class="field-label">{{ copy('field.weight') }}</text>
				</view>
				<view class="input-row">
					<input class="field-input" type="digit" v-model="weightModel" />
					<text class="unit-label">{{ weightUnit }}</text>
				</view>
				<text v-if="bmiErrors.weight" class="error-text">{{ bmiErrors.weight }}</text>
			</view>
		</view>

		<button class="primary-button" hover-class="button-press" hover-start-time="0" hover-stay-time="120" @tap="$emit('calculate-bmi')">{{ copy('action.calculateBmi') }}</button>

		<view class="result-panel">
			<text class="section-label">{{ copy('bmi.result') }}</text>
			<text class="result-number">{{ displayBmiValue }}</text>
			<text v-if="!bmiHasError" class="status-badge">{{ translatedBmiCategory }}</text>
			<view class="range-meter"><view class="range-marker" :style="{ left: bmiMarkerLeft }"></view></view>
			<view class="range-labels">
				<text>{{ copy('bmi.under') }}</text>
				<text class="healthy">{{ copy('bmi.normal') }}</text>
				<text>{{ copy('bmi.over') }}</text>
				<text>{{ copy('bmi.obesity') }}</text>
			</view>
		</view>

		<view class="plain-card">
			<view class="metric-row">
				<text>{{ copy('bmi.healthyRange') }}</text>
				<text class="metric-value">{{ displayHealthyRange }}</text>
			</view>
			<text class="note">{{ copy('note.estimate') }}</text>
		</view>
	</view>
</template>

<script lang="ts">
	import { t } from '../services/i18n'
	import type { AppLanguage, BmiCategory, Units } from '../types/fitcal'

	export default {
		props: {
			units: { type: String as () => Units, required: true },
			height: { type: String, required: true },
			weight: { type: String, required: true },
			heightUnit: { type: String, required: true },
			weightUnit: { type: String, required: true },
			appLanguage: { type: String as () => AppLanguage, required: true },
			bmiErrors: { type: Object as () => Record<'height' | 'weight', string>, required: true },
			displayBmiValue: { type: String, required: true },
			bmiCategory: { type: String as () => BmiCategory, required: true },
			bmiHasError: { type: Boolean, required: true },
			bmiMarkerLeft: { type: String, required: true },
			displayHealthyRange: { type: String, required: true }
		},
		emits: ['set-units', 'update:height', 'update:weight', 'calculate-bmi'],
		computed: {
			heightModel: {
				get(): string {
					return this.height
				},
				set(value: string) {
					this.$emit('update:height', value)
				}
			},
			weightModel: {
				get(): string {
					return this.weight
				},
				set(value: string) {
					this.$emit('update:weight', value)
				}
			},
			translatedBmiCategory() {
				const keys: Record<BmiCategory, string> = {
					Underweight: 'bmi.category.underweight',
					'Normal weight': 'bmi.category.normal',
					Overweight: 'bmi.category.overweight',
					Obesity: 'bmi.category.obesity'
				}
				return this.copy(keys[this.bmiCategory])
			}
		},
		methods: {
			copy(key: string) {
				return t(this.appLanguage, key)
			}
		}
	}
</script>
