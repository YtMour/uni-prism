<template>
  <view class="topbar">
    <view class="brand-lockup">
      <image class="brand-mark" src="/static/mythos/compass-star.png" mode="aspectFit" />
      <text class="brand">MythosGen</text>
    </view>
    <view class="realm-status">
      <text class="realm-icon">{{ realmStatus.glyph }}</text>
      <view class="realm-copy">
        <text class="realm-label">{{ realmStatus.label }}</text>
        <text class="realm-caption">{{ realmStatus.caption }}</text>
      </view>
    </view>
    <view class="top-actions">
      <button class="pocket-button" data-testid="open-pocket" @tap="openPocket">
        <text class="pocket-icon">{{ actions.pocket.icon }}</text>
        <text v-if="favoriteCount > 0" class="badge"></text>
      </button>
      <button class="statement-button" data-testid="open-settings" @tap="openSettings">
        <text class="statement-icon">{{ actions.statement.icon }}</text>
      </button>
    </view>
  </view>
  <view class="top-divider">
    <view></view>
    <text>✧</text>
    <view></view>
  </view>
</template>

<script>
import { TOP_ACTIONS } from '../../common/topActions.js'

export default {
  name: 'AppTopbar',
  props: {
    realmStatus: {
      type: Object,
      required: true
    },
    favoriteCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['open-settings', 'open-pocket'],
  data() {
    return {
      actions: TOP_ACTIONS
    }
  },
  methods: {
    openPocket() {
      this.$emit('open-pocket')
    },
    openSettings() {
      this.$emit('open-settings')
    }
  }
}
</script>

<style>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 22rpx;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.brand-mark {
  width: 58rpx;
  height: 58rpx;
}

.brand {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 38rpx;
  color: #17151d;
}

.realm-status {
  display: flex;
  min-width: 150rpx;
  min-height: 70rpx;
  align-items: center;
  justify-content: flex-start;
  gap: 12rpx;
  padding: 0 18rpx;
  border: 1rpx solid #d8d0c4;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.52);
  color: #1c1a27;
  box-shadow: 0 10rpx 30rpx rgba(28, 26, 39, 0.04);
}

.realm-icon {
  color: #7d6e5e;
  font-size: 32rpx;
}

.realm-copy {
  display: flex;
  flex-direction: column;
  gap: 3rpx;
}

.realm-label {
  display: block;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 1;
}

.realm-caption {
  display: block;
  font-size: 17rpx;
  line-height: 1;
  color: rgba(28, 26, 39, 0.46);
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.top-actions button,
.top-actions uni-button {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  background-color: transparent;
  line-height: 1;
  overflow: visible;
}

.top-actions button::after,
.top-actions uni-button::after {
  display: none;
  border: 0;
}

.pocket-button,
.statement-button {
  position: relative;
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999rpx;
  background: transparent;
  overflow: visible;
}

.pocket-icon {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
}

.statement-icon {
  display: block;
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid rgba(28, 26, 39, 0.9);
  border-radius: 999rpx;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 28rpx;
  text-align: center;
}

.badge {
  position: absolute;
  top: 9rpx;
  right: 7rpx;
  width: 12rpx;
  height: 12rpx;
  box-sizing: border-box;
  border-radius: 999rpx;
  background: #b88a44;
  box-shadow: 0 0 0 3rpx #fbf9f5;
}

.top-divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14rpx;
  margin: 0 -32rpx;
  color: #b8aa99;
  flex: 0 0 auto;
}

.top-divider view {
  height: 1rpx;
  background: #d8d0c4;
}

.top-divider text {
  font-size: 26rpx;
}
</style>
