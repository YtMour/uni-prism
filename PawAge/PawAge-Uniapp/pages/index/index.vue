<template>
  <view class="app-shell">
    <scroll-view class="page" scroll-y>
      <view class="top-bar">
        <button class="round-action" @click="setActiveTab('home')">
          <image class="round-icon" :src="assets.timelinePaw" mode="aspectFit" />
        </button>
        <view class="pet-switcher">
          <button class="switcher-avatar active" @click="setActiveTab('profile')">
            <image :src="currentSpeciesIcon" mode="aspectFit" />
          </button>
          <button class="switcher-avatar" @click="setActiveTab('profile')">
            <image :src="secondarySpeciesIcon" mode="aspectFit" />
          </button>
        </view>
        <button class="round-action add" @click="setActiveTab('profile')">+</button>
      </view>

      <view v-if="activeTab === 'home'" class="tab-view">
        <view class="dashboard-card">
          <view class="pet-hero">
            <view class="pet-art-wrap">
              <image class="pet-art" :src="currentSpeciesIcon" mode="aspectFit" />
              <button class="camera-dot" @click="setActiveTab('profile')">Edit</button>
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
          <button v-for="item in adviceItems" :key="item.title" class="advice-row" :class="item.tone" @click="openAdvice(item.title)">
            <image class="advice-icon" :src="item.icon" mode="aspectFit" />
            <view class="advice-copy">
              <text class="advice-title">{{ item.title }}</text>
              <text class="body-text">{{ item.text }}</text>
            </view>
            <text class="row-arrow">›</text>
          </button>
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
            <button class="camera-badge" @click="chooseAvatar('custom')">+</button>
          </view>
          <button
            v-for="option in avatarOptions"
            :key="option.value"
            class="avatar-option"
            :class="{ active: selectedAvatar === option.value }"
            @click="chooseAvatar(option.value)"
          >
            <image :src="option.src" mode="aspectFit" />
          </button>
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
          <button v-for="item in adviceItems" :key="item.title" class="advice-row" :class="item.tone" @click="openAdvice(item.title)">
            <image class="advice-icon" :src="item.icon" mode="aspectFit" />
            <view class="advice-copy">
              <text class="advice-title">{{ item.title }}</text>
              <text class="body-text">{{ item.text }}</text>
            </view>
            <text class="row-arrow">›</text>
          </button>
        </view>
      </view>

      <view v-else-if="activeTab === 'share'" class="tab-view">
        <view class="share-builder">
          <view class="share-card">
            <image class="share-bg" :src="assets.shareCardBackground" mode="aspectFill" />
            <view class="share-overlay" :class="[selectedShareTemplate, selectedShareSwatch]">
              <text class="share-name">{{ pet.name }}</text>
              <text class="share-age">{{ ageResult.humanAge }}</text>
              <text class="share-stage">{{ ageResult.stage.label }}</text>
            </view>
          </view>

          <text class="control-label">Template</text>
          <view class="template-strip">
            <button
              v-for="template in shareTemplates"
              :key="template.value"
              class="template-thumb"
              :class="[template.tone, { active: selectedShareTemplate === template.value }]"
              @click="selectedShareTemplate = template.value"
            />
          </view>

          <text class="control-label">Accent color</text>
          <view class="swatch-row">
            <button
              v-for="swatch in shareSwatches"
              :key="swatch.value"
              class="swatch"
              :class="[swatch.value, { active: selectedShareSwatch === swatch.value }]"
              @click="selectedShareSwatch = swatch.value"
            />
          </view>

          <button class="share-button" @click="shareMilestone">Share milestone</button>
          <text v-if="shareStatus" class="share-status">{{ shareStatus }}</text>
        </view>
      </view>

      <view v-else class="tab-view">
        <view class="settings-card">
          <view v-if="settingsView === 'home'">
            <text class="screen-title">{{ t.settings.title }}</text>
            <button v-for="item in settingsItems" :key="item.key" class="settings-row" @click="openSettingsView(item.key)">
              <text class="settings-title">{{ item.title }}</text>
              <view class="settings-value-wrap">
                <text class="settings-value">{{ item.value }}</text>
                <text class="row-arrow">›</text>
              </view>
            </button>
            <button class="secondary-button danger" @click="confirmClearLocalData">{{ t.settings.clearLocalData }}</button>
            <text class="disclaimer">Age results are estimates for general wellness reference only. Always consult a veterinarian for medical concerns.</text>
          </view>

          <view v-else-if="settingsView === 'language'" class="settings-panel">
            <button class="back-button" @click="settingsView = 'home'">‹ {{ t.settings.back }}</button>
            <text class="screen-title">{{ t.settings.language }}</text>
            <view class="language-list">
              <button
                v-for="option in languageOptions"
                :key="option.code"
                class="language-option"
                :class="{ active: appSettings.language === option.code }"
                @click="setLanguage(option.code)"
              >
                <view>
                  <text class="settings-title">{{ option.label }}</text>
                  <text class="settings-value">{{ option.nativeLabel }}</text>
                </view>
                <text class="check-mark">{{ appSettings.language === option.code ? '✓' : '' }}</text>
              </button>
            </view>
          </view>

          <view v-else-if="settingsView === 'privacy'" class="settings-panel">
            <button class="back-button" @click="settingsView = 'home'">‹ {{ t.settings.back }}</button>
            <text class="screen-title">{{ t.settings.privacy }}</text>
            <view class="policy-block">
              <text class="policy-title">Privacy-first storage</text>
              <text class="body-text">PawAge stores pet profile basics on this device. The MVP does not require an account and does not upload pet names, birthdays, species, dog size, or avatar choices to a cloud service.</text>
            </view>
            <view class="policy-block">
              <text class="policy-title">Local controls</text>
              <text class="body-text">You can reset the local profile from Settings. Future cloud sync, subscriptions, analytics, or reminders must be disclosed before they are enabled.</text>
            </view>
          </view>

          <view v-else-if="settingsView === 'disclaimer'" class="settings-panel">
            <button class="back-button" @click="settingsView = 'home'">‹ {{ t.settings.back }}</button>
            <text class="screen-title">{{ t.settings.disclaimer }}</text>
            <view class="policy-block">
              <text class="policy-title">General wellness reference</text>
              <text class="body-text">PawAge age results are estimates based on species, birthday, and broad dog size groups. They are not a diagnosis, treatment plan, or substitute for professional veterinary care.</text>
            </view>
            <view class="policy-block">
              <text class="policy-title">Health decisions</text>
              <text class="body-text">For pain, appetite changes, mobility changes, medication, disease risk, or urgent symptoms, talk to a licensed veterinarian.</text>
            </view>
          </view>

          <view v-else-if="settingsView === 'localData'" class="settings-panel">
            <button class="back-button" @click="settingsView = 'home'">‹ {{ t.settings.back }}</button>
            <text class="screen-title">{{ t.settings.localData }}</text>
            <view class="policy-block">
              <text class="policy-title">What is stored</text>
              <text class="body-text">PawAge keeps one local pet profile, the selected language, and reminder preference on this device. The pet profile storage is versioned for future migrations.</text>
            </view>
            <view class="policy-block">
              <text class="policy-title">Reset behavior</text>
              <text class="body-text">Clear local data resets the saved pet profile after confirmation. Language and reminder preferences stay in Settings so the app does not unexpectedly change locale.</text>
            </view>
            <button class="secondary-button danger" @click="confirmClearLocalData">{{ t.settings.clearLocalData }}</button>
          </view>

          <view v-else-if="settingsView === 'reminder'" class="settings-panel">
            <button class="back-button" @click="settingsView = 'home'">‹ {{ t.settings.back }}</button>
            <text class="screen-title">{{ t.settings.reminder }}</text>
            <view class="toggle-card">
              <view>
                <text class="policy-title">Lifecycle reminders</text>
                <text class="body-text">Keep this as an in-app preference for birthday and life-stage prompts. System notifications will require a separate permission step later.</text>
              </view>
              <switch :checked="appSettings.remindersEnabled" color="#a3b19b" @change="setReminderPreference" />
            </view>
            <view class="policy-block">
              <text class="policy-title">Current MVP behavior</text>
              <text class="body-text">This setting is saved locally but does not schedule push notifications yet. It prepares the UI and data model before App permission work begins.</text>
            </view>
          </view>

          <view v-else class="settings-panel">
            <button class="back-button" @click="settingsView = 'home'">‹ {{ t.settings.back }}</button>
            <text class="screen-title">{{ t.settings.pro }}</text>
            <view class="pro-preview">
              <text class="policy-title">Planned Pro value</text>
              <text class="body-text">PawAge Pro should focus on multi-pet profiles, advanced share templates, custom reminders, and deeper life-stage reports. The free version should keep the core age conversion complete.</text>
            </view>
            <view class="policy-block">
              <text class="policy-title">Not active yet</text>
              <text class="body-text">No payment, subscription, or account flow is connected in this MVP build.</text>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-spacer" />
    </scroll-view>

    <view class="bottom-nav">
      <button
        v-for="item in tabs"
        :key="item.value"
        class="nav-item"
        :class="{ active: activeTab === item.value }"
        @click="setActiveTab(item.value)"
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
import { languageOptions, messages } from '../../data/i18n'
import { dogSizeOptions, speciesOptions } from '../../data/lifeStage'
import type { LanguageCode } from '../../data/i18n'
import type { DogSize, PetProfile, PetSpecies } from '../../types/pet'
import { calculatePetAge } from '../../utils/ageCalculator'
import { createDefaultPetProfile, loadPetProfiles, savePetProfiles, updatePetProfile } from '../../utils/petStorage'
import { loadAppSettings, saveAppSettings, updateAppSettings } from '../../utils/settingsStorage'
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
type SettingsView = 'home' | 'language' | 'privacy' | 'disclaimer' | 'localData' | 'reminder' | 'pro'
type SettingsItemKey = Exclude<SettingsView, 'home'>
type AvatarPreset = 'dog' | 'cat' | 'puppy'
type ShareTemplate = 'classic' | 'peach' | 'sage' | 'sky'
type ShareSwatch = 'cream' | 'peach' | 'sage' | 'sky' | 'brown'

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
const settingsView = ref<SettingsView>('home')
const selectedShareTemplate = ref<ShareTemplate>('classic')
const selectedShareSwatch = ref<ShareSwatch>('cream')
const shareStatus = ref('')
const pet = reactive<PetProfile>(createDefaultPetProfile())
const appSettings = reactive(loadAppSettings())

