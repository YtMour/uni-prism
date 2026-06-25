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
								<text>{{ t('vehicleMark') }}</text>
							</view>
							<view class="vehicle-info">
								<text class="vehicle-name">{{ currentVehicle.name }}</text>
								<text class="vehicle-meta">{{ formatNumber(currentVehicle.odometer) }} {{ distanceUnit }} · {{ lastUpdatedLabel }}</text>
							</view>
							<text class="chevron">›</text>
						</view>

						<view class="metric-grid">
							<view class="metric-card">
								<text class="metric-label">{{ t('thisMonth') }}</text>
								<text class="metric-value">{{ money(monthFuelSpend) }}</text>
								<text class="metric-note">{{ t('fuelSpend') }}</text>
							</view>
							<view class="metric-card">
								<text class="metric-label">{{ t('avgEconomy') }}</text>
								<text class="metric-value">{{ averageEconomy }} {{ t('unitMpg') }}</text>
								<text class="metric-note positive">{{ t('economyDelta') }}</text>
							</view>
						</view>

						<view class="panel chart-panel">
							<view class="section-head">
								<text>{{ t('fuelEconomy') }}</text>
								<text class="section-value">{{ averageEconomy }} {{ t('unitMpg') }}</text>
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
								<text>{{ t('recentLogs') }}</text>
								<text class="link-text" @click="activeTab = 'logs'">{{ t('viewAll') }}</text>
							</view>
							<view v-for="log in recentLogs" :key="log.id" class="log-row">
								<view class="row-icon fuel-row-icon">F</view>
								<view class="row-main">
									<text>{{ log.date }}</text>
									<text>{{ log.station }}</text>
								</view>
								<view class="row-side">
									<text>{{ formatGallons(log.volume) }}</text>
									<text>{{ money(log.totalCost) }}</text>
								</view>
							</view>
						</view>
			</view>

			<view v-else-if="activeTab === 'addFuel'" class="tab-view">
						<view class="add-card">
							<view class="input-block">
								<text>{{ t('vehicle') }}</text>
								<picker mode="selector" :range="vehicleLabels" :value="currentFuelVehicleIndex" @change="handleFuelVehicleChange">
									<view class="inline-picker">
										<text class="field-display">{{ fuelVehicle.name }}</text>
										<text>⌄</text>
									</view>
								</picker>
							</view>
							<view class="input-block">
								<text>{{ t('date') }}</text>
								<picker mode="date" :value="fuelForm.date" @change="handleFuelDateChange">
									<view class="inline-picker">
										<text class="field-display compact-display">{{ fuelForm.date }}</text>
									<text>YYYY-MM-DD</text>
								</view>
								</picker>
							</view>
							<view class="input-block">
								<text>{{ t('station') }}</text>
								<input v-model="fuelForm.station" class="note-input strong-input" type="text" :placeholder="t('stationPlaceholder')" />
							</view>
							<view class="input-block">
								<text>{{ t('odometer') }}</text>
								<view>
									<input v-model="fuelForm.odometer" class="fuel-input" type="digit" placeholder="0" />
									<text>{{ distanceUnit }}</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('fuelVolume') }}</text>
								<view>
									<input v-model="fuelForm.volume" class="fuel-input" type="digit" placeholder="0.000" @input="handleFuelInput('volume')" />
									<text>{{ t('unitGallonsShort') }}</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('totalCost') }}</text>
								<view>
									<input v-model="fuelForm.totalCost" class="fuel-input" type="digit" placeholder="0.00" @input="handleFuelInput('totalCost')" />
									<text>{{ currency }}</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('unitPrice') }}</text>
								<view>
									<input v-model="fuelForm.unitPrice" class="fuel-input" type="digit" placeholder="0.000" @input="handleFuelInput('unitPrice')" />
									<text>{{ currency }}</text>
								</view>
							</view>
							<view class="business-toggle">
								<text :class="{ selected: fuelCategory === 'Business' }" @click="fuelCategory = 'Business'">{{ t('categoryBusiness') }}</text>
								<text :class="{ selected: fuelCategory === 'Personal' }" @click="fuelCategory = 'Personal'">{{ t('categoryPersonal') }}</text>
							</view>
							<view class="full-tank-row">
								<text>{{ t('fullTank') }}</text>
								<view class="switch-on" :class="{ off: !fuelForm.fullTank }" @click="fuelForm.fullTank = !fuelForm.fullTank">
									<view></view>
								</view>
							</view>
							<view class="note-field">
								<text>{{ t('notes') }}</text>
								<input v-model="fuelForm.note" class="note-input" type="text" :placeholder="t('notePlaceholder')" />
							</view>
							<text v-if="formMessage" class="form-message">{{ formMessage }}</text>
							<button class="primary-action" @click="addFuelLog">{{ t('addFuelAction') }}</button>
						</view>
			</view>

			<view v-else-if="activeTab === 'editFuel'" class="tab-view">
						<view class="add-card">
							<view class="input-block">
								<text>{{ t('vehicle') }}</text>
								<picker mode="selector" :range="vehicleLabels" :value="currentEditVehicleIndex" @change="handleEditVehicleChange">
									<view class="inline-picker">
										<text class="field-display">{{ editVehicle.name }}</text>
										<text>⌄</text>
									</view>
								</picker>
							</view>
							<view class="input-block">
								<text>{{ t('date') }}</text>
								<view>
									<input v-model="editForm.date" class="fuel-input compact" type="text" />
									<text>YYYY-MM-DD</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('odometer') }}</text>
								<view>
									<input v-model="editForm.odometer" class="fuel-input" type="digit" placeholder="0" />
									<text>{{ distanceUnit }}</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('fuelVolume') }}</text>
								<view>
									<input v-model="editForm.volume" class="fuel-input" type="digit" placeholder="0.000" @input="handleEditFuelInput('volume')" />
									<text>{{ t('unitGallonsShort') }}</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('totalCost') }}</text>
								<view>
									<input v-model="editForm.totalCost" class="fuel-input" type="digit" placeholder="0.00" @input="handleEditFuelInput('totalCost')" />
									<text>{{ currency }}</text>
								</view>
							</view>
							<view class="input-block">
								<text>{{ t('unitPrice') }}</text>
								<view>
									<input v-model="editForm.unitPrice" class="fuel-input" type="digit" placeholder="0.000" @input="handleEditFuelInput('unitPrice')" />
									<text>{{ currency }}</text>
								</view>
							</view>
							<view class="business-toggle">
								<text :class="{ selected: editForm.category === 'Business' }" @click="editForm.category = 'Business'">{{ t('categoryBusiness') }}</text>
								<text :class="{ selected: editForm.category === 'Personal' }" @click="editForm.category = 'Personal'">{{ t('categoryPersonal') }}</text>
							</view>
							<view class="full-tank-row">
								<text>{{ t('fullTank') }}</text>
								<view class="switch-on" :class="{ off: !editForm.fullTank }" @click="editForm.fullTank = !editForm.fullTank">
									<view></view>
								</view>
							</view>
							<view class="note-field">
								<text>{{ t('station') }}</text>
								<input v-model="editForm.station" class="note-input" type="text" :placeholder="t('stationPlaceholder')" />
							</view>
							<view class="note-field">
								<text>{{ t('notes') }}</text>
								<input v-model="editForm.note" class="note-input" type="text" :placeholder="t('notePlaceholder')" />
							</view>
							<text v-if="formMessage" class="form-message">{{ formMessage }}</text>
							<button class="primary-action" @click="saveEditedFuelLog">{{ t('saveChanges') }}</button>
							<button class="secondary-action" @click="activeTab = 'logs'">{{ t('cancel') }}</button>
						</view>
			</view>

			<view v-else-if="activeTab === 'logs'" class="tab-view">
						<view class="segment">
							<text class="segment-active">{{ t('fuel') }}</text>
							<text>{{ t('trip') }}</text>
							<text>{{ t('expense') }}</text>
						</view>
						<view class="filter-grid">
							<picker mode="selector" :range="logVehicleFilterLabels" :value="currentLogVehicleFilterIndex" @change="handleLogVehicleFilterChange">
								<view class="filter-pill">
									<text>{{ currentLogVehicleFilterLabel }}</text>
									<text>⌄</text>
								</view>
							</picker>
							<picker mode="selector" :range="logCategoryFilterLabels" :value="currentLogCategoryFilterIndex" @change="handleLogCategoryFilterChange">
								<view class="filter-pill">
									<text>{{ currentLogCategoryFilterLabel }}</text>
									<text>⌄</text>
								</view>
							</picker>
							<picker mode="selector" :range="dateRangeLabels" :value="currentLogDateRangeIndex" @change="handleLogDateRangeChange">
								<view class="filter-pill">
									<text>{{ currentLogDateRangeLabel }}</text>
									<text>⌄</text>
								</view>
							</picker>
						</view>
						<view class="panel">
							<view class="month-head">
								<text>{{ currentLogRangeLabel }}</text>
								<text>{{ money(filteredFuelSpend) }}</text>
							</view>
							<view v-for="log in filteredLogs" :key="log.id" class="log-row large">
								<view class="row-icon fuel-row-icon">F</view>
								<view class="row-main">
									<text @click="startEditFuelLog(log)">{{ log.date }}</text>
									<text @click="startEditFuelLog(log)">{{ log.station }} · {{ vehicleNameById(log.vehicleId) }} · {{ categoryLabel(log.category) }}</text>
								</view>
								<view class="row-side">
									<text>{{ money(log.totalCost) }}</text>
									<text>{{ formatGallons(log.volume) }}</text>
								</view>
								<button class="row-edit" @click="startEditFuelLog(log)">{{ t('editLog') }}</button>
								<button class="row-delete" @click="deleteFuelLog(log.id)">×</button>
							</view>
						</view>
						<view v-if="filteredLogs.length === 0" class="empty-card">
							<image src="/static/design-assets/illustrations/empty-fuel-log.png" mode="aspectFit" />
							<text>{{ t('emptyFuelLog') }}</text>
						</view>
			</view>

			<view v-else-if="activeTab === 'garage'" class="tab-view">
						<image class="hero-illustration" src="/static/design-assets/illustrations/garage-vehicles.png" mode="aspectFit" />
						<view v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card" @click="setPrimaryVehicle(vehicle.id)">
							<view class="vehicle-avatar">
								<image src="/static/design-assets/icons/icon-garage.png" mode="aspectFit" />
							</view>
							<view class="vehicle-info">
								<view class="vehicle-title-line">
									<text class="vehicle-name dark">{{ vehicle.name }}</text>
									<text v-if="vehicle.primary" class="pill">{{ t('primary') }}</text>
								</view>
								<text class="vehicle-meta">{{ formatNumber(vehicle.odometer) }} {{ distanceUnit }} · {{ vehicle.economy }} {{ t('unitMpg') }}</text>
							</view>
							<text class="chevron dark">›</text>
							<view class="vehicle-actions">
								<button class="row-edit" @click.stop="startEditVehicle(vehicle)">{{ t('editLog') }}</button>
								<button class="row-delete" @click.stop="deleteVehicle(vehicle.id)">×</button>
							</view>
						</view>
						<button class="secondary-action" @click="startAddVehicle">
							<text>＋</text>
							<text>{{ t('addVehicle') }}</text>
						</button>
						<button class="secondary-action" @click="activeTab = 'settings'">
							<text>S</text>
							<text>{{ t('settingsTitle') }}</text>
						</button>
					</view>

			<view v-else-if="activeTab === 'addVehicle' || activeTab === 'editVehicle'" class="tab-view">
				<view class="add-card">
					<view class="input-block">
						<text>{{ t('vehicleName') }}</text>
						<input v-model="vehicleForm.name" class="note-input strong-input" type="text" :placeholder="t('vehicleNamePlaceholder')" />
					</view>
					<view class="input-block">
						<text>{{ t('odometer') }}</text>
						<view>
							<input v-model="vehicleForm.odometer" class="fuel-input" type="digit" placeholder="0" />
							<text>{{ distanceUnit }}</text>
						</view>
					</view>
					<view class="input-block">
						<text>{{ t('avgEconomy') }}</text>
						<view>
							<input v-model="vehicleForm.economy" class="fuel-input" type="digit" placeholder="0.0" />
							<text>{{ t('unitMpg') }}</text>
						</view>
					</view>
					<text v-if="formMessage" class="form-message">{{ formMessage }}</text>
					<button class="primary-action" @click="saveVehicle">{{ vehicleEditId ? t('updateVehicle') : t('saveVehicle') }}</button>
					<button class="secondary-action" @click="activeTab = 'garage'">{{ t('cancel') }}</button>
				</view>
			</view>

			<view v-else-if="activeTab === 'reports'" class="tab-view">
				<image class="hero-illustration" src="/static/design-assets/illustrations/reports-export.png" mode="aspectFit" />
				<view class="panel">
					<picker mode="selector" :range="dateRangeLabels" :value="currentReportDateRangeIndex" @change="handleReportDateRangeChange">
						<view class="date-filter">
							<text>{{ reportRangeLabel }}</text>
							<text>⌄</text>
						</view>
					</picker>
					<view class="split-metrics">
						<view>
							<text>{{ t('categoryBusiness') }}</text>
							<text>{{ money(categoryTotals.Business) }}</text>
							<text>{{ categoryPercent('Business') }}</text>
						</view>
						<view>
							<text>{{ t('categoryPersonal') }}</text>
							<text>{{ money(categoryTotals.Personal) }}</text>
							<text>{{ categoryPercent('Personal') }}</text>
						</view>
					</view>
				</view>
				<view class="panel">
					<view class="section-head">
						<text>{{ t('spendingByCategory') }}</text>
						<text class="section-value">{{ money(monthFuelSpend) }}</text>
					</view>
					<view v-for="item in spendingItems" :key="item.name" class="category-row">
						<view class="category-dot" :style="{ background: item.color }"></view>
						<text>{{ item.name }}</text>
						<text>{{ item.amount }}</text>
						<text>{{ item.percent }}</text>
					</view>
					<button class="export-button" @click="exportCsv">
						<view class="export-symbol">E</view>
						<text>{{ t('exportCsv') }}</text>
					</button>
					<text v-if="exportMessage" class="export-message">{{ exportMessage }}</text>
				</view>
			</view>

			<view v-else class="tab-view">
				<view v-if="activeTab === 'privacy'" class="panel legal-page">
					<text class="legal-updated">{{ t('privacyUpdated') }}</text>
					<text class="legal-title">{{ t('privacyTitle') }}</text>
					<text class="legal-copy">{{ t('privacyIntro') }}</text>
					<text class="legal-section">{{ t('privacyInfoTitle') }}</text>
					<text class="legal-copy">{{ t('privacyInfoCopy') }}</text>
					<text class="legal-section">{{ t('privacyLocalTitle') }}</text>
					<text class="legal-copy">{{ t('privacyLocalCopy') }}</text>
					<text class="legal-section">{{ t('privacyExportsTitle') }}</text>
					<text class="legal-copy">{{ t('privacyExportsCopy') }}</text>
					<text class="legal-section">{{ t('privacyChildrenTitle') }}</text>
					<text class="legal-copy">{{ t('privacyChildrenCopy') }}</text>
					<text class="legal-section">{{ t('privacyRetentionTitle') }}</text>
					<text class="legal-copy">{{ t('privacyRetentionCopy') }}</text>
					<text class="legal-section">{{ t('privacyControlsTitle') }}</text>
					<text class="legal-copy">{{ t('privacyControlsCopy') }}</text>
					<text class="legal-section">{{ t('privacyContactTitle') }}</text>
					<text class="legal-copy">{{ t('privacyContactCopy') }}</text>
					<button class="secondary-action" @click="activeTab = 'settings'">{{ t('backToSettings') }}</button>
				</view>

				<view v-else-if="activeTab === 'disclaimer'" class="panel legal-page">
					<text class="legal-updated">{{ t('disclaimerUpdated') }}</text>
					<text class="legal-title">{{ t('disclaimerTitle') }}</text>
					<text class="legal-copy">{{ t('disclaimerIntro') }}</text>
					<text class="legal-section">{{ t('disclaimerTaxTitle') }}</text>
					<text class="legal-copy">{{ t('disclaimerTaxCopy') }}</text>
					<text class="legal-section">{{ t('disclaimerCalcTitle') }}</text>
					<text class="legal-copy">{{ t('disclaimerCalcCopy') }}</text>
					<text class="legal-section">{{ t('disclaimerVehicleTitle') }}</text>
					<text class="legal-copy">{{ t('disclaimerVehicleCopy') }}</text>
					<button class="secondary-action" @click="activeTab = 'settings'">{{ t('backToSettings') }}</button>
				</view>

				<template v-else>
				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">{{ t('vehicleDefaults') }}</text>
						<view v-for="item in unitSettings" :key="item.label" class="setting-row">
							<view>
								<text>{{ item.label }}</text>
								<text>{{ item.description }}</text>
							</view>
							<text>{{ item.value }}</text>
						</view>
						<picker mode="selector" :range="distanceUnitLabels" :value="currentDistanceUnitIndex" @change="handleDistanceUnitChange">
							<view class="setting-row picker-row">
								<view>
									<text>{{ t('settingDistance') }}</text>
									<text>{{ t('distancePickerDescription') }}</text>
								</view>
								<view class="picker-value">
									<text>{{ distanceUnitLabel }}</text>
									<text>⌄</text>
								</view>
							</view>
						</picker>
						<picker mode="selector" :range="currencyLabels" :value="currentCurrencyIndex" @change="handleCurrencyChange">
							<view class="setting-row picker-row">
								<view>
									<text>{{ t('settingCurrency') }}</text>
									<text>{{ t('currencyPickerDescription') }}</text>
								</view>
								<view class="picker-value">
									<text>{{ currency }}</text>
									<text>⌄</text>
								</view>
							</view>
						</picker>
					</view>
				</view>

				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">{{ t('dataAndExport') }}</text>
						<view v-for="item in exportSettings" :key="item.label" class="setting-row">
							<view>
								<text>{{ item.label }}</text>
								<text>{{ item.description }}</text>
							</view>
							<text>{{ item.value }}</text>
						</view>
						<picker mode="selector" :range="categoryLabels" :value="currentDefaultCategoryIndex" @change="handleDefaultCategoryChange">
							<view class="setting-row picker-row">
								<view>
									<text>{{ t('defaultCategoryPicker') }}</text>
									<text>{{ t('defaultCategoryPickerDescription') }}</text>
								</view>
								<view class="picker-value">
									<text>{{ categoryLabel(defaultCategory) }}</text>
									<text>⌄</text>
								</view>
							</view>
						</picker>
						<picker mode="selector" :range="csvFormatLabels" :value="currentCsvFormatIndex" @change="handleCsvFormatChange">
							<view class="setting-row picker-row">
								<view>
									<text>{{ t('settingCsvFormat') }}</text>
									<text>{{ t('csvFormatPickerDescription') }}</text>
								</view>
								<view class="picker-value">
									<text>{{ currentCsvFormatLabel }}</text>
									<text>⌄</text>
								</view>
							</view>
						</picker>
						<picker mode="selector" :range="taxSummaryLabels" :value="currentTaxSummaryIndex" @change="handleTaxSummaryChange">
							<view class="setting-row picker-row">
								<view>
									<text>{{ t('settingTaxSummary') }}</text>
									<text>{{ t('taxSummaryPickerDescription') }}</text>
								</view>
								<view class="picker-value">
									<text>{{ currentTaxSummaryLabel }}</text>
									<text>⌄</text>
								</view>
							</view>
						</picker>
					</view>
				</view>

				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">{{ t('appGroup') }}</text>
						<picker mode="selector" :range="languageLabels" :value="currentLanguageIndex" @change="handleLanguageChange">
							<view class="setting-row picker-row">
								<view>
									<text>{{ t('language') }}</text>
									<text>{{ t('languageDescription') }}</text>
								</view>
								<view class="picker-value">
									<text>{{ currentLanguage.label }}</text>
									<text>⌄</text>
								</view>
							</view>
						</picker>
						<view class="setting-row">
							<view>
								<text>{{ t('theme') }}</text>
								<text>{{ t('themeDescription') }}</text>
							</view>
							<text>{{ t('themeLight') }}</text>
						</view>
						<button class="danger-action" @click="resetSampleData">{{ t('resetData') }}</button>
					</view>
				</view>

				<view class="panel settings-panel">
					<view class="settings-group">
						<text class="settings-group-title">{{ t('legalGroup') }}</text>
						<view class="setting-row tappable" @click="activeTab = 'privacy'">
							<view>
								<text>{{ t('privacyTitle') }}</text>
								<text>{{ t('privacyRowDescription') }}</text>
							</view>
							<text>{{ t('view') }}</text>
						</view>
						<view class="setting-row tappable" @click="activeTab = 'disclaimer'">
							<view>
								<text>{{ t('disclaimerTitle') }}</text>
								<text>{{ t('disclaimerRowDescription') }}</text>
							</view>
							<text>{{ t('view') }}</text>
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
				<text>{{ t(tab.labelKey) }}</text>
			</view>
			<button class="fab" @click="openAddFuel">＋</button>
		</view>
	</view>
