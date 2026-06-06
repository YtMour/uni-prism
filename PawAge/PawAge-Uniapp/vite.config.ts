import { defineConfig, type PluginOption } from 'vite'
import uniModule from '@dcloudio/vite-plugin-uni'

process.env.UNI_INPUT_DIR = process.env.UNI_INPUT_DIR || process.cwd()
process.env.UNI_PLATFORM = process.env.UNI_PLATFORM || 'h5'

type UniPluginFactory = () => PluginOption[]
const uniCompat = uniModule as unknown as UniPluginFactory | { default: UniPluginFactory }
const uni = typeof uniCompat === 'function' ? uniCompat : uniCompat.default

export default defineConfig({
  plugins: [uni()]
})