onLoad(() => {
  const saved = loadPetProfiles()[0]
  Object.assign(appSettings, loadAppSettings())

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

const avatarOptions = computed<Array<{ value: AvatarPreset; src: string }>>(() => [
  { value: 'dog', src: assets.dogAdult },
  { value: 'cat', src: assets.catAdult },
  { value: 'puppy', src: assets.lifecyclePuppy }
])

const selectedAvatar = computed<AvatarPreset>(() => {
  if (pet.avatar === 'cat') return 'cat'
  if (pet.avatar === 'puppy') return 'puppy'

  return 'dog'
})

const shareTemplates: Array<{ value: ShareTemplate; tone?: string }> = [
  { value: 'classic' },
  { value: 'peach', tone: 'peach' },
  { value: 'sage', tone: 'sage' },
  { value: 'sky', tone: 'sky' }
]

const shareSwatches: Array<{ value: ShareSwatch }> = [
  { value: 'cream' },
  { value: 'peach' },
  { value: 'sage' },
  { value: 'sky' },
  { value: 'brown' }
]

const currentLanguage = computed(() => {
  return languageOptions.find((option) => option.code === appSettings.language) ?? languageOptions[0]
})

const t = computed(() => messages[appSettings.language])

const settingsItems = computed<Array<{ key: SettingsItemKey; title: string; value: string }>>(() => [
  { key: 'language', title: t.value.settings.language, value: currentLanguage.value.label },
  { key: 'localData', title: t.value.settings.localData, value: t.value.settings.storedOnDevice },
  { key: 'privacy', title: t.value.settings.privacy, value: t.value.settings.storedOnDevice },
  { key: 'disclaimer', title: t.value.settings.disclaimer, value: 'Required' },
  { key: 'reminder', title: t.value.settings.reminder, value: appSettings.remindersEnabled ? 'On' : t.value.settings.off },
  { key: 'pro', title: t.value.settings.pro, value: t.value.settings.preview }
])

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

function chooseAvatar(avatar: AvatarPreset | 'custom'): void {
  if (avatar === 'custom') {
    uni.showToast({
      title: 'Photo upload is next',
      icon: 'none'
    })
    return
  }

  Object.assign(pet, updatePetProfile(pet, { avatar }))
  persistPet()
}

function openAdvice(title: string): void {
  setActiveTab('life')
  uni.showToast({
    title,
    icon: 'none'
  })
}

function shareMilestone(): void {
  const summary = `${pet.name}: ${ageResult.value.humanAge} human years, ${ageResult.value.stage.label}.`
  shareStatus.value = summary

  uni.setClipboardData({
    data: summary,
    success: () => {
      uni.showToast({
        title: 'Milestone copied',
        icon: 'none'
      })
    },
    fail: () => {
      uni.showToast({
        title: 'Milestone ready',
        icon: 'none'
      })
    }
  })
}

function openSettingsView(key: SettingsItemKey): void {
  settingsView.value = key
}

function setLanguage(language: LanguageCode): void {
  Object.assign(appSettings, updateAppSettings({ language }))
  uni.showToast({
    title: currentLanguage.value.label,
    icon: 'none'
  })
}

function confirmClearLocalData(): void {
  uni.showModal({
    title: t.value.settings.clearLocalDataTitle,
    content: t.value.settings.clearLocalDataMessage,
    confirmText: t.value.settings.clearLocalDataConfirm,
    confirmColor: '#8e6e53',
    success: (result) => {
      if (result.confirm) {
        clearLocalData()
      }
    }
  })
}

function setReminderPreference(event: Event): void {
  const value = Boolean((event as unknown as { detail?: { value?: boolean } }).detail?.value)
  Object.assign(appSettings, updateAppSettings({ remindersEnabled: value }))
}

function clearLocalData(): void {
  const fresh = createDefaultPetProfile()
  savePetProfiles([fresh])
  saveAppSettings({ ...appSettings })
  Object.assign(pet, fresh)
  uni.showToast({
    title: t.value.settings.localDataReset,
    icon: 'none'
  })
}

function setActiveTab(tab: TabKey): void {
  activeTab.value = tab

  if (tab === 'settings') {
    settingsView.value = 'home'
  }
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
  height: calc(100vh - 260rpx - env(safe-area-inset-bottom));
  padding-bottom: 48rpx;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44rpx 52rpx 16rpx;
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
  padding: 0;
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
  padding: 0 42rpx 96rpx;
}

.bottom-spacer {
  display: block;
  height: 120rpx;
  flex: 0 0 auto;
}

.dashboard-card,
.form-card,
.detail-card,
.settings-card {
  border: 1rpx solid rgba(111, 98, 88, 0.22);
  border-radius: 28rpx;
  background: rgba(255, 253, 248, 0.92);
  box-shadow: 0 20rpx 58rpx rgba(142, 110, 83, 0.12);
}

.dashboard-card {
  overflow: hidden;
  padding: 34rpx 32rpx;
}

.pet-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 18rpx;
  align-items: center;
  min-height: 360rpx;
}

.pet-art-wrap {
  position: relative;
  overflow: visible;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.pet-art {
  width: 285rpx;
  height: 315rpx;
  margin: 0;
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
  left: 36rpx;
  bottom: -18rpx;
  width: 82rpx;
  height: 58rpx;
  border-radius: 999rpx;
  color: #8e6e53;
  font-size: 21rpx;
  line-height: 1;
}

.age-summary {
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
}

.muted-label,
.section-kicker,
.field-label {
  display: block;
  margin-bottom: 8rpx;
  color: #6f6258;
  font-size: 22rpx;
  font-weight: 800;
}

.age-ring {
  display: flex;
  width: 220rpx;
  height: 220rpx;
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
  font-size: 66rpx;
  font-weight: 900;
  line-height: 1;
}

.age-unit,
.age-caption,
.body-text,
.field-value,
.disclaimer {
  color: #5f564f;
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
  margin-top: 38rpx;
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
  z-index: 2;
  width: 70rpx;
  height: 70rpx;
  transform: translate(-50%, -50%);
}

.stage-dot {
  position: absolute;
  top: 50%;
  z-index: 1;
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
  border: 1rpx solid rgba(111, 98, 88, 0.18);
  border-radius: 24rpx;
  background: rgba(255, 253, 248, 0.94);
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
  padding-bottom: 160rpx;
}

.advice-row {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 132rpx;
  align-items: center;
  padding: 18rpx;
  border: 1rpx solid rgba(111, 98, 88, 0.18);
  border-radius: 24rpx;
  background: rgba(255, 253, 248, 0.95);
  color: inherit;
  line-height: 1;
  text-align: left;
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
  padding-bottom: 140rpx;
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
  border: 1rpx solid rgba(111, 98, 88, 0.18);
  border-radius: 28rpx;
  background: rgba(255, 253, 248, 0.92);
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
  color: #8e6e53;
  font-size: 28rpx;
}

.avatar-option {
  display: flex;
  box-sizing: border-box;
  width: 90rpx;
  height: 90rpx;
  align-items: center;
  justify-content: center;
  border: 4rpx solid transparent;
  border-radius: 50%;
  background: #fff8ef;
  opacity: 0.8;
  padding: 0;
  overflow: hidden;
}

.avatar-option image {
  width: 100%;
  height: 100%;
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
  background: #fff7ec;
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
  background: rgba(255, 253, 248, 0.96);
  color: #5f564f;
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

.secondary-button.danger {
  background: #fff2df;
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
  padding-bottom: 140rpx;
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
  background: rgba(255, 250, 241, 0.86);
  backdrop-filter: blur(8rpx);
}

.share-overlay.peach {
  background: rgba(255, 227, 211, 0.72);
}

.share-overlay.sage {
  background: rgba(223, 232, 216, 0.76);
}

.share-overlay.sky {
  background: rgba(219, 234, 242, 0.76);
}

.share-overlay.brown {
  background: rgba(142, 110, 83, 0.72);
}

.share-overlay.brown .share-name,
.share-overlay.brown .share-age,
.share-overlay.brown .share-stage {
  color: #fffaf1;
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
  color: #5f564f;
  font-size: 24rpx;
  font-weight: 800;
  text-align: center;
}

.share-status {
  display: block;
  margin-top: 18rpx;
  padding: 18rpx 20rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.12);
  border-radius: 20rpx;
  background: rgba(255, 250, 241, 0.94);
  color: #5f564f;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1.4;
  text-align: center;
}

.template-strip,
.swatch-row {
  display: flex;
  gap: 18rpx;
  margin-top: 20rpx;
  padding: 16rpx;
  border-radius: 24rpx;
  background: rgba(255, 253, 248, 0.94);
}

.control-label {
  display: block;
  margin-top: 26rpx;
  color: #6f6258;
  font-size: 23rpx;
  font-weight: 900;
}

.template-thumb {
  box-sizing: border-box;
  width: 100rpx;
  height: 132rpx;
  border: 3rpx solid transparent;
  border-radius: 18rpx;
  background: #fff2df;
  padding: 0;
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
  padding: 0;
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
  box-sizing: border-box;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 92rpx;
  border-bottom: 1rpx solid rgba(142, 110, 83, 0.12);
  border-radius: 0;
  color: inherit;
  line-height: 1;
  text-align: left;
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
  display: block;
  color: #5f564f;
  font-size: 24rpx;
}

.settings-panel {
  min-height: 620rpx;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin-bottom: 22rpx;
  color: #8e6e53;
  font-size: 26rpx;
  font-weight: 900;
  line-height: 1;
}

.language-list {
  display: grid;
  gap: 14rpx;
  margin-top: 24rpx;
}

.language-option {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 102rpx;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 20rpx;
  border: 1rpx solid rgba(142, 110, 83, 0.12);
  border-radius: 22rpx;
  background: rgba(255, 250, 241, 0.94);
  line-height: 1;
  text-align: left;
}

.language-option.active {
  border-color: rgba(95, 109, 82, 0.38);
  background: #dfe8d8;
}

.language-option .settings-value {
  margin-top: 8rpx;
}

.check-mark {
  width: 44rpx;
  color: #5f6d52;
  font-size: 34rpx;
  font-weight: 900;
  text-align: center;
}

.policy-block {
  margin-top: 22rpx;
  padding: 22rpx;
  border: 1rpx solid rgba(111, 98, 88, 0.18);
  border-radius: 22rpx;
  background: rgba(255, 250, 241, 0.94);
}

.toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 24rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(111, 98, 88, 0.18);
  border-radius: 24rpx;
  background: rgba(255, 250, 241, 0.94);
}

.toggle-card > view {
  min-width: 0;
  flex: 1;
}

.pro-preview {
  margin-top: 24rpx;
  padding: 28rpx;
  border: 1rpx solid rgba(95, 109, 82, 0.18);
  border-radius: 24rpx;
  background: #dfe8d8;
}

.policy-title {
  display: block;
  margin-bottom: 10rpx;
  color: #2f2923;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1.2;
}

.disclaimer {
  display: block;
  margin-top: 24rpx;
  font-size: 22rpx;
}

.bottom-nav {
  position: fixed;
  left: 20rpx;
  right: 20rpx;
  bottom: calc(16rpx + env(safe-area-inset-bottom));
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6rpx;
  padding: 18rpx 14rpx 20rpx;
  border: 1rpx solid rgba(111, 98, 88, 0.18);
  border-radius: 36rpx;
  background: rgba(255, 253, 248, 0.98);
  box-shadow: 0 14rpx 48rpx rgba(111, 98, 88, 0.2);
}

.nav-item {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 118rpx;
  align-items: center;
  justify-content: center;
  border-radius: 24rpx;
  background: transparent;
  color: #6f6258;
  flex-direction: column;
  gap: 10rpx;
  overflow: visible;
}

.nav-item.active {
  background: #fff2df;
  color: #5f4a3b;
}

.nav-icon {
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  background: rgba(255, 247, 236, 0.86);
  font-size: 31rpx;
  line-height: 1;
}

.nav-item.active .nav-icon {
  background: #ffffff;
  box-shadow: 0 8rpx 18rpx rgba(111, 98, 88, 0.12);
}

.nav-label {
  display: block;
  min-height: 28rpx;
  color: inherit;
  font-size: 20rpx;
  font-weight: 900;
  line-height: 1.25;
  overflow: visible;
}
</style>
