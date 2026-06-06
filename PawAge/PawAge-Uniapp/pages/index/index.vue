<template>
  <view class="app-shell">
    <scroll-view class="page" scroll-y>
      <view class="top-bar">
        <button class="round-action" @click="activeTab = 'home'">
          <image class="round-icon" :src="assets.timelinePaw" mode="aspectFit" />
        </button>
        <view class="pet-switcher">
          <view class="switcher-avatar active">
            <image :src="currentSpeciesIcon" mode="aspectFit" />
          </view>
          <view class="switcher-avatar">
            <image :src="secondarySpeciesIcon" mode="aspectFit" />
          </view>
        </view>
        <button class="round-action add" @click="activeTab = 'profile'">+</button>
      </view>

      <view v-if="activeTab === 'home'" class="tab-view">
        <view class="dashboard-card">
          <view class="pet-hero">
            <view class="pet-art-wrap">
              <image class="pet-art" :src="currentSpeciesIcon" mode="aspectFit" />
              <button class="camera-dot">◎</button>
            </view>
            <view class="age-summary">
              <text class="muted-label">Human age estimate</text>
              <view class="age-ring">
                <text class="age-number">{{ ageResult.humanAge }}</text>
                <text class="age-unit">years</text>
              </view>
              <text class="age-caption">{{ pet.name }} is {{ actualAgeLabel }} old</text>
            </view>
          </view>
        </view>

        <view class="timeline-section">
          <view class="section-kicker">
            <image class="tiny-icon" :src="assets.timelinePaw" mode="aspectFit" />
            <text>Life stage</text>
          </view>
          <view class="ribbon-track">
            <view class="ribbon-progress" :style="{ width: timelineProgress }" />
            <image class="ribbon-paw" :src="assets.timelinePaw" mode="aspectFit" :style="{ left: timelineProgress }" />
            <view class="stage-dot first" />
            <view class="stage-dot second active" />
            <view class="stage-dot third" />
            <view class="stage-dot fourth" />
          </view>
          <view class="stage-card">
            <image class="stage-art" :src="stageImage" mode="aspectFit" />
            <view class="stage-copy">
              <text class="stage-title">{{ ageResult.stage.label }}</text>
              <text class="body-text">{{ ageResult.stage.summary }}</text>
              <text class="countdown">{{ nextStageText }}</text>
            </view>
          </view>
        </view>

        <view class="advice-list">
          <view v-for="item in adviceItems" :key="item.title" class="advice-row" :class="item.tone">
            <image class="advice-icon" :src="item.icon" mode="aspectFit" />
            <view class="advice-copy">
              <text class="advice-title">{{ item.title }}</text>
              <text class="body-text">{{ item.text }}</text>
            </view>
            <text class="row-arrow">›</text>
          </view>
        </view>
      </view>

      <view v-else-if="activeTab === 'profile'" class="tab-view profile-view">
        <view class="profile-hero">
          <view>
            <text class="screen-title">Pet profile</text>
            <text class="body-text">Set the basics first. PawAge keeps this profile on your device.</text>
          </view>
          <image class="profile-hero-art" :src="assets.onboardingHero" mode="aspectFit" />
        </view>

        <view class="avatar-strip">
          <view class="avatar-large">
            <image :src="currentSpeciesIcon" mode="aspectFit" />
            <view class="camera-badge">◎</view>
          </view>
          <image class="avatar-option active" :src="assets.dogAdult" mode="aspectFit" />
          <image class="avatar-option" :src="assets.catAdult" mode="aspectFit" />
          <image class="avatar-option" :src="assets.lifecyclePuppy" mode="aspectFit" />
        </view>

        <view class="form-card">
          <view class="input-row">
            <text class="field-label">Name</text>
            <input class="profile-input" v-model="pet.name" maxlength="24" placeholder="Pet name" @blur="persistPet" />
          </view>

          <view class="segmented">
            <button
              v-for="option in speciesOptions"
              :key="option.value"
              class="segment"
              :class="{ active: pet.species === option.value }"
              @click="setSpecies(option.value)"
            >
              <image class="segment-icon" :src="option.icon" mode="aspectFit" />
              <text>{{ option.label }}</text>
            </button>
          </view>

          <view v-if="pet.species === 'dog'" class="size-grid">
            <button
              v-for="option in dogSizeOptions"
              :key="option.value"
              class="size-button"
              :class="{ active: pet.dogSize === option.value }"
              @click="setDogSize(option.value)"
            >
              <image class="size-icon" :src="option.icon" mode="aspectFit" />
              <text>{{ option.label }}</text>
            </button>
          </view>

          <picker mode="date" :value="pet.birthday" :end="today" @change="onBirthdayChange">
            <view class="date-picker-row">
              <view>
                <text class="field-label">Birthday</text>
                <text class="field-value">{{ pet.birthday }}</text>
              </view>
              <text class="calendar-icon">▦</text>
            </view>
          </picker>
        </view>

        <button class="primary-button" @click="saveProfile">Save profile</button>
      </view>

      <view v-else-if="activeTab === 'life'" class="tab-view">
        <view class="detail-card">
          <text class="screen-title">Life-stage detail</text>
          <image class="detail-art" :src="stageImage" mode="aspectFit" />
          <text class="stage-title">{{ ageResult.stage.label }}</text>
          <text class="body-text">{{ ageResult.stage.summary }}</text>
          <view class="detail-ribbon">
            <view class="ribbon-progress" :style="{ width: timelineProgress }" />
            <image class="ribbon-paw" :src="assets.timelinePaw" mode="aspectFit" :style="{ left: timelineProgress }" />
          </view>
        </view>

        <view class="advice-list">
          <view v-for="item in adviceItems" :key="item.title" class="advice-row" :class="item.tone">
            <image class="advice-icon" :src="item.icon" mode="aspectFit" />
            <view class="advice-copy">
              <text class="advice-title">{{ item.title }}</text>
              <text class="body-text">{{ item.text }}</text>
            </view>
            <text class="row-arrow">›</text>
          </view>
        </view>
      </view>

      <view v-else-if="activeTab === 'share'" class="tab-view">
        <view class="share-builder">
          <view class="share-card">
            <image class="share-bg" :src="assets.shareCardBackground" mode="aspectFill" />
            <view class="share-overlay">
              <text class="share-name">{{ pet.name }}</text>
              <text class="share-age">{{ ageResult.humanAge }}</text>
              <text class="share-stage">{{ ageResult.stage.label }}</text>
            </view>
          </view>

          <view class="template-strip">
            <view class="template-thumb active" />
            <view class="template-thumb peach" />
            <view class="template-thumb sage" />
            <view class="template-thumb sky" />
          </view>

          <view class="swatch-row">
            <view class="swatch cream active" />
            <view class="swatch peach" />
            <view class="swatch sage" />
            <view class="swatch sky" />
            <view class="swatch brown" />
          </view>

          <button class="share-button" @click="shareMilestone">Share milestone</button>
        </view>
      </view>

      <view v-else class="tab-view">
        <view class="settings-card">
          <text class="screen-title">Settings</text>
          <view v-for="item in settingsItems" :key="item.title" class="settings-row">
            <text class="settings-title">{{ item.title }}</text>
            <view class="settings-value-wrap">
              <text class="settings-value">{{ item.value }}</text>
              <text class="row-arrow">›</text>
            </view>
          </view>
          <button class="secondary-button" @click="clearLocalData">Clear local data</button>
          <text class="disclaimer">Age results are estimates for general wellness reference only. Always consult a veterinarian for medical concerns.</text>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-nav">
      <button
        v-for="item in tabs"
        :key="item.value"
        class="nav-item"
        :class="{ active: activeTab === item.value }"
        @click="activeTab = item.value"
      >
        <text class="nav-icon">{{ item.icon }}</text>
        <text class="nav-label">{{ item.label }}</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { dogSizeOptions, speciesOptions } from '../../data/lifeStage'
