<template>
  <view class="app-shell">
    <view class="top-bar">
      <button v-if="viewMode !== 'home'" class="icon-button" aria-label="Back" @click="goBack">
        <image class="icon-img" src="/static/icons/icon-back.png" mode="aspectFit" />
      </button>
      <view class="brand-block">
        <text class="brand-title">{{ topTitle }}</text>
        <text class="brand-subtitle">{{ topSubtitle }}</text>
      </view>
      <button v-if="viewMode === 'home'" class="icon-button settings-button" aria-label="Settings">
        <image class="icon-img" src="/static/icons/icon-settings.png" mode="aspectFit" />
      </button>
      <button v-else-if="character" class="seed-chip" @click="copySeed">{{ character.seed }}</button>
    </view>

    <scroll-view scroll-y class="screen-scroll" :class="{ 'is-dimmed': showRerollSheet }">
      <view v-if="viewMode === 'home'" class="home-screen">
        <button class="hero-die" :class="{ 'is-forging': isGenerating }" @click="forgeCharacter">
          <view class="arcane-ring"></view>
          <view class="arcane-ring inner"></view>
          <view class="die-aura"></view>
          <view class="die-ground-shadow"></view>
          <view class="die-core">
            <view class="die-spinner">
              <image class="die-art" src="/static/d20-hero-premium.png" mode="aspectFit" />
            </view>
          </view>
        </button>
        <button class="primary-fantasy-button" :disabled="isGenerating" @click="forgeCharacter">
          <image class="button-icon" src="/static/icons/icon-d20.png" mode="aspectFit" />
          <text>{{ isGenerating ? 'Forging...' : 'Generate' }}</text>
        </button>

        <view v-if="isGenerating" class="progress-panel">
          <view v-for="step in generationSteps" :key="step.label" class="progress-row">
            <image class="progress-icon" :src="step.done ? '/static/icons/icon-check.png' : '/static/icons/icon-d20.png'" mode="aspectFit" />
            <text>{{ step.label }}</text>
          </view>
        </view>

        <section-title title="Recent" />
        <view v-if="recentCharacters.length === 0" class="empty-state">
          <image class="empty-icon" src="/static/icons/icon-d20.png" mode="aspectFit" />
          <text class="empty-title">No character yet</text>
          <text class="empty-copy">Tap Generate to forge one</text>
        </view>
        <view v-else class="recent-preview">
          <button v-for="item in recentCharacters.slice(0, 3)" :key="item.id" class="recent-row" @click="openCharacter(item)">
            <text class="avatar">{{ initials(item.name.full) }}</text>
            <view class="recent-copy">
              <text class="recent-name">{{ item.name.full }}</text>
              <text class="recent-meta">{{ item.race.name }} {{ item.class.name }} · {{ item.background.name }}</text>
            </view>
            <text class="alignment-pill">{{ item.alignment }}</text>
          </button>
          <button class="ghost-button" @click="viewMode = 'recent'">View All Characters</button>
        </view>
      </view>

      <view v-else-if="viewMode === 'character' && character" class="character-screen">
        <view class="hero-card">
          <text class="character-name">{{ character.name.full }}</text>
          <text class="character-meta">{{ character.race.name }} {{ character.class.name }} · {{ character.background.name }} · {{ character.alignment }}</text>
        </view>
        <view class="action-row">
          <button class="action-button" @click="showRerollSheet = true">
            <image src="/static/icons/icon-reroll.png" mode="aspectFit" />
            <text>Reroll</text>
          </button>
          <button class="action-button" @click="rerollStory">
            <image src="/static/icons/icon-story.png" mode="aspectFit" />
            <text>Story</text>
          </button>
          <button class="action-button" @click="copyCharacter">
            <image src="/static/icons/icon-copy.png" mode="aspectFit" />
            <text>Copy</text>
          </button>
          <button class="action-button" @click="viewMode = 'exportText'">
            <image src="/static/icons/icon-export.png" mode="aspectFit" />
            <text>Export</text>
          </button>
        </view>

        <view class="ability-grid">
          <view v-for="key in abilityKeys" :key="key" class="ability-tile">
            <text class="ability-key">{{ key }}</text>
            <text class="ability-score">{{ character.abilities[key].total }}</text>
            <text class="ability-mod">{{ formatModifier(character.abilities[key].modifier) }}</text>
          </view>
        </view>

        <section-title title="Proficiencies" />
        <view class="chip-list">
          <view v-for="item in character.proficiencies" :key="`${item.type}-${item.name}`" class="info-chip">
            <image src="/static/icons/icon-proficiency.png" mode="aspectFit" />
            <text>{{ item.name }}</text>
          </view>
        </view>

        <section-title title="Gear" />
        <view class="chip-list">
          <view v-for="item in character.gear" :key="`${item.category}-${item.name}`" class="info-chip">
            <image src="/static/icons/icon-gear.png" mode="aspectFit" />
            <text>{{ item.name }}</text>
          </view>
        </view>

        <section-title title="Backstory" />
        <view class="story-panel">
          <text v-for="sentence in character.backstory.sentences" :key="sentence" class="story-line">{{ sentence }}</text>
        </view>
      </view>

      <view v-else-if="viewMode === 'exportText' && character" class="export-screen">
        <view class="segmented">
          <button class="segment is-active">Text</button>
          <button class="segment" @click="viewMode = 'exportPoster'">Poster</button>
        </view>
        <view class="export-preview">
          <text>{{ character.exportText }}</text>
        </view>
      </view>

      <view v-else-if="viewMode === 'exportPoster' && character" class="export-screen">
        <view class="segmented">
          <button class="segment" @click="viewMode = 'exportText'">Text</button>
          <button class="segment is-active">Poster</button>
        </view>
        <view class="poster-preview">
          <image class="poster-emblem" src="/static/icons/icon-d20.png" mode="aspectFit" />
          <text class="poster-name">{{ character.name.full }}</text>
          <text class="poster-class">{{ character.race.name }} {{ character.class.name }}</text>
          <text class="poster-meta">{{ character.background.name }} · {{ character.alignment }}</text>
          <view class="poster-abilities">
            <view v-for="key in abilityKeys" :key="key">
              <text>{{ key }}</text>
              <text>{{ character.abilities[key].total }}</text>
            </view>
          </view>
          <text class="poster-story">{{ character.backstory.sentences.join(' ') }}</text>
          <text class="poster-seed">Seed {{ character.seed }}</text>
        </view>
      </view>

      <view v-else-if="viewMode === 'recent'" class="recent-screen">
        <view class="search-box">
          <image src="/static/icons/icon-search.png" mode="aspectFit" />
          <input v-model="searchText" placeholder="Search by name, race, class" />
          <button v-if="recentCharacters.length" @click="clearRecent">
            <image src="/static/icons/icon-trash.png" mode="aspectFit" />
          </button>
        </view>
        <button v-for="item in filteredRecent" :key="item.id" class="recent-row large" @click="openCharacter(item)">
          <text class="avatar">{{ initials(item.name.full) }}</text>
          <view class="recent-copy">
            <text class="recent-name">{{ item.name.full }}</text>
            <text class="recent-meta">{{ item.race.name }} {{ item.class.name }} · {{ item.background.name }}</text>
          </view>
          <text class="alignment-pill">{{ item.alignment }}</text>
        </button>
      </view>
    </scroll-view>

    <view v-if="viewMode === 'exportText' && character" class="bottom-bar">
      <button class="primary-fantasy-button compact" @click="copyCharacter">
        <image class="button-icon" src="/static/icons/icon-copy.png" mode="aspectFit" />
        <text>Copy Text</text>
      </button>
      <button class="outline-button" @click="viewMode = 'exportPoster'">Preview Poster</button>
    </view>

    <view v-if="viewMode === 'exportPoster' && character" class="bottom-bar">
      <button class="primary-fantasy-button compact" @click="copyCharacter">
        <image class="button-icon" src="/static/icons/icon-copy.png" mode="aspectFit" />
        <text>Copy Text</text>
      </button>
      <button class="outline-button" @click="viewMode = 'exportText'">Back to Text</button>
    </view>

    <view v-if="viewMode === 'recent'" class="bottom-bar">
      <button class="primary-fantasy-button compact" @click="forgeCharacter">
        <image class="button-icon" src="/static/icons/icon-d20.png" mode="aspectFit" />
        <text>Generate New</text>
      </button>
    </view>

    <view v-if="showRerollSheet" class="sheet-backdrop" @click="showRerollSheet = false"></view>
    <view v-if="showRerollSheet" class="reroll-sheet">
      <view class="sheet-handle"></view>
      <view class="sheet-title-row">
        <text>Reroll</text>
        <button @click="showRerollSheet = false">×</button>
      </view>
      <button class="reroll-option selected" @click="applyReroll('whole')">
        <image src="/static/icons/icon-d20.png" mode="aspectFit" />
        <view>
          <text class="option-title">Whole character</text>
          <text class="option-copy">Race, class, stats, gear, story</text>
        </view>
      </button>
      <button class="reroll-option" @click="applyReroll('story')">
        <image src="/static/icons/icon-story.png" mode="aspectFit" />
        <view>
          <text class="option-title">Story only</text>
          <text class="option-copy">Keep numbers and equipment</text>
        </view>
      </button>
      <button class="reroll-option" @click="applyReroll('stats')">
        <image src="/static/icons/icon-stats.png" mode="aspectFit" />
        <view>
          <text class="option-title">Stats only</text>
          <text class="option-copy">Roll abilities again</text>
        </view>
      </button>
    </view>

    <view v-if="toast" class="toast">
      <image src="/static/icons/icon-check.png" mode="aspectFit" />
      <text>{{ toast }}</text>
    </view>
  </view>
