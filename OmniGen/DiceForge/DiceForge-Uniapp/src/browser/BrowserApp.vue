<template>
  <main class="app-shell parchment-texture">
    <div class="paper-vignette" aria-hidden="true"></div>
    <header class="top-bar ornate-top-bar">
      <button v-if="viewMode !== 'home'" class="icon-button" aria-label="Back" @click="goBack">
        <img src="/static/icons/icon-back.png" alt="" />
      </button>
      <div class="brand-block">
        <h1>{{ topTitle }}</h1>
        <p>{{ topSubtitle }}</p>
      </div>
      <button v-if="viewMode === 'home'" class="icon-button" aria-label="Settings">
        <img src="/static/icons/icon-settings.png" alt="" />
      </button>
      <button v-else-if="character" class="seed-chip" @click="copySeed">{{ character.seed }}</button>
    </header>
    <div class="header-notch" aria-hidden="true"></div>

    <section ref="screenScroll" class="screen-scroll" :class="{ 'is-dimmed': showRerollSheet }">
      <div v-if="viewMode === 'home'" class="home-screen" data-view="home">
        <HeroDie :forging="isGenerating" @forge="forgeCharacter" />

        <button class="primary-fantasy-button" :disabled="isGenerating" @click="forgeCharacter">
          <img src="/static/icons/icon-d20.png" alt="" />
          <span>{{ isGenerating ? 'Forging...' : 'Generate' }}</span>
        </button>

        <div v-if="isGenerating" class="progress-panel" data-view="generating">
          <div v-for="step in generationSteps" :key="step.label" class="progress-row">
            <img :src="step.done ? '/static/icons/icon-check.png' : '/static/icons/icon-d20.png'" alt="" />
            <span>{{ step.label }}</span>
          </div>
        </div>

        <div class="section-title"><h2>Recent</h2><span></span></div>
        <div v-if="recentCharacters.length === 0" class="empty-state">
          <img src="/static/icons/icon-d20.png" alt="" />
          <strong>No character yet</strong>
          <span class="empty-copy">Tap Generate to forge one</span>
        </div>
        <div v-else class="recent-preview">
          <button v-for="item in recentCharacters.slice(0, 3)" :key="item.id" class="recent-row" @click="openCharacter(item)">
            <span class="avatar">{{ initials(item.name.full) }}</span>
            <span class="recent-copy">
              <strong>{{ item.name.full }}</strong>
              <small>{{ item.race.name }} {{ item.class.name }} · {{ item.background.name }}</small>
            </span>
            <span class="alignment-pill">{{ item.alignment }}</span>
          </button>
          <button class="ghost-button" @click="openRecent">View All Characters</button>
        </div>
      </div>

      <div v-else-if="viewMode === 'character' && character" class="character-screen" data-view="character">
        <article class="hero-card ornate-frame">
          <span class="frame-emblem" aria-hidden="true">
            <img src="/static/icons/icon-d20.png" alt="" />
          </span>
          <h2>{{ character.name.full }}</h2>
          <p>{{ character.race.name }} {{ character.class.name }} · {{ character.background.name }} · {{ character.alignment }}</p>
        </article>

        <nav class="action-row" aria-label="Character actions">
          <button @click="showRerollSheet = true">
            <img src="/static/icons/icon-reroll.png" alt="" />
            <span>Reroll</span>
          </button>
          <button @click="rerollStory">
            <img src="/static/icons/icon-story.png" alt="" />
            <span>Story</span>
          </button>
          <button @click="copyCharacter">
            <img src="/static/icons/icon-copy.png" alt="" />
            <span>Copy</span>
          </button>
          <button @click="openExportText">
            <img src="/static/icons/icon-export.png" alt="" />
            <span>Export</span>
          </button>
        </nav>

        <section class="ability-grid">
          <div v-for="key in abilityKeys" :key="key" class="ability-tile">
            <span>{{ key }}</span>
            <strong>{{ character.abilities[key].total }}</strong>
            <i class="stat-divider" aria-hidden="true"></i>
            <em>{{ formatModifier(character.abilities[key].modifier) }}</em>
          </div>
        </section>

        <div class="section-title"><h2>Proficiencies</h2><span></span></div>
        <div class="chip-list">
          <span v-for="item in character.proficiencies" :key="`${item.type}-${item.name}`" class="info-chip">
            <img src="/static/icons/icon-proficiency.png" alt="" />
            {{ item.name }}
          </span>
        </div>

        <div class="section-title"><h2>Gear</h2><span></span></div>
        <div class="chip-list">
          <span v-for="item in character.gear" :key="`${item.category}-${item.name}`" class="info-chip">
            <img src="/static/icons/icon-gear.png" alt="" />
            {{ item.name }}
          </span>
        </div>

        <div class="section-title"><h2>Backstory</h2><span></span></div>
        <article class="story-panel">
          <p v-for="sentence in character.backstory.sentences" :key="sentence">{{ sentence }}</p>
        </article>
      </div>

      <div v-else-if="viewMode === 'exportText' && character" class="export-screen" data-view="export-text">
        <div class="segmented">
          <button class="is-active">Text</button>
          <button @click="viewMode = 'exportPoster'">Poster</button>
        </div>
        <pre class="export-preview">{{ character.exportText }}</pre>
      </div>

      <div v-else-if="viewMode === 'exportPoster' && character" class="export-screen" data-view="export-poster">
        <div class="segmented">
          <button @click="viewMode = 'exportText'">Text</button>
          <button class="is-active">Poster</button>
        </div>
        <article class="poster-preview">
          <img class="poster-emblem" src="/static/icons/icon-d20.png" alt="" />
          <h2>{{ character.name.full }}</h2>
          <strong>{{ character.race.name }} {{ character.class.name }}</strong>
          <span>{{ character.background.name }} · {{ character.alignment }}</span>
          <div class="poster-abilities">
            <span v-for="key in abilityKeys" :key="key">
              <small>{{ key }}</small>
              <b>{{ character.abilities[key].total }}</b>
            </span>
          </div>
          <p>{{ character.backstory.sentences.join(' ') }}</p>
          <small>Seed {{ character.seed }}</small>
        </article>
      </div>

      <div v-else-if="viewMode === 'recent'" class="recent-screen" data-view="recent">
        <div class="search-box">
          <img src="/static/icons/icon-search.png" alt="" />
          <input v-model="searchText" placeholder="Search by name, race, class" />
          <button v-if="recentCharacters.length" aria-label="Clear recent" @click="clearRecent">
            <img src="/static/icons/icon-trash.png" alt="" />
          </button>
        </div>
        <button v-for="item in filteredRecent" :key="item.id" class="recent-row large" @click="openCharacter(item)">
          <span class="avatar">{{ initials(item.name.full) }}</span>
          <span class="recent-copy">
            <strong>{{ item.name.full }}</strong>
            <small>{{ item.race.name }} {{ item.class.name }} · {{ item.background.name }}</small>
          </span>
          <span class="recent-side">
            <span class="alignment-pill">{{ item.alignment }}</span>
            <small class="recent-time">Just now</small>
          </span>
          <span class="row-arrow" aria-hidden="true">›</span>
        </button>
      </div>
    </section>

    <footer v-if="viewMode === 'exportText' && character" class="bottom-bar">
      <button class="primary-fantasy-button compact" @click="copyCharacter">
        <img src="/static/icons/icon-copy.png" alt="" />
        <span>Copy Text</span>
      </button>
      <button class="outline-button" @click="viewMode = 'exportPoster'">Preview Poster</button>
    </footer>

    <footer v-if="viewMode === 'exportPoster' && character" class="bottom-bar">
      <button class="primary-fantasy-button compact" @click="copyCharacter">
        <img src="/static/icons/icon-copy.png" alt="" />
        <span>Copy Text</span>
      </button>
      <button class="outline-button" @click="viewMode = 'exportText'">Back to Text</button>
    </footer>

    <footer v-if="viewMode === 'recent'" class="bottom-bar">
      <button class="primary-fantasy-button compact" @click="forgeCharacter">
        <img src="/static/icons/icon-d20.png" alt="" />
        <span>Generate New</span>
      </button>
    </footer>

    <button v-if="showRerollSheet" class="sheet-backdrop" aria-label="Close reroll panel" @click="showRerollSheet = false"></button>
    <aside v-if="showRerollSheet" class="reroll-sheet" data-view="reroll-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-title-row">
        <h2>Reroll</h2>
        <button aria-label="Close" @click="showRerollSheet = false">×</button>
      </div>
      <button class="reroll-option selected" @click="applyReroll('whole')">
        <img src="/static/icons/icon-d20.png" alt="" />
        <span>
          <strong>Whole character</strong>
          <small>Race, class, stats, gear, story</small>
        </span>
        <i class="radio-dot selected" aria-hidden="true"></i>
      </button>
      <button class="reroll-option" @click="applyReroll('story')">
        <img src="/static/icons/icon-story.png" alt="" />
        <span>
          <strong>Story only</strong>
          <small>Keep numbers and equipment</small>
        </span>
        <i class="radio-dot" aria-hidden="true"></i>
      </button>
      <button class="reroll-option" @click="applyReroll('stats')">
        <img src="/static/icons/icon-stats.png" alt="" />
        <span>
          <strong>Stats only</strong>
          <small>Roll abilities again</small>
        </span>
        <i class="radio-dot" aria-hidden="true"></i>
      </button>
      <button class="reroll-option seed-toggle" @click="copySeed">
        <img src="/static/icons/icon-d20.png" alt="" />
        <span>
          <strong>Keep seed</strong>
          <small>{{ character?.seed || 'Current seed' }}</small>
        </span>
        <i class="switch-track" aria-hidden="true"></i>
      </button>
      <button class="primary-fantasy-button apply-reroll" @click="applyReroll('whole')">
        <img src="/static/icons/icon-d20.png" alt="" />
        <span>Apply Reroll</span>
      </button>
    </aside>

    <div v-if="toast" class="toast">
      <img src="/static/icons/icon-check.png" alt="" />
      <span>{{ toast }}</span>
    </div>
  </main>