import type { DogSize, PetProfile, PetSpecies } from '../../types/pet'
import { calculatePetAge } from '../../utils/ageCalculator'
import { createDefaultPetProfile, loadPetProfiles, savePetProfiles, updatePetProfile } from '../../utils/petStorage'
import catAdult from '../../static/assets/cat-adult.png'
import dogAdult from '../../static/assets/dog-adult.png'
import iconActivityToy from '../../static/assets/icon-activity-toy.png'
import iconFoodBowl from '../../static/assets/icon-food-bowl.png'
import iconWellnessLeaf from '../../static/assets/icon-wellness-leaf.png'
import lifecycleKitten from '../../static/assets/lifecycle-kitten-transparent.png'
import lifecyclePuppy from '../../static/assets/lifecycle-puppy-transparent.png'
import lifecycleSeniorPets from '../../static/assets/lifecycle-senior-pets-transparent.png'
import onboardingHero from '../../static/assets/onboarding-hero.png'
import shareCardBackground from '../../static/assets/share-card-background.png'
import timelinePaw from '../../static/assets/timeline-paw-marker-transparent.png'

type TabKey = 'home' | 'profile' | 'life' | 'share' | 'settings'

const tabs: Array<{ value: TabKey; label: string; icon: string }> = [
  { value: 'home', label: 'Home', icon: '⌂' },
  { value: 'profile', label: 'Profile', icon: '◴' },
  { value: 'life', label: 'Stage', icon: '▥' },
  { value: 'share', label: 'Share', icon: '♡' },
  { value: 'settings', label: 'More', icon: '☰' }
]

