<template>
  <view class="settings-page">
    <view class="settings-topbar">
      <button class="back-button" @tap="goBack">‹</button>
      <view>
        <text class="title">Settings</text>
        <text class="subtitle">Declaration & local preferences</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">Default Realm</text>
      <view class="segmented">
        <button
          v-for="realm in realms"
          :key="realm.id"
          class="segment"
          :class="{ active: settings.defaultRealm === realm.id }"
          @tap="setPreference('defaultRealm', realm.id)"
        >
          {{ realm.shortLabel === 'Magic' ? 'Spell' : realm.shortLabel }}
        </button>
      </view>
    </view>

    <view class="section row-section">
      <view>
        <text class="section-title">Haptic Feedback</text>
        <text class="section-copy">Use light touch feedback for save and generate actions.</text>
      </view>
      <switch :checked="settings.haptics" color="#1C1A27" @change="setPreference('haptics', $event.detail.value)" />
    </view>

    <view class="section">
      <text class="section-title">Animation</text>
      <view class="segmented">
        <button
          v-for="option in animationOptions"
          :key="option.id"
          class="segment"
          :class="{ active: settings.animation === option.id }"
          @tap="setPreference('animation', option.id)"
        >
          {{ option.label }}
        </button>
      </view>
    </view>

    <view class="policy-stack">
      <view class="policy-group">
        <text class="section-title">Privacy Policy</text>
        <view v-for="section in privacySections" :key="section.title" class="policy-block">
          <text class="policy-heading">{{ section.title }}</text>
          <text v-for="item in section.items" :key="item" class="policy-copy">{{ item }}</text>
        </view>
      </view>

      <view class="policy-group">
        <text class="section-title">Disclaimer</text>
        <view v-for="section in disclaimerSections" :key="section.title" class="policy-block">
          <text class="policy-heading">{{ section.title }}</text>
          <text v-for="item in section.items" :key="item" class="policy-copy">{{ item }}</text>
        </view>
      </view>

      <view class="policy-group">
        <text class="section-title">Current Implementation</text>
        <view class="status-list">
          <view v-for="item in implementationSummary" :key="item.title" class="status-item">
            <text class="status-title">{{ item.title }}</text>
            <text class="status-copy">{{ item.copy }}</text>
          </view>
        </view>
      </view>

      <view class="policy-group">
        <text class="section-title">Next Improvements</text>
        <view class="status-list">
          <view v-for="item in nextSteps" :key="item.title" class="status-item">
            <text class="status-title">{{ item.title }}</text>
            <text class="status-copy">{{ item.copy }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { listRealms } from '../../common/generator.js'
import {
  DISCLAIMER_SECTIONS,
  IMPLEMENTATION_SUMMARY,
  NEXT_STEPS,
  PRIVACY_POLICY_SECTIONS
} from '../../common/policy.js'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  normalizeSettings,
  updateSetting
} from '../../common/settings.js'

export default {
  data() {
    return {
      realms: listRealms(),
      settings: { ...DEFAULT_SETTINGS },
      animationOptions: [
        { id: 'reduced', label: 'Reduced' },
        { id: 'balanced', label: 'Balanced' },
        { id: 'expressive', label: 'Expressive' }
      ],
      privacySections: PRIVACY_POLICY_SECTIONS,
      disclaimerSections: DISCLAIMER_SECTIONS,
      implementationSummary: IMPLEMENTATION_SUMMARY,
      nextSteps: NEXT_STEPS
    }
  },
  onLoad() {
    this.settings = normalizeSettings(uni.getStorageSync(SETTINGS_KEY))
  },
  methods: {
    setPreference(key, value) {
      this.settings = updateSetting(this.settings, key, value)
      uni.setStorageSync(SETTINGS_KEY, this.settings)
    },
    goBack() {
      uni.navigateBack()
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

.settings-page {
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 42rpx 32rpx 48rpx;
  color: #17151d;
}

.settings-topbar {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 44rpx;
}

.back-button {
  width: 72rpx;
  height: 72rpx;
  border: 1rpx solid #d8d0c4;
  border-radius: 8rpx;
  font-size: 54rpx;
  line-height: 62rpx;
}

.title {
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 46rpx;
}

.subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(23, 21, 29, 0.52);
}

.section,
.policy-group {
  margin-bottom: 34rpx;
  padding: 28rpx 0 34rpx;
  border-bottom: 1rpx solid #e7e1d8;
}

.row-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32rpx;
}

.section-title {
  display: block;
  margin-bottom: 18rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.section-copy,
.policy-copy,
.status-copy {
  display: block;
  font-size: 25rpx;
  line-height: 1.55;
  color: rgba(23, 21, 29, 0.62);
}

.policy-stack {
  margin-top: 6rpx;
}

.policy-block + .policy-block {
  margin-top: 24rpx;
}

.policy-heading,
.status-title {
  display: block;
  margin-bottom: 10rpx;
  font-size: 25rpx;
  font-weight: 700;
  color: rgba(23, 21, 29, 0.82);
}

.policy-copy + .policy-copy {
  margin-top: 10rpx;
}

.status-list {
  display: grid;
  gap: 18rpx;
}

.status-item {
  padding-left: 18rpx;
  border-left: 4rpx solid #c4a15c;
}

.segmented {
  display: flex;
  width: 100%;
}

.segment {
  display: flex;
  flex: 1 1 0;
  min-height: 76rpx;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #d8d0c4;
  border-left-width: 0;
  font-size: 24rpx;
}

.segment:first-child {
  border-left-width: 1rpx;
  border-radius: 8rpx 0 0 8rpx;
}

.segment:last-child {
  border-radius: 0 8rpx 8rpx 0;
}

.segment.active {
  background: #1c1a27;
  color: #fbf9f5;
}
</style>
