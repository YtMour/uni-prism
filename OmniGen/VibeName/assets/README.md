# VibeName 素材索引

本目录保存 VibeName 后续 App 实现可直接引用的 raster 素材。素材按“一个文件一个用途”生成，避免从设计图中裁剪、抠图或拆分导致边缘错误。

## App 图标

| 文件 | 用途 | 说明 |
| --- | --- | --- |
| [icons/app-icon-1024.png](./icons/app-icon-1024.png) | App 图标源图 | 1024 级方形图标源，完整底图，不需要透明抠图 |

## 品牌与界面素材

| 文件 | 用途 | 说明 |
| --- | --- | --- |
| [brand/brand-glyph.png](./brand/brand-glyph.png) | 应用内品牌标记 | 用于 header、空状态、小尺寸品牌露出 |
| [brand/concept-preview-panel.png](./brand/concept-preview-panel.png) | 概念预览背景 | 无文字背景面板，真实文案由代码叠加 |
| [brand/empty-candidates.png](./brand/empty-candidates.png) | 候选列表空状态 | 用于 Home / Generator 未生成结果时 |
| [brand/empty-whiteboard.png](./brand/empty-whiteboard.png) | Whiteboard 空状态 | 用于没有收藏名称时 |
| [brand/generation-spark.png](./brand/generation-spark.png) | 生成中状态标记 | 可配合 CSS/组件做脉冲或旋转动效 |

## 素材审计

| 文档 | 用途 |
| --- | --- |
| [ASSET_AUDIT.md](./ASSET_AUDIT.md) | 检查当前素材覆盖、缺口和不建议做成图片的 UI 元素 |

## 使用原则

- 不从 [../designs/](../designs/) 的页面设计图中裁剪运行时素材。
- 可交互 UI 图标如复制、收藏、返回、设置、删除、分享，后续实现时优先使用 lucide 图标或组件库图标，不用图片裁剪。
- 文案、名称、评分和标签必须由代码渲染，不烘焙在素材图片里。
- App 图标后续进入平台构建前，应由脚本生成各尺寸图标，源图保留为 `icons/app-icon-1024.png`。
- 若新增素材，继续保持单文件单用途，并同步更新本索引和 [../docs/IMPLEMENTATION_STATUS.md](../docs/IMPLEMENTATION_STATUS.md)。
- 是否需要继续补图，以 [ASSET_AUDIT.md](./ASSET_AUDIT.md) 的缺口判断为准。

## 生成方式

这些素材使用 imagegen built-in 模式逐个生成。每次只生成一个独立素材，避免合图、雪碧图和后期裁剪。
