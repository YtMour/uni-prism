<template>
	<view class="screen">
		<view class="topbar">
			<button class="icon-button" :aria-label="canGoBack ? t('common.back') : t('common.settings')" @click="handleTopLeft">
				<text>{{ canGoBack ? '‹' : '⌘' }}</text>
			</button>
			<view class="brand">
				<image class="brand-icon" src="/static/ratelens-app-icon.png" mode="aspectFill" />
				<text class="brand-title">RateLens</text>
			</view>
			<button class="icon-button" :aria-label="t('common.refreshRates')" @click="refreshRates">↻</button>
		</view>

		<view v-if="activeTab === 'home'" class="panel-stack">
			<view class="amount-card">
				<view class="amount-copy">
					<input class="amount-input" type="digit" v-model="amountText" @input="recalculate" />
					<text class="amount-label">{{ t('home.from') }} · {{ currencyName(baseCurrency.code) }}</text>
				</view>
				<button class="currency-pill" @click="cycleBaseCurrency">
					<text class="currency-mark">{{ baseCurrency.symbol }}</text>
					<text>{{ baseCurrency.code }}</text>
					<text class="chevron">⌄</text>
				</button>
			</view>
			<view v-if="basePickerOpen" class="currency-menu">
				<button
					v-for="currency in currencies"
					:key="currency.code"
					class="currency-option"
					:class="{ selected: currency.code === baseCurrency.code }"
					@click="selectBaseCurrency(currency.code)"
				>
					<text class="currency-badge small" :class="currency.tone">{{ currency.symbol }}</text>
					<view class="setting-copy">
						<text class="rate-code">{{ currency.code }}</text>
						<text class="rate-name">{{ currencyName(currency.code) }}</text>
					</view>
				</button>
			</view>

			<view class="quick-row">
				<button v-for="value in quickAmounts" :key="value" @click="setAmount(value)">{{ value }}</button>
			</view>

			<view class="convert-panel">
				<button class="swap-button" :aria-label="t('home.swapCurrencies')" @click="swapCurrencies">⇅</button>
				<button class="target-row" @click="toggleTargetPicker">
					<view class="rate-left">
						<view class="currency-badge" :class="targetCurrency.tone">{{ targetCurrency.symbol }}</view>
						<view>
							<text class="summary-label">{{ t('home.to') }}</text>
							<text class="rate-code">{{ targetCurrency.code }} {{ currencyName(targetCurrency.code) }}</text>
						</view>
					</view>
					<text class="chevron">⌄</text>
				</button>
				<view v-if="targetPickerOpen" class="currency-menu">
					<button
						v-for="currency in currencies"
						:key="currency.code"
						class="currency-option"
						:class="{ selected: currency.code === targetCurrency.code }"
						@click="selectTargetCurrency(currency.code)"
					>
						<text class="currency-badge small" :class="currency.tone">{{ currency.symbol }}</text>
						<view class="setting-copy">
							<text class="rate-code">{{ currency.code }}</text>
							<text class="rate-name">{{ currencyName(currency.code) }}</text>
						</view>
					</button>
				</view>
				<view class="result-card">
					<text class="summary-label">{{ t('home.convertedAmount') }}</text>
					<text class="result-value">{{ convertedTargetAmount }}</text>
				</view>
			</view>

			<view class="cache-card">
				<view class="cache-icon">☁</view>
				<view class="cache-copy">
					<text class="cache-title">{{ isOnline ? t('home.ratesReady') : t('home.usingCached') }}</text>
					<text class="cache-subtitle">{{ t('common.updated') }} {{ updatedAt }}</text>
				</view>
				<button class="status-pill" @click="isOnline = !isOnline">
					<view class="live-dot" :class="{ muted: !isOnline }" />
					<text>{{ isOnline ? t('common.live') : t('common.offline') }}</text>
				</button>
			</view>
		</view>

		<view v-else-if="activeTab === 'travel'" class="panel-stack">
			<view class="section-heading">
				<text class="eyebrow">{{ t('travel.eyebrow') }}</text>
				<text class="section-title">{{ t('travel.title') }}</text>
			</view>

			<view class="amount-card compact">
				<view class="amount-copy">
					<input class="amount-input small" type="digit" v-model="billText" @input="recalculate" />
					<text class="amount-label">{{ currencyName(travelCurrency.code) }}</text>
				</view>
				<button class="currency-pill" @click="toggleTravelPicker">
					<text class="currency-mark" :class="travelCurrency.tone">{{ travelCurrency.symbol }}</text>
					<text>{{ travelCurrency.code }}</text>
					<text class="chevron">⌄</text>
				</button>
			</view>
			<view v-if="travelPickerOpen" class="currency-menu">
				<button
					v-for="currency in currencies"
					:key="currency.code"
					class="currency-option"
					:class="{ selected: currency.code === travelCurrency.code }"
					@click="selectTravelCurrency(currency.code)"
				>
					<text class="currency-badge small" :class="currency.tone">{{ currency.symbol }}</text>
					<view class="setting-copy">
						<text class="rate-code">{{ currency.code }}</text>
						<text class="rate-name">{{ currencyName(currency.code) }}</text>
					</view>
				</button>
			</view>

			<view class="control-card">
				<view class="control-row">
					<text>{{ t('travel.tax') }}</text>
					<view class="stepper">
						<button @click="changeTax(-1)">−</button>
						<text>{{ taxRate }}%</text>
						<button @click="changeTax(1)">+</button>
					</view>
				</view>
				<view class="control-row">
					<text>{{ t('travel.tip') }}</text>
					<view class="segments">
						<button v-for="tip in tipOptions" :key="tip" :class="{ selected: tipRate === tip }" @click="tipRate = tip">
							{{ tip }}%
						</button>
					</view>
				</view>
				<view class="control-row">
					<text>{{ t('travel.split') }}</text>
					<view class="stepper wide">
						<button @click="changePeople(-1)">−</button>
						<text>{{ people }} {{ t('travel.people') }}</text>
						<button @click="changePeople(1)">+</button>
					</view>
				</view>
			</view>

			<view class="summary-card">
				<view>
					<text class="summary-label">{{ t('travel.total') }}</text>
					<text class="summary-value">{{ formatTravelCurrency(travelTotal) }}</text>
				</view>
				<view>
					<text class="summary-label">{{ t('travel.each') }}</text>
					<text class="summary-value green">{{ formatTravelCurrency(eachTotal) }}</text>
				</view>
				<view class="home-cost">
					<text>{{ travelHomeCostText }}</text>
				</view>
			</view>
		</view>

		<view v-else class="panel-stack">
			<view class="section-heading">
				<text class="eyebrow">{{ settingsEyebrow }}</text>
				<text class="section-title">{{ settingsTitle }}</text>
			</view>

			<view v-if="settingsMode === 'homeCurrency'" class="settings-card">
				<button class="back-row" @click="settingsMode = 'main'">
					<text class="chevron">‹</text>
					<text>{{ t('legal.backToSettings') }}</text>
				</button>
				<button
					v-for="currency in currencies"
					:key="currency.code"
					class="setting-row"
					@click="selectSettingsBaseCurrency(currency.code)"
				>
					<view class="currency-badge small" :class="currency.tone">{{ currency.symbol }}</view>
					<view class="setting-copy">
						<text class="setting-label">{{ currency.code }} {{ currencyName(currency.code) }}</text>
						<text class="setting-value">{{ currency.code === baseCurrency.code ? t('settings.selected') : t('settings.notSelected') }}</text>
					</view>
					<text class="choice-mark">{{ currency.code === baseCurrency.code ? '✓' : '' }}</text>
				</button>
			</view>

			<view v-else-if="settingsMode === 'watchedCurrencies'" class="settings-card">
				<button class="back-row" @click="settingsMode = 'main'">
					<text class="chevron">‹</text>
					<text>{{ t('legal.backToSettings') }}</text>
				</button>
				<button
					v-for="currency in currencies"
					:key="currency.code"
					class="setting-row"
					@click="toggleWatchedCurrency(currency.code)"
				>
					<view class="currency-badge small" :class="currency.tone">{{ currency.symbol }}</view>
					<view class="setting-copy">
						<text class="setting-label">{{ currency.code }} {{ currencyName(currency.code) }}</text>
						<text class="setting-value">{{ watchedCurrencyCodes.includes(currency.code) ? t('settings.selected') : t('settings.notSelected') }}</text>
					</view>
					<text class="choice-mark">{{ watchedCurrencyCodes.includes(currency.code) ? '✓' : '' }}</text>
				</button>
			</view>

			<view v-else-if="settingsMode === 'language'" class="settings-card">
				<button class="back-row" @click="settingsMode = 'main'">
					<text class="chevron">‹</text>
					<text>{{ t('legal.backToSettings') }}</text>
				</button>
				<button
					v-for="language in supportedLocales"
					:key="language.code"
					class="setting-row"
					@click="selectLanguage(language.code)"
				>
					<view class="setting-copy">
						<text class="setting-label">{{ t(language.labelKey) }}</text>
						<text class="setting-value">{{ language.code }}</text>
					</view>
					<text class="choice-mark">{{ language.code === locale ? '✓' : '' }}</text>
				</button>
			</view>

			<view v-else-if="legalDetail" class="legal-card">
				<button class="back-row" @click="settingsMode = 'main'; legalView = ''">
					<text class="chevron">‹</text>
					<text>{{ t('legal.backToSettings') }}</text>
				</button>
				<view class="legal-section" v-for="section in legalDetail.sections" :key="section.heading">
					<text class="legal-heading">{{ section.heading }}</text>
					<text class="legal-body">{{ section.body }}</text>
				</view>
				<view class="legal-note">
					<text>{{ legalDetail.updated }}</text>
				</view>
			</view>

			<view v-else class="settings-card">
				<button v-for="setting in settings" :key="setting.label" class="setting-row" @click="handleSetting(setting)">
					<view class="setting-copy">
						<text class="setting-label">{{ setting.label }}</text>
						<text class="setting-value">{{ setting.value }}</text>
					</view>
					<view v-if="setting.toggle" class="switch" :class="{ on: isOnline }"><view /></view>
					<text v-else class="chevron">›</text>
				</button>
			</view>

			<view class="privacy-card">
				<view class="cache-icon">◌</view>
				<view>
					<text class="cache-title">{{ t('settings.localFirstTitle') }}</text>
					<text class="cache-subtitle">{{ t('settings.localFirstBody') }}</text>
				</view>
			</view>
		</view>

		<view class="tabbar">
			<button
				v-for="tab in tabs"
				:key="tab.key"
				class="tab-item"
				:class="{ active: activeTab === tab.key }"
				@click="setTab(tab.key)"
			>
				<text class="tab-icon">{{ tab.icon }}</text>
				<text>{{ t(tab.labelKey) }}</text>
			</button>
		</view>
	</view>
