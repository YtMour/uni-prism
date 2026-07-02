import App from './App.vue'
import IndexPage from './pages/index/index.vue'
import { createApp as createVueApp, createSSRApp } from 'vue'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

if (typeof document !== 'undefined') {
  createVueApp(IndexPage).mount('#app')
}