</template>

<script>
import { generateCharacter, createSeed, formatModifier } from '../core/generator.js';
import HeroDie from './components/HeroDie.vue';

export default {
  components: {
    HeroDie
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
      return 'DiceForge';
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
      return this.recentCharacters.filter((item) => [item.name.full, item.race.name, item.class.name, item.background.name]
        .join(' ')
        .toLowerCase()
        .includes(query));
    }
  },
  mounted() {
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

      [180, 420, 720].forEach((delay, index) => {
        setTimeout(() => {
          this.generationStepIndex = index + 1;
        }, delay);
      });

      setTimeout(() => {
        this.setCharacter(generateCharacter(createSeed()));
        this.isGenerating = false;
        this.viewMode = 'character';
        this.scrollToTop();
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
      this.scrollToTop();
    },
    openRecent() {
      this.viewMode = 'recent';
      this.scrollToTop();
    },
    openExportText() {
      this.viewMode = 'exportText';
      this.scrollToTop();
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
      this.scrollToTop();
    },
    rerollStory() {
      if (!this.character) return;
      const next = generateCharacter(`${this.character.seed}-story-${Date.now()}`, {
        alignment: this.character.alignment
      });
      this.setCharacter(next);
      this.viewMode = 'character';
      this.scrollToTop();
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
      if (this.viewMode === 'exportPoster') this.viewMode = 'exportText';
      else if (this.viewMode === 'exportText' || this.viewMode === 'recent') this.viewMode = this.character ? 'character' : 'home';
      else this.viewMode = 'home';
      this.scrollToTop();
    },
    scrollToTop() {
      this.$nextTick(() => {
        if (this.$refs.screenScroll) this.$refs.screenScroll.scrollTop = 0;
      });
    },
    initials(name) {
      return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    },
    async copyText(text) {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
    },
    showToast(message) {
      this.toast = message;
      setTimeout(() => {
        this.toast = '';
      }, 1600);
    },
    vibrate() {
      if (navigator.vibrate) navigator.vibrate(30);
    },
    restoreRecent() {
      try {
        this.recentCharacters = JSON.parse(localStorage.getItem('diceforge:recent') || '[]');
      } catch (error) {
        this.recentCharacters = [];
      }
    },
    persistRecent() {
      try {
        localStorage.setItem('diceforge:recent', JSON.stringify(this.recentCharacters));
      } catch (error) {
        // Private browsing or restricted previews may block localStorage writes.
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

body {
  background: #ead8b5;
}

button,
input {
  font: inherit;
}

button {
  padding: 0;
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.app-shell {
  --ink: #171310;
  --muted: #685b4b;
  --wine: #7f1110;
  --wine-dark: #2a0807;
  --gold: #bd8f45;
  --gold-soft: rgba(189, 143, 69, 0.42);
  --paper: #f5ead0;
  position: relative;
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  overflow: hidden;
  color: var(--ink);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  box-shadow: 0 0 0 1px rgba(70, 34, 12, 0.18), 0 24px 80px rgba(70, 34, 12, 0.18);
}

.parchment-texture {
  background:
    radial-gradient(circle at 20% 12%, rgba(255, 255, 255, 0.48), transparent 24%),
    radial-gradient(circle at 80% 30%, rgba(117, 75, 23, 0.11), transparent 30%),
    radial-gradient(circle at 34% 74%, rgba(189, 143, 69, 0.1), transparent 26%),
    repeating-linear-gradient(42deg, rgba(88, 56, 18, 0.025) 0, rgba(88, 56, 18, 0.025) 1px, transparent 1px, transparent 7px),
    linear-gradient(180deg, #f0dfbd 0%, #fff5dd 44%, #f3e4c7 100%);
}

.paper-vignette {
  pointer-events: none;
  position: absolute;
  inset: 76px 0 0;
  z-index: 1;
  background:
    radial-gradient(circle at 50% 15%, transparent 0 34%, rgba(132, 90, 31, 0.05) 58%, rgba(93, 57, 19, 0.12) 100%),
    linear-gradient(90deg, rgba(86, 48, 12, 0.16), transparent 9%, transparent 91%, rgba(86, 48, 12, 0.16));
  mix-blend-mode: multiply;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 76px;
  padding: 16px 24px 13px;
  color: #fff6dd;
  background:
    radial-gradient(circle at 50% -34%, rgba(196, 44, 23, 0.62), transparent 42%),
    linear-gradient(115deg, #7a1510 0%, #2a0706 100%);
  border-bottom: 2px solid var(--gold);
  box-shadow: inset 0 -1px 0 rgba(255, 231, 167, 0.35), 0 3px 10px rgba(55, 18, 7, 0.24);
}

.ornate-top-bar::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  height: 5px;
  background: linear-gradient(90deg, transparent 0 47%, var(--gold) 47% 53%, transparent 53% 100%);
}

.header-notch {
  position: sticky;
  top: 76px;
  z-index: 6;
  width: 18px;
  height: 18px;
  margin: -9px auto 0;
  background: linear-gradient(135deg, var(--gold) 0 48%, transparent 49%), linear-gradient(225deg, var(--gold) 0 48%, transparent 49%);
  transform: rotate(45deg);
}

.brand-block {
  flex: 1;
  min-width: 0;
}

.top-bar:has(.icon-button) .brand-block {
  text-align: center;
}

.brand-block h1,
.brand-block p,
.hero-card h2,
.hero-card p,
.section-title h2,
.poster-preview h2,
.poster-preview p {
  margin: 0;
}

.brand-block h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: 0;
}

.brand-block p {
  margin-top: 7px;
  color: #d0a352;
  font-size: 14px;
  font-weight: 800;
}

.icon-button,
.seed-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1.5px solid var(--gold);
  border-radius: 10px;
  background: rgba(91, 12, 10, 0.4);
}

.seed-chip {
  width: auto;
  min-width: 78px;
  padding: 0 12px;
  color: #e1b968;
  font-size: 14px;
  font-weight: 900;
  border-radius: 999px;
}

.icon-button img,
.primary-fantasy-button img,
.action-row img,
.info-chip img,
.progress-row img,
.search-box img,
.reroll-option img,
.toast img {
  width: 25px;
  height: 25px;
  object-fit: contain;
}

.screen-scroll {
  position: relative;
  z-index: 2;
  height: calc(100vh - 76px);
  overflow-y: auto;
  padding: 20px 18px 110px;
  transition: filter 180ms ease;
}

.screen-scroll.is-dimmed {
  filter: brightness(0.42);
}

.home-screen {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.primary-fantasy-button,
.outline-button,
.ghost-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  min-height: 74px;
  border-radius: 14px;
  font-weight: 900;
}

.primary-fantasy-button {
  color: #fff8ea;
  background:
    radial-gradient(circle at 28% 18%, rgba(255, 230, 160, 0.14), transparent 30%),
    linear-gradient(145deg, #a82019, #4a0d0a);
  border: 3px solid #29100a;
  outline: 2px solid var(--gold);
  outline-offset: -7px;
  clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
  box-shadow: 0 8px 0 rgba(72, 37, 10, 0.3), 0 12px 18px rgba(74, 21, 21, 0.3);
  font-size: 25px;
}

.primary-fantasy-button.compact {
  flex: 1;
  min-height: 64px;
  font-size: 20px;
}

.outline-button,
.ghost-button {
  min-height: 54px;
  color: #7b571e;
  border: 1.5px solid var(--gold);
  background: rgba(255, 248, 234, 0.74);
}

.progress-panel,
.story-panel,
.export-preview,
.poster-preview,
.recent-row,
.search-box {
  background: rgba(255, 250, 235, 0.68);
  border: 1.5px solid rgba(164, 122, 59, 0.38);
  border-radius: 10px;
  box-shadow: inset 0 0 22px rgba(126, 80, 25, 0.04);
}

.progress-panel {
  margin: 24px 0 0;
  padding: 16px 20px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 36px;
  font-size: 15px;
  font-weight: 800;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 58px 0 22px;
}

.section-title h2 {
  font-size: 24px;
  line-height: 1;
  font-weight: 900;
}

.section-title span {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--gold), rgba(189, 143, 69, 0.1));
}

.section-title span::after,
.empty-copy::before,
.empty-copy::after {
  content: "";
  display: block;
  width: 9px;
  height: 9px;
  border: 1.5px solid var(--gold);
  transform: rotate(45deg);
}

.section-title span::after {
  margin-left: auto;
  margin-top: -4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 30px 12px 8px;
  color: var(--muted);
}

.empty-state img {
  width: 108px;
  height: 108px;
  opacity: 0.48;
}

.empty-state strong {
  color: var(--ink);
  font-size: 27px;
  line-height: 1.1;
  font-weight: 900;
}

.empty-copy {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  font-style: italic;
}

.hero-card {
  position: relative;
  padding: 68px 18px 34px;
  text-align: center;
  color: var(--ink);
  background: transparent;
  border-radius: 0;
}

.ornate-frame {
  border: 1.5px solid var(--gold-soft);
  box-shadow: inset 0 0 0 1px rgba(189, 143, 69, 0.16);
}

.ornate-frame::before,
.ornate-frame::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.ornate-frame::before { top: 38px; }
.ornate-frame::after { bottom: 20px; }

.frame-emblem {
  position: absolute;
  top: 14px;
  left: 50%;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--gold);
  border-radius: 50%;
  background: var(--paper);
  transform: translateX(-50%);
}

.frame-emblem img {
  width: 30px;
  height: 30px;
}

.hero-card h2 {
  font-size: 48px;
  line-height: 1.02;
  font-weight: 900;
  letter-spacing: 0;
}

.hero-card p {
  margin-top: 15px;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.25;
  font-weight: 800;
}

.action-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin: 22px 18px 24px;
  padding: 16px 0;
  border-top: 1px solid var(--gold-soft);
  border-bottom: 1px solid var(--gold-soft);
}

.action-row button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  color: #851614;
  border-right: 1px solid var(--gold-soft);
  font-size: 15px;
  font-weight: 900;
}