</template>

<script>
import { generateCharacter, createSeed, formatModifier } from '../../src/core/generator.js';

const SectionTitle = {
  props: {
    title: String
  },
  template: '<view class="section-title"><text>{{ title }}</text><view></view></view>'
};

export default {
  components: {
    SectionTitle
  },
  data() {
    return {
      abilityKeys: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      viewMode: 'home',
      character: null,
      recentCharacters: [],
      isGenerating: false,
      showRerollSheet: false,
      toast: '',
      searchText: '',
      generationStepIndex: 0
    };
  },
  computed: {
    topTitle() {
      if (this.viewMode === 'exportText' || this.viewMode === 'exportPoster') return 'Export';
      if (this.viewMode === 'recent') return 'Recent Characters';
      return this.viewMode === 'character' ? 'DiceForge' : 'DiceForge';
    },
    topSubtitle() {
      if ((this.viewMode === 'exportText' || this.viewMode === 'exportPoster') && this.character) return this.character.name.full;
      if (this.viewMode === 'home') return 'D&D Character Creator';
      return this.character ? `${this.character.race.name} ${this.character.class.name}` : 'D&D Character Creator';
    },
    generationSteps() {
      return [
        { label: 'Rolling abilities', done: this.generationStepIndex > 0 },
        { label: 'Choosing race and class', done: this.generationStepIndex > 1 },
        { label: 'Writing backstory', done: this.generationStepIndex > 2 }
      ];
    },
    filteredRecent() {
      const query = this.searchText.trim().toLowerCase();
      if (!query) return this.recentCharacters;
      return this.recentCharacters.filter((item) => {
        return [item.name.full, item.race.name, item.class.name, item.background.name]
          .join(' ')
          .toLowerCase()
          .includes(query);
      });
    }
  },
  onLoad() {
    this.restoreRecent();
  },
  methods: {
    formatModifier,
    forgeCharacter() {
      if (this.isGenerating) return;
      this.vibrate();
      this.isGenerating = true;
      this.generationStepIndex = 0;
      this.viewMode = 'home';
      const seed = createSeed();
      const timers = [180, 420, 720];
      timers.forEach((delay, index) => {
        setTimeout(() => {
          this.generationStepIndex = index + 1;
        }, delay);
      });
      setTimeout(() => {
        const next = generateCharacter(seed);
        this.setCharacter(next);
        this.isGenerating = false;
        this.viewMode = 'character';
      }, 950);
    },
    setCharacter(next) {
      this.character = next;
      this.recentCharacters = [
        next,
        ...this.recentCharacters.filter((item) => item.id !== next.id)
      ].slice(0, 8);
      this.persistRecent();
    },
    openCharacter(item) {
      this.character = item;
      this.viewMode = 'character';
    },
    applyReroll(mode) {
      this.showRerollSheet = false;
      if (mode === 'story') {
        this.rerollStory();
        return;
      }
      const seed = mode === 'stats' && this.character ? `${this.character.seed}-stats-${Date.now()}` : createSeed();
      this.setCharacter(generateCharacter(seed, { alignment: this.character?.alignment }));
      this.viewMode = 'character';
    },
    rerollStory() {
      if (!this.character) return;
      const next = generateCharacter(`${this.character.seed}-story-${Date.now()}`, {
        alignment: this.character.alignment
      });
      const updated = {
        ...this.character,
        backstory: next.backstory,
        exportText: next.exportText
      };
      this.setCharacter(updated);
      this.showToast('Story updated');
    },
    async copyCharacter() {
      if (!this.character) return;
      await this.copyText(this.character.exportText);
      this.showToast('Copied');
    },
    async copySeed() {
      if (!this.character) return;
      await this.copyText(this.character.seed);
      this.showToast('Seed copied');
    },
    clearRecent() {
      this.recentCharacters = [];
      this.persistRecent();
    },
    goBack() {
      if (this.viewMode === 'exportPoster') {
        this.viewMode = 'exportText';
      } else if (this.viewMode === 'exportText' || this.viewMode === 'recent') {
        this.viewMode = this.character ? 'character' : 'home';
      } else {
        this.viewMode = 'home';
      }
    },
    initials(name) {
      return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    },
    async copyText(text) {
      if (typeof uni !== 'undefined' && uni.setClipboardData) {
        return new Promise((resolve) => {
          uni.setClipboardData({
            data: text,
            success: resolve,
            fail: resolve
          });
        });
      }
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    },
    showToast(message) {
      this.toast = message;
      setTimeout(() => {
        this.toast = '';
      }, 1600);
    },
    vibrate() {
      if (typeof uni !== 'undefined' && uni.vibrateShort) {
        uni.vibrateShort({});
      } else if (navigator?.vibrate) {
        navigator.vibrate(30);
      }
    },
    restoreRecent() {
      try {
        const stored = uni.getStorageSync('diceforge:recent');
        if (stored) this.recentCharacters = JSON.parse(stored);
      } catch (error) {
        this.recentCharacters = [];
      }
    },
    persistRecent() {
      try {
        uni.setStorageSync('diceforge:recent', JSON.stringify(this.recentCharacters));
      } catch (error) {
        // Local storage may be unavailable in restricted previews.
      }
    }
  }
};
</script>

