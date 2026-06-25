<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		background: #fbf9f5;
		color: #172126;
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	}

	view,
	text,
	button,
	input {
		box-sizing: border-box;
	}

	button {
		padding: 0;
		margin: 0;
		background: transparent;
		border: 0;
		line-height: normal;
	}

	button::after {
		border: 0;
	}
</style>
