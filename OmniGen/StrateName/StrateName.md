# StrateName: Business Name Generator

> 基业长青，始于冠名。StrateName 是一款专为传统实体企业、咨询机构、现代服务业及集团公司设计的大气、稳重型企业命名独立应用。它将经典商业美学词根与现代行业调性融合，帮助用户快速获得可进入人工尽调的企业名称候选。

## 当前定位

- App 独立名称：StrateName
- 副标题：Business Name Generator
- 当前阶段：文档建设阶段
- 推荐工程方向：uni-app + Vue 3 + 本地生成器
- MVP 边界：提供命名灵感、评分、收藏、复制和提案卡预览；不提供公司注册、商标、域名或法律可用性判断

## 文档入口

| 文档 | 用途 |
| --- | --- |
| [README.md](./README.md) | 项目入口和当前阶段 |
| [docs/DOCUMENTATION_INDEX.md](./docs/DOCUMENTATION_INDEX.md) | 文档索引和维护规则 |
| [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) | 产品规格和功能范围 |
| [docs/GENERATION_SYSTEM.md](./docs/GENERATION_SYSTEM.md) | 生成系统、评分和过滤规则 |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | 视觉、交互和提案卡规范 |
| [docs/COMPLIANCE_AND_RISK.md](./docs/COMPLIANCE_AND_RISK.md) | 合规风险和免责声明 |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | 后续阶段计划 |
| [docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md) | 当前实现状态 |
| [docs/MVP_RELEASE_CHECKLIST.md](./docs/MVP_RELEASE_CHECKLIST.md) | MVP 发布门槛 |

## 视觉定位与微调

- 交互点缀色：采用沉稳、内敛且具备财富安全感的联邦深林绿 `#1B3B2B` 或深邃典雅蓝 `#0F1E36`，传达百年企业的信任感与专业度。
- 卡片质感：布局采用对称、稳固的古典画廊展位设计。生成的名字被“装裱”在带有微弱浮雕线条的坚实卡片中央，传递稳如磐石的商业心理暗示。
- 核心展示字体：使用具有历史厚重感和权威感的西文衬线体，如 `Georgia`、`Baskerville` 或 `Times New Roman`。
- UI 控件字体：使用系统无衬线字体，保证小字号标签、按钮和风险提示清晰可读。

## 核心功能规划

### 1. 三大经典商业风格序列

#### Global Venture & Capital

- 风格：精干、专业、具备全球化视野。
- 适用：投资银行、管理咨询、法律服务、企业服务、高新控股集团。
- 算法矩阵：战略/资本向核心词，如 `Crest`、`Vanguard`、`Prime`、`Apex`、`Slate`，组合经典行业后缀，如 `Partners`、`Capital`、`Ventures`、`Holdings`、`Group`。
- 示例：`Crestway Partners`、`Slate Capital`、`Apex Holdings`。

#### Heritage Industrial

- 风格：稳固、踏实、具备行业根基。
- 适用：制造、贸易、地产、工程、物流和传统实体企业。
- 算法矩阵：地理/自然/材料意象词根，如 `Summit`、`River`、`Iron`、`Beacon`，组合传统实业后缀，如 `Industries`、`Global`、`Trading`、`Trust`。
- 示例：`Beacon Global`、`IronRiver Industries`、`Summit Trust`。

#### Neo-Enterprise Blend

- 风格：稳重中保留现代活力。
- 适用：现代服务业、创意商业实体、跨界集团和新型 B2B 品牌。
- 算法矩阵：寓意宏大、拉丁语系或抽象企业语感的缩合新造词。
- 示例：`Stratis Group`、`Novaterra`、`Integra`。

### 2. 行业领域与合规过滤器

- 行业锚定：支持 `Finance & Capital`、`Consulting & Service`、`Real Estate & Construction`、`Logistics & Trade`。
- 组织形式切换：支持 `Group`、`Holdings`、`Capital`、`Partners`、`Industries`、`Trading`、`Trust` 等企业语义后缀。
- 法律形式预览：支持 `Ltd.`、`Inc.`、`LLC`、`Corp.` 等格式展示，但必须明确“不代表已注册或可注册”。
- 风险过滤：过滤真实知名品牌、高混淆商标片段、敏感词、负面商业含义和难读组合。

### 3. 董事会灵感提案卡

- 企业信笺预览：将候选名称排版在极简企业信笺顶端。
- 写字楼前台墙预览：模拟前台墙或金属字效果。
- 商务名片预览：快速感受企业名称在正式商务场景中的比例和气质。
- 提案封面预览：用于顾问或创始人向决策人展示候选名称。

## 后续建设优先级

1. 创建 `StrateName-Uniapp/` 工程和最小生成器。
2. 建立结构化词库、评分器、过滤器和 seed 复现。
3. 实现首页生成、候选卡片、详情面板、收藏和复制。
4. 实现 Boardroom Proposal 预览。
5. 补齐隐私政策、免责声明和法律后缀风险提示。
6. 建立 `npm test`、质量采样、H5 构建和浏览器 smoke 验证链路。
