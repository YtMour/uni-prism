# StrateName 路线图

## 当前阶段

当前阶段：H5 MVP engineering candidate，Phase 1 到 Phase 3 已完成主要工程项，正在进行 Phase 4 发布前加固。

`StrateName/` 当前已有完整规划文档和 `StrateName-Uniapp/` 工程。本地生成、详情、Shortlist、Proposal、Settings 法律语言选择器、独立隐私政策页、独立免责声明页、16 种主流语言法律文案、素材接入、PWA 元数据、测试、构建、质量采样、文案审计、视觉审计、发布资源审计、交互 smoke 和浏览器 smoke 已跑通。后续重点是依赖风险决策、人工法律审校和发布包检查。

## Phase 0：项目定义与文档建设

状态：Done for baseline

交付：

- 项目入口 README。
- 文档索引。
- 产品规格。
- 生成系统设计。
- 设计系统。
- 合规与风险边界。
- 路线图。
- 实现状态。
- MVP 发布清单。

验收：

- `StrateName/docs/` 有明确 source-of-truth。
- 文档没有把未实现功能写成 Done。
- OmniGen 根 README 能索引到 StrateName。

## Phase 1：工程脚手架与最小生成器

状态：Done for H5 candidate

目标：

- 创建可运行的 uni-app + Vue 3 H5 工程。
- 完成最小本地企业名生成器。

交付：

- `StrateName-Uniapp/` 工程。
- `src/data/lexicon.js` 基础词库。
- `src/core/generator.js` 生成流程。
- `src/core/scoring.js` 评分模型。
- `src/core/filters.js` 过滤规则。
- 首页生成流程。
- 候选卡片。
- 基础测试。
- H5 dev/build 命令。

验收：

- `npm test` 通过。
- `npm run build:h5` 通过。
- 单次生成 8 个候选。
- 生成结果包含名称、评分、标签和理由。

当前补充：

- `npm run check` 通过。
- `npm run smoke:browser` 通过。
- `npm run sample:quality` 当前 11520 candidates，重复率 6.88%。

## Phase 2：评分、过滤与 Shortlist

状态：Done for H5 candidate

目标：

- 让生成结果从“能生成”变成“能筛选、能解释、能决策”。

交付：

- 专业度、可信度、行业匹配、可读性、差异性和风险控制评分。
- 禁用词、高混淆词、真实品牌和难读组合过滤。
- Candidate Detail 详情面板。
- 收藏/取消收藏。
- Shortlist 对比。
- 用户备注。
- 本地持久化。
- 单个名称复制和批量复制。

当前补充：

- Candidate Detail、Shortlist、备注、本地持久化和复制已实现。
- UI/a11y 审计和 100 候选人工抽样包已建立；公开发布前仍需人工签核。

验收：

- 刷新后收藏和备注可保留。
- 评分维度展示清楚。
- 详情面板展示结构和词源。
- 390px 移动视口无横向溢出。

## Phase 3：Boardroom Proposal 与质量验证

状态：Done for engineering candidate

目标：

- 做出 StrateName 的差异化体验，并建立生成质量基线。

交付：

- Boardroom Proposal 页面。
- Letterhead、Lobby Wall、Business Card、Proposal Cover 四种预览。
- 自动 tagline。
- seed 复现。
- `npm run sample:quality`。
- `npm run audit:copy`。
- `npm run audit:visual`。
- `npm run smoke:h5`。
- 质量报告输出到 `reports/generation-quality.json`。
- 视觉截图归档输出到 `reports/visual-audit/`。

验收：

- 采样候选 >= 10000。
- 重复实例率 < 8%。
- 禁用词命中率为 0。
- 平均评分 >= 78。
- 移动端和桌面端提案卡无明显布局错误。

## Phase 4：H5 MVP 候选加固

状态：In Progress

目标：

- 从可演示 H5 推进到 public H5 MVP release candidate。

交付：

- `npm run check` 串联测试、质量采样、文案审计、H5 构建、静态 smoke、视觉审计、发布资源审计和交互 smoke。
- Settings 接入真实偏好和法律语言选择器。
- 独立隐私政策页和独立免责声明页。
- 16 种主流语言法律文案数据层。
- 法律后缀选择器风险提示。
- PWA manifest、favicon 和 192/512 图标。
- 依赖审计基线。
- MVP release assessment。

验收：

- `npm run check` 通过，或所有失败项有明确记录和决策。
- 真浏览器 smoke 覆盖生成、详情、收藏、复制、Shortlist、Proposal、Settings、隐私政策和免责声明。
- 手工抽样 100 个候选，无明显真实知名品牌、高混淆词或冒犯性内容。

## Phase 5：后续增强

状态：Deferred

候选方向：

- 域名可用性查询。
- 商标检索跳转或第三方查询入口。
- 地区化公司后缀说明。
- AI 命名增强。
- 多行业词库扩展。
- B2B 提案 PDF/PNG 导出。
- 团队共享 Shortlist。
- 完整界面多语言。
- App、小程序和 PWA 分发。
- 品牌命名报告模板。

进入条件：

- H5 MVP 真实发布或完成内部验证。
- 生成质量和用户反馈证明企业命名方向可继续投入。
- 基础工程、测试、合规文案和文档维护链路稳定。
