<template>
	<view v-if="visible && testMode" class="ad-slot test-mode">
		<view class="ad-slot-copy">
			<text class="ad-slot-label">{{ label }}</text>
			<text v-if="testMode" class="ad-slot-title">{{ copy('ad.title') }}</text>
			<text v-if="testMode" class="ad-slot-note">{{ copy('ad.note') }}</text>
		</view>
		<text v-if="testMode" class="ad-slot-close" @tap="dismiss">{{ copy('ad.close') }}</text>
	</view>
</template>

<script lang="ts">
	import { t } from '../services/i18n'
	import type { AppLanguage } from '../types/fitcal'

	export default {
		props: {
			label: { type: String, required: true },
			testMode: { type: Boolean, default: false },
			appLanguage: { type: String as () => AppLanguage, required: true }
		},
		emits: ['impression', 'dismiss'],
		data() {
			return {
				visible: true
			}
		},
		mounted() {
			this.$emit('impression')
		},
		watch: {
			testMode() {
				this.visible = true
				this.$emit('impression')
			}
		},
		methods: {
			copy(key: string) {
				return t(this.appLanguage, key)
			},
			dismiss() {
				this.visible = false
				this.$emit('dismiss')
			}
		}
	}
</script>
