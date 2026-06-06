<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
  // Reserved for future storage migrations.
})

onShow(() => {})

onHide(() => {})
</script>

<style>
page {
  min-height: 100%;
  background: #fdfbf7;
  color: #2f2923;
  font-family: Inter, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

view,
text,
button,
input {
  box-sizing: border-box;
}

button {
  border: 0;
  margin: 0;
  padding: 0;
  background: transparent;
  line-height: 1;
}

button::after {
  border: 0;
}
</style>
