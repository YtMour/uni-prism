# DiceForge 图标素材

本目录存放 DiceForge App 图标和界面图标素材。界面图标按“一张一张生成”的方式产出，避免多图标拼图后期裁切困难。

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `app-icon.png` | App 主图标，完整方形不透明 PNG |
| `source/` | 纯色背景源图，用于保留生成原始版本 |
| `transparent/` | 已去背景的透明 PNG，用于界面实现 |

## App 图标

| 文件 | 用途 |
| --- | --- |
| `app-icon.png` | 应用图标、启动图标、商店图标基础素材 |

## 透明界面图标

| 文件 | 用途 |
| --- | --- |
| `transparent/icon-d20.png` | Generate、seed、空状态、D20 标识 |
| `transparent/icon-reroll.png` | Reroll / Whole character |
| `transparent/icon-story.png` | Story / Story only |
| `transparent/icon-copy.png` | Copy / Copy Text |
| `transparent/icon-export.png` | Export |
| `transparent/icon-settings.png` | Settings |
| `transparent/icon-save-poster.png` | Deprecated，真实 PNG 保存接入前不用于 MVP UI |
| `transparent/icon-back.png` | 返回 |
| `transparent/icon-search.png` | 搜索 |
| `transparent/icon-trash.png` | 清空最近角色 |
| `transparent/icon-check.png` | Copied / 完成状态 |
| `transparent/icon-stats.png` | Stats only / 属性 |
| `transparent/icon-gear.png` | Gear / 装备 |
| `transparent/icon-proficiency.png` | Proficiencies / 熟练项 |
| `transparent/icon-poster.png` | Poster / 图片预览 |

当前 MVP 只提供海报预览和文本复制，海报预览使用 `icon-poster.png`，复制操作使用 `icon-copy.png`。

## 生成与处理说明

- 图标使用内置 `imagegen` 逐张生成。
- 除 `app-icon.png` 外，界面图标源图都使用洋红色 chroma-key 背景。
- 透明图使用 `remove_chroma_key.py` 本地去底生成。
- 已检查 `transparent/` 目录下图标均为 RGBA。
- 图标尺寸当前为 `1254 x 1254`，实际接入时可按平台需要缩放到 24、32、48、96、512 等规格。

## 实现建议

- 常规按钮优先使用 `transparent/` 中的透明 PNG。
- 若后续需要更小包体或动态改色，可基于这些图标重绘 SVG。
- `source/` 目录不要直接用于 App UI，它保留的是带 chroma-key 背景的源图。
