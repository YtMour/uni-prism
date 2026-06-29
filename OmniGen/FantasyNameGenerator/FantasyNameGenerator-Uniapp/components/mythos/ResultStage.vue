<template>
  <view class="result-stage" @tap="generate" @longpress="copy" @dblclick="favorite">
    <image class="emblem" :src="activeRealm.emblem" mode="aspectFit" />
    <text class="generated-name">{{ current.name }}</text>
    <image class="divider" src="/static/mythos/star-divider.png" mode="aspectFit" />
    <text class="metadata">{{ current.metadata }}</text>
    <text class="hint">Tap the name to summon another</text>
    <view class="stage-footer">
      <view></view>
      <text>✧</text>
      <view></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ResultStage',
  props: {
    activeRealm: {
      type: Object,
      required: true
    },
    current: {
      type: Object,
      required: true
    }
  },
  emits: ['generate', 'copy', 'favorite'],
  methods: {
    generate() {
      this.$emit('generate')
    },
    copy() {
      this.$emit('copy')
    },
    favorite() {
      this.$emit('favorite')
    }
  }
}
</script>

<style>
.result-stage {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 220rpx 10rpx 0;
  background: transparent;
}

.emblem {
  position: relative;
  width: 118rpx;
  height: 118rpx;
  margin-bottom: 28rpx;
}

.metadata,
.hint,
.generated-name,
.divider {
  position: relative;
}

.generated-name {
  max-width: 100%;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 104rpx;
  line-height: 1.08;
  text-align: center;
  word-break: break-word;
  color: #1c1a27;
}

.divider {
  width: 132rpx;
  height: 22rpx;
  margin: 30rpx 0 22rpx;
}

.metadata {
  font-size: 28rpx;
  color: rgba(23, 21, 29, 0.62);
}

.hint {
  margin-top: 24rpx;
  font-size: 24rpx;
  color: rgba(23, 21, 29, 0.42);
  text-align: center;
}

.stage-footer {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14rpx;
  margin-top: auto;
  padding-bottom: 18rpx;
  color: #b8aa99;
}

.stage-footer view {
  height: 1rpx;
  background: #d8d0c4;
}

.stage-footer text {
  font-size: 24rpx;
}
</style>