const assets = {
  catAdult,
  dogAdult,
  iconActivityToy,
  iconFoodBowl,
  iconWellnessLeaf,
  lifecycleKitten,
  lifecyclePuppy,
  lifecycleSeniorPets,
  onboardingHero,
  shareCardBackground,
  timelinePaw
}

const today = new Date().toISOString().slice(0, 10)
const activeTab = ref<TabKey>('home')
const pet = reactive<PetProfile>(createDefaultPetProfile())

onLoad(() => {
  const saved = loadPetProfiles()[0]

  if (saved) {
    Object.assign(pet, saved)
  } else {
    persistPet()
  }
})

const ageResult = computed(() => calculatePetAge(pet))

const actualAgeLabel = computed(() => {
  const { years, months } = ageResult.value.actualAge

  if (years === 0) return `${months} mo`
  if (months === 0) return `${years} yr`

  return `${years} yr ${months} mo`
})

const currentSpeciesIcon = computed(() => {
  return pet.species === 'cat' ? assets.catAdult : assets.dogAdult
})

const secondarySpeciesIcon = computed(() => {
  return pet.species === 'cat' ? assets.dogAdult : assets.catAdult
})

const stageImage = computed(() => {
  if (ageResult.value.stage.stage === 'puppy_kitten') {
    return pet.species === 'cat' ? assets.lifecycleKitten : assets.lifecyclePuppy
  }

  if (ageResult.value.stage.stage === 'senior' || ageResult.value.stage.stage === 'geriatric') {
    return assets.lifecycleSeniorPets
  }

  return currentSpeciesIcon.value
})

const adviceItems = computed(() => [
  {
    icon: assets.iconFoodBowl,
    title: 'Nutrition',
    text: ageResult.value.stage.nutrition,
    tone: 'sage'
  },
  {
    icon: assets.iconWellnessLeaf,
    title: 'Wellness',
    text: ageResult.value.stage.wellness,
    tone: 'peach'
  },
  {
    icon: assets.iconActivityToy,
    title: 'Activity',
    text: ageResult.value.stage.activity,
    tone: 'blue'
  }
])

