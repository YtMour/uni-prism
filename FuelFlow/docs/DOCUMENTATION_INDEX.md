# FuelFlow 文档索引

本文档是 FuelFlow 当前产品与设计讨论的入口。现阶段只讨论 app 内容、信息架构、体验设计和建设路线，不涉及代码实现。

## 当前文档

| 文档 | 用途 | 状态 |
| --- | --- | --- |
| [PRODUCT_BRIEF.md](PRODUCT_BRIEF.md) | 产品定位、目标用户、核心价值、差异化边界 | 初稿 |
| [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md) | 视觉语言、交互原则、关键页面设计方向 | 初稿 |
| [FEATURE_SPEC.md](FEATURE_SPEC.md) | 功能模块、数据对象、MVP 范围和后续扩展 | 初稿 |
| [ROADMAP_AND_DECISIONS.md](ROADMAP_AND_DECISIONS.md) | 阶段路线、优先级、待讨论决策 | 初稿 |

## 当前共识

- FuelFlow 面向海外私家车主、公路旅行用户、网约车和配送自由职业者。
- 产品核心不是“汽车社区”或“维修工具”，而是快速记录油费、里程和用车成本。
- 视觉方向采用 Gallerist Minimalism：干净、克制、数字清晰，有现代画廊和杂志插页感。
- 首屏体验应直接进入可用的记录与车辆概览，不做营销式落地页。
- MVP 应优先打通车辆、加油记录、油耗计算、趋势查看和导出准备，而不是先铺大量周边模块。

## 讨论优先级

1. 明确首发市场：美国优先，还是全球通用优先。
2. 明确 MVP 货币、单位和税务导出的默认策略。
3. 明确首页是“单车仪表盘”还是“多车车库”。
4. 明确快速录入的表单路径：数字键盘、滚轮、还是普通输入优先。
5. 明确商业模式：一次性买断、订阅、高级导出、还是免费基础版。

## 文档维护规则

- `README.md` 保留为对外介绍和愿景说明。
- `docs/` 下文档作为当前讨论和后续实现的 source of truth。
- 产品范围变化先更新 `PRODUCT_BRIEF.md` 和 `FEATURE_SPEC.md`。
- 视觉和交互变化先更新 `DESIGN_DIRECTION.md`。
- 阶段目标、取舍和未决事项统一更新 `ROADMAP_AND_DECISIONS.md`。
