<template>
	<view class="page">
		<view class="safe-top"></view>

		<view v-if="screen === 'import'" class="import-screen">
			<view class="home-topbar">
				<view class="topbar-spacer"></view>
				<text class="brand-title">Signet</text>
				<button class="settings-button" aria-label="Settings" @tap="openSettings">⚙</button>
			</view>

			<view class="empty-frame" :class="{ ready: hasPhoto }">
				<image v-if="hasPhoto" class="import-photo" :src="selectedPhoto.src" mode="aspectFill"></image>
				<image v-else class="placeholder-art" src="/static/import-placeholder.png" mode="aspectFill"></image>
			</view>

			<button class="primary-button choose-button" @tap="choosePhoto">
				{{ hasPhoto ? 'Change Photo' : 'Choose Photo' }}
			</button>

			<view class="local-note">
				<view class="hairline"></view>
				<text class="lock-icon">▢</text>
				<text>Local editing only</text>
				<view class="hairline"></view>
			</view>

			<view v-if="hasPhoto" class="photo-info-card">
				<text class="info-title">{{ selectedPhoto.name }}</text>
				<text>{{ selectedPhoto.width }} × {{ selectedPhoto.height }} px</text>
				<text>{{ selectedPhoto.type }} · {{ selectedPhoto.sizeLabel }} · {{ selectedPhoto.aspectLabel }}</text>
			</view>
			<view v-else class="photo-info-card muted">
				<text class="info-title">Supported local photos</text>
				<text>JPG, PNG, WebP, HEIC/HEIF where supported by the runtime.</text>
				<text>Original resolution is kept for preview data; export quality still needs device validation.</text>
			</view>

			<view v-if="recentExports.length" class="history-section">
				<view class="section-header">
					<text class="section-title">Recent Exports</text>
					<text class="section-count">{{ recentExports.length }}</text>
				</view>
				<view class="history-list">
					<view v-for="item in recentExports.slice(0, 3)" :key="item.id" class="history-item">
						<view>
							<text class="history-title">{{ item.fileName }}</text>
							<text class="history-meta">{{ formatHistoryItem(item) }}</text>
						</view>
						<text class="history-time">{{ formatHistoryTime(item.timestamp) }}</text>
					</view>
				</view>
			</view>

			<view class="preset-section">
				<text class="section-title">Recent Presets</text>
				<view class="preset-row">
					<button
						v-for="preset in presets"
						:key="preset.id"
						class="preset-card"
						:data-testid="`preset-${preset.id}`"
						:class="{ selected: presetId === preset.id }"
						@tap="selectPreset(preset.id)"
					>
						<view class="preset-preview" :class="preset.mode">
							<image class="preset-photo" src="/static/demo-landscape.png" mode="aspectFill"></image>
							<view v-if="preset.mode === 'bottomBand'" class="preset-band"></view>
						</view>
						<text class="preset-label">{{ preset.label }}</text>
					</button>
				</view>
			</view>
		</view>

		<view v-else class="editor-screen">
			<view class="editor-topbar">
				<button class="nav-button" aria-label="Back" @tap="goBack">‹</button>
				<text class="page-title">{{ activeTitle }}</text>
				<button class="export-button" :disabled="!hasPhoto" @tap="openExport">Export</button>
			</view>

			<view class="preview-shell" :class="mode">
				<view class="photo-surface" :style="{ '--mat-color': selectedSwatch, '--caption-size': captionSize + 'rpx' }">
					<view class="photo-stage" :style="stageStyle">
						<image v-if="hasPhoto" class="real-photo" :src="selectedPhoto.src" mode="aspectFit"></image>
						<view v-else class="sample-photo">
							<view class="sky"></view>
							<view class="ridge ridge-back"></view>
							<view class="ridge ridge-front"></view>
							<view class="lake"></view>
							<view class="shore"></view>
							<view class="rock"></view>
						</view>
						<view v-if="mode === 'inPhoto'" class="in-photo-mark" :class="anchorClass" :style="{ opacity: opacity / 100 }">
							<text class="mark-title">{{ watermarkText }}</text>
							<text v-if="showMetadataLine" class="mark-meta">{{ captionText }}</text>
						</view>
					</view>

					<view v-if="mode !== 'inPhoto'" class="caption-band" :class="{ compact: mode === 'bottomBand' }">
						<text v-if="showMetadataLine" class="caption-line">{{ captionText }}</text>
						<view v-if="mode === 'bottomBand'" class="caption-rule">
							<view></view>
							<text>◆</text>
							<view></view>
						</view>
						<text v-if="showWatermarkName" class="signature">{{ watermarkText }}</text>
					</view>
				</view>
			</view>

			<view v-if="screen === 'editor'" class="control-panel">
				<view class="tabs">
					<button
						v-for="tab in tabs"
						:key="tab.id"
						class="tab"
						:class="{ active: activeTab === tab.id }"
						@tap="activeTab = tab.id"
					>
						{{ tab.label }}
					</button>
				</view>

				<view v-if="activeTab === 'frame'" class="panel-content">
					<view class="mode-grid">
						<button
							v-for="item in modes"
							:key="item.id"
							class="mode-card"
							:class="{ selected: mode === item.id }"
							@tap="setMode(item.id)"
						>
							<view class="mode-thumb" :class="item.id">
								<view class="mode-photo"></view>
								<view v-if="item.id === 'bottomBand'" class="mode-band"></view>
								<view v-if="item.id === 'inPhoto'" class="mode-dot"></view>
							</view>
							<text>{{ item.label }}</text>
						</button>
					</view>
					<view class="quick-editor">
						<view class="summary-row">
							<text>Photo</text>
							<text>{{ photoSummary }}</text>
						</view>
						<view class="text-input-row">
							<text>Watermark</text>
							<input v-model="watermarkText" maxlength="32" @blur="saveEditorSettings" />
						</view>
						<button class="wide-row" @tap="openCaption">
							<text>Metadata</text>
							<text>{{ captionText || 'Edit' }} ›</text>
						</button>
						<view class="switch-row">
							<button :class="{ active: showWatermarkName }" @tap="toggleName">Name</button>
							<button :class="{ active: showMetadataLine }" @tap="toggleMetadata">Metadata</button>
						</view>
					</view>
					<view class="slider-row">
						<text>Border</text>
						<slider :value="borderValue" activeColor="#1A2A3A" backgroundColor="#D8D3C9" block-color="#1A2A3A" @change="onBorderChange" />
						<text>{{ borderValue }}%</text>
					</view>
					<text class="control-label">Mat</text>
					<view class="swatches">
						<button
							v-for="color in swatches"
							:key="color"
							class="swatch"
							:class="{ selected: selectedSwatch === color }"
							:style="{ background: color }"
							@tap="selectedSwatch = color"
						></button>
					</view>
				</view>

				<view v-else-if="activeTab === 'text'" class="panel-content">
					<button class="wide-row" @tap="openCaption">
						<text>Watermark Text</text>
						<text>{{ watermarkText }} ›</text>
					</button>
					<button class="wide-row" @tap="openCaption">
						<text>Metadata fields</text>
						<text>{{ captionText || 'Edit' }} ›</text>
					</button>
					<button class="wide-row" @tap="openPosition">
						<text>Position</text>
						<text>{{ anchorLabel }} ›</text>
					</button>
					<view class="toggle-row">
						<text>Show name</text>
						<switch :checked="showWatermarkName" color="#1A2A3A" @change="onShowNameChange" />
					</view>
					<view class="toggle-row">
						<text>Show metadata</text>
						<switch :checked="showMetadataLine" color="#1A2A3A" @change="onShowMetadataChange" />
					</view>
					<view class="slider-row">
						<text>Opacity</text>
						<slider :value="opacity" activeColor="#1A2A3A" backgroundColor="#D8D3C9" block-color="#1A2A3A" @change="onOpacityChange" />
						<text>{{ opacity }}%</text>
					</view>
				</view>

				<view v-else class="panel-content">
					<button class="wide-row" @tap="setMode('fullFrame')">
						<text>Full Frame</text>
						<text :class="{ check: mode === 'fullFrame' }">✓</text>
					</button>
					<button class="wide-row" @tap="setMode('bottomBand')">
						<text>Bottom Band</text>
						<text :class="{ check: mode === 'bottomBand' }">✓</text>
					</button>
					<button class="wide-row" @tap="setMode('inPhoto')">
						<text>In-Photo</text>
						<text :class="{ check: mode === 'inPhoto' }">✓</text>
					</button>
				</view>
			</view>

			<view v-if="screen === 'position'" class="control-panel position-panel">
				<view class="anchor-layout">
					<view class="anchor-labels">
						<text>Top</text>
						<text>Center</text>
						<text>Bottom</text>
					</view>
					<view class="anchor-grid">
						<button
							v-for="anchor in anchors"
							:key="anchor.id"
							class="anchor-cell"
							:class="{ selected: selectedAnchor === anchor.id }"
							@tap="selectedAnchor = anchor.id"
						>
							<view></view>
						</button>
					</view>
				</view>
				<view class="slider-row">
					<text>Size</text>
					<slider :value="markSize" activeColor="#1A2A3A" backgroundColor="#D8D3C9" block-color="#1A2A3A" @change="onSizeChange" />
					<text>A</text>
				</view>
				<view class="slider-row">
					<text>Offset</text>
					<slider :value="offset" activeColor="#1A2A3A" backgroundColor="#D8D3C9" block-color="#1A2A3A" @change="onOffsetChange" />
					<text>→</text>
				</view>
				<view class="action-row">
					<button class="secondary-button danger" @tap="screen = 'editor'">Cancel</button>
					<button class="primary-button small" @tap="applyPosition">Apply</button>
				</view>
			</view>

			<view v-if="screen === 'bottomBand'" class="control-panel">
				<view class="slider-row">
					<text>Band Height</text>
					<slider :value="bandHeight" activeColor="#1A2A3A" backgroundColor="#D8D3C9" block-color="#1A2A3A" @change="onBandChange" />
					<text>{{ bandHeight }}%</text>
				</view>
				<view class="slider-row">
					<text>Text Size</text>
					<slider :value="captionSize" :min="22" :max="44" activeColor="#1A2A3A" backgroundColor="#D8D3C9" block-color="#1A2A3A" @change="onCaptionSizeChange" />
					<text>{{ captionSize }}px</text>
				</view>
				<text class="control-label">Alignment</text>
				<view class="segmented">
					<button
						v-for="align in alignments"
						:key="align"
						:class="{ selected: alignment === align }"
						@tap="alignment = align"
					>
						{{ align }}
					</button>
				</view>
				<text class="control-label">Background</text>
				<view class="swatches">
					<button
						v-for="color in swatches"
						:key="color"
						class="swatch"
						:class="{ selected: selectedSwatch === color }"
						:style="{ background: color }"
						@tap="selectedSwatch = color"
					></button>
				</view>
			</view>
		</view>

		<view v-if="captionOpen" class="modal-layer">
			<button class="scrim" @tap="captionOpen = false"></button>
			<view class="caption-sheet">
				<view class="grabber"></view>
				<text class="sheet-title">Watermark</text>
				<view class="field-list">
					<view class="field-row">
						<text>Name</text>
						<input v-model="watermarkText" class="field-input" maxlength="32" @blur="saveEditorSettings" />
					</view>
					<view v-for="field in metadataFields" :key="field.key" class="field-row">
						<text>{{ field.label }}</text>
						<input v-model="field.value" class="field-input" @blur="saveEditorSettings" />
					</view>
				</view>
				<view class="action-row">
					<button class="secondary-button" @tap="captionOpen = false">Cancel</button>
					<button class="primary-button small" @tap="applyCaption">Apply</button>
				</view>
			</view>
		</view>

		<view v-if="exportOpen" class="modal-layer export-layer">
			<view class="export-card">
				<text class="sheet-title">Export</text>
				<view class="mini-preview">
					<image v-if="exportPreviewSrc" class="mini-real-photo" :src="exportPreviewSrc" mode="aspectFit"></image>
					<view v-else class="mini-photo"></view>
					<text>{{ exportPreviewLabel }}</text>
				</view>
				<view class="progress-card">
					<view class="progress-head">
						<text>{{ exportStatusText }}</text>
						<text>{{ progress }}%</text>
					</view>
					<view class="progress-track">
						<view class="progress-fill" :style="{ width: progress + '%' }"></view>
					</view>
					<view class="progress-foot">
						<text>{{ exportSizeLabel }}</text>
						<text>{{ saveTargetLabel }}</text>
					</view>
					<view class="progress-foot muted">
						<text>{{ exportPolicyLabel }}</text>
					</view>
				</view>
				<view class="check-card" :class="{ error: exportStatus === 'error' }">
					<text v-if="exportStatus === 'error'">× {{ exportError }}</text>
					<template v-else>
						<text>✓ Render {{ modeLabel }}</text>
						<text>{{ exportStatus === 'ready' ? '✓ Temp file ready' : '◌ Create temp file' }}</text>
						<text>{{ saveStatusLabel }}</text>
					</template>
				</view>
				<view class="action-row">
					<button class="secondary-button danger" @tap="closeExport">Close</button>
					<button v-if="exportStatus === 'error'" class="primary-button small" @tap="openExport">Retry</button>
					<button v-else class="primary-button small" :disabled="exportStatus !== 'ready' || saveStatus === 'saving'" @tap="saveExportedImage">
						{{ saveButtonLabel }}
					</button>
				</view>
			</view>
		</view>
		<canvas
			class="export-canvas"
			canvas-id="signet-export-canvas"
			:style="{ width: exportCanvasWidth + 'px', height: exportCanvasHeight + 'px' }"
		></canvas>
	</view>