</template>

<script>
const messages = {
	en: {
		navDashboard: 'Dashboard',
		navLogs: 'Logs',
		navGarage: 'Garage',
		navReports: 'Reports',
		dashboardEyebrow: 'FuelFlow',
		dashboardTitle: 'Dashboard',
		addFuelEyebrow: 'Speed entry',
		addFuelTitle: 'Add Fuel',
		editFuelEyebrow: 'Edit record',
		editFuelTitle: 'Edit Fuel',
		logsEyebrow: 'Quick records',
		logsTitle: 'Logs',
		garageEyebrow: 'Multi-vehicle',
		garageTitle: 'Garage',
		addVehicleEyebrow: 'Garage',
		addVehicleTitle: 'Add Vehicle',
		editVehicleEyebrow: 'Garage',
		editVehicleTitle: 'Edit Vehicle',
		reportsEyebrow: 'Export ready',
		reportsTitle: 'Reports',
		settingsEyebrow: 'Preferences',
		settingsTitle: 'Settings',
		legalEyebrow: 'Legal',
		privacyTitleShort: 'Privacy',
		disclaimerTitleShort: 'Disclaimer',
		vehicleMark: 'Car',
		unitMilesShort: 'mi',
		unitGallonsShort: 'gal',
		unitMpg: 'MPG',
		thisMonth: 'This month',
		fuelSpend: 'Fuel spend',
		avgEconomy: 'Avg. economy',
		economyDelta: '+1.8 vs last month',
		fuelEconomy: 'Fuel economy',
		recentLogs: 'Recent logs',
		viewAll: 'View all',
		vehicle: 'Vehicle',
		station: 'Station',
		stationPlaceholder: 'e.g. Shell on Main',
		primary: 'Primary',
		date: 'Date',
		odometer: 'Odometer',
		fuelVolume: 'Gallons',
		totalCost: 'Total cost',
		unitPrice: 'Price per gallon',
		categoryBusiness: 'Business',
		categoryPersonal: 'Personal',
		fullTank: 'Full tank',
		notes: 'Notes',
		notePlaceholder: 'e.g. Highway commute',
		addFuelAction: 'Add fuel',
		fuel: 'Fuel',
		trip: 'Trip',
		expense: 'Expense',
		emptyFuelLog: 'Keep records lightweight and export-ready.',
		addVehicle: 'Add vehicle',
		spendingByCategory: 'Spending by category',
		exportCsv: 'Export CSV',
		vehicleDefaults: 'Vehicle defaults',
		dataAndExport: 'Data and export',
		appGroup: 'App',
		language: 'Language',
		languageDescription: 'Interface language for this device',
		theme: 'Theme',
		themeDescription: 'Warm paper canvas',
		themeLight: 'Light',
		legalGroup: 'Legal',
		view: 'View',
		backToSettings: 'Back to Settings',
		privacyTitle: 'Privacy Policy',
		privacyRowDescription: 'Data use, local records, and exports',
		privacyUpdated: 'Draft policy · June 24, 2026',
		privacyIntro: 'FuelFlow is designed as a personal fuel, mileage, and vehicle cost tracker. The current H5 prototype stores only sample data shown in the interface and does not connect to an account, analytics service, payment service, or cloud backend.',
		privacyInfoTitle: 'Information you may choose to record',
		privacyInfoCopy: 'A production version may let you record vehicle names, odometer readings, fuel volume, fuel price, total cost, trip category, expense notes, and export preferences. These records are used to calculate fuel economy, spending summaries, and export files.',
		privacyLocalTitle: 'Local-first expectation',
		privacyLocalCopy: 'FuelFlow should keep core records on the device unless cloud sync is clearly enabled by the user. If sync, login, crash reporting, analytics, or payment features are added later, this policy must be updated before release.',
		privacyExportsTitle: 'Exports',
		privacyExportsCopy: 'CSV or PDF exports are user-initiated. Exported files may contain mileage, cost, and category data, so users should review them before sharing with employers, accountants, or tax preparers.',
		disclaimerTitle: 'Disclaimer',
		disclaimerRowDescription: 'Tax, calculation, and vehicle limits',
		disclaimerUpdated: 'Draft notice · June 24, 2026',
		disclaimerIntro: 'FuelFlow provides tracking, calculation, and export tools for personal vehicle records. It does not provide tax, legal, accounting, insurance, vehicle maintenance, or financial advice.',
		disclaimerTaxTitle: 'Tax and business mileage',
		disclaimerTaxCopy: 'Business and Personal categories are organizational labels only. Users are responsible for confirming deduction eligibility, mileage rates, documentation rules, and filing requirements with qualified professionals or official guidance.',
		disclaimerCalcTitle: 'Calculation limits',
		disclaimerCalcCopy: 'Fuel economy and cost summaries depend on user-entered odometer, fuel volume, price, and full-tank status. Incomplete or incorrect records can produce inaccurate trends.',
		disclaimerVehicleTitle: 'Vehicle decisions',
		disclaimerVehicleCopy: 'FuelFlow may help users notice spending or fuel economy changes, but it is not a diagnostic tool. Maintenance, safety, and repair decisions should be made with qualified technicians.',
		settingDistance: 'Distance',
		settingDistanceDesc: 'Odometer and trip distance',
		settingDistanceValue: 'Miles',
		settingFuelVolume: 'Fuel volume',
		settingFuelVolumeDesc: 'Fuel input and fill-up logs',
		settingFuelVolumeValue: 'Gallons',
		settingEconomy: 'Economy',
		settingEconomyDesc: 'Dashboard trend and reports',
		settingEconomyValue: 'MPG',
		settingCurrency: 'Currency',
		settingCurrencyDesc: 'Fuel cost and export totals',
		settingCurrencyValue: 'USD',
		settingDefaultCategory: 'Default category',
		settingDefaultCategoryDesc: 'Applied to new fuel logs',
		settingCsvFormat: 'CSV format',
		settingCsvFormatDesc: 'Date, vehicle, odometer, volume, cost',
		settingCsvFormatValue: 'Standard',
		settingTaxSummary: 'Tax summary',
		settingTaxSummaryDesc: 'Business and personal totals',
		settingTaxSummaryValue: 'Enabled',
		allVehicles: 'All vehicles',
		allCategories: 'All categories',
		rangeAll: 'All time',
		rangeThisMonth: 'This month',
		rangeLast30: 'Last 30 days',
		filteredTotal: 'Filtered total',
		csvStandard: 'Standard',
		csvTaxReady: 'Tax-ready',
		taxSummaryEnabled: 'Enabled',
		taxSummaryDisabled: 'Disabled',
		csvFormatPickerDescription: 'Choose standard or tax-ready columns',
		taxSummaryPickerDescription: 'Include category totals in CSV',
		noFuelLogs: 'No fuel logs',
		noRecordsYet: 'no records yet',
		lastUpdated: 'last updated {date}',
		formError: 'Enter date, odometer, gallons, total cost, and unit price.',
		fuelStop: 'Fuel stop',
		deleteLog: 'Delete',
		resetData: 'Reset sample data',
		exportReady: 'CSV export prepared.',
		exportUnsupported: 'CSV export is not available in this environment.',
		dataReset: 'Sample data restored.',
		saveChanges: 'Save changes',
		cancel: 'Cancel',
		editLog: 'Edit',
		defaultCategoryPicker: 'Default category picker',
		defaultCategoryPickerDescription: 'Used when opening Add Fuel',
		privacyChildrenTitle: 'Children privacy',
		privacyChildrenCopy: 'FuelFlow is not designed for children and should not knowingly collect personal information from children.',
		privacyRetentionTitle: 'Data retention and deletion',
		privacyRetentionCopy: 'Local records remain on the device until the user edits, deletes, exports, clears, or uninstalls the app. Users should keep their own backup of exported records.',
		privacyControlsTitle: 'User controls',
		privacyControlsCopy: 'Users can delete individual fuel logs, reset sample data, and export CSV records from within the app.',
		privacyContactTitle: 'Contact',
		privacyContactCopy: 'Before store release, this policy must include a working support contact and the legal publisher name.',
		vehicleName: 'Vehicle name',
		vehicleNamePlaceholder: 'e.g. Work Van',
		saveVehicle: 'Save vehicle',
		updateVehicle: 'Update vehicle',
		vehicleDeleteLastError: 'Keep at least one vehicle in the garage.',
		vehicleFormError: 'Enter vehicle name, odometer, and average economy.',
		distancePickerDescription: 'Display distance labels for records',
		currencyPickerDescription: 'Display currency symbol for totals'
	},
	es: {
		navDashboard: 'Panel',
		navLogs: 'Registros',
		navGarage: 'Garaje',
		navReports: 'Informes',
		dashboardEyebrow: 'FuelFlow',
		dashboardTitle: 'Panel',
		addFuelEyebrow: 'Entrada rápida',
		addFuelTitle: 'Agregar combustible',
		logsEyebrow: 'Registros rápidos',
		logsTitle: 'Registros',
		garageEyebrow: 'Varios vehículos',
		garageTitle: 'Garaje',
		reportsEyebrow: 'Listo para exportar',
		reportsTitle: 'Informes',
		settingsEyebrow: 'Preferencias',
		settingsTitle: 'Ajustes',
		legalEyebrow: 'Legal',
		privacyTitleShort: 'Privacidad',
		disclaimerTitleShort: 'Aviso',
		vehicleMark: 'Auto',
		unitMilesShort: 'mi',
		unitGallonsShort: 'gal',
		unitMpg: 'MPG',
		thisMonth: 'Este mes',
		fuelSpend: 'Gasto de combustible',
		avgEconomy: 'Consumo medio',
		economyDelta: '+1.8 vs mes anterior',
		fuelEconomy: 'Rendimiento',
		recentLogs: 'Registros recientes',
		viewAll: 'Ver todo',
		vehicle: 'Vehículo',
		station: 'Estación',
		stationPlaceholder: 'p. ej. Shell en Main',
		primary: 'Principal',
		date: 'Fecha',
		odometer: 'Odómetro',
		fuelVolume: 'Galones',
		totalCost: 'Costo total',
		unitPrice: 'Precio por galón',
		categoryBusiness: 'Trabajo',
		categoryPersonal: 'Personal',
		fullTank: 'Tanque lleno',
		notes: 'Notas',
		notePlaceholder: 'p. ej. viaje por autopista',
		addFuelAction: 'Agregar combustible',
		fuel: 'Combustible',
		trip: 'Viaje',
		expense: 'Gasto',
		emptyFuelLog: 'Mantén registros ligeros y listos para exportar.',
		addVehicle: 'Agregar vehículo',
		spendingByCategory: 'Gasto por categoría',
		exportCsv: 'Exportar CSV',
		vehicleDefaults: 'Valores del vehículo',
		dataAndExport: 'Datos y exportación',
		appGroup: 'App',
		language: 'Idioma',
		languageDescription: 'Idioma de la interfaz en este dispositivo',
		theme: 'Tema',
		themeDescription: 'Lienzo cálido tipo papel',
		themeLight: 'Claro',
		legalGroup: 'Legal',
		view: 'Ver',
		backToSettings: 'Volver a Ajustes',
		privacyTitle: 'Política de privacidad',
		privacyRowDescription: 'Uso de datos, registros locales y exportaciones',
		privacyUpdated: 'Borrador de política · 24 de junio de 2026',
		privacyIntro: 'FuelFlow está diseñado como un registro personal de combustible, millaje y costos del vehículo. El prototipo H5 actual solo usa datos de ejemplo en la interfaz y no se conecta a cuentas, analítica, pagos ni servicios en la nube.',
		privacyInfoTitle: 'Información que puedes registrar',
		privacyInfoCopy: 'Una versión de producción puede permitir registrar nombres de vehículos, lecturas de odómetro, volumen de combustible, precio, costo total, categoría del viaje, notas de gastos y preferencias de exportación.',
		privacyLocalTitle: 'Enfoque local primero',
		privacyLocalCopy: 'FuelFlow debe mantener los registros principales en el dispositivo salvo que el usuario active claramente la sincronización en la nube.',
		privacyExportsTitle: 'Exportaciones',
		privacyExportsCopy: 'Las exportaciones CSV o PDF son iniciadas por el usuario. Pueden contener millaje, costos y categorías, por lo que conviene revisarlas antes de compartirlas.',
		disclaimerTitle: 'Aviso legal',
		disclaimerRowDescription: 'Impuestos, cálculos y límites del vehículo',
		disclaimerUpdated: 'Borrador de aviso · 24 de junio de 2026',
		disclaimerIntro: 'FuelFlow ofrece herramientas de registro, cálculo y exportación para vehículos personales. No ofrece asesoría fiscal, legal, contable, de seguros, mantenimiento ni financiera.',
		disclaimerTaxTitle: 'Impuestos y millaje laboral',
		disclaimerTaxCopy: 'Las categorías Trabajo y Personal son solo etiquetas organizativas. El usuario debe confirmar requisitos y deducciones con profesionales o fuentes oficiales.',
		disclaimerCalcTitle: 'Límites de cálculo',
		disclaimerCalcCopy: 'El rendimiento y los costos dependen de los datos ingresados por el usuario. Registros incompletos o incorrectos pueden producir tendencias imprecisas.',
		disclaimerVehicleTitle: 'Decisiones del vehículo',
		disclaimerVehicleCopy: 'FuelFlow puede ayudar a notar cambios de costo o consumo, pero no es una herramienta de diagnóstico.',
		settingDistance: 'Distancia',
		settingDistanceDesc: 'Odómetro y distancia de viaje',
		settingDistanceValue: 'Millas',
		settingFuelVolume: 'Volumen',
		settingFuelVolumeDesc: 'Entrada y registros de combustible',
		settingFuelVolumeValue: 'Galones',
		settingEconomy: 'Rendimiento',
		settingEconomyDesc: 'Tendencias e informes',
		settingEconomyValue: 'MPG',
		settingCurrency: 'Moneda',
		settingCurrencyDesc: 'Costos y totales de exportación',
		settingCurrencyValue: 'USD',
		settingDefaultCategory: 'Categoría predeterminada',
		settingDefaultCategoryDesc: 'Aplicada a nuevos registros',
		settingCsvFormat: 'Formato CSV',
		settingCsvFormatDesc: 'Fecha, vehículo, odómetro, volumen, costo',
		settingCsvFormatValue: 'Estándar',
		settingTaxSummary: 'Resumen fiscal',
		settingTaxSummaryDesc: 'Totales de trabajo y personal',
		settingTaxSummaryValue: 'Activado',
		noFuelLogs: 'Sin registros',
		noRecordsYet: 'sin registros',
		lastUpdated: 'actualizado {date}',
		formError: 'Ingresa fecha, odómetro, galones, costo total y precio unitario.',
		fuelStop: 'Carga de combustible',
		deleteLog: 'Eliminar',
		resetData: 'Restaurar datos de ejemplo',
		exportReady: 'CSV preparado.',
		exportUnsupported: 'La exportación CSV no está disponible en este entorno.',
		dataReset: 'Datos de ejemplo restaurados.'
	},
	'zh-Hans': {
		navDashboard: '仪表盘',
		navLogs: '记录',
		navGarage: '车库',
		navReports: '报表',
		dashboardEyebrow: 'FuelFlow',
		dashboardTitle: '仪表盘',
		addFuelEyebrow: '快速录入',
		addFuelTitle: '添加加油记录',
		editFuelEyebrow: '编辑记录',
		editFuelTitle: '编辑加油记录',
		logsEyebrow: '快速记录',
		logsTitle: '记录',
		garageEyebrow: '多车辆',
		garageTitle: '车库',
		addVehicleEyebrow: '车库',
		addVehicleTitle: '添加车辆',
		editVehicleEyebrow: '车库',
		editVehicleTitle: '编辑车辆',
		reportsEyebrow: '导出准备',
		reportsTitle: '报表',
		settingsEyebrow: '偏好设置',
		settingsTitle: '设置',
		legalEyebrow: '法律信息',
		privacyTitleShort: '隐私',
		disclaimerTitleShort: '免责声明',
		vehicleMark: '车',
		unitMilesShort: 'mi',
		unitGallonsShort: 'gal',
		unitMpg: 'MPG',
		thisMonth: '本月',
		fuelSpend: '燃油支出',
		avgEconomy: '平均油耗',
		economyDelta: '较上月 +1.8',
		fuelEconomy: '燃油经济性',
		recentLogs: '最近记录',
		viewAll: '查看全部',
		vehicle: '车辆',
		station: '加油站',
		stationPlaceholder: '例如：Main 街 Shell',
		primary: '默认',
		date: '日期',
		odometer: '里程表',
		fuelVolume: '加油量',
		totalCost: '总金额',
		unitPrice: '每加仑价格',
		categoryBusiness: '商务',
		categoryPersonal: '个人',
		fullTank: '已加满',
		notes: '备注',
		notePlaceholder: '例如：高速通勤',
		addFuelAction: '添加加油记录',
		fuel: '加油',
		trip: '行程',
		expense: '支出',
		emptyFuelLog: '保持记录轻量，并随时可导出。',
		addVehicle: '添加车辆',
		spendingByCategory: '按类别统计支出',
		exportCsv: '导出 CSV',
		vehicleDefaults: '车辆默认值',
		dataAndExport: '数据与导出',
		appGroup: '应用',
		language: '语言',
		languageDescription: '此设备上的界面语言',
		theme: '主题',
		themeDescription: '暖色纸张背景',
		themeLight: '浅色',
		legalGroup: '法律信息',
		view: '查看',
		backToSettings: '返回设置',
		privacyTitle: '隐私政策',
		privacyRowDescription: '数据使用、本地记录和导出',
		privacyUpdated: '政策草案 · 2026 年 6 月 24 日',
		privacyIntro: 'FuelFlow 是个人燃油、里程和用车成本记录工具。当前 H5 原型只使用界面样例数据，不连接账号、分析服务、支付服务或云端后端。',
		privacyInfoTitle: '你可以选择记录的信息',
		privacyInfoCopy: '正式版本可能允许记录车辆名称、里程表读数、燃油量、油价、总金额、行程类别、支出备注和导出偏好。',
		privacyLocalTitle: '本地优先预期',
		privacyLocalCopy: '除非用户明确开启云同步，FuelFlow 应将核心记录保存在设备本地。',
		privacyExportsTitle: '导出',
		privacyExportsCopy: 'CSV 或 PDF 导出由用户主动触发。导出文件可能包含里程、成本和类别数据，分享前应自行检查。',
		disclaimerTitle: '免责声明',
		disclaimerRowDescription: '税务、计算和车辆决策边界',
		disclaimerUpdated: '声明草案 · 2026 年 6 月 24 日',
		disclaimerIntro: 'FuelFlow 提供个人车辆记录、计算和导出工具，不提供税务、法律、会计、保险、车辆维修或财务建议。',
		disclaimerTaxTitle: '税务与商务里程',
		disclaimerTaxCopy: '商务和个人分类仅用于整理记录。用户应自行向专业人士或官方来源确认抵扣资格、记录要求和申报规则。',
		disclaimerCalcTitle: '计算限制',
		disclaimerCalcCopy: '油耗和成本汇总取决于用户输入的里程、油量、价格和加满状态。不完整或错误记录可能导致趋势不准确。',
		disclaimerVehicleTitle: '车辆决策',
		disclaimerVehicleCopy: 'FuelFlow 可以帮助发现支出或油耗变化，但不是诊断工具。',
		settingDistance: '距离',
		settingDistanceDesc: '里程表和行程距离',
		settingDistanceValue: '英里',
		settingFuelVolume: '燃油量',
		settingFuelVolumeDesc: '加油输入和加油记录',
		settingFuelVolumeValue: '加仑',
		settingEconomy: '油耗',
		settingEconomyDesc: '仪表盘趋势和报表',
		settingEconomyValue: 'MPG',
		settingCurrency: '货币',
		settingCurrencyDesc: '燃油成本和导出合计',
		settingCurrencyValue: 'USD',
		settingDefaultCategory: '默认分类',
		settingDefaultCategoryDesc: '用于新的加油记录',
		settingCsvFormat: 'CSV 格式',
		settingCsvFormatDesc: '日期、车辆、里程、油量、成本',
		settingCsvFormatValue: '标准',
		settingTaxSummary: '税务汇总',
		settingTaxSummaryDesc: '商务和个人合计',
		settingTaxSummaryValue: '启用',
		noFuelLogs: '暂无加油记录',
		noRecordsYet: '暂无记录',
		lastUpdated: '更新于 {date}',
		formError: '请输入日期、里程、加油量、总金额和单价。',
		fuelStop: '加油站',
		deleteLog: '删除',
		resetData: '重置样例数据',
		exportReady: 'CSV 导出已准备好。',
		exportUnsupported: '当前环境不支持 CSV 导出。',
		dataReset: '样例数据已恢复。',
		saveChanges: '保存修改',
		cancel: '取消',
		editLog: '编辑',
		defaultCategoryPicker: '默认分类选择',
		defaultCategoryPickerDescription: '打开添加加油记录时使用',
		privacyChildrenTitle: '儿童隐私',
		privacyChildrenCopy: 'FuelFlow 不面向儿童设计，也不应有意收集儿童个人信息。',
		privacyRetentionTitle: '数据保留与删除',
		privacyRetentionCopy: '本地记录会保留在设备上，直到用户编辑、删除、导出、清空或卸载应用。用户应自行备份导出的记录。',
		privacyControlsTitle: '用户控制',
		privacyControlsCopy: '用户可以在应用内删除单条加油记录、恢复样例数据，并导出 CSV 记录。',
		privacyContactTitle: '联系方式',
		privacyContactCopy: '正式上架前，本政策必须补充有效支持联系方式和法律发布主体。',
		vehicleName: '车辆名称',
		vehicleNamePlaceholder: '例如：工作面包车',
		saveVehicle: '保存车辆',
		updateVehicle: '更新车辆',
		vehicleDeleteLastError: '车库中至少需要保留一辆车。',
		vehicleFormError: '请输入车辆名称、里程和平均油耗。',
		distancePickerDescription: '用于记录展示的距离单位标签',
		currencyPickerDescription: '用于金额展示的货币符号'
	}
}

