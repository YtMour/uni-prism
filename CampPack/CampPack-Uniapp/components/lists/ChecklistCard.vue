<template>
	<view class="list-card" @click="$emit('open', list)">
		<view class="list-main">
			<view class="round-icon"><icon-mark :name="list.icon" /></view>
			<view class="list-copy">
				<text class="card-title">{{ list.name }}</text>
				<text class="muted">{{ list.date }}</text>
			</view>
			<text class="dots">⋮</text>
		</view>
		<view class="phase-grid">
			<view v-for="phase in list.phases" :key="phase.key || phase.name" class="phase-cell">
				<text :class="['phase-name', phase.isLeave ? 'danger-text' : '']">{{ phase.name }}</text>
				<text class="phase-count">{{ phase.done }} / {{ phase.total }}</text>
				<view class="mini-track">
					<view :class="['mini-fill', phase.isLeave ? 'danger-bg' : '']" :style="{ width: percent(phase.done, phase.total) + '%' }"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import IconMark from '../shared/IconMark.vue'

export default {
	name: 'ChecklistCard',
	components: {
		IconMark
	},
	props: {
		list: {
			type: Object,
			required: true
		}
	},
	emits: ['open'],
	methods: {
		percent(done, total) {
			return Math.round((done / total) * 100)
		}
	}
}
</script>

<style>
.list-card {
	padding: 18px;
	margin-bottom: 12px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.5);
}

.list-main {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 18px;
}

.round-icon {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 58px;
	height: 58px;
	border-radius: 50%;
	background: #F0F1EE;
	overflow: visible;
}

.list-copy {
	flex: 1;
	min-width: 0;
}

.card-title {
	display: block;
	margin-bottom: 5px;
	color: #111;
	font-size: 24px;
	font-weight: 800;
	line-height: 1.16;
}

.muted {
	display: block;
	color: #666;
	font-size: 16px;
	line-height: 1.25;
}

.dots {
	color: #777;
	font-size: 28px;
}

.phase-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 12px;
}

.phase-cell {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	border-right: 1px solid #DDD8CE;
}

.phase-cell:last-child {
	border-right: 0;
}

.phase-name {
	font-size: 18px;
	font-weight: 700;
}

.phase-count {
	color: #444;
	font-size: 18px;
}

.mini-track {
	width: 92px;
	height: 6px;
	border-radius: 999px;
	background: #DDD8CE;
	overflow: hidden;
}

.mini-fill {
	height: 100%;
	border-radius: inherit;
	background: #2A3A2C;
}

.danger-text {
	color: #B65D3A !important;
}

.danger-bg {
	background: #B65D3A !important;
}

@media (max-width: 430px) {
	.list-card {
		padding: 16px;
	}

	.phase-grid {
		gap: 8px;
	}

	.phase-name,
	.phase-count {
		font-size: 15px;
	}

	.mini-track {
		width: 72px;
	}
}
</style>