.action-row button:last-child {
  border-right: 0;
}

.ability-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 0 18px;
}

.ability-tile {
  position: relative;
  min-height: 134px;
  padding: 17px 10px 13px;
  text-align: center;
  background: rgba(255, 250, 235, 0.48);
  border: 1.5px solid var(--gold-soft);
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
}

.ability-tile::before,
.ability-tile::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--gold);
}

.ability-tile::before {
  top: 5px;
  left: 5px;
  border-top: 1.5px solid;
  border-left: 1.5px solid;
}

.ability-tile::after {
  right: 5px;
  bottom: 5px;
  border-right: 1.5px solid;
  border-bottom: 1.5px solid;
}

.ability-tile span,
.ability-tile em,
.ability-tile strong {
  display: block;
}

.ability-tile span {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 4px;
}

.ability-tile strong {
  margin-top: 8px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 48px;
  line-height: 1;
  font-weight: 900;
}

.stat-divider {
  display: block;
  width: 74px;
  height: 1px;
  margin: 10px auto 7px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.stat-divider::after {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  margin: -4px auto 0;
  border: 1px solid var(--gold);
  background: var(--paper);
  transform: rotate(45deg);
}

.ability-tile em {
  color: #8f1614;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 26px;
  font-style: normal;
  font-weight: 900;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(164, 122, 59, 0.35);
  border-radius: 8px;
  background: rgba(255, 248, 234, 0.55);
  font-size: 15px;
  font-weight: 800;
}

.story-panel {
  padding: 18px;
}

.story-panel p {
  margin: 0 0 12px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  line-height: 1.5;
}

.segmented {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 16px;
  padding: 4px;
  border: 1px solid rgba(164, 122, 59, 0.28);
  border-radius: 10px;
  background: rgba(255, 248, 234, 0.58);
}

.segmented button {
  min-height: 44px;
  border-radius: 7px;
  color: var(--muted);
  font-size: 15px;
  font-weight: 900;
}

.segmented .is-active {
  color: #7a1917;
  background: #fff8ea;
  box-shadow: 0 2px 8px rgba(25, 21, 18, 0.12);
}

.export-preview {
  min-height: 540px;
  margin: 0;
  padding: 20px;
  overflow: auto;
  white-space: pre-wrap;
  font: 13px/1.55 "Courier New", monospace;
}

.poster-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 540px;
  padding: 24px 16px;
  text-align: center;
}