const extraLocaleMessages = {
	'zh-Hant': {
		navDashboard: '儀表板',
		navLogs: '記錄',
		navGarage: '車庫',
		navReports: '報表',
		dashboardTitle: '儀表板',
		addFuelEyebrow: '快速輸入',
		addFuelTitle: '新增加油記錄',
		logsTitle: '記錄',
		garageTitle: '車庫',
		reportsTitle: '報表',
		settingsEyebrow: '偏好設定',
		settingsTitle: '設定',
		vehicleMark: '車',
		thisMonth: '本月',
		fuelSpend: '燃油支出',
		avgEconomy: '平均油耗',
		fuelEconomy: '燃油經濟性',
		recentLogs: '最近記錄',
		viewAll: '查看全部',
		vehicle: '車輛',
		primary: '預設',
		date: '日期',
		odometer: '里程表',
		fuelVolume: '加油量',
		totalCost: '總金額',
		unitPrice: '每加侖價格',
		categoryBusiness: '商務',
		categoryPersonal: '個人',
		fullTank: '已加滿',
		notes: '備註',
		notePlaceholder: '例如：高速通勤',
		addFuelAction: '新增加油記錄',
		fuel: '加油',
		trip: '行程',
		expense: '支出',
		addVehicle: '新增車輛',
		spendingByCategory: '按類別統計支出',
		exportCsv: '匯出 CSV',
		vehicleDefaults: '車輛預設值',
		dataAndExport: '資料與匯出',
		appGroup: '應用',
		language: '語言',
		languageDescription: '此裝置上的介面語言',
		theme: '主題',
		themeDescription: '暖色紙張背景',
		themeLight: '淺色',
		legalGroup: '法律資訊',
		view: '查看',
		backToSettings: '返回設定',
		privacyTitle: '隱私權政策',
		disclaimerTitle: '免責聲明',
		noFuelLogs: '暫無加油記錄',
		noRecordsYet: '暫無記錄',
		lastUpdated: '更新於 {date}',
		formError: '請輸入日期、里程、加油量、總金額和單價。',
		fuelStop: '加油站'
	},
	fr: {
		navDashboard: 'Tableau',
		navLogs: 'Journaux',
		navGarage: 'Garage',
		navReports: 'Rapports',
		dashboardTitle: 'Tableau',
		addFuelEyebrow: 'Saisie rapide',
		addFuelTitle: 'Ajouter du carburant',
		logsTitle: 'Journaux',
		garageTitle: 'Garage',
		reportsTitle: 'Rapports',
		settingsEyebrow: 'Préférences',
		settingsTitle: 'Paramètres',
		thisMonth: 'Ce mois-ci',
		fuelSpend: 'Dépenses carburant',
		avgEconomy: 'Conso. moyenne',
		fuelEconomy: 'Consommation',
		recentLogs: 'Journaux récents',
		viewAll: 'Tout voir',
		vehicle: 'Véhicule',
		primary: 'Principal',
		date: 'Date',
		odometer: 'Compteur',
		fuelVolume: 'Gallons',
		totalCost: 'Coût total',
		unitPrice: 'Prix par gallon',
		categoryBusiness: 'Pro',
		categoryPersonal: 'Perso',
		fullTank: 'Plein',
		notes: 'Notes',
		notePlaceholder: 'ex. trajet autoroute',
		addFuelAction: 'Ajouter',
		fuel: 'Carburant',
		trip: 'Trajet',
		expense: 'Dépense',
		addVehicle: 'Ajouter véhicule',
		spendingByCategory: 'Dépenses par catégorie',
		exportCsv: 'Exporter CSV',
		vehicleDefaults: 'Valeurs véhicule',
		dataAndExport: 'Données et export',
		language: 'Langue',
		languageDescription: 'Langue de l’interface',
		theme: 'Thème',
		themeLight: 'Clair',
		legalGroup: 'Mentions légales',
		view: 'Voir',
		backToSettings: 'Retour aux paramètres',
		privacyTitle: 'Politique de confidentialité',
		disclaimerTitle: 'Avertissement',
		lastUpdated: 'mis à jour le {date}',
		formError: 'Saisissez la date, le compteur, les gallons, le coût total et le prix unitaire.',
		fuelStop: 'Arrêt carburant'
	},
	de: {
		navDashboard: 'Übersicht',
		navLogs: 'Einträge',
		navGarage: 'Garage',
		navReports: 'Berichte',
		dashboardTitle: 'Übersicht',
		addFuelEyebrow: 'Schnelleingabe',
		addFuelTitle: 'Tanken erfassen',
		logsTitle: 'Einträge',
		garageTitle: 'Garage',
		reportsTitle: 'Berichte',
		settingsEyebrow: 'Einstellungen',
		settingsTitle: 'Einstellungen',
		thisMonth: 'Dieser Monat',
		fuelSpend: 'Kraftstoffkosten',
		avgEconomy: 'Durchschnitt',
		fuelEconomy: 'Verbrauch',
		recentLogs: 'Letzte Einträge',
		viewAll: 'Alle anzeigen',
		vehicle: 'Fahrzeug',
		primary: 'Primär',
		date: 'Datum',
		odometer: 'Kilometerstand',
		fuelVolume: 'Gallonen',
		totalCost: 'Gesamtkosten',
		unitPrice: 'Preis pro Gallone',
		categoryBusiness: 'Geschäftlich',
		categoryPersonal: 'Privat',
		fullTank: 'Vollgetankt',
		notes: 'Notizen',
		addFuelAction: 'Speichern',
		fuel: 'Kraftstoff',
		trip: 'Fahrt',
		expense: 'Ausgabe',
		addVehicle: 'Fahrzeug hinzufügen',
		spendingByCategory: 'Ausgaben nach Kategorie',
		exportCsv: 'CSV exportieren',
		language: 'Sprache',
		languageDescription: 'Oberflächensprache',
		theme: 'Design',
		themeLight: 'Hell',
		privacyTitle: 'Datenschutz',
		disclaimerTitle: 'Haftungsausschluss',
		lastUpdated: 'aktualisiert {date}',
		fuelStop: 'Tankstopp'
	},
	ja: {
		navDashboard: 'ダッシュボード',
		navLogs: '記録',
		navGarage: 'ガレージ',
		navReports: 'レポート',
		dashboardTitle: 'ダッシュボード',
		addFuelEyebrow: 'クイック入力',
		addFuelTitle: '給油を追加',
		logsTitle: '記録',
		garageTitle: 'ガレージ',
		reportsTitle: 'レポート',
		settingsEyebrow: '設定',
		settingsTitle: '設定',
		thisMonth: '今月',
		fuelSpend: '燃料費',
		avgEconomy: '平均燃費',
		fuelEconomy: '燃費',
		recentLogs: '最近の記録',
		viewAll: 'すべて見る',
		vehicle: '車両',
		primary: 'メイン',
		date: '日付',
		odometer: '走行距離',
		fuelVolume: '給油量',
		totalCost: '合計金額',
		unitPrice: '単価',
		categoryBusiness: '仕事',
		categoryPersonal: '個人',
		fullTank: '満タン',
		notes: 'メモ',
		addFuelAction: '追加',
		fuel: '給油',
		trip: '移動',
		expense: '支出',
		addVehicle: '車両を追加',
		spendingByCategory: 'カテゴリ別支出',
		exportCsv: 'CSVを書き出す',
		language: '言語',
		languageDescription: 'この端末の表示言語',
		theme: 'テーマ',
		themeLight: 'ライト',
		privacyTitle: 'プライバシーポリシー',
		disclaimerTitle: '免責事項',
		lastUpdated: '{date} 更新',
		fuelStop: '給油'
	},
	ko: {
		navDashboard: '대시보드',
		navLogs: '기록',
		navGarage: '차고',
		navReports: '보고서',
		dashboardTitle: '대시보드',
		addFuelEyebrow: '빠른 입력',
		addFuelTitle: '주유 추가',
		logsTitle: '기록',
		garageTitle: '차고',
		reportsTitle: '보고서',
		settingsEyebrow: '환경설정',
		settingsTitle: '설정',
		thisMonth: '이번 달',
		fuelSpend: '연료비',
		avgEconomy: '평균 연비',
		fuelEconomy: '연비',
		recentLogs: '최근 기록',
		viewAll: '전체 보기',
		vehicle: '차량',
		primary: '기본',
		date: '날짜',
		odometer: '주행거리',
		fuelVolume: '주유량',
		totalCost: '총액',
		unitPrice: '단가',
		categoryBusiness: '업무',
		categoryPersonal: '개인',
		fullTank: '가득 주유',
		notes: '메모',
		addFuelAction: '추가',
		fuel: '주유',
		trip: '이동',
		expense: '지출',
		addVehicle: '차량 추가',
		spendingByCategory: '카테고리별 지출',
		exportCsv: 'CSV 내보내기',
		language: '언어',
		languageDescription: '이 기기의 표시 언어',
		theme: '테마',
		themeLight: '라이트',
		privacyTitle: '개인정보 처리방침',
		disclaimerTitle: '면책 조항',
		lastUpdated: '{date} 업데이트',
		fuelStop: '주유'
	},
	pt: {
		navDashboard: 'Painel',
		navLogs: 'Registros',
		navGarage: 'Garagem',
		navReports: 'Relatórios',
		dashboardTitle: 'Painel',
		addFuelEyebrow: 'Entrada rápida',
		addFuelTitle: 'Adicionar combustível',
		logsTitle: 'Registros',
		garageTitle: 'Garagem',
		reportsTitle: 'Relatórios',
		settingsEyebrow: 'Preferências',
		settingsTitle: 'Configurações',
		thisMonth: 'Este mês',
		fuelSpend: 'Gasto com combustível',
		avgEconomy: 'Média de consumo',
		fuelEconomy: 'Consumo',
		recentLogs: 'Registros recentes',
		viewAll: 'Ver tudo',
		vehicle: 'Veículo',
		primary: 'Principal',
		date: 'Data',
		odometer: 'Odômetro',
		fuelVolume: 'Galões',
		totalCost: 'Custo total',
		unitPrice: 'Preço por galão',
		categoryBusiness: 'Trabalho',
		categoryPersonal: 'Pessoal',
		fullTank: 'Tanque cheio',
		notes: 'Notas',
		addFuelAction: 'Adicionar',
		fuel: 'Combustível',
		trip: 'Viagem',
		expense: 'Despesa',
		addVehicle: 'Adicionar veículo',
		spendingByCategory: 'Gasto por categoria',
		exportCsv: 'Exportar CSV',
		language: 'Idioma',
		languageDescription: 'Idioma da interface',
		theme: 'Tema',
		themeLight: 'Claro',
		privacyTitle: 'Política de privacidade',
		disclaimerTitle: 'Aviso legal',
		lastUpdated: 'atualizado em {date}',
		fuelStop: 'Abastecimento'
	}
}

