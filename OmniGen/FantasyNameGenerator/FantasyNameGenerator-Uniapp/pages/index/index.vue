<template>
  <view class="page">
    <AppTopbar
      :realm-status="realmStatus"
      :favorite-count="favorites.length"
      @open-settings="openSettings"
      @open-pocket="showPocket = true"
    />

    <view class="main-stage">
      <ResultStage
        :active-realm="activeRealm"
        :current="current"
        @generate="generateNext"
        @copy="copyCurrent"
        @favorite="favoriteCurrent"
      />
    </view>

    <view class="bottom-controls">
      <RealmControl :realms="realms" :realm-id="realmId" @select-realm="setRealm" />

      <ActionBar
        :saved="isCurrentFavorite"
        @open-filters="showFilters = true"
        @copy="copyCurrent"
        @favorite="favoriteCurrent"
        @open-export="showExport = true"
      />
    </view>

    <FilterSheet
      :visible="showFilters"
      :filter-groups="filterGroups"
      :filters="filters"
      @close="showFilters = false"
      @change-filter="setFilter"
      @reset="resetFilters"
    />

    <PocketSheet
      :visible="showPocket"
      :favorites="favorites"
      @close="showPocket = false"
      @copy-name="copyName"
      @remove-favorite="removeFavorite"
    />

    <ExportSheet
      :visible="showExport"
      :current="current"
      :filters="filters"
      @close="showExport = false"
      @download-svg="downloadExportSvg"
      @download-png="downloadExportPng"
    />
  </view>
</template>

<script>
import ActionBar from '../../components/mythos/ActionBar.vue'
import AppTopbar from '../../components/mythos/AppTopbar.vue'
import ExportSheet from '../../components/mythos/ExportSheet.vue'
import FilterSheet from '../../components/mythos/FilterSheet.vue'
import PocketSheet from '../../components/mythos/PocketSheet.vue'
import RealmControl from '../../components/mythos/RealmControl.vue'
import ResultStage from '../../components/mythos/ResultStage.vue'
import {
  DEFAULT_FILTERS,
  FILTER_GROUPS,
  generateName,
  generateSeed,
  listRealms
} from '../../common/generator.js'
import { buildRealmStatus } from '../../common/realmStatus.js'
import {
  FAVORITES_KEY,
  isFavorite,
  limitFavorites,
  removeFavoriteById,
  toggleFavorite
} from '../../common/favorites.js'
import {
  buildExportCardSvg,
  buildExportFailureMessage,
  buildExportFileName,
  buildPngExportFileName
} from '../../common/exportCard.js'

export default {
  components: {
    ActionBar,
    AppTopbar,
    ExportSheet,
    FilterSheet,
    PocketSheet,
    RealmControl,
    ResultStage
  },
  data() {
    return {
      realms: listRealms(),
      filterGroups: FILTER_GROUPS,
      realmId: 'elf',
      filters: { ...DEFAULT_FILTERS },
      current: generateName({ realmId: 'elf', filters: DEFAULT_FILTERS, seed: 1207 }),
      favorites: [],
      showFilters: false,
      showPocket: false,
      showExport: false
    }
  },
  computed: {
    activeRealm() {
      return this.realms.find((realm) => realm.id === this.realmId) || this.realms[0]
    },
    realmStatus() {
      return buildRealmStatus(this.activeRealm)
    },
    isCurrentFavorite() {
      return isFavorite(this.favorites, this.current)
    }
  },
  onLoad() {
    this.favorites = limitFavorites(uni.getStorageSync(FAVORITES_KEY))
  },
  methods: {
    generateNext() {
      this.current = generateName({
        realmId: this.realmId,
        filters: this.filters,
        seed: generateSeed()
      })
    },
    setRealm(realmId) {
      this.realmId = realmId
      this.generateNext()
    },
    setFilter(key, value) {
      this.filters = { ...this.filters, [key]: value }
      this.generateNext()
    },
    resetFilters() {
      this.filters = { ...DEFAULT_FILTERS }
      this.generateNext()
    },
    favoriteCurrent() {
      this.favorites = toggleFavorite(this.favorites, this.current)
      this.persistFavorites()
      this.toast(this.isCurrentFavorite ? 'Saved to Pocket' : 'Removed from Pocket')
    },
    removeFavorite(id) {
      this.favorites = removeFavoriteById(this.favorites, id)
      this.persistFavorites()
    },
    persistFavorites() {
      uni.setStorageSync(FAVORITES_KEY, this.favorites)
    },
    copyCurrent() {
      this.copyName(this.current.name)
    },
    copyName(name) {
      uni.setClipboardData({
        data: name,
        success: () => this.toast('Copied')
      })
    },
    toast(title) {
      uni.showToast({ title, icon: 'none' })
    },
    openSettings() {
      uni.navigateTo({ url: '/pages/settings/settings' })
    },
    buildCurrentExportSvg() {
      return buildExportCardSvg({
        name: this.current.name,
        realmLabel: this.current.realm.label,
        alignment: this.filters.alignment
      })
    },
    downloadExportSvg() {
      const svg = this.buildCurrentExportSvg()
      const fileName = buildExportFileName(this.current.name)
      if (!this.canUseDocumentDownload()) {
        this.copyName(this.current.name)
        this.toast(buildExportFailureMessage('svg'))
        return
      }
      this.downloadBlob(svg, 'image/svg+xml;charset=utf-8', fileName)
      this.toast('SVG export ready')
    },
    downloadExportPng() {
      const svg = buildExportCardSvg({
        name: this.current.name,
        realmLabel: this.current.realm.label,
        alignment: this.filters.alignment
      })
      const fileName = buildPngExportFileName(this.current.name)
      if (!this.canUseCanvasExport()) {
        this.toast(buildExportFailureMessage('png'))
        return
      }
      const image = new Image()
      const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 1200
        canvas.height = 1500
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        URL.revokeObjectURL(svgUrl)
        canvas.toBlob((blob) => {
          if (!blob) {
            this.toast(buildExportFailureMessage('png'))
            return
          }
          this.downloadBlob(blob, 'image/png', fileName)
          this.toast('PNG export ready')
        }, 'image/png')
      }
      image.onerror = () => {
        URL.revokeObjectURL(svgUrl)
        this.toast(buildExportFailureMessage('png'))
      }
      image.src = svgUrl
    },
    canUseDocumentDownload() {
      return typeof document !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined'
    },
    canUseCanvasExport() {
      return this.canUseDocumentDownload() && typeof Image !== 'undefined'
    },
    downloadBlob(content, type, fileName) {
      const blob = content instanceof Blob ? content : new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style>
page {
  background: #fbf9f5;
}

button,
uni-button {
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  background-color: transparent;
  color: inherit;
  line-height: 1;
  overflow: visible;
}

button::after,
uni-button::after {
  border: 0;
  display: none;
}

.page {
  display: flex;
  min-height: 100vh;
  box-sizing: border-box;
  flex-direction: column;
  padding: 38rpx 32rpx 30rpx;
  background: #fbf9f5;
  color: #17151d;
}

.main-stage {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  align-items: stretch;
}

.bottom-controls {
  flex: 0 0 auto;
  padding-bottom: 8rpx;
}

@media (min-width: 768px) {
  .page {
    width: 430px;
    margin: 0 auto;
  }
}
</style>