.poster-emblem {
  width: 62px;
  height: 62px;
}

.poster-preview h2 {
  margin-top: 13px;
  font-size: 38px;
  line-height: 1.08;
}

.poster-preview strong {
  margin-top: 9px;
  color: #7a1917;
  font-size: 18px;
}

.poster-preview span,
.poster-preview small {
  margin-top: 8px;
  color: var(--muted);
  font-size: 13px;
}

.poster-abilities {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  margin: 22px 0;
  padding: 12px 0;
  border-top: 1px solid rgba(164, 122, 59, 0.35);
  border-bottom: 1px solid rgba(164, 122, 59, 0.35);
}

.poster-abilities span {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  color: var(--ink);
  font-weight: 800;
}

.poster-preview p {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  line-height: 1.48;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 13px;
  height: 64px;
  padding: 0 17px;
  margin-bottom: 18px;
  border-radius: 10px;
}

.search-box img {
  width: 28px;
  height: 28px;
}

.search-box input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: 0;
  color: var(--muted);
  font-size: 17px;
}

.recent-preview {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.recent-preview .recent-row {
  margin-bottom: 0;
}

.recent-preview .ghost-button {
  align-self: stretch;
  width: 100%;
  margin-top: 2px;
  background: rgba(255, 248, 234, 0.78);
}

.recent-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 78px;
  padding: 14px;
  margin-bottom: 11px;
  text-align: left;
  border-radius: 9px;
}

