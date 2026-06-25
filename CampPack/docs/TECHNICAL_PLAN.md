# CampPack 技术方案

## 1. 技术栈

- 框架: uni-app + Vue 3 + Vite。
- 状态管理: Pinia。
- 本地存储 MVP: `uni.setStorageSync` / `uni.getStorageSync` 包装后的 repository 层。
- 后续本地数据库: App 端 SQLite，H5 / 小程序继续使用 Storage 或 IndexedDB 适配。
- 样式: Vue SFC + SCSS 或统一 CSS 变量。
- 测试: 先建立纯函数单元测试，再补 H5 smoke 和 App 手工验收。

## 2. 架构分层

```text
pages/
  lists/          清单列表
  checklist/      清单详情与三阶段模式
  templates/      模板选择
  settings/       设置与数据管理

components/
  checklist/      条目、分类、模式切换、重量摘要
  templates/      模板卡片
  shared/         按钮、空状态、确认弹窗

stores/
  checklistStore  清单状态与派生统计
  settingsStore   单位、语言、实验开关

services/
  storage         本地存储适配
  templates       内置模板读取
  weight          单位换算与统计
  migration       数据版本迁移
```

## 3. 数据模型草案

```ts
export type ChecklistMode = 'pack' | 'setup' | 'leave'
export type UnitSystem = 'metric' | 'imperial'

export interface Checklist {
  id: string
  name: string
  templateId?: string
  categories: GearCategory[]
  createdAt: number
  updatedAt: number
  version: number
}

export interface GearCategory {
  id: string
  name: string
  order: number
  items: GearItem[]
}

export interface GearItem {
  id: string
  name: string
  quantity: number
  weightGrams?: number
  note?: string
  isCritical?: boolean
  order: number
  status: {
    pack: boolean
    setup: boolean
    leave: boolean
  }
}
```

关键约束：

- Pack / Setup / Leave 状态独立存储。
- Leave 初始化时读取 Pack 状态，但不覆盖 Pack。
- 重量统一以克存储，显示层再转换为 oz / lb。
- 所有实体必须有 `id`，避免重排导致状态错绑。

## 4. 本地存储策略

MVP 使用单一版本化数据包：

```ts
interface CampPackStorage {
  schemaVersion: number
  checklists: Checklist[]
  settings: {
    unitSystem: UnitSystem
    language: 'en' | 'zh'
  }
}
```

存储要求：

- 所有写入通过 repository 层，页面不直接调用 `uni.setStorageSync`。
- 写入前更新 `updatedAt`。
- 读取时执行 schema migration。
- 写入失败时返回错误并在 UI 提示。

## 5. 离线与同步边界

MVP 不做云同步。这样可以保证：

- 无账号门槛。
- 隐私风险低。
- 弱网场景不影响核心流程。

后续如做同步，必须满足：

- 本地写入先成功，远端同步异步执行。
- 冲突解决以清单级 `updatedAt` 或操作日志为基础。
- 用户能关闭同步。

## 6. 性能策略

- MVP 可先使用普通列表，但需要在 300 到 500 条条目规模下验证。
- 列表项组件必须稳定 key。
- 统计值使用 computed 派生，避免每次渲染重新深遍历无关数据。
- 搜索、筛选和分类折叠放在 store selector 或 computed 中集中处理。
- 若 App 低端机出现掉帧，再引入虚拟列表。

## 7. 单位换算

统一存储克，显示时格式化：

```ts
export function formatWeight(grams: number, unitSystem: UnitSystem) {
  if (unitSystem === 'imperial') {
    const oz = grams * 0.035274
    if (oz >= 16) return `${(oz / 16).toFixed(1)} lb`
    return `${oz.toFixed(1)} oz`
  }

  if (grams >= 1000) return `${(grams / 1000).toFixed(2)} kg`
  return `${Math.round(grams)} g`
}
```

## 8. 风险与决策

| 风险 | 影响 | 决策 |
| --- | --- | --- |
| 过早接入 SQLite | 增加跨端复杂度 | MVP 先 Storage，后续按数据规模升级 |
| 三阶段状态互相覆盖 | 核心价值失效 | 数据模型中独立保存三个状态 |
| 模板内容不专业 | 新手价值下降 | 先内置 3 套可审查模板，再扩展 |
| 视觉过度装饰 | 户外可读性差 | 优先对比度、触控面积和状态清晰度 |
| 云同步过早引入 | 增加账号、隐私、冲突成本 | V2 再做 |
