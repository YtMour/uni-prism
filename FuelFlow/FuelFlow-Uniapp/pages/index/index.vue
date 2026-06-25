<template>
	<view class="app-shell">
		<view class="screen-content">
			<view class="topbar">
				<view>
					<text class="eyebrow">{{ currentMeta.eyebrow }}</text>
					<text class="page-title">{{ currentMeta.title }}</text>
				</view>
				<view class="top-actions">
					<button class="settings-button" @click="activeTab = 'settings'">S</button>
					<image class="app-icon" src="/static/design-assets/app-icon/app-icon-fuelflow.png" mode="aspectFill" />
				</view>
			</view>

			<view v-if="activeTab === 'dashboard'" class="tab-view">
						<view class="vehicle-hero">
							<view class="vehicle-mark">
								<text>Car</text>
							</view>
							<view class="vehicle-info">
								<text class="vehicle-name">Daily Sedan</text>
								<text class="vehicle-meta">32,560 mi · last updated today</text>
							</view>
							<text class="chevron">›</text>
						</view>

						<view class="metric-grid">
							<view class="metric-card">
								<text class="metric-label">This month</text>
								<text class="metric-value">$248.60</text>
								<text class="metric-note">Fuel spend</text>
							</view>
							<view class="metric-card">
								<text class="metric-label">Avg. economy</text>
								<text class="metric-value">31.4 MPG</text>
								<text class="metric-note positive">+1.8 vs last month</text>
							</view>
						</view>

						<view class="panel chart-panel">
							<view class="section-head">
								<text>Fuel economy</text>
								<text class="section-value">31.4 MPG</text>
							</view>
							<view class="line-chart">
								<svg class="chart-svg" viewBox="0 0 320 150" preserveAspectRatio="none">
									<line x1="0" y1="35" x2="320" y2="35" class="grid-line" />
									<line x1="0" y1="75" x2="320" y2="75" class="grid-line" />
									<line x1="0" y1="115" x2="320" y2="115" class="grid-line" />
									<path d="M0 118 L42 104 L84 92 L126 98 L168 70 L210 82 L252 58 L320 76" class="chart-area" />
									<polyline points="0,118 42,104 84,92 126,98 168,70 210,82 252,58 320,76" class="trend-line" />
									<circle v-for="point in chartPoints" :key="point.x" :cx="point.x" :cy="point.y" r="4" class="trend-dot" />
								</svg>
							</view>
							<view class="chart-labels">
								<text>Apr 20</text>
								<text>May 4</text>
								<text>May 18</text>
							</view>
						</view>

						<view class="panel">
							<view class="section-head">
								<text>Recent logs</text>
								<text class="link-text" @click="activeTab = 'logs'">View all</text>
							</view>
							<view v-for="log in logs" :key="log.date" class="log-row">
								<view class="row-icon fuel-row-icon">F</view>
								<view class="row-main">
									<text>{{ log.date }}</text>
									<text>{{ log.station }}</text>
								</view>
								<view class="row-side">
									<text>{{ log.volume }}</text>
									<text>{{ log.amount }}</text>
								</view>
							</view>
						</view>
			</view>

			<view v-else-if="activeTab === 'addFuel'" class="tab-view">
						<view class="add-card">
							<view v-for="field in fuelFields" :key="field.label" class="input-block">
								<text>{{ field.label }}</text>
								<view>
									<text>{{ field.value }}</text>
									<text>{{ field.unit }}</text>
								</view>
							</view>
							<view class="business-toggle">
								<text :class="{ selected: fuelCategory === 'Business' }" @click="fuelCategory = 'Business'">Business</text>
								<text :class="{ selected: fuelCategory === 'Personal' }" @click="fuelCategory = 'Personal'">Personal</text>
							</view>
							<view class="full-tank-row">
								<text>Full tank</text>
								<view class="switch-on">
									<view></view>
								</view>
							</view>
							<view class="note-field">
								<text>Notes</text>
								<text>e.g. Highway commute</text>
							</view>
							<button class="primary-action" @click="activeTab = 'dashboard'">Add fuel</button>
						</view>
			</view>

			<view v-else-if="activeTab === 'logs'" class="tab-view">
						<view class="segment">
							<text class="segment-active">Fuel</text>
							<text>Trip</text>
							<text>Expense</text>
						</view>
						<view class="panel">
							<view class="month-head">
								<text>May 2025</text>
								<text>$106.85</text>
							</view>
							<view v-for="log in logs" :key="log.station" class="log-row large">
								<view class="row-icon fuel-row-icon">F</view>
								<view class="row-main">
									<text>{{ log.date }}</text>
									<text>{{ log.station }} · {{ log.category }}</text>
								</view>
								<view class="row-side">
									<text>{{ log.amount }}</text>
									<text>{{ log.volume }}</text>
								</view>
							</view>
						</view>
						<view class="empty-card">
							<image src="/static/design-assets/illustrations/empty-fuel-log.png" mode="aspectFit" />
							<text>Keep records lightweight and export-ready.</text>
						</view>
			</view>

			<view v-else-if="activeTab === 'garage'" class="tab-view">
						<image class="hero-illustration" src="/static/design-assets/illustrations/garage-vehicles.png" mode="aspectFit" />
						<view v-for="vehicle in vehicles" :key="vehicle.name" class="vehicle-card">
							<view class="vehicle-avatar">
								<image src="/static/design-assets/icons/icon-garage.png" mode="aspectFit" />
							</view>
							<view class="vehicle-info">
								<view class="vehicle-title-line">
									<text class="vehicle-name dark">{{ vehicle.name }}</text>
									<text v-if="vehicle.primary" class="pill">Primary</text>
								</view>
								<text class="vehicle-meta">{{ vehicle.miles }} · {{ vehicle.economy }}</text>
							</view>
							<text class="chevron dark">›</text>
						</view>
						<button class="secondary-action">
							<text>＋</text>
							<text>Add vehicle</text>
						</button>
						<button class="secondary-action" @click="activeTab = 'settings'">
							<text>S</text>
							<text>Settings</text>
						</button>
					</view>

			<view v-else-if="activeTab === 'reports'" class="tab-view">
				<image class="hero-illustration" src="/static/design-assets/illustrations/reports-export.png" mode="aspectFit" />
				<view class="panel">
					<view class="date-filter">
						<text>Apr 20 - May 20, 2025</text>
						<text>⌄</text>
					</view>
					<view class="split-metrics">
						<view>
							<text>Business</text>
							<text>$148.30</text>
							<text>59.7%</text>
						</view>
						<view>
							<text>Personal</text>
							<text>$100.30</text>
							<text>40.3%</text>
						</view>
					</view>
				</view>
				<view class="panel">
					<view class="section-head">
						<text>Spending by category</text>
						<text class="section-value">$248.60</text>
					</view>
					<view v-for="item in reportItems" :key="item.name" class="category-row">
						<view class="category-dot" :style="{ background: item.color }"></view>
						<text>{{ item.name }}</text>
						<text>{{ item.amount }}</text>
						<text>{{ item.percent }}</text>
					</view>
					<button class="export-button">
						<view class="export-symbol">E</view>
						<text>Export CSV</text>
					</button>
				</view>
			</view>

			<view v-else class="tab-view">
				<view v-if="activeTab === 'privacy'" class="panel legal-page">
					<text class="legal-updated">Draft policy · June 24, 2026</text>
					<text class="legal-title">Privacy Policy</text>
					<text class="legal-copy">FuelFlow is designed as a personal fuel, mileage, and vehicle cost tracker. The current H5 prototype stores only sample data shown in the interface and does not connect to an account, analytics service, payment service, or cloud backend.</text>
					<text class="legal-section">Information you may choose to record</text>
					<text class="legal-copy">A production version may let you record vehicle names, odometer readings, fuel volume, fuel price, total cost, trip category, expense notes, and export preferences. These records are used to calculate fuel economy, spending summaries, and export files.</text>
					<text class="legal-section">Local-first expectation</text>
					<text class="legal-copy">FuelFlow should keep core records on the device unless cloud sync is clearly enabled by the user. If sync, login, crash reporting, analytics, or payment features are added later, this policy must be updated before release.</text>
					<text class="legal-section">Exports</text>
					<text class="legal-copy">CSV or PDF exports are user-initiated. Exported files may contain mileage, cost, and category data, so users should review them before sharing with employers, accountants, or tax preparers.</text>
					<button class="secondary-action" @click="activeTab = 'settings'">Back to Settings</button>
				</view>

				<view v-else-if="activeTab === 'disclaimer'" class="panel legal-page">
					<text class="legal-updated">Draft notice · June 24, 2026</text>
					<text class="legal-title">Disclaimer</text>
					<text class="legal-copy">FuelFlow provides tracking, calculation, and export tools for personal vehicle records. It does not provide tax, legal, accounting, insurance, vehicle maintenance, or financial advice.</text>
					<text class="legal-section">Tax and business mileage</text>
					<text class="legal-copy">Business and Personal categories are organizational labels only. Users are responsible for confirming deduction eligibility, mileage rates, documentation rules, and filing requirements with qualified professionals or official guidance.</text>
					<text class="legal-section">Calculation limits</text>
					<text class="legal-copy">Fuel economy and cost summaries depend on user-entered odometer, fuel volume, price, and full-tank status. Incomplete or incorrect records can produce inaccurate trends.</text>
					<text class="legal-section">Vehicle decisions</text>
					<text class="legal-copy">FuelFlow may help users notice spending or fuel economy changes, but it is not a diagnostic tool. Maintenance, safety, and repair decisions should be made with qualified technicians.</text>
					<button class="secondary-action" @click="activeTab = 'settings'">Back to Settings</button>
				</view>

				<template v-else>
				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">Vehicle defaults</text>
						<view v-for="item in unitSettings" :key="item.label" class="setting-row">
							<view>
								<text>{{ item.label }}</text>
								<text>{{ item.description }}</text>
							</view>
							<text>{{ item.value }}</text>
						</view>
					</view>
				</view>

				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">Data and export</text>
						<view v-for="item in exportSettings" :key="item.label" class="setting-row">
							<view>
								<text>{{ item.label }}</text>
								<text>{{ item.description }}</text>
							</view>
							<text>{{ item.value }}</text>
						</view>
					</view>
				</view>

				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">App</text>
						<view class="setting-row">
							<view>
								<text>Language</text>
								<text>Interface language for this device</text>
							</view>
							<text>English</text>
						</view>
						<view class="setting-row">
							<view>
								<text>Theme</text>
								<text>Warm paper canvas</text>
							</view>
							<text>Light</text>
						</view>
					</view>
				</view>

				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">Legal</text>
						<view class="setting-row tappable" @click="activeTab = 'privacy'">
							<view>
								<text>Privacy Policy</text>
								<text>Data use, local records, and exports</text>
							</view>
							<text>View</text>
						</view>
						<view class="setting-row tappable" @click="activeTab = 'disclaimer'">
							<view>
								<text>Disclaimer</text>
								<text>Tax, calculation, and vehicle limits</text>
							</view>
							<text>View</text>
						</view>
					</view>
				</view>
				</template>
			</view>
		</view>

		<view class="bottom-nav">
			<view v-for="tab in tabs" :key="tab.key" class="nav-item" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
				<view class="nav-symbol">
					<text>{{ tab.mark }}</text>
				</view>
				<text>{{ tab.label }}</text>
			</view>
			<button class="fab" @click="activeTab = 'addFuel'">＋</button>
		</view>
	</view>