.recent-row.large {
  min-height: 78px;
}

.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  color: #7a1917;
  border: 1.5px solid var(--gold-soft);
  border-radius: 50%;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
  font-weight: 900;
}

.avatar::before,
.avatar::after {
  content: "";
  position: absolute;
  left: calc(50% - 4px);
  width: 8px;
  height: 8px;
  border: 1px solid var(--gold);
  background: var(--paper);
  transform: rotate(45deg);
}

.avatar::before { top: -4px; }
.avatar::after { bottom: -4px; }

.recent-copy {
  flex: 1;
  min-width: 0;
}

.recent-copy strong,
.recent-copy small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-copy strong {
  font-size: 18px;
  font-weight: 900;
}

.recent-copy small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 14px;
}

.alignment-pill {
  flex: 0 1 auto;
  max-width: 98px;
  padding: 5px 8px;
  overflow: hidden;
  color: #36582d;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: rgba(105, 145, 92, 0.18);
  border: 1px solid rgba(79, 126, 69, 0.45);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
}

.recent-side {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
  max-width: 104px;
}

.recent-side .alignment-pill {
  max-width: 104px;
}

.recent-time {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.row-arrow {
  flex: 0 0 auto;
  color: var(--ink);
  font-size: 34px;
  line-height: 1;
}

.bottom-bar {
  position: fixed;
  left: 50%;
  right: auto;
  bottom: 0;
  z-index: 8;
  display: flex;
  gap: 12px;
  width: min(430px, 100vw);
  padding: 16px 24px 24px;
  background: linear-gradient(180deg, rgba(243, 231, 207, 0.05), #f3e3c2 28%);
  transform: translateX(-50%);
}

.bottom-bar .outline-button {
  flex: 1;
  min-height: 62px;
  font-size: 15px;
}

.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.58);
}