<style>
page {
  background: #f3e7cf;
}

button {
  padding: 0;
  margin: 0;
  background: transparent;
  border: 0;
  line-height: 1;
}

button::after {
  border: 0;
}

.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% 12%, rgba(164, 122, 59, 0.18), transparent 28%),
    linear-gradient(180deg, #f3e7cf 0%, #fff8ea 100%);
  color: #191512;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  overflow: hidden;
}

.top-bar {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-height: 148rpx;
  padding: 32rpx 38rpx 22rpx;
  background: linear-gradient(135deg, #4a1515, #170d0d);
  color: #fff8ea;
  box-shadow: 0 8rpx 0 rgba(164, 122, 59, 0.85);
}

.brand-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  font-size: 44rpx;
  font-weight: 800;
  letter-spacing: 0;
}

.brand-subtitle {
  margin-top: 8rpx;
  color: #cba15a;
  font-size: 24rpx;
  font-weight: 600;
}

.icon-button,
.seed-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border: 2rpx solid rgba(164, 122, 59, 0.74);
  border-radius: 20rpx;
}

.seed-chip {
  width: auto;
  min-width: 134rpx;
  padding: 0 18rpx;
  color: #d9b164;
  font-size: 24rpx;
  font-weight: 800;
}

.icon-img,
.button-icon,
.action-button image,
.info-chip image,
.progress-icon,
.search-box image,
.reroll-option image,
.toast image {
  width: 38rpx;
  height: 38rpx;
}