</template>

<script>
const meta = {
	dashboard: { eyebrow: 'FuelFlow', title: 'Dashboard' },
	addFuel: { eyebrow: 'Speed entry', title: 'Add Fuel' },
	logs: { eyebrow: 'Quick records', title: 'Logs' },
	garage: { eyebrow: 'Multi-vehicle', title: 'Garage' },
	reports: { eyebrow: 'Export ready', title: 'Reports' },
	settings: { eyebrow: 'Preferences', title: 'Settings' },
	privacy: { eyebrow: 'Legal', title: 'Privacy' },
	disclaimer: { eyebrow: 'Legal', title: 'Disclaimer' }
}

export default {
	data() {
		return {
			activeTab: 'dashboard',
			tabs: [
				{ key: 'dashboard', label: 'Dashboard', mark: 'D' },
				{ key: 'logs', label: 'Logs', mark: 'L' },
				{ key: 'garage', label: 'Garage', mark: 'G' },
				{ key: 'reports', label: 'Reports', mark: 'R' }
			],
			logs: [
				{ date: 'May 20, 2025', station: 'Shell Station', volume: '10.123 gal', amount: '$37.05', category: 'Business' },
				{ date: 'May 12, 2025', station: 'Exxon', volume: '9.456 gal', amount: '$34.20', category: 'Personal' },
				{ date: 'May 5, 2025', station: 'Chevron', volume: '9.870 gal', amount: '$35.60', category: 'Business' }
			],
			vehicles: [
				{ name: 'Daily Sedan', miles: '32,560 mi', economy: '31.4 MPG', primary: true },
				{ name: 'Weekend SUV', miles: '15,210 mi', economy: '24.7 MPG', primary: false }
			],
			fuelCategory: 'Business',
			fuelFields: [
				{ label: 'Odometer', value: '48,562', unit: 'mi' },
				{ label: 'Gallons', value: '10.123', unit: 'gal' },
				{ label: 'Total cost', value: '37.05', unit: 'USD' },
				{ label: 'Price per gallon', value: '3.659', unit: 'USD' }
			],
			reportItems: [
				{ name: 'Fuel', amount: '$198.60', percent: '79.4%', color: '#1A3644' },
				{ name: 'Maintenance', amount: '$34.00', percent: '13.6%', color: '#2B4C3F' },
				{ name: 'Tolls', amount: '$16.00', percent: '6.4%', color: '#B8792F' }
			],
			unitSettings: [
				{ label: 'Distance', description: 'Odometer and trip distance', value: 'Miles' },
				{ label: 'Fuel volume', description: 'Fuel input and fill-up logs', value: 'Gallons' },
				{ label: 'Economy', description: 'Dashboard trend and reports', value: 'MPG' },
				{ label: 'Currency', description: 'Fuel cost and export totals', value: 'USD' }
			],
			exportSettings: [
				{ label: 'Default category', description: 'Applied to new fuel logs', value: 'Personal' },
				{ label: 'CSV format', description: 'Date, vehicle, odometer, volume, cost', value: 'Standard' },
				{ label: 'Tax summary', description: 'Business and personal totals', value: 'Enabled' }
			],
			chartPoints: [
				{ x: 0, y: 118 },
				{ x: 42, y: 104 },
				{ x: 84, y: 92 },
				{ x: 126, y: 98 },
				{ x: 168, y: 70 },
				{ x: 210, y: 82 },
				{ x: 252, y: 58 },
				{ x: 320, y: 76 }
			]
		}
	},
	computed: {
		currentMeta() {
			return meta[this.activeTab]
		}
	}
}
</script>

