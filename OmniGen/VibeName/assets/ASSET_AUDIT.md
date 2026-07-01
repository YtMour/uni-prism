# VibeName 素材缺口审计

## 当前结论

VibeName 当前 MVP 所需的位图类运行时素材已经覆盖：App 图标源图、应用内品牌标记、生成状态标记、两个空状态插图和概念预览背景均已独立生成。

当前不建议继续用 imagegen 生成交互 UI 图标。复制、收藏、返回、删除、分享、设置、筛选、排序、关闭等图标应在后续 App 工程中使用 lucide 或组件库图标，避免位图尺寸、颜色和状态适配成本。

## 已有运行时素材

| 素材 | 文件 | 尺寸 | 结论 |
| --- | --- | --- | --- |
| App 图标源图 | [icons/app-icon-1024.png](./icons/app-icon-1024.png) | 1254 x 1254 | 可用作源图，后续需脚本派生平台尺寸 |
| 品牌 glyph | [brand/brand-glyph.png](./brand/brand-glyph.png) | 1254 x 1254 | 可用于 header、空状态和品牌露出 |
| 概念预览背景 | [brand/concept-preview-panel.png](./brand/concept-preview-panel.png) | 1513 x 1040 | 可用于 PreviewCanvas 背景，文案由代码叠加 |
| 候选空状态 | [brand/empty-candidates.png](./brand/empty-candidates.png) | 1254 x 1254 | 可用于 Home / Generator 空状态 |
| Whiteboard 空状态 | [brand/empty-whiteboard.png](./brand/empty-whiteboard.png) | 1254 x 1254 | 可用于 Whiteboard 空状态 |
| 生成中 spark | [brand/generation-spark.png](./brand/generation-spark.png) | 1254 x 1254 | 可用于生成中状态，动效由代码实现 |

## 页面覆盖检查

| 页面状态 | 需要的位图素材 | 当前覆盖 | 说明 |
| --- | --- | --- | --- |
| Home / Generator 空状态 | 品牌 glyph、候选空状态、生成中 spark | Covered | 控件、chips、列表骨架由代码绘制 |
| 生成结果列表 | 无必需位图 | Covered | 候选卡、评分、标签、收藏、复制均应由代码和图标库实现 |
| 候选详情底部面板 | 无必需位图 | Covered | score bars、按钮、相似变体由代码实现 |
| Founder Whiteboard | Whiteboard 空状态 | Covered | 列表、备注、排序、复制全部由代码实现 |
| Concept Preview | 概念预览背景、品牌 glyph | Covered | 名称、tagline、CTA、免责声明由代码叠加 |
| Settings | 无必需位图 | Covered | 设置项和 toggles 由组件实现 |

## 仍需后续生成或派生的非 imagegen 资产

这些不是新的创意图片，应在创建 `VibeName-Uniapp` 后由脚本或构建工具派生：

| 项目 | 处理方式 | 原因 |
| --- | --- | --- |
| iOS/Android App icon 多尺寸 | 从 `icons/app-icon-1024.png` 派生 | 平台尺寸固定，不应重新生成 |
| H5 favicon | 从 App 图标或 brand glyph 派生 | 保持品牌一致 |
| 小程序 icon fallback | 从 App 图标或 brand glyph 派生 PNG | 需要按平台资源路径输出 |
| Web manifest icons | 从 App 图标派生 192/512 | PWA/H5 标准尺寸 |
| 深浅色 icon 变体 | 优先 CSS 背景和 mask 处理 | 避免维护多套位图 |

## 不建议补充为图片的元素

| 元素 | 推荐实现 |
| --- | --- |
| 返回、关闭、菜单、设置 | lucide 或组件库图标 |
| 复制、收藏、删除、分享 | lucide 或组件库图标 |
| 筛选、排序、重生成 | lucide 或组件库图标 |
| score bars、chips、segmented control | CSS / Vue 组件 |
| 候选卡片、底部 sheet、设置列表 | CSS / Vue 组件 |
| 名称、评分、tagline、免责声明 | 真实文本渲染 |

## 建议补充时机

暂时不需要继续生成新图片。进入 App 工程实现后，如果出现下面情况，再单独生成对应素材：

1. 需要一张 App Store / 小程序商店封面图。
2. 需要一套真实 PNG 海报模板背景。
3. 需要深色主题专用品牌背景。
4. 用户验证后明确认为当前空状态或品牌图标风格不合适。
