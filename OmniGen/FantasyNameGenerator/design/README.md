# MythosGen Design Assets

本目录保存 MythosGen App 的设计参考图。它们用于后续实现页面结构、组件层级、色彩和视觉风格，不是宣传图。

## Imagen Outputs

| 文件 | 用途 | 实现备注 |
| --- | --- | --- |
| [imagen/home-generation.png](imagen/home-generation.png) | 首页生成界面 | 推荐作为首页布局主参考：顶部品牌栏、中央结果、底部 Realm 与操作区 |
| [imagen/filters-sheet-v2.png](imagen/filters-sheet-v2.png) | 过滤器底部抽屉 | 推荐作为过滤器实现参考，保持浅色生成页背景和底部抽屉结构 |
| [imagen/inspiration-pocket.png](imagen/inspiration-pocket.png) | 收藏口袋列表 | 推荐参考列表密度、复制/删除操作和批量导出底栏 |
| [imagen/export-card.png](imagen/export-card.png) | 海报导出预览页 | 推荐参考 4:5 卡片预览、样式选择、格式选择和保存按钮 |
| [imagen/app-icon.png](imagen/app-icon.png) | App 图标方向 | 推荐参考书本、星盘、抽象 M 的核心符号组合 |
| [imagen/filters-sheet.png](imagen/filters-sheet.png) | 旧版过滤器草稿 | 背景偏离设计系统，仅保留作生成过程参考，不建议实现 |

## Generated UI Assets

这些素材按“一张图一个素材”生成，避免后续抠图、裁切或复用时互相干扰。

| 文件 | 用途 |
| --- | --- |
| [assets/transparent/compass-star.png](assets/transparent/compass-star.png) | 顶部品牌符号、空状态或卡片星盘装饰 |
| [assets/transparent/elven-leaf-crest.png](assets/transparent/elven-leaf-crest.png) | 首页生成结果上方的精灵/叶形纹章 |
| [assets/transparent/open-book.png](assets/transparent/open-book.png) | 图鉴、收藏入口或资料库按钮图标 |
| [assets/transparent/star-divider.png](assets/transparent/star-divider.png) | 名字与 metadata 之间的细分隔装饰 |
| [assets/transparent/corner-frame.png](assets/transparent/corner-frame.png) | 导出卡片四角边框，可旋转/镜像复用 |
| [assets/texture/parchment-subtle.png](assets/texture/parchment-subtle.png) | 页面和导出卡片的轻微羊皮纸背景纹理 |

`assets/source/` 保存的是纯色背景抠图源文件；App 实现时优先使用 `assets/transparent/` 和 `assets/texture/`。

## Implementation Notes

- UI 实现优先遵守 `docs/MYTHOSGEN_DESIGN_SYSTEM.md`，图片是视觉参考，不是像素级规范。
- 颜色以文档中的 token 为准：`#FBF9F5`、`#17151D`、`#1C1A27`、`#E7E1D8`、`#B88A44`、`#7E2E35`。
- 页面需要可交互、可适配移动端，不应把设计图直接当作静态背景。
- 首页第一屏应直接进入生成体验，不做宣传页。
