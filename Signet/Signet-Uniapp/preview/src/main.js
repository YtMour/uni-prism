import { createApp } from 'vue/dist/vue.esm-bundler.js'
import { DEFAULT_EXPORT_SETTINGS, buildCompositionModel, exportExtension } from './compositionModel.js'
import { renderCompositionToBlob } from './canvasRenderer.js'
import './style.css'

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

const SETTINGS_STORAGE_KEY = 'signet.preview.settings.v1'

const DEMO_PHOTO = {
  id: 'landscape',
  src: '/demo-landscape.png',
  name: 'demo-landscape.jpg',
  type: 'JPG',
  size: 2431554,
  sizeLabel: '2.3 MB',
  width: 4000,
  height: 3000,
  aspectLabel: 'Landscape'
}

const DEMO_PHOTOS = [
  { ...DEMO_PHOTO, label: 'Landscape', sizeLabel: '2.6 MB' },
  {
    id: 'portrait',
    label: 'Portrait',
    src: '/demo-portrait.png',
    name: 'demo-portrait.jpg',
    type: 'JPG',
    size: 1900000,
    sizeLabel: '1.9 MB',
    width: 1200,
    height: 1600,
    aspectLabel: 'Portrait'
  },
  {
    id: 'square',
    label: 'Square',
    src: '/demo-square.png',
    name: 'demo-square.jpg',
    type: 'JPG',
    size: 1700000,
    sizeLabel: '1.7 MB',
    width: 1400,
    height: 1400,
    aspectLabel: 'Square'
  },
  {
    id: 'wide',
    label: 'Wide',
    src: '/demo-wide.png',
    name: 'demo-wide.jpg',
    type: 'JPG',
    size: 1600000,
    sizeLabel: '1.6 MB',
    width: 1800,
    height: 900,
    aspectLabel: 'Wide'
  }
]