</template>

<script>
import { DEFAULT_EXPORT_SETTINGS, buildCompositionModel, exportExtension } from '../../common/compositionModel.js'
import { EXPORT_CANVAS_ID, measureComposition, renderCompositionToTempFile } from '../../common/uniCanvasRenderer.js'
import { renderCompositionToDataUrl } from '../../common/h5CanvasRenderer.js'
import { readExportSettings } from '../../common/exportSettingsStore.js'
import { DEFAULT_EDITOR_SETTINGS, readEditorSettings, writeEditorSettings } from '../../common/editorSettingsStore.js'
import { PRESET_TEMPLATES, findPresetTemplate } from '../../common/presetTemplates.js'
import { formatHistoryMode, readExportHistory, recordExportHistory } from '../../common/exportHistoryStore.js'

const DEFAULT_PHOTO = {
	src: '',
	name: '',
	type: '',
	size: 0,
	sizeLabel: '',
	width: 0,
	height: 0,
	aspectLabel: ''
}

export default {
	data() {
		return {
			screen: 'import',
			mode: 'fullFrame',
			activeTab: 'frame',
			captionOpen: false,
			exportOpen: false,
			exportStatus: 'idle',
			exportError: '',
			exportTempFilePath: '',
			exportDownloadName: '',
			exportSize: 0,
			exportActualQuality: 0,
			saveStatus: 'idle',
			saveError: '',
			exportCanvasWidth: 1,
			exportCanvasHeight: 1,
			progress: 0,
			exportWidth: DEFAULT_EXPORT_SETTINGS.width,
			exportFormat: DEFAULT_EXPORT_SETTINGS.format,
			jpegQuality: DEFAULT_EXPORT_SETTINGS.jpegQuality,
			presetId: DEFAULT_EDITOR_SETTINGS.presetId,
			borderValue: DEFAULT_EDITOR_SETTINGS.borderValue,
			opacity: DEFAULT_EDITOR_SETTINGS.opacity,
			markSize: DEFAULT_EDITOR_SETTINGS.markSize,
			offset: DEFAULT_EDITOR_SETTINGS.offset,
			bandHeight: DEFAULT_EDITOR_SETTINGS.bandHeight,
			captionSize: DEFAULT_EDITOR_SETTINGS.captionSize,
			alignment: DEFAULT_EDITOR_SETTINGS.alignment,
			selectedAnchor: DEFAULT_EDITOR_SETTINGS.selectedAnchor,
			selectedSwatch: DEFAULT_EDITOR_SETTINGS.selectedSwatch,
			selectedPhoto: { ...DEFAULT_PHOTO },
			watermarkText: DEFAULT_EDITOR_SETTINGS.watermarkText,
			showWatermarkName: DEFAULT_EDITOR_SETTINGS.showWatermarkName,
			showMetadataLine: DEFAULT_EDITOR_SETTINGS.showMetadataLine,
			tabs: [
				{ id: 'frame', label: 'Frame' },
				{ id: 'text', label: 'Text' },
				{ id: 'layout', label: 'Layout' }
			],
			modes: [
				{ id: 'fullFrame', label: 'Full Frame' },
				{ id: 'inPhoto', label: 'In-Photo' },
				{ id: 'bottomBand', label: 'Bottom Band' }
			],
			presets: PRESET_TEMPLATES,
			anchors: [
				{ id: 'top-left' },
				{ id: 'top-center' },
				{ id: 'top-right' },
				{ id: 'middle-left' },
				{ id: 'middle-center' },
				{ id: 'middle-right' },
				{ id: 'bottom-left' },
				{ id: 'bottom-center' },
				{ id: 'bottom-right' }
			],
			alignments: ['Left', 'Center', 'Right'],
			swatches: ['#F9F7F2', '#EDE6D8', '#EFEFEF', '#E5EAE6', '#1A2A3A', '#3C2F2F'],
			metadataFields: JSON.parse(JSON.stringify(DEFAULT_EDITOR_SETTINGS.metadataFields)),
			recentExports: []
		}
	},
	computed: {
		hasPhoto() {
			return Boolean(this.selectedPhoto.src)
		},
		isH5Runtime() {
			return typeof document !== 'undefined'
		},
		activeTitle() {
			if (this.screen === 'position') return 'Position'
			if (this.screen === 'bottomBand') return 'Bottom Band'
			return 'Edit Frame'
		},
		modeLabel() {
			const item = this.modes.find(mode => mode.id === this.mode)
			return item ? item.label : 'Frame'
		},
		captionText() {
			const values = this.metadataFields
				.map(field => field.value)
				.filter(value => String(value || '').trim())
			return values.join('  ')
		},
		stageStyle() {
			const markSize = Math.round(24 + this.markSize * 0.56)
			const markOffset = Math.round(16 + this.offset * 0.64)
			const vars = `--mark-size: ${markSize}rpx; --mark-offset: ${markOffset}rpx;`
			if (!this.hasPhoto || !this.selectedPhoto.width || !this.selectedPhoto.height) return vars
			const ratio = this.selectedPhoto.width / this.selectedPhoto.height
			const clamped = Math.max(0.62, Math.min(1.78, ratio))
			return `aspect-ratio: ${clamped}; ${vars}`
		},
		anchorClass() {
			return `anchor-${this.selectedAnchor}`
		},
		anchorLabel() {
			return this.selectedAnchor
				.split('-')
				.map(part => part.charAt(0).toUpperCase() + part.slice(1))
				.join(' ')
		},
		photoSummary() {
			if (!this.hasPhoto) return 'No photo selected'
			return `${this.selectedPhoto.type || 'IMAGE'} · ${this.selectedPhoto.width || '?'} × ${this.selectedPhoto.height || '?'} · ${this.selectedPhoto.aspectLabel || 'Unknown'}`
		},
		compositionModel() {
			return buildCompositionModel(this)
		},
		exportStatusText() {
			if (this.exportStatus === 'ready') return 'Ready locally'
			if (this.exportStatus === 'error') return 'Export failed'
			return 'Rendering locally'
		},
		exportPreviewSrc() {
			return this.exportTempFilePath || (this.hasPhoto ? this.selectedPhoto.src : '')
		},
		exportPreviewLabel() {
			if (this.exportStatus === 'ready') return `${this.modeLabel} · ${this.exportCanvasWidth} × ${this.exportCanvasHeight}`
			return this.captionText || this.modeLabel
		},
		exportSizeLabel() {
			if (!this.exportSize) return '1 of 1'
			const sourceSize = Number(this.selectedPhoto.size || 0)
			const delta = sourceSize ? ` · ${Math.round((this.exportSize / sourceSize) * 100)}%` : ''
			return `${this.formatSize(this.exportSize)}${delta}`
		},
		exportPolicyLabel() {
			const model = this.compositionModel
			const qualityValue = this.exportActualQuality || model.export.jpegQuality
			const quality = model.export.format === 'image/jpeg' ? `Q${qualityValue}` : 'PNG'
			const sourceWidth = Number(model.source.width || 0)
			const noUpscale = sourceWidth && model.export.width <= sourceWidth ? 'No upscale' : 'Source size pending'
			return `${quality} · ${noUpscale} · ${model.export.width}px cap`
		},
		saveTargetLabel() {
			return this.isH5Runtime ? 'Download' : 'No upload'
		},
		saveButtonLabel() {
			if (this.saveStatus === 'saving') return 'Saving'
			if (this.saveStatus === 'saved') return 'Saved'
			return 'Save'
		},
		saveStatusLabel() {
			if (this.saveStatus === 'saved') return '✓ Saved locally'
			if (this.saveStatus === 'saving') return '◌ Save locally'
			if (this.saveStatus === 'error') return `× ${this.saveError || 'Save failed'}`
			return '◌ Save locally'
		}
	},
	mounted() {
		this.loadEditorSettings()
		this.loadExportSettings()
		this.loadExportHistory()
		if (this.isH5Runtime) this.applyH5DemoPhotoFromQuery()
	},
	onShow() {
		this.loadExportSettings()
		this.loadExportHistory()
	},
	methods: {
		loadEditorSettings() {
			const settings = readEditorSettings()
			Object.assign(this, {
				presetId: settings.presetId,
				mode: settings.mode,
				borderValue: settings.borderValue,
				opacity: settings.opacity,
				markSize: settings.markSize,
				offset: settings.offset,
				bandHeight: settings.bandHeight,
				captionSize: settings.captionSize,
				alignment: settings.alignment,
				selectedAnchor: settings.selectedAnchor,
				selectedSwatch: settings.selectedSwatch,
				watermarkText: settings.watermarkText,
				showWatermarkName: settings.showWatermarkName,
				showMetadataLine: settings.showMetadataLine,
				metadataFields: settings.metadataFields
			})
			this.activeTab = this.mode === 'fullFrame' ? 'frame' : 'layout'
		},
		saveEditorSettings() {
			writeEditorSettings({
				presetId: this.presetId,
				mode: this.mode,
				borderValue: this.borderValue,
				opacity: this.opacity,
				markSize: this.markSize,
				offset: this.offset,
				bandHeight: this.bandHeight,
				captionSize: this.captionSize,
				alignment: this.alignment,
				selectedAnchor: this.selectedAnchor,
				selectedSwatch: this.selectedSwatch,
				watermarkText: this.watermarkText,
				showWatermarkName: this.showWatermarkName,
				showMetadataLine: this.showMetadataLine,
				metadataFields: this.metadataFields
			})
		},
		loadExportSettings() {
			const settings = readExportSettings()
			this.exportWidth = settings.width
			this.exportFormat = settings.format
			this.jpegQuality = settings.jpegQuality
			this.applyExportSettingsFromQuery()
		},
		loadExportHistory() {
			this.recentExports = readExportHistory()
		},
		applyExportSettingsFromQuery() {
			if (!this.isH5Runtime) return
			const params = this.readH5QueryParams()
			const width = Number(params.get('exportWidth') || 0)
			const format = params.get('exportFormat')
			const quality = Number(params.get('jpegQuality') || 0)
			if ([1080, 1600].includes(width)) this.exportWidth = width
			if (format === 'png') this.exportFormat = 'image/png'
			if (format === 'jpeg' || format === 'jpg') this.exportFormat = 'image/jpeg'
			if (quality >= 70 && quality <= 92) this.jpegQuality = quality
		},
		readH5QueryParams() {
			const params = new URLSearchParams(window.location.search || '')
			const hash = window.location.hash || ''
			const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : ''
			new URLSearchParams(hashQuery).forEach((value, key) => {
				if (!params.has(key)) params.set(key, value)
			})
			return params
		},
		openSettings() {
			uni.navigateTo({ url: '/pages/settings/settings' })
		},
		choosePhoto() {
			if (this.isH5Runtime) {
				this.openH5FilePicker()
				return
			}
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				extension: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
				success: (res) => {
					const path = res.tempFilePaths && res.tempFilePaths[0]
					if (!path) return
					const file = res.tempFiles && res.tempFiles[0] ? res.tempFiles[0] : {}
					this.applyChosenPhoto(path, file)
				},
				fail: () => {
					uni.showToast({ title: 'Photo not selected', icon: 'none' })
				}
			})
		},
		openH5FilePicker() {
			const input = document.createElement('input')
			input.type = 'file'
			input.accept = 'image/*'
			input.style.position = 'fixed'
			input.style.left = '-99999px'
			input.style.top = '-99999px'
			input.addEventListener('change', (event) => {
				const file = event.target.files && event.target.files[0]
				document.body.removeChild(input)
				if (!file) return
				const src = URL.createObjectURL(file)
				this.applyH5Photo(src, file)
			}, { once: true })
			document.body.appendChild(input)
			input.click()
		},
		applyH5Photo(src, file) {
			this.selectedPhoto = {
				src,
				name: file.name || 'Local photo',
				type: this.readFileType(file.type, file.name),
				size: Number(file.size || 0),
				sizeLabel: this.formatSize(Number(file.size || 0)),
				width: 0,
				height: 0,
				aspectLabel: 'Reading image'
			}
			const image = new Image()
			image.onload = () => {
				const width = Number(image.naturalWidth || image.width || 0)
				const height = Number(image.naturalHeight || image.height || 0)
				this.selectedPhoto = {
					...this.selectedPhoto,
					width,
					height,
					aspectLabel: this.formatAspect(width, height)
				}
				this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
			}
			image.onerror = () => {
				this.selectedPhoto = {
					...this.selectedPhoto,
					aspectLabel: 'Image info unavailable'
				}
				this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
			}
			image.src = src
		},
		applyH5DemoPhotoFromQuery() {
			this.loadExportSettings()
			const params = this.readH5QueryParams()
			const demo = params.get('demoPhoto')
			if (!demo) return
			const queryMode = params.get('mode')
			if (['fullFrame', 'bottomBand', 'inPhoto'].includes(queryMode)) {
				this.mode = queryMode
				this.activeTab = queryMode === 'fullFrame' ? 'frame' : 'layout'
			}
			const demoMap = {
				landscape: './build/h5/static/demo-landscape.png',
				portrait: './build/h5/static/demo-portrait.png',
				square: './build/h5/static/demo-square.png',
				wide: './build/h5/static/demo-wide.png'
			}
			const src = demoMap[demo] || demoMap.landscape
			const sizeMap = {
				landscape: 3066862,
				portrait: 2581926,
				square: 2869428,
				wide: 2660365
			}
			this.applyH5Photo(src, {
				name: `demo-${demo}.png`,
				type: 'image/png',
				size: sizeMap[demo] || sizeMap.landscape
			})
		},
		applyChosenPhoto(path, file = {}) {
			const name = this.readFileName(file.name || file.path || path)
			const type = this.readFileType(file.type, name)
			const size = Number(file.size || 0)
			this.selectedPhoto = {
				src: path,
				name,
				type,
				size,
				sizeLabel: this.formatSize(size),
				width: 0,
				height: 0,
				aspectLabel: 'Reading image'
			}
			uni.getImageInfo({
				src: path,
				success: (info) => {
					const width = Number(info.width || 0)
					const height = Number(info.height || 0)
					this.selectedPhoto = {
						...this.selectedPhoto,
						width,
						height,
						type: info.type ? String(info.type).toUpperCase() : this.selectedPhoto.type,
						aspectLabel: this.formatAspect(width, height)
					}
					this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
				},
				fail: () => {
					this.selectedPhoto = {
						...this.selectedPhoto,
						aspectLabel: 'Image info unavailable'
					}
					this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
				}
			})
		},
		readFileName(rawPath) {
			const fallback = 'Local photo'
			if (!rawPath) return fallback
			const clean = String(rawPath).split('?')[0]
			const parts = clean.split(/[\\/]/)
			return parts[parts.length - 1] || fallback
		},
		readFileType(fileType, name) {
			if (fileType) return String(fileType).replace('image/', '').toUpperCase()
			const match = String(name || '').match(/\.([a-z0-9]+)$/i)
			return match ? match[1].toUpperCase() : 'IMAGE'
		},
		formatSize(size) {
			if (!size) return 'Size unknown'
			if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
			return `${(size / 1024 / 1024).toFixed(1)} MB`
		},
		formatHistoryItem(item) {
			const format = item.format === 'image/png' ? 'PNG' : 'JPEG'
			const size = item.size ? this.formatSize(item.size) : 'Size pending'
			return `${formatHistoryMode(item.mode)} · ${item.width} × ${item.height} · ${format} · ${size}`
		},
		formatHistoryTime(timestamp) {
			const date = new Date(Number(timestamp || 0))
			if (!Number.isFinite(date.getTime())) return ''
			return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
		},
		formatAspect(width, height) {
			if (!width || !height) return 'Aspect unknown'
			if (Math.abs(width - height) < 4) return 'Square'
			return width > height ? 'Landscape' : 'Portrait'
		},
		startEditing() {
			if (!this.hasPhoto) {
				this.choosePhoto()
				return
			}
			this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
		},
		goBack() {
			if (this.screen === 'editor') {
				this.screen = 'import'
				return
			}
			if (!this.hasPhoto) {
				this.screen = 'import'
				return
			}
			this.screen = 'editor'
		},
		selectPreset(presetId) {
			const preset = findPresetTemplate(presetId)
			this.presetId = preset.id
			this.mode = preset.mode
			Object.assign(this, preset.patch)
			this.activeTab = preset.mode === 'fullFrame' ? 'frame' : 'layout'
			if (preset.mode === 'bottomBand') this.screen = this.hasPhoto ? 'bottomBand' : this.screen
			if (preset.mode === 'inPhoto') this.screen = this.hasPhoto ? 'position' : this.screen
			this.saveEditorSettings()
		},
		setMode(mode) {
			this.mode = mode
			this.presetId = ''
			this.activeTab = mode === 'fullFrame' ? 'frame' : 'layout'
			if (mode === 'bottomBand') this.screen = 'bottomBand'
			if (mode === 'inPhoto') this.screen = 'position'
			this.saveEditorSettings()
		},
		openCaption() {
			this.captionOpen = true
		},
		applyCaption() {
			this.captionOpen = false
			this.saveEditorSettings()
		},
		toggleName() {
			this.showWatermarkName = !this.showWatermarkName
			this.saveEditorSettings()
		},
		toggleMetadata() {
			this.showMetadataLine = !this.showMetadataLine
			this.saveEditorSettings()
		},
		onShowNameChange(event) {
			this.showWatermarkName = event.detail.value
			this.saveEditorSettings()
		},
		onShowMetadataChange(event) {
			this.showMetadataLine = event.detail.value
			this.saveEditorSettings()
		},
		openPosition() {
			this.mode = 'inPhoto'
			this.screen = 'position'
		},
		applyPosition() {
			this.mode = 'inPhoto'
			this.screen = 'editor'
			this.saveEditorSettings()
		},
		async openExport() {
			this.loadExportSettings()
			if (!this.hasPhoto) {
				uni.showToast({ title: 'Choose a photo first', icon: 'none' })
				return
			}
			this.exportOpen = true
			this.exportStatus = 'rendering'
			this.exportError = ''
			this.exportTempFilePath = ''
			this.exportDownloadName = ''
			this.exportSize = 0
			this.exportActualQuality = 0
			this.saveStatus = 'idle'
			this.saveError = ''
			this.progress = 12
			await this.$nextTick()
			try {
				const model = this.compositionModel
				if (this.shouldSimulateExportError()) throw new Error('Simulated export failure')
				if (this.isH5Runtime) {
					this.progress = 42
					const result = await renderCompositionToDataUrl(model)
					this.exportTempFilePath = result.dataUrl
					this.exportDownloadName = result.fileName
					this.exportSize = result.size || 0
					this.exportActualQuality = result.jpegQuality || model.export.jpegQuality
					this.exportCanvasWidth = result.width
					this.exportCanvasHeight = result.height
					this.progress = 100
					this.exportStatus = 'ready'
					this.recordCurrentExport(model)
					return
				}
				const image = {
					width: this.selectedPhoto.width || model.source.width,
					height: this.selectedPhoto.height || model.source.height
				}
				const size = measureComposition(model, image)
				this.exportCanvasWidth = size.width
				this.exportCanvasHeight = size.height
				this.progress = 42
				const result = await renderCompositionToTempFile({
					model,
					image,
					page: this,
					canvasId: EXPORT_CANVAS_ID
				})
				this.exportTempFilePath = result.tempFilePath || ''
				this.exportSize = Number(result.size || 0)
				this.progress = 100
				this.exportStatus = 'ready'
				this.recordCurrentExport(model)
			} catch (error) {
				this.progress = 100
				this.exportStatus = 'error'
				this.exportError = error && (error.errMsg || error.message) ? (error.errMsg || error.message) : 'Export failed'
			}
		},
		shouldSimulateExportError() {
			if (!this.isH5Runtime) return false
			const params = this.readH5QueryParams()
			return params.get('simulateExportError') === '1'
		},
		recordCurrentExport(model) {
			this.recentExports = recordExportHistory({
				fileName: this.exportDownloadName || this.createExportFileName(),
				mode: this.mode,
				width: this.exportCanvasWidth,
				height: this.exportCanvasHeight,
				size: this.exportSize,
				format: model.export.format,
				target: this.isH5Runtime ? 'download' : 'album'
			})
		},
		closeExport() {
			this.exportOpen = false
		},
		saveExportedImage() {
			if (!this.exportTempFilePath) {
				this.saveStatus = 'error'
				this.saveError = 'Create export first'
				return
			}
			this.saveStatus = 'saving'
			this.saveError = ''

			if (this.isH5Runtime) {
				this.downloadExportedImage()
				return
			}

			if (typeof uni.saveImageToPhotosAlbum === 'function') {
				uni.saveImageToPhotosAlbum({
					filePath: this.exportTempFilePath,
					success: () => {
						this.saveStatus = 'saved'
						uni.showToast({ title: 'Saved locally', icon: 'success' })
					},
					fail: (error) => {
						this.saveStatus = 'error'
						this.saveError = error && error.errMsg ? error.errMsg : 'Save failed'
						uni.showToast({ title: 'Save failed', icon: 'none' })
					}
				})
				return
			}

			if (typeof document !== 'undefined') {
				this.downloadExportedImage()
				return
			}

			this.saveStatus = 'error'
			this.saveError = 'Save is not supported in this runtime'
			uni.showToast({ title: 'Save not supported', icon: 'none' })
		},
		downloadExportedImage() {
			const link = document.createElement('a')
			link.href = this.exportTempFilePath
			link.download = this.exportDownloadName || this.createExportFileName()
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			this.saveStatus = 'saved'
			uni.showToast({ title: 'Download started', icon: 'success' })
		},
		createExportFileName() {
			const stamp = new Date().toISOString().replace(/[:.]/g, '-')
			const width = this.exportCanvasWidth || this.compositionModel.export.width
			return `signet-${this.mode}-${width}px-${stamp}.${exportExtension(this.exportFormat)}`
		},
		onBorderChange(event) {
			this.borderValue = event.detail.value
			this.saveEditorSettings()
		},
		onOpacityChange(event) {
			this.opacity = event.detail.value
			this.saveEditorSettings()
		},
		onSizeChange(event) {
			this.markSize = event.detail.value
			this.saveEditorSettings()
		},
		onOffsetChange(event) {
			this.offset = event.detail.value
			this.saveEditorSettings()
		},
		onBandChange(event) {
			this.bandHeight = event.detail.value
			this.saveEditorSettings()
		},
		onCaptionSizeChange(event) {
			this.captionSize = event.detail.value
			this.saveEditorSettings()
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background:
		linear-gradient(90deg, rgba(60, 47, 47, 0.045), transparent 12%, transparent 88%, rgba(60, 47, 47, 0.045)),
		radial-gradient(circle at 20% 10%, rgba(255,255,255,0.84), transparent 36%),
		#F9F7F2;
	color: #1A2A3A;
}

