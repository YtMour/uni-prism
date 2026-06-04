<template>
	<view class="screen">
		<text class="screen-title">Settings</text>
		<text class="screen-subtitle">Manage units, privacy, and local data.</text>

		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/ruler.svg" mode="aspectFit"></image><text>Units</text></view>
				<text class="setting-value">{{ unitsLabel }}</text>
			</view>
			<view class="segmented compact">
				<text :class="['segmented-item', units === 'metric' ? 'active' : '']" @tap="$emit('set-units', 'metric')">Metric</text>
				<text :class="['segmented-item', units === 'imperial' ? 'active' : '']" @tap="$emit('set-units', 'imperial')">Imperial</text>
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
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/bars.svg" mode="aspectFit"></image><text>Max saved records</text></view>
				<text class="setting-value">{{ maxSavedRecords }}</text>
			</view>
			<view class="chip-row setting-chip-row">
				<text v-for="option in recordLimitOptions" :key="option" :class="['chip', maxSavedRecords === option ? 'active' : '']" @tap="$emit('set-max-saved-records', option)">{{ option }}</text>
			</view>
			<text class="note">Older records are removed when the limit is lowered.</text>
		</view>

		<view class="plain-card">
			<view class="setting-row">
				<view class="setting-title"><image class="line-icon" src="/static/icons/bars.svg" mode="aspectFit"></image><text>Chart samples</text></view>
				<text class="setting-value">{{ chartSampleLimit }}</text>
			</view>
			<view class="chip-row setting-chip-row">
				<text v-for="option in availableChartSampleOptions" :key="option" :class="['chip', chartSampleLimit === option ? 'active' : '']" @tap="$emit('set-chart-sample-limit', option)">{{ option }}</text>
			</view>
			<text class="note">Trend uses the newest records only.</text>
		</view>

		<view class="plain-card">
			<view class="link-row" @tap="$emit('open-policy', 'privacy')">
				<view class="setting-title"><image class="line-icon" src="/static/icons/shield.svg" mode="aspectFit"></image><text>Privacy Policy</text></view>
				<text class="setting-value">View</text>
			</view>
			<view class="link-row" @tap="$emit('open-policy', 'disclaimer')">
				<view class="setting-title"><image class="line-icon" src="/static/icons/shield.svg" mode="aspectFit"></image><text>Disclaimer</text></view>
				<text class="setting-value">View</text>
			</view>
		</view>

		<button class="danger-button" @tap="$emit('clear-local-data')"><image class="line-icon" src="/static/icons/trash.svg" mode="aspectFit"></image> Clear local data</button>

		<view class="plain-card">
			<view class="metric-row"><text>App version</text><text class="metric-value">1.0.0</text></view>
			<text class="note">FitCal stores records on this device only.</text>
		</view>
	</view>
</template>

<script lang="ts">
	import { CHART_SAMPLE_OPTIONS, RECORD_LIMIT_OPTIONS } from '../data/appData'
	import type { PolicyType } from '../services/policy'
	import type { Units } from '../types/fitcal'

	export default {
		props: {
			units: { type: String as () => Units, required: true },
			unitsLabel: { type: String, required: true },
			maxSavedRecords: { type: Number, required: true },
			chartSampleLimit: { type: Number, required: true }
		},
		computed: {
			recordLimitOptions() {
				return RECORD_LIMIT_OPTIONS
			},
			availableChartSampleOptions() {
				return CHART_SAMPLE_OPTIONS.filter((option) => option <= this.maxSavedRecords)
			}
		},
		emits: {
			'set-units': (_units: Units) => true,
			'set-max-saved-records': (_limit: number) => true,
			'set-chart-sample-limit': (_limit: number) => true,
			'open-policy': (_type: PolicyType) => true,
			'clear-local-data': () => true
		}
	}
</script>
