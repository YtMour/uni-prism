# VibeName 路线图

## 当前阶段

当前阶段：Phase 4，H5 MVP preview candidate 向 public H5 MVP release candidate 收敛。

`VibeName-Uniapp/` 已经完成可运行 H5、模块化界面、本地生成器、真实设置偏好、分段隐私政策、分段免责声明、18 个主流应用语种选择、Arabic RTL 接线、质量采样、静态 H5 smoke、i18n 审计、Playwright 真浏览器 smoke、视觉截图归档、依赖审计基线和基础验证链路。当前目标不是继续补概念文档，而是处理 uni/vite 工具链升级决策、正式法律审校和最终复核，把 preview candidate 推进到 public MVP release。

## Phase 0：项目定义与文档建设

状态：Done

交付：

- 项目定位和产品概念。
- 文档索引。
- 产品规格。
- 生成系统设计。
- 设计系统。
- 路线图。
- 实现状态。
- MVP 发布清单。

## Phase 1：工程脚手架与最小生成器

状态：Done

交付：

- uni-app + Vue 3 工程。
- `src/core/generator.js`。
- `src/data/lexicon.js` 结构化词库。
- 首页生成流程。
- 候选卡片。
- 基础测试。
- H5 dev/build 命令。

验收：

- `npm test` 通过。
- `npm run build:h5` 通过。
- 可在 `http://127.0.0.1:5191/` 本地预览。

## Phase 2：评分、过滤与白板

状态：Done

交付：

- 可读性、品牌感、行业匹配、简短性和差异性评分。
- 禁用片段和可读性过滤。
- 收藏/取消收藏。
- Founder Whiteboard。
- 本地持久化。
- 单个名称复制和全部复制。

验收：

- 刷新后收藏可保留。
- 评分维度展示清楚。
- 详情面板展示结构和词源。
- 390px 移动视口无横向溢出。

## Phase 3：概念卡片与质量验证

状态：Done for preview

交付：

- Concept Preview。
- 自动 tagline。
- seed 复现。
- `npm run sample:quality`。
- `npm run audit:ui`。
- `npm run smoke:h5`。
- `npm run smoke:browser`。
- `npm run audit:deps`。
- `npm run audit:visual`。
- 质量报告输出到 `reports/generation-quality.json`。
- 视觉归档输出到 `reports/visual/`。

当前质量结果：

- 采样候选：11520。
- 唯一名称：10643。
- 重复实例率：7.61%。
- 平均分：86.58。
- 通过率：100%。

## Phase 4：H5 MVP 候选加固

状态：In Progress

目标：

- 从 H5 preview candidate 推进到 public H5 MVP release candidate。

已完成：

- `npm run check` 串联 `npm test && npm run sample:quality && npm run audit:ui && npm run audit:i18n && npm run build:h5 && npm run smoke:h5 && npm run audit:visual && npm run smoke:browser && npm run audit:deps`。
- `npm run smoke:browser` 覆盖生成、详情、保存、Preview、Whiteboard、Settings、语言切换、分段隐私政策、分段免责声明、详细法律条款和移动视口。
- `npm run audit:i18n` 覆盖 locale key 一致性、关键组件翻译接线、详细法律条款和法律入口。
- `npm run audit:deps` 固定当前 4 moderate + 15 high uni/vite 工具链风险基线。
- 右侧浏览器完成桌面、390px 和 360px 移动视口指标验证与截图归档。
- Settings 的 Result count、Use seed、Filter hard-to-read names、Show score details 已接入真实状态和本地持久化。
- Settings 的 Language 已扩展为 18 个主流应用语种下拉选择，分段 Privacy policy、分段 Disclaimer 已接入真实界面状态和自动化检查。
- MVP release assessment 已建立。

剩余阻断：

1. 对 `npm audit` 的 19 个 moderate/high 风险做 uni/vite 升级决策。
2. 完成分段隐私政策和免责声明的正式法律审校。
3. 增加复制、收藏、Whiteboard 和 Preview 的更多交互级自动化覆盖。
4. 完成 public 发布前最终人工/真机复核。

## Phase 5：后续增强

状态：Deferred

候选方向：

- 域名可用性查询。
- 商标查询入口或第三方跳转。
- AI 命名增强。
- 主题化概念卡片。
- PNG 导出。
- 全量翻译管理、locale 文案质量审校和更多区域化格式。
- 团队共享白板。
- App、小程序和 PWA 分发。

进入条件：

- H5 MVP 真实发布或完成内部验证。
- 生成质量和用户反馈证明命名方向可继续投入。
- 基础工程、测试和文档维护链路稳定。
