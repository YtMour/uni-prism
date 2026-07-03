# StrateName Asset Audit

更新时间：2026-07-03

## 当前结论

StrateName 已生成第一批运行时视觉素材，覆盖 App 图标、品牌小元素、空状态图标、装饰印章和 Boardroom Proposal 的 4 类模板底图。

本批素材是独立生成，不从 `designs/` 界面图中裁切。透明素材已通过 chroma-key 本地处理和基础 alpha 验证。

对照当前 6 张界面设计图后，现有素材可以覆盖第一版需要独立位图生成的核心视觉资产。控制类图标、导航图标、返回/复制/收藏/警告/设置等图标不建议做成位图素材，后续应优先用 lucide 图标或代码原生图标实现，以保持清晰度、状态颜色和可访问性。

## 覆盖情况

| 类别 | 状态 | 文件 |
| --- | --- | --- |
| App icon | Done | `icons/app-icon-1024.png`, `icons/app-icon-512.png` |
| Brand glyph | Done | `brand/brand-glyph.png`, `brand/brand-glyph-512.png` |
| Empty state icon | Done | `brand/empty-letterhead.png`, `brand/empty-letterhead-512.png` |
| Corporate seal accent | Done | `brand/corporate-seal.png`, `brand/corporate-seal-512.png` |
| Letterhead template | Done | `templates/letterhead-bg.png` |
| Lobby wall template | Done | `templates/lobby-wall-bg.png` |
| Business card template | Done | `templates/business-card-bg.png` |
| Proposal cover template | Done | `templates/proposal-cover-bg.png` |
| Source archive | Done | `generated-source/` |
| Chroma-key intermediate archive | Done | `tmp/` |

## 设计图覆盖矩阵

| 设计图 | 位图素材覆盖 | 代码/图标库实现 | 结论 |
| --- | --- | --- | --- |
| `designs/01-home-generator.png` | `brand/empty-letterhead.png` 覆盖空状态信笺；`icons/app-icon-1024.png` 可派生 App 图标 | filter icons、settings、bottom nav icons、按钮箭头 | 无阻断遗漏 |
| `designs/02-generated-results.png` | 无必须位图；卡片质感可用 CSS 色板和阴影实现 | reload、copy、bookmark、warning、filter chips | 无阻断遗漏 |
| `designs/03-candidate-detail.png` | 无必须位图；候选详情内容应由 UI 渲染 | back、score dimension icons、expand chevron、copy、save、plus、warning | 无阻断遗漏 |
| `designs/04-shortlist.png` | 无必须位图；决策卡片和风险提示应由 UI 渲染 | checkbox、trash、pencil、decision icons、bottom nav icons | 无阻断遗漏 |
| `designs/05-boardroom-proposal.png` | `templates/letterhead-bg.png` 覆盖当前 Letterhead 预览；`templates/lobby-wall-bg.png`、`templates/business-card-bg.png`、`templates/proposal-cover-bg.png` 覆盖其余模板；`brand/corporate-seal.png` 可做点缀 | share、dropdown、template icons、edit、copy、bookmark、warning | 核心模板已覆盖 |
| `designs/06-settings-compliance.png` | 无必须位图 | back、chevron、stepper、switch、warning、trash、bottom nav icons | 无阻断遗漏 |

## 匹配度检查

| 素材 | 与设计图匹配情况 | 说明 |
| --- | --- | --- |
| `icons/app-icon-1024.png` | Match | 采用文档 + 企业柱廊 + 深海军蓝/深林绿/黄铜视觉，和界面中的正式企业感一致 |
| `brand/empty-letterhead.png` | Match with intentional simplification | 对应 Home 空状态信笺图标；当前素材不含 `S` 或随机文字，后续可由 UI 叠加品牌字母或保持无文字 |
| `brand/brand-glyph.png` | Match | 对应品牌 glyph、空状态或设置页品牌点缀，和 App 图标母题一致 |
| `brand/corporate-seal.png` | Match as optional accent | 设计图当前没有强依赖印章，但它符合 Proposal / Cover 的制度感点缀方向 |
| `templates/letterhead-bg.png` | Strong match | 与 Boardroom Proposal 设计图中的 Letterhead 卡片高度一致，且不含固定公司名称 |
| `templates/lobby-wall-bg.png` | Acceptable, slightly more realistic | 符合 Lobby Wall 预览用途；比当前扁平 UI 图更接近真实墙面质感，后续如需完全扁平化可再生一个 flat 版本 |
| `templates/business-card-bg.png` | Match for planned tab | 当前 6 张设计图未展示 Business Card tab，但与 Proposal 模板方向一致 |
| `templates/proposal-cover-bg.png` | Match for planned tab | 当前 6 张设计图未展示 Cover tab，但与深海军蓝、深林绿、黄铜线条的提案封面方向一致 |

## 验证记录

| 检查 | 结果 |
| --- | --- |
| App icon 1024 尺寸 | 1024x1024 |
| App icon 512 尺寸 | 512x512 |
| App icon alpha | 全不透明，角落 alpha 255 |
| Transparent brand glyph | 角落 alpha 0，中心 alpha 255 |
| Transparent empty letterhead | 角落 alpha 0，中心 alpha 255 |
| Transparent corporate seal | 角落 alpha 0，中心 alpha 255 |
| Chroma-key residue sampling | 三个透明素材抽样未发现洋红可见像素 |
| Template text risk | 模板底图无公司名称、域名、注册或商标承诺 |
| Palette sampling | 8 个核心素材均主要落在 StrateName 设计色板附近；`lobby-wall-bg.png` 因写字楼墙面纹理更写实，色板近似度低于其他素材但仍未越出品牌方向 |

## 已知限制

- App icon 是生成式 raster 图标，不是手工矢量源；后续如需极小尺寸像素级控制，可以再做 SVG/矢量化版本。
- 透明素材已完成基础 alpha 验证，但尚未在真实 UI 中进行深色/浅色背景叠加回归。
- 模板底图尚未在 `StrateName-Uniapp/` 中接入，因为工程还未创建。
- 未生成平台完整图标矩阵，如 iOS/Android/微信小程序全部尺寸。
- 未生成 native `tabBar` PNG 图标矩阵；如果后续使用 uni-app 原生 `tabBar`，需要按 `Generate`、`Shortlist`、`Proposal`、`Settings` 派生 normal/selected 图标。若采用自定义底部导航和 lucide 图标，则不需要这组位图。
- 未生成 favicon/PWA manifest 全尺寸矩阵；可由 `icons/app-icon-1024.png` 派生。
- 未生成通用纸张纹理 tile；当前设计可先用 CSS 色值、边框和阴影实现卡片质感，避免过早引入纹理噪声。

## 后续建议

1. 创建 App 工程后，把 `assets/icons/app-icon-1024.png` 作为图标源，按平台脚本派生尺寸。
2. 在 UI 中分别用浅色和深色背景测试透明素材边缘。
3. 在 Boardroom Proposal 页面中用模板底图叠加真实候选名称，跑视觉截图回归。
4. 如后续进入 public MVP，补齐平台图标矩阵和 PWA manifest icons。
5. 如果产品决定使用原生 tabBar，再补 4 个底部导航图标的 normal/selected PNG；如果使用自定义导航，则继续用代码图标。