.safe-top {
	height: env(safe-area-inset-top);
	min-height: 28rpx;
}

.home-topbar,
.editor-topbar {
	height: 112rpx;
	padding: 0 36rpx;
	display: grid;
	grid-template-columns: 88rpx 1fr 128rpx;
	align-items: center;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
}

.home-topbar {
	border-bottom: 0;
}

.brand-title,
.page-title,
.sheet-title {
	font-family: Georgia, "Times New Roman", serif;
	text-align: center;
	font-size: 54rpx;
	line-height: 1;
	letter-spacing: 0;
}

.topbar-spacer,
.settings-button,
.nav-button {
	width: 88rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1A2A3A;
	font-size: 44rpx;
}

.nav-button {
	font-size: 64rpx;
}

.export-button {
	height: 68rpx;
	padding: 0 28rpx;
	border-radius: 14rpx;
	background: #1A2A3A;
	color: #FFFFFF;
	font-size: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 1;
}

.export-button[disabled] {
	opacity: 0.42;
}

.import-screen {
	padding: 0 40rpx 64rpx;
}

.empty-frame {
	width: 364rpx;
	height: 364rpx;
	margin: 112rpx auto 56rpx;
	padding: 52rpx;
	background: linear-gradient(145deg, #FFFFFF, #F2EFE8);
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	box-shadow: 0 24rpx 48rpx rgba(26, 42, 58, 0.12);
}

.empty-frame.ready {
	padding: 18rpx;
}

.import-photo,
.real-photo,
.mini-real-photo,
.placeholder-art {
	width: 100%;
	height: 100%;
	display: block;
}

.placeholder-art {
	filter: saturate(0.86) contrast(0.98);
}

.placeholder-image,
.sample-photo,
.mini-photo,
.preset-photo,
.mode-photo {
	position: relative;
	overflow: hidden;
	background: linear-gradient(180deg, #DDE6E8 0%, #C9D4D0 44%, #7B8778 45%, #3D4A3F 100%);
}

.placeholder-image {
	height: 100%;
	opacity: 0.4;
}

.placeholder-sun {
	position: absolute;
	left: 44rpx;
	top: 46rpx;
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background: #D4D0C6;
}

.placeholder-mountain,
.ridge {
	position: absolute;
	width: 0;
	height: 0;
	border-left: 92rpx solid transparent;
	border-right: 92rpx solid transparent;
	border-bottom: 120rpx solid rgba(122, 125, 116, 0.35);
}

.placeholder-mountain.one {
	left: 38rpx;
	bottom: 44rpx;
}

.placeholder-mountain.two {
	right: 22rpx;
	bottom: 44rpx;
	border-bottom-color: rgba(122, 125, 116, 0.25);
}

.primary-button,
.secondary-button {
	height: 96rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
}

.primary-button {
	background: #1A2A3A;
	color: #FFFFFF;
	box-shadow: 0 16rpx 36rpx rgba(26, 42, 58, 0.18);
}

.choose-button {
	width: 100%;
}

.secondary-button {
	border: 1rpx solid rgba(26, 42, 58, 0.28);
	color: #1A2A3A;
	background: rgba(255, 255, 255, 0.35);
}

.secondary-button.danger {
	color: #C74E4E;
	border-color: rgba(217, 107, 107, 0.8);
}

.primary-button.small {
	height: 88rpx;
}

.local-note {
	margin: 36rpx 0 32rpx;
	display: grid;
	grid-template-columns: 1fr auto auto 1fr;
	align-items: center;
	column-gap: 16rpx;
	color: rgba(26, 42, 58, 0.54);
	font-size: 28rpx;
}

.hairline {
	height: 1rpx;
	background: rgba(26, 42, 58, 0.16);
}

.lock-icon {
	transform: rotate(45deg);
	font-size: 28rpx;
}

.photo-info-card {
	margin-bottom: 44rpx;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.1);
	border-radius: 18rpx;
	background: rgba(255, 255, 255, 0.42);
	color: rgba(26, 42, 58, 0.68);
	font-size: 24rpx;
	line-height: 1.35;
}

.photo-info-card.muted {
	color: rgba(26, 42, 58, 0.56);
}

.info-title {
	color: #1A2A3A;
	font-size: 30rpx;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.section-title {
	display: block;
	font-size: 32rpx;
	margin-bottom: 28rpx;
}

.section-header .section-title {
	margin-bottom: 0;
}

.section-count {
	min-width: 48rpx;
	height: 40rpx;
	padding: 0 14rpx;
	border-radius: 20rpx;
	background: rgba(26, 42, 58, 0.08);
	color: rgba(26, 42, 58, 0.68);
	font-size: 24rpx;
	text-align: center;
	line-height: 40rpx;
}

.history-section {
	margin-bottom: 44rpx;
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 14rpx;
}

.history-item {
	min-height: 92rpx;
	padding: 20rpx 22rpx;
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	column-gap: 16rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.1);
	border-radius: 16rpx;
	background: rgba(255, 255, 255, 0.44);
	min-width: 0;
}

.history-title,
.history-meta {
	display: block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.history-title {
	color: #1A2A3A;
	font-size: 26rpx;
}

.history-meta,
.history-time {
	margin-top: 8rpx;
	color: rgba(26, 42, 58, 0.58);
	font-size: 22rpx;
}

.preset-row,
.mode-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 22rpx;
}

.preset-card,
.mode-card {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	align-items: center;
	color: #1A2A3A;
}

.preset-preview {
	width: 100%;
	aspect-ratio: 1;
	padding: 22rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background: #FFFEFA;
	box-shadow: 0 12rpx 26rpx rgba(26, 42, 58, 0.08);
	border: 4rpx solid transparent;
}

.preset-preview.bottomBand {
	justify-content: flex-start;
	padding-bottom: 24rpx;
}

.preset-card.selected .preset-preview {
	border-color: rgba(26, 42, 58, 0.7);
}

.preset-photo {
	width: 100%;
	height: auto;
	aspect-ratio: 4 / 3;
}

.preset-band {
	flex: 1;
	min-height: 72rpx;
	background:
		linear-gradient(90deg, transparent 20%, rgba(60, 47, 47, 0.26) 20% 44%, transparent 44% 56%, rgba(60, 47, 47, 0.26) 56% 80%, transparent 80%),
		#F9F7F2;
	background-size: 100% 1rpx, auto;
	background-repeat: no-repeat;
	background-position: center 48%, 0 0;
}

.preset-label {
	font-size: 26rpx;
}

.editor-screen {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.preview-shell {
	padding: 64rpx 32rpx 48rpx;
	background: linear-gradient(180deg, rgba(239, 239, 239, 0.72), rgba(249, 247, 242, 0.88));
}

.preview-shell.inPhoto {
	background: rgba(239, 239, 239, 0.3);
}

.photo-surface {
	width: 100%;
	max-width: 684rpx;
	margin: 0 auto;
	padding: 64rpx;
	background:
		linear-gradient(145deg, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0) 38%),
		var(--mat-color, #F9F7F2);
	border: 1rpx solid rgba(26, 42, 58, 0.14);
	box-shadow:
		0 28rpx 58rpx rgba(26, 42, 58, 0.18),
		0 4rpx 0 rgba(255, 255, 255, 0.9) inset,
		0 0 0 16rpx rgba(255, 255, 255, 0.22) inset;
}

.preview-shell.inPhoto .photo-surface {
	padding: 18rpx;
}

.preview-shell.bottomBand .photo-surface {
	padding-bottom: 0;
}

.preview-shell.fullFrame .photo-surface {
	padding-bottom: 82rpx;
}

.photo-stage {
	position: relative;
	width: 100%;
	aspect-ratio: 1;
	min-height: 0;
	max-height: 640rpx;
	overflow: hidden;
	background: #F9F7F2;
	border: 1rpx solid rgba(26, 42, 58, 0.12);
}

.real-photo {
	object-fit: cover;
	background: #F9F7F2;
}

.sample-photo {
	height: 540rpx;
}

.sky {
	position: absolute;
	inset: 0 0 46%;
	background: linear-gradient(180deg, #C9D9E0 0%, #EEF0EC 100%);
}

.ridge {
	bottom: 38%;
	border-left-width: 220rpx;
	border-right-width: 220rpx;
}

.ridge-back {
	left: -84rpx;
	border-bottom: 190rpx solid #87918C;
}

.ridge-front {
	right: -126rpx;
	border-bottom: 236rpx solid #5C6862;
}

.lake {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 45%;
	background: linear-gradient(180deg, rgba(67, 84, 78, 0.88), #26352F);
}

.shore {
	position: absolute;
	right: -20rpx;
	bottom: 94rpx;
	width: 280rpx;
	height: 90rpx;
	background: rgba(153, 125, 77, 0.72);
	transform: skewX(-24deg);
}

.rock {
	position: absolute;
	left: 45%;
	bottom: 126rpx;
	width: 108rpx;
	height: 72rpx;
	border-radius: 48% 52% 44% 56%;
	background: #615A4D;
}

.caption-band {
	padding: 38rpx 10rpx 0;
	text-align: center;
}

.preview-shell.fullFrame .caption-band {
	margin-bottom: -42rpx;
}

.caption-band.compact {
	padding: 34rpx 10rpx 28rpx;
}

.caption-line,
.mark-meta {
	display: block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-family: Georgia, "Times New Roman", serif;
	font-size: var(--caption-size, 34rpx);
	line-height: 1.2;
	letter-spacing: 0;
	word-spacing: 12rpx;
}

.caption-rule {
	margin: 24rpx auto 18rpx;
	width: 68%;
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	gap: 14rpx;
	color: #8A6A52;
}

.caption-rule view {
	height: 1rpx;
	background: rgba(60, 47, 47, 0.42);
}

.signature,
.mark-title {
	display: block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 30rpx;
	font-style: italic;
}

.in-photo-mark {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	max-width: 88%;
	color: #F9F7F2;
	text-align: center;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.65);
	font-size: var(--mark-size, 52rpx);
}

.in-photo-mark .mark-meta {
	font-size: 0.52em;
}

.anchor-bottom-center {
	left: 50%;
	bottom: var(--mark-offset, 48rpx);
	transform: translateX(-50%);
}

.anchor-top-left { left: var(--mark-offset, 48rpx); top: var(--mark-offset, 48rpx); align-items: flex-start; text-align: left; }
.anchor-top-center { left: 50%; top: var(--mark-offset, 48rpx); transform: translateX(-50%); }
.anchor-top-right { right: var(--mark-offset, 48rpx); top: var(--mark-offset, 48rpx); align-items: flex-end; text-align: right; }
.anchor-middle-left { left: var(--mark-offset, 48rpx); top: 50%; transform: translateY(-50%); align-items: flex-start; text-align: left; }
.anchor-middle-center { left: 50%; top: 50%; transform: translate(-50%, -50%); }
.anchor-middle-right { right: var(--mark-offset, 48rpx); top: 50%; transform: translateY(-50%); align-items: flex-end; text-align: right; }
.anchor-bottom-left { left: var(--mark-offset, 48rpx); bottom: var(--mark-offset, 48rpx); align-items: flex-start; text-align: left; }
.anchor-bottom-right { right: var(--mark-offset, 48rpx); bottom: var(--mark-offset, 48rpx); align-items: flex-end; text-align: right; }

.control-panel {
	flex: 1;
	padding: 0 48rpx 48rpx;
	background: linear-gradient(180deg, rgba(255, 254, 250, 0.94), rgba(249, 247, 242, 0.96));
	border-top: 1rpx solid rgba(26, 42, 58, 0.1);
	box-shadow: 0 -16rpx 42rpx rgba(26, 42, 58, 0.035);
}

.tabs {
	height: 96rpx;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	align-items: stretch;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
}

.tab {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(26, 42, 58, 0.58);
	font-size: 30rpx;
}

.tab.active {
	color: #1A2A3A;
}

.tab.active::after {
	content: "";
	position: absolute;
	left: 16rpx;
	right: 16rpx;
	bottom: 0;
	height: 4rpx;
	background: #1A2A3A;
}

.panel-content {
	padding-top: 28rpx;
}

.mode-grid {
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 30rpx;
}

.mode-card {
	font-size: 22rpx;
	background: transparent;
}

.mode-thumb {
	width: 100%;
	aspect-ratio: 1;
	padding: 26rpx;
	border-radius: 14rpx;
	background: linear-gradient(145deg, #FFFEFA, #EEEAE1);
	border: 1rpx solid rgba(26, 42, 58, 0.1);
	box-shadow:
		0 12rpx 28rpx rgba(26, 42, 58, 0.08),
		inset 0 0 0 8rpx rgba(255, 255, 255, 0.28);
}

.mode-card.selected .mode-thumb {
	outline: 4rpx solid #1A2A3A;
	outline-offset: 8rpx;
}

.quick-editor {
	margin-top: 32rpx;
	border-top: 1rpx solid rgba(26, 42, 58, 0.08);
}

.summary-row {
	min-height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
	color: rgba(26, 42, 58, 0.72);
	font-size: 28rpx;
}

.summary-row text:last-child {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: right;
	color: #1A2A3A;
}

.text-input-row {
	min-height: 96rpx;
	display: grid;
	grid-template-columns: 180rpx 1fr;
	align-items: center;
	column-gap: 20rpx;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
	font-size: 30rpx;
}

.text-input-row input {
	height: 64rpx;
	min-width: 0;
	padding: 0 22rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	border-radius: 14rpx;
	background: rgba(255, 255, 255, 0.58);
	color: #1A2A3A;
	text-align: right;
}

.switch-row {
	min-height: 66rpx;
	display: flex;
	gap: 18rpx;
	align-items: center;
	justify-content: flex-end;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
	padding: 8rpx 0;
}

.switch-row button {
	width: auto;
	min-width: 156rpx;
	height: 48rpx;
	min-height: 48rpx;
	margin: 0;
	padding: 0 24rpx;
	border-radius: 999rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	background: rgba(255, 255, 255, 0.34);
	color: #1A2A3A;
	font-size: 23rpx;
	line-height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.switch-row button.active {
	background: #1A2A3A;
	color: #FFFFFF;
}

.mode-photo {
	width: 100%;
	height: 100%;
}

.mode-thumb.fullFrame .mode-photo {
	border: 20rpx solid #F9F7F2;
}

.mode-band {
	height: 28%;
	background: #F9F7F2;
}

.mode-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #F9F7F2;
	margin: -30rpx auto 0;
	position: relative;
	z-index: 1;
}

.slider-row {
	min-height: 96rpx;
	display: grid;
	grid-template-columns: 128rpx 1fr 72rpx;
	align-items: center;
	column-gap: 12rpx;
	font-size: 28rpx;
	padding: 8rpx 0;
}

.toggle-row {
	min-height: 86rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
	font-size: 30rpx;
}

.control-label {
	display: block;
	margin: 22rpx 0 18rpx;
	font-size: 28rpx;
}

.swatches {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 22rpx;
}

.swatch {
	aspect-ratio: 1;
	border-radius: 12rpx;
	border: 1rpx solid rgba(26, 42, 58, 0.1);
}

.swatch.selected {
	box-shadow: 0 0 0 4rpx #1A2A3A;
}

.wide-row {
	min-height: 96rpx;
	padding: 0 22rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
	color: #1A2A3A;
	font-size: 30rpx;
}

.wide-row text:last-child {
	max-width: 58%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: right;
}

.quick-editor .wide-row text:last-child {
	max-width: 68%;
}

.check {
	color: #1A2A3A;
	font-weight: 600;
}

.anchor-layout {
	margin-top: 30rpx;
	display: grid;
	grid-template-columns: 160rpx 1fr;
	align-items: center;
}

.anchor-labels {
	height: 260rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size: 30rpx;
}

.anchor-grid {
	display: grid;
	grid-template-columns: repeat(3, 88rpx);
	grid-auto-rows: 88rpx;
	gap: 18rpx;
	justify-content: center;
}

.anchor-cell {
	border: 1rpx solid rgba(26, 42, 58, 0.12);
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.36);
}

.anchor-cell view {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: rgba(26, 42, 58, 0.28);
}

.anchor-cell.selected {
	border-color: #1A2A3A;
}

.anchor-cell.selected view {
	width: 30rpx;
	height: 30rpx;
	background: #1A2A3A;
}

.action-row {
	margin-top: 34rpx;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.segmented {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
	margin-bottom: 34rpx;
}

.segmented button {
	height: 88rpx;
	border-radius: 14rpx;
	background: rgba(255, 255, 255, 0.36);
	border: 1rpx solid rgba(26, 42, 58, 0.08);
	color: #1A2A3A;
	font-size: 28rpx;
}

.segmented button.selected {
	border-color: #1A2A3A;
}

.modal-layer {
	position: fixed;
	inset: 0;
	z-index: 20;
	display: flex;
	align-items: flex-end;
	background: rgba(26, 42, 58, 0.42);
}

.scrim {
	position: absolute;
	inset: 0;
}

.caption-sheet,
.export-card {
	position: relative;
	width: 100%;
	padding: 20rpx 40rpx 44rpx;
	border-radius: 32rpx 32rpx 0 0;
	background: #FFFEFA;
	box-shadow: 0 -18rpx 48rpx rgba(26, 42, 58, 0.12);
}

.grabber {
	width: 72rpx;
	height: 8rpx;
	margin: 0 auto 32rpx;
	border-radius: 999rpx;
	background: rgba(26, 42, 58, 0.16);
}

.field-list {
	margin-top: 30rpx;
	border-top: 1rpx solid rgba(26, 42, 58, 0.08);
}

.field-row {
	min-height: 86rpx;
	display: grid;
	grid-template-columns: 180rpx 1fr;
	align-items: center;
	border-bottom: 1rpx solid rgba(26, 42, 58, 0.08);
	font-size: 30rpx;
}

.field-input {
	height: 62rpx;
	padding: 0 22rpx;
	border-radius: 14rpx;
	background: rgba(239, 239, 239, 0.62);
	text-align: right;
	color: #1A2A3A;
}

.export-layer {
	align-items: center;
	padding: 44rpx;
}

.export-card {
	border-radius: 28rpx;
	max-height: calc(100vh - 88rpx);
	overflow-y: auto;
}

.mini-preview {
	width: 330rpx;
	margin: 34rpx auto;
	padding: 24rpx;
	background: #F9F7F2;
	box-shadow: 0 12rpx 28rpx rgba(26, 42, 58, 0.12);
	text-align: center;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 20rpx;
}

.mini-photo,
.mini-real-photo {
	height: 240rpx;
	margin-bottom: 18rpx;
}

.progress-card,
.check-card {
	padding: 28rpx;
	border-radius: 20rpx;
	background: rgba(249, 247, 242, 0.82);
	border: 1rpx solid rgba(26, 42, 58, 0.08);
}

.progress-head,
.progress-foot {
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
}

.progress-foot.muted {
	margin-top: 10rpx;
	justify-content: flex-start;
	color: rgba(26, 42, 58, 0.54);
	font-size: 22rpx;
}

.progress-track {
	height: 12rpx;
	margin: 24rpx 0;
	border-radius: 999rpx;
	background: rgba(26, 42, 58, 0.12);
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: #1A2A3A;
}

.check-card {
	margin-top: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	font-size: 28rpx;
}

.check-card.error {
	color: #C74E4E;
	border-color: rgba(217, 107, 107, 0.55);
}

.export-canvas {
	position: fixed;
	left: -99999px;
	top: -99999px;
	pointer-events: none;
}

@media (max-width: 360px) {
	.import-screen {
		padding-left: 28rpx;
		padding-right: 28rpx;
	}

	.preset-row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.mode-grid {
		gap: 18rpx;
	}

	.export-layer {
		padding: 24rpx;
	}
}

</style>