.reroll-sheet {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 10;
  width: min(430px, 100vw);
  padding: 14px 26px 24px;
  background:
    radial-gradient(circle at 50% 0, rgba(255, 255, 255, 0.72), transparent 36%),
    linear-gradient(180deg, #fff8e8, #f3e4c7);
  border-radius: 26px 26px 0 0;
  box-shadow: 0 -20px 44px rgba(20, 8, 4, 0.34);
  transform: translateX(-50%);
}

.sheet-handle {
  width: 46px;
  height: 4px;
  margin: 0 auto 18px;
  background: rgba(109, 98, 87, 0.42);
  border-radius: 999px;
}

.sheet-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 18px;
}

.sheet-title-row h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
}

.sheet-title-row button {
  position: absolute;
  right: 0;
  color: #514233;
  font-size: 38px;
}

.reroll-option {
  display: flex;
  align-items: center;
  gap: 17px;
  width: 100%;
  min-height: 72px;
  padding: 12px 14px;
  margin-bottom: 10px;
  text-align: left;
  border: 1px solid rgba(164, 122, 59, 0.22);
  border-radius: 10px;
  background: rgba(255, 250, 236, 0.68);
}

.reroll-option.selected {
  border-color: var(--gold);
  box-shadow: inset 0 0 0 1px rgba(122, 25, 23, 0.15);
}

