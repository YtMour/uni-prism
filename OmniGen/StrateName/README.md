# StrateName

StrateName 是 OmniGen 系列中的 Business Name Generator 子项目，面向传统实体企业、咨询机构、现代服务业、地产工程、物流贸易、投资控股和集团型业务，提供稳重、专业、可解释的企业命名生成、筛选、评分、收藏、复制和董事会提案卡预览。

当前阶段：H5 MVP engineering candidate。`StrateName-Uniapp/` 已创建并完成本地生成、候选详情、Shortlist、Boardroom Proposal、Settings 法律语言选择器、独立隐私政策页、独立免责声明页、16 种主流语言法律文案、素材接入、PWA 元数据、测试、构建、质量采样、100 候选人工审查包、文案审计、扩展 a11y 审计、视觉审计、发布资源审计、交互 smoke、浏览器 smoke、依赖风险报告和 MVP assessment。工程侧已接近可发布 MVP；公开发布当前决策为 Hold，剩余阻断见 [docs/RELEASE_DECISION.md](./docs/RELEASE_DECISION.md)。

## 项目目标

- 用本地可解释的词根、行业后缀和组织形式规则生成企业名称。
- 支持行业领域、商业风格、组织形式、地区语感和稳重程度过滤。
- 为每个候选名称提供专业度、可信度、行业匹配、可读性和合规风险提示。
- 提供 Boardroom Proposal，用于把候选名排版成企业信笺、前台墙、商务名片或提案封面预览。
- 明确区分“命名灵感”和“注册可用性判断”，避免暗示商标、公司登记、域名或法律后缀一定可用。

## 当前文档

| 文档 | 用途 |
| --- | --- |
| [StrateName.md](./StrateName.md) | 原始概念、视觉定位和核心功能设想 |
| [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md) | 当前文档入口和维护规则 |
| [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) | 产品规格、目标用户、MVP 范围和信息架构 |
| [docs/GENERATION_SYSTEM.md](./docs/GENERATION_SYSTEM.md) | 词库、生成算法、评分、过滤和质量采样规则 |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | 视觉语言、页面结构、组件和提案卡规范 |
| [docs/COMPLIANCE_AND_RISK.md](./docs/COMPLIANCE_AND_RISK.md) | 商标、公司注册、法律后缀和隐私风险边界 |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Phase 0 到 Phase 5 的路线计划 |
| [docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md) | 当前实现事实、风险和下一步 |
| [docs/MVP_RELEASE_CHECKLIST.md](./docs/MVP_RELEASE_CHECKLIST.md) | H5 MVP 发布门槛 |
| [docs/RELEASE_DECISION.md](./docs/RELEASE_DECISION.md) | 当前公开发布决策、阻断项和解除条件 |
| [designs/README.md](./designs/README.md) | 后续真实界面状态参考图 |
| [assets/README.md](./assets/README.md) | App 图标、品牌元素和提案模板运行时素材 |

## 当前工程

| 路径 | 用途 |
| --- | --- |
| [StrateName-Uniapp/](./StrateName-Uniapp/) | uni-app + Vue 3 H5 工程 |
| [StrateName-Uniapp/src/core/generator.js](./StrateName-Uniapp/src/core/generator.js) | 本地企业名生成、过滤、评分和 Proposal 摘要 |
| [StrateName-Uniapp/src/data/lexicon.js](./StrateName-Uniapp/src/data/lexicon.js) | 行业、风格、tone、后缀和词根 |
| [StrateName-Uniapp/src/components/](./StrateName-Uniapp/src/components/) | Generate、Detail、Shortlist、Proposal、Settings、Legal Document 组件 |
| [StrateName-Uniapp/reports/](./StrateName-Uniapp/reports/) | 质量采样、人工审查包、签核模板、文案审计、a11y 审计、视觉审计、发布资源审计、交互 smoke、MVP assessment、依赖风险报告和截图 |

本地运行：

```text
cd StrateName/StrateName-Uniapp
npm install
npm run dev:h5
```

当前预览地址为 `http://127.0.0.1:5193/`。

## 推荐技术方向

建议沿用 OmniGen 系列的移动端优先、本地生成、轻量导出方向。第一版可以使用 uni-app + Vue 3，在 `StrateName-Uniapp/` 下独立管理应用代码。

建议工程目录：

```text
StrateName/
  StrateName-Uniapp/
    pages/
    src/
      core/
      data/
      components/
      services/
      styles/
    static/
    scripts/
    tests/
    reports/
```

## 第一阶段范围

MVP 只承诺本地企业命名灵感生成和轻量提案预览，不承诺公司注册、商标检索、域名可用性、法律意见或远程 AI 生成。

必须完成：

- 企业名称生成主流程。
- 三大商业风格序列。
- 行业、组织形式、长度和稳重程度过滤。
- 候选名称评分、理由和结构拆解。
- 收藏、复制、批量导出和本地持久化。
- Boardroom Proposal 提案卡预览。
- 独立隐私政策页、独立免责声明页和主流语言法律文案。
- App 图标、品牌小元素和提案模板素材接入。
- H5 构建、质量采样、人工审查包、承诺性文案审计、a11y 审计、视觉审计、发布资源审计、交互 smoke、静态 smoke、浏览器 smoke 和 MVP assessment。

暂缓：

- 实时公司注册可用性查询。
- 商标检索和法律意见。
- 域名可用性查询。
- 远程 AI 命名。
- 账号、云同步和团队协作。
- 真实 PNG 海报保存和多模板批量导出。