</template>

<script>
import { calculateTravelBill } from '../../core/travel.js'
import { convertAmount, DEFAULT_CURRENCIES, DEFAULT_RATE_TABLE, parseAmountInput } from '../../core/currency.js'
import { formatCurrency, formatNumber } from '../../core/format.js'
import { getMessage, interpolate, supportedLocales } from '../../i18n/index.js'

const currencies = DEFAULT_CURRENCIES

export default {
	data() {
		return {
			activeTab: 'home',
			locale: 'en-US',
			settingsMode: 'main',
			legalView: '',
			amountText: '1000',
			billText: '18600',
			baseIndex: 0,
			watchedCurrencyCodes: ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'HKD'],
			targetCurrencyCode: 'EUR',
			travelCurrencyCode: 'JPY',
			basePickerOpen: false,
			targetPickerOpen: false,
			travelPickerOpen: false,
			updatedAt: '09:42',
			isOnline: true,
			taxRate: 10,
			tipRate: 15,
			people: 3,
			quickAmounts: ['100', '500', '1000', '2500'],
			tipOptions: [10, 15, 20],
			tabs: [
				{ key: 'home', labelKey: 'nav.convert', icon: '⌂' },
				{ key: 'travel', labelKey: 'nav.travel', icon: '◫' },
				{ key: 'settings', labelKey: 'nav.more', icon: '•••' }
			]
		}
	},
	computed: {
		baseCurrency() {
			return currencies[this.baseIndex]
		},
		currencies() {
			return currencies
		},
		travelCurrency() {
			return currencies.find((currency) => currency.code === this.travelCurrencyCode) || currencies[0]
		},
		targetCurrency() {
			return currencies.find((currency) => currency.code === this.targetCurrencyCode) || currencies[1]
		},
		visibleRates() {
			return currencies.filter((currency) => currency.code !== this.baseCurrency.code && this.watchedCurrencyCodes.includes(currency.code))
		},
		amount() {
			return parseAmountInput(this.amountText)
		},
		bill() {
			return parseAmountInput(this.billText)
		},
		travelBill() {
			return calculateTravelBill({
				subtotal: this.bill,
				currency: this.travelCurrency.code,
				homeCurrency: 'CNY',
				taxRate: this.taxRate,
				tipRate: this.tipRate,
				peopleCount: this.people,
				rateTable: DEFAULT_RATE_TABLE
			})
		},
		travelTotal() {
			return this.travelBill.totalForeign
		},
		eachTotal() {
			return this.travelBill.perPersonForeign
		},
		cnyEach() {
			return this.formatNumber(this.travelBill.perPersonHome)
		},
		travelHomeCostText() {
			return interpolate(this.t('travel.approxHome'), { amount: this.cnyEach })
		},
		convertedTargetAmount() {
			return this.formatConverted(this.targetCurrency.code)
		},
		settings() {
			return [
				{ label: this.t('settings.homeCurrency'), value: this.baseCurrency.code + ' ' + this.currencyName(this.baseCurrency.code), mode: 'homeCurrency' },
				{ label: this.t('settings.watchedCurrencies'), value: this.visibleRates.map((rate) => rate.code).join(', '), mode: 'watchedCurrencies' },
				{ label: this.t('settings.language'), value: this.currentLanguageLabel, mode: 'language' },
				{ label: this.t('settings.offlineRates'), value: this.isOnline ? this.t('settings.liveRefresh') : this.t('settings.cachedRates'), toggle: true },
				{ label: this.t('settings.appearance'), value: this.t('settings.appearanceSystem') },
				{ label: this.t('settings.privacyPolicy'), value: this.t('settings.privacySummary'), view: 'privacy' },
				{ label: this.t('settings.disclaimer'), value: this.t('settings.disclaimerSummary'), view: 'disclaimer' }
			]
		},
		currentLanguageLabel() {
			const language = supportedLocales.find((item) => item.code === this.locale) || supportedLocales[0]
			return this.t(language.labelKey)
		},
		legalDocuments() {
			return {
				privacy: {
					title: this.t('legal.privacy.title'),
					updated: this.t('legal.updated'),
					sections: this.t('legal.privacy.sections')
				},
				disclaimer: {
					title: this.t('legal.disclaimer.title'),
					updated: this.t('legal.updated'),
					sections: this.t('legal.disclaimer.sections')
				}
			}
		},
		legalDetail() {
			return this.legalDocuments[this.legalView] || null
		},
		settingsEyebrow() {
			return this.legalDetail ? this.t('legal.eyebrow') : this.t('settings.eyebrow')
		},
		settingsTitle() {
			if (this.legalDetail) {
				return this.legalDetail.title
			}
			if (this.settingsMode === 'homeCurrency') {
				return this.t('settings.selectHomeCurrency')
			}
			if (this.settingsMode === 'watchedCurrencies') {
				return this.t('settings.selectWatchedCurrencies')
			}
			if (this.settingsMode === 'language') {
				return this.t('settings.selectLanguage')
			}
			return this.t('settings.title')
		},
		supportedLocales() {
			return supportedLocales
		},
		canGoBack() {
			return this.activeTab !== 'home' || this.settingsMode !== 'main' || !!this.legalView
		}
	},
	methods: {
		t(key) {
			return getMessage(this.locale, key)
		},
		currencyName(code) {
			return this.t(`currencies.${code}`)
		},
		handleTopLeft() {
			if (this.activeTab === 'settings' && (this.legalView || this.settingsMode !== 'main')) {
				this.legalView = ''
				this.settingsMode = 'main'
				this.activeTab = 'settings'
				return
			}

			if (this.activeTab !== 'home') {
				this.setTab('home')
				return
			}

			this.setTab('settings')
		},
		setTab(tab) {
			this.activeTab = tab
			this.basePickerOpen = false
			this.targetPickerOpen = false
			this.travelPickerOpen = false
			if (tab !== 'settings') {
				this.legalView = ''
				this.settingsMode = 'main'
			}
		},
		setAmount(value) {
			this.amountText = value
		},
		cycleBaseCurrency() {
			this.basePickerOpen = !this.basePickerOpen
			this.targetPickerOpen = false
			this.travelPickerOpen = false
		},
		toggleTargetPicker() {
			this.targetPickerOpen = !this.targetPickerOpen
			this.basePickerOpen = false
			this.travelPickerOpen = false
		},
		toggleTravelPicker() {
			this.travelPickerOpen = !this.travelPickerOpen
			this.basePickerOpen = false
			this.targetPickerOpen = false
		},
		selectBaseCurrency(code) {
			this.focusCurrency(code)
			if (code === this.targetCurrencyCode) {
				this.targetCurrencyCode = this.firstDifferentCurrency(code)
			}
			this.basePickerOpen = false
		},
		selectSettingsBaseCurrency(code) {
			this.focusCurrency(code)
			this.settingsMode = 'main'
		},
		selectTravelCurrency(code) {
			this.travelCurrencyCode = code
			this.travelPickerOpen = false
		},
		selectTargetCurrency(code) {
			if (code === this.baseCurrency.code) {
				this.swapCurrencies()
			} else {
				this.targetCurrencyCode = code
			}
			this.targetPickerOpen = false
		},
		swapCurrencies() {
			const oldBase = this.baseCurrency.code
			this.focusCurrency(this.targetCurrency.code)
			this.targetCurrencyCode = oldBase
			this.basePickerOpen = false
			this.targetPickerOpen = false
		},
		firstDifferentCurrency(code) {
			const fallback = currencies.find((currency) => currency.code !== code)
			return fallback ? fallback.code : code
		},
		toggleWatchedCurrency(code) {
			if (this.watchedCurrencyCodes.includes(code)) {
				if (this.watchedCurrencyCodes.length <= 1) {
					return
				}
				this.watchedCurrencyCodes = this.watchedCurrencyCodes.filter((item) => item !== code)
				return
			}
			this.watchedCurrencyCodes = [...this.watchedCurrencyCodes, code]
		},
		selectLanguage(code) {
			if (supportedLocales.some((item) => item.code === code)) {
				this.locale = code
				this.settingsMode = 'main'
			}
		},
		focusCurrency(code) {
			const index = currencies.findIndex((currency) => currency.code === code)
			if (index >= 0) {
				this.baseIndex = index
			}
		},
		formatConverted(code) {
			const converted = convertAmount(this.amount, this.baseCurrency.code, code, DEFAULT_RATE_TABLE)
			return formatCurrency(converted, code, this.locale)
		},
		formatTravelCurrency(value) {
			return formatCurrency(value, this.travelCurrency.code, this.locale)
		},
		formatNumber(value) {
			return formatNumber(value, this.locale)
		},
		refreshRates() {
			this.basePickerOpen = false
			this.targetPickerOpen = false
			this.travelPickerOpen = false
			const now = new Date()
			this.updatedAt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
			this.isOnline = true
		},
		changeTax(delta) {
			this.taxRate = Math.min(25, Math.max(0, this.taxRate + delta))
		},
		changePeople(delta) {
			this.people = Math.min(12, Math.max(1, this.people + delta))
		},
		handleSetting(setting) {
			if (setting.toggle) {
				this.isOnline = !this.isOnline
			} else if (setting.mode) {
				this.settingsMode = setting.mode
			} else if (setting.view) {
				this.legalView = setting.view
				this.settingsMode = 'legal'
			}
		},
		recalculate() {}
	}
}
</script>

