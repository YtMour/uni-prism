# OmniGen: Infinite Randomization Engine

> 秩序源于随机。OmniGen 是随机生成系列 App 的管理文件夹，用于沉淀系列级规划、文档索引、通用设计原则和后续多个生成器项目的路线。

当前已建立的 App 项目包括 `FantasyNameGenerator/`、`DiceForge/`、`VibeName/` 和 `StrateName/`。其中 **VibeName: Startup Name Generator** 面向独立开发者、SaaS 创业者与科技产品团队，**StrateName: Business Name Generator** 面向传统实体企业、咨询机构、现代服务业、投资控股和集团型业务。

## 项目定位

OmniGen 根目录不作为单个 App 工程使用，而是作为随机生成系列的管理层。每个子 App 都应有自己的项目文件夹、独立品牌、独立数据集和独立发布路径。根目录只保留 README 作为系列管理和介绍入口。

## 当前子项目

| 子项目 | 阶段 | 说明 |
| --- | --- | --- |
| FantasyNameGenerator / MythosGen | 规划中 | 奇幻姓名、咒语和神话词汇生成器 |
| DiceForge | 规划中 | 跑团角色、背景和属性灵感生成 |
| VibeName | 文档建设中 | 面向 indie hackers 和 SaaS 创业者的创业命名生成 |
| StrateName | 文档建设中 | 面向传统实体企业、咨询机构、资本控股和现代服务业的企业命名生成 |
| Baby Name Generator | 候选 | 家庭向寓意筛选姓名生成 |

## 当前文档入口

- [MythosGen App README](FantasyNameGenerator/README.md)
- [MythosGen 文档索引](FantasyNameGenerator/docs/DOCUMENTATION_INDEX.md)
- [VibeName App README](VibeName/README.md)
- [VibeName 文档索引](VibeName/docs/DOCUMENTATION_INDEX.md)
- [StrateName App README](StrateName/README.md)
- [StrateName 文档索引](StrateName/docs/DOCUMENTATION_INDEX.md)

## 文件夹职责

| 路径 | 职责 |
| --- | --- |
| `OmniGen/` | 系列管理文件夹，根目录只保留 README 管理和介绍文档 |
| `OmniGen/FantasyNameGenerator/` | MythosGen App 项目文件夹，后续应用代码、资源、项目内文档和构建配置都放这里 |
| `OmniGen/DiceForge/` | DiceForge App 项目文件夹，沉淀 D&D 角色生成方向 |
| `OmniGen/VibeName/` | VibeName App 项目文件夹，沉淀 Startup Name Generator 方向 |
| `OmniGen/StrateName/` | StrateName App 项目文件夹，沉淀 Business Name Generator 方向 |

## 全局设计语言

OmniGen 采用极简画廊风，减少工具感和广告感，让生成结果成为屏幕中心。

- 主画布使用羊皮纸白 `#FBF9F5` 或清透浅灰 `#F2F2F2`。
- 子项目只切换低饱和点缀色，不破坏整体品牌一致性。
- 生成结果使用大字号衬线体，控制项使用清晰无衬线体。
- 核心交互优先采用轻触画布、摇晃手机、收藏滑动与海报导出。

## 技术方向

MythosGen App 计划在 `FantasyNameGenerator/` 内采用 uni-app + Vue 3 构建跨平台移动应用。生成逻辑优先本地化，数据集以结构化词根、音节权重和过滤规则组织，避免早期依赖服务端。

第一阶段目标是完成 MythosGen 的 H5/Mobile MVP：核心生成、过滤、收藏、复制、海报导出和基础设置。
