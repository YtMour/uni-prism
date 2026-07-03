# StrateName Runtime Assets

本目录保存 StrateName 后续工程可直接接入或派生的运行时视觉素材。素材是独立生成的，不从 `designs/` 界面图中裁剪，以避免边缘抠图、比例和分辨率问题。

## 资产清单

### App Icons

| 文件 | 尺寸 | 透明 | 用途 |
| --- | --- | --- | --- |
| [icons/app-icon-1024.png](./icons/app-icon-1024.png) | 1024x1024 | No | App Store / source icon |
| [icons/app-icon-512.png](./icons/app-icon-512.png) | 512x512 | No | H5/PWA/preview icon |

说明：

- App 图标已扁平化为全不透明 PNG，角落 alpha 为 255。
- 图标不含文字，避免小尺寸和不同平台渲染时出现文字误读。

### Brand Elements

| 文件 | 尺寸 | 透明 | 用途 |
| --- | --- | --- | --- |
| [brand/brand-glyph.png](./brand/brand-glyph.png) | 1024x1024 | Yes | 品牌 glyph、空状态、设置页品牌标识 |
| [brand/brand-glyph-512.png](./brand/brand-glyph-512.png) | 512x512 | Yes | 轻量运行时版本 |
| [brand/empty-letterhead.png](./brand/empty-letterhead.png) | 1024x1024 | Yes | Home 空状态、无候选状态 |
| [brand/empty-letterhead-512.png](./brand/empty-letterhead-512.png) | 512x512 | Yes | 轻量运行时版本 |
| [brand/corporate-seal.png](./brand/corporate-seal.png) | 1024x1024 | Yes | Proposal 点缀、提案封面装饰 |
| [brand/corporate-seal-512.png](./brand/corporate-seal-512.png) | 512x512 | Yes | 轻量运行时版本 |

说明：

- 透明素材使用内置 image generation 先生成纯洋红抠底源，再用本地 chroma-key helper 生成 alpha PNG。
- 已验证透明角 alpha 为 0，主体中心 alpha 为 255。
- 已抽样检查可见像素，未发现洋红抠底色残留。

### Proposal Templates

| 文件 | 尺寸 | 透明 | 用途 |
| --- | --- | --- | --- |
| [templates/letterhead-bg.png](./templates/letterhead-bg.png) | 1103x1426 | No | Boardroom Proposal 的 Letterhead 预览底图 |
| [templates/lobby-wall-bg.png](./templates/lobby-wall-bg.png) | 1448x1086 | No | Lobby Wall 预览底图 |
| [templates/business-card-bg.png](./templates/business-card-bg.png) | 1659x948 | No | Business Card 预览底图 |
| [templates/proposal-cover-bg.png](./templates/proposal-cover-bg.png) | 1055x1491 | No | Proposal Cover 预览底图 |

说明：

- 模板底图不含公司名称、联系方式、域名、商标或注册状态。
- 后续实现应在 UI 层叠加真实候选名称、tagline、行业标签和免责声明。
- 底图只用于预览氛围，不替代真实可注册性、商标或域名检查。

## Source Files

| 路径 | 用途 |
| --- | --- |
| [generated-source/](./generated-source/) | 保存内置 image generation 的原始输出 |
| [tmp/](./tmp/) | 保存透明抠底流程的中间 alpha raw 文件 |

保留 source 的原因：

- 后续可以重新派生不同尺寸或裁切比例。
- 透明素材可以回查原始 chroma-key 源。
- 避免从 UI 设计图中二次裁剪导致边缘污染。

## 接入建议

- App 工程创建后，将 `icons/app-icon-1024.png` 派生到 `static/app-icon.png` 或平台要求的图标尺寸。
- 透明小元素建议优先使用 512 版本，只有导出海报或高分辨率预览需要使用 1024 版本。
- Proposal 模板底图应作为背景层，名称、分数、tagline、风险提示和免责声明必须由真实 UI 渲染。
- 不要把模板底图中的视觉效果解释为法律可用性、注册通过或商标清晰。
- 返回、复制、收藏、设置、警告、筛选、底部导航等控制图标不建议从设计图裁切或生成位图；后续优先用 lucide 图标或代码原生图标实现。
- 如果后续采用 uni-app 原生 `tabBar`，再从代码图标或矢量源派生 `Generate`、`Shortlist`、`Proposal`、`Settings` 的 normal/selected PNG；如果采用自定义底部导航，则不需要额外 tabBar 位图素材。

## 生成方式

本批素材使用内置 `image_gen` 生成，未使用 CLI fallback。

Prompt 方向：

- App icon：正式企业命名工具图标，文档、企业柱廊、深林绿、深海军蓝和黄铜细节，无文字。
- Brand glyph：独立柱廊 + 信笺 glyph，纯洋红抠底后转透明。
- Empty letterhead：独立空信笺图标，纯洋红抠底后转透明。
- Corporate seal：装饰性企业印章，纯洋红抠底后转透明，不做官方认证暗示。
- Proposal templates：Letterhead、Lobby Wall、Business Card、Proposal Cover 四类无文字背景模板。

统一避免：

- 从界面图裁切。
- 营销海报。
- 真实公司名称、域名、商标、注册或法律可用性承诺。
- 随机文字、水印、手机壳、浏览器框和宣传场景。
