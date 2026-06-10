<template>
	<view class="page">
		<view class="hero-space"></view>
		<view class="topbar">
			<button class="icon-button" aria-label="Back" @tap="goBack">‹</button>
			<text class="page-title">Settings</text>
			<view class="icon-spacer"></view>
		</view>

		<view class="settings-group">
			<button class="settings-row" :data-testid="`settings-${item.label.toLowerCase().replace(' ', '-')}`" v-for="item in primaryItems" :key="item.label" @tap="openDetail(item)" @click="openDetail(item)">
				<view class="settings-icon" :class="item.icon"></view>
				<view class="settings-copy">
					<text class="settings-label">{{ item.label }}</text>
					<text class="settings-value">{{ item.value }}</text>
				</view>
				<text class="chevron">›</text>
			</button>
		</view>

		<view class="settings-group compact">
			<button class="settings-row" :data-testid="`settings-${item.label.toLowerCase().replace(' ', '-')}`" v-for="item in secondaryItems" :key="item.label" @tap="openDetail(item)" @click="openDetail(item)">
				<view class="settings-icon" :class="item.icon"></view>
				<view class="settings-copy">
					<text class="settings-label">{{ item.label }}</text>
					<text v-if="item.value" class="settings-value">{{ item.value }}</text>
				</view>
				<text class="chevron">›</text>
			</button>
		</view>

		<view class="settings-group compact">
			<button class="settings-row" data-testid="settings-reset-editor" @tap="resetEditor" @click="resetEditor">
				<view class="settings-icon reset-icon"></view>
				<view class="settings-copy">
					<text class="settings-label">Reset Editor</text>
					<text class="settings-value">Template, text, and metadata defaults</text>
				</view>
				<text class="chevron">↺</text>
			</button>
		</view>

		<view v-if="exportHistory.length" class="history-group">
			<view class="history-head">
				<text class="history-heading">Recent Exports</text>
				<button data-testid="clear-export-history" @tap="clearHistory" @click="clearHistory">Clear</button>
			</view>
			<view class="history-list">
				<view v-for="item in exportHistory.slice(0, 5)" :key="item.id" class="history-item">
					<text class="history-title">{{ item.fileName }}</text>
					<text class="history-meta">{{ formatHistoryItem(item) }}</text>
				</view>
			</view>
		</view>

		<view class="privacy-note">
			<text class="lock">▢</text>
			<text>Photos stay on this device</text>
		</view>

		<view v-if="activeDetail" class="detail-layer">
			<button class="detail-scrim" @tap="activeDetail = null"></button>
			<view class="detail-sheet">
				<button class="detail-close" @tap="activeDetail = null">×</button>
				<text class="detail-title">{{ activeDetail.label }}</text>
				<view v-if="activeDetail.label === 'Export'" class="export-settings">
					<text class="detail-copy">Export settings apply to the next generated image. H5 will still avoid upscaling beyond the selected source width.</text>

					<text class="control-caption">Width cap</text>
					<view class="segmented export-widths">
						<button
							v-for="width in exportWidths"
							:key="width"
							:data-testid="`export-width-${width}`"
							:class="{ selected: exportSettings.width === width }"
							@tap="updateExportSetting('width', width)"
							@click="updateExportSetting('width', width)"
						>
							{{ width }}px
						</button>
					</view>

					<text class="control-caption">Format</text>
					<view class="segmented">
						<button data-testid="export-format-jpeg" :class="{ selected: exportSettings.format === 'image/jpeg' }" @tap="updateExportSetting('format', 'image/jpeg')" @click="updateExportSetting('format', 'image/jpeg')">JPEG</button>
						<button data-testid="export-format-png" :class="{ selected: exportSettings.format === 'image/png' }" @tap="updateExportSetting('format', 'image/png')" @click="updateExportSetting('format', 'image/png')">PNG</button>
					</view>

					<view v-if="exportSettings.format === 'image/jpeg'" class="slider-row">
						<text>Quality</text>
						<slider
							:value="exportSettings.jpegQuality"
							:min="70"
							:max="92"
							activeColor="#1A2A3A"
							backgroundColor="#D8D3C9"
							block-color="#1A2A3A"
							@change="onQualityChange"
						/>
						<text>Q{{ exportSettings.jpegQuality }}</text>
					</view>

					<button class="reset-button" @tap="resetExport" @click="resetExport">Reset Export Defaults</button>
				</view>
				<text v-else class="detail-copy">{{ detailCopy }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { EXPORT_WIDTHS, formatExportSettings, readExportSettings, resetExportSettings, writeExportSettings } from '../../common/exportSettingsStore.js'
import { resetEditorSettings } from '../../common/editorSettingsStore.js'
import { clearExportHistory, formatHistoryMode, readExportHistory } from '../../common/exportHistoryStore.js'

export default {
	data() {
		return {
			secondaryItems: [
				{ icon: 'info', label: 'About', value: 'Version 0.1' },
				{ icon: 'shield', label: 'Privacy Policy', value: '' }
			],
			activeDetail: null,
			exportWidths: EXPORT_WIDTHS,
			exportSettings: readExportSettings(),
			exportHistory: readExportHistory()
		}
	},
	computed: {
		primaryItems() {
			return [
				{ icon: 'globe', label: 'Language', value: 'English' },
				{ icon: 'export-icon', label: 'Export', value: formatExportSettings(this.exportSettings) },
				{ icon: 'lock-shape', label: 'Privacy', value: 'Local processing / On' }
			]
		},
		detailCopy() {
			if (!this.activeDetail) return ''
			const map = {
				Language: 'English is active. More languages will be added after i18n resources are wired.',
				Privacy: 'Signet is designed for local processing. The editing flow should not upload user photos.',
				About: 'Signet · Version 0.1',
				'Privacy Policy': 'Draft policy: photos stay on this device during editing. Store copy must match verified implementation.'
			}
			return map[this.activeDetail.label] || ''
		}
	},
	onShow() {
		this.exportHistory = readExportHistory()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		openDetail(item) {
			this.activeDetail = item
			this.exportSettings = readExportSettings()
		},
		updateExportSetting(key, value) {
			this.exportSettings = writeExportSettings({
				...this.exportSettings,
				[key]: value
			})
		},
		onQualityChange(event) {
			this.updateExportSetting('jpegQuality', event.detail.value)
		},
		resetExport() {
			this.exportSettings = resetExportSettings()
		},
		resetEditor() {
			resetEditorSettings()
			uni.showToast({ title: 'Editor reset', icon: 'none' })
		},
		clearHistory() {
			this.exportHistory = clearExportHistory()
			uni.showToast({ title: 'History cleared', icon: 'none' })
		},
		formatSize(size) {
			if (!size) return 'Size pending'
			if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
			return `${(size / 1024 / 1024).toFixed(1)} MB`
		},
		formatHistoryItem(item) {
			const format = item.format === 'image/png' ? 'PNG' : 'JPEG'
			return `${formatHistoryMode(item.mode)} · ${item.width} × ${item.height} · ${format} · ${this.formatSize(item.size)}`
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	padding: 0 40rpx 64rpx;
	background:
		linear-gradient(90deg, rgba(60, 47, 47, 0.045), transparent 12%, transparent 88%, rgba(60, 47, 47, 0.045)),
		radial-gradient(circle at 50% 8%, rgba(255, 255, 255, 0.76), transparent 30%),
		#F9F7F2;
	color: #1A2A3A;
}

.hero-space {
	height: env(safe-area-inset-top);
	min-height: 32rpx;
}

.topbar {
	height: 168rpx;
	display: grid;
	grid-template-columns: 72rpx 1fr 72rpx;
	align-items: center;
}

.page-title {
	text-align: center;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 72rpx;
	line-height: 1;
	letter-spacing: 0;
}

.icon-button,
.icon-spacer {
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1A2A3A;
	font-size: 56rpx;
}

.settings-group {
	margin-top: 52rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.42);
	overflow: hidden;
	box-shadow: 0 18rpx 44rpx rgba(26, 42, 58, 0.06);
}

.settings-group.compact {
	margin-top: 40rpx;
}

.settings-row {
	width: 100%;
	min-height: 174rpx;
	padding: 30rpx 40rpx;
	display: grid;
	grid-template-columns: 96rpx 1fr 44rpx;
	align-items: center;
	column-gap: 24rpx;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.09);
	text-align: left;
}

.settings-row:last-child {
	border-bottom: 0;
}

.settings-icon {
	position: relative;
	width: 86rpx;
	height: 86rpx;
	border: 2rpx solid rgba(26, 42, 58, 0.72);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	font-family: Georgia, "Times New Roman", serif;
}

.settings-icon::before,
.settings-icon::after {
	content: "";
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.settings-icon.globe::before {
	width: 38rpx;
	height: 38rpx;
	border: 4rpx solid #1A2A3A;
	border-radius: 50%;
}

.settings-icon.globe::after {
	width: 4rpx;
	height: 42rpx;
	background: #1A2A3A;
}

.settings-icon.export-icon::before {
	width: 32rpx;
	height: 34rpx;
	border: 4rpx solid #1A2A3A;
	border-top: 0;
	top: 56%;
}

.settings-icon.export-icon::after {
	width: 18rpx;
	height: 18rpx;
	border-right: 4rpx solid #1A2A3A;
	border-bottom: 4rpx solid #1A2A3A;
	transform: translate(-50%, -58%) rotate(45deg);
}

.settings-icon.lock-shape::before {
	width: 34rpx;
	height: 28rpx;
	border: 4rpx solid #1A2A3A;
	border-radius: 4rpx;
	top: 58%;
}

.settings-icon.lock-shape::after {
	width: 28rpx;
	height: 24rpx;
	border: 4rpx solid #1A2A3A;
	border-bottom: 0;
	border-radius: 18rpx 18rpx 0 0;
	top: 39%;
}

.settings-icon.info::before {
	content: "i";
	font-family: Georgia, "Times New Roman", serif;
	font-size: 48rpx;
	line-height: 1;
}

.settings-icon.shield::before {
	width: 40rpx;
	height: 46rpx;
	border: 4rpx solid #1A2A3A;
	border-radius: 22rpx 22rpx 26rpx 26rpx;
	clip-path: polygon(50% 0, 92% 17%, 84% 78%, 50% 100%, 16% 78%, 8% 17%);
}

.settings-icon.reset-icon::before {
	content: "";
	width: 42rpx;
	height: 42rpx;
	border: 4rpx solid #1A2A3A;
	border-right-color: transparent;
	border-radius: 50%;
}

.settings-icon.reset-icon::after {
	content: "";
	width: 14rpx;
	height: 14rpx;
	border-left: 4rpx solid #1A2A3A;
	border-bottom: 4rpx solid #1A2A3A;
	transform: translate(-115%, -120%) rotate(20deg);
}

.settings-copy {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	min-width: 0;
}

.settings-label {
	font-family: Georgia, "Times New Roman", serif;
	font-size: 44rpx;
	line-height: 1.1;
}

.settings-value {
	color: rgba(26, 42, 58, 0.62);
	font-size: 30rpx;
	line-height: 1.2;
}

.chevron {
	color: rgba(26, 42, 58, 0.58);
	font-size: 52rpx;
}

.privacy-note {
	margin-top: 124rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18rpx;
	color: rgba(26, 42, 58, 0.72);
	font-size: 28rpx;
}

.history-group {
	margin-top: 40rpx;
	padding: 28rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	border-radius: 24rpx;
	background: rgba(255, 255, 255, 0.42);
}

.history-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.history-heading {
	font-family: Georgia, "Times New Roman", serif;
	font-size: 38rpx;
}

.history-head button {
	height: 56rpx;
	padding: 0 22rpx;
	border-radius: 14rpx;
	background: rgba(26, 42, 58, 0.08);
	color: #1A2A3A;
	font-size: 24rpx;
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.history-item {
	padding: 18rpx 20rpx;
	border-radius: 16rpx;
	background: rgba(249, 247, 242, 0.72);
}

.history-title,
.history-meta {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.history-title {
	color: #1A2A3A;
	font-size: 26rpx;
}

.history-meta {
	margin-top: 8rpx;
	color: rgba(26, 42, 58, 0.58);
	font-size: 22rpx;
}

.privacy-note::after {
	content: "";
	width: 48rpx;
	height: 2rpx;
	margin-top: 8rpx;
	background: #D96B6B;
}

.lock {
	font-size: 40rpx;
	transform: rotate(45deg);
}

.detail-layer {
	position: fixed;
	inset: 0;
	z-index: 20;
	display: flex;
	align-items: flex-end;
	background: rgba(26, 42, 58, 0.36);
}

.detail-scrim {
	position: absolute;
	inset: 0;
}

.detail-sheet {
	position: relative;
	width: 100%;
	padding: 32rpx 40rpx 54rpx;
	border-radius: 32rpx 32rpx 0 0;
	background: #FFFEFA;
	box-shadow: 0 -18rpx 48rpx rgba(26, 42, 58, 0.16);
}

.detail-close {
	position: absolute;
	right: 32rpx;
	top: 24rpx;
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: rgba(26, 42, 58, 0.06);
	color: #1A2A3A;
	font-size: 44rpx;
}

.detail-title {
	display: block;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 48rpx;
	line-height: 1.1;
}

.detail-copy {
	display: block;
	margin-top: 28rpx;
	color: rgba(26, 42, 58, 0.72);
	font-size: 30rpx;
	line-height: 1.6;
}

.export-settings {
	margin-top: 8rpx;
}

.control-caption {
	display: block;
	margin: 28rpx 0 14rpx;
	color: rgba(26, 42, 58, 0.58);
	font-size: 24rpx;
	text-transform: uppercase;
}

.segmented {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16rpx;
}

.segmented button {
	height: 76rpx;
	border-radius: 14rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	background: rgba(255, 255, 255, 0.46);
	color: #1A2A3A;
	font-size: 28rpx;
}

.segmented button.selected {
	background: #1A2A3A;
	color: #FFFFFF;
}

.slider-row {
	min-height: 92rpx;
	display: grid;
	grid-template-columns: 116rpx 1fr 76rpx;
	align-items: center;
	column-gap: 12rpx;
	margin-top: 26rpx;
	font-size: 28rpx;
}

.reset-button {
	width: 100%;
	height: 76rpx;
	margin-top: 26rpx;
	border-radius: 14rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.18);
	background: rgba(249, 247, 242, 0.82);
	color: #1A2A3A;
	font-size: 28rpx;
}
</style>
