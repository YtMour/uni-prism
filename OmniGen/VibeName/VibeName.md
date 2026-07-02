# VibeName: Startup Name Generator

> 卓越的创意，从名字开始。VibeName 是一款面向独立开发者、SaaS 创业者和科技产品团队的现代化创业项目命名工具。它将干练的科技词根、行业语义、可读性评分和极简品牌预览整合在一个移动优先的独立 App 中，帮助用户快速找到可用、可记、可传播的产品名。

## 项目定位

VibeName 是 OmniGen 随机生成系列中的创业命名方向子项目。它不是通用宝宝取名、公司工商名称查询或商标法律工具，而是专注于早期产品灵感阶段：

- 为 micro-SaaS、AI 工具、开发者工具、创作者工具和金融科技产品提供第一批命名候选。
- 帮助用户在短时间内比较名称的气质、长度、发音、品牌感和可扩展性。
- 用极简视觉卡片预览名称落地后的产品首屏感，而不是只输出一串文本。

第一阶段目标是完成 H5/Mobile MVP：本地生成、风格与行业过滤、候选收藏、名称评分、复制导出、概念卡片预览、分段隐私政策、分段免责声明和 18 个主流应用语种选择与关键路径国际化。

## 核心体验

VibeName 的核心体验应保持短、快、明确：

1. 用户选择行业领域、命名风格和长度偏好。
2. App 一次生成 6 到 12 个候选名称。
3. 用户可以收藏、锁定、复制、重生成、查看评分和预览概念卡片。
4. 候选名称进入 Founder Whiteboard，支持横向对比与轻量导出。

## 视觉定位

| 项目 | 决策 |
| --- | --- |
| App 名称 | VibeName |
| 副标题 | Startup Name Generator |
| 主调性 | 极简 SaaS、科技编辑感、清爽高效 |
| 点缀色 | 数字克莱因蓝 `#004BFF` |
| 主背景 | 冷白 `#F7F8FA` 或纯白 |
| 字体方向 | Inter、Montserrat、系统无衬线 fallback |
| 结果展示 | 大字号名称居中，像产品发布页的品牌标识 |
| 控件风格 | 克制、紧凑、移动端优先 |

## 功能概览

### 三大命名风格

| 风格 | 说明 | 示例 |
| --- | --- | --- |
| Micro-SaaS Blend | 现代词根加 SaaS 后缀，适合工具、插件、平台型产品 | Flowbase、CodeArk、Mintify |
| Neomorphic Abstract | 双音节或轻抽象新造词，适合 AI、Web3、实验室和深科技 | Vexis、Aethel、Zentra |
| Action-Driven | 动词或价值承诺加业务领域词，适合执行力强的产品 | LaunchStack、PeakData、ShiftPage |

### 行业过滤器

- AI / ML
- DevTools
- Fintech
- Creator Economy
- Productivity
- Design Tools
- Data / Analytics

### 名称控制

- 长度：Ultra Short、Standard Blend、Descriptive Compound。
- 调性：Clean、Premium、Bold、Playful、Technical。
- 可读性：避免难读辅音堆叠、过长后缀和重复拼写。
- 输出量：默认 8 个候选，支持继续生成。

### Founder Whiteboard

- 收藏候选名称。
- 锁定喜欢的词根或后缀。
- 横向对比评分、领域匹配和备注。
- 一键复制候选列表。
- 生成概念落地页卡片预览。

## 文档入口

VibeName 当前处于 H5 MVP preview candidate 向 public H5 MVP release candidate 收敛阶段。后续以这些文件为准：

| 文档 | 用途 |
| --- | --- |
| [README.md](./README.md) | 项目入口和运行阶段说明 |
| [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md) | 文档索引和维护规则 |
| [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) | 产品规格、用户场景和功能范围 |
| [docs/GENERATION_SYSTEM.md](./docs/GENERATION_SYSTEM.md) | 命名生成算法、词库和评分模型 |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | 视觉语言、交互和组件规范 |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | 阶段计划和后续功能路线 |
| [docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md) | 当前实现状态、风险和下一步 |
| [docs/MVP_RELEASE_CHECKLIST.md](./docs/MVP_RELEASE_CHECKLIST.md) | MVP 发布门槛与回归清单 |
| [docs/MVP_RELEASE_ASSESSMENT.md](./docs/MVP_RELEASE_ASSESSMENT.md) | 当前 H5 MVP 发布评估 |

## 当前状态

`VibeName-Uniapp/` 已创建并实现本地生成器、模块化移动端界面、收藏白板、概念预览、真实设置偏好、分段隐私政策、分段免责声明、18 个主流应用语种选择、Arabic RTL 接线、质量采样和 H5 验证链路。任何发布判断都应以 `docs/IMPLEMENTATION_STATUS.md`、`docs/MVP_RELEASE_CHECKLIST.md` 和 `docs/MVP_RELEASE_ASSESSMENT.md` 为准。
