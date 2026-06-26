<template>
	<view class="settings-section">
		<text class="settings-heading">{{ section.title }}</text>
		<view class="settings-card">
			<view v-for="item in section.items" :key="item.action || item.label" class="setting-row" :data-testid="testId(item)" @click="handleRow(item)">
				<view class="setting-icon" :class="{ danger: item.danger }"><icon-mark :name="item.icon" /></view>
				<text :class="['setting-label', item.danger ? 'danger-text' : '']">{{ item.label }}</text>
				<view v-if="item.switch" class="switch on"><view></view></view>
				<select
					v-else-if="item.action === 'language'"
					class="language-select"
					data-testid="settings-language-picker"
					:value="language"
					@change="handleLanguageChange"
				>
					<option v-for="option in languageOptions" :key="option.key" :value="option.key">{{ option.label }}</option>
				</select>
				<text v-else-if="item.value" class="setting-value">{{ item.value }}</text>
				<text v-else>›</text>
			</view>
		</view>
	</view>
</template>

<script>
import IconMark from '../shared/IconMark.vue'

export default {
	name: 'SettingsSection',
	components: {
		IconMark
	},
	props: {
		section: {
			type: Object,
			required: true
		},
		languageOptions: {
			type: Array,
			default: () => []
		},
		language: {
			type: String,
			default: 'en'
		}
	},
	emits: ['unit', 'language', 'export', 'import', 'reset', 'privacy'],
	computed: {
	},
	methods: {
		testId(item) {
			if (item.action === 'unit') return 'settings-units'
			if (item.action === 'language') return 'settings-language'
			if (item.action === 'export') return 'settings-export'
			if (item.action === 'import') return 'settings-import'
			if (item.action === 'reset') return 'settings-reset'
			if (item.action === 'privacy') return 'settings-privacy'
			return null
		},
		handleRow(item) {
			if (item.action === 'unit') {
				this.$emit('unit', item.valueKey === 'metric' ? 'lb' : 'kg')
			} else if (item.action === 'export') {
				this.$emit('export')
			} else if (item.action === 'import') {
				this.$emit('import')
			} else if (item.action === 'reset') {
				this.$emit('reset')
			} else if (item.action === 'privacy') {
				this.$emit('privacy')
			}
		},
		handleLanguageChange(event) {
			const selected = event.detail?.value ?? event.target?.value
			if (selected) {
				this.$emit('language', selected)
			}
		}
	}
}
</script>

<style>
.settings-section {
	margin-bottom: 30px;
}

.settings-heading {
	display: block;
	margin: 0 0 14px 14px;
	color: #2A3A2C;
	font-size: 22px;
	font-weight: 800;
}

.settings-card {
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.5);
	overflow: hidden;
}

.setting-row {
	display: flex;
	align-items: center;
	gap: 18px;
	min-height: 78px;
	padding: 0 18px;
	border-bottom: 1px solid #DDD8CE;
}

.setting-row:last-child {
	border-bottom: 0;
}

.setting-icon {
	width: 50px;
	height: 50px;
	border-radius: 8px;
	background: #F0F1EE;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: visible;
}

.setting-icon.danger {
	color: #B65D3A;
	background: rgba(182, 93, 58, 0.1);
}

.setting-label {
	flex: 1;
	min-width: 0;
	font-size: 20px;
	color: #111;
}

.setting-value {
	color: #2A3A2C;
	font-size: 20px;
	font-weight: 700;
}

.language-select {
	min-width: 138px;
	height: 42px;
	padding: 0 12px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	color: #2A3A2C;
	background: rgba(255,255,255,0.68);
	font-size: 18px;
	font-weight: 800;
}

.switch {
	margin-left: auto;
	width: 64px;
	height: 36px;
	border-radius: 999px;
	background: #2A3A2C;
	padding: 3px;
}

.switch view {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background: #fff;
	margin-left: auto;
}

.danger-text {
	color: #B65D3A !important;
}
</style>
