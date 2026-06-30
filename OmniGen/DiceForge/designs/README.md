# DiceForge Mobile V2 界面设计图

本目录是 DiceForge 当前的手机端页面设计基准。它修正了上一版混入桌面/大屏工作台的问题，所有页面都按同一套手机 App 功能流生成。

## 页面清单

| 文件 | 页面 | 功能重点 |
| --- | --- | --- |
| `01-home-empty.png` | 首页空状态 | D20 生成入口、最近角色空状态、设置入口 |
| `02-generating.png` | 生成中状态 | D20 动效、生成步骤反馈、最近区域保留 |
| `03-character-card-main.png` | 角色卡主视图 | 角色身份、seed、重掷、故事、复制、导出、六项属性 |
| `04-character-card-details.png` | 角色卡详情续页 | 熟练项、装备、背景故事、底部操作 |
| `05-reroll-sheet.png` | 重掷面板 | 整体重掷、只重写故事、只重掷属性、保留 seed |
| `06-export-text.png` | 文本导出 | 纯文本预览、复制文本、切换海报预览 |
| `07-export-poster-preview.png` | 海报预览 | App 内海报预览、复制文本、返回文本导出、包含 seed |
| `08-recent-characters.png` | 最近角色列表 | 本地最近角色、搜索、清空、生成新角色 |

## 使用原则

- 后续 UI 实现以本目录为手机端优先参考。
- 这些图是页面结构和交互层级参考，不是宣传图。
- 图片中的角色数值、装备和文案可能因生成模型产生轻微不一致，真实实现必须以生成器数据模型为准。
- 旧目录中的 `desktop-generator-workbench.png` 不再作为当前手机端 MVP 的实现基准。

## 功能一致性

新版页面统一围绕同一条流程：

```text
首页 -> 生成中 -> 角色卡 -> 重掷/复制/导出 -> 文本导出/海报预览 -> 最近角色
```

保留的核心操作：

- Generate
- Reroll
- Story
- Copy
- Export
- Copy Text
- Preview Poster
- Generate New

说明：设计图中的早期 `Save Poster` 文案不再作为 MVP 发布承诺。当前 MVP 保留海报预览，真实 PNG 保存移入后续增强。
