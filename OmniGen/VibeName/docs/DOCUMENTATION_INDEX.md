# VibeName 文档索引

本文档是 VibeName 当前项目的 source of truth 入口。后续新增产品规划、实现说明、验证记录和发布材料时，先更新本索引。

## 当前结论

VibeName 当前处于产品规划与文档建设阶段，不是可发布 MVP，也不是可运行 App。当前目录只有文档，没有应用工程、代码、词库、构建脚本或验证脚本。

第一阶段建议先建立 uni-app + Vue 3 工程，完成本地生成闭环，再进入 H5 MVP 候选评估。

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
| `VibeName-Uniapp/` | 后续 App 工程目录 |
| `VibeName-Uniapp/src/core/` | 生成器、评分器、过滤器和 seed 随机逻辑 |
| `VibeName-Uniapp/src/data/` | 词根、后缀、行业词、禁用词和示例短语 |
| `VibeName-Uniapp/src/components/` | 名称卡片、过滤器、白板、概念卡片组件 |
| `VibeName-Uniapp/src/services/` | 本地存储、复制、导出和平台兼容封装 |
| `VibeName-Uniapp/scripts/` | 质量采样、重复率检查、H5 smoke 和发布评估脚本 |
| `VibeName-Uniapp/tests/` | 生成器、评分和 UI 状态测试 |

## 文档维护规则

- 功能真实进入代码后，先更新 [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)。
- 发布门槛变化时，同步更新 [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md)。
- 生成规则、词库字段或评分权重变化时，同步更新 [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md)。
- UI、视觉、导出卡片或交互变化时，同步更新 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)。
- 设计图变化时，同步更新 [../designs/README.md](../designs/README.md)。
- 运行时素材变化时，同步更新 [../assets/README.md](../assets/README.md)。
- 不把未实现、未构建、未验证的能力写成 Done。
- 验证失败或未运行的检查必须明确记录，不用“已验证”代替计划。
