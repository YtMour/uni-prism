# OmniGen: Infinite Randomization Engine

> 秩序源于随机。OmniGen 是随机生成系列 App 的管理文件夹，用于沉淀系列级规划、文档索引、通用设计原则和后续多个生成器项目的路线。

当前正在构建的 App 项目位于 `FantasyNameGenerator/`，产品名为 **MythosGen: Fantasy Name Creator**，面向跑团玩家、奇幻小说作者与 RPG 玩家生成人名、咒语、神器和神话词汇。

## 项目定位

OmniGen 根目录不作为单个 App 工程使用，而是作为随机生成系列的管理层。每个子 App 都应有自己的项目文件夹、独立品牌、独立数据集和独立发布路径。根目录只保留 README 作为系列管理和介绍入口。

## 当前子项目

| 子项目 | 阶段 | 说明 |
| --- | --- | --- |
| FantasyNameGenerator / MythosGen | 规划中 | 当前 App 工程目录，奇幻姓名、咒语和神话词汇生成器 |
| D&D Character Generator | 候选 | 跑团角色、背景和属性灵感生成 |
| Startup Name Generator | 候选 | 面向 indie hackers 的创业命名生成 |
| Business Name Generator | 候选 | 公司、品牌和实体命名生成 |
| Baby Name Generator | 候选 | 家庭向寓意筛选姓名生成 |

## 当前文档入口

- [MythosGen App README](FantasyNameGenerator/README.md)
- [MythosGen 文档索引](FantasyNameGenerator/docs/DOCUMENTATION_INDEX.md)

## 文件夹职责

| 路径 | 职责 |
| --- | --- |
| `OmniGen/` | 系列管理文件夹，根目录只保留 README 管理和介绍文档 |
| `OmniGen/FantasyNameGenerator/` | MythosGen App 项目文件夹，后续应用代码、资源、项目内文档和构建配置都放这里 |

## 全局设计语言

OmniGen 采用极简画廊风，减少工具感和广告感，让生成结果成为屏幕中心。

- 主画布使用羊皮纸白 `#FBF9F5` 或清透浅灰 `#F2F2F2`。
- 子项目只切换低饱和点缀色，不破坏整体品牌一致性。
- 生成结果使用大字号衬线体，控制项使用清晰无衬线体。
- 核心交互优先采用轻触画布、摇晃手机、收藏滑动与海报导出。

## 技术方向

MythosGen App 计划在 `FantasyNameGenerator/` 内采用 uni-app + Vue 3 构建跨平台移动应用。生成逻辑优先本地化，数据集以结构化词根、音节权重和过滤规则组织，避免早期依赖服务端。

第一阶段目标是完成 MythosGen 的 H5/Mobile MVP：核心生成、过滤、收藏、复制、海报导出和基础设置。