.screen-scroll {
  height: calc(100vh - 148rpx);
  box-sizing: border-box;
  padding: 34rpx 36rpx 160rpx;
}

.screen-scroll.is-dimmed {
  filter: brightness(0.45);
}

.home-screen {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.hero-die {
  position: relative;
  align-self: center;
  width: min(720rpx, 92vw);
  aspect-ratio: 1 / 1;
  margin: 34rpx 0 24rpx;
  padding: 0;
  border: 0;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
}

.arcane-ring {
  position: absolute;
  inset: 36rpx;
  border: 2rpx solid rgba(176, 140, 81, 0.38);
  border-radius: 50%;
}

.arcane-ring.inner {
  inset: 96rpx;
  border-style: dashed;
  opacity: 0.78;
}

.die-aura {
  position: absolute;
  inset: 56rpx;
  border: 2rpx solid rgba(164, 122, 59, 0.22);
  border-radius: 50%;
  box-shadow: 0 0 0 56rpx rgba(164, 122, 59, 0.07), 0 40rpx 68rpx rgba(86, 47, 13, 0.18);
}

.die-core {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  transition: transform 260ms ease;
  will-change: transform;
}

.die-spinner {
  position: absolute;
  inset: 0;
  z-index: 1;
  transform-origin: 50% 54%;
  will-change: transform, filter;
}

.die-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform-origin: 50% 54%;
}

