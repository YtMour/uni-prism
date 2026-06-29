<template>
  <view class="actions">
    <button class="icon-action" data-testid="open-filters" @tap="openFilters">
      <text class="action-icon">☷</text>
      <text>Filter</text>
    </button>
    <button class="icon-action" data-testid="copy-name" @tap="copy">
      <text class="action-icon">□</text>
      <text>Copy</text>
    </button>
    <button class="icon-action" data-testid="favorite-name" :class="{ saved: saved }" @tap="favorite">
      <text class="action-icon">☆</text>
      <text>Favorite</text>
    </button>
    <button class="icon-action" data-testid="open-export" @tap="openExport">
      <text class="action-icon">⇧</text>
      <text>Export</text>
    </button>
  </view>
</template>

<script>
export default {
  name: 'ActionBar',
  props: {
    saved: {
      type: Boolean,
      default: false
    }
  },
  emits: ['open-filters', 'copy', 'favorite', 'open-export'],
  methods: {
    openFilters() {
      this.$emit('open-filters')
    },
    copy() {
      this.$emit('copy')
    },
    favorite() {
      this.$emit('favorite')
    },
    openExport() {
      this.$emit('open-export')
    }
  }
}
</script>

<style>
.actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8rpx;
  margin-top: 14rpx;
  padding: 8rpx;
  border: 1rpx solid rgba(216, 208, 196, 0.9);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.5);
}

.icon-action {
  display: flex;
  min-height: 82rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  border: 0;
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #1c1a27;
  background-color: transparent;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.icon-action::after {
  display: none;
  border: 0;
}

.action-icon {
  font-size: 38rpx;
  line-height: 1;
}

.icon-action.saved {
  background: rgba(184, 138, 68, 0.1);
  color: #9d7335;
}
</style>
