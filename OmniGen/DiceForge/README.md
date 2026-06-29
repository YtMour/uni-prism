# DiceForge

DiceForge 是一款面向 D&D 玩家与 DM 的角色一键生成应用。它的目标不是替代完整车卡工具，而是在开局前、临场 NPC 创作、跑团灵感枯竭时，快速生成一张可直接使用、可分享、视觉上足够克制的冒险者角色卡。

## 当前阶段

DiceForge 处于产品与设计文档建设阶段。当前文档优先回答以下问题：

- 这个应用的 MVP 到底交付什么。
- D&D 规则映射到什么程度。
- 角色生成数据如何组织。
- UI、动效、导出体验应该遵循什么标准。
- 后续开发如何按阶段推进和验收。

## 文档导航

| 文档 | 作用 |
| --- | --- |
| [DiceForge.md](./DiceForge.md) | 原始概念与产品气质说明 |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | 产品目标、用户场景、MVP 范围 |
| [GAME_RULES_SPEC.md](./GAME_RULES_SPEC.md) | D&D 规则边界与生成算法 |
| [GENERATION_DESIGN.md](./GENERATION_DESIGN.md) | 角色生成系统、文本矩阵和随机策略 |
| [UX_DESIGN.md](./UX_DESIGN.md) | 视觉语言、交互结构、动效与导出体验 |
| [DATA_SCHEMA.md](./DATA_SCHEMA.md) | 核心数据模型与字段定义 |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | 阶段构建路线与验收标准 |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | 实现状态、阻塞项与决策记录 |

## MVP 原则

- 一次点击生成完整 1 级角色。
- 输出必须可复制到聊天工具或跑团平台。
- 视觉重点放在角色卡可读性，不做复杂规则编辑器。
- 规则实现保持可解释，随机结果支持后续复现。
- 第一版优先移动端体验，同时兼顾桌面浏览。

## 非目标

- 不实现完整 D&D Beyond 级别的角色编辑器。
- 不处理升级、法术详细选择、战役管理、库存管理。
- 不引入需要联网的账号、云同步或社区系统。
- 不把核心规则文本原文大段内置到应用中。

