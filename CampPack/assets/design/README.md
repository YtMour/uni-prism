# CampPack Design Assets

本目录保存基于 `docs/DESIGN_SYSTEM.md` 生成的首批视觉探索图。生成方式为 Codex 内置 imagegen 工具，不依赖本地 `OPENAI_API_KEY`。

## 页面级设计稿

`screens/` 目录中的图片是后续 App 实现的主要视觉参考。

| 文件 | 页面 | 实现用途 |
| --- | --- | --- |
| `screens/01-lists-home.png` | 清单首页 | 首页信息架构、列表卡片、底部导航、创建入口 |
| `screens/02-template-library.png` | 模板库 | 搜索、筛选 chips、模板卡片、导入按钮 |
| `screens/03-checklist-pack.png` | Pack 清单详情 | 三阶段分段控件、摘要卡、分类折叠、装备条目 |
| `screens/04-checklist-leave.png` | Leave 清单详情 | 撤营状态、缺失提醒、Reset Leave、完成按钮 |
| `screens/05-gear-editor.png` | 装备编辑 | 表单字段、数量步进器、单位切换、删除 / 保存操作 |
| `screens/06-settings.png` | 设置页 | 设置分组、单位 / 语言 / 触觉反馈、数据导入导出 |

## 图标素材

`icons/` 目录保存逐个生成的 App 图标和应用内素材图标。每个图标都是单独生成的 PNG，不是从图标合集里裁切出来的。

## 旧探索图

| 文件 | 用途 | 备注 |
| --- | --- | --- |
| `camppack-ui-concept.png` | 初版 App 效果探索 | 可参考整体气质，但实现优先看 `screens/` |
| `camppack-store-hero.png` | 商店宣传 / 营销图 | 不作为 App 页面实现依据 |
| `camppack-app-icon-concept.png` | App 图标概念 | 清单纸张、帐篷、山线和勾选符号组合，适合作为首版图标方向 |

## 实现约束

- 主色保持温暖纸张色、苔藓绿、黑曜石和少量陶土色。
- App 内真实 UI 优先参考 `screens/` 的页面级设计稿。
- 设计稿中的文字作为信息架构参考，真实文案以代码和 i18n 文件为准。
- 页面实现时应保留 44px 以上触控目标，避免按生成图机械复刻过大的字号。
- 图标可用 lucide / 自绘 SVG 替代，保持线性、克制、可读即可。
- 图标后续落地时建议重绘为 SVG / Figma 矢量版本，再导出 App Store 和 Android 所需尺寸。
