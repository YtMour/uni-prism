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
  showToast(options: {
    title: string
    icon?: 'success' | 'loading' | 'none' | 'error'
    duration?: number
  }): void
  setClipboardData(options: {
    data: string
    success?: () => void
    fail?: (error: unknown) => void
  }): void
  navigateTo(options: {
    url: string
  }): void
  navigateBack(options?: {
    delta?: number
  }): void
  request(options: {
    url: string
    method?: string
    header?: Record<string, string>
    data?: unknown
    success?: (result: unknown) => void
    fail?: (error: unknown) => void
  }): void
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