Object.keys(extraLocaleMessages).forEach((locale) => {
	const base = locale === 'zh-Hant' ? messages['zh-Hans'] : messages.en
	messages[locale] = { ...base, ...extraLocaleMessages[locale] }
})

const metaKeys = {
	dashboard: { eyebrow: 'dashboardEyebrow', title: 'dashboardTitle' },
	addFuel: { eyebrow: 'addFuelEyebrow', title: 'addFuelTitle' },
	editFuel: { eyebrow: 'editFuelEyebrow', title: 'editFuelTitle' },
	logs: { eyebrow: 'logsEyebrow', title: 'logsTitle' },
	garage: { eyebrow: 'garageEyebrow', title: 'garageTitle' },
	addVehicle: { eyebrow: 'addVehicleEyebrow', title: 'addVehicleTitle' },
	editVehicle: { eyebrow: 'editVehicleEyebrow', title: 'editVehicleTitle' },
	reports: { eyebrow: 'reportsEyebrow', title: 'reportsTitle' },
	settings: { eyebrow: 'settingsEyebrow', title: 'settingsTitle' },
	privacy: { eyebrow: 'legalEyebrow', title: 'privacyTitleShort' },
	disclaimer: { eyebrow: 'legalEyebrow', title: 'disclaimerTitleShort' }
}