<style scoped>
.app-shell {
	min-height: 100vh;
	background: #fbf9f5;
	position: relative;
	width: 100%;
}

.screen-content {
	width: 100%;
	max-width: 720px;
	margin: 0 auto;
	padding: calc(var(--status-bar-height, 0px) + 36rpx) 32rpx 148rpx;
}

.topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 26rpx;
}

.top-actions {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.settings-button {
	width: 60rpx;
	height: 60rpx;
	border-radius: 18rpx;
	border: 1px solid #e7e1d8;
	background: #ffffff;
	color: #1a3644;
	font-size: 22rpx;
	font-weight: 800;
	box-shadow: 0 8rpx 18rpx rgba(23, 33, 38, 0.08);
	display: flex;
	align-items: center;
	justify-content: center;
}

.eyebrow,
.metric-label,
.metric-note,
.vehicle-meta,
.row-main text:nth-child(2),
.row-side text:nth-child(2),
.chart-labels,
.category-row text:last-child {
	color: #6f7672;
	font-size: 22rpx;
}

.page-title {
	display: block;
	color: #172126;
	font-size: 42rpx;
	font-weight: 760;
	margin-top: 4rpx;
}

.app-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 18rpx;
	box-shadow: 0 8rpx 18rpx rgba(23, 33, 38, 0.12);
}

