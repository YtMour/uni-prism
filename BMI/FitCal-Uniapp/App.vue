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
		margin-bottom: 16rpx;
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
		transition: transform 120ms ease, background-color 160ms ease, color 160ms ease, box-shadow 160ms ease;
	}

	.segmented-item.active {
		background: #FFFFFF;
		color: #0F9F8F;
		box-shadow: 0 2rpx 8rpx rgba(23, 35, 38, 0.08);
	}

	.segmented-item:active,
	.chip:active,
	.record-action:active,
	.record-delete:active,
	.ad-slot-close:active,
	.link-row:active {
		transform: scale(0.97);
		opacity: 0.86;
	}

	.input-grid {
		display: flex;
		gap: 18rpx;
		margin-bottom: 18rpx;
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
		margin-bottom: 18rpx;
	}

	.input-card {
		min-height: 212rpx;
		margin-bottom: 0;
	}

	.field-label-row,
	.setting-title {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.field-label,
	.section-label {
		display: block;
		margin-bottom: 14rpx;
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
		margin: 0 0 18rpx;
		border: 0;
		border-radius: 16rpx;
		background: #F06F5D;
		color: #FFFFFF;
		font-size: 34rpx;
		font-weight: 800;
		line-height: 104rpx;
		box-shadow: 0 14rpx 28rpx rgba(240, 111, 93, 0.24);
		transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
	}

	.secondary-button {
		width: 100%;
		height: 88rpx;
		margin: 20rpx 0 0;
		border: 0;
		border-radius: 16rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 800;
		line-height: 88rpx;
		box-shadow: 0 10rpx 22rpx rgba(15, 159, 143, 0.1);
		transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
	}

	.secondary-button.inline {
		margin-top: 16rpx;
	}

	.secondary-button.inline.half {
		flex: 1;
		min-width: 0;
		margin-top: 0;
		font-size: 24rpx;
	}

	.secondary-button.inline.data-button {
		width: 100%;
		margin-top: 0;
		font-size: 26rpx;
		line-height: 88rpx;
	}

	.data-card {
		overflow: hidden;
	}

	.data-action-row {
		display: flex;
		flex-direction: column;
		gap: 14rpx;
		margin-top: 18rpx;
	}

	.csv-input {
		width: 100%;
		min-height: 150rpx;
		margin-top: 18rpx;
		padding: 18rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		color: #172326;
		font-size: 24rpx;
		font-weight: 700;
		line-height: 1.35;
		box-sizing: border-box;
	}

	.button-press,
	.primary-button:active {
		transform: translateY(3rpx) scale(0.985);
		box-shadow: 0 8rpx 16rpx rgba(240, 111, 93, 0.18);
		opacity: 0.92;
	}

	.secondary-button-press,
	.secondary-button:active {
		transform: translateY(3rpx) scale(0.985);
		box-shadow: 0 6rpx 14rpx rgba(15, 159, 143, 0.08);
		opacity: 0.9;
	}

	.danger-button-press,
	.danger-button:active {
		transform: translateY(3rpx) scale(0.985);
		opacity: 0.9;
	}

	.primary-button::after,
	.secondary-button::after,
	.danger-button::after {
		border: 0;
	}

	.result-panel {
		padding: 34rpx;
		margin-bottom: 18rpx;
		border: 2rpx solid #BFE9E3;
		border-radius: 16rpx;
		background: #EAF9F6;
		box-sizing: border-box;
		overflow: hidden;
	}

	.result-number {
		display: block;
		color: #172326;
		font-size: 100rpx;
		font-weight: 850;
		line-height: 1;
	}

	.compact-number {
		font-size: 64rpx;
		line-height: 1.08;
		word-break: break-word;
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
		margin-top: 10rpx;
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.45;
	}

	.no-margin {
		margin-top: 0;
	}

	.chip-row {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
	}

	.chip {
		padding: 16rpx 22rpx;
		border-radius: 999rpx;
		background: #EDF4F4;
		color: #65787B;
		font-size: 24rpx;
		font-weight: 800;
		transition: transform 120ms ease, background-color 160ms ease, color 160ms ease;
	}

	.chip.active {
		background: #E6F7F4;
		color: #0F9F8F;
	}

	.setting-chip-row {
		margin-top: 16rpx;
	}

	.setting-chip-row .chip {
		min-width: 84rpx;
		text-align: center;
	}

	.setting-input-row {
		margin-top: 16rpx;
	}

	.ad-slot {
		min-height: 100rpx;
		margin-bottom: 18rpx;
		padding: 18rpx 22rpx;
		border: 2rpx dashed #A9C4C3;
		border-radius: 16rpx;
		background: #FBFDFD;
		color: #7C9598;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18rpx;
	}

	.ad-slot.test-mode {
		border-style: solid;
		border-color: #F4B84F;
		background: #FFF9EA;
	}

	.ad-slot-copy {
		flex: 1;
		min-width: 0;
	}

	.ad-slot-label,
	.ad-slot-title,
	.ad-slot-note {
		display: block;
	}

	.ad-slot-label {
		color: #7C9598;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 1.2;
	}

	.ad-slot-title {
		margin-top: 6rpx;
		color: #172326;
		font-size: 28rpx;
		font-weight: 850;
		line-height: 1.2;
	}

	.ad-slot-note {
		margin-top: 4rpx;
		color: #65787B;
		font-size: 22rpx;
		line-height: 1.25;
	}

	.ad-slot-close {
		min-width: 92rpx;
		height: 56rpx;
		border-radius: 999rpx;
		background: #FFFFFF;
		color: #C57A13;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 56rpx;
		text-align: center;
	}

	.macro-card {
		display: flex;
		align-items: center;
		gap: 22rpx;
		padding: 30rpx;
		margin-bottom: 18rpx;
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
		gap: 18rpx;
		padding: 16rpx 0;
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

	.guide-card {
		animation: guide-card-in 240ms ease-out both;
	}

	.guide-row {
		position: relative;
		display: flex;
		gap: 18rpx;
		padding: 16rpx 0 18rpx;
		border-bottom: 2rpx solid #E7EFEF;
	}

	.guide-row:last-child {
		padding-bottom: 0;
		border-bottom: 0;
	}

	.guide-day {
		flex-shrink: 0;
		width: 92rpx;
		height: 52rpx;
		border-radius: 999rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 22rpx;
		font-weight: 900;
		line-height: 52rpx;
		text-align: center;
	}

	.guide-copy {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.guide-title,
	.guide-focus,
	.guide-action {
		display: block;
	}

	.guide-title {
		color: #172326;
		font-size: 30rpx;
		font-weight: 850;
		line-height: 1.2;
	}

	.guide-focus {
		color: #0F6F66;
		font-size: 25rpx;
		font-weight: 800;
		line-height: 1.35;
	}

	.guide-action {
		color: #65787B;
		font-size: 24rpx;
		line-height: 1.42;
	}

	@keyframes guide-card-in {
		from {
			opacity: 0;
			transform: translateY(18rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
		gap: 18rpx;
		margin: 16rpx 0 12rpx;
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
		margin: 18rpx 0;
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
		gap: 14rpx;
		padding: 16rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.record-row:last-child {
		border-bottom: 0;
	}

	.record-info {
		flex: 1;
		min-width: 0;
	}

	.record-edit {
		flex: 1;
		min-width: 0;
	}

	.record-edit-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.record-edit-input {
		flex: 1;
		min-width: 0;
		height: 58rpx;
		padding: 0 12rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 12rpx;
		background: #FFFFFF;
		color: #172326;
		font-size: 24rpx;
		font-weight: 800;
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
		transition: transform 120ms ease, opacity 120ms ease;
	}

	.record-actions {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.record-action {
		min-width: 92rpx;
		height: 56rpx;
		border-radius: 999rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 22rpx;
		font-weight: 800;
		line-height: 56rpx;
		text-align: center;
		transition: transform 120ms ease, opacity 120ms ease;
	}

	.empty-copy {
		display: block;
		padding: 18rpx 0 4rpx;
		color: #65787B;
		font-size: 26rpx;
		font-weight: 800;
	}

	.setting-row,
	.link-row,
	.picker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18rpx;
		color: #172326;
		font-size: 32rpx;
		font-weight: 800;
	}

	.link-row {
		padding: 14rpx 0;
		border-bottom: 2rpx solid #D8E6E5;
	}

	.picker-row {
		min-height: 70rpx;
	}

	.link-row:last-child {
		border-bottom: 0;
	}

	.setting-value,
	.picker-value {
		color: #0F9F8F;
		font-size: 28rpx;
		font-weight: 800;
	}

	.picker-value {
		display: flex;
		align-items: center;
		gap: 8rpx;
		max-width: 360rpx;
		text-align: right;
	}

	.picker-value text:first-child {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.picker-arrow {
		flex-shrink: 0;
		color: #65787B;
		font-size: 28rpx;
	}

	.danger-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		width: 100%;
		height: 96rpx;
		margin: 0 0 18rpx;
		border: 2rpx solid #F4B9AE;
		border-radius: 16rpx;
		background: #FFF6F4;
		color: #C64F3F;
		font-size: 30rpx;
		font-weight: 800;
		line-height: 96rpx;
		transition: transform 120ms ease, opacity 120ms ease;
	}

	.line-icon {
		display: block;
		width: 34rpx;
		height: 34rpx;
	}
</style>