const settingsItems = [
  { title: 'Language', value: 'English' },
  { title: 'Local data', value: 'Stored on device' },
  { title: 'Reminder', value: 'Off' },
  { title: 'PawAge Pro', value: 'Preview' }
]

const timelineProgress = computed(() => {
  const days = ageResult.value.actualAge.totalDays
  const capped = Math.min(1, days / (15 * 365))
  return `${Math.max(8, Math.round(capped * 100))}%`
})

const nextStageText = computed(() => {
  if (ageResult.value.daysToNextStage === null) {
    return 'Comfort, consistency, and close observation matter most now.'
  }

  return `${ageResult.value.daysToNextStage} days until ${ageResult.value.nextStageLabel}`
})

function setSpecies(species: PetSpecies): void {
  Object.assign(pet, updatePetProfile(pet, { species }))
  persistPet()
}

function setDogSize(dogSize: DogSize): void {
  Object.assign(pet, updatePetProfile(pet, { dogSize }))
  persistPet()
}

function onBirthdayChange(event: { detail: { value: string } }): void {
  Object.assign(pet, updatePetProfile(pet, { birthday: event.detail.value }))
  persistPet()
}

function persistPet(): void {
  savePetProfiles([{ ...pet }])
}

function saveProfile(): void {
  persistPet()
  uni.showToast({
    title: 'Profile saved',
    icon: 'none'
  })
}

function shareMilestone(): void {
  uni.showToast({
    title: 'Share export is next',
    icon: 'none'
  })
}

function clearLocalData(): void {
  const fresh = createDefaultPetProfile()
  savePetProfiles([fresh])
  Object.assign(pet, fresh)
  uni.showToast({
    title: 'Local data reset',
    icon: 'none'
  })
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 242, 223, 0.92), transparent 420rpx),
    #fdfbf7;
}

.app-shell button {
  box-sizing: border-box;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1;
}

.app-shell button::after {
  border: 0;
}

.page {
  height: 100vh;
  padding-bottom: 230rpx;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44rpx 40rpx 16rpx;
}

.round-action {
  display: flex;
  width: 86rpx;
  height: 86rpx;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 247, 236, 0.9);
  box-shadow: 0 10rpx 28rpx rgba(142, 110, 83, 0.13);
  color: #6f6258;
  font-size: 54rpx;
  font-weight: 500;
}

.round-action.add {
  background: #dfe5d6;
  color: #5f6d52;
}

.round-icon {
  width: 56rpx;
  height: 56rpx;
}

.pet-switcher {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(244, 236, 224, 0.82);
}

.switcher-avatar {
  display: flex;
  box-sizing: border-box;
  width: 78rpx;
  height: 78rpx;
  align-items: center;
  justify-content: center;
  border: 4rpx solid transparent;
  border-radius: 50%;
  overflow: hidden;
  background: #fff8ef;
  opacity: 0.82;
}

.switcher-avatar image {
  width: 126rpx;
  height: 126rpx;
  max-width: none;
  max-height: none;
}

.switcher-avatar.active {
  border-color: #a3b19b;
  opacity: 1;
}

.tab-view {
  padding: 0 34rpx 180rpx;
}

.dashboard-card,
.form-card,
.detail-card,
.settings-card {
  border: 1rpx solid rgba(142, 110, 83, 0.16);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 20rpx 58rpx rgba(142, 110, 83, 0.12);
}

.dashboard-card {
  overflow: hidden;
  padding: 30rpx 26rpx;
}

.pet-hero {
  display: flex;
  align-items: center;
  min-height: 400rpx;
}

.pet-art-wrap {
  position: relative;
  overflow: visible;
  width: 48%;
  min-width: 0;
}

.pet-art {
  width: 390rpx;
  height: 402rpx;
  margin-top: -24rpx;
  margin-left: -58rpx;
}