.tab-view {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.vehicle-hero {
	display: flex;
	align-items: center;
	gap: 18rpx;
	padding: 24rpx;
	border-radius: 18rpx;
	background: linear-gradient(135deg, #1a3644, #0f5664);
	color: #ffffff;
}

.vehicle-mark,
.vehicle-avatar {
	width: 76rpx;
	height: 76rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.92);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34rpx;
}

.vehicle-mark text {
	color: #1a3644;
	font-size: 20rpx;
	font-weight: 800;
}

.vehicle-mark image,
.vehicle-avatar image {
	width: 54rpx;
	height: 54rpx;
	border-radius: 14rpx;
}

.vehicle-info {
	flex: 1;
	min-width: 0;
}

.vehicle-name {
	display: block;
	font-size: 30rpx;
	font-weight: 760;
	color: #ffffff;
}

.vehicle-name.dark,
.chevron.dark {
	color: #172126;
}

.chevron {
	font-size: 42rpx;
	color: #ffffff;
}

.metric-grid,
.split-metrics {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
}

.metric-card,
.panel,
.vehicle-card,
.empty-card {
	background: #ffffff;
	border: 1px solid #e7e1d8;
	border-radius: 18rpx;
	box-shadow: 0 10rpx 28rpx rgba(23, 33, 38, 0.06);
}

.metric-card {
	padding: 22rpx;
}

.metric-value {
	display: block;
	margin-top: 12rpx;
	color: #172126;
	font-size: 44rpx;
	font-weight: 760;
	line-height: 1.05;
	white-space: nowrap;
}

.positive {
	color: #2b4c3f;
}

.panel {
	padding: 22rpx;
}

.section-head,
.month-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 18rpx;
	color: #172126;
	font-size: 26rpx;
	font-weight: 700;
}

