<template>
	<view class="policy-shell">
		<view class="topbar">
			<text class="back-button" @tap="goBack">Back</text>
			<text class="brand">FitCal</text>
		</view>

		<view class="policy-header">
			<text class="screen-title">{{ page.title }}</text>
			<text class="screen-subtitle">{{ page.subtitle }}</text>
		</view>

		<view class="policy-card" v-for="section in page.sections" :key="section.heading">
			<text class="section-title">{{ section.heading }}</text>
			<text class="section-body">{{ section.body }}</text>
		</view>
	</view>
</template>

<script lang="ts">
	import { getPolicyPage, type PolicyPageContent, type PolicyType } from '../../services/policy'

	declare function getCurrentPages(): Array<{ options?: { type?: string } }>

	export default {
		data() {
			return {
				pageType: 'privacy' as PolicyType
			}
		},
		computed: {
			page(): PolicyPageContent {
				return getPolicyPage(this.pageType)
			}
		},
		onLoad(options?: { type?: string }) {
			this.setPageType(options?.type)
		},
		onShow() {
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			this.setPageType(currentPage?.options?.type)
		},
		methods: {
			setPageType(type?: string) {
				this.pageType = type === 'disclaimer' ? 'disclaimer' : 'privacy'
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	:page {
		background-color: #F4F8F8;
	}

	.policy-shell {
		min-height: 100vh;
		padding: 44rpx 40rpx 64rpx;
		box-sizing: border-box;
		background: #F4F8F8;
		color: #172326;
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 48rpx;
	}

	.back-button {
		min-width: 112rpx;
		height: 56rpx;
		border-radius: 999rpx;
		background: #E6F7F4;
		color: #0F9F8F;
		font-size: 24rpx;
		font-weight: 800;
		line-height: 56rpx;
		text-align: center;
	}

	.brand {
		color: #172326;
		font-size: 40rpx;
		font-weight: 800;
		line-height: 1;
	}

	.policy-header {
		margin-bottom: 32rpx;
	}

	.screen-title {
		display: block;
		margin-bottom: 14rpx;
		color: #172326;
		font-size: 56rpx;
		font-weight: 800;
		line-height: 1.08;
	}

	.screen-subtitle {
		display: block;
		color: #65787B;
		font-size: 30rpx;
		line-height: 1.35;
	}

	.policy-card {
		padding: 30rpx;
		margin-bottom: 24rpx;
		border: 2rpx solid #D8E6E5;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-sizing: border-box;
	}

	.section-title {
		display: block;
		margin-bottom: 14rpx;
		color: #172326;
		font-size: 32rpx;
		font-weight: 800;
		line-height: 1.2;
	}

	.section-body {
		display: block;
		color: #65787B;
		font-size: 26rpx;
		line-height: 1.45;
	}
</style>