<style scoped>
.screen {
	min-height: 100vh;
	padding: calc(var(--status-bar-height, 0px) + 28rpx) 28rpx 168rpx;
	background:
		radial-gradient(circle at 20% 0%, rgba(46, 90, 68, 0.08), transparent 32%),
		linear-gradient(180deg, #fbf9f5 0%, #f3f1eb 100%);
	color: #1c2d42;
}

.topbar,
.rate-left,
.rate-value-wrap,
.cache-card,
.control-row,
.setting-row,
.privacy-card,
.tabbar,
.brand,
.currency-pill,
.quick-row,
.status-pill {
	display: flex;
	align-items: center;
}

.topbar {
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.brand {
	gap: 14rpx;
}

.brand-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 14rpx;
	box-shadow: 0 8rpx 22rpx rgba(28, 45, 66, 0.12);
}

.brand-title {
	font-family: Georgia, "Times New Roman", serif;
	font-size: 52rpx;
	font-weight: 600;
	color: #2e5a44;
}

.icon-button {
	width: 70rpx;
	height: 70rpx;
	border: 2rpx solid rgba(28, 45, 66, 0.24);
	border-radius: 50%;
	color: #1c2d42;
	font-size: 34rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.panel-stack {
	display: flex;
	flex-direction: column;
	gap: 28rpx;
}

.amount-card,
.rate-card,
.target-row,
.result-card,
.cache-card,
.control-card,
.summary-card,
.settings-card,
.privacy-card {
	border: 1rpx solid rgba(28, 45, 66, 0.13);
	background: rgba(255, 255, 252, 0.76);
	box-shadow: 0 18rpx 42rpx rgba(28, 45, 66, 0.09);
	backdrop-filter: blur(18rpx);
}

.amount-card {
	min-height: 232rpx;
	padding: 36rpx 30rpx;
	border-radius: 28rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 22rpx;
}

.amount-card.compact {
	min-height: 188rpx;
}

.amount-copy {
	flex: 1;
	min-width: 0;
}

.amount-input {
	width: 100%;
	height: 112rpx;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 96rpx;
	line-height: 1;
	color: #10243a;
}

.amount-input.small {
	height: 84rpx;
	font-size: 72rpx;
}

.amount-label,
.rate-name,
.cache-subtitle,
.summary-label,
.setting-value {
	display: block;
	color: rgba(28, 45, 66, 0.64);
}

.amount-label {
	margin-top: 10rpx;
	font-size: 30rpx;
}

.currency-pill {
	flex-shrink: 0;
	gap: 14rpx;
	padding: 18rpx 20rpx;
	border: 1rpx solid rgba(28, 45, 66, 0.16);
	border-radius: 18rpx;
	background: rgba(251, 249, 245, 0.8);
	color: #1c2d42;
	font-size: 32rpx;
	font-weight: 700;
}

.quick-row {
	gap: 14rpx;
}

.quick-row button {
	flex: 1;
	height: 64rpx;
	border-radius: 18rpx;
	background: rgba(46, 90, 68, 0.09);
	color: #2e5a44;
	font-size: 24rpx;
	font-weight: 650;
}

.currency-menu {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14rpx;
	padding: 18rpx;
	border: 1rpx solid rgba(28, 45, 66, 0.13);
	border-radius: 24rpx;
	background: rgba(255, 255, 252, 0.82);
	box-shadow: 0 18rpx 42rpx rgba(28, 45, 66, 0.08);
	backdrop-filter: blur(18rpx);
}

.currency-option {
	min-width: 0;
	min-height: 92rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 14rpx;
	border: 1rpx solid rgba(28, 45, 66, 0.1);
	border-radius: 18rpx;
	color: #1c2d42;
	text-align: left;
}

.currency-option.selected {
	border-color: rgba(46, 90, 68, 0.45);
	background: rgba(46, 90, 68, 0.09);
}

.currency-mark,
.currency-badge {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fbf9f5;
	background: #2e5a44;
}

.currency-badge.small {
	width: 52rpx;
	height: 52rpx;
	font-size: 24rpx;
	flex-shrink: 0;
}

.currency-mark {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
}

.currency-mark.slate {
	background: #1c2d42;
}

.chevron {
	color: rgba(28, 45, 66, 0.58);
}

.convert-panel {
	display: flex;
	flex-direction: column;
	gap: 18rpx;
}

.swap-button {
	width: 64rpx;
	height: 64rpx;
	align-self: center;
	border-radius: 50%;
	background: #2e5a44;
	color: #fbf9f5;
	font-size: 34rpx;
	box-shadow: 0 10rpx 24rpx rgba(46, 90, 68, 0.24);
}

.rate-card {
	width: 100%;
	min-height: 124rpx;
	padding: 22rpx 24rpx;
	border-radius: 24rpx;
	justify-content: space-between;
	color: #1c2d42;
}

.target-row,
.result-card {
	width: 100%;
	min-height: 138rpx;
	padding: 24rpx;
	border-radius: 24rpx;
	color: #1c2d42;
}

.target-row {
	justify-content: space-between;
}

.result-card {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 10rpx;
}

.result-value {
	display: block;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 64rpx;
	line-height: 1.1;
	color: #10243a;
	word-break: break-word;
}

.rate-left {
	gap: 20rpx;
}

.currency-badge {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	font-size: 34rpx;
	font-weight: 600;
}

.currency-badge.slate {
	background: #425768;
}

.currency-badge.sage {
	background: #6d8f72;
}

.currency-badge.blue {
	background: #5c7180;
}

.rate-code {
	display: block;
	font-size: 34rpx;
	font-weight: 700;
}

.rate-name {
	margin-top: 4rpx;
	font-size: 24rpx;
}

.rate-value-wrap {
	gap: 16rpx;
}

.rate-value {
	font-family: Georgia, "Times New Roman", serif;
	font-size: 42rpx;
}

.cache-card,
.privacy-card {
	gap: 18rpx;
	min-height: 112rpx;
	padding: 22rpx 24rpx;
	border-radius: 24rpx;
}

.cache-icon {
	width: 58rpx;
	height: 58rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #e6ece8;
	color: #2e5a44;
}

.cache-copy {
	flex: 1;
}

.cache-title {
	display: block;
	font-size: 26rpx;
	font-weight: 650;
}

.cache-subtitle {
	margin-top: 4rpx;
	font-size: 22rpx;
}

.status-pill {
	gap: 10rpx;
	padding: 10rpx 14rpx;
	border-radius: 99rpx;
	background: rgba(46, 90, 68, 0.1);
	color: #2e5a44;
	font-size: 22rpx;
}

.live-dot {
	width: 14rpx;
	height: 14rpx;
	border-radius: 50%;
	background: #2e5a44;
}

.live-dot.muted {
	background: #8c928c;
}

.section-heading {
	padding: 4rpx 8rpx;
}

.eyebrow {
	display: block;
	font-size: 22rpx;
	font-weight: 700;
	text-transform: uppercase;
	color: #2e5a44;
	letter-spacing: 0;
}

.section-title {
	display: block;
	margin-top: 10rpx;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 48rpx;
	line-height: 1.15;
}

.control-card,
.summary-card,
.settings-card,
.legal-card {
	padding: 8rpx 24rpx;
	border-radius: 24rpx;
}

.control-row,
.setting-row {
	justify-content: space-between;
	width: 100%;
	min-height: 104rpx;
	gap: 20rpx;
	border-bottom: 1rpx solid rgba(28, 45, 66, 0.08);
	color: #1c2d42;
	font-size: 28rpx;
}

.setting-copy {
	flex: 1;
	min-width: 0;
}

.control-row:last-child,
.setting-row:last-child {
	border-bottom: 0;
}

.stepper,
.segments {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx;
	border-radius: 18rpx;
	background: rgba(28, 45, 66, 0.05);
}

.stepper button,
.segments button {
	min-width: 52rpx;
	height: 48rpx;
	border-radius: 14rpx;
	color: #1c2d42;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stepper text {
	min-width: 96rpx;
	text-align: center;
	font-size: 24rpx;
}

.stepper.wide text {
	min-width: 128rpx;
}

.segments .selected {
	background: #2e5a44;
	color: #fbf9f5;
}

.summary-card {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 22rpx;
	padding-top: 26rpx;
	padding-bottom: 26rpx;
}

.summary-value {
	display: block;
	margin-top: 8rpx;
	font-family: Georgia, "Times New Roman", serif;
	font-size: 44rpx;
}

.summary-value.green {
	color: #2e5a44;
}

.home-cost {
	grid-column: 1 / -1;
	padding: 22rpx;
	border-radius: 20rpx;
	background: rgba(46, 90, 68, 0.08);
	color: #2e5a44;
	font-weight: 650;
}

.setting-label {
	display: block;
	font-size: 28rpx;
	font-weight: 650;
}

.setting-value {
	margin-top: 6rpx;
	font-size: 22rpx;
	line-height: 1.35;
	white-space: normal;
	word-break: break-word;
}

.legal-card {
	border: 1rpx solid rgba(28, 45, 66, 0.13);
	background: rgba(255, 255, 252, 0.76);
	box-shadow: 0 18rpx 42rpx rgba(28, 45, 66, 0.09);
	backdrop-filter: blur(18rpx);
}

.back-row {
	width: 100%;
	min-height: 78rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
	color: #2e5a44;
	font-size: 26rpx;
	font-weight: 650;
	border-bottom: 1rpx solid rgba(28, 45, 66, 0.08);
}

.legal-section {
	padding: 24rpx 0;
	border-bottom: 1rpx solid rgba(28, 45, 66, 0.08);
}

.legal-heading {
	display: block;
	font-size: 28rpx;
	font-weight: 700;
	color: #1c2d42;
}

.legal-body {
	display: block;
	margin-top: 10rpx;
	font-size: 24rpx;
	line-height: 1.5;
	color: rgba(28, 45, 66, 0.7);
	white-space: normal;
	word-break: break-word;
}

.legal-note {
	padding: 22rpx 0 10rpx;
	color: rgba(28, 45, 66, 0.55);
	font-size: 22rpx;
}

.switch {
	width: 78rpx;
	height: 44rpx;
	padding: 4rpx;
	border-radius: 99rpx;
	background: rgba(28, 45, 66, 0.18);
}

.switch.on {
	background: #2e5a44;
}

.switch view {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: #fbf9f5;
}

.switch.on view {
	margin-left: auto;
}

.tabbar {
	position: fixed;
	left: 24rpx;
	right: 24rpx;
	bottom: calc(24rpx + env(safe-area-inset-bottom));
	z-index: 10;
	justify-content: space-around;
	padding: 14rpx;
	border: 1rpx solid rgba(28, 45, 66, 0.12);
	border-radius: 28rpx;
	background: rgba(251, 249, 245, 0.92);
	box-shadow: 0 18rpx 44rpx rgba(28, 45, 66, 0.12);
	backdrop-filter: blur(24rpx);
}

.tab-item {
	width: 31%;
	min-height: 84rpx;
	border-radius: 20rpx;
	color: rgba(28, 45, 66, 0.62);
	font-size: 22rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
}

.tab-item.active {
	background: rgba(46, 90, 68, 0.12);
	color: #2e5a44;
}

.tab-icon {
	font-size: 30rpx;
	line-height: 1;
}
</style>
