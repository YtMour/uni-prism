# VibeName 文档索引

本文档是 VibeName 当前项目的 source of truth 入口。后续新增产品规划、实现说明、验证记录和发布材料时，先更新本索引。

## 当前结论

VibeName 当前处于 H5 MVP preview candidate 向 public H5 MVP release candidate 推进阶段。`VibeName-Uniapp/` 已具备本地生成器、模块化移动端界面、收藏白板、概念预览、真实设置偏好、分段隐私政策、分段免责声明、18 个主流应用语种选择、Arabic RTL 接线、质量采样、单元测试、UI 源码审计、i18n 审计、H5 静态 smoke、Playwright 真浏览器 smoke、视觉截图归档、依赖审计基线和 H5 构建链路。

当前可以用于本地 H5 预览和内部 MVP 演示，生成质量已经达到 public release 建议重复率阈值，核心 H5 验证链路和法律/i18n 入口也已可复跑。尚未宣称最终 public MVP release 的主要原因是 `npm audit` 仍有 19 个 uni/vite 工具链漏洞基线，需要单独做升级决策和最终发布前复核。

## 核心文档

| 文档 | 状态 | 用途 |
| --- | --- | --- |
| [../README.md](../README.md) | Done | 项目入口、当前阶段和推荐工程方向 |
| [../VibeName.md](../VibeName.md) | Done | 产品概念、视觉定位和功能概览 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | Done | 用户、场景、MVP 范围和后续功能 |
| [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md) | Done | 生成算法、词库设计、评分和过滤规则 |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Done | 视觉语言、页面结构、组件和卡片预览规范 |
| [ROADMAP.md](./ROADMAP.md) | Done | Phase 0 到 Phase 5 的路线计划 |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Done | 当前实现事实、风险和下一步 |
| [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md) | Done | H5 MVP 与公开发布门槛 |
| [MVP_RELEASE_ASSESSMENT.md](./MVP_RELEASE_ASSESSMENT.md) | Done | 当前 H5 MVP preview 发布评估 |

## 设计图与素材

| 路径 | 状态 | 说明 |
| --- | --- | --- |
| [../designs/](../designs/) | Done | 6 张移动端真实界面状态设计图 |
| [../designs/README.md](../designs/README.md) | Done | 设计图清单、使用原则和生成说明 |
| [../assets/](../assets/) | Done | App 图标、品牌 glyph、空状态和预览背景等运行时素材 |
| [../assets/README.md](../assets/README.md) | Done | 运行时素材索引和使用原则 |
| [../assets/ASSET_AUDIT.md](../assets/ASSET_AUDIT.md) | Done | 素材覆盖、缺口和后续派生资产审计 |

## 后续建议目录

| 路径 | 用途 |
| --- | --- |
| `VibeName-Uniapp/` | 当前 App 工程目录 |
| `VibeName-Uniapp/src/core/` | 生成器、评分器、过滤器和 seed 随机逻辑 |
| `VibeName-Uniapp/src/data/` | 词根、后缀、行业词、禁用词和示例短语 |
| `VibeName-Uniapp/src/components/` | 名称卡片、过滤器、白板、概念卡片组件 |
| `VibeName-Uniapp/src/services/` | 本地存储、复制、导出和平台兼容封装 |
| `VibeName-Uniapp/scripts/` | 质量采样、重复率检查、UI 审计、i18n 审计、H5 smoke 和发布评估脚本 |
| `VibeName-Uniapp/tests/` | 生成器、评分和 UI 状态测试 |
| `VibeName-Uniapp/reports/` | 质量采样报告和后续视觉回归报告 |

## 文档维护规则

- 功能真实进入代码后，先更新 [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)。
- 发布门槛变化时，同步更新 [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md)。
- 生成规则、词库字段或评分权重变化时，同步更新 [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md)。
- UI、视觉、导出卡片或交互变化时，同步更新 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)。
- 设计图变化时，同步更新 [../designs/README.md](../designs/README.md)。
- 运行时素材变化时，同步更新 [../assets/README.md](../assets/README.md)。
- 不把未实现、未构建、未验证的能力写成 Done。
- 验证失败或未运行的检查必须明确记录，不用“已验证”代替计划。