.reroll-option span {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.reroll-option strong {
  font-size: 18px;
  font-weight: 900;
}

.reroll-option small {
  margin-top: 7px;
  color: var(--muted);
  font-size: 14px;
}

.radio-dot {
  display: block;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  border: 2px solid rgba(91, 75, 55, 0.5);
  border-radius: 50%;
}

.radio-dot.selected {
  border: 3px solid #8a1714;
  box-shadow: inset 0 0 0 5px #fff8ea, inset 0 0 0 12px #8a1714;
}

.seed-toggle .switch-track {
  display: block;
  width: 58px;
  height: 32px;
  flex: 0 0 auto;
  border: 1px solid rgba(91, 75, 55, 0.35);
  border-radius: 999px;
  background: #e0d9cd;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.18);
}

.seed-toggle .switch-track::before {
  content: "";
  display: block;
  width: 28px;
  height: 28px;
  margin: 1px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.24);
}

.apply-reroll {
  width: 100%;
  margin-top: 14px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 92px;
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  color: #fff8ea;
  background: rgba(25, 21, 18, 0.92);
  border-radius: 9px;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 800;
}

@media (max-width: 360px) {
  .screen-scroll {
    padding-inline: 14px;
  }

  .hero-die {
    width: 292px;
    height: 292px;
  }

  .hero-card h2 {
    font-size: 40px;
  }

  .ability-grid {
    gap: 10px;
    margin-inline: 6px;
  }

  .action-row {
    margin-inline: 6px;
  }
}
</style>
