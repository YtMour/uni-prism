<template>
	<image
		class="icon-mark icon-art"
		:class="`icon-${name}`"
		:src="iconSources[name] || iconSources.list"
		mode="aspectFit"
		aria-hidden="true"
	/>
</template>

<script>
import { iconSources } from '../../common/icons.js'

export default {
	name: 'IconMark',
	props: {
		name: {
			type: String,
			default: 'list'
		}
	},
	data() {
		return {
			iconSources
		}
	}
}
</script>

<style>
.icon-mark {
	display: block;
	width: var(--icon-width, var(--icon-size, 32px)) !important;
	height: var(--icon-height, var(--icon-size, 32px)) !important;
	flex: 0 0 auto;
	box-sizing: border-box;
	padding: var(--icon-padding, 3px);
	object-fit: contain;
	pointer-events: none;
	overflow: visible;
}

.icon-mark img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.brand-mark .icon-mark {
	--icon-width: 76px;
	--icon-height: 58px;
	--icon-padding: 0;
}

.brand-mark.small .icon-mark {
	--icon-width: 54px;
	--icon-height: 42px;
	--icon-padding: 0;
}

.round-icon .icon-mark {
	--icon-size: 42px;
	--icon-padding: 2px;
}

.round-icon.tiny .icon-mark {
	--icon-size: 26px;
	--icon-padding: 1px;
}

.template-art .icon-mark {
	--icon-size: 68px;
	--icon-padding: 2px;
}

.stat-icon {
	--icon-size: 46px;
	--icon-padding: 2px;
}

.meta-icon {
	--icon-size: 20px;
}

.input-icon {
	--icon-size: 30px;
}

.setting-icon .icon-mark {
	--icon-size: 32px;
	--icon-padding: 2px;
}

.tab-icon {
	--icon-size: 28px;
	--icon-padding: 2px;
}

@media (max-width: 430px) {
	.template-art .icon-mark {
		--icon-size: 58px;
	}
}
</style>
