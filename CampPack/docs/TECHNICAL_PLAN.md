# CampPack 技术方案

## 1. 技术栈

- 框架: uni-app + Vue 3 + Vite。
- 状态管理: Pinia。
- 本地存储 MVP: `uni.setStorageSync` / `uni.getStorageSync` 包装后的 repository 层。
- 后续本地数据库: App 端 SQLite，H5 / 小程序继续使用 Storage 或 IndexedDB 适配。
- 样式: Vue SFC + SCSS 或统一 CSS 变量。
- 测试: 先建立纯函数单元测试，再补 H5 smoke、视觉审计和 App 手工验收。

当前 H5 工程位于 `CampPack-Uniapp`：

- `npm run dev:h5`: 启动 H5 开发服务。
- `npm run build:h5`: 构建 H5 发布产物。
- `npm test`: 运行 repository 单元测试，覆盖模板导入、三阶段状态独立和 Leave reset。
- `npm run smoke:h5`: 运行 Playwright H5 冒烟测试，覆盖刷新持久化、三阶段状态、空白清单创建/删除、清单重命名/复制、装备新增/字段编辑/分类调整、隐私页、数据重置确认、JSON 导出/导入和单位/语言设置。
- `npm run audit:visual`: 静态检查图标安全边距、底部导航不透明、关键图标容器裁切策略和滚动区底部预留。
- `npm run audit:architecture`: 检查演示数据、图标映射和重复卡片/底栏结构是否保持模块化。

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

当前原型阶段已落地的模块：

```text
common/icons.js                         图标资源映射
data/demoData.js                        当前设置分组和导航数据
data/templates.js                       MVP 内置模板和装备条目
services/campRepository.js              本地数据 repository、schema、模板导入、三阶段状态和 H5 storage fallback
i18n/messages.js                        八种语言的 MVP 文案、隐私政策和免责声明文本
components/shared/IconMark.vue          统一图标渲染
components/shared/AppTabbar.vue         底部导航
components/templates/TemplateCard.vue   模板卡片
components/lists/ChecklistCard.vue      清单卡片
components/settings/SettingsSection.vue 设置分组
```

`pages/index/index.vue` 暂时保留页面状态机、详情页和编辑页，但清单、模板导入、空白清单创建、清单删除确认、清单重命名/复制、三阶段勾选、Leave reset、装备新增/删除、装备字段编辑、分类菜单、隐私/免责声明页入口、数据重置确认、JSON 导出/导入和单位/语言设置已通过 repository 读写本地状态。后续接入真实 store 时，应优先把详情页分类、装备条目和编辑表单继续拆成组件。

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
- H5 repository 同时写入 `uni.setStorageSync` 和 `localStorage` fallback，确保浏览器刷新 smoke 能验证真实持久化。
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

## 7. 视觉稳定性

- 图标统一通过 `IconMark` 渲染，页面层附加安全内边距，避免生成类 PNG 细边被圆形容器裁掉。
- 圆形图标容器、模板图标容器和设置图标容器默认 `overflow: visible`，除非资源已明确有足够透明留白。
- 底部导航栏必须是不透明遮挡层，并且页面滚动区底部预留空间需要大于导航栏高度，避免内容透出或被遮挡。
- H5 视觉相关改动完成后，至少运行 `npm run audit:visual` 和 `npm run build:h5`，再用浏览器检查移动视口。

## 8. 单位换算

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

## 9. 风险与决策

| 风险 | 影响 | 决策 |
| --- | --- | --- |
| 过早接入 SQLite | 增加跨端复杂度 | MVP 先 Storage，后续按数据规模升级 |
| 三阶段状态互相覆盖 | 核心价值失效 | 数据模型中独立保存三个状态 |
| 模板内容不专业 | 新手价值下降 | 先内置 3 套可审查模板，再扩展 |
| 视觉过度装饰 | 户外可读性差 | 优先对比度、触控面积和状态清晰度 |
| 云同步过早引入 | 增加账号、隐私、冲突成本 | V2 再做 |
| 固定底栏半透明 | 内容透出并与导航重叠 | 固定栏位使用不透明背景和底部预留 |
