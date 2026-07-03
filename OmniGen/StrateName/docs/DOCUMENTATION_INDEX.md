# StrateName 文档索引

本文档是 StrateName 当前项目的 source of truth 入口。后续新增产品规划、实现说明、验证记录和发布材料时，先更新本索引。

## 当前结论

StrateName 当前处于 Phase 0 文档建设阶段。项目已有原始概念文档 [../StrateName.md](../StrateName.md)，本轮新增产品规格、生成系统、设计系统、合规风险、路线图、实现状态和 MVP 发布清单。

当前尚未创建 `StrateName-Uniapp/` 工程，也没有可运行 H5、生成器代码、测试、构建产物、质量采样报告或浏览器 smoke 结果。后续不能把本文档中的计划项写成已实现能力，除非代码和验证已经落地。

## 核心文档

| 文档 | 状态 | 用途 |
| --- | --- | --- |
| [../README.md](../README.md) | Done | 项目入口、当前阶段和推荐工程方向 |
| [../StrateName.md](../StrateName.md) | Done | 产品概念、视觉定位和功能概览 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | Done | 用户、场景、MVP 范围和后续功能 |
| [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md) | Done | 生成算法、词库设计、评分和过滤规则 |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Done | 视觉语言、页面结构、组件和提案卡规范 |
| [COMPLIANCE_AND_RISK.md](./COMPLIANCE_AND_RISK.md) | Done | 商标、公司注册、法律后缀、免责声明和隐私边界 |
| [ROADMAP.md](./ROADMAP.md) | Done | Phase 0 到 Phase 5 的路线计划 |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Done | 当前实现事实、风险和下一步 |
| [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md) | Done | H5 MVP 与公开发布门槛 |

## 设计图与素材

| 路径 | 状态 | 说明 |
| --- | --- | --- |
| [../designs/](../designs/) | Done for design reference | 6 张后续真实界面状态参考图，不是 H5 运行截图 |
| [../designs/README.md](../designs/README.md) | Done | 设计图清单、使用原则和生成提示摘要 |
| [../assets/](../assets/) | Done for first asset set | App 图标、品牌元素和 Boardroom Proposal 模板底图 |
| [../assets/README.md](../assets/README.md) | Done | 运行时素材清单、源图归档和接入建议 |
| [../assets/ASSET_AUDIT.md](../assets/ASSET_AUDIT.md) | Done | 资产覆盖、透明检查和后续缺口 |

## 建议后续目录

| 路径 | 用途 |
| --- | --- |
| `StrateName-Uniapp/` | 后续 App 工程目录 |
| `StrateName-Uniapp/src/core/` | 生成器、评分器、过滤器和 seed 随机逻辑 |
| `StrateName-Uniapp/src/data/` | 词根、行业词、后缀、组织形式、禁用词和示例数据 |
| `StrateName-Uniapp/src/components/` | 候选卡片、过滤器、详情面板、收藏夹、提案卡组件 |
| `StrateName-Uniapp/src/services/` | 本地存储、复制、导出、平台兼容和法律文案封装 |
| `StrateName-Uniapp/src/styles/` | 全局视觉 token、排版、响应式和提案卡样式 |
| `StrateName-Uniapp/static/` | App 图标、品牌纹理、卡片背景和导出模板素材 |
| `StrateName-Uniapp/scripts/` | 质量采样、重复率检查、UI 审计、i18n 审计、H5 smoke 和发布评估脚本 |
| `StrateName-Uniapp/tests/` | 生成器、评分、过滤、状态管理和关键 UI 交互测试 |
| `StrateName-Uniapp/reports/` | 质量采样、依赖审计、视觉回归和浏览器 smoke 报告 |
| `assets/` | 源素材、图标、品牌纹理和导出模板源文件 |
| `designs/` | 已创建，用于保存页面设计参考图 |

## 文档维护规则

- 功能真实进入代码后，先更新 [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)。
- 发布门槛变化时，同步更新 [MVP_RELEASE_CHECKLIST.md](./MVP_RELEASE_CHECKLIST.md)。
- 生成规则、词库字段、评分权重或禁用词策略变化时，同步更新 [GENERATION_SYSTEM.md](./GENERATION_SYSTEM.md)。
- UI、视觉、提案卡或交互变化时，同步更新 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)。
- 法律文案、免责声明、公司后缀或外部查询策略变化时，同步更新 [COMPLIANCE_AND_RISK.md](./COMPLIANCE_AND_RISK.md)。
- 设计图变化时，后续同步更新 `designs/README.md`。
- 运行时素材变化时，后续同步更新 `assets/README.md` 和 `assets/ASSET_AUDIT.md`。
- 不把未实现、未构建、未验证的能力写成 Done。
- 验证失败或未运行的检查必须明确记录，不用“已验证”代替计划。
