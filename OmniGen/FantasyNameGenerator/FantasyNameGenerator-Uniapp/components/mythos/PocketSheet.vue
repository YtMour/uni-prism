<template>
  <view v-if="visible" class="sheet-mask" @tap="close">
    <view class="pocket-sheet" @tap.stop>
      <view class="sheet-head">
        <button class="back-button" @tap="close">‹</button>
        <text class="sheet-title">Inspiration Pocket</text>
        <text class="search-icon">⌕</text>
      </view>

      <view class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.id"
          class="filter-tab"
          :class="{ active: activeFilter === filter.id }"
          @tap="setActiveFilter(filter.id)"
        >
          {{ filter.label }}
        </button>
      </view>

      <view v-if="visibleFavorites.length === 0" class="empty-pocket">
        <image src="/static/mythos/open-book.png" mode="aspectFit" />
        <text class="empty-title">No saved names yet.</text>
        <text class="empty-copy">Favorite a generated name to keep it in this pocket.</text>
      </view>

      <scroll-view v-else scroll-y class="favorite-list">
        <view v-for="item in visibleFavorites" :key="item.id" class="favorite-row">
          <view class="select-mark" :class="{ checked: isSelected(item.id) }" @tap="toggleSelection(item.id)">
            <text v-if="isSelected(item.id)">✓</text>
          </view>
          <view class="favorite-copy">
          <text class="favorite-name">{{ item.name }}</text>
            <text class="favorite-meta">{{ getRealmLabel(item) }} · {{ item.metadata }}</text>
          </view>
          <view class="row-actions">
            <button class="icon-button" @tap="copyName(item.name)">⧉</button>
            <button class="icon-button danger" @tap="removeFavorite(item.id)">×</button>
          </view>
        </view>
      </scroll-view>

      <view class="pocket-footer">
        <view class="selection-count">
          <text class="count-box">{{ selectedIds.length }}</text>
          <view>
            <text class="count-title">{{ selectedIds.length }} selected</text>
            <text class="count-copy">Select items to export</text>
          </view>
        </view>
        <button class="export-selected" @tap="copyName(selectedSummary)">
          ⇧ Export Selected
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { POCKET_FILTERS, filterFavoritesByRealm, getFavoriteRealmLabel } from '../../common/pocket.js'

export default {
  name: 'PocketSheet',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    favorites: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'copy-name', 'remove-favorite'],
  data() {
    return {
      activeFilter: 'all',
      filters: POCKET_FILTERS,
      selectedIds: []
    }
  },
  computed: {
    visibleFavorites() {
      return filterFavoritesByRealm(this.favorites, this.activeFilter)
    },
    selectedSummary() {
      return this.favorites
        .filter((favorite) => this.selectedIds.includes(favorite.id))
        .map((favorite) => favorite.name)
        .join('\n')
    }
  },
  watch: {
    favorites: {
      immediate: true,
      handler(favorites) {
        const validIds = new Set(favorites.map((favorite) => favorite.id))
        this.selectedIds = this.selectedIds.filter((id) => validIds.has(id))
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    copyName(name) {
      this.$emit('copy-name', name)
    },
    removeFavorite(id) {
      this.$emit('remove-favorite', id)
    },
    setActiveFilter(filterId) {
      this.activeFilter = filterId
    },
    getRealmLabel(item) {
      return getFavoriteRealmLabel(item)
    },
    isSelected(id) {
      return this.selectedIds.includes(id)
    },
    toggleSelection(id) {
      this.selectedIds = this.isSelected(id)
        ? this.selectedIds.filter((selectedId) => selectedId !== id)
        : [...this.selectedIds, id]
    }
  }
}
</script>

<style>
.sheet-mask {
  position: fixed;
  z-index: 20;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: rgba(28, 26, 39, 0.24);
}

button,
uni-button {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  background-color: transparent;
  color: inherit;
  line-height: 1;
  overflow: visible;
}

button::after,
uni-button::after {
  display: none;
  border: 0;
}

.pocket-sheet {
  display: flex;
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
  padding: 36rpx 32rpx 28rpx;
  background: #fbf9f5;
  box-shadow: 0 0 70rpx rgba(28, 26, 39, 0.14);
}

.sheet-head {
  display: grid;
  grid-template-columns: 56rpx 1fr 56rpx;
  align-items: center;
  gap: 18rpx;
  padding-bottom: 26rpx;
  border-bottom: 1rpx solid #e7e1d8;
}

.sheet-title {
  font-size: 42rpx;
  font-weight: 800;
  line-height: 1;
  text-align: center;
}

.back-button,
.search-icon {
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  line-height: 1;
  color: #1c1a27;
}

.search-icon {
  font-size: 42rpx;
}

.filter-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #e7e1d8;
}

.filter-tab {
  min-height: 68rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  color: #1c1a27;
  box-shadow: inset 0 0 0 1rpx rgba(231, 225, 216, 0.72);
}

.filter-tab.active {
  background: #1c1a27;
  color: #fbf9f5;
  box-shadow: none;
}

.empty-pocket {
  display: flex;
  flex: 1 1 auto;
  min-height: 360rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  text-align: center;
  color: rgba(23, 21, 29, 0.54);
}

.empty-pocket image {
  width: 124rpx;
  height: 124rpx;
}

.empty-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #17151d;
}

.empty-copy {
  display: block;
  max-width: 440rpx;
  font-size: 24rpx;
  line-height: 1.45;
}

.favorite-list {
  flex: 1 1 auto;
  min-height: 0;
}

.favorite-row {
  display: grid;
  grid-template-columns: 58rpx 1fr auto;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #e7e1d8;
}

.select-mark {
  display: flex;
  width: 42rpx;
  height: 42rpx;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #b8aa99;
  border-radius: 999rpx;
  color: #fbf9f5;
  font-size: 28rpx;
  line-height: 1;
}

.select-mark.checked {
  border-color: #b88a44;
  background: #b88a44;
}

.favorite-copy {
  min-width: 0;
}

.favorite-name {
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
  overflow: hidden;
  font-size: 42rpx;
  line-height: 1.05;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-meta {
  display: block;
  margin-top: 10rpx;
  overflow: hidden;
  font-size: 24rpx;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(23, 21, 29, 0.58);
}

.row-actions {
  display: flex;
  gap: 20rpx;
}

.icon-button {
  width: 46rpx;
  height: 46rpx;
  border-radius: 8rpx;
  box-shadow: inset 0 0 0 1rpx rgba(231, 225, 216, 0.82);
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
  color: #1c1a27;
}

.icon-button.danger {
  box-shadow: inset 0 0 0 1rpx rgba(126, 46, 53, 0.18);
  color: #7e2e35;
  font-size: 36rpx;
}

.pocket-footer {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 18rpx;
  align-items: center;
  padding-top: 26rpx;
  border-top: 1rpx solid #e7e1d8;
}

.selection-count {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.count-box {
  display: flex;
  width: 64rpx;
  height: 64rpx;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #b88a44;
  border-radius: 10rpx;
  color: #b88a44;
  font-size: 30rpx;
  font-weight: 800;
}

.count-title,
.count-copy {
  display: block;
}

.count-title {
  font-size: 25rpx;
  font-weight: 800;
  color: #17151d;
}

.count-copy {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: rgba(23, 21, 29, 0.54);
}

.export-selected {
  min-height: 72rpx;
  padding: 0 18rpx;
  border: 2rpx solid #b88a44;
  border-radius: 10rpx;
  background: #1c1a27;
  color: #d7a94a;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 25rpx;
}
</style>
