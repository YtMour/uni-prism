<template>
	<view class="template-card">
		<view class="template-art"><icon-mark :name="template.icon" /></view>
		<view class="template-copy">
			<text class="card-title">{{ template.name }}</text>
			<view class="template-meta">
				<icon-mark name="list" class="meta-icon" />
				<text>{{ template.items }} {{ labels.items }}</text>
				<text class="divider">|</text>
				<icon-mark name="weight" class="meta-icon danger" />
				<text>{{ template.weight }} {{ labels.kg }}</text>
			</view>
			<view class="tag-row">
				<text v-for="tag in template.tags" :key="tag" class="tag">{{ tagLabels[tag] || tag }}</text>
			</view>
		</view>
		<button class="small-primary" @click="$emit('import', template)">{{ labels.import }}</button>
	</view>
</template>

<script>
import IconMark from '../shared/IconMark.vue'

export default {
	name: 'TemplateCard',
	components: {
		IconMark
	},
	props: {
		template: {
			type: Object,
			required: true
		},
		labels: {
			type: Object,
			default: () => ({ items: 'items', import: 'Import', kg: 'kg' })
		},
		tagLabels: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['import']
}
</script>

<style>
.template-card {
	display: grid;
	grid-template-columns: 92px minmax(0, 1fr) auto;
	align-items: center;
	gap: 16px;
	padding: 18px;
	margin-bottom: 14px;
	border: 1px solid #DDD8CE;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.5);
}

.template-copy {
	min-width: 0;
}

.template-art {
	width: 92px;
	height: 92px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #F0F1EE;
	overflow: visible;
}

.template-meta {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 7px;
	color: #555;
	font-size: 15px;
	margin-bottom: 10px;
}

.template-card .tag-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	margin-bottom: 0;
}

.divider {
	color: #C8C1B5;
}

.tag {
	padding: 6px 12px;
	border-radius: 7px;
	background: #F0F1EE;
	color: #2A3A2C;
	font-size: 14px;
}

.small-primary {
	min-width: 82px;
	flex: 0 0 82px;
	height: 48px;
	border-radius: 8px;
	background: #234127;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	font-size: 18px;
	font-weight: 800;
	line-height: 1;
	overflow: hidden;
}

@media (max-width: 430px) {
	.template-card {
		grid-template-columns: 56px minmax(0, 1fr) 78px !important;
		align-items: center !important;
		gap: 10px;
		padding: 16px;
	}

	.template-card .template-art {
		width: 56px !important;
		height: 56px !important;
	}

	.template-card .template-art .icon-mark {
		--icon-size: 46px !important;
	}

	.card-title {
		font-size: 18px;
		line-height: 1.18;
		margin-bottom: 6px;
	}

	.template-meta {
		gap: 5px;
		font-size: 13px;
		margin-bottom: 8px;
	}

	.template-card .tag-row {
		gap: 7px;
	}

	.tag {
		padding: 5px 9px;
		font-size: 12px;
	}

	.small-primary {
		grid-column: auto !important;
		justify-self: auto !important;
		min-width: 0;
		width: 78px;
		height: 42px;
		padding: 0;
		font-size: 15px;
	}
}
</style>
