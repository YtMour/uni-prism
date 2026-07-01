# DiceForge

DiceForge 是一款面向 D&D 玩家与 DM 的角色一键生成应用。它的目标不是替代完整车卡工具，而是在开局前、临场 NPC 创作、跑团灵感枯竭时，快速生成一张可直接使用、可分享、视觉上足够克制的冒险者角色卡。

## 当前阶段

DiceForge 当前处于 H5 MVP 发布候选加固阶段。产品、规则、生成系统、UX、数据结构和构建计划已经建立；`DiceForge-Uniapp` 中也已经打通角色生成、角色卡、重掷、复制文本、海报预览、最近角色、H5 构建、H5 smoke 和发布评估。

当前不能宣称为全平台公开发布完成，主要原因是 npm audit 仍有已知中高风险，且真机 WebView/App 基座尚未完成完整回归。

## 文档导航

| 文档 | 作用 |
| --- | --- |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | 当前文档入口、实现入口和验证命令 |
| [DiceForge.md](./DiceForge.md) | 原始概念与产品气质说明 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | 产品目标、用户场景、MVP 范围 |
| [GAME_RULES_SPEC.md](./GAME_RULES_SPEC.md) | D&D 规则边界与生成算法 |
| [GENERATION_DESIGN.md](./GENERATION_DESIGN.md) | 角色生成系统、文本矩阵和随机策略 |
| [UX_DESIGN.md](./UX_DESIGN.md) | 视觉语言、交互结构、动效与导出体验 |
| [DATA_SCHEMA.md](./DATA_SCHEMA.md) | 核心数据模型与字段定义 |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | 阶段构建路线与验收标准 |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | 实现状态、阻塞项与决策记录 |
| [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md) | H5 MVP 与公开发布门槛 |

## App 运行与验证

App 项目位于 [DiceForge-Uniapp](./DiceForge-Uniapp/)。

```bash
cd DiceForge-Uniapp
npm test
npm run build:browser
npm run build:h5
npm run smoke:h5
npm run audit:release
npm run assess:release
npm run check
```

说明：

- `npm run dev:browser` 用于本地浏览器视觉验证。
- `npm run build:h5` 生成正式 UniApp H5 产物。
- `npm run check` 是当前 H5 发布候选完整门槛。
- `npm run assess:release` 会刷新 [reports/mvp-release-assessment.json](./reports/mvp-release-assessment.json)。

## MVP 原则

- 一次点击生成完整 1 级角色。
- 输出必须可复制到聊天工具或跑团平台。
- 视觉重点放在角色卡可读性，不做复杂规则编辑器。
- 规则实现保持可解释，随机结果支持后续复现。
- 第一版优先移动端体验，同时兼顾桌面浏览。
- MVP 只承诺海报预览和文本复制，不承诺真实 PNG 保存。

## 非目标

- 不实现完整 D&D Beyond 级别的角色编辑器。
- 不处理升级、法术详细选择、战役管理、库存管理。
- 不引入需要联网的账号、云同步或社区系统。
- 不把核心规则文本原文大段内置到应用中。
