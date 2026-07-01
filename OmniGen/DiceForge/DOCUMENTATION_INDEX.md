# DiceForge 文档索引

## 当前结论

DiceForge 当前是 H5 MVP 发布候选，而不是全平台公开发布完成。代码侧已经具备本地生成、角色卡展示、文本复制、海报预览、最近角色记录、H5 构建、H5 smoke、发布审计和自动评估报告；公开发布前仍需处理依赖审计风险和真机 WebView/App 基座回归。

当前状态以这三个文件为准：

| 文档 | 用途 |
| --- | --- |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | 当前实现事实、验证记录、已知风险和下一步 |
| [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md) | H5 MVP 与公开发布门槛 |
| [reports/mvp-release-assessment.json](./reports/mvp-release-assessment.json) | `npm run assess:release` 生成的机器评估结果 |

## 产品与设计文档

| 文档 | 状态 | 说明 |
| --- | --- | --- |
| [README.md](./README.md) | 当前入口 | 项目概览、运行命令和文档导航 |
| [DiceForge.md](./DiceForge.md) | 概念基线 | 原始产品气质、体验方向和创作目标 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | MVP 范围 | 用户场景、必须实现、应该实现和暂缓范围 |
| [GAME_RULES_SPEC.md](./GAME_RULES_SPEC.md) | 规则边界 | 5E 轻量规则映射、生成算法和版权边界 |
| [GENERATION_DESIGN.md](./GENERATION_DESIGN.md) | 生成系统 | seed、随机流水线、文本矩阵和可扩展方向 |
| [UX_DESIGN.md](./UX_DESIGN.md) | 体验规范 | 手机端优先布局、D20 交互、导出和可访问性要求 |
| [DATA_SCHEMA.md](./DATA_SCHEMA.md) | 数据模型 | 角色、属性、装备、熟练项和导出字段结构 |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | 构建路线 | Phase 0 到 Phase 5 的交付和验收标准 |

## 设计图与素材

| 路径 | 状态 | 说明 |
| --- | --- | --- |
| [designs/](./designs/) | 当前手机端设计基准 | 8 张真实 App 页面设计图，覆盖首页、生成、角色卡、重掷、导出和最近列表 |
| [designs/README.md](./designs/README.md) | 当前设计说明 | 明确这些设计图是手机端页面流，不是宣传图 |
| [assets/icons/](./assets/icons/) | 当前图标资产 | App 图标、界面图标源图和透明 PNG |
| [assets/source/](./assets/source/) | D20 源素材 | 中心骰子相关源图和处理过程素材 |

## 实现入口

| 路径 | 作用 |
| --- | --- |
| [DiceForge-Uniapp/src/core/generator.js](./DiceForge-Uniapp/src/core/generator.js) | 角色生成核心 |
| [DiceForge-Uniapp/src/browser/BrowserApp.vue](./DiceForge-Uniapp/src/browser/BrowserApp.vue) | 浏览器验证页面，当前右侧浏览器主要使用该入口 |
| [DiceForge-Uniapp/src/browser/components/HeroDie.vue](./DiceForge-Uniapp/src/browser/components/HeroDie.vue) | 中心 D20 视觉和投骰动效组件 |
| [DiceForge-Uniapp/pages/index/index.vue](./DiceForge-Uniapp/pages/index/index.vue) | UniApp 页面入口 |
| [DiceForge-Uniapp/src/pages/index/index.vue](./DiceForge-Uniapp/src/pages/index/index.vue) | UniApp 源目录页面入口 |
| [DiceForge-Uniapp/static/](./DiceForge-Uniapp/static/) | H5/UniApp 静态资源 |

## 验证命令

在 `DiceForge/DiceForge-Uniapp` 中运行：

```bash
npm test
npm run build:browser
npm run build:h5
npm run smoke:h5
npm run audit:release
npm run assess:release
npm run check
```

说明：

- `npm run check` 是当前完整 H5 发布候选门槛。
- `npm run assess:release` 会刷新 [reports/mvp-release-assessment.json](./reports/mvp-release-assessment.json)。
- `npm run audit:release` 不是消除审计风险，而是锁定当前已知风险基线：19 total，15 high，4 moderate，0 critical。
- 真机 WebView/App 基座回归尚未由自动脚本覆盖，不能只靠构建通过宣称公开发布完成。

## 文档维护规则

- 功能真实进入 App 后，先更新 [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)，再更新发布清单。
- 发布门槛变化时，同步更新 [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md) 和评估脚本。
- 设计图只记录真实页面结构和功能流，不再混入桌面工作台或宣传图。
- 海报保存仍是后续增强项；MVP 文档只能承诺海报预览和文本复制。