.section-value,
.link-text {
	color: #2b4c3f;
	font-size: 24rpx;
}

.line-chart {
	position: relative;
	height: 220rpx;
	background: #fffdfa;
	border: 1px solid #f0ebe3;
	border-radius: 14rpx;
	overflow: hidden;
}

.chart-svg {
	width: 100%;
	height: 100%;
	display: block;
}

.grid-line {
	stroke: #e7e1d8;
	stroke-width: 1;
	opacity: 0.7;
}

.chart-area {
	fill: rgba(43, 76, 63, 0.1);
	stroke: none;
}

.trend-line {
	fill: none;
	stroke: #1a3644;
	stroke-width: 3;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.trend-dot {
	fill: #ffffff;
	stroke: #1a3644;
	stroke-width: 3;
}

.chart-labels {
	display: flex;
	justify-content: space-between;
	margin-top: 14rpx;
}

.log-row,
.vehicle-card,
.category-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx 0;
	border-top: 1px solid #f0ebe3;
}

.log-row:first-of-type,
.category-row:first-of-type {
	border-top: 0;
}

.log-row.large {
	padding: 22rpx 0;
}

.row-icon {
	width: 44rpx;
	height: 44rpx;
	border-radius: 12rpx;
}

.fuel-row-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f5f2eb;
	color: #1a3644;
	font-size: 20rpx;
	font-weight: 800;
}

.row-main {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	color: #172126;
	font-size: 25rpx;
}

.row-side {
	text-align: right;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	color: #172126;
	font-size: 24rpx;
}

.segment {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	padding: 6rpx;
	border: 1px solid #e7e1d8;
	border-radius: 16rpx;
	background: #ffffff;
}

.segment text {
	text-align: center;
	padding: 16rpx 0;
	font-size: 24rpx;
	color: #6f7672;
	border-radius: 12rpx;
}

.segment .segment-active {
	background: #1a3644;
	color: #ffffff;
}

.empty-card {
	padding: 20rpx;
	text-align: center;
	color: #6f7672;
	font-size: 24rpx;
}

.empty-card image,
.hero-illustration {
	width: 100%;
	height: 260rpx;
}

.vehicle-card {
	padding: 20rpx;
}

.vehicle-card .vehicle-avatar {
	background: #f5f2eb;
}