.camera-dot,
.camera-badge {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff8ef;
  color: #f0a17e;
  font-weight: 800;
  box-shadow: 0 8rpx 22rpx rgba(142, 110, 83, 0.14);
}

.camera-dot {
  left: 28rpx;
  bottom: 20rpx;
  width: 70rpx;
  height: 70rpx;
  font-size: 30rpx;
}

.age-summary {
  display: flex;
  width: 52%;
  align-items: center;
  flex-direction: column;
}

.muted-label,
.section-kicker,
.field-label {
  display: block;
  margin-bottom: 8rpx;
  color: #8e6e53;
  font-size: 22rpx;
  font-weight: 800;
}

.age-ring {
  display: flex;
  width: 238rpx;
  height: 238rpx;
  align-items: center;
  justify-content: center;
  margin-top: 22rpx;
  border: 18rpx solid #a3b19b;
  border-left-color: #eee1d0;
  border-radius: 50%;
  background: #fffaf1;
  flex-direction: column;
}

.age-number {
  color: #8e6e53;
  font-size: 72rpx;
  font-weight: 900;
  line-height: 1;
}

.age-unit,
.age-caption,
.body-text,
.field-value,
.disclaimer {
  color: #75685f;
  font-size: 25rpx;
  line-height: 1.45;
}

.age-caption {
  margin-top: 18rpx;
  text-align: center;
}

.timeline-section {
  margin-top: 30rpx;
}

.section-kicker {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.tiny-icon {
  width: 54rpx;
  height: 54rpx;
}

.ribbon-track,
.detail-ribbon {
  position: relative;
  height: 32rpx;
  margin-top: 32rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #a9c7d7, #a3b19b 42%, #f0b28f 70%, #eadfce);
}

.ribbon-progress {
  height: 100%;
  border-radius: 999rpx;
  background: rgba(142, 110, 83, 0.22);
}

.ribbon-paw {
  position: absolute;
  top: 50%;
  width: 96rpx;
  height: 96rpx;
  transform: translate(-50%, -50%);
}

.stage-dot {
  position: absolute;
  top: 50%;
  width: 44rpx;
  height: 44rpx;
  border: 8rpx solid #fffaf1;
  border-radius: 50%;
  background: #d7cab8;
  transform: translate(-50%, -50%);
}

.stage-dot.first {
  left: 12%;
}

.stage-dot.second {
  left: 38%;
}

.stage-dot.third {
  left: 68%;
}

.stage-dot.fourth {
  left: 92%;
}

.stage-dot.active {
  background: #8e6e53;
}

.stage-card {
  display: flex;
  align-items: center;
  margin-top: 36rpx;
  padding: 20rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.12);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.75);
}

.stage-art {
  width: 112rpx;
  height: 112rpx;
  flex: 0 0 auto;
}

.stage-copy {
  min-width: 0;
  margin-left: 22rpx;
}

.stage-title,
.screen-title,
.advice-title,
.share-name {
  display: block;
  color: #2f2923;
  font-size: 34rpx;
  font-weight: 900;
  line-height: 1.18;
}

.countdown {
  display: block;
  margin-top: 10rpx;
  color: #8e6e53;
  font-size: 24rpx;
  font-weight: 800;
}

.advice-list {
  display: grid;
  gap: 14rpx;
  margin-top: 20rpx;
  padding-bottom: 26rpx;
}

.advice-row {
  display: flex;
  min-height: 132rpx;
  align-items: center;
  padding: 18rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.12);
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.78);
}

.advice-row.sage .advice-icon-wrap,
.advice-row.sage .advice-icon {
  background: #dfe8d8;
}

.advice-row.peach .advice-icon {
  background: #ffe3d3;
}

.advice-row.blue .advice-icon {
  background: #dbeaf2;
}

.advice-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  flex: 0 0 auto;
}

.advice-copy {
  min-width: 0;
  flex: 1;
  margin-left: 22rpx;
}

