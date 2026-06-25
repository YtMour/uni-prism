# FuelFlow 文档索引

本文档是 FuelFlow 当前产品、设计、实现和验收讨论的入口。项目已经从纯设计讨论进入 uni-app H5 原型搭建阶段，后续文档以“真实 app 页面”和“可验证功能”为准，不再以浏览器里的手机壳展示稿为交付目标。

## 当前文档

| 文档 | 用途 | 状态 |
| --- | --- | --- |
| [PRODUCT_BRIEF.md](PRODUCT_BRIEF.md) | 产品定位、目标用户、核心价值、差异化边界 | 初稿 |
| [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md) | 视觉语言、交互原则、关键页面设计方向 | 初稿 |
| [FEATURE_SPEC.md](FEATURE_SPEC.md) | 功能模块、数据对象、MVP 范围和后续扩展 | 初稿 |
| [ROADMAP_AND_DECISIONS.md](ROADMAP_AND_DECISIONS.md) | 阶段路线、优先级、待讨论决策 | 初稿 |
| [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) | 当前 uni-app 原型实现状态、运行方式、已知问题 | 当前状态 |
| [PAGE_CONTENT_SPEC.md](PAGE_CONTENT_SPEC.md) | Dashboard、Add Fuel、Logs、Garage、Reports、Settings 页面内容规格 | 当前规格 |
| [VISUAL_QA_CHECKLIST.md](VISUAL_QA_CHECKLIST.md) | 视觉检查、素材显示、H5/移动端验收清单 | 当前验收标准 |
| [MVP_RELEASE_CHECKLIST.md](MVP_RELEASE_CHECKLIST.md) | 可发布 MVP 的功能、验证和发布阻断判断 | 当前发布清单 |

## 当前共识

- FuelFlow 面向海外私家车主、公路旅行用户、网约车和配送自由职业者。
- 产品核心不是“汽车社区”或“维修工具”，而是快速记录油费、里程和用车成本。
- 视觉方向采用 Gallerist Minimalism：干净、克制、数字清晰，有现代画廊和杂志插页感。
- 首屏体验应直接进入可用的记录与车辆概览，不做营销式落地页，也不做假手机外框、假状态栏或浏览器伪装设备壳。
- MVP 应优先打通车辆、加油记录、油耗计算、筛选回看、趋势查看和导出准备，而不是先铺大量周边模块。
- 当前 H5 原型用于快速查看页面效果，但页面本身应按真实 app/WebView 内容建设。
- 发布判断以 `MVP_RELEASE_CHECKLIST.md` 为准，不只看页面展示是否完整。

## 讨论优先级

1. 明确首发市场：美国优先，还是全球通用优先。
2. 明确 MVP 货币、单位和税务导出的默认策略。
3. 明确首页是“单车仪表盘”还是“多车车库”。
4. 明确快速录入的表单路径：数字键盘、滚轮、还是普通输入优先。
5. 明确商业模式：一次性买断、订阅、高级导出、还是免费基础版。
6. 完成 App 端 CSV 保存、原生 picker、真机视觉和本地存储回归。
7. 明确距离单位切换策略：只影响新记录，还是对历史记录做换算迁移。
8. 将临时字母图标替换为稳定的矢量图标系统。

## 文档维护规则

- `README.md` 保留为对外介绍和愿景说明。
- `docs/` 下文档作为当前讨论和后续实现的 source of truth。
- 产品范围变化先更新 `PRODUCT_BRIEF.md` 和 `FEATURE_SPEC.md`。
- 视觉和交互变化先更新 `DESIGN_DIRECTION.md`。
- 阶段目标、取舍和未决事项统一更新 `ROADMAP_AND_DECISIONS.md`。
- 原型实现进展、运行方式和已知问题统一更新 `IMPLEMENTATION_STATUS.md`。
- 页面字段、空状态、入口和交互文案变化统一更新 `PAGE_CONTENT_SPEC.md`。
- 每轮视觉修复后，用 `VISUAL_QA_CHECKLIST.md` 记录需要检查的视口、素材和功能路径。