const App = {
  data() {
    const savedSettings = this.readSavedSettings()
    return {
      screen: 'import',
      mode: 'fullFrame',
      activeTab: 'frame',
      captionOpen: false,
      exportOpen: false,
      exportUrl: '',
      exportName: '',
      exportError: '',
      exportBytes: 0,
      exportStatus: 'idle',
      settingsPanel: '',
      progress: 0,
      exportWidth: savedSettings.exportWidth,
      exportFormat: savedSettings.exportFormat,
      jpegQuality: savedSettings.jpegQuality,
      borderValue: 32,
      opacity: 78,
      markSize: 48,
      offset: 50,
      bandHeight: 20,
      captionSize: 34,
      alignment: 'Center',
      selectedAnchor: 'bottom-center',
      selectedSwatch: '#F9F7F2',
      selectedPhoto: { ...DEFAULT_PHOTO },
      demoSelectedId: 'landscape',
      watermarkText: 'Signet',
      showWatermarkName: true,
      showMetadataLine: true,
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
      presets: [
        { id: 'classic', label: 'Classic', mode: 'fullFrame' },
        { id: 'editorial', label: 'Editorial', mode: 'bottomBand' }
      ],
      demoPhotos: DEMO_PHOTOS,
      exportWidths: [1200, 1600, 2400, 3200],
      anchors: ['top-left','top-center','top-right','middle-left','middle-center','middle-right','bottom-left','bottom-center','bottom-right'],
      alignments: ['Left', 'Center', 'Right'],
      swatches: ['#F9F7F2', '#EDE6D8', '#EFEFEF', '#E5EAE6', '#1A2A3A', '#3C2F2F'],
      metadataFields: [
        { key: 'camera', label: 'Camera', value: 'Manual' },
        { key: 'lens', label: 'Lens', value: '35mm' },
        { key: 'shutter', label: 'Shutter', value: '1/250s' },
        { key: 'aperture', label: 'Aperture', value: 'f/2.8' },
        { key: 'iso', label: 'ISO', value: '200' },
        { key: 'focal', label: 'Focal', value: '35mm' }
      ]
    }
  },
  watch: {
    exportWidth() {
      this.saveSettings()
    },
    exportFormat() {
      this.saveSettings()
    },
    jpegQuality() {
      this.saveSettings()
    }
  },
  computed: {
    hasPhoto() {
      return Boolean(this.selectedPhoto.src)
    },
    activeTitle() {
      if (this.screen === 'demo') return 'Demo'
      if (this.screen === 'position') return 'Position'
      if (this.screen === 'bottomBand') return 'Bottom Band'
      return 'Edit Frame'
    },
    modeLabel() {
      const item = this.modes.find(mode => mode.id === this.mode)
      return item ? item.label : 'Frame'
    },
    captionText() {
      const values = this.metadataFields.map(field => field.value).filter(value => String(value || '').trim())
      return values.join('  ')
    },
    stageStyle() {
      const markSize = Math.round(12 + this.markSize * 0.28)
      const markOffset = Math.round(8 + this.offset * 0.32)
      const vars = `--mark-size: ${markSize}px; --mark-offset: ${markOffset}px;`
      if (!this.hasPhoto || !this.selectedPhoto.width || !this.selectedPhoto.height) return vars
      const ratio = this.selectedPhoto.width / this.selectedPhoto.height
      const maxWidth = ratio < 1 ? Math.round(Math.max(300, Math.min(360, 420 * ratio))) : 430
      return `aspect-ratio: ${ratio}; max-width: min(100%, ${maxWidth}px); ${vars}`
    },
    surfaceStyle() {
      const style = {
        '--mat-color': this.selectedSwatch,
        '--caption-size': `${this.captionSize}px`
      }
      if (!this.hasPhoto || !this.selectedPhoto.width || !this.selectedPhoto.height) {
        style['--surface-width'] = '390px'
        return style
      }
      const ratio = this.selectedPhoto.width / this.selectedPhoto.height
      if (this.mode === 'inPhoto') {
        style['--surface-width'] = ratio < 1 ? '350px' : '430px'
      } else if (ratio < 1) {
        style['--surface-width'] = '360px'
      } else if (ratio > 1.7) {
        style['--surface-width'] = '430px'
      } else {
        style['--surface-width'] = '390px'
      }
      return style
    },
    anchorClass() {
      return `anchor-${this.selectedAnchor}`
    },
    captionClass() {
      return [
        this.mode === 'bottomBand' ? 'compact' : '',
        this.mode === 'bottomBand' ? `align-${String(this.alignment || 'Center').toLowerCase()}` : ''
      ]
    },
    anchorLabel() {
      return this.selectedAnchor.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    },
    photoSummary() {
      if (!this.hasPhoto) return 'No photo selected'
      return `${this.selectedPhoto.type || 'IMAGE'} · ${this.selectedPhoto.width || '?'} × ${this.selectedPhoto.height || '?'} · ${this.selectedPhoto.aspectLabel || 'Unknown'}`
    },
    captionSizeLabel() {
      return `${this.captionSize}px`
    },
    exportSizeLabel() {
      return this.exportBytes ? this.formatSize(this.exportBytes) : 'Pending'
    },
    exportDeltaLabel() {
      if (!this.exportBytes || !this.selectedPhoto.size) return 'Original unknown'
      const ratio = this.exportBytes / this.selectedPhoto.size
      if (ratio >= 1) return `${ratio.toFixed(2)}x original size`
      return `${Math.round(ratio * 100)}% of original size`
    },
    exportFormatLabel() {
      return this.exportFormat === 'image/jpeg' ? `JPEG ${this.jpegQuality}%` : 'PNG'
    },
    compositionModel() {
      return buildCompositionModel(this)
    }
  },
  methods: {
    readSavedSettings() {
      const fallback = {
        exportWidth: DEFAULT_EXPORT_SETTINGS.width,
        exportFormat: DEFAULT_EXPORT_SETTINGS.format,
        jpegQuality: DEFAULT_EXPORT_SETTINGS.jpegQuality
      }
      try {
        const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
        if (!raw) return fallback
        const parsed = JSON.parse(raw)
        return {
          exportWidth: Number(parsed.exportWidth) || fallback.exportWidth,
          exportFormat: parsed.exportFormat === 'image/png' ? 'image/png' : fallback.exportFormat,
          jpegQuality: Number(parsed.jpegQuality) || fallback.jpegQuality
        }
      } catch {
        return fallback
      }
    },
    saveSettings() {
      try {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
          exportWidth: Number(this.exportWidth),
          exportFormat: this.exportFormat,
          jpegQuality: Number(this.jpegQuality)
        }))
      } catch {
        // Ignore storage failures; export controls still work for the session.
      }
    },
    openSettings() {
      this.screen = 'settings'
    },
    openDemo() {
      this.screen = 'demo'
    },
    choosePhoto() {
      this.$nextTick(() => {
        document.getElementById('photo-input')?.click()
      })
    },
    useDemoPhoto() {
      const picked = this.demoPhotos.find(photo => photo.id === this.demoSelectedId) || DEMO_PHOTOS[0]
      this.selectedPhoto = { ...picked }
      this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
    },
    useDemoVariant(photo) {
      this.demoSelectedId = photo.id
      if (this.screen !== 'demo') {
        this.selectedPhoto = { ...photo }
        this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
      }
    },
    handlePhotoFile(event) {
      const file = event.target.files && event.target.files[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      const image = new Image()
      image.onload = () => {
        this.selectedPhoto = {
          src: url,
          name: file.name || 'Local photo',
          type: this.readFileType(file.type, file.name),
          size: file.size || 0,
          sizeLabel: this.formatSize(file.size || 0),
          width: image.naturalWidth || 0,
          height: image.naturalHeight || 0,
          aspectLabel: this.formatAspect(image.naturalWidth || 0, image.naturalHeight || 0)
        }
        this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
      }
      image.onerror = () => {
        URL.revokeObjectURL(url)
      }
      image.src = url
      event.target.value = ''
    },
    readFileType(fileType, name) {
      if (fileType) return fileType.replace('image/', '').toUpperCase()
      const match = String(name || '').match(/\.([a-z0-9]+)$/i)
      return match ? match[1].toUpperCase() : 'IMAGE'
    },
    formatSize(size) {
      if (!size) return 'Size unknown'
      if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
      return `${(size / 1024 / 1024).toFixed(1)} MB`
    },
    formatAspect(width, height) {
      if (!width || !height) return 'Aspect unknown'
      if (Math.abs(width - height) < 4) return 'Square'
      return width > height ? 'Landscape' : 'Portrait'
    },
    startEditing() {
      if (!this.hasPhoto) {
        this.useDemoPhoto()
        return
      }
      this.screen = this.mode === 'bottomBand' ? 'bottomBand' : 'editor'
    },
    goBack() {
      if (this.screen === 'demo') {
        this.screen = 'import'
        return
      }
      if (this.screen === 'settings') {
        this.screen = this.hasPhoto ? 'editor' : 'import'
        return
      }
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
    selectPreset(mode) {
      this.mode = mode
      this.activeTab = mode === 'fullFrame' ? 'frame' : 'layout'
    },
    setMode(mode) {
      this.mode = mode
      this.activeTab = mode === 'fullFrame' ? 'frame' : 'layout'
      if (mode === 'bottomBand') this.screen = 'bottomBand'
      if (mode === 'inPhoto') this.screen = 'position'
    },
    openCaption() {
      this.captionOpen = true
    },
    openPosition() {
      this.mode = 'inPhoto'
      this.screen = 'position'
    },
    applyPosition() {
      this.mode = 'inPhoto'
      this.screen = 'editor'
    },
    async openExport() {
      if (!this.hasPhoto) {
        this.useDemoPhoto()
        return
      }
      this.exportOpen = true
      this.exportStatus = 'rendering'
      this.exportError = ''
      this.progress = 12
      if (this.exportUrl) URL.revokeObjectURL(this.exportUrl)
      this.exportUrl = ''
      this.exportName = ''
      this.exportBytes = 0
      await this.$nextTick()
      try {
        const blob = await this.renderComposition()
        this.progress = 100
        this.exportBytes = blob.size || 0
        this.exportUrl = URL.createObjectURL(blob)
        const ext = exportExtension(this.compositionModel.export.format)
        this.exportName = `signet-${this.mode}-${this.exportWidth}px-${Date.now()}.${ext}`
        this.exportStatus = 'ready'
      } catch (error) {
        this.exportStatus = 'error'
        this.exportError = error && error.message ? error.message : 'Export failed'
      }
    },
    closeExport() {
      this.exportOpen = false
    },
    loadExportImage() {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('Image could not be loaded for export'))
        image.src = this.selectedPhoto.src
      })
    },
    async renderComposition() {
      const image = await this.loadExportImage()
      this.progress = 42
      const model = this.compositionModel
      const blob = await renderCompositionToBlob(model, image, () => document.createElement('canvas'))
      this.progress = 82
      return blob
    }
  },
  template: `
    <main class="device">
      <div v-if="screen === 'settings'" class="page settings-page">
        <div class="topbar three"><button @click="goBack">‹</button><h1>Settings</h1><span></span></div>
        <section class="settings-group">
          <button class="settings-row" @click="settingsPanel='Language'"><span class="setting-icon globe"></span><div><strong>Language</strong><small>English</small></div><b>›</b></button>
          <button class="settings-row" @click="settingsPanel='Export'"><span class="setting-icon export-icon"></span><div><strong>Export</strong><small>{{ exportWidth }}px · {{ exportFormatLabel }}</small></div><b>›</b></button>
          <button class="settings-row" @click="settingsPanel='Privacy'"><span class="setting-icon lock"></span><div><strong>Privacy</strong><small>Local processing / On</small></div><b>›</b></button>
        </section>
        <section class="settings-group">
          <button class="settings-row" @click="settingsPanel='About'"><span class="setting-icon info"></span><div><strong>About</strong><small>Version 0.1</small></div><b>›</b></button>
          <button class="settings-row" @click="settingsPanel='Privacy Policy'"><span class="setting-icon shield"></span><div><strong>Privacy Policy</strong><small>No photo upload</small></div><b>›</b></button>
        </section>
        <p class="privacy-note">▢<br />Photos stay on this device</p>
        <section v-if="settingsPanel" class="settings-detail"><button class="settings-close" @click="settingsPanel=''">×</button><h2>{{ settingsPanel }}</h2><p v-if="settingsPanel==='Language'">English is active. More languages will be added after i18n resources are wired.</p><div v-else-if="settingsPanel==='Export'" class="settings-controls"><p>Default export settings are used by the editor and export renderer.</p><small>Width</small><div class="segmented export-widths"><button v-for="width in exportWidths" :class="{ selected: exportWidth === width }" @click="exportWidth = width">{{ width }}</button></div><small>Format</small><div class="segmented format-options"><button :class="{ selected: exportFormat === 'image/jpeg' }" @click="exportFormat = 'image/jpeg'">JPEG</button><button :class="{ selected: exportFormat === 'image/png' }" @click="exportFormat = 'image/png'">PNG</button></div><label v-if="exportFormat === 'image/jpeg'" class="quality-row"><span>Quality</span><input type="range" min="60" max="100" v-model="jpegQuality" /><b>{{ jpegQuality }}%</b></label></div><p v-else-if="settingsPanel==='Privacy'">Photos are processed locally in the app model. No upload path is used for editing.</p><p v-else-if="settingsPanel==='About'">Signet Preview · Version 0.1</p><p v-else>Draft privacy policy: your photos stay on this device during editing.</p></section>
      </div>

      <div v-else-if="screen === 'import'" class="page import-page">
        <div class="topbar three"><span></span><h1>Signet</h1><button @click="openSettings">⚙</button></div>
        <input id="photo-input" class="file-input" type="file" accept="image/*" @change="handlePhotoFile" />
        <div class="empty-frame" :class="{ ready: hasPhoto }">
          <img v-if="hasPhoto" class="import-photo" :src="selectedPhoto.src" />
          <img v-else class="placeholder-art" src="/import-placeholder.png" alt="" />
        </div>
        <button class="primary choose" @click="choosePhoto">{{ hasPhoto ? 'Change Photo' : 'Choose Photo' }}</button>
        <button class="demo-button" @click="openDemo">Open Demo</button>
        <div class="local-note"><span></span><b>▢</b><small>Local editing only</small><span></span></div>
        <section v-if="hasPhoto" class="photo-info-card"><strong class="info-title">{{ selectedPhoto.name }}</strong><small>{{ selectedPhoto.width }} × {{ selectedPhoto.height }} px</small><small>{{ selectedPhoto.type }} · {{ selectedPhoto.sizeLabel }} · {{ selectedPhoto.aspectLabel }}</small></section>
        <section v-else class="photo-info-card muted"><strong class="info-title">Supported local photos</strong><small>JPG, PNG, WebP, HEIC/HEIF where supported by the runtime.</small><small>Original resolution is preserved in the preview model.</small></section>
        <h2>Recent Presets</h2>
        <div class="presets">
          <button v-for="preset in presets" :key="preset.id" :class="{ selected: mode === preset.mode }" @click="selectPreset(preset.mode)">
            <div class="preset-thumb" :class="preset.mode"><img class="photo-mini" src="/demo-landscape.png" alt="" /><div v-if="preset.mode === 'bottomBand'" class="band-mini"></div></div>
            <small>{{ preset.label }}</small>
          </button>
        </div>
      </div>

      <div v-else-if="screen === 'demo'" class="page demo-page">
        <div class="topbar three"><button @click="goBack">‹</button><h1>Demo</h1><span></span></div>
        <section class="demo-hero">
          <div class="demo-frame">
            <img :src="(demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).src" alt="" />
          </div>
          <div class="demo-copy">
            <strong>{{ (demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).label }} Preview</strong>
            <small>{{ (demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).width }} × {{ (demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).height }} px</small>
            <small>{{ (demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).type }} · {{ (demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).sizeLabel }} · {{ (demoPhotos.find(item => item.id === demoSelectedId) || demoPhotos[0]).aspectLabel }}</small>
          </div>
        </section>
        <h2>Sample Photos</h2>
        <div class="sample-strip">
          <button v-for="photo in demoPhotos" :key="photo.id" :class="{ selected: demoSelectedId === photo.id }" @click="useDemoVariant(photo)">
            <span class="sample-preview" :class="photo.id"><img :src="photo.src" alt="" /></span>
            <span>{{ photo.label }}</span>
          </button>
        </div>
        <button class="primary choose demo-enter" @click="useDemoPhoto">Use Selected Demo</button>
        <section class="demo-notes">
          <p>Demo content is separated from the real import flow.</p>
          <p>Pick a ratio here, then continue into the editor.</p>
        </section>
      </div>

      <div v-else class="page editor-page">
        <div class="topbar three"><button @click="goBack">‹</button><h1>{{ activeTitle }}</h1><button class="export" :disabled="!hasPhoto" @click="openExport">Export</button></div>
        <section class="preview" :class="mode"><div class="photo-surface" :style="surfaceStyle"><div class="photo-stage" :style="stageStyle"><img v-if="hasPhoto" class="real-photo" :src="selectedPhoto.src" /><div v-else class="sample-photo"><div class="sky"></div><div class="ridge back"></div><div class="ridge front"></div><div class="lake"></div><div class="shore"></div><div class="rock"></div></div><div v-if="mode === 'inPhoto'" class="in-photo-mark" :class="anchorClass" :style="{ opacity: opacity / 100 }"><strong>{{ watermarkText }}</strong><small v-if="showMetadataLine">{{ captionText }}</small></div></div><div v-if="mode !== 'inPhoto'" class="caption" :class="captionClass"><p v-if="showMetadataLine">{{ captionText }}</p><div v-if="mode === 'bottomBand'" class="caption-rule"><span></span>◆<span></span></div><strong v-if="showWatermarkName">{{ watermarkText }}</strong></div></div></section>
        <section v-if="screen === 'editor'" class="panel">
          <nav class="tabs"><button v-for="tab in tabs" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ tab.label }}</button></nav>
          <div v-if="activeTab === 'frame'" class="panel-body">
            <div class="mode-grid">
              <button v-for="item in modes" :class="{ selected: mode === item.id }" @click="setMode(item.id)">
                <div class="mode-thumb" :class="item.id"><div class="thumb-photo"></div><div v-if="item.id === 'bottomBand'" class="thumb-band"></div><i v-if="item.id === 'inPhoto'"></i></div>
                <span>{{ item.label }}</span>
              </button>
            </div>
            <div class="quick-editor">
              <div class="summary-row"><span>Photo</span><b>{{ photoSummary }}</b></div>
              <label class="text-input-row"><span>Watermark</span><input v-model="watermarkText" maxlength="32" /></label>
              <button class="row" @click="openCaption"><span>Metadata</span><b>{{ captionText || 'Edit' }} ›</b></button>
              <div class="switch-row">
                <button :class="{ active: showWatermarkName }" @click="showWatermarkName = !showWatermarkName">Name</button>
                <button :class="{ active: showMetadataLine }" @click="showMetadataLine = !showMetadataLine">Metadata</button>
              </div>
            </div>
            <label>Border <input type="range" v-model="borderValue" /> {{ borderValue }}%</label>
            <p>Mat</p><div class="swatches"><button v-for="color in swatches" :style="{ background: color }" :class="{ selected: selectedSwatch === color }" @click="selectedSwatch = color"></button></div>
          </div>
          <div v-else-if="activeTab === 'text'" class="panel-body">
            <button class="row" @click="openCaption"><span>Watermark Text</span><b>{{ watermarkText }} ›</b></button>
            <button class="row" @click="openCaption"><span>Metadata fields</span><b>{{ captionText || 'Edit' }} ›</b></button>
            <button class="row" @click="openPosition"><span>Position</span><b>{{ anchorLabel }} ›</b></button>
            <button class="toggle-row" @click="showWatermarkName = !showWatermarkName"><span>Show name</span><span>{{ showWatermarkName ? 'On' : 'Off' }}</span></button>
            <button class="toggle-row" @click="showMetadataLine = !showMetadataLine"><span>Show metadata</span><span>{{ showMetadataLine ? 'On' : 'Off' }}</span></button>
            <label>Opacity <input type="range" v-model="opacity" /> {{ opacity }}%</label>
          </div>
          <div v-else class="panel-body">
            <button class="row" @click="setMode('fullFrame')">Full Frame <b v-if="mode==='fullFrame'">✓</b></button>
            <button class="row" @click="setMode('bottomBand')">Bottom Band <b v-if="mode==='bottomBand'">✓</b></button>
            <button class="row" @click="setMode('inPhoto')">In-Photo <b v-if="mode==='inPhoto'">✓</b></button>
            <p>Export</p>
            <div class="segmented export-widths"><button v-for="width in exportWidths" :class="{ selected: exportWidth === width }" @click="exportWidth = width">{{ width }}</button></div>
            <div class="segmented"><button :class="{ selected: exportFormat === 'image/png' }" @click="exportFormat = 'image/png'">PNG</button><button :class="{ selected: exportFormat === 'image/jpeg' }" @click="exportFormat = 'image/jpeg'">JPEG</button></div>
            <label v-if="exportFormat === 'image/jpeg'">Quality <input type="range" min="60" max="100" v-model="jpegQuality" /> {{ jpegQuality }}%</label>
          </div>
        </section>
        <section v-if="screen === 'position'" class="panel">
          <div class="anchor-layout"><div class="anchor-labels"><span>Top</span><span>Center</span><span>Bottom</span></div><div class="anchor-grid"><button v-for="anchor in anchors" :class="{ selected: selectedAnchor === anchor }" @click="selectedAnchor = anchor"><i></i></button></div></div>
          <label>Size <input type="range" v-model="markSize" /> A</label>
          <label>Offset <input type="range" v-model="offset" /> →</label>
          <div class="actions"><button class="secondary danger" @click="screen='editor'">Cancel</button><button class="primary" @click="applyPosition">Apply</button></div>
        </section>
        <section v-if="screen === 'bottomBand'" class="panel">
          <label>Band Height <input type="range" v-model="bandHeight" /> {{ bandHeight }}%</label>
          <label>Text Size <input type="range" min="22" max="44" v-model="captionSize" /> {{ captionSizeLabel }}</label>
          <p>Alignment</p><div class="segmented"><button v-for="align in alignments" :class="{ selected: alignment === align }" @click="alignment=align">{{ align }}</button></div>
          <p>Background</p><div class="swatches"><button v-for="color in swatches" :style="{ background: color }" :class="{ selected: selectedSwatch === color }" @click="selectedSwatch = color"></button></div>
        </section>
      </div>

      <div v-if="captionOpen" class="modal"><button class="scrim" @click="captionOpen=false"></button><section class="sheet"><i></i><h1>Watermark</h1><div class="field"><span>Name</span><input v-model="watermarkText" maxlength="32" /></div><div v-for="field in metadataFields" :key="field.key" class="field"><span>{{ field.label }}</span><input v-model="field.value" /></div><div class="actions"><button class="secondary" @click="captionOpen=false">Cancel</button><button class="primary" @click="captionOpen=false">Apply</button></div></section></div>
      <div v-if="exportOpen" class="modal center"><section class="export-card"><h1>Export</h1><div class="export-preview"><img v-if="exportUrl" class="photo-mini" :src="exportUrl" /><img v-else-if="hasPhoto" class="photo-mini" :src="selectedPhoto.src" /><div v-else class="photo-mini"></div><small>{{ modeLabel }} · {{ exportWidth }}px · {{ exportFormat === 'image/jpeg' ? 'JPEG ' + jpegQuality + '%' : 'PNG' }}</small></div><div class="progress"><p><b>{{ exportStatus === 'ready' ? 'Ready locally' : exportStatus === 'error' ? 'Export failed' : 'Rendering locally' }}</b><b>{{ progress }}%</b></p><span><i :style="{ width: progress + '%' }"></i></span><p><small>{{ exportSizeLabel }}</small><small>{{ exportDeltaLabel }}</small></p></div><div class="checklist" :class="{ error: exportStatus === 'error' }"><template v-if="exportStatus === 'error'">× {{ exportError }}</template><template v-else>✓ Render {{ modeLabel }}<br /><span v-if="exportStatus === 'ready'">✓ Download file is ready</span><span v-else>◌ Prepare download</span></template></div><div class="actions"><button class="secondary danger" @click="closeExport">Close</button><a v-if="exportUrl" class="primary download-link" :href="exportUrl" :download="exportName">Download</a><button v-else class="secondary" disabled>Download</button></div></section></div>
    </main>
  `
}

createApp(App).mount('#app')