.advice-copy .advice-title,
.advice-copy .body-text {
  display: block;
}

.advice-copy .body-text {
  margin-top: 8rpx;
}

.row-arrow {
  color: #8e6e53;
  font-size: 58rpx;
  line-height: 1;
}

.profile-view {
  padding-bottom: 260rpx;
}

.profile-hero {
  display: flex;
  align-items: center;
  min-height: 210rpx;
}

.profile-hero > view {
  width: 48%;
}

.profile-hero-art {
  width: 52%;
  height: 190rpx;
}

.avatar-strip {
  display: flex;
  align-items: center;
  gap: 22rpx;
  margin-top: 10rpx;
  padding: 20rpx 24rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.1);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 16rpx 42rpx rgba(142, 110, 83, 0.1);
}

.avatar-large {
  position: relative;
  width: 132rpx;
  height: 132rpx;
  border: 4rpx solid #fff;
  border-radius: 50%;
  background: #fff8ef;
}

.avatar-large image {
  width: 100%;
  height: 100%;
}

.camera-badge {
  right: -8rpx;
  bottom: 0;
  width: 48rpx;
  height: 48rpx;
}

.avatar-option {
  box-sizing: border-box;
  width: 90rpx;
  height: 90rpx;
  border: 4rpx solid transparent;
  border-radius: 50%;
  background: #fff8ef;
  opacity: 0.8;
}

.avatar-option.active {
  border-color: #a3b19b;
  box-shadow: 0 8rpx 18rpx rgba(142, 110, 83, 0.1);
  opacity: 1;
}

.form-card {
  margin-top: 20rpx;
  padding: 20rpx 22rpx 24rpx;
}

.input-row,
.date-picker-row {
  padding: 20rpx 22rpx;
  border-radius: 18rpx;
  background: #fffaf1;
}

.profile-input {
  height: 56rpx;
  color: #2f2923;
  font-size: 34rpx;
  font-weight: 800;
}

.segmented,
.size-grid {
  display: grid;
  gap: 18rpx;
  margin-top: 18rpx;
}

.segmented {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.size-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.segment,
.size-button {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  align-items: center;
  justify-content: center;
  border: 1rpx solid rgba(142, 110, 83, 0.14);
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.72);
  color: #6f6258;
  flex-direction: column;
  font-size: 23rpx;
  font-weight: 800;
  gap: 16rpx;
  line-height: 1.15;
  box-shadow: 0 8rpx 18rpx rgba(142, 110, 83, 0.06);
}

.segment {
  min-height: 140rpx;
  padding: 18rpx 12rpx;
}

.size-button {
  min-height: 128rpx;
  padding: 16rpx 6rpx;
}

.segment.active,
.size-button.active {
  border-color: rgba(95, 109, 82, 0.38);
  background: #dfe8d8;
  color: #2f2923;
  box-shadow: 0 10rpx 24rpx rgba(142, 110, 83, 0.12);
}

.segment-icon,
.size-icon {
  width: 74rpx;
  height: 74rpx;
  flex: 0 0 auto;
}

.date-picker-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
}

.calendar-icon {
  color: #8e6e53;
  font-size: 48rpx;
}

.primary-button,
.share-button,
.secondary-button {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 104rpx;
  align-items: center;
  justify-content: center;
  margin-top: 24rpx;
  border: 1rpx solid rgba(95, 109, 82, 0.18);
  border-radius: 999rpx;
  background: #a3b19b;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1;
}

.primary-button,
.share-button {
  box-shadow: 0 14rpx 32rpx rgba(95, 109, 82, 0.2);
}

.secondary-button {
  margin-top: 28rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.18);
  background: #fff7ec;
  color: #8e6e53;
}

.detail-card {
  padding: 30rpx;
  text-align: center;
}

.detail-art {
  width: 360rpx;
  height: 300rpx;
  margin-top: 20rpx;
}

