# Documentation Index

本文档是 MythosGen 当前 App 项目的文档入口。后续新增规划、实现说明和发布材料时，先更新本索引。

## 核心文档

| 文档 | 用途 |
| --- | --- |
| [../../README.md](../../README.md) | OmniGen 系列管理文件夹介绍 |
| [../README.md](../README.md) | MythosGen App 项目文件夹说明 |
| [MYTHOSGEN_PRODUCT_PLAN.md](MYTHOSGEN_PRODUCT_PLAN.md) | 产品定位、用户、功能范围和商业方向 |
| [MYTHOSGEN_GENERATION_SYSTEM.md](MYTHOSGEN_GENERATION_SYSTEM.md) | 姓名、咒语、神器词汇的生成模型设计 |
| [MYTHOSGEN_DESIGN_SYSTEM.md](MYTHOSGEN_DESIGN_SYSTEM.md) | 视觉语言、交互、组件和导出卡片规范 |
| [MYTHOSGEN_ROADMAP.md](MYTHOSGEN_ROADMAP.md) | 近期到长期路线图 |
| [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) | 当前实现状态、阻断项和下一步 |
| [MYTHOSGEN_QA_VERIFICATION.md](MYTHOSGEN_QA_VERIFICATION.md) | 测试、构建、浏览器 smoke 和右侧内置浏览器已知问题 |
| [MVP_RELEASE_ASSESSMENT.md](MVP_RELEASE_ASSESSMENT.md) | 当前版本是否可作为 MVP 发布、阻断项和后续完善路线 |
| [../design/README.md](../design/README.md) | 设计参考图与素材说明 |
| [../design/ASSET_INDEX.md](../design/ASSET_INDEX.md) | 设计图、运行时素材和实现引用索引 |

## 当前结论

- OmniGen 是随机生成系列 App 的管理文件夹，不是 MythosGen 的应用工程目录。
- `FantasyNameGenerator/` 是当前 MythosGen App 的项目文件夹，后续代码和项目内资源应保存在这里。
- MythosGen 是 OmniGen 系列的首个落地 App，当前以独立应用而不是单纯模块来规划。
- MVP 应先验证生成质量、收藏/复制/导出闭环和移动端沉浸式交互。
- 早期生成系统应本地化，使用可解释的音节矩阵、权重和过滤器，而不是直接依赖远程 AI。
- 商业化不应破坏核心体验，优先采用 Pro 解锁、主题包、导出样式包和轻量广告移除。
- `FantasyNameGenerator/design/` 已建立设计图和运行时素材索引；App 初版从 `static/mythos/` 引用透明素材和羊皮纸纹理。
- H5 交互验证以 `MYTHOSGEN_QA_VERIFICATION.md` 为准；右侧内置浏览器存在用户可见层和自动化可控层脱节的已知风险，不能把该现象直接归因于业务代码。
- 当前版本可作为内部试玩和设计验证 MVP，不建议直接公开发布；发布判断以 `MVP_RELEASE_ASSESSMENT.md` 为准。

## 文档维护规则

- 有新功能进入实现前，先在产品规划或路线图里补清目标与边界。
- 有生成规则变化时，同步更新生成系统文档。
- 有 UI/交互变化时，同步更新设计系统文档。
- 完成实现或验证后，更新实现状态，不把未验证事项写成已完成。
- 发现运行环境或工具链问题时，先更新 QA 验证文档，再决定是否进入代码修复。
