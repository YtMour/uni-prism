<template>
	<view class="screen">
		<text class="screen-title">BMI Calculator</text>
		<text class="screen-subtitle">Check your body mass index in seconds.</text>

		<view class="segmented">
			<text :class="['segmented-item', units === 'metric' ? 'active' : '']" @tap="$emit('set-units', 'metric')">Metric</text>
			<text :class="['segmented-item', units === 'imperial' ? 'active' : '']" @tap="$emit('set-units', 'imperial')">Imperial</text>
		</view>

		<view class="input-grid">
			<view class="input-card">
				<view class="field-label-row">
					<image class="line-icon" src="/static/icons/ruler.svg" mode="aspectFit"></image>
					<text class="field-label">Height</text>
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
					<text class="field-label">Weight</text>
				</view>
				<view class="input-row">
					<input class="field-input" type="digit" v-model="weightModel" />
					<text class="unit-label">{{ weightUnit }}</text>
				</view>
				<text v-if="bmiErrors.weight" class="error-text">{{ bmiErrors.weight }}</text>
			</view>
		</view>

		<button class="primary-button" @tap="$emit('calculate-bmi')">Calculate BMI</button>

		<view class="result-panel">
			<text class="section-label">Your result</text>
			<text class="result-number">{{ displayBmiValue }}</text>
			<text v-if="!bmiHasError" class="status-badge">{{ bmiCategory }}</text>
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
				<text class="metric-value">{{ displayHealthyRange }}</text>
			</view>
			<text class="note">Results are estimates for general wellness reference only.</text>
		</view>
	</view>
</template>

<script lang="ts">
	import type { BmiCategory, Units } from '../types/fitcal'

	export default {
		props: {
			units: { type: String as () => Units, required: true },
			height: { type: String, required: true },
			weight: { type: String, required: true },
			heightUnit: { type: String, required: true },
			weightUnit: { type: String, required: true },
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
			}
		}
	}
</script>