.detail-ribbon {
  margin: 40rpx 10rpx 8rpx;
}

.share-builder {
  padding-bottom: 220rpx;
}

.share-card {
  position: relative;
  overflow: hidden;
  width: 490rpx;
  height: 710rpx;
  margin: 0 auto;
  border-radius: 28rpx;
  background: #fff8ef;
  box-shadow: 0 20rpx 60rpx rgba(142, 110, 83, 0.16);
}

.share-bg {
  width: 100%;
  height: 100%;
}

.share-overlay {
  position: absolute;
  top: 60rpx;
  left: 48rpx;
  right: 48rpx;
  align-items: center;
  padding: 22rpx 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 250, 241, 0.66);
  backdrop-filter: blur(8rpx);
}

.share-name {
  text-align: center;
}

.share-age {
  display: block;
  margin-top: 4rpx;
  color: #8e6e53;
  font-size: 62rpx;
  font-weight: 900;
  text-align: center;
  line-height: 1;
}

.share-stage {
  display: block;
  color: #75685f;
  font-size: 24rpx;
  font-weight: 800;
  text-align: center;
}

.template-strip,
.swatch-row {
  display: flex;
  gap: 18rpx;
  margin-top: 20rpx;
  padding: 16rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.74);
}

.template-thumb {
  box-sizing: border-box;
  width: 100rpx;
  height: 132rpx;
  border: 3rpx solid transparent;
  border-radius: 18rpx;
  background: #fff2df;
}

.template-thumb.active {
  border-color: #8e6e53;
  box-shadow: 0 8rpx 18rpx rgba(142, 110, 83, 0.12);
}

.template-thumb.peach,
.swatch.peach {
  background: #f0b28f;
}

.template-thumb.sage,
.swatch.sage {
  background: #a3b19b;
}

.template-thumb.sky,
.swatch.sky {
  background: #a9c7d7;
}

.swatch-row {
  justify-content: space-between;
}

.swatch {
  box-sizing: border-box;
  width: 68rpx;
  height: 68rpx;
  border: 5rpx solid #fff;
  border-radius: 50%;
}

.swatch.cream {
  background: #fff2df;
}

.swatch.brown {
  background: #8e6e53;
}

.swatch.active {
  border-color: #8e6e53;
}

.settings-card {
  padding: 28rpx;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 92rpx;
  border-bottom: 1rpx solid rgba(142, 110, 83, 0.12);
}

.settings-title {
  color: #2f2923;
  font-size: 28rpx;
  font-weight: 800;
}

.settings-value-wrap {
  display: flex;
  align-items: center;
}

.settings-value {
  color: #75685f;
  font-size: 24rpx;
}

.disclaimer {
  display: block;
  margin-top: 24rpx;
  font-size: 22rpx;
}

.bottom-nav {
  position: fixed;
  left: 28rpx;
  right: 28rpx;
  bottom: 18rpx;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4rpx;
  padding: 16rpx 12rpx 14rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.12);
  border-radius: 34rpx;
  background: rgba(255, 250, 241, 0.94);
  box-shadow: 0 12rpx 44rpx rgba(142, 110, 83, 0.16);
}

.nav-item {
  display: flex;
  box-sizing: border-box;
  height: 94rpx;
  align-items: center;
  justify-content: center;
  border-radius: 24rpx;
  background: transparent;
  color: #8d8177;
  flex-direction: column;
  gap: 8rpx;
}

.nav-item.active {
  color: #8e6e53;
}

.nav-icon {
  display: flex;
  width: 54rpx;
  height: 54rpx;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.42);
  font-size: 32rpx;
  line-height: 1;
}

.nav-item.active .nav-icon {
  background: #fff2df;
  box-shadow: 0 8rpx 18rpx rgba(142, 110, 83, 0.08);
}

.nav-label {
  font-size: 18rpx;
  font-weight: 800;
  line-height: 1;
}
</style>
