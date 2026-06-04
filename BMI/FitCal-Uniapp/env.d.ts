/// <reference types="vite/client" />

declare const uni: {
  getStorageSync<T = unknown>(key: string): T
  setStorageSync(key: string, value: unknown): void
  removeStorageSync(key: string): void
  showModal(options: {
    title: string
    content: string
    showCancel?: boolean
    confirmColor?: string
  }): void
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