.die-ground-shadow {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: -8rpx;
  height: 48rpx;
  z-index: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(58, 27, 8, 0.18), rgba(58, 27, 8, 0.08) 42%, transparent 72%);
  filter: blur(14rpx);
}

.hero-die:active .die-core,
.hero-die.is-forging .die-core {
  animation: die-throw-path 980ms cubic-bezier(0.18, 0.84, 0.24, 1);
}

.hero-die:active .die-spinner,
.hero-die.is-forging .die-spinner {
  animation: die-spin-settle 980ms cubic-bezier(0.16, 0.8, 0.22, 1);
}

.hero-die:active .die-aura,
.hero-die.is-forging .die-aura {
  animation: aura-forge-pulse 920ms ease-out;
}

.hero-die:active .die-ground-shadow,
.hero-die.is-forging .die-ground-shadow {
  animation: shadow-forge-pulse 920ms ease-out;
}

@keyframes die-throw-path {
  0% { transform: translate3d(-50%, -50%, 0) scale(1); }
  14% { transform: translate3d(-57%, -48%, 0) scale(0.96); }
  34% { transform: translate3d(-64%, -70%, 0) scale(0.88); }
  58% { transform: translate3d(-38%, -54%, 0) scale(1.02); }
  74% { transform: translate3d(-52%, -47%, 0) scale(1.04); }
  86% { transform: translate3d(-49%, -52%, 0) scale(0.99); }
  100% { transform: translate3d(-50%, -50%, 0) scale(1); }
}

@keyframes die-spin-settle {
  0% { transform: rotate(0deg) scale(1); filter: brightness(1); }
  18% { transform: rotate(-54deg) scale(0.98); filter: brightness(0.9); }
  38% { transform: rotate(234deg) scale(1.04); filter: brightness(1.16); }
  62% { transform: rotate(392deg) scale(1.02); filter: brightness(1.08); }
  78% { transform: rotate(346deg) scale(0.985); filter: brightness(0.98); }
  100% { transform: rotate(360deg) scale(1); filter: brightness(1); }
}

