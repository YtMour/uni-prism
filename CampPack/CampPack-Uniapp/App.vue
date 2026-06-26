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
		background: #FBF9F5;
		color: #1E1E1E;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	}

	view,
	text,
	button,
	input,
	textarea {
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