export default {
	data() {
		return {
			activeTab: 'dashboard',
			isRestoringState: false,
			locale: 'en',
			languages: [
				{ key: 'en', label: 'English', short: 'EN' },
				{ key: 'es', label: 'Español', short: 'ES' },
				{ key: 'zh-Hans', label: '简体中文', short: '简' },
				{ key: 'zh-Hant', label: '繁體中文', short: '繁' },
				{ key: 'fr', label: 'Français', short: 'FR' },
				{ key: 'de', label: 'Deutsch', short: 'DE' },
				{ key: 'ja', label: '日本語', short: '日' },
				{ key: 'ko', label: '한국어', short: '한' },
				{ key: 'pt', label: 'Português', short: 'PT' }
			],
			tabs: [
				{ key: 'dashboard', labelKey: 'navDashboard', mark: 'D' },
				{ key: 'logs', labelKey: 'navLogs', mark: 'L' },
				{ key: 'garage', labelKey: 'navGarage', mark: 'G' },
				{ key: 'reports', labelKey: 'navReports', mark: 'R' }
			],
			logs: [
				{ id: 'fuel-3', vehicleId: 'daily-sedan', date: '2026-06-20', station: 'Shell Station', odometer: 32560, volume: 10.123, totalCost: 37.05, unitPrice: 3.66, category: 'Business', fullTank: true, note: 'Client route' },
				{ id: 'fuel-2', vehicleId: 'daily-sedan', date: '2026-06-12', station: 'Exxon', odometer: 32242, volume: 9.456, totalCost: 34.20, unitPrice: 3.62, category: 'Personal', fullTank: true, note: 'Weekend errands' },
				{ id: 'fuel-1', vehicleId: 'weekend-suv', date: '2026-06-05', station: 'Chevron', odometer: 31944, volume: 9.870, totalCost: 35.60, unitPrice: 3.61, category: 'Business', fullTank: true, note: 'Airport pickup' }
			],
			vehicles: [
				{ id: 'daily-sedan', name: 'Daily Sedan', odometer: 32560, economy: '31.4', primary: true },
				{ id: 'weekend-suv', name: 'Weekend SUV', odometer: 15210, economy: '24.7', primary: false }
			],
			distanceUnit: 'mi',
			currency: 'USD',
			defaultCategory: 'Personal',
			logVehicleFilter: 'all',
			logCategoryFilter: 'all',
			logDateRange: 'all',
			reportDateRange: 'all',
			csvFormat: 'standard',
			taxSummaryEnabled: true,
			fuelCategory: 'Personal',
			fuelForm: {
				vehicleId: 'daily-sedan',
				date: '2026-06-25',
				station: '',
				odometer: '32884',
				volume: '10.100',
				totalCost: '36.86',
				unitPrice: '3.650',
				fullTank: true,
				note: ''
			},
			editLogId: '',
			editForm: {
				vehicleId: '',
				date: '',
				station: '',
				odometer: '',
				volume: '',
				totalCost: '',
				unitPrice: '',
				category: 'Personal',
				fullTank: true,
				note: ''
			},
			vehicleForm: {
				name: '',
				odometer: '',
				economy: ''
			},
			vehicleEditId: '',
			lastEditedPriceField: 'unitPrice',
			formMessage: '',
			exportMessage: '',
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
	mounted() {
		this.restoreAppState()
	},
	watch: {
		logs: {
			deep: true,
			handler() {
				this.persistAppState()
			}
		},
		vehicles: {
			deep: true,
			handler() {
				this.persistAppState()
			}
		},
		locale() {
			this.persistAppState()
		},
		defaultCategory() {
			this.persistAppState()
		},
		distanceUnit() {
			this.persistAppState()
		},
		currency() {
			this.persistAppState()
		},
		logVehicleFilter() {
			this.persistAppState()
		},
		logCategoryFilter() {
			this.persistAppState()
		},
		logDateRange() {
			this.persistAppState()
		},
		reportDateRange() {
			this.persistAppState()
		},
		csvFormat() {
			this.persistAppState()
		},
		taxSummaryEnabled() {
			this.persistAppState()
		}
	},
	computed: {
		currentMeta() {
			const meta = metaKeys[this.activeTab] || metaKeys.dashboard
			return {
				eyebrow: this.t(meta.eyebrow),
				title: this.t(meta.title)
			}
		},
		currentLanguage() {
			return this.languages.find((language) => language.key === this.locale) || this.languages[0]
		},
		currentLanguageIndex() {
			return Math.max(0, this.languages.findIndex((language) => language.key === this.locale))
		},
		languageLabels() {
			return this.languages.map((language) => language.label)
		},
		categoryOptions() {
			return ['Business', 'Personal']
		},
		categoryLabels() {
			return this.categoryOptions.map((category) => this.categoryLabel(category))
		},
		distanceUnitOptions() {
			return [
				{ key: 'mi', label: this.t('settingDistanceValue') },
				{ key: 'km', label: 'Kilometers' }
			]
		},
		distanceUnitLabels() {
			return this.distanceUnitOptions.map((unit) => unit.label)
		},
		distanceUnitLabel() {
			return this.distanceUnitOptions.find((unit) => unit.key === this.distanceUnit)?.label || this.t('settingDistanceValue')
		},
		currentDistanceUnitIndex() {
			return Math.max(0, this.distanceUnitOptions.findIndex((unit) => unit.key === this.distanceUnit))
		},
		currencyOptions() {
			return ['USD', 'EUR', 'GBP', 'JPY', 'CNY']
		},
		currencyLabels() {
			return this.currencyOptions
		},
		currentCurrencyIndex() {
			return Math.max(0, this.currencyOptions.indexOf(this.currency))
		},
		currentDefaultCategoryIndex() {
			return Math.max(0, this.categoryOptions.indexOf(this.defaultCategory))
		},
		dateRangeOptions() {
			return [
				{ key: 'all', label: this.t('rangeAll') },
				{ key: 'thisMonth', label: this.t('rangeThisMonth') },
				{ key: 'last30', label: this.t('rangeLast30') }
			]
		},
		dateRangeLabels() {
			return this.dateRangeOptions.map((range) => range.label)
		},
		currentLogDateRangeIndex() {
			return Math.max(0, this.dateRangeOptions.findIndex((range) => range.key === this.logDateRange))
		},
		currentReportDateRangeIndex() {
			return Math.max(0, this.dateRangeOptions.findIndex((range) => range.key === this.reportDateRange))
		},
		currentLogDateRangeLabel() {
			return this.dateRangeOptions.find((range) => range.key === this.logDateRange)?.label || this.t('rangeAll')
		},
		logVehicleFilterOptions() {
			return [{ key: 'all', label: this.t('allVehicles') }, ...this.vehicles.map((vehicle) => ({ key: vehicle.id, label: vehicle.name }))]
		},
		logVehicleFilterLabels() {
			return this.logVehicleFilterOptions.map((vehicle) => vehicle.label)
		},
		currentLogVehicleFilterIndex() {
			return Math.max(0, this.logVehicleFilterOptions.findIndex((vehicle) => vehicle.key === this.logVehicleFilter))
		},
		currentLogVehicleFilterLabel() {
			return this.logVehicleFilterOptions.find((vehicle) => vehicle.key === this.logVehicleFilter)?.label || this.t('allVehicles')
		},
		logCategoryFilterOptions() {
			return [
				{ key: 'all', label: this.t('allCategories') },
				{ key: 'Business', label: this.categoryLabel('Business') },
				{ key: 'Personal', label: this.categoryLabel('Personal') }
			]
		},
		logCategoryFilterLabels() {
			return this.logCategoryFilterOptions.map((category) => category.label)
		},
		currentLogCategoryFilterIndex() {
			return Math.max(0, this.logCategoryFilterOptions.findIndex((category) => category.key === this.logCategoryFilter))
		},
		currentLogCategoryFilterLabel() {
			return this.logCategoryFilterOptions.find((category) => category.key === this.logCategoryFilter)?.label || this.t('allCategories')
		},
		csvFormatOptions() {
			return [
				{ key: 'standard', label: this.t('csvStandard') },
				{ key: 'taxReady', label: this.t('csvTaxReady') }
			]
		},
		csvFormatLabels() {
			return this.csvFormatOptions.map((format) => format.label)
		},
		currentCsvFormatIndex() {
			return Math.max(0, this.csvFormatOptions.findIndex((format) => format.key === this.csvFormat))
		},
		currentCsvFormatLabel() {
			return this.csvFormatOptions.find((format) => format.key === this.csvFormat)?.label || this.t('csvStandard')
		},
		taxSummaryOptions() {
			return [
				{ key: true, label: this.t('taxSummaryEnabled') },
				{ key: false, label: this.t('taxSummaryDisabled') }
			]
		},
		taxSummaryLabels() {
			return this.taxSummaryOptions.map((option) => option.label)
		},
		currentTaxSummaryIndex() {
			return this.taxSummaryEnabled ? 0 : 1
		},
		currentTaxSummaryLabel() {
			return this.taxSummaryEnabled ? this.t('taxSummaryEnabled') : this.t('taxSummaryDisabled')
		},
		currentVehicle() {
			return this.vehicles.find((vehicle) => vehicle.primary) || this.vehicles[0] || this.defaultVehicles()[0]
		},
		vehicleLabels() {
			return this.vehicles.map((vehicle) => vehicle.name)
		},
		fuelVehicle() {
			return this.vehicles.find((vehicle) => vehicle.id === this.fuelForm.vehicleId) || this.currentVehicle
		},
		editVehicle() {
			return this.vehicles.find((vehicle) => vehicle.id === this.editForm.vehicleId) || this.currentVehicle
		},
		currentFuelVehicleIndex() {
			return Math.max(0, this.vehicles.findIndex((vehicle) => vehicle.id === this.fuelVehicle.id))
		},
		currentEditVehicleIndex() {
			return Math.max(0, this.vehicles.findIndex((vehicle) => vehicle.id === this.editVehicle.id))
		},
		recentLogs() {
			return this.logs.slice(0, 3)
		},
		monthFuelSpend() {
			return this.logs.reduce((total, log) => total + Number(log.totalCost || 0), 0)
		},
		filteredLogs() {
			return this.logs.filter((log) => this.matchesFilters(log, {
				vehicleId: this.logVehicleFilter,
				category: this.logCategoryFilter,
				dateRange: this.logDateRange
			}))
		},
		filteredFuelSpend() {
			return this.filteredLogs.reduce((total, log) => total + Number(log.totalCost || 0), 0)
		},
		reportLogs() {
			return this.logs.filter((log) => this.matchesFilters(log, { dateRange: this.reportDateRange }))
		},
		reportFuelSpend() {
			return this.reportLogs.reduce((total, log) => total + Number(log.totalCost || 0), 0)
		},
		categoryTotals() {
			return this.reportLogs.reduce(
				(totals, log) => {
					const category = log.category === 'Business' ? 'Business' : 'Personal'
					totals[category] += Number(log.totalCost || 0)
					return totals
				},
				{ Business: 0, Personal: 0 }
			)
		},
		spendingItems() {
			return [
				{ name: 'Fuel', amount: this.money(this.reportFuelSpend), percent: this.reportFuelSpend > 0 ? '100.0%' : '0.0%', color: '#1A3644' },
				{ name: 'Maintenance', amount: this.money(0), percent: '0.0%', color: '#2B4C3F' },
				{ name: 'Tolls', amount: this.money(0), percent: '0.0%', color: '#B8792F' }
			]
		},
		averageEconomy() {
			const fullTankLogs = [...this.logs]
				.filter((log) => log.fullTank && Number(log.odometer) > 0 && Number(log.volume) > 0)
				.sort((a, b) => Number(a.odometer) - Number(b.odometer))
			if (fullTankLogs.length < 2) return this.currentVehicle.economy

			const first = fullTankLogs[0]
			const last = fullTankLogs[fullTankLogs.length - 1]
			const gallonsAfterFirst = fullTankLogs.slice(1).reduce((total, log) => total + Number(log.volume || 0), 0)
			const miles = Number(last.odometer) - Number(first.odometer)
			if (miles <= 0 || gallonsAfterFirst <= 0) return this.currentVehicle.economy
			return (miles / gallonsAfterFirst).toFixed(1)
		},
		currentMonthLabel() {
			const latest = this.logs[0]
			if (!latest) return this.t('noFuelLogs')
			return this.formatMonth(latest.date)
		},
		currentLogRangeLabel() {
			if (!this.filteredLogs.length) return this.t('noFuelLogs')
			if (this.logDateRange === 'all') return this.t('filteredTotal')
			return this.currentLogDateRangeLabel
		},
		lastUpdatedLabel() {
			const latest = this.logs[0]
			return latest ? this.t('lastUpdated', { date: this.formatShortDate(latest.date) }) : this.t('noRecordsYet')
		},
		reportRangeLabel() {
			if (!this.reportLogs.length) return this.t('noRecordsYet')
			if (this.reportDateRange !== 'all') {
				return this.dateRangeOptions.find((range) => range.key === this.reportDateRange)?.label || this.t('rangeAll')
			}
			const dates = this.reportLogs.map((log) => log.date).sort()
			return `${this.formatShortDate(dates[0])} - ${this.formatShortDate(dates[dates.length - 1])}`
		},
		unitSettings() {
			return [
				{ label: this.t('settingDistance'), description: this.t('settingDistanceDesc'), value: this.distanceUnitLabel },
				{ label: this.t('settingFuelVolume'), description: this.t('settingFuelVolumeDesc'), value: this.t('settingFuelVolumeValue') },
				{ label: this.t('settingEconomy'), description: this.t('settingEconomyDesc'), value: this.t('settingEconomyValue') },
				{ label: this.t('settingCurrency'), description: this.t('settingCurrencyDesc'), value: this.currency }
			]
		},
		exportSettings() {
			return [
				{ label: this.t('settingDefaultCategory'), description: this.t('settingDefaultCategoryDesc'), value: this.categoryLabel(this.defaultCategory) },
				{ label: this.t('settingCsvFormat'), description: this.t('settingCsvFormatDesc'), value: this.currentCsvFormatLabel },
				{ label: this.t('settingTaxSummary'), description: this.t('settingTaxSummaryDesc'), value: this.currentTaxSummaryLabel }
			]
		}
	},
	methods: {
		t(key, params = {}) {
			const dictionary = messages[this.locale] || messages.en
			const fallback = messages.en[key] || key
			return String(dictionary[key] || fallback).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
		},
		setLocale(locale) {
			if (messages[locale]) {
				this.locale = locale
			}
		},
		setDefaultCategory(category) {
			this.defaultCategory = category
			this.fuelCategory = category
		},
		openAddFuel() {
			this.formMessage = ''
			this.fuelForm = {
				...this.fuelForm,
				vehicleId: this.currentVehicle.id,
				station: this.fuelForm.station || ''
			}
			this.activeTab = 'addFuel'
		},
		setPrimaryVehicle(id) {
			this.vehicles = this.vehicles.map((vehicle) => ({ ...vehicle, primary: vehicle.id === id }))
			if (this.activeTab === 'addFuel') {
				this.fuelForm.vehicleId = id
			}
		},
		startAddVehicle() {
			this.formMessage = ''
			this.vehicleEditId = ''
			this.vehicleForm = {
				name: '',
				odometer: '',
				economy: ''
			}
			this.activeTab = 'addVehicle'
		},
		startEditVehicle(vehicle) {
			this.formMessage = ''
			this.vehicleEditId = vehicle.id
			this.vehicleForm = {
				name: vehicle.name,
				odometer: String(vehicle.odometer),
				economy: String(vehicle.economy)
			}
			this.activeTab = 'editVehicle'
		},
		saveVehicle() {
			this.formMessage = ''
			const name = this.vehicleForm.name.trim()
			const odometer = Number(this.vehicleForm.odometer)
			const economy = Number(this.vehicleForm.economy)
			if (!name || odometer < 0 || economy <= 0) {
				this.formMessage = this.t('vehicleFormError')
				return
			}
			if (this.vehicleEditId) {
				this.vehicles = this.vehicles.map((vehicle) =>
					vehicle.id === this.vehicleEditId ? { ...vehicle, name, odometer, economy: economy.toFixed(1) } : vehicle
				)
			} else {
				const id = `vehicle-${Date.now()}`
				this.vehicles = this.vehicles
					.map((vehicle) => ({ ...vehicle, primary: false }))
					.concat([{ id, name, odometer, economy: economy.toFixed(1), primary: true }])
				this.fuelForm.vehicleId = id
			}
			this.vehicleEditId = ''
			this.activeTab = 'garage'
		},
		deleteVehicle(id) {
			if (this.vehicles.length <= 1) {
				this.formMessage = this.t('vehicleDeleteLastError')
				return
			}
			const removedPrimary = this.vehicles.find((vehicle) => vehicle.id === id)?.primary
			const fallback = this.vehicles.find((vehicle) => vehicle.id !== id)
			this.vehicles = this.vehicles
				.filter((vehicle) => vehicle.id !== id)
				.map((vehicle, index) => ({ ...vehicle, primary: removedPrimary ? index === 0 : vehicle.primary }))
			this.logs = this.logs.map((log) => (log.vehicleId === id ? { ...log, vehicleId: fallback.id } : log))
			if (this.fuelForm.vehicleId === id) this.fuelForm.vehicleId = fallback.id
			if (this.editForm.vehicleId === id) this.editForm.vehicleId = fallback.id
			if (this.logVehicleFilter === id) this.logVehicleFilter = 'all'
		},
		handleFuelVehicleChange(event) {
			const index = Number(event.detail.value)
			const vehicle = this.vehicles[index]
			if (vehicle) {
				this.fuelForm.vehicleId = vehicle.id
				this.fuelForm.odometer = String(vehicle.odometer || '')
			}
		},
		handleEditVehicleChange(event) {
			const index = Number(event.detail.value)
			const vehicle = this.vehicles[index]
			if (vehicle) {
				this.editForm.vehicleId = vehicle.id
			}
		},
		handleFuelDateChange(event) {
			this.fuelForm.date = event.detail.value
		},
		handleLanguageChange(event) {
			const index = Number(event.detail.value)
			const language = this.languages[index]
			if (language) {
				this.setLocale(language.key)
			}
		},
		handleDefaultCategoryChange(event) {
			const index = Number(event.detail.value)
			const category = this.categoryOptions[index]
			if (category) {
				this.setDefaultCategory(category)
			}
		},
		handleDistanceUnitChange(event) {
			const index = Number(event.detail.value)
			const unit = this.distanceUnitOptions[index]
			if (unit) {
				this.distanceUnit = unit.key
			}
		},
		handleCurrencyChange(event) {
			const index = Number(event.detail.value)
			const currency = this.currencyOptions[index]
			if (currency) {
				this.currency = currency
			}
		},
		handleLogVehicleFilterChange(event) {
			const option = this.logVehicleFilterOptions[Number(event.detail.value)]
			if (option) {
				this.logVehicleFilter = option.key
			}
		},
		handleLogCategoryFilterChange(event) {
			const option = this.logCategoryFilterOptions[Number(event.detail.value)]
			if (option) {
				this.logCategoryFilter = option.key
			}
		},
		handleLogDateRangeChange(event) {
			const option = this.dateRangeOptions[Number(event.detail.value)]
			if (option) {
				this.logDateRange = option.key
			}
		},
		handleReportDateRangeChange(event) {
			const option = this.dateRangeOptions[Number(event.detail.value)]
			if (option) {
				this.reportDateRange = option.key
			}
		},
		handleCsvFormatChange(event) {
			const option = this.csvFormatOptions[Number(event.detail.value)]
			if (option) {
				this.csvFormat = option.key
			}
		},
		handleTaxSummaryChange(event) {
			const option = this.taxSummaryOptions[Number(event.detail.value)]
			if (option) {
				this.taxSummaryEnabled = option.key
			}
		},
		categoryLabel(category) {
			return category === 'Business' ? this.t('categoryBusiness') : this.t('categoryPersonal')
		},
		matchesFilters(log, filters) {
			if (filters.vehicleId && filters.vehicleId !== 'all' && log.vehicleId !== filters.vehicleId) return false
			if (filters.category && filters.category !== 'all' && log.category !== filters.category) return false
			return this.matchesDateRange(log.date, filters.dateRange || 'all')
		},
		matchesDateRange(dateString, range) {
			if (range === 'all') return true
			const date = new Date(`${dateString}T00:00:00`)
			if (Number.isNaN(date.getTime())) return false
			const today = new Date()
			const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
			if (range === 'thisMonth') {
				return date.getFullYear() === todayMidnight.getFullYear() && date.getMonth() === todayMidnight.getMonth()
			}
			if (range === 'last30') {
				const start = new Date(todayMidnight)
				start.setDate(start.getDate() - 29)
				return date >= start && date <= todayMidnight
			}
			return true
		},
		vehicleNameById(id) {
			return this.vehicles.find((vehicle) => vehicle.id === id)?.name || this.currentVehicle.name
		},
		latestOdometerForVehicle(id, fallback = 0) {
			return this.logs
				.filter((log) => (log.vehicleId || this.currentVehicle.id) === id)
				.reduce((max, log) => Math.max(max, Number(log.odometer || 0)), Number(fallback || 0))
		},
		averageEconomyForVehicle(id) {
			const fullTankLogs = [...this.logs]
				.filter((log) => (log.vehicleId || this.currentVehicle.id) === id && log.fullTank && Number(log.odometer) > 0 && Number(log.volume) > 0)
				.sort((a, b) => Number(a.odometer) - Number(b.odometer))
			if (fullTankLogs.length < 2) return this.vehicles.find((vehicle) => vehicle.id === id)?.economy || this.currentVehicle.economy

			const first = fullTankLogs[0]
			const last = fullTankLogs[fullTankLogs.length - 1]
			const gallonsAfterFirst = fullTankLogs.slice(1).reduce((total, log) => total + Number(log.volume || 0), 0)
			const miles = Number(last.odometer) - Number(first.odometer)
			if (miles <= 0 || gallonsAfterFirst <= 0) return this.vehicles.find((vehicle) => vehicle.id === id)?.economy || this.currentVehicle.economy
			return (miles / gallonsAfterFirst).toFixed(1)
		},
		handleFuelInput(field) {
			this.updateFuelMath(this.fuelForm, field)
		},
		handleEditFuelInput(field) {
			this.updateFuelMath(this.editForm, field)
		},
		updateFuelMath(form, field) {
			this.lastEditedPriceField = field
			const volume = Number(form.volume)
			const totalCost = Number(form.totalCost)
			const unitPrice = Number(form.unitPrice)

			if (field === 'volume' && volume > 0 && unitPrice > 0) {
				form.totalCost = (volume * unitPrice).toFixed(2)
				return
			}
			if (field === 'volume' && volume > 0 && totalCost > 0) {
				form.unitPrice = (totalCost / volume).toFixed(3)
				return
			}
			if (field === 'totalCost' && volume > 0 && totalCost > 0) {
				form.unitPrice = (totalCost / volume).toFixed(3)
				return
			}
			if (field === 'totalCost' && totalCost > 0 && unitPrice > 0) {
				form.volume = (totalCost / unitPrice).toFixed(3)
				return
			}
			if (field === 'unitPrice' && volume > 0 && unitPrice > 0) {
				form.totalCost = (volume * unitPrice).toFixed(2)
				return
			}
			if (field === 'unitPrice' && totalCost > 0 && unitPrice > 0) {
				form.volume = (totalCost / unitPrice).toFixed(3)
			}
		},
		addFuelLog() {
			this.formMessage = ''
			this.exportMessage = ''
			const odometer = Number(this.fuelForm.odometer)
			const volume = Number(this.fuelForm.volume)
			const totalCost = Number(this.fuelForm.totalCost)
			const unitPrice = Number(this.fuelForm.unitPrice)

			if (!this.fuelForm.date || odometer <= 0 || volume <= 0 || totalCost <= 0 || unitPrice <= 0) {
				this.formMessage = this.t('formError')
				return
			}

			const log = {
				id: `fuel-${Date.now()}`,
				vehicleId: this.fuelForm.vehicleId || this.currentVehicle.id,
				date: this.fuelForm.date,
				station: this.fuelForm.station.trim() || this.t('fuelStop'),
				odometer,
				volume,
				totalCost,
				unitPrice,
				category: this.fuelCategory,
				fullTank: this.fuelForm.fullTank,
				note: this.fuelForm.note
			}
			this.logs = [log, ...this.logs].sort((a, b) => new Date(b.date) - new Date(a.date))
			this.vehicles = this.vehicles.map((vehicle) =>
				vehicle.id === log.vehicleId ? { ...vehicle, odometer: Math.max(Number(vehicle.odometer), odometer), economy: this.averageEconomyForVehicle(log.vehicleId) } : vehicle
			)
			this.resetFuelForm(odometer)
			this.activeTab = 'dashboard'
		},
		resetFuelForm(odometer) {
			this.fuelForm = {
				vehicleId: this.currentVehicle.id,
				date: '2026-06-25',
				station: '',
				odometer: String(odometer),
				volume: '',
				totalCost: '',
				unitPrice: '',
				fullTank: true,
				note: ''
			}
			this.fuelCategory = this.defaultCategory
		},
		deleteFuelLog(id) {
			this.logs = this.logs.filter((log) => log.id !== id)
			this.recalculatePrimaryVehicle()
		},
		startEditFuelLog(log) {
			this.formMessage = ''
			this.editLogId = log.id
			this.editForm = {
				vehicleId: log.vehicleId || this.currentVehicle.id,
				date: log.date,
				station: log.station || '',
				odometer: String(log.odometer),
				volume: Number(log.volume).toFixed(3),
				totalCost: Number(log.totalCost).toFixed(2),
				unitPrice: Number(log.unitPrice).toFixed(3),
				category: log.category,
				fullTank: Boolean(log.fullTank),
				note: log.note || log.station || ''
			}
			this.activeTab = 'editFuel'
		},
		saveEditedFuelLog() {
			this.formMessage = ''
			const odometer = Number(this.editForm.odometer)
			const volume = Number(this.editForm.volume)
			const totalCost = Number(this.editForm.totalCost)
			const unitPrice = Number(this.editForm.unitPrice)
			if (!this.editForm.date || odometer <= 0 || volume <= 0 || totalCost <= 0 || unitPrice <= 0) {
				this.formMessage = this.t('formError')
				return
			}
			this.logs = this.logs
				.map((log) =>
					log.id === this.editLogId
						? {
								...log,
								vehicleId: this.editForm.vehicleId || this.currentVehicle.id,
								date: this.editForm.date,
								station: this.editForm.station.trim() || this.t('fuelStop'),
								odometer,
								volume,
								totalCost,
								unitPrice,
								category: this.editForm.category,
								fullTank: this.editForm.fullTank,
								note: this.editForm.note
							}
						: log
				)
				.sort((a, b) => new Date(b.date) - new Date(a.date))
			this.recalculatePrimaryVehicle()
			this.activeTab = 'logs'
		},
		resetSampleData() {
			this.logs = this.defaultLogs()
			this.vehicles = this.defaultVehicles()
			this.defaultCategory = 'Personal'
			this.fuelCategory = this.defaultCategory
			this.logVehicleFilter = 'all'
			this.logCategoryFilter = 'all'
			this.logDateRange = 'all'
			this.reportDateRange = 'all'
			this.csvFormat = 'standard'
			this.taxSummaryEnabled = true
			this.exportMessage = this.t('dataReset')
			this.persistAppState()
		},
		exportCsv() {
			this.exportMessage = ''
			const logs = this.reportLogs
			const standardHeader = ['date', 'vehicle', 'station', 'odometer', 'gallons', 'total_cost', 'unit_price', 'currency', 'category', 'full_tank', 'note']
			const taxReadyHeader = ['date', 'vehicle', 'type', 'category', 'odometer', 'distance', 'volume', 'total_cost', 'unit_price', 'currency', 'full_tank', 'station', 'note']
			const header = this.csvFormat === 'taxReady' ? taxReadyHeader : standardHeader
			const rows = logs.map((log) => {
				const standardRow = [
					log.date,
					this.vehicleNameById(log.vehicleId),
					log.station,
					log.odometer,
					log.volume,
					log.totalCost,
					log.unitPrice,
					this.currency,
					log.category,
					log.fullTank ? 'yes' : 'no',
					log.note || ''
				]
				if (this.csvFormat !== 'taxReady') return standardRow
				return [
					log.date,
					this.vehicleNameById(log.vehicleId),
					'fuel',
					log.category,
					log.odometer,
					'',
					log.volume,
					log.totalCost,
					log.unitPrice,
					this.currency,
					log.fullTank ? 'yes' : 'no',
					log.station,
					log.note || ''
				]
			})
			const lines = [header, ...rows].map((row) => row.map(this.csvCell).join(','))
			if (this.taxSummaryEnabled) {
				lines.push('')
				lines.push(['summary', 'amount', 'currency'].map(this.csvCell).join(','))
				lines.push(['business_total', this.categoryTotals.Business.toFixed(2), this.currency].map(this.csvCell).join(','))
				lines.push(['personal_total', this.categoryTotals.Personal.toFixed(2), this.currency].map(this.csvCell).join(','))
				lines.push(['fuel_total', this.reportFuelSpend.toFixed(2), this.currency].map(this.csvCell).join(','))
			}
			const csv = lines.join('\n')
			if (typeof window !== 'undefined' && window.URL) {
				const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = 'fuelflow-fuel-logs.csv'
				link.click()
				URL.revokeObjectURL(url)
				this.exportMessage = this.t('exportReady')
			} else {
				this.exportMessage = this.t('exportUnsupported')
			}
		},
		csvCell(value) {
			const text = String(value ?? '')
			if (/[",\n\r]/.test(text)) {
				return `"${text.replace(/"/g, '""')}"`
			}
			return text
		},
		recalculatePrimaryVehicle() {
			this.vehicles = this.vehicles.map((vehicle) =>
				({ ...vehicle, odometer: this.latestOdometerForVehicle(vehicle.id, vehicle.odometer), economy: this.averageEconomyForVehicle(vehicle.id) })
			)
		},
		defaultLogs() {
			return [
				{ id: 'fuel-3', vehicleId: 'daily-sedan', date: '2026-06-20', station: 'Shell Station', odometer: 32560, volume: 10.123, totalCost: 37.05, unitPrice: 3.66, category: 'Business', fullTank: true, note: 'Client route' },
				{ id: 'fuel-2', vehicleId: 'daily-sedan', date: '2026-06-12', station: 'Exxon', odometer: 32242, volume: 9.456, totalCost: 34.20, unitPrice: 3.62, category: 'Personal', fullTank: true, note: 'Weekend errands' },
				{ id: 'fuel-1', vehicleId: 'weekend-suv', date: '2026-06-05', station: 'Chevron', odometer: 31944, volume: 9.870, totalCost: 35.60, unitPrice: 3.61, category: 'Business', fullTank: true, note: 'Airport pickup' }
			]
		},
		defaultVehicles() {
			return [
				{ id: 'daily-sedan', name: 'Daily Sedan', odometer: 32560, economy: '31.4', primary: true },
				{ id: 'weekend-suv', name: 'Weekend SUV', odometer: 15210, economy: '24.7', primary: false }
			]
		},
		categoryPercent(category) {
			if (this.monthFuelSpend <= 0) return '0.0%'
			return `${((this.categoryTotals[category] / this.monthFuelSpend) * 100).toFixed(1)}%`
		},
		money(value) {
			const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥' }
			return `${symbols[this.currency] || `${this.currency} `}${Number(value || 0).toFixed(2)}`
		},
		formatGallons(value) {
			return `${Number(value || 0).toFixed(3)} ${this.t('unitGallonsShort')}`
		},
		formatNumber(value) {
			return Number(value || 0).toLocaleString('en-US')
		},
		formatShortDate(dateString) {
			const date = new Date(`${dateString}T00:00:00`)
			return date.toLocaleDateString(this.dateLocale(), { month: 'short', day: 'numeric' })
		},
		formatMonth(dateString) {
			const date = new Date(`${dateString}T00:00:00`)
			return date.toLocaleDateString(this.dateLocale(), { month: 'long', year: 'numeric' })
		},
		dateLocale() {
			if (this.locale === 'zh-Hans') return 'zh-CN'
			if (this.locale === 'zh-Hant') return 'zh-TW'
			if (this.locale === 'es') return 'es-ES'
			if (this.locale === 'fr') return 'fr-FR'
			if (this.locale === 'de') return 'de-DE'
			if (this.locale === 'ja') return 'ja-JP'
			if (this.locale === 'ko') return 'ko-KR'
			if (this.locale === 'pt') return 'pt-BR'
			return 'en-US'
		},
		restoreAppState() {
			this.isRestoringState = true
			const savedState = this.readStorage('fuelflow-app-state')
			if (savedState) {
				if (Array.isArray(savedState.logs)) {
					this.logs = savedState.logs.map((log) => ({ ...log, vehicleId: log.vehicleId || 'daily-sedan', station: log.station || this.t('fuelStop') }))
				}
				if (Array.isArray(savedState.vehicles)) {
					this.vehicles = savedState.vehicles
				}
				if (savedState.locale && messages[savedState.locale]) {
					this.locale = savedState.locale
				}
				if (savedState.defaultCategory === 'Business' || savedState.defaultCategory === 'Personal') {
					this.defaultCategory = savedState.defaultCategory
					this.fuelCategory = savedState.defaultCategory
				}
				if (savedState.distanceUnit === 'mi' || savedState.distanceUnit === 'km') {
					this.distanceUnit = savedState.distanceUnit
				}
				if (this.currencyOptions.includes(savedState.currency)) {
					this.currency = savedState.currency
				}
				if (savedState.logVehicleFilter === 'all' || this.vehicles.some((vehicle) => vehicle.id === savedState.logVehicleFilter)) {
					this.logVehicleFilter = savedState.logVehicleFilter
				}
				if (savedState.logCategoryFilter === 'all' || this.categoryOptions.includes(savedState.logCategoryFilter)) {
					this.logCategoryFilter = savedState.logCategoryFilter
				}
				if (this.dateRangeOptions.some((range) => range.key === savedState.logDateRange)) {
					this.logDateRange = savedState.logDateRange
				}
				if (this.dateRangeOptions.some((range) => range.key === savedState.reportDateRange)) {
					this.reportDateRange = savedState.reportDateRange
				}
				if (this.csvFormatOptions.some((format) => format.key === savedState.csvFormat)) {
					this.csvFormat = savedState.csvFormat
				}
				if (typeof savedState.taxSummaryEnabled === 'boolean') {
					this.taxSummaryEnabled = savedState.taxSummaryEnabled
				}
				if (!this.vehicles.some((vehicle) => vehicle.id === this.fuelForm.vehicleId)) {
					this.fuelForm.vehicleId = this.currentVehicle.id
				}
			}
			this.$nextTick(() => {
				this.isRestoringState = false
				this.persistAppState()
			})
		},
		persistAppState() {
			if (this.isRestoringState) return
			this.writeStorage('fuelflow-app-state', {
				logs: this.logs,
				vehicles: this.vehicles,
				locale: this.locale,
				defaultCategory: this.defaultCategory,
				distanceUnit: this.distanceUnit,
				currency: this.currency,
				logVehicleFilter: this.logVehicleFilter,
				logCategoryFilter: this.logCategoryFilter,
				logDateRange: this.logDateRange,
				reportDateRange: this.reportDateRange,
				csvFormat: this.csvFormat,
				taxSummaryEnabled: this.taxSummaryEnabled
			})
		},
		readStorage(key) {
			try {
				if (typeof uni !== 'undefined' && uni.getStorageSync) {
					return uni.getStorageSync(key)
				}
				if (typeof localStorage !== 'undefined') {
					const raw = localStorage.getItem(key)
					return raw ? JSON.parse(raw) : null
				}
			} catch (error) {
				return null
			}
			return null
		},
		writeStorage(key, value) {
			try {
				if (typeof uni !== 'undefined' && uni.setStorageSync) {
					uni.setStorageSync(key, value)
					return
				}
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(key, JSON.stringify(value))
				}
			} catch (error) {
				// Storage can fail in private browsing or restricted WebViews.
			}
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
	padding: calc(var(--status-bar-height, 0px) + 36rpx) 32rpx calc(240rpx + env(safe-area-inset-bottom));
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

.row-edit,
.row-delete {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	font-size: 28rpx;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	margin: 0;
}

.row-edit {
	width: 64rpx;
	border: 1px solid #d8d1c6;
	background: #fffdfa;
	color: #1a3644;
	font-size: 18rpx;
	font-weight: 800;
	border-radius: 14rpx;
}

.row-delete {
	border: 1px solid #ead8d3;
	background: #fff8f6;
	color: #9b3f2f;
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

.filter-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 12rpx;
}

.filter-pill {
	min-height: 72rpx;
	padding: 0 14rpx;
	border: 1px solid #e7e1d8;
	border-radius: 14rpx;
	background: #ffffff;
	color: #172126;
	font-size: 21rpx;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8rpx;
	box-sizing: border-box;
}

.filter-pill text:first-child {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.filter-pill text:last-child {
	flex: 0 0 auto;
	color: #6f7672;
	font-size: 20rpx;
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

.vehicle-actions {
	display: flex;
	align-items: center;
	gap: 8rpx;
	flex: 0 0 auto;
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
	width: 100%;
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
	box-sizing: border-box;
	margin-left: 0;
	margin-right: 0;
	padding-left: 0;
	padding-right: 0;
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
	gap: 12rpx;
}

.input-block,
.note-field,
.full-tank-row {
	background: #ffffff;
	border: 1px solid #e7e1d8;
	border-radius: 16rpx;
	padding: 16rpx 18rpx;
	box-shadow: 0 8rpx 22rpx rgba(23, 33, 38, 0.05);
}

.input-block > text,
.note-field > text:first-child {
	display: block;
	color: #6f7672;
	font-size: 22rpx;
	margin-bottom: 6rpx;
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

.field-display {
	color: #172126;
	font-size: 34rpx !important;
	font-weight: 760;
	line-height: 1.15 !important;
}

.compact-display {
	font-size: 32rpx !important;
}

.inline-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
	width: 100%;
}

.inline-picker text:last-child {
	color: #6f7672 !important;
	font-size: 24rpx !important;
}

.input-block view text:last-child {
	color: #6f7672;
	font-size: 22rpx;
}

.fuel-input {
	flex: 1;
	min-width: 0;
	height: 52rpx;
	color: #172126;
	font-size: 46rpx;
	font-weight: 760;
	line-height: 1;
	padding: 0;
	background: transparent;
	border: 0;
}

.fuel-input.compact {
	font-size: 34rpx;
	line-height: 1.15;
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

.settings-toggle {
	margin: 0 18rpx 14rpx;
}

.danger-action {
	width: calc(100% - 36rpx);
	height: 72rpx;
	margin: 0 18rpx 16rpx;
	border: 1px solid #ead8d3;
	border-radius: 14rpx;
	background: #fff8f6;
	color: #9b3f2f;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.export-message {
	display: block;
	margin-top: 12rpx;
	color: #2b4c3f;
	font-size: 23rpx;
	line-height: 1.45;
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

.switch-on.off {
	background: #d8d1c6;
	justify-content: flex-start;
}

.switch-on view {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: #ffffff;
}

.note-input {
	width: 100%;
	height: 42rpx;
	color: #9d9a92;
	font-size: 26rpx;
	padding: 0;
	background: transparent;
	border: 0;
}

.form-message {
	color: #9b3f2f;
	font-size: 23rpx;
	line-height: 1.45;
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
	padding: 14rpx 18rpx 6rpx;
	color: #6f7672;
	font-size: 20rpx;
	font-weight: 700;
	text-transform: uppercase;
}

.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
	padding: 14rpx 18rpx;
	border-top: 1px solid #f0ebe3;
}

.setting-row view {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.setting-row view text:first-child {
	color: #172126;
	font-size: 24rpx;
	font-weight: 700;
}

.setting-row view text:last-child {
	color: #6f7672;
	font-size: 20rpx;
}

.setting-row > text {
	color: #1a3644;
	font-size: 22rpx;
	font-weight: 700;
	white-space: nowrap;
}

.setting-row.tappable {
	cursor: pointer;
}

.picker-row {
	cursor: pointer;
}

.picker-value {
	flex: 0 0 auto !important;
	min-width: 150rpx !important;
	display: flex !important;
	flex-direction: row !important;
	align-items: center;
	justify-content: flex-end;
	gap: 8rpx !important;
	color: #1a3644;
	font-size: 22rpx;
	font-weight: 700;
}

.picker-value text:first-child,
.picker-value text:last-child {
	color: #1a3644 !important;
	font-size: 22rpx !important;
	font-weight: 700;
	white-space: nowrap;
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
