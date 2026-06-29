# MythosGen Design Asset Index

更新时间：2026-06-26

本索引用于连接设计参考图、透明素材和 `FantasyNameGenerator-Uniapp` 初版实现。设计图仍保留在 `design/` 下作为 source of truth；进入 App 的运行时素材复制到 `FantasyNameGenerator-Uniapp/static/mythos/`。

## 设计参考图

| 文件 | 当前用途 | 实现状态 |
| --- | --- | --- |
| `imagen/home-generation.png` | 首页生成界面主参考 | 已用于单页生成体验的信息层级 |
| `imagen/filters-sheet-v2.png` | 过滤器底部抽屉参考 | 已用于 Mythos Filters sheet |
| `imagen/inspiration-pocket.png` | 收藏口袋列表参考 | 已用于 Inspiration Pocket sheet |
| `imagen/export-card.png` | 海报导出预览参考 | 已用于 Export Card 预览骨架 |
| `imagen/app-icon.png` | App 图标方向 | 尚未替换 manifest 图标 |
| `imagen/filters-sheet.png` | 旧版过滤器草稿 | 仅归档，不作为实现依据 |

## 运行时素材

| 设计源文件 | App 静态路径 | 当前用途 |
| --- | --- | --- |
| `assets/transparent/compass-star.png` | `FantasyNameGenerator-Uniapp/static/mythos/compass-star.png` | Dragon realm 徽记 |
| `assets/transparent/elven-leaf-crest.png` | `FantasyNameGenerator-Uniapp/static/mythos/elven-leaf-crest.png` | Elf realm 徽记 |
| `assets/transparent/open-book.png` | `FantasyNameGenerator-Uniapp/static/mythos/open-book.png` | Magic realm 与收藏空状态 |
| `assets/transparent/star-divider.png` | `FantasyNameGenerator-Uniapp/static/mythos/star-divider.png` | 结果 metadata 分隔 |
| `assets/transparent/corner-frame.png` | `FantasyNameGenerator-Uniapp/static/mythos/corner-frame.png` | 导出卡片角框 |
| `assets/texture/parchment-subtle.png` | `FantasyNameGenerator-Uniapp/static/mythos/parchment-subtle.png` | 生成画布羊皮纸纹理 |

## 初版实现说明

- 首页不使用设计图作为整张背景，按 `MYTHOSGEN_DESIGN_SYSTEM.md` 拆成可交互组件。
- 当前导出为预览骨架与复制入口，尚未生成真实图片文件。
- 后续若压缩素材，应保持透明素材命名和 `static/mythos/` 引用稳定。
- 当前首页顶部和 Realm 控件优先使用稳定文本符号，原因是部分透明素材自带大面积留白，在小尺寸 UI 中会显得过小；后续可通过重新裁切透明素材替换符号。
