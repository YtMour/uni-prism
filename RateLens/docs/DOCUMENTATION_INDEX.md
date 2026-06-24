# RateLens 文档索引

本文档是 RateLens 当前阶段的文档入口。README 负责保留产品愿景和高层介绍，`docs/` 负责维护可执行规划与当前事实。

## 推荐阅读顺序

| 顺序 | 文档 | 说明 |
| --- | --- | --- |
| 1 | [PROJECT_STATUS.md](PROJECT_STATUS.md) | 当前仓库状态、已确认事实、风险与待决策问题 |
| 2 | [PRODUCT_PLAN.md](PRODUCT_PLAN.md) | 用户、场景、功能边界、商业化与合规 |
| 3 | [FEATURE_DESIGN.md](FEATURE_DESIGN.md) | 核心功能、页面结构、交互状态和验收口径 |
| 4 | [UI_ARCHITECTURE.md](UI_ARCHITECTURE.md) | 当前 UI 原型、视觉资产、交互范围和本地预览方式 |
| 5 | [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) | 本轮实现记录、验证结果和当前阻塞 |
| 6 | [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md) | 模块边界、数据模型、缓存和验证策略 |
| 7 | [ROADMAP.md](ROADMAP.md) | 分阶段交付路线、验收标准和延后范围 |
| 8 | [../README.md](../README.md) | 产品愿景、视觉方向和技术原则 |

## 当前文档原则

- 区分愿景与已实现内容：未落地的功能不得写成已完成。
- 先收敛 MVP，再推进高成本能力：桌面小组件、OCR、AR 覆盖、订阅商业化均应在核心换算稳定后进入。
- 每一阶段都要有验证方式：构建命令、核心算法测试、离线缓存测试、i18n 与布局检查。
- 文档更新以当前代码事实为准；uni-app 原型和预览状态变化时，应同步刷新 `PROJECT_STATUS.md` 与 `UI_ARCHITECTURE.md`。

## 待补文档

- `docs/STORE_LAUNCH_PREP.md`：接近上架阶段再补隐私政策、权限声明、截图与 ASO 文案。
