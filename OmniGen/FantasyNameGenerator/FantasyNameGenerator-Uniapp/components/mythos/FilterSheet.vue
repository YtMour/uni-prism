<template>
  <view v-if="visible" class="sheet-mask" @tap="close">
    <view class="sheet" @tap.stop>
      <view class="sheet-head">
        <view class="grabber"></view>
        <text class="sheet-title">Mythos Filters</text>
        <button class="close" @tap="close">×</button>
      </view>
      <view v-for="(options, key) in filterGroups" :key="key" class="filter-group">
        <text class="filter-label">{{ key }}</text>
        <view class="chip-row">
          <button
            v-for="option in options"
            :key="option"
            class="chip"
            :class="{ active: filters[key] === option }"
            @tap="changeFilter(key, option)"
          >
            <text v-if="key !== 'gender'" class="chip-icon">{{ icons[option] }}</text>
            {{ option }}
          </button>
        </view>
      </view>
      <view class="sheet-actions">
        <button class="secondary-action" @tap="reset">↻ Reset</button>
        <button class="primary-action" @tap="close">✓ Apply</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FilterSheet',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    filterGroups: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'change-filter', 'reset'],
  data() {
    return {
      icons: {
        Holy: '✦',
        Shadow: '☾',
        Primal: '♣',
        Elegant: '✤',
        Harsh: '⚔',
        Ancient: '¶'
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    changeFilter(key, option) {
      this.$emit('change-filter', key, option)
    },
    reset() {
      this.$emit('reset')
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
  align-items: flex-end;
  background: rgba(28, 26, 39, 0.24);
}

.sheet {
  width: 100%;
  max-height: 78vh;
  overflow: auto;
  box-sizing: border-box;
  padding: 22rpx 52rpx 26rpx;
  border-radius: 34rpx 34rpx 0 0;
  background: #fbf9f5;
  box-shadow: 0 -20rpx 70rpx rgba(28, 26, 39, 0.18);
}

.sheet-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #d8d0c4;
}

.grabber {
  position: absolute;
  top: -4rpx;
  left: 50%;
  width: 78rpx;
  height: 10rpx;
  border-radius: 999rpx;
  background: #d8d0c4;
  transform: translateX(-50%);
}

.sheet-title {
  font-size: 38rpx;
  font-weight: 700;
}

.close {
  position: absolute;
  right: 0;
  bottom: 22rpx;
  width: 56rpx;
  height: 56rpx;
  font-size: 58rpx;
  line-height: 44rpx;
}

.filter-group {
  margin-bottom: 22rpx;
  padding-bottom: 22rpx;
  border-bottom: 1rpx solid #e7e1d8;
}

.filter-label {
  display: block;
  margin-bottom: 14rpx;
  font-size: 28rpx;
  font-weight: 700;
  text-transform: capitalize;
  color: #17151d;
}

.chip-row {
  display: flex;
  gap: 0;
}

.chip {
  display: flex;
  flex: 1 1 0;
  min-height: 70rpx;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border: 1rpx solid #d8d0c4;
  border-left-width: 0;
  border-radius: 0;
  font-size: 24rpx;
}

.chip:first-child {
  border-left-width: 1rpx;
  border-radius: 8rpx 0 0 8rpx;
}

.chip:last-child {
  border-radius: 0 8rpx 8rpx 0;
}

.chip.active {
  background: #1c1a27;
  color: #fbf9f5;
}

.chip-icon {
  font-size: 30rpx;
}

.sheet-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28rpx;
}

.secondary-action,
.primary-action {
  min-height: 72rpx;
  border: 1rpx solid #b8aa99;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.primary-action {
  background: #1c1a27;
  color: #fbf9f5;
}
</style>