.vehicle-title-line {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.pill {
	background: #1a3644;
	color: #ffffff;
	padding: 6rpx 12rpx;
	border-radius: 999rpx;
	font-size: 18rpx;
}

.secondary-action,
.export-button,
.primary-action {
	height: 88rpx;
	border: 1px solid #d8d1c6;
	border-radius: 16rpx;
	background: #ffffff;
	color: #172126;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	font-size: 26rpx;
}

.primary-action {
	background: #1a3644;
	color: #ffffff;
	border-color: #1a3644;
	box-shadow: 0 12rpx 24rpx rgba(26, 54, 68, 0.18);
}

.add-card {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.input-block,
.note-field,
.full-tank-row {
	background: #ffffff;
	border: 1px solid #e7e1d8;
	border-radius: 18rpx;
	padding: 20rpx;
	box-shadow: 0 8rpx 22rpx rgba(23, 33, 38, 0.05);
}

.input-block > text,
.note-field > text:first-child {
	display: block;
	color: #6f7672;
	font-size: 22rpx;
	margin-bottom: 10rpx;
}

.input-block view {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}

.input-block view text:first-child {
	color: #172126;
	font-size: 54rpx;
	font-weight: 760;
	line-height: 1;
}

.input-block view text:last-child {
	color: #6f7672;
	font-size: 22rpx;
}

.business-toggle {
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 6rpx;
	border: 1px solid #e7e1d8;
	background: #ffffff;
	border-radius: 18rpx;
}

.business-toggle text {
	text-align: center;
	padding: 18rpx 0;
	border-radius: 14rpx;
	font-size: 24rpx;
	color: #172126;
}

.business-toggle .selected {
	background: #2b4c3f;
	color: #ffffff;
}

.full-tank-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #172126;
	font-size: 26rpx;
}

.switch-on {
	width: 80rpx;
	height: 44rpx;
	background: #2b4c3f;
	border-radius: 999rpx;
	padding: 4rpx;
	display: flex;
	justify-content: flex-end;
}

.switch-on view {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: #ffffff;
}

.note-field text:last-child {
	color: #9d9a92;
	font-size: 26rpx;
}

.date-filter {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx;
	border: 1px solid #e7e1d8;
	border-radius: 14rpx;
	color: #172126;
	font-size: 24rpx;
}

.split-metrics {
	margin-top: 18rpx;
}

.split-metrics view {
	padding: 18rpx;
	border-radius: 14rpx;
	background: #fbf9f5;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.split-metrics text:nth-child(1) {
	color: #6f7672;
	font-size: 22rpx;
}

.split-metrics text:nth-child(2) {
	color: #172126;
	font-size: 34rpx;
	font-weight: 760;
}

.split-metrics text:nth-child(3) {
	color: #2b4c3f;
	font-size: 22rpx;
}

.category-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 6rpx;
}

.category-row text:nth-child(2) {
	flex: 1;
	font-size: 24rpx;
	color: #172126;
}

.category-row text:nth-child(3) {
	font-size: 24rpx;
	color: #172126;
}

.export-button {
	margin-top: 20rpx;
}

.export-button image {
	width: 40rpx;
	height: 40rpx;
}

.settings-panel {
	padding: 0;
	overflow: hidden;
}

.settings-group-title {
	display: block;
	padding: 22rpx 22rpx 10rpx;
	color: #6f7672;
	font-size: 22rpx;
	font-weight: 700;
	text-transform: uppercase;
}

.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	padding: 20rpx 22rpx;
	border-top: 1px solid #f0ebe3;
}

.setting-row view {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.setting-row view text:first-child {
	color: #172126;
	font-size: 26rpx;
	font-weight: 700;
}

.setting-row view text:last-child {
	color: #6f7672;
	font-size: 22rpx;
}

.setting-row > text {
	color: #1a3644;
	font-size: 24rpx;
	font-weight: 700;
	white-space: nowrap;
}

.setting-row.tappable {
	cursor: pointer;
}

.legal-page {
	display: flex;
	flex-direction: column;
	gap: 18rpx;
	padding: 26rpx;
}

.legal-updated {
	color: #6f7672;
	font-size: 22rpx;
}

.legal-title {
	color: #172126;
	font-size: 34rpx;
	font-weight: 800;
}

.legal-section {
	color: #172126;
	font-size: 26rpx;
	font-weight: 800;
	margin-top: 8rpx;
}

.legal-copy {
	color: #4f5a56;
	font-size: 24rpx;
	line-height: 1.65;
}

.bottom-nav {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: calc(112rpx + env(safe-area-inset-bottom));
	padding-bottom: env(safe-area-inset-bottom);
	background: rgba(255, 255, 255, 0.94);
	border-top: 1px solid #e7e1d8;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	align-items: center;
	backdrop-filter: blur(12px);
	z-index: 10;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	color: #6f7672;
	font-size: 18rpx;
}

.nav-symbol {
	width: 34rpx;
	height: 34rpx;
	border: 2rpx solid currentColor;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.76;
}

.nav-symbol text {
	font-size: 18rpx;
	font-weight: 800;
	line-height: 1;
}

.nav-item.active {
	color: #1a3644;
	font-weight: 700;
}

.nav-item.active .nav-symbol {
	background: #1a3644;
	color: #ffffff;
	opacity: 1;
}

.fab {
	position: fixed;
	left: 50%;
	bottom: calc(58rpx + env(safe-area-inset-bottom));
	transform: translateX(-50%);
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	background: #1a3644;
	color: #ffffff;
	box-shadow: 0 12rpx 28rpx rgba(26, 54, 68, 0.28);
	font-size: 42rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 11;
}
</style>