@keyframes aura-forge-pulse {
  0% { opacity: 1; transform: scale(1); }
  38% { opacity: 0.92; transform: scale(1.045); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes shadow-forge-pulse {
  0% { transform: scaleX(1); opacity: 1; }
  18% { transform: scaleX(1.18); opacity: 0.86; }
  36% { transform: scaleX(0.58); opacity: 0.38; }
  66% { transform: scaleX(1.24); opacity: 0.78; }
  100% { transform: scaleX(1); opacity: 1; }
}

.primary-fantasy-button,
.outline-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  min-height: 92rpx;
  border-radius: 18rpx;
  font-size: 34rpx;
  font-weight: 800;
}

.primary-fantasy-button {
  color: #fff8ea;
  background: linear-gradient(145deg, #861b18, #4a1515);
  border: 3rpx solid #a47a3b;
  box-shadow: 0 12rpx 20rpx rgba(74, 21, 21, 0.22);
}

.primary-fantasy-button.compact {
  flex: 1;
  min-height: 82rpx;
  font-size: 28rpx;
}

.outline-button,
.ghost-button {
  color: #7b571e;
  border: 2rpx solid #a47a3b;
  background: rgba(255, 248, 234, 0.74);
}

.button-icon {
  width: 44rpx;
  height: 44rpx;
}

.progress-panel,
.story-panel,
.export-preview,
.poster-preview,
.recent-row,
.search-box {
  background: rgba(255, 248, 234, 0.82);
  border: 2rpx solid rgba(164, 122, 59, 0.32);
  border-radius: 18rpx;
}

.progress-panel {
  margin: 34rpx 0;
  padding: 26rpx 34rpx;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-height: 58rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin: 42rpx 0 22rpx;
}

.section-title text {
  font-size: 34rpx;
  font-weight: 900;
}

.section-title view {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, #a47a3b, transparent);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 42rpx 24rpx 28rpx;
  color: #6d6257;
}

.empty-icon {
  width: 150rpx;
  height: 150rpx;
  opacity: 0.34;
}

.empty-title {
  margin-top: 24rpx;
  color: #191512;
  font-size: 36rpx;
  font-weight: 800;
}

.empty-copy {
  margin-top: 14rpx;
  font-size: 26rpx;
  font-style: italic;
}

.hero-card {
  padding: 50rpx 12rpx 30rpx;
  text-align: center;
}

.character-name {
  display: block;
  font-size: 70rpx;
  font-weight: 900;
  color: #191512;
}

.character-meta {
  display: block;
  margin-top: 14rpx;
  color: #6d6257;
  font-size: 28rpx;
  font-weight: 700;
}

.action-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8rpx;
  padding: 18rpx 0 30rpx;
  border-top: 2rpx solid rgba(164, 122, 59, 0.35);
  border-bottom: 2rpx solid rgba(164, 122, 59, 0.35);
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  color: #7a1917;
  font-size: 24rpx;
  font-weight: 800;
}

.action-button image {
  width: 44rpx;
  height: 44rpx;
}

.ability-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24rpx;
  margin-top: 34rpx;
}

.ability-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 190rpx;
  background: rgba(255, 248, 234, 0.78);
  border: 2rpx solid rgba(164, 122, 59, 0.42);
  border-radius: 14rpx;
}

.ability-key {
  font-size: 28rpx;
  font-weight: 900;
  letter-spacing: 0;
}

.ability-score {
  margin-top: 10rpx;
  font-size: 68rpx;
  font-weight: 900;
}

.ability-mod {
  margin-top: 8rpx;
  color: #7a1917;
  font-size: 32rpx;
  font-weight: 900;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.info-chip {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-height: 62rpx;
  padding: 0 18rpx;
  border: 2rpx solid rgba(164, 122, 59, 0.35);
  border-radius: 12rpx;
  background: rgba(255, 248, 234, 0.72);
  font-size: 24rpx;
  font-weight: 700;
}

.info-chip image {
  width: 34rpx;
  height: 34rpx;
}

.story-panel {
  padding: 28rpx;
}

.story-line {
  display: block;
  margin-bottom: 20rpx;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 29rpx;
  line-height: 1.48;
}

.segmented {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  margin-bottom: 28rpx;
  padding: 6rpx;
  border: 2rpx solid rgba(164, 122, 59, 0.25);
  border-radius: 18rpx;
  background: rgba(255, 248, 234, 0.68);
}

.segment {
  min-height: 76rpx;
  border-radius: 14rpx;
  color: #6d6257;
  font-size: 28rpx;
  font-weight: 800;
}

.segment.is-active {
  background: #fff8ea;
  color: #7a1917;
  box-shadow: 0 4rpx 12rpx rgba(25, 21, 18, 0.12);
}

.export-preview {
  padding: 34rpx;
}

.export-preview text {
  white-space: pre-wrap;
  font-family: "Courier New", monospace;
  font-size: 24rpx;
  line-height: 1.45;
}

.poster-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34rpx 28rpx;
  min-height: 760rpx;
  text-align: center;
}

