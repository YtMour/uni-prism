<template>
	<view class="tabbar">
		<view
			v-for="tab in tabs"
			:key="tab.key"
			:data-testid="'tab-' + tab.key"
			:class="['tab', active === tab.key ? 'active' : '']"
			@click="$emit('change', tab.key)"
		>
			<icon-mark :name="tab.icon" class="tab-icon" />
			<text>{{ tab.label }}</text>
		</view>
	</view>
</template>

<script>
import IconMark from './IconMark.vue'

export default {
	name: 'AppTabbar',
	components: {
		IconMark
	},
	props: {
		tabs: {
			type: Array,
			required: true
		},
		active: {
			type: String,
			required: true
		}
	},
	emits: ['change']
}
</script>

<style>
.tabbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 96px;
	border-top: 1px solid #DDD8CE;
	background: #FBF9F5;
	backdrop-filter: none;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	max-width: 520px;
	margin: 0 auto;
	z-index: 30;
	box-shadow: 0 -10px 26px rgba(30, 30, 30, 0.08);
	padding-bottom: env(safe-area-inset-bottom);
	overflow: hidden;
}

.tabbar::before {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: calc(100% + env(safe-area-inset-bottom));
	background: #FBF9F5;
	z-index: -1;
}

.tab {
	display: flex;
	position: relative;
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	padding: 0;
	margin: 0;
	color: #666;
	font-size: 14px;
	line-height: 1.15;
	background: transparent;
	border: 0;
}

.tab.active {
	color: #2A3A2C;
	font-weight: 800;
}
</style>
