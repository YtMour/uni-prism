<script>
	export default {
		onLaunch() {}
	}
</script>

<style>
	page {
		background: #F4F8F8;
		color: #172326;
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
	}

	view,
	text,
	input,
	button,
	scroll-view {
		box-sizing: border-box;
		letter-spacing: 0;
	}

	.screen {
		padding-bottom: 28rpx;
	}

	.screen-title {
		display: block;
		margin-bottom: 14rpx;
		color: #172326;
		font-size: 60rpx;
		font-weight: 800;
		line-height: 1.08;
	}

	.screen-subtitle {
		display: block;
		margin-bottom: 34rpx;
		color: #65787B;
		font-size: 30rpx;
		line-height: 1.35;
	}

	.segmented {
		display: flex;
		height: 80rpx;
		margin-bottom: 24rpx;
		padding: 8rpx;
		gap: 8rpx;
		border-radius: 16rpx;
		background: #EAF2F2;
		box-sizing: border-box;
	}

	.segmented.compact {
		height: 84rpx;
		margin-bottom: 0;
	}

	.segmented-item {
		flex: 1;
		height: 64rpx;
		border-radius: 14rpx;
		color: #65787B;
		font-size: 26rpx;
		font-weight: 800;
		line-height: 64rpx;
		text-align: center;
	}

	.segmented-item.active {
		background: #FFFFFF;
		color: #0F9F8F;
		box-shadow: 0 2rpx 8rpx rgba(23, 35, 38, 0.08);
	}

	.input-grid {
		display: flex;
		gap: 24rpx;
		margin-bottom: 28rpx;
	}

	.input-grid > view {
		flex: 1;
		min-width: 0;
	}

	.input-card,
	.plain-card {
		padding: 30rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		margin-bottom: 28rpx;
	}

	.input-card {
		min-height: 212rpx;
		margin-bottom: 0;
	}

	.field-label-row,
	.setting-title {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.field-label,
	.section-label {
		display: block;
		margin-bottom: 20rpx;
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 1.2;
	}

	.input-row {
		display: flex;
		align-items: center;
		height: 96rpx;
		padding: 0 24rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
	}

	.field-input {
		flex: 1;
		min-width: 0;
		height: 88rpx;
		color: #172326;
		font-size: 40rpx;
		font-weight: 800;
	}

	.unit-label {
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
	}

	.error-text {
		display: block;
		margin-top: 14rpx;
		color: #C64F3F;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 1.3;
	}

	.primary-button {
		width: 100%;
		height: 104rpx;
		margin: 0 0 28rpx;
		border: 0;
		border-radius: 16rpx;
		background: #F06F5D;
		color: #FFFFFF;
		font-size: 34rpx;
		font-weight: 800;
		line-height: 104rpx;
	}

	.primary-button::after,
	.danger-button::after {
		border: 0;
	}

	.result-panel {
		padding: 34rpx;
		margin-bottom: 28rpx;
		border: 2rpx solid #BFE9E3;
		border-radius: 16rpx;
		background: #EAF9F6;
		box-sizing: border-box;
	}

	.result-number {
		display: block;
		color: #172326;
		font-size: 100rpx;
		font-weight: 850;
		line-height: 1;
	}

	.compact-number {
		font-size: 72rpx;
	}

	.status-badge {
		display: inline-block;
		margin-top: 18rpx;
		padding: 14rpx 20rpx;
		border-radius: 999rpx;
		background: #E9F8EB;
		color: #267D32;
		font-size: 26rpx;
		font-weight: 850;
	}

	.range-meter {
		position: relative;
		height: 22rpx;
		margin-top: 40rpx;
		border-radius: 999rpx;
		background: linear-gradient(90deg, #42A5D5 0 24%, #58A85F 24% 50%, #F4B84F 50% 74%, #F06F5D 74% 100%);
	}

	.range-marker {
		position: absolute;
		top: 24rpx;
		width: 0;
		height: 0;
		margin-left: -14rpx;
		border-left: 14rpx solid transparent;
		border-right: 14rpx solid transparent;
		border-bottom: 20rpx solid #0F9F8F;
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		margin-top: 38rpx;
		color: #65787B;
		font-size: 22rpx;
		font-weight: 800;
	}

	.range-labels .healthy {
		color: #2B8A3E;
	}

	.metric-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
		padding: 18rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
		color: #172326;
		font-size: 30rpx;
	}

	.metric-row:last-child {
		border-bottom: 0;
	}

	.metric-value {
		color: #172326;
		font-size: 36rpx;
		font-weight: 800;
		text-align: right;
	}

	.note {
		display: block;
		margin-top: 16rpx;
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.45;
	}

	.no-margin {
		margin-top: 0;
	}

	.chip-row {
		display: flex;
		gap: 16rpx;
		flex-wrap: wrap;
	}

	.chip {
		padding: 16rpx 22rpx;
		border-radius: 999rpx;
		background: #EDF4F4;
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
	}

	.chip.active {
		background: #E6F7F4;
		color: #0F9F8F;
	}

	.setting-chip-row {
		margin-top: 24rpx;
	}

	.setting-chip-row .chip {
		min-width: 84rpx;
		text-align: center;
	}

	.ad-slot {
		height: 100rpx;
		margin-bottom: 28rpx;
		border: 2rpx dashed #A9C4C3;
		border-radius: 16rpx;
		background: #FBFDFD;
		color: #7C9598;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 100rpx;
		text-align: center;
	}

	.macro-card {
		display: flex;
		align-items: center;
		gap: 30rpx;
		padding: 30rpx;
		margin-bottom: 28rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
	}

	.donut {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		background: conic-gradient(#0F9F8F 0 30%, #F4B84F 30% 70%, #58A85F 70% 100%);
	}

	.macro-list {
		flex: 1;
	}

	.meal-row {
		display: flex;
		gap: 24rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.meal-row:last-child {
		border-bottom: 0;
	}

	.meal-icon {
		width: 68rpx;
		height: 68rpx;
		border-radius: 16rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 900;
		line-height: 68rpx;
		text-align: center;
	}

	.meal-title {
		display: block;
		margin-bottom: 6rpx;
		color: #172326;
		font-size: 32rpx;
		font-weight: 800;
	}

	.meal-copy {
		display: block;
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.35;
	}

	.mini-panel {
		min-height: 154rpx;
		padding: 30rpx;
		margin-bottom: 0;
	}

	.mini-number {
		display: block;
		color: #172326;
		font-size: 54rpx;
		font-weight: 850;
		line-height: 1;
		white-space: nowrap;
	}

	.trend-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
		margin: 24rpx 0 18rpx;
	}

	.trend-title {
		display: block;
		color: #172326;
		font-size: 30rpx;
		font-weight: 850;
		line-height: 1.2;
	}

	.trend-range {
		display: block;
		margin-top: 6rpx;
		color: #65787B;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 1.25;
	}

	.trend-latest {
		min-width: 176rpx;
		padding: 14rpx 18rpx;
		border-radius: 16rpx;
		background: #EAF9F6;
		text-align: right;
	}

	.trend-latest-label {
		display: block;
		color: #65787B;
		font-size: 20rpx;
		font-weight: 800;
		line-height: 1.2;
	}

	.trend-latest-value {
		display: block;
		margin-top: 4rpx;
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 850;
		line-height: 1.2;
	}

	.trend-card {
		position: relative;
		height: 388rpx;
		margin: 28rpx 0;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		overflow: hidden;
	}

	.trend-canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.trend-y-axis {
		position: absolute;
		top: 44rpx;
		bottom: 54rpx;
		left: 18rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: #A0B3B5;
		font-size: 20rpx;
		font-weight: 800;
		pointer-events: none;
	}

	.trend-y-axis text {
		display: block;
		padding: 2rpx 8rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.78);
	}

	.trend-x-axis {
		position: absolute;
		left: 44rpx;
		right: 44rpx;
		bottom: 18rpx;
		display: flex;
		justify-content: space-between;
		color: #A0B3B5;
		font-size: 20rpx;
		font-weight: 800;
		pointer-events: none;
	}

	.trend-x-axis text {
		display: block;
		padding: 2rpx 8rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.78);
	}

	.empty-trend {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32rpx;
		color: #65787B;
		font-size: 26rpx;
		font-weight: 800;
		text-align: center;
	}

	.record-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.record-row:last-child {
		border-bottom: 0;
	}

	.record-info {
		flex: 1;
		min-width: 0;
	}

	.record-weight {
		display: block;
		margin-bottom: 6rpx;
		color: #172326;
		font-size: 30rpx;
		font-weight: 800;
	}

	.record-meta {
		display: block;
		color: #65787B;
		font-size: 24rpx;
	}

	.record-delete {
		min-width: 112rpx;
		height: 56rpx;
		border-radius: 999rpx;
		background: #FFF6F4;
		color: #C64F3F;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 56rpx;
		text-align: center;
	}

	.empty-copy {
		display: block;
		padding: 18rpx 0 4rpx;
		color: #65787B;
		font-size: 26rpx;
		font-weight: 800;
	}

	.setting-row,
	.link-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24rpx;
		color: #172326;
		font-size: 32rpx;
		font-weight: 800;
	}

	.link-row {
		padding: 18rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.link-row:last-child {
		border-bottom: 0;
	}

	.setting-value {
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 800;
	}

	.danger-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14rpx;
		width: 100%;
		height: 96rpx;
		margin: 0 0 28rpx;
		border: 2rpx solid #F4B9AE;
		border-radius: 16rpx;
		background: #FFF6F4;
		color: #C64F3F;
		font-size: 30rpx;
		font-weight: 800;
		line-height: 96rpx;
	}

	.line-icon {
		display: block;
		width: 34rpx;
		height: 34rpx;
	}
</style>
