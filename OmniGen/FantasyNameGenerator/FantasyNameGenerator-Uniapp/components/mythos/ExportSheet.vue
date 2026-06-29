<template>
  <view v-if="visible" class="sheet-mask" @tap="close">
    <view class="export-panel export-sheet" @tap.stop>
      <view class="sheet-head">
        <text class="sheet-title">Export Card</text>
        <button class="close" @tap="close">Close</button>
      </view>
      <view class="export-card">
        <image class="corner top-left" src="/static/mythos/corner-frame.png" mode="aspectFit" />
        <image class="corner bottom-right" src="/static/mythos/corner-frame.png" mode="aspectFit" />
        <text class="export-name">{{ current.name }}</text>
        <text class="export-meta">{{ current.realm.label }} · {{ filters.alignment }}</text>
        <text class="export-brand">MythosGen</text>
      </view>
      <view class="export-actions">
        <button class="wide-action primary" @tap="downloadPng">Download PNG</button>
        <button class="wide-action secondary" @tap="downloadSvg">Download SVG</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ExportSheet',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    current: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'download-svg', 'download-png'],
  methods: {
    close() {
      this.$emit('close')
    },
    downloadSvg() {
      this.$emit('download-svg')
    },
    downloadPng() {
      this.$emit('download-png')
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

.export-panel {
  display: flex;
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
  padding: 34rpx 32rpx 30rpx;
  border-radius: 0;
  background: #fbf9f5;
  box-shadow: 0 0 70rpx rgba(28, 26, 39, 0.14);
}

.export-panel .sheet-head {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  margin-bottom: 24rpx;
}

.export-panel .sheet-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 40rpx;
  line-height: 1;
}

.export-panel .close {
  min-width: 96rpx;
  min-height: 60rpx;
  padding: 0 22rpx;
  border: 1rpx solid #e7e1d8;
  border-radius: 999rpx;
  font-size: 23rpx;
}

.export-card {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto 22rpx;
  padding: 54rpx 42rpx;
  border: 1rpx solid #e7e1d8;
  border-radius: 8rpx;
  background: #fbf9f5;
}

.corner {
  position: absolute;
  width: 92rpx;
  height: 92rpx;
}

.top-left {
  top: 20rpx;
  left: 20rpx;
}

.bottom-right {
  right: 20rpx;
  bottom: 20rpx;
  transform: rotate(180deg);
}

.export-name {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 58rpx;
  line-height: 1.12;
  text-align: center;
  color: #1c1a27;
}

.export-meta,
.export-brand {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: rgba(23, 21, 29, 0.58);
}

.export-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14rpx;
  flex: 0 0 auto;
}

.wide-action {
  width: 100%;
  min-height: 74rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.wide-action.primary {
  background: #1c1a27;
  color: #fbf9f5;
}

.wide-action.secondary {
  border: 1rpx solid #d8cdbb;
  background: #fffdfa;
  color: #1c1a27;
}
</style>
