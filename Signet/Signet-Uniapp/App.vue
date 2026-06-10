<script>
	export default {
		onLaunch: function() {
			console.log('Signet launch')
		},
		onShow: function() {
			console.log('Signet show')
		},
		onHide: function() {
			console.log('Signet hide')
		}
	}
</script>

<style>
	page {
		background: #F9F7F2;
		color: #1A2A3A;
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	}

	view,
	text,
	button {
		box-sizing: border-box;
	}

	button {
		margin: 0;
		padding: 0;
		background: transparent;
		border: 0;
		line-height: 1;
	}

	button::after {
		border: 0;
	}
</style>
