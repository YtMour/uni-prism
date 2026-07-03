# StrateName 设计系统

## 视觉定位

StrateName 的视觉语言应像一份克制、稳重、可带进董事会会议室的命名提案。它要避开创业命名工具常见的霓虹、渐变和娱乐感，重点呈现“信任、资产、秩序、长期主义”。

关键词：

- Boardroom
- Institutional
- Heritage
- Quiet confidence
- Formal proposal
- Corporate gallery

## 色彩

### 主色

| Token | 色值 | 用途 |
| --- | --- | --- |
| `federalForest` | `#1B3B2B` | 主按钮、选中态、品牌重点 |
| `deepNavy` | `#0F1E36` | 标题、深色背景、提案封面 |
| `linenWhite` | `#F8F5EF` | 页面背景 |
| `galleryIvory` | `#FBF9F5` | 卡片和提案纸张 |
| `brassGold` | `#B08D57` | 细线、印章、评分强调 |
| `inkBlack` | `#181A1B` | 正文 |
| `slateGray` | `#65706A` | 次级信息 |
| `riskAmber` | `#B7791F` | 风险提示 |
| `errorBurgundy` | `#7A1F2B` | 高风险或删除动作 |

使用规则：

- 主界面以 `linenWhite` 和 `galleryIvory` 为底。
- `federalForest` 和 `deepNavy` 二选一作为当前主题主色，避免同屏大面积争抢。
- `brassGold` 只能用于细线、微弱边框、评分强调和提案卡点缀。
- 不使用大面积渐变、装饰光斑或娱乐化背景。

## 字体

| 场景 | 字体建议 | 说明 |
| --- | --- | --- |
| 候选名称 | Georgia, Baskerville, Times New Roman | 强调历史感和正式感 |
| 标题 | Georgia 或系统 serif | 保持稳重 |
| UI 控件 | system-ui, -apple-system, Segoe UI | 保证清晰和跨平台 |
| 分数/标签 | system-ui | 避免小字号 serif 可读性差 |

排版规则：

- 候选名称可以使用大字号 serif。
- 控件、标签、说明和风险提示使用无衬线。
- 不使用负字距。
- 移动端候选名称需要自动换行，避免溢出卡片。

## 页面结构

### Home / Generator

首屏应直接是可用工具，不做营销式 landing page。

推荐结构：

1. 顶部品牌栏：StrateName、Settings 图标。
2. 过滤器区：行业、风格、组织形式、长度、稳重程度。
3. 生成按钮：主色按钮，文字简短。
4. 生成后筛选区：切换为 compact filter chips，避免完整筛选面板挤压结果。
5. 候选列表：名称卡片垂直排列。
6. Shortlist 入口：底部或顶部轻量按钮。

### Candidate Detail

详情面板展示：

- 候选名称。
- 总分和维度评分。
- 结构拆解，使用 label/value 两列布局，避免 Root/Bridge 与值粘连。
- 命名理由。
- 风险提示。
- 复制、收藏、加入提案卡。

### Shortlist

Shortlist 是决策辅助，不是简单收藏列表。

需要展示：

- 候选名称。
- 行业和风格标签。
- 总分。
- 风险等级。
- 用户备注。
- 复制全部。

### Boardroom Proposal

提案卡是 StrateName 的核心差异化体验。

MVP 内置四种预览：

| 模板 | 用途 | 内容 |
| --- | --- | --- |
| Letterhead | 企业信笺顶端 | 名称、行业标签、细线、地址占位 |
| Lobby Wall | 写字楼前台墙 | 名称、大面积留白、微弱金属质感 |
| Business Card | 商务名片 | 名称、职位占位、联系信息占位 |
| Proposal Cover | 提案封面 | 名称、tagline、行业、日期 |

MVP 只承诺 App 内预览和复制摘要，不承诺真实 PNG 保存。

Proposal 页面首屏必须暴露 Export summary、Copy proposal text 和 Add to Shortlist，预览高度不能把核心操作压到移动端底部导航下方。

