# RateLens 技术架构草案

本文档定义 RateLens 首版开发时的模块边界和数据模型。当前已创建 `RateLens-Uniapp/` 原型项目，但核心逻辑仍主要写在 `pages/index/index.vue` 中；后续实现应以本文档为目标逐步拆分。

## 技术栈

- 应用框架：uni-app
- UI 框架：Vue 3
- 构建工具：Vite
- 状态管理：优先使用轻量 store，项目变复杂后再引入 Pinia
- 本地存储：`uni.getStorageSync` / `uni.setStorageSync`
- 数字格式化：`Intl.NumberFormat`
- 首轮验证目标：H5 优先，App 端随后验证

## 目标目录

```text
RateLens-Uniapp/
  pages/
    index/
      index.vue
  components/
    currency-card/
    travel-calculator/
    settings-list/
  core/
    currency.ts
    travel.ts
    format.ts
  services/
    rates/
      adapter.ts
      mockAdapter.ts
      cache.ts
    settings/
      storage.ts
  stores/
    rates.ts
    settings.ts
  i18n/
    index.ts
    zh-CN.ts
    en-US.ts
  tests/
  preview/
```

实际目录可根据 uni-app 模板调整，但模块边界应保持清晰。

## 核心数据模型

### CurrencyCode

```ts
type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'CNY' | 'HKD' | 'AUD' | 'CAD' | 'SGD' | 'CHF' | 'KRW' | 'THB' | 'MYR' | 'TWD' | 'INR' | 'AED' | string
```

### RateTable

所有汇率以 `USD` 为基准保存。

```ts
interface RateTable {
  base: 'USD'
  rates: Record<CurrencyCode, number>
  fetchedAt: string
  source: string
}
```

### UserSettings

```ts
interface UserSettings {
  homeCurrency: CurrencyCode
  watchedCurrencies: CurrencyCode[]
  locale: 'zh-CN' | 'en-US' | string
  cacheTtlHours: number
}
```

### TravelBill

```ts
interface TravelBill {
  subtotal: number
  currency: CurrencyCode
  taxRate: number
  tipRate: number
  peopleCount: number
}
```

## 汇率换算规则

只保存以 `USD` 为基准的汇率表，不为每个货币对单独请求接口。

```ts
function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  table: RateTable
) {
  return amount * table.rates[to] / table.rates[from]
}
```

约束：

- `rates[USD]` 必须等于 `1`。
- 缺少币种汇率时不得返回伪结果。
- UI 层负责展示错误状态，core 层负责抛出明确错误或返回结构化失败。
- 金额内部计算保留 number，展示层再格式化；如果后续接入金融级精度，再替换为 decimal 库。

## 汇率服务

### Adapter 接口

```ts
interface RateAdapter {
  fetchLatest(): Promise<RateTable>
}
```

首轮先实现 `mockAdapter`，保证页面和算法独立于真实 API。真实 API 选择后新增 adapter，不改 UI 和 core。

### 缓存策略

- 每次成功获取汇率后写入本地缓存。
- App 启动先读取缓存，再判断是否需要刷新。
- 刷新失败时保留旧缓存。
- 只有首次无缓存且 API 失败时，进入不可换算空状态。

### 数据新鲜度

```ts
interface RateFreshness {
  status: 'fresh' | 'stale' | 'offline' | 'empty'
  ageHours: number | null
  messageKey: string
}
```

UI 使用该结构展示状态，不直接判断底层错误文本。

## i18n 与格式化

- 所有展示文案走 i18n key。
- 金额格式化统一走 `formatCurrency(amount, currency, locale)`。
- 百分比、时间和数字也应集中封装，避免页面手写拼接。
- 首版必须覆盖 `zh-CN` 与 `en-US`，其他语言先预留结构。

## 验证策略

Phase 0/1 至少需要：

- 汇率换算单元验证：USD、非 USD、反向转换、缺失汇率。
- 旅行计算验证：税率、小费、分摊人数边界。
- 格式化抽样验证：`zh-CN`、`en-US` 下的金额展示。
- H5 构建验证。

Phase 2 需要补：

- 缓存读取、写入、过期判断。
- API 失败回退缓存。
- 首次无缓存失败状态。

## 当前待决策

- 是否直接使用真实汇率 API，还是先以 mock 数据完成 UI 和 core。
- 是否引入 Pinia，还是先用组合式函数和轻量 store。
- 是否需要后端代理汇率 API，以避免客户端暴露 key。
- H5 是否作为首个可验收平台。