.poster-emblem {
  width: 90rpx;
  height: 90rpx;
}

.poster-name {
  margin-top: 18rpx;
  font-size: 60rpx;
  font-weight: 900;
}

.poster-class {
  margin-top: 8rpx;
  color: #7a1917;
  font-size: 32rpx;
  font-weight: 900;
}

.poster-meta,
.poster-seed {
  margin-top: 12rpx;
  color: #6d6257;
  font-size: 24rpx;
}

.poster-abilities {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10rpx;
  width: 100%;
  margin: 34rpx 0;
  padding: 18rpx 0;
  border-top: 2rpx solid rgba(164, 122, 59, 0.35);
  border-bottom: 2rpx solid rgba(164, 122, 59, 0.35);
}

.poster-abilities view {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 20rpx;
  font-weight: 800;
}

.poster-story {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27rpx;
  line-height: 1.48;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 14rpx;
  height: 82rpx;
  padding: 0 20rpx;
  margin-bottom: 28rpx;
}

.search-box image,
.search-box button image {
  width: 38rpx;
  height: 38rpx;
}

.search-box input {
  flex: 1;
  font-size: 28rpx;
}

.recent-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  width: 100%;
  min-height: 112rpx;
  padding: 18rpx;
  margin-bottom: 18rpx;
  text-align: left;
}

.recent-row.large {
  min-height: 128rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border: 2rpx solid rgba(164, 122, 59, 0.5);
  border-radius: 50%;
  color: #7a1917;
  font-size: 28rpx;
  font-weight: 900;
}

.recent-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.recent-name {
  font-size: 28rpx;
  font-weight: 900;
}

.recent-meta {
  margin-top: 8rpx;
  color: #6d6257;
  font-size: 23rpx;
}

.alignment-pill {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(105, 145, 92, 0.15);
  color: #37572e;
  font-size: 20rpx;
  font-weight: 800;
}

.ghost-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  border-radius: 14rpx;
  font-size: 26rpx;
  font-weight: 800;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8;
  display: flex;
  gap: 18rpx;
  padding: 22rpx 36rpx 34rpx;
  background: linear-gradient(180deg, rgba(243, 231, 207, 0.18), #f3e7cf 28%);
}

.bottom-bar .outline-button {
  flex: 1;
  min-height: 82rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 800;
}

.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.45);
}

.reroll-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 18rpx 38rpx 44rpx;
  border-radius: 34rpx 34rpx 0 0;
  background: #fff8ea;
}

.sheet-handle {
  width: 92rpx;
  height: 8rpx;
  margin: 0 auto 24rpx;
  border-radius: 999rpx;
  background: rgba(109, 98, 87, 0.35);
}

.sheet-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.sheet-title-row text {
  font-size: 40rpx;
  font-weight: 900;
}

.sheet-title-row button {
  color: #6d6257;
  font-size: 56rpx;
}

.reroll-option {
  display: flex;
  align-items: center;
  gap: 22rpx;
  width: 100%;
  min-height: 112rpx;
  padding: 18rpx 22rpx;
  margin-bottom: 18rpx;
  border: 2rpx solid rgba(164, 122, 59, 0.22);
  border-radius: 16rpx;
  text-align: left;
}

.reroll-option.selected {
  border-color: #a47a3b;
}

.reroll-option image {
  width: 54rpx;
  height: 54rpx;
}

.reroll-option view {
  display: flex;
  flex-direction: column;
}

.option-title {
  font-size: 28rpx;
  font-weight: 900;
}

.option-copy {
  margin-top: 8rpx;
  color: #6d6257;
  font-size: 23rpx;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 150rpx;
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 62rpx;
  padding: 0 24rpx;
  border-radius: 18rpx;
  color: #fff8ea;
  background: rgba(25, 21, 18, 0.92);
  transform: translateX(-50%);
  font-size: 26rpx;
  font-weight: 800;
}

.toast image {
  width: 32rpx;
  height: 32rpx;
}
</style>