## 组件规范

| 组件 | 规则 |
| --- | --- |
| Segmented Control | 用于风格、长度、稳重程度切换 |
| Filter Chips | 用于行业和组织形式多选 |
| Candidate Card | 固定内边距和最小高度，避免评分变化导致跳动 |
| Score Badge | 显示 0 到 100 分，颜色克制 |
| Risk Notice | 使用 `riskAmber`，不使用吓人的红色，除非高风险 |
| Icon Button | 使用语义清楚的复制、收藏、刷新、设置图标 |
| Detail Sheet | 底部抽屉，移动端高度不超过视口 88% |
| Empty State | 使用信笺、印章、建筑线稿等轻量视觉，不使用卡通插画 |

## 交互规则

- 生成结果必须可一键复制。
- 收藏状态必须有明确视觉反馈。
- 风格和行业过滤器修改后不应自动清空 Shortlist。
- 用户开启 seed 后，生成结果应可复现。
- 风险提示需要短句说明，不要用长篇法律文案打断主流程。
- 清空本地数据必须二次确认。
- 法律免责声明和隐私政策必须以独立页面从 Settings 进入。
- 法律语言在 Settings 内使用原生下拉选择；法律文档页只展示当前语言内容，不在顶部重复放语言选择框。
- 阿语等 RTL 语言必须保持正确阅读方向。

## 响应式要求

| 视口 | 要求 |
| --- | --- |
| 360px | 无横向滚动，候选名称自动换行 |
| 390px | 主流程首屏可见生成按钮和至少一张候选卡片顶部 |
| 768px | 可使用双栏，过滤器和候选列表并排 |
| 1280px | 内容最大宽度受控，避免卡片过宽 |

## 可访问性

- 文本对比度符合 WCAG AA。
- 交互控件最小点击区域 44px。
- 图标按钮必须有可访问名称。
- 风险提示不能只靠颜色表达。
- 动画不影响核心操作，尊重减少动态效果设置。

## 素材方向

当前 `assets/` 已包含第一批运行时素材：

- App icon。
- 品牌 glyph。
- 空状态信笺图标。
- 企业印章点缀。
- 信笺模板背景。
- 前台墙背景。
- 名片模板背景。
- 提案封面背景。

素材应服务于真实预览，不做纯装饰堆叠。

素材索引见 [../assets/README.md](../assets/README.md)，透明与尺寸检查见 [../assets/ASSET_AUDIT.md](../assets/ASSET_AUDIT.md)。

## 视觉验收

H5 MVP 发布前至少归档：

- 360x800 移动首页截图。
- 390x844 移动候选详情截图。
- 390x844 Shortlist 截图。
- 390x844 Boardroom Proposal 截图。
- 1280x720 桌面首页截图。
- 1280x720 桌面提案卡截图。

截图和自动视觉审计结果放入 `StrateName-Uniapp/reports/visual-audit/` 与 `StrateName-Uniapp/reports/visual-audit.json`。

当前自动视觉审计已覆盖：

- 360x780 移动宽度。
- 390x844 移动宽度。
- 1280x720 桌面宽度。
- 生成结果 compact chips。
- Candidate Detail 结构表两列布局。
- Proposal 首屏复制按钮。
- 横向滚动和 console error/warning。

当前 a11y/交互审计已补充覆盖：

- 独立 Privacy Policy 页面。
- 独立 Disclaimer 页面。
- 16 种主流语言法律文案数据层。
- 阿语 RTL 法律文档渲染。

## 当前设计参考图

当前已有 6 张 image-generated 后续界面参考图，保存于 [../designs/](../designs/)：

- Home / Generator
- Generated Results
- Candidate Detail
- Shortlist
- Boardroom Proposal
- Settings / Compliance

这些图片用于指导真实 UI 实现，不等同于 H5 运行截图或视觉验收结果。真实工程完成后，需要用浏览器或真机截图重新归档到 `StrateName-Uniapp/reports/visual-audit/`。
