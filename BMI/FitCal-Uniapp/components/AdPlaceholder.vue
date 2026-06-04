<template>
	<view class="ad-slot">
		<text class="ad-slot-label">{{ label }}</text>
	</view>
</template>

<script lang="ts">
	export default {
		props: {
			label: { type: String, required: true }
		}
	}
</script>
